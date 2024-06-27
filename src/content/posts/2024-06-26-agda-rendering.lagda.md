---
title: "Agda rendering in my blog!"
slug: 2024-06-26-agda-rendering
date: 2024-06-27T04:25:15.332Z
tags: ["meta", "agda"]
draft: true
---

I finally spent some time today getting Agda syntax highlighting working on my blog.
This took me around 3-4 hours of debugging but I'm very happy with how it turned out.

First off, a demonstration. Here's the code for function application over a path:

```
open import Agda.Primitive

infix 4 _≡_
data _≡_ {l} {A : Set l} : (a b : A) → Set l where
  instance refl : {x : A} → x ≡ x

ap : {l1 l2 : Level} {A : Set l1} {B : Set l2} {x y : A}
  → (f : A → B)
  → (p : x ≡ y)
  → f x ≡ f y
ap {l1} {l2} {A} {B} {x} {y} f refl = refl
```
