---
title: The Lambda Calculus
date: 2024-04-04T21:45:28.264
draft: true
toc: true
languages: ["typst"]
tags: ["typst"]
---

The lambda calculus is an abstract machine for modeling computation. In this
tutorial I will build up the lambda calculus from scratch.

## Expressions

Let's start with expressions. You've probably encountered these in math class.
They look like things like:

- $3$
- $5 \times 5$
- $2\sqrt{12} - 5i$

Some of these probably look like they can be simplified. That's fine! We're not
worried about that yet. The computation aspect will come in a bit.

### Expression Trees

The important thing here is that all of these have some tree-like structure. For
example, look at $5 \times 5$:

```typst
#import "@preview/fletcher:0.4.3" as fletcher: *
#set page(width: auto, height: auto, margin: (x: 0.25pt, y: 0.25pt))
#set text(18pt)
#diagram(cell-size: 0.5cm, $
    & times edge("dl", ->) edge("dr", ->) \
    5 & & 5 \
$)
```

And that last one, $2\sqrt{12} - 5i$:

```typst
#import "@preview/fletcher:0.4.3" as fletcher: *
#import math
#set page(width: auto, height: auto, margin: (x: 0.5em, y: 0.5em))
#set text(18pt)
#diagram(cell-size: 0.5cm, {
    node(pos: (0, 0), label: $-$)
    node(pos: (-1, 1), label: $times$)
    node(pos: (1, 1), label: $times$)
    edge((0, 0), (-1, 1))
    edge((0, 0), (1, 1))
    node(pos: (-1.5, 2), label: $2$)
    node(pos: (-0.5, 2), label: $math.sqrt(...)$)
    node(pos: (-0.5, 3), label: $12$)
    edge((-1, 1), (-1.5, 2))
    edge((-1, 1), (-0.5, 2))
    edge((-0.5, 2), (-0.5, 3))
    node(pos: (0.5, 2), label: $5$)
    node(pos: (1.5, 2), label: $i$)
    edge((1, 1), (0.5, 2))
    edge((1, 1), (1.5, 2))
})
```

These follow the order of operations (also known as PEMDAS). They tell you that
_if_ you were going to evaluate this, you would want to apply it in this
fashion.

If you look at each point in the tree, you might notice that there's several different types of branches:

- Numbers, like $2$, $5$, or $12$ don't have any children
- The square root function, $\sqrt{...}$ has 1 child
- The subtraction ($-$) and multiplication ($\times$) functions have 2 children

The important thing to us is to define a **language** for expressions. This
way, we know exactly what kinds of expressions we can build. Let's take the
few operations in the list above and turn it into a **language** for writing
expressions:

$$
    e ::= n \mid \sqrt{e} \mid e - e \mid e \times e
$$

We call these **constructors** of the expression. The notation is a bit dense,
but this essentially means $e$, which is shorthand for _expression_, is defined
to be either of ($|$):

- $n$, which is just a convention meaning "any number"
- $\sqrt{e}$, which means "square root of another expression"
- $e - e$ and $e \times e$, which correspond to subtraction and multiplication respectively

If you look closely, the number of $e$s in each option corresponds exactly to
the number of children it had in the expression tree.

Let's write down an expression language for the lambda calculus. In its simplest form, it looks like this:

$$
    e ::= x \mid \lambda x.e \mid e\; e
$$

Here, $x$ is a convention that stands for "some variable". Without knowing what any of this means, we can already start putting together some expressions:

- $\lambda x.x$
- $\lambda s.(\lambda z.(s\; z))$

As an exercise, try drawing some of the expression trees that correspond to
these expressions. Once you're familiar enough with how expressions are built
syntactically, we can talk about evaluation.

## Evaluation

The expression language we just defined is typically considered the _statics_ of
the language. It defines how we can write down the language. What we're going to
talk about now is the _dynamics_, or how it's evaluated.

<details>
  <summary>Semantics vs. Implementation</summary>

At this point it's probably a good idea to make a note about _semantics_ vs. _implementation_.

Semantics describe the outcome. If my arithmetic language defines
multiplication's _semantics_ it would require that multiplication of two numbers
to achieve another number that has some certain properties, like "repeatedly
subtracting the first number the same number of times as the second number
produces 0."

Implementation, on the other hand, needs to conform to the semantics. If I asked
you to compute $15 \times 16$ by hand, you'd probably bust out some pencil and
paper and do some long form multiplication, where you'd compute a couple of
intermediate results and add them, getting $240$.

A computer, on the other hand, notices $16 = 10000_2$, and just shifts $15 =
0111_2$ over by 4 bits, to get $01110000_2 = 240$. The ways that this same
result was computed were different, but they achieved the same final result, and
that result has the property required by the semantics of multiplication.

Just like the example above, the lambda calculus has several different
implementations of its semantics (for example, the CESK machine or the SECD
machine). They have a more complex stack structure than a straightforward
machine implementation in, for example Python, to take. However, we can prove
that the semantics are the same.

</details>

