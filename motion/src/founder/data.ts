// Vídeos gravados pelo fundador: roteiro, direção e legendas.
// Marcação no roteiro: **ênfase**  ·  [pausa] = respiro curto (~0,6 s)  ·  [corte] = sugestão de corte seco.
// O roteiro é guia, não decoreba: o fundador deve falar com as próprias palavras, mantendo a ordem das ideias.

export type FounderVideo = {
  num: number;
  slug: string;
  week: number;
  month: 1 | 2 | 3;
  title: string;
  objetivo: string;
  publico: string;
  gancho: string;
  roteiro: string[];
  enquadramento: string;
  iluminacao: string;
  cenario: string;
  cortes: string[];
  /** composição Remotion do inserto animado (renderizado em out/inserts) */
  inserto?: string;
  capa: string;
  cta: string;
  legenda: string;
  hashtags: string[];
};

const BASE_ENQ =
  'Celular na vertical, na altura dos olhos, a cerca de 1 m (plano médio: da cintura para cima). Olhar para a lente, não para a tela. Tripé ou apoio firme; nada de câmera na mão.';
const BASE_LUZ =
  'Luz natural de frente ou levemente lateral (janela à frente ou a 45°). Evite janela atrás. À noite: um ring light ou luminária difusa a 45°, na altura do rosto.';
const BASE_CEN =
  'Fundo organizado e neutro: estante com poucos objetos, planta ou parede clara. Um detalhe da marca (caderno, caneca ou quadro verde/dourado) ajuda na identidade. Nada de bagunça ou telas com dados reais de clientes.';

export const FOUNDER: FounderVideo[] = [
  {
    num: 2,
    slug: 'faturamento-nao-e-lucro',
    week: 1,
    month: 1,
    title: 'Faturamento não é lucro',
    objetivo: 'Apresentar o fundador e corrigir uma confusão comum com um exemplo numérico simples.',
    publico: 'Empresários que avaliam o mês pelo faturamento.',
    gancho: 'Sua empresa faturou R$ 30 mil. Isso significa que você lucrou R$ 30 mil? Claro que não.',
    roteiro: [
      "Sua empresa faturou **trinta mil reais** no mês. [pausa] Isso significa que você lucrou trinta mil? [pausa] **Claro que não.**",
      "[corte] Faturamento é o que entrou com as vendas. E desse valor ainda sai muita coisa. Num exemplo fictício:",
      "**nove mil** de custo do que foi vendido,",
      "**doze mil** de despesas, como aluguel, salários e sistemas,",
      "e **dois mil e quatrocentos** de impostos.",
      "[pausa] Sobram **seis mil e seiscentos.** Uns vinte e dois por cento.",
      "[corte] Confundir faturamento com lucro é o jeito mais rápido de gastar o que não tem. Salva este vídeo.",
    ],
    enquadramento: BASE_ENQ,
    iluminacao: BASE_LUZ,
    cenario: `${BASE_CEN} Opcional: um bloco de papel para escrever "30.000" e ir riscando.`,
    cortes: [
      'Corte seco depois do gancho, com leve zoom digital (110%) na retomada.',
      'Durante os números: inserir o clipe INS-V02 (cascata 30.000 → 6.600) em tela cheia ou na metade de cima.',
      'Na frase final: voltar ao fundador em plano mais fechado para o CTA.',
      'Legendas grandes e centralizadas, com destaque nos valores.',
    ],
    inserto: 'INS-V02-faturamento-x-lucro',
    capa: 'Faturou R$ 30 mil. Lucrou quanto?',
    cta: 'Salve este vídeo para não confundir faturamento com lucro.',
    legenda:
      'Faturamento é o que entrou com as vendas. Lucro é o que sobra depois de custos, despesas e impostos.\n\nNo exemplo (fictício): R$ 30.000 de faturamento − R$ 9.000 de custos − R$ 12.000 de despesas − R$ 2.400 de impostos = R$ 6.600. Cerca de 22%.\n\nConta simplificada, só para mostrar a diferença. Salve para não confundir os dois. 📌',
    hashtags: ['#faturamento', '#lucro', '#gestaofinanceira', '#pequenasempresas', '#empreendedorismo'],
  },
  {
    num: 6,
    slug: 'pequenos-gastos',
    week: 3,
    month: 1,
    title: 'Pequenos gastos também precisam ser acompanhados',
    objetivo: 'Criar proximidade e mostrar atenção aos detalhes; gerar uma ação prática imediata.',
    publico: 'Empresários com várias assinaturas, tarifas e pequenos pagamentos recorrentes.',
    gancho: 'O problema nem sempre é uma despesa enorme. Às vezes, são várias pequenas despesas que ninguém acompanha.',
    roteiro: [
      "O problema nem sempre é uma despesa **enorme.** [pausa] Às vezes, são **várias pequenas** que ninguém acompanha.",
      "[corte] Um sistema que ninguém usa mais. Uma tarifa bancária. Um plano de celular esquecido.",
      "Num exemplo fictício, doze despesas assim somavam **mil e oitocentos reais** por mês. [pausa] Mais de **vinte e um mil** por ano.",
      "[corte] Liste tudo o que é cobrado todo mês, cancele o que não usa e negocie o resto.",
      "Comece hoje revisando as despesas recorrentes da sua empresa.",
    ],
    enquadramento: BASE_ENQ,
    iluminacao: BASE_LUZ,
    cenario: `${BASE_CEN} Pode ser gravado sentado à mesa, com o notebook fechado ao lado.`,
    cortes: [
      'Na lista de exemplos, cortes rápidos a cada item, alternando plano médio e fechado.',
      'Inserir o clipe INS-V06 (R$ 21.600 por ano) logo após "mais de vinte e um mil".',
      'Na dica final, texto na tela com os três verbos: listar · revisar · cancelar/negociar.',
    ],
    inserto: 'INS-V06-pequenos-gastos',
    capa: 'Os pequenos gastos que ninguém vê',
    cta: 'Comece revisando as despesas recorrentes da sua empresa.',
    legenda:
      'Não é só a despesa grande que pesa. Assinaturas esquecidas, tarifas, taxas e planos que ninguém usa também somam.\n\nNo exemplo fictício: 12 pequenas despesas recorrentes = R$ 1.800 por mês = mais de R$ 21 mil por ano.\n\nExercício para esta semana: liste tudo o que é cobrado todo mês, revise e cancele o que não faz mais sentido.',
    hashtags: ['#despesas', '#controlefinanceiro', '#gestaofinanceira', '#pequenasempresas', '#economia'],
  },
  {
    num: 10,
    slug: 'pagar-e-receber',
    week: 5,
    month: 2,
    title: 'Por que controlar contas a pagar e receber?',
    objetivo: 'Educar com autoridade: mostrar que o caixa depende dos dois lados e das datas.',
    publico: 'Empresários que controlam só o que precisam pagar.',
    gancho: 'Você sabe o que vai pagar este mês. Mas sabe o que vai receber? E quando?',
    roteiro: [
      "Você sabe o que vai **pagar** este mês. [pausa] Mas sabe o que vai **receber?** [pausa] E **quando?**",
      "[corte] O caixa depende dos dois lados. E das datas.",
      "Exemplo fictício: quarenta mil para pagar e quarenta e cinco mil para receber. Parece tranquilo.",
      "[pausa] Mas quinze mil só entram no **dia trinta**, e as contas vencem antes.",
      "[corte] O mês fecha positivo e, mesmo assim, aperta no meio.",
      "Recebimentos previstos, atrasos e datas: é isso que permite planejar. Você acompanha os dois lados?",
    ],
    enquadramento: BASE_ENQ,
    iluminacao: BASE_LUZ,
    cenario: BASE_CEN,
    cortes: [
      'Gancho com três batidas: um corte (ou zoom digital) em cada pergunta.',
      'No exemplo numérico, inserir o clipe INS-V10 (a pagar × a receber).',
      'Encerrar em plano fechado, fazendo a pergunta direto para a câmera.',
    ],
    inserto: 'INS-V10-pagar-e-receber',
    capa: 'Você sabe o que vai receber? E quando?',
    cta: 'Você acompanha os dois lados do financeiro?',
    legenda:
      'Controlar só as contas a pagar é olhar metade do caixa.\n\nNo exemplo fictício: R$ 40 mil a pagar e R$ 45 mil a receber no mês. Mas R$ 15 mil só entram no dia 30, e boa parte das contas vence antes. O mês fecha positivo e, mesmo assim, aperta no meio.\n\nRecebimentos previstos, atrasos e datas: é isso que permite planejar o caixa. Você acompanha os dois lados? 👇',
    hashtags: ['#contasapagar', '#contasareceber', '#fluxodecaixa', '#gestaofinanceira', '#pequenasempresas'],
  },
  {
    num: 13,
    slug: 'pro-labore-e-lucro',
    week: 7,
    month: 2,
    title: 'Como separar pró-labore e lucro',
    objetivo: 'Autoridade com responsabilidade: explicar a diferença conceitual e indicar a orientação contábil.',
    publico: 'Sócios que retiram dinheiro da empresa sem critério definido.',
    gancho: 'Quanto você tira da empresa por mês? E isso é pró-labore ou lucro?',
    roteiro: [
      "Quanto você tira da empresa por mês? [pausa] E isso é **pró-labore** ou **lucro?**",
      "[corte] **Pró-labore** é a remuneração pelo **trabalho** do sócio: um valor definido, recorrente, com as obrigações que a contabilidade orienta.",
      "**Lucro distribuído** é parte do **resultado** da empresa, e depende de o lucro ser apurado e registrado.",
      "[corte] Retirar \"quando precisa\", sem registro, mistura tudo e esconde o resultado real.",
      "O caminho: defina um pró-labore, registre as retiradas e converse com o seu contador sobre a distribuição de lucros.",
      "Organize suas retiradas com planejamento.",
    ],
    enquadramento: BASE_ENQ,
    iluminacao: BASE_LUZ,
    cenario: BASE_CEN,
    cortes: [
      'Ao definir cada termo, texto na tela: "Pró-labore = trabalho" e "Lucro = resultado".',
      'Inserir o clipe INS-V13 (comparação lado a lado) durante as definições.',
      'Na frase sobre o contador, manter o fundador em tela (é a mensagem de responsabilidade).',
      'Evitar citar alíquotas ou regras tributárias específicas no vídeo.',
    ],
    inserto: 'INS-V13-pro-labore-x-lucro',
    capa: 'Pró-labore ou lucro?',
    cta: 'Organize suas retiradas com planejamento.',
    legenda:
      'Pró-labore e distribuição de lucros não são a mesma coisa.\n\n• Pró-labore: remuneração pelo trabalho do sócio, com valor definido e as obrigações que a contabilidade orienta.\n• Lucro distribuído: parte do resultado apurado da empresa que vai para os sócios.\n\nRetirar "quando precisa", sem registro, mistura tudo e esconde o resultado real. Defina, registre e converse com o seu contador sobre a forma correta para a sua empresa.',
    hashtags: ['#prolabore', '#distribuicaodelucros', '#gestaofinanceira', '#socios', '#pequenasempresas'],
  },
  {
    num: 18,
    slug: 'terceirizar-ou-contratar',
    week: 9,
    month: 3,
    title: 'Terceirizar o financeiro ou contratar um funcionário?',
    objetivo: 'Construir confiança com uma comparação equilibrada, sem forçar a venda.',
    publico: 'Empresários decidindo como estruturar o financeiro.',
    gancho: 'Terceirizar o financeiro ou contratar alguém? A resposta honesta é: depende. E eu te mostro do quê.',
    roteiro: [
      "Terceirizar o financeiro ou contratar alguém? [pausa] A resposta honesta: **depende.**",
      "[corte] Do **volume** de lançamentos, contas e cartões.",
      "Da necessidade de **presença** física na empresa.",
      "Da **complexidade** dos processos.",
      "E do **custo total**: funcionário não é só salário, tem encargos, benefícios, férias e reposição.",
      "[corte] Às vezes, o melhor é combinar: alguém interno no dia a dia e um BPO na rotina financeira e nos relatórios.",
      "A estrutura certa depende da realidade da sua empresa.",
    ],
    enquadramento: BASE_ENQ,
    iluminacao: BASE_LUZ,
    cenario: BASE_CEN,
    cortes: [
      'Contagem visual dos critérios: "1 · Volume", "2 · Presença", "3 · Complexidade", "4 · Custo total".',
      'Inserir o clipe INS-V18 (comparação neutra) depois do custo total.',
      'Tom de conversa: não vender, ajudar a decidir.',
    ],
    inserto: 'INS-V18-interno-x-bpo',
    capa: 'Terceirizar ou contratar? Depende.',
    cta: 'A estrutura certa depende da realidade da sua empresa.',
    legenda:
      'Terceirizar o financeiro ou contratar um funcionário? Depende de:\n\n1. Volume de lançamentos, contas e cartões\n2. Necessidade de presença física\n3. Complexidade dos processos\n4. Custo total (não só o salário: encargos, benefícios, férias, treinamento, reposição)\n\nNão existe resposta única, e às vezes a combinação dos dois é o melhor caminho. Se quiser conversar sobre o seu caso, chama no direct.',
    hashtags: ['#bpofinanceiro', '#terceirizacao', '#gestaofinanceira', '#pequenasempresas', '#candidus'],
  },
  {
    num: 20,
    slug: 'primeira-conversa',
    week: 10,
    month: 3,
    title: 'Como funciona a primeira conversa com a Candidus',
    objetivo: 'Reduzir a barreira do primeiro contato, explicando o que acontece (sem prometer gratuidade).',
    publico: 'Empresários interessados que ainda não chamaram.',
    gancho: 'Você pensa em organizar o financeiro, mas não sabe como seria a primeira conversa? Eu te conto.',
    roteiro: [
      "Como seria a **primeira conversa** com a Candidus? [pausa] Eu te conto.",
      "[corte] Eu quero entender a sua **rotina**: quem cuida do financeiro hoje, e como.",
      "O **volume**: contas, cartões, lançamentos por mês.",
      "Os **sistemas** que você usa. E os **problemas** que mais te preocupam.",
      "[corte] Com isso, a gente conversa sobre o que faz sentido para a sua empresa. Sem fórmula pronta.",
      "Quer conversar sobre a sua operação? Entre em contato.",
    ],
    enquadramento: BASE_ENQ,
    iluminacao: BASE_LUZ,
    cenario: `${BASE_CEN} Ambiente de atendimento (mesa de reunião) reforça a ideia de conversa.`,
    cortes: [
      'Cada tópico ganha um título na tela: Rotina · Volume · Sistemas · Problemas.',
      'Inserir o clipe INS-V20 (lista animada) logo depois dos quatro tópicos.',
      'Não mencionar preço, gratuidade ou "diagnóstico completo".',
    ],
    inserto: 'INS-V20-primeira-conversa',
    capa: 'Como é a primeira conversa?',
    cta: 'Entre em contato para conversarmos sobre sua operação.',
    legenda:
      'Como é a primeira conversa com a Candidus:\n\n• Sua rotina financeira hoje\n• O volume: contas, cartões, lançamentos\n• Os sistemas que você usa\n• Os principais problemas e o que você quer acompanhar\n\nCom isso, entendemos a sua operação e conversamos sobre o que faz sentido para a sua empresa. Para conversar, chama no direct.',
    hashtags: ['#bpofinanceiro', '#gestaofinanceira', '#pequenasempresas', '#candidus', '#organizacaofinanceira'],
  },
  {
    num: 21,
    slug: 'nao-precisa-fazer-tudo-sozinho',
    week: 11,
    month: 3,
    title: 'Você não precisa fazer tudo sozinho',
    objetivo: 'Conexão emocional e confiança: reconhecer a sobrecarga do empresário sem promessas exageradas.',
    publico: 'Donos de pequenas empresas sobrecarregados com a gestão.',
    gancho: 'Vendas, equipe, atendimento, fornecedores… e, quando o dia acaba, ainda tem o financeiro.',
    roteiro: [
      "Vendas, equipe, atendimento, fornecedores… [pausa] e, no fim do dia, ainda tem o **financeiro.**",
      "[corte] Financeiro feito no cansaço sempre atrasa. E as decisões atrasam junto.",
      "[pausa] Não existe mágica: as decisões continuam sendo suas.",
      "Mas a **rotina** pode ser organizada, com processos claros e, se fizer sentido, apoio especializado.",
      "Isso libera tempo para o que só você pode fazer pelo negócio.",
      "Me conta: o que mais consome o seu tempo na gestão?",
    ],
    enquadramento: `${BASE_ENQ} Pode ser gravado em plano um pouco mais fechado (peito para cima), para um tom mais próximo.`,
    iluminacao: `${BASE_LUZ} Luz mais quente combina com o tom do vídeo.`,
    cenario: `${BASE_CEN} Opcional: começar com 3 a 4 cenas curtas de rotina (atendendo, no celular, organizando estoque) sem fala.`,
    cortes: [
      'Abertura com cenas rápidas de rotina (B-roll gravado pelo próprio fundador), na batida da lista do gancho.',
      'Inserir o clipe INS-V21 (rajada de notificações) durante "ainda tem o financeiro".',
      'Final em plano fechado, pergunta direta para a câmera.',
    ],
    inserto: 'INS-V21-sobrecarga',
    capa: 'Você não precisa fazer tudo sozinho',
    cta: 'O que mais consome seu tempo na gestão da empresa?',
    legenda:
      'Vendas, equipe, atendimento, fornecedores… e o financeiro fica para a noite.\n\nAs decisões continuam sendo suas. Mas a rotina pode ser organizada, com processos claros, informação no lugar certo e, se fizer sentido, apoio especializado.\n\nMe conta: o que mais consome o seu tempo na gestão da empresa? 👇',
    hashtags: ['#empreendedorismo', '#gestao', '#pequenasempresas', '#bpofinanceiro', '#rotina'],
  },
];
