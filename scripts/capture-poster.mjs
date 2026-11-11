// Saca el póster del robot (public/img/robot-poster.png) de la escena 3D ya armada.
// Carga la home con ?poster, espera a que el barrido deje puntos y guarda el canvas con fondo transparente.
// Uso: node scripts/capture-poster.mjs [baseUrl] [look=clay|original]
import { chromium } from "@playwright/test";
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const base = process.argv[2] ?? "http://localhost:3000";
const look = process.argv[3] ?? "clay";
const out = look === "clay" ? "public/img/robot-poster.png" : `public/img/robot-poster-${look}.png`;

const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 2.2 });
  await page.goto(`${base}/es?poster&look=${look}`, { waitUntil: "load" });
  await page.waitForSelector("figure canvas", { timeout: 30000 });
  await page.waitForTimeout(5200);
  const dataUrl = await page.evaluate(() => document.querySelector("figure canvas").toDataURL("image/png"));
  mkdirSync("public/img", { recursive: true });
  const buf = Buffer.from(dataUrl.split(",")[1], "base64");
  await sharp(buf).png({ palette: true, quality: 85, compressionLevel: 9, effort: 8 }).toFile(out);
  const meta = await sharp(out).metadata();
  console.log(out, meta.width + "x" + meta.height);
} finally {
  await browser.close();
}
