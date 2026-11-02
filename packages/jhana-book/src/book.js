// book.js — the physical book: boards, leaf stacks, the turning leaf, printed
// pages, and the spread groups the scenes live in.
//
// Geometry lives in layout.js (pure math, see the long comment there). This
// file turns that layout into meshes every frame, runs the turn state machine,
// builds spreads lazily, and calls paper.update(θ) then scene.update(frame) for
// every spread that is visible.

import * as THREE from 'three'
import { W, H, LEAF, COVER, OVERHANG } from './dims.js'
import { createLayout, layoutRest, layoutTurn } from './layout.js'
import { Paper } from './paper.js'
import { drawPage, drawCover, drawBackCover, drawClothTile, drawEdgeTile, toTexture } from './textures.js'

export { W, H, LEAF, COVER }

const PI = Math.PI
const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v)
const smoothstep = (a, b, x) => {
  const t = clamp((x - a) / (b - a), 0, 1)
  return t * t * (3 - 2 * t)
}

export const TURN_SECONDS = 2.6
export const JUMP_SECONDS = 1.8

// Turn easing: ease-in-out, slightly slower at the start (a page lifting).
// u^1.25 stretches the beginning; the half-cosine keeps zero speed at both ends.
export const turnEase = (u) => 0.5 - 0.5 * Math.cos(PI * Math.pow(clamp(u, 0, 1), 1.25))

// Palette of the closed book (no spread open).
export const BOOK_PALETTE = { bg: '#12100e', paper: '#efe6d4', ink: '#3b322a', accent: '#e3bf86' }
const DEFAULT_AUDIO = { root: 98, intervals: [0, 7, 12], brightness: 0.35, shimmer: 0.2, breathe: 0.5 }

// ---------------------------------------------------------------------------
// Solid: one prism of the book (a board, a paper stack, the moving block),
// extruded along z from a 4-point cross-section that changes every frame.
// Material groups: 0 face0 (A→B), 1 outer edge, 2 face1 (C→D), 3 spine edge,
// 4 the two end caps. See layout.js for what the faces are.
// ---------------------------------------------------------------------------
const QUADS = [
  // [vertex ids as (corner, end)] corner: 0 A, 1 B, 2 C, 3 D; end: 0 = z0, 1 = z1
  [[0, 0], [1, 0], [1, 1], [0, 1]], // face0
  [[1, 0], [2, 0], [2, 1], [1, 1]], // outer
  [[2, 0], [3, 0], [3, 1], [2, 1]], // face1
  [[3, 0], [0, 0], [0, 1], [3, 1]], // spine
  [[0, 1], [1, 1], [2, 1], [3, 1]], // near cap (+z)
  [[0, 0], [3, 0], [2, 0], [1, 0]], // far cap (−z)
]

class Solid {
  constructor(materials, z0, z1) {
    this.z0 = z0
    this.z1 = z1
    const g = new THREE.BufferGeometry()
    this.pos = new Float32Array(24 * 3)
    this.nrm = new Float32Array(24 * 3)
    this.uv = new Float32Array(24 * 2)
    g.setAttribute('position', new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage))
    g.setAttribute('normal', new THREE.BufferAttribute(this.nrm, 3).setUsage(THREE.DynamicDrawUsage))
    g.setAttribute('uv', new THREE.BufferAttribute(this.uv, 2).setUsage(THREE.DynamicDrawUsage))
    const ccw = []
    const cw = []
    for (let q = 0; q < 6; q++) {
      const b = q * 4
      ccw.push(b, b + 1, b + 2, b, b + 2, b + 3)
      cw.push(b, b + 2, b + 1, b, b + 3, b + 2)
    }
    this.indexCCW = new THREE.BufferAttribute(new Uint16Array(ccw), 1)
    this.indexCW = new THREE.BufferAttribute(new Uint16Array(cw), 1)
    g.setIndex(this.indexCCW)
    this.ccw = true
    for (let q = 0; q < 4; q++) g.addGroup(q * 6, 6, q)
    g.addGroup(24, 12, 4)
    this.geometry = g
    this.mesh = new THREE.Mesh(g, materials)
    this.mesh.castShadow = true
    this.mesh.receiveShadow = true
    this.mesh.frustumCulled = false // the shape changes every frame
  }

  set(poly, layers) {
    const { pos, nrm, uv, z0, z1 } = this
    // orientation of the cross-section decides the triangle winding
    let area = 0
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4
      area += poly[i * 2] * poly[j * 2 + 1] - poly[j * 2] * poly[i * 2 + 1]
    }
    const ccw = area >= 0
    if (ccw !== this.ccw) {
      this.geometry.setIndex(ccw ? this.indexCCW : this.indexCW)
      this.ccw = ccw
    }
    const sgn = ccw ? 1 : -1
    // v across the leaves for the striped edge texture (16 leaves per tile)
    const L = layers > 0 ? layers / 16 : 0.3
    const layerV = [0, 0, L, L]
    for (let q = 0; q < 6; q++) {
      const quad = QUADS[q]
      let nx = 0
      let ny = 0
      let nz = 0
      if (q < 4) {
        const [c0] = quad[0]
        const [c1] = quad[1]
        const dx = poly[c1 * 2] - poly[c0 * 2]
        const dy = poly[c1 * 2 + 1] - poly[c0 * 2 + 1]
        const len = Math.hypot(dx, dy)
        if (len > 1e-9) {
          nx = (sgn * dy) / len
          ny = (-sgn * dx) / len
        } else ny = 1
      } else nz = q === 4 ? 1 : -1
      for (let k = 0; k < 4; k++) {
        const [c, e] = quad[k]
        const vi = q * 4 + k
        pos[vi * 3] = poly[c * 2]
        pos[vi * 3 + 1] = poly[c * 2 + 1]
        pos[vi * 3 + 2] = e ? z1 : z0
        nrm[vi * 3] = nx
        nrm[vi * 3 + 1] = ny
        nrm[vi * 3 + 2] = nz
        let u
        let v
        if (q === 0 || q === 2) {
          u = c === 1 || c === 2 ? 1 : 0 // spine → outer
          v = e ? 0 : 1 // far edge at the top of the image
        } else if (q < 4) {
          u = e
          v = layerV[c]
        } else {
          u = c === 1 || c === 2 ? 1 : 0
          v = layerV[c]
        }
        uv[vi * 2] = u
        uv[vi * 2 + 1] = v
      }
    }
    this.geometry.attributes.position.needsUpdate = true
    this.geometry.attributes.normal.needsUpdate = true
    this.geometry.attributes.uv.needsUpdate = true
  }
}

// ---------------------------------------------------------------------------
// Book
// ---------------------------------------------------------------------------
export class Book {
  constructor({ scene, renderer, scenes, quality = 'high' }) {
    this.renderer = renderer
    this.quality = quality
    this.root = new THREE.Group()
    this.root.name = 'book'
    scene.add(this.root)
    this.layout = createLayout()
    this.time = 0

    const aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy())
    this.aniso = aniso
    this.pageWidth = quality === 'low' ? 640 : 1024

    // ---- materials -----------------------------------------------------------
    const cloth = toTexture(drawClothTile(), { repeat: true })
    cloth.repeat.set(3, 3)
    const edge = toTexture(drawEdgeTile(), { repeat: true })
    const offset = { polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 2 }
    this.clothMat = new THREE.MeshStandardMaterial({ color: '#ffffff', map: cloth, roughness: 0.82, ...offset })
    this.edgeMat = new THREE.MeshStandardMaterial({ color: '#efe6d3', map: edge, roughness: 0.94, ...offset })
    const coverTex = toTexture(drawCover(quality === 'low' ? 768 : 1024), { anisotropy: aniso })
    const backTex = toTexture(drawBackCover(512), { anisotropy: aniso })
    this.coverMat = new THREE.MeshStandardMaterial({ map: coverTex, roughness: 0.78, ...offset })
    this.backMat = new THREE.MeshStandardMaterial({ map: backTex, roughness: 0.82, ...offset })

    // ---- solids --------------------------------------------------------------
    const c = this.clothMat
    const e = this.edgeMat
    const zc = H / 2 + OVERHANG
    const zp = H / 2
    this.solids = {
      frontCover: new Solid([c, c, this.coverMat, c, c], -zc, zc),
      backCover: new Solid([c, c, this.backMat, c, c], -zc, zc),
      leftPaper: new Solid([e, e, e, e, e], -zp, zp),
      rightPaper: new Solid([e, e, e, e, e], -zp, zp),
      movingPaper: new Solid([e, e, e, e, e], -zp, zp),
      spine: new Solid([c, c, c, c, c], -zc, zc),
    }
    for (const s of Object.values(this.solids)) this.root.add(s.mesh)

    // ---- page planes ---------------------------------------------------------
    // Right-type pages span x ∈ [0, W] (spine at the image's left edge), left-
    // type pages x ∈ [−W, 0] (spine at the image's right edge). Both lie in the
    // xz plane facing +y; rotation.z swings them onto their ray.
    const rightGeo = new THREE.PlaneGeometry(W, H).rotateX(-PI / 2).translate(W / 2, 0, 0)
    const leftGeo = new THREE.PlaneGeometry(W, H).rotateX(-PI / 2).translate(-W / 2, 0, 0)
    this.blankPage = new THREE.MeshStandardMaterial({ color: '#efe6d4', roughness: 0.92 })
    const plane = (geo, side) => {
      const m = new THREE.Mesh(geo, this.blankPage)
      m.receiveShadow = true
      m.castShadow = false
      m.userData.side = side
      this.root.add(m)
      return m
    }
    this.pages = {
      pageL: plane(leftGeo, 'left'),
      pageR: plane(rightGeo, 'right'),
      pageMF: plane(rightGeo, 'right'),
      pageMB: plane(leftGeo, 'left'),
    }

    // ---- spreads -------------------------------------------------------------
    this.spreads = scenes.map((mod, index) => ({
      index,
      mod,
      built: false,
      group: null,
      paper: null,
      inst: null,
      builtAt: 0,
      failed: false,
      visible: false,
      mats: { left: null, right: null },
      frame: null,
    }))
    this.palettes = scenes.map((m) => ({ ...BOOK_PALETTE, ...(m.palette || {}) }))
    this.bookColors = { bg: new THREE.Color(BOOK_PALETTE.bg), accent: new THREE.Color(BOOK_PALETTE.accent) }
    this.spreadColors = this.palettes.map((p) => ({ bg: new THREE.Color(p.bg), accent: new THREE.Color(p.accent) }))

    // ---- state ---------------------------------------------------------------
    this.n = 0 // rest: units turned (0 closed front … 11 closed back)
    this.turn = null // { nA, nB, dir, t, dur, to }
    this.queued = 0 // one queued step (+1 / −1) while a turn runs
    this.frozen = null // { nA, nB, progress } for ?theta / ?scrub
    this.restTime = 0
    this.dirty = true
    this.look = { bg: new THREE.Color(BOOK_PALETTE.bg), accent: new THREE.Color(BOOK_PALETTE.accent), open: 0 }
    this.pointer = { x: 0, y: 0 } // shared with every frame (main eases it)
    this.onTurnStart = null // (toN, fromN) → void
    this.onArrive = null // (n) → void
  }

  // ---- queries ---------------------------------------------------------------

  // Spread index shown at rest n, or −1 for a closed book.
  static spreadAt(n) {
    return n >= 1 && n <= 10 ? n - 1 : -1
  }

  get turning() {
    return !!this.turn
  }

  // Where the book is (or is heading): for the HUD.
  get target() {
    if (this.frozen) return this.frozen.nB
    return this.turn ? this.turn.to : this.n
  }

  audioFor(n) {
    const k = Book.spreadAt(n)
    return k < 0 ? DEFAULT_AUDIO : { ...DEFAULT_AUDIO, ...(this.spreads[k].mod.audio || {}) }
  }

  paletteFor(n) {
    const k = Book.spreadAt(n)
    return k < 0 ? BOOK_PALETTE : this.palettes[k]
  }

  // ---- navigation ------------------------------------------------------------

  setRest(n) {
    this.n = clamp(n | 0, 0, 11)
    this.turn = null
    this.frozen = null
    this.dirty = true
    const k = Book.spreadAt(this.n)
    if (k >= 0) this.ensureBuilt(k)
  }

  // Freeze the turn *into* rest n at progress p (0..1): the previous state is
  // closing, n's spread opening with θ = p·π.
  freeze(n, p) {
    n = clamp(n | 0, 1, 11)
    this.turn = null
    this.frozen = { nA: n - 1, nB: n, progress: clamp(p, 0, 1) }
    this.n = n
    this.dirty = true
    for (const k of [Book.spreadAt(n - 1), Book.spreadAt(n)]) if (k >= 0) this.ensureBuilt(k)
  }

  setFrozenProgress(p) {
    if (!this.frozen) return
    this.frozen.progress = clamp(p, 0, 1)
    this.dirty = true
  }

  next() {
    if (this.frozen) return
    if (this.turn) {
      this.queued = 1
      return
    }
    if (this.n >= 11) return this.again()
    this.startTurn(this.n, this.n + 1)
  }

  prev() {
    if (this.frozen) return
    if (this.turn) {
      this.queued = -1
      return
    }
    if (this.n <= 0) return
    this.startTurn(this.n, this.n - 1)
  }

  // Jump to spread k (a dot): one block of leaves turns together.
  goTo(k) {
    if (this.frozen || this.turn) return
    const n = clamp(k + 1, 1, 10)
    if (n !== this.n) this.startTurn(this.n, n)
  }

  // "Begin again": the closed book flips back over to its front cover.
  again() {
    if (this.frozen || this.turn) return
    if (this.n === 11) this.startTurn(11, 0)
    else if (this.n !== 0) this.startTurn(this.n, 0)
  }

  startTurn(from, to) {
    const nA = Math.min(from, to)
    const nB = Math.max(from, to)
    const whole = nA === 0 && nB === 11
    const dur = nB - nA > 1 && !whole ? JUMP_SECONDS : TURN_SECONDS
    this.turn = { nA, nB, dir: to > from ? 1 : -1, t: 0, dur, to, from }
    for (const k of [Book.spreadAt(nA), Book.spreadAt(nB)]) if (k >= 0) this.ensureBuilt(k)
    this.dirty = true
    if (this.onTurnStart) this.onTurnStart(to, from)
  }

  // ---- spreads ---------------------------------------------------------------

  ensureBuilt(k) {
    const sp = this.spreads[k]
    if (sp.built) return sp
    sp.built = true
    sp.builtAt = this.time
    const mod = sp.mod
    const group = new THREE.Group()
    group.name = `spread:${mod.id}`
    group.visible = false
    this.root.add(group)
    sp.group = group
    sp.paper = new Paper(group)
    const palette = this.palettes[k]
    const ctx = {
      THREE,
      group,
      paper: sp.paper,
      W,
      H,
      palette,
      colors: {
        bg: new THREE.Color(palette.bg),
        paper: new THREE.Color(palette.paper),
        ink: new THREE.Color(palette.ink),
        accent: new THREE.Color(palette.accent),
      },
      quality: this.quality,
    }
    sp.frame = {
      dt: 0,
      time: 0,
      theta: PI,
      openness: 1,
      reveal: 1,
      breath: 0,
      breathPhase: 'in',
      breathVel: 0,
      pointer: this.pointer,
      active: false,
    }
    try {
      sp.paper.update(PI)
      sp.inst = (mod.build && mod.build(ctx)) || {}
    } catch (err) {
      console.error(`[jhana-book] build() failed for "${mod.id}":`, err)
      sp.inst = {}
      sp.failed = true
    }
    this.pageMaterial(k, 'left')
    this.pageMaterial(k, 'right')
    return sp
  }

  pageMaterial(k, side) {
    const sp = this.spreads[k]
    if (!sp.mats[side]) {
      const tex = toTexture(drawPage({ ...sp.mod, palette: this.palettes[k] }, side, this.pageWidth), {
        anisotropy: this.aniso,
      })
      sp.mats[side] = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9, metalness: 0 })
    }
    return sp.mats[side]
  }

  // Build the neighbours of the resting spread ahead of time (one per call) so
  // a turn never stalls on scene construction or texture upload.
  prewarm() {
    if (this.frozen || this.turn || this.restTime < 0.6) return
    for (const n of [this.n + 1, this.n - 1]) {
      const k = Book.spreadAt(n)
      if (k < 0 || this.spreads[k].built) continue
      const sp = this.ensureBuilt(k)
      if (this.renderer.initTexture) {
        this.renderer.initTexture(sp.mats.left.map)
        this.renderer.initTexture(sp.mats.right.map)
      }
      return
    }
  }

  // ---- per frame ---------------------------------------------------------------

  update(dt, breath) {
    this.time += dt
    const L = this.layout
    let psi = 0
    let nA = this.n
    let nB = this.n

    if (this.frozen) {
      nA = this.frozen.nA
      nB = this.frozen.nB
      psi = this.frozen.progress * PI
      if (this.dirty) layoutTurn(L, nA, nB, psi)
    } else if (this.turn) {
      const tr = this.turn
      tr.t += dt
      const u = Math.min(1, tr.t / tr.dur)
      const e = turnEase(u)
      nA = tr.nA
      nB = tr.nB
      psi = tr.dir > 0 ? PI * e : PI * (1 - e)
      if (u >= 1) {
        this.n = tr.to
        this.turn = null
        this.restTime = 0
        layoutRest(L, this.n)
        nA = nB = this.n
        psi = 0
        if (this.onArrive) this.onArrive(this.n)
        const q = this.queued
        this.queued = 0
        if (q > 0) this.next()
        else if (q < 0) this.prev()
      } else layoutTurn(L, nA, nB, psi)
      this.dirty = true
    } else {
      this.restTime += dt
      if (this.dirty) layoutRest(L, this.n)
    }

    if (this.dirty) this.applyLayout()
    this.dirty = !!this.turn

    // colours: lerp the two ends' palettes across the turn
    const pA = Book.spreadAt(nA)
    const pB = Book.spreadAt(nB)
    const from = pA < 0 ? this.bookColors : this.spreadColors[pA]
    const to = pB < 0 ? this.bookColors : this.spreadColors[pB]
    const t = nA === nB ? 0 : smoothstep(0, 1, psi / PI)
    this.look.bg.copy(from.bg).lerp(to.bg, t)
    this.look.accent.copy(from.accent).lerp(to.accent, t)
    this.look.open = 1 - L.closed

    this.updateSpreads(dt, breath)
    this.prewarm()
  }

  applyLayout() {
    const L = this.layout
    for (const key in this.solids) {
      const s = L[key]
      const solid = this.solids[key]
      solid.mesh.visible = s.visible
      if (s.visible) solid.set(s.poly, s.layers)
    }
    for (const key in this.pages) {
      const pg = L[key]
      const mesh = this.pages[key]
      mesh.visible = pg.visible
      if (!pg.visible) continue
      mesh.position.set(pg.x, pg.y, 0)
      // left-type planes extend along −x, so they point down the ray when
      // turned by (angle − π)
      mesh.rotation.z = mesh.userData.side === 'left' ? pg.angle - PI : pg.angle
      mesh.material = this.pageMaterial(pg.spread, mesh.userData.side)
    }
    this.root.position.x = L.offX
  }

  updateSpreads(dt, breath) {
    const L = this.layout
    const restSpread = !this.turn && !this.frozen ? Book.spreadAt(this.n) : -1
    for (const sp of this.spreads) sp._mounted = false
    for (let i = 0; i < L.mountCount; i++) {
      const m = L.mounts[i]
      const sp = this.ensureBuilt(m.spread)
      sp._mounted = true
      sp.group.visible = true
      sp.visible = true
      // Spread space: the group's local +y must be the bisector of the two
      // pages. The pages' world directions are the angles aL (left) and aR
      // (right), so the bisector points at (aL + aR)/2 and the group turns by
      // that minus π/2 (its +y starts at π/2). Closing spread: aL = π + tilt,
      // aR = tilt + ψ → rotation = tilt + ψ/2; opening spread: aL = tilt + ψ,
      // aR = tilt → rotation = tilt + ψ/2 − π/2 (DESIGN.md, with tilt = 0).
      sp.group.position.set(m.x, m.y, 0)
      sp.group.rotation.set(0, 0, (m.aL + m.aR) / 2 - PI / 2)
      const theta = clamp(m.aL - m.aR, 0, PI)
      const f = sp.frame
      f.dt = dt
      f.time = this.time - sp.builtAt
      f.theta = theta
      f.openness = theta / PI
      f.reveal = smoothstep(0.08, 0.7, f.openness)
      f.breath = breath.breath
      f.breathPhase = breath.phase
      f.breathVel = breath.vel
      f.active = sp.index === restSpread
      sp.paper.update(theta)
      if (sp.inst && sp.inst.update && !sp.updateFailed) {
        try {
          sp.inst.update(f)
        } catch (err) {
          // one broken scene must not take the book down: report once, freeze it
          console.error(`[jhana-book] update() failed for "${sp.mod.id}":`, err)
          sp.updateFailed = true
        }
      }
    }
    for (const sp of this.spreads) {
      if (sp.visible && !sp._mounted) {
        sp.group.visible = false
        sp.visible = false
      }
    }
  }
}
