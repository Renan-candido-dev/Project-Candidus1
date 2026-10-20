# Candidus · Série de 30 vídeos (Reels / TikTok)

Vídeos curtos (≈ 20–30 s, 1080×1920) no estilo do modelo de referência — gradiente vivo,
etiquetas de dores caindo na lixeira, palavra destacada, ícones em órbita, tipografia gigante,
telas de frase e logo no final — com as cores da Candidus e música (sem narração).

- `videos.js` — o conteúdo dos 30 dias (cada vídeo = lista de blocos). Edite aqui.
- `engine.js` — o motor de blocos (gancho, etiquetas, destaque, orbita, palavra, onda, frase, lista, antesDepois, planos, foto, cta, logo).
- `gerar_musicas.py` — trilhas originais a 120 BPM (energia, corporativa, lofi) + efeitos.
- `CALENDARIO.md` — tema, legenda e hashtags de cada dia (`node calendario.js` regenera).

```bash
python3 gerar_musicas.py        # trilhas e efeitos (numpy + ffmpeg)
node export.js todos            # ou: node export.js 5   |   node export.js 1-10
# pré-visualizar: sirva a pasta do projeto e abra /serie/player.html?n=1
```
Cada bloco dura o tempo de leitura confortável, arredondado para o tempo da música (cortes na batida).
