import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const SocialAd = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const brandOpacity = interpolate(
    frame,
    [0, 15],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const titleProgress = spring({
    frame: frame - 15,
    fps,
    config: {
      damping: 12,
      stiffness: 100,
    },
  });

  const titleY = interpolate(
    titleProgress,
    [0, 1],
    [100, 0]
  );

  const productProgress = spring({
    frame: frame - 35,
    fps,
    config: {
      damping: 10,
      stiffness: 80,
    },
  });

  const productScale = interpolate(
    productProgress,
    [0, 1],
    [0.5, 1]
  );

  const offerOpacity = interpolate(
    frame,
    [75, 95],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const buttonProgress = spring({
    frame: frame - 115,
    fps,
    config: {
      damping: 10,
      stiffness: 100,
    },
  });

  const buttonScale = interpolate(
    buttonProgress,
    [0, 1],
    [0.7, 1]
  );

  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(160deg, #0B1F2A 0%, #173B4D 100%)",
        fontFamily: "Arial, sans-serif",
        color: "white",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 90,
          left: 70,
          fontSize: 42,
          fontWeight: 800,
          opacity: brandOpacity,
          letterSpacing: 4,
        }}
      >
        NOVA
      </div>

      <div
        style={{
          position: "absolute",
          top: 220,
          left: 70,
          right: 70,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <div
          style={{
            fontSize: 32,
            letterSpacing: 3,
            marginBottom: 25,
          }}
        >
          ✨ NEW DROP
        </div>

        <div
          style={{
            fontSize: 86,
            fontWeight: 800,
            lineHeight: 1.05,
          }}
        >
          Wireless
          <br />
          Headphones
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 720,
          left: 140,
          width: 800,
          height: 600,
          borderRadius: 80,
          background:
            "linear-gradient(145deg, #ffffff, #d8e0e5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: `scale(${productScale})`,
          boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
        }}
      >
        <div
          style={{
            fontSize: 220,
            filter: "drop-shadow(0 20px 20px rgba(0,0,0,0.25))",
          }}
        >
          🎧
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 1390,
          left: 70,
          opacity: offerOpacity,
        }}
      >
        <div
          style={{
            fontSize: 76,
            fontWeight: 900,
          }}
        >
          30% OFF
        </div>

        <div
          style={{
            fontSize: 32,
            marginTop: 12,
            opacity: 0.75,
          }}
        >
          Limited time only
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 100,
          left: 70,
          right: 70,
          height: 120,
          borderRadius: 60,
          background: "#FFFFFF",
          color: "#0B1F2A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 38,
          fontWeight: 800,
          transform: `scale(${buttonScale})`,
        }}
      >
        SHOP NOW →
      </div>
    </AbsoluteFill>
  );
};