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
  SITE, YARD, CREWS, RATE, SHIFT_SECONDS, COLORS, WORK_SPACING, MATERIALS,
  toLocal, forRow,
} from './config.js'
import { orders } from './orders.js'
import { PHASES } from './plan.js'
import { route, stanceOf } from './nav.js'
import { buildRobot, buildCarryStack } from './robot.js'
import { buildWheelbarrow, buildFurniture, buildRoller, buildDrawing } from './props.js'

const HIT_GEO = new THREE.CylinderGeometry(0.42, 0.42, 1, 8)
const HIT_MAT = new THREE.MeshBasicMaterial({ visible: false })

/** Gangers get a white hat, the way they do on a real site. */
const LEAD_HAT = 0xf2f5f7
/** How long the gangs stand round the drawing at the start of a shift. */
const BRIEF_SECONDS = 13
/** Where each gang gathers — out on the apron, clear of the working faces. */
const BRIEF_SPOT = {
  mason: { x: -2.8, z: 7.5 },
  barrow: { x: 1.6, z: 8.3 },
  carrier: { x: 5.0, z: 7.4 },
}

/** How close counts as arrived. */
const ARRIVE_EPS = 0.16

const TWO_PI = Math.PI * 2
const wrap = (a) => ((a + Math.PI) % TWO_PI + TWO_PI) % TWO_PI - Math.PI

export function createSim({
  plan, rng, group, origin, stocks, drops, scaffold, truck, supply,
  onPlace, onPaint, onBanner, onStage, onComplete, requestCrew, clock0 = 0,
}) {
  const robots = []
  const hitboxes = []
  const items = plan.items
  const placed = new Uint8Array(items.length)
  const claimed = new Int16Array(items.length).fill(-1)
  const mortarLeft = plan.mortar.map((m) => m.needs)

  /** Site landmarks into plot space. The far row is turned to face the road,
   *  so this is a rotation, not just a subtraction. */
  const L = (p) => { const q = toLocal(origin, p); return { level: 0, x: q.x, y: 0, z: q.z } }
  // gate and muster belong to whichever row this plot is on
  const MUSTER = L(forRow(origin, SITE.muster))
  const GATE = L(forRow(origin, SITE.gate))
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
  const doneLog = [] // { t, w } — every finished task, weighted by how long it takes

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

  function logDone(w) {
    doneLog.push({ t: clockT, w })
    if (doneLog.length > 300) doneLog.shift()
  }

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
        if (o === r || o.claim == null || o.leaving) continue
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

  /**
   * Which lift the scaffold needs to be at for the work now coming up.
   *
   * Once the masonry is done the answer is *not* nothing: the joiners and the
   * decorators still work off it, and it only comes down at handover. Striking
   * it as the last brick goes in left the painters standing in mid-air.
   */
  function decksNeeded() {
    if (stage !== 'build') return 2
    let need = 0
    for (let k = firstOpen; k < Math.min(items.length, firstOpen + 90); k++) {
      const lv = items[k].stand.level
      need = Math.max(need, lv === 'roof' ? 2 : lv)
    }
    return Math.max(need, firstOpen >= items.length ? 2 : 0)
  }

  function setPlaced(i) {
    if (i == null || placed[i]) return
    const it = items[i]
    placed[i] = 1
    claimed[i] = -1
    placedCount++
    phaseDone++
    demand[it.mat]--
    logDone(1)
    onPlace(it)
    if (it.mortar >= 0 && --mortarLeft[it.mortar] === 0) onPlace(plan.mortar[it.mortar], true)
    while (firstOpen < placed.length && placed[firstOpen]) firstOpen++
    if (phaseDone >= phaseCounts[phaseIdx] && phaseIdx < PHASES.length - 1) {
      phaseIdx++
      phaseDone = 0
    }
    scaffold.setDecks(decksNeeded())
    sinceProgress = 0
    if (placedCount >= items.length && stage === 'build') enterStage('fitout')
  }

  function enterStage(next) {
    stage = next
    stageT = 0
    onStage?.(next)
    if (next === 'fitout') {
      scaffold.setDecks(2)
      truck.arrive()
      if (!quiet) onBanner('TOPPED OUT', 'joiners on the way — fitting out', '#8fd14f')
    } else if (next === 'paint') {
      scaffold.setDecks(2)
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
    const want = orders.roles()
    const leadOf = orders.leads(want)
    const spare = (supplied || []).slice()
    const roster = want.map((role, idx) => {
      const i = spare.findIndex((s) => s.role === role)
      if (i < 0) return { role, n: 1, lead: leadOf[idx] }
      const [s] = spare.splice(i, 1)
      return { role, n: 1, lead: s.lead ?? leadOf[idx], rig: s.rig, world: s.world }
    })
    for (const slot of roster) {
      for (let k = 0; k < slot.n; k++, n++) {
        const rig = slot.rig || buildRobot({
          role: slot.role,
          accent: crewDef.accent,
          hatColor: slot.lead ? LEAD_HAT : crewDef.hat,
          lead: !!slot.lead,
          rng,
        })
        // fan the arriving crew out around the gate, whatever size it is
        const spread = (n - (roster.length - 1) / 2) * 0.55
        const start = slot.world
          ? L(slot.world)
          : L(SITE.arrival)
        const r = {
          rig,
          role: slot.role,
          crewId: shiftIndex,
          signedOn: shiftIndex,
          /** Head worker of its trade: white hat, and holds the drawing. */
          lead: !!slot.lead,
          /** Cleared once this one has stood round the drawing this shift. */
          briefed: quiet || atGate === false,
          briefSlot: null,
          /** Set from the follow card: this one stays when its crew goes home. */
          held: false,
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

        // an invisible sleeve so a tap can pick this robot out of the crowd
        const hit = new THREE.Mesh(HIT_GEO, HIT_MAT)
        hit.position.y = rig.height * 0.52
        hit.scale.set(1, rig.height * 1.15, 1)
        hit.userData.robot = r
        rig.group.add(hit)
        r.hit = hit
        hitboxes.push(hit)

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
        // the gang leader's copy of the drawing, held up during the briefing
        if (slot.lead) {
          const drawing = buildDrawing()
          drawing.group.scale.setScalar(0.92)
          drawing.group.position.set(0, 0.06, 0.12)
          rig.handAnchor.add(drawing.group)
          r.drawing = drawing
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
    if (!r.briefed && stage !== 'done') return brief(r)
    if (stage === 'done') return celebrate(r)
    if (r.role === 'foreman') return foreman(r)
    if (stage === 'fitout') return fitter(r)
    if (stage === 'paint') return painter(r)
    if (r.role === 'mason') return mason(r)
    return hauler(r)
  }

  /**
   * The start of a shift: each gang's head worker unrolls the drawing on the
   * apron and the rest of the gang gathers round to look at it before anyone
   * picks up a tool. The foreman stands in with the masons.
   */
  function brief(r) {
    const key = BRIEF_SPOT[r.role] ? r.role : 'mason'
    const spot = BRIEF_SPOT[key]
    // no head worker on site for this trade — nothing to gather round
    if (!r.lead && !robots.some((o) => o.lead && !o.dead && !o.leaving
      && (BRIEF_SPOT[o.role] ? o.role : 'mason') === key)) {
      r.briefed = true
      return think(r)
    }
    const done = () => {
      r.briefed = true
      r.showing = false
      restart(r)
    }
    if (r.lead) {
      return goto(r, { level: 0, x: spot.x, y: 0, z: spot.z }, () => {
        faceTowards(r, spot.x, spot.z + 2)
        r.showing = true
        // the clock on this gang's huddle starts when its leader gets there
        briefEnd[key] = clockT + BRIEF_SECONDS
        wait(r, BRIEF_SECONDS, done)
      })
    }
    // an arc in front of whoever is holding it
    if (r.briefSlot == null) {
      r.briefSlot = briefSeats[key] = (briefSeats[key] ?? -1) + 1
    }
    const a = ((r.briefSlot % 5) - 2) * 0.42
    const rad = 1.5 + (r.briefSlot >= 5 ? 0.95 : 0)
    return goto(r, {
      level: 0,
      x: spot.x + Math.sin(a) * rad,
      y: 0,
      z: spot.z + Math.cos(a) * rad,
    }, () => {
      faceTowards(r, spot.x, spot.z)
      // Stay until the leader has finished with it. Polled rather than timed,
      // because the gang trickles in over several seconds and whoever gets
      // there first should not wander off before the drawing comes out.
      //
      // The cap is not decoration: if that gang's leader never turns up — held
      // over from the last shift, or clocked off on the way in — an uncapped
      // poll leaves the whole gang standing in a field for the rest of the day.
      const giveUp = clockT + BRIEF_SECONDS * 2
      const hold = () => wait(r, 0.6, () => {
        if (clockT >= giveUp) return done()
        if (briefEnd[key] != null && clockT >= briefEnd[key]) return done()
        faceTowards(r, spot.x, spot.z)
        hold()
      })
      hold()
    })
  }
  /** Seats already handed out at each gang's huddle, reset every shift. */
  let briefSeats = {}
  /** When each gang's huddle breaks up. */
  let briefEnd = {}

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
    if (!it || placed[r.claim]) {
      r.claim = null
      return think(r)
    }
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
      r.timer = it.phase === 'secondfix' ? RATE.fixTime : RATE.layTime
      r.layHigh = it.pos[1] - (it.stand.y || 0) > 1.05
      const slot = r.claim
      r.then = () => {
        if (!placed[slot]) setPlaced(slot)
        else claimed[slot] = -1
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

  /**
   * Taking the merchant's delivery off the back of the lorry and onto the
   * drops. Two of the shift do this at a time — any more and they are just
   * queueing at the tailgate.
   */
  function unloader(r) {
    const slot = r.unloadSlot
    return goto(r, supply.stand(slot), () => {
      faceTowards(r, supply.stand(slot).x + 2, supply.stand(slot).z)
      wait(r, 0.7, () => {
        const pallet = supply.left > 0 ? supply.takeOne() : null
        if (!pallet) {
          r.unloading = false
          r.unloadSlot = null
          return think(r)
        }
        r.carry = pallet.n
        r.carryMat = pallet.key
        goto(r, dropStand(pallet.key), () => {
          faceTowards(r, YARD.sources[pallet.key].x, YARD.sources[pallet.key].z)
          const d = drops[pallet.key]
          d.setCount(Math.min(d.capacity, d.count + pallet.n * 5))
          r.carry = 0
          r.carryMat = null
          wait(r, 0.8, () => think(r))
        })
      })
    })
  }

  /** How many are already on the tailgate. */
  function unloadingCount() {
    let n = 0
    for (const o of robots) if (o.unloading && !o.dead) n++
    return n
  }

  function hauler(r) {
    // a lorry standing on the plot is the first call on anyone with free hands
    if (r.unloading) {
      if (supply.left > 0 || r.carry > 0) return unloader(r)
      r.unloading = false
      r.unloadSlot = null
    } else if (supply.parked && supply.left > 0 && r.carry === 0 && unloadingCount() < 2) {
      r.unloading = true
      r.unloadSlot = unloadingCount() - 1
      return unloader(r)
    }
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
          logDone(3)
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
        logDone(2)
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
    // How long it has been working on the waypoint it is on. Crowds, corners
    // and the odd geometric trap can leave a robot circling one point forever;
    // rather than try to enumerate every such case, give up on a waypoint that
    // is taking absurdly long and step onto it. One short hop, and the route
    // carries on — far better than a robot walking on the spot all afternoon.
    if (r.path.length === r.wpN) r.wpT = (r.wpT || 0) + dt
    else {
      r.wpN = r.path.length
      r.wpT = 0
    }
    if (r.wpT > 6 && r.path.length) {
      const wp = r.path[0]
      r.pos.set(wp.x, wp.y ?? r.pos.y, wp.z)
      r.stance = wp
      r.path.shift()
      r.wpN = r.path.length
      r.wpT = 0
    }
    if (!r.path.length) {
      r.climbing = false
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
      // Slack on the arrival test. Robots give way to each other now, and with
      // a hair-thin threshold a shoved robot can circle a waypoint forever
      // without ever satisfying it. A corner on the way only has to be got
      // round; only the last waypoint is a place the robot means to stand.
      const eps = r.path.length > 1 ? ARRIVE_EPS * 2.2 : ARRIVE_EPS
      if (dist <= Math.max(step, eps)) {
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

  /**
   * Nobody walks through anybody. Whoever is working holds their ground and
   * the walkers give way round them; two walkers share the push. It is only a
   * nudge — `advance` steers each one straight back onto its path afterwards,
   * so the net effect is people stepping round each other rather than a crowd
   * shoving itself apart.
   */
  const BODY_R = 0.33
  /**
   * On the last few steps toward whatever it is heading for. Nudging a robot
   * here is how you get half a gang circling the same corner of the path graph
   * forever, each one shoved off the mark just as it is about to land — so
   * anyone this close to their next waypoint is left alone until they reach it.
   */
  function landing(r) {
    const wp = r.path[0]
    if (!wp) return false
    return Math.hypot(wp.x - r.pos.x, wp.z - r.pos.z) < 0.7
  }
  /**
   * Move `r` out of the way by `amount`, in the direction (ax, az).
   *
   * Straight backwards is the wrong answer for anyone walking: two robots
   * meeting head-on each get shoved back exactly as hard as they are pushing
   * forward, and both stop dead in the middle of the site for good. So a
   * walker steps *aside* — the shove is turned across its own heading, always
   * to the same side of whoever it is passing, which is what you would do.
   */
  function give(r, ax, az, amount) {
    const wp = r.path[0]
    if (r.state === 'walk' && wp) {
      let hx = wp.x - r.pos.x
      let hz = wp.z - r.pos.z
      const h = Math.hypot(hx, hz)
      if (h > 1e-4) {
        hx /= h
        hz /= h
        // is the shove fighting the way it wants to go?
        if (hx * ax + hz * az < 0.1) {
          // step to the side the other one is not on
          const side = hx * -az - hz * -ax >= 0 ? 1 : -1
          const lx = hz * side
          const lz = -hx * side
          r.pos.x += lx * amount * 1.5
          r.pos.z += lz * amount * 1.5
          return
        }
      }
    }
    r.pos.x += ax * amount
    r.pos.z += az * amount
  }

  function separate(dt) {
    // two relaxation passes: one is not enough when three of them arrive at the
    // same drop at once
    for (let pass = 0; pass < 2; pass++) separatePass(dt)
  }
  function separatePass(dt) {
    for (let i = 0; i < robots.length; i++) {
      const a = robots[i]
      if (a.dead || a.climbing) continue
      for (let j = i + 1; j < robots.length; j++) {
        const b = robots[j]
        if (b.dead || b.climbing) continue
        // different lifts of the scaffold never collide
        if (Math.abs(a.pos.y - b.pos.y) > 0.9) continue
        const aFixed = a.state !== 'walk' || landing(a)
        const bFixed = b.state !== 'walk' || landing(b)
        if (aFixed && bFixed) continue
        let dx = b.pos.x - a.pos.x
        let dz = b.pos.z - a.pos.z
        let d = Math.hypot(dx, dz)
        const min = BODY_R * 2
        if (d > min) continue
        if (d < 1e-4) {
          // exactly on top of each other: pick a side deterministically
          dx = (i % 2 ? 1 : -1) * 0.01
          dz = (j % 2 ? 1 : -1) * 0.01
          d = Math.hypot(dx, dz)
        }
        const push = (min - d) * Math.min(1, dt * 22)
        const wa = aFixed ? 0 : bFixed ? 1 : 0.5
        if (wa > 0) give(a, -dx / d, -dz / d, push * wa)
        if (wa < 1) give(b, dx / d, dz / d, push * (1 - wa))
      }
    }
  }

  // --- shifts --------------------------------------------------------------

  function startShift(first) {
    shiftIndex++
    crew = CREWS[(shiftIndex - 1) % CREWS.length]
    // Arm the briefing before anyone is given orders — spawnCrew sets the new
    // crew thinking, and if the huddle isn't on the books by then they walk
    // straight past it onto the job.
    if (!first && !quiet) {
      briefSeats = {}
      briefEnd = {}
    }
    spawnCrew(crew, !first, first ? null : requestCrew?.())
    if (!first) {
      let kept = 0
      for (const r of robots) {
        if (r.crewId >= shiftIndex || r.leaving) continue
        // Anyone signed on indefinitely just carries their old livery into the
        // new crew rather than walking out of the gate with the rest.
        if (r.held) {
          r.crewId = shiftIndex
          kept++
          continue
        }
        r.leaving = true
        // Give the brick slot back straight away. The robot keeps its own
        // reference so whatever it was part-way through still completes, but
        // it stops holding that patch of wall against the crew coming on.
        if (r.claim != null) claimed[r.claim] = -1
        if (r.state === 'wait' || r.state === 'idle' || r.state === 'inspect') restart(r)
      }
      // gangs read the drawing before they start; not during a fast-forward,
      // where nobody would see it and it would only cost the crew time
      if (!quiet) {
        const sub = kept ? `${crew.name} crew on · ${kept} held over` : `${crew.name} crew on`
        onBanner('SHIFT CHANGE', sub, `#${crew.accent.toString(16).padStart(6, '0')}`)
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

  /**
   * The build must never wedge. Claims are handed round a crew that changes
   * every five minutes, and a robot that clocks off part-way through an
   * awkward corner can leave a slot nobody picks up again. Rather than chase
   * every last ordering case, watch for the wall not moving and shake the
   * claims out: everything is released, everyone re-reads their orders, and
   * the scaffold is put back where the work actually is.
   */
  let sinceProgress = 0
  function unwedge(dt) {
    if (stage !== 'build') {
      sinceProgress = 0
      return
    }
    sinceProgress += dt
    if (sinceProgress < 22) return
    sinceProgress = 0
    claimed.fill(-1)
    for (const r of robots) {
      // Only robots we are actually re-tasking lose their claim — a leaver
      // still part-way through laying one needs its reference to finish.
      if (r.leaving) continue
      r.claim = null
      restart(r)
    }
    scaffold.setDecks(decksNeeded())
  }

  function update(dt) {
    clockT += dt
    stageT += dt
    unwedge(dt)
    sweepClaims(dt)
    if (stage !== 'done' && Math.floor(clockT / SHIFT_SECONDS) + 1 > shiftIndex) startShift(false)
    truck.update(dt)

    supply.update(dt)

    // The drops are filled off the back of the merchant's lorry. This is the
    // backstop for when one is late — without it a missed delivery would stall
    // the build for good, which is a worse failure than a bag of cement
    // appearing on an empty pile.
    for (const m of MATERIALS) {
      const d = drops[m.key]
      if (d.count <= 0 && demand[m.key] > 0) {
        d.restock = (d.restock ?? 0) + dt
        if (d.restock > 40) {
          d.setCount(d.capacity)
          d.restock = 0
        }
      } else d.restock = 0
    }

    separate(dt)

    for (let i = robots.length - 1; i >= 0; i--) {
      const r = robots[i]
      if (r.dead) {
        group.remove(r.rig.group)
        const h = hitboxes.indexOf(r.hit)
        if (h >= 0) hitboxes.splice(h, 1)
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
      a.carry = r.showing ? 1 : r.role === 'barrow' || r.holding ? 0 : r.carry
      a.push = r.role === 'barrow' && stage === 'build' ? 1 : 0
      a.haul = r.holding ? 1 : 0
      a.lay = r.state === 'lay' && !r.layHigh ? 1 : 0
      a.reach = r.state === 'lay' && r.layHigh ? 1 : 0
      a.paint = r.state === 'paint' ? 1 : 0
      a.idle = r.showing ? 0 : r.state === 'wait' || r.state === 'inspect' ? 1 : 0
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
      r.roller.visible = stage === 'paint' && !r.leaving && r.role !== 'foreman' && !r.showing
      if (r.drawing) {
        // unrolls over the first second of the huddle and snaps shut at the end
        const open = r.showing ? Math.min(1, (r.openT = (r.openT ?? 0) + dt * 1.4)) : (r.openT = 0)
        r.drawing.setOpen(open)
      }
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

  /** Weighted units of work getting done per minute, over the last minute or two. */
  function ratePerMin() {
    const win = 100
    const t0 = clockT - win
    let w = 0
    let n = 0
    for (let i = doneLog.length - 1; i >= 0 && doneLog[i].t >= t0; i--) {
      w += doneLog[i].w
      n++
    }
    if (n < 4) {
      const all = doneLog.reduce((a, d) => a + d.w, 0)
      return all > 1 ? (all / Math.max(1, clockT)) * 60 : 0
    }
    return (w / Math.min(win, clockT - (doneLog[0]?.t ?? 0) || win)) * 60
  }

  /**
   * Time to hand-over, not just to topping out: the masonry still to lay, the
   * furniture still on the lorry and the walls still to paint, all weighted by
   * how long each takes.
   */
  function remainingWork() {
    return (items.length - placedCount)
      + (furniture.length - furnDone) * 3
      + (patches.length - paintDone) * 2
  }

  function etaSeconds() {
    if (stage === 'done') return 0
    const remaining = remainingWork()
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
      hitboxes.length = 0
    },
    hitboxes,
    /** What a followed robot is up to, in words. */
    describe(r) {
      const doing = {
        walk: r.holding ? 'carrying furniture' : r.carry > 0 ? `carrying ${r.carry} ${r.carryMat}` : 'walking',
        lay: 'setting a piece',
        set: 'placing furniture',
        paint: 'painting',
        wait: 'waiting',
        inspect: 'looking on',
        wave: 'clocking off',
        idle: 'between jobs',
      }[r.state] || r.state
      return {
        role: r.role, doing, carry: r.carry, mat: r.carryMat, leaving: r.leaving,
        held: r.held, signedOn: r.signedOn, shiftsOn: shiftIndex - r.signedOn + 1,
      }
    },
    /** Sign the followed robot on past its own changeover, or let it go. */
    hold(r, on) {
      if (!r) return false
      r.held = on ?? !r.held
      if (r.held && r.leaving) {
        // caught just as it was walking out — turn it round
        r.leaving = false
        r.crewId = shiftIndex
        restart(r)
      }
      return r.held
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
    furnitureDone: (i) => !!furniture[i]?.done,
    debug: () => ({
      patches: patches.filter((p) => !p.done).map((p) => ({ key: p.key, taken: p.taken, lvl: p.stand.level })),
      robots: robots.map((r) => `${r.role}:${r.state}${r.patch ? '@' + r.patch.key : ''}${r.leaving ? '!' : ''}`),
    }),
    ratePerMin,
    etaSeconds,
  }
}

export { buildFurniture }
