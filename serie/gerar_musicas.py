#!/usr/bin/env python3
"""Gera as trilhas (originais, sem direitos autorais) e efeitos da série, todas a 120 BPM.
   audio/trilha-energia.mp3      batida eletrônica (house)
   audio/trilha-corporativa.mp3  piano + sinos + palmas (comercial)
   audio/trilha-lofi.mp3         lo-fi calmo (educativo)
   audio/sfx-whoosh.mp3, audio/sfx-logo.mp3
Uso: python3 gerar_musicas.py      (requer numpy e ffmpeg)"""
import os, sys
import numpy as np
AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(AQUI, '..', 'videos'))
import gerar_audio as g                                   # reaproveita síntese da pasta videos/

g.AUDIO = os.path.join(AQUI, 'audio'); os.makedirs(g.AUDIO, exist_ok=True)
SR = g.SR


def lofi(segundos=60, bpm=120, seed=11):
    """lo-fi em meio-tempo: piano elétrico suave, baixo, bateria abafada e chiado de vinil"""
    rng = np.random.default_rng(seed)
    beat = 60 / bpm; bar = 4 * beat
    N = int(segundos * SR); L = np.zeros(N); R = np.zeros(N)

    def add(sig, t0, pan=0., ga=1.):
        i0 = int(t0 * SR)
        if i0 >= N: return
        sig = sig[:N - i0] * ga; L[i0:i0 + len(sig)] += sig * (1 - max(0, pan)); R[i0:i0 + len(sig)] += sig * (1 + min(0, pan))

    prog = [(41, [65, 69, 72, 76]), (40, [64, 67, 71, 74]), (38, [62, 65, 69, 72]), (36, [60, 64, 67, 71])]  # Fmaj7 Em7 Dm7 Cmaj7
    for b in range(int(segundos / bar) + 1):
        t0 = b * bar; root, ch = prog[b % 4]
        for k, off in enumerate((0, 1.5 * beat, 2.5 * beat)):       # piano elétrico em síncope
            n = int(1.6 * SR); t = np.arange(n) / SR; x = np.zeros(n)
            for j, m in enumerate(ch):
                f = g.nota(m) * (1 + (rng.random() - .5) * .002)
                x += (np.sin(2 * np.pi * f * t) + .25 * np.sin(4 * np.pi * f * t)) * np.exp(-t * 2.2)
            x *= g.env(n, .01, .3) * (1 + .15 * np.sin(2 * np.pi * 5 * t))  # leve tremolo
            add(x, t0 + off + rng.random() * .01, pan=(-.2, .2, 0)[k], ga=.035)
        n = int(bar * SR); t = np.arange(n) / SR
        add(np.sin(2 * np.pi * g.nota(root - 12) * t) * g.env(n, .02, .3) * np.exp(-t * .6), t0, ga=.16)
        tk = np.arange(int(.35 * SR)) / SR
        kick = np.sin(2 * np.pi * np.cumsum(50 + 60 * np.exp(-tk * 30)) / SR) * np.exp(-tk * 8)
        add(kick, t0, ga=.45); add(kick, t0 + 2.75 * beat, ga=.3)
        ts = np.arange(int(.25 * SR)) / SR
        snare = g.lowpass(rng.standard_normal(len(ts)), 2500) * np.exp(-ts * 18) + np.sin(2 * np.pi * 190 * ts) * np.exp(-ts * 30) * .5
        add(snare, t0 + 2 * beat, ga=.22)
        for k in range(8):                                                  # chimbal com swing
            th = np.arange(int(.04 * SR)) / SR; hat = np.diff(np.r_[0, rng.standard_normal(len(th))]) * np.exp(-th * 90)
            add(hat, t0 + k * beat / 2 + (.06 if k % 2 else 0), pan=.3, ga=.025)
    crackle = np.zeros(N); idx = rng.integers(0, N, N // 2500); crackle[idx] = rng.standard_normal(len(idx)) * .3
    L += crackle * .15; R += crackle * .15
    st = np.stack([L, R], 1); return np.tanh(st / (np.max(np.abs(st)) + 1e-9) * 1.1) * .9


if __name__ == '__main__':
    print('energia…');     g.salvar_mp3('trilha-energia', g.batida(60))
    print('corporativa…'); g.salvar_mp3('trilha-corporativa', g.comercial(60))
    print('lofi…');        g.salvar_mp3('trilha-lofi', lofi(60))
    fx = g.efeitos(); g.salvar_mp3('sfx-whoosh', fx['whoosh'] * .6)
    g.salvar_mp3('sfx-logo', g.efeitos_candidus()['logo'])
    print('ok ->', g.AUDIO)
