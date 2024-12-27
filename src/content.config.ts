import { defineCollection, z } from "astro:content";
import { glob, file } from "astro/loaders";

const posts = defineCollection({
  loader: glob({ pattern: ["**/*.md", "**/*.mdx"], base: "./src/posts" }),

  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.date(),

      // Transform string to Date object
      pubDate: z
        .string()
        .or(z.date())
        .transform((val) => new Date(val))
        .optional(),
      updatedDate: z
        .string()
        .optional()
        .transform((str) => (str ? new Date(str) : undefined))
        .optional(),

      heroImage: image().optional(),
      heroAlt: z.string().optional(),

      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
      math: z.boolean().default(false),
      toc: z.boolean().default(false),
    }),
});

export const collections = { posts };
