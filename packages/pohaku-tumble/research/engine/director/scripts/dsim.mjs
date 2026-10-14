// dsim.mjs — Jukugo's real Board driven by a faithful model of its Director.
//
// Run `node prepare.mjs` first (it builds .build/ from jukugo-tumble/src).
//   LEX=<tier.json | jukugo>  CFG='<json>'  node dsim.mjs      → one JSON line
//
// What is modelled from director.js / main.js / scene3d.js, line for line:
//  - the clock: Director.update runs every frame (CFG.dt, default 1/30 s);
//    start(): first background beat at 3.6 s, first note check at 1.7 s
//  - the camera drift of main.js updateView (ppu, tx, tz, yaw, pitch as
//    functions of time, no user input) and Scene3D.project for an orthographic
//    camera, so inView(0.1) / inView(-0.05) / inView(0.2) pick the same pairs
//    the app would; CFG.view = {w,h} (default 1280×800) or "full" (every pair
//    always in view, inner = all, capacity 3)
//  - rolling(): a pair is busy from its drop-in (start = 0.15 + 0.035·d +
//    U(0,0.12) [+0.06 for the 2nd tile], 0.7 s) and for 0.12 + 0.86 s after a turn
//  - background: every 1.5 + U(0,1.1) s, one random pair from the visible,
//    un-noted, idle pairs that last turned > 6 s ago
//  - notes: capacity by width (1/2/3/4), a check every 0.45 s (0.9–1.7 s
//    after opening one), pickForNote's score (screen distance from the other
//    cards, a random jitter, −300 for a pair that turned < 4 s ago); a note
//    turns at +1.15 s, then 4.2–5.8 s later, then closes 3.4 s after that;
//    it closes early when the camera drifts off it (inView(-0.05)), and it
//    retires (turnsLeft = 0) the first time it finds nowhere to turn
//
// Director variants (CFG keys, all off = stock Jukugo):
//  bgRetry   0       stock: a chosen pair with no legal turn loses the beat
//            N       try up to N more pool pairs (without replacement) that beat
//            "legal" pick only among pool pairs that have a legal turn
//  noteMin   0       stock pickForNote
//            k       a pair with fewer than k legal turns scores −1000 (picked
//                    only when nothing else is in the inner frame)
//  noteTwo   true    also −1000 for a pair that cannot make two turns in a row
//                    (no legal first turn whose word has a legal onward turn)
//  noteLook  true    a noted pair's first turn weights options with no onward
//                    turn ×0.05, so the card's second turn has somewhere to go
//  allowPrev true    when nothing else is legal, a pair may turn back to the
//                    word it just left (a bounce) — background and notes alike
//  look      x       every turn: options whose word would be frozen on arrival
//                    are weighted ×x (Board-side; off by default)
//  hist      x       every turn: options the pair showed in its last 6 words
//                    are weighted ×x (passed to chooseTurn by the Director)
//  bgRetry   "fresh" pick among pool pairs that have a legal turn to a word
//                    not in their last 6; else among pairs with any legal
//                    turn (as "legal"); else lose the beat
//  noteStrict true   noteMin / noteTwo / noteFresh are hard filters: no note
//                    opens rather than one on a pair that fails them
//  freshW    x       with bgRetry "legal": a legal pool pair with no turn to a
//                    word outside its last 6 is drawn with weight x (others 1)
//  bounceW   x       with bgRetry "legal": a pool pair whose only way out is a
//                    bounce (allowPrev) is drawn with weight x (others 1)
//  release   s       every s seconds, for up to 2 in-view pairs that are frozen
//                    (or, with releaseFresh, have no turn to a word outside
//                    their last 6), find a word they need that sits on a pair
//                    out of view (not even inView(-0.05)) and turn that pair
//                    silently by the normal rules, freeing the word. Off-screen
//                    turns are counted apart (offTurnsPerMin), not in the pace.
//  noteFresh true    −1000 (or filtered, with noteStrict) for a pair with no
//                    legal turn to a word outside its last 6
//
// Board knobs passed through to the patched board.js: dealMin, matchMin,
// linkMax, scaleFloor, cols, rows, horizontalOnly, slab.
const cfg = JSON.parse(process.env.CFG || '{}')
globalThis.SIM = cfg
const { Board } = await import('./.build/board.js')
const { BOUNDS, mulberry32 } = await import('./.build/field.js')
const { LEXICON, turns, degree } = await import('./.build/lexicon.sim.js')

const SEEDS = cfg.seeds ?? 10
const DUR = cfg.duration ?? 3600
const DT = cfg.dt ?? 1 / 30
const VIEW = cfg.view ?? { w: 1280, h: 800 }
const FULL = VIEW === 'full'
const CHECKPOINTS = [600, 1800, 3600, 7200].filter((c) => c <= DUR)

// ── camera (main.js updateView + Scene3D.setView/project) ──────────────────
const TAU = Math.PI * 2
const clampX = (x) => Math.max(BOUNDS.x0 + 6, Math.min(BOUNDS.x1 - 6, x))
const clampZ = (z) => Math.max(BOUNDS.z0 + 4, Math.min(BOUNDS.z1 - 4, z))
function viewAt(t) {
  const { w, h } = FULL ? { w: 1280, h: 800 } : VIEW // ("full": nominal 1280×800 camera, used only for note spacing)
  const base = Math.max(34, Math.min(60, Math.min(w, h) / 17))
  return {
    ppu: base * (1 + 0.035 * Math.sin((t / 53) * TAU)),
    tx: clampX(2.5 * Math.sin((t / 97) * TAU) + 1.4 * Math.sin((t / 41) * TAU)),
    tz: clampZ(1.8 * Math.sin((t / 83) * TAU + 1)),
    yaw: ((-3 + 5 * Math.sin((t / 120) * TAU)) * Math.PI) / 180,
    pitch: ((55 + 2.5 * Math.sin((t / 71) * TAU)) * Math.PI) / 180,
  }
}
function makeProject(v) {
  const { w, h } = FULL ? { w: 1280, h: 800 } : VIEW
  const hw = w / 2 / v.ppu
  const hh = h / 2 / v.ppu
  const cy = Math.cos(v.yaw), sy = Math.sin(v.yaw), cp = Math.cos(v.pitch), sp = Math.sin(v.pitch)
  return (x, y, z) => {
    const dx = x - v.tx, dz = z - v.tz
    const nx = (dx * cy - dz * sy) / hw
    const ny = (-sp * sy * dx + cp * y - sp * cy * dz) / hh
    return [((nx + 1) / 2) * w, ((1 - ny) / 2) * h]
  }
}
const capacity = FULL ? 3 : VIEW.w < 520 ? 1 : VIEW.w < 700 ? 2 : VIEW.w < 1440 ? 3 : 4

// ── legal-turn helpers (the same rules chooseTurn applies) ─────────────────
function legalCount(board, p, prevOverride) {
  const prev = prevOverride !== undefined ? prevOverride : p.history.at(-1)?.word
  let n = 0
  for (const i of [0, 1]) for (const e of turns(p.entry, i)) if (!board.used.has(e.word) && e.word !== prev) n++
  return n
}
// Can `entry` turn anywhere if it arrives on this pair, having just left `from`?
// (`from` leaves the board as `entry` arrives, so it is no longer "used" — but it is prev.)
function onward(board, entry, from) {
  for (const i of [0, 1]) for (const e of turns(entry, i)) if (e.word !== from.word && !board.used.has(e.word)) return true
  return false
}
function freshCount(board, p) {
  const prev = p.history.at(-1)?.word
  const hist = new Set(p.history.map((e) => e.word))
  let n = 0
  for (const i of [0, 1]) for (const e of turns(p.entry, i)) if (!board.used.has(e.word) && e.word !== prev && !hist.has(e.word)) n++
  return n
}
function canTwo(board, p) {
  const prev = p.history.at(-1)?.word
  for (const i of [0, 1]) for (const e of turns(p.entry, i)) {
    if (board.used.has(e.word) || e.word === prev) continue
    if (onward(board, e, p.entry)) return true
  }
  return false
}

const res = { lexicon: LEXICON.length, deg5: LEXICON.filter((e) => degree(e) >= 5).length, runs: [] }
for (let s = 0; s < SEEDS; s++) {
  const seed = 1031 + s * 7919
  Math.random = mulberry32(seed ^ 0x9e3779b9) // chooseTurn and the Director draw from this
  let board
  try {
    board = new Board(seed)
  } catch (e) {
    res.runs.push({ seed, dealt: false, error: String(e.message) })
    continue
  }
  const P = board.pairs
  const N = P.length
  // ── state ──
  const lastTurn = new Map()
  const busyUntil = new Map()
  const v0 = viewAt(0)
  for (const p of P) {
    const d = Math.hypot(p.x - v0.tx, p.z - v0.tz)
    const start = 0.15 + d * 0.035 + Math.random() * 0.12
    busyUntil.set(p, start + 0.06 + 0.7)
  }
  const notes = [] // {pair, nextTurn, turnsLeft, turned, closing}
  let nextBackground = 3.6
  let nextRelease = 5
  let nextNoteCheck = 1.7
  // ── metrics ──
  const m = { bgBeats: 0, bgEmpty: 0, bgLost: 0, bgRetried: 0, bgTurns: 0, noteTurns: 0, notesOpened: 0, notesDone: 0,
    noteEarly: 0, noteZero: 0, noteDrift: 0, repeats: 0, bounces: 0, turnsDone: 0, offTurns: 0 }
  const turnCount = new Map(P.map((p) => [p, 0]))
  const exposure = new Map(P.map((p) => [p, 0]))
  const seen = new Set(P.map((p) => p.entry.word))
  let linkedSum = 0, linkedN = 0, linkedVisSum = 0
  let stuckSum = 0, stuckVisSum = 0, frozenSum = 0, frozenVisSum = 0, deadSum = 0, stuckN = 0, stuckVisN = 0
  let stillSum = 0, stillN = 0, visSum = 0, visN = 0
  const atCheckpoint = {}

  const rolling = (p, now) => now < (busyUntil.get(p) ?? 0)
  const notedSet = () => new Set(notes.filter((n) => !n.closing).map((n) => n.pair))
  const hasNote = (p) => notes.some((n) => n.pair === p && !n.closing)

  const lookWeight = (x) => (entry, index, pair) => (onward(board, entry, pair.entry) ? 1 : x)
  function choose(pair, extraWeight) {
    let w = null
    if (cfg.look != null || cfg.hist != null || extraWeight) {
      const a = cfg.look != null ? lookWeight(cfg.look) : null
      const hist = cfg.hist != null ? new Set(pair.history.map((e) => e.word)) : null
      w = (entry, index, p) => (a ? a(entry, index, p) : 1) * (extraWeight ? extraWeight(entry, index, p) : 1) * (hist && hist.has(entry.word) ? cfg.hist : 1)
    }
    let choice = board.chooseTurn(pair, w ? { weight: w } : undefined)
    if (!choice && cfg.allowPrev && pair.history.length) {
      // let chooseTurn consider the word it just left: hide prev for one call
      pair.history.push({ word: '\u0000' })
      choice = board.chooseTurn(pair, w ? { weight: w } : undefined)
      pair.history.pop()
      if (choice) choice.bounce = true
    }
    return choice
  }
  function turnPair(pair, now, extraWeight) {
    if (rolling(pair, now)) return false
    const choice = choose(pair, extraWeight)
    if (!choice) return false
    const recent = new Set(pair.history.map((e) => e.word))
    if (recent.has(choice.entry.word)) m.repeats++
    if (choice.bounce) m.bounces++
    board.turn(pair, choice)
    seen.add(choice.entry.word)
    busyUntil.set(pair, now + 0.12 + 0.86)
    lastTurn.set(pair, now)
    turnCount.set(pair, turnCount.get(pair) + 1)
    m.turnsDone++
    return true
  }
  function closeNote(n, now, why) {
    if (n.closing) return
    n.closing = now
    if (why === 'drift' && n.turned < 2 && n.turnsLeft > 0) m.noteDrift++
  }

  let visible = [], rough = null, proj = null
  for (let step = 0; ; step++) {
    const now = step * DT
    if (now > DUR) break
    // camera + view sets
    const v = viewAt(now)
    proj = makeProject(v)
    const { w, h } = FULL ? { w: 1280, h: 800 } : VIEW
    const inView = (margin) =>
      FULL ? P : P.filter((p) => {
        const [x, y] = proj(p.x, 0.5, p.z)
        return x > w * margin && x < w * (1 - margin) && y > h * (margin + 0.06) && y < h * (1 - margin - 0.04)
      })
    visible = inView(0.1)
    rough = new Set(inView(-0.05))

    // ── noted words ──
    for (const n of notes) {
      if (n.closing) continue
      if (!rough.has(n.pair)) { closeNote(n, now, 'drift'); continue }
      if (now < n.nextTurn) continue
      if (n.turnsLeft > 0) {
        const extra = cfg.noteLook && n.turned === 0 && n.turnsLeft >= 2 ? (entry, index, p) => (onward(board, entry, p.entry) ? 1 : 0.05) : null
        if (turnPair(n.pair, now, extra)) {
          m.noteTurns++
          n.turned++
          n.turnsLeft--
          n.nextTurn = now + (n.turnsLeft > 0 ? 4.2 + Math.random() * 1.6 : 3.4)
        } else {
          n.nextTurn = now + 0.6
          if (!rolling(n.pair, now)) {
            n.turnsLeft = 0
            m.noteEarly++
            if (n.turned === 0) m.noteZero++
          }
        }
      } else {
        if (n.turned >= 2) m.notesDone++
        closeNote(n, now, 'done')
      }
    }
    // drop closed notes after their 0.9 s fade (they no longer count anywhere)
    for (let i = notes.length - 1; i >= 0; i--) if (notes[i].closing && now - notes[i].closing >= 0.9) notes.splice(i, 1)

    // ── open a note ──
    if (now >= nextNoteCheck) {
      nextNoteCheck = now + 0.45
      const open = notes.filter((n) => !n.closing)
      if (open.length < capacity) {
        const inn = new Set(inView(0.2))
        const anchors = open.map((n) => proj(n.pair.x, 1, n.pair.z))
        let best = null, bestScore = -Infinity
        for (const p of visible) {
          if (!inn.has(p) || hasNote(p) || rolling(p, now)) continue
          const [x, y] = proj(p.x, 1, p.z)
          let far = Infinity
          for (const [ax, ay] of anchors) far = Math.min(far, Math.hypot(ax - x, ay - y))
          let score = Math.min(far, 420) + Math.random() * 160 - (now - (lastTurn.get(p) ?? -99) < 4 ? 300 : 0)
          let fails = 0
          if (cfg.noteMin && legalCount(board, p) < cfg.noteMin) fails++
          if (cfg.noteTwo && !canTwo(board, p)) fails++
          if (cfg.noteFresh && freshCount(board, p) === 0) fails++
          if (fails && cfg.noteStrict) continue
          score -= 1000 * fails
          if (score > bestScore) { best = p; bestScore = score }
        }
        if (best) {
          notes.push({ pair: best, nextTurn: now + 1.15, turnsLeft: 2, turned: 0, closing: null })
          m.notesOpened++
          nextNoteCheck = now + 0.9 + Math.random() * 0.8
        }
      }
    }

    // ── off-screen release ──
    if (cfg.release && now >= nextRelease) {
      nextRelease = now + cfg.release
      const byWord = new Map(P.map((q) => [q.entry.word, q]))
      let done = 0
      for (const p of visible) {
        if (done >= 2) break
        const needy = cfg.releaseFresh ? freshCount(board, p) === 0 : legalCount(board, p) === 0
        if (!needy) continue
        const prev = p.history.at(-1)?.word
        const hist = new Set(p.history.map((e) => e.word))
        let freed = false
        for (const i of [0, 1]) {
          for (const e of turns(p.entry, i)) {
            if (e.word === prev || (cfg.releaseFresh && hist.has(e.word))) continue
            const q = byWord.get(e.word)
            if (!q || q === p || rough.has(q) || rolling(q, now)) continue
            const choice = board.chooseTurn(q)
            if (!choice) continue
            board.turn(q, choice) // silent: no notes, no pace, no lastTurn (it is off screen)
            m.offTurns++
            freed = true
            break
          }
          if (freed) break
        }
        if (freed) done++
      }
    }

    // ── background pulse ──
    if (now >= nextBackground) {
      m.bgBeats++
      for (const p of visible) exposure.set(p, exposure.get(p) + 1)
      const noted = notedSet()
      let pool = visible.filter((p) => !noted.has(p) && !rolling(p, now) && now - (lastTurn.get(p) ?? -99) > 6)
      if (!pool.length) m.bgEmpty++
      else {
        let ok = false
        if (cfg.bgRetry === 'fresh') {
          let cand = pool.filter((p) => freshCount(board, p) > 0)
          if (!cand.length) cand = pool.filter((p) => legalCount(board, p) > 0 || (cfg.allowPrev && p.history.length && legalCount(board, p, null) > 0))
          if (cand.length) ok = turnPair(cand[Math.floor(Math.random() * cand.length)], now)
          if (ok && cand.length < pool.length) m.bgRetried++
        } else if (cfg.bgRetry === 'legal') {
          const legal = pool.filter((p) => legalCount(board, p) > 0 || (cfg.allowPrev && p.history.length && legalCount(board, p, null) > 0))
          if (legal.length && (cfg.freshW != null || cfg.bounceW != null)) {
            const ws = legal.map((p) => (cfg.bounceW != null && legalCount(board, p) === 0 ? cfg.bounceW : cfg.freshW != null && freshCount(board, p) === 0 ? cfg.freshW : 1))
            let r = Math.random() * ws.reduce((a, b) => a + b, 0)
            let pick = legal.at(-1)
            for (let i = 0; i < legal.length; i++) if ((r -= ws[i]) <= 0) { pick = legal[i]; break }
            ok = turnPair(pick, now)
          } else if (legal.length) ok = turnPair(legal[Math.floor(Math.random() * legal.length)], now)
          if (ok && legal.length < pool.length) m.bgRetried++
        } else {
          const tries = 1 + (cfg.bgRetry ?? 0)
          pool = [...pool]
          for (let k = 0; k < tries && pool.length && !ok; k++) {
            const j = Math.floor(Math.random() * pool.length)
            const p = pool.splice(j, 1)[0]
            ok = turnPair(p, now)
            if (ok && k > 0) m.bgRetried++
          }
        }
        if (ok) m.bgTurns++
        else m.bgLost++
      }
      nextBackground = now + 1.5 + Math.random() * 1.1
    }

    // ── samples ──
    if (step % Math.round(2 / DT) === 0) {
      // linked: Board.linkedFraction (all pairs); linkedVis: share of in-view pairs on a root line
      const linkedPairs = new Set()
      for (const l of board.desiredLinks().values()) if (l.kind === 'pair') linkedPairs.add(l.a.pair).add(l.b.pair)
      linkedSum += linkedPairs.size / N
      linkedVisSum += visible.length ? visible.filter((p) => linkedPairs.has(p.id)).length / visible.length : 0
      linkedN++
      visSum += visible.length; visN++
    }
    if (step % Math.round(10 / DT) === 0 && now > 0) {
      const vis = new Set(visible)
      let stuck = 0, stuckV = 0, frozen = 0, frozenV = 0, dead = 0
      for (const p of P) {
        const prev = p.history.at(-1)?.word
        const n = legalCount(board, p)
        // frozen: cannot turn under this config's rules (with allowPrev, prev counts as a way out)
        const canBounce = cfg.allowPrev && prev && legalCount(board, p, null) > 0
        const isStuck = n === 0
        const isFrozen = isStuck && !canBounce
        // dead: no turn except back to prev exists in the whole lexicon (permanent under stock rules)
        const isDead = [0, 1].every((i) => turns(p.entry, i).every((e) => e.word === prev))
        stuck += isStuck; frozen += isFrozen; dead += isDead
        if (vis.has(p)) { stuckV += isStuck; frozenV += isFrozen }
      }
      stuckSum += stuck / N; frozenSum += frozen / N; deadSum += dead / N; stuckN++
      if (vis.size) { stuckVisSum += stuckV / vis.size; frozenVisSum += frozenV / vis.size; stuckVisN++ }
      // still: share of in-view pairs that have not turned for 60 s (counted after 120 s)
      if (now >= 120 && vis.size) {
        stillSum += [...vis].filter((p) => now - (lastTurn.get(p) ?? 0) > 60).length / vis.size
        stillN++
      }
      for (const c of CHECKPOINTS) if (now >= c - DT / 2 && atCheckpoint[c] == null) {
        atCheckpoint[c] = { stuck: stuck / N, frozen: frozen / N, frozenVis: vis.size ? frozenV / vis.size : 0, dead: dead / N }
      }
    }
  }
  // fairness: among pairs ever in view at a background beat
  const everVis = P.filter((p) => exposure.get(p) > 0)
  const counts = everVis.map((p) => turnCount.get(p)).sort((a, b) => b - a)
  const total = counts.reduce((a, b) => a + b, 0)
  const k = Math.ceil(0.2 * counts.length)
  const top20 = total ? counts.slice(0, k).reduce((a, b) => a + b, 0) / total : 0
  // exposure-normalised: same share, computed on turns per beat in view
  const rates = everVis.map((p) => turnCount.get(p) / exposure.get(p)).sort((a, b) => b - a)
  const rtot = rates.reduce((a, b) => a + b, 0)
  const top20rate = rtot ? rates.slice(0, k).reduce((a, b) => a + b, 0) / rtot : 0
  const idle = everVis.filter((p) => turnCount.get(p) === 0).length / Math.max(1, everVis.length)
  res.runs.push({
    seed, dealt: true, pairs: N, visible: visSum / visN, everVis: everVis.length,
    bgBeats: m.bgBeats,
    beatsLost: (m.bgLost + m.bgEmpty) / m.bgBeats, lostNoTurn: m.bgLost / m.bgBeats, lostEmpty: m.bgEmpty / m.bgBeats,
    retried: m.bgRetried / Math.max(1, m.bgTurns),
    turnsPerMin: m.turnsDone / (DUR / 60), offTurnsPerMin: m.offTurns / (DUR / 60), noteTurnShare: m.noteTurns / Math.max(1, m.turnsDone),
    notesPerMin: m.notesOpened / (DUR / 60),
    noteEarly: m.noteEarly / Math.max(1, m.notesOpened), noteZero: m.noteZero / Math.max(1, m.notesOpened),
    noteDrift: m.noteDrift / Math.max(1, m.notesOpened), noteDone: m.notesDone / Math.max(1, m.notesOpened),
    stuck: stuckSum / stuckN, frozen: frozenSum / stuckN, dead: deadSum / stuckN,
    stuckVis: stuckVisSum / Math.max(1, stuckVisN), frozenVis: frozenVisSum / Math.max(1, stuckVisN),
    still60: stillSum / Math.max(1, stillN),
    linked: linkedSum / linkedN, linkedVis: linkedVisSum / linkedN,
    repeatRate: m.repeats / Math.max(1, m.turnsDone), bounceRate: m.bounces / Math.max(1, m.turnsDone),
    seenFrac: seen.size / LEXICON.length,
    top20, top20rate, idle,
    cp: atCheckpoint,
  })
}
const ok = res.runs.filter((r) => r.dealt)
const avg = (key) => ok.reduce((s, r) => s + r[key], 0) / Math.max(1, ok.length)
const r3 = (x) => +x.toFixed(3)
const out = {
  name: cfg.name, lexicon: res.lexicon, deg5: res.deg5, grid: `${cfg.cols ?? 9}x${cfg.rows ?? 8}${cfg.scaleFloor ? 's' : ''}`,
  view: FULL ? 'full' : `${VIEW.w}x${VIEW.h}`, dealt: `${ok.length}/${res.runs.length}`,
}
if (ok.length) {
  for (const key of ['pairs', 'visible', 'everVis', 'bgBeats']) out[key] = +avg(key).toFixed(1)
  for (const key of ['beatsLost', 'lostNoTurn', 'lostEmpty', 'retried', 'stuck', 'frozen', 'dead', 'stuckVis', 'frozenVis', 'still60',
    'noteEarly', 'noteZero', 'noteDrift', 'noteDone', 'linked', 'linkedVis', 'repeatRate', 'bounceRate', 'seenFrac', 'top20', 'top20rate', 'idle',
    'turnsPerMin', 'offTurnsPerMin', 'notesPerMin', 'noteTurnShare']) out[key] = r3(avg(key))
  for (const c of CHECKPOINTS) {
    const xs = ok.map((r) => r.cp[c]).filter(Boolean)
    if (xs.length) out[`frozen@${c / 60}m`] = r3(xs.reduce((s, x) => s + x.frozen, 0) / xs.length)
  }
  out.cfg = cfg
}
console.log(JSON.stringify(out))
