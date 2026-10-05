// Renders the calendar demo in headless Chromium and saves screenshots.
// Usage: node cards/calendar/demo/screenshot.mjs [outDir]
// (needs Playwright; see tools/demo/harness.mjs)
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { withDemo } from "../../../tools/demo/harness.mjs";

const outDir = resolve(process.argv[2] || join(import.meta.dirname, "screenshots"));
mkdirSync(outDir, { recursive: true });

const shots = [
  { name: "month-light", query: "variant=month", width: 1100, dialogs: true },
  { name: "month-dark", query: "variant=month&theme=dark", width: 1100 },
  { name: "weeks-light", query: "variant=weeks", width: 1100 },
  { name: "weeks1-dark", query: "variant=weeks1&theme=dark", width: 900 },
  { name: "plain-light", query: "variant=plain", width: 800 },
  { name: "mobile-light", query: "variant=month", width: 390, mobile: true },
];

const clickInCard = (page, selector) =>
  page.evaluate((sel) => {
    document.querySelector("jtd-calendar-card").shadowRoot.querySelector(sel)?.click();
  }, selector);

const errors = [];
await withDemo(async ({ browser, baseUrl }) => {
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
    await page.goto(`${baseUrl}/cards/calendar/demo/index.html?${shot.query}&width=${width}`);
    await page.waitForTimeout(600);
    await (await page.$("jtd-calendar-card")).screenshot({ path: join(outDir, `${shot.name}.png`) });
    if (shot.dialogs) {
      // The day dialog for a busy day, then one of its events.
      await clickInCard(page, ".more");
      await page.waitForTimeout(300);
      await page.screenshot({ path: join(outDir, "dialog-day.png") });
      await clickInCard(page, ".dlg-event");
      await page.waitForTimeout(300);
      await page.screenshot({ path: join(outDir, "dialog-event.png") });
    }
    await page.close();
  }
});

if (errors.length) console.log(`Browser errors:\n${errors.join("\n")}`);
console.log(`Saved screenshots to ${outDir}`);
