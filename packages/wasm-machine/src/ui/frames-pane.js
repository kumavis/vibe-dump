// CONTROL / LABEL stack and CALL-FRAME stack. Labels of the top frame,
// innermost first, with where a branch to each goes; frames as stacked cards
// with named local slots that flash on local.get / set / tee.
import { h, esc } from './dom.js'
import { fmt, readings, typeClass, shortType, sigHTML } from './format.js'

const MAX_FRAMES = 24

export class FramesPane {
  constructor(session, hooks = {}) {
    this.session = session
    this.hooks = hooks
    this.labels = h('div', { class: 'labels', role: 'list', 'aria-label': 'Labels of the current frame, innermost first' })
    this.frames = h('div', { class: 'frames', role: 'list', 'aria-label': 'Call frames, newest first' })
    this.lcount = h('span', { class: 'pane-meta' })
    this.fcount = h('span', { class: 'pane-meta' })
    this.el = h('section', { class: 'pane frames-pane', 'data-pane': 'frames', 'aria-label': 'Labels and call frames' },
      h('div', { class: 'pane-head' }, h('span', { class: 'pane-label' }, 'Labels'), h('span', { class: 'grow' }), this.lcount),
      this.labels,
      h('div', { class: 'pane-head sub' }, h('span', { class: 'pane-label' }, 'Call frames'), h('span', { class: 'grow' }), this.fcount),
      this.frames)
    this.frames.addEventListener('click', (e) => {
      const card = e.target.closest('.frame')
      if (!card || card.classList.contains('top')) return
      const i = +card.dataset.i
      const p = session.prog
      p.viewFrame = p.viewFrame === i ? null : i
      p.viewFunc = null
      session.emit('update', { reason: 'view' })
    })
    this.frames.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.frame')) {
        e.preventDefault()
        e.target.closest('.frame').click()
      }
    })
  }

  localEl(frameIdx, localIdx) {
    return this.frames.querySelector(`.frame[data-i="${frameIdx}"] .slot[data-l="${localIdx}"]`)
  }
  frameEl(i) {
    return this.frames.querySelector(`.frame[data-i="${i}"]`)
  }

  update(detail = {}) {
    const sess = this.session
    const m = sess.machine
    const p = sess.prog
    if (!m) {
      this.labels.innerHTML = '<div class="empty-note">No module instance.</div>'
      this.frames.innerHTML = ''
      this.lcount.textContent = this.fcount.textContent = ''
      return
    }
    const frames = sess.frames()
    const ev = detail.ev || null
    const top = frames[frames.length - 1]
    // ---- labels ----
    if (!top) {
      this.labels.innerHTML = `<div class="empty-note">${m.status === 'idle' ? 'No active call.' : 'The call has returned; no labels remain.'}</div>`
      this.lcount.textContent = ''
    } else {
      const names = sess.labelNames ? sess.labelNames(top.funcIndex) : null
      const branchDepth = ev && ev.control && ev.control.kind === 'branch' && ev.control.taken ? ev.control.depth : null
      // labels as they were before the branch: the targeted one may already be popped
      let html = ''
      const ls = top.labels.slice().reverse()
      for (const L of ls) {
        const nm = names && names.get(L.start)
        const tgtLine = this.hooks.lineOf ? this.hooks.lineOf(top.funcIndex, L.kind === 'loop' ? L.start : L.end) : null
        const where = L.kind === 'loop' ? `back to loop start${tgtLine != null ? ', line ' + (tgtLine + 1) : ''}` : L.kind === 'func' ? 'return from the function' : `past its end${tgtLine != null ? ', line ' + (tgtLine + 1) : ''}`
        html += `<div class="lab lab-${L.kind}${branchDepth === L.depth && ev.control.labelKind === 'loop' ? ' hit' : ''}" role="listitem">
          <span class="lab-d" title="branch depth">${L.depth}</span>
          <span class="lab-k">${L.kind}${nm ? ` <span class="hl-id">${esc(nm)}</span>` : ''}</span>
          <span class="lab-meta">arity ${L.arity} · height ${L.height}</span>
          <span class="lab-go">br → ${where}</span></div>`
      }
      if (branchDepth != null && ev.control.labelKind !== 'loop' && ev.control.labelKind) {
        html = `<div class="lab lab-exited hit" role="listitem"><span class="lab-d">${branchDepth}</span><span class="lab-k">${ev.control.labelKind} <span class="dim">exited</span></span><span class="lab-meta">kept ${ev.control.kept} · cut ${ev.control.unwound}</span><span class="lab-go">branch left this label: it was popped</span></div>` + html
      }
      this.labels.innerHTML = html
      this.lcount.textContent = `${top.labels.length}`
    }
    // ---- frames ----
    this.fcount.textContent = frames.length ? `${frames.length} deep` : ''
    if (!frames.length) {
      const r = m.status === 'done' ? 'The outermost call returned.' : m.status === 'trapped' ? 'The trap unwound nothing yet: state is shown before the faulting instruction.' : m.status === 'exited' ? 'The program exited.' : 'Invoke a function to push its frame.'
      this.frames.innerHTML = `<div class="empty-note">${r}</div>`
      return
    }
    const lr = ev && ev.localRead
    const lw = ev && ev.localWrite
    const sel = p.viewFrame
    let html = ''
    const lo = Math.max(0, frames.length - MAX_FRAMES)
    for (let i = frames.length - 1; i >= lo; i--) {
      const fr = frames[i]
      const isTop = i === frames.length - 1
      const t = p.module.funcs[fr.funcIndex] ? p.module.funcs[fr.funcIndex].type : { params: [], results: fr.resultTypes }
      const callLine = !isTop && this.hooks.lineOf ? this.hooks.lineOf(fr.funcIndex, fr.pc - 1) : null
      let slots = ''
      for (const L of fr.locals) {
        const cls = isTop && lr && lr.index === L.index ? ' read' : isTop && lw && lw.index === L.index ? ' write' : ''
        const was = isTop && lw && lw.index === L.index ? `<span class="slot-was" title="previous value">was ${esc(fmt(L.type, lw.old))}</span>` : ''
        slots += `<div class="slot ${typeClass(L.type)}${cls}" data-l="${L.index}" title="${esc(readings(L.type, L.value))}">
          <span class="slot-i">${L.isParam ? 'param' : 'local'} ${L.index}</span>
          <span class="slot-n">${L.name ? '$' + esc(L.name) : ''}</span>
          <span class="slot-t">${shortType(L.type)}</span>
          <span class="slot-v">${esc(fmt(L.type, L.value))}</span>${was}</div>`
      }
      if (!fr.locals.length) slots = '<div class="slot-none">no params or locals</div>'
      html += `<div class="frame${isTop ? ' top' : ''}${sel === i ? ' sel' : ''}" data-i="${i}" role="listitem" ${isTop ? '' : 'tabindex="0" aria-label="Show caller position"'}>
        <div class="frame-h"><span class="frame-n">${esc(sess.funcLabel(fr.funcIndex))}</span><span class="frame-depth">#${i}</span>${sigHTML(t.params, t.results)}</div>
        ${isTop ? '' : `<div class="frame-at">paused at <span class="mono">call</span>${callLine != null ? ' · line ' + (callLine + 1) : ''} · returns to pc ${fr.pc}</div>`}
        <div class="slots">${slots}</div></div>`
    }
    if (lo > 0) html += `<div class="frame-more">+ ${lo.toLocaleString()} deeper frame${lo === 1 ? '' : 's'}</div>`
    this.frames.innerHTML = html
    if (ev && ev.control && ev.control.kind === 'call' && detail.anim) {
      const card = this.frameEl(frames.length - 1)
      if (card) card.animate([{ transform: 'translateY(-10px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: detail.anim, easing: 'cubic-bezier(.2,.7,.2,1)' })
    }
    if (detail.anim && (lr || lw)) {
      const el = this.localEl(frames.length - 1, (lr || lw).index)
      if (el) el.animate([{ backgroundColor: 'var(--flash)' }, { backgroundColor: 'transparent' }], { duration: detail.anim * 2 })
    }
  }
}
