#!/usr/bin/env python3
"""Arma public/data/run2.json con la corrida 2 de clasificación de TARS.

Fuentes (solo lectura, con `git show` sobre origin/development del repo JAR):
  docs/team/ajuste/runs/run2_log.txt   poses de AMCL (frame map), reportes y estados de mision.py
  docs/team/ajuste/scripts/decode_map_from_log.py  se usa solo si el log trae el mapa en partes

Salida: { resolucion, origen, tamano, duracion, pose[[t,x,y,yaw]], reportes[{t,x,y}], estados[{t,de,a}] }
        y, si el mapa se puede reconstruir, public/data/run2-map.png.
Si el log no trae el mapa se usa public/data/run2-map.png (de map-from-replay-gif.mjs) si existe;
si no, el replay dibuja solo la traza sobre la grilla.

Uso: python3 scripts/build-run-data.py [REPO_JAR]
"""
import base64
import json
import os
import re
import struct
import subprocess
import sys
import zlib

REPO = sys.argv[1] if len(sys.argv) > 1 else os.path.expanduser("~/Documents/Projects/JAR_TARS/jar_challenge")
REF = "origin/development"
LOG = "docs/team/ajuste/runs/run2_log.txt"
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "data")


def git_show(path):
    return subprocess.run(["git", "-C", REPO, "show", f"{REF}:{path}"], check=True, capture_output=True).stdout.decode("utf-8", "replace")


def write_png(path, width, height, rows):
    """PNG de 8 bits en escala de grises, sin dependencias."""
    raw = b"".join(b"\x00" + bytes(r) for r in rows)

    def chunk(tag, data):
        c = struct.pack(">I", len(data)) + tag + data
        return c + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)

    png = b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, 0, 0, 0, 0))
    png += chunk(b"IDAT", zlib.compress(raw, 9)) + chunk(b"IEND", b"")
    open(path, "wb").write(png)


text = git_show(LOG)
pose, reportes, estados = [], [], []
size = res = origin = None

for line in text.splitlines():
    m = re.match(r"\d\d:\d\d:\d\d\s+(\d+\.\d)\s+POSE (\S+) (\S+) (\S+) sd_xy", line)
    if m:
        t, x, y, yaw = (float(v) for v in m.groups())
        pose.append([round(t, 1), round(x, 3), round(y, 3), round(yaw, 3)])
        continue
    m = re.match(r"\d\d:\d\d:\d\d\s+(\d+\.\d)\s+INFO\s+\[mision\] Reporte (\d+)\. id=\d+ x=(\S+) y=(\S+)", line)
    if m:
        reportes.append({"t": float(m.group(1)), "x": float(m.group(3)), "y": float(m.group(4))})
        continue
    m = re.match(r"\d\d:\d\d:\d\d\s+(\d+\.\d)\s+INFO\s+\[mision\] Estado: <(\w+)> -> <(\w+)>", line)
    if m:
        estados.append({"t": float(m.group(1)), "de": m.group(2), "a": m.group(3)})
        continue
    m = re.match(r"\d\d:\d\d:\d\d\s+\S+\s+MAP (\d+)x(\d+) res (\S+) origin \((\S+), (\S+)\)", line)
    if m:
        size = {"ancho": int(m.group(1)), "alto": int(m.group(2))}
        res = float(m.group(3))
        origin = [float(m.group(4).rstrip(",")), float(m.group(5))]

if not pose or size is None:
    sys.exit("el log no tiene poses o cabecera de mapa")

# Mapa: solo si el log lo imprimió como partes zlib+base64 (ver decode_map_from_log.py)
map_png = None
header = re.search(r"map: (\d+)x(\d+) @ (\S+) m, origin \((\S+), (\S+)\), (\d+) parts", text)
parts = {int(m.group(1)): m.group(3) for m in re.finditer(r"map\[(\d+)/(\d+)\]: (\S+)", text)}
if header and parts:
    w, h, _, _, _, count = header.groups()
    w, h, count = int(w), int(h), int(count)
    data = zlib.decompress(base64.b64decode("".join(parts[i] for i in range(1, count + 1))))
    assert len(data) == w * h
    rows = [[0 if data[j * w + i] >= 50 else 240 for i in range(w)] for j in range(h - 1, -1, -1)]
    os.makedirs(OUT_DIR, exist_ok=True)
    write_png(os.path.join(OUT_DIR, "run2-map.png"), w, h, rows)
    map_png = "run2-map.png"

map_source = "log" if map_png else None
if map_png is None and os.path.exists(os.path.join(OUT_DIR, "run2-map.png")):
    # map-from-replay-gif.mjs lo reconstruyó del GIF que el equipo publicó en docs/media
    map_png, map_source = "run2-map.png", "replay-gif"

out = {
    "resolucion": res,
    "origen": origin,
    "tamano": size,
    "duracion": pose[-1][0],
    "mapa": map_png,
    "mapaFuente": map_source,
    "pose": pose,
    "reportes": reportes,
    "estados": estados,
}
os.makedirs(OUT_DIR, exist_ok=True)
with open(os.path.join(OUT_DIR, "run2.json"), "w") as f:
    json.dump(out, f, separators=(",", ":"))
print(f"run2.json: {len(pose)} poses, {len(reportes)} reportes, {len(estados)} estados, mapa={map_source or 'NO (el log no lo trae)'}")
