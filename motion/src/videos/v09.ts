import type {VideoSpec} from '../series/types';

// 10.000 + 38.000 − 15.500 − 14.000 − 12.000 = 6.500.
// Semanas: entradas [9, 8, 7, 6, 4, 4] = 38 · saídas [5, 16, 4, 12, 1, 3,5] = 41,5 → saldo [14, 6, 9, 3, 6, 6,5].
export const v09: VideoSpec = {
  id: 'v09',
  num: 9,
  slug: 'fluxo-de-caixa-30s',
  title: 'Fluxo de caixa explicado em 30 segundos',
  format: 'motion',
  week: 5,
  month: 2,
  music: {bpm: 122, root: 53, seed: 9},
  beats: [
    {
      say: 'Fluxo de caixa, explicado em trinta segundos.',
      scene: {type: 'title', bg: 'ivory', kicker: 'EM 30 SEGUNDOS', icon: 'clock', lines: ['Fluxo de _caixa_', '*sem complicação*'], size: 96},
    },
    {
      say: [
        'Começa com o saldo inicial: o que havia no caixa.',
        'Somam-se as entradas, como vendas e recebimentos.',
        'Subtraem-se as saídas: fornecedores, folha, despesas e impostos.',
        'O resultado é o saldo final, que vira o saldo inicial do próximo período.',
      ],
      enter: 'whipUp',
      scene: {
        type: 'waterfall',
        headline: ['Do início ao _fim_'],
        title: 'Fluxo do mês',
        steps: [
          {label: 'Saldo inicial', v: 10000, kind: 'start', cue: 0},
          {label: 'Entradas', v: 38000, cue: 1},
          {label: 'Fornecedores', v: -15500, cue: 2},
          {label: 'Folha', v: -14000, cue: 2},
          {label: 'Fixas e impostos', v: -12000, cue: 2},
          {label: 'Saldo final', v: 0, kind: 'total', cue: 3},
        ],
      },
    },
    {
      say: 'Acompanhando semana a semana, você vê antes quando o caixa vai apertar.',
      enter: 'zoom',
      scene: {
        type: 'chart',
        headline: ['Semana a _semana_'],
        title: 'Fluxo semanal',
        labels: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'],
        series: [
          {name: 'Entradas', values: [9, 8, 7, 6, 4, 4], kind: 'bar', tone: 'gold'},
          {name: 'Saídas', values: [5, 16, 4, 12, 1, 3.5], kind: 'bar', tone: 'soft'},
          {name: 'Saldo', values: [14, 6, 9, 3, 6, 6.5], kind: 'line', tone: 'green'},
        ],
        yMax: 20,
        highlight: {series: 2, index: 3, label: 'Semana mais apertada', tone: 'coral'},
      },
    },
    {
      say: ['Saldo inicial, mais entradas, menos saídas: saldo final.', 'Salve para consultar quando precisar.'],
      enter: 'flood',
      scene: {
        type: 'closing',
        lines: ['Saldo inicial', '*+ entradas − saídas*', '= _saldo final_'],
        cta: 'Salve para consultar quando precisar',
        ctaStyle: 'save',
      },
    },
  ],
  meta: {
    objetivo: 'Educação: explicar o conceito de fluxo de caixa de forma visual e memorável.',
    publico: 'Empresários que ouvem falar de fluxo de caixa, mas nunca viram o conceito de forma simples.',
    gancho: '“Em 30 segundos” + relógio sendo desenhado: promessa clara de rapidez.',
    cta: 'Salve para consultar quando precisar.',
    legenda:
      'Fluxo de caixa, sem complicação:\n\nSaldo inicial + entradas − saídas = saldo final.\n\nE o saldo final vira o saldo inicial do próximo período. Acompanhando semana a semana, você enxerga antes quando o caixa vai apertar, e não só depois.\n\n(Valores do exemplo são fictícios.)\n\nSalve para consultar quando precisar. 📌',
    hashtags: ['#fluxodecaixa', '#educacaofinanceira', '#gestaofinanceira', '#pequenasempresas', '#financasempresariais'],
    capa: 'Fluxo de caixa em 30 segundos',
  },
};
