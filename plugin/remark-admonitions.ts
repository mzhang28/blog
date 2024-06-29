// https://github.com/myl7/remark-github-beta-blockquote-admonitions
// License: Apache-2.0

import { visit } from "unist-util-visit";
import type { Data } from "unist";
import type { BuildVisitor } from "unist-util-visit";
import type { Blockquote, Paragraph, Text } from "mdast";
import type { RemarkPlugin } from "@astrojs/markdown-remark";
import classNames from "classnames";

const remarkAdmonitions: RemarkPlugin =
  (providedConfig?: Partial<Config>) => (tree) => {
    visit(tree, handleNode({ ...defaultConfig, ...providedConfig }));
  };

export default remarkAdmonitions;

const handleNode =
  (config: Config): BuildVisitor =>
  (node) => {
    // Filter required elems
    if (node.type !== "blockquote") return;
    const blockquote = node as Blockquote;

    if (blockquote.children[0]?.type !== "paragraph") return;

    const paragraph = blockquote.children[0];
    if (paragraph.children[0]?.type !== "text") return;

    const text = paragraph.children[0];

    // A link break after the title is explicitly required by GitHub
    const titleEnd = text.value.indexOf("\n");
    if (titleEnd < 0) return;

    const textBody = text.value.substring(titleEnd + 1);
    let title = text.value.substring(0, titleEnd);
    // Handle whitespaces after the title.
    // Whitespace characters are defined by GFM
    const m = /[ \t\v\f\r]+$/.exec(title);
    if (m && !config.titleKeepTrailingWhitespaces) {
      title = title.substring(0, title.length - m[0].length);
    }
    if (!nameFilter(config.titleFilter)(title)) return;
    const { displayTitle, checkedTitle } = config.titleTextMap(title);

    // Update the text body
    text.value = textBody;

    // Insert the title element and add classes for the title
    const paragraphTitleText: Text = { type: "text", value: displayTitle };
    const paragraphTitle: Paragraph = {
      type: "paragraph",
      children: [paragraphTitleText],
      data: config.dataMaps.title({
        hProperties: {
          className: classNameMap(config.classNameMaps.title)(checkedTitle),
        },
      }),
    };
    blockquote.children.unshift(paragraphTitle);

    // Add classes for the block
    blockquote.data = config.dataMaps.block({
      ...blockquote.data,
      hProperties: {
        className: classNameMap(config.classNameMaps.block)(checkedTitle),
      },
      // The blockquote should be rendered as a div, which is explicitly required by GitHub
      hName: "div",
    });
  };

const TITLE_PATTERN =
  /\[\!admonition: (attention|caution|danger|error|hint|important|note|tip|warning)\]/i;

export const mkdocsConfig: Partial<Config> = {
  classNameMaps: {
    block: (title) => [
      "admonition",
      ...(title.startsWith("admonition: ")
        ? title.substring("admonition: ".length)
        : title
      ).split(" "),
    ],
    title: classNames("admonition-title"),
  },

  titleFilter: (title) => Boolean(title.match(TITLE_PATTERN)),

  titleTextMap: (title: string) => {
    console.log("title", title);
    const match = title.match(TITLE_PATTERN);
    console.log("matches", match);
    const displayTitle = match?.[1] ?? "";
    const checkedTitle = displayTitle;
    return { displayTitle, checkedTitle };
  },
};

export interface Config {
  classNameMaps: {
    block: ClassNameMap;
    title: ClassNameMap;
  };
  titleFilter: NameFilter;
  titleTextMap: (title: string) => {
    displayTitle: string;
    checkedTitle: string;
  };
  dataMaps: {
    block: (data: Data) => Data;
    title: (data: Data) => Data;
  };
  titleKeepTrailingWhitespaces: boolean;
  legacyTitle: boolean;
}

export const defaultConfig: Config = {
  classNameMaps: {
    block: "admonition",
    title: "admonition-title",
  },

  titleFilter: ["[!NOTE]", "[!IMPORTANT]", "[!WARNING]"],

  titleTextMap: (title) => ({
    displayTitle: title.substring(2, title.length - 1),
    checkedTitle: title.substring(2, title.length - 1),
  }),
  dataMaps: {
    block: (data) => data,
    title: (data) => data,
  },
  titleKeepTrailingWhitespaces: false,
  legacyTitle: false,
};

type ClassNames = string | string[];
type ClassNameMap = ClassNames | ((title: string) => ClassNames);

export function classNameMap(gen: ClassNameMap) {
  return (title: string) => {
    const classNames = typeof gen === "function" ? gen(title) : gen;
    return typeof classNames === "object" ? classNames.join(" ") : classNames;
  };
}

type NameFilter = ((title: string) => boolean) | string[];

export function nameFilter(filter: NameFilter) {
  return (title: string) => {
    return typeof filter === "function"
      ? filter(title)
      : filter.includes(title);
  };
}
