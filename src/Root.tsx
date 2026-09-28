import { Composition } from 'remotion';
import { MyVideo, TOTAL_DURATION } from './MyVideo';
import { Rotating3DCube } from './Rotating3DCube';

import { HUDShowcase } from './HUDShowcase';
import { SocialAd } from './SocialAd';

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
  id="HUDShowcase"
  component={HUDShowcase}
  durationInFrames={300}
  fps={30}
  width={1080}
  height={1620}
/>
<Composition
  id="SocialAd"
  component={SocialAd}
  durationInFrames={300}
  fps={30}
  width={1080}
  height={1620}
/>
    <Composition
      id="Rotating3DCube"
      component={Rotating3DCube}
      durationInFrames={150}
      fps={30}
      width={1520}
      height={1280}
    />
    </>
  );
};
