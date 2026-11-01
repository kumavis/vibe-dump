import test from 'node:test'
import assert from 'node:assert/strict'
import { buildTree } from '../../src/editor/tree.js'
import { presetIcon, paletteEntries } from '../../src/editor/palette.js'
import { presetComponents } from '../../src/editor/component-ops.js'
import { seeded, read } from './d-helpers.mjs'

const row = (id, name, parent = '', preset = '') => ({ id, name, parent, preset, groups: [] })
const rows = [row('a', 'Alpha'), row('b', 'beta', 'a'), row('c', 'Gamma', 'b', 'sheep'), row('d', 'Delta', 'missing'), row('e', 'echo', 'a')]

test('buildTree: nests by parent, sorts by name, puts orphans at the root', () => {
  const t = buildTree(rows)
  assert.deepEqual(t.map((x) => [x.row.id, x.depth]), [['a', 0], ['b', 1], ['c', 2], ['e', 1], ['d', 0]])
  assert.equal(t[0].hasChildren, true); assert.equal(t[2].hasChildren, false)
})

test('buildTree: collapsed nodes hide their subtree; a search shows matches with their ancestors, opened', () => {
  assert.deepEqual(buildTree(rows, { collapsed: new Set(['a']) }).map((x) => x.row.id), ['a', 'd'])
  const s = buildTree(rows, { query: 'sheep', collapsed: new Set(['a']) })
  assert.deepEqual(s.map((x) => [x.row.id, x.match]), [['a', false], ['b', false], ['c', true]])
  assert.deepEqual(buildTree(rows, { query: 'ECH' }).map((x) => x.row.id), ['a', 'e'])
})

test('buildTree: a parent cycle in the data cannot loop the walk', () => {
  const cyc = [row('x', 'X', 'y'), row('y', 'Y', 'x'), row('z', 'Z')]
  assert.deepEqual(buildTree(cyc).map((x) => x.row.id), ['z'], 'unreachable cycles are dropped (validateOps forbids them anyway)')
})

test('palette: icons from the resolved look; pure bases (creature) are not offered', () => {
  assert.equal(presetIcon({ kind: 'billboard', image: 'emoji:🦖' }), '🦖')
  assert.equal(presetIcon({ kind: 'tree' }), '🌳')
  assert.equal(presetIcon(null), '◻️')
  const h = seeded(); const d = h.doc()
  // as app.js builds it: the preset's own icon (read.presetData) is passed through
  const list = read.docSummary(d).presets.map((n) => { const p = read.presetData(d, n); return { name: n, extends: [p.extends].flat().filter(Boolean), icon: p.icon, look: presetComponents(read, d, n).representation ?? null } })
  const e = paletteEntries(list)
  assert.deepEqual(e.map((x) => x.name), ['dog', 'dragon', 'goat', 'horse', 'lamp', 'monkey', 'ox', 'pig', 'rabbit', 'rat', 'rock', 'rooster', 'sheep', 'snake', 'tiger', 'tree', 'trex', 'wizard'])
  assert.equal(read.presetData(d, 'wizard').icon, '🧙', 'the doc keeps a preset icon')
  assert.equal(e.find((x) => x.name === 'wizard').icon, '🧙')
  // the doc's icon wins over the library's: an edited icon shows (no library fallback)
  assert.equal(paletteEntries([{ name: 'trex', extends: [], icon: '🐊', look: { kind: 'rig', model: 'trex' } }])[0].icon, '🐊')
  assert.equal(paletteEntries([{ name: 'trex', extends: [], icon: '', look: { kind: 'rig', model: 'trex' } }], { icons: {} })[0].icon !== '', true, 'a rig with no icon still gets a glyph')
  assert.equal(presetIcon({ kind: 'tree' }, { light: true }), '💡')
  assert.equal(presetIcon({ kind: 'primitive', shape: 'sphere' }), '🪨')
  assert.equal(e.find((x) => x.name === 'trex').icon, '🦖')
})
