// The minimap (F8b, DESIGN §4.2.7's "Camera and navigation"): the whole
// board in a corner, so the units off screen stay in reach. A 160×112 px
// canvas, bottom-left on a landscape screen; on a portrait one top-right,
// 120 px across, folded to a 🗺 button until opened. It draws, back to
// front:
//   - the terrain's footprints (each standing chunk's shape seen from above,
//     a forest floor soft under its trees), painted into an offscreen canvas
//     and kept until the terrain changes (a chunk broken or dropped: the
//     mirror's chunks), so a redraw only copies it;
//   - the zones and the objectives, each ringed in its holder's colour;
//   - the order lines (a march's to its slot, an attack's to its target);
//   - each standing unit as a dot in its seat's colour, as large as its disc
//     (at least a pixel and a half), the ones picked up outlined;
//   - the camera's ground trapezoid (the four corner rays met with the
//     table, clipped to it);
//   - pings: a ring that swells and fades where a unit lost models or a
//     chunk broke out of the camera's sight (read off the mirror between
//     redraws, so no event handler is needed).
// It reads only what the table shows: the mirror (the player's), the unit
// views (each unit's seat and colour), the terrain view's chunk defs, the
// objectives' places and the camera. (F16) Under the courtesy fog
// (`fog()`, app/flow.js's fogShown: null without it) an enemy unit the
// seat played here can't see has no dot and no ping; where one was last
// seen a grey ring stands (its ghost, as on the table); and the terrain's
// footprints are the scenery as last seen (a wall broken out of sight still
// drawn, no ping for it).
//
// Input: a click or a drag pans the camera there (`pan(x, z)`, the camera
// rig's, wired by the app). A right-click or a long press (500 ms) asks the
// app's `ground({x, z}, 'pin')` (with a group picked up: pin its march or
// move there, committed as on the board, by its flag or Enter); a plain
// click first offers `ground({x, z}, 'click')` (an armed March takes it), and
// pans only if nothing took it. A right-drag on the table pans the table, so
// March is never bound to a right-click on the table itself.
//
// Cost (DESIGN §4.2.1: ≤ 1 ms a redraw, ≤ 10 Hz): it looks at most ten
// times a second, and redraws only when what it shows has changed (a
// signature of the units' places, the selection, the owners, the terrain's
// state, the order lines and the camera's pose); `ms` keeps the last
// redraw's time for render-bench (`paintMs` the last one that painted the
// terrain's footprints again: a new board, a chunk broken). It is hidden on a board no larger than
// classic's unless toggled (M), and draws nothing under ?fast.
//
// (F8b's review) Its toggle, 🗺, is its own, at its own corner, not one of
// the tools': two more buttons there widened the row over the other seat's
// score at a laptop's width, and over the phase hint on a phone, on every
// board. On a larger board the 🗺 shows in battle, a tab on the map's
// corner while it is up and the map's place itself while it is folded; on
// classic's it shows only once M has brought the map up, so classic's
// screen is as it was.
import * as THREE from 'three'

const W_PX = 160, H_PX = 112
// the portrait's width, folded
const W_PORTRAIT = 120
const HZ = 10
const LONG_PRESS = 500
const tmp = new THREE.Vector3()

export class Minimap {
  // `units` (view/units.js's UnitViews: each unit's seat and colour),
  // `terrain` (view/terrain.js's TerrainView: the chunks' defs), `mirror()`
  // the mirror shown, `camera` the table's, `board()` the board shown ({ W,
  // H, deploy, edges, objectives: [{ x, z }] }), `colorOf(seat)`,
  // `selected()` the ids picked up, `lines()` the order lines
  // (input/standing.js's), `pan(x, z)` and `ground({ x, z }, how)` (above),
  // `fast` (?fast: nothing drawn)
  // ((F16) `fog()`: the courtesy fog as the table shows it, or null)
  constructor({ units, terrain, mirror, camera, board, colorOf, selected = () => [], lines = () => [], pan = () => {}, ground = () => false, fog = () => null, fast = false }) {
    Object.assign(this, { units, terrain, mirror, camera, board, colorOf, selected, lines, pan, ground, fog, fast })
    const wrap = (this.el = document.createElement('div'))
    wrap.id = 'minimap'
    wrap.className = 'hidden'
    const canvas = (this.canvas = document.createElement('canvas'))
    // the toggle, at the map's own corner (above)
    const btn = (this.button = document.createElement('button'))
    btn.id = 'minimapBtn'
    btn.className = 'mmfold'
    btn.textContent = '🗺'
    wrap.appendChild(btn)
    wrap.appendChild(canvas)
    document.body.appendChild(wrap)
    btn.title = 'Minimap (M): the whole board; click it to look there, right-click or long-press to march a group there'
    btn.onclick = () => this.toggle()
    addEventListener('keydown', (e) => {
      if (e.code !== 'KeyM' || e.ctrlKey || e.metaKey || e.altKey || e.repeat) return
      if (/^(INPUT|SELECT|TEXTAREA)$/.test(e.target?.tagName ?? '') || document.querySelector('.modal:not(.hidden)')) return
      this.toggle()
    })
    // the player's own choice (null: the board's default, shown on a
    // larger board than classic's)
    this.wanted = null
    this.sig = ''
    this.terrainSig = ''
    this.bg = null
    this.ms = 0
    this.paintMs = 0
    this.redraws = 0
    this.pings = []
    this.lost = new Map()
    this.dead = new Set()
    this.wire()
    if (!fast) setInterval(() => this.tick(), 1000 / HZ)
  }

  // ── Showing ───────────────────────────────────────────────────────────────
  // whether the map shows: the player's choice, else on a board larger than
  // classic's, in battle (folded to its 🗺 on a portrait screen until opened)
  up() {
    const b = this.board(), M = this.mirror()
    if (!b || !M || M.stage === 'title') return false
    return this.wanted ?? (b.W * b.H > 40 * 28 && innerWidth >= innerHeight)
  }
  toggle() {
    this.wanted = !this.up()
    this.sig = ''
    this.tick()
  }

  // The canvas's size for the screen (landscape 160×112, portrait 120 px
  // across, the board's own shape inside it), in device pixels.
  fit() {
    const b = this.board()
    const portrait = innerWidth < innerHeight
    const cssW = portrait ? W_PORTRAIT : W_PX
    const cssH = Math.round(Math.min(portrait ? W_PORTRAIT : H_PX, (cssW * b.H) / b.W))
    const dpr = Math.min(devicePixelRatio || 1, 2)
    if (this.canvas.width !== Math.round(cssW * dpr) || this.canvas.height !== Math.round(cssH * dpr) || this.portrait !== portrait) {
      this.canvas.width = Math.round(cssW * dpr)
      this.canvas.height = Math.round(cssH * dpr)
      this.canvas.style.width = `${cssW}px`
      this.canvas.style.height = `${cssH}px`
      this.portrait = portrait
      this.el.classList.toggle('portrait', portrait)
      this.bg = null
    }
    // the board's scale: px per inch, the board centred
    const k = Math.min(this.canvas.width / b.W, this.canvas.height / b.H)
    this.k = k
    this.ox = this.canvas.width / 2
    this.oy = this.canvas.height / 2
    return b
  }
  // a table point on the canvas, and back
  toPx(x, z) {
    return [this.ox + x * this.k, this.oy + z * this.k]
  }
  toTable(px, py) {
    return { x: (px - this.ox) / this.k, z: (py - this.oy) / this.k }
  }

  // ── Each tick (≤ 10 Hz) ──────────────────────────────────────────────────
  tick() {
    const up = this.up(), M = this.mirror(), b0 = this.board()
    // (the map or its folded 🗺 in battle on a larger board; on classic's
    // only while brought up)
    const larger = !!b0 && b0.W * b0.H > 40 * 28
    const portrait = innerWidth < innerHeight
    // ((V3b) raised over the card from where the card's top stands, its
    // layout box (no slide): 10 px over it, which on a wide screen, the card
    // 10 px off the bottom, is its height and 20 px as before, and on a
    // narrow one, the card standing over the actions (style.css), is higher;
    // and while the card shows on a screen with no room for the map above
    // it (under 64 px, the roster's top, left: a landscape phone, the card
    // filling the left), the map is put away until the card goes)
    const card = document.querySelector('#card')
    const cardUp = !portrait && !!card?.classList.contains('show')
    const lift = cardUp ? innerHeight - card.offsetTop + 10 : 10
    if (this.el.offsetHeight) this.height = this.el.offsetHeight
    const room = !cardUp || innerHeight - lift - (this.height ?? 0) >= 64
    const shown = (up || (larger && !!M && M.stage !== 'title')) && room
    this.el.classList.toggle('hidden', !shown)
    this.el.classList.toggle('folded', !up)
    this.button.classList.toggle('on', up)
    // ((F8b's review) where the map's top stands, landscape: the roster
    // above it, also down the left, stops short of it (style.css's
    // --minimap-top), so the map raised over the card never covers its
    // last rows; its place as it comes to rest, whatever its slide)
    const top = shown && !portrait ? `${Math.round(innerHeight - lift - this.el.offsetHeight)}px` : ''
    if (this.top !== top) {
      this.top = top
      if (top) document.documentElement.style.setProperty('--minimap-top', top)
      else document.documentElement.style.removeProperty('--minimap-top')
    }
    if (!shown) {
      this.sig = ''
      return
    }
    this.el.classList.toggle('portrait', portrait)
    // (above the unit card while it shows, which also lives bottom-left)
    if (this.lift !== lift) this.el.style.bottom = `${(this.lift = lift)}px`
    if (!up) {
      this.sig = ''
      return
    }
    const b = this.fit()
    const sig = this.signature(M, b)
    this.watch(M)
    if (sig === this.sig && !this.pings.length) return
    this.sig = sig
    const t0 = performance.now()
    const painted = this.draw(M, b)
    // (a redraw's time; the terrain's footprints, painted again only when
    // the terrain changed, kept apart: `paintMs`)
    if (painted) this.paintMs = performance.now() - t0
    else this.ms = performance.now() - t0
    this.redraws++
  }

  // what the map shows, as a string: a redraw only when it changes
  signature(M, b) {
    const parts = [b.W, b.H, this.canvas.width, M.owners?.join(), [...this.selected()].join()]
    for (const d of this.dots(M)) parts.push(`${d.id}${d.ghost ? 'g' : ''}:${Math.round(d.x * 4)}:${Math.round(d.z * 4)}`)
    parts.push(this.terrainKey(M))
    for (const l of this.lines()) parts.push(`${l.k}${Math.round(l.from.x)}${Math.round(l.from.z)}${Math.round(l.to.x)}${Math.round(l.to.z)}`)
    const e = this.camera.matrixWorld.elements
    parts.push([e[12], e[13], e[14], e[8], e[9], e[10]].map((x) => x.toFixed(2)).join())
    return parts.join('|')
  }
  // the terrain's state: which chunks stand, and at what height ((F16) as
  // the seat played here last saw them, under the fog)
  terrainKey(M) {
    let n = 0, h = 0
    for (const [id, c] of this.chunkStates(M)) if (c.alive) (n++, (h += c.y * (1 + (Number(id) % 7))))
    return `${n}:${h.toFixed(2)}`
  }
  // (F16) each chunk's state as the minimap draws it: the mirror's, or
  // under the fog the seat's record of it (a chunk never seen: not drawn)
  chunkStates(M) {
    const table = this.fog()?.F?.table
    if (!table) return Object.entries(M.chunks)
    return Object.keys(M.chunks).map((id) => [id, table.get(Number(id)) ?? { alive: false, y: 0 }])
  }

  // (F16) The units' dots: each standing unit the fog doesn't veil, where
  // the table shows it, in its seat's colour; and each ghost, grey, where
  // it was last seen. [{ id, x, z, r, color, ghost }] (?debug reads it)
  // ((F9a) a rider is its hull's dot: it has none of its own)
  dots(M) {
    const fog = this.fog(), out = []
    for (const v of this.units.views.values()) {
      const mu = M.units[v.id]
      if (!(mu?.alive > 0) || mu.aboard || fog?.hide?.has(v.id)) continue
      out.push({ id: v.id, x: mu.pos.x, z: mu.pos.z, r: mu.r, color: v.color, ghost: false })
    }
    for (const [id, rec] of fog?.ghosts ?? []) out.push({ id, x: rec.pos.x, z: rec.pos.z, r: rec.r, color: '#9a9a94', ghost: true })
    return out
  }

  // Pings: a unit that lost models, or a chunk broken, since the last look,
  // where the camera doesn't see it.
  watch(M) {
    const now = performance.now(), fog = this.fog()
    for (const v of this.units.views.values()) {
      const mu = M.units[v.id]
      if (!mu) continue
      const was = this.lost.get(v.id)
      // ((F16) none for a unit the fog veils)
      if (was !== undefined && mu.alive < was && !this.seen(mu.pos) && !fog?.hide?.has(v.id)) this.pings.push({ x: mu.pos.x, z: mu.pos.z, at: now, color: mu.alive > 0 ? '#ffd27a' : '#ff5a4a' })
      this.lost.set(v.id, mu.alive)
    }
    for (const [id, c] of this.chunkStates(M)) {
      if (c.alive) {
        this.dead.delete(id)
        continue
      }
      if (this.dead.has(id)) continue
      this.dead.add(id)
      const def = this.terrain.items.get(Number(id))?.c
      if (def && this.primed && !this.seen(def.shape)) this.pings.push({ x: def.shape.x, z: def.shape.z, at: now, color: '#e0d0b0' })
    }
    this.primed = true
    this.pings = this.pings.filter((p) => now - p.at < 1600).slice(-12)
  }
  // whether a table point is on screen
  seen(p) {
    tmp.set(p.x, 0.5, p.z).project(this.camera)
    return tmp.z < 1 && Math.abs(tmp.x) <= 1 && Math.abs(tmp.y) <= 1
  }

  // ── Drawing ───────────────────────────────────────────────────────────────
  draw(M, b) {
    const g = this.canvas.getContext('2d'), k = this.k
    const tkey = `${this.terrainKey(M)}|${this.canvas.width}x${this.canvas.height}|${b.W}x${b.H}`
    let painted = false
    if (!this.bg || this.terrainSig !== tkey) {
      this.terrainSig = tkey
      this.bg = this.paintTerrain(M, b)
      painted = true
    }
    g.clearRect(0, 0, this.canvas.width, this.canvas.height)
    g.drawImage(this.bg, 0, 0)
    // the objectives, each ringed in its holder's colour
    b.objectives.forEach((o, i) => {
      const [x, y] = this.toPx(o.x, o.z), who = M.owners?.[i] ?? -1
      g.beginPath()
      g.arc(x, y, Math.max(3, 3 * k), 0, Math.PI * 2)
      g.fillStyle = who >= 0 ? this.colorOf(who) : 'rgba(240,230,200,0.35)'
      g.globalAlpha = who >= 0 ? 0.55 : 1
      g.fill()
      g.globalAlpha = 1
      g.lineWidth = Math.max(1, k * 0.4)
      g.strokeStyle = who >= 0 ? this.colorOf(who) : '#f3ead8'
      g.stroke()
    })
    // the order lines
    g.lineWidth = Math.max(1, k * 0.35)
    for (const l of this.lines()) {
      const [x0, y0] = this.toPx(l.from.x, l.from.z), [x1, y1] = this.toPx(l.to.x, l.to.z)
      g.strokeStyle = l.k === 'attack' ? 'rgba(255,110,90,0.9)' : 'rgba(95,211,255,0.9)'
      g.setLineDash([3, 2])
      g.beginPath()
      g.moveTo(x0, y0)
      g.lineTo(x1, y1)
      g.stroke()
    }
    g.setLineDash([])
    // the units, the ones picked up outlined ((F16) a ghost a grey ring)
    const sel = new Set(this.selected())
    for (const d of this.dots(M)) {
      const [x, y] = this.toPx(d.x, d.z)
      g.beginPath()
      g.arc(x, y, Math.max(1.5, d.r * k), 0, Math.PI * 2)
      if (d.ghost) {
        g.lineWidth = Math.max(1, k * 0.3)
        g.strokeStyle = d.color
        g.stroke()
        continue
      }
      g.fillStyle = d.color
      g.fill()
      if (sel.has(d.id)) {
        g.lineWidth = Math.max(1.2, k * 0.35)
        g.strokeStyle = '#ffe680'
        g.stroke()
      }
    }
    // the camera's ground trapezoid
    const quad = this.footprint(b)
    if (quad.length > 2) {
      g.beginPath()
      quad.forEach(([x, z], i) => {
        const [px, py] = this.toPx(x, z)
        if (i) g.lineTo(px, py)
        else g.moveTo(px, py)
      })
      g.closePath()
      g.lineWidth = Math.max(1, k * 0.3)
      g.strokeStyle = 'rgba(255,255,255,0.85)'
      g.fillStyle = 'rgba(255,255,255,0.08)'
      g.fill()
      g.stroke()
    }
    // the pings
    const now = performance.now()
    for (const p of this.pings) {
      const f = (now - p.at) / 1600, [x, y] = this.toPx(p.x, p.z)
      g.globalAlpha = 1 - f
      g.beginPath()
      g.arc(x, y, 2 + f * 9 * Math.max(1, k / 2), 0, Math.PI * 2)
      g.lineWidth = 1.5
      g.strokeStyle = p.color
      g.stroke()
    }
    g.globalAlpha = 1
    return painted
  }

  // The terrain's footprints into an offscreen canvas: the mat, the zones
  // in their seats' colours, and each standing chunk from above.
  paintTerrain(M, b) {
    const c = document.createElement('canvas')
    c.width = this.canvas.width
    c.height = this.canvas.height
    const g = c.getContext('2d'), k = this.k
    const [x0, y0] = this.toPx(-b.W / 2, -b.H / 2)
    g.fillStyle = '#4d6a2e'
    g.fillRect(x0, y0, b.W * k, b.H * k)
    for (const s of [0, 1]) {
      const edge = b.edges?.[s] ?? (s ? 1 : -1)
      const [zx] = this.toPx(edge < 0 ? -b.W / 2 : b.W / 2 - b.deploy, 0)
      g.fillStyle = this.colorOf(s)
      g.globalAlpha = 0.16
      g.fillRect(zx, y0, b.deploy * k, b.H * k)
    }
    g.globalAlpha = 1
    // the floors first, then the rest ((F16) as last seen, under the fog)
    const state = new Map(this.chunkStates(M).map(([id, c]) => [Number(id), c]))
    const items = [...this.terrain.items.values()].filter((it) => it.c && state.get(it.c.id)?.alive)
    items.sort((a, bb) => (a.c.kind === 'floor' ? 0 : 1) - (bb.c.kind === 'floor' ? 0 : 1))
    for (const { c: ch } of items) {
      const s = ch.shape, [x, y] = this.toPx(s.x, s.z)
      const look = ch.look ?? {}
      g.fillStyle = FILL[ch.kind] ?? '#8a8478'
      if (ch.kind === 'floor') {
        g.globalAlpha = 0.6
        g.beginPath()
        g.arc(x, y, (look.r ?? s.reach ?? 2) * k, 0, Math.PI * 2)
        g.fill()
        g.globalAlpha = 1
      } else if (s.hx !== undefined && s.hz !== undefined && ROUND[ch.kind] !== true) {
        g.save()
        g.translate(x, y)
        g.rotate(-(s.yaw ?? look.yaw ?? 0))
        g.fillRect(-s.hx * k, -s.hz * k, Math.max(1, 2 * s.hx * k), Math.max(1, 2 * s.hz * k))
        g.restore()
      } else {
        g.beginPath()
        g.arc(x, y, Math.max(0.8, (s.r ?? s.reach ?? s.hx ?? 0.5) * k), 0, Math.PI * 2)
        g.fill()
      }
    }
    return c
  }

  // The camera's view on the table: its four corner rays met with the
  // table (a ray at or above the horizon taken to the board's far side),
  // clipped to the board.
  footprint(b) {
    const cam = this.camera, o = cam.position, pts = []
    cam.updateMatrixWorld()
    const far = Math.hypot(b.W, b.H) * 2
    for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      const d = tmp.set(sx, sy, 0.5).unproject(cam).sub(o).normalize()
      const t = d.y < -1e-6 ? Math.min(-o.y / d.y, far) : far
      pts.push([o.x + d.x * t, o.z + d.z * t])
    }
    return clip(pts, -b.W / 2, b.W / 2, -b.H / 2, b.H / 2)
  }

  // ── Input ─────────────────────────────────────────────────────────────────
  wire() {
    const c = this.canvas
    let down = null, timer = 0
    const at = (e) => {
      const r = c.getBoundingClientRect()
      return this.toTable(((e.clientX - r.left) * c.width) / r.width, ((e.clientY - r.top) * c.height) / r.height)
    }
    const clamp = (p) => {
      const b = this.board()
      return { x: Math.max(-b.W / 2, Math.min(b.W / 2, p.x)), z: Math.max(-b.H / 2, Math.min(b.H / 2, p.z)) }
    }
    c.addEventListener('contextmenu', (e) => e.preventDefault())
    c.addEventListener('pointerdown', (e) => {
      e.preventDefault()
      e.stopPropagation()
      c.setPointerCapture?.(e.pointerId)
      const p = clamp(at(e))
      if (e.button === 2) {
        this.ground(p, 'pin')
        this.sig = ''
        return
      }
      down = { p, x: e.clientX, y: e.clientY, dragged: false, pressed: false }
      clearTimeout(timer)
      // a long press: as a right-click
      timer = setTimeout(() => {
        if (!down || down.dragged) return
        down.pressed = true
        this.ground(down.p, 'pin')
        this.sig = ''
      }, LONG_PRESS)
    })
    c.addEventListener('pointermove', (e) => {
      if (!down) return
      if (!down.dragged && Math.hypot(e.clientX - down.x, e.clientY - down.y) < 4) return
      down.dragged = true
      clearTimeout(timer)
      const p = clamp(at(e))
      this.pan(p.x, p.z)
    })
    const up = (e) => {
      clearTimeout(timer)
      if (!down) return
      const d = down
      down = null
      if (d.dragged || d.pressed || e.type === 'pointercancel') return
      if (!this.ground(d.p, 'click')) this.pan(d.p.x, d.p.z)
      this.sig = ''
    }
    c.addEventListener('pointerup', up)
    c.addEventListener('pointercancel', up)
    // (a wheel over the map is the map's, not the table's dolly)
    c.addEventListener('wheel', (e) => e.stopPropagation(), { passive: true })
  }
}

// how each kind of chunk shows from above ((F19a) a powder keg a red dot,
// the colour of its danger band)
const FILL = { block: '#a59d8c', cap: '#a59d8c', tree: '#2f5a24', hedge: '#3d6e2a', boulder: '#8b8b86', crate: '#9a7048', barrel: '#7a5232', sack: '#c2a77a', mushroom: '#c4553e', floor: '#3a5422', log: '#6b4a2e', rubble: '#77706a', keg: '#e0402e' }
// the kinds drawn as discs whatever their extent
const ROUND = { tree: true, boulder: true, mushroom: true, barrel: true, sack: true, rubble: true, keg: true }

// A convex polygon ([[x, z]]) clipped to the rectangle x0..x1 by z0..z1.
function clip(poly, x0, x1, z0, z1) {
  const edge = (pts, inside, cut) => {
    const out = []
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length]
      const ia = inside(a), ib = inside(b)
      if (ia) out.push(a)
      if (ia !== ib) out.push(cut(a, b))
    }
    return out
  }
  const atX = (x) => (a, b) => [x, a[1] + ((b[1] - a[1]) * (x - a[0])) / (b[0] - a[0])]
  const atZ = (z) => (a, b) => [a[0] + ((b[0] - a[0]) * (z - a[1])) / (b[1] - a[1]), z]
  let p = poly
  p = edge(p, (q) => q[0] >= x0, atX(x0))
  p = edge(p, (q) => q[0] <= x1, atX(x1))
  p = edge(p, (q) => q[1] >= z0, atZ(z0))
  p = edge(p, (q) => q[1] <= z1, atZ(z1))
  return p
}
