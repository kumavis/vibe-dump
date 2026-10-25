import { clamp, wrapAngle, yawTo } from '../core/mathx.js'
import { OBLIVIOUS } from './perception.js'

// Up on something — a roof, a tower, a crate, a deck, a hovering helicopter —
// where height, walls or stilts may keep a hunter off.
const aloft = (G, p) => p.y - G.island.heightAt(p.x, p.z) > 0.5

// How a motion hunter searches where it lost the player (Brain.search): it
// pulls up `pullUp` m past its flank short of the spot, casts `cast` m out
// from it at `spread` radians either side of the way it came in, lingers
// `linger` s once there and moves on `leave` m back the way it came.
export const SEARCH = { pullUp: 1.6, cast: [5, 7], spread: [0.35, 0.8], linger: [14, 22], leave: [18, 26] }

// Behaviour as a small state machine. `think()` runs a few times a second and
// picks the state from what the animal perceives (awareness, threats, hunger,
// herd alarms, flares) filtered through its temperament. Each state's per-frame
// method then drives movement and the animator's intents.
//
// States: graze, alert, investigate, flee, threaten, charge, hunt, attack,
//         spit, feed, groggy, down, dead
//
// Every blow first asks whether it can reach (Creature.reachesTarget,
// actors/reach.js). A hunter whose quarry is up out of its reach — a roof, a
// tower — lays siege instead (hunt -> besiege), and past its patience lies in
// wait nearby (investigate with `wait`) until they are back within reach.
//
// A motion hunter that has lost the player (Perception.lost: they froze, or
// got out of its sight) does not close on where they are: it goes to where
// it last had them and searches there (investigate with `search`) — sniffing,
// turning, casting about — until it sees them move again, noses them out, or
// loses interest. One that went up out of its reach it besieges all the same:
// it saw where they went.

export class Brain {
  constructor(creature, rng) {
    this.c = creature
    this.rng = rng
    this.state = 'graze'
    this.t = 0
    this.data = {}
    this.thinkTimer = rng.range(0, 0.3)
    this.cool = rng.range(0, 1)
    this.spitCool = rng.range(2, 5)
    this.anger = 0
    this.roarCool = rng.range(2, 6)
    this.idleTimer = rng.range(2, 8)
    this.alarmSeen = -1 // the herd alarm a bold herd last scattered for
    // a quarry out of reach: seconds spent besieging it, how often it has
    // given up (each time it gives up sooner and waits longer), and until
    // when it waits the player out rather than pressing — and where they
    // were when it gave up
    this.balk = 0
    this.balks = 0
    this.patience = rng.range(16, 26)
    this.sulk = -1
    this.sulkAt = null
  }

  set(state, data = {}) {
    if (state === this.state && !data.force) return
    this.state = state
    this.t = 0
    this.data = data
  }

  update(dt, G) {
    const c = this.c
    this.t += dt
    this.cool -= dt
    this.spitCool -= dt
    this.roarCool -= dt
    this.anger = Math.max(0, this.anger - dt * 0.03)
    const v = c.vitals
    if (!v.alive) {
      if (this.state !== 'dead') this.set('dead')
    } else if (v.state === 'unconscious') {
      if (this.state !== 'down') this.set('down')
    } else if (this.state === 'down') {
      this.set('groggy')
    }
    if (this.state !== 'dead' && this.state !== 'down') {
      this.thinkTimer -= dt
      if (this.thinkTimer <= 0) {
        this.thinkTimer = 0.25
        this.think(G)
      }
    }
    const I = c.intent
    I.graze = I.alert = I.roar = I.attack = I.crouch = I.eat = I.sniff = 0
    I.look = null
    this[this.state](dt, G)
  }

  // ------------------------------------------------------------ decisions
  think(G) {
    const c = this.c
    const sp = c.sp
    const P = c.perception
    const s = this.state
    const temper = sp.temperament
    const busy = s === 'attack' || s === 'charge' || s === 'spit'
    if (s === 'groggy' && this.t < 4) return

    // flares terrify everything
    const flare = G.hazards?.nearestFlare(c.pos.x, c.pos.z)
    if (flare && flare.d < flare.fear) {
      if (s !== 'flee' || this.data.from !== flare) this.set('flee', { from: flare, time: 5, fast: true })
      return
    }
    if (busy) return

    // predators nearby
    if (P.threat && temper !== 'aggressive') {
      if (temper === 'defensive' && sp.mass > P.threat.sp.mass * 0.4) {
        if (s !== 'threaten') this.set('threaten', { target: P.threat })
      } else {
        this.fleeFrom(P.threat.pos, 7)
        this.alarmHerd(G, P.threat.pos)
      }
      return
    }
    // herd alarm
    const h = c.herd
    // a habituated herd (data/encounters.js `bold`), unless a gun just went off
    const bold = h?.bold && G.time - G.stealth.lastLoud > 4 ? h.bold : null
    if (h && h.alarm && G.time - h.alarm.t < 4 && temper === 'skittish' && s !== 'flee') {
      if (!bold) {
        this.fleeFrom(h.alarm, 6 + this.rng.next() * 3)
        return
      }
      // the gang scatters with whoever called, once per call
      if (this.alarmSeen !== h.alarm.t) {
        this.alarmSeen = h.alarm.t
        this.fleeFrom(h.alarm, bold.scatter, true)
        return
      }
    }

    // searching for a player it lost, it sees them move (or noses them out):
    // no more doubt about it
    if (s === 'investigate' && this.data.search && !this.lostPlayer(G)) P.awareness = Math.max(P.awareness, 1)
    const aw = P.awareness
    const player = G.vehicle ? G.vehicle.pos : G.player.pos
    const dPlayer = Math.hypot(player.x - c.pos.x, player.z - c.pos.z)

    // a player it has given up besieging is waited out from cover — until
    // they come back within reach, or shoot it (onHurt)
    if (temper === 'aggressive' && aw >= OBLIVIOUS && this.sulking(G)) {
      if (s !== 'investigate' || !this.data.wait) this.lieInWait(G, player)
      return
    }

    if (aw >= 1) {
      if (temper === 'skittish') {
        if (bold) return this.boldReact(G, player, bold)
        if (s !== 'flee') {
          this.fleeFrom(player, 7 + this.rng.next() * 4)
          this.alarmHerd(G, player)
          c.vocalize('alarm')
        }
        return
      }
      if (temper === 'aggressive') {
        if (c.vitals.rec.health < sp.health * 0.25 && sp.id !== 'tyrannosaurus') {
          if (s !== 'flee') this.fleeFrom(player, 10)
          return
        }
        if (this.lostPlayer(G)) return this.searchFor(G)
        if (s !== 'hunt' || this.data.target !== 'player') {
          this.set('hunt', { target: 'player' })
          c.vocalize('roar')
          this.alertPack(G)
        }
        return
      }
      if (temper === 'defensive') {
        const space = sp.personalSpace || 12
        if (this.anger > 0.7 && dPlayer < space * 2.5 && c.canGetAt(G)) {
          if (s !== 'charge') this.set('charge', { target: 'player' })
          return
        }
        if (c.vitals.rec.health < sp.health * 0.35) {
          if (s !== 'flee') this.fleeFrom(player, 8)
          return
        }
        if (dPlayer < space * 1.6 && !this.sulking(G)) {
          if (s !== 'threaten') this.set('threaten', { target: 'player' })
        } else if (s !== 'alert' && s !== 'threaten') this.set('alert')
        if (s === 'threaten' && dPlayer > space * 2.2 && this.t > 3) this.set('alert')
        return
      }
      // passive: keep an eye on you, move off if you get under its feet
      if (dPlayer < c.radius * 3 && s !== 'flee') this.fleeFrom(player, 5, true)
      else if (s === 'graze' && this.rng.next() < 0.05) this.set('alert')
      return
    }

    if (aw >= 0.35 && P.lastKnown) {
      if (temper === 'skittish' && aw > 0.7) {
        if (bold) return this.boldReact(G, P.lastKnown, bold)
        if (s !== 'flee') {
          this.fleeFrom(P.lastKnown, 5)
          this.alarmHerd(G, P.lastKnown)
        }
        return
      }
      if (temper === 'aggressive' || (temper === 'defensive' && aw > 0.6)) {
        if (s === 'investigate' && this.data.search) return this.searchFor(G)
        // lying in wait for someone now back within reach: go and look
        if ((s !== 'investigate' && s !== 'hunt') || (this.data.wait && c.canGetAt(G))) this.set('investigate', { at: { ...P.lastKnown } })
        else if (s === 'investigate' && !this.data.wait) this.data.at = { ...P.lastKnown }
        return
      }
      if (temper !== 'passive' && s !== 'alert' && s !== 'flee') this.set('alert')
      return
    }

    // hunger: predators go after prey species
    if (sp.prey && c.rec.hunger > 0.55 && P.prey && s !== 'hunt' && s !== 'feed') {
      this.set('hunt', { target: P.prey })
      return
    }

    if (s === 'alert' && this.t > 4) this.set('graze')
    if (s === 'flee' && this.t > (this.data.time || 6)) this.set('alert')
    if (s === 'groggy') this.set('graze')
    if (s === 'threaten' && (this.data.target === 'player' ? aw < 0.6 : !P.threat) && this.t > 3) this.set('alert')
    if (s === 'hunt' && this.data.target === 'player' && aw < 0.6) this.set('investigate', { at: P.lastKnown ? { ...P.lastKnown } : { ...c.pos } })
  }

  fleeFrom(from, time, slow = false) {
    this.set('flee', { from: { x: from.x, z: from.z }, time, slow, force: true })
  }

  // A habituated herd keeps an eye on a person beyond `tolerate` metres (half
  // that if they come crouched), trots a few metres off (calling) inside it,
  // and darts if they keep coming, so it stays in view instead of vanishing
  // over the next rise.
  boldReact(G, from, bold) {
    const c = this.c
    const s = this.state
    const d = Math.hypot(from.x - c.pos.x, from.z - c.pos.z)
    const tolerate = bold.tolerate * (!G.vehicle && G.player.crouching ? 0.5 : 1)
    if (d < tolerate) {
      const dart = d < tolerate * 0.6
      if (s !== 'flee' || this.t > this.data.time || (dart && this.data.slow)) {
        this.fleeFrom(from, dart ? bold.scatter * 0.6 : bold.scatter, !dart)
        this.alarmHerd(G, from)
        c.vocalize('alarm')
      }
    } else if (s === 'flee') {
      if (this.t > this.data.time) this.set('alert')
    } else if (s === 'alert') {
      if (this.t > 3) this.set('graze')
    } else if (this.rng.next() < 0.04) this.set('alert') // look up now and then
  }

  alarmHerd(G, pos) {
    const h = this.c.herd
    if (h) h.alarm = { x: pos.x, z: pos.z, t: G.time }
  }

  alertPack(G) {
    const c = this.c
    if (!c.sp.pack || !c.herd) return
    for (const m of c.herd.loaded) {
      if (m === c || !m.vitals.conscious) continue
      m.perception.alertTo(c.perception.lastKnown || G.player.pos, 1.05)
    }
  }

  // Waiting out a player it gave up besieging: while they stay out of its
  // reach (Creature.canGetAt) — not merely up on something, as a crate or a
  // desk is no height at all — or stay put where the walls held it off.
  // Back within reach, or right there within a strike, it comes on again.
  sulking(G) {
    if (G.time >= this.sulk) return false
    const c = this.c
    if (!c.canGetAt(G)) return true
    const p = G.vehicle ? G.vehicle.pos : G.player.pos
    const at = this.sulkAt
    const put = Math.hypot(p.x - at.x, p.z - at.z) < 2 && Math.abs(p.y - at.y) < 0.4
    const strike = Math.hypot(p.x - c.pos.x, p.z - c.pos.z) < (c.sp.attack?.range ?? 2) + c.radius + 0.4 && c.reachesTarget(G)
    return put && !strike
  }

  // Out of patience under a quarry it cannot reach: give up — sooner each
  // time — and, for the player, wait them out (think() keeps it waiting
  // while they stay up there; longer each time).
  giveUp(G, from) {
    this.balk = 0
    this.balks++
    this.patience = Math.max(8, this.rng.range(16, 26) * Math.pow(0.7, this.balks))
    this.sulk = G.time + this.rng.range(45, 75) * (1 + this.balks * 0.5)
    const p = G.vehicle ? G.vehicle.pos : G.player.pos
    this.sulkAt = { x: p.x, y: p.y, z: p.z }
    if (this.c.sp.temperament === 'aggressive') this.lieInWait(G, from)
    else this.set('alert')
  }

  // Back off into the best cover 16-26 m from them, on its own side, and
  // watch from there (investigate with `wait`).
  lieInWait(G, from) {
    const c = this.c
    const isl = G.island
    const away = Math.atan2(c.pos.z - from.z, c.pos.x - from.x)
    let best = null
    for (let i = -3; i <= 3; i++) {
      const a = away + i * 0.45
      const r = this.rng.range(16, 26)
      const x = from.x + Math.cos(a) * r
      const z = from.z + Math.sin(a) * r
      if (isl.depthAt(x, z) > c.sp.body.hipH * c.scale * 0.7) continue
      const score = isl.coverAt(x, z) + this.rng.next() * 0.15
      if (!best || score > best.score) best = { x, z, score }
    }
    this.set('investigate', { at: best ? { x: best.x, z: best.z } : { x: c.pos.x, z: c.pos.z }, wait: this.rng.range(25, 40) })
  }

  // Has a motion hunter lost a player it could get at (one up a tower it
  // besieges whether it can see them or not)?
  lostPlayer(G) {
    return this.c.perception.lost(G) && this.c.canGetAt(G)
  }

  // A motion hunter that has lost the player searches where it last had
  // them; once searching, whatever its ears or nose tell it drags the search
  // over (a stone's clatter, the next footstep), its nose's rough guesses
  // averaging out on where they stand.
  searchFor(G) {
    const lk = this.c.perception.lastKnown || this.c.pos
    if (this.state !== 'investigate' || !this.data.search) {
      this.set('investigate', { at: { x: lk.x, z: lk.z }, search: true })
      G.events.emit('creature:lost', { creature: this.c })
      return
    }
    const at = this.data.at
    const far = Math.hypot(lk.x - at.x, lk.z - at.z) > 12
    const k = far ? 1 : 0.3
    at.x += (lk.x - at.x) * k
    at.z += (lk.z - at.z) * k
    // somewhere new to search: it takes its time over it
    if (far) this.data.arrived = this.data.linger = null
  }

  // Something hurt it. Called by the creature when a dart or bullet lands.
  onHurt(G, from, lethal) {
    const c = this.c
    const t = c.sp.temperament
    c.perception.alertTo(from, 1.3)
    this.anger += lethal ? 0.9 : 0.5
    this.sulk = -1 // shot at from up there: it comes back to the foot of the climb
    if (t === 'skittish') {
      this.fleeFrom(from, 9)
      this.alarmHerd(G, from)
      c.vocalize('alarm')
    } else if (t === 'defensive') {
      if (c.vitals.rec.health < c.sp.health * 0.35) this.fleeFrom(from, 10)
      else {
        this.set('charge', { target: 'player' })
        c.vocalize('roar')
        // the rest of the herd takes offence too
        if (c.herd) for (const m of c.herd.loaded) if (m !== c && m.vitals.conscious) m.perception.alertTo(from, 1.05)
      }
    } else if (t === 'aggressive') {
      this.set('hunt', { target: 'player', force: true })
      this.alertPack(G)
    } else {
      this.fleeFrom(from, 6, true)
    }
  }

  // ------------------------------------------------------------ states
  graze(dt, G) {
    const c = this.c
    const L = this.data.leave
    // moving on from somewhere it gave up on (a search) before it settles
    if (L && this.t < 15 && Math.hypot(L.x - c.pos.x, L.z - c.pos.z) > 2) return c.goTo(L.x, L.z, c.sp.speed.walk)
    const h = c.herd
    const goal = h ? { x: h.goal.x + c.rec.offset.dx * c.radius * 3, z: h.goal.z + c.rec.offset.dz * c.radius * 3 } : c.pos
    const d = Math.hypot(goal.x - c.pos.x, goal.z - c.pos.z)
    if (d > 7) {
      c.goTo(goal.x, goal.z, c.sp.speed.walk * (d > 30 ? 1.3 : 1))
    } else {
      this.idleTimer -= dt
      if (this.idleTimer < 0) {
        this.idleTimer = this.rng.range(4, 12)
        this.data.wander = { x: c.pos.x + this.rng.range(-8, 8), z: c.pos.z + this.rng.range(-8, 8), until: this.t + this.rng.range(2, 5) }
      }
      if (this.data.wander && this.t < this.data.wander.until) c.goTo(this.data.wander.x, this.data.wander.z, c.sp.speed.walk * 0.6)
      else {
        c.halt()
        c.intent.graze = c.sp.temperament === 'aggressive' ? 0.25 : Math.sin(this.t * 0.25 + c.rec.seed) > -0.3 ? 1 : 0
        c.intent.eat = c.intent.graze
      }
    }
    if (c.sp.prey) c.rec.hunger = Math.min(1, (c.rec.hunger || 0) + dt / 500)
  }

  alert(dt, G) {
    const c = this.c
    c.halt()
    const lk = c.perception.lastKnown
    if (lk) {
      c.face(lk.x, lk.z)
      c.intent.look = lk
    }
    c.intent.alert = 1
  }

  investigate(dt, G) {
    const c = this.c
    const at = this.data.at
    if (!at) return this.set('graze')
    if (this.data.search) return this.search(dt, G, at)
    const d = Math.hypot(at.x - c.pos.x, at.z - c.pos.z)
    const stalker = c.sp.temperament === 'aggressive'
    if (d > 3 && this.t < (this.data.wait ? 45 : 25)) {
      c.goTo(at.x, at.z, c.sp.speed.walk * (stalker ? 0.9 : 0.8))
      c.intent.crouch = stalker ? 0.8 : 0
      c.intent.look = at
    } else if (this.data.wait) {
      // lying in wait: low in the cover, eyes on where it last saw you
      c.halt()
      c.intent.crouch = 1
      const lk = c.perception.lastKnown
      if (lk) {
        c.face(lk.x, lk.z)
        c.intent.look = lk
      }
      if (this.t - (this.data.arrived ??= this.t) > this.data.wait) {
        c.perception.awareness = Math.min(c.perception.awareness, 0.3)
        this.set('graze')
      }
    } else {
      c.halt()
      c.intent.alert = 1
      c.intent.look = { x: c.pos.x + Math.sin(this.t) * 10, z: c.pos.z + Math.cos(this.t * 0.7) * 10, y: c.pos.y }
      if (this.t > 30 || (d <= 3 && (this.data.arrived = this.data.arrived ?? this.t) + 5 < this.t)) {
        c.perception.awareness = Math.min(c.perception.awareness, 0.3)
        this.set('graze')
      }
    }
  }

  // Searching for a player it lost (searchFor). To the spot — quick from far
  // off, stalking the last stretch — and pulls up short of it: whoever froze
  // there is usually still standing in it, under its head. Then nose down:
  // sniffs, turns, and casts to and fro across the way it came in, a few
  // metres out — never through the spot, nor round to its far side — until
  // it loses interest and moves on back the way it came.
  search(dt, G, at) {
    const c = this.c
    const sp = c.sp
    const D = this.data
    const P = c.perception
    const d = Math.hypot(at.x - c.pos.x, at.z - c.pos.z)
    // it is looking for someone all the while (no unaware bonus here), the
    // keener the fresher the loss
    P.awareness = Math.max(P.awareness, 0.4)
    // a sound — a footstep, a stone — and it whips round to it, head up:
    // move again now and it has you
    if (G.time - P.heardT < 1.5 && P.lastKnown) {
      c.halt()
      c.face(P.lastKnown.x, P.lastKnown.z)
      c.intent.look = P.lastKnown
      c.intent.alert = 1
      return
    }
    const short = c.radius + SEARCH.pullUp
    // a lead that dragged the spot off elsewhere: go there first
    if (D.cast && d > 9) D.cast = null
    if (!D.cast) {
      if (d > short + 0.3 && this.t < 30) {
        c.goTo(at.x, at.z, clamp((d - short) * 0.7, sp.speed.walk * 0.8, sp.speed.run * 0.6))
        c.intent.crouch = 0.5
        c.intent.sniff = d < 12 ? 0.5 : 0
        c.intent.look = at
        return
      }
      D.arrived ??= this.t
      D.linger ??= this.rng.range(...SEARCH.linger)
      D.side ??= this.rng.sign()
      D.from = Math.atan2(c.pos.z - at.z, c.pos.x - at.x)
      D.cast = { x: c.pos.x, z: c.pos.z }
    }
    if (this.t - D.arrived > D.linger || this.t > 50) {
      P.awareness = Math.min(P.awareness, 0.3)
      const r = this.rng.range(...SEARCH.leave)
      return this.set('graze', { leave: { x: at.x + Math.cos(D.from) * r, z: at.z + Math.sin(D.from) * r } })
    }
    const k = D.cast
    c.intent.sniff = 1
    if (k.until == null && Math.hypot(k.x - c.pos.x, k.z - c.pos.z) > 1.2) {
      c.goTo(k.x, k.z, sp.speed.walk * 0.6)
      c.intent.look = { x: k.x, y: c.pos.y, z: k.z }
      return
    }
    if (k.until == null) {
      // there: sniff a while, facing back over the spot
      k.until = this.t + this.rng.range(1.8, 3)
      k.face = Math.atan2(at.z - c.pos.z, at.x - c.pos.x) + this.rng.range(-0.5, 0.5)
    }
    if (this.t < k.until) {
      // nose down where it stands, turning its head over the ground about it
      c.halt()
      const a = k.face + Math.sin((this.t - k.until) * 0.9) * 0.8
      const lx = c.pos.x + Math.cos(a) * 4
      const lz = c.pos.z + Math.sin(a) * 4
      c.face(lx, lz)
      c.intent.look = { x: lx, y: c.pos.y, z: lz }
      if (this.rng.next() < dt * 0.8) c.vocalize('sniff')
      return
    }
    // on to the next cast, over to the other side of the line it came in on
    D.side = -D.side
    const a = D.from + D.side * this.rng.range(...SEARCH.spread)
    const r = this.rng.range(...SEARCH.cast)
    D.cast = { x: at.x + Math.cos(a) * r, z: at.z + Math.sin(a) * r }
  }

  flee(dt, G) {
    const c = this.c
    const f = this.data.from
    let ax = c.pos.x - f.x
    let az = c.pos.z - f.z
    const l = Math.hypot(ax, az) || 1
    ax /= l
    az /= l
    // herds bolt roughly together: bias toward the herd's centre line
    c.goTo(c.pos.x + ax * 30, c.pos.z + az * 30, this.data.slow ? c.sp.speed.walk * 1.5 : c.sp.speed.run)
    if (this.t > (this.data.time || 6) + 4) this.set('alert')
  }

  threaten(dt, G) {
    const c = this.c
    const tgt = this.data.target === 'player' ? G.player.pos : this.data.target?.pos
    if (!tgt) return this.set('alert')
    const d = Math.hypot(tgt.x - c.pos.x, tgt.z - c.pos.z)
    c.halt()
    const sp = c.sp
    const behind = Math.abs(wrapAngle(yawTo(c.pos.x, c.pos.z, tgt.x, tgt.z) - c.yaw)) > 1.6
    const tObj = this.data.target === 'player' ? null : this.data.target
    // tail fighters swing at what is behind them; everyone else turns to face it
    if (sp.attack?.kind === 'tail' && behind && d < sp.attack.range + c.radius && this.cool <= 0 && c.reachesTarget(G, tObj)) {
      return this.set('attack', { target: this.data.target })
    }
    c.face(tgt.x, tgt.z)
    c.intent.look = tgt
    c.intent.alert = 1
    if (this.roarCool <= 0) {
      this.roarCool = this.rng.range(2.5, 4.5)
      c.vocalize('threat')
    }
    c.intent.roar = c.roaring
    if (!c.canGetAt(G, tObj)) {
      // up out of its reach: a display is all it has, and it tires of that
      this.balk += dt
      if (this.balk > this.patience) this.giveUp(G, tgt)
      return
    }
    const space = sp.personalSpace || 12
    if (this.data.target === 'player' && d < space * 0.6 && this.t > 1.2) {
      this.anger += 0.3
      this.set('charge', { target: 'player' })
    }
    if (this.data.target !== 'player' && d < space * 0.5 && this.t > 1.5) this.set('charge', { target: this.data.target })
  }

  charge(dt, G) {
    const c = this.c
    const sp = c.sp
    const tgtObj = this.data.target === 'player' ? null : this.data.target
    const tgt = tgtObj ? tgtObj.pos : G.player.pos
    if (!this.data.dir) {
      const yaw = yawTo(c.pos.x, c.pos.z, tgt.x, tgt.z)
      this.data.dir = yaw
      c.vocalize('roar')
    }
    // track loosely — you can sidestep a charge
    const want = yawTo(c.pos.x, c.pos.z, tgt.x, tgt.z)
    if (this.t < 1.4) this.data.dir += clamp(wrapAngle(want - this.data.dir), -0.9 * dt, 0.9 * dt)
    const dir = this.data.dir
    c.goTo(c.pos.x - Math.sin(dir) * 20, c.pos.z - Math.cos(dir) * 20, sp.speed.run * 1.05)
    c.intent.attack = 0.4
    const d = Math.hypot(tgt.x - c.pos.x, tgt.z - c.pos.z)
    const reach = c.radius + (sp.attack ? sp.attack.range * 0.5 : 1)
    if (!this.data.hit && d < reach && c.reachesTarget(G, tgtObj)) {
      this.data.hit = true
      if (tgtObj) tgtObj.takeHit(G, { damage: (sp.attack?.damage || 30) * 2, zone: 'torso', from: c.pos, cause: 'predation' })
      else c.strikePlayer(G, sp.attack?.damage || 30, 9)
    }
    if (this.t > 4.5 || (this.data.hit && this.t > 1.2) || (c.speed < 0.5 && this.t > 1.5)) {
      this.anger = Math.max(0, this.anger - 0.5)
      this.set(tgtObj ? 'threaten' : 'alert', { target: this.data.target })
    }
  }

  hunt(dt, G) {
    const c = this.c
    const sp = c.sp
    const P = c.perception
    const targetPlayer = this.data.target === 'player'
    const tObj = targetPlayer ? null : this.data.target
    if (tObj && (!tObj.vitals || tObj.disposed)) return this.set('graze')
    if (tObj && !tObj.vitals.alive) return this.set('feed', { carcass: tObj })
    let tgt
    if (targetPlayer) {
      if (!G.player.alive) return this.set('graze')
      // a motion hunter goes for no one it has lost: it searches instead
      if (this.lostPlayer(G)) return this.searchFor(G)
      tgt = P.sees || G.time - P.lastSeen < 2 ? G.player.pos : P.lastKnown || G.player.pos
    } else tgt = tObj.pos
    const dx = tgt.x - c.pos.x
    const dz = tgt.z - c.pos.z
    const d = Math.hypot(dx, dz)
    // flares: hold the line at the edge of the light
    const flare = G.hazards?.nearestFlareTo(tgt.x, tgt.z)
    if (flare && Math.hypot(flare.x - tgt.x, flare.z - tgt.z) < flare.fear * 0.8 && d < flare.fear + 6) {
      c.halt()
      c.face(tgt.x, tgt.z)
      c.intent.look = tgt
      if (this.roarCool <= 0) {
        this.roarCool = 3
        c.vocalize('threat')
      }
      c.intent.roar = c.roaring
      return
    }
    if (sp.attack?.spit && targetPlayer && P.sees && d < sp.attack.spit.range && d > 5 && this.spitCool <= 0) {
      return this.set('spit')
    }
    const range = sp.attack ? sp.attack.range : 2
    const close = d < range + c.radius + 0.4
    const inReach = c.reachesTarget(G, tObj)
    // Quarry up on something may be out of its reach, or walls may hold it
    // off short of striking range. Then it lays siege rather than stand below
    // biting air — once it has come as close as it can, been held off a
    // moment, or got near enough to see nothing will get it up there — and
    // keeps at it until a blow would land, or they come down.
    const D = this.data
    const up = aloft(G, targetPlayer ? (G.vehicle ? G.vehicle.pos : G.player.pos) : tObj.pos)
    // held off: pressing in, but no nearer for a couple of seconds
    if (D.near == null || d < D.near - 0.3) {
      D.near = d
      D.nearT = this.t
    }
    const held = !close && d < range + c.radius + 4 && this.t - D.nearT > 2
    if (up && !(close && inReach) && (D.siege || close || held || (d < range + c.radius + 5.5 && !c.canGetAt(G, tObj)))) {
      return this.besiege(dt, G, tgt, targetPlayer)
    }
    // pack members fan out around the target until close
    let gx = tgt.x
    let gz = tgt.z
    if (sp.pack && c.herd && d > 9) {
      const idx = c.herd.loaded.indexOf(c)
      const n = Math.max(1, c.herd.loaded.length)
      const ang = (idx / n) * Math.PI * 2 + G.time * 0.1
      gx += Math.cos(ang) * 7
      gz += Math.sin(ang) * 7
    }
    const stalking = targetPlayer ? P.awareness < 1 : d > 18 && !tObj?.perception?.threat
    const speed = stalking ? sp.speed.walk * 1.1 : d > 5 ? sp.speed.run : sp.speed.walk * 1.6
    c.intent.crouch = stalking ? 0.7 : 0
    c.goTo(gx, gz, speed)
    c.intent.look = tgt
    if (close && this.cool <= 0) this.set('attack', { target: this.data.target })
    if (targetPlayer && P.awareness < 0.6) this.set('investigate', { at: P.lastKnown ? { ...P.lastKnown } : { x: tgt.x, z: tgt.z } })
    if (!targetPlayer && this.t > 40) this.set('graze')
  }

  // The quarry is up out of reach, or the walls hold it off. It does not
  // stand below biting air: it paces its own stretch of a ring at the foot
  // of the climb (a pack spreads round it), head up at them, snarling now
  // and then; every so often it rushes in to try the walls from where it
  // is (soon and often if a blow could land from closer in), until it gets
  // no nearer; and it tires of it (giveUp), sooner each time. Darting it
  // from up there is fair game — it keeps moving.
  besiege(dt, G, tgt, targetPlayer) {
    const c = this.c
    const sp = c.sp
    const D = this.data
    const ring = (sp.attack ? sp.attack.range : 2) + c.radius + 2.5
    const reachable = c.reachesTarget(G, targetPlayer ? null : D.target)
    if (!D.siege) {
      D.siege = true
      D.ang = Math.atan2(c.pos.z - tgt.z, c.pos.x - tgt.x)
      D.pace = this.rng.sign()
      D.turn = this.t + this.rng.range(3, 7)
      D.rush = this.t + (reachable ? this.rng.range(2, 4) : this.rng.range(4, 9))
      D.rushEnd = 0
    }
    this.balk += dt
    if (this.balk > this.patience) {
      if (targetPlayer) return this.giveUp(G, tgt)
      this.balk = 0
      return this.set('graze') // prey up out of reach: find other prey
    }
    // lost track of them: go and look, as a hunt does
    if (targetPlayer && c.perception.awareness < 0.6) return this.set('investigate', { at: c.perception.lastKnown ? { ...c.perception.lastKnown } : { x: tgt.x, z: tgt.z } })
    if (this.t > D.turn) {
      D.pace = -D.pace
      D.turn = this.t + this.rng.range(3, 7)
    }
    c.intent.crouch = 0
    // hunt() keeps D.near, the nearest it has got, and when
    if (this.t < D.rushEnd && this.t - D.nearT < 1.2) c.goTo(tgt.x, tgt.z, sp.speed.run * 0.6)
    else {
      if (this.t > D.rush) {
        D.rushEnd = this.t + 4
        D.rush = this.t + (reachable ? this.rng.range(4, 7) : this.rng.range(7, 12))
        D.near = Infinity
      }
      D.ang += ((D.pace * sp.speed.walk * 1.2) / ring) * dt
      // the foot of the climb is out in the open: past the eaves of a roof
      const ca = Math.cos(D.ang)
      const sa = Math.sin(D.ang)
      let r = ring
      while (r < ring + 12 && G.physics.ceilingAt(tgt.x + ca * r, tgt.z + sa * r, c.pos.y + 0.4) < c.pos.y + 6) r += 1
      c.goTo(tgt.x + ca * r, tgt.z + sa * r, sp.speed.walk * 1.4)
    }
    // look up at them, not at their feet
    c.intent.look = targetPlayer ? (G.vehicle ? G.vehicle.pos : G.player.eye) : tgt
    if (this.roarCool <= 0) {
      this.roarCool = this.rng.range(2.5, 5)
      c.vocalize('threat')
    }
    c.intent.roar = c.roaring
  }

  attack(dt, G) {
    const c = this.c
    const sp = c.sp
    const a = sp.attack
    if (!a) return this.set('graze')
    const tObj = this.data.target === 'player' || !this.data.target ? null : this.data.target
    const tgt = tObj ? tObj.pos : G.player.pos
    c.halt()
    if (a.kind !== 'tail') c.face(tgt.x, tgt.z)
    c.intent.look = tgt
    const ang = Math.abs(wrapAngle(yawTo(c.pos.x, c.pos.z, tgt.x, tgt.z) - c.yaw))
    // it wheels round to a target outside its arc before winding up (for a
    // while), or someone at its hip — a jumbo syringe's reach — could never be
    // bitten; a tail swings at what is behind it already
    if (this.data.windup == null) {
      if (a.kind !== 'tail' && ang > 1.1 && this.t < 1.6) return
      this.data.windup = this.t
    }
    const t = this.t - this.data.windup
    const wind = 0.28
    if (a.lunge && t < wind + 0.15) c.nudge(tgt, a.lunge * dt)
    c.intent.attack = t < wind ? t / wind : t < wind + 0.25 ? 1 : Math.max(0, 1 - (t - wind - 0.25) * 3)
    if (!this.data.struck && t >= wind) {
      this.data.struck = true
      c.vocalize('attack')
      const d = Math.hypot(tgt.x - c.pos.x, tgt.z - c.pos.z)
      const inArc = a.kind === 'tail' ? ang > 1.2 : ang < 1.3
      if (d < a.range + c.radius + 0.6 && inArc && c.reachesTarget(G, tObj)) {
        this.balk = this.balks = 0
        if (tObj) tObj.takeHit(G, { damage: a.damage * 3, zone: 'neck', from: c.pos, cause: 'predation' })
        else c.strikePlayer(G, a.damage, a.kind === 'tail' ? 10 : 5)
      }
    }
    if (t > 0.9) {
      this.cool = a.cooldown * this.rng.range(0.8, 1.3)
      if (tObj && !tObj.vitals.alive) return this.set('feed', { carcass: tObj })
      this.set(c.sp.temperament === 'defensive' ? 'threaten' : 'hunt', { target: this.data.target || 'player' })
    }
  }

  spit(dt, G) {
    const c = this.c
    c.halt()
    const tgt = G.player.pos
    c.face(tgt.x, tgt.z)
    c.intent.look = tgt
    c.intent.roar = Math.min(1, this.t * 2)
    if (!this.data.fired && this.t > 0.7) {
      this.data.fired = true
      c.vocalize('spit')
      const eye = c.eyePos()
      const to = G.player.eye
      G.fx?.spit(eye, to)
      // ranged, but it has to see you now: a roof's edge or a wall in the way takes it
      const d = Math.hypot(tgt.x - c.pos.x, tgt.z - c.pos.z)
      if (d < c.sp.attack.spit.range && G.physics.lineOfSight(eye.x, eye.y, eye.z, to.x, to.y, to.z)) {
        setTimeout(() => G.player.blind(4.5, c.pos), 350)
      }
    }
    if (this.t > 1.3) {
      this.spitCool = c.sp.attack.spit.cooldown
      this.set('hunt', { target: 'player' })
    }
  }

  feed(dt, G) {
    const c = this.c
    const car = this.data.carcass
    if (!car || car.disposed) return this.set('graze')
    const d = Math.hypot(car.pos.x - c.pos.x, car.pos.z - c.pos.z)
    if (d > c.radius + car.radius + 1) c.goTo(car.pos.x, car.pos.z, c.sp.speed.walk)
    else {
      c.halt()
      c.face(car.pos.x, car.pos.z)
      c.intent.graze = 1
      c.intent.eat = 1
    }
    c.rec.hunger = 0
    if (this.t > 45) this.set('graze')
  }

  groggy(dt, G) {
    const c = this.c
    c.halt()
    c.intent.alert = 0.3
    if (this.t > 4) {
      const d = Math.hypot(G.player.pos.x - c.pos.x, G.player.pos.z - c.pos.z)
      if (d < 22) c.perception.alertTo(G.player.pos, 1.1)
      this.set('graze')
    }
  }

  down() {
    this.c.halt()
  }
  dead() {
    this.c.halt()
  }
}
