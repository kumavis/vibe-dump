// (F7a) What a battle on a fortified board did with its height: read off
// the match as it is folded (sim/run.mjs foldJob's `probe`: G at every
// trace line, and the match's events as they are taken), never from the
// trace, whose lines carry no floor, and never written into it (the
// corpus's hashes stay the battle's). sim/play-report.mjs judges its
// counts against DESIGN §4.2.9's thresholds, and sim/corpus-add.mjs's
// needs (`deck`, `climb`, `deckfight`) read them.
//
//   heightProbe(q) → { trace(line, G), events(G, events), result() }
//   q: the code under test's query set (core/index.js's `q`)
//
// result():
//   height     the board built a height layer (G.nav.hasHeight): false on a
//              classic board, or on code older than F7a, and the rest is 0
//   deckRounds the rounds (1, 2, …) at whose end ("round N", traced as the
//              round is scored) some unit standing stood on a deck (its
//              floor above STEP)
//   deckBy3    one of rounds 1-3 ended so: F7a's play-report row, "some
//              unit stands on a deck by the end of round 3"
//   deployed   units standing on a deck as the battle began (the first
//              phase traced: the works' decks are in each seat's zone)
//   climbs     the moves that took a ladder (a unit.move whose path has a
//              point marked `climb`: the nav's link), and `up` how many of
//              them went up it
//   ontoDeck   the moves in the battle that ended on a deck having begun
//              below it (by stairs or a ladder)
//   deckFights the blows struck (a `melee` event: one unit fighting
//              another) where either stood on a deck at the time (its floor
//              followed through the events that move it: a place's `y`, a
//              walk's end, a formation's, from where G stood them first)
//   works      how many of the seats' own ramparts stand (a rampart's deck
//              whose front face is on a zone's edge: its centre 2.25" behind
//              it, recipes.js works), 2 when the works were placed
//   keep       the keep stands (a chunk of its recipe), and keepHeld the
//              rounds at whose end its objective (the centre's) was held:
//              with height a model counts toward it only within HIGH of
//              its floor, the keep's top (q.controlOf), so a seat that
//              holds it holds it from the top
const STEP = 0.4

export function heightProbe(q) {
  const r = { height: false, deckRounds: [], deckBy3: false, deployed: 0, climbs: 0, up: 0, ontoDeck: 0, deckFights: 0, works: 0, keep: false, keepHeld: 0 }
  let first = true, battle = false
  // each unit's floor as the events have it (unit id → y)
  const ys = new Map()
  const standing = (u) => q.alive(u)
  const raised = (G, u) => q.groundY(G, u) > STEP
  return {
    trace(line, G) {
      if (first) {
        first = false
        r.height = !!G.nav.hasHeight
        r.keep = r.height && G.terrain.chunks.some((c) => c.look?.recipe === 'keep')
        const edge = G.board.W / 2 - G.board.deploy + 2.25
        r.works = !r.height ? 0 : G.terrain.chunks.filter((c) => c.kind === 'deck' && c.look?.recipe === 'rampart' && Math.abs(Math.abs(c.shape.x) - edge) < 1e-6).length
        if (r.height) for (const u of G.units) ys.set(u.id, q.groundY(G, u))
      }
      if (!r.height || line.startsWith('log ')) return
      if (!battle && line.startsWith('phase ')) {
        battle = true
        r.deployed = G.units.filter((u) => standing(u) && raised(G, u)).length
      }
      const round = /^round (\d+) /.exec(line)
      if (round) {
        const n = Number(round[1])
        if (G.units.some((u) => standing(u) && raised(G, u))) {
          r.deckRounds.push(n)
          if (n <= 3) r.deckBy3 = true
        }
        if (r.keep) {
          const o = G.objectives.find((x) => x.x === 0 && x.z === 0)
          if (o && q.controlOf(G, o) >= 0) r.keepHeld++
        }
      }
    },
    events(G, events) {
      if (!r.height) return
      for (const e of events) {
        if (e.t === 'unit.place') ys.set(e.u, e.y ?? 0)
        else if (e.t === 'unit.formation') ys.set(e.u, e.pos.y ?? 0)
        else if (e.t === 'melee' && ((ys.get(e.u) ?? 0) > STEP || (ys.get(e.tg) ?? 0) > STEP)) r.deckFights++
        if (e.t !== 'unit.move' || !e.path?.length) continue
        ys.set(e.u, e.to?.y ?? 0)
        const k = e.path.findIndex((p) => p.climb)
        if (k > 0) {
          r.climbs++
          if ((e.path[k].y ?? 0) > (e.path[k - 1].y ?? 0)) r.up++
        }
        if ((e.path[0].y ?? 0) <= STEP && (e.to?.y ?? 0) > STEP) r.ontoDeck++
      }
    },
    result: () => ({ ...r, deckRounds: [...r.deckRounds] }),
  }
}
