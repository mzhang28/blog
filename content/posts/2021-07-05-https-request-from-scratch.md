+++
title = "sending https requests from scratch"
date = 2021-07-05
draft = true
toc = true

[taxonomies]
tags = ["computers", "web", "python"]
+++

The web is [so complicated][4] these days, I began wondering exactly how big of a feat it would be to formally verify everything. At this point I realized all I knew about web protocols were from fiddling around with HTTP 1.0 requests from doing CTFs in the past. You'd pop open a socket to wherever you wanted, stick `GET` and then whatever path you wanted, and then add a version number at the end.

The modern web's changed significantly since those days, so I thought it would be an interesting undertaking to see exactly how much it would take to send an HTTPS request from scratch, just like what the browser does, using as little as I can.

> **Disclaimer:** Don't use this code for any real software.

I'll be using Python for this since it's just for fun, the code will be pretty concise, and I don't have to write boilerplate outside of this post in order to make the code in it work. I'll try to stick to only using the Python 3 standard library as well, so not bringing in any external cryptography algorithms (the standard library provides `hashlib` tho). The downside here is the struct serialization and deserialization (using the [Python struct library][5]) gets a bit messy if you don't know how it works, but that information is all in the RFC anyway.

**This is a literate document.** I wrote a [small utility][3] to extract the code blocks out of markdown files, and it should produce working example for this file. If you have the utility, then running the following should get you a copy of all the Python code extracted from this blog post:

```bash
markout -l py <(curl -s https://git.mzhang.io/michael/blog/raw/branch/master/content/posts/2021-07-05-https-request-from-scratch.md)
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
- signature_algorithms_cert (required)
- supported_groups (required)
- key_share (required)
- server_name (required)
- application_layer_protocol_negotiation

What this means for our implementation is that for each of these we'll have to send a bit of information in the `ClientHello`. That's not too big of a deal; let's go through them one-by-one.

(Before I start, I have to warn you; there are a LOT of length-wrappers. Most of these seem unnecessary since we're using Python, but I expect these were designed with generalization in mind)

```py
import struct
def client_hello_extensions(hostname: str):
    data = bytes()
    # ...continued below
```

Supported versions is just what TLS 1.3 replaced the version header with; rather than saying up front that I want TLS 1.2, we have a general TLS framework for specifying extensions and then if I want to let the server know I can speak both TLS 1.2 and TLS 1.3, I'd put both versions into this extension.

```py
    # ...continued from above
    versions = [b"\x03\x04"] # code number for TLS 1.3
    versions = b"".join(map(lambda p: struct.pack(">B", len(p)) + p, versions))
    data += struct.pack(">H", 43) # code number for supported_versions
    data += struct.pack(">H", len(versions)) + versions
    # ...continued below
```

In TLS, clients have a pre-defined set of root authorities that it trusts, distributed by some trusted party like the OS or browser developers. These root authorities can then sign certificates for individual sites to prove to clients that they hold ownership over that domain. Clients can verify this proof cryptographically, using one of the signature algorithms we're going to to negotiate.

For this I looked at some of the ciphers my browser supports, and just picked one that seems to have wide support: rsa_pkcs1_sha256.

```py
    # ...continued from above
    algos = [b"\x04\x01"] # rsa_pkcs1_sha256
    sig_algos = b"".join(algos)
    data += struct.pack(">H", 13) # code number for signature_algorithms
    ext = struct.pack(">H", len(sig_algos)) + sig_algos
    data += struct.pack(">H", len(ext)) + ext # yeah...
    # ...continued below
```

Server name just lets the client tell the server what hostname it's expecting to connect to. The actual struct definitions here seem a bit over-the-top, but it's all in the name of future-proofing, right...?

```py
    # ...continued from above
    sname = b"\x00" # code for hostname
    sname += struct.pack(">H", len(hostname)) # length of hostname
    sname += hostname.encode("utf-8")
    data += struct.pack(">H", 0) # code number for server_name
    ext = struct.pack(">H", len(sname)) + sname
    data += struct.pack(">H", len(ext)) + ext # yeah...
    # ...continued below
```

Application layer protocol negotiation (ALPN) isn't technically required, but we'll put it there to force the server to send us HTTP2. The extension contents are just the list of names concatenated together.

```py
    # ...continued from above
    protocols = [b"h2"] # http2, could also add http/1.1
    alpn = b"".join(map(lambda p: struct.pack(">B", len(p)) + p, protocols))
    data += struct.pack(">H", 16) # code number for alpn
    ext = struct.pack(">H", len(alpn)) + alpn
    data += struct.pack(">H", len(ext)) + ext # yeah...
    # ...continued below
```

Finally, finish off the function from above (remember, this is a code document that can run!).

```py
    return data # end of client_hello_extensions
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
    hostname = "caniuse.com"
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.connect((hostname, 443))

    # send client hello
    ch = wrap_tls_record(22, wrap_handshake(1, client_hello(hostname)))
    s.send(ch)
    print(s.recv(1024))
test_client_hello()
```

If all went well, you should've received something with `\x16` as the first byte. That means the server sent a record with the content type `handshake(22)`. If you got `\x15`, it means you got an alert. In the next section we'll see how to interpret the server's response.

### Server Hello

### Key Exchange

### Done

## HTTP 2

## `request`-like API



## Conclusion

What did we learn? Don't do this shit yourself, it's not worth it. We'll probably be on HTTP3 within the next year. Just import `requests` and be done with it.

[1]: https://datatracker.ietf.org/doc/html/rfc3986
[2]: https://datatracker.ietf.org/doc/html/rfc8446
[3]: https://git.mzhang.io/michael/markout
[4]: https://drewdevault.com/2020/03/18/Reckless-limitless-scope.html
[5]: https://docs.python.org/3/library/struct.html
