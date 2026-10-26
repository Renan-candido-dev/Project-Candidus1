import React from 'react';
import {Composition, staticFile} from 'remotion';
import {SeriesProps, SeriesVideo} from './series/SeriesVideo';
import {VoiceLine, computeLayout} from './series/layout';
import {FPS, H, W} from './theme';
import {SERIES} from './videos';
import {CandidusReel01} from './videos/v01/Video';
import {TOTAL_FRAMES} from './videos/v01/timeline';

const loadVoice = async (id: string): Promise<VoiceLine[]> => {
  try {
    const res = await fetch(staticFile(`${id}/voice.json`));
    return res.ok ? await res.json() : [];
  } catch {
    return [];
  }
};

export const RemotionRoot: React.FC = () => (
  <>
    {/* Vídeo 01 (feito à mão, antes do sistema da série) */}
    <Composition
      id="V01-sua-empresa-vende"
      component={CandidusReel01}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={W}
      height={H}
      defaultProps={{captions: true}}
    />
    {SERIES.map((spec) => (
      <Composition
        key={spec.id}
        id={`V${String(spec.num).padStart(2, '0')}-${spec.slug}`}
        component={SeriesVideo}
        durationInFrames={300}
        fps={FPS}
        width={W}
        height={H}
        defaultProps={{spec, layout: null, captions: true} as SeriesProps}
        calculateMetadata={async ({props}) => {
          const layout = computeLayout(props.spec, await loadVoice(props.spec.id));
          return {durationInFrames: layout.total, props: {...props, layout}};
        }}
      />
    ))}
  </>
);
