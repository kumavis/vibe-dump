// The whole generator, end to end, producing exactly what the renderer needs.

import { HEIGHT_RES, HYDRO_RES } from '../config.js'
import { buildTerrain } from './terrain.js'
import { placeCones, routeAroundCones, finalHeight, packNormals, ambientOcclusion } from './finalize.js'
import { divideLand, boundaryLines, shoreTrail, ahuSites, MOKU } from './division.js'
import { placeSites } from './sites.js'
import { settleSites } from './footing.js'
import { carveTerraces } from './loi.js'
import { layStreams, cutBeds } from './channels.js'
import { regionMap, lineMap, profiles } from './maps.js'
import { cloudNoise } from './cloudnoise.js'

export function generateIsland(seed, progress = () => {}) {
  const T = buildTerrain(seed, progress)
  progress('divide', 0)
  const D = divideLand(T.h, HYDRO_RES, T.route, { target: 26, reefWidth: T.coast.reefWidth })
  const lines = boundaryLines(D.label, HYDRO_RES, D.mokuOf)
  const trail = shoreTrail(T.h, HYDRO_RES)
  const ahu = ahuSites(lines, trail)

  progress('detail', 0)
  // the cones keep off the streams (and the streams go round the one too big
  // to keep off), then the streams as they will be drawn
  const cones = placeCones(T.h, HYDRO_RES, seed, layStreams({ streams: T.streams }, { area: T.route.area, height1024: T.h }))
  routeAroundCones(T.streams, cones, T.h, HYDRO_RES, T.route)
  const laid = layStreams({ streams: T.streams }, { area: T.route.area, height1024: T.h })
  const height = finalHeight(T.h, HYDRO_RES, cones, seed)
  // clean beds before anyone reads the valley floors...
  cutBeds(height, HEIGHT_RES, laid)

  progress('people', 0)
  const sites = placeSites(T, D, height, HEIGHT_RES, ahu, trail, seed, laid)
  carveTerraces(height, sites.loi)
  // ...and once more after the last edit to the ground: no stream climbs
  cutBeds(height, HEIGHT_RES, laid)
  // every building onto the ground as it now is
  settleSites(sites.ground, sites, ahu)
  const region = regionMap(T, D, sites.fieldMask)
  const lineTex = lineMap(lines, trail, HEIGHT_RES)
  const prof = profiles(sites, T, D, region.zone, height, HEIGHT_RES)

  progress('light', 0)
  const ao = ambientOcclusion(height, HEIGHT_RES)
  const normals = packNormals(height, HEIGHT_RES, ao)
  progress('sky', 0)
  const cn = cloudNoise(seed)

  const data = {
    height,
    height1024: T.h,
    normals,
    rain: T.rain,
    sand: T.coast.sand,
    reefWidth: T.coast.reefWidth,
    lagoon: T.coast.lagoon,
    exposure: T.coast.exposure,
    area: T.route.area,
    region: region.rgba,
    lines: lineTex,
    cloudShape: cn.shape,
    cloudDetail: cn.detail,
  }
  const { fieldMask, ground, ...siteMeta } = sites
  const meta = {
    seed,
    cones,
    moku: MOKU,
    ahupuaa: D.info.map((a, k) => ({ ...a, ...siteMeta.ahupuaa[k], profile: prof[a.id] })),
    lines: lines.map((l) => ({ kind: l.kind, a: l.a, b: l.b, pts: l.pts })),
    trail,
    ahu,
    center: D.center,
    cloudSizes: [cn.shapeSize, cn.detailSize],
    sites: { ...siteMeta, ahupuaa: undefined, loi: siteMeta.loi.map(({ cut, ...l }) => l) },
    streams: T.streams.map((s) => ({ area: s.area, mouth: s.mouth, pts: s.pts.map((p) => [p[0], p[1]]) })),
  }
  void fieldMask
  void ground
  const transfer = Object.values(data).map((a) => a.buffer)
  progress('done', 1)
  return { data, meta, transfer }
}
