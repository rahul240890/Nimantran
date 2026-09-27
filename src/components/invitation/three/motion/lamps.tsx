"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { clamp } from "@/lib/hero-motion";
import { paintGlow } from "../card-art";
import { glowBlending } from "../blending";
import type { MotionClock } from "./shared";

/** A clay diya: a shallow bowl pinched to a spout, turned on a lathe. */
function bowlGeometry() {
  const profile = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(0.05, 0.002),
    new THREE.Vector2(0.085, 0.022),
    new THREE.Vector2(0.095, 0.04),
    new THREE.Vector2(0.088, 0.044),
    new THREE.Vector2(0.07, 0.03),
    new THREE.Vector2(0, 0.026),
  ];
  const geometry = new THREE.LatheGeometry(profile, 28);
  // Stretch one side into the spout that holds the wick
  const position = geometry.attributes.position!;
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i);
    if (x > 0) position.setX(i, x * (1 + 0.45 * (x / 0.095) ** 2));
  }
  geometry.computeVertexNormals();
  return geometry;
}

/** The flame: a small teardrop standing on the wick. */
function flameGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.07);
  shape.bezierCurveTo(0.012, 0.04, 0.02, 0.012, 0, 0);
  shape.bezierCurveTo(-0.02, 0.012, -0.012, 0.04, 0, 0.07);
  return new THREE.ShapeGeometry(shape, 6);
}

/**
 * Two clay lamps on the floor either side of the card. Their flames light one after the
 * other during the opening and then flicker, each with a soft pool of light.
 */
export function Lamps({
  x,
  y,
  clay,
  flame,
  dark,
  clock,
}: {
  /** Distance of each lamp from the centre. */
  x: number;
  y: number;
  clay: string;
  flame: string;
  dark: boolean;
  clock: MotionClock;
}) {
  const bowl = useMemo(() => bowlGeometry(), []);
  const tongue = useMemo(() => flameGeometry(), []);
  const halo = useMemo(() => new THREE.PlaneGeometry(0.5, 0.5), []);
  const clayMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: clay, roughness: 0.85, metalness: 0 }),
    [clay],
  );
  const flameMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({ color: flame, toneMapped: false, transparent: true }),
    [flame],
  );
  const haloMaterial = useMemo(() => {
    const map = new THREE.CanvasTexture(paintGlow(flame, 64));
    map.colorSpace = THREE.SRGBColorSpace;
    return glowBlending(
      new THREE.MeshBasicMaterial({ map, transparent: true, depthWrite: false, toneMapped: false }),
    ) as THREE.MeshBasicMaterial;
  }, [flame]);

  useEffect(
    () => () => {
      bowl.dispose();
      tongue.dispose();
      halo.dispose();
    },
    [bowl, tongue, halo],
  );
  useEffect(() => () => clayMaterial.dispose(), [clayMaterial]);
  useEffect(() => () => flameMaterial.dispose(), [flameMaterial]);
  useEffect(
    () => () => {
      haloMaterial.map?.dispose();
      haloMaterial.dispose();
    },
    [haloMaterial],
  );

  const flames = [useRef<THREE.Group>(null), useRef<THREE.Group>(null)];
  const root = useRef<THREE.Group>(null);

  useFrame(() => {
    const lit = clock.still ? 1 : (clock.tracks.current?.lamps ?? 1);
    const t = clock.still ? 0 : (clock.time.current ?? 0);
    const open = clock.open.current ?? 0;
    if (root.current) root.current.visible = open > 0.05 || clock.still;
    flames.forEach((ref, i) => {
      const group = ref.current;
      if (!group) return;
      // The left lamp lights first, then the right
      const own = clamp(lit * 2 - i);
      const flicker = clock.still
        ? 1
        : 0.9 + 0.07 * Math.sin(t * 9.1 + i * 2) + 0.03 * Math.sin(t * 23.7 + i);
      group.scale.set(own * (0.92 + 0.08 * flicker), own * flicker, own);
      const haloMesh = group.children[1] as THREE.Mesh | undefined;
      if (haloMesh) haloMesh.scale.setScalar((dark ? 1.2 : 0.75) * flicker);
    });
  });

  return (
    <group ref={root} raycast={() => null}>
      {[-1, 1].map((side, i) => (
        <group key={side} position={[side * x, y, 0.28]} rotation={[0, side > 0 ? Math.PI : 0, 0]}>
          <mesh geometry={bowl} material={clayMaterial} raycast={() => null} />
          <group
            ref={flames[i]}
            position={[0.1, 0.036, 0]}
            rotation={[0, side > 0 ? Math.PI : 0, 0]}
          >
            <mesh geometry={tongue} material={flameMaterial} raycast={() => null} />
            <mesh
              geometry={halo}
              material={haloMaterial}
              position={[0, 0.03, 0.01]}
              raycast={() => null}
            />
          </group>
        </group>
      ))}
    </group>
  );
}
