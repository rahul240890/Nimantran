import { existsSync } from "node:fs";
import { Config } from "@remotion/cli/config";

// Cloud sessions have a headless Chromium already; elsewhere Remotion downloads its own
const HEADLESS = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
if (existsSync(HEADLESS)) Config.setBrowserExecutable(HEADLESS);
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(92);
