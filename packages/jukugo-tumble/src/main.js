import { Board } from './board.js'
import { Scene3D } from './scene3d.js'
import { FloorPainter } from './floor.js'
import { LinkStore } from './links.js'
import { Notes } from './notes.js'
import { Director } from './director.js'
import { BOUNDS } from './field.js'

const $ = (id) => document.getElementById(id)
// ?slow=8 runs the whole piece at an eighth of the speed — for watching a
// block tumble, or a line let go and find somewhere else to land.
const SLOW = Number(new URLSearchParams(location.search).get('slow')) || 1
const clock = () => performance.now() / 1000 / SLOW
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches

async function boot() {
  // Every glyph is drawn into a texture or onto a canvas, and a canvas won't
  // wait for a web font — so wait here, once, for all four files.
  await Promise.all([
    document.fonts.load("600 64px 'JT Serif'", '熟語'),
    document.fonts.load("400 16px 'JT Serif'", '熟語'),
    document.fonts.load("400 12px 'JT Mono'", 'Ag'),
    document.fonts.load("500 12px 'JT Mono'", 'Ag'),
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
    view.ppu = base * user.zoom * (1 + 0.035 * Math.sin((t / 53) * Math.PI * 2))
    view.tx = clampX(2.5 * Math.sin((t / 97) * Math.PI * 2) + 1.4 * Math.sin((t / 41) * Math.PI * 2) + user.dx)
    view.tz = clampZ(1.8 * Math.sin((t / 83) * Math.PI * 2 + 1) + user.dz)
    view.yaw = ((-3 + 5 * Math.sin((t / 120) * Math.PI * 2)) * Math.PI) / 180
    view.pitch = ((55 + 2.5 * Math.sin((t / 71) * Math.PI * 2)) * Math.PI) / 180
  }
  const clampX = (x) => Math.max(BOUNDS.x0 + 6, Math.min(BOUNDS.x1 - 6, x))
  const clampZ = (z) => Math.max(BOUNDS.z0 + 4, Math.min(BOUNDS.z1 - 4, z))

  const t0 = clock()
  updateView(t0)
  scene.setView(view)

  // The opening: blocks fall in from the middle of the frame outward, lines
  // draw between them as they land, captions type in after.
  for (const p of board.pairs) {
    const d = Math.hypot(p.x - view.tx, p.z - view.tz)
    const start = t0 + 0.15 + d * 0.035 + Math.random() * 0.12
    for (const t of p.tiles) scene.addTile(t).dropIn(start + t.index * 0.06)
    const e = p.entry
    p.caption = { prev1: '', prev2: '', text1: e.romaji.toUpperCase(), text2: e.gloss, t0: start + 1.0 }
  }
  links.sync(board.desiredLinks(), t0, {
    holdUntil: (d) => {
      const tiles = d.kind === 'pair' ? [d.a, d.b] : d.pair.tiles
      return Math.max(...tiles.map((t) => scene.block(t).drop.t0 + scene.block(t).drop.dur)) + 0.1
    },
  })
  director.start(t0)

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
    user.dx -= (d * dx - c * dy) / det
    user.dz -= (-b * dx + a * dy) / det
    user.dx = Math.max(-18, Math.min(18, user.dx))
    user.dz = Math.max(-12, Math.min(12, user.dz))
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
