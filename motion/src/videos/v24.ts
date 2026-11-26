import type {VideoSpec} from '../series/types';

export const v24: VideoSpec = {
  id: 'v24',
  num: 24,
  slug: 'financeiro-organizado',
  title: 'Sua empresa merece um financeiro organizado',
  format: 'motion',
  week: 12,
  month: 3,
  music: {bpm: 120, root: 57, seed: 24},
  beats: [
    {
      say: 'Boletos, notificações, planilhas soltas, e a sensação de não saber onde está o dinheiro.',
      scene: {
        type: 'stream',
        headline: ['Do _caos_...'],
        panel: {label: 'Saldo do mês', from: 18400, to: -1250},
        alerts: [{t: 'Vence hoje'}, {t: 'Pagamento em dobro?'}],
      },
    },
    {
      say: ['Com rotina e método, cada lançamento encontra o seu lugar.', 'Categorizado, conferido e conciliado.'],
      enter: 'flood',
      scene: {
        type: 'ledger',
        mode: 'sort',
        headline: ['...à *clareza*'],
        title: 'Lançamentos do mês',
        rows: [
          {name: 'Vendas no cartão', v: 15800, cat: 'Receitas'},
          {name: 'Fornecedor Alfa', v: -6200, cat: 'Fornecedores'},
          {name: 'Folha de pagamento', v: -9800, cat: 'Folha'},
          {name: 'Pix de clientes', v: 8300, cat: 'Receitas'},
          {name: 'Aluguel', v: -4500, cat: 'Despesas fixas'},
          {name: 'Guia DAS', v: -2100, cat: 'Impostos'},
        ],
        tagCue: 0,
        checkCue: 1,
        total: 'Resultado',
      },
    },
    {
      say: 'E os números passam a mostrar o caminho.',
      enter: 'whipUp',
      scene: {
        type: 'report',
        headline: ['Números que _orientam_'],
        title: 'Visão do mês',
        period: 'Conciliado',
        sections: [
          {
            kind: 'kpis',
            items: [
              {label: 'Entradas', v: 24100, money: true},
              {label: 'Saídas', v: 22600, money: true},
              {label: 'Resultado', v: 1500, money: true, delta: 'positivo', good: true},
            ],
          },
          {kind: 'projection', title: 'Caixa projetado (R$ mil)', labels: ['Hoje', '30d', '60d', '90d'], values: [9.6, 11.2, 10.4, 13.9]},
        ],
      },
      pad: 0.8,
    },
    {
      say: ['Você cuida do seu negócio. A Candidus ajuda a cuidar dos números.', 'Entre em contato com a Candidus Gestão Financeira.'],
      enter: 'flood',
      scene: {
        type: 'closing',
        lines: ['Você cuida do', 'seu *negócio.*', 'A Candidus ajuda', 'a cuidar dos _números._'],
        cta: 'Fale com a Candidus',
        ctaStyle: 'button',
      },
    },
  ],
  meta: {
    objetivo: 'Encerramento da campanha e conversão: sintetizar a transformação e convidar ao contato.',
    publico: 'Toda a audiência acumulada nos três meses.',
    gancho: 'Movimento caótico de lançamentos e saldo despencando: “do caos…”.',
    cta: 'Entre em contato com a Candidus Gestão Financeira.',
    legenda:
      'Do caos à clareza.\n\nBoletos, notificações e planilhas soltas viram lançamentos categorizados, conferidos e conciliados. E os números passam a mostrar o caminho para as suas decisões.\n\nVocê cuida do seu negócio. A Candidus ajuda a cuidar dos números.\n\nFale com a Candidus Gestão Financeira pelo direct.',
    hashtags: ['#bpofinanceiro', '#gestaofinanceira', '#organizacaofinanceira', '#pequenasempresas', '#candidus'],
    capa: 'Sua empresa merece um financeiro organizado',
  },
};
