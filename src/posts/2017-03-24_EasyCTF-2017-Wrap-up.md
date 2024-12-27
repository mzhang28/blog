---
title: EasyCTF 2017 Wrap-up
date: 2017-03-24T11:36:40.681Z
tags: [medium-blog]
---

EasyCTF just concluded this Monday!
Looking back on the competition, I'd say that this year was our best year ever.
Let's take a look at some of the stats.

- **5,837** users registered this year, playing on **2,742** teams.
  Of those teams, **1,938** teams scored points.
- We had **63** challenges, which was close to our 68 last year.
- **10.7%** of all teams had 5 members — full teams! In fact, there were more 5-member teams than there were 4-, 3-, and 2-member teams.

I'm really happy to see that so many people were willing to give us a week of their time to participate in our event and work through our challenges, despite the fact that we hadn’t promised any prizes ahead of time.

I'd also like to give a shout-out to the entire dev team who helped monitor basically every point of contact that people had with us and creating amazing challenges.

## Improvements for next year

I still haven’t decided whether I’ll be completely involved in organizing this event again next year.
I hope that I’ll have some free time alongside my classes, but I’d also like some more cooperation from the rest of the organizers.
The biggest problem we had this year was basically not working on anything until the week before the competition.
By that time, it was already too late. Let’s take a closer look at what actually went wrong:

- **Lack of motivation.**
  I’m not sure people were actually busy during the entire year that we had planned to work, but there was definitely a lack of work put into organizing the competition.
  We had some big ideas at the beginning of the year, but as time passed, the chances of those ideas becoming reality looked rather slim as no one wanted to be the first one to start working.
  Somewhere in there I threw in a couple of deadlines, and we got a couple of problems written.
  Had I not done that, I fear we would have had much fewer problems than we actually did.
- **No contact with sponsor companies.**
  Contacting sponsors should have been one of the first things we did, since it takes a long time to sort out details and companies usually take at least two weeks to reply to emails anyway.
  Towards the end, we did get an email from DigitalOcean saying they were willing to fund servers for our competition, but launch day came and we didn’t hear back from them again.
- **No coordination.**
  Some of the feedback I’ve been hearing about this year’s competition is a shortage of actually “easy” problems.
  We never really went through the competition and tried to lay out a “spectrum” of problems nor tackle it from the participants’ perspective.
  Every problem was either just a “cool idea” someone had or “I feel like a CTF needs this.”
  The intermediate web section was completely missing.
- **Unbalanced team.**
  Our team comprised mainly of problem writers.
  That’s great and all, but when it comes to things like contacting sponsor companies, writing the website, planning some kind of game, we basically have no resources to do those.
  I spent my entire time developing OpenCTF, the platform that powered the competition, and I know for sure that was a task too large for me to handle.
  Getting more web designers or people with other skills would have helped out a lot.

I’ve also got a couple of points of reflection for prospective CTF organizers, so if you’re planning to run a CTF, this is for you.

- **Participant experience takes first priority.**
  A lot of organizers think the hardest part of running a CTF is getting good challenges.
  And they’d be right.
  But that’s not to say that preparing a solid game infrastructure for flag submission is going to be something you can do last-minute.
  When it comes to the participants’ experience, the first thing that they encounter is the website.
  Then a few initial challenges.
  Then probably the chat.
  Make sure you have those down well and people will probably have a better initial impression of your CTF.
- **Some people are there to make you miserable.**
  As the one in control, you need to account for those people.
  We’re lucky that we only had relatively few encounters with such people but do keep in mind that you are still running an event and that takes first priority.
  During EasyCTF, there were a couple of people who thought it was funny to drop flags for hard challenges into the chat room.
  When we tried to get them to stop, they would come back under different aliases in order to annoy us.
  At that point we just shut down the entire chat room; the competition had to go on.
- **Ignore unconstructive negative feedback.**
  Don’t take it to heart, solve the problems, and move on.
  Who cares if some random kid in IRC says your CTF is garbage?
  Ask them what issues they’re having, fix them, and they’ll be happy.
  It’s really not that complicated.
- **Docker.**
  Is probably a good idea.
  The learning curve is not bad and it’s a great way to create disposable containers that can restart easily.
  Not only should you use Docker for your main competition website, you should also use it for all of the challenges that involve communicating with a server.

Here’s something else I definitely have to share.
We had this autogen system that created different flags for different teams in order to discourage flag sharing.
Some people came up to us reporting that their flag wasn’t working, when they clearly just took some other team’s flag.
I didn’t really do anything about it, but just thought it was pretty funny that they had the nerve to report it to us even though they were cheating.

So, what’s the future for EasyCTF?

- I’m seeing OpenCTF as a more permanent solution to our main platform.
  It’s a very complex piece of software and it would be insane to try to rewrite it from scratch.
  I’m in the process of creating an open-source version of it and making it customizable (for example, turning off features that you don’t need like the programming judge) for CTF organizers.
- We had this project going on a while back for a CTF calendar that also hosted tasks.
  I was also hoping that it would be able to replay entire competitions but that seems a bit too hopeful at this point.
  It would be nice to just get the calendar revived.
- WeebCTF is happening again this summer, dates still yet to be decided.
  If you’re into anime (or even if you’re not), come check it out!
- Applications for joining the organizing team for the next EasyCTF will open soon.
  If there was something you didn’t like about EasyCTF, and you think you could have done better, by all means, join the team!
  We’d like to hear your ideas.

Thanks for reading, and I hope I’ll be seeing you at the next CTF!

<footer>
  <p>By <a href="https://medium.com/@failedxyz" class="p-author h-card">Michael Zhang</a> on <a
      href="https://medium.com/p/4bbd1ca68877"><time class="dt-published" datetime="2017-03-24T11:36:40.681Z">March
        24, 2017</time></a>.</p>
  <p><a href="https://medium.com/@failedxyz/easyctf-2017-wrap-up-4bbd1ca68877" class="p-canonical">Canonical
      link</a></p>
  <p>Exported from <a href="https://medium.com">Medium</a> on October 8, 2024.</p>
</footer>
