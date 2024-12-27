---
title: The advent of code language
date: 2024-12-02T11:08:41.157Z
tags: [pl, advent-of-code]
---

It's December, which means ~~grad school apps are due soon~~ [Advent of Code (AOC)][aoc] has started.
AOC is an [advent calendar] with increasingly difficult coding challenges from December 1 up until Christmas.

[aoc]: https://adventofcode.com/
[advent calendar]: https://en.wikipedia.org/wiki/Advent_calendar

Usually, people use this as an excuse to learn a new language.
I did this a couple years back with [aoc2022].

[aoc2022]: https://git.mzhang.io/michael/aoc2022

Since I have started to play around with programming language design and theory a bit, I decided to take a stab at writing a new language and using it to crack advent of code challenges.
So far, I have an interpreter that runs very minimal JS-looking language which is capable of solving the first day.
For example, here is the code for the second part of day 1, in my language:

```
input data = "1.txt";

let lines = data.splitlines();
let pairs = lines.map((s) => {
  map(s.splitwhitespace(), (n) => { parseint(n) })
});

let lists = pairs.transpose();
let left = lists[0];
let right = lists[1];

let counts = left.map((n) => {
    let one_count = right.map((m) => { if m == n then 1 else 0 });
    let s = one_count.sum();
    n * s
});

print(counts.sum());
```

The source code is [here][code].

Few things to note:

- I've been enamored by the idea of [UFCS] for a while, and my interpreter implements a rather naive version of it.
  However, I'm curious about how this scales and how it will interact with polymorphic functions or variable namespaces.
- The parser is still currently very broken. This is why the `pairs` definition couldn't just read
  ```
  let pairs = lines.map((s) => s.splitwhitespace().map((n) => parseint(n)));
  ```
- Functions like `splitlines`, `parseint`, `map`, and `transpose` are still implemented using intrinsics.
  They will be moved to a "standard" library once modules have been figured out.

In a few weeks, I will try to flesh this language out into a playground for some programming language ideas I've been meaning to try to implement, such as algebraic effects.
Stay tuned for further updates!

[code]: https://git.mzhang.io/michael/aoclang2024
[ufcs]: https://en.wikipedia.org/wiki/Uniform_Function_Call_Syntax
