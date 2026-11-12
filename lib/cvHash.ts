import "server-only";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { cv } from "@/content/cv";

/**
 * Hash del contenido del CV (los datos de los dos idiomas, ya resueltos) y de su maquetación.
 * Se imprime en la hoja (data-cv-hash); `npm run cv` lo guarda en public/cv/cv-hash.json y un
 * test falla si los PDFs commiteados quedaron desactualizados.
 */
export function cvSourceHash(): string {
  const h = createHash("sha256");
  h.update(JSON.stringify(cv));
  for (const f of ["components/cv/CvSheet.tsx", "app/[locale]/cv/cv.css"]) {
    h.update(readFileSync(join(process.cwd(), f)));
  }
  return h.digest("hex").slice(0, 16);
}
