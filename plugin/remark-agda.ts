import type { RootContent } from "hast";
import { fromMarkdown } from "mdast-util-from-markdown";
import { fromHtml } from "hast-util-from-html";
import { toHtml } from "hast-util-to-html";

import { spawnSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  existsSync,
  readdirSync,
  copyFileSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, parse } from "node:path";
import { visit } from "unist-util-visit";
import type { RemarkPlugin } from "@astrojs/markdown-remark";

interface Options {
  base: string;
  outDir: string;
  publicDir: string;
}

const remarkAgda: RemarkPlugin = ({ base, publicDir }: Options) => {
  const destDir = join(publicDir, "generated", "agda");
  mkdirSync(destDir, { recursive: true });

  return (tree, { history }) => {
    const path: string = history[history.length - 1]!;
    if (!(path.endsWith(".lagda.md") || path.endsWith(".agda"))) return;

    console.log("AGDA:processing path", path);

    const tempDir = mkdtempSync(join(tmpdir(), "agdaRender."));
    const agdaOutDir = join(tempDir, "output");
    const agdaOutFilename = parse(path).base.replace(/\.lagda.md/, ".md");
    const agdaOutFile = join(agdaOutDir, agdaOutFilename);
    mkdirSync(agdaOutDir, { recursive: true });

    const childOutput = spawnSync(
      "agda",
      [
        "--html",
        `--html-dir=${agdaOutDir}`,
        "--highlight-occurrences",
        "--html-highlight=code",
        path,
      ],
      {},
    );

    if (childOutput.error || !existsSync(agdaOutFile)) {
      throw new Error(
        `Agda error:

        Stdout:
        ${childOutput.stdout}

        Stderr:
        ${childOutput.stderr}`,
        {
          cause: childOutput.error,
        },
      );
    }

    // // TODO: Handle child output
    // console.error("--AGDA OUTPUT--");
    // console.error(childOutput);
    // console.error(childOutput.stdout?.toString());
    // console.error(childOutput.stderr?.toString());
    // console.error("--AGDA OUTPUT--");

    const referencedFiles = new Set();
    for (const file of readdirSync(agdaOutDir)) {
      referencedFiles.add(file);

      const fullPath = join(agdaOutDir, file);
      const fullDestPath = join(destDir, file);

      if (file.endsWith(".html")) {
        const src = readFileSync(fullPath);
        writeFileSync(
          fullDestPath,
          `
          <!DOCTYPE html>
          <html>
          <head>
          <link rel="stylesheet" href="${base}generated/agda/Agda.css" />
          </head>
          <body>
          <pre class="Agda">
          ${src}
          </pre>
          </body>
          </html>
        `,
        );
      } else {
        copyFileSync(fullPath, fullDestPath);
      }
    }

    const htmlname = parse(path).base.replace(/\.lagda.md/, ".html");

    const doc = readFileSync(agdaOutFile);

    // This is the post-processed markdown with HTML code blocks replacing the Agda code blocks
    const tree2 = fromMarkdown(doc);

    const collectedCodeBlocks: RootContent[] = [];
    visit(tree2, "html", (node) => {
      const html = fromHtml(node.value, { fragment: true });

      const firstChild: RootContent = html.children[0]!;

      visit(html, "element", (node) => {
        if (node.tagName !== "a") return;

        if (node.properties.href) {
          // Trim off end
          const [href, hash, ...rest] = node.properties.href.split("#");
          if (rest.length > 0) throw new Error("come look at this");

          if (href === htmlname) node.properties.href = `#${hash}`;

          if (referencedFiles.has(href)) {
            node.properties.href = `${base}generated/agda/${href}${hash ? `#${hash}` : ""}`;
            node.properties.target = "_blank";
          }
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
