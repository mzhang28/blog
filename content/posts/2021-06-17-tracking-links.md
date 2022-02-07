+++
title = "Tracking links in email"
date = 2021-06-17
tags = ["email", "computers", "things-that-are-bad", "privacy"]
+++

You probably get emails every day, and spend a lot of time reading them. And
whenever someone performs an action or does something in vast quantities, you
_bet_ the data giants have figured out a way to capitalize on it. For many
years consumer privacy has basically gone unnoticed, and invasive tracking has
grown [viral][1]. <!--more-->

Arguably, if you are someone who runs a business off of writing periodic
newsletters that are distributed via email, you might want some statistics on
how your newsletter is doing. Traditionally, this is achieved **actively**
through some kind of survey with some kind of incentive, like "tell us how
we're doing for a chance to win a water bottle".

Now emails are typically imbued with **passive** trackers either in the form of
[tracking pixels][3] (which informs the sender when the receipient opens the
email) and [tracking links][4] (which informs the sender when AND what links
receipients click). Tracking pixels are usually less relevant these days since
many web-based email clients will ask before loading images, and clients run by
mail servers with an enormous number of users like Gmail ([and soon iOS][5])
may proxy the pixels ahead of time so the senders only see the IPs and metadata
of the server.

Tracking links, on the other hand, have become much more invasive, to the point
where it's impossible to avoid being tracked. You see it all over the web:
whenever you open a link, there's almost always some kind of `?ref=xxxxx` code
stuck onto the end that identifies _your_ particular instance of it. This way,
if you share the link with a friend, they just used the same code, and your
connection to your friend is traced by the website owner.

> If this creeps you out, consider using a browser extension like
> [ClearURLs][6], which recognizes these URL parameters that do nothing but
> feed information to the website owners and removes it for you.

But email tracking links are even worse: they abuse redirects to obfuscate the
original URL entirely. For instance, you'd get links in your email that look
like:

```
https://some.mail.host/lWOrjb9FXYgMDS0DADOsxAZEFPB99gHzmRQTe6OHBws=
```

Where does it go? Wikipedia? Piratebay? There's only one way to find out: by
making a request to that server, giving up information about the time, place,
client, OS, and all sorts of other information that greedy data collection
companies are waiting to snatch up.

Of course, regular users notice nothing: these links are usually hidden behind
buttons, text, or even the original URL itself. Once they click it, the website
silently logs all the data it receives about the user, and then redirects the
user to the original destination.

The senders usually aren't at fault either. Sending email is tricky, with all
the infrastructure set up to block out spam, so the majority of people who send
bulk mail (newsletters, websites that need to confirm your email, etc.) all go
through companies that handle this for them. Of course, being the middlemen who
actually get the mail out the door, they're free to replace the links with
whatever they want, and many of these companies advertise it as a feature to
get more "insight" into how your emails are doing.

Even worse, the original senders aren't the only ones getting the info, either.
These middlemen could hold on to the data and there's no saying they can't use
it for other purposes or sell it.

Unfortunately, sending email isn't really going to get any easier, partly
because of the way email fundamentally works: without all of the security
infrastructure in place, running your own email server could easily lead to
abuse. Most people (justifiably) would not go through all that effort
themselves.

Another possible avenue of thinking is to do what large mail companies did to
oppose tracking pixels, where they would act as a mass-proxy for the links,
opening them when they receive it, and transparently replace the unfiltered
link back into the email so the user's device and location aren't revealed. But
this raises its own issues: for example, what if the act of opening the
original link performs some kind of action (e.g. click to subscribe, click to
register, etc.)? Also, this solution only works for email that is not
end-to-end encrypted. For end-to-end encrypted mail providers, there is no way
to do this.

The only real solution here is regulation via either advancement in
privacy-related open standards or legislature. It's clear that without any kind
of regulation, companies will continue to act in the interests of profit rather
than the protection of their customers.

> Devil's advocate afterthought: should this problem even be solved? Maybe
> there's a benefit to this whole tracking thing. My opinion on this is if you
> _really_ want to develop a community of readers, offer an easy way to give
> feedback (or even go back to the incentive surveys), and if people aren't
> giving feedback, then that itself is a reflection of the state of your
> readers.

[1]: https://www.wired.com/story/how-email-open-tracking-quietly-took-over-the-web/
[3]: https://en.wikipedia.org/wiki/Web_beacon
[4]: https://en.wikipedia.org/wiki/Click_tracking
[5]: https://www.apple.com/newsroom/2021/06/apple-advances-its-privacy-leadership-with-ios-15-ipados-15-macos-monterey-and-watchos-8
[6]: https://gitlab.com/KevinRoebert/ClearUrls
