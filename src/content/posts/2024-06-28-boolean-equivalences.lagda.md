---
title: "Boolean equivalences"
slug: 2024-06-28-boolean-equivalences
date: 2024-06-28T21:37:04.299Z
tags: ["agda", "type-theory", "hott"]
draft: true
---

This post is about a problem I recently proved that seemed simple going in, but
I struggled with it for quite a while. The problem statement is as follows:

Show that:

$$
  (2 \simeq 2) \simeq 2
$$

This problem is exercise 2.13 of the [Homotopy Type Theory book][book]. If you
are planning to attempt this problem, spoilers ahead!

[book]: https://homotopytypetheory.org/book/

<small>The following line imports some of the definitions used in this post.</small>

```
open import Prelude
```

## The problem explained

With just the notation, the problem may not be clear.
$2$ represents the set with only 2 elements in it, which is the booleans. The
elements of $2$ are $\textrm{true}$ and $\textrm{false}$.
In this expression, $\simeq$ denotes [_homotopy equivalence_][1] between sets,
which you can think of as an isomorphism.
For some function $f : A \rightarrow B$, we say that $f$ is an equivalence if:

[1]: https://en.wikipedia.org/wiki/Homotopy#Homotopy_equivalence

- there exists a $g : B \rightarrow A$
- $f \circ g$ is homotopic to the identity map $\textrm{id}_B : B \rightarrow B$
- $g \circ f$ is homotopic to the identity map $\textrm{id}_A : A \rightarrow A$

We can write this in Agda like this:

```
record isEquiv {A B : Set} (f : A → B) : Set where
  constructor mkEquiv
  field
    g : B → A
    f∘g : (f ∘ g) ∼ id
    g∘f : (g ∘ f) ∼ id
```

Then, the expression $2 \simeq 2$ simply expresses an equivalence between the
boolean set to itself. Here's an example of a function that satisfies this equivalence:

```
bool-id : Bool → Bool
bool-id b = b
```

We can prove that it satisfies the equivalence, by giving it an inverse function
(itself), and proving that the inverse is homotopic to identity (which is true
definitionally):

```
bool-id-eqv : isEquiv bool-id
bool-id-eqv = mkEquiv bool-id id-homotopy id-homotopy
  where
    id-homotopy : (bool-id ∘ bool-id) ∼ id
    id-homotopy _ = refl
```

We can package these together into a single definition that combines the
function along with proof of its equivalence properties using a dependent
pair[^1]:

[^1]: A dependent pair (or $\Sigma$-type) is like a regular pair $\langle x, y\rangle$, but where $y$ can depend on $x$.
  For example, $\langle x , \textrm{isPrime}(x) \rangle$.
  In this case it's useful since we can carry the equivalence information along with the function itself.
  This type is rather core to Martin-Löf Type Theory, you can read more about it [here][dependent-pair].

[dependent-pair]: https://en.wikipedia.org/wiki/Dependent_type#%CE%A3_type

```
_≃_ : (A B : Set) → Set
A ≃ B = Σ (A → B) (λ f → isEquiv f)
```

<small>Hint: (click the $\Sigma$ to see how it's defined!)</small>

This gives us an equivalence:

```
bool-eqv : Bool ≃ Bool
bool-eqv = bool-id , bool-id-eqv
```

Great! Now what?

## The space of equivalences

Turns out, the definition I gave above is just _one_ of multiple possible
equivalences between the boolean type and itself. Here is another possible
definition:

```
bool-neg : Bool → Bool
bool-neg true = false
bool-neg false = true
```

The remarkable thing about this is that nothing is changed by flipping true and
false. Someone using booleans would not be able to tell if you gave them a
boolean type where true and false were flipped. Simply put, the constructors
true and false are simply names and nothing can distinguish them.

We can show this by proving that `bool-neg` also forms an equivalence by using
itself as the inverse.

```
bool-neg-eqv : isEquiv bool-neg
bool-neg-eqv = mkEquiv bool-neg neg-homotopy neg-homotopy
  where
    neg-homotopy : (bool-neg ∘ bool-neg) ∼ id
    neg-homotopy true = refl
    neg-homotopy false = refl

bool-eqv2 : Bool ≃ Bool
bool-eqv2 = bool-neg , bool-neg-eqv
```

You could imagine more complicated functions over booleans that may also exhibit
this equivalence property. So how many different elements of the type $2 \simeq
2$ exist?

## Proving $2 \simeq 2$ only has 2 inhabitants

It turns out there are only 2 equivalences, the 2 that we already found. But how
do we know this for a fact? Well, if there are only 2 equivalences, that means
there are only 2 inhabitants of the type $2 \simeq 2$. We can prove that this
type only has 2 inhabitants by establishing an equivalence between this type and
another type that is known to have 2 inhabitants, such as the boolean type!

That's where the main exercise statement comes in: "show that" $(2 \simeq 2)
\simeq 2$, or in other words, find an inhabitant of this type.

```
_ : (Bool ≃ Bool) ≃ Bool
_ = {!   !}
```
