// Keyboard map (design §9, §10) as a pure function, so the bindings are tested
// and the app's handler is one switch. Text fields keep their keys: native
// undo inside a textarea beats doc undo, and Tab must still move focus there.
const TEXT_TYPES = new Set(['text', 'search', 'number', 'email', 'url', 'password', ''])

export function isTextTarget (t) {
  if (!t || typeof t !== 'object') return false
  const tag = String(t.tagName ?? '').toUpperCase()
  if (tag === 'TEXTAREA' || tag === 'SELECT') return true
  if (tag === 'INPUT') return TEXT_TYPES.has(String(t.type ?? '').toLowerCase())
  return !!t.isContentEditable
}

// ev: { key, code, ctrlKey, metaKey, shiftKey, altKey, repeat, target }
export function keyAction (ev) {
  const mod = !!(ev.ctrlKey || ev.metaKey)
  const key = String(ev.key ?? '')
  const lower = key.length === 1 ? key.toLowerCase() : key
  const text = isTextTarget(ev.target)
  if (key === 'Escape') return 'escape' // always: leaves a field, a drag, a placement
  if (text) return null
  if (mod && lower === 'z') return ev.shiftKey ? 'redo' : 'undo'
  if (mod && lower === 'y') return 'redo'
  if (mod || ev.altKey) return null
  if (ev.repeat && key !== 'Delete') return null
  switch (lower) {
    case 'Tab': return 'toggleMode'
    case 'e': return 'mount'
    case 'f': return 'focus'
    case 'g': return 'grab'
    case 'Delete': case 'Backspace': return 'delete'
    case '/': return 'search'
    default: return null
  }
}
