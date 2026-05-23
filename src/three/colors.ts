import * as THREE from "three";
import { sections } from "../data/sections";

const colorsA = sections.map((s) => new THREE.Color(s.colorA));
const colorsB = sections.map((s) => new THREE.Color(s.colorB));

const last = sections.length - 1;

// Interpolate the section gradient stops by global scroll progress (0..1).
export function sampleColors(
  progress: number,
  outA: THREE.Color,
  outB: THREE.Color,
) {
  const t = THREE.MathUtils.clamp(progress, 0, 1) * last;
  const i = Math.min(Math.floor(t), last - 1);
  const f = t - i;
  outA.copy(colorsA[i]).lerp(colorsA[i + 1], f);
  outB.copy(colorsB[i]).lerp(colorsB[i + 1], f);
}
