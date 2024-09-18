---
title: Visual examples of hcomp
slug: 2024-09-18-hcomp
date: 2024-09-18T04:07:13-05:00
tags: [hott, cubical]
draft: true
---

**hcomp** is a primitive operation in [cubical type theory][cchm] that completes the _lid_ of an incomplete cube, given the bottom face and some number of side faces.

[CCHM]: https://arxiv.org/abs/1611.02108

<details>
<summary>Imports</summary>

```
{-# OPTIONS --cubical --allow-unsolved-metas #-}
module 2024-09-18-hcomp.index where
open import Cubical.Foundations.Prelude hiding (isProp→isSet)
open import Cubical.Foundations.Equiv.Base
open import Cubical.Foundations.Isomorphism
open import Cubical.Core.Primitives
open import Cubical.HITs.Susp.Base
open import Cubical.HITs.S1.Base
open import Data.Bool.Base
```

</details>

## Two-dimensional case

In two dimensions, hcomp can be understood as the double-composition operation.
"Single" composition (between two paths rather than three) is typically implemented as a double composition with the left leg as $\mathsf{refl}$.
Without the double composition, this looks like:

```
path-comp : {A : Type} {x y z : A} → x ≡ y → y ≡ z → x ≡ z
path-comp {x = x} p q i =
  let u = λ j → λ where
    (i = i0) → x
    (i = i1) → q j
  in hcomp u (p i)
```

The `(i = i0)` case in this case is $\mathsf{refl}_x(j)$ which is definitionally equal to $x$.

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

Our goal is to fill this square in.
Well, what is a square but a missing face in a 3-dimensional cube?
Let's draw out what this cube looks like, and then have $\mathsf{hcomp}$ give us the top face.
Before getting started, let's familiarize ourselves with the dimensions we're working with:

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

## Example: $\Sigma \mathbb{2} \simeq S^1$

Suspensions are an example of a higher inductive type.
It can be shown that spheres can be iteratively defined in terms of suspensions.

Since the $0$-sphere is just two points (solutions to $\| \bm{x} \|_2 = 1$ in 1 dimension), we can show that a suspension over this is equivalent to the classic $1$-sphere, or the circle.

Let's state the lemma:

```
Σ2≃S¹ : Susp Bool ≃ S¹
```

Equivalences can be generated from isomorphisms:

```
Σ2≃S¹ = isoToEquiv (iso f g fg gf) where
```

In this model, we're going to define $f$ and $g$ by having both the north and south poles be squished into one side.
The choice of side is arbitrary, so I'll choose $\mathsf{true}$.
This way, $\mathsf{true}$ is suspended into the $\mathsf{refl}$ path, and $\mathsf{false}$ is suspended into the $\mathsf{loop}$.

<table style="width: 100%; border: none">
<tbody>
<tr style="vertical-align: top">

<td>

```
  f : Susp Bool → S¹
  f north = base
  f south = base
  f (merid true i) = base
  f (merid false i) = loop i
```

</td>

<td>

```
  g : S¹ → Susp Bool
  g base = north
  g (loop i) = (merid false ∙ sym (merid true)) i


```

</td>

</tr>
</tbody>
</table>

Now, the fun part is to show the isomorphisms.
Starting with the first, let's show $f(g(s)) \equiv s$.
The base case is easily handled by $\mathsf{refl}$.

```
  fg : (s : S¹) → f (g s) ≡ s
  fg base = refl
```

The loop case is trickier. Let's solve it algebraically first:

$$
\begin{align*}
\mathsf{ap}_f(\mathsf{ap}_g(\mathsf{loop})) &\equiv \mathsf{loop} \\
\mathsf{ap}_f(\mathsf{merid} \; \mathsf{false} \cdot (\mathsf{merid} \; \mathsf{true})^{-1}) &\equiv \mathsf{loop} \\
\mathsf{ap}_f(\mathsf{merid} \; \mathsf{false}) \cdot \mathsf{ap}_f (\mathsf{merid} \; \mathsf{true})^{-1} &\equiv \mathsf{loop} \\
\mathsf{loop} \cdot \mathsf{ap}_f (\mathsf{merid} \; \mathsf{true})^{-1} &\equiv \mathsf{loop} \\
\mathsf{loop} \cdot \mathsf{refl}^{-1} &\equiv \mathsf{loop} \\
\mathsf{loop} \cdot \mathsf{refl} &\equiv \mathsf{loop} \\
\mathsf{loop} &\equiv \mathsf{loop} \\
\end{align*}
$$

Between the second and third steps, I used functoriality of the $\mathsf{ap}$ operation.

```
  fg (loop i) k =
    let
      leftFace = λ j → compPath-filler (λ i → f (merid false i)) (λ j → f (merid true (~ j))) j i

      u = λ j → λ where
        (i = i0) → base
        (i = i1) → f (merid true (~ j))
        (k = i0) → leftFace j
        (k = i1) → loop i
    in hcomp u (f (merid false i))
```

```
  gf : (b : Susp Bool) → g (f b) ≡ b
  gf b = {!   !}
```
