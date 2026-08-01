// ---------------------------------------------------------------------------
// The crew at work.
//
// The chain is deliberately physical: bricks only ever exist in one place at a
// time. Haulers take them off the pallets — an armful, or fourteen in a barrow
// — and tip them onto the supply stack by the house. Masons draw three at a
// time off that stack, carry them to the next open slot in the plan, and set
// them. If the stack runs dry the masons stand about waiting, which is exactly
// what you want to see when the haulers fall behind.
//
// Every five minutes the whole crew downs tools and walks off site while a
// fresh one walks in through the gate.
// ---------------------------------------------------------------------------

import * as THREE from 'three'
import { SITE, CREWS, ROSTER, LOAD, RATE, SHIFT_SECONDS, COLORS, WORK_SPACING } from './config.js'
import { PHASES } from './plan.js'
import { route, stanceOf } from './nav.js'
import { buildRobot, buildBrickStack } from './robot.js'
import { buildWheelbarrow } from './props.js'

const TWO_PI = Math.PI * 2
const wrap = (a) => ((a + Math.PI) % TWO_PI + TWO_PI) % TWO_PI - Math.PI

/** Where haulers tip out, and where masons pick up. */
const STACK_STAND = { level: 0, x: SITE.stack.x, y: 0, z: SITE.stack.z - 1.15 }
const MUSTER = { level: 0, x: SITE.muster.x, y: 0, z: SITE.muster.z }

export function createSim({ plan, rng, scene, stack, pallets, scaffold, onPlace, onBanner, onComplete }) {
  const robots = []
  const placed = new Uint8Array(plan.items.length)
  const claimed = new Int16Array(plan.items.length).fill(-1)
  const mortarLeft = plan.mortar.map((m) => m.needs)

  let placedCount = 0
  let firstOpen = 0
  let phaseIdx = 0
  let phaseDone = 0
  let clockT = 0
  let shiftIndex = 0
  let crew = CREWS[0]
  let finished = false
  let celebrateT = 0
  const layTimes = []

  const phaseCounts = PHASES.map((p) => plan.items.filter((it) => it.phase === p.key).length)

  // --- helpers -------------------------------------------------------------

  const palletCount = () => pallets.reduce((a, p) => a + p.count, 0)

  function fullestPallet() {
    let best = pallets[0]
    for (const p of pallets) if (p.count > best.count) best = p
    return best
  }

  function palletStand(p) {
    return { level: 0, x: p.pos.x - 1.15, y: 0, z: p.pos.z }
  }

  /**
   * The next slot a mason can start on: in the live phase, not already taken,
   * everything it rests on already set, and far enough from where the rest of
   * the gang is working that they aren't standing in each other's way.
   */
  function claimItem(r) {
    const items = plan.items
    const end = Math.min(items.length, firstOpen + 70)
    for (let i = firstOpen; i < end; i++) {
      const it = items[i]
      if (placed[i] || claimed[i] >= 0) continue
      if (it.phase !== PHASES[phaseIdx].key) continue
      let ready = true
      for (const d of it.deps) {
        if (!placed[d]) {
          ready = false
          break
        }
      }
      if (!ready) continue
      let clear = true
      for (const o of robots) {
        if (o === r || o.claim == null) continue
        const s = items[o.claim].stand
        if (Math.hypot(s.x - it.stand.x, s.z - it.stand.z) < WORK_SPACING && Math.abs((s.y || 0) - (it.stand.y || 0)) < 0.6) {
          clear = false
          break
        }
      }
      if (!clear) continue
      claimed[i] = 1
      return i
    }
    return null
  }

  function setPlaced(i) {
    const it = plan.items[i]
    placed[i] = 1
    claimed[i] = -1
    placedCount++
    phaseDone++
    layTimes.push(clockT)
    if (layTimes.length > 220) layTimes.shift()
    onPlace(it)
    if (it.mortar >= 0 && --mortarLeft[it.mortar] === 0) onPlace(plan.mortar[it.mortar], true)
    while (firstOpen < placed.length && placed[firstOpen]) firstOpen++
    if (phaseDone >= phaseCounts[phaseIdx] && phaseIdx < PHASES.length - 1) {
      phaseIdx++
      phaseDone = 0
    }
    // Raise the scaffold just ahead of the work.
    let need = 0
    for (let k = firstOpen; k < Math.min(plan.items.length, firstOpen + 90); k++) {
      const lv = plan.items[k].stand.level
      need = Math.max(need, lv === 'roof' ? 2 : lv)
    }
    scaffold.setDecks(need)
    if (placedCount >= plan.items.length && !finished) {
      finished = true
      celebrateT = 0
      onComplete?.()
    }
  }

  // --- robots --------------------------------------------------------------

  function spawnCrew(crewDef, atGate) {
    const made = []
    let n = 0
    for (const slot of ROSTER) {
      for (let k = 0; k < slot.n; k++, n++) {
        const rig = buildRobot({
          role: slot.role,
          accent: crewDef.accent,
          hatColor: crewDef.hat,
          rng,
        })
        const spread = (n - 4) * 0.55
        const r = {
          rig,
          role: slot.role,
          crewId: shiftIndex,
          pos: new THREE.Vector3(SITE.arrival.x - Math.abs(spread) * 1.4, 0, SITE.arrival.z + spread * 0.5),
          yaw: Math.PI / 2,
          stance: { level: 0, x: SITE.arrival.x, y: 0, z: SITE.arrival.z },
          path: [],
          then: null,
          state: 'walk',
          timer: 0,
          claim: null,
          carry: 0,
          leaving: false,
          anim: {},
        }
        if (!atGate) {
          // First crew of the build is already on site.
          r.pos.set(SITE.muster.x + spread, 0, SITE.muster.z + (n % 3) * 0.5)
          r.stance = { level: 0, x: r.pos.x, y: 0, z: r.pos.z }
        }
        r.rig.group.position.copy(r.pos)
        scene.add(rig.group)

        // carried armful — built once, revealed a brick at a time
        const armful = buildBrickStack(6, COLORS.brick)
        armful.scale.setScalar(0.94)
        armful.position.y = -0.06
        rig.handAnchor.add(armful)
        r.armful = armful
        armful.children.forEach((m) => (m.visible = false))

        if (slot.role === 'barrow') {
          const bw = buildWheelbarrow(rng)
          rig.barrowAnchor.add(bw.group)
          const load = buildBrickStack(10, COLORS.brick)
          load.scale.setScalar(0.95)
          load.position.set(0, -0.02, 0)
          bw.tray.add(load)
          load.children.forEach((m) => (m.visible = false))
          r.barrow = bw
          r.barrowLoad = load
        }
        made.push(r)
        robots.push(r)
      }
    }
    // Arriving crews come in off the road and through the gate like everyone else.
    for (const r of made) {
      if (atGate) {
        goto(r, { level: 0, x: SITE.gate.x + (rng() - 0.5) * 1.8, y: 0, z: SITE.gate.z - 0.8 }, () => think(r))
      } else {
        think(r)
      }
    }
    return made
  }

  function goto(r, target, then) {
    r.path = route(r.stance, target)
    r.target = target
    r.then = then
    r.state = 'walk'
  }

  function wait(r, seconds, then) {
    r.state = 'wait'
    r.timer = seconds
    r.then = then
  }

  function faceTowards(r, x, z) {
    const dx = x - r.pos.x
    const dz = z - r.pos.z
    if (Math.abs(dx) + Math.abs(dz) > 1e-4) r.faceYaw = Math.atan2(dx, dz)
  }

  // --- role behaviour ------------------------------------------------------

  function think(r) {
    if (r.leaving) return clockOff(r)
    if (finished) return celebrate(r)
    if (r.role === 'foreman') return foreman(r)
    if (r.role === 'mason') return mason(r)
    return hauler(r)
  }

  function mason(r) {
    if (r.claim == null) {
      const i = claimItem(r)
      if (i == null) {
        // nothing to start on — down tools for a moment
        return wait(r, 0.9 + rng() * 0.6, () => think(r))
      }
      r.claim = i
    }
    if (r.carry <= 0) {
      if (stack.count <= 0) return wait(r, 0.8 + rng() * 0.7, () => think(r))
      return goto(r, STACK_STAND, () => {
        const take = Math.min(LOAD.mason, stack.count)
        if (take <= 0) return think(r)
        stack.setCount(stack.count - take)
        r.carry = take
        faceTowards(r, SITE.stack.x, SITE.stack.z)
        wait(r, RATE.pickTime * take, () => think(r))
      })
    }
    const it = plan.items[r.claim]
    goto(r, it.stand, () => {
      faceTowards(r, it.pos[0], it.pos[2])
      r.state = 'lay'
      r.timer = RATE.layTime
      r.layHigh = it.pos[1] - (it.stand.y || 0) > 1.05
      r.then = () => {
        // Someone else may have finished it while this one walked over.
        if (!placed[r.claim]) setPlaced(r.claim)
        else claimed[r.claim] = -1
        r.claim = null
        r.carry = Math.max(0, r.carry - 1)
        think(r)
      }
    })
  }

  function hauler(r) {
    const cap = r.role === 'barrow' ? LOAD.barrow : LOAD.carrier
    if (r.carry <= 0) {
      if (palletCount() <= 0) return wait(r, 1.5, () => think(r))
      const p = fullestPallet()
      return goto(r, palletStand(p), () => {
        const take = Math.min(cap, p.count)
        p.setCount(p.count - take)
        r.carry = take
        faceTowards(r, p.pos.x, p.pos.z)
        wait(r, RATE.pickTime * (r.role === 'barrow' ? take * 0.35 : take), () => think(r))
      })
    }
    if (stack.count >= stack.capacity - 2) return wait(r, 1.2, () => think(r))
    return goto(r, STACK_STAND, () => {
      faceTowards(r, SITE.stack.x, SITE.stack.z)
      const room = stack.capacity - stack.count
      const drop = Math.min(r.carry, room)
      stack.setCount(stack.count + drop)
      r.carry -= drop
      wait(r, 1.1, () => {
        r.carry = 0 // anything that wouldn't fit goes back on the pile later
        think(r)
      })
    })
  }

  const FOREMAN_SPOTS = [
    { x: SITE.trailer.x + 2.4, z: SITE.trailer.z + 2.2 },
    { x: SITE.stack.x - 2.2, z: SITE.stack.z + 0.6 },
    { x: 4.4, z: 3.0 },
    { x: -4.6, z: -2.4 },
    { x: 0.4, z: 5.6 },
    { x: SITE.pallets[1].x - 2.2, z: SITE.pallets[1].z },
  ]
  function foreman(r) {
    const spot = FOREMAN_SPOTS[(rng() * FOREMAN_SPOTS.length) | 0]
    goto(r, { level: 0, x: spot.x, y: 0, z: spot.z }, () => {
      faceTowards(r, 0, 0)
      r.state = 'inspect'
      r.timer = 3 + rng() * 4
      r.then = () => think(r)
    })
  }

  function clockOff(r) {
    // Drop the claim, tip whatever is in hand back on the stack, then muster,
    // wave the incoming crew in, and walk out through the gate.
    if (r.claim != null) {
      claimed[r.claim] = -1
      r.claim = null
    }
    if (r.carry > 0) {
      stack.setCount(Math.min(stack.capacity, stack.count + r.carry))
      r.carry = 0
    }
    goto(r, { level: 0, x: MUSTER.x + (rng() - 0.5) * 2.4, y: 0, z: MUSTER.z + (rng() - 0.5) * 1.4 }, () => {
      faceTowards(r, SITE.gate.x, SITE.roadZ)
      r.state = 'wave'
      r.timer = 1.4 + rng() * 1.2
      r.then = () => {
        goto(r, { level: 0, x: SITE.gate.x + (rng() - 0.5) * 1.6, y: 0, z: SITE.gate.z + 0.6 }, () => {
          goto(r, { level: 0, x: SITE.offsite.x, y: 0, z: SITE.offsite.z }, () => {
            r.dead = true
          })
        })
      }
    })
  }

  function celebrate(r) {
    const a = (robots.indexOf(r) / Math.max(1, robots.length)) * TWO_PI
    goto(r, { level: 0, x: Math.cos(a) * 5.6, y: 0, z: 4.4 + Math.sin(a) * 1.5 }, () => {
      faceTowards(r, 0, 1)
      r.state = 'wave'
      r.timer = Infinity
      r.then = null
    })
  }

  // --- movement ------------------------------------------------------------

  function advance(r, dt) {
    if (!r.path.length) {
      r.state = 'idle'
      const then = r.then
      r.then = null
      if (then) then()
      return
    }
    while (r.path.length) {
      const wp = r.path[0]
      const climbing = !!wp.climb
      const laden = r.carry > 0 || r.role === 'barrow'
      const speed = climbing ? RATE.climb : laden ? RATE.walkLaden : RATE.walk
      const dx = wp.x - r.pos.x
      const dy = wp.y - r.pos.y
      const dz = wp.z - r.pos.z
      const dist = Math.hypot(dx, dy, dz)
      const step = speed * dt
      if (dist <= Math.max(step, 1e-4)) {
        r.pos.set(wp.x, wp.y, wp.z)
        r.roofSide = wp.roof ?? null
        r.path.shift()
        if (!r.path.length) {
          r.stance = stanceOf(r.target)
          r.speed = 0
          const then = r.then
          r.then = null
          r.state = 'idle'
          if (then) then()
          return
        }
        continue
      }
      r.pos.x += (dx / dist) * step
      r.pos.y += (dy / dist) * step
      r.pos.z += (dz / dist) * step
      r.speed = speed
      if (!climbing && Math.abs(dx) + Math.abs(dz) > 1e-3) r.faceYaw = Math.atan2(dx, dz)
      r.climbing = climbing
      r.roofSide = wp.roof ?? null
      return
    }
  }

  // --- shifts --------------------------------------------------------------

  function startShift(first) {
    shiftIndex++
    crew = CREWS[(shiftIndex - 1) % CREWS.length]
    spawnCrew(crew, !first)
    if (!first) {
      for (const r of robots) {
        if (r.crewId < shiftIndex && !r.leaving) {
          r.leaving = true
          // let them finish the step they're on, then walk off
          if (r.state === 'wait' || r.state === 'idle' || r.state === 'inspect') think(r)
        }
      }
      if (!quiet) {
        onBanner('SHIFT CHANGE', `${crew.name} crew on — day ${plan.day}`, `#${crew.accent.toString(16).padStart(6, '0')}`)
      }
    }
  }

  /**
   * Run the site forward with nothing on screen, so the page opens on a job
   * already well under way rather than on an empty plot.
   */
  let quiet = false
  function preroll(seconds) {
    quiet = true
    const step = 1 / 20
    for (let t = 0; t < seconds; t += step) update(step)
    quiet = false
  }

  startShift(true)

  // --- per-frame -----------------------------------------------------------

  function update(dt) {
    clockT += dt
    if (!finished && Math.floor(clockT / SHIFT_SECONDS) + 1 > shiftIndex) startShift(false)
    // The hand-over party runs on wall-clock time, not fast-forwarded time.
    if (finished && !quiet) celebrateT += dt

    // top the pallets up — a delivery arrives whenever one runs out
    for (const p of pallets) {
      if (p.count <= 0) {
        p.restock = (p.restock ?? 0) + dt
        if (p.restock > 7) {
          p.setCount(p.capacity)
          p.restock = 0
        }
      }
    }

    for (let i = robots.length - 1; i >= 0; i--) {
      const r = robots[i]
      if (r.dead) {
        scene.remove(r.rig.group)
        robots.splice(i, 1)
        continue
      }

      if (r.state === 'walk') {
        advance(r, dt)
      } else if (r.timer > 0) {
        r.timer -= dt
        if (r.timer <= 0) {
          const then = r.then
          r.then = null
          r.state = 'idle'
          if (then) then()
        }
      }

      // A robot that finished its business but has nothing queued: re-think.
      if (r.state === 'idle' && !r.path.length && !r.then && r.timer <= 0) think(r)

      // --- pose ---------------------------------------------------------
      const a = r.anim
      const moving = r.state === 'walk' && r.path.length > 0
      a.moving = moving
      a.speed = moving ? r.speed || RATE.walk : 0
      a.carry = r.role === 'barrow' ? 0 : r.carry
      a.push = r.role === 'barrow' ? 1 : 0
      a.lay = r.state === 'lay' && !r.layHigh ? 1 : 0
      a.reach = r.state === 'lay' && r.layHigh ? 1 : 0
      a.idle = r.state === 'wait' || r.state === 'inspect' ? 1 : 0
      a.wave = r.state === 'wave' ? 1 : 0
      a.tilt = r.roofSide ? r.stance.tilt || 0.32 : 0
      if (r.climbing && moving) {
        a.moving = true
        a.reach = 0.6
      }
      r.rig.update(dt, a)

      // reveal the right number of bricks in hand / in the barrow
      const held = r.role === 'barrow' ? 0 : r.carry
      for (let k = 0; k < r.armful.children.length; k++) r.armful.children[k].visible = k < held
      if (r.barrowLoad) {
        const n = Math.round((r.carry / LOAD.barrow) * r.barrowLoad.children.length)
        for (let k = 0; k < r.barrowLoad.children.length; k++) r.barrowLoad.children[k].visible = k < n
        if (moving) r.barrow.wheel.rotation.y -= (r.speed || 0) * dt * 6.6
      }

      // --- transform ----------------------------------------------------
      r.rig.group.position.copy(r.pos)
      if (r.faceYaw != null) {
        r.yaw += wrap(r.faceYaw - r.yaw) * Math.min(1, dt * 9)
      }
      r.rig.group.rotation.y = r.yaw
    }
  }

  // --- readouts ------------------------------------------------------------

  /** Units per minute over the last couple of minutes of actual work. */
  function ratePerMin() {
    const win = 100
    const t0 = clockT - win
    let n = 0
    for (let i = layTimes.length - 1; i >= 0 && layTimes[i] >= t0; i--) n++
    if (n < 4) return layTimes.length > 1 ? (layTimes.length / Math.max(1, clockT)) * 60 : 0
    return (n / Math.min(win, clockT)) * 60
  }

  function etaSeconds() {
    const remaining = plan.items.length - placedCount
    if (remaining <= 0) return 0
    const rate = ratePerMin()
    if (rate < 0.4) return null
    return (remaining / rate) * 60
  }

  return {
    update,
    preroll,
    /** Send everyone home for good — called when the site is handed over. */
    dispose() {
      for (const r of robots) scene.remove(r.rig.group)
      robots.length = 0
    },
    robots,
    get placed() {
      return placedCount
    },
    get total() {
      return plan.items.length
    },
    get shiftIndex() {
      return shiftIndex
    },
    get crew() {
      return crew
    },
    get finished() {
      return finished
    },
    get celebrateT() {
      return celebrateT
    },
    get phaseKey() {
      return PHASES[phaseIdx].key
    },
    get phaseLabel() {
      return PHASES[phaseIdx].label
    },
    secondsToShiftChange: () => SHIFT_SECONDS - (clockT % SHIFT_SECONDS),
    phaseProgress: () =>
      PHASES.map((p, i) => ({
        key: p.key,
        label: p.label,
        total: phaseCounts[i],
        done: i < phaseIdx ? phaseCounts[i] : i === phaseIdx ? phaseDone : 0,
      })).filter((p) => p.total > 0),
    isPlaced: (i) => !!placed[i],
    ratePerMin,
    etaSeconds,
  }
}
