+++
title = "sending an https request from scratch"
date = 2021-07-05
draft = true
toc = true

[taxonomies]
tags = ["computers", "web"]
+++

The web is [so complicated][4] these days, I began wondering exactly how big of a feat it would be to formally verify everything. At this point I realized all I knew about web protocols were from fiddling around with HTTP 1.0 request from doing CTFs in the past. You'd pop open a socket to wherever you wanted, stick `GET` and then whatever path you wanted, and then add a version number at the end.

The modern web's changed significantly since those days, so I thought it would be an interesting undertaking to see exactly how much it would take to send an HTTPS request from scratch, just like what the browser does, using as little as I can.

> **Disclaimer:** Don't use this code for any real software.

I'll be using Python for this since it's just for fun, the code will be pretty concise, and I don't have to write boilerplate outside of this post in order to make the code in it work. In fact, I wrote a [small utility][3] to extract the code blocks out of markdown files, and it should produce working example for this file.

Since we're imitating a browser, let's say we're going to connect to Wikipedia, by typing `wikipedia.org` in the address bar. First up, URL parsing.

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

> **Second disclaimer:** hope I made it clear above but **THIS IS A TOY PROGRAM**. If you're rolling your own crypto for a program people will be depending on (don't) then get it audited by a cryptographer or your code _will_ be broken.

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

Again, not too much code, just needs to be there. The annoying part of this is that the length is actually described with a `uint24`, which means it takes 3 bytes. Python's `struct` module doesn't actually have anything for this, so I'm just going to use the 4-byte unsigned option and chop off the last byte.

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

In reality, encryption is mostly done at the hardware level, so browsers choose this based on what algorithms your hardware is fastest at. I pointed Firefox at Wikipedia and peeked into the connection details and it looks like I'm using AES-256-GCM with SHA-384, so I'll go with that. Let's see what number we should be using to indicate that.

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

Ridiculously enough, it seems that TLS1.3 keeps a lot of pre-1.3 fields in there, renaming them `legacy_`, and then putting new features in extensions. This may help forward compatibility, but also means that some extensions end up not being extensions at all, but required components of the protocol. (I suppose this helps them phase out certain headers in later updates without changing the general layout)

The extensions we'll need to support are listed in section 9.2 of the RFC. We'll only be sending the ones required during a `ClientHello`:

- supported_versions (required)
- signature_algorithms (required)
- signature_algorithms_cert (required)
- supported_groups (required)
- key_share (required)
- server_name (required)

What this means for our implementation is that for each of these we'll have to send a bit of information in the `ClientHello`. That's not too big of a deal; let's go through them one-by-one.

```py
import struct
def client_hello_extensions():
    data = bytes()
    # ...continued below
```

Supported versions is just what TLS1.3 replaced the version header with; rather than saying up front that I want TLS 1.2, we have a general TLS framework for specifying extensions and then if I want to let the server know I can speak both TLS 1.2 and TLS 1.3, I'd put both versions into this extension.

```py
    # ...continued from above
    supported_versions = (b"\x02" # the length
        + b"\x03\x04") # TLS 1.3
    data += struct.pack(">H", len(supported_versions)) + supported_versions
    # ...continued below
```



## HTTP 2

## Conclusion

What did we learn? Don't do this shit yourself, it's not worth it.

[1]: https://datatracker.ietf.org/doc/html/rfc3986
[2]: https://datatracker.ietf.org/doc/html/rfc8446
[3]: https://git.mzhang.io/michael/markout
[4]: https://drewdevault.com/2020/03/18/Reckless-limitless-scope.html
