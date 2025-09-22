import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { rehypeAccessibleEmojis } from "rehype-accessible-emojis";
import remarkReadingTime from "./plugin/remark-reading-time";
import remarkEmoji from "remark-emoji";
import remarkDescription from "astro-remark-description";
import remarkAdmonitions, { mkdocsConfig } from "./plugin/remark-admonitions";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkTypst from "./plugin/remark-typst";
import rehypeLinkHeadings from "@justfork/rehype-autolink-headings";
import rehypeSlug from "rehype-slug";

import markdoc from "@astrojs/markdoc";
import remarkAgda from "./plugin/remark-agda";

import tailwindcss from "@tailwindcss/vite";

const outDir = "dist";
const base = process.env.BASE ?? "/";
const publicDir = "public";

// https://astro.build/config
export default defineConfig({
  site: "https://mzhang.io",
  prefetch: true,
  integrations: [mdx(), sitemap(), markdoc()],

  outDir,
  base,
  trailingSlash: "always",
  publicDir,

  markdown: {
    syntaxHighlight: "shiki",
    shikiConfig: { theme: "css-variables" },
    remarkPlugins: [
      remarkTypst,
      () => remarkAgda({ outDir, base, publicDir }),
      [remarkMath, {}],
      [remarkAdmonitions, mkdocsConfig],
      remarkReadingTime,
      remarkEmoji,
      [
        remarkDescription,
        {
          name: "excerpt",
        },
      ],
    ],
    rehypePlugins: [
      [rehypeKatex, {}],
      rehypeAccessibleEmojis,
      rehypeSlug,
      [rehypeLinkHeadings, { behavior: "wrap" }],
    ],
  },

  vite: {
    build: {
      assetsInlineLimit: 0,
    },

    plugins: [tailwindcss()],
  },
});