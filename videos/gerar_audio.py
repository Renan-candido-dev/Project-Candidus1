#!/usr/bin/env python3
"""Gera o áudio dos vídeos Candidus.

  1. Narração: lê roteiro.json e sintetiza uma fala por cena com Piper
     (voz neural pt-BR, roda offline). Saída: audio/v1/NN.wav, audio/v2/NN.wav
     e audio/duracoes.js (duração de cada fala, usada para ajustar as cenas).
  2. Trilha: compõe uma música de fundo original (sem direitos autorais),
     estilo corporativo/inspirador. Saída: audio/musica.mp3

Uso:   python3 gerar_audio.py [--voz faber|cadu|jeff] [--velocidade 0.95]
Requer: pip install piper-tts sherpa-onnx numpy   (o modelo de voz é baixado sozinho)
"""
import argparse, json, os, subprocess, sys, tarfile, urllib.request, wave
import numpy as np

ROOT = os.path.dirname(os.path.abspath(__file__))
AUDIO = os.path.join(ROOT, 'audio')
CACHE = os.path.join(ROOT, '.cache')
SR = 44100


# ---------------------------------------------------------------- narração
def modelo(voz):
    nome = f'vits-piper-pt_BR-{voz}-medium'
    onnx = os.path.join(CACHE, nome, f'pt_BR-{voz}-medium.onnx')
    if not os.path.exists(onnx):
        os.makedirs(CACHE, exist_ok=True)
        url = f'https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/{nome}.tar.bz2'
        arq = os.path.join(CACHE, nome + '.tar.bz2')
        print('Baixando voz', voz, '...')
        urllib.request.urlretrieve(url, arq)
        with tarfile.open(arq) as t:
            t.extractall(CACHE)
        os.remove(arq)
    return onnx


# vozes do modelo Kokoro (multilíngue) com sotaque pt-BR: nome -> id do locutor
KOKORO = {'dora': 42, 'alex': 43, 'santa': 44}
PIPER = ['faber', 'cadu', 'jeff']
_kokoro = None


def kokoro_tts():
    global _kokoro
    if _kokoro is None:
        import sherpa_onnx
        d = os.path.join(CACHE, 'kokoro-multi-lang-v1_0')
        if not os.path.exists(os.path.join(d, 'model.onnx')):
            os.makedirs(CACHE, exist_ok=True)
            arq = d + '.tar.bz2'
            print('Baixando modelo Kokoro (~350 MB)...')
            urllib.request.urlretrieve('https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/kokoro-multi-lang-v1_0.tar.bz2', arq)
            with tarfile.open(arq) as t:
                t.extractall(CACHE)
            os.remove(arq)
        k = sherpa_onnx.OfflineTtsKokoroModelConfig(
            model=d + '/model.onnx', voices=d + '/voices.bin', tokens=d + '/tokens.txt',
            data_dir=d + '/espeak-ng-data', lexicon=d + '/lexicon-us-en.txt', lang='pt-br')
        _kokoro = sherpa_onnx.OfflineTts(sherpa_onnx.OfflineTtsConfig(
            model=sherpa_onnx.OfflineTtsModelConfig(kokoro=k, num_threads=4)))
    return _kokoro


def sintetizar(voz, texto, out, velocidade):
    """gera um wav com a fala; velocidade < 1 = mais rápido"""
    if voz in KOKORO:
        a = kokoro_tts().generate(texto, sid=KOKORO[voz], speed=1 / velocidade)
        salvar(out, np.array(a.samples, dtype=np.float32), a.sample_rate)
    else:
        subprocess.run([piper_bin(), '-m', modelo(voz), '-f', out, '--length-scale', str(velocidade),
                        '--sentence-silence', '0.18'], input=texto.encode('utf-8'), check=True,
                       stderr=subprocess.DEVNULL)


def piper_bin():
    exe = os.path.join(os.path.dirname(sys.executable), 'piper')
    return exe if os.path.exists(exe) else 'piper'


def ler_wav(path):
    with wave.open(path) as w:
        sr, n = w.getframerate(), w.getnframes()
        x = np.frombuffer(w.readframes(n), dtype=np.int16).astype(np.float32) / 32768
    return x, sr


def aparar(x, sr, lim=0.01):
    """remove silêncio do começo/fim, deixando 40 ms de folga"""
    idx = np.where(np.abs(x) > lim)[0]
    if not len(idx):
        return x
    a = max(0, idx[0] - int(.04 * sr)); b = min(len(x), idx[-1] + int(.04 * sr))
    return x[a:b]


def salvar(path, x, sr, canais=1):
    x = np.clip(x, -1, 1)
    with wave.open(path, 'wb') as w:
        w.setnchannels(canais); w.setsampwidth(2); w.setframerate(sr)
        w.writeframes((x * 32767).astype(np.int16).tobytes())


def narracao(voz, velocidade):
    roteiro = json.load(open(os.path.join(ROOT, 'roteiro.json'), encoding='utf-8'))
    dur = {}
    for v in ('1', '2'):
        pasta = os.path.join(AUDIO, 'v' + v); os.makedirs(pasta, exist_ok=True)
        dur[v] = []
        for i, texto in enumerate(roteiro[v]):
            out = os.path.join(pasta, f'{i:02d}.wav')
            if not texto.strip():
                dur[v].append(0)
                if os.path.exists(out): os.remove(out)
                continue
            sintetizar(voz, texto, out, velocidade)
            x, sr = ler_wav(out)
            x = aparar(x, sr)
            x = x / (np.max(np.abs(x)) + 1e-9) * 0.9
            salvar(out, x, sr)
            dur[v].append(round(len(x) / sr, 3))
            print(f'  vídeo {v} · cena {i:02d} · {dur[v][-1]:.2f}s  {texto[:60]}')
    with open(os.path.join(AUDIO, 'duracoes.js'), 'w', encoding='utf-8') as f:
        f.write('/* gerado por gerar_audio.py — duração (s) da narração de cada cena */\n')
        f.write('const VO = ' + json.dumps(dur) + ';\n')


# ---------------------------------------------------------------- trilha
def nota(n):  # número MIDI -> Hz
    return 440.0 * 2 ** ((n - 69) / 12)


def env(n, a, r, sr=SR):
    e = np.ones(n)
    na, nr = min(n, int(a * sr)), min(n, int(r * sr))
    if na: e[:na] = np.linspace(0, 1, na)
    if nr: e[-nr:] *= np.linspace(1, 0, nr)
    return e


def musica(segundos=110, bpm=100, seed=7):
    rng = np.random.default_rng(seed)
    beat = 60 / bpm; bar = 4 * beat
    N = int(segundos * SR)
    L = np.zeros(N); R = np.zeros(N)

    def add(sig, t0, pan=0.0, ganho=1.0):
        i0 = int(t0 * SR)
        if i0 >= N: return
        sig = sig[:N - i0] * ganho
        L[i0:i0 + len(sig)] += sig * (1 - max(0, pan))
        R[i0:i0 + len(sig)] += sig * (1 + min(0, pan))

    # progressão I–V–vi–IV em Ré maior (inspiradora)
    acordes = [[62, 66, 69], [57, 61, 64], [59, 62, 66], [55, 59, 62]]  # D, A, Bm, G
    baixos = [38, 33, 35, 31]
    nbar = int(segundos / bar) + 1
    for b in range(nbar):
        t = b * bar
        ac = acordes[b % 4]; bx = baixos[b % 4]
        intro = b < 2
        # pad: senos com harmônicos e leve desafinação (chorus)
        n = int(bar * 1.15 * SR); tt = np.arange(n) / SR
        pad = np.zeros(n)
        for m in ac + [ac[0] + 12]:
            for dt in (-0.12, 0.12):
                f = nota(m + dt / 12 * 0)
                f2 = f * (1 + dt / 100)
                pad += np.sin(2 * np.pi * f2 * tt) + .35 * np.sin(4 * np.pi * f2 * tt) + .12 * np.sin(6 * np.pi * f2 * tt)
        pad *= env(n, .6, .7) * .028
        add(pad, t, pan=-.15); add(pad, t, pan=.15)
        if intro:
            continue
        # baixo em colcheias
        for k in range(8):
            n = int(beat / 2 * SR); tt = np.arange(n) / SR
            f = nota(bx)
            s = (np.sin(2 * np.pi * f * tt) + .3 * np.sin(4 * np.pi * f * tt)) * np.exp(-tt * 7) * env(n, .005, .03)
            add(s, t + k * beat / 2, ganho=.22 if k % 2 == 0 else .14)
        # arpejo "pluck" em semicolcheias
        seq = [ac[0] + 12, ac[1] + 12, ac[2] + 12, ac[1] + 12, ac[0] + 24, ac[2] + 12, ac[1] + 12, ac[2] + 12]
        for k in range(16):
            n = int(beat * SR * .9); tt = np.arange(n) / SR
            f = nota(seq[k % 8])
            s = (np.sin(2 * np.pi * f * tt) + .25 * np.sin(4 * np.pi * f * tt)) * np.exp(-tt * 9) * env(n, .003, .05)
            add(s, t + k * beat / 4, pan=.35 if k % 2 else -.35, ganho=.07 * (1.15 if k % 4 == 0 else 1))
        # bateria leve
        for k in range(4):
            n = int(.35 * SR); tt = np.arange(n) / SR
            fk = 45 + 80 * np.exp(-tt * 30)
            kick = np.sin(2 * np.pi * np.cumsum(fk) / SR) * np.exp(-tt * 9)
            add(kick, t + k * beat, ganho=.38)
            n = int(.06 * SR)
            hat = np.diff(rng.standard_normal(n + 1)) * np.exp(-np.arange(n) / SR * 70)
            add(hat, t + k * beat + beat / 2, pan=.25, ganho=.035)
            if k in (1, 3):  # palma suave
                n = int(.18 * SR)
                clap = np.diff(rng.standard_normal(n + 1)) * np.exp(-np.arange(n) / SR * 22)
                add(clap, t + k * beat, pan=-.1, ganho=.05)

    # reverb simples (atrasos com realimentação)
    for d, g in ((.031, .35), (.047, .3), (.071, .25), (.113, .2)):
        k = int(d * SR)
        for _ in range(3):
            L[k:] += L[:-k] * g * .5; R[k:] += R[:-k] * g * .5
    st = np.stack([L, R], axis=1)
    st = st / (np.max(np.abs(st)) + 1e-9) * .85
    os.makedirs(AUDIO, exist_ok=True)
    wav = os.path.join(AUDIO, 'musica.wav')
    salvar(wav, st.reshape(-1), SR, canais=2)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', wav, '-b:a', '192k', os.path.join(AUDIO, 'musica.mp3')], check=True)
    os.remove(wav)
    print('  trilha: audio/musica.mp3', segundos, 's')


# ---------------------------------------------------------------- batida + efeitos
BPM = 120  # precisa bater com BPM em engine.js (as trocas de cena caem no tempo)


def lowpass(x, fc):
    """filtro passa-baixa de 1 polo; fc pode variar no tempo (array)"""
    fc = np.broadcast_to(fc, x.shape)
    a = 1 - np.exp(-2 * np.pi * fc / SR)
    y = np.zeros_like(x); acc = 0.0
    for i in range(len(x)):
        acc += a[i] * (x[i] - acc); y[i] = acc
    return y


def batida(segundos=110, bpm=BPM, seed=3):
    """batida eletrônica (house/pop) em Ré menor, compasso 1 começa em t=0"""
    rng = np.random.default_rng(seed)
    beat = 60 / bpm; bar = 4 * beat; s16 = beat / 4
    N = int(segundos * SR); L = np.zeros(N); R = np.zeros(N)

    def add(sig, t0, pan=0.0, g=1.0):
        i0 = int(round(t0 * SR))
        if i0 >= N or i0 < 0: return
        sig = sig[:N - i0] * g
        L[i0:i0 + len(sig)] += sig * (1 - max(0, pan)); R[i0:i0 + len(sig)] += sig * (1 + min(0, pan))

    def tt(d): return np.arange(int(d * SR)) / SR
    t = tt(.45); kick = np.sin(2 * np.pi * np.cumsum(48 + 110 * np.exp(-t * 35)) / SR) * np.exp(-t * 7.5)
    kick[:60] += np.linspace(.6, 0, 60) * rng.standard_normal(60) * .4
    t = tt(.25); clap = np.zeros(len(t))
    for k in range(3):  # palma com 3 batidas rápidas
        n0 = int(k * .011 * SR); nz = rng.standard_normal(len(t) - n0)
        clap[n0:] += np.diff(np.r_[0, nz]) * np.exp(-np.arange(len(nz)) / SR * (60 if k < 2 else 18))
    clap = lowpass(clap, 5000) * 1.4
    t = tt(.05); hat = np.diff(np.r_[0, rng.standard_normal(len(t))]) * np.exp(-t * 90)
    t = tt(.22); ohat = np.diff(np.r_[0, rng.standard_normal(len(t))]) * np.exp(-t * 16)

    prog = [(50, [62, 65, 69]), (46, [58, 62, 65]), (48, [60, 64, 67]), (45, [57, 61, 64])]  # Dm Bb C A
    nbar = int(segundos / bar) + 1
    for b in range(nbar):
        t0 = b * bar; root, ch = prog[b % 4]; cheio = b >= 1
        for k in range(4):
            add(kick, t0 + k * beat, g=.9)
            if cheio: add(ohat, t0 + k * beat + beat / 2, pan=.2, g=.09)
        if cheio:
            for k in (1, 3): add(clap, t0 + k * beat, pan=-.05, g=.35)
        for k in range(16):
            if k % 2 or b % 2: add(hat, t0 + k * s16, pan=-.3, g=.05 if k % 4 == 2 else .03)
        # baixo "pumping" (fora do tempo do bumbo)
        for k in range(4):
            n = int(beat / 2 * SR); t = np.arange(n) / SR; f = nota(root - 12)
            sb = np.tanh(2.2 * (np.sin(2 * np.pi * f * t) + .4 * np.sin(4 * np.pi * f * t))) * env(n, .01, .05)
            add(sb, t0 + k * beat + beat / 2, g=.28)
        # acordes em stab no contratempo
        if cheio:
            for k in (1.5, 3.5, 2.75):
                n = int(.18 * SR); t = np.arange(n) / SR; st = np.zeros(n)
                for m in ch + [ch[0] + 12]:
                    f = nota(m); st += np.sign(np.sin(2 * np.pi * f * t)) * .5 + np.sin(2 * np.pi * f * 1.003 * t)
                st = lowpass(st, 2600) * np.exp(-t * 9) * env(n, .004, .04)
                add(st, t0 + k * beat, pan=.25 if k == 1.5 else -.25, g=.045)
        # pad de fundo
        n = int(bar * SR); t = np.arange(n) / SR; pd = np.zeros(n)
        for m in ch:
            for dt in (.997, 1.003): pd += np.sin(2 * np.pi * nota(m) * dt * t)
        add(pd * env(n, .3, .4), t0, g=.018)
    for d, g in ((.023, .3), (.041, .25), (.067, .2)):
        k = int(d * SR); L[k:] += L[:-k] * g * .3; R[k:] += R[:-k] * g * .3
    st = np.stack([L, R], 1); st = np.tanh(st / (np.max(np.abs(st)) + 1e-9) * 1.3) * .9
    return st


def comercial(segundos=110, bpm=BPM, seed=5):
    """trilha corporativa/comercial: Ré maior, piano, sinos, palmas, baixo e chocalho"""
    rng = np.random.default_rng(seed)
    beat = 60 / bpm; bar = 4 * beat; e8 = beat / 2; s16 = beat / 4
    N = int(segundos * SR); L = np.zeros(N); R = np.zeros(N)

    def add(sig, t0, pan=0.0, g=1.0):
        i0 = int(round(t0 * SR))
        if i0 >= N or i0 < 0: return
        sig = sig[:N - i0] * g
        L[i0:i0 + len(sig)] += sig * (1 - max(0, pan)); R[i0:i0 + len(sig)] += sig * (1 + min(0, pan))

    def piano(m, d=1.2):
        n = int(d * SR); t = np.arange(n) / SR; f = nota(m); x = np.zeros(n)
        for h, a in ((1, 1), (2, .55), (3, .3), (4, .18), (5, .1), (6, .05)):
            x += a * np.sin(2 * np.pi * f * h * (1 + .0004 * h * h) * t) * np.exp(-t * (2.2 + h * 1.4))
        return x * env(n, .003, .08)

    def sino(m, d=1.4):  # síntese FM (glockenspiel)
        n = int(d * SR); t = np.arange(n) / SR; f = nota(m)
        idx = 2.2 * np.exp(-t * 6)
        return np.sin(2 * np.pi * f * t + idx * np.sin(2 * np.pi * f * 3.5 * t)) * np.exp(-t * 3.2) * env(n, .002, .1)

    t = np.arange(int(.4 * SR)) / SR
    kick = np.sin(2 * np.pi * np.cumsum(52 + 90 * np.exp(-t * 40)) / SR) * np.exp(-t * 9)
    t = np.arange(int(.22 * SR)) / SR; clap = np.zeros(len(t))
    for k in range(3):
        n0 = int(k * .010 * SR); nz = rng.standard_normal(len(t) - n0)
        clap[n0:] += np.diff(np.r_[0, nz]) * np.exp(-np.arange(len(nz)) / SR * (70 if k < 2 else 20))
    t = np.arange(int(.07 * SR)) / SR
    shaker = np.diff(np.r_[0, np.diff(np.r_[0, rng.standard_normal(len(t))])]) * np.sin(np.pi * t / t[-1]) ** 2

    # I – V – vi – IV em Ré maior
    prog = [(38, [62, 66, 69, 74]), (33, [61, 64, 69, 73]), (35, [62, 66, 71, 74]), (31, [62, 67, 71, 74])]
    mel = [[74, None, 76, 78, None, 76, 74, None], [73, None, 74, 76, None, None, 69, None],
           [71, None, 73, 74, None, 73, 71, None], [69, None, 71, 74, None, None, None, None]]
    ritmo_piano = [1, 0, 1, 0, 1, 1, 0, 1]
    nbar = int(segundos / bar) + 1
    for b in range(nbar):
        t0 = b * bar; root, ch = prog[b % 4]
        bateria = b >= 2; melodia = b >= 4 and (b // 8) % 2 == 0
        # piano: acordes sincopados
        for k, on in enumerate(ritmo_piano):
            if not on: continue
            for j, m in enumerate(ch):
                add(piano(m), t0 + k * e8 + j * .004, pan=(j - 1.5) * .15, g=.11 if k % 2 == 0 else .08)
        # baixo
        if bateria:
            for k in range(8):
                n = int(e8 * .95 * SR); tb = np.arange(n) / SR
                f = nota(root + (12 if k in (3, 7) else 0))
                sb = np.tanh(1.6 * (np.sin(2 * np.pi * f * tb) + .25 * np.sin(4 * np.pi * f * tb))) * env(n, .008, .04)
                add(sb, t0 + k * e8, g=.10)
            for k in range(4):
                add(kick, t0 + k * beat, g=.38)
                if k in (1, 3): add(clap, t0 + k * beat, g=.3)
            for k in range(16):
                add(shaker, t0 + k * s16, pan=.35, g=.05 if k % 2 else .025)
        # melodia nos sinos (gancho)
        if melodia:
            for k, m in enumerate(mel[b % 4]):
                if m is not None:
                    add(sino(m), t0 + k * e8, pan=-.2, g=.12)
                    add(sino(m + 12), t0 + k * e8 + e8 * 1.5, pan=.4, g=.025)  # eco
        # prato suave a cada 4 compassos
        if bateria and b % 4 == 0:
            n = int(1.6 * SR); tc = np.arange(n) / SR
            crash = np.diff(np.r_[0, rng.standard_normal(n)]) * np.exp(-tc * 2.5)
            add(crash, t0, g=.05)
    for d, g in ((.029, .3), (.053, .25), (.089, .2), (.127, .15)):
        k = int(d * SR); L[k:] += L[:-k] * g * .35; R[k:] += R[:-k] * g * .35
    st = np.stack([L, R], 1)
    return np.tanh(st / (np.max(np.abs(st)) + 1e-9) * 1.2) * .9


def reverb(x, dur=1.2, mix=.25, seed=1):
    """reverb por convolução com ruído decaindo (sala ampla e suave)"""
    rng = np.random.default_rng(seed)
    n = int(dur * SR); t = np.arange(n) / SR
    ir = rng.standard_normal(n) * np.exp(-t * 5.5 / dur); ir = lowpass(ir, 6000); ir /= np.sqrt((ir ** 2).sum())
    m = len(x) + n - 1; k = 1 << (m - 1).bit_length()
    wet = np.fft.irfft(np.fft.rfft(x, k) * np.fft.rfft(ir, k), k)[:m]
    out = np.zeros(m); out[:len(x)] = x
    return out * (1 - mix) + wet * mix * 2.5


def estereo(x, larg=.0):
    return np.stack([x * (1 - larg), x * (1 + larg)], 1)


def efeitos_candidus():
    """efeitos discretos e cinematográficos, sem música:
       abertura  – impacto curto e suave
       transicao – sopro leve para trocas de cena
       logo      – assinatura sonora breve (acorde grave + arpejo de sinos + brilho)"""
    rng = np.random.default_rng(21)
    # abertura
    n = int(1.0 * SR); t = np.arange(n) / SR
    corpo = np.sin(2 * np.pi * np.cumsum(44 + 28 * np.exp(-t * 18)) / SR) * np.exp(-t * 4) * env(n, .008, .2)
    ar = lowpass(rng.standard_normal(n), 1400) * np.exp(-t * 9) * env(n, .004, .2)
    # camada média (audível em caixa de celular): "tum" suave em ~180–360 Hz
    fm = np.cumsum(170 + 120 * np.exp(-t * 25)) / SR
    meio = (np.sin(2 * np.pi * fm) * .8 + np.sin(4 * np.pi * fm) * .25) * np.exp(-t * 9) * env(n, .006, .2)
    ab = reverb(corpo * .8 + meio * .7 + .45 * ar, dur=1.4, mix=.3)
    ab = ab / np.max(np.abs(ab)) * .5
    # transição
    n = int(.6 * SR); t = np.arange(n) / SR
    forma = np.sin(np.pi * t / t[-1]) ** 2
    nz = lowpass(rng.standard_normal(n), 700 + 2600 * forma); nz = nz - lowpass(nz, 250)
    tr = nz * forma; tr = tr / np.max(np.abs(tr)) * .3
    pan = np.linspace(-.5, .5, n)
    trs = np.stack([tr * (1 - np.clip(pan, 0, 1)), tr * (1 + np.clip(pan, -1, 0))], 1)
    # assinatura da logo
    d = 2.6; n = int(d * SR); t = np.arange(n) / SR; lg = np.zeros(n)
    swell = np.where(t < .55, (t / .55) ** 1.5, np.exp(-(t - .55) * 1.9))
    for f, a in ((73.42, .6), (146.83, .7), (220, .55), (293.66, .4), (369.99, .2)):  # Ré maior, grave a médio
        lg += a * np.sin(2 * np.pi * f * t) * swell
    lg *= .13
    for k, m in enumerate((74, 81, 86, 90, 93)):  # D5 A5 D6 F#6 A6
        t0 = .32 + k * .085; i0 = int(t0 * SR); m_n = n - i0; tt = np.arange(m_n) / SR; f = nota(m)
        idx = 1.2 * np.exp(-tt * 7)
        sino = np.sin(2 * np.pi * f * tt + idx * np.sin(2 * np.pi * f * 3.5 * tt)) * np.exp(-tt * 2.6) * env(m_n, .003, .3)
        lg[i0:] += sino * .28 * (1 - k * .08)
    brilho = rng.standard_normal(n); brilho = brilho - lowpass(brilho, 5500)
    lg += brilho * np.where(t < .9, t / .9, np.exp(-(t - .9) * 3)) * .02
    lg = reverb(lg * env(n, .01, .4), dur=1.8, mix=.35)
    lg = lg / np.max(np.abs(lg)) * .55
    return {'abertura': estereo(ab), 'transicao': trs, 'logo': np.stack([lg, np.r_[np.zeros(200), lg[:-200]]], 1)}


def efeitos():
    """whoosh (transição deslizando) e impacto (corte seco)"""
    rng = np.random.default_rng(9)
    n = int(.7 * SR); t = np.arange(n) / SR; pico = .45
    envw = np.where(t < pico, (t / pico) ** 2.2, np.exp(-(t - pico) * 14))
    fc = 300 + 5200 * np.where(t < pico, t / pico, np.exp(-(t - pico) * 8))
    nz = lowpass(rng.standard_normal(n), fc)
    nz = nz - lowpass(nz, 150)
    w = nz * envw; w /= np.max(np.abs(w)) + 1e-9
    pan = np.linspace(-.7, .7, n)
    whoosh = np.stack([w * (1 - np.clip(pan, 0, 1)), w * (1 + np.clip(pan, -1, 0))], 1) * .8
    n = int(.9 * SR); t = np.arange(n) / SR
    boom = np.sin(2 * np.pi * np.cumsum(40 + 70 * np.exp(-t * 20)) / SR) * np.exp(-t * 4.5)
    crack = lowpass(rng.standard_normal(n), 3500) * np.exp(-t * 30) * .9
    imp = boom + crack; imp = np.tanh(imp / np.max(np.abs(imp)) * 1.5) * .85
    impact = np.stack([imp, imp], 1)
    return {'whoosh': whoosh, 'impacto': impact}


def salvar_mp3(nome, st):
    wav = os.path.join(AUDIO, nome + '.wav')
    salvar(wav, st.reshape(-1), SR, canais=2)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', wav, '-af', 'highpass=f=35', '-b:a', '192k',
                    os.path.join(AUDIO, nome + '.mp3')], check=True)
    os.remove(wav)


def sem_narracao():
    """remove a narração: as cenas voltam à duração original"""
    import shutil
    for v in ('1', '2'):
        shutil.rmtree(os.path.join(AUDIO, 'v' + v), ignore_errors=True)
    with open(os.path.join(AUDIO, 'duracoes.js'), 'w', encoding='utf-8') as f:
        f.write('/* gerado por gerar_audio.py — sem narração */\nconst VO = {"1": [], "2": []};\n')


# ---------------------------------------------------------------- narração própria
def importar(pasta, video):
    """Usa uma narração gravada/gerada fora daqui (sua voz ou voz licenciada).
    A pasta deve ter um arquivo por cena: 00.mp3, 01.mp3, ... (mp3/wav/m4a/ogg),
    na mesma ordem do roteiro.json. Cena sem arquivo fica sem narração."""
    destino = os.path.join(AUDIO, 'v' + video); os.makedirs(destino, exist_ok=True)
    n = len(json.load(open(os.path.join(ROOT, 'roteiro.json'), encoding='utf-8'))[video])
    js = os.path.join(AUDIO, 'duracoes.js')
    dur = json.loads(open(js, encoding='utf-8').read().split('const VO = ', 1)[1].rstrip().rstrip(';')) if os.path.exists(js) else {}
    dur[video] = []
    for i in range(n):
        src = next((os.path.join(pasta, f'{i:02d}.{e}') for e in ('wav', 'mp3', 'm4a', 'ogg', 'aac')
                    if os.path.exists(os.path.join(pasta, f'{i:02d}.{e}'))), None)
        out = os.path.join(destino, f'{i:02d}.wav')
        if not src:
            dur[video].append(0)
            if os.path.exists(out): os.remove(out)
            continue
        tmp = out + '.tmp.wav'
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-ac', '1', '-ar', str(SR), tmp], check=True)
        x, sr = ler_wav(tmp); os.remove(tmp)
        x = aparar(x, sr); x = x / (np.max(np.abs(x)) + 1e-9) * 0.9
        salvar(out, x, sr)
        dur[video].append(round(len(x) / sr, 3))
        print(f'  vídeo {video} · cena {i:02d} · {dur[video][-1]:.2f}s  <- {os.path.basename(src)}')
    with open(js, 'w', encoding='utf-8') as f:
        f.write('/* gerado por gerar_audio.py — duração (s) da narração de cada cena */\n')
        f.write('const VO = ' + json.dumps(dur) + ';\n')


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--voz', default='faber', choices=PIPER + list(KOKORO),
                    help='faber, cadu, jeff (Piper, masculinas) · dora (feminina), alex, santa (Kokoro)')
    ap.add_argument('--amostras', action='store_true', help='gera amostras-voz/voz-*.mp3 de todas as vozes')
    ap.add_argument('--velocidade', type=float, default=0.95, help='< 1 fala mais rápido')
    ap.add_argument('--so-musica', action='store_true', help='só refaz a trilha, mantém a narração atual')
    ap.add_argument('--narrar', action='store_true', help='inclui narração (sem isso: só batida + efeitos)')
    ap.add_argument('--estilo', default='nenhuma', choices=['nenhuma', 'comercial', 'batida', 'suave'],
                    help='música de fundo (padrão: nenhuma, só efeitos)')
    ap.add_argument('--importar', metavar='PASTA', help='usa narração própria: PASTA/00.mp3, 01.mp3, ...')
    ap.add_argument('--video', choices=['1', '2'], help='vídeo da narração importada')
    a = ap.parse_args()
    if a.amostras:
        os.makedirs(os.path.join(ROOT, 'amostras-voz'), exist_ok=True)
        frase = 'Olá! Aqui é a Candidus Gestão Financeira. Organização, planejamento e resultados para a sua empresa.'
        for vz in PIPER + list(KOKORO):
            tmp = os.path.join(AUDIO, '_amostra.wav'); os.makedirs(AUDIO, exist_ok=True)
            sintetizar(vz, frase, tmp, a.velocidade)
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-b:a', '96k',
                            os.path.join(ROOT, 'amostras-voz', f'voz-{vz}.mp3')], check=True)
            os.remove(tmp); print('  amostra:', vz)
        sys.exit()
    if a.importar:
        if not a.video: ap.error('use --video 1 ou --video 2 junto com --importar')
        print('Importando narração:'); importar(a.importar, a.video); sys.exit()
    os.makedirs(AUDIO, exist_ok=True)
    if a.narrar:
        print('Narração:'); narracao(a.voz, a.velocidade)
    elif not a.so_musica:
        sem_narracao()
    for velho in ('musica.mp3', 'sfx-whoosh.mp3', 'sfx-impacto.mp3'):
        if os.path.exists(os.path.join(AUDIO, velho)): os.remove(os.path.join(AUDIO, velho))
    if a.estilo == 'suave':
        print('Trilha suave:'); musica()
    elif a.estilo == 'batida':
        print('Batida eletrônica:'); salvar_mp3('musica', batida())
    elif a.estilo == 'comercial':
        print('Trilha comercial:'); salvar_mp3('musica', comercial())
    print('Efeitos:')
    for nome, sig in efeitos_candidus().items():
        salvar_mp3('sfx-' + nome, sig); print('  audio/sfx-' + nome + '.mp3')
