import React from 'react';
import { AbsoluteFill } from 'remotion';

const popScale = (localFrame: number) => {
  const t = Math.min(1, Math.max(0, localFrame / 12));
  return 1 - Math.pow(1 - t, 3);
};

const IconTile: React.FC<{ children: React.ReactNode; frame: number; delay: number }> = ({
  children,
  frame,
  delay,
}) => {
  const pop = popScale(frame - delay);
  return (
    <div
      style={{
        width: 110,
        height: 110,
        borderRadius: 24,
        backgroundColor: '#ffffff',
        border: '3px solid #0b0b12',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${pop})`,
        fontSize: 42,
      }}
    >
      {children}
    </div>
  );
};

// Generic, non-branded glyphs standing in for platform icons — swap for
// your own SVGs/logos as needed. `frame` is local to this segment.
export const EndCard: React.FC<{
  frame: number;
  durationInFrames: number;
  handle?: string;
}> = ({ frame, handle = '@yourhandle' }) => {
  const handlePop = popScale(frame - 30);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 20,
          marginBottom: 32,
        }}
      >
        <IconTile frame={frame} delay={0}>♪</IconTile>
        <IconTile frame={frame} delay={5}>◎</IconTile>
        <IconTile frame={frame} delay={10}>▶</IconTile>
        <IconTile frame={frame} delay={15}>✕</IconTile>
      </div>
      <div
        style={{
          transform: `scale(${handlePop})`,
          backgroundColor: '#0b0b12',
          color: '#ffffff',
          fontFamily: 'Inter, Arial, sans-serif',
          fontWeight: 700,
          fontSize: 26,
          padding: '14px 30px',
          borderRadius: 999,
        }}
      >
        {handle}
      </div>
    </AbsoluteFill>
  );
};
