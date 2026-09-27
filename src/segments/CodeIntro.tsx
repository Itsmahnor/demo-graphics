import React from 'react';
import { AbsoluteFill, interpolate } from 'remotion';

const LINES: { text: string; color: string }[][] = [
  [
    { text: 'const ', color: '#ff79c6' },
    { text: 'ProductDemo', color: '#8be9fd' },
    { text: ' = () => {', color: '#f8f8f2' },
  ],
  [{ text: '  return (', color: '#f8f8f2' }],
  [{ text: '    <AbsoluteFill>', color: '#50fa7b' }],
  [{ text: '      <Video src={yourClip} />', color: '#50fa7b' }],
  [{ text: '      <Captions />', color: '#50fa7b' }],
  [{ text: '    </AbsoluteFill>', color: '#50fa7b' }],
  [{ text: '  );', color: '#f8f8f2' }],
  [{ text: '};', color: '#f8f8f2' }],
];

// Renders the code face. `frame` is local to this segment (0 at its start),
// passed in by MyVideo rather than read from useCurrentFrame() so it can be
// frozen/driven during flip transitions too.
export const CodeIntro: React.FC<{ frame: number; durationInFrames: number }> = ({
  frame,
}) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#1e1f29',
        padding: 48,
        justifyContent: 'center',
      }}
    >
      <div style={{ fontFamily: 'Menlo, Consolas, monospace', fontSize: 26 }}>
        {LINES.map((line, i) => {
          // Each line appears roughly 6 frames after the previous one.
          const revealAt = i * 6;
          const lineOpacity = interpolate(
            frame,
            [revealAt, revealAt + 8],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );
          return (
            <div key={i} style={{ opacity: lineOpacity, lineHeight: 1.5 }}>
              {line.map((chunk, j) => (
                <span key={j} style={{ color: chunk.color }}>
                  {chunk.text}
                </span>
              ))}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
