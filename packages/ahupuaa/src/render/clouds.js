// Clouds, rain shafts and rainbows, ray-marched at reduced resolution.
//
// Every pixel walks its view ray through the cloud layer: the weather grid says
// how much cloud water is overhead, the cloud base sits at the condensation
// level and the tops stop at the trade-wind inversion, and two tileable noise
// volumes drifting on the wind carve that into cumulus. Each sample looks
// toward the sun to see how much cloud is in the way (Beer–Lambert with a
// powder term for the bright crinkly edges and a two-lobe phase function for
// the silver lining). Below the base, wherever the grid says it is raining,
// the ray picks up grey rain streaks — and if sunlight reaches that rain at
// 40–42° from the point opposite the sun, it picks up a rainbow, which is
// exactly where a real one would hang.

import * as THREE from 'three'
import { constants } from './shaders/common.glsl.js'
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
uniform float uRainbow;
uniform float uSteps;
uniform float uLightSteps;
uniform float uFlash;      // lightning
uniform vec3 uFlashPos;
uniform vec2 uRes;
in vec2 vUv;

float hash(vec2 p) { return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715)))); }
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

// density at p; full adds the fine erosion noise
float density(vec3 p, vec4 w, bool full) {
  float cover = w.r;
  if (cover < 0.01) return 0.0;
  vec3 q = p + vec3(uWind.x, 0.0, uWind.y);
  // low-frequency noise sets how tall each cell grows, so tops are lumpy
  float lump = texture(uShape, q * vec3(1.0 / 140.0, 1.0 / 90.0, 1.0 / 140.0) + 0.37).r;
  float top = uBase + (uTop - uBase) * clamp(0.18 + cover * 0.7 + w.a * 0.35 + (lump - 0.5) * 0.7, 0.12, 1.0);
  float hf = (p.y - uBase) / max(top - uBase, 1e-3);
  if (hf < 0.0 || hf > 1.0) return 0.0;
  // flat base, rounded shoulders
  float prof = smoothstep(0.0, 0.12, hf) * (1.0 - smoothstep(0.35, 1.0, hf));
  float n = texture(uShape, q * vec3(1.0 / 46.0, 1.0 / 34.0, 1.0 / 46.0) + vec3(0.0, uTime * 0.0006, 0.0)).r;
  float base = remap(n, 0.25, 1.0, 0.0, 1.0) * prof;
  float d = remap(base, 1.0 - cover, 1.0, 0.0, 1.0) * mix(0.55, 1.0, cover);
  d = clamp(d, 0.0, 1.0);
  if (full && d > 0.0) {
    float dn = texture(uDetail, q * (1.0 / 9.0) + vec3(0.0, uTime * 0.004, 0.0)).r;
    // wispy at the base, billowy higher up
    float er = mix(dn, 1.0 - dn, clamp(hf * 4.0, 0.0, 1.0)) * 0.32;
    d = clamp(remap(d, er, 1.0, 0.0, 1.0), 0.0, 1.0);
  }
  return d * uDensity * 1.6;
}

// cheap density for the light march: coverage and the base shape only
float densityLight(vec3 p) {
  vec4 w = weatherAll(p.xz);
  float cover = w.r;
  if (cover < 0.01) return 0.0;
  float top = uBase + (uTop - uBase) * clamp(0.18 + cover * 0.7 + w.a * 0.35, 0.12, 1.0);
  float hf = (p.y - uBase) / max(top - uBase, 1e-3);
  if (hf < 0.0 || hf > 1.0) return 0.0;
  float prof = smoothstep(0.0, 0.12, hf) * (1.0 - smoothstep(0.35, 1.0, hf));
  vec3 q = p + vec3(uWind.x, 0.0, uWind.y);
  float n = texture(uShape, q * vec3(1.0 / 46.0, 1.0 / 34.0, 1.0 / 46.0)).r;
  float d = remap(remap(n, 0.25, 1.0, 0.0, 1.0) * prof, 1.0 - cover, 1.0, 0.0, 1.0) * mix(0.55, 1.0, cover);
  return clamp(d, 0.0, 1.0) * uDensity * 1.6;
}

float hg(float c, float g) {
  float g2 = g * g;
  return (1.0 - g2) / pow(1.0 + g2 - 2.0 * g * c, 1.5);
}

vec3 rainbowColour(float deg) {
  // primary bow: violet at 40.6°, red at 42.3°; secondary reversed at 50–53°
  vec3 c = vec3(0.0);
  float x = (deg - 40.4) / 2.1;
  if (x > -0.3 && x < 1.3) {
    c += vec3(smoothstep(0.55, 0.9, x) * (1.0 - smoothstep(0.95, 1.2, x)),
              smoothstep(0.25, 0.55, x) * (1.0 - smoothstep(0.6, 0.85, x)),
              smoothstep(-0.25, 0.05, x) * (1.0 - smoothstep(0.25, 0.55, x)));
  }
  float y = (deg - 50.0) / 3.4;
  if (y > -0.3 && y < 1.3) {
    c += 0.45 * vec3(smoothstep(-0.2, 0.15, y) * (1.0 - smoothstep(0.25, 0.5, y)),
                     smoothstep(0.3, 0.55, y) * (1.0 - smoothstep(0.6, 0.85, y)),
                     smoothstep(0.65, 0.9, y) * (1.0 - smoothstep(0.95, 1.25, y)));
  }
  // the sky inside the primary bow is a little brighter
  c += vec3(0.05) * (1.0 - smoothstep(30.0, 40.5, deg));
  return c;
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

  float jitter = hash(gl_FragCoord.xy);
  vec3 L = vec3(0.0);
  float T = 1.0;
  float cosS = dot(rd, uSunDir);
  float phase = mix(hg(cosS, 0.62), hg(cosS, -0.22), 0.3) * 0.75 + 0.25;
  float antiDeg = degrees(acos(clamp(dot(rd, -uSunDir), -1.0, 1.0)));
  vec3 bow = rainbowColour(antiDeg) * uRainbow * smoothstep(-0.02, 0.06, uSunDir.y);
  vec3 sunL = uSunColor;
  float fogK = 0.0011;
  float detailK = uSteps / 56.0;
  float t = t0 + jitter * clamp(t0 * 0.012, 0.25, 3.0);
  for (int i = 0; i < 180; i++) {
    if (t >= t1 || T < 0.03) break;
    float dt = clamp(t * 0.011 / detailK, 0.22, 7.0);
    vec3 p = uCamPos + rd * t;
    vec4 w = weatherAll(p.xz);
    bool inCloudLayer = p.y >= uBase;
    if (w.r < 0.012 && (inCloudLayer || w.g < 0.01)) {
      // empty air: stride ahead (the weather grid is ~4 units a cell)
      t += max(dt * 4.0, 2.4);
      continue;
    }
    float fogT = exp(-t * fogK);
    if (inCloudLayer) {
      float d = density(p, w, true);
      if (d > 0.002) {
        // light from the sun through the cloud above/around this point
        float tau = 0.0;
        vec3 sd = uSunDir.y > 0.02 ? uSunDir : vec3(0.0, 1.0, 0.0);
        float ls = 0.4;
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
        vec3 S = sunL * beer * phase * mix(0.45, 1.0, powder) + amb * (0.35 + 0.55 * hf) * (1.0 - 0.35 * d) + uMoonColor * 3.0 * exp(-tau);
        if (uFlash > 0.0) S += vec3(2.2, 2.3, 3.0) * uFlash * exp(-distance(p, uFlashPos) * 0.05);
        float sigma = d * 2.6;
        float Ts = exp(-sigma * dt);
        L += T * (S * (1.0 - Ts) * fogT + uFogColor * (1.0 - fogT) * (1.0 - Ts));
        T *= Ts;
      }
    } else {
      // rain: grey streaks below the base, thinning toward the ground in dry air
      // streaks: fine near the camera, a soft veil farther off
      float near = 1.0 - smoothstep(4.0, 30.0, t);
      vec3 q = vec3(p.x * mix(0.5, 3.0, near), p.y * 0.05 + uTime * 0.9, p.z * mix(0.5, 3.0, near)) + vec3(uWind.x * 0.5, 0.0, uWind.y * 0.5);
      float streak = texture(uDetail, q).r;
      float r = w.g * smoothstep(0.25, 0.75, streak + w.g * 0.4) * smoothstep(0.0, uBase * 0.3, p.y + uBase * 0.08);
      r *= mix(1.0, 0.35, near);
      // cloud overhead along the sun ray decides whether the rain is sunlit
      vec2 up = p.xz + uSunDir.xz / max(uSunDir.y, 0.05) * max(uBase - p.y, 0.0);
      float shade = exp(-weatherAll(up).r * 3.0);
      vec3 S = uSkyColor * 0.55 + sunL * shade * 0.14 + sunL * shade * bow * 3.0;
      float sigma = r * 0.14;
      float Ts = exp(-sigma * dt);
      L += T * (S * (1.0 - Ts) * fogT + uFogColor * (1.0 - fogT) * (1.0 - Ts));
      T *= Ts;
    }
    t += dt;
  }
  gl_FragColor = vec4(L, T);
}
`

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
    this.rt = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, depthBuffer: false })
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
      uSteps: { value: 56 },
      uLightSteps: { value: 4 },
      uFlash: { value: 0 },
      uFlashPos: { value: new THREE.Vector3() },
      uRes: { value: new THREE.Vector2() },
    }
    this.material = new THREE.ShaderMaterial({
      vertexShader: `out vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
      fragmentShader: fragment,
      uniforms: this.uniforms,
      depthTest: false,
      depthWrite: false,
    })
    this.scene = new THREE.Scene()
    const m = new THREE.Mesh(fullscreenTriangle(), this.material)
    m.frustumCulled = false
    this.scene.add(m)
    this.cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    this.enabled = true
  }

  get texture() {
    return this.rt.texture
  }

  setSize(w, h) {
    this.full = [w, h]
    this.rt.setSize(Math.max(1, Math.floor(w * this.scale)), Math.max(1, Math.floor(h * this.scale)))
    this.uniforms.uRes.value.set(this.rt.width, this.rt.height)
  }

  setScale(s) {
    if (Math.abs(s - this.scale) < 1e-3) return
    this.scale = s
    if (this.full) this.setSize(...this.full)
  }

  render(renderer, camera, depthTexture) {
    const u = this.uniforms
    u.uDepth.value = depthTexture
    u.uInvProj.value.copy(camera.projectionMatrixInverse)
    u.uCamWorld.value.copy(camera.matrixWorld)
    u.uCamPos.value.copy(camera.position)
    renderer.setRenderTarget(this.rt)
    renderer.render(this.scene, this.cam)
  }
}
