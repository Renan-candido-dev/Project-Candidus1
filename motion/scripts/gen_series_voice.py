"""Gera a narração de um vídeo da série com Piper TTS (pt-BR, offline).

Uso: python3 scripts/gen_series_voice.py <id> <pasta-do-modelo-piper>
Lê build/<id>.lines.json (gerado por `npx tsx scripts/series.ts lines <id>`) e grava
public/<id>/voice/lNN.wav + public/<id>/voice.json com a duração de cada fala.
Frases que não mudaram não são regeradas (o hash do texto fica no voice.json).
"""
import hashlib
import json
import subprocess
import sys
from pathlib import Path

import numpy as np
from scipy.io import wavfile

ROOT = Path(__file__).resolve().parent.parent
FILTER = (
    "highpass=f=75,equalizer=f=200:t=q:w=1:g=1.5,equalizer=f=3200:t=q:w=1.2:g=3,"
    "equalizer=f=7500:t=q:w=2:g=-2,acompressor=threshold=-21dB:ratio=3:attack=4:release=90:makeup=3,"
    "aresample=48000"
)


def speech_seconds(path: Path) -> tuple[float, float]:
    sr, x = wavfile.read(path)
    x = x.astype(np.float32)
    if x.ndim > 1:
        x = x.mean(axis=1)
    x /= max(1.0, np.abs(x).max())
    env = np.abs(x)
    thr = 10 ** (-38 / 20)
    idx = np.nonzero(env > thr)[0]
    end = (idx[-1] + 1) / sr if len(idx) else len(x) / sr
    return len(x) / sr, end


def main():
    vid, model_dir = sys.argv[1], Path(sys.argv[2])
    onnx = next(model_dir.glob("*.onnx"))
    lines = json.loads((ROOT / "build" / f"{vid}.lines.json").read_text())
    out_dir = ROOT / "public" / vid / "voice"
    out_dir.mkdir(parents=True, exist_ok=True)
    meta_path = ROOT / "public" / vid / "voice.json"
    old = {m["file"]: m for m in json.loads(meta_path.read_text())} if meta_path.exists() else {}
    meta = []
    for ln in lines:
        wav = ROOT / "public" / ln["file"]
        h = hashlib.sha1(ln["spoken"].encode()).hexdigest()[:12]
        if wav.exists() and old.get(ln["file"], {}).get("hash") == h:
            meta.append(old[ln["file"]])
            continue
        raw = wav.with_suffix(".raw.wav")
        subprocess.run(
            [sys.executable, "-m", "piper", "-m", str(onnx), "-f", str(raw),
             "--length-scale", "1.1", "--noise-scale", "0.6", "--noise-w-scale", "0.7", "--sentence-silence", "0.12"],
            input=ln["spoken"].encode(), check=True, capture_output=True)
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(raw), "-af", FILTER, "-ac", "1", str(wav)], check=True)
        raw.unlink()
        total, speech = speech_seconds(wav)
        meta.append({"file": ln["file"], "seconds": round(total, 3), "speech": round(speech, 3), "text": ln["text"], "hash": h})
        print(f"{ln['file']}: {speech:.2f}s  {ln['text']}")
    meta_path.write_text(json.dumps(meta, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
