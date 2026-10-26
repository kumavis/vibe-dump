// Composition root (browser only). OWNER: app implementer. Contract: ARCHITECTURE.md §17.
// Wiring order: game (ctx: world -> pools -> systems, inside createContext) -> camera ->
// overlay -> renderer -> minimap -> input -> ui -> debug api -> frame loop.
//
// URL params: ?seed=123  ?size=512 (large map)  ?peaceful (no waves)  ?debug (perf line)
//             ?stress=2000,5000 (buildings,couriers after boot)

import { createGame, installDebugApi } from './game.js'
import { Camera } from './camera.js'
import { createOverlay } from './overlay.js'
import { createRenderer } from './render.js'
import { createMinimap } from './minimap.js'
import { createInput } from './input.js'
import { createUI } from './ui.js'
import { FallbackRenderer } from './app-fallback.js'
import { START } from './content.js'
import { MAP_W_LARGE, MAP_H_LARGE, MAP_W, MAP_H, B_HEARTH } from './constants.js'

function params() {
  const q = new URLSearchParams(location.search)
  const seed = q.has('seed') ? Number(q.get('seed')) >>> 0 : 20261026
  const large = q.get('size') === '512' || q.has('large')
  return {
    seed,
    w: large ? MAP_W_LARGE : MAP_W,
    h: large ? MAP_H_LARGE : MAP_H,
    waves: !q.has('peaceful'),
    debug: q.has('debug'),
    stress: q.get('stress'),
  }
}

/** Centre the camera on the Hearth (or the map start) at the START zoom. */
function frameHearth(game, camera) {
  const ctx = game.ctx
  const B = ctx.buildings
  camera.setZoom(START.cameraZoom || 1)
  if (B.typeCount[B_HEARTH] > 0) {
    const h = B.typeList[B_HEARTH][0]
    // nudge up a little so the hamlet (lodge/grove are north) sits above the build bar
    camera.centerOn(B.tx[h] + B.w[h] * 0.5, B.ty[h] + B.h[h] * 0.5 - 1)
  } else {
    const w = ctx.world
    camera.centerOn(w.tileX(w.start) + 0.5, w.tileY(w.start) + 0.5)
  }
}

function boot() {
  const p = params()
  const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('view'))
  const mini = /** @type {HTMLCanvasElement} */ (document.getElementById('minimap'))
  const game = createGame({ seed: p.seed, w: p.w, h: p.h, waves: p.waves })
  const { world } = game.ctx
  const camera = new Camera(world.w, world.h)
  const overlay = createOverlay()

  // Render module (may still be a stub while modules are developed in parallel).
  let renderer = null
  let fallback = null
  try { renderer = createRenderer(canvas) } catch (err) { console.warn('hearthwood: renderer unavailable', err) }
  const minimap = (() => { try { return createMinimap(mini, world.w, world.h) } catch (err) { console.warn(err); return null } })()
  let miniOk = !!minimap
  /** @type {FallbackRenderer|null} */
  let miniFallback = null
  const useFallback = (err) => {
    if (!fallback) {
      console.warn('hearthwood: using fallback renderer —', err && err.message)
      fallback = new FallbackRenderer(canvas)
      fallback.resize(camera.viewW, camera.viewH, camera.dpr)
    }
  }

  const hooks = {}
  const input = createInput(canvas, game, camera, overlay, hooks)
  const ui = createUI(document, game, input, overlay)
  hooks.onToast = (msg, kind) => ui.toast(msg, kind)
  hooks.onSelect = () => ui.markSelection && ui.markSelection()
  if (mini) input.attachMinimap(mini, minimap)
  input.showPerf = p.debug

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    camera.resize(window.innerWidth, window.innerHeight, dpr)
    if (renderer && !fallback) { try { renderer.resize(window.innerWidth, window.innerHeight, dpr) } catch (err) { useFallback(err) } }
    if (fallback) fallback.resize(window.innerWidth, window.innerHeight, dpr)
  }
  window.addEventListener('resize', resize)
  resize()
  frameHearth(game, camera)

  // A new ctx (reset) must drop render caches and re-frame the camera.
  game.onReset.push(() => {
    if (renderer) { try { renderer.invalidateAll() } catch (_) { /* stub */ } }
    if (fallback) fallback.invalidateAll()
    if (miniFallback) miniFallback.invalidateAll()
    if (minimap) { try { minimap.update(game.ctx, true) } catch (_) { /* stub */ } }
    frameHearth(game, camera)
  })

  const loop = { fps: 0, frameMs: 0, frames: 0 }
  input.loopStats = loop
  const api = installDebugApi(game, { renderer, camera, overlay, ui, minimap, input, loop })
  Object.defineProperty(api, 'fallback', { get: () => fallback })

  if (p.stress) {
    const [b, c] = p.stress.split(',').map((v) => Number(v) || 0)
    const r = api.stress({ buildings: b, couriers: c })
    console.info('hearthwood stress', r)
  }

  let last = performance.now()
  let fpsT = last, fpsN = 0
  const frame = (now) => {
    const dt = Math.min(250, Math.max(0, now - last))
    last = now
    const f0 = performance.now()
    input.update(dt / 1000)
    const alpha = game.advance(dt)
    const ctx = game.ctx
    if (!fallback && renderer) {
      try { renderer.draw(camera, ctx, alpha, overlay) } catch (err) { useFallback(err) }
    } else if (!fallback) useFallback(new Error('no renderer'))
    if (fallback) fallback.draw(camera, ctx, alpha, overlay)
    if (miniOk) {
      try { minimap.update(ctx); minimap.draw(camera) } catch (err) { console.warn('hearthwood: minimap fallback —', err.message); miniOk = false }
    }
    if (!miniOk && mini) {
      if (!miniFallback) miniFallback = new FallbackRenderer(mini) // only its minimap path is used
      if ((loop.frames & 7) === 0) miniFallback.drawMinimap(mini, camera, ctx)
    }
    ui.update()
    loop.frameMs = loop.frameMs * 0.9 + (performance.now() - f0) * 0.1
    loop.frames++
    fpsN++
    if (now - fpsT >= 500) { loop.fps = fpsN * 1000 / (now - fpsT); fpsN = 0; fpsT = now }
    requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)
}

if (typeof document !== 'undefined') try {
  boot()
} catch (err) {
  console.error(err)
  const pre = document.createElement('pre')
  pre.style.cssText = 'position:fixed;left:8px;bottom:8px;color:#ffb54a;z-index:99;white-space:pre-wrap'
  pre.textContent = String(err && err.stack || err)
  document.body.appendChild(pre)
}
