// Serves the repository root and opens headless Chromium, for card screenshot
// scripts. Needs Playwright: set PLAYWRIGHT_MODULE to its path if it is not
// installed in this project.
import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { extname, join, resolve } from "node:path";

export const repoRoot = resolve(import.meta.dirname, "../..");

const TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

export const withDemo = async (run) => {
  const server = createServer((req, res) => {
    const path = join(repoRoot, decodeURIComponent(new URL(req.url, "http://localhost").pathname));
    if (!path.startsWith(repoRoot) || !existsSync(path) || statSync(path).isDirectory()) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, { "content-type": TYPES[extname(path)] || "application/octet-stream" });
    res.end(readFileSync(path));
  });
  await new Promise((done) => server.listen(0, done));

  const require = createRequire(import.meta.url);
  const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
  const browser = await chromium.launch();
  try {
    await run({ browser, baseUrl: `http://localhost:${server.address().port}` });
  } finally {
    await browser.close();
    server.close();
  }
};
