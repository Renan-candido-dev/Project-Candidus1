import React from 'react';
import {useCurrentFrame} from 'remotion';
import {EASE_IN, EASE_OUT, tw} from '../anim';

export type Part = {t: string; s?: React.CSSProperties};

/**
 * Tipografia cinética: cada palavra sobe de dentro de uma máscara (modo "rise")
 * ou surge do desfoque (modo "blur"). Saída opcional em `exitAt`.
 */
export const Words: React.FC<{
  parts: Part[];
  at: number;
  stagger?: number;
  dur?: number;
  mode?: 'rise' | 'blur';
  exitAt?: number;
  exitMode?: 'rise' | 'blur';
  style?: React.CSSProperties;
  gap?: string;
}> = ({parts, at, stagger = 3, dur = 16, mode = 'rise', exitAt, exitMode = 'rise', style, gap = '0.26em'}) => {
  const f = useCurrentFrame();
  const words: {t: string; s?: React.CSSProperties}[] = [];
  parts.forEach((p) => p.t.split(' ').filter(Boolean).forEach((w) => words.push({t: w, s: p.s})));

  return (
    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: gap, ...style}}>
      {words.map((w, i) => {
        const s = at + i * stagger;
        const p = tw(f, s, s + dur, 0, 1, EASE_OUT);
        const x = exitAt === undefined ? 0 : tw(f, exitAt + i * 1.5, exitAt + i * 1.5 + 12, 0, 1, EASE_IN);
        let inner: React.CSSProperties;
        if (mode === 'rise') {
          inner = {
            transform: `translateY(${(1 - p) * 115}%) rotate(${(1 - p) * 6}deg)`,
            opacity: p > 0 ? 1 : 0,
          };
        } else {
          inner = {
            opacity: p,
            filter: `blur(${(1 - p) * 18}px)`,
            transform: `scale(${1 + (1 - p) * 0.25}) translateY(${(1 - p) * 20}px)`,
          };
        }
        if (x > 0) {
          if (exitMode === 'rise') {
            inner.transform = `translateY(${-x * 115}%)`;
          } else {
            inner.opacity = (inner.opacity as number) * (1 - x);
            inner.filter = `blur(${x * 20}px)`;
            inner.transform = `translateY(${-x * 40}px) scale(${1 + x * 0.1})`;
          }
        }
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              overflow: mode === 'rise' ? 'hidden' : 'visible',
              padding: '0.14em 0.04em 0.16em',
              margin: '-0.14em -0.04em -0.16em',
              lineHeight: 1.05,
            }}
          >
            <span style={{display: 'inline-block', transformOrigin: '0% 100%', willChange: 'transform', ...w.s, ...inner}}>
              {w.t}
            </span>
          </span>
        );
      })}
    </div>
  );
};

/** Letras que se dissolvem uma a uma (desfoque + subida + fade). */
export const Dissolve: React.FC<{
  text: string;
  start: number;
  per?: number;
  style?: React.CSSProperties;
  charStyle?: React.CSSProperties;
}> = ({text, start, per = 2, style, charStyle}) => {
  const f = useCurrentFrame();
  return (
    <span style={{display: 'inline-flex', ...style}}>
      {text.split('').map((ch, i) => {
        const s = start + i * per;
        const t = tw(f, s, s + 18, 0, 1, EASE_IN);
        const dir = (i % 2 ? 1 : -1) * (6 + (i * 37) % 20);
        return (
          <span
            key={i}
            style={{
              ...charStyle,
              display: 'inline-block',
              whiteSpace: 'pre',
              opacity: 1 - t,
              filter: `blur(${t * 14}px)`,
              transform: `translate(${t * dir}px, ${-t * (60 + (i * 53) % 70)}px) scale(${1 + t * 0.4})`,
            }}
          >
            {ch}
          </span>
        );
      })}
    </span>
  );
};
