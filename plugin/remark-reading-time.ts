import getReadingTime from "reading-time";
import { toString as mdastToString } from "mdast-util-to-string";
import type { RemarkPlugin } from "@astrojs/markdown-remark";

const remarkReadingTime: RemarkPlugin = () => {
  return (tree, { data }) => {
    const textOnPage = mdastToString(tree);
    const readingTime = getReadingTime(textOnPage);

    // readingTime.text will give us minutes read as a friendly string,
    // i.e. "3 min read"
    data.astro.frontmatter.minutesRead = readingTime.text;
  };
};

export default remarkReadingTime;
