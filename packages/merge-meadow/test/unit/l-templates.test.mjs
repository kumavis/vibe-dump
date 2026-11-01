// Track L: templates (design §18.2, ARCHITECTURE §7) and the seed delegating to them
import test from 'node:test'
import assert from 'node:assert/strict'
import { Repo } from '@automerge/automerge-repo'
import { TEMPLATES, TEMPLATE_ORDER, templateOps, templateEntities, presetOrder, yawToward, libraryPresets, isTemplate, STARTER } from '../../src/doc/templates.js'
import { seedOps, seedDoc } from '../../src/doc/seed.js'
import { validateOps } from '../../src/doc/ops-validate.js'
import { applyOps } from '../../src/doc/ops.js'
import { PRESETS } from '../../src/doc/presets.js'
import { ZOO_PRESETS } from '../../src/doc/presets-zoo.js'
import { MODEL_LIBRARY } from '../../src/doc/models.js'
import * as read from '../../src/doc/read.js'
import { KINDS } from '../../src/render/kinds/index.js'

const repo = new Repo({ network: [] })
const ZOO_ANIMALS = ['rabbit', 'goat', 'pig', 'dog', 'rooster']
// does `name`'s chain reach `creature`?
const isCreature = (doc, preset) => read.presetData(doc, preset)?.chain?.includes('creature')

test('templates: the two the launcher offers, with title, description and icon', () => {
  assert.deepEqual(Object.keys(TEMPLATES).sort(), ['blank', 'meadow'])
  assert.equal(TEMPLATES.blank.title, 'Blank meadow'); assert.equal(TEMPLATES.blank.icon, '🟩')
  assert.equal(TEMPLATES.meadow.title, 'Animal meadow'); assert.equal(TEMPLATES.meadow.icon, '🦖')
  for (const t of Object.values(TEMPLATES)) assert.ok(t.description.length > 10)
  assert.deepEqual([...TEMPLATE_ORDER].sort(), ['blank', 'meadow'])
  assert.ok(isTemplate('meadow') && !isTemplate('__proto__') && !isTemplate('toString'))
  assert.throws(() => templateOps('nope'), /unknown template/)
})

for (const name of ['blank', 'meadow']) {
  test(`templateOps(${name}): validates on a fresh doc and applies through the one write path`, () => {
    const ops = templateOps(name, { title: 'T' })
    assert.ok(ops.length < 2000)
    const h = repo.create()
    assert.doesNotThrow(() => validateOps(h.doc(), ops, { kinds: KINDS }))
    applyOps(h, ops, { kinds: KINDS })
    const d = h.doc()
    const s = read.docSummary(d)
    assert.equal(s.title, 'T')
    // the same library either way: defs, presets (core + zoo, with icons), models
    const lib = libraryPresets()
    assert.deepEqual(s.presets, Object.keys(lib).sort())
    for (const p of Object.keys(PRESETS)) assert.ok(s.presets.includes(p), p)
    for (const p of Object.keys(ZOO_PRESETS)) assert.ok(s.presets.includes(p), p)
    for (const m of Object.keys(MODEL_LIBRARY)) assert.ok(d.models[m], `model ${m}`)
    assert.equal(String(d.presets.trex.icon), '🦖')
    assert.equal(String(d.presets.trex.components.representation.kind), 'rig')
    assert.equal(String(d.presets.trex.components.representation.model), 'trex')
    // every placed entity resolves to a look the renderer has (no unknown model)
    for (const id of Object.keys(d.entities)) {
      const rep = read.entityData(d, id).effective.representation
      if (rep?.kind === 'rig' && rep.model) assert.ok(d.models[rep.model], `${id}: model ${rep.model}`)
    }
  })
}

test('templateOps(blank): world settings and one lamp, zero creatures', () => {
  const h = repo.create(); applyOps(h, templateOps('blank'), { kinds: KINDS })
  const d = h.doc()
  const ids = Object.keys(d.entities)
  assert.deepEqual(ids, ['lamp-1'])
  assert.equal(String(d.entities['lamp-1'].preset), 'lamp')
  assert.equal(ids.filter((id) => isCreature(d, String(d.entities[id].preset))).length, 0)
  assert.equal(read.docSummary(d).title, 'Blank meadow', 'the template title by default')
  assert.ok(d.world.bounds > 0 && d.world.ground && d.world.sky)
})

test('templateOps(meadow): the starter scene, the wizard by the lamp facing it, and the zodiac animals', () => {
  const h = repo.create(); applyOps(h, templateOps('meadow'), { kinds: KINDS })
  const d = h.doc()
  for (const [id, preset] of STARTER) assert.equal(String(d.entities[id]?.preset), preset, id)
  const wiz = d.entities['wizard-1']
  assert.ok(wiz, 'the wizard is placed (ZOO_PRESETS.wizard)')
  assert.equal(String(wiz.preset), 'wizard')
  const p = [...wiz.components.transform.p]; const yaw = wiz.components.transform.r[1]
  assert.deepEqual(p, [3, 0, 10])
  // facing the lamp: the sim's forward is +z rotated by yaw
  const lamp = [...d.entities['lamp-1'].components.transform.p]
  const f = [Math.sin(yaw * Math.PI / 180), Math.cos(yaw * Math.PI / 180)]
  const to = [lamp[0] - p[0], lamp[2] - p[2]]; const len = Math.hypot(...to)
  assert.ok((f[0] * to[0] + f[1] * to[1]) / len > 0.99, `yaw ${yaw} faces the lamp`)
  const animals = Object.values(d.entities).map((e) => String(e.preset)).filter((x) => ZOO_ANIMALS.includes(x))
  assert.deepEqual(animals.sort(), [...ZOO_ANIMALS].sort())
  // spread over the meadow, inside the view the camera opens on
  for (const e of Object.values(d.entities)) assert.ok([...e.components.transform.p].every((x) => Math.abs(x) <= 15))
  // harmless: no new animal hunts or attacks
  for (const a of ZOO_ANIMALS) {
    const c = read.entityData(d, `${a}-1`).effective
    assert.ok(!c.attack, `${a} has no attack`)
    assert.ok(!Object.values(c.brain?.drives ?? {}).some((x) => x.act === 'pursue'), `${a} pursues nothing`)
  }
  assert.equal(Object.keys(d.entities).length, STARTER.length + 1 + ZOO_ANIMALS.length)
})

test('seedOps delegates to the meadow template; seedDoc writes the same world', () => {
  const strip = (ops) => JSON.stringify(ops.map((o) => (o.op === 'setMeta' ? { ...o, patch: { ...o.patch, created: 0 } } : o)))
  assert.equal(strip(seedOps({ title: 'X' })), strip(templateOps('meadow', { title: 'X' })))
  assert.equal(strip(seedOps({ title: 'X', template: 'blank' })), strip(templateOps('blank', { title: 'X' })))
  assert.equal(seedOps()[0].patch.title, 'Merge Meadow', 'existing callers keep their default title')
  const h = repo.create(); h.change((d) => seedDoc(d, { title: 'B', template: 'blank' }))
  assert.deepEqual(Object.keys(h.doc().entities), ['lamp-1'])
})

test('template helpers: bases before the presets that extend them; yawToward; entity filtering', () => {
  const order = presetOrder({ b: { extends: 'a' }, a: { extends: '' }, c: { extends: ['b', 'z'] }, d: {} })
  assert.ok(order.indexOf('a') < order.indexOf('b') && order.indexOf('b') < order.indexOf('c'))
  assert.deepEqual([...order].sort(), ['a', 'b', 'c', 'd'])
  const cyc = presetOrder({ x: { extends: 'y' }, y: { extends: 'x' } })
  assert.deepEqual([...cyc].sort(), ['x', 'y'], 'a cycle terminates')
  const lib = presetOrder(libraryPresets())
  assert.equal(lib.indexOf('creature') < lib.indexOf('trex'), true)
  assert.equal(yawToward([0, 0, 0], [0, 0, 5]), 0)
  assert.equal(yawToward([0, 0, 0], [5, 0, 0]), 90)
  assert.equal(yawToward([0, 0, 0], [0, 0, -5]), 180)
  // a preset the library lacks is left out, never a refused batch
  const without = templateEntities('meadow', { ...PRESETS })
  assert.ok(without.every((e) => PRESETS[e.preset]))
  assert.equal(without.length, STARTER.length)
})
