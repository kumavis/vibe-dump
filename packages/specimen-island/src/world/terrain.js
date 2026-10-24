import * as THREE from 'three'
import { terrainDetail } from './textures.js'
import { clamp, smoothstep } from '../core/mathx.js'

// Terrain mesh, chunked so the camera only draws what is in front of it.
// Vertex colours blend the island's biome weights; a near-white grain texture
// breaks up the gradients up close.

const CHUNKS = 8

const PAL = {
  sand: new THREE.Color('#d8c690'),
  wetSand: new THREE.Color('#a89868'),
  grass: new THREE.Color('#7d9a3c'),
  dryGrass: new THREE.Color('#a8a457'),
  jungle: new THREE.Color('#3f5a22'),
  jungleDark: new THREE.Color('#2e3f1a'),
  swamp: new THREE.Color('#4a5230'),
  highland: new THREE.Color('#7c8450'),
  rock: new THREE.Color('#7d776c'),
  rockDark: new THREE.Color('#5a554d'),
  road: new THREE.Color('#8a6e4a'),
  mud: new THREE.Color('#5a4a34'),
  seabed: new THREE.Color('#c2b37f'),
  reef: new THREE.Color('#6e6a52'), // reef crowns, trench walls: weed-grown rock
  silt: new THREE.Color('#8f8a6c'), // the deep flat beyond the shelf
}

export function buildTerrain(island) {
  const group = new THREE.Group()
  group.name = 'terrain'
  const mat = new THREE.MeshLambertMaterial({ vertexColors: true, map: terrainDetail() })
  const n = island.n
  const per = island.seg / CHUNKS
  const colors = vertexColors(island)
  const normals = vertexNormals(island)
  for (let cz = 0; cz < CHUNKS; cz++) {
    for (let cx = 0; cx < CHUNKS; cx++) {
      const i0 = cx * per
      const j0 = cz * per
      const vw = per + 1
      const pos = new Float32Array(vw * vw * 3)
      const nor = new Float32Array(vw * vw * 3)
      const col = new Float32Array(vw * vw * 3)
      const uv = new Float32Array(vw * vw * 2)
      let k = 0
      for (let j = 0; j < vw; j++) {
        for (let i = 0; i < vw; i++) {
          const gi = i0 + i
          const gj = j0 + j
          const id = gj * n + gi
          const x = island.xOf(gi)
          const z = island.xOf(gj)
          pos[k * 3] = x
          pos[k * 3 + 1] = island.h[id]
          pos[k * 3 + 2] = z
          nor[k * 3] = normals[id * 3]
          nor[k * 3 + 1] = normals[id * 3 + 1]
          nor[k * 3 + 2] = normals[id * 3 + 2]
          col[k * 3] = colors[id * 3]
          col[k * 3 + 1] = colors[id * 3 + 1]
          col[k * 3 + 2] = colors[id * 3 + 2]
          uv[k * 2] = x / 9
          uv[k * 2 + 1] = z / 9
          k++
        }
      }
      // two triangles per quad, matching Island.heightAt
      const index = new Uint32Array(per * per * 6)
      let q = 0
      for (let j = 0; j < per; j++) {
        for (let i = 0; i < per; i++) {
          const a = j * vw + i
          const b = (j + 1) * vw + i
          const c = j * vw + i + 1
          const d = (j + 1) * vw + i + 1
          index[q++] = a
          index[q++] = b
          index[q++] = c
          index[q++] = b
          index[q++] = d
          index[q++] = c
        }
      }
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      geo.setAttribute('normal', new THREE.BufferAttribute(nor, 3))
      geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
      geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
      geo.setIndex(new THREE.BufferAttribute(index, 1))
      geo.computeBoundingSphere()
      const mesh = new THREE.Mesh(geo, mat)
      mesh.receiveShadow = true
      mesh.matrixAutoUpdate = false
      group.add(mesh)
    }
  }
  return group
}

function vertexNormals(island) {
  const n = island.n
  const out = new Float32Array(n * n * 3)
  const c = island.cell
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      const hl = island.h[j * n + Math.max(0, i - 1)]
      const hr = island.h[j * n + Math.min(n - 1, i + 1)]
      const hd = island.h[Math.max(0, j - 1) * n + i]
      const hu = island.h[Math.min(n - 1, j + 1) * n + i]
      const nx = hl - hr
      const nz = hd - hu
      const ny = 2 * c
      const l = Math.hypot(nx, ny, nz)
      const id = (j * n + i) * 3
      out[id] = nx / l
      out[id + 1] = ny / l
      out[id + 2] = nz / l
    }
  }
  return out
}

function vertexColors(island) {
  const n = island.n
  const out = new Float32Array(n * n * 3)
  const tmp = new THREE.Color()
  const acc = new THREE.Color()
  const bed = new THREE.Color()
  const noise = island.noise
  for (let j = 0; j < n; j++) {
    const z = island.xOf(j)
    for (let i = 0; i < n; i++) {
      const x = island.xOf(i)
      const id = j * n + i
      const h = island.h[id]
      const w = island.w
      const jitter = noise.noise(x * 0.05, z * 0.05) * 0.5 + noise.noise(x * 0.21, z * 0.21) * 0.5
      acc.setRGB(0, 0, 0)
      const add = (c, wt) => {
        if (wt <= 0) return
        acc.r += c.r * wt
        acc.g += c.g * wt
        acc.b += c.b * wt
      }
      const lush = clamp(island.moist[id] * 1.4 - 0.2 + jitter * 0.15, 0, 1)
      tmp.copy(PAL.dryGrass).lerp(PAL.grass, lush)
      add(tmp, w.grass[id])
      tmp.copy(PAL.jungle).lerp(PAL.jungleDark, clamp(0.5 + jitter * 0.6, 0, 1))
      add(tmp, w.jungle[id])
      add(PAL.swamp, w.swamp[id])
      add(PAL.highland, w.highland[id])
      tmp.copy(PAL.rock).lerp(PAL.rockDark, clamp(0.5 + jitter, 0, 1))
      add(tmp, w.rock[id])
      tmp.copy(PAL.sand).lerp(PAL.wetSand, 1 - smoothstep(0.2, 1.4, h))
      add(tmp, w.beach[id])
      // river banks and lake shore go muddy
      const rv = island.riverD[id]
      if (rv < 2.2) acc.lerp(PAL.mud, (1 - smoothstep(1, 2.2, rv)) * 0.8 * (1 - 0.75 * island.riverE[id])) // sand at the mouth
      const road = island.road[id]
      if (road > 0) {
        tmp.copy(PAL.road).multiplyScalar(0.9 + jitter * 0.12)
        acc.lerp(tmp, road * 0.92)
      }
      // underwater: fade to sandy seabed
      const depth = island.waterAt(x, z) - h
      if (depth > 0) {
        // sand in the shallows, silt out deep, rock wherever the bed is reef
        // or too steep for sand to lie on
        bed.copy(PAL.seabed).lerp(PAL.silt, smoothstep(14, 26, depth))
        const rocky = Math.max(island.reef[id], smoothstep(0.35, 0.8, island.slope[id])) * smoothstep(3, 6, depth)
        if (rocky > 0) bed.lerp(tmp.copy(PAL.reef).multiplyScalar(0.85 + jitter * 0.3), rocky)
        acc.lerp(bed, clamp(depth / 3, 0, 0.85)).multiplyScalar(1 - clamp(depth / 30, 0, 0.5))
      }
      const v = 1 + jitter * 0.07
      out[id * 3] = acc.r * v * 1.12
      out[id * 3 + 1] = acc.g * v * 1.12
      out[id * 3 + 2] = acc.b * v * 1.12
    }
  }
  return out
}

// A byte texture of water depth over the whole terrain square, so the water
// shader can tint shallows and draw shore foam exactly where land meets sea.
export function depthTexture(island) {
  const n = island.n
  const data = new Uint8Array(n * n)
  for (let id = 0; id < n * n; id++) {
    // the inland sheet's own heights, so its banks read their true (negative)
    // depth and the shore foam sits on the drawn waterline
    const wl = Math.max(island.sea, island.surface[id])
    const d = clamp(wl - island.h[id], -2, 14)
    data[id] = Math.round(((d + 2) / 16) * 255)
  }
  const tex = new THREE.DataTexture(data, n, n, THREE.RedFormat, THREE.UnsignedByteType)
  tex.magFilter = THREE.LinearFilter
  tex.minFilter = THREE.LinearFilter
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping
  tex.needsUpdate = true
  return tex
}

