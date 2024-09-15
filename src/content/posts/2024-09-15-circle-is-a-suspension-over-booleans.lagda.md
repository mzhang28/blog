---
title: The circle is a suspension over booleans
slug: 2024-09-15-circle-is-a-suspension-over-booleans
date: 2024-09-15T23:02:32.058Z
tags: [algebraic-topology, hott]
draft: true
---

```
{-# OPTIONS --cubical #-}
open import Cubical.Foundations.Prelude
open import Data.Nat
open import Data.Bool
```

One of the simpler yet still very interesting space in algebraic topology is the **circle**.
Analytically, a circle can described as the set of all points that satisfy:

$$
x^2 + y^2 = 1
$$

Well, there are a lot more circles, like $x^2 + y^2 = 2$, and so on, but in topology land we don't really care.
All of them are equivalent up to continuous deformation.

What is interesting, though, is the fact that it can _not_ be deformed down to a single point at the origin.
It has the giant hole in the middle.

The circle, usually denoted $S^1$, is a special case of $n$-spheres.
For some dimension $n \in \mathbb{N}$, the $n$-sphere can be defined analytically as:

$$
\lVert \bm{x} \rVert_2 = \bm{1}
$$

where $\lVert \bm{x} \rVert_2$ is the [Euclidean norm][1] of a point $\bm{x}$.

[1]: https://en.wikipedia.org/wiki/Norm_(mathematics)

However, in the synthetic world, circles look a lot different.
We ditch the coordinate system and boil the circle down to its core components in terms of points and paths.
The 1-sphere $S^1$ is defined with:

$$
\begin{align*}
  \mathsf{base} &: S^1 \\
  \mathsf{loop} &: \mathsf{base} \equiv \mathsf{base}
\end{align*}
$$

What about the 2-sphere, aka what we normally think of as a sphere?
We can technically define it as a 2-path over the base point:

$$
\begin{align*}
  \mathsf{base} &: S^2 \\
  \mathsf{surf} &: \mathsf{refl}_\mathsf{base} \equiv_{\mathsf{base} \equiv \mathsf{base}} \mathsf{refl}_\mathsf{base}
\end{align*}
$$

It would be nice to have an iterative definition of spheres; one that doesn't rely on us using our intuition to form new ones.
Ideally, it would be a function $S^n : \mathbb{N} \rightarrow \mathcal{U}$, where we could plug in an $n$ of our choosing.

```
S_ : ℕ → Type
```

For an iterative definition, we'd like some kind of base case.
What's the base case of spheres?
What is a $0$-sphere?

If we take our original analytic definition of spheres and plug in $0$, we find out that this is just $| x | = 1$, which has two solutions: $-1$ and $1$.
The space of solutions is just a space with two elements!
In other words, the type of booleans is actually the $0$-sphere, $S^0$.

```
S zero = Bool
```

How about the iterative case? How can we take an $n$-sphere and get an $(n+1)$-sphere?

```
S (suc n) = Bool
```
