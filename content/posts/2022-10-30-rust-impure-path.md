+++
title = "Rust's Impure Path"
date = 2022-10-30T12:47:41-05:00
+++

I work on [garbage], a project that touches the filesystem a lot. Because of
this, I'd really like to control when and where these filesystem accesses
happen.

[garbage]: https://git.sr.ht/~mzhang/garbage

The Rust standard library has a `fs` module, which I expect to _exclusively_
contain filesystem access primitives. But actually a lot of the functionality
also gets leaked into `std::path::Path`.

In my ideal world, `Path` only deals with the data in a path, not its
interaction with the filesystem. So it should never be able to check whether or
not a path [exists], for example, or if a path [is a symlink][is_symlink]. Those
should be delegated to something within `fs`.

[exists]: https://doc.rust-lang.org/stable/std/path/struct.Path.html#method.exists
[is_symlink]: https://doc.rust-lang.org/stable/std/path/struct.Path.html#method.is_symlink

In addition, many of these functions automatically resolve symlinks, without
built-in ways of achieving the same functionality without resolving symlinks, so
I ended up having to fill those in myself. For example, I really just expect
[`canonicalize`] to be an in-memory manipulation of path components.

[`canonicalize`]: https://doc.rust-lang.org/stable/std/path/struct.Path.html#method.canonicalize

Honestly, I've got to give it to Python's [pathlib], which solves the problems I
noted above. It splits the path API into `Path` and `PurePath`, the latter of
which does not make any IO accesses. It also provides non-symlink-resolving and
symlink-resolving variants of converting to absolute paths.

[pathlib]: https://docs.python.org/3/library/pathlib.html
