/* =====================================================================
   Candidus · Série de vídeos curtos (Reels/TikTok) — motor de blocos
   Estilo: gradiente vivo, etiquetas, palavra destacada, ícones em órbita,
   tipografia gigante, telas claras de frase e logo no final.
   Cada vídeo é uma lista de blocos (ver videos.js). Cortes no tempo da música.
   ===================================================================== */
const W = 1080, H = 1920, FPS = 30;
const BPM = 120, BEAT = 60 / BPM;                 // igual às trilhas de gerar_musicas.py
const C = {
  dark: '#01210f', deep: '#00170a', green: '#0c5c34', green2: '#1f8a52',
  gold: '#c9962a', gold2: '#ecc96b', cream: '#f6f0e1', ink: '#062414', red: '#b8432f', white: '#ffffff'
};
const SANS = "'Montserrat', Arial, sans-serif", SERIF = "'Cormorant Garamond', Georgia, serif";

/* ---------- utilidades ---------- */
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const E = {
  out: t => 1 - Math.pow(1 - t, 3), in: t => t * t * t,
  inOut: t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  expo: t => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  back: t => { const c1 = 1.7, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }
};
const P = (t, a, d, e = E.out) => e(clamp((t - a) / d));
function rnd(s) { const x = Math.sin(s * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); }

const IMG = {};
function loadImg(k, src) { return new Promise((ok, err) => { const i = new Image(); i.onload = () => { IMG[k] = i; ok(); }; i.onerror = err; i.src = src; }); }

function font(size, weight = 800, fam = SANS, italic = false) { return `${italic ? 'italic ' : ''}${weight} ${size}px ${fam}`; }
function measure(c, s, size, weight = 800, fam = SANS) { c.save(); c.font = font(size, weight, fam); const w = c.measureText(s).width; c.restore(); return w; }
function fit(c, s, maxW, size, weight = 800, min = 34, fam = SANS) { while (size > min && measure(c, s, size, weight, fam) > maxW) size -= 2; return size; }
function wrap(c, s, maxW, size, weight = 700) {
  const out = []; let l = '';
  for (const w of s.split(' ')) { const tt = l ? l + ' ' + w : w; if (measure(c, tt, size, weight) > maxW && l) { out.push(l); l = w; } else l = tt; }
  if (l) out.push(l); return out;
}
function txt(c, s, x, y, o = {}) {
  const { size = 80, weight = 800, fam = SANS, color = C.cream, align = 'center', alpha = 1, scale = 1, rot = 0, italic = false, shadow = 0 } = o;
  if (alpha <= 0) return;
  c.save(); c.globalAlpha *= alpha; c.translate(x, y); c.rotate(rot); c.scale(scale, scale);
  c.font = font(size, weight, fam, italic); c.textAlign = align; c.textBaseline = 'middle';
  if (shadow) { c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = shadow; c.shadowOffsetY = shadow / 3; }
  c.fillStyle = color === 'gold' ? goldGrad(c, -size * 4, 0, size * 4, 0) : color;
  c.fillText(s, 0, 0); c.restore();
}
function goldGrad(c, x0, y0, x1, y1) {
  const g = c.createLinearGradient(x0, y0, x1, y1);
  g.addColorStop(0, '#a87a1c'); g.addColorStop(.35, '#f3d27a'); g.addColorStop(.6, '#c9962a'); g.addColorStop(1, '#f0cf78'); return g;
}
function rr(c, x, y, w, h, r) {
  r = Math.min(r, h / 2, w / 2);
  c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
}
function drawImg(c, img, cx, cy, w, a = 1) {
  if (a <= 0) return; const h = w * img.height / img.width;
  c.save(); c.globalAlpha *= a; c.drawImage(img, cx - w / 2, cy - h / 2, w, h); c.restore();
}
/* entrada padrão: sobe um pouco e aparece */
function ent(t, a, d = .45) { const p = P(t, a, d); return { a: p, dy: (1 - p) * 50 }; }

/* ---------- ícones de linha (desenhados em caixa 100×100 centrada) ---------- */
const ICON = {
  moeda(c) { c.beginPath(); c.arc(0, 0, 40, 0, 7); c.stroke(); txt(c, 'R$', 0, 2, { size: 34, weight: 900, color: c.strokeStyle }); },
  grafico(c) { [[-30, 10], [-8, -5], [14, -22]].forEach(([x, y]) => { c.strokeRect(x - 8, y, 16, 34 - y); }); c.beginPath(); c.moveTo(-40, 0); c.lineTo(-10, -22); c.lineTo(8, -12); c.lineTo(38, -40); c.stroke(); c.beginPath(); c.moveTo(24, -40); c.lineTo(38, -40); c.lineTo(38, -26); c.stroke(); },
  calendario(c) { rr(c, -38, -32, 76, 70, 8); c.stroke(); c.beginPath(); c.moveTo(-38, -14); c.lineTo(38, -14); c.moveTo(-20, -42); c.lineTo(-20, -24); c.moveTo(20, -42); c.lineTo(20, -24); c.stroke(); [[-18, 6], [0, 6], [18, 6], [-18, 22], [0, 22]].forEach(([x, y]) => { c.fillStyle = c.strokeStyle; c.fillRect(x - 5, y - 5, 10, 10); }); },
  banco(c) { c.beginPath(); c.moveTo(-42, -16); c.lineTo(0, -42); c.lineTo(42, -16); c.closePath(); c.stroke(); [-28, -9, 9, 28].forEach(x => { c.beginPath(); c.moveTo(x, -10); c.lineTo(x, 26); c.stroke(); }); c.beginPath(); c.moveTo(-44, 34); c.lineTo(44, 34); c.stroke(); },
  recibo(c) { c.beginPath(); c.moveTo(-30, -42); c.lineTo(30, -42); c.lineTo(30, 42); c.lineTo(20, 34); c.lineTo(10, 42); c.lineTo(0, 34); c.lineTo(-10, 42); c.lineTo(-20, 34); c.lineTo(-30, 42); c.closePath(); c.stroke(); [-24, -8, 8].forEach(y => { c.beginPath(); c.moveTo(-18, y); c.lineTo(18, y); c.stroke(); }); },
  alvo(c) { [40, 26, 12].forEach(r => { c.beginPath(); c.arc(0, 0, r, 0, 7); c.stroke(); }); c.beginPath(); c.moveTo(0, 0); c.lineTo(34, -34); c.stroke(); },
  relogio(c) { c.beginPath(); c.arc(0, 0, 40, 0, 7); c.stroke(); c.beginPath(); c.moveTo(0, -24); c.lineTo(0, 0); c.lineTo(18, 12); c.stroke(); },
  pessoas(c) { c.beginPath(); c.arc(-16, -14, 13, 0, 7); c.arc(20, -10, 11, 0, 7); c.stroke(); c.beginPath(); c.arc(-16, 30, 26, Math.PI, 0); c.stroke(); c.beginPath(); c.arc(22, 30, 20, Math.PI, 0); c.stroke(); },
  escudo(c) { c.beginPath(); c.moveTo(0, -42); c.lineTo(36, -28); c.quadraticCurveTo(34, 26, 0, 44); c.quadraticCurveTo(-34, 26, -36, -28); c.closePath(); c.stroke(); c.beginPath(); c.moveTo(-15, 0); c.lineTo(-3, 13); c.lineTo(18, -12); c.stroke(); },
  cofre(c) { rr(c, -40, -36, 80, 72, 10); c.stroke(); c.beginPath(); c.arc(0, 0, 16, 0, 7); c.stroke(); c.beginPath(); c.moveTo(0, -16); c.lineTo(0, -6); c.moveTo(-26, 36); c.lineTo(-26, 44); c.moveTo(26, 36); c.lineTo(26, 44); c.stroke(); },
  alerta(c) { c.beginPath(); c.moveTo(0, -40); c.lineTo(42, 36); c.lineTo(-42, 36); c.closePath(); c.stroke(); c.beginPath(); c.moveTo(0, -12); c.lineTo(0, 12); c.stroke(); c.fillStyle = c.strokeStyle; c.beginPath(); c.arc(0, 24, 4, 0, 7); c.fill(); },
  queda(c) { c.beginPath(); c.moveTo(-40, -30); c.lineTo(-10, 0); c.lineTo(8, -14); c.lineTo(40, 26); c.stroke(); c.beginPath(); c.moveTo(24, 26); c.lineTo(40, 26); c.lineTo(40, 10); c.stroke(); },
  lupa(c) { c.beginPath(); c.arc(-8, -8, 28, 0, 7); c.stroke(); c.beginPath(); c.moveTo(12, 12); c.lineTo(38, 38); c.stroke(); },
  carteira(c) { rr(c, -40, -26, 80, 60, 10); c.stroke(); c.beginPath(); c.moveTo(-34, -26); c.lineTo(22, -42); c.lineTo(28, -26); c.stroke(); rr(c, 14, -4, 26, 20, 6); c.stroke(); },
  cadeado(c) { rr(c, -32, -6, 64, 48, 8); c.stroke(); c.beginPath(); c.arc(0, -6, 22, Math.PI, 0); c.stroke(); c.beginPath(); c.moveTo(0, 10); c.lineTo(0, 24); c.stroke(); },
  check(c) { c.beginPath(); c.arc(0, 0, 40, 0, 7); c.stroke(); c.beginPath(); c.moveTo(-18, 0); c.lineTo(-4, 16); c.lineTo(22, -14); c.stroke(); },
  balanca(c) { c.beginPath(); c.moveTo(0, -40); c.lineTo(0, 38); c.moveTo(-26, 38); c.lineTo(26, 38); c.moveTo(-38, -26); c.lineTo(38, -26); c.stroke(); c.beginPath(); c.arc(-30, -4, 14, 0, Math.PI); c.stroke(); c.beginPath(); c.arc(30, -4, 14, 0, Math.PI); c.stroke(); },
  olho(c) { c.beginPath(); c.moveTo(-44, 0); c.quadraticCurveTo(0, -42, 44, 0); c.quadraticCurveTo(0, 42, -44, 0); c.stroke(); c.beginPath(); c.arc(0, 0, 14, 0, 7); c.fillStyle = c.strokeStyle; c.fill(); },
  documento(c) { c.beginPath(); c.moveTo(-28, -42); c.lineTo(14, -42); c.lineTo(30, -26); c.lineTo(30, 42); c.lineTo(-28, 42); c.closePath(); c.stroke(); [-14, 2, 18].forEach(y => { c.beginPath(); c.moveTo(-16, y); c.lineTo(18, y); c.stroke(); }); },
  loja(c) { c.beginPath(); c.moveTo(-42, -20); c.lineTo(-34, -42); c.lineTo(34, -42); c.lineTo(42, -20); c.closePath(); c.stroke(); c.strokeRect(-36, -20, 72, 60); c.strokeRect(-10, 8, 20, 32); },
  tesoura(c) { c.beginPath(); c.arc(-22, 26, 12, 0, 7); c.arc(22, 26, 12, 0, 7); c.stroke(); c.beginPath(); c.moveTo(-14, 16); c.lineTo(20, -40); c.moveTo(14, 16); c.lineTo(-20, -40); c.stroke(); },
  raio(c) { c.beginPath(); c.moveTo(8, -44); c.lineTo(-22, 6); c.lineTo(2, 6); c.lineTo(-8, 44); c.lineTo(24, -8); c.lineTo(0, -8); c.closePath(); c.stroke(); },
  setaCima(c) { c.beginPath(); c.moveTo(0, 40); c.lineTo(0, -36); c.moveTo(-24, -12); c.lineTo(0, -38); c.lineTo(24, -12); c.stroke(); },
  cerebro(c) { c.beginPath(); c.arc(-14, -10, 22, Math.PI * .6, Math.PI * 1.9); c.arc(14, -10, 22, Math.PI * 1.1, Math.PI * .4); c.stroke(); c.beginPath(); c.moveTo(0, -30); c.lineTo(0, 30); c.stroke(); }
};
function icone(c, nome, x, y, s = 1, cor = C.dark, lw = 6) {
  const f = ICON[nome]; if (!f) return;
  c.save(); c.translate(x, y); c.scale(s, s); c.strokeStyle = cor; c.lineWidth = lw / s; c.lineCap = 'round'; c.lineJoin = 'round';
  f(c); c.restore();
}
/* bolha branca brilhante com ícone (estilo do modelo) */
function bolha(c, x, y, r, nome, a = 1, s = 1) {
  if (a <= 0) return;
  c.save(); c.globalAlpha *= a; c.translate(x, y); c.scale(s, s);
  c.shadowColor = 'rgba(0,0,0,.35)'; c.shadowBlur = 30; c.shadowOffsetY = 12;
  const g = c.createRadialGradient(-r * .35, -r * .4, r * .1, 0, 0, r);
  g.addColorStop(0, '#ffffff'); g.addColorStop(.7, '#f1ede3'); g.addColorStop(1, '#d9d2c2');
  c.fillStyle = g; c.beginPath(); c.arc(0, 0, r, 0, 7); c.fill(); c.shadowColor = 'transparent';
  c.strokeStyle = 'rgba(201,150,42,.7)'; c.lineWidth = 3; c.beginPath(); c.arc(0, 0, r - 2, 0, 7); c.stroke();
  icone(c, nome, 0, 0, r / 70, C.dark, 7);
  c.restore();
}

/* ---------- fundos ---------- */
function bgMesh(c, t, seed = 0) {        // gradiente vivo (verde profundo + dourado)
  c.fillStyle = C.deep; c.fillRect(0, 0, W, H);
  const blobs = [[C.green2, .9, 700], [C.gold, .55, 520], [C.green, 1, 820], ['#000000', .7, 600]];
  blobs.forEach(([cor, a, r], i) => {
    const k = i + seed * 1.7;
    const x = W * (.5 + .45 * Math.sin(t * .35 + k * 2.1)), y = H * (.45 + .4 * Math.cos(t * .28 + k * 1.3));
    const g = c.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, cor); g.addColorStop(1, 'rgba(0,0,0,0)');
    c.save(); c.globalAlpha = a; c.fillStyle = g; c.fillRect(0, 0, W, H); c.restore();
  });
  const v = c.createRadialGradient(W / 2, H / 2, H * .25, W / 2, H / 2, H * .75);
  v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.55)'); c.fillStyle = v; c.fillRect(0, 0, W, H);
}
function bgCream(c, t) {
  c.fillStyle = C.cream; c.fillRect(0, 0, W, H);
  const g = c.createRadialGradient(W * .5 + Math.sin(t) * 80, H * .45, 0, W / 2, H * .45, H * .7);
  g.addColorStop(0, 'rgba(236,201,107,.22)'); g.addColorStop(1, 'rgba(236,201,107,0)'); c.fillStyle = g; c.fillRect(0, 0, W, H);
}

/* ---------- blocos ---------- */
const palavras = s => String(s).split(/\s+/).filter(Boolean).length;
const BLOCOS = {};

/* GANCHO: linhas de texto, uma palavra dentro de caixa dourada  ex.: ['Você sabe', {hl: 'quanto lucra?'}] */
BLOCOS.gancho = {
  leitura: b => b.linhas.reduce((n, l) => n + palavras(l.hl || l), 0),
  draw(c, t, b) {
    (b.fundo === 'claro' ? bgCream : bgMesh)(c, t, b.seed || 0);
    const claro = b.fundo === 'claro';
    const n = b.linhas.length, lh = 130, y0 = 960 - (n - 1) * lh / 2;
    b.linhas.forEach((l, i) => {
      const y = y0 + i * lh, e = ent(t, .08 + i * .14);
      if (l.hl) {
        const size = fit(c, l.hl, 760, 96, 900), w = measure(c, l.hl, size, 900) + 70;
        const p = P(t, .1 + i * .14, .5, E.expo);
        c.save(); c.globalAlpha *= e.a;
        c.fillStyle = claro ? C.dark : goldGrad(c, W / 2 - w / 2, 0, W / 2 + w / 2, 0);
        rr(c, W / 2 - w * p / 2, y - size * .72 + e.dy, w * p, size * 1.44, 18); c.fill(); c.restore();
        txt(c, l.hl, W / 2, y + 4 + e.dy, { size, weight: 900, color: claro ? C.gold2 : C.dark, alpha: clamp((p - .4) * 2) });
      } else {
        const size = fit(c, l, 820, 84, 800);
        txt(c, l, W / 2, y + e.dy, { size, weight: 800, color: claro ? C.ink : C.cream, alpha: e.a, shadow: claro ? 0 : 20 });
      }
    });
  }
};

/* ETIQUETAS (dores) que se empilham e, opcionalmente, caem numa lixeira */
BLOCOS.etiquetas = {
  leitura: b => palavras(b.titulo || '') + b.itens.reduce((n, s) => n + palavras(s), 0) + (b.lixeira ? 6 : 0),
  extra: b => (b.lixeira ? 2.8 : 0),
  draw(c, t, b, d) {
    bgMesh(c, t, b.seed || 1);
    if (b.titulo) { const e = ent(t, .05); txt(c, b.titulo, W / 2, 470 + e.dy, { size: fit(c, b.titulo, 820, 52, 800), weight: 800, color: C.gold2, alpha: e.a }); }
    const n = b.itens.length, ini = d - (b.lixeira ? 2.8 : 0);
    const binY = H + 300 - 600 * P(t, ini, .5, E.out);
    b.itens.forEach((s, i) => {
      const t0 = .25 + i * .32, p = P(t, t0, .5, E.back);
      if (p <= 0) return;
      let x = W / 2 + (rnd(i + 3) - .5) * 80, y = 620 + i * 150 - (1 - p) * 260, rot = (rnd(i + 7) - .5) * .08, sc = 1, a = clamp(p * 2);
      if (b.lixeira) {                         // caem na lixeira
        const q = P(t, ini + .35 + i * .12, .55, E.in);
        x = lerp(x, W / 2, q); y = lerp(y, binY + 40, q); rot += q * (rnd(i) - .5) * 2; sc = lerp(1, .45, q); a *= 1 - clamp((q - .85) * 7);
      }
      pill(c, s, x, y, rot, sc, a);
    });
    if (b.lixeira) {
      lixeira(c, W / 2, binY);
      const e = ent(t, ini + .7);
      txt(c, b.legenda || 'Com gestão financeira, isso fica para trás.', W / 2, 820 + e.dy,
        { size: fit(c, b.legenda || 'Com gestão financeira, isso fica para trás.', 820, 60, 800), weight: 800, alpha: e.a, shadow: 20 });
    }
  }
};
function pill(c, s, x, y, rot, sc, a) {
  if (a <= 0) return;
  const size = fit(c, s, 700, 46, 800), w = measure(c, s, size, 800) + 90, h = 104;
  c.save(); c.globalAlpha *= a; c.translate(x, y); c.rotate(rot); c.scale(sc, sc);
  c.shadowColor = 'rgba(0,0,0,.4)'; c.shadowBlur = 24; c.shadowOffsetY = 10;
  const g = c.createLinearGradient(0, -h / 2, 0, h / 2); g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#e6e0d2');
  c.fillStyle = g; rr(c, -w / 2, -h / 2, w, h, h / 2); c.fill(); c.shadowColor = 'transparent';
  c.strokeStyle = 'rgba(255,255,255,.9)'; c.lineWidth = 3; rr(c, -w / 2 + 4, -h / 2 + 4, w - 8, h - 8, h / 2); c.stroke();
  c.restore();
  txt(c, s, x, y + 2, { size: size * sc, weight: 800, color: C.ink, alpha: a, rot });
}
function lixeira(c, x, y) {
  c.save(); c.translate(x, y);
  c.fillStyle = '#05120a'; c.beginPath(); c.moveTo(-190, -150); c.lineTo(190, -150); c.lineTo(150, 260); c.lineTo(-150, 260); c.closePath(); c.fill();
  c.fillStyle = '#0a2416'; rr(c, -215, -185, 430, 50, 12); c.fill();
  c.fillStyle = C.gold; [-80, 0, 80].forEach(k => { rr(c, k - 14, -110, 28, 320, 14); c.fill(); });
  c.restore();
}

/* DESTAQUE: frase correndo na horizontal, para com a palavra-chave no centro */
BLOCOS.destaque = {
  leitura: b => palavras(b.antes) + palavras(b.hl) + palavras(b.depois) + palavras(b.sub || ''),
  draw(c, t, b) {
    bgCream(c, t);
    // faixa de fundo correndo na horizontal (movimento do modelo)
    const fundo = (b.hl + ' • ').repeat(6).toUpperCase();
    c.save(); c.globalAlpha = .07; txt(c, fundo, W / 2 - (t * 220) % 900 + 400, 900, { size: 300, weight: 900, color: C.dark }); c.restore();
    const e1 = ent(t, .05);
    if (b.antes) txt(c, b.antes, W / 2, 740 + e1.dy, { size: fit(c, b.antes, 820, 70, 700), weight: 700, italic: true, color: C.ink, alpha: e1.a });
    const size = fit(c, b.hl, 700, 120, 900), wH = measure(c, b.hl, size, 900) + 80;
    const x = lerp(W + wH, W / 2, P(t, .25, .9, E.expo)), y = 900;
    c.save(); c.fillStyle = C.dark; rr(c, x - wH / 2, y - size * .7, wH, size * 1.4, 16); c.fill();
    c.setLineDash([12, 9]); c.strokeStyle = C.gold; c.lineWidth = 4; rr(c, x - wH / 2 - 12, y - size * .7 - 12, wH + 24, size * 1.4 + 24, 20); c.stroke(); c.restore();
    txt(c, b.hl, x, y + 5, { size, weight: 900, color: C.gold2 });
    const e2 = ent(t, .8);
    if (b.depois) txt(c, b.depois, W / 2, 1065 + e2.dy, { size: fit(c, b.depois, 820, 70, 700), weight: 700, italic: true, color: C.ink, alpha: e2.a });
    if (b.sub) { const e3 = ent(t, 1.2); txt(c, b.sub, W / 2, 1220 + e3.dy, { size: fit(c, b.sub, 820, 46, 700), weight: 700, color: C.dark, alpha: e3.a }); }
  }
};

/* ÓRBITA: ícone central + 4 bolhas com rótulos */
BLOCOS.orbita = {
  leitura: b => palavras(b.titulo || '') + b.itens.reduce((n, [, l]) => n + palavras(l), 0),
  draw(c, t, b) {
    bgMesh(c, t, b.seed || 2);
    if (b.titulo) { const e = ent(t, .05); txt(c, b.titulo, W / 2, 430 + e.dy, { size: fit(c, b.titulo, 820, 60, 900), weight: 900, alpha: e.a, shadow: 20 }); }
    const cx = W / 2, cy = 960, pc = P(t, .15, .6, E.back);
    bolha(c, cx, cy, 150, b.centro || 'olho', clamp(pc * 2), pc);
    const pos = [[-280, -300], [280, -260], [-270, 300], [280, 330]];
    b.itens.forEach(([ic, lab], i) => {
      const p = P(t, .5 + i * .28, .5, E.back), fx = Math.sin(t * 1.6 + i) * 10, fy = Math.cos(t * 1.3 + i * 2) * 12;
      const [dx, dy] = pos[i % 4], x = cx + dx + fx, y = cy + dy + fy;
      bolha(c, x, y, 92, ic, clamp(p * 2), p);
      txt(c, lab, x, y + 140, { size: fit(c, lab, 380, 38, 800), weight: 800, alpha: clamp(p * 2), shadow: 16 });
    });
  }
};

/* PALAVRA GIGANTE com ícone no lugar de uma letra (ex.: LUCRO com a moeda no O) */
BLOCOS.palavra = {
  leitura: b => 1 + palavras(b.sub || ''),
  draw(c, t, b) {
    bgMesh(c, t, b.seed || 3);
    const word = b.palavra.toUpperCase(), size = fit(c, word, 860, 300, 900, 120);
    const letras = [...word], ws = letras.map(l => measure(c, l, size, 900)), total = ws.reduce((a, v) => a + v, 0);
    let x = W / 2 - total / 2; const y = 900;
    letras.forEach((l, i) => {
      const p = P(t, .05 + i * .07, .45, E.back), cx = x + ws[i] / 2; x += ws[i];
      if (p <= 0) return;
      if (i === b.icone_em && b.icone) {
        const r = size * .36;
        c.save(); c.globalAlpha *= clamp(p * 2); c.translate(cx, y + size * .02); c.rotate(t * .8); c.scale(p, p);
        c.fillStyle = goldGrad(c, -r, -r, r, r); c.beginPath(); c.arc(0, 0, r, 0, 7); c.fill(); c.restore();
        icone(c, b.icone, cx, y + size * .02, r / 52 * p, C.dark, 9);
      } else txt(c, l, cx, y, { size, weight: 900, color: i % 2 && b.alternar ? 'gold' : C.cream, scale: lerp(1.5, 1, p), alpha: clamp(p * 2), shadow: 30 });
    });
    if (b.sub) { const e = ent(t, .7); txt(c, b.sub, W / 2, 1150 + e.dy, { size: fit(c, b.sub, 820, 54, 700), weight: 700, alpha: e.a, shadow: 20 }); }
  }
};

/* ONDA: bolha grande à esquerda + título forte, onda clara subindo embaixo */
BLOCOS.onda = {
  leitura: b => palavras(b.titulo) + palavras(b.sub || ''),
  draw(c, t, b) {
    bgMesh(c, t, b.seed || 4);
    const pw = P(t, 0, .8, E.out), yw = lerp(H + 100, 1180, pw);
    c.fillStyle = C.cream; c.beginPath(); c.moveTo(0, yw);
    for (let x = 0; x <= W; x += 20) c.lineTo(x, yw - Math.sin(x / W * Math.PI) * 160 + Math.sin(t * 2 + x / 140) * 8);
    c.lineTo(W, H); c.lineTo(0, H); c.closePath(); c.fill();
    const pb = P(t, .25, .55, E.back);
    bolha(c, 300, 900, 160, b.icone, clamp(pb * 2), pb);
    const e = ent(t, .45), size = fit(c, b.titulo, 470, 92, 900);
    txt(c, b.titulo, 510, 860 + e.dy, { size, weight: 900, align: 'left', alpha: e.a, color: C.cream, shadow: 20 });
    if (b.sub) txt(c, b.sub, 512, 860 + size * .9 + e.dy, { size: fit(c, b.sub, 440, 44, 700), weight: 700, align: 'left', italic: true, alpha: e.a, color: C.gold2 });
    if (b.rodape) { const e2 = ent(t, .9); txt(c, b.rodape, W / 2, 1450 + e2.dy, { size: fit(c, b.rodape, 800, 48, 800), weight: 800, color: C.dark, alpha: e2.a }); }
  }
};

/* FRASE em tela clara, palavras entrando em sequência  ex.: [['Mais', 'leve'], ['controle', 'forte']] */
BLOCOS.frase = {
  leitura: b => b.linhas.reduce((n, l) => n + l.reduce((m, [s]) => m + palavras(s), 0), 0),
  draw(c, t, b) {
    (b.fundo === 'escuro' ? bgMesh : bgCream)(c, t, b.seed || 5);
    const escuro = b.fundo === 'escuro';
    const n = b.linhas.length, lh = 140, y0 = 960 - (n - 1) * lh / 2; let k = 0;
    b.linhas.forEach((linha, i) => {
      const y = y0 + i * lh, size = fit(c, linha.map(([s]) => s).join(' '), 840, 104, 900);
      const ws = linha.map(([s, est]) => measure(c, s, size, est === 'forte' ? 900 : 500) + size * .25);
      let x = W / 2 - (ws.reduce((a, v) => a + v, 0) - size * .25) / 2;
      linha.forEach(([s, est], j) => {
        const e = ent(t, .08 + k++ * .16);
        const cor = est === 'forte' ? (escuro ? 'gold' : C.dark) : (escuro ? C.cream : '#7a6a45');
        txt(c, s, x, y + e.dy, { size, weight: est === 'forte' ? 900 : 500, align: 'left', color: cor, alpha: e.a });
        x += ws[j];
      });
    });
  }
};

/* LISTA numerada (dicas, sinais, passos) */
BLOCOS.lista = {
  leitura: b => palavras(b.titulo || '') + b.itens.reduce((n, s) => n + palavras(s), 0),
  draw(c, t, b) {
    bgMesh(c, t, b.seed || 6);
    const e0 = ent(t, .05);
    txt(c, b.titulo, W / 2, 470 + e0.dy, { size: fit(c, b.titulo, 820, 60, 900), weight: 900, alpha: e0.a, shadow: 20 });
    const n = b.itens.length, h = n > 3 ? 170 : 200, gap = 26, y0 = 560;
    b.itens.forEach((s, i) => {
      const e = ent(t, .35 + i * .35), y = y0 + i * (h + gap);
      if (e.a <= 0) return;
      c.save(); c.globalAlpha *= e.a; c.translate(0, e.dy);
      c.fillStyle = 'rgba(0,0,0,.28)'; rr(c, 130, y, 820, h, 30); c.fill();
      c.strokeStyle = 'rgba(236,201,107,.45)'; c.lineWidth = 2; rr(c, 130, y, 820, h, 30); c.stroke();
      c.fillStyle = goldGrad(c, 175, y, 255, y + 80); c.beginPath(); c.arc(215, y + h / 2, 40, 0, 7); c.fill();
      c.restore();
      txt(c, String(i + 1), 215, y + h / 2 + 2 + e.dy, { size: 42, weight: 900, color: C.dark, alpha: e.a });
      const ls = wrap(c, s, 620, 42, 700), lh = 54;
      ls.forEach((l, j) => txt(c, l, 285, y + h / 2 - (ls.length - 1) * lh / 2 + j * lh + e.dy, { size: 42, weight: 700, align: 'left', alpha: e.a }));
    });
  }
};

/* ANTES × DEPOIS */
BLOCOS.antesDepois = {
  leitura: b => b.antes.reduce((n, s) => n + palavras(s), 0) + b.depois.reduce((n, s) => n + palavras(s), 0) + 2,
  draw(c, t, b) {
    c.fillStyle = '#1a0b08'; c.fillRect(0, 0, W, H / 2);
    const g = c.createLinearGradient(0, 0, 0, H / 2); g.addColorStop(0, 'rgba(184,67,47,.45)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, 0, W, H / 2);
    c.save(); c.beginPath(); c.rect(0, H / 2, W, H / 2); c.clip(); bgMesh(c, t, 7); c.restore();
    const lado = (lista, y0, t0, ok) => {
      const e = ent(t, t0); txt(c, ok ? 'DEPOIS' : 'ANTES', W / 2, y0 + e.dy, { size: 56, weight: 900, color: ok ? C.gold2 : '#ff8a6b', alpha: e.a });
      lista.forEach((s, i) => {
        const e2 = ent(t, t0 + .25 + i * .22), y = y0 + 110 + i * 105;
        c.save(); c.globalAlpha *= e2.a; c.strokeStyle = ok ? C.gold2 : '#ff8a6b'; c.lineWidth = 6; c.lineCap = 'round';
        c.beginPath(); if (ok) { c.moveTo(170, y); c.lineTo(185, y + 15); c.lineTo(212, y - 15); } else { c.moveTo(172, y - 16); c.lineTo(206, y + 16); c.moveTo(206, y - 16); c.lineTo(172, y + 16); } c.stroke(); c.restore();
        txt(c, s, 250, y + e2.dy, { size: fit(c, s, 680, 44, 700), weight: 700, align: 'left', alpha: e2.a });
      });
    };
    lado(b.antes, 400, .05, false);
    lado(b.depois, 1100, .9 + b.antes.length * .22, true);
  }
};

/* PLANOS (valores e itens exatamente como no material) */
BLOCOS.planos = {
  leitura: () => 26,
  draw(c, t) {
    bgMesh(c, t, 8);
    const e0 = ent(t, .05); txt(c, 'Planos Candidus', W / 2, 400 + e0.dy, { size: 64, weight: 900, alpha: e0.a, shadow: 20 });
    const pl = [['Candidus Essencial', 'R$ 750', ''], ['Candidus Gestão', 'R$ 1.500', 'Controle e previsibilidade'], ['Candidus Estratégico', 'R$ 2.500', 'Decisões com base nos números']];
    pl.forEach(([n, v, d], i) => {
      const e = ent(t, .35 + i * .45), y = 520 + i * 300;
      if (e.a <= 0) return;
      c.save(); c.globalAlpha *= e.a; c.translate(0, e.dy);
      c.fillStyle = 'rgba(0,0,0,.35)'; rr(c, 130, y, 820, 260, 34); c.fill();
      c.strokeStyle = goldGrad(c, 130, y, 950, y + 260); c.lineWidth = 3; rr(c, 130, y, 820, 260, 34); c.stroke(); c.restore();
      txt(c, n, 180, y + 75 + e.dy, { size: 56, weight: 600, fam: SERIF, align: 'left', alpha: e.a });
      txt(c, v, 180, y + 165 + e.dy, { size: 86, weight: 900, color: C.gold2, align: 'left', alpha: e.a });
      txt(c, '/mês', 180 + measure(c, v, 86, 900) + 14, y + 185 + e.dy, { size: 38, weight: 600, align: 'left', alpha: e.a });
      if (d) txt(c, d, 180, y + 225 + e.dy, { size: 32, weight: 500, align: 'left', alpha: e.a * .85, color: '#e6dfcf' });
    });
  }
};

/* FOTO do Renan com a logo da Candidus atrás */
BLOCOS.foto = {
  leitura: b => palavras(b.texto || '') + 4,
  draw(c, t, b, d) {
    c.fillStyle = C.deep; c.fillRect(0, 0, W, H);
    const img = IMG.foto, z = lerp(1.0, 1.05, t / d), s = Math.max(W / img.width, H / img.height) * z;
    c.drawImage(img, (W - img.width * s) * .85, (H - img.height * s) * .3, img.width * s, img.height * s);
    const g = c.createLinearGradient(0, H * .5, 0, H); g.addColorStop(0, 'rgba(0,23,10,0)'); g.addColorStop(.5, 'rgba(0,23,10,.88)'); g.addColorStop(1, 'rgba(0,23,10,.97)');
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    const e = ent(t, .3); txt(c, 'Renan Cândido', 120, 1250 + e.dy, { size: 76, weight: 800, align: 'left', alpha: e.a });
    const e2 = ent(t, .55); txt(c, 'Fundador da Candidus', 120, 1330 + e2.dy, { size: 42, weight: 600, align: 'left', color: C.gold2, alpha: e2.a });
    if (b.texto) { const e3 = ent(t, .9); txt(c, b.texto, 120, 1410 + e3.dy, { size: fit(c, b.texto, 820, 40, 600), weight: 600, align: 'left', italic: true, alpha: e3.a }); }
  }
};

/* CHAMADA FINAL */
BLOCOS.cta = {
  leitura: b => palavras(b.pergunta) + 5,
  draw(c, t, b) {
    bgMesh(c, t, b.seed || 9);
    const e0 = ent(t, .05);
    const ls = wrap(c, b.pergunta, 820, 68, 900);
    ls.forEach((l, i) => txt(c, l, W / 2, 800 + i * 86 - (ls.length - 1) * 43 + e0.dy, { size: 68, weight: 900, alpha: e0.a, shadow: 20 }));
    const p = P(t, .5, .55, E.back), pulse = 1 + Math.sin(t * 6) * .02 * P(t, 1.2, .3), w = 780;
    c.save(); c.translate(W / 2, 1120); c.scale(p * pulse, p * pulse);
    c.shadowColor = 'rgba(236,201,107,.45)'; c.shadowBlur = 50; c.fillStyle = goldGrad(c, -w / 2, 0, w / 2, 0); rr(c, -w / 2, -70, w, 140, 70); c.fill(); c.restore();
    txt(c, b.acao || 'Envie ‘GESTÃO’ no direct', W / 2, 1122, { size: 50, weight: 900, color: C.dark, scale: p * pulse, alpha: clamp(p * 2) });
    const e3 = ent(t, 1); txt(c, 'Candidus · Gestão Financeira', W / 2, 1290 + e3.dy, { size: 36, weight: 600, color: C.gold2, alpha: e3.a });
  }
};

/* LOGO final com reflexo de luz */
BLOCOS.logo = {
  leitura: () => 3,
  draw(c, t) {
    bgMesh(c, t, 10);
    const cx = W / 2, cy = 960, sc = .85;
    const pi = P(t, .05, .8);
    if (pi > 0) {
      const iw = 330 * sc, ih = iw * IMG.icone.height / IMG.icone.width, x0 = cx + 20 * sc - iw / 2, y0 = cy - 230 * sc - ih / 2;
      c.save(); c.beginPath(); c.rect(x0, y0 + ih * (1 - pi), iw, ih * pi); c.clip(); c.drawImage(IMG.icone, x0, y0, iw, ih); c.restore();
    }
    const p2 = P(t, .35, .7); c.save(); c.translate(cx, cy); c.scale(lerp(1.1, 1, p2), lerp(1.1, 1, p2)); drawImg(c, IMG.nome, 0, 0, 900 * sc, p2); c.restore();
    drawImg(c, IMG.gestao, cx + 40 * sc, cy + 170 * sc, 620 * sc, P(t, .7, .6));
    const ps = P(t, 1, 1, E.inOut);
    if (ps > 0 && ps < 1) {
      const bx = cx - 520 + ps * 1040;
      c.save(); c.beginPath(); c.moveTo(bx - 50, cy - 380); c.lineTo(bx + 40, cy - 380); c.lineTo(bx - 40, cy + 200); c.lineTo(bx - 130, cy + 200); c.closePath(); c.clip();
      c.globalCompositeOperation = 'lighter'; c.globalAlpha = .5; drawImg(c, IMG.nome, cx, cy, 900 * sc); c.restore();
    }
    const e = ent(t, 1.1); txt(c, 'ORGANIZAÇÃO  •  PLANEJAMENTO  •  RESULTADOS', W / 2, 1310 + e.dy, { size: 30, weight: 600, alpha: e.a });
  }
};

/* ---------- linha do tempo ---------- */
/* duração de cada bloco: tempo de leitura confortável, arredondado para o tempo da música */
function duracao(b) {
  const def = BLOCOS[b.t];
  const ler = 1.1 + def.leitura(b) * .36 + (def.extra ? def.extra(b) : 0);
  const d = Math.max(b.min || 2, ler);
  return Math.ceil(d / (2 * BEAT)) * 2 * BEAT;          // múltiplo de 2 tempos (1 s a 120 BPM)
}
function montar(video) {
  let acc = 0;
  const blocos = video.blocos.map((b, i) => { const d = duracao(b); const o = { ...b, i, start: acc, d }; acc += d; return o; });
  return { ...video, blocos, duration: acc };
}
function camera(c, lt, d, i) {
  const p = clamp(lt / d), z = 1 + .03 * p;
  c.translate(W / 2 + Math.sin(i * 1.7) * 8 * p, H / 2); c.scale(z, z); c.translate(-W / 2, -H / 2);
}
function renderFrame(c, v, t) {
  let i = v.blocos.findIndex(b => t < b.start + b.d); if (i < 0) i = v.blocos.length - 1;
  const b = v.blocos[i], lt = t - b.start;
  c.save(); c.clearRect(0, 0, W, H);
  c.save(); camera(c, lt, b.d, i); BLOCOS[b.t].draw(c, lt, b, b.d); c.restore();
  if (i > 0 && lt < .12) { c.fillStyle = `rgba(255,240,200,${(1 - lt / .12) * .35})`; c.fillRect(0, 0, W, H); }  // flash do corte
  const tail = v.duration - t; if (tail < .4) { c.fillStyle = `rgba(0,0,0,${1 - tail / .4})`; c.fillRect(0, 0, W, H); }
  c.restore();
}
