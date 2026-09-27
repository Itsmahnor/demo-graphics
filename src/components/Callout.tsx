import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";

export interface CalloutProps {
  /** Anchor point on the product image (absolute canvas coords) */
  fromX: number;
  fromY: number;
  /** Tip of the label line (absolute canvas coords) */
  toX: number;
  toY: number;
  title: string;
  subtitle: string;
}

const THEME = {
  accent: "#ff3b30",
  text: "#ffffff",
  dim: "rgba(255,255,255,0.55)",
  lineDim: "rgba(255,59,48,0.75)",
};

const DOT_RADIUS = 5;
const PULSE_PERIOD = 60; // frames for one pulse cycle

export const Callout: React.FC<CalloutProps> = ({
  fromX,
  fromY,
  toX,
  toY,
  title,
  subtitle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Line draw-on: strokeDashoffset animated via spring
  const lineLength = Math.hypot(toX - fromX, toY - fromY);

  const drawProgress = spring({
    frame,
    fps,
    config: { damping: 22, stiffness: 140, mass: 0.5 },
    durationInFrames: 25,
  });

  const dashOffset = lineLength * (1 - drawProgress);

  // Label fade in
  const labelOpacity = spring({
    frame: Math.max(0, frame - 12), // slight delay after line
    fps,
    config: { damping: 20, stiffness: 100, mass: 0.5 },
    durationInFrames: 18,
  });

  // Pulsing dot — sinusoidal scale
  const pulse = 1 + 0.35 * Math.sin((frame / PULSE_PERIOD) * Math.PI * 2);

  // Text alignment: if label is to the right, left-align; to the left, right-align
  const isRight = toX >= fromX;
  const textX = isRight ? toX + 10 : toX - 10;
  const textAnchor = isRight ? "start" : "end";

  return (
    <g>
      {/* Animated line */}
      <line
        x1={fromX}
        y1={fromY}
        x2={toX}
        y2={toY}
        stroke={THEME.lineDim}
        strokeWidth={1.2}
        strokeDasharray={lineLength}
        strokeDashoffset={dashOffset}
      />

      {/* Pulsing anchor dot */}
      <circle
        cx={fromX}
        cy={fromY}
        r={DOT_RADIUS * pulse}
        fill={THEME.accent}
        opacity={0.9}
      />
      {/* Static inner dot */}
      <circle cx={fromX} cy={fromY} r={DOT_RADIUS * 0.45} fill="#fff" />

      {/* Horizontal tick at label end */}
      <line
        x1={toX}
        y1={toY}
        x2={isRight ? toX + 28 : toX - 28}
        y2={toY}
        stroke={THEME.lineDim}
        strokeWidth={1}
        opacity={drawProgress}
      />

      {/* Label */}
      <g opacity={labelOpacity}>
        <text
          x={textX}
          y={toY - 5}
          fill={THEME.text}
          fontSize={13}
          fontWeight={700}
          fontFamily="'Courier New', Courier, monospace"
          textAnchor={textAnchor}
          letterSpacing={1.5}
        >
          {title}
        </text>
        <text
          x={textX}
          y={toY + 12}
          fill={THEME.dim}
          fontSize={10}
          fontFamily="'Courier New', Courier, monospace"
          textAnchor={textAnchor}
          letterSpacing={0.8}
        >
          {subtitle}
        </text>
      </g>
    </g>
  );
};
