import { Board } from './board.js'
import { Scene3D } from './scene3d.js'
import { FloorPainter, REVEAL } from './floor.js'
import { LinkStore } from './links.js'
import { Notes } from './notes.js'
import { Director } from './director.js'
import { clamp, reach, wander } from './view.js'
import { SERIF } from './palette.js'

const $ = (id) => document.getElementById(id)
// ?slow=8 runs the whole piece at an eighth of the speed — for watching a
// stone tumble, or a line let go and find somewhere else to land.
const SLOW = Number(new URLSearchParams(location.search).get('slow')) || 1
const clock = () => performance.now() / 1000 / SLOW
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches

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
    // A drag is held within the screen's reach (view.js), and resizing the
    // window or turning the phone changes it. Left past the new reach, a drag
    // would pin the view at the edge, and dragging back would do nothing for
    // a while.
    const r = reach(w, h)
    user.dx = clamp(user.dx, 0, r.x)
    user.dz = clamp(user.dz, 0, r.z)
  }
  addEventListener('resize', resize)
  resize()
  // The star compass is the one place whose drawing is the point, so a card
  // weighs sitting on it as it does sitting on the chrome. It moves with the
  // camera, so its box on screen is taken each frame.
  const compass = board.island.compass
  const compassBox = () => {
    let x0 = Infinity
    let y0 = Infinity
    let x1 = -Infinity
    let y1 = -Infinity
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2
      const [x, y] = scene.project(compass.x + Math.cos(a) * compass.r, 0, compass.z + Math.sin(a) * compass.r)
      x0 = Math.min(x0, x)
      y0 = Math.min(y0, y)
      x1 = Math.max(x1, x)
      y1 = Math.max(y1, y)
    }
    return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 }
  }

  // The camera's slow drift over the floor (view.js); with reduced motion it
  // holds where the drift begins.
  const updateView = (now) => wander(view, reduceMotion ? 0 : now - t0, innerWidth, innerHeight, user)

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
  // Each line waits for its stones to land, and LinkStore starts new lines a
  // beat apart in the order it is handed them, so hand them over in the order
  // their stones land: from the middle of the frame out. In the board's own
  // order they would start from the top-left corner, long after the middle
  // had landed.
  const landed = (d) => {
    const tiles = d.kind === 'pair' ? [d.a, d.b] : d.pair.tiles
    return Math.max(...tiles.map((t) => scene.block(t).drop.t0 + scene.block(t).drop.dur)) + 0.1
  }
  const opening = [...board.desiredLinks()].sort(([, a], [, b]) => landed(a) - landed(b))
  links.sync(new Map(opening), t0, { holdUntil: landed })
  const openingLines = [...links.links.values()]
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
    const r = reach(innerWidth, innerHeight)
    user.dx = clamp(user.dx - (d * dx - c * dy) / det, 0, r.x)
    user.dz = clamp(user.dz - (-b * dx + a * dy) / det, 0, r.z)
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
  let opened = false
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
    notes.update(scene, now, dt, [...reserved, compassBox()])
    st.turns.textContent = String(board.turnCount).padStart(4, '0')
    st.links.textContent = String(links.count()).padStart(2, '0')
    if (!ready) {
      ready = true
      document.body.classList.add('ready')
    }
    // The opening is over once every line it drew is in (or has since let
    // go) and the first card has opened: the gallery's thumbnail waits for
    // this, rather than for a guess at how long the opening takes. The last
    // line comes in a second or so after that card's first turn is due, so
    // the card usually shows a word with the one it was by then.
    if (
      !opened &&
      openingLines.every((l) => l.p >= 1 || l.to === 0) &&
      notes.list.some((n) => n.el.classList.contains('open'))
    ) {
      opened = true
      document.body.classList.add('opened')
    }
    requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)
}

boot()
