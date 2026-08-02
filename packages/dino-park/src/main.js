// Bootstraps the game: state <-> world <-> ui, plus the day-tick clock.

import { World } from './world.js'
import { UI } from './ui.js'
import * as sim from './sim.js'
import { ECON } from './data.js'

const container = document.getElementById('scene')
let s = sim.load() ?? sim.newGame()
const world = new World(container)

const SPEEDS = [
  { mult: 1, label: '▶ 1×' },
  { mult: 3, label: '⏩ 3×' },
  { mult: 0, label: '⏸' },
]
let speedIdx = 0

const ui = new UI({
  get s() {
    return s
  },
  run(fn, ...args) {
    const res = fn(s, ...args)
    if (res?.msg) ui.toast(res.ok ? '✅' : '🚫', res.msg, res.ok ? 'good' : 'bad')
    if (res?.ok) {
      sim.save(s)
      world.syncState(s)
      ui.refresh()
    }
    return res
  },
  speed() {
    speedIdx = (speedIdx + 1) % SPEEDS.length
  },
  speedLabel: () => SPEEDS[speedIdx].label,
  reset() {
    sim.wipeSave()
    s = sim.newGame()
    const overlay = document.getElementById('overlay')
    delete overlay.dataset.party
    overlay.hidden = true
    speedIdx = 0
    ui.closeSheet()
    world.syncState(s)
    ui.refresh()
    ui.toast('🌱', 'Fresh park, fresh start!', 'good')
  },
  deselect() {
    world.setSelected(null)
  },
})

world.syncState(s)
ui.refresh()
if (!s.flags.hinted) ui.hint('👆 Tap a plot to build · drag to spin · pinch to zoom')

// Debug/playtest hook (used by the smoke test; handy in the console too).
window.__dp = {
  get s() {
    return s
  },
  sim,
  world,
  ui,
}

// ---------------------------------------------------------------- input

function selectPlot(plot) {
  world.setSelected(plot)
  ui.openSheet({ type: 'plot', plotId: plot.id })
  if (!s.flags.hinted) {
    s.flags.hinted = true
    sim.save(s)
    ui.hint('')
  }
}

function tap(x, y) {
  const hit = world.pick(x, y)
  if (!hit) {
    ui.closeSheet()
    return
  }
  if (hit.type === 'dino') {
    const dino = s.dinos.find((d) => d.id === hit.id)
    if (!dino) return
    if (dino.escaped) {
      ui.openSheet({ type: 'recapture', dinoId: dino.id })
      return
    }
    selectPlot(sim.plotById(s, dino.plot))
    return
  }
  selectPlot(sim.plotById(s, hit.id))
}

const canvas = world.renderer.domElement
let down = null
canvas.addEventListener('pointerdown', (e) => {
  down = { x: e.clientX, y: e.clientY }
})
canvas.addEventListener('pointerup', (e) => {
  if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) < 10) {
    tap(e.clientX, e.clientY)
  }
  down = null
})

window.addEventListener('resize', () => world.resize())
document.addEventListener('visibilitychange', () => sim.save(s))

// ---------------------------------------------------------------- loop

let last = performance.now()
let dayTimer = 0
let hudTimer = 0
world.renderer.setAnimationLoop(() => {
  const now = performance.now()
  const dt = Math.min(0.05, (now - last) / 1000)
  last = now

  const mult = s.over ? 0 : SPEEDS[speedIdx].mult
  dayTimer += dt * 1000 * mult
  if (dayTimer >= ECON.dayMs) {
    dayTimer -= ECON.dayMs
    const events = sim.dayTick(s)
    world.syncState(s)
    ui.refresh()
    ui.handleEvents(events)
  }

  hudTimer += dt
  if (hudTimer > 0.25) {
    hudTimer = 0
    ui.updateHUD(dayTimer / ECON.dayMs)
  }

  world.update(dt, now / 1000)
})
