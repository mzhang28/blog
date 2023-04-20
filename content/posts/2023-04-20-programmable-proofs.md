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
for the majority of my examples, to explain the concepts. I personally love the
way this language tackles a type system, and even though there are certain
things it lacks, I still find it generally useful and intuitive for talking
about basic ideas.

---

Let's start with a very simple data type: a class! We can make new classes in
Typescript like this:

```ts
class Cake {}
```

That's all there is to it! `Cake` is now a full-fledged data type. What does
being a data type mean?

- We can make some `Cake` like this:

  ```ts
  let cake = new Cake();
  ```

- We can use it in function definitions, like this:

  ```ts
  function giveMeCake(cake: Cake) { ... }
  ```

- We can put it in other types, like this:

  ```ts
  type Party = { cake: Cake, balloons: Balloons, ... };
  ```

Ok that's cool. But what about classes with no constructors?

```ts
class NoCake {
  private constructor() {}
}
```

In Typescript and many OO languages it's based on, classes are given
public constructors by default. This lets anyone create an instance of the
class, and get all the great benefits we just talked about above. But when we
lock down the constructor, we can't just freely create instances of this class
anymore.

<details>
  <summary>Why might we want to have private constructors?</summary>

  Let's say you had integer user IDs, and in your application whenever you wrote
  a helper function that had to deal with user IDs, you had to first check that
  it was a valid ID:

  ```ts
  function getUsername(id: number) {
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
  function getUsername(id: UserId) {
    // We can just skip the first part entirely now!
    // Because of the type of the input, we are sure that id is valid.
    ...
  }
  ```

  You could probably imagine what an implementation of this type looks like:

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
    constructor(id: number) { this.id = id; }

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
    private constructor(id: number) { this.id = id; }

    /** @throws {Error} */
    fromNumberChecked() {
      // First, check if id is even a valid id...
      if (!isIdValid(id)) throw new Error("Invalid ID");
      return new UserId(id);
    }
  }
  ```

  Now we can rest assured that no matter what, if I get passed a `UserId`
  object, it's going to be valid. This works for all kinds of validations, as
  long as the validation is _permanent_. So actually in our example, a user
  could get deleted while we still have `UserId` objects lying around, so the
  validity would not be true. But if we've checked that an email is of the
  correct form, for example, then we know it's valid forever.
</details>

Let's keep going down this `NoCake` example, and suppose we never implemented
any other static methods that would call this constructor either. That's the
full implementation of this class. We have now guaranteed that _no one can ever
create an instance of this class_.

But what about our use cases?

- We can no longer make `NoCake`. This produces a code visibility error:

  ```ts
  let cake = new NoCake();
  ```

  You'll get an error that reads something like this:

  > Constructor of class `NoCake` is private and only accessible within the class declaration.

- We can no longer use it in function definitions or type constructors, like
  this:

  ```ts
  function giveMeCake(cake: NoCake) { ... }
  type Party = { cake: NoCake, balloons: Balloons, ... };
  ```

  Interestingly, this actually still typechecks! Why is that?

  The reason is that even though you can never actually call this function, the
  _definition_ of the function is still valid. (the more technical reason behind
  this has to do with the positivity of variables, but that's a discussion for a
  later day)

  In fact, functions and types like this will actually be very useful for us
  later on. Think about what happens to `Party` if one of its required elements
  is something that can never be created.

  No cake, no party! The `Party` type _also_ can't ever be constructed.

We've actually created a very important concept in type theory, known as the
**bottom type**. In math, this corresponds to $\emptyset$, or the _empty set_,
but in logic and type theory we typically write it as $\bot$ and read it as
"bottom".

What this represents is a concept of impossibility. If a function requires an
instance of a bottom type, it can never be called, and if a type constructor
requires a bottom type, it can never be constructed.

> Aside: in type theory, type constructors like structs and generics are really
> just Type $\rightarrow$ Type functions, so you could also think of it as a
> function as well. The difference is that the type constructor can actually
> succeed. I can write this type:
>
> ```ts
> type NoCakeList = NoCake[];
> ```
>
> But because I can never get an instance of `NoCake`, I can also never get an
> instance of `NoCakeList`.

Typescript actually has the concept of the bottom type baked into the language:
[`never`][never]. It's used to describe computations that never produce a value.
For example, consider the following functions:

```ts
// Throw an error
function never1(): never {
  throw new Error("fail");
}

// Infinite loop
function never2(): never {
  while (true) { }
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
program will never reach any of the statements after it. The `throw` will bubble
up and throw up before you get a chance to use the value after it, and the
infinite loop will never even finish, so nothing after it will get run.

[proposition]: https://en.wikipedia.org/wiki/Propositional_calculus
[typescript]: https://www.typescriptlang.org/
[never]: https://www.typescriptlang.org/docs/handbook/2/functions.html#never
