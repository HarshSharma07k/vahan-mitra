// scripts/gen-docs/build.mjs
// Renders every mock document HTML file with Playwright, then runs the
// screenshot through a lossy jpeg/blur pass with sharp so compression
// artifacts (rule 7) are the final tell. Dev tooling — not shipped.
import { chromium } from "playwright";
import sharp from "sharp";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, extname } from "node:path";
import { createServer } from "node:http";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(HERE, "..", "..", "public", "mock");
const PREVIEW_DIR = join(HERE, "preview");

const MIME = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".woff2": "font/woff2" };

function startServer() {
  const server = createServer(async (req, res) => {
    try {
      const path = join(HERE, decodeURIComponent(req.url.split("?")[0]));
      const body = await readFile(path);
      res.writeHead(200, { "content-type": MIME[extname(path)] ?? "application/octet-stream" });
      res.end(body);
    } catch {
      res.writeHead(404);
      res.end();
    }
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => resolve(server));
  });
}

const jobs = [
  { name: "rc-clean", file: "rc.html", canvas: { w: 1600, h: 1000 } },
  { name: "rc-blur", file: "rc.html", canvas: { w: 1600, h: 1000 }, blurBottomThird: true },
  { name: "rc-mismatch", file: "rc-mismatch.html", canvas: { w: 1600, h: 1000 } },
  { name: "dl-clean", file: "dl.html", canvas: { w: 1600, h: 1000 } },
  { name: "aadhaar-clean", file: "aadhaar.html", canvas: { w: 1600, h: 1000 } },
  {
    name: "aadhaar-mismatch",
    file: "aadhaar.html",
    query: "?name=ANANYA%20V&seed=1620",
    canvas: { w: 1600, h: 1000 },
  },
  { name: "insurance-expired", file: "insurance.html", canvas: { w: 1240, h: 1600 } },
];

async function compress(buffer) {
  const jpeg = await sharp(buffer)
    .jpeg({ quality: 74, chromaSubsampling: "4:2:0" })
    .toBuffer();
  return sharp(jpeg).png().blur(0.35).toBuffer();
}

async function blurBottomThird(buffer, w, h) {
  const cut = Math.round(h * 0.667);
  const top = await sharp(buffer).extract({ left: 0, top: 0, width: w, height: cut }).toBuffer();
  const bottom = await sharp(buffer)
    .extract({ left: 0, top: cut, width: w, height: h - cut })
    .blur(3.4)
    .toBuffer();
  return sharp({ create: { width: w, height: h, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([
      { input: top, top: 0, left: 0 },
      { input: bottom, top: cut, left: 0 },
    ])
    .png()
    .toBuffer();
}

async function previewWithBoxes(buffer, w, h, boxes) {
  const rects = Object.entries(boxes)
    .map(
      ([key, b]) => `
      <rect x="${(b.x / 100) * w}" y="${(b.y / 100) * h}" width="${(b.w / 100) * w}" height="${(b.h / 100) * h}"
        fill="none" stroke="red" stroke-width="2" />
      <text x="${(b.x / 100) * w}" y="${(b.y / 100) * h - 4}" fill="red" font-size="11" font-family="monospace">${key}</text>`
    )
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${rects}</svg>`;
  return sharp(buffer)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .png()
    .toBuffer();
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  await mkdir(PREVIEW_DIR, { recursive: true });

  const server = await startServer();
  const port = server.address().port;
  const browser = await chromium.launch();
  const summary = [];

  for (const job of jobs) {
    const page = await browser.newPage({
      viewport: { width: job.canvas.w, height: job.canvas.h },
      deviceScaleFactor: 2,
    });
    const url = `http://127.0.0.1:${port}/${job.file}${job.query ?? ""}`;
    await page.goto(url);
    await page.waitForFunction(() => window.__DOC_READY === true);
    const boxes = await page.evaluate(() => window.__FIELD_BOXES);

    const stage = page.locator("#stage");
    let raw = await stage.screenshot();
    await page.close();

    raw = await sharp(raw).resize(job.canvas.w, job.canvas.h).png().toBuffer();
    if (job.blurBottomThird) raw = await blurBottomThird(raw, job.canvas.w, job.canvas.h);

    const final = await compress(raw);
    const outPath = join(OUT_DIR, `${job.name}.png`);
    await writeFile(outPath, final);

    const preview = await previewWithBoxes(final, job.canvas.w, job.canvas.h, boxes);
    await writeFile(join(PREVIEW_DIR, `${job.name}.png`), preview);

    const meta = await sharp(final).metadata();
    summary.push({ name: job.name, w: meta.width, h: meta.height, boxes });
  }

  await browser.close();
  server.close();

  console.log("\nWritten to public/mock/:");
  for (const s of summary) {
    console.log(`  ${s.name}.png  ${s.w}x${s.h}`);
  }
  await writeFile(join(HERE, "boxes-report.json"), JSON.stringify(summary, null, 2));
  console.log("\nField boxes written to scripts/gen-docs/boxes-report.json");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
