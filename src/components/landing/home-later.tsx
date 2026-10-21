"use client";

import { nearScreen } from "@/components/ui/near-screen";
// Their stylesheets stay with the page, so what the server draws is styled from the first paint
import "@/components/invitation/type/fonts.css";
import "@/app/reveals.css";

/*
 * The home page's parts below the first screen whose scripts are large (the design cards,
 * the moving scene): drawn by the server as usual, woken as they near the screen.
 */

export const HomeShelvesLater = nearScreen("templates", () =>
  import("./home-shelves").then((module) => module.HomeShelves),
);

export const ScenePosterLater = nearScreen("kinds", () =>
  import("@/components/gallery/scene-poster").then((module) => module.ScenePoster),
);
