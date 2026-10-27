#!/usr/bin/env bash
# Render robusto em blocos de frames (com nova tentativa por bloco), útil em máquinas
# onde o Chrome headless congela abas em renders longos. Junta vídeo + áudio no final
# e converte para yuv420p (faixa de TV), o padrão que Instagram/TikTok/Shorts esperam.
# Uso: scripts/render-chunks.sh <composição> <saida.mp4> [props-json]
set -euo pipefail
cd "$(dirname "$0")/.."
COMP="${1:-V01-sua-empresa-vende}"
OUT="${2:-out/${COMP,,}.mp4}"
PROPS="${3:-{\"captions\":true\}}"
TOTAL=$(npx remotion compositions 2>/dev/null | awk -v c="$COMP" '$1==c {print $4}')
[[ -z "$TOTAL" ]] && { echo "composição não encontrada: $COMP"; exit 1; }
STEP=125
TMP="out/chunks/$COMP"
rm -rf "$TMP" && mkdir -p "$TMP"
# empacota uma vez: todos os blocos usam exatamente a mesma versão do código
npx remotion bundle --out-dir="$TMP/bundle" --log=error >/dev/null
SRC="$TMP/bundle"
: > "$TMP/list.txt"
for ((s = 0; s < TOTAL; s += STEP)); do
  e=$((s + STEP - 1)); ((e >= TOTAL)) && e=$((TOTAL - 1))
  f="$TMP/c_$(printf %04d "$s").mp4"
  for try in 1 2 3; do
    if npx remotion render "$SRC" "$COMP" "$f" --frames="$s-$e" --codec=h264 --crf=16 --muted --concurrency=3 --props="$PROPS" --log=error; then break; fi
    echo "bloco $s-$e falhou (tentativa $try)"; [[ $try == 3 ]] && exit 1
  done
  echo "file 'c_$(printf %04d "$s").mp4'" >> "$TMP/list.txt"
done
npx remotion render "$SRC" "$COMP" "$TMP/audio.wav" --codec=wav --props="$PROPS" --log=error
ffmpeg -y -v error -f concat -safe 0 -i "$TMP/list.txt" -c copy "$TMP/video.mp4"
ffmpeg -y -v error -i "$TMP/video.mp4" -i "$TMP/audio.wav" -map 0:v -map 1:a \
  -vf "scale=in_range=full:out_range=tv,format=yuv420p" -c:v libx264 -preset slow -crf 17 \
  -profile:v high -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -af "loudnorm=I=-14:TP=-1.5:LRA=11" -ar 48000 -c:a aac -b:a 256k -shortest -movflags +faststart "$OUT"
rm -rf "$TMP"
echo "ok: $OUT"
