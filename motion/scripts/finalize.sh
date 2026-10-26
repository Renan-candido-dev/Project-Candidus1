#!/usr/bin/env bash
# Normaliza a loudness (-14 LUFS, padrão de Reels/TikTok/Shorts) e prepara o MP4 para streaming.
# Uso: scripts/finalize.sh out/candidus-reel-01-raw.mp4 out/candidus-reel-01.mp4
set -euo pipefail
in="${1:-out/candidus-reel-01-raw.mp4}"
out="${2:-out/candidus-reel-01.mp4}"
ffmpeg -y -v error -i "$in" -c:v copy \
  -af "loudnorm=I=-14:TP=-1.5:LRA=11" -ar 48000 -c:a aac -b:a 256k \
  -movflags +faststart "$out"
echo "ok: $out"
