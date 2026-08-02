// Simulation core: game state, player actions, and the daily economy tick.
// No rendering or DOM in this file — world.js and ui.js read the state.

import { GRID, ECON, GATE, SPECIES, FENCES, BUILDINGS, ADS, DISASTERS, plotPrice, fmtMoney } from './data.js'

const SAVE_KEY = 'dino-park-tycoon-v1'
const PADDOCK_CAP = 3

// ---------------------------------------------------------------- state

export function newGame() {
  const s = {
    v: 1,
    day: 1,
    money: ECON.startMoney,
    rep: ECON.startRep,
    ticket: ECON.ticketDefault,
    visitors: 0,
    plots: [],
    dinos: [],
    ad: null, // { key, days }
    disaster: null, // { key, days }
    lastDisaster: 0,
    nextId: 1,
    ledger: [], // { d, label, amt, cat }
    history: [], // { d, inc, exp, bal, vis, rep }
    flags: {},
    over: false,
  }
  for (let r = 0; r < GRID.N; r++) {
    for (let c = 0; c < GRID.N; c++) {
      s.plots.push({ id: r * GRID.N + c, r, c, owned: false, kind: null, fence: 0 })
    }
  }
  // Starter park: a little strip by the gate so day one already feels alive.
  const own = [[5, 2], [5, 3], [5, 4], [6, 2], [6, 3], [6, 4]]
  for (const [r, c] of own) plotAt(s, r, c).owned = true
  const pad = plotAt(s, 5, 3)
  pad.kind = 'paddock'
  addDino(s, pad, 'parasaur')
  addDino(s, pad, 'parasaur')
  plotAt(s, 6, 2).kind = 'shack'
  plotAt(s, 6, 4).kind = 'garden'
  s.ledger.push({ d: 1, label: 'Opening loan from Aunt Dolores', amt: ECON.startMoney, cat: 'land' })
  s.history.push({ d: 0, inc: 0, exp: 0, bal: s.money, vis: 0, rep: s.rep })
  return s
}

function addDino(s, plot, sp) {
  const d = { id: s.nextId++, sp, plot: plot.id, hap: 70, escaped: false, escDays: 0 }
  s.dinos.push(d)
  return d
}

export function plotAt(s, r, c) {
  if (r < 0 || c < 0 || r >= GRID.N || c >= GRID.N) return null
  return s.plots[r * GRID.N + c]
}

export function plotById(s, id) {
  return s.plots[id]
}

export function dinosIn(s, plotId) {
  return s.dinos.filter((d) => d.plot === plotId)
}

export function escapees(s) {
  return s.dinos.filter((d) => d.escaped)
}

function neighbors(s, plot) {
  return [
    plotAt(s, plot.r - 1, plot.c),
    plotAt(s, plot.r + 1, plot.c),
    plotAt(s, plot.r, plot.c - 1),
    plotAt(s, plot.r, plot.c + 1),
  ].filter(Boolean)
}

function countKind(s, kind) {
  return s.plots.filter((p) => p.kind === kind).length
}

function ledger(s, label, amt, cat) {
  s.money += amt
  s.ledger.push({ d: s.day, label, amt: Math.round(amt), cat })
  if (s.ledger.length > 400) s.ledger.splice(0, s.ledger.length - 400)
}

// ---------------------------------------------------------------- save / load

export function save(s) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(s))
  } catch {
    /* private mode etc. — play on without saves */
  }
}

export function load() {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return null
    const s = JSON.parse(raw)
    if (s?.v !== 1 || !Array.isArray(s.plots)) return null
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

// ---------------------------------------------------------------- player actions
// Every action returns { ok, msg } and writes its own ledger line.

export function buyPlot(s, plot) {
  if (plot.owned) return { ok: false, msg: 'Already yours.' }
  const price = plotPrice(plot.r, plot.c)
  if (s.money < price) return { ok: false, msg: 'Not enough money for this land.' }
  plot.owned = true
  ledger(s, `Bought land (${plot.r + 1},${plot.c + 1})`, -price, 'land')
  return { ok: true, msg: 'Land acquired!' }
}

export function build(s, plot, kind) {
  const b = BUILDINGS[kind]
  if (!b) return { ok: false }
  if (!plot.owned || plot.kind) return { ok: false, msg: 'This plot is taken.' }
  if (s.money < b.cost) return { ok: false, msg: `Need ${fmtMoney(b.cost)}.` }
  plot.kind = kind
  plot.fence = 0
  ledger(s, `Built ${b.name}`, -b.cost, 'construction')
  return { ok: true, msg: `${b.icon} ${b.name} built!` }
}

export function demolish(s, plot) {
  if (!plot.kind) return { ok: false }
  if (plot.kind === 'paddock' && dinosIn(s, plot.id).length) {
    return { ok: false, msg: 'Sell or move the dinosaurs out first.' }
  }
  const b = BUILDINGS[plot.kind]
  const refund = Math.round(b.cost * 0.3)
  ledger(s, `Demolished ${b.name}`, refund, 'construction')
  plot.kind = null
  plot.fence = 0
  return { ok: true, msg: `Demolished (+${fmtMoney(refund)} salvage).` }
}

export function buyDino(s, plot, spKey) {
  const sp = SPECIES[spKey]
  if (!sp || plot.kind !== 'paddock') return { ok: false }
  const herd = dinosIn(s, plot.id)
  if (herd.length >= PADDOCK_CAP) return { ok: false, msg: 'Paddock is full (3 max).' }
  if (herd.length && herd[0].sp !== spKey) {
    return { ok: false, msg: `This paddock houses ${SPECIES[herd[0].sp].name} only.` }
  }
  if (s.money < sp.cost) return { ok: false, msg: `Need ${fmtMoney(sp.cost)}.` }
  addDino(s, plot, spKey)
  ledger(s, `Adopted ${sp.name}`, -sp.cost, 'dinos')
  const weak = sp.fer > FENCES[plot.fence].strength
  return {
    ok: true,
    msg: weak
      ? `${sp.icon} ${sp.name} delivered… the fence looks worried.`
      : `${sp.icon} ${sp.name} settled in!`,
  }
}

export function sellDino(s, dino) {
  const sp = SPECIES[dino.sp]
  const refund = Math.round(sp.cost * 0.4)
  s.dinos = s.dinos.filter((d) => d.id !== dino.id)
  ledger(s, `Sold ${sp.name} to a rival park`, refund, 'dinos')
  return { ok: true, msg: `${sp.name} sold for ${fmtMoney(refund)}.` }
}

export function upgradeFence(s, plot) {
  if (plot.kind !== 'paddock') return { ok: false }
  const next = FENCES[plot.fence + 1]
  if (!next) return { ok: false, msg: 'Fence is already maxed out.' }
  if (s.money < next.cost) return { ok: false, msg: `Need ${fmtMoney(next.cost)}.` }
  plot.fence += 1
  ledger(s, `Fence upgrade: ${next.name}`, -next.cost, 'construction')
  return { ok: true, msg: `${next.name} fence installed.` }
}

export function startAd(s, key) {
  const ad = ADS[key]
  if (!ad) return { ok: false }
  if (s.ad) return { ok: false, msg: 'A campaign is already running.' }
  if (s.money < ad.cost) return { ok: false, msg: `Need ${fmtMoney(ad.cost)}.` }
  s.ad = { key, days: ad.days }
  if (ad.rep) s.rep = Math.min(100, s.rep + ad.rep)
  ledger(s, `${ad.name} launched`, -ad.cost, 'ads')
  return { ok: true, msg: `${ad.icon} ${ad.name} is live — expect crowds!` }
}

export function recaptureCost(s, dino) {
  const base = 150 + SPECIES[dino.sp].fer * 100
  return countKind(s, 'ranger') ? Math.round(base * 0.6) : base
}

export function recapture(s, dino) {
  if (!dino.escaped) return { ok: false }
  const cost = recaptureCost(s, dino)
  if (s.money < cost) return { ok: false, msg: `The ranger crew wants ${fmtMoney(cost)} up front.` }
  dino.escaped = false
  dino.escDays = 0
  dino.hap = Math.min(100, dino.hap + 25) // the chase was, honestly, fun
  ledger(s, `Recaptured ${SPECIES[dino.sp].name}`, -cost, 'incidents')
  return { ok: true, msg: `${SPECIES[dino.sp].icon} Back behind the fence. Phew.` }
}

export function setTicket(s, price) {
  s.ticket = Math.max(4, Math.min(24, Math.round(price)))
}

// ---------------------------------------------------------------- daily tick

export function fenceStrength(s, plot) {
  let str = FENCES[plot.fence].strength
  // An outage drops electric fences to chain-link… unless a generator hums along.
  if (s.disaster?.key === 'outage' && plot.fence === 3 && !countKind(s, 'generator')) {
    str = 2
  }
  return str
}

export function sweetTicket(s) {
  return 6 + s.rep / 10
}

export function attractionScore(s) {
  let a = 0
  for (const d of s.dinos) {
    if (d.escaped) continue
    a += SPECIES[d.sp].pop * (d.hap < 40 ? 0.6 : 1)
  }
  a += (countKind(s, 'garden') + countKind(s, 'fountain')) * 0.6
  a += countKind(s, 'gift') * 0.4
  return a
}

// Runs once per in-game day. Returns UI events: { icon, text, tone }.
export function dayTick(s) {
  const events = []
  s.day += 1
  const generatorOn = countKind(s, 'generator') > 0
  const rangerOn = countKind(s, 'ranger') > 0

  // --- active disaster / campaign timers
  let disasterMult = 1
  if (s.disaster) {
    const key = s.disaster.key
    if (key === 'outage') disasterMult = generatorOn ? 1 : 0.8
    if (key === 'heatwave') disasterMult = 0.85
    s.disaster.days -= 1
    if (s.disaster.days <= 0) {
      events.push({ icon: '🌤️', text: `${DISASTERS[key].name} is over.`, tone: 'good' })
      s.disaster = null
    }
  }
  let adMult = 1
  if (s.ad) {
    adMult = ADS[s.ad.key].mult
    s.ad.days -= 1
    if (s.ad.days <= 0) {
      events.push({ icon: '📣', text: `${ADS[s.ad.key].name} has wrapped up.`, tone: 'info' })
      s.ad = null
    }
  }

  // --- visitors
  const sweet = sweetTicket(s)
  const priceFactor = 2 / (1 + Math.exp((s.ticket - sweet) / 3.5))
  // Diminishing returns on raw star power keeps a packed park from printing money.
  let v = (4 + Math.pow(attractionScore(s), 0.8) * 2.2) * (0.3 + (s.rep / 100) * 1.4)
  v *= adMult * priceFactor * disasterMult
  if (escapees(s).length) v *= 0.35
  v *= 0.9 + Math.random() * 0.2
  const visitors = Math.max(0, Math.min(500, Math.round(v)))
  s.visitors = visitors

  // --- income
  let inc = 0
  const tickets = visitors * s.ticket
  if (tickets) ledger(s, `Tickets — ${visitors} guests`, tickets, 'tickets')
  inc += tickets
  const standsDark = s.disaster?.key === 'outage' && !generatorOn
  const shacks = countKind(s, 'shack')
  if (shacks) {
    let food = shacks * Math.min(visitors, 45) * 2.2
    if (standsDark) food *= 0.5
    food = Math.round(food)
    if (food) ledger(s, `Snack Shack sales${standsDark ? ' (by candlelight)' : ''}`, food, 'food')
    inc += food
  }
  const gifts = countKind(s, 'gift')
  if (gifts) {
    let g = gifts * Math.min(visitors, 70) * 2.6 * Math.min(1.2, s.rep / 70)
    if (standsDark) g *= 0.5
    g = Math.round(g)
    if (g) ledger(s, 'Gift Shop sales', g, 'gifts')
    inc += g
  }

  // --- expenses
  let exp = 0
  const food = s.dinos.reduce((sum, d) => sum + SPECIES[d.sp].food, 0)
  if (food) {
    ledger(s, `Dinosaur feed (${s.dinos.length} dinos)`, -food, 'upkeep')
    exp += food
  }
  const upkeep = s.plots.reduce((sum, p) => sum + (p.kind ? BUILDINGS[p.kind].upkeep : 0), 0)
  if (upkeep) {
    ledger(s, 'Building upkeep', -upkeep, 'upkeep')
    exp += upkeep
  }
  ledger(s, 'Staff wages', -ECON.staffBase, 'staff')
  exp += ECON.staffBase

  // --- dinosaur happiness
  const heat = s.disaster?.key === 'heatwave'
  const outage = s.disaster?.key === 'outage' && !generatorOn
  for (const d of s.dinos) {
    const sp = SPECIES[d.sp]
    const plot = plotById(s, d.plot)
    const herd = dinosIn(s, d.plot)
    let delta = 4 - sp.irr * 0.8
    let aura = 0
    for (const n of neighbors(s, plot)) {
      if (n.kind === 'garden') aura += 2
      if (n.kind === 'fountain') aura += 3
    }
    delta += Math.min(6, aura)
    if (sp.social === 'herd') delta += herd.length >= 2 ? 3 : -2
    else delta += herd.length === 1 ? 2 : -4
    if (visitors > 80) delta -= (visitors / 80) * sp.irr * 0.3
    if (heat && !neighbors(s, plot).some((n) => n.kind === 'fountain')) delta -= 6
    if (outage) delta -= 2
    delta += Math.random() * 4 - 2
    d.hap = Math.max(0, Math.min(100, d.hap + delta))
  }

  // --- escapes
  for (const d of s.dinos) {
    if (d.escaped) {
      d.escDays += 1
      s.rep = Math.max(0, s.rep - 2)
      if (rangerOn && d.escDays >= 2) {
        d.escaped = false
        d.escDays = 0
        ledger(s, `Rangers recaptured ${SPECIES[d.sp].name}`, -100, 'incidents')
        events.push({ icon: '🎯', text: `Rangers wrangled the ${SPECIES[d.sp].name} back home.`, tone: 'good' })
      }
      continue
    }
    const sp = SPECIES[d.sp]
    const diff = sp.fer - fenceStrength(s, plotById(s, d.plot))
    if (diff <= 0) continue
    let p = 0.02 * diff
    if (d.hap < 40) p += ((40 - d.hap) / 40) * 0.1 * diff
    if (rangerOn) p *= 0.5
    if (Math.random() < Math.min(0.35, p)) {
      d.escaped = true
      d.escDays = 0
      s.rep = Math.max(0, s.rep - 8)
      events.push({ icon: '🚨', text: `${sp.icon} A ${sp.name} broke out! Tap it to send the rangers.`, tone: 'bad' })
    }
  }

  // --- reputation drift toward what the park deserves
  const decor = countKind(s, 'garden') + countKind(s, 'fountain')
  const restrooms = countKind(s, 'restroom')
  const species = new Set(s.dinos.map((d) => d.sp)).size
  const avgHap = s.dinos.length ? s.dinos.reduce((a, d) => a + d.hap, 0) / s.dinos.length : 60
  let target = 38 + decor * 2.5 + restrooms * 4 + species * 4 + (avgHap - 60) * 0.2
  if (!restrooms && visitors > 40) target -= 10
  if (visitors > restrooms * 60 + 60) target -= 4
  target = Math.max(5, Math.min(95, target))
  s.rep = Math.max(0, Math.min(100, s.rep + (target - s.rep) * 0.12))

  // --- maybe a fresh disaster rolls in
  if (!s.disaster && s.day > 10 && s.day - s.lastDisaster > 8 && Math.random() < 0.07) {
    const keys = Object.keys(DISASTERS)
    const key = keys[Math.floor(Math.random() * keys.length)]
    s.disaster = { key, days: DISASTERS[key].days }
    s.lastDisaster = s.day
    if (key === 'storm') {
      let wrecked = 0
      for (const p of s.plots) {
        if ((p.kind === 'garden' || p.kind === 'fountain') && Math.random() < 0.25) {
          p.kind = null
          wrecked += 1
        }
      }
      s.rep = Math.max(0, s.rep - 3)
      events.push({
        icon: '⛈️',
        text: wrecked
          ? `Thunderstorm! ${wrecked} decoration${wrecked > 1 ? 's' : ''} blown to bits.`
          : 'Thunderstorm! Guests are staying home today.',
        tone: 'bad',
      })
    } else if (key === 'outage' && generatorOn) {
      events.push({ icon: '🔌', text: 'City power failed — your generator kicked in!', tone: 'good' })
    } else {
      events.push({ icon: DISASTERS[key].icon, text: `${DISASTERS[key].name}! ${DISASTERS[key].desc}`, tone: 'bad' })
    }
  }

  // --- bookkeeping + milestones
  s.history.push({ d: s.day, inc: Math.round(inc), exp: Math.round(exp), bal: Math.round(s.money), vis: visitors, rep: Math.round(s.rep) })
  if (s.history.length > 120) s.history.splice(0, s.history.length - 120)

  for (const [flag, cond, icon, text] of [
    ['m10k', s.money >= 10000, '💰', 'Milestone: $10,000 in the bank!'],
    ['m25k', s.money >= 25000, '💰', 'Milestone: $25,000! The bank sends muffins.'],
    ['m50k', s.money >= 50000, '🏦', 'Milestone: $50,000! Aunt Dolores is repaid.'],
    ['crowd100', s.visitors >= 100, '🎉', '100 guests in one day!'],
  ]) {
    if (cond && !s.flags[flag]) {
      s.flags[flag] = true
      events.push({ icon, text, tone: 'good' })
    }
  }
  if (!s.flags.century && s.rep >= 90 && species >= 5) {
    s.flags.century = true
    events.push({ icon: '🏆', text: 'PARK OF THE CENTURY! Five species, five stars.', tone: 'celebrate' })
  }
  if (s.money < ECON.debtWarningAt && !s.flags.debtWarned) {
    s.flags.debtWarned = true
    events.push({ icon: '🏚️', text: `The bank is calling. Below ${fmtMoney(ECON.bankruptcyAt)} they foreclose!`, tone: 'bad' })
  }
  if (s.money >= 0) s.flags.debtWarned = false
  if (s.money < ECON.bankruptcyAt) {
    s.over = true
    events.push({ icon: '💀', text: 'The bank forecloses the park…', tone: 'bad' })
  }

  save(s)
  return events
}
