import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Sequence,
  staticFile,
} from "remotion";
import { GridBackground } from "./components/GridBackground";
import { CornerBrackets } from "./components/CornerBrackets";
import { ProgressReadout } from "./components/ProgressReadout";
import { Callout } from "./components/Callout";
import { TiltedCard } from './TiltedCard';

// ─── Theme ────────────────────────────────────────────────────────────────────
const THEME = {
  background: "#0a0a0a",
  accent: "#ff3b30",
  text: "#ffffff",
  dim: "rgba(255,255,255,0.55)",
};

// ─── Canvas & timing constants ─────────────────────────────────────────────────
const W = 1920;
const H = 1080;
const TOTAL = 300; // frames
const HOLD_START = 240; // frame at which callouts fade out (last 2 sec)

// ─── Callout data — placeholder anchors on a 1920×1080 canvas ─────────────────
//
//  The product image renders ~800 px tall centred at (960, 540).
//  Assuming a portrait garment image whose visible body spans roughly:
//    X: 700 – 1220   Y: 120 – 960
//
//  Placeholder anchor points (fromX, fromY) and label tips (toX, toY):
//
//  1. COLLAR  — top-centre of the garment
//     from: (960, 195)  →  label top-right: (1160, 140)
//
//  2. CHEST PATCH — upper-left chest area
//     from: (810, 390)  →  label left: (580, 360)
//
//  3. BELT BUCKLE — mid-body / waist
//     from: (960, 590)  →  label right: (1200, 560)
//
//  4. HEM LOGO — lower-front hem
//     from: (1010, 790)  →  label right: (1230, 820)
//
const CALLOUTS = [
  {
    fromX: 960, fromY: 195,
    toX: 1160, toY: 140,
    title: "COLLAR UNIT",
    subtitle: "Reinforced rib knit / 2.4 cm",
    startFrame: 30,
    endFrame: HOLD_START,
  },
  {
    fromX: 810, fromY: 390,
    toX: 570, toY: 340,
    title: "CHEST PATCH",
    subtitle: "Woven badge / 68×42 mm",
    startFrame: 70,
    endFrame: HOLD_START,
  },
  {
    fromX: 965, fromY: 590,
    toX: 1210, toY: 560,
    title: "BELT SYSTEM",
    subtitle: "Elastic webbing / adj. fit",
    startFrame: 110,
    endFrame: HOLD_START,
  },
  {
    fromX: 1015, fromY: 800,
    toX: 1235, toY: 840,
    title: "HEM LABEL",
    subtitle: "ROKAI embroidered logo",
    startFrame: 155,
    endFrame: HOLD_START,
  },
];

// ─── Product image with Ken Burns + rotateY wobble ────────────────────────────
const ProductImage: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slow scale: 1 → 1.08 over full duration via spring with very low stiffness
  const scaleSpring = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 8, mass: 1 },
    durationInFrames: TOTAL,
    from: 1,
    to: 1.08,
  });

  // RotateY wobble: slow sinusoidal ±6 deg
  const rotateY = 6 * Math.sin((frame / TOTAL) * Math.PI * 2);

  // Subtle translate (Ken Burns pan)
  const panX = interpolate(frame, [0, TOTAL], [-18, 18], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const panY = interpolate(frame, [0, TOTAL], [10, -10], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective: "900px",
      }}
    >
      <img
        src={staticFile("gi-product1.png")}
        style={{
          maxHeight: "82%",
          maxWidth: "60%",
          objectFit: "contain",
          transform: `scale(${scaleSpring}) translateX(${panX}px) translateY(${panY}px) rotateY(${rotateY}deg)`,
          filter: "drop-shadow(0 0 48px rgba(255,59,48,0.18))",
          willChange: "transform",
        }}
        alt="product"
      />
    </div>
  );
};

// ─── ROKAI wordmark that fades in during the hold ─────────────────────────────
const WordmarkOverlay: React.FC<{ holdStart: number }> = ({ holdStart }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = spring({
    frame: Math.max(0, frame - holdStart - 10),
    fps,
    config: { damping: 30, stiffness: 60, mass: 1 },
    durationInFrames: 30,
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 72,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          fontFamily: "'Courier New', Courier, monospace",
          fontWeight: 900,
          fontSize: 52,
          letterSpacing: 24,
          color: THEME.text,
          textTransform: "uppercase",
          textShadow: `0 0 30px ${THEME.accent}`,
        }}
      >
        ROKAI
      </div>
      <div
        style={{
          marginTop: 6,
          fontSize: 11,
          letterSpacing: 8,
          color: THEME.dim,
          fontFamily: "'Courier New', Courier, monospace",
          textTransform: "uppercase",
        }}
      >
        SCAN COMPLETE
      </div>
    </div>
  );
};

// ─── Callout wrapper that handles its own fade-out ────────────────────────────
const FadingCallout: React.FC<{
  fromX: number; fromY: number;
  toX: number; toY: number;
  title: string; subtitle: string;
  endFrame: number;
}> = ({ fromX, fromY, toX, toY, title, subtitle, endFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeOut = spring({
    frame: Math.max(0, frame - endFrame),
    fps,
    config: { damping: 22, stiffness: 120, mass: 0.6 },
    durationInFrames: 18,
    from: 1,
    to: 0,
  });

  return (
    <g opacity={fadeOut}>
      <Callout
        fromX={fromX} fromY={fromY}
        toX={toX} toY={toY}
        title={title} subtitle={subtitle}
      />
    </g>
  );
};

// ─── Main composition ─────────────────────────────────────────────────────────
export const HUDShowcase: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background: THEME.background,
        overflow: "hidden",
        scale: 1.198,
        translate: "-48px 0px"
      }}
      from={54}
    >
      {/* Layer 1 – Animated grid */}
      <GridBackground />

      {/* Layer 2 – Product image (Ken Burns + wobble) */}
      <ProductImage />

      {/* Layer 3 – All callout SVG lines (absolute overlay) */}
      <svg
        width={W}
        height={H}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        {CALLOUTS.map((c, i) => (
          <Sequence key={i} from={c.startFrame} layout="none">
            <FadingCallout
              fromX={c.fromX} fromY={c.fromY}
              toX={c.toX} toY={c.toY}
              title={c.title} subtitle={c.subtitle}
              endFrame={c.endFrame - c.startFrame}
            />
          </Sequence>
        ))}
      </svg>

      {/* Layer 4 – Corner brackets (draws in at frame 0) */}
      <CornerBrackets />

      {/* Layer 5 – Progress / readout HUD */}
      <ProgressReadout />

      {/* Layer 6 – ROKAI wordmark (holds at end) */}
      <WordmarkOverlay holdStart={HOLD_START} />
      <TiltedCard rotate={-6}>
  <img src={staticFile('gi-product.png')} alt="Rokai Gi" />
</TiltedCard>
    </AbsoluteFill>
  );
};
