// Boot overlay (while the wasm and the doc load), the error overlay (anything
// that kills boot), and banners (safe mode, lockdown missing, read-only).
// Plain DOM against elements index.html ships, so it works before the editor.
const $ = (id) => document.getElementById(id)

export function bootStatus (text, { waiting = false } = {}) {
  const el = $('boot'); if (!el) return
  el.hidden = false
  el.classList.toggle('waiting', !!waiting)
  const msg = el.querySelector('.msg'); if (msg) msg.textContent = text
}

export function hideBoot () {
  const el = $('boot'); if (!el) return
  el.classList.add('done')
  setTimeout(() => { el.hidden = true }, 400)
}

export function showBootError (e) {
  const text = String(e?.stack ?? e?.message ?? e)
  console.error('[boot] failed', e)
  globalThis.__mm = { ...(globalThis.__mm ?? {}), error: text }
  const boot = $('boot'); if (boot) boot.hidden = true
  const el = $('boot-error'); if (!el) return
  el.hidden = false
  const pre = el.querySelector('pre'); if (pre) pre.textContent = text
}

// banner({ id, text, level: 'warn'|'error'|'info', actions: [{ label, onClick }] }) -> { remove(), set(text) }
export function banner ({ id, text, level = 'warn', actions = [] }) {
  const host = $('banners'); if (!host) return { remove () {}, set () {} }
  let el = id ? host.querySelector(`[data-id="${id}"]`) : null
  if (!el) { el = document.createElement('div'); if (id) el.dataset.id = id; host.append(el) }
  el.className = `banner ${level}`
  const span = document.createElement('span'); span.textContent = text
  el.replaceChildren(span)
  for (const a of actions) {
    const b = document.createElement('button'); b.type = 'button'; b.textContent = a.label
    b.addEventListener('click', () => a.onClick())
    el.append(b)
  }
  const close = document.createElement('button'); close.type = 'button'; close.className = 'close'; close.textContent = '×'; close.title = 'dismiss'
  close.addEventListener('click', () => el.remove())
  el.append(close)
  return { remove: () => el.remove(), set: (t) => { span.textContent = t } }
}
