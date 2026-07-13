// sim.js — deterministic fixed-step simulation. No DOM.
import {
  GRID_W, GRID_H, TPS, BELT_EVERY, START_MONEY, DX, DY,
  TIERS, HW, BUILDINGS, OBJECTIVES,
  DECODE_ROOFLINE, GEN_LEN, MAX_DEPTH, DEPTH_BONUS, UNCOOLED,
} from './data.js'

export const idx = (x, y) => y * GRID_W + x
export const inBounds = (x, y) => x >= 0 && y >= 0 && x < GRID_W && y < GRID_H

export function newGame() {
  return {
    money: START_MONEY,
    tick: 0,
    hw: 0,                    // index into HW
    deployed: 0,              // index into TIERS
    unlocked: 0,              // highest trained tier
    research: 0,              // ttok fed toward tier `unlocked + 1`
    belts: new Map(),         // idx -> { d, item }
    bmap: new Map(),          // idx -> building id
    buildings: new Map(),     // id -> building
    nextId: 1,
    toasts: [],
    stats: { earned: 0, sold: 0, maxBatch: 0, maxDepthSold: 0, poweredOnce: false },
    rate: { money: 0, sold: 0 },
    power: { supply: 0, demand: 0, sat: 1, nets: 0 },
    objectives: OBJECTIVES.map(o => ({ ...o, done: false })),
  }
}

export function toast(g, msg) {
  g.toasts.push({ msg, t: g.tick })
  if (g.toasts.length > 5) g.toasts.shift()
}

// ------------------------------------------------------------- placement ---
export function footprint(type) {
  const d = BUILDINGS[type]
  return [d.w, d.h]
}

export function canPlace(g, type, x, y) {
  const [w, h] = footprint(type)
  if (type === 'belt') {
    if (!inBounds(x, y) || g.bmap.has(idx(x, y))) return false
    return true // placing over an existing belt just redirects it
  }
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const cx = x + i, cy = y + j
    if (!inBounds(cx, cy) || g.bmap.has(idx(cx, cy)) || g.belts.has(idx(cx, cy))) return false
  }
  return true
}

export function place(g, type, x, y, dir = 0) {
  const def = BUILDINGS[type]
  if (!canPlace(g, type, x, y)) return false
  if (type === 'belt') {
    const ex = g.belts.get(idx(x, y))
    if (ex) { ex.d = dir; return true } // redirect, free
    if (g.money < def.cost) return false
    g.money -= def.cost
    g.belts.set(idx(x, y), { d: dir, item: null })
    return true
  }
  if (g.money < def.cost) return false
  g.money -= def.cost
  const b = {
    id: g.nextId++, type, x, y, dir,
    buf: [],        // input queue
    out: [],        // output queue
    prog: 0,        // craft progress / rate accumulators
    craft: null,    // item being crafted (tokenizer/prefill)
    seqs: [],       // decode: live sequences {tier, depth, left, prog}
    powered: false, sat: 0, cooled: true, util: 0, noFuel: false,
  }
  g.buildings.set(b.id, b)
  const [w, h] = footprint(type)
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) g.bmap.set(idx(x + i, y + j), b.id)
  return true
}

export function removeAt(g, x, y) {
  const i = idx(x, y)
  if (g.belts.has(i)) {
    g.belts.delete(i)
    g.money += Math.floor(BUILDINGS.belt.cost / 2)
    return true
  }
  const bid = g.bmap.get(i)
  if (bid == null) return false
  const b = g.buildings.get(bid)
  const [w, h] = footprint(b.type)
  for (let j = 0; j < h; j++) for (let ii = 0; ii < w; ii++) g.bmap.delete(idx(b.x + ii, b.y + j))
  g.buildings.delete(bid)
  g.money += Math.floor(BUILDINGS[b.type].cost / 2)
  return true
}

export function buildingAt(g, x, y) {
  const bid = g.bmap.get(idx(x, y))
  return bid == null ? null : g.buildings.get(bid)
}

// Output port cell: one tile beyond the face-center on side `dir`.
export function outputCell(b) {
  const [w, h] = footprint(b.type)
  const cx = Math.floor((w - 1) / 2), cy = Math.floor((h - 1) / 2)
  switch (b.dir) {
    case 0: return [b.x + w, b.y + cy]
    case 1: return [b.x + cx, b.y + h]
    case 2: return [b.x - 1, b.y + cy]
    default: return [b.x + cx, b.y - 1]
  }
}

export const center = b => {
  const [w, h] = footprint(b.type)
  return [b.x + w / 2, b.y + h / 2]
}

// --------------------------------------------------------- derived stats ---
export const tier = g => TIERS[g.deployed]
export const hw = g => HW[g.hw]

export function decodeSlots(g) {
  return Math.max(1, Math.round(tier(g).slots * hw(g).slots))
}
export function decodeCap(g) { // pod otok/s roofline
  return DECODE_ROOFLINE * decodeSlots(g) * tier(g).seqRate * hw(g).rate
}
export function podPower(type, g) {
  const d = BUILDINGS[type]
  return d.gpu ? d.power * hw(g).power : (d.power || 0)
}

// ------------------------------------------------------------- accepting ---
function accepts(g, b, item) {
  switch (b.type) {
    case 'tokenizer': return (item.t === 'prompt' || item.t === 'data') && b.buf.length < 3
    case 'prefill': return (item.t === 'itok' || item.t === 'ctx') && b.buf.length < 3
    case 'decode': return item.t === 'kv' && item.tier === g.deployed &&
      (b.seqs.length + b.buf.length) < decodeSlots(g) + 2 && b.buf.length < 4
    case 'egress': return item.t === 'otok' && b.buf.length < 6
    case 'relay': return item.t === 'otok' && item.depth < MAX_DEPTH && b.buf.length < 4
    case 'trainer': return item.t === 'ttok' && b.buf.length < 8
    case 'buffer': return b.buf.length < 8
    default: return false
  }
}

function tryInsert(g, b, item) {
  if (!accepts(g, b, item)) return false
  b.buf.push(item)
  return true
}

// ------------------------------------------------------------------ power --
function rebuildPower(g) {
  // Nodes: anything with a coverage radius. Union overlapping discs into nets.
  const nodes = []
  for (const b of g.buildings.values()) {
    const r = BUILDINGS[b.type].r
    if (r) nodes.push({ b, r, net: -1 })
  }
  let nets = 0
  const parent = nodes.map((_, i) => i)
  const find = i => { while (parent[i] !== i) i = parent[i] = parent[parent[i]]; return i }
  for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
    const [ax, ay] = center(nodes[i].b), [bx, by] = center(nodes[j].b)
    const d2 = (ax - bx) ** 2 + (ay - by) ** 2
    if (d2 <= (nodes[i].r + nodes[j].r) ** 2) parent[find(j)] = find(i)
  }
  const netOf = new Map()
  for (let i = 0; i < nodes.length; i++) {
    const root = find(i)
    if (!netOf.has(root)) netOf.set(root, nets++)
    nodes[i].net = netOf.get(root)
  }
  // Assign consumers to the net of the first node covering them; tally demand.
  const supply = new Array(nets).fill(0)
  const demand = new Array(nets).fill(0)
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i]
    const def = BUILDINGS[n.b.type]
    if (def.powerOut && !n.b.noFuel) supply[n.net] += def.powerOut
  }
  for (const b of g.buildings.values()) {
    const draw = podPower(b.type, g)
    b.powered = false
    b.net = -1
    if (draw <= 0) { b.powered = true; b.sat = 1; continue }
    const [cx, cy] = center(b)
    for (const n of nodes) {
      const [nx, ny] = center(n.b)
      if ((cx - nx) ** 2 + (cy - ny) ** 2 <= n.r * n.r) {
        b.net = n.net
        b.powered = true
        demand[n.net] += draw
        break
      }
    }
  }
  const sat = supply.map((s, i) => demand[i] <= 0 ? 1 : Math.min(1, s / demand[i]))
  for (const b of g.buildings.values()) {
    if (podPower(b.type, g) > 0) b.sat = b.powered ? sat[b.net] : 0
  }
  g.power = {
    supply: supply.reduce((a, v) => a + v, 0),
    demand: demand.reduce((a, v) => a + v, 0),
    sat: sat.length ? Math.min(...sat.filter((_, i) => demand[i] > 0), 1) : 1,
    nets,
  }
  // Fuel: each turbine pays fuel × its net's load fraction.
  for (const n of nodes) {
    const def = BUILDINGS[n.b.type]
    if (!def.fuel) continue
    const load = supply[n.net] > 0 ? Math.min(1, demand[n.net] / supply[n.net]) : 0
    const cost = def.fuel * load / TPS
    g.money = Math.max(0, g.money - cost)
    n.b.fuelSpend = def.fuel * load
  }
  if (g.power.supply > 0 && g.power.demand > 0 && g.power.sat > 0.5) g.stats.poweredOnce = true
}

function rebuildCooling(g) {
  const towers = []
  for (const b of g.buildings.values()) {
    if (b.type === 'cool' && b.powered && b.sat > 0.25) towers.push(b)
  }
  for (const b of g.buildings.values()) {
    if (!BUILDINGS[b.type].gpu) { b.cooled = true; continue }
    const [cx, cy] = center(b)
    b.cooled = towers.some(t => {
      const [tx, ty] = center(t)
      const r = BUILDINGS.cool.coolR
      return (cx - tx) ** 2 + (cy - ty) ** 2 <= r * r
    })
  }
}

// --------------------------------------------------------------- buildings -
function eject(g, b) {
  if (!b.out.length) return
  const [ox, oy] = outputCell(b)
  if (!inBounds(ox, oy)) return
  const cell = g.belts.get(idx(ox, oy))
  if (cell) {
    if (!cell.item) cell.item = b.out.shift()
    return
  }
  const nb = buildingAt(g, ox, oy)
  if (nb && tryInsert(g, nb, b.out[0])) b.out.shift()
}

function actBuilding(g, b, dt) {
  const def = BUILDINGS[b.type]
  const f = b.sat * (def.gpu && !b.cooled ? UNCOOLED : 1)
  b.util = 0
  switch (b.type) {
    case 'intake': {
      if (b.out.length < 3) {
        b.prog += def.rate * f * dt
        if (b.prog >= 1) { b.prog -= 1; b.out.push({ t: 'prompt' }) }
      }
      b.util = b.out.length < 3 ? f : 0
      break
    }
    case 'scraper': {
      if (b.out.length < 3) {
        b.prog += def.rate * f * dt
        if (b.prog >= 1) { b.prog -= 1; b.out.push({ t: 'data' }) }
      }
      b.util = b.out.length < 3 ? f : 0
      break
    }
    case 'tokenizer': {
      if (!b.craft && b.buf.length && b.out.length <= 4) b.craft = b.buf.shift()
      if (b.craft) {
        b.prog += def.rate * f * dt
        b.util = f
        if (b.prog >= 1) {
          b.prog = 0
          const outType = b.craft.t === 'prompt' ? 'itok' : 'ttok'
          for (let i = 0; i < 4; i++) b.out.push({ t: outType, depth: 0 })
          b.craft = null
        }
      }
      break
    }
    case 'prefill': {
      if (!b.craft && b.buf.length && b.out.length < 4) b.craft = b.buf.shift()
      if (b.craft) {
        const rate = tier(g).prefillRate * hw(g).rate
        b.prog += rate * f * dt
        b.util = f
        if (b.prog >= 1) {
          b.prog = 0
          b.out.push({ t: 'kv', tier: g.deployed, depth: b.craft.depth || 0 })
          b.craft = null
        }
      }
      break
    }
    case 'decode': {
      const cap = decodeSlots(g)
      while (b.buf.length && b.seqs.length < cap) {
        const kv = b.buf.shift()
        b.seqs.push({ tier: kv.tier, depth: kv.depth, left: GEN_LEN, prog: 0 })
      }
      if (b.seqs.length > g.stats.maxBatch) g.stats.maxBatch = b.seqs.length
      if (b.seqs.length) {
        // Roofline: total generation is capped at DECODE_ROOFLINE of full batch.
        const perSeq = tier(g).seqRate * hw(g).rate * f
        const want = b.seqs.length * perSeq
        const roof = decodeCap(g) * f
        const scale = want > roof ? roof / want : 1
        b.bound = want > roof ? 'bandwidth' : (b.seqs.length >= cap ? 'kv-capacity' : 'batch-underfilled')
        b.util = roof > 0 ? Math.min(1, want / (decodeCap(g) || 1)) * f : 0
        for (const s of b.seqs) {
          if (b.out.length >= 8) break
          s.prog += perSeq * scale * dt
          if (s.prog >= 1) {
            s.prog -= 1
            s.left--
            b.out.push({ t: 'otok', tier: s.tier, depth: s.depth })
          }
        }
        b.seqs = b.seqs.filter(s => s.left > 0)
      } else b.bound = 'idle'
      break
    }
    case 'egress': {
      b.prog = Math.min(b.prog + def.rate * f * dt, 4)
      while (b.buf.length && b.prog >= 1) {
        b.prog -= 1
        const it = b.buf.shift()
        const val = TIERS[it.tier].value * (1 + DEPTH_BONUS * (it.depth || 0))
        g.money += val
        g.stats.earned += val
        g.stats.sold += 1
        g.tickEarn += val
        g.tickSold += 1
        if ((it.depth || 0) > g.stats.maxDepthSold) g.stats.maxDepthSold = it.depth
        b.util = f
      }
      break
    }
    case 'relay': {
      b.prog = Math.min(b.prog + def.rate * f * dt, 2)
      while (b.buf.length && b.prog >= 1 && b.out.length < 4) {
        b.prog -= 1
        const it = b.buf.shift()
        b.out.push({ t: 'ctx', tier: it.tier, depth: (it.depth || 0) + 1 })
        b.util = f
      }
      break
    }
    case 'trainer': {
      const target = g.unlocked + 1
      if (target < TIERS.length && b.buf.length) {
        b.prog += def.rate * f * dt
        b.util = f
        while (b.prog >= 1 && b.buf.length) {
          b.prog -= 1
          b.buf.shift()
          g.research += 1
        }
        if (g.research >= TIERS[target].trainNeed) {
          g.unlocked = target
          g.research = 0
          toast(g, `Checkpoint complete: ${TIERS[target].name} — deploy it from the Research tab`)
        }
      }
      break
    }
  }
  eject(g, b)
}

// ------------------------------------------------------------------- belts -
function moveBelts(g) {
  const moved = new Set()
  for (let pass = 0; pass < 12; pass++) {
    let any = false
    for (const [i, cell] of g.belts) {
      if (!cell.item || moved.has(cell.item)) continue
      const x = i % GRID_W, y = (i / GRID_W) | 0
      const nx = x + DX[cell.d], ny = y + DY[cell.d]
      if (!inBounds(nx, ny)) continue
      const ni = idx(nx, ny)
      const bid = g.bmap.get(ni)
      if (bid != null) {
        const b = g.buildings.get(bid)
        if (tryInsert(g, b, cell.item)) { cell.item = null; any = true }
        continue
      }
      const nb = g.belts.get(ni)
      if (nb && !nb.item) {
        nb.item = cell.item
        moved.add(cell.item)
        cell.item = null
        any = true
      }
    }
    if (!any) break
  }
}

// ------------------------------------------------------------------ deploy -
export function deploy(g, t) {
  if (t > g.unlocked || t === g.deployed) return
  g.deployed = t
  // Redeploy invalidates in-flight KV cache — the classic serving footgun.
  let purged = 0
  for (const cell of g.belts.values()) {
    if (cell.item && cell.item.t === 'kv' && cell.item.tier !== t) { cell.item = null; purged++ }
  }
  for (const b of g.buildings.values()) {
    if (b.type === 'decode') {
      const n = b.buf.length
      b.buf = b.buf.filter(it => it.tier === t)
      purged += n - b.buf.length
    }
    if (b.type === 'prefill' && b.craft) { /* prompt re-prefills at new tier automatically */ }
  }
  toast(g, `Deployed ${TIERS[t].name}.` + (purged ? ` Redeploy invalidated ${purged} stale KV block${purged > 1 ? 's' : ''}.` : ''))
}

export function buyHw(g, i) {
  if (i !== g.hw + 1 || g.money < HW[i].cost) return false
  g.money -= HW[i].cost
  g.hw = i
  toast(g, `Fleet refreshed to ${HW[i].name}. Throughput ×${HW[i].rate}, power ×${HW[i].power}.`)
  return true
}

// -------------------------------------------------------------- objectives -
function checkObjectives(g) {
  const s = g.stats
  const done = {
    power: s.poweredOnce,
    first: s.earned > 0,
    rate2: g.rate.sold >= 2,
    batch5: s.maxBatch >= 5,
    agent: s.maxDepthSold >= 2,
    train1: g.deployed >= 1,
    h100: g.hw >= 1,
    large: g.deployed >= 3,
    rich: g.money >= 100000,
  }
  for (const o of g.objectives) {
    if (!o.done && done[o.id]) {
      o.done = true
      toast(g, `✅ ${o.text}`)
    }
  }
}

// -------------------------------------------------------------------- tick -
export function tick(g) {
  const dt = 1 / TPS
  g.tick++
  g.tickEarn = 0
  g.tickSold = 0
  rebuildPower(g)
  rebuildCooling(g)
  for (const b of g.buildings.values()) actBuilding(g, b, dt)
  if (g.tick % BELT_EVERY === 0) moveBelts(g)
  // Smoothed rates (per second)
  const a = 0.03
  g.rate.money = g.rate.money * (1 - a) + (g.tickEarn / dt) * a
  g.rate.sold = g.rate.sold * (1 - a) + (g.tickSold / dt) * a
  checkObjectives(g)
  g.toasts = g.toasts.filter(t => g.tick - t.t < 6 * TPS)
}

// ------------------------------------------------------------ starter base -
// First-run seed: a complete working nano-125M line, placed free of charge.
// It is the tutorial — every mechanic is visible in one screen.
export function seedStarter(g) {
  const bank = g.money
  g.money = Infinity
  const P = (type, x, y, dir = 0) => place(g, type, x, y, dir)
  P('intake', 24, 18, 0)
  P('belt', 26, 18, 0); P('belt', 27, 18, 0)
  P('tokenizer', 28, 18, 0)
  P('belt', 30, 18, 0); P('belt', 31, 18, 0)
  P('prefill', 32, 18, 0)
  P('belt', 34, 18, 0); P('belt', 35, 18, 0)
  P('decode', 36, 18, 0)
  P('belt', 38, 18, 0); P('belt', 39, 18, 0)
  P('egress', 40, 18, 0)
  P('pylon', 26, 21); P('pylon', 40, 21)
  P('gas', 31, 21)
  P('cool', 35, 21)
  g.money = bank
  // Pre-stage items so the line reads at a glance: one of each stage in flight.
  const stage = [[26, { t: 'prompt' }], [30, { t: 'itok', depth: 0 }],
    [34, { t: 'kv', tier: 0, depth: 0 }], [38, { t: 'otok', tier: 0, depth: 0 }]]
  for (const [x, item] of stage) {
    const cell = g.belts.get(idx(x, 18))
    if (cell) cell.item = item
  }
  toast(g, 'Here is a working nano-125M line — press H for the engineering primer.')
}

// --------------------------------------------------------------- save/load -
export function serialize(g) {
  return JSON.stringify({
    v: 1,
    money: g.money, tick: g.tick, hw: g.hw, deployed: g.deployed,
    unlocked: g.unlocked, research: g.research, nextId: g.nextId,
    stats: g.stats,
    objectives: g.objectives.map(o => o.done),
    belts: [...g.belts].map(([i, c]) => [i, c.d, c.item]),
    buildings: [...g.buildings.values()].map(b => ({
      id: b.id, type: b.type, x: b.x, y: b.y, dir: b.dir,
      buf: b.buf, out: b.out, prog: b.prog, craft: b.craft, seqs: b.seqs,
    })),
  })
}

export function deserialize(json) {
  const d = JSON.parse(json)
  if (d.v !== 1) return null
  const g = newGame()
  Object.assign(g, {
    money: d.money, tick: d.tick, hw: d.hw, deployed: d.deployed,
    unlocked: d.unlocked, research: d.research, nextId: d.nextId,
  })
  Object.assign(g.stats, d.stats)
  d.objectives.forEach((done, i) => { if (g.objectives[i]) g.objectives[i].done = done })
  for (const [i, dd, item] of d.belts) g.belts.set(i, { d: dd, item })
  for (const bd of d.buildings) {
    if (!BUILDINGS[bd.type]) continue
    const b = {
      buf: [], out: [], prog: 0, craft: null, seqs: [],
      powered: false, sat: 0, cooled: true, util: 0, noFuel: false,
      ...bd,
    }
    g.buildings.set(b.id, b)
    const [w, h] = footprint(b.type)
    for (let j = 0; j < h; j++) for (let ii = 0; ii < w; ii++) g.bmap.set(idx(b.x + ii, b.y + j), b.id)
  }
  return g
}
