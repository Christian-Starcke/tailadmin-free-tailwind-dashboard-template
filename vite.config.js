import { defineConfig } from "vite";
import fs from "fs";
import path from "path";

const INCLUDE_PATTERN =
  /<include\s+src=["'](.+?)["']\s*\/?>\s*(?:<\/include>)?/gis;

function processNestedHtml(content, baseDir) {
  if (!INCLUDE_PATTERN.test(content)) return content;

  return content.replace(INCLUDE_PATTERN, (match, src) => {
    const filePath = path.resolve(baseDir, src);
    const fileContent = fs.readFileSync(filePath, "utf8");
    return processNestedHtml(fileContent, path.dirname(filePath));
  });
}

export default defineConfig({
  root: "src",
  build: {
    outDir: "../dist",
  },
  plugins: [
    {
      name: "html-include",
      transformIndexHtml(html, ctx) {
        const baseDir = path.dirname(ctx.filename);
        return processNestedHtml(html, baseDir);
      },
    },
  ],
});


