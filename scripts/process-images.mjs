// Convierte las imágenes de origen a WebP optimizado dentro de public/media (sharp).
// Los originales no se tocan. Uso: node scripts/process-images.mjs [carpeta con extractos opcional]
import { existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { homedir } from "node:os";
import sharp from "sharp";

const home = homedir();
const dl = (n) => join(home, "Downloads", n);
const scratch = process.env.MEDIA_SCRATCH ?? join(process.cwd(), ".scratch"); // extractos de git show / ffmpeg
const out = join(process.cwd(), "public", "media");

const parroquia = join(home, "repo_parroquia/Parroquia/web_parroquia/public/images");
const promo = join(home, "Documents/Projects/notes-promo/promo/out");
const galeria = join(home, "Documents/Projects/tutor-dibujos-medicion/galeria");
const pca = join(home, "Documents/Udesa/inferencia/TP1/pca-montecarlo-pneumonia/figures");

// [origen, destino relativo a public/media, ancho máximo, calidad, opciones]
const jobs = [
  // TARS
  [join(scratch, "jar/arena_qualification.jpg"), "tars/arena-qualification.webp", 900, 78],
  [join(scratch, "jar/sim_maze_3_6x6.png"), "tars/sim-maze.webp", 900, 82],
  [dl("WhatsApp Image 2026-11-04 at 16.15.11.jpeg"), "tars/arena-top.webp", 1000, 78],
  [dl("WhatsApp Image 2026-11-06 at 21.39.34.jpeg"), "tars/start-circle.webp", 1200, 76],
  [dl("WhatsApp Image 2026-11-06 at 21.45.46 (2).jpeg"), "tars/team.webp", 1400, 76],
  // Académica: cuadros del promo y figuras que dibuja el tutor
  [join(scratch, "frames/academica-14.png"), "academica/still-hoy.webp", 1400, 80],
  [join(scratch, "frames/academica-54.png"), "academica/still-tablet.webp", 1400, 80],
  [join(scratch, "frames/academica-84.png"), "academica/still-tutor.webp", 1400, 80],
  [join(galeria, "opus-flujo-1.png"), "academica/fig-flujo.webp", 700, 82],
  [join(galeria, "opus-histograma-1.png"), "academica/fig-histograma.webp", 900, 82],
  [join(galeria, "opus-red-1.png"), "academica/fig-red.webp", 900, 82],
  // Parroquia
  [join(parroquia, "hero-1.jpg"), "parroquia/fachada.webp", 1400, 76],
  [join(parroquia, "arq_03.jpg"), "parroquia/iglesia.webp", 1200, 76],
  [join(scratch, "parroquia-live.png"), "parroquia/sitio.webp", 1400, 80],
  // FIA, Inferencia, Bloons
  ["/Users/bautista/Documents/Udesa/FIA/TP1/FIA-TP1-2026-ALSINA/assets/board.png", "fia/tablero.webp", 700, 85],
  [join(pca, "pca_scatter.png"), "inferencia/pca-scatter.webp", 1000, 84],
  [join(pca, "accuracy_vs_k.png"), "inferencia/accuracy-vs-k.webp", 1000, 84],
  [join(scratch, "bloons-gameplay.png"), "bloons/gameplay.webp", 992, 84],
];

let missing = 0;
for (const [src, dest, width, quality] of jobs) {
  if (!existsSync(src)) {
    console.warn(`  (falta) ${src}`);
    missing++;
    continue;
  }
  const to = join(out, dest);
  mkdirSync(dirname(to), { recursive: true });
  await sharp(src).rotate().resize({ width, withoutEnlargement: true }).webp({ quality, effort: 5 }).toFile(to);
  console.log(`  ${dest}  ${(statSync(to).size / 1024).toFixed(0)} KB`);
}
if (missing) console.warn(`${missing} imágenes sin origen: se omiten`);
