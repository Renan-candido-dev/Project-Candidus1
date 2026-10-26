#!/usr/bin/env bash
# Render robusto em blocos de frames (com nova tentativa por bloco), útil em máquinas
# onde o Chrome headless congela abas em renders longos. Junta vídeo + áudio no final.
# Uso: scripts/render-chunks.sh [saida.mp4] [props-json]
set -euo pipefail
cd "$(dirname "$0")/.."
OUT="${1:-out/candidus-reel-01.mp4}"
PROPS="${2:-{\"captions\":true\}}"
COMP=CandidusReel01
TOTAL=975
STEP=125
TMP=out/chunks
rm -rf "$TMP" && mkdir -p "$TMP"
: > "$TMP/list.txt"
for ((s = 0; s < TOTAL; s += STEP)); do
  e=$((s + STEP - 1)); ((e >= TOTAL)) && e=$((TOTAL - 1))
  f="$TMP/c_$(printf %04d "$s").mp4"
  for try in 1 2 3; do
    if npx remotion render "$COMP" "$f" --frames="$s-$e" --codec=h264 --crf=16 --pixel-format=yuv420p --muted --concurrency=3 --props="$PROPS" --log=error; then break; fi
    echo "bloco $s-$e falhou (tentativa $try)"; [[ $try == 3 ]] && exit 1
  done
  echo "file 'c_$(printf %04d "$s").mp4'" >> "$TMP/list.txt"
done
npx remotion render "$COMP" "$TMP/audio.wav" --codec=wav --props="$PROPS" --log=error
ffmpeg -y -v error -f concat -safe 0 -i "$TMP/list.txt" -c copy "$TMP/video.mp4"
ffmpeg -y -v error -i "$TMP/video.mp4" -i "$TMP/audio.wav" -map 0:v -map 1:a -c:v copy \
  -af "loudnorm=I=-14:TP=-1.5:LRA=11" -ar 48000 -c:a aac -b:a 256k -shortest -movflags +faststart "$OUT"
echo "ok: $OUT"
