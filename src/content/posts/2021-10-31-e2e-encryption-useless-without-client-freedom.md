---
title: "End-to-end encryption is useless without client freedom"
date: 2021-10-31
tags: ["computers", "privacy"]
---

Today, many companies claim to provide "end-to-end encryption" of user data,
whether it be text messages, saved pictures, or important documents. But what
does this actually mean for your data? I'll explain what "non-end-to-end"
encryption is, why end-to-end encryption is important, and also when it might
be absolutely meaningless.<!--more-->

> If you just want to read about end-to-end encryption, click [here][1].
> Otherwise, I'll start the story all the way back to how computers talk to
> each other.

## A game of telephone in a noisy room

Computer networks essentially operate like a bunch of people yelling at each
other at a public gathering, where everyone is kind of hearing everyone else's
messages, but only really paying attention to ones addressed to them. Let's say
I wanted to grab some Chipotle with my roommate. I'd yell "HEY NATHAN, WANNA GET
CHIPOTLE?" over this public network, where Nathan would see his name, identify
it as a message that is intended for him, and then reply accordingly. Notably,
everyone _else_ listening to the network also hears this, and knows that I'm
itching to get some Mexican food.

That's not even the worst part, because well... how does your computer connect
to the internet? Your router hears your computer's message, and passes it
through a series of middlemen, who all perform this broadcasting ritual through
some local network, until it gets to wherever your computer wanted to talk to in
the first place. But in order for the middlemen to pass on the message, they'd
have to hear the message, so now my lunch has become a public gathering known to
everyone who's heard or passed on the message.

## Encryption saves the day

That's where **encryption** comes in. Encryption lets me change the message to
something that the middlemen and everyone else listening on the network can't
understand, but the person that I actually wanted to send the message can turn
it back into the original. This way, I can be sure no one except Nathan got the
memo of where we were grabbing lunch.[^3]

So the way encryption's being used here is known as _transport_ encryption,
since I'm _sending_ a message somewhere. Transport encryption is standard
practice now through a technology called **transport-layer security**, or TLS,
which is used by almost everything that talks to the internet, your browser,
your email client, your phone. If it's not using TLS, it should be considered
insecure.

If you're thinking ahead, you might be thinking that the other place encryption
can be used is **encryption at rest**. This is for documents and pictures that
need to sit somewhere in storage for a while but shouldn't be visible to
everyone. Many businesses require that their employees' laptops use _full-disk_
encryption, so their data doesn't get compromised.

When you put these together, your data is actually pretty safe from prying
hands. If I put some tax documents on Google Drive, it'll use _transport_
encryption to make sure no one steals my identity while I'm sending it, and
encryption _at rest_ to make sure someone breaking into Google won't be able to
just pull the hard drive out and read the files off it.

## Two halves don't equal a whole

It turns out just putting together these two types of encryption isn't enough.
There's someone else we haven't protected ourselves against in this case, which
is the party responsible for decrypting the transported data and then
re-encrypting it at rest. Google can read all the documents I upload to Drive
after decrypting it from transit and before encrypting it to disk. Facebook can
read all the messages I send to my friends after decrypting it from transit and
before re-encrypting it to send to my friends.

And this is a lot smaller of a problem than it was before! Companies usually
have privacy policies to protect user data from being used against what they
expect, and many industries have laws like [HIPAA][hipaa] and [FERPA][ferpa] to
make sure the people handling your data don't leak it.

But we don't have to just _trust_ them on that, because we already _know_ how
to protect data from middlemen who are simply taking a message and sending it
somewhere else unchanged, like the ISPs from our networks. We just need _more_
encryption!

**End-to-end encryption** is just encrypting the data in a way that the only
parties allowed to read the data are the people it was intended for. Password
manager services like 1Password and Bitwarden use end-to-end encryption so that
they're not decrypting your passwords when you store them online, they're just
storing the encrypted data as-is, and then handing it back to your device which
then decrypts it offline. [Signal][signal] famously provides end-to-end
encrypted chat, so that no one, not even the government[^1], will be able to
read the messages you send if they're not the intended recipient.

## It's still not enough {#not-enough}

End-to-end encryption seems like it should be the end of the story, but if
there's one thing that can undermine the encryption, it's the program that's
actually performing the encryption. Cryptographic operations are usually handled
by clients, but unless you want to sit there adding points on an elliptic curve
in a finite field, that client is your device or your browser, not you.

The big problem here is how do you know your device is actually performing the
encryption? How do you know the apps on your phone are only sending the data it
needs to send, and not a lot more? Traditionally, independent researchers or
bounty hunters may reverse-engineer client software and discover that they
didn't quite operate as advertised, but we can't just rely solely on people
from reddit with too much time on their hands to uphold security.

Imagine if Google Drive was actually a physical vault service and the website
was just a person you would hand your valuables to to keep safe. They could say
"we're keeping this in military-grade security," but unless you watched what
they did, how do you know they didn't cheap out on you and just shove it under
the mattress where hackers breaking in could just steal everything?

Same applies to Apple's recent child protection system. Their [white
paper][csam] goes in painstakingly great detail about how photos are protected
by "multi-layer" encryption before it's able to be decrypted by Apple. But
typical users are not allowed to pick apart your iPhone to make sure it's
encrypting everything correctly, or that the perceptual hashing algorithm it
uses to filter pictures isn't just trivially flagging everything for manual
review.

WhatsApp data is stored unencrypted to the running application in order to
store a database of messages locally. Additionally, this database can be backed
up to iCloud, and according to [WhatsApp themselves][whatsapp], that data is
stored unencrypted, which means that it may benefit from _transport_ security
and _encryption at rest_ independently, but ultimately the people moving data
around are still able to read it.

I've also seen discussion of undermining end-to-end encryption in a [ghost
proposal][ghost], a method that abuses multi-party encryption to add in a
"ghost" listener, which can be the company or the government or anyone else
that the vendor chooses. In theory, this backdoor could be prevented by an
open-sourced client that properly checks each recipient to make sure it's the
expected person before encrypting the message and sending it.

Given that end-to-end encryption solely exists because trusting companies that
run services is insufficient, it's safe to say that trusting companies to make
client software that act in the interest of their users is just as useless as
trusting companies to make services that act in the interest of their users.

## What can i do?

Although inconvenient, trusting different vendors for different pieces of this
technological assembly line is the best way to prevent it from becoming abused.
Many software use **open protocols**, communication schemes that are agreed
upon and freely available to everyone[^2]. Then, independent parties develop
and maintain lots of different software that all speak the same protocol, so if
you don't trust a particular service to have an app that doesn't encrypt its
data properly, you can just choose to use a different one by someone who you
trust more.

**Email** is a famous case of this: if I sign up for an email account with
Outlook, I don't have to use a proprietary Outlook client. I _could_ if I
wanted, and I imagine that there may be some features that Microsoft has added
specifically to the Outlook website and apps, but since they claim to conform to
the _open_ email specifications, I can just choose to use a different one.

On top of that, email is _federated_, which means that if I didn't like
Outlook's services, I could switch to a different provider and _still_ be able
to chat with people on Outlook, unlike many of today's siloed services where I
can't just message people on Facebook if I only have an account on Twitter,
since they don't talk to each other using the same protocol.

[**Matrix**][matrix] is a new chat network that also follows in the same spirit
as email, but also has the benefits of multi-party encryption. There are
multiple apps and servers, and servers can federate with each other using an
open protocol. I would strongly recommend people who are interested in privacy
to consider it.

## Conclusion

Why care? This might just seem to be some superficial political concern by
privacy advocates who warn of dangerous edge cases that only matter to people
whose rights are being violated by some dystopian government. Well, to put it
bluntly, that dystopia is now, and it's not just the government we should be
afraid of, but tech megacorps who possibly have even more power.

We live in a digital world, so it's important to know how it works and who's in
control.

[^1]:
    Governments and other parties with enough computational resources may
    still be able to undermine specific levels of security, or just [threaten you
    personally][wrench] until they get what they want.

[^2]:
    Large corporations typically still have majority representation in the
    committees that decide on the most impactful specifications, but these are
    still made available to researchers who can analyze and critique it.

[^3]:
    Not exactly; encryption by default is not authenticated. That means while
    the data is protected in transit, there's no guarantee that the recipient is
    actually who they say they are. I know only the recipient received my message,
    but I don't know for sure the recipient is Nathan. In practice, browsers use
    [PKI][pki] infrastructure to solve this, which relies on a certificate chain
    that is distributed by browser or operating system vendors.

[1]: {{< ref "#not-enough" >}}

[csam]: https://www.apple.com/child-safety/pdf/CSAM_Detection_Technical_Summary.pdf
[ferpa]: https://en.wikipedia.org/wiki/Family_Educational_Rights_and_Privacy_Act
[ghost]: https://www.internetsociety.org/wp-content/uploads/2020/03/Ghost-Protocol-Fact-Sheet.pdf
[hipaa]: https://en.wikipedia.org/wiki/Health_Insurance_Portability_and_Accountability_Act
[signal]: https://signal.org/
[wrench]: https://xkcd.com/538/
[matrix]: https://matrix.org/
[whatsapp]: https://faq.whatsapp.com/iphone/chats/how-to-back-up-to-icloud
[scuttlebutt]: https://scuttlebutt.nz/
[pki]: https://en.wikipedia.org/wiki/Public_key_infrastructure
