---
title: Functional Programming
id: 2025-02-15-functional-programming
date: 2025-02-15T19:28:38.275Z
draft: true
tags: []
---

The term functional programming is actually a conflation of several independent programming principles that can lead to better code quality.
I believe these principles are:

- Functions as values / higher order functions
- Data immutability
- Purity
- Type safety

These ideas each have their own benefits, and combine to create powerful guarantees about code.
This is why highly critical code tends to implement one or more of these principles.
However, even very flexible programming environments like Python and JavaScript can benefit from implementing these ideas.

In this post I'll go over each of these in detail and show some examples of how they benefit codebases.
Many examples will be in Python but they also apply to languages like JavaScript, Ruby, etc.

## Functions as values

At a high level, this means functions aren't somehow different from regular values like integers or lists like they may be in languages like C.

The first example I want to share is known as the "strategy pattern."
Suppose we are programming a player in an RPG who can equip one of multiple items such as magic staff or sword.
When implementing the "attack" functionality, we may do something like this:

```py
class Player:
  def equip(self, weapon: str):
    self.weapon = weapon
  def attack(self):
    if self.weapon == "sword":
      # ... read melee attack stats ...
    elif self.weapon == "staff":
      # ... read magic attack stats ...
```

This gets incredibly unwieldly with large numbers of weapons, so it would be nice to extract this functionality out:

```py
class Player:
  def equip(self, weapon: str):
    ATTACK_FUNCTIONS = dict(
      sword=self.sword_attack,
      staff=self.staff_attack,
    )
    self.attack_func = ATTACK_FUNCTIONS[weapon]
  def attack(self):
    self.attack_func()
  def sword_attack(self):
    # ... read melee attack stats ...
  def staff_attack(self):
    # ... read magic attack stats ...
```

What we've essentially done is turn those weapon-specific functions into some values we can just store away for now and then call again later with no knowledge of what that function does aside from the signature.

This brings us to the most important properties of a function, which are

1. the number of arguments (also known as _arity_)
2. the expected type of each argument
3. the return type

## Data Immutability

## Purity

This idea is similar to data immutability in that functions that can affect state outside of its immediate inputs / outputs tend to be hard to reason about.
