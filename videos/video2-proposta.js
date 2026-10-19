/* =====================================================================
   VÍDEO 2 · Serviços e planos (Instagram Reels / TikTok)
   ~57 s · textos dentro da área segura do Instagram (x 120–940, y 300–1480)
   Usa numCard, ctaPill e smallLogo de video1-apresentacao.js.
   Planos: textos exatamente como no material da Candidus.
   ===================================================================== */
const CFG2 = {
  dores: [
    'Não sabe quanto a empresa realmente lucra',
    'Mistura contas pessoais com as da empresa',
    'Não sabe quanto terá em caixa'
  ],
  atuacao: 'Com o BPO financeiro, assumimos a rotina financeira da sua empresa:',
  passos: [
    'Organizamos contas a pagar e receber',
    'Conciliamos o banco e acompanhamos o caixa',
    'Entregamos relatórios para suas decisões'
  ],
  planos: [
    { tag: 'PLANO 1', nome: 'Candidus Essencial', preco: 'R$ 750', desc: '', itens: [] },
    { tag: 'PLANO 2', nome: 'Candidus Gestão', preco: 'R$ 1.500',
      desc: 'Para empresas que querem controle e previsibilidade.',
      itens: ['Tudo do Essencial', 'Fluxo de caixa projetado', 'Relatório de receitas e despesas',
              'Indicadores financeiros', 'Reunião mensal de resultados'] },
    { tag: 'PLANO 3', nome: 'Candidus Estratégico', preco: 'R$ 2.500',
      desc: 'Para empresas que querem tomar decisões com base nos números.',
      itens: ['Tudo do Gestão', 'Análise de custos e despesas', 'Indicadores de rentabilidade',
              'Análise de lucratividade', 'Relatórios gerenciais personalizados', 'Reuniões para discutir melhorias'] }
  ],
  ctaPergunta: 'Qual plano faz sentido para sua empresa?',
  ctaAcao: 'Envie ‘GESTÃO’ no direct',
  ctaFim: 'e vamos conversar.'
};

/* cartão de plano: preço mostrado direto, sem contagem */
function planCard(c, t, pl, sc) {
  const w = 800, x = W / 2 - w / 2;
  const temItens = pl.itens.length > 0;
  const h = temItens ? 1120 : 470;
  const y = temItens ? 330 : 720;
  const f = fu(t, .05, .6);
  c.save(); c.globalAlpha *= f.a; c.translate(0, f.dy); if (f.blur > .3) c.filter = `blur(${f.blur.toFixed(1)}px)`;
  c.fillStyle = 'rgba(0,23,10,.75)'; rr(c, x, y, w, h, 40); c.fill();
  c.lineWidth = 3; c.strokeStyle = goldGrad(c, x, y, x + w, y + h); rr(c, x, y, w, h, 40); c.stroke();
  txt(c, pl.tag, W / 2, y + 80, { size: 32, weight: 700, color: C.gold2, ls: 10 });
  txt(c, pl.nome, W / 2, y + 170, { size: 82, weight: 600, fam: SERIF });
  const pw = measure(c, pl.preco, 120, 900), mw = measure(c, '/mês', 44, 600);
  const px = W / 2 - (pw + 14 + mw) / 2;
  txt(c, pl.preco, px, y + 310, { size: 120, weight: 900, color: C.gold2, align: 'left' });
  txt(c, '/mês', px + pw + 14, y + 335, { size: 44, weight: 600, align: 'left' });
  c.restore();
  if (!temItens) return;
  TP(c, pl.desc, W / 2, y + 420, t, cue(sc, 'para empresas', .5), { size: 38, weight: 500, maxW: 700, color: '#e6dfcf' });
  line(c, x + 70, y + 535, x + w - 70, P(t, cue(sc, 'para empresas', .5) + .2, .5), 'rgba(236,201,107,.45)', 2);
  // tamanho único para todos os itens do cartão (o do item mais longo que caiba)
  const isz = Math.min(...pl.itens.map((s, i) => fitSize(c, s, w - 148 - 50, 38, i === 0 ? 800 : 600)));
  pl.itens.forEach((s, i) => {
    const yy = y + 615 + i * 84, st = cue(sc, s, .9 + i * .15), q = fu(t, st);
    check(c, x + 100, yy + q.dy, 24, P(t, st, .4));
    const wt = i === 0 ? 800 : 600;
    T(c, s, x + 148, yy + 2, t, st, { size: isz, weight: wt, align: 'left',
      color: i === 0 ? C.gold2 : C.cream });
  });
}

const VIDEO2 = makeTimeline([
  /* 1 · Abertura */
  { d: 4.2, sfx: [['abertura', .05]], draw(c, t) {
      bgDark(c, t);
      T(c, 'Sua empresa', W / 2, 720, t, .15, { size: 70, weight: 700 });
      T(c, 'vende bem…', W / 2, 815, t, .15, { size: 70, weight: 700 });
      T(c, '…mas o dinheiro', W / 2, 960, t, cue(this, 'mas o dinheiro', 1.2), { size: 84, weight: 900, color: 'goldgrad' });
      T(c, 'nunca sobra?', W / 2, 1070, t, cue(this, 'mas o dinheiro', 1.2), { size: 84, weight: 900, color: 'goldgrad' });
  } },

  /* 2 · Dores principais */
  { d: 6, tr: 'fade', draw(c, t) {
      bgDark(c, t);
      T(c, 'VOCÊ SE IDENTIFICA?', W / 2, 560, t, .1, { size: 44, weight: 800, color: C.gold2, ls: 3 });
      const ditos = ['quanto a empresa', 'mistura', 'quanto terá'];
      CFG2.dores.forEach((s, i) => numCard(c, t, cue(this, ditos[i], .45 + i * .5), i + 1, s, 650 + i * 235, { icon: 'menos' }));
  } },

  /* 3 · Entrada da logo (assinatura sonora) */
  { d: 3.8, tr: 'fade', sfx: [['logo', .3]], draw(c, t) {
      bgDark(c, t);
      T(c, 'É para isso que existe a', W / 2, 600, t, .1, { size: 46, weight: 600, color: C.gold2, ls: 2 });
      logoFull(c, W / 2, 1000, .84, t, .3);
  } },

  /* 4 · Como a Candidus atua */
  { d: 8, tr: 'fade', sfx: [['transicao', 0]], draw(c, t) {
      bgDark(c, t);
      T(c, 'COMO A CANDIDUS ATUA', W / 2, 450, t, .1, { size: 40, weight: 800, color: C.gold2, ls: 3 });
      TP(c, CFG2.atuacao, W / 2, 560, t, cue(this, 'com o bê-pê-ó', .3), { size: 50, weight: 700, maxW: 800 });
      const ditos = ['organizamos', 'conciliamos', 'entregamos'];
      CFG2.passos.forEach((s, i) => numCard(c, t, cue(this, ditos[i], 1 + i * .55), i + 1, s, 760 + i * 225, { h: 180 }));
  } },

  /* 5 · Chamada dos planos */
  { d: 2.6, tr: 'fade', sfx: [['transicao', 0]], draw(c, t) {
      bgDark(c, t);
      T(c, 'Conheça nossos', W / 2, 860, t, .1, { size: 64, weight: 600 });
      T(c, 'planos', W / 2, 1000, t, .25, { size: 120, weight: 600, fam: SERIF, color: 'goldgrad' });
      line(c, W / 2 - 90, 1100, W / 2 + 90, P(t, .5, .5), C.gold, 3);
  } },

  /* 6–8 · Planos */
  { d: 4.6, tr: 'fade', draw(c, t) { bgDark(c, t); planCard(c, t, CFG2.planos[0], this); } },
  { d: 10, tr: 'fade', sfx: [['transicao', 0]], draw(c, t) { bgDark(c, t); planCard(c, t, CFG2.planos[1], this); } },
  { d: 11, tr: 'fade', sfx: [['transicao', 0]], draw(c, t) { bgDark(c, t); planCard(c, t, CFG2.planos[2], this); } },

  /* 9 · Chamada final */
  { d: 7, tr: 'fade', sfx: [['transicao', 0]], draw(c, t) {
      bgDark(c, t);
      smallLogo(c, t, .1, 560);
      TP(c, CFG2.ctaPergunta, W / 2, 860, t, .3, { size: 64, weight: 800, maxW: 800 });
      ctaPill(c, t, cue(this, 'Envie', 1.1), CFG2.ctaAcao, 1160);
      T(c, CFG2.ctaFim, W / 2, 1300, t, cue(this, 'e vamos', 1.3), { size: 48, weight: 600 });
  } }
], voDur('2'));
