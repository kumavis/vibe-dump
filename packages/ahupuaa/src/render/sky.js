// Sky, sun, moon and stars at 21° N.
//
// The daylight dome is the Preetham model as implemented in three.js's Sky
// example (Wallner, Upitis, zz85), extended with a night sky: the real bright
// stars on the real celestial sphere, a Milky Way, and a moon with its phase.
// The same scattering is evaluated in JS, so the light falling on the island is
// the light of the sky you can see — gold at dusk, blue in the shadows.

import * as THREE from 'three'
import { BRIGHT_STARS, GALACTIC_POLE } from './stars.js'
import { mulberry32 } from '../gen/noise.js'
import { fullscreenTriangle } from './pipeline.js'

const DEG = Math.PI / 180
export const LATITUDE = 21 * DEG
export const SYNODIC = 29.530588
const NEW_MOON_DOY = 224.1 // 12 Aug 2026 — the day of the total eclipse

// Hawaiian names of the nights of the lunar month, from Hilo (first sliver) to
// Muku (gone). Names and order vary by island; this is the commonly given list.
export const MOON_NIGHTS = [
  'Hilo', 'Hoaka', 'Kūkahi', 'Kūlua', 'Kūkolu', 'Kūpau', 'ʻOlekūkahi', 'ʻOlekūlua', 'ʻOlekūkolu', 'ʻOlepau',
  'Huna', 'Mōhalu', 'Hua', 'Akua', 'Hoku', 'Māhealani', 'Kulu', 'Lāʻaukūkahi', 'Lāʻaukūlua', 'Lāʻaupau',
  'ʻOlekūkahi', 'ʻOlekūlua', 'ʻOlepau', 'Kāloakūkahi', 'Kāloakūlua', 'Kāloapau', 'Kāne', 'Lono', 'Mauli', 'Muku',
]

function toWorld(dec, H, out) {
  const cd = Math.cos(dec)
  const east = -cd * Math.sin(H)
  const north = Math.sin(dec) * Math.cos(LATITUDE) - cd * Math.cos(H) * Math.sin(LATITUDE)
  const up = Math.sin(dec) * Math.sin(LATITUDE) + cd * Math.cos(H) * Math.cos(LATITUDE)
  return out.set(east, up, -north)
}

/** Sun & moon for a fractional day of year and local solar hour. */
export function astronomy(doy, hour, out = {}) {
  const decl = 23.44 * DEG * Math.sin((2 * Math.PI * (284 + doy)) / 365)
  const lambdaSun = (((doy - 80) / 365.25) * 360) * DEG
  const raSun = ((((doy - 80) / 365.25) * 24) % 24 + 24) % 24
  const lst = raSun + hour - 12 // hours
  out.sun = toWorld(decl, ((hour - 12) * 15) * DEG, out.sun || new THREE.Vector3())
  const t = doy + hour / 24
  const age = (((t - NEW_MOON_DOY) % SYNODIC) + SYNODIC) % SYNODIC
  const phase = age / SYNODIC
  const lambdaMoon = lambdaSun + phase * 2 * Math.PI
  const decMoon = Math.asin(Math.sin(23.44 * DEG) * Math.sin(lambdaMoon) + Math.sin(5.1 * DEG) * Math.sin(t * 0.23))
  const raMoon = (lambdaMoon / (2 * Math.PI)) * 24
  out.moon = toWorld(decMoon, ((lst - raMoon) * 15) * DEG, out.moon || new THREE.Vector3())
  out.phase = phase
  out.night = Math.min(29, Math.floor(age)) // index into MOON_NIGHTS (approximate)
  out.illum = 0.5 - 0.5 * Math.cos(phase * 2 * Math.PI)
  out.lst = lst
  out.decl = decl
  return out
}

// --- Preetham, in JS ---------------------------------------------------------
const totalRayleigh = [5.804542996261093e-6, 1.3562911419845635e-5, 3.0265902468824876e-5]
const MieConst = [1.8399918514433978e14, 2.7798023919660528e14, 4.0790479543861094e14]
const cutoffAngle = 1.6110731556870734
const steepness = 1.5
function sunIntensity(zc) {
  zc = Math.max(-1, Math.min(1, zc))
  return 1000 * Math.max(0, 1 - Math.exp(-((cutoffAngle - Math.acos(zc)) / steepness)))
}

export function skyRadiance(dir, sun, p, out = [0, 0, 0]) {
  const sunE = sunIntensity(sun.y)
  const c = 0.2 * p.turbidity * 10e-18
  const zenith = Math.acos(Math.max(0, dir.y))
  const inv = 1 / (Math.cos(zenith) + 0.15 * Math.pow(93.885 - (zenith * 180) / Math.PI, -1.253))
  const sR = 8.4e3 * inv
  const sM = 1.25e3 * inv
  const cosT = dir.x * sun.x + dir.y * sun.y + dir.z * sun.z
  const rPhase = (3 / (16 * Math.PI)) * (1 + Math.pow(cosT * 0.5 + 0.5, 2))
  const g = p.mieDirectionalG
  const g2 = g * g
  const mPhase = (1 / (4 * Math.PI)) * ((1 - g2) / Math.pow(1 - 2 * g * cosT + g2, 1.5))
  const blend = Math.min(1, Math.max(0, Math.pow(1 - sun.y, 5)))
  for (let i = 0; i < 3; i++) {
    const bR = totalRayleigh[i] * p.rayleigh
    const bM = 0.434 * c * MieConst[i] * p.mieCoefficient
    const Fex = Math.exp(-(bR * sR + bM * sM))
    const ratio = (bR * rPhase + bM * mPhase) / (bR + bM)
    let Lin = Math.pow(sunE * ratio * (1 - Fex), 1.5)
    Lin *= 1 + (Math.pow(sunE * ratio * Fex, 0.5) - 1) * blend
    const L0 = 0.1 * Fex
    const tex = (Lin + L0) * 0.04 + [0, 0.0003, 0.00075][i]
    out[i] = Math.pow(tex, 1 / 2.4)
  }
  return out
}

/** Colour of direct sunlight arriving at the ground (before the scene scale). */
export function sunTransmittance(sun, p, out = [0, 0, 0]) {
  const zenith = Math.acos(Math.max(0.0, sun.y))
  const inv = 1 / (Math.cos(zenith) + 0.15 * Math.pow(Math.max(0.01, 93.885 - (zenith * 180) / Math.PI), -1.253))
  const c = 0.2 * p.turbidity * 10e-18
  for (let i = 0; i < 3; i++) {
    const bR = totalRayleigh[i] * p.rayleigh
    const bM = 0.434 * c * MieConst[i] * p.mieCoefficient
    out[i] = Math.exp(-(bR * 8.4e3 * inv + bM * 1.25e3 * inv))
  }
  return out
}

// --- the dome ------------------------------------------------------------------
const skyVertex = /* glsl */ `
out vec3 vDir;
void main() {
  vDir = position;
  vec4 p = projectionMatrix * mat4(mat3(viewMatrix)) * vec4(position, 1.0);
  gl_Position = p.xyww;
}
`

// Shared by the visible dome and the small radiance map that the sea reflects
// and the haze takes its colour from.
const skyCommon = /* glsl */ `
uniform vec3 uSun;
uniform vec3 uMoon;
uniform float uPhase;
uniform float uIllum;
uniform float uTurbidity;
uniform float uRayleigh;
uniform float uMie;
uniform float uMieG;
uniform float uNight;
uniform float uLst;   // radians
uniform float uLat;
uniform vec3 uGalPole;
uniform vec3 uGalCentre;

const float pi = 3.141592653589793;
const vec3 totalRayleigh = vec3(5.804542996261093E-6, 1.3562911419845635E-5, 3.0265902468824876E-5);
const vec3 MieConst = vec3(1.8399918514433978E14, 2.7798023919660528E14, 4.0790479543861094E14);

float sunIntensity(float zc) {
  zc = clamp(zc, -1.0, 1.0);
  return 1000.0 * max(0.0, 1.0 - exp(-((1.6110731556870734 - acos(zc)) / 1.5)));
}
float hash13(vec3 p3) {
  p3 = fract(p3 * 0.1031);
  p3 += dot(p3, p3.zyx + 31.32);
  return fract((p3.x + p3.y) * p3.z);
}
float vnoise3(vec3 p) {
  vec3 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash13(i), hash13(i + vec3(1,0,0)), f.x), mix(hash13(i + vec3(0,1,0)), hash13(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(hash13(i + vec3(0,0,1)), hash13(i + vec3(1,0,1)), f.x), mix(hash13(i + vec3(0,1,1)), hash13(i + vec3(1,1,1)), f.x), f.y), f.z);
}

vec3 skyRadiance(vec3 dir, float disc) {
  vec3 sunDir = normalize(uSun);
  // below the horizon the sea is what you'd see; keep the horizon colour
  vec3 d = vec3(dir.x, max(dir.y, 0.0), dir.z);
  float sunE = sunIntensity(sunDir.y);
  vec3 betaR = totalRayleigh * uRayleigh;
  vec3 betaM = 0.434 * (0.2 * uTurbidity * 10E-18) * MieConst * uMie;
  float zenithAngle = acos(max(0.0, d.y));
  float inv = 1.0 / (cos(zenithAngle) + 0.15 * pow(93.885 - ((zenithAngle * 180.0) / pi), -1.253));
  vec3 Fex = exp(-(betaR * 8.4E3 * inv + betaM * 1.25E3 * inv));
  float cosTheta = dot(normalize(d + vec3(0.0, 1e-4, 0.0)), sunDir);
  float rPhase = 0.05968310365946075 * (1.0 + pow(cosTheta * 0.5 + 0.5, 2.0));
  float g2 = uMieG * uMieG;
  float mPhase = 0.07957747154594767 * ((1.0 - g2) / pow(1.0 - 2.0 * uMieG * cosTheta + g2, 1.5));
  vec3 ratio = (betaR * rPhase + betaM * mPhase) / (betaR + betaM);
  vec3 Lin = pow(sunE * ratio * (1.0 - Fex), vec3(1.5));
  Lin *= mix(vec3(1.0), pow(sunE * ratio * Fex, vec3(0.5)), clamp(pow(1.0 - sunDir.y, 5.0), 0.0, 1.0));
  vec3 L0 = vec3(0.1) * Fex;
  float sundisk = smoothstep(0.99996, 0.99999, cosTheta) * disc;
  L0 += (sunE * 19000.0 * Fex) * sundisk;
  vec3 tex = (Lin + L0) * 0.04 + vec3(0.0, 0.0003, 0.00075);
  vec3 col = pow(tex, vec3(1.0 / 2.4));

  if (uNight > 0.001) {
    // world → equatorial, for the Milky Way
    float north = -d.z, up = d.y, east = d.x;
    float sd = north * cos(uLat) + up * sin(uLat);
    float cdcH = up * cos(uLat) - north * sin(uLat);
    float H = atan(-east, cdcH);
    float ra = uLst - H;
    float cd = sqrt(max(0.0, 1.0 - sd * sd));
    vec3 eq = vec3(cd * cos(ra), cd * sin(ra), sd);
    float b = dot(eq, uGalPole);
    float band = exp(-pow(b / 0.16, 2.0));
    float core = pow(max(dot(eq, uGalCentre), 0.0), 3.0);
    float dust = vnoise3(eq * 9.0) * 0.6 + vnoise3(eq * 23.0) * 0.4;
    float mw = band * (0.35 + 0.65 * dust) * (0.5 + 1.6 * core) * disc;
    mw *= 1.0 - smoothstep(0.32, 0.12, band * dust) * 0.5;
    vec3 night = vec3(0.0035, 0.0055, 0.011) + vec3(0.016, 0.017, 0.02) * mw;
    night += vec3(0.004, 0.005, 0.006) * pow(1.0 - d.y, 6.0);
    col += night * uNight;
  }
  return col;
}
`

const skyFragment = /* glsl */ `
${skyCommon}
in vec3 vDir;
void main() {
  vec3 dir = normalize(vDir);
  vec3 col = skyRadiance(dir, 1.0);
  // --- moon ----------------------------------------------------------------
  vec3 md = normalize(uMoon);
  float mc = dot(dir, md);
  float moonR = 0.0095;
  float mDist = acos(clamp(mc, -1.0, 1.0));
  if (mDist < moonR * 1.2 && md.y > -0.05) {
    vec3 right = normalize(cross(md, vec3(0.0, 1.0, 0.0)));
    vec3 upv = cross(right, md);
    vec2 q = vec2(dot(dir - md, right), dot(dir - md, upv)) / moonR;
    float r2 = dot(q, q);
    if (r2 < 1.0) {
      float z = sqrt(1.0 - r2);
      vec3 sp = vec3(q, z);
      float ph = uPhase * 2.0 * pi;
      vec3 L = normalize(vec3(sin(ph), 0.0, -cos(ph)));
      float lit = smoothstep(-0.05, 0.08, dot(sp, L));
      float maria = 0.75 + 0.25 * vnoise3(vec3(q * 3.0, 1.0));
      vec3 moonC = vec3(1.0, 0.97, 0.9) * (0.04 + 1.6 * lit * maria) * (1.0 - 0.6 * (1.0 - uNight));
      col = mix(col, max(col, moonC), smoothstep(1.0, 0.92, r2));
    }
  }
  col += vec3(0.6, 0.65, 0.7) * pow(max(mc, 0.0), 900.0) * 0.08 * uIllum * uNight;
  gl_FragColor = vec4(col, 1.0);
}
`

// Equirect radiance map, elevation squashed toward the horizon where the sea's
// reflections and the haze need the detail. dirToSkyUv() in common.glsl.js
// is the inverse.
const skyMapFragment = /* glsl */ `
${skyCommon}
in vec2 vUv;
void main() {
  float az = (vUv.x - 0.5) * 2.0 * pi;
  float v = vUv.y * 2.0 - 1.0;
  float y = sign(v) * v * v;
  float r = sqrt(max(0.0, 1.0 - y * y));
  vec3 dir = vec3(cos(az) * r, y, sin(az) * r);
  gl_FragColor = vec4(skyRadiance(dir, 0.0), 1.0);
}
`

const starVertex = /* glsl */ `
in vec3 aStar; // ra (rad), dec (rad), magnitude
uniform float uLst;
uniform float uLat;
uniform float uPixel;
out float vBright;
out float vTw;
void main() {
  float H = uLst - aStar.x;
  float cd = cos(aStar.y);
  float east = -cd * sin(H);
  float north = sin(aStar.y) * cos(uLat) - cd * cos(H) * sin(uLat);
  float up = sin(aStar.y) * sin(uLat) + cd * cos(H) * cos(uLat);
  vec3 dir = vec3(east, up, -north);
  vBright = pow(2.512, -aStar.z) * smoothstep(-0.02, 0.12, up);
  vTw = aStar.x * 37.0 + aStar.y * 91.0;
  vec4 p = projectionMatrix * mat4(mat3(viewMatrix)) * vec4(dir * 100.0, 1.0);
  gl_Position = p.xyww;
  gl_PointSize = clamp(uPixel * (1.6 + 2.2 * sqrt(vBright)), 1.0, 9.0);
}
`
const starFragment = /* glsl */ `
uniform float uNight;
uniform float uTime;
in float vBright;
in float vTw;
void main() {
  vec2 q = gl_PointCoord * 2.0 - 1.0;
  float d = dot(q, q);
  if (d > 1.0) discard;
  float tw = 0.75 + 0.25 * sin(uTime * 3.1 + vTw) * sin(uTime * 1.7 + vTw * 0.37);
  float a = exp(-d * 4.0) * vBright * uNight * tw;
  gl_FragColor = vec4(vec3(0.9, 0.94, 1.0) * a * 1.8, 1.0);
}
`

export class Sky {
  constructor() {
    this.params = { turbidity: 3.2, rayleigh: 1.3, mieCoefficient: 0.005, mieDirectionalG: 0.82 }
    const gp = GALACTIC_POLE
    const eq = (raH, decD) => {
      const ra = (raH / 24) * 2 * Math.PI
      const dec = decD * DEG
      return new THREE.Vector3(Math.cos(dec) * Math.cos(ra), Math.cos(dec) * Math.sin(ra), Math.sin(dec))
    }
    this.uniforms = {
      uSun: { value: new THREE.Vector3(0, 1, 0) },
      uMoon: { value: new THREE.Vector3(0, -1, 0) },
      uPhase: { value: 0.5 },
      uIllum: { value: 1 },
      uTurbidity: { value: this.params.turbidity },
      uRayleigh: { value: this.params.rayleigh },
      uMie: { value: this.params.mieCoefficient },
      uMieG: { value: this.params.mieDirectionalG },
      uNight: { value: 0 },
      uLst: { value: 0 },
      uLat: { value: LATITUDE },
      uGalPole: { value: eq(gp.ra, gp.dec) },
      uGalCentre: { value: eq(17.761, -28.94) },
      uExposureHint: { value: 1 },
    }
    const dome = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1, 5),
      new THREE.ShaderMaterial({
        vertexShader: skyVertex,
        fragmentShader: skyFragment,
        uniforms: this.uniforms,
        side: THREE.BackSide,
        depthWrite: false,
      }),
    )
    dome.frustumCulled = false
    dome.renderOrder = -2
    this.dome = dome

    // stars: the named bright ones plus a field of faint ones
    const rand = mulberry32(4242)
    const stars = BRIGHT_STARS.map(([ra, dec, mag]) => [(ra / 24) * 2 * Math.PI, dec * DEG, mag])
    for (let i = 0; i < 2600; i++) {
      const u = rand() * 2 - 1
      stars.push([rand() * 2 * Math.PI, Math.asin(u), 3.4 + Math.pow(rand(), 0.55) * 2.8])
    }
    const arr = new Float32Array(stars.length * 3)
    stars.forEach((s, i) => arr.set(s, i * 3))
    const sg = new THREE.BufferGeometry()
    sg.setAttribute('aStar', new THREE.BufferAttribute(arr, 3))
    sg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(stars.length * 3), 3))
    this.starUniforms = {
      uLst: this.uniforms.uLst,
      uLat: this.uniforms.uLat,
      uNight: { value: 0 },
      uTime: { value: 0 },
      uPixel: { value: 1 },
    }
    this.stars = new THREE.Points(
      sg,
      new THREE.ShaderMaterial({
        vertexShader: starVertex,
        fragmentShader: starFragment,
        uniforms: this.starUniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    )
    this.stars.frustumCulled = false
    this.stars.renderOrder = -1
    this.group = new THREE.Group()
    this.group.add(dome, this.stars)

    this.mapRT = new THREE.WebGLRenderTarget(256, 128, { type: THREE.HalfFloatType, depthBuffer: false })
    this.mapRT.texture.wrapS = THREE.RepeatWrapping
    this.mapScene = new THREE.Scene()
    const mq = new THREE.Mesh(
      fullscreenTriangle(),
      new THREE.ShaderMaterial({
        vertexShader: `out vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
        fragmentShader: skyMapFragment,
        uniforms: this.uniforms,
        depthTest: false,
        depthWrite: false,
      }),
    )
    mq.frustumCulled = false
    this.mapScene.add(mq)
    this.mapCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    this.astro = {}
    this._v = new THREE.Vector3()
  }

  /** Redraw the small radiance map (cheap; done every frame). */
  renderMap(renderer) {
    const prev = renderer.getRenderTarget()
    renderer.setRenderTarget(this.mapRT)
    renderer.render(this.mapScene, this.mapCam)
    renderer.setRenderTarget(prev)
  }

  /**
   * Advance to a moment, update the dome, and fill `light` with the colours
   * every lit surface uses.
   */
  update(doy, hour, time, light) {
    const a = astronomy(doy, hour, this.astro)
    const sun = a.sun
    const u = this.uniforms
    u.uSun.value.copy(sun)
    u.uMoon.value.copy(a.moon)
    u.uPhase.value = a.phase
    u.uIllum.value = a.illum
    u.uLst.value = (a.lst / 24) * 2 * Math.PI
    const night = THREE.MathUtils.smoothstep(-sun.y, -0.02, 0.2)
    u.uNight.value = night
    this.starUniforms.uNight.value = night
    this.starUniforms.uTime.value = time

    // lighting, evaluated from the same model the dome draws
    const p = this.params
    const v = this._v
    const zen = skyRadiance(v.set(0, 1, 0), sun, p)
    const hor = [0, 0, 0]
    for (let k = 0; k < 8; k++) {
      const ang = (k / 8) * Math.PI * 2
      const c = skyRadiance(v.set(Math.cos(ang), 0.08, Math.sin(ang)).normalize(), sun, p)
      for (let i = 0; i < 3; i++) hor[i] += c[i] / 8
    }
    // toward the sun along the horizon (for fog glow)
    const sunH = skyRadiance(v.set(sun.x, 0.05, sun.z).normalize(), sun, p)
    const tr = sunTransmittance(sun, p)
    const up = THREE.MathUtils.smoothstep(sun.y, -0.04, 0.06)
    const sunScale = 3.2
    light.sunColor.setRGB(tr[0] * sunScale * up, tr[1] * sunScale * up, tr[2] * sunScale * up)
    const nightAmb = [0.0035, 0.005, 0.011]
    const moonUp = THREE.MathUtils.smoothstep(a.moon.y, -0.02, 0.1)
    const moonK = moonUp * a.illum * night
    light.skyColor.setRGB(
      zen[0] * 0.55 + hor[0] * 0.45 + nightAmb[0] + 0.012 * moonK,
      zen[1] * 0.55 + hor[1] * 0.45 + nightAmb[1] + 0.016 * moonK,
      zen[2] * 0.55 + hor[2] * 0.45 + nightAmb[2] + 0.024 * moonK,
    )
    // shadows on a sunny day are blue, but not that blue
    const l = light.skyColor.r * 0.2126 + light.skyColor.g * 0.7152 + light.skyColor.b * 0.0722
    light.skyColor.lerp(new THREE.Color(l, l, l), 0.35)
    light.zenith.setRGB(zen[0], zen[1], zen[2])
    light.horizon.setRGB(hor[0] + nightAmb[0], hor[1] + nightAmb[1], hor[2] + nightAmb[2])
    light.sunHorizon.setRGB(sunH[0], sunH[1], sunH[2])
    const g = 0.11
    light.groundColor.setRGB(
      (light.sunColor.r * Math.max(0, sun.y) + light.skyColor.r) * g * 1.1,
      (light.sunColor.g * Math.max(0, sun.y) + light.skyColor.g) * g,
      (light.sunColor.b * Math.max(0, sun.y) + light.skyColor.b) * g * 0.8,
    )
    light.moonColor.setRGB(0.05 * moonK, 0.06 * moonK, 0.085 * moonK)
    light.moonDir.copy(a.moon)
    light.sunDir.copy(sun)
    light.night = night
    return a
  }
}
