+++
title = "pumping lemma proofs"
template = "post.html"
date = 2018-02-12

tags = ["education", "math"]
+++

I'm learning about language theory and the pumping lemma in my automata class. This post exists mainly for my personal understanding, but also to build up a future reference. Here I explain the idea of the pumping lemma and how it can be used to disprove properties about languages.

The pumping lemma provides an interesting sense of "closedness" among languages. On the most general level, if you know that your language is regular, or if it is a context-free language, it can be "pumped"; that is, part of the string can be repeated in such a way that the resulting string will still belong to the original language. I bunched regular languages and context-free languages together in here but the way the pumping lemma works for these two classes of languages actually works quite differently. In this post I'll just focus on the version of the pumping lemma for regular languages, but the version for context-free languages is a bit more involved.

[Regular languages](https://en.wikipedia.org/wiki/Regular_language) are languages that can be recognized by a finite automaton. If you recall, one of the biggest limitations about finite automata are that they cannot keep track of "parsing state" for arbitrarily long strings. One of the most common examples of an irregular language is the language matching *binary palindromes*. We'll define this language over the alphabet with symbols $\left\{0, 1\right\}$ as: $\left\{ss^R\right\}$, where $s^R$ denotes the reverse of the string. Let's stick to even-length palindromes for now, since it doesn't take that much more work to extend the proof to odd-length palindromes.

Basically, for any regular language, the pumping lemma guarantees that there exists a pumping length $P$, and that *every* string that is longer than this pumping length will be able to be represented as a concatenation of 3 smaller strings (let's call them $x$, $y$, and $z$) that have some pretty unique properties.

As long as $|xy| \leq P$ (that is, the length of $x$ concat $y$ is at most $p$), and $y$ is not empty, then the string $y$ can be repeated as many times as you'd like, and the resulting string would still be a member of the original language. To clarify, this means the strings $xz$, $xyz$, $xyyz$, $xyyyz$, etc. will all be closed under the same language. The string $xz$ would just be the equivalent of "unpumping" $y$, or taking 0 copies of $y$.

So if a regular language is guaranteed to have a pumping length and all these fantastic properties, if a language happens to not have these properties, it will have been proven to not be regular. Let's take this and apply it to the palindrome example above.

The way we'll perform this proof is by contradiction. We'll assume that the palindrome language is regular, then follow step-by-step until we reach a contradiction in the pumping lemma. Then we'll know for sure that palindromes are not a regular language.

### the proof

Suppose the palindrome language is regular. Let's start drawing out some of the conclusions from this assumption using the pumping lemma. First and foremost, being a regular language guarantees this language a pumping length $P$, and that a certain property holds for *every* string above this pumping length. If our goal is to find a contradiction, then finding *any* string for which this property doesn't hold will be enough. Remember, $|xy|$ must be less than or equal to $P$ in order for the pumping to work. So let's pick that one string and define it in terms of $P$, so we will be able to pick out $x$, $y$, and $z$ easier later. The string we'll go with is $s = 0^P1^{2P}0^P$.

It's easy to look at this string and verify that it belongs to the palindrome language. It consists of two strings, each of length $2P$ which are mirrors of each other. Because $|xy|$ must add up to be less than $P$, $x$ and $y$ must both be strings consisting only of $0$s. It's a good time to note that the pumping lemma doesn't guarantee that *every* combination of $x$ and $y$ can be pumped, only that for every string $s$, there's a *specific* $x$, $y$, and $z$ such that $y$ can be pumped. Consequently, we have to stick with a generic definition of $y$ and show that it will *never* be able to be pumped.

We're ready to start pumping. Pumping $y$ simply means turning the string $xyz$ into $xyyz$. Ok let's go over that in some more detail. We know that $xyz$ has to take the form $0^P1^{2P}0^P$, with $x$ and $y$ making up some if not all of the first $P$ zeros. We know that the length of $y$ must be greater than zero, since that's one of the premises of the substrings $x$, $y$, and $z$. So $xyyz$ must be $0^{P+|y|}1^{2P}0^P$, where $|y| > 0$. This clearly *isn't* in the palindromes language, since the number of 0s on the left side clearly isn't the same as the number of $0$s on the right side. We've just pumped a string out of its own language, even while following the rules of the pumping lemma. Since we encountered a contradiction, our proof is complete.

Thanks for reading! I'll try to share some more interesting things I find here.