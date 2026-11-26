#!/usr/bin/env bash
# Prepara um vídeo da série: narração → tempos → trilha. Opcional: renderiza.
# Uso: scripts/build-video.sh v03 [--render]
# Requer o modelo Piper pt_BR-faber-medium em $PIPER_MODEL (pasta).
set -euo pipefail
cd "$(dirname "$0")/.."
ID="$1"
PIPER_MODEL="${PIPER_MODEL:?defina PIPER_MODEL com a pasta do modelo pt_BR-faber-medium}"
npx tsx scripts/series.ts lines "$ID"
python3 scripts/gen_series_voice.py "$ID" "$PIPER_MODEL"
npx tsx scripts/series.ts layout "$ID"
python3 scripts/gen_series_music.py "$ID"
if [[ "${2:-}" == "--render" ]]; then
  COMP=$(npx tsx scripts/series.ts list "$ID" | cut -f2)
  bash scripts/render-chunks.sh "$COMP" "out/${COMP,,}.mp4"
fi
