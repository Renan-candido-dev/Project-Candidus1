import type {VideoSpec} from '../series/types';

// Exemplo fictício: fixas R$ 18.000; variáveis 40% das vendas → equilíbrio = 18.000 / (1 − 0,4) = R$ 30.000.
export const v05: VideoSpec = {
  id: 'v05',
  num: 5,
  slug: 'ponto-de-equilibrio',
  title: 'Quanto sua empresa precisa vender para pagar as contas?',
  format: 'motion',
  week: 3,
  month: 1,
  music: {bpm: 112, root: 52, seed: 5},
  beats: [
    {
      say: 'Quanto sua empresa precisa vender por mês para pagar as contas?',
      scene: {type: 'title', bg: 'ivory', icon: 'target', lines: ['Quanto você precisa', '*vender*', 'para pagar as _contas?_'], size: 90},
    },
    {
      say: [
        'Primeiro, as despesas fixas: existem mesmo sem vendas.',
        'Depois, os custos variáveis, que crescem com as vendas.',
      ],
      enter: 'whipLeft',
      scene: {
        type: 'split',
        headline: ['Fixas *×* _variáveis_'],
        vs: '+',
        left: {
          title: 'Despesas fixas',
          icon: 'calendar',
          tone: 'gold',
          cue: 0,
          items: [
            {label: 'Aluguel', v: -4500},
            {label: 'Salários', v: -9000},
            {label: 'Contador e sistemas', v: -1500},
            {label: 'Outras fixas', v: -3000},
          ],
          total: -18000,
        },
        right: {
          title: 'Custos variáveis',
          icon: 'trend',
          tone: 'coral',
          cue: 1,
          items: [{label: 'Insumos: 30% das vendas'}, {label: 'Impostos sobre vendas: 6%'}, {label: 'Taxas de cartão: 4%'}, {label: 'Total: 40% de cada venda'}],
        },
      },
    },
    {
      say: [
        'A linha dourada são as fixas.',
        'Somando os variáveis, temos o custo total.',
        'Onde a receita cruza essa linha está o equilíbrio.',
        'Aqui, cerca de trinta mil reais em vendas.',
      ],
      enter: 'zoom',
      gap: 0.35,
      scene: {type: 'breakeven', headline: ['Ponto de _equilíbrio_'], fixed: 18000, variable: 0.4, maxRevenue: 60000, cues4: [0, 1, 2, 3]},
    },
    {
      say: 'Abaixo disso, prejuízo. Acima, resultado.',
      minDur: 3.6,
      enter: 'blur',
      scene: {
        type: 'title',
        bg: 'green',
        lines: ['Abaixo: _prejuízo._', 'Acima: *resultado.*'],
        sub: 'Conta introdutória. Uma análise completa considera sazonalidade, impostos e a contabilidade da empresa.',
        size: 92,
      },
    },
    {
      say: ['Você conhece o ponto de equilíbrio do seu negócio?', 'Salve e faça a conta.'],
      enter: 'flood',
      scene: {
        type: 'closing',
        lines: ['Você conhece o', 'ponto de _equilíbrio_', 'do seu negócio?'],
        cta: 'Salve e faça a conta com os seus números',
        ctaStyle: 'save',
      },
    },
  ],
  meta: {
    objetivo: 'Reconhecimento do problema + primeira camada educativa: apresentar o ponto de equilíbrio de forma simples.',
    publico: 'Empresários que não sabem qual o faturamento mínimo para cobrir os custos.',
    gancho: 'Pergunta direta com “vender” em destaque e ícone de alvo sendo desenhado.',
    cta: 'Você conhece o ponto de equilíbrio do seu negócio?',
    legenda:
      'Ponto de equilíbrio é o quanto você precisa vender para cobrir todos os custos do mês, sem lucro e sem prejuízo.\n\nNo exemplo (fictício): despesas fixas de R$ 18.000 e custos variáveis de 40% das vendas.\n18.000 ÷ (1 − 0,40) = R$ 30.000 em vendas.\n\nÉ uma conta introdutória: ela não substitui uma análise completa com a contabilidade, mas já muda a forma de olhar as metas.\n\nSalve e faça a conta com os seus números. 📌',
    hashtags: ['#pontodeequilibrio', '#gestaofinanceira', '#pequenasempresas', '#precificacao', '#financasempresariais'],
    capa: 'Quanto você precisa vender para pagar as contas?',
  },
};
