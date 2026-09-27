import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { TiltedCard } from "./TiltedCard";

export const CardPreview: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background: "#0a0a0a",
        alignItems: "center",
        justifyContent: "center",
        scale: 1.541
      }}
    >
      <TiltedCard rotate={-6} width={340}>
        <img
          src={staticFile("gi-product1.png")}
          alt="Rokai Gi"
          style={{ width: "100%", display: "block" }}
        />
      </TiltedCard>
    </AbsoluteFill>
  );
};