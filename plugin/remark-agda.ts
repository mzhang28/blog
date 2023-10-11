import type { RemarkPlugin } from "@astrojs/markdown-remark";
import type { Node, Root, Parent, RootContent } from "hast";
import { fromMarkdown } from "mdast-util-from-markdown";
import { fromHtml } from "hast-util-from-html";
import { toHtml } from "hast-util-to-html";

import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, parse } from "node:path";
import { visit } from "unist-util-visit";

const remarkAgda: RemarkPlugin = () => {
  return function (tree, { data }) {
    const path: string = data.astro.fileURL.pathname;
    if (!(path.endsWith(".lagda.md") || path.endsWith(".agda"))) return;

    // console.log("data", data);

    const tempDir = mkdtempSync(join(tmpdir(), "agdaRender."));
    const outDir = join(tempDir, "output");
    mkdirSync(outDir, { recursive: true });
    console.log("work dir", tempDir);

    const childOutput = spawnSync(
      "agda",
      ["--html", `--html-dir=${outDir}`, "--highlight-occurrences", "--html-highlight=code", path],
      {},
    );

    console.log("output", childOutput.output.toString());
    const filename = parse(path).base.replace(/\.lagda.md/, ".md");
    const htmlname = parse(path).base.replace(/\.lagda.md/, ".html");
    console.log();
    console.log("filename", filename);

    const fullOutputPath = join(outDir, filename);
    console.log("outDir", fullOutputPath);
    console.log();

    const doc = readFileSync(fullOutputPath);
    const tree2 = fromMarkdown(doc);
    // console.log("tree", tree);

    const collectedCodeBlocks: RootContent[] = [];
    visit(tree2, "html", (node) => {
      //   console.log("node", node);
      //   collectedCodeBlocks.push
      const html = fromHtml(node.value, { fragment: true });

      const firstChild: RootContent = html.children[0]!;
      console.log("child", firstChild);

      visit(html, "element", (node) => {
        if (node.tagName !== "a") return;

        if (node.properties.href && node.properties.href.includes(htmlname)) {
          console.log("a", node.properties);
          node.properties.href = node.properties.href.replace(htmlname, "");
        }
      });

      if (!firstChild?.properties?.className?.includes("Agda")) return;

      const stringContents = toHtml(firstChild);
      //   console.log("result", stringContents);
      collectedCodeBlocks.push({
        contents: stringContents,
      });
    });

    console.log("collected len", collectedCodeBlocks.length);

    let idx = 0;
    visit(tree, "code", (node) => {
      if (node.lang !== "agda") return;

      //   console.log("node", node);
      node.type = "html";
      node.value = collectedCodeBlocks[idx].contents;
      idx += 1;
    });
    console.log("len", idx);
  };
};

export default remarkAgda;
