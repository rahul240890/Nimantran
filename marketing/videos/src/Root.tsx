import { Composition } from "remotion";
import "./brand";
import { FPS, HEIGHT, WIDTH } from "./brand";
import { DESIGN_IDS, type Lang } from "./designs";
import { DesignOfTheDay, reelFrames } from "./DesignOfTheDay";
import { MeetShubh, TRAILER_FRAMES } from "./MeetShubh";
import { AD_IDS, ADS } from "./ads/ads";
import { AdVideo, adFrames } from "./ads/AdVideo";
import { FORMATS } from "./ads/formats";
import { Poster, POSTER_DEFAULTS, type PosterProps } from "./ads/Poster";

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
      <Composition
        id="poster"
        component={Poster}
        durationInFrames={600}
        fps={FPS}
        width={POSTER_DEFAULTS.width}
        height={POSTER_DEFAULTS.height}
        defaultProps={POSTER_DEFAULTS}
        calculateMetadata={({ props }: { props: PosterProps }) => ({
          width: props.width,
          height: props.height,
        })}
      />
      {AD_IDS.flatMap((ad) =>
        ADS[ad].formats.flatMap((format) =>
          LANGS.map((lang) => (
            <Composition
              key={`ad-${ad}-${format}-${lang}`}
              id={`ad-${ad}-${format}-${lang}`}
              component={AdVideo}
              durationInFrames={adFrames(ad, lang)}
              fps={FPS}
              width={FORMATS[format].width}
              height={FORMATS[format].height}
              defaultProps={{ ad, lang, format }}
            />
          )),
        ),
      )}
    </>
  );
}
