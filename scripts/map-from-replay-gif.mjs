// Reconstruye el mapa de la arena (corrida 2) a partir de docs/media/real_run_replay.gif del repo JAR.
// Los logs de la corrida 2 no traen el mapa, pero el GIF que el equipo publicó lo dibuja sobre /map.
// Se toma el voto de varios cuadros para borrar el robot y la traza. Salida: PNG recortado a la arena,
// con paredes opacas y el resto transparente, y su recuadro en píxeles para alinear con run2.json.
//
// Uso: node scripts/map-from-replay-gif.mjs <replay.gif> <out.png> [<out.json>]
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, readdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";

const [gif, outPng, outJson] = process.argv.slice(2);
const tmp = mkdtempSync(join(tmpdir(), "run2map-"));
try {
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", gif, "-vf", "select=not(mod(n\\,6))", "-vsync", "vfr", join(tmp, "f%03d.png")]);
  const files = readdirSync(tmp).filter((f) => f.endsWith(".png")).sort();
  let votes, W, H;
  for (const f of files) {
    const { data, info } = await sharp(join(tmp, f)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    W = info.width; H = info.height;
    votes ??= new Uint16Array(W * H);
    for (let i = 0; i < W * H; i++) {
      const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
      // pared del mapa: gris claro, sin tinte (el robot es blanco con borde azul, la traza azul, los reportes rojos)
      if (r > 150 && Math.abs(r - g) < 26 && Math.abs(g - b) < 34 && r < 235) votes[i]++;
    }
  }
  const need = Math.ceil(files.length * 0.7);
  const wall = new Uint8Array(W * H);
  // el recuadro de la arena queda entre los encabezados (y < 85 y y > 722 son texto)
  let minx = 1e9, maxx = -1, miny = 1e9, maxy = -1;
  for (let y = 85; y < 722; y++) for (let x = 0; x < W; x++) {
    if (votes[y * W + x] >= need) {
      wall[y * W + x] = 1;
      if (x < minx) minx = x; if (x > maxx) maxx = x; if (y < miny) miny = y; if (y > maxy) maxy = y;
    }
  }
  const w = maxx - minx + 1, h = maxy - miny + 1;
  const out = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (wall[(y + miny) * W + (x + minx)]) { const o = (y * w + x) * 4; out[o] = 20; out[o + 1] = 22; out[o + 2] = 21; out[o + 3] = 255; }
  }
  await sharp(out, { raw: { width: w, height: h, channels: 4 } }).png({ palette: true, compressionLevel: 9 }).toFile(outPng);
  const box = { frame: [W, H], bbox: [minx, miny, maxx, maxy], size: [w, h], frames: files.length };
  if (outJson) writeFileSync(outJson, JSON.stringify(box));
  console.log("run2-map.png", box);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
