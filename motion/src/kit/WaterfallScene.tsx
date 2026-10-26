import React from 'react';
import {useCurrentFrame} from 'remotion';
import {EASE_OUT, brl, spr, tw} from '../anim';
import {Illustrative} from '../components/UI';
import {C, SANS} from '../theme';
import {Card, Fill, Headline, SceneBase, SceneBg, cueAt, isDark} from './common';

export type Step = {label: string; v: number; kind?: 'start' | 'delta' | 'total'; cue?: number};

type Props = SceneBase & {
  headline?: string[];
  title: string;
  steps: Step[];
  note?: string;
};

const CW = 880;
const CH = 500;

/** Cascata: parte de um valor e mostra, degrau a degrau, o que sobra. */
export const WaterfallScene: React.FC<Props> = ({dur, cues, bg = 'ivory', headline, title, steps, note}) => {
  const f = useCurrentFrame();
  const dark = isDark(bg);
  const s0 = Math.max(4, cueAt(cues, 0, 10) - 6);
  const enter = spr(f, s0 - 4, {damping: 18, stiffness: 120});
  const push = tw(f, 0, dur, 1, 1.035);

  // níveis acumulados
  let run = 0;
  const bars = steps.map((s) => {
    const kind = s.kind ?? 'delta';
    let a = 0;
    let b = 0;
    if (kind === 'start') (a = 0), (b = s.v), (run = s.v);
    else if (kind === 'total') (a = 0), (b = run);
    else (a = run), (b = run + s.v), (run += s.v);
    return {...s, kind, a, b, value: kind === 'total' ? run : s.v};
  });
  const max = Math.max(...bars.map((b) => Math.max(b.a, b.b))) * 1.12;
  const min = Math.min(0, ...bars.map((b) => Math.min(b.a, b.b))) * 1.12;
  const y = (v: number) => CH - ((v - min) / (max - min)) * CH;
  const colW = CW / steps.length;
  const bw = Math.min(110, colW * 0.62);

  return (
    <Fill>
      <SceneBg bg={bg} drift={dur} />
      <Fill style={{transform: `scale(${push})`}}>
        {headline && <Headline lines={headline} at={s0} dark={dark} size={84} top={250} />}
        <Card
          style={{
            position: 'absolute',
            left: 60,
            width: 960,
            top: headline ? 560 : 360,
            height: 800,
            padding: '36px 40px',
            transform: `translateY(${(1 - enter) * 90}px) scale(${0.94 + 0.06 * enter})`,
            opacity: enter,
          }}
        >
          <div style={{fontSize: 34, fontWeight: 800, color: C.ink}}>{title}</div>
          <svg width={CW} height={CH + 90} style={{marginTop: 70, overflow: 'visible'}}>
            {min < 0 && <line x1={0} x2={CW} y1={y(0)} y2={y(0)} stroke={C.ink} strokeWidth={2} opacity={0.4} />}
            <line x1={0} x2={CW} y1={y(min)} y2={y(min)} stroke={C.line} strokeWidth={2} />
            {bars.map((b, i) => {
              const same = bars.slice(0, i).filter((o) => o.cue !== undefined && o.cue === b.cue).length;
              const at = b.cue !== undefined ? cueAt(cues, b.cue, s0 + i * 10) + same * 12 : s0 + 6 + i * 10;
              const p = spr(f, at, {damping: 16, stiffness: 150});
              const x = i * colW + (colW - bw) / 2;
              const lo = Math.min(b.a, b.b);
              const hi = Math.max(b.a, b.b);
              const neg = b.b < b.a;
              const fill =
                b.kind === 'start' ? C.green : b.kind === 'total' ? (b.b >= 0 ? C.gold : C.coral) : neg ? C.coral : C.greenMid;
              // cresce a partir do nível anterior (degraus) ou da base (início/total)
              const from = b.kind === 'delta' ? b.a : 0;
              const cur = from + (b.b - from) * p;
              const top = y(Math.max(from, cur));
              const h = Math.abs(y(from) - y(cur));
              const lp = tw(f, at + 8, at + 18, 0, 1);
              const next = bars[i + 1];
              return (
                <g key={i}>
                  {next && (
                    <line
                      x1={x + bw}
                      x2={x + colW}
                      y1={y(b.kind === 'total' ? b.b : b.b)}
                      y2={y(b.kind === 'total' ? b.b : b.b)}
                      stroke={C.muted}
                      strokeWidth={2}
                      strokeDasharray="6 6"
                      opacity={lp * 0.6}
                    />
                  )}
                  <rect x={x} y={top} width={bw} height={Math.max(h, p > 0 ? 2 : 0)} rx={10} fill={fill} />
                  <text
                    x={x + bw / 2}
                    y={(neg ? y(lo) + 34 : y(hi) - 14)}
                    textAnchor="middle"
                    fontSize={23}
                    fontWeight={800}
                    fill={neg ? C.coral : b.kind === 'total' ? C.goldDeep : C.ink}
                    fontFamily={SANS}
                    opacity={lp}
                  >
                    {b.kind === 'delta' && b.v > 0 ? '+' : ''}
                    {brl(b.value, 0).replace('R$ ', 'R$')}
                  </text>
                  <foreignObject x={i * colW + 2} y={y(min) + 14} width={colW - 4} height={80}>
                    <div
                      style={{
                        fontFamily: SANS,
                        fontSize: 21,
                        fontWeight: 700,
                        color: b.kind === 'total' ? C.ink : C.muted,
                        textAlign: 'center',
                        lineHeight: 1.15,
                        opacity: lp,
                      }}
                    >
                      {b.label}
                    </div>
                  </foreignObject>
                </g>
              );
            })}
          </svg>
          {note && (
            <div style={{fontSize: 22, fontWeight: 600, color: C.muted, marginTop: 6, opacity: tw(f, s0 + 30, s0 + 44, 0, 1, EASE_OUT)}}>{note}</div>
          )}
          <Illustrative style={{position: 'absolute', left: 40, bottom: 26, fontSize: 17}} />
        </Card>
      </Fill>
    </Fill>
  );
};
