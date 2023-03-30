+++
title = "Inductive Types"
date = 2023-03-26
tags = ["type-theory"]
math = true
draft = true

language_switcher_languages = ["ocaml", "python"]
+++

There's a feature common to many functional languages, the ability to have
algebraic data types. It might look something like this:

{{< language-switcher >}}
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

```python
from typing import Literal
MyBool = Literal[True] | Literal[False]
```
{{</ language-switcher >}}

> **Note:** I'm using an experimental language switcher. It's implemented in
> pure CSS using a feature called the [`:has` pseudo-class][has]. As of writing,
> all major browsers _except_ Firefox has it implemented and enabled by default.
> For Firefox there does exist a feature flag in about:config, but your mileage
> may vary.

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

{{< language-switcher >}}
```ocaml
type WeirdType =
| Foo
| Bar
```

---

```python
from typing import Literal
WeirdType = Literal['foo'] | Literal['bar']
```
{{</ language-switcher >}}

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

{{< language-switcher >}}
```ocaml
type unit =
| Unit
```

---

```python
from typing import Literal
Unit = Literal[None]
```
{{</ language-switcher >}}

There's only one way to ever construct something of this type, so the
cardinality of this type would be 1.

## Doing Things with Types

Creating types and making values of those data types is just the first part
though. It would be completely uninteresting if all we could do is create types.
So, the way we typically use these types is through _pattern matching_ (also
called structural matching in some languages).

Let's see an example. Suppose I have a type with three values, defined like
this:

{{< language-switcher >}}
```ocaml
type direction =
| Left
| Middle
| Right
```

---

```python
from typing import Literal
Direction = Literal['left'] | Literal['middle'] | Literal['right']
```
{{</ language-switcher >}}

If I was given a value with a type of direction, but I wanted to do different
things depending on exactly which direction it was, I could use _pattern
matching_ like this:

{{< language-switcher >}}
```ocaml
let do_something_with (d : direction) =
  match d with
  | Left -> do_this_if_left
  | Middle -> do_this_if_middle
  | Right -> do_this_if_right
```

---

```python
def do_something_with(d : Direction) -> str:
  match inp:
    case 'left': return do_this_if_left
    case 'middle': return do_this_if_middle
    case 'right': return do_this_if_right
    case _: assert_never(inp)
```

**Note:** the `assert_never` is a static check for exhaustiveness. If we missed
a single one of the cases, a static type checker like [pyright] could catch it
and tell us which of the remaining cases there are.
{{</ language-switcher >}}

This gives me a way to discriminate between the different variants of
`direction`.

> Most languages have a built-in construct for discriminating between values of
> the `Boolean` type, called if-else. What would if-else look like if you wrote
> it as a function in this pattern-matching form?

## Constructing larger types

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

{{< language-switcher >}}
```ocaml
type nat =
| Suc of nat
| Zero
```
{{</ language-switcher >}}

These are the natural numbers, which are defined inductively. Each number is
just represented by a data type that wraps 0 that number of times. So 3 would be
`Suc (Suc (Suc Zero))`.

At this point you can probably see why these have _infinite_ cardinality: with
the Suc case, you can keep wrapping nats as many times as you want!

One key observation here is that although the _cardinality_ of the entire type is
infinite, it only uses _two_ constructors to build it. This also means that if
we want to talk about writing any functions on `nat`, we just have to supply 2
cases instead of an infinite number of cases:

```ocaml
let rec is_even = fun (n : nat) ->
  match n with
  | Zero -> true
  | Suc n1 -> not (is_even n1)
```

<details>
  <summary>Try it for yourself</summary>

  If you've got an OCaml interpreter handy, try a couple values for yourself and
  convince yourself that this accurately represents the naturals and an even
  testing function:

  ```ocaml
  utop # is_even Zero;;
  - : bool = true
  utop # is_even (Suc Zero);;
  - : bool = false
  ```

  This is a good way of making sure the functions you write make sense!
</details>

## Induction principle

Let's express this in the language of mathematical induction. If I have any
natural number:

- If the natural number is the base case of zero, then the `is_even` relation
    automatically evaluates to true.
- If the natural number is a successor, invert the induction hypothesis (which is
    what `is_even` evaluates to for the previous step, a.k.a whether or not the
    previous natural number is even), since every even number is succeeded by
    an odd number and vice versa.

Once these rules are followed, by induction we know that `is_even` can run on
any natural number ever. In code, this looks like:

```ocaml
let is_even
    (n_zero : bool)
    (n_suc : nat -> bool)
    (n : nat)
  : bool =
  match n with
  | Zero -> n_zero
  | Suc n1 -> n_suc n1
```

where n_zero defines what to do with the zero case, and n_suc defines what to do
with the successor case.

You might've noticed that this definition doesn't actually return any booleans.
That's because this is not actually the is_even function! This is a general
function that turns any natural into a boolean. In fact, we can go one step
further and generalize this to all types:

```ocaml
let nat_transformer
    (n_zero : 'a)
    (n_suc : 'a -> 'a)
    (n : nat)
  : 'a =
  match n with
  | Zero -> n_zero
  | Suc n1 -> n_suc n1
```

Let's say I wanted to write a function that converts from our custom-defined nat
type into an OCaml integer. Using this constructor, that would look something
like this:

```ocaml
let convert_nat = nat_transformer 0 (fun x -> x + 1)
```



TODO: Talk about https://counterexamples.org/currys-paradox.html

[has]: https://developer.mozilla.org/en-US/docs/Web/CSS/:has
[pyright]: https://github.com/microsoft/pyright
