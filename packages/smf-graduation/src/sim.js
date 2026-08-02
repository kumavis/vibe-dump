/* =====================================================================
   SMF 00 — GRADUATION · data layer
   Pure JS: no DOM, no canvas, no timers, no Math.random.
   createSim() -> { state, step(dt), act(action), canPlace, stampCells }
   All player verbs go through act(); the headless harness dispatches the
   same actions the mouse does.
   ===================================================================== */

export const DT = 0.1
export const GW = 30
export const GH = 18

export const COSTS = { extractor: 10, furnace: 15 }
export const STAMP_COST = COSTS.extractor + COSTS.furnace
export const LINE_RATE = 1.0        // ingots/s per complete line
export const ORE_RESERVE = 300      // ingots per ore cell
export const START_MATTER = 30
export const INGOT_VALUE = 1        // matter per delivered ingot
export const REFUND = 0.5
export const ECHO_EARN = 3          // identical lines to earn the echo
export const BACKLOG_RISK = 25      // backlog above this -> CONTRACT AT RISK
export const SUSTAIN = 20           // seconds at max demand to win
export const MAX_DEMAND = 10
export const DEMAND_STEPS = [[0, 1], [45, 3], [100, 6], [160, 10]]

export const T_GROUND = 0, T_ROCK = 1, T_ORE = 2, T_DEPOT = 3

/* Authored map — no RNG. 30x18. '.' ground, '#' rock, '=' depot,
   letters = ore patches. Patch 'm' is the mismatch pocket: every ore
   cell's orthogonal neighbours are rock/ore, one diagonal ground cell
   at (10,17) is the only way to complete a line there — by hand. */
export const MAP = [
  '..............................',
  '...aaaa.......##..............',
  '..........b...##...dd.........',
  '..........b........d..........',
  '..........b...ccc..d..........',
  '.....#........................',
  '.....#.................###....',
  '...e.#........................',
  '...e........fffff....gg.......',
  '...e..................gg.....=',
  '...e.........................=',
  '.........#####................',
  '..........................i...',
  '...hhh....................i...',
  '..........................i...',
  '......#####...................',
  '......#mmm#...................',
  '......####....................',
]

export const rotCW = ([dx, dz]) => [-dz, dx]
export function rotN(off, n) {
  let o = off
  for (let i = 0; i < (n & 3); i++) o = rotCW(o)
  return o
}
export function dirName([dx, dz]) {
  const z = dz < 0 ? 'N' : dz > 0 ? 'S' : ''
  const x = dx > 0 ? 'E' : dx < 0 ? 'W' : ''
  return (z + x) || '·'
}

const N8 = [[0, -1], [1, 0], [0, 1], [-1, 0], [1, -1], [1, 1], [-1, 1], [-1, -1]]

export function createSim() {
  const terrain = new Uint8Array(GW * GH)
  const patchOf = new Int8Array(GW * GH).fill(-1)
  const reserve = new Float32Array(GW * GH)
  const occupied = new Int16Array(GW * GH)
  const patches = []          // { name, mismatch, cells: [ix] }
  const patchIxByChar = {}

  if (MAP.length !== GH) throw new Error('map height')
  for (let gz = 0; gz < GH; gz++) {
    const row = MAP[gz]
    if (row.length !== GW) throw new Error(`map row ${gz} width ${row.length}`)
    for (let gx = 0; gx < GW; gx++) {
      const ch = row[gx], ix = gx + gz * GW
      if (ch === '#') terrain[ix] = T_ROCK
      else if (ch === '=') terrain[ix] = T_DEPOT
      else if (ch >= 'a' && ch <= 'z') {
        terrain[ix] = T_ORE
        reserve[ix] = ORE_RESERVE
        if (!(ch in patchIxByChar)) {
          patchIxByChar[ch] = patches.length
          patches.push({ name: ch.toUpperCase(), mismatch: ch === 'm', cells: [] })
        }
        const pi = patchIxByChar[ch]
        patchOf[ix] = pi
        patches[pi].cells.push(ix)
      }
    }
  }

  const state = {
    t: 0,
    matter: START_MATTER,
    terrain, patchOf, reserve, occupied, patches,
    buildings: [],            // { id, kind, gx, gz, stamped, pair }
    lines: [],                // { id, ext, fur, gx, gz, fgx, fgz, off, stamped, patch, dead }
    tool: 'extractor',
    echo: { unlocked: false, base: null, rot: 0, counts: {}, unlockedAt: 0 },
    required: 1, actual: 0, backlog: 0, atRisk: false,
    delivered: 0,
    toil: { cb: 0, lb: 0, ca: 0, la: 0, split: false },
    linesCompleted: 0, stampedLines: 0, handLines: 0,
    contractTimer: 0, done: false,
    flags: {}, flagT: {}, events: [],
    fx: { reject: null, stamp: null, line: null },
  }

  let nextId = 1
  let poorAt = -9
  const byId = new Map()

  const inB = (gx, gz) => gx >= 0 && gx < GW && gz >= 0 && gz < GH
  const idx = (gx, gz) => gx + gz * GW

  const ev = (msg) => {
    state.events.push({ t: state.t, msg })
    if (state.events.length > 60) state.events.shift()
  }
  const flag = (k, msg) => {
    if (state.flags[k]) return
    state.flags[k] = true
    state.flagT[k] = state.t
    if (msg) ev(msg)
  }
  const click = () => {
    const T = state.toil
    if (T.split) T.ca++; else T.cb++
  }
  const rejectFx = (cells) => { state.fx.reject = { t: state.t, cells } }

  function canPlace(kind, gx, gz) {
    if (!inB(gx, gz)) return 'oob'
    const ix = idx(gx, gz)
    if (occupied[ix]) return 'occupied'
    if (kind === 'extractor') {
      if (terrain[ix] !== T_ORE) return 'needs ore'
      if (reserve[ix] <= 0) return 'exhausted'
      return null
    }
    if (kind === 'furnace') return terrain[ix] === T_GROUND ? null : 'blocked'
    return 'bad kind'
  }

  function stampCells(gx, gz) {
    const off = rotN(state.echo.base || [0, -1], state.echo.rot)
    const fgx = gx + off[0], fgz = gz + off[1]
    return {
      ext: { gx, gz, err: canPlace('extractor', gx, gz) },
      fur: { gx: fgx, gz: fgz, err: canPlace('furnace', fgx, fgz) },
    }
  }

  function addBuilding(kind, gx, gz, stamped) {
    const b = { id: nextId++, kind, gx, gz, stamped, pair: 0 }
    state.buildings.push(b)
    byId.set(b.id, b)
    occupied[idx(gx, gz)] = b.id
    return b
  }

  function completeLine(e, f) {
    e.pair = f.id; f.pair = e.id
    const off = [f.gx - e.gx, f.gz - e.gz]
    const stamped = e.stamped && f.stamped
    const pi = patchOf[idx(e.gx, e.gz)]
    state.lines.push({
      id: state.lines.length + 1, ext: e.id, fur: f.id,
      gx: e.gx, gz: e.gz, fgx: f.gx, fgz: f.gz, off, stamped, patch: pi, dead: false,
    })
    state.linesCompleted++
    if (stamped) state.stampedLines++; else state.handLines++
    const T = state.toil
    if (T.split) T.la++; else T.lb++
    const n = state.linesCompleted
    if (n === 1) flag('firstLine', 'FIRST LINE — extractor + furnace paired. 1.0/s to depot.')
    else if (n === 3) flag('thirdLine', 'THIRD LINE — placed by hand again.')
    else ev(`LINE ${n} ${stamped ? 'stamped' : 'complete'} — patch ${patches[pi].name}.`)
    state.fx.line = { t: state.t, gx: e.gx, gz: e.gz, fgx: f.gx, fgz: f.gz }

    // the sim watches for repetition — hand lines only, pre-unlock
    if (!stamped && !state.echo.unlocked) {
      const key = off[0] + ',' + off[1]
      const c = (state.echo.counts[key] = (state.echo.counts[key] || 0) + 1)
      if (c === 2) ev(`PATTERN ×2 — furnace ${dirName(off)} of extractor.`)
      if (c >= ECHO_EARN) {
        state.echo.unlocked = true
        state.echo.base = off.slice()
        state.echo.rot = 0
        state.echo.unlockedAt = state.t
        flag('echoUnlocked', 'PATTERN ECHO — earned ×3.')
      }
    }

    if (pi >= 0 && patches[pi].mismatch && !stamped && state.flags.mismatchSeen)
      flag('mismatchResolved', `Patch ${patches[pi].name} line placed by hand — descent to L0.`)
  }

  function tryPair(b) {
    const want = b.kind === 'extractor' ? 'furnace' : 'extractor'
    for (const [dx, dz] of N8) {
      const x = b.gx + dx, z = b.gz + dz
      if (!inB(x, z)) continue
      const id = occupied[idx(x, z)]
      if (!id) continue
      const o = byId.get(id)
      if (!o || o.kind !== want || o.pair) continue
      completeLine(b.kind === 'extractor' ? b : o, b.kind === 'extractor' ? o : b)
      return
    }
  }

  const poorEv = (need) => {
    if (state.t - poorAt > 3) { poorAt = state.t; ev(`Insufficient matter — need ${need}.`) }
  }

  function place(gx, gz) {
    if (state.tool === 'echo') return stampAt(gx, gz)
    click()
    const err = canPlace(state.tool, gx, gz)
    if (err) { rejectFx([{ gx, gz, bad: true }]); return }
    if (state.matter < COSTS[state.tool]) {
      rejectFx([{ gx, gz, bad: true }]); poorEv(COSTS[state.tool]); return
    }
    state.matter -= COSTS[state.tool]
    const b = addBuilding(state.tool, gx, gz, false)
    tryPair(b)
  }

  function noRotFits(gx, gz) {
    for (let r = 0; r < 4; r++) {
      const off = rotN(state.echo.base, r)
      if (canPlace('furnace', gx + off[0], gz + off[1]) === null) return false
    }
    return true
  }

  function stampAt(gx, gz) {
    if (!state.echo.unlocked) return
    const sc = stampCells(gx, gz)
    if (sc.ext.err || sc.fur.err) {
      click()
      rejectFx([
        { gx: sc.ext.gx, gz: sc.ext.gz, bad: !!sc.ext.err },
        { gx: sc.fur.gx, gz: sc.fur.gz, bad: !!sc.fur.err },
      ])
      if (!sc.ext.err && sc.fur.err) {
        flag('mismatchSeen', 'ECHO rejected — furnace cell blocked.')
        if (noRotFits(gx, gz)) {
          const pi = patchOf[idx(gx, gz)]
          ev(`No rotation fits patch ${pi >= 0 ? patches[pi].name : '?'} — ore hugs rock.`)
        }
      }
      return
    }
    if (state.matter < STAMP_COST) {
      click()
      rejectFx([
        { gx: sc.ext.gx, gz: sc.ext.gz, bad: true },
        { gx: sc.fur.gx, gz: sc.fur.gz, bad: true },
      ])
      poorEv(STAMP_COST)
      return
    }
    if (!state.toil.split) state.toil.split = true   // the stamp click counts as "after"
    click()
    state.matter -= STAMP_COST
    const e = addBuilding('extractor', sc.ext.gx, sc.ext.gz, true)
    const f = addBuilding('furnace', sc.fur.gx, sc.fur.gz, true)
    completeLine(e, f)
    flag('firstStamp', 'FIRST STAMP — full line in one click.')
    state.fx.stamp = { t: state.t, gx: sc.ext.gx, gz: sc.ext.gz, fgx: sc.fur.gx, fgz: sc.fur.gz }
  }

  function demolish(gx, gz) {
    click()
    if (!inB(gx, gz)) return
    const id = occupied[idx(gx, gz)]
    if (!id) return
    const b = byId.get(id)
    occupied[idx(gx, gz)] = 0
    byId.delete(id)
    state.buildings = state.buildings.filter((q) => q.id !== id)
    const back = Math.floor(COSTS[b.kind] * REFUND)
    state.matter += back
    if (b.pair) {
      const li = state.lines.findIndex((L) => L.ext === id || L.fur === id)
      if (li >= 0) state.lines.splice(li, 1)
      const p = byId.get(b.pair)
      if (p) p.pair = 0
    }
    ev(`${b.kind.toUpperCase()} demolished — +${back} matter.`)
  }

  function act(a) {
    if (!a) return
    switch (a.type) {
      case 'select': {
        const t = a.tool
        if (t !== 'extractor' && t !== 'furnace' && t !== 'echo') return
        if (t === 'echo' && !state.echo.unlocked) return
        if (t === state.tool) return
        click()
        state.tool = t
        return
      }
      case 'rotate':
        if (!state.echo.unlocked) return
        click()
        state.echo.rot = (state.echo.rot + 1) & 3
        return
      case 'place': return place(a.gx | 0, a.gz | 0)
      case 'demolish': return demolish(a.gx | 0, a.gz | 0)
    }
  }

  function step(dt) {
    state.t += dt

    // demand schedule (the pressure)
    let req = DEMAND_STEPS[0][1]
    for (let i = 0; i < DEMAND_STEPS.length; i++)
      if (state.t >= DEMAND_STEPS[i][0]) req = DEMAND_STEPS[i][1]
    if (req !== state.required) {
      state.required = req
      if (req === 6) flag('surge', 'DEMAND SURGE — 6.0/s required.')
      else ev(`CONTRACT — required rate now ${req.toFixed(1)}/s.`)
    }

    // production: rates, not items — ingots teleport to the depot
    let actual = 0
    for (const L of state.lines) {
      if (L.dead) continue
      const ci = idx(L.gx, L.gz)
      const take = Math.min(LINE_RATE * dt, reserve[ci])
      if (take <= 0) {
        L.dead = true
        ev(`Patch ${patches[L.patch].name} cell exhausted — line idle.`)
        continue
      }
      reserve[ci] -= take
      actual += take / dt
      state.delivered += take
      state.matter += take * INGOT_VALUE
    }
    state.actual = actual

    // backlog: shortfall accumulates, surplus pays it back
    state.backlog = Math.max(0, state.backlog + (state.required - actual) * dt)
    if (!state.atRisk && state.backlog > BACKLOG_RISK) {
      state.atRisk = true
      ev(`CONTRACT AT RISK — backlog ${state.backlog.toFixed(0)} ingots.`)
    } else if (state.atRisk && state.backlog < 5) {
      state.atRisk = false
      ev('Backlog cleared.')
    }

    // win: sustain required rate at max demand
    if (!state.done) {
      if (state.required >= MAX_DEMAND && actual >= state.required - 1e-9) {
        state.contractTimer += dt
        if (state.contractTimer >= SUSTAIN) {
          state.done = true
          flag('contractMet',
            `CONTRACT MET — ${MAX_DEMAND.toFixed(1)}/s sustained ${SUSTAIN}s. Graduation at T+${state.t.toFixed(0)}s.`)
        }
      } else state.contractTimer = 0
    }
  }

  ev('CONTRACT posted — deliver 1.0 ingot/s to the depot. Demand will grow.')
  ev(`Survey: ${patches.length} ore patches. Depot online at the east edge.`)
  ev('Hand tools ready — EXTRACTOR 10 · FURNACE 15.')

  return { state, step, act, canPlace, stampCells }
}
