// (F5a, DESIGN §4.2.12) What a battle did with the new races' three flags:
// read off the match as it is folded (sim/run.mjs foldJob's `probe`: G at
// every trace line, and the match's events as they are taken), never from
// the trace, and never written into it (the corpus's hashes stay the
// battle's). sim/play-report.mjs judges its counts against §4.2.9's F5a
// thresholds (a burrower tunnels, a swarm re-rolls, a swooper dives, each
// in ≥ 50% of the battles fielding it), and sim/corpus-add.mjs's races/
// needs (`burrowed`, `swarmed`, `swooped`) read it. It reads only G's units
// and nav and the events (a unit with none of the flags counts nothing), so
// it runs on any code: older code fields no burrower, swarm or swooper.
//
//   raceProbe(STEP) → { trace(line, G), events(G, events), result() }
//   STEP: the code under test's nav STEP (core/nav.js), the highest floor a
//   burrower may stand on
//
// Each event is looked at on the first trace line after it is emitted, or
// as the events are taken where no line follows (as sim/hull-probe.mjs
// does), so a walk is judged on the nav as its walk left it.
//
// result():
//   burrowers, swarms, swoopers   the units of each kind fielded, both
//              seats', as the battle began (burrowers by t.move 'burrow')
//   moves      every burrower's walk (its unit.move: a move, an advance, a
//              fall back, a charge's end), and `tunnelled` those whose
//              path crossed a cell a walker's disc can't stand on
//              (clearAll < r − 0.06) or rough ground (diff) it paid ×1 for:
//              the samples of its path at half a cell, as nav.walkable
//              takes them
//   above      the times a burrower stood on a floor above STEP at a trace
//              line (never, by the rules: reported beside the row)
//   swarmFights, rerolls, rerollDice   the fights a swarm struck (a melee
//              event of its own), the "Re-roll 1s (swarm)" rows among them
//              and their dice
//   swooperFights, dives   the fights a swooper struck, and those that
//              dived (its Wound row's "(dive, S…)" label: the fight of its
//              own charge turn)
export function raceProbe(STEP = 0.4) {
  const r = { burrowers: 0, swarms: 0, swoopers: 0, moves: 0, tunnelled: 0, above: 0, swarmFights: 0, rerolls: 0, rerollDice: 0, swooperFights: 0, dives: 0 }
  let first = true, seen = 0, striker = null
  const unitOf = (G, id) => G.units.find((u) => u.id === id)
  const tunnels = (G, u, path) => {
    const nav = G.nav
    for (let k = 1; k < path.length; k++) {
      const a = path[k - 1], b = path[k], n = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.z - a.z) / (nav.cell * 0.5)))
      for (let s = 0; s <= n; s++) {
        const i = nav.index(a.x + ((b.x - a.x) * s) / n, a.z + ((b.z - a.z) * s) / n)
        if (i >= 0 && (nav.clearAll[i] < u.r - 0.06 || nav.diff[i])) return true
      }
    }
    return false
  }
  const look = (G, e) => {
    if (e.t === 'unit.move') {
      const u = unitOf(G, e.u)
      if (!u || u.t.move !== 'burrow') return
      r.moves++
      if (tunnels(G, u, e.path ?? [])) r.tunnelled++
    } else if (e.t === 'melee') {
      striker = unitOf(G, e.u) ?? null
      if (striker?.t.swarm) r.swarmFights++
      if (striker?.t.swoop) r.swooperFights++
    } else if (e.t === 'dice' && striker) {
      if (e.label === 'Re-roll 1s (swarm)') {
        r.rerolls++
        r.rerollDice += e.dice.length
      } else if (/^Wound \d\+ \(dive, S\d+\)$/.test(e.label ?? '')) r.dives++
    } else if (e.t === 'tray.open' || e.t === 'pause') striker = null
  }
  const start = (G) => {
    if (!first) return
    first = false
    r.burrowers = G.units.filter((u) => u.t.move === 'burrow').length
    r.swarms = G.units.filter((u) => u.t.swarm).length
    r.swoopers = G.units.filter((u) => u.t.swoop).length
  }
  // a burrower above STEP, as this line finds the table
  const stand = (G) => {
    const nav = G.nav
    if (!nav.hasHeight) return
    for (const u of G.units) {
      if (u.t.move !== 'burrow' || !(u.alive > 0) || u.aboard) continue
      const i = nav.index(u.pos.x, u.pos.z)
      if (i >= 0 && nav.floor[i] > STEP) r.above++
    }
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
    },
    result: () => ({ ...r }),
  }
}
