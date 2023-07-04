+++
title = "Learn by implementing Nginx's reverse proxy"
date = 2023-07-04
tags = ["web", "learn-by-implementing"]
draft = true
+++

Nginx is a powerful tool but also comes with many knobs, which may make it
intimidating for lots of newcomers. In this post, let's rewrite its core
functionality using a few lines of code to understand what it's doing.

<!--more-->

To begin, what's a reverse proxy?

- A proxy usually lets you access a site through some gateway when reaching that
    site when your client is sitting behind some intercepting firewall
- A _reverse_ proxy lets others access a site through some gateway when reaching
    a server that's serving a site from behind a firewall

As a middleman, it gets all requests and can introspect on the header and body
details. Which means it can:

- Serve multiple domains on the same server / port
- Wrap unencrypted services using HTTPS
- Perform load balancing
- Perform some basic routing
- Apply authentication
- Serve raw files without a server program

I'm going to implement this using Deno.

<details>
  <summary>Imports</summary>

  ```ts
  import { serve } from "https://deno.land/std@0.192.0/http/mod.ts";
  const PORT = parseInt(Deno.env.get("PORT") || "8314");
  ```
</details>

Deno implements an HTTP server for us. On a really high level, what this means
is it starts listening for TCP connections, and once it receives one, listens
for request headers and parses it. It then exposes methods for us to read the
headers and decide how to further receive the body. All we need to do is provide
it an async function to handle the request, and return a response. Something
like this:

```ts
// @ts-ignore
async function handlerImpl1(request: Request): Promise<Response> {
  // code goes here...
}

// Later,
// serve(handlerImpl1, { port: PORT });
```

Now one of the primarily utilties of something like Nginx is something called
**virtual hosts**. In networking, you would call a host the machine that runs
the server program. However, virtual hosts means the same machine can run
multiple server programs. This is possible because in the HTTP header
information, the client sends the domain it's trying to access.

```
Host: example.com
```

Using this info, the server can decide to route the request differently on a
per-domain basis. Something like SSH is not able to do this because nowhere
during the handshake process does the client ever request a particular domain.
You would have to wrap SSH with something else that's knowledgeable about that.

In our reverse-proxy example, we would want to redirect the request internally
to some different server, and then serve the response back to the client
transparently so it never realizes it went through a middleman!

So let's say we get some kind of config from the server admin, saying where to
send each request. It looks like this:

```ts
interface Config1 {
  /** An object mapping a particular domain to a destination URL */
  [domain: string]: string;
}
```

Let's wrap our function with another function, where we can take in the config
and make it accessible to the handler.

<details>
  <summary>Why?</summary>

  The `serve` here is what's called a **higher-order function**. This means that
  rather than passing just data to it, we're passing it a function as a
  _variable_ to store and call of its own volition. A common example of
  a higher-order function is `Array.map`, where you take a function and apply it
  to all elements within the array.

  So since `serve` is calling our handler, we cannot change its signature.
  That's because in order to change its signature, we have to change where it's
  called, which is inside the Deno standard library.

  Fortunately, functions capture variables (like `config`) from outside of their
  scope, and when we pass it to `serve`, it retains those captured variables.

  For an implementation like this, you don't actually need to wrap it in another
  function like `mkHandler2`, but I'm doing it here to make it easier to
  separate out the code into pieces that fit the prose of the blog post. You
  could just as well just define it like this:

  ```
  const config = { ... };
  const handler = async function(request: Request): Promise<Response> {
    // code goes here...
  };
  serve(handler, { port: PORT });
  ```
</details>

```ts
function mkHandler2(config: Config1) {
  // @ts-ignore
  return async function(request: Request): Promise<Response> {
    // code goes here...
  }
}
```

I'm going to write this in the most straightforward way possible, ignoring
`null` cases. Obviously in a real implementation, you would want to do error
checking and recovery (since the reverse proxy server must never crash, right?)

```ts
function mkHandler3(config: Config1) {
  return async function(request: Request): Promise<Response> {
    // Look for the host header
    const hostHeader = request.headers.get("Host") as string;

    // Look it up in our config
    const proxyDestinationPrefix = config[hostHeader] as string;

    // Let's fetch the destination and return it!
    const requestUrl = new URL(request.url);
    const fullUrl = proxyDestinationPrefix + requestUrl.pathname;
    return await fetch(fullUrl);
  }
}
```

Time to run it!

```ts
const config = {
  "localhost:8314": "https://example.com",
  "not-example.com": "https://text.npr.org",
};
const handler = mkHandler3(config);
serve(handler, { port: PORT });
```

First, try just making a request to `localhost:8314`. This is as easy as:

```bash
curl http://localhost:8314
```

This should load example.com, like we defined in our config. We did a simple
proxy, fetched the resource, and sent it back to the user. If there was a
resource that was not previously available to the public, but the reverse-proxy
could reach it, the public can now access it. Our reverse proxy feature is done.

Next, try making a request to not-example.com. However, we're going to use a
trick in curl to make it not resolve the address on its own, but force it to use
our domain. This trick is just for demonstration purposes, but it emulates a
real-world need to have multiple domains pointed to the same IP (for example,
for serving the redirect from company.com to www.company.com on the same server)

```bash
curl --connect-to not-example.com:80:localhost:8314 http://not-example.com
```

This should produce the HTML for NPR's text-only page. This demonstrates that we
can serve different content depending on the site that's requested.

## Conclusion

This is a very bare-bones implementation, and lacks lots of detail. To begin
with, none of the errors are handled, so if a rogue request comes in it could
take down the server.

Those improvements would be necessary for a production-ready implementation, but
not interesting for a blog post. For a non-exhaustive list of bigger
improvements, consider:

- Can we have the web server remove a prefix from the requested url's path name
    if we want to serve a website from a non-root path?
- Can we allow the reverse-proxy to reject requests directly by IP?
- Can we wrap non-HTTP content?
- What are some performance improvements we could make?

In a potential future blog post, I'll explore some of these topics.
