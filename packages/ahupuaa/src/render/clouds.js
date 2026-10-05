// Clouds, rain shafts and rainbows, ray-marched at reduced resolution.
//
// Every pixel walks its view ray through the cloud layer: the weather grid says
// how much cloud water is overhead, the cloud base sits at the condensation
// level and the tops stop at the trade-wind inversion, and two tileable noise
// volumes drifting on the wind carve that into cumulus. Each sample looks
// toward the sun to see how much cloud is in the way (Beer–Lambert with a
// powder term for the bright crinkly edges and a two-lobe phase function for
// the silver lining). Wherever the grid says it is raining, the ray picks up
// grey rain streaks, from the ground up into the lower part of the cloud, so
// the shaft hangs from it; a raining cell's base also sags a little lower,
// flatter and darker, as rain clouds do.
//
// The march is coarse and runs at a fraction of the screen's resolution, so
// where its samples fall would show as a dither pattern and as bands where
// rays meet cloud, and both would crawl as the camera moves. Instead the
// sample offsets change every frame and a second pass blends each frame into
// a history carried along with the camera and the wind, held to what the
// current frame's neighbourhood allows so a moving edge leaves no ghost.
//
// Rain the sun can reach (clear of the cloud above it and of the land's
// shadow) also sends a little light back near 42° from the point opposite the
// sun: the ānuenue. How much, and in what colours, comes from a table worked
// out once from the optics of a raindrop: red on the outside, the sky inside
// the bow a shade lighter, a dark band beyond it, and a much fainter secondary
// bow with its colours reversed. The bow is only as bright as the lit rain in
// that cone, so usually just a piece of one shows: an ʻōnohi standing on the
// sea, the pale punakea of drizzle, uakoko low over sunlit ground. It is light
// added on top of the scene, so it all but vanishes against bright sky and
// shows against dark cloud and shaded rain, as a real one does.

import * as THREE from 'three'
import { constants, heightFetch } from './shaders/common.glsl.js'
import { fullscreenTriangle } from './pipeline.js'

const fragment = /* glsl */ `
${constants}
precision highp sampler3D;
uniform sampler2D uDepth;
uniform sampler2D uWeather;
uniform sampler3D uShape;
uniform sampler3D uDetail;
uniform vec4 uWeatherRect;
uniform mat4 uInvProj;
uniform mat4 uCamWorld;
uniform vec3 uCamPos;
uniform vec3 uSunDir;
uniform vec3 uSunColor;
uniform vec3 uSkyColor;
uniform vec3 uGroundColor;
uniform vec3 uFogColor;
uniform vec3 uMoonDir;
uniform vec3 uMoonColor;
uniform vec2 uWind;        // accumulated wind travel (world)
uniform vec2 uWindDir;
uniform float uTime;
uniform float uBase;       // world y of the cloud base
uniform float uTop;        // world y of the inversion
uniform float uDensity;
uniform float uFarCover;   // trade cumulus beyond the simulated patch
uniform float uOvercast;   // 0..1, a stratiform deck over everything (Kona storms)
uniform float uRainbow;    // 1 = rainbows on; also a debug gain
uniform float uSteps;
uniform float uLightSteps;
uniform float uFlash;      // lightning
uniform vec3 uFlashPos;
uniform float uFrame;      // frame counter, steps the sample offsets
uniform sampler2D uBowLUT;  // raindrop light near the bows (x = degrees from antisolar / 64; rows: showers, light rain, drizzle)
uniform sampler2D uShadow;  // terrain shadow from the sun, top-down
${heightFetch}
in vec2 vUv;
// the transmittance-weighted mean distance of what the ray met, for reprojection
layout(location = 1) out highp vec4 cloudDepth;

// the bow table is drop optics (light relative to isotropic scattering); this
// one constant sets how strongly the app's rain veil, which already stands in
// for multiple scattering, carries it
#define BOW_GAIN 0.3
// how far (world y) rain shows up inside the cloud above its base
#define RAIN_REACH 3.2

// interleaved gradient noise: neighbouring pixels get well spread offsets
float ign(vec2 p) { return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715)))); }
float vn(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = fract(sin(dot(i, vec2(127.1, 311.7))) * 43758.5453);
  float b = fract(sin(dot(i + vec2(1, 0), vec2(127.1, 311.7))) * 43758.5453);
  float c = fract(sin(dot(i + vec2(0, 1), vec2(127.1, 311.7))) * 43758.5453);
  float d = fract(sin(dot(i + vec2(1, 1), vec2(127.1, 311.7))) * 43758.5453);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// cover, rain, wetness, convective — the simulated patch, fading into
// procedural trade cumulus beyond it
vec4 weather(vec2 xz) {
  vec2 uv = (xz - uWeatherRect.xy) / uWeatherRect.zw;
  vec4 w = texture(uWeather, uv);
  float edge = smoothstep(0.38, 0.49, max(abs(uv.x - 0.5), abs(uv.y - 0.5)));
  if (edge > 0.0) {
    // trade cumulus line up in streets along the wind
    vec2 wd = normalize(uWindDir + vec2(1e-4));
    vec2 r = xz - uWind;
    vec2 q = vec2(dot(r, wd) / 70.0, dot(r, vec2(-wd.y, wd.x)) / 26.0);
    float n = vn(q) * 0.6 + vn(q * 2.1 + 7.0) * 0.3 + vn(q * 4.3) * 0.1;
    float far = smoothstep(1.0 - uFarCover, 1.0, n) * 0.85;
    w = mix(w, vec4(far, far > 0.55 ? (far - 0.55) * 0.5 : 0.0, 0.0, 0.0), edge);
  }
  return w;
}

float remap(float v, float a, float b, float c, float d) { return c + (v - a) / (b - a) * (d - c); }

vec4 weatherAll(vec2 xz) {
  vec4 w = weather(xz);
  // a storm sky: grey deck everywhere, rain wherever it's thickest
  // torn into rafts and gaps, so the land still shows between bands of rain
  float raft = vn((xz - uWind) / 23.0) * 0.65 + vn((xz - uWind) / 7.0) * 0.35;
  w.r = max(w.r, uOvercast * (0.2 + 0.6 * smoothstep(0.35, 0.7, raft)));
  w.g = max(w.g, uOvercast * smoothstep(0.62, 0.9, w.r) * 0.6);
  return w;
}

// A raining cell's base hangs a little lower: the rain-cooled air under a
// shower condenses sooner.
float cellBase(vec4 w) { return uBase * (1.0 - 0.06 * w.g); }

// How far toward the inversion a cell grows. Trade cumulus mostly stay
// shallow, well under the lid; thick cover (the cap on the mountain, a
// shower) piles up toward it, and strong convection pushes single towers
// higher.
float cellTop(float b0, float cover, float conv, float lump) {
  return b0 + (uTop - b0) * clamp(0.15 + cover * 0.6 + conv * 0.25 + (lump - 0.5) * 0.5, 0.12, 1.0);
}

// density at p; full adds the fine erosion noise
float density(vec3 p, vec4 w, bool full) {
  float cover = w.r;
  if (cover < 0.01) return 0.0;
  // the noise rides the wind, as the cells in the grid do
  vec3 q = p - vec3(uWind.x, 0.0, uWind.y);
  // low-frequency noise sets how tall each cell grows, so tops are lumpy
  float lump = texture(uShape, q * vec3(1.0 / 140.0, 1.0 / 90.0, 1.0 / 140.0) + 0.37).r;
  float b0 = cellBase(w);
  float hf = (p.y - b0) / max(cellTop(b0, cover, w.a, lump) - b0, 1e-3);
  if (hf < 0.0 || hf > 1.0) return 0.0;
  // in rain the underside is a fuller, flatter ceiling instead of separate turrets
  float sag = w.g * (1.0 - smoothstep(0.0, 0.35, hf));
  // flat base, rounded shoulders
  float prof = smoothstep(0.0, mix(0.12, 0.06, w.g), hf) * (1.0 - smoothstep(0.38, 1.0, hf));
  float n = texture(uShape, q * vec3(1.0 / 46.0, 1.0 / 34.0, 1.0 / 46.0) + vec3(0.0, uTime * 0.0006, 0.0)).r;
  float base = clamp(remap(n, 0.25 - sag * 0.3, 1.0, 0.0, 1.0), 0.0, 1.0) * prof;
  float d = remap(base, 1.0 - cover, 1.0, 0.0, 1.0) * mix(0.55, 1.0, cover);
  d = clamp(d, 0.0, 1.0);
  if (full && d > 0.0) {
    float dn = texture(uDetail, q * (1.0 / 9.0) + vec3(0.0, uTime * 0.004, 0.0)).r;
    // wispy at the base, billowy higher up
    float er = mix(dn, 1.0 - dn, clamp(hf * 4.0, 0.0, 1.0)) * 0.32 * (1.0 - 0.6 * sag);
    d = clamp(remap(d, er, 1.0, 0.0, 1.0), 0.0, 1.0);
  }
  return d * uDensity * 1.6;
}

// cheap density for the light march: coverage and the base shape only
float densityLight(vec3 p) {
  vec4 w = weatherAll(p.xz);
  float cover = w.r;
  if (cover < 0.01) return 0.0;
  float b0 = cellBase(w);
  float hf = (p.y - b0) / max(cellTop(b0, cover, w.a, 0.5) - b0, 1e-3);
  if (hf < 0.0 || hf > 1.0) return 0.0;
  float prof = smoothstep(0.0, mix(0.12, 0.06, w.g), hf) * (1.0 - smoothstep(0.38, 1.0, hf));
  vec3 q = p - vec3(uWind.x, 0.0, uWind.y);
  float n = texture(uShape, q * vec3(1.0 / 46.0, 1.0 / 34.0, 1.0 / 46.0)).r;
  float d = remap(remap(n, 0.25, 1.0, 0.0, 1.0) * prof, 1.0 - cover, 1.0, 0.0, 1.0) * mix(0.55, 1.0, cover);
  return clamp(d, 0.0, 1.0) * uDensity * 1.6;
}

float hg(float c, float g) {
  float g2 = g * g;
  return (1.0 - g2) / pow(1.0 + g2 - 2.0 * g * c, 1.5);
}

// Does sunlight reach this drop? Cloud: where its sun ray crosses the base and
// a third of the way up. Land: follow the same ray away from the sun down to
// the ground; that spot shares the ray and the air between is open, so the
// terrain shadow map there answers for the drop. Two passes find the ground on
// slopes; the nearest height texel is plenty for that.
float groundY(vec2 xz) {
  ivec2 i = clamp(ivec2(worldToUv(xz) * HRES), ivec2(0), ivec2(int(HRES) - 1));
  return max(texelFetch(uHeight, i, 0).r, 0.0) * Y_PER_M;
}
float terrainLit(vec3 p, vec2 run) {
  vec2 g = p.xz - run * max(p.y - groundY(p.xz), 0.0);
  g = p.xz - run * max(p.y - groundY(g), 0.0);
  vec2 uv = worldToUv(g);
  if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) return 1.0;
  return texture(uShadow, uv).r;
}
// cloud cover where a sun ray crosses the layer: the simulated patch alone
// (the sun rays from rain in view seldom leave it), with a storm deck as a
// flat floor
float coverAt(vec2 xz) {
  return max(texture(uWeather, (xz - uWeatherRect.xy) / uWeatherRect.zw).r, uOvercast * 0.7);
}
float sunlitRain(vec3 p, vec2 run) {
  float c0 = coverAt(p.xz + run * max(uBase - p.y, 0.0));
  float c1 = coverAt(p.xz + run * max(mix(uBase, uTop, 0.35) - p.y, 0.0));
  return terrainLit(p, run) * exp(-2.6 * (c0 + c1));
}

void main() {
  float depth = texture(uDepth, vUv).r;
  vec4 ndc = vec4(vUv * 2.0 - 1.0, depth * 2.0 - 1.0, 1.0);
  vec4 view = uInvProj * ndc;
  view /= view.w;
  vec3 world = (uCamWorld * vec4(view.xyz, 1.0)).xyz;
  vec3 ray = world - uCamPos;
  float sceneDist = depth < 1.0 ? length(ray) : 1e9;
  vec3 rd = normalize(ray);
  cloudDepth = vec4(min(sceneDist, 2000.0));

  float yHi = uTop + 0.5;
  float yLo = 0.0;
  // slab intersection
  float t0, t1;
  if (abs(rd.y) < 1e-5) {
    if (uCamPos.y < yLo || uCamPos.y > yHi) { gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); return; }
    t0 = 0.0; t1 = 2000.0;
  } else {
    float ta = (yLo - uCamPos.y) / rd.y;
    float tb = (yHi - uCamPos.y) / rd.y;
    t0 = max(0.0, min(ta, tb));
    t1 = max(ta, tb);
  }
  t1 = min(t1, min(sceneDist, 1400.0));
  if (t1 <= t0) { gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); return; }

  // a different offset every frame (a golden-ratio walk from each pixel's own
  // start), so the history averages over them instead of the eye seeing one
  float jitter = fract(ign(gl_FragCoord.xy) + uFrame * 0.618034);
  float jitterL = fract(ign(gl_FragCoord.yx + 23.0) + uFrame * 0.754878);
  vec3 L = vec3(0.0);
  float T = 1.0;
  float zSum = 0.0;
  float zW = 0.0;
  float cosS = dot(rd, uSunDir);
  float phase = mix(hg(cosS, 0.62), hg(cosS, -0.22), 0.3) * 0.75 + 0.25;
  float antiDeg = degrees(acos(clamp(dot(rd, -uSunDir), -1.0, 1.0)));
  // the drops' light toward this pixel, for big shower drops, light rain and
  // drizzle; past 63° there is nothing left to add
  float bowOn = uRainbow * BOW_GAIN * smoothstep(0.0, 0.05, uSunDir.y) * step(antiDeg, 63.0);
  vec3 bowShower = vec3(0.0), bowLight = vec3(0.0), bowDrizzle = vec3(0.0);
  if (bowOn > 0.0) {
    float u = antiDeg / 64.0;
    bowShower = textureLod(uBowLUT, vec2(u, 0.5 / 3.0), 0.0).rgb * bowOn;
    bowLight = textureLod(uBowLUT, vec2(u, 1.5 / 3.0), 0.0).rgb * bowOn;
    bowDrizzle = textureLod(uBowLUT, vec2(u, 2.5 / 3.0), 0.0).rgb * bowOn;
  }
  vec2 sunRun = uSunDir.xz / max(uSunDir.y, 0.05); // xz travelled per unit of height toward the sun
  float lit = 1.0;
  float litT = -1e9;
  vec3 sunL = uSunColor;
  float fogK = 0.0011;
  float detailK = uSteps / 56.0;
  float t = t0 + jitter * clamp(t0 * 0.011 / detailK, 0.22, 7.0);
  // striding over empty air, then stepping back to walk into cloud at the
  // fine step, so where a ray meets cloud doesn't snap to the stride
  float tEmpty = -1.0;
  float tFine = -1.0;
  for (int i = 0; i < 200; i++) {
    if (t >= t1 || T < 0.03) break;
    float dt = clamp(t * 0.011 / detailK, 0.22, 7.0);
    vec3 p = uCamPos + rd * t;
    vec4 w = weatherAll(p.xz);
    float b0 = cellBase(w);
    float above = p.y - b0;
    if (w.r < 0.012 && (w.g < 0.01 || above > RAIN_REACH)) {
      if (t > tFine) {
        // empty air: stride ahead (the weather grid is ~4 units a cell)
        tEmpty = t;
        t += max(dt * 4.0, 2.4);
      } else {
        t += dt;
      }
      continue;
    }
    if (tEmpty >= 0.0) {
      tFine = t;
      t = tEmpty + dt * jitter;
      tEmpty = -1.0;
      continue;
    }
    float fogT = exp(-t * fogK);
    if (above >= 0.0) {
      float d = density(p, w, true);
      if (d > 0.002) {
        // light from the sun through the cloud above/around this point
        float tau = 0.0;
        vec3 sd = uSunDir.y > 0.02 ? uSunDir : vec3(0.0, 1.0, 0.0);
        float ls = 0.4 * (0.7 + 0.6 * jitterL);
        vec3 lp = p;
        for (int k = 0; k < 4; k++) {
          if (float(k) >= uLightSteps) break;
          lp += sd * ls;
          tau += densityLight(lp) * ls;
          ls *= 2.0;
        }
        float hf = clamp((p.y - uBase) / max(uTop - uBase, 1e-3), 0.0, 1.0);
        float beer = max(exp(-tau * 3.2), exp(-tau * 0.8) * 0.22);
        float powder = 1.0 - exp(-d * 5.0 - tau * 0.6);
        vec3 amb = mix(uGroundColor * 1.2 + uSkyColor * 0.18, uSkyColor * 0.95, smoothstep(0.0, 0.85, hf));
        // a raining base is a darker grey: it sees little sky through the water above it
        amb *= 1.0 - 0.4 * w.g * (1.0 - smoothstep(0.0, 4.0, above));
        vec3 S = sunL * beer * phase * mix(0.45, 1.0, powder) + amb * (0.35 + 0.55 * hf) * (1.0 - 0.35 * d) + uMoonColor * 3.0 * exp(-tau);
        if (uFlash > 0.0) S += vec3(2.2, 2.3, 3.0) * uFlash * exp(-distance(p, uFlashPos) * 0.05);
        float sigma = d * 2.6;
        float Ts = exp(-sigma * dt);
        float a = T * (1.0 - Ts);
        L += a * (S * fogT + uFogColor * (1.0 - fogT));
        zSum += a * t;
        zW += a;
        T *= Ts;
      }
    }
    if (w.g > 0.0 && above < RAIN_REACH) {
      // rain (under cloud that isn't raining there is nothing to add): grey
      // streaks from the ground up into the cloud's lower part, thinning
      // toward the ground in dry air and fading out with height inside it;
      // fine near the camera, a soft veil farther off
      float wg = w.g * (1.0 - smoothstep(0.0, RAIN_REACH, above));
      float near = 1.0 - smoothstep(4.0, 30.0, t);
      vec3 q = vec3(p.x * mix(0.5, 3.0, near), p.y * 0.05 + uTime * 0.9, p.z * mix(0.5, 3.0, near)) - vec3(uWind.x * 0.5, 0.0, uWind.y * 0.5);
      float streak = texture(uDetail, q).r;
      float fall = smoothstep(0.0, uBase * 0.3, p.y + uBase * 0.08) * mix(1.0, 0.35, near);
      // a shaft is heaviest just under its cloud, where it hangs from it
      float r = wg * smoothstep(0.25, 0.75, streak + wg * 0.4) * fall * (1.0 + 0.4 * smoothstep(-2.5, 0.0, above));
      // is the sun on this rain? cloud and land, re-checked every 1.5 units
      // near by and more sparsely far off, where the veil is soft anyway
      if (t - litT > max(1.5, t * 0.03)) {
        lit = sunlitRain(p, sunRun);
        litT = t;
      }
      // rain under its own cloud sees less sky, so shafts read grey and a bow shows on them
      vec3 S = uSkyColor * 0.55 * mix(1.0, 0.8, w.r) + sunL * lit * 0.14;
      float sigma = r * 0.14;
      float Ts = exp(-sigma * dt);
      float a = T * (1.0 - Ts);
      L += a * (S * fogT + uFogColor * (1.0 - fogT));
      zSum += a * t;
      zW += a;
      // the bow rides on the mean rain, not the streaks, so it holds still;
      // drop size follows the rain rate: drizzle pale and broad, showers narrow and vivid
      if (bowOn > 0.0 && lit > 0.003 && above < 0.0) {
        float sb = w.g * fall * 0.12; // mean extinction: 0.14 × the streaks' average cover
        vec3 bowP = mix(mix(bowDrizzle, bowLight, smoothstep(0.05, 0.25, w.g)), bowShower, smoothstep(0.3, 0.65, w.g));
        L += T * sunL * lit * bowP * (1.0 - exp(-sb * dt)) * fogT;
      }
      T *= Ts;
    }
    t += dt;
  }
  gl_FragColor = vec4(L, T);
  if (zW > 1e-3) cloudDepth = vec4(zSum / zW);
}
`

// The temporal resolve, at the march's resolution: find where this pixel's
// cloud was last frame (its mean depth, moved back by the wind's drift since),
// fetch the history there, hold it inside the range of this frame's 3×3
// neighbourhood so it can't ghost, and blend.
const resolveFragment = /* glsl */ `
uniform sampler2D uCur;
uniform sampler2D uCurDepth;
uniform sampler2D uHistory;
uniform mat4 uPrevViewProj;
uniform mat4 uInvProj;
uniform mat4 uCamWorld;
uniform vec3 uCamPos;
uniform vec3 uDrift;       // how far the clouds moved with the wind since last frame
uniform float uBlend;      // history weight; 0 starts over
in vec2 vUv;

void main() {
  ivec2 ip = ivec2(gl_FragCoord.xy);
  ivec2 lim = textureSize(uCur, 0) - 1;
  vec4 c = texelFetch(uCur, ip, 0);
  if (uBlend <= 0.0) { gl_FragColor = c; return; }
  vec4 m1 = vec4(0.0), m2 = vec4(0.0), lo = c, hi = c;
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec4 s = texelFetch(uCur, clamp(ip + ivec2(x, y), ivec2(0), lim), 0);
      m1 += s;
      m2 += s * s;
      lo = min(lo, s);
      hi = max(hi, s);
    }
  }
  // the min/max box, tightened toward the mean where the neighbourhood is calm
  m1 /= 9.0;
  vec4 sd = sqrt(max(m2 / 9.0 - m1 * m1, 0.0));
  lo = max(lo, m1 - sd * 1.5);
  hi = min(hi, m1 + sd * 1.5);

  vec4 v = uInvProj * vec4(vUv * 2.0 - 1.0, 1.0, 1.0);
  vec3 rd = normalize((uCamWorld * vec4(v.xyz / v.w, 0.0)).xyz);
  vec3 wp = uCamPos + rd * texelFetch(uCurDepth, ip, 0).r - uDrift;
  vec4 pc = uPrevViewProj * vec4(wp, 1.0);
  vec2 puv = pc.xy / pc.w * 0.5 + 0.5;
  float a = uBlend;
  if (pc.w <= 0.0 || any(lessThan(puv, vec2(0.0))) || any(greaterThan(puv, vec2(1.0)))) a = 0.0;
  vec4 h = clamp(texture(uHistory, puv), lo, hi);
  gl_FragColor = mix(c, h, a);
}
`

// how much of each frame is history: about ten frames' worth
const HISTORY = 0.9

const quadVertex = /* glsl */ `out vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }`

// The ānuenue table: how much sunlight raindrops send back near the bows, per
// degree from the antisolar point, in linear RGB relative to isotropic
// scattering. Airy theory gives each bow (one internal reflection for the
// primary, two for the secondary) per wavelength and drop size; a spread of
// drop sizes, the eye's colour matching and the sun's disc then blur it into
// what is actually seen. Built once, in a few tens of milliseconds.
const BOW_N = 512 // texels over 0..BOW_MAX degrees
const BOW_MAX = 64

function airy(z) {
  // Ai(z): power series near the origin, the oscillating asymptote far inside
  if (z > 6) return 0
  if (z < -7) {
    const x = -z
    const zeta = (2 / 3) * x * Math.sqrt(x)
    const ph = zeta + Math.PI / 4
    return (Math.sin(ph) - (5 / (72 * zeta)) * Math.cos(ph)) / (Math.sqrt(Math.PI) * Math.sqrt(Math.sqrt(x)))
  }
  const z3 = z * z * z
  let f = 1
  let g = z
  let tf = 1
  let tg = z
  for (let k = 1; k < 80; k++) {
    tf *= z3 / ((3 * k - 1) * (3 * k))
    tg *= z3 / ((3 * k) * (3 * k + 1))
    f += tf
    g += tg
    if (Math.abs(tf) + Math.abs(tg) < 1e-16) break
  }
  return 0.355028053887817 * f - 0.258819403792807 * g
}

// water at 20 °C: a Cauchy fit (λ in µm)
const nWater = (um) => 1.3239 + 0.003125 / (um * um)

// Fresnel throughput of a ray that enters, reflects k times inside and leaves,
// averaged over the two polarisations
function throughput(n, k, b) {
  const ci = Math.sqrt(1 - b * b)
  const cr = Math.sqrt(1 - (b * b) / (n * n))
  const rs = (ci - n * cr) / (ci + n * cr)
  const rp = (n * ci - cr) / (n * ci + cr)
  const Rs = rs * rs
  const Rp = rp * rp
  return 0.5 * ((1 - Rs) ** 2 * Rs ** k + (1 - Rp) ** 2 * Rp ** k)
}

// angle from the antisolar point of a ray with impact parameter b
function rayAlpha(n, k, b) {
  const i = Math.asin(b)
  const r = Math.asin(b / n)
  const D = 2 * (i - r) + k * (Math.PI - 2 * r)
  return k === 1 ? Math.PI - D : D - Math.PI
}

// the rainbow ray (where the deviation turns): impact parameter, its angle,
// the curvature of the deviation there and its throughput
function bowRay(n, k) {
  const b = Math.sqrt(1 - (n * n - 1) / (k * (k + 2)))
  const d2 = (2 * b) / Math.pow(1 - b * b, 1.5) - (2 * (k + 1) * b) / Math.pow(n * n - b * b, 1.5)
  return { b, alpha: rayAlpha(n, k, b), d2: Math.abs(d2), eps: throughput(n, k, b) }
}

// CIE 1931 observer (Wyman, Sloan & Shirley's multi-lobe fit) and XYZ → linear sRGB
const lobe = (l, m, s1, s2) => Math.exp(-0.5 * ((l - m) / (l < m ? s1 : s2)) ** 2)
const cie = (l) => [
  1.056 * lobe(l, 599.8, 37.9, 31.0) + 0.362 * lobe(l, 442.0, 16.0, 26.7) - 0.065 * lobe(l, 501.1, 20.4, 26.2),
  0.821 * lobe(l, 568.8, 46.9, 40.5) + 0.286 * lobe(l, 530.9, 16.3, 31.1),
  1.217 * lobe(l, 437.0, 11.8, 36.0) + 0.681 * lobe(l, 459.0, 26.0, 13.8),
]
const toRGB = ([X, Y, Z]) => [3.2406 * X - 1.5372 * Y - 0.4986 * Z, -0.9689 * X + 1.8758 * Y + 0.0415 * Z, 0.0557 * X - 0.204 * Y + 1.057 * Z]

// Airy theory treats the deviation as a parabola about the rainbow ray, which
// holds near the bow but overstates the light far inside it. Geometric optics
// gets that region right, so on the bright side the Airy light is scaled by
// the ratio of the two (1 at the bow). It hardly depends on wavelength: one
// table per bow, indexed by the distance from it.
const CORR_STEP = 0.25 // degrees
function geometricBow(n, k, al) {
  // sum over the two ray branches that leave at antisolar angle al
  const ray = bowRay(n, k)
  let p = 0
  for (const [lo0, hi0] of [[1e-6, ray.b], [ray.b, 1 - 1e-9]]) {
    let lo = lo0
    let hi = hi0
    const fl = rayAlpha(n, k, lo) - al
    if (fl * (rayAlpha(n, k, hi) - al) > 0) continue
    for (let it = 0; it < 40; it++) {
      const m = (lo + hi) / 2
      if ((rayAlpha(n, k, m) - al) * fl > 0) lo = m
      else hi = m
    }
    const b = (lo + hi) / 2
    const b0 = Math.max(b - 1e-6, 0)
    const b1 = Math.min(b + 1e-6, 1)
    const dadb = Math.abs(rayAlpha(n, k, b1) - rayAlpha(n, k, b0)) / (b1 - b0)
    p += (2 * throughput(n, k, b) * b) / (dadb * Math.sin(al)) // (ε b |db/dα| / 2π sin α) · 4π
  }
  return p
}
function airyCorrection() {
  const n = nWater(0.55)
  return [1, 2].map((k) => {
    const ray = bowRay(n, k)
    const out = new Float32Array(Math.ceil(BOW_MAX / CORR_STEP) + 1)
    for (let j = 0; j < out.length; j++) {
      const d = (Math.max(j * CORR_STEP, 0.5) * Math.PI) / 180
      const al = k === 1 ? ray.alpha - d : ray.alpha + d
      if (al <= 0.01 || al >= Math.PI - 0.01) {
        out[j] = out[j - 1] || 1
        continue
      }
      // the Airy mean there: amp / (2π √|z|) / sin α, with the drop size cancelling out
      const mean = (ray.eps * ray.b * Math.cbrt(4) * Math.pow(ray.d2, -2 / 3) * 2) / (Math.sqrt(d * Math.cbrt(2 / ray.d2)) * Math.sin(al))
      out[j] = geometricBow(n, k, al) / mean
    }
    return out
  })
}

// Ai² sampled finely once, since the rows below need it about 100k times
const AI_LO = -20
const AI_STEP = 0.01
function airySquared() {
  const out = new Float32Array(Math.round((6 - AI_LO) / AI_STEP) + 2)
  for (let i = 0; i < out.length; i++) out[i] = airy(AI_LO + i * AI_STEP) ** 2
  return out
}

// one row of the table, for drops around radius a0 (mm): BOW_N × rgb
function bowRow(a0, corr, ai2) {
  const N = BOW_N
  const step = BOW_MAX / N
  const out = new Float32Array(N * 3)
  // drop sizes spread log-normally about a0, weighted by cross-section
  const sizes = [0.6, 0.75, 0.9, 1.0, 1.1, 1.25, 1.45, 1.7].map((s) => a0 * s)
  const weights = sizes.map((a) => Math.exp(-0.5 * (Math.log(a / a0) / 0.3) ** 2) * a * a)
  const wsum = weights.reduce((s, w) => s + w, 0)
  // the antisolar point itself is left flat: Airy and the 1/sin α focus both fail there
  const al = new Float32Array(N)
  const invSin = new Float32Array(N)
  for (let t = 0; t < N; t++) {
    al[t] = (Math.max((t + 0.5) * step, 1) * Math.PI) / 180
    invSin[t] = 1 / Math.sin(al[t])
  }
  const white = [0, 0, 0]
  const xyz = new Float32Array(N * 3)
  for (let l = 400; l <= 700; l += 20) {
    const c = cie(l)
    for (let j = 0; j < 3; j++) white[j] += c[j]
    const n = nWater(l / 1000)
    for (const k of [1, 2]) {
      const ray = bowRay(n, k)
      const cor = corr[k - 1]
      // walk from the bright side out to where the bow's light dies away:
      // inward for the primary, outward for the secondary
      const dir = k === 1 ? 1 : -1
      for (let s = 0; s < sizes.length; s++) {
        const x = (2 * Math.PI * sizes[s] * 1e6) / l // size parameter
        const x13 = Math.cbrt(x)
        const zk = x13 * x13 * Math.cbrt(2 / ray.d2)
        const amp = ray.eps * ray.b * Math.cbrt(4) * x13 * Math.pow(ray.d2, -2 / 3) * 4 * Math.PI * (weights[s] / wsum)
        for (let t = k === 1 ? 0 : N - 1; t >= 0 && t < N; t += dir) {
          const dAl = (ray.alpha - al[t]) * dir // > 0 on the bright side
          const z = -dAl * zk
          if (z > 6) break
          let a2
          if (z < AI_LO) {
            // far from the bow the fringes are finer than the sun's disc: keep their mean
            a2 = 1 / (2 * Math.PI * Math.sqrt(-z))
          } else {
            const f = (z - AI_LO) / AI_STEP
            const i = Math.floor(f)
            a2 = ai2[i] + (ai2[i + 1] - ai2[i]) * (f - i)
          }
          let p = amp * a2 * invSin[t]
          if (dAl > 0) {
            const f = Math.min(cor.length - 1.001, (dAl * 180) / Math.PI / CORR_STEP)
            const i = Math.floor(f)
            p *= cor[i] + (cor[i + 1] - cor[i]) * (f - i)
          }
          xyz[t * 3] += p * c[0]
          xyz[t * 3 + 1] += p * c[1]
          xyz[t * 3 + 2] += p * c[2]
        }
      }
    }
  }
  const wRGB = toRGB(white)
  // the sun's disc (0.27° radius) projected onto the radial direction
  const R = Math.ceil(0.2665 / step)
  const ker = []
  for (let d = -R; d <= R; d++) ker.push(Math.sqrt(Math.max(0, 1 - ((d * step) / 0.2665) ** 2)))
  const ks = ker.reduce((s, w) => s + w, 0)
  const acc = [0, 0, 0]
  for (let t = 0; t < N; t++) {
    acc.fill(0)
    for (let d = -R; d <= R; d++) {
      const q = Math.min(N - 1, Math.max(0, t + d))
      for (let j = 0; j < 3; j++) acc[j] += (xyz[q * 3 + j] * ker[d + R]) / ks
    }
    // a flat spectrum comes out white (1, 1, 1)
    const rgb = toRGB(acc).map((v, j) => v / wRGB[j])
    // out-of-gamut violet: add white until it fits, keeping the luminance
    const lum = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]
    const lo = Math.min(rgb[0], rgb[1], rgb[2])
    const sat = lo < 0 ? lum / Math.max(lum - lo, 1e-6) : 1
    // the faint glow of the third bow outside the secondary is cut off before the table ends
    const taper = 1 - Math.min(1, Math.max(0, ((t + 0.5) * step - 58) / 5))
    for (let j = 0; j < 3; j++) out[t * 3 + j] = Math.max(0, lum + (rgb[j] - lum) * sat) * taper
  }
  return out
}

// rows: big shower drops (0.5 mm), light rain (0.15 mm, with supernumerary
// fringes inside the bow), drizzle (0.05 mm, pale and broad); half floats so
// linear filtering works everywhere
function bowTable() {
  const t0 = performance.now()
  const corr = airyCorrection()
  const ai2 = airySquared()
  const rows = [bowRow(0.5, corr, ai2), bowRow(0.15, corr, ai2), bowRow(0.05, corr, ai2)]
  const N = BOW_N
  const data = new Uint16Array(N * 3 * 4)
  const one = THREE.DataUtils.toHalfFloat(1)
  for (let r = 0; r < 3; r++) {
    for (let t = 0; t < N; t++) {
      const o = (r * N + t) * 4
      for (let j = 0; j < 3; j++) data[o + j] = THREE.DataUtils.toHalfFloat(rows[r][t * 3 + j])
      data[o + 3] = one
    }
  }
  const tex = new THREE.DataTexture(data, N, 3, THREE.RGBAFormat, THREE.HalfFloatType)
  tex.minFilter = tex.magFilter = THREE.LinearFilter
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping
  tex.needsUpdate = true
  if (import.meta.env?.DEV) console.log(`rainbow table built in ${(performance.now() - t0).toFixed(0)} ms`)
  return tex
}

export class Clouds {
  constructor(noise) {
    const shape = new THREE.Data3DTexture(noise.shape, noise.shapeSize, noise.shapeSize, noise.shapeSize)
    shape.format = THREE.RedFormat
    shape.minFilter = THREE.LinearFilter
    shape.magFilter = THREE.LinearFilter
    shape.wrapS = shape.wrapT = shape.wrapR = THREE.RepeatWrapping
    shape.unpackAlignment = 1
    shape.needsUpdate = true
    const detail = new THREE.Data3DTexture(noise.detail, noise.detailSize, noise.detailSize, noise.detailSize)
    detail.format = THREE.RedFormat
    detail.minFilter = THREE.LinearFilter
    detail.magFilter = THREE.LinearFilter
    detail.wrapS = detail.wrapT = detail.wrapR = THREE.RepeatWrapping
    detail.unpackAlignment = 1
    detail.needsUpdate = true
    this.scale = 0.5
    // the march writes colour + transmittance and a depth for reprojection;
    // the resolve ping-pongs between two history targets
    const opts = { type: THREE.HalfFloatType, depthBuffer: false }
    this.march = new THREE.WebGLMultipleRenderTargets(1, 1, 2, opts)
    this.march.texture[1].format = THREE.RedFormat // the depth needs one channel
    this.history = [new THREE.WebGLRenderTarget(1, 1, opts), new THREE.WebGLRenderTarget(1, 1, opts)]
    this.current = 0
    this.frame = 0
    this.fresh = true // start the history over on the next frame
    this.prev = { viewProj: new THREE.Matrix4(), pos: new THREE.Vector3(), fwd: new THREE.Vector3(), sun: new THREE.Vector3(), wind: new THREE.Vector2() }
    this._fwd = new THREE.Vector3()
    this.uniforms = {
      uDepth: { value: null },
      uWeather: { value: null },
      uShape: { value: shape },
      uDetail: { value: detail },
      uWeatherRect: { value: new THREE.Vector4() },
      uInvProj: { value: new THREE.Matrix4() },
      uCamWorld: { value: new THREE.Matrix4() },
      uCamPos: { value: new THREE.Vector3() },
      uSunDir: { value: new THREE.Vector3() },
      uSunColor: { value: new THREE.Color() },
      uSkyColor: { value: new THREE.Color() },
      uGroundColor: { value: new THREE.Color() },
      uFogColor: { value: new THREE.Color() },
      uMoonDir: { value: new THREE.Vector3() },
      uMoonColor: { value: new THREE.Color() },
      uWind: { value: new THREE.Vector2() },
      uWindDir: { value: new THREE.Vector2(1, 0) },
      uTime: { value: 0 },
      uBase: { value: 8 },
      uTop: { value: 28 },
      uDensity: { value: 1 },
      uFarCover: { value: 0.32 },
      uOvercast: { value: 0 },
      uRainbow: { value: 1 },
      uBowLUT: { value: bowTable() },
      uShadow: { value: null },
      uHeight: { value: null },
      uSteps: { value: 56 },
      uLightSteps: { value: 4 },
      uFlash: { value: 0 },
      uFlashPos: { value: new THREE.Vector3() },
      uFrame: { value: 0 },
    }
    this.material = new THREE.ShaderMaterial({
      vertexShader: quadVertex,
      fragmentShader: fragment,
      uniforms: this.uniforms,
      depthTest: false,
      depthWrite: false,
    })
    const tri = fullscreenTriangle()
    this.scene = new THREE.Scene()
    const m = new THREE.Mesh(tri, this.material)
    m.frustumCulled = false
    this.scene.add(m)
    this.resolve = new THREE.ShaderMaterial({
      vertexShader: quadVertex,
      fragmentShader: resolveFragment,
      uniforms: {
        uCur: { value: this.march.texture[0] },
        uCurDepth: { value: this.march.texture[1] },
        uHistory: { value: null },
        uPrevViewProj: { value: new THREE.Matrix4() },
        uInvProj: this.uniforms.uInvProj,
        uCamWorld: this.uniforms.uCamWorld,
        uCamPos: this.uniforms.uCamPos,
        uDrift: { value: new THREE.Vector3() },
        uBlend: { value: 0 },
      },
      depthTest: false,
      depthWrite: false,
    })
    this.resolveScene = new THREE.Scene()
    const r = new THREE.Mesh(tri, this.resolve)
    r.frustumCulled = false
    this.resolveScene.add(r)
    this.cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    this.enabled = true
  }

  /** The latest resolved frame. */
  get rt() {
    return this.history[this.current]
  }

  get texture() {
    return this.rt.texture
  }

  setSize(w, h) {
    this.full = [w, h]
    const cw = Math.max(1, Math.floor(w * this.scale))
    const ch = Math.max(1, Math.floor(h * this.scale))
    this.march.setSize(cw, ch)
    for (const t of this.history) t.setSize(cw, ch)
    this.fresh = true
  }

  setScale(s) {
    if (Math.abs(s - this.scale) < 1e-3) return
    this.scale = s
    if (this.full) this.setSize(...this.full)
  }

  /**
   * Is this frame a cut rather than motion? A jump of the camera, a sharp
   * turn or a jump of the sun (the tour and tests set the clock directly)
   * would only drag the old picture across the new one.
   */
  isCut(camera) {
    const P = this.prev
    const fwd = camera.getWorldDirection(this._fwd)
    const pos = camera.position
    const cut =
      this.fresh ||
      pos.distanceTo(P.pos) > 0.5 + 0.25 * Math.max(0, pos.y) ||
      fwd.dot(P.fwd) < 0.85 ||
      this.uniforms.uSunDir.value.dot(P.sun) < 0.9995
    P.pos.copy(pos)
    P.fwd.copy(fwd)
    P.sun.copy(this.uniforms.uSunDir.value)
    this.fresh = false
    return cut
  }

  render(renderer, camera, depthTexture) {
    const u = this.uniforms
    const cut = this.isCut(camera)
    u.uDepth.value = depthTexture
    u.uInvProj.value.copy(camera.projectionMatrixInverse)
    u.uCamWorld.value.copy(camera.matrixWorld)
    u.uCamPos.value.copy(camera.position)
    this.frame = (this.frame + 1) % 4096
    u.uFrame.value = this.frame
    renderer.setRenderTarget(this.march)
    renderer.render(this.scene, this.cam)

    const r = this.resolve.uniforms
    const P = this.prev
    // lightning changes the whole sky within a frame or two: lean on the present
    r.uBlend.value = cut ? 0 : u.uFlash.value > 0.02 ? 0.5 : HISTORY
    r.uPrevViewProj.value.copy(P.viewProj)
    r.uDrift.value.set(u.uWind.value.x - P.wind.x, 0, u.uWind.value.y - P.wind.y)
    r.uHistory.value = this.history[this.current].texture
    this.current ^= 1
    renderer.setRenderTarget(this.history[this.current])
    renderer.render(this.resolveScene, this.cam)
    P.viewProj.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
    P.wind.copy(u.uWind.value)
  }
}
