"use client";

import { useId, type ReactNode } from "react";
import { CARD_VARS } from "@/lib/templates/stock";
import type { StockRole } from "@/lib/templates/schema";
import type { Layer, Placement, Shape } from "./decor";

const paint = (role: StockRole | undefined) => (role ? `var(${CARD_VARS[role]})` : "none");

function transformOf(p: Placement): string | undefined {
  const parts: string[] = [];
  if (p.at) parts.push(`translate(${p.at[0]} ${p.at[1]})`);
  if (p.rotate) parts.push(`rotate(${p.rotate})`);
  const s = p.scale ?? 1;
  if (s !== 1 || p.flipX || p.flipY) parts.push(`scale(${p.flipX ? -s : s} ${p.flipY ? -s : s})`);
  return parts.length ? parts.join(" ") : undefined;
}

function ShapeSvg({ shape }: { shape: Shape }) {
  return (
    <path
      d={shape.d}
      fill={paint(shape.fill)}
      stroke={paint(shape.stroke)}
      strokeWidth={shape.stroke ? (shape.width ?? 0.3) : undefined}
      opacity={shape.opacity}
    />
  );
}

function PlacementSvg({ placement }: { placement: Placement }) {
  return (
    <g transform={transformOf(placement)}>
      {placement.shapes?.map((shape, i) => (
        <ShapeSvg key={i} shape={shape} />
      ))}
      {placement.children?.map((child, i) => (
        <PlacementSvg key={i} placement={child} />
      ))}
    </g>
  );
}

/**
 * Draws ornament layers as SVG filling their parent, in the card's current colours
 * (the --card-* variables). Decorative, so hidden from screen readers.
 */
export function DecorSvg({
  layers,
  width,
  height,
  className,
}: {
  layers: readonly Layer[];
  width: number;
  height: number;
  className?: string;
}) {
  const id = useId().replace(/[^\w-]/g, "");
  const defs: ReactNode[] = [];
  const body = layers.map((layer, i) => {
    const clipId = layer.clip ? `${id}c${i}` : undefined;
    if (layer.clip) {
      defs.push(
        <clipPath key={`c${i}`} id={clipId}>
          <path d={layer.clip} clipRule={layer.clipEvenOdd ? "evenodd" : undefined} />
        </clipPath>,
      );
    }
    let content: ReactNode = layer.items?.map((item, j) => (
      <PlacementSvg key={j} placement={item} />
    ));
    if (layer.pattern) {
      const patternId = `${id}p${i}`;
      const [w, h] = layer.pattern.tile;
      defs.push(
        <pattern key={`p${i}`} id={patternId} patternUnits="userSpaceOnUse" width={w} height={h}>
          {layer.pattern.items.map((item, j) => (
            <PlacementSvg key={j} placement={item} />
          ))}
        </pattern>,
      );
      content = (
        <>
          <rect width={width} height={height} fill={`url(#${patternId})`} />
          {content}
        </>
      );
    }
    return (
      <g key={i} clipPath={clipId ? `url(#${clipId})` : undefined} opacity={layer.opacity}>
        {content}
      </g>
    );
  });

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={{ overflow: "hidden" }}
    >
      {defs.length > 0 && <defs>{defs}</defs>}
      {body}
    </svg>
  );
}
