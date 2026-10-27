// bake-gloss.js must bake the game's kit figures exactly as view/models/bake.js does. This builds every
// squirrel figure (view/models/squirrel.js) and every serpent figure today (view/models/serpent.js) twice,
// bakes one with bake.js and the other with bake-gloss.js, and compares them node for node: the same
// children in the same order and places, every geometry attribute array equal value for value, the same
// material class and fields. Then it bakes each glossy figure (serpents.js) and checks what baking must
// keep: every triangle, the skin's own vertex colours (not its white material colour) and its plain
// colour, the finishes kept apart.
//   node proto/scales/bake-check.mjs        (from packages/tails-and-scales; exit 1 on a difference)
import * as THREE from 'three'
import { BUILDERS as SQUIRREL } from '../../view/models/squirrel.js'
import { BUILDERS as SERPENT_TODAY } from '../../view/models/serpent.js'
import { bake } from '../../view/models/bake.js'
import { bakeGloss } from './bake-gloss.js'
import { buildSerpent, KEYS } from './serpents.js'
import { triangles } from './shapes.js'

// (the kit's builders draw Math.random, a trebuchet's heap of acorns: both builds of a figure get the
// same stream, so they are the same figure)
function seeded(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
function built(build, seed) {
  const r = Math.random
  Math.random = seeded(seed)
  try {
    return build()
  } finally {
    Math.random = r
  }
}

const FIELDS = ['type', 'vertexColors', 'metalness', 'roughness', 'flatShading', 'emissiveIntensity', 'transparent', 'opacity', 'side']
function same(a, b, path, out) {
  const say = (what) => out.push(`${path}: ${what}`)
  if (a.type !== b.type) return say(`${a.type} vs ${b.type}`)
  for (const k of ['position', 'quaternion', 'scale']) if (!a[k].equals(b[k])) say(`${k} differs`)
  if (a.isMesh) {
    const ga = a.geometry, gb = b.geometry
    const na = Object.keys(ga.attributes).sort().join(), nb = Object.keys(gb.attributes).sort().join()
    if (na !== nb) say(`attributes ${na} vs ${nb}`)
    else for (const k of Object.keys(ga.attributes)) {
      const x = ga.attributes[k].array, y = gb.attributes[k].array
      if (x.length !== y.length || x.some((v, i) => v !== y[i])) say(`attribute ${k} differs`)
    }
    if (!!ga.index !== !!gb.index || (ga.index && ga.index.array.some((v, i) => v !== gb.index.array[i]))) say('index differs')
    const ma = a.material, mb = b.material
    for (const k of FIELDS) if (ma[k] !== mb[k]) say(`material.${k} ${ma[k]} vs ${mb[k]}`)
    for (const k of ['color', 'emissive']) if (ma[k].getHex() !== mb[k].getHex()) say(`material.${k} differs`)
    if (ma.onBeforeCompile.toString() !== mb.onBeforeCompile.toString()) say('material patched')
  }
  if (a.children.length !== b.children.length) return say(`${a.children.length} vs ${b.children.length} children`)
  a.children.forEach((c, i) => same(c, b.children[i], `${path}/${i}`, out))
}

let bad = 0
for (const [kit, builders] of [['squirrel', SQUIRREL], ['serpent (today)', SERPENT_TODAY]]) {
  for (const [key, build] of Object.entries(builders)) {
    // (a first build warms the kit's caches: three draws Math.random for each object it makes, so a build
    // that makes a cached material makes the stream fall differently for what follows)
    built(build, 7)
    const a = built(build, 7), b = built(build, 7)
    bake(a)
    bakeGloss(b)
    const diffs = []
    same(a, b, key, diffs)
    let meshes = 0
    a.traverse((o) => o.isMesh && meshes++)
    console.log(`${kit.padEnd(16)} ${key.padEnd(11)} ${diffs.length ? 'DIFFERS' : 'same'}  (${meshes} baked meshes, ${triangles(a)} triangles)`)
    for (const d of diffs.slice(0, 8)) console.log('   ', d)
    bad += diffs.length
  }
}

// the glossy figures: nothing lost
for (const key of KEYS) {
  for (const detail of [1, 0.3]) {
    const { group } = buildSerpent(key, { detail })
    const before = triangles(group)
    let skinColours = 0
    group.traverse((o) => {
      if (o.isMesh && o.material.userData.shader?.plain) skinColours += o.geometry.attributes.color.count
    })
    bakeGloss(group)
    const after = triangles(group)
    const issues = []
    if (before !== after) issues.push(`${before} triangles became ${after}`)
    let skin = 0, meshes = 0
    const finishes = new Set()
    group.traverse((o) => {
      if (!o.isMesh) return
      meshes++
      finishes.add(o.material)
      const sh = o.material.userData.shader
      if (!sh?.plain) return
      skin++
      const c = o.geometry.attributes.color.array
      if (!o.geometry.attributes.plain) issues.push('a skin class lost its plain colour')
      let white = 0
      for (let i = 0; i < c.length; i += 3) if (c[i] > 0.99 && c[i + 1] > 0.99 && c[i + 2] > 0.99) white++
      if (white > c.length / 30) issues.push(`a skin class is ${Math.round((300 * white) / c.length)}% white`)
    })
    if (skinColours && !skin) issues.push('no skin class')
    console.log(`glossy ${key.padEnd(11)} detail ${String(detail).padEnd(3)} ${issues.length ? 'LOST: ' + issues.join('; ') : 'kept'}  (${meshes} meshes, ${finishes.size} finishes, ${after} triangles)`)
    bad += issues.length
  }
}
// the engine's crew (M13): built at its final 0.72 size with its scales' frequency divided by 0.72, so its
// baked skin carries as many scales per figure as a standalone scaleguard's
{
  const skinOf = (g) => {
    let out = null
    g.traverse((o) => o.isMesh && o.material.userData.shader?.scales && !o.material.userData.shader.uBump?.toString().startsWith('0.16') && (out ??= o))
    return out
  }
  const height = (m) => {
    m.geometry.computeBoundingBox()
    const b = m.geometry.boundingBox
    return b.max.y - b.min.y
  }
  const solo = buildSerpent('scaleguard').group, eng = buildSerpent('engine').group
  bakeGloss(solo)
  bakeGloss(eng)
  const a = skinOf(solo), b = skinOf(eng)
  const per = (m) => m.material.userData.shader.uScaleFreq * height(m)
  const ratio = per(b) / per(a)
  console.log(`engine crew: ${b.material.userData.shader.uScaleFreq.toFixed(1)} cells/unit over a ${height(b).toFixed(3)} tall skin, against a scaleguard's ${a.material.userData.shader.uScaleFreq} over ${height(a).toFixed(3)}: scales per figure ×${ratio.toFixed(3)}`)
  if (Math.abs(ratio - 1) > 0.02) bad++
}
if (bad) {
  console.log(`${bad} differences`)
  process.exit(1)
}
console.log('bake-gloss.js bakes the kit figures exactly as bake.js does, and keeps the glossy ones whole')
