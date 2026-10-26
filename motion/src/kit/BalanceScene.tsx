import React from 'react';
import {interpolateColors, useCurrentFrame} from 'remotion';
import {EASE_IN_OUT, brl, spr, tw} from '../anim';
import {Illustrative} from '../components/UI';
import {C, SANS} from '../theme';
import {Card, Fill, Headline, SceneBase, SceneBg, cueAt, isDark} from './common';
import {Icon} from './icons';

type Item = {label: string; v: number; date?: string; icon?: string; cue?: number};

type Props = SceneBase & {
  headline?: string[];
  balance: {label: string; v: number};
  items: Item[];
  result: string;
  verdict?: {text: string; tone?: 'gold' | 'coral' | 'green'; cue?: number};
};

/** Saldo que parece grande, e o que de fato sobra depois dos compromissos. */
export const BalanceScene: React.FC<Props> = ({dur, cues, bg = 'ivory', headline, balance, items, result, verdict}) => {
  const f = useCurrentFrame();
  const dark = isDark(bg);
  const s0 = Math.max(4, cueAt(cues, 0, 10) - 6);
  const enter = spr(f, s0 - 4, {damping: 18, stiffness: 120});
  const push = tw(f, 0, dur, 1, 1.03);
  // itens da mesma fala entram em cascata
  const ats = items.map((it, k) => {
    if (it.cue === undefined) return s0 + 24 + k * 12;
    const same = items.slice(0, k).filter((o) => o.cue === it.cue).length;
    return cueAt(cues, it.cue, s0 + 24 + k * 12) + same * 12;
  });
  let value = tw(f, s0, s0 + 24, 0, balance.v, EASE_IN_OUT);
  items.forEach((it, k) => {
    value += tw(f, ats[k] + 8, ats[k] + 22, 0, it.v, EASE_IN_OUT);
  });
  const final = balance.v + items.reduce((s, it) => s + it.v, 0);
  const lastAt = ats.length ? ats[ats.length - 1] : s0 + 30;
  const rp = tw(f, lastAt + 22, lastAt + 34, 0, 1);
  const col = interpolateColors(value, [Math.min(0, final), balance.v * 0.5, balance.v], [C.coral, C.goldDeep, C.green]);
  const vAt = verdict?.cue !== undefined ? cueAt(cues, verdict.cue, lastAt + 36) : lastAt + 36;
  const vp = verdict ? spr(f, vAt, {damping: 12, stiffness: 170}) : 0;
  const vcol = verdict?.tone === 'coral' ? C.coral : verdict?.tone === 'green' ? C.green : C.gold;

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
            top: headline ? 540 : 380,
            padding: '36px 44px 30px',
            transform: `translateY(${(1 - enter) * 90}px) scale(${0.94 + 0.06 * enter})`,
            opacity: enter,
          }}
        >
          <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
            <Icon name="bank" size={44} color={C.green} width={2} />
            <div style={{fontSize: 26, fontWeight: 800, color: C.muted, letterSpacing: '0.06em'}}>
              {rp > 0.5 ? result.toUpperCase() : balance.label.toUpperCase()}
            </div>
          </div>
          <div style={{fontSize: 112, fontWeight: 800, color: col, letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums', marginTop: 6}}>
            {brl(value, 0)}
          </div>
          <div style={{marginTop: 18}}>
            {items.map((it, k) => {
              const p = spr(f, ats[k], {damping: 16, stiffness: 160});
              const used = tw(f, ats[k] + 8, ats[k] + 22, 0, 1);
              return (
                <div
                  key={k}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    height: 72,
                    borderTop: `2px solid ${C.line}`,
                    fontSize: 28,
                    transform: `translateX(${(1 - p) * 120}px)`,
                    opacity: Math.min(1, p),
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      background: it.v < 0 ? C.coralSoft : '#E1EEE6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon name={it.icon ?? (it.v < 0 ? 'receipt' : 'coins')} size={28} color={it.v < 0 ? C.coral : C.greenMid} width={2.2} />
                  </div>
                  <div style={{flex: 1, fontWeight: 700, color: C.ink}}>{it.label}</div>
                  {it.date && <div style={{fontSize: 22, fontWeight: 700, color: C.muted}}>{it.date}</div>}
                  <div
                    style={{
                      width: 200,
                      textAlign: 'right',
                      fontWeight: 800,
                      color: it.v < 0 ? C.coral : C.greenMid,
                      fontVariantNumeric: 'tabular-nums',
                      textDecoration: used > 0.99 ? 'line-through' : undefined,
                      opacity: 1 - used * 0.35,
                    }}
                  >
                    {it.v > 0 ? '+' : ''}
                    {brl(it.v, 0)}
                  </div>
                </div>
              );
            })}
          </div>
          <Illustrative style={{marginTop: 14, fontSize: 17}} />
        </Card>
        {verdict && (
          <div style={{position: 'absolute', left: 0, right: 0, top: 1262, display: 'flex', justifyContent: 'center'}}>
            <div
              style={{
                maxWidth: 900,
                padding: '22px 36px',
                borderRadius: 999,
                background: vcol,
                color: verdict.tone === 'gold' || !verdict.tone ? C.greenInk : '#fff',
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: 34,
                textAlign: 'center',
                boxShadow: '0 20px 50px rgba(10,46,35,0.2)',
                transform: `scale(${vp})`,
                opacity: Math.min(1, vp),
              }}
            >
              {verdict.text}
            </div>
          </div>
        )}
      </Fill>
    </Fill>
  );
};
