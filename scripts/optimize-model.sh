#!/usr/bin/env bash
# Optimiza el GLB del ROSMASTER X3 (421k triángulos, en milímetros) para la web.
# 1. mm -> m  2. simplifica fuerte el LiDAR  3. optimize con meshopt (texturas WebP si hubiera)
# El original se lee, no se toca. Meta: <= 1.5 MB.
set -euo pipefail
cd "$(dirname "$0")/.."

SRC="${1:-$HOME/Documents/Projects/yahboom_rosmaster/yahboom_rosmaster_description/cad/rosmaster_unified.glb}"
OUT="public/models/rosmaster.glb"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

mkdir -p "$(dirname "$OUT")"
node scripts/model-prep.mjs "$SRC" "$TMP/prep.glb"
npx --no-install gltf-transform optimize "$TMP/prep.glb" "$TMP/opt.glb" \
  --compress meshopt --texture-compress webp --palette false --simplify false
cp "$TMP/opt.glb" "$OUT"
ls -l "$OUT" | awk '{printf "rosmaster.glb: %.2f MB\n", $5/1048576}'
