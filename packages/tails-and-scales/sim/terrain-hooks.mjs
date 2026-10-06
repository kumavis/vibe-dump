// Module hooks for sim/terrain-check.mjs (registered by it, beside the
// oracle's three.js resolution). They count the layout stream's draws: any
// module named util.js that defines `export function mulberry32(seed)` (the
// R0 code's util.js, the working tree's core/util.js) is loaded with that
// function wrapped, so every generator it makes logs { seed, n } into
// globalThis.__layoutDraws while that is an array. The values drawn are
// untouched. With TERRAIN_MUTATE set (the check's --self-test), one named
// edit is applied to the working tree's terrain code as it loads, to show
// the check fails on it.
const WRAP = `
export function mulberry32(seed) {
  const f = mulberry32__raw(seed)
  const log = globalThis.__layoutDraws
  if (!Array.isArray(log)) return f
  const rec = { seed: seed >>> 0, n: 0 }
  log.push(rec)
  return function () {
    rec.n++
    return f()
  }
}
`
const HEAD = 'export function mulberry32(seed) {'

// --self-test's edits: [file suffix, text, replacement]
export const MUTATIONS = {
  // two layout draws swapped: a boulder's colour before its height
  'draw-order': ['/core/terrain/recipes.js', 'const sy = rr(rng, 0.65, 1.25)\n  const color = pick(STONE, rng)', 'const color = pick(STONE, rng)\n  const sy = rr(rng, 0.65, 1.25)'],
  // one draw dropped: a hedge's berries always skipped
  'draw-dropped': ['/core/terrain/recipes.js', 'if (rng() < 0.4) {\n    // a few berries', 'if (false) {\n    // a few berries'],
  // a look value wrong: the mushroom's tilt sign
  'look': ['/view/terrain.js', 'g.rotation.z = look.tilt', 'g.rotation.z = -look.tilt'],
  // a mesh's material wrong: a crate's band in the box colour
  'material': ['/view/terrain.js', "const band = mesh(BOX, mat('#5f3e24'))", 'const band = mesh(BOX, mat(look.color))'],
  // blast walks the live list instead of a copy
  'live-blast': ['/core/terrain/terrain.js', 'for (const c of [...this.chunks]) {', 'for (const c of this.chunks) {'],
  // a log's shape a hair off
  'log-shape': ['/core/terrain/terrain.js', 'hz: c.trunkR + 0.05,', 'hz: c.trunkR + 0.051,'],
  // the rubble pile's pieces spill toward the blast, not away
  'rubble-spill': ['/view/terrain.js', 'const ax = from ? (c.shape.x - from.x) : 0', 'const ax = from ? (from.x - c.shape.x) : 0'],
  // a set's spacing rule loosened
  'set-gap': ['/core/terrain/sets.js', 'gap: 2.1,', 'gap: 2.0,'],
  // one draw too many at the end of an obelisk: no chunk, mesh or later
  // draw shows it (the next feature reseeds), so only the draw count can
  'draw-extra': ['/core/terrain/recipes.js', 'if (rng() < 0.7) boulder(T, F, rng, 1.0, 0.4, 0.4)\n}', 'if (rng() < 0.7) boulder(T, F, rng, 1.0, 0.4, 0.4)\n  rng()\n}'],
}

export async function load(url, ctx, next) {
  const r = await next(url, ctx)
  if (r.format !== 'module' || r.source == null) return r
  let src = String(r.source)
  const m = process.env.TERRAIN_MUTATE && MUTATIONS[process.env.TERRAIN_MUTATE]
  if (m && url.endsWith(m[0]) && !url.includes('tails-and-scales-oracle')) {
    if (!src.includes(m[1])) throw new Error(`terrain-hooks: mutation ${process.env.TERRAIN_MUTATE} found nothing to edit in ${url}`)
    src = src.replace(m[1], m[2])
  }
  if (url.endsWith('/util.js') && src.includes(HEAD)) src = src.replace(HEAD, 'function mulberry32__raw(seed) {') + WRAP
  return src === String(r.source) ? r : { ...r, source: src, shortCircuit: true }
}
