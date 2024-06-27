import type { RemarkPlugin } from "@astrojs/markdown-remark";
import type { RootContent } from "hast";
import { fromMarkdown } from "mdast-util-from-markdown";
import { fromHtml } from "hast-util-from-html";
import { toHtml } from "hast-util-to-html";

import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, parse } from "node:path";
import { visit } from "unist-util-visit";

const remarkAgda: RemarkPlugin = () => {
  return (tree, { history }) => {
    const path: string = history[history.length - 1]!;
    if (!(path.endsWith(".lagda.md") || path.endsWith(".agda"))) return;

    console.log("AGDA:processing path", path);

    const tempDir = mkdtempSync(join(tmpdir(), "agdaRender."));
    const outDir = join(tempDir, "output");
    mkdirSync(outDir, { recursive: true });

    const childOutput = spawnSync(
      "agda",
      [
        "--html",
        `--html-dir=${outDir}`,
        "--highlight-occurrences",
        "--html-highlight=code",
        path,
      ],
      {},
    );

    // TODO: Handle child output
    console.error("--AGDA OUTPUT--")
    console.error(childOutput);
    console.error(childOutput.stdout?.toString());
    console.error(childOutput.stderr?.toString());
    console.error("--AGDA OUTPUT--")
    // if (childOutput.status !== 0)
    //     throw new Error("Agda failed", childOutput.stderr)

    const filename = parse(path).base.replace(/\.lagda.md/, ".md");
    const htmlname = parse(path).base.replace(/\.lagda.md/, ".html");
    const fullOutputPath = join(outDir, filename);

    const doc = readFileSync(fullOutputPath);

    // This is the post-processed markdown with HTML code blocks replacing the Agda code blocks
    const tree2 = fromMarkdown(doc);

    const collectedCodeBlocks: RootContent[] = [];
    visit(tree2, "html", (node) => {
      const html = fromHtml(node.value, { fragment: true });

      const firstChild: RootContent = html.children[0]!;

      visit(html, "element", (node) => {
        if (node.tagName !== "a") return;

        if (node.properties.href && node.properties.href.includes(htmlname)) {
          node.properties.href = node.properties.href.replace(htmlname, "");
        }
      });

      if (!firstChild?.properties?.className?.includes("Agda")) return;

      const stringContents = toHtml(firstChild);
      collectedCodeBlocks.push({
        contents: stringContents,
      });
    });

    let idx = 0;
    visit(tree, "code", (node) => {
      if (!(node.lang === null || node.lang === "agda")) return;

      node.type = "html";
      node.value = collectedCodeBlocks[idx].contents;
      idx += 1;
    });
  };
};

export default remarkAgda;
