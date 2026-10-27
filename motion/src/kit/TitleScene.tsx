import React from 'react';
import {interpolateColors, useCurrentFrame} from 'remotion';
import {EASE_IN_OUT, EASE_OUT, brl, spr, tw, wobble} from '../anim';
import {Rings} from '../components/Backgrounds';
import {C, SANS} from '../theme';
import {Fill, Headline, Kicker, SceneBase, SceneBg, cueAt, isDark} from './common';
import {Icon} from './icons';

export type BigNumber = {
  value: number;
  from?: number;
  label?: string;
  money?: boolean;
  suffix?: string;
  decimals?: number;
  tone?: 'gold' | 'coral' | 'green' | 'ink';
  strike?: boolean; // risca o número depois (ex.: "isso NÃO é lucro")
  strikeCue?: number;
};

type Props = SceneBase & {
  lines: string[];
  kicker?: string;
  sub?: string;
  icon?: string;
  big?: BigNumber;
  size?: number;
  /** cada linha entra junto com a fala de mesmo índice */
  sync?: boolean;
  rings?: boolean;
};

const TONE = {gold: '#E6C46E', coral: '#E8907C', green: C.green, ink: C.ink};

export const TitleScene: React.FC<Props> = ({dur, cues, bg = 'ivory', lines, kicker, sub, icon, big, size = 92, sync, rings = true}) => {
  const f = useCurrentFrame();
  const dark = isDark(bg);
  const start = Math.max(2, cueAt(cues, 0, 8) - 4);
  const kp = tw(f, start - 4, start + 10, 0, 1);
  const ip = tw(f, start - 2, start + 26, 0, 1, EASE_OUT);
  const push = tw(f, 0, dur, 1, 1.05);
  const lineAt = sync ? lines.map((_, i) => cueAt(cues, i, start + i * 8) - 2) : undefined;

  let bigNode: React.ReactNode = null;
  if (big) {
    const bp = spr(f, start, {damping: 16});
    const v = tw(f, start, start + 30, big.from ?? 0, big.value, EASE_OUT);
    const txt = big.money ? brl(v, big.decimals ?? 0) : `${v.toFixed(big.decimals ?? 0).replace('.', ',')}${big.suffix ?? ''}`;
    const sc = big.strikeCue !== undefined ? cueAt(cues, big.strikeCue, start + 40) : start + 40;
    const strike = big.strike ? tw(f, sc, sc + 12, 0, 1, EASE_IN_OUT) : 0;
    const col = big.strike ? interpolateColors(strike, [0, 1], [dark ? C.ivory : C.ink, TONE.coral]) : TONE[big.tone ?? (dark ? 'gold' : 'green')];
    bigNode = (
      <div style={{position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 30}}>
        {big.label && (
          <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 28, letterSpacing: '0.24em', color: dark ? C.goldLight : C.muted, opacity: bp}}>
            {big.label}
          </div>
        )}
        <div
          style={{
            position: 'relative',
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: String(Math.round(big.value)).length <= 2 && !big.money ? 380 : 150,
            lineHeight: 1,
            letterSpacing: '-0.04em',
            color: col,
            fontVariantNumeric: 'tabular-nums',
            transform: `scale(${0.8 + 0.2 * bp})`,
            opacity: bp,
            filter: `blur(${(1 - bp) * 12}px)`,
          }}
        >
          {txt}
          {big.strike && (
            <div
              style={{
                position: 'absolute',
                left: -10,
                top: '52%',
                height: 12,
                width: `${strike * 104}%`,
                borderRadius: 6,
                background: TONE.coral,
                transform: 'rotate(-4deg)',
              }}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <Fill>
      <SceneBg bg={bg} drift={dur} />
      {rings && <Rings x={540} y={900} start={start - 2} color={dark ? C.gold : 'rgba(201,162,74,0.8)'} count={3} maxR={900} life={44} />}
      <Fill style={{transform: `scale(${push})`, justifyContent: 'center', alignItems: 'center'}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: -120, width: '100%'}}>
          {icon && (
            <div style={{marginBottom: 34, transform: `translateY(${wobble(f, 4, 0.05) * 6}px) scale(${0.7 + 0.3 * ip})`, opacity: Math.min(1, ip * 2)}}>
              <Icon name={icon} size={150} p={ip} color={dark ? '#E6C46E' : C.gold} width={1.6} />
            </div>
          )}
          {kicker && <Kicker text={kicker} dark={dark} p={kp} style={{marginBottom: 34}} />}
          {bigNode}
          <Headline lines={lines} at={start} dark={dark} size={size} lineAt={lineAt} />
          {sub && (
            <div
              style={{
                marginTop: 34,
                maxWidth: 860,
                textAlign: 'center',
                fontFamily: SANS,
                fontWeight: 500,
                fontSize: 36,
                lineHeight: 1.35,
                color: dark ? 'rgba(244,241,234,0.75)' : C.muted,
                opacity: tw(f, start + 18, start + 32, 0, 1),
              }}
            >
              {sub}
            </div>
          )}
        </div>
      </Fill>
    </Fill>
  );
};
