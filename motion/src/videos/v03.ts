import type {VideoSpec} from '../series/types';

export const v03: VideoSpec = {
  id: 'v03',
  num: 3,
  slug: 'tres-sinais',
  title: 'Três sinais de que seu financeiro está desorganizado',
  format: 'motion',
  week: 2,
  month: 1,
  music: {bpm: 118, root: 57, seed: 3},
  beats: [
    {
      say: 'Três sinais de que o financeiro da sua empresa está desorganizado.',
      scene: {
        type: 'title',
        bg: 'ivory',
        kicker: 'SINAIS DE ALERTA',
        big: {value: 3, from: 0, tone: 'green'},
        lines: ['sinais de que o financeiro', 'está *desorganizado*'],
        size: 76,
      },
    },
    {
      say: ['Primeiro: contas que vencem sem ninguém perceber.', 'A multa e os juros só aparecem depois, no extrato.'],
      enter: 'whipUp',
      scene: {
        type: 'ledger',
        headline: ['*1.* Contas _esquecidas_'],
        title: 'Contas a pagar',
        subtitle: 'esta semana',
        rows: [
          {date: 'Seg', name: 'Energia elétrica', v: -684, cat: 'Despesas fixas'},
          {date: 'Ter', name: 'Internet e telefone', v: -219, cat: 'Despesas fixas'},
          {date: 'Qua', name: 'Embalagens', v: -2350, cat: 'Fornecedores'},
          {date: 'Qui', name: 'Guia DAS', v: -1912.4, cat: 'Impostos'},
          {date: 'Sex', name: 'Multa e juros', v: -96.3, cat: 'Taxas'},
        ],
        flags: [
          {cue: 0, rows: [2], label: 'Venceu', tone: 'coral'},
          {cue: 1, rows: [4], label: 'Custo evitável', tone: 'coral'},
        ],
        total: 'Total da semana',
      },
    },
    {
      say: ['Segundo: o mesmo boleto pago duas vezes.', 'Sem conferência, ninguém percebe.'],
      enter: 'whipLeft',
      scene: {
        type: 'ledger',
        headline: ['*2.* Pagamento _duplicado_'],
        title: 'Pagamentos realizados',
        subtitle: 'extrato do mês',
        rows: [
          {date: '03/06', name: 'Fornecedor Alfa', v: -3480, cat: 'Fornecedores'},
          {date: '05/06', name: 'Aluguel da loja', v: -4800, cat: 'Despesas fixas'},
          {date: '10/06', name: 'Fornecedor Alfa', v: -3480, cat: 'Fornecedores'},
          {date: '12/06', name: 'Software de gestão', v: -189, cat: 'Assinaturas'},
          {date: '15/06', name: 'Folha de pagamento', v: -9200, cat: 'Folha'},
        ],
        flags: [{cue: 0, rows: [0, 2], label: 'Duplicado', tone: 'gold'}],
      },
    },
    {
      say: 'Terceiro: você não sabe quanto vai ter em caixa daqui a trinta dias.',
      enter: 'zoom',
      scene: {
        type: 'calendar',
        headline: ['*3.* Saldo futuro _desconhecido_'],
        month: 'Próximos 30 dias',
        firstWeekday: 2,
        start: 8200,
        events: [
          {day: 3, label: '+ Vendas', v: 3100},
          {day: 5, label: 'Aluguel', v: -4800},
          {day: 8, label: 'Fornec.', v: -3480},
          {day: 10, label: 'Folha', v: -9200},
          {day: 15, label: '+ Cartão', v: 6400},
          {day: 20, label: 'DAS', v: -1912},
          {day: 24, label: '+ Vendas', v: 7300},
          {day: 28, label: 'Energia', v: -684},
        ],
      },
    },
    {
      say: 'O primeiro passo: registrar cada conta com data, valor e categoria, num só lugar.',
      enter: 'blur',
      scene: {
        type: 'steps',
        headline: ['O primeiro _passo_'],
        items: [
          {icon: 'calendar', title: 'Data', sub: 'quando vence ou quando entra'},
          {icon: 'coins', title: 'Valor', sub: 'exato, conferido com o documento'},
          {icon: 'layers', title: 'Categoria', sub: 'para saber para onde vai o dinheiro'},
        ],
        numbered: false,
      },
    },
    {
      say: ['Quantos desses sinais existem na sua empresa?', 'Conta aqui nos comentários.'],
      enter: 'flood',
      scene: {
        type: 'closing',
        lines: ['Quantos desses', 'sinais existem', 'na sua _empresa?_'],
        cta: 'Comente: 1, 2 ou 3 sinais?',
        ctaStyle: 'question',
      },
    },
  ],
  meta: {
    objetivo: 'Reconhecimento do problema: fazer o empresário identificar sintomas concretos de desorganização.',
    publico: 'Donos de pequenas empresas que pagam as contas por conta própria, sem rotina de conferência.',
    gancho: 'Número 3 gigante + “sinais de que o financeiro está desorganizado” já no primeiro segundo.',
    cta: 'Quantos desses sinais existem na sua empresa?',
    legenda:
      'Desorganização financeira quase nunca aparece de uma vez. Ela dá sinais: conta que vence sem ninguém ver, boleto pago duas vezes, e aquela sensação de não saber quanto vai ter no caixa no mês que vem.\n\nO primeiro passo é simples: registrar cada conta com data, valor e categoria, em um só lugar.\n\nQuantos desses sinais você reconhece aí? Conta nos comentários. 👇',
    hashtags: ['#gestaofinanceira', '#pequenasempresas', '#fluxodecaixa', '#empreendedorismo', '#financasempresariais'],
    capa: '3 sinais de que seu financeiro está desorganizado',
  },
};
