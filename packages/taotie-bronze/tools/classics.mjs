#!/usr/bin/env node
// Convert the classic computer-graphics test models into the kit's compact mesh binary (TTM1, see
// src/kit/geometry/skin.js encodeMesh / decodeMesh): quantised 16-bit positions + varint indices.
// Dev-time only; the app loads the committed binaries as bundled assets.
//
//   node tools/classics.mjs suzanne [--src .work/classics-mesh/dl/suzanne]
//   node tools/classics.mjs stanford-dragon [--src .work/classics-mesh/dl/dragon/package/models] [--res 2]
//   node tools/classics.mjs info <file.bin>
//
// Sources (fetch them yourself into .work/classics-mesh/dl/, never commit them):
//   suzanne          Khronos glTF-Sample-Assets Models/Suzanne/glTF/{Suzanne.gltf,Suzanne.bin} (CC0, © 2017 UX3D)
//   stanford-dragon  `npm pack stanford-dragon` (models/dragon_vrip_res*.ply.gz: the Stanford 3D Scanning
//                    Repository's VRIP reconstruction, decimated) — unpack it in the dl folder, do not install it
//
// Downloaded files are parsed as data only (JSON, binary buffers, ASCII PLY numbers).
import { readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { gunzipSync } from 'node:zlib'
import { args, PKG } from './lib.mjs'
import { weldMesh, encodeMesh, decodeMesh, meshBounds } from '../src/kit/geometry/skin.js'

const opt = args()
const what = opt._[0]
const DL = join(PKG, '.work', 'classics-mesh', 'dl')

if (what === 'suzanne') {
  const src = opt.src || join(DL, 'suzanne')
  const gltf = JSON.parse(readFileSync(join(src, 'Suzanne.gltf'), 'utf8'))
  const bin = readFileSync(join(src, gltf.buffers[0].uri.replace(/[^\w.-]/g, '')))
  const prim = gltf.meshes[0].primitives[0]
  const positions = accessor(gltf, bin, prim.attributes.POSITION)
  const indices = accessor(gltf, bin, prim.indices)
  const m = weldMesh({ positions: Float32Array.from(positions), indices: Uint32Array.from(indices) })
  write('suzanne', 'suzanne.bin', m)
} else if (what === 'stanford-dragon') {
  const res = Number(opt.res || 2)
  const src = opt.src || join(DL, 'dragon', 'package', 'models')
  const name = res === 1 ? 'dragon_vrip.ply.gz' : `dragon_vrip_res${res}.ply.gz`
  const m = parsePly(gunzipSync(readFileSync(join(src, name))).toString('latin1'))
  console.log(`${name}: ${m.positions.length / 3} vertices, ${m.indices.length / 3} triangles`)
  write('stanford-dragon', 'dragon.bin', weldMesh(m, 1e-7))
} else if (what === 'info') {
  const buf = readFileSync(opt._[1])
  const m = decodeMesh(new Uint8Array(buf))
  const b = meshBounds(m)
  console.log(`${opt._[1]}: ${buf.length} bytes, ${m.positions.length / 3} vertices, ${m.indices.length / 3} triangles, size ${b.size.map((v) => v.toFixed(4)).join(' × ')}`)
} else {
  console.error('usage: node tools/classics.mjs suzanne | stanford-dragon [--res 2] | info <file>')
  process.exit(1)
}

function write(id, file, m) {
  const ordered = { positions: m.positions, indices: forsyth(m.indices, m.positions.length / 3) }
  const bytes = encodeMesh(ordered)
  const out = join(PKG, 'src', 'artifacts', id, file)
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, bytes)
  // verify the round trip
  const back = decodeMesh(new Uint8Array(readFileSync(out)))
  const b0 = meshBounds(m), b1 = meshBounds(back)
  const err = Math.max(...b0.size) / 65535
  console.log(`wrote ${out.slice(PKG.length + 1)}: ${statSync(out).size} bytes · ${back.positions.length / 3} vertices · ${back.indices.length / 3} triangles · ` +
    `${(((bytes.length - 40 - (back.positions.length / 3) * 6) / back.indices.length)).toFixed(2)} bytes/index · quantum ${err.toExponential(2)} · bbox ${b1.size.map((v) => v.toFixed(4)).join(' × ')}`)
}

function accessor(gltf, bin, i) {
  const a = gltf.accessors[i]
  const v = gltf.bufferViews[a.bufferView]
  const comps = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 }[a.type]
  const off = (v.byteOffset || 0) + (a.byteOffset || 0)
  const n = a.count * comps
  const Ctor = { 5126: Float32Array, 5125: Uint32Array, 5123: Uint16Array, 5121: Uint8Array }[a.componentType]
  if (!Ctor || (v.byteStride && v.byteStride !== comps * Ctor.BYTES_PER_ELEMENT)) throw new Error('unsupported accessor layout')
  const ab = bin.buffer.slice(bin.byteOffset + off, bin.byteOffset + off + n * Ctor.BYTES_PER_ELEMENT)
  return new Ctor(ab)
}

function parsePly(text) {
  const end = text.indexOf('end_header')
  const header = text.slice(0, end).split('\n')
  if (!/^ply/.test(header[0]) || !header.some((l) => /format ascii/.test(l))) throw new Error('expected an ASCII PLY')
  const nv = Number(header.find((l) => l.startsWith('element vertex')).split(/\s+/)[2])
  const nf = Number(header.find((l) => l.startsWith('element face')).split(/\s+/)[2])
  const vprops = []
  let inV = false
  for (const l of header) {
    if (l.startsWith('element')) inV = l.startsWith('element vertex')
    else if (inV && l.startsWith('property')) vprops.push(l.split(/\s+/).pop())
  }
  const xi = vprops.indexOf('x')
  const lines = text.slice(end + 'end_header'.length).split('\n').filter((l) => l.trim())
  const positions = new Float32Array(nv * 3)
  for (let i = 0; i < nv; i++) {
    const f = lines[i].trim().split(/\s+/).map(Number)
    positions[i * 3] = f[xi]; positions[i * 3 + 1] = f[xi + 1]; positions[i * 3 + 2] = f[xi + 2]
  }
  const idx = []
  for (let i = 0; i < nf; i++) {
    const f = lines[nv + i].trim().split(/\s+/).map(Number)
    const k = f[0]
    for (let j = 2; j < k; j++) {
      const a = f[1], b = f[j], c = f[j + 1]
      if (a < nv && b < nv && c < nv) idx.push(a, b, c)
    }
  }
  return { positions, indices: Uint32Array.from(idx) }
}

/** Tom Forsyth's linear-speed vertex cache optimisation (cache 32): triangle order with strong reuse of
 *  recent vertices — so first-use vertex numbering makes the index deltas small (≈ 1 byte each). */
function forsyth(indices, N) {
  const T = indices.length / 3
  const CACHE = 32
  const valence = new Uint32Array(N)
  for (let i = 0; i < indices.length; i++) valence[indices[i]]++
  const start = new Uint32Array(N + 1)
  for (let v = 0; v < N; v++) start[v + 1] = start[v] + valence[v]
  const fill = start.slice(0, N)
  const triOf = new Uint32Array(indices.length)
  for (let t = 0; t < T; t++) for (let k = 0; k < 3; k++) { const v = indices[t * 3 + k]; triOf[fill[v]++] = t }
  const live = valence.slice()
  const cachePos = new Int32Array(N).fill(-1)
  const score = new Float32Array(N)
  const triScore = new Float32Array(T)
  const done = new Uint8Array(T)
  const vScore = (v) => {
    if (live[v] === 0) return -1
    let s = 0
    const p = cachePos[v]
    if (p >= 0) s = p < 3 ? 0.75 : Math.pow(1 - (p - 3) / (CACHE - 3), 1.5)
    return s + 2 * Math.pow(live[v], -0.5)
  }
  for (let v = 0; v < N; v++) score[v] = vScore(v)
  for (let t = 0; t < T; t++) triScore[t] = score[indices[t * 3]] + score[indices[t * 3 + 1]] + score[indices[t * 3 + 2]]
  let cache = []
  const out = new Uint32Array(indices.length)
  let w = 0
  let best = -1
  let scan = 0
  for (let n = 0; n < T; n++) {
    if (best < 0) {
      // no candidate in the cache: take the best remaining triangle (linear scan from a moving cursor)
      let bs = -Infinity
      for (let t = 0; t < T; t++) if (!done[t] && triScore[t] > bs) { bs = triScore[t]; best = t }
      void scan
    }
    const t = best
    done[t] = 1
    const tv = [indices[t * 3], indices[t * 3 + 1], indices[t * 3 + 2]]
    out[w++] = tv[0]; out[w++] = tv[1]; out[w++] = tv[2]
    for (const v of tv) {
      live[v]--
      // remove t from v's live list
      for (let q = start[v]; q < start[v] + live[v] + 1; q++) if (triOf[q] === t) { triOf[q] = triOf[start[v] + live[v]]; triOf[start[v] + live[v]] = t; break }
    }
    cache = [...tv, ...cache.filter((v) => !tv.includes(v))]
    const evicted = cache.length > CACHE ? cache.slice(CACHE) : []
    cache.length = Math.min(cache.length, CACHE)
    for (const v of evicted) cachePos[v] = -1
    cache.forEach((v, i) => (cachePos[v] = i))
    const touched = new Set([...cache, ...evicted])
    best = -1
    let bs = -Infinity
    for (const v of touched) {
      score[v] = vScore(v)
    }
    for (const v of touched) {
      for (let q = start[v]; q < start[v] + live[v]; q++) {
        const u = triOf[q]
        const s = score[indices[u * 3]] + score[indices[u * 3 + 1]] + score[indices[u * 3 + 2]]
        triScore[u] = s
        if (s > bs) { bs = s; best = u }
      }
    }
  }
  return out
}
