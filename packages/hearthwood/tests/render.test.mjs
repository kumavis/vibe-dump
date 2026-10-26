// Render module tests (render owner). Node has no canvas, so these run against a recording
// fake canvas that also validates arguments the real Canvas 2D API would reject (NaN
// coordinates, negative radii, zero-size drawImage sources, bad colour-stop offsets).
// The sim state is a hand-built fake ctx with the documented pool/world fields only.
import { test } from 'node:test'
import assert from 'node:assert/strict'

import {
  CHUNK, TILE, MINIMAP_REFRESH_TICKS, BUILDING_COUNT, UNIT_COUNT, ITEM_COUNT, RES_COUNT, TERRAIN_COUNT,
  B_HEARTH, B_SAWMILL, B_LUMBER_LODGE, B_WARD_TOWER, B_FORGE, B_STOREHOUSE,
  U_COURIER, U_WARDEN, U_CRAWLER, F_PLAYER, F_BLIGHT, M_MOVING, M_IDLE,
  R_TREE, R_STONE, T_WATER, T_CLIFF, I_WOOD, ITEM_SHIFT, ITEM_STRIDE,
  FX_ARROW, FX_BOLT, FX_HIT, FX_DEATH, FX_BUILD, FX_DESTROY, FX_SPAWN,
  BS_STARVED, P_OK, P_BLOCKED, zoomTier, ZOOM_TIER_NEAR, ZOOM_TIER_MID, ZOOM_TIER_FAR,
} from '../src/constants.js'
import { B_W, B_H, B_HP, U_HP } from '../src/content.js'
import { FxRing } from '../src/fx.js'
import { createOverlay } from '../src/overlay.js'
import {
  bakeSprites, setCanvasFactory, itemIconURL, buildingIconURL, UNIT_FRAMES, ICON_PX, RES_VARIANTS, TERRAIN_VARIANTS,
} from '../src/sprites.js'
import { Renderer, createRenderer, visibleChunks, nightFactor, DAY_TICKS } from '../src/render.js'
import { Minimap, createMinimap } from '../src/minimap.js'
import { TerrainCache, TIER_PPT } from '../src/render-chunks.js'

// ---------------------------------------------------------------- fake canvas
function makeFactory() {
  const f = { created: 0, errors: [], calls: Object.create(null), record: false, ops: [] }
  const mk = (w, h) => {
    f.created++
    const c = { width: w, height: h, _g: null, getContext() { return this._g || (this._g = fakeG(this, f)) } }
    return c
  }
  f.mk = mk
  return f
}
const NUMERIC_CHECK = new Set(['fillRect', 'strokeRect', 'clearRect', 'rect', 'moveTo', 'lineTo', 'arc', 'arcTo', 'ellipse',
  'quadraticCurveTo', 'bezierCurveTo', 'translate', 'scale', 'rotate', 'setTransform', 'putImageData'])
function fakeG(canvas, f) {
  const state = {
    canvas, fillStyle: '#000', strokeStyle: '#000', lineWidth: 1, globalAlpha: 1, globalCompositeOperation: 'source-over',
    imageSmoothingEnabled: true, lineCap: 'butt', lineJoin: 'miter', font: '', textAlign: 'left',
  }
  const bad = (m, args) => { if (f.errors.length < 20) f.errors.push(m + '(' + args.map(String).join(',') + ')') }
  const handler = {
    get(t, p) {
      if (p in t) return t[p]
      if (typeof p !== 'string') return undefined
      if (p === 'createLinearGradient' || p === 'createRadialGradient') {
        return (...a) => {
          for (const v of a) if (!Number.isFinite(v)) bad(p, a)
          if (p === 'createRadialGradient' && (a[2] < 0 || a[5] < 0)) bad(p, a)
          return { addColorStop(o, c) { if (!(o >= 0 && o <= 1) || typeof c !== 'string') bad('addColorStop', [o, c]) } }
        }
      }
      if (p === 'createImageData' || p === 'getImageData') {
        return (a, b, c, d) => {
          const w = p === 'createImageData' ? a : c, h = p === 'createImageData' ? b : d
          return { width: w, height: h, data: new Uint8ClampedArray(w * h * 4) }
        }
      }
      if (p === 'measureText') return () => ({ width: 0 })
      return (...a) => {
        f.calls[p] = (f.calls[p] || 0) + 1
        if (f.record) f.ops.push(p, a.map((v) => (typeof v === 'number' ? Math.round(v * 1000) / 1000 : typeof v)))
        if (f.onCall) f.onCall(p, a, canvas)
        if (NUMERIC_CHECK.has(p)) for (const v of a) if (typeof v === 'number' && !Number.isFinite(v)) bad(p, a)
        if (p === 'arc' && a[2] < 0) bad(p, a)
        if (p === 'ellipse' && (a[2] < 0 || a[3] < 0)) bad(p, a)
        if (p === 'drawImage') {
          const src = a[0]
          if (!src || !(src.width > 0) || !(src.height > 0)) bad(p, ['bad source'])
          for (let i = 1; i < a.length; i++) if (!Number.isFinite(a[i])) bad(p, a.slice(1))
        }
        if (p === 'setLineDash' && !Array.isArray(a[0])) bad(p, a)
      }
    },
    set(t, p, v) { t[p] = v; return true },
  }
  return new Proxy(state, handler)
}

// ---------------------------------------------------------------- fake sim state
function fakeCtx({ w = 128, h = 128, maxB = 256, maxU = 1024 } = {}) {
  const shift = Math.log2(w) | 0, chunksW = w / CHUNK, chunksH = h / CHUNK
  const world = {
    w, h, shift, mask: w - 1, size: w * h, chunksW, chunksH, chunkCount: chunksW * chunksH, seed: 7,
    terrain: new Uint8Array(w * h), res: new Uint8Array(w * h), resAmt: new Uint16Array(w * h),
    chunkVersion: new Uint32Array(chunksW * chunksH),
    tileX(i) { return i & (w - 1) }, tileY(i) { return i >> shift }, idx(x, y) { return (y << shift) | x },
    chunkOfXY(x, y) { return (y >> 5) * chunksW + (x >> 5) },
  }
  const B = {
    capacity: maxB, hi: 0, count: 0,
    alive: new Uint8Array(maxB), gen: new Uint16Array(maxB), type: new Uint8Array(maxB),
    tx: new Int16Array(maxB), ty: new Int16Array(maxB), w: new Uint8Array(maxB), h: new Uint8Array(maxB),
    door: new Int32Array(maxB).fill(-1), chunk: new Int32Array(maxB).fill(-1), hp: new Float32Array(maxB),
    status: new Uint8Array(maxB), paused: new Uint8Array(maxB), progress: new Int32Array(maxB),
    inv: new Int32Array(maxB * ITEM_STRIDE), invTotal: new Int32Array(maxB), rally: new Int32Array(maxB).fill(-1),
    chunkHead: new Int32Array(world.chunkCount).fill(-1), chunkNext: new Int32Array(maxB).fill(-1),
    isAlive(id, g) { return id >= 0 && this.alive[id] === 1 && this.gen[id] === g },
  }
  const U = {
    capacity: maxU, hi: 0, count: 0,
    alive: new Uint8Array(maxU), gen: new Uint16Array(maxU), type: new Uint8Array(maxU), faction: new Uint8Array(maxU),
    x: new Float32Array(maxU), y: new Float32Array(maxU), px: new Float32Array(maxU), py: new Float32Array(maxU),
    vx: new Float32Array(maxU), vy: new Float32Array(maxU), hp: new Float32Array(maxU), mstate: new Uint8Array(maxU),
    job: new Uint8Array(maxU), cargoItem: new Uint8Array(maxU), cargoQty: new Uint8Array(maxU),
    path: new Array(maxU).fill(null), pathIdx: new Int32Array(maxU),
    isAlive(id, g) { return id >= 0 && this.alive[id] === 1 && this.gen[id] === g },
  }
  // naive superset grid (render must re-check alive and position itself)
  const unitGrid = {
    count: 0, cellSize: 4,
    queryRect(x0, y0, x1, y1, out) {
      let k = 0
      for (let i = 0; i < U.hi && k < out.length; i++) if (U.alive[i]) out[k++] = i
      return k
    },
  }
  return { tick: 0, world, buildings: B, units: U, unitGrid, fx: new FxRing(), tier: 0 }
}
function addBuilding(ctx, type, tx, ty) {
  const B = ctx.buildings, b = B.hi++
  B.alive[b] = 1; B.type[b] = type; B.tx[b] = tx; B.ty[b] = ty; B.w[b] = B_W[type]; B.h[b] = B_H[type]
  B.hp[b] = B_HP[type]
  B.door[b] = ctx.world.idx(tx + (B_W[type] >> 1), ty + B_H[type])
  const c = ctx.world.chunkOfXY(tx, ty)
  B.chunkNext[b] = B.chunkHead[c]; B.chunkHead[c] = b; B.chunk[b] = c
  B.count++
  return b
}
function addUnit(ctx, type, x, y, faction = F_PLAYER) {
  const U = ctx.units, u = U.hi++
  U.alive[u] = 1; U.type[u] = type; U.faction[u] = faction
  U.x[u] = U.px[u] = x; U.y[u] = U.py[u] = y; U.hp[u] = U_HP[type]
  U.count++
  ctx.unitGrid.count = U.count
  return u
}
function fakeCamera(x, y, zoom, viewW = 800, viewH = 600, dpr = 1) {
  return {
    x, y, zoom, viewW, viewH, dpr,
    get scale() { return TILE * this.zoom },
    get tier() { return zoomTier(this.zoom) },
    visibleRect(out) {
      const hw = this.viewW * 0.5 / this.scale, hh = this.viewH * 0.5 / this.scale
      out.x0 = this.x - hw; out.y0 = this.y - hh; out.x1 = this.x + hw; out.y1 = this.y + hh
      return out
    },
  }
}
function scene() {
  const ctx = fakeCtx()
  const W = ctx.world
  for (let y = 20; y < 26; y++) for (let x = 70; x < 76; x++) { W.res[W.idx(x, y)] = R_TREE; W.resAmt[W.idx(x, y)] = 40 }
  for (let y = 70; y < 74; y++) for (let x = 50; x < 55; x++) { W.res[W.idx(x, y)] = R_STONE; W.resAmt[W.idx(x, y)] = 80 }
  for (let y = 40; y < 44; y++) for (let x = 40; x < 48; x++) W.terrain[W.idx(x, y)] = T_WATER
  for (let x = 80; x < 90; x++) W.terrain[W.idx(x, 60)] = T_CLIFF
  const hearth = addBuilding(ctx, B_HEARTH, 63, 63)
  const lodge = addBuilding(ctx, B_LUMBER_LODGE, 68, 58)
  const mill = addBuilding(ctx, B_SAWMILL, 58, 61)
  const tower = addBuilding(ctx, B_WARD_TOWER, 66, 70)
  const forge = addBuilding(ctx, B_FORGE, 60, 66)
  const far = addBuilding(ctx, B_STOREHOUSE, 5, 5) // off-screen at near zoom
  ctx.buildings.status[mill] = BS_STARVED
  ctx.buildings.progress[forge] = 10
  ctx.buildings.hp[tower] = B_HP[B_WARD_TOWER] * 0.4
  ctx.buildings.inv[(lodge << ITEM_SHIFT) | I_WOOD] = 7
  ctx.buildings.invTotal[hearth] = 120
  const c1 = addUnit(ctx, U_COURIER, 64.5, 67.5)
  ctx.units.x[c1] = 65.5; ctx.units.vx[c1] = 0.11; ctx.units.mstate[c1] = M_MOVING
  ctx.units.cargoItem[c1] = I_WOOD; ctx.units.cargoQty[c1] = 5
  const wd = addUnit(ctx, U_WARDEN, 62.5, 69.5)
  ctx.units.hp[wd] = 30
  ctx.units.path[wd] = Int32Array.of(W.idx(62, 69), W.idx(63, 70), W.idx(64, 71))
  ctx.units.pathIdx[wd] = 1
  const cr = addUnit(ctx, U_CRAWLER, 70.5, 68.5, F_BLIGHT)
  const off = addUnit(ctx, U_WARDEN, 5.5, 120.5)
  ctx.tick = 40
  ctx.fx.emit(FX_ARROW, 62.5, 69.5, 70.5, 68.5, 38)
  ctx.fx.emit(FX_BOLT, 70.5, 68.5, 62.5, 69.5, 38)
  ctx.fx.emit(FX_HIT, 0, 0, 70.5, 68.5, 39)
  ctx.fx.emit(FX_DEATH, 66, 66, 66, 66, 37)
  ctx.fx.emit(FX_BUILD, 64.5, 64.5, 64.5, 64.5, 30)
  ctx.fx.emit(FX_DESTROY, 60, 60, 60, 60, 30)
  ctx.fx.emit(FX_SPAWN, 64.5, 66.5, 64.5, 66.5, 35)
  ctx.fx.emit(FX_ARROW, 1, 1, 2, 2, 0) // long expired
  return { ctx, ids: { hearth, lodge, mill, tower, forge, far, c1, wd, cr, off } }
}

function newRenderer(f, opts = {}) {
  const canvas = f.mk(1, 1)
  const r = new Renderer(canvas, { makeCanvas: f.mk, ppt: 32, bakeMs: 1e9, ...opts })
  r.resize(800, 600, 1)
  return r
}

// ---------------------------------------------------------------- sprites
test('bakeSprites builds a complete, valid sprite set', () => {
  const f = makeFactory()
  const s = bakeSprites({ ppt: 32, makeCanvas: f.mk })
  assert.deepEqual(f.errors, [])
  assert.equal(s.ppt, 32)
  for (let t = 1; t < BUILDING_COUNT; t++) {
    const c = s.buildings[t]
    assert.ok(c, 'building ' + t)
    assert.equal(c.width, B_W[t] * 32)
    assert.ok(s.buildingOver[t] > 0)
    assert.equal(c.height, Math.round((B_H[t] + s.buildingOver[t]) * 32))
    assert.ok(s.buildingsMid[t].width < c.width)
  }
  for (let t = 1; t < UNIT_COUNT; t++) {
    assert.equal(s.units[t].length, UNIT_FRAMES)
    assert.equal(s.unitsFlip[t].length, UNIT_FRAMES)
  }
  for (let i = 1; i < ITEM_COUNT; i++) assert.ok(s.items[i].width >= ICON_PX)
  for (let r = 1; r < RES_COUNT; r++) assert.equal(s.resources[r].length, RES_VARIANTS)
  assert.equal(s.terrain.length, TERRAIN_COUNT)
  for (let t = 0; t < TERRAIN_COUNT; t++) assert.equal(s.terrain[t].length, TERRAIN_VARIANTS)
  for (const k of ['glow', 'shadow', 'selectRing', 'selectRingEnemy', 'smoke', 'spark', 'puff', 'bolt', 'firefly']) assert.ok(s[k], k)
  assert.equal(s.glows.length, 6)
  assert.ok(s.status[BS_STARVED])
  assert.ok(f.calls.fill > 100 && f.calls.drawImage === undefined, 'procedural paths, no image sources')
})

test('bakeSprites is deterministic', () => {
  const a = makeFactory(); a.record = true
  bakeSprites({ ppt: 16, makeCanvas: a.mk })
  const b = makeFactory(); b.record = true
  bakeSprites({ ppt: 16, makeCanvas: b.mk })
  assert.ok(a.ops.length > 1000)
  assert.deepEqual(a.ops, b.ops)
})

test('HUD icon URLs return empty strings without a DOM', () => {
  assert.equal(typeof document, 'undefined')
  assert.equal(itemIconURL(I_WOOD), '')
  assert.equal(buildingIconURL(B_HEARTH, 40), '')
})

// ---------------------------------------------------------------- pure math
test('visibleChunks clamps to the world and reports empty views', () => {
  const out = {}
  assert.equal(visibleChunks({ x0: -10, y0: -10, x1: 40, y1: 33 }, 4, 4, out), true)
  assert.deepEqual(out, { cx0: 0, cy0: 0, cx1: 1, cy1: 1 })
  assert.equal(visibleChunks({ x0: 100, y0: 100, x1: 300, y1: 300 }, 4, 4, out), true)
  assert.deepEqual(out, { cx0: 3, cy0: 3, cx1: 3, cy1: 3 })
  assert.equal(visibleChunks({ x0: 200, y0: 0, x1: 300, y1: 10 }, 4, 4, out), false)
})

test('nightFactor starts at day, peaks at half a cycle', () => {
  assert.equal(nightFactor(0), 0)
  assert.ok(Math.abs(nightFactor(DAY_TICKS / 2) - 1) < 1e-9)
  assert.equal(nightFactor(DAY_TICKS / 8), 0)
  assert.ok(nightFactor((DAY_TICKS * 3) / 8) > 0.5)
})

// ---------------------------------------------------------------- renderer
test('resize sets the backing store from CSS size * dpr', () => {
  const f = makeFactory()
  const r = newRenderer(f)
  r.resize(640, 360, 2)
  assert.equal(r.canvas.width, 1280)
  assert.equal(r.canvas.height, 720)
  assert.equal(r.dpr, 2)
  r.resize(333.3, 100, 1.5)
  assert.equal(r.canvas.width, 500)
  assert.equal(r.canvas.height, 150)
})

test('draw renders every tier without invalid canvas calls and culls to the view', () => {
  const f = makeFactory()
  const r = createRenderer(f.mk(1, 1), { makeCanvas: f.mk, ppt: 32, bakeMs: 1e9 })
  r.resize(800, 600, 1)
  const { ctx } = scene()
  const ov = createOverlay(64)
  ov.sel[0] = 1; ov.selGen[0] = 0; ov.selCount = 1
  ov.selBuilding = 0; ov.hoverBuilding = 1; ov.hoverUnit = 2
  ov.ghostType = B_LUMBER_LODGE; ov.ghostTx = 72; ov.ghostTy = 26; ov.ghostReason = P_OK
  ov.dragActive = true; ov.dragX0 = 60; ov.dragY0 = 60; ov.dragX1 = 66; ov.dragY1 = 68
  ov.pingTick = 38; ov.pingX = 64; ov.pingY = 64; ov.attackMoveArmed = 1; ov.cursorX = 65; ov.cursorY = 65
  ov.showGrid = true; ov.showPaths = true
  ov.sel[1] = 1; ov.selGen[1] = 0; ov.sel[0] = 0; ov.selCount = 2 // courier + warden (path)
  for (const zoom of [1, 0.45, 0.125]) {
    const cam = fakeCamera(64, 64, zoom)
    r.draw(cam, ctx, 0.5, ov)
    assert.deepEqual(f.errors, [], 'zoom ' + zoom)
    const st = r.stats
    assert.ok(st.chunksDrawn > 0)
    assert.ok(st.frameMs >= 0)
    if (zoom === 1) {
      // 800x600 at 32 px/tile = 25x18.75 tiles around (64,64): the storehouse at (5,5) and the warden at (5.5,120.5) are off-screen
      assert.equal(st.buildingsDrawn, 5)
      assert.equal(st.unitsDrawn, 3)
      assert.ok(st.fxDrawn >= 6, 'fx ' + st.fxDrawn)
    }
    if (zoom === 0.125) {
      assert.equal(st.buildingsDrawn, 6)
      assert.equal(st.unitsDrawn, 4)
    }
  }
  ov.ghostReason = P_BLOCKED
  r.draw(fakeCamera(64, 64, 1), ctx, 0, ov)
  r.draw(fakeCamera(64, 64, 1), ctx, 0, null)
  assert.deepEqual(f.errors, [])
})

test('buildings are drawn in footprint-bottom order', () => {
  const f = makeFactory()
  const r = newRenderer(f)
  const ctx = fakeCtx()
  // insert out of order across two chunks
  addBuilding(ctx, B_SAWMILL, 30, 40) // bottom 42
  addBuilding(ctx, B_HEARTH, 33, 36) // bottom 39
  addBuilding(ctx, B_WARD_TOWER, 28, 44) // bottom 45
  addBuilding(ctx, B_STOREHOUSE, 35, 40) // bottom 42, higher id
  r.draw(fakeCamera(32, 40, 1), ctx, 0, createOverlay(4))
  const order = Array.from(r._bSorted.subarray(0, r._bCount))
  assert.deepEqual(order, [1, 0, 3, 2])
})

test('units are interpolated with alpha and mirrored by facing', () => {
  const f = makeFactory()
  const r = newRenderer(f, { dayNight: false })
  const ctx = fakeCtx()
  const u = addUnit(ctx, U_WARDEN, 10.5, 10.5)
  ctx.units.x[u] = 11.5; ctx.units.vx[u] = -0.1; ctx.units.mstate[u] = M_IDLE
  const cam = fakeCamera(10, 10, 1)
  const hits = []
  const frames = new Set(r.sprites.units[U_WARDEN]), flipped = new Set(r.sprites.unitsFlip[U_WARDEN])
  f.onCall = (p, a) => { if (p === 'drawImage' && (frames.has(a[0]) || flipped.has(a[0]))) hits.push({ flip: flipped.has(a[0]), x: a[1], w: a[3] }) }
  r.draw(cam, ctx, 0.25, null)
  f.onCall = null
  assert.equal(hits.length, 1)
  const S = 32, ox = 400 - 10 * S
  assert.ok(Math.abs(hits[0].x + hits[0].w / 2 - (10.75 * S + ox)) < 1e-6)
  assert.equal(hits[0].flip, true)
})

test('terrain chunks are cached per tier and re-baked only when a version key changes', () => {
  const f = makeFactory()
  const r = newRenderer(f)
  const { ctx } = scene()
  const cam = fakeCamera(64, 64, 1)
  r.draw(cam, ctx, 0, null)
  const first = r.stats.chunksBaked
  assert.ok(first > 0)
  r.draw(cam, ctx, 0, null)
  assert.equal(r.stats.chunksBaked, 0)
  // a tree is felled in chunk (2,2): that chunk and its 4 visible neighbours re-key
  ctx.world.chunkVersion[2 * 4 + 2]++
  r.draw(cam, ctx, 0, null)
  assert.ok(r.stats.chunksBaked >= 1)
  r.draw(cam, ctx, 0, null)
  assert.equal(r.stats.chunksBaked, 0)
  // a different tier bakes its own canvases
  cam.zoom = 0.45
  r.draw(cam, ctx, 0, null)
  assert.ok(r.stats.chunksBaked > 0)
  assert.equal(r.terrain.fresh(2 * 4 + 2, ZOOM_TIER_MID, r.terrain.keyOf(10), r._frame) !== null, true)
})

test('steady-state frames create no new canvases', () => {
  const f = makeFactory()
  const r = newRenderer(f)
  const { ctx } = scene()
  const cam = fakeCamera(64, 64, 1)
  const ov = createOverlay(8)
  for (let i = 0; i < 5; i++) r.draw(cam, ctx, i / 5, ov)
  const before = f.created
  for (let i = 0; i < 100; i++) { ctx.tick++; r.draw(cam, ctx, (i % 10) / 10, ov) }
  assert.equal(f.created, before)
})

test('terrain cache honours its byte budget with LRU eviction', () => {
  const f = makeFactory()
  const nearBytes = (CHUNK * TIER_PPT[0]) ** 2 * 4
  const r = newRenderer(f, { cacheBudget: nearBytes * 4 })
  const ctx = fakeCtx({ w: 256, h: 256 })
  const cam = fakeCamera(16, 16, 1)
  for (let i = 0; i < 8; i++) {
    cam.x = 16 + i * 32; cam.y = 16 + (i & 1) * 32
    r.draw(cam, ctx, 0, null)
    assert.ok(r.terrain.bytes <= nearBytes * 4 + nearBytes * 4, 'bytes ' + r.terrain.bytes)
  }
  assert.ok(r.terrain.evictedTotal > 0)
})

test('a new ctx identity drops the cache and rebinds', () => {
  const f = makeFactory()
  const r = newRenderer(f)
  const a = scene().ctx
  const cam = fakeCamera(64, 64, 1)
  r.draw(cam, a, 0, null)
  r.draw(cam, a, 0, null)
  assert.equal(r.stats.chunksBaked, 0)
  const b = scene().ctx
  r.draw(cam, b, 0, null)
  assert.ok(r.stats.chunksBaked > 0)
  r.invalidateAll()
  r.draw(cam, b, 0, null)
  assert.ok(r.stats.chunksBaked > 0)
  assert.deepEqual(f.errors, [])
})

test('TerrainCache key includes neighbour versions', () => {
  const f = makeFactory()
  const spr = bakeSprites({ ppt: 16, makeCanvas: f.mk })
  const tc = new TerrainCache(spr, f.mk)
  const ctx = fakeCtx()
  tc.bind(ctx.world)
  const k0 = tc.keyOf(5)
  ctx.world.chunkVersion[9]++ // chunk below 5 in a 4-wide grid
  assert.notEqual(tc.keyOf(5), k0)
  const k1 = tc.keyOf(5)
  ctx.world.chunkVersion[15]++ // diagonal-far chunk: no effect
  assert.equal(tc.keyOf(5), k1)
})

// ---------------------------------------------------------------- minimap
test('minimap refreshes on cadence, plots buildings/units and maps clicks', () => {
  const f = makeFactory()
  setCanvasFactory(f.mk)
  try {
    const canvas = f.mk(192, 192)
    const mm = createMinimap(canvas, 128, 128)
    assert.ok(mm instanceof Minimap)
    const { ctx, ids } = scene()
    assert.equal(mm.update(ctx), true)
    assert.equal(mm.update(ctx), false)
    ctx.tick += MINIMAP_REFRESH_TICKS - 1
    assert.equal(mm.update(ctx), false)
    ctx.tick += 1
    assert.equal(mm.update(ctx), true)
    assert.equal(mm.update(ctx, true), true)
    const S = 192, k = S / 128
    const px = (x, y) => mm.pixels[Math.floor(y * k) * S + Math.floor(x * k)]
    const grass = px(100, 100)
    assert.notEqual(px(64.5, 64.5), grass, 'hearth plotted')
    assert.notEqual(px(70.5, 68.5), grass, 'blight plotted')
    assert.notEqual(px(42, 41), grass, 'water differs from grass')
    // terrain change: only after the chunk version bumps
    const W = ctx.world
    W.terrain[W.idx(100, 100)] = T_WATER
    ctx.tick += MINIMAP_REFRESH_TICKS
    mm.update(ctx)
    assert.equal(px(100, 100), grass)
    W.chunkVersion[W.chunkOfXY(100, 100)]++
    mm.update(ctx, true)
    assert.notEqual(px(100.2, 100.2), grass)
    const waterSet = new Set([px(41, 41), px(42, 41), px(43, 41), px(44, 41), px(45, 42), px(46, 42)])
    assert.ok(waterSet.has(px(100.2, 100.2)), 'repainted as water')
    // draw strokes the view rectangle
    f.calls.strokeRect = 0
    mm.draw(fakeCamera(64, 64, 1))
    assert.ok(f.calls.strokeRect >= 1)
    assert.deepEqual(f.errors, [])
    // clicks
    const out = { x: 0, y: 0 }
    mm.toWorld(60, 60, 120, 120, out)
    assert.deepEqual(out, { x: 64, y: 64 })
    mm.toWorld(-5, 500, 120, 120, out)
    assert.deepEqual(out, { x: 0, y: 128 })
    void ids
  } finally {
    setCanvasFactory(null)
  }
})

test('minimap letterboxes non-square maps', () => {
  const f = makeFactory()
  setCanvasFactory(f.mk)
  try {
    const mm = new Minimap(f.mk(192, 192), 256, 128)
    const out = { x: 0, y: 0 }
    mm.toWorld(96, 96, 192, 192, out)
    assert.deepEqual(out, { x: 128, y: 64 })
    assert.equal(mm.oy, 48)
    const ctx = fakeCtx({ w: 256, h: 128 })
    assert.equal(mm.update(ctx), true)
    assert.equal(mm.pixels[0], mm.pixels[191], 'letterbox rows are background')
    assert.deepEqual(f.errors, [])
  } finally {
    setCanvasFactory(null)
  }
})

test('a felled tree is repainted in place: no chunk re-keys, only clipped patches', async () => {
  const { World } = await import('../src/world.js')
  const f = makeFactory()
  const spr = bakeSprites({ ppt: 32, makeCanvas: f.mk })
  const tc = new TerrainCache(spr, f.mk)
  const w = new World(128, 128)
  for (let y = 30; y < 36; y++) for (let x = 30; x < 36; x++) w.setResource(w.idx(x, y), R_TREE, 1)
  w.setTerrain(w.idx(34, 37), T_WATER)
  tc.bind(w)
  // bake every chunk at near + far
  for (let c = 0; c < w.chunkCount; c++) { tc.bake(c, ZOOM_TIER_NEAR, tc.keyOf(c), 1); tc.bake(c, ZOOM_TIER_FAR, tc.keyOf(c), 1) }
  const keys = []
  for (let c = 0; c < w.chunkCount; c++) keys.push(tc.keyOf(c))
  // deplete a tree on the chunk seam (x = 31 is the last column of chunk 0, y = 32 the first row of the next)
  assert.equal(w.takeResource(w.idx(31, 32), 1), 1)
  for (let c = 0; c < w.chunkCount; c++) assert.equal(tc.keyOf(c), keys[c], 'depletion does not re-key chunk ' + c)
  f.record = true; f.ops.length = 0
  tc.sync()
  assert.ok(tc.patchedTotal >= 3, 'own chunk + the neighbours the decal overhangs + far tier: ' + tc.patchedTotal)
  assert.ok(f.ops.includes('clip'))
  const draws = f.ops.filter((o) => o === 'drawImage').length
  assert.ok(draws < 200, 'patches draw a handful of tiles, not whole chunks: ' + draws)
  assert.deepEqual(f.errors, [])
  tc.sync() // idempotent
  assert.ok(tc.patchedTotal < 10)
  // a terrain change still re-keys (full re-bake path)
  w.setTerrain(w.idx(5, 5), T_WATER)
  assert.notEqual(tc.keyOf(0), keys[0])
})
