import type {VideoSpec} from '../series/types';

export const v17: VideoSpec = {
  id: 'v17',
  num: 17,
  slug: 'o-que-e-bpo-financeiro',
  title: 'O que é BPO financeiro?',
  format: 'motion',
  week: 9,
  month: 3,
  music: {bpm: 116, root: 57, seed: 17},
  beats: [
    {
      say: 'Afinal, o que é BPO financeiro?',
      scene: {type: 'title', bg: 'green', kicker: 'BPO FINANCEIRO', icon: 'layers', lines: ['O que é *BPO*', '_financeiro?_'], size: 104},
    },
    {
      say: [
        'É a terceirização das rotinas financeiras para uma equipe especializada.',
        'Contas a pagar e a receber, conciliação bancária e relatórios gerenciais.',
      ],
      enter: 'zoom',
      scene: {
        type: 'steps',
        headline: ['As rotinas, com _método_'],
        items: [
          {icon: 'receipt', title: 'Contas a pagar', sub: 'lançar, agendar e conferir'},
          {icon: 'coins', title: 'Contas a receber', sub: 'acompanhar entradas e atrasos'},
          {icon: 'bank', title: 'Conciliação', sub: 'registros batendo com banco e cartões'},
          {icon: 'chart', title: 'Relatórios', sub: 'dados viram visão gerencial'},
        ],
      },
    },
    {
      say: 'O empresário continua no comando: aprova os pagamentos e toma as decisões. O BPO cuida da rotina e organiza a informação.',
      enter: 'whipLeft',
      scene: {
        type: 'split',
        headline: ['Quem faz _o quê_'],
        vs: '+',
        left: {
          title: 'Com o BPO',
          icon: 'layers',
          tone: 'gold',
          items: [{label: 'Rotina de lançamentos'}, {label: 'Conferência e conciliação'}, {label: 'Relatórios'}],
        },
        right: {
          title: 'Com você',
          icon: 'user',
          tone: 'green',
          items: [{label: 'Aprovar pagamentos'}, {label: 'Decisões do negócio'}, {label: 'Prioridades'}],
        },
        footer: 'BPO financeiro não substitui a contabilidade nem uma auditoria.',
      },
      pad: 1.2,
    },
    {
      say: ['Rotina organizada e informação na mão.', 'Conheça a proposta da Candidus.'],
      enter: 'flood',
      scene: {type: 'closing', lines: ['Rotina organizada,', 'informação _na mão._'], cta: 'Conheça a proposta da Candidus', ctaStyle: 'button'},
    },
  ],
  meta: {
    objetivo: 'Apresentação do serviço: explicar o que é BPO financeiro e o papel de cada lado.',
    publico: 'Empresários que já reconhecem o problema e começam a buscar apoio.',
    gancho: '“O que é BPO financeiro?” em tipografia grande sobre verde.',
    cta: 'Conheça a proposta da Candidus.',
    legenda:
      'BPO financeiro é a terceirização das rotinas financeiras: contas a pagar e a receber, conciliação bancária e relatórios gerenciais.\n\nO que não muda: quem aprova os pagamentos e toma as decisões é o empresário. O BPO cuida da rotina e organiza a informação para essas decisões.\n\nE vale dizer: BPO financeiro não substitui a contabilidade nem uma auditoria.\n\nQuer conhecer a proposta da Candidus? Fale com a gente pelo direct.',
    hashtags: ['#bpofinanceiro', '#terceirizacaofinanceira', '#gestaofinanceira', '#pequenasempresas', '#candidus'],
    capa: 'O que é BPO financeiro?',
  },
};
