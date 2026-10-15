import { SPECIES, SPECIES_ORDER } from '../data/species.js'
import { ENCOUNTERS } from '../data/encounters.js'
import { Rng } from '../core/rng.js'
import { wrapAngle, yawTo } from '../core/mathx.js'
import { Creature } from './creature.js'
import { Vitals } from './vitals.js'

// is any road's centreline within r of (x, z)?
const nearRoad = (isl, x, z, r) => isl.roads.some((rd) => rd.pts.some(([px, pz]) => Math.abs(px - x) < r && Math.abs(pz - z) < r && Math.hypot(px - x, pz - z) < r))

// The island's population. Every animal has a persistent record; herds near the
// player (or the attract camera) are "loaded" as full Creatures, distant herds
// are simulated cheaply as a drifting centre. Walk away from a darted trike and
// come back — it is still there, still asleep or awake again, as time dictates.

let nextId = 1

export class Ecology {
  constructor(G) {
    this.G = G
    this.herds = []
    this.active = []
    this.loadRadius = 220
    this.unloadRadius = 280
    this.maxActive = 44
    this.focus = { x: 0, z: 0 }
    this.virtualTimer = 0
  }

  populate(seed) {
    const G = this.G
    const isl = G.island
    const rng = new Rng(seed)
    const dock = isl.poi.dock
    for (const id of SPECIES_ORDER) {
      const sp = SPECIES[id]
      for (let h = 0; h < sp.herds; h++) {
        let best = null
        let bestScore = -1
        for (let tries = 0; tries < 260; tries++) {
          const a = rng.range(0, Math.PI * 2)
          const r = Math.sqrt(rng.next()) * 720
          const x = Math.cos(a) * r
          const z = Math.sin(a) * r
          let score = isl.habitat(x, z, sp.habitat)
          if (score <= 0.15) continue
          if (isl.sample(isl.clear, x, z) > 0.2) continue
          const dDock = Math.hypot(x - dock.x, z - dock.z)
          const minDock = sp.temperament === 'aggressive' ? 380 : sp.mass < 10 ? 70 : 170
          if (dDock < minDock) continue
          if (id === 'tyrannosaurus' && z > -100) continue
          // a herd may wander across a road, but not live on one: the jeep
          // met the east plains trikes head-on on every drive
          if (nearRoad(isl, x, z, 30)) score *= 0.3
          if (sp.nearWater) score *= 1 + 1.5 * Math.exp(-isl.sample(isl.riverM, x, z) / 60) + (Math.hypot(x - isl.lake.x, z - isl.lake.z) < 220 ? 0.8 : 0)
          for (const o of this.herds) {
            const d = Math.hypot(o.home.x - x, o.home.z - z)
            if (o.species === id && d < 260) score *= 0.2
            else if (d < 60) score *= 0.5
          }
          score *= 0.85 + rng.next() * 0.3
          if (score > bestScore) {
            bestScore = score
            best = { x, z }
          }
        }
        if (!best) continue
        this.addHerd(id, best.x, best.z, rng)
      }
    }
    const st = isl.poi.station
    this.addHerd('gallimimus', st.x + 160, st.z - 120, rng)
    // The early encounters used to be a compy gang halfway up the road plus
    // this gallimimus flock (kept as an ordinary herd): both sat in jungle
    // 140-350 m from where the player looks, wandered a 35-40 m home range and
    // bolted at first sight, so most players met nothing until well inland.
    // These are placed in sight of the pier and the station door, on a short
    // leash, and are bold enough to stay in view (data/encounters.js).
    for (const e of ENCOUNTERS) this.placeEncounter(e, rng)
  }

  // Where an encounter is watched from: an eye position and the way it faces.
  viewpoint(name) {
    const G = this.G
    const isl = G.island
    // the player's standing eye height above whatever is underfoot
    const at = (x, z, above, yaw) => ({ x, y: G.physics.groundAt(x, z, above) + 1.63, z, yaw })
    const sp = isl.poi.dock.spawn
    const st = isl.poi.station
    if (name === 'spawn') return at(sp.pos.x, sp.pos.z, sp.pos.y + 0.5, sp.yaw)
    if (name === 'pierFoot') {
      // walk inland from the spawn until the deck gives way to ground
      let x = sp.pos.x
      let z = sp.pos.z
      for (let i = 0; i < 160 && G.physics.groundInfo(x, z, sp.pos.y + 0.5).collider; i++) {
        x -= Math.sin(sp.yaw) * 0.5
        z -= Math.cos(sp.yaw) * 0.5
      }
      return at(x, z, isl.heightAt(x, z) + 1, sp.yaw)
    }
    if (name === 'door') return at(st.x + Math.sin(st.yaw) * 7, st.z + Math.cos(st.yaw) * 7, st.y + 3, st.yaw + Math.PI)
    if (name === 'approach') {
      // the road from the dock, 120 m back down it from the station (the top of
      // the dock yard, where the road comes over the rise), facing up it
      const d = (p, o) => Math.hypot(p[0] - o.x, p[1] - o.z)
      const road = isl.roads.reduce((b, r) => (d(r.pts[0], isl.poi.dock) < d(b.pts[0], isl.poi.dock) ? r : b)).pts
      let i = road.reduce((b, p, k) => (d(p, st) < d(road[b], st) ? k : b), 0)
      for (let left = 120; i > 0 && left > 0; i--) left -= Math.hypot(road[i][0] - road[i - 1][0], road[i][1] - road[i - 1][1])
      const [x, z] = road[i]
      const [nx, nz] = road[i + 1]
      return at(x, z, isl.heightAt(x, z) + 1, Math.atan2(x - nx, z - nz))
    }
    throw new Error(`unknown encounter viewpoint '${name}'`)
  }

  placeEncounter(e, rng) {
    const view = this.viewpoint(e.at)
    const also = (e.also || []).map((n) => this.viewpoint(n))
    // As specified first; if this island has no such spot, a wider ring and
    // scruffier ground, then without the extra viewpoints. Never an unchecked
    // spot: a herd dropped blind can land in the sea or behind a building.
    const passes = [
      { ring: 1, arc: 0, cover: 0, also },
      { ring: 1.3, arc: 0.4, cover: 0.15, also },
      { ring: 1.6, arc: 0.8, cover: 0.3, also: [] },
    ]
    for (const p of passes) {
      const spot = this.findSpot(e, view, p, rng)
      if (!spot) continue
      return this.addHerd(e.species, spot.x, spot.z, rng, { count: rng.int(e.count[0], e.count[1]), radius: e.radius, bold: e.bold })
    }
    console.warn(`encounter ${e.species} at ${e.at}: no open ground in sight, skipped`)
    return null
  }

  // Best-scoring open spot in the ring around `view` that it (and every `also`
  // viewpoint, near the middle of its screen) can see; null if there is none.
  findSpot(e, view, relax, rng) {
    const G = this.G
    const isl = G.island
    const CONE = 0.65 // radians off-centre an `also` viewpoint still frames comfortably
    const r0 = e.ring[0]
    const r1 = e.ring[1] * relax.ring
    const arc = Math.min(Math.PI, e.arc + relax.arc)
    const aim = e.aim || 0
    const mid = (r0 + r1) / 2
    const half = (r1 - r0) / 2
    // the herd mills about its home, so the viewpoint has to see the ground a
    // few metres around it too, not just the one spot (a terrace lip hides half
    // a gang standing a step too far back)
    const foot = e.radius * 0.5
    const around = [[0, 0], [foot, 0], [-foot, 0], [0, foot], [0, -foot]]
    const seen = (v, x, z) => around.every(([ox, oz]) => G.physics.lineOfSight(v.x, v.y, v.z, x + ox, isl.heightAt(x + ox, z + oz) + e.eye, z + oz))
    let best = null
    let bestScore = 0
    for (let i = 0; i < 600; i++) {
      // yaw convention: facing `a` looks along (-sin a, -cos a)
      const off = rng.range(-arc, arc)
      const a = view.yaw + off
      const r = rng.range(r0, r1)
      const x = view.x - Math.sin(a) * r
      const z = view.z - Math.cos(a) * r
      if (!isl.isLand(x, z, -0.6)) continue
      const cover = isl.coverAt(x, z)
      if (cover > e.cover + relax.cover || isl.sample(isl.road, x, z) > 0.3 || isl.sample(isl.slope, x, z) > 0.6) continue
      if (e.offRoad && nearRoad(isl, x, z, e.offRoad)) continue
      if (!seen(view, x, z)) continue
      if (!relax.also.every((v) => Math.abs(wrapAngle(yawTo(v.x, v.z, x, z) - v.yaw)) < CONE && seen(v, x, z))) continue
      const trees = Math.min(1, isl.sample(isl.d.canopy, x, z) + isl.sample(isl.d.broadleaf, x, z) + isl.sample(isl.d.palm, x, z))
      // less undergrowth is better, relative to what this animal can stand in
      let score = (1 - (0.5 * cover) / (e.cover + relax.cover)) * (1 - 0.8 * trees) * (1 - 0.5 * (Math.abs(r - mid) / half)) * (1 + isl.habitat(x, z, e.like || {}))
      score *= 1 - 0.5 * (Math.abs(Math.abs(off) - aim) / arc)
      // a POI's yard is fine to stand in, but herds never pick goals there
      if (isl.sample(isl.clear, x, z) > 0.5) score *= 0.6
      score *= 0.9 + rng.next() * 0.2
      if (score > bestScore) {
        bestScore = score
        best = { x, z }
      }
    }
    return best
  }

  // opts: { count, radius } override the species' herd size and home range;
  // `bold` makes it a habituated herd (data/encounters.js, Brain.think)
  addHerd(id, x, z, rng, opts = {}) {
    const sp = SPECIES[id]
    const n = opts.count ?? rng.int(sp.herd[0], sp.herd[1])
    const herd = {
      id: this.herds.length,
      species: id,
      home: { x, z },
      radius: opts.radius ?? 30 + sp.radius * 18,
      x,
      z,
      goal: { x, z },
      goalTimer: rng.range(5, 20),
      records: [],
      loaded: [],
      alarm: null,
      bold: opts.bold || null,
      rng: rng.fork(this.herds.length + 1),
    }
    for (let i = 0; i < n; i++) {
      const ang = (i / n) * Math.PI * 2 + rng.range(-0.4, 0.4)
      const juvenile = n > 2 && i === n - 1 && rng.chance(0.5)
      const scale = rng.range(sp.scale[0], sp.scale[1]) * (juvenile ? 0.65 : 1)
      herd.records.push({
        id: nextId++,
        species: id,
        herd: herd.id,
        seed: rng.int(1, 1e9),
        scale,
        juvenile,
        offset: { dx: Math.cos(ang) * rng.range(0.6, 1.4), dz: Math.sin(ang) * rng.range(0.6, 1.4) },
        x: x + Math.cos(ang) * sp.radius * 4,
        z: z + Math.sin(ang) * sp.radius * 4,
        yaw: rng.range(-Math.PI, Math.PI),
        hunger: rng.range(0, 0.5),
        science: {},
        scanned: false,
        spotted: false,
        lastSim: 0,
      })
    }
    this.herds.push(herd)
    return herd
  }

  // Where to hunt for a specific animal (relay reveal, tracker tags).
  findSpecies(id) {
    return this.herds.filter((h) => h.species === id)
  }

  update(dt, focus) {
    const G = this.G
    this.focus = focus
    // herd goals drift around their home range
    for (const h of this.herds) {
      h.goalTimer -= dt
      if (h.goalTimer <= 0) {
        h.goalTimer = h.rng.range(18, 45)
        for (let k = 0; k < 8; k++) {
          const a = h.rng.range(0, Math.PI * 2)
          const r = h.rng.range(0, h.radius)
          const gx = h.home.x + Math.cos(a) * r
          const gz = h.home.z + Math.sin(a) * r
          if (G.island.isLand(gx, gz, -0.4) && G.island.sample(G.island.clear, gx, gz) < 0.5) {
            h.goal = { x: gx, z: gz }
            break
          }
        }
      }
      if (h.loaded.length) {
        let sx = 0
        let sz = 0
        for (const c of h.loaded) {
          sx += c.pos.x
          sz += c.pos.z
        }
        h.x = sx / h.loaded.length
        h.z = sz / h.loaded.length
      }
    }

    // virtual herds drift and their records keep metabolising, cheaply
    this.virtualTimer -= dt
    if (this.virtualTimer <= 0) {
      const step = 1
      this.virtualTimer = step
      for (const h of this.herds) {
        if (h.loaded.length) continue
        const sp = SPECIES[h.species]
        const dx = h.goal.x - h.x
        const dz = h.goal.z - h.z
        const d = Math.hypot(dx, dz)
        const anyDown = h.records.some((r) => r.state === 'unconscious')
        if (d > 2 && !anyDown) {
          const m = Math.min(d, sp.speed.walk * 0.6 * step)
          h.x += (dx / d) * m
          h.z += (dz / d) * m
          for (const r of h.records) {
            if (r.state === 'unconscious' || r.state === 'dead') continue
            r.x += (dx / d) * m
            r.z += (dz / d) * m
          }
        }
        for (const r of h.records) {
          if (r.state && r.state !== 'ok' && r.state !== 'dead') {
            const v = new Vitals(sp, r)
            for (const e of v.simulate(step)) {
              if (e.type === 'died') G.events.emit('creature:died', { creature: { species: sp, sp, rec: r, pos: { x: r.x, y: 0, z: r.z } }, cause: e.cause })
            }
          }
        }
      }
    }

    // load / unload around the focus
    for (const h of this.herds) {
      const d = Math.hypot(h.x - focus.x, h.z - focus.z)
      if (!h.loaded.length && d < this.loadRadius && this.active.length + h.records.length <= this.maxActive + 6) this.load(h)
      else if (h.loaded.length && d > this.unloadRadius) this.unload(h)
    }

    for (const c of this.active) c.update(dt)
  }

  load(h) {
    for (const r of h.records) {
      const c = new Creature(this.G, r, h)
      h.loaded.push(c)
      this.active.push(c)
    }
  }

  unload(h) {
    for (const c of h.loaded) {
      c.dispose()
      const i = this.active.indexOf(c)
      if (i >= 0) this.active.splice(i, 1)
    }
    h.loaded.length = 0
  }

  // Nearest creature hit by a ray: { creature, t, zone } or null.
  raycast(o, d, maxDist) {
    let best = null
    for (const c of this.active) {
      const h = c.raycast(o, d, maxDist)
      if (h && (!best || h.t < best.t)) best = { creature: c, t: h.t, zone: h.zone, sphere: h.hit }
    }
    return best
  }

  // Animals within range of a point (science, scanner, map).
  near(x, z, r) {
    return this.active.filter((c) => Math.hypot(c.pos.x - x, c.pos.z - z) < r)
  }
}
