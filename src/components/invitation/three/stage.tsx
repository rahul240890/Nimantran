"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import type { GateCardCopy } from "@/components/brand/gate-card";
import { approach, clamp } from "@/lib/hero-motion";
import type { Bounds } from "@/lib/engine/particles";
import {
  createQualityGovernor,
  QUALITY,
  type QualityLevel,
  type RenderLevel,
} from "@/lib/engine/quality";
import { cameraDistance, CARD, FOV, maxDoorAngle } from "@/lib/engine/scene-math";
import { readToken, resolveStock, type EngineTheme, type ResolvedStock } from "@/lib/engine/themes";
import { loadCardFonts } from "./card-art";
import { GateFoldScene } from "./gate-fold";
import { Lanterns } from "./lanterns";
import { Petals } from "./petals";
import type { FormatSceneProps } from "./types";
import type { CardFormatId } from "../formats";

const MAX_TILT = 0.14;
const GROUND_Y = -CARD.height / 2 - 0.2;

/** The 3D scene for each card format. New formats register here. */
const FORMAT_SCENES: Record<CardFormatId, (props: FormatSceneProps) => ReactNode> = {
  "gate-fold": GateFoldScene,
};

export type StageProps = {
  copy: GateCardCopy;
  theme: EngineTheme;
  format: CardFormatId;
  /** The level to draw at; the stage asks to step down when frames run slow. */
  level: RenderLevel;
  open: boolean;
  still: boolean;
  /** Stop drawing (off screen or in a background tab). */
  paused: boolean;
  dark: boolean;
  onToggle: () => void;
  onReady: () => void;
  onStepDown: (level: QualityLevel) => void;
  onFail: (reason: "graphics-lost") => void;
  onFps?: (fps: number) => void;
};

type Resolved = { stock: ResolvedStock; petals: string[]; flame: string; glint: string };

/** Everything inside the canvas. */
function Scene({
  copy,
  theme,
  format,
  level,
  open,
  still,
  paused,
  dark,
  onToggle,
  onReady,
  onStepDown,
  onFps,
  resolved,
}: StageProps & { resolved: Resolved }) {
  const settings = QUALITY[level];
  const { gl, size, invalidate, get } = useThree();
  const card = useRef<THREE.Group>(null);
  const key = useRef<THREE.DirectionalLight>(null);
  const openRef = useRef(open ? 1 : 0);
  const aspect = size.width / Math.max(size.height, 1);
  const maxAngleRef = useRef(maxDoorAngle(aspect));
  const tilt = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Soft studio reflections for the foil, generated on the GPU (nothing to download)
  useEffect(() => {
    // The scene is read through get(): three.js objects are mutated outside React by design
    const { scene } = get();
    if (!settings.environment) {
      scene.environment = null;
      return;
    }
    const pmrem = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const texture = pmrem.fromScene(room, 0.04).texture;
    scene.environment = texture;
    scene.environmentIntensity = 0.4;
    return () => {
      scene.environment = null;
      texture.dispose();
      room.dispose();
      pmrem.dispose();
    };
  }, [gl, get, settings.environment]);

  // Still mode draws on demand: jump to the new state and draw one frame
  useEffect(() => {
    if (still) {
      openRef.current = open ? 1 : 0;
      invalidate();
    }
  }, [still, open, invalidate]);

  // Pointer: a mouse tilts the card toward itself; a sideways finger drag turns it
  useEffect(() => {
    const element = gl.domElement;
    let dragStartX: number | null = null;
    const t = tilt.current;
    const move = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      if (event.pointerType === "touch") {
        if (dragStartX === null) return;
        t.targetY = clamp(((event.clientX - dragStartX) / rect.width) * 1.2, -0.45, 0.45);
      } else {
        t.targetY = ((event.clientX - rect.left) / rect.width - 0.5) * 2 * MAX_TILT;
        t.targetX = ((event.clientY - rect.top) / rect.height - 0.5) * 2 * MAX_TILT;
      }
    };
    const down = (event: PointerEvent) => {
      if (event.pointerType === "touch") dragStartX = event.clientX;
    };
    const release = () => {
      dragStartX = null;
      t.targetX = t.targetY = 0;
    };
    const end = (event: PointerEvent) => {
      if (event.pointerType === "touch") release();
    };
    element.addEventListener("pointermove", move, { passive: true });
    element.addEventListener("pointerdown", down, { passive: true });
    element.addEventListener("pointerup", end);
    element.addEventListener("pointercancel", end);
    element.addEventListener("pointerleave", release);
    return () => {
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerdown", down);
      element.removeEventListener("pointerup", end);
      element.removeEventListener("pointercancel", end);
      element.removeEventListener("pointerleave", release);
    };
  }, [gl]);

  // Steps down when frames run slow; measured only while drawing continuously
  const governor = useMemo(() => createQualityGovernor(level, onStepDown), [level, onStepDown]);
  const fps = useRef({ frames: 0, elapsed: 0 });

  useFrame((state, delta) => {
    const ms = delta * 1000;
    maxAngleRef.current = maxDoorAngle(aspect);
    if (!still) {
      // A tap swings the doors at a stately pace
      openRef.current = approach(openRef.current, open ? 1 : 0, 2.4, ms);
      if (!paused) governor.sample(ms);
      if (onFps) {
        const f = fps.current;
        f.frames += 1;
        f.elapsed += delta;
        if (f.elapsed >= 1) {
          onFps(Math.round(f.frames / f.elapsed));
          f.frames = f.elapsed = 0;
        }
      }
    }

    const t = tilt.current;
    t.x = still ? 0 : approach(t.x, t.targetX, 6, ms);
    t.y = still ? 0 : approach(t.y, t.targetY, 6, ms);
    const o = openRef.current;

    if (card.current) {
      // Leans back a little while shut, faces the guest once open
      card.current.rotation.x = -(1 - o) * 0.2 + t.x;
      card.current.rotation.y = t.y;
      card.current.position.y = still ? 0 : Math.sin(state.clock.elapsedTime * 0.9) * 0.025;
    }

    // The camera pulls back as the doors open so the card always fits
    const distance = cameraDistance(o, aspect);
    state.camera.position.set(0, 0.08, distance);
    state.camera.lookAt(0, 0, 0);
  }, -1);

  // Ready once the card is painted and has been drawn once
  const [built, setBuilt] = useState(false);
  const onBuilt = useCallback(() => setBuilt(true), []);
  const readySent = useRef(false);
  useFrame(() => {
    if (built && !readySent.current) {
      readySent.current = true;
      requestAnimationFrame(() => onReady());
    }
  });

  // Where petals fall: the visible area around the card when it's open
  const bounds = useMemo<Bounds>(() => {
    const distance = cameraDistance(1, aspect);
    const halfHeight = Math.tan(((FOV / 2) * Math.PI) / 180) * distance;
    return {
      x: halfHeight * aspect * 0.95,
      top: halfHeight + 0.2,
      bottom: -halfHeight - 0.2,
      zNear: 0.9,
      zFar: -0.5,
    };
  }, [aspect]);

  const Format = FORMAT_SCENES[format];

  return (
    <>
      {/* Card stock looks the same on a light or dark page, like real paper; only the
          ambience changes. Without reflections (low level) more fill light makes up for them. */}
      <hemisphereLight
        args={[resolved.glint, resolved.stock.paper, settings.environment ? 0.7 : 1.3]}
      />
      <directionalLight
        ref={key}
        position={[-2.2, 3, 4.5]}
        intensity={1.6}
        color={resolved.glint}
        castShadow={settings.shadows}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-radius={4}
        shadow-camera-left={-2}
        shadow-camera-right={2}
        shadow-camera-top={2}
        shadow-camera-bottom={-2}
      />
      {/* A warm rim from behind so the gilded edges catch light */}
      <directionalLight
        position={[3, 1.5, -3]}
        intensity={dark ? 1.2 : 0.9}
        color={resolved.flame}
      />

      <group ref={card}>
        <Format
          copy={copy}
          stock={resolved.stock}
          settings={settings}
          openRef={openRef}
          maxAngleRef={maxAngleRef}
          onToggle={onToggle}
          onBuilt={onBuilt}
        />
      </group>

      <ContactShadow openRef={openRef} dark={dark} />

      {theme.petals.length > 0 && (
        <Petals
          count={settings.petals}
          colours={resolved.petals}
          size={theme.petalSize}
          bounds={bounds}
          groundY={GROUND_Y}
          openRef={openRef}
          still={still}
        />
      )}
      {theme.lanterns && (
        <Lanterns
          count={settings.lanterns}
          flame={resolved.flame}
          paper={resolved.stock.accent}
          dark={dark}
          openRef={openRef}
          still={still}
        />
      )}
    </>
  );
}

/** A soft pool of shadow under the card that spreads as the doors open. */
function ContactShadow({ openRef, dark }: { openRef: RefObject<number>; dark: boolean }) {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 128;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, "rgb(20 8 12 / 0.6)");
    gradient.addColorStop(0.55, "rgb(20 8 12 / 0.2)");
    gradient.addColorStop(1, "rgb(20 8 12 / 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    const map = new THREE.CanvasTexture(canvas);
    return new THREE.MeshBasicMaterial({ map, transparent: true, depthWrite: false });
  }, []);
  useEffect(
    () => () => {
      material.map?.dispose();
      material.dispose();
    },
    [material],
  );
  useFrame(() => {
    const o = openRef.current ?? 0;
    if (mesh.current) mesh.current.scale.set(CARD.width * (1.3 + o * 0.7), 1.1, 1);
  });
  return (
    <mesh
      ref={mesh}
      position={[0, GROUND_Y, 0.1]}
      rotation={[-Math.PI / 2, 0, 0]}
      material={material}
      material-opacity={dark ? 0.9 : 0.55}
      raycast={() => null}
    >
      <planeGeometry args={[1, 1]} />
    </mesh>
  );
}

/**
 * The WebGL invitation. Loaded on demand, so pages pay for three.js only when a device
 * can draw it; until then (and on weaker devices) the 2D card shows instead.
 */
export default function InvitationStage(props: StageProps) {
  const { copy, theme, level, still, paused, dark, onFail } = props;
  const settings = QUALITY[level];
  // Antialiasing and the shadow map are fixed when the canvas is made; later steps down
  // lower everything else without tearing the canvas down
  const [initial] = useState(settings);
  const [resolved, setResolved] = useState<Resolved | null>(null);

  useEffect(() => {
    let cancelled = false;
    void loadCardFonts(copy).then(() => {
      if (cancelled) return;
      const { stock, petals } = resolveStock(theme, readToken);
      setResolved({ stock, petals, flame: readToken("marigold"), glint: readToken("gold-glint") });
    });
    return () => {
      cancelled = true;
    };
    // The colour scheme changes some petal colours (rose), so re-read on a theme switch
  }, [copy, theme, dark]);

  return (
    <Canvas
      aria-hidden
      dpr={settings.dpr}
      shadows={initial.shadows ? "percentage" : false}
      frameloop={still ? "demand" : paused ? "never" : "always"}
      gl={{ antialias: initial.antialias, alpha: true, powerPreference: "default" }}
      camera={{ fov: FOV, near: 0.1, far: 40, position: [0, 0, 6] }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.NeutralToneMapping;
        gl.toneMappingExposure = 1;
        gl.domElement.addEventListener("webglcontextlost", (event) => {
          event.preventDefault();
          onFail("graphics-lost");
        });
      }}
      style={{ touchAction: "pan-y" }}
    >
      {resolved && <Scene {...props} resolved={resolved} />}
    </Canvas>
  );
}
