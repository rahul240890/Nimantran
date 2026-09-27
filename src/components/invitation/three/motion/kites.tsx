"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { seededRandom, type Bounds } from "@/lib/engine/particles";
import { ease, type MotionClock } from "./shared";

/** A patang: a diamond of paper with a small triangular tail (the phundna). */
function kiteGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.1);
  shape.lineTo(0.085, 0);
  shape.lineTo(0, -0.1);
  shape.lineTo(-0.085, 0);
  shape.closePath();
  const tail = new THREE.Shape();
  tail.moveTo(0, -0.1);
  tail.lineTo(0.025, -0.14);
  tail.lineTo(-0.025, -0.14);
  tail.closePath();
  return new THREE.ShapeGeometry([shape, tail], 1);
}

type Kite = { x: number; y: number; z: number; drift: number; bob: number; phase: number };

/**
 * Kites for Uttarayan: they sweep across the sky behind the card during the opening, then
 * hang in the wind, bobbing and tugging at their strings.
 */
export function Kites({
  count,
  colours,
  bounds,
  clock,
}: {
  count: number;
  colours: readonly string[];
  bounds: Bounds;
  clock: MotionClock;
}) {
  const geometry = useMemo(() => kiteGeometry(), []);
  const materials = useMemo(
    () =>
      colours.map(
        (colour) =>
          new THREE.MeshStandardMaterial({
            color: colour,
            side: THREE.DoubleSide,
            roughness: 0.7,
            metalness: 0,
            transparent: true,
            opacity: 0.95,
          }),
      ),
    [colours],
  );
  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => materials.forEach((m) => m.dispose()), [materials]);

  const kites = useMemo<Kite[]>(() => {
    const random = seededRandom(31);
    return Array.from({ length: count }, (_, i) => ({
      // Spread over the upper sky, behind the card
      x: ((i + 0.5) / count - 0.5) * bounds.x * 2.6,
      // Above the open card, in the strip of sky it leaves
      y: 0.82 + random() * Math.max(0.15, bounds.top - 1.05),
      z: -0.45 - random() * 0.8,
      drift: 0.03 + random() * 0.04,
      bob: 0.03 + random() * 0.04,
      phase: random() * Math.PI * 2,
    }));
  }, [count, bounds.x, bounds.top]);

  const root = useRef<THREE.Group>(null);
  const meshes = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(() => {
    const group = root.current;
    if (!group) return;
    const open = clock.open.current ?? 0;
    group.visible = clock.still || open > 0.15;
    if (!group.visible) return;
    const t = clock.still ? 0 : (clock.time.current ?? 0);
    const flight = clock.still ? 1 : (clock.tracks.current?.flight ?? 1);
    const width = bounds.x * 3.4;
    kites.forEach((kite, i) => {
      const mesh = meshes.current[i];
      if (!mesh) return;
      // Sweep in from the left, each a little after the one before
      const own = ease.out(Math.max(0, Math.min(1, flight * 1.4 - i * 0.06)));
      const enter = (1 - own) * -width;
      const x = kite.x + enter + Math.sin(t * kite.drift * 6 + kite.phase) * 0.25;
      const y = kite.y + Math.sin(t * 1.3 + kite.phase) * kite.bob;
      mesh.position.set(x, y, kite.z);
      mesh.rotation.set(
        0,
        Math.sin(t * 0.7 + kite.phase) * 0.35,
        0.25 * Math.sin(t * 1.1 + kite.phase),
      );
    });
  });

  return (
    <group ref={root} raycast={() => null}>
      {kites.map((_, i) => (
        <mesh
          key={i}
          ref={(mesh) => {
            meshes.current[i] = mesh;
          }}
          geometry={geometry}
          material={materials[i % materials.length]}
          scale={1.3}
          raycast={() => null}
        />
      ))}
    </group>
  );
}
