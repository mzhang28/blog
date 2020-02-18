+++
title = "enterprise: syntax update"
date = 2020-02-17
template = "post.html"

[taxonomies]
tags = ["enterprise", "web", "ui", "syntax"]
+++

[Enterprise][1]'s frontend DSL just got a syntax! Although the major functionality hasn't really changed, I threw out the ugly verbose AST-construction syntax for a hand-rolled recursive-descent-ish parser.

<!-- more -->

The rehashed "Hello, world" example looks a bit like this:

```
component HelloWorld {
    model {
        name: String = "hello",
    }

    view {
        <input bind:value="name" />
        "Hello, " {name} "!"
    }
}
```

This compiles using `cargo-web` into a working version of the last post's prototype. You'll notice that quoted literals are used to represent text rather than just typing it out directly like in XML. This is because I'm actually borrowing Rust syntax and parsing it a bit differently. If I had bare text, then everything you put would have to follow Rust's lexical rules; additionally, data about spacing would be a lot more complicated (and unstable!) to retrieve.

I could possibly have thrown the whole thing into a parser-generator, using Rust's `proc-macro::TokenTree` as tokens, but TokenTree actually gives you blocks (eg. `()` `{}` `[]`) for free, so I can parse expressions like `{name}` incredibly easily.

Syntax isn't the only thing that's changed since the last update: I've also revamped how builds work.

New Build Method
----------------

I'm switching to a build method that's rather unconventional. The original approach looked something like this.

```dot
digraph "dependency graph" {
    graph[bgcolor="transparent", class="default-coloring"];
    rankdir="LR";

    "Component DSL" -> "AST" [label = "Parsing"];
    "AST" -> "Dependency Graph" [label = "Graph traversal"];
}
```

Problem here is, when we want code to be modular, the graph traversal approach is going to need information about _all_ modules that are imported in order to
be able to produce a flat set of instructions in the final result. If I make a library for a component (say, `enterprise-router`), what should its crate's contents be?

> **Tangent**: Here's where I'm going to distract myself a little and put this into a more big-picture perspective. Ultimately, the ideal manifestation of an architecture/business-logic separation would be a DSL that completely hides all implementation of its internals.
>
> That's a pretty far-out goal, so I'm building enterprise incrementally. Sadly, large parts of the language will still rely on the language in which this framework is implemented, Rust. This means that the underlying implementation of features such as modules and async will be relying on the Rust language having these features. However, note that in the long term, a separate DSL for business logic will be planned.

So what's the solution here? Instead of visiting your component node by node when your component is defined, all the framework is going to do is parse your definition and store the AST of your component as-is. I chose here to serialize ASTs as JSON data and dump it into a static string that will be bundled into your crate.

Then, in your `build.rs` file, you'll call something like `enterprise_compiler::build(App)`, where `App` is the name of the static string containing the JSON data of the description of your app. This will actually perform the analysis process, calculating the graph of update dependencies, as well as generating the code that will go into a Rust module that you can include into your code.

Your `build.rs` file might look something like this:

```rs
#[macro_use]
extern crate enterprise_macros;

component! {
    component HelloWorld {
        model {
            name: String = "hello",
        }

        view {
            <input bind:value="name" />
            "Hello, " {name} "!"
        }
    }
}

fn main() {
    enterprise_compiler::process("helloworld", HelloWorld);
}
```

This will create a string called `HelloWorld` for the HelloWorld component, and then analyze and generate the final application code for it into a file called `helloworld.rs` that you can `mod` into your application. The advantage to this approach is that external modules can just rely on Rust's crate system, since we're just fetching strings out of other crates.

Source code: [here][3].

Next Steps
----------

As mentioned in my previous post, I'm still working on implementing [TodoMVC][2], a simple Todo application that should flesh out some more of the reactive functionalities of the framework. This should solidify some more of the questions regarding interactions between data model and DOM.

I'll also try to abstract more of the system away so it's less dependent on stdweb's implementation. This means adding a notion of "backend", where different backends may have different implementations of a particular component.



[1]: @/enterprise/2020-02-11-prototype/index.md
[2]: http://todomvc.com/
[3]: https://git.iptq.io/michael/enterprise/src/commit/1453885ed2c3a5159431bb41398b9b8bea4d49f5
