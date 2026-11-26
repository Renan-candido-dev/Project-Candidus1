import React from 'react';
import {interpolateColors, useCurrentFrame} from 'remotion';
import {EASE_IN_OUT, brl, spr, tw} from '../anim';
import {Cursor} from '../components/Cursor';
import {C, SANS} from '../theme';
import {Fill, Headline, Kicker, SceneBase, SceneBg, cueAt, isDark} from './common';
import {catColor} from './LedgerScene';

type Col = {key: string; label: string; w: number; align?: 'left' | 'right'; money?: boolean; tag?: boolean};
type Val = string | number;
type Where = {col: string; eq?: Val; lt?: number; gt?: number; in?: Val[]};

export type SheetStep =
  | {type: 'fill'; col: string; cue: number; delay?: number}
  | {type: 'highlight'; where: Where; tone?: 'coral' | 'gold' | 'green'; cue: number; delay?: number}
  | {type: 'hide'; where: Where; cue: number; delay?: number}
  | {type: 'formula'; footer: number; col: string; formula: string; cue: number; delay?: number}
  | {type: 'focus'; rows?: [number, number]; zoom?: number; cue: number; delay?: number}
  | {type: 'badge'; text: string; tone?: 'coral' | 'gold' | 'green'; cue: number; delay?: number}
  | {type: 'sort'; col: string; dir?: 'asc' | 'desc'; cue: number; delay?: number};

type Footer = {label: string; values: Record<string, Val>};

type Props = SceneBase & {
  headline?: string[];
  kicker?: string;
  file: string;
  tabs?: string[];
  columns: Col[];
  rows: Record<string, Val>[];
  footers?: Footer[];
  steps: SheetStep[];
};

const ROW_H = 58;
const NUM_W = 52;
const LETTERS = 'ABCDEFGHIJ';

const match = (r: Record<string, Val>, w: Where) => {
  const v = r[w.col];
  if (w.eq !== undefined) return v === w.eq;
  if (w.in) return w.in.includes(v);
  if (w.lt !== undefined) return typeof v === 'number' && v < w.lt;
  if (w.gt !== undefined) return typeof v === 'number' && v > w.gt;
  return false;
};

const TINT = {coral: 'rgba(212,100,79,0.16)', gold: 'rgba(201,162,74,0.22)', green: 'rgba(29,92,70,0.12)'};
const SOLID = {coral: C.coral, gold: C.gold, green: C.green};

/** Planilha "ao vivo": preenche colunas, destaca, filtra, aplica fórmulas e aproxima a câmera. */
export const SheetScene: React.FC<Props> = ({dur, cues, bg = 'ivory', headline, kicker, file, tabs = ['Lançamentos'], columns, rows, footers = [], steps}) => {
  const f = useCurrentFrame();
  const dark = isDark(bg);
  const s0 = Math.max(4, cueAt(cues, 0, 10) - 6);
  const enter = spr(f, s0 - 6, {damping: 18, stiffness: 110});
  const at = (st: SheetStep) => cueAt(cues, st.cue, s0 + 20) + (st.delay ?? 0);

  const filled = new Set(steps.filter((s) => s.type === 'fill').map((s) => (s as {col: string}).col));
  const top = headline ? 560 : kicker ? 330 : 280;
  const tableW = NUM_W + columns.reduce((s, c) => s + c.w, 0);
  const winW = Math.max(980, tableW + 24);
  const left = (1080 - winW) / 2;

  // linhas ocultas (filtro)
  const hideP = rows.map((r) =>
    Math.max(0, ...steps.filter((s) => s.type === 'hide' && match(r, (s as {where: Where}).where)).map((s) => tw(f, at(s), at(s) + 16, 0, 1, EASE_IN_OUT))),
  );
  // ordenação
  const sortStep = steps.find((s) => s.type === 'sort') as {col: string; dir?: string; cue: number; delay?: number} | undefined;
  const sortP = sortStep ? tw(f, at(sortStep as SheetStep), at(sortStep as SheetStep) + 20, 0, 1, EASE_IN_OUT) : 0;
  const order = rows.map((_, i) => i);
  if (sortStep) {
    const sorted = [...order].sort((a, b) => {
      const va = rows[a][sortStep.col];
      const vb = rows[b][sortStep.col];
      const cmp = typeof va === 'number' && typeof vb === 'number' ? va - vb : String(va).localeCompare(String(vb));
      return sortStep.dir === 'desc' ? -cmp : cmp;
    });
    sorted.forEach((ri, pos) => (order[ri] = pos));
  }
  let acc = 0;
  const baseY = rows.map((_, i) => {
    const y = acc;
    acc += ROW_H * (1 - hideP[i]);
    return y;
  });
  const sortedY = rows.map((_, i) => order[i] * ROW_H);
  const rowY = rows.map((_, i) => baseY[i] * (1 - sortP) + sortedY[i] * sortP);
  const bodyH = acc;

  // fórmula ativa (barra de fórmulas + célula selecionada)
  const formulas = steps.filter((s) => s.type === 'formula') as Extract<SheetStep, {type: 'formula'}>[];
  const activeF = [...formulas].reverse().find((s) => f >= at(s) - 2);
  const typed = activeF ? activeF.formula.slice(0, Math.floor(tw(f, at(activeF), at(activeF) + 14, 0, activeF.formula.length))) : '';
  const colX = (key: string) => NUM_W + columns.slice(0, columns.findIndex((c) => c.key === key)).reduce((s, c) => s + c.w, 0);
  const colIdx = (key: string) => columns.findIndex((c) => c.key === key);

  // câmera
  const focuses = steps.filter((s) => s.type === 'focus') as Extract<SheetStep, {type: 'focus'}>[];
  let zoom = 1;
  let ty = 0;
  focuses.forEach((s) => {
    const p = tw(f, at(s), at(s) + 18, 0, 1, EASE_IN_OUT);
    const z = s.zoom ?? 1.25;
    const target = s.rows ? 128 + ((s.rows[0] + s.rows[1] + 1) / 2) * ROW_H : 0;
    const want = s.rows ? (400 - target) * z : 0;
    zoom = zoom + (z - zoom) * p;
    ty = ty + (want - ty) * p;
  });

  const badges = steps.filter((s) => s.type === 'badge') as Extract<SheetStep, {type: 'badge'}>[];
  const activeBadge = [...badges].reverse().find((s) => f >= at(s));

  // cursor: vai até cada fórmula / coluna preenchida
  const targets = steps
    .filter((s) => s.type === 'formula' || s.type === 'fill' || s.type === 'sort')
    .map((s) => {
      const key = (s as {col: string}).col;
      const x = left + 12 + colX(key) + columns[colIdx(key)].w * 0.6;
      const yy =
        s.type === 'formula'
          ? top + 156 + bodyH + (s as {footer: number}).footer * ROW_H + ROW_H * 0.6
          : top + 128 + 22;
      return {f: at(s) - 4, x, y: yy};
    })
    .sort((a, b) => a.f - b.f)
    .filter((t, i, arr) => i === 0 || t.f > arr[i - 1].f + 12);

  return (
    <Fill>
      <SceneBg bg={bg} drift={dur} />
      {headline && <Headline lines={headline} at={s0} dark={dark} size={76} top={250} />}
      {kicker && (
        <div style={{position: 'absolute', top: 236, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
          <Kicker text={kicker} dark={dark} p={tw(f, 0, 12, 0, 1)} />
        </div>
      )}
      <div
        style={{
          position: 'absolute',
          left,
          top,
          width: winW,
          transformOrigin: '50% 0%',
          transform: `translateY(${(1 - enter) * 120 + ty}px) scale(${(0.94 + 0.06 * enter) * zoom})`,
          opacity: enter,
          borderRadius: 26,
          overflow: 'hidden',
          background: C.paper,
          boxShadow: '0 50px 100px rgba(10,46,35,0.18), 0 6px 18px rgba(10,46,35,0.06)',
          fontFamily: SANS,
        }}
      >
        {/* barra da janela */}
        <div style={{height: 56, background: C.green, display: 'flex', alignItems: 'center', padding: '0 22px', gap: 10}}>
          {['#E8907C', '#EBD08A', '#9CC5AE'].map((c) => (
            <div key={c} style={{width: 16, height: 16, borderRadius: 8, background: c}} />
          ))}
          <div style={{marginLeft: 16, color: C.ivory, fontSize: 21, fontWeight: 700}}>{file}</div>
          <div style={{marginLeft: 'auto', color: C.goldLight, fontSize: 17, fontWeight: 800, letterSpacing: '0.12em'}}>DADOS FICTÍCIOS</div>
        </div>
        {/* barra de fórmulas */}
        <div style={{height: 56, display: 'flex', alignItems: 'center', borderBottom: `2px solid ${C.line}`, fontSize: 22}}>
          <div style={{width: 110, textAlign: 'center', fontWeight: 800, color: C.muted, borderRight: `2px solid ${C.line}`}}>
            {activeF ? `${LETTERS[colIdx(activeF.col)]}${rows.length + 2 + activeF.footer}` : 'A1'}
          </div>
          <div style={{padding: '0 16px', fontStyle: 'italic', fontWeight: 700, color: C.gold}}>fx</div>
          <div style={{fontWeight: 600, color: C.ink, fontFamily: 'monospace', fontSize: 23}}>
            {typed}
            {activeF && f < at(activeF) + 18 && Math.floor(f / 8) % 2 === 0 ? '|' : ''}
          </div>
        </div>
        {/* cabeçalho */}
        <div style={{display: 'flex', height: 44, background: '#F3F5F3', borderBottom: `2px solid ${C.line}`, fontSize: 19, fontWeight: 800, color: C.muted}}>
          <div style={{width: NUM_W}} />
          {columns.map((c, i) => (
            <div key={c.key} style={{width: c.w, display: 'flex', alignItems: 'center', justifyContent: 'center', borderLeft: `2px solid ${C.line}`}}>
              {LETTERS[i]}
            </div>
          ))}
        </div>
        <div style={{display: 'flex', height: 52, borderBottom: `2px solid ${C.line}`, fontSize: 21, fontWeight: 800, color: C.ink}}>
          <div style={{width: NUM_W, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted, fontSize: 18}}>1</div>
          {columns.map((c) => (
            <div
              key={c.key}
              style={{
                width: c.w,
                padding: '0 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: c.align === 'right' ? 'flex-end' : 'flex-start',
                borderLeft: `2px solid ${C.line}`,
                background: filled.has(c.key) ? interpolateColors(f, [0, 1], ['#FBF6E9', '#FBF6E9']) : undefined,
              }}
            >
              {c.label}
            </div>
          ))}
        </div>
        {/* corpo */}
        <div style={{position: 'relative', height: bodyH}}>
          {rows.map((r, i) => {
            const hl = steps.filter((s) => s.type === 'highlight' && match(r, (s as {where: Where}).where)) as Extract<SheetStep, {type: 'highlight'}>[];
            const last = hl.length ? hl[hl.length - 1] : null;
            const hp = last ? tw(f, at(last) + i * 1.5, at(last) + 8 + i * 1.5, 0, 1) : 0;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: rowY[i],
                  left: 0,
                  right: 0,
                  height: ROW_H,
                  display: 'flex',
                  borderBottom: `2px solid ${C.line}`,
                  background: last ? interpolateColors(hp, [0, 1], ['rgba(255,255,255,0)', TINT[last.tone ?? 'coral']]) : undefined,
                  opacity: (1 - hideP[i]) * tw(f, s0 + i * 2, s0 + 8 + i * 2, 0, 1),
                  fontSize: 22,
                }}
              >
                <div style={{width: NUM_W, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted, fontSize: 18, fontWeight: 700}}>{i + 2}</div>
                {columns.map((c) => {
                  const v = r[c.key];
                  const fillStep = steps.find((s) => s.type === 'fill' && (s as {col: string}).col === c.key);
                  const vis = fillStep ? tw(f, at(fillStep) + i * 3, at(fillStep) + i * 3 + 6, 0, 1) : 1;
                  const txt = c.money && typeof v === 'number' ? brl(v) : String(v ?? '');
                  const cat = c.tag ? catColor(String(v)) : null;
                  return (
                    <div
                      key={c.key}
                      style={{
                        width: c.w,
                        padding: '0 14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: c.align === 'right' ? 'flex-end' : 'flex-start',
                        borderLeft: `2px solid ${C.line}`,
                        fontWeight: c.money ? 800 : 600,
                        color: c.money && typeof v === 'number' ? (v < 0 ? C.coral : C.greenMid) : C.ink,
                        fontVariantNumeric: 'tabular-nums',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                      }}
                    >
                      {cat ? (
                        <span
                          style={{
                            padding: '4px 12px',
                            borderRadius: 999,
                            background: cat.bg,
                            color: cat.c,
                            fontSize: 18,
                            fontWeight: 800,
                            opacity: vis,
                            transform: `scale(${0.7 + 0.3 * vis})`,
                          }}
                        >
                          {txt}
                        </span>
                      ) : (
                        <span style={{opacity: vis}}>{txt}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        {/* rodapé com fórmulas */}
        {footers.map((ft, k) => {
          const fs = formulas.filter((s) => s.footer === k);
          const shown = fs.length ? tw(f, at(fs[0]) - 6, at(fs[0]) + 4, 0, 1) : 1;
          return (
            <div key={k} style={{display: 'flex', height: ROW_H, borderBottom: `2px solid ${C.line}`, background: '#F7F4EC', fontSize: 23, opacity: shown}}>
              <div style={{width: NUM_W, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted, fontSize: 18, fontWeight: 700}}>
                {rows.length + 2 + k}
              </div>
              {columns.map((c, ci) => {
                const st = fs.find((s) => s.col === c.key);
                const rp = st ? tw(f, at(st) + 14, at(st) + 20, 0, 1) : 1;
                const flash = st ? Math.max(0, 1 - Math.abs(f - (at(st) + 20)) / 10) : 0;
                const v = ft.values[c.key];
                const isSel = activeF === st && st;
                return (
                  <div
                    key={c.key}
                    style={{
                      width: c.w,
                      padding: '0 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: c.align === 'right' ? 'flex-end' : 'flex-start',
                      borderLeft: `2px solid ${C.line}`,
                      fontWeight: 800,
                      color: typeof v === 'number' && v < 0 ? C.coral : C.ink,
                      background: flash ? `rgba(201,162,74,${0.35 * flash})` : undefined,
                      outline: isSel ? `3px solid ${C.gold}` : undefined,
                      outlineOffset: -3,
                      fontVariantNumeric: 'tabular-nums',
                      whiteSpace: 'nowrap',
                      overflow: ci === 0 ? 'visible' : undefined,
                      position: 'relative',
                      zIndex: ci === 0 ? 2 : undefined,
                    }}
                  >
                    {ci === 0 ? ft.label : v === undefined ? '' : <span style={{opacity: rp}}>{c.money && typeof v === 'number' ? brl(v) : String(v)}</span>}
                  </div>
                );
              })}
            </div>
          );
        })}
        {/* abas */}
        <div style={{height: 46, display: 'flex', alignItems: 'center', gap: 6, padding: '0 16px', background: '#F3F5F3', fontSize: 18, fontWeight: 800}}>
          {tabs.map((t, i) => (
            <div key={t} style={{padding: '6px 16px', borderRadius: 10, background: i === 0 ? C.paper : 'transparent', color: i === 0 ? C.green : C.muted}}>
              {t}
            </div>
          ))}
        </div>
      </div>
      {activeBadge && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 1300, display: 'flex', justifyContent: 'center'}}>
          <div
            style={{
              maxWidth: 940,
              padding: '20px 34px',
              borderRadius: 30,
              background: SOLID[activeBadge.tone ?? 'green'],
              color: activeBadge.tone === 'gold' ? C.greenInk : '#fff',
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 31,
              lineHeight: 1.25,
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(10,46,35,0.22)',
              transform: `scale(${spr(f, at(activeBadge), {damping: 12, stiffness: 170})})`,
            }}
          >
            {activeBadge.text}
          </div>
        </div>
      )}
      {targets.length > 0 && (
        <Cursor
          keys={[{f: targets[0].f - 16, x: 1000, y: 1500}, ...targets.flatMap((t) => [{f: t.f, x: t.x, y: t.y}, {f: t.f + 10, x: t.x + 6, y: t.y + 6}])]}
          clicks={targets.map((t) => t.f + 2)}
        />
      )}
    </Fill>
  );
};
