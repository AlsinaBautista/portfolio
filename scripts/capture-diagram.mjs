// Saca la portada estática del diagrama del semáforo (public/media/semaforo/arquitectura.webp)
// desde el SVG animado de la página de detalle, con reduced motion para tomar el cuadro final.
// Uso: node scripts/capture-diagram.mjs [baseUrl]
import { chromium } from "@playwright/test";
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const base = process.argv[2] ?? "http://localhost:3000";
const browser = await chromium.launch();
try {
  const ctx = await browser.newContext({ viewport: { width: 1300, height: 800 }, deviceScaleFactor: 2, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(`${base}/es/proyectos/semaforo`, { waitUntil: "load" });
  await page.addStyleTag({ content: "aside, header { display: none !important; }" });
  await page.waitForTimeout(800);
  const png = await page.locator('svg[data-diagram="semaforo"]').screenshot();
  mkdirSync("public/media/semaforo", { recursive: true });
  await sharp(png).resize({ width: 1600 }).webp({ quality: 86 }).toFile("public/media/semaforo/arquitectura.webp");
  console.log("public/media/semaforo/arquitectura.webp");
} finally {
  await browser.close();
}
