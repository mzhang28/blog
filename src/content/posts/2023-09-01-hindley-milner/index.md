---
title: Hindley-Milner type inference
date: 2023-09-01T13:06:55.614Z
tags:
  - type-theory
draft: true
---

Today, a lot of languages have a feature called something along the lines of
"type inference". The idea is that through the way variables are passed and
used, you can make guesses about what type it should be, and preemptively point
out invalid or incompatible uses. Let's talk about how it works.
