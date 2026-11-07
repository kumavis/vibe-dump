// main.js — the simulator's UI: state, stepping, editing, explanations.
//
// metric.js does the arithmetic; view.js draws; this file holds the app state,
// turns a result into a sequence of steps a reader can walk through, and
// writes the prose for whatever step is on screen.

import { runAll, checkFlow, explainRejection, eigenTrust, emptyFlow, levelName, LEVELS, SOURCE } from './metric.js'
import { SCENARIOS, findScenario, addAccount, addCert, removeAccount, removeCert, freshName } from './scenarios.js'
import { renderGraph, esc, VIEW, accountState } from './view.js'

const $ = (sel) => document.querySelector(sel)
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

const app = {
  graph: null,
  caps: [],
  threshold: 2,
  view: 'social',
  mode: 'move',
  newLevel: 2,
  selection: null, // { type: 'account' | 'cert', id }
  certPending: null,
  sourcePos: { x: 72, y: 64 },
  scenario: null,
  baseline: null, // tag/acceptance summary taken before the first scenario action
  lastNote: null,
  usedActions: new Set(),
  all: null,
  result: null,
  trace: [],
  step: 0,
  atEnd: true,
  eigen: null,
  problems: [],
  alpha: 0.15,
  animate: !reduceMotion.matches,
  bottlenecks: new Set(),
}

const nm = (ix) => (ix === SOURCE ? 'source' : app.result.net.nodes[ix].name)
const plural = (n, s, p = s + 's') => `${n} ${n === 1 ? s : p}`
const list = (items) => (items.length === 0 ? 'none' : items.map((s) => `<b>${esc(s)}</b>`).join(', '))

// ───────────────────────────────────────────────────── results → steps

function buildTrace(result) {
  const { net, dist, cap, capThrough, layers, augmentations, accepted, flow } = result
  const base = { retained: null, showSource: false, dist: null, cap: null, capThrough: null, flow: null, path: null, accepted: null, expanded: false }
  const steps = [{ phase: 'idle', snap: { ...base } }]
  const retained = new Set(net.kept)
  steps.push({ phase: 'filter', snap: { ...base, retained } })
  steps.push({ phase: 'source', snap: { ...base, retained, showSource: true } })
  const n = net.nodes.length
  let pd = new Array(n).fill(null)
  let pc = new Array(n).fill(null)
  for (const layer of layers) {
    pd = pd.slice()
    pc = pc.slice()
    for (const ix of layer.nodes) {
      pd[ix] = layer.d
      pc[ix] = layer.cap
    }
    steps.push({ phase: 'bfs', layer, snap: { ...base, retained, showSource: true, dist: pd, cap: pc } })
  }
  const unreachable = []
  for (let ix = 1; ix < n; ix++) if (dist[ix] < 0) unreachable.push(ix)
  const reached = { ...base, retained, showSource: true, dist, cap }
  steps.push({ phase: 'bfs-done', unreachable, snap: reached })
  steps.push({ phase: 'expand', snap: { ...reached, capThrough, expanded: true, flow: emptyFlow(net) } })
  augmentations.forEach((aug, k) => {
    steps.push({ phase: 'augment', k: k + 1, aug, snap: { ...reached, capThrough, expanded: true, flow: aug.after, path: aug.path } })
  })
  const done = { ...reached, capThrough, expanded: true, flow, accepted }
  steps.push({ phase: 'done', snap: done })
  steps.push({ phase: 'levels', snap: done })
  return steps
}

function recompute({ keepStep = false } = {}) {
  app.all = runAll(app.graph, app.caps, { trace: true })
  app.result = app.all.perLevel[app.threshold]
  app.trace = buildTrace(app.result)
  if (!keepStep || app.atEnd) app.step = app.trace.length - 1
  else app.step = Math.min(app.step, app.trace.length - 1)
  app.atEnd = app.step === app.trace.length - 1
  app.eigen = eigenTrust(app.graph, app.threshold, { alpha: app.alpha })
  app.problems = LEVELS.flatMap((L) => checkFlow(app.all.perLevel[L]).map((p) => `${levelName(L)}: ${p}`))
  if (app.selection) {
    const ok =
      app.selection.type === 'account'
        ? app.graph.accounts.some((a) => a.id === app.selection.id)
        : app.graph.certs.some((c) => c.id === app.selection.id)
    if (!ok) app.selection = null
  }
  render()
}

function setStep(i) {
  const was = app.step
  app.step = Math.max(0, Math.min(app.trace.length - 1, i))
  app.atEnd = app.step === app.trace.length - 1
  // the moment the network is expanded is the moment the flow view earns its
  // keep; stepping into it switches once, and Reset switches back
  if (app.step > was && app.trace[app.step].phase === 'expand' && app.view === 'social') app.view = 'flow'
  if (app.step === 0) app.view = 'social'
  render()
}

// ───────────────────────────────────────────────────── prose per step

function chain(path, flowView) {
  const net = app.result.net
  const out = []
  for (const s of path) {
    if (s.kind === 'start') out.push(flowView ? 'source<sub>in</sub>' : 'source')
    else if (s.kind === 'through') {
      if (flowView) out.push(s.dir === 1 ? ` → ${esc(nm(s.node))}<sub>out</sub>` : ` <span class="muted">⇠ ${esc(nm(s.node))}<sub>in</sub></span>`)
    } else if (s.kind === 'edge') {
      const e = net.edges[s.edge]
      if (s.dir === 1) out.push(` → ${esc(nm(e.dst))}${flowView ? '<sub>in</sub>' : ''}`)
      else out.push(` <span class="muted">⇠ ${esc(nm(e.src))}${flowView ? '<sub>out</sub>' : ''}</span>`)
    } else if (s.kind === 'sink') out.push(' → <b>sink</b>')
  }
  return `<div class="chain">${out.join('')}</div>`
}

function describe(step) {
  const r = app.result
  const g = app.graph
  const net = r.net
  const L = levelName(app.threshold)
  const seeds = g.accounts.filter((a) => a.seed)
  const capsStr = `[${app.caps.join(', ')}]`
  switch (step.phase) {
    case 'idle': {
      const warn = seeds.length === 0 ? `<p class="verify-bad">There are no seeds. The source cannot reach any account, so no account is accepted. Select an account and set it as a trusted seed.</p>` : ''
      return {
        title: 'The graph as drawn',
        html: `<p>${plural(g.accounts.length, 'account')}, ${plural(g.certs.length, 'certification')}, ${plural(seeds.length, 'seed')} (${list(seeds.map((a) => a.name))}). Threshold: <b>${L}</b>. Schedule: <code>${capsStr}</code>.</p>${warn}<p class="muted">Click <b>Step</b> to go through the computation one move at a time. Click <b>Run</b> to go to the result. The text here always describes the picture on the left.</p>`,
      }
    }
    case 'filter': {
      const dropped = net.dropped.map((id) => g.certs.find((c) => c.id === id))
      return {
        title: `1 · Keep the certifications at ${L} or higher`,
        html: `<p>The metric keeps <b>${net.kept.length} of ${g.certs.length}</b> certifications. ${dropped.length ? `It removes these, drawn faint: ${dropped.map((c) => `<b>${esc(name(c.from))} → ${esc(name(c.to))}</b> (${levelName(c.level)})`).join(', ')}.` : 'No certification is below the threshold.'}</p><p class="muted">In <code>tmetric_run</code>, a certification at level <i>L</i> goes into the flow graphs of levels 1 to <i>L</i>. Thus each run sees the certifications at its level or higher. The metric runs one time for each level. This walkthrough follows the ${L} run.</p>`,
      }
    }
    case 'source':
      return {
        title: '2 · Connect a synthetic source to the seeds',
        html: `<p>The metric creates a node with the name <code>-</code> first, so it is node 0. It adds an edge from this node to each seed: ${list(seeds.map((a) => a.name))}. The square is the source. You can drag it.</p><p class="muted">The reference treats the source like all other nodes. The source is at distance 0 with capacity <code>caps[0] = ${app.caps[0]}</code>. It uses 1 of those units on its own sink edge. Thus the metric can accept at most <b>${app.caps[0] - 1}</b> real accounts, for any graph.</p>`,
      }
    case 'bfs': {
      const { layer } = step
      const names = layer.nodes.map((ix) => nm(ix))
      const beyond = layer.d >= app.caps.length
      const who = layer.d === 0 ? 'The source' : layer.d === 1 ? `${list(names)}, the seeds, reached from the source` : list(names)
      const from = beyond ? `The schedule has only ${app.caps.length} entries, so the last value continues.` : `This is <code>caps[${layer.d}]</code>.`
      return {
        title: `3 · Breadth-first search: distance ${layer.d}`,
        html: `<p>${who}: capacity <code>c = ${layer.cap}</code>. ${from} That is 1 unit for acceptance and <b>${Math.max(layer.cap - 1, 0)}</b> units to forward.</p><p class="muted">The distance of an account is the length of the shortest certification path from the source. The search sets the distance and the capacity when it reaches the account the first time. An account with many certifiers gets the same capacity as an account with 1 certifier at the same distance.</p>`,
      }
    }
    case 'bfs-done': {
      const u = step.unreachable.map((ix) => nm(ix))
      return {
        title: '3 · Search complete',
        html: u.length
          ? `<p>These accounts are unreachable at ${L}: ${list(u)}. No certification path from a seed reaches them. They keep capacity −1 and get no trust. They do not go into the flow network.</p>`
          : `<p>Each account has a certification path from a seed, so each account has a capacity. Reachable is not the same as accepted. The next steps decide that.</p>`,
      }
    }
    case 'expand':
      return {
        title: '4 · Split each node into in and out',
        html: `<p>Each reachable node <i>v</i> becomes <i>v</i><sub>in</sub> and <i>v</i><sub>out</sub>. The through-edge <i>v</i><sub>in</sub> → <i>v</i><sub>out</sub> carries at most <b><i>c</i>(<i>v</i>) − 1</b> units. The sink edge <i>v</i><sub>in</sub> → sink carries at most <b>1</b> unit. Each kept certification <i>u</i> → <i>v</i> becomes <i>u</i><sub>out</sub> → <i>v</i><sub>in</sub> with no limit. The label below each node shows <code>forwarded / c − 1</code>.</p><p class="muted">The unit that a node sends to the sink is the unit that admits it. All other units that arrive can only go on, and at most <i>c</i>(<i>v</i>) − 1 of them. In <code>net_flow_max_flow</code>, this is the <code>TWEAK</code>: <code>capacity[i]--</code> for each node, and a <code>node_sink</code> value of 0 or 1 for each node.</p><p class="muted"><b>Why split the nodes?</b> A flow can only limit edges. Certification edges must stay unlimited, or more certifications would give more capacity. The split changes the capacity of the account into 1 edge that each unit must cross. All units that reach <i>v</i> arrive at <i>v</i><sub>in</sub>. The only way onward is <i>v</i><sub>in</sub> → <i>v</i><sub>out</sub>. Thus at most <i>c</i>(<i>v</i>) − 1 units pass through <i>v</i>, with no regard to the number of certifications. The unit that admits <i>v</i> leaves at <i>v</i><sub>in</sub>, so it is never used for forwarding.</p>`,
      }
    case 'augment': {
      const { k, aug } = step
      const flowView = app.view === 'flow'
      const total = aug.after.nodeSink.reduce((a, b) => a + b, 0)
      const hasReverse = aug.path.some((s) => s.dir === -1)
      if (aug.node === SOURCE)
        return {
          title: `5 · Augmenting path ${k}: the own unit of the source`,
          html: `${chain(aug.path, flowView)}<p>The search starts at source<sub>in</sub>. Its own sink edge is empty, so the first unit goes directly to the sink and accepts the source. This is not a special case of this page. <code>net_flow_augment</code> dequeues the source first, and the source is the first node in the result array of <code>tmetric_run</code>. The table skips it. The metric uses 1 unit of <code>caps[0]</code>.</p>`,
        }
      return {
        title: `5 · Augmenting path ${k}: 1 unit reaches ${esc(nm(aug.node))}`,
        html: `${chain(aug.path, flowView)}<p><b>${esc(nm(aug.node))}</b> is now accepted. Its sink edge carries 1 unit. Total: <b>${total}</b> units at the sink (${total - 1} ${total - 1 === 1 ? 'account' : 'accounts'} plus the source).</p>${
          hasReverse
            ? `<p class="muted">A step with a left arrow (⇠) goes backward along an edge that already carries flow. The search re-routes that unit so that this unit can get through. The residual graph lets the search undo an earlier choice. No accepted account loses its unit. The total only increases.</p>`
            : `<p class="muted">The search is a breadth-first search over the residual graph. It moves forward along a certification. It goes through a node only while the node has forwarding capacity. The first in-node that it reaches with an empty sink edge gets the unit. When there is a tie, the node that was queued first wins.</p>`
        }`,
      }
    }
    case 'done': {
      const acc = []
      const rej = []
      const unr = []
      g.accounts.forEach((a) => {
        const ix = net.indexOf.get(a.id)
        if (r.dist[ix] < 0) unr.push(a.name)
        else if (r.accepted[ix]) acc.push(a.name)
        else rej.push(a.name)
      })
      const problems = checkFlow(r)
      return {
        title: '6 · No augmenting path remains. Accept.',
        html: `<p>The flow is at its maximum. <b>${r.totalFlow}</b> units reached the sink (${acc.length} accounts plus the source). Each accepted account used exactly 1 unit.</p><ul><li>Accepted: ${list(acc)}</li><li>Reachable but rejected: ${list(rej)}${rej.length ? '. Each path to these accounts crosses an account that forwards all that it can. Select one to see where.' : ''}</li><li>Unreachable: ${list(unr)}</li></ul><p class="${problems.length ? 'verify-bad' : 'verify-ok'}">${problems.length ? `Check failed: ${esc(problems.join('; '))}` : 'Checked: no node forwards more than c − 1 units. The flow is conserved at each in-node and each out-node. Each sink edge carries 0 or 1 unit. No unreachable node carries flow.'}</p>`,
      }
    }
    case 'levels': {
      const counts = LEVELS.map((lv) => {
        const res = app.all.perLevel[lv]
        return `${levelName(lv)}: <b>${res.accepted.filter(Boolean).length - 1}</b>`
      })
      return {
        title: '7 · Do this again for each threshold. Report the highest level.',
        html: `<p>Accepted accounts for each run: ${counts.join(' · ')}. The table below shows each account at each level. The reported level is the highest level at which the account is accepted. <code>tmetric_run</code> writes out this value.</p><p class="muted">The 3 runs are independent maximum flows. Thus an account can be accepted at a higher level and lose a tie at a lower level. The report shows the higher level. Change the threshold in Settings to go through a different run.</p>${pendingAction()}`,
      }
    }
    default:
      return { title: '', html: '' }
  }
}

// The scenario's move, if it has one the reader has not made yet: the stepper
// only ever walks the graph as it stands, so the final step says where the
// story continues.
function pendingAction() {
  const s = app.scenario
  const i = s.actions.findIndex((a, k) => !(a.once && app.usedActions.has(k)))
  if (i < 0) return ''
  return `<p><b>Next move:</b> click <b>${esc(s.actions[i].label)}</b> in the Scenario card. Then compare the results.</p>`
}

function name(id) {
  const a = app.graph.accounts.find((x) => x.id === id)
  return a ? a.name : '?'
}

// ───────────────────────────────────────────────────── rendering

const svg = $('#graph')
let anim = null

function currentSnap() {
  return app.trace[app.step]?.snap ?? null
}

function render() {
  const step = app.trace[app.step]
  const snap = currentSnap()

  // which accounts to flag as bottlenecks for the selected, rejected account
  app.bottlenecks = new Set()
  if (app.selection?.type === 'account' && snap?.accepted) {
    const ix = app.result.net.indexOf.get(app.selection.id)
    const why = explainRejection(app.result, ix)
    if (why.kind === 'rejected') app.bottlenecks = new Set(why.saturated)
  }

  const { pathPoints } = renderGraph(svg, {
    graph: app.graph,
    view: app.view,
    snap,
    net: app.result.net,
    selection: app.selection,
    certPending: app.certPending,
    sourcePos: app.sourcePos,
    bottlenecks: app.bottlenecks,
  })
  animatePath(step?.phase === 'augment' ? pathPoints : null)

  for (const b of document.querySelectorAll('[data-view]')) b.classList.toggle('on', b.dataset.view === app.view)
  for (const b of document.querySelectorAll('[data-mode]')) b.classList.toggle('on', b.dataset.mode === app.mode)
  renderHint()
  renderStepper(step)
  renderScenario()
  renderInspector(snap)
  renderTable(snap)
  renderEigen()
  renderDesc()
}

function renderHint() {
  const el = $('#hint')
  const lvl = levelName(app.newLevel)
  const hints = {
    move: 'Drag an account to move it. Click an account or a certification to inspect it.',
    add: 'Click an empty area to add an account.',
    cert: app.certPending == null ? `Click the account that certifies. Then click the account that it certifies. New certifications are ${lvl}. A click on an existing pair changes its level.` : `${esc(name(app.certPending))} certifies the next account that you click, at ${lvl}. Push Escape to cancel.`,
    delete: 'Click an account or a certification to delete it.',
  }
  el.innerHTML = hints[app.mode]
}

function renderStepper(step) {
  $('#progress').textContent = `step ${app.step + 1} / ${app.trace.length}`
  $('#btn-back').disabled = app.step === 0
  $('#btn-next').disabled = app.step === app.trace.length - 1
  $('#btn-run').disabled = app.step === app.trace.length - 1
  $('#btn-reset').disabled = app.step === 0
  const d = describe(step)
  $('#phase').innerHTML = d.title
  $('#explain').innerHTML = d.html
}

function renderSchedule() {
  const el = $('#schedule')
  el.innerHTML = app.caps
    .map(
      (c, i) =>
        `<label class="${i === 0 ? 'src' : ''}"><span>d${i}${i === 0 ? ' src' : i === 1 ? ' seeds' : ''}</span><input type="number" min="1" step="1" value="${c}" data-cap="${i}" aria-label="capacity at distance ${i}" /></label>`,
    )
    .join('')
  $('#caps-less').disabled = app.caps.length <= 1
}

function summarize() {
  const r = app.result
  const out = { accepted: 0, tags: new Map() }
  for (const a of app.graph.accounts) {
    const ix = r.net.indexOf.get(a.id)
    const acc = r.accepted[ix]
    if (acc) out.accepted++
    const tag = a.tag ?? 'unlabelled'
    let t = out.tags.get(tag)
    if (!t) out.tags.set(tag, (t = { n: 0, accepted: 0, dist: new Set(), cap: new Set() }))
    t.n++
    if (acc) t.accepted++
    if (r.dist[ix] >= 0) {
      t.dist.add(r.dist[ix])
      t.cap.add(r.cap[ix])
    }
  }
  return out
}

const range = (set) => {
  const v = [...set].sort((a, b) => a - b)
  return v.length === 0 ? '—' : v.length === 1 || v[0] === v[v.length - 1] ? String(v[0]) : `${v[0]}–${v[v.length - 1]}`
}

function renderScenario() {
  const s = app.scenario
  $('#scenario-lesson').textContent = s.lesson
  $('#scenario-intro').textContent = s.intro
  $('#scenario-play').innerHTML = (s.play ?? []).map((p) => `<li>${p}</li>`).join('')
  $('#scenario-argument').innerHTML = s.argument ? `<details class="argument" open><summary><h3>Ruderman's argument</h3></summary>${s.argument}</details>` : ''
  const actions = $('#scenario-actions')
  actions.innerHTML = s.actions
    .map((a, i) => `<button type="button" data-action="${i}" class="${a.once && app.usedActions.has(i) ? '' : 'primary'}" ${a.once && app.usedActions.has(i) ? 'disabled' : ''}>${esc(a.label)}</button>`)
    .join('')
  const notes = $('#scenario-notes')
  if (!app.baseline) {
    notes.innerHTML = ''
    return
  }
  const now = summarize()
  const rows = []
  const arrow = (a, b, aText = a, bText = b) => `${aText} → ${bText} ${a === b ? '<span class="same">unchanged</span>' : '<span class="up">changed</span>'}`
  rows.push(`<div>accepted, all accounts: ${arrow(app.baseline.accepted, now.accepted)}</div>`)
  const tags = new Set([...app.baseline.tags.keys(), ...now.tags.keys()])
  for (const tag of tags) {
    if (tag === 'unlabelled') continue
    const b = app.baseline.tags.get(tag) ?? { n: 0, accepted: 0, dist: new Set(), cap: new Set() }
    const n = now.tags.get(tag) ?? { n: 0, accepted: 0, dist: new Set(), cap: new Set() }
    rows.push(`<div>accepted with the label "${esc(tag)}": ${arrow(b.accepted, n.accepted, `${b.accepted} (of ${b.n})`, `${n.accepted} (of ${n.n})`)}</div>`)
    if (range(b.dist) !== range(n.dist) || range(b.cap) !== range(n.cap))
      rows.push(`<div>"${esc(tag)}": distance ${range(b.dist)} → ${range(n.dist)}, capacity ${range(b.cap)} → ${range(n.cap)}</div>`)
  }
  notes.innerHTML = `<p>${esc(app.lastNote ?? '')}</p><div class="delta">${rows.join('')}</div><p class="fine">Before the first action → now, at the ${levelName(app.threshold)} threshold. The labels are for the reader. The metric does not see them.</p>`
}

function stateLabel(st) {
  return { accepted: 'accepted ✓', rejected: 'reachable, rejected ✕', unreachable: 'unreachable –', reachable: 'reachable (not decided yet)', pending: 'not computed yet' }[st]
}

function renderInspector(snap) {
  const el = $('#inspector')
  const sel = app.selection
  if (!sel) {
    el.innerHTML = `<p class="empty">Click an account or a certification to inspect it. For an account, the inspector shows the distance, the capacity, the consumed units, the forwarded units, and the reason for the result.</p>`
    return
  }
  const r = app.result
  if (sel.type === 'cert') {
    const c = app.graph.certs.find((x) => x.id === sel.id)
    const kept = c.level >= app.threshold
    const eIx = r.net.edges.findIndex((e) => e.cert === c.id)
    const flow = snap?.flow && eIx >= 0 ? snap.flow.edgeFlow[eIx] : null
    el.innerHTML = `
      <div class="title"><b>${esc(name(c.from))} → ${esc(name(c.to))}</b><span class="pill">${kept ? 'kept' : 'below threshold'}</span></div>
      <dl>
        <dt>Level</dt><dd><select id="cert-level" aria-label="certification level">${LEVELS.map((lv) => `<option value="${lv}" ${lv === c.level ? 'selected' : ''}>${levelName(lv)}</option>`).join('')}</select></dd>
        <dt>Capacity</dt><dd>unlimited (u<sub>out</sub> → v<sub>in</sub>)</dd>
        <dt>Flow carried</dt><dd>${flow == null ? '—' : flow}</dd>
      </dl>
      <div class="row"><button type="button" id="cert-reverse">Reverse direction</button><button type="button" id="cert-delete" class="danger">Delete</button></div>`
    $('#cert-level').addEventListener('change', (e) => {
      c.level = Number(e.target.value)
      recompute({ keepStep: true })
    })
    $('#cert-reverse').addEventListener('click', () => {
      const dup = app.graph.certs.find((x) => x.from === c.to && x.to === c.from)
      if (dup) {
        removeCert(app.graph, c.id)
        app.selection = { type: 'cert', id: dup.id }
      } else {
        const f = c.from
        c.from = c.to
        c.to = f
      }
      recompute({ keepStep: true })
    })
    $('#cert-delete').addEventListener('click', () => {
      removeCert(app.graph, c.id)
      app.selection = null
      recompute({ keepStep: true })
    })
    return
  }
  const a = app.graph.accounts.find((x) => x.id === sel.id)
  const ix = r.net.indexOf.get(a.id)
  const st = accountState(snap, ix)
  const dist = snap?.dist ? snap.dist[ix] : null
  const cap = snap?.cap ? snap.cap[ix] : null
  const fl = snap?.flow ?? null
  const levelNow = app.all.level.get(a.id)
  let why = ''
  if (snap?.accepted) {
    const ex = explainRejection(r, ix)
    if (ex.kind === 'rejected') {
      const sat = ex.saturated.map((v) => `<b>${esc(nm(v))}</b> (${r.flow.nodeFlow[v]} of ${r.capThrough[v]})`)
      const pathHtml = ex.path.map((v) => (v === SOURCE ? 'source' : `${esc(nm(v))}<span class="muted"> ${r.flow.nodeSink[v]}+${r.flow.nodeFlow[v]}/${r.cap[v]}</span>`)).join(' → ')
      why = `<div class="why"><p><b>Why rejected:</b> ${esc(a.name)} is reachable at distance ${dist}. But each certification path to it crosses an account that forwards all that it can. On the shortest path, these accounts are full: ${sat.join(', ')}. The graph marks them as <i>bottleneck</i>.</p><p class="chain">${pathHtml}</p><p class="muted">Each node shows consumed + forwarded / capacity. To let a unit in, give the bottleneck more capacity or a shorter path. More certifications from accounts after the bottleneck change nothing.</p></div>`
    } else if (ex.kind === 'unreachable') {
      why = `<div class="why"><p><b>Why rejected:</b> No certification path from a seed reaches ${esc(a.name)} at ${levelName(app.threshold)}. Thus it has no capacity, and it is not part of the flow network.</p></div>`
    }
  }
  el.innerHTML = `
    <div class="title"><input type="text" id="acct-name" value="${esc(a.name)}" aria-label="account name" />${a.seed ? '<span class="pill">seed</span>' : ''}${a.tag ? `<span class="pill tag">demo label: ${esc(a.tag)}</span>` : ''}</div>
    <dl>
      <dt>Distance</dt><dd>${dist == null ? '—' : dist < 0 ? 'unreachable' : dist}</dd>
      <dt>Capacity c(v)</dt><dd>${cap == null || cap < 0 ? '—' : `${cap} = 1 for acceptance + ${cap - 1} to forward`}</dd>
      <dt>Consumed</dt><dd>${fl ? `${fl.nodeSink[ix]} of 1 (sink edge)` : '—'}</dd>
      <dt>Forwarded</dt><dd>${fl ? `${fl.nodeFlow[ix]} of ${snap.capThrough[ix]} (through-edge)` : '—'}</dd>
      <dt>At ${levelName(app.threshold)}</dt><dd class="result ${st}">${stateLabel(st)}</dd>
      <dt>Reported level</dt><dd>${levelNow ? levelName(levelNow) : 'none'} <span class="muted">(${LEVELS.map((lv) => `${levelName(lv)[0]}: ${app.all.perLevel[lv].accepted[app.all.perLevel[lv].net.indexOf.get(a.id)] ? '✓' : '✕'}`).join(' · ')})</span></dd>
    </dl>
    ${why}
    ${a.tag ? `<p class="fine">"${esc(a.tag)}" is a label for this demonstration. The algorithm does not know which accounts are malicious. It sees only certifications.</p>` : ''}
    <div class="row">
      <label class="check"><input type="checkbox" id="acct-seed" ${a.seed ? 'checked' : ''} /> trusted seed</label>
      <button type="button" id="acct-delete" class="danger">Delete account</button>
    </div>`
  $('#acct-name').addEventListener('change', (e) => {
    const v = e.target.value.trim()
    if (v) a.name = v
    render()
  })
  $('#acct-seed').addEventListener('change', (e) => {
    a.seed = e.target.checked
    recompute({ keepStep: true })
  })
  $('#acct-delete').addEventListener('click', () => {
    removeAccount(app.graph, a.id)
    app.selection = null
    recompute({ keepStep: true })
  })
}

function stCell(st) {
  return `<span class="st ${st}"><i></i>${stateLabel(st)}</span>`
}

function renderTable(snap) {
  const tbody = $('#results tbody')
  const r = app.result
  for (const th of document.querySelectorAll('#results th.thr')) th.title = `at ${levelName(app.threshold)}`
  tbody.innerHTML = app.graph.accounts
    .map((a) => {
      const ix = r.net.indexOf.get(a.id)
      const st = accountState(snap, ix)
      const dist = snap?.dist ? snap.dist[ix] : null
      const cap = snap?.cap ? snap.cap[ix] : null
      const fl = snap?.flow
      const lv = app.all.level.get(a.id)
      const per = LEVELS.map((L) => {
        const res = app.all.perLevel[L]
        const i = res.net.indexOf.get(a.id)
        const s = res.dist[i] < 0 ? 'unreachable' : res.accepted[i] ? 'accepted' : 'rejected'
        return `<td>${stCell(s)}</td>`
      }).join('')
      const selected = app.selection?.type === 'account' && app.selection.id === a.id
      return `<tr class="row-account ${selected ? 'selected' : ''}" data-row="${a.id}"><td><b>${esc(a.name)}</b>${a.tag ? ` <span class="muted"><i>(${esc(a.tag)})</i></span>` : ''}</td><td>${a.seed ? 'seed' : ''}</td><td class="num">${dist == null ? '—' : dist < 0 ? '∞' : dist}</td><td class="num">${cap == null || cap < 0 ? '—' : cap}</td><td class="num">${fl ? fl.nodeSink[ix] : '—'}</td><td class="num">${fl ? `${fl.nodeFlow[ix]} / ${snap.capThrough[ix]}` : '—'}</td><td>${stCell(st)}</td>${per}<td><b>${lv ? levelName(lv) : 'none'}</b></td></tr>`
    })
    .join('')
  const v = $('#verify')
  if (app.problems.length) {
    v.className = 'verify bad'
    v.textContent = `✕ Check failed: ${app.problems[0]}`
  } else {
    v.className = 'verify ok'
    v.textContent = '✓ Verified at all 3 thresholds: capacities, conservation, 1 sink unit for each accepted account'
  }
}

function renderEigen() {
  const tbody = $('#eigen-table tbody')
  const r = app.result
  const rows = app.graph.accounts.map((a) => ({ a, score: app.eigen.scores.get(a.id) ?? 0 })).sort((x, y) => y.score - x.score)
  const max = rows.reduce((m, x) => Math.max(m, x.score), 0) || 1
  tbody.innerHTML = rows
    .map(({ a, score }) => {
      const ix = r.net.indexOf.get(a.id)
      const st = r.dist[ix] < 0 ? 'unreachable' : r.accepted[ix] ? 'accepted' : 'rejected'
      return `<tr><td><b>${esc(a.name)}</b>${a.seed ? ' <span class="muted">seed</span>' : ''}</td><td class="num"><span class="bar" style="width:${Math.round((score / max) * 110)}px"></span>${score.toFixed(3)}</td><td>${stCell(st)}</td></tr>`
    })
    .join('')
}

function renderDesc() {
  const r = app.result
  const acc = app.graph.accounts.filter((a) => r.accepted[r.net.indexOf.get(a.id)]).map((a) => a.name)
  $('#graph-desc').textContent = `${plural(app.graph.accounts.length, 'account')} and ${plural(app.graph.certs.length, 'certification')}. ${app.view === 'flow' ? 'Expanded flow network. ' : ''}Accepted at ${levelName(app.threshold)}: ${acc.join(', ') || 'none'}.`
}

// ───────────────────────────────────────────────────── the moving dot

function animatePath(points) {
  if (anim) {
    cancelAnimationFrame(anim.raf)
    anim = null
  }
  if (!points || points.length < 2 || !app.animate || reduceMotion.matches) return
  const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
  dot.setAttribute('class', 'dot')
  dot.setAttribute('r', '6')
  svg.appendChild(dot)
  const segs = []
  let total = 0
  for (let i = 1; i < points.length; i++) {
    const len = Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y)
    segs.push({ a: points[i - 1], b: points[i], len })
    total += len
  }
  const duration = Math.max(700, Math.min(2600, total * 2.2))
  const start = performance.now()
  const tick = (now) => {
    const t = Math.min(1, (now - start) / duration)
    let d = t * total
    let p = points[points.length - 1]
    for (const s of segs) {
      if (d <= s.len) {
        const f = s.len === 0 ? 1 : d / s.len
        p = { x: s.a.x + (s.b.x - s.a.x) * f, y: s.a.y + (s.b.y - s.a.y) * f }
        break
      }
      d -= s.len
    }
    dot.setAttribute('cx', p.x)
    dot.setAttribute('cy', p.y)
    if (t < 1) anim.raf = requestAnimationFrame(tick)
    else {
      dot.remove()
      anim = null
    }
  }
  anim = { raf: requestAnimationFrame(tick), dot }
}

// ───────────────────────────────────────────────────── editing

function svgPoint(e) {
  const pt = svg.createSVGPoint()
  pt.x = e.clientX
  pt.y = e.clientY
  const p = pt.matrixTransform(svg.getScreenCTM().inverse())
  return { x: Math.max(30, Math.min(VIEW.w - 30, p.x)), y: Math.max(30, Math.min(VIEW.h - 40, p.y)) }
}

let drag = null

function onAccountPress(id) {
  if (app.mode === 'delete') {
    removeAccount(app.graph, id)
    if (app.selection?.type === 'account' && app.selection.id === id) app.selection = null
    recompute({ keepStep: true })
    return
  }
  if (app.mode === 'cert') {
    if (app.certPending == null) {
      app.certPending = id
      render()
    } else if (app.certPending === id) {
      app.certPending = null
      render()
    } else {
      const cid = addCert(app.graph, app.certPending, id, app.newLevel)
      app.certPending = null
      app.selection = { type: 'cert', id: cid }
      recompute({ keepStep: true })
    }
    return
  }
  app.selection = { type: 'account', id }
  render()
}

svg.addEventListener('pointerdown', (e) => {
  const acct = e.target.closest('[data-account]')
  const src = e.target.closest('[data-source]')
  const cert = e.target.closest('[data-cert]')
  if (acct) {
    const id = Number(acct.dataset.account)
    if (app.mode === 'move' || app.mode === 'add') {
      const a = app.graph.accounts.find((x) => x.id === id)
      const p = svgPoint(e)
      drag = { kind: 'account', a, dx: a.x - p.x, dy: a.y - p.y, moved: false, id }
      svg.setPointerCapture(e.pointerId)
    } else onAccountPress(id)
    return
  }
  if (src) {
    const p = svgPoint(e)
    drag = { kind: 'source', dx: app.sourcePos.x - p.x, dy: app.sourcePos.y - p.y, moved: false }
    svg.setPointerCapture(e.pointerId)
    return
  }
  if (cert) {
    const id = Number(cert.dataset.cert)
    if (app.mode === 'delete') {
      removeCert(app.graph, id)
      if (app.selection?.type === 'cert' && app.selection.id === id) app.selection = null
      recompute({ keepStep: true })
    } else {
      app.selection = { type: 'cert', id }
      app.certPending = null
      render()
    }
    return
  }
  // empty canvas
  if (app.mode === 'add') {
    const p = svgPoint(e)
    const id = addAccount(app.graph, freshName(app.graph), { x: Math.round(p.x), y: Math.round(p.y), seed: app.graph.accounts.length === 0 })
    app.selection = { type: 'account', id }
    recompute({ keepStep: true })
    return
  }
  if (app.certPending != null) app.certPending = null
  app.selection = null
  render()
})
svg.addEventListener('pointermove', (e) => {
  if (!drag) return
  const p = svgPoint(e)
  if (drag.kind === 'account') {
    const nx = Math.round(p.x + drag.dx)
    const ny = Math.round(p.y + drag.dy)
    if (nx !== drag.a.x || ny !== drag.a.y) drag.moved = true
    drag.a.x = Math.max(30, Math.min(VIEW.w - 30, nx))
    drag.a.y = Math.max(34, Math.min(VIEW.h - 60, ny))
  } else {
    drag.moved = true
    app.sourcePos = { x: Math.round(p.x + drag.dx), y: Math.round(p.y + drag.dy) }
  }
  renderGraph(svg, {
    graph: app.graph,
    view: app.view,
    snap: currentSnap(),
    net: app.result.net,
    selection: app.selection,
    certPending: app.certPending,
    sourcePos: app.sourcePos,
    bottlenecks: app.bottlenecks,
  })
})
const endDrag = (e) => {
  if (!drag) return
  const d = drag
  drag = null
  try {
    svg.releasePointerCapture(e.pointerId)
  } catch {
    /* already released */
  }
  if (d.kind === 'account' && !d.moved) onAccountPress(d.id)
  else render()
}
svg.addEventListener('pointerup', endDrag)
svg.addEventListener('pointercancel', endDrag)
svg.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' && e.key !== ' ') return
  const acct = e.target.closest?.('[data-account]')
  if (!acct) return
  e.preventDefault()
  onAccountPress(Number(acct.dataset.account))
})

document.addEventListener('keydown', (e) => {
  const tag = document.activeElement?.tagName
  const typing = tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA'
  if (e.key === 'Escape') {
    app.certPending = null
    app.selection = null
    render()
  } else if ((e.key === 'Delete' || e.key === 'Backspace') && !typing && app.selection) {
    if (app.selection.type === 'account') removeAccount(app.graph, app.selection.id)
    else removeCert(app.graph, app.selection.id)
    app.selection = null
    recompute({ keepStep: true })
  } else if (e.key === 'ArrowRight' && !typing) setStep(app.step + 1)
  else if (e.key === 'ArrowLeft' && !typing) setStep(app.step - 1)
})

// ───────────────────────────────────────────────────── controls

for (const b of document.querySelectorAll('[data-view]'))
  b.addEventListener('click', () => {
    app.view = b.dataset.view
    render()
  })
for (const b of document.querySelectorAll('[data-mode]'))
  b.addEventListener('click', () => {
    app.mode = b.dataset.mode
    app.certPending = null
    render()
  })
$('#new-level').addEventListener('change', (e) => {
  app.newLevel = Number(e.target.value)
  renderHint()
})
for (const r of document.querySelectorAll('input[name="threshold"]'))
  r.addEventListener('change', () => {
    app.threshold = Number(r.value)
    recompute({ keepStep: true })
  })
$('#btn-reset').addEventListener('click', () => setStep(0))
$('#btn-back').addEventListener('click', () => setStep(app.step - 1))
$('#btn-next').addEventListener('click', () => setStep(app.step + 1))
$('#btn-run').addEventListener('click', () => setStep(app.trace.length - 1))
$('#animate').addEventListener('change', (e) => {
  app.animate = e.target.checked
})
$('#alpha').addEventListener('change', (e) => {
  const v = Number(e.target.value)
  if (v > 0 && v < 1) app.alpha = v
  else e.target.value = app.alpha
  app.eigen = eigenTrust(app.graph, app.threshold, { alpha: app.alpha })
  renderEigen()
})
$('#schedule').addEventListener('change', (e) => {
  const i = Number(e.target.dataset.cap)
  const v = Math.floor(Number(e.target.value))
  if (!Number.isFinite(v) || v < 1) {
    e.target.value = app.caps[i]
    return
  }
  app.caps[i] = v
  e.target.value = v
  recompute({ keepStep: true })
})
$('#caps-more').addEventListener('click', () => {
  app.caps.push(app.caps[app.caps.length - 1])
  renderSchedule()
  recompute({ keepStep: true })
})
$('#caps-less').addEventListener('click', () => {
  if (app.caps.length <= 1) return
  app.caps.pop()
  renderSchedule()
  recompute({ keepStep: true })
})
$('#scenario-actions').addEventListener('click', (e) => {
  const b = e.target.closest('[data-action]')
  if (!b) return
  const i = Number(b.dataset.action)
  const action = app.scenario.actions[i]
  if (!app.baseline) app.baseline = summarize()
  action.apply({ graph: app.graph, caps: app.caps })
  app.usedActions.add(i)
  app.lastNote = action.note
  if (action.kind === 'caps') renderSchedule()
  app.atEnd = true
  recompute()
})
$('#results').addEventListener('click', (e) => {
  const row = e.target.closest('[data-row]')
  if (!row) return
  app.selection = { type: 'account', id: Number(row.dataset.row) }
  render()
})
reduceMotion.addEventListener?.('change', () => {
  app.animate = !reduceMotion.matches && $('#animate').checked
})

const scenarioSelect = $('#scenario')
scenarioSelect.innerHTML = SCENARIOS.map((s) => `<option value="${s.key}">${esc(s.title)}: ${esc(s.lesson)}</option>`).join('')
scenarioSelect.addEventListener('change', () => loadScenario(scenarioSelect.value))

function loadScenario(key) {
  const s = findScenario(key)
  app.scenario = s
  app.graph = s.build()
  app.caps = s.caps.slice()
  app.threshold = s.threshold
  app.baseline = null
  app.lastNote = null
  app.usedActions = new Set()
  app.certPending = null
  app.view = 'social'
  app.atEnd = true
  app.sourcePos = { x: 72, y: 64 }
  const focus = app.graph.accounts.find((a) => a.name === s.focus)
  app.selection = focus ? { type: 'account', id: focus.id } : null
  for (const r of document.querySelectorAll('input[name="threshold"]')) r.checked = Number(r.value) === app.threshold
  scenarioSelect.value = key
  renderSchedule()
  recompute()
}

const fromHash = decodeURIComponent(location.hash.slice(1))
loadScenario(SCENARIOS.some((s) => s.key === fromHash) ? fromHash : SCENARIOS[0].key)
scenarioSelect.addEventListener('change', () => history.replaceState(null, '', `#${scenarioSelect.value}`))
