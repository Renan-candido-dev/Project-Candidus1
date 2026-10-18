# Candidus · Vídeos para Instagram e TikTok

Vídeos verticais (1080x1920, 30 fps) feitos 100% em JavaScript com canvas, no estilo
de tipografia cinética do vídeo de referência, usando a identidade Candidus
(verde-escuro + dourado), a logo e a foto do Renan.

| Vídeo | Arquivo | Duração |
|---|---|---|
| 1 · Apresentação (foco em BPO financeiro) | `out/candidus-apresentacao.mp4` | 45,5 s (com narração) |
| 2 · Serviços e planos (dor → como atuamos → planos) | `out/candidus-proposta.mp4` | 76,8 s (com narração) |

## Pré-visualizar
Sirva a pasta e abra o player (fontes não carregam via `file://`):

```bash
cd videos && npx serve .        # ou: python3 -m http.server
# abra http://localhost:3000/player.html?v=1  (ou ?v=2)
```

## Editar textos
- Vídeo 1: objeto `CFG1` em `video1-apresentacao.js` (nome, cargo, serviços, CTA).
- Vídeo 2: objeto `CFG2` em `video2-proposta.js` (dores, rotina, planos, preços, CTA).
- Cores, fontes e animações compartilhadas: `engine.js`.

## Direção visual
- Verde profundo, dourado e branco; logo original e foto do Renan sem alterações.
- Uma única animação de entrada (surge deslizando levemente para cima) e transição por dissolve.
- Textos dentro da área segura do Instagram (x 120–940, y 300–1480), longe dos botões e da legenda.

## Narração
A voz lê tudo o que está escrito na tela (texto em `roteiro.json`, uma fala por cena).
A fala é gerada frase a frase (com pausas fixas), então o início de cada frase é exato; cada
texto/cartão entra no momento em que a voz chega a ele (`cue()` em `engine.js`, dados em `VO_SEG`).
Voz padrão: **Supertonic 3** (Supertone, licença OpenRAIL-M, uso comercial permitido), modelo baixado do GitHub. Os efeitos abaixam automaticamente quando a voz fala.

```bash
pip install piper-tts sherpa-onnx numpy
python3 gerar_audio.py --narrar --voz f2 --velocidade 0.95     # Supertonic 3: f1–f5 (femininas), m1–m5 (masculinas)
# também: faber, cadu, jeff (Piper) · dora, alex, santa (Kokoro) · amostras: python3 gerar_audio.py --amostras
python3 gerar_audio.py                                          # sem narração (só efeitos)
```

## Som (sem música de fundo)
Efeitos próprios da Candidus, discretos, gerados por `gerar_audio.py`:
- `sfx-abertura` – impacto curto e suave na abertura;
- `sfx-transicao` – sopro leve nas transições principais;
- `sfx-logo` – assinatura sonora breve na entrada da logo (acorde grave + arpejo de sinos).

Cada cena define seus efeitos em `sfx: [[nome, segundos]]`.

```bash
pip install numpy
python3 gerar_audio.py                      # só efeitos (padrão)
python3 gerar_audio.py --estilo comercial   # opcional: adiciona música de fundo
```

### Usar a sua própria voz (ou uma voz licenciada)
Grave (ou gere numa ferramenta de voz com licença comercial) **um arquivo por cena**, lendo
as falas do `roteiro.json` na ordem: `00.mp3`, `01.mp3`, `02.mp3`... Coloque numa pasta e rode:

```bash
python3 gerar_audio.py --importar minha-voz/apresentacao --video 1
python3 gerar_audio.py --importar minha-voz/proposta --video 2
node export.js 1 && node export.js 2
```
O silêncio do começo e do fim é cortado, o volume é normalizado e cada cena se ajusta à duração da sua fala.

## Exportar MP4
Requer Node 18+, ffmpeg e Playwright (`npm i`).

```bash
npm run export:apresentacao
npm run export:proposta
node export.js 2 --music trilha.mp3   # usa outra música no lugar da gerada
node export.js 1 --sem-audio           # vídeo mudo
```
