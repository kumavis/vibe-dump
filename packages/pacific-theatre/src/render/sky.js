// Sky, sun, moon and stars, at any place and any instant.
//
// The daylight dome is the Preetham model as implemented in three.js's Sky
// example (Wallner, Upitis, zz85), extended with a night sky: the real bright
// stars on the real celestial sphere, a Milky Way, and a moon with its phase.
// The same scattering is evaluated in JS, so the light falling on the ground
// is the light of the sky you can see: gold at dusk, blue in the shadows.
//
// Copied from holo-i-ke-au's render/sky.js (b480c27) with its astronomy
// replaced. That one took a day of the year and a local solar hour at a fixed
// 21° N, with the moon anchored on a new moon of 12 August 2026, so it was
// right by coincidence at Midway and Guadalcanal and eight to eleven days
// wrong at Pearl Harbor and Samar (R9 §2.11). Here astronomy(utcMs, lat, lon)
// is a dated low-precision ephemeris: the sun from the NOAA solar calculator's
// formulas (Meeus' low-precision sun, about 0.01°), the moon from Meeus,
// Astronomical Algorithms ch. 47, cut to its main terms (a few hundredths of
// a degree in longitude and latitude, plenty for a moonset), with the
// moon's parallax taken off its altitude. Each Sky has its own latitude and
// longitude (setPlace): the box's, from the battle clock's UTC instant. The
// table keeps a fixed war-room light (WAR_ROOM, the Hawaiian far view's
// afternoon), because a map that goes dark with the date is hard to read and
// says nothing; the battle's real sky lives only in a box.
//
// The dome and the stars are drawn at gl_Position.xyww and include the
// log-depth chunks in their far-plane form (shaders/logdepth.glsl.js), so they
// stay behind everything under the logarithmic depth buffer.

import * as THREE from 'three'
import { BRIGHT_STARS, GALACTIC_POLE } from './stars.js'
import { fullscreenTriangle } from './pipeline.js'
import { logDepthParsVertex, logDepthVertexFar, logDepthParsFragment, logDepthFragment } from './shaders/logdepth.glsl.js'

// (the ahupuaʻa generator's seeded random, for the faint star field)
function mulberry32(seed) {
  let a = seed >>> 0
  return function rand() {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const DEG = Math.PI / 180
export const SYNODIC = 29.530588853

/**
 * The table's fixed light: the Hawaiian far view's day 277 at a local solar
 * hour of 15.6, at 21° N on the prime meridian (4 October, 15:25 UTC, the
 * equation of time taken off): the sun in the west-south-west, a little
 * over 30° up.
 */
export const WAR_ROOM = { utc: Date.UTC(1942, 9, 4, 15, 25), lat: 21, lon: 0 }

const norm360 = (x) => ((x % 360) + 360) % 360

/** A direction in world axes (x east, y up, z south) from declination and hour angle (radians) at latitude lat (radians). */
function toWorld(dec, H, lat, out) {
  const cd = Math.cos(dec)
  const east = -cd * Math.sin(H)
  const north = Math.sin(dec) * Math.cos(lat) - cd * Math.cos(H) * Math.sin(lat)
  const up = Math.sin(dec) * Math.sin(lat) + cd * Math.cos(H) * Math.cos(lat)
  return out.set(east, up, -north)
}

// Meeus table 47.A (longitude and distance) and 47.B (latitude), cut to the
// terms over about 0.004°: multiples of D, M, M′, F, then Σl (1e-6°) and Σr (m)
const MOON_LR = [
  [0, 0, 1, 0, 6288774, -20905355],
  [2, 0, -1, 0, 1274027, -3699111],
  [2, 0, 0, 0, 658314, -2955968],
  [0, 0, 2, 0, 213618, -569925],
  [0, 1, 0, 0, -185116, 48888],
  [0, 0, 0, 2, -114332, -3149],
  [2, 0, -2, 0, 58793, 246158],
  [2, -1, -1, 0, 57066, -152138],
  [2, 0, 1, 0, 53322, -170733],
  [2, -1, 0, 0, 45758, -204586],
  [0, 1, -1, 0, -40923, -129620],
  [1, 0, 0, 0, -34720, 108743],
  [0, 1, 1, 0, -30383, 104755],
  [2, 0, 0, -2, 15327, 10321],
  [0, 0, 1, 2, -12528, 0],
  [0, 0, 1, -2, 10980, 79661],
  [4, 0, -1, 0, 10675, -34782],
  [0, 0, 3, 0, 10034, -23210],
  [4, 0, -2, 0, 8548, -21636],
  [2, 1, -1, 0, -7888, 24208],
  [2, 1, 0, 0, -6766, 30824],
  [1, 0, -1, 0, -5163, -8379],
  [1, 1, 0, 0, 4987, -16675],
  [2, -1, 1, 0, 4036, -12831],
  [2, 0, 2, 0, 3994, -10445],
  [4, 0, 0, 0, 3861, -11650],
  [2, 0, -3, 0, 3665, 14403],
  [0, 1, -2, 0, -2689, -7003],
]
const MOON_B = [
  [0, 0, 0, 1, 5128122],
  [0, 0, 1, 1, 280602],
  [0, 0, 1, -1, 277693],
  [2, 0, 0, -1, 173237],
  [2, 0, -1, 1, 55413],
  [2, 0, -1, -1, 46271],
  [2, 0, 0, 1, 32573],
  [0, 0, 2, 1, 17198],
  [2, 0, 1, -1, 9266],
  [0, 0, 2, -1, 8822],
  [2, -1, 0, -1, 8216],
  [2, 0, -2, -1, 4324],
  [2, 0, 1, 1, 4200],
  [2, 1, 0, -1, -3359],
  [2, -1, -1, 1, 2463],
  [2, -1, 0, 1, 2211],
  [2, -1, -1, -1, 2065],
]

/** The sun's apparent ecliptic longitude, right ascension and declination (degrees), and the true obliquity, at Julian centuries T. */
export function sunPosition(T) {
  const L0 = norm360(280.46646 + T * (36000.76983 + 0.0003032 * T))
  const M = 357.52911 + T * (35999.05029 - 0.0001537 * T)
  const C = Math.sin(M * DEG) * (1.914602 - T * (0.004817 + 0.000014 * T)) + Math.sin(2 * M * DEG) * (0.019993 - 0.000101 * T) + Math.sin(3 * M * DEG) * 0.000289
  const omega = 125.04 - 1934.136 * T
  const lambda = L0 + C - 0.00569 - 0.00478 * Math.sin(omega * DEG)
  const eps0 = 23 + (26 + (21.448 - T * (46.815 + T * (0.00059 - T * 0.001813))) / 60) / 60
  const eps = eps0 + 0.00256 * Math.cos(omega * DEG)
  const ra = Math.atan2(Math.cos(eps * DEG) * Math.sin(lambda * DEG), Math.cos(lambda * DEG)) / DEG
  const dec = Math.asin(Math.sin(eps * DEG) * Math.sin(lambda * DEG)) / DEG
  return { lambda: norm360(lambda), ra: norm360(ra), dec, eps }
}

/** The moon's geocentric ecliptic longitude and latitude (degrees), distance (km), right ascension and declination, at Julian centuries T. */
export function moonPosition(T, eps) {
  const Lp = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T
  const D = 297.8501921 + 445267.1114034 * T - 0.0018819 * T * T
  const M = 357.5291092 + 35999.0502909 * T - 0.0001536 * T * T
  const Mp = 134.9633964 + 477198.8675055 * T + 0.0087414 * T * T
  const F = 93.272095 + 483202.0175233 * T - 0.0036539 * T * T
  const E = 1 - 0.002516 * T - 0.0000074 * T * T
  const A1 = 119.75 + 131.849 * T
  const A2 = 53.09 + 479264.29 * T
  const A3 = 313.45 + 481266.484 * T
  let sl = 0
  let sr = 0
  let sb = 0
  for (const [d, m, mp, f, l, r] of MOON_LR) {
    const e = Math.abs(m) === 1 ? E : Math.abs(m) === 2 ? E * E : 1
    const arg = (d * D + m * M + mp * Mp + f * F) * DEG
    sl += l * e * Math.sin(arg)
    sr += r * e * Math.cos(arg)
  }
  for (const [d, m, mp, f, b] of MOON_B) {
    const e = Math.abs(m) === 1 ? E : Math.abs(m) === 2 ? E * E : 1
    sb += b * e * Math.sin((d * D + m * M + mp * Mp + f * F) * DEG)
  }
  sl += 3958 * Math.sin(A1 * DEG) + 1962 * Math.sin((Lp - F) * DEG) + 318 * Math.sin(A2 * DEG)
  sb += -2235 * Math.sin(Lp * DEG) + 382 * Math.sin(A3 * DEG) + 175 * Math.sin((A1 - F) * DEG) + 175 * Math.sin((A1 + F) * DEG) + 127 * Math.sin((Lp - Mp) * DEG) - 115 * Math.sin((Lp + Mp) * DEG)
  const lambda = norm360(Lp + sl / 1e6)
  const beta = sb / 1e6
  const dist = 385000.56 + sr / 1000
  const l = lambda * DEG
  const b = beta * DEG
  const e = eps * DEG
  const ra = Math.atan2(Math.sin(l) * Math.cos(e) - Math.tan(b) * Math.sin(e), Math.cos(l)) / DEG
  const dec = Math.asin(Math.sin(b) * Math.cos(e) + Math.cos(b) * Math.sin(e) * Math.sin(l)) / DEG
  return { lambda, beta, dist, ra: norm360(ra), dec }
}

/** Greenwich mean sidereal time, degrees, at Julian day jd. */
export function gmst(jd) {
  const T = (jd - 2451545) / 36525
  return norm360(280.46061837 + 360.98564736629 * (jd - 2451545) + 0.000387933 * T * T - (T * T * T) / 38710000)
}

/**
 * The sun and the moon at an instant (ms UTC), seen from latitude and
 * longitude (degrees, east positive): their directions in world axes (x east,
 * y up, z south), the moon's phase (0 new, 0.5 full) and illuminated
 * fraction, its age in days, and the local sidereal time (hours) the stars
 * turn by.
 */
export function astronomy(utcMs, lat, lon, out = {}) {
  const jd = utcMs / 86400000 + 2440587.5
  const T = (jd - 2451545) / 36525
  const sun = sunPosition(T)
  const moon = moonPosition(T, sun.eps)
  const lst = norm360(gmst(jd) + lon) // degrees
  const phi = lat * DEG
  out.sun = toWorld(sun.dec * DEG, (lst - sun.ra) * DEG, phi, out.sun || new THREE.Vector3())
  out.moon = toWorld(moon.dec * DEG, (lst - moon.ra) * DEG, phi, out.moon || new THREE.Vector3())
  // the moon's parallax (about a degree) off its altitude: what an observer on the ground sees
  const par = Math.asin(6378.14 / moon.dist)
  const alt = Math.asin(Math.max(-1, Math.min(1, out.moon.y)))
  const alt2 = alt - par * Math.cos(alt)
  const hz = Math.hypot(out.moon.x, out.moon.z) || 1e-9
  const k = Math.cos(alt2) / hz
  out.moon.set(out.moon.x * k, Math.sin(alt2), out.moon.z * k)
  const elong = Math.acos(Math.cos(moon.beta * DEG) * Math.cos((moon.lambda - sun.lambda) * DEG))
  out.phase = norm360(moon.lambda - sun.lambda) / 360
  out.illum = (1 - Math.cos(elong)) / 2
  out.age = out.phase * SYNODIC
  out.lst = lst / 15
  out.decl = sun.dec * DEG
  out.sunRaDec = [sun.ra, sun.dec]
  out.moonRaDec = [moon.ra, moon.dec]
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
${logDepthParsVertex}
out vec3 vDir;
void main() {
  vDir = position;
  vec4 p = projectionMatrix * mat4(mat3(viewMatrix)) * vec4(position, 1.0);
  gl_Position = p.xyww;
  ${logDepthVertexFar}
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
${logDepthParsFragment}
in vec3 vDir;
void main() {
  ${logDepthFragment}
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
${logDepthParsVertex}
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
  ${logDepthVertexFar}
}
`
const starFragment = /* glsl */ `
${logDepthParsFragment}
uniform float uNight;
uniform float uTime;
in float vBright;
in float vTw;
void main() {
  ${logDepthFragment}
  vec2 q = gl_PointCoord * 2.0 - 1.0;
  float d = dot(q, q);
  if (d > 1.0) discard;
  float tw = 0.75 + 0.25 * sin(uTime * 3.1 + vTw) * sin(uTime * 1.7 + vTw * 0.37);
  float a = exp(-d * 4.0) * vBright * uNight * tw;
  gl_FragColor = vec4(vec3(0.9, 0.94, 1.0) * a * 1.8, 1.0);
}
`

export class Sky {
  /** lat, lon: where the sky is seen from, degrees (the table's war room by default). */
  constructor({ lat = WAR_ROOM.lat, lon = WAR_ROOM.lon } = {}) {
    this.lat = lat
    this.lon = lon
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
      uLat: { value: lat * DEG },
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

  /** Where the sky is seen from (a box's centre), degrees. */
  setPlace(lat, lon) {
    this.lat = lat
    this.lon = lon
    this.uniforms.uLat.value = lat * DEG
  }

  /**
   * Advance to an instant (ms UTC) at this sky's place, update the dome, and
   * fill `light` with the colours every lit surface uses. `time` is the
   * app's running seconds (the stars' twinkle). The table passes WAR_ROOM.utc
   * with the war room's place set.
   */
  update(utcMs, time, light) {
    const a = astronomy(utcMs, this.lat, this.lon, this.astro)
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
