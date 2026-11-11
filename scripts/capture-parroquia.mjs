// Captura del sitio público de la Parroquia con Playwright (solo lectura, una sola carga).
// Uso: node scripts/capture-parroquia.mjs <salida.png>
import { chromium } from "@playwright/test";

const out = process.argv[2];
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("https://santuarioemigrantes.org/servicios", { waitUntil: "load", timeout: 45000 });
  await page.waitForTimeout(8000);
  // Página de servicios: muestra la estructura del sitio sin datos de contacto ni fotos de personas.
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: out });
  console.log("captura:", out);
} finally {
  await browser.close();
}
