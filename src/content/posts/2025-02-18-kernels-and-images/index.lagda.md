---
title: Kernels and images in homotopy theory
id: 2025-02-18-kernels-and-images
slug: 2025-02-18-kernels-and-images
draft: true
date: 2025-02-18T21:53:02.575Z
tags: ["homotopy-theory"]
---

```
{-# OPTIONS --cubical #-}
module 2025-02-18-kernels-and-images.index where
open import Cubical.Foundations.Prelude
open import Cubical.Foundations.Pointed
open import Cubical.Data.Sigma
```

# Pointed maps

Talking about the kernel doesn't really make sense without some notion of zero element.
So let's begin with pointed maps, which is essentially a function between two pointed spaces that preserves the basepoint:

```
_ = _→∙_ -- click this term to go to its definition!
```

Let's give ourselves some functions to work with:

```
module _ {ℓ : Level} {A∙ @ (A , a₀) B∙ @ (B , b₀) : Pointed ℓ} (f∙ @ (f , f₀) : A∙ →∙ B∙) where
```

The kernel of $f$ refers to all of the elements in $A$ that map to the base point of $B$, which we call $b_0$.

```
  kernel : Type ℓ
  kernel = Σ A (λ a → f a ≡ b₀)
```

The image of $f$ refers to all of the elements of $B$ that $f$ can map to.
Because of this requirement, we must include the element of $a$ that maps to it (as we are working in a constructive math).
However, we will propositionally truncate this, since we don't particularly care _which_ element of $A$ mapped to the output, simply that there merely exists one.
To do that, we will use `∃` instead of `Σ`, which performs the truncation.

```
  image : Type ℓ
  image = Σ B (λ b → ∃ A λ a → f a ≡ b)
```

## Exactness

Exactness of two pointed maps is when the image of the first matches the kernel of the second.

```
module _ {ℓ : Level}
  {A∙ @ (A , a₀) B∙ @ (B , b₀) C∙ @ (C , c₀) : Pointed ℓ}
  (f∙ @ (f , f₀) : A∙ →∙ B∙) (g∙ @ (g , g₀) : B∙ →∙ C∙) where

  exact : Type (ℓ-suc ℓ)
  exact = image f∙ ≡ kernel g∙
```

We can think of this as a kind of cone:

```typst
#import "@preview/cetz:0.3.2"
#set page(width: auto, height: auto, margin: .2in)

#cetz.canvas({
  import cetz.draw: *
  let midsize = 0.5
  circle((3, 0), radius: (1, 2))
  content((rel: (0, 2.5)))[$C$]

  merge-path(fill: rgb("#ffeeeecc"), stroke: none, {
    circle((-3, 0), radius: (1, 2))
    circle((-3, -2), radius: 0)
    circle((0, -midsize * 2), radius: 0)
    circle((0, 0), radius: (midsize, midsize * 2))
  })
  line((-3, 2), (0, midsize * 2), stroke: rgb("#999999"))
  line((-3, -2), (0, -midsize * 2), stroke: rgb("#999999"))
  content((-1.5, 0))[$f$]

  circle((-3, 0), radius: (1, 2))
  content((rel: (0, 2.5)))[$A$]

  circle((3, 0), radius: 0.08, fill: black)
  content((rel: (.4, 0)))[$c_0$]

  circle((0, 0), radius: (1, 2))
  content((rel: (0, 2.5)))[$B$]

  line((0, midsize * 2), (3, 0), stroke: rgb("#999999"))
  line((0, -midsize * 2), (3, 0), stroke: rgb("#999999"))
  merge-path(close: true, stroke: none, fill: rgb("#eeffee99"), {
    line((0, midsize * 2), (3, 0))
    line((3, 0), (0, -midsize * 2))
  })
  content((1.5, 0))[$g$]

  circle((0, 0), radius: (midsize, midsize * 2), stroke: rgb("#999"), fill: rgb("#ffeeff"))
  content(
    (rel: (0, 1.3)),
    frame: "rect",
    stroke: none,
    fill: rgb("#ffffffee"),
    padding: .1,
    text(fill: rgb("#999"), size: .8em, $sans("Im")(f)=sans("Ker")(g)$)
  )
})

```

Combining many exact maps gives us an _exact sequence_, which we can write in a more abbreviated way:

```typst
#import "@preview/fletcher:0.5.4" as fletcher: diagram, node, edge
#set page(width: auto, height: auto, margin: .2in)

#diagram(cell-size: 10mm, $
  dots.c edge(f_1, ->) &
  C_1 edge(f_2, ->) &
  C_2 edge(f_3, ->) &
  C_3 edge(f_4, ->) &
  dots.c
$)
```
