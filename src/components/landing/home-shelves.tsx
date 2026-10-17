"use client";

import { useMemo } from "react";
import type { DesignNames } from "@/components/gallery/design-name";
import { DesignNamesProvider } from "@/components/gallery/design-names";
import { TraditionTiles, type Covers } from "@/components/gallery/shelf-row";
import { TrendingRow } from "@/components/gallery/trending-row";
import { designCatalog } from "@/lib/gallery/filters";

/**
 * The home page's designs, kept short: the wedding traditions as round paintings, then the
 * designs hosts are choosing most. Every other row lives on the Designs page.
 */
export function HomeShelves({
  designsPath,
  covers,
  names,
}: {
  designsPath: string;
  covers: Covers;
  /** The designs' names in the page's language (design-names.tsx). */
  names: DesignNames;
}) {
  const entries = useMemo(() => designCatalog(), []);
  return (
    <DesignNamesProvider names={names}>
      <TraditionTiles
        designsPath={designsPath}
        headingId="home-traditions"
        eager={false}
        level={3}
      />
      <TrendingRow id="home-trending" covers={covers} entries={entries} />
    </DesignNamesProvider>
  );
}
