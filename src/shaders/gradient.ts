export const gradientVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const gradientFragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;

  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uAccent;
  uniform float uTime;

  // cheap hash noise for grain
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  void main() {
    vec2 uv = vUv;

    // diagonal base gradient
    float d = clamp((uv.x + uv.y) * 0.5, 0.0, 1.0);
    vec3 col = mix(uColorA, uColorB, smoothstep(0.0, 1.0, d));

    // two slow-moving radial glows for an aurora feel
    vec2 c1 = vec2(0.35 + 0.12 * sin(uTime * 0.18), 0.45 + 0.10 * cos(uTime * 0.13));
    vec2 c2 = vec2(0.70 + 0.10 * cos(uTime * 0.11), 0.65 + 0.12 * sin(uTime * 0.21));
    float g1 = smoothstep(0.55, 0.0, distance(uv, c1));
    float g2 = smoothstep(0.60, 0.0, distance(uv, c2));
    col += uAccent * g1 * 0.45;
    col = mix(col, uColorB, g2 * 0.35);

    // deep vignette: edges fall to near-black for a premium void, lit core
    float vig = smoothstep(1.28, 0.12, distance(uv, vec2(0.5)));
    col *= mix(0.05, 0.9, vig);

    // overall richness pull-down so emissive elements read against the bg
    col *= 0.82;

    // subtle film grain to kill banding
    float grain = (hash(uv * 800.0 + uTime) - 0.5) * 0.035;
    col += grain;

    gl_FragColor = vec4(col, 1.0);
  }
`;
