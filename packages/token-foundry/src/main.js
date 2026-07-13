import { TPS } from './data.js'
import { newGame, tick, serialize, deserialize, seedStarter } from './sim.js'
import { makeView, draw } from './render.js'
import { makeUI } from './ui.js'

const SAVE_KEY = 'token-foundry-v1'

let game = null
try {
  const saved = localStorage.getItem(SAVE_KEY)
  if (saved) game = deserialize(saved)
} catch { /* corrupt save → fresh start */ }
if (!game) {
  game = newGame()
  seedStarter(game)
}

const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')
const view = makeView()

const uiApi = makeUI(game, view, canvas, {
  reset() {
    localStorage.removeItem(SAVE_KEY)
    game = newGame()
    seedStarter(game)
    uiApi.setGame(game)
  },
})

uiApi.renderPanel()

// fixed-step sim, rAF render
let acc = 0
let last = performance.now()
function frame(now) {
  acc += Math.min(now - last, 250)
  last = now
  while (acc >= 1000 / TPS) {
    acc -= 1000 / TPS
    tick(game)
  }
  draw(game, view, canvas, ctx, uiApi.ui)
  uiApi.frame()
  requestAnimationFrame(frame)
}
requestAnimationFrame(frame)

setInterval(() => {
  try { localStorage.setItem(SAVE_KEY, serialize(game)) } catch { /* storage full/blocked */ }
}, 10000)
window.addEventListener('beforeunload', () => {
  try { localStorage.setItem(SAVE_KEY, serialize(game)) } catch { /* ignore */ }
})

// debug / smoke-test hook
window.__tf = { get game() { return game }, tick, view }
