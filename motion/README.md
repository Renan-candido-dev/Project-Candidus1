# Candidus Gestão Financeira: vídeos em motion design

Projeto Remotion (React) para criar os Reels da Candidus. Formato: vertical 1080 × 1920, 30 fps.

**Vídeo 01: "Para onde vai o dinheiro?"** (32,5 s)
Arquivo final: `out/candidus-reel-01.mp4`

---

## 1. Análise das referências

| Característica | O que aparece nas referências | Como foi aplicado na Candidus |
|---|---|---|
| Paleta | Fundo off-white e uma única cor de marca forte (vermelho ou amarelo), que às vezes toma a tela inteira | Fundo marfim, verde-escuro dominante e dourado só nos destaques. Telas inteiras em verde ("inundação") nas viradas da história |
| Tipografia | Sans geométrica bold; contraste entre peso leve e pesado na mesma frase; palavras entram uma a uma | Plus Jakarta Sans (500 a 800) com contraste de pesos. Palavras-chave em serifada itálica dourada (DM Serif Display), no estilo do logo |
| Ritmo | Corte a cada 1–2 s, sempre sincronizado à fala | 12 planos em 32 s; cada entrada de texto está amarrada ao frame da narração |
| Transições | Desfoque de movimento, chicotes, zoom através, círculo que se expande a partir de um ponto | Chicote vertical e horizontal com blur, zoom através, círculo expandindo (verde → marfim → verde), luz que se apaga e acende |
| Motivos gráficos | Ponto → círculos concêntricos finos; pílulas de UI; cursor clicando; ícones | Ponto e anéis dourados, pílulas de categoria, cursor clicando em "Conciliar" e no CTA, ícones vetoriais |
| Produto em cena | Cartão 3D e celular com o app | Interfaces financeiras reais e animadas: notificações, painel, fluxo de caixa, contas a pagar/receber, indicadores |
| Som | Trilha pulsante, whooshes e cliques | Trilha original, mais 13 efeitos sonoros sincronizados (whoosh, clique, pop, ping, impacto, chime) |

## 2. Roteiro de animação

| Tempo | Cena | O que acontece |
|---|---|---|
| 0–5,5 s | **Gancho** | Silhueta de empresário diante do notebook. Dez notificações (vendas, Pix, boletos, aluguel, impostos) chegam cada vez mais rápido e a câmera treme. Um círculo verde engole a tela; o saldo de R$ 48.720 despenca e o número se desfaz em moedas. Texto: *"Sua empresa vende. Mas o dinheiro **desaparece?**"* ("desaparece?" se dissolve letra a letra) |
| 5,5–11 s | **Problema** | Faixas de entradas e saídas cruzam a tela, o saldo do mês fica negativo e o gráfico cai. Surgem alertas: "Vencida", "Juros", "Vence hoje". Então as luzes se apagam e uma "lanterna" revela: *"Sem controle financeiro, você trabalha **no escuro.**"* A lanterna termina como um ponto de luz |
| 11–16 s | **Solução** | O ponto vira luz e o marfim toma a tela. Os lançamentos chegam espalhados e se encaixam num painel, ganham categorias, e o cursor clica em "Conciliar": tudo fica ✓ "Tudo em dia". Texto: *"A **Candidus** organiza seu financeiro."* |
| 16–23,5 s | **Benefícios** | Três planos: fluxo de caixa (*Mais controle.*), contas a receber e a pagar com anéis de progresso (*Mais clareza.*), meta e indicadores (*Decisões melhores.*). No fim, um resumo com os três checks dourados |
| 23,5–32,5 s | **Encerramento** | *"Você cuida do negócio. Nós cuidamos **dos números.**"* sobre dígitos rolando. Depois o logo se monta (barras crescem, a seta é desenhada, "Candidus" sobe letra a letra) e entra o CTA *"Vamos organizar seu financeiro?"*, com clique |

Todos os números são fictícios, e as telas de dados levam o selo **"\* Dados ilustrativos"**.

## 3. Estrutura

```
motion/
├── src/
│   ├── Video.tsx          # monta cenas, narração, trilha (com ducking) e legendas
│   ├── timeline.ts        # ← sincronia: início das cenas, das falas e das legendas
│   ├── theme.ts           # cores, fontes
│   ├── anim.ts            # easings, molas, utilitários (formatação R$)
│   ├── components/        # Words (tipografia cinética), Cursor, Logo, Captions, UI, Backgrounds
│   └── scenes/            # S1Hook, S2Problem, S3Solution, S4Benefits, S5Closing
├── public/
│   ├── voice/             # narração, uma frase por arquivo (+ lines.json)
│   ├── sfx/               # efeitos sonoros
│   ├── music.wav          # trilha
│   └── fonts/             # fontes embarcadas (OFL)
└── scripts/
    ├── gen_voice.py       # gera a narração (Piper TTS, pt-BR, offline)
    ├── gen_audio.py       # sintetiza trilha e efeitos (numpy/scipy)
    └── finalize.sh        # normaliza o áudio em -14 LUFS e otimiza o MP4
```

## 4. Como renderizar

Requisitos: Node 18+ e ffmpeg.

```bash
cd motion
npm install
npm run studio               # pré-visualização interativa no navegador
npm run render               # → out/candidus-reel-01.mp4
npm run render:sem-legendas  # versão sem legendas
```

Se o Remotion não conseguir baixar o Chrome, aponte para um Chromium local:
`REMOTION_BROWSER=/caminho/do/chrome npm run render`

## 5. Narração: como trocar a voz

A voz atual é sintética e roda offline: Piper TTS, modelo `pt_BR-faber-medium`. Para uma versão de campanha, recomendo um locutor profissional ou um TTS premium (ElevenLabs, Azure etc.). Para trocar:

1. Grave cada frase em um arquivo separado, `public/voice/line1.wav` … `line7.wav`, na ordem de `lines.json`.
2. Ajuste em `src/timeline.ts` o `at` (frame de início) e o `frames` (duração falada) de cada frase, além das legendas em `CAPTIONS`. Os textos das cenas usam frames locais próximos desses valores.
3. Rode `npm run render`.

Para regerar a voz sintética:
`python3 scripts/gen_voice.py <pasta-do-modelo-piper>` (modelos em
https://github.com/k2-fsa/sherpa-onnx/releases/tag/tts-models).
Na narração, "Candidus" é escrito "Cândidus" só para guiar a pronúncia; na tela aparece sem acento.

## 6. Créditos e licenças

- Fontes: Plus Jakarta Sans e DM Serif Display (Google Fonts, SIL Open Font License).
- Trilha e efeitos: sintetizados neste projeto (`scripts/gen_audio.py`), sem samples de terceiros.
- Voz: Piper TTS, modelo pt_BR-faber-medium. Confira a licença no `MODEL_CARD` do modelo antes de uso comercial.
