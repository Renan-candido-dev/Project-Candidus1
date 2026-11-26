import {Easing, interpolate, spring} from 'remotion';

export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
export const EASE_IN = Easing.bezier(0.7, 0, 0.84, 0);

/** Interpolação com clamp: valor vai de `from` a `to` entre os frames a e b. */
export const tw = (
  f: number,
  a: number,
  b: number,
  from: number,
  to: number,
  easing: (t: number) => number = EASE_OUT,
) =>
  interpolate(f, [a, b], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

/** Mola padrão (0 → 1) a partir de `delay`. */
export const spr = (
  f: number,
  delay: number,
  config: {damping?: number; stiffness?: number; mass?: number} = {},
) =>
  spring({
    frame: f - delay,
    fps: 30,
    config: {damping: 14, stiffness: 160, mass: 0.8, ...config},
  });

/** Ruído suave determinístico (para flutuação e tremor de câmera). */
export const wobble = (f: number, seed: number, speed = 0.05) =>
  Math.sin(f * speed + seed * 12.9898) * 0.6 + Math.sin(f * speed * 2.3 + seed * 4.1) * 0.4;

/** Pseudo-aleatório determinístico em [0, 1). */
export const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** Formata número como moeda brasileira (R$ 1.234,56). */
export const brl = (v: number, decimals = 2) => {
  const sign = v < 0 ? '-' : '';
  const abs = Math.abs(v);
  const [int, dec] = abs.toFixed(decimals).split('.');
  const intFmt = int.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${sign}R$ ${intFmt}${decimals ? ',' + dec : ''}`;
};
