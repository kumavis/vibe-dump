// Small DOM helpers shared by the interface modules.

export const $ = (sel, root = document) => root.querySelector(sel)

export const h = (tag, attrs = {}, html = '') => {
  const el = document.createElement(tag)
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') el.className = v
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v)
    else el.setAttribute(k, v)
  }
  if (html) el.innerHTML = html
  return el
}

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }
/** Text from the data files is set as text, never as markup. */
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ESC[c])
