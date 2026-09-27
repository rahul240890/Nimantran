"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { Bounds } from "@/lib/engine/particles";
import { ease, type MotionClock } from "./shared";

type Kind = "marigold" | "mango-leaf";

/** A mango leaf hanging tip down, cupped a little along its spine. */
function leafGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.028, -0.02, 0.03, -0.07, 0, -0.11);
  shape.bezierCurveTo(-0.03, -0.07, -0.028, -0.02, 0, 0);
  const geometry = new THREE.ShapeGeometry(shape, 5);
  const position = geometry.attributes.position!;
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i);
    position.setZ(i, x * x * 6);
  }
  geometry.computeVertexNormals();
  return geometry;
}

type Strand = { x: number; beads: number; phase: number };

/**
 * A swag of marigolds (or a mango-leaf thoranam) across the top of the view, with strands
 * hanging from it. They drop in during the opening, swing, settle, and then sway gently.
 */
export function Garlands({
  kind,
  colours,
  bounds,
  detail,
  clock,
}: {
  kind: Kind;
  colours: readonly string[];
  bounds: Bounds;
  /** 0 light, 1 medium, 2 full: how many strands and beads. */
  detail: 0 | 1 | 2;
  clock: MotionClock;
}) {
  const leaf = kind === "mango-leaf";
  const spacing = leaf ? 0.06 : 0.052;
  const top = bounds.top - (leaf ? 0.36 : 0.44);
  const span = bounds.x * 2;
  const swagCount = Math.max(8, Math.round(span / spacing));
  const strands = useMemo<Strand[]>(() => {
    const count = [3, 5, 7][detail]!;
    return Array.from({ length: count }, (_, i) => {
      const x = ((i + 0.5) / count - 0.5) * span * 0.92;
      const edge = Math.abs(x) / (span / 2);
      return {
        x,
        // Longer strands at the sides, where they frame the card, shorter over it
        beads: leaf ? 0 : Math.round(4 + edge * [3, 5, 7][detail]!),
        phase: i * 1.7,
      };
    });
  }, [detail, span, leaf]);
  const total = swagCount + strands.reduce((sum, s) => sum + s.beads, 0);

  const geometry = useMemo(
    () => (leaf ? leafGeometry() : new THREE.IcosahedronGeometry(0.026, 1)),
    [leaf],
  );
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        roughness: leaf ? 0.6 : 0.75,
        metalness: 0,
        side: THREE.DoubleSide,
      }),
    [leaf],
  );
  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);

  const mesh = useRef<THREE.InstancedMesh>(null);
  useEffect(() => {
    const m = mesh.current;
    if (!m) return;
    const colour = new THREE.Color();
    for (let i = 0; i < total; i++) m.setColorAt(i, colour.set(colours[i % colours.length]!));
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [colours, total]);

  const matrix = useMemo(() => new THREE.Matrix4(), []);
  const place = useMemo(() => new THREE.Vector3(), []);
  const turn = useMemo(() => new THREE.Quaternion(), []);
  const size = useMemo(() => new THREE.Vector3(1, 1, 1), []);
  const euler = useMemo(() => new THREE.Euler(), []);

  useFrame(() => {
    const m = mesh.current;
    if (!m) return;
    const progress = clock.still ? 1 : (clock.tracks.current?.garland ?? 1);
    const t = clock.still ? 0 : (clock.time.current ?? 0);
    const shown = (clock.open.current ?? 0) > 0.05 || clock.still;
    m.visible = shown && progress > 0;
    if (!m.visible) return;
    // Drops from above the view with a little overshoot
    const drop = (1 - ease.outBack(progress)) * 0.9;
    let i = 0;

    // The swag: a shallow curve from side to side
    for (let k = 0; k < swagCount; k++) {
      const u = k / (swagCount - 1);
      const x = (u - 0.5) * span;
      const sag = Math.sin(u * Math.PI) * 0.12;
      place.set(x, top - sag + drop, -0.3);
      euler.set(0, 0, leaf ? Math.sin(u * Math.PI * 2) * 0.1 : k * 1.3);
      turn.setFromEuler(euler);
      matrix.compose(place, turn, size);
      m.setMatrixAt(i++, matrix);
    }

    // Hanging strands swing like pendulums, strongly just after the drop, then gently
    for (const strand of strands) {
      const u = strand.x / span + 0.5;
      const anchorY = top - Math.sin(u * Math.PI) * 0.12 + drop;
      const settle = Math.exp(-Math.max(0, t - 2) * 0.8);
      const angle = clock.still
        ? 0
        : Math.sin(t * 2.2 + strand.phase) * (0.02 + 0.2 * settle * progress);
      for (let b = 1; b <= strand.beads; b++) {
        const r = b * 0.048;
        place.set(strand.x + Math.sin(angle) * r, anchorY - Math.cos(angle) * r, -0.3);
        euler.set(0, 0, b * 1.1);
        turn.setFromEuler(euler);
        matrix.compose(place, turn, size);
        m.setMatrixAt(i++, matrix);
      }
    }
    m.count = i;
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={mesh}
      args={[geometry, material, total]}
      frustumCulled={false}
      raycast={() => null}
    />
  );
}
