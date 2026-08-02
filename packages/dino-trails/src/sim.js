// Dino Trails simulation. The 3D world simulates guests walking trails and
// hands actual footfall counts to dayTick — the economy runs on footsteps.

import { ECON, SPECIES, FENCES, BUILDINGS, TERRAIN, DISASTERS, cellPrice, fmtMoney } from './data.js'

// v2: terrain density changed — v1 saves reference cells that no longer exist.
const SAVE_KEY = 'dino-trails-v2'

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
    ticket: ECON.ticket,
    disaster: null, // { key, days }
    lastDisaster: 0,
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
    if (s?.v !== 1 || !Array.isArray(s.cells)) return null
    // Saves from before the support-systems update get sensible defaults.
    s.ticket ??= ECON.ticket
    s.disaster ??= null
    s.lastDisaster ??= 0
    return s
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
  // Ranch stock (`always`) never occupies a traveling-market slot.
  const entries = Object.entries(SPECIES).filter(([, sp]) => !sp.always)
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

// Ranch stock: commons purchasable any time at list price.
export function buyCommon(s, park, spKey, cellId) {
  const sp = SPECIES[spKey]
  if (!sp?.always) return { ok: false }
  if (!eligibleCells(s, park, spKey).some((c) => c.id === cellId)) {
    return { ok: false, msg: 'That paddock cannot take this dinosaur.' }
  }
  if (s.money < sp.cost) return { ok: false, msg: `Need ${fmtMoney(sp.cost)}.` }
  s.dinos.push({ id: s.nextId++, sp: spKey, cell: cellId, hap: 65, escaped: false, escDays: 0 })
  ledger(s, `Bought ${sp.name} from the ranch`, -sp.cost, 'dinos')
  return { ok: true, msg: `${sp.icon} ${sp.name} settled in!` }
}

export function sellDino(s, dino) {
  const sp = SPECIES[dino.sp]
  const refund = Math.round(sp.cost * 0.4)
  s.dinos = s.dinos.filter((d) => d.id !== dino.id)
  ledger(s, `Sold ${sp.name} to a rival park`, refund, 'dinos')
  return { ok: true, msg: `${sp.name} sold for ${fmtMoney(refund)}.` }
}

export function setTicket(s, price) {
  s.ticket = Math.max(ECON.ticketMin, Math.min(ECON.ticketMax, Math.round(price)))
}

export function sweetTicket(s) {
  return 7 + s.fame / 9
}

export function treatDino(s, dino) {
  if (!dino.sick) return { ok: false }
  if (s.money < ECON.treatCost) return { ok: false, msg: `The vet call-out is ${fmtMoney(ECON.treatCost)}.` }
  dino.sick = false
  dino.sickDays = 0
  dino.hap = Math.min(100, dino.hap + 15)
  ledger(s, `Vet call-out for ${SPECIES[dino.sp].name}`, -ECON.treatCost, 'incidents')
  return { ok: true, msg: `${SPECIES[dino.sp].name} is back on its feet.` }
}

// Park support systems at a glance — the tick and the Books dashboard
// both read from here so they can never disagree.
export function systems(s) {
  const feedDemand = s.dinos.reduce((t, d) => t + SPECIES[d.sp].food, 0)
  const feedCapacity = ECON.baseFeedCapacity + countUse(s, 'depot') * 60
  const dangerous = s.dinos.filter((d) => SPECIES[d.sp].fer >= 3).length
  const covered = countUse(s, 'ranger') * ECON.rangerCoverage
  const powered = countUse(s, 'generator') > 0
  return { feedDemand, feedCapacity, dangerous, covered, powered }
}

// Effective fence strength: electric fencing only reaches full strength
// with a generator, and an unpowered outage drops it regardless.
export function fenceStrength(s, cellState) {
  let str = FENCES[cellState.fence].strength
  if (cellState.fence === 2 && !countUse(s, 'generator')) str = 3
  return str
}

export function recaptureCost(s, dino) {
  const base = 150 + SPECIES[dino.sp].fer * 100
  return countUse(s, 'ranger') ? Math.round(base * 0.6) : base
}

export function recapture(s, dino) {
  if (!dino.escaped) return { ok: false }
  const cost = recaptureCost(s, dino)
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
  const sys = systems(s)

  // --- active disaster timers
  let disasterMult = 1
  const standsDark = s.disaster?.key === 'outage' && !sys.powered
  if (s.disaster) {
    if (s.disaster.key === 'outage') disasterMult = sys.powered ? 1 : 0.8
    if (s.disaster.key === 'storm') disasterMult = 0.4
    if (s.disaster.key === 'heatwave') disasterMult = 0.85
    s.disaster.days -= 1
    if (s.disaster.days <= 0) {
      events.push({ icon: '🌤️', text: `${DISASTERS[s.disaster.key].name} is over.`, tone: 'good' })
      s.disaster = null
    }
  }

  // --- income: tickets + footfall shops
  let inc = 0
  const tickets = traffic.entered * s.ticket
  if (tickets) ledger(s, `Tickets — ${traffic.entered} guests at ${fmtMoney(s.ticket)}`, tickets, 'tickets')
  inc += tickets
  for (const cell of park.cells) {
    const cs = s.cells[cell.id]
    if (cs.use !== 'kiosk' && cs.use !== 'gift') continue
    const passes = traffic.byCell[cell.id] ?? 0
    const rate = cs.use === 'kiosk' ? 2.0 : 3.2
    let take = Math.round(passes * rate)
    if (standsDark) take = Math.round(take * 0.5)
    if (take) {
      ledger(s, `${BUILDINGS[cs.use].name} — ${passes} passers-by${standsDark ? ' (by candlelight)' : ''}`, take, cs.use === 'kiosk' ? 'food' : 'gifts')
      inc += take
    }
  }

  // --- expenses: feed (with overflow premium), upkeep, wages
  let exp = 0
  const hungry = sys.feedDemand > sys.feedCapacity
  if (sys.feedDemand) {
    const covered = Math.min(sys.feedDemand, sys.feedCapacity)
    const overflow = sys.feedDemand - covered
    const feedCost = Math.round(covered + overflow * ECON.overflowFeedMult)
    ledger(s, overflow ? `Dino feed (${overflow} imported at a premium)` : `Dino feed (${s.dinos.length} dinos)`, -feedCost, 'upkeep')
    exp += feedCost
    if (hungry && !s.flags.hungryWarned) {
      s.flags.hungryWarned = true
      events.push({ icon: '🌾', text: 'Feed demand exceeds depot capacity — imports cost extra and dinos grumble.', tone: 'bad' })
    }
    if (!hungry) s.flags.hungryWarned = false
  }
  const upkeep = s.cells.reduce((t, c) => t + (c.use ? BUILDINGS[c.use].upkeep : 0), 0)
  if (upkeep) {
    ledger(s, 'Upkeep', -upkeep, 'upkeep')
    exp += upkeep
  }
  ledger(s, 'Staff wages', -ECON.staffBase, 'staff')
  exp += ECON.staffBase

  // --- happiness: room, company, terrain, calm neighbors, hardship
  const heat = s.disaster?.key === 'heatwave'
  for (const d of s.dinos) {
    const sp = SPECIES[d.sp]
    const cell = park.cells[d.cell]
    const herd = dinosIn(s, d.cell)
    let delta = 4 - sp.irr * 0.8
    if (cell.inradius > sp.minR * 1.5) delta += 2 // roomy territory
    if (sp.social === 'herd') delta += herd.length >= 2 ? 3 : -2
    else delta += herd.length === 1 ? 2 : -4
    let waterNear = false
    for (const nb of cell.neighbors) {
      if (s.cells[nb].use === 'garden') delta += 2
      if (park.cells[nb].terrain === 'water') {
        waterNear = true
        delta += sp.loves === 'water' ? 4 : 1.5 // lakeside calm; fisher-kings crave it
      }
    }
    if (sp.loves === 'water' && !waterNear) delta -= 3
    if (cell.terrain === 'forest') delta += 1
    if (heat && !waterNear) delta -= 6
    if (hungry) delta -= 2
    if (d.sick) delta -= 4
    delta += Math.random() * 4 - 2
    d.hap = Math.max(0, Math.min(100, d.hap + Math.min(8, delta)))
  }

  // --- sickness runs its course (a clinic cures overnight)
  const clinics = countUse(s, 'clinic')
  for (const d of s.dinos) {
    if (!d.sick) continue
    if (clinics) {
      d.sick = false
      d.sickDays = 0
      events.push({ icon: '🩺', text: `The clinic patched up the ${SPECIES[d.sp].name}.`, tone: 'good' })
    } else {
      d.sickDays = (d.sickDays ?? 0) + 1
      if (d.sickDays >= 4) {
        d.sick = false
        d.sickDays = 0
      }
    }
  }

  // --- escapes: fence vs teeth, moderated by ranger coverage
  const rangerOn = countUse(s, 'ranger') > 0
  const coverageFactor =
    sys.dangerous === 0 ? 1 : sys.covered >= sys.dangerous ? 0.5 : 1.5 - Math.min(1, sys.covered / sys.dangerous)
  for (const d of s.dinos) {
    if (d.escaped) {
      d.escDays += 1
      s.fame = Math.max(0, s.fame - 2)
      if (rangerOn && d.escDays >= 2) {
        d.escaped = false
        d.escDays = 0
        ledger(s, `Rangers recaptured ${SPECIES[d.sp].name}`, -100, 'incidents')
        events.push({ icon: '🎯', text: `Rangers wrangled the ${SPECIES[d.sp].name} back home.`, tone: 'good' })
      }
      continue
    }
    const sp = SPECIES[d.sp]
    const diff = sp.fer - fenceStrength(s, s.cells[d.cell])
    if (diff <= 0) continue
    let p = 0.02 * diff
    if (d.hap < 40) p += ((40 - d.hap) / 40) * 0.1 * diff
    if (sp.fer >= 3) p *= coverageFactor
    if (Math.random() < Math.min(0.35, p)) {
      d.escaped = true
      d.escDays = 0
      s.fame = Math.max(0, s.fame - 8)
      events.push({ icon: '🚨', text: `${sp.icon} A ${sp.name} broke out onto the trails! Tap it.`, tone: 'bad' })
    }
  }

  // --- small incidents: illness and fence wear
  if (s.day > 6) {
    for (const d of s.dinos) {
      if (!d.sick && !d.escaped && Math.random() < 0.012) {
        d.sick = true
        d.sickDays = 0
        events.push({
          icon: '🤒',
          text: `The ${SPECIES[d.sp].name} looks queasy${clinics ? ' — the clinic is on it.' : '. Treat it or wait it out.'}`,
          tone: 'bad',
        })
      }
    }
    for (const cell of park.cells) {
      const cs = s.cells[cell.id]
      if (cs.use !== 'paddock' || cs.fence === 0) continue
      const herd = dinosIn(s, cell.id)
      if (!herd.length) continue
      const maxFer = Math.max(...herd.map((d) => SPECIES[d.sp].fer))
      if (Math.random() < 0.008 * maxFer) {
        cs.fence -= 1
        events.push({ icon: '🔨', text: `Fence damage in a ${SPECIES[herd[0].sp].name} paddock — it dropped to ${FENCES[cs.fence].name}!`, tone: 'bad' })
      }
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

  // --- tomorrow's demand: star power × fame × gate price × conditions
  const priceFactor = 2 / (1 + Math.exp((s.ticket - sweetTicket(s)) / 3.5))
  let rate = (5 + Math.pow(attractionScore(s), 0.8) * 2.4) * (0.3 + (s.fame / 100) * 1.3)
  rate *= priceFactor * disasterMult
  if (escapees(s).length) rate *= 0.35
  s.visitorRate = Math.max(2, Math.min(80, Math.round(rate * (0.9 + Math.random() * 0.2))))

  // --- maybe a fresh disaster rolls in
  if (!s.disaster && s.day > 10 && s.day - s.lastDisaster > 8 && Math.random() < 0.07) {
    const keys = Object.keys(DISASTERS)
    const key = keys[Math.floor(Math.random() * keys.length)]
    s.disaster = { key, days: DISASTERS[key].days }
    s.lastDisaster = s.day
    if (key === 'storm') {
      let wrecked = 0
      for (const cs of s.cells) {
        if (cs.use === 'garden' && Math.random() < 0.25) {
          cs.use = null
          wrecked += 1
        }
      }
      s.fame = Math.max(0, s.fame - 3)
      events.push({
        icon: '⛈️',
        text: wrecked ? `Thunderstorm! ${wrecked} garden${wrecked > 1 ? 's' : ''} blown to bits.` : 'Thunderstorm! Guests are staying home.',
        tone: 'bad',
      })
    } else if (key === 'outage' && sys.powered) {
      events.push({ icon: '🔌', text: 'City power failed — your generator kicked in!', tone: 'good' })
    } else {
      events.push({ icon: DISASTERS[key].icon, text: `${DISASTERS[key].name}! ${DISASTERS[key].desc}`, tone: 'bad' })
    }
  }

  // --- market countdown
  s.market.nextRefresh -= 1
  if (s.market.nextRefresh <= 0) {
    rollMarket(s, Math.random)
    s.market.nextRefresh = ECON.marketRefreshDays
    const rare = s.market.offers.find((o) => SPECIES[o.sp].weight <= 0.07)
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
