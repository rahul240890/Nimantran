import { Composition } from "remotion";
import "./brand";
import { FPS, HEIGHT, WIDTH } from "./brand";
import { DESIGN_IDS, type Lang } from "./designs";
import { DesignOfTheDay, reelFrames } from "./DesignOfTheDay";
import { MeetShubh, TRAILER_FRAMES } from "./MeetShubh";

const LANGS: Lang[] = ["en", "hi"];

export function Root() {
  return (
    <>
      {LANGS.map((lang) => (
        <Composition
          key={`meet-${lang}`}
          id={`meet-shubh-${lang}`}
          component={MeetShubh}
          durationInFrames={TRAILER_FRAMES}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
          defaultProps={{ lang }}
        />
      ))}
      {DESIGN_IDS.flatMap((design) =>
        LANGS.map((lang) => (
          <Composition
            key={`${design}-${lang}`}
            id={`dotd-${design}-${lang}`}
            component={DesignOfTheDay}
            durationInFrames={reelFrames(design)}
            fps={FPS}
            width={WIDTH}
            height={HEIGHT}
            defaultProps={{ design, lang }}
          />
        )),
      )}
    </>
  );
}
