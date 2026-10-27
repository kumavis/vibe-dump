// Module hooks for sim/terrain-check.mjs (registered by it, beside the
// oracle's three.js resolution). They count the layout stream's draws: any
// module named util.js that defines `export function mulberry32(seed)` (the
// R0 code's util.js, the working tree's core/util.js) is loaded with that
// function wrapped, so every generator it makes logs { seed, n } into
// globalThis.__layoutDraws while that is an array. The values drawn are
// untouched. With TERRAIN_MUTATE set (the check's --self-test), one named
// edit is applied to the working tree's terrain code (or the smashing that
// walks it, core/actions/move.js's smashAround) as it loads, to show the
// check fails on it.
//
// One edit is always made, to the R0 code's scenery.js (R5_DUST): a dropped
// block's dust takes its height as the drop happens, where R0 read it when
// the fall's tween ended. That is R5's rule (DESIGN §2.3: the view reads the
// block's resting place from the mirror as the collapse is played), and the
// two differ only when a later collapse lowered the block again before its
// first fall ended; globalThis.__dustMoved counts those puffs (of
// globalThis.__dustAll).
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

// --self-test's edits: [file suffix, text, replacement, the seeds to run it
// on (when not 1-25)]
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
  // a wrecker's smashing walks a copy instead of the live list: a log a
  // tree it felled in its path is spared by that sample (the next sample
  // mostly smashes it all the same, from a step further on: the first
  // board where that shows is 88)
  'copy-smash': ['/core/actions/move.js', 'for (const c of G.terrain.chunks) {', 'for (const c of [...G.terrain.chunks]) {', '80-100'],
  // a log's shape a hair off
  'log-shape': ['/core/terrain/terrain.js', 'hz: c.trunkR + 0.05,', 'hz: c.trunkR + 0.051,'],
  // the rubble pile's pieces spill toward the blast, not away
  'rubble-spill': ['/view/terrain.js', 'const ax = from ? (c.shape.x - from.x) : 0', 'const ax = from ? (from.x - c.shape.x) : 0'],
  // a set's spacing rule loosened
  'set-gap': ['/core/terrain/sets.js', 'gap: 2.1,', 'gap: 2.0,'],
  // one draw too many at the end of an obelisk: no chunk, mesh or later
  // draw shows it (the next feature reseeds), so only the draw count can
  // catch it
  'draw-extra': ['/core/terrain/recipes.js', 'if (rng() < 0.7) boulder(T, F, rng, 1.0, 0.4, 0.4)\n}', 'if (rng() < 0.7) boulder(T, F, rng, 1.0, 0.4, 0.4)\n  rng()\n}'],
  // (R7) a block dropped again mid-fall falls by the drop from where it was
  // drawn, as R0's did, a level too high (the boards where a fall is cut
  // and the block stands: 1 and 7)
  'fall-by-drop': ['/view/terrain.js', 'const y0 = m.position.y, y1 = rest', 'const y0 = m.position.y, y1 = y0 - dy'],
  // (R7) a fallen log synced from the chunks lies not quite all the way
  'sync-lie': ['/view/terrain.js', 'topple(g, g.quaternion.clone(), c.look, t.look.trunk)(1)', 'topple(g, g.quaternion.clone(), c.look, t.look.trunk)(0.9)', '1-40'],
  // (R7) a sync keeps a chunk's mesh whatever the chunk now is: a broken
  // one's mesh stays up
  'sync-keeps': ['/view/terrain.js', '(c.alive ? this.shows(item) : !this.shows(item))', 'true'],
  // (R7) an add takes back a broken chunk's item a sync left, which holds
  // no mesh: the chunk, standing on the new table, is never drawn
  'spare-placeholder': ['/view/terrain.js', 'if (spare?.obj && !spare.touched', 'if (spare && !spare.touched'],
  // (R7) a sync sets a dropped block at its height but leaves its item the
  // def it was built from: an add of the block where it first stood takes
  // it back at the height it dropped to (boards 1, 7 and 23) ((F17) the
  // line as F8b's tiles left it: the sync sets the whole place)
  'spare-height': ['/view/terrain.js', '          kept.obj.position.set(c.shape.x, c.shape.y, c.shape.z)\n          kept.c = defOf(c)\n', '          kept.obj.position.set(c.shape.x, c.shape.y, c.shape.z)\n'],
  // (R7a's fixer, round 3) core's adds carry a field the view's copy of
  // defOf lacks (as F7's deck and stair pieces might): no mesh reads it, so
  // only the defs compared catch it
  'def-drift': ['/core/terrain/terrain.js', 'const defOf = (c) => ({ id: c.id, kind: c.kind, shape: { ...c.shape }, look: c.look })', 'const defOf = (c) => ({ id: c.id, kind: c.kind, shape: { ...c.shape }, look: c.look, hp: c.hp })', '1-3'],
  // ── (F7a) the fortified rows (section 6, P-climb) ──
  // a fortification's copy turned by π about the centre, as a feature's is,
  // instead of negated: its places an ulp or so off the exact mirror
  'fort-mirror-turned': ['/core/terrain/recipes.js', 'p: (lx, lz) => ({ x: -(frame.x + c * lx + s * lz), z: -(frame.z - s * lx + c * lz) }),', 'p: (lx, lz) => ({ x: -frame.x + cos(frame.yaw + Math.PI) * lx + sin(frame.yaw + Math.PI) * lz, z: -frame.z - sin(frame.yaw + Math.PI) * lx + cos(frame.yaw + Math.PI) * lz }),', '1-5'],
  // a rampart's colour drawn from Math.random, not the layout stream
  'fort-look-random': ['/core/terrain/recipes.js', 'const color = pick(EARTH, rng)', 'const color = pick(EARTH, Math.random)', '1-3'],
  // a ladder's add leaving its link out of the def the view draws from
  'fort-def-link': ['/core/terrain/terrain.js', 'for (const k of HEIGHT_FIELDS) if (c[k] !== undefined) def[k] = copy(c[k])', "for (const k of HEIGHT_FIELDS) if (c[k] !== undefined && k !== 'link') def[k] = copy(c[k])", '1-3'],
  // the works a quarter inch behind the zone's edge
  'works-off-edge': ['/core/terrain/recipes.js', 'const RAMPART_FACE = 1.125', 'const RAMPART_FACE = 1.375', '1-3'],
  // the facing pieces turned anywhere, not toward the other zone
  'facing-ignored': ['/core/terrain/recipes.js', 'const yaw = S.facing?.includes(name) ?', 'const yaw = false ?', '1-25'],
  // (F17, P-climb's lob rows) a reach that ignores the height: every
  // weapon its printed range from a deck
  'lob-flat': ['/core/actions/shoot.js', '  if (!G.nav.hasHeight || !lobbed(w)) return w.range\n', '  return w.range\n', '1-3'],
  // (F8b, the tiles: terrain-check's last section) a chunk promoted out of
  // its tile leaves the tile as it was: the tile still draws it, and its
  // own mesh too
  'tile-stale': ['/view/terrain.js', '    item.tile = null\n    if (item.obj) item.obj.visible = true\n    this.mark(t)\n', '    item.tile = null\n    if (item.obj) item.obj.visible = true\n', '1-3'],
  // (F8b) a chunk that rests after an event is never taken back into its tile
  'tile-never-back': ['/view/terrain.js', '    if (this.items.get(id) === item) this.tile(item)', '    if (false) this.tile(item)', '1-3'],
  // (F8b) the merge places a part by its own matrix, not its world one: a
  // tree's canopy, a hedge's tufts, drawn about the origin
  'tile-matrix': ['/view/terrain.js', '  geo.applyMatrix4(tmpM.copy(o.matrixWorld))', '  geo.applyMatrix4(tmpM.copy(o.matrix))', '1-3'],
  // (F19a, the powder keg's rows) the keg a tenth of an inch off the centre
  // (no longer its own mirror), a keg's hit points one more than the
  // keg's, and a blast whose rim does the full damage
  'keg-off-centre': ['/core/terrain/recipes.js', '    powderKeg(T, 0, 0, yaw, pick(KEG_WOOD, rng))', '    powderKeg(T, 0.1, 0, yaw, pick(KEG_WOOD, rng))', '1-3'],
  'keg-tougher': ['/core/terrain/recipes.js', "    kind: 'keg', hp: HAZARDS.keg.hp,", "    kind: 'keg', hp: HAZARDS.keg.hp + 1,", '1-3'],
  'blast-rim-full': ['/core/terrain/terrain.js', '    let amount = d < r * 0.6 ? dmg : Math.ceil(dmg / 2)', '    let amount = dmg', '1-3'],
}

// [the R0 text, the edit]: both lines must be found, or the hook throws
// (R7_FALL's are applied after R5_DUST's, to its text)
const R5_DUST = [
  ['const y0 = b.mesh.position.y, y1 = y0 - drop\n', 'const y0 = b.mesh.position.y, y1 = y0 - drop, rest__ = b.shape.y\n'],
  ['this.fx.debris(b.shape.x, b.shape.y - col.style.by / 2, b.shape.z,', 'globalThis.__dustAll = (globalThis.__dustAll ?? 0) + 1\n          if (rest__ !== b.shape.y) globalThis.__dustMoved = (globalThis.__dustMoved ?? 0) + 1\n          this.fx.debris(b.shape.x, rest__ - col.style.by / 2, b.shape.z,'],
]

// One more, R7's (view/terrain.js's collapse): a block dropped again before
// its last fall ended falls on from where it is drawn to its new rest, the
// earlier fall stopping there; R0 dropped it by the drop from where the
// earlier fall had started, so it came to rest a level or more too high,
// and the table as its events built it was no table a snap could build
// (sim/terrain-check.mjs section 5, sim/snap-check.mjs). globalThis.__fallsCut
// counts the falls begun while the block was still falling (of
// globalThis.__fallsAll); the edit keeps its notes on the block's mesh, where
// the check compares nothing but what is drawn.
const R7_FALL = [
  ['const y0 = b.mesh.position.y, y1 = y0 - drop, rest__ = b.shape.y\n', 'globalThis.__fallsAll = (globalThis.__fallsAll ?? 0) + 1\n        if (b.mesh.falling__) globalThis.__fallsCut = (globalThis.__fallsCut ?? 0) + 1\n        const y0 = b.mesh.position.y, y1 = b.shape.y, rest__ = b.shape.y, fall__ = (b.mesh.fall__ = {})\n        b.mesh.falling__ = (b.mesh.falling__ ?? 0) + 1\n'],
  ['tween(0.18 + drop * 0.15, (k) => (b.mesh.position.y = y0 + (y1 - y0) * k), bounce).then(() => {\n', 'tween(0.18 + drop * 0.15, (k) => b.mesh.fall__ === fall__ && (b.mesh.position.y = y0 + (y1 - y0) * k), bounce).then(() => {\n          b.mesh.falling__--\n'],
]

export async function load(url, ctx, next) {
  const r = await next(url, ctx)
  if (r.format !== 'module' || r.source == null) return r
  let src = String(r.source)
  const m = process.env.TERRAIN_MUTATE && MUTATIONS[process.env.TERRAIN_MUTATE]
  if (m && url.endsWith(m[0]) && !url.includes('tails-and-scales-oracle')) {
    if (!src.includes(m[1])) throw new Error(`terrain-hooks: mutation ${process.env.TERRAIN_MUTATE} found nothing to edit in ${url}`)
    src = src.replace(m[1], m[2])
  }
  if (url.endsWith('/scenery.js') && src.includes('collapse(col) {')) {
    for (const [from, to] of R5_DUST) {
      if (!src.includes(from)) throw new Error(`terrain-hooks: R5's dust edit found no "${from.trim()}" in ${url}`)
      src = src.replace(from, to)
    }
    for (const [from, to] of R7_FALL) {
      if (!src.includes(from)) throw new Error(`terrain-hooks: R7's fall edit found no "${from.trim()}" in ${url}`)
      src = src.replace(from, to)
    }
  }
  if (url.endsWith('/util.js') && src.includes(HEAD)) src = src.replace(HEAD, 'function mulberry32__raw(seed) {') + WRAP
  return src === String(r.source) ? r : { ...r, source: src, shortCircuit: true }
}
