// Board facts per battle board (no battle played): the same board as probe.mjs's battle i, built by createMatch
// with both seats human (it stops at the deployment).  node board.mjs --mission classic --set fortified --pair a,b --n N --out f
//  - open: ground sight from inside the zones (a random depth 0.5..deploy-0.5 behind the front) toward the enemy, 18"/24"
//  - travel: for each seat, from 5 points 1.5" inside its zone front, the nav's reach cost to each objective (the nearest
//    cell within 1" of it a 1.0"-disc can stand on), walk (climbing ladders) and burrow, over the straight line (a flier's);
//    a raised objective's walk cost counts its stairs/ladders (reachHeight); burrow to a raised objective is unreachable.
//  - terrain shares of the no-man's-land cells: difficult (diff), blocked to a walker (clearAll < 0.5), blocked to a
//    burrower (clearHard < 0.5), raised (floor > STEP).
import { parseArgs } from 'node:util'
import { appendFileSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { join } from 'node:path'
const { values: a } = parseArgs({ options: { dir: { type: 'string', default: '/home/user/vibe-dump-wt/f5a/packages/tails-and-scales' }, mission: { type: 'string' }, set: { type: 'string' }, pair: { type: 'string' }, n: { type: 'string' }, seed: { type: 'string', default: '2222' }, out: { type: 'string' } } })
const load = (f) => import(pathToFileURL(join(a.dir, f)).href)
const [core, Q, { RACES }, { MISSIONS }, { mulberry32, cyrb53 }, NAV] = await Promise.all([load('core/index.js'), load('core/queries.js'), load('data/schema.js'), load('data/mission.js'), load('core/util.js'), load('core/nav.js')])
const A = core.army, STEP = NAV.STEP
const pair = a.pair.split(',')
const stream = a.mission === 'classic' ? `score:${pair}:${a.set}` : `${a.mission}:score:${pair}:${a.set}`
writeFileSync(a.out, '')
for (let i = 0; i < Number(a.n); i++) {
  const rng = mulberry32(cyrb53(`${a.seed}:${stream}:${i}`))
  const u32 = () => Math.floor(rng() * 4294967296)
  const board = u32(), dice = u32()
  const rules = MISSIONS[a.mission].list
  const lists = pair.map((race) => A.listText(A.autoList(RACES[race], rules, u32())))
  const swap = i % 2 === 1
  const races = swap ? [pair[1], pair[0]] : pair, armies = swap ? [lists[1], lists[0]] : lists
  const G = core.createMatch({ board, dice, mission: a.mission, terrain: a.set, seats: races.map((r, k) => ({ race: r, ctrl: 'human', army: armies[k] })) })
  const nav = G.nav, { W, H, deploy } = G.board
  const okAt = (x, z) => { const j = nav.index(x, z); return j >= 0 && Q.floorAt(G, x, z) <= STEP && nav.clearAll[j] > 0.3 }
  const r2 = mulberry32(board ^ 0x1234567)
  const open = {}
  for (const L of [18, 24]) {
    let n = 0, clear = 0, vis = 0, tries = 0
    while (n < 80 && tries < 4000) {
      tries++
      const edge = n % 2 ? 1 : -1
      const x0 = edge * (W / 2 - deploy + 0.5 + r2() * (deploy - 1)), z0 = (r2() - 0.5) * (H - 2)
      const th = (r2() - 0.5) * Math.PI * 0.9
      const x1 = x0 - edge * L * Math.cos(th), z1 = z0 + L * Math.sin(th)
      if (Math.abs(x1) > W / 2 - 0.5 || Math.abs(z1) > H / 2 - 0.5 || !okAt(x0, z0) || !okAt(x1, z1)) continue
      const r = G.terrain.los({ x: x0, y: Q.floorAt(G, x0, z0) + 0.95, z: z0 }, { x: x1, y: Q.floorAt(G, x1, z1) + 0.55, z: z1 })
      n++; if (!r.blocked) { vis++; if (!r.obscure) clear++ }
    }
    open[L] = { clear: +(clear / n).toFixed(3), vis: +(vis / n).toFixed(3) }
  }
  // travel: 5 starts a seat, each the first ground cell a 1"-disc may stand on, 1.5" to deploy-0.5" inside the front
  const T = []
  for (const edge of [-1, 1]) {
    const starts = []
    for (const k of [-2, -1, 0, 1, 2]) {
      const z = (k * (H - 6)) / 4
      for (let dd = 1.5; dd <= deploy - 0.5; dd += 0.5) { const x = edge * (W / 2 - deploy + dd); const j = nav.index(x, z); if (okAt(x, z) && nav.standable(j, 1.0, 'walk')) { starts.push({ x, z }); break } }
    }
    const row = G.objectives.map(() => ({ s: 0, w: 0, b: 0, wInf: 0, bInf: 0, n: 0 }))
    for (const st of starts) {
      const fields = {}
      for (const mode of ['walk', 'burrow']) fields[mode] = nav.reach(st.x, st.z, { r: 1.0, max: 4 * W, mode, climb: mode === 'walk' })
      G.objectives.forEach((o, k) => {
        const s = Math.hypot(o.x - st.x, o.z - st.z)
        const best = (f) => { let b = Infinity; const c = nav.cell; for (let dx = -1; dx <= 1; dx += c) for (let dz = -1; dz <= 1; dz += c) { const j = nav.index(o.x + dx, o.z + dz); if (j >= 0 && Math.hypot(dx, dz) <= 1 && f.dist[j] < b) b = f.dist[j] } return b }
        const w = best(fields.walk), b = best(fields.burrow)
        row[k].n++; row[k].s += s
        if (isFinite(w)) row[k].w += w / s; else row[k].wInf++
        if (isFinite(b)) row[k].b += b / s; else row[k].bInf++
      })
    }
    T.push(row.map((x) => ({ walk: x.n - x.wInf ? +(x.w / (x.n - x.wInf)).toFixed(3) : null, burrow: x.n - x.bInf ? +(x.b / (x.n - x.bInf)).toFixed(3) : null, wUnreach: x.wInf, bUnreach: x.bInf })))
  }
  // terrain shares in no-man's land
  let cells = 0, diff = 0, wblock = 0, bblock = 0, raised = 0
  for (let j = 0; j < nav.N; j++) {
    const x = nav.x(j), z = nav.z(j)
    if (Math.abs(x) > W / 2 - deploy) continue
    cells++
    if (nav.diff[j]) diff++
    if (nav.clearAll[j] < 0.5) wblock++
    if (nav.clearHard[j] < 0.5) bblock++
    if (nav.hasHeight && nav.floor[j] > STEP) raised++
  }
  // the centre piece: keep (raised floor at 0,0), tower (soft column chunks at 2.9-3.9" round it), rockbox (hard
  // chunks at 3.3-5.2"), else open
  let centre = 'open'
  if (Q.floorAt(G, 0, 0) > STEP) centre = 'keep'
  else {
    const ring = G.terrain.chunks.filter((c) => c.alive && c.shape && Math.abs(Math.hypot(c.shape.x, c.shape.z) - 3.4) < 0.5 && c.navKind === 'soft').length
    const rock = G.terrain.chunks.filter((c) => c.alive && c.shape && Math.hypot(c.shape.x, c.shape.z) > 3.0 && Math.hypot(c.shape.x, c.shape.z) < 5.4 && c.navKind === 'hard').length
    centre = ring >= 6 ? 'tower' : rock >= 4 ? 'rockbox' : 'open'
  }
  const rec = { centre, mission: a.mission, set: a.set, pair, i, board, open, travel: T, terr: { diff: +(diff / cells).toFixed(3), wblock: +(wblock / cells).toFixed(3), bblock: +(bblock / cells).toFixed(3), raised: +(raised / cells).toFixed(3) } }
  appendFileSync(a.out, JSON.stringify(rec) + '\n')
}
