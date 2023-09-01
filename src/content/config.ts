import { defineCollection, z } from "astro:content";

const posts = defineCollection({
  type: "content",

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

      tags: z.array(z.string()),
      draft: z.boolean().default(false),
      math: z.boolean().default(false),
      toc: z.boolean().default(false),
    }),
});

export const collections = { posts };
