"""Gera a narração (pt-BR) com Piper TTS, frase a frase, e grava as durações.

Uso: python3 scripts/gen_voice.py <pasta-do-modelo-piper>
Modelo usado: pt_BR-faber-medium (https://github.com/k2-fsa/sherpa-onnx/releases/tag/tts-models)
"""
import json, subprocess, sys, wave
from pathlib import Path

LINES = [
    "Você vende, trabalha o mês inteiro e, quando vai olhar o caixa, não sabe para onde o dinheiro foi?",
    "O problema pode não ser vender pouco.",
    "Pode ser não ter controle financeiro.",
    "A Cândidus organiza suas contas, acompanha seu fluxo de caixa,",
    "e transforma números em informações para você tomar decisões melhores.",
    "Você cuida do seu negócio.",
    "Nós ajudamos a cuidar dos números.",
]

model_dir = Path(sys.argv[1])
onnx = next(model_dir.glob("*.onnx"))
out = Path(__file__).resolve().parent.parent / "public" / "voice"
out.mkdir(parents=True, exist_ok=True)
meta = []
for i, text in enumerate(LINES):
    wav = out / f"line{i + 1}.wav"
    subprocess.run(
        [sys.executable, "-m", "piper", "-m", str(onnx), "-f", str(wav),
         "--length-scale", "1.12", "--noise-scale", "0.6", "--noise-w-scale", "0.7",
         "--sentence-silence", "0"],
        input=text.encode(), check=True, capture_output=True)
    # Tratamento: limpa graves, dá presença, comprime e converte para 48 kHz.
    tmp = wav.with_suffix(".raw.wav")
    wav.rename(tmp)
    subprocess.run(
        ["ffmpeg", "-y", "-v", "error", "-i", str(tmp), "-af",
         "highpass=f=75,equalizer=f=200:t=q:w=1:g=1.5,equalizer=f=3200:t=q:w=1.2:g=3,"
         "equalizer=f=7500:t=q:w=2:g=-2,acompressor=threshold=-21dB:ratio=3:attack=4:release=90:makeup=3,"
         "aresample=48000", "-ac", "1", str(wav)], check=True)
    tmp.unlink()
    with wave.open(str(wav)) as w:
        meta.append({"file": f"voice/{wav.name}", "text": text, "seconds": w.getnframes() / w.getframerate()})
    print(f"{wav.name}: {meta[-1]['seconds']:.2f}s")
(out / "lines.json").write_text(json.dumps(meta, ensure_ascii=False, indent=2))
