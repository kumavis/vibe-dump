// Composition root (browser only). OWNER: app implementer. Contract: ARCHITECTURE.md §17.
// The architect's skeleton shows the required wiring order; the owner fills details.

import { createGame, installDebugApi } from './game.js'
import { Camera } from './camera.js'
import { createOverlay } from './overlay.js'
import { createRenderer } from './render.js'
import { createMinimap } from './minimap.js'
import { createInput } from './input.js'
import { createUI } from './ui.js'

function boot() {
  const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('view'))
  const mini = /** @type {HTMLCanvasElement} */ (document.getElementById('minimap'))
  const game = createGame({ seed: 20261026 })
  const { world } = game.ctx
  const camera = new Camera(world.w, world.h)
  camera.centerOn(world.tileX(world.start) + 0.5, world.tileY(world.start) + 0.5)
  const overlay = createOverlay()
  const renderer = createRenderer(canvas)
  const minimap = createMinimap(mini, world.w, world.h)
  const input = createInput(canvas, game, camera, overlay)
  const ui = createUI(document, game, input, overlay)

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    camera.resize(window.innerWidth, window.innerHeight, dpr)
    renderer.resize(window.innerWidth, window.innerHeight, dpr)
  }
  window.addEventListener('resize', resize)
  resize()
  installDebugApi(game, { renderer, camera, overlay, ui, minimap })

  let last = performance.now()
  const frame = (now) => {
    const dt = Math.min(250, now - last)
    last = now
    input.update(dt / 1000)
    const alpha = game.advance(dt)
    renderer.draw(camera, game.ctx, alpha, overlay)
    minimap.update(game.ctx)
    minimap.draw(camera)
    ui.update()
    requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)
}

try {
  boot()
} catch (err) {
  console.error(err)
  const pre = document.createElement('pre')
  pre.style.cssText = 'position:fixed;left:8px;bottom:8px;color:#ffb54a;z-index:99;white-space:pre-wrap'
  pre.textContent = String(err && err.stack || err)
  document.body.appendChild(pre)
}
