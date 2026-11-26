import React from 'react';
import {useCurrentFrame} from 'remotion';
import {brl, spr, tw} from '../anim';
import {C, SANS} from '../theme';
import {Card, Fill, Headline, SceneBase, SceneBg, cueAt, isDark} from './common';
import {Icon} from './icons';

type Side = {title: string; icon?: string; tone?: 'green' | 'gold' | 'coral' | 'neutral'; items: {label: string; v?: number}[]; total?: number; cue?: number};

type Props = SceneBase & {
  headline?: string[];
  left: Side;
  right: Side;
  footer?: string;
  footerCue?: number;
  vs?: string;
};

const TONE = {green: C.green, gold: C.goldDeep, coral: C.coral, neutral: C.muted};

/** Comparação lado a lado (ex.: pessoal × empresa, dois cenários, dois modelos). */
export const SplitScene: React.FC<Props> = ({dur, cues, bg = 'ivory', headline, left, right, footer, footerCue, vs = 'x'}) => {
  const f = useCurrentFrame();
  const dark = isDark(bg);
  const s0 = Math.max(4, cueAt(cues, 0, 10) - 6);
  const push = tw(f, 0, dur, 1, 1.03);
  const top = headline ? 560 : 400;

  const side = (s: Side, k: number) => {
    const at = s.cue !== undefined ? cueAt(cues, s.cue, s0 + k * 14) : s0 + k * 14;
    const p = spr(f, at, {damping: 16, stiffness: 140});
    const col = TONE[s.tone ?? 'green'];
    return (
      <Card
        key={k}
        style={{
          position: 'absolute',
          top,
          left: k === 0 ? 60 : 555,
          width: 465,
          padding: '30px 30px 26px',
          transform: `translateY(${(1 - p) * 120}px) rotate(${(1 - p) * (k ? 4 : -4)}deg)`,
          opacity: Math.min(1, p),
          borderTop: `10px solid ${col}`,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          {s.icon && <Icon name={s.icon} size={46} color={col} width={2} p={tw(f, at, at + 20, 0, 1)} />}
          <div style={{fontSize: 34, fontWeight: 800, color: C.ink, lineHeight: 1.1}}>{s.title}</div>
        </div>
        <div style={{marginTop: 16}}>
          {s.items.map((it, j) => {
            const ip = tw(f, at + 8 + j * 4, at + 18 + j * 4, 0, 1);
            return (
              <div
                key={j}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 10,
                  minHeight: 76,
                  borderTop: `2px solid ${C.line}`,
                  fontSize: 27,
                  opacity: ip,
                  transform: `translateX(${(1 - ip) * 30}px)`,
                }}
              >
                <div style={{fontWeight: 700, color: C.ink, lineHeight: 1.2, padding: '8px 0'}}>{it.label}</div>
                {it.v !== undefined && (
                  <div style={{fontWeight: 800, color: it.v < 0 ? C.coral : C.greenMid, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap'}}>
                    {it.v > 0 ? '+' : ''}
                    {brl(it.v, 0)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {s.total !== undefined && (
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 12, paddingTop: 12, borderTop: `3px solid ${col}`}}>
            <div style={{fontSize: 22, fontWeight: 800, color: C.muted}}>Total</div>
            <div style={{fontSize: 36, fontWeight: 800, color: s.total < 0 ? C.coral : C.ink, fontVariantNumeric: 'tabular-nums'}}>
              {brl(s.total * tw(f, at + 20, at + 40, 0, 1), 0)}
            </div>
          </div>
        )}
      </Card>
    );
  };

  const fAt = footerCue !== undefined ? cueAt(cues, footerCue, s0 + 60) : s0 + 60;
  const fp = footer ? spr(f, fAt, {damping: 12, stiffness: 170}) : 0;
  const vp = spr(f, s0 + 10, {damping: 10, stiffness: 200});
  // rodapé logo abaixo do card mais alto (estimativa da altura)
  const estH = (s: Side) => 30 + 60 + 16 + s.items.length * 80 + (s.total !== undefined ? 76 : 0) + 26;
  const footerTop = Math.min(1250, top + Math.max(estH(left), estH(right)) + 50);

  return (
    <Fill>
      <SceneBg bg={bg} drift={dur} />
      <Fill style={{transform: `scale(${push})`}}>
        {headline && <Headline lines={headline} at={s0} dark={dark} size={80} top={250} />}
        {side(left, 0)}
        {side(right, 1)}
        <div
          style={{
            position: 'absolute',
            left: 540 - 36,
            top: top + 40,
            width: 72,
            height: 72,
            borderRadius: 36,
            background: C.gold,
            color: C.greenInk,
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${vp})`,
            boxShadow: '0 10px 30px rgba(10,46,35,0.25)',
            zIndex: 2,
          }}
        >
          {vs}
        </div>
        {footer && (
          <div style={{position: 'absolute', left: 0, right: 0, top: footerTop, display: 'flex', justifyContent: 'center'}}>
            <div
              style={{
                maxWidth: 920,
                padding: '22px 34px',
                borderRadius: 30,
                background: dark ? 'rgba(235,208,138,0.14)' : C.green,
                color: C.ivory,
                fontFamily: SANS,
                fontWeight: 700,
                fontSize: 31,
                lineHeight: 1.3,
                textAlign: 'center',
                transform: `scale(${fp})`,
                opacity: Math.min(1, fp),
              }}
            >
              {footer}
            </div>
          </div>
        )}
      </Fill>
    </Fill>
  );
};
