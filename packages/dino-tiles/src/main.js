// Dino Tiles: rapid hex-placement puzzle. game.js decides, board.js draws.

import { Board } from './board.js'
import * as G from './game.js'

const BEST_KEY = 'dino-tiles-best'
const board = new Board(document.getElementById('scene'))
let run = G.newRun()
let best = 0
try {
  best = +localStorage.getItem(BEST_KEY) || 0
} catch {
  /* no storage — session best only */
}

const $ = (sel) => document.querySelector(sel)

function updateHUD(pop = false) {
  const score = $('#score')
  score.textContent = run.score
  if (pop) {
    score.classList.remove('pop')
    void score.offsetWidth
    score.classList.add('pop')
  }
  $('#best').textContent = `best ${Math.max(best, run.score)}`
  $('#left').textContent = `${run.deck.length - run.idx} tiles`
  const cur = G.currentTile(run)
  if (cur) {
    const t = G.TILES[cur]
    $('#cur-icon').textContent = t.icon
    $('#cur-name').textContent = t.name
    $('#cur-rule').textContent = t.rule
  }
  $('#next-tiles').innerHTML = G.upcoming(run)
    .map((k) => `<span>${G.TILES[k].icon}</span>`)
    .join('')
}

function tap(x, y) {
  if (run.done || !$('#overlay').hidden) return
  const cell = board.pick(x, y)
  if (!cell) {
    $('#current-tile').classList.remove('wiggle')
    void $('#current-tile').offsetWidth
    $('#current-tile').classList.add('wiggle')
    return
  }
  const res = G.place(run, cell.q, cell.r)
  if (!res.ok) return
  board.placeTile(cell, res.tileKey)
  // Stagger the score popups so combos read as a burst.
  const shown = res.events.filter((e) => e.amount)
  shown.forEach((e, i) => {
    setTimeout(() => {
      const txt = e.big ? `${e.label} +${e.amount}` : `${e.amount > 0 ? '+' : ''}${e.amount} ${e.label}`
      board.popup(cell, txt, e.amount < 0 ? 'bad' : 'good', !!e.big)
    }, 120 + i * 260)
  })
  if (navigator.vibrate) navigator.vibrate(res.delta >= 20 ? [20, 40, 20] : 12)
  updateHUD(true)
  if (res.done) setTimeout(showEnd, 1400)
}

function showEnd() {
  const stars = G.starsFor(run.score)
  const isBest = run.score > best
  if (isBest) {
    best = run.score
    try {
      localStorage.setItem(BEST_KEY, String(best))
    } catch {
      /* ignore */
    }
  }
  const verdict =
    stars === 3 ? 'Park of legend!' : stars === 2 ? 'A roaring success!' : stars === 1 ? 'A solid little park.' : 'The dinos forgive you.'
  $('#overlay').innerHTML = `
    <div class="modal">
      <div class="modal-icon">${stars >= 2 ? '🏆' : '🦕'}</div>
      <h2>${verdict}</h2>
      <div class="final-score">${run.score}</div>
      <div class="stars">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
      ${isBest ? '<p class="new-best">🎉 NEW BEST!</p>' : `<p>Best: ${best}</p>`}
      <p class="muted">★ ${G.STARS[0]} · ★★ ${G.STARS[1]} · ★★★ ${G.STARS[2]}</p>
      <button class="big" id="again">🔄 Play again</button>
    </div>`
  $('#overlay').hidden = false
  $('#again').addEventListener('click', restart)
}

function restart() {
  run = G.newRun()
  board.reset()
  $('#overlay').hidden = true
  updateHUD()
}

function showHelp() {
  $('#overlay').innerHTML = `
    <div class="modal">
      <div class="modal-icon">🧩</div>
      <h2>Dino Tiles</h2>
      <p>Place all 30 tiles. Neighbors decide the points — build herds, keep
      predators fenced, give the T-Rex space.</p>
      <div class="rules">${Object.values(G.TILES)
        .map((t) => `<div><span>${t.icon}</span><div><b>${t.name}</b> — ${t.rule}</div></div>`)
        .join('')}</div>
      <p class="muted">Herd of 3 → bonus! · Drag to tilt · pinch to zoom</p>
      <button class="big" id="close-help">Let's build</button>
    </div>`
  $('#overlay').hidden = false
  $('#close-help').addEventListener('click', () => {
    $('#overlay').hidden = true
  })
}

$('#help-btn').addEventListener('click', showHelp)

// Debug/playtest hook.
window.__dp = {
  get run() {
    return run
  },
  G,
  board,
  placeAt(q, r) {
    const res = G.place(run, q, r)
    if (res.ok) {
      board.placeTile({ q, r, key: `${q},${r}` }, res.tileKey)
      updateHUD(true)
      if (res.done) showEnd()
    }
    return res
  },
}

const canvas = board.renderer.domElement
let down = null
canvas.addEventListener('pointerdown', (e) => {
  down = { x: e.clientX, y: e.clientY }
})
canvas.addEventListener('pointerup', (e) => {
  if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) < 10) tap(e.clientX, e.clientY)
  down = null
})
window.addEventListener('resize', () => board.resize())

updateHUD()
if (best === 0) setTimeout(showHelp, 600)

let last = performance.now()
board.renderer.setAnimationLoop(() => {
  const now = performance.now()
  const dt = Math.min(0.1, (now - last) / 1000)
  last = now
  board.update(dt, now / 1000)
})
