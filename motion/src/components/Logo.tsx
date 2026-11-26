import React from 'react';
import {useCurrentFrame} from 'remotion';
import {EASE_IN_OUT, EASE_OUT, spr, tw} from '../anim';
import {C, GOLD_TEXT, SANS, SERIF} from '../theme';

const BARS = [
  {x: 38, h: 56},
  {x: 92, h: 84},
  {x: 146, h: 116},
  {x: 200, h: 150},
];
const ARROW = 'M 22 118 C 90 112, 170 92, 262 26';

/** Ícone da Candidus (barras + seta) desenhado em vetor e animado. */
export const LogoMark: React.FC<{at: number; size?: number; static?: boolean}> = ({at, size = 300, static: still}) => {
  const frame = useCurrentFrame();
  const f = still ? at + 200 : frame;
  const draw = tw(f, at + 8, at + 28, 0, 1, EASE_IN_OUT);
  const head = spr(f, at + 24, {damping: 11, stiffness: 220});
  return (
    <svg width={size} height={(size * 200) / 300} viewBox="0 0 300 200" style={{overflow: 'visible'}}>
      <defs>
        <linearGradient id="lm-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F6E2A0" />
          <stop offset="0.5" stopColor="#D8B35C" />
          <stop offset="1" stopColor="#A47E2E" />
        </linearGradient>
        <linearGradient id="lm-gold-h" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#B38B35" />
          <stop offset="1" stopColor="#F6E2A0" />
        </linearGradient>
      </defs>
      {BARS.map((b, i) => {
        const s = spr(f, at + i * 4, {damping: 13, stiffness: 190});
        const h = b.h * s;
        return <rect key={i} x={b.x} y={192 - h} width={42} height={h} rx={3} fill="url(#lm-gold)" />;
      })}
      <path
        d={ARROW}
        fill="none"
        stroke="url(#lm-gold-h)"
        strokeWidth={13}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1 1"
        strokeDashoffset={1 - draw}
      />
      <g transform={`translate(262 26) rotate(-36) scale(${head})`}>
        <path d="M 14 0 L -18 -20 L -10 0 L -18 20 Z" fill="#F3DC97" />
      </g>
    </svg>
  );
};

/** Assinatura completa: ícone + "Candidus" + "GESTÃO FINANCEIRA" + linha de valores. */
export const LogoLockup: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  const word = 'Candidus';
  const sub = tw(f, at + 34, at + 58, 0, 1, EASE_OUT);
  const tag = tw(f, at + 44, at + 64, 0, 1, EASE_OUT);
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <LogoMark at={at} size={300} />
      <div style={{display: 'flex', marginTop: 6, overflow: 'hidden', padding: '0 20px 14px'}}>
        {word.split('').map((ch, i) => {
          const p = tw(f, at + 20 + i * 2, at + 40 + i * 2, 0, 1, EASE_OUT);
          return (
            <span
              key={i}
              style={{
                fontFamily: SERIF,
                fontStyle: 'normal',
                fontSize: 176,
                lineHeight: 1,
                color: C.ivory,
                display: 'inline-block',
                transform: `translateY(${(1 - p) * 100}%)`,
                opacity: p > 0 ? 1 : 0,
                letterSpacing: '-0.01em',
              }}
            >
              {ch}
            </span>
          );
        })}
      </div>
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 44,
          letterSpacing: `${0.6 - sub * 0.28}em`,
          marginRight: `-${0.6 - sub * 0.28}em`,
          opacity: sub,
          ...GOLD_TEXT,
        }}
      >
        GESTÃO FINANCEIRA
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 18, marginTop: 26, opacity: tag}}>
        <div style={{width: 90 * tag, height: 2, background: C.gold, opacity: 0.8}} />
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 22,
            letterSpacing: '0.2em',
            color: 'rgba(244,241,234,0.75)',
            whiteSpace: 'nowrap',
          }}
        >
          ORGANIZAÇÃO • PLANEJAMENTO • RESULTADOS
        </div>
        <div style={{width: 90 * tag, height: 2, background: C.gold, opacity: 0.8}} />
      </div>
    </div>
  );
};
