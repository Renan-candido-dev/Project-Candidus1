import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {EASE_IN, EASE_IN_OUT, EASE_OUT, rand, spr, tw, wobble} from '../../../anim';
import {GreenBg, Rings} from '../../../components/Backgrounds';
import {LogoLockup} from '../../../components/Logo';
import {Words} from '../../../components/Words';
import {Sfx} from '../../../components/UI';
import {C, GOLD_TEXT, SANS, SERIF} from '../../../theme';

const LOGO_AT = 146;
const CTA_AT = 204;
const CLICK = 230;

/** Ícone de loja em traço dourado ("o seu negócio"). */
const StoreIcon: React.FC<{p: number; opacity: number}> = ({p, opacity}) => (
  <svg width={220} height={190} viewBox="0 0 220 190" style={{opacity}}>
    {[
      'M 20 70 L 40 20 L 180 20 L 200 70',
      'M 20 70 Q 43 95 66 70 Q 89 95 112 70 Q 135 95 158 70 Q 180 95 200 70',
      'M 34 88 L 34 175 L 186 175 L 186 88',
      'M 88 175 L 88 120 L 132 120 L 132 175',
      'M 10 175 L 210 175',
    ].map((d, i) => (
      <path
        key={i}
        d={d}
        fill="none"
        stroke="#E6C46E"
        strokeWidth={7}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray="1 1"
        strokeDashoffset={1 - Math.min(1, Math.max(0, p * 1.6 - i * 0.15))}
      />
    ))}
  </svg>
);

/** Colunas de dígitos rolando ao fundo ("os números"). */
const DigitRain: React.FC<{opacity: number}> = ({opacity}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity, overflow: 'hidden'}}>
      {Array.from({length: 12}).map((_, i) => {
        const speed = 2 + rand(i + 3) * 3;
        const y = -((f * speed + rand(i) * 900) % 900);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 20 + i * 90,
              top: y,
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 40,
              lineHeight: '64px',
              color: C.goldLight,
              opacity: 0.3 + rand(i + 5) * 0.7,
            }}
          >
            {Array.from({length: 46}).map((__, k) => (
              <div key={k}>{Math.floor(rand(i * 50 + k) * 10)}</div>
            ))}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const S5Closing: React.FC = () => {
  const f = useCurrentFrame();

  const dim = tw(f, 68, 82, 0, 1, EASE_IN_OUT);
  const exitA = tw(f, 128, 142, 0, 1, EASE_IN);
  const lift = spr(f, 196, {damping: 18, stiffness: 90});
  const cta = spr(f, CTA_AT, {damping: 12, stiffness: 160});
  const press = f >= CLICK - 2 && f < CLICK + 5 ? 0.95 : 1;
  const float = wobble(f, 21, 0.06) * 4;

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <GreenBg />

      {/* ---------- Você cuida do negócio. Nós cuidamos dos números. ---------- */}
      {f < 144 && (
        <AbsoluteFill style={{opacity: 1 - exitA, filter: `blur(${exitA * 24}px)`, transform: `translateY(${-exitA * 120}px)`}}>
          <DigitRain opacity={tw(f, 72, 96, 0, 0.1)} />
          <div style={{position: 'absolute', top: 360, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
            <StoreIcon p={tw(f, 2, 34, 0, 1, EASE_OUT)} opacity={1 - dim} />
          </div>
          <div
            style={{
              position: 'absolute',
              top: 600,
              left: 40,
              right: 40,
              transform: `translateY(${-dim * 190}px)`,
              opacity: 1 - dim * 0.55,
            }}
          >
            <Words parts={[{t: 'Você cuida'}]} at={12} style={{fontFamily: SANS, fontWeight: 600, fontSize: 84, color: C.ivory, letterSpacing: '-0.02em'}} />
            <Words
              parts={[{t: 'do negócio.'}]}
              at={20}
              style={{fontFamily: SANS, fontWeight: 800, fontSize: 116, color: C.ivory, letterSpacing: '-0.04em'}}
            />
          </div>
          <div style={{position: 'absolute', top: 820, left: 40, right: 40}}>
            <Words parts={[{t: 'Nós cuidamos'}]} at={72} style={{fontFamily: SANS, fontWeight: 600, fontSize: 84, color: C.ivory, letterSpacing: '-0.02em'}} />
            <Words
              parts={[{t: 'dos números.', s: GOLD_TEXT}]}
              at={80}
              mode="blur"
              dur={20}
              style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 164, marginTop: -4}}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* ---------- Assinatura + CTA ---------- */}
      {f >= LOGO_AT - 4 && (
        <>
          <Rings x={540} y={760} start={LOGO_AT} color={C.gold} count={4} gap={6} maxR={1100} life={50} />
          <div
            style={{
              position: 'absolute',
              top: 600,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              transform: `translateY(${-lift * 110 + float}px) scale(${tw(f, LOGO_AT, LOGO_AT + 40, 0.92, 1, EASE_OUT)})`,
            }}
          >
            <LogoLockup at={LOGO_AT} />
          </div>
          <div
            style={{
              position: 'absolute',
              top: 1220,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              opacity: f < CTA_AT ? 0 : Math.min(1, cta * 1.3),
              transform: `translateY(${(1 - cta) * 80}px) scale(${(0.85 + 0.15 * cta) * press})`,
            }}
          >
            {/* mês 1: CTA em forma de pergunta (sem botão de venda) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 22,
                maxWidth: 900,
                padding: '26px 36px',
                borderRadius: 34,
                border: '2px solid rgba(235,208,138,0.5)',
                background: 'rgba(235,208,138,0.1)',
                fontFamily: SANS,
                fontWeight: 700,
                fontSize: 36,
                lineHeight: 1.25,
                color: C.ivory,
              }}
            >
              <div style={{width: 66, height: 66, borderRadius: 20, background: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                <svg width={34} height={34} viewBox="0 0 24 24">
                  <path d="M4 5 H20 V16 H10 L5 20 V16 H4 Z" fill="none" stroke={C.greenInk} strokeWidth={2.4} strokeLinejoin="round" />
                </svg>
              </div>
              <div>Você sabe para onde vai o dinheiro da sua empresa?</div>
            </div>
          </div>
        </>
      )}

      <Sfx name="swish" at={10} volume={0.3} />
      <Sfx name="swish" at={70} volume={0.3} />
      <Sfx name="whoosh" at={126} volume={0.4} />
      <Sfx name="chime" at={LOGO_AT + 2} volume={0.45} />
      <Sfx name="pop" at={CTA_AT} volume={0.35} />
    </AbsoluteFill>
  );
};
