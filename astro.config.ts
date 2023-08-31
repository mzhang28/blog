import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

import sitemap from "@astrojs/sitemap";
import { remarkReadingTime } from "./plugin/remark-reading-time";

// https://astro.build/config
export default defineConfig({
  site: "https://mzhang.io",
  integrations: [mdx(), sitemap()],
  markdown: {
    syntaxHighlight: false,
    remarkPlugins: [remarkReadingTime],
  },
});
