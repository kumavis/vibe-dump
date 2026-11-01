// Track M (design §18.2, §17): the wizard and zodiac library models and the zoo
// presets. Every new model validates and resolves; every zoo preset resolves
// through the preset chain in a doc that carries the library; and a numeric
// look at the built rigs: feet on the ground, heads above bodies, nothing huge.
import test from 'node:test'
import assert from 'node:assert/strict'
import * as THREE from 'three'
import { Repo } from '@automerge/automerge-repo'
import { MODEL_LIBRARY, LIBRARY_ORDER, LIMITS, ZOO_MODELS, resolveModel, resolveRepresentation, validateModel, ensureLibraryOps, nodeNames } from '../../src/doc/models.js'
import { ZOO_PRESETS } from '../../src/doc/presets-zoo.js'
import { COMPONENT_DEFS, PRESETS, effectiveComponents } from '../../src/doc/presets.js'
import { initDoc } from '../../src/doc/schema.js'
import { applyOps } from '../../src/doc/ops.js'
import { plain } from '../../src/doc/read.js'
import { compileExpr } from '../../src/doc/expr.js'
import { KINDS } from '../../src/render/kinds/index.js'
import { makeResources } from '../../src/render/resources.js'

const clone = (v) => JSON.parse(JSON.stringify(v))
const library = () => Object.fromEntries(LIBRARY_ORDER.map((n) => [n, { ...clone(MODEL_LIBRARY[n]), rev: 1 }]))
const NEW = ['wizard', 'rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake', 'goat', 'monkey', 'rooster', 'dog', 'pig']
const BASE = { wizard: 'biped', rat: 'quadruped', ox: 'quadruped', tiger: 'quadruped', rabbit: 'quadruped', dragon: 'serpent', snake: 'serpent', goat: 'quadruped', monkey: 'biped', rooster: 'bird', dog: 'quadruped', pig: 'quadruped' }
const ICONS = { wizard: '🧙', rat: '🐀', ox: '🐂', tiger: '🐅', rabbit: '🐇', dragon: '🐉', snake: '🐍', goat: '🐐', monkey: '🐒', rooster: '🐓', dog: '🐕', pig: '🐖' }
const VARS = { t: 1.3, st: 0.4, phase: 2.7, gait: 0.6, speed: 3, turn: 0.2, hp: 1, rand: 0.4, idx: 2 }
const count = (ns) => ns.reduce((a, n) => a + 1 + count(n.children ?? []), 0)

test('zoo models: in the library, each extends its base, validates, resolves, under 40 nodes', () => {
  const lib = library()
  for (const n of NEW) assert.ok(MODEL_LIBRARY[n], n)
  assert.deepEqual(clone(MODEL_LIBRARY), MODEL_LIBRARY, 'JSON round-trips: no functions, no undefined, no -0')
  assert.ok(Object.isFrozen(MODEL_LIBRARY.wizard.nodes[0]))
  assert.deepEqual([...ZOO_MODELS].sort(), [...NEW, 'horse'].sort(), 'ZOO_MODELS: the twelve zodiac animals and the wizard')
  for (const n of NEW) {
    assert.equal(MODEL_LIBRARY[n].extends, BASE[n], `${n} extends ${BASE[n]}`)
    assert.ok(LIBRARY_ORDER.indexOf(BASE[n]) < LIBRARY_ORDER.indexOf(n), `${n} after its base`)
    assert.deepEqual(validateModel(MODEL_LIBRARY[n], lib, { name: n }), [], n)
    const r = resolveModel(lib, n)
    assert.deepEqual(r.chain, [BASE[n], n])
    assert.ok(count(r.nodes) <= 40 && count(r.nodes) <= LIMITS.nodes, `${n}: ${count(r.nodes)} nodes`)
    const names = new Set(nodeNames(r.nodes))
    for (const [clip, c] of Object.entries(r.animations)) {
      for (const [k, v] of Object.entries(c.tracks)) {
        assert.ok(names.has(k.split('.')[0]), `${n}.${clip}: ${k}`)
        if (typeof v === 'string') assert.ok(Number.isFinite(compileExpr(v)(VARS)), `${n}.${clip}.${k}`)
      }
    }
    for (const s of ['idle', 'walk', 'run', 'attack', 'die']) assert.ok(r.controller.states[s]?.every((c) => r.animations[c]), `${n}: ${s} plays clips it has`)
    assert.ok(r.description && r.description.length <= 500)
    assert.equal(resolveRepresentation({ models: lib }, { kind: 'rig', model: n })?.model, n)
  }
  assert.deepEqual(ensureLibraryOps({ models: lib }), [], 'a doc with the library needs nothing')
  assert.deepEqual(ensureLibraryOps({ models: {} }).map((o) => o.name), LIBRARY_ORDER, 'a doc with none gets every model, bases first')
})

test('zoo models: species clips and controller mappings', () => {
  const lib = library()
  const R = Object.fromEntries(NEW.map((n) => [n, resolveModel(lib, n)]))
  // the wizard: a hat above the eyes, a beard, a staff with a crystal under arm_r; an idle staff bob; cast on attack
  const w = R.wizard
  const under = (r, parent, child) => { const find = (ns) => { for (const x of ns) { if (x.name === parent) return x; const c = find(x.children ?? []); if (c) return c } return null }; return nodeNames([find(r.nodes)]).includes(child) }
  assert.ok(under(w, 'head', 'hat') && under(w, 'head', 'hat_brim') && under(w, 'head', 'beard'))
  assert.ok(under(w, 'arm_r', 'staff') && under(w, 'staff', 'crystal'))
  assert.deepEqual(w.controller.states.attack, ['cast'])
  assert.equal(w.animations.cast.once, true)
  assert.ok(w.animations.cast.tracks['arm_r.rx'] && w.animations.cast.tracks['crystal.sx'], 'cast raises arm_r and pulses the crystal')
  assert.ok(w.controller.states.idle.includes('staffbob') && w.animations.staffbob.tracks['staff.py'])
  assert.deepEqual(w.animations.walk.tracks['leg_l.rx'], MODEL_LIBRARY.biped.animations.walk.tracks['leg_l.rx'], 'keeps the biped gait')
  // predators attack with a once clip of their own
  for (const [n, clip] of [['tiger', 'pounce'], ['dragon', 'breath'], ['snake', 'attack']]) {
    assert.deepEqual(R[n].controller.states.attack, [clip], n)
    assert.equal(R[n].animations[clip].once, true, n)
  }
  assert.equal(R.dragon.animations.attack, undefined, "the dragon drops the serpent's strike")
  // species flourishes in idle
  assert.ok(R.dog.controller.states.idle.includes('wag') && R.dog.animations.wag.tracks['tail.ry'])
  assert.ok(Array.isArray(R.snake.animations.idle.tracks['tongue.sz']), 'snake: a tongue flick')
  assert.ok(R.rooster.animations.walk.tracks['head.rx'] && R.rooster.animations.walk.tracks['neck.pz'], 'rooster: a head bob in walk')
  assert.ok(R.pig.animations.idle.tracks['tail.rz'] && R.monkey.animations.idle.tracks['tail.ry'])
  // the dragon's head is the chain root: nothing pitches it (the legs would leave the ground)
  for (const [clip, c] of Object.entries(R.dragon.animations)) if (clip !== 'die') assert.equal(c.tracks['head.rx'], undefined, `dragon.${clip}`)
  // parts the brief asks for
  const has = (n, ...parts) => { const s = new Set(nodeNames(R[n].nodes)); for (const p of parts) assert.ok(s.has(p), `${n} has ${p}`) }
  has('ox', 'horn_l', 'horn_r', 'hump'); has('rabbit', 'ear_l', 'ear_r'); has('goat', 'horn_l', 'horn_tip_r', 'beard')
  has('dragon', 'leg_fl', 'leg_br', 'horn_l', 'whisker_r', 'jaw', 'flame'); has('rooster', 'comb', 'wattle'); has('dog', 'ear_l', 'collar'); has('pig', 'snout')
  has('monkey', 'tail', 'tail2'); has('rat', 'snout', 'ear_l')
})

// a doc that carries the vocabulary and the library, through the one write path
function zooDoc () {
  const h = new Repo({ network: [] }).create()
  h.change((d) => initDoc(d, { title: 'zoo' }))
  applyOps(h, [
    ...Object.entries(COMPONENT_DEFS).map(([name, def]) => ({ op: 'defineComponent', name, def })),
    { op: 'definePreset', name: 'creature', preset: PRESETS.creature },
    ...ensureLibraryOps({ models: {} }),
    ...Object.entries(ZOO_PRESETS).map(([name, preset]) => ({ op: 'definePreset', name, preset })),
    ...Object.keys(ZOO_PRESETS).map((name, i) => ({ op: 'spawn', id: `z-${name}`, preset: name, components: { transform: { p: [i * 3, 0, 0] } } })),
  ], { kinds: KINDS })
  return h
}

test('zoo presets: one per new model, each extends creature, has an icon and resolves to its rig', () => {
  assert.deepEqual(Object.keys(ZOO_PRESETS).sort(), [...NEW].sort())
  assert.ok(Object.isFrozen(ZOO_PRESETS.tiger.components))
  for (const n of Object.keys(ZOO_PRESETS)) assert.equal(PRESETS[n], undefined, `${n} does not shadow a seed preset`)
  const doc = zooDoc().doc()
  for (const [n, p] of Object.entries(ZOO_PRESETS)) {
    assert.equal(p.extends, 'creature', n)
    assert.equal(p.icon, ICONS[n], n)
    assert.equal(String(plain(doc.presets[n].icon)), ICONS[n], `${n}: the icon is stored`)
    const c = plain(effectiveComponents(doc, `z-${n}`))
    assert.deepEqual(c.representation, { kind: 'rig', model: n }, n)
    assert.ok(c.tags.creature, `${n} is a creature`)
    assert.ok(c.body.speed > 0 && c.health.max > 0 && c.perception.radius > 0, n)
    assert.deepEqual(c.on, { died: { add: ['dead'] } })
    const r = resolveRepresentation(doc, c.representation)
    assert.ok(r && r.key.startsWith(`model:${n}:1.1:`), `${n}: ${r?.key}`)
  }
  const C = (n) => plain(effectiveComponents(doc, `z-${n}`))
  for (const [n, dmg] of [['tiger', 20], ['dragon', 40]]) {
    assert.ok(C(n).tags.predator, n)
    assert.deepEqual(C(n).brain.drives.hunt.match, { tags: ['prey'], notTags: ['dead'] }, n)
    assert.equal(C(n).attack.damage, dmg, n)
  }
  assert.deepEqual(C('snake').brain.drives.hunt.match.tags, ['rodent'])
  assert.deepEqual(C('snake').brain.drives.flee.match.tags, ['predator'])
  assert.ok(C('snake').brain.drives.flee.weight > C('snake').brain.drives.hunt.weight, 'the snake flees before it hunts')
  assert.ok(C('rat').tags.prey && C('rat').tags.rodent)
  for (const n of ['rabbit', 'goat', 'pig', 'ox', 'rooster']) { assert.ok(C(n).tags.prey && !C(n).tags.predator, n); assert.equal(C(n).brain.drives.flee.act, 'flee', n) }
  for (const n of ['monkey', 'dog']) { assert.deepEqual(C(n).brain.drives, {}, `${n} is a neutral wanderer`); assert.equal(C(n).brain.idle, 'wander') }
  assert.ok(C('monkey').tags.person && C('dog').tags.dog)
  const wz = C('wizard')
  assert.ok(wz.tags.person && wz.tags.wizard && !wz.tags.prey)
  assert.equal(wz.body.speed, 3); assert.equal(wz.health.max, 60)
  assert.deepEqual(wz.brain.drives.flee.match, { tags: ['predator'], notTags: ['dead'] })
  // the chase stays fair: each prey animal outruns at least one of the two predators
  for (const n of ['rat', 'rabbit', 'goat', 'pig', 'ox', 'rooster']) assert.ok(C(n).body.speed > Math.min(C('tiger').body.speed, C('dragon').body.speed) || C(n).body.speed >= 4, n)
})

// build each model with the real rig kind (no renderer needed) and measure it
function built (name) {
  const res = makeResources({ document: null })
  const doc = { models: MODEL_LIBRARY }
  const o = KINDS.rig.create({ kind: 'rig', model: name }, { res, doc: () => doc })
  o.updateMatrixWorld(true)
  return { o, res }
}
const worldY = (g) => new THREE.Vector3().setFromMatrixPosition(g.matrixWorld).y
const BODY = { quadruped: 'body', biped: 'chest', serpent: 's3', bird: 'body' }
const baseOf = (n) => { let b = n; while (MODEL_LIBRARY[b]?.extends) b = String(MODEL_LIBRARY[b].extends); return b }

test('zoo models, built: feet on the ground, heads above bodies, sensible size; walking keeps them near the ground', () => {
  for (const n of [...NEW, 'horse']) {
    const { o, res } = built(n)
    const box = new THREE.Box3().setFromObject(o)
    assert.ok(Math.abs(box.min.y) <= 0.03, `${n}: lowest point at y ${box.min.y.toFixed(3)}`)
    const size = box.getSize(new THREE.Vector3())
    assert.ok(size.x < 4 && size.y < 3.5 && size.z < 4.5 && size.y > 0.1, `${n}: ${size.toArray().map((x) => x.toFixed(2))}`)
    const head = KINDS.rig.anchors(o).head
    const body = o.userData.bones.get(BODY[baseOf(n)])
    const hy = worldY(head); const by = worldY(body)
    if (baseOf(n) === 'serpent') assert.ok(hy >= by - 1e-6, `${n}: head ${hy.toFixed(2)} not below the body ${by.toFixed(2)}`)
    else assert.ok(hy > by, `${n}: head ${hy.toFixed(2)} above the body ${by.toFixed(2)}`)
    // mid-walk: the lowest point stays within a hand of the ground (no sinking, no flying)
    const v = { t: 0, st: 0, phase: 0, speed: 1.5, gait: 0.4, turn: 0, hp: 1, rand: 0.5, idx: 1 }
    let lo = Infinity; let hi = -Infinity
    for (let i = 0; i < 45; i++) {
      v.t += 1 / 30; v.st += 1 / 30; v.phase += 1.5 / 30 / (resolveModel(MODEL_LIBRARY, n).stride)
      KINDS.rig.animate(o, 'walk', null, 1 / 30, v)
      o.updateMatrixWorld(true)
      const y = new THREE.Box3().setFromObject(o).min.y
      lo = Math.min(lo, y); hi = Math.max(hi, y)
    }
    assert.ok(lo > -0.12 && hi < 0.16, `${n}: walking, the lowest point ranges ${lo.toFixed(3)}..${hi.toFixed(3)}`)
    res.releaseAll(o)
  }
})
