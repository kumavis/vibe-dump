// Local undo/redo over inverse ops (design §2.3): every editor write returns
// { results, inverse } from applyOps, and undo applies that inverse as a new
// change. This is not CRDT undo — a peer's later edit to the same field stays
// put if it landed after ours, and an inverse that no longer validates (the
// entity was despawned elsewhere) is dropped with an error rather than wedging
// the stack.
//
// Coalescing: a slider drag or a long drag commit writes many times; records
// that share a `key` inside `coalesceMs` collapse into one step. The OLDEST
// inverse is kept, which restores the state before the gesture began, so a key
// must name one field (or one gesture) — that is how the editor uses it.
export function makeUndo ({ applyOps, limit = 200, coalesceMs = 1200, now = () => Date.now() } = {}) {
  if (typeof applyOps !== 'function') throw new TypeError('makeUndo needs applyOps(ops, { message })')
  const undoStack = []
  const redoStack = []
  const listeners = new Set()
  const notify = () => { for (const fn of listeners) { try { fn() } catch (e) { console.error('[undo] listener', e) } } }

  const usable = (inv) => Array.isArray(inv) && inv.length > 0

  function record (inverse, message = 'edit', { key } = {}) {
    if (!usable(inverse)) return false
    const t = now()
    const top = undoStack[undoStack.length - 1]
    if (key && top && top.key === key && t - top.at <= coalesceMs) {
      top.at = t // extend the gesture; keep its first inverse
    } else {
      undoStack.push({ inverse: inverse.slice(), message, key: key ?? null, at: t })
      if (undoStack.length > limit) undoStack.shift()
    }
    redoStack.length = 0
    notify()
    return true
  }

  // move one entry from `from` to `to`, applying its inverse; the inverse of
  // that application is what the opposite direction will apply
  function step (from, to, verb) {
    const entry = from.pop()
    if (!entry) return null
    try {
      const out = applyOps(entry.inverse, { message: `${verb}: ${entry.message}` })
      if (usable(out?.inverse)) to.push({ inverse: out.inverse, message: entry.message, key: null, at: now() })
      notify()
      return { ok: true, message: entry.message }
    } catch (error) {
      notify()
      return { ok: false, message: entry.message, error }
    }
  }

  return {
    record,
    undo: () => step(undoStack, redoStack, 'undo'),
    redo: () => step(redoStack, undoStack, 'redo'),
    get canUndo () { return undoStack.length > 0 },
    get canRedo () { return redoStack.length > 0 },
    peek: () => ({ undo: undoStack[undoStack.length - 1]?.message ?? null, redo: redoStack[redoStack.length - 1]?.message ?? null }),
    clear () { undoStack.length = 0; redoStack.length = 0; notify() },
    onChange (fn) { listeners.add(fn); return () => listeners.delete(fn) },
  }
}
