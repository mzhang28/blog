import markdoc from "@astrojs/markdoc";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import rehypeLinkHeadings from "@justfork/rehype-autolink-headings";
import tailwindcss from "@tailwindcss/vite";
import remarkDescription from "astro-remark-description";
import { defineConfig } from "astro/config";
import { rehypeAccessibleEmojis } from "rehype-accessible-emojis";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkEmoji from "remark-emoji";
import remarkMath from "remark-math";
import remarkAdmonitions, { mkdocsConfig } from "./plugin/remark-admonitions";
import remarkReadingTime from "./plugin/remark-reading-time";

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
