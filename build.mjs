import * as esbuild from "esbuild";
import { readFileSync } from "node:fs";

const pkg = JSON.parse(readFileSync(new URL("./package.json", import.meta.url)));
const watch = process.argv.includes("--watch");

const options = {
  entryPoints: ["src/jtd-calendar-card.ts"],
  outfile: "dist/jtd-calendar-card.js",
  bundle: true,
  format: "esm",
  target: "es2022",
  minify: !watch,
  sourcemap: false,
  legalComments: "none",
  define: { __CARD_VERSION__: JSON.stringify(pkg.version) },
  logLevel: "info",
};

if (watch) {
  const ctx = await esbuild.context(options);
  await ctx.watch();
} else {
  await esbuild.build(options);
}
