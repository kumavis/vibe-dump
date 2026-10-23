// A tiny geometry kit and the one material the district's things use, from
// the ahupuaʻa app's features/kit.js.
//
// Everything built by hand, hale, canoes, fishpond walls, trees, is put
// together from boxes, tapered cylinders and ribbons into one buffer per
// thing, with a per-vertex colour and a material code the shader uses for
// small touches: thatch gets horizontal courses, stone gets mottling, leaves
// a little grain. What changes here from ahupuaʻa: everything stands on the
// district's ground at the valley's exaggeration (config.js NEAR_EXAG) and is
// stretched with it as the camera pulls back, so nothing floats while it
// fades; whole things dither in and out by the district's weight and by the
// year (uFeatK, a feature's weight; uFeatSeen, whether its clearing has been
// made by now); and the rain and the weather of the ahupuaʻa island are left
// out.
//
// The town's buildings (settlements.js) add three things: each instance
// carries the span of years it stands (aSpan, `grow`), and fades in and out
// by an eased year (uYearNow), so dragging the year grows the town rather
// than popping it; the trees stand back from what the town has built in the
// year (uTownClear, a coverage map over the district); and a few touches for
// the new materials: clapboard, masonry coursing, storeys of windows, the
// ribs of an iron roof. The trees stand back from the fields of the year
// too (render/shaders/crops.glsl.js, the district's island's crop map): none
// in a planted field, a few in a pasture, on a lawn or among dry fields.

import * as THREE from 'three'
import { constants, noise, world, lighting } from '../render/shaders/common.glsl.js'
import { cropCells } from '../render/shaders/crops.glsl.js'
import { FEATURE_S, NEAR_EXAG } from '../config.js'

// Presentation scale: world units per metre for things (config.js)
export const S = FEATURE_S
/** World Y of the ground at this many metres, at the valley's exaggeration: what the geometry is built at. */
export const Y = (metres) => (metres * NEAR_EXAG) / 100

export const MAT = { plain: 0, thatch: 1, stone: 2, leaf: 3, water: 4, kapa: 5, wood: 6, skin: 7, sand: 8, clap: 9, windows: 10, roof: 11, masonry: 12 }

export class Builder {
  constructor() {
    this.pos = []
    this.nor = []
    this.col = []
    this.mat = []
    this.feat = []
    this.featNow = 0
    this.xf = null
    this.stack = []
  }

  /** Subsequent geometry is local: metres, rotated about y, scaled, placed. */
  at(x, y, z, rot = 0, scale = S) {
    this.stack.push(this.xf)
    const c = Math.cos(rot)
    const s = Math.sin(rot)
    this.xf = (p) => [x + (p[0] * c - p[2] * s) * scale, y + p[1] * scale, z + (p[0] * s + p[2] * c) * scale]
    return this
  }

  done() {
    this.xf = this.stack.pop() || null
    return this
  }

  /** The feature (an index into uFeatK) the geometry that follows belongs to. */
  feature(i) {
    this.featNow = i
    return this
  }

  tri(a, b, c, color, mat = 0) {
    if (this.xf) {
      a = this.xf(a)
      b = this.xf(b)
      c = this.xf(c)
    }
    const ux = b[0] - a[0]
    const uy = b[1] - a[1]
    const uz = b[2] - a[2]
    const vx = c[0] - a[0]
    const vy = c[1] - a[1]
    const vz = c[2] - a[2]
    let nx = uy * vz - uz * vy
    let ny = uz * vx - ux * vz
    let nz = ux * vy - uy * vx
    const l = Math.hypot(nx, ny, nz) || 1
    nx /= l
    ny /= l
    nz /= l
    for (const p of [a, b, c]) {
      this.pos.push(p[0], p[1], p[2])
      this.nor.push(nx, ny, nz)
      this.col.push(color[0], color[1], color[2])
      this.mat.push(mat)
      this.feat.push(this.featNow)
    }
  }

  quad(a, b, c, d, color, mat = 0) {
    this.tri(a, b, c, color, mat)
    this.tri(a, c, d, color, mat)
  }

  /** A closed six-sided solid from its bottom and top rings (corners (-x,-z), (+x,-z), (+x,+z), (-x,+z)). */
  hexa(b, t, color, mat = 0) {
    this.quad(t[0], t[3], t[2], t[1], color, mat)
    this.quad(b[0], b[1], b[2], b[3], color, mat)
    for (let k = 0; k < 4; k++) this.quad(b[k], t[k], t[(k + 1) % 4], b[(k + 1) % 4], color, mat)
  }

  /** Box centred at (x, y0..y0+h, z), optionally rotated about y; `taper` shrinks its top. */
  box(x, y0, z, sx, h, sz, color, mat = 0, rot = 0, taper = 1) {
    const c = Math.cos(rot)
    const s = Math.sin(rot)
    const P = (lx, ly, lz) => [x + lx * c - lz * s, y0 + ly, z + lx * s + lz * c]
    const hx = sx / 2
    const hz = sz / 2
    const tx = hx * taper
    const tz = hz * taper
    const b = [P(-hx, 0, -hz), P(hx, 0, -hz), P(hx, 0, hz), P(-hx, 0, hz)]
    const t = [P(-tx, h, -tz), P(tx, h, -tz), P(tx, h, tz), P(-tx, h, tz)]
    if (h < 0) this.hexa(t, b, color, mat)
    else this.hexa(b, t, color, mat)
  }

  /** Tapered cylinder between two points. */
  cyl(a, b, r0, r1, color, mat = 0, seg = 6) {
    const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
    const len = Math.hypot(...d) || 1
    const ax = d.map((v) => v / len)
    const ref = Math.abs(ax[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0]
    let u = [ax[1] * ref[2] - ax[2] * ref[1], ax[2] * ref[0] - ax[0] * ref[2], ax[0] * ref[1] - ax[1] * ref[0]]
    const ul = Math.hypot(...u)
    u = u.map((v) => v / ul)
    const v = [ax[1] * u[2] - ax[2] * u[1], ax[2] * u[0] - ax[0] * u[2], ax[0] * u[1] - ax[1] * u[0]]
    const ring = (o, r, k) => {
      const t = (k / seg) * Math.PI * 2
      const ct = Math.cos(t) * r
      const st = Math.sin(t) * r
      return [o[0] + u[0] * ct + v[0] * st, o[1] + u[1] * ct + v[1] * st, o[2] + u[2] * ct + v[2] * st]
    }
    for (let k = 0; k < seg; k++) this.quad(ring(a, r0, k), ring(a, r0, k + 1), ring(b, r1, k + 1), ring(b, r1, k), color, mat)
  }

  /** A low irregular blob (stone, crown): an icosahedron, jittered, shaded round when it is foliage. */
  blob(x, y, z, rx, ry, rz, color, mat = 0, seed = 0, smooth = mat === MAT.leaf) {
    const t = (1 + Math.sqrt(5)) / 2
    const V = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]]
    const F = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8], [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]]
    const jit = (i) => 0.85 + 0.3 * Math.abs((Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453) % 1)
    const P = V.map((p, i) => {
      const l = Math.hypot(...p)
      const j = jit(i)
      return [x + (p[0] / l) * rx * j, y + (p[1] / l) * ry * j, z + (p[2] / l) * rz * j]
    })
    if (!smooth) {
      for (const f of F) this.tri(P[f[0]], P[f[1]], P[f[2]], color, mat)
      return
    }
    const nrm = (p) => {
      const d = [(p[0] - x) / (rx * rx), (p[1] - y) / (ry * ry), (p[2] - z) / (rz * rz)]
      const l = Math.hypot(...d) || 1
      return [d[0] / l, d[1] / l, d[2] / l]
    }
    for (const f of F) {
      const pts = f.map((i) => P[i])
      const w = this.xf ? pts.map((p) => this.xf(p)) : pts
      for (let k = 0; k < 3; k++) {
        this.pos.push(...w[k])
        this.nor.push(...nrm(pts[k]))
        this.col.push(color[0], color[1], color[2])
        this.mat.push(mat)
        this.feat.push(this.featNow)
      }
    }
  }

  /**
   * A ribbon wall along a polyline: `pts` are [x, y, z] (y its foot); battered
   * sides like a dry-stacked stone wall, its joints mitred so it keeps its
   * width round a bend.
   */
  wall(pts, width, height, color, mat = MAT.stone, batter = 0.7) {
    const n = pts.length
    if (n < 2) return
    const closed = n > 2 && Math.hypot(pts[0][0] - pts[n - 1][0], pts[0][2] - pts[n - 1][2]) < 1e-9
    const seg = []
    for (let i = 0; i < n - 1; i++) {
      const dx = pts[i + 1][0] - pts[i][0]
      const dz = pts[i + 1][2] - pts[i][2]
      const l = Math.hypot(dx, dz) || 1
      seg.push([-dz / l, dx / l])
    }
    const off = pts.map((_, i) => {
      let a = seg[i - 1]
      let b = seg[i]
      if (closed && i === 0) a = seg[n - 2]
      if (closed && i === n - 1) b = seg[0]
      if (!a) return b
      if (!b) return a
      const mx = a[0] + b[0]
      const mz = a[1] + b[1]
      const ml = Math.hypot(mx, mz)
      if (ml < 1e-6) return b
      const k = 1 / Math.max(0.35, (mx * b[0] + mz * b[1]) / ml)
      return [(mx / ml) * k, (mz / ml) * k]
    })
    const wb = width / 2
    const wt = (width * batter) / 2
    const A = (p, o, w, h) => [p[0] + o[0] * w, p[1] + h, p[2] + o[1] * w]
    const ring = (i) => [A(pts[i], off[i], -wb, -height * 0.3), A(pts[i], off[i], wb, -height * 0.3), A(pts[i], off[i], wt, height), A(pts[i], off[i], -wt, height)]
    for (let i = 0; i < n - 1; i++) {
      const [a0, a1, a2, a3] = ring(i)
      const [b0, b1, b2, b3] = ring(i + 1)
      this.quad(a3, a2, b2, b3, color, mat)
      this.quad(a1, b1, b2, a2, color, mat)
      this.quad(b0, a0, a3, b3, color, mat)
    }
    if (!closed) {
      const [a0, a1, a2, a3] = ring(0)
      const [b0, b1, b2, b3] = ring(n - 1)
      this.quad(a0, a1, a2, a3, color, mat)
      this.quad(b1, b0, b3, b2, color, mat)
    }
  }

  geometry() {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3))
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.nor, 3))
    g.setAttribute('color', new THREE.Float32BufferAttribute(this.col, 3))
    g.setAttribute('aMat', new THREE.Float32BufferAttribute(this.mat, 1))
    g.setAttribute('aFeat', new THREE.Float32BufferAttribute(this.feat, 1))
    g.computeBoundingSphere()
    return g
  }
}

/**
 * The same geometry with each distinct vertex stored once, the triangles
 * indexed into it (a crown's corners are shared by five or six faces with the
 * same normal and colour; drawn this way it costs under half the vertex work).
 */
export function indexed(g) {
  const P = g.attributes.position.array
  const N = g.attributes.normal.array
  const C = g.attributes.color.array
  const M = g.attributes.aMat.array
  const seen = new Map()
  const index = []
  const pos = []
  const nor = []
  const colr = []
  const mat = []
  for (let i = 0; i < M.length; i++) {
    const key = `${P[i * 3]},${P[i * 3 + 1]},${P[i * 3 + 2]},${N[i * 3]},${N[i * 3 + 1]},${N[i * 3 + 2]},${C[i * 3]},${C[i * 3 + 1]},${C[i * 3 + 2]},${M[i]}`
    let j = seen.get(key)
    if (j === undefined) {
      j = seen.size
      seen.set(key, j)
      pos.push(P[i * 3], P[i * 3 + 1], P[i * 3 + 2])
      nor.push(N[i * 3], N[i * 3 + 1], N[i * 3 + 2])
      colr.push(C[i * 3], C[i * 3 + 1], C[i * 3 + 2])
      mat.push(M[i])
    }
    index.push(j)
  }
  const out = new THREE.BufferGeometry()
  out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  out.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3))
  out.setAttribute('color', new THREE.Float32BufferAttribute(colr, 3))
  out.setAttribute('aMat', new THREE.Float32BufferAttribute(mat, 1))
  out.setIndex(index)
  out.computeBoundingSphere()
  return out
}

/** sRGB hex → linear [r, g, b], with optional brightness jitter. */
export function col(hex, j = 0, rand = Math.random) {
  const c = new THREE.Color(hex)
  const k = 1 + (rand() - 0.5) * j
  return [c.r * k, c.g * k, c.b * k]
}

const objectVertex = /* glsl */ `
${constants}
${world}
#ifdef CROPS
${cropCells}
uniform sampler2D uDistCrop;  // the district's island's crop map, and its rect (overlay/crops.js)
uniform vec4 uDistCropRect;
uniform float uDistCropOn;
// whether a tree at xz gives way to the field it stands in: always in a
// planted field of a crop, but for a few in a pasture, on a lawn and among
// dry fields; never in one lying fallow
float cropClears(vec2 xz) {
  CropCell c = cropCell(xz);
  vec2 cs = cropAt(uDistCrop, uDistCropRect, c.centre, c.pickKf);
  if (c.pick >= cropCover(cs)) return 0.0;
  float keep = abs(cs.x - 6.0) < 0.5 ? 0.25 : cs.x > 7.5 ? 0.15 : cs.x < 0.5 || abs(cs.x - 2.0) < 0.5 ? 0.2 : 0.0;
  return step(keep, cropHash(xz * 37.1 + 5.3));
}
#endif
in float aMat;
in float aFeat;
#ifdef USE_GROW
in vec4 aSpan;               // the years a building stands: in from x to y, out from z to w
in float aStretch;           // its height over its model's (a tower's), for the storeys
out float vFadeOut;          // how far it has gone: the pixels under this are the next one's
#ifdef USE_YIELD
uniform vec4 uYieldRect;     // a district's inner box, where the island's buildings yield to its own (towns.js)
uniform float uYield;        // how far they yield there: the district's weight, once its own are built
#endif
#elif defined(USE_INSTANCING)
in float aClear;
uniform sampler2D uTownClear; // what the town has built in the year (settlements.js)
#endif
uniform float uYearNow;      // the year, eased (settlements.js)
uniform float uFadeNear;
uniform float uFadeFar;
uniform float uShow;         // the district's weight, and the near zoom's
uniform vec4 uFeatK[16];     // (shared) each rastered feature's weight in the year
uniform vec4 uFeatSeen[16];  // whether a feature has stood by the year (its clearing made)
out vec3 vWorld;
out vec3 vNormal;
out vec3 vColor;
out float vMat;
out vec3 vLocal;
out float vFade;
float featV(vec4 a[16], int i) { return a[i >> 2][i & 3]; }
void main() {
  mat4 im = mat4(1.0);
  #ifdef USE_INSTANCING
  im = instanceMatrix;
  #endif
  vec3 p = position;
  mat4 mm = modelMatrix * im;
  vec4 wp = mm * vec4(p, 1.0);
  vec3 origin = (mm * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
  // built at the valley's exaggeration; stretched with the ground's as the camera pulls back
  float sy = uExag / NEAR_E;
  wp.y *= sy;
  origin.y *= sy;
  vec3 c = color;
  #ifdef USE_INSTANCING_COLOR
  c *= aMat > 5.5 && aMat < 6.5 ? mix(vec3(1.0), vec3(dot(instanceColor, vec3(0.299, 0.587, 0.114))), 0.25) : instanceColor;
  #endif
  vWorld = wp.xyz;
  vNormal = normalize(mat3(mm) * normal);
  vColor = c;
  vMat = aMat;
  vLocal = p;
  #ifdef USE_GROW
  vLocal.y *= aStretch;
  #endif
  // (whole instances fade together, so a tree never dissolves from one side)
  #ifdef USE_INSTANCING
  float dist = distance(cameraPosition, origin);
  #else
  float dist = distance(cameraPosition, wp.xyz);
  #endif
  float fade = uShow * (1.0 - smoothstep(uFadeNear, uFadeFar, dist));
  int f = int(aFeat + 0.5);
  if (f > 0) fade *= featV(uFeatK, f);
  #ifdef USE_INSTANCING
  #ifdef USE_GROW
  // In by the year, and out by it. A building fading out keeps the pixels
  // above its curve and the one fading in on its lot takes those below the
  // same curve (settlements.js gives the two one window), so they never draw
  // over each other; and an island's building inside a district that is down
  // gives the district's own the pixels it takes, the same way.
  fade *= smoothstep(aSpan.x, aSpan.y, uYearNow);
  float gone = smoothstep(aSpan.z, aSpan.w, uYearNow);
  #ifdef USE_YIELD
  if (edgeDist(uYieldRect, origin.xz) > 0.0) gone = max(gone, uYield);
  #endif
  vFadeOut = gone;
  if (gone >= 0.999) fade = 0.0;
  #else
  int cl = int(aClear + 0.5);
  if (cl > 0) fade *= 1.0 - featV(uFeatSeen, cl);
  // (and a tree stands back from what the town has built round it by the year)
  fade *= 1.0 - smoothstep(0.3, 0.7, texture(uTownClear, rectUv(uDistRect, origin.xz)).r);
  // (and from the fields of the year, where its material has them: overlay/crops.js)
  #ifdef CROPS
  if (uDistCropOn > 0.5) fade *= 1.0 - cropClears(origin.xz);
  #endif
  // and thinner toward the district's edge, as its ground eases into the
  // island's (one tree in so many left out, not every one dissolved; the
  // buildings instead keep their lots inside it, and the island's stand
  // beyond: settlements.js PART)
  float edgeK = smoothstep(uDistInfo.w, uDistInfo.z, edgeDist(uDistRect, origin.xz));
  float pick = fract(sin(dot(origin.xz, vec2(12.9898, 78.233))) * 43758.5453);
  fade *= step(pick, edgeK);
  #endif
  #endif
  vFade = fade;
  gl_Position = fade <= 0.001 ? vec4(2.0, 2.0, 2.0, 1.0) : projectionMatrix * viewMatrix * wp;
}
`

const objectFragment = /* glsl */ `
${constants}
${noise}
${world}
${lighting}
uniform sampler2D uShadeS;  // the cast shadows of the ground under it (the district's, or an island's)
uniform vec4 uShadeRect;    // and the rect they cover
in vec3 vWorld;
in vec3 vNormal;
in vec3 vColor;
in float vMat;
in vec3 vLocal;
in float vFade;
#ifdef USE_GROW
in float vFadeOut;
#endif
void main() {
  if (vFade <= 0.0) discard;
  // dither in and out instead of popping
  float hd = hash12(gl_FragCoord.xy);
  if (hd >= vFade) discard;
  #ifdef USE_GROW
  if (hd < vFadeOut) discard;
  #endif
  vec3 n = normalize(vNormal);
  if (!gl_FrontFacing) n = -n;
  vec3 a = vColor;
  int m = int(vMat + 0.5);
  if (m == 1) {
    float course = fract(vLocal.y * 2.6 + vnoise(vWorld.xz * 400.0) * 0.3);
    a *= 0.78 + 0.32 * smoothstep(0.0, 0.5, course);
  } else if (m == 2) {
    vec2 sp = vWorld.xz * 260.0 + vec2(vWorld.y * 190.0, -vWorld.y * 170.0);
    vec3 v = voronoi(fract(sp / 512.0) * 512.0);
    a *= (0.7 + 0.5 * v.y) * (0.55 + 0.45 * smoothstep(0.0, 0.12, v.z));
  } else if (m == 3) {
    // (the leaves a step darker than the ahupuaʻa app's: seen from a few
    // kilometres, through more air, crowns lit as near ones read as cotton)
    a *= (0.8 + 0.4 * vnoise(vWorld.xz * 600.0 + vLocal.y * 30.0)) * 0.8;
  } else if (m == 6) {
    a *= 0.85 + 0.25 * vnoise(vec2(vLocal.y * 40.0, vWorld.x * 300.0));
  } else if (m >= 9 && abs(n.y) < 0.5) {
    // the town's walls: boards, coursed stone, storeys of windows, each
    // averaged out once it is finer than a pixel or two
    float along = vLocal.x + vLocal.z;
    if (m == 9) a *= 0.93 + 0.08 * vnoise(vec2(along * 0.5, vLocal.y * 2.0));
    else if (m == 12) a *= 0.9 + 0.12 * vnoise(vec2(along * 0.7, vLocal.y * 1.6));
    else if (m == 10) {
      float fy = vLocal.y / 3.6;
      float fl = fract(fy);
      float bay = fract(along / 3.2);
      float w = smoothstep(0.26, 0.34, fl) * (1.0 - smoothstep(0.76, 0.84, fl)) * smoothstep(0.1, 0.2, bay) * (1.0 - smoothstep(0.8, 0.9, bay));
      float aa = 1.0 - smoothstep(0.25, 0.6, fwidth(fy));
      a *= mix(0.84, mix(1.02, 0.52, w), aa);
    }
  } else if (m == 11) {
    // an iron roof's ribs, down the slope
    float r = fract((vLocal.x + vLocal.z) * 0.9);
    float aa = 1.0 - smoothstep(0.3, 0.7, fwidth((vLocal.x + vLocal.z) * 0.9));
    a *= mix(0.94, 0.88 + 0.12 * smoothstep(0.35, 0.5, r), aa);
  }
  vec2 uv = rectUv(uShadeRect, vWorld.xz);
  float vis = texture(uShadeS, uv).r;
  vec3 lit = shade(a, n, vWorld, 1.0, vis);
  // a little wrap and translucency for leaves
  if (m == 3) lit += a * uSunColor * max(dot(-n, uSunDir), 0.0) * 0.25 * vis;
  if (m == 5) lit += a * uSkyColor * 0.15;
  gl_FragColor = vec4(lit, 1.0);
}
`

/**
 * The district's object material. `opts.fade` = [near, far] camera distances
 * (world units) to dither out over; `opts.doubleSide` for single sheets
 * (palm fronds, hala straps); `opts.grow` for the town's buildings, whose
 * instances carry their years (aSpan, aStretch); `opts.yield` for an island's
 * (towns.js), which give way to a district's inside it (uYieldRect, uYield).
 * `shared` is the app's bag of uniforms, `own` the district features' (uShow,
 * uFeatSeen, uDistS, uYearNow, uTownClear), or an island's with its shadows
 * (uShadeS, uShadeRect).
 */
export function objectMaterial(shared, own, opts = {}) {
  const [near, far] = opts.fade || [60, 90]
  return new THREE.ShaderMaterial({
    vertexShader: objectVertex,
    fragmentShader: objectFragment,
    vertexColors: true,
    side: opts.doubleSide ? THREE.DoubleSide : THREE.FrontSide,
    defines: { ...(opts.grow ? { USE_GROW: '' } : {}), ...(opts.yield ? { USE_YIELD: '' } : {}) },
    uniforms: {
      ...shared.uniforms,
      uYearNow: { value: 0 },
      uTownClear: { value: null },
      ...own,
      // (the shadows of the ground under it: the district's unless `own` names an island's)
      uShadeS: own.uShadeS ?? own.uDistS ?? { value: null },
      uShadeRect: own.uShadeRect ?? shared.uniforms.uDistRect,
      uFadeNear: { value: near },
      uFadeFar: { value: far },
    },
  })
}
