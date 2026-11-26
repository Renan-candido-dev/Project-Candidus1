import type {VideoSpec} from '../series/types';

// Saldo 42.300 − compromissos 41.200 = 1.100 disponível.
export const v07: VideoSpec = {
  id: 'v07',
  num: 7,
  slug: 'saldo-nao-e-lucro',
  title: 'Ter dinheiro na conta não significa ter lucro',
  format: 'motion',
  week: 4,
  month: 1,
  music: {bpm: 120, root: 50, seed: 7},
  beats: [
    {
      say: 'Quarenta e dois mil reais na conta. Parece que sobrou dinheiro, certo?',
      scene: {
        type: 'title',
        bg: 'green',
        big: {value: 42300, money: true, label: 'SALDO EM CONTA HOJE', tone: 'gold'},
        lines: ['Parece que', 'sobrou _dinheiro?_'],
        size: 88,
      },
    },
    {
      say: [
        'Agora coloque na conta o que já está comprometido.',
        'Folha, fornecedores, impostos, aluguel e a parcela do empréstimo.',
        'Do saldo, sobram cerca de mil e cem reais.',
      ],
      enter: 'whipUp',
      scene: {
        type: 'balance',
        headline: ['O que já tem _destino_'],
        balance: {label: 'Saldo hoje', v: 42300},
        items: [
          {label: 'Folha e encargos', v: -14600, date: 'dia 05', cue: 1},
          {label: 'Fornecedores', v: -12800, date: 'dia 10', cue: 1},
          {label: 'Impostos do mês', v: -6900, date: 'dia 20', cue: 1},
          {label: 'Aluguel', v: -4500, date: 'dia 10', cue: 1},
          {label: 'Parcela do empréstimo', v: -2400, date: 'dia 15', cue: 1},
        ],
        result: 'Livre de verdade',
        verdict: {text: 'Boa parte do saldo já tem destino.', tone: 'gold', cue: 2},
      },
    },
    {
      say: 'Lucro é o que sobra das receitas depois dos custos e despesas do período. O saldo é só a foto de um dia.',
      enter: 'whipLeft',
      scene: {
        type: 'split',
        headline: ['Saldo *≠* _lucro_'],
        vs: '≠',
        left: {
          title: 'Saldo bancário',
          icon: 'bank',
          tone: 'gold',
          items: [{label: 'Foto de um único dia'}, {label: 'Inclui dinheiro já comprometido'}, {label: 'Pode incluir empréstimos'}],
        },
        right: {
          title: 'Lucro',
          icon: 'chart',
          tone: 'green',
          items: [{label: 'Receitas menos custos e despesas'}, {label: 'Medido no período'}, {label: 'Mostra se o negócio se paga'}],
        },
      },
    },
    {
      say: ['Antes de gastar, olhe além do saldo bancário.', 'Salve para lembrar.'],
      enter: 'flood',
      scene: {type: 'closing', lines: ['Olhe *além*', 'do _saldo._'], cta: 'Antes de gastar, olhe os compromissos do mês', ctaStyle: 'save'},
    },
  ],
  meta: {
    objetivo: 'Reconhecimento do problema: desfazer a ideia de que saldo positivo significa folga ou lucro.',
    publico: 'Empresários que tomam decisões de gasto olhando só o saldo do banco.',
    gancho: 'R$ 42.300 em dourado, grande, com a pergunta “parece que sobrou dinheiro?”.',
    cta: 'Olhe além do saldo bancário.',
    legenda:
      'R$ 42.300 na conta. Parece folga, mas olha o que já tem destino: folha, fornecedores, impostos, aluguel e a parcela do empréstimo. No exemplo (fictício), sobram cerca de R$ 1.100.\n\nSaldo é a foto de um dia. Lucro é o que sobra das receitas depois dos custos e despesas do período. São coisas diferentes, e misturar as duas leva a decisões arriscadas.\n\nAntes de gastar, olhe além do saldo. 📌',
    hashtags: ['#fluxodecaixa', '#gestaofinanceira', '#lucro', '#pequenasempresas', '#empreendedorismo'],
    capa: 'Dinheiro na conta não é lucro',
  },
};
