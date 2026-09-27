import React from 'react';
import { AbsoluteFill, interpolate } from 'remotion';

/**
 * Placeholder for your real product footage / b-roll.
 * Swap the <AbsoluteFill> background for:
 *   <Video src={staticFile('your-clip.mp4')} style={{ width: '100%', height: '100%' }} />
 *
 * The stacked pills below stand in for the "morphing blob" transition seen
 * in the reference video — purely decorative, safe to delete.
 * `frame` is local to this segment, passed down by MyVideo.
 */
export const ProductDemo: React.FC<{ frame: number; durationInFrames: number }> = ({
  frame,
}) => {
  const shapes = Array.from({ length: 6 });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {shapes.map((_, i) => {
        const delay = i * 5;
        const y = interpolate(frame - delay, [0, 20], [-260, i * 60 - 150], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const shade = 90 + i * 25;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: '50%',
              width: 420,
              height: 90,
              borderRadius: 45,
              backgroundColor: `rgb(${shade - 40}, ${shade}, 255)`,
              border: '3px solid #0b0b12',
              transform: `translateY(${y}px)`,
            }}
          />
        );
      })}
      <div
        style={{
          position: 'relative',
          fontFamily: 'Menlo, Consolas, monospace',
          fontSize: 22,
          color: '#0b0b12',
          background: '#ffffffcc',
          padding: '8px 16px',
          borderRadius: 10,
        }}
      >
        your product footage here
      </div>
    </AbsoluteFill>
  );
};
