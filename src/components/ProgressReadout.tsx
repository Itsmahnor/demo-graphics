import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

const THEME = {
  accent: "#ff3b30",
  text: "#ffffff",
  dim: "rgba(255,255,255,0.4)",
};

/** Pads a number to fixed decimal places */
const fmt = (n: number, decimals = 0) =>
  n.toFixed(decimals).padStart(6 + decimals, "0");

export const ProgressReadout: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progress = frame / durationInFrames; // 0 -> 1
  const barWidth = 220;
  const filledWidth = Math.round(barWidth * progress);

  // Fake ticking numeric readouts tied to frame number
  const scanPct = Math.min(99.9, progress * 102).toFixed(1);
  const freqVal = (820 + frame * 1.4).toFixed(0);
  const sigVal = (frame * 0.37).toFixed(2);

  return (
    <div
      style={{
        position: "absolute",
        top: 48,
        left: 48,
        fontFamily: "'Courier New', Courier, monospace",
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      {/* Progress bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <span style={{ color: THEME.accent, fontSize: 10, letterSpacing: 2 }}>
          SCAN
        </span>
        <div
          style={{
            width: barWidth,
            height: 3,
            background: "rgba(255,59,48,0.2)",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              width: filledWidth,
              background: THEME.accent,
              boxShadow: "0 0 6px #ff3b30",
              transition: "width 0ms",
            }}
          />
        </div>
        <span style={{ color: THEME.text, fontSize: 10, minWidth: 40 }}>
          {scanPct}%
        </span>
      </div>

      {/* Readout rows */}
      {[
        { label: "FREQ", value: `${freqVal} MHz` },
        { label: "SIG ", value: `${sigVal} dB` },
        { label: "FRM ", value: fmt(frame) },
      ].map(({ label, value }) => (
        <div
          key={label}
          style={{
            display: "flex",
            gap: 12,
            fontSize: 9,
            lineHeight: "18px",
          }}
        >
          <span style={{ color: THEME.accent, letterSpacing: 2 }}>{label}</span>
          <span style={{ color: THEME.dim, letterSpacing: 1 }}>{value}</span>
        </div>
      ))}
    </div>
  );
};
