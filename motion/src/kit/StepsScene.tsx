import React from 'react';
import {useCurrentFrame} from 'remotion';
import {EASE_IN_OUT, spr, tw, wobble} from '../anim';
import {LogoMark} from '../components/Logo';
import {C, SANS} from '../theme';
import {Card, Fill, Headline, SceneBase, SceneBg, cueAt, isDark} from './common';
import {Icon} from './icons';

type Item = {icon: string; title: string; sub?: string};

type Props = SceneBase & {
  headline?: string[];
  items: Item[];
  layout?: 'list' | 'cycle';
  numbered?: boolean;
  /** o item k entra na fala k + cueOffset (se existir) */
  cueOffset?: number;
  center?: string;
};

export const StepsScene: React.FC<Props> = ({dur, cues, bg = 'ivory', headline, items, layout = 'list', numbered, cueOffset = 0, center}) => {
  const f = useCurrentFrame();
  const dark = isDark(bg);
  const s0 = Math.max(4, cueAt(cues, 0, 10) - 6);
  const at = (k: number) => {
    // sem fala própria: entra depois da última fala disponível, em cascata
    const idx = Math.min(k + cueOffset, cues.length - 1);
    const extra = Math.max(0, k + cueOffset - (cues.length - 1));
    const base = idx >= 0 ? cues[idx].at - 4 : s0 + 10;
    return base + extra * 16;
  };
  const push = tw(f, 0, dur, 1, 1.035);

  if (layout === 'cycle') {
    const cx = 540;
    const cy = 1000;
    const R = 330;
    const n = items.length;
    const lastAt = at(n - 1);
    const prog = tw(f, at(0), lastAt + 14, 0, 1, EASE_IN_OUT);
    const circ = 2 * Math.PI * R;
    const spin = tw(f, lastAt + 16, dur, 0, 1);
    return (
      <Fill>
        <SceneBg bg={bg} drift={dur} />
        <Fill style={{transform: `scale(${push})`}}>
          {headline && <Headline lines={headline} at={s0} dark={dark} size={80} top={250} />}
          <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
            <circle cx={cx} cy={cy} r={R} fill="none" stroke={dark ? 'rgba(235,208,138,0.15)' : 'rgba(14,59,46,0.1)'} strokeWidth={6} />
            <circle
              cx={cx}
              cy={cy}
              r={R}
              fill="none"
              stroke={C.gold}
              strokeWidth={6}
              strokeLinecap="round"
              strokeDasharray={`${circ * prog} ${circ}`}
              transform={`rotate(${-90 + spin * 360} ${cx} ${cy})`}
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              left: cx - 130,
              top: cy - 130,
              width: 260,
              height: 260,
              borderRadius: 130,
              background: C.green,
              boxShadow: '0 30px 60px rgba(6,26,20,0.35)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `scale(${spr(f, s0, {damping: 14})})`,
            }}
          >
            <LogoMark at={s0} size={120} />
            {center && <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 24, color: C.goldLight, marginTop: 8, letterSpacing: '0.08em'}}>{center}</div>}
          </div>
          {items.map((it, k) => {
            const a = -Math.PI / 2 + (k / n) * Math.PI * 2;
            const x = cx + Math.cos(a) * R;
            const yy = cy + Math.sin(a) * R;
            const p = spr(f, at(k), {damping: 12, stiffness: 180});
            const active = f >= at(k) && (k === n - 1 || f < at(k + 1));
            return (
              <div key={k} style={{position: 'absolute', left: x - 90, top: yy - 70, width: 180, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${p})`, opacity: Math.min(1, p)}}>
                <div
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 60,
                    background: active ? C.gold : C.paper,
                    boxShadow: '0 18px 40px rgba(10,46,35,0.18)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon name={it.icon} size={62} p={tw(f, at(k), at(k) + 20, 0, 1)} color={active ? C.greenInk : C.green} width={2} />
                </div>
                <div
                  style={{
                    marginTop: 12,
                    padding: '8px 16px',
                    borderRadius: 14,
                    background: dark ? 'rgba(6,26,20,0.7)' : 'rgba(255,255,255,0.85)',
                    fontFamily: SANS,
                    fontWeight: 800,
                    fontSize: 25,
                    textAlign: 'center',
                    lineHeight: 1.15,
                    color: dark ? C.ivory : C.ink,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {it.title}
                </div>
              </div>
            );
          })}
        </Fill>
      </Fill>
    );
  }

  const top = headline ? 560 : 380;
  const gap = items.length > 4 ? 18 : 26;
  const h = items.length > 4 ? 140 : 160;
  return (
    <Fill>
      <SceneBg bg={bg} drift={dur} />
      <Fill style={{transform: `scale(${push})`}}>
        {headline && <Headline lines={headline} at={s0} dark={dark} size={80} top={250} />}
        {items.map((it, k) => {
          const p = spr(f, at(k), {damping: 15, stiffness: 150});
          const ip = tw(f, at(k), at(k) + 22, 0, 1);
          return (
            <Card
              key={k}
              dark={dark}
              style={{
                position: 'absolute',
                left: 60,
                width: 960,
                top: top + k * (h + gap),
                height: h,
                padding: '0 36px',
                display: 'flex',
                alignItems: 'center',
                gap: 30,
                transform: `translateX(${(1 - p) * (k % 2 ? 300 : -300)}px) translateY(${wobble(f, k, 0.05) * 3}px)`,
                opacity: Math.min(1, p * 1.3),
                filter: `blur(${(1 - Math.min(1, p)) * 10}px)`,
              }}
            >
              <div
                style={{
                  width: 92,
                  height: 92,
                  borderRadius: 28,
                  background: dark ? 'rgba(235,208,138,0.12)' : '#EEF4F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  position: 'relative',
                }}
              >
                <Icon name={it.icon} size={56} p={ip} color={dark ? C.goldLight : C.green} width={2} />
                {numbered && (
                  <div
                    style={{
                      position: 'absolute',
                      top: -12,
                      left: -12,
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      background: C.gold,
                      color: C.greenInk,
                      fontSize: 22,
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {k + 1}
                  </div>
                )}
              </div>
              <div style={{flex: 1}}>
                <div style={{fontSize: 38, fontWeight: 800, color: dark ? C.ivory : C.ink, letterSpacing: '-0.02em'}}>{it.title}</div>
                {it.sub && <div style={{fontSize: 25, fontWeight: 500, color: dark ? 'rgba(244,241,234,0.7)' : C.muted, marginTop: 4}}>{it.sub}</div>}
              </div>
            </Card>
          );
        })}
      </Fill>
    </Fill>
  );
};
