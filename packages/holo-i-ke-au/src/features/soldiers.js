// The battles' people (DESIGN.md §8, the tone rule): pixel-art figures
// (sprites.js) drawn as camera-facing billboards
// (render/shaders/sprite.glsl.js). forces.js decides which of features.json's
// forces and fronts show, and how strongly; this places their people and
// moves them, as each feature's `behaviour` says (DATA.md, District packs):
//
// - march: people in loose files and knots walking the line, a little faster
//   or slower one from another; each walks it from its start and dissolves
//   somewhere over its last stretch, to come in again at its start. Field
//   pieces the force carries are hauled along among them by their crews.
// - run: the same at a run: a retreat, or a pursuit. A pursuit that follows
//   a retreat of the other side up the same ground keeps its knots behind the
//   retreat's, knot for knot, at the same pace along their lines.
// - stand: knots standing on the line, a few pacing between them; a stand
//   with its enemy close (the last stand at the pali) fights where it stands.
//   Pieces it has are parked, their crews by them.
// - engage: a front (a `line`) is people in loose ranks behind it. Where two
//   fronts of opposing sides stand near each other, the two meet between
//   them: pairs of fighters toe to toe, striking in turn while the other
//   stands on guard and gives a pixel; behind them the ranks shuffle,
//   muskets are levelled and fired, slings whirled and let go, and the field
//   pieces the line carries are served, rammed, fired and smoking. A front
//   alone stands, facing where its enemy comes from.
// - surround: figures come up the line from the valley side at a run, and at
//   its end an arc of them stands round the other side's stand there (half an
//   ellipse along the stand and down the way the line came up, open to the
//   edge), facing in, pressing in and striking and stepping back.
// - leap: figures run from the line's start to its end, at the brink, jump,
//   and fall out of sight down the face: an arc, a tumble of two frames, then
//   gone below the ground or dissolved after a drop, one after another in a
//   steady trickle. Nobody is left anywhere. Seen from afar the run is drawn
//   long enough on the screen to be seen, and clear of the stand's knots.
//
// Off the tour, in the battle's year, fewer of them show (forces.js gives the
// quiet weight), walking and standing only, at half pace: nobody fights and
// nobody goes over.
//
// What each carries is the feature's `arms` (RESEARCH.md §12): its shares of
// spear, club, sling, dagger and musket shared out among its people by
// largest remainder, so the counts match the data within one, the fighters of
// the close fight (the pairs, the arc) taking the spears, clubs and daggers
// first; and exactly its `cannon`, each a piece with its crew of two. A few
// on each side are chiefs in cloaks.
//
// Facings. Each figure has a heading on the ground (the way it moves, or the
// way it aims: at a front, across the line at the other side, whichever way
// the camera looks), turned into the camera's terms: across the screen, and
// away from or toward the eye. Mostly toward the eye is the front; away, the
// back; else the side, right or left. A figure keeps its facing until another
// wins by a quarter (HOLD), so nobody turns on every small orbit. A cannon on
// Kamehameha's line at Puʻiwa, seen from below, shows its breech and fires up
// the valley at the Oʻahu line; the Oʻahu line faces the eye.
//
// The size. Every figure is drawn at one scale, picked from the camera's
// distance (wantScale: the CSS pixels to the sprite pixel that cssScale
// gives, 4 at 800 m, 2 at 1.6 km, 1 at 8.5 km, in device pixels, never fewer
// than two nor more than four CSS pixels' worth). The level kept follows what
// the distance wants with play (PLAY, the hysteresis); across k + 1/2 a band
// (BAND) of it crossfades k and k + 1 by the ordered dither in whole sprite
// pixels, every pixel of a figure in exactly one of the two, so it dissolves
// from one size to the next instead of popping; and a crossfade left half
// done when the camera stops finishes toward the nearer size (RATE). Past
// 8.5 km from the eye they thin out, each at its own distance out to 11 km.
// Their pace is set in sprite pixels a second at the scale drawn, so the gait
// looks the same at every zoom, and so are the offsets of figures that stand
// together, the arc round the stand and the fall from the pali.
//
// The work each frame is in typed arrays: each figure's state is advanced,
// its foot found on the ground of the year (world.metresAt, looked up again
// only once it has moved a metre or the ground has changed under it, and now
// and then), and every one shown is written into the instance buffers, one
// draw for the figures and one for their shadows, at most MAX_DRAWN figures
// (twice as many instances while a crossfade draws both sizes).

import * as THREE from 'three'
import { buildSheet, SPRITE_H, SPRITE_W, KINDS, SIDES, DRESS, FRAMES, WIDTH } from './sprites.js'
import { spriteVertex, spriteFragment, shadowVertex, shadowFragment } from '../render/shaders/sprite.glsl.js'

export const MAX_DRAWN = 2400
const MODE = { file: 0, knot: 1, pacer: 2, rank: 3, duel: 4, piece: 5, crew: 6, ring: 7, leap: 8 }
const K = Object.fromEntries(KINDS.map((k, i) => [k, i]))
const A_WALK = 0
const A_RUN = 4
const A_IDLE = 8
const A_ENGAGE = 10
const A_FALL = 14
/** Facings: the side to the right, the side mirrored to the left, toward the eye, away from it. */
export const FACE = { right: 0, left: 1, front: 2, back: 3 }
// the block of the sheet each facing is drawn from
const COLUMN = [0, 0, 1, 2]
// a facing held until another wins by this much
export const HOLD = 1.25
// gaits, in sprite pixels a second at the scale drawn
const GAIT_WALK = 9
const GAIT_RUN = 20
const FADE_S = 0.35 // seconds to dissolve in or out
export const BEHAVIOURS = ['march', 'run', 'stand', 'engage', 'surround', 'leap']
export const ARMS = ['spear', 'club', 'sling', 'dagger', 'musket']
const CLOSE = ['spear', 'club', 'dagger']
// the leap, in sprite pixels and seconds: its run (a share of the running gait), the least it runs
// on the screen, the jump's speed across and up, the fall's pull, the drop past which it dissolves,
// how long it is in the air, and the time between one leap and the next
const LEAP = { run: 0.6, least: 18, across: 9, up: 13, pull: 70, fade: 10, air: 1.6, gap: 1.1 }

// --- the scale -------------------------------------------------------------------------

// CSS pixels to the sprite pixel at a distance from the eye (world units): 4 at 800 m, 2 at 1.6 km, 1 at 8.5 km
const Q_FAR = (8 / 85) ** 1.5
export function cssScale(depth) {
  const q = (8 / Math.max(depth, 0.5)) ** 1.5
  return 1 + (3 * (q - Q_FAR)) / (1 - Q_FAR)
}
/** The distance at which cssScale gives c (its inverse). */
function cssDistance(c) {
  const q = Q_FAR + ((c - 1) * (1 - Q_FAR)) / 3
  return 8 / q ** (2 / 3)
}
/** The scale the figures want at a camera distance: device pixels to the sprite pixel, not yet whole. */
export function wantScale(distance, dpr) {
  return Math.max(2, Math.min(4 * dpr, cssScale(distance) * dpr))
}
// the crossfade band round each k + 1/2, the play the level keeps from what the distance wants, and
// how fast a crossfade left half done finishes (in scale a second)
export const BAND = 0.3
export const PLAY = 0.2
const RATE = 2

/** One scale for every figure: k, and t, how far into k + 1 a crossfade is (0 none). */
export class Scale {
  constructor() {
    this.L = NaN
    this.s = NaN
    this.k = 2
    this.t = 0
  }

  /** s: the scale wanted now; dt: seconds since the last (0 to settle at once); lo, hi: its bounds. */
  step(s, dt, lo, hi) {
    if (!Number.isFinite(this.L)) this.L = Math.round(s)
    const moving = Math.abs(s - this.s) > 1e-4
    this.s = s
    // the level held within PLAY of what is wanted
    let want = Math.max(s - PLAY, Math.min(s + PLAY, this.L))
    // at rest (or settling), a crossfade left part done finishes toward the nearer size
    const k = Math.floor(want)
    const u = want - k
    if ((!moving || dt === 0) && u > 0.5 - BAND / 2 && u < 0.5 + BAND / 2) want = k + (u < 0.5 ? 0.5 - BAND / 2 : 0.5 + BAND / 2)
    if (dt === 0) this.L = want
    else this.L += Math.max(-RATE * dt, Math.min(RATE * dt, want - this.L))
    this.L = Math.max(lo, Math.min(hi, this.L))
    const K = Math.floor(this.L + 1e-9)
    this.k = K
    const t = K >= hi ? 0 : (this.L - K - (0.5 - BAND / 2)) / BAND
    // (whole at either end, to the last bit)
    this.t = t < 1e-6 ? 0 : t > 1 - 1e-6 ? 1 : t
    return this
  }
}

/**
 * Where the crossfades fall, for the tools and the record: for each k, the
 * camera distances (world units) over which k gives way to k + 1 coming in,
 * and k + 1 to k going out.
 */
export function scaleBands(dpr) {
  const out = []
  for (let k = 2; k < 4 * dpr; k++) {
    const at = (s) => +cssDistance(s / dpr).toFixed(2)
    out.push({ k, in: [at(k + 0.5 - BAND / 2 + PLAY), at(k + 0.5 + BAND / 2 + PLAY)], out: [at(k + 0.5 + BAND / 2 - PLAY), at(k + 0.5 - BAND / 2 - PLAY)] })
  }
  return out
}

function mulberry32(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// how a force moves when the data does not say (older data): a retreat or a pursuit runs; a
// force that holds its ground, or an army ashore putting itself in order, stands
const RUNS = /\bretreat|\bpursu|\bfalls? back|\bescap|\bflee(s|ing)?\b|\brout(ed|s)?\b|\bgot away|\bover the ridge|\bold path/i
const STANDS = /\bposts?\b|ashore|encamp|in order/i
export function moveOf(p) {
  const text = `${p.name || ''} ${p.note || ''}`
  if (RUNS.test(text)) return 'run'
  if (STANDS.test(`${p.name || ''}`) || /putting itself in order|encamped|organising/i.test(p.note || '')) return 'stand'
  return 'walk'
}
/** A feature's behaviour: its own, or one read from its words. */
export function behaviourOf(r) {
  const b = r.p.behaviour
  if (BEHAVIOURS.includes(b)) return b
  if (r.line) return 'engage'
  const m = moveOf(r.p)
  return m === 'walk' ? 'march' : m
}

/** A polyline's point and direction at arc length s (into out: x, z, dx, dz). */
function along(r, s, out) {
  const cum = r.cum
  const pts = r.pts
  let j = 1
  while (j < cum.length - 1 && cum[j] < s) j++
  const a = pts[j - 1]
  const b = pts[j]
  const L = cum[j] - cum[j - 1] || 1
  const t = Math.max(0, Math.min(1, (s - cum[j - 1]) / L))
  out[2] = (b[0] - a[0]) / L
  out[3] = (b[1] - a[1]) / L
  out[0] = a[0] + (b[0] - a[0]) * t
  out[1] = a[1] + (b[1] - a[1]) * t
  return out
}

/** The stops a rec shows at (null: by inference, any). */
const stopsOf = (r) => (r.p.stop === null || r.p.stop === undefined ? null : [r.p.stop].flat())
const sameStop = (a, b) => {
  const sa = stopsOf(a)
  const sb = stopsOf(b)
  return !sa || !sb || sa.some((v) => sb.includes(v))
}

/** Shares of n by largest remainder: whole counts that sum to n, each within one of its share. */
export function apportion(shares, keys, n) {
  const sum = keys.reduce((s, k) => s + Math.max(0, shares[k] || 0), 0) || 1
  const raw = keys.map((k) => (Math.max(0, shares[k] || 0) / sum) * n)
  const out = raw.map(Math.floor)
  let left = n - out.reduce((s, v) => s + v, 0)
  const order = raw.map((v, i) => [v - Math.floor(v), i]).sort((a, b) => b[0] - a[0])
  for (let q = 0; left > 0; q++, left--) out[order[q % order.length][1]]++
  return Object.fromEntries(keys.map((k, i) => [k, out[i]]))
}

export class Soldiers {
  /**
   * recs: forces.js's records (forces and fronts, each { p, pts, cum, total,
   * side, line, event }); each is given o and n, its figures' first index and
   * count. shared: the app's uniforms.
   */
  constructor(app, recs, shared) {
    this.app = app
    this.recs = recs
    this.sheet = buildSheet()
    const rand = mulberry32(1795)

    // --- plan every rec's people ------------------------------------------------------
    const specs = recs.map(() => [])
    this.fronts = []
    this.pairs = []
    this.guns = []
    for (const r of recs) {
      r.behaviour = behaviourOf(r)
      r.arms = r.p.arms && typeof r.p.arms === 'object' ? r.p.arms : null
      r.enemy = this.enemyOf(r, recs)
    }
    // fronts that meet: two lines of opposing sides in one event, shown together, near each other
    const lines = recs.filter((r) => r.line)
    const paired = new Set()
    for (const a of lines) {
      for (const b of lines) {
        if (a === b || paired.has(a) || paired.has(b) || a.event !== b.event || a.side === b.side) continue
        if (JSON.stringify(a.p.stop ?? a.step) !== JSON.stringify(b.p.stop ?? b.step)) continue
        const [ax, az] = this.mid(a)
        const [bx, bz] = this.mid(b)
        if (Math.hypot(ax - bx, az - bz) > 4) continue
        // (the attacker first: the side that is not Oʻahu's)
        const [A, B] = a.side === 'oahu' ? [b, a] : [a, b]
        paired.add(A)
        paired.add(B)
        this.planFront(A, B, specs, recs, rand)
      }
    }
    // a pursuit: a run that follows a run of the other side over the same ground, at the same stop
    for (const r of recs) {
      if (r.line || r.behaviour !== 'run') continue
      const d = this.heading(r)
      let best = null
      let bd = 5
      for (const q of recs) {
        if (q === r || q.line || q.behaviour !== 'run' || q.event !== r.event || q.side === r.side || !sameStop(q, r) || q.chase) continue
        const e = this.heading(q)
        if (d[0] * e[0] + d[1] * e[1] < 0.9) continue
        const gap = Math.hypot(r.pts[0][0] - q.pts[0][0], r.pts[0][1] - q.pts[0][1])
        // (the one chased starts ahead, up its way)
        if ((q.pts[0][0] - r.pts[0][0]) * d[0] + (q.pts[0][1] - r.pts[0][1]) * d[1] < 0) continue
        if (gap < bd) {
          bd = gap
          best = q
        }
      }
      if (best && r.side !== 'oahu') r.chase = best
    }
    // the chased first, so their knots are there to follow
    const order = recs.map((r, i) => i).sort((a, b) => (recs[a].chase ? 1 : 0) - (recs[b].chase ? 1 : 0))
    for (const i of order) {
      const r = recs[i]
      if (r.line && !paired.has(r)) this.planRanks(r, null, specs[i], rand)
      else if (!r.line) this.planForce(r, specs[i], rand, recs)
    }
    // what each carries, and who is a chief
    recs.forEach((r, i) => this.armOut(r, specs[i], rand))

    // --- lay them out, rec by rec ------------------------------------------------------
    const N = specs.reduce((s, l) => s + l.length, 0)
    this.count = N
    const n1 = Math.max(1, N)
    const F32 = () => new Float32Array(n1)
    const U8 = () => new Uint8Array(n1)
    const I8 = () => new Int8Array(n1)
    this.f = {
      rec: new Uint16Array(n1),
      mode: U8(),
      kind: U8(),
      side: U8(),
      dress: U8(),
      row: F32(),
      cw: F32(),
      s: F32(),
      s0: F32(),
      lat: F32(),
      spd: F32(),
      thr: F32(),
      inAt: F32(),
      outAt: F32(),
      far: F32(),
      ph: F32(),
      tm: F32(),
      tt: F32(),
      st: U8(),
      off: F32(),
      offTo: F32(),
      face: U8(),
      hand: U8(),
      mirror: I8(),
      grp: new Int16Array(n1),
      role: U8(),
      row2: U8(),
      vis: F32(),
      gm: F32(),
      gx: F32(),
      gz: F32(),
      x: F32(),
      z: F32(),
      hx: F32(),
      hz: F32(),
      lift: F32(),
      air: U8(),
      k: F32(),
      tint: F32(),
      wet: U8(),
      fr: U8(),
      dx: I8(),
      dy: I8(),
      dx0: I8(),
      dy0: I8(),
    }
    const f = this.f
    let o = 0
    recs.forEach((r, ri) => {
      r.o = o
      r.n = specs[ri].length
      for (const sp of specs[ri]) {
        const i = o++
        f.rec[i] = ri
        f.mode[i] = MODE[sp.mode]
        f.kind[i] = K[sp.kind]
        f.side[i] = SIDES.indexOf(sp.side)
        f.dress[i] = DRESS.indexOf(sp.dress)
        const at = this.sheet.at(sp.kind, sp.side, sp.dress)
        f.row[i] = at.y
        f.cw[i] = at.w
        f.s[i] = f.s0[i] = sp.s ?? 0
        f.lat[i] = sp.lat ?? 0
        f.spd[i] = sp.spd ?? 1
        f.thr[i] = sp.thr ?? rand()
        f.inAt[i] = sp.inAt ?? -1e9
        f.outAt[i] = sp.outAt ?? 1e9
        f.far[i] = 85 + rand() * 25
        f.ph[i] = sp.ph ?? rand()
        f.tm[i] = sp.tm ?? 1 + rand() * 6
        f.face[i] = FACE.right
        // (about one in eight carries it in the other hand, as the front and the back show)
        f.hand[i] = rand() < 0.12 ? 1 : 0
        f.grp[i] = sp.grp ?? -1
        f.dx0[i] = sp.dx ?? 0
        f.dy0[i] = sp.dy ?? 0
        f.role[i] = sp.role ?? 0
        f.row2[i] = sp.row2 ?? 0
        f.tint[i] = 0.9 + rand() * 0.18
        f.gx[i] = 1e9
      }
    })

    // the tools' view, as forces.js has always kept it: per figure x, z, how much shows, its scale
    this.marks = new Float32Array(n1 * 4)
    // where each leap left the ground: x, z, and the ground's metres there
    this.jump = new Float32Array(n1 * 3)

    // --- the sheet, and the two draws --------------------------------------------------
    const tex = new THREE.DataTexture(this.sheet.data, this.sheet.width, this.sheet.height, THREE.RGBAFormat, THREE.UnsignedByteType)
    tex.minFilter = tex.magFilter = THREE.NearestFilter
    tex.generateMipmaps = false
    tex.needsUpdate = true
    this.texture = tex
    const cap = Math.max(1, Math.min(N, MAX_DRAWN))
    this.cap = cap
    // (two instances a figure while a crossfade draws both sizes)
    const capI = cap * 2
    this.capI = capI
    const g = new THREE.InstancedBufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0]), 3))
    g.setIndex([0, 1, 2, 0, 2, 3])
    const attr = (name) => {
      const a = new THREE.InstancedBufferAttribute(new Float32Array(capI * 4), 4)
      a.setUsage(THREE.DynamicDrawUsage)
      g.setAttribute(name, a)
      return a
    }
    this.aFoot = attr('aFoot')
    this.aCell = attr('aCell')
    this.aDraw = attr('aDraw')
    this.aMix = attr('aMix')
    this.attrs = [this.aFoot, this.aCell, this.aDraw, this.aMix]
    g.instanceCount = 0
    this.geometry = g
    this.range = { start: 0, count: 0 }
    this.own = {
      uSheet: { value: tex },
      uViewport: { value: new THREE.Vector2(1, 1) },
      uPxW: { value: 0.001 },
      uFigS: { value: null },
      uHasS: { value: 0 },
    }
    const uniforms = { ...shared.uniforms, ...this.own }
    // (drawn with the transparent things, after the fronts' bands and the streams laid on the ground,
    // which write no depth and are pulled toward the eye, so they never wash over a figure's feet;
    // but cut out, not blended, and writing depth as anything solid does)
    this.material = new THREE.ShaderMaterial({ vertexShader: spriteVertex, fragmentShader: spriteFragment, uniforms, transparent: true, blending: THREE.NoBlending, depthWrite: true })
    this.shadowMaterial = new THREE.ShaderMaterial({
      vertexShader: shadowVertex,
      fragmentShader: shadowFragment,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.MultiplyBlending,
    })
    this.mesh = new THREE.Mesh(g, this.material)
    this.mesh.frustumCulled = false
    this.mesh.renderOrder = 8
    this.shadows = new THREE.Mesh(g, this.shadowMaterial)
    this.shadows.frustumCulled = false
    this.shadows.renderOrder = 7
    this.group = new THREE.Group()
    this.group.add(this.shadows, this.mesh)

    this.time = 0
    this.frame = 0
    this.thin = 1
    this.drawn = 0
    this.instances = 0
    this.scale = new Scale()
    this.unit = 0.03
    this.view = { rx: 1, rz: 0, ax: 0, az: -1, sinP: 0.5 }
    this._p = [0, 0, 0, 0]
    this._v4 = new THREE.Vector4()
    this._size = new THREE.Vector2()
  }

  /** Where a rec's enemy is: the middle of the other sides' recs shown at its stop (else in its event; null for none). */
  enemyOf(r, recs) {
    for (const strict of [true, false]) {
      let x = 0
      let z = 0
      let n = 0
      for (const q of recs) {
        if (q.event !== r.event || q.side === r.side || (strict && !sameStop(q, r))) continue
        for (const [px, pz] of q.pts) {
          x += px
          z += pz
          n++
        }
      }
      if (n) return [x / n, z / n]
    }
    return null
  }

  mid(r) {
    return along(r, r.total / 2, [0, 0, 0, 0])
  }

  /** A rec's way from its start to its end, as a unit vector. */
  heading(r) {
    const a = r.pts[0]
    const b = r.pts.at(-1)
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
    return [(b[0] - a[0]) / l, (b[1] - a[1]) / l]
  }

  /** The cannon a rec carries: its `arms` count, or, for older data, Kamehameha's guns on his fronts. */
  cannonOf(r) {
    if (r.arms) return Math.max(0, Math.round(r.arms.cannon || 0))
    const year = Number.isFinite(r.p.from) ? r.p.from : 1795
    return r.line && r.side === 'hawaii' && year >= 1790 ? Math.max(1, Math.min(3, Math.round(r.total / 2.5))) : 0
  }

  /** The shares of what a rec's people carry: its `arms`, or, for older data, spears, clubs and a few muskets. */
  sharesOf(r) {
    if (r.arms) return r.arms
    const year = Number.isFinite(r.p.from) ? r.p.from : 1795
    const musket = year < 1790 ? 0 : r.side === 'hawaii' ? 0.14 : 0.06
    return { spear: 0.7 - musket, club: 0.3, musket }
  }

  /** A force along its line, as its behaviour says. */
  planForce(r, out, rand, recs) {
    const L = r.total
    if (L < 0.05) return
    // (the old path down the pali is a single file)
    r.file = /path/i.test(r.p.name || '') && r.total < 12
    const b = r.behaviour
    if (b === 'stand' || b === 'engage') this.planStand(r, out, rand)
    else if (b === 'surround') this.planSurround(r, out, rand, recs)
    else if (b === 'leap') this.planLeap(r, out, rand, recs)
    else this.planFiles(r, out, rand)
  }

  /** Files and knots walking (or running) the line, each dissolving in over its first stretch and out somewhere over its last. */
  planFiles(r, out, rand, { n: want = 0, from = 0, to = r.total, at = 1 } = {}) {
    const L = Math.max(0.05, to - from)
    const run = r.behaviour === 'run' || r.behaviour === 'surround'
    const file = r.file
    const dens = file ? 2.5 : run ? 4 : 5
    const n = want || Math.max(12, Math.min(300, Math.round(L * dens)))
    const lanes = file ? 1 : 3
    const half = file ? 0.03 : r.side === 'hawaii' ? 0.32 : 0.26
    // knots, each at a fraction of the way and its own pace; a pursuit's knots follow the chased's
    let knots
    if (r.chase?.knots) {
      const ratio = L / Math.max(0.05, r.chase.total)
      knots = r.chase.knots.map((c) => ({ u: c.u, sp: c.sp * ratio }))
    } else knots = Array.from({ length: Math.max(3, Math.min(9, Math.round(n / 14))) }, () => ({ u: rand(), sp: run ? 0.85 + rand() * 0.3 : 0.88 + rand() * 0.24 }))
    r.knots = knots
    const edge = Math.min(L * 0.15, 4)
    // (cannon hauled with a march: a piece and its crew in the place of a knot's people)
    const guns = r.behaviour === 'march' ? this.cannonOf(r) : 0
    for (let q = 0; q < guns; q++) {
      const c = knots[q % knots.length]
      const gi = this.guns.push({ r, kind: 'haul', front: -1, s: from + ((c.u + 0.03) % 1) * L, spd: c.sp, lat: 0, inAt: from + rand() * edge * 0.6, outAt: to - edge * 0.2 - rand() * edge, x: 0, z: 0, ax: 1, az: 0, period: 8, phase: 0, on: false }) - 1
      this.crewOut(out, r, gi, rand() * 0.3)
    }
    for (let i = 0; i < n; i++) {
      const c = knots[i % knots.length]
      let u = (c.u + (rand() - 0.5) * (rand() < 0.75 ? 0.05 : 0.22)) % 1
      if (u < 0) u += 1
      const lane = Math.floor(rand() * lanes)
      out.push({
        mode: 'file',
        s: from + u * L,
        lat: lanes > 1 ? ((lane - (lanes - 1) / 2) * 0.7 + (rand() - 0.5) * 0.5) * half : (rand() - 0.5) * half,
        spd: c.sp * (0.97 + rand() * 0.06),
        inAt: from + rand() * edge * 0.6,
        outAt: to - (to < r.total ? 0 : edge * 0.2) - rand() * edge * at,
      })
    }
  }

  /** A force that holds its ground: knots along its line, a few pacing between them; its pieces parked. */
  planStand(r, out, rand) {
    const L = r.total
    const short = L < 2
    const knots = Math.max(3, Math.min(12, Math.round(L / 2.4)))
    // (fighting where it stands when its enemy is close: the last stand at the pali)
    if (r.enemy) {
      const m = this.mid(r)
      r.pressed = Math.hypot(r.enemy[0] - m[0], r.enemy[1] - m[1]) < 6
    }
    for (let q = 0; q < knots; q++) {
      const s = Math.max(0, Math.min(L, ((q + 0.5) / knots) * L + (rand() - 0.5) * (L / knots) * 0.4))
      // (a knot's people stand round one foot, set apart across the screen by whole sprite pixels and a
      // little in depth, so it is a knot at every zoom, not a heap when far out)
      const m = short ? 4 + Math.floor(rand() * 3) : 6 + Math.floor(rand() * 9)
      const gap = short ? 4 : 5
      for (let i = 0; i < m; i++) {
        const dx = Math.round((i - (m - 1) / 2) * gap + (rand() - 0.5) * 3)
        out.push({ mode: 'knot', s, lat: (rand() - 0.5) * 0.12, dx, dy: Math.round((rand() - 0.5) * 3), tm: 1 + rand() * 6 })
      }
      if (!short || q === 1) for (let i = 0; i < 2; i++) out.push({ mode: 'pacer', s: s + (rand() - 0.5) * 0.8, lat: (rand() - 0.5) * 0.4, spd: 0.4 + rand() * 0.3, noChief: true })
    }
    const guns = this.cannonOf(r)
    const t = [0, 0, 0, 0]
    for (let q = 0; q < guns; q++) {
      along(r, ((q + 0.7) / (guns + 0.4)) * L, t)
      const gi = this.guns.push({ r, kind: 'park', front: -1, s: 0, spd: 0, lat: 0, inAt: 0, outAt: 0, x: t[0] - t[3] * 0.08, z: t[1] + t[2] * 0.08, ax: t[2], az: t[3], period: 8, phase: rand(), on: true }) - 1
      if (r.enemy) {
        const ex = r.enemy[0] - t[0]
        const ez = r.enemy[1] - t[1]
        const l = Math.hypot(ex, ez) || 1
        this.guns[gi].ax = ex / l
        this.guns[gi].az = ez / l
      }
      this.crewOut(out, r, gi, rand() * 0.3)
    }
  }

  /** The surround: files coming up the line at a run, and at its end an arc round the stand there, facing in. */
  planSurround(r, out, rand, recs) {
    const L = r.total
    const n = Math.max(24, Math.min(64, Math.round(L * 12)))
    const end = r.pts.at(-1)
    const t = [0, 0, 0, 0]
    along(r, L, t)
    // the stand it closes on: the other side's force or front holding its ground at its stop, nearest its end
    let stand = null
    let bd = 3
    for (const q of recs) {
      if (q === r || q.event !== r.event || q.side === r.side || !sameStop(q, r) || !(q.line || q.behaviour === 'stand' || q.behaviour === 'engage')) continue
      for (let s = 0; s <= q.total; s += Math.max(0.02, q.total / 40)) {
        const p = along(q, s, [0, 0, 0, 0])
        const d = Math.hypot(p[0] - end[0], p[1] - end[1])
        if (d < bd) {
          bd = d
          stand = q
        }
      }
    }
    // along the stand, and toward the valley (the way the line comes from)
    let ux = -t[3]
    let uz = t[2]
    let half = 0.4
    let [cx, cz] = end
    if (stand) {
      const h = this.heading(stand)
      ux = h[0]
      uz = h[1]
      half = Math.max(0.2, stand.total / 2)
      ;[cx, cz] = this.mid(stand)
    }
    // (the valley side is the way the line comes up: down it, on the floor, not square to the stand,
    // which at a notch is the flank of the ridge)
    const vx = -t[2]
    const vz = -t[3]
    // (and square to the stand on that side, for the tools: the valley side of the brink)
    const s = -uz * vx + ux * vz < 0 ? -1 : 1
    r.ring = { cx, cz, ux, uz, vx, vz, nx: -uz * s, nz: ux * s, half }
    // the arc: two rows on the valley side, open to the edge (as many as stand apart on it)
    const m = Math.min(28, Math.round(n * 0.45))
    for (let i = 0; i < m; i++) {
      const row = i % 2
      const phi = ((((i >> 1) + 0.5 + (rand() - 0.5) * 0.5) / Math.ceil(m / 2)) * 2 - 1) * ((72 * Math.PI) / 180)
      out.push({ mode: 'ring', s: phi, row2: row, close: true, tm: 0.5 + rand() * 3, ph: rand() })
    }
    // the rest coming up from below, at a run, gone into the arc as they reach it
    this.planFiles(r, out, rand, { n: n - m, to: Math.max(0.1, L - Math.min(1.2, L * 0.25)), at: 2 })
  }

  /** The leap: one after another running from the line's start to the brink at its end, and over. */
  planLeap(r, out, rand, recs) {
    const n = Math.max(5, Math.min(10, Math.round(r.total * 10)))
    // the stand of its own side it leaves from, if any: the run is drawn clear of its knots
    let bd = 3
    for (const q of recs) {
      if (q === r || q.line || q.event !== r.event || q.side !== r.side || q.behaviour !== 'stand' || !sameStop(q, r)) continue
      for (let s = 0; s <= q.total; s += Math.max(0.02, q.total / 40)) {
        const p = along(q, s, [0, 0, 0, 0])
        const d = Math.hypot(p[0] - r.pts[0][0], p[1] - r.pts[0][1])
        if (d < bd) {
          bd = d
          const m = this.mid(q)
          const h = this.heading(q)
          r.flank = { cx: m[0], cz: m[1], half: q.total / 2, ux: h[0], uz: h[1] }
        }
      }
    }
    for (let i = 0; i < n; i++) out.push({ mode: 'leap', s: 0, lat: (rand() - 0.5) * 0.06, dx: Math.round((rand() - 0.5) * 8), tm: 0.3 + i * LEAP.gap * (0.8 + rand() * 0.4) })
  }

  /** A front's ranks: behind its line (away from `foe`, a point), or round it when it stands alone. */
  planRanks(r, foe, out, rand, gaps = []) {
    const L = r.total
    if (L < 0.3) return
    // which way is behind: the side of the line away from its foe
    const m = this.mid(r)
    let back = 0
    if (foe) back = (foe[0] - m[0]) * -m[3] + (foe[1] - m[1]) * m[2] > 0 ? -1 : 1
    r.back = back
    const n = Math.max(24, Math.min(120, Math.round(L * 11)))
    for (let i = 0; i < n; i++) {
      const s = (0.04 + 0.92 * ((i + rand() * 0.9) / n)) * L
      // (a lane is kept clear behind each field piece, so it is seen)
      if (gaps.some((g) => Math.abs(s - g) < 0.32)) continue
      const depth = back ? back * (0.15 + Math.pow(rand(), 1.2) * 1.2) : (rand() + rand() - 1) * 0.5
      out.push({ mode: 'rank', s, lat: depth, tm: 1 + rand() * 8 })
    }
    // (a front alone with guns parks them on its line)
    if (!foe) {
      const guns = this.cannonOf(r)
      const t = [0, 0, 0, 0]
      for (let q = 0; q < guns; q++) {
        along(r, ((q + 1) / (guns + 1)) * L, t)
        const ex = (r.enemy?.[0] ?? t[0] + 1) - t[0]
        const ez = (r.enemy?.[1] ?? t[1]) - t[1]
        const l = Math.hypot(ex, ez) || 1
        const gi = this.guns.push({ r, kind: 'park', front: -1, s: 0, spd: 0, lat: 0, inAt: 0, outAt: 0, x: t[0], z: t[1], ax: ex / l, az: ez / l, period: 8, phase: rand(), on: true }) - 1
        this.crewOut(out, r, gi, rand() * 0.3)
      }
    }
  }

  /** A piece and its crew of two (the piece first, so the crew stand where it stands that frame). */
  crewOut(out, r, gi, thr) {
    out.push({ mode: 'piece', kind: 'gun', side: 'hawaii', dress: 'bare', grp: gi, role: 0, thr, crew: true })
    out.push({ mode: 'crew', kind: 'linstock', side: 'hawaii', dress: 'kihei', grp: gi, role: 1, thr, crew: true })
    out.push({ mode: 'crew', kind: 'rammer', side: 'hawaii', dress: 'bare', grp: gi, role: 2, thr, crew: true })
  }

  /** Two fronts that meet: ranks behind each, pairs fighting between, and each one's field pieces. */
  planFront(A, B, specs, recs, rand) {
    const ia = recs.indexOf(A)
    const ib = recs.indexOf(B)
    const gunsOf = (R) => {
      const ng = this.cannonOf(R)
      return Array.from({ length: ng }, (_, q) => ((q + 1) / (ng + 1)) * R.total)
    }
    const gunA = gunsOf(A)
    const gunB = gunsOf(B)
    this.planRanks(A, this.mid(B), specs[ia], rand, gunA)
    this.planRanks(B, this.mid(A), specs[ib], rand, gunB)
    // the line between them, and the way from A's to B's
    const M = 24
    const pa = []
    const pb = []
    const t = [0, 0, 0, 0]
    for (let i = 0; i <= M; i++) {
      along(A, (i / M) * A.total, t)
      pa.push([t[0], t[1]])
      along(B, (i / M) * B.total, t)
      pb.push([t[0], t[1]])
    }
    // (B's line may run the other way)
    if (Math.hypot(pa[0][0] - pb[0][0], pa[0][1] - pb[0][1]) > Math.hypot(pa[0][0] - pb[M][0], pa[0][1] - pb[M][1])) pb.reverse()
    const mid = pa.map((p, i) => [(p[0] + pb[i][0]) / 2, (p[1] + pb[i][1]) / 2])
    let nx = 0
    let nz = 0
    for (let i = 0; i <= M; i++) {
      nx += pb[i][0] - pa[i][0]
      nz += pb[i][1] - pa[i][1]
    }
    const nl = Math.hypot(nx, nz) || 1
    const front = { a: A, b: B, nx: nx / nl, nz: nz / nl, ia, ib }
    const fi = this.fronts.push(front) - 1
    A.front = fi
    B.front = fi
    const cum = [0]
    for (let i = 1; i <= M; i++) cum.push(cum[i - 1] + Math.hypot(mid[i][0] - mid[i - 1][0], mid[i][1] - mid[i - 1][1]))
    const midRec = { pts: mid, cum, total: cum[M] }
    // the pairs, along the line between
    const np = Math.max(4, Math.min(16, Math.round(midRec.total * 2)))
    for (let q = 0; q < np; q++) {
      along(midRec, (0.08 + 0.84 * ((q + 0.2 + rand() * 0.6) / np)) * midRec.total, t)
      const wob = (rand() - 0.5) * 0.4
      const pi =
        this.pairs.push({
          x: t[0] + front.nx * wob,
          z: t[1] + front.nz * wob,
          front: fi,
          period: 1.5 + rand() * 0.8,
          phase: rand(),
          sway: rand() * Math.PI * 2,
          swayT: 3 + rand() * 3,
        }) - 1
      const thr = rand() * 0.9
      specs[ia].push({ mode: 'duel', grp: pi, role: 0, close: true, thr })
      specs[ib].push({ mode: 'duel', grp: pi, role: 1, close: true, thr })
    }
    // the guns, each with its crew round it, aimed across at the other line
    for (const [R, gs, sign] of [[A, gunA, 1], [B, gunB, -1]]) {
      for (const s of gs) {
        along(R, s, t)
        const back = R.back || -1
        const gi =
          this.guns.push({
            r: R,
            kind: 'front',
            front: fi,
            x: t[0] - t[3] * back * 0.05,
            z: t[1] + t[2] * back * 0.05,
            ax: front.nx * sign,
            az: front.nz * sign,
            period: 7 + rand() * 2.5,
            phase: rand(),
            on: true,
          }) - 1
        this.crewOut(specs[recs.indexOf(R)], R, gi, rand() * 0.5)
      }
    }
  }

  /**
   * What each of a rec's people carries, from its `arms` by largest remainder (the crews of the
   * pieces apart), the close fighters taking the spears, clubs and daggers first; and its chiefs.
   */
  armOut(r, list, rand) {
    const side = SIDES.includes(r.side) ? r.side : 'oahu'
    const people = list.filter((sp) => !sp.crew)
    for (const sp of list) if (sp.crew) sp.side = 'hawaii'
    const counts = apportion(this.sharesOf(r), ARMS, people.length)
    r.counts = counts
    const bag = []
    for (const k of ARMS) for (let i = 0; i < counts[k]; i++) bag.push(k)
    // (shuffled by lot)
    for (let i = bag.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1))
      ;[bag[i], bag[j]] = [bag[j], bag[i]]
    }
    const take = (want) => {
      const i = bag.findIndex((k) => want.includes(k))
      return bag.splice(i >= 0 ? i : 0, 1)[0] || 'spear'
    }
    for (const sp of people) if (sp.close) sp.kind = take(CLOSE)
    for (const sp of people) if (!sp.close) sp.kind = take(ARMS)
    for (const sp of people) {
      sp.side = side
      sp.dress = rand() < 0.55 ? 'kihei' : 'bare'
    }
    // a few chiefs in cloaks: one in thirty or so, at least one where there are a dozen, and at the
    // fronts one among the pairs
    const able = people.filter((sp) => (sp.kind === 'spear' || sp.kind === 'club') && !sp.noChief)
    let chiefs = people.length >= 12 ? Math.max(1, Math.round(people.length / 32)) : 0
    const duelist = able.find((sp) => sp.mode === 'duel')
    if (duelist && chiefs) {
      duelist.dress = 'chief'
      chiefs--
    }
    for (let q = 0; q < chiefs && able.length; q++) able[Math.floor(rand() * able.length)].dress = 'chief'
  }

  /**
   * Every frame: dt seconds on; show the district's weight times the near
   * zoom's; quiet off the tour. Each rec's own weight is its w (forces.js).
   */
  update(dt, show, quiet) {
    const app = this.app
    const cam = app.camera
    const f = this.f
    const recs = this.recs
    // (the tools can hold everyone still, so a screenshot and this state agree)
    if (this.hold) dt = 0
    this.time += dt
    this.frame++
    const T = this.time
    cam.updateMatrixWorld()
    const e = cam.matrixWorld.elements
    // the camera's terms on the ground: across the screen, and away from the eye; and how much a step
    // away from the eye climbs the screen
    const V = this.view
    let l = Math.hypot(e[0], e[2]) || 1
    V.rx = e[0] / l
    V.rz = e[2] / l
    l = Math.hypot(e[8], e[10]) || 1
    V.ax = -e[8] / l
    V.az = -e[10] / l
    V.sinP = Math.max(0.05, Math.min(1, e[9]))
    const fx = -e[8]
    const fy = -e[9]
    const fz = -e[10]
    const cx = cam.position.x
    const cy = cam.position.y
    const cz = cam.position.z
    // the target drawn into, and the pixel's size in the world
    const size = app.pipeline?.size || app.renderer.getDrawingBufferSize(this._size)
    const dpr = size.y / Math.max(1, innerHeight)
    this.dpr = dpr
    const tanH = Math.tan((cam.fov * Math.PI) / 360)
    this.own.uViewport.value.set(size.x, size.y)
    this.own.uPxW.value = (2 * tanH) / Math.max(1, size.y)
    const shadow = app.districts?.on ? app.districts.cur?.terrain?.shadow?.texture : null
    this.own.uFigS.value = shadow || null
    this.own.uHasS.value = shadow ? 1 : 0
    const vert = app.world.uniforms.uVert.value
    // (while the ground itself is changing, the district easing in or out over its island, the
    // island's own detail, the year, everyone's ground is looked up again, not only the movers')
    const D = app.districts
    const g0 = D?.on ? 1 + D.k : 0
    const g1 = D?.cur?.parent?.k ?? 0
    const g2 = app.timeline?.year ?? 0
    const stale = g0 !== this._g0 || g1 !== this._g1 || g2 !== this._g2
    this._g0 = g0
    this._g1 = g1
    this._g2 = g2
    // the one scale, from the camera's distance; and world units to the sprite pixel at its target
    const d0 = app.rig?.state?.distance ?? 16
    // (held by the tools, the scale holds too, half through a crossfade if it is)
    const sc = this.hold ? this.scale : this.scale.step(wantScale(d0, dpr), dt, 2, Math.max(2, Math.round(4 * dpr)))
    const unit = ((sc.L / dpr) * d0 * 2 * tanH) / Math.max(1, innerHeight)
    this.unit = unit
    const pace = quiet ? 0.5 : 1
    const vWalk = GAIT_WALK * unit * pace
    const vRun = GAIT_RUN * unit * pace
    const fade = dt > 0 ? dt / FADE_S : 1
    // (a force's people thin out as the view widens, where each stands taller on the ground)
    const crowd = Math.min(1, Math.max(0.35, Math.pow(24 / Math.max(1, d0), 0.8)))
    // the guns: where each stands this frame (a hauled one moves with its force)
    for (const gn of this.guns) {
      if (gn.kind !== 'haul') continue
      const w = gn.r.w * show
      if (w <= 0.002) continue
      const L = gn.r.total
      let s = gn.s + vWalk * gn.spd * dt
      if (s > L) s %= L
      gn.s = s
      const p = along(gn.r, s, this._p)
      gn.x = p[0]
      gn.z = p[1]
      gn.ax = p[2]
      gn.az = p[3]
      gn.on = s >= gn.inAt && s <= gn.outAt
    }
    const p = this._p
    const M = this.marks
    const foot = this.aFoot.array
    const cell = this.aCell.array
    const draw = this.aDraw.array
    const mix = this.aMix.array
    let j = 0
    let figures = 0
    let wanted = 0
    const cap = this.cap
    const kA = sc.k
    const tB = sc.t
    // (each copy is drawn only when some level of the dither falls in its part)
    const drawA = tB <= 15.5 / 16
    const drawB = tB > 0.5 / 16
    for (let ri = 0; ri < recs.length; ri++) {
      const r = recs[ri]
      const w = r.w * show
      if (w <= 0.002 && !r.drawnLast) {
        // (nothing of it showing, now or last frame: leave its people where they are)
        continue
      }
      // (back after a while: its people's ground is looked up afresh)
      const fresh = stale || !r.drawnLast
      r.drawnLast = w > 0.002
      const fr = r.front !== undefined ? this.fronts[r.front] : null
      const isA = fr ? fr.a === r : false
      const wr = w * this.thin * (r.line ? 1 : crowd)
      const fighting = !quiet && (!!fr || r.pressed)
      for (let i = r.o; i < r.o + r.n; i++) {
        const mode = f.mode[i]
        let anim = A_IDLE
        let fi = 0
        let dx = 0
        let dy = 0
        let nudge = 0
        let on = wr > f.thr[i]
        let x = 0
        let z = 0
        // the heading: the way it moves or aims, on the ground
        let hx = f.hx[i]
        let hz = f.hz[i]
        let air = false
        let lift = 0
        let mirror = 0
        // (a facing set outright, not from the heading: the piece's crew)
        let face = -1
        // (how far ahead a walker looks for water)
        let reach = 0
        if (mode === MODE.file) {
          const v = (r.behaviour === 'run' || r.behaviour === 'surround' ? vRun : vWalk) * f.spd[i]
          reach = v * FADE_S * 1.3
          let s = f.s[i] + v * dt
          if (s > r.total) s %= r.total
          f.s[i] = s
          along(r, s, p)
          x = p[0] - p[3] * f.lat[i]
          z = p[1] + p[2] * f.lat[i]
          hx = p[2]
          hz = p[3]
          const running = r.behaviour !== 'march' && r.behaviour !== 'stand'
          const rate = (running ? 1.7 : 1.15) * f.spd[i] * pace
          f.ph[i] = (f.ph[i] + rate * dt) % 1
          anim = running ? A_RUN : A_WALK
          fi = Math.floor(f.ph[i] * 4) % 4
          if (s < f.inAt[i] || s > f.outAt[i]) on = false
          // (a figure that has stepped into water is drawn back toward its line)
          if (f.wet[i]) f.lat[i] *= 1 - Math.min(1, dt * 0.5)
        } else if (mode === MODE.knot || mode === MODE.pacer) {
          let s = f.s0[i]
          if (mode === MODE.pacer) {
            // to and fro over a stretch of the line
            const A = 0.7
            f.tt[i] += vWalk * 0.6 * f.spd[i] * dt
            const u = f.tt[i] / (2 * A) + f.ph[i]
            const tri = 2 * Math.abs(u - Math.floor(u + 0.5))
            s = Math.max(0, Math.min(r.total, f.s0[i] + (tri - 0.5) * 2 * A))
            const dir = u - Math.floor(u) < 0.5 ? 1 : -1
            along(r, s, p)
            hx = p[2] * dir
            hz = p[3] * dir
            anim = A_WALK
            fi = Math.floor(((T * 1.1 * pace + f.ph[i]) % 1) * 4)
          } else {
            along(r, s, p)
            if (r.enemy) {
              hx = r.enemy[0] - p[0]
              hz = r.enemy[1] - p[1]
            } else {
              hx = -p[3]
              hz = p[2]
            }
            dx = f.dx0[i]
            dy = f.dy0[i]
            ;[anim, fi] = this.act(i, dt, T, quiet, fighting, false)
          }
          x = p[0] - p[3] * f.lat[i]
          z = p[1] + p[2] * f.lat[i]
        } else if (mode === MODE.rank) {
          along(r, f.s0[i], p)
          const was = f.st[i]
          ;[anim, fi] = this.act(i, dt, T, quiet, fighting, true)
          if (f.st[i] === 1 && was === 1) {
            // shuffling a little along the line
            const step = vWalk * 0.5 * dt
            const d = f.offTo[i] - f.off[i]
            if (Math.abs(d) <= step) {
              f.off[i] = f.offTo[i]
              f.st[i] = 0
            } else f.off[i] += Math.sign(d) * step
            hx = p[2] * Math.sign(d)
            hz = p[3] * Math.sign(d)
          } else if (fr) {
            // at a front, across the line at the other side
            hx = isA ? fr.nx : -fr.nx
            hz = isA ? fr.nz : -fr.nz
          } else if (r.enemy) {
            hx = r.enemy[0] - p[0]
            hz = r.enemy[1] - p[1]
          }
          x = p[0] - p[3] * f.lat[i] + p[2] * f.off[i]
          z = p[1] + p[2] * f.lat[i] + p[3] * f.off[i]
        } else if (mode === MODE.duel) {
          const pr = this.pairs[f.grp[i]]
          const fr2 = this.fronts[pr.front]
          const a = f.role[i] === 0
          // the pair's ground, rocking slowly toward one side and the other
          const rock = 0.1 * Math.sin((T * 2 * Math.PI) / pr.swayT + pr.sway)
          x = pr.x + fr2.nx * rock
          z = pr.z + fr2.nz * rock
          // each faces the other, across the line
          hx = a ? fr2.nx : -fr2.nx
          hz = a ? fr2.nz : -fr2.nz
          // toe to toe along the way between them as the screen shows it: across it when the camera looks
          // across the line, one above the other (and a little aside) when it looks along it
          const sa = fr2.nx * V.rx + fr2.nz * V.rz
          const sb = (fr2.nx * V.ax + fr2.nz * V.az) * V.sinP
          const sl = Math.hypot(sa, sb) || 1
          const ux = sa / sl
          const uy = sb / sl
          // striking in turn: the first half of the bout A's, the second B's; the one struck at gives a pixel
          const u = (T / pr.period + pr.phase) % 1
          const mine = a ? u < 0.5 : u >= 0.5
          const v = (u % 0.5) / 0.5
          const push = 1.6 * Math.sin((T * 2 * Math.PI) / (pr.swayT * 1.7) + pr.sway)
          let gap = (a ? -4 : 4) + push
          anim = A_ENGAGE
          if (quiet) {
            // (off the tour the pairs are not drawn: standing, as they go)
            on = false
            anim = A_IDLE
            fi = 0
          } else if (mine) fi = v < 0.3 ? 0 : v < 0.55 ? 1 : 2
          else {
            // on guard, giving a pixel as the blow comes in
            fi = 2
            if (v >= 0.3 && v < 0.7) gap += a ? -1 : 1
          }
          dx = Math.round(gap * ux + (a ? -1.5 : 1.5) * uy * uy)
          dy = Math.round(gap * uy * 0.8)
          // (the nearer of the two in front)
          nudge = 0.01 + (a ? 1 : -1) * Math.sign(sb) * 0.01
        } else if (mode === MODE.piece || mode === MODE.crew) {
          // the field piece and its crew: rammed, the match put to it, fired, smoking; hauled; parked
          const gn = this.guns[f.grp[i]]
          x = gn.x
          z = gn.z
          if (gn.kind === 'haul' && !gn.on) on = false
          const role = f.role[i]
          hx = gn.ax
          hz = gn.az
          // the piece faces as its aim (or its way) is seen; the crew stand by it as the piece is seen
          if (role === 0) gn.face = this.faceOf(gn.ax, gn.az, gn.face ?? FACE.right)
          const pf = gn.face ?? FACE.right
          face = pf
          const moving = gn.kind === 'haul'
          const t = quiet || gn.kind !== 'front' ? 99 : ((T / gn.period + gn.phase) % 1) * gn.period
          // (each of the three: the engage frame it shows at t into the round, or -1 to stand)
          let en = -1
          if (role === 0) {
            en = t >= 3.5 && t < 3.65 ? 0 : t >= 3.65 && t < 4.4 ? 1 : t >= 4.4 && t < 5.2 ? 2 : -1
            // (in front of its crew; from the front, its flash over them)
            nudge = pf === FACE.front ? 0.03 : 0.01
          } else if (pf <= FACE.left) {
            // seen from the side: the linstock behind the breech, the rammer at the muzzle, turned to it
            const g = pf === FACE.right ? 1 : -1
            if (role === 1) dx = -11 * g
            else {
              dx = 11 * g
              nudge = 0.02
              if (!moving) face = pf === FACE.right ? FACE.left : FACE.right
            }
          } else {
            // from the front or from behind: one each side of it, a little beyond the wheels, each with
            // the tool toward the piece (drawn in the left hand from the front, the right from behind)
            dx = role === 1 ? -9 : 9
            dy = pf === FACE.back ? 2 : 3
            mirror = (pf === FACE.back) === (role === 1) ? 1 : -1
          }
          if (role === 1) en = t >= 2.6 && t < 3.2 ? 0 : t >= 3.2 && t < 3.6 ? 1 : t >= 3.6 && t < 4.3 ? 2 : -1
          else if (role === 2) en = t < 0.9 ? Math.min(2, Math.floor(t / 0.3)) : -1
          if (moving) {
            anim = A_WALK
            fi = Math.floor(((T * 1.15 * pace + 0.25 * role) % 1) * 4)
          } else if (en >= 0) {
            anim = A_ENGAGE
            fi = en
          } else {
            anim = A_IDLE
            fi = role === 0 ? 0 : Math.floor(T * (0.6 + 0.1 * role) + f.ph[i]) & 1
          }
        } else if (mode === MODE.ring) {
          // the arc round the stand, pressing in and striking, stepping back: a half ellipse on the
          // ground, along the stand (the brink) and out toward the valley, never past the edge; its
          // two axes as long on the ground as they need to be to look so many sprite pixels on the
          // screen, so it takes in the stand's knots and reads as an arc at every zoom
          const R = r.ring
          const press = quiet ? 0 : 4 * Math.max(0, Math.sin((T / (2.4 + f.ph[i])) * 2 * Math.PI + f.ph[i] * 6.28))
          const lu = Math.max(0.3, Math.hypot(R.ux * V.rx + R.uz * V.rz, (R.ux * V.ax + R.uz * V.az) * V.sinP))
          const lv = Math.max(0.3, Math.hypot(R.vx * V.rx + R.vz * V.rz, (R.vx * V.ax + R.vz * V.az) * V.sinP))
          const row = f.row2[i]
          const au = ((Math.max((R.half * lu) / unit + 16, 24) + 6 * row - press * 0.5) * unit) / lu
          const av = ((28 + 9 * row - press) * unit) / lv
          const sp = Math.sin(f.s0[i])
          const cp = Math.cos(f.s0[i])
          x = R.cx + R.ux * au * sp + R.vx * av * cp
          z = R.cz + R.uz * au * sp + R.vz * av * cp
          hx = R.cx - x
          hz = R.cz - z
          if (press > 3) {
            anim = A_ENGAGE
            fi = press > 3.7 ? 1 : 0
          } else if (press > 0.3) {
            anim = A_WALK
            fi = Math.floor(((T * 1.3 + f.ph[i]) % 1) * 4)
          } else {
            ;[anim, fi] = this.act(i, dt, T, quiet, false, false)
          }
        } else if (mode === MODE.leap) {
          // one after another: wait, run to the brink, jump, fall out of sight
          if (quiet) {
            on = false
            f.st[i] = 0
          } else {
            const st = f.st[i]
            if (st === 0) {
              f.tm[i] -= dt
              on = false
              if (f.tm[i] <= 0) {
                f.st[i] = 1
                f.s[i] = 0
              }
              along(r, 0, p)
              x = p[0]
              z = p[1]
            }
            if (f.st[i] === 1) {
              const s = f.s[i] + vRun * LEAP.run * dt
              f.s[i] = s
              f.tt[i] += dt
              along(r, Math.min(s, r.total), p)
              const over = Math.max(0, s - r.total)
              x = p[0] + p[2] * over - p[3] * f.lat[i]
              z = p[1] + p[3] * over + p[2] * f.lat[i]
              hx = p[2]
              hz = p[3]
              anim = A_RUN
              fi = Math.floor(((f.tt[i] * 1.9 + f.ph[i]) % 1) * 4)
              // at the brink (the line's end, or where the ground falls away just past it): the jump
              if (s >= r.total) {
                const here = app.world.metresAt(x, z)
                const ahead = app.world.metresAt(x + p[2] * 0.1, z + p[3] * 0.1)
                if (here - ahead > 6 || over > 0.6) {
                  f.st[i] = 2
                  f.tt[i] = 0
                  f.gx[i] = 1e9
                  this.jump[i * 3] = x
                  this.jump[i * 3 + 1] = z
                  this.jump[i * 3 + 2] = here
                }
              }
            }
            if (f.st[i] >= 1) {
              // (seen from afar, the run from the stand to the brink is a few pixels on the screen: it is
              // drawn at least LEAP.least long there, by whole sprite pixels the way it goes, the feet on
              // their own ground, so the run and the fall clear the stand's people)
              const a = r.pts[0]
              const b = r.pts.at(-1)
              const ux = ((b[0] - a[0]) * V.rx + (b[1] - a[1]) * V.rz) / unit
              const uy = (((b[0] - a[0]) * V.ax + (b[1] - a[1]) * V.az) * V.sinP) / unit
              const ul = Math.hypot(ux, uy) || 1
              const gain = Math.max(0, LEAP.least - ul) * (f.st[i] === 1 ? Math.min(1, f.s[i] / r.total) : 1)
              dx = f.dx0[i] + Math.round((ux / ul) * gain)
              dy = Math.round((uy / ul) * gain)
              // (and out past the stand's knots on the screen, on the side it runs toward)
              const F = r.flank
              if (F) {
                const sx = ((a[0] - F.cx) * V.rx + (a[1] - F.cz) * V.rz) / unit
                const reach = (Math.abs(F.ux * V.rx + F.uz * V.rz) * F.half) / unit + 16
                const side = Math.abs(ux) > 0.2 * ul ? Math.sign(ux) : Math.sign(sx) || 1
                dx += side * Math.round(Math.max(0, reach + 4 - side * sx))
              }
            }
            if (f.st[i] === 2) {
              // in the air: on across the brink, up a little and down, tumbling
              f.tt[i] += dt
              const t = f.tt[i]
              along(r, r.total, p)
              x = this.jump[i * 3] + p[2] * LEAP.across * unit * t
              z = this.jump[i * 3 + 1] + p[3] * LEAP.across * unit * t
              hx = p[2]
              hz = p[3]
              const rise = LEAP.up * t - 0.5 * LEAP.pull * t * t
              air = true
              lift = this.jump[i * 3 + 2] + (rise * unit) / vert
              anim = A_FALL
              fi = t < 0.22 ? 0 : 1 + (Math.floor((t - 0.22) / 0.14) & 1)
              // (dissolved once it has dropped far enough; gone at once below the ground)
              if (-rise > LEAP.fade) on = false
              if (t > LEAP.air) {
                // and the next in its turn: one leap every LEAP.gap seconds or so among them all
                f.st[i] = 0
                f.tm[i] = Math.max(0.4, r.n * LEAP.gap * (0.85 + Math.random() * 0.3) - t - r.total / Math.max(1e-6, vRun * LEAP.run))
                f.vis[i] = 0
                on = false
              }
            }
          }
        }
        // the facing: from the heading, as the camera sees it; the side mirrored to face left, the front
        // and the back mirrored for one who carries it in the other hand
        f.hx[i] = hx
        f.hz[i] = hz
        const facing = face >= 0 ? face : this.faceOf(hx, hz, f.face[i])
        f.face[i] = facing
        if (facing <= FACE.left) mirror = facing === FACE.left ? -1 : 1
        else if (!mirror) mirror = mode === MODE.piece || !f.hand[i] ? 1 : -1
        f.mirror[i] = mirror
        f.fr[i] = anim + fi
        f.dx[i] = dx
        f.dy[i] = dy
        f.x[i] = x
        f.z[i] = z
        f.air[i] = air ? 1 : 0
        // the ground under it: looked up again once it has moved a metre, and now and then
        if (fresh || Math.abs(x - f.gx[i]) + Math.abs(z - f.gz[i]) > 0.01 || (this.frame + i) % 30 === 0) {
          f.gm[i] = app.world.metresAt(x, z)
          f.gx[i] = x
          f.gz[i] = z
          f.wet[i] = f.gm[i] < 0.15 ? 1 : 0
          // (one walking a line looks as far ahead as it goes while it dissolves, so it is gone before
          // it wades a stream, and back once across)
          if (reach > 0 && !f.wet[i]) {
            const hl = Math.hypot(hx, hz) || 1
            if (app.world.metresAt(x + (hx / hl) * reach, z + (hz / hl) * reach) < 0.15) f.wet[i] = 2
          }
        }
        if (f.wet[i] && !air) on = false
        // (one in the air: its own height; gone at once when all of it is below the ground there)
        const metres = air ? lift : f.gm[i]
        const under = air && metres + (SPRITE_H * unit) / vert < f.gm[i]
        if (under) on = false
        f.lift[i] = metres
        const gy = Math.max(metres, 0) * vert
        const depth = (x - cx) * fx + (gy - cy) * fy + (z - cz) * fz
        if (depth > f.far[i] || depth < 0.05) on = false
        if (on) wanted++
        let vis = f.vis[i]
        vis = on ? Math.min(1, vis + fade) : Math.max(0, vis - fade)
        if (w <= 0.002 || under) vis = 0
        f.vis[i] = vis
        const k = tB < 0.5 ? kA : kA + 1
        f.k[i] = vis > 0 ? k : 0
        const m = i * 4
        M[m] = x
        M[m + 1] = z
        M[m + 2] = vis
        M[m + 3] = f.k[i]
        if (vis <= 0 || figures >= cap) continue
        figures++
        const cw = f.cw[i]
        const cellX = (COLUMN[facing] * FRAMES + anim + fi) * cw
        const shadowW = air ? 0 : cw > SPRITE_W && f.kind[i] !== K.gun ? SPRITE_W : cw
        // the figure at k, keeping its part of the dither, and at k + 1 the rest while a crossfade runs
        for (let c = 0; c < 2; c++) {
          if (c === 0 ? !drawA : !drawB) continue
          const o = j * 4
          foot[o] = x
          foot[o + 1] = metres
          foot[o + 2] = z
          foot[o + 3] = nudge
          cell[o] = cellX
          cell[o + 1] = f.row[i]
          cell[o + 2] = cw
          cell[o + 3] = SPRITE_H
          draw[o] = c === 0 ? kA : kA + 1
          draw[o + 1] = mirror * f.tint[i]
          draw[o + 2] = vis
          draw[o + 3] = dx
          mix[o] = c === 0 ? tB : 0
          mix[o + 1] = c === 0 ? 1 : tB
          mix[o + 2] = dy
          mix[o + 3] = shadowW
          j++
        }
      }
    }
    // (over the budget, every rec is thinned alike next frame)
    if (wanted > cap) this.thin = Math.max(0.1, this.thin * 0.92)
    else if (wanted < cap * 0.85 && this.thin < 1) this.thin = Math.min(1, this.thin * 1.04)
    this.drawn = figures
    this.instances = j
    this.geometry.instanceCount = j
    this.group.visible = j > 0
    if (j > 0) {
      this.range.count = j * 4
      for (const a of this.attrs) {
        a.clearUpdateRanges()
        a.updateRanges.push(this.range)
        a.needsUpdate = true
      }
    }
  }

  /**
   * A standing figure's moment (a knot's, a rank's, the arc's at rest): idle, or, now and then,
   * a shuffle (ranks), a musket fired, a sling whirled and let go, a blow struck (when fighting).
   * Returns [anim, frame].
   */
  act(i, dt, T, quiet, fighting, shuffles) {
    const f = this.f
    f.tm[i] -= dt
    // (off the tour nobody fights: a volley or a raised weapon is let fall)
    if (quiet && f.st[i] >= 2) f.st[i] = 0
    const st = f.st[i]
    let anim = A_IDLE
    let fi = Math.floor(T / (0.9 + f.tint[i]) + f.ph[i] * 2) & 1
    if (st === 1) {
      anim = A_WALK
      fi = Math.floor(((T * 1.15 + f.ph[i]) % 1) * 4)
    } else if (st >= 2) {
      f.tt[i] += dt
      const t = f.tt[i]
      anim = A_ENGAGE
      if (st === 2) fi = t < 0.55 ? 0 : t < 0.67 ? 1 : 2
      else if (st === 3) fi = t < 0.3 ? 0 : t < 0.5 ? 1 : 2
      else fi = t < 1 ? Math.floor(t / 0.12) & 1 : t < 1.15 ? 2 : 3
      if (t > (st === 2 ? 1.4 : st === 3 ? 0.8 : 1.45)) f.st[i] = 0
    }
    if (f.st[i] === 0 && f.tm[i] <= 0) {
      const u = Math.random()
      f.tm[i] = 3 + Math.random() * 7
      const kd = f.kind[i]
      if (fighting && kd === K.musket) {
        f.st[i] = 2
        f.tt[i] = 0
      } else if (fighting && kd === K.sling) {
        f.st[i] = 4
        f.tt[i] = 0
      } else if (shuffles && u < 0.55) {
        f.st[i] = 1
        f.offTo[i] = (Math.random() - 0.5) * 0.5
      } else if (fighting && u < 0.8) {
        f.st[i] = 3
        f.tt[i] = 0
      }
    }
    return [anim, fi]
  }

  /**
   * Which way a heading (x, z) on the ground faces as the camera sees it:
   * mostly away from the eye, the back; toward it, the front; else the side,
   * right or left. The facing held (cur) keeps it until another wins by HOLD.
   */
  faceOf(hx, hz, cur) {
    const V = this.view
    const a = hx * V.rx + hz * V.rz
    const b = hx * V.ax + hz * V.az
    if (a * a + b * b < 1e-12) return cur
    const end = cur >= FACE.front
    if (end ? Math.abs(a) <= HOLD * Math.abs(b) : Math.abs(b) > HOLD * Math.abs(a)) return b > 0 ? FACE.back : FACE.front
    return a > 0 ? FACE.right : FACE.left
  }

  /** For the tools: the scale every figure is drawn at now, in device pixels to the sprite pixel (the nearer of a crossfade's two). */
  scaleAt() {
    return this.scale.t < 0.5 ? this.scale.k : this.scale.k + 1
  }

  /** For the tools: where the crossfades fall at a pixel ratio (scaleBands). */
  scaleBands(dpr = this.dpr || 1) {
    return scaleBands(dpr)
  }

  /**
   * For the tools: where figure i stands on the screen, as the shader puts it
   * (sprite.glsl.js footPixel), in the target's pixels from its top left; with
   * its frame in the sheet, its mirroring (facing: -1 mirrored) and its facing (face). Null when it isn't drawn.
   */
  screenRect(i) {
    const f = this.f
    if (f.vis[i] <= 0 || !f.k[i]) return null
    const cam = this.app.camera
    const v = this._v4.set(f.x[i], Math.max(f.lift[i], 0) * this.app.world.uniforms.uVert.value, f.z[i], 1)
    v.applyMatrix4(cam.matrixWorldInverse).applyMatrix4(cam.projectionMatrix)
    if (v.w <= 0) return null
    const W = this.own.uViewport.value.x
    const H = this.own.uViewport.value.y
    const k = f.k[i]
    const px = Math.floor(((v.x / v.w) * 0.5 + 0.5) * W + 0.5) + f.dx[i] * k
    const py = Math.floor(((v.y / v.w) * 0.5 + 0.5) * H + 0.5) + f.dy[i] * k
    const w = f.cw[i] * k
    const h = SPRITE_H * k
    const cx = (COLUMN[f.face[i]] * FRAMES + f.fr[i]) * f.cw[i]
    return { x: px - w / 2, y: H - py - h, w, h, k, cell: [cx, f.row[i], f.cw[i], SPRITE_H], facing: f.mirror[i], face: f.face[i], vis: f.vis[i], solid: this.scale.t === 0 || this.scale.t === 1 }
  }

  /** For the tools: what is drawn, by side, kind, facing and what they are doing; and the scale. */
  stats() {
    const f = this.f
    const faces = ['right', 'left', 'front', 'back']
    const out = { figures: this.drawn, instances: this.instances, planned: this.count, fronts: this.fronts.length, pairs: this.pairs.length, guns: this.guns.length, sides: {}, kinds: {}, faces: {}, k: {}, scale: { k: this.scale.k, t: +this.scale.t.toFixed(3), level: +this.scale.L.toFixed(3) } }
    for (let i = 0; i < this.count; i++) {
      if (f.vis[i] <= 0) continue
      const s = SIDES[f.side[i]]
      const kd = KINDS[f.kind[i]]
      out.sides[s] = (out.sides[s] || 0) + 1
      out.kinds[kd] = (out.kinds[kd] || 0) + 1
      out.faces[faces[f.face[i]]] = (out.faces[faces[f.face[i]]] || 0) + 1
      out.k[f.k[i]] = (out.k[f.k[i]] || 0) + 1
    }
    return out
  }

  static MODE = MODE
  static KIND = K
  static FACE = FACE
  static WIDTH = WIDTH

  dispose() {
    this.geometry.dispose()
    this.material.dispose()
    this.shadowMaterial.dispose()
    this.texture.dispose()
  }
}
