// Track L: palette icons (design §18.3), search and grid keys
import test from 'node:test'
import assert from 'node:assert/strict'
import { paletteEntries, presetIcon, filterEntries, gridMove, LIBRARY_ICONS } from '../../src/editor/palette.js'

test('paletteEntries: preset.icon first, then the look, then the library icon, then a kind glyph', () => {
  const list = [
    { name: 'own', icon: '🧙', look: { kind: 'billboard', image: 'emoji:🐑' } }, // own icon beats the billboard
    { name: 'bb', look: { kind: 'billboard', image: 'emoji:🐑' } },
    { name: 'rigged', look: { kind: 'rig', model: 'x' } }, // no icon, no library entry: paw
    { name: 'trex', look: { kind: 'rig', model: 'trex' } }, // the library's icon for a rig look
    { name: 'lamp', look: { kind: 'tree' }, light: true },
    { name: 'stone', look: { kind: 'primitive', shape: 'sphere' } },
    { name: 'blank', icon: '   ', look: null }, // a blank icon is no icon
    { name: 'creature', look: null }, // a pure base
    { name: 'kid', extends: ['creature'], look: { kind: 'billboard', image: 'emoji:🐣' } },
  ]
  const e = Object.fromEntries(paletteEntries(list).map((x) => [x.name, x.icon]))
  assert.equal(e.own, '🧙'); assert.equal(e.bb, '🐑'); assert.equal(e.rigged, '🐾'); assert.equal(e.trex, '🦖')
  assert.equal(e.lamp, '💡'); assert.equal(e.stone, '🪨'); assert.equal(e.blank, '◻️'); assert.equal(e.kid, '🐣')
  assert.ok(!('creature' in e), 'pure bases are not offered')
  assert.deepEqual(paletteEntries(list).map((x) => x.name), Object.keys(e).sort())
  assert.equal(paletteEntries([{ name: 'trex', look: { kind: 'rig' } }], { icons: {} })[0].icon, '🐾', 'library icons are injectable')
  assert.equal(LIBRARY_ICONS.sheep, '🐑'); assert.equal(LIBRARY_ICONS.horse, '🐎'); assert.ok(!('creature' in LIBRARY_ICONS))
  assert.equal(presetIcon({ kind: 'rig' }, { fallback: '🐴' }), '🐴')
  assert.equal(presetIcon({ kind: 'billboard', image: 'emoji:🐎' }, { fallback: '🐴' }), '🐎', 'the billboard emoji beats the fallback')
})

test('palette search: every word must match the name, case-insensitive', () => {
  const en = ['horse', 'sheep', 'trex', 'rooster', 'rock'].map((name) => ({ name, icon: '' }))
  assert.equal(filterEntries(en, ''), en)
  assert.deepEqual(filterEntries(en, 'RO').map((x) => x.name), ['rooster', 'rock'])
  assert.deepEqual(filterEntries(en, ' ro  ck ').map((x) => x.name), ['rock'])
  assert.deepEqual(filterEntries(en, 'zebra'), [])
})

test('palette grid keys: arrows move in a cols-wide grid, Up from the first row returns to search', () => {
  assert.equal(gridMove(0, 'ArrowRight', 4, 10), 1)
  assert.equal(gridMove(9, 'ArrowRight', 4, 10), 9)
  assert.equal(gridMove(0, 'ArrowLeft', 4, 10), 0)
  assert.equal(gridMove(1, 'ArrowDown', 4, 10), 5)
  assert.equal(gridMove(7, 'ArrowDown', 4, 10), 7, 'no cell below: stay')
  assert.equal(gridMove(5, 'ArrowUp', 4, 10), 1)
  assert.equal(gridMove(2, 'ArrowUp', 4, 10), -1)
  assert.equal(gridMove(4, 'Home', 4, 10), 0); assert.equal(gridMove(4, 'End', 4, 10), 9)
  assert.equal(gridMove(0, 'ArrowDown', 0, 3), 1, 'cols clamps to 1')
  assert.equal(gridMove(0, 'ArrowRight', 4, 0), -1)
})
