// The island's weather, as a little 2-D atmosphere that moves.
//
// A grid of air columns is blown across the island by the wind (semi-Lagrangian
// advection, stable at any time step). Each column carries water vapour, cloud
// water, and the height its air has been lifted to. Air pushed up the windward
// slopes past the condensation level turns vapour into cloud — the cap that
// sits on the summit and the bank along the windward pali; cloud thick enough
// rains out; air sinking down the lee warms and the cloud evaporates. Over the
// sea, moist blobs carried in on the trades grow little cumulus that sail on
// shore as passing showers. In the afternoon, sun-heated slopes push up
// convective cloud of their own — strongest when the trades drop.
//
// Three weather regimes, with the names Hawaiians use for them:
//   Moaʻe — the trade winds, from the east-northeast, most days of the year
//   Kona  — a southerly storm that soaks the usually dry leeward side
//   Mālie — calm; sea breezes and afternoon clouds build over the mountains

import * as THREE from 'three'
import { WORLD, Y_PER_M, windVector } from '../config.js'
import { makeSimplex, fbm, smoothstep, clamp } from '../gen/noise.js'

export const REGIMES = {
  moae: { name: 'Moaʻe', gloss: 'trade winds', bearing: 62, speed: 8.5, humidity: 1.0, lcl: 650, inversion: 2000, patch: 1.0, convect: 0.55 },
  kona: { name: 'Kona', gloss: 'southerly storm', bearing: 205, speed: 11, humidity: 1.45, lcl: 420, inversion: 3800, patch: 1.6, convect: 0.8 },
  malie: { name: 'Mālie', gloss: 'calm, sea breezes', bearing: 110, speed: 2.4, humidity: 0.85, lcl: 900, inversion: 2900, patch: 0.5, convect: 1.5 },
}

const G = 160 // grid cells per side
const SPAN = WORLD * 1.8 // world units covered (the island sits in the middle)

export class Weather {
  constructor(heightsM, Nh, seed = 7) {
    this.G = G
    this.span = SPAN
    this.cell = SPAN / G
    this.origin = -SPAN / 2
    const NN = G * G
    this.terrain = new Float32Array(NN)
    this.land = new Float32Array(NN)
    this.heat = new Float32Array(NN)
    // smoothed ground under each column
    for (let j = 0; j < G; j++) {
      for (let i = 0; i < G; i++) {
        const x = this.origin + (i + 0.5) * this.cell
        const z = this.origin + (j + 0.5) * this.cell
        let s = 0
        let m = 0
        let n = 0
        for (let dj = -1; dj <= 1; dj++) {
          for (let di = -1; di <= 1; di++) {
            const hx = x + di * this.cell * 0.5
            const hz = z + dj * this.cell * 0.5
            const fi = Math.floor(((hx + WORLD / 2) / WORLD) * Nh)
            const fj = Math.floor(((hz + WORLD / 2) / WORLD) * Nh)
            const v = fi < 0 || fj < 0 || fi >= Nh || fj >= Nh ? -500 : heightsM[fj * Nh + fi]
            s += Math.max(0, v)
            m = Math.max(m, v)
            n++
          }
        }
        const c = j * G + i
        this.terrain[c] = s / n
        this.land[c] = m > 0 ? 1 : 0
      }
    }
    this.qv = new Float32Array(NN).fill(1)
    this.qc = new Float32Array(NN)
    this.zp = new Float32Array(NN)
    this.rain = new Float32Array(NN)
    this.wet = new Float32Array(NN)
    this.conv = new Float32Array(NN)
    this.tmp = [new Float32Array(NN), new Float32Array(NN), new Float32Array(NN), new Float32Array(NN), new Float32Array(NN)]
    this.noise = makeSimplex(seed)
    this.noise2 = makeSimplex(seed + 1)

    // live state, eased toward the regime's targets
    this.mode = 'auto'
    this.regime = 'moae'
    this.state = { ...REGIMES.moae }
    this.wind = new THREE.Vector2(...windVector(62)).multiplyScalar(8.5)
    this.windOffset = new THREE.Vector2() // accumulated travel, for the 3-D cloud noise
    this.simTime = 0
    this.nextChange = 3600 * 30
    this.rainTotal = 0

    this.data = new Float32Array(NN * 4)
    this.texture = new THREE.DataTexture(this.data, G, G, THREE.RGBAFormat, THREE.FloatType)
    this.texture.minFilter = THREE.LinearFilter
    this.texture.magFilter = THREE.LinearFilter
    this.texture.wrapS = this.texture.wrapT = THREE.ClampToEdgeWrapping
    this.texture.needsUpdate = true
    this.rect = new THREE.Vector4(this.origin, this.origin, SPAN, SPAN)
    this.accum = 0
    this.boost = 0 // the tour's rain stop asks for a wetter afternoon
  }

  setMode(mode) {
    this.mode = mode
    if (mode !== 'auto') this.regime = mode
  }

  /** Season-aware regime changes when on auto. */
  pickRegime(season) {
    const r = Math.random()
    if (season === 'hooilo') {
      // winter: trades less steady; Kona lows and calm spells more common
      return r < 0.62 ? 'moae' : r < 0.8 ? 'malie' : 'kona'
    }
    return r < 0.86 ? 'moae' : r < 0.97 ? 'malie' : 'kona'
  }

  /** Advance by `dtSim` simulated seconds. `sunY` drives daytime heating. */
  step(dtSim, sunY, hour, season, force = false) {
    if (dtSim <= 0) return
    this.simTime += dtSim
    if (this.mode === 'auto' && this.simTime > this.nextChange) {
      this.regime = this.pickRegime(season)
      const dur = this.regime === 'moae' ? 30 + Math.random() * 60 : this.regime === 'kona' ? 14 + Math.random() * 20 : 10 + Math.random() * 16
      this.nextChange = this.simTime + dur * 3600
    }
    // ease the regime parameters (over ~2 simulated hours)
    const target = REGIMES[this.regime]
    const k = 1 - Math.exp(-dtSim / 7200)
    const s = this.state
    for (const key of ['speed', 'humidity', 'lcl', 'inversion', 'patch', 'convect']) {
      let goal = target[key]
      if (this.boost && key === 'humidity') goal *= 1.18
      if (this.boost && key === 'patch') goal *= 1.6
      s[key] += (goal - s[key]) * k
    }
    let db = target.bearing - s.bearing
    db = ((db + 540) % 360) - 180
    s.bearing += db * k
    // trades freshen in the afternoon and ease at night; gusty wobble
    const diurnal = 1 + 0.18 * Math.sin(((hour - 9) / 24) * Math.PI * 2)
    const wob = 1 + 0.12 * this.noise(this.simTime / 5400, 3.3)
    const bearing = s.bearing + 9 * this.noise(this.simTime / 9000, 7.7)
    const [wx, wz] = windVector(bearing)
    const spd = s.speed * diurnal * wob
    this.wind.set(wx * spd, wz * spd)
    // world units per simulated second
    const ux = (wx * spd) / 100
    const uz = (wz * spd) / 100
    this.windOffset.x += ux * dtSim
    this.windOffset.y += uz * dtSim

    // The grid itself changes slowly, so its physics runs about twelve times a
    // second on the time gathered since, not every frame; the wind offset above
    // keeps the clouds gliding smoothly in between.
    this.pending = (this.pending || 0) + dtSim
    const now = performance.now()
    if (!force && now - (this.lastPhysics || 0) < 80) return
    this.lastPhysics = now
    const dtp = this.pending
    this.pending = 0
    // sub-step so a cell never moves more than ~1.5 cells per step
    const travel = Math.hypot(ux, uz) * dtp
    const n = Math.max(1, Math.min(12, Math.ceil(travel / (this.cell * 1.5))))
    for (let i = 0; i < n; i++) this.substep(dtp / n, ux, uz, sunY)
    this.pack()
  }

  substep(dt, ux, uz, sunY) {
    const N = G
    const cell = this.cell
    const s = this.state
    const [qv2, qc2, zp2, cv2, wt2] = this.tmp
    const bx = (ux * dt) / cell // backtrace, in cells
    const bz = (uz * dt) / cell
    // fresh ocean air arrives with drifting moisture blobs: tomorrow's showers
    const ox = this.windOffset.x
    const oz = this.windOffset.y
    for (let j = 0; j < N; j++) {
      for (let i = 0; i < N; i++) {
        const c = j * N + i
        const fx = i - bx
        const fz = j - bz
        if (fx < 0 || fz < 0 || fx > N - 1 || fz > N - 1) {
          const x = this.origin + (fx + 0.5) * cell - ox
          const z = this.origin + (fz + 0.5) * cell - oz
          // aligned with the wind, so the cumulus arrive in streets
          const wl = Math.hypot(ux, uz) || 1
          const al = (x * ux + z * uz) / wl
          const ac = (-x * uz + z * ux) / wl
          const blob = fbm(this.noise2, al / 60, ac / 24, 3)
          qv2[c] = s.humidity * (1 + s.patch * 0.55 * blob)
          qc2[c] = Math.max(0, blob - 0.05) * 0.75 * s.patch
          zp2[c] = 0
          cv2[c] = 0
          wt2[c] = 0
          continue
        }
        const i0 = Math.min(N - 2, fx | 0)
        const j0 = Math.min(N - 2, fz | 0)
        const tx = fx - i0
        const tz = fz - j0
        const a = j0 * N + i0
        const w00 = (1 - tx) * (1 - tz)
        const w10 = tx * (1 - tz)
        const w01 = (1 - tx) * tz
        const w11 = tx * tz
        qv2[c] = this.qv[a] * w00 + this.qv[a + 1] * w10 + this.qv[a + N] * w01 + this.qv[a + N + 1] * w11
        qc2[c] = this.qc[a] * w00 + this.qc[a + 1] * w10 + this.qc[a + N] * w01 + this.qc[a + N + 1] * w11
        zp2[c] = this.zp[a] * w00 + this.zp[a + 1] * w10 + this.zp[a + N] * w01 + this.zp[a + N + 1] * w11
        cv2[c] = this.conv[a] * w00 + this.conv[a + 1] * w10 + this.conv[a + N] * w01 + this.conv[a + N + 1] * w11
        wt2[c] = this.wet[c] // wetness stays on the ground
      }
    }
    const travelM = Math.hypot(ux, uz) * dt * 100
    const heatK = Math.max(0, sunY) * s.convect
    const lcl = s.lcl
    for (let c = 0; c < N * N; c++) {
      const ground = this.terrain[c]
      let qv = qv2[c]
      let qc = qc2[c]
      const zU = zp2[c]
      // lifted by the land; sinks down the lee at a limited rate
      const z = Math.max(ground, zU - 0.24 * travelM)
      if (z > zU) {
        const lifted = Math.max(0, z - Math.max(zU, lcl))
        const cond = Math.min(qv, qv * lifted / 650)
        qv -= cond
        qc += cond
      } else if (z < zU) {
        const e = Math.min(qc, (zU - z) * (0.0035 * qc + 0.00035))
        qc -= e
        qv += e
      }
      let conv = cv2[c] * Math.exp(-dt / 5400)
      if (this.land[c]) {
        // sun on the slopes builds afternoon cumulus
        const heat = heatK * smoothstep(80, 700, ground) * (1 - 0.6 * smoothstep(0.85, 1.2, s.humidity)) * 0.0000045
        const make = Math.min(qv * 0.2, heat * dt * qv)
        qv -= make
        qc += make
        conv = Math.min(1, conv + heat * dt * 4)
      } else {
        // the sea tops up the air, and a little of it is always cumulus
        qv += (s.humidity - qv) * (1 - Math.exp(-dt / 2400))
        const mk = Math.max(0, qv - s.humidity * 1.12) * dt * 0.00012
        qv -= mk
        qc += mk
      }
      // rain out what's thick enough
      const over = Math.max(0, qc - 0.11)
      const p = over * (1 - Math.exp(-dt / 1500))
      qc -= p
      // and thin cloud slowly frays away
      qc *= Math.exp(-dt / 21600)
      const rate = p / Math.max(dt, 1e-3) * 3600 // per hour
      this.rain[c] = this.rain[c] * 0.6 + rate * 0.4
      // the ground remembers rain for a while
      wt2[c] = clamp(wt2[c] * Math.exp(-dt / (3600 * 5)) + rate * dt / 3600 * 3, 0, 1)
      this.qv[c] = qv
      this.qc[c] = qc
      this.zp[c] = z
      this.conv[c] = conv
      this.wet[c] = wt2[c]
    }
  }

  pack() {
    const d = this.data
    let rainSum = 0
    let maxR = 0
    let maxC = 0
    for (let c = 0; c < G * G; c++) {
      const cover = clamp(this.qc[c] * 4.2, 0, 1)
      d[c * 4] = cover
      const r = clamp(this.rain[c] * 2.2, 0, 1)
      d[c * 4 + 1] = r
      d[c * 4 + 2] = this.wet[c]
      d[c * 4 + 3] = this.conv[c]
      if (this.land[c]) rainSum += r
      const storm = r * (0.4 + this.conv[c])
      if (storm > maxR) {
        maxR = storm
        maxC = c
      }
    }
    this.rainTotal = rainSum
    this.stormiest = { strength: maxR, x: this.origin + ((maxC % G) + 0.5) * this.cell, z: this.origin + (Math.floor(maxC / G) + 0.5) * this.cell }
    this.texture.needsUpdate = true
  }

  /**
   * Seed a shower cell: a disc of cloud water at world (x, z) that rains out
   * as it drifts downwind. The tour uses this to make sure the rain stop has
   * something to show.
   */
  spawnShower(x, z, radius = 6, strength = 0.5) {
    const G0 = this.G
    const ci = (x - this.origin) / this.cell - 0.5
    const cj = (z - this.origin) / this.cell - 0.5
    const R = radius / this.cell
    for (let j = Math.max(0, Math.floor(cj - R)); j <= Math.min(G0 - 1, Math.ceil(cj + R)); j++) {
      for (let i = Math.max(0, Math.floor(ci - R)); i <= Math.min(G0 - 1, Math.ceil(ci + R)); i++) {
        const d = Math.hypot(i - ci, j - cj) / R
        if (d > 1) continue
        const c = j * G0 + i
        const k = (1 - d * d) * strength
        this.qc[c] = Math.max(this.qc[c], 0.12 + k * 0.3)
        this.rain[c] = Math.max(this.rain[c], k * 0.6)
        this.conv[c] = Math.max(this.conv[c], k)
      }
    }
    this.pack()
  }

  /** Spin up from a blank sky so the first frame already has weather in it. */
  warm(hours, sunY, hour, season) {
    for (let t = 0; t < hours * 3600; t += 600) this.step(600, sunY, hour, season, true)
  }

  /** Heights (world Y) of the cloud layer right now. */
  get base() {
    return this.state.lcl * Y_PER_M
  }
  get top() {
    return this.state.inversion * Y_PER_M
  }
}
