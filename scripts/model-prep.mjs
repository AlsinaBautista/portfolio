// Paso 1 y 2 de optimize-model.sh: mm -> m y simplificación selectiva.
// Uso: node scripts/model-prep.mjs <in.glb> <out.glb>
import { NodeIO } from "@gltf-transform/core";
import { weld, simplifyPrimitive } from "@gltf-transform/functions";
import { MeshoptSimplifier } from "meshoptimizer";

const [inPath, outPath] = process.argv.slice(2);
const io = new NodeIO();
const doc = await io.read(inPath);
const root = doc.getRoot();

// 1. Escalar de milímetros a metros
for (const scene of root.listScenes()) {
  for (const node of scene.listChildren()) {
    const s = node.getScale();
    node.setScale([s[0] * 0.001, s[1] * 0.001, s[2] * 0.001]);
    const t = node.getTranslation();
    node.setTranslation([t[0] * 0.001, t[1] * 0.001, t[2] * 0.001]);
  }
}

await doc.transform(weld({ tolerance: 0.0001 }));
await MeshoptSimplifier.ready;

// 2. Simplificar fuerte lo pesado (LiDAR: 155k triángulos) y suavemente el resto
const getMeshPrimitives = (m) => m.listPrimitives();
const tri = (mesh) =>
  getMeshPrimitives(mesh).reduce((n, p) => n + (p.getIndices()?.getCount() ?? 0) / 3, 0);
const heavy = root.listMeshes().filter((m) => tri(m) > 4000);
const rest = root.listMeshes().filter((m) => tri(m) <= 4000);
const ratioHeavy = Number(process.env.RATIO_HEAVY ?? 0.04);
const ratioRest = Number(process.env.RATIO_REST ?? 0.5);
for (const [meshes, ratio, error] of [
  [heavy, ratioHeavy, 0.02],
  [rest, ratioRest, 0.01],
]) {
  for (const mesh of meshes) {
    if (ratio >= 1) continue;
    for (const prim of getMeshPrimitives(mesh)) {
      try {
        simplifyPrimitive(prim, { simplifier: MeshoptSimplifier, ratio, error, lockBorder: false });
      } catch {
        // mallas degeneradas (pocos triángulos): se dejan como están
      }
    }
  }
}
const total = root.listMeshes().reduce((n, m) => n + tri(m), 0);
console.log(`model-prep: ${root.listMeshes().length} meshes, ${Math.round(total)} triangles`);
await io.write(outPath, doc);
