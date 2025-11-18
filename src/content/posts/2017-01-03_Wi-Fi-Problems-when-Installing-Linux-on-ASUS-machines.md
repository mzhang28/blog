---
title: Wi-Fi Problems when Installing Linux on ASUS machines
date: 2017-01-03T22:58:06.000Z
tags: [medium-blog]
---

<article class="h-entry">
  <section data-field="body" class="e-content">
    <section name="0ff7" class="section section--body section--first section--last">
      <div class="section-content">
        <div class="section-inner sectionLayout--insetColumn">
          <p name="3a83" id="3a83" class="graf graf--p graf-after--h3">Recently, I’ve been exploring installing
            various Linux distributions over my Windows installation. The main reason for doing this would be not
            having to pull up a virtual machine every time I wanted to do anything.</p>
          <p name="3a29" id="3a29" class="graf graf--p graf-after--p">But with both Arch Linux and Ubuntu, I kept
            running into the same problem: I couldn’t connect to Wi-Fi. I poked around, and it said that my network
            switch (the hardware one) was switched off. No matter what I tried to do with <code
              class="markup--code markup--p-code">rfkill</code>, I couldn’t get the physical switch back on.</p>
          <p name="43b7" id="43b7" class="graf graf--p graf-after--p">My ASUS computer doesn’t have a network switch.
            There’s an ‘airplane mode’ button, but that didn’t really do anything either. I eventually found the
            solution in <a href="https://ubuntuforums.org/showthread.php?t=2181558"
              data-href="https://ubuntuforums.org/showthread.php?t=2181558" class="markup--anchor markup--p-anchor"
              rel="noopener" target="_blank">this thread</a>, but I’ll repeat it here.</p>
          <pre name="32a3" id="32a3"
            class="graf graf--pre graf-after--p">echo &quot;options asus_nb_wmi wapf=4&quot; | sudo tee /etc/modprobe.d/asus_nb_wmi.conf</pre>
          <p name="203e" id="203e" class="graf graf--p graf-after--pre">..or simply put that line in that file. <code
              class="markup--code markup--p-code">asus_nb_wmi</code> is the driver for the Wi-Fi module. What does
            <code class="markup--code markup--p-code">wapf=4</code> do? Well, according to <a
              href="https://github.com/rufferson/ashs" data-href="https://github.com/rufferson/ashs"
              class="markup--anchor markup--p-anchor" rel="noopener" target="_blank">this</a>,
          </p>
          <blockquote name="9624" id="9624" class="graf graf--blockquote graf-after--p">When WAPF = 4 — driver sends
            ACPI scancode 0x88 which is converted by asus-wmi to RFKILL key, which is processed by all registerd
            rfkill drivers to toggle their state.</blockquote>
          <p name="6456" id="6456" class="graf graf--p graf-after--blockquote">Essentially, it is making <code
              class="markup--code markup--p-code">rfkill</code> recognize that the hardware switch is not off, so the
            Wi-Fi works again.</p>
          <p name="ca42" id="ca42" class="graf graf--p graf-after--p graf--trailing">Thanks for reading!</p>
        </div>
      </div>
    </section>
  </section>
  <footer>
    <p>By <a href="https://medium.com/@failedxyz" class="p-author h-card">Michael Zhang</a> on <a
        href="https://medium.com/p/75be2b8b7cc3"><time class="dt-published" datetime="2017-01-03T22:58:06.000Z">January
          3, 2017</time></a>.</p>
    <p><a href="https://medium.com/@failedxyz/wi-fi-problems-when-installing-linux-on-asus-machines-75be2b8b7cc3"
        class="p-canonical">Canonical link</a></p>
    <p>Exported from <a href="https://medium.com">Medium</a> on October 8, 2024.</p>
  </footer>
</article>