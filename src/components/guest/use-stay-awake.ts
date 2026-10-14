"use client";

import { useEffect } from "react";

/*
 * Keeps the phone's screen on while the invitation plays by itself (the opening, the pages
 * and the page below moving on), so it doesn't dim and lock halfway through. Phones with
 * the Screen Wake Lock API (most today) are asked directly, and asked again on coming back
 * to the tab, since the lock lapses when it is hidden. Older ones keep awake while a tiny
 * silent video plays on a loop out of sight, as they keep awake for any playing video.
 */

const STAY_AWAKE_VIDEO = "/media/stay-awake.mp4";

type Lock = { release: () => Promise<void>; released?: boolean };
type WakeLockNavigator = Navigator & {
  wakeLock?: { request: (type: "screen") => Promise<Lock> };
};

export function useStayAwake(awake: boolean) {
  useEffect(() => {
    if (!awake) return;
    const wake = (navigator as WakeLockNavigator).wakeLock;
    let lock: Lock | null = null;
    let video: HTMLVideoElement | null = null;
    let done = false;

    const ask = () => {
      if (done || document.visibilityState !== "visible") return;
      if (wake) {
        if (lock && !lock.released) return;
        wake
          .request("screen")
          .then((got) => {
            if (done) void got.release().catch(() => {});
            else lock = got;
          })
          .catch(() => {
            // Refused (low battery, or not allowed here): the screen keeps its own timer
          });
        return;
      }
      if (!video) {
        video = document.createElement("video");
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.setAttribute("playsinline", "");
        video.setAttribute("aria-hidden", "true");
        video.src = STAY_AWAKE_VIDEO;
        video.style.cssText =
          "position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;left:0;top:0;";
        document.body.append(video);
      }
      void video.play().catch(() => {});
    };

    ask();
    document.addEventListener("visibilitychange", ask);
    return () => {
      done = true;
      document.removeEventListener("visibilitychange", ask);
      void lock?.release().catch(() => {});
      if (video) {
        video.pause();
        video.remove();
      }
    };
  }, [awake]);
}
