---
title: "Dependent Types from First Principles"
slug: "dependent-types"
date: 2022-10-27
tags: ["type-theory"]
toc: true
math: true
draft: true
---

It's frequently said that computers are just made of 1s and 0s. As programmers,
we induce structure into this sea of 1s and 0s to build a rich collection of
abstractions that can produce the entire software ecosystem as we know it. But
how does this work? Let's start from the beginning.

### Bits and Bytes

On the lowest level, your computer is actually a tiny network of many
components, but let's pretend for a second it's just a giant list of **bits**.
Something like this.

```
011101110110100001111001001000000110010001101001011001000010000001111001011011110111010100100000011001000110010101100011011011110110010001100101001000000111010001101000011010010111001100100000011011000110111101101100
```

This is often a mess, so we like to chunk these into groups of 8, called an
_octet_, and then represent it as a 2-digit base 16 number. For example, the
string above would look something like this:

```
77 68 79 20 64 69 64 20 79 6f 75 20 64 65 63 6f 64 65 20 74 68 69 73 20 6c 6f 6c
```

We've just turned our series of 1s and 0s into some numbers and letters. Great.
Now what? How do we get programs, images, and video from this? Well, we have to
induce some structure.

### Building Blocks

Suppose you had a pile of sugar and a pile of salt. They both look pretty
similar, but if you were to put them into the same pile, cooking would be a
disaster. You would not want to use salt where you wanted to use sugar, or vice
versa.

Same thing in computing. We have developed byte-level representations for
several basic kinds of data, but without distinction, it's hard to tell them
apart. So programmers developed **types**, ways of categorizing data so when
we're just reading a series of 0s and 1s, we would know how to interpret it.

| Raw              | Interpreted as number | Interpreted as text |
| ---------------- | --------------------- | ------------------- |
| `68 65 6c 6c 6f` | 448,378,203,247       | `hello`             |

So now we know how to
