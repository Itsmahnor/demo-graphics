import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { IsometricCard } from './IsometricCard';
import { CodeIntro } from './segments/CodeIntro';
import { ProductDemo } from './segments/ProductDemo';
import { Captions } from './segments/Captions';
import { EndCard } from './segments/EndCard';
import { resolveFlip, SegmentDef } from './FlipTransition';

// Segment pacing (in frames @ 30fps)
const CODE_DURATION = 100; // ~3.3s
const DEMO_DURATION = 200; // ~6.6s
const END_DURATION  = 100; // ~3.3s

export const TOTAL_DURATION = CODE_DURATION + DEMO_DURATION + END_DURATION;

const segments: SegmentDef[] = [
  {
    key: 'code',
    duration: CODE_DURATION,
    render: (frame) => (
      <CodeIntro frame={frame} durationInFrames={CODE_DURATION} />
    ),
  },
  {
    key: 'demo',
    duration: DEMO_DURATION,
    render: (frame) => (
      <>
        <ProductDemo frame={frame} durationInFrames={DEMO_DURATION} />
        <Captions frame={frame} durationInFrames={DEMO_DURATION} />
      </>
    ),
  },
  {
    key: 'end',
    duration: END_DURATION,
    render: (frame) => (
      <EndCard frame={frame} durationInFrames={END_DURATION} handle="@yourhandle" />
    ),
  },
];

export const MyVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const {
    frontNode,
    backNode,
    rotateY,
    extraRotateX,
    extraRotateZ,
    elevation,
    glareOpacity,
  } = resolveFlip(frame, segments);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#f4f4f5',
        scale: 1.654,
      }}
    >
      <IsometricCard
        frontNode={frontNode}
        backNode={backNode}
        rotateY={rotateY}
        extraRotateX={extraRotateX}
        extraRotateZ={extraRotateZ}
        elevation={elevation}
        glareOpacity={glareOpacity}
      />
    </AbsoluteFill>
  );
};
