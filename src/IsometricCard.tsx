import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';

/**
 * IsometricCard
 *
 * Renders a true 3D extruded slab with realistic thickness, edge walls,
 * specular lighting, and floor shadow — replicating the physical 3D fidelity
 * seen in Three.js meshes like Rotating3DCube.
 */
export const IsometricCard: React.FC<{
  frontNode: React.ReactNode;
  backNode: React.ReactNode;
  rotateY?: number;
  extraRotateX?: number;
  extraRotateZ?: number;
  elevation?: number;
  glareOpacity?: number;
}> = ({
  frontNode,
  backNode,
  rotateY = 0,
  extraRotateX = 0,
  extraRotateZ = 0,
  elevation = 0,
  glareOpacity = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Entrance spring
  const entrance = spring({ frame, fps, config: { damping: 14, mass: 0.6 } });

  // Floating bob animation
  const bob = Math.sin(frame / 40) * 10;

  // Subtle continuous push-in zoom
  const zoom = 1 + (frame / durationInFrames) * 0.25;

  const CARD_WIDTH = 640;
  const CARD_HEIGHT = 760;
  const DEPTH = 32; // Physical 3D thickness (slab depth)

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        perspective: 1400,
        perspectiveOrigin: '50% 50%',
      }}
    >
      {/* ── 1. Realistic Floor Drop Shadow ─────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          width: CARD_WIDTH * 0.95,
          height: CARD_HEIGHT * 0.42,
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse at center, rgba(12, 14, 20, 0.45) 0%, rgba(12, 14, 20, 0.15) 55%, transparent 75%)',
          filter: 'blur(32px)',
          transform: `
            translateY(${300 + bob * 0.3}px)
            rotateX(55deg)
            scale(${(0.85 + entrance * 0.15) * zoom})
          `,
          opacity: entrance * 0.9,
          pointerEvents: 'none',
        }}
      />

      {/* ── 2. Master 3D Transform Object ──────────────────────────────────── */}
      <div
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: `
            translateY(${bob - (1 - entrance) * 120 + elevation}px)
            scale(${(0.85 + entrance * 0.15) * zoom})
            rotateX(${50 + extraRotateX}deg)
            rotateY(${rotateY}deg)
            rotateZ(${-34 + extraRotateZ}deg)
          `,
          willChange: 'transform',
        }}
      >
        {/* ── 3. 3D Slab Thickness: Extruded Side Walls ─────────────────────── */}
        {/* Left Edge Wall */}
        <div
          style={{
            position: 'absolute',
            width: DEPTH,
            height: CARD_HEIGHT,
            left: -DEPTH / 2,
            top: 0,
            transform: 'rotateY(-90deg)',
            background: 'linear-gradient(180deg, #1c1f2b 0%, #0d0f15 100%)',
            borderTop: '1px solid rgba(255,255,255,0.12)',
            borderBottom: '1px solid rgba(0,0,0,0.6)',
            boxSizing: 'border-box',
          }}
        />

        {/* Right Edge Wall (facing directional key light) */}
        <div
          style={{
            position: 'absolute',
            width: DEPTH,
            height: CARD_HEIGHT,
            right: -DEPTH / 2,
            top: 0,
            transform: 'rotateY(90deg)',
            background: 'linear-gradient(180deg, #32374c 0%, #1e212e 100%)',
            borderTop: '1px solid rgba(255,255,255,0.2)',
            borderBottom: '1px solid rgba(0,0,0,0.6)',
            boxSizing: 'border-box',
          }}
        />

        {/* Top Edge Wall (metallic rim highlight) */}
        <div
          style={{
            position: 'absolute',
            width: CARD_WIDTH,
            height: DEPTH,
            left: 0,
            top: -DEPTH / 2,
            transform: 'rotateX(90deg)',
            background: 'linear-gradient(90deg, #282d3e 0%, #4a5372 50%, #282d3e 100%)',
            borderLeft: '1px solid rgba(255,255,255,0.15)',
            borderRight: '1px solid rgba(255,255,255,0.15)',
            boxSizing: 'border-box',
          }}
        />

        {/* Bottom Edge Wall (in ambient floor shadow) */}
        <div
          style={{
            position: 'absolute',
            width: CARD_WIDTH,
            height: DEPTH,
            left: 0,
            bottom: -DEPTH / 2,
            transform: 'rotateX(-90deg)',
            background: '#090a0f',
            boxSizing: 'border-box',
          }}
        />

        {/* ── 4. Front Face (Mounted at +Z half-depth) ───────────────────────── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `translateZ(${DEPTH / 2}px)`,
            borderRadius: 24,
            overflow: 'hidden',
            backgroundColor: '#ffffff',
            border: '3px solid #12141c',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.12)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          <AbsoluteFill style={{ scale: 0.764 }}>
            {frontNode}
          </AbsoluteFill>

          {/* Specular lighting glare overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.03) 45%, transparent 65%)',
              opacity: 0.3 + glareOpacity,
              pointerEvents: 'none',
              mixBlendMode: 'overlay',
            }}
          />
        </div>

        {/* ── 5. Back Face (Mounted at -Z half-depth, pre-rotated 180deg) ────── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `translateZ(-${DEPTH / 2}px) rotateY(180deg)`,
            borderRadius: 24,
            overflow: 'hidden',
            backgroundColor: '#ffffff',
            border: '3px solid #12141c',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.12)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          <AbsoluteFill style={{ scale: 0.764 }}>
            {backNode}
          </AbsoluteFill>

          {/* Specular lighting glare overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.03) 45%, transparent 65%)',
              opacity: 0.3 + glareOpacity,
              pointerEvents: 'none',
              mixBlendMode: 'overlay',
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
