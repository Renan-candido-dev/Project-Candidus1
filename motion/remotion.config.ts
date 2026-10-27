import {Config} from '@remotion/cli/config';

// Qualidade de entrega para Reels/TikTok/Shorts: H.264 yuv420p com CRF baixo
// (passado nos comandos de render do package.json e de scripts/render-chunks.sh).
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);

// Em ambientes sem download do Chrome, aponte para um Chromium local:
// REMOTION_BROWSER=/caminho/chrome-headless-shell npm run render
if (process.env.REMOTION_BROWSER) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER);
}
