// The smallest DOM main.js survives on: every element accepts anything, and
// `document.querySelector` hands back one persistent element per selector, so
// a handler main.js assigns (`$('#endPhase').onclick = …`) can be called later.
// Import this before main.js; requestAnimationFrame only queues, and the
// runner pumps frames itself with takeFrame().
const ctx2d = new Proxy({}, {
  get: (t, k) => (k in t ? t[k] : k === 'createRadialGradient' || k === 'createLinearGradient' ? () => ({ addColorStop() {} }) : () => {}),
  set: (t, k, v) => ((t[k] = v), true),
})
class El {
  constructor(tag = 'div') {
    this.tagName = tag.toUpperCase(); this.children = []; this.style = {}; this.dataset = {}; this.parentNode = null
    const set = new Set()
    this.classList = {
      add: (...c) => c.forEach((x) => set.add(x)),
      remove: (...c) => c.forEach((x) => set.delete(x)),
      toggle: (c, on) => ((on ?? !set.has(c)) ? set.add(c) : set.delete(c)),
      contains: (c) => set.has(c),
    }
    this._html = ''; this.textContent = ''; this.value = ''; this.offsetWidth = 0; this.width = 0; this.height = 0
  }
  set innerHTML(v) { this._html = v; if (v === '') this.children.length = 0 }
  get innerHTML() { return this._html }
  get lastChild() { return this.children[this.children.length - 1] }
  appendChild(c) { c.parentNode = this; this.children.push(c); return c }
  prepend(c) { c.parentNode = this; this.children.unshift(c) }
  remove() { const p = this.parentNode; if (p) { const i = p.children.indexOf(this); if (i >= 0) p.children.splice(i, 1) } this.parentNode = null }
  addEventListener() {} removeEventListener() {} setPointerCapture() {} releasePointerCapture() {}
  getContext() { return ctx2d }
  getBoundingClientRect() { return { left: 0, top: 0, width: 1280, height: 800 } }
  querySelector() { return new El() } querySelectorAll() { return [] }
}
const byId = new Map()
globalThis.document = {
  body: new El('body'), documentElement: new El('html'),
  createElement: (t) => new El(t),
  querySelector: (s) => { if (!byId.has(s)) byId.set(s, new El()); return byId.get(s) },
  querySelectorAll: () => [],
  addEventListener() {},
}
let rafCb = null
Object.assign(globalThis, {
  window: globalThis, innerWidth: 1280, innerHeight: 800, devicePixelRatio: 1,
  addEventListener() {}, removeEventListener() {},
  requestAnimationFrame: (cb) => { rafCb = cb; return 1 },
  localStorage: { getItem: () => null, setItem() {} },
})
Object.defineProperty(globalThis, 'navigator', { value: { userAgent: 'node' }, configurable: true })
export const takeFrame = () => { const cb = rafCb; rafCb = null; return cb }
