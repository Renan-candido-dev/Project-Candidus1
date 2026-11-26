import React from 'react';
import {useCurrentFrame} from 'remotion';
import {EASE_OUT, spr, tw, wobble} from '../anim';
import {Rings} from '../components/Backgrounds';
import {Cursor} from '../components/Cursor';
import {LogoLockup} from '../components/Logo';
import {Sfx} from '../components/UI';
import {C, GOLD_GRADIENT, SANS} from '../theme';
import {Fill, Headline, SceneBase, SceneBg, cueAt} from './common';
import {Icon} from './icons';

type Props = SceneBase & {
  /** frase final antes da assinatura (opcional) */
  lines?: string[];
  cta: string;
  /**
   * 'question': pergunta para comentar (mês 1)
   * 'save': convite para salvar (conteúdo educativo)
   * 'button': botão com clique (mês 3, contato)
   */
  ctaStyle?: 'question' | 'save' | 'button';
};

/** Encerramento padrão da série: frase + assinatura animada + CTA. */
export const ClosingScene: React.FC<Props> = ({dur, cues, lines, cta, ctaStyle = 'question'}) => {
  const f = useCurrentFrame();
  const s0 = Math.max(4, cueAt(cues, 0, 8) - 4);
  // com frase: ela ocupa a primeira fala; o logo entra na segunda (ou ao fim da primeira)
  const logoAt = lines ? (cues[1] ? cues[1].at - 6 : (cues[0]?.end ?? s0 + 40) + 8) : s0;
  const textExit = logoAt - 14;
  const lift = spr(f, logoAt + 40, {damping: 18, stiffness: 90});
  const ctaAt = logoAt + 46;
  const cp = spr(f, ctaAt, {damping: 12, stiffness: 160});
  const click = ctaAt + 24;
  const press = ctaStyle === 'button' && f >= click - 2 && f < click + 5 ? 0.95 : 1;
  const shine = tw(f, ctaAt + 12, ctaAt + 36, -40, 140);
  const float = wobble(f, 21, 0.06) * 4;

  return (
    <Fill>
      <SceneBg bg="green" />
      {lines && f < logoAt + 4 && (
        <Fill style={{justifyContent: 'center', alignItems: 'center'}}>
          <div style={{marginTop: -160, width: '100%'}}>
            <Headline lines={lines} at={s0} dark size={92} exitAt={textExit} />
          </div>
        </Fill>
      )}
      {f >= logoAt - 2 && (
        <>
          <Rings x={540} y={760} start={logoAt} color={C.gold} count={4} gap={6} maxR={1100} life={50} />
          <div
            style={{
              position: 'absolute',
              top: 600,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              transform: `translateY(${-lift * 120 + float}px) scale(${tw(f, logoAt, logoAt + 40, 0.92, 1, EASE_OUT)})`,
            }}
          >
            <LogoLockup at={logoAt} />
          </div>
          <div
            style={{
              position: 'absolute',
              top: 1190,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              opacity: f < ctaAt ? 0 : Math.min(1, cp * 1.3),
              transform: `translateY(${(1 - cp) * 80}px) scale(${(0.85 + 0.15 * cp) * press})`,
            }}
          >
            {ctaStyle === 'button' ? (
              <div
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 22,
                  maxWidth: 940,
                  padding: '28px 30px 28px 46px',
                  borderRadius: 999,
                  background: GOLD_GRADIENT,
                  boxShadow: '0 24px 60px rgba(201,162,74,0.35), inset 0 2px 0 rgba(255,255,255,0.45)',
                  fontFamily: SANS,
                  fontWeight: 800,
                  fontSize: 38,
                  color: C.greenInk,
                }}
              >
                {cta}
                <div style={{width: 60, height: 60, borderRadius: 30, background: C.greenInk, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                  <svg width={30} height={30} viewBox="0 0 24 24">
                    <path d="M5 12 H19 M13 6 L19 12 L13 18" stroke={C.goldLight} strokeWidth={2.8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div style={{position: 'absolute', top: 0, bottom: 0, left: `${shine}%`, width: 120, background: 'linear-gradient(100deg, transparent, rgba(255,255,255,0.65), transparent)', transform: 'skewX(-20deg)'}} />
              </div>
            ) : (
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
                <div
                  style={{
                    width: 66,
                    height: 66,
                    borderRadius: 20,
                    background: C.gold,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {ctaStyle === 'save' ? (
                    <svg width={34} height={34} viewBox="0 0 24 24">
                      <path d="M6 3 H18 V21 L12 16.5 L6 21 Z" fill={C.greenInk} />
                    </svg>
                  ) : (
                    <Icon name="chat" size={38} color={C.greenInk} width={2.4} />
                  )}
                </div>
                <div>{cta}</div>
              </div>
            )}
          </div>
          {ctaStyle === 'button' && (
            <Cursor
              keys={[
                {f: ctaAt + 4, x: 1010, y: 1640},
                {f: click - 2, x: 860, y: 1270},
                {f: click + 22, x: 880, y: 1290},
              ]}
              clicks={[click]}
              color={C.greenInk}
            />
          )}
          <Sfx name="chime" at={logoAt + 2} volume={0.42} />
          <Sfx name="pop" at={ctaAt} volume={0.3} />
          {ctaStyle === 'button' && <Sfx name="click" at={click} volume={0.55} />}
        </>
      )}
    </Fill>
  );
};
