import type { Prelude } from "@/lib/opening/preludes";

/*
 * The ten preludes (prelude.tsx), each drawn in a canvas or a few SVG shapes over the
 * theme's own painting, softly blurred. Each one varies a little every time it plays (a
 * wind's direction, a kolam's shape, a thread's path) and ends by handing over to the
 * gate: reveal() fades the prelude away from the gate, already drawn beneath it.
 */

export type PreludeColors = {
  night: string;
  gold: string;
  glint: string;
  ivory: string;
  marigold: string;
  accent: string;
  light: string;
  leaf: string;
  cardAccent: string;
  henna: string;
  skin: string;
  thread: string;
  stripe: string;
  teal: string;
  blue: string;
  green: string;
  clay: string;
  water: string;
  fog: string;
};

export type SceneKit = {
  root: HTMLElement;
  cv: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  /** Where a scene puts its own shapes, over the canvas. */
  fx: HTMLElement;
  /** The frosted layer over the gate, for the misty window. */
  frost: HTMLElement;
  w: number;
  h: number;
  dpr: number;
  /** A low-end phone: fewer grains, sparks and petals. */
  lite: boolean;
  alive: () => boolean;
  colors: PreludeColors;
  /** The couple's names as the card writes them, in its language. */
  names: { first: string; second: string; joiner: string };
  /** The names' first letters, always in English letters (preludes.ts). */
  initials: { first: string; second: string };
  /** "Dear" and the guest's name, when they came by their own link. */
  greeting: { dear: string; name: string } | null;
  /** The theme's face for names, and a handwriting face, both as CSS font-family lists. */
  faces: { names: string; hand: string; latinHand: string; display: string };
  /** Fades the prelude away; the gate is already drawn beneath it. */
  reveal: () => void;
};

const TAU = Math.PI * 2;
const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T>(list: readonly T[]): T => list[Math.floor(Math.random() * list.length)]!;
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** A token's colour with an opacity, for canvas gradients. */
export function alpha(color: string, a: number): string {
  const hex = color.trim().replace("#", "");
  if (/^[0-9a-f]{6}$/i.test(hex)) {
    const n = parseInt(hex, 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
  }
  return color;
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

/** Runs fn each frame with the seconds since it began, until it returns false. */
function loop(kit: SceneKit, fn: (t: number) => boolean) {
  const t0 = performance.now();
  return new Promise<void>((resolve) => {
    const frame = (now: number) => {
      if (!kit.alive() || !fn((now - t0) / 1000)) return resolve();
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  });
}

function fontsReady(fonts: string[]) {
  if (!("fonts" in document)) return Promise.resolve();
  return Promise.race([
    Promise.all(fonts.map((font) => document.fonts.load(font).catch(() => []))),
    wait(1200),
  ]);
}

function overlayCanvas(kit: SceneKit) {
  const canvas = document.createElement("canvas");
  canvas.className = "prelude-layer";
  canvas.width = kit.w;
  canvas.height = kit.h;
  kit.fx.appendChild(canvas);
  return canvas.getContext("2d")!;
}

/** The scene parts down the middle and each half leaves, like two doors. */
function splitAway(kit: SceneKit, scene: HTMLElement, mode: "slide" | "fold") {
  const left = scene.cloneNode(true) as HTMLElement;
  const right = scene.cloneNode(true) as HTMLElement;
  left.classList.add("prelude-half", "prelude-half-l");
  right.classList.add("prelude-half", "prelude-half-r");
  kit.fx.append(left, right);
  scene.remove();
  kit.reveal();
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      left.classList.add(`prelude-${mode}`);
      right.classList.add(`prelude-${mode}`);
    }),
  );
  return wait(1700);
}

/** Points inside some text drawn in a face, for grains and sparks to gather into. */
function textPoints(
  kit: SceneKit,
  lines: { text: string; y: number; size: number }[],
  face: string,
  step: number,
): [number, number][] {
  const { w, h } = kit;
  const off = document.createElement("canvas");
  off.width = w;
  off.height = h;
  const o = off.getContext("2d", { willReadFrequently: true })!;
  o.fillStyle = "#000";
  o.textAlign = "center";
  o.textBaseline = "middle";
  for (const line of lines) {
    let size = line.size;
    o.font = `${size}px ${face}`;
    while (o.measureText(line.text).width > w * 0.86 && size > 10) {
      size *= 0.92;
      o.font = `${size}px ${face}`;
    }
    o.fillText(line.text, w / 2, line.y);
  }
  const data = o.getImageData(0, 0, w, h).data;
  const points: [number, number][] = [];
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) if (data[(y * w + x) * 4 + 3]! > 140) points.push([x, y]);
  }
  return points;
}

/* 1. Gulal rangoli: coloured powder flies in, settles into a turning rangoli, blows away */
async function rangoli(kit: SceneKit) {
  const { ctx, w, h, dpr, colors: c } = kit;
  const cx = w / 2;
  const cy = h * 0.45;
  const R = Math.min(w * 0.46, h * 0.28);
  const palette = pick([
    [c.light, c.accent, c.ivory, c.leaf, c.cardAccent],
    [c.marigold, c.accent, c.ivory, c.teal, c.thread],
    [c.glint, c.cardAccent, c.ivory, c.green, c.accent],
  ]);
  const k = pick([6, 8, 10, 12]);
  const from = rnd(0, TAU);
  type Grain = {
    tx: number;
    ty: number;
    sx: number;
    sy: number;
    bend: number;
    d: number;
    c: string;
    s: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
  };
  const grains: Grain[] = [];
  for (let i = 0; i < (kit.lite ? 1100 : 2400); i++) {
    const u = Math.random();
    let a = rnd(0, TAU);
    let layer: number;
    let r: number;
    if (u < 0.1) {
      layer = 0;
      r = Math.sqrt(Math.random()) * R * 0.13;
    } else if (u < 0.45) {
      layer = 1;
      const edge = R * (0.16 + 0.36 * Math.pow(Math.abs(Math.cos((k * a) / 2)), 0.7));
      r = R * 0.15 + Math.sqrt(Math.random()) * Math.max(0, edge - R * 0.15);
    } else if (u < 0.62) {
      layer = 2;
      r = R * (0.58 + 0.16 * Math.abs(Math.sin((k * a) / 2))) - Math.random() * R * 0.05;
    } else if (u < 0.78) {
      layer = 3;
      const n = k * 4;
      a = (Math.round((a / TAU) * n) / n) * TAU + rnd(-0.014, 0.014);
      r = R * (0.82 + rnd(-0.02, 0.02));
    } else {
      layer = 4;
      r = R * (0.92 + 0.1 * Math.abs(Math.sin(k * a))) - Math.random() * R * 0.04;
    }
    const sd = Math.max(w, h) * rnd(0.8, 1.3);
    const sa = from + rnd(-0.45, 0.45);
    grains.push({
      tx: Math.cos(a) * r,
      ty: Math.sin(a) * r,
      sx: cx + Math.cos(sa) * sd,
      sy: cy + Math.sin(sa) * sd,
      bend: rnd(-0.35, 0.35),
      d: layer * 0.2 + Math.random() * 0.35,
      c: palette[layer % palette.length]!,
      s: rnd(1.3, 2.6) * dpr,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
    });
  }
  const FLY = 1.5;
  const WIND = 3.8;
  let revealed = false;
  await loop(kit, (t) => {
    ctx.clearRect(0, 0, w, h);
    if (t > FLY + 1 && t < WIND + 0.6) {
      const glow =
        Math.min(1, (t - FLY - 1) / 0.8) * (t > WIND ? Math.max(0, 1 - (t - WIND) / 0.6) : 1);
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.2);
      g.addColorStop(0, alpha(c.glint, 0.22 * glow));
      g.addColorStop(1, alpha(c.glint, 0));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }
    if (t >= WIND && !revealed) {
      revealed = true;
      kit.reveal();
    }
    const rot = t * 0.07;
    const cs = Math.cos(rot);
    const sn = Math.sin(rot);
    for (const p of grains) {
      let x: number;
      let y: number;
      let a = 1;
      if (t < WIND) {
        const q = clamp((t - p.d) / FLY, 0, 1);
        if (q <= 0) continue;
        const e = easeOut(q);
        const gx = cx + p.tx * cs - p.ty * sn;
        const gy = cy + p.tx * sn + p.ty * cs;
        const mx = (p.sx + gx) / 2 + (gy - p.sy) * p.bend;
        const my = (p.sy + gy) / 2 - (gx - p.sx) * p.bend;
        x = (1 - e) * (1 - e) * p.sx + 2 * (1 - e) * e * mx + e * e * gx;
        y = (1 - e) * (1 - e) * p.sy + 2 * (1 - e) * e * my + e * e * gy;
        p.x = x;
        p.y = y;
      } else {
        if (!p.vx && !p.vy) {
          const dx = p.x - cx;
          const dy = p.y - cy;
          const d = Math.hypot(dx, dy) || 1;
          const sp = rnd(3, 8) * dpr;
          p.vx = ((dx / d) * 0.7 - dy / d) * sp;
          p.vy = ((dy / d) * 0.7 + dx / d) * sp - 1.5 * dpr;
        }
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 1.025;
        p.vy *= 1.025;
        x = p.x;
        y = p.y;
        a = Math.max(0, 1 - (t - WIND) / 1.1);
      }
      ctx.globalAlpha = a;
      ctx.fillStyle = p.c;
      ctx.fillRect(x, y, p.s, p.s);
    }
    ctx.globalAlpha = 1;
    return t < WIND + 1.2;
  });
}

/* 2. Kalava thread: sews itself round both initials, ties a knot, parts like two doors */
function curvePath(points: [number, number][]) {
  const f = (p: readonly number[]) => `${p[0]!.toFixed(2)},${p[1]!.toFixed(2)}`;
  let d = `M${f(points[0]!)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]!;
    const p1 = points[i]!;
    const p2 = points[i + 1]!;
    const p3 = points[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${f(c1)} ${f(c2)} ${f(p2)}`;
  }
  return d;
}

const SVG = "http://www.w3.org/2000/svg";
function svgEl(name: string, attrs: Record<string, string | number>) {
  const el = document.createElementNS(SVG, name);
  for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, String(value));
  return el;
}

async function thread(kit: SceneKit) {
  await fontsReady([`20px ${kit.faces.display}`]);
  const { colors: c, initials } = kit;
  const pair = Boolean(initials.second);
  const [base, stripe] = pick([
    [c.thread, c.stripe],
    [c.thread, c.ivory],
    [c.marigold, c.thread],
  ]);
  const A: [number, number] = pair ? [27, 72] : [45, 72];
  const B: [number, number] = [63, 72];
  const K: [number, number] = [45, 72];
  const ra = 11.5;
  const pts: [number, number][] = [
    [-6, rnd(130, 150)],
    [rnd(8, 22), rnd(112, 128)],
    [rnd(30, 44), rnd(118, 134)],
    [rnd(18, 26), rnd(96, 102)],
  ];
  for (let i = 0; i <= 11; i++) {
    const a = Math.PI / 2 + (i * TAU) / 10;
    pts.push([A[0] + Math.cos(a) * ra, A[1] + Math.sin(a) * ra]);
  }
  if (pair) {
    for (let i = 0; i <= 6; i++) {
      const a = Math.PI + (i * TAU) / 6;
      pts.push([K[0] + Math.cos(a) * 3.2, K[1] + Math.sin(a) * 3.2]);
    }
    for (let i = 0; i <= 11; i++) {
      const a = Math.PI - (i * TAU) / 10;
      pts.push([B[0] + Math.cos(a) * ra, B[1] + Math.sin(a) * ra]);
    }
  }
  pts.push([rnd(70, 82), rnd(40, 52)], [rnd(80, 88), rnd(22, 30)], [98, rnd(6, 14)]);
  const d = curvePath(pts);

  const scene = document.createElement("div");
  scene.className = "prelude-scene";
  const svg = svgEl("svg", {
    viewBox: "0 0 90 160",
    // A phone fills with the thread; a wide screen keeps it whole in the middle
    preserveAspectRatio: kit.w > kit.h ? "xMidYMid meet" : "xMidYMid slice",
    class: "size-full",
  });
  const maskId = `prelude-thread-${Math.random().toString(36).slice(2)}`;
  const defs = svgEl("defs", {});
  const mask = svgEl("mask", { id: maskId, maskUnits: "userSpaceOnUse" });
  const drawn = svgEl("path", {
    d,
    fill: "none",
    stroke: "#fff",
    "stroke-width": 4,
    "stroke-linecap": "round",
  }) as SVGPathElement;
  mask.append(drawn);
  defs.append(mask);
  svg.append(defs);
  const medal = (at: [number, number], letter: string) => {
    const g = svgEl("g", { class: "prelude-medal" });
    g.append(svgEl("circle", { cx: at[0], cy: at[1], r: 8 }));
    const text = svgEl("text", { x: at[0], y: at[1] + 3.2, "text-anchor": "middle" });
    text.textContent = letter;
    g.append(text);
    svg.append(g);
    return g;
  };
  const mA = medal(A, initials.first);
  const mB = pair ? medal(B, initials.second) : null;
  const strand = svgEl("g", { mask: `url(#${maskId})` });
  strand.append(
    svgEl("path", {
      d,
      fill: "none",
      stroke: base!,
      "stroke-width": 1.5,
      "stroke-linecap": "round",
    }),
    svgEl("path", {
      d,
      fill: "none",
      stroke: stripe!,
      "stroke-width": 1.5,
      "stroke-dasharray": "1.6 2.4",
    }),
    svgEl("path", {
      d,
      fill: "none",
      stroke: alpha(c.ivory, 0.35),
      "stroke-width": 0.35,
      transform: "translate(-.25,-.3)",
    }),
  );
  svg.append(strand);
  const knot = svgEl("circle", { class: "prelude-knot", cx: K[0], cy: K[1], r: 1.6 });
  if (pair) svg.append(knot);
  const needle = svgEl("g", {});
  needle.append(
    svgEl("line", {
      x1: -6,
      y1: 0,
      x2: 1.5,
      y2: 0,
      stroke: c.fog,
      "stroke-width": 0.6,
      "stroke-linecap": "round",
    }),
  );
  svg.append(needle);
  scene.append(svg);
  kit.fx.append(scene);

  const total = drawn.getTotalLength();
  drawn.style.strokeDasharray = String(total);
  drawn.style.strokeDashoffset = String(total);
  const DRAW = 3.6;
  await loop(kit, (t) => {
    const q = easeInOut(clamp(t / DRAW, 0, 1));
    const length = total * q;
    drawn.style.strokeDashoffset = String(total - length);
    const p = drawn.getPointAtLength(length);
    const p0 = drawn.getPointAtLength(Math.max(0, length - 0.6));
    const angle = (Math.atan2(p.y - p0.y, p.x - p0.x) * 180) / Math.PI;
    needle.setAttribute("transform", `translate(${p.x},${p.y}) rotate(${angle})`);
    needle.style.opacity = q >= 1 ? "0" : "1";
    if (Math.hypot(p.x - A[0], p.y - A[1]) < ra + 1) mA.classList.add("prelude-lit");
    if (mB && Math.hypot(p.x - B[0], p.y - B[1]) < ra + 1) mB.classList.add("prelude-lit");
    if (pair && Math.hypot(p.x - K[0], p.y - K[1]) < 4) knot.classList.add("prelude-lit");
    return t < DRAW + 0.2;
  });
  if (!kit.alive()) return;
  await wait(800);
  if (!kit.alive()) return;
  await splitAway(kit, scene, "slide");
}

/* 3. Written for you: the guest's own name (or the couple's) written in ink, then it opens */
async function letter(kit: SceneKit) {
  const { colors: c, greeting, names } = kit;
  await fontsReady([`44px ${kit.faces.hand}`, `24px ${kit.faces.names}`]);
  const ink = pick([c.henna, c.night, c.blue]);
  const lines = greeting
    ? [greeting.dear, `${greeting.name},`]
    : [names.first, names.second].filter(Boolean);
  const scene = document.createElement("div");
  scene.className = "prelude-scene";
  const paper = document.createElement("div");
  paper.className = "prelude-paper";
  const svg = svgEl("svg", { viewBox: "0 0 300 420", class: "size-full" });
  const defs = svgEl("defs", {});
  svg.append(defs);
  const id = Math.random().toString(36).slice(2);
  const written = lines.map((line, i) => {
    const clip = svgEl("clipPath", { id: `prelude-w${i}-${id}` });
    const rect = svgEl("rect", { x: 0, y: 0, width: 0, height: 420 });
    clip.append(rect);
    defs.append(clip);
    const g = svgEl("g", { "clip-path": `url(#prelude-w${i}-${id})` });
    const base = greeting ? 150 + i * 66 : 140 + i * 96;
    const text = svgEl("text", {
      x: 150,
      y: base,
      class: "prelude-hand",
      fill: ink!,
      stroke: ink!,
    }) as SVGTextElement;
    text.style.fontFamily = kit.faces.hand;
    text.textContent = line;
    g.append(text);
    svg.append(g);
    return { text, rect, base };
  });
  let joiner: SVGTextElement | null = null;
  if (!greeting && names.joiner && lines.length > 1) {
    joiner = svgEl("text", {
      x: 150,
      y: 192,
      class: "prelude-joiner",
      fill: c.gold,
    }) as SVGTextElement;
    joiner.style.fontFamily = kit.faces.names;
    joiner.textContent = names.joiner;
    svg.append(joiner);
  }
  let couple: SVGTextElement | null = null;
  if (greeting) {
    couple = svgEl("text", {
      x: 150,
      y: 320,
      class: "prelude-couple",
      fill: ink!,
    }) as SVGTextElement;
    couple.style.fontFamily = kit.faces.names;
    couple.textContent = [names.first, names.joiner, names.second].filter(Boolean).join(" ");
    svg.append(couple);
  }
  const nib = svgEl("circle", { r: 2.6, fill: ink!, opacity: 0, class: "prelude-nib" });
  svg.append(nib);
  paper.append(svg);
  scene.append(paper);
  kit.fx.append(scene);

  // Long names shrink to fit the paper
  for (const line of written) {
    let size = 44;
    while (line.text.getBBox().width > 270 && size > 18) {
      size -= 2;
      line.text.style.fontSize = `${size}px`;
    }
  }
  if (couple) {
    let size = 24;
    while (couple.getBBox().width > 270 && size > 12) {
      size -= 1;
      couple.style.fontSize = `${size}px`;
    }
  }
  const boxes = written.map((line) => {
    const box = line.text.getBBox();
    line.rect.setAttribute("x", String(box.x - 6));
    return box;
  });
  const per = [1.1, 1.9];
  const start = [0.3, 1.6];
  const end = start[written.length - 1]! + per[written.length - 1]!;
  await loop(kit, (time) => {
    let pen: [number, number] | null = null;
    written.forEach((line, i) => {
      const box = boxes[i]!;
      const q = clamp((time - start[i]!) / per[i]!, 0, 1);
      line.rect.setAttribute("width", String((box.width + 12) * q));
      line.text.style.strokeDashoffset = String(420 * (1 - easeOut(q)));
      line.text.style.fillOpacity = String(
        clamp((time - start[i]! - per[i]! * 0.5) / per[i]!, 0, 1),
      );
      if (q > 0 && q < 1) {
        pen = [box.x - 6 + (box.width + 12) * q, line.base - 12 + Math.sin(time * 26) * 9];
      }
    });
    if (joiner && time > start[1]! - 0.3) joiner.classList.add("prelude-in");
    if (pen) {
      nib.setAttribute("cx", String(pen[0]));
      nib.setAttribute("cy", String(pen[1]));
      nib.setAttribute("opacity", "1");
    } else nib.setAttribute("opacity", "0");
    return time < end + 0.3;
  });
  if (!kit.alive()) return;
  couple?.classList.add("prelude-in");
  await wait(couple ? 1500 : 900);
  if (!kit.alive()) return;
  await splitAway(kit, scene, "fold");
}

/* 4. Kolam of light: dots, then one flame draws a kolam round them in long-exposure light */
function gcd(a: number, b: number): number {
  return b ? gcd(b, a % b) : a;
}
async function kolam(kit: SceneKit) {
  const { ctx, w, h, dpr, colors: c } = kit;
  const cx = w / 2;
  const cy = h * 0.45;
  const R = Math.min(w * 0.42, h * 0.25);
  const [A, B, D] = pick([
    [5, 3, 5],
    [7, 4, 6],
    [8, 3, 6],
    [9, 4, 7],
    [7, 2, 4],
    [10, 3, 7],
  ] as const);
  const dir = Math.random() < 0.5 ? 1 : -1;
  const spin = rnd(0, TAU);
  const turns = (TAU * B) / gcd(A, B);
  const scale = R / (A - B + D);
  const at = (t: number): [number, number] => {
    const x = scale * ((A - B) * Math.cos(t) + D * Math.cos(((A - B) / B) * t));
    const y = dir * scale * ((A - B) * Math.sin(t) - D * Math.sin(((A - B) / B) * t));
    return [
      cx + x * Math.cos(spin) - y * Math.sin(spin),
      cy + x * Math.sin(spin) + y * Math.cos(spin),
    ];
  };
  const [stroke, glow] = pick([
    [c.marigold, c.cardAccent],
    [c.glint, c.light],
    [c.light, c.accent],
  ]);
  const gap = R * 0.36;
  const dots: { x: number; y: number; at: number; done: boolean }[] = [];
  for (let i = -3; i <= 3; i++) {
    for (let j = -3; j <= 3; j++) {
      if (Math.abs(i) + Math.abs(j) > 3) continue;
      dots.push({
        x: cx + (i - j) * gap * 0.707,
        y: cy + (i + j) * gap * 0.707,
        at: rnd(0, 0.7),
        done: false,
      });
    }
  }
  const top = overlayCanvas(kit);
  const sparks: { x: number; y: number; vx: number; vy: number; life: number }[] = [];
  const DRAW = 3.6;
  const START = 0.8;
  let prev = 0;
  let revealed = false;
  await loop(kit, (t) => {
    for (const d of dots) {
      if (d.done || t < d.at) continue;
      d.done = true;
      ctx.fillStyle = alpha(c.ivory, 0.9);
      ctx.beginPath();
      ctx.arc(d.x, d.y, 2.2 * dpr, 0, TAU);
      ctx.fill();
    }
    const q = easeInOut(clamp((t - START) / DRAW, 0, 1));
    const u = q * turns;
    if (u > prev) {
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = stroke!;
      ctx.globalAlpha = 0.6;
      ctx.lineWidth = 2.4 * dpr;
      ctx.lineCap = "round";
      ctx.shadowBlur = 12 * dpr;
      ctx.shadowColor = glow!;
      ctx.beginPath();
      let p = at(prev);
      ctx.moveTo(p[0], p[1]);
      for (let s = prev; s <= u; s += 0.01) {
        p = at(s);
        ctx.lineTo(p[0], p[1]);
      }
      p = at(u);
      ctx.lineTo(p[0], p[1]);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      ctx.globalCompositeOperation = "source-over";
      prev = u;
    }
    top.clearRect(0, 0, w, h);
    if (q > 0 && q < 1) {
      const [x, y] = at(u);
      const g = top.createRadialGradient(x, y, 0, x, y, 22 * dpr);
      g.addColorStop(0, c.glint);
      g.addColorStop(0.25, alpha(glow!, 0.9));
      g.addColorStop(1, alpha(glow!, 0));
      top.fillStyle = g;
      top.beginPath();
      top.arc(x, y, 22 * dpr, 0, TAU);
      top.fill();
      for (let i = 0; i < (kit.lite ? 1 : 3); i++) {
        sparks.push({ x, y, vx: rnd(-1.6, 1.6) * dpr, vy: rnd(-2, 0.6) * dpr, life: 1 });
      }
    }
    top.globalCompositeOperation = "lighter";
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i]!;
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.06 * dpr;
      s.life -= 0.03;
      if (s.life <= 0) {
        sparks.splice(i, 1);
        continue;
      }
      top.globalAlpha = s.life;
      top.fillStyle = stroke!;
      top.fillRect(s.x, s.y, 1.6 * dpr, 1.6 * dpr);
    }
    top.globalAlpha = 1;
    top.globalCompositeOperation = "source-over";
    const flare = t - START - DRAW;
    if (flare > 0) {
      const k = clamp(flare / 1.2, 0, 1);
      const a = k < 0.3 ? k / 0.3 : 1 - (k - 0.3) / 0.7;
      const g = top.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * (0.2 + k));
      g.addColorStop(0, alpha(c.glint, 0.9 * a));
      g.addColorStop(1, alpha(c.light, 0));
      top.fillStyle = g;
      top.fillRect(0, 0, w, h);
      if (k > 0.3 && !revealed) {
        revealed = true;
        kit.reveal();
      }
    }
    return flare < 1.3;
  });
}

/* 5. Gold dust: gathers into the couple's names, then flows into a doorway's outline */
async function gold(kit: SceneKit) {
  const { ctx, w, h, dpr, colors: c, names } = kit;
  await fontsReady([`40px ${kit.faces.names}`]);
  const size = Math.min(w * 0.19, h * 0.09);
  const lines = names.second
    ? [
        { text: names.first, y: h * 0.36, size },
        { text: names.joiner || "&", y: h * 0.45, size: size * 0.7 },
        { text: names.second, y: h * 0.54, size },
      ]
    : [{ text: names.first, y: h * 0.45, size }];
  const points = textPoints(kit, lines, kit.faces.names, Math.max(2, Math.round(2 * dpr)));
  const count = kit.lite ? 900 : 2000;
  // A doorway like the gate's own: two pillars, an arched top and the doors' seam
  const archW = Math.min(w * 0.74, h * 0.5);
  const arch = { x: (w - archW) / 2, y: h * 0.11, w: archW, h: h * 0.68 };
  const ry = arch.h * 0.28;
  const rx = arch.w / 2;
  const sides: ((s: number) => [number, number])[] = [
    (s) => [arch.x, arch.y + ry + s * (arch.h - ry)],
    (s) => [arch.x + arch.w, arch.y + ry + s * (arch.h - ry)],
    (s) => {
      const th = Math.PI + s * Math.PI;
      return [arch.x + rx + Math.cos(th) * rx, arch.y + ry + Math.sin(th) * ry];
    },
    (s) => [arch.x + rx, arch.y + s * arch.h],
  ];
  const lengths = [
    arch.h - ry,
    arch.h - ry,
    Math.PI * Math.sqrt((rx * rx + ry * ry) / 2),
    arch.h * 0.8,
  ];
  const sum = lengths.reduce((a, b) => a + b, 0);
  const outline: [number, number][] = [];
  for (let i = 0; i < count; i++) {
    let r = Math.random() * sum;
    let k = 0;
    while (r > lengths[k]!) r -= lengths[k++]!;
    outline.push(sides[k]!(Math.random()));
  }
  const mode = pick(["rise", "scatter", "burst"] as const);
  const shades = [c.glint, c.gold, c.light, c.marigold];
  const grains = Array.from({ length: count }, () => {
    const target = points.length
      ? points[Math.floor(Math.random() * points.length)]!
      : [w / 2, h / 2];
    let sx: number;
    let sy: number;
    if (mode === "rise") {
      sx = rnd(0, w);
      sy = h + rnd(0, h * 0.3);
    } else if (mode === "scatter") {
      sx = rnd(0, w);
      sy = rnd(0, h);
    } else {
      const a = rnd(0, TAU);
      const r = rnd(0, 30 * dpr);
      sx = w / 2 + Math.cos(a) * r;
      sy = h * 0.45 + Math.sin(a) * r;
    }
    return {
      sx,
      sy,
      tx: target[0]! + rnd(-0.8, 0.8) * dpr,
      ty: target[1]! + rnd(-0.8, 0.8) * dpr,
      ax: 0,
      ay: 0,
      d: rnd(0, 0.5),
      d2: rnd(0, 0.35),
      ph: rnd(0, TAU),
      c: pick(shades),
      s: (Math.random() < 0.04 ? 2.6 : rnd(1, 1.7)) * dpr,
    };
  });
  grains.sort((a, b) => a.tx - b.tx);
  outline.sort((a, b) => a[0] - b[0]);
  grains.forEach((g, i) => {
    g.ax = outline[i]![0];
    g.ay = outline[i]![1];
  });
  const GATHER = 1.8;
  const HOLD = 3.1;
  const MORPH = 1.4;
  const FADE = HOLD + MORPH;
  let revealed = false;
  await loop(kit, (t) => {
    ctx.clearRect(0, 0, w, h);
    if (t >= FADE && !revealed) {
      revealed = true;
      kit.reveal();
    }
    ctx.globalCompositeOperation = "lighter";
    for (const p of grains) {
      let x: number;
      let y: number;
      let a: number;
      if (t < HOLD) {
        const q = easeInOut(clamp((t - p.d) / GATHER, 0, 1));
        const wobble = (1 - q) * 14 * dpr;
        x = p.sx + (p.tx - p.sx) * q + Math.sin(t * 2 + p.ph) * wobble;
        y = p.sy + (p.ty - p.sy) * q + Math.cos(t * 2.3 + p.ph) * wobble;
        a = q >= 1 ? 0.6 + 0.4 * Math.sin(t * 7 + p.ph) : 0.35 + 0.65 * q;
      } else {
        const q = easeInOut(clamp((t - HOLD - p.d2) / (MORPH - 0.35), 0, 1));
        x = p.tx + (p.ax - p.tx) * q;
        y = p.ty + (p.ay - p.ty) * q - Math.sin(q * Math.PI) * 30 * dpr;
        a = t < FADE ? 0.9 : Math.max(0, 1 - (t - FADE) / 0.7);
      }
      ctx.globalAlpha = a;
      ctx.fillStyle = p.c;
      ctx.fillRect(x, y, p.s, p.s);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    return t < FADE + 0.9;
  });
}

/* 6. Misty window: the gate behind fogged glass; the guest wipes it to see in */
async function mist(kit: SceneKit) {
  const { ctx, w, h, dpr, colors: c, initials, cv, frost } = kit;
  await fontsReady([`80px ${kit.faces.latinHand}`]);
  const blur = (px: number) => {
    frost.style.backdropFilter = `blur(${px}px)`;
    frost.style.setProperty("-webkit-backdrop-filter", `blur(${px}px)`);
  };
  blur(12);
  const fog = ctx.createLinearGradient(0, 0, 0, h);
  fog.addColorStop(0, alpha(c.fog, 0.9));
  fog.addColorStop(1, alpha(c.fog, 0.95));
  ctx.fillStyle = fog;
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < (kit.lite ? 300 : 900); i++) {
    ctx.fillStyle = alpha(c.ivory, rnd(0.1, 0.35));
    ctx.beginPath();
    ctx.arc(rnd(0, w), rnd(0, h), rnd(0.4, 1.6) * dpr, 0, TAU);
    ctx.fill();
  }
  const GX = 18;
  const GY = 32;
  const cells = new Uint8Array(GX * GY);
  let cleared = 0;
  const NEED = 0.36;
  const mark = (x: number, y: number, r: number) => {
    const rr = r * 0.75;
    const y0 = Math.max(0, Math.floor(((y - rr) / h) * GY));
    const y1 = Math.min(GY - 1, Math.floor(((y + rr) / h) * GY));
    const x0 = Math.max(0, Math.floor(((x - rr) / w) * GX));
    const x1 = Math.min(GX - 1, Math.floor(((x + rr) / w) * GX));
    for (let gy = y0; gy <= y1; gy++) {
      for (let gx = x0; gx <= x1; gx++) {
        const px = ((gx + 0.5) * w) / GX;
        const py = ((gy + 0.5) * h) / GY;
        if (Math.hypot(px - x, py - y) < rr && !cells[gy * GX + gx]) {
          cells[gy * GX + gx] = 1;
          cleared++;
        }
      }
    }
  };
  const drips: { x: number; y: number; v: number; life: number }[] = [];
  const dab = (x: number, y: number, r: number, track = true) => {
    ctx.globalCompositeOperation = "destination-out";
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, "rgba(0,0,0,1)");
    g.addColorStop(0.65, "rgba(0,0,0,0.95)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
    if (!track) return;
    mark(x, y, r);
    if (Math.random() < 0.05) {
      drips.push({
        x: x + rnd(-r * 0.5, r * 0.5),
        y: y + r * 0.55,
        v: rnd(0.6, 1.6) * dpr,
        life: rnd(40, 140),
      });
    }
  };
  const wipe = (from: [number, number], to: [number, number], r: number) => {
    const n = Math.max(1, Math.ceil(Math.hypot(to[0] - from[0], to[1] - from[1]) / (r / 3)));
    for (let i = 1; i <= n; i++) {
      dab(from[0] + ((to[0] - from[0]) * i) / n, from[1] + ((to[1] - from[1]) * i) / n, r);
    }
  };
  // The initials, fingered into the fog
  const off = document.createElement("canvas");
  off.width = w;
  off.height = h;
  const o = off.getContext("2d")!;
  o.font = `${Math.min(w * 0.2, h * 0.1)}px ${kit.faces.latinHand}`;
  o.textAlign = "center";
  o.textBaseline = "middle";
  o.lineWidth = 5 * dpr;
  o.lineJoin = "round";
  o.strokeStyle = "#000";
  o.strokeText(
    initials.second ? `${initials.first} & ${initials.second}` : initials.first,
    w / 2,
    h * 0.3,
  );

  const hint = document.createElement("div");
  hint.className = "prelude-hint";
  hint.innerHTML = '<span class="prelude-finger"></span>';
  kit.fx.append(hint);
  cv.style.pointerEvents = "auto";
  cv.style.touchAction = "none";
  let last: [number, number] | null = null;
  let touched = false;
  const userR = w * 0.11;
  const pos = (e: PointerEvent): [number, number] => {
    const r = cv.getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * w, ((e.clientY - r.top) / r.height) * h];
  };
  cv.onpointerdown = (e) => {
    touched = true;
    hint.classList.remove("prelude-in");
    last = pos(e);
    dab(last[0], last[1], userR);
    cv.setPointerCapture?.(e.pointerId);
  };
  cv.onpointermove = (e) => {
    if (!last) return;
    const p = pos(e);
    wipe(last, p, userR);
    last = p;
  };
  cv.onpointerup = cv.onpointercancel = () => {
    last = null;
  };
  let written = 0;
  let auto: [number, number] | null = null;
  let done = false;
  let doneAt = 0;
  await loop(kit, (t) => {
    if (t > 0.3 && written < w) {
      const next = w * clamp((t - 0.3) / 1.3, 0, 1);
      ctx.save();
      ctx.beginPath();
      ctx.rect(written, 0, next - written, h);
      ctx.clip();
      ctx.globalCompositeOperation = "destination-out";
      ctx.drawImage(off, 0, 0);
      ctx.restore();
      written = next;
    }
    if (t > 1.9 && !touched && !auto) hint.classList.add("prelude-in");
    if (!touched && t > 3.4 && !done) {
      const s = clamp((t - 3.4) / 2.6, 0, 1);
      const row = s * 5;
      const along = Math.floor(row) % 2 ? 1 - (row % 1) : row % 1;
      const p: [number, number] = [
        w * (0.1 + 0.8 * along),
        h * (0.14 + 0.16 * Math.min(row, 4.99)),
      ];
      hint.classList.remove("prelude-in");
      if (auto) wipe(auto, p, w * 0.13);
      auto = p;
    }
    for (let i = drips.length - 1; i >= 0; i--) {
      const d = drips[i]!;
      d.y += d.v;
      d.life--;
      dab(d.x, d.y, 2.4 * dpr, false);
      if (d.life <= 0) drips.splice(i, 1);
    }
    const share = cleared / (GX * GY);
    if (!done) blur(12 * Math.max(0, 1 - share / NEED));
    if (!done && share >= NEED) {
      done = true;
      doneAt = t;
      hint.remove();
      blur(0);
      kit.reveal();
    }
    return !done || t - doneAt < 1.1;
  });
}

/* 7. Mehendi: a henna mandala draws itself, the couple's initials hidden at its heart */
async function mehendi(kit: SceneKit) {
  const { ctx, w, h, dpr, colors: c, initials } = kit;
  await fontsReady([`40px ${kit.faces.latinHand}`]);
  const cx = w / 2;
  const cy = h * 0.45;
  const R = Math.min(w * 0.4, h * 0.26);
  const k = pick([8, 10, 12]);
  const curl = pick([-1, 1]);
  type Stroke = [number, number][];
  const strokes: Stroke[] = [];
  const circle = (r: number, n = 90): Stroke =>
    Array.from({ length: n + 1 }, (_, i) => {
      const a = (i / n) * TAU;
      return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
    });
  const polar = (r: number, a: number): [number, number] => [
    cx + Math.cos(a) * r,
    cy + Math.sin(a) * r,
  ];
  strokes.push(circle(R * 0.17), circle(R * 0.2));
  // Inner petals
  for (let i = 0; i < k; i++) {
    const a0 = (i / k) * TAU;
    const petal: Stroke = [];
    for (let s = 0; s <= 20; s++) {
      const t = s / 20;
      petal.push(polar(R * (0.2 + t * 0.25), a0 - Math.sin(Math.PI * t) * (Math.PI / k) * 0.8));
    }
    for (let s = 20; s >= 0; s--) {
      const t = s / 20;
      petal.push(polar(R * (0.2 + t * 0.25), a0 + Math.sin(Math.PI * t) * (Math.PI / k) * 0.8));
    }
    strokes.push(petal);
    strokes.push([polar(R * 0.23, a0), polar(R * 0.4, a0)]);
  }
  // A scalloped ring and a ring of dots
  strokes.push(
    Array.from({ length: 241 }, (_, i) => {
      const a = (i / 240) * TAU;
      return polar(R * (0.5 + 0.035 * Math.abs(Math.sin(k * a))), a);
    }),
  );
  for (let i = 0; i < k * 3; i++) {
    const [x, y] = polar(R * 0.57, (i / (k * 3)) * TAU);
    strokes.push(
      Array.from({ length: 9 }, (_, j) => {
        const a = (j / 8) * TAU;
        return [x + Math.cos(a) * 1.4 * dpr, y + Math.sin(a) * 1.4 * dpr] as [number, number];
      }),
    );
  }
  // Paisleys, each curling the same way, with a vein and three dots
  for (let i = 0; i < k; i++) {
    const a0 = ((i + 0.5) / k) * TAU;
    const paisley: Stroke = [];
    const width = (Math.PI / k) * 0.85;
    for (let s = 0; s <= 24; s++) {
      const t = s / 24;
      paisley.push(
        polar(
          R * (0.62 + t * 0.34),
          a0 + curl * t * t * 0.28 - Math.pow(Math.sin(Math.PI * t), 0.8) * width,
        ),
      );
    }
    for (let s = 24; s >= 0; s--) {
      const t = s / 24;
      paisley.push(
        polar(
          R * (0.62 + t * 0.34),
          a0 + curl * t * t * 0.28 + Math.pow(Math.sin(Math.PI * t), 0.8) * width * 0.6,
        ),
      );
    }
    strokes.push(paisley);
    strokes.push(
      Array.from({ length: 13 }, (_, s) => {
        const t = s / 12;
        return polar(R * (0.66 + t * 0.24), a0 + curl * t * t * 0.24);
      }),
    );
  }
  strokes.push(
    Array.from({ length: 361 }, (_, i) => {
      const a = (i / 360) * TAU;
      return polar(R * (1.02 + 0.03 * Math.sin(k * 2 * a)), a);
    }),
  );
  // Every stroke's segments in drawing order, with how far along the whole design each ends
  const segments: { a: [number, number]; b: [number, number]; at: number }[] = [];
  let total = 0;
  for (const stroke of strokes) {
    for (let i = 1; i < stroke.length; i++) {
      const a = stroke[i - 1]!;
      const b = stroke[i]!;
      total += Math.hypot(b[0] - a[0], b[1] - a[1]);
      segments.push({ a, b, at: total });
    }
  }
  // Warm skin under the henna, soft at its edge
  const ground = ctx.createRadialGradient(cx, cy, R * 0.3, cx, cy, R * 1.35);
  ground.addColorStop(0, alpha(c.skin, 0.96));
  ground.addColorStop(0.75, alpha(c.skin, 0.9));
  ground.addColorStop(1, alpha(c.skin, 0));
  const top = overlayCanvas(kit);
  const DRAW = 3.4;
  let next = 0;
  let revealed = false;
  await loop(kit, (t) => {
    if (t < 0.6) {
      ctx.clearRect(0, 0, w, h);
      ctx.globalAlpha = t / 0.6;
      ctx.fillStyle = ground;
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;
      return true;
    }
    if (next === 0) {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = ground;
      ctx.fillRect(0, 0, w, h);
    }
    const reach = easeInOut(clamp((t - 0.6) / DRAW, 0, 1)) * total;
    ctx.strokeStyle = c.henna;
    ctx.lineWidth = 1.7 * dpr;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    let pen: [number, number] | null = null;
    while (next < segments.length && segments[next]!.at <= reach) {
      const s = segments[next++]!;
      ctx.moveTo(s.a[0], s.a[1]);
      ctx.lineTo(s.b[0], s.b[1]);
      pen = s.b;
    }
    ctx.stroke();
    top.clearRect(0, 0, w, h);
    if (pen && reach < total) {
      top.fillStyle = c.henna;
      top.beginPath();
      top.arc(pen[0], pen[1], 3 * dpr, 0, TAU);
      top.fill();
    }
    const shown = clamp((t - 0.6 - DRAW) / 0.7, 0, 1);
    if (shown > 0) {
      top.globalAlpha = shown;
      top.fillStyle = c.henna;
      top.textAlign = "center";
      top.textBaseline = "middle";
      top.font = `${R * 0.2}px ${kit.faces.latinHand}`;
      top.fillText(
        initials.second ? `${initials.first} & ${initials.second}` : initials.first,
        cx,
        cy,
      );
      top.globalAlpha = 1;
    }
    if (t > 0.6 + DRAW + 1.6 && !revealed) {
      revealed = true;
      kit.reveal();
    }
    return t < 0.6 + DRAW + 2.6;
  });
}

/* 8. Peacock fan: the feathers open one by one into a shimmering fan, then it rises away */
async function peacock(kit: SceneKit) {
  const { ctx, w, h, dpr, colors: c } = kit;
  const ox = w / 2;
  const oy = h * 0.8;
  const L = Math.min(h * 0.6, w * 0.95);
  const count = kit.lite ? 15 : 23;
  const spread = rnd(1.25, 1.45);
  const order = pick(["middle", "left", "right"] as const);
  const mid = (count - 1) / 2;
  const delay = (i: number) =>
    order === "middle" ? Math.abs(i - mid) * 0.045 : (order === "left" ? i : count - 1 - i) * 0.035;
  const feather = (angle: number, length: number, shimmer: number, a: number) => {
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);
    const tip: [number, number] = [ox + dx * length, oy + dy * length];
    ctx.globalAlpha = a;
    // The quill
    ctx.strokeStyle = alpha(c.gold, 0.8);
    ctx.lineWidth = 1.1 * dpr;
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.lineTo(tip[0], tip[1]);
    ctx.stroke();
    // The fronds, a soft green vane
    ctx.save();
    ctx.translate(ox + dx * length * 0.62, oy + dy * length * 0.62);
    ctx.rotate(angle);
    ctx.fillStyle = alpha(c.green, 0.45);
    ctx.beginPath();
    ctx.ellipse(0, 0, length * 0.36, length * 0.055, 0, 0, TAU);
    ctx.fill();
    ctx.restore();
    // The eye
    ctx.save();
    ctx.translate(ox + dx * length * 0.88, oy + dy * length * 0.88);
    ctx.rotate(angle);
    const e = length * 0.085;
    const rings: [string, number][] = [
      [c.green, 1],
      [c.gold, 0.8],
      [alpha(c.teal, 0.75 + 0.25 * shimmer), 0.62],
      [c.blue, 0.42],
      [c.night, 0.2],
    ];
    for (const [color, r] of rings) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(0, 0, e * 1.3 * r, e * r, 0, 0, TAU);
      ctx.fill();
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  };
  let revealed = false;
  const RISE = 3.7;
  await loop(kit, (t) => {
    ctx.clearRect(0, 0, w, h);
    const away = clamp((t - RISE) / 1.1, 0, 1);
    if (away > 0 && !revealed) {
      revealed = true;
      kit.reveal();
    }
    ctx.save();
    ctx.translate(0, -away * h * 0.15);
    const glow = ctx.createRadialGradient(ox, oy, 0, ox, oy, L);
    glow.addColorStop(0, alpha(c.teal, 0.25));
    glow.addColorStop(1, alpha(c.teal, 0));
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);
    for (const layer of [0.72, 1]) {
      for (let i = 0; i < count; i++) {
        const open = easeOut(clamp((t - 0.2 - delay(i) - (layer < 1 ? 0.25 : 0)) / 1.4, 0, 1));
        if (open <= 0) continue;
        const shift = layer < 1 ? 0.5 : 0;
        const angle = -Math.PI / 2 + ((i + shift) / (count - 1) - 0.5) * 2 * spread * open;
        feather(
          angle,
          L * layer * (0.55 + 0.45 * open),
          Math.sin(t * 4 + i),
          (1 - away) * Math.min(1, open * 2),
        );
      }
    }
    ctx.restore();
    return away < 1;
  });
}

/* 9. Floating diyas: lamps drift in on dark water, gather, and their light rises */
async function diyas(kit: SceneKit) {
  const { ctx, w, h, dpr, colors: c } = kit;
  const horizon = h * 0.56;
  const count = kit.lite ? 7 : 11;
  const mid = (count - 1) / 2;
  const shape = pick(["vee", "arc", "row"] as const);
  const lamps = Array.from({ length: count }, (_, i) => {
    const side = i < mid ? -1 : i > mid ? 1 : Math.random() < 0.5 ? -1 : 1;
    const off = (i - mid) / Math.max(1, mid);
    const ty =
      shape === "vee"
        ? horizon + h * (0.08 + Math.abs(off) * 0.12)
        : shape === "arc"
          ? horizon + h * (0.2 - Math.abs(off) * 0.1)
          : horizon + h * (0.14 + (i % 2) * 0.05);
    const depth = (ty - horizon) / (h - horizon);
    return {
      sx: w / 2 + side * w * rnd(0.6, 0.9),
      sy: horizon + rnd(0.1, 0.9) * (h - horizon),
      tx: w / 2 + off * w * 0.38,
      ty,
      s: (0.55 + depth * 0.9) * dpr,
      d: rnd(0, 0.6),
      ph: rnd(0, TAU),
    };
  });
  const ripples = Array.from({ length: kit.lite ? 30 : 60 }, () => ({
    x: rnd(0, w),
    y: rnd(horizon, h),
    l: rnd(10, 40) * dpr,
    ph: rnd(0, TAU),
  }));
  const lamp = (x: number, y: number, s: number, flicker: number, flare: number) => {
    const fy = y - 9 * s;
    const g = ctx.createRadialGradient(x, fy, 0, x, fy, (26 + flare * 40) * s);
    g.addColorStop(0, alpha(c.glint, 0.9));
    g.addColorStop(0.3, alpha(c.marigold, 0.45));
    g.addColorStop(1, alpha(c.marigold, 0));
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, fy, (26 + flare * 40) * s, 0, TAU);
    ctx.fill();
    // The reflection, broken by the water
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = c.marigold;
    for (let k = 0; k < 4; k++) {
      ctx.fillRect(
        x - (6 - k) * s + Math.sin(flicker + k) * 2 * s,
        y + (4 + k * 5) * s,
        (12 - k * 2) * s,
        1.6 * s,
      );
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    // The clay bowl
    ctx.fillStyle = c.clay;
    ctx.beginPath();
    ctx.ellipse(x, y, 11 * s, 5 * s, 0, 0, Math.PI);
    ctx.fill();
    ctx.fillStyle = alpha(c.gold, 0.9);
    ctx.fillRect(x - 11 * s, y - 0.8 * s, 22 * s, 1.6 * s);
    // The flame
    ctx.fillStyle = c.glint;
    ctx.beginPath();
    ctx.moveTo(x, fy - (7 + Math.sin(flicker * 3) * 1.2) * s);
    ctx.quadraticCurveTo(x + 4 * s, fy + 2 * s, x, fy + 4 * s);
    ctx.quadraticCurveTo(x - 4 * s, fy + 2 * s, x, fy - (7 + Math.sin(flicker * 3) * 1.2) * s);
    ctx.fill();
  };
  const GATHER = 2.8;
  let revealed = false;
  await loop(kit, (t) => {
    ctx.clearRect(0, 0, w, h);
    const water = ctx.createLinearGradient(0, horizon - h * 0.05, 0, h);
    water.addColorStop(0, alpha(c.water, 0));
    water.addColorStop(0.12, alpha(c.water, 0.75));
    water.addColorStop(1, alpha(c.water, 0.92));
    ctx.fillStyle = water;
    ctx.fillRect(0, horizon - h * 0.05, w, h);
    ctx.strokeStyle = alpha(c.glint, 0.12);
    ctx.lineWidth = 1 * dpr;
    for (const r of ripples) {
      const x = (r.x + t * 8 * dpr + Math.sin(t + r.ph) * 6 * dpr) % (w + r.l);
      ctx.beginPath();
      ctx.moveTo(x - r.l, r.y);
      ctx.lineTo(x, r.y);
      ctx.stroke();
    }
    const flare = clamp((t - GATHER - 0.4) / 0.8, 0, 1);
    for (const l of lamps) {
      const q = easeOut(clamp((t - l.d) / GATHER, 0, 1));
      const x = l.sx + (l.tx - l.sx) * q;
      const y = l.sy + (l.ty - l.sy) * q + Math.sin(t * 1.6 + l.ph) * 2 * dpr;
      lamp(x, y, l.s, t * 2 + l.ph, flare);
    }
    if (flare > 0) {
      const rise = h * (0.6 - flare * 0.35);
      const g = ctx.createRadialGradient(w / 2, rise, 0, w / 2, rise, Math.max(w, h) * 0.7);
      g.addColorStop(0, alpha(c.glint, 0.55 * flare));
      g.addColorStop(1, alpha(c.marigold, 0));
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";
    }
    if (flare > 0.4 && !revealed) {
      revealed = true;
      kit.reveal();
    }
    return t < GATHER + 2;
  });
}

/* 10. Fireworks: bursts light the sky, then two of them spell the couple's initials */
async function fireworks(kit: SceneKit) {
  const { ctx, w, h, dpr, colors: c, initials } = kit;
  await fontsReady([`40px ${kit.faces.display}`]);
  const shades = [c.glint, c.marigold, c.accent, c.teal, c.light, c.ivory];
  type Spark = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    fade: number;
    c: string;
    // A spark that draws a letter flies to its place, holds, then falls
    from?: [number, number];
    to?: [number, number];
    born?: number;
  };
  type Rocket = { x: number; y: number; at: number; letter?: string; done: boolean };
  const sparks: Spark[] = [];
  const pair = Boolean(initials.second);
  const letters = pair
    ? [
        { letter: initials.first, x: w * 0.3 },
        { letter: initials.second, x: w * 0.7 },
      ]
    : [{ letter: initials.first, x: w / 2 }];
  const rockets: Rocket[] = [
    { x: w * rnd(0.2, 0.4), y: h * rnd(0.15, 0.3), at: 0.1, done: false },
    { x: w * rnd(0.6, 0.85), y: h * rnd(0.12, 0.28), at: 0.6, done: false },
    { x: w * rnd(0.35, 0.65), y: h * rnd(0.2, 0.35), at: 1.1, done: false },
    ...letters.map((l, i) => ({
      x: l.x,
      y: h * 0.33,
      at: 1.7 + i * 0.45,
      letter: l.letter,
      done: false,
    })),
    { x: w / 2, y: h * 0.28, at: 3.9, done: false },
  ];
  const size = Math.min(w * (pair ? 0.36 : 0.5), h * 0.22);
  const burst = (r: Rocket, t: number) => {
    const color = pick(shades);
    if (r.letter) {
      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const o = off.getContext("2d", { willReadFrequently: true })!;
      o.font = `${size}px ${kit.faces.display}`;
      o.textAlign = "center";
      o.textBaseline = "middle";
      o.fillText(r.letter, r.x, r.y);
      const data = o.getImageData(0, 0, w, h).data;
      const step = Math.max(3, Math.round(3 * dpr));
      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          if (data[(y * w + x) * 4 + 3]! > 140) {
            sparks.push({
              x: r.x,
              y: r.y,
              vx: 0,
              vy: 0,
              life: 1,
              fade: 0,
              c: color,
              from: [r.x, r.y],
              to: [x, y],
              born: t,
            });
          }
        }
      }
      return;
    }
    const n = kit.lite ? 50 : 90;
    const big = r.at > 3.5 ? 1.6 : 1;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU + rnd(-0.05, 0.05);
      const sp = rnd(2.2, 4.2) * dpr * big;
      sparks.push({
        x: r.x,
        y: r.y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        life: 1,
        fade: rnd(0.012, 0.02),
        c: color,
      });
    }
  };
  let revealed = false;
  await loop(kit, (t) => {
    // Older light fades a little each frame, leaving short trails
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0,0,0,0.22)";
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = "lighter";
    for (const r of rockets) {
      if (r.done || t < r.at) continue;
      const q = clamp((t - r.at) / 0.6, 0, 1);
      const y = h + (r.y - h) * easeOut(q);
      ctx.fillStyle = c.glint;
      ctx.fillRect(r.x - dpr, y, 2 * dpr, 6 * dpr);
      if (q >= 1) {
        r.done = true;
        burst(r, t);
      }
    }
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i]!;
      if (s.to && s.from && s.born !== undefined) {
        const age = t - s.born;
        if (age < 0.7) {
          const q = easeOut(age / 0.7);
          s.x = s.from[0] + (s.to[0] - s.from[0]) * q;
          s.y = s.from[1] + (s.to[1] - s.from[1]) * q;
        } else if (age > 1.9) {
          s.vy += 0.05 * dpr;
          s.y += s.vy;
          s.life -= 0.03;
        }
        ctx.globalAlpha = Math.max(0, s.life) * (0.75 + 0.25 * Math.sin(t * 20 + i));
      } else {
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.97;
        s.vy = s.vy * 0.97 + 0.045 * dpr;
        s.life -= s.fade;
        ctx.globalAlpha = Math.max(0, s.life);
      }
      if (s.life <= 0) {
        sparks.splice(i, 1);
        continue;
      }
      ctx.fillStyle = s.c;
      ctx.fillRect(s.x, s.y, 2 * dpr, 2 * dpr);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    if (t > 4.6 && !revealed) {
      revealed = true;
      kit.reveal();
    }
    return t < 5.6;
  });
}

export const SCENES: Record<Prelude, (kit: SceneKit) => Promise<void>> = {
  rangoli,
  thread,
  letter,
  kolam,
  gold,
  mist,
  mehendi,
  peacock,
  diyas,
  fireworks,
};
