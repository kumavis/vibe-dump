// What the live page offers an agent beyond the doc (design §6.1, §16.10):
// capture, logs, eval (in a Compartment), explain, systems. Every result is a
// fresh plain copy: CapTP's marshal hardens what it sends, and a live three
// object handed out once froze Vector3.prototype in spike S3. world-caps.js
// JSON-copies again on its side; copying here keeps internal arrays private.
const json = (x) => (x === undefined ? null : JSON.parse(JSON.stringify(x)))

export function makeHostPowers ({ scene, log, evalPower, explain, systemHost, onCall }) {
  const timed = (what, fn) => async (...args) => {
    const t0 = performance.now()
    try {
      const r = await fn(...args)
      onCall?.({ what, ok: true, ms: Math.round(performance.now() - t0) })
      return r
    } catch (e) {
      onCall?.({ what, ok: false, error: String(e?.message ?? e) })
      throw e
    }
  }
  return {
    // render right before reading, in the same task: no preserveDrawingBuffer needed
    capture: timed('capture', ({ type = 'image/jpeg', quality = 0.75 } = {}) => {
      scene.render()
      return scene.renderer.domElement.toDataURL(String(type), Number(quality))
    }),
    logs: timed('logs', (n = 50) => json(log.list(n))),
    eval: timed('eval', (src) => evalPower(String(src))),
    explain: timed('explain', (id) => { const r = explain(String(id)); if (!r) throw new Error(`no entity ${id}`); return json(r) }),
    systems: () => json(systemHost.status()),
  }
}

// SES Compartment factory for doc systems and agent eval: endowments only
// (design §16.11), hardened so a system cannot reach through them.
export function makeCompartmentFactory () {
  return (endowments) => {
    const C = globalThis.Compartment
    if (typeof C !== 'function') throw new Error('SES Compartment is unavailable (lockdown did not run)')
    const globals = typeof globalThis.harden === 'function' ? globalThis.harden({ ...endowments }) : { ...endowments }
    return new C({ __options__: true, globals })
  }
}
