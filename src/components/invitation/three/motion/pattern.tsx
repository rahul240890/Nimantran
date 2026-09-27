"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { patternStrokes, revealStrokes, type PatternId, type Stroke } from "@/lib/engine/patterns";
import type { MotionClock } from "./shared";

/** Radius of the pattern in world units: wider than the card, so it rings the doors. */
const RADIUS = 1.32;
const BASE_WIDTH = 0.011;

type Ribbon = { geometry: THREE.BufferGeometry; strokes: { index: number; indices: number }[] };

/**
 * Each stroke as a flat ribbon of triangles (WebGL lines are one pixel wide), all strokes
 * of one colour in one geometry, in drawing order, so revealing is a draw range.
 */
function ribbon(strokes: readonly Stroke[], colour: 0 | 1): Ribbon {
  const positions: number[] = [];
  const indices: number[] = [];
  const parts: Ribbon["strokes"] = [];
  strokes.forEach((stroke, index) => {
    if (stroke.colour !== colour) return;
    const p = stroke.points;
    const n = p.length / 2;
    const half = (BASE_WIDTH * stroke.width) / 2 / RADIUS;
    const base = positions.length / 3;
    for (let i = 0; i < n; i++) {
      const prev = Math.max(i - 1, 0);
      const next = Math.min(i + 1, n - 1);
      let dx = p[next * 2]! - p[prev * 2]!;
      let dy = p[next * 2 + 1]! - p[prev * 2 + 1]!;
      const length = Math.hypot(dx, dy) || 1;
      dx /= length;
      dy /= length;
      const x = p[i * 2]!;
      const y = p[i * 2 + 1]!;
      positions.push(x - dy * half, y + dx * half, 0, x + dy * half, y - dx * half, 0);
    }
    const start = indices.length;
    for (let i = 0; i < n - 1; i++) {
      const a = base + i * 2;
      indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
    parts.push({ index, indices: indices.length - start });
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  return { geometry, strokes: parts };
}

/** How many indices of a ribbon to draw for the strokes' reveal fractions. */
function drawCount(ribbon: Ribbon, fractions: readonly number[]): number {
  let count = 0;
  for (const part of ribbon.strokes) {
    const fraction = fractions[part.index] ?? 0;
    // Whole triangles pairs only
    count += Math.floor((part.indices / 6) * fraction) * 6;
    if (fraction < 1) break;
  }
  return count;
}

/**
 * A kolam, rangoli, alpona or gold line that draws itself on the wall behind the card
 * during the opening, stroke by stroke, and then stays.
 */
export function PatternBackdrop({
  id,
  colours,
  clock,
}: {
  id: PatternId;
  colours: readonly [string, string];
  clock: MotionClock;
}) {
  const strokes = useMemo(() => patternStrokes(id), [id]);
  const ribbons = useMemo(() => [ribbon(strokes, 0), ribbon(strokes, 1)] as const, [strokes]);
  const materials = useMemo(
    () =>
      colours.map(
        (colour) =>
          new THREE.MeshBasicMaterial({
            color: colour,
            transparent: true,
            opacity: 0.92,
            depthWrite: false,
            side: THREE.DoubleSide,
            toneMapped: false,
          }),
      ),
    [colours],
  );
  const meshes = [useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null)];

  useEffect(() => () => ribbons.forEach((r) => r.geometry.dispose()), [ribbons]);
  useEffect(() => () => materials.forEach((m) => m.dispose()), [materials]);

  useFrame(() => {
    const progress = clock.still ? 1 : (clock.tracks.current?.pattern ?? 1);
    const fractions = revealStrokes(strokes, progress);
    ribbons.forEach((r) => r.geometry.setDrawRange(0, drawCount(r, fractions)));
    // Fades a little while the card is shut, so it never competes with the closed doors
    const open = clock.open.current ?? 0;
    materials.forEach((m) => (m.opacity = 0.35 + 0.57 * open));
    meshes.forEach((mesh) => mesh.current && (mesh.current.visible = open > 0.02));
  });

  return (
    <group position={[0, 0.02, -0.42]} scale={RADIUS} raycast={() => null}>
      {ribbons.map((r, i) => (
        <mesh
          key={i}
          ref={meshes[i]}
          geometry={r.geometry}
          material={materials[i]}
          frustumCulled={false}
          raycast={() => null}
        />
      ))}
    </group>
  );
}
