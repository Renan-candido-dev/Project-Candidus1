import type {VideoSpec} from '../series/types';

// Saídas do mês (fictício): 12.600 + 8.400 + 4.500 + 3.150 + 2.130 + 420 = 31.200.
// Pessoal + fornecedores = 21.000 → 67% das saídas.
export const v11: VideoSpec = {
  id: 'v11',
  num: 11,
  slug: 'cada-centavo',
  title: 'Como descobrir para onde está indo cada centavo',
  format: 'motion',
  week: 6,
  month: 2,
  music: {bpm: 116, root: 57, seed: 11},
  beats: [
    {
      say: 'Para onde está indo cada centavo da sua empresa?',
      scene: {type: 'stream', headline: ['Para onde vai', 'cada _centavo?_']},
    },
    {
      say: ['Tudo começa nos lançamentos.', 'Cada um recebe uma categoria: pessoal, fornecedores, tributos, despesas operacionais.'],
      enter: 'flood',
      scene: {
        type: 'ledger',
        mode: 'sort',
        headline: ['Uma *categoria*', 'para cada _lançamento_'],
        headSize: 72,
        title: 'Saídas do mês',
        rows: [
          {name: 'Matéria-prima', v: -8400, cat: 'Fornecedores'},
          {name: 'Salários e encargos', v: -12600, cat: 'Pessoal'},
          {name: 'Energia', v: -980, cat: 'Operacionais'},
          {name: 'Guia DAS', v: -3150, cat: 'Tributos'},
          {name: 'Aluguel', v: -4500, cat: 'Despesas fixas'},
          {name: 'Software', v: -420, cat: 'Assinaturas'},
          {name: 'Manutenção', v: -1150, cat: 'Operacionais'},
        ],
        tagCue: 1,
        total: 'Total de saídas',
      },
    },
    {
      say: ['Somando por categoria, o mês ganha forma.', 'Aqui, pessoal e fornecedores concentram dois terços das saídas.'],
      enter: 'whipUp',
      scene: {
        type: 'report',
        headline: ['O mês ganha _forma_'],
        title: 'Saídas por categoria',
        period: 'Junho',
        sections: [
          {
            kind: 'cats',
            title: 'Total: R$ 31.200',
            cue: 0,
            items: [
              {label: 'Pessoal', v: 12600},
              {label: 'Fornecedores', v: 8400},
              {label: 'Despesas fixas', v: 4500},
              {label: 'Tributos', v: 3150},
              {label: 'Operacionais', v: 2130},
              {label: 'Assinaturas', v: 420},
            ],
          },
          {kind: 'ring', label: 'Pessoal + fornecedores', value: 67, sub: 'das saídas do mês estão em duas categorias', cue: 1},
        ],
      },
    },
    {
      say: ['Organização financeira começa com informação confiável.', 'Salve para organizar as suas categorias.'],
      enter: 'flood',
      scene: {
        type: 'closing',
        lines: ['Organização começa', 'com informação', '_confiável._'],
        cta: 'Salve para organizar as suas categorias',
        ctaStyle: 'save',
      },
    },
  ],
  meta: {
    objetivo: 'Educação: mostrar como a categorização transforma lançamentos soltos em informação.',
    publico: 'Empresários que sabem quanto gastaram no total, mas não em quê.',
    gancho: 'Movimento caótico de entradas e saídas com a pergunta “para onde vai cada centavo?”.',
    cta: 'Organização financeira começa com informação confiável.',
    legenda:
      'Saber o total que saiu no mês é pouco. O que ajuda a decidir é saber para onde saiu.\n\nQuando cada lançamento recebe uma categoria (pessoal, fornecedores, tributos, despesas operacionais…), o mês ganha forma. No exemplo fictício, duas categorias concentram 67% das saídas.\n\nOrganização financeira começa com informação confiável. Salve para organizar as suas. 📌',
    hashtags: ['#gestaofinanceira', '#planodecontas', '#controlefinanceiro', '#pequenasempresas', '#organizacaofinanceira'],
    capa: 'Para onde vai cada centavo?',
  },
};
