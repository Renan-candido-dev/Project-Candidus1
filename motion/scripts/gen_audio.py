"""Gera a trilha (música original sintetizada) e os efeitos sonoros do vídeo.

Tudo é sintetizado aqui, sem samples de terceiros, então não há questões de licença.
Uso: python3 scripts/gen_audio.py   (requer numpy e scipy)

As seções da música seguem a timeline de src/timeline.ts (em segundos):
  0–5    gancho     pulso de tensão, "relógio"
  5–11   problema   escuro, grave, tensão (abafa a partir de 7,9s: "no escuro")
  11     impacto    a luz acende
  11–23.5 solução/benefícios  groove leve, acordes maiores
  23.5–32.5 encerramento      pad aberto, acorde final no logo (28,3s)
"""
from pathlib import Path

import numpy as np
from scipy.signal import butter, fftconvolve, sosfilt
from scipy.io import wavfile

SR = 48000
TOTAL = 32.5
OUT = Path(__file__).resolve().parent.parent / "public"
rng = np.random.default_rng(7)


def t_axis(sec):
    return np.arange(int(sec * SR)) / SR


def note(n):
    """Nota MIDI -> Hz."""
    return 440.0 * 2 ** ((n - 69) / 12)


def lp(x, f, order=2):
    return sosfilt(butter(order, f, "low", fs=SR, output="sos"), x)


def hp(x, f, order=2):
    return sosfilt(butter(order, f, "high", fs=SR, output="sos"), x)


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], "band", fs=SR, output="sos"), x)


def place(buf, x, at, gain=1.0):
    i = int(at * SR)
    if i >= len(buf):
        return
    n = min(len(x), len(buf) - i)
    buf[i:i + n] += x[:n] * gain


def reverb(x, seconds=2.2, mix=0.25, tone=6000):
    t = t_axis(seconds)
    ir = rng.standard_normal(len(t)) * np.exp(-t * 6.5 / seconds)
    ir = lp(ir, tone)
    ir /= np.sqrt(np.sum(ir ** 2))
    wet = fftconvolve(x, ir)[: len(x)]
    return x * (1 - mix) + wet * mix


def norm(x, peak=0.9):
    m = np.max(np.abs(x)) or 1.0
    return x / m * peak


def fade(x, a=0.005, r=0.02):
    n = len(x)
    env = np.ones(n)
    na, nr = int(a * SR), int(r * SR)
    if na:
        env[:na] = np.linspace(0, 1, na)
    if nr:
        env[-nr:] *= np.linspace(1, 0, nr)
    return x * env


# ---------------------------------------------------------------- instrumentos
def kick(dur=0.45, f0=125, f1=42):
    t = t_axis(dur)
    f = f1 + (f0 - f1) * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t * 7)
    click = hp(rng.standard_normal(len(t)), 2500) * np.exp(-t * 180) * 0.25
    return fade(body + click)


def clap(dur=0.22):
    t = t_axis(dur)
    n = bp(rng.standard_normal(len(t)), 900, 5200)
    env = np.exp(-t * 22)
    for d in (0.0, 0.011, 0.022):  # três "palmas" juntas
        env += np.where(t >= d, np.exp(-(t - d) * 160), 0) * 0.6
    return fade(n * env * 0.5)


def hat(dur=0.06, bright=9000):
    t = t_axis(dur)
    return fade(hp(rng.standard_normal(len(t)), bright) * np.exp(-t * 70) * 0.35)


def pluck(freq, dur=0.6, bright=1.0):
    t = t_axis(dur)
    x = np.zeros_like(t)
    for k in range(1, 9):
        x += np.sin(2 * np.pi * freq * k * t) / k ** 1.3 * np.exp(-t * (4 + k * 2.2 / bright))
    return fade(x * 0.5, 0.002, 0.05)


def saw(freq, t):
    return 2 * ((freq * t) % 1.0) - 1


def pad(freqs, dur, cutoff=1800, attack=0.6, release=0.8):
    t = t_axis(dur)
    x = np.zeros_like(t)
    for f in freqs:
        for det in (-0.12, 0.0, 0.13):
            x += saw(f * 2 ** (det / 12), t + rng.random())
    x = lp(x / (len(freqs) * 3), cutoff, 2)
    env = np.minimum(1, t / attack) * np.minimum(1, (dur - t) / release).clip(0, 1)
    return x * env


def sub(freq, dur):
    t = t_axis(dur)
    env = np.minimum(1, t / 0.02) * np.minimum(1, (dur - t) / 0.08).clip(0, 1)
    return np.sin(2 * np.pi * freq * t) * env


def bell(freq, dur=2.5):
    t = t_axis(dur)
    x = np.zeros_like(t)
    for ratio, amp, dec in ((1, 1, 1.6), (2.76, 0.45, 3.5), (5.4, 0.25, 6), (8.93, 0.12, 9)):
        x += amp * np.sin(2 * np.pi * freq * ratio * t) * np.exp(-t * dec)
    return fade(x * 0.35, 0.002, 0.2)


# ---------------------------------------------------------------- música
def build_music():
    music = np.zeros(int(TOTAL * SR) + SR)
    drums = np.zeros_like(music)
    bpm = 120
    beat = 60 / bpm
    s16 = beat / 4

    # A) Gancho 0–5s: pulso de semicolcheias (relógio) + pluck em Lá menor
    arp_a = [57, 60, 64, 67, 64, 60, 64, 69]
    for i in range(int(5 / s16)):
        tt = i * s16
        place(drums, hat(0.03, 10000), tt, 0.25 + 0.15 * (i % 4 == 0) + 0.1 * tt / 5)
        if i % 2 == 0:
            place(music, pluck(note(arp_a[(i // 2) % 8] + 12), 0.35, 0.8), tt, 0.16 + 0.06 * tt / 5)
    place(music, pad([note(45), note(52), note(57), note(60)], 5.3, 900, 1.5, 0.6), 0, 0.5)
    place(music, sub(note(33), 5.0), 0, 0.22)

    # B) Problema 5–11s: batida de "coração", acorde dissonante, abafado no escuro
    prob = np.zeros_like(music)
    for i in range(int(6 / beat)):
        tt = 5 + i * beat
        place(prob, kick(0.4, 90, 38), tt, 0.7)
        place(prob, kick(0.3, 80, 36), tt + 0.18, 0.35)  # tum-tum
    place(prob, pad([note(41), note(48), note(53), note(54)], 6.2, 700, 0.4, 1.2), 5, 0.6)
    for i in range(int(6 / s16)):
        tt = 5 + i * s16
        if i % 2 == 0:
            place(prob, hat(0.025, 11000), tt, 0.18)
    for i, n in enumerate([65, 64, 65, 66, 65, 64]):
        place(prob, pluck(note(n), 0.5, 0.6), 5 + i * 0.5, 0.12)
    # "luz apagando": a partir de 7,9s tudo vai sendo abafado
    split = int(7.9 * SR)
    dark = lp(prob, 420, 4)
    xf = np.clip((np.arange(len(prob)) - split) / (0.5 * SR), 0, 1)
    prob = prob * (1 - xf) + dark * xf * 1.4
    music += prob
    # riser 9,4–11s
    t = t_axis(1.6)
    rise = bp(rng.standard_normal(len(t)), 600, 7000) * (t / 1.6) ** 2.2
    rise += np.sin(2 * np.pi * np.cumsum(200 + 900 * (t / 1.6) ** 2) / SR) * (t / 1.6) ** 2 * 0.25
    place(music, fade(rise, 0.01, 0.01), 9.4, 0.35)

    # Impacto em 11s
    place(drums, kick(1.2, 140, 34), 11.0, 1.0)
    place(music, bell(note(84), 3), 11.0, 0.35)
    place(music, bell(note(79), 3), 11.03, 0.25)

    # C) Solução e benefícios 11–23,5s: groove leve em Dó maior
    prog = [[48, 55, 60, 64], [45, 52, 57, 60], [41, 48, 53, 57], [43, 50, 55, 59]]  # C Am F G
    bar = beat * 4
    start = 11.0
    nbars = int((23.5 - start) / bar)  # 6 compassos: 11 s a 23 s
    for b in range(nbars):
        t0 = start + b * bar
        ch = prog[b % 4]
        place(music, pad([note(n + 12) for n in ch], bar + 0.6, 2200, 0.25, 0.5), t0, 0.35)
        for k in range(4):
            place(music, sub(note(ch[0] - 12), beat * 0.9), t0 + k * beat, 0.28)
        arp = [ch[1] + 12, ch[2] + 12, ch[3] + 12, ch[2] + 24]
        for k in range(16):
            if k % 2 == 0 or k in (7, 13):
                place(music, pluck(note(arp[k % 4]), 0.4, 1.2), t0 + k * s16, 0.14)
        for k in range(4):
            place(drums, kick(), t0 + k * beat, 0.85)
            place(drums, hat(0.05, 8500), t0 + k * beat + beat / 2, 0.45)
            if k in (1, 3):
                place(drums, clap(), t0 + k * beat, 0.45)
        for k in range(16):
            place(drums, hat(0.02, 12000), t0 + k * s16, 0.12)

    # D) Encerramento 23,5–32,5s: respiro, pad aberto e acorde final no logo
    place(music, pad([note(n) for n in (53, 57, 60, 64, 67)], 5.2, 2600, 0.3, 1.2), 23.5, 0.4)
    place(music, sub(note(29), 4.6), 23.5, 0.25)
    for k in range(9):
        if k % 2 == 0:
            place(drums, kick(0.5, 110, 40), 23.5 + k * beat, 0.45)
        place(drums, hat(0.05, 9000), 23.5 + k * beat + beat / 2, 0.25)
    for i, n in enumerate([72, 76, 79, 84, 79, 76, 72, 76]):
        place(music, pluck(note(n), 0.6, 1.4), 23.5 + i * beat * 0.5, 0.1)
    # acorde final (Dó maior com 9ª) no logo
    place(music, pad([note(n) for n in (48, 55, 60, 64, 67, 74)], 4.4, 3200, 0.05, 2.5), 28.3, 0.5)
    place(music, sub(note(36), 3.5), 28.3, 0.3)
    place(drums, kick(1.0, 130, 36), 28.3, 0.9)
    for i, n in enumerate([84, 88, 91, 96]):
        place(music, bell(note(n), 3.2), 28.3 + i * 0.09, 0.22)

    mix = reverb(music, 2.4, 0.28) + reverb(drums, 0.8, 0.08)
    mix = mix[: int(TOTAL * SR)]
    # limitador suave: trilha mais densa sem estourar nos impactos
    mix = norm(mix, 1.0)
    mix = np.tanh(2.2 * mix) / np.tanh(2.2)
    # fade-out final
    n = int(1.6 * SR)
    mix[-n:] *= np.linspace(1, 0, n) ** 1.5
    return norm(mix, 0.8)


# ---------------------------------------------------------------- efeitos
def whoosh(dur=0.55, lo=300, hi=6000, up=True):
    t = t_axis(dur)
    noise = rng.standard_normal(len(t))
    # banco de passa-faixas com centro varrendo no tempo
    out = np.zeros_like(t)
    steps = 24
    centers = np.geomspace(lo, hi, steps) if up else np.geomspace(hi, lo, steps)
    seg = len(t) // steps
    for i, c in enumerate(centers):
        a, b = i * seg, (i + 1) * seg if i < steps - 1 else len(t)
        out[a:b] = bp(noise, c * 0.7, min(c * 1.4, SR / 2 - 100))[a:b]
    env = np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 1.6
    return fade(lp(out * env, 9000), 0.002, 0.03)


def pop(f0=900, f1=420, dur=0.09):
    t = t_axis(dur)
    f = f1 + (f0 - f1) * np.exp(-t * 60)
    return fade(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 40))


def click():
    t = t_axis(0.04)
    x = np.sin(2 * np.pi * 2400 * t) * np.exp(-t * 260) + hp(rng.standard_normal(len(t)), 3000) * np.exp(-t * 400) * 0.4
    return fade(x)


def ping(f=1318.5):
    return bell(f, 0.6) * 0.8 + bell(f * 1.5, 0.6) * 0.4


def tick():
    t = t_axis(0.025)
    return fade(hp(rng.standard_normal(len(t)), 4000) * np.exp(-t * 300))


def boom():
    t = t_axis(1.6)
    x = np.sin(2 * np.pi * np.cumsum(30 + 60 * np.exp(-t * 6)) / SR) * np.exp(-t * 2.5)
    x += lp(rng.standard_normal(len(t)), 900) * np.exp(-t * 6) * 0.4
    return fade(x)


def error_bonk():
    t = t_axis(0.25)
    return fade((np.sin(2 * np.pi * 180 * t) + 0.5 * np.sin(2 * np.pi * 191 * t)) * np.exp(-t * 16))


def dissolve():
    t = t_axis(1.0)
    x = hp(rng.standard_normal(len(t)), 5000) * (np.exp(-t * 3) * (0.5 + 0.5 * np.sin(2 * np.pi * 30 * t) ** 2))
    return fade(reverb(x, 1.0, 0.4))


def chime():
    out = np.zeros(int(2.4 * SR))
    for i, n in enumerate([76, 79, 84, 88]):
        place(out, bell(note(n), 2.0), i * 0.07, 0.6)
    return reverb(out, 1.8, 0.3)


def main():
    OUT.mkdir(exist_ok=True)
    (OUT / "sfx").mkdir(exist_ok=True)

    def save(path, x):
        wavfile.write(path, SR, (norm(x, 0.9) * 32767).astype(np.int16))

    save(OUT / "music.wav", build_music())
    sfx = {
        "whoosh": whoosh(),
        "whoosh-down": whoosh(0.6, 5000, 250, up=False),
        "swish": whoosh(0.3, 1200, 9000),
        "pop": pop(),
        "pop-high": pop(1500, 800, 0.07),
        "click": click(),
        "ping": ping(),
        "ping-low": ping(987.8),
        "tick": tick(),
        "boom": boom(),
        "error": error_bonk(),
        "dissolve": dissolve(),
        "chime": chime(),
    }
    for name, x in sfx.items():
        save(OUT / "sfx" / f"{name}.wav", x)
    print("ok:", ", ".join(sfx))


if __name__ == "__main__":
    main()
