"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { seededRandom, type Bounds } from "@/lib/engine/particles";
import { clamp } from "@/lib/hero-motion";
import { ease, type MotionClock } from "./shared";

/** One wing, hinged on the body along the y axis: a rounded forewing and a smaller hindwing. */
function wingGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.004);
  shape.bezierCurveTo(0.03, 0.05, 0.075, 0.052, 0.07, 0.018);
  shape.bezierCurveTo(0.066, 0.002, 0.05, -0.004, 0.045, -0.008);
  shape.bezierCurveTo(0.06, -0.03, 0.04, -0.05, 0.02, -0.04);
  shape.bezierCurveTo(0.008, -0.034, 0.002, -0.02, 0, -0.008);
  return new THREE.ShapeGeometry(shape, 8);
}

type Flier = {
  group: THREE.Group;
  left: THREE.Mesh;
  right: THREE.Mesh;
};

type Path = {
  cx: number;
  cy: number;
  cz: number;
  ax: number;
  ay: number;
  az: number;
  speed: number;
  phase: number;
};

/** Where the Prajapati settles: by the names, clear of the words. */
const LANDING = new THREE.Vector3(0.5, 0.24, 0.07);
const START = new THREE.Vector3(1.9, 1.1, 1.2);

/**
 * Butterflies drifting round the card. With `prajapati`, the first one flies in during the
 * opening and settles by the couple's names, slowly opening and closing its wings, as the
 * Prajapati butterfly blesses a Bengali wedding.
 */
export function Butterflies({
  count,
  colours,
  bounds,
  prajapati,
  clock,
}: {
  count: number;
  colours: readonly string[];
  bounds: Bounds;
  prajapati: boolean;
  clock: MotionClock;
}) {
  const wing = useMemo(() => wingGeometry(), []);
  const materials = useMemo(
    () =>
      colours.map(
        (colour) =>
          new THREE.MeshStandardMaterial({
            color: colour,
            side: THREE.DoubleSide,
            roughness: 0.5,
            metalness: 0.1,
          }),
      ),
    [colours],
  );
  useEffect(() => () => wing.dispose(), [wing]);
  useEffect(() => () => materials.forEach((m) => m.dispose()), [materials]);

  const total = count + (prajapati ? 1 : 0);
  const paths = useMemo<Path[]>(() => {
    const random = seededRandom(23);
    return Array.from({ length: total }, () => ({
      cx: (random() * 2 - 1) * bounds.x * 0.6,
      cy: (random() * 2 - 1) * 0.5,
      cz: 0.3 + random() * 0.5,
      ax: 0.3 + random() * bounds.x * 0.35,
      ay: 0.2 + random() * 0.3,
      az: 0.1 + random() * 0.2,
      speed: 0.25 + random() * 0.2,
      phase: random() * Math.PI * 2,
    }));
  }, [total, bounds.x]);

  const root = useRef<THREE.Group>(null);
  const fliers = useRef<Flier[]>([]);
  const target = useMemo(() => new THREE.Vector3(), []);
  const ahead = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const group = root.current;
    if (!group) return;
    const t = clock.still ? 0 : (clock.time.current ?? 0);
    const open = clock.open.current ?? 0;
    const shown = clock.still || open > 0.2;
    group.visible = shown;
    if (!shown) return;
    const ambient = clock.still ? 1 : (clock.tracks.current?.ambient ?? 1);
    const flight = clock.still ? 1 : (clock.tracks.current?.flight ?? 1);

    // Fewer fly after a step down; the ref array keeps its old length
    fliers.current.length = total;
    fliers.current.forEach((flier, i) => {
      if (!flier) return;
      const special = prajapati && i === 0;
      let flap: number;
      if (special) {
        // In along a curve, then settled with slow wingbeats
        const f = ease.out(flight);
        target.lerpVectors(START, LANDING, f);
        target.y += Math.sin(f * Math.PI) * 0.35;
        target.x += Math.sin(f * Math.PI * 2) * 0.12 * (1 - f);
        flier.group.position.copy(target);
        flier.group.rotation.set(-0.3 * (1 - f), -0.5, 0.25 * (1 - f));
        const settled = flight >= 1;
        if (clock.still) flap = 0.4;
        else if (settled) flap = 0.35 + 0.3 * Math.sin(t * 1.6);
        else flap = 1.1 * Math.abs(Math.sin(t * 16));
      } else {
        const path = paths[i]!;
        const u = t * path.speed + path.phase;
        const at = (w: number) =>
          ahead.set(
            path.cx + Math.sin(w) * path.ax,
            path.cy + Math.sin(w * 1.7) * path.ay,
            path.cz + Math.cos(w * 0.9) * path.az,
          );
        target.copy(at(u));
        flier.group.position.copy(target);
        // Seen from above like the Prajapati drawn on a card, leaning into its turns
        at(u + 0.05);
        flier.group.rotation.set(-0.5, 0, clamp((target.x - ahead.x) * 12, -0.6, 0.6));
        flier.group.scale.setScalar(clamp(ambient * 1.2));
        flap = clock.still ? 0.5 : 0.25 + 1.05 * Math.abs(Math.sin(t * 13 + path.phase));
      }
      flier.left.rotation.y = flap;
      flier.right.rotation.y = -flap;
    });
  });

  return (
    <group ref={root} raycast={() => null}>
      {Array.from({ length: total }, (_, i) => {
        const material = materials[i % materials.length]!;
        const edge = materials[(i + 1) % materials.length]!;
        return (
          <group
            key={i}
            ref={(group) => {
              if (!group) return;
              fliers.current[i] = {
                group,
                left: group.children[0] as THREE.Mesh,
                right: group.children[1] as THREE.Mesh,
              };
            }}
            scale={i === 0 && prajapati ? 1.5 : 1}
          >
            <mesh geometry={wing} material={material} raycast={() => null} />
            <mesh geometry={wing} material={material} scale={[-1, 1, 1]} raycast={() => null} />
            <mesh raycast={() => null} material={edge}>
              <capsuleGeometry args={[0.004, 0.05, 2, 6]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
