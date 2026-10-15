/* =====================================================================
   VÍDEO 2 · Proposta comercial (Instagram Reels / TikTok)
   Dor do cliente → o que fazemos → por que importa → planos → CTA.
   Edite textos, preços e itens em CFG2.
   ===================================================================== */
const CFG2 = {
  dores: [
    'Não sabe qual é o lucro real',
    'Mistura conta pessoal e da empresa',
    'Paga juros por contas atrasadas',
    'Perde horas em planilhas',
    'Decide no "achismo"',
    'Não sabe quanto terá em caixa'
  ],
  rotina: [
    ['01', 'Lançamentos', 'contas a pagar e a receber'],
    ['02', 'Conciliação', 'banco batendo com o sistema'],
    ['03', 'Relatórios', 'receitas, despesas e fluxo'],
    ['04', 'Decisão', 'reunião de resultados com você']
  ],
  porque: [
    ['CONTROLE', 'Saiba exatamente quanto entra e quanto sai.'],
    ['PREVISIBILIDADE', 'Antecipe o caixa e evite surpresas.'],
    ['DECISÃO', 'Escolha com base em números, não no achismo.']
  ],
  planos: [
    { tag: 'PLANO 1', nome: 'Candidus Essencial', preco: 750,
      desc: 'Para empresas que querem organizar o financeiro.',
      itens: ['Contas a pagar e a receber', 'Conciliação bancária', 'Lançamentos e categorização',
              'Organização de comprovantes', 'Relatório mensal de movimentação'] },
    { tag: 'PLANO 2', nome: 'Candidus Gestão', preco: 1500,
      desc: 'Para empresas que querem controle e previsibilidade.',
      itens: ['Tudo do Essencial', 'Fluxo de caixa projetado', 'Relatório de receitas e despesas',
              'Indicadores financeiros', 'Reunião mensal de resultados'] },
    { tag: 'PLANO 3', nome: 'Candidus Estratégico', preco: 2500, destaque: 'MAIS COMPLETO',
      desc: 'Para empresas que querem tomar decisões com base nos números.',
      itens: ['Tudo do Gestão', 'Análise de custos e despesas', 'Indicadores de rentabilidade',
              'Análise de lucratividade', 'Relatórios gerenciais personalizados', 'Reuniões para discutir melhorias'] }
  ],
  cta: 'Chame no direct · link na bio'
};

function planCard(c, t, pl) {
  const w = 920, x = W / 2 - w / 2, y = H * .15, h = 1300;
  const pin = P(t, 0, .6, E.back);
  c.save(); c.translate(W / 2, y + h / 2); c.scale(lerp(.85, 1, pin), lerp(.85, 1, pin)); c.translate(-W / 2, -(y + h / 2));
  c.globalAlpha = clamp(pin * 1.5);
  c.fillStyle = 'rgba(0,23,10,.82)'; rr(c, x, y, w, h, 46); c.fill();
  c.lineWidth = 4; c.strokeStyle = goldGrad(c, x, y, x + w, y + h); rr(c, x, y, w, h, 46); c.stroke();
  if (pl.destaque) {
    c.fillStyle = goldGrad(c, W / 2 - 200, 0, W / 2 + 200, 0); rr(c, W / 2 - 200, y - 34, 400, 68, 34); c.fill();
    txt(c, pl.destaque, W / 2, y + 1, { size: 32, weight: 900, color: C.dark, ls: 4 });
  }
  txt(c, pl.tag, W / 2, y + 100, { size: 34, weight: 700, color: C.gold2, ls: 10 });
  txt(c, pl.nome, W / 2, y + 190, { size: 88, weight: 600, fam: SERIF });
  // preço contando
  const v = Math.round(pl.preco * P(t, .5, 1.3, E.expo) / 10) * 10;
  const ps = 'R$ ' + v.toLocaleString('pt-BR');
  const pw = measure(c, ps, 140, 900);
  txt(c, ps, W / 2 - 70, y + 350, { size: 140, weight: 900, color: 'goldgrad' });
  txt(c, '/mês', W / 2 - 70 + pw / 2 + 16, y + 380, { size: 44, weight: 600, align: 'left', color: C.cream });
  para(c, pl.desc, W / 2, y + 480, { size: 40, weight: 500, maxW: 760, alpha: P(t, 1.2, .5) });
  line(c, x + 80, y + 600, x + w - 80, P(t, 1.4, .6), 'rgba(236,201,107,.5)', 2);
  pl.itens.forEach((s, i) => {
    const q = P(t, 1.8 + i * .45, .45);
    const yy = y + 690 + i * 100, herda = i === 0 && s.startsWith('Tudo do');
    check(c, x + 110, yy, 26, q);
    txt(c, s, x + 160 - (1 - q) * 40, yy + 2, { size: 36, weight: herda ? 800 : 600, align: 'left', alpha: q,
      color: herda ? C.gold2 : C.cream });
  });
  c.restore();
}

const VIDEO2 = makeTimeline([
  /* 1 · Gancho */
  { d: 3.2, draw(c, t) {
      bgGold(c);
      chars(c, 'SUA EMPRESA', W / 2, H * .4, t, { size: 120, color: C.ink, mode: 'scatter', start: .05, stagger: .04, dur: .8, seed: 11 });
      txt(c, 'VENDE BEM...', W / 2, H * .4 + 160, { size: 120, weight: 900, color: C.cream, scale: P(t, 1.1, .6, E.back), shadow: 16 });
  } },
  { d: 3.6, tr: 'up', draw(c, t) {
      bgDark(c, t);
      txt(c, '...MAS O DINHEIRO', W / 2, H * .4, { size: 82, weight: 800, alpha: P(t, .2, .4) });
      const shake = t > 1 && t < 1.5 ? Math.sin(t * 90) * 10 : 0;
      txt(c, 'NUNCA', W / 2 + shake, H * .4 + 150, { size: 170, weight: 900, color: 'goldgrad', scale: P(t, .7, .5, E.back) });
      txt(c, 'SOBRA?', W / 2 - shake, H * .4 + 320, { size: 170, weight: 900, color: 'goldgrad', scale: P(t, .9, .5, E.back) });
  } },

  /* 2 · Dores do cliente */
  { d: 6.6, tr: 'torn', draw(c, t) {
      bgGold(c);
      txt(c, 'VOCÊ SE IDENTIFICA?', W / 2, H * .19, { size: 80, weight: 900, color: C.ink, scale: P(t, .1, .6, E.back) });
      CFG2.dores.forEach((s, i) => {
        const q = P(t, .6 + i * .55, .5, E.back);
        if (q <= 0) return;
        const w = 880, h = 112, y = H * .19 + 120 + i * 150, x = W / 2 - w / 2 - (1 - q) * 700;
        c.save(); c.globalAlpha = clamp(q * 1.5);
        c.fillStyle = C.cream; rr(c, x, y, w, h, h / 2); c.fill();
        cross(c, x + 62, y + h / 2, 32, P(t, .85 + i * .55, .4));
        txt(c, s, x + 120, y + h / 2 + 2, { size: 37, weight: 700, color: C.ink, align: 'left' });
        c.restore();
      });
  } },

  /* 3 · Empresa no escuro (efeito lanterna) */
  { d: 4.2, draw(c, t) {
      c.fillStyle = '#000'; c.fillRect(0, 0, W, H);
      const lx = W / 2 + Math.sin(t * 1.6) * 260, ly = H * .47 + Math.cos(t * 1.2) * 220;
      const r = lerp(260, 1400, P(t, 2.6, 1.1, E.inOut));
      c.save();
      c.beginPath(); c.arc(lx, ly, r, 0, Math.PI * 2); c.clip();
      bgDark(c, t);
      txt(c, 'SEM GESTÃO', W / 2, H * .38, { size: 110, weight: 900 });
      txt(c, 'FINANCEIRA,', W / 2, H * .38 + 130, { size: 110, weight: 900 });
      txt(c, 'SUA EMPRESA', W / 2, H * .38 + 290, { size: 80, weight: 700, color: C.gold2 });
      txt(c, 'ANDA NO ESCURO.', W / 2, H * .38 + 390, { size: 80, weight: 700, color: C.gold2 });
      const g = c.createRadialGradient(lx, ly, r * .4, lx, ly, r);
      g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.85)');
      c.fillStyle = g; c.fillRect(0, 0, W, H);
      c.restore();
  } },

  /* 4 · Apresenta a Candidus */
  { d: 4.2, tr: 'circle', draw(c, t) {
      bgDark(c, t);
      txt(c, 'É PARA ISSO QUE EXISTE A', W / 2, H * .25, { size: 48, weight: 700, ls: 4, color: C.gold2, alpha: P(t, .1, .5) });
      logoFull(c, W / 2, H * .5, 1, t, .4);
  } },

  /* 5 · BPO financeiro: a rotina */
  { d: 6.4, tr: 'up', draw(c, t) {
      bgCream(c);
      txt(c, 'BPO FINANCEIRO', W / 2, H * .16, { size: 96, weight: 900, color: C.dark, scale: P(t, .1, .6, E.back) });
      para(c, 'Assumimos a rotina financeira da sua empresa, do lançamento à decisão:',
        W / 2, H * .16 + 110, { size: 40, weight: 600, color: C.dark, maxW: 860, alpha: P(t, .5, .5) });
      const x0 = 150;
      CFG2.rotina.forEach(([n, a, b], i) => {
        const q = P(t, 1 + i * .7, .55, E.back), y = H * .38 + i * 270;
        if (i < CFG2.rotina.length - 1) {
          c.strokeStyle = C.gold; c.lineWidth = 6;
          c.beginPath(); c.moveTo(x0, y + 75); c.lineTo(x0, y + 75 + 120 * P(t, 1.4 + i * .7, .5)); c.stroke();
        }
        c.save(); c.globalAlpha = clamp(q * 1.5);
        c.fillStyle = C.dark; c.beginPath(); c.arc(x0, y, 72 * clamp(q, 0, 1.2), 0, Math.PI * 2); c.fill();
        txt(c, n, x0, y + 2, { size: 52, weight: 900, color: C.gold2 });
        txt(c, a.toUpperCase(), x0 + 120 - (1 - q) * 60, y - 26, { size: 62, weight: 900, color: C.dark, align: 'left' });
        txt(c, b, x0 + 120 - (1 - q) * 60, y + 40, { size: 38, weight: 600, color: '#3d5a48', align: 'left' });
        c.restore();
      });
  } },

  /* 6 · Por que é importante */
  { d: 6.4, tr: 'left', draw(c, t) {
      bgDark(c, t);
      txt(c, 'POR QUE ISSO', W / 2, H * .15, { size: 84, weight: 900, alpha: P(t, .1, .4) });
      txt(c, 'É IMPORTANTE?', W / 2, H * .15 + 100, { size: 84, weight: 900, color: 'goldgrad', scale: P(t, .3, .5, E.back) });
      CFG2.porque.forEach(([h, d], i) => {
        const q = P(t, 1 + i * .8, .6, E.back), y = H * .32 + i * 380, w = 900, x = W / 2 - w / 2;
        c.save(); c.globalAlpha = clamp(q * 1.5); c.translate(0, (1 - q) * 120);
        c.fillStyle = 'rgba(255,255,255,.05)'; rr(c, x, y, w, 320, 36); c.fill();
        c.strokeStyle = 'rgba(236,201,107,.45)'; c.lineWidth = 2; rr(c, x, y, w, 320, 36); c.stroke();
        c.fillStyle = goldGrad(c, x, y, x + 12, y + 320); rr(c, x, y + 40, 12, 240, 6); c.fill();
        txt(c, h, x + 70, y + 100, { size: 64, weight: 900, color: C.gold2, align: 'left', ls: 3 });
        para(c, d, x + 70, y + 190, { size: 42, weight: 500, align: 'left', maxW: 780 });
        c.restore();
      });
  } },

  /* 7 · Chamada dos planos */
  { d: 2.6, tr: 'torn', draw(c, t) {
      bgGold(c);
      chars(c, 'CONHEÇA', W / 2, H * .42, t, { size: 100, color: C.ink, mode: 'drop', start: .05, stagger: .05 });
      txt(c, 'NOSSOS PLANOS', W / 2, H * .42 + 140, { size: 110, weight: 900, color: C.cream, scale: P(t, .6, .6, E.back), shadow: 16 });
  } },

  /* 8 · Plano Essencial */
  { d: 8, tr: 'up', draw(c, t) { bgDark(c, t); planCard(c, t, CFG2.planos[0]); } },

  /* 9 · Plano Gestão */
  { d: 8.4, tr: 'left', draw(c, t) { bgDark(c, t); planCard(c, t, CFG2.planos[1]); } },

  /* 10 · Plano Estratégico */
  { d: 9, tr: 'left', draw(c, t) { bgDark(c, t); planCard(c, t, CFG2.planos[2]); } },

  /* 11 · Pergunta final */
  { d: 3.4, tr: 'up', draw(c, t) {
      bgGold(c);
      txt(c, 'QUAL É O PLANO', W / 2, H * .4, { size: 96, weight: 900, color: C.ink, scale: P(t, .1, .5, E.back) });
      txt(c, 'IDEAL PARA A', W / 2, H * .4 + 120, { size: 96, weight: 900, color: C.ink, scale: P(t, .4, .5, E.back) });
      txt(c, 'SUA EMPRESA?', W / 2, H * .4 + 260, { size: 120, weight: 900, color: C.cream, scale: P(t, .8, .6, E.back), shadow: 16 });
  } },

  /* 12 · CTA com foto */
  { d: 6, tr: 'circle', draw(c, t, d) {
      c.fillStyle = C.dark2; c.fillRect(0, 0, W, H);
      cover(c, IMG.foto, 0, 0, W, H, lerp(1.08, 1.0, t / d), .85, .3);
      const g = c.createLinearGradient(0, H * .35, 0, H);
      g.addColorStop(0, 'rgba(0,23,10,0)'); g.addColorStop(.5, 'rgba(0,23,10,.9)'); g.addColorStop(1, 'rgba(0,23,10,.98)');
      c.fillStyle = g; c.fillRect(0, 0, W, H);
      txt(c, CFG1.nome, W / 2, H * .63, { size: 70, weight: 800, ls: 2, alpha: P(t, .3, .6) });
      txt(c, 'Transparência e clareza nos seus números.', W / 2, H * .63 + 80, { size: 44, weight: 600, fam: SERIF, italic: true, color: C.gold2, alpha: P(t, .6, .6) });
      const p = P(t, 1.2, .6, E.back), pulse = 1 + Math.sin(t * 5) * .025 * P(t, 2, .3);
      c.save(); c.translate(W / 2, H * .77); c.scale(p * pulse, p * pulse);
      c.fillStyle = goldGrad(c, -400, 0, 400, 0); rr(c, -400, -70, 800, 140, 70); c.fill(); c.restore();
      txt(c, 'AGENDE UMA CONVERSA', W / 2, H * .77 + 2, { size: 54, weight: 900, color: C.dark, scale: p * pulse });
      txt(c, CFG2.cta, W / 2, H * .77 + 135, { size: 40, weight: 600, alpha: P(t, 1.8, .5) });
  } }
]);
