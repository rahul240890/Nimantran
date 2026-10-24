"use client";

import { nearScreen } from "@/components/ui/near-screen";
// Their stylesheets stay with the page, so what the server draws is styled from the first paint
import "@/components/invitation/type/fonts.css";
import "@/app/reveals.css";

/*
 * The home page's rows of designs, whose script is large (the design cards and their
 * previews): drawn by the server as usual, woken as they near the screen.
 */

export const HomeShelvesLater = nearScreen("designs", () =>
  import("./home-shelves").then((module) => module.HomeShelves),
);
