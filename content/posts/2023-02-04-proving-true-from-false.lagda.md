+++
title = "Proving true from false"
slug = "proving-true-from-false"
date = 2023-02-04
tags = ["type-theory"]
math = true
draft = true
+++

<details>
<summary>Imports</summary>

These are some imports that are required for code on this page to work properly.

```agda
{-# OPTIONS --cubical #-}

open import Cubical.Foundations.Prelude
open import Data.Bool
open import Data.Unit
open import Data.Empty

¬_ : Set → Set
¬ A = A → ⊥

_≢_ : ∀ {A : Set} → A → A → Set
x ≢ y  =  ¬ (x ≡ y)
```
</details>

Let's say you wanted to prove that `true` and `false` diverge, a.k.a are not
equal to each other. In a theorem prover like Agda, you could write this
statement as something like this:

```
true≢false : true ≢ false
```

For many "obvious" statements, it suffices to just write `refl` since the two
sides are trivially true via rewriting. For example:

```
open import Data.Nat
1+2≡3 : 1 + 2 ≡ 3
1+2≡3 = refl
```

However, in cubical Agda, this following statement doesn't work. I've commented
it out so the code on this page can continue to compile.

```
-- true≢false = refl
```

It looks like it's not obvious to the interpreter that this statement is
actually true. Why is this?

Well, in homotopy type theory, TODO

The strategy here is we define some kind of "type-map". Every time we see true,
we'll map it to some type, and every time we see false, we'll map it to empty.

Because the `≢` type actually means "having `a ≡ b` can produce `⊥`", all we
need to do is to produce an empty type. To do this, we need to do something
called _transport_.

In homotopy type theory, is a way of generating functions out of paths.

```
bool-map : Bool → Type
bool-map true = ⊤
bool-map false = ⊥

true≢false p = transport (λ i → bool-map (p i)) tt
```
