---
title: EasyCTF 2017 Wrap-up
date: 2017-03-24T11:36:40.681Z
tags: [medium-blog]
---

<article class="h-entry">
  <section data-field="body" class="e-content">
    <section name="5ea1" class="section section--body section--first section--last">
      <div class="section-content">
        <div class="section-inner sectionLayout--insetColumn">
          <p name="398b" id="398b" class="graf graf--p graf-after--h3">EasyCTF just concluded this Monday! Looking
            back on the competition, I’d say that this year was our best year ever. Let’s take a look at some of the
            stats.</p>
          <ul class="postList">
            <li name="2082" id="2082" class="graf graf--li graf-after--p"><strong
                class="markup--strong markup--li-strong">5,837</strong> users registered this year, playing on <strong
                class="markup--strong markup--li-strong">2,742</strong> teams. Of those teams, <strong
                class="markup--strong markup--li-strong">1,938</strong> teams scored points.</li>
            <li name="0fe5" id="0fe5" class="graf graf--li graf-after--li">We had <strong
                class="markup--strong markup--li-strong">63</strong> challenges, which was close to our 68 last year.
            </li>
            <li name="1105" id="1105" class="graf graf--li graf-after--li"><strong
                class="markup--strong markup--li-strong">10.7%</strong> of all teams had 5 members — full teams! In
              fact, there were more 5-member teams than there were 4-, 3-, and 2-member teams.</li>
          </ul>
          <p name="9393" id="9393" class="graf graf--p graf-after--li">I’m really happy to see that so many people
            were willing to give us a week of their time to participate in our event and work through our challenges,
            despite the fact that we hadn’t promised any prizes ahead of time.</p>
          <p name="a95a" id="a95a" class="graf graf--p graf-after--p">I’d also like to give a shout-out to the entire
            dev team who helped monitor basically every point of contact that people had with us and creating amazing
            challenges.</p>
          <h3 name="17c6" id="17c6" class="graf graf--h3 graf-after--p">Improvements for next year</h3>
          <p name="80aa" id="80aa" class="graf graf--p graf-after--h3">I still haven’t decided whether I’ll be
            completely involved in organizing this event again next year. I hope that I’ll have some free time
            alongside my classes, but I’d also like some more cooperation from the rest of the organizers. The biggest
            problem we had this year was basically not working on anything until the week before the competition. By
            that time, it was already too late. Let’s take a closer look at what actually went wrong:</p>
          <ul class="postList">
            <li name="09a8" id="09a8" class="graf graf--li graf-after--p"><strong
                class="markup--strong markup--li-strong">Lack of motivation.</strong> I’m not sure people were
              actually busy during the entire year that we had planned to work, but there was definitely a lack of
              work put into organizing the competition. We had some big ideas at the beginning of the year, but as
              time passed, the chances of those ideas becoming reality looked rather slim as no one wanted to be the
              first one to start working. Somewhere in there I threw in a couple of deadlines, and we got a couple of
              problems written. Had I not done that, I fear we would have had much fewer problems than we actually
              did.</li>
            <li name="6dea" id="6dea" class="graf graf--li graf-after--li"><strong
                class="markup--strong markup--li-strong">No contact with sponsor companies.</strong> Contacting
              sponsors should have been one of the first things we did, since it takes a long time to sort out details
              and companies usually take at least two weeks to reply to emails anyway. Towards the end, we did get an
              email from DigitalOcean saying they were willing to fund servers for our competition, but launch day
              came and we didn’t hear back from them again.</li>
            <li name="135a" id="135a" class="graf graf--li graf-after--li"><strong
                class="markup--strong markup--li-strong">No coordination.</strong> Some of the feedback I’ve been
              hearing about this year’s competition is a shortage of actually “easy” problems. We never really went
              through the competition and tried to lay out a “spectrum” of problems nor tackle it from the
              participants’ perspective. Every problem was either just a “cool idea” someone had or “I feel like a CTF
              needs this.” The intermediate web section was completely missing.</li>
            <li name="f9eb" id="f9eb" class="graf graf--li graf-after--li"><strong
                class="markup--strong markup--li-strong">Unbalanced team.</strong> Our team comprised mainly of
              problem writers. That’s great and all, but when it comes to things like contacting sponsor companies,
              writing the website, planning some kind of game, we basically have no resources to do those. I spent my
              entire time developing OpenCTF, the platform that powered the competition, and I know for sure that was
              a task too large for me to handle. Getting more web designers or people with other skills would have
              helped out a lot.</li>
          </ul>
          <p name="e77f" id="e77f" class="graf graf--p graf-after--li">I’ve also got a couple of points of reflection
            for prospective CTF organizers, so if you’re planning to run a CTF, this is for you.</p>
          <ul class="postList">
            <li name="f14f" id="f14f" class="graf graf--li graf-after--p"><strong
                class="markup--strong markup--li-strong">Participant experience takes first priority.</strong> A lot
              of organizers think the hardest part of running a CTF is getting good challenges. And they’d be right.
              But that’s not to say that preparing a solid game infrastructure for flag submission is going to be
              something you can do last-minute. When it comes to the participants’ experience, the first thing that
              they encounter is the website. Then a few initial challenges. Then probably the chat. Make sure you have
              those down well and people will probably have a better initial impression of your CTF.</li>
            <li name="f87b" id="f87b" class="graf graf--li graf-after--li"><strong
                class="markup--strong markup--li-strong">Some people are there to make you miserable.</strong> As the
              one in control, you need to account for those people. We’re lucky that we only had relatively few
              encounters with such people but do keep in mind that you are still running an event and that takes first
              priority. During EasyCTF, there were a couple of people who thought it was funny to drop flags for hard
              challenges into the chat room. When we tried to get them to stop, they would come back under different
              aliases in order to annoy us. At that point we just shut down the entire chat room; the competition had
              to go on.</li>
            <li name="dd6b" id="dd6b" class="graf graf--li graf-after--li"><strong
                class="markup--strong markup--li-strong">Ignore unconstructive negative feedback.</strong> You’re
              always going to have haters. Don’t take it to heart, solve the problems, and move on. Who cares if some
              random kid in IRC says your CTF is garbage? Ask them what issues they’re having, fix them, and they’ll
              be happy. It’s really not that complicated.</li>
            <li name="2add" id="2add" class="graf graf--li graf-after--li"><strong
                class="markup--strong markup--li-strong">Docker.</strong> Is probably a good idea. The learning curve
              is not bad and it’s a great way to create disposable containers that can restart easily. Not only should
              you use Docker for your main competition website, you should also use it for all of the challenges that
              involve communicating with a server.</li>
          </ul>
          <p name="56ba" id="56ba" class="graf graf--p graf-after--li">Here’s something else I definitely have to
            share. We had this autogen system that created different flags for different teams in order to discourage
            flag sharing. Some people came up to us reporting that their flag wasn’t working, when they clearly just
            took some other team’s flag. I didn’t really do anything about it, but just thought it was pretty funny
            that they had the nerve to report it to us even though they were cheating.</p>
          <p name="683f" id="683f" class="graf graf--p graf-after--p">So, what’s the future for EasyCTF?</p>
          <ul class="postList">
            <li name="7263" id="7263" class="graf graf--li graf-after--p">I’m seeing OpenCTF as a more permanent
              solution to our main platform. It’s a very complex piece of software and it would be insane to try to
              rewrite it from scratch. I’m in the process of creating an open-source version of it and making it
              customizable (for example, turning off features that you don’t need like the programming judge) for CTF
              organizers.</li>
            <li name="b2ec" id="b2ec" class="graf graf--li graf-after--li">We had this project going on a while back
              for a CTF calendar that also hosted tasks. I was also hoping that it would be able to replay entire
              competitions but that seems a bit too hopeful at this point. It would be nice to just get the calendar
              revived.</li>
            <li name="bc5e" id="bc5e" class="graf graf--li graf-after--li">WeebCTF is happening again this summer,
              dates still yet to be decided. If you’re into anime (or even if you’re not), come check it out!</li>
            <li name="ff8a" id="ff8a" class="graf graf--li graf-after--li">Applications for joining the organizing
              team for the next EasyCTF will open soon. If there was something you didn’t like about EasyCTF, and you
              think you could have done better, by all means, join the team! We’d like to hear your ideas.</li>
          </ul>
          <p name="ef5b" id="ef5b" class="graf graf--p graf-after--li graf--trailing">Thanks for reading, and I hope
            I’ll be seeing you at the next CTF!</p>
        </div>
      </div>
    </section>
  </section>
  <footer>
    <p>By <a href="https://medium.com/@failedxyz" class="p-author h-card">Michael Zhang</a> on <a
        href="https://medium.com/p/4bbd1ca68877"><time class="dt-published" datetime="2017-03-24T11:36:40.681Z">March
          24, 2017</time></a>.</p>
    <p><a href="https://medium.com/@failedxyz/easyctf-2017-wrap-up-4bbd1ca68877" class="p-canonical">Canonical
        link</a></p>
    <p>Exported from <a href="https://medium.com">Medium</a> on October 8, 2024.</p>
  </footer>
</article>