// fluid.js — the liquid. A 2-D particle fluid after Clavet, Beaudoin & Poulin,
// "Particle-based Viscoelastic Fluid Simulation" (2005): double-density
// relaxation gives incompressibility plus a surface-tension-ish cling, so the
// liquid climbs walls, sheets off, throws droplets and re-merges — the juice.
//
// Every container is a baked SDF (sdf.js Grid). Dragging a skin feeds its
// acceleration in as an inertial force, so the liquid lags behind the glass.

export const DT = 1 / 120 // fixed substep, seconds
export const MAXNB = 40

export class Fluid {
  constructor(grid, opts = {}) {
    this.grid = grid
    this.w = grid.w
    this.h = grid.h
    const s = (this.s = opts.spacing ?? 8)
    const H = (this.H = s * (opts.reach ?? 2))
    this.max = opts.max ?? 1200
    this.gravity = opts.gravity ?? 1500
    // px of push per unit of over-density. Tuned headless: ~0.1·s / 0.2·s is
    // stable through 6000 px/s² shakes; a near/far ratio past ~2 starts to boil.
    this.k = opts.stiffness ?? s * 0.1
    this.kNear = opts.nearStiffness ?? s * 0.2
    this.sigma = opts.viscosity ?? 0.15   // fraction of approach speed bled per pair
    this.beta = opts.beta ?? 0.0004
    this.friction = opts.friction ?? 0.15
    this.maxSpeed = opts.maxSpeed ?? 1400
    this.tension = opts.tension ?? 0.35  // scale on negative pressure
    this.damp = opts.damping ?? 0.2       // per-second velocity bleed
    this.rP = opts.radius ?? s * 0.45     // collision radius against the glass
    this.splat = opts.splat ?? s * 2       // render kernel radius (goo.js)

    const n = this.max
    this.n = 0
    this.x = new Float32Array(n)
    this.y = new Float32Array(n)
    this.px = new Float32Array(n)
    this.py = new Float32Array(n)
    this.vx = new Float32Array(n)
    this.vy = new Float32Array(n)
    this.tint = new Float32Array(n)
    this.heat = new Float32Array(n)   // lava lamp: 0 cold … 1 hot
    this.buoy = new Float32Array(n)   // per-particle gravity multiplier
    this.buoy.fill(1)
    this.rho = new Float32Array(n)
    this.rhoN = new Float32Array(n)

    this.cols = Math.ceil(this.w / H) + 3
    this.rows = Math.ceil(this.h / H) + 3
    this.cellStart = new Int32Array(this.cols * this.rows + 1)
    this.cellFill = new Int32Array(this.cols * this.rows)
    this.cellOf = new Int32Array(n)
    this.sorted = new Int32Array(n)
    this.nbN = new Int32Array(n)
    this.nb = new Int32Array(n * MAXNB)
    this.nbQ = new Float32Array(n * MAXNB)
    this.nbX = new Float32Array(n * MAXNB)
    this.nbY = new Float32Array(n * MAXNB)
    this.hasNb = false

    // rest density from an ideal hex lattice at this spacing
    let rho0 = 0
    for (let j = -5; j <= 5; j++) {
      for (let i = -5; i <= 5; i++) {
        const x = (i + (j & 1) * 0.5) * s
        const y = j * s * 0.866
        const r = Math.hypot(x, y)
        if (r > 0 && r < H) rho0 += (1 - r / H) ** 2
      }
    }
    this.rho0 = rho0 * (opts.cohesion ?? 1)

    this.acc = 0
    this.t = 0
    this.hooks = []   // (fluid) => void, run every substep after relaxation
    this.forces = []  // (fluid, dt) => void, run every substep before advection
    this._n = [0, 0]
  }

  add(x, y, tint = 0) {
    if (this.n >= this.max) return -1
    const i = this.n++
    this.x[i] = this.px[i] = x
    this.y[i] = this.py[i] = y
    this.vx[i] = this.vy[i] = 0
    this.tint[i] = tint
    return i
  }

  // Pack a hex lattice into every spot of the container where keep(x, y).
  fill(keep = () => true, tintOf = () => 0) {
    const s = this.s
    const pad = this.rP + s * 0.15
    for (let j = 0, y = s * 0.5; y < this.h; j++, y += s * 0.866) {
      for (let x = (j & 1) * s * 0.5 + s * 0.25; x < this.w; x += s) {
        if (this.grid.sample(x, y) < -pad && keep(x, y)) this.add(x, y, tintOf(x, y))
      }
    }
    return this
  }

  // Fill to a given fraction of the container's height (by inside area).
  fillTo(level, tintOf) {
    return this.fill((x, y) => y > level, tintOf)
  }

  // Let a freshly packed lattice sag under gravity with heavy damping, so the
  // first frame shows calm liquid instead of a boiling compression wave.
  settle(seconds = 1.2) {
    const d = this.damp
    this.damp = 12
    for (let t = 0; t < seconds; t += DT) this.substep(0, 0)
    this.damp = d
    this.vx.fill(0)
    this.vy.fill(0)
    return this
  }

  // Advance by real time; ax, ay are the container's acceleration (px/s²).
  step(dt, ax = 0, ay = 0) {
    this.acc = Math.min(this.acc + dt, DT * 4)
    let k = 0
    while (this.acc >= DT) {
      this.acc -= DT
      this.substep(ax, ay)
      k++
    }
    return k
  }

  substep(ax, ay) {
    const { n, x, y, px, py, vx, vy, buoy } = this
    this.t += DT
    const gx = -ax
    const gy = this.gravity - ay
    const damp = Math.exp(-this.damp * DT)

    for (let i = 0; i < n; i++) {
      vx[i] = (vx[i] + gx * DT) * damp
      vy[i] = (vy[i] + gy * buoy[i] * DT) * damp
    }
    for (const f of this.forces) f(this, DT)

    if (this.hasNb && (this.sigma > 0 || this.beta > 0)) this.viscosity()

    const cap = this.maxSpeed
    for (let i = 0; i < n; i++) {
      let ux = vx[i], uy = vy[i]
      const sp = Math.hypot(ux, uy)
      if (sp > cap) { ux *= cap / sp; uy *= cap / sp; vx[i] = ux; vy[i] = uy }
      px[i] = x[i]
      py[i] = y[i]
      x[i] += ux * DT
      y[i] += uy * DT
    }

    this.buildGrid()
    this.findNeighbors()
    this.relax()
    for (const h of this.hooks) h(this)
    this.collide()

    const inv = 1 / DT
    for (let i = 0; i < n; i++) {
      let ux = (x[i] - px[i]) * inv, uy = (y[i] - py[i]) * inv
      const sp = ux * ux + uy * uy
      if (sp > cap * cap) { const f = cap / Math.sqrt(sp); ux *= f; uy *= f }
      vx[i] = ux
      vy[i] = uy
    }
  }

  cellIndex(xx, yy) {
    let cx = Math.floor(xx / this.H) + 1
    let cy = Math.floor(yy / this.H) + 1
    if (cx < 0) cx = 0; else if (cx >= this.cols) cx = this.cols - 1
    if (cy < 0) cy = 0; else if (cy >= this.rows) cy = this.rows - 1
    return cy * this.cols + cx
  }

  buildGrid() {
    const { n, x, y, cellStart, cellFill, cellOf, sorted } = this
    const cells = this.cols * this.rows
    cellStart.fill(0)
    for (let i = 0; i < n; i++) {
      const c = this.cellIndex(x[i], y[i])
      cellOf[i] = c
      cellStart[c + 1]++
    }
    for (let c = 0; c < cells; c++) cellStart[c + 1] += cellStart[c]
    cellFill.set(cellStart.subarray(0, cells))
    for (let i = 0; i < n; i++) sorted[cellFill[cellOf[i]]++] = i
  }

  findNeighbors() {
    const { n, x, y, H, cols, cellStart, cellOf, sorted, nbN, nb, nbQ, nbX, nbY } = this
    const H2 = H * H
    for (let i = 0; i < n; i++) {
      const xi = x[i], yi = y[i]
      const c = cellOf[i]
      let cnt = 0
      const base = i * MAXNB
      for (let oy = -cols; oy <= cols; oy += cols) {
        for (let ox = -1; ox <= 1; ox++) {
          const cc = c + oy + ox
          if (cc < 0 || cc >= cellStart.length - 1) continue
          for (let k = cellStart[cc], e = cellStart[cc + 1]; k < e; k++) {
            const j = sorted[k]
            if (j === i) continue
            const dx = x[j] - xi, dy = y[j] - yi
            const r2 = dx * dx + dy * dy
            if (r2 >= H2 || cnt >= MAXNB) continue
            const r = Math.sqrt(r2)
            const o = base + cnt++
            nb[o] = j
            nbQ[o] = 1 - r / H
            if (r > 1e-4) { nbX[o] = dx / r; nbY[o] = dy / r }
            else { const a = Math.random() * 6.283; nbX[o] = Math.cos(a); nbY[o] = Math.sin(a) }
          }
        }
      }
      nbN[i] = cnt
    }
    this.hasNb = true
  }

  // Double-density relaxation: far pressure keeps the bulk at rest density,
  // near pressure stops clumping and gives droplets their round cling.
  relax() {
    const { n, x, y, nbN, nb, nbQ, nbX, nbY, rho, rhoN, k, kNear, rho0 } = this
    for (let i = 0; i < n; i++) {
      let d = 0, dn = 0
      const base = i * MAXNB
      for (let m = 0, e = nbN[i]; m < e; m++) {
        const q = nbQ[base + m]
        const q2 = q * q
        d += q2
        dn += q2 * q
      }
      rho[i] = d
      rhoN[i] = dn
    }
    const lim = this.H * 0.2
    const tens = this.tension
    for (let i = 0; i < n; i++) {
      // attraction (under-density) is kept weak: strong tension pulls the
      // liquid into ropes instead of letting it break into droplets
      let P = rho[i] - rho0
      P = P > 0 ? k * P : k * tens * P
      const PN = kNear * rhoN[i]
      const base = i * MAXNB
      let dx = 0, dy = 0
      for (let m = 0, e = nbN[i]; m < e; m++) {
        const o = base + m
        const q = nbQ[o]
        let D = (P * q + PN * q * q) * 0.5
        if (D > lim) D = lim; else if (D < -lim) D = -lim
        const j = nb[o]
        const ux = nbX[o] * D, uy = nbY[o] * D
        x[j] += ux
        y[j] += uy
        dx -= ux
        dy -= uy
      }
      x[i] += dx
      y[i] += dy
    }
  }

  viscosity() {
    const { n, vx, vy, nbN, nb, nbQ, nbX, nbY, sigma, beta } = this
    for (let i = 0; i < n; i++) {
      const base = i * MAXNB
      for (let m = 0, e = nbN[i]; m < e; m++) {
        const o = base + m
        const j = nb[o]
        if (j < i) continue
        const ux = nbX[o], uy = nbY[o]
        const u = (vx[i] - vx[j]) * ux + (vy[i] - vy[j]) * uy
        if (u <= 0) continue
        let I = nbQ[o] * (sigma * u + beta * u * u) * 0.5
        if (I > u * 0.5) I = u * 0.5
        vx[i] -= I * ux; vy[i] -= I * uy
        vx[j] += I * ux; vy[j] += I * uy
      }
    }
  }

  collide() {
    const { n, x, y, px, py, grid, rP, friction } = this
    const nrm = this._n
    const W = this.w, Hh = this.h
    for (let i = 0; i < n; i++) {
      if (x[i] < 0) x[i] = 0; else if (x[i] > W) x[i] = W
      if (y[i] < 0) y[i] = 0; else if (y[i] > Hh) y[i] = Hh
      const d = grid.sample(x[i], y[i]) + rP
      if (d <= 0) continue
      grid.normal(x[i], y[i], nrm)
      const nx = nrm[0], ny = nrm[1]
      x[i] -= nx * d
      y[i] -= ny * d
      // wall friction: shave the tangential part of this substep's travel
      const mx = x[i] - px[i], my = y[i] - py[i]
      const mn = mx * nx + my * ny
      x[i] -= (mx - mn * nx) * friction
      y[i] -= (my - mn * ny) * friction
    }
  }

  // ---- queries + pokes ----------------------------------------------------

  // Indices of particles within r of (cx, cy), written into out; returns count.
  near(cx, cy, r, out) {
    const { x, y, H, cols, rows, cellStart, sorted } = this
    const span = Math.ceil(r / H)
    const ccx = Math.floor(cx / H) + 1, ccy = Math.floor(cy / H) + 1
    const r2 = r * r
    let cnt = 0
    for (let gy = Math.max(0, ccy - span); gy <= Math.min(rows - 1, ccy + span); gy++) {
      for (let gx = Math.max(0, ccx - span); gx <= Math.min(cols - 1, ccx + span); gx++) {
        const c = gy * cols + gx
        for (let k = cellStart[c], e = cellStart[c + 1]; k < e; k++) {
          const j = sorted[k]
          const dx = x[j] - cx, dy = y[j] - cy
          if (dx * dx + dy * dy < r2 && cnt < out.length) out[cnt++] = j
        }
      }
    }
    return cnt
  }

  // Add velocity (px/s) to everything within r, falling off to the rim.
  impulse(cx, cy, r, ivx, ivy) {
    const { n, x, y, vx, vy } = this
    const r2 = r * r
    for (let i = 0; i < n; i++) {
      const dx = x[i] - cx, dy = y[i] - cy
      const d2 = dx * dx + dy * dy
      if (d2 >= r2) continue
      const f = 1 - d2 / r2
      vx[i] += ivx * f
      vy[i] += ivy * f
    }
  }

  // Radial kick outward from a point — a plop.
  burst(cx, cy, r, speed) {
    const { n, x, y, vx, vy } = this
    const r2 = r * r
    for (let i = 0; i < n; i++) {
      const dx = x[i] - cx, dy = y[i] - cy
      const d2 = dx * dx + dy * dy
      if (d2 >= r2) continue
      const d = Math.sqrt(d2) || 1
      const f = (1 - d / r) * speed
      vx[i] += (dx / d) * f
      vy[i] += (dy / d) * f - f * 0.5
    }
  }

  // Highest particle (smallest y) near column x — a cheap surface probe.
  surfaceAt(cx, halfWidth = 12) {
    const { n, x, y } = this
    let best = Infinity
    for (let i = 0; i < n; i++) {
      if (Math.abs(x[i] - cx) < halfWidth && y[i] < best) best = y[i]
    }
    return best
  }
}
