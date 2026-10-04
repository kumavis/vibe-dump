#!/usr/bin/env node
// Run the real Board — and the real Director — in Node, on the real word list,
// and print how the engine behaves over a long run: the metrics of
// research/ENGINE.md §13. Then check that the deal can't hang, on the real
// list and on lists cut down far below anything that should ship, and that no
// stone or line the engine puts down ever reaches into the island's upland.
//
//   node tools/sim.mjs                      harness, Director model, deal check
//   node tools/sim.mjs --seeds 30 --ticks 6000 --hours 2 --view 1920x1080
//
// Two drivers, as in the research:
//
// The harness (the brief's): one tick is one background beat of 2.05 s; each
// tick turns one random pair that hasn't turned in the last three ticks (the
// Director's 6 s idle rule) and can turn now (its legal-only pick).
// `chooseTurn` steers on the whole floor's linked share; there is no view.
//
// The Director model: src/director.js itself, stepped at 30 fps against stand-
// ins for the scene (Jukugo's camera drift and orthographic projection, the
// 0.7 s drop-in and the 0.86 s roll), the cards and the lines. It only turns
// what is in view, runs the cards on their own beat, and steers on the linked
// share in view. It is the harsher of the two and closer to what a viewer sees.
//
//   stall   beats lost: beats on which no pair could turn
//   stuck   pairs that can't turn even after resting (harness: every 10 ticks;
//           Director: every 10 s, the larger of the whole floor and the view)
//   strict  pairs whose only way out is back to the word they just left
//   repeat  turns landing on a word the pair showed in its last 6 (returns included)
//   rep24   the same over the pair's last 24 words: the recycling a 6-word
//           window can't see
//   return  turns back to the word the pair just left (Director: per hour)
//   linked  pairs on a shared-root line: Board.linkedFraction() (harness,
//           with its 10th–90th percentile), or the share of those in view
//   seen    share of the whole list (not just the playable set) ever shown
//   t/min   turns a minute, cards included
//   cards   cards that showed both their turns; short = retired early for want
//           of a turn while still in view
//
// GOOD: stall ≤ .05, stuck ≤ .10, repeat ≤ .20, linked .35–.70
// JUKUGO-LIKE: stall ≤ .02, stuck ≤ .03, repeat ≤ .13, linked .40–.65
//
// The deal check feeds the lexicon a seeded sample of the word list through a
// loader hook (`--words N`, `--nodeal share`).
import { register } from 'node:module'
import { spawn } from 'node:child_process'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const src = join(here, '..', 'src')
const args = process.argv.slice(2)
const arg = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i < 0 ? fallback : args[i + 1]
}
const SEEDS = Number(arg('seeds', 10))
const TICKS = Number(arg('ticks', 1500))
const HOURS = Number(arg('hours', 1))
const VIEWS = arg('view', '1280x800,390x844').split(',').map((v) => v.split('x').map(Number))
const WORDS_N = Number(arg('words', 0))
const NODEAL = Number(arg('nodeal', 0))
const BEAT = 2.05
const COOLDOWN = 3
const DT = 1 / 30

const mulberry = `function mulberry32(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}`
const dataModule = (code) => 'data:text/javascript,' + encodeURIComponent(code)

// A seeded sample of N words, a share of them marked nodeal.
const wordsSample = dataModule(`
import { WORDS as ALL } from ${JSON.stringify(pathToFileURL(join(src, 'data', 'words.js')).href)}
${mulberry}
const rng = mulberry32(${WORDS_N * 31 + 7})
const list = ALL.map((w) => ({ ...w }))
for (let i = list.length - 1; i > 0; i--) {
  const j = Math.floor(rng() * (i + 1))
  ;[list[i], list[j]] = [list[j], list[i]]
}
for (const w of list) if (rng() < ${NODEAL}) w.nodeal = true
export const WORDS = list.slice(0, ${WORDS_N || 'list.length'})`)

if (WORDS_N > 0 || NODEAL > 0) {
  register(
    dataModule(`
export async function resolve(specifier, context, next) {
  if (specifier === './data/words.js' && context.parentURL?.endsWith('/src/lexicon.js'))
    return { url: ${JSON.stringify(wordsSample)}, shortCircuit: true }
  return next(specifier, context)
}`),
  )
}

const { Board } = await import('../src/board.js')
const { Director } = await import('../src/director.js')
const { LinkStore, pointAt } = await import('../src/links.js')
const { touchesUpland } = await import('../src/island.js')
const { ALL, LEXICON, LINK_MAX, COLLIDE, compSize } = await import('../src/lexicon.js')
const { GRID, BOUNDS, layoutPairs, mulberry32 } = await import('../src/field.js')

if (args.includes('--deal-only')) dealOnly()
else {
  console.log(`words ${ALL.length} · playable ${LEXICON.length} · grid ${GRID.cols}×${GRID.rows} · floor ${(BOUNDS.x1 * 2).toFixed(1)} × ${(BOUNDS.z1 * 2).toFixed(1)}`)
  console.log(`COLLIDE ${COLLIDE.toFixed(4)} · LINK_MAX ${LINK_MAX.toFixed(2)}\n`)
  table(`harness: ${SEEDS} seeds × ${TICKS} beats of ${BEAT} s`, ['pairs', 'stall', 'stuck', 'strict', 'repeat', 'rep24', 'return', 'linked', 'lo', 'hi', 'seen'], harness)
  for (const [w, h] of VIEWS) {
    table(`Director at ${w}×${h}: ${SEEDS} seeds × ${HOURS} h`, ['inview', 'stall', 'stuck', 'strict', 'repeat', 'rep24', 'return/h', 'linked', 'seen', 't/min', 'cards', 'short'], (seed) => directed(seed, w, h))
  }
  await dealCheck()
}

function table(title, cols, run) {
  console.log(title)
  console.log(['seed'.padEnd(6), ...cols.map((c) => c.padStart(9))].join(''))
  const rows = []
  for (let s = 0; s < SEEDS; s++) {
    const seed = 1031 + s * 7919
    const r = run(seed)
    rows.push(r)
    console.log([String(seed).padEnd(6), ...cols.map((c) => fmt(c, r[c]))].join(''))
  }
  const m = Object.fromEntries(cols.map((c) => [c, rows.reduce((a, r) => a + r[c], 0) / rows.length]))
  console.log(['mean'.padEnd(6), ...cols.map((c) => fmt(c, m[c]))].join(''))
  const pass = (t) => m.stall <= t.stall && m.stuck <= t.stuck && m.repeat <= t.repeat && m.linked >= t.lo && m.linked <= t.hi
  const verdict = pass({ stall: 0.02, stuck: 0.03, repeat: 0.13, lo: 0.4, hi: 0.65 })
    ? 'JUKUGO-LIKE'
    : pass({ stall: 0.05, stuck: 0.1, repeat: 0.2, lo: 0.35, hi: 0.7 })
      ? 'GOOD'
      : 'neither GOOD nor JUKUGO-LIKE'
  console.log(`verdict: ${verdict}\n`)
}

// Counts to one decimal; shares to three, without the leading zero.
function fmt(col, v) {
  const count = ['pairs', 'inview', 'return/h', 't/min'].includes(col)
  return (count ? v.toFixed(1) : v.toFixed(3).replace(/^0/, '')).padStart(9)
}

// Counts what each turn does, just before it is made, whichever driver makes it.
function recorder(board) {
  const shown = new Map(board.pairs.map((p) => [p, [p.entry.word]]))
  const seen = new Set(board.pairs.map((p) => p.entry.word))
  const r = { turns: 0, repeats: 0, rep24: 0, returns: 0, seen }
  r.count = (pair, choice) => {
    const word = choice.entry.word
    if (pair.history.some((h) => h.word === word)) r.repeats++
    if (pair.history.at(-1)?.word === word) r.returns++
    const mine = shown.get(pair)
    if (mine.slice(-24).includes(word)) r.rep24++
    mine.push(word)
    seen.add(word)
    r.turns++
  }
  return r
}

// Can't turn even once rested; or, once rested, could only go back.
function frozen(board, p) {
  return !board.canTurn(p, Infinity)
}
function returnOnly(board, p) {
  const out = board.targets(p, Infinity)
  return !out.length || out.every((o) => o.tier === 2)
}

function harness(seed) {
  Math.random = mulberry32((seed * 2654435761) >>> 0)
  const board = new Board(seed)
  const rec = recorder(board)
  const last = new Map()
  const linked = []
  let stalls = 0, stuck = 0, strict = 0, samples = 0
  for (let t = 0; t < TICKS; t++) {
    const now = t * BEAT
    const pool = board.pairs.filter((p) => t - (last.get(p) ?? -99) > COOLDOWN && board.canTurn(p, now))
    if (!pool.length) stalls++
    else {
      const p = pool[Math.floor(Math.random() * pool.length)]
      const choice = board.chooseTurn(p, now)
      rec.count(p, choice)
      board.turn(p, choice, now)
      last.set(p, t)
    }
    if (t % 10 === 0) {
      linked.push(board.linkedFraction())
      for (const p of board.pairs) {
        if (frozen(board, p)) stuck++
        if (returnOnly(board, p)) strict++
      }
      samples += board.pairs.length
    }
  }
  linked.sort((a, b) => a - b)
  const q = (f) => linked[Math.min(linked.length - 1, Math.floor(f * linked.length))]
  return {
    pairs: board.pairs.length,
    stall: stalls / TICKS,
    stuck: stuck / samples,
    strict: strict / samples,
    repeat: rec.repeats / Math.max(1, rec.turns),
    rep24: rec.rep24 / Math.max(1, rec.turns),
    return: rec.returns / Math.max(1, rec.turns),
    linked: linked.reduce((a, b) => a + b, 0) / linked.length,
    lo: q(0.1),
    hi: q(0.9),
    seen: rec.seen.size / ALL.length,
  }
}

// The real Director, against a scene that only keeps time and projects.
function directed(seed, w, h) {
  Math.random = mulberry32(seed ^ 0x9e3779b9)
  const board = new Board(seed)
  const rec = recorder(board)

  // main.js's drift, clamped to the floor, and Scene3D's orthographic projection.
  const TAU = Math.PI * 2
  const cam = {}
  const camera = (t) => {
    const base = Math.max(34, Math.min(60, Math.min(w, h) / 17))
    cam.ppu = base * (1 + 0.035 * Math.sin((t / 53) * TAU))
    const tx = 2.5 * Math.sin((t / 97) * TAU) + 1.4 * Math.sin((t / 41) * TAU)
    const tz = 1.8 * Math.sin((t / 83) * TAU + 1)
    cam.tx = Math.max(BOUNDS.x0 + 6, Math.min(BOUNDS.x1 - 6, tx))
    cam.tz = Math.max(BOUNDS.z0 + 4, Math.min(BOUNDS.z1 - 4, tz))
    const yaw = ((-3 + 5 * Math.sin((t / 120) * TAU)) * Math.PI) / 180
    const pitch = ((55 + 2.5 * Math.sin((t / 71) * TAU)) * Math.PI) / 180
    Object.assign(cam, { cy: Math.cos(yaw), sy: Math.sin(yaw), cp: Math.cos(pitch), sp: Math.sin(pitch) })
  }
  const blocks = new Map(
    board.tiles.map((t) => [
      t,
      {
        roll: null,
        drop: null,
        turn(stone, t0, dur) {
          this.roll = { t0, dur }
          return t0 + dur
        },
        landsAt() {
          return this.roll ? this.roll.t0 + this.roll.dur : 0
        },
      },
    ]),
  )
  const scene = {
    w,
    h,
    block: (t) => blocks.get(t),
    project(x, y, z) {
      const dx = x - cam.tx
      const dz = z - cam.tz
      const nx = (dx * cam.cy - dz * cam.sy) / (w / 2 / cam.ppu)
      const ny = (-cam.sp * cam.sy * dx + cam.cp * y - cam.sp * cam.cy * dz) / (h / 2 / cam.ppu)
      return [((nx + 1) / 2) * w, ((1 - ny) / 2) * h]
    },
  }
  let opened = 0, full = 0, short = 0
  const notes = {
    list: [],
    has(pair) {
      return this.list.some((n) => n.pair === pair && !n.closing)
    },
    noted() {
      return new Set(this.list.filter((n) => !n.closing).map((n) => n.pair))
    },
    open(pair) {
      const note = { pair, closing: null, turns: 0 }
      this.list.push(note)
      opened++
      return note
    },
    close(note, now) {
      if (note.closing) return
      note.closing = now
      if (note.turns >= 2) full++
      else if (director.inView(-0.05).includes(note.pair)) short++
    },
    turn(pair) {
      const note = this.list.find((n) => n.pair === pair && !n.closing)
      if (note) note.turns++
    },
  }
  const director = new Director({ board, scene, links: { sync() {} }, notes, ripples: [] })
  // Every turn the Director makes goes through board.turn: count it there, and
  // note whether it was the background beat's (a card's pair is never picked).
  let bgTurned = false
  board.turn = (pair, choice, now) => {
    rec.count(pair, choice)
    if (!notes.has(pair)) bgTurned = true
    Board.prototype.turn.call(board, pair, choice, now)
  }

  // The opening, as main.js: stones fall in from the middle of the frame out.
  camera(0)
  for (const p of board.pairs) {
    const start = 0.15 + Math.hypot(p.x - cam.tx, p.z - cam.tz) * 0.035 + Math.random() * 0.12
    for (const t of p.tiles) blocks.get(t).drop = { t0: start + t.index * 0.06, dur: 0.7 }
    p.caption = { text1: '', text2: '' }
  }
  director.start(0)

  const DUR = HOURS * 3600
  let beats = 0, lost = 0
  let linked = 0, linkedN = 0, stuck = 0, strict = 0, stuckN = 0, inview = 0
  for (let step = 0; step * DT <= DUR; step++) {
    const now = step * DT
    camera(now)
    const beat = director.nextBackground
    bgTurned = false
    director.update(now)
    if (director.nextBackground !== beat) {
      beats++
      if (!bgTurned) lost++
    }
    for (const b of blocks.values()) {
      if (b.drop && now >= b.drop.t0 + b.drop.dur) b.drop = null
      if (b.roll && now >= b.roll.t0 + b.roll.dur) b.roll = null
    }
    notes.list = notes.list.filter((n) => !n.closing || now - n.closing < 0.9)
    if (step % 60 === 0) {
      linked += director.linkedInView() ?? 0
      linkedN++
    }
    if (step % 300 === 0 && step) {
      const vis = director.inView()
      const share = (list, test) => list.filter((p) => test(board, p)).length / Math.max(1, list.length)
      stuck += Math.max(share(board.pairs, frozen), share(vis, frozen))
      strict += Math.max(share(board.pairs, returnOnly), share(vis, returnOnly))
      inview += vis.length
      stuckN++
    }
  }
  return {
    inview: inview / stuckN,
    stall: lost / Math.max(1, beats),
    stuck: stuck / stuckN,
    strict: strict / stuckN,
    repeat: rec.repeats / Math.max(1, rec.turns),
    rep24: rec.rep24 / Math.max(1, rec.turns),
    'return/h': rec.returns / HOURS,
    linked: linked / linkedN,
    seen: rec.seen.size / ALL.length,
    't/min': rec.turns / (DUR / 60),
    cards: full / Math.max(1, opened),
    short: short / Math.max(1, opened),
  }
}

// Deal 30 boards and check every one: each pair holds a playable word, no
// word twice, never a nodeal word, never one from a small component. A pair
// with nothing left to deal is left out; its cell counts as a hole. Then turn
// each board 100 times and check that no stone, and no line as links.js
// draws it (stubs included), ever reaches into the upland.
function dealOnly() {
  const N = 30
  let holes = 0, pairs = 0
  for (let s = 0; s < N; s++) {
    const seed = 1031 + s * 7919
    const board = new Board(seed)
    const words = board.pairs.map((p) => p.entry)
    const fail = (why) => {
      console.error(`seed ${seed}: ${why}`)
      process.exit(1)
    }
    if (words.some((e) => !e)) fail('a pair was left without a word')
    if (new Set(words.map((e) => e.word)).size !== words.length) fail('a word was dealt twice')
    if (words.some((e) => e.nodeal)) fail('a nodeal word was dealt')
    if (words.some((e) => compSize(e) < 12)) fail('a word from a small component was dealt')
    if (board.tiles.some((t, i) => t.id !== i || t.pair !== Math.floor(i / 2))) fail('ids not renumbered')
    const touches = (x, z, m) => touchesUpland(board.island, x - m, z - m, x + m, z + m)
    if (board.tiles.some((t) => touchesUpland(board.island, t.x - 0.75, t.z - 0.5, t.x + 0.75, t.z + 0.5))) fail('a stone stands on the upland')
    const store = new LinkStore()
    const checked = new Set()
    for (let k = 0; k <= 100 && board.pairs.length; k++) {
      store.sync(board.desiredLinks(), k)
      for (const l of store.links.values()) {
        if (checked.has(l)) continue
        checked.add(l)
        for (let d = 0; d <= l.len; d += 0.05) {
          const [x, z] = pointAt(l, d)
          if (touches(x, z, 0)) fail(`a ${l.kind} line crosses the upland (${l.key})`)
        }
      }
      const movable = board.pairs.filter((p) => board.canTurn(p, k * 2.05))
      if (!movable.length) break
      const p = movable[k % movable.length]
      board.turn(p, board.chooseTurn(p, k * 2.05), k * 2.05)
    }
    pairs += board.pairs.length
    holes += layoutPairs(mulberry32(seed)).length - board.pairs.length
  }
  const dealable = LEXICON.filter((e) => !e.nodeal && compSize(e) >= 12).length
  console.log(
    `${String(ALL.length).padStart(3)} words · ${String(LEXICON.length).padStart(3)} playable · ${String(dealable).padStart(3)} dealable · ` +
      `grid ${GRID.cols}×${GRID.rows} · ${(pairs / N).toFixed(1)} pairs, ${(holes / N).toFixed(1)} cells empty`,
  )
}

// Each list runs in its own process (the lexicon is built once, at load), all
// at once, under a time limit: a deal that hangs fails the check instead of
// the run. Empty cells include those left over the upland.
async function dealCheck() {
  console.log('deal check: 30 seeds per list, 90 s limit each')
  const cases = [[0, 0], [0, 0.5], [300, 0], [200, 0.3], [128, 0], [90, 0], [60, 0], [40, 0.5], [20, 0]]
  const runs = cases.map(
    ([n, nodeal]) =>
      new Promise((resolve) => {
        const child = spawn(process.execPath, [fileURLToPath(import.meta.url), '--deal-only', '--words', String(n), '--nodeal', String(nodeal)])
        let out = ''
        let err = ''
        child.stdout.on('data', (d) => (out += d))
        child.stderr.on('data', (d) => (err += d))
        const timer = setTimeout(() => child.kill(), 90000)
        child.on('close', (code, signal) => {
          clearTimeout(timer)
          resolve({ n, nodeal, ok: code === 0, text: signal ? 'the deal hung' : (code === 0 ? out : err).trim() })
        })
      }),
  )
  let ok = true
  for (const r of await Promise.all(runs)) {
    const label = `${r.n ? `${r.n} sampled` : 'full list'}${r.nodeal ? `, ${r.nodeal * 100}% nodeal` : ''}`.padEnd(24)
    console.log(`  ${label} ${r.ok ? 'ok  ' : 'FAIL'}  ${r.text}`)
    ok &&= r.ok
  }
  if (!ok) process.exit(1)
}
