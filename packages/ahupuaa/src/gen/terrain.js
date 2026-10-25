// The terrain half of the generator: shape → rain → erosion → valleys → coast.

import { ERODE_RES, HYDRO_RES, CLIMATE_RES } from '../config.js'
import { baseShape } from './island.js'
import { annualRainfall } from './climate.js'
import { evolve } from './erode.js'
import { downsample, upsample, toWorld } from './grid.js'
import { makeSimplex, fbm } from './noise.js'
import { routeWater, traceStreams } from './hydro.js'
import { widenValleys, shapeCoast } from './shape.js'

export function rainfallOn(h, N) {
  return upsample(annualRainfall(downsample(h, N, N / CLIMATE_RES), CLIMATE_RES), CLIMATE_RES, N)
}

export function buildTerrain(seed, progress = () => {}) {
  const NE = ERODE_RES
  const N = HYDRO_RES
  progress('shape', 0)
  const { height, age } = baseShape(NE, seed)
  // Rain decides where the valleys go, so it is computed on the young shields.
  const rain0 = rainfallOn(height, NE)
  const rainW = rain0.map((r) => 2000 * Math.pow(r / 2000, 1.5))
  const jn = makeSimplex(seed + 77)
  const jitter = (n) => {
    const a = new Float32Array(n * n)
    for (let j = 0; j < n; j++) {
      for (let i = 0; i < n; i++) a[j * n + i] = 5 * fbm(jn, toWorld(n, i) / 3, toWorld(n, j) / 3, 3)
    }
    return a
  }
  const levels = [
    [128, 20, 1.6],
    [256, 20, 1.2],
    [512, 20, 1.0],
  ]
  const eroded = evolve(height, age, rainW, NE, levels, jitter, {
    k: 0.01,
    onProgress: (p) => progress('erode', p),
  })

  progress('valleys', 0)
  const h = upsample(eroded, NE, N)
  let rain = rainfallOn(h, N)
  let route = routeWater(h, N, rain)
  widenValleys(h, N, route)
  route = routeWater(h, N, rain)
  let streams = traceStreams(route, N, 2, h)

  progress('coast', 0)
  const coast = shapeCoast(h, N, streams, seed)
  rain = rainfallOn(h, N)
  route = routeWater(h, N, rain)
  streams = traceStreams(route, N, 0.6, h)
  return { h, rain, route, streams, coast }
}
