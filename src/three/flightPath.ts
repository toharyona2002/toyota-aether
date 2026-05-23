import * as THREE from "three";
import { sections, FIRST_Z } from "../data/sections";

// lead-in point in front of the first station so we approach it, then weave through
const startPoint = new THREE.Vector3(0, 0, FIRST_Z);
const waypoints = [
  startPoint,
  ...sections.map((s) => new THREE.Vector3(s.x, s.y, s.z)),
];

export const flightCurve = new THREE.CatmullRomCurve3(
  waypoints,
  false,
  "catmullrom",
  0.5,
);

// Find the curve parameter u (0..1) where the flight passes each station,
// so DOM content timing stays locked to the 3D fly-through.
const SAMPLES = 900;
const sampled: THREE.Vector3[] = [];
for (let i = 0; i <= SAMPLES; i++) {
  sampled.push(flightCurve.getPointAt(i / SAMPLES));
}

export const stationU: number[] = sections.map((s) => {
  const target = new THREE.Vector3(s.x, s.y, s.z);
  let bestU = 0;
  let bestD = Infinity;
  for (let i = 0; i <= SAMPLES; i++) {
    const d = sampled[i].distanceToSquared(target);
    if (d < bestD) {
      bestD = d;
      bestU = i / SAMPLES;
    }
  }
  return bestU;
});

export function nearestStation(progress: number): number {
  let best = 0;
  let bestD = Infinity;
  for (let i = 0; i < stationU.length; i++) {
    const d = Math.abs(progress - stationU[i]);
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  return best;
}

// shared, ref-free flight state written by CameraRig and read by the FX layer
export const flight = { speed: 0, roll: 0 };
