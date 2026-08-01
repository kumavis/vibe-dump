import { makeRng, pick, range, chance } from './rng.js'
import { goodById } from './goods.js'
import { MOOD_ICON } from './icons.js'

// ---------------------------------------------------------------------------
// The living part: state machines that walk customers between stalls, stage
// haggles as timed bubble-and-gesture exchanges, let buskers play and get
// tipped — all decisions delegated to economy.js, all visuals delegated to
// anim/bubbles. One market day = 120 wall seconds (FRAMES.md).
// ---------------------------------------------------------------------------

const DAY = 120
const TWO_PI = Math.PI * 2
const wrapAngle = (a) => ((a + Math.PI) % TWO_PI + TWO_PI) % TWO_PI - Math.PI

/** economy utterance → bubble tokens + tone + gesture */
function stageUtterance(ev, goodId) {
  const icon = goodById(goodId).icon
  let tokens
  let tone = 'neutral'
  let gesture = 'talk'
  switch (ev.type) {
    case 'greet':
      tokens = [icon, 'question']
      gesture = 'browse'
      break
    case 'ask':
      tokens = [icon, 'coin', String(ev.price)]
      gesture = 'offer'
      break
    case 'offer':
      tokens = ['coin', String(ev.price), 'question']
      gesture = 'offer'
      break
    case 'counter':
      tokens = ['coin', String(ev.price), 'exclaim']
      gesture = 'talk'
      break
    case 'scoff':
      tokens = ['no', 'exclaim']
      tone = 'bad'
      gesture = 'angry'
      break
    case 'accept':
      tokens = ['yes', 'coin', String(ev.price ?? '')].filter(Boolean)
      tone = 'good'
      gesture = 'agree'
      break
    case 'reject':
      tokens = ['no']
      tone = 'bad'
      gesture = 'refuse'
      break
    case 'walkaway':
      tokens = ['no', MOOD_ICON[ev.mood] || 'annoyed']
      tone = 'bad'
      gesture = 'refuse'
      break
    default:
      tokens = ['question']
  }
  if (ev.mood && ev.mood !== 'neutral' && ev.type !== 'walkaway' && ev.type !== 'scoff') {
    tokens = [...tokens, MOOD_ICON[ev.mood]]
  }
  if (ev.mood === 'angry') gesture = 'angry'
  return { tokens, tone, gesture }
}

/**
 * @param {object} o
 * @param {number} o.seed
 * @param {object} o.world      buildWorld() result
 * @param {object} o.economy    createEconomy() result
 * @param {object} o.bubbles    createBubbles() result
 * @param {Array}  o.actors     [{id, role, char, persona, stall?, buskerSpot?}]
 * @param {(line:string)=>void} o.onTicker
 */
export function createSim({ seed, world, economy, bubbles, actors, onTicker }) {
  const rng = makeRng(seed ^ 0x51a7)
  const byId = new Map(actors.map((a) => [a.id, a]))
  let now = 0
  let visual = true // false during pre-roll fast-forward

  // ---- per-actor sim state ------------------------------------------------
  for (const a of actors) {
    a.pos = { x: 0, z: 0 }
    a.yaw = 0
    a.vel = { x: 0, z: 0 }
    a.speed = 0
    a.state = 'idle'
    a.stateT = 0
    a.until = 0
    a.target = null // {x, z, yaw?, arriveR?}
    a.gesture = 'none'
    a.speakUntil = 0
    a.lookTarget = null // actor to face with the head
    a.session = null
    a.busyWith = null // vendors: current customer
    a.walkSpeed = range(rng, 0.72, 1.05) * (a.role === 'customer' ? 1 : 0.9)
    a.baseYaw = 0

    if (a.role === 'vendor') {
      const s = a.stall.vendorSpot
      a.pos = { x: s.x, z: s.z }
      a.yaw = a.baseYaw = s.yaw
      a.state = 'tend'
      a.until = now + range(rng, 2, 9)
    } else if (a.role === 'busker') {
      const s = a.buskerSpot
      a.pos = { x: s.x, z: s.z }
      a.yaw = a.baseYaw = s.yaw
      a.state = 'busk'
      a.gesture = a.char.appearance.instrument === 'drum' ? 'drum' : 'flute'
      a.until = now + range(rng, 2, 5)
    } else {
      // customers start scattered mid-plaza
      const ang = rng() * TWO_PI
      const r = range(rng, 3, world.bounds.r * 0.55)
      a.pos = { x: Math.sin(ang) * r, z: Math.cos(ang) * r }
      a.yaw = rng() * TWO_PI
      a.state = 'idle'
      a.until = now + range(rng, 0.5, 6)
    }
    a.char.group.position.set(a.pos.x, 0, a.pos.z)
    a.char.group.rotation.y = a.yaw
  }

  const say = (a, tokens, opts) => {
    if (!visual) return
    a.speakUntil = now + Math.min(opts?.ttl ?? 2.4, 1.6)
    bubbles.say(a.char.group, a.char.appearance.height + 0.35, tokens, opts)
  }

  const ticker = (line) => onTicker && onTicker(line)

  /** A wander/watch target inside (or hugging) a collider is unreachable: the
   *  push-out annulus balances the attraction ~0.5 m out, past arriveR, and
   *  the walker jogs in place forever (adversarial review: 3-4 of 16
   *  customers were permanently stuck). Re-roll a few times; callers also get
   *  a walkTo timeout as the backstop for targets this can't save. */
  function clearOfColliders(x, z) {
    for (const c of world.colliders) {
      if (Math.hypot(x - c.x, z - c.z) < c.r + 0.45) return false
    }
    return true
  }
  function pickWanderTarget() {
    for (let tries = 0; tries < 8; tries++) {
      const ang = rng() * TWO_PI
      const r = range(rng, 3, world.bounds.r * 0.6)
      const x = Math.sin(ang) * r
      const z = Math.cos(ang) * r
      if (clearOfColliders(x, z)) return { x, z, arriveR: 0.4 }
    }
    return null // caller stays idle and tries again shortly
  }

  // ---- movement -----------------------------------------------------------
  function steer(a, dt) {
    const t = a.target
    if (!t) {
      a.speed = 0
      return true
    }
    const dx = t.x - a.pos.x
    const dz = t.z - a.pos.z
    const dist = Math.hypot(dx, dz)
    const arriveR = t.arriveR ?? 0.14
    if (dist < arriveR) {
      a.speed = 0
      a.target = null
      if (t.yaw !== undefined) a.baseYaw = t.yaw
      return true
    }
    let vx = dx / dist
    let vz = dz / dist
    // collider avoidance: radial push-out
    for (const c of world.colliders) {
      const cx = a.pos.x - c.x
      const cz = a.pos.z - c.z
      const d = Math.hypot(cx, cz)
      const min = c.r + 0.34
      if (d < min && d > 1e-4) {
        const push = (min - d) / min
        vx += (cx / d) * push * 2.2
        vz += (cz / d) * push * 2.2
      }
    }
    // separation from other walkers
    for (const b of actors) {
      if (b === a || b.role !== 'customer') continue
      const cx = a.pos.x - b.pos.x
      const cz = a.pos.z - b.pos.z
      const d2 = cx * cx + cz * cz
      if (d2 < 0.45 && d2 > 1e-6) {
        const d = Math.sqrt(d2)
        vx += (cx / d) * (0.67 - d) * 1.4
        vz += (cz / d) * (0.67 - d) * 1.4
      }
    }
    const vl = Math.hypot(vx, vz) || 1
    const sp = Math.min(a.walkSpeed, dist * 2.2)
    a.vel.x = (vx / vl) * sp
    a.vel.z = (vz / vl) * sp
    a.pos.x += a.vel.x * dt
    a.pos.z += a.vel.z * dt
    // stay on the plaza
    const pr = Math.hypot(a.pos.x, a.pos.z)
    if (pr > world.bounds.r - 0.5) {
      a.pos.x *= (world.bounds.r - 0.5) / pr
      a.pos.z *= (world.bounds.r - 0.5) / pr
    }
    // hard-project out of colliders: the soft push above only biases direction,
    // and a far-side goal overpowers it — walkers were wading through the
    // fountain (adversarial review). The push still routes; this constrains.
    for (const c of world.colliders) {
      const cx = a.pos.x - c.x
      const cz = a.pos.z - c.z
      const d = Math.hypot(cx, cz)
      if (d < c.r && d > 1e-4) {
        a.pos.x = c.x + (cx / d) * c.r
        a.pos.z = c.z + (cz / d) * c.r
      }
    }
    a.speed = sp
    a.baseYaw = Math.atan2(a.vel.x, a.vel.z)
    return false
  }

  // ---- haggle staging -----------------------------------------------------
  /** @type {Array<{id, buyer, seller, goodId, nextAt, askSeen}>} */
  const sessions = []

  function beginHaggle(customer, vendor, goodId) {
    const id = economy.startHaggle(customer.id, vendor.id, goodId)
    if (!id) return false
    customer.session = vendor.session = id
    customer.state = 'haggle'
    vendor.busyWith = customer
    customer.lookTarget = vendor
    vendor.lookTarget = customer
    sessions.push({
      id,
      buyer: customer,
      seller: vendor,
      goodId,
      nextAt: now + 0.4,
      askSeen: null,
    })
    return true
  }

  function endHaggle(s, dealt) {
    const { buyer, seller } = s
    buyer.session = seller.session = null
    seller.busyWith = null
    buyer.lookTarget = seller.lookTarget = null
    seller.gesture = 'none'
    seller.state = 'tend'
    seller.until = now + range(rng, 1, 4)
    buyer.state = 'leave'
    buyer.until = now + (dealt ? range(rng, 0.8, 1.6) : range(rng, 0.2, 0.8))
    sessions.splice(sessions.indexOf(s), 1)
  }

  function stepSessions() {
    for (let i = sessions.length - 1; i >= 0; i--) {
      const s = sessions[i]
      if (now < s.nextAt) continue
      const ev = economy.stepHaggle(s.id)
      if (!ev) {
        endHaggle(s, false)
        continue
      }
      const speaker = ev.speaker === 'buyer' ? s.buyer : s.seller
      const listener = ev.speaker === 'buyer' ? s.seller : s.buyer
      const staged = stageUtterance(ev, s.goodId)
      if (ev.type === 'ask' && s.askSeen === null) s.askSeen = ev.price
      say(speaker, staged.tokens, { tone: staged.tone })
      speaker.gesture = staged.gesture
      listener.gesture = 'none'
      const patience = speaker === s.buyer ? s.buyer.persona.attrs.patience : s.seller.persona.attrs.patience
      s.nextAt = now + range(rng, 1.15, 1.5) + patience * 0.55

      if (ev.done) {
        const good = goodById(s.goodId)
        if (ev.deal) {
          if (visual) {
            // both sides react; buyer flaunts the purchase
            say(s.seller, ['coin', String(ev.deal.price), 'delighted'], { tone: 'gold' })
            say(s.buyer, [good.icon, 'heart'], { tone: 'good', ttl: 2.0 })
            s.buyer.gesture = 'agree'
            s.seller.gesture = 'agree'
          }
          ticker(
            `${s.buyer.persona.name} bought ${good.name} from ${s.seller.persona.name} for ${ev.deal.price}¢` +
              (s.askSeen && s.askSeen !== ev.deal.price ? ` (asked ${s.askSeen}¢)` : ''),
          )
        } else {
          ticker(
            `${s.buyer.persona.name} and ${s.seller.persona.name} fell out over ${good.name}` +
              (s.askSeen ? ` at ${s.askSeen}¢` : ''),
          )
        }
        endHaggle(s, !!ev.deal)
      }
    }
  }

  // ---- customer/busker/vendor brains -------------------------------------
  function think(a, dt) {
    a.stateT += dt
    switch (a.state) {
      case 'tend': {
        // vendor at rest: look about, hawk wares now and then
        if (now > a.until && !a.busyWith) {
          const goodId = pick(rng, a.stall.goodIds)
          const ask = economy.actorState(a.id).asks?.[goodId]
          a.gesture = 'wave'
          say(a, [goodById(goodId).icon, ...(ask ? ['coin', String(ask)] : ['exclaim'])], { tone: 'neutral' })
          a.until = now + range(rng, 4, 10)
        } else if (a.gesture === 'wave' && now > a.speakUntil) {
          a.gesture = 'none'
        }
        break
      }
      case 'busk': {
        if (now > a.until) {
          say(a, chance(rng, 0.3) ? ['note', 'note'] : ['note'], { tone: 'neutral', ttl: 1.8 })
          a.until = now + range(rng, 2.4, 4.5)
        }
        break
      }
      case 'idle': {
        if (now < a.until) break
        const errand = economy.chooseErrand(a.id)
        if (errand && errand.kind === 'buy') {
          const vendor = byId.get(errand.vendorId)
          const spot = pick(rng, vendor.stall.browseSpots)
          a.target = { ...spot, arriveR: 0.2 }
          a.errand = errand
          a.state = 'walkTo'
          a.stateT = 0
        } else if (errand && errand.kind === 'watch' && actors.some((b) => b.role === 'busker')) {
          const busker = pick(rng, actors.filter((b) => b.role === 'busker'))
          let spot = null
          for (let tries = 0; tries < 6 && !spot; tries++) {
            const ang = busker.buskerSpot.yaw + range(rng, -0.9, 0.9)
            const r = range(rng, 1.5, 2.3)
            const x = busker.buskerSpot.x + Math.sin(ang) * r
            const z = busker.buskerSpot.z + Math.cos(ang) * r
            if (clearOfColliders(x, z)) spot = { x, z, yaw: wrapAngle(ang + Math.PI), arriveR: 0.3 }
          }
          if (!spot) {
            a.until = now + range(rng, 1, 3)
            break
          }
          a.target = spot
          a.errand = { kind: 'watch', buskerId: busker.id }
          a.state = 'walkTo'
          a.stateT = 0
        } else {
          const target = pickWanderTarget()
          if (!target) {
            a.until = now + range(rng, 1, 3)
            break
          }
          a.target = target
          a.errand = null
          a.state = 'walkTo'
          a.stateT = 0
        }
        break
      }
      case 'walkTo': {
        // backstop for unreachable targets: give up rather than jog in place
        if (a.stateT > 30) {
          a.target = null
          a.speed = 0
          a.errand = null
          a.state = 'idle'
          a.until = now + range(rng, 1, 3)
          break
        }
        if (steer(a, dt)) {
          if (a.errand?.kind === 'buy') {
            a.state = 'browse'
            a.gesture = 'browse'
            a.until = now + range(rng, 1.2, 2.6)
            a.lookTarget = byId.get(a.errand.vendorId)
          } else if (a.errand?.kind === 'watch') {
            a.state = 'watch'
            a.until = now + range(rng, 4, 9)
            a.lookTarget = byId.get(a.errand.buskerId)
          } else {
            a.state = 'idle'
            a.until = now + range(rng, 1, 5)
          }
        }
        break
      }
      case 'browse': {
        if (now < a.until) break
        const vendor = byId.get(a.errand.vendorId)
        if (vendor.busyWith) {
          // counter's taken — drift off, try again later
          a.gesture = 'none'
          a.state = 'leave'
          a.until = now + 0.5
          break
        }
        if (!beginHaggle(a, vendor, a.errand.goodId)) {
          if (visual) say(a, ['neutral'], { tone: 'neutral', ttl: 1.4 })
          a.gesture = 'none'
          a.state = 'leave'
          a.until = now + 0.5
        }
        break
      }
      case 'haggle':
        break // driven by stepSessions
      case 'watch': {
        if (chance(rng, dt * 0.5)) a.gesture = a.gesture === 'clap' ? 'none' : 'clap'
        if (now < a.until) break
        const busker = byId.get(a.errand.buskerId)
        const coins = economy.tipBusker(a.id, busker.id)
        if (coins > 0) {
          say(a, ['coin', String(coins)], { tone: 'gold', ttl: 1.6 })
          if (visual) {
            say(busker, ['heart'], { tone: 'good', ttl: 1.6 })
            busker.gesture = 'bow'
            busker.until = now + 1.4
            setTimeoutSim(busker, 1.4)
          }
          ticker(`${a.persona.name} tipped ${busker.persona.name} ${coins}¢`)
        }
        a.gesture = 'none'
        a.lookTarget = null
        a.state = 'idle'
        a.until = now + range(rng, 0.5, 2)
        break
      }
      case 'leave': {
        if (now < a.until) break
        a.gesture = 'none'
        a.lookTarget = null
        a.state = 'idle'
        a.until = now + range(rng, 0.6, 3.5)
        break
      }
    }
  }

  // buskers return to playing after a bow
  const timeouts = []
  function setTimeoutSim(actor, delay) {
    timeouts.push({ at: now + delay, actor })
  }
  function runTimeouts() {
    for (let i = timeouts.length - 1; i >= 0; i--) {
      if (now >= timeouts[i].at) {
        const b = timeouts[i].actor
        if (b.role === 'busker') b.gesture = b.char.appearance.instrument === 'drum' ? 'drum' : 'flute'
        timeouts.splice(i, 1)
      }
    }
  }

  // ---- main update --------------------------------------------------------
  function update(t, dt) {
    now += dt
    economy.tick(dt / DAY)
    stepSessions()
    runTimeouts()

    for (const a of actors) {
      think(a, dt)
      // face partner / spot
      let targetYaw = a.baseYaw
      let lookYaw = 0
      let lookPitch = 0
      if (a.lookTarget) {
        const dx = a.lookTarget.pos.x - a.pos.x
        const dz = a.lookTarget.pos.z - a.pos.z
        const abs = Math.atan2(dx, dz)
        if (a.state === 'haggle' || a.state === 'watch') targetYaw = abs
        lookYaw = wrapAngle(abs - a.yaw)
        if (a.state === 'browse') lookPitch = 0.35
      }
      a.yaw += wrapAngle(targetYaw - a.yaw) * Math.min(1, dt * 6)

      if (visual) {
        a.char.group.position.set(a.pos.x, 0, a.pos.z)
        a.char.group.rotation.y = a.yaw
        a.char.animator.update(t, dt, {
          speed: a.speed,
          gesture: a.gesture,
          speaking: now < a.speakUntil,
          lookYaw,
          lookPitch,
        })
      }
    }

    if (visual) bubbles.update(dt)

    // surface economy-side events (restocks) to the ticker occasionally
    for (const ev of economy.drainEvents()) {
      if (ev.type === 'restock' && chance(rng, 0.5)) {
        const v = byId.get(ev.vendorId)
        if (v) ticker(`${v.persona.name} restocked ${ev.count} ${goodById(ev.goodId).name} (${ev.cost}¢ to the caravan)`)
      }
    }
  }

  /** Fast-forward the market without visuals so first paint is mid-hubbub. */
  function preroll(seconds, liveTail = 5) {
    visual = false
    const dt = 0.2 // coarse is fine: no rendering, haggle timers still resolve
    for (let t = 0; t < seconds - liveTail; t += dt) update(t, dt)
    visual = true // tail runs with bubbles/gestures live, so paint #1 is mid-conversation
    for (let t = seconds - liveTail; t < seconds; t += dt) update(t, dt)
    // settle everyone visually at their fast-forwarded spot
    for (const a of actors) {
      a.char.group.position.set(a.pos.x, 0, a.pos.z)
      a.char.group.rotation.y = a.yaw
    }
  }

  return { update, preroll, actors, get now() { return now } }
}
