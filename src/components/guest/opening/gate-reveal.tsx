"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { OPENING_PACE } from "./opening-pace";

/*
 * What happens behind the doors once they open (owner, 2026-11-04): the place itself comes
 * alive, never words or a card (the welcome and the pages bring those).
 *
 * - evening: behind a painted gate dusk turns to night, the lamps, windows and lanterns
 *   already painted in the place glow and flicker (found by their colour, so every gate
 *   works without new pictures), and the guest walks in: the floor comes toward them while
 *   the sky barely moves, and the place shifts as they move a finger or the mouse.
 * - aarti: behind a tied gate a brass thali with a lit diya circles three times before the
 *   guest, its flame the only light on the place, for families who set a Hindu or Jain god.
 * - rose: behind a tied gate rose water is sprinkled on the guest; the drops land on the
 *   glass, each bending the place behind it like a small lens, and slowly run down.
 *
 * The painting is drawn by WebGL under the doors (or under the arch); the thali and the
 * spray are drawn in 2D over everything. Both follow the stage's data-open. Reduced motion
 * and phones without WebGL see the painting as it is.
 */

export type RevealKind = "evening" | "aarti" | "rose";

/** When the painted place takes over from the plain picture, as the doors clear. */
const EVENING_FROM_MS = 1300 * OPENING_PACE;
/** The aarti: the thali comes as the doors part, circles three times, and goes. */
const AARTI_FROM_MS = 2000;
const AARTI_MS = 4400;
/** The rose water: a spray crosses the screen, then the drops land. */
const SPRAY_FROM_MS = 2200;
const DROPS_FROM_MS = 2500;
/** After this the place keeps its last frame, to spare the phone. */
const RUN_MS = 12_000;

const DROP_COUNT = 24;

const VERT = `attribute vec2 a; varying vec2 uv;
void main() { uv = vec2(a.x * .5 + .5, .5 - a.y * .5); gl_Position = vec4(a, 0., 1.); }`;

const FRAG = `precision highp float;
varying vec2 uv;
uniform sampler2D img;
uniform vec2 res;
uniform float t, night, walk, aarti;
uniform vec2 look, flame;
uniform vec4 drops[${DROP_COUNT}];
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}
vec3 tex(vec2 p) { return texture2D(img, clamp(p, .001, .999)).rgb; }
float lampMask(vec3 c) {
  float l = dot(c, vec3(.299, .587, .114));
  return smoothstep(.6, .93, l) * clamp((c.r - c.b) * 2.2, 0., 1.);
}
void main() {
  vec2 p = uv; float aspect = res.x / res.y; float shine = 0.; float edge = 0.;
  for (int i = 0; i < ${DROP_COUNT}; i++) {
    vec4 d = drops[i];
    if (d.z > 0.) {
      vec2 q = (p - d.xy) * vec2(aspect, 1.);
      float r = length(q) / d.z;
      if (r < 1.) {
        p = d.xy + (p - d.xy) * (.25 + .75 * r * r);
        shine += pow(max(0., 1. - length(q / d.z - vec2(-.38, -.42)) * 2.6), 3.) * d.w;
        edge += smoothstep(.7, 1., r) * .6 * d.w;
      }
    }
  }
  float e = walk * (1. - exp(-t * .5));
  float depth = smoothstep(.4, 1., p.y);
  vec2 vp = vec2(.5, .46);
  vec2 s = vp + (p - vp) / (1. + e * (.06 + .5 * depth)) + look * (.006 + .03 * depth) * walk;
  s.y += e * .015;
  vec3 c = tex(s);
  float n = night * smoothstep(.1, 2.4, t);
  float lamp = lampMask(c);
  float fl = .7 + .3 * noise(s * 55. + vec2(t * 2.3, -t * 1.7)) * (.6 + .4 * sin(t * 9. + hash(floor(s * 40.)) * 6.28));
  vec3 halo = vec3(0.);
  if (n > 0.) {
    for (int k = 0; k < 12; k++) {
      float a = float(k) * .5236; float rr = .012 + .012 * mod(float(k), 3.);
      vec3 sc = tex(s + vec2(cos(a), sin(a)) * rr * vec2(1., aspect));
      halo += sc * lampMask(sc);
    }
    halo /= 12.;
  }
  vec3 tint = mix(vec3(1.), vec3(.28, .33, .58), n * (.55 + .45 * (1. - p.y)));
  vec3 col = c * mix(vec3(1.), tint, 1. - lamp * .85);
  col += (c * lamp * 1.1 + halo * vec3(1., .62, .28) * 2.6) * n * fl;
  if (aarti > 0.) {
    vec2 dq = (uv - flame) * vec2(aspect, 1.);
    float L = exp(-dot(dq, dq) / .03);
    vec3 lit = col * (.3 + L * vec3(1.15, .9, .55)) + vec3(.35, .16, .03) * L * L;
    col = mix(col, lit, aarti);
  }
  col += shine * vec3(1., .97, .9) * 2. - edge * .3;
  gl_FragColor = vec4(col, 1.);
}`;

const smooth = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));

/** Where the thali is (in the layer's own 0 to 1), how near, and how much it shows. */
function thaliAt(ms: number): { x: number; y: number; near: number; show: number } | null {
  const k = (ms - AARTI_FROM_MS) / AARTI_MS;
  if (k <= 0 || k >= 1) return null;
  const turn = Math.PI / 2 + k * Math.PI * 6;
  return {
    x: 0.5 + Math.cos(turn) * 0.2,
    y: 0.62 + Math.sin(turn) * 0.08,
    near: (Math.sin(turn) + 1) / 2,
    show: smooth(k * 6) * (1 - smooth((k - 0.9) * 10)),
  };
}

type Drop = { at: number; x: number; y: number; r: number; run: number; wobble: number };

function makeDrops(): Drop[] {
  return Array.from({ length: DROP_COUNT }, (_, i) => {
    const big = Math.random() < 0.3;
    return {
      at: DROPS_FROM_MS + i * 45 + Math.random() * 500,
      x: 0.12 + Math.random() * 0.76,
      y: 0.08 + Math.random() * 0.8,
      r: big ? 0.03 + Math.random() * 0.02 : 0.012 + Math.random() * 0.012,
      run: Math.random() < 0.45 ? 0.006 + Math.random() * 0.012 : 0,
      wobble: Math.random() * 6,
    };
  });
}

/**
 * Automated browsers skip the reveal, as they skip the prelude, so a test's timings don't
 * hang on WebGL drawn in software; ?reveal=1 shows it to them, to review it.
 */
function skipped(): boolean {
  return navigator.webdriver && new URLSearchParams(window.location.search).get("reveal") !== "1";
}

/** Whether the opening this layer sits in is open, following the stage's data-open. */
function useStageOpen(ref: React.RefObject<HTMLElement | null>): boolean {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const stage = ref.current?.closest<HTMLElement>(".opening-stage");
    if (!stage) return;
    const read = () => setOpen(stage.dataset.open === "true");
    read();
    const watch = new MutationObserver(read);
    watch.observe(stage, { attributes: true, attributeFilter: ["data-open"] });
    return () => watch.disconnect();
  }, [ref]);
  return open;
}

/** The painted place, alive: under the doors of a tied gate, or under a painted gate's arch. */
export function GateRevealPlace({ src, kind }: { src: string; kind: RevealKind }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const open = useStageOpen(canvas);
  const still = useReducedMotion();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const cv = canvas.current;
    if (!open || still || !cv || skipped()) return;
    let alive = true;
    let raf = 0;
    const timers: number[] = [];
    const gl = cv.getContext("webgl", { premultipliedAlpha: false, antialias: false });
    if (!gl) return;

    let onMove: ((event: PointerEvent) => void) | null = null;
    /**
     * Sets up and runs the scene, or does nothing when the GPU won't give it what it needs:
     * the canvas then stays clear and the painted place underneath shows as it is. A canvas
     * keeps its context, so one this effect lost on a last cleanup comes back lost; iOS also
     * drops contexts under memory pressure. createShader and its kin return null then.
     */
    const start = () => {
      if (!alive || gl.isContextLost()) return;
      try {
        run();
      } catch {
        // A GPU that gives out halfway leaves the canvas clear, never the page broken.
      }
    };
    const restored = () => start();
    const lost = () => cancelAnimationFrame(raf);
    cv.addEventListener("webglcontextrestored", restored);
    cv.addEventListener("webglcontextlost", lost);

    const run = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      cv.width = Math.max(1, Math.round(cv.clientWidth * dpr));
      cv.height = Math.max(1, Math.round(cv.clientHeight * dpr));
      const shader = (type: number, source: string) => {
        const s = gl.createShader(type);
        if (!s) return null;
        gl.shaderSource(s, source);
        gl.compileShader(s);
        return s;
      };
      const vert = shader(gl.VERTEX_SHADER, VERT);
      const frag = shader(gl.FRAGMENT_SHADER, FRAG);
      const program = gl.createProgram();
      if (!vert || !frag || !program) return;
      gl.attachShader(program, vert);
      gl.attachShader(program, frag);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
        gl.STATIC_DRAW,
      );
      const a = gl.getAttribLocation(program, "a");
      gl.enableVertexAttribArray(a);
      gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
      const u = (name: string) => gl.getUniformLocation(program, name);
      gl.uniform2f(u("res"), cv.width, cv.height);
      gl.uniform1f(u("night"), kind === "evening" ? 1 : 0);
      gl.uniform1f(u("walk"), kind === "evening" ? 1 : 0);
      gl.viewport(0, 0, cv.width, cv.height);

      let want = [0, 0];
      const look = [0, 0];
      onMove = (event: PointerEvent) => {
        const box = cv.getBoundingClientRect();
        want = [
          ((event.clientX - box.left) / box.width - 0.5) * 2,
          ((event.clientY - box.top) / box.height - 0.5) * 2,
        ];
      };
      if (kind === "evening") window.addEventListener("pointermove", onMove, { passive: true });

      const drops = kind === "rose" ? makeDrops() : [];
      const dropData = new Float32Array(DROP_COUNT * 4);
      const from = kind === "evening" ? EVENING_FROM_MS : 0;
      let t0 = 0;

      const frame = (now: number) => {
        if (!alive) return;
        const ms = now - t0;
        look[0]! += (want[0]! - look[0]!) * 0.06;
        look[1]! += (want[1]! - look[1]!) * 0.06;
        gl.uniform1f(u("t"), Math.max(0, ms - from) / 1000);
        gl.uniform2f(u("look"), look[0]!, look[1]!);
        if (kind === "aarti") {
          const at = thaliAt(ms);
          gl.uniform1f(u("aarti"), at ? at.show : 0);
          if (at) gl.uniform2f(u("flame"), at.x, at.y - 0.035 * (1 + at.near * 0.3));
        }
        if (kind === "rose") {
          drops.forEach((d, i) => {
            const age = (ms - d.at) / 1000;
            if (age < 0) return dropData.set([0, 0, 0, 0], i * 4);
            const life = 1 - smooth((age - 9) / 3);
            const y =
              d.y + Math.max(0, age - 1.2) * d.run * (1 + 0.3 * Math.sin(age * 3 + d.wobble));
            dropData.set([d.x, y, d.r * smooth(age * 6) * life, life], i * 4);
          });
          gl.uniform4fv(u(`drops[0]`), dropData);
        }
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        if (ms < RUN_MS) raf = requestAnimationFrame(frame);
      };

      const picture = new window.Image();
      picture.decoding = "async";
      picture.src = src;
      picture.onload = () => {
        if (!alive) return;
        gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, picture);
        t0 = performance.now();
        raf = requestAnimationFrame(frame);
        timers.push(window.setTimeout(() => setShown(true), from));
      };
    };

    if (!gl.isContextLost()) start();
    else {
      try {
        gl.getExtension("WEBGL_lose_context")?.restoreContext();
      } catch {
        // No way back: the painted place shows still.
      }
    }

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      timers.forEach((timer) => window.clearTimeout(timer));
      if (onMove) window.removeEventListener("pointermove", onMove);
      cv.removeEventListener("webglcontextrestored", restored);
      cv.removeEventListener("webglcontextlost", lost);
      setShown(false);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [open, still, src, kind]);

  return (
    <canvas
      ref={canvas}
      aria-hidden
      data-testid="gate-reveal"
      className={cn(
        "absolute inset-0 size-full transition-opacity duration-700",
        shown ? "opacity-100" : "opacity-0",
      )}
    />
  );
}

/** Reads the reveal's colours from the design tokens, for the canvas. */
function revealColors(el: HTMLElement) {
  const style = getComputedStyle(el);
  const token = (name: string) => style.getPropertyValue(`--${name}`).trim();
  return {
    brassDark: token("reveal-brass-dark"),
    brass: token("reveal-brass"),
    brassLight: token("reveal-brass-light"),
    kumkum: token("reveal-kumkum"),
    rice: token("reveal-rice"),
    flame: token("reveal-flame"),
    flameCore: token("reveal-flame-core"),
    roseWater: token("reveal-rose-water"),
    marigold: token("marigold"),
    clay: token("prelude-clay"),
    night: token("night"),
  };
}
type RevealColors = ReturnType<typeof revealColors>;

/** A brass aarti thali with a lit diya, marigolds, a kumkum bowl and rice, w wide. */
function drawThali(
  g: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  now: number,
  c: RevealColors,
) {
  g.save();
  g.translate(x, y);
  const h = w * 0.3;
  g.globalAlpha *= 0.35;
  g.fillStyle = c.night;
  g.beginPath();
  g.ellipse(0, h * 0.28, w * 0.52, h * 0.5, 0, 0, Math.PI * 2);
  g.fill();
  g.globalAlpha /= 0.35;
  let paint = g.createLinearGradient(-w / 2, 0, w / 2, 0);
  paint.addColorStop(0, c.brassDark);
  paint.addColorStop(0.3, c.brass);
  paint.addColorStop(0.5, c.brassLight);
  paint.addColorStop(0.7, c.brass);
  paint.addColorStop(1, c.brassDark);
  g.fillStyle = paint;
  g.beginPath();
  g.ellipse(0, 0, w / 2, h / 2, 0, 0, Math.PI * 2);
  g.fill();
  paint = g.createRadialGradient(-w * 0.1, -h * 0.1, 0, 0, 0, w * 0.44);
  paint.addColorStop(0, c.brassLight);
  paint.addColorStop(1, c.brass);
  g.fillStyle = paint;
  g.beginPath();
  g.ellipse(0, 0, w * 0.43, h * 0.41, 0, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = c.rice;
  for (let i = 0; i < 26; i++) {
    const a = i * 2.4;
    const r = 0.12 + (i % 5) * 0.045;
    g.beginPath();
    g.ellipse(
      Math.cos(a) * w * r - w * 0.1,
      Math.sin(a) * h * r * 1.4 + h * 0.05,
      w * 0.008,
      w * 0.004,
      a,
      0,
      Math.PI * 2,
    );
    g.fill();
  }
  g.fillStyle = c.brassDark;
  g.beginPath();
  g.ellipse(w * 0.2, h * 0.02, w * 0.07, h * 0.17, 0, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = c.kumkum;
  g.beginPath();
  g.ellipse(w * 0.2, -h * 0.01, w * 0.055, h * 0.12, 0, 0, Math.PI * 2);
  g.fill();
  for (const [mx, my] of [
    [-0.3, -0.05],
    [-0.22, 0.12],
    [0.32, 0.1],
  ] as const) {
    const cx = mx * w;
    const cy = my * h * 1.4;
    const r = w * 0.045;
    g.fillStyle = c.marigold;
    for (let j = 0; j < 14; j++) {
      const a = j * 0.45;
      g.globalAlpha = j % 2 ? 0.85 : 1;
      g.beginPath();
      g.arc(cx + Math.cos(a) * r * 0.55, cy + Math.sin(a) * r * 0.35, r * 0.5, 0, Math.PI * 2);
      g.fill();
    }
    g.globalAlpha = 1;
    g.fillStyle = c.clay;
    g.beginPath();
    g.arc(cx, cy, r * 0.35, 0, Math.PI * 2);
    g.fill();
  }
  const dx = -w * 0.02;
  const dy = -h * 0.05;
  g.fillStyle = c.clay;
  g.beginPath();
  g.ellipse(dx, dy, w * 0.11, h * 0.28, 0, 0, Math.PI);
  g.fill();
  g.fillStyle = c.brassDark;
  g.beginPath();
  g.ellipse(dx, dy, w * 0.11, h * 0.1, 0, 0, Math.PI * 2);
  g.fill();
  const flicker = 1 + 0.08 * Math.sin(now / 70) + 0.05 * Math.sin(now / 33);
  const fx = dx + w * 0.06;
  const fy = dy - h * 0.05;
  const fh = w * 0.12 * flicker;
  g.globalCompositeOperation = "lighter";
  paint = g.createRadialGradient(fx, fy - fh * 0.5, 0, fx, fy - fh * 0.5, w * 0.5);
  paint.addColorStop(0, c.flame);
  paint.addColorStop(1, "transparent");
  g.globalAlpha *= 0.5;
  g.fillStyle = paint;
  g.beginPath();
  g.arc(fx, fy - fh * 0.5, w * 0.5, 0, Math.PI * 2);
  g.fill();
  g.globalAlpha /= 0.5;
  g.fillStyle = c.flame;
  g.beginPath();
  g.moveTo(fx, fy - fh);
  g.quadraticCurveTo(fx + w * 0.035, fy - fh * 0.3, fx, fy);
  g.quadraticCurveTo(fx - w * 0.035, fy - fh * 0.3, fx, fy - fh);
  g.fill();
  g.fillStyle = c.flameCore;
  g.beginPath();
  g.ellipse(fx, fy - fh * 0.3, w * 0.012, fh * 0.22, 0, 0, Math.PI * 2);
  g.fill();
  g.restore();
}

/** A fine spray of rose water crossing the screen, before the drops land. */
function drawSpray(g: CanvasRenderingContext2D, ms: number, w: number, h: number, c: RevealColors) {
  const k = (ms - SPRAY_FROM_MS) / 900;
  if (k < 0 || k > 1.4) return;
  g.save();
  g.globalCompositeOperation = "lighter";
  g.globalAlpha = 0.35 * Math.max(0, 1 - Math.abs(k - 0.5) * 1.4);
  g.fillStyle = c.roseWater;
  for (let i = 0; i < 90; i++) {
    const f = (i / 90 + k) % 1;
    const spin = i * 2.399;
    g.beginPath();
    g.arc(
      w * (1.05 - f * 0.95 + Math.sin(spin) * 0.08),
      h * (-0.02 + f * 0.55 + Math.cos(spin) * 0.12),
      w * 0.0035,
      0,
      Math.PI * 2,
    );
    g.fill();
  }
  g.restore();
}

/** The thali or the spray, over the doors, in the same frame as GateRevealPlace. */
export function GateRevealOver({ kind }: { kind: "aarti" | "rose" }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const open = useStageOpen(canvas);
  const still = useReducedMotion();

  useEffect(() => {
    const cv = canvas.current;
    if (!open || still || !cv || skipped()) return;
    const g = cv.getContext("2d");
    if (!g) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.max(1, Math.round(cv.clientWidth * dpr));
    cv.height = Math.max(1, Math.round(cv.clientHeight * dpr));
    const colors = revealColors(cv);
    const t0 = performance.now();
    let raf = 0;
    const end = kind === "aarti" ? AARTI_FROM_MS + AARTI_MS : SPRAY_FROM_MS + 1400;
    const frame = (now: number) => {
      const ms = now - t0;
      g.clearRect(0, 0, cv.width, cv.height);
      if (kind === "aarti") {
        const at = thaliAt(ms);
        if (at) {
          g.globalAlpha = at.show;
          drawThali(
            g,
            at.x * cv.width,
            at.y * cv.height,
            cv.width * (0.38 + 0.12 * at.near),
            now,
            colors,
          );
          g.globalAlpha = 1;
        }
      } else {
        drawSpray(g, ms, cv.width, cv.height, colors);
      }
      if (ms < end) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      g.clearRect(0, 0, cv.width, cv.height);
    };
  }, [open, still, kind]);

  return (
    <canvas ref={canvas} aria-hidden className="pointer-events-none absolute inset-0 size-full" />
  );
}
