"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { CARD } from "@/lib/engine/scene-math";
import type { CardCopy } from "@/lib/templates/content";
import type { Template } from "@/lib/templates/schema";
import { layoutInside } from "../../art/layout";
import { MOTIFS } from "../../art/motifs";
import { glowBlending } from "../blending";
import { paintGlow } from "../card-art";
import type { MotionClock } from "./shared";

/** World units per face unit: the inside face is 100 units across. */
const UNIT = CARD.width / 100;

/** Where the symbol sits on the inside face, in face units, or null when there is none. */
export function symbolSpot(copy: CardCopy, template: Template) {
  if (!copy.symbol) return null;
  const layout = layoutInside(copy, template, MOTIFS[template.scene.motif]);
  if (layout.symbol) {
    const { top, size, x } = layout.symbol;
    return { x, y: top + size / 2, size };
  }
  const run = layout.runs.find((r) => r.key === "symbol");
  return run ? { x: run.x, y: run.top + run.lineHeight / 2, size: run.lineHeight } : null;
}

/**
 * A soft light behind the sacred symbol that rises during the opening and then breathes
 * slowly. Sacred art never spins or bounces (docs/TRADITIONS.md): glowing is all it does.
 */
export function SymbolGlow({
  copy,
  template,
  colour,
  dark,
  clock,
}: {
  copy: CardCopy;
  template: Template;
  colour: string;
  dark: boolean;
  clock: MotionClock;
}) {
  const spot = useMemo(() => symbolSpot(copy, template), [copy, template]);
  const material = useMemo(() => {
    const map = new THREE.CanvasTexture(paintGlow(colour, 128));
    map.colorSpace = THREE.SRGBColorSpace;
    return glowBlending(
      new THREE.MeshBasicMaterial({ map, transparent: true, depthWrite: false, toneMapped: false }),
    ) as THREE.MeshBasicMaterial;
  }, [colour]);
  useEffect(
    () => () => {
      material.map?.dispose();
      material.dispose();
    },
    [material],
  );

  const mesh = useRef<THREE.Mesh>(null);
  useFrame(() => {
    const m = mesh.current;
    if (!m) return;
    const open = clock.open.current ?? 0;
    const glow = clock.still ? 1 : (clock.tracks.current?.glow ?? 1);
    const t = clock.still ? 0 : (clock.time.current ?? 0);
    const breathe = clock.still ? 1 : 0.8 + 0.2 * Math.sin(t * 1.4);
    m.visible = open > 0.3 && glow > 0;
    (m.material as THREE.MeshBasicMaterial).opacity = glow * breathe * (dark ? 0.85 : 0.6);
  });

  if (!spot) return null;
  const size = spot.size * UNIT * 3.2;
  return (
    <mesh
      ref={mesh}
      position={[(spot.x - 50) * UNIT, CARD.height / 2 - spot.y * UNIT, CARD.thickness / 2 + 0.003]}
      material={material}
      raycast={() => null}
    >
      <planeGeometry args={[size, size]} />
    </mesh>
  );
}
