+++
title = "Programmable Proofs"
date = 2023-04-20
tags = ["type-theory"]
math = true
draft = true
+++

Today I'm going to convince you that data types in programming are the same as
[_propositions_][proposition] in the logical sense. Using this, we can build an
entire proof system on top of a programming language and verify mathematical
statements purely with programs.

To make this idea more approachable, I'm going to stick to using [Typescript]
for some of the starting examples to explain the concepts. Then, we'll go and
see how this stacks up in a language designed for writing mathematical proofs.

---

If we're going to talk about type theory, let's start by bringing some types to
the table. In Typescript, there's a very simple way to create a type: defining a
class! We can make new classes in Typescript like this:

```ts
class Cake {}
```

Simple enough. `Cake` is a type now. What does being a type mean?

- We can make some `Cake` like this:

  ```ts
  let cake1 = new Cake();
  let cake2 = new Cake();
  ```

- We can use it in function definitions, like this:

  ```ts
  function giveMeCake(cake: Cake) { ... }
  ```

- We can put it in other types, like this:

  ```ts
  type Party = { cake: Cake, balloons: Balloon[], ... };
  ```

  This creates a `Party` object that contains a `Cake`, some `Balloon`s, and
  possibly some other things.

Ok that's cool. But we're curious people, so suppose we decide to have some fun
and make a class that doesn't have a constructor:

```ts
class NoCake {
  private constructor() {}
}
```

> I admit, there still is a constructor, but just a private one, which means you
> can't call it from outside the class. Same thing in effect.

In Typescript and many OO languages it's based on, classes are given public
constructors by default. This lets anyone create an instance of the class, and
get all the great benefits we just talked about above. But when we lock down the
constructor, we can't just freely create instances of this class anymore.

<details>
  <summary>Why might we want to have private constructors?</summary>

Let's say you had integer user IDs, and in your application whenever you wrote
a helper function that had to deal with user IDs, you had to first check that
it was a valid ID:

```ts
/** @throws {Error} */
function getUsername(id: number): string {
  // First, check if id is even a valid id...
  if (!isIdValid(id)) throw new Error("Invalid ID");

  // Ok, now we are sure that id is valid.
  ...
}
```

It would be really nice if we could make a type to encapsulate this, so that
we know that every instance of this class was a valid id, rather than passing
around numbers and doing the check every time.

```ts
function getUsername(id: UserId): string {
  // We can just skip the first part entirely now!
  // Because of the type of the input, we are sure that id is valid.
  ...
}
```

Note that the function also won't throw an exception for an invalid id
anymore! That's because we're moving the check somewhere else. You could
probably imagine what an implementation of this "somewhere else" looks like:

```ts
class UserId {
  private id: number;

  /** @throws {Error} */
  constructor(id: number) {
    // First, check if id is even a valid id...
    if (!isIdValid(id)) throw new Error("Invalid ID");

    this.id = number;
  }
}
```

This is one way to do it. But throwing exceptions from constructors is
typically bad practice. This is because constructors are meant to be the final
step in creating a particular object and should always return successfully and
not have side effects. So in reality, what we want is to put this into a
_static method_ that can create `UserId` objects:

```ts
class UserId {
  private id: number;
  constructor(id: number) {
    this.id = id;
  }

  /** @throws {Error} */
  fromNumberChecked() {
    // First, check if id is even a valid id...
    if (!isIdValid(id)) throw new Error("Invalid ID");
    return new UserId(id);
  }
}
```

But this doesn't work if the constructor is also public, because someone can
just **bypass** this check function and call the constructor anyway with an
invalid id! We need to limit the constructor, so that all attempts to create
a `UserId` instance goes through our function:

```ts
class UserId {
  private id: number;
  private constructor(id: number) {
    this.id = id;
  }

  /** @throws {Error} */
  fromNumberChecked() {
    // First, check if id is even a valid id...
    if (!isIdValid(id)) throw new Error("Invalid ID");
    return new UserId(id);
  }
}
```

Now we can rest assured that no matter what, if I get passed a `UserId`
object, it's going to be valid.

```ts
function getUsername(id: UserId): string {
  // We can just skip the first part entirely now!
  // Because of the type of the input, we are sure that id is valid.
  ...
}
```

This works for all kinds of validations, as long as the validation is
_permanent_. So actually in our example, a user could get deleted while we
still have `UserId` objects lying around, so the validity would not be true.
But if we've checked that an email is of the correct form, for example, then
we know it's valid forever.

</details>

Let's keep going down this `NoCake` example, and suppose we never implemented
any other static methods that would call this constructor either. That's the
full implementation of this class. We have now guaranteed that _no one can ever
create an instance of this class_.

But what about our use cases?

- We can no longer make `NoCake`. This produces a method visibility error:

  ```ts
  let cake = new NoCake();
  ```

  You'll get an error that reads something like this:

  > Constructor of class `NoCake` is private and only accessible within the class declaration.

- We can no longer use it in function definitions or type constructors, like
  this:

  ```ts
  function giveMeCake(cake: NoCake) { ... }
  type Party = { cake: NoCake, balloons: Balloon[], ... };
  ```

  Interestingly, this actually still typechecks! Why is that?

  The reason is that even though you can never actually call this function, the
  _definition_ of the function is still valid. (the more technical reason behind
  this has to do with the positivity of variables, but that's a discussion for a
  later day)

  In fact, functions and types like this will actually be very useful for us
  later on. Think about what happens to `Party` if one of its required elements
  is something that can never be created.

  No cake, no party! The `Party` type _also_ can't ever be constructed. The
  _type_ called `Party` still exists, we just can't produce an object that will
  qualify as a `Party`.

We've actually created a very important concept in type theory, known as the
**bottom type**. In math, this corresponds to $\emptyset$, or the _empty set_,
but in logic and type theory we typically write it as $\bot$ and read it as
"bottom".

What this represents is a concept of impossibility. If a function requires an
instance of a bottom type, it can never be called, and if a type constructor
requires a bottom type, like `Party`, it can never be constructed.

Typescript actually has the concept of the bottom type baked into the language:
[`never`][never]. So we never actually needed to create this `NoCake` type at
all! We could've just used `never`. It's used to describe computations that
never produce a value. For example, consider the following functions:

```ts
// Throw an error
function never1(): never {
  throw new Error("fail");
}

// Infinite loop
function never2(): never {
  while (true) {
    /* no breaks */
  }
}
```

The reason why these are both considered `never`, or $\bot$-types, is because
imagine using this in a program:

```ts
function usingNever() {
  let canThisValueExist = never1();
  console.log(canThisValueExist);
}
```

You can _never_ assign a value to the variable `canThisValueExist`, because the
program will never reach the log statement, or any of the statements after it.
The `throw` will bubble up and throw up before you get a chance to use the value
after it, and the infinite loop will never even finish, so nothing after it will
ever get run.

We can actually confirm that the `never` type can represent logical falsehood,
by using one of the "features" of false, which is that ["false implies
anything"][false]. In code, this looks like:

```ts
function exFalso<T>(x: never): T {
  return x;
}
```

You'll notice that even though this function returns `T`, you can just return
`x` and the typechecker is satisfied with it. Typescript bakes this behavior
into the subtyping rules of `never`, so `never` type-checks as any other type,
so for example you can't do this easily with our `NoCake` type.

```ts
// Does not type-check!
function notExFalso<T>(x: NoCake): T {
  return x;
}
```

Ok, we've covered bottom types, and established that it's analogous to logical
falsehood. But what represents logical truth?

Well, here's where we have to talk about what truth means. There's two big
parties of logical thought that are involved here. Let's meet them:

- **Classical logic**: gets its name from distinguishing itself from
  intuitionistic logic. In this logical system, we can make statements and
  talk about their truth value. As long as we've created a series of logical
  arguments from the axioms at the start to get to "true", we're all good.
  Under this framework, we can talk about things without knowing what they
  are, so we can prove things like "given many non-empty sets, we can choose one
  item out of each set" without actually being able to name any items or a way
  to pick items (see Axiom of Choice)

- **Intuitionistic logic**, also called **constructive logic**: the new kid on
  the block. In intuitionistic logic, we need to find a _witness_ for all of
  our proofs. Also, falsehood is the absence of a witness, just like all the
  stuff with the bottom type we just talked about, which models impossibility or
  absurdity. In this logical system, the Axiom of Choice doesn't make any sense:
  the act of proving that a choice exists involves generating an example of some
  sort. Another notable difference is that intuitionistic does not consider the
  Law of Excluded Middle to be true.

However, intuitionistic logic is preferred in a lot of mechanized theorem
provers, because it's easier computationally to talk about "having a witness".
Let's actually look more closely at what it means to have a "witness".

If you didn't read the section earlier about using private constructors to
restrict type construction, I'm going to revisit the idea a bit here. Consider
this very restrictive hash map:

```ts
namespace HashMap {
  class Ticket { ... } // Private to namespace

  export class HashMap {
    ...
    public insert(k: string, v: number): Ticket { ... }

    public getWithoutTicket(k: string): number | null {
      if (!this.hasKey(k)) return null;
      return this.inner[k];
    }

    public getWithTicket(t: Ticket): number {
      return this.inner[t.key];
    }
  }
}
```

The idea behind this is kind of like having a witness. Whenever you insert
something into the map, you get back a ticket that basically proves that it was
the one that inserted it for you in the first place.

Since we used a namespace to hide access to the `Ticket` class, the only way you
could have constructed a ticket is by inserting into the map. The ticket then
serves as a _proof_ of the existence of the element inside the map (assuming you
can't remove items).

Now that we have a proof, we don't need to have `number | null` and check at
runtime if a key was a valid key or not. As long as we have the ticket, it
_guarantees_ for us that that key exists and we can just fetch it without asking
any questions.

In mechanized theorem provers,

---

To talk about that, we have to go back to treating types as sets. For example,
we've already seen that the bottom type is a set with no elements, $\emptyset$.
But what's a type that corresponds to a set with one element?

In type theory, we call this a **unit type**. It's only got one element in it,
so it's not super interesting. But that makes it a great return value for
functions that aren't really returning anything, but _do_ return at all, as
opposed to the bottom types. Typescript has something that behaves similarly:

```ts
function returnUnit(): null {
  return null;
}
```

There's nothing else that fits in this type. (I realize `void` and `undefined`
also exist and are basically single-valued types, but they have other weird
behavior that makes me not want to lump them in here)

Let's just also jump into two-valued types, which in math we just call
$\mathbf{2}$. This type has a more common analog in programming, it's the
boolean type.

Do you see how the number of possible values in a type starts to relate to the
_size_ of the set now? I could go on, but typically 3+ sets aren't common enough
to warrant languages providing built-in names for them. Instead, what languages
will do is offer _unions_, which allow you to create your own structures.

For example, let's try to create a type with 3 possible values. We're going to
need 3 different unit types such that we can write something like this:

```ts
type Three = First | Second | Third;
```

We can just do three different unit classes.

```ts
class First {
  static instance: First = new First();
  private constructor() {}
}
class Second { ... } // same thing
class Third { ... }  // same thing
```

The reason I slapped on a private constructor and included a singleton
`instance` variable is to ensure that there's only one value of the type that
exists. Otherwise you could do something like this:

```ts
let first = new First();
let differentFirst = new First();
```

and the size of the `First` type would have grown beyond just a single unit
element.

But anyway! You could repeat this kind of formulation for any number of
_finitely_ sized types. In the biz, we would call the operator `|` a
**type-former**, since it just took three different types and created a new type
that used all three of them.

[proposition]: https://en.wikipedia.org/wiki/Propositional_calculus
[typescript]: https://www.typescriptlang.org/
[never]: https://www.typescriptlang.org/docs/handbook/2/functions.html#never
[false]: https://en.wikipedia.org/wiki/Principle_of_explosion
[as]: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions
[//]: https://code.lol/post/programming/higher-kinded-types/
[//]: https://ayazhafiz.com/articles/21/typescript-type-system-lambda-calculus
