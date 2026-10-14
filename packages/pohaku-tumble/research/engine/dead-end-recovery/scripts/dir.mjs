// Director-mode driver: a time-stepped model of Jukugo's Director (director.js)
// over the real Board, so that recovery rates can be given per minute of play.
//
// Modelled from director.js / main.js at 1280x800:
//   - background pulse every U(1.5, 2.6) s, first at 3.6 s; picks a random pair
//     that is in view (margin 0.1), not noted, not rolling, and has not turned
//     in the last 6 s. Stock: a pair with nowhere to turn loses the beat.
//   - notes: capacity 3; a check every 0.45 s opens one on a pair inside the
//     inner view (margin 0.2), spaced from the open notes (score as
//     pickForNote); first turn 1.15 s after opening, second 4.2-5.8 s later,
//     close 3.4 s after the last turn; a failed turn retires the note; a note
//     whose pair drifts out of view (margin -0.05) closes.
//   - camera drift exactly as main.js updateView (ppu, tx, tz, yaw, pitch),
//     orthographic projection as Scene3D (block midpoint y = 0.5).
//   - a block is "rolling" for 0.12 + 0.86 s after a turn starts (two rolls
//     for a double tumble).
// Not modelled: user clicks, the drop-in at the start (Director starts at 0),
// reserved chrome rectangles, reduce-motion.
//
// CFG adds to sim2's knobs:
//   minutes:  play time per seed (default 25)
//   bgRetry:  background beat tries up to N other pool pairs on a frozen pick
//   noteSkipFrozen: pickForNote skips pairs with no stock-legal turn
//   R / noteR: seconds a pair must have been frozen before recovery may fire,
//              for background picks / for a noted pair (default R, noteR = 0)
//   seek:     probability a background beat goes to a visible pair frozen >= R s
//   offRedeal: silently re-deal one off-screen frozen pair per background beat (offMargin, default -0.15)
//   viewScale: multiply the view's world extent and drift (for scaled floors)
import { load, seedRandom, quantile } from './engine.mjs'

const cfg = JSON.parse(process.env.CFG || '{}')
const { RBoard, LEXICON } = await load(cfg)
const { BOUNDS } = await import('./.build/field.js')

const SEEDS = cfg.seeds ?? 10
const T = (cfg.minutes ?? 25) * 60
const DT = 0.05
const ROLL = 0.86
const W = 1280, H = 800
const VS = cfg.viewScale ?? 1
const R = cfg.R ?? 0
const NOTE_R = cfg.noteR ?? 0
const RECOVER = cfg.recover ?? []
const KINDS = ['unblock', 'back', 'dup', 'dt', 'dtprev', 'redeal']
const CAPACITY = 3

function viewAt(t) {
  const base = Math.max(34, Math.min(60, Math.min(W, H) / 17)) / VS
  const tau = Math.PI * 2
  const clampX = (x) => Math.max(BOUNDS.x0 + 6, Math.min(BOUNDS.x1 - 6, x))
  const clampZ = (z) => Math.max(BOUNDS.z0 + 4, Math.min(BOUNDS.z1 - 4, z))
  return {
    ppu: base * (1 + 0.035 * Math.sin((t / 53) * tau)),
    tx: clampX(VS * (2.5 * Math.sin((t / 97) * tau) + 1.4 * Math.sin((t / 41) * tau))),
    tz: clampZ(VS * 1.8 * Math.sin((t / 83) * tau + 1)),
    yaw: ((-3 + 5 * Math.sin((t / 120) * tau)) * Math.PI) / 180,
    pitch: ((55 + 2.5 * Math.sin((t / 71) * tau)) * Math.PI) / 180,
  }
}
function project(v, x, y, z) {
  const dx = x - v.tx, dz = z - v.tz
  const cy = Math.cos(v.yaw), sy = Math.sin(v.yaw)
  const sx = (dx * cy - dz * sy) * v.ppu + W / 2
  const sz = ((dx * sy + dz * cy) * Math.sin(v.pitch) - y * Math.cos(v.pitch)) * v.ppu + H / 2
  return [sx, sz]
}

const runs = []
for (let s = 0; s < SEEDS; s++) {
  const seed = 1031 + s * 7919
  seedRandom(seed ^ 0x2545f491)
  let board
  try {
    board = new RBoard(seed)
  } catch (e) {
    runs.push({ seed, dealt: false, error: String(e.message) })
    continue
  }
  const P = board.pairs.length
  const lastTurn = new Map()
  const rollUntil = new Map()
  const frozenSince = new Map()
  const spells = []
  const notes = [] // {pair, nextTurn, turnsLeft, turned}
  const fires = Object.fromEntries(KINDS.map((k) => [k, 0]))
  let bgBeats = 0, bgLost = 0, noteTries = 0, noteLost = 0, notesOpened = 0, notesNoTurn = 0, notesShort = 0
  let turnsDone = 0, tumbles = 0, repeats = 0, transientDups = 0, frozenPicks = 0
  let stuckSum = 0, stuckVisSum = 0, linkedSum = 0, linkedVisSum = 0, samples = 0, visCount = 0
  let handoff = null
  let offRedeals = 0
  const seen = new Set(board.pairs.map((p) => p.entry.word))
  const isFrozen = (p) => board.freeExits(p) === 0
  for (const p of board.pairs) if (isFrozen(p)) frozenSince.set(p, 0)

  let now = 0
  let v = viewAt(0)
  const inView = (margin) =>
    board.pairs.filter((p) => {
      const [x, y] = project(v, p.x, 0.5, p.z)
      return x > W * margin && x < W * (1 - margin) && y > H * (margin + 0.06) && y < H * (1 - margin - 0.04)
    })
  const rolling = (p) => now < (rollUntil.get(p) ?? -1)
  const noted = () => new Set(notes.map((n) => n.pair))

  const refreeze = () => {
    for (const p of board.pairs) {
      const f = isFrozen(p)
      if (f && !frozenSince.has(p)) frozenSince.set(p, now)
      else if (!f && frozenSince.has(p)) { spells.push(now - frozenSince.get(p)); frozenSince.delete(p) }
    }
  }
  const doTurn = (p, choice) => {
    const recent = new Set(p.history.map((e) => e.word))
    if (recent.has(choice.entry.word)) repeats++
    board.turn(p, choice)
    seen.add(choice.entry.word)
    turnsDone++
    tumbles++
    lastTurn.set(p, now)
    rollUntil.set(p, now + 0.12 + ROLL)
  }

  // Returns 'ok' | 'rolling' | 'none' | 'unblock' (a blocker turned; the pair may turn next)
  const turnPair = (p, rWait, visibleSet, notedSet) => {
    if (rolling(p)) return 'rolling'
    const choice = board.chooseTurn(p)
    if (choice) { doTurn(p, choice); refreeze(); return 'ok' }
    frozenPicks++
    if (!RECOVER.length || now - (frozenSince.get(p) ?? now) < rWait) return 'none'
    for (const kind of RECOVER) {
      const act = board.recover(p, kind, {
        dupFar: cfg.rDupFar ?? 0,
        redealMin: cfg.dealMin ?? 2,
        eligible: (q) => visibleSet.has(q) && !notedSet.has(q) && !rolling(q) && now - (lastTurn.get(q) ?? -99) > 6,
      })
      if (!act) continue
      fires[kind]++
      if (act.transientDup) transientDups++
      if (kind === 'dt' || kind === 'dtprev') {
        const recent = new Set(p.history.map((e) => e.word))
        board.turn(p, act.steps[0].choice)
        seen.add(act.steps[0].choice.entry.word)
        if (recent.has(act.steps[1].choice.entry.word)) repeats++
        board.turn(p, act.steps[1].choice)
        seen.add(act.steps[1].choice.entry.word)
        turnsDone++
        tumbles += 2
        lastTurn.set(p, now)
        rollUntil.set(p, now + 0.12 + 2 * ROLL + 0.15)
      } else if (kind === 'redeal') {
        const recent = new Set(p.history.map((e) => e.word))
        if (recent.has(act.steps[0].choice.entry.word)) repeats++
        board.setWord(p, act.steps[0].choice.entry)
        seen.add(act.steps[0].choice.entry.word)
        turnsDone++
        lastTurn.set(p, now)
        rollUntil.set(p, now + 1.2)
      } else {
        for (const st of act.steps) doTurn(st.pair, st.choice)
      }
      refreeze()
      if (act.handoff) { handoff = { pair: act.handoff, until: now + 8 }; return 'unblock' }
      return 'ok'
    }
    return 'none'
  }

  let nextBackground = 3.6
  let nextNoteCheck = 1.7
  let nextSample = 0
  for (now = 0; now < T; now += DT) {
    v = viewAt(now)
    const visible = inView(0.1)
    const visibleSet = new Set(visible)
    const roughly = new Set(inView(-0.05))

    // noted words
    for (let k = notes.length - 1; k >= 0; k--) {
      const n = notes[k]
      if (!roughly.has(n.pair)) { notes.splice(k, 1); continue }
      if (now < n.nextTurn) continue
      if (n.turnsLeft > 0) {
        const notedSet = noted()
        noteTries++
        const r = turnPair(n.pair, NOTE_R, visibleSet, notedSet)
        if (r === 'ok') {
          n.turnsLeft--
          n.turned++
          n.nextTurn = now + (n.turnsLeft > 0 ? 4.2 + Math.random() * 1.6 : 3.4)
        } else if (r === 'unblock') {
          n.nextTurn = now + 1.2 // a blocker has turned; the noted word takes the freed word shortly
        } else if (r === 'rolling') {
          noteTries--
          n.nextTurn = now + 0.6
        } else {
          // nowhere to turn: the note retires (director.js: turnsLeft = 0, closes 0.6 s later)
          noteLost++
          if (n.turned === 0) notesNoTurn++
          else notesShort++
          n.turnsLeft = 0
          n.nextTurn = now + 0.6
        }
      } else {
        notes.splice(k, 1)
      }
    }

    if (now >= nextNoteCheck) {
      nextNoteCheck = now + 0.45
      if (notes.length < CAPACITY) {
        const inner = new Set(inView(0.2))
        const anchors = notes.map((n) => project(v, n.pair.x, 1, n.pair.z))
        const nset = noted()
        let best = null, bestScore = -Infinity
        for (const p of visible) {
          if (!inner.has(p) || nset.has(p) || rolling(p)) continue
          if (cfg.noteSkipFrozen && isFrozen(p)) continue
          const [x, y] = project(v, p.x, 1, p.z)
          let far = Infinity
          for (const [ax, ay] of anchors) far = Math.min(far, Math.hypot(ax - x, ay - y))
          const score = Math.min(far, 420) + Math.random() * 160 - (now - (lastTurn.get(p) ?? -99) < 4 ? 300 : 0)
          if (score > bestScore) { best = p; bestScore = score }
        }
        if (best) {
          notes.push({ pair: best, nextTurn: now + 1.15, turnsLeft: 2, turned: 0 })
          notesOpened++
          nextNoteCheck = now + 0.9 + Math.random() * 0.8
        }
      }
    }

    if (now >= nextBackground) {
      const nset = noted()
      let done = false
      if (handoff && now < handoff.until && visibleSet.has(handoff.pair) && !nset.has(handoff.pair) && !rolling(handoff.pair)) {
        const hp = handoff.pair
        handoff = null
        bgBeats++
        const r = turnPair(hp, R, visibleSet, nset)
        done = r === 'ok' || r === 'unblock'
        if (!done) bgLost++
      } else {
        const pool = visible.filter((p) => !nset.has(p) && !rolling(p) && now - (lastTurn.get(p) ?? -99) > 6)
        if (pool.length) {
          bgBeats++
          let p = pool[Math.floor(Math.random() * pool.length)]
          if (cfg.seek && RECOVER.length && Math.random() < cfg.seek) {
            // SIM.seek: the beat goes to a visible pair frozen >= R seconds, if any
            const fz = pool.filter((q) => frozenSince.has(q) && now - frozenSince.get(q) >= R)
            if (fz.length) p = fz[Math.floor(Math.random() * fz.length)]
          }
          let r = turnPair(p, R, visibleSet, nset)
          done = r === 'ok' || r === 'unblock'
          for (let k = 0; !done && k < (cfg.bgRetry ?? 0); k++) {
            const p2 = pool[Math.floor(Math.random() * pool.length)]
            r = turnPair(p2, cfg.recoverOnRetry ? R : Infinity, visibleSet, nset)
            done = r === 'ok' || r === 'unblock'
          }
          if (!done) bgLost++
        }
      }
      nextBackground = now + 1.5 + Math.random() * 1.1

      // SIM.offRedeal: once per background beat, one frozen pair that is off screen (outside the
      // view by a margin of offMargin of the frame) is silently re-dealt a fresh word. Nobody sees it.
      if (cfg.offRedeal) {
        const near = new Set(inView(cfg.offMargin ?? -0.15))
        const off = board.pairs.filter((p) => frozenSince.has(p) && !near.has(p) && !nset.has(p))
        if (off.length) {
          const p = off[Math.floor(Math.random() * off.length)]
          const act = board.recover(p, 'redeal', { redealMin: cfg.dealMin ?? 2 })
          if (act) {
            board.setWord(p, act.steps[0].choice.entry)
            seen.add(act.steps[0].choice.entry.word)
            offRedeals++
            refreeze()
          }
        }
      }
    }

    if (now >= nextSample) {
      nextSample = now + 1
      samples++
      stuckSum += frozenSince.size / P
      const vis = visible.filter((p) => frozenSince.has(p)).length
      stuckVisSum += visible.length ? vis / visible.length : 0
      visCount += visible.length
      if (samples % 3 === 0) {
        // linked: board-wide (Board.linkedFraction); linkedVis: share of in-view pairs wired to another word
        const wired = new Set()
        for (const l of board.desiredLinks().values()) if (l.kind === 'pair') wired.add(l.a.pair).add(l.b.pair)
        linkedSum += wired.size / P
        linkedVisSum += visible.length ? visible.filter((p) => wired.has(p.id)).length / visible.length : 0
      }
    }
  }
  const censored = [...frozenSince.values()].map((s0) => T - s0)
  const all = [...spells, ...censored]
  const frozenTime = all.reduce((a, b) => a + b, 0)
  const min = T / 60
  runs.push({
    seed, dealt: true, pairs: P,
    visiblePairs: visCount / samples,
    bgPerMin: bgBeats / min,
    noteTriesPerMin: noteTries / min,
    tumblesPerMin: tumbles / min,
    beatsLost: (bgLost + noteLost) / Math.max(1, bgBeats + noteTries),
    bgLost: bgLost / Math.max(1, bgBeats),
    noteLost: noteLost / Math.max(1, noteTries),
    notesPerMin: notesOpened / min,
    notesNoTurnPerMin: notesNoTurn / min,
    notesShortPerMin: notesShort / min,
    frozenPicksPerMin: frozenPicks / min,
    stuck: stuckSum / samples,
    stuckVis: stuckVisSum / samples,
    linked: linkedSum / Math.max(1, Math.floor(samples / 3)),
    linkedVis: linkedVisSum / Math.max(1, Math.floor(samples / 3)),
    repeatRate: repeats / Math.max(1, turnsDone),
    seenFrac: seen.size / LEXICON.length,
    spellMeanS: all.length ? frozenTime / all.length : 0,
    spellP50S: quantile(all, 0.5),
    spellP90S: quantile(all, 0.9),
    // share of frozen pair-time in spells longer than 2 minutes
    long2mShare: frozenTime ? all.filter((x) => x > 120).reduce((a, b) => a + b, 0) / frozenTime : 0,
    transientDupsPerMin: transientDups / min,
    offRedealsPerMin: offRedeals / min,
    firesPerMin: Object.fromEntries(KINDS.map((k) => [k, fires[k] / min])),
  })
}

const ok = runs.filter((r) => r.dealt)
const avg = (f) => ok.reduce((s, r) => s + f(r), 0) / Math.max(1, ok.length)
const r3 = (x) => +x.toFixed(3)
const out = { name: cfg.name, mode: 'director', lexicon: LEXICON.length, grid: `${cfg.cols ?? 9}x${cfg.rows ?? 8}`, dealt: `${ok.length}/${runs.length}`, pairs: Math.round(avg((r) => r.pairs)) }
for (const k of Object.keys(ok[0] ?? {})) {
  if (['seed', 'dealt', 'pairs', 'firesPerMin'].includes(k)) continue
  out[k] = r3(avg((r) => r[k]))
}
out.firesPerMin = Object.fromEntries(KINDS.map((k) => [k, r3(avg((r) => r.firesPerMin[k]))]).filter(([, x]) => x > 0))
out.firesPerMinTotal = r3(Object.values(out.firesPerMin).reduce((a, b) => a + b, 0))
if (runs.some((r) => !r.dealt)) out.dealErrors = [...new Set(runs.filter((r) => !r.dealt).map((r) => r.error))]
console.log(JSON.stringify(out))
