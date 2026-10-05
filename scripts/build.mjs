// Builds every dashboard card in cards/ into dist/:
//   dist/<output>     one file per card (manual installs)
//   dist/jtdhass.js   all cards in one file (what HACS installs, see hacs.json)
//
// A card is any cards/<name>/ folder whose package.json has
//   "jtdhass": { "kind": "card", "entry": "src/…ts", "output": "…js" }
import * as esbuild from "esbuild";
import { existsSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const dist = join(root, "dist");
const watch = process.argv.includes("--watch");
export const BUNDLE = "jtdhass.js";

const cards = readdirSync(join(root, "cards"), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => join(root, "cards", entry.name))
  .filter((dir) => existsSync(join(dir, "package.json")))
  .map((dir) => ({ dir, pkg: JSON.parse(readFileSync(join(dir, "package.json"), "utf8")) }))
  .filter(({ pkg }) => pkg.jtdhass?.kind === "card")
  .map(({ dir, pkg }) => ({ name: pkg.name, entry: join(dir, pkg.jtdhass.entry), output: pkg.jtdhass.output }))
  .sort((a, b) => a.name.localeCompare(b.name));

if (!cards.length) {
  console.error("No cards found in cards/*/package.json");
  process.exit(1);
}
const outputs = new Set(cards.map((card) => card.output));
if (outputs.size !== cards.length || outputs.has(BUNDLE)) {
  console.error(`Card outputs must be unique and not ${BUNDLE}`);
  process.exit(1);
}

const shared = {
  bundle: true,
  format: "esm",
  target: "es2022",
  minify: !watch,
  legalComments: "none",
  logLevel: "info",
};

const builds = [
  ...cards.map((card) => ({
    ...shared,
    entryPoints: [card.entry],
    outfile: join(dist, card.output),
  })),
  {
    ...shared,
    stdin: {
      contents: cards
        .map((card) => `import "./${relative(root, card.entry).split("\\").join("/")}";`)
        .join("\n"),
      resolveDir: root,
      sourcefile: BUNDLE,
    },
    outfile: join(dist, BUNDLE),
  },
];

if (watch) {
  for (const options of builds) {
    const ctx = await esbuild.context(options);
    await ctx.watch();
  }
} else {
  // Start clean so removed or renamed cards don't leave stale files behind.
  rmSync(dist, { recursive: true, force: true });
  await Promise.all(builds.map((options) => esbuild.build(options)));
}
