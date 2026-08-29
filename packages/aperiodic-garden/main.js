// Aperiodic Garden — wiring: game state ↔ scene ↔ pointer ↔ HUD.

import { Game } from './src/game.js'
import { Garden } from './src/scene.js'
import { Ambience } from './src/ambient.js'
import { buildGarden, buildGhost, W, worldY, Buf } from './src/geometry.js'
import {
  KEY_A,
  KEY_B,
  KEY_K,
  ORIENT_KITES,
  orientOutline,
  kiteCentre,
  kiteCorners,
  cart,
  placementKeys,
} from './src/hat.js'
import { LOOK } from './src/palette.js'
import { BIOME_NAME } from './src/board.js'

const canvas = document.getElementById('scene')
const el = (id) => document.getElementById(id)

const garden = new Garden(canvas)
const ambience = new Ambience(garden.scene)

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
  let maxY = 0
  for (const key of g.board.filled) {
    const [x, z] = kiteCentre(KEY_A(key), KEY_B(key), KEY_K(key))
    if (x < minX) minX = x
    if (x > maxX) maxX = x
    if (z < minZ) minZ = z
    if (z > maxZ) maxZ = z
    const y = worldY(g.elev.get(key) ?? 0)
    if (y > maxY) maxY = y
  }
  const cx = ((minX + maxX) / 2) * W
  const cz = ((minZ + maxZ) / 2) * W
  const r = Math.max(maxX - minX, maxZ - minZ) * 0.5 * W + 0.7
  return { cx, cz, r, maxY }
}

function rebuild(instantFrame = false) {
  const bundle = buildGarden(game)
  const b = boundsOf(game)
  garden.setGarden(bundle, b)
  garden.frame(b, instantFrame)
  ambience.sync(game)
}

// --- the tile card ----------------------------------------------------------

const artCtx = el('tileart').getContext('2d')

function drawTileCard(orient) {
  const c = artCtx
  const wpx = c.canvas.width
  const hpx = c.canvas.height
  c.clearRect(0, 0, wpx, hpx)
  const tile = game.tile
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
  const pad = 14
  const s = Math.min((wpx - pad * 2) / (maxX - minX), (hpx - pad * 2) / (maxY - minY))
  const ox = (wpx - (maxX - minX) * s) / 2 - minX * s
  const oy = (hpx - (maxY - minY) * s) / 2 + maxY * s
  const P = ([x, y]) => [ox + x * s, oy - y * s]

  c.lineJoin = 'round'
  for (let i = 0; i < 8; i++) {
    const look = LOOK[tile.biomes[i]]
    c.beginPath()
    polys[i].forEach((p, j) => {
      const [x, y] = P(p)
      if (j === 0) c.moveTo(x, y)
      else c.lineTo(x, y)
    })
    c.closePath()
    c.fillStyle = '#' + look.top.toString(16).padStart(6, '0')
    c.fill()
    c.strokeStyle = 'rgba(255,255,255,0.32)'
    c.lineWidth = 1
    c.stroke()
  }
  // the hat's own outline, so its 13 sides are unmistakable
  c.beginPath()
  for (const poly of polys) {
    poly.forEach((p, j) => {
      const [x, y] = P(p)
      if (j === 0) c.moveTo(x, y)
      else c.lineTo(x, y)
    })
    c.closePath()
  }
  c.strokeStyle = 'rgba(40,52,60,0.14)'
  c.lineWidth = 1
  c.stroke()

  const outline = orientOutline(orient)
  c.beginPath()
  outline.forEach((p, j) => {
    const [x, y] = P(p)
    if (j === 0) c.moveTo(x, y)
    else c.lineTo(x, y)
  })
  c.closePath()
  c.strokeStyle = 'rgba(34,45,54,0.75)'
  c.lineWidth = 2.4
  c.stroke()
}


// --- hover ------------------------------------------------------------------

function setHover(cellKey) {
  if (!game || game.over) return
  if (cellKey === null) {
    hover = null
    garden.setGhost(null)
    return
  }
  const fits = game.fitsAtCell(cellKey)
  if (fits.length === 0) {
    hover = null
    garden.setGhost(null)
    el('fitcount').textContent = ''
    el('contact').textContent = ''
    return
  }
  let index = 0
  if (sticky !== null) {
    const i = fits.findIndex((f) => f.o === sticky)
    if (i >= 0) index = i
  }
  hover = { cell: cellKey, fits, index }
  showGhost()
}

function showGhost() {
  if (!hover) return
  const fit = hover.fits[hover.index]
  const cells = placementKeys(fit.o, fit.ta, fit.tb)
  garden.setGhost(buildGhost(cells, game.tile.biomes, game, 0.42))
  el('fitcount').textContent = hover.fits.length > 1 ? `${hover.index + 1}/${hover.fits.length}` : ''
  // How snugly it sits, and — because of a small theorem about the hat — which
  // way round the piece must be. Of the 38 ways one hat can touch another,
  // every four-edge fit is a mirrored pair and every three-edge fit is not.
  const c = el('contact')
  c.textContent =
    fit.touch === 0
      ? ''
      : fit.touch === 4
        ? 'flush ×4 · a mirrored fit'
        : fit.touch === 3
          ? 'flush ×3 · same hand'
          : `${fit.touch} edge${fit.touch > 1 ? 's' : ''} shared`
  c.classList.toggle('flush', fit.touch >= 3)
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
  const cells = placementKeys(fit.o, fit.ta, fit.tb)
  const res = game.place(fit)
  rebuild()

  const mid = centroidOf(cells)
  if (res.fitScore > 0) pop(mid, `+${res.fitScore}`, res.perfect)
  for (const r of res.announce) {
    const cells2 = game.board.regionCells(r.root)
    garden.playFlash(flashGeometry(cells2))
    pop(centroidOf(cells2), `${BIOME_NAME[r.biome]} +${r.score}`, true)
  }
  if (res.bonus > 0) pop(mid, `+${res.bonus} tiles`, false, 0.5)
  if (res.hollows.length) pop(centroidOf(res.hollows), 'a hidden hollow', false, 0.7)

  ambience.celebrate(res, game)
  hover = null
  garden.setGhost(null)
  syncHud()
  if (game.over) endGame()
}

function centroidOf(cells) {
  let x = 0
  let z = 0
  let y = -Infinity
  for (const key of cells) {
    const [cx, cz] = kiteCentre(KEY_A(key), KEY_B(key), KEY_K(key))
    x += cx
    z += cz
    y = Math.max(y, worldY(game.elev.get(key) ?? 0))
  }
  return [(x / cells.length) * W, y + 0.25, (z / cells.length) * W]
}

function flashGeometry(cells) {
  const buf = new Buf()
  for (const key of cells) {
    const a = KEY_A(key)
    const b = KEY_B(key)
    const k = KEY_K(key)
    const h = worldY(game.elev.get(key) ?? 0) + 0.02
    const p = kiteCorners(a, b, k).map(([u, v]) => {
      const [x, y] = cart(u, v)
      return [x * W, h, y * W]
    })
    buf.tri(p[0], p[2], p[1], 0xffffff, 0xffffff, 0xffffff)
    buf.tri(p[0], p[3], p[2], 0xffffff, 0xffffff, 0xffffff)
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
  const counts = new Map()
  for (const b of tile.biomes) counts.set(b, (counts.get(b) ?? 0) + 1)
  const parts = [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([b]) => BIOME_NAME[b])
  const kind = tile.kind === 'land' || tile.kind === 'fitted' ? '' : ` · ${tile.kind}`
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

let dragging = false
let dragged = 0
let lastX = 0
let lastY = 0
let button = 0

canvas.addEventListener('pointerdown', (e) => {
  dragging = true
  dragged = 0
  lastX = e.clientX
  lastY = e.clientY
  button = e.button
  canvas.setPointerCapture(e.pointerId)
})

canvas.addEventListener('pointermove', (e) => {
  if (dragging) {
    const dx = e.clientX - lastX
    const dy = e.clientY - lastY
    dragged += Math.abs(dx) + Math.abs(dy)
    lastX = e.clientX
    lastY = e.clientY
    if (dragged > 4) {
      document.body.classList.add('dragging')
      if (button === 2 || e.shiftKey) garden.pan(dx, dy)
      else garden.orbit(dx, dy)
    }
    return
  }
  if (!running) return
  const nx = (e.clientX / innerWidth) * 2 - 1
  const ny = -(e.clientY / innerHeight) * 2 + 1
  const hit = garden.pick(nx, ny, game)
  setHover(hit ? hit.cell : null)
})

canvas.addEventListener('pointerup', (e) => {
  dragging = false
  document.body.classList.remove('dragging')
  canvas.releasePointerCapture?.(e.pointerId)
  if (dragged > 4 || button !== 0 || !running) return
  if (e.pointerType === 'touch') {
    // No hover on a touchscreen, so the first tap aims and the second lays —
    // with the ⟲ ⟳ buttons in between if the fit wants turning.
    const nx = (e.clientX / innerWidth) * 2 - 1
    const ny = -(e.clientY / innerHeight) * 2 + 1
    const hit = garden.pick(nx, ny, game)
    if (!hit) return
    if (!hover || hover.cell !== hit.cell) {
      setHover(hit.cell)
      return
    }
  }
  commit()
})

canvas.addEventListener('contextmenu', (e) => e.preventDefault())

canvas.addEventListener(
  'wheel',
  (e) => {
    e.preventDefault()
    if (e.shiftKey || e.ctrlKey || !hover) {
      garden.zoom(e.deltaY > 0 ? 1.12 : 0.89)
    } else {
      cycle(e.deltaY > 0 ? 1 : -1)
    }
  },
  { passive: false },
)

addEventListener('keydown', (e) => {
  if (!running) return
  const k = e.key.toLowerCase()
  if (k === 'q') cycle(-1)
  else if (k === 'e' || k === ' ') cycle(1)
  else if (k === 'r') {
    if (game.reroll()) {
      sticky = null
      hover = null
      garden.setGhost(null)
      syncHud()
    }
  } else if (k === '+' || k === '=') garden.zoom(0.85)
  else if (k === '-') garden.zoom(1.18)
  else return
  e.preventDefault()
})

addEventListener('resize', () => garden.resize(innerWidth, innerHeight))

// --- boot -------------------------------------------------------------------

function start(seed) {
  game = new Game(seed)
  sticky = null
  hover = null
  running = true
  garden.setGhost(null)
  ambience.reset()
  rebuild(true)
  syncHud()
  el('gameover').classList.add('hidden')
}

el('prev').addEventListener('click', () => cycle(-1))
el('next').addEventListener('click', () => cycle(1))
el('toss').addEventListener('click', () => {
  if (game.reroll()) {
    sticky = null
    hover = null
    garden.setGhost(null)
    syncHud()
  }
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
// While the title card is up the garden lays itself, a hat every third of a
// second, playing the same harmony heuristic the ghost ranks fits by. It shows
// the shape doing its trick before anyone has to read a word — and it is what
// the gallery thumbnail catches.

let demoAt = 0.6
const DEMO_TILES = 30

function demoStep() {
  if (!game || game.over || game.placed >= DEMO_TILES + 3) return
  const fits = game.fits
  if (!fits.length) return
  let best = null
  let bs = -Infinity
  for (const f of fits) {
    const cells = placementKeys(f.o, f.ta, f.tb)
    const h = game._harmony(cells, game.tile.biomes)
    const s = h.match * 3 + h.touch + Math.random() * 2
    if (s > bs) {
      bs = s
      best = f
    }
  }
  const res = game.place(best)
  rebuild()
  for (const r of res.announce) {
    garden.playFlash(flashGeometry(game.board.regionCells(r.root)))
  }
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
}

garden.resize(innerWidth, innerHeight)
start(1741)
running = false
// Lay the first stretch of the demo garden in one go, so the title screen opens
// on something worth looking at — and so the gallery's thumbnail, which is shot
// a second or two after load, catches a garden rather than a bare peak.
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
