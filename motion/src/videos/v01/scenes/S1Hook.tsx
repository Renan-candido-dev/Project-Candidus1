import React from 'react';
import {AbsoluteFill, interpolateColors, useCurrentFrame} from 'remotion';
import {EASE_IN, EASE_IN_OUT, EASE_OUT, brl, rand, spr, tw, wobble} from '../../../anim';
import {GreenBg, IvoryBg, Rings} from '../../../components/Backgrounds';
import {Dissolve, Words} from '../../../components/Words';
import {Notif, Sfx, Tone} from '../../../components/UI';
import {C, GOLD_TEXT, SANS, SERIF} from '../../../theme';

const NOTIFS: {title: string; sub: string; amount: string; tone: Tone; x: number; y: number; s: number; at: number; from: 'L' | 'R' | 'B'; back?: boolean}[] = [
  {title: 'Venda aprovada', sub: 'Cartão de crédito', amount: '+R$ 1.280', tone: 'in', x: 50, y: 560, s: 1, at: 16, from: 'L'},
  {title: 'Boleto vence hoje', sub: 'Fornecedor', amount: 'R$ 2.350', tone: 'alert', x: 550, y: 640, s: 1, at: 23, from: 'R'},
  {title: 'Pix recebido', sub: 'Cliente · Loja Centro', amount: '+R$ 640', tone: 'in', x: 30, y: 800, s: 0.9, at: 30, from: 'L'},
  {title: 'Aluguel', sub: 'Vence amanhã', amount: 'R$ 4.800', tone: 'out', x: 590, y: 850, s: 0.9, at: 36, from: 'R'},
  {title: 'Impostos', sub: 'DAS · Simples Nacional', amount: 'R$ 1.912', tone: 'alert', x: 290, y: 690, s: 0.8, at: 40, from: 'B', back: true},
  {title: 'Nova venda', sub: 'Pedido #4821', amount: '+R$ 389', tone: 'in', x: 60, y: 1050, s: 1, at: 44, from: 'L'},
  {title: 'Salários', sub: 'Folha · agendada dia 5', amount: 'R$ 9.200', tone: 'out', x: 550, y: 1110, s: 1, at: 48, from: 'R'},
  {title: 'Pix enviado', sub: 'Matéria-prima', amount: 'R$ 3.480', tone: 'out', x: 40, y: 1250, s: 0.88, at: 52, from: 'L'},
  {title: 'Fatura do cartão', sub: 'Fechada hoje', amount: 'R$ 6.074', tone: 'alert', x: 580, y: 1270, s: 0.88, at: 56, from: 'R'},
  {title: 'Venda aprovada', sub: 'Débito', amount: '+R$ 215', tone: 'in', x: 290, y: 960, s: 1.02, at: 60, from: 'B'},
];

const NotifLayer: React.FC<{back: boolean}> = ({back}) => {
  const f = useCurrentFrame();
  return (
    <>
      {NOTIFS.filter((n) => !!n.back === back).map((n, i) => {
        const p = spr(f, n.at, {damping: 15, stiffness: 190});
        const blurIn = tw(f, n.at, n.at + 8, 1, 0);
        const dx = n.from === 'L' ? -460 : n.from === 'R' ? 460 : 0;
        const dy = n.from === 'B' ? 420 : 0;
        const fl = wobble(f, i + 3, 0.09) * 7;
        return (
          <div
            key={n.title + n.at}
            style={{
              position: 'absolute',
              left: n.x,
              top: n.y,
              opacity: f < n.at ? 0 : Math.min(1, p * 1.4),
              transform: `translate(${dx * (1 - p)}px, ${dy * (1 - p) + fl}px) scale(${n.s}) rotate(${(1 - p) * (dx ? Math.sign(dx) * 6 : 0)}deg)`,
              transformOrigin: 'center',
              filter: `blur(${(n.back ? 2.5 : 0) + blurIn * 14}px)`,
            }}
          >
            <Notif {...n} />
          </div>
        );
      })}
    </>
  );
};

/** Empresário em silhueta minimalista, diante do notebook. */
const Businessman: React.FC = () => {
  const f = useCurrentFrame();
  const p = spr(f, 4, {damping: 13, stiffness: 120});
  const bob = Math.sin(f * 0.5) * 2 * tw(f, 30, 60, 0, 1);
  const stress = tw(f, 30, 40, 0, 1);
  return (
    <div
      style={{
        position: 'absolute',
        left: 320,
        top: 800,
        width: 440,
        height: 506,
        opacity: tw(f, 4, 12, 0, 1),
        transform: `translateY(${(1 - p) * 160}px)`,
      }}
    >
      <svg width={440} height={506} viewBox="0 0 400 460" style={{overflow: 'visible'}}>
        <defs>
          <linearGradient id="suit" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1D5C46" />
            <stop offset="1" stopColor="#0A2E23" />
          </linearGradient>
          <linearGradient id="tie" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#F0D58C" />
            <stop offset="1" stopColor="#B08A34" />
          </linearGradient>
        </defs>
        <g transform={`translate(0 ${bob})`}>
          <rect x={178} y={168} width={44} height={50} rx={18} fill="#163F32" />
          <circle cx={200} cy={118} r={70} fill="url(#suit)" />
          {/* marcas de tensão */}
          {[0, 1, 2].map((k) => {
            const a = (-60 + k * 30) * (Math.PI / 180);
            const pulse = 0.6 + 0.4 * Math.sin(f * 0.6 + k);
            return (
              <line
                key={k}
                x1={200 + Math.sin(a) * 95}
                y1={118 - Math.cos(a) * 95}
                x2={200 + Math.sin(a) * (115 + 8 * pulse)}
                y2={118 - Math.cos(a) * (115 + 8 * pulse)}
                stroke={C.gold}
                strokeWidth={7}
                strokeLinecap="round"
                opacity={stress * pulse}
              />
            );
          })}
        </g>
        <path d="M 30 460 C 30 318 100 210 200 210 C 300 210 370 318 370 460 Z" fill="url(#suit)" />
        <path d="M 160 216 L 200 300 L 240 216 Z" fill="#F4F1EA" />
        <path d="M 191 236 L 209 236 L 216 330 L 200 352 L 184 330 Z" fill="url(#tie)" />
        <path d="M 150 220 L 196 312 L 168 322 Z" fill="#0A2E23" opacity={0.5} />
        <path d="M 250 220 L 204 312 L 232 322 Z" fill="#0A2E23" opacity={0.5} />
        {/* notebook */}
        <rect x={40} y={318} width={320} height={190} rx={18} fill="#08261D" />
        <rect x={40} y={318} width={320} height={190} rx={18} fill="none" stroke="rgba(235,208,138,0.35)" strokeWidth={2} />
        <circle cx={200} cy={410} r={14} fill="none" stroke="rgba(235,208,138,0.6)" strokeWidth={3} />
      </svg>
      <div style={{position: 'absolute', left: -200, right: -200, top: 506 - 6, height: 6, borderRadius: 3, background: C.ivoryDeep}} />
    </div>
  );
};

export const S1Hook: React.FC = () => {
  const f = useCurrentFrame();

  // câmera: empurrão lento + aceleração antes do corte
  const cam = tw(f, 0, 66, 1, 1.06) * tw(f, 62, 84, 1, 1.14, EASE_IN);
  const shake = tw(f, 40, 70, 0, 1) * 3;
  const camX = wobble(f, 1, 0.9) * shake;
  const camY = wobble(f, 2, 1.1) * shake;

  // transição: círculo verde nasce do notebook e cobre a tela
  const r = tw(f, 70, 88, 0, 2300, EASE_IN_OUT);

  // saldo diminuindo
  const bal = tw(f, 92, 124, 48720, 3115.4, EASE_IN_OUT);
  const balColor = interpolateColors(f, [104, 124], ['#F4F1EA', '#E8907C']);
  const balIn = spr(f, 84, {damping: 16});

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      {/* ---------- Cena clara: rotina acelerada ---------- */}
      <AbsoluteFill style={{transform: `scale(${cam}) translate(${camX}px, ${camY}px)`, transformOrigin: '50% 60%'}}>
        <IvoryBg />
        <Rings x={540} y={921} start={2} color={C.gold} count={3} maxR={700} />
        <NotifLayer back />
        <Businessman />
        <NotifLayer back={false} />
        <div style={{position: 'absolute', top: 250, left: 60, right: 60}}>
          <Words
            parts={[{t: 'Sua empresa'}]}
            at={6}
            style={{fontFamily: SANS, fontWeight: 600, fontSize: 84, color: C.ink, letterSpacing: '-0.02em'}}
          />
          <Words
            parts={[{t: 'vende.', s: {color: C.green}}]}
            at={13}
            style={{fontFamily: SANS, fontWeight: 800, fontSize: 132, letterSpacing: '-0.04em', marginTop: -6}}
          />
        </div>
      </AbsoluteFill>

      {/* ---------- Cena verde: o dinheiro desaparece ---------- */}
      <AbsoluteFill style={{clipPath: `circle(${r}px at 540px 1200px)`}}>
        <GreenBg />
        <div style={{position: 'absolute', top: 560, left: 0, right: 0, textAlign: 'center'}}>
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 30,
              letterSpacing: '0.28em',
              color: C.goldLight,
              opacity: tw(f, 84, 96, 0, 1) * tw(f, 132, 150, 1, 0),
            }}
          >
            SALDO EM CONTA
          </div>
          <div
            style={{
              marginTop: 10,
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 120,
              letterSpacing: '-0.03em',
              color: balColor,
              fontVariantNumeric: 'tabular-nums',
              transform: `scale(${0.8 + 0.2 * balIn})`,
              opacity: balIn,
              filter: `blur(${(1 - balIn) * 10}px)`,
            }}
          >
            {f < 128 ? brl(bal) : <Dissolve text={brl(3115.4)} start={128} per={1.2} />}
          </div>
        </div>
        {/* moedas escapando */}
        {Array.from({length: 12}).map((_, i) => {
          const s = 126 + i * 1.5;
          const t = tw(f, s, s + 26, 0, 1, EASE_OUT);
          if (t <= 0 || t >= 1) return null;
          const ang = rand(i + 1) * Math.PI * 2;
          const dist = 260 + rand(i + 9) * 380;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 540 + Math.cos(ang) * dist * t - 26,
                top: 680 + Math.sin(ang) * dist * t - 26 - t * 120,
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: 'linear-gradient(135deg,#F3DC97,#B08A34)',
                opacity: 1 - t,
                filter: `blur(${t * 6}px)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: 20,
                color: C.greenDeep,
              }}
            >
              R$
            </div>
          );
        })}
        <div style={{position: 'absolute', top: 900, left: 40, right: 40}}>
          <Words
            parts={[{t: 'Mas o dinheiro'}]}
            at={96}
            exitAt={142}
            exitMode="blur"
            style={{fontFamily: SANS, fontWeight: 600, fontSize: 86, color: '#F4F1EA', letterSpacing: '-0.02em'}}
          />
          <div style={{textAlign: 'center', marginTop: 6}}>
            {f < 134 ? (
              <Words
                parts={[{t: 'desaparece?', s: GOLD_TEXT}]}
                at={103}
                mode="blur"
                dur={18}
                style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 172, letterSpacing: '-0.01em'}}
              />
            ) : (
              <Dissolve
                text="desaparece?"
                start={134}
                per={1.6}
                style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 172, letterSpacing: '-0.01em', lineHeight: 1.05}}
                charStyle={{...GOLD_TEXT, padding: '0.14em 0.04em 0.16em', margin: '-0.14em -0.04em -0.16em'}}
              />
            )}
          </div>
        </div>
      </AbsoluteFill>

      {/* ---------- Som ---------- */}
      <Sfx name="pop" at={2} volume={0.4} />
      {NOTIFS.map((n, i) => (
        <Sfx key={i} name={i % 2 ? 'ping-low' : 'ping'} at={n.at + 2} volume={0.16 + (n.tone === 'alert' ? 0.06 : 0)} />
      ))}
      <Sfx name="whoosh" at={66} volume={0.55} />
      <Sfx name="swish" at={95} volume={0.3} />
      {Array.from({length: 11}).map((_, i) => (
        <Sfx key={`t${i}`} name="tick" at={92 + i * 3} volume={0.12} />
      ))}
      <Sfx name="dissolve" at={127} volume={0.45} />
    </AbsoluteFill>
  );
};
