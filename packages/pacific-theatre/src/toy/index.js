// The toy (TOY.md): a three-minute arcade battle, *Hold the line*, beside
// the record and the wargame. Toy is its lifecycle: enter a box (its sea, sky
// and terrain), the start screen, a game, the end screen, play again or the
// other side, and leave back to where the page was (the table, or the dev
// page's idle scene), one scene drawn per frame as the other doors do it.
//
//   const toy = new Toy(app)
//   await toy.enter('samar', { side: 'us', from: 'table' | 'url' })
//   toy.start('us')            // a game (the start screen's buttons call it)
//   await toy.leave()
//
// Handles for the tools: toy.world (the game), toy.scene, toy.simulate(s,
// bot) steps the game without drawing (the smoke test's bot plays it under
// SwiftShader at a frame a second), toy.metrics().

import { shipGeometry } from '../battle/kits/index.js'
import { SIDES, sideOf } from './sides.js'
import { newGame } from './game.js'
import { ToyScene } from './scene.js'
import { ToyInput } from './input.js'
import { ToyHud } from './hud.js'
import { ToyFx } from './fx.js'
import { pointWorld } from './combat.js'

const BEST_KEY = 'pt.toy.best'

const STEP = 1 / 60

/** The ship kits' sizes and turrets the world needs (from the same cached geometry the renderer draws). */
function modelsFor(side, kitsById) {
  const out = {}
  for (const role of ['carrier', 'destroyer', 'cruiser', 'boss']) {
    const kit = kitsById[side[role].kit]
    if (!kit) continue
    const g = shipGeometry(kit, { colourDate: side.colourDate })
    const b = g.bounds
    const main = g.turrets.filter((t) => t.battery === g.turrets[0]?.battery).slice(0, 3)
    out[kit.id] = { L: b.length, B: b.beam, H: b.height, deck: Math.max(5, b.height * 0.3), turrets: main.map((t, j) => ({ at: t.at, battery: t.battery, j, rest: t.rest })) }
  }
  return out
}

export class Toy {
  constructor(app) {
    this.app = app
    this.scene = null
    this.world = null
    this.paused = false
    this.slow = { until: -1, from: -1 }
    this.acc = 0
    this.realT = 0
    this.games = 0
    this.pointWorld = pointWorld
  }

  /** The high score this browser kept for a side (0 when it keeps nothing). */
  best(side = this.side) {
    try {
      return Number(JSON.parse(localStorage.getItem(BEST_KEY) || '{}')[side]) || 0
    } catch {
      return 0
    }
  }

  saveBest(side, score) {
    try {
      const all = JSON.parse(localStorage.getItem(BEST_KEY) || '{}')
      all[side] = score
      localStorage.setItem(BEST_KEY, JSON.stringify(all))
    } catch {
      // (a private window keeps nothing: the end screen still shows the score)
    }
  }

  get active() {
    return !!this.scene
  }

  /** Load the box and show the start screen over its sea. side: the side the start screen focuses. */
  async enter(boxId, { side = 'us', from = 'table' } = {}) {
    const app = this.app
    if (this.scene) await this.leave({ quiet: true })
    if (app.battle?.scene) await app.battle.leave()
    side = sideOf(side)
    this.boxId = boxId
    this.prevMode = app.mode === 'flying' ? 'table' : app.mode
    this.prevActive = app.active
    app.setMode('flying')
    const loaded = await (app.takePrefetch?.(boxId) ?? app.data.loadBox(boxId, { decoder: app.decoder, warn: app.warn }))
    this.loaded = loaded
    this.kitsById = {}
    for (const k of [...(loaded.kits.ships || []), ...(loaded.kits.aircraft || [])]) this.kitsById[k.id] = k
    this.side = side
    this.scene = new ToyScene(app, loaded, SIDES[side])
    this.scene.onTick = (dt) => this.tick(dt)
    this.root = document.createElement('div')
    this.root.className = 'toy'
    document.body.appendChild(this.root)
    document.body.classList.add('toy-on')
    this.input = new ToyInput(this.root, { pause: () => this.togglePause(), paused: () => this.paused || !this.running, blur: () => this.running && this.pause(true) })
    this.hud = new ToyHud(this.root, this)
    this.fx = new ToyFx(this.scene)
    await this.newGame(side, { running: false })
    await app.cut(() => {
      app.setActive(this.scene)
      app.resize?.()
    }, { out: from === 'table' ? 0.35 : 0.05, back: 0.35 })
    app.setMode('moment')
    this.hud.startScreen(side)
    app.events?.dispatchEvent(new CustomEvent('toy', { detail: { kind: 'enter', box: boxId, side } }))
    return this
  }

  /** A fresh world for a side on the same scene (the start screen shows it idling). */
  async newGame(side, { running = true } = {}) {
    side = sideOf(side)
    this.side = side
    const S = SIDES[side]
    if (this.scene.side !== S) {
      this.scene.side = S
    }
    this.games++
    const world = newGame(S, this.kitsById, { centre: this.scene.centre, seed: this.seed ?? 1000 + this.games, models: modelsFor(S, this.kitsById) })
    this.world = world
    await this.scene.setWorld(world)
    this.hud.bind(world)
    this.running = running
    this.paused = false
    this.slow = { until: -1, from: -1 }
    this.acc = 0
    return world
  }

  /** The start screen's side: a game from the first second. */
  async start(side = this.side) {
    await this.newGame(side, { running: true })
    this.hud.hideScreens()
    this.app.events?.dispatchEvent(new CustomEvent('toy', { detail: { kind: 'start', side: this.side } }))
  }

  togglePause() {
    if (!this.running && !this.paused) return
    this.pause(!this.paused)
  }

  pause(on) {
    if (!this.world || this.world.over) return
    this.paused = on
    this.running = !on
    this.hud.pauseScreen(on)
  }

  /** The slow-motion second (a sinking): the game at a quarter of its pace, eased in and out. */
  slowmo(seconds = 1.1) {
    this.slow = { from: this.realT, until: this.realT + seconds }
  }

  slowFactor() {
    const s = this.slow
    if (this.realT >= s.until) return 1
    const u = (this.realT - s.from) / Math.max(1e-3, s.until - s.from)
    const edge = Math.min(1, u / 0.12, (1 - u) / 0.25)
    return 1 - 0.75 * Math.max(0, Math.min(1, edge))
  }

  /** Once a frame (the scene's update): the input, the world's fixed steps, the HUD; returns the effects' dt. */
  tick(dt) {
    this.realT += dt
    const w = this.world
    if (!w) return 0
    const k = this.running ? this.slowFactor() : 0
    if (this.running) {
      const inp = this.bot ? this.bot(w) : this.input.read(innerWidth, innerHeight)
      w.input.sx = inp.sx
      w.input.sy = inp.sy
      w.input.fire = inp.fire
      w.input.drop += inp.drop || 0
      this.acc += dt * k
      let n = 0
      while (this.acc >= STEP && n < 8) {
        w.step(STEP)
        this.acc -= STEP
        n++
      }
      if (n === 8) this.acc = 0
    }
    this.drain(w, true)
    this.hud.update(dt, w)
    return dt * k
  }

  /** The world's events to the effects (when drawn) and the HUD; the sinking's slow motion and cut; the end screen. */
  drain(w, draw) {
    for (const e of w.events) {
      if (draw) this.fx.event(e, w)
      this.hud.event(e, w)
      if (e.type === 'sunk' && draw) {
        this.slowmo(e.th?.role === 'boss' ? 1.6 : 1.1)
        const c = w.centre
        this.scene.chase.cut(e.x + c.x, 0, e.z + c.z, e.th?.role === 'boss' ? 1.9 : 1.3, e.th?.model?.L ?? 120)
      }
      if (e.type === 'over') this.finish(w)
    }
    w.events.length = 0
  }

  /** The end screen's numbers (and the high score kept). */
  results(w = this.world) {
    const shots = w.stats.shots || 0
    const hits = w.stats.hits || 0
    const score = w.score || 0
    const prev = this.best(this.side)
    return { reason: w.over?.reason ?? 'time', side: this.side, score, best: Math.max(prev, score), newBest: score > prev && score > 0, combo: w.combo?.best ?? 1, sunk: w.sunk || 0, downed: w.downed || 0, accuracy: shots ? Math.round((hits / shots) * 100) : 0, lost: w.lost || 0, t: +w.t.toFixed(1) }
  }

  finish(w) {
    if (this.ended === w) return
    this.ended = w
    const r = this.results(w)
    this.lastResults = r
    if (r.newBest) this.saveBest(this.side, r.score)
    this.running = false
    // (a beat to see the last explosion before the card)
    setTimeout(() => this.world === w && this.hud?.endScreen(r), this.bot ? 0 : 1600)
    this.app.events?.dispatchEvent(new CustomEvent('toy', { detail: { kind: 'end', ...r } }))
  }

  /** For the tools: step the game `seconds` without drawing, `bot(world)` steering (the HUD's events are drained as they come). */
  simulate(seconds, bot = this.bot) {
    const w = this.world
    const n = Math.round(seconds / STEP)
    for (let i = 0; i < n && !w.over; i++) {
      const inp = bot ? bot(w) : { sx: 0, sy: 0, fire: false, drop: 0 }
      w.input.sx = inp.sx
      w.input.sy = inp.sy
      w.input.fire = inp.fire
      w.input.drop += inp.drop || 0
      w.step(STEP)
      if (i % 6 === 0) {
        this.drain(w, false)
        this.hud.update(STEP * 6, w)
      }
    }
    this.drain(w, false)
    this.hud.update(0, w)
    return w.t
  }

  /** Back where the page was: the table (or the dev page's idle scene), the toy's scene let go. */
  async leave({ quiet = false } = {}) {
    const app = this.app
    if (!this.scene) return
    const s = this.scene
    this.running = false
    app.setMode('flying')
    const back = app.table || this.prevActive || app.idle
    await app.cut(() => {
      if (back && back !== s) app.setActive(back)
    }, { out: quiet ? 0.05 : 0.3, back: 0.3 })
    if (app.active === s) s.scene.remove(app.sky.group)
    this.input?.dispose()
    this.hud?.dispose()
    this.root?.remove()
    document.body.classList.remove('toy-on')
    s.dispose()
    this.scene = null
    this.world = null
    this.input = null
    this.hud = null
    app.setMode(app.table ? 'table' : this.prevMode === 'moment' ? 'watch' : this.prevMode || 'table')
    if (!quiet) app.events?.dispatchEvent(new CustomEvent('toy', { detail: { kind: 'leave', box: this.boxId } }))
  }
}
