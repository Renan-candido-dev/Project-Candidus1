# Candidus · motion design (Remotion)

Projeto-fonte dos vídeos da Candidus Gestão Financeira: vertical 1080 × 1920, 30 fps, H.264 + AAC.
A estratégia, o calendário e as fichas de cada vídeo ficam em [`../conteudo`](../conteudo/README.md).

## Como o projeto funciona

Cada vídeo da série é uma **spec** (`src/videos/vNN.ts`): uma lista de *beats*, cada um com a fala e a cena.

```ts
{
  say: ['Primeiro: contas que vencem sem ninguém perceber.', 'A multa só aparece depois.'],
  enter: 'whipUp',                      // transição de entrada
  scene: {type: 'ledger', headline: ['*1.* Contas _esquecidas_'], rows: [...], flags: [...]},
}
```

- **Tempo automático:** a narração é gravada frase a frase. A duração de cada cena e o momento de cada animação (`cue`) saem da duração real da fala. Trocou o texto ou a voz? Os tempos se ajustam sozinhos.
- **Marcação de texto:** `*negrito*` vira destaque em peso 800; `_palavra_` vira serifada itálica dourada.
- **Kit de cenas** (`src/kit`): `title`, `notif`, `stream`, `ledger`, `chart`, `waterfall`, `steps` (lista ou ciclo), `balance`, `calendar`, `report`, `split`, `reconcile`, `sheet` (planilha ao vivo), `breakeven`, `closing`.
- **Transições:** `whipUp`, `whipLeft`, `zoom`, `blur`, `flood`, `cut`, com efeito sonoro automático.
- **Legendas** quebradas em blocos curtos, com a palavra falada destacada; trilha com *ducking* sob a voz.
- **Trilha original por vídeo** (`scripts/gen_series_music.py`), composta a partir da timeline: climas de tensão, neutro, claro e final, com impactos nas viradas e acorde final na assinatura. Andamento e tom variam por vídeo.

```
motion/
├── src/
│   ├── Root.tsx               # registra todas as composições
│   ├── series/                # tipos, cálculo de timeline e renderizador da série
│   ├── kit/                   # cenas reutilizáveis + ícones
│   ├── components/            # tipografia cinética, cursor, logo, legendas, fundos
│   ├── videos/                # specs vNN.ts, insertos e o V01 (feito à mão)
│   ├── founder/data.ts        # roteiros e direção dos vídeos do fundador
│   └── theme.ts, anim.ts      # identidade e utilitários de animação
├── public/                    # fontes, efeitos, e por vídeo: voz, trilha, layout
└── scripts/
    ├── build-video.sh         # voz → timeline → trilha (e opcionalmente render)
    ├── render-chunks.sh       # render robusto em blocos + finalização (yuv420p, −14 LUFS)
    ├── render-queue.sh        # vários vídeos em sequência
    ├── review.sh / contact.sh # folhas de revisão com quadros do vídeo
    ├── conteudo.ts            # gera fichas, roteiros, .srt e calendário em ../conteudo
    ├── gen_series_voice.py    # narração (Piper TTS)
    ├── gen_series_music.py    # trilha por vídeo
    └── gen_audio.py           # instrumentos e efeitos sonoros
```

## Comandos

Requisitos: Node 18+, ffmpeg, Python 3 com `numpy scipy piper-tts`.

```bash
npm install
npm run studio                                   # pré-visualização interativa

export PIPER_MODEL=/caminho/vits-piper-pt_BR-faber-medium
bash scripts/build-video.sh v03                  # gera voz, timeline e trilha
bash scripts/build-video.sh v03 --render         # ... e renderiza

bash scripts/render-chunks.sh V03-tres-sinais out/v03.mp4                       # só renderizar
bash scripts/render-chunks.sh V03-tres-sinais out/v03-sem-legenda.mp4 '{"captions":false}'
npx tsx scripts/conteudo.ts                      # atualiza a documentação em ../conteudo
```

Modelo de voz `pt_BR-faber-medium`: https://github.com/k2-fsa/sherpa-onnx/releases/tag/tts-models (arquivo `vits-piper-pt_BR-faber-medium.tar.bz2`).

**Estabilidade:** instale no sistema as fontes de `public/fonts/` (no Linux, copie para `~/.local/share/fonts`). Assim o render não depende de carregar fontes em cada aba. O `render-chunks.sh` empacota o código uma vez, renderiza em blocos de 125 quadros com nova tentativa e junta tudo no final.

Se o Remotion não conseguir baixar o Chrome: `REMOTION_BROWSER=/caminho/do/chrome bash scripts/render-chunks.sh ...`

## Criar um vídeo novo

1. Copie uma spec parecida (`src/videos/v07.ts`), mude `id`, `num`, `slug`, falas e cenas.
2. Registre em `src/videos/index.ts`.
3. `bash scripts/build-video.sh vNN`, confira no Studio e renderize.

## Trocar a voz por locução profissional

1. Grave cada frase em um arquivo: `public/vNN/voice/l01.wav`, `l02.wav`… (na ordem das falas da spec).
2. Atualize `public/vNN/voice.json` com a duração de cada fala (campo `speech`, em segundos). O `gen_series_voice.py` mostra como medir.
3. Rode `npx tsx scripts/series.ts layout vNN && python3 scripts/gen_series_music.py vNN` e renderize.

## Créditos e licenças

- Fontes: Plus Jakarta Sans e DM Serif Display (Google Fonts, SIL Open Font License).
- Trilhas e efeitos: sintetizados neste projeto, sem samples de terceiros.
- Voz: Piper TTS, modelo `pt_BR-faber-medium`. Confira a licença no `MODEL_CARD` do modelo antes de uso comercial.
