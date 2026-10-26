#!/usr/bin/env bash
# Renderiza vários vídeos em sequência. Uso: scripts/render-queue.sh V03-tres-sinais V04-... 
cd "$(dirname "$0")/.."
for c in "$@"; do
  echo "== $c $(date +%T)"
  bash scripts/render-chunks.sh "$c" "out/${c,,}.mp4" || echo "FALHOU: $c"
done
echo "== fim $(date +%T)"
