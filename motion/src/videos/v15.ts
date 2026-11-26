import type {VideoSpec} from '../series/types';

// Divergência: Cliente B registrado por 2.750, creditado 2.600 → diferença de R$ 150.
export const v15: VideoSpec = {
  id: 'v15',
  num: 15,
  slug: 'conciliacao-bancaria',
  title: 'Como a conciliação bancária ajuda a encontrar erros',
  format: 'demo',
  week: 8,
  month: 2,
  music: {bpm: 110, root: 55, seed: 15},
  beats: [
    {
      say: 'Na prática: os seus registros batem com o banco?',
      scene: {type: 'title', bg: 'green', kicker: 'NA PRÁTICA', icon: 'bank', lines: ['Os registros', 'batem com o _banco?_'], size: 98},
    },
    {
      say: [
        'De um lado, os registros da empresa. Do outro, o extrato do banco.',
        'Linha a linha, os valores são conferidos.',
        'Aqui aparece uma diferença de cento e cinquenta reais no recebimento do cliente B.',
      ],
      enter: 'zoom',
      gap: 0.4,
      pad: 1.2,
      scene: {
        type: 'reconcile',
        headline: ['Conciliação _bancária_'],
        left: {
          title: 'Registros internos',
          rows: [
            {date: '03/06', label: 'Cliente A', v: 4200},
            {date: '05/06', label: 'Fornecedor Alfa', v: -3480},
            {date: '08/06', label: 'Aluguel', v: -4500},
            {date: '12/06', label: 'Cliente B', v: 2750},
            {date: '15/06', label: 'Energia', v: -684},
          ],
        },
        right: {
          title: 'Extrato do banco',
          rows: [
            {date: '03/06', label: 'Pix Cliente A', v: 4200},
            {date: '05/06', label: 'Boleto Alfa', v: -3480},
            {date: '08/06', label: 'Aluguel', v: -4500},
            {date: '12/06', label: 'Pix Cliente B', v: 2600},
            {date: '15/06', label: 'Energia', v: -684},
          ],
        },
        pairs: [
          [0, 0],
          [1, 1],
          [2, 2],
          [4, 4],
        ],
        matchCue: 1,
        mismatch: {left: 3, right: 3, label: 'Diferença: R$ 150,00', cue: 2},
      },
    },
    {
      say: 'A causa pode ser um desconto não registrado, uma taxa, um erro de digitação ou um pagamento parcial. Por isso, toda diferença precisa ser investigada.',
      enter: 'whipUp',
      scene: {
        type: 'steps',
        headline: ['Possíveis _causas_'],
        items: [
          {icon: 'receipt', title: 'Desconto não registrado'},
          {icon: 'card', title: 'Taxa ou tarifa'},
          {icon: 'doc', title: 'Erro de digitação'},
          {icon: 'coins', title: 'Pagamento parcial'},
        ],
      },
    },
    {
      say: ['Você confere se os seus registros correspondem ao banco?', 'Conta pra gente.'],
      enter: 'flood',
      scene: {type: 'closing', lines: ['Seus registros', 'batem com o _banco?_'], cta: 'Você confere seus registros com o banco?', ctaStyle: 'question'},
    },
  ],
  meta: {
    objetivo: 'Autoridade: demonstrar a conciliação bancária e o cuidado com a qualidade dos dados.',
    publico: 'Empresários que lançam recebimentos e pagamentos, mas não conferem com o extrato.',
    gancho: '“Os registros batem com o banco?”',
    cta: 'Você confere se os registros correspondem ao banco?',
    legenda:
      'Conciliação bancária é conferir, linha a linha, se o que a empresa registrou bate com o que aconteceu no banco.\n\nNo exemplo fictício, o recebimento do cliente B foi registrado como R$ 2.750, mas entraram R$ 2.600. Diferença: R$ 150.\n\nPode ser desconto não registrado, taxa, erro de digitação, pagamento parcial… Não dá para supor: toda diferença precisa ser investigada.\n\nVocê confere os seus registros com o banco? 👇',
    hashtags: ['#conciliacaobancaria', '#gestaofinanceira', '#controlefinanceiro', '#pequenasempresas', '#bpofinanceiro'],
    capa: 'Seus registros batem com o banco?',
  },
};
