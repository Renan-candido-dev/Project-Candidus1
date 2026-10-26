import type {VideoSpec} from '../series/types';

// Entradas 58.400 − saídas 51.900 = resultado 6.500 (fictício).
export const v14: VideoSpec = {
  id: 'v14',
  num: 14,
  slug: 'relatorio-financeiro',
  title: 'O que um relatório financeiro deveria mostrar?',
  format: 'motion',
  week: 7,
  month: 2,
  music: {bpm: 114, root: 55, seed: 14},
  beats: [
    {
      say: 'O que um relatório financeiro deveria mostrar para você decidir melhor?',
      scene: {type: 'title', bg: 'ivory', icon: 'doc', lines: ['O que um *relatório*', 'deveria _mostrar?_'], size: 90},
    },
    {
      say: [
        'Entradas, saídas e o resultado do período.',
        'As despesas por categoria.',
        'As contas em aberto, o que ainda vai entrar e sair.',
        'E uma projeção do caixa para os próximos meses.',
      ],
      enter: 'whipUp',
      gap: 0.4,
      scene: {
        type: 'report',
        title: 'Relatório gerencial',
        period: 'Maio',
        sections: [
          {
            kind: 'kpis',
            cue: 0,
            items: [
              {label: 'Entradas', v: 58400, money: true},
              {label: 'Saídas', v: 51900, money: true},
              {label: 'Resultado', v: 6500, money: true, delta: 'positivo', good: true},
            ],
          },
          {
            kind: 'cats',
            title: 'Principais saídas',
            cue: 1,
            items: [
              {label: 'Pessoal', v: 19800},
              {label: 'Fornecedores', v: 16300},
              {label: 'Despesas fixas', v: 8200},
              {label: 'Tributos', v: 5100},
            ],
          },
          {
            kind: 'open',
            title: 'Contas em aberto',
            cue: 2,
            items: [
              {label: 'Cliente B', date: 'Dia 05', v: 7200},
              {label: 'Fornecedor Alfa', date: 'Dia 10', v: -5600},
              {label: 'Guia DAS', date: 'Dia 20', v: -2900},
            ],
          },
          {kind: 'projection', title: 'Caixa projetado (R$ mil)', cue: 3, labels: ['Hoje', 'Jun', 'Jul', 'Ago'], values: [18.2, 21.5, 16.8, 24]},
        ],
      },
    },
    {
      say: 'Mas atenção: cada indicador só é tão bom quanto os dados que o alimentam.',
      enter: 'blur',
      scene: {
        type: 'title',
        bg: 'green',
        icon: 'search',
        lines: ['Dado errado,', 'relatório _errado._'],
        sub: 'Lançamentos conferidos e conciliados vêm antes de qualquer gráfico.',
        size: 96,
      },
      minDur: 3.6,
    },
    {
      say: ['Relatório serve para tomar decisões, não para preencher telas.', 'Qual desses números você acompanha hoje?'],
      enter: 'flood',
      scene: {type: 'closing', lines: ['Relatório serve', 'para _decidir._'], cta: 'Qual desses números você acompanha hoje?', ctaStyle: 'question'},
    },
  ],
  meta: {
    objetivo: 'Educação e autoridade: mostrar o que compõe um relatório gerencial útil.',
    publico: 'Empresários que recebem relatórios (ou planilhas) que não ajudam a decidir.',
    gancho: 'Pergunta direta com o ícone de documento sendo desenhado.',
    cta: 'Relatórios devem ajudar a tomar decisões, não apenas preencher telas.',
    legenda:
      'Um relatório financeiro útil responde a perguntas, não apenas mostra gráficos:\n\n• Quanto entrou, quanto saiu e qual foi o resultado?\n• Onde está o dinheiro que sai (por categoria)?\n• O que ainda vai entrar e sair (contas em aberto)?\n• Como deve ficar o caixa nos próximos meses?\n\nE nada disso funciona sem dados conferidos. Qual desses números você acompanha hoje? 👇',
    hashtags: ['#relatoriogerencial', '#gestaofinanceira', '#indicadores', '#pequenasempresas', '#tomadadedecisao'],
    capa: 'O que um relatório financeiro deveria mostrar',
  },
};
