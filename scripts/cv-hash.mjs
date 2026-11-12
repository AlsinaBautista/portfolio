// Hash de las fuentes del CV: datos (content/cv.ts y content/site.ts, de donde toma contacto y textos)
// y maquetación. Lo usan `npm run cv` (lo guarda en public/cv/cv-hash.json) y el test que detecta
// PDFs desactualizados. Vive fuera del código de Next para que el build no tenga que rastrear el disco.
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const CV_SOURCES = [
  "content/cv.ts",
  "content/site.ts",
  "components/cv/CvSheet.tsx",
  "app/[locale]/cv/cv.css",
];

export function cvSourceHash(root = process.cwd()) {
  const h = createHash("sha256");
  for (const f of CV_SOURCES) h.update(readFileSync(join(root, f)));
  return h.digest("hex").slice(0, 16);
}
