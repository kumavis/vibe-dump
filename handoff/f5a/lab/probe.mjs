// F5a terrain-swing telemetry probe (diagnosis only; reads the package, writes nothing in it).
//   node probe.mjs --dir <pkg> --mission classic --set fortified --pair squirrel,insect --n 300 --seed 2222 [--start 0] --out file.jsonl
// Battles are army-sim's score-gate battles for (seed, mission, pair, set): the same
// mulberry32(cyrb53(`${seed}:${stream}:${i}`)) draw of board, dice and both autoList lists at the
// mission's limit, seats swapped on odd i. Every seat 'ai'. One JSON line per battle.
import { parseArgs } from 'node:util'
import { appendFileSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { join } from 'node:path'
const { values: a } = parseArgs({ options: { dir: { type: 'string' }, mission: { type: 'string', default: 'classic' }, set: { type: 'string' }, pair: { type: 'string' }, n: { type: 'string', default: '10' }, seed: { type: 'string', default: '2222' }, start: { type: 'string', default: '0' }, out: { type: 'string' }, quiet: { type: 'boolean' }, rich: { type: 'boolean' } } })
if (['1111', '4444', '5555'].includes(a.seed)) throw new Error('judging seed refused')
const D = a.dir
const load = (f) => import(pathToFileURL(join(D, f)).href)
const [core, Q, { RACES }, { MISSIONS }, { mulberry32, cyrb53 }, NAV, R] = await Promise.all([load('core/index.js'), load('core/queries.js'), load('data/schema.js'), load('data/mission.js'), load('core/util.js'), load('core/nav.js'), load('core/rules.js')])
const A = core.army, STEP = NAV.STEP, HIGH = Q.HIGH, RANGE = R.OBJECTIVE_RANGE
// (phase 2) the scratch copy's switches, when the --dir has them: the probe's own OC count follows h3/h3b as controlHigh does
let XS = {}
try { XS = (await import(pathToFileURL(join(D, 'core/x.js')).href)).X } catch {}
function deckGap(G, o, x, z) {
  for (const c of G.terrain.chunks) {
    if (!c.alive || c.kind !== 'deck' || !c.shape) continue
    const { x: cx, z: cz, hx, hz, yaw = 0 } = c.shape
    const lo = (px, pz) => { const dx = px - cx, dz = pz - cz; return [dx * Math.cos(yaw) - dz * Math.sin(yaw), dx * Math.sin(yaw) + dz * Math.cos(yaw)] }
    const [ox, oz] = lo(o.x, o.z)
    if (Math.abs(ox) > hx || Math.abs(oz) > hz) continue
    const [px, pz] = lo(x, z)
    return Math.hypot(Math.max(0, Math.abs(px) - hx), Math.max(0, Math.abs(pz) - hz))
  }
  return Infinity
}
// does model (x, z) of u count at objective o (floor y)? null: not near at all
function counts(G, u, o, y, x, z) {
  const d = Math.hypot(x - o.x, z - o.z), inR = d <= RANGE + u.t.base
  if (!G.nav.hasHeight) return inR ? true : null
  const fl = Q.floorAt(G, x, z)
  if (inR && Math.abs(fl - y) <= HIGH) return true
  const bur = u.t.move === 'burrow' && y > STEP && fl <= STEP
  if (XS.h3 && bur && inR) return true
  if (XS.h3b && bur && deckGap(G, o, x, z) <= RANGE + u.t.base) return true
  return inR ? false : null
}
const streamOf = (mission, stream) => (mission === 'classic' ? stream : `${mission}:${stream}`)
const pair = a.pair.split(',')

function battleOf({ seed, stream, i, mission, set }) {
  const rng = mulberry32(cyrb53(`${seed}:${stream}:${i}`))
  const u32 = () => Math.floor(rng() * 4294967296)
  const board = u32(), dice = u32()
  // (phase 4) the list rules of this set (the scratch copy's set prices); the mission's list where there are none
  const rules = A.listFor ? A.listFor(MISSIONS[mission].list, set) : MISSIONS[mission].list
  const lists = pair.map((race) => {
    const points = rules.points
    const counts = A.autoList(RACES[race], { ...rules, points }, u32())
    return { race, points, counts, army: A.listText(counts) }
  })
  const swap = i % 2 === 1
  const seated = swap ? [lists[1], lists[0]] : lists
  const setup = { board, dice, mission, terrain: set, seats: seated.map((l) => ({ race: l.race, ctrl: 'ai', army: l.army })) }
  return { setup, swap, lists }
}

// ── board facts ─────────────────────────────────────────────────────────────
function objFacts(G) {
  return G.objectives.map((o) => {
    const y = Q.floorAt(G, o.x, o.z)
    if (!G.nav.hasHeight || y <= STEP) return { y: +y.toFixed(2), raised: false }
    const L = G.nav.levelAt(o.x, o.z)
    const gs = (G.nav.gates ?? []).filter((g) => g.level === L)
    const stair = gs.some((g) => !g.ladder), ladder = gs.some((g) => g.ladder)
    // within HIGH: a model on the ground (floor 0..STEP) may still count
    return { y: +y.toFixed(2), raised: true, way: stair ? 'stair' : ladder ? 'ladder' : 'none', groundHolds: y - STEP <= HIGH }
  })
}
// openness: random ground-to-ground lines of length L from a point on seat 0's (or 1's) zone front toward the
// enemy (a random bearing in the forward half-plane), both ends on ground floors (<= STEP) and on cells a walker
// could stand on (clearAll > 0); eye at floor + 0.95, the target chest at floor + 0.55 (a 0.95/0.55 infantry
// pair, the new races' walkers' eye and chest); the rules' own Terrain.los. clear = neither blocked nor obscured.
function openness(G, seedNum) {
  const rng = mulberry32(seedNum >>> 0)
  const { W, H, deploy } = G.board
  const res = {}
  for (const L of [12, 18, 24]) {
    let n = 0, vis = 0, clear = 0, tries = 0
    while (n < 60 && tries < 2000) {
      tries++
      const side = n % 2, edge = side ? 1 : -1
      const x0 = edge * (W / 2 - deploy), z0 = (rng() - 0.5) * (H - 2)
      const th = (rng() - 0.5) * Math.PI * 0.9
      const x1 = x0 - edge * L * Math.cos(th), z1 = z0 + L * Math.sin(th)
      if (Math.abs(x1) > W / 2 - 0.5 || Math.abs(z1) > H / 2 - 0.5) continue
      const okAt = (x, z) => { const i = G.nav.index(x, z); return i >= 0 && Q.floorAt(G, x, z) <= STEP && G.nav.clearAll[i] > 0.3 }
      if (!okAt(x0, z0) || !okAt(x1, z1)) continue
      const r = G.terrain.los({ x: x0, y: Q.floorAt(G, x0, z0) + 0.95, z: z0 }, { x: x1, y: Q.floorAt(G, x1, z1) + 0.55, z: z1 })
      n++
      if (!r.blocked) { vis++; if (!r.obscure) clear++ }
    }
    res[L] = { n, vis: +(vis / Math.max(1, n)).toFixed(3), clear: +(clear / Math.max(1, n)).toFixed(3) }
  }
  return res
}

// ── one battle ──────────────────────────────────────────────────────────────
function play(i) {
  const stream = streamOf(a.mission, `score:${pair}:${a.set}`)
  const { setup, swap, lists } = battleOf({ seed: a.seed, stream, i, mission: a.mission, set: a.set })
  const mine = swap ? 1 : 0 // the first race's seat
  let G = null
  const info = new Map() // unit id → { t, side, mode, race }
  const rec = { i, seed: a.seed, mission: a.mission, set: a.set, pair, swap, counts: lists.map((l) => l.counts), objs: null, open: null, rounds: [], kills: [], charges: [], contact: null }
  let buf = [] // slain/flee events since the last log line
  let verb = null, actorShort = null
  const act = new Map() // unit id → this round's { L, face, ch, chOk }
  const A0 = (id) => { let x = act.get(id); if (!x) act.set(id, (x = { L: 0, face: 0, ch: 0, chOk: 0 })); return x }
  const uOf = (id) => G.units.find((u) => u.id === id)
  const round = () => G?.turn?.round ?? 0
  const floorOf = (u) => Q.groundY(G, u)
  const out = {
    push(ev) {
      if (!G) return
      switch (ev.t) {
        case 'unit.slain': case 'unit.flee': {
          const v = uOf(ev.u), k = ev.by != null ? uOf(ev.by) : null
          buf.push({ v: v.t.short, vs: v.side, vHigh: floorOf(v) > STEP ? 1 : 0, by: ev.t === 'unit.flee' ? null : k ? k.t.short : null, bs: k ? k.side : null, flee: ev.t === 'unit.flee', r: round() })
          break
        }
        case 'unit.move': A0(ev.u).L += ev.L ?? 0; break
        case 'unit.face': A0(ev.u).face++; break
        case 'charge.result': {
          const u = uOf(ev.u), tg = uOf(ev.tg)
          const x = A0(ev.u); x.ch++; if (ev.ok) x.chOk++
          rec.charges.push({ c: u.t.short, cs: u.side, mode: u.t.move, tHigh: floorOf(tg) > STEP ? 1 : 0, cHigh: floorOf(u) > STEP ? 1 : 0, ok: ev.ok ? 1 : 0, r: round() })
          if (ev.ok && rec.contact == null) rec.contact = round()
          break
        }
        case 'melee': if (rec.contact == null) rec.contact = round(); break
      }
    },
  }
  const classify = (line) => {
    // the verb of the log line that reports the buffered losses
    let m
    if (/ lose their nerve /.test(line)) return 'morale'
    if ((m = /^log -?\d (?:Friendly fire! )?(.+?) (shoot|fight) /.exec(line))) return m[2] === 'shoot' ? 'volley' : 'fight'
    if (/stray shot/.test(line)) return 'volley'
    if (/ mesmerizes /.test(line)) return 'spell'
    if (/ hits /.test(line)) return verb === 'casts' ? 'spell' : verb === 'fire' ? 'blast' : 'blast?'
    return 'other'
  }
  const onTrace = (line, g) => {
    if (!G) {
      G = g
      for (const u of G.units) info.set(u.id, u)
      rec.objs = objFacts(G)
      rec.open = openness(G, setup.board ^ 0x5bd1e995)
    }
    if (line.startsWith('log ')) {
      let m = /^log -?\d (.+?) (shoot|fight|fire|casts|tries) /.exec(line)
      if (m) { verb = m[2]; actorShort = m[1] }
      if (buf.length) {
        const cause = classify(line)
        for (const k of buf) { k.cause = k.flee ? 'morale' : cause; rec.kills.push(k) }
        buf = []
      }
    } else if (/^round \d+ /.test(line)) {
      if (buf.length) { for (const k of buf) { k.cause = k.flee ? 'morale' : 'other'; rec.kills.push(k) } buf = [] }
      rec.rounds.push(snapshot())
      act.clear()
    } else if (line.startsWith('over ')) {
      if (buf.length) { for (const k of buf) { k.cause = k.flee ? 'morale' : 'other'; rec.kills.push(k) } buf = [] }
    }
  }
  // the deck recipe a point stands on (a deck chunk whose turned box holds it), '' on the ground
  function deckRecipe(x, z) {
    if (!G.nav.hasHeight || Q.floorAt(G, x, z) <= STEP) return ''
    for (const c of G.terrain.chunks) {
      if (!c.alive || c.kind !== 'deck' || !c.shape) continue
      const { x: cx, z: cz, hx, hz, yaw = 0 } = c.shape, dx = x - cx, dz = z - cz
      const ux = dx * Math.cos(yaw) - dz * Math.sin(yaw), uz = dx * Math.sin(yaw) + dz * Math.cos(yaw)
      if (Math.abs(ux) <= hx + 0.3 && Math.abs(uz) <= hz + 0.3) return c.look?.recipe ?? 'deck'
    }
    return 'other'
  }
  // the OC unit u counts at round's end, summed over the objectives (controlHigh's test)
  function ocOf(u) {
    let s = 0
    for (const o of G.objectives) {
      const y = Q.floorAt(G, o.x, o.z)
      for (const mm of u.models) if (mm.alive && counts(G, u, o, y, Q.mx(u, mm), Q.mz(u, mm)) === true) s += u.t.OC
    }
    return s
  }
  function snapshot() {
    const objs = G.objectives.map((o, oi) => {
      const y = Q.floorAt(G, o.x, o.z)
      const raised = G.nav.hasHeight && y > STEP
      const oc = [{}, {}], near = [{}, {}] // near: within planar range but out of HIGH (counts nothing)
      for (const u of G.units) {
        if (!Q.alive(u) || u.aboard) continue
        for (const mm of u.models) {
          if (!mm.alive) continue
          const x = Q.mx(u, mm), z = Q.mz(u, mm)
          const ok = counts(G, u, o, y, x, z)
          if (ok === null) continue
          const bag = ok ? oc[u.side] : near[u.side]
          bag[u.t.short] = (bag[u.t.short] ?? 0) + (ok ? u.t.OC : 1)
        }
      }
      return { owner: Q.controlOf(G, o), raised: raised ? 1 : 0, oc, near }
    })
    const units = G.units.filter((u) => !u.aboard).map((u) => {
      const x = act.get(u.id) ?? { L: 0, face: 0, ch: 0, chOk: 0 }
      let dmin = Infinity, dminRaised = Infinity
      for (const o of G.objectives) {
        const d = Math.hypot(u.pos.x - o.x, u.pos.z - o.z)
        dmin = Math.min(dmin, d)
        if (G.nav.hasHeight && Q.floorAt(G, o.x, o.z) > STEP) dminRaised = Math.min(dminRaised, d)
      }
      const extra = a.rich && Q.alive(u) ? [+u.pos.x.toFixed(1), +u.pos.z.toFixed(1), deckRecipe(u.pos.x, u.pos.z), ocOf(u)] : []
      return [...[u.t.short, u.side, u.alive, Q.alive(u) ? (floorOf(u) > STEP ? 1 : 0) : 0, Q.alive(u) && Q.isEngaged(G, u) ? 1 : 0, +dmin.toFixed(1), isFinite(dminRaised) ? +dminRaised.toFixed(1) : null, +x.L.toFixed(1), x.face, x.ch, x.chOk], ...extra]
    })
    return { r: G.turn.round, vp: [...G.turn.vp], objs, units }
  }
  const t0 = performance.now()
  core.createMatch(setup, { out, onTrace })
  if (G.turn.stage !== 'over') throw new Error('battle stopped short')
  const r = G.turn.result
  rec.win = r.win; rec.why = r.why; rec.y = r.win === -1 ? 0.5 : r.win === mine ? 1 : 0; rec.mine = mine
  rec.ms = Math.round(performance.now() - t0)
  // unit types and their sides at the start
  rec.edges = G.seats.map((x) => x.edge)
  rec.roster = [...info.values()].map((u) => [u.t.short, u.side, u.t.models, u.t.move, u.t.OC])
  return rec
}

const n = Number(a.n), s0 = Number(a.start)
if (a.out) writeFileSync(a.out, '', { flag: 'a' })
let sum = 0
for (let i = s0; i < s0 + n; i++) {
  const rec = play(i)
  sum += rec.y
  if (a.out) appendFileSync(a.out, JSON.stringify(rec) + '\n')
  if (!a.quiet && (i - s0) % 25 === 24) process.stderr.write(`${a.mission} ${a.set} ${pair} ${i - s0 + 1}/${n} score ${(100 * sum / (i - s0 + 1)).toFixed(1)}\n`)
}
console.log(`${a.mission} ${a.set} ${pair.join('-')} n ${n}: first race ${(100 * sum / n).toFixed(1)}%`)
