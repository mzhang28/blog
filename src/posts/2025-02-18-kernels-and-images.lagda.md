---
title: Kernels and images in homotopy theory
id: 2025-02-18-kernels-and-images
slug: 2025-02-18-kernels-and-images
draft: true
date: 2025-02-18T21:53:02.575Z
tags: ["homotopy-theory"]
---

Hello, world!

```
{-# OPTIONS --cubical #-}
module 2025-02-18-kernels-and-images where
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

```
  image : Type ℓ
  image = Σ B (λ b → ∃ A λ a → f a ≡ b)
```

## Exactness

Exactness of two pointed maps is when the kernel and the image match.

```
module _ {ℓ : Level}
  {A∙ @ (A , a₀) B∙ @ (B , b₀) C∙ @ (C , c₀) : Pointed ℓ}
  (f∙ @ (f , f₀) : A∙ →∙ B∙) (g∙ @ (g , g₀) : B∙ →∙ C∙) where

  exact : Type (ℓ-suc ℓ)
  exact = image f∙ ≡ kernel g∙
```

One feature of exactness is that it generalizes the concepts of surjection and injection.
