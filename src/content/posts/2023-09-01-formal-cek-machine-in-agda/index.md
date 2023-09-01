---
title: Building a formal CEK machine in Agda
draft: true
date: 2023-09-01T13:53:23.974Z
tags:
  - computer-science
  - programming-languages
  - formal-verification
  - lambda-calculus

heroImage: ./header.jpg
heroAlt: gears spinning wallpaper
math: true
toc: true
---

Back in 2022, I took a special topics course, CSCI 8980, on [reasoning about
programming languages using Agda][plfa], a dependently typed meta-language. For
the term project, we were to implement a simply-typed lambda calculus with
several extensions, along with proofs of certain properties.

[plfa]: https://plfa.github.io/

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

## Crash course on the lambda calculus

The [lambda calculus] is a mathematical abstraction for computation. The core
mechanism it uses is a concept called a _term_. Everything that can be
represented in a lambda calculus is some combination of terms. A term can have
several constructors:

[lambda calculus]: https://en.wikipedia.org/wiki/Lambda_calculus

- **Var.** This is just a variable, like $x$ or $y$. By itself it holds no
  meaning, but during evaluation, the evaluation _environment_ holds a mapping
  from variable names to the values. If the environment says $\{ x = 5 \}$, then
  evaluating $x$ would result in $5$.

- **Abstraction, or lambda ($\lambda$).** An _abstraction_ is a term that describes some
  other computation. From an algebraic perspective, it can be thought of as a
  function with a single argument (i.e $f(x) = 2x$ is an abstraction, although
  it would be written using the notation $\lambda x.2x$)

- **Application.** Application is sort of the opposite of abstraction, exposing
  the computation that was abstracted away. From an algebraic perspective,
  this is just function application (i.e applying $f(x) = 2x$ to $3$ would
  result in $2 \times 3 = 6$. Note that only a simple substitution has been done
  and further evaluation is required to reduce $2\times 3$)

### Why?

The reason it's set up this way is so we can reason about terms inductively.
Rather than having lots of syntax for making it easier for programmers to write
a for loop as opposed to a while loop, or constructing different kinds of
values, the lambda calculus focuses on function abstraction and calls, and
strips everything else away.

The idea is that because terms are just nested constructors, we can describe the
behavior of any term by just defining the behavior of these 3 constructors. The
flavorful features of other programming languages can be implemented on top of
the function call rules in ways that don't disrupt the basic function of the
evaluation.

In fact, the lambda calculus is [Turing-complete][tc], so any computation can
technically be reduced to those 3 constructs. I used numbers liberally in the
examples above, but in a lambda calculus without numbers, you could define
integers using a recursive strategy called [Church numerals]. It works like this:

[church numerals]: https://en.wikipedia.org/wiki/Church_encoding

- $z$ represents zero.
- $s$ represents a "successor", or increment function. So:
  - $s(z)$ represents 1,
  - $s(s(z))$ represents 2
  - and so on.

In lambda calculus terms, this would look like:

| number | lambda calculus expression         |
| ------ | ---------------------------------- |
| 0      | $\lambda s.(\lambda z.z)$          |
| 1      | $\lambda s.(\lambda z.s(z))$       |
| 2      | $\lambda s.(\lambda z.s(s(z)))$    |
| 3      | $\lambda s.(\lambda z.s(s(s(z))))$ |

In practice, many lambda calculus incorporate higher level constructors such as
numbers or lists to make it so we can avoid having to represent them using only
a series of function calls. However, any time we add more syntax to a language,
we increase its complexity in proofs, so for now let's keep it simple.

### The Turing completeness curse

As I noted above, the lambda calculus is [_Turing-complete_][tc]. One feature of
Turing complete systems is that they have a (provably!) unsolvable "halting"
problem. Most of the simple terms shown above terminate predictably. But as an
example of a term that doesn't halt, consider the _Y combinator_, an example of
a fixed-point combinator:

[tc]: https://en.wikipedia.org/wiki/Turing_completeness

$$
Y = \lambda f.(\lambda x.f(x(x)))(\lambda x.f(x(x)))
$$

That's quite a mouthful. If you tried calling $Y$ on some term, you will find
that evaluation will quickly expand infinitely. That makes sense given its
purpose: to find a _fixed point_ of whatever function you pass in.

> [!NOTE]
> As an example, the fixed-point of the function $f(x) = \sqrt{x}$ is $1$.
> That's because $f(1) = 1$, and applying $f$ to any other number sort of
> converges in on this value. If you took any number and applied $f$ infinitely
> many times on it, you would get $1$.
>
> In this sense, the Y combinator can be seen as a sort of brute-force approach
> of finding this fixed point by simply applying the function over and over until
> the result stops changing. In the untyped lambda calculus, this can be used to
> implement simple (but possibly unbounded) recursion.

This actually proves disastrous for trying to reason about the logic of a
program. If something is able to recurse on itself without limit, we won't be
able to tell what its result is, and we _definitely_ won't be able to know if
the result is correct. This is why we typically ban unbounded recursion in
proof systems. In fact, you can give proofs for false statements using infinite
recursion.

This is why we actually prefer _not_ to work with Turing-complete languages when
doing logical reasoning on program evaluation. Instead, we always want to add
some constraints on it to make evaluation total, ensuring that we have perfect
information about our program's behavior.

### Simply-typed lambda calculus

The [simply-typed lambda calculus] (STLC, or the notational variant
$\lambda^\rightarrow$) adds types to every term. Types are crucial to any kind
of static program analysis. Suppose I was trying to apply the term $5$ to $6$ (in
other words, call $5$ with the argument $6$ as if $5$ was a function, like
$5(6)$). As humans we can look at that and instantly recognize that the
evaluation would be invalid, yet under the untyped lambda calculus, it would be
completely representable.

[simply-typed lambda calculus]: https://en.wikipedia.org/wiki/Simply_typed_lambda_calculus

To solve this in STLC, we would make this term completely unrepresentable at
all. To say you want to apply $5$ to $6$ would not be a legal STLC term. We do
this by requiring that all STLC terms are untyped lambda calculus terms
accompanied by a _type_.

This gives us more information about what's allowed before we run the
evaluation. For example, numbers may have their own type $\mathbb{N}$ (read
"nat", for "natural number") and booleans are $\mathrm{Bool}$, while functions
have a special "arrow" type $\_\rightarrow\_$, where the underscores represent
other types. A function that takes a number and returns a boolean (like isEven)
would have the type $\mathbb{N} \rightarrow \mathrm{Bool}$, while a function
that takes a boolean and returns another boolean would be $\mathrm{Bool}
\rightarrow \mathrm{Bool}$.

With this, we have a framework for rejecting terms that would otherwise be legal
in untyped lambda calculus, but would break when we tried to evaluate them. A
function application would be able to require that the argument is the same type
as what the function is expecting.

The nice property you get now is that all valid STLC programs will never get
_stuck_, which is being unable to evaluate due to some kind of error. Each term
will either be able to be evaluated to a next state, or is done.

A semi-formal definition for STLC terms would look something like this:

- **Var.** Same as before, it's a variable that can be looked up in the
  environment.

- **Abstraction, or lambda ($\lambda$).** This is a function that carries three pieces
  of information:

  1. the name of the variable that its input will be substituted for
  2. the _type_ of the input, and
  3. the body in which the substitution will happen.

- **Application.** Same as before.

It doesn't really seem like changing just one term changes the language all that
much. But as a result of this tiny change, _every_ term now has a type:

- $5 :: \mathbb{N}$
- $λ(x:\mathbb{N}).2x :: \mathbb{N} \rightarrow \mathbb{N}$
- $isEven(3) :: (\mathbb{N} \rightarrow \mathrm{Bool}) · \mathbb{N} = \mathrm{Bool}$

> [!NOTE]
> Some notation:
>
> - $x :: T$ means $x$ has type $T$, and
> - $f · x$ means $f$ applied to $x$

This also means that some values are now unrepresentable:

- $isEven(λx.2x)$ wouldn't work anymore because the type of the inner argument
  $λx.2x$ would be $\mathbb{N} \rightarrow \mathbb{N}$ can't be used as an input
  for $isEven$, which is expecting a $\mathbb{N}$.

We have a good foundation for writing programs now, but this by itself can't
qualify as a system for computation. We need an abstract machine of sorts that
can evaluate these symbols and actually compute on them.

In practice, there's a number of different possible abstract machines that can
evaluate the lambda calculus. Besides the basic direct implementation, alternate
implementations such as [interaction nets] have become popular due to being able
to be parallelized efficiently.

[interaction nets]: https://en.wikipedia.org/wiki/Interaction_nets

## CEK machine

A CEK machine is responsible for evaluating a lambda calculus term.
