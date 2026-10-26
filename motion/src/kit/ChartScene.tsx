import React from 'react';
import {useCurrentFrame} from 'remotion';
import {EASE_IN_OUT, spr, tw} from '../anim';
import {Illustrative} from '../components/UI';
import {C, SANS} from '../theme';
import {Card, Fill, Headline, SceneBase, SceneBg, cueAt, isDark} from './common';

const COLORS = {gold: C.gold, green: C.green, soft: '#C9DACF', coral: C.coral, ink: C.ink, blue: '#3E6B8A'};
type Tone = keyof typeof COLORS;

export type Series = {name: string; values: number[]; kind: 'bar' | 'line'; tone: Tone; dashed?: boolean; cue?: number};

type Props = SceneBase & {
  headline?: string[];
  title: string;
  labels: string[];
  series: Series[];
  /** valores em R$ mil */
  yMax?: number;
  yMin?: number;
  threshold?: {value: number; label: string; cue?: number};
  highlight?: {series: number; index: number; label: string; cue?: number; tone?: Tone};
  zeroLine?: boolean;
  unit?: string;
};

const CW = 880;
const CH = 470;

export const ChartScene: React.FC<Props> = ({dur, cues, bg = 'ivory', headline, title, labels, series, yMax, yMin = 0, threshold, highlight, zeroLine, unit = 'R$ mil'}) => {
  const f = useCurrentFrame();
  const dark = isDark(bg);
  const s0 = Math.max(4, cueAt(cues, 0, 10) - 6);
  const enter = spr(f, s0 - 4, {damping: 18, stiffness: 120});
  const all = series.flatMap((s) => s.values);
  const max = yMax ?? Math.ceil(Math.max(...all) * 1.15);
  const min = yMin;
  const y = (v: number) => CH - ((v - min) / (max - min)) * CH;
  const n = labels.length;
  const colW = CW / n;
  const bars = series.filter((s) => s.kind === 'bar');
  const bw = Math.min(46, (colW * 0.62) / Math.max(1, bars.length));
  const push = tw(f, 0, dur, 1, 1.035);

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
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div style={{fontSize: 34, fontWeight: 800, color: C.ink}}>{title}</div>
            <div style={{fontSize: 20, fontWeight: 700, color: C.muted}}>{unit}</div>
          </div>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: 20, marginTop: 14, fontSize: 21, fontWeight: 700, color: C.muted}}>
            {series.map((s) => (
              <div key={s.name} style={{display: 'flex', alignItems: 'center', gap: 8}}>
                <div
                  style={{
                    width: s.kind === 'bar' ? 16 : 26,
                    height: s.kind === 'bar' ? 16 : 6,
                    borderRadius: 4,
                    background: COLORS[s.tone],
                    opacity: s.dashed ? 0.7 : 1,
                  }}
                />
                {s.name}
              </div>
            ))}
          </div>
          <svg width={CW} height={CH + 60} style={{marginTop: 40, overflow: 'visible'}}>
            {[0, 1, 2, 3, 4].map((k) => {
              const v = min + ((max - min) * k) / 4;
              return (
                <g key={k}>
                  <line x1={0} x2={CW} y1={y(v)} y2={y(v)} stroke={C.line} strokeWidth={2} />
                  <text x={-10} y={y(v) + 7} textAnchor="end" fontSize={18} fill={C.muted} fontFamily={SANS} fontWeight={600}>
                    {Math.round(v)}
                  </text>
                </g>
              );
            })}
            {zeroLine && min < 0 && <line x1={0} x2={CW} y1={y(0)} y2={y(0)} stroke={C.ink} strokeWidth={3} opacity={0.5} />}
            {labels.map((l, i) => (
              <text key={l} x={i * colW + colW / 2} y={CH + 44} textAnchor="middle" fontSize={22} fontWeight={700} fill={C.muted} fontFamily={SANS}>
                {l}
              </text>
            ))}
            {bars.map((s, si) => {
              const at = s.cue !== undefined ? cueAt(cues, s.cue, s0) : s0;
              return s.values.map((v, i) => {
                const p = spr(f, at + i * 2 + si * 3, {damping: 15, stiffness: 140});
                const x = i * colW + colW / 2 - (bars.length * bw + (bars.length - 1) * 6) / 2 + si * (bw + 6);
                const h = Math.abs(y(v) - y(Math.max(0, min))) * p;
                const top = v >= 0 ? y(Math.max(0, min)) - h : y(Math.max(0, min));
                return <rect key={`${si}-${i}`} x={x} y={top} width={bw} height={h} rx={9} fill={COLORS[s.tone]} />;
              });
            })}
            {threshold && (() => {
              const at = threshold.cue !== undefined ? cueAt(cues, threshold.cue, s0 + 20) : s0 + 20;
              const p = tw(f, at, at + 18, 0, 1, EASE_IN_OUT);
              return (
                <g opacity={p}>
                  <line x1={0} x2={CW * p} y1={y(threshold.value)} y2={y(threshold.value)} stroke={C.coral} strokeWidth={4} strokeDasharray="14 10" />
                  <rect x={CW - 300} y={y(threshold.value) - 52} width={300} height={40} rx={20} fill={C.coral} />
                  <text x={CW - 150} y={y(threshold.value) - 25} textAnchor="middle" fontSize={20} fontWeight={800} fill="#fff" fontFamily={SANS}>
                    {threshold.label}
                  </text>
                </g>
              );
            })()}
            {series.map((s, si) => {
              if (s.kind !== 'line') return null;
              const at = s.cue !== undefined ? cueAt(cues, s.cue, s0 + 10) : s0 + 10;
              const draw = tw(f, at, at + 30, 0, 1, EASE_IN_OUT);
              const pts = s.values.map((v, i) => [i * colW + colW / 2, y(v)]);
              const d = pts.map((p, i) => `${i ? 'L' : 'M'} ${p[0]} ${p[1]}`).join(' ');
              return (
                <g key={si}>
                  <path
                    d={d}
                    fill="none"
                    stroke={COLORS[s.tone]}
                    strokeWidth={7}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    pathLength={1}
                    strokeDasharray={s.dashed ? undefined : '1 1'}
                    strokeDashoffset={s.dashed ? undefined : 1 - draw}
                    opacity={s.dashed ? draw : 1}
                    style={s.dashed ? {strokeDasharray: '16 12'} : undefined}
                  />
                  {pts.map((p, i) => {
                    const dp = tw(f, at + (i / pts.length) * 30, at + (i / pts.length) * 30 + 6, 0, 1);
                    return <circle key={i} cx={p[0]} cy={p[1]} r={10 * dp} fill={C.paper} stroke={COLORS[s.tone]} strokeWidth={5} />;
                  })}
                </g>
              );
            })}
            {highlight && (() => {
              const s = series[highlight.series];
              const at = highlight.cue !== undefined ? cueAt(cues, highlight.cue, s0 + 40) : s0 + 40;
              const p = spr(f, at, {damping: 11, stiffness: 200});
              const x = highlight.index * colW + colW / 2;
              const yy = y(s.values[highlight.index]);
              const w = Math.max(180, highlight.label.length * 15 + 40);
              const left = Math.min(CW - w, Math.max(0, x - w / 2));
              const col = COLORS[highlight.tone ?? 'green'];
              return (
                <g opacity={Math.min(1, p)}>
                  <circle cx={x} cy={yy} r={26 * p} fill="none" stroke={col} strokeWidth={4} />
                  <g transform={`translate(${left} ${yy - 92}) scale(${p})`} style={{transformOrigin: `${w / 2}px 60px`}}>
                    <rect width={w} height={56} rx={28} fill={col} />
                    <text x={w / 2} y={37} textAnchor="middle" fontSize={25} fontWeight={800} fill={highlight.tone === 'gold' ? C.greenInk : C.goldLight} fontFamily={SANS}>
                      {highlight.label}
                    </text>
                  </g>
                </g>
              );
            })()}
          </svg>
          <Illustrative style={{position: 'absolute', left: 40, bottom: 26, fontSize: 17}} />
        </Card>
      </Fill>
    </Fill>
  );
};

