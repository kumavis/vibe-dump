// Dino Tiles: an endless, ever-growing park. game.js decides, board.js draws.
// The park persists on-device; there is no end screen — only the next tile.

import { Board } from './board.js'
import * as G from './game.js'

const SAVE_KEY = 'dino-tiles-park-v2'
const board = new Board(document.getElementById('scene'))
const $ = (sel) => document.querySelector(sel)

function loadRun() {
  try {
    const s = JSON.parse(localStorage.getItem(SAVE_KEY) ?? 'null')
    if (s?.v === 2 && s.board && Array.isArray(s.queue)) {
      G.refill(s)
      return s
    }
  } catch {
    /* fall through to a fresh park */
  }
  return null
}

const saved = loadRun()
let run = saved ?? G.newRun()

function save() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(run))
  } catch {
    /* no storage — the park lives for this session only */
  }
}

// Rebuild fences for a dino cell: edges shared with the same species stay
// open so pens merge.
function fenceSync(key) {
  const tileKey = run.board[key]
  const tile = G.TILES[tileKey]
  if (tile?.kind !== 'dino') return
  const [q, r] = G.parseKey(key)
  const open = new Set(G.neighborKeys(q, r).filter((nk) => G.TILES[run.board[nk]]?.species === tile.species))
  board.updateFences(key, tileKey, open)
}

function hydrate() {
  for (const [key, tileKey] of Object.entries(run.board)) {
    board.placeTile(key, tileKey, { instant: true })
  }
  for (const key of Object.keys(run.board)) fenceSync(key)
  board.showFrontier(G.frontierKeys(run))
}

function hexChip(tileKey, cls = 'hexchip') {
  return `<i class="${cls}" style="background:${G.TILES[tileKey].color}"></i>`
}

function updateHUD(pop = false) {
  const score = $('#score')
  score.textContent = run.score
  if (pop) {
    score.classList.remove('pop')
    void score.offsetWidth
    score.classList.add('pop')
  }
  $('#placed').textContent = `${run.placed} tiles`
  const q = G.questStatus(run)
  $('#quest').innerHTML = `<b>Quest</b> ${q.label} <span>${q.progress}/${q.target}</span>`
  const cur = G.currentTile(run)
  if (cur) {
    const t = G.TILES[cur]
    $('#cur-icon').innerHTML = hexChip(cur, 'hexchip big-chip')
    $('#cur-name').textContent = t.name
    $('#cur-rule').textContent = t.rule
  }
  $('#next-tiles').innerHTML = G.upcoming(run)
    .map((k) => `<span>${hexChip(k)}</span>`)
    .join('')
}

function tap(x, y) {
  if (!$('#overlay').hidden) return
  const key = board.pick(x, y)
  if (!key) {
    $('#current-tile').classList.remove('wiggle')
    void $('#current-tile').offsetWidth
    $('#current-tile').classList.add('wiggle')
    return
  }
  const [q, r] = G.parseKey(key)
  const res = G.place(run, q, r)
  if (!res.ok) return
  board.placeTile(key, res.tileKey)
  fenceSync(key)
  const placedTile = G.TILES[res.tileKey]
  if (placedTile.kind === 'dino') {
    for (const nk of G.neighborKeys(q, r)) {
      if (G.TILES[run.board[nk]]?.species === placedTile.species) fenceSync(nk)
    }
  }
  board.showFrontier(G.frontierKeys(run))
  const shown = res.events.filter((e) => e.amount)
  shown.forEach((e, i) => {
    setTimeout(() => {
      const txt = e.big ? `${e.label} +${e.amount}` : `${e.amount > 0 ? '+' : ''}${e.amount} ${e.label}`
      board.popup(key, txt, e.amount < 0 ? 'bad' : 'good', !!e.big)
    }, 120 + i * 260)
  })
  if (navigator.vibrate) navigator.vibrate(res.delta >= 20 ? [20, 40, 20] : 12)
  save()
  updateHUD(true)
}

function showHelp() {
  $('#overlay').innerHTML = `
    <div class="modal">
      <h2>Dino Tiles</h2>
      <p>An endless park. Tap open ground to place the next tile — every
      placement opens more territory. Neighbors decide the points; fences
      rise on their own, and pens of the same species merge.</p>
      <div class="rules">${Object.entries(G.TILES)
        .map(([k, t]) => `<div>${hexChip(k)}<div><b>${t.name}</b> — ${t.rule}</div></div>`)
        .join('')}</div>
      <p class="muted">Pen of 3 → bonus · quests roll in as you build ·
      drag to roam, pinch to zoom, two-finger drag to tilt</p>
      <button class="big" id="close-help">Keep building</button>
      <button class="big danger" id="reset-park">Start a new park</button>
    </div>`
  $('#overlay').hidden = false
  $('#close-help').addEventListener('click', () => {
    $('#overlay').hidden = true
  })
  const resetBtn = $('#reset-park')
  resetBtn.addEventListener('click', () => {
    if (!resetBtn.dataset.armed) {
      resetBtn.dataset.armed = '1'
      resetBtn.textContent = 'Really? The whole park?'
      setTimeout(() => {
        resetBtn.dataset.armed = ''
        resetBtn.textContent = 'Start a new park'
      }, 2500)
      return
    }
    run = G.newRun()
    save()
    board.reset()
    hydrate()
    $('#overlay').hidden = true
    updateHUD()
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
      const key = `${q},${r}`
      board.placeTile(key, res.tileKey)
      fenceSync(key)
      for (const nk of G.neighborKeys(q, r)) {
        if (G.TILES[run.board[nk]]?.species === G.TILES[res.tileKey].species) fenceSync(nk)
      }
      board.showFrontier(G.frontierKeys(run))
      save()
      updateHUD(true)
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
document.addEventListener('visibilitychange', save)

hydrate()
updateHUD()
if (!saved) setTimeout(showHelp, 600)

let last = performance.now()
board.renderer.setAnimationLoop(() => {
  const now = performance.now()
  const dt = Math.min(0.1, (now - last) / 1000)
  last = now
  board.update(dt, now / 1000, run.placed)
})
