import type {VideoSpec} from '../series/types';

// Saldo inicial 6.000. Antes: 1.500, −4.700, 2.700, −1.200, 7.100, −2.700, 3.800, 1.700, 7.600.
// Depois de mudar Alfa (dia 5 → 13) e Beta (dia 10 → 19), nenhum dia fica negativo e o final continua 7.600.
const rows = [
  {dia: '02', desc: 'Aluguel', tipo: 'A pagar', valor: -4500, saldo: 1500},
  {dia: '05', desc: 'Fornecedor Alfa', tipo: 'A pagar', valor: -6200, saldo: -4700},
  {dia: '08', desc: 'Vendas no cartão', tipo: 'A receber', valor: 7400, saldo: 2700},
  {dia: '10', desc: 'Fornecedor Beta', tipo: 'A pagar', valor: -3900, saldo: -1200},
  {dia: '12', desc: 'Cliente B', tipo: 'A receber', valor: 8300, saldo: 7100},
  {dia: '15', desc: 'Folha de pagamento', tipo: 'A pagar', valor: -9800, saldo: -2700},
  {dia: '18', desc: 'Vendas', tipo: 'A receber', valor: 6500, saldo: 3800},
  {dia: '20', desc: 'Guia DAS', tipo: 'A pagar', valor: -2100, saldo: 1700},
  {dia: '26', desc: 'Vendas', tipo: 'A receber', valor: 5900, saldo: 7600},
];

export const v08: VideoSpec = {
  id: 'v08',
  num: 8,
  slug: 'contas-sem-planejamento',
  title: 'O que acontece quando você paga contas sem planejamento?',
  format: 'demo',
  week: 4,
  month: 1,
  music: {bpm: 106, root: 53, seed: 8},
  beats: [
    {
      say: 'Na prática: o que acontece quando as contas vencem antes de o dinheiro entrar?',
      scene: {type: 'title', bg: 'green', kicker: 'NA PRÁTICA', icon: 'calendar', lines: ['Contas que vencem', '_antes_ do dinheiro'], size: 90},
    },
    {
      say: [
        'Esta é a agenda fictícia de um mês: pagamentos e recebimentos, por data.',
        'Calculando o saldo dia a dia,',
        'aparecem três momentos de caixa negativo, mesmo com o mês fechando positivo.',
      ],
      enter: 'zoom',
      gap: 0.35,
      pad: 1.2,
      scene: {
        type: 'sheet',
        kicker: 'AGENDA FINANCEIRA · JUNHO',
        file: 'agenda_financeira_junho.xlsx',
        tabs: ['Agenda', 'Calendário'],
        columns: [
          {key: 'dia', label: 'Dia', w: 90},
          {key: 'desc', label: 'Descrição', w: 300},
          {key: 'tipo', label: 'Tipo', w: 170, tag: true},
          {key: 'valor', label: 'Valor', w: 190, align: 'right', money: true},
          {key: 'saldo', label: 'Saldo', w: 190, align: 'right', money: true},
        ],
        rows,
        steps: [
          {type: 'fill', col: 'saldo', cue: 1},
          {type: 'highlight', where: {col: 'saldo', lt: 0}, tone: 'coral', cue: 2},
          {type: 'badge', text: 'Saldo inicial R$ 6.000 · final R$ 7.600 · três buracos no meio', tone: 'coral', cue: 2, delay: 30},
        ],
      },
    },
    {
      say: [
        'No calendário, fica claro: as saídas chegam antes das entradas.',
        'Renegociando a data de dois fornecedores, o mês inteiro fica positivo.',
      ],
      enter: 'whipUp',
      pad: 1.0,
      scene: {
        type: 'calendar',
        headline: ['Ajustar as _datas_'],
        month: 'Junho',
        firstWeekday: 0,
        start: 6000,
        events: [
          {day: 2, label: 'Aluguel', v: -4500},
          {day: 5, label: 'Alfa', v: -6200},
          {day: 8, label: '+ Cartão', v: 7400},
          {day: 10, label: 'Beta', v: -3900},
          {day: 12, label: '+ Cliente', v: 8300},
          {day: 15, label: 'Folha', v: -9800},
          {day: 18, label: '+ Vendas', v: 6500},
          {day: 20, label: 'DAS', v: -2100},
          {day: 26, label: '+ Vendas', v: 5900},
        ],
        fix: {cue: 1, moves: [{i: 1, to: 13}, {i: 3, to: 19}]},
      },
    },
    {
      say: ['Organize suas contas antes que elas vençam.', 'Salve este exemplo.'],
      enter: 'flood',
      scene: {type: 'closing', lines: ['Organize as contas', 'antes que elas _vençam._'], cta: 'Salve e monte a sua agenda financeira', ctaStyle: 'save'},
    },
  ],
  meta: {
    objetivo: 'Reconhecimento do problema com prova prática: mostrar como o descasamento de datas cria aperto mesmo em meses positivos.',
    publico: 'Empresários que pagam as contas conforme chegam, sem olhar as datas de entrada.',
    gancho: '“Contas que vencem antes do dinheiro” + calendário sendo desenhado.',
    cta: 'Organize suas contas antes que elas vençam.',
    legenda:
      'O mês fecha positivo. Mesmo assim, faltou dinheiro em três momentos.\n\nNo exemplo fictício, o saldo começa em R$ 6.000 e termina em R$ 7.600, mas fica negativo nos dias 5, 10 e 15, porque as saídas vencem antes das entradas.\n\nColocando tudo numa agenda com o saldo dia a dia, dá para enxergar o aperto antes e, por exemplo, negociar datas com fornecedores.\n\nSalve e monte a sua agenda financeira. 📌',
    hashtags: ['#fluxodecaixa', '#contasapagar', '#gestaofinanceira', '#pequenasempresas', '#planejamentofinanceiro'],
    capa: 'Mês positivo, caixa negativo?',
  },
};
