// ---------------------------------------------------------------------------
// The crew at work.
//
// The chain is deliberately physical: a piece of material only ever exists in
// one place at a time. Haulers take it off the delivery drops — an armful, or a
// barrow-load — and tip it onto the right stock by the house. Masons draw from
// the stock that holds what they need: you cannot lay a rafter out of the brick
// pile, so a mason with an armful of brick and a rafter to set has to put the
// brick back first.
//
// A plot runs BUILD -> FIT-OUT -> DECORATING -> DONE. Every five minutes the
// whole crew clocks off and a fresh one walks in, whatever stage it is at.
//
// All coordinates are plot-local; the renderer parents the plot to the street.
// ---------------------------------------------------------------------------

import * as THREE from 'three'
import {
  SITE, YARD, CREWS, ROSTER, RATE, SHIFT_SECONDS, COLORS, WORK_SPACING, MATERIALS,
} from './config.js'
import { PHASES } from './plan.js'
import { route, stanceOf } from './nav.js'
import { buildRobot, buildCarryStack } from './robot.js'
import { buildWheelbarrow, buildFurniture, buildRoller } from './props.js'

const TWO_PI = Math.PI * 2
const wrap = (a) => ((a + Math.PI) % TWO_PI + TWO_PI) % TWO_PI - Math.PI

export function createSim({
  plan, rng, group, origin, stocks, drops, scaffold, truck,
  onPlace, onPaint, onBanner, onStage, onComplete, requestCrew, clock0 = 0,
}) {
  const robots = []
  const items = plan.items
  const placed = new Uint8Array(items.length)
  const claimed = new Int16Array(items.length).fill(-1)
  const mortarLeft = plan.mortar.map((m) => m.needs)

  /** Site landmarks are fixed to the street, so bring them into plot space. */
  const L = (p) => ({ level: 0, x: p.x - origin.x, y: 0, z: p.z - origin.z })
  const MUSTER = L(SITE.muster)
  const GATE = L(SITE.gate)
  const OFFSITE = L(SITE.offsite)
  const ROAD = L({ x: SITE.gate.x, z: SITE.roadZ })

  let placedCount = 0
  let firstOpen = 0
  let phaseIdx = 0
  let phaseDone = 0
  // The shift clock runs across the whole street, not per plot — moving next
  // door doesn't buy the crew a fresh five minutes.
  let clockT = clock0
  let shiftIndex = Math.floor(clock0 / SHIFT_SECONDS)
  let crew = CREWS[0]
  let stage = 'build' // build | fitout | paint | done
  let stageT = 0
  let quiet = false
  const layTimes = []

  const phaseCounts = PHASES.map((p) => items.filter((it) => it.phase === p.key).length)

  /** Outstanding demand per material, so haulers stock what is actually wanted. */
  const demand = {}
  for (const m of MATERIALS) demand[m.key] = 0
  for (const it of items) demand[it.mat]++

  const matDef = Object.fromEntries(MATERIALS.map((m) => [m.key, m]))

  // --- fit-out and decorating work lists -----------------------------------
  const furniture = plan.furniture.map((f, i) => ({ ...f, id: i, done: false, taken: false }))
  const patches = plan.paintPatches.map((p) => ({ ...p, done: false, taken: false }))
  let furnDone = 0
  let paintDone = 0

  // --- helpers -------------------------------------------------------------

  function stockStand(key) {
    const s = YARD.stacks[key]
    return { level: 0, x: s.x, y: 0, z: s.z - 1.15 }
  }
  function dropStand(key) {
    const d = YARD.sources[key]
    return { level: 0, x: d.x - 1.2, y: 0, z: d.z }
  }

  /**
   * The next slot a mason can start on. Only items made of what it is already
   * carrying, unless its hands are empty.
   */
  function claimItem(r) {
    const wantMat = r.carry > 0 ? r.carryMat : null
    const end = Math.min(items.length, firstOpen + 90)
    for (let i = firstOpen; i < end; i++) {
      const it = items[i]
      if (placed[i] || claimed[i] >= 0) continue
      if (it.phase !== PHASES[phaseIdx].key) continue
      if (wantMat && it.mat !== wantMat) continue
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
        if (Math.hypot(s.x - it.stand.x, s.z - it.stand.z) < WORK_SPACING
          && Math.abs((s.y || 0) - (it.stand.y || 0)) < 0.6) {
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
    const it = items[i]
    placed[i] = 1
    claimed[i] = -1
    placedCount++
    phaseDone++
    demand[it.mat]--
    layTimes.push(clockT)
    if (layTimes.length > 220) layTimes.shift()
    onPlace(it)
    if (it.mortar >= 0 && --mortarLeft[it.mortar] === 0) onPlace(plan.mortar[it.mortar], true)
    while (firstOpen < placed.length && placed[firstOpen]) firstOpen++
    if (phaseDone >= phaseCounts[phaseIdx] && phaseIdx < PHASES.length - 1) {
      phaseIdx++
      phaseDone = 0
    }
    let need = 0
    for (let k = firstOpen; k < Math.min(items.length, firstOpen + 90); k++) {
      const lv = items[k].stand.level
      need = Math.max(need, lv === 'roof' ? 2 : lv)
    }
    scaffold.setDecks(need)
    if (placedCount >= items.length && stage === 'build') enterStage('fitout')
  }

  function enterStage(next) {
    stage = next
    stageT = 0
    onStage?.(next)
    if (next === 'fitout') {
      truck.arrive()
      if (!quiet) onBanner('TOPPED OUT', 'joiners on the way — fitting out', '#8fd14f')
    } else if (next === 'paint') {
      truck.leave()
      if (!quiet) onBanner('DECORATING', `${plan.paint.name.toLowerCase()} — one coat`, '#f3a226')
    } else if (next === 'done') {
      // the decorators worked off the scaffold, so it only comes down now
      scaffold.setDecks(0)
      if (!quiet) onBanner('HANDED OVER', `${plan.title} finished`, '#8fd14f')
      onComplete?.()
    }
    // everyone re-reads their orders when the stage changes
    for (const r of robots) if (r.state === 'wait' || r.state === 'idle') restart(r)
  }

  // --- robots --------------------------------------------------------------

  function spawnCrew(crewDef, atGate, supplied) {
    const made = []
    let n = 0
    // Whoever the yard has finished kitting out turns up as-is; only if it has
    // nobody ready (a fast-forward, or the very first shift) do we build here.
    const want = ROSTER.flatMap((slot) => Array.from({ length: slot.n }, () => slot.role))
    const spare = (supplied || []).slice()
    const roster = want.map((role) => {
      const i = spare.findIndex((s) => s.role === role)
      if (i < 0) return { role, n: 1 }
      const [s] = spare.splice(i, 1)
      return { role, n: 1, rig: s.rig, world: s.world }
    })
    for (const slot of roster) {
      for (let k = 0; k < slot.n; k++, n++) {
        const rig = slot.rig || buildRobot({ role: slot.role, accent: crewDef.accent, hatColor: crewDef.hat, rng })
        const spread = (n - 4) * 0.55
        const start = slot.world
          ? { level: 0, x: slot.world.x - origin.x, y: 0, z: slot.world.z - origin.z }
          : L(SITE.arrival)
        const r = {
          rig,
          role: slot.role,
          crewId: shiftIndex,
          pos: slot.world
            ? new THREE.Vector3(start.x, 0, start.z)
            : new THREE.Vector3(start.x - Math.abs(spread) * 1.4, 0, start.z + spread * 0.5),
          yaw: Math.PI / 2,
          stance: { level: 0, x: start.x, y: 0, z: start.z },
          path: [],
          then: null,
          state: 'walk',
          timer: 0,
          claim: null,
          carry: 0,
          carryMat: null,
          leaving: false,
          anim: {},
        }
        if (!atGate) {
          r.pos.set(MUSTER.x + spread, 0, MUSTER.z + (n % 3) * 0.5)
          r.stance = { level: 0, x: r.pos.x, y: 0, z: r.pos.z }
        }
        r.rig.group.position.copy(r.pos)
        group.add(rig.group)

        // one carried load per material, revealed a piece at a time
        r.loads = {}
        for (const m of MATERIALS) {
          const stack = buildCarryStack(m.key, m.load.mason, COLORS.brick)
          stack.scale.setScalar(m.key === 'brick' ? 0.94 : 0.8)
          stack.position.y = -0.06
          stack.visible = false
          rig.handAnchor.add(stack)
          r.loads[m.key] = stack
        }
        const roller = buildRoller(plan.paint.color)
        roller.scale.setScalar(0.8)
        roller.position.set(0, -0.08, 0.04)
        roller.rotation.x = -0.5
        roller.visible = false
        rig.rightHand.add(roller)
        r.roller = roller

        if (slot.role === 'barrow') {
          const bw = buildWheelbarrow(rng)
          rig.barrowAnchor.add(bw.group)
          const load = buildCarryStack('brick', 10, COLORS.brick)
          load.scale.setScalar(0.95)
          bw.tray.add(load)
          load.visible = false
          r.barrow = bw
          r.barrowLoad = load
        }
        made.push(r)
        robots.push(r)
      }
    }
    for (const r of made) {
      if (atGate) {
        // along the road to the gate, then in — never straight through the fence
        const lane = { level: 0, x: GATE.x + (rng() - 0.5) * 2.2, y: 0, z: ROAD.z }
        goto(r, lane, () => {
          goto(r, { level: 0, x: lane.x, y: 0, z: GATE.z - 0.9 }, () => think(r))
        })
      } else think(r)
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
  /**
   * Drop whatever a robot was part-way through and give it fresh orders. The
   * pending timer and callback have to go with it — leaving them armed used to
   * let a second chain of work start on top of the first, which orphaned
   * whatever the robot had claimed.
   */
  function restart(r) {
    r.timer = 0
    r.then = null
    r.path = []
    r.state = 'idle'
    think(r)
  }

  function faceTowards(r, x, z) {
    const dx = x - r.pos.x
    const dz = z - r.pos.z
    if (Math.abs(dx) + Math.abs(dz) > 1e-4) r.faceYaw = Math.atan2(dx, dz)
  }

  // --- role behaviour ------------------------------------------------------

  function think(r) {
    if (r.leaving) return clockOff(r)
    if (stage === 'done') return celebrate(r)
    if (r.role === 'foreman') return foreman(r)
    // the joiners work the lorry; the masons stand off until there is a wall to paint
    if (stage === 'fitout') return r.role === 'mason' ? watchOn(r) : fitter(r)
    if (stage === 'paint') return r.role === 'barrow' ? watchOn(r) : painter(r)
    if (r.role === 'mason') return mason(r)
    return hauler(r)
  }

  /** Nothing to do on this stage — mooch about the plot and watch. */
  function watchOn(r) {
    const spot = FOREMAN_SPOTS[(rng() * FOREMAN_SPOTS.length) | 0]
    goto(r, { level: 0, x: spot.x + (rng() - 0.5) * 1.6, y: 0, z: spot.z + (rng() - 0.5) * 1.6 }, () => {
      faceTowards(r, 0, 0)
      r.state = 'inspect'
      r.timer = 3 + rng() * 5
      r.then = () => think(r)
    })
  }

  function mason(r) {
    if (r.claim == null) {
      const i = claimItem(r)
      if (i == null) {
        // nothing here it can start on — if its hands are full of the wrong
        // stuff, take that back to the stock it came from
        if (r.carry > 0) {
          const key = r.carryMat
          return goto(r, stockStand(key), () => {
            stocks[key].setCount(Math.min(stocks[key].capacity, stocks[key].count + r.carry))
            r.carry = 0
            r.carryMat = null
            wait(r, 0.5, () => think(r))
          })
        }
        return wait(r, 0.9 + rng() * 0.6, () => think(r))
      }
      r.claim = i
    }
    const it = items[r.claim]
    if (r.carry <= 0 || r.carryMat !== it.mat) {
      const key = it.mat
      const stock = stocks[key]
      if (stock.count <= 0) return wait(r, 0.8 + rng() * 0.7, () => think(r))
      return goto(r, stockStand(key), () => {
        const take = Math.min(matDef[key].load.mason, stock.count)
        if (take <= 0) return think(r)
        stock.setCount(stock.count - take)
        r.carry = take
        r.carryMat = key
        faceTowards(r, YARD.stacks[key].x, YARD.stacks[key].z)
        wait(r, RATE.pickTime * take, () => think(r))
      })
    }
    goto(r, it.stand, () => {
      faceTowards(r, it.pos[0], it.pos[2])
      r.state = 'lay'
      r.timer = RATE.layTime
      r.layHigh = it.pos[1] - (it.stand.y || 0) > 1.05
      r.then = () => {
        if (!placed[r.claim]) setPlaced(r.claim)
        else claimed[r.claim] = -1
        r.claim = null
        r.carry = Math.max(0, r.carry - 1)
        if (r.carry === 0) r.carryMat = null
        think(r)
      }
    })
  }

  /** Which stock most needs topping up, weighted by what is still to be laid. */
  function neediestMaterial() {
    let best = null
    let bestScore = 0
    for (const m of MATERIALS) {
      if (demand[m.key] <= 0) continue
      const st = stocks[m.key]
      const deficit = (st.capacity - st.count) / st.capacity
      if (deficit < 0.25) continue
      // whatever the masons are on right now matters most
      const urgent = items[Math.min(firstOpen, items.length - 1)]?.mat === m.key ? 2.2 : 1
      const score = deficit * urgent * (st.count <= 2 ? 3 : 1)
      if (score > bestScore) {
        bestScore = score
        best = m
      }
    }
    return best
  }

  function hauler(r) {
    if (r.carry > 0) {
      const key = r.carryMat
      const st = stocks[key]
      if (st.count >= st.capacity - 1) return wait(r, 1.2, () => think(r))
      return goto(r, stockStand(key), () => {
        faceTowards(r, YARD.stacks[key].x, YARD.stacks[key].z)
        const drop = Math.min(r.carry, st.capacity - st.count)
        st.setCount(st.count + drop)
        r.carry = 0
        r.carryMat = null
        wait(r, 0.9, () => think(r))
      })
    }
    const m = neediestMaterial()
    if (!m) return wait(r, 1.5, () => think(r))
    const src = drops[m.key]
    if (src.count <= 0) return wait(r, 1.2, () => think(r))
    return goto(r, dropStand(m.key), () => {
      const take = Math.min(m.load[r.role] ?? 3, src.count)
      src.setCount(src.count - take)
      r.carry = take
      r.carryMat = m.key
      faceTowards(r, YARD.sources[m.key].x, YARD.sources[m.key].z)
      wait(r, RATE.pickTime * (r.role === 'barrow' ? take * 0.35 : take), () => think(r))
    })
  }

  // --- fit-out -------------------------------------------------------------

  function fitter(r) {
    if (!truck.ready()) return wait(r, 1, () => think(r))
    let piece = r.piece
    if (!piece) {
      piece = furniture.find((f) => !f.taken)
      if (!piece) {
        if (furnDone >= furniture.length && stage === 'fitout') enterStage('paint')
        return wait(r, 1.2, () => think(r))
      }
      piece.taken = true
      r.piece = piece
    }
    if (r.holding) {
      // already carrying it — just get it inside
      return goto(r, { level: 'inside', x: piece.at[0], y: 0, z: piece.at[2] }, () => {
        faceTowards(r, piece.at[0] * 1.4, piece.at[2] * 1.4)
        r.state = 'set'
        r.timer = RATE.placeFurniture
        r.then = () => {
          r.rig.handAnchor.remove(r.holding)
          truck.settle(r.holding, piece)
          r.holding = null
          r.piece = null
          piece.done = true
          furnDone++
          if (furnDone >= furniture.length && stage === 'fitout') enterStage('paint')
          think(r)
        }
      })
    }
    const lp = truck.loadPoint()
    goto(r, { level: 0, x: lp.x, y: 0, z: lp.z }, () => {
      faceTowards(r, lp.x, lp.z + 1)
      wait(r, 0.9, () => {
        // shoulder it and walk it in through the front door
        r.holding = truck.take(piece)
        r.rig.handAnchor.add(r.holding)
        r.holding.position.set(0, -0.1, 0.12)
        r.holding.scale.setScalar(0.55)
        goto(r, { level: 'inside', x: piece.at[0], y: 0, z: piece.at[2] }, () => {
          faceTowards(r, piece.at[0] * 1.4, piece.at[2] * 1.4)
          r.state = 'set'
          r.timer = RATE.placeFurniture
          r.then = () => {
            r.rig.handAnchor.remove(r.holding)
            truck.settle(r.holding, piece)
            r.holding = null
            r.piece = null
            piece.done = true
            furnDone++
            if (furnDone >= furniture.length && stage === 'fitout') enterStage('paint')
            think(r)
          }
        })
      })
    })
  }

  // --- decorating ----------------------------------------------------------

  function painter(r) {
    let patch = r.patch
    if (!patch) {
      patch = patches.find((p) => !p.taken)
      if (!patch) {
        if (paintDone >= patches.length && stage === 'paint') enterStage('done')
        return wait(r, 1.2, () => think(r))
      }
      patch.taken = true
      r.patch = patch
    }
    goto(r, patch.stand, () => {
      faceTowards(r, patch.pos[0], patch.pos[2])
      r.state = 'paint'
      r.timer = RATE.paintTime
      r.then = () => {
        onPaint(patch)
        patch.done = true
        paintDone++
        r.patch = null
        if (paintDone >= patches.length && stage === 'paint') enterStage('done')
        think(r)
      }
    })
  }

  // --- foreman, clocking off, and the hand-over ----------------------------

  const FOREMAN_SPOTS = [
    { x: -3.4, z: 5.6 },
    { x: 4.4, z: 3.0 },
    { x: -4.6, z: -2.4 },
    { x: 0.4, z: 6.2 },
    { x: 5.6, z: -1.2 },
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
    if (r.claim != null) {
      claimed[r.claim] = -1
      r.claim = null
    }
    if (r.carry > 0 && r.carryMat) {
      const st = stocks[r.carryMat]
      st.setCount(Math.min(st.capacity, st.count + r.carry))
      r.carry = 0
      r.carryMat = null
    }
    // a fitter mid-delivery finishes the piece rather than dropping a sofa
    if (r.piece) {
      r.piece.taken = false
      if (r.holding) {
        r.rig.handAnchor.remove(r.holding)
        truck.putBack(r.holding, r.piece)
        r.holding = null
      }
      r.piece = null
    }
    if (r.patch) {
      r.patch.taken = false
      r.patch = null
    }
    goto(r, { level: 0, x: MUSTER.x + (rng() - 0.5) * 2.4, y: 0, z: MUSTER.z + (rng() - 0.5) * 1.4 }, () => {
      faceTowards(r, GATE.x, GATE.z + 3)
      r.state = 'wave'
      r.timer = 1.4 + rng() * 1.2
      r.then = () => {
        goto(r, { level: 0, x: GATE.x + (rng() - 0.5) * 1.6, y: 0, z: GATE.z + 0.6 }, () => {
          goto(r, { level: 0, x: GATE.x + (rng() - 0.5) * 2.2, y: 0, z: ROAD.z }, () => {
            goto(r, OFFSITE, () => {
              r.dead = true
            })
          })
        })
      }
    })
  }

  function celebrate(r) {
    const a = (robots.indexOf(r) / Math.max(1, robots.length)) * TWO_PI
    goto(r, { level: 0, x: Math.cos(a) * 5.6, y: 0, z: 5.2 + Math.sin(a) * 1.5 }, () => {
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
      const speed = r.holding
        ? RATE.walkFurniture
        : climbing ? RATE.climb : laden ? RATE.walkLaden : RATE.walk
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
    spawnCrew(crew, !first, first ? null : requestCrew?.())
    if (!first) {
      for (const r of robots) {
        if (r.crewId < shiftIndex && !r.leaving) {
          r.leaving = true
          if (r.state === 'wait' || r.state === 'idle' || r.state === 'inspect') restart(r)
        }
      }
      if (!quiet) {
        onBanner('SHIFT CHANGE', `${crew.name} crew on`, `#${crew.accent.toString(16).padStart(6, '0')}`)
      }
    }
  }

  startShift(true)

  function preroll(seconds) {
    quiet = true
    const step = 1 / 20
    for (let t = 0; t < seconds; t += step) update(step)
    quiet = false
  }

  // --- per-frame -----------------------------------------------------------

  /**
   * Release work whose claimant has gone home. Nothing should reach this — but
   * a single orphaned claim stalls a whole stage, so it is worth the sweep.
   */
  let sweepT = 0
  function sweepClaims(dt) {
    sweepT += dt
    if (sweepT < 2) return
    sweepT = 0
    for (let i = 0; i < claimed.length; i++) {
      if (claimed[i] < 0 || placed[i]) continue
      if (!robots.some((r) => r.claim === i)) claimed[i] = -1
    }
    for (const p of patches) {
      if (p.taken && !p.done && !robots.some((r) => r.patch === p)) p.taken = false
    }
    for (const f of furniture) {
      if (f.taken && !f.done && !robots.some((r) => r.piece === f)) f.taken = false
    }
  }

  function update(dt) {
    clockT += dt
    stageT += dt
    sweepClaims(dt)
    if (stage !== 'done' && Math.floor(clockT / SHIFT_SECONDS) + 1 > shiftIndex) startShift(false)
    truck.update(dt)

    // the merchant keeps the drops topped up
    for (const m of MATERIALS) {
      const d = drops[m.key]
      if (d.count <= 0 && demand[m.key] > 0) {
        d.restock = (d.restock ?? 0) + dt
        if (d.restock > 7) {
          d.setCount(d.capacity)
          d.restock = 0
        }
      }
    }

    for (let i = robots.length - 1; i >= 0; i--) {
      const r = robots[i]
      if (r.dead) {
        group.remove(r.rig.group)
        robots.splice(i, 1)
        continue
      }

      if (r.state === 'walk') advance(r, dt)
      else if (r.timer > 0) {
        r.timer -= dt
        if (r.timer <= 0) {
          const then = r.then
          r.then = null
          r.state = 'idle'
          if (then) then()
        }
      }
      if (r.state === 'idle' && !r.path.length && !r.then && r.timer <= 0) think(r)

      // --- pose ---------------------------------------------------------
      const a = r.anim
      const moving = r.state === 'walk' && r.path.length > 0
      a.moving = moving
      a.speed = moving ? r.speed || RATE.walk : 0
      a.carry = r.role === 'barrow' || r.holding ? 0 : r.carry
      a.push = r.role === 'barrow' && stage === 'build' ? 1 : 0
      a.haul = r.holding ? 1 : 0
      a.lay = r.state === 'lay' && !r.layHigh ? 1 : 0
      a.reach = r.state === 'lay' && r.layHigh ? 1 : 0
      a.paint = r.state === 'paint' ? 1 : 0
      a.idle = r.state === 'wait' || r.state === 'inspect' ? 1 : 0
      a.wave = r.state === 'wave' ? 1 : 0
      a.tilt = r.roofSide ? r.stance.tilt || 0.32 : 0
      if (r.climbing && moving) {
        a.moving = true
        a.reach = 0.6
      }
      r.rig.update(dt, a)

      // what is actually in its hands
      for (const m of MATERIALS) {
        const stack = r.loads[m.key]
        const active = !r.holding && r.carryMat === m.key && r.carry > 0 && r.role !== 'barrow'
        stack.visible = active
        if (active) {
          for (let k = 0; k < stack.children.length; k++) stack.children[k].visible = k < r.carry
        }
      }
      r.roller.visible = stage === 'paint' && !r.leaving && r.role !== 'foreman'
      if (r.barrowLoad) {
        const n = Math.round((r.carry / (matDef[r.carryMat]?.load.barrow ?? 8)) * r.barrowLoad.children.length)
        r.barrowLoad.visible = r.carry > 0
        for (let k = 0; k < r.barrowLoad.children.length; k++) r.barrowLoad.children[k].visible = k < n
        if (moving) r.barrow.wheel.rotation.y -= (r.speed || 0) * dt * 6.6
      }

      r.rig.group.position.copy(r.pos)
      if (r.faceYaw != null) r.yaw += wrap(r.faceYaw - r.yaw) * Math.min(1, dt * 9)
      r.rig.group.rotation.y = r.yaw
    }
  }

  // --- readouts ------------------------------------------------------------

  function ratePerMin() {
    const win = 100
    const t0 = clockT - win
    let n = 0
    for (let i = layTimes.length - 1; i >= 0 && layTimes[i] >= t0; i--) n++
    if (n < 4) return layTimes.length > 1 ? (layTimes.length / Math.max(1, clockT)) * 60 : 0
    return (n / Math.min(win, clockT)) * 60
  }

  function etaSeconds() {
    if (stage !== 'build') return null
    const remaining = items.length - placedCount
    if (remaining <= 0) return 0
    const rate = ratePerMin()
    if (rate < 0.4) return null
    return (remaining / rate) * 60
  }

  const STAGE_LABEL = { build: null, fitout: 'FIT-OUT', paint: 'DECORATING', done: 'COMPLETE' }

  return {
    update,
    preroll,
    dispose() {
      for (const r of robots) group.remove(r.rig.group)
      robots.length = 0
    },
    robots,
    get placed() {
      return placedCount
    },
    get total() {
      return items.length
    },
    get shiftIndex() {
      return shiftIndex
    },
    get clockT() {
      return clockT
    },
    get crew() {
      return crew
    },
    get stage() {
      return stage
    },
    get stageT() {
      return stageT
    },
    get finished() {
      return stage === 'done'
    },
    get phaseLabel() {
      return STAGE_LABEL[stage] || PHASES[phaseIdx].label
    },
    get fitout() {
      return { done: furnDone, total: furniture.length }
    },
    get painting() {
      return { done: paintDone, total: patches.length }
    },
    secondsToShiftChange: () => SHIFT_SECONDS - (clockT % SHIFT_SECONDS),
    /** Whose livery the yard should be building next. */
    nextCrew: () => CREWS[shiftIndex % CREWS.length],
    phaseProgress: () =>
      PHASES.map((p, i) => ({
        key: p.key,
        label: p.label,
        total: phaseCounts[i],
        done: i < phaseIdx ? phaseCounts[i] : i === phaseIdx ? phaseDone : 0,
      })).filter((p) => p.total > 0),
    isPlaced: (i) => !!placed[i],
    debug: () => ({
      patches: patches.filter((p) => !p.done).map((p) => ({ key: p.key, taken: p.taken, lvl: p.stand.level })),
      robots: robots.map((r) => `${r.role}:${r.state}${r.patch ? '@' + r.patch.key : ''}${r.leaving ? '!' : ''}`),
    }),
    ratePerMin,
    etaSeconds,
  }
}

export { buildFurniture }
