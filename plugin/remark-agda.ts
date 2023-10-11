import type { RemarkPlugin } from "@astrojs/markdown-remark";
import { fromMarkdown } from "mdast-util-from-markdown";

import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, parse } from "node:path";

const remarkAgda: RemarkPlugin = () => {
  return function (tree, { data }) {
    const path: string = data.astro.fileURL.pathname;
    if (!(path.endsWith(".lagda.md") || path.endsWith(".agda"))) return;

    console.log("data", data);

    const tempDir = mkdtempSync(join(tmpdir(), "agdaRender."));
    const outDir = join(tempDir, "output");
    mkdirSync(outDir, { recursive: true });
    console.log("work dir", tempDir);

    const childOutput = spawnSync(
      "agda",
      [
        "--html",
        `--html-dir=${outDir}`,
        "--highlight-occurrences",
        "--html-highlight=code",
        data.astro.fileURL.pathname,
      ],
      {},
    );

    console.log("output", childOutput.output.toString());
    const filename = parse(path).base.replace(/\.lagda/, "");
    console.log();
    console.log("filename", filename);

    const fullOutputPath = join(outDir, filename);
    console.log("outDir", fullOutputPath);
    console.log();

    const doc = readFileSync(fullOutputPath);
    const tree2 = fromMarkdown(doc);
    console.log("tree", tree);

    tree.children = tree2.children;

    // visit(tree, "", (node) => {
    //   console.log("node", node);
    // });
  };
};

export default remarkAgda;
