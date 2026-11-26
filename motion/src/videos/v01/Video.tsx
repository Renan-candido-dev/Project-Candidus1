import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile} from 'remotion';
import {Grain} from '../../components/Backgrounds';
import {Captions} from '../../components/Captions';
import {S1Hook} from './scenes/S1Hook';
import {S2Problem} from './scenes/S2Problem';
import {S3Solution} from './scenes/S3Solution';
import {S4Benefits} from './scenes/S4Benefits';
import {S5Closing} from './scenes/S5Closing';
import {CAPTIONS, SCENES, TOTAL_FRAMES, VOICE} from './timeline';
import {C} from '../../theme';

export const CandidusReel01: React.FC<{captions: boolean}> = ({captions}) => (
  <AbsoluteFill style={{background: C.greenInk}}>
    <Sequence from={SCENES.hook.from} durationInFrames={SCENES.hook.dur}>
      <S1Hook />
    </Sequence>
    <Sequence from={SCENES.problem.from} durationInFrames={SCENES.problem.dur}>
      <S2Problem />
    </Sequence>
    <Sequence from={SCENES.solution.from} durationInFrames={SCENES.solution.dur}>
      <S3Solution />
    </Sequence>
    <Sequence from={SCENES.benefits.from} durationInFrames={SCENES.benefits.dur}>
      <S4Benefits />
    </Sequence>
    <Sequence from={SCENES.closing.from} durationInFrames={SCENES.closing.dur}>
      <S5Closing />
    </Sequence>

    <Grain opacity={0.07} />
    {captions && <Captions cues={CAPTIONS} />}

    {/* Trilha: abaixa sob a narração (ducking) */}
    <Audio
      src={staticFile('v01/music.wav')}
      volume={(f) => {
        // ducking suave: rampa de 6 frames em torno de cada frase
        const duck = Math.max(
          0,
          ...VOICE.map((v) =>
            interpolate(f, [v.at - 6, v.at, v.at + v.frames, v.at + v.frames + 8], [0, 1, 1, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          ),
        );
        const fade = interpolate(f, [0, 6, TOTAL_FRAMES - 30, TOTAL_FRAMES], [0, 1, 1, 0], {extrapolateRight: 'clamp'});
        return fade * (0.55 - 0.25 * duck);
      }}
    />
    {VOICE.map((v) => (
      <Sequence key={v.file} from={v.at} durationInFrames={200} layout="none">
        <Audio src={staticFile(v.file)} volume={1} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
