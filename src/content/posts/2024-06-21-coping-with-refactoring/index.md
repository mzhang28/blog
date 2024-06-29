---
title: Coping with refactoring
date: 2024-06-21T05:56:50.594Z
tags:
  - software-engineering

heroImage: ./ruinsHero.png
heroAlt: ruins
---

It is the inevitable nature of code to be refactored. How do we make it a less
painful process?

A not-horrible approach to creating a piece of software by first developing the
happy path, and then adding extra code to handle other cases. When we do this,
we may find that patterns emerge and some parts may be abstracted out to make
the code cleaner to read. This makes sense.

It seems that many engineers decided that this process of abstracting is too
painful and started using other people's abstractions pre-emptively in order to
avoid having to make a lot of code changes. They may introduce patterns like the
ones described in the GoF Design Patterns book.

Some abstractions may be simple to understand. But more often, they almost
always make the code longer and more complex. And sometimes, as a part of this
crystal ball future-proofing of the code, you may make a mistake :scream:. At
some point, you will have to change a lot more code than you would've had to if
you didn't start trying to make a complex design to begin with. It's the exact
same concept as the adage about [premature optimization][2].

[2]: https://en.wikipedia.org/wiki/Program_optimization

As an example, as a part of one of my previous jobs, I was reviewing code that
created _10+ classes_ that included strategy patterns and interfaces. The code
was meant to be generic over something that could be 1 of 4 possibilities. But
the 4 possibilities would basically never change. The entire setup could've been
replaced with a single file with a 4-part if/else statement.

I'm not saying that design patterns aren't useful. If we had more possibilities,
or needed to make it so that programmers outside our team had to be able to
introduce their own options, then we would have to rethink the design. But
changing an if statement in a single file is trivial. Changing 10+ files and all
the places that might've accidentally referenced them is not.

Some people think they can dodge the need to refactor by just piling more
abstractions on top, in a philosophy known as ["Open to extension, closed to
modification."][1] I think this is just a different, more expensive form of
refactoring. Increasing the number of objects just increases the amount of code
you need to change in the future should requirements or assumptions change.

[1]: https://en.wikipedia.org/wiki/Open%E2%80%93closed_principle

So the next time you're thinking of introducing design patterns and creating a
boat load of files to hide your potential complexity into, consider whether the
cost of adding that abstraction is worth the pain it will take to change it
later.

> [!admonition: NOTE]
> As a bonus, if your language has a good enough type system, you probably don't
> need the strategy pattern at all. Just create a function signature and pass
functions as values!
