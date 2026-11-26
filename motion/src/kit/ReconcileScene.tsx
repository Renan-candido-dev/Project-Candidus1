import React from 'react';
import {interpolateColors, useCurrentFrame} from 'remotion';
import {EASE_IN_OUT, brl, spr, tw} from '../anim';
import {Illustrative} from '../components/UI';
import {C, SANS} from '../theme';
import {Card, Fill, Headline, SceneBase, SceneBg, cueAt, isDark} from './common';

type R = {date: string; label: string; v: number};

type Props = SceneBase & {
  headline?: string[];
  left: {title: string; rows: R[]};
  right: {title: string; rows: R[]};
  /** pares [linha da esquerda, linha da direita] que batem */
  pairs: [number, number][];
  mismatch?: {left: number; right: number; label: string; cue?: number};
  matchCue?: number;
};

const ROW = 100;

/** Conciliação: registros internos × extrato bancário, ligando o que confere. */
export const ReconcileScene: React.FC<Props> = ({dur, cues, bg = 'ivory', headline, left, right, pairs, mismatch, matchCue}) => {
  const f = useCurrentFrame();
  const dark = isDark(bg);
  const s0 = Math.max(4, cueAt(cues, 0, 10) - 6);
  const push = tw(f, 0, dur, 1, 1.03);
  const top = headline ? 560 : 420;
  const mAt = matchCue !== undefined ? cueAt(cues, matchCue, s0 + 30) : s0 + 30;
  const xAt = mismatch?.cue !== undefined ? cueAt(cues, mismatch.cue, mAt + pairs.length * 6 + 10) : mAt + pairs.length * 6 + 10;
  const listTop = top + 96;

  const col = (side: {title: string; rows: R[]}, k: number) => {
    const p = spr(f, s0 + k * 6, {damping: 16, stiffness: 140});
    return (
      <Card
        key={k}
        style={{
          position: 'absolute',
          top,
          left: k === 0 ? 60 : 600,
          width: 420,
          padding: '28px 26px 20px',
          transform: `translateY(${(1 - p) * 100}px)`,
          opacity: Math.min(1, p),
        }}
      >
        <div style={{fontSize: 27, fontWeight: 800, color: C.ink, height: 50}}>{side.title}</div>
        {side.rows.map((r, j) => {
          const isMis = mismatch && (k === 0 ? mismatch.left === j : mismatch.right === j);
          const pair = pairs.findIndex(([a, b]) => (k === 0 ? a : b) === j);
          const ok = pair >= 0 ? tw(f, mAt + pair * 6, mAt + pair * 6 + 8, 0, 1) : 0;
          const bad = isMis ? tw(f, xAt, xAt + 10, 0, 1) : 0;
          return (
            <div
              key={j}
              style={{
                height: ROW,
                borderTop: `2px solid ${C.line}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '0 10px',
                margin: '0 -10px',
                borderRadius: 12,
                background: bad ? `rgba(212,100,79,${0.14 * bad})` : ok ? `rgba(29,92,70,${0.07 * ok})` : undefined,
                opacity: tw(f, s0 + 8 + j * 3, s0 + 16 + j * 3, 0, 1),
              }}
            >
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 21, fontWeight: 700, color: C.muted}}>
                <span>{r.date}</span>
                <span style={{color: interpolateColors(bad, [0, 1], [C.muted, C.coral])}}>{bad > 0.5 ? 'divergente' : ok > 0.5 ? 'conferido ✓' : ''}</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 26, fontWeight: 800, color: C.ink, marginTop: 4}}>
                <span style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 200}}>{r.label}</span>
                <span style={{color: bad > 0.5 ? C.coral : r.v < 0 ? C.ink : C.greenMid, fontVariantNumeric: 'tabular-nums'}}>{brl(r.v)}</span>
              </div>
            </div>
          );
        })}
      </Card>
    );
  };

  const cy = (j: number) => listTop + j * ROW + ROW / 2 + 2;
  const misP = mismatch ? spr(f, xAt + 6, {damping: 11, stiffness: 200}) : 0;

  return (
    <Fill>
      <SceneBg bg={bg} drift={dur} />
      <Fill style={{transform: `scale(${push})`}}>
        {headline && <Headline lines={headline} at={s0} dark={dark} size={80} top={250} />}
        {col(left, 0)}
        {col(right, 1)}
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
          {pairs.map(([a, b], k) => {
            const d = tw(f, mAt + k * 6, mAt + k * 6 + 10, 0, 1, EASE_IN_OUT);
            return (
              <path
                key={k}
                d={`M 470 ${cy(a)} C 535 ${cy(a)}, 535 ${cy(b)}, 610 ${cy(b)}`}
                fill="none"
                stroke={C.greenMid}
                strokeWidth={4}
                pathLength={1}
                strokeDasharray="1 1"
                strokeDashoffset={1 - d}
              />
            );
          })}
          {mismatch && (
            <path
              d={`M 470 ${cy(mismatch.left)} C 535 ${cy(mismatch.left)}, 535 ${cy(mismatch.right)}, 610 ${cy(mismatch.right)}`}
              fill="none"
              stroke={C.coral}
              strokeWidth={5}
              strokeDasharray="10 8"
              opacity={tw(f, xAt, xAt + 8, 0, 1)}
            />
          )}
        </svg>
        {mismatch && (
          <div style={{position: 'absolute', left: 0, right: 0, top: listTop + Math.max(left.rows.length, right.rows.length) * ROW + 70, display: 'flex', justifyContent: 'center'}}>
            <div
              style={{
                padding: '18px 34px',
                borderRadius: 999,
                background: C.coral,
                color: '#fff',
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: 32,
                boxShadow: '0 18px 40px rgba(212,100,79,0.35)',
                transform: `scale(${misP})`,
                opacity: Math.min(1, misP),
              }}
            >
              {mismatch.label}
            </div>
          </div>
        )}
        <Illustrative style={{position: 'absolute', left: 60, top: listTop + Math.max(left.rows.length, right.rows.length) * ROW + 40, fontSize: 17}} />
      </Fill>
    </Fill>
  );
};
