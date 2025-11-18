---
title: Formalizing lambda calculus with call/cc by building a CEK machine in Agda
date: 2025-11-18T07:40:34.024Z
draft: true
---
This is a blog post I started writing a while ago and never ended up finishing, so here it is.

As a part of my master's, I took a special topics course, CSCI 8980 (fall 2021), on [reasoning about programming languages using Agda][plfa], a dependently typed theorem prover.
For our term project, we were to implement a simply-typed lambda calculus with some extension of our choice, along with proofs of certain properties.

[plfa]: https://plfa.github.io/

I actually took this course _before_ I enrolled into the master's program.
This course is what introduced me to programming language theory, as well as my master's advisor Favonia.
## Quick recap of the lambda calculus

The [lambda calculus][lc] is a famous abstraction, used widely by programming language researchers as a base programming language upon which to build their new features.
One reason for its ubiquity is that even though it's so minimal, it is equal in expressivity to Turing machines -- capable of representing any program.

[lc]: https://en.wikipedia.org/wiki/Lambda_calculus

The lambda calculus is essentially just the calculus of function application.
Even though there's many variations, it all boils down to the three core constructs:
- variables
- abstraction (creating a function)
- application (calling a function)

## Quick recap on CEK machines

The [CEK machine][cek] is an abstract machine, which in other words is like an algorithm for actually executing programs.
See, even though we have a _language_ for describing programs, we haven't really described how it will execute.
We say that a CEK machine provides an [operational semantics][1] for our lambda calculus.
There are some alternative operational semantics -- simpler ones include call-by-name or call-by-value.

[cek]: https://en.wikipedia.org/wiki/CEK_Machine
[1]: https://en.wikipedia.org/wiki/Operational_semantics

The reason that the CEK machine is useful is because it allows us to implement a particular language feature found in some Lisps, called [call with current continuation][callcc] (call/cc).
_Continuations_ are a language feature that allows us to capture the rest of computation as a first-class value, being able to do things like passing it around between functions.
A short example of a program that uses call/cc might look like:

$$ {\color{Plum}4 \ + \ } (\texttt{call/cc} \  {\color{Orange}(\lambda k .\:k\:2)}) \Rightarrow {\color{Orange}(\lambda k.\:k\:2)} (\lambda n.\:{\color{Plum}4 \ + \ } n) \Rightarrow 6 $$

Aside from being an interesting language feature available to programmers, continuations are also frequently used by compilers as an intermediate representation known as [continuation-passing style][cps], which has several advantages over traditional representations such as SSA or ANF.

[callcc]: https://en.wikipedia.org/wiki/Call-with-current-continuation
[cps]: https://en.wikipedia.org/wiki/Continuation-passing_style

CEK machines aren't usually implemented in interpreters, but it gives us a way to build abstract formalizations.
I'm going to prove some properties about how lambda calculus + call/cc behaves, so limiting my view to the CEK machine allows me to work with a smaller core language, since proving properties of a language often requires you to enumerate over all language constructs.
The CEK machine also serves as a reasonable choice, since there are other extensions that build upon CEK to add other features not found in the standard lambda calculus, such as mutable state.
My work here follows the CESK machine description written up in this [blog post by Matt Might][might].

[might]: https://matt.might.net/articles/cesk-machines/

The CEK machine is essentially some state, along with some operations that transforms the state in interesting ways. (I mean, technically the base lambda calculus is, too, but this state is more complicated).
The pieces of the state are what gives CEK its name:
- **C**ontrol: your current term
- **E**nvironment: values you're able to refer to
- **K**ontinuation: continuation (which we talked about) but with a K

## The goal

The final result is to:
- develop a formulation of a lambda calculus that includes call/cc (statics + dynamics)
- prove [type safety][pp] through *progress* and *preservation*

[pp]: https://en.wikipedia.org/wiki/Type_safety

We've already went over lambda calculus and call/cc, so let's quickly recap progress and preservation.
Types decrease bugs by annotating programs ahead of time with info about what types variables have, so we can reject programs that we know will cause bugs before even running it.
Progress and preservation are two properties about the _operation_ of a language that assure us that the types are working:
- progress proves that a program will never get stuck. Execution either completes with a value, or is able to take some step forward
- preservation means programs will never change type as a result of execution -- the type is preserved

Simply-typed lambda calculus is already well known to exhibit both of these properties.
So whenever we develop a new language with extra features, this is a good sanity check to make sure our features don't break the language.
Let's see what this looks like up close.
## Statics

In programming language theory, we use the term _statics_ to refer to everything in a program we can write down, so basically the syntax.
This is in contrast to the _dynamics_, which describe how execution works.
In our language, this includes the grammar for how to write types, grammar for how to write terms, and the typing rules that govern what terms have what types.

We'll start with types:

$$ \mathsf{Type} \ \tau ::= \bot \ | \ \mathbb{N} \ | \ \tau \rightarrow \tau \ | \ K[\tau \rightarrow \tau] $$
The types are:
- $\bot$, the bottom type. This is required for 
## The code

The code can be found at my SourceHut repo: https://git.sr.ht/~mzhang/agda-project

Thank you for reading!