// (F7c) What a battle did with its timber platforms: read off the match's
// events as it is folded (sim/run.mjs foldJob's `probe`, as
// sim/height-probe.mjs reads its height), never from the trace, and never
// written into it. sim/corpus-add.mjs's `collapse` and `fall` needs read its
// counts, and the F7c smoke and play-report's F7c row may (DESIGN §4.2.9).
//
//   collapseProbe() → { trace(line, G), events(G, events), result() }
//
// result():
//   platforms  the decks on the board that can fall (a `fallsAt`), as the
//              table's adds have them
//   postsHit   the blows a breakable post took and stood (`terrain.hurt` of
//              a post that can break)
//   posts      the posts that broke (`terrain.destroy` of kind 'post')
//   decks      the decks that fell (`terrain.destroy` of kind 'deck': only
//              F7c's cascade breaks one), and `fellAt` the trace's length as
//              each fell (the lines the battle had written by the time its
//              events were taken: an AI battle's arrive all at once, after
//              its last line, a human log's after each entry)
//   falls      the units that fell with them (`unit.fall`; (the review) not
//              one destroyed before its deck fell, whose `dead` fall only
//              brings it to the ground: `dead` counts those), `fallenBy`
//              those per seat ([seat 0's, seat 1's]: play-report's F7c row
//              counts the human-bot's), and of them
//   crushed    those with nowhere to land (their models slain by nobody)
//   fallWounds the D3 mortal wounds the fallen took (their dice rows' sum)
//   fallSlain  the models slain by a fall: each `unit.slain` of the fallen
//              unit between its `unit.fall` and the end of its D3's damage
//              (the `status` it ends on), the D3's own and the crushed's (by
//              nobody, with no D3: up to the next event no damage makes)
// the events a fall's D3 or crush is told in (core/actions/damage.js's, a
// hull's wreck and its bail-out, transport.js's), up to the `status` that
// ends a D3's damage
const DAMAGE = new Set(['dice', 'unit.wound', 'unit.slain', 'unit.destroyed', 'pause', 'unit.formation', 'objectives', 'terrain.add', 'unit.disembark'])
export function collapseProbe() {
  const r = { platforms: 0, postsHit: 0, posts: 0, decks: 0, fellAt: [], falls: 0, fallenBy: [0, 0], dead: 0, crushed: 0, fallWounds: 0, fallSlain: 0 }
  // the breakable posts by id (their hp under Infinity, as each joined)
  const breakable = new Set(), crushed = new Set()
  let lines = 0, falling = null
  return {
    trace() {
      lines++
    },
    events(G, events) {
      for (const e of events) {
        if (e.t === 'terrain.clear') breakable.clear()
        else if (e.t === 'terrain.add') {
          if (e.def.fallsAt !== undefined) r.platforms++
          if (e.def.kind === 'post' && G.terrain.chunks.find((c) => c.id === e.def.id)?.maxHp < Infinity) breakable.add(e.def.id)
        } else if (e.t === 'terrain.hurt' && breakable.has(e.id)) r.postsHit++
        else if (e.t === 'terrain.destroy' && e.kind === 'post') r.posts++
        else if (e.t === 'terrain.destroy' && e.kind === 'deck') {
          r.decks++
          r.fellAt.push(lines)
        } else if (e.t === 'unit.fall' && e.dead) {
          r.dead++
          falling = null
        } else if (e.t === 'unit.fall') {
          r.falls++
          r.fallenBy[G.units.find((u) => u.id === e.u).side]++
          falling = e.u
        } else if (falling !== null && !DAMAGE.has(e.t)) falling = null
        else if (e.t === 'dice' && falling !== null && / the fall, D3 mortal wounds$/.test(e.label ?? '')) r.fallWounds += e.dice[0]
        else if (e.t === 'unit.slain' && e.u === falling) {
          r.fallSlain++
          if (e.by === null) crushed.add(e.u)
        }
      }
    },
    result: () => ({ ...r, crushed: crushed.size, fellAt: [...r.fellAt], fallenBy: [...r.fallenBy] }),
  }
}
