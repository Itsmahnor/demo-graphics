import type { ReactNode } from 'react';

export type SegmentDef = {
  key: string;
  duration: number;
  render: (frame: number) => ReactNode;
};

export const FLIP_DURATION = 22; // smooth, physical flip duration (frames)

export type FlipResult = {
  frontNode: ReactNode;
  backNode: ReactNode;
  rotateY: number;
  extraRotateX: number;
  extraRotateZ: number;
  elevation: number;
  glareOpacity: number;
};

// Smooth cubic ease-in-out curve
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const resolveFlip = (
  frame: number,
  segments: SegmentDef[]
): FlipResult => {
  // Cumulative start frames
  const starts: number[] = [];
  let acc = 0;
  for (const s of segments) {
    starts.push(acc);
    acc += s.duration;
  }

  const half = FLIP_DURATION / 2;
  const numTransitions = segments.length - 1;

  // 1. Check if currently inside any flip boundary between segment i and i+1
  for (let i = 0; i < numTransitions; i++) {
    const boundary = starts[i + 1];
    if (frame >= boundary - half && frame <= boundary + half) {
      const t = Math.min(1, Math.max(0, (frame - (boundary - half)) / FLIP_DURATION));
      const ease = easeInOutCubic(t);

      // Continuous rotation: transition i goes from (i * 180) to ((i + 1) * 180)
      const startAngle = i * 180;
      const rotateY = startAngle + ease * 180;

      // Realistic physical impulse during the flip (lift + tumble)
      const pop = Math.sin(t * Math.PI);
      const elevation = pop * -45; // pops toward camera in 3D
      const extraRotateX = pop * 14; // physical pitch
      const extraRotateZ = pop * -8; // subtle tilt

      // Determine which segment is mounted on front (even) and back (odd)
      const evenIdx = i % 2 === 0 ? i : i + 1;
      const oddIdx = i % 2 === 0 ? i + 1 : i;

      const frontFrame = Math.max(
        0,
        Math.min(frame - starts[evenIdx], segments[evenIdx].duration)
      );
      const backFrame = Math.max(
        0,
        Math.min(frame - starts[oddIdx], segments[oddIdx].duration)
      );

      // Glare peaks when card is angled ~45-90 degrees to the light
      const glareOpacity = Math.abs(Math.sin((rotateY * Math.PI) / 180)) * 0.45;

      return {
        frontNode: segments[evenIdx].render(frontFrame),
        backNode: segments[oddIdx].render(backFrame),
        rotateY,
        extraRotateX,
        extraRotateZ,
        elevation,
        glareOpacity,
      };
    }
  }

  // 2. Steady state (not actively flipping)
  let currentIdx = segments.length - 1;
  for (let i = 0; i < segments.length; i++) {
    if (frame < starts[i] + segments[i].duration) {
      currentIdx = i;
      break;
    }
  }

  const isOdd = currentIdx % 2 === 1;
  const rotateY = currentIdx * 180;
  const localFrame = Math.max(0, frame - starts[currentIdx]);

  let frontNode: ReactNode = null;
  let backNode: ReactNode = null;

  if (!isOdd) {
    // Current segment is on the FRONT face
    frontNode = segments[currentIdx].render(localFrame);
    // Pre-mount next segment on the BACK face (hidden, facing away)
    if (currentIdx + 1 < segments.length) {
      backNode = segments[currentIdx + 1].render(0);
    }
  } else {
    // Current segment is on the BACK face
    backNode = segments[currentIdx].render(localFrame);
    // Pre-mount next segment on the FRONT face (hidden, facing away)
    if (currentIdx + 1 < segments.length) {
      frontNode = segments[currentIdx + 1].render(0);
    }
  }

  return {
    frontNode,
    backNode,
    rotateY,
    extraRotateX: 0,
    extraRotateZ: 0,
    elevation: 0,
    glareOpacity: 0,
  };
};
