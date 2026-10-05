// Renders the demo page in headless Chromium and saves screenshots.
// Usage: node demo/screenshot.mjs [outDir]   (needs `playwright` available)
import { createServer } from "node:http";
import { mkdirSync, readFileSync, existsSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");

const root = resolve(new URL("..", import.meta.url).pathname);
const outDir = resolve(process.argv[2] || join(root, "demo/screenshots"));
mkdirSync(outDir, { recursive: true });

const types = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css" };
const server = createServer((req, res) => {
  const path = join(root, decodeURIComponent(new URL(req.url, "http://x").pathname));
  if (!path.startsWith(root) || !existsSync(path)) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { "content-type": types[extname(path)] || "application/octet-stream" });
  res.end(readFileSync(path));
});
await new Promise((r) => server.listen(0, r));
const port = server.address().port;

const shots = [
  { name: "month-light", query: "variant=month", width: 1100 },
  { name: "month-dark", query: "variant=month&theme=dark", width: 1100 },
  { name: "weeks-light", query: "variant=weeks", width: 1100 },
  { name: "weeks1-dark", query: "variant=weeks1&theme=dark", width: 900 },
  { name: "plain-light", query: "variant=plain", width: 800 },
  { name: "mobile-light", query: "variant=month", width: 390, mobile: true },
];

const browser = await chromium.launch({
  executablePath: existsSync("/opt/pw-browsers/chromium") ? undefined : undefined,
});
const errors = [];
for (const shot of shots) {
  const page = await browser.newPage({
    viewport: { width: shot.mobile ? shot.width : shot.width + 48, height: 900 },
    deviceScaleFactor: shot.mobile ? 2 : 1,
  });
  page.on("pageerror", (err) => errors.push(`${shot.name}: ${err.message}`));
  page.on("console", (msg) => {
    if (msg.type() === "error" || msg.type() === "warning") errors.push(`${shot.name}: ${msg.text()}`);
  });
  const width = shot.mobile ? shot.width - 32 : shot.width;
  await page.goto(`http://localhost:${port}/demo/index.html?${shot.query}&width=${width}`);
  await page.waitForTimeout(600);
  const card = await page.$("jtd-calendar-card");
  await card.screenshot({ path: join(outDir, `${shot.name}.png`) });
  if (shot.name === "month-light") {
    // Open the day dialog for a busy day and the event dialog.
    await page.evaluate(() => {
      const root = document.querySelector("jtd-calendar-card").shadowRoot;
      root.querySelector(".more")?.click();
    });
    await page.waitForTimeout(300);
    await page.screenshot({ path: join(outDir, "dialog-day.png") });
    await page.evaluate(() => {
      const root = document.querySelector("jtd-calendar-card").shadowRoot;
      root.querySelector(".dlg-event")?.click();
    });
    await page.waitForTimeout(300);
    await page.screenshot({ path: join(outDir, "dialog-event.png") });
  }
  await page.close();
}
await browser.close();
server.close();
if (errors.length) {
  console.log("Browser errors:\n" + errors.join("\n"));
}
console.log(`Saved screenshots to ${outDir}`);
