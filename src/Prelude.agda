{-# OPTIONS --cubical-compatible #-}

module Prelude where

open import Agda.Primitive

private
  variable
    l : Level

data ⊥ : Set where

rec-⊥ : {A : Set} → ⊥ → A
rec-⊥ ()

¬_ : Set → Set
¬ A = A → ⊥

data ⊤ : Set where
  tt : ⊤

data Bool : Set where
  true : Bool
  false : Bool

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
{-# BUILTIN EQUALITY _≡_ #-}

ap : {A B : Set l} → (f : A → B) → {x y : A} → x ≡ y → f x ≡ f y
ap f refl = refl

sym : {A : Set l} {x y : A} → x ≡ y → y ≡ x
sym refl = refl

trans : {A : Set l} {x y z : A} → x ≡ y → y ≡ z → x ≡ z
trans refl refl = refl

infixl 10 _∙_
_∙_ = trans

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

postulate
  funExt : {l : Level} {A B : Set l}
    → {f g : A → B}
    → ((x : A) → f x ≡ g x)
    → f ≡ g
