+++
title = "The Cyber Grabs CTF: Unbr34k4bl3 (942)"
draft = true
date = 2022-02-02
tags = ["ctf", "crypto"]
languages = ["python"]
layout = "single"
math = true
+++

Crypto challenge Unbr34k4bl3 from the Cyber Grabs CTF.
<!--more-->

> No one can break my rsa encryption, prove me wrong !!
>
> Flag Format: cybergrabs{}
>
> Author: Mritunjya
>
> [output.txt] [source.py]

[output.txt]: ./output.txt
[source.py]: ./source.py

Looking at the source code, this challenge looks like a typical RSA challenge at
first, but there are some important differences to note:

- $N = pqr$ (line 34). This is a twist but RSA strategies can easily be
    extended to 3 prime components.
- $p, q \equiv 3 \mod 4$ (line 19). This suggests that the cryptosystem is
    actually a [Rabin cryptosystem][Rabin].
- We're not given the public keys $e_1$ and $e_2$, but they are related through
    $x$.

[Rabin]: https://en.wikipedia.org/wiki/Rabin_cryptosystem

## Finding $e_1$ and $e_2$

We know that $e_1$ and $e_2$ are related through $x$, which is some even number
greater than 2, but we're not given any of their real values. We're also given
through an oddly-named `functor` function that:

$$
\begin{aligned}
  1 + e_1 + e_1^2 + \cdots + e_1^x &= 1 + e_2 + e_2^2 \\\
  \frac{1 - e_1^x}{1 - e_1} &= 1 + e_2 + e_2^2
\end{aligned}
$$

Interestingly enough, since $e_1$ and $e_2$ are primes, that means

I'd like to thank @10, @sahuang, and @thebishop in the Project Sekai discord for
their help throughout this challenge.
