// Aperiodic Garden — wiring: game state ↔ scene ↔ pointer ↔ HUD.

import { Game, RECIPES, RESOURCES } from './src/game.js'
import { Garden } from './src/scene.js'
import { Ambience } from './src/ambient.js'
import { buildGarden, buildGhost, outlineRibbon, hubOf, branchPath, W, Buf } from './src/geometry.js'
import {
  KEY_A,
  KEY_B,
  KEY_K,
  ORIENT_KITES,
  PORT_SLOTS,
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
  const step = game.over ? null : game.suggestion
  garden.setBeacon(step ? hubOf(step.cells) : null)
  garden.setSites(
    game.sites.map((s) => ({ x: s.mid[0] * W, z: s.mid[1] * W, hx: s.hub[0] * W, hz: s.hub[1] * W, done: s.done })),
  )
}

// --- the tile card ----------------------------------------------------------

const artCtx = el('tileart').getContext('2d')
const nextCtx = el('nextart').getContext('2d')
const sparkCtx = el('tilesparkle').getContext('2d')

/**
 * The glitter over a special tile's drawing. Twenty-odd motes drifting up and
 * fading, on their own canvas over the art — the art is repainted on every
 * hover and would wipe anything drawn into it.
 */
const isSpecial = (tile) => !!(tile && (tile.camp || tile.crafted || tile.kind === 'confluence' || tile.lake))

const SPARKS = Array.from({ length: 22 }, (_, i) => ({
  x: (i * 37) % 100,
  y: (i * 61) % 100,
  ph: (i * 0.41) % 1,
  sp: 0.22 + ((i * 13) % 7) / 20,
  r: 1 + ((i * 7) % 5) * 0.5,
}))

function drawSparkle(t) {
  const c = sparkCtx
  const w = c.canvas.width
  const h = c.canvas.height
  c.clearRect(0, 0, w, h)
  if (!isSpecial(game?.tile)) return
  for (const s of SPARKS) {
    const k = (s.ph + t * s.sp) % 1
    const x = (s.x / 100) * w + Math.sin((k + s.ph) * 6.3) * 9
    const y = (1 - k) * h * 0.92 + (s.y / 100) * h * 0.08
    // brightest halfway up, gone at either end
    const a = Math.sin(k * Math.PI) ** 2
    if (a < 0.02) continue
    const r = s.r * (2 + a * 2.2)
    const g = c.createRadialGradient(x, y, 0, x, y, r * 3)
    g.addColorStop(0, `rgba(255,240,190,${0.9 * a})`)
    g.addColorStop(0.4, `rgba(255,198,90,${0.5 * a})`)
    g.addColorStop(1, 'rgba(255,198,90,0)')
    c.fillStyle = g
    c.beginPath()
    c.arc(x, y, r * 3, 0, Math.PI * 2)
    c.fill()
  }
}

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

  // And the stream running through it, drawn from the same path the garden uses.
  // A water works has no stream of its own until it is standing somewhere, so
  // its card shows all six crossings faintly and dashed: whichever of them are
  // there when you lay it, it takes.
  const slots = tile.adaptive ? PORT_SLOTS : [...tile.ports]
  if (slots.length) {
    const keys = placementKeys(orient, 0, 0)
    const hub = hubOf(keys)
    c.globalAlpha = tile.adaptive ? 0.45 : 1
    if (tile.adaptive) c.setLineDash([3.2 * lw, 3.2 * lw])
    for (const pass of [0, 1]) {
      c.strokeStyle = pass === 0 ? css(RIVER_BANK) : css(WATER_SHALLOW)
      c.lineWidth = (pass === 0 ? 4.1 : 2.3) * lw
      for (const slot of slots) {
        const path = branchPath(keys, orient, slot, hub)
        c.beginPath()
        path.forEach((p, j) => {
          const [x, y] = P([p[0] / W, p[1] / W])
          if (j === 0) c.moveTo(x, y)
          else c.lineTo(x, y)
        })
        c.stroke()
      }
      if (slots.length === 1 || tile.adaptive) {
        const [hx, hy] = P([hub[0] / W, hub[1] / W])
        c.beginPath()
        c.setLineDash([])
        c.arc(hx, hy, (pass === 0 ? 2.3 : 1.55) * lw, 0, Math.PI * 2)
        c.fillStyle = c.strokeStyle
        c.fill()
        if (tile.adaptive) c.setLineDash([3.2 * lw, 3.2 * lw])
      }
    }
    c.setLineDash([])
    c.globalAlpha = 1
  }
}

// --- hover ------------------------------------------------------------------

/**
 * Choose a spot from where the cursor is. If the exact kite under the pointer
 * has no legal placement over it, try its four neighbours nearest-first — so
 * hovering *near* a gap is enough, and the tile turns itself to suit.
 */
function setHover(hit, sx = 0, sy = 0) {
  if (!game || game.over || !hit) {
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
    if (aimAt(cell)) return
  }
  // Still nothing under the pointer. Rather than showing an empty hand, take
  // the nearest light — the same reach a finger gets, only tighter, because a
  // mouse is precise enough to mean the spot it is over. Hovering an inch from
  // a legal spot and being shown nothing is what makes the rules feel narrower
  // than they are.
  if (!aimNear(sx, sy, MOUSE_SNAP)) clearHover()
}

/** Take the best fit covering this cell, keeping the player's chosen turn if it
 *  is among them. */
function aimAt(cell) {
  const fits = game.fitsAtCell(cell)
  if (fits.length === 0) return false
  let index = 0
  if (sticky !== null) {
    const i = fits.findIndex((f) => f.o === sticky)
    if (i >= 0) index = i
  }
  hover = { cell, fits, index }
  showGhost()
  return true
}

/**
 * Aim from a tap. A fingertip covers about forty pixels of a phone screen and a
 * kite at overview zoom is smaller than that, so landing on one is luck. If
 * nothing legal is under the finger, take the nearest light instead — measured
 * on screen, because that is where the player is aiming.
 */
const snapRange = () => Math.max(110, Math.min(innerWidth, innerHeight) * 0.28)
const MOUSE_SNAP = 72

function aimNear(cx, cy, range = snapRange()) {
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
  if (!best || bd > range) return false
  return aimAt(best.cells[0])
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
  const g = buildGhost(fit.cells, game.tile, fit.o, fit.ports ?? game.tile.ports)
  g.rim = outlineRibbon(g.outline, 0.028, 0.022, GHOST_RIM)
  garden.setGhost(g)
  el('fitcount').textContent = hover.fits.length > 1 ? `${hover.index + 1}/${hover.fits.length}` : ''
  // How snugly it sits, and — because of a small theorem about the hat — which
  // way round the piece must be. Of the 38 ways one hat can touch another,
  // every four-edge fit is a mirrored pair and every three-edge fit is not.
  // What this spot is worth, not what it is allowed to be. Covers never have to
  // agree — the old line only ever mentioned how flush the fit was, which read
  // as a condition being met rather than a bonus being earned.
  const c = el('contact')
  const worth = fit.match * 3 + fit.joins * 6 + (fit.touch > 0 && fit.match === fit.touch ? 12 : 0)
  const parts = []
  if (fit.joins > 0) parts.push(`${fit.joins} stream${fit.joins > 1 ? 's' : ''} carried on`)
  if (fit.match > 0) parts.push(`${fit.match} of ${fit.touch} edges agree`)
  else if (fit.touch > 0) parts.push(`${fit.touch} edge${fit.touch > 1 ? 's' : ''} met, none agree`)
  else parts.push('standing on its own')
  c.textContent = worth > 0 ? `${parts.join(' · ')} · +${worth}` : parts.join(' · ')
  c.classList.toggle('flush', fit.touch > 0 && fit.match === fit.touch)
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
  if (res.harvest) {
    // one over each building that just paid out, so it is obvious where the
    // resources are coming from
    game.works.forEach((w, i) => {
      const glyph = RESOURCES.find((x) => x.key === w.resource)?.glyph ?? '·'
      pop([w.at[0] * W, 0.5, w.at[1] * W], `${glyph}+1`, false, 0.1 + i * 0.06)
    })
  }
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

// --- the workshop -----------------------------------------------------------
//
// The other half of the game: what the buildings make, and what it buys. Built
// once from the recipe table; only the counts and the enabled state change.

const recipeButtons = RECIPES.map((r) => {
  const b = document.createElement('button')
  b.className = 'recipe'
  b.title = r.note
  b.innerHTML = `<b></b><span class="cost"></span>`
  b.querySelector('b').textContent = r.title
  b.addEventListener('click', () => {
    if (!game || !game.craft(r.key)) return
    handChanged()
  })
  el('recipes').appendChild(b)
  return { r, b }
})

const glyphOf = Object.fromEntries(RESOURCES.map((x) => [x.key, x.glyph]))

function syncShop() {
  const shop = el('shop')
  // nothing to spend and nothing making it: no shop
  if (!game.works.length && !Object.values(game.res).some((n) => n > 0)) {
    shop.classList.add('hidden')
    return
  }
  shop.classList.remove('hidden')
  el('purse').textContent = RESOURCES.filter((x) => game.res[x.key] > 0)
    .map((x) => `${x.glyph}${game.res[x.key]}`)
    .join('  ')
  for (const { r, b } of recipeButtons) {
    const cost = game.costOf(r)
    b.querySelector('.cost').textContent = Object.entries(cost)
      .map(([k, n]) => `${glyphOf[k]}${n}`)
      .join(' ')
    b.disabled = game.over || !game.affordable(r)
  }
}

function syncHud() {
  syncShop()
  el('score').textContent = game.score.toLocaleString()
  el('tiles').textContent = Math.max(0, game.tilesLeft)
  el('sealed').textContent = game.sealedCount
  const big = game.biggestOpen()
  el('growing').textContent = big && big.size > 2 ? `${big.size} · ${BIOME_NAME[big.biome]}` : '—'
  el('tilekind').textContent = tileLabel(game.tile)
  el('tilecard').classList.toggle('special', isSpecial(game.tile))

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
  syncLog()
  drawTileCard(hover ? hover.fits[hover.index].o : 0)
}

// --- the log ----------------------------------------------------------------
//
// Two views of the same list. Anything that has happened since the HUD last
// looked is announced as a toast over the garden and then taken away again,
// because a score you have already read is clutter sitting on top of the thing
// you are trying to look at. The whole run stays in a log you can open, so
// nothing is actually lost by letting the toasts go.

const TOAST_LIFE = 3400
const TOAST_FADE = 550
let shownId = 0

function syncLog() {
  const feed = el('feed')
  // oldest first, so several events from one placement stack in the order they
  // happened rather than upside down
  const fresh = game.log.filter((e) => e.id > shownId).reverse()
  for (const e of fresh) {
    shownId = Math.max(shownId, e.id)
    const d = document.createElement('div')
    d.textContent = e.text
    feed.appendChild(d)
    setTimeout(() => {
      d.classList.add('going')
      setTimeout(() => d.remove(), TOAST_FADE)
    }, TOAST_LIFE)
  }
  el('historycount').textContent = game.log.length
  if (fresh.length && !el('history').classList.contains('shut')) drawHistory()
}

function drawHistory() {
  const list = el('historylist')
  list.textContent = ''
  if (!game.log.length) {
    const li = document.createElement('li')
    li.className = 'empty'
    li.textContent = 'nothing has scored yet'
    list.appendChild(li)
    return
  }
  for (const e of game.log) {
    const li = document.createElement('li')
    li.textContent = e.text
    list.appendChild(li)
  }
}

function tileLabel(tile) {
  if (!tile) return ''
  if (tile.adaptive) return 'water works · joins every stream it touches'
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
  setHover(garden.pick(...ndc(e.clientX, e.clientY)), e.clientX, e.clientY)
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
      setHover(hit, e.clientX, e.clientY)
      if (!hover) aimNear(e.clientX, e.clientY)
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
  else if (k === 'l') toggleHistory()
  else if (k === '+' || k === '=') garden.zoom(0.85)
  else if (k === '-') garden.zoom(1.18)
  else return
  e.preventDefault()
})

function discard() {
  if (!game.reroll()) return
  handChanged()
}

/** The tile in hand has been swapped, crafted or thrown away: the lights, the
 *  errand's beacon and the card all describe a different piece now. */
function handChanged() {
  sticky = null
  clearHover()
  garden.setHints(hintPoints())
  const step = game.suggestion
  garden.setBeacon(step ? hubOf(step.cells) : null)
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

const toggleHistory = () => {
  const shut = el('history').classList.toggle('shut')
  if (!shut) drawHistory()
}
el('historytoggle').addEventListener('click', toggleHistory)

// --- boot -------------------------------------------------------------------

function start(seed) {
  game = new Game(seed)
  sticky = null
  running = true
  // a new garden starts with an empty slate in both views of the log
  shownId = 0
  el('feed').textContent = ''
  el('history').classList.add('shut')
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
  handChanged()
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
  drawSparkle(clock)
  requestAnimationFrame(frame)
}
requestAnimationFrame(frame)
