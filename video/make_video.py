"""Gera o vídeo de apresentação da Candidus (1080x1920, 30 fps, ~32 s).

Uso: python3 make_video.py <foto.jpg> <pasta_fontes> <saida.mp4>
Fontes esperadas na pasta: Cormorant-SemiBold.ttf, Montserrat-Regular.ttf,
Montserrat-SemiBold.ttf (Google Fonts). Requer Pillow, numpy e ffmpeg.
"""
import subprocess
import sys
import wave

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

PHOTO, FONTS, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
W, H, FPS = 1080, 1920, 30
DUR = 32.0
N = int(DUR * FPS)

GREEN = (14, 40, 36)
GREEN_D = (7, 20, 18)
GOLD = (212, 175, 90)
GOLD_L = (242, 214, 146)
IVORY = (244, 238, 226)


def font(name, size):
    return ImageFont.truetype(f"{FONTS}/{name}.ttf", size)


SERIF = lambda s: font("Cormorant-SemiBold", s)
SANS = lambda s: font("Montserrat-Regular", s)
SANSB = lambda s: font("Montserrat-SemiBold", s)


def clamp(x, a=0.0, b=1.0):
    return max(a, min(b, x))


def ease(x):
    x = clamp(x)
    return 1 - (1 - x) ** 3


def prog(t, start, length):
    return ease((t - start) / length)


def window(t, a, b, fade=0.6):
    """1 dentro de [a, b], com fade de entrada e saída."""
    return clamp(min((t - a) / fade, (b - t) / fade))


# ---------- foto ----------
# A foto (2:3) é encaixada na largura no topo do quadro 9:16; o espaço abaixo
# recebe uma versão desfocada e escurecida, com transição suave.
BIG = 1.35
src = Image.open(PHOTO).convert("RGB")
CW, CH = round(W * BIG), round(H * BIG)
fill = src.resize((CW, round(src.height * CW / src.width)), Image.LANCZOS)
canvas = fill.resize((CW, CH), Image.LANCZOS).filter(ImageFilter.GaussianBlur(40))
canvas = Image.blend(canvas, Image.new("RGB", (CW, CH), GREEN_D), 0.55)
mask = np.ones((fill.height, CW), np.float32)
ramp = int(fill.height * 0.18)
mask[-ramp:] = np.linspace(1, 0, ramp)[:, None]
canvas.paste(fill, (0, 0), Image.fromarray((mask * 255).astype(np.uint8), "L"))
photo = canvas


def photo_frame(zoom, cx, cy):
    """zoom 1 = quadro inteiro; (cx, cy) = centro normalizado."""
    rw, rh = W * BIG / zoom, H * BIG / zoom
    x0 = clamp(cx * photo.width - rw / 2, 0, photo.width - rw)
    y0 = clamp(cy * photo.height - rh / 2, 0, photo.height - rh)
    return photo.transform((W, H), Image.EXTENT, (x0, y0, x0 + rw, y0 + rh), Image.BICUBIC)


def gradient(top_alpha, bottom_alpha, start=0.0):
    """Camada preta-esverdeada com alfa variando verticalmente."""
    y = np.linspace(0, 1, H)[:, None]
    k = np.clip((y - start) / max(1e-6, 1 - start), 0, 1)
    a = (top_alpha + (bottom_alpha - top_alpha) * k) * 255
    arr = np.zeros((H, W, 4), np.uint8)
    arr[..., :3] = GREEN_D
    arr[..., 3] = np.broadcast_to(a, (H, W)).astype(np.uint8)
    return Image.fromarray(arr, "RGBA")


GRAD_BOTTOM = gradient(0.0, 0.92, 0.45)


def bg_green():
    """Fundo verde-escuro com vinheta suave."""
    yy, xx = np.mgrid[0:H, 0:W]
    d = np.sqrt(((xx - W / 2) / W) ** 2 + ((yy - H * 0.45) / H) ** 2)
    k = np.clip(d * 1.6, 0, 1)[..., None]
    arr = np.array(GREEN) * (1 - k) + np.array(GREEN_D) * k
    return Image.fromarray(arr.astype(np.uint8), "RGB")


BG = bg_green()


# ---------- desenho de texto ----------
def text_layer(draw_fn):
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw_fn(ImageDraw.Draw(layer))
    return layer


def put(img, layer, alpha, dy=0):
    if alpha <= 0:
        return img
    if alpha < 1:
        a = layer.getchannel("A").point(lambda v: int(v * alpha))
        layer = layer.copy()
        layer.putalpha(a)
    if dy:
        layer = layer.transform(layer.size, Image.AFFINE, (1, 0, 0, 0, 1, -dy))
    img.alpha_composite(layer)
    return img


def centered(d, y, txt, f, fill, spacing=0):
    if spacing:
        widths = [d.textlength(c, font=f) for c in txt]
        total = sum(widths) + spacing * (len(txt) - 1)
        x = (W - total) / 2
        for c, w in zip(txt, widths):
            d.text((x, y), c, font=f, fill=fill)
            x += w + spacing
    else:
        d.text((W / 2, y), txt, font=f, fill=fill, anchor="ma")


def logo(d, cx, cy, s, grow=1.0):
    """Barras crescentes + seta, como na placa."""
    bw, gap = 46 * s, 16 * s
    heights = [60, 90, 125, 165]
    x = cx - (4 * bw + 3 * gap) / 2
    for i, h in enumerate(heights):
        g = clamp(grow * 4 - i)
        hh = h * s * ease(g)
        if hh > 0:
            d.rectangle([x, cy - hh, x + bw, cy], fill=GOLD)
        x += bw + gap
    if grow > 0.85:
        a = ease((grow - 0.85) / 0.15)
        x0, y0 = cx - 120 * s, cy - 85 * s
        x1, y1 = cx + 100 * s, cy - 205 * s
        xe, ye = x0 + (x1 - x0) * a, y0 + (y1 - y0) * a
        d.line([(x0, y0), (xe, ye)], fill=GOLD_L, width=int(9 * s))
        if a > 0.95:
            d.polygon([(x1 + 22 * s, y1 - 12 * s), (x1 - 22 * s, y1 - 10 * s), (x1 + 4 * s, y1 + 26 * s)], fill=GOLD_L)


def gold_rule(d, y, half, alpha=1.0):
    d.line([(W / 2 - half, y), (W / 2 + half, y)], fill=GOLD + (int(255 * alpha),), width=3)


# ---------- cenas pré-renderizadas ----------
L_NAME = text_layer(lambda d: (
    d.rectangle([80, 1530, 86, 1750], fill=GOLD),
    d.text((115, 1528), "APRESENTO A", font=SANSB(34), fill=IVORY),
    d.text((112, 1580), "Candidus", font=SERIF(104), fill=IVORY),
    d.text((115, 1712), "GESTÃO FINANCEIRA", font=SANSB(30), fill=GOLD),
))

L_HEAD1 = text_layer(lambda d: (
    centered(d, 1300, "Você cuida do seu negócio.", SERIF(78), IVORY),
))
L_HEAD2 = text_layer(lambda d: (
    centered(d, 1400, "A gente organiza", SERIF(78), GOLD_L),
    centered(d, 1490, "as suas finanças.", SERIF(78), GOLD_L),
))

FEATURES = [
    ("Contas a pagar e a receber", "Vencimentos, parcelas e baixa em lote"),
    ("Fluxo de caixa", "Entradas x saídas, mês a mês"),
    ("Conciliação bancária", "Importe o extrato OFX/CSV e concilie"),
    ("DRE Gerencial", "Resultado real por categoria"),
    ("Orçado x Realizado", "Metas e indicadores sob controle"),
    ("Cartões e documentos", "Faturas, anexos e pendências"),
]


def feature_card(title, sub, idx):
    card = Image.new("RGBA", (W, 190), (0, 0, 0, 0))
    d = ImageDraw.Draw(card)
    d.rounded_rectangle([70, 10, W - 70, 175], radius=26, fill=(255, 255, 255, 14), outline=GOLD + (120,), width=2)
    d.ellipse([110, 58, 170, 118], outline=GOLD, width=3)
    d.text((140, 88), f"{idx}", font=SANSB(30), fill=GOLD, anchor="mm")
    d.text((205, 45), title, font=SANSB(42), fill=IVORY)
    d.text((205, 105), sub, font=SANS(30), fill=(200, 196, 184))
    return card


CARDS = [feature_card(t, s, i + 1) for i, (t, s) in enumerate(FEATURES)]
L_FEAT_TITLE = text_layer(lambda d: (
    centered(d, 200, "O QUE A CANDIDUS FAZ", SANSB(34), GOLD, spacing=5),
    centered(d, 260, "Tudo em um só lugar", SERIF(92), IVORY),
))

PILLARS = ["ORGANIZAÇÃO", "PLANEJAMENTO", "RESULTADOS"]

L_CTA = text_layer(lambda d: (
    centered(d, 1330, "CANDIDUS", SERIF(150), IVORY),
    centered(d, 1500, "GESTÃO FINANCEIRA", SANSB(40), GOLD, spacing=6),
    centered(d, 1640, "Vamos conversar sobre a sua empresa?", SANS(38), IVORY),
))


def scene_frame(t):
    # 0–11 s: foto (apresentação + chamada)
    if t < 11.4:
        z = 1.0 + 0.10 * (t / 11.4)
        cy = 0.5 - 0.08 * (t / 11.4)
        img = photo_frame(z, 0.5, cy).convert("RGBA")
        img.alpha_composite(GRAD_BOTTOM)
        put(img, L_NAME, window(t, 1.0, 5.6), dy=int(30 * (1 - prog(t, 1.0, 0.8))))
        put(img, L_HEAD1, window(t, 6.0, 11.0), dy=int(30 * (1 - prog(t, 6.0, 0.8))))
        put(img, L_HEAD2, window(t, 7.0, 11.0), dy=int(30 * (1 - prog(t, 7.0, 0.8))))
        return img

    # 11–22 s: funcionalidades
    if t < 22.4:
        lt = t - 11.4
        img = BG.convert("RGBA")
        put(img, L_FEAT_TITLE, window(lt, 0.2, 10.6), dy=int(25 * (1 - prog(lt, 0.2, 0.8))))
        for i, c in enumerate(CARDS):
            st = 0.9 + i * 1.1
            a = window(lt, st, 10.6, 0.5)
            if a <= 0:
                continue
            off = int(60 * (1 - prog(lt, st, 0.7)))
            layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
            layer.paste(c, (off, 470 + i * 215), c)
            put(img, layer, a)
        return img

    # 22–27 s: pilares + logo
    if t < 27.4:
        lt = t - 22.4
        img = BG.convert("RGBA")
        a = window(lt, 0.0, 5.0)
        layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        d = ImageDraw.Draw(layer)
        logo(d, W / 2, 830, 1.9, grow=prog(lt, 0.2, 1.8))
        for i, p in enumerate(PILLARS):
            pa = prog(lt, 1.6 + i * 0.6, 0.6)
            if pa > 0:
                col = GOLD if i % 2 == 0 else IVORY
                tmp = text_layer(lambda dd: centered(dd, 1050 + i * 150, p, SANSB(64), col, spacing=6))
                put(layer, tmp, pa, dy=int(20 * (1 - pa)))
        gold_rule(d, 1500, 300 * prog(lt, 3.4, 0.8))
        put(img, layer, a)
        return img

    # 27–32 s: fechamento com a foto
    lt = t - 27.4
    z = 1.12 - 0.04 * (lt / 4.6)
    img = photo_frame(z, 0.55, 0.36).convert("RGBA")
    img.alpha_composite(GRAD_BOTTOM)
    put(img, L_CTA, window(lt, 0.4, 4.6 + 1), dy=int(30 * (1 - prog(lt, 0.4, 0.9))))
    return img


def global_fade(t):
    return clamp(min(t / 0.8, (DUR - t) / 0.9))


# ---------- trilha sonora sintetizada ----------
def make_music(path):
    sr = 44100
    n = int(sr * DUR)
    t = np.arange(n) / sr
    out = np.zeros(n)

    def note(f):
        return 440 * 2 ** ((f - 69) / 12)

    # Am – F – C – G, 4 s por acorde
    chords = [[57, 60, 64, 69], [53, 57, 60, 65], [48, 55, 60, 64], [55, 59, 62, 67]]
    seg = 4.0
    for k in range(int(np.ceil(DUR / seg))):
        ch = chords[k % 4]
        s0, s1 = int(k * seg * sr), min(n, int((k + 1) * seg * sr + 1.0 * sr))
        tt = t[s0:s1] - k * seg
        env = np.clip(tt / 1.2, 0, 1) * np.clip((seg + 1.0 - tt) / 1.2, 0, 1)
        for m in ch:
            f = note(m)
            out[s0:s1] += env * 0.06 * (np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(2 * np.pi * 2.003 * f * tt))
        # baixo
        out[s0:s1] += env * 0.10 * np.sin(2 * np.pi * note(ch[0] - 12) * tt)
        # arpejo suave em colcheias
        for j in range(8):
            a0 = s0 + int(j * 0.5 * sr)
            if a0 >= n:
                break
            a1 = min(n, a0 + int(0.9 * sr))
            ta = t[a0:a1] - t[a0]
            m = ch[[0, 2, 1, 3, 2, 1, 3, 2][j]] + 12
            out[a0:a1] += 0.035 * np.exp(-ta * 4) * np.sin(2 * np.pi * note(m) * ta)
    # pulso leve a partir dos 11 s
    for b in np.arange(11.4, DUR - 1, 0.5):
        b0 = int(b * sr)
        b1 = min(n, b0 + int(0.15 * sr))
        tb = t[b0:b1] - t[b0]
        out[b0:b1] += 0.12 * np.exp(-tb * 30) * np.sin(2 * np.pi * (90 - 200 * tb) * tb)
    # eco simples
    d = int(0.33 * sr)
    out[d:] += 0.3 * out[:-d]
    fade = np.clip(np.minimum(t / 1.5, (DUR - t) / 2.0), 0, 1)
    out *= fade
    out /= np.max(np.abs(out)) + 1e-9
    out *= 0.6
    pcm = (out * 32767).astype(np.int16)
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes(pcm.tobytes())


if __name__ == "__main__":
    wav = OUT + ".wav"
    make_music(wav)
    ff = subprocess.Popen([
        "ffmpeg", "-y", "-loglevel", "error",
        "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
        "-i", wav,
        "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", OUT,
    ], stdin=subprocess.PIPE)
    black = Image.new("RGB", (W, H), (0, 0, 0))
    for i in range(N):
        t = i / FPS
        fr = scene_frame(t).convert("RGB")
        # transições entre cenas (cross-fade pelo preto)
        g = global_fade(t)
        for cut in (11.4, 22.4, 27.4):
            g = min(g, clamp(abs(t - cut) / 0.35))
        if g < 1:
            fr = Image.blend(black, fr, g)
        ff.stdin.write(fr.tobytes())
        if i % 150 == 0:
            print(f"{i}/{N}", flush=True)
    ff.stdin.close()
    ff.wait()
