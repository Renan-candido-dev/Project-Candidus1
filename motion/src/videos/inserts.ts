import type {VideoSpec} from '../series/types';

// Insertos animados (sem narração) para os vídeos gravados pelo fundador.
// São renderizados como clipes curtos para usar na edição (CapCut, Premiere etc.).
const base = (num: number, slug: string, title: string, scene: VideoSpec['beats'][number]['scene'], minDur: number): VideoSpec => ({
  id: `ins${String(num).padStart(2, '0')}`,
  num,
  slug,
  title,
  format: 'insert',
  silent: true,
  week: 0,
  month: 1,
  music: {bpm: 110, root: 55, seed: num},
  beats: [{scene, minDur}],
  meta: {objetivo: '', publico: '', gancho: '', cta: '', legenda: '', hashtags: [], capa: ''},
});

export const INSERTS: VideoSpec[] = [
  base(
    2,
    'faturamento-x-lucro',
    'Inserto V02: faturamento × lucro',
    {
      type: 'waterfall',
      headline: ['Faturamento *≠* _lucro_'],
      title: 'Exemplo do mês',
      steps: [
        {label: 'Faturamento', v: 30000, kind: 'start'},
        {label: 'Custos', v: -9000},
        {label: 'Despesas', v: -12000},
        {label: 'Impostos', v: -2400},
        {label: 'Resultado', v: 0, kind: 'total'},
      ],
      note: 'Cerca de 22% do faturamento virou resultado.',
    },
    7,
  ),
  base(
    6,
    'pequenos-gastos',
    'Inserto V06: pequenos gastos',
    {
      type: 'title',
      bg: 'ivory',
      big: {value: 21600, money: true, label: 'POR ANO EM PEQUENOS GASTOS', tone: 'ink'},
      lines: ['12 despesas de', '*~R$ 150* por mês'],
      size: 84,
    },
    5,
  ),
  base(
    10,
    'pagar-e-receber',
    'Inserto V10: a pagar × a receber',
    {
      type: 'split',
      headline: ['Dois lados, _uma data_'],
      left: {title: 'A pagar', icon: 'receipt', tone: 'coral', items: [{label: 'Ao longo do mês', v: -40000}]},
      right: {
        title: 'A receber',
        icon: 'coins',
        tone: 'green',
        items: [
          {label: 'Até o dia 29', v: 30000},
          {label: 'Só no dia 30', v: 15000},
        ],
      },
      footer: 'Fecha positivo, mas aperta no meio do mês.',
    },
    6,
  ),
  base(
    13,
    'pro-labore-x-lucro',
    'Inserto V13: pró-labore × lucro',
    {
      type: 'split',
      headline: ['Pró-labore *≠* _lucro_'],
      vs: '≠',
      left: {
        title: 'Pró-labore',
        icon: 'user',
        tone: 'gold',
        items: [{label: 'Pelo trabalho do sócio'}, {label: 'Valor definido'}, {label: 'Recorrente'}],
      },
      right: {
        title: 'Lucro distribuído',
        icon: 'chart',
        tone: 'green',
        items: [{label: 'Parte do resultado'}, {label: 'Depois de apurado'}, {label: 'Registrado'}],
      },
      footer: 'Defina, registre e siga a orientação do seu contador.',
    },
    6,
  ),
  base(
    18,
    'interno-x-bpo',
    'Inserto V18: interno × BPO',
    {
      type: 'split',
      headline: ['Interno *ou* _BPO?_'],
      vs: '?',
      left: {
        title: 'Funcionário interno',
        icon: 'user',
        tone: 'gold',
        items: [{label: 'Presença física'}, {label: 'Salário, encargos, benefícios'}, {label: 'Depende de uma pessoa'}],
      },
      right: {
        title: 'BPO financeiro',
        icon: 'layers',
        tone: 'green',
        items: [{label: 'Rotina com método'}, {label: 'Mensalidade'}, {label: 'Continuidade'}],
      },
      footer: 'Às vezes, a combinação dos dois é o melhor caminho.',
    },
    6,
  ),
  base(
    20,
    'primeira-conversa',
    'Inserto V20: primeira conversa',
    {
      type: 'steps',
      headline: ['A primeira _conversa_'],
      numbered: true,
      items: [
        {icon: 'repeat', title: 'Rotina', sub: 'quem cuida do financeiro e como'},
        {icon: 'layers', title: 'Volume', sub: 'contas, cartões, lançamentos'},
        {icon: 'doc', title: 'Sistemas', sub: 'banco, gestão, planilhas'},
        {icon: 'alert', title: 'Problemas', sub: 'o que mais preocupa hoje'},
      ],
    },
    5.5,
  ),
  base(
    21,
    'sobrecarga',
    'Inserto V21: sobrecarga',
    {
      type: 'notif',
      headline: ['E ainda tem o', '_financeiro_'],
      center: 'user',
      items: [
        {title: 'Novo pedido', sub: 'Cliente aguardando', amount: '+R$ 480', tone: 'in'},
        {title: 'Boleto vence hoje', sub: 'Fornecedor', amount: 'R$ 2.350', tone: 'alert'},
        {title: 'Mensagem da equipe', sub: 'Escala de sábado', amount: '', tone: 'out'},
        {title: 'Pix recebido', sub: 'Loja Centro', amount: '+R$ 640', tone: 'in'},
        {title: 'Folha de pagamento', sub: 'Conferir até sexta', amount: 'R$ 9.200', tone: 'out'},
        {title: 'Reunião', sub: 'Fornecedor às 16h', amount: '', tone: 'out'},
        {title: 'Fatura do cartão', sub: 'Fechou hoje', amount: 'R$ 6.074', tone: 'alert'},
        {title: 'Nova venda', sub: 'Pedido #4821', amount: '+R$ 389', tone: 'in'},
      ],
    },
    5.5,
  ),
];
