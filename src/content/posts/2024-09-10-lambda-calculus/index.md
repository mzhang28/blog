---
title: The lambda calculus
date: 2024-09-10T10:16:12.486Z
type: default
draft: true
tags: [pl-theory]
---

If you want to analyze something, one useful approach is to try to start with
some smaller, minimal version of it, making observations about it, and then
generalizing those observations.

One particularly useful tool for analyzing and developing programming languages
is the **lambda calculus**, an amazingly simple abstract machine that can
represent all [Turing-complete] computation.

Due to its simplicity, there are numerous ways to extend it. In fact, the
standard way for researchers to introduce new language features is to extend the
lambda calculus with their feature, and prove properties about it.

Not only is it useful as a reasoning tool, some compilers may use a variant of
lambda calculus as an intermediate language for compilation. GHC famously uses a
variant of System F as its Core language.

[Turing-complete]: https://en.wikipedia.org/wiki/Turing_completeness

In this blog post series, I'll introduce the lambda calculus in its most basic
form, introduce some conventions when it comes to defining languages like this,
writing an interpreter for it, and then writing some extensions.

## Abstract machines

Firstly, what is an abstract machine? We think of real machines as mechanical
beings, that behave according to some rules. If I punch in 1 + 1 into my
calculator, and hit enter, I expect it to return 2.

In reality, there's all sorts of reasons that calculation could possibly fail,
battery too low, the chip is overheating, [cosmic rays], just to name a few.
From a mathematical point of view, these are all uninteresting failure cases we
would rather just ignore.

[cosmic rays]: https://en.wikipedia.org/wiki/Single-event_upset

What we could do is distill _just_ the rules into some form we can reason about.
We could just simulate its execution in our heads and confirm that the rules we
created are nice.

## The lambda calculus

The lambda calculus is essentially an abstract machine where the only operation
that's defined is function call. The only operations you need are:

- Make a function (which we call a "lambda", or $\lambda$)
- Call a function

That's it. That's all there is to it.

Here's the identity function:

$$
\lambda x . x
$$

Here's a function that calls its first input on its second:

$$
\lambda f . (\lambda x . f (x))
$$

Taking in multiple arguments can be represented by just nesting lambdas.

## Representing numbers

With a language this simple, how can you possibly do anything with it? Can you
even do arithmetic?

It turns out the answer is yes, as long as you _encode_ numbers in a particular
way. One clever way is by using [Church encoding]. Here are some of the first
few natural numbers written with Church encoding:

[Church encoding]: https://en.wikipedia.org/wiki/Church_encoding

- 0 is $\lambda s . \lambda z . z$
- 1 is $\lambda s . \lambda z . s(z)$
- 2 is $\lambda s . \lambda z . s(s(z))$
- 3 is $\lambda s . \lambda z . s(s(s(z)))$

See the pattern? $s$ represents a "successor" function, and $z$ represents zero.
Note that what we pass in for $s$ and $z$ don't matter, as long as $s$ is a
function.

With this, we can imagine a "plus" operator that simply takes 2 numbers $a$ and
$b$, then calls $a$ (since it's a function) using $b$ as the "zero" value. Here it is:

$$
\mathsf{plus} :\equiv \lambda a . \lambda b . \lambda s . \lambda z . a(s)(b(s)(z))
$$

If this doesn't make sense, try plugging 2 and 3 from above and simplifying a
bit to convince yourself that this function works.

There's also ways to encode different things like rational numbers, booleans,
pairs, and lists. See the [Church encoding] Wikipedia page for more.

## Formal definition

Now that we have the intuition down, let's go on to a more formal definition.

The lambda calculus is a _language_. In this language we have terms that can get
evaluated. Terms are commonly described with a [grammar], which tell us how
terms in this language can be constructed. The grammar for the lambda calculus
is incredibly simple:

[grammar]: https://en.wikipedia.org/wiki/Formal_grammar

$$
\mathsf{Term} \; t ::= x \; | \; \lambda x . t \; | \; t(t)
$$

This says that there are only 3 possible terms:

1. $x$, which is our convention for some kind of variable or name
2. $\lambda x . t$, which creates a lambda function that takes an input called $x$ and returns another term $t$
3. $t(t)$ which is just function application, one term calling another

All of the terms above, including $\mathsf{plus}$, can be represented as a
combination of these constructors.

Great, but we can't really do anything if all we know is how to write down some
terms. We need some rules to tell us how to evaluate it. Something like this:

$$
(\lambda x . t_1) (t_2) \longmapsto \mathsf{subst}_{x \mapsto t_2} t_1
$$

Slightly inventing notation here, but essentially whenever we see a lambda being
applied to something, we should substitute the thing applied into the body of
the lambda everywhere we see that $x$. This isn't really a formal definition,
just kind of a vague descriptor. There's too many loose ends; what is
substitution? How do we keep track of what variables have which values? Where
does the result go? Let's go back and introduce a few more concepts to clean up
the formal definition.

### Contexts

### Substitution

### Values

### Judgments

### Rules
