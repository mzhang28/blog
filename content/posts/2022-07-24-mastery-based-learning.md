+++
title = "Mastery-Based Learning"
date = 2022-07-24
tags = ["education"]
+++

A thought I've been brewing probably since undergrad is the idea of
mastery-based education for skill-based practices. Directly inspired by the
language learning apps, I wonder whether we can enhance a traditional spaced
repetition system with a topic graph, where mastery can "spill" throughout the
graph to better model learning. Since I'm never going to have time to actually
build such a system, I thought I'd just jot these ideas down.

### Knowledge Graph

The first piece of this setup would require having an extensive knowledge graph.
Think Wikipedia, where it has a lot of related topics, but rather than just
being linked in an ad-hoc manner, each link has one or more of the following
specific purposes:

- **Dependency.** The linked topic needs some percentage of mastery in order
    to best experience the current topic.

- **Spill.** Not really sure what a good term for this would be, but basically
    mastery of the current topic would result in some percentage of "spilled"
    mastery gain for the linked topic.

The dependency aspect allows people to work backwards, starting from what they
don't know and being able to query what the required context is. They can build
themselves a learning plan based on a topological sorting of those topics and
tackle them individually.

The spill aspect allows people to "skip" learning things they already know, for
a faster onboarding experience. For example, since "the quadratic formula"
requires someone to know "algebra", then if someone masters the quadratic
formula before algebra, it should boost the mastery of algebra too.

### Mastery Level

I think the current way tests are handled are not only stressful, but a horrible
way to measure mastery. Rather than promoting long-term learning, it encourages
the cram-and-forget workflow. I think what the language learning apps taught us
is not only is it good to repeat things when we get it wrong, it's also good to
repeat things when we get it right.

The vision would be something like this:

1. First, the student learns some material. They take a short quiz immediately,
   and their mastery is boosted by a small percentage depending on their score,
   maybe up to 30%.

2. Then, the student goes off and learns some related material. After a length
   of time has passed, they are quizzed on the first topic again. By this time,
   their mastery score should fall a bit simply on the basis of "forgetfulness
   over time".

3. At the end of the semester, if they have reached required thresholds of
   mastery in each required topic, they will pass the class.

Not only does this simplify final grading, it also removes the whole concept of
stress in the middle, since doing badly on one exam doesn't hurt your grade
permanently. On top of that, doing _well_ on a single exam doesn't guarantee
that you know it, and the system models that by not giving you full mastery
after a single test.

But this doesn't necessarily mean that the student must re-take tests on things
they already know. The great thing about the whole "spill" system is that if
they learn topic A first, then topic B that depends on topic A, then topic B can
indirectly keep topic A's mastery afloat.

### Implementation Challenges

Implementation is the toughest part. There's a couple technical hurdles I would
like to complete before attempting such a system, which are:

- A bunch of interactive widgets for allowing users to play around with the
    material directly. This is more applicable in math and science curriculums.

- Quiz generation software. There's probably good off-the-shelf components
    already, I haven't looked.

Another problem is that I never want to think about dealing with cheating. If
this idea were to be neatly packaged up and deployed into schools, you bet the
first problem teachers are going to have is with cheating. While there are some
stopgaps such as auto-generated quizzes and personalized curriculums, there's
never a guaranteed solution. Instead, fostering a healthy learning attitude
among students is the best way for these systems to be effective.

My final disclaimer is that I'm not an educator. I've TA'd for a functional
programming course in undergrad and helped many peers learn programming concepts
from time to time. Watching people learn is a very interesting process, and
while I don't have time to conduct studies on how this process works, there's
general patterns I picked up on while following this train of thought.
