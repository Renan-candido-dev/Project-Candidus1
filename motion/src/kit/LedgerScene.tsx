import React from 'react';
import {interpolateColors, useCurrentFrame} from 'remotion';
import {EASE_IN_OUT, brl, rand, spr, tw} from '../anim';
import {Check, Illustrative} from '../components/UI';
import {C, SANS} from '../theme';
import {Card, Fill, Headline, SceneBase, SceneBg, cueAt, isDark} from './common';

export const CAT_COLORS: Record<string, {c: string; bg: string}> = {
  Receitas: {c: C.greenMid, bg: '#E1EEE6'},
  Vendas: {c: C.greenMid, bg: '#E1EEE6'},
  Fornecedores: {c: C.goldDeep, bg: '#F5EBD2'},
  Folha: {c: '#3E6B8A', bg: '#E2EBF2'},
  Pessoal: {c: '#3E6B8A', bg: '#E2EBF2'},
  Impostos: {c: C.coral, bg: C.coralSoft},
  Tributos: {c: C.coral, bg: C.coralSoft},
  Operacionais: {c: '#55707A', bg: '#E6ECEE'},
  'Despesas fixas': {c: '#55707A', bg: '#E6ECEE'},
  Assinaturas: {c: '#7A5C8F', bg: '#EEE6F3'},
  'Gasto pessoal': {c: '#9B4F7A', bg: '#F5E3EC'},
  Taxas: {c: '#8A6D3B', bg: '#F1E9DA'},
  'A receber': {c: C.greenMid, bg: '#E1EEE6'},
  'A pagar': {c: C.coral, bg: C.coralSoft},
  Custos: {c: C.goldDeep, bg: '#F5EBD2'},
};
export const catColor = (k?: string) => (k && CAT_COLORS[k]) || {c: C.muted, bg: '#ECEFED'};

export type Row = {name: string; v: number; cat?: string; date?: string};
type Flag = {cue: number; rows: number[]; label: string; tone?: 'coral' | 'gold'};

type Props = SceneBase & {
  headline?: string[];
  title: string;
  subtitle?: string;
  rows: Row[];
  /** 'sort': lançamentos chegam espalhados e se alinham; 'list': entram em cascata */
  mode?: 'sort' | 'list';
  tagCue?: number;
  flags?: Flag[];
  remove?: {cue: number; rows: number[]};
  checkCue?: number;
  total?: string;
  headSize?: number;
};

const ROW_H = 70;

export const LedgerScene: React.FC<Props> = ({
  dur,
  cues,
  bg = 'ivory',
  headline,
  title,
  subtitle,
  rows,
  mode = 'list',
  tagCue,
  flags = [],
  remove,
  checkCue,
  total,
  headSize = 80,
}) => {
  const f = useCurrentFrame();
  const dark = isDark(bg);
  const s0 = Math.max(4, cueAt(cues, 0, 10) - 6);
  const enter = spr(f, s0 - 4, {damping: 18, stiffness: 120});
  const tagAt = tagCue !== undefined ? cueAt(cues, tagCue, s0 + 40) : -1;
  const rmAt = remove ? cueAt(cues, remove.cue, s0 + 60) + 10 : -1;
  const chkAt = checkCue !== undefined ? cueAt(cues, checkCue, s0 + 60) : -1;
  const removed = (i: number) => (remove && remove.rows.includes(i) ? tw(f, rmAt, rmAt + 16, 0, 1, EASE_IN_OUT) : 0);
  const sumNow = rows.reduce((s, r, i) => s + r.v * (1 - removed(i)), 0);
  const top = headline ? 560 : 300;
  const push = tw(f, 0, dur, 1, 1.035);

  // posição de cada linha considerando as que estão saindo
  let yAcc = 0;
  const ys = rows.map((_, i) => {
    const y = yAcc;
    yAcc += ROW_H * (1 - removed(i));
    return y;
  });

  return (
    <Fill>
      <SceneBg bg={bg} drift={dur} />
      <Fill style={{transform: `scale(${push})`}}>
        {headline && <Headline lines={headline} at={s0} dark={dark} size={headSize} top={250} />}
        <Card
          style={{
            position: 'absolute',
            left: 60,
            width: 960,
            top,
            padding: '36px 40px 30px',
            transform: `translateY(${(1 - enter) * 90}px) scale(${0.94 + 0.06 * enter})`,
            opacity: enter,
          }}
        >
          <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-between'}}>
            <div style={{fontSize: 34, fontWeight: 800, color: C.ink}}>{title}</div>
            {subtitle && <div style={{fontSize: 22, fontWeight: 700, color: C.muted}}>{subtitle}</div>}
          </div>
          <div style={{position: 'relative', height: yAcc, marginTop: 18}}>
            {rows.map((r, i) => {
              const s = s0 + 4 + i * 4;
              const p = spr(f, s, {damping: 16, stiffness: mode === 'sort' ? 110 : 170});
              const sx = mode === 'sort' ? (rand(i + 2) - 0.5) * 1100 : 60;
              const sy = mode === 'sort' ? (rand(i + 7) - 0.5) * 1300 - 200 : 0;
              const rot = mode === 'sort' ? (rand(i + 4) - 0.5) * 40 : 0;
              const tag = tagAt >= 0 ? spr(f, tagAt + i * 3) : 1;
              const flag = flags.find((fl) => fl.rows.includes(i));
              const flagAt = flag ? cueAt(cues, flag.cue, s0 + 50) + flag.rows.indexOf(i) * 4 : -1;
              const fp = flag ? tw(f, flagAt, flagAt + 10, 0, 1) : 0;
              const rm = removed(i);
              const cat = catColor(r.cat);
              const flagCol = flag?.tone === 'gold' ? 'rgba(201,162,74,0.16)' : 'rgba(212,100,79,0.12)';
              const chk = chkAt >= 0 ? tw(f, chkAt + i * 3, chkAt + 10 + i * 3, 0, 1) : 0;
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: -16,
                    right: -16,
                    top: ys[i],
                    height: ROW_H,
                    padding: '0 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    borderRadius: 16,
                    background: interpolateColors(fp, [0, 1], ['rgba(0,0,0,0)', flagCol]),
                    borderBottom: i < rows.length - 1 ? `2px solid ${C.line}` : undefined,
                    transform: `translate(${sx * (1 - p) + rm * 500}px, ${sy * (1 - p)}px) rotate(${rot * (1 - p)}deg)`,
                    filter: `blur(${tw(f, s, s + 10, mode === 'sort' ? 10 : 6, 0)}px)`,
                    opacity: (f < s ? 0 : 1) * (1 - rm),
                    fontSize: 27,
                  }}
                >
                  {r.date && <div style={{width: 74, fontWeight: 700, color: C.muted, fontSize: 22}}>{r.date}</div>}
                  <div style={{width: 14, height: 14, borderRadius: 7, background: r.cat ? cat.c : C.muted, opacity: tag}} />
                  <div style={{fontWeight: 700, color: C.ink, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{r.name}</div>
                  {r.cat && (
                    <div
                      style={{
                        padding: '6px 14px',
                        borderRadius: 999,
                        background: cat.bg,
                        color: cat.c,
                        fontSize: 19,
                        fontWeight: 800,
                        opacity: tag,
                        transform: `translateX(${(1 - tag) * 24}px) scale(${0.8 + 0.2 * tag})`,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {r.cat}
                    </div>
                  )}
                  {flag && (
                    <div
                      style={{
                        padding: '6px 12px',
                        borderRadius: 10,
                        background: flag.tone === 'gold' ? C.gold : C.coral,
                        color: '#fff',
                        fontSize: 18,
                        fontWeight: 800,
                        transform: `scale(${spr(f, flagAt, {damping: 10, stiffness: 220})})`,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {flag.label}
                    </div>
                  )}
                  <div style={{width: 210, textAlign: 'right', fontWeight: 800, color: r.v > 0 ? C.greenMid : C.ink, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', flexShrink: 0}}>
                    {r.v > 0 ? '+' : ''}
                    {brl(r.v)}
                  </div>
                  {checkCue !== undefined && (
                    <div style={{width: 36}}>
                      <Check size={34} p={chk} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {total && (
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                marginTop: 18,
                paddingTop: 18,
                borderTop: `3px solid ${C.green}`,
                opacity: tw(f, s0 + 20, s0 + 34, 0, 1),
              }}
            >
              <div style={{fontSize: 26, fontWeight: 800, color: C.muted}}>{total}</div>
              <div style={{fontSize: 44, fontWeight: 800, color: sumNow >= 0 ? C.green : C.coral, fontVariantNumeric: 'tabular-nums'}}>
                {brl(sumNow)}
              </div>
            </div>
          )}
          <Illustrative style={{marginTop: 14, fontSize: 17}} />
        </Card>
      </Fill>
    </Fill>
  );
};

