import React from "react";
import { useCurrentFrame, spring, useVideoConfig } from "remotion";

const THEME = {
  accent: "#ff3b30",
  bracketColor: "rgba(255,59,48,0.85)",
};

interface BracketProps {
  x: number;
  y: number;
  /** Which corner: tl | tr | bl | br */
  corner: "tl" | "tr" | "bl" | "br";
  size?: number;
  thickness?: number;
}

const Bracket: React.FC<BracketProps> = ({
  x,
  y,
  corner,
  size = 40,
  thickness = 2,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 120, mass: 0.6 },
    durationInFrames: 20,
  });

  const s = size * progress;
  const t = thickness;
  const c = THEME.bracketColor;

  // Each corner is built from two rects (L-shape) rotated/flipped via CSS
  const flipX = corner === "tr" || corner === "br" ? "scaleX(-1)" : "";
  const flipY = corner === "bl" || corner === "br" ? "scaleY(-1)" : "";
  const transform = [flipX, flipY].filter(Boolean).join(" ") || "none";

  return (
    <g transform={`translate(${x}, ${y})`}>
      <g style={{ transform, transformBox: "fill-box", transformOrigin: "center" }}>
        {/* Horizontal arm */}
        <rect x={0} y={0} width={s} height={t} fill={c} />
        {/* Vertical arm */}
        <rect x={0} y={0} width={t} height={s} fill={c} />
        {/* Tiny corner accent dot */}
        <rect x={0} y={0} width={t * 2} height={t * 2} fill={THEME.accent} />
      </g>
    </g>
  );
};

export const CornerBrackets: React.FC = () => {
  const W = 1920;
  const H = 1080;
  const margin = 32;
  const size = 48;

  return (
    <svg
      width={W}
      height={H}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      {/* Top-left */}
      <Bracket x={margin} y={margin} corner="tl" size={size} />
      {/* Top-right */}
      <Bracket x={W - margin - size} y={margin} corner="tr" size={size} />
      {/* Bottom-left */}
      <Bracket x={margin} y={H - margin - size} corner="bl" size={size} />
      {/* Bottom-right */}
      <Bracket x={W - margin - size} y={H - margin - size} corner="br" size={size} />

      {/* Thin border lines connecting brackets (very faint) */}
      <rect
        x={margin}
        y={margin}
        width={W - margin * 2}
        height={H - margin * 2}
        fill="none"
        stroke="rgba(255,59,48,0.06)"
        strokeWidth={1}
      />
    </svg>
  );
};
