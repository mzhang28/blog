---
title: "Equivalences"
id: "equivalences"
date: 2023-05-06
tags:
  - type-theory
  - agda
  - hott
math: true
draft: true
---

<details>
  <summary>Imports</summary>

```
{-# OPTIONS --cubical #-}

open import Agda.Primitive.Cubical
open import Cubical.Foundations.Equiv
open import Cubical.Foundations.Prelude
open import Data.Bool
```

</details>

```
Bool-id : Bool → Bool
Bool-id true = true
Bool-id false = false

unap : {A B : Type} {x y : A} (f : A → B) → f x ≡ f y → x ≡ y
unap p i = ?

-- Need to convert point-wise equality into universally quantified equality?
Bool-id-refl : (x : Bool) → (Bool-id x ≡ x)
Bool-id-refl true = refl
Bool-id-refl false = refl
```

The equivalence proof below involves the contractibility-of-fibers definition of
an equivalence. There are others, but the "default" one used by the Cubical
standard library uses this.

```
Bool-id-is-equiv : isEquiv Bool-id
```

In the contractibility-of-fibers proof, we must first establish our fibers. If
we had $(f : A \rightarrow B)$, then this is saying given any $(y : B)$, we must
provide:

- an $(x : A)$ that would have gotten mapped to $y$ (preimage), and
- a proof that $f\ x \equiv y$

These are the two elements of the pair given below. Since our function is `id`,
we can just give $y$ again, and use the `refl` function above for the equality
proof

```

```

The next step is to prove that it's contractible. Using the same derivation for
$y$ as above, this involves taking in another fiber $y_1$, and proving that it's
equivalent the fiber we've just defined above.

To prove fiber equality, we can just do point-wise equality over both the
preimage of $y$, and then the second-level equality of the proof of $f\ x \equiv
y$.

In the first case here, we need to provide something that equals our $x$ above
when $i = i0$, and something that equals the fiber $y_1$'s preimage $x_1$ when
$i = i1$, aka $y \equiv proj_1\ y_1$.

```

-- 2023-05-13: Favonia's hint is to compute "ap g p", and then concatenate
-- it with a proof that g is the left-inverse of f
-- ok i'm pretty sure this should be the g = f^-1
Bool-id-inv : Bool → Bool
Bool-id-inv b = (((Bool-id-is-equiv .equiv-proof) b) .fst) .fst

Bool-id-inv-is-inv : (b : Bool) → Bool-id-inv (Bool-id b) ≡ b
Bool-id-inv-is-inv true =
    Bool-id-inv (Bool-id true)
  ≡⟨ refl ⟩
    Bool-id-inv true
  ≡⟨ refl ⟩
    -- This isn't trivially true?
    (Bool-id-is-equiv .equiv-proof true .fst) .fst
  ≡⟨ ? ⟩
    true
  ∎
Bool-id-inv-is-inv false = ?

Bool-id-is-equiv .equiv-proof y .fst = y , Bool-id-refl y

Bool-id-is-equiv .equiv-proof y .snd y₁ i .fst =
  let
    eqv = snd y₁
    -- eqv : Bool-id (fst y₁) ≡ y
    -- this is the second pieece of the other fiber passed in

    eqv2 = eqv ∙ sym (Bool-id-refl y)
    -- eqv2 : Bool-id (fst y₁) ≡ Bool-id y
    -- concat the fiber (Bool-id (fst y₁) ≡ y) with (y ≡ Bool-id y) to get the
    -- path from (Bool-id (fst y₁) ≡ Bool-id y)

    -- Ok, unap doesn't actually exist unless f is known to have an inverse.
    -- Fortunately, because we're proving an equivalence, we know that f has an
    -- inverse, in particular going from y to x, which in this case is also y.
    eqv3 = unap Bool-id eqv2

    -- Then, ap g p should be like:
    ap-g-p : Bool-id-inv (Bool-id (fst y₁)) ≡ Bool-id-inv (Bool-id y)
    ap-g-p = cong Bool-id-inv eqv2

    -- OHHHHH now we just need to find that Bool-id-inv (Bool-id y) ≡ y, and
    -- then we can apply it to both sides to simplify
    -- So something like this:

    -- left-id : Bool-id-inv ∙ Bool-id ≡ ?
    -- left-id = ?

    eqv3′ = cong Bool-id-inv eqv2
    give-me-info = ?
    -- eqv3 : fst y₁ ≡ y

    -- Use the equational reasoning shitter
    final : y ≡ fst y₁
    final =
        y
      ≡⟨ ? ⟩
        fst y₁
      ∎
```

Blocked on this issue: https://git.mzhang.io/school/cubical/issues/1

```
    eqv4′ = ?
    eqv4 = sym eqv3
    -- eqv4 : y ≡ fst y₁
  in
  eqv4 i
```

Now we can prove that the path is the same

\begin{CD}
A @> > > B \\\
 @VVV @VVV \\\
 C @> > > D
\end{CD}

- $A \rightarrow B$ is the path of the original fiber that we've specified, which is $f\ x \equiv y$
- $C \rightarrow D$ is the path of the other fiber that we're proving, which is $proj_2\ y_1$

So what we want now is `a-b ≡ c-d`

```
Bool-id-is-equiv .equiv-proof y .snd y₁ i .snd j =
  let
    a-b = Bool-id-refl y
    c-d = y₁ .snd
  in
  ?
```

Blocked on this issue: https://git.mzhang.io/school/cubical/issues/2

```

```

## Other Equivalences

There are 2 other ways we can define equivalences:

TODO: Talk about them being equivalent to each other
