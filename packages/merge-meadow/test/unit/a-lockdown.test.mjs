// The page runs under SES lockdown({ overrideTaming: 'severe' }) (rule §2.11).
// node --test runs each file in its own process, so this one locks down first
// and then drives the whole core: doc ops, world reconcile, the built-in sim and
// doc systems in a real Compartment.
import 'ses'
import test from 'node:test'
import assert from 'node:assert/strict'

lockdown({ overrideTaming: 'severe', errorTaming: 'unsafe', consoleTaming: 'unsafe' })

const { scenario, seeded } = await import('./a-helpers.mjs')
const { makeSystemHost } = await import('../../src/scripts/host.js')
const { applyOps } = await import('../../src/doc/ops.js')
const { simHash, explain } = await import('../../src/sim/index.js')

const compartment = (globals) => new Compartment({ __options__: true, globals })

test('under lockdown: intrinsics are frozen, and the scenario still plays out', () => {
  assert.ok(Object.isFrozen(Array.prototype))
  const s = scenario()
  for (let t = 0; t < 400; t++) s.step()
  assert.ok(s.world.get('dolly').groups.has('dead'), 'the T-rex caught the near sheep')
  assert.deepEqual(s.world.errors(), [])
  assert.match(simHash(s.world), /^[0-9a-f]{8}$/)
  assert.doesNotThrow(() => harden(explain(s.world, 'rex')), 'explain returns plain data that can be hardened')
  assert.ok(!Object.isFrozen(s.world.get('rex').live), 'hardening a copy did not freeze live state')
})

test('under lockdown: doc systems run in real Compartments with { world, log } only', () => {
  const h = seeded()
  const s = scenario()
  const logs = []
  const host = makeSystemHost({ world: s.world, makeCompartment: compartment, log: (...a) => logs.push(a.join(' ')) })
  applyOps(s.handle, [{ op: 'defineSystem', name: 'probe', source: `export default {
    init (world) {
      let random = 'ok'; try { Math.random() } catch (e) { random = 'throws' }
      let now = 'ok'; try { Date.now() } catch (e) { now = 'throws' }
      world.log(JSON.stringify({ random, now, document: typeof document, three: typeof THREE, process: typeof process, frozen: Object.isFrozen(Array.prototype), world: Object.isFrozen(world) }))
    },
    update (world, dt) {
      for (const e of world.query('brain')) if (e.owned) e.live.seen = (e.live.seen ?? 0) + 1
    },
  }` }], { checkSource: host.check })
  const rep = host.sync(s.handle.doc())
  assert.deepEqual(rep.map((r) => r.ok), [true], JSON.stringify(rep))
  const line = logs.find((l) => l.includes('random'))
  const probe = JSON.parse(line.slice(line.indexOf('{')))
  assert.deepEqual(probe, { random: 'throws', now: 'throws', document: 'undefined', three: 'undefined', process: 'undefined', frozen: true, world: true })
  for (let t = 0; t < 5; t++) s.step()
  assert.equal(s.world.get('rex').live.seen, 5, 'a system mutates live of entities it owns')
  assert.throws(() => host.check('export default { update () { eval("1") } }'), /eval|SES/i, 'SES rejects eval( at compile time')
  assert.throws(() => applyOps(h, [{ op: 'defineSystem', name: 'x', source: 'export default { update ( { }' }], { checkSource: host.check }), /SyntaxError/)
})
