import test from 'node:test'
import assert from 'node:assert/strict'
import { seeded, mirror, empty, heads } from './a-helpers.mjs'
import { lowerModule, lowerForCheck, sourceHash } from '../../src/scripts/lower.js'
import { makeSystemHost } from '../../src/scripts/host.js'
import { makeScriptWorld } from '../../src/scripts/world-api.js'
import { makeSafeMode, systemsHash, syncArmed, MARKER_KEY } from '../../src/scripts/safe-mode.js'
import { applyOps } from '../../src/doc/ops.js'
import { World } from '../../src/core/world.js'

// Test stand-in for an SES Compartment: endowments become parameters. (The page
// passes `new Compartment({ globals })` under lockdown; see a-lockdown.test.mjs.)
// eslint-disable-next-line no-new-func
const fnCompartment = (endowments) => ({ evaluate: (src) => new Function(...Object.keys(endowments), `return (${src}\n)`)(...Object.values(endowments)) })

const sys = (body) => `// a doc system\nexport default {\n${body}\n}\n`

test('lowerModule: export default -> a script whose value is the object', () => {
  const s = lowerModule(sys('update (world, dt) { return 1 }'), { name: 'spin' })
  assert.match(s, /return \{/)
  assert.match(s, /sourceURL=mm-system:spin/)
  const o = fnCompartment({}).evaluate(s)
  assert.equal(typeof o.update, 'function')
  assert.equal(typeof fnCompartment({}).evaluate(lowerForCheck(sys('update () {}'))), 'function', 'the check form is not invoked')
  assert.throws(() => lowerModule('const x = 1'), SyntaxError)
  assert.throws(() => lowerModule("import x from 'three'\nexport default {}"), /cannot import/)
  assert.throws(() => lowerModule('export const a = 1\nexport default {}'), /only `export default/)
  assert.throws(() => lowerModule('export default {}\nexport default {}'), /more than one/)
  assert.doesNotThrow(() => lowerModule("export default { s: 'say export default here' }"))
  assert.notEqual(sourceHash('a'), sourceHash('b'))
})

function hostFor (h, opts = {}) {
  const s = mirror(h, opts)
  const logs = []
  const host = makeSystemHost({ world: s.world, makeCompartment: fnCompartment, log: (...a) => logs.push(a.join(' ')), ...opts.host })
  return { ...s, host, logs, sync: () => host.sync(h.doc()) }
}

test('system host: compile, run at its order between the built-ins, hot-swap with hot data', () => {
  const h = seeded()
  const t = hostFor(h)
  applyOps(h, [{ op: 'defineSystem', name: 'counter', order: 450, source: sys(`
    init (world, hot) { hot.data.n = hot.prev.n ?? 0; hot.data.v = 1 },
    update (world, dt) { this.n = (this.n ?? 0) + 1; globalThis.__mmTrace?.push('counter@' + world.tick) },
    dispose (hot) { globalThis.__mmDisposed = hot.data.v }`) }])
  const report = t.sync()
  assert.deepEqual(report.map((r) => [r.name, r.ok, r.swapped]), [['counter', true, false]])
  assert.ok(t.world.systems().some((s) => s.name === 'doc:counter' && s.order === 450), 'scheduled into the world at its order')
  const order = t.world.systems().map((s) => s.name)
  assert.ok(order.indexOf('steer') < order.indexOf('doc:counter') && order.indexOf('doc:counter') < order.indexOf('integrate'))
  t.step(3)
  // hot swap: dispose gets the old hot, init sees prev data
  applyOps(h, [{ op: 'defineSystem', name: 'counter', order: 450, source: sys(`
    init (world, hot) { globalThis.__mmPrev = hot.prev },
    update () {}`) }])
  const r2 = t.sync()
  assert.deepEqual(r2.map((r) => [r.ok, r.swapped]), [[true, true]])
  assert.equal(globalThis.__mmDisposed, 1)
  assert.deepEqual(globalThis.__mmPrev, { n: 0, v: 1 })
  assert.deepEqual(t.sync(), [], 'unchanged source is not recompiled')
  const st = t.host.status()[0]
  assert.equal(st.name, 'counter'); assert.equal(st.ok, true); assert.equal(st.rev, 2); assert.equal(typeof st.compileMs, 'number')
  // removal disposes and unschedules
  applyOps(h, [{ op: 'removeSystem', name: 'counter' }])
  t.sync()
  assert.ok(!t.world.systems().some((s) => s.name === 'doc:counter'))
  assert.deepEqual(t.host.status(), [])
})

test('system host: a compile error keeps the last good version; a throwing update is isolated and suspended', () => {
  const h = seeded()
  const t = hostFor(h)
  applyOps(h, [
    { op: 'defineSystem', name: 'good', source: sys('update (w) { globalThis.__mmGood = (globalThis.__mmGood ?? 0) + 1 }') },
    { op: 'defineSystem', name: 'flaky', source: sys('update (w) { throw new Error("nope") }') },
  ])
  t.sync()
  globalThis.__mmGood = 0
  t.step(29)
  let flaky = t.host.status().find((s) => s.name === 'flaky')
  assert.equal(flaky.errors, 29); assert.equal(flaky.suspended, false); assert.match(flaky.lastError, /nope/)
  t.step(5)
  flaky = t.host.status().find((s) => s.name === 'flaky')
  assert.equal(flaky.suspended, true, 'suspended after 30 consecutive errors')
  assert.equal(flaky.errors, 30)
  assert.equal(globalThis.__mmGood, 34, 'the good system kept running throughout')
  assert.deepEqual(t.world.errors(), [], 'built-ins unaffected')
  // a broken redefine keeps the running version
  h.change((d) => { d.systems.good.source = 'export default { update ( {' }) // test-only: bypasses ops' checkSource
  const rep = t.sync()
  assert.deepEqual(rep.map((r) => [r.name, r.ok, r.keptPrevious]), [['good', false, true]])
  t.step(1)
  assert.equal(globalThis.__mmGood, 35)
  assert.match(t.host.status().find((s) => s.name === 'good').lastError, /SyntaxError/)
  // a new source un-suspends
  applyOps(h, [{ op: 'defineSystem', name: 'flaky', source: sys('update () {}') }])
  t.sync()
  flaky = t.host.status().find((s) => s.name === 'flaky')
  assert.equal(flaky.suspended, false); assert.equal(flaky.ok, true)
  // the host can be switched off (safe mode, boot guard)
  t.host.setEnabled(false)
  t.step(3)
  assert.equal(globalThis.__mmGood, 36 - 1)
  assert.equal(t.host.enabled, false)
})

test('system host: check() parses without running; it plugs into applyOps as checkSource', () => {
  const h = empty()
  const t = hostFor(h)
  assert.equal(t.host.check(sys('update () { globalThis.__mmRan = true }')), true)
  assert.equal(globalThis.__mmRan, undefined)
  assert.throws(() => t.host.check(sys('update ( {')), SyntaxError)
  const before = heads(h)
  assert.throws(() => applyOps(h, [{ op: 'defineSystem', name: 'bad', source: sys('update ( {') }], { checkSource: t.host.check }), /SyntaxError/)
  assert.deepEqual(heads(h), before)
})

test('system host: on(event) hook, disabledSystems, interleave:false runs from tick()', () => {
  const h = seeded()
  const t = hostFor(h, { host: { interleave: false } })
  applyOps(h, [{ op: 'defineSystem', name: 'listener', source: sys('on (ev, world) { if (ev.type === "ping") globalThis.__mmPings = (globalThis.__mmPings ?? 0) + 1 }, update () {}') }])
  t.sync()
  assert.ok(!t.world.systems().some((s) => s.name === 'doc:listener'))
  t.world.events.emit({ type: 'ping' })
  t.world.tick(1 / 30); t.host.tick(1 / 30)
  assert.equal(globalThis.__mmPings, 1)
  applyOps(h, [{ op: 'setWorld', patch: { disabledSystems: { listener: true } } }])
  t.sync()
  t.world.events.emit({ type: 'ping' })
  t.world.tick(1 / 30); t.host.tick(1 / 30)
  assert.equal(globalThis.__mmPings, 1)
})

test('script world API: frozen views, owned-only writes, host-only spawn, queued ops', () => {
  const h = seeded()
  const s = mirror(h, { owns: (id) => id !== 'trex-1' })
  s.step(2)
  const logs = []
  const api = makeScriptWorld(s.world, { log: (...a) => logs.push(a), name: 'test' })
  assert.ok(Object.isFrozen(api))
  const sheep = api.get('sheep-1')
  assert.equal(sheep.owned, true)
  assert.equal(typeof sheep.c.representation.kind, 'string', 'plain strings, not ImmutableString')
  assert.ok(Object.isFrozen(sheep.c.body))
  sheep.live.custom = 1
  assert.equal(s.world.get('sheep-1').live.custom, 1, 'an owned entity\'s live is writable')
  const rex = api.get('trex-1')
  assert.equal(rex.owned, false)
  assert.ok(Object.isFrozen(rex.live))
  assert.equal(api.set('trex-1', 'body', { speed: 1 }), false, 'writes to entities owned elsewhere are refused')
  assert.equal(api.set('sheep-1', 'body', { speed: 2 }), true)
  assert.throws(() => api.set('sheep-1', 'body', { speed: -2 }), /minimum/)
  const id = api.spawn({ preset: 'sheep', at: [1, 0, 1] })
  assert.match(id, /^sheep-/)
  assert.deepEqual(api.query('mount').map((v) => v.id), ['horse-1'])
  assert.ok(api.nearby('sheep-1', 6).every((v, i, a) => i === 0 || Math.hypot(v.live.p[0] - sheep.live.p[0], v.live.p[2] - sheep.live.p[2]) >= Math.hypot(a[i - 1].live.p[0] - sheep.live.p[0], a[i - 1].live.p[2] - sheep.live.p[2])))
  api.emit({ type: 'baa', n: 1 })
  api.log('hello', { a: 1 })
  assert.deepEqual(logs, [['test', 'hello', '{"a":1}']])
  assert.equal(typeof api.rand(), 'number')
  assert.equal(api.time, s.world.time)
  const ops = s.world.drainOps()
  assert.deepEqual(ops.map((o) => o.op), ['set', 'spawn'])
  assert.doesNotThrow(() => applyOps(h, ops))
  s.world.setOwnership({ isHost: () => false })
  assert.equal(api.spawn({ preset: 'sheep' }), null, 'only the host spawns: every peer runs every system')
})

function fakeStorage () {
  const m = new Map()
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k), m }
}

test('safe mode: session crash marker', () => {
  const storage = fakeStorage()
  const boot = (hash, extra = {}) => makeSafeMode({ docId: 'doc1', systemsHash: hash, storage, ...extra })
  const a = boot('h1')
  assert.equal(a.shouldStartSafe(), false)
  a.arm()
  assert.ok(storage.m.has(MARKER_KEY))
  a.onPageHide()
  assert.equal(storage.m.has(MARKER_KEY), false, 'a clean exit clears it')
  a.onPageShow()
  assert.ok(storage.m.has(MARKER_KEY), 're-armed on pageshow (bfcache)')
  // the tab dies with the marker set: next boot of this doc with the same systems is safe
  const b = boot('h1')
  assert.equal(b.shouldStartSafe(), true)
  assert.match(b.reason(), /stopped/)
  assert.equal(boot('h2').shouldStartSafe(), false, 'editing a system re-enables systems')
  assert.equal(makeSafeMode({ docId: 'other', systemsHash: 'h1', storage }).shouldStartSafe(), false, 'another doc is not affected')
  assert.equal(boot('').shouldStartSafe(), false, 'no systems, nothing to be safe from')
  b.arm('h1') // "Run systems anyway"
  b.disarm()
  assert.equal(boot('h1').shouldStartSafe(), false)
  assert.equal(boot('h1', { forced: true }).shouldStartSafe(), true, '#safe forces it')
  // storage that throws or is missing never breaks boot
  const hostile = { getItem () { throw new Error('denied') }, setItem () { throw new Error('denied') }, removeItem () { throw new Error('denied') } }
  const c = makeSafeMode({ docId: 'd', systemsHash: 'h', storage: hostile })
  assert.doesNotThrow(() => { c.arm(); c.onPageHide(); c.onPageShow(); c.disarm() })
  assert.equal(c.shouldStartSafe(), false)
  assert.equal(makeSafeMode({ docId: 'd', storage: null }).shouldStartSafe(), false)
  // the hash covers enabled systems' sources
  const doc = { systems: { a: { source: 'x', enabled: true }, b: { source: 'y', enabled: false } } }
  assert.equal(systemsHash(doc), systemsHash({ systems: { a: { source: 'x' } } }))
  assert.notEqual(systemsHash(doc), systemsHash({ systems: { a: { source: 'x2' } } }))
  assert.equal(systemsHash({ systems: {} }), '')
})

test('a system world on a bare World needs no doc', () => {
  const w = new World()
  const api = makeScriptWorld(w)
  assert.deepEqual(api.query('anything'), [])
  assert.equal(api.get('x'), null)
  assert.deepEqual(api.nearby('x', 5), [])
})

test('safe mode: bootCrashHash is the marker this boot found, not what the tab arms later', () => {
  const storage = fakeStorage()
  const dying = makeSafeMode({ docId: 'doc1', systemsHash: 'old', storage })
  dying.arm('hang') // the tab hangs right after the hanging systems arrived
  // next boot starts from a stale local doc ('old'): not safe at boot ...
  const next = makeSafeMode({ docId: 'doc1', systemsHash: 'old', storage })
  assert.equal(next.shouldStartSafe(), false)
  // ... but it knows which hash crashed, so the app can go safe when 'hang' syncs in
  assert.equal(next.bootCrashHash(), 'hang')
  next.arm('old')
  assert.equal(next.bootCrashHash(), 'hang', 'arming does not overwrite the evidence')
  assert.equal(makeSafeMode({ docId: 'other', storage }).bootCrashHash(), null, 'another doc: no evidence')
  assert.equal(makeSafeMode({ docId: 'd', storage: null }).bootCrashHash(), null, 'no storage: null')
})

test('safe mode: hold keeps the crash evidence through a clean exit', () => {
  const storage = fakeStorage()
  const t = makeSafeMode({ docId: 'doc1', systemsHash: 'ok', storage })
  t.arm('ok') // this tab runs its (fine) systems
  t.hold('hang') // then the crashed systems arrive: safe mode, evidence kept
  t.onPageHide() // a clean exit must not clear it
  const next = makeSafeMode({ docId: 'doc1', systemsHash: 'hang', storage })
  assert.equal(next.shouldStartSafe(), true, 'the next boot with the crashed systems is safe')
  assert.equal(next.bootCrashHash(), 'hang')
})

test('check() parses without running: a source that closes the wrapper early is refused, not run', () => {
  const host = makeSystemHost({ world: new World({ peerId: 'A' }), makeCompartment: fnCompartment })
  globalThis.__mmBreakout = 0
  const evil = 'export default { update () {} } }); globalThis.__mmBreakout++; (function () { return {'
  assert.throws(() => host.check(evil), SyntaxError)
  assert.equal(globalThis.__mmBreakout, 0, 'nothing in the source ran')
  assert.equal(host.check('export default { update () {} }'), true)
  delete globalThis.__mmBreakout
})

// A system that hangs in init() or in its module body hangs inside sync: the
// marker must already be written by then, or the next boot hangs again.
for (const where of ['init', 'module body']) {
  test(`safe mode: the crash marker is armed before a system's ${where} runs`, () => {
    const storage = fakeStorage()
    const h = seeded()
    const t = hostFor(h)
    const safe = makeSafeMode({ docId: 'doc1', storage })
    const seen = []
    globalThis.__mmMarkerProbe = () => { seen.push(storage.getItem(MARKER_KEY)); throw new Error('stand-in for a hang') }
    const src = where === 'init'
      ? 'export default { init () { globalThis.__mmMarkerProbe() }, update () {} }'
      : 'globalThis.__mmMarkerProbe()\nexport default { update () {} }'
    applyOps(h, [{ op: 'defineSystem', name: 'hang', source: src }])
    const hash = systemsHash(h.doc())
    const { armed } = syncArmed(safe, { hash, armed: null, sync: () => t.host.sync(h.doc()), running: () => t.host.size > 0 })
    delete globalThis.__mmMarkerProbe
    assert.equal(seen.length, 1)
    assert.equal(JSON.parse(seen[0]).systemsHash, hash, `the marker named these systems while the ${where} ran`)
    // had it hung there, the next boot of this doc with these systems would start safe
    if (where === 'init') { assert.equal(armed, hash, 'init threw but the system runs: still armed'); assert.equal(makeSafeMode({ docId: 'doc1', systemsHash: hash, storage }).shouldStartSafe(), true) }
    else { assert.equal(armed, null, 'the module body threw: nothing runs, so the marker is cleared'); assert.equal(storage.getItem(MARKER_KEY), null) }
  })
}

test('system host: a disabled system is neither compiled nor init\'ed until it is enabled', () => {
  const h = seeded()
  const t = hostFor(h)
  globalThis.__mmRan = []
  applyOps(h, [{ op: 'defineSystem', name: 'later', enabled: false, source: 'globalThis.__mmRan.push("body")\nexport default { init () { globalThis.__mmRan.push("init") }, update () {} }' }])
  t.sync()
  assert.deepEqual(globalThis.__mmRan, [], 'nothing of a disabled system runs')
  assert.equal(t.host.size, 0)
  assert.equal(systemsHash(h.doc()), '', 'and the crash hash leaves it out')
  applyOps(h, [{ op: 'setSystem', name: 'later', patch: { enabled: true } }])
  t.sync()
  assert.deepEqual(globalThis.__mmRan, ['body', 'init'])
  assert.equal(t.host.size, 1)
  applyOps(h, [{ op: 'setSystem', name: 'later', patch: { enabled: false } }])
  t.sync()
  assert.equal(t.host.size, 0, 'disabling retires it')
  delete globalThis.__mmRan
})

test('system host: a system that threw once and then runs cleanly reports ok again', () => {
  const h = seeded()
  const t = hostFor(h)
  applyOps(h, [{ op: 'defineSystem', name: 'flaky', source: 'export default { n: 0, update () { if (this.n++ === 0) throw new Error("once") } }' }])
  t.sync()
  t.step()
  let st = t.host.status().find((s) => s.name === 'flaky')
  assert.equal(st.ok, false); assert.match(st.lastError, /once/)
  t.step()
  st = t.host.status().find((s) => s.name === 'flaky')
  assert.equal(st.ok, true, 'ok follows the live state'); assert.match(st.lastError, /once/, 'the last error stays for display')
})

test('script world: bad spawn / despawn / group ops throw into the script instead of poisoning the tick batch', () => {
  const h = seeded()
  const t = hostFor(h)
  const api = makeScriptWorld(t.world, { name: 't' })
  assert.throws(() => api.spawn({ preset: 'wolf' }), /spawn: no preset wolf/)
  assert.throws(() => api.spawn({ id: 'sheep-1', preset: 'sheep' }), /exists/)
  assert.throws(() => api.spawn({ preset: 'sheep', at: [0, NaN, 0] }), /at must be/)
  assert.ok(api.despawn('sheep-1'))
  assert.throws(() => api.despawn('sheep-1'), /no entity sheep-1/, 'a second despawn in the same tick')
  assert.throws(() => api.addGroup('sheep-2', 'scared!'), /bad group name/)
  assert.throws(() => api.set('sheep-2', 'on', { hurt: { add: ['scared!'] } }), /bad group name/)
  const id = api.spawn({ preset: 'sheep', at: [1, 0, 1] })
  assert.ok(api.despawn(id), 'despawning a spawn queued this tick is fine')
  // the world drops ops on an id despawned earlier in the same batch
  t.world.queueOps([{ op: 'addGroup', id: 'sheep-1', group: 'calm' }, { op: 'drain', id: 'sheep-1', eventIds: ['x'] }])
  const ops = t.world.drainOps()
  assert.deepEqual(ops.map((o) => `${o.op}:${o.id}`), ['despawn:sheep-1', `spawn:${id}`, `despawn:${id}`])
  assert.doesNotThrow(() => applyOps(h, ops))
})
