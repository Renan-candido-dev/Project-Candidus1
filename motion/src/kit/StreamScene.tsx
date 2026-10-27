import React from 'react';
import {interpolateColors, useCurrentFrame} from 'remotion';
import {EASE_IN_OUT, brl, spr, tw, wobble} from '../anim';
import {GreenBg} from '../components/Backgrounds';
import {Sfx} from '../components/UI';
import {C, SANS} from '../theme';
import {Fill, Headline, SceneBase, cueAt} from './common';

type Chip = {l: string; v: string; in: boolean};

const DEFAULT_CHIPS: Chip[] = [
  {l: 'Venda', v: '+ R$ 1.280', in: true},
  {l: 'Boleto', v: '- R$ 2.350', in: false},
  {l: 'Pix', v: '+ R$ 640', in: true},
  {l: 'Aluguel', v: '- R$ 4.800', in: false},
  {l: 'Taxa', v: '- R$ 89', in: false},
  {l: 'Fornecedor', v: '- R$ 3.480', in: false},
  {l: 'Venda', v: '+ R$ 389', in: true},
  {l: 'Imposto', v: '- R$ 1.912', in: false},
  {l: 'Assinatura', v: '- R$ 129', in: false},
  {l: 'Pix', v: '+ R$ 215', in: true},
];

type Props = SceneBase & {
  headline?: string[];
  panel?: {label: string; from: number; to: number};
  alerts?: {t: string; cue?: number}[];
  chips?: Chip[];
};

const ALERT_POS = [
  {x: 90, y: 600},
  {x: 590, y: 590},
  {x: 640, y: 1150},
  {x: 110, y: 1160},
];

/** Movimento financeiro caótico: faixas de entradas e saídas, saldo caindo e alertas. */
export const StreamScene: React.FC<Props> = ({dur, cues, headline, panel, alerts = [], chips = DEFAULT_CHIPS}) => {
  const f = useCurrentFrame();
  const s0 = Math.max(2, cueAt(cues, 0, 8) - 6);
  const shake = tw(f, 10, dur, 1.5, 6);
  const zoom = tw(f, 0, dur, 1.03, 1.12, EASE_IN_OUT);
  const enter = spr(f, s0, {damping: 18, stiffness: 140});
  const v = panel ? tw(f, s0 + 4, dur - 10, panel.from, panel.to, EASE_IN_OUT) : 0;
  const color = panel ? interpolateColors(v, [Math.min(0, panel.to), Math.max(panel.from * 0.4, 1)], ['#F08A74', '#F4F1EA']) : C.ivory;
  const draw = tw(f, s0 + 4, dur - 10, 0, 1, EASE_IN_OUT);
  const pts = [
    [0, 40], [60, 70], [110, 30], [170, 95], [220, 80], [280, 150], [330, 120], [390, 190], [450, 170], [510, 235], [560, 215], [620, 280], [680, 300],
  ];
  const d = pts.map((p, i) => `${i ? 'L' : 'M'} ${p[0]} ${p[1]}`).join(' ');

  return (
    <Fill style={{background: C.night}}>
      <Fill style={{transform: `translate(${wobble(f, 11, 1.3) * shake}px, ${wobble(f, 12, 1.1) * shake}px) rotate(${wobble(f, 13, 0.3) * 0.5}deg) scale(${zoom})`}}>
        <GreenBg />
        {Array.from({length: 9}).map((_, lane) => {
          const dir = lane % 2 ? 1 : -1;
          const speed = 7 + (lane * 5) % 9;
          const depth = lane % 3 === 1 ? 0.78 : 1;
          const offset = ((f * speed * dir) % 1400) - 700 - lane * 170;
          return (
            <div
              key={lane}
              style={{
                position: 'absolute',
                top: 170 + lane * 190,
                left: 0,
                display: 'flex',
                gap: 28,
                transform: `translateX(${offset}px) scale(${depth})`,
                filter: depth < 1 ? 'blur(3px)' : undefined,
                opacity: depth < 1 ? 0.4 : 0.8,
              }}
            >
              {Array.from({length: 9}).map((__, k) => {
                const c = chips[(lane * 3 + k) % chips.length];
                return (
                  <div
                    key={k}
                    style={{
                      display: 'inline-flex',
                      gap: 14,
                      padding: '16px 26px',
                      borderRadius: 999,
                      background: c.in ? 'rgba(201,162,74,0.16)' : 'rgba(212,100,79,0.16)',
                      border: `2px solid ${c.in ? 'rgba(235,208,138,0.45)' : 'rgba(232,144,124,0.45)'}`,
                      fontFamily: SANS,
                      fontSize: 30,
                      fontWeight: 700,
                      color: c.in ? C.goldLight : '#F0A693',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <span style={{opacity: 0.75, fontWeight: 600}}>{c.l}</span>
                    {c.v}
                  </div>
                );
              })}
            </div>
          );
        })}
        {panel && (
          <div
            style={{
              position: 'absolute',
              left: 110,
              top: 660,
              width: 860,
              height: 480,
              borderRadius: 44,
              background: 'linear-gradient(160deg, rgba(20,70,54,0.88), rgba(6,26,20,0.94))',
              border: '2px solid rgba(235,208,138,0.18)',
              boxShadow: '0 40px 80px rgba(0,0,0,0.45)',
              transform: `scale(${0.88 + 0.12 * enter})`,
              opacity: enter,
              padding: '44px 54px',
              fontFamily: SANS,
            }}
          >
            <div style={{fontSize: 26, fontWeight: 700, letterSpacing: '0.26em', color: C.goldLight}}>{panel.label.toUpperCase()}</div>
            <div style={{fontSize: 104, fontWeight: 800, color, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums', marginTop: 4}}>{brl(v, 0)}</div>
            <svg width={752} height={280} viewBox="0 -20 680 340" style={{position: 'absolute', left: 54, bottom: 26}}>
              <defs>
                <clipPath id="ss-reveal">
                  <rect x={-10} y={-40} width={700 * draw} height={400} />
                </clipPath>
              </defs>
              <path d={`${d} L 680 320 L 0 320 Z`} fill="rgba(240,138,116,0.18)" clipPath="url(#ss-reveal)" />
              <path d={d} fill="none" stroke="#F08A74" strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" clipPath="url(#ss-reveal)" />
            </svg>
          </div>
        )}
        {alerts.map((a, i) => {
          const at = a.cue !== undefined ? cueAt(cues, a.cue, s0 + 20 + i * 12) + 6 : s0 + 20 + i * 12;
          const p = spr(f, at, {damping: 10, stiffness: 220});
          const pos = ALERT_POS[i % ALERT_POS.length];
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: pos.x,
                top: pos.y,
                transform: `scale(${p}) rotate(${(i % 2 ? 1 : -1) * 4}deg)`,
                opacity: f < at ? 0 : 1,
                padding: '14px 26px',
                borderRadius: 18,
                background: C.coral,
                color: '#fff',
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: 32,
                boxShadow: '0 16px 40px rgba(212,100,79,0.45)',
              }}
            >
              ! {a.t}
              <Sfx name="error" at={at} volume={0.3} />
            </div>
          );
        })}
      </Fill>
      {headline && (
        <Fill style={{background: 'linear-gradient(180deg, rgba(3,13,10,0.85) 0%, rgba(3,13,10,0) 30%)'}}>
          <Headline lines={headline} at={s0} dark size={84} top={240} />
        </Fill>
      )}
    </Fill>
  );
};
