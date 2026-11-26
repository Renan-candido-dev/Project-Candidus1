import React from 'react';
import {useCurrentFrame} from 'remotion';
import {EASE_IN_OUT, brl, spr, tw} from '../anim';
import {Illustrative} from '../components/UI';
import {C, SANS} from '../theme';
import {Card, Fill, Headline, SceneBase, SceneBg, cueAt, isDark} from './common';

type Props = SceneBase & {
  headline?: string[];
  /** despesas fixas mensais (R$) */
  fixed: number;
  /** custos variáveis como fração da receita (ex.: 0,4) */
  variable: number;
  maxRevenue: number;
  cues4?: [number, number, number, number];
};

const CW = 860;
const CH = 520;

/** Ponto de equilíbrio introdutório: receita × custos totais (fixos + variáveis). */
export const BreakevenScene: React.FC<Props> = ({dur, cues, bg = 'ivory', headline, fixed, variable, maxRevenue, cues4 = [0, 0, 1, 1]}) => {
  const f = useCurrentFrame();
  const dark = isDark(bg);
  const s0 = Math.max(4, cueAt(cues, 0, 10) - 6);
  const enter = spr(f, s0 - 4, {damping: 18, stiffness: 120});
  const push = tw(f, 0, dur, 1, 1.03);
  const be = fixed / (1 - variable);
  const maxY = Math.max(maxRevenue, fixed + variable * maxRevenue) * 1.08;
  const x = (r: number) => (r / maxRevenue) * CW;
  const y = (v: number) => CH - (v / maxY) * CH;
  const a = cues4.map((c, i) => cueAt(cues, c, s0 + i * 18) + (i % 2 ? 14 : 0));
  const pFixed = tw(f, a[0], a[0] + 20, 0, 1, EASE_IN_OUT);
  const pCost = tw(f, a[1], a[1] + 24, 0, 1, EASE_IN_OUT);
  const pRev = tw(f, a[2], a[2] + 24, 0, 1, EASE_IN_OUT);
  const pBe = spr(f, a[3] + 10, {damping: 11, stiffness: 190});
  const shade = tw(f, a[3] + 14, a[3] + 30, 0, 1);

  const costPath = `M ${x(0)} ${y(fixed)} L ${x(maxRevenue * pCost)} ${y(fixed + variable * maxRevenue * pCost)}`;
  const revPath = `M ${x(0)} ${y(0)} L ${x(maxRevenue * pRev)} ${y(maxRevenue * pRev)}`;
  const k = (v: number) => `R$ ${Math.round(v / 1000)} mil`;

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
            top: headline ? 560 : 380,
            height: 800,
            padding: '34px 50px',
            transform: `translateY(${(1 - enter) * 90}px) scale(${0.94 + 0.06 * enter})`,
            opacity: enter,
          }}
        >
          <div style={{display: 'flex', flexWrap: 'wrap', gap: 22, fontSize: 21, fontWeight: 700, color: C.muted}}>
            {[
              ['Despesas fixas', C.gold, pFixed],
              ['Custos totais', C.coral, pCost],
              ['Receita', C.green, pRev],
            ].map(([l, c, p]) => (
              <div key={l as string} style={{display: 'flex', alignItems: 'center', gap: 8, opacity: 0.3 + 0.7 * (p as number)}}>
                <div style={{width: 26, height: 6, borderRadius: 3, background: c as string}} />
                {l as string}
              </div>
            ))}
          </div>
          <svg width={CW} height={CH + 60} style={{marginTop: 40, overflow: 'visible'}}>
            <line x1={0} x2={CW} y1={CH} y2={CH} stroke={C.line} strokeWidth={3} />
            <line x1={0} x2={0} y1={0} y2={CH} stroke={C.line} strokeWidth={3} />
            <text x={CW} y={CH + 40} textAnchor="end" fontSize={20} fontWeight={700} fill={C.muted} fontFamily={SANS}>
              Vendas no mês →
            </text>
            {/* áreas de prejuízo e lucro */}
            <path d={`M ${x(0)} ${y(fixed)} L ${x(be)} ${y(be)} L ${x(0)} ${y(0)} Z`} fill="rgba(212,100,79,0.14)" opacity={shade} />
            <path
              d={`M ${x(be)} ${y(be)} L ${x(maxRevenue)} ${y(maxRevenue)} L ${x(maxRevenue)} ${y(fixed + variable * maxRevenue)} Z`}
              fill="rgba(29,92,70,0.14)"
              opacity={shade}
            />
            <text x={x(be * 0.32)} y={y(fixed * 0.55)} fontSize={24} fontWeight={800} fill={C.coral} fontFamily={SANS} opacity={shade}>
              prejuízo
            </text>
            <text x={x(maxRevenue * 0.86)} y={y(maxRevenue * 0.8)} textAnchor="middle" fontSize={24} fontWeight={800} fill={C.greenMid} fontFamily={SANS} opacity={shade}>
              lucro
            </text>
            <line x1={0} x2={x(maxRevenue) * pFixed} y1={y(fixed)} y2={y(fixed)} stroke={C.gold} strokeWidth={5} strokeDasharray="14 10" />
            <path d={costPath} stroke={C.coral} strokeWidth={8} strokeLinecap="round" fill="none" opacity={pCost > 0 ? 1 : 0} />
            <path d={revPath} stroke={C.green} strokeWidth={8} strokeLinecap="round" fill="none" opacity={pRev > 0 ? 1 : 0} />
            <g opacity={Math.min(1, pBe)}>
              <line x1={x(be)} x2={x(be)} y1={y(be)} y2={CH} stroke={C.ink} strokeWidth={3} strokeDasharray="6 6" />
              <circle cx={x(be)} cy={y(be)} r={16 * pBe} fill={C.gold} stroke={C.paper} strokeWidth={5} />
              <g transform={`translate(${x(be) - 190} ${y(be) - 120})`}>
                <rect width={380} height={80} rx={22} fill={C.green} />
                <text x={190} y={34} textAnchor="middle" fontSize={21} fontWeight={700} fill="rgba(244,241,234,0.75)" fontFamily={SANS}>
                  Ponto de equilíbrio
                </text>
                <text x={190} y={64} textAnchor="middle" fontSize={27} fontWeight={800} fill={C.goldLight} fontFamily={SANS}>
                  ≈ {k(be)} em vendas
                </text>
              </g>
            </g>
          </svg>
          <div style={{display: 'flex', gap: 16, marginTop: 6, fontSize: 21, fontWeight: 700, color: C.muted, opacity: shade}}>
            <span>Fixas {brl(fixed, 0)}</span>·<span>Variáveis {Math.round(variable * 100)}% das vendas</span>
          </div>
          <Illustrative style={{position: 'absolute', left: 50, bottom: 24, fontSize: 17}} />
        </Card>
      </Fill>
    </Fill>
  );
};
