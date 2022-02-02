+++
title = "a formal cek machine in agda"
draft = true
date = 2022-02-02
tags = ["computer-science", "programming-languages", "formal-verification", "lambda-calculus"]
languages = ["agda"]
layout = "single"
toc = true
+++

<!--more-->

Last semester, I took a course on reasoning about programming languages using
Agda, a dependently typed meta-language. For the term project, we were to
implement a simply-typed lambda calculus with several extensions, along with
proofs of certain properties.

My lambda calculus implemented `call/cc` on top of a CEK machine.

## Foreword

**Why is this interesting?** Reasoning about languages is one way of ensuring
whole-program correctness. Building up these languages from foundations grounded
in logic helps us achieve our goal with more rigor.

As an example, suppose I wrote a function that takes a list of numbers and
returns the maximum value. Mathematically speaking, this function would be
_non-total_; an input consisting of an empty set would not produce reasonable
output! If this were a library function I'd like to tell people who write code
that uses this function "don't give me an empty list!"

Unfortunately, just writing this in documentation isn't enough. What we'd really
like is for a tool (like a compiler) to tell any developer who is trying to pass
an empty list into our maximum function "You can't do that." Unfortunately, most
of the popular languages being used today have no way of describing "a list
that's not empty."

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
    further evaluation is required to reduce 2*3)

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
problem.

### Simply-typed lambda calculus (STLC)

## CEK machine

A CEK machine
