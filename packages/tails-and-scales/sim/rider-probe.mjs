// (F9a) What a battle did with its transports: read off the match as it is
// folded (sim/run.mjs foldJob's `probe`: G at every trace line, and the
// match's events as they are taken), never from the trace, which names no
// rider, and never written into it (the corpus's hashes stay the
// battle's). sim/play-report.mjs judges its counts against DESIGN §4.2.9's
// F9a threshold (riders disembark in ≥ 50% of the vehicle/ battles), and
// sim/corpus-add.mjs's needs (`embark`, `disembark`, `bailout`,
// `rearranged`) read them. It reads only the events and G's units, so it
// runs on any code (older code has no rider, and counts nothing).
//
//   riderProbe() → { trace(line, G), events(G, events), result() }
//
// result():
//   hulls       the units fielded that carry riders (a transport), both
//               seats', as the battle began
//   autoloaded  the riders aboard as the battle began (the deployment's
//               autoload, and whatever the seats re-arranged)
//   embarks     units boarding a hull (unit.embark): `embarkDeploy` in the
//               deployment, `embarkPhase` in a movement phase
//   steps       riders stepping off of their own accord (unit.disembark,
//               not forced), in the battle, by either seat; `stepRounds`
//               the rounds they did so in
//   bailed      riders bailing out of a destroyed hull (a forced
//               unit.disembark), and `bailOnes` the 1s their dice rolled
//               (each a mortal wound); `lost` riders that rode a hull as it
//               was destroyed and never bailed out (nowhere to stand: every
//               model slain); `bailDeaths` = bailOnes + the models of the
//               lost, the models a bail-out cost
//   wrecks      wrecks left on the table (terrain.add of kind 'wreck')
//   hullsDown   hulls destroyed with riders aboard
//   rearranged  the deployment's autoload re-arranged: a rider placed off
//               its hull (a unit.place of a unit that rode), or a unit
//               boarding in the deployment
export function riderProbe() {
  const r = { hulls: 0, autoloaded: 0, embarks: 0, embarkDeploy: 0, embarkPhase: 0, steps: 0, stepRounds: [], bailed: 0, bailOnes: 0, lost: 0, bailDeaths: 0, wrecks: 0, hullsDown: 0, rearranged: 0 }
  // each unit's hull as the events have it (id → hull id), from the match
  // as first seen; the stage and round as the events tell them; the hulls
  // destroyed with riders, and who of those bailed out
  let first = true, stage = 'deploy', round = 1
  const aboard = new Map(), size = new Map(), down = new Map()
  const start = (G) => {
    if (!first) return
    first = false
    for (const u of G.units) {
      size.set(u.id, u.alive)
      if (u.t.transport) r.hulls++
      if (u.aboard) {
        aboard.set(u.id, u.aboard)
        r.autoloaded++
      }
    }
    stage = G.turn.stage
  }
  return {
    trace(line, G) {
      start(G)
    },
    events(G, events) {
      start(G)
      for (const e of events) {
        if (e.t === 'stage') stage = e.stage
        else if (e.t === 'phase.start') round = e.round
        else if (e.t === 'unit.embark') {
          r.embarks++
          r[stage === 'deploy' ? 'embarkDeploy' : 'embarkPhase']++
          if (stage === 'deploy') r.rearranged++
          aboard.set(e.u, e.v)
        } else if (e.t === 'unit.place') {
          if (aboard.get(e.u)) r.rearranged++
          aboard.delete(e.u)
        } else if (e.t === 'unit.disembark') {
          aboard.delete(e.u)
          if (e.forced) {
            r.bailed++
            down.get(e.v)?.delete(e.u)
          } else {
            r.steps++
            if (!r.stepRounds.includes(round)) r.stepRounds.push(round)
          }
        } else if (e.t === 'dice' && / bail out, 1s wound$/.test(e.label ?? '')) {
          const ones = e.dice.filter((x) => x === 1).length
          r.bailOnes += ones
          r.bailDeaths += ones
        } else if (e.t === 'terrain.add' && e.def?.kind === 'wreck') r.wrecks++
        else if (e.t === 'unit.destroyed') {
          const riders = [...aboard].filter(([, v]) => v === e.u).map(([u]) => u)
          if (riders.length) {
            r.hullsDown++
            down.set(e.u, new Set(riders))
          }
          aboard.delete(e.u)
        }
      }
      // the riders of a hull destroyed in this batch that never bailed out
      for (const [v, left] of down) {
        for (const u of left) {
          r.lost++
          r.bailDeaths += size.get(u) ?? 0
          aboard.delete(u)
        }
        down.delete(v)
      }
    },
    result: () => ({ ...r, stepRounds: [...r.stepRounds].sort((a, b) => a - b) }),
  }
}
