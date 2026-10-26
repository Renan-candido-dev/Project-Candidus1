import React from 'react';
import {useCurrentFrame} from 'remotion';
import {EASE_IN_OUT, tw} from '../anim';

type Key = {f: number; x: number; y: number};

/** Ponteiro que percorre keyframes e "clica" (pressão + onda) nos frames indicados. */
export const Cursor: React.FC<{keys: Key[]; clicks?: number[]; color?: string; ring?: string}> = ({
  keys,
  clicks = [],
  color = '#0E1A15',
  ring = 'rgba(201,162,74,0.9)',
}) => {
  const f = useCurrentFrame();
  if (f < keys[0].f) return null;
  let x = keys[keys.length - 1].x;
  let y = keys[keys.length - 1].y;
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (f <= b.f) {
      x = tw(f, a.f, b.f, a.x, b.x, EASE_IN_OUT);
      y = tw(f, a.f, b.f, a.y, b.y, EASE_IN_OUT);
      break;
    }
  }
  let press = 1;
  const ripples: React.ReactNode[] = [];
  clicks.forEach((c, i) => {
    const d = f - c;
    if (d >= -3 && d <= 6) press = Math.min(press, 1 - 0.18 * Math.sin(((d + 3) / 9) * Math.PI));
    if (d >= 0 && d < 22) {
      const t = d / 22;
      ripples.push(
        <div
          key={i}
          style={{
            position: 'absolute',
            left: -60 * (0.3 + t),
            top: -60 * (0.3 + t),
            width: 120 * (0.3 + t),
            height: 120 * (0.3 + t),
            borderRadius: '50%',
            border: `4px solid ${ring}`,
            opacity: 1 - t,
          }}
        />,
      );
    }
  });
  const appear = tw(f, keys[0].f, keys[0].f + 8, 0, 1);
  return (
    <div style={{position: 'absolute', left: x, top: y, opacity: appear}}>
      {ripples}
      <svg
        width={64}
        height={64}
        viewBox="0 0 24 24"
        style={{
          position: 'absolute',
          left: -8,
          top: -6,
          transform: `scale(${press})`,
          transformOrigin: '8px 6px',
          filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.25))',
        }}
      >
        <path
          d="M5 3 L5 19.5 L9.3 15.6 L12.2 21.6 L15 20.3 L12.2 14.5 L18 14.5 Z"
          fill={color}
          stroke="#fff"
          strokeWidth={1.4}
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
