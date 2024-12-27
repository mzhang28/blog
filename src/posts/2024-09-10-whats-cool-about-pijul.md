---
title: What's cool about Pijul?
date: 2024-09-10T22:37:03.684Z
tags: [engineering]
draft: true
---

Version control is one of those things that few of us hardly ever think about
until it causes problems. Lots of projects claim to be able to cover up the
internals and expose a glossy interface but once you really start using it you
notice all the pitfalls.

In particular, there seems to be this never-ending battle between the merge camp
and the rebase camp. Every project I join seems to have different opinions about
the process.

First of all, both have fundamental weaknesses. In the **merge** side, merge
commits lose information about the merge. Essentially a merge is two separate pieces of information:

- The commits that came before it
- The new final snapshot of the code

You can't commute changes made during a merge with different change, because the merge is simply just a new state with no origin information. Also, if some conflicts are missed during the resolution of the merge, they just go through.

On the other hand, the problem with **rebase** is that it fundamentally changes
history, which is a _huge_ problem. On your own feature branches, this might be
ok, but if you are actively working with someone and need to rebase against
main, you're essentially changing their work.

---

My understand is that the fundamental differences between [Pijul] (and Darcs, which it's based on) and git are:

[Pijul]: https://pijul.org/

1. Conflicts are a known state
1. The patches are not ordered into a merkle tree

At least these are the differences I care about. You'll note that the first one fixes the merge issue and the second one fixes the rebase issue.

With conflicts being recorded as a known state in the tree, we can add another commit on top that "fixes" the conflict. Since conflicts are deterministic, and each file's conflicts are recorded, you never have the problem of glossing over conflicts by accident.

Also, since patches don't depend on "previous" patches' hashes, this means
changing the order in which it lies in history doesn't need to modify the patch
itself, unlike in Git where moving a commit back or forth will modify the entire
future of the tree. Instead, dependencies are just tracked as metadata alongside the contents of the patch itself.

---

With all this said, what's _not_ cool about Pijul? Despite being close to a 1.0,
the Pijul software itself is still heavily lacking in documentation. For
example, the on-disk format and the push protocol are not specified in the
documentation. Also, the only real available forge is the proprietary Nest,
operated by the Pijul developers themselves. Nest was also incredibly
unintuitive and hard to use.

It's quite a shame because the fundamental structure of the underlying data does
impact the surface level operations of the tool quite a bit. Git has a lot of
clunky corners as we've discovered over the years, but it's so hard to work
around it because of the massive engineering effort involved.

At some point I'd love to pick apart the tool and see how it works and try to
write up some tooling, but I'm still sinking from SIFT work and PhD applications
right now, so I'll just stick to the sidelines.
