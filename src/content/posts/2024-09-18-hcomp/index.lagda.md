---
title: Examples of hcomp
slug: 2024-09-18-hcomp
date: 2024-09-18T04:07:13-05:00
tags: [hott, cubical]
draft: true
---

**hcomp** is a primitive operation in cubical type theory.

```
{-# OPTIONS --cubical --allow-unsolved-metas #-}
module 2024-09-18-hcomp.index where
open import Cubical.Foundations.Prelude hiding (isProp→isSet)
open import Cubical.Core.Primitives
```

Intuitively, hcomp can be understood as the composition operation.

```
path-comp : {A : Type} {x y z : A} → x ≡ y → y ≡ z → x ≡ z
path-comp {x = x} p q i =
  let u = λ j → λ where
    (i = i0) → x
    (i = i1) → q j
  in hcomp u (p i)
```

## Example: $\mathsf{isProp}(A) \rightarrow \mathsf{isSet}(A)$

Suppose we want to prove that all mere propositions (h-level 1) are sets (h-level 2).
This result exists in the cubical standard library, but let's go over it here.

```
isProp→isSet : {A : Type} → isProp A → isSet A
isProp→isSet {A} A-isProp = goal where
  goal : (x y : A) → (p q : x ≡ y) → p ≡ q
  goal x y p q j i = -- ...
```

Now let's construct an hcomp. In a set, we'd want paths $p$ and $q$ between the same points $x$ and $y$ to be equal.
Suppose $p$ and $q$ operate over the same dimension, $i$.
If we want to find a path between $p$ and $q$, we'll want another dimension.
Let's call this $j$.
So essentially, the final goal is a square with these boundaries:

![](./goal.jpg)

Our goal is to find out what completes this square.
Well, one way to complete a square is to treat it as the top face of a cube and use $\mathsf{hcomp}$.

* $i$ is the left-right dimension, the one that $p$ and $q$ work over
* $j$ is the dimension of our final path between $p \equiv q$.
  Note that this is the first argument, because our top-level ask was $p \equiv q$.
* Let's introduce a dimension $k$ for doing our $\mathsf{hcomp}$

![](./cubeextend.jpg)

We can map both $p(i)$ and $q(i)$ down to a square that has $x$ on all corners and $\mathsf{refl}_x$ on all sides.

Let's start with the left and right faces $(i = \{ \mathsf{i0} , \mathsf{i1} \})$.
These can be produced using the $\mathsf{isProp}(A)$ that we are given.
$\mathsf{isProp}(A)$ tells us that $x$ and $y$ are the same, so $x \equiv x$ and $x \equiv y$.
This means we can define the left face as $\mathsf{isProp}(A, x, x, k)$ and the right face as $\mathsf{isProp}(A, x, y, k)$.
(Remember, $k$ is the direction going from bottom to top)

![](./sides.jpg)

Since $k$ is only the bottom-to-top dimension, the front-to-back dimension isn't changing.
So we can use $\mathsf{refl}$ for those bottom edges.

The same logic applies to the front face $(j = \mathsf{i0})$ and back face $(j = \mathsf{i1})$.
We can use $\mathsf{isProp}$ to generate us some faces, except using $x$ and $p(i)$, or $x$ and $q(i)$ as the two endpoints.

![](./frontback.jpg)

This time, the $i$ dimension has the $\mathsf{refl}$ edges.
Since all the edges on the bottom face as $\mathsf{refl}$, we can just use the constant $\mathsf{refl}_{\mathsf{refl}_x}$ as the bottom face.
In cubical, this is the constant expression `x`.

Putting this all together, we can using $\mathsf{hcomp}$ to complete the top face $(k = \mathsf{i1})$ for us:

```
    let u = λ k → λ where
      (i = i0) → A-isProp x x k
      (i = i1) → A-isProp x y k
      (j = i0) → A-isProp x (p i) k
      (j = i1) → A-isProp x (q i) k
    in hcomp u x
```

Hooray! Agda is happy with this.

Let's move on to a more complicated example.

## Example: $\Sigma \mathbb{2} \rightarrow S^1$
