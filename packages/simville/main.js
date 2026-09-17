// Simville — a Smallville-shaped town of generative agents.
//
// The town runs on its own: schedules, pathfinding, a memory stream per
// resident, and a rumour that spreads by people actually standing next to each
// other. Pressing "Wake the minds" loads a language model into this tab (WebLLM
// on WebGPU) and hands it the dialogue, the reflections, the free-time
// decisions and any question you type. Nothing leaves the browser.

import { BrainHub } from './src/brain.js'
import { Renderer } from './src/render.js'
import { Simulation } from './src/sim.js'
import { townProblems } from './src/town.js'
import { UI } from './src/ui.js'

// One real second is four town minutes at 1×, so a day takes six minutes to
// live through and you can still read what people say to each other.
const MINUTES_PER_SECOND = 4

// A town, wound forward to late afternoon and ready to draw. Restarting makes
// a new one with a new seed — same map, same eight people, a different day —
// and hands it to the renderer and the panel. Whatever model is loaded stays
// loaded; swapping the world out is not a reason to re-download two gigabytes.
function newTown(seed) {
  const town = new Simulation(seed)
  town.attachBrain(brain)
  const problems = townProblems(town.town, town.locations)
  if (problems.length) console.warn(`[simville] town layout:\n  ${problems.join('\n  ')}`)
  town.warmStart(WARM_START)
  return town
}

let sim = new Simulation()
const brain = new BrainHub(sim.rng)
sim.attachBrain(brain)

// Moving a building in town.js can quietly block another one's doorstep, which
// looks like nothing on the map and shows up hours later as one resident who
// never left the house. Shout about it instead.
const problems = townProblems(sim.town, sim.locations)
if (problems.length) console.warn(`[simville] town layout:\n  ${problems.join('\n  ')}`)

// Replay the day up to late afternoon before the first frame ever draws — a
// town that starts at zero is eight people asleep in eight houses, which looks
// like a screensaver. By 17:20 everyone is out at their own end of the map, the
// memory streams have a day in them, a rumour is five people deep, and the
// light has gone golden. The whole replay costs about 20ms.
const WARM_START = 620
sim.warmStart(WARM_START)

const canvas = document.getElementById('town')
const renderer = new Renderer(canvas, sim)

let speed = 1
const controls = {
  setSpeed: (v) => {
    speed = v
  },
  togglePause: () => {
    speed = speed === 0 ? 1 : 0
    for (const b of document.querySelectorAll('.speeds button')) {
      b.classList.toggle('on', Number(b.dataset.speed) === speed)
    }
  },
  resize: () => renderer.resize(),
  restart: (note) => {
    sim = newTown((Math.random() * 0xffffffff) >>> 0)
    renderer.setSim(sim)
    ui.setSim(sim)
    globalThis.__simville.sim = sim
    ui.toast(note ?? 'A new day, and nobody remembers the last one.')
  },
}

const ui = new UI(sim, brain, renderer, controls)

renderer.resize()
ui.mount()

let last = performance.now()
function frame(now) {
  const dtReal = Math.min((now - last) / 1000, 0.25)
  last = now
  sim.update(dtReal * MINUTES_PER_SECOND * speed, speed > 0 ? dtReal : 0)
  renderer.draw(now)
  ui.tick()
  requestAnimationFrame(frame)
}
requestAnimationFrame(frame)

// A handle on the running town, for poking at it from the console.
globalThis.__simville = { sim, brain, renderer, ui, controls }

const ro = new ResizeObserver(() => renderer.resize())
ro.observe(canvas)
window.addEventListener('resize', () => renderer.resize())
