import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { Config } from "@remotion/cli/config";

// Cloud sessions have a headless Chromium already (its folder name carries a build number
// that changes); elsewhere Remotion downloads its own
const BROWSERS = "/opt/pw-browsers";
const shell = existsSync(BROWSERS)
  ? readdirSync(BROWSERS)
      .filter((dir) => dir.startsWith("chromium_headless_shell-"))
      .flatMap((dir) => [
        path.join(BROWSERS, dir, "chrome-linux", "headless_shell"),
        path.join(BROWSERS, dir, "chrome-headless-shell-linux64", "chrome-headless-shell"),
      ])
      .find((file) => existsSync(file))
  : undefined;
if (shell) Config.setBrowserExecutable(shell);
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(92);
