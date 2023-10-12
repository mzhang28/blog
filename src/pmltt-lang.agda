open import Data.String

-- Chapter 3.6
data Arity : Set where
    zero : Arity
    _⊗_ : Arity → Arity → Arity
    _-→_ : Arity → Arity → Arity

data Expr : Set where
    Var : String → Arity → Expr
    PrimConst : Arity → Expr
    App : Expr → Expr → Expr
    Abs : String → Expr → Expr

arity-of : (e : Expr) → Arity
