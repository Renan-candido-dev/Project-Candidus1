import React from 'react';
import {useCurrentFrame} from 'remotion';
import {EASE_IN_OUT, brl, spr, tw} from '../anim';
import {Illustrative} from '../components/UI';
import {C} from '../theme';
import {Card, Fill, Headline, SceneBase, SceneBg, cueAt, isDark} from './common';

type Ev = {day: number; label: string; v: number};

type Props = SceneBase & {
  headline?: string[];
  month: string;
  days?: number;
  /** dia da semana do dia 1 (0 = segunda) */
  firstWeekday?: number;
  start: number;
  events: Ev[];
  /** reorganização: eventos (índices) que mudam de dia numa fala */
  fix?: {cue: number; moves: {i: number; to: number}[]};
  eventsCue?: number;
};

const WD = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];

const balances = (start: number, events: Ev[], days: number) => {
  const out: number[] = [];
  let b = start;
  for (let d = 1; d <= days; d++) {
    b += events.filter((e) => e.day === d).reduce((s, e) => s + e.v, 0);
    out.push(b);
  }
  return out;
};

export const CalendarScene: React.FC<Props> = ({dur, cues, bg = 'ivory', headline, month, days = 30, firstWeekday = 0, start, events, fix, eventsCue = 0}) => {
  const f = useCurrentFrame();
  const dark = isDark(bg);
  const s0 = Math.max(4, cueAt(cues, 0, 10) - 6);
  const evAt = cueAt(cues, eventsCue, s0 + 10);
  const enter = spr(f, s0 - 4, {damping: 18, stiffness: 120});
  const push = tw(f, 0, dur, 1, 1.03);
  const fixAt = fix ? cueAt(cues, fix.cue, s0 + 80) : -1;
  const fp = fix ? tw(f, fixAt, fixAt + 20, 0, 1, EASE_IN_OUT) : 0;

  const moved = events.map((e, i) => {
    const m = fix?.moves.find((mv) => mv.i === i);
    return m ? {...e, day: m.to} : e;
  });
  const before = balances(start, events, days);
  const after = balances(start, moved, days);
  const minAll = Math.min(0, ...before, ...after);
  const maxAll = Math.max(...before, ...after);
  const GW = 880;
  const GH = 180;
  const x = (d: number) => ((d - 0.5) / days) * GW;
  const y = (v: number) => GH - ((v - minAll) / (maxAll - minAll)) * GH;
  const path = (arr: number[]) => arr.map((v, i) => `${i ? 'L' : 'M'} ${x(i + 1)} ${y(v)}`).join(' ');
  const lineDraw = tw(f, evAt + events.length * 4, evAt + events.length * 4 + 30, 0, 1, EASE_IN_OUT);
  const firstNeg = before.findIndex((v) => v < 0);
  const negP = tw(f, evAt + events.length * 4 + 26, evAt + events.length * 4 + 36, 0, 1);

  const cell = 128;
  const rowH = 66;

  return (
    <Fill>
      <SceneBg bg={bg} drift={dur} />
      <Fill style={{transform: `scale(${push})`}}>
        {headline && <Headline lines={headline} at={s0} dark={dark} size={80} top={250} />}
        <Card
          style={{
            position: 'absolute',
            left: 60,
            width: 960,
            top: headline ? 540 : 400,
            padding: '30px 40px 24px',
            transform: `translateY(${(1 - enter) * 90}px) scale(${0.94 + 0.06 * enter})`,
            opacity: enter,
          }}
        >
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
            <div style={{fontSize: 34, fontWeight: 800, color: C.ink}}>{month}</div>
            <div style={{fontSize: 22, fontWeight: 700, color: C.muted}}>Saldo inicial {brl(start, 0)}</div>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: `repeat(7, ${cell}px)`, marginTop: 14}}>
            {WD.map((d, i) => (
              <div key={i} style={{textAlign: 'center', fontSize: 20, fontWeight: 800, color: C.muted, paddingBottom: 6}}>
                {d}
              </div>
            ))}
            {Array.from({length: firstWeekday}).map((_, i) => (
              <div key={`e${i}`} />
            ))}
            {Array.from({length: days}).map((_, i) => {
              const d = i + 1;
              const evs = events.map((e, k) => ({e, k})).filter(({e, k}) => {
                const m = fix?.moves.find((mv) => mv.i === k);
                const day = m && fp > 0.5 ? m.to : e.day;
                return day === d;
              });
              const neg = before[i] < 0 && fp < 0.5;
              return (
                <div
                  key={d}
                  style={{
                    height: rowH,
                    margin: 3,
                    borderRadius: 14,
                    background: neg && negP > 0 ? `rgba(212,100,79,${0.12 * negP})` : '#F6F4EF',
                    padding: '6px 8px',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{fontSize: 18, fontWeight: 700, color: C.muted}}>{d}</div>
                  {evs.map(({e, k}) => {
                    const p = spr(f, evAt + k * 4, {damping: 13, stiffness: 200});
                    const m = fix?.moves.find((mv) => mv.i === k);
                    const flash = m ? 1 - Math.abs(fp - 0.5) * 2 : 0;
                    return (
                      <div
                        key={k}
                        style={{
                          marginTop: 2,
                          padding: '3px 6px',
                          borderRadius: 8,
                          fontSize: 17,
                          fontWeight: 800,
                          color: '#fff',
                          background: e.v < 0 ? C.coral : C.greenMid,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          transform: `scale(${p * (1 + flash * 0.2)})`,
                          opacity: Math.min(1, p) * (m ? 1 - flash * 0.8 : 1),
                          boxShadow: m && fp > 0.5 ? `0 0 0 3px ${C.gold}` : undefined,
                        }}
                      >
                        {e.label}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </Card>
        <Card
          style={{
            position: 'absolute',
            left: 60,
            width: 960,
            top: headline ? 1080 : 940,
            padding: '24px 40px 20px',
            opacity: tw(f, evAt + 10, evAt + 22, 0, 1),
          }}
        >
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
            <div style={{fontSize: 26, fontWeight: 800, color: C.ink}}>Saldo dia a dia</div>
            {firstNeg >= 0 && (
              <div style={{fontSize: 22, fontWeight: 800, color: fp > 0.5 ? C.greenMid : C.coral, opacity: negP}}>
                {fp > 0.5 ? 'Sem dias negativos ✓' : `Fica negativo no dia ${firstNeg + 1}`}
              </div>
            )}
          </div>
          <svg width={GW} height={GH + 10} style={{marginTop: 10, overflow: 'visible'}}>
            <line x1={0} x2={GW} y1={y(0)} y2={y(0)} stroke={C.ink} strokeWidth={2} opacity={0.35} />
            <path
              d={path(before)}
              fill="none"
              stroke={fp > 0 ? '#B9C3BE' : C.coral}
              strokeWidth={6}
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={1 - lineDraw}
              opacity={1 - fp * 0.5}
            />
            {fix && (
              <path
                d={path(after)}
                fill="none"
                stroke={C.green}
                strokeWidth={7}
                strokeLinejoin="round"
                pathLength={1}
                strokeDasharray="1 1"
                strokeDashoffset={1 - tw(f, fixAt + 10, fixAt + 40, 0, 1, EASE_IN_OUT)}
              />
            )}
            {firstNeg >= 0 && <circle cx={x(firstNeg + 1)} cy={y(before[firstNeg])} r={14 * negP * (1 - fp)} fill={C.coral} />}
          </svg>
          <Illustrative style={{marginTop: 6, fontSize: 16}} />
        </Card>
      </Fill>
    </Fill>
  );
};

