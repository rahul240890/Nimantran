import * as THREE from "three";

/**
 * Additive light that leaves the canvas's alpha alone. The canvas is transparent over the
 * page, so plain additive blending would also raise alpha and grey out the page behind a
 * glow; this adds only colour, so halos brighten whatever is underneath.
 */
export function glowBlending(material: THREE.Material): THREE.Material {
  material.blending = THREE.CustomBlending;
  material.blendEquation = THREE.AddEquation;
  material.blendSrc = THREE.SrcAlphaFactor;
  material.blendDst = THREE.OneFactor;
  material.blendSrcAlpha = THREE.ZeroFactor;
  material.blendDstAlpha = THREE.OneFactor;
  return material;
}
