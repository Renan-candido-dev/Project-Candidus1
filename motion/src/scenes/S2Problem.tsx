import React from 'react';
import {AbsoluteFill, interpolateColors, useCurrentFrame} from 'remotion';
import {EASE_IN, EASE_IN_OUT, EASE_OUT, brl, spr, tw, wobble} from '../anim';
import {GreenBg} from '../components/Backgrounds';
import {Words} from '../components/Words';
import {Sfx} from '../components/UI';
import {C, GOLD_TEXT, SANS, SERIF} from '../theme';

const CHIPS = [
  {l: 'Venda', v: '+ R$ 1.280', in: true},
  {l: 'Boleto', v: '- R$ 2.350', in: false},
  {l: 'Pix', v: '+ R$ 640', in: true},
  {l: 'Aluguel', v: '- R$ 4.800', in: false},
  {l: 'Taxa', v: '- R$ 89', in: false},
  {l: 'Fornecedor', v: '- R$ 3.480', in: false},
  {l: 'Venda', v: '+ R$ 389', in: true},
  {l: 'Imposto', v: '- R$ 1.912', in: false},
  {l: 'Juros', v: '- R$ 87', in: false},
  {l: 'Pix', v: '+ R$ 215', in: true},
];

const Chip: React.FC<{i: number}> = ({i}) => {
  const c = CHIPS[i % CHIPS.length];
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14,
        padding: '16px 26px',
        borderRadius: 999,
        background: c.in ? 'rgba(201,162,74,0.16)' : 'rgba(212,100,79,0.16)',
        border: `2px solid ${c.in ? 'rgba(235,208,138,0.45)' : 'rgba(232,144,124,0.45)'}`,
        fontFamily: SANS,
        fontSize: 30,
        fontWeight: 700,
        color: c.in ? C.goldLight : '#F0A693',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{opacity: 0.75, fontWeight: 600}}>{c.l}</span>
      <span style={{fontVariantNumeric: 'tabular-nums'}}>{c.v}</span>
    </div>
  );
};

/** Faixas de transações cruzando a tela em velocidades diferentes. */
const Streams: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      {Array.from({length: 9}).map((_, lane) => {
        const dir = lane % 2 ? 1 : -1;
        const speed = 7 + (lane * 5) % 9;
        const depth = lane % 3 === 1 ? 0.78 : 1;
        const offset = ((f * speed * dir) % 1400) - 700 - lane * 170;
        return (
          <div
            key={lane}
            style={{
              position: 'absolute',
              top: 170 + lane * 190,
              left: 0,
              display: 'flex',
              gap: 28,
              transform: `translateX(${offset}px) scale(${depth})`,
              filter: depth < 1 ? 'blur(3px)' : undefined,
              opacity: depth < 1 ? 0.45 : 0.85,
            }}
          >
            {Array.from({length: 9}).map((__, k) => (
              <Chip key={k} i={lane * 3 + k} />
            ))}
          </div>
        );
      })}
    </>
  );
};

const ALERTS = [
  {t: 'Vencida', x: 90, y: 600, at: 22},
  {t: 'Juros + R$ 87,30', x: 600, y: 590, at: 34},
  {t: 'Vence hoje', x: 640, y: 1150, at: 46},
  {t: 'Saldo negativo', x: 120, y: 1160, at: 58},
];

const BalancePanel: React.FC = () => {
  const f = useCurrentFrame();
  const enter = spr(f, 0, {damping: 18, stiffness: 140});
  const v = tw(f, 6, 72, 12430, -2180, EASE_IN_OUT);
  const color = interpolateColors(f, [30, 66], ['#F4F1EA', '#F08A74']);
  const draw = tw(f, 4, 64, 0, 1, EASE_IN_OUT);
  // linha irregular e descendente
  const pts = [
    [0, 40], [60, 70], [110, 30], [170, 95], [220, 80], [280, 150], [330, 120], [390, 190], [450, 170], [510, 235], [560, 215], [620, 280], [680, 300],
  ];
  const d = pts.map((p, i) => `${i ? 'L' : 'M'} ${p[0]} ${p[1]}`).join(' ');
  return (
    <div
      style={{
        position: 'absolute',
        left: 110,
        top: 660,
        width: 860,
        height: 500,
        borderRadius: 44,
        background: 'linear-gradient(160deg, rgba(20,70,54,0.85), rgba(6,26,20,0.92))',
        border: '2px solid rgba(235,208,138,0.18)',
        boxShadow: '0 40px 80px rgba(0,0,0,0.45)',
        transform: `scale(${0.88 + 0.12 * enter})`,
        opacity: enter,
        filter: `blur(${(1 - enter) * 12}px)`,
        padding: '44px 54px',
        fontFamily: SANS,
      }}
    >
      <div style={{fontSize: 26, fontWeight: 700, letterSpacing: '0.26em', color: C.goldLight}}>SALDO DO MÊS</div>
      <div style={{fontSize: 104, fontWeight: 800, color, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums', marginTop: 4}}>
        {brl(v)}
      </div>
      <svg width={752} height={300} viewBox="0 -20 680 340" style={{position: 'absolute', left: 54, bottom: 26}}>
        <defs>
          <linearGradient id="down" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#EBD08A" />
            <stop offset="1" stopColor="#F08A74" />
          </linearGradient>
          <linearGradient id="downFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgba(240,138,116,0.28)" />
            <stop offset="1" stopColor="rgba(240,138,116,0)" />
          </linearGradient>
          <clipPath id="reveal">
            <rect x={-10} y={-40} width={700 * draw} height={400} />
          </clipPath>
        </defs>
        <path d={`${d} L 680 320 L 0 320 Z`} fill="url(#downFill)" clipPath="url(#reveal)" />
        <path d={d} fill="none" stroke="url(#down)" strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" clipPath="url(#reveal)" />
      </svg>
    </div>
  );
};

export const S2Problem: React.FC = () => {
  const f = useCurrentFrame();

  const shake = tw(f, 10, 70, 2, 7) * tw(f, 78, 96, 1, 0.2);
  const camX = wobble(f, 11, 1.3) * shake;
  const camY = wobble(f, 12, 1.1) * shake;
  const camR = wobble(f, 13, 0.3) * 0.5;
  const zoom = tw(f, 0, 90, 1.04, 1.12, EASE_IN_OUT);

  // apagar das luzes
  const dark = tw(f, 78, 94, 0, 1, EASE_IN_OUT);
  const lx = f < 112 ? tw(f, 84, 112, 260, 820, EASE_IN_OUT) : tw(f, 112, 128, 820, 540, EASE_IN_OUT);
  const ly = f < 112 ? tw(f, 84, 112, 760, 880, EASE_IN_OUT) : tw(f, 112, 128, 880, 960, EASE_IN_OUT);
  const lr = f < 150 ? tw(f, 84, 96, 0, 330) + tw(f, 124, 140, 0, 360, EASE_IN_OUT) : tw(f, 150, 162, 690, 0, EASE_IN);
  const dot = tw(f, 155, 165, 0, 26, EASE_OUT);
  const lightMask = `radial-gradient(circle ${Math.max(lr, 1)}px at ${lx}px ${ly}px, black 0%, black 55%, transparent 100%)`;

  const text = (
    <div style={{position: 'absolute', top: 760, left: 50, right: 50}}>
      <Words
        parts={[{t: 'Sem controle financeiro,'}]}
        at={84}
        stagger={3}
        style={{fontFamily: SANS, fontWeight: 600, fontSize: 70, color: '#F4F1EA', letterSpacing: '-0.02em'}}
      />
      <Words
        parts={[{t: 'você trabalha'}]}
        at={97}
        style={{fontFamily: SANS, fontWeight: 600, fontSize: 70, color: '#F4F1EA', letterSpacing: '-0.02em', marginTop: 6}}
      />
      <Words
        parts={[{t: 'no escuro.', s: GOLD_TEXT}]}
        at={106}
        mode="blur"
        dur={20}
        style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 178, letterSpacing: '-0.01em', marginTop: 4}}
      />
    </div>
  );

  return (
    <AbsoluteFill style={{overflow: 'hidden', background: C.night}}>
      <AbsoluteFill
        style={{
          transform: `translate(${camX}px, ${camY}px) rotate(${camR}deg) scale(${zoom})`,
          filter: `saturate(${1 - dark * 0.7}) blur(${dark * 6}px)`,
        }}
      >
        <GreenBg />
        <Streams />
        <BalancePanel />
        {ALERTS.map((a, i) => {
          const p = spr(f, a.at, {damping: 10, stiffness: 220});
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: a.x,
                top: a.y,
                transform: `scale(${p}) rotate(${(i % 2 ? 1 : -1) * 4}deg)`,
                opacity: f < a.at ? 0 : 1,
                padding: '14px 26px',
                borderRadius: 18,
                background: C.coral,
                color: '#fff',
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: 32,
                boxShadow: '0 16px 40px rgba(212,100,79,0.45)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <span style={{width: 34, height: 34, borderRadius: 17, background: '#fff', color: C.coral, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 24}}>!</span>
              {a.t}
            </div>
          );
        })}
      </AbsoluteFill>

      {/* escuridão com "lanterna" */}
      <AbsoluteFill
        style={{
          opacity: dark,
          background: `radial-gradient(circle ${Math.max(lr, 1)}px at ${lx}px ${ly}px, rgba(3,13,10,0.35) 0%, rgba(3,13,10,0.55) 55%, rgba(3,13,10,0.96) 100%)`,
        }}
      />
      {f >= 84 && (
        <>
          <AbsoluteFill style={{opacity: 0.16 * tw(f, 148, 160, 1, 0)}}>{text}</AbsoluteFill>
          <AbsoluteFill style={{maskImage: lightMask, WebkitMaskImage: lightMask}}>{text}</AbsoluteFill>
        </>
      )}
      {dot > 0 && (
        <div
          style={{
            position: 'absolute',
            left: 540 - dot,
            top: 960 - dot,
            width: dot * 2,
            height: dot * 2,
            borderRadius: '50%',
            background: C.ivory,
            boxShadow: '0 0 60px 20px rgba(235,208,138,0.55)',
          }}
        />
      )}

      {ALERTS.map((a) => (
        <Sfx key={a.t} name="error" at={a.at} volume={0.32} />
      ))}
      <Sfx name="whoosh-down" at={76} volume={0.55} />
      <Sfx name="pop-high" at={156} volume={0.35} />
    </AbsoluteFill>
  );
};
