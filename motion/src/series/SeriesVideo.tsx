import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {EASE_IN, EASE_IN_OUT, EASE_OUT, tw} from '../anim';
import {Grain} from '../components/Backgrounds';
import {Captions} from '../components/Captions';
import {Sfx} from '../components/UI';
import {C, H, W} from '../theme';
import {KIT} from '../kit/registry';
import {Layout, T} from './layout';
import {Transition, VideoSpec} from './types';

/** Aplica a transição de entrada (da própria cena) e de saída (a da próxima). */
const Transit: React.FC<{
  enter: Transition | null;
  exit: Transition | null;
  dur: number;
  children: React.ReactNode;
}> = ({enter, exit, dur, children}) => {
  const f = useCurrentFrame();
  const e = enter ? tw(f, 0, T, 1, 0, EASE_OUT) : 0; // 1 → 0 ao entrar
  const x = exit ? tw(f, dur - T, dur, 0, 1, EASE_IN) : 0; // 0 → 1 ao sair
  let transform = '';
  let filter = '';
  let opacity = 1;
  let clipPath: string | undefined;

  if (enter === 'whipUp') (transform += ` translateY(${e * H * 0.55}px)`), (filter += ` blur(${e * 28}px)`);
  if (enter === 'whipLeft') (transform += ` translateX(${e * W}px)`), (filter += ` blur(${e * 28}px)`);
  if (enter === 'zoom') (transform += ` scale(${1 - e * 0.18})`), (filter += ` blur(${e * 22}px)`), (opacity *= 1 - e);
  if (enter === 'blur') (filter += ` blur(${e * 26}px)`), (opacity *= 1 - e);
  if (enter === 'flood') {
    const r = tw(f, 0, T, 0, 2300, EASE_IN_OUT);
    clipPath = `circle(${r}px at 540px 960px)`;
  }

  if (exit === 'whipUp') (transform += ` translateY(${-x * H * 0.55}px)`), (filter += ` blur(${x * 28}px)`);
  if (exit === 'whipLeft') (transform += ` translateX(${-x * W}px)`), (filter += ` blur(${x * 28}px)`);
  if (exit === 'zoom') (transform += ` scale(${1 + x * 0.35})`), (filter += ` blur(${x * 22}px)`), (opacity *= 1 - x);
  if (exit === 'blur') (filter += ` blur(${x * 26}px)`), (opacity *= 1 - x);

  return (
    <AbsoluteFill style={{transform: transform || undefined, filter: filter || undefined, opacity, clipPath}}>{children}</AbsoluteFill>
  );
};

const SFX_FOR: Record<Transition, {name: string; volume: number} | null> = {
  cut: null,
  whipUp: {name: 'whoosh', volume: 0.42},
  whipLeft: {name: 'swish', volume: 0.4},
  zoom: {name: 'whoosh-down', volume: 0.38},
  blur: {name: 'swish', volume: 0.25},
  flood: {name: 'boom', volume: 0.4},
};

export type SeriesProps = {spec: VideoSpec; layout: Layout | null; captions: boolean};

export const SeriesVideo: React.FC<SeriesProps> = ({spec, layout, captions}) => {
  if (!layout) return <AbsoluteFill style={{background: C.greenInk}} />;
  const {beats, lines, total} = layout;
  return (
    <AbsoluteFill style={{background: C.greenInk}}>
      {beats.map((b, i) => {
        const scene = spec.beats[i].scene;
        const Comp = KIT[scene.type];
        if (!Comp) throw new Error(`Cena desconhecida: ${scene.type}`);
        const pre = i === 0 ? 0 : T;
        const next = beats[i + 1];
        // a cena sai só se a próxima não a cobrir com "flood" ou corte seco
        const exit = next && next.enter !== 'flood' && next.enter !== 'cut' ? next.enter : null;
        return (
          <Sequence key={i} from={b.from - pre} durationInFrames={b.dur + pre}>
            <Transit enter={i === 0 ? null : b.enter} exit={exit} dur={b.dur + pre}>
              <Comp {...scene} dur={b.dur + pre} cues={b.cues.map((c) => ({...c, at: c.at + pre, end: c.end + pre}))} />
            </Transit>
            {i > 0 && SFX_FOR[b.enter] && <Sfx name={SFX_FOR[b.enter]!.name} at={0} volume={SFX_FOR[b.enter]!.volume} />}
          </Sequence>
        );
      })}

      <Grain opacity={0.06} />
      {captions && !spec.silent && <Captions cues={layout.captions} />}

      {!spec.silent && (
      <Audio
        src={staticFile(`${spec.id}/music.wav`)}
        volume={(f) => {
          const duck = Math.max(
            0,
            ...lines.map((l) =>
              interpolate(f, [l.at - 6, l.at, l.end, l.end + 8], [0, 1, 1, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            ),
          );
          const fade = interpolate(f, [0, 6, total - 24, total], [0, 1, 1, 0], {extrapolateRight: 'clamp'});
          return fade * (0.55 - 0.25 * duck);
        }}
      />
      )}
      {lines.map((l) => (
        <Sequence key={l.file} from={l.at} durationInFrames={l.end - l.at + 30} layout="none">
          <Audio src={staticFile(l.file)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
