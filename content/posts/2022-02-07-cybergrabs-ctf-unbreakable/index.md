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

Applying geometric series expansion, $1 + e_2 + e_2^2 = 2^{x + 1} - 1$. We can
rearrange this via the quadratic equation to $e_2 = \frac{-1 \pm \sqrt{1 - 4
(2 - 2^{x + 1})}}{2}$. Trying out a few values we see that only $\boxed{x = 4}$
and $\boxed{e_2 = 5}$ gives us a value that make $e_2$ prime.

## Finding $p$ and $q$

We're not actually given $p$ or $q$, but we are given $ip = p^{-1} \mod q$ and
$iq = q^{-1} \mod p$. In order words:

$$\begin{aligned}
  p \times ip &\equiv 1 \mod q \\\
  q \times iq &\equiv 1 \mod p
\end{aligned}$$

We can rewrite these equations without the mod by introducing variables $k_1$
and $k_2$ to be arbitrary constants that we solve for later:

$$\begin{aligned}
  p \times ip &= 1 + k_1q \\\
  q \times iq &= 1 + k_2p
\end{aligned}$$

We'll be trying to use these formulas to create a quadratic that we can use to
eliminate $k_1$ and $k_2$. Multiplying these together gives:

$$\begin{aligned}
  (p \times ip)(q \times iq) &= (1 + k_1q)(1 + k_2p) \\\
  pq \times ip \times iq &= 1 + k_1q + k_2p + k_1k_2pq
\end{aligned}$$

I grouped $p$ and $q$ together here because it's important to note that since we
have $x$, we know $r$ and thus $pq = \frac{N}{r}$. This means that for purposes
of solving the equation, $pq$ is a constant to us. This actually introduces an
interesting structure on the right hand side, we can create 2 new variables:

$$\begin{aligned}
  \alpha &= k_1q \\\
  \beta &= k_2p
\end{aligned}$$

Substituting this into our equation above we get:

$$\begin{aligned}
  pq \times ip \times iq &= 1 + \alpha + \beta + \alpha\beta
\end{aligned}$$

Recall from whatever algebra class you last took that $(x - x_0)(x - x_1) = x^2
\- (x_0 + x_1)x + x_0x_1$. Since we have both $\alpha\beta$ and $(\alpha +
\beta)$ in our equation, we can try to look for a way to isolate them in order
to create our goal.

$$\begin{aligned}
  pq \times ip \times iq &= 1 + k_1q + k_2p + k_1k_2pq \\\
  k_1k_2pq &= pq \times ip \times iq - 1 - k_1q - k_2p \\\
  k_1k_2 &= ip \times iq - \frac{1}{pq} - \frac{k_1}{p} - \frac{k_2}{q}
\end{aligned}$$

$\frac{1}{pq}$ is basically $0$, and since $k_1$ and $k_2$ are both smaller than
$p$ or $q$, then we'll approximate this using $k_1k_2 = ip \times iq - 1$. Now
that $k_1k_2$ has become a constant, we can create the coefficients we need:

$$\begin{aligned}
  \alpha + \beta &= pq \times ip \times iq - 1 - k_1k_2pq \\\
  \alpha\beta &= k_1k_2pq
\end{aligned}$$

$$\begin{aligned}
  (x - \alpha)(x - \beta) &= 0 \\\
  x^2 - (\alpha + \beta)x + \alpha\beta &= 0 \\\
  x &= \frac{(\alpha+\beta) \pm \sqrt{(\alpha+\beta)^2 - 4\alpha\beta}}{2}
\end{aligned}$$

Putting this into Python, looks like:

```py
>>> k1k2 = ip * iq - 1
>>> alpha_times_beta = k1k2 * pq
>>> alpha_plus_beta = pq * ip * iq - 1 - k1k2 * pq

>>> def quadratic(b, c):
>>>   disc = b ** 2 - 4 * c
>>>   return (-b + sqrt(disc)) / 2, (-b - sqrt(disc)) / 2
```

I'd like to thank @10, @sahuang, and @thebishop in the Project Sekai discord for
doing a lot of the heavy-lifting to solve this challenge.

[Rabin]: https://en.wikipedia.org/wiki/Rabin_cryptosystem
