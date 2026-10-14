import { SPECIES, SPECIES_ORDER } from '../data/species.js'
import { ENCOUNTERS } from '../data/encounters.js'
import { Rng } from '../core/rng.js'
import { wrapAngle } from '../core/mathx.js'
import { Creature } from './creature.js'
import { Vitals } from './vitals.js'

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
    // leash (data/encounters.js).
    for (const e of ENCOUNTERS) this.placeEncounter(e, rng)
  }

  placeEncounter(e, rng) {
    const G = this.G
    const isl = G.island
    let view
    if (e.view === 'spawn') {
      const sp = isl.poi.dock.spawn
      view = { x: sp.pos.x, y: sp.pos.y + 1.6, z: sp.pos.z, yaw: sp.yaw }
    } else {
      const st = isl.poi.station
      const x = st.x + Math.sin(st.yaw) * 7
      const z = st.z + Math.cos(st.yaw) * 7
      view = { x, y: G.physics.groundAt(x, z, st.y + 3) + 1.6, z, yaw: null }
    }
    const mid = (e.ring[0] + e.ring[1]) / 2
    const half = (e.ring[1] - e.ring[0]) / 2
    let best = null
    let bestScore = 0
    for (let i = 0; i < 400; i++) {
      // yaw convention: facing `a` looks along (-sin a, -cos a)
      const a = view.yaw == null ? rng.range(-Math.PI, Math.PI) : view.yaw + rng.range(-e.arc, e.arc)
      const r = rng.range(e.ring[0], e.ring[1])
      const x = view.x - Math.sin(a) * r
      const z = view.z - Math.cos(a) * r
      if (!isl.isLand(x, z, -0.6)) continue
      const cover = isl.coverAt(x, z)
      if (cover > e.cover || isl.sample(isl.road, x, z) > 0.3 || isl.sample(isl.slope, x, z) > 0.6) continue
      const trees = Math.min(1, isl.sample(isl.d.canopy, x, z) + isl.sample(isl.d.broadleaf, x, z) + isl.sample(isl.d.palm, x, z))
      if (!G.physics.lineOfSight(view.x, view.y, view.z, x, isl.heightAt(x, z) + e.eye, z)) continue
      let score = (1 - cover) * (1 - 0.8 * trees) * (1 - 0.5 * (Math.abs(r - mid) / half)) * (1 + isl.habitat(x, z, e.like || {}))
      if (view.yaw != null) score *= 1 - 0.5 * (Math.abs(wrapAngle(a - view.yaw)) / e.arc)
      // a POI's yard is fine to stand in, but herds never pick goals there
      if (isl.sample(isl.clear, x, z) > 0.5) score *= 0.6
      score *= 0.9 + rng.next() * 0.2
      if (score > bestScore) {
        bestScore = score
        best = { x, z }
      }
    }
    if (!best) best = { x: view.x - Math.sin(view.yaw ?? 0) * mid, z: view.z - Math.cos(view.yaw ?? 0) * mid }
    return this.addHerd(e.species, best.x, best.z, rng, { count: rng.int(e.count[0], e.count[1]), radius: e.radius })
  }

  // opts: { count, radius } override the species' herd size and home range
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
