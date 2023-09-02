---
title: Coping with refactoring
date: 2023-09-02T02:17:23.405Z
tags:
  - software-engineering

heroImage: ./ruinsHero.png
heroAlt: ruins
draft: true
---

It is the inevitable nature of code to be refactored. How do we make it a less
painful process?

It pains me to start a stream-of-consciousness type of article with a
definition, but to set things straight let's be sure we're talking about the
same thing. When I say **refactoring** I mean changing potentially large parts
of the codebase purely for the sake of making it more "organized". For some
definition of organized.

As software developers, we usually think of refactoring as something we do in
order to make something easier. A common example would be something like a few
lines of code that people on your team have just been copy and pasting
mindlessly everywhere, because to make it generic would mean that they would
have to touch code outside of their little bubble and then reviewers get
hesitant at the diffs and yadda yadda all kinds of problems supposedly.

Now it's your turn, and you have to change something tiny in those few lines of
code ...everywhere. Before you go in and start abstracting all of it into
something more generic, take a breather and think for a second: is it worth it
to refactor?

If your refactor involves adding some extra helper classes or you're pulling out
your toolbelt of design patterns, **you are creating complexity**. And in the
software world, complexity is the real devil.

Many people try to code in an "extensible" way in order to avoid refactors, with
extravagant interfaces and inheritance patterns. But all they've created is just
a larger mess that's harder to clean up later down the line when it eventually
needs to be rewritten. And it _will_ eventually need to be rewritten.

Let's talk about object-oriented programming. There's this bizarre
[open-to-extension but closed-to-modification][1] principle I've observed where
people are so resistant to changing their source code that they'd implement
heaps of useless design patterns on top of it in order to keep their little
classes from ever being touched.

[1]: https://en.wikipedia.org/wiki/Open%E2%80%93closed_principle

If that doesn't sound insane to you, let's take a look at a case study. Suppose
you're writing some code that takes in a request type,
