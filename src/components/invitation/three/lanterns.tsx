"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { clamp } from "@/lib/hero-motion";
import { createLanterns, lanternAt } from "@/lib/engine/particles";
import { paintGlow } from "./card-art";
import { glowBlending } from "./blending";

/** Paper glowing from the flame below: bright at the mouth, deeper toward the crown. */
function paperTexture(flame: string, paper: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 4;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createLinearGradient(0, 64, 0, 0);
  gradient.addColorStop(0, flame);
  gradient.addColorStop(0.55, paper);
  gradient.addColorStop(1, paper);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 4, 64);
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = "rgb(0 0 0)";
  ctx.fillRect(0, 0, 4, 6);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

const matrix = new THREE.Matrix4();
const place = new THREE.Vector3();
const size = new THREE.Vector3();
const facing = new THREE.Quaternion();
const tint = new THREE.Color();

/**
 * Sky lanterns rising slowly behind the card once it opens, each with a flickering halo.
 * The halos add light, so they glow softly on a light page and brightly on a dark one.
 */
export function Lanterns({
  count,
  flame,
  paper,
  dark,
  openRef,
  still,
}: {
  count: number;
  flame: string;
  paper: string;
  dark: boolean;
  openRef: RefObject<number>;
  still: boolean;
}) {
  const lanterns = useMemo(() => createLanterns(count), [count]);
  const bodies = useRef<THREE.InstancedMesh>(null);
  const halos = useRef<THREE.InstancedMesh>(null);

  const bodyGeometry = useMemo(
    () => new THREE.CylinderGeometry(0.062, 0.046, 0.14, 12, 1, true),
    [],
  );
  const haloGeometry = useMemo(() => new THREE.PlaneGeometry(0.7, 0.7), []);
  const bodyMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: paperTexture(flame, paper),
        side: THREE.DoubleSide,
        toneMapped: false,
      }),
    [flame, paper],
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
      bodyGeometry.dispose();
      haloGeometry.dispose();
    },
    [bodyGeometry, haloGeometry],
  );
  useEffect(
    () => () => {
      bodyMaterial.map?.dispose();
      bodyMaterial.dispose();
    },
    [bodyMaterial],
  );
  useEffect(
    () => () => {
      haloMaterial.map?.dispose();
      haloMaterial.dispose();
    },
    [haloMaterial],
  );

  useFrame((state) => {
    const b = bodies.current;
    const h = halos.current;
    if (!b || !h) return;
    const open = openRef.current ?? 0;
    // They appear only once the doors are well open, and drift in rather than pop
    const shown = clamp((open - 0.45) / 0.4);
    const t = still ? 24 : state.clock.elapsedTime;
    const haloStrength = dark ? 0.85 : 0.4;

    lanterns.forEach((lantern, i) => {
      const at = lanternAt(lantern, t, -2.4, 2.8);
      const flicker = still ? 0.9 : at.flicker;
      const s = lantern.size * shown;
      place.set(at.x, at.y, at.z);
      size.set(s, s, s);
      matrix.compose(place, facing, size);
      b.setMatrixAt(i, matrix);
      h.setMatrixAt(i, matrix);
      h.setColorAt(i, tint.setScalar(flicker * haloStrength));
    });
    b.instanceMatrix.needsUpdate = true;
    h.instanceMatrix.needsUpdate = true;
    if (h.instanceColor) h.instanceColor.needsUpdate = true;
  });

  return (
    <group raycast={() => null}>
      <instancedMesh
        ref={bodies}
        args={[bodyGeometry, bodyMaterial, count]}
        frustumCulled={false}
        raycast={() => null}
      />
      <instancedMesh
        ref={halos}
        args={[haloGeometry, haloMaterial, count]}
        frustumCulled={false}
        raycast={() => null}
      />
    </group>
  );
}
