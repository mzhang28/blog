+++
title = "Learn by Implementing Elliptic Curve Crypto"
date = 2022-03-03
tags = ["crypto", "learn-by-implementing"]
draft = true
math = true
toc = true
+++

Good places to start (in terms of usefulness):

- [A relatively easy to understand primer on elliptic curve cryptography][2] by Cloudflare
- [Elliptic-curve cryptography][3] from Practical Cryptography
- [Elliptic-curve cryptography][1] on Wikipedia

[1]: https://en.wikipedia.org/wiki/Elliptic-curve_cryptography
[2]: https://blog.cloudflare.com/a-relatively-easy-to-understand-primer-on-elliptic-curve-cryptography/
[3]: https://cryptobook.nakov.com/asymmetric-key-ciphers/elliptic-curve-cryptography-ecc

I'm writing this post because there's a lot of good posts out there introducing
the elliptic curve formula, but not many that continue with getting from there
to actually encrypting and decrypting messages. Maybe this is a good thing for
discouraging people from writing insecure ECC implementations and using them in
production, but it's not great for understanding the algorithm.

> **DISCLAIMER:** I'm not a cryptographer! This is not a cryptographically
> secure implementation, only used to demonstrate how the algorithm works. Read
> [the SafeCurves intro][4] for some of the attacks a custom ECC implementation
> may overlook.

[4]: https://safecurves.cr.yp.to/index.html

## Basic Ideas

ECC starts with the idea that starting with an elliptic curve formula like $y^2
= x^3 + ax + b$ that operates over a finite field $\mathbb{F}_p$, and defining a
_custom_ addition operation over two points, you can form a cyclic structure
where adding a point to itself some number of times gets you back where you
started.

The interesting thing about this cyclic structure is that given the starting
point $G$, also called the **generator** and some number $n$, you can find the
$n$th element of that cycle $n \times G$ really quickly (in $\log(n)$ time). But
if you're only given $G$ and $n \times G$, you can't figure out what $n$ is
unless you brute force every possible number $n$ could be.

What cryptographers have done is develop several sets of curve parameters that
are publicly known, that include $a$, $b$, and the generator point $G$. Then
users of the curve will just pick some $n$ and publish $n \times G$, and because
of the difficulty of the elliptic curve discrete logarithm problem, $n$ will
remain secret.

There's some constraints on the properties of the curve parameters and $G$, but
I won't go too far into that here since the proven curves have satisfies all
those constraints.

Once we have the curve and a keypair, there's all sorts of different
cryptographic schemes that we can now build on top of these foundations:

- Encryption
- Signatures
- Diffie Hellman

## Implementation

I'll be implementing this using [Go]. I chose it for the ability to define
methods out of order and independently of their associated structs, as well as
their built-in big-integers library. This is required for compiling the Go
module:

[Go]: https://go.dev/
[Markout]: https://git.mzhang.io/michael/markout

```go
package elliptic
import (
  "math/big"
)
```

> You can run this blog post using [Markout]:
> ```
> markout -l go content/posts/2022-03-03-learn-by-implementing-elliptic-curve-crypto.md > /tmp/ecc.go
> go run /tmp/ecc.go
> ```

### Math primitives

```go
type CurveParams struct {
  P *big.Int
}


```

## Cryptographic applications

These are some of the cryptographic primitives you can build over the above
implementation.

### Encryption

### Signatures

### Key exchange
