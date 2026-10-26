import type {VideoSpec} from '../series/types';

export const v19: VideoSpec = {
  id: 'v19',
  num: 19,
  slug: 'rotina-mensal-candidus',
  title: 'O que a Candidus faz todos os meses?',
  format: 'motion',
  week: 10,
  month: 3,
  music: {bpm: 120, root: 55, seed: 19},
  beats: [
    {
      say: 'O que a Candidus faz, todos os meses, no financeiro de uma empresa?',
      scene: {type: 'title', bg: 'ivory', kicker: 'POR DENTRO DA ROTINA', icon: 'repeat', lines: ['O que a *Candidus*', 'faz todo _mês?_'], size: 92},
    },
    {
      say: [
        'Registra e acompanha os recebimentos.',
        'Organiza e agenda os pagamentos, para a sua aprovação.',
        'Concilia banco e cartões.',
        'Acompanha o fluxo de caixa.',
        'E fecha o mês com relatório e uma conversa sobre os números.',
      ],
      enter: 'flood',
      gap: 0.35,
      scene: {
        type: 'steps',
        layout: 'cycle',
        headline: ['Um ciclo, _todo mês_'],
        center: 'TODO MÊS',
        items: [
          {icon: 'coins', title: 'Recebimentos'},
          {icon: 'receipt', title: 'Pagamentos'},
          {icon: 'bank', title: 'Conciliação'},
          {icon: 'trend', title: 'Fluxo de caixa'},
          {icon: 'doc', title: 'Relatório'},
          {icon: 'chat', title: 'Reunião'},
        ],
      },
      pad: 0.8,
    },
    {
      say: 'No fim, você tem uma visão clara do mês e do que vem pela frente.',
      enter: 'whipUp',
      scene: {
        type: 'report',
        headline: ['Visão do mês e do que _vem_'],
        title: 'Resumo do mês',
        period: 'Fechado',
        sections: [
          {
            kind: 'kpis',
            items: [
              {label: 'Entradas', v: 64200, money: true},
              {label: 'Saídas', v: 57100, money: true},
              {label: 'Resultado', v: 7100, money: true, delta: 'no mês', good: true},
            ],
          },
          {kind: 'projection', title: 'Caixa projetado (R$ mil)', labels: ['Hoje', '30d', '60d', '90d'], values: [21.4, 24.9, 19.8, 26.3]},
        ],
      },
    },
    {
      say: ['Vamos conversar sobre o financeiro da sua empresa?', 'Fale com a Candidus.'],
      enter: 'flood',
      scene: {type: 'closing', lines: ['Vamos conversar', 'sobre o seu _financeiro?_'], cta: 'Fale com a Candidus', ctaStyle: 'button'},
    },
  ],
  meta: {
    objetivo: 'Confiança e conversão: mostrar a rotina concreta do serviço, mês a mês.',
    publico: 'Empresários avaliando terceirizar o financeiro, que querem entender o dia a dia do serviço.',
    gancho: '“O que a Candidus faz todo mês?” com ícone de ciclo sendo desenhado.',
    cta: 'Vamos conversar sobre o financeiro da sua empresa?',
    legenda:
      'Como é, na prática, um mês com a Candidus:\n\n1. Recebimentos registrados e acompanhados\n2. Pagamentos organizados e agendados, para a sua aprovação\n3. Conciliação de banco e cartões\n4. Acompanhamento do fluxo de caixa\n5. Relatório gerencial\n6. Conversa sobre os números\n\nVocê aprova e decide; a rotina fica organizada.\n\nVamos conversar sobre o financeiro da sua empresa? Chama no direct.',
    hashtags: ['#bpofinanceiro', '#gestaofinanceira', '#fluxodecaixa', '#pequenasempresas', '#candidus'],
    capa: 'Um mês de financeiro com a Candidus',
  },
};
