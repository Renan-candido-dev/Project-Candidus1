import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {EASE_IN, EASE_IN_OUT, EASE_OUT, brl, spr, tw} from '../anim';
import {GreenBg, IvoryBg} from '../components/Backgrounds';
import {Words} from '../components/Words';
import {Check, Illustrative, Sfx} from '../components/UI';
import {C, GOLD_TEXT, SANS, SERIF} from '../theme';

const cardStyle: React.CSSProperties = {
  position: 'absolute',
  left: 70,
  width: 940,
  borderRadius: 48,
  background: C.paper,
  boxShadow: '0 50px 100px rgba(10,46,35,0.14), 0 6px 18px rgba(10,46,35,0.05)',
  fontFamily: SANS,
  boxSizing: 'border-box',
};

const Headline: React.FC<{a: string; b: string; at: number}> = ({a, b, at}) => (
  <div style={{position: 'absolute', top: 270, left: 40, right: 40}}>
    <Words
      parts={[{t: a, s: {fontWeight: 500, color: C.ink}}, {t: b, s: {fontWeight: 800, color: C.green}}]}
      at={at}
      stagger={4}
      style={{fontFamily: SANS, fontSize: 112, letterSpacing: '-0.035em'}}
    />
  </div>
);

/* ---------------- a) Fluxo de caixa ---------------- */
const IN = [42, 48, 45, 55, 60, 66];
const OUT = [38, 40, 36, 41, 43, 45];
const MONTHS = ['Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out'];

const CashFlow: React.FC = () => {
  const f = useCurrentFrame();
  const chartH = 430;
  const max = 70;
  const colW = 130;
  const left = 50;
  const saldo = IN.map((v, i) => IN.slice(0, i + 1).reduce((s, x, k) => s + x - OUT[k], 0));
  const sy = (v: number) => chartH - 70 - (v / 73) * (chartH - 150);
  const pts = saldo.map((v, i) => [left + i * colW + colW / 2, sy(v)]);
  const d = pts.map((p, i) => `${i ? 'L' : 'M'} ${p[0]} ${p[1]}`).join(' ');
  const draw = tw(f, 14, 42, 0, 1, EASE_IN_OUT);
  const lastP = spr(f, 40, {damping: 11, stiffness: 200});
  return (
    <div style={{...cardStyle, top: 540, height: 800, padding: '40px 44px'}}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div style={{fontSize: 36, fontWeight: 800, color: C.ink}}>Fluxo de caixa</div>
        <div style={{display: 'flex', gap: 22, fontSize: 21, fontWeight: 700, color: C.muted}}>
          {[
            ['Entradas', C.gold],
            ['Saídas', '#BFD4C8'],
            ['Saldo', C.green],
          ].map(([l, c]) => (
            <div key={l} style={{display: 'flex', alignItems: 'center', gap: 8}}>
              <div style={{width: 16, height: 16, borderRadius: 5, background: c}} />
              {l}
            </div>
          ))}
        </div>
      </div>
      <svg width={852} height={chartH + 80} style={{marginTop: 50, overflow: 'visible'}}>
        <defs>
          <linearGradient id="barGold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#E9CB7C" />
            <stop offset="1" stopColor="#B8902F" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((k) => (
          <line key={k} x1={0} x2={852} y1={(k * chartH) / 3} y2={(k * chartH) / 3} stroke={C.line} strokeWidth={2} />
        ))}
        {IN.map((v, i) => {
          const p = spr(f, 4 + i * 2, {damping: 15, stiffness: 140});
          const pO = spr(f, 6 + i * 2, {damping: 15, stiffness: 140});
          const x = left + i * colW + 22;
          const hi = (v / max) * chartH * p;
          const ho = (OUT[i] / max) * chartH * pO;
          return (
            <g key={i}>
              <rect x={x} y={chartH - hi} width={40} height={hi} rx={10} fill="url(#barGold)" />
              <rect x={x + 46} y={chartH - ho} width={40} height={ho} rx={10} fill="#C9DACF" />
              <text x={x + 43} y={chartH + 48} textAnchor="middle" fontSize={24} fontWeight={700} fill={C.muted} fontFamily={SANS}>
                {MONTHS[i]}
              </text>
            </g>
          );
        })}
        <path
          d={d}
          fill="none"
          stroke={C.green}
          strokeWidth={8}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={1 - draw}
        />
        {pts.map((p, i) => {
          const s = tw(f, 14 + i * 5, 20 + i * 5, 0, 1);
          return <circle key={i} cx={p[0]} cy={p[1]} r={11 * s} fill={C.paper} stroke={C.green} strokeWidth={6} />;
        })}
        <g transform={`translate(${pts[5][0] - 150} ${pts[5][1] - 92}) scale(${lastP})`} style={{transformOrigin: '150px 70px'}}>
          <rect width={190} height={60} rx={30} fill={C.green} />
          <text x={95} y={40} textAnchor="middle" fontSize={27} fontWeight={800} fill={C.goldLight} fontFamily={SANS}>
            +R$ 73 mil
          </text>
        </g>
      </svg>
      <Illustrative style={{position: 'absolute', left: 44, bottom: 30, fontSize: 18}} />
    </div>
  );
};

/* ---------------- b) Contas a pagar e a receber ---------------- */
const Ring: React.FC<{p: number; color: string; label: string; size?: number}> = ({p, color, label, size = 210}) => {
  const r = size / 2 - 14;
  const circ = 2 * Math.PI * r;
  return (
    <div style={{position: 'relative', width: size, height: size}}>
      <svg width={size} height={size} style={{transform: 'rotate(-90deg)'}}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#EEF2EF" strokeWidth={20} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={20} strokeLinecap="round" strokeDasharray={`${circ * p} ${circ}`} />
      </svg>
      <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontSize: 48, fontWeight: 800, color: C.ink, fontVariantNumeric: 'tabular-nums'}}>{Math.round(p * 100)}%</div>
        <div style={{fontSize: 20, fontWeight: 700, color: C.muted}}>{label}</div>
      </div>
    </div>
  );
};

const Bills: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame() - at;
  const cards = [
    {
      title: 'A receber',
      total: 32400,
      ring: 0.72,
      ringLabel: 'recebido',
      color: C.gold,
      items: [
        ['Dia 05', 'Cliente A', 8200],
        ['Dia 12', 'Cliente B', 5600],
      ] as [string, string, number][],
    },
    {
      title: 'A pagar',
      total: 18950,
      ring: 0.54,
      ringLabel: 'pago',
      color: C.green,
      items: [
        ['Dia 10', 'Fornecedor', 3480],
        ['Dia 20', 'Impostos', 1912.4],
      ] as [string, string, number][],
    },
  ];
  return (
    <>
      {cards.map((c, ci) => {
        const e = spr(f, ci * 5, {damping: 17, stiffness: 130});
        return (
          <div
            key={c.title}
            style={{
              ...cardStyle,
              top: 540 + ci * 410,
              height: 380,
              padding: '36px 44px',
              transform: `translateX(${(1 - e) * 300}px)`,
              opacity: e,
              display: 'flex',
              gap: 30,
            }}
          >
            <div style={{flex: 1}}>
              <div style={{fontSize: 26, fontWeight: 700, color: C.muted, letterSpacing: '0.04em'}}>{c.title}</div>
              <div style={{fontSize: 64, fontWeight: 800, color: C.ink, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums'}}>
                {brl(tw(f, 4 + ci * 5, 34 + ci * 5, 0, c.total, EASE_OUT), 0)}
              </div>
              <div style={{marginTop: 16}}>
                {c.items.map(([day, who, v], ii) => {
                  const chk = tw(f, 22 + ci * 8 + ii * 6, 32 + ci * 8 + ii * 6, 0, 1);
                  return (
                    <div
                      key={who}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                        height: 60,
                        borderTop: `2px solid ${C.line}`,
                        fontSize: 24,
                        fontWeight: 700,
                        color: C.ink,
                      }}
                    >
                      <span style={{color: C.muted, width: 92}}>{day}</span>
                      <span style={{flex: 1}}>{who}</span>
                      <span style={{fontVariantNumeric: 'tabular-nums'}}>{brl(v)}</span>
                      <Check size={32} p={chk} color={c.color === C.gold ? C.goldDeep : C.green} />
                    </div>
                  );
                })}
              </div>
            </div>
            <Ring p={c.ring * tw(f, 8 + ci * 5, 40 + ci * 5, 0, 1, EASE_OUT)} color={c.color} label={c.ringLabel} />
          </div>
        );
      })}
    </>
  );
};

/* ---------------- c) Indicadores ---------------- */
const Kpis: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame() - at;
  const g = tw(f, 4, 40, 0, 0.86, EASE_OUT);
  const R = 175;
  const circ = 2 * Math.PI * R;
  const tiles = [
    {l: 'Lucro do mês', v: `R$ ${(12.4 * tw(f, 14, 40, 0, 1)).toFixed(1).replace('.', ',')} mil`, d: '+18%'},
    {l: 'Margem', v: `${Math.round(24 * tw(f, 18, 44, 0, 1))}%`, d: '+3 p.p.'},
    {l: 'Caixa 90 dias', v: 'Positivo', d: '✓'},
  ];
  return (
    <>
      <div style={{position: 'absolute', left: 540 - 210, top: 640, width: 420, height: 420}}>
        <svg width={420} height={420} style={{transform: 'rotate(-90deg)'}}>
          <defs>
            <linearGradient id="gaugeG" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#F3DC97" />
              <stop offset="1" stopColor="#A98330" />
            </linearGradient>
          </defs>
          <circle cx={210} cy={210} r={R} fill="none" stroke="rgba(14,59,46,0.08)" strokeWidth={30} />
          <circle cx={210} cy={210} r={R} fill="none" stroke="url(#gaugeG)" strokeWidth={30} strokeLinecap="round" strokeDasharray={`${circ * g} ${circ}`} />
        </svg>
        <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: SANS}}>
          <div style={{fontSize: 112, fontWeight: 800, color: C.green, letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums'}}>{Math.round(g * 100)}%</div>
          <div style={{fontSize: 26, fontWeight: 700, color: C.muted, marginTop: -6}}>da meta do mês</div>
        </div>
      </div>
      <div style={{position: 'absolute', top: 1110, left: 70, width: 940, display: 'flex', gap: 16}}>
        {tiles.map((t, i) => {
          const p = spr(f, 10 + i * 4, {damping: 13, stiffness: 170});
          return (
            <div
              key={t.l}
              style={{
                flex: 1,
                padding: '26px 24px',
                borderRadius: 32,
                background: i === 2 ? C.green : C.paper,
                boxShadow: '0 24px 50px rgba(10,46,35,0.12)',
                transform: `translateY(${(1 - p) * 120}px)`,
                opacity: Math.min(1, p),
                fontFamily: SANS,
              }}
            >
              <div style={{fontSize: 21, fontWeight: 700, color: i === 2 ? 'rgba(244,241,234,0.7)' : C.muted}}>{t.l}</div>
              <div style={{fontSize: 38, fontWeight: 800, color: i === 2 ? C.goldLight : C.ink, marginTop: 6, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap'}}>
                {t.v}
              </div>
              <div
                style={{
                  display: 'inline-block',
                  marginTop: 10,
                  padding: '4px 12px',
                  borderRadius: 999,
                  fontSize: 19,
                  fontWeight: 800,
                  background: i === 2 ? 'rgba(235,208,138,0.18)' : '#E1EEE6',
                  color: i === 2 ? C.goldLight : C.greenMid,
                }}
              >
                {t.d}
              </div>
            </div>
          );
        })}
      </div>
      <Illustrative style={{position: 'absolute', top: 1330, left: 0, right: 0, textAlign: 'center', fontSize: 18}} />
    </>
  );
};

const RECAP = [
  {a: 'Mais', b: 'controle.'},
  {a: 'Mais', b: 'clareza.'},
  {a: 'Decisões', b: 'melhores.'},
];

export const S4Benefits: React.FC = () => {
  const f = useCurrentFrame();

  // a → b: chicote horizontal; b → c: zoom através
  const aIn = tw(f, 0, 14, 1, 0, EASE_OUT);
  const aOut = tw(f, 50, 62, 0, 1, EASE_IN);
  const bIn = tw(f, 52, 66, 1, 0, EASE_OUT);
  const bOut = tw(f, 104, 116, 0, 1, EASE_IN);
  const cIn = tw(f, 106, 122, 1, 0, EASE_OUT);
  const cOut = tw(f, 160, 172, 0, 1, EASE_IN);
  const flood = tw(f, 203, 225, 0, 2300, EASE_IN_OUT);

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <IvoryBg drift={480} />

      {f < 64 && (
        <AbsoluteFill
          style={{
            transform: `translate(${-aOut * 1080}px, ${aIn * 520}px)`,
            filter: `blur(${(aIn + aOut) * 26}px)`,
          }}
        >
          <Headline a="Mais" b="controle." at={2} />
          <CashFlow />
        </AbsoluteFill>
      )}

      {f >= 50 && f < 118 && (
        <AbsoluteFill
          style={{
            transform: `translateX(${bIn * 1080}px) scale(${1 + bOut * 0.35})`,
            filter: `blur(${(bIn + bOut) * 24}px)`,
            opacity: 1 - bOut,
          }}
        >
          <Headline a="Mais" b="clareza." at={56} />
          <Bills at={56} />
        </AbsoluteFill>
      )}

      {f >= 104 && (
        <AbsoluteFill
          style={{
            transform: `scale(${0.82 + 0.18 * (1 - cIn)})`,
            filter: `blur(${cIn * 20}px)`,
            opacity: 1 - cIn,
          }}
        >
          <div style={{position: 'absolute', top: 240, left: 40, right: 40}}>
            <Words
              parts={[{t: 'Decisões', s: {color: C.green}}]}
              at={110}
              exitAt={160}
              exitMode="blur"
              style={{fontFamily: SANS, fontWeight: 800, fontSize: 116, letterSpacing: '-0.04em'}}
            />
            <Words
              parts={[{t: 'melhores.', s: GOLD_TEXT}]}
              at={116}
              mode="blur"
              exitAt={161}
              exitMode="blur"
              style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 150, marginTop: -16}}
            />
          </div>
          <AbsoluteFill style={{opacity: 1 - cOut, filter: `blur(${cOut * 20}px)`, transform: `scale(${1 - cOut * 0.06})`}}>
            <Kpis at={110} />
          </AbsoluteFill>
        </AbsoluteFill>
      )}

      {/* recapitulação */}
      {f >= 166 && (
        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
          <div style={{display: 'flex', flexDirection: 'column', gap: 34, marginTop: -80}}>
            {RECAP.map((r, i) => {
              const s = 168 + i * 6;
              const p = spr(f, s, {damping: 14, stiffness: 180});
              return (
                <div key={r.b} style={{display: 'flex', alignItems: 'center', gap: 28}}>
                  <div style={{transform: `scale(${p})`}}>
                    <Check size={74} p={tw(f, s, s + 10, 0, 1)} color={C.gold} />
                  </div>
                  <Words
                    parts={[{t: r.a, s: {fontWeight: 500, color: C.ink}}, {t: r.b, s: {fontWeight: 800, color: C.green}}]}
                    at={s + 1}
                    style={{fontFamily: SANS, fontSize: 84, letterSpacing: '-0.03em', justifyContent: 'flex-start'}}
                  />
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      )}

      {/* inundação verde para o encerramento */}
      {flood > 0 && (
        <AbsoluteFill style={{clipPath: `circle(${flood}px at 540px 960px)`}}>
          <GreenBg />
        </AbsoluteFill>
      )}

      <Sfx name="swish" at={0} volume={0.35} />
      {IN.map((_, i) => (
        <Sfx key={`b${i}`} name="pop" at={6 + i * 2} volume={0.12} />
      ))}
      <Sfx name="whoosh" at={49} volume={0.45} />
      {[0, 1, 2, 3].map((i) => (
        <Sfx key={`c${i}`} name="click" at={56 + 22 + Math.floor(i / 2) * 8 + (i % 2) * 6} volume={0.3} />
      ))}
      <Sfx name="whoosh-down" at={102} volume={0.4} />
      {[0, 1, 2].map((i) => (
        <Sfx key={`r${i}`} name="pop-high" at={168 + i * 6} volume={0.3} />
      ))}
      <Sfx name="whoosh" at={200} volume={0.5} />
    </AbsoluteFill>
  );
};
