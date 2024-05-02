import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { rehypeAccessibleEmojis } from "rehype-accessible-emojis";
import remarkReadingTime from "./plugin/remark-reading-time";
import remarkEmoji from "remark-emoji";
import remarkMermaid from "astro-diagram/remark-mermaid";
import remarkDescription from "astro-remark-description";
import remarkAdmonitions from "./plugin/remark-admonitions";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkTypst from "./plugin/remark-typst";
import rehypeLinkHeadings from "@justfork/rehype-autolink-headings";
import rehypeSlug from "rehype-slug";

import markdoc from "@astrojs/markdoc";

// https://astro.build/config
export default defineConfig({
	site: "https://mzhang.io",
	integrations: [mdx(), sitemap(), markdoc()],
	markdown: {
		syntaxHighlight: "shiki",
		shikiConfig: {
			theme: "css-variables",
		},
		remarkPlugins: [
			remarkMath,
			remarkAdmonitions,
			remarkReadingTime,
			remarkTypst,
			remarkMermaid,
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
});
