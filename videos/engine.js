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
          alpha = 1, scale = 1, rot = 0, italic = false, base = 'middle', shadow = 0, stroke = 0 } = o;
  if (alpha <= 0) return;
  c.save();
  c.globalAlpha *= alpha;
  c.translate(x, y); c.rotate(rot); c.scale(scale, scale);
  c.font = font(size, weight, fam, italic);
  c.letterSpacing = ls + 'px';
  c.textAlign = align; c.textBaseline = base;
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
  const { size = 44, weight = 500, fam = SANS, maxW = 860, lh = 1.35, color = C.cream, alpha = 1, align = 'center' } = o;
  const lines = wrap(c, s, maxW, size, weight, fam);
  lines.forEach((l, i) => txt(c, l, x, y + i * size * lh, { size, weight, fam, color, alpha, align }));
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
}

/* ---------- fundos ---------- */
function grid(c, col, a) {
  c.save(); c.globalAlpha = a; c.strokeStyle = col; c.lineWidth = 1;
  for (let x = 0; x <= W; x += 60) { c.beginPath(); c.moveTo(x + .5, 0); c.lineTo(x + .5, H); c.stroke(); }
  for (let y = 0; y <= H; y += 60) { c.beginPath(); c.moveTo(0, y + .5); c.lineTo(W, y + .5); c.stroke(); }
  c.restore();
}

function bgDark(c, t = 0) {
  const g = c.createRadialGradient(W / 2, H * .38, 80, W / 2, H * .5, H * .85);
  g.addColorStop(0, '#04361c'); g.addColorStop(.55, C.dark); g.addColorStop(1, C.dark2);
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  grid(c, '#ffffff', .035);
  // partículas douradas flutuando
  for (let i = 0; i < 26; i++) {
    const x = rnd(i) * W, sp = 20 + rnd(i + 50) * 40;
    const y = (rnd(i + 9) * H - t * sp) % H; const yy = y < 0 ? y + H : y;
    c.globalAlpha = .12 + rnd(i + 3) * .25; c.fillStyle = C.gold2;
    c.beginPath(); c.arc(x, yy, 1.5 + rnd(i + 7) * 3, 0, Math.PI * 2); c.fill();
  }
  c.globalAlpha = 1;
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
function makeTimeline(scenes) {
  let acc = 0; scenes.forEach(s => { s.start = acc; acc += s.d; });
  return { scenes, duration: acc };
}

const TR_DUR = .42;
function renderFrame(c, tl, t) {
  const { scenes } = tl;
  let i = scenes.findIndex(s => t < s.start + s.d); if (i < 0) i = scenes.length - 1;
  const s = scenes[i]; const lt = t - s.start;
  c.save(); c.clearRect(0, 0, W, H);
  if (i > 0 && s.tr && s.tr !== 'cut' && lt < TR_DUR) {
    const prev = scenes[i - 1];
    c.save(); prev.draw(c, prev.d - .001 + lt * .3, prev.d); c.restore();
    c.save(); clipFor(c, s.tr, E.inOut(lt / TR_DUR)); s.draw(c, lt, s.d); c.restore();
  } else {
    s.draw(c, lt, s.d);
  }
  // fade final para preto
  const tail = tl.duration - t;
  if (tail < .5) { c.globalAlpha = 1 - tail / .5; c.fillStyle = '#000'; c.fillRect(0, 0, W, H); c.globalAlpha = 1; }
  c.restore();
}
