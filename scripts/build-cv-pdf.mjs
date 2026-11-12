// Genera los PDFs del CV: levanta `next start` (hace falta un build previo; `npm run cv` lo hace),
// abre /es/cv y /en/cv con Playwright, guarda page.pdf (A4, con fondos) en public/cv/ y escribe
// public/cv/cv-hash.json con el hash del contenido, que un test compara para detectar PDFs viejos.
// Uso: npm run cv
import { chromium } from "@playwright/test";
import { PDFDocument } from "pdf-lib";
import { spawn } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { cvSourceHash } from "./cv-hash.mjs";

const PORT = 3299;
const base = `http://localhost:${PORT}`;
const server = spawn("npx", ["next", "start", "-p", String(PORT)], { stdio: "ignore", detached: false });
const stop = () => server.kill("SIGTERM");
process.on("exit", stop);

async function waitReady() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`${base}/es/cv`);
      if (r.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error("next start no levantó");
}

try {
  await waitReady();
  mkdirSync("public/cv", { recursive: true });
  const browser = await chromium.launch();
  for (const locale of ["es", "en"]) {
    const page = await browser.newPage({ viewport: { width: 1200, height: 1600 } });
    await page.goto(`${base}/${locale}/cv`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.emulateMedia({ media: "print" });
    const out = `public/cv/bautista-alsina-cv-${locale}.pdf`;
    await page.pdf({
      path: out,
      preferCSSPageSize: true,
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
      tagged: true,
      outline: false,
    });
    const pages = (await PDFDocument.load(readFileSync(out))).getPageCount();
    console.log(`${out}: ${pages} página(s), ${(readFileSync(out).length / 1024).toFixed(0)} KB`);
    if (pages !== 1) throw new Error(`${out} tiene ${pages} páginas: hay que ajustar la maquetación`);
    await page.close();
  }
  await browser.close();
  const hash = cvSourceHash();
  writeFileSync("public/cv/cv-hash.json", JSON.stringify({ hash }, null, 2) + "\n");
  console.log("cv-hash.json:", hash);
} finally {
  stop();
}
