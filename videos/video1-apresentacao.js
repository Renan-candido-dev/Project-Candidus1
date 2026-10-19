/* =====================================================================
   VÍDEO 1 · Apresentação da Candidus (roteiro conversado, com narração)
   Textos dentro da área segura do Instagram (x 120–940, y 300–1480).
   Ilustrações desenhadas em canvas (sem imagens de terceiros).
   cue(this, 'trecho', padrão) = momento em que a narração chega ao trecho.
   ===================================================================== */
const CFG1 = {
  nome: 'Renan Cândido',
  cargo: 'Fundador da Candidus',
  regimes: ['MEI', 'Simples Nacional', 'Lucro Presumido', 'Lucro Real'],
  organizamos: ['Contas a pagar e receber', 'Conciliação bancária', 'Fluxo de caixa', 'Organização das despesas'],
  ctaAcao: 'Envie ‘GESTÃO’ no direct'
};

/* ---------- componentes compartilhados (também usados no vídeo 2) ---------- */
function numCard(c, t, start, n, texto, y, o = {}) {
  const { w = 800, h = 190, icon = 'num' } = o;
  const f = fu(t, start); if (f.a <= 0) return;
  const x = W / 2 - w / 2;
  c.save(); c.globalAlpha *= f.a; c.translate(0, f.dy);
  c.fillStyle = 'rgba(255,255,255,.045)'; rr(c, x, y, w, h, 28); c.fill();
  c.strokeStyle = 'rgba(236,201,107,.35)'; c.lineWidth = 2; rr(c, x, y, w, h, 28); c.stroke();
  const cx = x + 80, cy = y + h / 2;
  if (icon === 'num') {
    c.fillStyle = goldGrad(c, cx - 36, cy - 36, cx + 36, cy + 36); c.beginPath(); c.arc(cx, cy, 36, 0, Math.PI * 2); c.fill();
    txt(c, String(n), cx, cy + 2, { size: 38, weight: 900, color: C.dark });
  } else {
    c.strokeStyle = C.gold2; c.lineWidth = 3; c.beginPath(); c.arc(cx, cy, 34, 0, Math.PI * 2); c.stroke();
    c.lineCap = 'round'; c.beginPath(); c.moveTo(cx - 13, cy); c.lineTo(cx + 13, cy); c.stroke();
  }
  const lines = wrap(c, texto, w - 190, 42, 700);
  const lh = 42 * 1.3, y0 = cy - (lines.length - 1) * lh / 2;
  lines.forEach((l, i) => txt(c, l, x + 150, y0 + i * lh + 2, { size: 42, weight: 700, align: 'left' }));
  c.restore();
}

function ctaPill(c, t, start, texto, y, w = 780) {
  const f = fu(t, start); if (f.a <= 0) return;
  c.save(); c.globalAlpha *= f.a; c.translate(0, f.dy);
  c.shadowColor = 'rgba(201,150,42,.35)'; c.shadowBlur = 40;
  c.fillStyle = goldGrad(c, W / 2 - w / 2, 0, W / 2 + w / 2, 0); rr(c, W / 2 - w / 2, y - 66, w, 132, 66); c.fill();
  c.restore();
  txt(c, texto, W / 2, y + 2 + f.dy, { size: 48, weight: 900, color: C.dark, alpha: f.a });
}

function smallLogo(c, t, start, y, sc = .55) {
  const f = fu(t, start);
  c.save(); c.globalAlpha *= f.a; c.translate(0, f.dy);
  drawImg(c, IMG.icone, W / 2 + 10 * sc, y - 210 * sc, 300 * sc);
  drawImg(c, IMG.nome, W / 2, y, 860 * sc);
  drawImg(c, IMG.gestao, W / 2 + 38 * sc, y + 165 * sc, 590 * sc);
  c.restore();
}

/* ---------- ilustrações ---------- */
function nota(c, x, y, rot, s = 1, a = 1) {   // cédula estilizada
  c.save(); c.globalAlpha *= a; c.translate(x, y); c.rotate(rot); c.scale(s, s);
  const g = c.createLinearGradient(-110, -55, 110, 55); g.addColorStop(0, '#2f7a4f'); g.addColorStop(1, '#1d5a38');
  c.fillStyle = g; rr(c, -110, -55, 220, 110, 10); c.fill();
  c.strokeStyle = 'rgba(236,201,107,.8)'; c.lineWidth = 3; rr(c, -100, -45, 200, 90, 6); c.stroke();
  c.beginPath(); c.arc(0, 0, 28, 0, Math.PI * 2); c.stroke();
  txt(c, 'R$', 0, 2, { size: 30, weight: 900, color: C.gold2 });
  c.restore();
}

function dinheiroVoando(c, t) {        // cédulas saindo e sumindo da tela
  for (let i = 0; i < 14; i++) {
    const t0 = .2 + i * .22, p = clamp((t - t0) / 2.2);
    if (p <= 0 || p >= 1) continue;
    const ang = -Math.PI / 2 + (rnd(i + 5) - .5) * 2.4, dist = 300 + rnd(i + 9) * 900;
    const x = W / 2 + Math.cos(ang) * dist * E.in(p) + (rnd(i) - .5) * 120;
    const y = 1320 + Math.sin(ang) * dist * E.in(p) * .9;
    nota(c, x, y, (rnd(i + 2) - .5) * 1.5 + p * (rnd(i + 4) - .5) * 4, .9, Math.min(1, (1 - p) * 2.2) * clamp(p * 6));
  }
}

function papel(c, x, y, rot, carimbo, seed) {   // conta/boleto
  c.save(); c.translate(x, y); c.rotate(rot);
  c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = 18; c.shadowOffsetY = 8;
  c.fillStyle = '#f3efe6'; c.fillRect(-150, -100, 300, 200); c.shadowColor = 'transparent';
  c.fillStyle = '#1f4e8a'; c.fillRect(-150, -100, 300, 26);
  c.fillStyle = 'rgba(40,40,40,.28)';
  for (let k = 0; k < 6; k++) c.fillRect(-125, -55 + k * 22, 160 + rnd(seed + k) * 90, 7);
  if (carimbo) {
    c.rotate(-.25); c.strokeStyle = '#c0392b'; c.lineWidth = 5; c.strokeRect(-95, 10, 190, 52);
    txt(c, carimbo, 0, 38, { size: 30, weight: 900, color: '#c0392b', ls: 2 });
  }
  c.restore();
}

function calculadora(c, x, y, rot) {
  c.save(); c.translate(x, y); c.rotate(rot);
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 20; c.shadowOffsetY = 10;
  c.fillStyle = '#2a2a2a'; rr(c, -95, -140, 190, 280, 18); c.fill(); c.shadowColor = 'transparent';
  c.fillStyle = '#7d8c6a'; rr(c, -75, -120, 150, 50, 6); c.fill();
  txt(c, '-1.248,00', 62, -95, { size: 22, weight: 700, color: '#1d2416', align: 'right' });
  c.fillStyle = '#444';
  for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) { rr(c, -75 + k * 39, -50 + r * 44, 32, 34, 6); c.fill(); }
  c.restore();
}

function mesaBaguncada(c, t) {          // referência: contas espalhadas à noite
  c.fillStyle = '#0d0f0c'; c.fillRect(0, 0, W, H);
  const lamp = c.createRadialGradient(170, 760, 40, 170, 760, 1100);
  lamp.addColorStop(0, 'rgba(255,170,80,.42)'); lamp.addColorStop(.5, 'rgba(120,70,30,.18)'); lamp.addColorStop(1, 'rgba(0,0,0,0)');
  c.fillStyle = lamp; c.fillRect(0, 0, W, H);
  c.fillStyle = '#3a2618'; c.fillRect(0, 1000, W, 920);                       // mesa
  const wood = c.createLinearGradient(0, 1000, 0, H); wood.addColorStop(0, 'rgba(255,170,80,.18)'); wood.addColorStop(1, 'rgba(0,0,0,.6)');
  c.fillStyle = wood; c.fillRect(0, 1000, W, 920);
  const pilha = [[300, 1180, -.3, 'VENCIDO'], [700, 1150, .25, ''], [520, 1290, .1, 'ATRASADO'], [240, 1400, .4, ''],
                 [820, 1360, -.35, 'VENCIDO'], [480, 1470, -.15, ''], [700, 1520, .3, 'COBRANÇA'], [330, 1560, -.4, '']];
  pilha.forEach(([x, y, r, s], i) => {
    const p = P(t, .1 + i * .18, .5, E.out); if (p <= 0) return;
    papel(c, x, y - (1 - p) * 700, r + (1 - p) * (rnd(i) - .5) * 2, s, i * 11);
  });
  const pc = P(t, 1.2, .5, E.back);
  if (pc > 0) calculadora(c, 760 + (1 - pc) * 300, 1250, .18);
  const v = c.createRadialGradient(W / 2, H / 2, 400, W / 2, H / 2, 1250);    // vinheta
  v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.75)'); c.fillStyle = v; c.fillRect(0, 0, W, H);
  const topo = c.createLinearGradient(0, 250, 0, 900); topo.addColorStop(0, 'rgba(0,0,0,.6)'); topo.addColorStop(1, 'rgba(0,0,0,0)');
  c.fillStyle = topo; c.fillRect(0, 0, W, 900);
}

function relatorio(c, t, start) {       // referência: gráfico no papel
  const f = fu(t, start, .7); if (f.a <= 0) return;
  c.save(); c.globalAlpha *= f.a; c.translate(W / 2, 880 + f.dy); c.rotate(-.04);
  c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = 40; c.shadowOffsetY = 18;
  c.fillStyle = '#f7f4ec'; rr(c, -380, -300, 760, 600, 22); c.fill(); c.shadowColor = 'transparent';
  txt(c, 'Relatório mensal', -330, -245, { size: 34, weight: 800, color: C.dark, align: 'left' });
  c.strokeStyle = 'rgba(1,33,15,.12)'; c.lineWidth = 2;
  for (let k = 0; k < 5; k++) { c.beginPath(); c.moveTo(-330, 210 - k * 90); c.lineTo(330, 210 - k * 90); c.stroke(); }
  const alt = [120, 170, 150, 230, 280, 340], cores = [C.dark, C.gold, C.dark, C.gold, C.dark, C.gold];
  alt.forEach((h, i) => {
    const p = P(t, start + .4 + i * .15, .6, E.out), bh = h * p;
    c.fillStyle = cores[i]; rr(c, -300 + i * 105, 210 - bh, 62, Math.max(bh, 1), 8); c.fill();
  });
  const pts = alt.map((h, i) => [-269 + i * 105, 170 - h * .95]);
  const pl = P(t, start + 1.2, 1.2, E.inOut);
  c.strokeStyle = '#2e9d5b'; c.lineWidth = 7; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath();
  const n = pl * (pts.length - 1);
  pts.forEach(([x, y], i) => {
    if (i > Math.ceil(n)) return;
    const [px, py] = i > n ? [lerp(pts[i - 1][0], x, n - i + 1), lerp(pts[i - 1][1], y, n - i + 1)] : [x, y];
    i ? c.lineTo(px, py) : c.moveTo(px, py);
  });
  c.stroke();
  if (pl >= 1) { c.fillStyle = '#2e9d5b'; c.beginPath(); c.arc(pts[5][0], pts[5][1], 12, 0, Math.PI * 2); c.fill(); }
  c.restore();
}

function chip(c, t, start, texto, x, y, w) {
  const f = fu(t, start); if (f.a <= 0) return;
  c.save(); c.globalAlpha *= f.a; c.translate(0, f.dy);
  c.fillStyle = 'rgba(236,201,107,.12)'; rr(c, x - w / 2, y - 48, w, 96, 48); c.fill();
  c.strokeStyle = 'rgba(236,201,107,.6)'; c.lineWidth = 2; rr(c, x - w / 2, y - 48, w, 96, 48); c.stroke();
  c.restore();
  txt(c, texto, x, y + 2 + f.dy, { size: 40, weight: 700, alpha: f.a });
}

function checkLinha(c, t, start, texto, y) {
  const f = fu(t, start); if (f.a <= 0) return;
  check(c, 170, y + f.dy, 26, P(t, start, .4));
  T(c, texto, 220, y + 2, t, start, { size: fitSize(c, texto, 940 - 220, 42, 700), weight: 700, align: 'left' });
}

/* ---------- linha do tempo ---------- */
const VIDEO1 = makeTimeline([
  /* 1 · Você sabe quanto lucra? */
  { d: 2.6, sfx: [['abertura', .05]], draw(c, t) {
      bgDark(c, t);
      T(c, 'Você sabe quanto', W / 2, 800, t, .15, { size: 76, weight: 700 });
      T(c, 'a sua empresa', W / 2, 895, t, .15, { size: 76, weight: 700 });
      T(c, 'realmente lucra?', W / 2, 1030, t, cue(this, 'realmente', .6), { size: 86, weight: 900, color: 'goldgrad' });
  } },

  /* 2 · Não? */
  { d: 1.4, tr: 'fade', draw(c, t) {
      bgDark(c, t);
      const p = P(t, .05, .45, E.back);
      txt(c, 'Não?', W / 2, 920, { size: 200, weight: 900, scale: lerp(.85, 1, p), alpha: clamp(p * 1.5) });
  } },

  /* 3 · Para onde o dinheiro vai? */
  { d: 3.2, tr: 'fade', draw(c, t) {
      bgDark(c, t);
      dinheiroVoando(c, t);
      T(c, 'Mas pelo menos sabe', W / 2, 600, t, .1, { size: 66, weight: 700 });
      T(c, 'para onde o seu', W / 2, 700, t, cue(this, 'para onde', .5), { size: 80, weight: 900, color: 'goldgrad' });
      T(c, 'dinheiro vai?', W / 2, 800, t, cue(this, 'para onde', .5), { size: 80, weight: 900, color: 'goldgrad' });
  } },

  /* 4 · Também não? */
  { d: 1.6, tr: 'fade', draw(c, t) {
      bgDark(c, t);
      const p = P(t, .05, .45, E.back);
      txt(c, 'Também', W / 2, 860, { size: 120, weight: 900, scale: lerp(.85, 1, p), alpha: clamp(p * 1.5) });
      txt(c, 'não?', W / 2, 1000, { size: 120, weight: 900, scale: lerp(.85, 1, p), alpha: clamp(p * 1.5), color: 'goldgrad' });
  } },

  /* 5 · Financeiro bagunçado */
  { d: 3.6, tr: 'fade', sfx: [['transicao', 0]], draw(c, t) {
      mesaBaguncada(c, t);
      T(c, 'Então o seu financeiro', W / 2, 470, t, .2, { size: 62, weight: 700 });
      T(c, 'está bagunçado.', W / 2, 580, t, cue(this, 'bagunçado', .6), { size: 92, weight: 900, color: '#ff8a6b' });
  } },

  /* 6 · Vou te ajudar */
  { d: 2.4, tr: 'fade', draw(c, t) {
      bgDark(c, t);
      T(c, 'Mas eu vou', W / 2, 860, t, .1, { size: 80, weight: 700 });
      T(c, 'te ajudar nisso.', W / 2, 970, t, cue(this, 'ajudar', .4), { size: 88, weight: 900, color: 'goldgrad' });
  } },

  /* 7 · Te apresento a Candidus */
  { d: 3.8, tr: 'fade', sfx: [['logo', .25]], draw(c, t) {
      bgDark(c, t);
      T(c, 'Te apresento a', W / 2, 560, t, .1, { size: 46, weight: 600, color: C.gold2, ls: 2 });
      logoFull(c, W / 2, 960, .84, t, cue(this, 'Cândidos', .25));
      T(c, 'uma empresa de gestão financeira', W / 2, 1300, t, cue(this, 'uma empresa', 1.2), { size: 40, weight: 600 });
  } },

  /* 8 · Para empresas de qualquer tamanho */
  { d: 7, tr: 'fade', draw(c, t) {
      bgDark(c, t);
      T(c, 'CRIADA PARA ORGANIZAR', W / 2, 520, t, .1, { size: 40, weight: 800, color: C.gold2, ls: 3 });
      TP(c, 'o financeiro de empresas de qualquer tamanho', W / 2, 610, t, .3, { size: 56, weight: 700, maxW: 780 });
      const ditos = ['seja mei', 'simples', 'presumido', 'lucro real'];
      CFG1.regimes.forEach((s, i) => chip(c, t, cue(this, ditos[i], 1.2 + i * .3), s, W / 2, 900 + i * 135, 520));
  } },

  /* 9 · A pergunta do empresário */
  { d: 3.6, tr: 'fade', draw(c, t) {
      bgDark(c, t);
      T(c, 'E VOCÊ, EMPRESÁRIO, PERGUNTA:', W / 2, 650, t, .1, { size: 36, weight: 800, color: C.gold2, ls: 3 });
      const f = fu(t, cue(this, 'mas como', .6));
      if (f.a > 0) {
        c.save(); c.globalAlpha *= f.a; c.translate(0, f.dy);
        c.fillStyle = C.cream; rr(c, 140, 740, 800, 300, 40); c.fill();
        c.beginPath(); c.moveTo(240, 1035); c.lineTo(220, 1110); c.lineTo(320, 1035); c.fill();
        c.restore();
        txt(c, '“Mas como vocês', W / 2, 840 + f.dy, { size: 60, weight: 800, color: C.dark, alpha: f.a });
        txt(c, 'podem me ajudar?”', W / 2, 935 + f.dy, { size: 60, weight: 800, color: C.dark, alpha: f.a });
      }
  } },

  /* 10 · Nós organizamos */
  { d: 8, tr: 'fade', sfx: [['transicao', 0]], draw(c, t) {
      bgDark(c, t);
      T(c, 'AQUI, NÓS ORGANIZAMOS', W / 2, 450, t, .1, { size: 40, weight: 800, color: C.gold2, ls: 3 });
      T(c, 'o seu financeiro:', W / 2, 525, t, .2, { size: 50, weight: 700 });
      const ditos = ['contas a pagar', 'conciliação', 'fluxo de caixa', 'despesas'];
      CFG1.organizamos.forEach((s, i) => numCard(c, t, cue(this, ditos[i], .6 + i * .5), i + 1, s, 610 + i * 205, { h: 170 }));
  } },

  /* 11 · Relatórios */
  { d: 8, tr: 'fade', draw(c, t) {
      bgDark(c, t);
      T(c, 'E MOSTRAMOS OS RESULTADOS', W / 2, 450, t, .1, { size: 40, weight: 800, color: C.gold2, ls: 3 });
      relatorio(c, t, .3);
      checkLinha(c, t, cue(this, 'para onde', 2), 'Para onde seu dinheiro vai', 1290);
      checkLinha(c, t, cue(this, 'lucro de verdade', 3), 'Se sua empresa dá lucro de verdade', 1390);
  } },

  /* 12 · BPO financeiro */
  { d: 7, tr: 'fade', draw(c, t) {
      bgDark(c, t);
      T(c, 'ESSE SERVIÇO SE CHAMA', W / 2, 520, t, .1, { size: 38, weight: 800, color: C.gold2, ls: 3 });
      T(c, 'BPO', W / 2, 720, t, cue(this, 'bê-pê-ó', .4), { size: 230, weight: 900, color: 'goldgrad' });
      T(c, 'FINANCEIRO', W / 2, 880, t, cue(this, 'bê-pê-ó', .4), { size: 72, weight: 800, ls: 12 });
      T(c, 'Business Process Outsourcing', W / 2, 965, t, cue(this, 'bê-pê-ó', .4) + .3, { size: 40, weight: 500, fam: SERIF, italic: true, color: C.gold2 });
      line(c, W / 2 - 80, 1030, W / 2 + 80, P(t, cue(this, 'a terceirização', 1.2), .5), C.gold, 3);
      TP(c, 'A terceirização das rotinas e da gestão financeira da sua empresa.', W / 2, 1120, t, cue(this, 'a terceirização', 1.2), { size: 50, weight: 700, maxW: 780 });
  } },

  /* 13 · Organização · Estratégia · Resultado */
  { d: 5, tr: 'fade', draw(c, t) {
      bgDark(c, t);
      T(c, 'Estamos aqui para te ajudar', W / 2, 560, t, .1, { size: 52, weight: 700 });
      T(c, 'e entregamos:', W / 2, 640, t, .2, { size: 44, weight: 500, color: C.gold2 });
      ['Organização', 'Estratégia', 'Resultado'].forEach((s, i) => {
        const st = cue(this, s, .8 + i * .5), y = 820 + i * 190, f = fu(t, st);
        c.save(); c.globalAlpha *= f.a; c.fillStyle = C.gold; c.beginPath(); c.arc(W / 2, y - 95 + f.dy, 9, 0, Math.PI * 2); c.fill(); c.restore();
        T(c, s, W / 2, y, t, st, { size: 96, weight: 900, color: i === 2 ? 'goldgrad' : C.cream });
      });
  } },

  /* 14 · Foto do Renan + chamada */
  { d: 6, tr: 'fade', sfx: [['logo', .2]], draw(c, t, d) {
      c.fillStyle = C.dark2; c.fillRect(0, 0, W, H);
      cover(c, IMG.foto, 0, 0, W, H, lerp(1.0, 1.04, t / d), .85, .3);
      const g = c.createLinearGradient(0, H * .5, 0, H);
      g.addColorStop(0, 'rgba(0,23,10,0)'); g.addColorStop(.45, 'rgba(0,23,10,.85)'); g.addColorStop(1, 'rgba(0,23,10,.97)');
      c.fillStyle = g; c.fillRect(0, 0, W, H);
      T(c, 'Então, te apresento a', 120, 1150, t, .2, { size: 40, weight: 600, align: 'left', color: C.gold2 });
      T(c, 'Candidus Gestão Financeira', 120, 1215, t, cue(this, 'Cândidos', .5), { size: 58, weight: 800, align: 'left' });
      T(c, CFG1.nome + ' · ' + CFG1.cargo, 120, 1280, t, cue(this, 'Cândidos', .5) + .4, { size: 34, weight: 600, align: 'left', color: '#e6dfcf' });
      ctaPill(c, t, cue(this, 'Cândidos', .5) + 1.2, CFG1.ctaAcao, 1400, 720);
  } }
], voDur('1'));
