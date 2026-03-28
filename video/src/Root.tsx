import { Composition } from "remotion";
import { ListSignalVideo } from "./ListSignalVideo";

// Total: 180+300+360+330+180+360 = 1710 frames
// Minus transitions: 20+25+20+20+25 = 110 frames overlap
// Net: ~1600 frames = ~53 seconds at 30fps

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="ListSignalExplainer"
      component={ListSignalVideo}
      durationInFrames={1600}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
