// Rotating3DCube.tsx
// Install first: npx remotion add @remotion/three
// (or: npm i three @react-three/fiber @remotion/three @types/three)

import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

export const Rotating3DCube: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  // Continuous rotation driven by the timeline, not real time
  const rotationY = interpolate(frame, [0, 150], [0, Math.PI * 2]);
  const rotationX = interpolate(frame, [0, 300], [0, Math.PI * 2]);

  // A little "pop in" scale animation using spring physics
  const scale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  return (
    <ThreeCanvas
      width={width}
      height={height}
      // camera position/fov controls how strong the "3D" perspective feels
      camera={{ position: [0, 0, 6], fov: 45 }}
    >
      {/* Lighting is required — flat/unlit meshes look 2D even in 3D space */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, -5, 5]} intensity={0.4} color="#4a9eff" />

      <mesh
        rotation={[rotationX, rotationY, 0]}
        scale={[scale, scale, scale]}
      >
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#e74c3c" metalness={0.3} roughness={0.4} />
      </mesh>
    </ThreeCanvas>
  );
};
