/*
 * The small gilt flower that stands wherever a design once set the couple's initials (a
 * wax seal, a monogram, a door, an empty photo frame): eight open petals round a dot. The
 * same drawing in SVG (flower-mark.tsx) and on a canvas (the 3D card and the video).
 */

/** The petals and the dot, in a -20..20 box, for SVG. */
export const FLOWER_PETALS = Array.from({ length: 8 }, (_, i) => i * 45);

/** Draws the flower centred on (x, y), `size` across, in one colour. */
export function drawFlower(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  colour: string,
) {
  const r = size / 2;
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = colour;
  ctx.fillStyle = colour;
  ctx.lineWidth = r * 0.07;
  for (let petal = 0; petal < 8; petal++) {
    ctx.beginPath();
    ctx.ellipse(0, -r * 0.45, r * 0.18, r * 0.37, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.rotate(Math.PI / 4);
  }
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.17, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
