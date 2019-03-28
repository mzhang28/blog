+++
title = "twenty years of attacks on rsa.. with examples!"
date = 2018-10-26

[taxonomies]
tags = ["rsa", "math", "crypto", "python"]

[extra]
toc = true
+++

# 1. introduction

There's [this great paper][1] by Dan Boneh from 1998 about the RSA cryptosystem and its weaknesses. I found this paper to be a particularly interesting read (and interestingly enough, it's been 20 years since that paper!), so here I'm going to reiterate some of the attacks described in the paper, but using examples with numbers in them. (Also please excuse the lack of proper formatting, I've yet to figure out how to get Gutenberg to accept Latex)

That being said, I _am_ going to skip over the primer of how the RSA cryptosystem works, since there's already a great number of resources on how to do that.

## 1.1 factoring large integers

Obviously this is a pretty bruteforce-ish way to crack the cryptosystem, and probably won't work in time for you to see the result, but can still be considered an attack vector. This trick works by just factoring the modulus, N. With N, finding the private exponent d from the public exponent e is a piece of cake.

Let's choose some small numbers to demonstrate this one (you can follow along in a Python REPL if you want):

```py
>>> N = 881653369
>>> e = 17
>>> c = 875978376
```

N is clearly factorable in this case, and we can use resources like [msieve][7] or [factordb][2] to find smaller primes in this case. Since we know now that `N = 20717 * 42557`, we can find the totient of N:

```py
>>> p = 20717
>>> q = 42557
>>> tot = (p - 1) * (q - 1)
881590096
```

Now all that's left is to discover the private exponent and solve for the original message! (you can find the modular inverse function I used [here][3])

```py
>>> d = modinv(e, tot)
51858241
>>> pow(c, d, N)
31337
```

And that's it! Now let's look at some more sophisticated attacks...

# 2. elementary attacks

These attacks are related to the _misuse_ of the RSA system. (if you can't tell, I'm mirroring the document structure of the original paper)

## 2.1 common modulus

My cryptography professor gave this example as well. Suppose there was a setup in which the modulus was reused, maybe for convenience (although I suppose with libraries today, it'd actually be more _inconvenient_ to reuse the key). Key pairs would be issued to different users and they would share public keys with each other and keep private keys to themselves.

The problem here is if you have a key pair, and you got someone else's public key, you could easily derive the private key by just factoring the modulus. Let's see how this works with a real example now.

Since this is a big problem if you were to really use this cryptosystem, I'll be using actual keys from an actual crypto library instead of the small numbers like in the first example to show that this works on 2048-bit RSA. The library is called [PyCrypto][4], and if you're planning on doing anything related to crypto with Python, it's a good tool to have with you. For now, I'm going to generate a 2048-bit key (by the way, in practice you probably shouldn't be using 2048-bit keys anymore, I'm just trying to spare my computer here).

```py
>>> from Crypto.PublicKey import RSA
>>> k1 = RSA.generate(2048)
<_RSAobj @0x7f3d3226dfd0 n(2048),e,d,p,q,u,private>
```

Now, normally when you generate a new key, it'd generate a new modulus. For the sake of this common modulus attack, we'll force the new key to use the same modulus. This also means we'll have to choose an exponent e other than the default choice of 65537 (see [this link][5] for documentation):

```py
>>> N = k1.p * k1.q
29977270253913673973269594877868500604696844309480395834898813292056864035968758602074842333119394545818563664205865827843973433118231606201251719390934610989873635763197929136439794366715495587924829697045618064595517091398323127000591150167969423793125376862942962617933168868125721044755585292104012767604921511927694421931531763256179277376290836490302585046803170658011843375751827334637689505406974645481089358325805114205957009910758378725866614617688361814922628596814445370820099034880786971816556547138716303030977389113515312289367195090368607322922710704592536914377782096784092012774047931602714559411641
>>> e = k1.e
65537
>>> d = k1.d
15565200260470091881477501931717765645013182095721628848830000114674199708256113134107524142907363428287225581416015506594787249272629252596585055146773790032720599834991872233759704632573379913049026195290680640250863651116064783079834540016568221344526961094787464713454198443832494032866744158338151738236661515444305521301583312800890473043854752775780731961801793612989845832052044110301479536119434333369042172368546513808726742737729539432085793131998509039970952524552914892677427673231515899625998973161553704772256496315467235759715665448324408858980400807019213972046972829905566822336304711418843041721957
>>> e2 = 65539
>>> d2 = modinv(e2, (k1.p - 1) * (k1.q - 1))
28155004966198083605557147846430301877082565365203402029588435163682086478799751838610856433805281302245406343554098644058282620662395619703047797297929171630352487059669029554823105971149580111303390225692229359101863845359614581890498607677708812792166993283364928728648227920436362454567967968010840963546889938282011875589987758165583590886451185216017928261116297436515322115306907044332595229241201447860504794919920665520170088035323466070517987985855014612353911537010064927051269052451478774966384895845225295261610911375622081716902881447610710645142912550905885899057916649884624811336671599114611316629599
>>> k2 = RSA.construct((N, e2, d2))
<_RSAobj @0x7f3d31c7c5f8 n(2048),e,d,p,q,u,private>
```

Ok, now we have two keys, `k1` and `k2`. Now I'll show how using only the public and private key of `k1` (assuming this is the pair that we got legitimately from the crypto operator), and the public key of `k2`, which is tied to the same modulus, we can find the private key of `k2`.

To do this, we'll try to find the roots of the equation `f(x) = x^2 - (p + q)x + pq`. You'll find that for values of `p` and `q`, this will produce `f(p) = p^2 - p^2 - qp + pq`, and `f(q) = q^2 - pq - q^2 + pq`. We know that `N = pq`. How can we find `p + q`? Since `phi(N) = (p - 1)(q - 1) = pq - p - q + 1`, we can find that `phi(N) = N - (p + q) + 1`, so `p + q = N - phi(N) + 1`. Now we need to use `e` and `d` to estimate `phi(N)`. Recall that `ed = 1 mod phi(N)`. This is equivalent to saying `ed = 1 + k*phi(N)`. Then `(ed - 1) / phi(N) = k`.

It turns out that `k` is extremely close to `ed/N`: `ed/N = (1 + k*phi(N)) / N = 1/N + k*phi(N)/N`. `1/N` is basically 0, and `phi(N)` is very close to `N`, so it shouldn't change the value of `k` by very much. We now use `ed/N` to estimate `k`: `phi(N) = (ed - 1) / (ed / N)`.

```py
>>> from decimal import Decimal, getcontext
>>> getcontext().prec = 1000
>>> k = round(Decimal(e) * Decimal(d) / Decimal(N))
34029
>>> phi = (Decimal(e) * Decimal(d) - 1) / Decimal(k)
Decimal('29977270253913673973269594877868500604696844309480395834898813292056864035968758602074842333119394545818563664205865827843973433118231606201251719390934610989873635763197929136439794366715495587924829697045618064595517091398323127000591150167969423793125376862942962617933168868125721044755585292104012767604575090001864613992237960887242026855773279634028088706121371418922552125986506064146112561599205615974813154971272528592745144988174228621487749404677959591894452249599588096076892574585613962026186332366180174253118634077603697727952204486962202338916762987146793208323561031870496718547544796269555861921652')
```

Then we can get `p + q` through the formula mentioend above:

```py
>>> B = Decimal(N) - phi + 1
Decimal('346421925829807939293802368937250520517556856274496340681799239089291249765321270491576943807769029506276203354532585613211864922584150104378865213010402223028176347214857274743206460295173009790370214772536128777858755035911614561414990603406404984005947717445743706054221064913595294226503135333158697489990')
>>> C = Decimal(N)
```

Check to make sure B and C are integers. If they're not, try using a higher precision in `getcontext().prec`. Now solve the quadratic equation:

```py
>>> p = (B + (B * B - 4 * C).sqrt()) / Decimal(2)
Decimal('178187650567807686297508761669341068026596182918164336679269778091413760248796912297951278062644499145975246732979455707116872915963269648808994075794761810506203681312867668286737214808081540392248516550834072470288052831951959306342657446325786002900014749794262752196461389552859745880480150585554246119623')
>>> q = (B - (B * B - 4 * C).sqrt()) / Decimal(2)
Decimal('168234275262000252996293607267909452490960673356332004002529460997877489516524358193625665745124530360300956621553129906094992006620880455569871137215640412521972665901989606456469245487091469398121698221702056307570702203959655255072333157080618981105932967651480953857759675360735548346022984747604451370367')
>>> p * q == N
True
```

We've successfully recovered `p` and `q` from just `N`, `e`, and `d`!

## 2.2 blinding

This attack is actually about RSA _signatures_ (which uses the opposite keys as encryption: private for signing and public for verifying), and shows how you can compute the signature of a message M using the signature of a derived message M'.

Suppose Marvin wants Bob to sign the following message: `"I (Bob) owes Marvin $100,000 USD"`. Marvin hands this to Bob saying something like, "I'll just need you to sign this with your private key." Let's generate Bob's private key:

```py
>>> from Crypto.Util.number import bytes_to_long, long_to_bytes
>>> from Crypto.PublicKey import RSA
>>> bob = RSA.generate(2048)
<_RSAobj @0x7f4309521128 n(2048),e,d,p,q,u,private>
>>> M = b"I (Bob) owes Marvin $100,000 USD"
```

Obviously, Bob, an intellectual, will refuse to sign the message. However, suppose Marvin now transforms his message into a more innocent looking one. He does this by turning M into `M' = (r^e)*M mod N` where r is an integer that's coprime to N:

```py
>>> from random import randint
>>> N = bob.p * bob.q # this is publicly available knowledge
>>> r = 19
>>> Mp = long_to_bytes((pow(r, bob.e, N) * bytes_to_long(M)) % N)
b'7\x90\xbc\xf9%T\xa9\xee\xf4\xe3?>]\x88\xcd\xb4\xd6D#\xfc\xcb\x0fd\xf0\x8e\xbc>\n\x06\xcd\x0f\x89\x0bp\xa7o\xd6\x02\xa6\xa7\x81\xd8\n\xae\xfb\x08\xaa|\xbd.\xc9E\xf1|\x86\xcaZ\xaa\xd4L\xafaA\x0c}\x84\x04\n\xa4\xa5\x80\xecX<\xe0\xb5\xf6\xfb\xe3\xcc\xd5BD7\xdc\xaep\x7f\xe9vi\xabB\xe2\xadE\xa41K\xc6\xb7\xae\x01\xcb\x04C\xaf\x8b\x17\x83\xffX7z\xb1\xbf\xceF\xafN(x\x00\x9f\xe1kV\xee\x0b\xbd\xc3H\r\xee9\x81\x16\xb2\x10hb.\x90\x08\xe42$Q\x92Ew+\xe1@\xf9\x17%\xce/\xbd\x00\xad\xe2\x12\x01\x93\x8b\xc4\x1bx\xe6H?\x15\xdfPE@\xf9j\xe3\xb7\x9e\xa0\x86\xd1\xd3\xb6[\xf7q\xf1\x95N\xd3>/\x06\x80\xc7\xa3\x8a\xcbDy\xc6v\x01P\x14\xa9Be\xf7~p\xc5\xaa\xac\xa0\xaf\xbe#\xe5\x18\xc6\x1d\xd5\x14\xc1\xbbYXD\x0c\x91{\xc0s\xde]\x18Z\x8bSk\x07k\xb6\x9a\xa5`Iqe~'
```

Now he asks Bob to sign this more... innocently-looking message. Without questioning, Bob, an intellectual, signs his life away. Let's say he produces a signature `S' = (M'^d) = (r^e * M)^d = r^(ed) * M^d = r * M^d mod N`.

```py
>>> Sp, = bob.sign(Mp, 0)
4222298342813922437811434251340999736739055616654488323193778229765071846717137952694561809398626068283668428796351354154566771597532278827070832905206221261994843265685464173739776886856384806238418884247949451413559988796455422271296883338455956330421559319009950760931899199217936823999874162064553735563087382870564193673989865778229832918474778963380170967676966373703157629615331081637805594392084045827925764529711433584853942576464491576212176547485726609891593617931393545058401472883178443786988683045423150809606471425615670582973274971087459634959553685559458456237617436410759134193279063427911112115134
```

Now, all Marvin has to do is multiply by the modular inverse of r, to obtain `M^d`, the signature of the original message:

```py
>>> S = (Sp * modinv(r, N)) % N
6137678992536399703654836416525985142902780822513172949427421060785532284955531529418529725602418902796840570634560123808769013384654624916503940938715718120521434666716675795201896105310462331838807171312705686415521871046533303776516500490921892398440988515777575520183847518597482163414665355222659603386541869176930658730416118799866012276767364050134126722746224706026850062367243018313483359694686773566231956425606553198607719740067340776177716443517567144901614253170719278035838849363127850910135864099535083004590180745762100334268408681888925040382341592080592207557742366581814701422371311084081150092871
```

Sure enough, if you try to verify the "original" signature against the original message, it checks out.

```py
>>> bob.verify(M, (S,))
True
```

Marvin has now successfully tricked Bob into signing his life away.

This post is a work in progress.. I'll update it as I add more.

[1]: https://crypto.stanford.edu/~dabo/papers/RSA-survey.pdf
[2]: http://factordb.com/
[3]: https://stackoverflow.com/a/9758173
[4]: https://github.com/dlitz/pycrypto
[5]: https://www.dlitz.net/software/pycrypto/api/current/Crypto.PublicKey.RSA.RSAImplementation-class.html#construct
[6]: https://crypto.stackexchange.com/a/14713
[7]: https://github.com/radii/msieve
