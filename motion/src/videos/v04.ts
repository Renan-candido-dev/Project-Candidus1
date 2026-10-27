import type {VideoSpec} from '../series/types';

// Dados fictícios. Soma conferida: resultado −2.011; pessoais −4.451; operação +2.440.
const rows = [
  {data: '01/06', desc: 'Vendas no cartão', cat: 'Receitas', valor: 12400},
  {data: '03/06', desc: 'Fornecedor Alfa', cat: 'Fornecedores', valor: -3480},
  {data: '04/06', desc: 'Supermercado', cat: 'Gasto pessoal', valor: -612},
  {data: '05/06', desc: 'Aluguel da loja', cat: 'Despesas fixas', valor: -4800},
  {data: '08/06', desc: 'Pix de clientes', cat: 'Receitas', valor: 6900},
  {data: '10/06', desc: 'Escola dos filhos', cat: 'Gasto pessoal', valor: -1450},
  {data: '12/06', desc: 'Folha de pagamento', cat: 'Folha', valor: -7200},
  {data: '15/06', desc: 'Streaming e apps', cat: 'Gasto pessoal', valor: -89},
  {data: '18/06', desc: 'Guia DAS', cat: 'Impostos', valor: -1380},
  {data: '22/06', desc: 'Viagem de férias', cat: 'Gasto pessoal', valor: -2300},
];

export const v04: VideoSpec = {
  id: 'v04',
  num: 4,
  slug: 'pessoal-x-empresa',
  title: 'O perigo de misturar dinheiro pessoal com dinheiro da empresa',
  format: 'demo',
  week: 2,
  month: 1,
  music: {bpm: 104, root: 55, seed: 4},
  beats: [
    {
      say: 'Na prática: o que acontece quando a conta da empresa paga as despesas da casa?',
      scene: {type: 'title', bg: 'green', kicker: 'NA PRÁTICA', icon: 'card', lines: ['Conta da *empresa*', 'ou conta _pessoal?_'], size: 88},
    },
    {
      say: [
        'Este é o extrato fictício de uma empresa em junho.',
        'Somando tudo, o mês fechou negativo.',
        'Agora, cada lançamento ganha uma categoria.',
        'Aparecem quatro gastos pessoais.',
        'Sem eles, a operação da empresa ficou positiva.',
      ],
      enter: 'zoom',
      gap: 0.5,
      pad: 1.4,
      scene: {
        type: 'sheet',
        kicker: 'EXTRATO DA EMPRESA · JUNHO',
        file: 'extrato_empresa_junho.xlsx',
        tabs: ['Extrato', 'Categorias', 'Resumo'],
        columns: [
          {key: 'data', label: 'Data', w: 110},
          {key: 'desc', label: 'Descrição', w: 320},
          {key: 'cat', label: 'Categoria', w: 250, tag: true},
          {key: 'valor', label: 'Valor', w: 236, align: 'right', money: true},
        ],
        rows,
        footers: [
          {label: 'Resultado do mês', values: {valor: -2011}},
          {label: 'Gastos pessoais', values: {valor: -4451}},
          {label: 'Resultado da empresa', values: {valor: 2440}},
        ],
        steps: [
          {type: 'formula', footer: 0, col: 'valor', formula: '=SOMA(D2:D11)', cue: 1, delay: 10},
          {type: 'fill', col: 'cat', cue: 2, delay: 8},
          {type: 'highlight', where: {col: 'cat', eq: 'Gasto pessoal'}, tone: 'coral', cue: 3},
          {type: 'formula', footer: 1, col: 'valor', formula: '=SOMASE(C2:C11;"Gasto pessoal";D2:D11)', cue: 3, delay: 14},
          {type: 'hide', where: {col: 'cat', eq: 'Gasto pessoal'}, cue: 4},
          {type: 'formula', footer: 2, col: 'valor', formula: '=D12-D13', cue: 4, delay: 14},
          {type: 'badge', text: 'A operação deu +R$ 2.440. Faltava separar as contas.', tone: 'green', cue: 4, delay: 40},
        ],
      },
    },
    {
      say: 'Misturando, você não sabe se o negócio dá lucro ou se o dinheiro foi para casa.',
      enter: 'whipUp',
      scene: {
        type: 'split',
        headline: ['Duas contas, _duas leituras_'],
        left: {
          title: 'Tudo misturado',
          icon: 'alert',
          tone: 'coral',
          items: [{label: 'Resultado parece negativo'}, {label: 'Gastos da casa somem no extrato'}, {label: 'Decisões no escuro'}],
        },
        right: {
          title: 'Contas separadas',
          icon: 'check',
          tone: 'green',
          items: [{label: 'Resultado real da operação'}, {label: 'Retiradas planejadas'}, {label: 'Números confiáveis'}],
        },
        footer: 'Retiradas do sócio são registradas como retiradas, não como despesas da empresa.',
        footerCue: 0,
      },
    },
    {
      say: ['Pessoal é pessoal. Empresa é empresa.', 'Sua empresa tem essa separação clara?'],
      enter: 'flood',
      scene: {
        type: 'closing',
        lines: ['Pessoal é pessoal.', 'Empresa é _empresa._'],
        cta: 'Sua empresa separa as duas contas?',
        ctaStyle: 'question',
      },
    },
  ],
  meta: {
    objetivo: 'Reconhecimento do problema com prova prática: mostrar como a mistura de contas distorce a leitura do resultado.',
    publico: 'Empresários que usam a conta da empresa para despesas pessoais (e vice-versa).',
    gancho: '“Conta da empresa ou conta pessoal?” sobre fundo verde, com a planilha entrando logo em seguida.',
    cta: 'Sua empresa tem uma separação clara entre dinheiro pessoal e empresarial?',
    legenda:
      'Neste exemplo fictício, o extrato da empresa fechou o mês em −R$ 2.011. Parecia prejuízo.\n\nQuando cada lançamento ganhou uma categoria, apareceram R$ 4.451 em gastos pessoais pagos pela conta da empresa. Separando, a operação teve resultado positivo de R$ 2.440.\n\nMisturar as contas não muda só o saldo: muda a leitura que você faz do negócio.\n\nSua empresa tem essa separação clara? 👇',
    hashtags: ['#gestaofinanceira', '#pequenasempresas', '#contapj', '#organizacaofinanceira', '#empreendedor'],
    capa: 'Pessoal ou empresa? O que a mistura esconde',
  },
};
