import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

// Fontes embarcadas em public/fonts (Google Fonts, licença OFL) para renderizar offline.
export const SANS = 'Plus Jakarta Sans';
export const SERIF = 'DM Serif Display';

loadFont({family: SANS, url: staticFile('fonts/jakarta-latin.woff2'), weight: '400 800', format: 'woff2'});
loadFont({family: SERIF, url: staticFile('fonts/dmserif-latin.woff2'), weight: '400', style: 'normal', format: 'woff2'});
loadFont({family: SERIF, url: staticFile('fonts/dmserif-italic-latin.woff2'), weight: '400', style: 'italic', format: 'woff2'});

// Paleta da marca: verde-escuro, branco/marfim e dourado.
export const C = {
  ivory: '#F4F1EA',
  ivoryDeep: '#E9E3D6',
  paper: '#FFFFFF',
  green: '#0E3B2E',
  greenMid: '#1D5C46',
  greenSoft: '#D5E4DB',
  greenDeep: '#0A2E23',
  greenInk: '#061A14',
  night: '#030D0A',
  gold: '#C9A24A',
  goldLight: '#EBD08A',
  goldDeep: '#9E7B2C',
  coral: '#D4644F',
  coralSoft: '#F6DDD6',
  ink: '#10201A',
  muted: '#6E7C75',
  line: 'rgba(14,59,46,0.10)',
};

export const GOLD_GRADIENT = 'linear-gradient(135deg, #F3DC97 0%, #D6B05A 42%, #A98330 100%)';
export const GOLD_TEXT: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, #F6E3A6 0%, #D9B45E 45%, #B38B35 100%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
};

export const W = 1080;
export const H = 1920;
export const FPS = 30;
