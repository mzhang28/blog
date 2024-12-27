---
title: How IP routing works
date: 2023-09-01T03:50:38.386Z
tags:
  - networking
draft: true

heroImage: ./cableHero.png
heroAlt: futuristic photograph of a bunch of organized network cables
---

Many of us have probably heard of an IP address, but how does it actually work?
I'm going to try to give a high level overview to technical networking concepts.

Throughout this post I'm going to keep referring back to a train station
analogy. We'll start off with a small network and build up into something that
scales into the internet we have today.

## The simplest network

First, the analogy isn't very far off. Just as there's multiple tracks
leading away from a train station, a computer has multiple ports to communicate
with other computers, and we typically call these **interfaces**. For example, a
laptop may have a Wi-Fi _interface_ and an Ethernet _interface_, while a cell
phone may have a cellular _interface_ as well. Server computers could have any
number of interfaces.

You could imagine a simple network between 3 computers like this:
