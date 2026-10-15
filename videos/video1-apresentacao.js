/* =====================================================================
   VÍDEO 1 · Apresentação da Candidus (Instagram Reels / TikTok)
   Foco: BPO financeiro. Edite os textos em CFG.
   ===================================================================== */
const CFG1 = {
  nome: 'RENAN CÂNDIDO',
  cargo: 'Fundador · Candidus Gestão Financeira',
  servicos: [
    'Contas a pagar e a receber',
    'Conciliação bancária',
    'Fluxo de caixa projetado',
    'Relatório de receitas e despesas',
    'Indicadores financeiros',
    'Análise de custos e lucratividade',
    'Reunião mensal de resultados'
  ],
  cta: 'Chame no direct · link na bio'
};

const VIDEO1 = makeTimeline([
  /* 1 · "APRESENTANDO" em máquina de escrever */
  { d: 2.4, draw(c, t) {
      bgGold(c);
      typewriter(c, 'APRESENTANDO', W / 2, H * .46, t, { start: .2, cps: 13, size: 90, color: C.ink });
      txt(c, 'a sua nova gestão financeira', W / 2, H * .46 + 110, { size: 40, weight: 600, color: C.ink, alpha: P(t, 1.3, .5) });
  } },

  /* 2 · Logo */
  { d: 3.8, tr: 'circle', draw(c, t) {
      bgDark(c, t);
      logoFull(c, W / 2, H * .47, 1, t, .15);
      const p = P(t, 1.9, .6);
      line(c, W / 2 - 360, H * .47 + 330, W / 2 + 360, p, C.gold, 2);
      txt(c, 'ORGANIZAÇÃO  •  PLANEJAMENTO  •  RESULTADOS', W / 2, H * .47 + 385, { size: 30, weight: 600, ls: 3, alpha: P(t, 2.2, .6) });
  } },

  /* 3 · Pergunta-gancho com letras espalhadas (como na referência) */
  { d: 4.4, tr: 'up', draw(c, t) {
      bgGold(c);
      chars(c, 'VOCÊ SABE', W / 2, H * .34, t, { size: 120, color: C.ink, mode: 'scatter', start: .1, stagger: .05, dur: .8, seed: 3 });
      chars(c, 'PARA ONDE VAI', W / 2, H * .34 + 150, t, { size: 92, color: C.ink, mode: 'drop', start: .9, stagger: .035 });
      const p = P(t, 1.7, .6, E.back);
      txt(c, 'O DINHEIRO', W / 2, H * .34 + 320, { size: 150, weight: 900, color: C.cream, scale: p, shadow: 18 });
      chars(c, 'DA SUA EMPRESA?', W / 2, H * .34 + 470, t, { size: 84, color: C.ink, mode: 'rise', start: 2.3, stagger: .03 });
  } },

  /* 4 · Bateria do caixa descarregando */
  { d: 3.6, draw(c, t) {
      bgGold(c);
      const pt = P(t, 0, .5, E.back);
      txt(c, 'CAIXA NO FIM DO MÊS?', W / 2, H * .3, { size: 70, weight: 900, color: C.cream, scale: pt, shadow: 14 });
      // bateria
      const bw = 520, bh = 230, bx = W / 2 - bw / 2 - 20, by = H * .42;
      const lvl = lerp(1, .08, P(t, .6, 2.2, E.inOut));
      c.lineWidth = 16; c.strokeStyle = C.ink; rr(c, bx, by, bw, bh, 30); c.stroke();
      c.fillStyle = C.ink; rr(c, bx + bw + 8, by + bh * .3, 34, bh * .4, 10); c.fill();
      const col = lvl > .5 ? C.dark : lvl > .25 ? '#8a5a12' : C.red;
      c.fillStyle = col; rr(c, bx + 24, by + 24, (bw - 48) * lvl, bh - 48, 14); c.fill();
      txt(c, Math.round(lvl * 100) + '%', W / 2 - 20, by + bh / 2, { size: 80, weight: 900, color: lvl > .3 ? C.cream : C.ink });
      if (lvl < .2 && Math.floor(t * 6) % 2) cross(c, bx + bw + 60, by - 20, 40, 1);
      ['contas atrasadas', 'juros e multas', 'planilhas confusas'].forEach((s, i) =>
        txt(c, s, W / 2, by + bh + 130 + i * 72, { size: 50, weight: 700, color: C.ink, alpha: P(t, 1.2 + i * .45, .4) }));
  } },

  /* 5 · "Calma. A Candidus cuida disso." */
  { d: 3.4, tr: 'torn', draw(c, t) {
      bgDark(c, t);
      txt(c, 'CALMA,', W / 2, H * .38, { size: 70, weight: 600, color: C.gold2, alpha: P(t, .2, .4), ls: 6 });
      const p = P(t, .55, .6, E.back);
      txt(c, 'A CANDIDUS', W / 2, H * .38 + 140, { size: 140, weight: 600, fam: SERIF, color: C.cream, scale: p, ls: 4 });
      chars(c, 'CUIDA DISSO', W / 2, H * .38 + 270, t, { size: 76, color: C.gold2, mode: 'rise', start: 1.2, stagger: .04, ls: 6 });
      chars(c, 'PARA VOCÊ', W / 2, H * .38 + 360, t, { size: 76, color: C.gold2, mode: 'rise', start: 1.5, stagger: .04, ls: 6 });
  } },

  /* 6 · O que é BPO financeiro */
  { d: 5, draw(c, t) {
      bgDark(c, t);
      txt(c, 'O QUE É', W / 2, H * .25, { size: 44, weight: 700, color: C.gold2, ls: 10, alpha: P(t, .1, .4) });
      chars(c, 'BPO', W / 2, H * .25 + 190, t, { size: 300, weight: 900, color: 'goldgrad', mode: 'drop', start: .2, stagger: .12, dur: .6 });
      txt(c, 'FINANCEIRO', W / 2, H * .25 + 370, { size: 82, weight: 800, ls: lerp(40, 14, P(t, .8, 1)), alpha: P(t, .8, .5) });
      line(c, W / 2 - 160, H * .25 + 450, W / 2 + 160, P(t, 1.3, .5), C.gold, 3);
      para(c, 'Terceirização da rotina financeira: nós executamos o operacional e entregamos números claros para você decidir.',
        W / 2, H * .25 + 540, { size: 46, weight: 500, maxW: 880, alpha: P(t, 1.6, .6) });
  } },

  /* 7 · Você foca no negócio, nós nos números */
  { d: 4, tr: 'left', draw(c, t) {
      bgGold(c);
      const a = P(t, .1, .5, E.back);
      txt(c, 'VOCÊ FOCA', W / 2, H * .36, { size: 110, weight: 900, color: C.ink, scale: a });
      txt(c, 'NO SEU NEGÓCIO.', W / 2, H * .36 + 120, { size: 80, weight: 800, color: C.ink, alpha: P(t, .4, .4) });
      const b = P(t, 1.3, .5, E.back);
      txt(c, 'NÓS CUIDAMOS', W / 2, H * .36 + 330, { size: 110, weight: 900, color: C.cream, scale: b, shadow: 14 });
      txt(c, 'DOS NÚMEROS.', W / 2, H * .36 + 450, { size: 80, weight: 800, color: C.cream, alpha: P(t, 1.6, .4), shadow: 10 });
      // sublinhado desenhado
      line(c, W / 2 - 300, H * .36 + 515, W / 2 + 300, P(t, 2, .6), C.ink, 8);
  } },

  /* 8 · Lista de serviços em "pílulas" */
  { d: 6.2, draw(c, t) {
      bgGold(c);
      // título que entra girando e se acomoda
      const p = P(t, 0, .7, E.back);
      txt(c, 'O QUE FAZEMOS', W / 2, H * .2, { size: 92, weight: 900, color: C.ink, rot: (1 - p) * -.35, scale: lerp(.6, 1, p), alpha: clamp(p * 2) });
      const items = CFG1.servicos, top = H * .2 + 140, gap = 132;
      items.forEach((s, i) => {
        const q = P(t, .6 + i * .3, .55, E.back);
        if (q <= 0) return;
        const x = W / 2 + (1 - q) * 700, y = top + i * gap, w = 860, h = 100;
        c.save(); c.globalAlpha = clamp(q * 1.5);
        c.fillStyle = C.cream; rr(c, x - w / 2, y, w, h, h / 2); c.fill();
        check(c, x - w / 2 + 56, y + h / 2, 28, P(t, .9 + i * .3, .4), C.dark);
        txt(c, s, x - w / 2 + 110, y + h / 2 + 2, { size: 40, weight: 700, color: C.ink, align: 'left' });
        c.restore();
      });
  } },

  /* 9 · Foto do fundador */
  { d: 5, tr: 'circle', draw(c, t, d) {
      c.fillStyle = C.dark2; c.fillRect(0, 0, W, H);
      cover(c, IMG.foto, 0, 0, W, H, lerp(1.0, 1.08, t / d), .85, .3);
      const g = c.createLinearGradient(0, H * .45, 0, H);
      g.addColorStop(0, 'rgba(0,23,10,0)'); g.addColorStop(.55, 'rgba(0,23,10,.88)'); g.addColorStop(1, 'rgba(0,23,10,.97)');
      c.fillStyle = g; c.fillRect(0, 0, W, H);
      const y = H * .7;
      line(c, 90, y - 70, 250, P(t, .4, .5), C.gold, 4);
      txt(c, CFG1.nome, 90, y, { size: 78, weight: 800, align: 'left', alpha: P(t, .5, .5), ls: 2 });
      txt(c, CFG1.cargo, 90, y + 70, { size: 36, weight: 600, align: 'left', color: C.gold2, alpha: P(t, .8, .5) });
      txt(c, '“Candidus”, do latim: claro, transparente.', 90, y + 170, { size: 46, weight: 600, fam: SERIF, italic: true, align: 'left', alpha: P(t, 1.5, .6) });
      txt(c, 'É assim que tratamos os seus números.', 90, y + 230, { size: 46, weight: 600, fam: SERIF, italic: true, align: 'left', color: C.gold2, alpha: P(t, 2.2, .6) });
  } },

  /* 10 · Organização · Planejamento · Resultados */
  { d: 3.8, tr: 'up', draw(c, t) {
      bgDark(c, t);
      ['ORGANIZAÇÃO', 'PLANEJAMENTO', 'RESULTADOS'].forEach((s, i) => {
        const p = P(t, .15 + i * .55, .55, E.back), y = H * .34 + i * 230;
        c.fillStyle = C.gold; c.globalAlpha = clamp(p);
        c.beginPath(); c.arc(W / 2, y - 105, 14 * clamp(p), 0, Math.PI * 2); c.fill(); c.globalAlpha = 1;
        txt(c, s, W / 2, y, { size: 104, weight: 900, color: i === 2 ? 'goldgrad' : C.cream, scale: p });
      });
  } },

  /* 11 · "Então, o que você está esperando?" */
  { d: 3.2, draw(c, t) {
      bgDark(c, t);
      const sw = P(t, 1.1, .5, E.inOut);
      txt(c, 'ENTÃO, O QUE', W / 2, H * .42, { size: 84, weight: 700, alpha: P(t, .1, .4) });
      txt(c, 'VOCÊ ESTÁ', W / 2 - (1 - sw) * 120, H * .42 + 110, { size: 84, weight: 700, alpha: P(t, .4, .4), rot: (1 - sw) * -.08 });
      txt(c, 'ESPERANDO?', W / 2, H * .42 + 240, { size: 128, weight: 900, color: 'goldgrad', scale: P(t, 1.1, .6, E.back) });
  } },

  /* 12 · CTA final com logo */
  { d: 5.2, tr: 'torn', draw(c, t) {
      bgDark(c, t);
      logoFull(c, W / 2, H * .36, .95, t, .1);
      const p = P(t, 1.5, .6, E.back);
      const pulse = 1 + Math.sin(t * 5) * .025 * P(t, 2.2, .3);
      c.save(); c.translate(W / 2, H * .64); c.scale(p * pulse, p * pulse);
      c.fillStyle = goldGrad(c, -380, 0, 380, 0); rr(c, -380, -70, 760, 140, 70); c.fill(); c.restore();
      txt(c, 'VAMOS CONVERSAR?', W / 2, H * .64 + 2, { size: 60, weight: 900, color: C.dark, scale: p * pulse });
      txt(c, CFG1.cta, W / 2, H * .64 + 140, { size: 40, weight: 600, alpha: P(t, 2, .5) });
  } }
]);
