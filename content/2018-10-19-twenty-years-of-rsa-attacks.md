+++
title = "twenty years of attacks on rsa.. with examples!"
template = "post.html"
date = 2018-10-19

tags = ["rsa"]
draft = true

[extra]
toc = true
+++

# 1. introduction

There's [this paper][1] by Dan Boneh from 1998 about the RSA cryptosystem and its weaknesses. I found this paper to be a particularly interesting read (and interestingly enough, it's been 20 years since that paper!), so here I'm going to reiterate some of the points in the paper, but using examples with numbers in them.

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

Since this is a big problem if you were to really use this cryptosystem, I'll be using actual keys from an actual crypto library instead of the small numbers like in the first example. The library is called [PyCrypto][4], and if you're planning on doing anything related to crypto with Python, it's a good tool to have with you. For now, I'm going to generate a 2048-bit key (by the way, in practice you probably shouldn't be using 2048-bit keys anymore, I'm just trying to spare my computer here).

```py
>>> from Crypto.PublicKey import RSA
>>> k1 = RSA.generate(2048)
```

Now, normally when you generate a new key, it'd generate a new modulus. For the sake of this common modulus attack, we'll force the new key to use the same modulus. This also means we'll have to choose an exponent e other than the default choice of 65537 (see [this link][5] for documentation):

```py
>>> N2 = k1.p * k1.q
>>> e2 = 65539
>>> d2 = modinv(e2, (k1.p - 1) * (k1.q - 1))
>>> k2 = RSA.construct((N2, e2, d2))
```

Ok, now we have two keys, `k1` and `k2`. Now I'll show how using only the public and private key of `k1` (assuming this is the pair that we got legitimately from the crypto operator), and the public key of `k2`, which is tied to the same modulus, we can find the private key of `k2`.

To do this, we'll use the fact that `ed = 1 mod tot(N)`. But we know the public exponent is `e = 65537`. So now we have the following pieces of information:

- `pq = N`
- `(p - 1)(q - 1) = p*q - p - q + 1 = tot(N)`
- `ed - 1 | tot(N)`

Additionally, it follows that:

- `tot(N) = N - p - q + 1`
- `ed - 1 = k * tot(N)`

// TODO

## 2.2 blinding

This attack is actually about RSA _signatures_, and shows how you can compute the signature of a message M using the signature of a derived message M'.

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

# 3. low private exponent



[1]: https://crypto.stanford.edu/~dabo/papers/RSA-survey.pdf
[2]: http://factordb.com/
[3]: https://stackoverflow.com/a/9758173
[4]: https://github.com/dlitz/pycrypto
[5]: https://www.dlitz.net/software/pycrypto/api/current/Crypto.PublicKey.RSA.RSAImplementation-class.html#construct
[6]: https://crypto.stackexchange.com/a/14713
[7]: https://github.com/radii/msieve
