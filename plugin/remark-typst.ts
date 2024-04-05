import type { RemarkPlugin } from "@astrojs/markdown-remark";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { visit } from "unist-util-visit";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";

const remarkTypst: RemarkPlugin = () => {
  const tmp = mkdtempSync(join(tmpdir(), "typst"));
  let ctr = 0;

  return (tree) => {
    visit(
      tree,
      (node) => node.type === "code" && node.lang === "typst",
      (node, index, parent) => {
        const doc = join(tmp, `${ctr}.typ`);
        const docOut = join(tmp, `${ctr}.svg`);
        ctr += 1;

        writeFileSync(doc, node.value);
        const result = spawnSync(
          "typst",
          [
            "compile",
            "--format",
            "svg",
            doc,
          ],
          {},
        );
        console.log("OUTPUT", result.stderr.toString());

        const svgOut = readFileSync(docOut);
        node.type = "html";
        node.value = svgOut.toString();
      },
    );
  };
};

export default remarkTypst;
