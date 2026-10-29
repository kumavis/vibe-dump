// Double-buffered event bus: what is emitted during tick N (by any system, the
// editor or a script) is read by every system during tick N+1. Each system sees
// the whole set once, whatever its order, which keeps peers deterministic.
//
// Events are read by every system and by doc scripts: each gets the same deep-
// frozen plain copy, so nobody can change what the others see (and an event
// that carried a live array does not freeze the live array itself).
function frozenCopy (v) {
  if (v == null || typeof v !== 'object') return v
  if (Object.isFrozen(v) && Array.isArray(v) === false && Object.values(v).every((x) => x == null || typeof x !== 'object')) return v
  const o = Array.isArray(v) ? v.map(frozenCopy) : Object.fromEntries(Object.entries(v).map(([k, x]) => [k, frozenCopy(x)]))
  return Object.freeze(o)
}

export function makeEvents ({ max = 10000 } = {}) {
  let current = []
  let next = []
  let dropped = 0
  return {
    emit (ev) {
      if (!ev || typeof ev.type !== 'string') throw new TypeError('event must be {type, ...}')
      if (next.length >= max) { dropped++; return }
      next.push(frozenCopy(ev))
    },
    events (type) { return type == null ? current : current.filter((e) => e.type === type) },
    pending () { return next },
    swap () { current = Object.freeze(next); next = []; return current },
    get dropped () { return dropped },
  }
}
