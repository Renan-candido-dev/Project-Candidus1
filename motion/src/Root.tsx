import React from 'react';
import {Composition} from 'remotion';
import {CandidusReel01} from './Video';
import {FPS, H, W} from './theme';
import {TOTAL_FRAMES} from './timeline';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="CandidusReel01"
    component={CandidusReel01}
    durationInFrames={TOTAL_FRAMES}
    fps={FPS}
    width={W}
    height={H}
    defaultProps={{captions: true}}
  />
);
