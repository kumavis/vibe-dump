// Aperiodic Garden — wiring: game state ↔ scene ↔ pointer ↔ HUD.

import { Game } from './src/game.js'
import { Garden } from './src/scene.js'
import { Ambience } from './src/ambient.js'
import { buildGarden, buildGhost, outlineRibbon, hubOf, branchPath, W, Buf } from './src/geometry.js'
import {
  KEY_A,
  KEY_B,
  KEY_K,
  ORIENT_KITES,
  cart,
  kiteCentre,
  kiteCorners,
  neighbourKeys,
  orientOutline,
  placementKeys,
} from './src/hat.js'
import { SUMMIT } from './src/tiles.js'
import { LOOK, RIVER_BANK, WATER_SHALLOW, GHOST_RIM, css } from './src/palette.js'
import { BIOME_NAME } from './src/board.js'

const canvas = document.getElementById('scene')
const el = (id) => document.getElementById(id)

const garden = new Garden(canvas)
const ambience = new Ambience(garden.scene)

// Which words the instructions use, and whether the Place button is there. A
// coarse pointer with no hover is a touchscreen; the first real touch confirms
// it, which is what catches a laptop with a screen you can also poke.
if (matchMedia('(hover: none) and (pointer: coarse)').matches) document.body.classList.add('touch')

let game
let hover = null // { cell, fits, index }
let sticky = null // orientation the player last chose, kept across moves
let running = false

// --- rebuilding -------------------------------------------------------------

function boundsOf(g) {
  let minX = Infinity
  let maxX = -Infinity
  let minZ = Infinity
  let maxZ = -Infinity
  for (const key of g.board.filled) {
    const [x, z] = kiteCentre(KEY_A(key), KEY_B(key), KEY_K(key))
    if (x < minX) minX = x
    if (x > maxX) maxX = x
    if (z < minZ) minZ = z
    if (z > maxZ) maxZ = z
  }
  const cx = ((minX + maxX) / 2) * W
  const cz = ((minZ + maxZ) / 2) * W
  const r = Math.max(maxX - minX, maxZ - minZ) * 0.5 * W + 0.7
  return { cx, cz, r }
}

/**
 * One soft light per place a tile could go. Every legal placement has a hub;
 * rounding those onto a coarse grid collapses the dozens of ways to fill one
 * gap down to a single spark sitting over it.
 */
function hintPoints() {
  const seen = new Set()
  const out = []
  for (const f of game.fits) {
    const [x, z] = hubOf(f.cells)
    const k = `${Math.round(x / 0.55)},${Math.round(z / 0.55)}`
    if (seen.has(k)) continue
    seen.add(k)
    out.push([x, z])
    if (out.length >= 160) break
  }
  return out
}

function rebuild(instantFrame = false) {
  const bundle = buildGarden(game)
  const b = boundsOf(game)
  garden.setGarden(bundle, b)
  garden.frame(b, instantFrame)
  ambience.sync(game, bundle.branches)
  garden.setHints(game.over ? [] : hintPoints())
  garden.setSites(
    game.sites.map((s) => ({ x: s.mid[0] * W, z: s.mid[1] * W, hx: s.hub[0] * W, hz: s.hub[1] * W, done: s.done })),
  )
}

// --- the tile card ----------------------------------------------------------

const artCtx = el('tileart').getContext('2d')
const nextCtx = el('nextart').getContext('2d')

const drawTileCard = (orient) => paintTile(artCtx, game.tile, orient, 14, 2.2)

function paintTile(c, tile, orient, pad, lw) {
  const wpx = c.canvas.width
  const hpx = c.canvas.height
  c.clearRect(0, 0, wpx, hpx)
  if (!tile) return
  const cells = ORIENT_KITES[orient]
  const polys = cells.map(([a, b, k]) => kiteCorners(a, b, k).map(([p, q]) => cart(p, q)))
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  for (const poly of polys)
    for (const [x, y] of poly) {
      minX = Math.min(minX, x)
      maxX = Math.max(maxX, x)
      minY = Math.min(minY, y)
      maxY = Math.max(maxY, y)
    }
  const s = Math.min((wpx - pad * 2) / (maxX - minX), (hpx - pad * 2) / (maxY - minY))
  const ox = (wpx - (maxX - minX) * s) / 2 - minX * s
  const oy = (hpx - (maxY - minY) * s) / 2 + maxY * s
  const P = ([x, y]) => [ox + x * s, oy - y * s]

  c.lineJoin = 'round'
  c.lineCap = 'round'
  for (let i = 0; i < 8; i++) {
    c.beginPath()
    polys[i].forEach((p, j) => {
      const [x, y] = P(p)
      if (j === 0) c.moveTo(x, y)
      else c.lineTo(x, y)
    })
    c.closePath()
    c.fillStyle = css(LOOK[tile.biomes[i]].top)
    c.fill()
    c.strokeStyle = 'rgba(255,255,255,0.3)'
    c.lineWidth = 1
    c.stroke()
  }

  // the hat's own 13-sided outline, so the shape is unmistakable
  c.beginPath()
  orientOutline(orient).forEach((p, j) => {
    const [x, y] = P(p)
    if (j === 0) c.moveTo(x, y)
    else c.lineTo(x, y)
  })
  c.closePath()
  c.strokeStyle = 'rgba(34,45,54,0.7)'
  c.lineWidth = lw
  c.stroke()

  // and the stream running through it, drawn from the same path the garden uses
  if (tile.ports.size) {
    const keys = placementKeys(orient, 0, 0)
    const hub = hubOf(keys)
    for (const pass of [0, 1]) {
      c.strokeStyle = pass === 0 ? css(RIVER_BANK) : css(WATER_SHALLOW)
      c.lineWidth = (pass === 0 ? 4.1 : 2.3) * lw
      for (const slot of tile.ports) {
        const path = branchPath(keys, orient, slot, hub)
        c.beginPath()
        path.forEach((p, j) => {
          const [x, y] = P([p[0] / W, p[1] / W])
          if (j === 0) c.moveTo(x, y)
          else c.lineTo(x, y)
        })
        c.stroke()
      }
      if (tile.ports.size === 1) {
        const [hx, hy] = P([hub[0] / W, hub[1] / W])
        c.beginPath()
        c.arc(hx, hy, (pass === 0 ? 2.3 : 1.55) * lw, 0, Math.PI * 2)
        c.fillStyle = c.strokeStyle
        c.fill()
      }
    }
  }
}

// --- hover ------------------------------------------------------------------

/**
 * Choose a spot from where the cursor is. If the exact kite under the pointer
 * has no legal placement over it, try its four neighbours nearest-first — so
 * hovering *near* a gap is enough, and the tile turns itself to suit.
 */
function setHover(hit) {
  if (!game || game.over) {
    clearHover()
    return
  }
  if (!hit) {
    clearHover()
    return
  }
  const tries = [hit.cell]
  const nb = neighbourKeys(KEY_A(hit.cell), KEY_B(hit.cell), KEY_K(hit.cell))
  const ranked = nb
    .map((k) => {
      const [x, z] = kiteCentre(KEY_A(k), KEY_B(k), KEY_K(k))
      return { k, d: Math.hypot(x * W - hit.x, z * W - hit.z) }
    })
    .sort((a, b) => a.d - b.d)
  for (const r of ranked) tries.push(r.k)

  for (const cell of tries) {
    const fits = game.fitsAtCell(cell)
    if (fits.length === 0) continue
    let index = 0
    if (sticky !== null) {
      const i = fits.findIndex((f) => f.o === sticky)
      if (i >= 0) index = i
    }
    hover = { cell, fits, index }
    showGhost()
    return
  }
  clearHover()
}

/**
 * Aim from a tap. A fingertip covers about forty pixels of a phone screen and a
 * kite at overview zoom is smaller than that, so landing on one is luck. If
 * nothing legal is under the finger, take the nearest light instead — measured
 * on screen, because that is where the player is aiming.
 */
const snapRange = () => Math.max(110, Math.min(innerWidth, innerHeight) * 0.28)

function aimNear(cx, cy) {
  const hit = garden.pick(...ndc(cx, cy))
  if (hit) {
    setHover(hit)
    if (hover) return true
  }
  let best = null
  let bd = Infinity
  for (const f of game.fits) {
    const [x, z] = hubOf(f.cells)
    const v = garden.project(x, 0.02, z)
    const d = Math.hypot(((v.x + 1) / 2) * innerWidth - cx, ((1 - v.y) / 2) * innerHeight - cy)
    if (d < bd) {
      bd = d
      best = f
    }
  }
  if (!best || bd > snapRange()) return false
  const [hx, hz] = hubOf(best.cells)
  setHover({ cell: best.cells[0], x: hx, z: hz })
  return !!hover
}

function clearHover() {
  hover = null
  garden.setGhost(null)
  el('fitcount').textContent = ''
  el('contact').textContent = ''
  setControls(false)
}

/** The turn and lay buttons only mean anything once a spot is chosen. On a
 *  phone they are the whole interface, so they say so. */
function setControls(aimed) {
  const n = aimed && hover ? hover.fits.length : 0
  el('lay').disabled = !aimed
  el('prev').disabled = n < 2
  el('next').disabled = n < 2
}

function showGhost() {
  if (!hover) return
  const fit = hover.fits[hover.index]
  const g = buildGhost(fit.cells, game.tile, fit.o)
  g.rim = outlineRibbon(g.outline, 0.028, 0.022, GHOST_RIM)
  garden.setGhost(g)
  el('fitcount').textContent = hover.fits.length > 1 ? `${hover.index + 1}/${hover.fits.length}` : ''
  // How snugly it sits, and — because of a small theorem about the hat — which
  // way round the piece must be. Of the 38 ways one hat can touch another,
  // every four-edge fit is a mirrored pair and every three-edge fit is not.
  const c = el('contact')
  const parts = []
  if (fit.joins > 0) parts.push(`${fit.joins} stream${fit.joins > 1 ? 's' : ''} carried on`)
  if (fit.touch === 4) parts.push('flush ×4 · a mirrored fit')
  else if (fit.touch === 3) parts.push('flush ×3 · same hand')
  else if (fit.touch > 0) parts.push(`${fit.touch} edge${fit.touch > 1 ? 's' : ''} shared`)
  c.textContent = parts.join(' · ')
  c.classList.toggle('flush', fit.touch >= 3 || fit.joins > 0)
  setControls(true)
  drawTileCard(fit.o)
}

function cycle(step) {
  if (!hover) return
  hover.index = (hover.index + step + hover.fits.length) % hover.fits.length
  sticky = hover.fits[hover.index].o
  showGhost()
}

// --- turns ------------------------------------------------------------------

function commit() {
  if (!hover || !game || game.over) return
  const fit = hover.fits[hover.index]
  const res = game.place(fit)
  rebuild()
  garden.growTile(res.cells)

  const mid = centroidOf(fit.cells)
  if (res.fitScore > 0) pop(mid, `+${res.fitScore}`, res.perfect)
  for (const r of res.announce) {
    const cells = game.board.regionCells(r.root)
    garden.playFlash(flashGeometry(cells))
    pop(centroidOf(cells), `${BIOME_NAME[r.biome]} +${r.score}`, true)
  }
  if (res.camp) pop(mid, `${res.camp.title} · +${res.camp.score}`, true, 0.2)
  if (res.bonus > 0) pop(mid, `+${res.bonus} tiles`, false, 0.5)
  if (res.quest) {
    const site = res.quest
    pop([site.hub[0] * W, 0.9, site.hub[1] * W], `${site.title} · +${site.score}`, true, 0.25)
    garden.playFlash(flashGeometry(site.cells ?? []))
  }

  ambience.celebrate(res)
  clearHover()
  syncHud()
  if (game.over) endGame()
}

function centroidOf(cells) {
  const [x, z] = hubOf(cells)
  return [x, 0.3, z]
}

function flashGeometry(cells) {
  const buf = new Buf()
  for (const key of cells) {
    const p = kiteCorners(KEY_A(key), KEY_B(key), KEY_K(key)).map(([u, v]) => {
      const [x, y] = cart(u, v)
      return [x * W, 0.02, y * W]
    })
    buf.tri(p[0], p[2], p[1], 0xffffff)
    buf.tri(p[0], p[3], p[2], 0xffffff)
  }
  return buf
}

// --- HUD --------------------------------------------------------------------

function pop([x, y, z], text, big = false, delay = 0) {
  const v = garden.project(x, y, z)
  const span = document.createElement('span')
  span.textContent = text
  if (!big) span.className = 'small'
  span.style.left = `${((v.x + 1) / 2) * innerWidth}px`
  span.style.top = `${((1 - v.y) / 2) * innerHeight}px`
  span.style.animationDelay = `${delay}s`
  el('pops').appendChild(span)
  setTimeout(() => span.remove(), 1900 + delay * 1000)
}

function syncHud() {
  el('score').textContent = game.score.toLocaleString()
  el('tiles').textContent = Math.max(0, game.tilesLeft)
  el('sealed').textContent = game.sealedCount
  const big = game.biggestOpen()
  el('growing').textContent = big && big.size > 2 ? `${big.size} · ${BIOME_NAME[big.biome]}` : '—'
  el('tilekind').textContent = tileLabel(game.tile)

  const q = game.quest ?? game.sites[game.sites.length - 1]
  const banner = el('quest')
  if (!q) banner.classList.add('hidden')
  else {
    banner.classList.remove('hidden')
    banner.classList.toggle('done', !!q.done)
    el('questtitle').textContent = q.done ? `${q.title} ✓` : q.title
    el('questhint').textContent = q.done ? q.unlockNote || 'Done.' : q.hint
  }

  // the mill's gift: take the other tile instead
  const swap = el('swap')
  if (game.canChoose && !game.over && game.queue[1]) {
    swap.classList.remove('hidden')
    paintTile(nextCtx, game.queue[1], 0, 8, 1.1)
  } else {
    swap.classList.add('hidden')
  }
  const feed = el('feed')
  feed.textContent = ''
  for (const line of game.log) {
    const d = document.createElement('div')
    d.textContent = line
    feed.appendChild(d)
  }
  drawTileCard(hover ? hover.fits[hover.index].o : 0)
}

function tileLabel(tile) {
  if (!tile) return ''
  if (tile.camp) return `${tile.camp.title} · needs ${BIOME_NAME[tile.camp.biome]}`
  const counts = new Map()
  for (const b of tile.biomes) counts.set(b, (counts.get(b) ?? 0) + 1)
  const parts = [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([b]) => BIOME_NAME[b])
  const kind = tile.ports.size ? ` · ${tile.kind === 'fitted' ? 'stream' : tile.kind}` : ''
  return parts.slice(0, 2).join(' + ') + kind
}

function endGame() {
  el('finalscore').textContent = game.score.toLocaleString()
  const n = game.sealedCount
  el('finalnote').textContent =
    `${game.placed} hats laid · ${n} region${n === 1 ? '' : 's'} sealed` +
    (game.best.size ? ` · largest ${game.best.size} kites of ${BIOME_NAME[game.best.biome]}` : '')
  const list = el('finaltally')
  list.textContent = ''
  for (const r of (game.openTally ?? []).slice(0, 8)) {
    const li = document.createElement('li')
    li.innerHTML = `<span>${r.size} kites of ${BIOME_NAME[r.biome]} · left open</span><b>+${r.score}</b>`
    list.appendChild(li)
  }
  setTimeout(() => el('gameover').classList.remove('hidden'), 900)
}

// --- input ------------------------------------------------------------------

// One handler for mouse, pen and touch. Fingers get their own rules: a bigger
// slop before a tap becomes a drag, and a second finger that takes over as a
// pinch — zoom, pan and twist together, which is the only way to work a 3D
// board without a scroll wheel or a modifier key.
const SLOP_MOUSE = 4
const SLOP_TOUCH = 11

const pointers = new Map()
let pinch = null // { gap, cx, cy, angle } from the last move
let multi = false // a second finger joined, so the release is not a tap
let dragged = 0
let lastX = 0
let lastY = 0
let button = 0
let slop = SLOP_MOUSE

const ndc = (x, y) => [(x / innerWidth) * 2 - 1, -(y / innerHeight) * 2 + 1]

/** Gap, midpoint and twist between the two fingers down. */
function pinchFrame() {
  const [a, b] = [...pointers.values()]
  return {
    gap: Math.max(1, Math.hypot(a.x - b.x, a.y - b.y)),
    cx: (a.x + b.x) / 2,
    cy: (a.y + b.y) / 2,
    angle: Math.atan2(b.y - a.y, b.x - a.x),
  }
}

/** Capture keeps a finger's moves coming to the canvas even once it slides off
 *  the edge. It throws if the pointer has already gone, which is not worth
 *  losing the gesture over. */
function capture(id, on) {
  try {
    if (on) canvas.setPointerCapture(id)
    else canvas.releasePointerCapture(id)
  } catch {}
}

canvas.addEventListener('pointerdown', (e) => {
  if (e.pointerType === 'touch') document.body.classList.add('touch')
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
  capture(e.pointerId, true)
  if (pointers.size === 1) {
    dragged = 0
    multi = false
    button = e.button
    slop = e.pointerType === 'mouse' ? SLOP_MOUSE : SLOP_TOUCH
    lastX = e.clientX
    lastY = e.clientY
  } else {
    multi = true
    if (pointers.size === 2) pinch = pinchFrame()
  }
})

canvas.addEventListener('pointermove', (e) => {
  const p = pointers.get(e.pointerId)
  if (p) {
    p.x = e.clientX
    p.y = e.clientY
  }

  if (pointers.size >= 2) {
    const now = pinchFrame()
    if (pinch) {
      garden.zoom(pinch.gap / now.gap)
      garden.pan(now.cx - pinch.cx, now.cy - pinch.cy)
      // Twisting the fingers swings the camera round, which on a phone is the
      // only spare gesture left — one finger is already orbiting.
      let turn = now.angle - pinch.angle
      if (turn > Math.PI) turn -= Math.PI * 2
      else if (turn < -Math.PI) turn += Math.PI * 2
      garden.spin(turn)
    }
    pinch = now
    document.body.classList.add('dragging')
    return
  }

  if (p) {
    const dx = e.clientX - lastX
    const dy = e.clientY - lastY
    dragged += Math.abs(dx) + Math.abs(dy)
    lastX = e.clientX
    lastY = e.clientY
    if (dragged > slop) {
      document.body.classList.add('dragging')
      if (button === 2 || e.shiftKey) garden.pan(dx, dy)
      else garden.orbit(dx, dy)
    }
    return
  }
  if (!running || e.pointerType === 'touch') return
  setHover(garden.pick(...ndc(e.clientX, e.clientY)))
})

function endPointer(e) {
  const had = pointers.delete(e.pointerId)
  capture(e.pointerId, false)
  if (pointers.size < 2) pinch = null
  if (pointers.size > 0) {
    // a finger lifted out of a pinch: carry on from where the other one is
    const [rest] = [...pointers.values()]
    lastX = rest.x
    lastY = rest.y
    return
  }
  document.body.classList.remove('dragging')
  if (!had || multi || dragged > slop || button !== 0 || !running) return

  if (e.pointerType === 'touch') {
    // No hover on a touchscreen, so the first tap aims and the second lays.
    // Anywhere on the ghost counts as the same spot — asking for the same kite
    // twice is a two-millimetre target on a phone.
    const hit = garden.pick(...ndc(e.clientX, e.clientY))
    if (!hover || !hit || !hover.fits[hover.index].cells.includes(hit.cell)) {
      aimNear(e.clientX, e.clientY)
      return
    }
  }
  commit()
}

canvas.addEventListener('pointerup', endPointer)
canvas.addEventListener('pointercancel', endPointer)

canvas.addEventListener('contextmenu', (e) => e.preventDefault())

// A mouse wheel sends one big notch; a trackpad sends a stream of small ones,
// and a fixed factor per event made two fingers on a trackpad rocket in and out.
// Zoom follows how far the wheel actually turned instead, in the units the event
// says it is using.
const WHEEL_LINE = 16
const WHEEL_PAGE = 400
function wheelPixels(e) {
  if (e.deltaMode === 1) return e.deltaY * WHEEL_LINE
  if (e.deltaMode === 2) return e.deltaY * WHEEL_PAGE
  return e.deltaY
}

let cycledAt = 0

canvas.addEventListener(
  'wheel',
  (e) => {
    e.preventDefault()
    const dy = wheelPixels(e)
    if (e.shiftKey || e.ctrlKey || !hover) {
      garden.zoom(Math.exp(Math.max(-120, Math.min(120, dy)) * 0.0016))
      return
    }
    // Cycling the fits is a discrete step, so a trackpad's fifty little events
    // per flick have to be collapsed into one.
    const now = performance.now()
    if (Math.abs(dy) < 2 || now - cycledAt < 110) return
    cycledAt = now
    cycle(dy > 0 ? 1 : -1)
  },
  { passive: false },
)

addEventListener('keydown', (e) => {
  if (!running) return
  const k = e.key.toLowerCase()
  if (k === 'q') cycle(-1)
  else if (k === 'e' || k === ' ') cycle(1)
  else if (k === 'r') discard()
  else if (k === '+' || k === '=') garden.zoom(0.85)
  else if (k === '-') garden.zoom(1.18)
  else return
  e.preventDefault()
})

function discard() {
  if (!game.reroll()) return
  sticky = null
  clearHover()
  garden.setHints(hintPoints())
  syncHud()
}

// A phone's viewport moves under you — the URL bar slides away, the keyboard
// comes and goes, the thing gets turned sideways — and none of those fire a
// plain resize on every browser.
const fit = () => garden.resize(innerWidth, innerHeight)
addEventListener('resize', fit)
addEventListener('orientationchange', () => setTimeout(fit, 250))
visualViewport?.addEventListener('resize', fit)

// Tapping the stats puts the whole garden back in frame — the way out of
// having pinched yourself into a corner.
el('top').addEventListener('click', () => {
  garden.resetCamera()
  if (game) garden.frame(boundsOf(game))
})

// --- boot -------------------------------------------------------------------

function start(seed) {
  game = new Game(seed)
  sticky = null
  running = true
  clearHover()
  ambience.reset()
  garden.resetCamera()
  const [sx, sz] = cart(SUMMIT[0], SUMMIT[1])
  const dir = game.headwater?.dir
  garden.setMountain(sx * W, sz * W, dir ? Math.atan2(dir[1], dir[0]) : null)
  rebuild(true)
  syncHud()
  el('gameover').classList.add('hidden')
}

el('prev').addEventListener('click', () => cycle(-1))
el('next').addEventListener('click', () => cycle(1))
// the drawing of the tile turns it too — the obvious thing to poke at
el('tileart').addEventListener('click', () => cycle(1))
el('lay').addEventListener('click', commit)
el('toss').addEventListener('click', discard)
el('swap').addEventListener('click', () => {
  if (!game.swapNext()) return
  sticky = null
  clearHover()
  garden.setHints(hintPoints())
  syncHud()
})

el('play').addEventListener('click', () => {
  el('intro').remove()
  el('startbar').classList.add('hidden')
  start(((Math.random() * 1e9) | 0) + 1)
})
// Dismiss the card but leave the garden laying itself — worth having on its own,
// and it is how the gallery's thumbnail gets a shot with no card over it.
el('watch').addEventListener('click', () => {
  el('intro').remove()
  el('startbar').classList.remove('hidden')
})
el('startbar').addEventListener('click', () => {
  el('startbar').classList.add('hidden')
  start(((Math.random() * 1e9) | 0) + 1)
})
el('again').addEventListener('click', () => start((Math.random() * 1e9) | 0))

// --- attract mode -----------------------------------------------------------
//
// While the title card is up the garden lays itself, playing the same ranking
// the ghost uses. It shows the shape doing its trick before anyone has to read
// a word — and it is what the gallery thumbnail catches.

let demoAt = 0.6
const DEMO_TILES = 34

function demoStep() {
  if (!game || game.over || game.placed >= DEMO_TILES + 3) return
  const fits = game.fits
  if (!fits.length) return
  let best = null
  let bs = -Infinity
  for (const f of fits) {
    const h = game._harmony(f.o, f.cells, game.tile)
    const s = h.joins * 6 + h.match * 3 + h.touch + Math.random() * 2
    if (s > bs) {
      bs = s
      best = f
    }
  }
  const res = game.place(best)
  rebuild()
  garden.growTile(res.cells)
  for (const r of res.announce) garden.playFlash(flashGeometry(game.board.regionCells(r.root)))
  syncHud()
}

// A small handle on the running garden, for poking at it from the console.
window.aperiodicGarden = {
  get game() {
    return game
  },
  get hover() {
    return hover
  },
  get scene() {
    return garden
  },
  step: demoStep,
  restart: start,
  get ambience() {
    return ambience
  },
  /** After poking at game state by hand, put the scene and HUD back in step. */
  refresh: () => {
    rebuild()
    syncHud()
  },
}

garden.resize(innerWidth, innerHeight)
start(1741)
running = false
// Lay the first stretch of the demo garden in one go, so the title screen opens
// on something worth looking at — and so the gallery's thumbnail, shot a second
// or two after load, catches a garden rather than a bare peak.
for (let i = 0; i < 20; i++) demoStep()

let last = performance.now()
let clock = 0
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000)
  last = now
  clock += dt
  if (!running) {
    demoAt -= dt
    if (demoAt <= 0) {
      demoAt = 0.34
      demoStep()
    }
  }
  garden.updateCamera(dt)
  ambience.update(dt, clock, game)
  garden.render(dt, clock)
  requestAnimationFrame(frame)
}
requestAnimationFrame(frame)
