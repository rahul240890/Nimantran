"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { createPetalField, type Bounds, type PetalField } from "@/lib/engine/particles";

/**
 * One petal: a teardrop lying flat, cupped a little so it catches light as it turns.
 * Built in the XZ plane so "resting" is simply a turn about the vertical axis.
 */
function petalGeometry(size: number) {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.5);
  shape.bezierCurveTo(0.3, 0.28, 0.42, -0.08, 0, -0.5);
  shape.bezierCurveTo(-0.42, -0.08, -0.3, 0.28, 0, 0.5);
  const geometry = new THREE.ShapeGeometry(shape, 6);
  const position = geometry.attributes.position!;
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i);
    const y = position.getY(i);
    // Lay it flat (y becomes depth) and lift the sides into a shallow cup
    position.setXYZ(i, x * size, x * x * size * 0.9, -y * size);
  }
  geometry.computeVertexNormals();
  return geometry;
}

const matrix = new THREE.Matrix4();
const quaternion = new THREE.Quaternion();
const axis = new THREE.Vector3();
const place = new THREE.Vector3();
const scale = new THREE.Vector3();

/** Copies the simulation into the instanced mesh's matrices. */
function writeMatrices(instanced: THREE.InstancedMesh, field: PetalField) {
  const { count, position, rotation, scale: sizes } = field;
  for (let i = 0; i < count; i++) {
    axis.set(rotation[i * 4]!, rotation[i * 4 + 1]!, rotation[i * 4 + 2]!);
    quaternion.setFromAxisAngle(axis, rotation[i * 4 + 3]!);
    place.set(position[i * 3]!, position[i * 3 + 1]!, position[i * 3 + 2]!);
    const s = sizes[i]!;
    scale.set(s, s, s);
    matrix.compose(place, quaternion, scale);
    instanced.setMatrixAt(i, matrix);
  }
  instanced.instanceMatrix.needsUpdate = true;
}

export function Petals({
  count,
  colours,
  size,
  bounds,
  groundY,
  openRef,
  still,
}: {
  count: number;
  colours: string[];
  size: number;
  bounds: Bounds;
  groundY: number;
  openRef: RefObject<number>;
  still: boolean;
}) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const field = useMemo(
    () => createPetalField(count, bounds, colours.length),
    // A new field only when the petal count or view changes, not on every render
    [count, bounds, colours.length],
  );
  const geometry = useMemo(() => petalGeometry(0.075 * size), [size]);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        side: THREE.DoubleSide,
        roughness: 0.55,
        metalness: 0,
      }),
    [],
  );
  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);

  useLayoutEffect(() => {
    const instanced = mesh.current;
    if (!instanced) return;
    const colour = new THREE.Color();
    for (let i = 0; i < count; i++) {
      colour.set(colours[field.colour[i]!] ?? colours[0]!);
      instanced.setColorAt(i, colour);
    }
    if (instanced.instanceColor) instanced.instanceColor.needsUpdate = true;
    // Every petal starts hidden (scale 0) until the doors open
    writeMatrices(instanced, field);
  }, [colours, count, field]);

  // Still mode: petals rest on the ground once the card is open, and never move
  const restingOpen = useRef<boolean | null>(null);
  useFrame((_, delta) => {
    if (still) {
      const isOpen = (openRef.current ?? 0) > 0.5;
      if (restingOpen.current !== isOpen) {
        restingOpen.current = isOpen;
        field.rest(isOpen ? 1 : 0, groundY);
        if (mesh.current) writeMatrices(mesh.current, field);
      }
      return;
    }
    restingOpen.current = null;
    field.step(delta, openRef.current ?? 0);
    if (mesh.current) writeMatrices(mesh.current, field);
  });

  return (
    <instancedMesh
      ref={mesh}
      args={[geometry, material, count]}
      frustumCulled={false}
      // Petals never block a tap on the card behind them
      raycast={() => null}
    />
  );
}
