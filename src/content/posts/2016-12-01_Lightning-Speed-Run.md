---
title: Lightning Speed Run
date: 2016-12-01T22:26:36.000Z
tags: [medium-blog]
---

<article class="h-entry">
  <section data-field="body" class="e-content">
    <section name="6b11" class="section section--body section--first section--last">
      <div class="section-content">
        <div class="section-inner sectionLayout--insetColumn">
          <p name="a5c4" id="a5c4" class="graf graf--p graf-after--h3">Recently, a new little icon appeared in the
            text box on Messenger next to the camera icon and payments:</p>
          <figure name="a818" id="a818" class="graf graf--figure graf-after--p"><img class="graf-image"
              data-image-id="0*pGW634t0gBRppaDV.png" data-width="417" data-height="165"
              src="https://cdn-images-1.medium.com/max/800/0*pGW634t0gBRppaDV.png">
            <figcaption class="imageCaption">The games icon.</figcaption>
          </figure>
          <p name="c25c" id="c25c" class="graf graf--p graf-after--figure">If you click it, a menu shows up and you
            can play a number of in-browser games. It seems that the games are run without any plugins, so they use
            HTML5 to run and interact with Facebook’s API, such as setting scores on the leaderboard and whatnot.</p>
          <p name="f0a0" id="f0a0" class="graf graf--p graf-after--p">In this post, I’ll look at the game <strong
              class="markup--strong markup--p-strong">TRACK &amp; FIELD 100M</strong>. The object of this game is to
            press the left-foot button and the right-foot button as quickly as possible. Since your final score is the
            elapsed time, lower scores will outrank higher scores. I will explain how to achieve a score of 0:00.01.
          </p>
          <h3 name="5a38" id="5a38" class="graf graf--h3 graf-after--p">Step 1: Finding the Source Files</h3>
          <p name="5644" id="5644" class="graf graf--p graf-after--h3">It turns out that when Messenger loads the
            source files for the game (which are *.js files) when you first open the game. This makes it easy to
            figure out which source files are responsible for the actual game logic. In this tutorial, I’ll be using
            Chrome, but I’ve confirmed that it works on Microsoft Edge as well.</p>
          <p name="7b9c" id="7b9c" class="graf graf--p graf-after--p">First, open Developer Tools using Ctrl+Shift+I
            or F12, and go to the Network tab. There might be a few resources loaded already; delete them with the 🛇
            button. Since we are looking for JavaScript files, open the filter view and select JS.</p>
          <p name="dcc3" id="dcc3" class="graf graf--p graf-after--p">Now, when Facebook loads the JavaScript source
            files, they will appear in this view. Open the game menu and press the Play button next to the game TRACK
            &amp; FIELD 100M. Once you have done this, a few files will start to appear.</p>
          <figure name="8807" id="8807" class="graf graf--figure graf-after--p"><img class="graf-image"
              data-image-id="0*_aZtMhKZDxW0im1t.png" data-width="676" data-height="275"
              src="https://cdn-images-1.medium.com/max/800/0*_aZtMhKZDxW0im1t.png">
            <figcaption class="imageCaption">Network tab in Chrome Developer Tools.</figcaption>
          </figure>
          <p name="07f6" id="07f6" class="graf graf--p graf-after--figure">main.js looks like a pretty good place to
            start. Look at the URL: <code
              class="markup--code markup--p-code">https://apps-1665884840370147.apps.fbsbx.com/instant-bundle/1230433990363006/1064870650278605/main.js</code>.
            Since this resource has already been loaded into the browser, we can find it under the Sources tab of
            Developer Tools. Trace the path, starting from the domain like this:</p>
          <figure name="360f" id="360f" class="graf graf--figure graf-after--p"><img class="graf-image"
              data-image-id="0*Dcb_QsTKJFFrq2lg.png" data-width="676" data-height="529"
              src="https://cdn-images-1.medium.com/max/800/0*Dcb_QsTKJFFrq2lg.png">
            <figcaption class="imageCaption">Finding the source code.</figcaption>
          </figure>
          <h3 name="e060" id="e060" class="graf graf--h3 graf-after--figure">Step 2: Analyzing main.js</h3>
          <p name="df9f" id="df9f" class="graf graf--p graf-after--h3">Go ahead an pretty-print the minified file,
            just like it suggests. (for those of you who didn’t get that notification, just hit the {} button next to
            Line/Column. Since this file isn’t obfuscated, it’s fairly easy to just look through the file and figure
            out what it does.</p>
          <p name="147a" id="147a" class="graf graf--p graf-after--p">I don’t really know how to explain this part
            well; if you’re familiar with code, you should be able to traverse the file pretty easily. I eventually
            arrived at this function:</p>
          <pre name="65f2" id="65f2"
            class="graf graf--pre graf-after--p">GameScene.prototype.stepEnd_ = function() {<br>    if (this.isStepTimeOver_(2e3)) {<br>        var e = Math.floor(1e3 * this.timeSpeed_.getTime());<br>        FBInstant.setScore(e),<br>        FBInstant.takeScreenshot(),<br>        this.stepFunc_ = this.stepEnd2_,<br>        this.audience_.fadeTo(.5)<br>    }<br>}</pre>
          <p name="ff9d" id="ff9d" class="graf graf--p graf-after--pre"><code
              class="markup--code markup--p-code">stepEnd_</code> is the handler for the event where the user finishes
            the game. As you can see, it computes the elapsed the time, and multiplies it by 1,000 (probably because
            Facebook stores these scores as integers). This is sent to Facebook using the <code
              class="markup--code markup--p-code">FBInstant</code> library’s <code
              class="markup--code markup--p-code">setScore</code> function. After looking at a couple of these games,
            you’ll notice that <code class="markup--code markup--p-code">FBInstant</code> is pretty much universal
            among these games, since it’s required to interact with the Facebook API.</p>
          <h3 name="25ef" id="25ef" class="graf graf--h3 graf-after--p">Step 3: The Exploit</h3>
          <p name="ed05" id="ed05" class="graf graf--p graf-after--h3">The strategy to exploit this is to add a
            breakpoint at that line, so code execution is paused before that line is executed. Then we are free to
            change the variable to whatever we’d like to change it to, and then resume execution so that our changed
            value is sent to the server.</p>
          <p name="4095" id="4095" class="graf graf--p graf-after--p">I’d like to point out that setting the variable
            to non-numerical types will simply cause the upload to fail. I’m guessing they’re doing some type-checking
            on it server-side. That doesn’t prevent us from simply changing the value to 0 and sending it to the
            server.</p>
          <p name="bf3b" id="bf3b" class="graf graf--p graf-after--p">To add a breakpoint to that line, click the line
            number where the line <code class="markup--code markup--p-code">FBInstant.setScore(e)</code> appears. The
            blue arrow indicates that a breakpoint has been set, and code execution will stop before this line starts.
          </p>
          <figure name="8c89" id="8c89" class="graf graf--figure graf-after--p"><img class="graf-image"
              data-image-id="0*pFhcPeUtuQ3H74Qd.png" data-width="427" data-height="151"
              src="https://cdn-images-1.medium.com/max/800/0*pFhcPeUtuQ3H74Qd.png">
            <figcaption class="imageCaption">Adding a breakpoint in the code.</figcaption>
          </figure>
          <p name="4780" id="4780" class="graf graf--p graf-after--figure">Now, start the game and play through it
            like normal. It doesn’t matter what score you get, as long as you finish and trigger the <code
              class="markup--code markup--p-code">stepEnd_</code> function, the code will stop and wait for you before
            submitting your score.</p>
          <p name="d32b" id="d32b" class="graf graf--p graf-after--p">If you are still on the Sources tab, you’ll be
            able to see the variables in the scope of the deepest function we are in when the code stops.</p>
          <figure name="8f1b" id="8f1b" class="graf graf--figure graf-after--p"><img class="graf-image"
              data-image-id="0*YZn_TJFtZ8NSNpne.png" data-width="679" data-height="521"
              src="https://cdn-images-1.medium.com/max/800/0*YZn_TJFtZ8NSNpne.png">
            <figcaption class="imageCaption">Local variables at the point where we added the breakpoint.</figcaption>
          </figure>
          <p name="23ff" id="23ff" class="graf graf--p graf-after--figure">Open the Console (either by navigating to
            the Console tab, or just pressing Esc to open it within the Sources tab), and just type</p>
          <pre name="135a" id="135a" class="graf graf--pre graf-after--p">e = 1</pre>
          <p name="b024" id="b024" class="graf graf--p graf-after--pre">We just changed the value of the local
            variable <code class="markup--code markup--p-code">e</code> to 1 (1 millisecond; for some reason it bugs
            when I use <code class="markup--code markup--p-code">e = 0</code>). When the execution continues, it will
            use our changed value, and submit that to the score server. Exit the game, and you should see that score
            reflected on the leaderboard.</p>
          <h3 name="d338" id="d338" class="graf graf--h3 graf-after--p">Recap</h3>
          <p name="4285" id="4285" class="graf graf--p graf-after--h3">When you are developing browser-based games,
            you can never trust user input. As long as the user has control, he can jack the browser logic and change
            variables during runtime. Ideally, the game logic should be done server-side, and the client is simply a
            terminal passing inputs to the server and visuals back to the client.</p>
          <p name="2d42" id="2d42" class="graf graf--p graf-after--p">However, this is highly impractical. If you sent
            a request for every input and waited for the server to respond, you’d get a huge delay, even for very fast
            connections. This is one of the hardest problems to tackle in real-time RPGs: how can we verify that the
            user is moving as they should, while still running the game as fast as we can?</p>
          <p name="90a9" id="90a9" class="graf graf--p graf-after--p graf--trailing">That’s all I have today. Thanks
            for reading!</p>
        </div>
      </div>
    </section>
  </section>
  <footer>
    <p>By <a href="https://medium.com/@failedxyz" class="p-author h-card">Michael Zhang</a> on <a
        href="https://medium.com/p/eb9637dc5b1c"><time class="dt-published"
          datetime="2016-12-01T22:26:36.000Z">December 1, 2016</time></a>.</p>
    <p><a href="https://medium.com/@failedxyz/lightning-speed-run-eb9637dc5b1c" class="p-canonical">Canonical link</a>
    </p>
    <p>Exported from <a href="https://medium.com">Medium</a> on October 8, 2024.</p>
  </footer>
</article>
