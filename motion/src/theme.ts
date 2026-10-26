import {continueRender, delayRender, staticFile} from 'remotion';

// Fontes embarcadas em public/fonts (Google Fonts, licença OFL) para renderizar offline.
// Usa a fonte instalada no sistema quando existir (local()) e, senão, o arquivo do projeto.
export const SANS = 'Plus Jakarta Sans';
export const SERIF = 'DM Serif Display';

if (typeof document !== 'undefined' && !document.getElementById('candidus-fonts')) {
  const face = (family: string, file: string, weight: string, style = 'normal') =>
    `@font-face{font-family:'${family}';src:local('${family}${style === 'italic' ? ' Italic' : ''}'),url('${staticFile(
      `fonts/${file}`,
    )}') format('woff2');font-weight:${weight};font-style:${style};font-display:block}`;
  const el = document.createElement('style');
  el.id = 'candidus-fonts';
  el.textContent = [
    face(SANS, 'jakarta-latin.woff2', '400 800'),
    face(SERIF, 'dmserif-latin.woff2', '400'),
    face(SERIF, 'dmserif-italic-latin.woff2', '400', 'italic'),
  ].join('\n');
  document.head.appendChild(el);

  // Espera as fontes, mas nunca trava o render: no pior caso libera após 10 s.
  const handle = delayRender('Carregando fontes', {timeoutInMilliseconds: 60000});
  const done = () => continueRender(handle);
  Promise.race([
    Promise.all(
      [`400 40px "${SANS}"`, `800 40px "${SANS}"`, `40px "${SERIF}"`, `italic 40px "${SERIF}"`].map((f) => document.fonts.load(f)),
    ),
    new Promise((r) => setTimeout(r, 10000)),
  ]).then(done, done);
}

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
