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
import {
  drawPage,
  drawCover,
  drawBackCover,
  drawCaption,
  captionSize,
  drawClothTile,
  drawEdgeTile,
  drawTab,
  drawTabStrip,
  toTexture,
} from './textures.js'
import { DEFAULT_AUDIO } from './audio.js'

export { W, H, LEAF, COVER }

const PI = Math.PI
// Dihedral (radians, ≈3.4°) under which a spread counts as shut and is hidden.
const CLOSED_THETA = 0.06
const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v)
// Run fn in idle time where the browser offers it, else as the next task.
const idle = (fn) =>
  typeof requestIdleCallback === 'function' ? requestIdleCallback(fn, { timeout: 500 }) : setTimeout(fn, 0)
const smoothstep = (a, b, x) => {
  const t = clamp((x - a) / (b - a), 0, 1)
  return t * t * (3 - 2 * t)
}

// Guide captions (DESIGN.md, the story layer). A line changes in sequence,
// never crossed: the old line fades out to blank paper, the paper rests blank
// a moment, then the new line fades in. 1.2 s from the change to the new line
// starting, 2.7 s in all. The first advance waits for this many in-breath
// starts at rest (= two full cycles after the one you arrived in), then every
// in-breath start brings the next line.
export const CAPTION_OUT = 0.55
export const CAPTION_HOLD = 0.65
export const CAPTION_IN = 1.5
const FIRST_BEAT_INHALES = 3
// Caption height above its page: clear of the paper's depth, far below anything
// a reader could see as a gap.
const CAPTION_LIFT = 0.0015

// The pull tab (STORY.md, Layer 4), in the right page plane's local space (x 0
// at the spine … W at the outer edge, z −H/2 far … H/2 near, y up off the
// page). The tab sticks out of the outer edge a little behind mid-height,
// clear of the caption's near strip and of the far strip; its root lies on the
// page, lifted over the caption. The strip lies just under the page (the page
// and the paper block hide it) and slides out along +x carrying the tab on its
// leading edge; a sliver stays tucked under the page when it is fully out.
export const TAB = {
  w: 0.09, // tab size
  d: 0.05,
  root: 0.035, // how much of it lies on the page
  z: -0.05, // centre of tab and strip
  lift: 0.003, // tab above the page
  stripW: 0.62,
  stripD: 0.34,
  drop: -0.004, // strip below the page
  reach: 0.6, // how far the strip comes out
  seconds: 1.2, // a full pull or push
  minOpen: 0.9, // openness under which the tab is hidden
}
const TAB_FADE_IN = 0.8 // the tab appears this softly once the spread is at rest
const _m4 = new THREE.Matrix4()
const _ray = new THREE.Ray()
const _hit = new THREE.Vector3()

export const TURN_SECONDS = 2.6
export const JUMP_SECONDS = 1.8

// Turn easing: ease-in-out, slightly slower at the start (a page lifting).
// u^1.25 stretches the beginning; the half-cosine keeps zero speed at both ends.
export const turnEase = (u) => 0.5 - 0.5 * Math.cos(PI * Math.pow(clamp(u, 0, 1), 1.25))

// Palette of the closed book (no spread open).
export const BOOK_PALETTE = { bg: '#12100e', paper: '#efe6d4', ink: '#3b322a', accent: '#e3bf86' }

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
    this.layerV = [0, 0, 0, 0]
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
    // v across the leaves for the striped edge texture (16 leaves per tile):
    // 0 on face 0 (corners A, B), L on face 1 (C, D)
    const L = layers > 0 ? layers / 16 : 0.3
    const layerV = this.layerV
    layerV[2] = layerV[3] = L
    for (let q = 0; q < 6; q++) {
      const quad = QUADS[q]
      let nx = 0
      let ny = 0
      let nz = 0
      if (q < 4) {
        const c0 = quad[0][0]
        const c1 = quad[1][0]
        const dx = poly[c1 * 2] - poly[c0 * 2]
        const dy = poly[c1 * 2 + 1] - poly[c0 * 2 + 1]
        const len = Math.hypot(dx, dy)
        if (len > 1e-9) {
          nx = (sgn * dy) / len
          ny = (-sgn * dx) / len
        } else ny = 1
      } else nz = q === 4 ? 1 : -1
      for (let k = 0; k < 4; k++) {
        const c = quad[k][0]
        const e = quad[k][1]
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
  constructor({ scene, renderer, camera, scenes, quality = 'high', colophon = [] }) {
    this.renderer = renderer
    this.scene = scene // scene + camera: for renderer.compile() in prewarm
    this.camera = camera
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
    const backTex = toTexture(drawBackCover(quality === 'low' ? 768 : 1024, colophon), { anisotropy: aniso })
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

    // ---- captions --------------------------------------------------------------
    // The right page's line lives on a caption plane over the page's near strip
    // (same texel density as the page), parented to whichever right-type page
    // plane (pageR or pageMF) shows that spread's right page.
    this.captionDims = captionSize(this.pageWidth)
    const cd = this.captionDims.depth
    this.captionGeo = new THREE.PlaneGeometry(W, cd)
      .rotateX(-PI / 2)
      .translate(W / 2, CAPTION_LIFT, H / 2 - cd / 2)

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
      needsCompile: false, // built by prewarm, shaders not compiled yet
      visible: false,
      mats: { left: null, right: null },
      frame: null,
      caption: null, // see caption()
      tab: null, // see tabFor()
      beat: 0, // guide beat reached (0 = `line`), remembered across visits
      inhales: 0, // in-breath starts counted during this visit at rest
      wasActive: false,
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
    this.warmedAt = -1
    this.warming = false // a prewarm step is waiting for idle time
    this.dirty = true
    // pull: how far the camera makes room for an open strip (stage.js)
    this.look = { bg: new THREE.Color(BOOK_PALETTE.bg), accent: new THREE.Color(BOOK_PALETTE.accent), open: 0, pull: 0 }
    this.pointer = { x: 0, y: 0 } // shared with every frame (main eases it)
    this.onTurnStart = null // (toN, fromN) → void
    this.onArrive = null // (n) → void
    this.onBeat = null // (spreadIndex, beat, text) → void, when a guide line advances

    // ---- guide ---------------------------------------------------------------
    this.guide = true // off: captions show `line`, frame.beat = the final beat
    this.forceBeat = null // { k, beat } for ?beat: spread k always shows `beat`
    this.forcePull = null // ?pull: frame.pull for every spread, whatever the tab does

    // ---- pull tab --------------------------------------------------------------
    // One strip open at a time: k is the spread it belongs to, u its exposure
    // (0 hidden … 1 out), eased from `from` to `to` over `dur`; while dragged, u
    // follows the pointer.
    this.pull = { k: -1, u: 0, from: 0, to: 0, t: 0, dur: 0, dragging: false, x0: 0, u0: 0 }
    this.tabHover = false
    this.onPull = null // (spreadIndex) → void, when a reader pulls a strip out
    this.tabGeo = new THREE.PlaneGeometry(TAB.w, TAB.d).rotateX(-PI / 2)
    this.stripGeo = new THREE.PlaneGeometry(TAB.stripW, TAB.stripD).rotateX(-PI / 2)
    this._phase = 'in' // last breath phase, to catch the start of an in-breath
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

  // Guide line `beat` of spread k (0 = the printed line).
  lineFor(k, beat) {
    const mod = this.spreads[k].mod
    if (beat <= 0) return mod.line || ''
    const g = mod.guide || []
    return g[Math.min(beat, g.length) - 1] || mod.line || ''
  }

  // The line spread k's caption shows right now: its beat with the guide on,
  // `line` (0) with it off; ?beat overrides either way.
  shownBeat(k) {
    const f = this.forceBeat
    if (f && f.k === k) return f.beat
    return this.guide ? this.spreads[k].beat : 0
  }

  // What frame.beat carries: the shown beat with the guide on; with it off the
  // final beat, so a reader without the guide sees every picture in its
  // complete resting state while the caption shows `line` only.
  sceneBeat(k) {
    const f = this.forceBeat
    if (f && f.k === k) return f.beat
    return this.guide ? this.spreads[k].beat : (this.spreads[k].mod.guide || []).length
  }

  setGuide(on) {
    this.guide = !!on
  }

  // The spread resting open right now (no turn, no ?theta freeze), or −1.
  get restSpread() {
    return !this.turn && !this.frozen ? Book.spreadAt(this.n) : -1
  }

  // ---- pull tab ----------------------------------------------------------------

  // Exposure of spread k's strip, 0 … 1 (eased).
  pullOf(k) {
    return this.pull.k === k ? this.pull.u : 0
  }

  // Is a strip out (or on its way out)?
  get pullOpen() {
    const p = this.pull
    return p.k >= 0 && (p.u > 0.001 || p.to > 0)
  }

  // Ease spread k's strip to exposure v (1 out, 0 back) over TAB.seconds per
  // full travel; `instant` jumps. Another spread's strip goes back at once.
  pullTab(k, v = 1, instant = false) {
    const p = this.pull
    if (k < 0 || k >= this.spreads.length) return
    if (p.k !== k) {
      p.k = k
      p.u = 0
    }
    p.dragging = false
    p.from = p.u
    p.to = clamp(v, 0, 1)
    p.t = 0
    p.dur = TAB.seconds * Math.abs(p.to - p.from)
    if (instant || p.dur < 1e-3) p.u = p.to
    this.ensureBuilt(k)
    if (p.to > p.from && this.onPull) this.onPull(k)
  }

  // Pull the resting spread's strip out, or push it back. False when no
  // spread is at rest.
  togglePull() {
    const k = this.restSpread
    if (k < 0) return false
    const p = this.pull
    this.pullTab(k, p.k === k && p.to > 0.5 ? 0 : 1)
    return true
  }

  // Push the strip back at once (a turn starts, the book jumps).
  retractPull() {
    const p = this.pull
    p.u = p.from = p.to = 0
    p.dur = 0
    p.dragging = false
    this.tabHover = false
  }

  // Where `ray` (world space) meets the resting spread's right page plane at
  // height y, in that plane's local space; null if it misses or nothing rests.
  _tabRay(ray, y) {
    const k = this.restSpread
    const tb = k >= 0 ? this.spreads[k].tab : null
    if (!tb || !tb.group.parent) return null
    _m4.copy(tb.group.parent.matrixWorld).invert()
    _ray.copy(ray).applyMatrix4(_m4)
    const dy = _ray.direction.y
    if (Math.abs(dy) < 1e-6) return null
    const t = (y - _ray.origin.y) / dy
    return t > 0 ? _ray.at(t, _hit) : null
  }

  // What `ray` hits of the resting spread's tab: 'tab', 'strip' (only the part
  // out from under the page) or null. pad widens the tab's target (touch).
  tabHit(ray, pad = 0.015) {
    const k = this.restSpread
    const tb = k >= 0 ? this.spreads[k].tab : null
    if (!tb || !tb.group.visible || tb.show < 0.3) return null
    const d = this.pullOf(k) * TAB.reach
    let p = this._tabRay(ray, TAB.lift)
    if (
      p &&
      p.x >= W + d - TAB.root - pad &&
      p.x <= W + d + TAB.w - TAB.root + pad &&
      Math.abs(p.z - TAB.z) <= TAB.d / 2 + pad
    )
      return 'tab'
    if (d > 0.005) {
      p = this._tabRay(ray, TAB.drop)
      if (p && p.x >= W && p.x <= W + d && Math.abs(p.z - TAB.z) <= TAB.stripD / 2) return 'strip'
    }
    return null
  }

  // Drag: grab at the ray's page-plane x, follow it outward/inward, let go.
  tabGrab(ray) {
    const k = this.restSpread
    const p = this._tabRay(ray, 0)
    if (k < 0 || !p) return false
    const pl = this.pull
    if (pl.k !== k) this.pullTab(k, 0, true)
    pl.dragging = true
    pl.x0 = p.x
    pl.u0 = pl.u
    pl.to = pl.u
    return true
  }

  tabDrag(ray) {
    const pl = this.pull
    if (!pl.dragging || this.restSpread !== pl.k) return
    const p = this._tabRay(ray, 0)
    if (p) pl.u = clamp(pl.u0 + (p.x - pl.x0) / TAB.reach, 0, 1)
  }

  // tap: the press barely moved, so it toggles. Otherwise it settles the way
  // it was dragged (or, a nudge, to the nearer end).
  tabRelease(tap) {
    const pl = this.pull
    if (!pl.dragging) return
    pl.dragging = false
    const moved = pl.u - pl.u0
    let to
    if (tap) to = pl.u0 > 0.5 ? 0 : 1
    else if (moved > 0.08) to = 1
    else if (moved < -0.08) to = 0
    else to = pl.u > 0.5 ? 1 : 0
    this.pullTab(pl.k, to)
  }

  // Spread k's tab and strip: two meshes in one group, parented with the
  // caption to whichever plane shows k's right page. The strip's canvas is
  // drawn once.
  tabFor(k) {
    const sp = this.spreads[k]
    if (sp.tab) return sp.tab
    const pal = this.palettes[k]
    const group = new THREE.Group()
    group.name = `tab:${sp.mod.id}`
    group.visible = false
    const density = (this.pageWidth / W) * 1.5 // a little finer than the page: small type
    const sw = Math.round(TAB.stripW * density)
    const sh = Math.round(TAB.stripD * density)
    const free = TAB.reach / TAB.stripW
    const stripTex = toTexture(drawTabStrip(sp.mod.tab || {}, pal, sw, sh, free, density), {
      anisotropy: this.aniso,
    })
    const stripMat = new THREE.MeshStandardMaterial({ map: stripTex, roughness: 0.9, metalness: 0 })
    const strip = new THREE.Mesh(this.stripGeo, stripMat)
    strip.position.set(W - TAB.stripW / 2, TAB.drop, TAB.z)
    strip.castShadow = true
    strip.receiveShadow = true
    strip.visible = false
    group.add(strip)
    const tabTex = toTexture(drawTab(pal, 144, 80, TAB.root / TAB.w), { anisotropy: this.aniso })
    const tabMat = new THREE.MeshStandardMaterial({
      map: tabTex,
      roughness: 0.9,
      metalness: 0,
      transparent: true,
      depthWrite: false,
      opacity: 0,
    })
    const tab = new THREE.Mesh(this.tabGeo, tabMat)
    tab.position.set(W + TAB.w / 2 - TAB.root, TAB.lift, TAB.z)
    tab.renderOrder = 4 // over the page and the caption
    // no shadows either way: under VSM a receiver is drawn into the shadow map
    // too, and a tab that casts throws a blot on the table
    tab.receiveShadow = false
    group.add(tab)
    sp.tab = { group, strip, tab, stripMat, tabMat, show: 0, glow: 1, attached: false }
    return sp.tab
  }

  // Per frame, for a mounted spread: the tab shows only at rest (fading in),
  // the strip only while out; turning or closing hides both at once.
  updateTab(sp, dt, shown) {
    const tb = sp.tab
    if (!tb) return
    const f = sp.frame
    const rest = shown && f.active && f.openness > TAB.minOpen
    tb.show = rest ? Math.min(1, tb.show + dt / TAB_FADE_IN) : 0
    tb.group.visible = rest
    if (!rest) return
    const d = this.pullOf(sp.index)
    tb.group.position.x = d * TAB.reach
    tb.strip.visible = d > 0.0005
    const glow = this.tabHover || this.pull.dragging ? 1.16 : 1
    tb.glow += (glow - tb.glow) * (1 - Math.exp(-dt * 10))
    tb.tabMat.color.setScalar(tb.glow)
    tb.tabMat.opacity = tb.show * tb.show * (3 - 2 * tb.show)
  }

  paletteFor(n) {
    const k = Book.spreadAt(n)
    return k < 0 ? BOOK_PALETTE : this.palettes[k]
  }

  // ---- navigation ------------------------------------------------------------

  setRest(n) {
    this.retractPull()
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
    this.retractPull()
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
      if (this.canQueue()) this.queued = 1
      return
    }
    if (this.n >= 11) return this.again()
    this.startTurn(this.n, this.n + 1)
  }

  prev() {
    if (this.frozen) return
    if (this.turn) {
      if (this.canQueue()) this.queued = -1
      return
    }
    if (this.n <= 0) return
    this.startTurn(this.n, this.n - 1)
  }

  // No queued step around the covers: a double click on the closed book lands
  // on the intro, and a double → at the outro stops at "begin again".
  canQueue() {
    const t = this.turn
    return !!t && t.from !== 0 && t.to !== 0 && t.to !== 11
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
    this.retractPull() // turning the page puts the strip straight back
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
      beat: 0, // guide beat: 0 = `line`, k = guide[k − 1]; guide off → guide.length
      pull: 0, // the pull tab, 0 … 1 (eased); ?pull forces it
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

  // Spread k's caption: two planes over the right page's near strip, each a
  // copy of the page's own strip so they are opaque paper. The base is blank
  // paper, drawn once; the text layer is redrawn once per beat and fades over
  // it. Both carry the same paper, so only the type changes.
  caption(k) {
    const sp = this.spreads[k]
    if (sp.caption) return sp.caption
    const group = new THREE.Group()
    group.name = `caption:${sp.mod.id}`
    const page = this.pageMaterial(k, 'right').map.image
    const layers = [0, 1].map(() => {
      const c = drawCaption(document.createElement('canvas'), '', page, this.palettes[k].ink)
      const tex = toTexture(c, { anisotropy: this.aniso })
      const mat = new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.9,
        metalness: 0,
        transparent: true,
        depthWrite: false,
        opacity: 0,
      })
      const mesh = new THREE.Mesh(this.captionGeo, mat)
      mesh.castShadow = false
      // opaque paper over the page: it must take the pop-ups' shadows as the
      // page under it would (VSM, 1.5 mm up: no acne)
      mesh.receiveShadow = true
      mesh.visible = false
      group.add(mesh)
      return { canvas: c, tex, mat, mesh }
    })
    const [base, text] = layers
    base.mat.opacity = 1
    base.mesh.renderOrder = 2 // after the paper (0): base, then the text over it
    text.mesh.renderOrder = 3
    // beat: wanted; shown: on the text canvas (−1 = never drawn); vis: the text
    // layer's linear visibility 0…1; hold: blank-paper time still to wait
    sp.caption = { group, base, text, page, beat: -1, shown: -1, vis: 1, hold: 0, attached: false }
    return sp.caption
  }

  // Show `beat` on spread k's caption: the line on the text layer fades out to
  // blank paper, the paper rests, the new line is printed and fades in. A
  // change that arrives mid-way just steers the same fade. Snaps the first time
  // (nothing to fade from) or while the spread is out of sight.
  updateCaption(sp, beat, dt, snap) {
    const cap = sp.caption
    if (!cap) return
    cap.beat = beat
    const T = cap.text
    const print = () => {
      drawCaption(T.canvas, this.lineFor(sp.index, beat), cap.page, this.palettes[sp.index].ink)
      T.tex.needsUpdate = true
      cap.shown = beat
    }
    if (snap || cap.shown < 0) {
      if (cap.shown !== beat) print()
      cap.vis = 1
      cap.hold = 0
    } else if (cap.shown !== beat) {
      cap.vis -= dt / CAPTION_OUT
      if (cap.vis <= 0) {
        cap.vis = 0
        cap.hold = CAPTION_HOLD
        print()
      }
    } else if (cap.hold > 0) {
      cap.hold -= dt
    } else if (cap.vis < 1) {
      cap.vis = Math.min(1, cap.vis + dt / CAPTION_IN)
    }
    const v = clamp(cap.vis, 0, 1)
    const e = v * v * (3 - 2 * v)
    T.mat.opacity = e
    T.mesh.visible = e > 0
    cap.base.mesh.visible = e < 1
  }

  // Get the neighbours of the resting spread ready ahead of time so a turn
  // never stalls: page textures, then the scene, then its shaders, one step
  // per frame in idle time. ensureBuilt() stays synchronous, so a turn that
  // starts first simply builds what it needs.
  prewarm() {
    if (this.frozen || this.turn || this.restTime < 0.6 || this.warmedAt === this.n || this.warming) return
    for (let i = 0; i < 2; i++) {
      const k = Book.spreadAt(i === 0 ? this.n + 1 : this.n - 1)
      if (k < 0) continue
      const sp = this.spreads[k]
      if (sp.built && !sp.needsCompile) continue
      const n = this.n
      this.warming = true
      idle(() => {
        this.warming = false
        if (this.frozen || this.turn || this.n !== n) return // moved on: try again at rest
        if (!sp.mats.left || !sp.mats.right) {
          for (const side of ['left', 'right']) {
            const map = this.pageMaterial(k, side).map
            if (this.renderer.initTexture) this.renderer.initTexture(map)
          }
          this.caption(k)
          this.tabFor(k)
        } else if (!sp.built) {
          this.ensureBuilt(k)
          sp.needsCompile = true
        } else {
          this.compileFor(k)
          sp.needsCompile = false
        }
      })
      return
    }
    this.warmedAt = this.n // both neighbours ready: nothing to do until we move
  }

  // Lights live in the spread groups and three keys its shaders on the light
  // count, so showing a new spread would recompile every visible material at
  // the start of a turn. Compile now for what a turn to spread k shows: the
  // resting spread and k together, then k alone. Visibility is restored
  // before anything renders. Then upload k's own textures.
  compileFor(k) {
    const { renderer, scene, camera } = this
    const next = this.spreads[k].group
    if (renderer.compile && scene && camera) {
      const c = Book.spreadAt(this.n)
      const cur = c >= 0 && c !== k ? this.spreads[c].group : null
      const nextWas = next.visible
      const curWas = cur ? cur.visible : false
      next.visible = true
      if (cur) {
        cur.visible = true
        renderer.compile(scene, camera)
        cur.visible = false
      }
      renderer.compile(scene, camera)
      next.visible = nextWas
      if (cur) cur.visible = curWas
    }
    if (renderer.initTexture) {
      next.traverse((o) => {
        const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : []
        for (const m of mats) {
          for (const t of [m.map, m.emissiveMap, m.alphaMap]) if (t) renderer.initTexture(t)
        }
      })
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
        const q = this.n === 0 || this.n === 11 ? 0 : this.queued // never past a cover
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

    // the pull tab's travel, and the camera making room for it (held while a
    // drag is under way, so the page doesn't slide under the pointer)
    const pl = this.pull
    if (!pl.dragging && pl.u !== pl.to) {
      pl.t += dt
      const u = pl.dur > 0 ? clamp(pl.t / pl.dur, 0, 1) : 1
      pl.u = u >= 1 ? pl.to : pl.from + (pl.to - pl.from) * (u * u * (3 - 2 * u))
    }
    const view = this.restSpread >= 0 && pl.k === this.restSpread ? pl.u : 0
    if (!pl.dragging) this.look.pull += (view - this.look.pull) * (1 - Math.exp(-dt * 3.5))

    // the start of an in-breath: the moment a guide line may advance
    const inhale = breath.phase === 'in' && this._phase === 'out'
    this._phase = breath.phase
    this.updateSpreads(dt, breath, inhale)
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
      if (mesh.userData.side === 'right') {
        const cap = this.caption(pg.spread)
        if (cap.group.parent !== mesh) mesh.add(cap.group)
        cap.attached = true
        const tb = this.tabFor(pg.spread)
        if (tb.group.parent !== mesh) mesh.add(tb.group)
        tb.attached = true
      }
    }
    // a caption (or tab) whose right page is on no plane this frame leaves the scene
    for (const sp of this.spreads) {
      for (const o of [sp.caption, sp.tab]) {
        if (!o) continue
        if (!o.attached && o.group.parent) o.group.parent.remove(o.group)
        o.attached = false
      }
    }
    this.root.position.x = L.offX
  }

  updateSpreads(dt, breath, inhale = false) {
    const L = this.layout
    const restSpread = !this.turn && !this.frozen ? Book.spreadAt(this.n) : -1
    for (const sp of this.spreads) sp._mounted = false
    for (let i = 0; i < L.mountCount; i++) {
      const m = L.mounts[i]
      const sp = this.ensureBuilt(m.spread)
      sp._mounted = true
      // Below ~2° the two pages are touching: everything glued between them is
      // hidden by the paper, except stand-offs (a flap's hinge gap, a decoration
      // 0.002 above the page) that poke through the other page near the spine.
      // Nothing legitimately visible is lost by hiding the whole spread there.
      const theta = clamp(m.aL - m.aR, 0, PI)
      const shown = theta > CLOSED_THETA
      sp.group.visible = shown
      sp.visible = true
      // Spread space: the group's local +y must be the bisector of the two
      // pages. The pages' world directions are the angles aL (left) and aR
      // (right), so the bisector points at (aL + aR)/2 and the group turns by
      // that minus π/2 (its +y starts at π/2). Closing spread: aL = π + tilt,
      // aR = tilt + ψ → rotation = tilt + ψ/2; opening spread: aL = tilt + ψ,
      // aR = tilt → rotation = tilt + ψ/2 − π/2 (DESIGN.md, with tilt = 0).
      sp.group.position.set(m.x, m.y, 0)
      sp.group.rotation.set(0, 0, (m.aL + m.aR) / 2 - PI / 2)
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
      // guide beats: count in-breath starts while resting here with the guide on
      if (f.active) {
        if (!sp.wasActive) sp.inhales = 0
        const forced = this.forceBeat && this.forceBeat.k === sp.index
        const last = (sp.mod.guide || []).length
        if (inhale && this.guide && !forced && sp.beat < last && ++sp.inhales >= FIRST_BEAT_INHALES) {
          sp.beat++
          if (this.onBeat) this.onBeat(sp.index, sp.beat, this.lineFor(sp.index, sp.beat))
        }
      }
      sp.wasActive = f.active
      f.beat = this.sceneBeat(sp.index)
      f.pull = this.forcePull ?? this.pullOf(sp.index)
      if (sp.caption) {
        sp.caption.group.visible = shown
        this.updateCaption(sp, this.shownBeat(sp.index), dt, !shown)
      }
      this.updateTab(sp, dt, shown)
      if (!sp.updateFailed) {
        try {
          sp.paper.update(theta)
          if (sp.inst && sp.inst.update) sp.inst.update(f)
        } catch (err) {
          // one broken scene must not take the book down: report once, freeze it
          console.error(`[jhana-book] update() failed for "${sp.mod.id}":`, err)
          sp.updateFailed = true
        }
      }
      // A scene may hide its own group; the engine's closed-state hiding wins
      // either way.
      if (!shown) sp.group.visible = false
    }
    for (const sp of this.spreads) {
      if (!sp._mounted) sp.wasActive = false
      if (sp.visible && !sp._mounted) {
        sp.group.visible = false
        sp.visible = false
        if (sp.tab) {
          sp.tab.group.visible = false
          sp.tab.show = 0
        }
      }
    }
  }
}
