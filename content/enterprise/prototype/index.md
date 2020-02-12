+++
title = "enterprise: a new ui framework"
date = 2020-02-11
draft = true
template = "post.html"

[taxonomies]
tags = []
+++

This past weekend, while on my trip to Minneapolis, I completed a very early prototype of "enterprise", a new UI framework I've been kind of envisioning over the past couple of weeks. While the UI framework is mainly targeted at web apps, the hope is that with a bit more effort, native UIs can be produced with almost no changes to existing applications. Before I begin to describe how it works, I'd like to acknowledge [Nathan Ringo][1] for his massively helpful feedback in both the ideation and the implementation process.

## Goals of the project

* **Complete separation of business logic from UI.** Theoretically, one could completely retarget the application to a completely different platform (mobile, web, native, something new that will pop up in 5 years), without changing any of the core logic. It does this by introducing [DSL][2]s that are completely architecture-independent.
* **Maximally static component relationships.** Like [Svelte][3], I'm aiming to resolve as many relationships between elements as possible during compile-time, to avoid having to maintain a full virtual DOM at runtime.
*

## Prototype

The prototype for experimenting is a simple "Hello, world" application. If you've looked at any web framework before, this is probably one of the simplest examples of bindings: type something into a box and watch as the text magically populates with whatever you wrote in the box. If you're using a WASM-compatible browser with JavaScript enabled, you should be able to try out the demo in real-time:

<div id="app"></div>
<script type="text/javascript" src="helloworld.js"></script>

OK, you say, but I could implement this in 3 lines of JavaScript.

```js
inputEl.addEventListener("change", () => {
    spanEl.innerText = inputEl.value;
});
```

Surely, this works, but it doesn't scale. If you try to write a page full of these kind of bindings directly using JavaScript, you're either going to start running into bugs or building up a pile of unmaintainable spaghetti code. How does enterprise represent this? Well, the enterprise DSL has no concrete syntax yet, but if it did, it would look something like this:

```
model {
    name: String,
}

view {
    <TextBox bind:value="name" />
    Hello, {name}!
}
```



[1]: https://remexre.xyz
[2]: https://en.wikipedia.org/wiki/Domain-specific_language
[3]: https://svelte.dev
