import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { astroImageTools } from "astro-imagetools";

import remarkReadingTime from "./plugin/remark-reading-time";
import emoji from "remark-emoji";
import remarkMermaid from "astro-diagram/remark-mermaid";
import remarkDescription from "astro-remark-description";
import remarkAdmonitions from "./plugin/remark-admonitions";
import remarkMath from "remark-math";

import rehypeKatex from "rehype-katex";

// https://astro.build/config
export default defineConfig({
  site: "https://mzhang.io",
  integrations: [mdx(), sitemap(), astroImageTools],
  markdown: {
    syntaxHighlight: "shiki",
    shikiConfig: { theme: "css-variables" },
    remarkPlugins: [
      remarkAdmonitions,
      remarkReadingTime,
      remarkMath,
      remarkMermaid,
      emoji,
      [remarkDescription, { name: "excerpt" }],
    ],
    rehypePlugins: [rehypeKatex],
  },
});
