#!/usr/bin/env bash
# Organiza as entregas: renomeia os MP4 para out/final/candidus-vNN-*.mp4, gera capas (JPG)
# e renderiza os insertos dos vídeos do fundador em out/inserts/.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p out/final/capas out/inserts
for f in out/v[0-9][0-9]-*.mp4; do
  [[ -e "$f" ]] || continue
  name="candidus-$(basename "$f")"
  mv "$f" "out/final/$name"
  # capa sugerida: quadro do gancho (2 s), já com o título montado
  ffmpeg -v error -y -ss 2.2 -i "out/final/$name" -frames:v 1 -q:v 2 "out/final/capas/${name%.mp4}.jpg"
  echo "ok: out/final/$name"
done
if [[ "${1:-}" == "--inserts" ]]; then
  for c in $(npx remotion compositions 2>/dev/null | awk '$1 ~ /^INS-/ {print $1}'); do
    bash scripts/render-chunks.sh "$c" "out/inserts/${c,,}.mp4" '{"captions":false}'
  done
fi
