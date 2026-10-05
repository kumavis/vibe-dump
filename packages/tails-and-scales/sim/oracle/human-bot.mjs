// Plays the human seats of a battle through the ?debug input hooks, either
// replaying a recorded command log or choosing moves with a policy.
//
// A log is `{ setup, entries }` in the netplay command format (DESIGN.md
// §2.2): units by id, places by nav cell, integers only, and the seat in `s`.
//
//   { s: 0, t: 'place', u: 3, c: 1234 }   { s: 0, t: 'deployed' }
//   { s: 0, t: 'advance', u: 5 }           { s: 0, t: 'move', u: 5, c: 2210 }
//   { s: 0, t: 'shoot', u: 5, tg: 11 }     { s: 0, t: 'charge', u: 2, tg: 9 }
//   { s: 0, t: 'chargeEnd', c: 1871 }      ({ c: -1 } is "Shortest move")
//   { s: 0, t: 'end' }                     { s: 0, t: 'auto' }
//
// Each entry goes through the same hook calls a click or a button makes.
// Before that the driver checks what the UI's own gates check: the entry's
// seat holds the decision being asked; the command answers that kind of
// decision and, inside a phase, belongs to that phase (no shot in the charge
// phase, no charge while moving), as the click handler's `S.phase === …`
// tests do; then the per-command query (canAct, shotInfo().ok, chargePlan,
// validEnd, the roll's reach). A log that breaks any of these stops with an
// error naming the entry. The policies draw from their own mulberry32 stream
// and never touch the game's logic RNG.

// The modes on the title screen, by who sits in each seat.
export const MODES = { bushtail: ['human', 'ai'], serpent: ['ai', 'human'], hotseat: ['human', 'human'], watch: ['ai', 'ai'] }

export function setupFor(mode, board, dice) {
  const ctrl = MODES[mode]
  return { board, dice, terrain: 'classic', rounds: 5, diceMode: 'shared', seats: [{ race: 'squirrel', ctrl: ctrl[0] }, { race: 'serpent', ctrl: ctrl[1] }] }
}

export function modeOf(setup) {
  const key = setup.seats.map((s) => s.ctrl).join()
  return Object.keys(MODES).find((m) => MODES[m].join() === key)
}

// The legacy app takes only what its URL carries: the board and dice seeds
// (positive integers; it replaces anything else with a random one) and a
// title-screen mode. Refuse any other setup, so a log can never be recorded
// under a setup that is not the one played. Loosen this on purpose once the
// code under test can honour races, seats, terrain or rounds (R2 on), in the
// same step that adds such logs: loadCorpus (sim/lib.mjs) applies it to the
// whole corpus.
export function legacyMode(setup) {
  const mode = Array.isArray(setup?.seats) ? modeOf(setup) : undefined
  const want = mode && setupFor(mode, setup.board, setup.dice)
  const seed = (n) => Number.isInteger(n) && n > 0
  const ok = want && seed(setup.board) && seed(setup.dice) && ['terrain', 'rounds', 'diceMode'].every((k) => setup[k] === want[k]) &&
    (setup.overtime ?? 'never') === 'never' && setup.seats.length === 2 && setup.seats.every((s, i) => s.race === want.seats[i].race)
  if (!ok) throw new Error(`the legacy code plays only the title-screen setups (squirrel v serpent, classic, 5 rounds, shared dice, positive integer seeds), not ${JSON.stringify(setup)}`)
  return mode
}

// The members of window.__ts that this driver and the shadow read (main.js
// lists them atop its ?debug block), and so the ones missing from `ts`. Code
// older than the PIN has none of the input hooks. Injected into the browser
// page by sim/chromium.mjs, so it may only use its arguments.
export function missingHooks(ts) {
  const fns = ['start', 'select', 'doMove', 'doAdvance', 'doShoot', 'doCharge', 'placeCharge', 'deployClick', 'endPhase', 'autoPhase', 'validEnd']
  const q = ['alive', 'isEngaged', 'canAct', 'movePlan', 'freeSpot', 'shootTargets', 'shotInfo', 'chargeTargets', 'chargePlan', 'rngState']
  const has = ['S', 'trace', 'units', 'scenery', 'nav', 'phaseResolve', 'chargePick']
  return [
    ...fns.filter((k) => typeof ts?.[k] !== 'function'),
    ...q.filter((k) => typeof ts?.q?.[k] !== 'function').map((k) => `q.${k}`),
    ...has.filter((k) => !ts || !(k in ts)),
  ]
}

// The driver. Call tick() after every frame; it applies at most one entry,
// and only while a human seat has a decision in front of it. Injected into
// the browser page by sim/chromium.mjs, so it may only use its arguments.
export function humanDriver(ts, { entries = null, choose = null }) {
  const S = ts.S, q = ts.q, nav = ts.nav
  // the entries applied; the decision each answered ('chargeEnd at shortest'
  // for a picked spot that is the shortest move's own cell); and the trace
  // length when each was applied, so its lines can be found
  const played = [], asked = [], at = []
  let next = 0, busy = null, failed = null
  const KINDS = { deploy: ['place', 'deployed'], chargeEnd: ['chargeEnd'], phase: ['advance', 'move', 'shoot', 'charge', 'end', 'auto'] }
  // the phase each in-phase command belongs to (end and auto fit any)
  const PHASE = { advance: 'move', move: 'move', shoot: 'shoot', charge: 'charge' }

  // what a human is being asked right now, if anything
  function decision() {
    if (S.stage === 'deploy') return { k: 'deploy', s: S.deploySide }
    if (ts.chargePick) return { k: 'chargeEnd', s: ts.chargePick.u.side }
    if (busy) return null
    if (S.stage === 'battle' && ts.phaseResolve && !S.busy && !S.auto) return { k: 'phase', s: S.active, phase: S.phase }
    return null
  }

  function apply(d, e) {
    const bad = (why) => new Error(`entry ${played.length} ${JSON.stringify(e)}: ${why}`)
    if (e.s !== d.s || !KINDS[d.k].includes(e.t)) throw bad(`does not answer a ${d.k} decision of seat ${d.s}`)
    if (PHASE[e.t] && d.phase !== PHASE[e.t]) throw bad(`answers the ${d.phase} phase, but ${e.t} belongs to the ${PHASE[e.t]} phase`)
    const find = (id) => ts.units.find((u) => u.id === id && q.alive(u))
    const own = (id) => {
      const u = find(id)
      if (!u || u.side !== e.s) throw bad(`unit ${id} is not a live unit of seat ${e.s}`)
      return u
    }
    const enemy = (id) => {
      const u = find(id)
      if (!u || u.side === e.s) throw bad(`unit ${id} is not a live enemy`)
      return u
    }
    const from = ts.trace.length
    let p = null, shortest = false
    switch (e.t) {
      case 'place': {
        const u = own(e.u)
        ts.deployClick(u, null)
        ts.deployClick(null, { x: nav.x(e.c), z: nav.z(e.c) })
        if (u.pos.x !== nav.x(e.c) || u.pos.z !== nav.z(e.c)) throw bad('not a free spot in the deployment zone')
        break
      }
      case 'advance': {
        const u = own(e.u)
        if (u.flags.moved || u.flags.advanced || q.isEngaged(u)) throw bad('cannot advance')
        ts.select(u)
        p = ts.doAdvance(u).then(() => ts.select(u))
        break
      }
      case 'move': {
        const u = own(e.u)
        if (!q.canAct(u)) throw bad('cannot move')
        ts.select(u)
        if (!ts.validEnd(S.reach, e.c)) throw bad('not a valid end cell')
        p = ts.doMove(u, e.c, S.reach)
        break
      }
      case 'shoot': {
        const u = own(e.u), tg = enemy(e.tg)
        if (!q.canAct(u) || !q.shotInfo(u, tg).ok) throw bad('cannot shoot that')
        ts.select(u)
        p = ts.doShoot(u, tg)
        break
      }
      case 'charge': {
        const u = own(e.u), tg = enemy(e.tg)
        if (!q.canAct(u) || !q.chargeTargets(u).includes(tg) || !q.chargePlan(u, tg)) throw bad('cannot charge that')
        ts.select(u)
        p = ts.doCharge(u, tg)
        break
      }
      case 'chargeEnd': {
        const pk = ts.chargePick
        const c = e.c === -1 ? pk.plan.cell : e.c
        if (!(c >= 0 && pk.ok[c])) throw bad('not a spot the roll reaches')
        shortest = e.c >= 0 && c === pk.plan.cell
        ts.placeCharge(c)
        break
      }
      case 'deployed':
      case 'end':
        ts.endPhase()
        break
      case 'auto':
        p = ts.autoPhase()
        break
    }
    played.push(e)
    asked.push(shortest ? 'chargeEnd at shortest' : d.phase ?? d.k)
    at.push(from)
    if (p) {
      busy = p
      p.then(() => { if (busy === p) busy = null }, (err) => { failed = err })
    }
  }

  function tick() {
    if (failed) throw failed
    const d = decision()
    if (!d) return false
    let e
    if (entries) {
      if (next >= entries.length) throw new Error(`the log ends while seat ${d.s} has a ${d.k} decision`)
      e = entries[next++]
    } else e = choose(ts, d)
    apply(d, e)
    return true
  }

  return {
    tick,
    played,
    asked,
    at,
    get unused() {
      return entries ? entries.length - next : 0
    },
  }
}

// ── Policies (Node only) ────────────────────────────────────────────────────

export function mulberry32(seed) {
  let a = seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// `random`: any legal input, with Auto, early ends, skipped units, advances,
// falls back and both kinds of charge end mixed in.
// `late`: `random`, but it also presses Auto part-way through a phase, most
// often straight after an Advance, which the AI then moves on the roll it
// already has.
// `aggressive`: wipe-seeking. Deploy forward, close on the nearest enemy,
// shoot the weakest target, charge whatever can be reached, never fall back.
export function makePolicy(name, seed) {
  const rand = mulberry32(seed)
  const pick = (a) => a[Math.floor(rand() * a.length)]
  const aggressive = name === 'aggressive', late = name === 'late'
  if (!aggressive && !late && name !== 'random') throw new Error(`unknown policy ${name}`)
  const placing = new Map() // seat → placements left in its deployment
  let key = '', skipped = new Set(), acted = 0, last = null // `last`: this phase's latest entry

  const enemies = (ts, u) => ts.units.filter((e) => e.side !== u.side && ts.q.alive(e))
  const nearest = (ts, u, x, z) => Math.min(...enemies(ts, u).map((e) => Math.hypot(e.pos.x - x, e.pos.z - z) - e.r))
  const cells = (ts, plan) => {
    const out = []
    for (let i = 0; i < ts.nav.N; i++) if (isFinite(plan.res.dist[i]) && ts.validEnd(plan, i)) out.push(i)
    return out
  }

  function deploy(ts, s) {
    const { nav } = ts
    const W = nav.W, H = nav.H, depth = 8 // BOARD.deploy
    const mine = ts.units.filter((u) => u.side === s)
    if (!placing.has(s)) placing.set(s, aggressive ? mine.slice() : Array.from({ length: Math.floor(rand() * 4) }, () => pick(mine)))
    const todo = placing.get(s)
    while (todo.length) {
      const u = todo.shift()
      const edge = s === 0 ? -1 : 1
      // aggressive: the front of the zone; random: anywhere in it
      const x = aggressive ? edge * (W / 2 - depth + u.r) : edge * (W / 2 - rand() * depth)
      const z = aggressive ? u.pos.z + (rand() - 0.5) * 2 : (rand() - 0.5) * (H - 2)
      const p = ts.q.freeSpot(u, x, z, s, ts.units.filter((o) => o !== u))
      if (!p || Math.hypot(p.x - x, p.z - z) >= 2.5) continue
      return { s, t: 'place', u: u.id, c: nav.index(p.x, p.z) }
    }
    return { s, t: 'deployed' }
  }

  function phase(ts, d) {
    const { S, q } = ts
    const k = `${S.round}:${S.active}:${S.phase}`
    if (k !== key) {
      key = k
      skipped = new Set()
      acted = 0
      last = null
    }
    const s = d.s
    const end = { s, t: 'end' }
    if (late && acted && rand() < (last?.t === 'advance' ? 0.6 : 0.15)) return { s, t: 'auto' }
    if (!aggressive && !acted && rand() < 0.08) return acted++, { s, t: 'auto' }
    if (!aggressive && rand() < 0.03) return end
    const mine = ts.units.filter((u) => u.side === s && q.alive(u) && !skipped.has(u.id))
    for (;;) {
      const ready = mine.filter((u) => !skipped.has(u.id) && q.canAct(u))
      if (!ready.length) return end
      const u = aggressive ? ready[0] : pick(ready)
      const pass = () => skipped.add(u.id)
      if (!aggressive && rand() < 0.12) {
        pass()
        continue
      }
      if (d.phase === 'move') {
        const engaged = q.isEngaged(u)
        if (aggressive && engaged) {
          pass()
          continue
        }
        const far = nearest(ts, u, u.pos.x, u.pos.z) - u.r
        const advance = aggressive ? far > u.t.M + 6 && (!u.t.ranged || u.t.ranged.assault) : rand() < 0.2
        if (!u.flags.advanced && !engaged && advance) return acted++, { s, t: 'advance', u: u.id }
        const plan = q.movePlan(u, u.flags.advanced ? u.flags.advRoll : 0)
        const ok = cells(ts, plan)
        if (!ok.length) {
          pass()
          continue
        }
        let c = pick(ok)
        if (aggressive) {
          let best = nearest(ts, u, u.pos.x, u.pos.z) - 0.3
          c = -1
          for (const i of ok) {
            const v = nearest(ts, u, ts.nav.x(i), ts.nav.z(i)) + rand() * 0.01
            if (v < best) (best = v), (c = i)
          }
          if (c < 0) {
            pass()
            continue
          }
        }
        return acted++, { s, t: 'move', u: u.id, c }
      }
      if (d.phase === 'shoot') {
        const tgs = q.shootTargets(u)
        const tg = aggressive ? tgs.reduce((a, b) => (a.alive * a.t.W <= b.alive * b.t.W ? a : b)) : pick(tgs)
        return acted++, { s, t: 'shoot', u: u.id, tg: tg.id }
      }
      if (d.phase === 'charge') {
        const tgs = q.chargeTargets(u).filter((e) => q.chargePlan(u, e))
        if (!tgs.length) {
          pass()
          continue
        }
        const tg = aggressive ? tgs.reduce((a, b) => (q.chargePlan(u, a).need <= q.chargePlan(u, b).need ? a : b)) : pick(tgs)
        return acted++, { s, t: 'charge', u: u.id, tg: tg.id }
      }
      return end
    }
  }

  function chargeEnd(ts, d) {
    const pk = ts.chargePick
    if (rand() < (aggressive ? 0.5 : 0.35)) return { s: d.s, t: 'chargeEnd', c: -1 }
    const ok = []
    for (let i = 0; i < pk.ok.length; i++) if (pk.ok[i]) ok.push(i)
    return { s: d.s, t: 'chargeEnd', c: pick(ok) }
  }

  return (ts, d) => (d.k === 'deploy' ? deploy(ts, d.s) : d.k === 'chargeEnd' ? chargeEnd(ts, d) : (last = phase(ts, d)))
}
