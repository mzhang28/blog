+++
title = "enterprise: a new ui framework"
date = 2020-02-11
draft = true
template = "post.html"

[taxonomies]
tags = []
+++

NB: It's been a while since I wrote a post here. Since I began working at Epic, I've found it hard to motivate myself to even work on projects, let alone writing, after work hours. Hopefully I can pick it back up.

This past weekend, while on my trip to Minneapolis, I completed a very early prototype of "enterprise", a new UI framework I've been kind of envisioning over the past couple of weeks. While the UI framework is mainly targeted at web apps, the hope is that with a bit more effort, native UIs can be produced with almost no changes to existing applications. Before I begin to describe how it works, I'd like to acknowledge [Nathan Ringo][1] for his massively helpful feedback in both the ideation and the implementation process.

## Goals of the project

* **Complete separation of business logic from UI.** Theoretically, one could completely retarget the application to a completely different platform (mobile, web, native, something new that will pop up in 5 years), without changing any of the core logic. It does this by introducing [declarative][4]-style [DSL][2]s that are completely architecture-independent.
* **Maximally static component relationships.** Like [Svelte][3], I'm aiming to resolve as many relationships between elements as possible during compile-time, to avoid having to maintain a full virtual DOM at runtime.

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

This looks a lot closer to {React, Vue, Svelte, component structure}-ish code. The idea now is that the "compiler", as I've come to call it, reads the entire specification of the code and creates a sort of dependency graph of actions. For clarity, let's assign some IDs first:

* Let the `TextBox`'s value attribute be `view_value`.
* Let the `{name}` code segment in "Hello, name" be `view_name`.
* Let the model's name field be `model_name`.

Now we can model this as:

```dot
digraph "dependency graph" {
    graph[bgcolor="transparent", class="default-coloring"];
    rankdir="LR";

    "view_value" -> "model_name"
    "model_name" -> "view_name"
}
```

The arrows in this graph indicate a dependency where changes to `view_value` propagates down the graph until everything else is changed. For the initial prototype, the data structure passed through this graph is simply a string, but with encoding magic and additional specifications, we can add rich text later. What this means the compiler then generates code that looks something like (but not exactly):

```rs
fn create_view_value(model: &mut Model) -> INode {
    let el = (...);
    el.add_event_listener(|evt: InputListener| {
        let new_value = el.get_attribute("value");
        model.name = new_value;
        view_name.set_text(new_value);
    });
    el
}
```

There's some complications involving the exact model representation in memory as well as how web attributes are accessed that makes the real code a bit different, but from this example you should be able to see that our "compiler" generated real code that matches our specification above.

The full code for this can be found [here][5].

## Future

Obviously not everyone's application is as simple as a linear dependency graph of simple string values. In fact, I even cheated a bit to get this prototype to function; here's some of the shortcuts I took:

* I mostly hardcoded web elements in instead of making platform-independent abstractions.
* I hardcoded the actual specification for the app myself since the DSL doesn't have a real syntax yet.
* All data are string types.

I'll be working on this some more in the coming weeks, so I'll try to keep updates posted here a bit more frequently. Until then, thanks for reading!

[1]: https://remexre.xyz
[2]: https://en.wikipedia.org/wiki/Domain-specific_language
[3]: https://svelte.dev
[4]: https://en.wikipedia.org/wiki/Declarative_programming
[5]: https://git.iptq.io/michael/enterprise
