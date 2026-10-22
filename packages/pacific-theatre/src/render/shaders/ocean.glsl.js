// The sea of a battle box, from ahupuaʻa's ocean.glsl.js by way of
// holo-i-ke-au's (b480c27): depth colour from the ground under it, the sky in
// its surface, sun glint, chop that fades out with distance so the far field
// reads as a smooth sea to the horizon, swash at the shore and whitecaps in
// the wind.
//
// Adapted for a box in metres (ENGINEERING §7; R9 §2.10). Every frequency,
// wavelength and pixel threshold inside is still written in the Hawaiian 100 m
// units, which were tuned by eye; main() turns the world position into them
// once (xz = vWorld.xz · uUnitM / 100), the pixel width with it, so nothing in the
// tuning moved. The ground is read in world units through groundMetres()
// (shaders/ground.glsl.js), and depths stay metres. The wind and swell come
// from battle.json's weather (ocean.js setWeather); the point lights (star
// shells, searchlights, gun flashes) glint in it as the sun does. It includes
// the four log-depth chunks; polygonOffset, which the Hawaiian sea leaned
// on, does nothing under the logarithmic depth buffer, and the terrain's sea
// bed is sunk well below the water instead. The fishponds and the patches'
// reef flats of the Hawaiian sea answer zero from the single-pack ground.
// The engine adds the record's sea state and swell (uSeaK, uSwellK).

import { constants, noise, lighting } from './common.glsl.js'
import { world, ground } from './ground.glsl.js'
import { logDepthParsVertex, logDepthVertex, logDepthParsFragment, logDepthFragment } from './logdepth.glsl.js'

export const oceanVertex = /* glsl */ `
${logDepthParsVertex}
out vec3 vWorld;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
  ${logDepthVertex}
}
`

export const oceanFragment = /* glsl */ `
${constants}
${noise}
${world}
${ground}
${lighting}
${logDepthParsFragment}
uniform vec3 uCamPos;
uniform float uUnitM;      // metres per world unit (1 in a box): the Hawaiian tuning is in 100 m units
uniform vec2 uWind;        // direction the wind blows toward, scaled by strength (0..1+)
uniform vec2 uSwellDir;    // direction the swell travels
uniform float uSeaK;       // the record's sea state as a scale on the chop and the whitecaps (1 near sea 2–3)
uniform float uSwellK;     // the record's swell as a scale on the long waves
uniform int uDebug;
in vec3 vWorld;

float seaDepth(vec2 xz) { return -groundMetres(xz); }

// a mottle fixed to the ground, about eight pixels to a patch at any zoom
// (the two power-of-two cells nearest that, crossfaded), so a reef flat
// seen across an island and one seen from a stop both read as reef
float mottle(vec2 xz, float px) {
  float lv = log2(max(px, 1e-4) * 8.0);
  float l0 = floor(lv);
  vec2 a = xz / exp2(l0);
  vec2 b = xz / exp2(l0 + 1.0);
  float m0 = 0.62 * vnoise(a + 3.1) + 0.38 * vnoise(a * 2.07 + 11.3);
  float m1 = 0.62 * vnoise(b + 7.7) + 0.38 * vnoise(b * 2.07 + 5.9);
  return mix(m0, m1, lv - l0);
}

vec2 noiseGrad(vec2 p) {
  const float e = 0.25;
  return vec2(vnoise(p + vec2(e, 0.0)) - vnoise(p - vec2(e, 0.0)), vnoise(p + vec2(0.0, e)) - vnoise(p - vec2(0.0, e))) / (2.0 * e);
}
// Sea-surface slope: a few long swells, plus wind chop made of drifting noise,
// each faded out once it is finer than a pixel (detail: world units per pixel).
vec2 waveSlope(vec2 p, float t, float detail) {
  vec2 d0 = normalize(uWind + vec2(1e-3));
  vec2 sw = normalize(uSwellDir + vec2(1e-3));
  vec2 grad = vec2(0.0);
  float amp = 0.006 * uSwellK;
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
  float a = 0.5;
  float f = 1.6;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  vec2 q = p;
  for (int i = 0; i < 5; i++) {
    float fade = 1.0 - smoothstep(0.08, 0.35, detail * f);
    if (fade > 0.0) grad += noiseGrad(q * f + d0 * t * (0.25 + 0.12 * float(i))) * a * 0.022 * f * fade;
    q = rot * q;
    a *= 0.62;
    f *= 2.1;
  }
  return grad;
}

void main() {
  ${logDepthFragment}
  float depth = seaDepth(vWorld.xz);
  if (depth < -0.05) discard; // land pokes through
  // (the rest in the Hawaiian 100 m units the tuning was done in)
  vec2 xz = vWorld.xz * uUnitM / 100.0;
  vec3 V = normalize(uCamPos - vWorld);
  float px = length(fwidth(xz));

  // (in a fishpond, behind its wall, the water lies still and green)
  float pond = distPond(vWorld.xz);
  vec2 g = waveSlope(xz, uTime, px) * (0.55 + 0.6 * length(uWind)) * uSeaK;
  g *= (1.0 + 0.6 * (1.0 - smoothstep(0.5, 6.0, depth))) * (1.0 - 0.85 * pond);
  vec3 N = normalize(vec3(-g.x, 1.0, -g.y));

  // --- what's under the surface ------------------------------------------
  float fb = fbm2F(xz * 1.7, px * 1.7);
  vec3 sandC = vec3(0.80, 0.72, 0.55);
  vec3 reefC = mix(vec3(0.30, 0.27, 0.20), vec3(0.42, 0.30, 0.34), fbm2F(xz * 4.0 + 7.0, px * 4.0));
  float reef = smoothstep(0.45, 0.62, fb) * (1.0 - smoothstep(4.0, 14.0, depth));
  vec3 bed = mix(sandC, reefC, clamp(reef, 0.0, 1.0));
  // the reef flat of a patch's years: heads of coral and rubble in the reef's
  // own colours, mottled at a size that reads at any zoom and standing nearer
  // the surface than the flat round them, so the patch is reef and not one
  // even depth of blue, and meets the reef beyond its edge without a seam
  // (a patch's reef flat is a few metres down at most: deeper water never asks)
  float rf = 0.0;
  if (depth < 12.0) rf = patchReef(vWorld.xz);
  float dU = depth;
  if (rf > 0.002) {
    float mt = mottle(xz, px);
    float head = smoothstep(0.42, 0.66, mt) * rf;
    vec3 coral = mix(vec3(0.30, 0.27, 0.20), vec3(0.42, 0.30, 0.34), smoothstep(0.3, 0.7, mottle(xz * 1.9 + 17.0, px)));
    bed = mix(bed, coral, head * 0.85);
    dU = depth * (1.0 - 0.5 * head);
  }
  vec3 absorb = vec3(0.46, 0.105, 0.055);
  float vis = sunVisibility(vec3(vWorld.x, 0.0, vWorld.z));
  vec3 light = uSunColor * max(uSunDir.y, 0.0) * vis + uSkyColor * 0.8 + uMoonColor * 0.3;
  float caust = 0.0;
  if (px < 0.012) {
    vec2 cp = xz * 70.0;
    float ca = voronoi(cp + vec2(uTime * 0.9, uTime * 0.6)).x;
    float cb = voronoi(cp * 1.31 - vec2(uTime * 0.7, -uTime * 0.5)).x;
    caust = pow(1.0 - min(ca, cb), 6.0) * 1.6 * (1.0 - smoothstep(1.0, 8.0, depth)) * (1.0 - smoothstep(0.003, 0.012, px));
  }
  vec3 under = bed * light * (1.0 + caust * vis) * exp(-absorb * dU * 2.0);
  vec3 amb = uSkyColor * 1.6 + uSunColor * max(uSunDir.y, 0.0) * vis;
  vec3 deepC = vec3(0.004, 0.030, 0.075) * amb;
  vec3 turq = vec3(0.03, 0.20, 0.21) * amb;
  // (and in the channels, a kilometre and more down, the deepest blue)
  vec3 abyss = vec3(0.002, 0.018, 0.060) * amb;
  float scatter = 1.0 - exp(-dU * 0.3);
  vec3 body = mix(turq, deepC, smoothstep(5.0, 45.0, depth));
  body = mix(body, vec3(0.075, 0.13, 0.07) * amb, pond);
  body = mix(body, abyss, smoothstep(200.0, 1500.0, depth));
  vec3 water = under * (1.0 - 0.7 * pond) + body * max(scatter, 0.8 * pond);

  // --- the surface ---------------------------------------------------------
  float cosT = max(dot(N, V), 0.0);
  float F = 0.02 + 0.98 * pow(1.0 - cosT, 5.0);
  vec3 R = reflect(-V, N);
  R.y = abs(R.y);
  vec3 refl = skyMap(R);
  vec3 H = normalize(uSunDir + V);
  float spec = pow(max(dot(N, H), 0.0), 900.0) * 60.0 + pow(max(dot(N, H), 0.0), 90.0) * 0.6;
  vec3 col = mix(water, refl, F * (1.0 - 0.5 * pond)) + uSunColor * spec * vis * step(0.0, uSunDir.y);
  // the point lights' glints: a star shell's path across the water
  col += pointGlints(N, V, vWorld, 300.0) * 1.5 + pointGlints(N, V, vWorld, 40.0) * 0.08;

  // --- foam --------------------------------------------------------------------
  // swash at the shore, where the water is shallowest (depth stands in for the
  // distance to land), and whitecaps in the trades out in deeper water
  // (over a patch's reef flat, which is a metre or two down throughout, the
  // swash would cover all of it: there it stays at the real shore's edge)
  float shore = (1.0 - smoothstep(0.1, 1.4, depth)) * (1.0 - pond) * (1.0 - 0.75 * rf);
  float swash = 0.5 + 0.5 * sin(depth * 9.0 - uTime * 1.6 + fbm2F(xz * 3.0, px * 3.0) * 4.0);
  float foamTex = smoothstep(0.35, 0.75, fbm2F(xz * 9.0 + vec2(uTime * 0.3, 0.0), px * 9.0));
  float caps = smoothstep(0.78, 0.92, fbm2F(xz * 0.9 + uWind * uTime * 0.06, px * 0.9)) * smoothstep(0.55, 1.1, length(uWind) * uSeaK) * smoothstep(20.0, 60.0, depth);
  caps *= 1.0 - smoothstep(0.3, 1.2, px);
  float foam = max(shore * swash * 0.9 * (1.0 - smoothstep(0.4, 2.5, px)), caps * 0.5) * mix(1.0, foamTex, 0.5);
  vec3 foamC = vec3(0.92) * (uSunColor * max(uSunDir.y, 0.0) * vis + uSkyColor * 1.4);
  col = mix(col, foamC, clamp(foam, 0.0, 1.0));

  // soft meeting with the sand
  float alpha = smoothstep(-0.02, 0.35, depth);
  if (uDebug == 1) { col = vec3(depth / 100.0, fract(depth), 0.0); alpha = 1.0; }
  gl_FragColor = vec4(col, alpha);
}
`
