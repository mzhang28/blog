---
title: Agda syntax highlighting in my blog!
id: 2024-06-26-agda-rendering
date: 2024-06-27T04:25:15.332Z
tags:
  - agda
  - blog-meta
---

I finally spent some time today getting full Agda syntax highlighting working on my blog.
This took me around 3-4 hours of debugging but I'm very happy with how it turned out.

First off, a demonstration. Here's the code for function application over a path:

```
open import Agda.Primitive
open import Prelude hiding (ap)

ap : {l1 l2 : Level} {A : Set l1} {B : Set l2} {x y : A}
  → (f : A → B)
  → (p : x ≡ y)
  → f x ≡ f y
ap {l1} {l2} {A} {B} {x} {y} f refl = refl
```

While editing this in my editor, I can issue the "Agda: Load" command to have Agda type-check it.
I can also work with typed holes interactively.

The crux of the effort boiled down to two things:

1. Writing the markdown processor
2. Building the Docker image

## Markdown processor

The markdown processor is a [single file of JavaScript][plugin] that runs during my builds.
It's a [remark] plugin, so you can plug it wherever else you want, as long as it uses remark.

[plugin]: https://git.mzhang.io/michael/blog/src/commit/2b4ca03563286d21d0ba4004ac36e2e2e7a259ed/plugin/remark-agda.ts
[remark]: https://github.com/remarkjs/remark

I basically just run `agda` using the HTML backend options according to [the documentation here][1].
Using the code method, I can have it leave the rest of the markdown file intact and only replace the agda code blocks with HTML.
It'll also spit out a CSS file used to highlight.

[1]: https://agda.readthedocs.io/en/v2.6.4.3-r1/tools/generating-html.html

One bit of complication here is that the generated file stripped off the front matter I needed to continue rendering this page with Astro.
There's a bit of code in that plugin file where I just order all of the agda blocks from the generated file and paste them back into the original.
Probably not the best way but it works.

The other bit of complication here is that the generated files need to go back into the public directory of my static site generator.
In Agda, applying `--html-highlight=code` applies this to _all_ files, including the dependency files (such as `Agda.Primitive.html`).
So I wrote a bit of glue code to have it also include the CSS file again.

Overall, not too complicated.

## Docker image

Okay, while writing this article I found [sourcedennis/agda-mini][2], but when I first started, I was having trouble finding a slim Agda distribution that was well maintained.
I looked into writing an Agda Dockerfile, but I also didn't want to maintain that either.

[2]: https://github.com/sourcedennis/docker-agda-mini

My approach was to use Nix to build the layered Docker image.
My derivation file lives [here][3].
Originally, I was considering using the version of Agda packaged in Nixpkgs.
Unfortunately, because of the GHC backend that Agda has, the Nixpkgs closure for Agda is approximately 3GB.
I didn't want a huge container image for my blog builder.

[3]: https://git.mzhang.io/michael/blog/src/commit/2b4ca03563286d21d0ba4004ac36e2e2e7a259ed/nix/docker-builder.nix

Instead, I use the Agda source directly, which is also packaged as a Nix package.
After this it's just the matter of including the rest of the party, which [pkgs.dockerTools][4] helped a lot with.

[4]: https://ryantm.github.io/nixpkgs/builders/images/dockertools/

---

That's it! Now my blog builds fully automatically in CI, with Agda syntax highlighting.
If you want to go back up to the top, click `ap` below :\)

```
_ : (n : ℕ) → suc n ≡ suc n
_ = λ _ → ap suc refl
```
