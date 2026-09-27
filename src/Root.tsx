import { Composition } from 'remotion';
import { MyVideo, TOTAL_DURATION } from './MyVideo';
import { Rotating3DCube } from './Rotating3DCube';
import { FlipCard3D } from './FlipCard3D';

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="MyVideo"
        component={MyVideo}
        durationInFrames={TOTAL_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Rotating3DCube"
        component={Rotating3DCube}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="FlipCard3D"
        component={FlipCard3D}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
