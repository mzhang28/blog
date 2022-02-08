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

## Finding $e_1$ and $e_2$

We know that $e_1$ and $e_2$ are related through $x$, which is some even number
greater than 2, but we're not given any of their real values. We're also given
through an oddly-named `functor` function that:

$$ 1 + e_1 + e_1^2 + \cdots + e_1^x = 1 + e_2 + e_2^2 $$

Taking the entire equation $\mod e_1$ gives us:

$$\begin{aligned}
1 &\equiv 1 + e_2 + e_2^2 \mod e_1 \\\
0 &\equiv e_2 + e_2^2 \\\
0 &\equiv e_2(1 + e_2)
\end{aligned}$$

This means there are two possibilities: either $e_1 = e_2$ or $e_1$ is even
(since we know $e_2$ is a prime). The first case isn't possible, because with $x
\> 2$, the geometric series equation would not be satisfied. So it must be true
that $\boxed{e_1 = 2}$, the only even prime.

Applying geometric series expansion, $1 + e_2 + e_2^2 = 2^x - 1$.

I'd like to thank @10, @sahuang, and @thebishop in the Project Sekai discord for
doing a lot of the heavy-lifting to solve this challenge.

[Rabin]: https://en.wikipedia.org/wiki/Rabin_cryptosystem
