import React from 'react';
import {AbsoluteFill} from 'remotion';
import {GreenBg, IvoryBg} from '../components/Backgrounds';
import {Part, Words} from '../components/Words';
import type {Cue} from '../series/layout';
import type {Bg} from '../series/types';
import {C, GOLD_TEXT, SANS, SERIF} from '../theme';

/** Props que toda cena do kit recebe do renderizador. */
export type SceneBase = {dur: number; cues: Cue[]; bg?: Bg};

/** Frame em que a fala k começa (ou um padrão, se a cena tiver menos falas). */
export const cueAt = (cues: Cue[], k: number, fallback: number) => (cues[k] ? cues[k].at : fallback);

export const SceneBg: React.FC<{bg?: Bg; drift?: number}> = ({bg = 'ivory', drift}) =>
  bg === 'ivory' ? <IvoryBg drift={drift} /> : bg === 'green' ? <GreenBg /> : <GreenBg dark={0.75} grid={false} />;

export const isDark = (bg?: Bg) => bg === 'green' || bg === 'night';

/**
 * Converte a marcação dos roteiros em partes estilizadas:
 *   *texto*  → negrito na cor de destaque
 *   _texto_  → serifada itálica dourada (palavra-chave)
 */
export const rich = (line: string, dark: boolean, size: number): Part[] =>
  line
    .split(/(\*[^*]+\*|_[^_]+_)/)
    .filter(Boolean)
    .map((tok) => {
      if (tok.startsWith('*'))
        return {t: tok.slice(1, -1), s: {fontWeight: 800, color: dark ? C.ivory : C.green, letterSpacing: '-0.035em'}};
      if (tok.startsWith('_'))
        return {
          t: tok.slice(1, -1),
          s: {fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400, fontSize: size * 1.38, letterSpacing: '-0.01em', ...GOLD_TEXT},
        };
      return {t: tok.trim(), s: {fontWeight: 500, color: dark ? 'rgba(244,241,234,0.92)' : C.ink}};
    })
    .filter((p) => p.t);

/** Título cinético em várias linhas, com marcação *negrito* e _serifa_. */
export const Headline: React.FC<{
  lines: string[];
  at: number;
  dark?: boolean;
  size?: number;
  top?: number;
  lineAt?: number[];
  exitAt?: number;
  align?: 'center' | 'left';
  mode?: 'rise' | 'blur';
}> = ({lines, at, dark = false, size = 92, top, lineAt, exitAt, align = 'center', mode = 'rise'}) => (
  <div
    style={{
      position: top === undefined ? 'relative' : 'absolute',
      top,
      left: 56,
      right: 56,
      display: 'flex',
      flexDirection: 'column',
      alignItems: align === 'center' ? 'center' : 'flex-start',
      gap: size * 0.06,
    }}
  >
    {lines.map((l, i) => {
      // ajuste automático: reduz a linha se a estimativa de largura passar da área útil
      const est = l
        .split(/(_[^_]+_)/)
        .reduce((w, tok) => w + (tok.startsWith('_') ? (tok.length - 2) * 0.5 * 1.38 : tok.replace(/\*/g, '').length * 0.56), 0);
      const fit = Math.min(size, (940 / Math.max(1, est * size)) * size);
      const parts = rich(l, dark, fit);
      const hasSerif = l.includes('_');
      return (
        <Words
          key={i}
          parts={parts}
          at={lineAt?.[i] ?? at + i * 7}
          stagger={3}
          mode={hasSerif && mode === 'rise' ? 'rise' : mode}
          exitAt={exitAt}
          exitMode="blur"
          style={{
            fontFamily: SANS,
            fontSize: fit,
            justifyContent: align === 'center' ? 'center' : 'flex-start',
            alignItems: 'baseline',
            letterSpacing: '-0.025em',
          }}
        />
      );
    })}
  </div>
);

/** Rótulo pequeno em caixa-alta (ex.: "SINAL DE ALERTA", "NA PRÁTICA"). */
export const Kicker: React.FC<{text: string; dark?: boolean; p?: number; style?: React.CSSProperties}> = ({text, dark, p = 1, style}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      padding: '10px 22px',
      borderRadius: 999,
      border: `2px solid ${dark ? 'rgba(235,208,138,0.45)' : 'rgba(14,59,46,0.18)'}`,
      color: dark ? C.goldLight : C.green,
      fontFamily: SANS,
      fontWeight: 800,
      fontSize: 24,
      letterSpacing: '0.2em',
      opacity: p,
      transform: `translateY(${(1 - p) * 16}px)`,
      ...style,
    }}
  >
    <span style={{width: 10, height: 10, borderRadius: 5, background: C.gold}} />
    {text}
  </div>
);

/** Card branco padrão das interfaces. */
export const Card: React.FC<{style?: React.CSSProperties; children: React.ReactNode; dark?: boolean}> = ({style, children, dark}) => (
  <div
    style={{
      borderRadius: 44,
      background: dark ? 'linear-gradient(160deg, rgba(24,78,60,0.9), rgba(8,32,25,0.95))' : C.paper,
      border: dark ? '2px solid rgba(235,208,138,0.16)' : undefined,
      boxShadow: dark ? '0 40px 80px rgba(0,0,0,0.4)' : '0 50px 100px rgba(10,46,35,0.14), 0 6px 18px rgba(10,46,35,0.05)',
      fontFamily: SANS,
      boxSizing: 'border-box',
      ...style,
    }}
  >
    {children}
  </div>
);

export const Fill: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <AbsoluteFill style={{overflow: 'hidden', ...style}}>{children}</AbsoluteFill>
);
