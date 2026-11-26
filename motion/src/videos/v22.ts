import type {VideoSpec} from '../series/types';

export const v22: VideoSpec = {
  id: 'v22',
  num: 22,
  slug: 'numeros-em-decisoes',
  title: 'Como transformar números em decisões melhores?',
  format: 'motion',
  week: 11,
  month: 3,
  music: {bpm: 112, root: 50, seed: 22},
  beats: [
    {
      say: 'Um número sozinho não toma decisão nenhuma. Veja como ler um indicador.',
      scene: {type: 'title', bg: 'green', icon: 'search', lines: ['Número sozinho', 'não _decide._'], size: 104},
    },
    {
      say: ['Aqui, o custo de insumos subiu de trinta e um para trinta e oito por cento das vendas, em seis meses.', 'Antes de agir, a pergunta é: por quê?'],
      enter: 'zoom',
      scene: {
        type: 'chart',
        headline: ['O indicador _subiu_'],
        title: 'Insumos sobre vendas',
        unit: '% das vendas',
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
        series: [{name: 'Custo de insumos', values: [31, 32, 31, 34, 36, 38], kind: 'line', tone: 'green'}],
        yMin: 20,
        yMax: 45,
        threshold: {value: 32, label: 'Referência: 32%', cue: 0},
        highlight: {series: 0, index: 5, label: '38% em junho', tone: 'coral', cue: 1},
      },
    },
    {
      say: 'Pode ser reajuste de fornecedor, perdas, mudança no que você vende, ou até um lançamento na categoria errada.',
      enter: 'whipUp',
      scene: {
        type: 'steps',
        headline: ['Possíveis _causas_'],
        items: [
          {icon: 'receipt', title: 'Reajuste de fornecedor'},
          {icon: 'alert', title: 'Perdas ou desperdício'},
          {icon: 'layers', title: 'Mudança no mix de vendas'},
          {icon: 'search', title: 'Lançamento na categoria errada'},
        ],
      },
    },
    {
      say: 'No exemplo, a causa foi o reajuste de um fornecedor. A decisão: renegociar e acompanhar o indicador.',
      enter: 'blur',
      scene: {
        type: 'title',
        bg: 'ivory',
        kicker: 'EXEMPLO ILUSTRATIVO',
        lines: ['Decisão: *renegociar*', 'e _acompanhar._'],
        sub: 'A decisão certa depende do contexto de cada empresa. Os dados precisam estar corretos e contextualizados.',
        size: 92,
      },
    },
    {
      say: ['Não olhe apenas para os números. Entenda o que eles dizem.', 'Qual indicador você acompanha todo mês?'],
      enter: 'flood',
      scene: {type: 'closing', lines: ['Entenda o que', 'os números _dizem._'], cta: 'Qual indicador você acompanha todo mês?', ctaStyle: 'question'},
    },
  ],
  meta: {
    objetivo: 'Autoridade e confiança: mostrar o raciocínio analítico por trás dos números.',
    publico: 'Empresários que já têm números, mas não sabem como transformá-los em ação.',
    gancho: '“Número sozinho não decide.”',
    cta: 'Não olhe apenas para os números. Entenda o que eles dizem.',
    legenda:
      'Um indicador subiu. E agora?\n\nNo exemplo (ilustrativo), o custo de insumos passou de 31% para 38% das vendas em seis meses. Antes de agir, vale investigar: reajuste de fornecedor? Perdas? Mudança no que você vende? Ou um lançamento na categoria errada?\n\nNúmero só vira decisão com dado correto e contexto.\n\nQual indicador você acompanha todo mês? 👇',
    hashtags: ['#indicadoresfinanceiros', '#gestaofinanceira', '#tomadadedecisao', '#pequenasempresas', '#bpofinanceiro'],
    capa: 'Como transformar números em decisões',
  },
};
