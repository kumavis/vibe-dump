// SystemHost (design §7.1, §7.3), from spikes S1/S3 and research
// runtime-extensibility: doc systems compiled per source hash in a fresh
// Compartment with endowments { world, log } only (design §16.11), hot-swapped
// on change (dispose -> init with hot.prev), compile errors keep the last good
// version, a throwing update is caught per system and suspended locally after
// `maxErrors` consecutive errors. Status is local, never written to the doc.
// Systems are scheduled into the world at their `order`, between the built-ins,
// so tick(dt) only matters for a host created with { interleave: false }.
import { lowerModule, lowerForCheck, lowerBody, sourceHash } from './lower.js'
import { makeScriptWorld } from './world-api.js'
import { plain } from '../doc/convert.js'

const now = () => (globalThis.performance?.now ? globalThis.performance.now() : Date.now())
const errText = (e) => `${e?.name ?? 'Error'}: ${e?.message ?? String(e)}`

export function makeSystemHost ({ world, makeCompartment, log = () => {}, maxErrors = 30, interleave = true, opsOptions = {} } = {}) {
  if (typeof makeCompartment !== 'function') throw new TypeError('makeSystemHost needs makeCompartment(endowments)')
  const entries = new Map() // name -> entry
  let enabled = true
  let lastDoc = null

  const sysLog = (name, ...a) => log(`[system ${name}]`, ...a)

  function compile (name, source) {
    const t = now()
    const api = makeScriptWorld(world, { log: sysLog, name, opsOptions })
    const c = makeCompartment({ world: api, log: api.log })
    const sys = c.evaluate(lowerModule(source, { name }))
    if (!sys || typeof sys !== 'object' || (typeof sys.update !== 'function' && typeof sys.on !== 'function')) throw new TypeError(`system ${name}: export default must be an object with update(world, dt) or on(event, world)`)
    return { sys, api, ms: Math.round((now() - t) * 1000) / 1000 }
  }

  function schedule (e) {
    if (!interleave) return
    world.addSystem({ name: `doc:${e.name}`, order: e.order, update: (w, dt) => run(e, dt) })
  }

  function run (e, dt) {
    if (!enabled || !e.enabled || e.suspended || !e.sys) return
    if (lastDoc?.world?.disabledSystems?.[e.name]) return
    try {
      if (typeof e.sys.on === 'function') for (const ev of world.events.events()) e.sys.on(ev, e.api)
      if (typeof e.sys.update === 'function') e.sys.update(e.api, dt)
      e.errors = 0
    } catch (err) {
      e.errors++; e.lastError = errText(err)
      if (e.errors === 1) sysLog(e.name, 'threw', e.lastError)
      if (e.errors >= maxErrors) { e.suspended = true; sysLog(e.name, `suspended after ${e.errors} consecutive errors`) }
    }
  }

  function retire (e) {
    if (e.sys && typeof e.sys.dispose === 'function') { try { e.sys.dispose(e.hot) } catch (err) { sysLog(e.name, 'dispose threw', errText(err)) } }
    if (interleave) world.removeSystem(`doc:${e.name}`)
  }

  // compile what changed; returns a report entry for each system that was (re)compiled or failed
  function sync (doc) {
    lastDoc = doc
    const report = []
    const systems = doc?.systems ?? {}
    for (const name of Object.keys(systems).sort()) {
      const def = systems[name]
      const source = String(def?.source ?? '')
      const hash = sourceHash(source)
      const order = Number(plain(def?.order) ?? 950)
      const on = plain(def?.enabled) !== false
      const rev = Number(plain(def?.rev) ?? 0)
      let e = entries.get(name)
      if (!e) { e = { name, hash: null, sys: null, api: null, hot: {}, order, enabled: on, rev, errors: 0, suspended: false, lastError: null, compileError: null, compileMs: null, failedHash: null }; entries.set(name, e) }
      const reorder = e.order !== order
      e.enabled = on; e.rev = rev; e.order = order
      // a disabled system is not evaluated at all (compiled and init'ed when it is
      // enabled): its module body and init() could hang the tab, and the crash
      // marker's systems hash covers enabled systems only (safe-mode.js)
      if (!on) {
        if (e.sys) { retire(e); e.hot = { data: e.hot?.data ?? {} } }
        Object.assign(e, { sys: null, api: null, hash: null, failedHash: null, errors: 0, suspended: false, lastError: null, compileError: null })
        continue
      }
      if (e.hash === hash || e.failedHash === hash) { if (reorder && e.sys) schedule(e); continue }
      let compiled
      try { compiled = compile(name, source) } catch (err) {
        e.failedHash = hash; e.lastError = errText(err); e.compileError = e.lastError
        report.push({ name, ok: false, error: e.lastError, keptPrevious: !!e.sys })
        sysLog(name, 'compile error', e.lastError)
        if (reorder && e.sys) schedule(e)
        continue
      }
      const swapped = !!e.sys
      const prev = e.hot
      if (e.sys && typeof e.sys.dispose === 'function') { try { e.sys.dispose(prev) } catch (err) { sysLog(name, 'dispose threw', errText(err)) } }
      const hot = { prev: prev?.data ?? {}, data: {} }
      Object.assign(e, { hash, failedHash: null, sys: compiled.sys, api: compiled.api, hot, errors: 0, suspended: false, lastError: null, compileError: null, compileMs: compiled.ms })
      try { if (typeof e.sys.init === 'function') e.sys.init(e.api, hot) } catch (err) {
        e.lastError = errText(err); e.errors++
        sysLog(name, 'init threw', e.lastError)
      }
      schedule(e)
      report.push({ name, ok: !e.lastError, swapped, ms: compiled.ms, ...(e.lastError ? { error: e.lastError } : {}) })
    }
    for (const [name, e] of [...entries]) if (!(name in systems)) { retire(e); entries.delete(name) }
    return report
  }

  function tick (dt) {
    if (interleave) return
    for (const e of [...entries.values()].sort((a, b) => a.order - b.order || (a.name < b.name ? -1 : 1))) run(e, dt)
  }

  // parse without running. First the compartment's own Function constructor
  // compiles the body on its own, without calling it: a body that parses alone
  // cannot close the wrapper early, so the second step (evaluating the uninvoked
  // wrapper, which is where SES rejects eval( / import( / HTML comments) runs no
  // statement of the source. Evaluating the wrapper first let a source like
  // `}); while (true) {} (function () {` hang the tab that only checked it.
  function check (source) {
    const c = makeCompartment({})
    const F = c.evaluate('Function')
    // eslint-disable-next-line no-new
    new F(lowerBody(source))
    c.evaluate(lowerForCheck(source))
    return true
  }

  const status = () => [...entries.values()].sort((a, b) => a.order - b.order || (a.name < b.name ? -1 : 1)).map((e) => ({
    // ok is the LIVE state: a system that threw once and now runs cleanly is ok
    // again (lastError stays for display); a refused new source is not ok
    name: e.name, order: e.order, enabled: e.enabled, ok: !!e.sys && !e.compileError && e.errors === 0 && !e.suspended, suspended: e.suspended,
    errors: e.errors, lastError: e.lastError, compileMs: e.compileMs, rev: e.rev, running: enabled && e.enabled && !!e.sys && !e.suspended,
  }))

  return {
    sync,
    tick,
    status,
    check,
    setEnabled (v) { enabled = !!v },
    get enabled () { return enabled },
    get size () { return [...entries.values()].filter((e) => e.sys).length },
    dispose () { for (const e of entries.values()) retire(e); entries.clear() },
  }
}
