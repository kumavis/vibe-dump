// A tiny geometry kit and the one material every object on the island uses.
//
// Everything built by hand here — hale, canoes, heiau, walls, people, trees —
// is assembled from boxes, tapered cylinders and ribbons into a single buffer
// per thing, with a per-vertex colour and a material code that the shader
// uses for small touches: thatch gets horizontal courses, stone gets mottling,
// foliage sways in the wind, kapa stays bright white.

import * as THREE from 'three'
import { constants, noise, heightFetch, lighting } from '../render/shaders/common.glsl.js'

// Presentation scale: world units per metre for structures. One world unit is
// 100 m; things are drawn 1.6× life size so a hale reads from a hillside away.
export const S = 0.016

export const MAT = { plain: 0, thatch: 1, stone: 2, leaf: 3, water: 4, kapa: 5, wood: 6, skin: 7, sand: 8 }

export class Builder {
  constructor() {
    this.pos = []
    this.nor = []
    this.col = []
    this.mat = []
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

  get count() {
    return this.pos.length / 3
  }

  tri(a, b, c, color, mat = 0, flat = true) {
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
    }
    void flat
  }

  quad(a, b, c, d, color, mat = 0) {
    this.tri(a, b, c, color, mat)
    this.tri(a, c, d, color, mat)
  }

  /** Axis-aligned box centred at (x, y0..y0+h, z), optionally rotated about y. */
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
    this.quad(t[0], t[3], t[2], t[1], color, mat)
    this.quad(b[0], b[1], t[1], t[0], color, mat)
    this.quad(b[1], b[2], t[2], t[1], color, mat)
    this.quad(b[2], b[3], t[3], t[2], color, mat)
    this.quad(b[3], b[0], t[0], t[3], color, mat)
  }

  /** Tapered cylinder between two points. */
  cyl(a, b, r0, r1, color, mat = 0, seg = 6, caps = false) {
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
    for (let k = 0; k < seg; k++) {
      const p0 = ring(a, r0, k)
      const p1 = ring(a, r0, k + 1)
      const q0 = ring(b, r1, k)
      const q1 = ring(b, r1, k + 1)
      this.quad(p0, p1, q1, q0, color, mat)
      if (caps) {
        this.tri(b, q0, q1, color, mat)
      }
    }
  }

  /** A low irregular blob (stone, bush, crown): squashed icosahedron-ish. */
  blob(x, y, z, rx, ry, rz, color, mat = 0, seed = 0, smooth = mat === MAT.leaf, detail = 1) {
    const t = (1 + Math.sqrt(5)) / 2
    const V = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]]
    const F = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8], [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]]
    const jit = (i) => 0.85 + 0.3 * Math.abs(Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453 % 1)
    const P = V.map((p, i) => {
      const l = Math.hypot(...p)
      const j = jit(i)
      return [x + (p[0] / l) * rx * j, y + (p[1] / l) * ry * j, z + (p[2] / l) * rz * j]
    })
    if (!smooth) {
      for (const f of F) this.tri(P[f[0]], P[f[1]], P[f[2]], color, mat)
      return
    }
    // crowns: subdivide once and shade with sphere-like normals, so they read
    // as soft masses of leaves rather than cut gems
    const mid = (a, b) => {
      const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]
      const d = [(m[0] - x) / rx, (m[1] - y) / ry, (m[2] - z) / rz]
      const l = Math.hypot(...d) || 1
      const j = 0.9 + 0.2 * Math.abs((Math.sin(m[0] * 91.7 + m[2] * 47.3 + seed) * 43758.5453) % 1)
      return [x + (d[0] / l) * rx * j, y + (d[1] / l) * ry * j, z + (d[2] / l) * rz * j]
    }
    const nrm = (p) => {
      const d = [(p[0] - x) / (rx * rx), (p[1] - y) / (ry * ry), (p[2] - z) / (rz * rz)]
      const l = Math.hypot(...d) || 1
      return [d[0] / l, d[1] / l, d[2] / l]
    }
    const put = (a, b, c) => {
      const pts = this.xf ? [this.xf(a), this.xf(b), this.xf(c)] : [a, b, c]
      const ns = [nrm(a), nrm(b), nrm(c)]
      for (let k = 0; k < 3; k++) {
        this.pos.push(...pts[k])
        this.nor.push(...ns[k])
        this.col.push(color[0], color[1], color[2])
        this.mat.push(mat)
      }
    }
    if (detail === 0) {
      // the far-off version: the bare twenty faces, still shaded round
      for (const f of F) put(P[f[0]], P[f[1]], P[f[2]])
      return
    }
    for (const f of F) {
      const a = P[f[0]]
      const b = P[f[1]]
      const c = P[f[2]]
      const ab = mid(a, b)
      const bc = mid(b, c)
      const ca = mid(c, a)
      put(a, ab, ca)
      put(ab, b, bc)
      put(ca, bc, c)
      put(ab, bc, ca)
    }
  }

  /**
   * A ribbon wall along a polyline: `pts` are [x, y, z] (y = base), each with
   * a width and a height; sloped sides like a dry-stacked stone wall.
   */
  wall(pts, width, height, color, mat = MAT.stone, batter = 0.7) {
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i]
      const b = pts[i + 1]
      const dx = b[0] - a[0]
      const dz = b[2] - a[2]
      const l = Math.hypot(dx, dz) || 1
      const nx = -dz / l
      const nz = dx / l
      const wb = width / 2
      const wt = (width * batter) / 2
      const A = (p, w, h) => [p[0] + nx * w, p[1] + h, p[2] + nz * w]
      const a0 = A(a, -wb, -height * 0.3)
      const a1 = A(a, wb, -height * 0.3)
      const a2 = A(a, wt, height)
      const a3 = A(a, -wt, height)
      const b0 = A(b, -wb, -height * 0.3)
      const b1 = A(b, wb, -height * 0.3)
      const b2 = A(b, wt, height)
      const b3 = A(b, -wt, height)
      this.quad(a3, a2, b2, b3, color, mat)
      this.quad(a1, b1, b2, a2, color, mat)
      this.quad(b0, a0, a3, b3, color, mat)
    }
  }

  geometry() {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3))
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.nor, 3))
    g.setAttribute('color', new THREE.Float32BufferAttribute(this.col, 3))
    g.setAttribute('aMat', new THREE.Float32BufferAttribute(this.mat, 1))
    g.computeBoundingSphere()
    return g
  }
}

/** sRGB hex → linear [r, g, b], with optional brightness jitter. */
export function col(hex, j = 0, rand = Math.random) {
  const c = new THREE.Color(hex)
  const k = 1 + (rand() - 0.5) * j
  return [c.r * k, c.g * k, c.b * k]
}

const objectVertex = /* glsl */ `
${constants}
in float aMat;
uniform float uTime;
uniform vec2 uWindVec;
uniform float uFadeNear;
uniform float uFadeFar;
uniform vec2 uFadeIn;
uniform float uFadeClose;
uniform float uSway;
out vec3 vWorld;
out vec3 vNormal;
out vec3 vColor;
out float vMat;
out vec3 vLocal;
out float vFade;
out float vFadeIn;
void main() {
  mat4 im = mat4(1.0);
  #ifdef USE_INSTANCING
  im = instanceMatrix;
  #endif
  vec3 p = position;
  mat4 mm = modelMatrix * im;
  vec4 wp = mm * vec4(p, 1.0);
  vec3 origin = (mm * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
  vec3 c = color;
  #ifdef USE_INSTANCING_COLOR
  c *= instanceColor;
  #endif
  if (uSway > 0.0) {
    // A plant sways as one piece: phase and gusts come from where it stands,
    // and it bends more toward the top. Models are in metres, so the bend is
    // worked out in metres and scaled into the world by the instance's size.
    float scale = length(mm[1].xyz);
    float h = max(p.y, 0.0);
    float bend = (0.02 * h + 0.0012 * h * h) * scale * uSway;
    float ph = uTime * 1.3 + origin.x * 37.0 + origin.z * 23.0;
    float gust = 0.6 + 0.4 * sin(uTime * 0.55 + origin.x * 2.1 + origin.z * 1.7);
    wp.xz += uWindVec * (0.55 + 0.45 * sin(ph)) * gust * bend;
    if (aMat > 2.5 && aMat < 3.5) {
      // and the leaves flutter a few centimetres on their own
      float f = uTime * 5.0 + dot(p, vec3(1.7, 2.3, 1.1));
      wp.xyz += vec3(sin(f), 0.5 * sin(f * 1.3 + 1.0), cos(f * 0.9)) * (0.05 * min(h, 4.0) / 4.0) * scale * length(uWindVec) * uSway;
    }
  }
  vWorld = wp.xyz;
  vNormal = normalize(mat3(mm) * normal);
  vColor = c;
  vMat = aMat;
  vLocal = p;
  #ifdef USE_INSTANCING
  // whole instances fade together, so a tree never dissolves from one side
  float dist = distance(cameraPosition, origin);
  #else
  float dist = distance(cameraPosition, wp.xyz);
  #endif
  vFade = 1.0 - smoothstep(uFadeNear, uFadeFar, dist);
  // a tree right in front of the lens thins out rather than filling the view
  if (uFadeClose > 0.0) vFade *= smoothstep(uFadeClose * 0.5, uFadeClose, dist);
  // the far, simpler model of a tree dithers in exactly where the near one
  // dithers out (complementary thresholds, so no gaps and no doubling)
  vFadeIn = uFadeIn.y > 0.0 ? smoothstep(uFadeIn.x, uFadeIn.y, dist) : 1.0;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`

const objectFragment = /* glsl */ `
${constants}
${noise}
${heightFetch}
${lighting}
in vec3 vWorld;
in vec3 vNormal;
in vec3 vColor;
in float vMat;
in vec3 vLocal;
in float vFade;
in float vFadeIn;
uniform int uObjDebug;
void main() {
  if (vFade <= 0.0 || vFadeIn <= 0.0) discard;
  // dither in and out over a distance instead of popping
  float dither = hash12(gl_FragCoord.xy);
  if (dither >= vFade || dither < 1.0 - vFadeIn) discard;
  vec3 n = normalize(vNormal);
  if (!gl_FrontFacing) n = -n;
  vec3 a = vColor;
  int m = int(vMat + 0.5);
  if (m == 1) {
    // thatch: courses of pili grass, darker in the grooves
    float course = fract(vLocal.y * 2.6 + vnoise(vWorld.xz * 400.0) * 0.3);
    a *= 0.78 + 0.32 * smoothstep(0.0, 0.5, course) * (0.85 + 0.3 * vnoise(vWorld.xz * 900.0 + vLocal.y * 9.0));
  } else if (m == 2) {
    // dry-stacked stone: mottled, with dark joints
    vec2 sp = vWorld.xz * 260.0 + vec2(vWorld.y * 190.0, -vWorld.y * 170.0);
    vec3 v = voronoi(fract(sp / 512.0) * 512.0);
    a *= (0.7 + 0.5 * v.y) * (0.55 + 0.45 * smoothstep(0.0, 0.12, v.z));
  } else if (m == 3) {
    a *= 0.8 + 0.4 * vnoise(vWorld.xz * 600.0 + vLocal.y * 30.0);
  } else if (m == 6) {
    a *= 0.85 + 0.25 * vnoise(vec2(vLocal.y * 40.0, vWorld.x * 300.0));
  }
  // wet surfaces darken in the rain
  float wet = uWetness * (m == 5 ? 0.3 : 1.0);
  a *= 1.0 - 0.3 * wet;
  float vis = sunVisibility(vWorld);
  vec3 lit = shade(a, n, vWorld, 1.0, vis);
  // a little wrap and translucency for leaves
  if (m == 3) lit += a * uSunColor * max(dot(-n, uSunDir), 0.0) * 0.25 * vis;
  if (m == 5) lit += a * uSkyColor * 0.15;
  if (uObjDebug == 1) lit = a * 3.0;
  if (uObjDebug == 2) lit = n * 0.5 + 0.5;
  if (uObjDebug == 3) lit = vec3(vis);
  if (uObjDebug == 4) lit = vColor * 3.0;
  gl_FragColor = vec4(lit, 1.0);
}
`

/**
 * The shared object material. `opts.fade` = [near, far] world-unit distances
 * to dither out over; `opts.fadeIn` = [near, far] to dither in over (the far
 * level of detail of something whose near model fades out over the same band);
 * `opts.close` dithers out whole instances nearer the camera than that;
 * `opts.sway` bends instances with the wind (plants).
 */
export function objectMaterial(shared, opts = {}) {
  const [near, far] = opts.fade || [120, 160]
  const m = new THREE.ShaderMaterial({
    vertexShader: objectVertex,
    fragmentShader: objectFragment,
    vertexColors: true,
    side: opts.doubleSide ? THREE.DoubleSide : THREE.FrontSide,
    uniforms: {
      ...shared.uniforms,
      uWindVec: shared.uniforms.uWindVec || { value: new THREE.Vector2(1, 0) },
      uFadeNear: { value: near },
      uFadeFar: { value: far },
      uFadeClose: { value: opts.close || 0 },
      uFadeIn: { value: new THREE.Vector2(...(opts.fadeIn || [0, 0])) },
      uSway: { value: opts.sway || 0 },
      uObjDebug: { value: 0 },
    },
  })
  return m
}
