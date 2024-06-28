{-# OPTIONS --cubical-compatible #-}

module Prelude where

open import Agda.Primitive

module 𝟘 where
  data ⊥ : Set where
  ¬_ : Set → Set
  ¬ A = A → ⊥
open 𝟘 public

module 𝟙 where
  data ⊤ : Set where
    tt : ⊤
open 𝟙 public

module 𝟚 where
  data Bool : Set where
    true : Bool
    false : Bool
open 𝟚 public

id : {l : Level} {A : Set l} → A → A
id x = x

module Nat where
  data ℕ : Set where
    zero : ℕ
    suc : ℕ → ℕ
  {-# BUILTIN NATURAL ℕ #-}

  infixl 6 _+_
  _+_ : ℕ → ℕ → ℕ
  zero + n = n
  suc m + n = suc (m + n)
open Nat public

infix 4 _≡_
data _≡_ {l} {A : Set l} : (a b : A) → Set l where
  instance refl : {x : A} → x ≡ x

transport : {l₁ l₂ : Level} {A : Set l₁} {x y : A}
  → (P : A → Set l₂)
  → (p : x ≡ y)
  → P x → P y
transport {l₁} {l₂} {A} {x} {y} P refl = id

infix 4 _≢_
_≢_ : ∀ {A : Set} → A → A → Set
x ≢ y  =  ¬ (x ≡ y)

module dependent-product where
  infixr 4 _,_
  infixr 2 _×_

  record Σ {l₁ l₂} (A : Set l₁) (B : A → Set l₂) : Set (l₁ ⊔ l₂) where
    constructor _,_
    field
      fst : A
      snd : B fst
  open Σ
  {-# BUILTIN SIGMA Σ #-}
  syntax Σ A (λ x → B) = Σ[ x ∈ A ] B

  _×_ : {l : Level} (A B : Set l) → Set l
  _×_ A B = Σ A (λ _ → B)
open dependent-product public

_∘_ : {A B C : Set} (g : B → C) → (f : A → B) → A → C
(g ∘ f) a = g (f a)

_∼_ : {A B : Set} (f g : A → B) → Set
_∼_ {A} f g = (x : A) → f x ≡ g x
