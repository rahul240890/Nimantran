import type { CSSProperties } from "react";
import type { FrameBox } from "@/lib/suites/photo-frames";
import { floatInstances, type MovingScene } from "@/lib/suites/moving";

/*
 * A moving scene's painting in its layers (moving.ts): the sky at the back, the place in
 * front of it, the pieces nearest the guest, and small things floating through it all.
 * Everything moves with CSS alone (globals.css, "Moving scenes"), so it costs the phone
 * little: the sky and the place breathe at different rates, which gives the scene depth,
 * the front pieces sway from where they hang or grow, water shimmers, and petals fall, lanterns rise and birds cross. Only drawn without reduced motion; with it,
 * the scene shows as its flat painting instead.
 */

const box = ([x, y, width, height]: FrameBox): CSSProperties => ({
  left: `${x}%`,
  top: `${y}%`,
  width: `${width}%`,
  height: `${height}%`,
});

export function MovingLayers({ scene }: { scene: MovingScene }) {
  const { layers, front, water } = scene;
  const floats = floatInstances(scene);
  return (
    <div aria-hidden className="moving-scene absolute inset-0 overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element -- a layer of the painting */}
      <img
        src={layers.sky}
        alt=""
        draggable={false}
        className="moving-sky absolute inset-0 size-full select-none"
      />
      <div className="moving-middle absolute" style={box(layers.middle)}>
        {/* eslint-disable-next-line @next/next/no-img-element -- a layer of the painting */}
        <img
          src={layers.middleImage}
          alt=""
          draggable={false}
          className="absolute inset-0 size-full select-none"
        />
        {water && (
          // The water again, a little apart, shimmering over itself
          // eslint-disable-next-line @next/next/no-img-element -- a layer of the painting
          <img
            src={layers.middleImage}
            alt=""
            draggable={false}
            className="moving-water absolute inset-0 size-full select-none"
            style={{ clipPath: waterClip(layers.middle, water) }}
          />
        )}
      </div>
      {floats.map((float) => (
        <span
          key={float.key}
          className="moving-float absolute top-0 left-0"
          data-kind={float.kind}
          style={float.style}
        >
          <span className="moving-float-turn block">
            {/* eslint-disable-next-line @next/next/no-img-element -- a floating piece */}
            <img
              src={float.src}
              alt=""
              draggable={false}
              className="moving-float-art block w-full select-none"
              data-flap={float.pair ? "a" : undefined}
            />
            {float.pair && (
              // The same bird or butterfly with its wings the other way, shown in turn
              // eslint-disable-next-line @next/next/no-img-element -- a floating piece
              <img
                src={float.pair}
                alt=""
                draggable={false}
                className="moving-float-art absolute inset-0 block w-full select-none"
                data-flap="b"
              />
            )}
          </span>
        </span>
      ))}
      {front.map((piece, i) => (
        // eslint-disable-next-line @next/next/no-img-element -- a piece of the painting in front
        <img
          key={piece.src}
          src={piece.src}
          alt=""
          draggable={false}
          data-motion={piece.motion}
          data-side={piece.side}
          className="moving-front absolute select-none"
          style={
            {
              ...box(piece.box),
              transformOrigin: `${piece.origin[0]}% ${piece.origin[1]}%`,
              "--sway-time": `${6 + ((i * 1.7) % 3.4)}s`,
              "--sway-delay": `${-((i * 2.3) % 5)}s`,
              "--sway": `${piece.amount}deg`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

/** The water band of the place, as a clip of the place's own box. */
function waterClip(middle: FrameBox, [top, bottom]: readonly [number, number]): string {
  const [, y, , height] = middle;
  const from = Math.max(0, ((top - y) / height) * 100);
  const to = Math.max(0, 100 - ((bottom - y) / height) * 100);
  return `inset(${from.toFixed(2)}% 0 ${to.toFixed(2)}% 0)`;
}
