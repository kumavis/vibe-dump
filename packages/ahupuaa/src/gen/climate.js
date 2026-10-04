// Where the rain falls, averaged over the year.
//
// A kinematic upslope model: air off the ocean is marched downwind across the
// island, lifted wherever the ground rises under it. Once it is pushed above the
// condensation level (~650 m — the flat cloud base you see off every windward
// coast) the lift wrings water out of it; the cloud water rains out over a few
// kilometres; and where the air sinks down the lee it warms and the cloud
// evaporates. That one mechanism is the whole windward/leeward contrast: ten
// metres of rain a year on the windward summit, and dry kula a few kilometres
// away on the other side.
//
// The same model, run as a time-stepping grid with weather on top, drives the
// clouds the renderer draws (see weather/sim.js).

import { windVector } from '../config.js'
import { blur, cellSize } from './grid.js'

export const LCL = 650 // m, trade cumulus base
export const INVERSION = 2100 // m, trade-wind inversion

/**
 * Precipitation (relative units) for steady wind from `bearing`, on an N×N grid
 * of terrain heights in metres.
 */
export function upslopeRain(h, N, bearing, opts = {}) {
  const { humidity = 1, fallKm = 4.5, descent = 0.22, lcl = LCL } = opts
  const dxM = cellSize(N) * 100 // metres per cell
  const [wx, wz] = windVector(bearing)
  const ds = 2 // cells upwind per step
  // March cells in order of distance along the wind.
  const order = new Int32Array(N * N)
  const key = new Float32Array(N * N)
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) key[j * N + i] = i * wx + j * wz
  for (let k = 0; k < N * N; k++) order[k] = k
  order.sort((a, b) => key[a] - key[b])

  const zp = new Float32Array(N * N) // parcel height
  const qv = new Float32Array(N * N) // vapour still available to condense
  const qc = new Float32Array(N * N) // cloud water
  const rain = new Float32Array(N * N)
  const fallout = 1 - Math.exp(-(ds * dxM) / (fallKm * 1000))
  const gamma = 1 / 900 // fraction of vapour condensed per metre of lift above LCL
  const evap = 1 / 500

  for (let k = 0; k < N * N; k++) {
    const c = order[k]
    const i = c % N
    const j = (c / N) | 0
    // Upwind state, bilinear; off the grid it is fresh ocean air.
    const fx = i - wx * ds
    const fz = j - wz * ds
    let zU = 0
    let vU = humidity
    let cU = 0
    if (fx >= 0 && fz >= 0 && fx <= N - 1 && fz <= N - 1) {
      const i0 = Math.min(N - 2, fx | 0)
      const j0 = Math.min(N - 2, fz | 0)
      const tx = fx - i0
      const tz = fz - j0
      const a = j0 * N + i0
      const w00 = (1 - tx) * (1 - tz)
      const w10 = tx * (1 - tz)
      const w01 = (1 - tx) * tz
      const w11 = tx * tz
      zU = zp[a] * w00 + zp[a + 1] * w10 + zp[a + N] * w01 + zp[a + N + 1] * w11
      vU = qv[a] * w00 + qv[a + 1] * w10 + qv[a + N] * w01 + qv[a + N + 1] * w11
      cU = qc[a] * w00 + qc[a + 1] * w10 + qc[a + N] * w01 + qc[a + N + 1] * w11
    }
    const ground = Math.max(0, h[c])
    // Forced up instantly where the ground rises; sinks at a limited rate in the
    // lee, so cloud spills a little past the crest before it burns off.
    const z = Math.max(ground, zU - descent * ds * dxM)
    let v = vU
    let q = cU
    if (z > zU) {
      const lifted = Math.max(0, z - Math.max(zU, lcl))
      const cond = Math.min(v, v * lifted * gamma)
      v -= cond
      q += cond
    } else if (z < zU) {
      const e = Math.min(q, (zU - z) * evap * q + (zU - z) * 0.0002)
      q -= e
      v += e
    }
    if (h[c] <= 0) v += (humidity - v) * 0.08 // the sea tops the air back up
    const p = q * fallout
    q -= p
    rain[c] = p
    zp[c] = z
    qv[c] = v
    qc[c] = q
  }
  // Drops drift downwind while they fall, and gusts smear the edges.
  return blur(rain, N, 2, 2)
}

/**
 * Mean annual rainfall in mm on the N×N grid: a mix of trade-wind directions,
 * a little Kona-storm rain on the leeward side, sea-breeze showers on the upper
 * slopes, and the open-ocean background.
 */
export function annualRainfall(h, N) {
  const smooth = blur(h, N, 2, 2)
  const mixes = [
    [62, 0.62, {}],
    [85, 0.14, {}],
    [40, 0.12, {}],
    [205, 0.12, { humidity: 1.3, fallKm: 6 }], // Kona storms: rare, wet, from the south-southwest
    // Trade showers that form offshore and dump on the first land they meet:
    // a shallow lift from the coastline itself, so windward coasts are wet
    // right down to the beach, as Hilo and Kāneʻohe are.
    [62, 0.5, { lcl: 0, fallKm: 2.5, descent: 0.5 }],
  ]
  const total = new Float32Array(N * N)
  for (const [bearing, weight, opts] of mixes) {
    const r = upslopeRain(smooth, N, bearing, opts)
    for (let k = 0; k < N * N; k++) total[k] += r[k] * weight
  }
  let peak = 0
  for (let k = 0; k < N * N; k++) peak = Math.max(peak, total[k])
  const out = new Float32Array(N * N)
  for (let k = 0; k < N * N; k++) {
    const ground = Math.max(0, smooth[k])
    const breeze = 450 * Math.min(1, Math.max(0, (ground - 150) / 900))
    out[k] = 520 + 9600 * (total[k] / peak) + (h[k] > 0 ? breeze : 0)
  }
  return out
}
