import type {VideoSpec} from '../series/types';

// Receitas 48.000 + 12.500 = 60.500. Saídas 14.800 + 21.300 + 7.200 + 3.400 + 5.445 = 52.145.
// Resultado 8.355. Margem 8.355 / 60.500 = 13,8%.
const rows = [
  {grupo: 'Receitas', item: 'Serviços prestados', valor: 48000},
  {grupo: 'Receitas', item: 'Venda de produtos', valor: 12500},
  {grupo: 'Custos', item: 'Insumos e materiais', valor: -14800},
  {grupo: 'Pessoal', item: 'Folha e encargos', valor: -21300},
  {grupo: 'Despesas fixas', item: 'Aluguel e condomínio', valor: -7200},
  {grupo: 'Operacionais', item: 'Sistemas, energia, internet', valor: -3400},
  {grupo: 'Tributos', item: 'Impostos sobre vendas', valor: -5445},
];

export const v23: VideoSpec = {
  id: 'v23',
  num: 23,
  slug: 'fechamento-do-mes',
  title: 'Como seria fechar o mês com clareza financeira?',
  format: 'demo',
  week: 12,
  month: 3,
  music: {bpm: 112, root: 53, seed: 23},
  beats: [
    {
      say: 'Na prática: como seria fechar o mês com clareza sobre o financeiro?',
      scene: {type: 'title', bg: 'green', kicker: 'NA PRÁTICA', icon: 'check', lines: ['Fechar o mês', 'com _clareza_'], size: 104},
    },
    {
      say: [
        'Este é um fechamento gerencial fictício: receitas, custos e despesas, organizados por grupo.',
        'O resultado do mês fica evidente.',
        'E a margem também: quanto de cada venda virou resultado.',
      ],
      enter: 'zoom',
      gap: 0.4,
      pad: 1.0,
      scene: {
        type: 'sheet',
        kicker: 'FECHAMENTO GERENCIAL · MAIO',
        file: 'fechamento_maio.xlsx',
        tabs: ['Resultado', 'Pendências', 'Projeção'],
        columns: [
          {key: 'grupo', label: 'Grupo', w: 260, tag: true},
          {key: 'item', label: 'Item', w: 410},
          {key: 'valor', label: 'Valor', w: 250, align: 'right', money: true},
        ],
        rows,
        footers: [
          {label: 'Resultado do mês', values: {valor: 8355}},
          {label: 'Margem', values: {valor: '13,8%'}},
        ],
        steps: [
          {type: 'formula', footer: 0, col: 'valor', formula: '=SOMA(C2:C8)', cue: 1},
          {type: 'formula', footer: 1, col: 'valor', formula: '=C9/(C2+C3)', cue: 2},
          {type: 'badge', text: 'De cada R$ 100 vendidos, R$ 13,80 viraram resultado.', tone: 'gold', cue: 2, delay: 40},
        ],
      },
    },
    {
      say: ['Junto com o resultado, as contas pendentes e a projeção do caixa para noventa dias.', 'Assim, a reunião do mês vira decisão, e não susto.'],
      enter: 'whipUp',
      scene: {
        type: 'report',
        headline: ['O que vem _pela frente_'],
        title: 'Próximos passos',
        period: 'Maio fechado',
        sections: [
          {
            kind: 'open',
            title: 'Pendências',
            cue: 0,
            items: [
              {label: 'Cliente C', date: 'Dia 05', v: 6800},
              {label: 'Fornecedor Alfa', date: 'Dia 08', v: -4900},
              {label: 'Impostos do mês', date: 'Dia 20', v: -5445},
            ],
          },
          {kind: 'projection', title: 'Caixa projetado (R$ mil)', cue: 0, labels: ['Hoje', '30d', '60d', '90d'], values: [24.6, 26.1, 22.8, 29.4]},
        ],
      },
    },
    {
      say: ['Sua empresa tem essa visão do financeiro?', 'Fale com a Candidus.'],
      enter: 'flood',
      scene: {type: 'closing', lines: ['Sua empresa tem', 'essa _visão?_'], cta: 'Fale com a Candidus', ctaStyle: 'button'},
    },
  ],
  meta: {
    objetivo: 'Conversão: mostrar o “produto final” de um mês organizado (fechamento, pendências, projeção).',
    publico: 'Empresários prontos para buscar apoio, que querem ver como seria o resultado.',
    gancho: '“Fechar o mês com clareza” + check sendo desenhado.',
    cta: 'Sua empresa tem essa visão do financeiro?',
    legenda:
      'Como seria fechar o mês sabendo exatamente o que aconteceu e o que vem pela frente?\n\nNo exemplo fictício: receitas de R$ 60.500, custos e despesas organizados por grupo, resultado de R$ 8.355 e margem de 13,8%. Além disso, as pendências e a projeção do caixa para 90 dias.\n\nCom isso na mão, a reunião do mês vira decisão, e não susto.\n\nSua empresa tem essa visão? Fale com a Candidus pelo direct.',
    hashtags: ['#fechamentomensal', '#gestaofinanceira', '#bpofinanceiro', '#pequenasempresas', '#candidus'],
    capa: 'Fechar o mês com clareza',
  },
};
