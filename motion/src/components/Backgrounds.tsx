import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {wobble} from '../anim';

/** Granulação fina animada: tira o aspecto "chapado" de template. */
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.06}) => {
  const f = useCurrentFrame();
  const seed = Math.floor(f / 2) % 8;
  return (
    <AbsoluteFill style={{opacity, mixBlendMode: 'overlay', pointerEvents: 'none'}}>
      <svg width="100%" height="100%">
        <filter id={`grain-${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

/** Fundo marfim com manchas suaves de luz (dourado e verde) em deriva lenta. */
export const IvoryBg: React.FC<{drift?: number}> = ({drift = 0}) => {
  const f = useCurrentFrame() + drift;
  const g1x = 25 + wobble(f, 1, 0.015) * 10;
  const g1y = 18 + wobble(f, 2, 0.012) * 6;
  const g2x = 80 + wobble(f, 3, 0.013) * 8;
  const g2y = 82 + wobble(f, 4, 0.011) * 6;
  return (
    <AbsoluteFill
      style={{
        background: [
          `radial-gradient(circle at ${g1x}% ${g1y}%, rgba(214,176,90,0.22) 0%, rgba(214,176,90,0) 38%)`,
          `radial-gradient(circle at ${g2x}% ${g2y}%, rgba(29,92,70,0.16) 0%, rgba(29,92,70,0) 42%)`,
          `radial-gradient(ellipse at 50% 50%, ${C.ivory} 55%, ${C.ivoryDeep} 100%)`,
        ].join(','),
      }}
    />
  );
};

/** Fundo verde profundo com grade técnica discreta. */
export const GreenBg: React.FC<{dark?: number; grid?: boolean}> = ({dark = 0, grid = true}) => {
  const f = useCurrentFrame();
  const gx = 50 + wobble(f, 7, 0.01) * 8;
  return (
    <AbsoluteFill style={{background: C.greenInk}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at ${gx}% 38%, #165340 0%, ${C.greenDeep} 42%, ${C.greenInk} 100%)`,
        }}
      />
      {grid && (
        <AbsoluteFill
          style={{
            backgroundImage:
              'linear-gradient(rgba(235,208,138,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(235,208,138,0.06) 1px, transparent 1px)',
            backgroundSize: '90px 90px',
            backgroundPosition: `0px ${(f * 0.6) % 90}px`,
            maskImage: 'radial-gradient(ellipse at 50% 45%, black 0%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 50% 45%, black 0%, transparent 70%)',
          }}
        />
      )}
      {dark > 0 && <AbsoluteFill style={{background: C.night, opacity: dark}} />}
    </AbsoluteFill>
  );
};

/** Círculos finos concêntricos que se expandem (assinatura visual da referência). */
export const Rings: React.FC<{
  x: number;
  y: number;
  start: number;
  color: string;
  count?: number;
  gap?: number;
  maxR?: number;
  life?: number;
  width?: number;
}> = ({x, y, start, color, count = 3, gap = 7, maxR = 900, life = 40, width = 2}) => {
  const f = useCurrentFrame();
  return (
    <svg style={{position: 'absolute', inset: 0}} width="100%" height="100%">
      {Array.from({length: count}).map((_, i) => {
        const t = (f - start - i * gap) / life;
        if (t < 0 || t > 1) return null;
        const e = 1 - Math.pow(1 - t, 3);
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={20 + e * maxR}
            fill="none"
            stroke={color}
            strokeWidth={width}
            opacity={(1 - t) * 0.7}
          />
        );
      })}
    </svg>
  );
};
