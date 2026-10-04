import { constants, noise, heightFetch, lighting, overlay } from './common.glsl.js'

export const oceanVertex = /* glsl */ `
${constants}
out vec3 vWorld;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`

export const oceanFragment = /* glsl */ `
${constants}
${noise}
${heightFetch}
${lighting}
${overlay}
uniform vec3 uCamPos;
uniform vec2 uWind;        // direction the wind blows toward, scaled by strength (0..1+)
uniform vec2 uSwellDir;    // direction swell travels
uniform float uSwell;      // swell height factor
uniform vec3 uHorizonColor;
uniform vec3 uZenithColor;
uniform int uDebug;
uniform sampler2D uSea;    // r: pond mask, g: river plume, b: reef rock, a: distance to land (0..1 over 300 m)
in vec3 vWorld;

float seaDepth(vec2 xz) {
  vec2 uv = worldToUv(xz);
  if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) return 3000.0;
  return -metresAt(xz);
}

// Sea-surface slope (dh/dx, dh/dz): a few long swells, plus wind chop made of
// drifting noise so the near water never turns into a regular grating.
vec2 noiseGrad(vec2 p) {
  const float e = 0.25;
  return vec2(vnoise(p + vec2(e, 0.0)) - vnoise(p - vec2(e, 0.0)), vnoise(p + vec2(0.0, e)) - vnoise(p - vec2(0.0, e))) / (2.0 * e);
}
vec2 waveSlope(vec2 p, float t, float detail) {
  vec2 d0 = normalize(uWind + vec2(1e-3));
  vec2 sw = normalize(uSwellDir + vec2(1e-3));
  vec2 grad = vec2(0.0);
  // swell
  float amp = 0.006;
  float k = 2.2;
  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    float ang = (hash12(vec2(fi, 1.7)) - 0.5) * 0.7;
    vec2 d = vec2(sw.x * cos(ang) - sw.y * sin(ang), sw.x * sin(ang) + sw.y * cos(ang));
    float w = sqrt(9.8 * k * 100.0) * 0.01;
    float ph = dot(d, p) * k - t * w + hash12(vec2(fi, 4.2)) * 6.28;
    float fade = 1.0 - smoothstep(0.12, 0.45, detail * k / 6.283);
    grad += d * cos(ph) * amp * k * fade;
    amp *= 0.7;
    k *= 1.45;
  }
  // chop: rotated, drifting octaves of noise
  float a = 0.5;
  float f = 1.6;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  vec2 q = p;
  for (int i = 0; i < 5; i++) {
    float fade = 1.0 - smoothstep(0.08, 0.35, detail * f);
    grad += noiseGrad(q * f + d0 * t * (0.25 + 0.12 * float(i))) * a * 0.022 * f * fade;
    q = rot * q;
    a *= 0.62;
    f *= 2.1;
  }
  return grad;
}

void main() {
  vec2 xz = vWorld.xz;
  float depth = seaDepth(xz);
  if (depth < -0.05) discard; // land pokes through
  vec3 V = normalize(uCamPos - vWorld);
  float dist = length(uCamPos - vWorld);
  float px = length(fwidth(xz)); // world size of a pixel
  vec4 sea = texture(uSea, worldToUv(xz));

  float calm = mix(1.0, 0.18, sea.r); // fishponds are glassy
  vec2 g = waveSlope(xz, uTime, px) * (0.55 + 0.6 * length(uWind)) * calm;
  // shoaling: steeper chop over the reef flat
  g *= 1.0 + 0.6 * (1.0 - smoothstep(0.5, 6.0, depth));
  vec3 N = normalize(vec3(-g.x, 1.0, -g.y));

  // --- what's under the surface ------------------------------------------
  float fb = fbm2(xz * 1.7);
  vec3 sandC = vec3(0.80, 0.72, 0.55);
  vec3 reefC = mix(vec3(0.30, 0.27, 0.20), vec3(0.42, 0.30, 0.34), fbm2(xz * 4.0 + 7.0));
  float reef = smoothstep(0.45, 0.62, fb) * (1.0 - smoothstep(4.0, 14.0, depth)) + sea.b * 0.6;
  vec3 bed = mix(sandC, reefC, clamp(reef, 0.0, 1.0));
  bed = mix(bed, vec3(0.20, 0.24, 0.16), sea.r * 0.6); // algae-rich pond floor
  // light reaching the bed: through the water twice
  vec3 absorb = vec3(0.46, 0.105, 0.055);
  float vis = sunVisibility(vec3(vWorld.x, 0.0, vWorld.z));
  vec3 light = uSunColor * max(uSunDir.y, 0.0) * vis + uSkyColor * 0.8 + uMoonColor * 0.3;
  // caustics in the shallows
  vec2 cp = xz * 70.0;
  float ca = voronoi(cp + vec2(uTime * 0.9, uTime * 0.6)).x;
  float cb = voronoi(cp * 1.31 - vec2(uTime * 0.7, -uTime * 0.5)).x;
  float caust = pow(1.0 - min(ca, cb), 6.0) * 1.6 * (1.0 - smoothstep(1.0, 8.0, depth)) * (1.0 - smoothstep(0.003, 0.012, px));
  vec3 under = bed * light * (1.0 + caust * vis) * exp(-absorb * depth * 2.0);
  vec3 amb = uSkyColor * 1.6 + uSunColor * max(uSunDir.y, 0.0) * vis;
  vec3 deepC = vec3(0.004, 0.030, 0.075) * amb;
  vec3 turq = vec3(0.03, 0.20, 0.21) * amb;
  float scatter = 1.0 - exp(-depth * 0.3);
  vec3 body = mix(turq, deepC, smoothstep(5.0, 45.0, depth));
  vec3 water = under + body * scatter;
  // fishponds: brackish, green and murky with algae
  water = mix(water, vec3(0.035, 0.085, 0.045) * amb * 1.2, sea.r * 0.8);
  // a brown plume off the stream mouths after rain
  water = mix(water, vec3(0.16, 0.12, 0.07) * light, sea.g * 0.75);

  // --- the surface ---------------------------------------------------------
  float cosT = max(dot(N, V), 0.0);
  float F = 0.02 + 0.98 * pow(1.0 - cosT, 5.0);
  vec3 R = reflect(-V, N);
  R.y = abs(R.y);
  vec3 refl = skyMap(R);
  vec3 H = normalize(uSunDir + V);
  float spec = pow(max(dot(N, H), 0.0), 900.0) * 60.0 + pow(max(dot(N, H), 0.0), 90.0) * 0.6;
  vec3 col = mix(water, refl, F) + uSunColor * spec * vis * step(0.0, uSunDir.y);

  // --- foam ------------------------------------------------------------------
  // shoreline swash
  float shore = (1.0 - smoothstep(0.0, 0.25, sea.a)) * (1.0 - smoothstep(0.1, 1.2, depth));
  float swash = 0.5 + 0.5 * sin(depth * 9.0 - uTime * 1.6 + fbm2(xz * 3.0) * 4.0);
  // breakers on the reef crest: shallow water with deep water just seaward
  float e = 0.6;
  float dX = seaDepth(xz + vec2(e, 0.0)) - seaDepth(xz - vec2(e, 0.0));
  float dZ = seaDepth(xz + vec2(0.0, e)) - seaDepth(xz - vec2(0.0, e));
  float drop = length(vec2(dX, dZ)) / (2.0 * e);
  float crest = smoothstep(4.0, 14.0, drop) * (1.0 - smoothstep(0.6, 3.5, depth)) * (1.0 - sea.r);
  vec2 sd = normalize(uSwellDir + 1e-4);
  float sets = 0.5 + 0.5 * sin(dot(xz, sd) * 2.2 - uTime * 0.9 + fbm2(xz * 0.8) * 5.0);
  float breakers = crest * (0.35 + 0.65 * smoothstep(0.4, 0.9, sets)) * (0.6 + uSwell);
  float foamTex = smoothstep(0.35, 0.75, fbm2(xz * 9.0 + vec2(uTime * 0.3, 0.0)));
  // whitecaps when the trades are up
  float caps = smoothstep(0.78, 0.92, fbm2(xz * 0.9 + uWind * uTime * 0.06)) * smoothstep(0.55, 1.1, length(uWind)) * smoothstep(20.0, 60.0, depth);
  float foam = max(max(shore * swash * 0.9, breakers), caps * 0.5) * mix(1.0, foamTex, 0.5);
  vec3 foamC = vec3(0.92) * (uSunColor * max(uSunDir.y, 0.0) * vis + uSkyColor * 1.4);
  col = mix(col, foamC, clamp(foam, 0.0, 1.0));

  col = applyOverlay(col, xz, px, 1.0, (uSunColor * max(uSunDir.y, 0.0) * vis + uSkyColor) * 0.5);

  // soft meeting with the sand
  float alpha = smoothstep(-0.02, 0.35, depth);
  if (uDebug == 1) { col = vec3(depth / 10.0, fract(depth), 0.0); alpha = 1.0; }
  if (uDebug == 2) { col = sea.rgb + vec3(0.0, 0.0, sea.a); alpha = 1.0; }
  if (uDebug == 3) { col = water; }
  gl_FragColor = vec4(col, alpha);
}
`
