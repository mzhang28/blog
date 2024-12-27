---
title: "Sending https requests from scratch"
date: 2021-07-05
draft: true
toc: true
tags: ["computers", "web", "crypto"]
languages: ["python"]
---

Every now and then, I return to this age-old question of _exactly_ how hard would it be to write a web browser from scratch? I hear some interviewers ask their candidates to describe the process your browser takes to actually put a webpage on your screen, but no doubt that's a simplification of a process from 20 years ago. <!--more-->

Today, the specifications describing your browser's behavior [far exceeds 100 million words][4], and there's no sign of slowing. We are no longer just opening TCP sockets and sending `GET /path HTTP/1.0` anymore. That's why I decided to take some time and do some digging to see exactly how much it would take to send an HTTPS request from scratch, just like what the browser does, using as little existing tooling as I can.

> **Disclaimer:** This is a experiment for demonstration purposes. Do **NOT** use this code for any real software.

I'll be using Python for this since it's just for fun, the code will be pretty concise, and I don't have to write boilerplate outside of this post in order to make the code in it work. I'll try to stick to only using the Python 3 standard library as well, so not bringing in any external cryptography algorithms (the standard library provides `hashlib` tho). The downside here is the struct serialization and deserialization (using the [Python struct library][5]) gets a bit messy if you don't know how it works, but that information is all in the RFC anyway.

**&#x1f4a1; This is a literate document.** I wrote a [small utility][3] to extract the code blocks out of markdown files, and it should produce working example for this file. If you have the utility, then running the following should get you a copy of all the Python code extracted from this blog post:

```bash
curl -o https.md -s {{< docUrl >}}
markout -l py https.md > https.py
```

Otherwise, you can follow along and extract the code yourself as you read.

With that out of the way, let's jump in!

## URL Parsing

This part is basically just a chore. URLs are defined in [RFC 3986][1], but we'll cheat a bit and just get the important parts we want for sending a request. First, I'll write out a regex for actually matching the parts we want:

```py
import re
URL_PAT = re.compile(r"""
  (?P<scheme>[A-Za-z]+)       # scheme (http, https,...)
  ://                         # divider
  (?P<host>[A-Za-z\-\.]+)     # hostname
  (:(?P<port>[0-9]+))?        # port
  (/                          # divider
    (?P<path>[^?]*))?       # path
""", flags = re.VERBOSE)
```

We'll say if a string doesn't match this regex, then we won't count it as a URL. The rest of this part is just writing some glue code turning this regex into a dictionary:

```py
def parse_url(s: str):
  m = URL_PAT.match(s)
  if m is None: raise Exception("bad url")
  return m.groupdict()
u = parse_url("https://en.wikipedia.org")
# {'scheme': 'https', 'host': 'en.wikipedia.org', 'port': None, 'path': None}
```

## TLS

OK, now that we know where we're going to send the request, we should actually open a socket and talk to it. But before we want to send any data, we should _encrypt_ our communications. TLS is a protocol that conducts a brief handshake, then creates a tunnel where we can send data freely and it will be transparently encrypted before it goes over the wire. I haven't seen many example implementations of TLS out there (probably for a good reason), but without looking at actual code that works, it's hard to say I fully understand the protocol. So here I'll implement TLS 1.3 (defined in [RFC 8446][2]).

- Worth noting here that TLS uses big-endian format for numbers.

> **Second disclaimer:** hope I made it clear above but **THIS IS A TOY PROGRAM**. I'm about to roll my own crypto so do _not_ shove any of this code directly into a program if you value your safety. If you do plan on using this as a reference please get your code audited.

### Record Layer

TLS messages are sent in records, on top of TCP packets. This middle layer has its own header, described in section 5.1 of the RFC.

Not a big deal, it just means we'll want a helper function to actually send our packets through this record over the socket. The implementation is short, and looks pretty much exactly like the definition:

```py
import struct
def wrap_tls_record(ctype, rdata):
  data = bytes()
  data += struct.pack(">B", ctype) # content type encoded as a single byte
  data += b"\x03\x03" # legacy_record_version, should just be 0x0303
  data += struct.pack(">H", len(rdata)) # length of the data
  data += rdata # finally, the record data itself
  return data
```

### Handshake Layer

But before we can send the first message, we also have to write some glue code for the handshake layer! This layer describes all handshake messages, and can be found in appendix B.3 of the RFC.

Again, not too much code, just needs to be there. The annoying part of this is that the length is actually described with a `uint24`, which means it takes 3 bytes. Python's `struct` module doesn't actually have anything for this, so I'm just going to use the 4-byte unsigned option and chop off the first byte (remember, we are using big-endian encoding, so the MSB is the extra one).

```py
import struct
def wrap_handshake(htype, hdata):
  data = bytes()
  data += struct.pack(">B", htype) # handshake type encoded as a byte
  data += struct.pack(">I", len(hdata))[1:] # length, encoded as 3 bytes!
  data += hdata # and then the handshake data
  return data
```

### Client Hello

TLS starts with the client sending a `ClientHello` message (defined in section 4.1.2 of the RFC), which basically starts the handshake off with some basic details about what the client can do. Now's probably a good time to decide on some basics, like which ciphers we'll be using to communicate.

#### Cipher Suite

In reality, encryption is mostly done at the hardware level, so browsers choose this based on what algorithms your hardware is fastest at. I pointed Firefox at Wikipedia and peeked into the connection details and it looks like I'm using AES-256-GCM with SHA-384, so I'll go with that. Let's see what byte sequence corresponds to these ciphers.

```
This specification defines the following cipher suites for use with
TLS 1.3.

+------------------------------+-------------+
| Description                  | Value       |
+------------------------------+-------------+
| TLS_AES_128_GCM_SHA256       | {0x13,0x01} |
| TLS_AES_256_GCM_SHA384       | {0x13,0x02} | <-- this one
| TLS_CHACHA20_POLY1305_SHA256 | {0x13,0x03} |
| TLS_AES_128_CCM_SHA256       | {0x13,0x04} |
| TLS_AES_128_CCM_8_SHA256     | {0x13,0x05} |
+------------------------------+-------------+
```

Cool, this means the two numbers `0x13` and `0x02` correspond to the cipher suite we want to use.

#### Extensions

Ridiculously enough, it seems that TLS 1.3 keeps a lot of pre-1.3 fields in there, renaming them `legacy_`, and then putting new features in extensions. This may help forward compatibility, but also means that some extensions end up not being extensions at all, but required components of the protocol. (I suppose this helps them phase out certain headers in later updates without changing the general layout)

The extensions we'll need to support are listed in section 9.2 of the RFC. We'll only be sending the ones required during a `ClientHello`:

- supported_versions (required)
- signature_algorithms (required)
- key_share (required)
- server_name (required)
- application_layer_protocol_negotiation

What this means for our implementation is that for each of these we'll have to send a bit of information in the `ClientHello`. That's not too big of a deal; let's go through them one-by-one.

(Before I start, I have to warn you; there are a LOT of length-wrappers. Most of these seem unnecessary since we're using Python, but I expect these were designed with generalization in mind)

Supported versions is just what TLS 1.3 replaced the version header with; rather than saying up front that I want TLS 1.2, we have a general TLS framework for specifying extensions and then if I want to let the server know I can speak both TLS 1.2 and TLS 1.3, I'd put both versions into this extension.

```py
def ext_supported_versions():
  versions = [b"\x03\x04"] # code number for TLS 1.3
  versions = b"".join(map(lambda p: struct.pack(">B", len(p)) + p, versions))
  return (struct.pack(">H", 43) # code number for supported_versions
    + struct.pack(">H", len(versions))
    + versions)
```

In TLS, clients have a pre-defined set of root authorities that it trusts, distributed by some trusted party like the OS or browser developers. These root authorities can then sign certificates for individual sites to prove to clients that they hold ownership over that domain. Clients can verify this proof cryptographically, using one of the signature algorithms we're going to to negotiate.

For this I looked at some of the ciphers my browser supports, and just picked one that seems to have wide support: `ecdsa_secp256r1_sha256`.

```py
def ext_signature_algorithms():
  algos = [b"\x04\x03"] # ecdsa_secp256r1_sha256
  sig_algos = b"".join(algos)
  ext = struct.pack(">H", len(sig_algos)) + sig_algos # yeah...
  return (struct.pack(">H", 13) # code number for signature_algorithms
    + struct.pack(">H", len(ext))
    + ext)
```

Key negotiation is an important step, letting us establish a shared secret between the client and server without explicitly sending it over the network. Typically for this step, a form of Diffie-Hellman Exchange is performed, but pre-sharing a symmetric key is also used.

Here we'll need to step a bit into the crypto. I'm going to choose elliptical-curve Diffie-Hellman ephemeral (ECDHE), which uses the elliptical curve operation to obscure keys as opposed to the original Diffie-Hellman which uses modular exponentiation. Cloudflare's blog has a [good introduction to elliptical curves][6].

What this means for us is we need to pick parameters for initiating this exchange. First we'll pick a named group in the `supported_groups` extension, then we'll have to send the parameters for that particular group in the `key_share` extension. I'm going to pick secp256r1, the same algorithm as the one above, so I only need to implement one algorithm.

supported_groups:

```py
def ext_supported_groups():
  groups = [23] # secp256r1
  groups = b"".join(map(lambda g: struct.pack(">H", g), groups))
  ext = struct.pack(">H", len(groups)) + groups # yeah...
  return (struct.pack(">H", 10) # code number for alpn
    + struct.pack(">H", len(ext))
    + ext)
```

key_share:

```py
def ext_key_share():
  # hardcoding a fixed value here for now, we'll generate it later!
  import binascii
  x = b"\xf5\xddoi\xc8\x8c/#\x99\x8a\xaef\x8aWx\xacW,\xbad\x8d\x04\xac\x10\x05\xc2\x8f\x9bJ\x18\xf8."
  y = b"\xfc}\x7f\xe0\x89\xb2YF\x0b\xc6\xb7\x00@\x04\xf6\x17Vl)V+\x18\xae\x157:o\xcc\x91\xf9\xaa#"
  kex = b"\x04" + x + y
  key_share = struct.pack(">H", 23) + struct.pack(">H", len(kex)) + kex
  ext = struct.pack(">H", len(key_share)) + key_share
  return (struct.pack(">H", 51) # code number for alpn
    + struct.pack(">H", len(ext))
    + ext)
```

Server name just lets the client tell the server what hostname it's expecting to connect to. The actual struct definitions here seem a bit over-the-top, but it's all in the name of future-proofing, right...?

```py
def ext_server_name(hostname: str):
  sname = b"\x00" # code for hostname
  sname += struct.pack(">H", len(hostname)) # length of hostname
  sname += hostname.encode("utf-8")
  ext = struct.pack(">H", len(sname)) + sname # yeah...
  return (struct.pack(">H", 0) # code number for server_name
    + struct.pack(">H", len(ext))
    + ext)
```

Application layer protocol negotiation (ALPN) isn't technically required, but we'll put it there to force the server to send us HTTP2. The extension contents are just the list of names concatenated together.

```py
def ext_alpn():
  protocols = [b"h2"] # http2, could also add http/1.1
  alpn = b"".join(map(lambda p: struct.pack(">B", len(p)) + p, protocols))
  ext = struct.pack(">H", len(alpn)) + alpn # yeah...
  return (struct.pack(">H", 16) # code number for alpn
    + struct.pack(">H", len(ext))
    + ext)
```

Finally, let's combine all the functions above.

```py
def client_hello_extensions(hostname: str):
  return b"".join([
    ext_supported_versions(),
    ext_signature_algorithms(),
    ext_supported_groups(),
    ext_key_share(),
    ext_server_name(hostname),
    ext_alpn(),
  ])
```

Extensions is the last piece of information we need to create the entire `ClientHello` message. Soon we'll be able to get the server to respond to us!

#### Putting the ClientHello message together

```py
import os
def client_hello(hostname: str):
  data = bytes()
  data += struct.pack(">H", 0x0303) # legacy version
  data += os.urandom(32) # 32 bytes nonce generated from /dev/urandom
  data += b"\x00" # won't be using legacy_session_id, so send a zero
  data += (b"\x00\x02" # we are sending 2 cipher suites
      + b"\x13\x02") # the number for TLS_AES_256_GCM_SHA384
  data += b"\x01\x00" # legacy_compression_methods

  ext = client_hello_extensions(hostname)
  data += struct.pack(">H", len(ext))
  data += ext
  return data
```

Let's send something to a server and see if that's what we want!

```py
import socket
def test_client_hello():
  hostname = "en.wikipedia.org"
  s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
  s.connect((hostname, 443))

  # send client hello
  ch = wrap_tls_record(22, wrap_handshake(1, client_hello(hostname)))
  s.send(ch)
  return s.recv(1024)
server_response = test_client_hello()
# b'\x16\x03\x03...'
assert server_response[0] == 0x16
```

If all went well, you should've received something with `\x16` as the first byte. That means the server sent a record with the content type `handshake(22)`. If you got `\x15`, it means you got an alert. In the next section we'll see how to interpret the server's response.

### Server Hello

The server hello is the response, where it tells us which ciphers and algorithms it chose, out of the ones we suggested. The code will look backwards from what we did above; instead of encoding a bunch of values, we'll read from what the server gives to us and interpret it instead.

#### Change Cipher Spec

Along with the Server Hello we'll also get a Change Cipher Spec record. According to the RFC, this is only in there for compatibility purposes, so we can safely ignore the one sent to us, but we'll also have to send a dummy Change Cipher Spec record as well.

```py
def change_cipher_spec():
  return (b"\x14" # code number for change cipher spec
    + b"\x03\x03" # legacy protocol version
    + struct.pack(">H", 1) # length of change cipher spec message
    + b"\x01")
```

Piece of cake.

### Crypto

> This is the deep-dive into the cryptographic portions of the protocol. If you're not too interested by this part, just continue on to the HTTP section.

Let's walk through each of the ciphers and algorithms we're going to need one more time:

- `ecdsa_secp256r1_sha256`
  - ECDSA is the elliptical-curve signature algorithm; basically it can sign some information using the elliptical-curve private key, and anyone can verify using the corresponding public key that the person who owns the key has created that signature.
  - secp256r1 just gives the name of a set of established parameters for a curve.
  - SHA256 is a hashing algorithm, which creates a unique fingerprint of a piece of information that can't be reversed back to the original. Python's `hashlib` library provides this function for us, so we don't have to implement it ourselves.

#### Naive Elliptical Curve Implementation

#### secp256r1

The curve is defined using the equation `y^2 = x^3 + ax + b mod p`.

```py
# https://hyperelliptic.org/EFD/g1p/auto-shortw.html

```

```py
import secrets

def ecdsa_keypair():
  d = secrets.randbits(32)
  Q = secp256r1.mul(secp256r1.G, d)
  return (d, Q)

(d1, Q1) = ecdsa_keypair()
print("gen", d1, Q1)

def ecdsa_sign(d, z):
  while True:
    # generate a number k between 1 and n-1
    k = secrets.randbelow(secp256r1.n - 1)
    if k == 0: continue

    p = secp256r1.mul(secp256r1.G, k)
    r = p.x % secp256r1.n
    if r == 0: continue

    s = (pow(k, -1, secp256r1.n) * (z + r * d)) % secp256r1.n
    if s == 0: continue
    break
  return (r, s)

(r1, s1) = ecdsa_sign(d1, 12345)
print("sign", r1, s1)

def ecdsa_verify(r, s, Q, z):
  if not (r >= 1 and r < secp256r1.n and s >= 1 and s < secp256r1.n):
    return False
  sinv = pow(s, -1, secp256r1.n)
  u1 = (z * sinv) % secp256r1.n
  u2 = (r * sinv) % secp256r1.n
  p = secp256r1.add(secp256r1.mul(secp256r1.G, u1), secp256r1.mul(Q, u2))
  print(r)
  print(p.x % secp256r1.n)
  if r != p.x % secp256r1.n: return False
  return True

res = ecdsa_verify(r1, s1, Q1, 12345)
print("res", res)
```

### Encrypted tunnel

Now we should be ready to communicate with the server through our encrypted tunnel. But we forgot to keep around our key negotiation parameters! How will we encrypt our communication? Let's go back and update these functions to let us keep the parameters, using the crypto functions we just defined.

The key sharing function:

```py
def ext_key_share(Q):
  kex = b"\x04" + Q.x + Q.y
  key_share = struct.pack(">H", 23) + struct.pack(">H", len(kex)) + kex
  ext = struct.pack(">H", len(key_share)) + key_share
  return (struct.pack(">H", 51) # code number for alpn
    + struct.pack(">H", len(ext))
    + ext)
```

Finally, the new `client_hello_extensions`:

```py
def client_hello_extensions(hostname: str):
  d, Q = ecdsa_keypair()
  data = b"".join([
    ext_supported_versions(),
    ext_signature_algorithms(),
    ext_supported_groups(),
    ext_key_share(Q),
    ext_server_name(hostname),
    ext_alpn(),
  ])
  return (data, d, Q)
```

## HTTP 2

## `request`-like API

## Conclusion

What did we learn? Don't do this shit yourself, it's not worth it. We'll probably be on HTTP3 within the next year. Just import `requests` and be done with it.

[1]: https://datatracker.ietf.org/doc/html/rfc3986
[2]: https://datatracker.ietf.org/doc/html/rfc8446
[3]: https://git.mzhang.io/michael/markout
[4]: https://drewdevault.com/2020/03/18/Reckless-limitless-scope.html
[5]: https://docs.python.org/3/library/struct.html
[6]: https://blog.cloudflare.com/a-relatively-easy-to-understand-primer-on-elliptic-curve-cryptography/
[7]: https://datatracker.ietf.org/doc/html/rfc7748
