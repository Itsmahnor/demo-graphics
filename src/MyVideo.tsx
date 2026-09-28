import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { IsometricCard } from './IsometricCard';
import { CodeIntro } from './segments/CodeIntro';
import { ProductDemo } from './segments/ProductDemo';
import { Captions } from './segments/Captions';
import { EndCard } from './segments/EndCard';
import { resolveFlip, SegmentDef } from './FlipTransition';

// Segment pacing (in frames @ 30fps)
const CODE_DURATION = 100; // ~3.3s
const DEMO_DURATION = 200; // ~6.6s
const END_DURATION = 100; // ~3.3s

export const TOTAL_DURATION = CODE_DURATION + DEMO_DURATION + END_DURATION;

// Visual constants
const BASE_SCALE = 1.654;
const BG = '#f4f4f5';
const ACCENT = '#6366f1';
const ACCENT_2 = '#ec4899';
const ACCENT_3 = '#22d3ee';

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

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

/** Soft animated background so the frame never feels static/flat. */
const Backdrop: React.FC<{ frame: number }> = ({ frame }) => (
  <AbsoluteFill style={{ backgroundColor: BG, overflow: 'hidden' }}>
    {/* Drifting colour blobs */}
    <div
      style={{
        position: 'absolute',
        width: 900,
        height: 900,
        borderRadius: '50%',
        top: -200 + Math.sin(frame / 50) * 80,
        left: -250 + Math.cos(frame / 60) * 100,
        background: `radial-gradient(circle, ${ACCENT}55 0%, transparent 70%)`,
        filter: 'blur(60px)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        width: 800,
        height: 800,
        borderRadius: '50%',
        bottom: -250 + Math.cos(frame / 45) * 90,
        right: -200 + Math.sin(frame / 55) * 100,
        background: `radial-gradient(circle, ${ACCENT_2}44 0%, transparent 70%)`,
        filter: 'blur(70px)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        width: 600,
        height: 600,
        borderRadius: '50%',
        top: '35%',
        right: -150 + Math.sin(frame / 70) * 60,
        background: `radial-gradient(circle, ${ACCENT_3}33 0%, transparent 70%)`,
        filter: 'blur(60px)',
      }}
    />
    {/* Subtle moving dot grid */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage:
          'radial-gradient(rgba(24,24,27,0.10) 1.5px, transparent 1.5px)',
        backgroundSize: '36px 36px',
        backgroundPosition: `${frame * 0.4}px ${frame * 0.2}px`,
      }}
    />
  </AbsoluteFill>
);

/** Segmented progress bar: keeps viewers oriented and improves retention. */
const ProgressBar: React.FC<{ frame: number }> = ({ frame }) => {
  let start = 0;
  return (
    <div
      style={{
        position: 'absolute',
        left: 60,
        right: 60,
        bottom: 70,
        display: 'flex',
        gap: 10,
      }}
    >
      {segments.map((seg) => {
        const segStart = start;
        start += seg.duration;
        const fill = interpolate(
          frame,
          [segStart, segStart + seg.duration],
          [0, 100],
          clamp
        );
        return (
          <div
            key={seg.key}
            style={{
              flex: seg.duration,
              height: 8,
              borderRadius: 4,
              background: 'rgba(24,24,27,0.12)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${fill}%`,
                height: '100%',
                borderRadius: 4,
                background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_2})`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export const MyVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const {
    frontNode,
    backNode,
    rotateY,
    extraRotateX,
    extraRotateZ,
    elevation,
    glareOpacity,
  } = resolveFlip(frame, segments);

  // Hook: card springs in instead of just appearing
  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 90 } });
  const enterScale = interpolate(enter, [0, 1], [0.86, 1]);
  const enterY = interpolate(enter, [0, 1], [80, 0]);
  const enterOpacity = interpolate(frame, [0, 8], [0, 1], clamp);

  // Camera: slow push-in over the whole video + gentle float
  const push = interpolate(frame, [0, TOTAL_DURATION], [1, 1.06], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });
  const floatY = Math.sin(frame / 40) * 6;
  const floatRot = Math.sin(frame / 55) * 0.4;

  return (
    <AbsoluteFill>
      <Backdrop frame={frame} />

      <AbsoluteFill
        style={{
          scale: BASE_SCALE,
          opacity: enterOpacity,
          transform: `translateY(${enterY + floatY}px) scale(${
            enterScale * push
          }) rotate(${floatRot}deg)`,
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

      {/* Soft vignette to focus the eye on the card */}
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse at center, transparent 55%, rgba(24,24,27,0.14) 100%)',
        }}
      />

      <ProgressBar frame={frame} />
    </AbsoluteFill>
  );
};