// usage: node keep.mjs <dir> <raceA> <raceB> <N>: on fortified boards, at each
// round's end, which unit types stand on a raised objective (OC summed), and who holds it
const [D, ra, rb, N, SET = 'fortified'] = process.argv.slice(2)
const core = await import(D + '/core/index.js')
const Q = await import(D + '/core/queries.js')
const { RACES } = await import(D + '/data/schema.js')
const { MISSIONS } = await import(D + '/data/mission.js')
const A = core.army, rules = MISSIONS.classic.list
const oc = {}, held = { [ra]: 0, [rb]: 0, none: 0 }, heldLow = { [ra]: 0, [rb]: 0, none: 0 }
for (let i = 0; i < N; i++) {
  const lists = [ra, rb].map((r, k) => ({ race: r, ctrl: 'ai', army: A.listText(A.autoList(RACES[r], rules, 7000 + i * 2 + k)) }))
  const seats = i % 2 ? [lists[1], lists[0]] : lists
  let sc = null
  const G = core.createMatch({ board: 99000 + i, dice: 55000 + i, mission: 'classic', terrain: SET, seats }, { onTrace: (l, G) => {
    if (!/^round /.test(l)) return
    for (const o of G.objectives) {
      const y = G.nav.hasHeight ? Q.floorAt(G, o.x, o.z) : 0, hi = y > 0.3
      const c = Q.controlOf(G, o), who = c < 0 ? 'none' : G.units.find((u) => u.side === c).race
      ;(hi ? held : heldLow)[who]++
      for (const u of G.units) {
        if (!u.alive || u.aboard) continue
        for (const m of u.models) if (m.alive && Math.hypot(Q.mx(u, m) - o.x, Q.mz(u, m) - o.z) <= 3 + u.t.base && Math.abs(Q.floorAt(G, Q.mx(u, m), Q.mz(u, m)) - y) <= 0.5) oc[(hi ? '^' : '') + u.t.short] = (oc[(hi ? '^' : '') + u.t.short] ?? 0) + u.t.OC
      }
    }
  } })
}
console.log(`raised objectives held by round: ${JSON.stringify(held)}; ground: ${JSON.stringify(heldLow)}`)
console.log('OC on raised objectives by unit: ' + Object.entries(oc).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(', '))
