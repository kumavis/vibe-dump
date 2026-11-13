// Upright loop handles 立耳 — research/03 §1.1, §3.4 (cast-on), §3.5, §5, §6.1.5.
//
// The arch is built in its own frame: in the XY plane, centred on x = 0, the
// rim top at y = 0, the OUTER face toward +Z (rotate the handle so +Z points
// away from the vessel). Each face of the bar is its own patch so it can carry
// a ReliefMap:
//   outer  the broad +Z face (Houmuwu: two tigers flanking a human head) — mapped
//          1:1 in mm onto the arch's bounding rect (panel = width × height); draw
//          inside `outline` (outer contour + aperture, panel mm)
//   edge   the outer perimeter strip, unrolled by arc length (Houmuwu: fish) —
//          panel = edge length above the rim × depth
//   inner / back   the aperture strip and the −Z face (plain by default)
//   root   the block at each foot that straddles the rim and hangs over its
//          outer face (Houmuwu: small masks) — panel = root width × root height
// L3 sculpture: Group with userData.part = 'handles'.

import * as THREE from 'three'
import { buildSurface } from './surface.js'
import { withNormals } from './fang.js'
import { PatinaMaterial } from '../material/patina.js'
import { Rng } from '../util/rng.js'

const clamp = (x, a, b) => Math.min(b, Math.max(a, x))
const lerp = (a, b, t) => a + (b - a) * t
const rad = (d) => (d * Math.PI) / 180
function ramp(x, w) {
  if (w <= 0) return 1
  if (x <= 0) return 0
  if (x >= w) return 1
  const t = x / w
  return t * t * (3 - 2 * t)
}

/**
 * A U contour (left leg up, rounded corner, top, corner, right leg down), as a
 * function of s ∈ [0, 1] with fixed segment fractions so the outer and inner
 * contours pair up segment by segment.
 */
function contour(halfW, top, r, yBot, frac) {
  return (s, out) => {
    const [f0, f1, f2, f3] = frac
    if (s <= f0) {
      out[0] = -halfW; out[1] = lerp(yBot, top - r, s / f0)
    } else if (s <= f1) {
      const ph = ((s - f0) / (f1 - f0)) * Math.PI * 0.5
      out[0] = -halfW + r - r * Math.cos(ph); out[1] = top - r + r * Math.sin(ph)
    } else if (s <= f2) {
      out[0] = lerp(-halfW + r, halfW - r, (s - f1) / (f2 - f1)); out[1] = top
    } else if (s <= f3) {
      const ph = ((s - f2) / (f3 - f2)) * Math.PI * 0.5
      out[0] = halfW - r + r * Math.sin(ph); out[1] = top - r + r * Math.cos(ph)
    } else {
      out[0] = halfW; out[1] = lerp(top - r, yBot, (s - f3) / (1 - f3))
    }
    return out
  }
}
function fractions(halfW, top, r, yBot) {
  const legL = Math.max(1e-3, top - r - yBot), topL = Math.max(1e-3, 2 * (halfW - r)), arcL = Math.max(1e-3, (Math.PI / 2) * r)
  const tot = 2 * legL + topL + 2 * arcL
  const f0 = legL / tot, f1 = f0 + arcL / tot, f2 = f1 + topL / tot, f3 = f2 + arcL / tot
  return [f0, f1, f2, f3]
}

/** Panel sizes (mm) for authoring a handle's faces before building it. */
export function handleLayout(o) {
  const { width, height, bar, depth } = o
  const W = width / 2
  const Ro = o.radius ?? bar * 0.6
  const barTop = o.barTop ?? bar
  const wa = W - bar
  const Ri = Math.min(o.aperture?.radius ?? wa * 0.5, wa)
  const topI = height - barTop
  const legL = height - Ro, arcL = (Math.PI / 2) * Ro, topL = 2 * (W - Ro)
  const outerC = [], innerC = []
  const co = contour(W, height, Ro, 0, fractions(W, height, Ro, 0))
  const ci = contour(wa, topI, Ri, 0, fractions(wa, topI, Ri, 0))
  for (let i = 0; i <= 64; i++) {
    const a = co(i / 64, [0, 0]), b = ci(i / 64, [0, 0])
    outerC.push([a[0] + W, a[1]])
    innerC.push([b[0] + W, b[1]])
  }
  const root = o.root ? { w: o.root.width ?? bar * 1.06, h: (o.root.height ?? bar) + (o.root.rise ?? bar * 0.35) } : null
  return {
    outer: { w: width, h: height, outline: { outer: outerC, inner: innerC } },
    edge: { w: 2 * legL + 2 * arcL + topL, h: depth, legLength: legL, arcLength: arcL, topLength: topL },
    root,
  }
}

/**
 * Upright loop handle.
 * @param {object} o
 * @param {number} o.width   outer width of the arch (mm)
 * @param {number} o.height  rim top → top of the arch (mm)
 * @param {number} o.bar     face width of the legs (mm); `barTop` for the top bar (default = bar)
 * @param {number} o.depth   thickness perpendicular to the arch plane (mm)
 * @param {number} [o.radius]           outer top-corner radius (default 0.6 bar)
 * @param {{radius}} [o.aperture]       aperture top-corner radius (default ½ aperture width = round-topped)
 * @param {number} [o.lean]             deg, top tilts toward +Z (outward: 3–8°)
 * @param {{width, depth}} [o.channel]  groove along the outer face (channelled section)
 * @param {number} [o.embed]            the legs sink this far below y = 0 into the rim
 * @param {{width?, height, rise?, outset, inset?}} [o.root]  block at each foot: from `rise` above the rim top
 *        down `height` (the rim's thickness), from `inset` mm behind the back face to `outset` mm beyond the outer face
 * @param {{outer?, edge?, inner?, back?, root?}} [o.faces]  ReliefMap | { relief, material, fade }
 * @param {{seed, lean?, height?}} [o.cast]   ±2° lean, ±1 % height (research §5)
 * @returns {THREE.Group} part 'handles'; userData.layout = handleLayout(o)
 */
export function uprightHandle(o) {
  const {
    width, bar, depth, material = new PatinaMaterial(), part = 'handles', density = 0.6, faces = {}, channel = null,
  } = o
  let height = o.height
  let lean = o.lean ?? 0
  if (o.cast) {
    const r = new Rng(o.cast.seed ?? 5)
    lean += r.jitter(o.cast.lean ?? 1.5)
    height *= 1 + r.jitter(o.cast.height ?? 0.008)
  }
  const embed = o.embed ?? Math.min(bar, 20)
  const W = width / 2
  const Ro = Math.min(o.radius ?? bar * 0.6, W, height)
  const barTop = o.barTop ?? bar
  const wa = W - bar
  const topI = height - barTop
  const Ri = Math.min(o.aperture?.radius ?? wa * 0.5, wa, topI)
  const D = depth / 2
  const fo = fractions(W, height, Ro, -embed)
  const fi = fractions(wa, topI, Ri, -embed)
  // pair outer and inner contours by segment, not by global s
  const segMap = (s, from, to) => {
    const a = [0, ...from, 1], b = [0, ...to, 1]
    for (let i = 0; i < 5; i++) if (s <= a[i + 1]) return lerp(b[i], b[i + 1], (s - a[i]) / (a[i + 1] - a[i]))
    return 1
  }
  const co = contour(W, height, Ro, -embed, fo)
  const ci = contour(wa, topI, Ri, -embed, fi)
  const O = [0, 0], I = [0, 0]
  const at = (s) => {
    co(s, O)
    ci(segMap(s, fo, fi), I)
  }
  const mats = new Map()
  const spec = (x) => (x ? (x.macro ? { relief: x } : x) : null)
  const matFor = (sp) => {
    if (!sp) return material
    if (sp.material) return sp.material
    if (!mats.has(sp.relief)) mats.set(sp.relief, new PatinaMaterial({ relief: sp.relief }))
    return mats.get(sp.relief)
  }
  const g = new THREE.Group()
  g.name = 'upright-handle'
  g.userData.part = part
  const add = (geo, mat, name) => {
    const m = new THREE.Mesh(geo, mat)
    m.name = name
    m.userData.part = part
    m.castShadow = m.receiveShadow = true
    g.add(m)
    return m
  }
  const perim = 2 * (height + embed) + 2 * W
  const nS = Math.max(48, Math.ceil(perim / 6))
  const groove = (t) => {
    if (!channel) return 0
    const half = (channel.width ?? bar * 0.3) / 2
    const x = Math.abs(t - 0.5) * bar / half
    return x < 1 ? -(channel.depth ?? 2) * (0.5 + 0.5 * Math.cos(Math.PI * x)) : 0
  }

  // outer (+Z) face: u = s along the arch, v = t inner → outer contour; 1:1 planar panel mapping
  const fOuter = spec(faces.outer)
  {
    const pos = (u, v, p) => {
      at(u)
      p.set(lerp(I[0], O[0], v), lerp(I[1], O[1], v), D + groove(v))
    }
    const fade = fOuter?.fade ?? 1.5
    add(buildSurface({
      surface: withNormals(pos),
      segments: fOuter ? { density: fOuter.density ?? density } : [nS, channel ? 12 : 2],
      relief: fOuter?.relief ?? null,
      fade: 0,
      panelMap: fOuter
        ? (u, v, out) => {
            at(u)
            const x = lerp(I[0], O[0], v), y = lerp(I[1], O[1], v)
            const bw = Math.hypot(O[0] - I[0], O[1] - I[1])
            out[0] = (x + W) / width
            out[1] = y / height
            out[2] = ramp(Math.min(v, 1 - v) * bw, fade) * ramp(y, fade)
          }
        : null,
    }), matFor(fOuter), 'handle-outer')
  }
  // back (−Z) face: u = s, v = outer → inner
  const fBack = spec(faces.back)
  add(buildSurface({
    surface: withNormals((u, v, p) => {
      at(u)
      p.set(lerp(O[0], I[0], v), lerp(O[1], I[1], v), -D)
    }),
    segments: fBack ? { density } : [nS, 2],
    relief: fBack?.relief ?? null,
    fade: 0,
    panelMap: fBack
      ? (u, v, out) => {
          at(u)
          const x = lerp(O[0], I[0], v), y = lerp(O[1], I[1], v)
          out[0] = (W - x) / width
          out[1] = y / height
          out[2] = ramp(Math.min(v, 1 - v) * bar, 1.5) * ramp(y, 1.5)
        }
      : null,
  }), matFor(fBack), 'handle-back')
  // outer edge strip: u = s, v = z from +D → −D; unrolled panel by arc length above the rim
  const lay = handleLayout({ ...o, height })
  const fEdge = spec(faces.edge)
  {
    // arc length along the outer contour from its start (y = −embed) to s
    const N = 512
    const cum = new Float32Array(N + 1)
    const tmp = [0, 0], prev = [0, 0]
    co(0, prev)
    for (let i = 1; i <= N; i++) {
      co(i / N, tmp)
      cum[i] = cum[i - 1] + Math.hypot(tmp[0] - prev[0], tmp[1] - prev[1])
      prev[0] = tmp[0]; prev[1] = tmp[1]
    }
    const arcAt = (s) => {
      const f = s * N, i = Math.min(N - 1, Math.floor(f))
      return lerp(cum[i], cum[i + 1], f - i)
    }
    const fade = fEdge?.fade ?? 1.2
    add(buildSurface({
      surface: withNormals((u, v, p) => {
        co(u, O)
        p.set(O[0], O[1], lerp(D, -D, v))
      }),
      segments: fEdge ? { density: fEdge.density ?? density } : [nS, 2],
      relief: fEdge?.relief ?? null,
      fade: 0,
      panelMap: fEdge
        ? (u, v, out) => {
            co(u, O)
            out[0] = (arcAt(u) - embed) / lay.edge.w
            out[1] = 1 - v
            out[2] = ramp(Math.min(v, 1 - v) * depth, fade) * ramp(O[1], fade)
          }
        : null,
    }), matFor(fEdge), 'handle-edge')
  }
  // aperture strip: u = s, v = z from −D → +D
  const fInner = spec(faces.inner)
  add(buildSurface({
    surface: withNormals((u, v, p) => {
      at(u)
      p.set(I[0], I[1], lerp(-D, D, v))
    }),
    segments: [nS, 2],
  }), matFor(fInner && !fInner.relief ? fInner : null), 'handle-inner')
  // foot caps (inside the rim, but closed so the root reads solid)
  for (const s of [0, 1]) {
    at(s)
    const a = [O[0], O[1]], b = [I[0], I[1]]
    const left = s === 0
    add(buildSurface({
      surface: withNormals((u, v, p) => {
        const x = lerp(left ? a[0] : b[0], left ? b[0] : a[0], u)
        p.set(x, -embed, lerp(-D, D, v))
      }),
      segments: [1, 1],
    }), material, 'handle-cap')
  }

  // root blocks: straddle the rim top and hang over the rim's outer face (Houmuwu)
  if (o.root) {
    const rt = o.root
    const rw = rt.width ?? bar * 1.06
    const rh = rt.height ?? bar
    const rise = rt.rise ?? bar * 0.35
    const zf = D + (rt.outset ?? depth * 0.3)
    const zb = -D - (rt.inset ?? 0)
    const fRoot = spec(faces.root)
    for (const sx of [-1, 1]) {
      const cx = sx * (W - bar / 2)
      const x0 = cx - rw / 2, x1 = cx + rw / 2, y0 = -rh, y1 = rise
      const box = [
        // [p00, p10, p01, p11] seen from outside; first is the relief face
        { n: 'front', c: [[x0, y0, zf], [x1, y0, zf], [x0, y1, zf], [x1, y1, zf]], sp: fRoot },
        { n: 'back', c: [[x1, y0, zb], [x0, y0, zb], [x1, y1, zb], [x0, y1, zb]] },
        { n: 'left', c: [[x0, y0, zb], [x0, y0, zf], [x0, y1, zb], [x0, y1, zf]] },
        { n: 'right', c: [[x1, y0, zf], [x1, y0, zb], [x1, y1, zf], [x1, y1, zb]] },
        { n: 'top', c: [[x0, y1, zf], [x1, y1, zf], [x0, y1, zb], [x1, y1, zb]] },
        { n: 'bottom', c: [[x0, y0, zb], [x1, y0, zb], [x0, y0, zf], [x1, y0, zf]] },
      ]
      for (const f of box) {
        const [a, b, c, d] = f.c.map((q) => new THREE.Vector3(...q))
        const pos = (u, v, p) => p.set(0, 0, 0).addScaledVector(a, (1 - u) * (1 - v)).addScaledVector(b, u * (1 - v)).addScaledVector(c, (1 - u) * v).addScaledVector(d, u * v)
        const sp = f.sp
        add(buildSurface({
          surface: withNormals(pos),
          segments: sp ? { density: sp.density ?? density } : [2, 2],
          relief: sp?.relief ?? null,
          fade: sp?.fade ?? 1.5,
        }), matFor(sp), `handle-root-${f.n}`).userData.root = true
      }
    }
  }
  if (lean) {
    const m = new THREE.Matrix4().makeRotationX(rad(lean))
    for (const c of g.children) {
      if (c.userData.root) continue
      c.geometry.applyMatrix4(m)
      c.geometry.computeBoundingBox()
      c.geometry.computeBoundingSphere()
    }
  }
  g.userData.layout = lay
  g.userData.lean = lean
  return g
}
