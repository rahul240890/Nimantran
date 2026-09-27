"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { seededRandom, type Bounds } from "@/lib/engine/particles";
import type { MotionClock } from "./shared";

/** A soft round dot, so points read as powder rather than squares. */
function dotTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 32;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, "rgb(255 255 255 / 1)");
  gradient.addColorStop(0.55, "rgb(255 255 255 / 0.9)");
  gradient.addColorStop(1, "rgb(255 255 255 / 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 32, 32);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Powder in the air. As a burst, haldi and kumkum (or bandhani dots of colour) fly out
 * of the seam as the doors part and drift down; as ambient, motes float slowly upward
 * through the light, like turmeric dust in a sunbeam.
 */
export function Motes({
  count,
  colours,
  bounds,
  mode,
  size = 1,
  clock,
}: {
  count: number;
  colours: readonly string[];
  bounds: Bounds;
  mode: "burst" | "ambient";
  size?: number;
  clock: MotionClock;
}) {
  const geometry = useMemo(() => {
    const random = seededRandom(mode === "burst" ? 41 : 43);
    const position = new Float32Array(count * 3);
    const velocity = new Float32Array(count * 3);
    const colour = new Float32Array(count * 3);
    const tint = new THREE.Color();
    for (let i = 0; i < count; i++) {
      tint.set(colours[i % colours.length]!);
      colour.set([tint.r, tint.g, tint.b], i * 3);
      if (mode === "ambient") {
        position.set(
          [
            (random() * 2 - 1) * bounds.x,
            bounds.bottom + random() * (bounds.top - bounds.bottom),
            -0.3 + random() * 1.1,
          ],
          i * 3,
        );
        velocity.set([(random() - 0.5) * 0.05, 0.04 + random() * 0.08, 0], i * 3);
      } else {
        // Hidden until the burst; each flies out from the seam in its own direction
        position.set([0, -100, 0], i * 3);
        const angle = random() * Math.PI * 2;
        const speed = 0.8 + random() * 1.6;
        velocity.set(
          [Math.cos(angle) * speed, Math.sin(angle) * speed * 0.8 + 0.6, 0.4 + random() * 0.9],
          i * 3,
        );
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(position, 3));
    g.setAttribute("velocity", new THREE.BufferAttribute(velocity, 3));
    // The burst's starting velocities, so it can fire again when the card is reopened
    g.setAttribute("launch", new THREE.BufferAttribute(velocity.slice(), 3));
    g.setAttribute("color", new THREE.BufferAttribute(colour, 3));
    return g;
  }, [count, colours, bounds, mode]);
  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.03 * size,
        map: dotTexture(),
        vertexColors: true,
        transparent: true,
        depthWrite: false,
        sizeAttenuation: true,
        toneMapped: false,
      }),
    [size],
  );
  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(
    () => () => {
      material.map?.dispose();
      material.dispose();
    },
    [material],
  );

  const points = useRef<THREE.Points>(null);
  const fired = useRef(false);
  // A step down brings fresh particles, which may still need to burst
  useEffect(() => {
    fired.current = false;
  }, [geometry]);

  useFrame((_, delta) => {
    const p = points.current;
    if (!p) return;
    const open = clock.open.current ?? 0;
    p.visible = clock.still ? mode === "ambient" : open > 0.1;
    if (!p.visible) return;
    const h = Math.min(delta, 1 / 20);
    const attributes = p.geometry.attributes;
    const position = attributes.position!.array as Float32Array;
    const velocity = attributes.velocity!.array as Float32Array;
    const launch = attributes.launch!.array as Float32Array;
    const material = p.material as THREE.PointsMaterial;

    if (mode === "burst") {
      const burst = clock.tracks.current?.burst ?? 1;
      if (!fired.current && burst > 0 && burst < 1 && !clock.still) {
        fired.current = true;
        velocity.set(launch);
        // Out of the seam, spread along its height
        for (let i = 0; i < count; i++) {
          const along = ((i * 0.618) % 1) - 0.5;
          position.set([along * 0.1, along * 0.8, 0.1], i * 3);
        }
      }
      if (open < 0.05) fired.current = false;
      for (let i = 0; i < count; i++) {
        const k = i * 3;
        if (position[k + 1]! < -50) continue;
        velocity[k + 1] = velocity[k + 1]! - 1.4 * h;
        for (let a = 0; a < 3; a++) {
          velocity[k + a] = velocity[k + a]! * (1 - 1.8 * h);
          position[k + a] = position[k + a]! + velocity[k + a]! * h;
        }
      }
      material.opacity = Math.min(1, 1.6 - (clock.time.current ?? 0) * 0.18);
    } else if (!clock.still) {
      const t = clock.time.current ?? 0;
      for (let i = 0; i < count; i++) {
        const k = i * 3;
        position[k] = position[k]! + (velocity[k]! + Math.sin(t * 0.8 + i) * 0.02) * h;
        position[k + 1] = position[k + 1]! + velocity[k + 1]! * h;
        if (position[k + 1]! > bounds.top) position[k + 1] = bounds.bottom;
      }
      material.opacity = Math.min(1, clock.tracks.current?.ambient ?? 1) * 0.85;
    } else {
      material.opacity = 0.7;
    }
    attributes.position!.needsUpdate = true;
  });

  return (
    <points
      ref={points}
      geometry={geometry}
      material={material}
      frustumCulled={false}
      raycast={() => null}
    />
  );
}
