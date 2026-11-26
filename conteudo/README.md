# Candidus Gestão Financeira · 3 meses de conteúdo em vídeo

Estratégia, calendário e produção de **24 vídeos** (12 semanas, 2 por semana) para Instagram Reels, TikTok e YouTube Shorts.

## O que está pronto

| Entrega | Onde | Status |
|---|---|---|
| 17 vídeos renderizados (12 motion + 5 demonstrações), 1080 × 1920, H.264 + AAC, −14 LUFS | `motion/out/final/` | ✅ prontos para publicar |
| 7 roteiros do fundador com direção, legendas `.srt`, capa e legenda | `conteudo/fundador/` | ✅ prontos para gravar |
| 7 insertos animados para os vídeos do fundador | `motion/out/inserts/` | ✅ prontos para a edição |
| 5 planilhas funcionais das demonstrações (fórmulas, dados fictícios) | `conteudo/planilhas/` | ✅ |
| Fichas de cada vídeo: objetivo, público, gancho, narração, storyboard com tempos, textos, animações, áudio, CTA, legenda, hashtags, arquivo | `conteudo/videos/` | ✅ |
| Calendário de 12 semanas com legendas finais | `conteudo/calendario.md` | ✅ |
| Projeto-fonte (Remotion) com kit de cenas reutilizável | `motion/` | ✅ |

> **Distribuição de formatos.** O briefing pede 14 motion, 6 fundador e 4 demonstrações, mas o calendário detalhado (vídeo a vídeo) define **12 motion, 7 fundador e 5 demonstrações**. Segui o calendário, que é mais específico. Se preferir a proporção 14/6/4, a troca mais simples é transformar o V10 (fundador) e o V15 (demonstração) em motion design; o kit já tem as cenas para isso.

## Estratégia

**Posicionamento:** a Candidus não é "quem paga boletos". É a parceira que organiza a rotina financeira e transforma dados em informação para o empresário decidir.

**Arco de 3 meses**

| Mês | Objetivo | Tom do conteúdo | CTA |
|---|---|---|---|
| 1 · Reconhecimento | O empresário percebe que a desorganização atrapalha controle e decisões | Sintomas concretos, exemplos do dia a dia | Perguntas e autodiagnóstico ("quantos desses sinais…?") |
| 2 · Educação e autoridade | Ensinar conceitos e mostrar como a Candidus pensa | Explicações visuais, planilhas, raciocínio | Salvar, consultar, testar com os próprios números |
| 3 · Confiança e conversão | Explicar o serviço, o que muda e como começar | Transparência: o que o BPO faz e o que não faz | Conhecer a proposta, conversar, entrar em contato |

**Papel de cada formato**

- **Motion design:** para em 2 segundos, explica conceitos e fixa a marca.
- **Fundador:** cria proximidade e confiança. É a pessoa por trás dos números.
- **Demonstrações:** provam a qualidade do raciocínio com planilhas reais (dados fictícios).

**Regras de comunicação** (aplicadas em todos os roteiros):

- Nada de lucro garantido, redução garantida de despesas, resultados específicos ou depoimentos inventados.
- Todo número de exemplo é fictício e aparece com o selo "Dados ilustrativos/fictícios".
- BPO financeiro ≠ contabilidade, auditoria ou consultoria tributária. As decisões e aprovações continuam com o empresário.
- Temas tributários (pró-labore, lucros) remetem à orientação do contador.

## Identidade visual da série

- **Paleta:** verde-escuro `#0E3B2E` / `#061A14`, marfim `#F4F1EA`, dourado `#C9A24A` (gradiente `#F3DC97 → #A98330`); coral `#D4644F` só para alertas e valores negativos.
- **Tipografia:** Plus Jakarta Sans (500–800) com contraste de pesos; palavra-chave em DM Serif Display itálico dourado (ecoa a serifa do logo).
- **Assinatura:** o símbolo da Candidus (barras + seta) e o "Candidus" serifado foram redesenhados em vetor a partir do logo do site e animados. Se houver o arquivo oficial em SVG, ele pode substituir o vetor em `motion/src/components/Logo.tsx`.
- **Sistema:** kicker (rótulo em caixa-alta), título cinético, cards brancos com sombra suave, ícones desenhados a traço, anéis dourados, legendas em pílula verde com a palavra falada em dourado.
- **Transições:** chicote (vertical/lateral) com desfoque, zoom através, dissolução e "inundação" circular verde nas viradas da história.
- **Abertura:** sem vinheta. O gancho já é a abertura (pergunta, número grande ou rótulo "NA PRÁTICA" nas demonstrações).
- **Encerramento:** assinatura animada + CTA em três estilos: pergunta (mês 1), salvar (conteúdo educativo) e botão com clique (mês 3).
- **Áreas seguras:** textos entre 250 px e 1.400 px de altura; legendas em ~1.420 px; nada importante nos 120 px da direita (ícones do Reels/TikTok).

## Publicação

- **Arquivos:** `motion/out/final/candidus-vNN-*.mp4`. Use o "texto da capa" de cada ficha ao escolher a capa no app.
- **Legendas:** as legendas já estão gravadas no vídeo (para quem assiste sem som). Se preferir as legendas automáticas da plataforma, renderize a versão sem legendas (veja `motion/README.md`).
- **Dias e horários:** não há horário que garanta alcance. Comece com dois dias fixos (por exemplo, terça e quinta) e ajuste pelos dados.
- **O que acompanhar:** retenção nos 3 primeiros segundos, % médio assistido, salvamentos e compartilhamentos (conteúdo educativo), comentários (CTAs de pergunta), visitas ao perfil e mensagens (mês 3).
- **Revisões:** ao fim das semanas 4 e 8, compare os formatos e os ganchos que mais retiveram, e ajuste os próximos roteiros.

## Decisões pendentes (do cliente)

1. **Canal de contato nos CTAs do mês 3:** hoje está como "Fale com a Candidus" / "chama no direct". Se o canal for WhatsApp ou site, ajuste os textos em `motion/src/videos/v17.ts`, `v19.ts`, `v23.ts`, `v24.ts` e re-renderize.
2. **Voz:** a narração usa uma voz neural sintética offline (Piper TTS, pt-BR), porque os serviços de voz online não estavam acessíveis no ambiente de produção. Para a campanha, recomendo locução profissional ou um TTS premium (ElevenLabs, Azure). A troca é por arquivo de frase; o tempo das cenas se ajusta sozinho à nova narração.
3. **Gravações do fundador:** os 7 vídeos pessoais dependem da gravação real. Nenhuma pessoa artificial foi gerada.
