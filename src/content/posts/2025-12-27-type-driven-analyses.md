---
title: Type-driven analyses > ad-hoc separate pass
date: 2025-12-27T21:25:27.280Z
draft: true
tags:
  - pl
  - type-theory
---
Today, I ran into a familiar issue with the Rust borrow checker. In the middle of an async function, I had a variable that wasn't `Send` escaping across an `.await` boundary. It looked something like this:
```rust
let err = do_something(1).await;
println!("error: {err}");
drop(err);

let err = do_something(2).await;
println!("error: {err}");
drop(err);
```
This _should_ work, since the `err` is consumed by the `drop` so it shouldn't be valid after that point. Yet because type-checking and borrow-checking are two separate phases of the compiler, the borrow-checker for some reason could not use that information and deduced that `err` must still be active.

You can see a reproducing example of this at [this playground link][1]. Notice that changing the `drop` to just surrounding the declaration of the variable into a new scope fixes the issue. This shows that the borrow checker somehow treats going out of scope differently from a manual drop, even though in both cases, the variable cannot be used afterwards.

[1]: https://play.rust-lang.org/?version=stable&mode=debug&edition=2024&gist=07a4e2c13fef15f8c8a52db3f902fa0f

So instead of discussing Rust, here's a rant about some other ideas in type theory that could potentially avoid the pitfalls of separate analyses.

## Fractional borrows

The whole point of Rust's borrow checker is to ensure memory safety, i.e pointers should never point to unallocated data. The concept of ownership is then a simple mental model for _how_ this safety can be enforced. There are plenty of resources on the borrow checking rules, but what's important here is that the borrow checker essentially runs as a separate pass over the code after type-checking. Although it may have information available from the type-checker, it is still prone to pitfalls like the one I witnessed above.

You may know that in type theory, we have ways of adding information to types to encode all sorts of properties about data we would like to enforce (i.e effects, information flow, crash persistence, etc.). We can add borrowing information into pointer types in order to prove their safety.

For fractional borrows, we'd like to keep Rust's RAII/affine types, since otherwise a variable's scope could possibly extend until the end of the program. The key is to introduce the borrowing information directly into the type of data:
- You could directly own data. Just like in Rust, this gives you full license to do anything to the data, including deallocating it.
- You could have an exclusive mutable reference, which we will indicate with $1$.
- You could have an immutable reference, which is some fraction less than $1$. There could be multiple of these lying around and they all allow immutable access.

This info allows us to determine just at type-checking time whether or not a read or write should be allowed. The added benefit is that instead of messing with scoping rules and borrow trees, the data flow itself propagates the borrowing information.

I'll illustrate this using an example from TRPL.

```rust
let mut s = String::from("hello");
let r1 = &mut s;
let r2 = &mut s;
```

This example fails because `r1` and `r2` are separately taking mutable references to `s`, which is a big no-no. Right now, the borrow checker does a separate pass to rule out `r2` as being invalid. With fractional borrows, this simply becomes a type error, since at the point where `r2` is borrowing, `s` only has $0$ amount of access to the data. Let's see another example:

```rust
let mut s = String::from("hello");
{
	let r1 = &mut s;
}
let r2 = &mut s;
```

In Rust, this is _allowed_, because `r1`'s reference is dropped at the end of the scope, thus removing all mutable references to `s`. In fractional borrows, instead of putting an implicit drop, we would put an implicit _join_, which restores the $1$ permission back to `s`.

Sure, you say, we've just changed the vocabulary. Why does this change anything?

Well, because it makes the previous code identical to this one:

```rust
let mut s = String::from("hello");
let r1 = &mut s;
join(s, r1);
let r2 = &mut s;
```

Notice that other than adding the join at the end of the scope, which is a fairly easy analysis to add, we are no longer doing anything scary with scopes. Borrow safety is now completely a type checking problem, and we can use traditional type analysis, which we are _very_ good at doing.

Of course, this idea can be extended with fraction polymorphism, which is (kind of) our analogue of lifetime polymorphism. We can have functions that take some fractional reference $p$, and then spit out some other fractional reference relative to $p$.
## Mendler-style recursion

This is a really neat idea that I was first exposed to by a talk given by Aaron Stump at my graduate program's PL seminar. In languages with dependent types, often used for proof assistants, we would like programs to always terminate. In fact, non-termination is treated _as_ logical falsity, since you can never get it to produce a value. So if you wrote a proof in this language, and it accidentally involved some circular logic, it could potentially be unsound, even if it obeyed other typing rules.

To deal with this, many proof assistants (Agda, Lean, Rocq, Idris, F*, etc.) use a _termination_ checker. The most common recursion technique is known as structural recursion, like this:

```haskell
length :: [a] -> Int
length [] = 0
length _:t = 1 + length t
```

We know this is a properly terminating function, because we have only called `length` again with something that is _structurally_ smaller than our original input. Thus, since terms are always of finite structure, we know that it'll eventually get down to the smallest term, `[]` and terminate. Termination checkers can figure this much out by doing essentially a _syntax-directed_ pass over the code[^1].

[^1]: The reason they can't do a _type-directed_ pass immediately is because type checking in dependently typed languages often involves normalization, a technique that partially evaluates the program. But if evaluating the program could lead to non-termination, we basically suffer at the hands of the very thing we're trying to check for...

There are functions which can't be analyzed syntax-wise, the most famous of which is the Ackermann function. For reference, the definition is like this:

$$ A(m,n) = \begin{cases}
	n + 1 & \text{if } m = 0 \\
	A(m-1, 1) & \text{if } m > 0 \text{ and } n = 0 \\
	A(m-1, A(m, n-1)) & \text{if } m > 0 \text{ and } n > 0 \\
\end{cases} $$

The core problem here is that the termination checker can't determine that $A(m,n-1)$ is a structurally smaller term, because it involves a recursive call first. If the result of this call ended up with a number bigger than $n$, we could get unbounded recursion.

A solution for this, which is the one used by F*, is to have a `decreases` condition that involves both $m$ and $n$. For this function, the condition would just be $[m,n]$, where first it would check if $m$ is smaller, and if equal, then check $n$. This way, the fact that there is a recursive call doesn't matter since $m-1<m$, and also the recursive call itself is fine because $n-1<n$.

But this is just one out of many recursive functions. The syntax-directed termination checker is not very smart, so there are many cases of non-termination that can't be easily checked. Another non-trivial example is quicksort, but there are many more algorithms from graph theory that can't be properly expressed.

Mendler-style recursion avoids this by disallowing general recursion. Instead, you describe one step of the recursion over inductive data in a controlled way. The fact that the data is inductive is important, because it encodes the structuralness of the structural termination into the data itself. Your step function requires only recursive calls to the next step of unfolding. The crux of this that ties it all together is the Mendler fold operation, which takes the input data, your step function, and runs it to completion.

The Mendler fold isn't anything scary. In fact, here it is:

```haskell
mfold :: (forall r. (r -> c) -> f r -> c) -> Fix f -> c
mfold step (Fix term) = step (\sub -> mfold step sub) term
```

where `Fix` is the standard fixpoint of a functor.

Let's see a specific example. I'm following mostly the notation of [this talk][2]. Suppose we are thinking about the list again, but we'll change up the definition slightly from the typical one:

[2]: https://www.youtube.com/watch?v=2HxMmBWWvKA

```haskell
data ListF a x = Nil | Cons a x
type List a = Fix (ListF a)
```

So we essentially have some abstract data to represent the tail of the list. This actually matches the signature functor when describing the list as an $F$-algebra: $F(X) = 1 + A \times X$.

Then, we'll have some type $R$ which represents an _abstracted_ version of your list. The reason we need to make this abstract is that we abuse parametricity to disallow introspection. The _only_ thing you can do with this $R$, is to pass it to a function called $\textsf{eval} : R \rightarrow X$. So putting this all together, for some specific output type $\mathbb{N}$, our length step function's type signature would look something like:

$$ \mathsf{lengthStep} : \forall R. (\mathsf{eval} : R \rightarrow \mathbb{N}) \rightarrow \mathsf{ListF}(A, R) \rightarrow \mathbb{N} $$

We can write this like:

```haskell
lengthStep :: (r -> Int) -> ListF a r -> Int
lengthStep eval Nil = 0
lengthStep eval (Cons a r) = 1 + eval r

length :: List a -> Int
length = mfold lengthStep
```

You'll notice that the function mostly looks the same as the one we had above, but nothing in here is actually calling a recursive function. The recursion all happens in the Mendler fold. This means without any kind of extra machinery, we have a terminating-by-construction program.

Here is a [link to a playground][3] for this code.

[3]: https://play.haskell.org/saved/oECFtFzn

As another example, let's see the Ackermann function example again. Nested recursion is simple to do, we just need two calls to `mfold`, with one being inside one of the recursive steps:

```haskell
data NatF r = Zero | Suc r
type Nat = Fix NatF

ackN :: (Nat -> Nat) -> (r -> Nat) -> NatF r -> Nat
ackN evalM evalN Zero = evalM (fromInt 1)
ackN evalM evalN (Suc n) = evalM (evalN n)

ackStep :: (r -> (Nat -> Nat)) -> NatF r -> (Nat -> Nat)
ackStep eval Zero n = Fix (Suc n)
ackStep eval (Suc m) n = mfold (ackN (eval m)) n

ack :: Nat -> Nat -> Nat
ack = mfold ackStep
```

Here is a [link to a playground][4] for this code.

[4]: https://play.haskell.org/saved/biYyldhw
## Conclusion

So I guess my original takeaway here is that writing various other analyses is often hard and unexplored, but writing type checkers is something we know how to do very well. So why not just take these other problems and turn them into type checking problems?

Well, I'd love to see this become a thing. But you might already be thinking this -- there might be usability concerns. With fractional borrows, we could dodge most of these problems with fraction polymorphism and some clean syntax but the Mendler-style recursion case study essentially involves changing how we program a little, maybe having some syntax sugar for the repetitive parts or using recursion schemes, or else we would need to incur an equally complex compilation phase from regular code to Mendler-style recursion.

Anyway, just some post-holidays rambling. See you in 2026!