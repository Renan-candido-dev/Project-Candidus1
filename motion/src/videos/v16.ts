import type {VideoSpec} from '../series/types';

// Saldo 62.000 − (21.000 + 14.500 + 6.300) − reserva 15.000 = 5.200 livre.
export const v16: VideoSpec = {
  id: 'v16',
  num: 16,
  slug: 'comprar-equipamento',
  title: 'Sua empresa pode comprar aquele equipamento?',
  format: 'motion',
  week: 8,
  month: 2,
  music: {bpm: 118, root: 52, seed: 16},
  beats: [
    {
      say: 'Um equipamento novo, de quarenta e oito mil reais. A sua empresa pode comprar?',
      scene: {
        type: 'title',
        bg: 'ivory',
        icon: 'box',
        big: {value: 48000, money: true, label: 'NOVO EQUIPAMENTO', tone: 'ink'},
        lines: ['Dá para _comprar?_'],
        size: 96,
      },
    },
    {
      say: [
        'O saldo hoje é de sessenta e dois mil.',
        'Mas, nos próximos trinta dias, há folha, fornecedores e impostos.',
        'E vale manter uma reserva para imprevistos.',
        'Sobram cerca de cinco mil livres.',
      ],
      enter: 'whipUp',
      scene: {
        type: 'balance',
        headline: ['Saldo *×* _capacidade_'],
        balance: {label: 'Saldo hoje', v: 62000},
        items: [
          {label: 'Folha e encargos', v: -21000, date: '30 dias', cue: 1},
          {label: 'Fornecedores', v: -14500, date: '30 dias', cue: 1},
          {label: 'Impostos', v: -6300, date: '30 dias', cue: 1},
          {label: 'Reserva de segurança', v: -15000, icon: 'target', cue: 2},
        ],
        result: 'Livre para novos compromissos',
        verdict: {text: 'À vista, o caixa ficaria abaixo da reserva.', tone: 'coral', cue: 3},
      },
    },
    {
      say: 'E parcelar também pede conta: a parcela precisa caber na folga mensal do caixa.',
      enter: 'whipLeft',
      scene: {
        type: 'split',
        headline: ['E se _parcelar?_'],
        vs: '?',
        left: {
          title: 'Parcela',
          icon: 'card',
          tone: 'coral',
          items: [{label: '12 × R$ 4.300'}, {label: 'Compromisso de um ano'}],
        },
        right: {
          title: 'Folga mensal',
          icon: 'coins',
          tone: 'green',
          items: [{label: 'Média de R$ 3.000'}, {label: 'Depois de todas as contas'}],
        },
        footer: 'Com esses números, a parcela não cabe sem ajustes. Com outros números, a resposta muda.',
        footerCue: 0,
      },
      pad: 1.4,
    },
    {
      say: ['Antes de comprar, analise o impacto no caixa.', 'Que compra você está avaliando?'],
      enter: 'flood',
      scene: {type: 'closing', lines: ['Antes de comprar,', 'olhe o _caixa._'], cta: 'Que compra você está avaliando?', ctaStyle: 'question'},
    },
  ],
  meta: {
    objetivo: 'Educação aplicada: diferenciar saldo atual de capacidade financeira para assumir uma nova obrigação.',
    publico: 'Empresários avaliando investimentos (equipamento, reforma, veículo).',
    gancho: 'R$ 48.000 gigante + “dá para comprar?”.',
    cta: 'Antes de comprar, analise o impacto no caixa.',
    legenda:
      'Saldo de R$ 62 mil na conta e um equipamento de R$ 48 mil. Dá para comprar?\n\nNo exemplo fictício, depois de folha, fornecedores, impostos e uma reserva para imprevistos, sobram cerca de R$ 5.200 livres. E a parcela (12 × R$ 4.300) seria maior que a folga mensal média (R$ 3.000).\n\nNão é um “não” automático: com outros números, a resposta muda. O ponto é decidir olhando a capacidade do caixa, não só o saldo.\n\nQue compra você está avaliando? 👇',
    hashtags: ['#fluxodecaixa', '#investimento', '#gestaofinanceira', '#pequenasempresas', '#tomadadedecisao'],
    capa: 'Dá para comprar aquele equipamento?',
  },
};
