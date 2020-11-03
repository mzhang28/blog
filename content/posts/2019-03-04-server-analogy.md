+++
title = "accept server analogy"
date = 2019-03-04

[taxonomies]
tags = ["computers"]
+++

This is just something stupid I thought of recently, but decided to write about it anyway.

If you think about it, a server waiting for clients is kind of like the host at the front of a restaurant leading guests to tables. They don't actually take orders or serve food, they just stand at the front and wait for new guests to arrive. Then there's another waiter that's specifically assigned to take that table's orders.

When a server binds to, for example, `localhost:3000`, what the server really gets is a file descriptor; this is what's meant by:

```c
int socket(int domain, int type, int protocol);
int bind(int socket, const struct sockaddr *address, socklen_t address_len);
```

The `listen` library call then marks this socket as one that's open for connections, similar to marking the restaurant staff as a host rather than a waiter.

According to the manpage for `accept`, when a connection-mode socket accepts a connection, it'll "extract the first connection on the queue of pending connections, create a new socket with the same socket type protocol and address family as the specified socket, and allocate a new file descriptor for that socket." This new socket would be the waiter who actually takes your orders.
