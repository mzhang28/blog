+++
title = "Proving true ≢ false"
slug = "proving-true-from-false"
date = 2023-04-21
tags = ["type-theory", "agda"]
math = true
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

infix 4 _≢_
_≢_ : ∀ {A : Set} → A → A → Set
x ≢ y  =  ¬ (x ≡ y)
```
</details>

The other day, I was trying to prove `true ≢ false` in Agda. I would write the
statement like this:

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

This is saying that using the way addition is defined, we can just rewrite the
left side so it becomes judgmentally equal to the right:

```
-- For convenience, here's the definition of addition:
-- _+_ : Nat → Nat → Nat
-- zero  + m = m
-- suc n + m = suc (n + m)
```

- 1 + 2
- suc zero + suc (suc zero)
- suc (zero + suc (suc zero))
- suc (suc (suc zero))
- 3

However, in cubical Agda, naively using `refl` with the inverse statement
doesn't work. I've commented it out so the code on this page can continue to
compile.

```
-- true≢false = refl
```

It looks like it's not obvious to the interpreter that this statement is
actually true. Why is that

---

Well, in constructive logic / constructive type theory, proving something is
false is actually a bit different. You see, the definition of the `not`
operator, or $\neg$, was:

```
-- ¬_ : Set → Set
-- ¬ A = A → ⊥
```

> The code is commented out because it was already defined at the top of the
> page in order for the code to compile.

This roughly translates to, "give me any proof of A, and I'll produce a value of
the bottom type." Since the bottom type $\bot$ is a type without values, being
able to produce a value represents logical falsehood. So we're looking for a way
to ensure that any proof of `true ≢ false` must lead to $\bot$.

The strategy here is we define some kind of "type-map". Every time we see
`true`, we'll map it to some arbitrary inhabited type, and every time we see
`false`, we'll map it to empty.

```
bool-map : Bool → Type
bool-map true = ⊤
bool-map false = ⊥
```

This way, we can use the fact that transporting
over a path (the path supposedly given to us as the witness that true ≢ false)
will produce a function from the inhabited type we chose to the empty type!

```
true≢false p = transport (λ i → bool-map (p i)) tt
```

I used `true` here, but I could equally have just used anything else:

```
bool-map2 : Bool → Type
bool-map2 true = 1 ≡ 1
bool-map2 false = ⊥

true≢false2 : true ≢ false
true≢false2 p = transport (λ i → bool-map2 (p i)) refl
```

---

Let's make sure this isn't broken by trying to apply this to something that's
actually true:

```
2-map : ℕ → Type
2-map 2 = ⊤
2-map 2 = ⊥
2-map else = ⊤

-- 2≢2 : 2 ≢ 2
-- 2≢2 p = transport (λ i → 2-map (p i)) tt
```

I commented the lines out because they don't compile, but if you tried to
compile it, it would fail with:

```text
⊤ !=< ⊥
when checking that the expression transport (λ i → 2-map (p i)) tt
has type ⊥
```

That's because with identical terms, you can't simultaneously assign them to
different values, or else it would not be a proper function.
