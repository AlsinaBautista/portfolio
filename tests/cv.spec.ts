import { expect, test } from "@playwright/test";
import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { PDFDict, PDFDocument, PDFName } from "pdf-lib";

const root = process.cwd();
const pdfPath = (l: string) => join(root, "public/cv", `bautista-alsina-cv-${l}.pdf`);

async function pdfText(file: string): Promise<string> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const doc = await pdfjs.getDocument({ data: new Uint8Array(readFileSync(file)), useSystemFonts: true }).promise;
  let out = "";
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    out += content.items.map((it) => ("str" in it ? it.str : "")).join(" ") + "\n";
  }
  return out.replace(/\s+/g, " ");
}

const sections = {
  es: ["Educación", "Proyectos", "Competencias", "Experiencia", "Skills"],
  en: ["Education", "Projects", "Competitions", "Experience", "Skills"],
};

for (const locale of ["es", "en"] as const) {
  test(`/${locale}/cv responde 200 con el nombre en el h1 y todas las secciones`, async ({ page }) => {
    const res = await page.goto(`/${locale}/cv`);
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveText("Bautista Tomás Alsina");
    const h2 = (await page.locator("h2").allTextContents()).map((t) => t.toLowerCase());
    for (const s of sections[locale]) expect(h2, s).toContain(s.toLowerCase());
  });

  test(`el PDF ${locale}: 1 página, menos de 300 KB, texto extraíble y sin datos privados`, async () => {
    const file = pdfPath(locale);
    expect(statSync(file).size).toBeLessThan(300 * 1024);
    const pdf = await PDFDocument.load(readFileSync(file));
    expect(pdf.getPageCount()).toBe(1);
    // fuentes autocontenidas: Chromium embebe las variables como Type3 con ToUnicode (texto extraíble)
    let fonts = 0;
    for (const [, o] of pdf.context.enumerateIndirectObjects()) {
      if (o instanceof PDFDict && o.get(PDFName.of("Type"))?.toString() === "/Font") {
        fonts++;
        const sub = o.get(PDFName.of("Subtype"))?.toString();
        expect(sub === "/Type3" || sub === "/Type0", sub).toBe(true);
        expect(o.get(PDFName.of("ToUnicode"))).toBeTruthy();
      }
    }
    expect(fonts).toBeGreaterThan(0);
    const text = await pdfText(file);
    expect(text).toContain("Bautista Tomás Alsina");
    expect(text).toContain(locale === "es" ? "8,92" : "8.92");
    expect(text).toContain("TARS");
    expect(text).not.toContain("370833");
    expect(text).not.toMatch(/\+\d{2}[\s\d-]{8,}|\b\d{4}[\s-]\d{4}\b|\b\d{2}[\s-]\d{4}[\s-]\d{4}\b/);
    expect(text).toContain("hbato21@gmail.com");
    // orden de lectura (ATS): los puntos de cada sección salen dentro de su sección
    const at = (t: string) => text.indexOf(t);
    const [edu, proj, comp, exp, skills] = sections[locale].map((s) => at(s.toUpperCase()));
    expect(edu).toBeGreaterThan(0);
    expect(edu).toBeLessThan(at(locale === "es" ? "Beca Abanderados" : "Abanderados Argentinos merit"));
    expect(at(locale === "es" ? "Beca Abanderados" : "Abanderados Argentinos merit")).toBeLessThan(proj);
    expect(proj).toBeLessThan(at("Diseñé") > 0 ? at("Diseñé") : at("Designed"));
    expect(at("Diseñé") > 0 ? at("Diseñé") : at("Designed")).toBeLessThan(comp);
    expect(comp).toBeLessThan(exp);
    expect(exp).toBeLessThan(skills);
  });

  test(`los botones de CV de ${locale} apuntan al PDF del idioma`, async ({ page }) => {
    await page.goto(`/${locale}`);
    const href = `/cv/bautista-alsina-cv-${locale}.pdf`;
    for (const id of ["hero-cv", "contact-cv"]) {
      const a = page.getByTestId(id);
      await expect(a).toHaveAttribute("href", href);
      await expect(a).toHaveAttribute("download", "");
    }
    expect((await page.request.get(href)).status()).toBe(200);
  });
}

test("el PDF commiteado no está desactualizado (hash del contenido)", async ({ page }) => {
  const stored = JSON.parse(readFileSync(join(root, "public/cv/cv-hash.json"), "utf8")).hash;
  for (const locale of ["es", "en"]) {
    await page.goto(`/${locale}/cv`);
    const current = await page.getAttribute("[data-cv-hash]", "data-cv-hash");
    expect(current, "corré `npm run cv` y commiteá public/cv/").toBe(stored);
  }
});

test("a 375 px /cv no tiene scroll horizontal", async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const page = await ctx.newPage();
  for (const l of ["es", "en"]) {
    await page.goto(`/${l}/cv`);
    await page.waitForTimeout(800);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
  }
  await ctx.close();
});
