# Candidus · Vídeos para Instagram e TikTok

Vídeos verticais (1080x1920, 30 fps) feitos 100% em JavaScript com canvas, no estilo
de tipografia cinética do vídeo de referência, usando a identidade Candidus
(verde-escuro + dourado), a logo e a foto do Renan.

| Vídeo | Arquivo | Duração |
|---|---|---|
| 1 · Apresentação (foco em BPO financeiro) | `out/candidus-apresentacao.mp4` | 56 s |
| 2 · Proposta comercial (dor → solução → planos) | `out/candidus-proposta.mp4` | 76 s |

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

## Narração e música
- **Voz:** narração neural em pt-BR (Piper, roda offline). O texto de cada cena fica em
  `roteiro.json`. Cada cena é esticada automaticamente para a fala caber.
- **Música:** trilha original composta por código (`gerar_audio.py`), livre de direitos autorais.
  Na mixagem, a música abaixa sozinha quando a voz entra.
- Amostras das vozes disponíveis: `amostras-voz/` (faber, cadu, jeff).

```bash
pip install piper-tts numpy
python3 gerar_audio.py --voz faber --velocidade 0.95   # gera audio/ (voz + trilha)
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
