---
title: DTT Project
date: 2023-10-11T04:05:23.082Z
draft: true
toc: true
tags:
  - type-theory
---

References:

- https://www.cl.cam.ac.uk/~nk480/bidir.pdf

<details>
  <summary>
    Agda Imports
    <small>for the purpose of type-checking</small>
  </summary>

```agda
{-# OPTIONS --allow-unsolved-metas --allow-incomplete-matches #-}
open import Data.Nat
open import Data.Product
open import Data.String hiding (_<_)
open import Relation.Nullary using (Dec)
open import Relation.Nullary.Decidable using (True; toWitness)
```

</details>

## Damas-Hindley-Milner type inference

Unification-based algorithm for lambda calculus.

## First try

Implement terms, monotypes, and polytypes:

```agda
data Term : Set
data Type : Set
data Monotype : Set
```

Regular lambda calculus terms:

$e ::= x \mid () \mid \lambda x. e \mid e e \mid (e : A)$

```agda
data Term where
    Unit : Term
    Var : String → Term
    Lambda : String → Term → Term
    App : Term → Term → Term
    Annot : Term → Type → Term
```

Polytypes are types that may include universal quantifiers ($\forall$)

$A, B, C ::= 1 \mid \alpha \mid \forall \alpha. A \mid A \rightarrow B$

```agda
data Type where
    Unit : Type
    Var : String → Type
    Existential : String → Type
    Forall : String → Type → Type
    Arrow : Type → Type → Type
```

Monotypes (usually denoted $\tau$) are types that aren't universally quantified.

> [!NOTE]
> In the declarative version of this algorithm, monotypes don't have existential quantifiers either,
> but the algorithmic type system includes it.
> TODO: Explain why

```agda
data Monotype where
    Unit : Monotype
    Var : String → Monotype
    Existential : String → Monotype
    Arrow : Monotype → Monotype → Monotype
```

### Contexts

```agda
data Context : Set where
    Nil : Context
    Var : Context → String → Context
    Annot : Context → String → Type → Context
    UnsolvedExistential : Context → String → Context
    SolvedExistential : Context → String → Monotype → Context
    Marker : Context → String → Context

contextLength : Context → ℕ
contextLength Nil = zero
contextLength (Var Γ _) = suc (contextLength Γ)
contextLength (Annot Γ _ _) = suc (contextLength Γ)
contextLength (UnsolvedExistential Γ _) = suc (contextLength Γ)
contextLength (SolvedExistential Γ _ _) = suc (contextLength Γ)
contextLength (Marker Γ _) = suc (contextLength Γ)

-- https://plfa.github.io/DeBruijn/#abbreviating-de-bruijn-indices
postulate
    lookupVar : (Γ : Context) → (n : ℕ) → (p : n < contextLength Γ) → Set
-- lookupVar (Var Γ x) n p = {!   !}
-- lookupVar (Annot Γ x x₁) n p = {!   !}
-- lookupVar (UnsolvedExistential Γ x) n p = {!   !}
-- lookupVar (SolvedExistential Γ x x₁) n p = {!   !}
-- lookupVar (Marker Γ x) n p = {!   !}

data CompleteContext : Set where
    Nil : CompleteContext
    Var : CompleteContext → String → CompleteContext
    Annot : CompleteContext → String → Type → CompleteContext
    SolvedExistential : CompleteContext → String → Monotype → CompleteContext
    Marker : CompleteContext → String → CompleteContext
```

### Type checking

```agda
postulate
    check : (Γ : Context) → (e : Term) → (A : Type) → Context
```

```agda
-- check Γ Unit A = Γ
```

```agda
-- check Γ (Var x) A = {!   !}
-- check Γ (Lambda x e) A = {!   !}
-- check Γ (App e e₁) A = {!   !}
-- check Γ (Annot e x) A = {!   !}
```

### Type synthesizing

```js
const x = () => {};
```

```agda
postulate
    synthesize : (Γ : Context) → (e : Term) → (Type × Context)
-- synthesize Γ Unit = Unit , Γ
-- synthesize Γ (Var x) = {!   !}
-- synthesize Γ (Lambda x e) = {!   !}
-- synthesize Γ (App e e₁) = {!   !}
-- synthesize Γ (Annot e x) = {!   !}
```
