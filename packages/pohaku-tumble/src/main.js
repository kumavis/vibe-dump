import { Board } from './board.js'
import { Scene3D } from './scene3d.js'
import { FloorPainter, REVEAL } from './floor.js'
import { LinkStore } from './links.js'
import { Notes } from './notes.js'
import { Director } from './director.js'
import { BOUNDS } from './field.js'
import { SERIF } from './palette.js'

const $ = (id) => document.getElementById(id)
// ?slow=8 runs the whole piece at an eighth of the speed — for watching a
// stone tumble, or a line let go and find somewhere else to land.
const SLOW = Number(new URLSearchParams(location.search).get('slow')) || 1
const clock = () => performance.now() / 1000 / SLOW
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches

// The camera's slow wander: x is two sines (±2.5 and ±1.4), z one (±1.8).
// The board is sized from the word list and can be much smaller than
// Jukugo's, so the wander and the reach of a drag both come from the floor:
// the view's centre keeps 6 units in from the sides and 4 from the ends, the
// wander shrinks to fit what's left, and a drag reaches no further than the
// wander's edge — past it the view only clamps.
const MARGIN = { x: 6, z: 4 }
const centre = { x: (BOUNDS.x0 + BOUNDS.x1) / 2, z: (BOUNDS.z0 + BOUNDS.z1) / 2 }
const range = {
  x: Math.max(0, (BOUNDS.x1 - BOUNDS.x0) / 2 - MARGIN.x),
  z: Math.max(0, (BOUNDS.z1 - BOUNDS.z0) / 2 - MARGIN.z),
}
const drift = { x: Math.min(1, range.x / 3.9), z: Math.min(1, range.z / 1.8) }
const reach = { x: range.x + 3.9 * drift.x, z: range.z + 1.8 * drift.z }
const clamp = (v, c, r) => Math.max(c - r, Math.min(c + r, v))

async function boot() {
  // Every letter is pecked into a texture or drawn onto a canvas, and a canvas
  // won't wait for a web font — so wait here, once, for all three cuts.
  const sample = 'Pōhaku ʻāina'
  await Promise.all([
    document.fonts.load(`400 16px ${SERIF}`, sample),
    document.fonts.load(`italic 400 16px ${SERIF}`, sample),
    document.fonts.load(`600 16px ${SERIF}`, sample),
  ]).catch(() => {})

  const params = new URLSearchParams(location.search)
  const seed = Number(params.get('seed')) || 1031
  const board = new Board(seed)

  const scene = new Scene3D($('gl'))
  const floor = new FloorPainter($('floor'))
  const notes = new Notes($('cards'), $('hud'))
  const links = new LinkStore()
  const ripples = []
  const view = { tx: 0, tz: 0, yaw: 0, pitch: 1, ppu: 50 }
  const user = { dx: 0, dz: 0, zoom: 1 }
  const director = new Director({ board, scene, links, notes, ripples })

  let reserved = []
  function resize() {
    const w = innerWidth
    const h = innerHeight
    const dpr = Math.min(devicePixelRatio || 1, 2)
    scene.setSize(w, h, dpr)
    floor.resize(w, h, dpr)
    notes.resize(w, h, dpr)
    reserved = ['title', 'legend', 'stats'].map((id) => {
      const r = $(id).getBoundingClientRect()
      return { x: r.left - 12, y: r.top - 12, w: r.width + 24, h: r.height + 24 }
    })
  }
  addEventListener('resize', resize)
  resize()

  // A slow drift over the floor — never still, never fast enough to make the
  // captions hard to read.
  function updateView(now) {
    const w = innerWidth
    const h = innerHeight
    const base = Math.max(34, Math.min(60, Math.min(w, h) / 17))
    const t = reduceMotion ? 0 : now - t0
    const wave = (period, phase = 0) => Math.sin((t / period) * Math.PI * 2 + phase)
    view.ppu = base * user.zoom * (1 + 0.035 * wave(53))
    view.tx = clamp(centre.x + drift.x * (2.5 * wave(97) + 1.4 * wave(41)) + user.dx, centre.x, range.x)
    view.tz = clamp(centre.z + drift.z * 1.8 * wave(83, 1) + user.dz, centre.z, range.z)
    view.yaw = ((-3 + 5 * wave(120)) * Math.PI) / 180
    view.pitch = ((55 + 2.5 * wave(71)) * Math.PI) / 180
  }

  const t0 = clock()
  updateView(t0)
  scene.setView(view)

  // The opening: the map draws itself first (floor.js), then the stones fall
  // in from the middle of the frame outward, lines draw between them as they
  // land, captions type in after.
  const drop = t0 + REVEAL.stones
  for (const p of board.pairs) {
    const d = Math.hypot(p.x - view.tx, p.z - view.tz)
    const start = drop + d * 0.035 + Math.random() * 0.12
    for (const t of p.tiles) scene.addTile(t).dropIn(start + t.index * 0.06)
    const e = p.entry
    p.caption = { prev1: '', prev2: '', text1: e.word.toUpperCase(), text2: e.gloss, t0: start + 1.0 }
  }
  links.sync(board.desiredLinks(), t0, {
    holdUntil: (d) => {
      const tiles = d.kind === 'pair' ? [d.a, d.b] : d.pair.tiles
      return Math.max(...tiles.map((t) => scene.block(t).drop.t0 + scene.block(t).drop.dur)) + 0.1
    },
  })
  // The first card and the first turn keep Jukugo's distance from the first
  // stone landing.
  director.start(drop - 0.15)

  // ── input ────────────────────────────────────────────────────────────────
  const stage = $('stage')
  let drag = null
  stage.addEventListener('pointerdown', (e) => {
    drag = { x: e.clientX, y: e.clientY, moved: 0, id: e.pointerId }
    stage.setPointerCapture(e.pointerId)
  })
  stage.addEventListener('pointermove', (e) => {
    if (!drag) return
    const dx = e.clientX - drag.x
    const dy = e.clientY - drag.y
    drag.moved += Math.abs(dx) + Math.abs(dy)
    drag.x = e.clientX
    drag.y = e.clientY
    if (drag.moved > 4) stage.classList.add('dragging')
    // Screen delta back to a floor delta through the inverse of the floor's
    // affine map.
    const [a, b, c, d] = scene.floorAffine()
    const det = a * d - b * c
    user.dx = clamp(user.dx - (d * dx - c * dy) / det, 0, reach.x)
    user.dz = clamp(user.dz - (-b * dx + a * dy) / det, 0, reach.z)
  })
  const end = (e) => {
    if (!drag) return
    if (drag.moved < 5) {
      const tile = scene.pick(e.clientX, e.clientY)
      if (tile) director.poke(board.pairs[tile.pair], clock())
    }
    drag = null
    stage.classList.remove('dragging')
  }
  stage.addEventListener('pointerup', end)
  stage.addEventListener('pointercancel', () => {
    drag = null
    stage.classList.remove('dragging')
  })
  stage.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault()
      user.zoom = Math.max(0.6, Math.min(1.9, user.zoom * Math.exp(-e.deltaY * 0.0012)))
    },
    { passive: false },
  )
  addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault()
      director.paused = !director.paused
    }
  })

  // ── frame ────────────────────────────────────────────────────────────────
  const st = { turns: $('st-turns'), links: $('st-links'), pairs: $('st-pairs') }
  st.pairs.textContent = String(board.pairs.length)
  let last = clock()
  let ready = false
  function frame() {
    const now = clock()
    const dt = Math.min(0.1, now - last)
    last = now
    updateView(now)
    scene.setView(view)
    director.update(now)
    links.update(now)
    scene.update(now)
    scene.render()
    floor.draw({ A: scene.floorAffine(), board, links, ripples, now, intro: now - t0, noted: notes.noted() })
    notes.update(scene, now, dt, reserved)
    st.turns.textContent = String(board.turnCount).padStart(4, '0')
    st.links.textContent = String(links.count()).padStart(2, '0')
    if (!ready) {
      ready = true
      document.body.classList.add('ready')
    }
    requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)
}

boot()
