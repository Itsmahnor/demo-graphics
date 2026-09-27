import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  staticFile,
} from "remotion";

// ─── Constants ────────────────────────────────────────────────────────────────
const TOTAL  = 300;
const BG     = "#0a0a0a";
const ACCENT = "#ff3b30";
const CARD_W = 540;
const CARD_H = 740;
const DEPTH  = 28; // 3D physical slab thickness

// ─── Easing ───────────────────────────────────────────────────────────────────
const easeInOutQuart = (t: number) =>
  t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

// ─── Front Face: Front view of the product ────────────────────────────────────
const ProductFront: React.FC<{ floatY: number }> = ({ floatY }) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "radial-gradient(ellipse 80% 70% at 50% 45%, #18191f 0%, #0c0d12 100%)",
      borderRadius: 24,
      overflow: "hidden",
      border: "2px solid rgba(255, 59, 48, 0.35)",
      boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.08)",
    }}
  >
    {/* HUD Top tag */}
    <div
      style={{
        position: "absolute",
        top: 24,
        left: 28,
        right: 28,
        display: "flex",
        justifyContent: "space-between",
        fontFamily: "'Courier New', monospace",
        fontSize: 10,
        letterSpacing: 4,
        color: `${ACCENT}cc`,
        textTransform: "uppercase",
        zIndex: 5,
      }}
    >
      <span>ROKAI COMPETITION GI</span>
      <span>VIEW: FRONT</span>
    </div>

    {/* Corner brackets */}
    {(
      [
        { top: 44, left: 20 },
        { top: 44, right: 20 },
        { bottom: 44, left: 20 },
        { bottom: 44, right: 20 },
      ] as React.CSSProperties[]
    ).map((pos, i) => {
      const r = "right" in pos;
      const b = "bottom" in pos;
      return (
        <svg
          key={i}
          width={20}
          height={20}
          viewBox="0 0 24 24"
          style={{ position: "absolute", zIndex: 4, ...pos }}
        >
          <path
            d={
              r && b
                ? "M24,0 L24,24 L0,24"
                : r
                ? "M0,0 L24,0 L24,24"
                : b
                ? "M0,0 L0,24 L24,24"
                : "M24,24 L0,24 L0,0"
            }
            fill="none"
            stroke={ACCENT}
            strokeWidth={2}
          />
        </svg>
      );
    })}

    {/* Product Image (Front) */}
    <div
      style={{
        width: "90%",
        height: "82%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `translateY(${floatY}px)`,
        transition: "transform 0.1s ease-out",
      }}
    >
      <img
        src={staticFile("gi-product1.png")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          filter: "drop-shadow(0 20px 40px rgba(0, 0, 0, 0.9)) drop-shadow(0 0 50px rgba(255, 59, 48, 0.22))",
        }}
        alt="Rokai Gi Front"
      />
    </div>

    {/* Bottom status */}
    <div
      style={{
        position: "absolute",
        bottom: 22,
        fontFamily: "'Courier New', monospace",
        fontSize: 9,
        letterSpacing: 5,
        color: "rgba(255,255,255,0.4)",
        textTransform: "uppercase",
        zIndex: 5,
      }}
    >
      SERIES 01 &nbsp;◆&nbsp; 450 GSM PEARL WEAVE
    </div>
  </div>
);

// ─── Back Face: Authentic Back View of the SAME Product ───────────────────────
const ProductBack: React.FC<{ floatY: number }> = ({ floatY }) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "radial-gradient(ellipse 80% 70% at 50% 45%, #18191f 0%, #0c0d12 100%)",
      borderRadius: 24,
      overflow: "hidden",
      border: "2px solid rgba(255, 59, 48, 0.35)",
      boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.08)",
    }}
  >
    {/* HUD Top tag */}
    <div
      style={{
        position: "absolute",
        top: 24,
        left: 28,
        right: 28,
        display: "flex",
        justifyContent: "space-between",
        fontFamily: "'Courier New', monospace",
        fontSize: 10,
        letterSpacing: 4,
        color: `${ACCENT}cc`,
        textTransform: "uppercase",
        zIndex: 5,
      }}
    >
      <span>ROKAI COMPETITION GI</span>
      <span>VIEW: BACK</span>
    </div>

    {/* Corner brackets */}
    {(
      [
        { top: 44, left: 20 },
        { top: 44, right: 20 },
        { bottom: 44, left: 20 },
        { bottom: 44, right: 20 },
      ] as React.CSSProperties[]
    ).map((pos, i) => {
      const r = "right" in pos;
      const b = "bottom" in pos;
      return (
        <svg
          key={i}
          width={20}
          height={20}
          viewBox="0 0 24 24"
          style={{ position: "absolute", zIndex: 4, ...pos }}
        >
          <path
            d={
              r && b
                ? "M24,0 L24,24 L0,24"
                : r
                ? "M0,0 L24,0 L24,24"
                : b
                ? "M0,0 L0,24 L24,24"
                : "M24,24 L0,24 L0,0"
            }
            fill="none"
            stroke={ACCENT}
            strokeWidth={2}
          />
        </svg>
      );
    })}

    {/* Product Image: Rear View of the Jacket (Silhouette, Shading, Back Embroidery) */}
    <div
      style={{
        width: "90%",
        height: "82%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `translateY(${floatY}px)`,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Rear Gi SVG Graphic — Exact same silhouette, proportions, and lighting */}
        <svg
          viewBox="0 0 500 500"
          style={{
            width: "96%",
            height: "96%",
            filter: "drop-shadow(0 20px 40px rgba(0, 0, 0, 0.95)) drop-shadow(0 0 45px rgba(255, 59, 48, 0.25))",
          }}
        >
          <defs>
            {/* Fabric texture gradient */}
            <linearGradient id="backBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e1f26" />
              <stop offset="40%" stopColor="#15161b" />
              <stop offset="85%" stopColor="#0d0e12" />
              <stop offset="100%" stopColor="#08090c" />
            </linearGradient>

            {/* Left sleeve shading */}
            <linearGradient id="leftSleeveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#181920" />
              <stop offset="60%" stopColor="#0e0f14" />
              <stop offset="100%" stopColor="#08090b" />
            </linearGradient>

            {/* Right sleeve shading */}
            <linearGradient id="rightSleeveGrad" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#252733" />
              <stop offset="50%" stopColor="#14151b" />
              <stop offset="100%" stopColor="#090a0d" />
            </linearGradient>

            {/* Rim light along shoulders */}
            <linearGradient id="rimLight" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>

            {/* Belt wrap gradient */}
            <linearGradient id="beltGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0a0a0d" />
              <stop offset="50%" stopColor="#1a1c24" />
              <stop offset="100%" stopColor="#0a0a0d" />
            </linearGradient>
          </defs>

          {/* Left Sleeve (Back View) */}
          <path
            d="M 175 90 L 95 180 L 140 375 L 188 360 L 195 240 Z"
            fill="url(#leftSleeveGrad)"
            stroke="#232530"
            strokeWidth="1.5"
          />
          {/* Left sleeve red patch (seen from rear angle) */}
          <rect
            x="115"
            y="215"
            width="22"
            height="36"
            rx="3"
            transform="rotate(-15 126 233)"
            fill="#d82c20"
            stroke="#ff5e52"
            strokeWidth="1"
          />

          {/* Right Sleeve (Back View) */}
          <path
            d="M 325 90 L 405 180 L 360 375 L 312 360 L 305 240 Z"
            fill="url(#rightSleeveGrad)"
            stroke="#232530"
            strokeWidth="1.5"
          />
          {/* Right sleeve red patch (seen from rear angle) */}
          <rect
            x="363"
            y="215"
            width="22"
            height="36"
            rx="3"
            transform="rotate(15 374 233)"
            fill="#d82c20"
            stroke="#ff5e52"
            strokeWidth="1"
          />

          {/* Main Jacket Back (Solid Woven Pearl Weave) */}
          <path
            d="M 210 65 Q 250 82 290 65 L 340 100 L 315 390 L 185 390 L 160 100 Z"
            fill="url(#backBodyGrad)"
            stroke="#282a36"
            strokeWidth="2"
          />

          {/* Rear Collar Band */}
          <path
            d="M 210 65 Q 250 82 290 65 Q 250 72 210 65 Z"
            fill="#1c1d24"
            stroke="#383c4d"
            strokeWidth="2"
          />

          {/* Upper Yoke Stitch Seam */}
          <path
            d="M 175 140 Q 250 160 325 140"
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1.5"
            strokeDasharray="4,3"
          />

          {/* Large Championship ROKAI Back Crest Emblem */}
          <g transform="translate(250, 185)">
            {/* Outer Hexagon / Shield Ring */}
            <circle
              cx="0"
              cy="0"
              r="44"
              fill="rgba(10,10,14,0.6)"
              stroke="#ff3b30"
              strokeWidth="2.5"
            />
            {/* Triangle icon */}
            <polygon
              points="0,-26 26,20 -26,20"
              fill="none"
              stroke="#ff3b30"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            {/* Inner Red Core */}
            <circle cx="0" cy="8" r="8" fill="#ff3b30" />

            {/* Back Text: ROKAI */}
            <text
              x="0"
              y="68"
              textAnchor="middle"
              fill="#ffffff"
              fontFamily="'Courier New', monospace"
              fontWeight="900"
              fontSize="17"
              letterSpacing="7"
            >
              ROKAI
            </text>
            <text
              x="0"
              y="84"
              textAnchor="middle"
              fill="rgba(255,255,255,0.4)"
              fontFamily="'Courier New', monospace"
              fontSize="8"
              letterSpacing="4"
            >
              TOKYO • NY • SAO PAULO
            </text>
          </g>

          {/* Black Belt Wrapping Around the Back */}
          <rect
            x="172"
            y="312"
            width="156"
            height="32"
            rx="4"
            fill="url(#beltGrad)"
            stroke="#111218"
            strokeWidth="2"
          />
          {/* Belt Red Rank Sleeve Visible on Rear Side */}
          <rect
            x="285"
            y="314"
            width="28"
            height="28"
            rx="2"
            fill="#d82c20"
            stroke="#ff5e52"
            strokeWidth="1"
          />
          {/* Rank stripes */}
          <line x1="304" y1="314" x2="304" y2="342" stroke="#ffffff" strokeWidth="2.5" />

          {/* Bottom Skirt Vent Seam */}
          <line
            x1="250"
            y1="344"
            x2="250"
            y2="390"
            stroke="rgba(0,0,0,0.7)"
            strokeWidth="2.5"
          />

          {/* Bottom Hem Stitching */}
          <line
            x1="185"
            y1="384"
            x2="315"
            y2="384"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1.5"
            strokeDasharray="5,3"
          />
        </svg>
      </div>
    </div>

    {/* Bottom label */}
    <div
      style={{
        position: "absolute",
        bottom: 22,
        fontFamily: "'Courier New', monospace",
        fontSize: 9,
        letterSpacing: 5,
        color: "rgba(255,255,255,0.4)",
        textTransform: "uppercase",
        zIndex: 5,
      }}
    >
      REAR VIEW &nbsp;◆&nbsp; REINFORCED BACK PANEL
    </div>
  </div>
);

// ─── Main Composition ─────────────────────────────────────────────────────────
export const FlipCard3D: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Entrance Zoom ──
  const entryScale = interpolate(frame, [0, 35], [0.75, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const entryOpacity = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitOpacity = interpolate(frame, [TOTAL - 20, TOTAL - 5], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = Math.min(entryOpacity, exitOpacity);

  // ── Flip 1: 0° → 180° (Show Product Back) ──
  const f1 = easeInOutQuart(
    interpolate(frame, [75, 115], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  ) * 180;

  // ── Flip 2: 180° → 360° (Rotate Back to Product Front) ──
  const f2 = easeInOutQuart(
    interpolate(frame, [195, 235], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  ) * 180;

  const rotateY = f1 + f2;

  // Physical impulse during flip: subtle lift toward camera & realistic tilt
  const flipProgress1 = interpolate(frame, [75, 115], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const flipProgress2 = interpolate(frame, [195, 235], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const flipPulse =
    Math.sin(flipProgress1 * Math.PI) + Math.sin(flipProgress2 * Math.PI);

  const elevation = flipPulse * -40; // pops in 3D Z space
  const tiltX = flipPulse * 10;      // physical forward pitch

  const isFlipping =
    (frame >= 75 && frame <= 115) || (frame >= 195 && frame <= 235);
  const floatY = isFlipping ? 0 : 8 * Math.sin((frame / 70) * Math.PI);

  const norm = ((rotateY % 360) + 360) % 360;
  const showingBack = norm > 90 && norm < 270;

  const bgPulse = 0.5 + 0.5 * Math.sin((frame / TOTAL) * Math.PI * 2);

  return (
    <AbsoluteFill
      style={{
        background: BG,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* ── Background Glow ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 60% 50% at 50% 50%,
            rgba(255, 59, 48, ${0.06 + bgPulse * 0.05}) 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* ── Subtle Cyber Grid ── */}
      <svg
        style={{ position: "absolute", inset: 0, opacity: 0.05 }}
        width="100%"
        height="100%"
      >
        <defs>
          <pattern id="gridPattern" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#ff3b30" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#gridPattern)" />
      </svg>

      {/* ── 3D Ground Floor Shadow ── */}
      <div
        style={{
          position: "absolute",
          width: CARD_W * 0.9,
          height: CARD_H * 0.35,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(255, 59, 48, 0.18) 0%, rgba(0, 0, 0, 0.7) 45%, transparent 70%)",
          filter: "blur(32px)",
          transform: `translateY(${280 + floatY * 0.3}px) rotateX(60deg) scale(${
            entryScale * (1 - flipPulse * 0.15)
          })`,
          opacity,
          pointerEvents: "none",
        }}
      />

      {/* ── Perspective Viewport ── */}
      <div
        style={{
          perspective: 1200,
          perspectiveOrigin: "50% 50%",
          opacity,
        }}
      >
        {/* ── 3D Rotating Product Slab (Full Physical Geometry) ── */}
        <div
          style={{
            width: CARD_W,
            height: CARD_H,
            position: "relative",
            transformStyle: "preserve-3d",
            transform: `
              scale(${entryScale})
              translateY(${elevation}px)
              rotateX(${tiltX}deg)
              rotateY(${rotateY}deg)
            `,
            willChange: "transform",
          }}
        >
          {/* ── Extruded 3D Edge Walls (Physical Slab Thickness) ── */}
          {/* Left Edge Wall */}
          <div
            style={{
              position: "absolute",
              width: DEPTH,
              height: CARD_H,
              left: -DEPTH / 2,
              top: 0,
              transform: "rotateY(-90deg)",
              background: "linear-gradient(180deg, #1c1f2b 0%, #0d0f15 100%)",
              borderTop: "1px solid rgba(255,255,255,0.15)",
              borderBottom: "1px solid rgba(0,0,0,0.6)",
            }}
          />

          {/* Right Edge Wall (facing directional light) */}
          <div
            style={{
              position: "absolute",
              width: DEPTH,
              height: CARD_H,
              right: -DEPTH / 2,
              top: 0,
              transform: "rotateY(90deg)",
              background: "linear-gradient(180deg, #383e54 0%, #1a1c26 100%)",
              borderTop: "1px solid rgba(255,255,255,0.25)",
              borderBottom: "1px solid rgba(0,0,0,0.6)",
            }}
          />

          {/* Top Edge Wall (metallic rim highlight) */}
          <div
            style={{
              position: "absolute",
              width: CARD_W,
              height: DEPTH,
              left: 0,
              top: -DEPTH / 2,
              transform: "rotateX(90deg)",
              background: "linear-gradient(90deg, #2b3044 0%, #525c7e 50%, #2b3044 100%)",
            }}
          />

          {/* Bottom Edge Wall */}
          <div
            style={{
              position: "absolute",
              width: CARD_W,
              height: DEPTH,
              left: 0,
              bottom: -DEPTH / 2,
              transform: "rotateX(-90deg)",
              background: "#08090c",
            }}
          />

          {/* ── Front Face: Mounted at +Z half-depth ── */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: `translateZ(${DEPTH / 2}px)`,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <ProductFront floatY={floatY} />

            {/* Specular glare reflection across the glass */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 24,
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.02) 40%, transparent 60%)",
                opacity: 0.35 + Math.abs(Math.sin((rotateY * Math.PI) / 180)) * 0.4,
                pointerEvents: "none",
                mixBlendMode: "overlay",
              }}
            />
          </div>

          {/* ── Back Face: Mounted at -Z half-depth (Pre-rotated 180deg) ── */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: `translateZ(-${DEPTH / 2}px) rotateY(180deg)`,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <ProductBack floatY={floatY} />

            {/* Specular glare reflection across the glass */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 24,
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.02) 40%, transparent 60%)",
                opacity: 0.35 + Math.abs(Math.sin((rotateY * Math.PI) / 180)) * 0.4,
                pointerEvents: "none",
                mixBlendMode: "overlay",
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Bottom HUD Indicator ── */}
      <div
        style={{
          position: "absolute",
          bottom: 50,
          fontFamily: "'Courier New', monospace",
          fontSize: 12,
          letterSpacing: 8,
          color: `${ACCENT}cc`,
          textTransform: "uppercase",
          opacity,
        }}
      >
        {showingBack ? "◆  BACK VIEW  ◆" : "◆  FRONT VIEW  ◆"}
      </div>
    </AbsoluteFill>
  );
};
