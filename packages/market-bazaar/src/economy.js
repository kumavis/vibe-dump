// The bazaar's economy — PURE deterministic logic. No three.js, no DOM, no
// timers, no Date, no Math.random: every random draw flows from src/rng.js
// streams derived from `seed` (see docs/FRAMES.md "Determinism").
//
// Money is integer coins (FRAMES.md "Money & goods"). Wallets only ever move
// by whole coins; fractional accrual (the wage drip) is buffered internally,
// so no coin is ever minted or lost by rounding. The standing invariant:
//
//   sum(wallets) === initialMint + wagesIn - restockOut     — audit(), always
//
// Deals and tips are internal transfers (conserve exactly); the wage drip is
// the only external inflow, the caravan restock cost the only external
// outflow. Time arrives as fractional market DAYS via tick(dtDays); the sim
// converts wall seconds (120 s = 1 day) before calling us.
//
// Vocabulary notes:
// - `attrs.temper` is composure: LOW temper = hot-tempered (scoffs at lowball
//   offers, may end talks early). High temper = unflappable.
// - actorState() returns a fresh cheap snapshot per call — safe to mutate,
//   never live; call again for a fresh view.
// - drainEvents() hands over the accumulated array and resets it. The caller
//   is expected to drain regularly; as a safety net the internal buffer is
//   capped (oldest events dropped past EVENT_CAP) so it can't grow unbounded.
// - stepHaggle()/actorState() throw on unknown ids (a finished session id
//   counts as unknown); cancelHaggle() on an unknown id is a silent no-op.
//
// Two deliberate refinements over the plain "midpoint on crossing" rule
// (both verified by tools/checks/economy.mjs):
// - A buyer whose reservation covers a seller's visibly-pinned floor price
//   accepts it outright ("fine — done") instead of inching forever; without
//   this, floor-pinned sessions — the common case — all died in reject and
//   the market starved.
// - Asks relax toward belief x (1 + 0.25 x greed), not bare belief: greed is
//   a standing markup, which is what makes "greedy sellers earn more" hold
//   for the same demand instead of washing out through walkaway erosion.

import { makeRng, hashU32, hashString, clamp, clamp01, irange } from './rng.js'

const MAX_STEPS = 12 // hard cap: every haggle resolves by its 12th utterance
const HIST_CAP = 20 // per-good deal-price history for medians
const EVENT_CAP = 5000 // safety cap if the caller never drains

/** Approx standard normal from 12 uniform draws (mean 0, sd 1). */
function gauss01(rng) {
  let s = 0
  for (let i = 0; i < 12; i++) s += rng()
  return s - 6
}

function median(arr) {
  const s = arr.slice().sort((a, b) => a - b)
  const m = s.length >> 1
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}

/**
 * @param {object} o
 * @param {number} o.seed
 * @param {object[]} o.goods    entries from src/goods.js
 * @param {Array<{
 *   id: string,
 *   role: 'vendor'|'customer'|'busker',
 *   goodIds?: string[],
 *   attrs: { greed:number, patience:number, charm:number, temper:number },
 *   wealth: number
 * }>} o.actors
 * @returns {Economy}
 */
export function createEconomy({ seed, goods, actors }) {
  const byGood = new Map(goods.map((g) => [g.id, g]))
  const baseSeed = hashU32(seed | 0)

  // ---- state ---------------------------------------------------------------
  const A = new Map() // id -> actor record
  const vendors = []
  const buskers = []
  const sessions = new Map() // sessionId -> haggle session
  const priceHist = new Map() // goodId -> last <= HIST_CAP deal prices
  let events = []
  let sessionSeq = 0
  let day = 0
  let initialMint = 0
  let wagesIn = 0
  let restockOut = 0
  let dealCount = 0
  let walkawayCount = 0
  let volumeCoins = 0
  let tipsCount = 0

  function pushEvent(ev) {
    events.push(ev)
    if (events.length > EVENT_CAP) events.splice(0, events.length - EVENT_CAP)
  }

  // ---- init actors ---------------------------------------------------------
  for (const spec of actors) {
    const arng = makeRng(hashU32(baseSeed ^ hashString(spec.id)))
    const attrs = {
      greed: clamp01(spec.attrs.greed),
      patience: clamp01(spec.attrs.patience),
      charm: clamp01(spec.attrs.charm),
      temper: clamp01(spec.attrs.temper),
    }
    const wealth = clamp01(spec.wealth)
    const a = {
      id: spec.id,
      role: spec.role,
      attrs,
      wealth,
      rng: arng,
      wallet: 0,
      inventory: {},
      beliefs: {}, // goodId -> float coins (exposed rounded)
      deals: 0,
      walkaways: 0,
    }
    // Private price beliefs seeded around baseValue x N(1, 0.25).
    for (const g of goods) {
      const f = Math.max(0.35, 1 + 0.25 * gauss01(arng))
      a.beliefs[g.id] = Math.max(1, g.baseValue * f)
    }
    if (spec.role === 'vendor') {
      const ids = spec.goodIds || []
      if (ids.length < 1) throw new Error(`economy: vendor "${spec.id}" has no goodIds`)
      a.goodIds = ids.slice()
      a.asks = {} // float, exposed rounded; drifts, never teleports
      a.stock = {}
      a.costBasis = {} // per-unit coins last paid to the caravan
      a.sinceSale = {} // days since last sale (aging stock pushes belief down)
      a.restockAcc = {} // day-accumulator toward the next caravan
      a.wallet = 30 + Math.round(wealth * 120)
      for (const gid of ids) {
        const g = byGood.get(gid)
        if (!g) throw new Error(`economy: vendor "${spec.id}" sells unknown good "${gid}"`)
        a.stock[gid] = irange(arng, 3, 6)
        a.costBasis[gid] = Math.max(1, Math.round(g.baseValue * (0.5 + 0.2 * arng())))
        a.asks[gid] = a.beliefs[gid] * (1.1 + 0.45 * attrs.greed) // opening greed markup
        a.sinceSale[gid] = 0
        a.restockAcc[gid] = 0
      }
      vendors.push(a)
    } else {
      a.needs = {} // goodId -> 0..1
      a.needRate = {} // per market day
      for (const g of goods) {
        a.needs[g.id] = 0.35 * arng()
        // cheap staples wanted more often than luxuries
        a.needRate[g.id] = (0.1 + 0.8 * arng()) * Math.sqrt(6 / g.baseValue)
      }
      if (spec.role === 'customer') {
        a.wallet = 15 + Math.round(wealth * 105)
        a.wageRate = 3 + 9 * wealth // coins per market day (external inflow)
      } else {
        a.wallet = 5 + Math.round(wealth * 20)
        a.wageRate = 0 // buskers live off tips
        buskers.push(a)
      }
      a.wageAcc = 0
    }
    A.set(a.id, a)
    initialMint += a.wallet
  }
  for (const g of goods) priceHist.set(g.id, [])

  function getActor(id) {
    const a = A.get(id)
    if (!a) throw new Error(`economy: unknown actor "${id}"`)
    return a
  }

  // Seller's hard floor: never sell below cost + margin, nor far below belief
  // (a greedy seller's floor can sit ABOVE their belief — that's the greed).
  function sellerFloor(v, gid) {
    return Math.max(
      1,
      Math.ceil(v.costBasis[gid] * 1.1),
      Math.round(v.beliefs[gid] * (0.75 + 0.5 * v.attrs.greed)),
    )
  }

  // ---- tick: slow dynamics -------------------------------------------------
  function tick(dtDays) {
    day += dtDays
    for (const a of A.values()) {
      if (a.role === 'vendor') {
        for (const gid of a.goodIds) {
          // asks relax slowly toward belief — marked up by greed, so a greedy
          // vendor's ask anchors persistently above what they think it's worth
          // (drift, never teleport)
          const anchor = a.beliefs[gid] * (1 + 0.25 * a.attrs.greed)
          a.asks[gid] += (anchor - a.asks[gid]) * Math.min(1, 0.6 * dtDays)
          // never let the advertised ask drift below the floor the vendor
          // actually opens with — consumers (UI, hawk bubbles, chooseErrand)
          // read asks as the real price (adversarial review)
          if (a.asks[gid] < sellerFloor(a, gid)) a.asks[gid] = sellerFloor(a, gid)
          a.sinceSale[gid] += dtDays
          // aging unsold stock erodes the vendor's own belief (pushes asks down)
          if (a.sinceSale[gid] > 1.5 && a.stock[gid] > 0) {
            a.beliefs[gid] = Math.max(1, a.beliefs[gid] * (1 - 0.1 * dtDays))
          }
          // sold out -> pay the off-market caravan to restock, if affordable
          if (a.stock[gid] === 0) {
            a.restockAcc[gid] += dtDays
            if (a.restockAcc[gid] >= 0.2) {
              const g = byGood.get(gid)
              const unitCost = Math.max(1, Math.round(g.baseValue * (0.5 + 0.25 * a.rng())))
              let count = irange(a.rng, 2, 5)
              while (count > 0 && a.wallet < unitCost * count) count--
              if (count > 0) {
                const cost = unitCost * count // integer coins out of the world
                a.wallet -= cost
                restockOut += cost
                a.stock[gid] = count
                a.costBasis[gid] = unitCost
                if (a.asks[gid] < sellerFloor(a, gid)) a.asks[gid] = sellerFloor(a, gid) // new cost basis can raise the floor
                a.sinceSale[gid] = 0
                a.restockAcc[gid] = 0
                pushEvent({ type: 'restock', vendorId: a.id, goodId: gid, count, cost })
              } else {
                a.restockAcc[gid] = 0.2 // broke — retry on a later tick
              }
            }
          }
        }
      } else {
        for (const gid in a.needs) {
          const n = a.needs[gid] + a.needRate[gid] * dtDays
          a.needs[gid] = n > 1 ? 1 : n
        }
        if (a.wageRate > 0) {
          // fractional accrual, whole coins credited (external inflow)
          a.wageAcc += a.wageRate * dtDays
          const whole = Math.floor(a.wageAcc)
          if (whole > 0) {
            a.wageAcc -= whole
            a.wallet += whole
            wagesIn += whole
          }
        }
      }
    }
  }

  // ---- errands -------------------------------------------------------------
  function chooseErrand(id) {
    const a = getActor(id)
    if (a.role === 'vendor') return { kind: 'idle' }
    let best = null
    for (const v of vendors) {
      if (v.id === id) continue
      for (const gid of v.goodIds) {
        if (v.stock[gid] <= 0) continue // never point at empty shelves
        const est = 0.5 * (v.asks[gid] + a.beliefs[gid]) // expects to haggle
        if (a.wallet < Math.max(1, Math.round(0.9 * est))) continue // can plausibly pay
        const surplus = a.needs[gid] * a.beliefs[gid] * 1.6 - est
        if (surplus > 0 && (best === null || surplus > best.surplus)) {
          best = { vendorId: v.id, goodId: gid, surplus, urgency: clamp01(a.needs[gid]) }
        }
      }
    }
    if (best) {
      return { kind: 'buy', vendorId: best.vendorId, goodId: best.goodId, urgency: best.urgency }
    }
    const canWatch = buskers.some((bu) => bu.id !== id)
    if (canWatch && a.rng() < 0.25) return { kind: 'watch' }
    return { kind: 'idle' }
  }

  // ---- haggling ------------------------------------------------------------
  function startHaggle(customerId, vendorId, goodId) {
    const b = A.get(customerId)
    const v = A.get(vendorId)
    if (!b || !v || v.role !== 'vendor') return null
    if (customerId === vendorId) return null // a vendor can't haggle themself
    if (!(v.stock[goodId] > 0)) return null // no stock (or not their good)
    const F = sellerFloor(v, goodId)
    const openAsk = Math.max(F, Math.round(v.asks[goodId]))
    // buyer broke relative to any plausible price -> don't even start
    const plausible = Math.max(1, Math.round(0.5 * Math.min(b.beliefs[goodId], openAsk)))
    if (b.wallet < plausible) return null
    const urgency = clamp01(b.needs ? b.needs[goodId] : 0.5)
    // private reservation: belief stretched by urgency, hard-capped by wallet
    const R = Math.min(b.wallet, Math.max(1, Math.round(b.beliefs[goodId] * (1 + 0.6 * urgency))))
    sessionSeq++
    const id = `h${sessionSeq}`
    const srng = makeRng(
      hashU32(baseSeed ^ hashU32(Math.imul(sessionSeq, 0x9e3779b9)) ^ hashString(customerId) ^ hashString(vendorId)),
    )
    sessions.set(id, {
      id,
      buyerId: customerId,
      vendorId,
      goodId,
      srng,
      step: 0,
      F,
      R,
      openAsk,
      lastBuyer: -1,
      lastSeller: -1,
      scoffed: false,
      heldFirm: false,
      buyerCounters: 0,
      maxBuyerCounters: 1 + Math.round(b.attrs.patience * 4),
    })
    return id
  }

  function utter(s, speaker, type, price, mood) {
    return { speaker, type, price, mood, done: false, deal: null }
  }

  // Terminal deal: coins + item transfer happen exactly here.
  function finishDeal(s, speaker, settle) {
    const b = A.get(s.buyerId)
    const v = A.get(s.vendorId)
    const gid = s.goodId
    if (settle > b.wallet || v.stock[gid] <= 0) return finishFail(s, speaker, 'walkaway') // safety
    // moods read the numbers BEFORE beliefs move
    const cr = (s.openAsk - settle) / Math.max(1, s.openAsk - s.F) // seller concession ratio
    let mood
    if (speaker === 'buyer') {
      mood = settle <= 0.7 * s.R ? 'delighted' : settle <= 0.92 * s.R ? 'happy' : 'neutral'
    } else {
      mood =
        settle >= v.beliefs[gid] * 1.08 ? 'delighted' : cr <= 0.45 ? 'happy' : cr <= 0.8 ? 'neutral' : 'annoyed'
    }
    b.wallet -= settle
    v.wallet += settle
    v.stock[gid] -= 1
    b.inventory[gid] = (b.inventory[gid] || 0) + 1
    if (b.needs) b.needs[gid] = 0
    b.deals++
    v.deals++
    dealCount++
    volumeCoins += settle
    v.sinceSale[gid] = 0
    // learning: buyer belief chases the deal; seller belief follows; a sale
    // (quicker / with lower remaining stock = harder) nudges the ask UP
    b.beliefs[gid] += 0.3 * (settle - b.beliefs[gid])
    v.beliefs[gid] += 0.2 * (settle - v.beliefs[gid])
    const left = v.stock[gid]
    const bump = 0.04 + (left === 0 ? 0.1 : left <= 1 ? 0.06 : 0) + (s.step <= 6 ? 0.04 : 0)
    v.asks[gid] *= 1 + bump
    const h = priceHist.get(gid)
    h.push(settle)
    if (h.length > HIST_CAP) h.shift()
    pushEvent({ type: 'deal', buyerId: s.buyerId, sellerId: s.vendorId, goodId: gid, price: settle })
    sessions.delete(s.id)
    return { speaker, type: 'accept', price: settle, mood, done: true, deal: { price: settle, goodId: gid } }
  }

  // Shared learning for every failed ending (walkaway, reject, cancel).
  function recordWalkaway(s) {
    const b = A.get(s.buyerId)
    const v = A.get(s.vendorId)
    const gid = s.goodId
    b.walkaways++
    v.walkaways++
    walkawayCount++
    v.asks[gid] = Math.max(sellerFloor(v, gid), v.asks[gid] * 0.97) // walkaways push asks down, floor holds
    v.beliefs[gid] = Math.max(1, v.beliefs[gid] * 0.985)
    if (s.lastSeller > 0) b.beliefs[gid] += 0.1 * (s.lastSeller - b.beliefs[gid])
    pushEvent({ type: 'walkaway', buyerId: s.buyerId, sellerId: s.vendorId, goodId: gid })
    sessions.delete(s.id)
  }

  function finishFail(s, speaker, type) {
    const who = A.get(speaker === 'buyer' ? s.buyerId : s.vendorId)
    const mood = who.attrs.temper < 0.35 ? 'angry' : 'annoyed'
    recordWalkaway(s)
    return { speaker, type, price: undefined, mood, done: true, deal: null }
  }

  function stepHaggle(sessionId) {
    const s = sessions.get(sessionId)
    if (!s) throw new Error(`economy: unknown or finished haggle session "${sessionId}"`)
    const b = A.get(s.buyerId)
    const v = A.get(s.vendorId)
    const gid = s.goodId
    s.step++
    const step = s.step

    if (step % 2 === 1) {
      // ---- buyer's turn
      if (step === 1) {
        return utter(s, 'buyer', 'greet', undefined, b.attrs.charm > 0.6 ? 'happy' : 'neutral')
      }
      let cand
      const opening = s.lastBuyer < 0
      if (opening) {
        // opening offer below belief, scaled by the buyer's greed
        cand = Math.round(b.beliefs[gid] * (0.9 - 0.35 * b.attrs.greed))
      } else {
        // concession shrinks with own patience, grows with seller's charm
        const frac = clamp(0.15 + 0.4 * (1 - b.attrs.patience) + 0.25 * v.attrs.charm, 0.1, 0.9)
        cand = s.lastBuyer + Math.max(1, Math.round(frac * (s.lastSeller - s.lastBuyer)))
      }
      cand = clamp(cand, 1, s.R)
      if (s.lastSeller >= 0 && cand >= s.lastSeller) {
        // offers crossed: settle at the midpoint, clamped into [floor, reservation]
        return finishDeal(s, 'buyer', clamp(Math.round((cand + s.lastSeller) / 2), s.F, s.R))
      }
      if (s.heldFirm && s.lastSeller >= 0 && s.lastSeller <= s.R) {
        // seller is visibly pinned at their floor and it's within reach:
        // "fine — done." (still a crossing: reservation >= their price)
        return finishDeal(s, 'buyer', s.lastSeller)
      }
      // (no step guard needed here: buyer turns end at step 11, and step 12 —
      // the seller's — is terminal on every path, so <= MAX_STEPS holds)
      if (!opening) {
        if (cand <= s.lastBuyer) return finishFail(s, 'buyer', 'walkaway') // pinned at reservation
        s.buyerCounters++
        if (s.buyerCounters > s.maxBuyerCounters) return finishFail(s, 'buyer', 'walkaway') // patience out
      }
      s.lastBuyer = cand
      const slack = (s.R - cand) / Math.max(1, s.R)
      const mood = slack > 0.35 ? 'happy' : slack > 0.12 ? 'neutral' : 'annoyed'
      return utter(s, 'buyer', opening ? 'offer' : 'counter', cand, mood)
    }

    // ---- seller's turn
    if (v.stock[gid] <= 0) return finishFail(s, 'seller', 'walkaway') // shelf emptied under us
    if (step === 2) {
      s.lastSeller = s.openAsk
      b.beliefs[gid] += 0.08 * (s.openAsk - b.beliefs[gid]) // buyer observes the ask
      return utter(s, 'seller', 'ask', s.openAsk, v.attrs.charm > 0.6 ? 'happy' : 'neutral')
    }
    const offer = s.lastBuyer
    const hotTempered = v.attrs.temper < 0.35 // low temper = short fuse
    const lowball = offer >= 0 && offer < Math.max(1, Math.round(0.55 * s.openAsk))
    if (hotTempered && lowball && !s.scoffed && step < MAX_STEPS) {
      s.scoffed = true
      return utter(s, 'seller', 'scoff', undefined, 'angry')
    }
    if (hotTempered && lowball && s.scoffed && s.srng() < 0.6) {
      return finishFail(s, 'seller', 'walkaway') // stormed off early
    }
    // concession shrinks with own patience and greed, grows with buyer's charm
    const frac = clamp(0.12 + 0.3 * (1 - v.attrs.patience) + 0.3 * b.attrs.charm - 0.25 * v.attrs.greed, 0.06, 0.9)
    let cand = s.lastSeller - Math.max(1, Math.round(frac * (s.lastSeller - Math.max(offer, 0))))
    cand = Math.max(cand, s.F)
    if (offer >= 0 && cand <= offer) {
      return finishDeal(s, 'seller', clamp(Math.round((cand + offer) / 2), s.F, s.R))
    }
    if (step >= MAX_STEPS) return finishFail(s, 'seller', 'reject')
    if (cand >= s.lastSeller) {
      // pinned at the floor with the buyer still below it: hold firm and let
      // the buyer climb or walk (step 12 rejects if neither happens)
      s.heldFirm = true
      return utter(s, 'seller', 'counter', s.lastSeller, 'annoyed')
    }
    s.lastSeller = cand
    const cr = (s.openAsk - cand) / Math.max(1, s.openAsk - s.F)
    const mood = lowball ? 'angry' : cr > 0.75 ? 'annoyed' : cr > 0.4 ? 'neutral' : 'happy'
    return utter(s, 'seller', 'counter', cand, mood)
  }

  function cancelHaggle(sessionId) {
    const s = sessions.get(sessionId)
    if (!s) return // forgiving no-op
    recordWalkaway(s) // buyer wandering off teaches the vendor the same lesson
  }

  // ---- tips ----------------------------------------------------------------
  function tipBusker(fromId, buskerId) {
    const t = A.get(fromId)
    const bu = A.get(buskerId)
    if (!t || !bu || bu.role !== 'busker' || fromId === buskerId) return 0
    if (t.wallet <= 0) return 0
    const gen = 0.5 * (t.wealth + t.attrs.charm) + 0.6 * bu.attrs.charm
    let coins = 1 + Math.floor(t.rng() * (1 + 2.5 * gen))
    coins = Math.min(coins, t.wallet)
    t.wallet -= coins // internal transfer: conserves exactly
    bu.wallet += coins
    tipsCount++
    pushEvent({ type: 'tip', fromId, buskerId, coins })
    return coins
  }

  // ---- views ---------------------------------------------------------------
  function actorState(id) {
    const a = getActor(id)
    const beliefs = {}
    for (const gid in a.beliefs) beliefs[gid] = Math.max(1, Math.round(a.beliefs[gid]))
    const st = {
      role: a.role,
      wallet: a.wallet,
      inventory: { ...a.inventory },
      beliefs,
      deals: a.deals,
      walkaways: a.walkaways,
    }
    if (a.role === 'vendor') {
      st.stock = { ...a.stock }
      st.asks = {}
      for (const gid of a.goodIds) st.asks[gid] = Math.max(1, Math.round(a.asks[gid]))
    } else {
      st.needs = { ...a.needs }
    }
    return st
  }

  function stats() {
    let moneySupply = 0
    for (const a of A.values()) moneySupply += a.wallet
    const medianPrice = {}
    for (const g of goods) {
      const h = priceHist.get(g.id)
      medianPrice[g.id] = h.length ? median(h) : null
    }
    return {
      day,
      moneySupply,
      dealCount,
      walkawayCount,
      volumeCoins,
      wagesIn,
      restockOut,
      tipsCount,
      medianPrice,
    }
  }

  function drainEvents() {
    const out = events
    events = []
    return out
  }

  function audit() {
    let sumWallets = 0
    for (const a of A.values()) sumWallets += a.wallet
    const expected = initialMint + wagesIn - restockOut
    const drift = sumWallets - expected
    return { ok: drift === 0, sumWallets, expected, drift }
  }

  return {
    tick,
    chooseErrand,
    startHaggle,
    stepHaggle,
    cancelHaggle,
    tipBusker,
    actorState,
    stats,
    drainEvents,
    audit,
  }
}
