/* =====================================================================
   Calendário de 30 vídeos — dores da empresa × gestão financeira (BPO)
   Edite à vontade: cada vídeo é uma lista de blocos (ver engine.js).
   trilha: 'energia' | 'corporativa' | 'lofi'   (ver gerar_musicas.py)
   ===================================================================== */
const CTA = (pergunta = 'Quer organizar o financeiro da sua empresa?') => [{ t: 'cta', pergunta }, { t: 'logo' }];
const TAGS = '#gestaofinanceira #bpofinanceiro #empreendedorismo #pequenasempresas #fluxodecaixa #financasempresariais #candidus';

const VIDEOS = [
  { dia: 1, slug: 'quanto-lucra', trilha: 'energia', titulo: 'Você sabe quanto lucra?',
    legenda: 'Faturar não é lucrar. Você sabe quanto sobra de verdade no fim do mês?',
    blocos: [
      { t: 'gancho', linhas: ['Você sabe quanto', 'a sua empresa', { hl: 'realmente lucra?' }] },
      { t: 'etiquetas', titulo: 'Se a resposta for “mais ou menos”…', itens: ['Vende bem', 'Trabalha muito', 'Mas não sobra nada'] },
      { t: 'palavra', palavra: 'LUCRO', icone: 'moeda', icone_em: 4, sub: 'não é o mesmo que faturamento' },
      { t: 'destaque', antes: 'Números com', hl: 'clareza', depois: 'mudam decisões', sub: 'Relatórios que mostram o lucro real' },
      ...CTA('Quer descobrir quanto sua empresa lucra?')] },

  { dia: 2, slug: 'pf-pj', trilha: 'energia', titulo: 'Conta pessoal × conta da empresa',
    legenda: 'Misturar a conta pessoal com a da empresa é o jeito mais rápido de perder o controle.',
    blocos: [
      { t: 'gancho', linhas: ['Você paga o mercado', 'com o cartão', { hl: 'da empresa?' }] },
      { t: 'etiquetas', titulo: 'Misturar PF e PJ causa:', itens: ['Lucro que ninguém vê', 'Caixa sempre no limite', 'Impostos confusos'], lixeira: true, legenda: 'Separar as contas é o primeiro passo.' },
      { t: 'antesDepois', antes: ['Tudo na mesma conta', 'Gastos sem registro'], depois: ['Conta PJ separada', 'Pró-labore definido'] },
      ...CTA()] },

  { dia: 3, slug: 'fluxo-caixa', trilha: 'corporativa', titulo: 'Fluxo de caixa no escuro',
    legenda: 'Você sabe quanto vai ter em caixa daqui a 30 dias? O fluxo de caixa projetado responde isso.',
    blocos: [
      { t: 'gancho', linhas: ['Quanto você terá', { hl: 'em caixa' }, 'no mês que vem?'] },
      { t: 'onda', icone: 'calendario', titulo: 'Fluxo de caixa', sub: 'projetado', rodape: 'Veja o futuro do seu caixa antes dele chegar' },
      { t: 'orbita', titulo: 'O que entra no fluxo', centro: 'grafico', itens: [['moeda', 'Recebimentos'], ['recibo', 'Contas a pagar'], ['calendario', 'Vencimentos'], ['cofre', 'Saldo previsto']] },
      { t: 'frase', linhas: [[['Menos', 'leve'], ['surpresa', 'forte']], [['Mais', 'leve'], ['previsão', 'forte']]] },
      ...CTA()] },

  { dia: 4, slug: 'juros-multas', trilha: 'energia', titulo: 'Juros e multas por atraso',
    legenda: 'Conta paga atrasada é dinheiro jogado fora. Organização evita isso.',
    blocos: [
      { t: 'gancho', linhas: ['Pagou boleto', 'atrasado', { hl: 'de novo?' }] },
      { t: 'etiquetas', itens: ['Juros', 'Multa', 'Nome sujo', 'Fornecedor irritado'], lixeira: true, legenda: 'Contas a pagar organizadas acabam com isso.' },
      { t: 'onda', icone: 'calendario', titulo: 'Em dia', sub: 'sem esquecer vencimentos' },
      ...CTA()] },

  { dia: 5, slug: 'inadimplencia', trilha: 'corporativa', titulo: 'Cliente que não paga',
    legenda: 'Vender e não receber não é venda. Contas a receber em ordem protegem seu caixa.',
    blocos: [
      { t: 'gancho', linhas: ['Vendeu, entregou…', { hl: 'e não recebeu?' }] },
      { t: 'lista', titulo: 'Contas a receber em ordem', itens: ['Saber quem deve e quanto', 'Acompanhar cada vencimento', 'Cobrar no momento certo'] },
      { t: 'destaque', antes: 'Venda só vale', hl: 'recebida', depois: 'no caixa' },
      ...CTA()] },

  { dia: 6, slug: 'vende-nao-sobra', trilha: 'energia', titulo: 'Vende muito e não sobra',
    legenda: 'Faturamento alto com caixa vazio tem explicação — e ela está nos números.',
    blocos: [
      { t: 'gancho', linhas: ['Sua empresa vende bem…', { hl: 'mas não sobra?' }] },
      { t: 'orbita', titulo: 'Para onde o dinheiro vai', centro: 'lupa', itens: [['recibo', 'Custos'], ['queda', 'Despesas'], ['balanca', 'Impostos'], ['carteira', 'Retiradas']] },
      { t: 'palavra', palavra: 'MARGEM', icone: 'grafico', icone_em: 1, sub: 'é ela que mostra se a venda dá lucro' },
      ...CTA('Quer saber para onde vai o seu dinheiro?')] },

  { dia: 7, slug: 'custos-escondidos', trilha: 'lofi', titulo: 'Custos escondidos',
    legenda: 'Assinaturas esquecidas, tarifas e pequenos gastos somam muito no fim do ano.',
    blocos: [
      { t: 'gancho', linhas: ['Os gastos pequenos', { hl: 'somam muito' }] },
      { t: 'etiquetas', titulo: 'Onde eles se escondem:', itens: ['Tarifas bancárias', 'Assinaturas esquecidas', 'Compras sem controle'], lixeira: true, legenda: 'Análise de custos encontra e corta.' },
      { t: 'palavra', palavra: 'CORTE', icone: 'tesoura', icone_em: 1, sub: 'o que não traz resultado' },
      ...CTA('Quer reduzir custos sem perder resultado?')] },

  { dia: 8, slug: 'planilhas', trilha: 'lofi', titulo: 'Planilhas que ninguém entende',
    legenda: 'Planilha desatualizada é decisão errada esperando acontecer.',
    blocos: [
      { t: 'gancho', linhas: ['Sua gestão é uma', { hl: 'planilha' }, 'que só você entende?'] },
      { t: 'etiquetas', itens: ['Desatualizada', 'Fórmula quebrada', 'Horas perdidas'], lixeira: true, legenda: 'Relatórios claros, prontos todo mês.' },
      { t: 'frase', linhas: [[['Menos', 'leve'], ['planilha', 'forte']], [['Mais', 'leve'], ['decisão', 'forte']]] },
      ...CTA()] },

  { dia: 9, slug: 'achismo', trilha: 'energia', titulo: 'Decidir no achismo',
    legenda: 'Contratar, investir, cortar: cada decisão fica mais segura com números confiáveis.',
    blocos: [
      { t: 'gancho', linhas: ['Você decide com', 'números ou', { hl: 'no achismo?' }] },
      { t: 'orbita', titulo: 'Decisões que pedem números', centro: 'cerebro', itens: [['pessoas', 'Contratar'], ['setaCima', 'Investir'], ['tesoura', 'Cortar'], ['moeda', 'Precificar']] },
      { t: 'destaque', antes: 'Decidir com', hl: 'dados', depois: 'reduz riscos' },
      ...CTA()] },

  { dia: 10, slug: 'conciliacao', trilha: 'lofi', titulo: 'O que é conciliação bancária',
    legenda: 'Conciliação bancária: conferir se o que está no banco bate com o que foi registrado.',
    blocos: [
      { t: 'gancho', linhas: ['Você sabe o que é', { hl: 'conciliação' }, 'bancária?'] },
      { t: 'onda', icone: 'banco', titulo: 'Banco = registros', sub: 'tudo batendo', rodape: 'Conferimos cada entrada e cada saída' },
      { t: 'lista', titulo: 'Por que importa', itens: ['Encontra cobranças indevidas', 'Evita lançamentos esquecidos', 'Deixa o saldo confiável'] },
      ...CTA()] },

  { dia: 11, slug: 'o-que-e-bpo', trilha: 'corporativa', titulo: 'O que é BPO financeiro',
    legenda: 'BPO financeiro é a terceirização da rotina financeira da sua empresa.',
    blocos: [
      { t: 'palavra', palavra: 'BPO', icone: 'grafico', icone_em: 2, sub: 'financeiro' },
      { t: 'gancho', linhas: ['É a terceirização', 'da rotina', { hl: 'financeira' }, 'da sua empresa'] },
      { t: 'orbita', titulo: 'Nós cuidamos de', centro: 'escudo', itens: [['recibo', 'Contas a pagar'], ['moeda', 'Contas a receber'], ['banco', 'Conciliação'], ['grafico', 'Relatórios']] },
      { t: 'frase', linhas: [[['Você', 'leve'], ['vende.', 'forte']], [['Nós', 'leve'], ['organizamos.', 'forte']]] },
      ...CTA('Quer entender como o BPO funciona na sua empresa?')] },

  { dia: 12, slug: 'pro-labore', trilha: 'lofi', titulo: 'Pró-labore sem critério',
    legenda: 'Tirar dinheiro do caixa sempre que precisa desorganiza tudo. Defina um pró-labore.',
    blocos: [
      { t: 'gancho', linhas: ['Você tira dinheiro', 'do caixa', { hl: 'quando precisa?' }] },
      { t: 'palavra', palavra: 'PRÓ-LABORE', sub: 'um valor definido para o dono' },
      { t: 'antesDepois', antes: ['Retiradas aleatórias', 'Caixa sempre baixo'], depois: ['Valor fixo e planejado', 'Empresa saudável'] },
      ...CTA()] },

  { dia: 13, slug: 'capital-giro', trilha: 'energia', titulo: 'Capital de giro apertado',
    legenda: 'Falta de capital de giro trava a empresa. Planejamento de caixa ajuda a evitar.',
    blocos: [
      { t: 'gancho', linhas: ['Sempre falta dinheiro', { hl: 'para girar?' }] },
      { t: 'etiquetas', itens: ['Paga antes de receber', 'Estoque parado', 'Prazo curto com fornecedor'] },
      { t: 'onda', icone: 'cofre', titulo: 'Capital de giro', sub: 'planejado', rodape: 'Fluxo de caixa mostra o aperto antes dele chegar' },
      ...CTA()] },

  { dia: 14, slug: 'fim-do-mes', trilha: 'corporativa', titulo: 'Fim do mês sem resultado',
    legenda: 'Todo mês, um relatório claro: quanto entrou, quanto saiu e quanto sobrou.',
    blocos: [
      { t: 'gancho', linhas: ['Fechou o mês', 'e não sabe', { hl: 'o resultado?' }] },
      { t: 'orbita', titulo: 'Relatório mensal', centro: 'documento', itens: [['setaCima', 'Receitas'], ['queda', 'Despesas'], ['moeda', 'Resultado'], ['alvo', 'Indicadores']] },
      { t: 'destaque', antes: 'Todo mês com', hl: 'clareza', depois: 'nos números' },
      ...CTA()] },

  { dia: 15, slug: 'crescer-sem-controle', trilha: 'energia', titulo: 'Crescer sem controle',
    legenda: 'Crescer sem controle financeiro pode ser mais perigoso do que não crescer.',
    blocos: [
      { t: 'gancho', linhas: ['Crescer sem', { hl: 'controle' }, 'é perigoso'] },
      { t: 'etiquetas', itens: ['Mais vendas', 'Mais custos', 'Mais impostos', 'Caixa no vermelho'] },
      { t: 'palavra', palavra: 'CONTROLE', icone: 'alvo', icone_em: 1, sub: 'para crescer com segurança' },
      ...CTA()] },

  { dia: 16, slug: 'emprestimo', trilha: 'lofi', titulo: 'Empréstimo para tapar buraco',
    legenda: 'Empréstimo para cobrir buraco de caixa vira bola de neve. Organização vem antes.',
    blocos: [
      { t: 'gancho', linhas: ['Empréstimo para', { hl: 'cobrir buraco?' }] },
      { t: 'etiquetas', titulo: 'A bola de neve:', itens: ['Falta caixa', 'Pega empréstimo', 'Paga juros', 'Falta caixa de novo'] },
      { t: 'destaque', antes: 'Primeiro', hl: 'organize', depois: 'depois decida' },
      ...CTA()] },

  { dia: 17, slug: 'sazonalidade', trilha: 'corporativa', titulo: 'Meses fracos',
    legenda: 'Todo negócio tem meses mais fracos. Com fluxo projetado, eles não pegam você de surpresa.',
    blocos: [
      { t: 'gancho', linhas: ['O mês fraco', { hl: 'sempre chega' }] },
      { t: 'onda', icone: 'calendario', titulo: 'Previsão', sub: 'mês a mês', rodape: 'Planeje os meses fortes para cobrir os fracos' },
      { t: 'frase', linhas: [[['Prepare', 'leve']], [['o caixa', 'forte'], ['antes', 'leve']]] },
      ...CTA()] },

  { dia: 18, slug: 'indicadores', trilha: 'lofi', titulo: 'Indicadores financeiros',
    legenda: 'Três números que todo dono de empresa deveria acompanhar.',
    blocos: [
      { t: 'gancho', linhas: ['3 números que', 'todo empresário', { hl: 'deve olhar' }] },
      { t: 'lista', titulo: 'Acompanhe sempre', itens: ['Margem de lucro', 'Saldo de caixa previsto', 'Despesas sobre o faturamento'] },
      { t: 'orbita', titulo: 'Indicadores', centro: 'grafico', itens: [['moeda', 'Lucratividade'], ['cofre', 'Liquidez'], ['queda', 'Custos'], ['alvo', 'Metas']] },
      ...CTA()] },

  { dia: 19, slug: 'faturamento-lucro', trilha: 'energia', titulo: 'Faturamento não é lucro',
    legenda: 'O que importa não é quanto entra, é quanto fica.',
    blocos: [
      { t: 'frase', fundo: 'escuro', linhas: [[['Faturamento', 'forte']], [['não é', 'leve']], [['lucro', 'forte']]] },
      { t: 'destaque', antes: 'O que importa é o que', hl: 'fica', depois: 'na empresa' },
      { t: 'palavra', palavra: 'LUCRO', icone: 'moeda', icone_em: 4, sub: 'é o que sobra depois de tudo' },
      ...CTA('Quer saber quanto realmente fica?')] },

  { dia: 20, slug: 'reserva', trilha: 'corporativa', titulo: 'Reserva da empresa',
    legenda: 'Uma reserva financeira protege a empresa dos imprevistos.',
    blocos: [
      { t: 'gancho', linhas: ['Sua empresa tem', { hl: 'reserva?' }] },
      { t: 'onda', icone: 'escudo', titulo: 'Reserva', sub: 'para imprevistos', rodape: 'Separar um pouco todo mês faz diferença' },
      { t: 'frase', linhas: [[['Imprevisto', 'leve']], [['sem', 'leve'], ['desespero', 'forte']]] },
      ...CTA()] },

  { dia: 21, slug: 'fornecedores', trilha: 'lofi', titulo: 'Fornecedores em dia',
    legenda: 'Pagar fornecedores em dia abre espaço para negociar melhores condições.',
    blocos: [
      { t: 'gancho', linhas: ['Pagar em dia', 'também é', { hl: 'poder de negociação' }] },
      { t: 'lista', titulo: 'Com contas a pagar organizadas', itens: ['Nenhum vencimento esquecido', 'Mais crédito com fornecedores', 'Força para negociar prazos'] },
      ...CTA()] },

  { dia: 22, slug: 'dono-sobrecarregado', trilha: 'energia', titulo: 'Dono que faz tudo',
    legenda: 'Você abriu a empresa para fazer o que ama, não para passar a noite conferindo boletos.',
    blocos: [
      { t: 'gancho', linhas: ['Você vende, atende,', 'entrega…', { hl: 'e ainda paga boleto?' }] },
      { t: 'etiquetas', itens: ['Vendas', 'Atendimento', 'Equipe', 'Financeiro'], lixeira: true, legenda: 'Deixe o financeiro com a gente.' },
      { t: 'frase', linhas: [[['Seu tempo', 'forte']], [['no que', 'leve'], ['importa', 'forte']]] },
      ...CTA()] },

  { dia: 23, slug: 'todo-porte', trilha: 'corporativa', titulo: 'Para todo tamanho de empresa',
    legenda: 'MEI, Simples Nacional, Lucro Presumido ou Lucro Real: todo negócio precisa de gestão financeira.',
    blocos: [
      { t: 'gancho', linhas: ['Gestão financeira', 'é só para', { hl: 'empresa grande?' }] },
      { t: 'etiquetas', titulo: 'É para todas:', itens: ['MEI', 'Simples Nacional', 'Lucro Presumido', 'Lucro Real'] },
      { t: 'destaque', antes: 'Todo negócio precisa de', hl: 'controle', depois: '' },
      ...CTA()] },

  { dia: 24, slug: 'cortar-custos', trilha: 'lofi', titulo: 'Cortar custos com inteligência',
    legenda: 'Cortar custo não é cortar tudo. É cortar o que não traz resultado.',
    blocos: [
      { t: 'gancho', linhas: ['Cortar custos', { hl: 'sem cortar' }, 'resultado'] },
      { t: 'lista', titulo: 'Como fazemos', itens: ['Mapeamos todas as despesas', 'Separamos o essencial do excesso', 'Acompanhamos o resultado'] },
      { t: 'palavra', palavra: 'ECONOMIA', icone: 'cofre', icone_em: 2, sub: 'com estratégia' },
      ...CTA('Quer reduzir custos com estratégia?')] },

  { dia: 25, slug: 'reuniao-mensal', trilha: 'corporativa', titulo: 'Reunião de resultados',
    legenda: 'Todo mês, sentar e olhar os números junto com quem entende.',
    blocos: [
      { t: 'gancho', linhas: ['Uma reunião por mês', 'pode mudar', { hl: 'sua empresa' }] },
      { t: 'orbita', titulo: 'Na reunião de resultados', centro: 'pessoas', itens: [['documento', 'Relatórios'], ['alvo', 'Metas'], ['lupa', 'Melhorias'], ['setaCima', 'Próximos passos']] },
      { t: 'frase', linhas: [[['Números', 'forte']], [['viram', 'leve'], ['decisões', 'forte']]] },
      ...CTA()] },

  { dia: 26, slug: 'contador-financeiro', trilha: 'lofi', titulo: 'Contador × gestão financeira',
    legenda: 'Contabilidade cuida das obrigações fiscais. A gestão financeira cuida do dia a dia do dinheiro. Uma completa a outra.',
    blocos: [
      { t: 'gancho', linhas: ['“Meu contador', { hl: 'já faz isso”' }] },
      { t: 'lista', titulo: 'Cada um no seu papel', itens: ['Contabilidade: impostos e obrigações', 'Gestão financeira: caixa, contas e decisões'] },
      { t: 'frase', linhas: [[['Uma', 'leve'], ['completa', 'forte']], [['a outra', 'leve']]] },
      ...CTA()] },

  { dia: 27, slug: 'sinais', trilha: 'energia', titulo: 'Sinais de que você precisa de BPO',
    legenda: 'Se você se identificou com dois desses sinais, está na hora de organizar o financeiro.',
    blocos: [
      { t: 'gancho', linhas: ['4 sinais de que', 'você precisa de', { hl: 'BPO financeiro' }] },
      { t: 'lista', titulo: 'Você se identifica?', itens: ['Não sabe o lucro do mês', 'Paga contas atrasadas', 'Mistura contas PF e PJ', 'Não sabe o caixa futuro'] },
      ...CTA()] },

  { dia: 28, slug: 'antes-depois', trilha: 'corporativa', titulo: 'Antes e depois da organização',
    legenda: 'O que muda quando o financeiro da empresa entra nos eixos.',
    blocos: [
      { t: 'gancho', linhas: ['O que muda quando', 'o financeiro', { hl: 'se organiza' }] },
      { t: 'antesDepois', antes: ['Contas esquecidas', 'Lucro desconhecido', 'Decisão no achismo'], depois: ['Tudo em dia', 'Resultado mensal', 'Decisão com números'] },
      ...CTA()] },

  { dia: 29, slug: 'planos', trilha: 'corporativa', titulo: 'Conheça os planos',
    legenda: 'Candidus Essencial, Gestão e Estratégico. Qual faz sentido para a sua empresa?',
    blocos: [
      { t: 'gancho', linhas: ['Gestão financeira', 'que cabe no', { hl: 'seu momento' }] },
      { t: 'planos' },
      ...CTA('Qual plano faz sentido para sua empresa?')] },

  { dia: 30, slug: 'manifesto', trilha: 'corporativa', titulo: 'Candidus: quem somos',
    legenda: 'Candidus Gestão Financeira: organização, estratégia e resultado para o seu negócio.',
    blocos: [
      { t: 'frase', fundo: 'escuro', linhas: [[['Toda empresa', 'leve']], [['merece', 'leve'], ['clareza', 'forte']]] },
      { t: 'orbita', titulo: 'Entregamos', centro: 'escudo', itens: [['recibo', 'Organização'], ['alvo', 'Estratégia'], ['grafico', 'Resultado'], ['olho', 'Clareza']] },
      { t: 'foto', texto: 'Organização, estratégia e resultado.' },
      ...CTA('Vamos organizar o financeiro da sua empresa?')] }
];
VIDEOS.forEach(v => { v.hashtags = TAGS; });
