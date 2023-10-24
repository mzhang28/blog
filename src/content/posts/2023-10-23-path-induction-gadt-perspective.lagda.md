---
title: "Path induction: a GADT perspective"
slug: 2023-10-23-path-induction-gadt-perspective
date: 2023-10-23
tags: ["type-theory"]
draft: true
---

<details>
<summary>Imports</summary>

```
open import Relation.Binary.PropositionalEquality
open import Data.Integer
open import Data.Bool
open import Data.String
Int = ℤ
```

</details>

> [!NOTE]
> This content is a writeup from a weekend discussion session for the fall 2023 special-topics course CSCI 8980 at the University of Minnesota taught by [Favonia], who provided the examples.
> This post is primarily a summary of the concepts discussed.

An important concept in [Martin-Löf Type Theory][mltt] is the internal equality[^1] type $\mathrm{Id}$.
Like all inductive types, it comes with the typical rules used to introduce types:

[^1]:
    "Internal" here is used to mean something expressed within the type theory itself, rather than in the surrounding meta-theory, which is considered "external."
    For more info, see [this][equality] page.

- Formation rule
- Introduction rule
- Elimination rule
- Computation rule

There's something quite peculiar about the elimination rule in particular (commonly known as "path induction", or just $J$).
Let's take a look at its definition, in Agda syntax:

```agda
J : {A : Set}
  → (C : (x y : A) → x ≡ y → Set)
  → (c : (x : A) → C x x refl)
  → (x y : A) → (p : x ≡ y) → C x y p
J C c x x refl = c x
```

<details>
  <summary>What does this mean?</summary>

An _eliminator_ rule defines how a type is used.
It's the primitive that often powers programming language features like pattern matching.
We can break this function down into each of the parameters it takes:

- $C$ is short for "motive".
  Think of $J$ as producing an $\mathrm{Id} \rightarrow C$ function, but we have to include the other components or else it's not complete.
- $c$ tells you how to handle the _only_ constructor to $\mathrm{Id}$, which is $\mathrm{refl}$.
  Think of this as a kind of pattern match on the $\mathrm{refl}$ case, since $\mathrm{Id}$ is just a regular inductive type.
- $x, y, p$ these are just a part of the final $\mathrm{Id} \rightarrow C$ function.

How $J$ is computed depends on your type theory's primitives; in HoTT you would define it in terms of something like transport.

</details>

There's something odd about this: the $c$ case only defines what happens in the case of $C(x, x, \mathrm{refl})$, but the final $J$ definition extends to arbitrary $C(x, y, p)$.
How can this be the case?

A good way to think about this is using [generalized algebraic data types][gadt], or GADTs.
A GADT is similar to a normal inductive data type, but it can be indexed by a type.
This is similar to polymorphism on data types, but much more powerful.
Consider the following non-generalized data type:

```agda
data List (A : Set) : Set where
  Nil : List A
  Cons : A → List A → List A
```

I could write functions with this, but either polymorphically (accepts `A : Set` as a parameter, with no knowledge of what the type is) or monomorphically (as a specific `List Int` or `List Bool` or something).
What I couldn't do would be something like this:

```text
sum : (A : Set) → List A → A
sum Int Nil = 0
sum Int (Cons hd tl) = hd + (sum tl)
sum A Nil = {!   !}
sum A (Cons hd tl) = {!   !}
```

Once I've chosen to go polymorphic, there's no option to know anything about the type, and I can only operate generally on it[^2].

[^2]:
    As another example, if you have a polymorphic function with the type signature $\forall A . A \rightarrow A$, there's no implementation other than the $\mathrm{id}$ function, because there's no other knowledge about the type.
    For more info, see [Theorems for Free][free]

With GADTs, this changes.
The key here is that different constructors of the data type can return different types of the same type family.

```
data Message : Set → Set₁ where
  S : String → Message String
  I : Int → Message Int
  F : {T : Set} → (f : String → T) → Message T
```

Note that in the definition, I've moved the parameter from the left side to the right.
This means I'm no longer committing to a fully polymorphic `A`, which is now allowed to be assigned anything freely.
In particular, it's able to take different values for different constructors.

This allows me to write functions that are polymorphic over _all_ types, while still having the ability to refer to specific types.

```agda
extract : {A : Set} → Message A → A
extract (S s) = s
extract (I i) = i
extract (F f) = f "hello"
```

Note that the type signature of `extract` remains fully polymorphic, while each of the cases has full type information.
This is sound because we know exactly what indexes `Message` could take, and the fact that there are no other ways to construct a `Message` means we won't ever run into a case where we would be stuck on a case we don't know how to handle.

In a sense, each of the pattern match "arms" is giving more information about the polymorphic return type.
In the `S` case, it can _only_ return `Message String`, and in the `I` case, it can _only_ return `Message Int`.
We can even have a polymorphic constructor case, as seen in the `F` constructor.

The same thing applies to the $\mathrm{Id}$ type, since $\mathrm{Id}$ is pretty much just a generalized and dependent data type.
The singular constructor `refl` is only defined on the index `Id A x x`, but the type has a more general `Id A x y`.
So the eliminator only needs to handle the case of an element of $A$ equal to itself, because that's the "only" constructor for $\mathrm{Id}$ in the first place[^3].

[^3]: Not true in [homotopy type theory][hott], where the titular _univalence_ axiom creates terms in the identity type using equivalences.

Hopefully now the path induction type doesn't seem as "magical" to you anymore!

[mltt]: https://ncatlab.org/nlab/show/Martin-L%C3%B6f+dependent+type+theory
[equality]: https://ncatlab.org/nlab/show/equality#notions_of_equality_in_type_theory
[gadt]: https://en.wikipedia.org/wiki/Generalized_algebraic_data_type
[free]: https://www2.cs.sfu.ca/CourseCentral/831/burton/Notes/July14/free.pdf
[favonia]: https://favonia.org/
[hott]: https://homotopytypetheory.org/book/
