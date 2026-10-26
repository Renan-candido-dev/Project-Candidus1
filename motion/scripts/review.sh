#!/usr/bin/env bash
# Folha de revisão automática: 8 quadros distribuídos pelo vídeo (meio de cada cena + fim).
# Uso: scripts/review.sh v07
set -euo pipefail
cd "$(dirname "$0")/.."
ID="$1"
COMP=$(npx tsx scripts/series.ts list "$ID" | cut -f2)
FR=$(python3 -c "
import json
d=json.load(open('public/$ID/layout.json'))['layout']
fr=[]
for b in d['beats']:
    fr += [b['from']+int(b['dur']*0.45), b['from']+b['dur']-14]
print(' '.join(str(x) for x in (fr[:8] + [d['total'] - 5])))")
bash scripts/contact.sh "$COMP" "out/review-$ID.png" $FR
