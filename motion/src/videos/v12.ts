import type {VideoSpec} from '../series/types';

// Saldo inicial 20.000; compromissos fixos 36.000/mês.
// Normal: receitas 40, 38, 42, 45, 48, 55 mil → saldo 24, 26, 32, 41, 53, 72 mil.
// Vendas −25%: 30; 28,5; 31,5; 33,75; 36; 41,25 mil → saldo 14; 6,5; 2; −0,25; −0,25; 5 mil.
const rows = [
  {mes: 'Jul', normal: 40000, fraca: 30000, comp: -36000, saldo: 14000},
  {mes: 'Ago', normal: 38000, fraca: 28500, comp: -36000, saldo: 6500},
  {mes: 'Set', normal: 42000, fraca: 31500, comp: -36000, saldo: 2000},
  {mes: 'Out', normal: 45000, fraca: 33750, comp: -36000, saldo: -250},
  {mes: 'Nov', normal: 48000, fraca: 36000, comp: -36000, saldo: -250},
  {mes: 'Dez', normal: 55000, fraca: 41250, comp: -36000, saldo: 5000},
];

export const v12: VideoSpec = {
  id: 'v12',
  num: 12,
  slug: 'meses-fracos',
  title: 'Como se preparar para meses de vendas mais fracas',
  format: 'demo',
  week: 6,
  month: 2,
  music: {bpm: 108, root: 57, seed: 12},
  beats: [
    {
      say: 'Na prática: e se as vendas caírem nos próximos meses?',
      scene: {type: 'title', bg: 'green', kicker: 'NA PRÁTICA', icon: 'trend', lines: ['E se as vendas', '_caírem?_'], size: 104},
    },
    {
      say: [
        'Esta é uma projeção fictícia de seis meses, com a receita esperada e os compromissos fixos.',
        'Agora, um cenário com vendas vinte e cinco por cento menores.',
        'Com saldo inicial de vinte mil, o caixa chegaria ao limite em outubro e novembro.',
      ],
      enter: 'zoom',
      gap: 0.4,
      pad: 1.0,
      scene: {
        type: 'sheet',
        kicker: 'PROJEÇÃO · 2º SEMESTRE',
        file: 'projecao_cenarios.xlsx',
        tabs: ['Cenários', 'Premissas'],
        columns: [
          {key: 'mes', label: 'Mês', w: 90},
          {key: 'normal', label: 'Receita esperada', w: 220, align: 'right', money: true},
          {key: 'fraca', label: 'Receita −25%', w: 210, align: 'right', money: true},
          {key: 'comp', label: 'Compromissos', w: 210, align: 'right', money: true},
          {key: 'saldo', label: 'Saldo (−25%)', w: 210, align: 'right', money: true},
        ],
        rows,
        steps: [
          {type: 'fill', col: 'fraca', cue: 1},
          {type: 'fill', col: 'saldo', cue: 2},
          {type: 'highlight', where: {col: 'saldo', lt: 0}, tone: 'coral', cue: 2, delay: 24},
          {type: 'badge', text: 'Saldo inicial R$ 20.000 · fôlego quase zero em out e nov', tone: 'coral', cue: 2, delay: 40},
        ],
      },
    },
    {
      say: 'No gráfico, a distância entre as duas linhas mostra o tamanho do risco.',
      enter: 'whipUp',
      scene: {
        type: 'chart',
        headline: ['Dois _cenários_'],
        title: 'Saldo projetado',
        labels: ['Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        series: [
          {name: 'Cenário esperado', values: [24, 26, 32, 41, 53, 72], kind: 'line', tone: 'green'},
          {name: 'Vendas −25%', values: [14, 6.5, 2, -0.25, -0.25, 5], kind: 'line', tone: 'coral'},
        ],
        yMin: -10,
        yMax: 80,
        zeroLine: true,
        highlight: {series: 1, index: 3, label: 'Out: no limite', tone: 'coral'},
      },
    },
    {
      say: 'Com essa visão, dá para formar reserva, mapear o que é ajustável e planejar as compras.',
      enter: 'blur',
      scene: {
        type: 'steps',
        headline: ['O que essa visão _permite_'],
        items: [
          {icon: 'coins', title: 'Formar reserva', sub: 'nos meses de venda mais forte'},
          {icon: 'layers', title: 'Mapear o que é ajustável', sub: 'e o que não dá para mexer'},
          {icon: 'calendar', title: 'Planejar compras', sub: 'e investimentos com antecedência'},
        ],
      },
    },
    {
      say: ['Planeje também os meses difíceis.', 'Salve e faça o teste com os seus números.'],
      enter: 'flood',
      scene: {type: 'closing', lines: ['Planeje também', 'os meses _difíceis._'], cta: 'Salve e teste o cenário com os seus números', ctaStyle: 'save'},
    },
  ],
  meta: {
    objetivo: 'Educação e autoridade: demonstrar projeção de cenários com uma planilha simples.',
    publico: 'Empresários com sazonalidade ou receita variável.',
    gancho: '“E se as vendas caírem?” com seta de tendência sendo desenhada.',
    cta: 'Planeje também os meses difíceis.',
    legenda:
      'E se as vendas caírem 25% nos próximos meses?\n\nNa projeção fictícia: saldo inicial de R$ 20 mil e compromissos fixos de R$ 36 mil por mês. No cenário esperado, o caixa cresce. Com vendas 25% menores, ele chega ao limite em outubro e novembro.\n\nTestar cenários não prevê o futuro, mas mostra o tamanho do risco a tempo de formar reserva, mapear despesas ajustáveis e planejar compras.\n\nSalve e teste com os seus números. 📌',
    hashtags: ['#planejamentofinanceiro', '#fluxodecaixa', '#sazonalidade', '#gestaofinanceira', '#pequenasempresas'],
    capa: 'E se as vendas caírem?',
  },
};
