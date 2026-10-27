import React from 'react';
import {useCurrentFrame} from 'remotion';
import {EASE_IN_OUT, EASE_OUT, brl, spr, tw} from '../anim';
import {Check, Illustrative} from '../components/UI';
import {C, SANS} from '../theme';
import {Card, Fill, Headline, SceneBase, SceneBg, cueAt, isDark} from './common';
import {catColor} from './LedgerScene';

type Kpi = {label: string; v: number; money?: boolean; suffix?: string; delta?: string; good?: boolean};
type Section =
  | {kind: 'kpis'; items: Kpi[]; cue?: number}
  | {kind: 'cats'; title: string; items: {label: string; v: number}[]; cue?: number}
  | {kind: 'open'; title: string; items: {label: string; date: string; v: number}[]; cue?: number}
  | {kind: 'projection'; title: string; values: number[]; labels: string[]; cue?: number}
  | {kind: 'ring'; label: string; value: number; sub: string; cue?: number};

type Props = SceneBase & {
  headline?: string[];
  title: string;
  period?: string;
  sections: Section[];
};

const W = 960;

const fmtK = (v: number) => `R$ ${(v / 1000).toFixed(1).replace('.', ',')} mil`;

/** Painel/relatório gerencial composto por seções que entram junto com a fala. */
export const ReportScene: React.FC<Props> = ({dur, cues, bg = 'ivory', headline, title, period, sections}) => {
  const f = useCurrentFrame();
  const dark = isDark(bg);
  const s0 = Math.max(4, cueAt(cues, 0, 10) - 6);
  const enter = spr(f, s0 - 4, {damping: 18, stiffness: 120});
  const push = tw(f, 0, dur, 1, 1.03);
  const secAt = sections.map((s, i) => (s.cue !== undefined ? cueAt(cues, s.cue, s0 + 10 + i * 16) : s0 + 10 + i * 16));

  const renderSection = (s: Section, i: number) => {
    const at = secAt[i];
    const p = spr(f, at, {damping: 16, stiffness: 150});
    const wrap: React.CSSProperties = {
      marginTop: 22,
      transform: `translateY(${(1 - p) * 60}px)`,
      opacity: Math.min(1, p),
    };
    if (s.kind === 'kpis') {
      return (
        <div key={i} style={{...wrap, display: 'flex', gap: 14}}>
          {s.items.map((k, j) => {
            const v = tw(f, at + j * 3, at + 26 + j * 3, 0, k.v, EASE_OUT);
            return (
              <div key={j} style={{flex: 1, padding: '18px 20px', borderRadius: 26, background: '#F4F6F4'}}>
                <div style={{fontSize: 20, fontWeight: 700, color: C.muted, whiteSpace: 'nowrap'}}>{k.label}</div>
                <div style={{fontSize: 34, fontWeight: 800, color: k.v < 0 ? C.coral : C.ink, fontVariantNumeric: 'tabular-nums', marginTop: 4, whiteSpace: 'nowrap'}}>
                  {k.money ? fmtK(v) : `${v.toFixed(1).replace('.', ',').replace(',0', '')}${k.suffix ?? ''}`}
                </div>
                {k.delta && (
                  <div
                    style={{
                      display: 'inline-block',
                      marginTop: 8,
                      padding: '3px 10px',
                      borderRadius: 999,
                      fontSize: 17,
                      fontWeight: 800,
                      background: k.good === false ? C.coralSoft : '#E1EEE6',
                      color: k.good === false ? C.coral : C.greenMid,
                    }}
                  >
                    {k.delta}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    }
    if (s.kind === 'cats') {
      const max = Math.max(...s.items.map((x) => Math.abs(x.v)));
      return (
        <div key={i} style={wrap}>
          <div style={{fontSize: 24, fontWeight: 800, color: C.ink, marginBottom: 10}}>{s.title}</div>
          {s.items.map((c, j) => {
            const w = tw(f, at + 4 + j * 3, at + 24 + j * 3, 0, Math.abs(c.v) / max, EASE_OUT);
            const col = catColor(c.label);
            return (
              <div key={j} style={{display: 'flex', alignItems: 'center', gap: 14, height: 44}}>
                <div style={{width: 210, fontSize: 21, fontWeight: 700, color: C.ink, whiteSpace: 'nowrap'}}>{c.label}</div>
                <div style={{flex: 1, height: 20, borderRadius: 10, background: '#F0F2F0'}}>
                  <div style={{width: `${w * 100}%`, height: '100%', borderRadius: 10, background: col.c}} />
                </div>
                <div style={{width: 150, textAlign: 'right', fontSize: 21, fontWeight: 800, color: C.ink, fontVariantNumeric: 'tabular-nums'}}>
                  {brl(Math.abs(c.v), 0)}
                </div>
              </div>
            );
          })}
        </div>
      );
    }
    if (s.kind === 'open') {
      return (
        <div key={i} style={wrap}>
          <div style={{fontSize: 24, fontWeight: 800, color: C.ink, marginBottom: 6}}>{s.title}</div>
          {s.items.map((o, j) => {
            const op = tw(f, at + 4 + j * 4, at + 14 + j * 4, 0, 1);
            return (
              <div key={j} style={{display: 'flex', alignItems: 'center', gap: 14, height: 50, borderTop: `2px solid ${C.line}`, opacity: op, fontSize: 22}}>
                <div style={{width: 80, fontWeight: 700, color: C.muted}}>{o.date}</div>
                <div style={{flex: 1, fontWeight: 700, color: C.ink}}>{o.label}</div>
                <div style={{fontWeight: 800, color: o.v < 0 ? C.coral : C.greenMid, fontVariantNumeric: 'tabular-nums'}}>
                  {o.v > 0 ? '+' : ''}
                  {brl(o.v, 0)}
                </div>
              </div>
            );
          })}
        </div>
      );
    }
    if (s.kind === 'projection') {
      const GW = W - 80;
      const GH = 150;
      const max = Math.max(...s.values) * 1.15;
      const min = Math.min(0, ...s.values);
      const x = (k: number) => (k / (s.values.length - 1)) * (GW - 40) + 20;
      const y = (v: number) => GH - ((v - min) / (max - min)) * GH;
      const d = s.values.map((v, k) => `${k ? 'L' : 'M'} ${x(k)} ${y(v)}`).join(' ');
      const draw = tw(f, at + 4, at + 30, 0, 1, EASE_IN_OUT);
      return (
        <div key={i} style={wrap}>
          <div style={{fontSize: 24, fontWeight: 800, color: C.ink}}>{s.title}</div>
          <svg width={GW} height={GH + 40} style={{marginTop: 10, overflow: 'visible'}}>
            {min < 0 && <line x1={0} x2={GW} y1={y(0)} y2={y(0)} stroke={C.ink} strokeWidth={2} opacity={0.3} />}
            <path d={`${d} L ${x(s.values.length - 1)} ${GH} L ${x(0)} ${GH} Z`} fill="rgba(201,162,74,0.14)" opacity={draw} />
            <path d={d} fill="none" stroke={C.gold} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - draw} />
            {s.labels.map((l, k) => (
              <g key={k}>
                <circle cx={x(k)} cy={y(s.values[k])} r={8 * tw(f, at + 4 + k * 5, at + 10 + k * 5, 0, 1)} fill={C.paper} stroke={C.gold} strokeWidth={4} />
                <text x={x(k)} y={GH + 34} textAnchor="middle" fontSize={19} fontWeight={700} fill={C.muted} fontFamily={SANS}>
                  {l}
                </text>
              </g>
            ))}
          </svg>
        </div>
      );
    }
    // ring
    const R = 110;
    const circ = 2 * Math.PI * R;
    const g = tw(f, at, at + 34, 0, s.value / 100, EASE_OUT);
    return (
      <div key={i} style={{...wrap, display: 'flex', alignItems: 'center', gap: 36}}>
        <div style={{position: 'relative', width: 2 * R + 30, height: 2 * R + 30}}>
          <svg width={2 * R + 30} height={2 * R + 30} style={{transform: 'rotate(-90deg)'}}>
            <circle cx={R + 15} cy={R + 15} r={R} fill="none" stroke="#EEF2EF" strokeWidth={24} />
            <circle cx={R + 15} cy={R + 15} r={R} fill="none" stroke={C.gold} strokeWidth={24} strokeLinecap="round" strokeDasharray={`${circ * g} ${circ}`} />
          </svg>
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 58, fontWeight: 800, color: C.green}}>
            {Math.round(g * 100)}%
          </div>
        </div>
        <div>
          <div style={{fontSize: 32, fontWeight: 800, color: C.ink}}>{s.label}</div>
          <div style={{fontSize: 23, fontWeight: 600, color: C.muted, marginTop: 6, maxWidth: 520}}>{s.sub}</div>
        </div>
      </div>
    );
  };

  return (
    <Fill>
      <SceneBg bg={bg} drift={dur} />
      <Fill style={{transform: `scale(${push})`}}>
        {headline && <Headline lines={headline} at={s0} dark={dark} size={80} top={250} />}
        <Card
          style={{
            position: 'absolute',
            left: 60,
            width: W,
            top: headline ? 540 : 330,
            padding: '32px 40px 26px',
            transform: `translateY(${(1 - enter) * 90}px) scale(${0.94 + 0.06 * enter})`,
            opacity: enter,
          }}
        >
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div style={{fontSize: 34, fontWeight: 800, color: C.ink}}>{title}</div>
            {period && (
              <div style={{padding: '8px 18px', borderRadius: 999, background: '#EEF4F0', color: C.green, fontSize: 21, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8}}>
                <Check size={22} />
                {period}
              </div>
            )}
          </div>
          {sections.map(renderSection)}
          <Illustrative style={{marginTop: 18, fontSize: 17}} />
        </Card>
      </Fill>
    </Fill>
  );
};
