// (F9b) What a battle did with its long hulls: read off the match as it is
// folded (sim/run.mjs foldJob's `probe`: G at every trace line, and the
// match's events as they are taken), never from the trace, which prints no
// facing, and never written into it (the corpus's hashes stay the
// battle's). sim/play-report.mjs judges its counts against DESIGN §4.2.9's
// F9b thresholds (Howdahs move in ≥ 90% of their movement phases; ≥ 90% of
// long-hull moves end where the hull can pivot at least one way; riders
// disembark from a long hull in ≥ 50% of battles), and sim/corpus-add.mjs's
// hull/ needs (`hullpivot`, `reverse`, `hullcharge`, `hullbail`) read it.
// It reads only G's units and nav and the events (a unit with no `t.fp`
// counts nothing), so it runs on any code: older code has no long hull.
//
//   hullProbe(q) → { trace(line, G), events(G, events), result() }
//   q: the code under test's query set (core/index.js's `q`: isEngaged)
//
// Each event is looked at on the first trace line after it is emitted, or
// as the events are taken where no line follows (G.out, the match's own
// list, kept by foldJob and emptied as it takes them), so the nav it is
// judged on is the one the hull's walk left: an AI battle's events arrive
// all at once, after its last line, and the table by then is the battle's
// end's. Which log entry each event answers is counted from the takes
// (foldJob takes the start's events once, then each entry's).
//
// result():
//   hulls      the footprint units fielded, both seats', as the battle began
//   phases     a hull's movement phases: each phase.start of a movement
//              phase, for each hull of the active seat standing on the
//              table and not engaged as the phase began (G at the trace
//              line before it: an engaged unit only falls back); `moved`
//              those in which the hull moved (a unit.move of its own: a
//              move, an advance or a fall back), `engaged` the phases left
//              out for it
//   moves      every hull walk of a movement phase (its unit.move), and
//              `roomy` those that ended where the hull could pivot at least
//              one way (G.nav.hullRoom on its terrain, the memo's bits: the
//              AI's room term's own test, in its plans' mode)
//   charges    hull walks of a charge (a unit.move in a charge phase or a
//              charge's end), `chargeRoomy` as `roomy`
//   pivots, reverses   the pivots and the backing segments of every hull
//              walk (its path: a pivot a repeated point with a new f; a
//              backing step one against its own heading), and `tight` the
//              pivots made where the hull's bounding disc can't stand (the
//              cell's clearance under R − 0.06 in its mode): a turn only
//              the footprint fits
//   steps      riders stepping off a long hull of their own accord (a
//              unit.disembark, not forced, its hull a footprint unit), and
//              `bailed` those bailing out of a destroyed one (forced)
//   down       long hulls destroyed (unit.destroyed), and `downLoaded`
//              those of them with riders aboard as they went (a forced
//              unit.disembark from them in the same take)
//   walks      per hull walk: { entry, u, phase, f, pivots, tight,
//              reverses, room } (`entry` the log entry it answers, −1 the
//              start's: an AI battle's every walk), for corpus-add's needs
export function hullProbe(q) {
  const r = { hulls: 0, phases: 0, moved: 0, engaged: 0, moves: 0, roomy: 0, charges: 0, chargeRoomy: 0, pivots: 0, reverses: 0, tight: 0, steps: 0, bailed: 0, down: 0, downLoaded: 0, walks: [] }
  const loaded = new Set()
  const DIRS = [[0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1]]
  let first = true, seen = 0, takes = 0, phase = null, open = null
  // each hull's standing at the last trace line (id → { side, up, engaged })
  let last = new Map()
  const fpOf = (G, id) => G.units.find((u) => u.id === id && u.t.fp)
  const modeOf = (u) => (u.t.move === 'wreck' ? 'wreck' : 'walk')
  const close = () => {
    if (!open) return
    for (const [id, moved] of open.hulls) {
      r.phases++
      if (moved) r.moved++
    }
    open = null
  }
  const look = (G, e) => {
    if (e.t === 'phase.start') {
      close()
      phase = e.phase
      if (e.phase === 'move') {
        open = { hulls: new Map() }
        for (const [id, h] of last) {
          if (h.side !== e.side || !h.up) continue
          if (h.engaged) r.engaged++
          else open.hulls.set(id, false)
        }
      }
    } else if (e.t === 'unit.move') {
      const u = fpOf(G, e.u)
      if (!u) return
      const nav = G.nav, mode = modeOf(u), path = e.path ?? []
      let pivots = 0, tight = 0, reverses = 0
      for (let i = 1; i < path.length; i++) {
        const a = path[i - 1], b = path[i]
        if (a.x === b.x && a.z === b.z) {
          if (a.f === b.f) continue
          pivots++
          const c = nav.index(b.x, b.z)
          if (c >= 0 && nav.clearance(c, mode === 'wreck' ? 'wreck' : 'all') < u.t.fp.R - 0.06) tight++
        } else {
          const d = DIRS[b.f]
          if ((b.x - a.x) * d[0] + (b.z - a.z) * d[1] < 0) reverses++
        }
      }
      const to = e.to ?? path[path.length - 1]
      const c = to ? nav.index(to.x, to.z) : -1
      const room = c >= 0 && Number.isInteger(to.f) && nav.hullRoom(c, to.f, u.t.fp, mode)
      r.pivots += pivots
      r.tight += tight
      r.reverses += reverses
      if (phase === 'move') {
        r.moves++
        if (room) r.roomy++
        if (open?.hulls.has(u.id)) open.hulls.set(u.id, true)
      } else {
        r.charges++
        if (room) r.chargeRoomy++
      }
      r.walks.push({ entry: takes - 1, u: u.id, phase, f: to?.f, pivots, tight, reverses, room })
    } else if (e.t === 'unit.disembark') {
      if (!fpOf(G, e.v)) return
      if (e.forced) {
        r.bailed++
        if (!loaded.has(e.v)) (loaded.add(e.v), r.downLoaded++)
      } else r.steps++
    } else if (e.t === 'unit.destroyed' && fpOf(G, e.u)) r.down++
  }
  const start = (G) => {
    if (!first) return
    first = false
    r.hulls = G.units.filter((u) => u.t.fp).length
  }
  // the hulls as this line finds them, for the next movement phase's start
  const stand = (G) => {
    last = new Map()
    for (const u of G.units) if (u.t.fp) last.set(u.id, { side: u.side, up: u.alive > 0 && !u.aboard, engaged: u.alive > 0 && q.isEngaged(G, u) })
  }
  return {
    trace(line, G) {
      start(G)
      const out = G.out ?? []
      for (; seen < out.length; seen++) look(G, out[seen])
      stand(G)
    },
    events(G, events) {
      start(G)
      for (; seen < events.length; seen++) look(G, events[seen])
      seen = 0
      takes++
    },
    result: () => {
      close()
      return { ...r }
    },
  }
}
