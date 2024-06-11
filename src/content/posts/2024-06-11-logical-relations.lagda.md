---
title: "Logical Relations"
slug: 2024-06-11-path-induction-gadt-perspective
date: 2024-06-11
tags: ["programming-languages", "formal-verification"]
draft: true
---

<details>
<summary>Imports</summary>

```
open import Agda.Builtin.Sigma
open import Data.Bool
open import Data.Empty
open import Data.Fin
open import Data.Maybe
open import Data.Nat
open import Data.Product
open import Data.Sum
open import Relation.Nullary

id : {A : Set} → A → A
id {A} x = x
```

</details>

## Syntax

```
data type : Set where
  bool : type
  _-→_ : type → type → type

data term : Set where
  `_ : ℕ → term
  `true : term
  `false : term
  `if_then_else_ : term → term → term → term
  `λ[_]_ : (τ : type) → (e : term) → term
  _∙_ : term → term → term
```

## Substitution

```
data ctx : Set where
  nil : ctx
  cons : ctx → type → ctx

lookup : ctx → ℕ → Maybe type
lookup nil _ = nothing
lookup (cons ctx₁ x) zero = just x
lookup (cons ctx₁ x) (suc n) = lookup ctx₁ n

data sub : Set where
  nil : sub
  cons : sub → term → sub

subst : term → term → term
subst (` zero) v = v
subst (` suc x) v = ` x
subst `true v = `true
subst `false v = `false
subst (`if x then x₁ else x₂) v = `if (subst x v) then (subst x₁ v) else (subst x₂ v)
subst (`λ[ τ ] x) v = `λ[ τ ] subst x v
subst (x ∙ x₁) v = (subst x v) ∙ (subst x₁ v)

data value-rel : type → term → Set where
  v-`true : value-rel bool `true
  v-`false : value-rel bool `false
  v-`λ[_]_ : ∀ {τ e} → value-rel τ (`λ[ τ ] e)

data good-subst : ctx → sub → Set where
  nil : good-subst nil nil
  cons : ∀ {ctx τ γ v}
    → good-subst ctx γ
    → value-rel τ v
    → good-subst (cons ctx τ) γ
```

## Semantics

```
data step : term → term → Set where
  step-if-1 : ∀ {e₁ e₂} → step (`if `true then e₁ else e₂) e₁
  step-if-2 : ∀ {e₁ e₂} → step (`if `false then e₁ else e₂) e₂
  step-`λ : ∀ {τ e v} → step ((`λ[ τ ] e) ∙ v) (subst e v)

data steps : ℕ → term → term → Set where
  zero : ∀ {e} → steps zero e e
  suc : ∀ {e e' e''} → (n : ℕ) → step e e' → steps n e' e'' → steps (suc n) e e''

data _⊢_∶_ : ctx → term → type → Set where
  type-`true : ∀ {ctx} → ctx ⊢ `true ∶ bool
  type-`false : ∀ {ctx} → ctx ⊢ `false ∶ bool
  type-`ifthenelse : ∀ {ctx e e₁ e₂ τ}
    → ctx ⊢ e ∶ bool
    → ctx ⊢ e₁ ∶ τ
    → ctx ⊢ e₂ ∶ τ
    → ctx ⊢ (`if e then e₁ else e₂) ∶ τ
  type-`x : ∀ {ctx x}
    → (p : Is-just (lookup ctx x))
    → ctx ⊢ (` x) ∶ (to-witness p)
  type-`λ : ∀ {ctx τ τ₂ e}
    → (cons ctx τ) ⊢ e ∶ τ₂
    → ctx ⊢ (`λ[ τ ] e) ∶ (τ -→ τ₂)
  type-∙ : ∀ {ctx τ₁ τ₂ e₁ e₂}
    → ctx ⊢ e₁ ∶ (τ₁ -→ τ₂)
    → ctx ⊢ e₂ ∶ τ₂
    → ctx ⊢ (e₁ ∙ e₂) ∶ τ₂

irreducible : term → Set
irreducible e = ¬ (∃ λ e' → step e e')

data term-relation : type → term → Set where
  e-term : ∀ {τ e}
    → (∀ {n} → (e' : term) → steps n e e' → irreducible e' → value-rel τ e')
    → term-relation τ e

type-sound : ∀ {Γ e τ} → Γ ⊢ e ∶ τ → Set
type-sound {Γ} {e} {τ} s = ∀ {n} → (e' : term) → steps n e e' → value-rel τ e' ⊎ ∃ λ e'' → step e' e''

_⊨_∶_ : (Γ : ctx) → (e : term) → (τ : type) → Set
_⊨_∶_ Γ e τ = (γ : sub) → (good-subst Γ γ) → term-relation τ e

fundamental : ∀ {Γ e τ} → (well-typed : Γ ⊢ e ∶ τ) → type-sound well-typed → Γ ⊨ e ∶ τ
fundamental {Γ} {e} {τ} well-typed type-sound γ good-sub = e-term f
  where
    f : {n : ℕ} (e' : term) → steps n e e' → irreducible e' → value-rel τ e'
    f e' steps irred = [ id , (λ exists → ⊥-elim (irred exists)) ] (type-sound e' steps)
```
