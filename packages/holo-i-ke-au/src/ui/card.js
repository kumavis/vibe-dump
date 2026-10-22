// The card on the right. Three kinds share it:
//
// - An event: title and gloss, when and where, the summary, how sure the
//   record is (DATA.md's confidence), the tellings where the sources
//   disagree, and the sources themselves: only those read in full or in
//   part (sources.json `read`), so a card cites nothing nobody has read, a
//   telling included, and an event with none read has no Sources at all.
//   While the tour walks an event's stops, the stop it is at sits above the
//   summary.
// - An era, as its chapter of the tour opens, set as a book sets a chapter's
//   first page (the card's `chapter` class): the chapter's numeral large, the
//   era's label as its title, its year beneath, then the note with a large
//   initial, what happens in it (each a way into its event), and its
//   sources. The footer and the pill over the timeline (timeline.js) name
//   the chapter the same way.
// - A cluster of pins that share a spot on the screen: their events in date
//   order, any of which opens its own card.
//
// The footer steps the tour (tour.js) back and on, as the buttons by the
// timeline do: it sits where the reading ends.

import { h, esc } from './dom.js'
import { icon, hasIcon } from './icons.js'
import { formatWhen, formatYear, eventYear } from '../time.js'

const KIND = {
  arrival: 'arrival', battle: 'battle', founding: 'founding', construction: 'construction', eruption: 'eruption',
  epidemic: 'epidemic', law: 'law', treaty: 'treaty', voyage: 'voyage', death: 'death', protest: 'protest', restoration: 'restoration', other: 'event',
}

const kindIcon = (ev) => (hasIcon(ev.kind) ? ev.kind : 'other')

/**
 * Whether a source may be cited: one read in full or in part (sources.json
 * `read`; `title` is a source known only by its title). A source with no
 * `read` (a data layer a bake fetched, or a gazetteer from before the field)
 * stands on whether it was opened.
 */
export function readable(s) {
  if (!s) return false
  if (s.read !== undefined) return s.read === 'full' || s.read === 'part'
  return s.opened !== false
}

/**
 * An era's label as a chapter's title: the lead its labels share ("in the
 * time of") apart from the name it leads to, and the space between kept, so
 * the title's text is the label's.
 */
export function chapterTitle(label) {
  const m = String(label).match(/^(in the time of)(\s+)(.+)$/i)
  return m ? { lead: m[1], gap: m[2], name: m[3] } : { lead: '', gap: '', name: String(label) }
}

export class EventCard {
  constructor(root, app, ui) {
    this.app = app
    this.ui = ui
    this.el = h('section', { class: 'card', 'aria-live': 'polite' })
    root.appendChild(this.el)
    this.places = new Map(app.data.places.map((p) => [p.id, p]))
    this.sources = new Map(app.data.sources.map((s) => [s.id, s]))
    this.events = new Map(app.data.events.map((e) => [e.id, e]))
    this.missing = new Set()
    this.mode = null // 'event' | 'era' | 'cluster'
    this.ev = null
    this.stop = -1
    this.chapter = null
    this.list = null
    // one listener for every button the card ever draws
    this.el.addEventListener('click', (e) => this.click(e))
  }

  get isOpen() {
    return this.el.classList.contains('show')
  }

  open(ev) {
    this.set('event', { ev })
  }

  /** The stop the tour is at (-1: the event's own card). */
  setStop(i) {
    this.stop = i
    this.render()
  }

  openEra(chapter) {
    this.set('era', { chapter })
  }

  openList(events) {
    this.set('cluster', { list: events })
  }

  set(mode, { ev = null, chapter = null, list = null }) {
    this.mode = mode
    this.ev = ev
    this.chapter = chapter
    this.list = list
    this.stop = -1
    this.render()
  }

  close() {
    const was = this.ev
    this.el.classList.remove('show')
    this.mode = null
    this.ev = null
    this.chapter = null
    this.list = null
    this.ui.onCardClosed?.(was)
  }

  click(e) {
    const b = e.target.closest('button')
    if (!b || !this.el.contains(b)) return
    const tour = this.ui.tour
    if (b.classList.contains('card-close')) this.close()
    else if (b.classList.contains('prev')) tour.back()
    else if (b.classList.contains('next')) tour.next()
    else if (b.dataset.ev) {
      const ev = this.events.get(b.dataset.ev)
      // from a chapter's list, the full step; from a cluster, come to it gently
      if (ev) tour.open(ev, { gentle: this.mode === 'cluster' })
    }
  }

  /** A source by its id, if it may be cited (an id sources.json lacks is said once in the console). */
  cited(id) {
    const s = this.sources.get(id)
    if (!s && !this.missing.has(id)) {
      this.missing.add(id)
      this.app.warn(`a card cites ${id}, which is not in sources.json`)
    }
    return readable(s) ? s : null
  }

  sourceLine(ref) {
    const s = this.cited(typeof ref === 'string' ? ref : ref.id)
    if (!s) return ''
    const where = typeof ref === 'object' && ref.where ? `, ${esc(ref.where)}` : ''
    const title = s.url && /^https?:/.test(s.url) ? `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title)}</a>` : esc(s.title)
    const by = s.author ? `${esc(s.author)}, ` : ''
    const yr = s.year ? ` (${esc(s.year)})` : ''
    return `<li>${by}<span class="src-title">${title}</span>${yr}${where}</li>`
  }

  /** The Sources a card lists: what was read of them, or no section at all. */
  sourcesSection(refs) {
    const lines = (refs || []).map((s) => this.sourceLine(s)).join('')
    return lines ? `<div class="card-sec"><h2>Sources</h2><ul class="sources">${lines}</ul></div>` : ''
  }

  /** A list of events, a row each: what they are, when, and what they're called. */
  eventRows(events, { gloss = true } = {}) {
    return events
      .map(
        (ev) => `<li><button class="ev-row" data-ev="${esc(ev.id)}">
          <span class="ev-ic">${icon(kindIcon(ev), 16)}</span>
          <span class="ev-y">${esc(eventYear(ev))}</span>
          <span class="ev-t"><b>${esc(ev.title)}</b>${gloss && ev.gloss ? `<em>${esc(ev.gloss)}</em>` : ''}</span>
        </button></li>`,
      )
      .join('')
  }

  /** Back and Next, and where the tour stands, for a card the tour is showing. */
  footer() {
    const tour = this.ui.tour
    if (!tour?.active) return ''
    const ch = tour.current
    let count
    let nextLabel = 'Next'
    if (this.mode === 'era' && this.chapter === ch && tour.step < 0) {
      // (as the pill over the timeline names it, and the card's own numeral)
      count = `<span class="ch-count">Chapter <b>${ch.index + 1}</b> of ${tour.chapters.length}</span>`
    } else if (this.mode === 'event' && this.ev && this.ev === tour.event) {
      const n = this.ev.stops?.length || 0
      if (tour.stop >= 0) count = esc(`stop ${tour.stop + 1} of ${n}`)
      else {
        count = esc(`${tour.step + 1} of ${ch.events.length} in chapter ${ch.index + 1}`)
        if (n) nextLabel = `Walk ${n} stops`
      }
    } else return ''
    return `<footer>
      <button class="nav prev" aria-label="Back" title="Back (←)" ${tour.atStart ? 'disabled' : ''}>${icon('prev', 18)}</button>
      <span class="count">${count}</span>
      <button class="nav next" aria-label="Next" title="Next (→ or space)" ${tour.atEnd ? 'disabled' : ''}><span>${esc(nextLabel)}</span>${icon('next', 18)}</button>
    </footer>`
  }

  render() {
    if (this.mode === 'era') this.el.innerHTML = this.eraHTML()
    else if (this.mode === 'cluster') this.el.innerHTML = this.clusterHTML()
    else if (this.mode === 'event' && this.ev) this.el.innerHTML = this.eventHTML()
    else return
    this.el.dataset.mode = this.mode
    this.el.classList.toggle('chapter', this.mode === 'era')
    this.el.classList.add('show')
    this.el.scrollTop = 0
  }

  header(ic, title, gloss) {
    return `<header>
        <div class="card-icon">${icon(ic, 26)}</div>
        <div class="card-titles"><h1>${esc(title)}</h1>${gloss ? `<p class="gloss">${esc(gloss)}</p>` : ''}</div>
        <button class="card-close" aria-label="Close">${icon('close', 18)}</button>
      </header>`
  }

  eventHTML() {
    const ev = this.ev
    const placeNames = (ev.where || [])
      .map((w) => {
        const p = this.places.get(w.place)
        return p ? `${esc(p.name)}${w.role ? ` <em>${esc(w.role)}</em>` : ''}` : null
      })
      .filter(Boolean)
    const conf = Object.entries(ev.confidence || {})
      .map(([k, v]) => `<span class="conf ${esc(v)}"><b>${esc(k)}</b> ${esc(v)}</span>`)
      .join('')
    const tellings = (ev.tellings || [])
      .map((t) => {
        const s = this.cited(t.source)
        return s ? `<li><span class="src-title">${esc(s.title)}</span>: ${esc(t.says)}</li>` : ''
      })
      .join('')
    const stops = ev.stops || []
    const st = this.stop >= 0 ? stops[this.stop] : null
    const stopPlace = st ? this.places.get(st.place) : null
    return `
      ${this.header(kindIcon(ev), ev.title, ev.gloss)}
      <div class="card-meta"><span class="when">${esc(formatWhen(ev))}</span><span class="kind">${esc(KIND[ev.kind] || ev.kind || 'event')}</span></div>
      ${placeNames.length ? `<div class="card-where">${placeNames.join('<i>·</i>')}</div>` : ''}
      ${st ? `<div class="stop"><div class="stop-n">${this.stop + 1} / ${stops.length}${stopPlace ? ` · ${esc(stopPlace.name)}` : ''}</div><p>${esc(st.text)}</p></div>` : ''}
      <div class="card-body">${ev.summary ? `<p>${esc(ev.summary)}</p>` : ''}</div>
      ${conf ? `<div class="card-conf">${conf}</div>` : ''}
      ${tellings ? `<div class="card-sec"><h2>Tellings</h2><ul class="tellings">${tellings}</ul></div>` : ''}
      ${this.sourcesSection(ev.sources)}
      ${this.footer()}`
  }

  eraHTML() {
    const ch = this.chapter
    const e = ch.era
    const t = chapterTitle(e.label || e.id)
    // (the note's first letter set large, with an ʻokina or an opening mark before it kept with it)
    const note = String(e.note || '')
    const m = note.match(/^([ʻʼ'‘“"(]*.)([\s\S]*)$/u)
    const body = m ? `<p><span class="initial">${esc(m[1])}</span>${esc(m[2])}</p>` : ''
    return `
      <header class="ch-head">
        <div class="ch-mark"><span class="ch-word">Chapter</span><span class="ch-num">${ch.index + 1}</span></div>
        <h1 class="ch-title">${t.lead ? `<span class="ch-lead">${esc(t.lead)}</span>${esc(t.gap)}` : ''}<span class="ch-name">${esc(t.name)}</span></h1>
        <div class="ch-year">${esc(formatYear(e.year, Math.max(10, e.yearPrecision ?? 10)))}</div>
        <button class="card-close" aria-label="Close">${icon('close', 18)}</button>
      </header>
      <div class="card-body ch-note">${body}</div>
      ${ch.events.length ? `<div class="card-sec"><h2>In this chapter</h2><ul class="ev-list compact">${this.eventRows(ch.events, { gloss: false })}</ul></div>` : ''}
      ${this.sourcesSection(e.sources)}
      ${this.footer()}`
  }

  clusterHTML() {
    const list = this.list || []
    const names = []
    for (const ev of list) {
      const w = (ev.where || []).map((x) => this.places.get(x.place)).find(Boolean)
      if (w && !names.includes(w.name)) names.push(w.name)
    }
    const at = names.length > 4 ? `${names.slice(0, 4).join(' · ')} · and ${names.length - 4} more` : names.join(' · ')
    return `
      ${this.header('pins', `${list.length} events`, at)}
      <div class="card-sec"><ul class="ev-list">${this.eventRows(list)}</ul></div>`
  }
}
