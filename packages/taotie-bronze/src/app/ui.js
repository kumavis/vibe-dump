// Small DOM helpers for the museum-label chrome. Controls are plain inputs
// styled square and hairline in style.css — no widget library.

export function el(tag, attrs = {}, ...children) {
  const e = document.createElement(tag)
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue
    if (k === 'class') e.className = v
    else if (k === 'text') e.textContent = v
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v)
    else e.setAttribute(k, v === true ? '' : v)
  }
  for (const c of children.flat()) if (c != null) e.append(c)
  return e
}

const fmt = (v, step, unit) => {
  const d = step >= 1 ? 0 : step >= 0.1 ? 1 : 2
  return Number(v).toFixed(d) + (unit ? ' ' + unit : '')
}

/** Labelled range. onInput(value) fires live. Returns { el, set(v) }. */
export function slider({ label, min, max, step = 0.01, value, unit, onInput, cls }) {
  const val = el('span', { class: 'ctl-val', text: fmt(value, step, unit) })
  const input = el('input', { type: 'range', min, max, step, value, 'aria-label': label })
  input.addEventListener('input', () => {
    const v = parseFloat(input.value)
    val.textContent = fmt(v, step, unit)
    onInput(v)
  })
  const root = el('div', { class: 'ctl' + (cls ? ' ' + cls : '') }, el('div', { class: 'ctl-row' }, el('span', { class: 'ctl-label', text: label }), val), input)
  return {
    el: root,
    set(v) {
      input.value = v
      val.textContent = fmt(v, step, unit)
    },
  }
}

export function colorInput({ label, value, onInput }) {
  const input = el('input', { type: 'color', value, 'aria-label': label })
  input.addEventListener('input', () => onInput(input.value))
  const root = el('div', { class: 'ctl' }, el('div', { class: 'ctl-row' }, el('span', { class: 'ctl-label', text: label }), input))
  return { el: root, set: (v) => (input.value = v) }
}

export function selectInput({ label, options, value, onInput }) {
  const s = el('select', { 'aria-label': label }, options.map((o) => el('option', { value: o, text: o, selected: o === value })))
  s.addEventListener('change', () => onInput(s.value))
  const root = el('div', { class: 'ctl' }, el('div', { class: 'ctl-row' }, el('span', { class: 'ctl-label', text: label })), s)
  return { el: root, set: (v) => (s.value = v) }
}

export function toggleInput({ label, value, onInput }) {
  const c = el('input', { type: 'checkbox', checked: !!value, 'aria-label': label })
  c.addEventListener('change', () => onInput(c.checked))
  const root = el('label', { class: 'ctl toggle' }, el('span', { class: 'ctl-label', text: label }), c)
  return { el: root, set: (v) => (c.checked = !!v) }
}

/**
 * A row of chip buttons. items: [{ id, label }]. Returns { el, set(id) }.
 * `seg` renders them joined as a segmented control.
 */
export function chips(container, items, { value, onPick, seg = false } = {}) {
  const root = container || el('div')
  root.classList.add(seg ? 'seg' : 'chips')
  root.replaceChildren()
  const buttons = items.map((it) => {
    const b = el('button', { type: 'button', text: it.label ?? it.id, 'data-id': it.id })
    b.addEventListener('click', () => {
      set(it.id)
      onPick?.(it.id)
    })
    root.append(b)
    return b
  })
  function set(id) {
    for (const b of buttons) b.classList.toggle('on', b.dataset.id === id)
  }
  set(value)
  return { el: root, set }
}

export const yieldToBrowser = () => new Promise((r) => setTimeout(r, 0))
