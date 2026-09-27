import React from "react";
import { useCurrentFrame } from "remotion";

const THEME = {
  background: "#0a0a0a",
  grid: "rgba(255,59,48,0.07)",
};

export const GridBackground: React.FC = () => {
  const frame = useCurrentFrame();

  // Very slow drift — one full cell width every ~900 frames
  const driftX = (frame / 900) * 80;
  const driftY = (frame / 900) * 80;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: THEME.background,
        overflow: "hidden",
      }}
    >
      <svg
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <pattern
            id="smallGrid"
            width={80}
            height={80}
            patternUnits="userSpaceOnUse"
            x={driftX % 80}
            y={driftY % 80}
          >
            <path
              d="M 80 0 L 0 0 0 80"
              fill="none"
              stroke={THEME.grid}
              strokeWidth={0.6}
            />
          </pattern>
          <pattern
            id="bigGrid"
            width={400}
            height={400}
            patternUnits="userSpaceOnUse"
            x={driftX % 400}
            y={driftY % 400}
          >
            <rect width={400} height={400} fill="url(#smallGrid)" />
            <path
              d="M 400 0 L 0 0 0 400"
              fill="none"
              stroke="rgba(255,59,48,0.12)"
              strokeWidth={1.2}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#bigGrid)" />
      </svg>

      {/* Subtle radial vignette so edges are even darker */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.65) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
