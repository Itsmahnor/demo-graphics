import React from 'react';
import { AbsoluteFill } from 'remotion';

export type CaptionPhrase = {
  /** words shown in plain black-on-white */
  text: string;
  /** word shown highlighted in blue, right after `text` */
  highlight: string;
  /** local frame (relative to this segment) the phrase should appear */
  from: number;
};

const DEFAULT_PHRASES: CaptionPhrase[] = [
  { text: 'Built entirely with', highlight: 'code', from: 0 },
  { text: 'ships fast,', highlight: 'looks great', from: 40 },
  { text: 'you can', highlight: 'create', from: 80 },
];

// Simple ease-out-back style pop, no extra deps needed.
const popScale = (localFrame: number) => {
  const t = Math.min(1, Math.max(0, localFrame / 10));
  return 1 - Math.pow(1 - t, 3) * 0.4;
};

/**
 * A caption bar that pops in per-phrase, with the last word rendered as a
 * highlighted pill. `frame` is local to this segment, passed by MyVideo.
 */
export const Captions: React.FC<{
  frame: number;
  durationInFrames: number;
  phrases?: CaptionPhrase[];
}> = ({ frame, phrases = DEFAULT_PHRASES }) => {
  const active = [...phrases].reverse().find((p) => frame >= p.from);
  if (!active) return null;

  const localFrame = frame - active.from;
  const pop = popScale(localFrame);

  return (
    <AbsoluteFill
      style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 220 }}
    >
      <div
        style={{
          transform: `scale(${pop})`,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          backgroundColor: '#ffffff',
          border: '3px solid #0b0b12',
          borderRadius: 999,
          padding: '10px 18px',
          fontFamily: 'Inter, Arial, sans-serif',
          fontWeight: 700,
          fontSize: 26,
        }}
      >
        <span style={{ color: '#0b0b12' }}>{active.text}</span>
        <span
          style={{
            color: '#ffffff',
            backgroundColor: '#3b82f6',
            borderRadius: 8,
            padding: '2px 10px',
          }}
        >
          {active.highlight}
        </span>
      </div>
    </AbsoluteFill>
  );
};
