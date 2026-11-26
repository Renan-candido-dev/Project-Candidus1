import type {CaptionCue} from '../components/Captions';
import {Beat, Mood, Transition, VideoSpec, linesOf} from './types';

export const FPS = 30;
/** Sobreposição entre cenas (frames) usada pelas transições. */
export const T = 12;

export type VoiceLine = {file: string; seconds: number; speech: number};

export type Cue = {at: number; end: number; text: string};

export type BeatLayout = {
  from: number;
  dur: number;
  /** Falas do beat, em frames relativos ao início nominal da cena. */
  cues: Cue[];
  enter: Transition;
  mood: Mood;
};

export type Layout = {
  total: number;
  beats: BeatLayout[];
  lines: {file: string; at: number; end: number}[];
  captions: CaptionCue[];
};

const s2f = (s: number) => Math.round(s * FPS);

/** Quebra uma frase em blocos curtos de legenda (≈ 34 caracteres). */
export const chunk = (text: string, max = 34): string[] => {
  const parts = text.split(/(?<=[,.;:?!])\s+/).filter(Boolean);
  const out: string[] = [];
  for (const p of parts) {
    if (p.length <= max) {
      // junta com o anterior se ambos forem curtos
      const last = out[out.length - 1];
      if (last && last.length + p.length + 1 <= max && !/[.?!]$/.test(last)) out[out.length - 1] = `${last} ${p}`;
      else out.push(p);
      continue;
    }
    const words = p.split(' ');
    let cur = '';
    const pieces: string[] = [];
    for (const w of words) {
      if ((cur + ' ' + w).trim().length > max && cur) {
        pieces.push(cur);
        cur = w;
      } else cur = (cur + ' ' + w).trim();
    }
    if (cur) pieces.push(cur);
    // evita sobra de uma palavra só no fim
    if (pieces.length > 1 && pieces[pieces.length - 1].split(' ').length === 1) {
      const lastW = pieces.pop()!;
      pieces[pieces.length - 1] += ` ${lastW}`;
    }
    out.push(...pieces);
  }
  return out;
};

const defaultMood = (b: Beat, i: number, n: number): Mood => {
  if (b.mood) return b.mood;
  if (b.scene.type === 'closing') return 'outro';
  if (i < Math.ceil(n * 0.35)) return 'tension';
  return 'bright';
};

export const computeLayout = (spec: VideoSpec, voice: VoiceLine[]): Layout => {
  let cursor = 0;
  let li = 0;
  const beats: BeatLayout[] = [];
  const lines: Layout['lines'] = [];
  const captions: CaptionCue[] = [];
  spec.beats.forEach((b, i) => {
    const said = linesOf(b);
    const lead = b.lead ?? (i === 0 ? 0.25 : 0.3);
    const gap = b.gap ?? 0.3;
    const pad = b.pad ?? (b.scene.type === 'closing' ? 3.6 : 0.4);
    let t = lead;
    const cues: Cue[] = [];
    said.forEach((text, k) => {
      const v = voice[li++];
      const speech = v ? v.speech : text.length / 14;
      const at = s2f(t);
      const end = s2f(t + speech);
      cues.push({at, end, text});
      if (v) lines.push({file: v.file, at: cursor + at, end: cursor + end});
      // legendas: divide o tempo da fala proporcionalmente aos caracteres
      const pieces = chunk(text);
      const totalChars = pieces.reduce((n, p) => n + p.length, 0);
      let acc = 0;
      pieces.forEach((p) => {
        const from = cursor + at + Math.round(((end - at) * acc) / totalChars);
        acc += p.length;
        const to = cursor + at + Math.round(((end - at) * acc) / totalChars);
        captions.push({from, to, text: p});
      });
      t += speech + (k < said.length - 1 ? gap : 0);
    });
    const dur = Math.max(s2f(t + pad), s2f(b.minDur ?? 0), said.length ? 0 : s2f(2));
    beats.push({from: cursor, dur, cues, enter: i === 0 ? 'cut' : b.enter ?? 'whipUp', mood: defaultMood(b, i, spec.beats.length)});
    cursor += dur;
  });
  return {total: cursor, beats, lines, captions};
};
