import { expect, test, type Page } from "@playwright/test";
import { projectSlugs } from "../content/projects";

const locales = ["es", "en"] as const;

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(e.message));
  return errors;
}

test("/ redirige a /es y a /en con Accept-Language", async ({ request }) => {
  const es = await request.get("/", { maxRedirects: 0 });
  expect(es.status()).toBe(307);
  expect(es.headers()["location"]).toMatch(/\/es$/);
  const en = await request.get("/", { maxRedirects: 0, headers: { "Accept-Language": "en-US,en;q=0.9" } });
  expect(en.headers()["location"]).toMatch(/\/en$/);
});

for (const locale of locales) {
  test(`/${locale} tiene un h1 con Bautista y sin errores de consola`, async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto(`/${locale}`);
    await expect(page.locator("h1")).toContainText(/bautista/i);
    await page.waitForTimeout(2500);
    expect(errors).toEqual([]);
  });
}

test("el toggle cambia de idioma y conserva la ruta", async ({ page }) => {
  await page.goto("/es/proyectos/tars");
  await page.getByRole("link", { name: "EN", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/proyectos\/tars$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.getByRole("link", { name: "ES", exact: true }).click();
  await expect(page).toHaveURL(/\/es\/proyectos\/tars$/);
});

for (const locale of locales) {
  for (const slug of projectSlugs) {
    test(`/${locale}/proyectos/${slug} responde 200 y tiene título`, async ({ page }) => {
      const errors = collectErrors(page);
      const res = await page.goto(`/${locale}/proyectos/${slug}`);
      expect(res?.status()).toBe(200);
      expect((await page.title()).length).toBeGreaterThan(5);
      await expect(page.locator("h1")).toBeVisible();
      await page.waitForTimeout(600);
      expect(errors).toEqual([]);
    });
  }
}

test("a 375×812 no hay scroll horizontal", async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const page = await ctx.newPage();
  for (const url of ["/es", "/en", "/es/proyectos/tars", "/es/proyectos/academica", "/es/proyectos/semaforo"]) {
    await page.goto(url);
    await page.waitForTimeout(1200);
    const w = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(w, url).toBeLessThanOrEqual(375);
  }
  await ctx.close();
});

test("con reduced motion no hay canvas WebGL, se ve el póster y el replay muestra el estado final", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto("/es");
  await page.waitForTimeout(2500);
  expect(await page.locator("figure canvas").count()).toBe(0);
  await expect(page.locator('img[src*="robot-poster"]').first()).toBeVisible();
  await expect(page.getByTestId("replay-reports")).toHaveText("3/3");
  await expect(page.getByTestId("replay-clock")).not.toHaveText("00:00");
  await ctx.close();
});

test("el HUD muestra exploring en Proyectos y finished al final de Contacto", async ({ page }) => {
  await page.goto("/es");
  await page.waitForTimeout(1200);
  await expect(page.getByTestId("hud")).toHaveAttribute("data-state", "exploring");
  await page.evaluate(() => document.querySelector("#proyectos")!.scrollIntoView());
  await page.waitForTimeout(800);
  await expect(page.getByTestId("hud")).toHaveAttribute("data-state", "exploring");
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect(page.getByTestId("hud")).toHaveAttribute("data-state", "finished", { timeout: 6000 });
});

test("three.js no está en el JS inicial de la home", async ({ page }) => {
  await page.goto("/es", { waitUntil: "load" });
  const initial = await page.evaluate(() =>
    [...document.querySelectorAll("script[src]")].map((s) => (s as HTMLScriptElement).src),
  );
  let hasThree = false;
  for (const url of initial) {
    const body = await (await page.request.get(url)).text();
    if (/WebGLRenderer/.test(body)) hasThree = true;
  }
  expect(hasThree).toBe(false);
});

test("se puede recorrer con Tab y el foco se ve", async ({ page }) => {
  await page.goto("/es");
  for (let i = 0; i < 6; i++) await page.keyboard.press("Tab");
  const outline = await page.evaluate(() => {
    const s = getComputedStyle(document.activeElement as HTMLElement);
    return { width: s.outlineWidth, color: s.outlineColor, style: s.outlineStyle };
  });
  expect(outline.style).not.toBe("none");
  expect(outline.color).toBe("rgb(225, 38, 45)");
});

test("el HUD se oculta mientras el replay está en pantalla y vuelve después", async ({ page }) => {
  await page.goto("/es");
  await page.waitForTimeout(1200);
  await expect(page.getByTestId("hud")).toHaveAttribute("data-hidden", "false");
  await page.evaluate(() => {
    const r = document.querySelector('[data-testid="run-replay"]')!.getBoundingClientRect();
    window.scrollTo(0, r.top + window.scrollY + 200);
  });
  await expect(page.getByTestId("hud")).toHaveAttribute("data-hidden", "true");
  await page.evaluate(() => document.querySelector("#sobre-mi")!.scrollIntoView());
  await expect(page.getByTestId("hud")).toHaveAttribute("data-hidden", "false");
});

test("el encabezado del replay dice de qué corrida es", async ({ page }) => {
  await page.goto("/es");
  await expect(page.getByTestId("run-replay")).toContainText(/Corrida 2 · 4\/11/);
  await page.goto("/en");
  await expect(page.getByTestId("run-replay")).toContainText(/Run 2 · Nov 4/);
});

test("el semáforo muestra el diagrama de arquitectura y no usa video del dataset", async ({ page, request }) => {
  await page.goto("/es/proyectos/semaforo");
  await expect(page.locator('svg[data-diagram="semaforo"]')).toBeVisible();
  expect(await page.locator("video").count()).toBe(0);
  const gone = await request.get("/media/semaforo/clip.mp4");
  expect(gone.status()).toBe(404);
});

test("el h1 del detalle no repite el nombre corto", async ({ page }) => {
  await page.goto("/es/proyectos/tars");
  await expect(page.locator("h1")).toContainText("Robot autónomo de búsqueda y rescate");
  await expect(page.locator("h1")).not.toContainText("TARS: ");
});

test("en mobile el hero va nombre, subtítulo, chip, links y después el robot", async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto("/es");
  const y = async (sel: string) => (await page.locator(sel).first().boundingBox())!.y;
  const h1 = await y("h1");
  const tagline = await y("#hero p");
  const link = await y("#hero a[href^='mailto']");
  const robot = await y("#hero figure");
  expect(h1).toBeLessThan(tagline);
  expect(tagline).toBeLessThan(link);
  expect(link).toBeLessThan(robot);
  expect(link).toBeLessThan(844);
  await ctx.close();
});
