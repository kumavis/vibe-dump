import { clamp, wrapAngle, yawTo } from '../core/mathx.js'

// Behaviour as a small state machine. `think()` runs a few times a second and
// picks the state from what the animal perceives (awareness, threats, hunger,
// herd alarms, flares) filtered through its temperament. Each state's per-frame
// method then drives movement and the animator's intents.
//
// States: graze, alert, investigate, flee, threaten, charge, hunt, attack,
//         spit, feed, groggy, down, dead

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
    I.graze = I.alert = I.roar = I.attack = I.crouch = I.eat = 0
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
    if (h && h.alarm && G.time - h.alarm.t < 4 && temper === 'skittish' && s !== 'flee') {
      this.fleeFrom(h.alarm, 6 + this.rng.next() * 3)
      return
    }

    const aw = P.awareness
    const player = G.heli && G.heli.piloted ? G.heli.pos : G.player.pos
    const dPlayer = Math.hypot(player.x - c.pos.x, player.z - c.pos.z)

    if (aw >= 1) {
      if (temper === 'skittish') {
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
        if (s !== 'hunt' || this.data.target !== 'player') {
          this.set('hunt', { target: 'player' })
          c.vocalize('roar')
          this.alertPack(G)
        }
        return
      }
      if (temper === 'defensive') {
        const space = sp.personalSpace || 12
        if (this.anger > 0.7 && dPlayer < space * 2.5) {
          if (s !== 'charge') this.set('charge', { target: 'player' })
          return
        }
        if (c.vitals.rec.health < sp.health * 0.35) {
          if (s !== 'flee') this.fleeFrom(player, 8)
          return
        }
        if (dPlayer < space * 1.6) {
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
        if (s !== 'flee') {
          this.fleeFrom(P.lastKnown, 5)
          this.alarmHerd(G, P.lastKnown)
        }
        return
      }
      if (temper === 'aggressive' || (temper === 'defensive' && aw > 0.6)) {
        if (s !== 'investigate' && s !== 'hunt') this.set('investigate', { at: { ...P.lastKnown } })
        else if (s === 'investigate') this.data.at = { ...P.lastKnown }
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

  // Something hurt it. Called by the creature when a dart or bullet lands.
  onHurt(G, from, lethal) {
    const c = this.c
    const t = c.sp.temperament
    c.perception.alertTo(from, 1.3)
    this.anger += lethal ? 0.9 : 0.5
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
    const d = Math.hypot(at.x - c.pos.x, at.z - c.pos.z)
    const stalker = c.sp.temperament === 'aggressive'
    if (d > 3 && this.t < 25) {
      c.goTo(at.x, at.z, c.sp.speed.walk * (stalker ? 0.9 : 0.8))
      c.intent.crouch = stalker ? 0.8 : 0
      c.intent.look = at
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
    // tail fighters swing at what is behind them; everyone else turns to face it
    if (sp.attack?.kind === 'tail' && behind && d < sp.attack.range + c.radius && this.cool <= 0) {
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
    if (!this.data.hit && d < reach) {
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
    const range = sp.attack ? sp.attack.range : 2
    const stalking = targetPlayer ? P.awareness < 1 : d > 18 && !tObj?.perception?.threat
    const speed = stalking ? sp.speed.walk * 1.1 : d > 5 ? sp.speed.run : sp.speed.walk * 1.6
    c.intent.crouch = stalking ? 0.7 : 0
    c.goTo(gx, gz, speed)
    c.intent.look = tgt
    if (sp.attack?.spit && targetPlayer && P.sees && d < sp.attack.spit.range && d > 5 && this.spitCool <= 0) {
      return this.set('spit')
    }
    if (d < range + c.radius + 0.4 && this.cool <= 0) this.set('attack', { target: this.data.target })
    if (targetPlayer && P.awareness < 0.6) this.set('investigate', { at: P.lastKnown ? { ...P.lastKnown } : { x: tgt.x, z: tgt.z } })
    if (!targetPlayer && this.t > 40) this.set('graze')
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
    const wind = 0.28
    if (a.lunge && this.t < wind + 0.15) c.nudge(tgt, a.lunge * dt)
    c.intent.attack = this.t < wind ? this.t / wind : this.t < wind + 0.25 ? 1 : Math.max(0, 1 - (this.t - wind - 0.25) * 3)
    c.intent.look = tgt
    if (!this.data.struck && this.t >= wind) {
      this.data.struck = true
      c.vocalize('attack')
      const d = Math.hypot(tgt.x - c.pos.x, tgt.z - c.pos.z)
      const ang = Math.abs(wrapAngle(yawTo(c.pos.x, c.pos.z, tgt.x, tgt.z) - c.yaw))
      const inArc = a.kind === 'tail' ? ang > 1.2 : ang < 1.3
      if (d < a.range + c.radius + 0.6 && inArc) {
        if (tObj) tObj.takeHit(G, { damage: a.damage * 3, zone: 'neck', from: c.pos, cause: 'predation' })
        else c.strikePlayer(G, a.damage, a.kind === 'tail' ? 10 : 5)
      }
    }
    if (this.t > 0.9) {
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
      G.fx?.spit(c.eyePos(), G.player.eye)
      const d = Math.hypot(tgt.x - c.pos.x, tgt.z - c.pos.z)
      if (d < c.sp.attack.spit.range && c.perception.sees) {
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
