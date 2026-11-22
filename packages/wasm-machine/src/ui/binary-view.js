// BINARY view: the whole module as hex beside the decoder's annotated byte
// tree. Hovering either side highlights the other; LEB128 values are broken
// into their 7-bit groups and continuation bits. Both sides are virtualised.
import { h, rafThrottle, esc, icon } from './dom.js'
import { annotate } from '../engine/index.js'
import { hex2, hexN, asciiChar, fmtBytes } from './format.js'

const RH = 20
const TH = 22

const KIND_CLASS = {
  magic: 'bk-magic', version: 'bk-magic', byte: 'bk-id', leb: 'bk-leb', valtype: 'bk-type', functype: 'bk-type', blocktype: 'bk-type',
  string: 'bk-str', opcode: 'bk-op', float: 'bk-num', bytes: 'bk-data', limits: 'bk-leb', code: 'bk-op', instr: 'bk-op', data: 'bk-data', field: 'bk-id',
}

export class BinaryView {
  constructor(session) {
    this.session = session
    this.tree = null
    this.expanded = new Set()
    this.hoverNode = null
    this.selNode = null
    this.hexSpacer = h('div', { class: 'bin-spacer' })
    this.hexRows = h('div', { class: 'bin-rows mono' })
    this.hexSpacer.appendChild(this.hexRows)
    this.hex = h('div', { class: 'bin-hex', tabindex: '0', role: 'region', 'aria-label': 'Module bytes' }, this.hexSpacer)
    this.treeSpacer = h('div', { class: 'bin-spacer' })
    this.treeRows = h('div', { class: 'bin-trows', role: 'tree', 'aria-label': 'Decoded structure' })
    this.treeSpacer.appendChild(this.treeRows)
    this.treeEl = h('div', { class: 'bin-tree', tabindex: '0' }, this.treeSpacer)
    this.detail = h('div', { class: 'bin-detail', 'aria-live': 'polite' })
    this.meta = h('span', { class: 'pane-meta' })
    this.el = h('section', { class: 'pane binary-pane', 'aria-label': 'Binary view' },
      h('div', { class: 'pane-head' }, h('span', { class: 'pane-label' }, 'Binary'), this.meta, h('span', { class: 'grow' }),
        h('span', { class: 'dim bin-hint' }, 'Hover bytes or tree nodes; click to pin.')),
      h('div', { class: 'bin-body' }, h('div', { class: 'bin-col' }, this.hex, this.detail), h('div', { class: 'bin-col tree-col' }, this.treeEl)))
    this.hex.addEventListener('scroll', rafThrottle(() => this.renderHex()))
    this.treeEl.addEventListener('scroll', rafThrottle(() => this.renderTree()))
    this.hexRows.addEventListener('mousemove', (e) => {
      const c = e.target.closest('[data-o]')
      this.setHover(c ? this.leafAt(+c.dataset.o) : null, 'hex')
    })
    this.hexRows.addEventListener('mouseleave', () => this.setHover(null))
    this.hexRows.addEventListener('click', (e) => {
      const c = e.target.closest('[data-o]')
      if (c) this.select(this.leafAt(+c.dataset.o), { scrollHex: false })
    })
    this.treeRows.addEventListener('mousemove', (e) => {
      const r = e.target.closest('[data-k]')
      this.setHover(r ? this.flat[+r.dataset.k].node : null, 'tree')
    })
    this.treeRows.addEventListener('mouseleave', () => this.setHover(null))
    this.treeRows.addEventListener('click', (e) => {
      const r = e.target.closest('[data-k]')
      if (!r) return
      const node = this.flat[+r.dataset.k].node
      if (e.target.closest('.tw') && node.children) this.toggle(node)
      else this.select(node, { scrollTree: false })
    })
    this.treeEl.addEventListener('keydown', (e) => this.onTreeKey(e))
    new ResizeObserver(() => { this.renderHex(); this.renderTree() }).observe(this.el)
  }

  /** Build the tree for the session's module bytes (lazily, when shown). */
  ensure() {
    const p = this.session.prog
    const bytes = p && p.bytes
    if (!bytes) {
      this.tree = null
      this.bytes = null
      this.hexRows.innerHTML = ''
      this.treeRows.innerHTML = ''
      this.detail.innerHTML = '<div class="empty-note">No binary: the source did not assemble.</div>'
      return
    }
    if (this.bytes === bytes) return
    this.bytes = bytes
    this.expanded.clear()
    this.selNode = this.hoverNode = null
    try {
      this.tree = annotate(bytes, { annotateBodies: bytes.length < 400_000 })
    } catch (e) {
      this.tree = { start: 0, end: bytes.length, label: 'undecodable bytes: ' + e.message, kind: 'bytes' }
    }
    this.leaves = []
    this.parent = new Map()
    const walk = (n, depth) => {
      if (n.children && n.children.length) for (const c of n.children) {
        this.parent.set(c, n)
        walk(c, depth + 1)
      }
      else this.leaves.push(n)
    }
    walk(this.tree, 0)
    this.leafStarts = this.leaves.map((l) => l.start)
    // open the module, its sections, and (for small modules) everything shallow
    const small = bytes.length < 4096
    const open = (n, d) => {
      if (!n.children) return
      if (d === 0 || (small && d < 5 && n.kind !== 'data' && n.kind !== 'subsection')) this.expanded.add(n)
      for (const c of n.children) open(c, d + 1)
    }
    open(this.tree, 0)
    this.meta.textContent = `${fmtBytes(bytes.length)} · ${this.tree.children ? this.tree.children.length : 0} parts`
    this.flatten()
    this.hex.scrollTop = 0
    this.treeEl.scrollTop = 0
    this.renderHex()
    this.renderTree()
    this.renderDetail()
  }

  leafAt(o) {
    const st = this.leafStarts
    if (!st || !st.length) return null
    let lo = 0
    let hi = st.length - 1
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1
      if (st[mid] <= o) lo = mid
      else hi = mid - 1
    }
    return this.leaves[lo]
  }

  flatten() {
    const out = []
    const walk = (n, d) => {
      out.push({ node: n, depth: d })
      if (n.children && this.expanded.has(n)) for (const c of n.children) walk(c, d + 1)
    }
    if (this.tree) walk(this.tree, 0)
    this.flat = out
    this.flatIndex = new Map(out.map((x, i) => [x.node, i]))
    this.treeSpacer.style.height = out.length * TH + 'px'
  }

  toggle(node) {
    if (this.expanded.has(node)) this.expanded.delete(node)
    else this.expanded.add(node)
    this.flatten()
    this.renderTree()
  }

  pathTo(node) {
    const out = []
    for (let n = node; n; n = this.parent.get(n)) out.unshift(n)
    return out
  }

  setHover(node, from) {
    if (node === this.hoverNode) return
    this.hoverNode = node
    this.hoverFrom = from
    this.renderHex()
    this.renderTree()
    this.renderDetail()
  }

  select(node, opts = {}) {
    if (!node) return
    this.selNode = node
    for (const n of this.pathTo(node).slice(0, -1)) this.expanded.add(n)
    this.flatten()
    if (opts.scrollTree !== false) {
      const i = this.flatIndex.get(node)
      if (i != null) this.treeEl.scrollTop = Math.max(0, i * TH - this.treeEl.clientHeight / 3)
    }
    if (opts.scrollHex !== false) {
      const row = Math.floor(node.start / 16)
      const vh = this.hex.clientHeight || 300
      if (row * RH < this.hex.scrollTop || row * RH > this.hex.scrollTop + vh - RH * 2) this.hex.scrollTop = Math.max(0, row * RH - vh / 3)
    }
    this.renderHex()
    this.renderTree()
    this.renderDetail()
  }

  /** Select the first node (depth-first) matching `pred`; returns it. */
  selectWhere(pred) {
    this.ensure()
    if (!this.tree) return null
    let found = null
    const walk = (n) => {
      if (found) return
      if (pred(n)) {
        found = n
        return
      }
      if (n.children) for (const c of n.children) walk(c)
    }
    walk(this.tree)
    if (found) this.select(found)
    return found
  }

  renderHex() {
    if (!this.bytes || this.el.offsetParent === null) return
    const bytes = this.bytes
    const nrows = Math.ceil(bytes.length / 16)
    this.hexSpacer.style.height = nrows * RH + 'px'
    // a small module's hex is short: let the detail card sit right under it
    this.hex.style.maxHeight = nrows * RH + 16 + 'px'
    const first = Math.max(0, Math.floor(this.hex.scrollTop / RH) - 2)
    const last = Math.min(nrows, first + Math.ceil((this.hex.clientHeight || 400) / RH) + 4)
    const hv = this.hoverNode
    const sel = this.selNode
    const ctx = hv ? this.parent.get(hv) : sel ? this.parent.get(sel) : null
    let html = ''
    for (let r = first; r < last; r++) {
      const o0 = r * 16
      let hx = ''
      let asc = ''
      for (let k = 0; k < 16; k++) {
        const o = o0 + k
        if (o >= bytes.length) break
        const leaf = this.leafAt(o)
        let cls = KIND_CLASS[leaf.kind] || 'bk-other'
        if (leaf.start === o) cls += ' ls'
        if (hv && o >= hv.start && o < hv.end) cls += ' hov'
        else if (sel && o >= sel.start && o < sel.end) cls += ' sel'
        else if (ctx && o >= ctx.start && o < ctx.end) cls += ' ctx'
        hx += `<span class="${cls}${k === 8 ? ' mid' : ''}" data-o="${o}">${hex2(bytes[o])}</span>`
        asc += esc(asciiChar(bytes[o]))
      }
      html += `<div class="hr" style="top:${r * RH}px"><span class="ho">${hexN(o0, 6)}</span><span class="hb">${hx}</span><span class="ha">${asc}</span></div>`
    }
    this.hexRows.innerHTML = html
  }

  renderTree() {
    if (!this.flat || this.el.offsetParent === null) return
    const first = Math.max(0, Math.floor(this.treeEl.scrollTop / TH) - 2)
    const last = Math.min(this.flat.length, first + Math.ceil((this.treeEl.clientHeight || 400) / TH) + 4)
    const hvPath = this.hoverNode ? new Set(this.pathTo(this.hoverNode)) : null
    // a hovered leaf inside a collapsed node: mark its deepest visible ancestor
    let hvShown = this.hoverNode
    while (hvShown && !this.flatIndex.has(hvShown)) hvShown = this.parent.get(hvShown)
    let html = ''
    for (let i = first; i < last; i++) {
      const { node, depth } = this.flat[i]
      const open = this.expanded.has(node)
      const has = node.children && node.children.length
      const cls = (node === hvShown ? ' hov' : hvPath && hvPath.has(node) ? ' onpath' : '') + (node === this.selNode ? ' sel' : '')
      html += `<div class="tn${cls}" data-k="${i}" role="treeitem" aria-level="${depth + 1}" ${has ? `aria-expanded="${open}"` : ''} style="top:${i * TH}px;padding-left:${8 + depth * 14}px">
        <span class="tw">${has ? (open ? '▾' : '▸') : ''}</span><span class="tk ${KIND_CLASS[node.kind] || ''}">${esc(node.kind)}</span><span class="tl">${esc(node.label)}</span><span class="tr mono">${hexN(node.start, 5)}</span></div>`
    }
    this.treeRows.innerHTML = html
    // a hovered hex byte: make sure its tree row is visible if it is in the flat list
    if (hvShown && this.hoverFrom === 'hex') {
      const k = this.flatIndex.get(hvShown)
      if (k != null && (k * TH < this.treeEl.scrollTop || k * TH > this.treeEl.scrollTop + this.treeEl.clientHeight - TH)) {
        this.treeEl.scrollTop = Math.max(0, k * TH - this.treeEl.clientHeight / 3)
      }
    }
  }

  renderDetail() {
    const n = this.hoverNode || this.selNode
    if (!n) {
      this.detail.innerHTML = '<div class="dim">Every byte belongs to exactly one leaf of the tree. Pick one to see how it is encoded.</div>'
      return
    }
    const bytes = this.bytes
    const len = n.end - n.start
    const shown = Array.from(bytes.subarray(n.start, Math.min(n.end, n.start + 24)), hex2).join(' ') + (len > 24 ? ' …' : '')
    let html = `<div class="bd-h"><span class="tk ${KIND_CLASS[n.kind] || ''}">${esc(n.kind)}</span> ${esc(n.label)}</div>
      <div class="bd-r mono"><span class="dim">bytes</span> 0x${hexN(n.start, 5)}–0x${hexN(n.end - 1, 5)} <span class="dim">(${len} B)</span> · ${shown}</div>`
    const path = this.pathTo(n).slice(1, -1).map((x) => esc(x.label)).join(' <span class="dim">›</span> ')
    if (path) html += `<div class="bd-path">${path}</div>`
    if (n.kind === 'leb' || (len <= 10 && /LEB128/.test(n.label))) html += lebBreakdown(bytes, n.start, n.end, /signed/.test(n.label))
    this.detail.innerHTML = html
  }

  onTreeKey(e) {
    const cur = this.selNode ? this.flatIndex.get(this.selNode) : -1
    let k = null
    if (e.key === 'ArrowDown') k = Math.min(this.flat.length - 1, cur + 1)
    else if (e.key === 'ArrowUp') k = Math.max(0, cur - 1)
    else if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'Enter') && this.selNode && this.selNode.children) {
      const open = this.expanded.has(this.selNode)
      if ((e.key === 'ArrowRight' && !open) || (e.key === 'ArrowLeft' && open) || e.key === 'Enter') this.toggle(this.selNode)
      e.preventDefault()
      e.stopPropagation()
      return
    }
    if (k == null) return
    e.preventDefault()
    e.stopPropagation()
    this.select(this.flat[k].node)
  }
}

/** HTML explaining a LEB128 encoding byte by byte. */
export function lebBreakdown(bytes, start, end, signed) {
  let rows = ''
  let value = 0n
  let shift = 0n
  const parts = []
  for (let o = start; o < end; o++) {
    const b = bytes[o]
    const more = (b & 0x80) !== 0
    const g = BigInt(b & 0x7f)
    value |= g << shift
    parts.push(`${g}·2<sup>${shift}</sup>`)
    rows += `<div class="leb-r"><span class="mono">${hex2(b)}</span><span class="mono leb-bits"><b class="${more ? 'cont' : 'stop'}" title="continuation bit">${more ? 1 : 0}</b>${(b & 0x7f).toString(2).padStart(7, '0')}</span><span class="dim">${more ? 'more bytes follow' : 'last byte'} · group ${(b & 0x7f)}</span></div>`
    shift += 7n
  }
  const lastB = bytes[end - 1]
  let note = ''
  if (signed && lastB & 0x40) {
    const v = value - (1n << shift)
    note = ` ; bit ${shift - 1n} set → negative: ${value} − 2<sup>${shift}</sup> = <b>${v}</b>`
    value = v
  }
  return `<div class="leb"><div class="leb-h">${signed ? 'signed' : 'unsigned'} LEB128: low 7 bits of each byte, least significant group first; the high bit says whether another byte follows.</div>${rows}<div class="leb-sum mono">= ${parts.join(' + ')}${note || ` = <b>${value}</b>`}</div></div>`
}
