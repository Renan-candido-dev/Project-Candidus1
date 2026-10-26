import React from 'react';
import {useCurrentFrame} from 'remotion';
import {EASE_OUT, tw} from '../anim';
import {SANS} from '../theme';

export type CaptionCue = {from: number; to: number; text: string};

/**
 * Legendas da narração, em blocos curtos, com a palavra falada destacada em dourado.
 * Posicionadas acima da área de interface do Reels/TikTok.
 */
export const Captions: React.FC<{cues: CaptionCue[]; top?: number}> = ({cues, top = 1418}) => {
  const f = useCurrentFrame();
  const cue = cues.find((c) => f >= c.from - 2 && f < c.to + 4);
  if (!cue) return null;
  const words = cue.text.split(' ');
  const total = words.reduce((n, w) => n + w.length + 1, 0);
  const span = cue.to - cue.from;
  const inP = tw(f, cue.from - 2, cue.from + 6, 0, 1, EASE_OUT);
  const outP = tw(f, cue.to, cue.to + 4, 0, 1);
  let acc = 0;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top,
        display: 'flex',
        justifyContent: 'center',
        opacity: inP * (1 - outP),
        transform: `translateY(${(1 - inP) * 16}px)`,
      }}
    >
      <div
        style={{
          maxWidth: 820,
          padding: '14px 28px 16px',
          borderRadius: 24,
          background: 'rgba(6,26,20,0.82)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 40,
          lineHeight: 1.25,
          textAlign: 'center',
          color: '#F4F1EA',
        }}
      >
        {words.map((w, i) => {
          const start = cue.from + (acc / total) * span;
          acc += w.length + 1;
          const end = cue.from + (acc / total) * span;
          const active = f >= start && f < end + 2;
          return (
            <span key={i} style={{color: active ? '#E6C46E' : undefined}}>
              {w}
              {i < words.length - 1 ? ' ' : ''}
            </span>
          );
        })}
      </div>
    </div>
  );
};
