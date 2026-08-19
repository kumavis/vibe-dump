export function h (tag, props = {}, ...children) {
  const node = document.createElement(tag)
  for (const [key, value] of Object.entries(props)) {
    if (value == null || value === false) continue
    if (key === 'class') node.className = value
    else if (key === 'style' && typeof value === 'object') Object.assign(node.style, value)
    else if (key === 'vars') for (const [k, v] of Object.entries(value)) node.style.setProperty(k, v)
    else if (key === 'html') node.innerHTML = value
    else if (key.startsWith('on')) node.addEventListener(key.slice(2).toLowerCase(), value)
    else if (key in node && key !== 'list') node[key] = value
    else node.setAttribute(key, value)
  }
  for (const child of children.flat(Infinity)) {
    if (child == null || child === false) continue
    node.append(child.nodeType ? child : document.createTextNode(String(child)))
  }
  return node
}

export const $ = (sel, root = document) => root.querySelector(sel)

/** A row of mutually exclusive buttons. */
export function segmented ({ label, options, value, accent, onChange }) {
  const seg = h('div', { class: 'seg' })
  const buttons = options.map((opt) => {
    const btn = h('button', {
      type: 'button',
      class: opt.value === value ? 'on' : '',
      'data-value': opt.value,
      'data-accent': accent || null,
      title: opt.title || '',
      onClick: () => {
        for (const b of buttons) b.classList.toggle('on', b === btn)
        onChange(opt.value)
      },
    }, opt.label)
    if (opt.warn) btn.append(h('span', { class: 'warn', title: opt.warn }, '△'))
    return btn
  })
  seg.append(...buttons)
  const root = h('div', { class: 'ctl' }, label && h('div', { class: 'ctl-label' }, label), seg)
  root.setValue = (v) => { for (const b of buttons) b.classList.toggle('on', b.dataset.value === v) }
  return root
}

export const fmt = (n, digits = 3) => (n < 0 ? '−' : '') + Math.abs(n).toFixed(digits)
