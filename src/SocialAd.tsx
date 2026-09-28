import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const CYAN = "#00E5FF";
const PINK = "#FF3D81";
const YELLOW = "#FFD60A";
const DARK = "#0B1F2A";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Deterministic pseudo-random so renders are identical every time
const rand = (i: number, salt = 1) => {
  const x = Math.sin(i * 12.9898 * salt) * 43758.5453;
  return x - Math.floor(x);
};

const SPARKLES = Array.from({ length: 24 }, (_, i) => ({
  x: rand(i, 1) * 1080,
  y: rand(i, 2) * 1920,
  size: 4 + rand(i, 3) * 10,
  speed: 0.6 + rand(i, 4) * 1.8,
  color: [CYAN, PINK, YELLOW, "#fff"][i % 4],
  phase: rand(i, 5) * 100,
}));

export const SocialAd = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const pop = (delay: number, damping = 12, stiffness = 100) =>
    spring({ frame: frame - delay, fps, config: { damping, stiffness } });

  // ---------- Timeline ----------
  const brandOpacity = interpolate(frame, [0, 15], [0, 1], clamp);
  const newDropProgress = pop(10, 10, 120);
  const word1 = pop(15);
  const word2 = pop(24);
  const productProgress = pop(35, 9, 80);
  const badgeProgress = pop(60, 6, 120);
  const offerOpacity = interpolate(frame, [75, 95], [0, 1], clamp);
  const offerY = interpolate(frame, [75, 95], [40, 0], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const buttonProgress = pop(115, 8, 110);

  // ---------- Ambient motion ----------
  const bgAngle = 160 + Math.sin(frame / 45) * 25;
  const bob = Math.sin(frame / 12) * 18;
  const tilt = Math.sin(frame / 20) * 6;
  const badgePulse = 1 + Math.sin(frame / 5) * 0.06;
  const buttonPulse = frame > 125 ? 1 + Math.sin((frame - 125) / 4) * 0.03 : 1;
  const shimmerX = interpolate((frame - 120) % 45, [0, 45], [-300, 1100], clamp);
  const arrowNudge = Math.sin(frame / 4) * 10;
  const urgency = interpolate(frame, [95, durationInFrames], [1, 0.35], clamp);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${bgAngle}deg, ${DARK} 0%, #173B4D 45%, #0d4a6b 100%)`,
        fontFamily: "'Arial Black', Arial, sans-serif",
        color: "white",
        overflow: "hidden",
      }}
    >
      {/* Glow orbs */}
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${PINK}88 0%, transparent 70%)`,
          top: 500 + Math.sin(frame / 30) * 60,
          left: -250 + Math.cos(frame / 40) * 80,
          filter: "blur(40px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${CYAN}77 0%, transparent 70%)`,
          top: 900 + Math.cos(frame / 35) * 70,
          right: -300 + Math.sin(frame / 45) * 80,
          filter: "blur(50px)",
        }}
      />

      {/* Floating sparkles */}
      {SPARKLES.map((s, i) => {
        const y = (((s.y - frame * s.speed * 3) % 2000) + 2000) % 2000 - 40;
        const twinkle = 0.3 + 0.7 * Math.abs(Math.sin((frame + s.phase) / 10));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: s.x,
              top: y,
              width: s.size,
              height: s.size,
              borderRadius: "50%",
              background: s.color,
              opacity: twinkle * 0.8,
              boxShadow: `0 0 ${s.size * 3}px ${s.color}`,
            }}
          />
        );
      })}

      {/* Brand */}
      <div
        style={{
          position: "absolute",
          top: 90,
          left: 70,
          fontSize: 46,
          letterSpacing: 8,
          opacity: brandOpacity,
          display: "flex",
          alignItems: "center",
          gap: 18,
        }}
      >
        <span
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: CYAN,
            boxShadow: `0 0 20px ${CYAN}`,
          }}
        />
        NOVA
      </div>

      {/* NEW DROP pill */}
      <div
        style={{
          position: "absolute",
          top: 90,
          right: 70,
          padding: "14px 30px",
          borderRadius: 50,
          background: `linear-gradient(90deg, ${PINK}, #ff7a45)`,
          fontSize: 28,
          letterSpacing: 3,
          transform: `scale(${newDropProgress})`,
          boxShadow: `0 0 30px ${PINK}99`,
        }}
      >
        ✨ NEW DROP
      </div>

      {/* Title */}
      <div style={{ position: "absolute", top: 230, left: 70, right: 70 }}>
        <div
          style={{
            fontSize: 118,
            lineHeight: 1,
            transform: `translateY(${interpolate(word1, [0, 1], [120, 0])}px)`,
            opacity: word1,
            textShadow: "0 8px 30px rgba(0,0,0,0.4)",
          }}
        >
          Wireless
        </div>
        <div
          style={{
            fontSize: 118,
            lineHeight: 1.05,
            transform: `translateY(${interpolate(word2, [0, 1], [120, 0])}px)`,
            opacity: word2,
            background: `linear-gradient(90deg, ${CYAN}, #7CF3FF, ${PINK})`,
            backgroundSize: "200% 100%",
            backgroundPosition: `${(frame * 2) % 200}% 0`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Headphones
        </div>
      </div>

      {/* Product stage */}
      <div
        style={{
          position: "absolute",
          top: 700,
          left: 140,
          width: 800,
          height: 620,
          transform: `scale(${interpolate(productProgress, [0, 1], [0.4, 1])})`,
          opacity: productProgress,
        }}
      >
        {/* Pulse rings */}
        {[0, 1, 2].map((i) => {
          const t = ((frame + i * 20) % 60) / 60;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 90,
                border: `4px solid ${i % 2 ? PINK : CYAN}`,
                transform: `scale(${1 + t * 0.35})`,
                opacity: (1 - t) * 0.6,
              }}
            />
          );
        })}

        {/* Card */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 80,
            background:
              "linear-gradient(145deg, #ffffff 0%, #d8e0e5 60%, #b8f3ff 100%)",
            boxShadow: `0 30px 80px rgba(0,0,0,0.45), 0 0 80px ${CYAN}66`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          {/* Sound bars */}
          <div
            style={{
              position: "absolute",
              bottom: 40,
              display: "flex",
              gap: 12,
              alignItems: "flex-end",
              height: 110,
            }}
          >
            {Array.from({ length: 16 }, (_, i) => {
              const h = 25 + Math.abs(Math.sin(frame / 4 + i * 0.7)) * 80;
              return (
                <div
                  key={i}
                  style={{
                    width: 20,
                    height: h,
                    borderRadius: 10,
                    background: `linear-gradient(180deg, ${CYAN}, ${PINK})`,
                    opacity: 0.85,
                  }}
                />
              );
            })}
          </div>

          <div
            style={{
              fontSize: 300,
              transform: `translateY(${bob - 30}px) rotate(${tilt}deg)`,
              filter: "drop-shadow(0 30px 25px rgba(0,0,0,0.3))",
            }}
          >
            🎧
          </div>
        </div>

        {/* Discount badge */}
        <div
          style={{
            position: "absolute",
            top: -50,
            right: -50,
            width: 230,
            height: 230,
            borderRadius: "50%",
            background: `radial-gradient(circle at 30% 30%, #fff27a, ${YELLOW} 60%, #ffa200)`,
            color: DARK,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            transform: `rotate(${interpolate(badgeProgress, [0, 1], [-90, 12])}deg) scale(${badgeProgress * badgePulse})`,
            boxShadow: `0 15px 40px rgba(0,0,0,0.4), 0 0 50px ${YELLOW}aa`,
            lineHeight: 0.95,
          }}
        >
          <div style={{ fontSize: 76 }}>30%</div>
          <div style={{ fontSize: 44, letterSpacing: 2 }}>OFF</div>
        </div>
      </div>

      {/* Offer + urgency */}
      <div
        style={{
          position: "absolute",
          top: 1400,
          left: 70,
          right: 70,
          opacity: offerOpacity,
          transform: `translateY(${offerY}px)`,
        }}
      >
        <div
          style={{
            fontSize: 44,
            letterSpacing: 4,
            color: YELLOW,
            textShadow: `0 0 20px ${YELLOW}88`,
          }}
        >
          🔥 LIMITED TIME ONLY
        </div>
        <div
          style={{
            marginTop: 28,
            height: 22,
            borderRadius: 11,
            background: "rgba(255,255,255,0.15)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${urgency * 100}%`,
              height: "100%",
              borderRadius: 11,
              background: `linear-gradient(90deg, ${YELLOW}, ${PINK})`,
              boxShadow: `0 0 20px ${PINK}`,
            }}
          />
        </div>
        <div style={{ marginTop: 16, fontSize: 28, opacity: 0.75 }}>
          Selling fast — grab yours before it's gone
        </div>
      </div>

      {/* CTA */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          left: 70,
          right: 70,
          height: 130,
          borderRadius: 65,
          background: `linear-gradient(90deg, #ffffff, #dffaff)`,
          color: DARK,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 46,
          gap: 20,
          overflow: "hidden",
          transform: `scale(${interpolate(buttonProgress, [0, 1], [0.6, 1]) * buttonPulse})`,
          opacity: buttonProgress,
          boxShadow: `0 0 0 6px ${CYAN}55, 0 20px 60px ${CYAN}88`,
        }}
      >
        {/* Shimmer sweep */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: shimmerX,
            width: 120,
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.95), transparent)",
            transform: "skewX(-20deg)",
          }}
        />
        <span style={{ position: "relative" }}>SHOP NOW</span>
        <span
          style={{
            position: "relative",
            transform: `translateX(${arrowNudge}px)`,
            color: PINK,
          }}
        >
          →
        </span>
      </div>
    </AbsoluteFill>
  );
};