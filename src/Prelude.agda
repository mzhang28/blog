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
