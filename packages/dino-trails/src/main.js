// Bootstraps Dino Trails: terrain <-> state <-> world <-> ui + the day clock.
// The world's guest sim produces the footfall packet each day tick consumes.

import { makePark } from './terrain.js'
import { World } from './world.js'
import { UI } from './ui.js'
import * as sim from './sim.js'
import { ECON } from './data.js'

const container = document.getElementById('scene')
const saved = sim.load()
const seed = saved?.seed ?? ((Math.random() * 2 ** 31) | 0)
const park = makePark(seed)
let s = saved ?? sim.newGame(seed, park)
const world = new World(container, park)

const SPEEDS = [
  { mult: 1, label: '▶ 1×' },
  { mult: 3, label: '⏩ 3×' },
  { mult: 0, label: '⏸' },
]
let speedIdx = 0

const ui = new UI(
  {
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
    setHeat(on) {
      world.setHeat(on)
    },
    reset() {
      sim.wipeSave()
      location.reload() // fresh seed → fresh terrain
    },
    deselect() {
      world.setSelected(null)
    },
  },
  park
)

world.syncState(s)
ui.refresh()
if (!s.flags.hinted) ui.hint('👆 Tap a cell to claim land · 🔥 shows the busy trails')

// Debug/playtest hook (smoke tests + console tinkering).
window.__dp = {
  get s() {
    return s
  },
  sim,
  world,
  ui,
  park,
}

// ---------------------------------------------------------------- input

function selectCell(cell) {
  world.setSelected(cell)
  ui.openSheet({ type: 'cell', cellId: cell.id })
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
    selectCell(park.cells[dino.cell])
    return
  }
  selectCell(park.cells[hit.id])
}

const canvas = world.renderer.domElement
let down = null
canvas.addEventListener('pointerdown', (e) => {
  down = { x: e.clientX, y: e.clientY }
})
canvas.addEventListener('pointerup', (e) => {
  if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) < 10) tap(e.clientX, e.clientY)
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
  const dt = Math.min(0.1, (now - last) / 1000)
  last = now

  const mult = s.over ? 0 : SPEEDS[speedIdx].mult
  dayTimer += dt * 1000 * mult
  if (dayTimer >= ECON.dayMs) {
    dayTimer -= ECON.dayMs
    const events = sim.dayTick(s, park, world.collectTraffic())
    world.syncState(s)
    ui.refresh()
    ui.handleEvents(events)
  }

  hudTimer += dt
  if (hudTimer > 0.25) {
    hudTimer = 0
    ui.updateHUD(dayTimer / ECON.dayMs)
  }

  // Guests spawn paced so ~visitorRate of them arrive per in-game day.
  const spawnPerSec = (s.visitorRate / (ECON.dayMs / 1000)) * mult
  world.update(dt, now / 1000, spawnPerSec)
})
