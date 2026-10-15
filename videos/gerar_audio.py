#!/usr/bin/env python3
"""Gera o áudio dos vídeos Candidus.

  1. Narração: lê roteiro.json e sintetiza uma fala por cena com Piper
     (voz neural pt-BR, roda offline). Saída: audio/v1/NN.wav, audio/v2/NN.wav
     e audio/duracoes.js (duração de cada fala, usada para ajustar as cenas).
  2. Trilha: compõe uma música de fundo original (sem direitos autorais),
     estilo corporativo/inspirador. Saída: audio/musica.mp3

Uso:   python3 gerar_audio.py [--voz faber|cadu|jeff] [--velocidade 0.95]
Requer: pip install piper-tts numpy   (o modelo de voz é baixado sozinho)
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
    onnx = modelo(voz)
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
            subprocess.run([piper_bin(), '-m', onnx, '-f', out, '--length-scale', str(velocidade),
                            '--sentence-silence', '0.18'], input=texto.encode('utf-8'), check=True,
                           stderr=subprocess.DEVNULL)
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
    ap.add_argument('--voz', default='faber', choices=['faber', 'cadu', 'jeff'])
    ap.add_argument('--velocidade', type=float, default=0.95, help='< 1 fala mais rápido')
    ap.add_argument('--so-musica', action='store_true')
    ap.add_argument('--importar', metavar='PASTA', help='usa narração própria: PASTA/00.mp3, 01.mp3, ...')
    ap.add_argument('--video', choices=['1', '2'], help='vídeo da narração importada')
    a = ap.parse_args()
    if a.importar:
        if not a.video: ap.error('use --video 1 ou --video 2 junto com --importar')
        print('Importando narração:'); importar(a.importar, a.video); sys.exit()
    if not a.so_musica:
        print('Narração:'); narracao(a.voz, a.velocidade)
    print('Trilha:'); musica()
