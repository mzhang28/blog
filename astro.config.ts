import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { rehypeAccessibleEmojis } from "rehype-accessible-emojis";

import remarkReadingTime from "./plugin/remark-reading-time";
import emoji from "remark-emoji";
import remarkMermaid from "astro-diagram/remark-mermaid";
import remarkDescription from "astro-remark-description";
import remarkAdmonitions from "./plugin/remark-admonitions";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

// import addProofMacros from "./utils/mzproofs";
import remarkAgda from "./plugin/remark-agda";

// https://astro.build/config
export default defineConfig({
  site: "https://mzhang.io",
  integrations: [
    mdx(),
    sitemap(),
    //astroImageTools
  ],
  markdown: {
    syntaxHighlight: "shiki",
    shikiConfig: { theme: "css-variables" },
    remarkPlugins: [
      remarkAdmonitions,
      remarkReadingTime,
      remarkAgda,
      [remarkMath, {}],
      remarkMermaid,
      emoji,
      [remarkDescription, { name: "excerpt" }],
    ],
    rehypePlugins: [
      [
        rehypeKatex,
        {
          // macros: addProofMacros({})
        },
      ],
      rehypeAccessibleEmojis,
    ],
  },
});
