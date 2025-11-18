---
title: "building a formal cek machine in agda"
draft: true
date: 2022-02-02
tags: ["computer-science", "programming-languages", "formal-verification", "lambda-calculus"]
languages: ["agda"]
toc: true
---

<!--more-->

Last semester, I took a course on reasoning about programming languages using
Agda, a dependently typed meta-language. For the term project, we were to
implement a simply-typed lambda calculus with several extensions, along with
proofs of certain properties.

My lambda calculus implemented `call/cc` on top of a CEK machine.

<details>
  <summary><b>Why is this interesting?</b></summary>

Reasoning about languages is one way of ensuring whole-program correctness.
Building up these languages from foundations grounded in logic helps us
achieve our goal with more rigor.

As an example, suppose I wrote a function that takes a list of numbers and
returns the maximum value. Mathematically speaking, this function would be
_non-total_; an input consisting of an empty set would not produce reasonable
output. If this were a library function I'd like to tell people who write code
that uses this function "don't give me an empty list!"

But just writing this in documentation isn't enough. What we'd really like is
for a tool (like a compiler) to tell any developer who is trying to pass an
empty list into our maximum function "You can't do that." Unfortunately, most
of the popular languages being used today have no way of describing "a list
that's not empty."

We still have a way to prevent people from running into this problem, though
it involves pushing the problem to runtime rather than compile time. The
maximum function could return an "optional" maximum. Some languages'
implementations of optional values force programmers to handle the "nothing"
case, while others ignore it silently. But in the more optimistic case, even
if the list was empty, the caller would have handled it and treated it
accordingly.

This isn't a pretty way to solve this problem. _Dependent types_ gives us
tools to solve this problem in an elegant way, by giving the type system the
ability to contain values. This also opens its own can of worms, but for
questions about program correctness, it is more valuable than depending on
catching problems at runtime.

</details>

## Lambda calculus

The lambda calculus is a mathematical structure for describing computation. At
the most basic level, it defines a concept called a _term_. Everything that can
be represented in a lambda calculus is some combination of terms. A term can
have several constructors:

- **Var.** This is just a variable, like `x` or `y`. During evaluation, a
  variable can resolve to a value in the evaluation environment by name. If
  the environment says `{ x = 5 }`, then evaluating `x` would result in 5.

- **Abstraction, or lambda (λ).** An _abstraction_ is a term that describes some
  other computation. From an algebraic perspective, it can be thought of as a
  function with a single argument (i.e f(x) = 2x is an abstraction, although
  it would be written `(λx.2x)`)

- **Application.** Application is sort of the opposite of abstraction, exposing
  the computation that was abstracted away. From an algebraic perspective,
  this is just function application (i.e applying `f(x) = 2x` to 3 would
  result in 2\*3. Note that only a simple substitution has been done and
  further evaluation is required to reduce 2\*3)

### Why?

The reason it's set up this way is so we can reason about terms inductively. The
idea is that because terms are just nested constructors, we can describe the
behavior of any term by just defining the behavior of these 3 constructors.

Interestingly, the lambda calculus is Turing-complete, so any computation can be
reduced to those 3 constructs. I used numbers liberally in the examples above,
but in a lambda calculus without numbers, you could define integers recursively
like this:

- Let `z` represent zero.
- Let `s` represent a "successor", or increment function. `s(z)` represents 1,
  `s(s(z))` represents 2, and so on.

In lambda calculus terms, this would look like:

- 0 = `λs.(λz.z)`
- 1 = `λs.(λz.s(z))`
- 2 = `λs.(λz.s(s(z)))`
- 3 = `λs.(λz.s(s(s(z))))`

In practice, many lambda calculus have a set of "base" values from which to
build off, such as unit values, booleans, and natural numbers (having numbers in
the language means we don't need the `s` and `z` dance to refer to them).

### Turing completeness

As I noted above, the lambda calculus is _Turing-complete_. One feature of
Turing complete systems is that they have a (provably!) unsolvable "halting"
problem. Most of the simple term shown above terminate predictably. But as an
example of a term that doesn't halt, consider the _Y combinator_, an example of
a fixed-point combinator:

    Y = λf.(λx.f(x(x)))(λx.f(x(x)))

If you tried calling Y on some term, you will find that evaluation will quickly
expand infinitely. That makes sense given its purpose: to find a _fixed point_
of whatever function you pass in.

> As an example, the fixed-point of the function f(x) = sqrt(x) is 1. That's
> because f(1) = 1. The Y combinator attempts to find the fixed point by simply
> applying the function multiple times. In the untyped lambda calculus, this can
> be used to implement simple (but possibly unbounded) recursion.

Because there are terms that may not terminate, the untyped lambda calculus is
not very useful for logical reasoning. Instead, we add some constraints on it
that makes evaluation total, at the cost of losing Turing-completeness.

### Simply-typed lambda calculus

The simply-typed lambda calculus (STLC) adds types to every term. Types are
crucial to any kind of static program analysis. Suppose I was trying to apply
the term `5` to `6`. As humans we can look at that and instantly recognize that
the evaluation would be invalid, yet under the untyped lambda calculus, it would
be completely representable.

To solve this in STLC, we make this term completely unrepresentable at all. To
say you want to apply 5 to 6 would not be a legal STLC term. That's because all
STLC terms are untyped lambda calculus terms accompanied by a _type_.

This gives us more information about what's allowed before we run the
evaluation. For example, numbers may have their own type `Nat` (for "natural
number"), while functions have a special "arrow" type `_ -> _`, where the
underscores represent other types. A function that takes a number and returns a
boolean (like isEven) would have the type `Nat -> Bool`, while a function that
takes a boolean and returns another boolean would be `Bool -> Bool`.

With this, we have a framework for rejecting terms that would otherwise be legal
in untyped lambda calculus, but would break when we tried to evaluate them. A
function application would be able to require that the argument is the same type
as what the function is expecting.

A semi-formal definition for STLC terms would look something like this:

- **Var.** Same as before, it's a variable that can be looked up in the
  environment.

- **Abstraction, or lambda (λ).** This is a function that carries three pieces
  of information: (1) the name of the variable that its input will be
  substituted for, (2) the _type_ of the input, and (3) the body in which the
  substitution will happen.

- **Application.** Same as before.

It doesn't seem like much has changed. But all of a sudden, _every_ term has a
type.

- `5 :: Nat`
- `λ(x:Nat).2x :: Nat -> Nat`
- `isEven(3) :: (Nat -> Bool) · Nat = Bool`

Notation: (`x :: T` means `x` has type `T`, and `f · x` means `f` applied to
`x`)

This also means that some values are now unrepresentable:

- `isEven(λx.2x) :: (Nat -> Bool) · (Nat -> Nat)` doesn't work because the type
  of `λx.2x :: Nat -> Nat` can't be used as an input for `isEven`, which is
  expecting a `Nat`.

We have a good foundation for writing programs now, but this by itself can't
qualify as a system for computation.

## CEK machine

A CEK machine is responsible for evaluating a lambda calculus term.
