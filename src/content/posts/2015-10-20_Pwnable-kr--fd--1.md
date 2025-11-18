---
title: "Pwnable.kr: fd (1)"
date: 2015-10-20T18:20:38.431Z
tags: [medium-blog]
---

<article class="h-entry">
  <section data-field="body" class="e-content">
    <section name="1d23" class="section section--body section--first section--last">
      <div class="section-content">
        <div class="section-inner sectionLayout--insetColumn">
          <p name="ec7e" id="ec7e" class="graf graf--p graf-after--h3">This is my first writeup. The problem reads:
          </p>
          <blockquote name="b33e" id="b33e" class="graf graf--blockquote graf-after--p">Mommy! what is a file
            descriptor in Linux?<br>ssh fd@pwnable.kr -p2222 (pw:guest)</blockquote>
          <p name="0cc2" id="0cc2" class="graf graf--p graf-after--blockquote">Since it tells us to SSH to their
            server, we’ll do that. Upon logging in, we find fd, an executable binary, fd.c, the source file, and flag,
            the target file we are trying to read, but is currently protected by root. Let’s begin by analyzing fd.c.
          </p>
          <p name="3ba1" id="3ba1" class="graf graf--p graf-after--p">At the if statement, the program is checking buf
            against the string LETMEWIN. Where is buf being read? It’s being read from a variable called fd, which is
            a <a href="https://en.wikipedia.org/wiki/File_descriptor"
              data-href="https://en.wikipedia.org/wiki/File_descriptor" class="markup--anchor markup--p-anchor"
              rel="noopener" target="_blank"><strong class="markup--strong markup--p-strong">file
                descriptor</strong></a>. Since the only way we can give input to the program is STDIN_FILENO, we have
            to make sure fd is set to 0.</p>
          <p name="a905" id="a905" class="graf graf--p graf-after--p">According to the code, fd is calculated by atoi(
            argv[1] ) — 0x1234: it converts the user input into an integer and subtracts 0x1234, or 4660 in decimal.
            To make fd equal to 0, we simply pass 4660 as an argument. This should cause the program to prompt us for
            input. Now we just enter LETMEWIN, and it should print out the flag :)</p>
          <blockquote name="8dca" id="8dca" class="graf graf--blockquote graf-after--p graf--trailing">mommy! I think
            I know what a file descriptor is!!</blockquote>
        </div>
      </div>
    </section>
  </section>
  <footer>
    <p>By <a href="https://medium.com/@failedxyz" class="p-author h-card">Michael Zhang</a> on <a
        href="https://medium.com/p/f9b66ed3a312"><time class="dt-published"
          datetime="2015-10-20T18:20:38.431Z">October 20, 2015</time></a>.</p>
    <p><a href="https://medium.com/@failedxyz/pwnable-kr-fd-1-f9b66ed3a312" class="p-canonical">Canonical link</a></p>
    <p>Exported from <a href="https://medium.com">Medium</a> on October 8, 2024.</p>
  </footer>
</article>
