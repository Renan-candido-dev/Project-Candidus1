import {continueRender, delayRender, staticFile} from 'remotion';

// Fontes embarcadas em public/fonts (Google Fonts, licença OFL) para renderizar offline.
// Usa a fonte instalada no sistema quando existir (local()) e, senão, o arquivo do projeto.
export const SANS = 'Plus Jakarta Sans';
export const SERIF = 'DM Serif Display';

/** A fonte já está instalada no sistema? (compara a largura do texto com a fonte reserva) */
const installed = (family: string, style = 'normal') => {
  const ctx = document.createElement('canvas').getContext('2d');
  if (!ctx) return false;
  const sample = 'Candidus R$ 0123 gestão';
  ctx.font = `${style} 40px monospace`;
  const base = ctx.measureText(sample).width;
  ctx.font = `${style} 40px "${family}", monospace`;
  return ctx.measureText(sample).width !== base;
};

if (typeof document !== 'undefined' && !document.getElementById('candidus-fonts')) {
  const allInstalled = installed(SANS) && installed(SERIF) && installed(SERIF, 'italic');
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

  // Com as fontes instaladas no sistema não há o que esperar; senão, aguarda o carregamento.
  // (Instalar as fontes de public/fonts deixa o render mais estável em renders longos.)
  if (!allInstalled) {
    const handle = delayRender('Carregando fontes');
    const done = () => continueRender(handle);
    Promise.all(
      [`400 40px "${SANS}"`, `800 40px "${SANS}"`, `40px "${SERIF}"`, `italic 40px "${SERIF}"`].map((f) => document.fonts.load(f)),
    ).then(done, done);
  }
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
