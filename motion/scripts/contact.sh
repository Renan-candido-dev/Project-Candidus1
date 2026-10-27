#!/usr/bin/env bash
# Gera uma folha de contato (quadros lado a lado) para revisar uma composição.
# Uso: scripts/contact.sh <composição> <saida.png> <frame> [frame...]
set -euo pipefail
cd "$(dirname "$0")/.."
COMP="$1"; OUT="$2"; shift 2
TMP=out/frames/$COMP; mkdir -p "$TMP"
args=()
for fr in "$@"; do
  npx remotion still "$COMP" "$TMP/$fr.png" --frame="$fr" --scale=0.4 --log=error >/dev/null
  args+=(-i "$TMP/$fr.png")
done
if [[ $# -eq 1 ]]; then cp "$TMP/$1.png" "$OUT"; else ffmpeg -v error -y "${args[@]}" -filter_complex "hstack=$#" "$OUT"; fi
echo "$OUT"
