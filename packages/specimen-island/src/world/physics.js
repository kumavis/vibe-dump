import { SpatialHash } from '../core/spatial.js'

// Collision without a physics engine: the heightfield, plus static cylinders
// (tree trunks, posts, rocks) and yaw-rotated boxes (walls, floors, decks) in a
// spatial hash. Boxes double as floors — anything whose top is within a step
// of your feet is ground, anything taller is a wall.

export class Physics {
  constructor(island) {
    this.island = island
    this.grid = new SpatialHash(16)
    this._tmp = []
  }

  addCylinder(x, z, r, y0, y1, opts = {}) {
    const c = { type: 'cyl', x, z, r, y0, y1, tag: opts.tag || 'static', ref: opts.ref || null, solidFor: opts.solidFor }
    c.minX = x - r
    c.maxX = x + r
    c.minZ = z - r
    c.maxZ = z + r
    this.grid.insert(c, c.minX, c.minZ, c.maxX, c.maxZ)
    return c
  }

  // A box centred at (x, z), half extents hx/hz, rotated by yaw (three.js
  // rotation.y convention), spanning y0..y1.
  addBox(x, z, hx, hz, yaw, y0, y1, opts = {}) {
    const c = {
      type: 'box',
      x,
      z,
      hx,
      hz,
      y0,
      y1,
      cos: Math.cos(yaw),
      sin: Math.sin(yaw),
      walkable: opts.walkable !== false,
      tag: opts.tag || 'static',
      ref: opts.ref || null,
      material: opts.material || null,
      // the roof over a building's walls (structures.js building()): what an
      // animal counts as being indoors under, unlike a bridge deck or a dock
      // it can walk out from under (Creature.indoorsAt)
      roof: !!opts.roof,
    }
    const ex = Math.abs(hx * c.cos) + Math.abs(hz * c.sin)
    const ez = Math.abs(hx * c.sin) + Math.abs(hz * c.cos)
    c.minX = x - ex
    c.maxX = x + ex
    c.minZ = z - ez
    c.maxZ = z + ez
    this.grid.insert(c, c.minX, c.minZ, c.maxX, c.maxZ)
    return c
  }

  remove(c) {
    this.grid.remove(c, c.minX, c.minZ, c.maxX, c.maxZ)
  }

  // world -> box local (x, z)
  toLocal(c, x, z) {
    const dx = x - c.x
    const dz = z - c.z
    return [dx * c.cos - dz * c.sin, dx * c.sin + dz * c.cos]
  }

  nearby(x, z, r) {
    this._tmp.length = 0
    return this.grid.query(x - r, z - r, x + r, z + r, this._tmp)
  }

  // Highest standable surface at (x, z) no higher than maxY.
  groundAt(x, z, maxY = Infinity) {
    let g = this.island.heightAt(x, z)
    const list = this.grid.cellItems(Math.floor(x / 16), Math.floor(z / 16))
    if (!list) return g
    for (const c of list) {
      if (c.type !== 'box' || !c.walkable || c.y1 <= g || c.y1 > maxY) continue
      const [lx, lz] = this.toLocal(c, x, z)
      if (Math.abs(lx) <= c.hx && Math.abs(lz) <= c.hz) g = c.y1
    }
    return g
  }

  // groundAt plus what is underfoot: { y, collider }. The collider is the deck
  // box you stand on (structures give it a `material` for footsteps), or null
  // on bare terrain.
  groundInfo(x, z, maxY = Infinity) {
    let y = this.island.heightAt(x, z)
    let collider = null
    const list = this.grid.cellItems(Math.floor(x / 16), Math.floor(z / 16))
    if (!list) return { y, collider }
    for (const c of list) {
      if (c.type !== 'box' || !c.walkable || c.y1 <= y || c.y1 > maxY) continue
      const [lx, lz] = this.toLocal(c, x, z)
      if (Math.abs(lx) <= c.hx && Math.abs(lz) <= c.hz) {
        y = c.y1
        collider = c
      }
    }
    return { y, collider }
  }

  // Lowest ceiling above y at (x, z) — keeps heads out of roofs. `roofs`:
  // only a building's roof counts, not a deck overhead.
  ceilingAt(x, z, y, roofs = false) {
    let ceil = Infinity
    const list = this.grid.cellItems(Math.floor(x / 16), Math.floor(z / 16))
    if (!list) return ceil
    for (const c of list) {
      if (c.type !== 'box' || c.y0 < y || (roofs && !c.roof)) continue
      const [lx, lz] = this.toLocal(c, x, z)
      if (Math.abs(lx) <= c.hx && Math.abs(lz) <= c.hz) ceil = Math.min(ceil, c.y0)
    }
    return ceil
  }

  // Push a vertical capsule (circle radius r spanning y0..y1) out of static
  // colliders. `pos` is mutated ({x, z}). Returns true if anything was hit.
  collideCircle(pos, r, y0, y1, filter) {
    let hit = false
    for (let iter = 0; iter < 2; iter++) {
      const list = this.nearby(pos.x, pos.z, r + 2)
      for (const c of list) {
        if (c.y1 <= y0 || c.y0 >= y1) continue
        if (filter && !filter(c)) continue
        if (c.type === 'cyl') {
          const dx = pos.x - c.x
          const dz = pos.z - c.z
          const d = Math.hypot(dx, dz)
          const m = r + c.r
          if (d < m) {
            const k = d > 1e-5 ? (m - d) / d : 0
            pos.x += dx * k + (d > 1e-5 ? 0 : m)
            pos.z += dz * k
            hit = true
          }
        } else {
          const [lx, lz] = this.toLocal(c, pos.x, pos.z)
          const cx = Math.max(-c.hx, Math.min(c.hx, lx))
          const cz = Math.max(-c.hz, Math.min(c.hz, lz))
          let px = lx - cx
          let pz = lz - cz
          let d = Math.hypot(px, pz)
          let nlx
          let nlz
          if (d > 1e-5) {
            if (d >= r) continue
            const push = r - d
            nlx = (px / d) * push
            nlz = (pz / d) * push
          } else {
            // centre inside the box: leave by the shallowest face
            const ox = c.hx - Math.abs(lx)
            const oz = c.hz - Math.abs(lz)
            if (ox < oz) {
              nlx = Math.sign(lx || 1) * (ox + r)
              nlz = 0
            } else {
              nlx = 0
              nlz = Math.sign(lz || 1) * (oz + r)
            }
          }
          // local -> world (inverse rotation)
          pos.x += nlx * c.cos + nlz * c.sin
          pos.z += -nlx * c.sin + nlz * c.cos
          hit = true
        }
      }
    }
    return hit
  }

  // Ray against terrain and statics. Returns the nearest hit or null.
  raycast(ox, oy, oz, dx, dy, dz, maxDist, opts = {}) {
    let best = null
    if (opts.statics !== false) best = this.raycastStatics(ox, oy, oz, dx, dy, dz, maxDist, opts.ignoreTag)
    const limit = best ? best.t : maxDist
    if (opts.terrain !== false) {
      const t = this.raycastTerrain(ox, oy, oz, dx, dy, dz, limit)
      if (t !== null && (!best || t < best.t)) {
        best = { t, kind: 'terrain' }
      }
    }
    if (best) {
      best.x = ox + dx * best.t
      best.y = oy + dy * best.t
      best.z = oz + dz * best.t
    }
    return best
  }

  raycastTerrain(ox, oy, oz, dx, dy, dz, maxDist) {
    const isl = this.island
    let t = 0
    let prevT = 0
    let above = oy - isl.heightAt(ox, oz)
    if (above < 0) return 0
    while (t < maxDist) {
      const step = Math.max(0.4, Math.min(6, above * 0.6))
      prevT = t
      t = Math.min(maxDist, t + step)
      const x = ox + dx * t
      const y = oy + dy * t
      const z = oz + dz * t
      above = y - isl.heightAt(x, z)
      if (above < 0) {
        let a = prevT
        let b = t
        for (let i = 0; i < 8; i++) {
          const m = (a + b) / 2
          if (oy + dy * m - isl.heightAt(ox + dx * m, oz + dz * m) < 0) b = m
          else a = m
        }
        return b
      }
      if (t >= maxDist) break
    }
    return null
  }

  raycastStatics(ox, oy, oz, dx, dy, dz, maxDist, ignoreTag) {
    let best = null
    const cell = this.grid.cell
    const stamp = (this._rayStamp = (this._rayStamp || 0) + 1)
    const len2 = Math.hypot(dx, dz)
    const stepT = len2 > 1e-4 ? (cell * 0.5) / len2 : maxDist
    for (let t = 0; t <= maxDist + stepT; t += stepT) {
      const tt = Math.min(t, maxDist)
      const x = ox + dx * tt
      const z = oz + dz * tt
      const list = this.grid.cellItems(Math.floor(x / cell), Math.floor(z / cell))
      if (list) {
        for (const c of list) {
          if (c._ray === stamp) continue
          c._ray = stamp
          if (ignoreTag && c.tag === ignoreTag) continue
          const h = c.type === 'cyl' ? rayCyl(c, ox, oy, oz, dx, dy, dz) : rayBox(c, ox, oy, oz, dx, dy, dz)
          if (h !== null && h <= maxDist && (!best || h < best.t)) best = { t: h, kind: 'static', collider: c }
        }
      }
      if (best && best.t < t) break
      if (tt >= maxDist) break
    }
    return best
  }

  lineOfSight(ax, ay, az, bx, by, bz) {
    const dx = bx - ax
    const dy = by - ay
    const dz = bz - az
    const d = Math.hypot(dx, dy, dz)
    if (d < 0.01) return true
    const hit = this.raycast(ax, ay, az, dx / d, dy / d, dz / d, d - 0.3)
    return !hit
  }
}

function rayCyl(c, ox, oy, oz, dx, dy, dz) {
  const fx = ox - c.x
  const fz = oz - c.z
  const a = dx * dx + dz * dz
  if (a < 1e-8) return null
  const b = 2 * (fx * dx + fz * dz)
  const cc = fx * fx + fz * fz - c.r * c.r
  const disc = b * b - 4 * a * cc
  if (disc < 0) return null
  const s = Math.sqrt(disc)
  let t = (-b - s) / (2 * a)
  if (t < 0) t = (-b + s) / (2 * a)
  if (t < 0) return null
  const y = oy + dy * t
  if (y < c.y0 || y > c.y1) return null
  return t
}

function rayBox(c, ox, oy, oz, dx, dy, dz) {
  const rx = ox - c.x
  const rz = oz - c.z
  const lox = rx * c.cos - rz * c.sin
  const loz = rx * c.sin + rz * c.cos
  const ldx = dx * c.cos - dz * c.sin
  const ldz = dx * c.sin + dz * c.cos
  let tmin = -Infinity
  let tmax = Infinity
  const slab = (o, d, lo, hi) => {
    if (Math.abs(d) < 1e-9) return o >= lo && o <= hi
    let t1 = (lo - o) / d
    let t2 = (hi - o) / d
    if (t1 > t2) {
      const tmp = t1
      t1 = t2
      t2 = tmp
    }
    if (t1 > tmin) tmin = t1
    if (t2 < tmax) tmax = t2
    return tmin <= tmax
  }
  if (!slab(lox, ldx, -c.hx, c.hx)) return null
  if (!slab(oy, dy, c.y0, c.y1)) return null
  if (!slab(loz, ldz, -c.hz, c.hz)) return null
  if (tmax < 0) return null
  return tmin >= 0 ? tmin : 0
}
