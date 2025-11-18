---
title: "Decentralized Identity, a Middle Ground"
date: 2022-10-30T03:04:51-05:00
logseq: true
tags:
  - web
---

- With Twitter management changing, I'm starting to think about the small web again. The small web is a concept where you use the Internet to interact with people directly, rather than operating through the medium of megacorps. When we think about big monoliths like Twitter and Facebook, at the very heart of it is some kind of algorithm picking what it is we see. And with the power to control that gives us advertising and mass manipulation.
- For the rest of this blog post, I'll be talking about _microblogging_ specifically: short posts of several sentences, along with a few media attachments, of which Twitter is one of the largest monolithic implementations. But the things I talk about are also applicable to other applications, including long-form blogging (Medium), image sharing (Instagram, Snapchat), video sharing (YouTube), chat (Messenger)
- There's several projects out there that are already trying out other extremes. I'll cover two big types here:
  - **Federation.** This style of application development is inspired by email. The idea is that you develop a common _protocol_ for apps living on different servers to talk to each other, so you can have people choose their own servers rather than trusting everything to megacorps like Google or Facebook. One notable example of this in the microblogging realm is Mastodon / ActivityPub.
  - **Peer-to-peer.** This style of application development is rarer, but can be seen commonly in things like torrents. The idea is that _each_ client holds all application info, and interacts with everything else as if they were all clients. One notable example of this in the microblogging realm is Scuttlebutt.
- I'll go into more detail about these two styles later, but they both come with their advantages and drawbacks. However, I don't think any of the solutions that exist are sustainable for longer periods of time.
- ## Feature Evaluation
- One thing I've been doing recently when I think about software applications and system design is break things down into their **features**. This makes it a lot easier to compare applications or services to each other than a vague statement like "I've had a good/bad experience with this". So let's come up with some features of a good microblogging platform:
  - Application design
    - **Verifiability:** It should be easy to verify if I did indeed ever say something.
    - **Freedom:** Within reason, I should not be limited in what I say or do on the platform.
    - **Universality:** I should be able to communicate to anyone from anywhere (any device, any location).
  - System design
    - **Availability:** I want to be confident that the system will be around for many years.
    - **Connectability:** I should be able to connect with people I don't already know easily.
    - **Moderation:** I should be able to choose to not interact with a certain subset of users, and this process should not be painful.
  - Scaling
    - **User scaling:** Supporting more users should incur a relatively linear or sublinear cost, and should certainly not lead to resource consumption blowup.
    - **Temporal scaling:** The system should support being run for an arbitrarily long amount of time.
  - Development
    - **Malleability:** How easy is it to introduce / roll out new versions and features? This may be important for updating cryptographic algorithms.
    - **Version drift:** Is it possible to support users who are on different version of the service?
- Some features are certainly more important than others, and may have different importance to different people. But it gives me a base line to evaluate services, and lets me decide which features I consider to be critical.
- These are obviously not the only features, but I like to list them in this form because while some
  alternative apps may tout certain features, it's useless if it falls short on something more important.
- ### Evaluation
- Now that we know what we're looking for, let's evaluate some existing services.
- **Mastodon**
  - Satisfies:
    - **Connectability:** It's easy to find other users based on their user ID, which looks like an email so it's easy to share.
  - Doesn't satisfy:
    - **Freedom:** While certain instances may be specialized (i.e hobby-focused), it's certainly not great when you are locked out of communicating with someone on another instance because the admins of your respective instances have beef with each other.
    - **Availability:** For some reason or another, I've seen Mastodon admins give up on their instances. Running an instance is very costly in terms of money and time, so it's not surprising that if an instance owner decides it's simply no longer worth it, the users are simply hosed. While there are some options for migration like redirection, it's useless if the original server doesn't stay online.
- **Scuttlebutt**
  - Satisfies:
    - **Freedom:** This is the maximally free solution: your client is solely responsible for receiving and filtering all messages.
  - Doesn't satisfy:
    - **Connectability:** Connecting with someone must take place over an existing channel (i.e either meeting in meatspace or sharing a pub). If I don't have my Scuttlebutt client with me, then it's not possible to get updates.
    - **Universality:** Since user identity is heavily tied to a single client, having multiple clients for a single user is not a well-supported workflow.
- The Matrix people have also developed [Cerulean], a playground for testing the idea of _relative reputation_, where instead of doing moderation of all users you can assign a web-of-trust-style reputation to people you follow. However, this may lead to further filter-bubbling, the implications of which I'm honestly not sure how to tackle.

  [Cerulean]: https://matrix.org/blog/2020/12/18/introducing-cerulean#whats-with-the-decentralised-reputation-button

- ## Decentralized Identity
- My view for an ideal microblogging platform would be a federated server-client architecture, but where a user identity isn't tied to the server the same way a user is tied to their Mastodon instance. Essentially, you want your account to be promiscuous between several servers.
- This way, you gain all of the benefits of having a server-client architecture (easy to do multiple clients), while not relying on the server itself or its admins to stay around for a long time.
- The problem is, designing such a system securely is difficult. Ultimately, what I'm proposing is:
  - A user identity model based on an asymmetric-key model. Users generate their own key locally and provide it to instances.
  - Users should then have _client_ keys, which are independent of the user keys. These are signed by the user key to indicate that they belong to the same user.
  - When a user wants to switch servers, they can begin requesting a checkout of their data from the server. The data can be signed by the server as well to provide an indicator that the client isn't trying to forge old history.
    - One problem is if a server wants to deny a user from switching servers; they may try to keep the data hostage. One solution is just to scrape all publicly obtainable data, the other is to hope that this is socially discouraged by just having users avoid servers that engage in user-hostile actions.
  - Users may also opt to replicate their identity entirely between two servers. This just means that this synchronization process is just happening incrementally or periodically rather than just at switch-time.
- This still has a number of open problems:
  - **Key revocation.** Obviously, anything involving cryptographic keys requires a revocation protocol in the event that the keys are compromised. I'm not too sure of a good way of doing this that doesn't involve an infinitely growing append-only list of revocations on all of the people who have
- When I have some free time, I may take a crack at a proof-of-concept implementation of a system like this.
- ### Further applications
- Since this scheme only really targets the identity layer with (theoretically) asymptotically constant change required for other parts of the software, this should be able to be extended to things other than just microblogging. I'm not sure about the level of success this may have for things like sharing large data files such as video (maybe mix in something like IPFS?), but there is certainly room for exploration.
