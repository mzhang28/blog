---
title: "Boolean equivalences in HoTT"
slug: 2024-06-28-boolean-equivalences
date: 2024-06-28T21:37:04.299Z
tags: ["agda", "type-theory", "hott"]
---

This post is about a problem I recently proved that seemed simple going in, but
I struggled with it for quite a while. The problem statement is as follows:

Show that:

$$
  (2 \simeq 2) \simeq 2
$$

> [!admonition: WARNING]
> :warning: This post describes exercise 2.13 of the [Homotopy Type Theory
> book][book]. If you are planning to attempt this problem yourself, spoilers
> ahead!

[book]: https://homotopytypetheory.org/book/

<small>The following line imports some of the definitions used in this post.</small>

```
open import Prelude
open Σ
```

## The problem explained

With just that notation, the problem may not be clear.
$2$ represents the set with only two elements in it, which is the booleans. The
elements of $2$ are $\textrm{true}$ and $\textrm{false}$.

```
data 𝟚 : Set where
  true : 𝟚
  false : 𝟚
```

In the problem statement, $\simeq$ denotes [_homotopy equivalence_][1] between
sets, which you can think of as basically a fancy isomorphism. For some
function $f : A \rightarrow B$, we say that $f$ is an equivalence[^equivalence]
if:

[^equivalence]: There are other ways to define equivalences. As we'll show, an important
property that is missed by this definition is that equivalences should be _mere
propositions_. The reason why this definition falls short of that requirement is
shown by Theorem 4.1.3 in the [HoTT book][book].

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
bool-id : 𝟚 → 𝟚
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
pair[^dependent-pair]:

[^dependent-pair]: A dependent pair (or $\Sigma$-type) is like a regular pair $\langle x, y\rangle$, but where $y$ can depend on $x$.
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
bool-eqv : 𝟚 ≃ 𝟚
bool-eqv = bool-id , bool-id-eqv
```

Great! Now what?

## The space of equivalences

Turns out, the definition I gave above is just _one_ of multiple possible
equivalences between the boolean type and itself. Here is another possible
definition:

```
bool-neg : 𝟚 → 𝟚
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

bool-eqv2 : 𝟚 ≃ 𝟚
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
main-theorem : (𝟚 ≃ 𝟚) ≃ 𝟚
```

How do we do this? Well, remember what it means to define an equivalence: first
define a function, then show that it is an equivalence. Since equivalences are
symmetrical, it doesn't matter which way we start first. I'll choose to first
define a function $2 \rightarrow 2 \simeq 2$. This is fairly easy to do by
case-splitting:

```
f : 𝟚 → (𝟚 ≃ 𝟚)
f true = bool-eqv
f false = bool-eqv2
```

This maps `true` to the equivalence derived from the identity function, and
`false` to the function derived from the negation function.

Now we need another function in the other direction. We can't case-split on
functions, but we can certainly case-split on their output. Specifically, we can
differentiate `id` from `neg` by their behavior when being called on `true`:

- $\textrm{id}(\textrm{true}) :\equiv \textrm{true}$
- $\textrm{neg}(\textrm{true}) :\equiv \textrm{false}$

```
g : (𝟚 ≃ 𝟚) → 𝟚
g eqv = (fst eqv) true
  -- same as this:
  -- let (f , f-is-equiv) = eqv in f true
```

Hold on. If you know about the cardinality of functions, you'll observe that in
the space of functions $f : 2 \rightarrow 2$, there are $2^2 = 4$ equivalence
classes of functions. So if we mapped 4 functions into 2, how could this be
considered an equivalence?

A **key observation** here is that we're not mapping from all possible functions
$f : 2 \rightarrow 2$. We're mapping functions $f : 2 \simeq 2$ that have
already been proven to be equivalences. This means we can count on them to be
structure-preserving, and can rule out cases like the function that maps
everything to true, since it can't possibly have an inverse.

We'll come back to this later.

First, let's show that $g \circ f \sim \textrm{id}$. This one is easy, we can
just case-split. Each of the cases reduces to something that is definitionally
equal, so we can use `refl`.

```
g∘f : (g ∘ f) ∼ id
g∘f true = refl
g∘f false = refl
```

Now comes the complicated case: proving $f \circ g \sim \textrm{id}$.

> [!admonition: NOTE]
> Since Agda's comment syntax is `--`, the horizontal lines in the code below
> are simply a visual way of separating out our proof premises from our proof
> goals.

```
module f∘g-case where
  goal :
    (eqv : 𝟚 ≃ 𝟚)
    --------------------
    → f (g eqv) ≡ id eqv

  f∘g : (f ∘ g) ∼ id
  f∘g eqv = goal eqv
```

Now our goal is to show that for any equivalence $\textrm{eqv} : 2 \simeq 2$,
applying $f ∘ g$ to it is the same as not doing anything. We can evaluate the
$g(\textrm{eqv})$ a little bit to give us a more detailed goal:

```
  goal2 :
    (eqv : 𝟚 ≃ 𝟚)
    --------------------------
    → f ((fst eqv) true) ≡ eqv

  -- Solving goal with goal2, leaving us to prove goal2
  goal eqv = goal2 eqv
```

The problem is if you think about equivalences as encoding some rich data about
a function, converting it to a boolean and back is sort of like shoving it into
a lower-resolution domain and then bringing it back. How can we prove that the
equivalence is still the same equivalence, and as a result proving that there
are only 2 possible equivalences?

Note that the function $f$ ultimately still only produces 2 values. That means
if we want to prove this, we can case-split on $f$'s output. In Agda, this uses
a syntax known as [with-abstraction]:

[with-abstraction]: https://agda.readthedocs.io/en/v2.6.4.3-r1/language/with-abstraction.html

```
  goal3 :
    (eqv : 𝟚 ≃ 𝟚) → (b : 𝟚) → (p : fst eqv true ≡ b)
    ------------------------------------------------
    → f b ≡ eqv

  -- Solving goal2 with goal3, leaving us to prove goal3
  goal2 eqv with b ← (fst eqv) true in p = goal3 eqv b p
```

We can now case-split on $b$, which is the output of calling $f$ on the
equivalence returned by $g$. This means that for the `true` case, we need to
show that $f(b) = \textrm{bool-eqv}$ (which is based on `id`) is equivalent to
the equivalence that generated the `true`.

Let's start with the `id` case; we just need to show that for every equivalence
$e$ where running the equivalence function on `true` also returned `true`, $e
\equiv f(\textrm{true})$.

Unfortunately, we don't know if this is true unless our equivalences are _mere
propositions_, meaning if two functions are identical, then so are their
equivalences.

$$
  \textrm{isProp}(P) :\equiv \prod_{x, y: P}(x \equiv y)
$$

<small>Definition 3.3.1 from the [HoTT book][book]</small>

Applying this to $\textrm{isEquiv}(f)$, we get the property:

$$
  \sum_{f : A → B} \left( \prod_{e_1, e_2 : \textrm{isEquiv}(f)} e_1 \equiv e_2 \right)
$$

This proof is shown later in the book, so I will use it here directly without proof[^equiv-isProp]:

[^equiv-isProp]: This is shown in Theorem 4.2.13 in the [HoTT book][book].
I might write a separate post about that when I get there, it seems like an interesting proof as well!

```
  postulate
    equiv-isProp : {A B : Set}
      → (e1 e2 : A ≃ B) → (Σ.fst e1 ≡ Σ.fst e2)
      -----------------------------------------
      → e1 ≡ e2
```

Now we're going to need our **key observation** that we made earlier, that
equivalences must not map both values to a single one.
This way, we can pin the behavior of the function on all inputs by just using
its behavior on `true`, since its output on `false` must be _different_.

We can use a proof that [$\textrm{true} \not\equiv \textrm{false}$][true-not-false] that I've shown previously.

[true-not-false]: https://mzhang.io/posts/proving-true-from-false/

```
  true≢false : true ≢ false
      -- read: true ≡ false → ⊥
  true≢false p = bottom-generator p
    where
      map : 𝟚 → Set
      map true = ⊤
      map false = ⊥

      bottom-generator : true ≡ false → ⊥
      bottom-generator p = transport map p tt
```

Let's transform this into information about $f$'s output on different inputs:

```
  observation : (f : 𝟚 → 𝟚) → isEquiv f → f true ≢ f false
                                 -- read: f true ≡ f false → ⊥
  observation f (mkEquiv g f∘g g∘f) p =
    let
      -- Given p : f true ≡ f false
      -- Proof strategy is to call g on it to get (g ∘ f) true ≡ (g ∘ f) false
      -- Then, use our equivalence properties to reduce it to true ≡ false
      -- Then, apply the lemma true≢false we just proved
      step1 = ap g p
      step2 = sym (g∘f true) ∙ step1 ∙ (g∘f false)
      step3 = true≢false step2
    in step3
```

For convenience, let's rewrite this so that it takes in an arbitrary $b$ and
returns the version of the inequality we want:

```
  observation' : (f : 𝟚 → 𝟚) → isEquiv f → (b : 𝟚) → f b ≢ f (bool-neg b)
                                                  -- ^^^^^^^^^^^^^^^^^^^^
  observation' f eqv true p = observation f eqv p
  observation' f eqv false p = observation f eqv (sym p)
```

Then, solving the `true` case is simply a matter of using function
extensionality (functions are equal if they are point-wise equal) to show that
just the function part of the equivalences are identical, and then using this
property to prove that the equivalences must be identical as well.

```
  goal3 eqv true p = equiv-isProp bool-eqv eqv functions-equal
    where
      e = fst eqv

      pointwise-equal : (x : 𝟚) → e x ≡ x
      pointwise-equal true = p
      pointwise-equal false with ef ← e false in eq = helper ef eq
        where
          helper : (ef : 𝟚) → e false ≡ ef → ef ≡ false
          helper true eq = rec-⊥ (observation' e (snd eqv) false (eq ∙ sym p))
          helper false eq = refl

      -- NOTE: fst bool-eqv = id, definitionally
      functions-equal : id ≡ e
      functions-equal = sym (funExt pointwise-equal)
```

The `false` case is proved similarly.

```
  goal3 eqv false p = equiv-isProp bool-eqv2 eqv functions-equal
    where
      e = fst eqv

      pointwise-equal : (x : 𝟚) → e x ≡ bool-neg x
      pointwise-equal true = p
      pointwise-equal false with ef ← e false in eq = helper ef eq
        where
          helper : (ef : 𝟚) → e false ≡ ef → ef ≡ true
          helper true eq = refl
          helper false eq = rec-⊥ (observation' e (snd eqv) true (p ∙ sym eq))

      functions-equal : bool-neg ≡ e
      functions-equal = sym (funExt pointwise-equal)
```

Putting this all together, we get the property we want to prove:

```
open f∘g-case

-- main-theorem : (𝟚 ≃ 𝟚) ≃ 𝟚
main-theorem = g , mkEquiv f g∘f f∘g
```

Now that Agda's all happy, our work here is done!

Going through all this taught me a lot about how the basics of equivalences work
and how to express a lot of different ideas into the type system. Thanks for
reading!
