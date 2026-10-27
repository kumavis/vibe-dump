// src/squirrel.js — procedural cartoon squirrel made only of 3D Gaussian splats.
// Model builder + pivot rig + animator. Pure JS (no DOM); runs in Node and browsers.
// Deterministic for a given seed (mulberry32 PRNG, never Math.random).

export const BONE_NAMES = [
  'world', 'shadow', 'root', 'chest', 'head', 'jaw', 'nose', 'ear_l', 'ear_r', 'eye_l', 'eye_r',
  'arm_l', 'arm_r', 'acorn', 'foot_l', 'foot_r',
  'tail0', 'tail1', 'tail2', 'tail3', 'tail4', 'tail5', 'tail6', 'tail7',
];
const BONE_COUNT = 24;
const BW = 0, BSHADOW = 1, BROOT = 2, BCHEST = 3, BHEAD = 4, BJAW = 5, BNOSE = 6, BEARL = 7, BEARR = 8,
  BEYEL = 9, BEYER = 10, BARML = 11, BARMR = 12, BACORN = 13, BFOOTL = 14, BFOOTR = 15, BTAIL0 = 16;
const NTAIL = 8;

export const PART_NAMES = [
  'moss', 'grass', 'leaf', 'shadow', 'body', 'fur', 'eye', 'highlight', 'lashes', 'nose', 'teeth',
  'innerEar', 'earTuft', 'acornNut', 'acornCap', 'tailCore', 'tailStrand', 'mouth',
];
const P_MOSS = 0, P_GRASS = 1, P_LEAF = 2, P_SHADOW = 3, P_BODY = 4, P_FUR = 5, P_EYE = 6, P_HI = 7,
  P_RING = 8, P_NOSE = 9, P_TEETH = 10, P_INEAR = 11, P_TUFT = 12, P_NUT = 13, P_CAP = 14,
  P_TCORE = 15, P_TSTRAND = 16, P_MOUTH = 17;

// ---------------------------------------------------------------- utilities
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const clamp = (x, a, b) => (x < a ? a : x > b ? b : x);
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const lerp = (a, b, t) => a + (b - a) * t;
function smoothstep(e0, e1, x) { const t = clamp01((x - e0) / (e1 - e0)); return t * t * (3 - 2 * t); }
function hex(h) { return [parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255]; }
function mix3(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
function scale3(a, s) { return [a[0] * s, a[1] * s, a[2] * s]; }
const len3 = (x, y, z) => Math.sqrt(x * x + y * y + z * z);
function norm3(v) { const l = len3(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; }
function cross3(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
function dot3(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
// rotation matrix (row-major 3x3, local->world, columns = local axes) from yaw(Y) * pitch(X) * roll(Z)
function rotYXZ(yaw, pitch, roll) {
  const cy = Math.cos(yaw), sy = Math.sin(yaw), cx = Math.cos(pitch), sx = Math.sin(pitch), cz = Math.cos(roll), sz = Math.sin(roll);
  // Ry * Rx * Rz
  const m00 = cy * cz + sy * sx * sz, m01 = -cy * sz + sy * sx * cz, m02 = sy * cx;
  const m10 = cx * sz, m11 = cx * cz, m12 = -sx;
  const m20 = -sy * cz + cy * sx * sz, m21 = sy * sz + cy * sx * cz, m22 = cy * cx;
  return [m00, m01, m02, m10, m11, m12, m20, m21, m22];
}

// seeded 3D value noise in [-1, 1]
function makeNoise(rng) {
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); const t = p[i]; p[i] = p[j]; p[j] = t; }
  const P = new Uint8Array(512);
  for (let i = 0; i < 512; i++) P[i] = p[i & 255];
  const V = new Float32Array(256);
  for (let i = 0; i < 256; i++) V[i] = rng() * 2 - 1;
  return function (x, y, z) {
    const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
    const xf = x - xi, yf = y - yi, zf = z - zi;
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), w = zf * zf * (3 - 2 * zf);
    const X = xi & 255, Y = yi & 255, Z = zi & 255;
    const a = P[X] + Y, b = P[X + 1] + Y;
    const aa = P[a] + Z, ab = P[a + 1] + Z, ba = P[b] + Z, bb = P[b + 1] + Z;
    const x1 = V[P[aa]] + (V[P[ba]] - V[P[aa]]) * u, x2 = V[P[ab]] + (V[P[bb]] - V[P[ab]]) * u;
    const x3 = V[P[aa + 1]] + (V[P[ba + 1]] - V[P[aa + 1]]) * u, x4 = V[P[ab + 1]] + (V[P[bb + 1]] - V[P[ab + 1]]) * u;
    const y1 = x1 + (x2 - x1) * v, y2 = x3 + (x4 - x3) * v;
    return y1 + (y2 - y1) * w;
  };
}

// ---------------------------------------------------------------- splat store
const Q = [0, 0, 0, 1];
// quaternion (into Q) for a frame whose local z = n (normal) and local x = t projected off n
function frameQuat(tx, ty, tz, nx, ny, nz) {
  const nl = len3(nx, ny, nz) || 1;
  nx /= nl; ny /= nl; nz /= nl;
  let d = tx * nx + ty * ny + tz * nz;
  tx -= d * nx; ty -= d * ny; tz -= d * nz;
  let l = len3(tx, ty, tz);
  if (l < 1e-6) { // pick any tangent
    if (Math.abs(nx) < 0.9) { tx = 0; ty = -nz; tz = ny; } else { tx = nz; ty = 0; tz = -nx; }
    l = len3(tx, ty, tz);
  }
  tx /= l; ty /= l; tz /= l;
  const bx = ny * tz - nz * ty, by = nz * tx - nx * tz, bz = nx * ty - ny * tx; // b = n x t
  const m00 = tx, m10 = ty, m20 = tz, m01 = bx, m11 = by, m21 = bz, m02 = nx, m12 = ny, m22 = nz;
  const tr = m00 + m11 + m22;
  let qx, qy, qz, qw;
  if (tr > 0) { const s = Math.sqrt(tr + 1) * 2; qw = 0.25 * s; qx = (m21 - m12) / s; qy = (m02 - m20) / s; qz = (m10 - m01) / s; }
  else if (m00 > m11 && m00 > m22) { const s = Math.sqrt(1 + m00 - m11 - m22) * 2; qw = (m21 - m12) / s; qx = 0.25 * s; qy = (m01 + m10) / s; qz = (m02 + m20) / s; }
  else if (m11 > m22) { const s = Math.sqrt(1 + m11 - m00 - m22) * 2; qw = (m02 - m20) / s; qx = (m01 + m10) / s; qy = 0.25 * s; qz = (m12 + m21) / s; }
  else { const s = Math.sqrt(1 + m22 - m00 - m11) * 2; qw = (m10 - m01) / s; qx = (m02 + m20) / s; qy = (m12 + m21) / s; qz = 0.25 * s; }
  const ql = Math.hypot(qx, qy, qz, qw);
  Q[0] = qx / ql; Q[1] = qy / ql; Q[2] = qz / ql; Q[3] = qw / ql;
}

class Store {
  constructor(cap) { this.n = 0; this.alloc(cap); }
  alloc(cap) {
    const o = this;
    const grow = (Old, T, k) => { const a = new T(cap * k); if (Old) a.set(Old.subarray(0, o.n * k)); return a; };
    this.pos = grow(this.pos, Float32Array, 3); this.scl = grow(this.scl, Float32Array, 3);
    this.rot = grow(this.rot, Float32Array, 4); this.col = grow(this.col, Uint8Array, 4);
    this.nrm = grow(this.nrm, Float32Array, 3); this.shd = grow(this.shd, Uint8Array, 2);
    this.bon = grow(this.bon, Uint8Array, 2); this.wgt = grow(this.wgt, Float32Array, 1);
    this.prt = grow(this.prt, Uint8Array, 1);
    this.cap = cap;
  }
  // position, sigmas along (t, b, n), frame (t, n), color 0..1 + alpha 0..1, shading normal, lit 0..1, ao 0..1, bones
  add(px, py, pz, sx, sy, sz, tx, ty, tz, nx, ny, nz, r, g, b, a, snx, sny, snz, lit, ao, b0, b1, w, part) {
    if (this.n >= this.cap) this.alloc(Math.ceil(this.cap * 1.6) + 1024);
    const i = this.n++;
    frameQuat(tx, ty, tz, nx, ny, nz);
    this.pos[3 * i] = px; this.pos[3 * i + 1] = py; this.pos[3 * i + 2] = pz;
    this.scl[3 * i] = Math.max(sx, 1e-5); this.scl[3 * i + 1] = Math.max(sy, 1e-5); this.scl[3 * i + 2] = Math.max(sz, 1e-5);
    this.rot[4 * i] = Q[0]; this.rot[4 * i + 1] = Q[1]; this.rot[4 * i + 2] = Q[2]; this.rot[4 * i + 3] = Q[3];
    this.col[4 * i] = Math.round(clamp01(r) * 255); this.col[4 * i + 1] = Math.round(clamp01(g) * 255);
    this.col[4 * i + 2] = Math.round(clamp01(b) * 255); this.col[4 * i + 3] = Math.round(clamp01(a) * 255);
    const nl = len3(snx, sny, snz) || 1;
    this.nrm[3 * i] = snx / nl; this.nrm[3 * i + 1] = sny / nl; this.nrm[3 * i + 2] = snz / nl;
    this.shd[2 * i] = Math.round(clamp01(lit) * 255); this.shd[2 * i + 1] = Math.round(clamp01(ao) * 255);
    if (b0 === b1) w = 1;
    this.bon[2 * i] = b0; this.bon[2 * i + 1] = b1; this.wgt[i] = w;
    this.prt[i] = part;
  }
}

// ---------------------------------------------------------------- anatomy (rest pose, facing +Z, Y up)
// Left side = +X. Mirrored parts are defined for +X and reflected.
const A = {
  hips: { c: [0, 0.235, -0.02], r: [0.215, 0.215, 0.195] },
  chest: { c: [0, 0.425, 0.02], r: [0.152, 0.175, 0.143], pitch: 0.12 },
  head: { c: [0, 0.68, 0.05], r: [0.172, 0.157, 0.158] },
  cheek: { c: [0.086, 0.627, 0.112], r: [0.083, 0.068, 0.075] },
  muzzle: { c: [0, 0.643, 0.178], r: [0.066, 0.055, 0.072] },
  chin: { c: [0, 0.6, 0.162], r: [0.045, 0.03, 0.048] },
  haunch: { c: [0.132, 0.168, 0.05], r: [0.098, 0.118, 0.138], pitch: 0.25, yaw: 0.12 },
  foot: { c: [0.148, 0.032, 0.168], r: [0.05, 0.032, 0.118], yaw: 0.14 },
  arm: { a: [0.11, 0.505, 0.07], b: [0.066, 0.456, 0.182], ra: 0.04, rb: 0.028 },
  paw: { c: [0.06, 0.446, 0.205], r: [0.026, 0.031, 0.029] },
  ear: { c: [0.1, 0.872, -0.005], r: [0.047, 0.088, 0.02], yaw: 0.32, pitch: -0.12, roll: -0.26 },
  eyeDir: [0.074, 0.72, 0.17], eyeR: [0.034, 0.045, 0.022], eyeProud: 0.013,
  nose: { c: [0, 0.665, 0.246], r: [0.023, 0.016, 0.015] },
  acorn: { c: [0, 0.432, 0.232], tilt: 0.3 },
  // rig pivots
  pivRoot: [0, 0, 0.05], pivChest: [0, 0.31, -0.005], pivHead: [0, 0.565, 0.02], pivJaw: [0, 0.625, 0.13],
  pivNose: [0, 0.662, 0.232], pivEar: [0.088, 0.81, 0.0], pivArm: [0.105, 0.5, 0.07], pivFoot: [0.135, 0.13, 0.03],
  shadowC: [0, 0, -0.04],
};

// tail centerline control points (Catmull-Rom), from base to tip: low sweep back, S up the back, curl at the top
const TAIL_CP = [
  [0, 0.17, -0.12], [0, 0.11, -0.25], [0, 0.17, -0.38], [0, 0.34, -0.44], [0, 0.54, -0.42],
  [0, 0.71, -0.34], [0, 0.85, -0.26], [0, 0.94, -0.26], [0, 0.98, -0.35], [0, 0.94, -0.45],
  [0, 0.86, -0.48], [0, 0.8, -0.44],
];
const TAIL_DRIFT = 0.1; // lateral (+X) offset of the upper tail so it peeks out beside the head
const TAIL_CURL_S = 0.62, TAIL_CURL_YAW = 1.05; // where the top curl starts, and how far it swings outward (rad)
// tail fluff radius along normalized arc length s
function tailRadius(s) {
  if (s < 0.1) return lerp(0.05, 0.12, smoothstep(0, 0.1, s));
  if (s < 0.3) return lerp(0.12, 0.135, smoothstep(0.1, 0.3, s));
  if (s < 0.62) return lerp(0.135, 0.19, smoothstep(0.3, 0.62, s));
  if (s < 0.84) return lerp(0.19, 0.145, smoothstep(0.62, 0.84, s));
  return lerp(0.145, 0.07, smoothstep(0.84, 1.0, s));
}

// ---------------------------------------------------------------- SDF primitives
// t:0 ellipsoid {c, r, R}, t:1 tapered capsule {a, b, ra, rb}
// one shape for every primitive (monomorphic property access in the hot SDF loops)
class Prim {
  constructor(t) {
    this.t = t; this.c = null; this.r = null; this.R = null; this.yaw = 0; this.pitch = 0; this.roll = 0;
    this.a = null; this.b = null; this.ba = null; this.l2 = 0; this.ra = 0; this.rb = 0;
    this.bc = null; this.br = 0; this.rin = 0; this.arm = false; this.e1 = null; this.e2 = null;
  }
}
function ell(c, r, yaw = 0, pitch = 0, roll = 0) {
  const P = new Prim(0);
  P.c = c.slice(); P.r = r.slice(); P.R = rotYXZ(yaw, pitch, roll); P.yaw = yaw; P.pitch = pitch; P.roll = roll;
  P.bc = c.slice(); P.br = Math.max(r[0], r[1], r[2]); P.rin = Math.min(r[0], r[1], r[2]);
  return P;
}
function cap(a, b, ra, rb) {
  const P = new Prim(1), ba = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  P.a = a.slice(); P.b = b.slice(); P.ba = ba; P.l2 = dot3(ba, ba); P.ra = ra; P.rb = rb;
  P.bc = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]; P.br = Math.sqrt(P.l2) / 2 + Math.max(ra, rb); P.rin = Math.min(ra, rb);
  return P;
}
function mirror(P) {
  if (P.t === 0) return ell([-P.c[0], P.c[1], P.c[2]], P.r, -P.yaw, P.pitch, -P.roll);
  return cap([-P.a[0], P.a[1], P.a[2]], [-P.b[0], P.b[1], P.b[2]], P.ra, P.rb);
}
function primDist(P, x, y, z) {
  if (P.t === 0) {
    const dx = x - P.c[0], dy = y - P.c[1], dz = z - P.c[2], R = P.R, r = P.r;
    const lx = (R[0] * dx + R[3] * dy + R[6] * dz) / r[0];
    const ly = (R[1] * dx + R[4] * dy + R[7] * dz) / r[1];
    const lz = (R[2] * dx + R[5] * dy + R[8] * dz) / r[2];
    const k0 = Math.sqrt(lx * lx + ly * ly + lz * lz);
    const ax = lx / r[0], ay = ly / r[1], az = lz / r[2];
    const k1 = Math.sqrt(ax * ax + ay * ay + az * az);
    return k1 > 1e-9 ? (k0 * (k0 - 1)) / k1 : -Math.min(r[0], r[1], r[2]);
  }
  const pax = x - P.a[0], pay = y - P.a[1], paz = z - P.a[2], ba = P.ba;
  const t = clamp01((pax * ba[0] + pay * ba[1] + paz * ba[2]) / P.l2);
  const qx = pax - ba[0] * t, qy = pay - ba[1] * t, qz = paz - ba[2] * t;
  return Math.sqrt(qx * qx + qy * qy + qz * qz) - (P.ra + (P.rb - P.ra) * t);
}
// local ellipsoid coordinates (unit-sphere space) of a world point
function ellLocal(P, x, y, z, out) {
  const dx = x - P.c[0], dy = y - P.c[1], dz = z - P.c[2], R = P.R;
  out[0] = (R[0] * dx + R[3] * dy + R[6] * dz) / P.r[0];
  out[1] = (R[1] * dx + R[4] * dy + R[7] * dz) / P.r[1];
  out[2] = (R[2] * dx + R[5] * dy + R[8] * dz) / P.r[2];
  return out;
}
function ellWorld(P, lx, ly, lz) { // unit-sphere local -> world
  const R = P.R, x = lx * P.r[0], y = ly * P.r[1], z = lz * P.r[2];
  return [P.c[0] + R[0] * x + R[1] * y + R[2] * z, P.c[1] + R[3] * x + R[4] * y + R[5] * z, P.c[2] + R[6] * x + R[7] * y + R[8] * z];
}
function ellAxis(P, k) { const R = P.R; return [R[k], R[3 + k], R[6 + k]]; }
function ellArea(r) {
  const p = 1.6075, a = Math.pow(r[0], p), b = Math.pow(r[1], p), c = Math.pow(r[2], p);
  return 4 * Math.PI * Math.pow((a * b + a * c + b * c) / 3, 1 / p);
}

// ---------------------------------------------------------------- body SDF
const HIPS = 0, CHEST = 1, HEAD = 2, CHEEK_L = 3, CHEEK_R = 4, MUZZLE = 5, CHIN = 6, HAUNCH_L = 7, HAUNCH_R = 8,
  FOOT_L = 9, FOOT_R = 10, ARM_L = 11, ARM_R = 12, PAW_L = 13, PAW_R = 14, EAR_L = 15, EAR_R = 16, TOE_L = 17, TOE_R = 18;
const NPRIM = 19;

let BODY = null;
function makeBody() { // fixed anatomy (seed-independent): built once, shared
  if (BODY) return BODY;
  const P = new Array(NPRIM);
  P[HIPS] = ell(A.hips.c, A.hips.r);
  P[CHEST] = ell(A.chest.c, A.chest.r, 0, A.chest.pitch, 0);
  P[HEAD] = ell(A.head.c, A.head.r);
  P[CHEEK_L] = ell(A.cheek.c, A.cheek.r, 0.3, 0, -0.2); P[CHEEK_R] = mirror(P[CHEEK_L]);
  P[MUZZLE] = ell(A.muzzle.c, A.muzzle.r, 0, -0.18, 0);
  P[CHIN] = ell(A.chin.c, A.chin.r);
  P[HAUNCH_L] = ell(A.haunch.c, A.haunch.r, A.haunch.yaw, A.haunch.pitch, 0); P[HAUNCH_R] = mirror(P[HAUNCH_L]);
  P[FOOT_L] = ell(A.foot.c, A.foot.r, A.foot.yaw, 0.06, 0); P[FOOT_R] = mirror(P[FOOT_L]);
  P[ARM_L] = cap(A.arm.a, A.arm.b, A.arm.ra, A.arm.rb); P[ARM_R] = mirror(P[ARM_L]);
  P[PAW_L] = ell(A.paw.c, A.paw.r, 0.5, 0, 0); P[PAW_R] = mirror(P[PAW_L]);
  P[EAR_L] = ell(A.ear.c, A.ear.r, A.ear.yaw, A.ear.pitch, A.ear.roll); P[EAR_R] = mirror(P[EAR_L]);
  // toes: a soft bump at the front of each foot
  const tc = [A.foot.c[0] + Math.sin(A.foot.yaw) * 0.1, 0.03, A.foot.c[2] + Math.cos(A.foot.yaw) * 0.1];
  P[TOE_L] = ell(tc, [0.045, 0.03, 0.04], A.foot.yaw, 0, 0); P[TOE_R] = mirror(P[TOE_L]);
  for (const i of [ARM_L, ARM_R, PAW_L, PAW_R]) P[i].arm = true;
  BODY = P;
  return P;
}

const D = new Float64Array(NPRIM); // per-primitive distances of the latest bodySDF evaluation
// Exact per-point culling: a primitive whose lower bound exceeds (smallest upper bound + largest blend radius)
// has smooth-min weight exactly 0, so it cannot change the union; its bound is stored instead.
const LB = new Float64Array(NPRIM), K_MAX = 0.1;
function bodySDF(P, x, y, z, noArms = false) {
  let ub = Infinity;
  for (let i = 0; i < NPRIM; i++) {
    const Pr = P[i], bc = Pr.bc;
    const dx = x - bc[0], dy = y - bc[1], dz = z - bc[2];
    const dc = Math.sqrt(dx * dx + dy * dy + dz * dz);
    LB[i] = dc - Pr.br;
    if (dc - Pr.rin < ub && !(noArms && Pr.arm)) ub = dc - Pr.rin;
  }
  const thr = ub + K_MAX + 0.005;
  for (let i = 0; i < NPRIM; i++) D[i] = LB[i] > thr ? LB[i] : primDist(P[i], x, y, z);
  const n = noArms ? TAPE_NOARMS : TAPE.length;
  for (let q = 0; q < NPRIM; q++) SV[q] = D[q];
  for (let t = 0; t < n; t++) {
    const op = TAPE[t], a = SV[op[1]], b = SV[op[2]], k = op[3];
    const h = Math.max(k - Math.abs(a - b), 0) / k;
    SV[op[0]] = Math.min(a, b) - h * h * k * 0.25;
    SDA[t] = a < b ? 1 - 0.5 * h : 0.5 * h; // d(out)/da ; d(out)/db = 1 - d(out)/da
  }
  LAST_N = n;
  return SV[TAPE[n - 1][0]];
}
// The smooth union as a fixed tape of smooth-min ops: slots 0..NPRIM-1 hold primitive distances, later slots
// intermediates. A backward pass over the last evaluation gives each primitive's weight in the union, so the
// gradient is the weighted sum of analytic primitive normals (no finite differences).
const TAPE = [ // [out, a, b, k]
  [19, HIPS, CHEST, 0.1], [20, 19, HAUNCH_L, 0.06], [21, 20, HAUNCH_R, 0.06],
  [22, HEAD, CHEEK_L, 0.05], [23, 22, CHEEK_R, 0.05], [24, 23, MUZZLE, 0.045], [25, 24, CHIN, 0.03],
  [26, 25, EAR_L, 0.025], [27, 26, EAR_R, 0.025], [28, 21, 27, 0.08],
  [29, FOOT_L, TOE_L, 0.03], [30, FOOT_R, TOE_R, 0.03], [31, 28, 29, 0.04], [32, 31, 30, 0.04],
  [33, 32, ARM_L, 0.035], [34, 33, ARM_R, 0.035], [35, 34, PAW_L, 0.022], [36, 35, PAW_R, 0.022],
];
const TAPE_NOARMS = 14, NSLOT = 37;
const SV = new Float64Array(NSLOT), SDA = new Float64Array(TAPE.length), ADJ = new Float64Array(NSLOT), PN = [0, 0, 0];
let LAST_N = TAPE.length;
function lastGrad(P, x, y, z, out) { // unit gradient of the most recent bodySDF evaluation (at x, y, z)
  ADJ.fill(0);
  ADJ[TAPE[LAST_N - 1][0]] = 1;
  for (let t = LAST_N - 1; t >= 0; t--) {
    const op = TAPE[t], g = ADJ[op[0]];
    if (g === 0) continue;
    ADJ[op[1]] += g * SDA[t]; ADJ[op[2]] += g * (1 - SDA[t]);
  }
  let gx = 0, gy = 0, gz = 0;
  for (let i = 0; i < NPRIM; i++) {
    const w = ADJ[i];
    if (w < 1e-7) continue;
    primNormal(P[i], x, y, z, PN);
    gx += w * PN[0]; gy += w * PN[1]; gz += w * PN[2];
  }
  const l = len3(gx, gy, gz) || 1;
  out[0] = gx / l; out[1] = gy / l; out[2] = gz / l;
  return out;
}
function bodyGrad(P, x, y, z, out, noArms = false) { // unit gradient of the smooth union
  bodySDF(P, x, y, z, noArms);
  return lastGrad(P, x, y, z, out);
}

// ---------------------------------------------------------------- spatial hash (min-distance rejection)
class Hash {
  constructor(cell, cap) {
    this.inv = 1 / cell; this.mask = (1 << 18) - 1;
    this.head = new Int32Array(this.mask + 1).fill(-1);
    this.next = new Int32Array(cap); this.p = new Float32Array(cap * 3); this.n = 0;
  }
  _k(ix, iy, iz) { return (Math.imul(ix, 73856093) ^ Math.imul(iy, 19349663) ^ Math.imul(iz, 83492791)) & this.mask; }
  near(x, y, z, r) {
    const inv = this.inv, ix = Math.floor(x * inv), iy = Math.floor(y * inv), iz = Math.floor(z * inv), r2 = r * r;
    const R = Math.max(1, Math.ceil(r * inv)), p = this.p, next = this.next;
    for (let a = -R; a <= R; a++) for (let b = -R; b <= R; b++) for (let c = -R; c <= R; c++) {
      let j = this.head[this._k(ix + a, iy + b, iz + c)];
      while (j >= 0) {
        const dx = p[3 * j] - x, dy = p[3 * j + 1] - y, dz = p[3 * j + 2] - z;
        if (dx * dx + dy * dy + dz * dz < r2) return true;
        j = next[j];
      }
    }
    return false;
  }
  add(x, y, z) {
    if (this.n >= this.next.length) {
      const nn = new Int32Array(this.next.length * 2); nn.set(this.next); this.next = nn;
      const np = new Float32Array(this.p.length * 2); np.set(this.p); this.p = np;
    }
    const j = this.n++;
    this.p[3 * j] = x; this.p[3 * j + 1] = y; this.p[3 * j + 2] = z;
    const k = this._k(Math.floor(x * this.inv), Math.floor(y * this.inv), Math.floor(z * this.inv));
    this.next[j] = this.head[k]; this.head[k] = j;
  }
}

// ---------------------------------------------------------------- palette (sRGB 0..1)
const C = {
  main: hex('#C8682A'), dark: hex('#9A4A1E'), cream: hex('#F3DDB8'), inEar: hex('#E8A48A'), nose: hex('#7A3F3A'),
  eye: hex('#1A1210'), eyeLow: hex('#4A2C1E'), teeth: hex('#FFF8EC'), nut: hex('#B87A3A'), nutDark: hex('#8E5A2A'),
  cap: hex('#6E4B2A'), capL: hex('#8A6440'), stem: hex('#5A3C22'), tail0: hex('#B85E26'), tail1: hex('#E2A060'),
  moss0: hex('#6E8B3D'), moss1: hex('#8FA84E'), mossDark: hex('#56702E'), shadow: hex('#2A1B10'), mouth: hex('#5A2A22'),
  paw: hex('#D88A50'), white: [1, 1, 1],
  leaves: [hex('#E2572B'), hex('#F2A23A'), hex('#C9302C'), hex('#D9B04A')],
};

// ---------------------------------------------------------------- body sampling
const SPACING = new Float32Array(NPRIM).fill(1);
SPACING[HEAD] = 0.82; SPACING[CHEEK_L] = SPACING[CHEEK_R] = 0.82; SPACING[MUZZLE] = 0.62; SPACING[CHIN] = 0.62;
SPACING[FOOT_L] = SPACING[FOOT_R] = 0.85; SPACING[TOE_L] = SPACING[TOE_R] = 0.7; SPACING[ARM_L] = SPACING[ARM_R] = 0.75;
SPACING[PAW_L] = SPACING[PAW_R] = 0.55; SPACING[EAR_L] = SPACING[EAR_R] = 0.55;
const SAMPLE_ORDER = [EAR_L, EAR_R, PAW_L, PAW_R, MUZZLE, CHIN, HEAD, CHEEK_L, CHEEK_R, ARM_L, ARM_R, TOE_L, TOE_R,
  FOOT_L, FOOT_R, CHEST, HIPS, HAUNCH_L, HAUNCH_R];

function capFrame(Cp) {
  if (Cp.e1) return;
  const ax = norm3(Cp.ba);
  Cp.e1 = norm3(cross3(ax, Math.abs(ax[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0])); Cp.e2 = cross3(ax, Cp.e1);
}
const SMP = [0, 0, 0];
function sampleOnPrim(Pr, rng) { // uniform-ish point on a primitive's surface (into SMP), or null if rejected
  if (Pr.t === 0) {
    const r = Pr.r, z = rng() * 2 - 1, a = rng() * 6.283185307, s = Math.sqrt(1 - z * z);
    const ux = s * Math.cos(a), uy = s * Math.sin(a), uz = z;
    const acc = Pr.rin * Math.sqrt((ux / r[0]) ** 2 + (uy / r[1]) ** 2 + (uz / r[2]) ** 2);
    if (rng() > acc) return null;
    const R = Pr.R, x = ux * r[0], y = uy * r[1], w = uz * r[2];
    SMP[0] = Pr.c[0] + R[0] * x + R[1] * y + R[2] * w; SMP[1] = Pr.c[1] + R[3] * x + R[4] * y + R[5] * w; SMP[2] = Pr.c[2] + R[6] * x + R[7] * y + R[8] * w;
    return SMP;
  }
  capFrame(Pr);
  const t = rng(), r = Pr.ra + (Pr.rb - Pr.ra) * t;
  if (rng() > r / Math.max(Pr.ra, Pr.rb)) return null;
  const th = rng() * 6.283185307, c = Math.cos(th) * r, s = Math.sin(th) * r, e1 = Pr.e1, e2 = Pr.e2, ba = Pr.ba;
  SMP[0] = Pr.a[0] + ba[0] * t + e1[0] * c + e2[0] * s; SMP[1] = Pr.a[1] + ba[1] * t + e1[1] * c + e2[1] * s; SMP[2] = Pr.a[2] + ba[2] * t + e1[2] * c + e2[2] * s;
  return SMP;
}
function primNormal(Pr, x, y, z, out) { // exact gradient of primDist (not normalized)
  if (Pr.t === 0) {
    const dx = x - Pr.c[0], dy = y - Pr.c[1], dz = z - Pr.c[2], R = Pr.R, r = Pr.r;
    const px = R[0] * dx + R[3] * dy + R[6] * dz, py = R[1] * dx + R[4] * dy + R[7] * dz, pz = R[2] * dx + R[5] * dy + R[8] * dz;
    const i0 = 1 / (r[0] * r[0]), i1 = 1 / (r[1] * r[1]), i2 = 1 / (r[2] * r[2]);
    const k0 = Math.sqrt(px * px * i0 + py * py * i1 + pz * pz * i2) || 1e-9;
    const k1 = Math.sqrt(px * px * i0 * i0 + py * py * i1 * i1 + pz * pz * i2 * i2) || 1e-9;
    // f = k0 (k0 - 1) / k1 ;  df/dp = ((2 k0 - 1) k1 dk0 - k0 (k0 - 1) dk1) / k1^2
    const A0 = (2 * k0 - 1) / (k0 * k1), B0 = k0 * (k0 - 1) / (k1 * k1 * k1);
    const gx = px * (A0 * i0 - B0 * i0 * i0), gy = py * (A0 * i1 - B0 * i1 * i1), gz = pz * (A0 * i2 - B0 * i2 * i2);
    out[0] = R[0] * gx + R[1] * gy + R[2] * gz; out[1] = R[3] * gx + R[4] * gy + R[5] * gz; out[2] = R[6] * gx + R[7] * gy + R[8] * gz;
  } else {
    const pax = x - Pr.a[0], pay = y - Pr.a[1], paz = z - Pr.a[2], ba = Pr.ba;
    const tr = (pax * ba[0] + pay * ba[1] + paz * ba[2]) / Pr.l2, t = clamp01(tr);
    let qx = pax - ba[0] * t, qy = pay - ba[1] * t, qz = paz - ba[2] * t;
    const ql = len3(qx, qy, qz) || 1e-9;
    qx /= ql; qy /= ql; qz /= ql;
    if (tr > 0 && tr < 1) { const s = (Pr.rb - Pr.ra) / Pr.l2; qx -= s * ba[0]; qy -= s * ba[1]; qz -= s * ba[2]; }
    out[0] = qx; out[1] = qy; out[2] = qz;
  }
  return out;
}
function primArea(Pr) { return Pr.t === 0 ? ellArea(Pr.r) : Math.PI * (Pr.ra + Pr.rb) * Math.sqrt(Pr.l2); }

// groups -> bones (two-bone smooth blends at every seam)
const G_HIPS = 0, G_CHEST = 1, G_HEAD = 2, G_JAW = 3, G_EARL = 4, G_EARR = 5, G_ARML = 6, G_ARMR = 7, G_LEGL = 8, G_LEGR = 9;
const NGROUP = 10;
const GROUP_BONE = [BROOT, BCHEST, BHEAD, BJAW, BEARL, BEARR, BARML, BARMR, BFOOTL, BFOOTR];
const GROUP_BAND = [0.08, 0.08, 0.06, 0.02, 0.025, 0.025, 0.04, 0.04, 0.06, 0.06];
const GD = new Float64Array(NGROUP);
function groupDists() {
  GD[G_HIPS] = D[HIPS]; GD[G_CHEST] = D[CHEST];
  GD[G_HEAD] = Math.min(D[HEAD], D[CHEEK_L], D[CHEEK_R], D[MUZZLE]);
  GD[G_JAW] = D[CHIN] + 0.008;
  GD[G_EARL] = D[EAR_L]; GD[G_EARR] = D[EAR_R];
  GD[G_ARML] = Math.min(D[ARM_L], D[PAW_L]); GD[G_ARMR] = Math.min(D[ARM_R], D[PAW_R]);
  GD[G_LEGL] = Math.min(D[HAUNCH_L], D[FOOT_L], D[TOE_L]); GD[G_LEGR] = Math.min(D[HAUNCH_R], D[FOOT_R], D[TOE_R]);
}
const BW_OUT = { g1: 0, g2: 0, w: 1 };
function groupWeights() {
  let g1 = 0, g2 = 1;
  if (GD[g2] < GD[g1]) { g1 = 1; g2 = 0; }
  for (let g = 2; g < NGROUP; g++) {
    if (GD[g] < GD[g1]) { g2 = g1; g1 = g; } else if (GD[g] < GD[g2]) g2 = g;
  }
  const band = Math.max(GROUP_BAND[g1], GROUP_BAND[g2]);
  BW_OUT.g1 = g1; BW_OUT.g2 = g2; BW_OUT.w = 0.5 + 0.5 * smoothstep(0, band, GD[g2] - GD[g1]);
  return BW_OUT;
}

// occluder SDF for AO: body + tail core capsules + acorn
function occSDF(ctx, x, y, z, noArms) {
  let d = bodySDF(ctx.P, x, y, z, noArms);
  const tc = ctx.tailCaps;
  for (let i = 0; i < tc.length; i++) {
    const Pr = tc[i], bc = Pr.bc;
    const lb = len3(x - bc[0], y - bc[1], z - bc[2]) - Pr.br;
    if (lb < d) d = Math.min(d, primDist(Pr, x, y, z));
  }
  if (!noArms) { const ac = ctx.acornC; d = Math.min(d, len3(x - ac[0], y - ac[1], z - ac[2]) - 0.045); }
  return d;
}
const AO_D = [0.03, 0.07, 0.13], AO_W = [0.45, 0.35, 0.2];
function ambientOcc(ctx, x, y, z, nx, ny, nz, noArms = false) {
  const ds = AO_D, ws = AO_W;
  let o = 0;
  for (let i = 0; i < 3; i++) {
    const d = ds[i];
    o += ws[i] * clamp01((d - occSDF(ctx, x + nx * d, y + ny * d, z + nz * d, noArms)) / d);
  }
  return clamp(1 - 1.05 * o, 0.42, 1);
}

// eye-ring / face metric: normalized elliptical distance to eye `e` in the face plane
function eyeMetric(e, x, y, z) {
  const dx = x - e.c[0], dy = y - e.c[1], dz = z - e.c[2];
  const u = (dx * e.ex[0] + dy * e.ex[1] + dz * e.ex[2]) / e.r[0];
  const v = (dx * e.ey[0] + dy * e.ey[1] + dz * e.ey[2]) / e.r[1];
  const w = dx * e.ez[0] + dy * e.ez[1] + dz * e.ez[2];
  if (w < -0.06) return 99;
  return Math.sqrt(u * u + v * v);
}

const LOC = [0, 0, 0];
function mixInto(c, b, t) { c[0] += (b[0] - c[0]) * t; c[1] += (b[1] - c[1]) * t; c[2] += (b[2] - c[2]) * t; }
function bodyColor(ctx, x, y, z, nx, ny, nz, g1, out, isArm) {
  const P = ctx.P, noise = ctx.noise;
  const headish = g1 === G_HEAD || g1 === G_JAW;
  let dors;
  if (headish) dors = smoothstep(0.05, 0.8, ny * 0.8 - nz * 0.45);
  else if (g1 === G_EARL || g1 === G_EARR) dors = 0.55;
  else dors = smoothstep(-0.15, 0.75, -nz * 0.85 + ny * 0.3) * smoothstep(0.02, 0.2, y);
  const c = out;
  c[0] = C.main[0]; c[1] = C.main[1]; c[2] = C.main[2];
  mixInto(c, C.dark, dors * 0.8);
  let cream = 0;
  // belly / chest bib
  if (!headish && g1 !== G_EARL && g1 !== G_EARR) {
    const e = (x / 0.105) ** 2 + ((y - 0.37) / 0.25) ** 2;
    cream = Math.max(cream, (1 - smoothstep(0.7, 1.05, e)) * smoothstep(0.1, 0.45, nz));
  }
  if (headish || g1 === G_CHEST) {
    // muzzle, chin
    const dm = Math.min(D[MUZZLE], D[CHIN]);
    cream = Math.max(cream, 1 - smoothstep(0.004, 0.022, dm));
    // lower cheeks
    const low = 1 - smoothstep(A.cheek.c[1] - 0.01, A.cheek.c[1] + 0.04, y);
    for (let s = 0; s < 2; s++) {
      const dc = D[CHEEK_L + s];
      cream = Math.max(cream, (1 - smoothstep(0.004, 0.03, dc)) * low * smoothstep(-0.2, 0.3, nz));
    }
    // eye rings
    for (let s = 0; s < 2; s++) {
      const m = eyeMetric(ctx.eyes[s], x, y, z);
      cream = Math.max(cream, smoothstep(0.82, 0.92, m) * (1 - smoothstep(1.28, 1.42, m)));
    }
  }
  mixInto(c, C.cream, cream);
  // paws lighter, toes lighter
  const dp = Math.min(D[PAW_L], D[PAW_R]);
  if (isArm && dp < 0.02) mixInto(c, C.paw, (1 - smoothstep(0.0, 0.02, dp)) * 0.65);
  const dt = Math.min(D[TOE_L], D[TOE_R]);
  if (dt < 0.02) mixInto(c, C.paw, (1 - smoothstep(0.0, 0.02, dt)) * 0.45);
  // inner ear
  let inner = 0;
  if (g1 === G_EARL || g1 === G_EARR) {
    const E = P[g1 === G_EARL ? EAR_L : EAR_R];
    ellLocal(E, x, y, z, LOC);
    const front = smoothstep(0.1, 0.45, LOC[2]);
    const inside = 1 - smoothstep(0.55, 0.78, Math.hypot(LOC[0] * 1.15, (LOC[1] - 0.08) * 0.95));
    inner = front * inside;
    mixInto(c, C.inEar, inner);
  }
  // subtle low-frequency variation
  const v = noise(x * 6 + 3.1, y * 6, z * 6) * 0.06 + noise(x * 15, y * 15 + 7.7, z * 15) * 0.025;
  c[0] *= 1 + v; c[1] *= 1 + v; c[2] *= 1 + v * 0.9;
  return inner;
}

const NOSE_TIP = [0, 0.665, 0.25];
const FACE_C = [0, 0.585, -0.01];
const TORSO_C = [0, 0.3, -0.01], TORSO_R = [0.24, 0.36, 0.22];
function groomField(ctx, g, x, y, z, out) {
  switch (g) {
    case G_HEAD: case G_JAW: {
      const d = norm3([x - NOSE_TIP[0], y - NOSE_TIP[1], z - NOSE_TIP[2]]);
      out[0] = d[0]; out[1] = d[1] - 0.35; out[2] = d[2]; break;
    }
    case G_EARL: case G_EARR: { const a = ellAxis(ctx.P[g === G_EARL ? EAR_L : EAR_R], 1); out[0] = a[0]; out[1] = a[1]; out[2] = a[2]; break; }
    case G_ARML: case G_ARMR: { const ba = ctx.P[g === G_ARML ? ARM_L : ARM_R].ba; out[0] = ba[0]; out[1] = ba[1]; out[2] = ba[2]; break; }
    case G_LEGL: case G_LEGR: out[0] = (g === G_LEGL ? 1 : -1) * 0.1; out[1] = -0.75; out[2] = 0.65; break;
    default: out[0] = x * 0.4; out[1] = -1; out[2] = -0.25; break;
  }
  return out;
}

function buildBody(ctx) {
  const { P, rng, h, S } = ctx;
  // Torso/head/legs are sampled on an arm-free union so the chest surface stays complete under the arms
  // (they lift away when nibbling); arms/paws are sampled on the full union (smooth shoulder fillets) and
  // keep only points that belong to an arm.
  const hashT = new Hash(h * 0.8, 1 << 15), hashA = new Hash(h * 0.8, 1 << 12);
  const G = [0, 0, 0];
  const samples = [];
  for (const pi of SAMPLE_ORDER) {
    const Pr = P[pi], hp = h * SPACING[pi];
    const isArm = pi === ARM_L || pi === ARM_R || pi === PAW_L || pi === PAW_R;
    const hash = isArm ? hashA : hashT, noArms = !isArm;
    const target = Math.ceil(primArea(Pr) / (hp * hp) * 1.35);
    let made = 0, tries = 0;
    while (made < target && tries < target * 6) {
      tries++;
      const q = sampleOnPrim(Pr, rng);
      if (!q) continue;
      made++;
      let x = q[0], y = q[1], z = q[2];
      if (hash.near(x, y, z, hp * 0.72)) continue;
      const f0 = bodySDF(P, x, y, z, noArms);
      if (f0 < -0.035) continue;
      lastGrad(P, x, y, z, G); // Newton steps onto the zero level set of the union
      x -= f0 * G[0]; y -= f0 * G[1]; z -= f0 * G[2];
      const f1 = bodySDF(P, x, y, z, noArms);
      if (Math.abs(f1) > 0.0012) { lastGrad(P, x, y, z, G); x -= f1 * G[0]; y -= f1 * G[1]; z -= f1 * G[2]; }
      if (y < 0.002) continue; // flat under the feet: skip the hidden underside
      if (isArm) {
        bodySDF(P, x, y, z); groupDists();
        const g = groupWeights().g1;
        if (g !== G_ARML && g !== G_ARMR) continue;
      }
      if (hash.near(x, y, z, hp * 0.8)) continue;
      hash.add(x, y, z);
      samples.push(x, y, z, isArm ? -hp : hp);
    }
  }
  const col = [0, 0, 0], F1 = [0, 0, 0], F2 = [0, 0, 0];
  const eyes = ctx.eyes;
  for (let k = 0; k < samples.length; k += 4) {
    const x = samples[k], y = samples[k + 1], z = samples[k + 2], isArm = samples[k + 3] < 0, hp = Math.abs(samples[k + 3]);
    const n = bodyGrad(P, x, y, z, G, !isArm);
    const nx = n[0], ny = n[1], nz = n[2];
    const ao = ambientOcc(ctx, x, y, z, nx, ny, nz, !isArm);
    bodySDF(P, x, y, z); groupDists(); // (after AO: D[] must describe this point)
    const underArm = isArm ? 1 : 1 - smoothstep(-0.004, 0.012, Math.min(D[ARM_L], D[ARM_R], D[PAW_L], D[PAW_R]));
    if (!isArm) { GD[G_ARML] = 1e9; GD[G_ARMR] = 1e9; }
    const { g1, g2, w } = groupWeights();
    const b0 = GROUP_BONE[g1], b1 = GROUP_BONE[g2];
    const inner = bodyColor(ctx, x, y, z, nx, ny, nz, g1, col, isArm);
    // surface disc
    const st = hp * 0.92;
    groomField(ctx, g1, x, y, z, F1); groomField(ctx, g2, x, y, z, F2);
    const fx = F1[0] * w + F2[0] * (1 - w), fy = F1[1] * w + F2[1] * (1 - w), fz = F1[2] * w + F2[2] * (1 - w);
    const creamy = (col[0] + col[1] + col[2]) > 2.1 ? 1 : 0;
    const innerAo = inner > 0 ? lerp(ao, 0.92, inner) : creamy ? 1 - (1 - ao) * 0.55 : ao;
    // shading normal: on the head, blend toward a sphere around a low center (clean toon face, fewer dirty shadows)
    let snx = nx, sny = ny, snz = nz;
    const headW = (g1 === G_HEAD || g1 === G_JAW) ? (g2 === G_HEAD || g2 === G_JAW ? 1 : w) : (g2 === G_HEAD || g2 === G_JAW ? 1 - w : 0);
    if (headW > 0) {
      const sp = norm3([x - FACE_C[0], y - FACE_C[1], z - FACE_C[2]]);
      const k = 0.62 * headW;
      const m = norm3([nx + (sp[0] - nx) * k, ny + (sp[1] - ny) * k, nz + (sp[2] - nz) * k]);
      snx = m[0]; sny = m[1]; snz = m[2];
    }
    if (inner > 0) { // inner ear: a soft, lit cup facing forward-up (not a dark concave pocket)
      const m = norm3([snx * (1 - 0.6 * inner), sny * (1 - 0.6 * inner) + 0.45 * inner, snz * (1 - 0.6 * inner) + 0.5 * inner]);
      snx = m[0]; sny = m[1]; snz = m[2];
    }
    const torsoW = (g1 <= G_CHEST ? 1 : 0) * w + (g2 <= G_CHEST ? 1 : 0) * (1 - w);
    if (torsoW > 0) { // torso: blend toward a smooth pear-shaped proxy (plush look, no grey neck crease)
      const sp = norm3([(x - TORSO_C[0]) / (TORSO_R[0] ** 2), (y - TORSO_C[1]) / (TORSO_R[1] ** 2), (z - TORSO_C[2]) / (TORSO_R[2] ** 2)]);
      const k = 0.5 * torsoW;
      const m = norm3([snx + (sp[0] - snx) * k, sny + (sp[1] - sny) * k, snz + (sp[2] - snz) * k]);
      snx = m[0]; sny = m[1]; snz = m[2];
    }
    S.add(x - nx * st * 0.15, y - ny * st * 0.15, z - nz * st * 0.15, st, st, st * 0.25, fx, fy, fz, nx, ny, nz,
      col[0], col[1], col[2], 0.96, snx, sny, snz, 1, innerAo, b0, b1, w, inner > 0.5 ? P_INEAR : P_BODY);

    // ---- fur
    let L, phi;
    switch (g1) {
      case G_HEAD: L = 0.022; phi = 0.32; break;
      case G_JAW: L = 0.012; phi = 0.25; break;
      case G_CHEST: L = 0.03; phi = 0.36; break;
      case G_HIPS: L = 0.034; phi = 0.38; break;
      case G_ARML: case G_ARMR: L = 0.02; phi = 0.3; break;
      case G_LEGL: case G_LEGR: L = 0.03; phi = 0.36; break;
      default: L = 0.012; phi = 0.25; // ears
    }
    const dCheek = Math.min(D[CHEEK_L], D[CHEEK_R]);
    if (g1 === G_HEAD && dCheek < 0.02) { const t = 1 - smoothstep(0.0, 0.02, dCheek); L *= 1 + 0.45 * t; phi += 0.25 * t; }
    const dMuz = D[MUZZLE];
    if (dMuz < 0.03) L *= lerp(0.3, 1, smoothstep(0.0, 0.03, dMuz));
    const dPaw = Math.min(D[PAW_L], D[PAW_R]);
    if (isArm && dPaw < 0.03) L *= smoothstep(0.005, 0.03, dPaw);
    if (!isArm && underArm > 0) L *= 1 - 0.6 * underArm;
    const dToe = Math.min(D[TOE_L], D[TOE_R]);
    if (dToe < 0.02) L *= lerp(0.4, 1, smoothstep(0.0, 0.02, dToe));
    for (let s = 0; s < 2; s++) {
      const m = eyeMetric(eyes[s], x, y, z);
      if (m < 2.0) L *= smoothstep(1.45, 2.0, m);
    }
    if (inner > 0.05) L *= 1 - smoothstep(0.05, 0.4, inner);
    if (y < 0.012) L = 0;
    if (L < 0.005 || ao < 0.6) continue; // no fur in deep creases (hidden; pure overdraw)
    const nStrands = rng() < 0.25 ? 2 : 1;
    for (let j = 0; j < nStrands; j++) {
      // groom tangent with jitter
      let gx = fx - nx * (fx * nx + fy * ny + fz * nz), gy = fy - ny * (fx * nx + fy * ny + fz * nz), gz = fz - nz * (fx * nx + fy * ny + fz * nz);
      let gl = len3(gx, gy, gz);
      if (gl < 1e-5) { gx = 0; gy = -1; gz = 0; gl = 1; }
      gx /= gl; gy /= gl; gz /= gl;
      const bx = ny * gz - nz * gy, by = nz * gx - nx * gz, bz = nx * gy - ny * gx;
      const jit = (rng() - 0.5) * 0.5;
      const cj = Math.cos(jit), sj = Math.sin(jit);
      let tx = gx * cj + bx * sj, ty = gy * cj + by * sj, tz = gz * cj + bz * sj;
      const ph = phi * (0.8 + 0.4 * rng());
      const cp = Math.cos(ph), sp = Math.sin(ph);
      const lx = tx * cp + nx * sp, ly = ty * cp + ny * sp, lz = tz * cp + nz * sp; // strand axis
      const len = L * (0.75 + 0.5 * rng());
      const sl = len * 0.5, ss = Math.max(hp * 0.42, sl * 0.32);
      const ox = (rng() - 0.5) * hp, oy = (rng() - 0.5) * hp;
      const px = x + gx * ox + bx * oy + nx * 0.002 + lx * sl * 0.85;
      const py = y + gy * ox + by * oy + ny * 0.002 + ly * sl * 0.85;
      const pz = z + gz * ox + bz * oy + nz * 0.002 + lz * sl * 0.85;
      // strand frame: x = axis, z = surface normal made orthogonal
      const d = nx * lx + ny * ly + nz * lz;
      const qx = nx - d * lx, qy = ny - d * ly, qz = nz - d * lz;
      const lj = 0.93 + 0.14 * rng();
      S.add(px, py, pz, sl, ss, ss * 0.45, lx, ly, lz, qx, qy, qz,
        col[0] * lj, col[1] * lj, col[2] * lj, 0.78, snx, sny, snz, 1, Math.min(1, innerAo + 0.06), b0, b1, w, P_FUR);
    }
  }
  return samples.length / 4;
}

// ---------------------------------------------------------------- face features
function snapToBody(P, p, iters = 4) {
  const G = [0, 0, 0];
  let x = p[0], y = p[1], z = p[2];
  for (let i = 0; i < iters; i++) {
    const f = bodySDF(P, x, y, z);
    bodyGrad(P, x, y, z, G);
    x -= f * G[0]; y -= f * G[1]; z -= f * G[2];
  }
  bodyGrad(P, x, y, z, G);
  return { p: [x, y, z], n: G.slice() };
}
function frameFromNormal(n) {
  const ez = norm3(n), ex = norm3(cross3([0, 1, 0], ez)), ey = cross3(ez, ex);
  return { ex, ey, ez };
}
// eye frames (needed by body coloring / fur suppression)
function makeEyes(P) {
  const eyes = [];
  for (const s of [1, -1]) {
    const q = snapToBody(P, [s * A.eyeDir[0], A.eyeDir[1], A.eyeDir[2] + 0.02]);
    const f = frameFromNormal(q.n);
    const depth = 0.021;
    eyes.push({ side: s, surf: q.p, c: [q.p[0] - f.ez[0] * depth, q.p[1] - f.ez[1] * depth, q.p[2] - f.ez[2] * depth],
      ex: f.ex, ey: f.ey, ez: f.ez, r: [A.eyeR[0], A.eyeR[1], 0.036], bone: s > 0 ? BEYEL : BEYER });
  }
  return eyes;
}
function eyePoint(e, u, v, w) {
  const a = u * e.r[0], b = v * e.r[1], c = w * e.r[2];
  return [e.c[0] + e.ex[0] * a + e.ey[0] * b + e.ez[0] * c, e.c[1] + e.ex[1] * a + e.ey[1] * b + e.ez[1] * c,
    e.c[2] + e.ex[2] * a + e.ey[2] * b + e.ez[2] * c];
}
function eyeNormal(e, u, v, w) {
  const a = u / e.r[0], b = v / e.r[1], c = w / e.r[2];
  return norm3([e.ex[0] * a + e.ey[0] * b + e.ez[0] * c, e.ex[1] * a + e.ey[1] * b + e.ez[1] * c, e.ex[2] * a + e.ey[2] * b + e.ez[2] * c]);
}
// fill a 2D disk (radius rad) in a plane with small discs: hex packing
function hexDisk(rad, sp, cb) {
  const rows = Math.ceil(rad / (sp * 0.866));
  for (let j = -rows; j <= rows; j++) {
    const y = j * sp * 0.866, off = (j & 1) * sp * 0.5;
    for (let i = -Math.ceil(rad / sp) - 1; i <= Math.ceil(rad / sp) + 1; i++) {
      const x = i * sp + off;
      if (x * x + y * y <= rad * rad) cb(x, y);
    }
  }
}

function buildEyes(ctx) {
  const { P, S } = ctx;
  for (const e of ctx.eyes) {
    const b = e.bone;
    // glossy dark ellipsoid: Fibonacci points, keep the part outside the head
    const N = 1400;
    for (let i = 0; i < N; i++) {
      const w = 1 - 2 * (i + 0.5) / N, rr = Math.sqrt(1 - w * w), a = i * 2.39996323;
      const u = rr * Math.cos(a), v = rr * Math.sin(a);
      if (w < -0.1) continue;
      const p = eyePoint(e, u, v, w);
      if (bodySDF(P, p[0], p[1], p[2]) < -0.0025) continue;
      const n = eyeNormal(e, u, v, w);
      const low = smoothstep(-0.15, -0.85, v) * 0.55;
      const c = mix3(C.eye, C.eyeLow, low);
      S.add(p[0], p[1], p[2], 0.0034, 0.0034, 0.0009, e.ex[0], e.ex[1], e.ex[2], n[0], n[1], n[2],
        c[0], c[1], c[2], 1, n[0], n[1], n[2], 0.55, 1, b, b, 1, P_EYE);
    }
    // highlights (unlit): big up-left, small lower-right. Each sits where the eye's surface normal matches a
    // blend of the eye's own frame and a shared world direction, so the glints match between the eyes from the
    // front while staying inside each pupil from 3/4 views.
    const his = [[-0.36, 0.42, 0.3, 0.0026], [0.34, -0.36, 0.12, 0.002]];
    for (const [hu0, hv0, hr, hs] of his) {
      const hw0 = Math.sqrt(Math.max(0, 1 - hu0 * hu0 - hv0 * hv0));
      const own = eyeNormal(e, hu0, hv0, hw0); // normal at the frame-relative spot
      const wd = norm3([hu0 * 0.9, hv0, 0.9]);    // shared world-space direction
      const H = norm3([own[0] * 0.5 + wd[0] * 0.5, own[1] * 0.5 + wd[1] * 0.5, own[2] * 0.5 + wd[2] * 0.5]);
      // target normal in the eye frame -> point on the ellipsoid with that normal
      const nl = [dot3(H, e.ex), dot3(H, e.ey), dot3(H, e.ez)];
      const q = [e.r[0] * e.r[0] * nl[0], e.r[1] * e.r[1] * nl[1], e.r[2] * e.r[2] * nl[2]];
      const ql = Math.sqrt(q[0] * nl[0] + q[1] * nl[1] + q[2] * nl[2]);
      const hu = q[0] / ql / e.r[0], hv = q[1] / ql / e.r[1], hw = q[2] / ql / e.r[2];
      const c0 = eyePoint(e, hu, hv, hw), n = eyeNormal(e, hu, hv, hw);
      const t = norm3(cross3(n, e.ey));
      const bt = cross3(n, t);
      const rad = hr * e.r[0];
      hexDisk(rad, hs * 1.1, (x, y) => {
        const px = c0[0] + t[0] * x + bt[0] * y + n[0] * 0.0028, py = c0[1] + t[1] * x + bt[1] * y + n[1] * 0.0028,
          pz = c0[2] + t[2] * x + bt[2] * y + n[2] * 0.0028;
        S.add(px, py, pz, hs, hs, hs * 0.3, t[0], t[1], t[2], n[0], n[1], n[2], 1, 1, 1, 1, n[0], n[1], n[2], 0, 1, b, b, 1, P_HI);
      });
    }
    // closed-eye lash line on the eyelid (hidden behind the eye until it blinks into the head)
    for (let k = 0; k <= 28; k++) {
      const u = -0.78 + 1.56 * (k / 28), v = -0.2 + 0.36 * u * u;
      const q = eyePoint(e, u, v, 2.0);
      const s2 = snapToBody(P, q, 5);
      const p = s2.p, n = s2.n;
      const th = 0.0021 * (1 - 0.45 * Math.abs(u));
      S.add(p[0] + n[0] * 0.0012, p[1] + n[1] * 0.0012, p[2] + n[2] * 0.0012, 0.0034, th, 0.0008, e.ex[0], e.ex[1], e.ex[2],
        n[0], n[1], n[2], 0.17, 0.1, 0.08, 1, n[0], n[1], n[2], 1, 0.9, BHEAD, BHEAD, 1, P_RING);
    }
  }
}

function buildNoseMouth(ctx) {
  const { P, S } = ctx;
  // nose: rounded inverted triangle on the muzzle tip
  const ns = snapToBody(P, [0, A.nose.c[1], A.nose.c[2] + 0.03], 6);
  const f = frameFromNormal(norm3([ns.n[0], ns.n[1] + 0.25, ns.n[2]]));
  const nc = [ns.p[0] + f.ez[0] * 0.003, ns.p[1] + f.ez[1] * 0.003, ns.p[2] + f.ez[2] * 0.003];
  ctx.noseTip = nc;
  const r = A.nose.r, N = 700;
  for (let i = 0; i < N; i++) {
    const w = 1 - 2 * (i + 0.5) / N, rr = Math.sqrt(1 - w * w), a = i * 2.39996323;
    let u = rr * Math.cos(a), v = rr * Math.sin(a);
    if (w < -0.35) continue;
    const sq = 0.72 + 0.34 * v;
    const lx = u * r[0] * sq, ly = v * r[1], lz = w * r[2];
    const p = [nc[0] + f.ex[0] * lx + f.ey[0] * ly + f.ez[0] * lz, nc[1] + f.ex[1] * lx + f.ey[1] * ly + f.ez[1] * lz,
      nc[2] + f.ex[2] * lx + f.ey[2] * ly + f.ez[2] * lz];
    const nn = norm3([f.ex[0] * u / (r[0] * sq) + f.ey[0] * v / r[1] + f.ez[0] * w / r[2],
      f.ex[1] * u / (r[0] * sq) + f.ey[1] * v / r[1] + f.ez[1] * w / r[2], f.ex[2] * u / (r[0] * sq) + f.ey[2] * v / r[1] + f.ez[2] * w / r[2]]);
    const c = mix3(C.nose, [0.36, 0.17, 0.16], smoothstep(0.2, -0.9, v) * 0.5);
    S.add(p[0], p[1], p[2], 0.0028, 0.0028, 0.0008, f.ex[0], f.ex[1], f.ex[2], nn[0], nn[1], nn[2],
      c[0], c[1], c[2], 1, nn[0], nn[1], nn[2], 1, 1, BNOSE, BNOSE, 1, P_NOSE);
  }
  { // nose glint
    const u = -0.4, v = 0.42, w = Math.sqrt(1 - u * u - v * v);
    const p = [nc[0] + f.ex[0] * u * r[0] * 0.86 + f.ey[0] * v * r[1] + f.ez[0] * (w * r[2] + 0.002),
      nc[1] + f.ex[1] * u * r[0] * 0.86 + f.ey[1] * v * r[1] + f.ez[1] * (w * r[2] + 0.002),
      nc[2] + f.ex[2] * u * r[0] * 0.86 + f.ey[2] * v * r[1] + f.ez[2] * (w * r[2] + 0.002)];
    S.add(p[0], p[1], p[2], 0.0042, 0.0024, 0.0008, f.ex[0], f.ex[1], f.ex[2], f.ez[0], f.ez[1], f.ez[2],
      0.96, 0.78, 0.74, 0.85, f.ez[0], f.ez[1], f.ez[2], 0, 1, BNOSE, BNOSE, 1, P_HI);
  }
  // mouth: philtrum + little "w" smile, then buck teeth on a dark backing
  const mouthY = 0.628, noseBottom = nc[1] - r[1] * 0.9;
  const line = (x, y, sz, bone, part, col) => {
    const s2 = snapToBody(P, [x, y, 0.32], 7);
    const p = s2.p, n = s2.n;
    S.add(p[0] + n[0] * 0.001, p[1] + n[1] * 0.001, p[2] + n[2] * 0.001, sz, sz, sz * 0.3, 1, 0, 0, n[0], n[1], n[2],
      col[0], col[1], col[2], 1, n[0], n[1], n[2], 1, 0.85, bone, bone, 1, part);
    return s2;
  };
  for (let k = 0; k <= 7; k++) line(0, lerp(noseBottom, mouthY + 0.002, k / 7), 0.0019, BHEAD, P_MOUTH, C.mouth);
  for (const s of [1, -1]) {
    for (let k = 1; k <= 12; k++) {
      const t = k / 12, x = s * 0.023 * t, y = mouthY - 0.0055 * Math.sin(Math.PI * t) + 0.004 * t * t;
      line(x, y, 0.0018, BHEAD, P_MOUTH, C.mouth);
    }
  }
  // teeth backing + teeth (jaw)
  const top = mouthY - 0.001, bot = mouthY - 0.024;
  for (let y = top; y >= bot - 0.0001; y -= 0.0021) {
    for (let x = -0.0128; x <= 0.01281; x += 0.0021) {
      const ex = Math.abs(x) / 0.0128, ey = (top - y) / (top - bot);
      if (ey > 0.75 && ex * ex + ((ey - 0.75) / 0.25) ** 2 > 1.05) continue;
      const s2 = snapToBody(P, [x, y, 0.32], 7);
      const p = s2.p, n = s2.n;
      S.add(p[0] + n[0] * 0.0012, p[1] + n[1] * 0.0012, p[2] + n[2] * 0.0012, 0.0021, 0.0021, 0.0007, 1, 0, 0, n[0], n[1], n[2],
        C.mouth[0], C.mouth[1], C.mouth[2], 1, n[0], n[1], n[2], 1, 0.8, BJAW, BJAW, 1, P_MOUTH);
    }
  }
  for (const s of [1, -1]) {
    const cx = s * 0.0062, hw = 0.0046, t0 = top - 0.0015, b0 = bot + 0.0018;
    for (let y = t0; y >= b0 - 0.0001; y -= 0.0016) {
      for (let x = cx - hw; x <= cx + hw + 0.0001; x += 0.0016) {
        const ey = (t0 - y) / (t0 - b0), exx = (x - cx) / hw;
        if (ey > 0.72 && exx * exx + ((ey - 0.72) / 0.28) ** 2 > 1.0) continue;
        const s2 = snapToBody(P, [x, y, 0.32], 7);
        const p = s2.p, n = s2.n;
        const c = mix3(C.teeth, [0.92, 0.86, 0.76], smoothstep(0.4, 1, ey) * 0.4);
        S.add(p[0] + n[0] * 0.0034, p[1] + n[1] * 0.0034, p[2] + n[2] * 0.0034, 0.0017, 0.0017, 0.0006, 1, 0, 0, n[0], n[1], n[2],
          c[0], c[1], c[2], 1, n[0], n[1], n[2], 0.75, 1, BJAW, BJAW, 1, P_TEETH);
      }
    }
  }
}

// ---------------------------------------------------------------- ear tufts
function buildEarTufts(ctx) { // a soft flame-shaped tuft at each ear tip, curling slightly outward/back
  const { P, S, rng, density } = ctx;
  const cBase = hex('#6A2C10'), cTip = hex('#B65A26');
  for (const side of [0, 1]) {
    const E = P[side === 0 ? EAR_L : EAR_R], bone = side === 0 ? BEARL : BEARR;
    const up = ellAxis(E, 1), fw = ellAxis(E, 2);
    const outw = side === 0 ? 1 : -1;
    const out = norm3([ellAxis(E, 0)[0] * outw, ellAxis(E, 0)[1] * outw, ellAxis(E, 0)[2] * outw]); // away from the head
    const tip = ellWorld(E, 0, 0.9, -0.15);
    const n = Math.round(60 * Math.sqrt(density) + 10);
    for (let i = 0; i < n; i++) {
      const a = rng() * 6.283, rr = Math.sqrt(rng()) * 0.014;
      const base = [tip[0] + out[0] * Math.cos(a) * rr + fw[0] * Math.sin(a) * rr * 0.5 - up[0] * 0.012,
        tip[1] + out[1] * Math.cos(a) * rr + fw[1] * Math.sin(a) * rr * 0.5 - up[1] * 0.012,
        tip[2] + out[2] * Math.cos(a) * rr + fw[2] * Math.sin(a) * rr * 0.5 - up[2] * 0.012];
      const sx = (rng() - 0.5) * 0.35 + 0.1, sb = 0.05 + rng() * 0.2;
      const dir = norm3([up[0] + out[0] * sx - fw[0] * sb, up[1] + out[1] * sx - fw[1] * sb, up[2] + out[2] * sx - fw[2] * sb]);
      const len = 0.05 + rng() * 0.045;
      const K = 3;
      let prev = base;
      for (let k = 1; k <= K; k++) {
        const u = k / K, bend = 0.35 * u * u;
        const d2 = norm3([dir[0] + out[0] * bend * 0.6 - fw[0] * bend, dir[1] + out[1] * bend * 0.6 - fw[1] * bend, dir[2] + out[2] * bend * 0.6 - fw[2] * bend]);
        const q = [base[0] + d2[0] * len * u, base[1] + d2[1] * len * u, base[2] + d2[2] * len * u];
        const dx = q[0] - prev[0], dy = q[1] - prev[1], dz = q[2] - prev[2], sl = len3(dx, dy, dz);
        const c = mix3(cBase, cTip, (u - 0.25) * 0.8 + rng() * 0.12);
        const ss = 0.0048 * (1 - 0.4 * u);
        S.add((q[0] + prev[0]) / 2, (q[1] + prev[1]) / 2, (q[2] + prev[2]) / 2, sl * 0.62, ss, ss * 0.6, dx, dy, dz, fw[0], fw[1], fw[2],
          c[0], c[1], c[2], 0.88 - 0.25 * u * u, fw[0] * 0.5 + out[0] * 0.5 + up[0] * 0.4, fw[1] * 0.5 + out[1] * 0.5 + up[1] * 0.4,
          fw[2] * 0.5 + out[2] * 0.5 + up[2] * 0.4, 1, 1, bone, bone, 1, P_TUFT);
        prev = q;
      }
    }
  }
}

// ---------------------------------------------------------------- acorn (held in both paws)
function acornFrame() {
  const t = A.acorn.tilt;
  const ay = norm3([0.12, Math.cos(t), Math.sin(t)]);
  const ax = norm3(cross3(ay, [0, 0, 1])), az = cross3(ax, ay);
  return { c: A.acorn.c, ax, ay, az };
}
function buildAcorn(ctx) {
  const { S, rng, h, P } = ctx;
  const F = acornFrame();
  const sp = Math.min(0.0045, h * 0.55);
  const Rn = 0.041, Hn = 0.051, nutC = [F.c[0] - F.ay[0] * 0.01, F.c[1] - F.ay[1] * 0.01, F.c[2] - F.ay[2] * 0.01];
  const at = (c, hh, th, rad) => {
    const cs = Math.cos(th), sn = Math.sin(th);
    return [c[0] + F.ay[0] * hh + (F.ax[0] * cs + F.az[0] * sn) * rad, c[1] + F.ay[1] * hh + (F.ax[1] * cs + F.az[1] * sn) * rad,
      c[2] + F.ay[2] * hh + (F.ax[2] * cs + F.az[2] * sn) * rad];
  };
  const radial = (th) => [F.ax[0] * Math.cos(th) + F.az[0] * Math.sin(th), F.ax[1] * Math.cos(th) + F.az[1] * Math.sin(th),
    F.ax[2] * Math.cos(th) + F.az[2] * Math.sin(th)];
  const nutRho = (u) => Rn * Math.sqrt(Math.max(0, 1 - u * u)) * (1 + 0.14 * u) * (u < 0 ? 1 - 0.18 * u * u : 1);
  const aoAt = (p, n) => {
    let o = 0;
    for (const d of [0.02, 0.05]) o += 0.5 * clamp01((d - bodySDF(P, p[0] + n[0] * d, p[1] + n[1] * d, p[2] + n[2] * d)) / d);
    return clamp(1 - o, 0.4, 1);
  };
  // nut: rings along the axis
  const capBase = 0.34;
  let u = -1;
  while (u <= capBase + 0.12) {
    const rho = nutRho(u);
    const ring = Math.max(1, Math.ceil((6.283 * rho) / sp));
    const th0 = rng() * 6.283;
    for (let k = 0; k < ring; k++) {
      const th = th0 + (k / ring) * 6.283;
      const p = at(nutC, u * Hn, th, rho);
      const dr = (nutRho(u + 0.02) - nutRho(u - 0.02)) / (0.04 * Hn);
      const rd = radial(th);
      const n = norm3([rd[0] - F.ay[0] * dr, rd[1] - F.ay[1] * dr, rd[2] - F.ay[2] * dr]);
      const stripe = 0.05 * Math.sin(th * 9 + u * 2) + 0.03 * ctx.noise(p[0] * 60, p[1] * 60, p[2] * 60);
      let c = mix3(C.nutDark, C.nut, smoothstep(-1, -0.3, u));
      c = mix3(c, hex('#D49A55'), smoothstep(0.05, 0.3, u) * 0.6);
      c = scale3(c, 1 + stripe);
      if (u < -0.88) c = mix3(c, hex('#4A3018'), 0.8);
      S.add(p[0], p[1], p[2], sp * 0.85, sp * 0.85, sp * 0.22, F.ay[0], F.ay[1], F.ay[2], n[0], n[1], n[2],
        c[0], c[1], c[2], 1, n[0], n[1], n[2], 1, aoAt(p, n), BACORN, BACORN, 1, P_NUT);
    }
    u += sp / Math.max(Hn * Math.hypot(1, (nutRho(u + 0.02) - nutRho(u - 0.02)) / (0.04 * Hn)), 0.004) * 0.85;
  }
  // cap: dome over the top with a crosshatch of raised scales
  const Rc = nutRho(capBase) * 1.17, Hc = 0.03, capC = [nutC[0] + F.ay[0] * capBase * Hn, nutC[1] + F.ay[1] * capBase * Hn, nutC[2] + F.ay[2] * capBase * Hn];
  let psi = -0.25;
  while (psi <= 1.5708) {
    const rad = Rc * Math.cos(Math.max(psi, 0)) * (psi < 0 ? 1 - 0.05 * psi * psi : 1), hh = Hc * Math.sin(psi);
    const ring = Math.max(1, Math.ceil((6.283 * rad) / sp));
    const th0 = rng() * 6.283;
    for (let k = 0; k < ring; k++) {
      const th = th0 + (k / ring) * 6.283;
      const rd = radial(th);
      const n = norm3([rd[0] * Math.cos(psi) * Hc / Rc + F.ay[0] * Math.sin(Math.max(psi, 0.05)),
        rd[1] * Math.cos(psi) * Hc / Rc + F.ay[1] * Math.sin(Math.max(psi, 0.05)),
        rd[2] * Math.cos(psi) * Hc / Rc + F.ay[2] * Math.sin(Math.max(psi, 0.05))]);
      const n2 = psi < 0.15 ? norm3([rd[0] + n[0], rd[1] + n[1], rd[2] + n[2]]) : n;
      const sc = Math.sin(th * 11 + psi * 9) * Math.sin(th * 11 - psi * 9);
      const bump = smoothstep(0.1, 0.6, sc);
      const lift = 0.0016 * bump;
      const p = at(capC, hh, th, rad);
      let c = mix3(C.cap, C.capL, bump * 0.9);
      c = scale3(c, 0.92 + 0.12 * rng());
      S.add(p[0] + n2[0] * lift, p[1] + n2[1] * lift, p[2] + n2[2] * lift, sp * 0.8, sp * 0.8, sp * 0.3, F.ay[0], F.ay[1], F.ay[2],
        n2[0], n2[1], n2[2], c[0], c[1], c[2], 1, n2[0], n2[1], n2[2], 1, aoAt(p, n2), BACORN, BACORN, 1, P_CAP);
    }
    psi += sp / Math.max(Math.hypot(Rc * Math.sin(Math.max(psi, 0)), Hc * Math.cos(psi)), 0.006) * 0.8;
  }
  // stem
  const top = [capC[0] + F.ay[0] * Hc, capC[1] + F.ay[1] * Hc, capC[2] + F.ay[2] * Hc];
  for (let k = 0; k < 6; k++) {
    const t = k / 5, bend = 0.004 * t * t;
    const p = [top[0] + F.ay[0] * 0.016 * t + F.az[0] * bend, top[1] + F.ay[1] * 0.016 * t + F.az[1] * bend, top[2] + F.ay[2] * 0.016 * t + F.az[2] * bend];
    S.add(p[0], p[1], p[2], 0.0045, 0.0038, 0.0038, F.ay[0], F.ay[1], F.ay[2], F.az[0], F.az[1], F.az[2],
      C.stem[0], C.stem[1], C.stem[2], 1, F.az[0], F.az[1], F.az[2], 1, 1, BACORN, BACORN, 1, P_CAP);
  }
}

// ---------------------------------------------------------------- tail (volumetric)
function catmull(P, i, t) {
  const p0 = P[Math.max(i - 1, 0)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(i + 2, P.length - 1)];
  const t2 = t * t, t3 = t2 * t;
  const o = [0, 0, 0];
  for (let k = 0; k < 3; k++) {
    o[k] = 0.5 * ((2 * p1[k]) + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3);
  }
  return o;
}
// arc-length table of the tail spline -> {pts, tan, nrm, len}
function makeTailCurve() {
  const raw = [];
  const seg = TAIL_CP.length - 1, sub = 40;
  for (let i = 0; i < seg; i++) for (let j = 0; j < sub; j++) raw.push(catmull(TAIL_CP, i, j / sub));
  raw.push(TAIL_CP[seg].slice());
  // lateral drift toward +X in the upper tail so it peeks out beside the head, and the top curl
  // swung outward (rotated about Y) so the curl reads from the front as well as from the side
  const cum = [0];
  for (let i = 1; i < raw.length; i++) cum.push(cum[i - 1] + len3(raw[i][0] - raw[i - 1][0], raw[i][1] - raw[i - 1][1], raw[i][2] - raw[i - 1][2]));
  const L0 = cum[cum.length - 1];
  let pivot = null;
  for (let i = 0; i < raw.length; i++) {
    const u = cum[i] / L0;
    if (u >= TAIL_CURL_S && !pivot) pivot = raw[i].slice();
    if (pivot) {
      const th = -TAIL_CURL_YAW * smoothstep(TAIL_CURL_S, 0.92, u), c = Math.cos(th), sn = Math.sin(th);
      const dx = raw[i][0] - pivot[0], dz = raw[i][2] - pivot[2];
      raw[i][0] = pivot[0] + dx * c + dz * sn; raw[i][2] = pivot[2] - dx * sn + dz * c;
    }
    raw[i][0] += TAIL_DRIFT * smoothstep(0.22, 0.75, u);
  }
  const M = 160, pts = [], tan = [], nrm = [], lat = [];
  const cum2 = [0];
  for (let i = 1; i < raw.length; i++) cum2.push(cum2[i - 1] + len3(raw[i][0] - raw[i - 1][0], raw[i][1] - raw[i - 1][1], raw[i][2] - raw[i - 1][2]));
  const L = cum2[cum2.length - 1];
  let j = 0;
  for (let m = 0; m <= M; m++) {
    const target = (m / M) * L;
    while (j < raw.length - 2 && cum2[j + 1] < target) j++;
    const f = clamp01((target - cum2[j]) / Math.max(cum2[j + 1] - cum2[j], 1e-9));
    pts.push(mix3(raw[j], raw[j + 1], f));
  }
  for (let m = 0; m <= M; m++) {
    const a = pts[Math.max(m - 1, 0)], b = pts[Math.min(m + 1, M)];
    const T = norm3([b[0] - a[0], b[1] - a[1], b[2] - a[2]]);
    const Lt = norm3(cross3(cross3(T, [1, 0, 0]), T)); // lateral (≈ +X) orthogonal to T
    const lx = Lt[0] < 0 ? scale3(Lt, -1) : Lt;
    tan.push(T); lat.push(lx); nrm.push(cross3(T, lx)); // nrm: in-plane normal
  }
  return { pts, tan, nrm, lat, len: L, M };
}
function curveAt(TC, s) {
  const f = clamp01(s) * TC.M, i = Math.min(Math.floor(f), TC.M - 1), t = f - i;
  return { p: mix3(TC.pts[i], TC.pts[i + 1], t), T: norm3(mix3(TC.tan[i], TC.tan[i + 1], t)),
    N: norm3(mix3(TC.nrm[i], TC.nrm[i + 1], t)), B: norm3(mix3(TC.lat[i], TC.lat[i + 1], t)) };
}
const TB = [0, 0, 1];
function tailBones(s) { // -> TB = [b0, b1, w] (shared scratch; copy if needed)
  if (s < 0.07) { TB[0] = BTAIL0; TB[1] = BROOT; TB[2] = smoothstep(0.0, 0.07, s) * 0.5 + 0.5; return TB; }
  const c = s * NTAIL - 0.5;
  const k0 = Math.floor(c), t = c - k0;
  if (k0 < 0) { TB[0] = TB[1] = BTAIL0; TB[2] = 1; return TB; }
  if (k0 >= NTAIL - 1) { TB[0] = TB[1] = BTAIL0 + NTAIL - 1; TB[2] = 1; return TB; }
  TB[0] = BTAIL0 + k0; TB[1] = BTAIL0 + k0 + 1; TB[2] = 1 - smoothstep(0, 1, t);
  return TB;
}

const TAIL_UP = 0.45, TAIL_LIT = 0.8;
// Fill-rate budget (phones): only the outer strand layers are ever visible, so
//  - the hidden core tube is fat (strands start at ~2/3 of the fluff radius) and its splats barely overlap,
//  - strand segments overlap less along the strand (sigma = 0.52 x segment length),
//  - each clump's coverage (strands x thickness = TAIL_COVER) is fixed; density only changes how finely it is
//    split into strands, so the fill cost grows much slower than the splat count.
const TAIL_CORE_F = 0.7, TAIL_CLUMPS = 1500, TAIL_SEG_SIGMA = 0.52, TAIL_TIP_PINCH = 0.55;
const TAIL_COVER = 4.75;
function buildTail(ctx) {
  const { S, rng, density, TC, noise } = ctx;
  const flat = 0.88; // cross-section: lateral radius R, in-plane radius flat*R
  const L = TC.len;
  const ellDir = (f, cs, sn) => norm3([f.B[0] * cs + f.N[0] * sn * flat, f.B[1] * cs + f.N[1] * sn * flat, f.B[2] * cs + f.N[2] * sn * flat]);
  const ellNrm = (f, cs, sn) => norm3([f.B[0] * cs + f.N[0] * sn / flat, f.B[1] * cs + f.N[1] * sn / flat, f.B[2] * cs + f.N[2] * sn / flat]);
  // --- core: flat discs on an inner tube (opaque, hides the inside; mostly covered by strands)
  const hc = 0.016 / Math.sqrt(Math.max(density, 0.7)); // hidden tube: no need to coarsen it at low density
  const coreF = TAIL_CORE_F;
  let s = 0.0;
  while (s <= 1) {
    const f = curveAt(TC, s), R = tailRadius(s) * coreF;
    const ring = Math.max(5, Math.ceil(6.283 * R * (1 + flat) * 0.5 / hc));
    const th0 = rng() * 6.283;
    const [b0, b1, w] = tailBones(s); // (copied out of the scratch array)
    for (let k = 0; k < ring; k++) {
      const th = th0 + (k + rng() * 0.5) / ring * 6.283, cs = Math.cos(th), sn = Math.sin(th);
      const p = [f.p[0] + (f.B[0] * cs + f.N[0] * sn * flat) * R, f.p[1] + (f.B[1] * cs + f.N[1] * sn * flat) * R,
        f.p[2] + (f.B[2] * cs + f.N[2] * sn * flat) * R];
      const nn = ellNrm(f, cs, sn), sn2 = norm3([nn[0], nn[1] + TAIL_UP, nn[2]]);
      // the core now shows through the thinner strand layer here and there: tint it like the strands' mid-length
      let c = mix3(C.tail0, C.tail1, 0.12 + 0.3 * smoothstep(0.15, 1.0, s));
      c = mix3(c, C.tail1, smoothstep(0.8, 1.0, s) * 0.4);
      S.add(p[0], p[1], p[2], hc * 1.0, hc * 0.75, hc * 0.3, f.T[0], f.T[1], f.T[2], nn[0], nn[1], nn[2],
        c[0], c[1], c[2], 0.97, sn2[0], sn2[1], sn2[2], TAIL_LIT, 0.7, b0, b1, w, P_TCORE);
    }
    s += hc / L * 1.1;
  }
  { // close the core at the tip
    const f = curveAt(TC, 1), R = tailRadius(1) * coreF;
    hexDisk(R, hc, (x, y) => {
      const p = [f.p[0] + f.B[0] * x + f.N[0] * y * flat, f.p[1] + f.B[1] * x + f.N[1] * y * flat, f.p[2] + f.B[2] * x + f.N[2] * y * flat];
      S.add(p[0], p[1], p[2], hc * 0.75, hc * 0.75, hc * 0.3, f.B[0], f.B[1], f.B[2], f.T[0], f.T[1], f.T[2],
        C.tail1[0], C.tail1[1], C.tail1[2], 0.97, f.T[0], f.T[1], f.T[2], 1, 0.8, BTAIL0 + 7, BTAIL0 + 7, 1, P_TCORE);
    });
  }
  // --- fur clumps: strands rooted on the core, flaring out and curving toward the tip, converging to pointed clump tips
  const nClumps = Math.round(TAIL_CLUMPS * Math.pow(density, 0.82) * (1 + 0.3 * Math.max(0, density - 1)));
  // strands per clump: 7 at low density (softer, thicker), 8 at medium, 10 at high; total coverage stays constant
  const perClump = Math.round(density <= 0.45 ? 7 : density <= 1 ? 7 + (density - 0.45) / 0.55 : 8 + 2 * Math.min(1, (density - 1) / 0.8));
  const thickF = TAIL_COVER / perClump;
  const NS = 200, cdf = new Float64Array(NS + 1);
  for (let i = 1; i <= NS; i++) cdf[i] = cdf[i - 1] + tailRadius((i - 0.5) / NS);
  for (let i = 1; i <= NS; i++) cdf[i] /= cdf[NS];
  const fringe = mix3(C.tail1, C.cream, 0.6), rootC = mix3(C.tail0, C.dark, 0.1);
  for (let c = 0; c < nClumps; c++) {
    const u = rng();
    let lo = 0, hi = NS;
    while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (cdf[mid] < u) lo = mid; else hi = mid; }
    const s0 = clamp01((lo + (u - cdf[lo]) / Math.max(cdf[hi] - cdf[lo], 1e-9)) / NS);
    const f = curveAt(TC, s0), R = tailRadius(s0);
    const th = rng() * 6.283, cs = Math.cos(th), sn = Math.sin(th);
    const rd = ellDir(f, cs, sn), en = ellNrm(f, cs, sn), er = Math.hypot(cs, sn * flat);
    const sn2 = norm3([en[0], en[1] + TAIL_UP, en[2]]); // fluffy volume: softer, sky-biased shading normal
    const circ = norm3(cross3(f.T, rd)); // around the tail
    const rc = R * coreF * er * 0.95;
    const chev = Math.sin(6.283 * (s0 * L / 0.075) + 2.2 * Math.abs(cs)); // soft chevron scallops along the tail
    const big = 0.05 * chev + noise(s0 * 11.0, cs * 1.6 + 2.0, sn * 1.6) * 0.06;
    const reach = R * er * (0.95 + 0.16 * rng() + big);
    const a0 = 0.55 + 0.25 * rng(), a1 = 0.14 + 0.16 * rng(); // start flared, end combed toward the tip
    const d0 = [f.T[0] * Math.cos(a0) + rd[0] * Math.sin(a0), f.T[1] * Math.cos(a0) + rd[1] * Math.sin(a0), f.T[2] * Math.cos(a0) + rd[2] * Math.sin(a0)];
    const d1 = [f.T[0] * Math.cos(a1) + rd[0] * Math.sin(a1), f.T[1] * Math.cos(a1) + rd[1] * Math.sin(a1), f.T[2] * Math.cos(a1) + rd[2] * Math.sin(a1)];
    const outLen = Math.max(reach - rc, 0.025);
    const len = outLen / (0.5 * Math.sin(a0) + 0.5 * Math.sin(a1)) * 0.92;
    // tip of the clump (radial reach `outLen`, swept along T)
    const root = [f.p[0] + rd[0] * rc, f.p[1] + rd[1] * rc, f.p[2] + rd[2] * rc];
    const tip = [root[0] + (d0[0] + d1[0]) * 0.5 * len, root[1] + (d0[1] + d1[1]) * 0.5 * len, root[2] + (d0[2] + d1[2]) * 0.5 * len];
    const sTip = clamp01(s0 + dot3([tip[0] - f.p[0], tip[1] - f.p[1], tip[2] - f.p[2]], f.T) / L);
    const outer = smoothstep(0.98, 1.12, reach / (R * er));
    const lightJ = 0.96 + 0.08 * rng();
    const cw = 0.016 + 0.02 * rng();
    const K = Math.max(2, Math.ceil(len / 0.05));
    for (let j = 0; j < perClump; j++) {
      const oa = (rng() - 0.5) * 2 * cw, ob = (rng() - 0.5) * 2 * cw;
      const ox = circ[0] * oa + f.T[0] * ob, oy = circ[1] * oa + f.T[1] * ob, oz = circ[2] * oa + f.T[2] * ob;
      const p0x = root[0] + ox, p0y = root[1] + oy, p0z = root[2] + oz;
      const p2x = tip[0] + ox * TAIL_TIP_PINCH, p2y = tip[1] + oy * TAIL_TIP_PINCH, p2z = tip[2] + oz * TAIL_TIP_PINCH;
      const p1x = p0x + d0[0] * len * 0.5, p1y = p0y + d0[1] * len * 0.5, p1z = p0z + d0[2] * len * 0.5;
      let qx = p0x, qy = p0y, qz = p0z;
      const thick0 = (0.0075 + 0.003 * rng()) * thickF;
      for (let k = 1; k <= K; k++) {
        const v = k / K, iv = 1 - v;
        const bx = iv * iv * p0x + 2 * iv * v * p1x + v * v * p2x;
        const by = iv * iv * p0y + 2 * iv * v * p1y + v * v * p2y;
        const bz = iv * iv * p0z + 2 * iv * v * p1z + v * v * p2z;
        const dx = bx - qx, dy = by - qy, dz = bz - qz;
        const sl = len3(dx, dy, dz);
        const cx = (bx + qx) * 0.5, cz = (bz + qz) * 0.5;
        const cy = Math.max((by + qy) * 0.5, 0.012); // strands touching the ground splay on it
        qx = bx; qy = by; qz = bz;
        const vm = (k - 0.5) / K;
        const sAt = lerp(s0, sTip, vm);
        const tb = tailBones(sAt);
        const along = smoothstep(0.15, 1.0, sAt);
        const base = mix3(C.tail0, C.tail1, along * along * 0.55);
        const col = mix3(rootC, base, smoothstep(0.0, 0.45, vm));
        mixInto(col, C.tail1, smoothstep(0.65, 1.0, vm) * 0.3);
        mixInto(col, fringe, outer * smoothstep(0.7, 1.0, vm) * 0.8);
        const thick = thick0 * (1 - 0.45 * vm);
        const alpha = 0.95 - 0.42 * vm * vm;
        S.add(cx, cy, cz, Math.min(Math.max(sl * TAIL_SEG_SIGMA, thick), 0.044), thick, thick * 0.6, dx, dy, dz, en[0], en[1], en[2],
          col[0] * lightJ, col[1] * lightJ, col[2] * lightJ, alpha, sn2[0], sn2[1], sn2[2], TAIL_LIT, 0.84 + 0.16 * vm,
          tb[0], tb[1], tb[2], P_TSTRAND);
      }
    }
  }
}

// ---------------------------------------------------------------- ground diorama + contact shadow
function buildGround(ctx) {
  const { S, rng, density, noise } = ctx;
  const Rm = 0.7;
  // moss: soft round patch, hex-ish jittered discs
  const sp = 0.021 / Math.sqrt(Math.min(density, 1.4));
  for (let gy = -Rm - sp; gy <= Rm + sp; gy += sp * 0.866) {
    const row = Math.round(gy / (sp * 0.866));
    for (let gx = -Rm - sp; gx <= Rm + sp; gx += sp) {
      const x = gx + (row & 1) * sp * 0.5 + (rng() - 0.5) * sp * 0.7, z = gy + (rng() - 0.5) * sp * 0.7;
      const r = Math.hypot(x, z);
      const edge = Rm * (1 + 0.07 * noise(Math.atan2(z, x) * 2.5, 0.3, 1.7));
      if (r > edge) continue;
      const fade = 1 - smoothstep(edge * 0.72, edge, r);
      if (rng() > 0.35 + 0.65 * fade) continue;
      const nv = noise(x * 7, 0.5, z * 7) * 0.5 + noise(x * 22, 2.5, z * 22) * 0.35;
      const y = 0.003 + 0.004 * (nv + 0.5) * fade;
      let c = mix3(C.moss0, C.moss1, clamp01(0.5 + nv));
      c = mix3(c, C.mossDark, clamp01(-nv * 1.2) * 0.6);
      c = scale3(c, 0.92 + 0.16 * rng());
      const n = norm3([-noise(x * 7 + 0.1, 0.5, z * 7) * 0.15, 1, -noise(x * 7, 0.5, z * 7 + 0.1) * 0.15]);
      // footprint ~0.7x the spacing (~3-4 layers deep instead of ~8); the soft edge keeps its reach via the
      // larger, fainter splats near the rim
      const sg = sp * (0.64 + 0.16 * rng()) * (1 + 0.25 * (1 - fade));
      const a = (0.9 + 0.08 * rng()) * (0.3 + 0.7 * fade);
      S.add(x, y, z, sg, sg * (0.7 + 0.3 * rng()), sg * 0.25, Math.cos(rng() * 6.3), 0, Math.sin(rng() * 6.3), n[0], n[1], n[2],
        c[0], c[1], c[2], a, n[0], n[1], n[2], 1, 1, BW, BW, 1, P_MOSS);
      // tiny moss bumps for texture
      if (fade > 0.6 && rng() < 0.22) {
        const c2 = mix3(c, C.moss1, 0.35);
        S.add(x + (rng() - 0.5) * sp, y + 0.004, z + (rng() - 0.5) * sp, sp * 0.45, sp * 0.45, sp * 0.3, 1, 0, 0, 0, 1, 0,
          c2[0], c2[1], c2[2], 0.9, 0, 1, 0, 1, 1, BW, BW, 1, P_MOSS);
      }
    }
  }
  // grass tufts
  const tufts = [[0.42, 0.22], [-0.47, 0.12], [0.3, -0.48], [-0.25, 0.5], [-0.52, -0.3], [0.58, -0.12], [0.08, 0.62]];
  for (const [tx, tz] of tufts) {
    const blades = 9 + Math.floor(rng() * 5);
    for (let b = 0; b < blades; b++) {
      const a = rng() * 6.283, lean = 0.25 + rng() * 0.45, h = 0.05 + rng() * 0.06;
      const bx = tx + Math.cos(a) * 0.012, bz = tz + Math.sin(a) * 0.012;
      const dirx = Math.cos(a), dirz = Math.sin(a);
      const K = 4;
      const c0 = mix3(hex('#4F6B2A'), hex('#9DB556'), rng() * 0.6);
      for (let k = 0; k < K; k++) {
        const t = (k + 0.5) / K;
        const off = lean * h * t * t;
        const p = [bx + dirx * off, h * t, bz + dirz * off];
        const d = norm3([dirx * 2 * lean * t, 1, dirz * 2 * lean * t]);
        const c = mix3(c0, hex('#C8D27A'), t * 0.45);
        const sw = 0.0042 * (1 - 0.55 * t);
        S.add(p[0], p[1], p[2], h / K * 0.65, sw, sw * 0.4, d[0], d[1], d[2], -dirz, 0, dirx,
          c[0], c[1], c[2], 0.95, dirx * 0.3, 0.9, dirz * 0.3, 1, 1, BW, BW, 1, P_GRASS);
      }
    }
  }
  // fallen leaves
  const leaves = [
    { x: 0.37, z: 0.36, ang: 0.6, len: 0.095, col: 0, lobed: false },
    { x: -0.38, z: 0.3, ang: 2.4, len: 0.075, col: 1, lobed: true },
    { x: 0.5, z: -0.33, ang: -0.8, len: 0.1, col: 2, lobed: false },
    { x: -0.5, z: -0.12, ang: 1.2, len: 0.08, col: 3, lobed: false },
    { x: 0.12, z: 0.53, ang: -1.9, len: 0.07, col: 1, lobed: false },
    { x: -0.16, z: -0.6, ang: 0.3, len: 0.08, col: 0, lobed: true },
    { x: 0.6, z: 0.08, ang: 2.0, len: 0.065, col: 3, lobed: true },
  ];
  for (const L of leaves) buildLeaf(ctx, L);
  // contact shadow (bone 1): soft ellipse of small unlit splats
  const sc = A.shadowC, rx = 0.27, rz = 0.34, ssp = 0.028;
  for (let gz = -rz * 1.25; gz <= rz * 1.25; gz += ssp) {
    for (let gx = -rx * 1.25; gx <= rx * 1.25; gx += ssp) {
      const e = (gx / rx) ** 2 + (gz / rz) ** 2;
      if (e > 1.5) continue;
      const a = 0.62 * Math.exp(-1.7 * e);
      if (a < 0.03) continue;
      S.add(sc[0] + gx, 0.011, sc[2] + gz, ssp * 0.7, ssp * 0.7, 0.002, 1, 0, 0, 0, 1, 0,
        C.shadow[0], C.shadow[1], C.shadow[2], a, 0, 1, 0, 0, 1, BSHADOW, BSHADOW, 1, P_SHADOW);
    }
  }
}
function buildLeaf(ctx, L) { // flat-ish autumn leaf: midrib, side veins, darker rim, slight curl
  const { S, rng } = ctx;
  const base = C.leaves[L.col];
  const ca = Math.cos(L.ang), sa = Math.sin(L.ang);
  const sp = 0.006 / Math.sqrt(clamp(ctx.density, 0.6, 1));
  const W = L.len * (L.lobed ? 0.5 : 0.4);
  const halfW = (u) => { // u in [-1,1] along the axis (stem at -1)
    let w = W * Math.pow(Math.max(0, 1 - u * u), 0.7) * (1 - 0.2 * u);
    if (L.lobed) w *= 0.7 + 0.3 * Math.abs(Math.sin((u + 1) * Math.PI * 1.5));
    return w;
  };
  const curl = 0.01 + rng() * 0.01, lift = 0.004 + rng() * 0.008;
  const rimC = scale3(base, 0.68), ribC = mix3(base, [1, 0.92, 0.7], 0.45);
  for (let a = -L.len; a <= L.len; a += sp * 0.85) {
    const u = a / L.len, hw = halfW(u);
    for (let b = -hw; b <= hw + 1e-6; b += sp * 0.85) {
      const la = a + (rng() - 0.5) * sp * 0.3, lb = b + (rng() - 0.5) * sp * 0.3;
      const v = lb / Math.max(W, 1e-6), e = Math.abs(lb) / Math.max(hw, 1e-6);
      const x = L.x + ca * la - sa * lb, z = L.z + sa * la + ca * lb;
      const y = 0.009 + curl * v * v + lift * (u + 1) * 0.5;
      const rib = 1 - smoothstep(0.0, 0.08, Math.abs(v));
      const vp = (u + 1) * 2.6 - Math.abs(v) * 2.2; // side veins angled toward the tip
      const vein = (1 - smoothstep(0.0, 0.12, Math.abs(vp - Math.round(vp)))) * smoothstep(0.1, 0.25, Math.abs(v)) * (1 - e) * 0.5;
      const c = mix3(base, rimC, smoothstep(0.55, 1.0, e) * 0.55);
      mixInto(c, ribC, Math.max(rib * 0.75, vein));
      const j = 0.95 + 0.1 * rng();
      const n = norm3([-sa * (2 * curl * v / W) * 0.5, 1, ca * (2 * curl * v / W) * 0.5]);
      S.add(x, y, z, sp * 0.72, sp * 0.72, sp * 0.2, ca, 0, sa, n[0], n[1], n[2], c[0] * j, c[1] * j, c[2] * j, 0.97,
        n[0], n[1], n[2], 1, 1, BW, BW, 1, P_LEAF);
    }
  }
  // stem
  for (let k = 0; k < 4; k++) {
    const a = -L.len - k * 0.006;
    const x = L.x + ca * a, z = L.z + sa * a;
    const c = scale3(base, 0.55);
    S.add(x, 0.012 + 0.002 * k, z, 0.0045, 0.0018, 0.0012, ca, 0, sa, 0, 1, 0, c[0], c[1], c[2], 1, 0, 1, 0, 1, 1, BW, BW, 1, P_LEAF);
  }
}

// ---------------------------------------------------------------- build
const H0 = 0.0077; // body surface spacing at density 1

/**
 * Build the squirrel + diorama as Gaussian splats.
 * @param {{density?: number, seed?: number}} [opts]
 * @returns {Object} SplatModel (see CONTRACT.md)
 */
export function buildSquirrel(opts = {}) {
  const density = clamp(Number(opts.density ?? 1) || 1, 0.1, 4);
  const seed = (Number(opts.seed ?? 1) | 0) >>> 0;
  const rng = mulberry32((Math.imul(seed + 1, 2654435761) ^ 0x5F3759DF) >>> 0);
  const noise = makeNoise(mulberry32((Math.imul(seed + 7, 1597334677) ^ 0x2545F491) >>> 0));
  const P = makeBody();
  const TC = makeTailCurve();
  const tailCaps = [];
  for (let i = 0; i < 12; i++) {
    const a = curveAt(TC, i / 12), b = curveAt(TC, (i + 1) / 12);
    tailCaps.push(cap(a.p, b.p, tailRadius(i / 12) * 0.62, tailRadius((i + 1) / 12) * 0.62));
  }
  const ctx = {
    P, rng, noise, density, TC, tailCaps, h: H0 / Math.sqrt(density), acornC: A.acorn.c,
    eyes: makeEyes(P), S: new Store(Math.round(100000 * density) + 4096),
  };
  const prof = opts.profile ? {} : null;
  let stage = 0;
  const step = (name, fn) => {
    // every stage draws from its own seeded stream, so tuning one stage never reshuffles another
    ctx.rng = mulberry32((Math.imul(seed + 1, 2654435761) ^ Math.imul(++stage, 0x9E3779B9) ^ 0x5F3759DF) >>> 0);
    const t0 = prof ? performance.now() : 0;
    fn(ctx);
    if (prof) prof[name] = +(performance.now() - t0).toFixed(1);
  };
  step('ground', buildGround);
  step('body', buildBody);
  step('eyes', buildEyes);
  step('noseMouth', buildNoseMouth);
  step('earTufts', buildEarTufts);
  step('acorn', buildAcorn);
  step('tail', buildTail);
  if (prof) console.log('buildSquirrel profile (ms)', JSON.stringify(prof));

  const S = ctx.S, n = S.n;
  const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < n; i++) {
    const b0 = S.bon[2 * i];
    if (b0 <= BSHADOW && S.bon[2 * i + 1] <= BSHADOW) continue;
    for (let k = 0; k < 3; k++) {
      const v = S.pos[3 * i + k];
      if (v < min[k]) min[k] = v;
      if (v > max[k]) max[k] = v;
    }
  }
  return {
    count: n,
    positions: S.pos.slice(0, 3 * n), scales: S.scl.slice(0, 3 * n), rotations: S.rot.slice(0, 4 * n),
    colors: S.col.slice(0, 4 * n), normals: S.nrm.slice(0, 3 * n), shading: S.shd.slice(0, 2 * n),
    bones: S.bon.slice(0, 2 * n), weights: S.wgt.slice(0, n),
    boneCount: BONE_COUNT, boneNames: BONE_NAMES.slice(),
    bounds: { min, max }, focus: [0, 0.48, 0],
    parts: S.prt.slice(0, n), partNames: PART_NAMES.slice(),
  };
}

// ---------------------------------------------------------------- rig math (column-major 4x4)
function m4mul(o, a, b) {
  const a00 = a[0], a10 = a[1], a20 = a[2], a01 = a[4], a11 = a[5], a21 = a[6], a02 = a[8], a12 = a[9], a22 = a[10],
    a03 = a[12], a13 = a[13], a23 = a[14];
  for (let c = 0; c < 4; c++) {
    const b0 = b[4 * c], b1 = b[4 * c + 1], b2 = b[4 * c + 2], b3 = b[4 * c + 3];
    o[4 * c] = a00 * b0 + a01 * b1 + a02 * b2 + a03 * b3;
    o[4 * c + 1] = a10 * b0 + a11 * b1 + a12 * b2 + a13 * b3;
    o[4 * c + 2] = a20 * b0 + a21 * b1 + a22 * b2 + a23 * b3;
    o[4 * c + 3] = c === 3 ? 1 : 0;
  }
  return o;
}
// row-major 3x3 helpers
const I3 = [1, 0, 0, 0, 1, 0, 0, 0, 1];
function mul3(a, b) {
  const o = new Array(9);
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) o[3 * r + c] = a[3 * r] * b[c] + a[3 * r + 1] * b[3 + c] + a[3 * r + 2] * b[6 + c];
  return o;
}
function axisAngle3(ax, ang) {
  const [x, y, z] = norm3(ax), c = Math.cos(ang), s = Math.sin(ang), t = 1 - c;
  return [t * x * x + c, t * x * y - s * z, t * x * z + s * y, t * x * y + s * z, t * y * y + c, t * y * z - s * x,
    t * x * z - s * y, t * y * z + s * x, t * z * z + c];
}
// scale (sx,sy,sz) along the orthonormal frame axes (ex, ey, ez): F diag(s) F^T
function frameScale3(ex, ey, ez, sx, sy, sz) {
  const o = new Array(9);
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) o[3 * r + c] = ex[r] * ex[c] * sx + ey[r] * ey[c] * sy + ez[r] * ez[c] * sz;
  return o;
}
// local pivot transform: T(p + t) * L * T(-p), with L a 3x3 (row-major) linear part
function pivotLocal(o, p, L, t) {
  o[0] = L[0]; o[1] = L[3]; o[2] = L[6]; o[3] = 0;
  o[4] = L[1]; o[5] = L[4]; o[6] = L[7]; o[7] = 0;
  o[8] = L[2]; o[9] = L[5]; o[10] = L[8]; o[11] = 0;
  const tx = t ? t[0] : 0, ty = t ? t[1] : 0, tz = t ? t[2] : 0;
  o[12] = p[0] + tx - (L[0] * p[0] + L[1] * p[1] + L[2] * p[2]);
  o[13] = p[1] + ty - (L[3] * p[0] + L[4] * p[1] + L[5] * p[2]);
  o[14] = p[2] + tz - (L[6] * p[0] + L[7] * p[1] + L[8] * p[2]);
  o[15] = 1;
  return o;
}
const RX = (a) => axisAngle3([1, 0, 0], a), RY = (a) => axisAngle3([0, 1, 0], a), RZ = (a) => axisAngle3([0, 0, 1], a);

// ---------------------------------------------------------------- easing
const easeInOut = (x) => { x = clamp01(x); return x * x * (3 - 2 * x); };
const easeOut = (x) => { x = clamp01(x); return 1 - (1 - x) * (1 - x); };
const easeIn = (x) => { x = clamp01(x); return x * x; };
function easeOutBack(x, k = 1.7) { x = clamp01(x); const u = x - 1; return 1 + (k + 1) * u * u * u + k * u * u; }
// piecewise keyframes [[t, v], ...] with smooth (cubic Hermite, zero-tangent) or eased segments
function keys(K, t) {
  if (t <= K[0][0]) return K[0][1];
  for (let i = 1; i < K.length; i++) {
    if (t <= K[i][0]) {
      const [t0, v0] = K[i - 1], [t1, v1, e] = K[i];
      const u = (t - t0) / (t1 - t0);
      const f = e === 'out' ? easeOut(u) : e === 'in' ? easeIn(u) : e === 'lin' ? u : easeInOut(u);
      return v0 + (v1 - v0) * f;
    }
  }
  return K[K.length - 1][1];
}

// ---------------------------------------------------------------- rig data (fixed anatomy, seed-independent)
let RIG = null;
function rigData() {
  if (RIG) return RIG;
  const P = makeBody();
  const eyes = makeEyes(P);
  const TC = makeTailCurve();
  const tail = [];
  for (let k = 0; k < NTAIL; k++) {
    const f = curveAt(TC, k / NTAIL);
    tail.push({ p: f.p, T: f.T, N: f.N, B: f.B });
  }
  // torque arm (z offset of the downstream tail mass relative to each pivot), for follow-through
  for (let k = 0; k < NTAIL; k++) {
    let zs = 0, ys = 0, n = 0;
    for (let i = 0; i <= 40; i++) {
      const s = k / NTAIL + (1 - k / NTAIL) * (i / 40);
      const f = curveAt(TC, s), m = tailRadius(s) ** 2;
      zs += f.p[2] * m; ys += f.p[1] * m; n += m;
    }
    tail[k].arm = zs / n - tail[k].p[2];
    tail[k].mass = 1 - k / NTAIL;
  }
  const eyeRig = eyes.map((e) => ({
    pivot: [e.c[0] - e.ey[0] * e.r[1] * 0.22, e.c[1] - e.ey[1] * e.r[1] * 0.22, e.c[2] - e.ey[2] * e.r[1] * 0.22],
    ex: e.ex, ey: e.ey, ez: e.ez,
  }));
  const earAx = [ellAxis(P[EAR_L], 2), ellAxis(P[EAR_R], 2)]; // ear normal (forward-ish)
  const earUp = [ellAxis(P[EAR_L], 1), ellAxis(P[EAR_R], 1)];
  RIG = { eyes: eyeRig, tail, earAx, earUp, acorn: acornFrame() };
  return RIG;
}

// ---------------------------------------------------------------- event timelines (pure functions of t)
const PERIOD = 2400;
function makeTimeline(rng, first, minGap, maxGap) {
  const ev = [];
  let t = first;
  while (t < PERIOD - maxGap) { ev.push({ t, r1: rng(), r2: rng(), r3: rng() }); t += minGap + (maxGap - minGap) * rng(); }
  return ev;
}
function lastEvent(ev, t) { // latest event with time <= t (t already wrapped), or the last one of the previous period
  let lo = 0, hi = ev.length - 1, ans = -1;
  while (lo <= hi) { const m = (lo + hi) >> 1; if (ev[m].t <= t) { ans = m; lo = m + 1; } else hi = m - 1; }
  if (ans < 0) return { e: ev[ev.length - 1], dt: t - (ev[ev.length - 1].t - PERIOD), i: ev.length - 1 };
  return { e: ev[ans], dt: t - ev[ans].t, i: ans };
}
const wrapT = (t) => ((t % PERIOD) + PERIOD) % PERIOD;
function blinkShape(x) { // 0 open .. 1 closed, x seconds since start
  if (x < 0) return 0;
  if (x < 0.07) return easeIn(x / 0.07);
  if (x < 0.11) return 1;
  if (x < 0.24) return 1 - easeOut((x - 0.11) / 0.13);
  return 0;
}

// ---------------------------------------------------------------- actions
const HOP_DUR = 1.15, NIBBLE_DUR = 2.2;
function hopRoot(x) { // -> [height, sy]
  const y = x < 0.22 || x > 0.68 ? 0 : 0.3 * (1 - ((x - 0.45) / 0.23) ** 2);
  const sy = keys([[0, 1], [0.2, 0.84], [0.28, 1.15, 'out'], [0.45, 1.0], [0.64, 1.07], [0.69, 1.03, 'lin'], [0.77, 0.82, 'out'],
    [0.92, 1.05], [1.04, 0.985], [1.15, 1]], x);
  return [y, sy];
}
// precomputed damped-spring follow-through for the tail chain and ears (deterministic)
let HOPSIM = null;
function hopSim() {
  if (HOPSIM) return HOPSIM;
  const rig = rigData();
  const dt = 1 / 480, T = 2.0, n = Math.ceil(T / dt) + 1;
  const h = new Float64Array(n);
  for (let i = 0; i < n; i++) { const [y, sy] = hopRoot(i * dt); h[i] = y + 0.6 * (sy - 1); }
  // smoothed acceleration
  const acc = new Float64Array(n), sm = new Float64Array(n), ker = [];
  const sig = 0.018 / dt, R = Math.ceil(sig * 3);
  for (let k = -R; k <= R; k++) ker.push(Math.exp(-0.5 * (k / sig) ** 2));
  const ks = ker.reduce((a, b) => a + b, 0);
  for (let i = 0; i < n; i++) { let s = 0; for (let k = -R; k <= R; k++) s += ker[k + R] * h[clamp(i + k, 0, n - 1)]; sm[i] = s / ks; }
  for (let i = 1; i < n - 1; i++) acc[i] = (sm[i + 1] - 2 * sm[i] + sm[i - 1]) / (dt * dt);
  const tail = [], step = 4; // store at 120 Hz
  for (let k = 0; k < NTAIL; k++) tail.push(new Float32Array(Math.ceil(n / step)));
  const ear = new Float32Array(Math.ceil(n / step));
  const th = new Float64Array(NTAIL), om = new Float64Array(NTAIL);
  let e = 0, ev = 0;
  for (let i = 0; i < n; i++) {
    const a = acc[i];
    for (let k = 0; k < NTAIL; k++) {
      const w = 15 - k * 0.9, z = 0.32;
      const f = 0.075 * a * rig.tail[k].arm * rig.tail[k].mass * (1 + 0.25 * k);
      om[k] += (-w * w * th[k] - 2 * z * w * om[k] + f) * dt;
      th[k] += om[k] * dt;
    }
    { const w = 17, z = 0.28; ev += (-w * w * e - 2 * z * w * ev - 0.05 * a) * dt; e += ev * dt; }
    if (i % step === 0) { for (let k = 0; k < NTAIL; k++) tail[k][i / step] = th[k]; ear[i / step] = e; }
  }
  HOPSIM = { tail, ear, rate: 120, len: Math.ceil(n / step) };
  return HOPSIM;
}
function simAt(arr, rate, x) {
  const f = clamp(x * rate, 0, arr.length - 1.001), i = Math.floor(f), u = f - i;
  return arr[i] * (1 - u) + arr[i + 1] * u;
}

// ---------------------------------------------------------------- animator
const PARENT = [-1, 0, 0, 2, 3, 4, 4, 4, 4, 4, 4, 3, 3, 3, 2, 2, 2, 16, 17, 18, 19, 20, 21, 22];
const DEG = Math.PI / 180;
const LOOK_YAW = 35 * DEG, LOOK_PITCH = 15 * DEG;
const HEAD_C = [0, 0.68, 0.05];

function flick(x) { // ear flick: fast out, damped spring back. 0 at x<=0
  if (x <= 0 || x > 0.9) return 0;
  return Math.exp(-x / 0.11) * Math.sin(x * 6.283 * 3.6) * 1.7;
}
function hopPose(x, o) {
  const [y, sy] = hopRoot(x);
  o.rootY = y; o.sy = sy;
  o.rootLean = keys([[0, 0], [0.2, 0.09], [0.3, -0.06, 'out'], [0.55, 0.0], [0.68, 0.03], [0.78, 0.09, 'out'], [0.95, -0.02], [1.15, 0]], x);
  o.chestLean += keys([[0, 0], [0.2, 0.07], [0.3, -0.05], [0.6, 0], [0.78, 0.06], [0.95, -0.015], [1.15, 0]], x);
  o.headPitch += keys([[0, 0], [0.18, 0.06], [0.28, 0.1, 'out'], [0.45, -0.05], [0.68, -0.06], [0.77, 0.13, 'out'], [0.9, -0.03], [1.05, 0.01], [1.15, 0]], x);
  o.feet = keys([[0, 0], [0.22, 0], [0.33, 0.42, 'out'], [0.55, 0.32], [0.65, 0.04], [0.68, 0], [1.15, 0]], x);
  o.armRaise += keys([[0, 0], [0.24, 0], [0.4, 0.14], [0.6, 0.1], [0.75, -0.06], [0.95, 0.02], [1.15, 0]], x);
  const sim = hopSim();
  for (let k = 0; k < NTAIL; k++) o.tailCurl[k] += simAt(sim.tail[k], sim.rate, x);
  o.earFold += simAt(sim.ear, sim.rate, x) * 1.0 + keys([[0, 0], [0.18, 0.12], [0.3, -0.05], [0.5, 0]], x);
  o.shadow = 1 - 0.55 * (y / 0.3);
}
const NIB_RAISE = 0.74, NIB_UP = 0.01, NIB_FWD = 0.06, NIB_TILT = 0.62;
function nibblePose(x, o) {
  const r = keys([[0, 0], [0.12, -0.06], [0.42, 1.05, 'out'], [0.56, 1.0], [1.72, 1.0], [2.0, -0.04], [2.2, 0]], x);
  o.armRaise += r * NIB_RAISE;
  o.armUp += r * NIB_UP; o.armFwd += r * NIB_FWD;
  o.acornTilt += r * NIB_TILT;
  o.headPitch += r * 0.14;
  o.chestLean -= r * 0.05;
  o.lookDamp = 1 - 0.75 * Math.max(0, r);
  o.earFold -= 0.12 * r;
  const c = x - 0.5, env = smoothstep(0, 0.08, c) * (1 - smoothstep(1.12, 1.22, c));
  if (env > 0) {
    const ph = 6.283 * 7 * c;
    o.jaw += 0.08 * env * (0.5 - 0.5 * Math.cos(ph));
    o.acornSpin += 0.07 * env * Math.sin(ph + 1.1);
    o.headPitch += 0.014 * env * Math.sin(ph + 0.6);
    o.armRaise += 0.014 * env * Math.sin(ph + 0.3);
    o.squint = 0.3 * env;
  }
  o.noseBoost = Math.max(0, r);
}

export function createAnimator(model, opts = {}) {
  const seed = (Number(opts.seed ?? 7) | 0) >>> 0;
  const autoActions = opts.autoActions ?? true;
  const rig = rigData();
  const rng = mulberry32((Math.imul(seed + 3, 2246822519) ^ 0x68E31DA4) >>> 0);
  const blinks = makeTimeline(rng, 1.4, 2.0, 6.0);
  const earEv = makeTimeline(rng, 2.6, 3.0, 9.5);
  const noseEv = makeTimeline(rng, 0.9, 2.2, 6.0);
  const glances = makeTimeline(rng, 2.2, 2.6, 7.0);
  const autoEv = makeTimeline(rng, 10 + 4 * rng(), 12, 25);
  const ph = [rng() * 6.283, rng() * 6.283, rng() * 6.283, rng() * 6.283];

  const out = new Float32Array(16 * BONE_COUNT);
  const world = new Float64Array(16 * BONE_COUNT);
  const loc = new Float64Array(16), tmp = new Float64Array(16), tmp2 = new Float64Array(16);
  let trig = null, lastT = 0, lookTarget = null;
  let smYaw = 0, smPitch = 0, smW = 0, smInit = false;
  const o = { tailCurl: new Float64Array(NTAIL) };
  const DUR = { hop: HOP_DUR, nibble: NIBBLE_DUR };

  function autoAt(t) { // auto nibble active at t? -> elapsed or -1
    if (!autoActions) return -1;
    const { dt } = lastEvent(autoEv, wrapT(t));
    if (dt >= NIBBLE_DUR) return -1;
    const start = t - dt;
    if (trig && trig.start - 0.3 < start + NIBBLE_DUR && start < trig.start + DUR[trig.name] + 0.3) return -1;
    return dt;
  }
  function current(t) {
    if (trig && t >= trig.start && t < trig.start + DUR[trig.name]) return [trig.name, t - trig.start];
    const a = autoAt(t);
    if (a >= 0) return ['nibble', a];
    return ['idle', 0];
  }

  const api = {
    boneCount: BONE_COUNT,
    action: 'idle',
    // Starts `name` at time `at` (default: the t of the most recent update()). Returns false if busy then.
    trigger(name, at) {
      if (name !== 'hop' && name !== 'nibble') return false;
      const t0 = Number.isFinite(at) ? at : lastT;
      if (current(t0)[0] !== 'idle') return false;
      trig = { name, start: t0 };
      api.action = current(lastT)[0];
      return true;
    },
    setLookTarget(p) { lookTarget = p ? [p[0], p[1], p[2]] : null; },
    update(t, dt = 0) {
      t = Number(t) || 0; dt = Math.max(0, Number(dt) || 0);
      lastT = t;
      const [act, ax] = current(t);
      api.action = act;
      const tw = wrapT(t);
      // ---- reset pose channels
      o.rootY = 0; o.sy = 1; o.rootLean = 0; o.chestLean = 0; o.headPitch = 0; o.headRoll = 0; o.feet = 0; o.armRaise = 0;
      o.jaw = 0; o.acornSpin = 0; o.earFold = 0; o.shadow = 1; o.lookDamp = 1; o.noseBoost = 0;
      o.armUp = 0; o.armFwd = 0; o.acornTilt = 0; o.squint = 0;
      o.tailCurl.fill(0);
      if (act === 'hop') hopPose(ax, o);
      else if (act === 'nibble') nibblePose(ax, o);

      // ---- idle layers
      const breath = Math.sin(6.283 * t / 3.3 + ph[0]);
      let blink = 0;
      { const b = lastEvent(blinks, tw); blink = blinkShape(b.dt); if (b.e.r1 < 0.3) blink = Math.max(blink, blinkShape(b.dt - 0.3)); }
      blink = Math.max(blink, o.squint);
      let earL = 0, earR = 0;
      { const e = lastEvent(earEv, tw); const f = flick(e.dt); const which = e.e.r1; if (which < 0.4) earL = f; else if (which < 0.8) earR = f; else { earL = f; earR = flick(e.dt - 0.06); } }
      let nose = 0;
      {
        const e = lastEvent(noseEv, tw); const n = 3 + Math.floor(e.e.r1 * 3), hz = 8.5;
        if (e.dt < n / hz) nose = 0.5 - 0.5 * Math.cos(6.283 * hz * e.dt);
        if (o.noseBoost > 0) nose = Math.max(nose, o.noseBoost * (0.5 - 0.5 * Math.cos(6.283 * 6 * t)) * 0.6);
      }
      // look-around: slow wander + glances (pure functions of t)
      let iy = 0.1 * Math.sin(6.283 * t / 11.0 + ph[1]) + 0.05 * Math.sin(6.283 * t / 5.3 + ph[2]);
      let ip = 0.04 * Math.sin(6.283 * t / 8.7 + ph[3]) + 0.02;
      let roll = 0.05 * Math.sin(6.283 * t / 9.4 + ph[2]);
      {
        const g = lastEvent(glances, tw), prev = glances[(g.i - 1 + glances.length) % glances.length];
        const tgt = (e) => [(e.r1 * 2 - 1) * 0.5, (e.r2 * 2 - 1) * 0.16, (e.r3 - 0.5) * 0.2];
        const a = tgt(prev), b = tgt(g.e), k = easeOutBack(g.dt / 0.32, 1.4);
        iy += a[0] + (b[0] - a[0]) * k; ip += a[1] + (b[1] - a[1]) * k; roll += a[2] + (b[2] - a[2]) * k;
      }
      // look target
      let ty = 0, tp = 0, tw8 = 0;
      if (lookTarget) {
        const dx = lookTarget[0] - HEAD_C[0], dy = lookTarget[1] - HEAD_C[1], dz = lookTarget[2] - HEAD_C[2];
        const yaw = Math.atan2(dx, dz), pitch = Math.atan2(dy, Math.hypot(dx, dz));
        tw8 = smoothstep(2.4, 1.4, Math.abs(yaw));
        ty = clamp(yaw, -LOOK_YAW, LOOK_YAW); tp = clamp(pitch, -LOOK_PITCH, LOOK_PITCH);
      }
      if (!smInit || dt <= 0) { smYaw = ty; smPitch = tp; smW = tw8; smInit = true; }
      else {
        const k = 1 - Math.exp(-dt * 5);
        smYaw += (ty - smYaw) * k; smPitch += (tp - smPitch) * k; smW += (tw8 - smW) * k;
      }
      const lw = 0.72 * smW;
      let yaw = lerp(iy, smYaw, lw) * o.lookDamp, pitch = lerp(ip, smPitch, lw) * o.lookDamp;
      yaw = clamp(yaw, -LOOK_YAW, LOOK_YAW); pitch = clamp(pitch, -LOOK_PITCH, LOOK_PITCH);
      roll = roll * (1 - 0.5 * lw) * o.lookDamp;

      // ---- tail wave
      const tailLat = new Array(NTAIL), tailCurl = new Array(NTAIL);
      for (let k = 0; k < NTAIL; k++) {
        const amp = 0.036 + 0.014 * k;
        tailLat[k] = amp * Math.sin(6.283 * t / 3.1 - k * 0.55 + ph[1]);
        tailCurl[k] = 0.018 * (1 + 0.15 * k) * Math.sin(6.283 * t / 4.3 - k * 0.45 + ph[3]) + o.tailCurl[k];
      }

      // ---- compose
      const sq = o.sy, sxz = 1 / Math.sqrt(sq);
      const bs = 1 + 0.016 * breath, bxz = 1 + 0.011 * breath;
      const Sc = [bxz, 0, 0, 0, bs, 0, 0, 0, bxz], Sci = [1 / bxz, 0, 0, 0, 1 / bs, 0, 0, 0, 1 / bxz];
      const set = (k, M) => world.set(M, 16 * k);
      const compose = (k, L) => { m4mul(tmp, world.subarray(16 * PARENT[k], 16 * PARENT[k] + 16), L); world.set(tmp, 16 * k); };
      // world, shadow
      for (let k = 0; k < 2; k++) { world.fill(0, 16 * k, 16 * k + 16); world[16 * k] = world[16 * k + 5] = world[16 * k + 10] = world[16 * k + 15] = 1; }
      { const s = o.shadow * (o.rootY > 0 ? 1 : sxz); pivotLocal(loc, A.shadowC, [s, 0, 0, 0, 1, 0, 0, 0, s], null); set(BSHADOW, loc); }
      // root
      {
        const L = mul3(mul3(RX(o.rootLean), RZ(0.012 * Math.sin(6.283 * t / 7.3 + ph[0]))), [sxz, 0, 0, 0, sq, 0, 0, 0, sxz]);
        pivotLocal(loc, A.pivRoot, L, [0, o.rootY, 0]); compose(BROOT, loc);
      }
      // chest (breathing + lean)
      pivotLocal(loc, A.pivChest, mul3(RX(o.chestLean + 0.012 * breath), Sc), null); compose(BCHEST, loc);
      // head
      {
        const L = mul3(Sci, mul3(mul3(RY(yaw), RX(-pitch + o.headPitch - 0.5 * o.chestLean)), RZ(roll + o.headRoll)));
        pivotLocal(loc, A.pivHead, L, null); compose(BHEAD, loc);
      }
      // jaw, nose
      pivotLocal(loc, A.pivJaw, RX(o.jaw), null); compose(BJAW, loc);
      {
        const s = 1 + 0.07 * nose;
        pivotLocal(loc, A.pivNose, mul3(RX(-0.14 * nose), [s, 0, 0, 0, s, 0, 0, 0, s]), [0, 0.0015 * nose, 0]); compose(BNOSE, loc);
      }
      // ears
      for (let s = 0; s < 2; s++) {
        const sign = s === 0 ? 1 : -1, f = s === 0 ? earL : earR;
        const piv = [A.pivEar[0] * sign, A.pivEar[1], A.pivEar[2]];
        const lat = norm3(cross3(rig.earUp[s], rig.earAx[s]));
        const L = mul3(axisAngle3(lat, -(0.32 * f + o.earFold) * sign), axisAngle3(rig.earUp[s], 0.22 * f * sign));
        pivotLocal(loc, piv, L, null); compose(BEARL + s, loc);
      }
      // eyes (blink: scale toward the eye pivot, mostly vertically)
      for (let s = 0; s < 2; s++) {
        const e = rig.eyes[s];
        const L = frameScale3(e.ex, e.ey, e.ez, 1 - 0.1 * blink, 1 - 0.92 * blink, 1 - 0.5 * blink);
        pivotLocal(loc, e.pivot, L, null); compose(BEYEL + s, loc);
      }
      // arms + acorn (same pitch about the shoulder line so the paws keep their grip)
      const armR = mul3(Sci, RX(-o.armRaise)), armT = [0, o.armUp, o.armFwd];
      for (let s = 0; s < 2; s++) {
        const sign = s === 0 ? 1 : -1;
        pivotLocal(loc, [A.pivArm[0] * sign, A.pivArm[1], A.pivArm[2]], armR, armT); compose(BARML + s, loc);
      }
      { // acorn: rides on the (shared) arm transform, plus a counter-tilt and a spin about its own center
        pivotLocal(tmp2, A.pivArm, armR, armT);
        const F = rig.acorn;
        pivotLocal(loc, F.c, mul3(RX(o.acornTilt), axisAngle3(F.ay, o.acornSpin)), null);
        m4mul(tmp, tmp2, loc); loc.set(tmp); compose(BACORN, loc);
      }
      // feet
      for (let s = 0; s < 2; s++) {
        const sign = s === 0 ? 1 : -1;
        pivotLocal(loc, [A.pivFoot[0] * sign, A.pivFoot[1], A.pivFoot[2]], RX(o.feet), null); compose(BFOOTL + s, loc);
      }
      // tail chain
      for (let k = 0; k < NTAIL; k++) {
        const tb = rig.tail[k];
        const L = mul3(axisAngle3(tb.N, tailLat[k]), axisAngle3(tb.B, tailCurl[k]));
        pivotLocal(loc, tb.p, L, null); compose(BTAIL0 + k, loc);
      }
      for (let i = 0; i < out.length; i++) out[i] = world[i];
      return out;
    },
  };
  return api;
}
