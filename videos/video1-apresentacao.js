/* =====================================================================
   VÍDEO 1 · Apresentação da Candidus (Instagram Reels / TikTok)
   ~37 s · textos dentro da área segura do Instagram (x 120–940, y 300–1480)
   sfx: [nome, segundos após o início da cena] — ver gerar_audio.py
   ===================================================================== */
const CFG1 = {
  nome: 'Renan Cândido',
  cargo: 'Fundador da Candidus',
  problemas: ['Caixa apertado', 'Lucro desconhecido', 'Contas misturadas'],
  servicos: [
    'Organização de contas a pagar e receber.',
    'Conciliação bancária e acompanhamento do caixa.',
    'Relatórios para apoiar as decisões.'
  ],
  bpo: 'BPO financeiro é a terceirização da rotina financeira da sua empresa.',
  ctaPergunta: 'Quer entender como organizar o financeiro da sua empresa?',
  ctaAcao: 'Envie ‘GESTÃO’ no direct.'
};

/* cartão numerado (usado nas listas curtas) */
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

/* botão dourado de chamada para ação */
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

const VIDEO1 = makeTimeline([
  /* 1 · Pergunta de abertura */
  { d: 3.6, sfx: [['abertura', .05]], draw(c, t) {
      bgDark(c, t);
      line(c, W / 2 - 80, 700, W / 2 + 80, P(t, .1, .6), C.gold, 3);
      T(c, 'Você sabe quanto', W / 2, 800, t, .15, { size: 76, weight: 700 });
      T(c, 'sua empresa', W / 2, 895, t, .15, { size: 76, weight: 700 });
      T(c, 'realmente lucra?', W / 2, 1035, t, .6, { size: 86, weight: 900, color: 'goldgrad' });
  } },

  /* 2 · O problema */
  { d: 5, tr: 'fade', draw(c, t) {
      bgDark(c, t);
      T(c, 'O PROBLEMA', W / 2, 560, t, .1, { size: 34, weight: 700, color: C.gold2, ls: 8 });
      TP(c, 'Sem números claros, cada decisão vira um palpite.', W / 2, 670, t, .2, { size: 62, weight: 800, maxW: 780 });
      CFG1.problemas.forEach((s, i) => {
        const f = fu(t, .9 + i * .25), y = 980 + i * 125, w = 560;
        if (f.a <= 0) return;
        c.save(); c.globalAlpha *= f.a; c.translate(0, f.dy);
        c.strokeStyle = 'rgba(236,201,107,.55)'; c.lineWidth = 2; rr(c, W / 2 - w / 2, y - 48, w, 96, 48); c.stroke();
        c.restore();
        txt(c, s, W / 2, y + 2 + f.dy, { size: 40, weight: 600, alpha: f.a });
      });
  } },

  /* 3 · Entrada da logo (assinatura sonora) */
  { d: 3.8, tr: 'fade', sfx: [['logo', .3]], draw(c, t) {
      bgDark(c, t);
      T(c, 'Para isso existe a', W / 2, 600, t, .1, { size: 46, weight: 600, color: C.gold2, ls: 2 });
      logoFull(c, W / 2, 1000, .84, t, .3);
  } },

  /* 4 · O que é BPO financeiro */
  { d: 6.2, tr: 'fade', sfx: [['transicao', 0]], draw(c, t) {
      bgDark(c, t);
      T(c, 'O QUE É BPO FINANCEIRO?', W / 2, 600, t, .1, { size: 40, weight: 800, color: C.gold2, ls: 3 });
      line(c, W / 2 - 70, 660, W / 2 + 70, P(t, .2, .5), C.gold, 3);
      TP(c, CFG1.bpo, W / 2, 770, t, .35, { size: 62, weight: 700, maxW: 800 });
      T(c, 'Você foca no negócio.', W / 2, 1180, t, 1.6, { size: 44, weight: 600, color: C.gold2 });
      T(c, 'Nós cuidamos dos números.', W / 2, 1245, t, 1.6, { size: 44, weight: 600, color: C.gold2 });
  } },

  /* 5 · Serviços em 3 grupos */
  { d: 7.6, tr: 'fade', draw(c, t) {
      bgDark(c, t);
      T(c, 'COMO A CANDIDUS AJUDA', W / 2, 470, t, .1, { size: 40, weight: 800, color: C.gold2, ls: 3 });
      CFG1.servicos.forEach((s, i) => numCard(c, t, .4 + i * .6, i + 1, s, 560 + i * 235));
  } },

  /* 6 · Fundador */
  { d: 5, tr: 'fade', sfx: [['transicao', 0]], draw(c, t, d) {
      c.fillStyle = C.dark2; c.fillRect(0, 0, W, H);
      cover(c, IMG.foto, 0, 0, W, H, lerp(1.0, 1.04, t / d), .85, .3);
      const g = c.createLinearGradient(0, H * .45, 0, H);
      g.addColorStop(0, 'rgba(0,23,10,0)'); g.addColorStop(.5, 'rgba(0,23,10,.85)'); g.addColorStop(1, 'rgba(0,23,10,.97)');
      c.fillStyle = g; c.fillRect(0, 0, W, H);
      line(c, 120, 1190, 260, P(t, .4, .5), C.gold, 4);
      T(c, CFG1.nome, 120, 1270, t, .5, { size: 80, weight: 800, align: 'left' });
      T(c, CFG1.cargo, 120, 1355, t, .75, { size: 44, weight: 600, align: 'left', color: C.gold2 });
  } },

  /* 7 · Chamada final */
  { d: 6.6, tr: 'fade', sfx: [['transicao', 0]], draw(c, t) {
      bgDark(c, t);
      smallLogo(c, t, .1, 560);
      TP(c, CFG1.ctaPergunta, W / 2, 860, t, .3, { size: 60, weight: 800, maxW: 800 });
      ctaPill(c, t, 1.1, CFG1.ctaAcao, 1200);
  } }
]);
