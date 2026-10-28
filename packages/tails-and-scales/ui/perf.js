// The perf overlay (V2): what a frame costs, to measure the figures on a
// phone. Switched in the page (the title's Perf overlay link, the battle's
// 📈 tool, ui/hud.js: kept in this browser, localStorage PERF_KEY) or on by
// ?perf (for development). Off, it costs nothing: the stage has no probe
// (view/stage.js) and nothing is written to the page. On, it is the stage's
// probe, handed each frame the table's render (renderer.info read right
// after it: its draw calls and triangles, the sun's shadow pass included)
// and the frame's start and end, and about twice a second it writes six
// short lines (about 30 characters: it fits a phone's corner) into one
// element:
//
//   fps            frames in the last second, and the time between them
//                  over that second, average and worst (what the eye sees:
//                  a GPU-bound frame is a long one with a short CPU time)
//   cpu, calls     a frame's own time on the main thread, average (the
//                  update, the render's submission, the race picker's
//                  windows); the table's last render's draw calls
//   tris, splats   its triangles (the shadow map's calls and triangles
//                  among them; ?lowfi, or the low quality: none), and the
//                  splats it drew (view/stats.js: the splat-fur Bushtails')
//                  of the most a frame draws (their budget, view/models/
//                  splat/splats.js: the quality's), when there is fur
//   px, dpr        the canvas's drawing buffer, the renderer's pixel ratio
//                  (the quality caps the device's; ?lowfi 0.5) and the
//                  device's, and the sun's shadow map (its size, or off)
//   quality        the stage's (view/stage.js), as chosen ('auto' says
//                  which it drew), ?lowfi over it; a tap steps it (▸)
//   figures        the figure style drawn (view/models/cache.js) and the
//                  milliseconds its figures took to build since the page
//                  loaded (view/stats.js: the title's armies are built
//                  before its first frame)
//
// It sits out of the way (style.css: on the right under the battle log on a
// wide screen, on the left under the roster's head on a phone, at the top
// over a phone's title and hidden over its battle-setup panel; inside the
// safe area; under a panel or a card that opens over it), takes no focus,
// and shows only when asked: a fresh browser (every sim/ harness's) has
// nothing kept, and under ?fast (nothing drawn) it never shows. A tap on it
// is the one thing it answers: the next quality (`quality.next()`, as the
// title's Quality), so a phone can try each in the middle of a battle.
import { drawStats } from '../view/stats.js'

export const PERF_KEY = 'tails-and-scales:perf'
// frames kept (a second at up to 240 fps)
const N = 240
const kilo = (n) => (n >= 1e5 ? `${Math.round(n / 1000)}k` : n >= 1e4 ? `${(n / 1000).toFixed(1)}k` : `${n}`)

export class PerfOverlay {
  // `stage` view/stage.js's; `el` the overlay's element; `style` the figure
  // style drawn; `quality` the page's ({ label(), listen(fn), next() }:
  // app/boot.js) or null; `params` the page's URL parameters (?perf);
  // `fast` ?fast's
  constructor({ stage, el, style, quality = null, params, fast = false }) {
    this.stage = stage
    this.el = el
    this.style = style
    this.quality = quality
    this.fast = fast
    if (quality) {
      el.title = 'Tap: the next quality'
      el.onclick = () => {
        quality.next()
        this.wrote = 0
      }
    }
    this.listeners = []
    // each frame's start, its interval from the last, its CPU time: a ring
    this.at = new Float64Array(N)
    this.gap = new Float32Array(N)
    this.cpu = new Float32Array(N)
    this.n = 0
    this.last = 0
    this.wrote = 0
    this.draw = { calls: 0, tris: 0, splats: 0, budget: 0, renderer: null }
    let on = params.has('perf')
    try {
      on ||= localStorage.getItem(PERF_KEY) === '1'
    } catch {}
    this.show(on)
  }

  get on() {
    return this.stage.probe === this
  }

  // `fn(on)` now and at each switch (the title's link, the battle's tool)
  listen(fn) {
    this.listeners.push(fn)
    fn(this.on)
  }

  // switched by a click: kept in this browser
  toggle() {
    this.show(!this.on)
    try {
      localStorage.setItem(PERF_KEY, this.on ? '1' : '0')
    } catch {}
  }

  show(on) {
    on &&= !this.fast
    this.stage.probe = on ? this : null
    this.el.classList.toggle('hidden', !on)
    if (on) {
      this.n = this.last = this.wrote = 0
      this.el.textContent = 'perf: measuring…'
    }
    for (const fn of this.listeners) fn(on)
  }

  // ── The stage's probe ─────────────────────────────────────────────────────
  // right after the table's render
  drawn(renderer) {
    const r = renderer.info.render
    this.draw.calls = r.calls
    this.draw.tris = r.triangles
    this.draw.splats = drawStats.splats
    this.draw.budget = drawStats.budget
    this.draw.renderer = renderer
  }

  // once the frame is done (t0 its start, t1 its end)
  frame(t0, t1) {
    if (this.last) {
      const i = this.n++ % N
      this.at[i] = t0
      this.gap[i] = t0 - this.last
      this.cpu[i] = t1 - t0
    }
    this.last = t0
    if (t1 - this.wrote >= 500) {
      this.wrote = t1
      this.write(t1)
    }
  }

  // the six lines, over the frames of the last second
  write(now) {
    let k = 0, sum = 0, worst = 0, cpu = 0
    for (let j = 1; j <= Math.min(this.n, N); j++) {
      const i = (this.n - j) % N
      if (now - this.at[i] > 1000) break
      k++
      sum += this.gap[i]
      worst = Math.max(worst, this.gap[i])
      cpu += this.cpu[i]
    }
    const { calls, tris, splats, budget, renderer } = this.draw
    if (!k || !renderer) return
    const c = renderer.domElement, pr = +renderer.getPixelRatio().toFixed(2), dev = +devicePixelRatio.toFixed(2)
    const sun = this.stage.sun, shadow = renderer.shadowMap.enabled && sun?.castShadow ? sun.shadow.mapSize.x : 'off'
    const q = this.stage.lowfi ? 'lowfi' : this.quality ? this.quality.label() : this.stage.quality
    this.el.textContent =
      `${k} fps · ${(sum / k).toFixed(0)} ms · worst ${worst.toFixed(0)}\n` +
      `cpu ${(cpu / k).toFixed(1)} ms · ${kilo(calls)} calls\n` +
      `${kilo(tris)} tris${budget ? ` · ${kilo(splats)}/${kilo(budget)} splats` : ''}\n` +
      `${c.width}×${c.height} · dpr ${pr}${dev !== pr ? ` (${dev})` : ''} · shadow ${shadow}\n` +
      `quality ${q}${this.quality ? ' ▸' : ''}\n` +
      `${this.style} figures · built ${Math.round(drawStats.built)} ms`
  }
}
