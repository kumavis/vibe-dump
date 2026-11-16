// utah-teapot — the cast shell: every surface as a kit.buildSurface geometry, relief or not.
// Imports only THREE, the kit's surface builder and form.js, so the node form check builds
// exactly these geometries (with no relief) and measures them against Newell's patches.

import { buildSurface } from '../../kit/geometry/surface.js'
import { S, chainTable, BODY_CHAIN, LID_CHAIN, revSurface, tubeTable, SPOUT_ALONG, HANDLE_ALONG, withNormals } from './form.js'

export const BODY = chainTable(BODY_CHAIN)
export const LIDC = chainTable(LID_CHAIN)
export const SPOUT = tubeTable({ along: SPOUT_ALONG })
export const HANDLE = tubeTable({ along: HANDLE_ALONG, extend: [0, 0.12] })

/** body registers: arc ranges along the body chain (mm); y given for reading */
const BA = (y, from = 58) => BODY.arcAtY(y, from)
export const ARC = {
  bottom: [0, BA(7)], //                         the underside, plain (y 0 → 7)
  low: [BA(7), BA(21.5)], //                     the low band: bowstrings under the bowl
  belly: [BA(21.5), BA(67)], //                  the main taotie register
  shoulder: [BA(67), BODY.segs[3].a0], //        the shoulder band + the rim bowstrings, up to the rim bead
  rim: [BODY.segs[3].a0, BODY.length], //        Newell's rolled rim bead, plain
}
export const LID_ARC = {
  dome: [0, 44], //   the lid: edge → knob neck (r 7)
  neck: [44, 60.5], // the knob's turned side
  cap: [60.5, LIDC.length], // the knob's flat top
}
export const WALL = 0.1 * S // 3.73 mm: the rim bead's own width, so the inner wall meets its inner edge

/** panel sizes (mm) for every relief slot, before anything is built */
export function layout() {
  const reg = (k) => {
    const [a0, a1] = ARC[k]
    const rMid = BODY.at((a0 + a1) / 2).r
    return { w: Math.PI * rMid, h: a1 - a0, a0, a1, rMid, rAt: (y) => BODY.at(a0 + y).r }
  }
  const tube = (T) => {
    const map = trueTubeMap(T)
    return { w: map.W, h: T.length, halfWidthAt: map.halfWidthAt, map }
  }
  const lidR = LIDC.at(LID_ARC.dome[1]).r
  return {
    low: reg('low'), belly: reg('belly'), shoulder: reg('shoulder'),
    // lid: an azimuthal-equidistant disc round the axis (radius = neck radius + arc down the dome)
    lid: { w: 2 * (lidR + LID_ARC.dome[1]), h: 2 * (lidR + LID_ARC.dome[1]), rNeck: lidR, rEdge: lidR + LID_ARC.dome[1] },
    neck: { w: 2 * Math.PI * LIDC.at((LID_ARC.neck[0] + LID_ARC.neck[1]) / 2).r, h: LID_ARC.neck[1] - LID_ARC.neck[0] },
    cap: { w: 2 * (LIDC.length - LID_ARC.cap[0]) + 2, h: 2 * (LIDC.length - LID_ARC.cap[0]) + 2 },
    spout: tube(SPOUT), handle: tube(HANDLE),
  }
}

/**
 * "True" developed map for a tube: panel x = arc round the section from the u = ½ meridian (+ W/2),
 * panel y = v × length. W = the largest circumference. Returns panelMap(u, v, out) for buildSurface,
 * which also fades the displacement to 0 within `fade` mm of the u = 0 / 1 seam.
 */
export function trueTubeMap(T, { nv = 160, nu = 96, fade = 1.5 } = {}) {
  const arcs = [] // per v row: cumulative arc at each u sample
  let W = 0
  const p = [0, 0, 0], q = [0, 0, 0]
  for (let j = 0; j <= nv; j++) {
    const v = j / nv
    const row = new Float64Array(nu + 1)
    T.point(0, v, q)
    for (let i = 1; i <= nu; i++) {
      T.point(i / nu, v, p)
      row[i] = row[i - 1] + Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2])
      q[0] = p[0]; q[1] = p[1]; q[2] = p[2]
    }
    W = Math.max(W, row[nu])
    arcs.push(row)
  }
  W = Math.ceil(W + 2)
  const H = T.length
  const look = (u, v) => {
    const y = Math.min(nv, Math.max(0, v * nv)), j = Math.min(nv - 1, Math.floor(y)), fy = y - j
    const x = Math.min(nu, Math.max(0, u * nu)), i = Math.min(nu - 1, Math.floor(x)), fx = x - i
    const a = arcs[j], b = arcs[j + 1]
    const r0 = a[i] + (a[i + 1] - a[i]) * fx, r1 = b[i] + (b[i + 1] - b[i]) * fx
    const c0 = a[nu / 2], c1 = b[nu / 2], t0 = a[nu], t1 = b[nu]
    return { arc: r0 + (r1 - r0) * fy, mid: c0 + (c1 - c0) * fy, total: t0 + (t1 - t0) * fy }
  }
  const smooth = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x))
  return {
    W, H,
    /** half the circumference at panel height y (mm): the décor must stay inside W/2 ± this */
    halfWidthAt: (y) => look(0.5, y / H).total / 2,
    panelMap(u, v, out) {
      const L = look(u, v)
      const x = L.arc - L.mid
      out[0] = 0.5 + x / W
      out[1] = v
      out[2] = smooth((L.total / 2 - Math.abs(x)) / fade)
    },
  }
}

/**
 * Every surface of the pot as a geometry (no materials): { name, geo, relief, kind: 'outer' | 'inner' | 'plain' }.
 * reliefs: { low, belly, shoulder, lid, neck, cap, spout, handle } → ReliefMap | null.
 */
export function buildShell({ q = 1, reliefs = {}, L = layout() } = {}) {
  const out = []
  const sq = Math.sqrt(q)
  const nu = Math.round(220 * sq) // per half revolution: shared by every body piece so the rows meet
  const halves = [[-90, 90, 'front'], [90, 270, 'back']]
  const vDens = { bottom: 1.0, low: 1.1, belly: 1.25, shoulder: 1.25, rim: 1.2 }
  for (const [az0, az1, side] of halves) {
    for (const [name, [a0, a1]] of Object.entries(ARC)) {
      const relief = reliefs[name] || null
      const nv = Math.max(6, Math.round((a1 - a0) * vDens[name] * sq))
      // the underside is flat to arc ≈ 44 and only then turns up: rows sparse there, dense round the turn
      let samples = null
      if (name === 'bottom') {
        const vs = []
        for (let a = 0; a < 44; a += 6 / sq) vs.push(a / a1)
        for (let a = 44; a < a1 - 1e-6; a += 0.9 / sq) vs.push(a / a1)
        vs.push(1)
        samples = { u: Array.from({ length: nu + 1 }, (_, i) => i / nu), v: vs }
      }
      const geo = buildSurface({
        surface: revSurface(BODY, { az0, az1, a0, a1 }),
        segments: [nu, nv], samples,
        relief,
        fade: { u0: 1.5, u1: 1.5, v0: 1.2, v1: 1.2 },
      })
      out.push({ name: `body-${name}-${side}`, part: 'body', geo, relief, kind: 'outer', register: name })
    }
  }
  // inner wall: the meridian offset WALL inward (revolved as a circle), from the floor to the rim bead's inner edge
  {
    const pts = []
    const a1 = ARC.rim[0]
    for (let a = 0; a <= a1 + 1e-6; a += a < 44 ? 8 : 2.5) {
      const p0 = BODY.at(Math.max(0, a - 0.3)), p1 = BODY.at(Math.min(a1, a + 0.3)), m = BODY.at(a)
      const tx = p1.r - p0.r, ty = p1.y - p0.y, l = Math.hypot(tx, ty) || 1
      // outward normal of the (r, y) meridian = (ty, −tx)/l; inward offset
      pts.push([Math.max(0, m.r - (ty / l) * WALL), m.y + (tx / l) * WALL])
    }
    pts[0][0] = 0
    const rimEnd = BODY.at(BODY.length)
    pts.push([rimEnd.r, rimEnd.y])
    const geo = buildSurface({ surface: revolvePolyline(pts, { inward: true }), segments: [Math.round(120 * sq), pts.length - 1] })
    out.push({ name: 'body-inner', part: 'body', geo, relief: null, kind: 'inner' })
  }
  // lid dome, knob neck, knob cap (one revolved surface each; the panels are laid by panelMap)
  {
    const lid = L.lid
    const polar = (rOf) => (u, v, pm, a0, a1) => {
      const az = (-180 + 360 * u) * (Math.PI / 180)
      const rr = rOf(a0 + (a1 - a0) * v)
      pm[0] = 0.5 + (rr * Math.sin(az)) / lid.w
      pm[1] = 0.5 - (rr * Math.cos(az)) / lid.h
      pm[2] = 1
    }
    const lidMap = polar((a) => lid.rNeck + (LID_ARC.dome[1] - a))
    const [d0, d1] = LID_ARC.dome
    const relief = reliefs.lid || null
    out.push({
      name: 'lid-dome', part: 'lid', kind: 'outer', relief, register: 'lid',
      geo: buildSurface({
        surface: revSurface(LIDC, { az0: -180, az1: 180, a0: d0, a1: d1 }),
        segments: [Math.round(288 * sq), Math.round((d1 - d0) * 1.2 * sq)],
        relief, fade: { u0: 0, u1: 0, v0: 0, v1: 0 },
        panelMap: (u, v, pm) => {
          lidMap(u, v, pm, d0, d1)
          const a = d0 + (d1 - d0) * v
          pm[2] = smoothFade(a - 3.2, 1.2) * smoothFade(d1 - a, 1.2) // the edge turn-down and the neck stay plain
        },
      }),
    })
    const [n0, n1] = LID_ARC.neck
    out.push({
      name: 'lid-neck', part: 'lid', kind: 'outer', relief: reliefs.neck || null, register: 'neck',
      geo: buildSurface({
        surface: revSurface(LIDC, { az0: -180, az1: 180, a0: n0, a1: n1 }),
        segments: [Math.round(160 * sq), Math.round((n1 - n0) * 1.6 * sq)],
        relief: reliefs.neck || null, fade: { u0: 0, u1: 0, v0: 1, v1: 1 },
      }),
    })
    const [c0, c1] = LID_ARC.cap
    const cap = L.cap
    out.push({
      name: 'lid-cap', part: 'lid', kind: 'outer', relief: reliefs.cap || null, register: 'cap',
      geo: buildSurface({
        surface: revSurface(LIDC, { az0: -180, az1: 180, a0: c0, a1: c1 }),
        segments: [Math.round(160 * sq), Math.round((c1 - c0) * 2.2 * sq)],
        relief: reliefs.cap || null, fade: { u0: 0, u1: 0, v0: 0, v1: 0 },
        panelMap: (u, v, pm) => {
          const az = (-180 + 360 * u) * (Math.PI / 180)
          const a = c0 + (c1 - c0) * v
          const rr = LIDC.length - a
          pm[0] = 0.5 + (rr * Math.sin(az)) / cap.w
          pm[1] = 0.5 - (rr * Math.cos(az)) / cap.h
          pm[2] = smoothFade(a - c0, 1.0)
        },
      }),
    })
    // the lid's skirt: a short plain ring under the lid edge, so the seam reads as a shadow gap over metal
    const e = LIDC.at(0)
    const skirt = [[e.r, e.y], [e.r, e.y - 7], [e.r - 2.2, e.y - 7], [e.r - 2.2, e.y - 0.6]]
    out.push({ name: 'lid-skirt', part: 'lid', kind: 'plain', relief: null, geo: buildSurface({ surface: revolvePolyline(skirt, { inward: true }), segments: [Math.round(120 * sq), skirt.length - 1] }) })
  }
  // spout: hollow — the tube (root → the lip's start) has a 2 mm wall; Newell's rolled lip is its own thickness
  {
    const relief = reliefs.spout || null
    const vA = SPOUT.splitV // the lip patches start here
    const sub = (v0, v1) => withNormals((u, v, o) => SPOUT.point(u, v0 + (v1 - v0) * v, o))
    const map = (v0, v1) => (u, v, pm) => L.spout.map.panelMap(u, v0 + (v1 - v0) * v, pm)
    out.push({
      name: 'spout', part: 'spout', kind: 'outer', relief, register: 'spout',
      geo: buildSurface({
        surface: sub(0, vA), segments: [Math.round(120 * sq), Math.round(SPOUT.length * vA * 1.3 * sq)],
        relief, fade: { u0: 0, u1: 0, v0: 1.5, v1: 0 }, panelMap: map(0, vA), back: { thickness: 2.0, rims: [] },
      }),
    })
    out.push({
      name: 'spout-lip', part: 'spout', kind: 'outer', relief, register: 'spout',
      geo: buildSurface({
        surface: sub(vA, 1), segments: [Math.round(120 * sq), Math.round(SPOUT.length * (1 - vA) * 2.2 * sq)],
        relief, fade: { u0: 0, u1: 0, v0: 0, v1: 0 }, panelMap: map(vA, 1),
      }),
    })
    // inside the mouth: close the lip's inner edge onto the tube's inner wall (seen looking down the spout)
    const n = [0, 0, 0], a = [0, 0, 0], b = [0, 0, 0]
    out.push({
      name: 'spout-bore', part: 'spout', kind: 'bridge', relief: null,
      geo: buildSurface({
        surface: withNormals((u, w, o) => {
          SPOUT.point(u, 1, a)
          SPOUT.point(u, vA, b)
          SPOUT.surface.normal(u, vA, n)
          for (let i = 0; i < 3; i++) o[i] = a[i] + (b[i] - 2.0 * n[i] - a[i]) * w
          return o
        }),
        segments: [Math.round(120 * sq), 2],
      }),
    })
  }
  // handle: solid; ends sunk into the wall
  {
    const relief = reliefs.handle || null
    out.push({
      name: 'handle', part: 'handles', kind: 'outer', relief, register: 'handle',
      geo: buildSurface({
        surface: HANDLE.surface,
        segments: [Math.round(96 * sq), Math.round(HANDLE.length * 1.2 * sq)],
        relief, fade: { u0: 0, u1: 0, v0: 0, v1: 0 }, panelMap: L.handle.map.panelMap,
      }),
    })
  }
  return out
}

function smoothFade(x, w) {
  if (x <= 0) return 0
  if (x >= w) return 1
  const t = x / w
  return t * t * (3 - 2 * t)
}

/** a revolved (r, y) polyline (true circle), u = azimuth −180 → 180; inward: normals toward the axis */
export function revolvePolyline(pts, { inward = false } = {}) {
  const cum = [0]
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
  const L = cum[cum.length - 1]
  // segments = pts.length − 1 rows: sample exactly at the vertices (v = i / (n − 1))
  const P = (u, v, o) => {
    const x = v * (pts.length - 1)
    const i = Math.min(pts.length - 2, Math.floor(x)), f = x - i
    const r = pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f
    const y = pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f
    const az = (inward ? 180 - 360 * u : -180 + 360 * u) * (Math.PI / 180)
    o[0] = r * Math.sin(az); o[1] = y; o[2] = r * Math.cos(az)
    return o
  }
  void L
  return withNormals(P)
}
