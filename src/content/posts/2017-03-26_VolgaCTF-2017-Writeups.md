---
title: VolgaCTF 2017 Writeups
date: 2017-03-26T21:52:31.553Z
tags: [medium-blog]
---

<article class="h-entry">
  <section data-field="body" class="e-content">
    <section name="0b53" class="section section--body section--first section--last">
      <div class="section-content">
        <div class="section-inner sectionLayout--insetColumn">
          <p name="e3cc" id="e3cc" class="graf graf--p graf-after--h3">I participated in VolgaCTF under the team Shell
            Smash. We finished in 138th place with 600 points. Here are the write-ups for the problems that I did.</p>
          <h3 name="bb61" id="bb61" class="graf graf--h3 graf-after--p">VC (50 points)</h3>
          <p name="f5dc" id="f5dc" class="graf graf--p graf-after--h3">This was a pretty standard image analysis
            problem. We are given two images that are relatively similar, except for a couple of bytes. If we just xor
            the two images together, the flag appears in plain sight.</p>
          <figure name="dee3" id="dee3" class="graf graf--figure graf--iframe graf-after--p">
            <script src="https://gist.github.com/failedxyz/a7958fd7b5fff2c7b04de034cb9bc199.js"></script>
          </figure>
          <h3 name="1171" id="1171" class="graf graf--h3 graf-after--figure">PyCrypto (100 points)</h3>
          <p name="3968" id="3968" class="graf graf--p graf-after--h3">We are given a Python file with an encrypt
            function. It’s using an encryption function from the <code
              class="markup--code markup--p-code">pycryptography.so</code> library that was also given. By analyzing
            the so, it looks like the encryption algorithm is simply an xor with the key, and if the key is shorter
            than the message, then just repeat the key. This algorithm is known as a vigenère cipher, or repeating-key
            xor cipher. Fortunately, I had some old code to crack this type of cipher exactly from cryptopals.</p>
          <figure name="a89f" id="a89f" class="graf graf--figure graf--iframe graf-after--p">
            <script src="https://gist.github.com/failedxyz/425c663e1cb56caa328a1e263ec1565e.js"></script>
          </figure>
          <h3 name="df11" id="df11" class="graf graf--h3 graf-after--figure">Angry Guessing Game (200 points)</h3>
          <p name="9dc1" id="9dc1" class="graf graf--p graf-after--h3">The first step was to open this binary in IDA.
            It’s easy to get lost, because there are so many functions, so the first thing I did was hit Shift+F12 and
            look at the strings. The one I was looking for, in particular, was “You’ve entered the correct license
            key!” If I found where this was called during execution, I could trace it back to the actual place where
            it performs the check.</p>
          <figure name="ca83" id="ca83" class="graf graf--figure graf-after--p"><img class="graf-image"
              data-image-id="1*tOWToDf10V2YnUScoVAlhg.png" data-width="972" data-height="144"
              src="https://cdn-images-1.medium.com/max/800/1*tOWToDf10V2YnUScoVAlhg.png">
            <figcaption class="imageCaption">Using the strings to follow execution.</figcaption>
          </figure>
          <p name="4cd9" id="4cd9" class="graf graf--p graf-after--figure">Here you can see I’ve found that sub_5F70
            contains the code that checks whether you’ve already played 3 times, and tells the program to start asking
            for a license key. Should it ask for a license key, it will redirect the execution to sub_6660, where it
            actually prompts the user.</p>
          <p name="990a" id="990a" class="graf graf--p graf-after--p">I’m going to start from the bottom of sub_6660,
            trying to follow what it’s returning, because ultimately the result of this function is either going to be
            true/false — whether it accepts your license key. Poking around, I found this call to an interesting
            function: sub_67D0. Seems like it’s literally just checking your license key character by character.</p>
          <figure name="e892" id="e892" class="graf graf--figure graf-after--p"><img class="graf-image"
              data-image-id="1*m6YBCqASg66wa1I6IXlRtQ.png" data-width="484" data-height="776"
              src="https://cdn-images-1.medium.com/max/800/1*m6YBCqASg66wa1I6IXlRtQ.png">
            <figcaption class="imageCaption">The license key checker.</figcaption>
          </figure>
          <p name="ced2" id="ced2" class="graf graf--p graf-after--figure">I wonder what happens if you just convert
            all of those values to ASCII?</p>
          <figure name="fd19" id="fd19" class="graf graf--figure graf-after--p"><img class="graf-image"
              data-image-id="1*KkjogeoBtk7d3Z-cslOu6w.png" data-width="667" data-height="785"
              src="https://cdn-images-1.medium.com/max/800/1*KkjogeoBtk7d3Z-cslOu6w.png">
            <figcaption class="imageCaption">The letters of the flag.</figcaption>
          </figure>
          <p name="780e" id="780e" class="graf graf--p graf-after--figure">Looks like our license key is the flag!</p>
          <h3 name="25ef" id="25ef" class="graf graf--h3 graf-after--p">KeyPass (100 points)</h3>
          <p name="ee4c" id="ee4c" class="graf graf--p graf-after--h3">I didn’t actually finish this one during the
            competition time, because I was being really stupid and not reading their hint. In this challenge, they
            handed out an encrypted flag and a program that “generates secure encryption keys.”</p>
          <p name="53fd" id="53fd" class="graf graf--p graf-after--p">Picking apart the binary, it looks like what the
            program is doing is just generating a seed out of the passphrase that you give to it, by xor’ing every
            character of your passphrase together. This was then used in an LCG to get “random” bytes out of a
            dictionary of 82 bytes.</p>
          <p name="4045" id="4045" class="graf graf--p graf-after--p">The problem with this method is, there a total
            of about 128 values for this “seed,” because ASCII values range from 0 to 128, and since higher bits are
            not involved, xor will never go out of that range either. So to solve the problem, you simply generate all
            of the keys for seeds from 0 to 128. I’ve reimplemented the key generation in Python here:</p>
          <figure name="0cc9" id="0cc9" class="graf graf--figure graf--iframe graf-after--p">
            <script src="https://gist.github.com/failedxyz/1cbc3a63152d095dca58f7b6d89a8b77.js"></script>
          </figure>
          <p name="acb2" id="acb2" class="graf graf--p graf-after--figure graf--trailing">So why couldn’t I finish it?
            Because when I was actually checking the key with <code
              class="markup--code markup--p-code">openssl aes-128-cbc -d -in flag.zip.enc -out flag.zip -pass env:PASSWORD</code>,
            I wasn’t using the version of OpenSSL that they specified, version 1.1.0e. Lesson learned, I guess.</p>
        </div>
      </div>
    </section>
  </section>
  <footer>
    <p>By <a href="https://medium.com/@failedxyz" class="p-author h-card">Michael Zhang</a> on <a
        href="https://medium.com/p/632fa7821dca"><time class="dt-published" datetime="2017-03-26T21:52:31.553Z">March
          26, 2017</time></a>.</p>
    <p><a href="https://medium.com/@failedxyz/volgactf-2017-writeups-632fa7821dca" class="p-canonical">Canonical
        link</a></p>
    <p>Exported from <a href="https://medium.com">Medium</a> on October 8, 2024.</p>
  </footer>
</article>
