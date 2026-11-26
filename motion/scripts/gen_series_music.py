"""Trilha original de cada vídeo da série, composta a partir da timeline.

Uso: python3 scripts/gen_series_music.py <id>
Lê public/<id>/layout.json (npx tsx scripts/series.ts layout <id>) e grava public/<id>/music.wav.
Cada cena tem um "clima" (tension, neutral, bright, outro); a trilha troca de camadas
nesses pontos, mantendo a mesma grade de compassos. Andamento, tom e semente variam por
vídeo para que a série não soe repetida.
"""
import json
import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))
from gen_audio import SR, bell, clap, hat, kick, lp, note, norm, pad, place, pluck, reverb, sub, bp  # noqa: E402
import gen_audio  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent

# progressões (semitons relativos à tônica)
MINOR = [[0, 3, 7], [0, 3, 7], [-4, 0, 3], [-2, 2, 5]]  # i i VI VII
MAJOR = [[0, 4, 7], [7, 11, 14], [9, 12, 16], [5, 9, 12]]  # I V vi IV


def main():
    vid = sys.argv[1]
    data = json.loads((ROOT / "public" / vid / "layout.json").read_text())
    bpm, root, seed = data["music"]["bpm"], data["music"]["root"], data["music"]["seed"]
    gen_audio.rng = np.random.default_rng(seed)
    total = data["seconds"]
    segs = data["segments"]
    n = int((total + 2) * SR)
    music = np.zeros(n)
    drums = np.zeros(n)
    beat = 60 / bpm
    bar = beat * 4
    s16 = beat / 4
    rng = np.random.default_rng(seed)
    arp_shape = rng.permutation([0, 1, 2, 1, 2, 0, 2, 1])

    def mood_at(t):
        for s in segs:
            if s["start"] <= t < s["end"]:
                return s["mood"]
        return segs[-1]["mood"]

    nbars = int(total / bar) + 2
    for b in range(nbars):
        t0 = b * bar
        if t0 >= total:
            break
        m = mood_at(t0 + 0.01)
        if m == "tension":
            ch = [root - 12 + x for x in MINOR[b % 4]]
            place(music, pad([note(x + 12) for x in ch], bar + 0.5, 900, 0.4, 0.4), t0, 0.32)
            place(music, sub(note(ch[0] - 12), bar * 0.95), t0, 0.2)
        elif m in ("bright", "neutral"):
            ch = [root - 9 + x for x in MAJOR[b % 4]]  # relativo maior
            place(music, pad([note(x + 12) for x in ch], bar + 0.5, 2200 if m == "bright" else 1500, 0.25, 0.5), t0, 0.3)
        else:  # outro
            ch = [root - 9 + x for x in MAJOR[(b // 2) % 4]]
            place(music, pad([note(x + 12) for x in ch + [ch[0] + 12]], bar + 0.8, 2600, 0.3, 0.8), t0, 0.32)
        for k in range(16):
            t = t0 + k * s16
            if t >= total:
                break
            m = mood_at(t)
            if m == "tension":
                if k % 4 == 0:
                    place(drums, kick(0.4, 92, 38), t, 0.62)
                if k % 4 == 3 and k // 4 in (0, 2):
                    place(drums, kick(0.3, 82, 36), t, 0.3)
                place(drums, hat(0.025, 11000), t, 0.12 + 0.06 * (k % 4 == 0))
                if k % 4 == 2:
                    nn = ch[arp_shape[(b * 4 + k // 4) % 8]] + 24
                    place(music, pluck(note(nn), 0.4, 0.7), t, 0.1)
            elif m == "neutral":
                if k in (0, 8):
                    place(drums, kick(0.45, 115, 42), t, 0.6)
                if k % 4 == 2:
                    place(drums, hat(0.05, 9000), t, 0.3)
                if k % 2 == 0:
                    nn = ch[arp_shape[(k // 2) % 8]] + 24
                    place(music, pluck(note(nn), 0.4, 1.0), t, 0.1)
            elif m == "bright":
                if k % 4 == 0:
                    place(drums, kick(), t, 0.8)
                    place(music, sub(note(ch[0] - 12), beat * 0.9), t, 0.24)
                if k in (4, 12):
                    place(drums, clap(), t, 0.4)
                if k % 4 == 2:
                    place(drums, hat(0.05, 8500), t, 0.4)
                place(drums, hat(0.02, 12000), t, 0.1)
                if k % 2 == 0 or k in (7, 13):
                    nn = ch[arp_shape[k % 8]] + 24
                    place(music, pluck(note(nn), 0.4, 1.2), t, 0.13)
            else:  # outro: meio-tempo
                if k == 0 and b % 2 == 0:
                    place(drums, kick(0.5, 110, 40), t, 0.45)
                if k % 8 == 4:
                    place(drums, hat(0.05, 9000), t, 0.2)

    # riser antes da primeira virada para o "claro"
    prev = None
    for s in segs:
        if prev == "tension" and s["mood"] in ("bright", "neutral") and s["start"] > 1.6:
            tt = np.arange(int(1.4 * SR)) / SR
            rise = bp(gen_audio.rng.standard_normal(len(tt)), 600, 7000) * (tt / 1.4) ** 2.2
            place(music, rise, s["start"] - 1.4, 0.3)
            place(drums, kick(1.0, 140, 34), s["start"], 0.8)
            place(music, bell(note(root + 24), 2.5), s["start"], 0.25)
        prev = s["mood"]
    for a in data["accents"]:
        if a["kind"] == "impact":
            place(drums, kick(1.2, 140, 34), a["t"], 0.9)
        if a["kind"] == "logo":
            ch = [root - 9 + x for x in (0, 7, 12, 16, 19, 26)]
            place(music, pad([note(x) for x in ch], max(2.5, total - a["t"] + 0.5), 3200, 0.05, 2.0), a["t"], 0.45)
            place(music, sub(note(root - 21), 3.0), a["t"], 0.28)
            place(drums, kick(1.0, 130, 36), a["t"], 0.8)
            for i, nn in enumerate([24, 28, 31, 36]):
                place(music, bell(note(root - 9 + nn + 12), 3.0), a["t"] + i * 0.09, 0.2)

    mix = reverb(music, 2.3, 0.28) + reverb(drums, 0.8, 0.08)
    mix = mix[: int(total * SR)]
    mix = norm(mix, 1.0)
    mix = np.tanh(2.2 * mix) / np.tanh(2.2)
    fo = int(1.2 * SR)
    mix[-fo:] *= np.linspace(1, 0, fo) ** 1.5
    from scipy.io import wavfile

    wavfile.write(ROOT / "public" / vid / "music.wav", SR, (norm(mix, 0.9) * 32767).astype(np.int16))
    print(f"{vid}: trilha {total:.1f}s, {bpm} bpm")


if __name__ == "__main__":
    main()
