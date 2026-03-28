import { Composition } from "remotion";
import { OffMarketVideo } from "./ListSignalVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="OffMarketExplainer"
      component={OffMarketVideo}
      durationInFrames={1600}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
