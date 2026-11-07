// view.js — SVG rendering of the social graph and the expanded flow network.
//
// Both views are drawn from the same account positions so a reader can map
// one onto the other: in the flow network every account's circle becomes an
// in-node and an out-node forty units apart, the synthetic source sits where
// the reader dragged it, and the shared sink is a bar along the bottom.
// Rendering rebuilds the SVG markup on every state change; the graphs here are
// small enough that this is simpler and faster than reconciling nodes.

import { SOURCE, levelName } from './metric.js'

export const VIEW = { w: 960, h: 600 }
const R = 21 // account radius, social view
const RF = 13 // in/out node radius, flow view
const SPLIT = 22 // half the distance between in and out
const SINK_Y = 572
const CURVE = 26

const LEVEL_DASH = { 1: '2 5', 2: '9 6', 3: '' }
const LEVEL_LETTER = { 1: 'A', 2: 'J', 3: 'M' }

export function esc(s) {
  return String(s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch])
}

const fmt = (n) => (Math.round(n * 10) / 10).toString()

// Straight or curved connector between two points, trimmed by the radii so the
// arrowhead tip lands on the target's rim. `bend` > 0 curves to the right.
function connector(a, b, ra, rb, bend) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.hypot(dx, dy) || 1
  const ux = dx / len
  const uy = dy / len
  const p0 = { x: a.x + ux * ra, y: a.y + uy * ra }
  const p2 = { x: b.x - ux * (rb + 3), y: b.y - uy * (rb + 3) }
  if (!bend) {
    return { d: `M${fmt(p0.x)},${fmt(p0.y)} L${fmt(p2.x)},${fmt(p2.y)}`, mid: { x: (p0.x + p2.x) / 2, y: (p0.y + p2.y) / 2 } }
  }
  const nx = -uy * bend
  const ny = ux * bend
  const c = { x: (p0.x + p2.x) / 2 + nx, y: (p0.y + p2.y) / 2 + ny }
  // nudge the endpoints along the normal too so the curve leaves the rim cleanly
  const q0 = { x: a.x + ux * ra * 0.8 + nx * 0.25, y: a.y + uy * ra * 0.8 + ny * 0.25 }
  const q2 = { x: b.x - ux * (rb + 3) * 0.9 + nx * 0.25, y: b.y - uy * (rb + 3) * 0.9 + ny * 0.25 }
  const mid = { x: 0.25 * q0.x + 0.5 * c.x + 0.25 * q2.x, y: 0.25 * q0.y + 0.5 * c.y + 0.25 * q2.y }
  return { d: `M${fmt(q0.x)},${fmt(q0.y)} Q${fmt(c.x)},${fmt(c.y)} ${fmt(q2.x)},${fmt(q2.y)}`, mid }
}

const DEFS = `
<defs>
  ${['base', 'dim', 'flow', 'path', 'rev', 'drop', 'sel']
    .map(
      (k) =>
        `<marker id="arrow-${k}" class="arrow arrow-${k}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto" markerUnits="userSpaceOnUse"><path d="M0.5,1 L9,5 L0.5,9 z"/></marker>`,
    )
    .join('')}
</defs>`

// What state an account is in for the current snapshot.
export function accountState(snap, ix) {
  if (!snap || !snap.dist || snap.dist[ix] == null) return 'pending'
  if (snap.dist[ix] < 0) return 'unreachable'
  if (snap.accepted) return snap.accepted[ix] ? 'accepted' : 'rejected'
  if (snap.flow && snap.flow.nodeSink[ix] === 1) return 'accepted'
  return 'reachable'
}

const GLYPH = { accepted: '✓', rejected: '✕', unreachable: '–', reachable: '·', pending: '' }

// model: { graph, view, snap, net, selection, certPending, sourcePos, bottlenecks:Set<ix>, pathSet }
export function renderGraph(svg, model) {
  const { graph, view, snap, net, selection, certPending, sourcePos } = model
  const ixOf = (id) => net.indexOf.get(id)
  const pos = new Map(graph.accounts.map((a) => [a.id, { x: a.x, y: a.y }]))
  const showSource = !!(snap && snap.showSource)
  const flowView = view === 'flow'
  // the accessible name/description live inside the svg, so they are re-emitted
  // on every render; main.js fills the description after each draw
  const parts = ['<title id="graph-title">Certification graph</title><desc id="graph-desc"></desc>', DEFS]
  const pathPoints = []

  // which edges carry the highlighted augmenting path, and in which direction
  const onPath = new Map() // edge index → dir
  const throughOnPath = new Map() // node ix → dir
  const sinkOnPath = new Set()
  if (snap && snap.path) {
    for (const step of snap.path) {
      if (step.kind === 'edge') onPath.set(step.edge, step.dir)
      else if (step.kind === 'through') throughOnPath.set(step.node, step.dir)
      else if (step.kind === 'sink') sinkOnPath.add(step.node)
    }
  }

  // ─── geometry helpers for both views
  const srcCenter = { x: sourcePos.x, y: sourcePos.y }
  const centerOf = (ix) => (ix === SOURCE ? srcCenter : pos.get(net.nodes[ix].id))
  const inOf = (ix) => {
    const c = centerOf(ix)
    return { x: c.x - SPLIT, y: c.y }
  }
  const outOf = (ix) => {
    const c = centerOf(ix)
    return { x: c.x + SPLIT, y: c.y }
  }
  const reverseExists = new Set()
  for (const e of net.edges) {
    const back = net.edges.some((f) => f.src === e.dst && f.dst === e.src)
    if (back) reverseExists.add(e)
  }

  if (flowView) {
    // the shared sink
    parts.push(
      `<g class="sink"><line x1="40" y1="${SINK_Y}" x2="${VIEW.w - 40}" y2="${SINK_Y}"/><text x="${VIEW.w - 44}" y="${SINK_Y + 18}" text-anchor="end">shared sink · each in-node may send 1 unit</text></g>`,
    )
  }

  // ─── edges
  for (let e = 0; e < net.edges.length; e++) {
    const edge = net.edges[e]
    if (edge.src === SOURCE && !showSource) continue
    const cert = edge.cert == null ? null : graph.certs.find((c) => c.id === edge.cert)
    const level = cert ? cert.level : 0
    const a = flowView ? outOf(edge.src) : centerOf(edge.src)
    const b = flowView ? inOf(edge.dst) : centerOf(edge.dst)
    const ra = flowView ? RF : edge.src === SOURCE ? 16 : R
    const rb = flowView ? RF : R
    const bend = reverseExists.has(edge) ? CURVE : 0
    const { d, mid } = connector(a, b, ra, rb, bend)
    const flow = snap && snap.flow ? snap.flow.edgeFlow[e] : 0
    const dir = onPath.get(e)
    const cls = ['edge']
    if (edge.src === SOURCE) cls.push('edge-source')
    if (flow > 0) cls.push('has-flow')
    if (dir === 1) cls.push('on-path')
    if (dir === -1) cls.push('on-path-rev')
    if (selection && selection.type === 'cert' && cert && selection.id === cert.id) cls.push('selected')
    const marker = dir === 1 ? 'path' : dir === -1 ? 'rev' : selection && selection.type === 'cert' && cert && selection.id === cert.id ? 'sel' : flow > 0 ? 'flow' : 'base'
    const dash = cert ? LEVEL_DASH[level] : '1 0'
    const width = flowView && flow > 0 ? 1.5 + Math.min(flow, 6) * 0.9 : null
    parts.push(
      `<g class="${cls.join(' ')}" ${cert ? `data-cert="${cert.id}"` : ''}>` +
        `<path class="edge-hit" d="${d}"/>` +
        `<path class="edge-line" d="${d}" marker-end="url(#arrow-${marker})" ${dash ? `stroke-dasharray="${dash}"` : ''} ${width ? `stroke-width="${width}"` : ''}/>` +
        (cert && !flowView
          ? `<g class="edge-label edge-label-${level}" transform="translate(${fmt(mid.x)},${fmt(mid.y)})"><circle r="8"/><text dy="3.4">${LEVEL_LETTER[level]}</text></g>`
          : '') +
        (flowView && flow > 0
          ? `<g class="flow-label" transform="translate(${fmt(mid.x)},${fmt(mid.y)})"><rect x="-9" y="-8" width="18" height="16" rx="4"/><text dy="3.6">${flow}</text></g>`
          : '') +
        `</g>`,
    )
  }

  // dropped certifications (below threshold) are drawn faint, with no arrowhead
  // competing for attention, so the reader sees what the threshold removed
  if (snap && snap.retained) {
    for (const c of graph.certs) {
      if (snap.retained.has(c.id) || c.from === c.to) continue
      const a = flowView ? outOf(ixOf(c.from)) : centerOf(ixOf(c.from))
      const b = flowView ? inOf(ixOf(c.to)) : centerOf(ixOf(c.to))
      const back = graph.certs.some((f) => f.from === c.to && f.to === c.from)
      const { d, mid } = connector(a, b, flowView ? RF : R, flowView ? RF : R, back ? CURVE : 0)
      const sel = selection && selection.type === 'cert' && selection.id === c.id
      parts.push(
        `<g class="edge edge-dropped${sel ? ' selected' : ''}" data-cert="${c.id}"><path class="edge-hit" d="${d}"/><path class="edge-line" d="${d}" marker-end="url(#arrow-${sel ? 'sel' : 'drop'})" stroke-dasharray="${LEVEL_DASH[c.level] || '1 0'}"/>` +
          (!flowView
            ? `<g class="edge-label edge-label-${c.level} dropped" transform="translate(${fmt(mid.x)},${fmt(mid.y)})"><circle r="8"/><text dy="3.4">${LEVEL_LETTER[c.level]}</text></g>`
            : '') +
          `</g>`,
      )
    }
  } else if (!snap || !snap.retained) {
    // no filter step yet: every cert is drawn as live above (net was built at
    // the current threshold, so dropped ones need drawing here too)
    for (const c of graph.certs) {
      if (net.kept.includes(c.id) || c.from === c.to) continue
      const a = flowView ? outOf(ixOf(c.from)) : centerOf(ixOf(c.from))
      const b = flowView ? inOf(ixOf(c.to)) : centerOf(ixOf(c.to))
      const back = graph.certs.some((f) => f.from === c.to && f.to === c.from)
      const { d, mid } = connector(a, b, flowView ? RF : R, flowView ? RF : R, back ? CURVE : 0)
      const sel = selection && selection.type === 'cert' && selection.id === c.id
      parts.push(
        `<g class="edge${sel ? ' selected' : ''}" data-cert="${c.id}"><path class="edge-hit" d="${d}"/><path class="edge-line" d="${d}" marker-end="url(#arrow-${sel ? 'sel' : 'base'})" stroke-dasharray="${LEVEL_DASH[c.level] || '1 0'}"/>` +
          (!flowView
            ? `<g class="edge-label edge-label-${c.level}" transform="translate(${fmt(mid.x)},${fmt(mid.y)})"><circle r="8"/><text dy="3.4">${LEVEL_LETTER[c.level]}</text></g>`
            : '') +
          `</g>`,
      )
    }
  }

  // ─── nodes
  const drawNode = (ix) => {
    const node = net.nodes[ix]
    const isSource = ix === SOURCE
    const c = centerOf(ix)
    const state = isSource ? (snap && snap.dist ? (snap.accepted ? 'accepted' : 'reachable') : 'pending') : accountState(snap, ix)
    const cls = ['node', `state-${state}`]
    if (!isSource && node.seed) cls.push('seed')
    if (isSource) cls.push('source')
    if (!isSource && selection && selection.type === 'account' && selection.id === node.id) cls.push('selected')
    if (!isSource && certPending === node.id) cls.push('cert-pending')
    if (model.bottlenecks && model.bottlenecks.has(ix)) cls.push('bottleneck')
    if (throughOnPath.has(ix) || sinkOnPath.has(ix)) cls.push('on-path')
    const dist = snap && snap.dist ? snap.dist[ix] : null
    const cap = snap && snap.cap ? snap.cap[ix] : null
    const fl = snap && snap.flow ? snap.flow : null
    const tag = node.tag ? `<text class="tag" x="${fmt(c.x)}" y="${fmt(c.y + (flowView ? 52 : 48))}" text-anchor="middle">demo label: ${esc(node.tag)}</text>` : ''
    const data = isSource
      ? 'data-source="1" tabindex="0" role="button" aria-label="synthetic source"'
      : `data-account="${node.id}" tabindex="0" role="button" aria-label="${esc(node.name)}${node.seed ? ', seed' : ''}, ${state}"`

    if (!flowView) {
      const info = dist == null ? '' : dist < 0 ? 'unreachable' : `d${dist} · c${cap}` + (fl ? ` · ${fl.nodeSink[ix]}+${fl.nodeFlow[ix]}` : '')
      parts.push(
        `<g class="${cls.join(' ')}" ${data} transform="translate(${fmt(c.x)},${fmt(c.y)})">` +
          (isSource
            ? `<rect x="-16" y="-16" width="32" height="32" rx="6" class="body"/><text class="name" y="-24" text-anchor="middle">source</text>`
            : `<circle r="${R}" class="body"/>` + (node.seed ? `<circle r="${R + 5}" class="seed-ring"/>` : '')) +
          (isSource ? '' : `<text class="name" y="${R + 15}" text-anchor="middle">${esc(node.name)}</text>`) +
          (isSource ? '' : `<text class="info" y="${R + 28}" text-anchor="middle">${info}</text>`) +
          (GLYPH[state] && !isSource ? `<g class="badge" transform="translate(${R - 4},${-R + 4})"><circle r="8"/><text dy="3.6" text-anchor="middle">${GLYPH[state]}</text></g>` : '') +
          (isSource ? `<text class="glyph" dy="4" text-anchor="middle">−</text>` : `<text class="glyph" dy="4.5" text-anchor="middle">${esc(initials(node.name))}</text>`) +
          (node.seed && !isSource ? `<text class="seed-label" y="${-R - 9}" text-anchor="middle">seed</text>` : '') +
          (model.bottlenecks && model.bottlenecks.has(ix) ? `<text class="bn" y="${R + 41}" text-anchor="middle">bottleneck</text>` : '') +
          tag +
          `</g>`,
      )
      return
    }

    // flow view: in-node, out-node, through edge, sink edge
    const pin = inOf(ix)
    const pout = outOf(ix)
    const unreachable = dist != null && dist < 0
    const capT = snap && snap.capThrough ? snap.capThrough[ix] : null
    const through = fl ? fl.nodeFlow[ix] : 0
    const sink = fl ? fl.nodeSink[ix] : 0
    const tdir = throughOnPath.get(ix)
    const sinkCls = ['sink-edge', sink ? 'has-flow' : 'empty', sinkOnPath.has(ix) ? 'on-path' : ''].join(' ')
    const thCls = ['through', through > 0 ? 'has-flow' : '', tdir === 1 ? 'on-path' : tdir === -1 ? 'on-path-rev' : '', capT === 0 ? 'zero' : ''].join(' ')
    const thMarker = tdir === 1 ? 'path' : tdir === -1 ? 'rev' : through > 0 ? 'flow' : 'base'
    const expanded = snap && snap.expanded
    parts.push(
      `<g class="${cls.join(' ')} split${expanded ? ' expanded' : ''}" ${data}>` +
        (unreachable || !expanded
          ? ''
          : `<line class="${sinkCls}" x1="${fmt(pin.x)}" y1="${fmt(pin.y + RF)}" x2="${fmt(pin.x)}" y2="${SINK_Y - 3}" marker-end="url(#arrow-${sinkOnPath.has(ix) ? 'path' : sink ? 'flow' : 'dim'})"/>` +
            (sink ? `<g class="flow-label" transform="translate(${fmt(pin.x)},${fmt(pin.y + 40)})"><rect x="-9" y="-8" width="18" height="16" rx="4"/><text dy="3.6">1</text></g>` : '')) +
        `<line class="${thCls}" x1="${fmt(pin.x + RF)}" y1="${fmt(pin.y)}" x2="${fmt(pout.x - RF - 3)}" y2="${fmt(pout.y)}" marker-end="url(#arrow-${thMarker})"/>` +
        `<circle class="body in" cx="${fmt(pin.x)}" cy="${fmt(pin.y)}" r="${RF}"/>` +
        `<circle class="body out" cx="${fmt(pout.x)}" cy="${fmt(pout.y)}" r="${RF}"/>` +
        (node.seed && !isSource ? `<circle class="seed-ring" cx="${fmt(c.x)}" cy="${fmt(c.y)}" r="${SPLIT + RF + 4}"/>` : '') +
        `<text class="port" x="${fmt(pin.x)}" y="${fmt(pin.y)}" dy="3.4" text-anchor="middle">in</text>` +
        `<text class="port" x="${fmt(pout.x)}" y="${fmt(pout.y)}" dy="3.4" text-anchor="middle">out</text>` +
        `<text class="name" x="${fmt(c.x)}" y="${fmt(c.y - RF - 9 - (node.seed && !isSource ? 22 : 0))}" text-anchor="middle">${isSource ? 'source' : esc(node.name)}${node.seed && !isSource ? ' (seed)' : ''}</text>` +
        (expanded && !unreachable
          ? `<text class="info" x="${fmt(c.x)}" y="${fmt(c.y + RF + 15)}" text-anchor="middle">${through}/${capT}</text>`
          : dist != null && unreachable
            ? `<text class="info" x="${fmt(c.x)}" y="${fmt(c.y + RF + 15)}" text-anchor="middle">unreachable</text>`
            : cap != null
              ? `<text class="info" x="${fmt(c.x)}" y="${fmt(c.y + RF + 15)}" text-anchor="middle">d${dist} · c${cap}</text>`
              : '') +
        (GLYPH[state] && !isSource ? `<g class="badge" transform="translate(${fmt(pout.x + RF - 3)},${fmt(pout.y - RF + 1)})"><circle r="7"/><text dy="3.2" text-anchor="middle">${GLYPH[state]}</text></g>` : '') +
        (model.bottlenecks && model.bottlenecks.has(ix) ? `<text class="bn" x="${fmt(c.x)}" y="${fmt(c.y + RF + 28)}" text-anchor="middle">bottleneck</text>` : '') +
        tag +
        `</g>`,
    )
  }

  for (let ix = 1; ix < net.nodes.length; ix++) drawNode(ix)
  if (showSource) drawNode(SOURCE)

  // ─── the path as a polyline, for the animated dot
  if (snap && snap.path) {
    for (const step of snap.path) {
      if (step.kind === 'start') pathPoints.push(flowView ? inOf(SOURCE) : centerOf(SOURCE))
      else if (step.kind === 'through') pathPoints.push(flowView ? (step.dir === 1 ? outOf(step.node) : inOf(step.node)) : centerOf(step.node))
      else if (step.kind === 'edge') {
        const edge = net.edges[step.edge]
        const to = step.dir === 1 ? edge.dst : edge.src
        pathPoints.push(flowView ? (step.dir === 1 ? inOf(to) : outOf(to)) : centerOf(to))
      } else if (step.kind === 'sink') pathPoints.push(flowView ? { x: inOf(step.node).x, y: SINK_Y - 6 } : centerOf(step.node))
    }
  }

  svg.innerHTML = parts.join('')
  return { pathPoints }
}

function initials(name) {
  const s = String(name).trim()
  if (s.length <= 3) return s
  const words = s.split(/\s+/)
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase()
  return s.slice(0, 2)
}

export { levelName }
