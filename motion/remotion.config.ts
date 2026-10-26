import {Config} from '@remotion/cli/config';

// Qualidade de entrega para Reels/TikTok/Shorts (H.264, yuv420p, CRF baixo).
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setCodec('h264');
Config.setCrf(16);
Config.setPixelFormat('yuv420p');
Config.setAudioBitrate('320k');

// Em ambientes sem download do Chrome, aponte para um Chromium local:
// REMOTION_BROWSER=/caminho/chrome-headless-shell npm run render
if (process.env.REMOTION_BROWSER) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER);
}
