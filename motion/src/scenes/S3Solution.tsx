import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {EASE_IN, EASE_IN_OUT, EASE_OUT, brl, rand, spr, tw} from '../anim';
import {IvoryBg, Rings} from '../components/Backgrounds';
import {Cursor} from '../components/Cursor';
import {LogoMark} from '../components/Logo';
import {Words} from '../components/Words';
import {Check, Illustrative, Sfx} from '../components/UI';
import {C, SANS, SERIF} from '../theme';

const CATS = {
  Receitas: {c: C.greenMid, bg: '#E1EEE6'},
  Fornecedores: {c: C.goldDeep, bg: '#F5EBD2'},
  Pessoal: {c: '#3E6B8A', bg: '#E2EBF2'},
  Impostos: {c: C.coral, bg: C.coralSoft},
};
type Cat = keyof typeof CATS;

const ROWS: {name: string; cat: Cat; v: number}[] = [
  {name: 'Venda · Cartão', cat: 'Receitas', v: 1280},
  {name: 'Pix · Loja Centro', cat: 'Receitas', v: 640},
  {name: 'Embalagens', cat: 'Fornecedores', v: -2350},
  {name: 'Matéria-prima', cat: 'Fornecedores', v: -3480},
  {name: 'Salários', cat: 'Pessoal', v: -9200},
  {name: 'DAS · Simples', cat: 'Impostos', v: -1912.4},
];

const CARD = {x: 70, y: 560, w: 940, h: 820};
const CLICK = 60;

const Dashboard: React.FC = () => {
  const f = useCurrentFrame();
  const enter = spr(f, 6, {damping: 18, stiffness: 120});
  const press = f >= CLICK - 2 && f < CLICK + 5 ? 0.94 : 1;
  const done = f >= CLICK + 2;
  const total = tw(f, 82, 112, 0, 18640, EASE_OUT);
  const bars = [
    {w: 46, c: C.greenMid},
    {w: 20, c: C.gold},
    {w: 22, c: '#3E6B8A'},
    {w: 12, c: C.coral},
  ];
  return (
    <div
      style={{
        position: 'absolute',
        left: CARD.x,
        top: CARD.y,
        width: CARD.w,
        height: CARD.h,
        borderRadius: 48,
        background: C.paper,
        boxShadow: '0 50px 100px rgba(10,46,35,0.16), 0 6px 18px rgba(10,46,35,0.06)',
        transform: `translateY(${(1 - enter) * 80}px) scale(${0.94 + 0.06 * enter})`,
        opacity: enter,
        fontFamily: SANS,
        padding: '38px 44px',
        boxSizing: 'border-box',
      }}
    >
      {/* cabeçalho */}
      <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
        <div style={{width: 74, height: 74, borderRadius: 22, background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <LogoMark at={0} size={52} static />
        </div>
        <div style={{flex: 1}}>
          <div style={{fontSize: 32, fontWeight: 800, color: C.ink}}>Painel financeiro</div>
          <div style={{fontSize: 22, fontWeight: 600, color: C.muted}}>Este mês</div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '16px 28px',
            borderRadius: 999,
            background: done ? C.gold : C.green,
            color: done ? C.greenInk : C.ivory,
            fontSize: 26,
            fontWeight: 800,
            transform: `scale(${press})`,
            boxShadow: '0 10px 24px rgba(14,59,46,0.22)',
          }}
        >
          {done ? 'Tudo em dia ✓' : 'Conciliar'}
        </div>
      </div>

      {/* categorias */}
      <div style={{display: 'flex', gap: 12, marginTop: 30}}>
        {(Object.keys(CATS) as Cat[]).map((k, i) => {
          const p = spr(f, 36 + i * 3, {damping: 12, stiffness: 200});
          return (
            <div
              key={k}
              style={{
                padding: '10px 20px',
                borderRadius: 999,
                background: CATS[k].bg,
                color: CATS[k].c,
                fontSize: 22,
                fontWeight: 800,
                transform: `scale(${p})`,
                opacity: Math.min(1, p),
              }}
            >
              {k}
            </div>
          );
        })}
      </div>

      {/* lançamentos: chegam bagunçados e se alinham */}
      <div style={{marginTop: 22}}>
        {ROWS.map((r, i) => {
          const s = 10 + i * 4;
          const p = spr(f, s, {damping: 16, stiffness: 120});
          const sx = (rand(i + 2) - 0.5) * 1100;
          const sy = (rand(i + 7) - 0.5) * 1300 - 200;
          const rot = (rand(i + 4) - 0.5) * 40;
          const tag = spr(f, 40 + i * 3);
          const chk = tw(f, CLICK + 4 + i * 3, CLICK + 14 + i * 3, 0, 1);
          const cat = CATS[r.cat];
          return (
            <div
              key={r.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                height: 68,
                borderBottom: i < ROWS.length - 1 ? `2px solid ${C.line}` : undefined,
                transform: `translate(${sx * (1 - p)}px, ${sy * (1 - p)}px) rotate(${rot * (1 - p)}deg)`,
                filter: `blur(${tw(f, s, s + 10, 10, 0)}px)`,
                opacity: f < s ? 0 : 1,
              }}
            >
              <div style={{width: 16, height: 16, borderRadius: 8, background: cat.c}} />
              <div style={{fontSize: 28, fontWeight: 700, color: C.ink, flex: 1}}>{r.name}</div>
              <div
                style={{
                  padding: '6px 14px',
                  borderRadius: 999,
                  background: cat.bg,
                  color: cat.c,
                  fontSize: 19,
                  fontWeight: 800,
                  opacity: tag,
                  transform: `translateX(${(1 - tag) * 20}px)`,
                }}
              >
                {r.cat}
              </div>
              <div
                style={{
                  width: 200,
                  textAlign: 'right',
                  fontSize: 28,
                  fontWeight: 800,
                  color: r.v > 0 ? C.greenMid : C.ink,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {r.v > 0 ? '+' : ''}
                {brl(r.v)}
              </div>
              <div style={{width: 40}}>
                <Check size={36} p={chk} />
              </div>
            </div>
          );
        })}
      </div>

      {/* resumo */}
      <div style={{marginTop: 26, opacity: tw(f, 78, 90, 0, 1)}}>
        <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-between'}}>
          <div style={{fontSize: 24, fontWeight: 700, color: C.muted, letterSpacing: '0.04em'}}>Saldo projetado</div>
          <div style={{fontSize: 46, fontWeight: 800, color: C.green, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em'}}>
            {brl(total)}
          </div>
        </div>
        <div style={{display: 'flex', gap: 6, marginTop: 14, height: 16}}>
          {bars.map((b, i) => (
            <div key={i} style={{width: `${b.w * tw(f, 84 + i * 4, 104 + i * 4, 0, 1, EASE_OUT)}%`, background: b.c, borderRadius: 8}} />
          ))}
        </div>
        <Illustrative style={{marginTop: 18, fontSize: 18}} />
      </div>
    </div>
  );
};

export const S3Solution: React.FC = () => {
  const f = useCurrentFrame();
  const r = tw(f, 0, 18, 26, 1400, EASE_IN_OUT);
  const push = tw(f, 0, 136, 1, 1.04);
  const exit = tw(f, 134, 150, 0, 1, EASE_IN);

  return (
    <AbsoluteFill style={{background: C.night, overflow: 'hidden'}}>
      <AbsoluteFill style={{clipPath: `circle(${r}px at 540px 960px)`}}>
        <AbsoluteFill
          style={{
            transform: `translateY(${-exit * 520}px) scale(${push})`,
            filter: `blur(${exit * 26}px)`,
          }}
        >
          <IvoryBg drift={330} />
          <Rings x={540} y={960} start={2} color={C.gold} count={3} maxR={1100} life={36} />
          <div style={{position: 'absolute', top: 240, left: 40, right: 40}}>
            <Words
              parts={[{t: 'A', s: {fontFamily: SANS, fontWeight: 600, color: C.ink, fontSize: 92}}, {t: 'Candidus', s: {fontFamily: SERIF, color: C.green, fontSize: 132}}]}
              at={13}
              stagger={4}
              style={{alignItems: 'baseline', letterSpacing: '-0.01em', fontSize: 92}}
            />
            <Words
              parts={[{t: 'organiza seu financeiro.', s: {color: C.green}}]}
              at={24}
              stagger={3}
              style={{fontFamily: SANS, fontWeight: 800, fontSize: 72, letterSpacing: '-0.03em', marginTop: 2}}
            />
          </div>
          <Dashboard />
          <Cursor
            keys={[
              {f: 34, x: 1000, y: 1560},
              {f: 56, x: 870, y: 636},
              {f: 72, x: 880, y: 650},
              {f: 96, x: 1010, y: 1560},
            ]}
            clicks={[CLICK]}
          />
        </AbsoluteFill>
      </AbsoluteFill>

      <Sfx name="boom" at={0} volume={0.5} />
      <Sfx name="swish" at={8} volume={0.35} />
      {ROWS.map((_, i) => (
        <Sfx key={i} name="pop" at={20 + i * 4} volume={0.16} />
      ))}
      <Sfx name="click" at={CLICK} volume={0.6} />
      <Sfx name="ping" at={CLICK + 4} volume={0.22} />
      {Array.from({length: 9}).map((_, i) => (
        <Sfx key={`t${i}`} name="tick" at={84 + i * 3} volume={0.1} />
      ))}
      <Sfx name="whoosh" at={132} volume={0.5} />
    </AbsoluteFill>
  );
};
