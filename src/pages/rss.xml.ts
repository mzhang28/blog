import rss from "@astrojs/rss";
import sanitizeHtml from "sanitize-html";
import { SITE_TITLE, SITE_DESCRIPTION } from "../consts";

const BLACKLIST = ["../content/posts/_index.md"];

export async function GET(context) {
  // const posts = Array.from(await getCollection("posts"));
  const posts = Object.entries(
    import.meta.glob("../content/posts/**/*.{md,mdx}", {
      eager: true,
    }),
  )
    .filter(
      ([file, post]) =>
        !BLACKLIST.includes(file) && post.frontmatter.draft !== true,
    )
    .toSorted(([fileA, a], [fileB, b]) => {
      return new Date(b.frontmatter.date) - new Date(a.frontmatter.date);
    })
    .slice(0, 30)
    .map(([file, post]) => {
      return {
        title: post.frontmatter.title ?? "",
        pubDate: new Date(post.frontmatter.date),
        link: "/",
        content: sanitizeHtml(post.compiledContent?.()),
        // link: `/posts/${post.slug}/`,
      };
    });

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: posts,
  });
}
