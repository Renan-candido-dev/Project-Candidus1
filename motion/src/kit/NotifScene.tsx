import React from 'react';
import {useCurrentFrame} from 'remotion';
import {spr, tw, wobble} from '../anim';
import {Notif, Sfx, Tone} from '../components/UI';
import {C} from '../theme';
import {Fill, Headline, SceneBase, SceneBg, cueAt, isDark} from './common';
import {Icon} from './icons';

type N = {title: string; sub: string; amount: string; tone: Tone};

type Props = SceneBase & {
  headline: string[];
  items: N[];
  /** elemento central: ícone (ex.: 'store', 'card') */
  center?: string;
  /** dispara as notificações a partir da fala k */
  fromCue?: number;
};

// posições em volta do centro (alternando lados), da mais próxima ao topo para baixo
const SLOTS = [
  {x: 40, y: 560, s: 1},
  {x: 560, y: 640, s: 1},
  {x: 30, y: 800, s: 0.92},
  {x: 580, y: 880, s: 0.92},
  {x: 60, y: 1040, s: 1},
  {x: 550, y: 1110, s: 1},
  {x: 40, y: 1260, s: 0.9},
  {x: 570, y: 1290, s: 0.9},
  {x: 290, y: 960, s: 1.02},
];

/** Rajada de notificações financeiras em volta de um elemento central. */
export const NotifScene: React.FC<Props> = ({dur, cues, bg = 'ivory', headline, items, center = 'store', fromCue = 0}) => {
  const f = useCurrentFrame();
  const dark = isDark(bg);
  const s0 = Math.max(2, cueAt(cues, 0, 8) - 6);
  const start = cueAt(cues, fromCue, s0 + 8);
  const span = Math.max(30, dur - start - 30);
  const cam = tw(f, 0, dur, 1, 1.07);
  const shake = tw(f, start + span * 0.5, dur, 0, 3);
  const cp = spr(f, s0, {damping: 13, stiffness: 120});

  return (
    <Fill>
      <SceneBg bg={bg} drift={dur} />
      <Fill style={{transform: `scale(${cam}) translate(${wobble(f, 1, 0.9) * shake}px, ${wobble(f, 2, 1.1) * shake}px)`, transformOrigin: '50% 60%'}}>
        <div
          style={{
            position: 'absolute',
            left: 540 - 170,
            top: 930 - 170,
            width: 340,
            height: 340,
            borderRadius: 170,
            background: C.green,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 40px 80px rgba(6,26,20,0.3)',
            transform: `scale(${cp})`,
          }}
        >
          <Icon name={center} size={180} p={tw(f, s0, s0 + 30, 0, 1)} color="#E6C46E" width={1.4} />
        </div>
        {items.slice(0, SLOTS.length).map((n, i) => {
          // chegam cada vez mais rápido
          const t = Math.pow(i / Math.max(1, items.length - 1), 0.75);
          const at = start + t * span * 0.75;
          const p = spr(f, at, {damping: 15, stiffness: 190});
          const slot = SLOTS[i];
          const dx = slot.x < 300 ? -460 : slot.x > 400 ? 460 : 0;
          const dy = dx === 0 ? 420 : 0;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: slot.x,
                top: slot.y,
                opacity: f < at ? 0 : Math.min(1, p * 1.4),
                transform: `translate(${dx * (1 - p)}px, ${dy * (1 - p) + wobble(f, i + 3, 0.09) * 7}px) scale(${slot.s}) rotate(${(1 - p) * Math.sign(dx) * 6}deg)`,
                filter: `blur(${tw(f, at, at + 8, 14, 0)}px)`,
              }}
            >
              <Notif {...n} />
              <Sfx name={i % 2 ? 'ping-low' : 'ping'} at={at + 2} volume={n.tone === 'alert' ? 0.2 : 0.14} />
            </div>
          );
        })}
        <Headline lines={headline} at={s0} dark={dark} size={92} top={250} />
      </Fill>
    </Fill>
  );
};
