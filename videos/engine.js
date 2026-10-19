/* =====================================================================
   Candidus · motor de animação em canvas (1080x1920, vertical 9:16)
   Cada vídeo define uma lista de cenas { d, tr, draw(c, t, d) }.
   - d    : duração da cena em segundos
   - tr   : transição de entrada ('cut' | 'up' | 'left' | 'circle' | 'torn')
   - draw : desenha a cena no tempo local t (0..d)
   O render é determinístico (renderAt(t)), o que permite exportar
   quadro a quadro para MP4 com export.mjs.
   ===================================================================== */
const W = 1080, H = 1920, FPS = 30;

const C = {
  dark: '#01210f', dark2: '#00170a', deep: '#012b14',
  gold: '#c9962a', gold2: '#ecc96b', goldDeep: '#9c6f14',
  cream: '#f6f0e1', ink: '#062414', red: '#d0503c', white: '#ffffff'
};
const SERIF = "'Cormorant Garamond', Georgia, serif";
const SANS = "'Montserrat', 'Inter', Arial, sans-serif";

/* ---------- easing & tempo ---------- */
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const E = {
  lin: t => t,
  out: t => 1 - Math.pow(1 - t, 3),
  in: t => t * t * t,
  inOut: t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  expo: t => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  back: t => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
  elastic: t => (t <= 0 ? 0 : t >= 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - .75) * (2 * Math.PI) / 3) + 1)
};
/* progresso 0..1 de uma animação que começa em a e dura d */
const P = (t, a, d, ease = E.out) => ease(clamp((t - a) / d));
/* entra em a, sai em b (fade/slide simétrico) */
const inOutP = (t, a, b, fade = .35) => Math.min(P(t, a, fade), 1 - P(t, b - fade, fade, E.in));

/* pseudo-aleatório determinístico */
function rnd(seed) { const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); }

/* ---------- assets ---------- */
const IMG = {};
function loadImg(key, src) {
  return new Promise((res, rej) => { const i = new Image(); i.onload = () => { IMG[key] = i; res(); }; i.onerror = rej; i.src = src; });
}

/* ---------- texto ---------- */
function font(size, weight = 800, fam = SANS, italic = false) { return `${italic ? 'italic ' : ''}${weight} ${size}px ${fam}`; }

function txt(c, s, x, y, o = {}) {
  const { size = 80, weight = 800, fam = SANS, color = C.cream, align = 'center', ls = 0,
          alpha = 1, scale = 1, rot = 0, italic = false, base = 'middle', shadow = 0, stroke = 0, blur = 0 } = o;
  if (alpha <= 0) return;
  c.save();
  c.globalAlpha *= alpha;
  c.translate(x, y); c.rotate(rot); c.scale(scale, scale);
  c.font = font(size, weight, fam, italic);
  c.letterSpacing = ls + 'px';
  c.textAlign = align; c.textBaseline = base;
  if (blur > .3) c.filter = `blur(${blur.toFixed(1)}px)`;
  if (shadow) { c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = shadow; c.shadowOffsetY = shadow / 3; }
  c.fillStyle = color === 'goldgrad' ? goldGrad(c, -size * s.length * .35, -size / 2, size * s.length * .35, size / 2) : color;
  // compensa o espaçamento extra que o canvas adiciona após o último caractere
  const off = align === 'center' ? ls / 2 : 0;
  if (stroke) { c.lineWidth = stroke; c.strokeStyle = color; c.strokeText(s, off, 0); }
  else c.fillText(s, off, 0);
  c.restore();
}

function measure(c, s, size, weight = 800, fam = SANS, ls = 0) {
  c.save(); c.font = font(size, weight, fam); c.letterSpacing = ls + 'px';
  const w = c.measureText(s).width; c.restore(); return w;
}

/* maior tamanho de fonte (até size, mínimo min) em que o texto cabe em maxW */
function fitSize(c, s, maxW, size, weight = 700, min = 30, fam = SANS, ls = 0) {
  while (size > min && measure(c, s, size, weight, fam, ls) > maxW) size -= 1;
  return size;
}

function wrap(c, s, maxW, size, weight = 600, fam = SANS) {
  const words = s.split(' '); const lines = []; let line = '';
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (measure(c, test, size, weight, fam) > maxW && line) { lines.push(line); line = w; } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

function para(c, s, x, y, o = {}) {
  const { size = 44, weight = 500, fam = SANS, maxW = 860, lh = 1.35, color = C.cream, alpha = 1, align = 'center', blur = 0 } = o;
  const lines = wrap(c, s, maxW, size, weight, fam);
  lines.forEach((l, i) => txt(c, l, x, y + i * size * lh, { size, weight, fam, color, alpha, align, blur }));
  return lines.length * size * lh;
}

function goldGrad(c, x0, y0, x1, y1) {
  const g = c.createLinearGradient(x0, y0, x1, y1);
  g.addColorStop(0, '#a87a1c'); g.addColorStop(.35, '#f3d27a'); g.addColorStop(.6, '#c9962a'); g.addColorStop(1, '#f0cf78');
  return g;
}

/* Letras animadas individualmente.
   mode: 'drop' (caem de cima), 'rise' (sobem), 'scatter' (vêm de posições espalhadas), 'pop' (escala) */
function chars(c, s, cx, cy, t, o = {}) {
  const { size = 120, weight = 900, fam = SANS, color = C.cream, ls = 0, start = 0, stagger = .04,
          dur = .5, mode = 'drop', seed = 1, alpha = 1 } = o;
  c.save(); c.font = font(size, weight, fam);
  const ws = [...s].map(ch => c.measureText(ch).width + ls);
  c.restore();
  const total = ws.reduce((a, b) => a + b, 0) - ls;
  let x = cx - total / 2;
  [...s].forEach((ch, i) => {
    const p = P(t, start + i * stagger, dur, mode === 'pop' ? E.back : E.out);
    const px = x + ws[i] / 2 - ls / 2; x += ws[i];
    if (ch === ' ' || p <= 0) return;
    let dx = 0, dy = 0, rot = 0, sc = 1;
    if (mode === 'drop') { dy = -(1 - p) * 260; rot = (1 - p) * (rnd(seed + i) - .5) * 1.2; }
    if (mode === 'rise') { dy = (1 - p) * 160; }
    if (mode === 'scatter') {
      dx = (1 - p) * (rnd(seed + i) - .5) * 900; dy = (1 - p) * (rnd(seed + i * 7) - .5) * 1100;
      rot = (1 - p) * (rnd(seed + i * 3) - .5) * 3;
    }
    if (mode === 'pop') { sc = Math.max(0, p); }
    txt(c, ch, px + dx, cy + dy, { size, weight, fam, color, alpha: alpha * clamp(p * 1.6), rot, scale: sc });
  });
  return total;
}

/* efeito máquina de escrever com cursor */
function typewriter(c, s, x, y, t, o = {}) {
  const { start = 0, cps = 14, size = 100, color = C.ink, weight = 900, cursor = true, ls = 4, fam = SANS } = o;
  const n = Math.floor(clamp((t - start) * cps, 0, s.length));
  const shown = s.slice(0, n);
  const full = measure(c, s, size, weight, fam, ls);
  const w = measure(c, shown, size, weight, fam, ls);
  const left = x - full / 2;
  txt(c, shown, left, y, { size, weight, color, align: 'left', ls, fam });
  if (cursor && (Math.floor(t * 2.4) % 2 === 0 || n < s.length)) {
    c.fillStyle = color; c.globalAlpha = .55; c.fillRect(left + w + 10, y - size * .42, size * .1, size * .84); c.globalAlpha = 1;
  }
}

/* ---------- animação padrão (surge deslizando levemente para cima) ---------- */
const RISE = 36, IN_DUR = .55;
function fu(t, start, dur = IN_DUR) { const p = P(t, start, dur, E.out); return { a: p, dy: (1 - p) * RISE, blur: (1 - p) * 14 }; }
/* texto com a animação padrão */
function T(c, s, x, y, t, start, o = {}) { const f = fu(t, start); txt(c, s, x, y + f.dy, { ...o, alpha: (o.alpha ?? 1) * f.a, blur: f.blur }); }
/* parágrafo com a animação padrão; retorna a altura usada */
function TP(c, s, x, y, t, start, o = {}) { const f = fu(t, start); return para(c, s, x, y + f.dy, { ...o, alpha: (o.alpha ?? 1) * f.a, blur: f.blur }); }

/* ---------- formas ---------- */
function rr(c, x, y, w, h, r) {
  c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
}

function check(c, x, y, r, p, col = C.gold) {
  if (p <= 0) return;
  c.save(); c.translate(x, y); c.scale(E.back(p), E.back(p));
  c.fillStyle = col; c.beginPath(); c.arc(0, 0, r, 0, Math.PI * 2); c.fill();
  c.strokeStyle = C.dark; c.lineWidth = r * .22; c.lineCap = 'round'; c.lineJoin = 'round';
  c.beginPath(); c.moveTo(-r * .42, 0); c.lineTo(-r * .1, r * .32); c.lineTo(r * .45, -r * .3); c.stroke();
  c.restore();
}

function cross(c, x, y, r, p, col = C.red) {
  if (p <= 0) return;
  c.save(); c.translate(x, y); c.rotate((1 - p) * 1.5); c.scale(E.back(p), E.back(p));
  c.fillStyle = col; c.beginPath(); c.arc(0, 0, r, 0, Math.PI * 2); c.fill();
  c.strokeStyle = C.cream; c.lineWidth = r * .22; c.lineCap = 'round';
  c.beginPath(); c.moveTo(-r * .35, -r * .35); c.lineTo(r * .35, r * .35); c.moveTo(r * .35, -r * .35); c.lineTo(-r * .35, r * .35); c.stroke();
  c.restore();
}

function line(c, x0, y, x1, p, col = C.gold, w = 4) {
  if (p <= 0) return;
  c.strokeStyle = col; c.lineWidth = w; c.beginPath(); c.moveTo(x0, y); c.lineTo(lerp(x0, x1, p), y); c.stroke();
}

/* imagem com encaixe tipo "cover" + zoom (Ken Burns) */
function cover(c, img, x, y, w, h, zoom = 1, fx = .5, fy = .5) {
  const s = Math.max(w / img.width, h / img.height) * zoom;
  const iw = img.width * s, ih = img.height * s;
  c.drawImage(img, x + (w - iw) * fx, y + (h - ih) * fy, iw, ih);
}

function drawImg(c, img, cx, cy, w, o = {}) {
  const { alpha = 1, scale = 1 } = o; if (alpha <= 0) return;
  const h = w * img.height / img.width;
  c.save(); c.globalAlpha *= alpha; c.translate(cx, cy); c.scale(scale, scale);
  c.drawImage(img, -w / 2, -h / 2, w, h); c.restore();
}

/* ícone da logo com as barras "crescendo" de baixo para cima */
function logoIcon(c, cx, cy, w, p) {
  const img = IMG.icone; const h = w * img.height / img.width;
  if (p <= 0) return;
  c.save(); c.beginPath(); c.rect(cx - w / 2, cy + h / 2 - h * E.out(p), w, h * E.out(p)); c.clip();
  c.drawImage(img, cx - w / 2, cy - h / 2, w, h); c.restore();
}

/* logo completa: ícone + CANDIDUS + GESTÃO FINANCEIRA */
function logoFull(c, cx, cy, sc, t, start = 0) {
  logoIcon(c, cx + 20 * sc, cy - 230 * sc, 330 * sc, P(t, start, .9));
  const p2 = P(t, start + .45, .9);
  drawImg(c, IMG.nome, cx, cy, 900 * sc, { alpha: p2, scale: lerp(1.12, 1, p2) });
  const p3 = P(t, start + .9, .7);
  drawImg(c, IMG.gestao, cx + 40 * sc, cy + 170 * sc - (1 - p3) * 30, 620 * sc, { alpha: p3 });
  // reflexo de luz atravessando a logo
  const ps = P(t, start + 1.2, 1.1, E.inOut);
  if (ps > 0 && ps < 1) {
    const bx = cx - 600 * sc + ps * 1200 * sc;
    c.save(); c.beginPath(); c.moveTo(bx - 60 * sc, cy - 420 * sc); c.lineTo(bx + 40 * sc, cy - 420 * sc);
    c.lineTo(bx - 40 * sc, cy + 220 * sc); c.lineTo(bx - 140 * sc, cy + 220 * sc); c.closePath(); c.clip();
    c.globalCompositeOperation = 'lighter'; c.globalAlpha *= .55;
    drawImg(c, IMG.nome, cx, cy, 900 * sc); logoIcon(c, cx + 20 * sc, cy - 230 * sc, 330 * sc, 1);
    c.restore();
  }
}

/* ---------- fundos ---------- */
function grid(c, col, a) {
  c.save(); c.globalAlpha *= a; c.strokeStyle = col; c.lineWidth = 1;
  for (let x = 0; x <= W; x += 60) { c.beginPath(); c.moveTo(x + .5, 0); c.lineTo(x + .5, H); c.stroke(); }
  for (let y = 0; y <= H; y += 60) { c.beginPath(); c.moveTo(0, y + .5); c.lineTo(W, y + .5); c.stroke(); }
  c.restore();
}

function bgDark(c, t = 0) {
  const g = c.createRadialGradient(W / 2, H * .4, 60, W / 2, H * .5, H * .9);
  g.addColorStop(0, '#05391d'); g.addColorStop(.5, C.dark); g.addColorStop(1, '#000d05');
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  // luzes desfocadas (bokeh) — profundidade de campo
  c.save(); const base = c.globalAlpha; c.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 9; i++) {
    const x = rnd(i * 3 + 1) * W + Math.sin(t * .25 + i) * 60, y = rnd(i * 3 + 2) * H + Math.cos(t * .2 + i * 1.7) * 80;
    const r = 120 + rnd(i * 3 + 3) * 260, quente = i % 3 !== 0;
    const b = c.createRadialGradient(x, y, 0, x, y, r);
    b.addColorStop(0, quente ? 'rgba(236,190,90,.10)' : 'rgba(60,170,110,.08)'); b.addColorStop(1, 'rgba(0,0,0,0)');
    c.globalAlpha = base; c.fillStyle = b; c.fillRect(x - r, y - r, r * 2, r * 2);
  }
  c.restore();
  // poeira dourada fina
  c.save(); const a0 = c.globalAlpha;
  for (let i = 0; i < 18; i++) {
    const x = rnd(i) * W + Math.sin(t * .5 + i) * 20, sp = 12 + rnd(i + 50) * 25;
    const y = (rnd(i + 9) * H - t * sp) % H, yy = y < 0 ? y + H : y;
    c.globalAlpha = a0 * (.08 + rnd(i + 3) * .18); c.fillStyle = C.gold2;
    c.beginPath(); c.arc(x, yy, 1.2 + rnd(i + 7) * 2.2, 0, Math.PI * 2); c.fill();
  }
  c.restore();
}

/* acabamento de cinema aplicado a todo quadro: vinheta + granulação de filme */
let _grao = null;
function grao() {
  if (_grao) return _grao;
  const cv = document.createElement('canvas'); cv.width = cv.height = 256; const g = cv.getContext('2d');
  const im = g.createImageData(256, 256);
  for (let k = 0; k < im.data.length; k += 4) { const v = 128 + (rnd(k * .37) - .5) * 255; im.data[k] = im.data[k + 1] = im.data[k + 2] = v; im.data[k + 3] = 255; }
  g.putImageData(im, 0, 0); return (_grao = cv);
}
function acabamento(c, t) {
  const v = c.createRadialGradient(W / 2, H / 2, H * .32, W / 2, H / 2, H * .78);
  v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.42)');
  c.fillStyle = v; c.fillRect(0, 0, W, H);
  if (typeof document === 'undefined') return;
  c.save(); c.globalAlpha = .07; c.globalCompositeOperation = 'overlay';
  const f = Math.floor(t * FPS), ox = (rnd(f) * 256) | 0, oy = (rnd(f + 99) * 256) | 0;
  c.translate(-ox, -oy); c.fillStyle = c.createPattern(grao(), 'repeat'); c.fillRect(0, 0, W + 256, H + 256);
  c.restore();
}

/* câmera: avanço lento e leve deriva em cada cena */
function camera(c, lt, d, idx) {
  const p = clamp(lt / Math.max(d, .01)), z = 1 + .035 * p;
  c.translate(W / 2 + Math.sin(idx * 1.3) * 10 * p, H / 2 + Math.cos(idx * .9) * 8 * p); c.scale(z, z); c.translate(-W / 2, -H / 2);
}

function bgGold(c) {
  const g = c.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, '#d8a73c'); g.addColorStop(.5, '#c9962a'); g.addColorStop(1, '#b58420');
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  grid(c, '#ffffff', .09);
}

function bgCream(c) {
  c.fillStyle = C.cream; c.fillRect(0, 0, W, H); grid(c, C.dark, .05);
}

/* ---------- transições ---------- */
function clipFor(c, tr, p) {
  c.beginPath();
  if (tr === 'up') c.rect(0, H * (1 - p), W, H);
  else if (tr === 'left') c.rect(W * (1 - p), 0, W, H);
  else if (tr === 'circle') c.arc(W / 2, H / 2, Math.hypot(W, H) * .55 * p, 0, Math.PI * 2);
  else if (tr === 'torn') {
    // borda "rasgada" subindo, como no vídeo de referência
    const y0 = H * (1 - p) - 40 * (1 - p);
    c.moveTo(0, H); c.lineTo(0, y0);
    for (let x = 0; x <= W; x += 30) c.lineTo(x, y0 + (rnd(x) - .5) * 46);
    c.lineTo(W, H); c.closePath();
  } else c.rect(0, 0, W, H);
  c.clip();
}

/* ---------- linha do tempo ---------- */
/* VO_DELAY: quanto tempo após o início da cena a narração começa.
   Se houver narração (audio/duracoes.js), a cena é esticada para a fala caber. */
const VO_DELAY = .25, VO_TAIL = .4;
function makeTimeline(scenes, vo = []) {
  let acc = 0;
  scenes.forEach((s, i) => {
    s.vo = vo[i] || 0; s.idx = i; s.video = vo.video;
    if (s.vo) s.d = Math.max(s.d, VO_DELAY + s.vo + VO_TAIL);
    s.start = acc; acc += s.d;
  });
  return { scenes, duration: acc };
}
const voDur = v => Object.assign((typeof VO !== 'undefined' && VO[v]) || [], { video: v });
/* sincronia voz × imagem: momento (s, dentro da cena) em que a narração chega ao trecho `frase`.
   Estimativa proporcional ao texto, contando as pausas de pontuação. Sem narração, usa `fb`. */
function cue(sc, frase, fb) {
  const txt = sc && sc.vo && typeof VO_TXT !== 'undefined' && VO_TXT[sc.video] && VO_TXT[sc.video][sc.idx];
  if (!txt) return fb;
  const peso = s => s.length + (s.match(/[.?!:]/g) || []).length * 6 + (s.match(/[,;]/g) || []).length * 2;
  // preciso: início real de cada frase (gerado frase a frase); dentro da frase, proporcional ao texto
  const segs = typeof VO_SEG !== 'undefined' && VO_SEG[sc.video] && VO_SEG[sc.video][sc.idx];
  if (segs && segs.length) {
    for (const [ini, dur, f] of segs) {
      const j = f.toLowerCase().indexOf(frase.toLowerCase());
      if (j >= 0) return Math.max(fb * .5, VO_DELAY + ini + dur * peso(f.slice(0, j)) / peso(f) - .2);
    }
  }
  const i = txt.toLowerCase().indexOf(frase.toLowerCase());
  if (i < 0) return fb;
  return Math.max(fb * .5, VO_DELAY + sc.vo * peso(txt.slice(0, i)) / peso(txt) - .2);
}

const TR_DUR = .42, FADE_DUR = .3;
function renderFrame(c, tl, t) {
  const { scenes } = tl;
  let i = scenes.findIndex(s => t < s.start + s.d); if (i < 0) i = scenes.length - 1;
  const s = scenes[i]; const lt = t - s.start;
  const desenha = (sc, k, tt) => { c.save(); camera(c, tt, sc.d, k); sc.draw(c, tt, sc.d); c.restore(); };
  c.save(); c.clearRect(0, 0, W, H);
  if (i > 0 && s.tr === 'fade' && lt < FADE_DUR) {
    // dissolve: a nova cena fica por baixo e a anterior (congelada) some rápido por cima
    const prev = scenes[i - 1];
    desenha(s, i, lt);
    c.save(); c.globalAlpha = 1 - E.inOut(lt / FADE_DUR); desenha(prev, i - 1, prev.d - .001); c.restore();
  } else if (i > 0 && s.tr && s.tr !== 'cut' && lt < TR_DUR) {
    const prev = scenes[i - 1];
    desenha(prev, i - 1, prev.d - .001);
    c.save(); clipFor(c, s.tr, E.inOut(lt / TR_DUR)); desenha(s, i, lt); c.restore();
  } else {
    desenha(s, i, lt);
  }
  // brilho quente sutil nas trocas de cena (light leak)
  if (i > 0 && lt < .6) {
    const a = Math.sin(Math.PI * lt / .6) * .16;
    const lk = c.createLinearGradient(0, 0, W, H * .6);
    lk.addColorStop(0, `rgba(255,190,90,${a})`); lk.addColorStop(.5, `rgba(255,150,60,${a * .4})`); lk.addColorStop(1, 'rgba(0,0,0,0)');
    c.save(); c.globalCompositeOperation = 'screen'; c.fillStyle = lk; c.fillRect(0, 0, W, H); c.restore();
  }
  acabamento(c, t);
  // fade final para preto
  const tail = tl.duration - t;
  if (tail < .5) { c.globalAlpha = 1 - tail / .5; c.fillStyle = '#000'; c.fillRect(0, 0, W, H); c.globalAlpha = 1; }
  c.restore();
}
