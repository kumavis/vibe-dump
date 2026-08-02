// Dino Trails simulation. The 3D world simulates guests walking trails and
// hands actual footfall counts to dayTick — the economy runs on footsteps.

import { ECON, SPECIES, FENCES, BUILDINGS, TERRAIN, cellPrice, fmtMoney } from './data.js'

const SAVE_KEY = 'dino-trails-v1'

// ---------------------------------------------------------------- state

export function newGame(seed, park) {
  const s = {
    v: 1,
    seed,
    day: 1,
    money: ECON.startMoney,
    fame: ECON.startFame,
    guests: 0,
    visitorRate: 8,
    cells: park.cells.map(() => ({ owned: false, use: null, fence: 0 })),
    dinos: [],
    market: { offers: [], nextRefresh: 0 },
    cellTraffic: {},
    ledger: [],
    history: [],
    flags: {},
    nextId: 1,
    over: false,
  }
  // Starter strip: the two buildable cells nearest the gate — a fenced
  // parasaur and a kiosk, so day one already has a park.
  const gate = park.verts[park.gateVertex]
  const near = park.cells
    .filter((c) => c.terrain !== 'water')
    .sort(
      (a, b) =>
        Math.hypot(a.centroid[0] - gate[0], a.centroid[1] - gate[1]) -
        Math.hypot(b.centroid[0] - gate[0], b.centroid[1] - gate[1])
    )
  const padCell = near.find((c) => c.inradius >= SPECIES.parasaur.minR)
  const kioskCell = near.find((c) => c !== padCell)
  s.cells[padCell.id] = { owned: true, use: 'paddock', fence: 0 }
  s.cells[kioskCell.id] = { owned: true, use: 'kiosk', fence: 0 }
  s.dinos.push({ id: s.nextId++, sp: 'parasaur', cell: padCell.id, hap: 70, escaped: false, escDays: 0 })
  rollMarket(s, Math.random)
  s.market.nextRefresh = ECON.marketRefreshDays
  s.ledger.push({ d: 1, label: 'Founding grant (one parasaur included)', amt: ECON.startMoney, cat: 'land' })
  s.history.push({ d: 0, inc: 0, exp: 0, bal: s.money, vis: 0, rep: s.fame })
  return s
}

export function save(s) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(s))
  } catch {
    /* play on without saves */
  }
}

export function load() {
  try {
    const s = JSON.parse(localStorage.getItem(SAVE_KEY) ?? 'null')
    return s?.v === 1 && Array.isArray(s.cells) ? s : null
  } catch {
    return null
  }
}

export function wipeSave() {
  try {
    localStorage.removeItem(SAVE_KEY)
  } catch {
    /* ignore */
  }
}

// ---------------------------------------------------------------- helpers

function ledger(s, label, amt, cat) {
  s.money += amt
  s.ledger.push({ d: s.day, label, amt: Math.round(amt), cat })
  if (s.ledger.length > 400) s.ledger.splice(0, s.ledger.length - 400)
}

export function dinosIn(s, cellId) {
  return s.dinos.filter((d) => d.cell === cellId)
}

export function escapees(s) {
  return s.dinos.filter((d) => d.escaped)
}

export function countUse(s, use) {
  return s.cells.filter((c) => c.use === use).length
}

// How many of this species fit the cell. 0 = too cramped.
export function capacityFor(cell, spKey) {
  const sp = SPECIES[spKey]
  if (cell.inradius < sp.minR) return 0
  if (sp.social === 'solo') return 1
  return Math.max(1, Math.min(3, Math.floor((cell.inradius / sp.minR) * 1.2)))
}

// Paddock cells that could take one more of this species right now.
export function eligibleCells(s, park, spKey) {
  return park.cells.filter((cell) => {
    const cs = s.cells[cell.id]
    if (!cs.owned || cs.use !== 'paddock') return false
    const herd = dinosIn(s, cell.id)
    const cap = capacityFor(cell, spKey)
    if (!cap || herd.length >= cap) return false
    return !herd.length || herd[0].sp === spKey
  })
}

export function priceOf(s, cell) {
  return cellPrice(cell, s.cellTraffic[cell.id] ?? 0)
}

export function attractionScore(s) {
  let a = 0
  for (const d of s.dinos) {
    if (d.escaped) continue
    a += SPECIES[d.sp].pop * (d.hap < 40 ? 0.6 : 1)
  }
  a += countUse(s, 'garden') * 0.6 + countUse(s, 'gift') * 0.4
  return a
}

function rollMarket(s, rng) {
  const entries = Object.entries(SPECIES)
  const total = entries.reduce((t, [, sp]) => t + sp.weight, 0)
  s.market.offers = []
  for (let slot = 0; slot < ECON.marketSlots; slot++) {
    let roll = rng() * total
    let pick = entries[0][0]
    for (const [key, sp] of entries) {
      roll -= sp.weight
      if (roll <= 0) {
        pick = key
        break
      }
    }
    const sp = SPECIES[pick]
    s.market.offers.push({
      sp: pick,
      price: Math.round((sp.cost * (0.85 + rng() * 0.3)) / 10) * 10,
    })
  }
}

// ---------------------------------------------------------------- actions

export function buyCell(s, park, cell) {
  const cs = s.cells[cell.id]
  if (cs.owned) return { ok: false, msg: 'Already yours.' }
  if (cell.terrain === 'water') return { ok: false, msg: 'The pond belongs to the ducks.' }
  const price = priceOf(s, cell)
  if (s.money < price) return { ok: false, msg: `Need ${fmtMoney(price)} for this land.` }
  cs.owned = true
  ledger(s, `Bought ${TERRAIN[cell.terrain].name.toLowerCase()} land`, -price, 'land')
  return { ok: true, msg: 'Territory claimed!' }
}

export function build(s, cell, kind) {
  const b = BUILDINGS[kind]
  const cs = s.cells[cell.id]
  if (!b || !cs.owned || cs.use) return { ok: false, msg: 'This cell is taken.' }
  if (s.money < b.cost) return { ok: false, msg: `Need ${fmtMoney(b.cost)}.` }
  cs.use = kind
  cs.fence = 0
  ledger(s, `Built ${b.name}`, -b.cost, 'construction')
  return { ok: true, msg: `${b.icon} ${b.name} ready!` }
}

export function demolish(s, cell) {
  const cs = s.cells[cell.id]
  if (!cs.use) return { ok: false }
  if (cs.use === 'paddock' && dinosIn(s, cell.id).length) {
    return { ok: false, msg: 'Sell the dinosaurs first.' }
  }
  const refund = Math.round(BUILDINGS[cs.use].cost * 0.3)
  ledger(s, `Demolished ${BUILDINGS[cs.use].name}`, refund, 'construction')
  cs.use = null
  cs.fence = 0
  return { ok: true, msg: `Cleared (+${fmtMoney(refund)} salvage).` }
}

export function upgradeFence(s, cell) {
  const cs = s.cells[cell.id]
  if (cs.use !== 'paddock') return { ok: false }
  const next = FENCES[cs.fence + 1]
  if (!next) return { ok: false, msg: 'Fence is already maxed.' }
  if (s.money < next.cost) return { ok: false, msg: `Need ${fmtMoney(next.cost)}.` }
  cs.fence += 1
  ledger(s, `Fence upgrade: ${next.name}`, -next.cost, 'construction')
  return { ok: true, msg: `${next.name} fence installed.` }
}

export function buyOffer(s, park, offerIdx, cellId) {
  const offer = s.market.offers[offerIdx]
  if (!offer) return { ok: false, msg: 'That offer is gone.' }
  const sp = SPECIES[offer.sp]
  const cell = park.cells[cellId]
  if (!eligibleCells(s, park, offer.sp).some((c) => c.id === cellId)) {
    return { ok: false, msg: 'That paddock cannot take this dinosaur.' }
  }
  if (s.money < offer.price) return { ok: false, msg: `Need ${fmtMoney(offer.price)}.` }
  s.dinos.push({ id: s.nextId++, sp: offer.sp, cell: cellId, hap: 65, escaped: false, escDays: 0 })
  s.market.offers.splice(offerIdx, 1)
  ledger(s, `Bought ${sp.name} at market`, -offer.price, 'dinos')
  const weak = sp.fer > FENCES[s.cells[cellId].fence].strength
  return {
    ok: true,
    msg: weak ? `${sp.icon} ${sp.name} delivered… upgrade that fence.` : `${sp.icon} ${sp.name} settled in!`,
  }
}

export function sellDino(s, dino) {
  const sp = SPECIES[dino.sp]
  const refund = Math.round(sp.cost * 0.4)
  s.dinos = s.dinos.filter((d) => d.id !== dino.id)
  ledger(s, `Sold ${sp.name} to a rival park`, refund, 'dinos')
  return { ok: true, msg: `${sp.name} sold for ${fmtMoney(refund)}.` }
}

export function recaptureCost(dino) {
  return 150 + SPECIES[dino.sp].fer * 100
}

export function recapture(s, dino) {
  if (!dino.escaped) return { ok: false }
  const cost = recaptureCost(dino)
  if (s.money < cost) return { ok: false, msg: `The rangers want ${fmtMoney(cost)} up front.` }
  dino.escaped = false
  dino.escDays = 0
  dino.hap = Math.min(100, dino.hap + 25)
  ledger(s, `Recaptured ${SPECIES[dino.sp].name}`, -cost, 'incidents')
  return { ok: true, msg: `${SPECIES[dino.sp].icon} Back behind the fence.` }
}

// ---------------------------------------------------------------- day tick
// traffic: { entered, byCell: {cellId: adjacent trail crossings} } from world.

export function dayTick(s, park, traffic) {
  const events = []
  s.day += 1
  s.guests = traffic.entered
  s.cellTraffic = traffic.byCell

  // --- income: tickets + footfall shops
  let inc = 0
  const tickets = traffic.entered * ECON.ticket
  if (tickets) ledger(s, `Tickets — ${traffic.entered} guests`, tickets, 'tickets')
  inc += tickets
  for (const cell of park.cells) {
    const cs = s.cells[cell.id]
    if (cs.use !== 'kiosk' && cs.use !== 'gift') continue
    const passes = traffic.byCell[cell.id] ?? 0
    const rate = cs.use === 'kiosk' ? 2.0 : 3.2
    const take = Math.round(passes * rate)
    if (take) {
      ledger(s, `${BUILDINGS[cs.use].name} — ${passes} passers-by`, take, cs.use === 'kiosk' ? 'food' : 'gifts')
      inc += take
    }
  }

  // --- expenses
  let exp = 0
  const feed = s.dinos.reduce((t, d) => t + SPECIES[d.sp].food, 0)
  if (feed) {
    ledger(s, `Dinosaur feed (${s.dinos.length})`, -feed, 'upkeep')
    exp += feed
  }
  const upkeep = s.cells.reduce((t, c) => t + (c.use ? BUILDINGS[c.use].upkeep : 0), 0)
  if (upkeep) {
    ledger(s, 'Upkeep', -upkeep, 'upkeep')
    exp += upkeep
  }
  ledger(s, 'Staff wages', -ECON.staffBase, 'staff')
  exp += ECON.staffBase

  // --- happiness: room, company, terrain, calm neighbors
  for (const d of s.dinos) {
    const sp = SPECIES[d.sp]
    const cell = park.cells[d.cell]
    const herd = dinosIn(s, d.cell)
    let delta = 4 - sp.irr * 0.8
    if (cell.inradius > sp.minR * 1.5) delta += 2 // roomy territory
    if (sp.social === 'herd') delta += herd.length >= 2 ? 3 : -2
    else delta += herd.length === 1 ? 2 : -4
    for (const nb of cell.neighbors) {
      if (s.cells[nb].use === 'garden') delta += 2
      if (park.cells[nb].terrain === 'water') delta += 1.5 // lakeside calm
    }
    if (cell.terrain === 'forest') delta += 1
    delta += Math.random() * 4 - 2
    d.hap = Math.max(0, Math.min(100, d.hap + Math.min(8, delta)))
  }

  // --- escapes
  for (const d of s.dinos) {
    if (d.escaped) {
      d.escDays += 1
      s.fame = Math.max(0, s.fame - 2)
      continue
    }
    const sp = SPECIES[d.sp]
    const diff = sp.fer - FENCES[s.cells[d.cell].fence].strength
    if (diff <= 0) continue
    let p = 0.02 * diff
    if (d.hap < 40) p += ((40 - d.hap) / 40) * 0.1 * diff
    if (Math.random() < Math.min(0.35, p)) {
      d.escaped = true
      d.escDays = 0
      s.fame = Math.max(0, s.fame - 8)
      events.push({ icon: '🚨', text: `${sp.icon} A ${sp.name} broke out onto the trails! Tap it.`, tone: 'bad' })
    }
  }

  // --- fame drift
  const variety = new Set(s.dinos.map((d) => d.sp)).size
  const avgHap = s.dinos.length ? s.dinos.reduce((t, d) => t + d.hap, 0) / s.dinos.length : 60
  let target =
    25 + variety * 5 + countUse(s, 'garden') * 2.5 + countUse(s, 'restroom') * 3 + (avgHap - 60) * 0.25
  if (!countUse(s, 'restroom') && traffic.entered > 25) target -= 8
  target = Math.max(5, Math.min(95, target))
  s.fame = Math.max(0, Math.min(100, s.fame + (target - s.fame) * 0.12))

  // --- tomorrow's demand (world paces guest spawns off this)
  let rate = (4 + Math.pow(attractionScore(s), 0.8) * 2.0) * (0.3 + (s.fame / 100) * 1.3)
  if (escapees(s).length) rate *= 0.35
  s.visitorRate = Math.max(2, Math.min(80, Math.round(rate * (0.9 + Math.random() * 0.2))))

  // --- market countdown
  s.market.nextRefresh -= 1
  if (s.market.nextRefresh <= 0) {
    rollMarket(s, Math.random)
    s.market.nextRefresh = ECON.marketRefreshDays
    const rare = s.market.offers.find((o) => SPECIES[o.sp].weight <= 0.09)
    events.push(
      rare
        ? { icon: '✨', text: `RARE at the market: ${SPECIES[rare.sp].name}! ${ECON.marketRefreshDays} days only.`, tone: 'celebrate' }
        : { icon: '🛒', text: 'The dino market has fresh stock.', tone: 'info' }
    )
  }

  // --- bookkeeping
  s.history.push({
    d: s.day,
    inc: Math.round(inc),
    exp: Math.round(exp),
    bal: Math.round(s.money),
    vis: traffic.entered,
    rep: Math.round(s.fame),
  })
  if (s.history.length > 120) s.history.splice(0, s.history.length - 120)

  for (const [flag, cond, icon, text] of [
    ['m10k', s.money >= 10000, '💰', 'Milestone: $10,000 banked!'],
    ['m30k', s.money >= 30000, '🏦', 'Milestone: $30,000! Land barons take notice.'],
    ['five', variety >= 5, '🏆', 'Five species! Your trails are famous.'],
  ]) {
    if (cond && !s.flags[flag]) {
      s.flags[flag] = true
      events.push({ icon, text, tone: 'good' })
    }
  }
  if (s.money < ECON.bankruptcyAt) {
    s.over = true
    events.push({ icon: '💀', text: 'The bank forecloses the park…', tone: 'bad' })
  }

  save(s)
  return events
}
