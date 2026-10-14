// PLACEHOLDER — replaced by the store work.
import './store.css'

let opts = null

export function openStore(o) {
  opts = o
  o.root.innerHTML = '<div class="panel small"><h2>Store</h2><p class="lead">Coming soon.</p><div class="buttons"><button type="button" class="sel" data-close>Back</button></div></div>'
  o.root.querySelector('[data-close]').addEventListener('click', () => close())
}

function close() {
  const o = opts
  opts = null
  o?.onClose()
}

export function storeKey(e) {
  if (e.code === 'Escape' || e.code === 'Enter') close()
}
