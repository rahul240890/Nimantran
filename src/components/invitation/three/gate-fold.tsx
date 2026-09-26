"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { CARD, doorAngles, seamGlow } from "@/lib/engine/scene-math";
import {
  paintCardBack,
  paintDoorBack,
  paintDoorFront,
  paintGlow,
  paintInside,
  type Face,
} from "./card-art";
import { glowBlending } from "./blending";
import type { FormatSceneProps } from "./types";

const { width: W, height: H, thickness: T } = CARD;
const DEG = Math.PI / 180;

function useFaceMaterial(face: Face, anisotropy: number) {
  const material = useMemo(() => {
    const map = new THREE.CanvasTexture(face.colour);
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = anisotropy;
    if (!face.finish) {
      return new THREE.MeshStandardMaterial({ map, roughness: 0.82, metalness: 0 });
    }
    const finish = new THREE.CanvasTexture(face.finish);
    finish.colorSpace = THREE.NoColorSpace;
    finish.anisotropy = anisotropy;
    return new THREE.MeshStandardMaterial({
      map,
      roughness: 1,
      metalness: 1,
      roughnessMap: finish,
      metalnessMap: finish,
      bumpMap: finish,
      bumpScale: 1.6,
    });
  }, [face, anisotropy]);
  useEffect(
    () => () => {
      material.map?.dispose();
      material.roughnessMap?.dispose();
      material.dispose();
    },
    [material],
  );
  return material;
}

/**
 * The gate-fold card: an inside panel and two doors hinged at its outer edges that swing
 * toward the guest. Warm light spills from the seam as they part. The stage owns the
 * open amount and the card's tilt; this component owns the card itself.
 */
export function GateFoldScene({
  copy,
  stock,
  settings,
  openRef,
  maxAngleRef,
  onToggle,
  onBuilt,
}: FormatSceneProps) {
  const gl = useThree((state) => state.gl);
  const anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
  const { textureWidth: width, foil, shadows } = settings;

  const faces = useMemo(
    () => ({
      inside: paintInside(copy, stock, width, foil),
      leftFront: paintDoorFront("left", copy.doors[0], copy.first.charAt(0), stock, width, foil),
      rightFront: paintDoorFront("right", copy.doors[1], copy.second.charAt(0), stock, width, foil),
      doorBack: paintDoorBack(stock, width, foil),
      cardBack: paintCardBack(stock, width, foil),
    }),
    [copy, stock, width, foil],
  );

  const inside = useFaceMaterial(faces.inside, anisotropy);
  const leftFront = useFaceMaterial(faces.leftFront, anisotropy);
  const rightFront = useFaceMaterial(faces.rightFront, anisotropy);
  const doorBack = useFaceMaterial(faces.doorBack, anisotropy);
  const cardBack = useFaceMaterial(faces.cardBack, anisotropy);

  // Gilded edges all round, like a good wedding card
  const edge = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(stock.gold),
        metalness: foil ? 0.85 : 0.2,
        roughness: foil ? 0.32 : 0.6,
      }),
    [stock.gold, foil],
  );

  const glow = useMemo(() => {
    const texture = new THREE.CanvasTexture(paintGlow(stock.accent));
    texture.colorSpace = THREE.SRGBColorSpace;
    return glowBlending(
      new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        toneMapped: false,
      }),
    ) as THREE.MeshBasicMaterial;
  }, [stock.accent]);

  useEffect(() => () => edge.dispose(), [edge]);
  useEffect(
    () => () => {
      glow.map?.dispose();
      glow.dispose();
    },
    [glow],
  );

  // BoxGeometry faces: +x, -x, +y, -y, front (+z), back (-z)
  const panelMaterials = useMemo(
    () => [edge, edge, edge, edge, inside, cardBack],
    [edge, inside, cardBack],
  );
  const leftMaterials = useMemo(
    () => [edge, edge, edge, edge, leftFront, doorBack],
    [edge, leftFront, doorBack],
  );
  const rightMaterials = useMemo(
    () => [edge, edge, edge, edge, rightFront, doorBack],
    [edge, rightFront, doorBack],
  );

  const panelGeometry = useMemo(() => new THREE.BoxGeometry(W, H, T), []);
  const doorGeometry = useMemo(() => new THREE.BoxGeometry(W / 2, H, T), []);
  useEffect(
    () => () => {
      panelGeometry.dispose();
      doorGeometry.dispose();
    },
    [panelGeometry, doorGeometry],
  );

  const left = useRef<THREE.Group>(null);
  const right = useRef<THREE.Group>(null);
  const seam = useRef<THREE.PointLight>(null);
  const glowPlane = useRef<THREE.Mesh>(null);

  useEffect(() => {
    onBuilt();
  }, [faces, onBuilt]);

  useFrame(() => {
    const open = openRef.current;
    const angles = doorAngles(open, maxAngleRef.current);
    if (left.current) left.current.rotation.y = -angles.left * DEG;
    if (right.current) right.current.rotation.y = angles.right * DEG;
    const light = seamGlow(open);
    if (glowPlane.current)
      (glowPlane.current.material as THREE.MeshBasicMaterial).opacity = light * 0.9;
    if (seam.current) seam.current.intensity = light * 2.4;
  });

  return (
    <group
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
      onPointerOver={(event) => {
        (event.nativeEvent.target as HTMLElement).style.cursor = "pointer";
      }}
      onPointerOut={(event) => {
        (event.nativeEvent.target as HTMLElement).style.cursor = "";
      }}
    >
      <mesh geometry={panelGeometry} material={panelMaterials} receiveShadow={shadows} />
      {/* Light that spills from the seam as the doors crack open */}
      <mesh ref={glowPlane} position={[0, 0, T / 2 + 0.004]} material={glow}>
        <planeGeometry args={[W * 0.95, H * 1.1]} />
      </mesh>
      <pointLight
        ref={seam}
        position={[0, 0, 0.3]}
        color={stock.accent}
        intensity={0}
        distance={2.2}
        decay={2}
      />
      <group ref={left} position={[-W / 2, 0, T + 0.002]}>
        <mesh
          geometry={doorGeometry}
          material={leftMaterials}
          position={[W / 4, 0, 0]}
          castShadow={shadows}
          receiveShadow={shadows}
        />
      </group>
      <group ref={right} position={[W / 2, 0, T + 0.002]}>
        <mesh
          geometry={doorGeometry}
          material={rightMaterials}
          position={[-W / 4, 0, 0]}
          castShadow={shadows}
          receiveShadow={shadows}
        />
      </group>
    </group>
  );
}
