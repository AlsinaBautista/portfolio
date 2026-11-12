#!/usr/bin/env bash
# Pipeline de media: videos (ffmpeg), imágenes (sharp), mapa y datos de la corrida 2.
# Los orígenes están fuera del repo y son de solo lectura: acá solo se leen y se convierten a public/.
# Los archivos intermedios van a .scratch/ (ignorado por git). Se puede volver a correr.
set -euo pipefail
cd "$(dirname "$0")/.."

DL="$HOME/Downloads"
JAR="$HOME/Documents/Projects/JAR_TARS/jar_challenge"
PROMO="$HOME/Documents/Projects/notes-promo/promo/out/academica-promo-1080.mp4"
export MEDIA_SCRATCH="${MEDIA_SCRATCH:-$PWD/.scratch}"
S="$MEDIA_SCRATCH"
M=public/media
mkdir -p "$S/jar" "$S/frames" "$M"/{tars,academica,parroquia,fia,inferencia,bloons} public/data

# Codifica un video a MP4 (H.264) y WebM (VP9), sin audio, y saca un póster WebP.
#   encode <entrada> <salida sin extensión> <filtro de video> <crf264> <crfvp9> [args de entrada...]
encode() {
  local in="$1" out="$2" vf="$3" c264="$4" c9="$5"; shift 5
  ffmpeg -v error -y "$@" -i "$in" -vf "$vf" -an -c:v libx264 -preset slow -crf "$c264" -pix_fmt yuv420p -movflags +faststart "$out.mp4"
  ffmpeg -v error -y "$@" -i "$in" -vf "$vf" -an -c:v libvpx-vp9 -b:v 0 -crf "$c9" -row-mt 1 -pix_fmt yuv420p "$out.webm"
  ffmpeg -v error -y -i "$out.mp4" -vf "select=eq(n\,12)" -frames:v 1 "$S/frames/$(basename "$out")-poster.png"
  node -e "require('sharp')('$S/frames/$(basename "$out")-poster.png').webp({quality:78}).toFile('$out-poster.webp')"
}

echo "== Mapa y datos de la corrida 2"
git -C "$JAR" show origin/development:docs/media/real_run_replay.gif > "$S/jar/real_run_replay.gif"
node scripts/map-from-replay-gif.mjs "$S/jar/real_run_replay.gif" public/data/run2-map.png
python3 -I scripts/build-run-data.py

echo "== Extractos del repo JAR (git show, solo lectura)"
for f in arena_qualification.jpg sim_maze_3_6x6.png real_final_run.gif; do
  git -C "$JAR" show "origin/development:docs/media/$f" > "$S/jar/$f"
done

echo "== Videos de TARS"
# Loop: 16 s de la toma fija, recortada a la arena (sin el costado donde hay gente)
encode "$DL/WhatsApp Video 2026-11-06 at 21.42.42.mp4" "$M/tars/loop" \
  "crop=940:720:340:0,scale=-2:640,fps=30" 27 36 -ss 5 -t 16
# Corrida completa (5:42) acelerada x16 -> unos 21 s
encode "$DL/WhatsApp Video 2026-11-06 at 21.45.05.mp4" "$M/tars/run-x16" \
  "setpts=PTS/16,fps=30" 27 36
# Corrida final real (GIF del repo) convertida a video
encode "$S/jar/real_final_run.gif" "$M/tars/final-run" "scale=trunc(iw/2)*2:trunc(ih/2)*2" 26 36

echo "== Académica"
encode "$PROMO" "$M/academica/promo" "scale=1280:720,fps=30" 30 38
for t in 14 54 84; do
  ffmpeg -v error -y -ss "$t" -i "$PROMO" -frames:v 1 "$S/frames/academica-$t.png"
done
# el primer cuadro del promo es una intro oscura: el póster es el cuadro de la tablet
node -e "require('sharp')('$S/frames/academica-54.png').resize({width:1280}).webp({quality:78}).toFile('$M/academica/promo-poster.webp')"

echo "== Bloons (gameplay real, capturado sin ventana)"
if [ ! -d "$S/bloons-repo" ]; then
  gh repo clone AlsinaBautista/Bloons-TD-game-with-pygame "$S/bloons-repo" -- --depth 1 >/dev/null 2>&1 || true
fi
if [ -d "$S/bloons-repo" ] && python3 -c "import pygame" 2>/dev/null; then
  python3 scripts/capture-bloons.py "$S/bloons-repo" "$S" >/dev/null 2>&1 || echo "  (no corrió el juego, se usan sprites)"
else
  echo "  (sin pygame-ce o sin repo: se omite la captura)"
fi

echo "== Parroquia: captura del sitio en vivo"
node scripts/capture-parroquia.mjs "$S/parroquia-live.png" || echo "  (sin captura del sitio)"

echo "== Imágenes"
node scripts/process-images.mjs

echo "== Pesos"
find public -type f \( -name '*.mp4' -o -name '*.webm' -o -name '*.glb' \) -exec ls -l {} \; | awk '{printf "%7.2f MB  %s\n", $5/1048576, $9}'
