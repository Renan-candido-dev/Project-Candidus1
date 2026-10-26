// Modelo de dados da série: cada vídeo é uma lista de "beats" (cena + falas).

export type Bg = 'ivory' | 'green' | 'night';
export type Transition = 'cut' | 'whipUp' | 'whipLeft' | 'zoom' | 'blur' | 'flood';
export type Mood = 'tension' | 'neutral' | 'bright' | 'outro';

/** Cena: `type` escolhe o componente do kit (src/kit); o resto são as props dele. */
export type SceneSpec = {type: string; bg?: Bg; [key: string]: unknown};

export type Beat = {
  /** Narração do beat. Cada string vira uma frase gravada separadamente. */
  say?: string | string[];
  scene: SceneSpec;
  /** Transição de entrada desta cena (a saída da anterior acompanha). */
  enter?: Transition;
  /** Respiros, em segundos: antes da 1ª fala, entre falas e depois da última. */
  lead?: number;
  gap?: number;
  pad?: number;
  /** Duração mínima da cena, em segundos (útil para cenas sem fala). */
  minDur?: number;
  mood?: Mood;
};

export type VideoMeta = {
  objetivo: string;
  publico: string;
  gancho: string;
  cta: string;
  legenda: string;
  hashtags: string[];
  capa: string;
  audio?: string;
};

export type VideoSpec = {
  id: string; // 'v03'
  num: number;
  slug: string;
  title: string;
  format: 'motion' | 'demo';
  week: number;
  month: 1 | 2 | 3;
  /** Andamento e tonalidade da trilha (variação entre vídeos). */
  music: {bpm: number; root: number; seed: number};
  beats: Beat[];
  meta: VideoMeta;
};

/** Pronúncia: o texto falado pode diferir do texto da legenda (ex.: "Cândidus"). */
export const SPOKEN: [RegExp, string][] = [
  [/\bCandidus\b/g, 'Cândidus'],
  [/\bBPO\b/g, 'bê pê ó'],
  [/\bDAS\b/g, 'dás'],
  [/R\$ ?([\d.]+),00\b/g, '$1 reais'],
  [/R\$ ?([\d.]+),(\d{2})\b/g, '$1 reais e $2 centavos'],
  [/R\$ ?([\d.]+) mil\b/g, '$1 mil reais'],
  [/R\$ ?([\d.]+)\b/g, '$1 reais'],
  [/(\d+)%/g, '$1 por cento'],
];

export const spoken = (text: string) => SPOKEN.reduce((t, [re, rep]) => t.replace(re, rep), text);

export const linesOf = (b: Beat) => (b.say === undefined ? [] : Array.isArray(b.say) ? b.say : [b.say]);
