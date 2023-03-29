+++
title = "Inductive Types"
slug = "inductive-types"
date = 2023-03-26
tags = ["type-theory"]
math = true
draft = true
+++

There's a feature common to many functional languages, the ability to have
algebraic data types. It might look something like this (OCaml syntax):

```ocaml
type bool =
| True
| False
```

For those who are unfamiliar with the syntax, I'm defining a type called `bool`
that has two _constructors_, or ways to create this type. The constructors are
`True` and `False`. This means:

1. Any time I use the value `True`, it's understood to have type `bool`.
2. Any time I use the value `False`, it's understood to have type `bool`.
3. In addition, there are _no_ other ways to create values of `bool` other than combining `True` and `False` constructors.

---

Many languages have this feature, under different names. Tagged unions, variant
types, enumerations, but they all reflect a basic idea: a type with a limited
set of variants.

Now, in type theory, one of the interesting things to know about a type is its
_cardinality_. For example, the type `Boolean` is defined to have cardinality 2.
That's because there's only one constructor, so if at any point you have some
unknown value of type `Boolean`, you know it can only take one of two values.

<details>
  <summary>Note about Booleans</summary>

There's actually nothing special about boolean itself. I could just as easily
define a new type, like this:

```ocaml
type WeirdType =
| Foo
| Bar
```

Because this type can only have two values, it's _semantically_ equivalent to
the `Boolean` type. I could use it anywhere I would typically use `Boolean`.

I would have to define my own operators such as AND and OR separately, but
those aren't properties of the `Boolean` type itself, they are properties of
the Boolean algebra, which has several [algebraic properties][1] such as
associativity, commutativity, distributivity, and several others. Think of it
as a sort of _interface_, where if you can implement that interface, your type
qualifies as a Boolean algebra!

[1]: https://en.wikipedia.org/wiki/Boolean_algebra_(structure)#Definition

</details>

You can make any _finite_ type like this: just create an algebraic data type
with unit constructors, and the result is a type with a finite cardinality. If I
wanted to make a unit type for example:

```ocaml
type unit =
| Unit
```

There's only one way to ever construct something of this type, so the
cardinality of this type would be 1.

## Doing Things with Types

Creating types and making values of those data types is just the first part
though. It would be completely uninteresting if all we could do is create types.
So, the way we typically use these types is through _pattern matching_ (also
called structural matching in some languages).

Let's see an example. Suppose I have a type with three values, defined like
this:

```ocaml
type direction =
| Left
| Middle
| Right
```

If I was given a value with type `direction`, but I wanted to do different
things depending on exactly which direction it was, I could use _pattern
matching_ like this:

```ocaml
let do_something_with (d : direction) =
  match d with
  | Left -> do_this_if_left
  | Middle -> do_this_if_middle
  | Right -> do_this_if_right
```

This gives me a way to discriminate between the different variants of
`direction`.

> Most languages have a built-in construct for discriminating between values of
> the `Boolean` type, called if-else. What would if-else look like if you wrote
> it as a function in this pattern-matching form?

## The Algebra of Types

Finite-cardinality types like the ones we looked at just now are nice, but
they're not super interesting. If you had a programming language with nothing
but those, it would be very painful to write in! This is where _type
constructors_ come in.

When I say type constructor, I mean a type that can take types and build other
types out of them. There's several ways this can be done, but the one I want to
discuss today is called _inductive_ types.

> If you don't know what induction is, the [Wikipedia article][2] on it is a
> great place to start!
>
> [2]: https://en.wikipedia.org/wiki/Mathematical_induction

The general idea is that we can build types using either base cases (variants
that don't contain themselves as a type), or inductive cases (variants that _do_
contain themselves as a type).

You can see an example of this here:

```ocaml
type nat =
| Suc of nat
| Zero
```

These are the natural numbers, which are defined inductively. Each number is
just represented by a data type that wraps 0 that number of times. So 3 would be
`Suc (Suc (Suc Zero))`.

This data type is _inductive_ because the `Suc` case can contain arbitrarily
many `nat`s inside of it. This also means that if we want to talk about writing
any functions on `nat`, we just have to supply 2 cases instead of an infinite
number of cases:

```ocaml
let is_even = fun (x : nat) ->
  match x with
  | Suc n -> not (is_even n)
  | Zero -> true
```
