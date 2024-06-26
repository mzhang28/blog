---
title: "Higher Inductive Types"
date: 2022-09-20
tags: ["type-theory"]
toc: true
math: true
draft: true
---

**Higher inductive types (HIT)** are central to developing cubical type theory.
What this article will try to do is develop an approach to understanding higher
inductive types based on my struggles to learn the topic.

<!--more-->

## Ordinary inductive types

So first off, what is an inductive type? These are a kind of data structure
that's commonly used in _functional programming_. For example, consider the
definition of natural numbers (`Nat`):

```agda
data Nat : Set where
  zero : Nat
  suc : Nat → Nat
```

This defines all `Nat`s as either zero, or one more than another `Nat`. For
example, here's the first few natural numbers and their corresponding
representation using this data structure:

```txt
0  zero
1  suc zero
2  suc (suc zero)
3  suc (suc (suc zero))
4  suc (suc (suc (suc zero)))
5  suc (suc (suc (suc (suc zero))))
```

Why is this representation useful? Well, if you remember **proof by induction**
from maybe high school geometry, you'll recall that we can prove things about
all natural numbers by simply proving that it's true for the _base case_ 0, and
then proving that it's true for any _inductive case_ $n$, given that the
previous case $n - 1$ is true.

This kind of definition of natural numbers makes this induction structure much
more clear. For example, look at the definition of a tree:

```agda
data Tree (A : Set) : Set where
  leaf : A → Tree A
  left : Tree A → Tree A
  right : Tree A → Tree A
```

We can do induction on trees by simply proving it's true for (1) the base case,
(2) the left case, and (3) the right case. In fact, all inductive data
structures have this kind of induction principle. So say you wanted to prove
that $1 + 2 + 3 + \cdots + n = \frac{n\cdot(n+1)}{2}$ for all $n \in
\mathbb{N}$, then you could say:

<details>
<summary>(click here for boring requisites)</summary>

```agda
open import Relation.Binary.PropositionalEquality using (_≡_; refl; cong; sym; module ≡-Reasoning)
open ≡-Reasoning using (begin_; _≡⟨_⟩_; _≡⟨⟩_; step-≡; _∎)
open import Data.Product using (_×_)
open import Data.Nat using (ℕ; zero; suc; _+_; _*_)
open import Data.Nat.DivMod using (_/_; 0/n≡0; n/n≡1; m*n/n≡m)
open import Data.Nat.Properties using (+-assoc; *-identityˡ; *-comm; *-distribʳ-+; +-comm)

sum-to-n : ℕ → ℕ
sum-to-n zero = zero
sum-to-n (suc x) = (suc x) + (sum-to-n x)

distrib-/ : ∀ (a b c : ℕ) → a / c + b / c ≡ (a + b) / c
distrib-/ zero b c =
  begin
    zero / c + b / c
  ≡⟨ cong (_+ b / c) (0/n≡0 c) ⟩
    b / c
  ≡⟨ cong (_/ c) refl ⟩
    (zero + b) / c
  ∎
distrib-/ (suc a) b c =
  begin
    (1 + a) / c + b / c
  ≡⟨ cong (_+ b / c) (sym (distrib-/ 1 a c)) ⟩
    1 / c + a / c + b / c
  ≡⟨ +-assoc (1 / c) (a / c) (b / c) ⟩
    1 / c + (a / c + b / c)
  ≡⟨ cong (1 / c +_) (distrib-/ a b c) ⟩
    1 / c + (a + b) / c
  ≡⟨ distrib-/ 1 (a + b) c ⟩
    (suc a + b) / c
  ∎
```

</details>

```agda
-- Here's the proposition we want to prove:
our-prop : ∀ (n : ℕ) → sum-to-n n ≡ n * (n + 1) / 2

-- How do we prove this?
-- Well, we know it's true for zero:
base-case : sum-to-n 0 ≡ 0 * (0 + 1) / 2
base-case = refl

-- The next part is proving that it's true for any n + 1, given that it's true
-- for the previous case n:
inductive-case : ∀ {n : ℕ}
  → (inductive-hypothesis : sum-to-n n ≡ n * (n + 1) / 2)
  → sum-to-n (suc n) ≡ (suc n) * (suc n + 1) / 2
```

<details>
<summary>Inductive case proof, expand if you're interested</summary>

```agda
inductive-case {n} p =
  begin
    sum-to-n (suc n)
  ≡⟨⟩ -- Expanding definition of sum-to-n
    suc n + sum-to-n n
  ≡⟨ cong (suc n +_) p ⟩ -- Substituting the previous case
    suc n + n * (n + 1) / 2
  ≡⟨ cong (_+ n * (n + 1) / 2) (sym (m*n/n≡m (suc n) 2)) ⟩
    (suc n * 2) / 2 + (n * (n + 1)) / 2
  ≡⟨ distrib-/ (suc n * 2) (n * (n + 1)) 2 ⟩
    (suc n * 2 + n * (n + 1)) / 2
  ≡⟨ cong (_/ 2) (cong (_+ n * (n + 1)) (*-comm (suc n) 2)) ⟩
    (2 * suc n + n * (n + 1)) / 2
  ≡⟨ cong (_/ 2) (cong (2 * suc n +_) (cong (n *_) (+-comm n 1))) ⟩
    (2 * suc n + n * suc n) / 2
  ≡⟨ cong (_/ 2) (sym (*-distribʳ-+ (suc n) 2 n)) ⟩
    (1 + suc n) * suc n / 2
  ≡⟨ cong (_/ 2) (cong (_* suc n) (+-comm 1 (suc n))) ⟩
    (suc n + 1) * suc n / 2
  ≡⟨ cong (_/ 2) (*-comm (suc n + 1) (suc n)) ⟩
    (suc n) * (suc n + 1) / 2
  ∎
```

</details>

So now that we have both the base and inductive cases, let's combine it using
this:

```agda
-- Given any natural number property (p : ℕ → Set), if...
any-nat-prop : (p : ℕ → Set)
  -- ...it's true for the base case and...
  → p 0
  -- ...it's true for the inductive case...
  → (∀ {n : ℕ} (a : p n) → p (suc n))
  -- ...then the property is true for all naturals.
  → (∀ (n : ℕ) → p n)
any-nat-prop p base _ zero = base
any-nat-prop p base ind (suc n) = ind (any-nat-prop p base ind n)
```

Then:

```
our-prop = any-nat-prop
  (λ n → sum-to-n n ≡ n * (n + 1) / 2)
  base-case inductive-case
```

Using Agda, we can see that this type-checks correctly.

**TODO:** Ensure totality

## Higher inductive types

Moving on, we want to know what _higher_ inductive types brings to the table. To
illustrate its effect, let's consider the following scenario: suppose you have

#### References

- [nLab](https://ncatlab.org/nlab/show/higher+inductive+type)
- Section 2.5 of [Favonia's thesis](https://favonia.org/files/thesis.pdf)
- [Quotient Types for Programmers](https://www.hedonisticlearning.com/posts/quotient-types-for-programmers.html)
