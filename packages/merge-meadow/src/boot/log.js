// The page's log ring: system logs, agent sessions, flush failures, uncaught
// errors. The agent's logs() host power returns a plain copy of the tail.
export function makeLog ({ limit = 400, now = () => Date.now(), echo = false } = {}) {
  const ring = []
  const fns = new Set()
  const str = (a) => (typeof a === 'string' ? a : a instanceof Error ? `${a.name}: ${a.message}` : (() => { try { return JSON.stringify(a) } catch { return String(a) } })())
  function push (level, ...args) {
    const row = { t: now(), level, msg: args.map(str).join(' ') }
    ring.push(row)
    if (ring.length > limit) ring.shift()
    if (echo) (console[level] ?? console.log)('[mm]', row.msg)
    for (const f of fns) { try { f(row) } catch {} }
    return row
  }
  return {
    push,
    info: (...a) => push('info', ...a),
    warn: (...a) => push('warn', ...a),
    error: (...a) => push('error', ...a),
    list: (n = 50) => ring.slice(-Math.max(0, Math.min(limit, Number(n) || 50))).map((r) => ({ ...r })),
    on (fn) { fns.add(fn); return () => fns.delete(fn) },
    get size () { return ring.length },
  }
}

// a bounded list of agent calls for the editor's Agent tab
export function makeCallLog ({ limit = 200, now = () => Date.now() } = {}) {
  const ring = []
  return {
    push (row) { ring.push({ t: now(), ...row }); if (ring.length > limit) ring.shift() },
    list: () => ring.map((r) => ({ ...r })),
  }
}
