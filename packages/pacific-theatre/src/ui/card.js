// The card on the right (ENGINEERING.md §11). Six kinds share it:
//
// - `event`: the title with its Japanese name and reading beneath, the gloss;
//   when, in the zone of the event's own clock, with the clock named and the
//   other side's date where it differs (`when.alt`, `zoneNote`); where (with
//   today's name where it differs); the sides; while the tour walks the
//   event's table stops, the stop it is at; the summary; how sure the record
//   is; the tellings where the sources disagree; the routes it draws; the
//   sources, each with its access and licence and a "verify" mark on one not
//   yet opened. A box event's footer offers *Enter the battle*
//   (ui.onEnter(ev)).
// - `chapter`: a chapter's first page, as a book sets it (the card's
//   `chapter` class): "Chapter" and its numeral large (or "Prologue"), the
//   chapter's label as its title, its span beneath, the note with a large
//   initial, the events in it (each a way into its card), its sources.
// - `cluster`: the events of pins that share a spot on the screen, in order
//   of their UTC instant.
// - `briefing` and `after`: a box's briefing and a sortie's after-card,
//   templates fed by plain objects (briefing.js, after.js).
// - `credits`: the Sources and credits panel (credits.js).
//
// The footer steps the tour (tour.js) back and on, as the buttons by the
// timeline do: it sits where the reading ends.
//
// Adapted from holo-i-ke-au's ui/card.js (b480c27): the event, chapter and
// cluster cards and the one click listener are kept; the kinds, the dates,
// the Japanese names, the sides, the routes, the sources' licences, the box's
// button and the three new modes are this app's.

import { h, esc } from './dom.js'
import { icon, hasIcon } from './icons.js'
import { formatWhen, zoneLabel, parseInstant } from '../time.js'
import { kindName, sideName, LICENCES, ACCESS } from './names.js'
import { shortWhen } from './pins.js'
import { tableStops } from './tour.js'
import { dayLabel } from './timeline.js'
import { briefingHTML } from './briefing.js'
import { afterHTML } from './after.js'
import { creditsHTML } from './credits.js'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const kindIcon = (ev) => (hasIcon(ev.kind) ? ev.kind : 'other')
const monthYear = (ms) => {
  const d = new Date(ms)
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`
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
    this.routes = new Map(app.data.routes.map((r) => [r.id, r]))
    this.clocks = app.data.clockById || new Map()
    this.mode = null // 'event' | 'chapter' | 'cluster' | 'briefing' | 'after' | 'credits'
    this.ev = null
    this.stop = -1
    this.chapter = null
    this.list = null
    this.payload = null
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

  openChapter(chapter) {
    this.set('chapter', { chapter })
  }

  openList(events) {
    this.set('cluster', { list: events })
  }

  openBriefing(b) {
    this.set('briefing', { payload: b })
    this.el.querySelector('.take.focus')?.focus({ preventScroll: true })
  }

  openAfter(a) {
    this.set('after', { payload: a })
  }

  openCredits() {
    // (what was open comes back when the panel closes)
    if (this.mode !== 'credits') this.before = this.mode ? { mode: this.mode, ev: this.ev, chapter: this.chapter, list: this.list, payload: this.payload, stop: this.stop } : null
    this.set('credits', {})
  }

  set(mode, { ev = null, chapter = null, list = null, payload = null }) {
    this.mode = mode
    this.ev = ev
    this.chapter = chapter
    this.list = list
    this.payload = payload
    this.stop = -1
    this.render()
  }

  close() {
    if (this.mode === 'credits' && this.before) {
      const b = this.before
      this.before = null
      this.set(b.mode, b)
      if (b.stop >= 0) this.setStop(b.stop)
      return
    }
    const was = this.ev
    const mode = this.mode
    this.el.classList.remove('show')
    this.mode = null
    this.ev = null
    this.chapter = null
    this.list = null
    this.payload = null
    this.before = null
    this.ui.onCardClosed?.(was, mode)
  }

  click(e) {
    const b = e.target.closest('button')
    if (!b || !this.el.contains(b)) return
    const ui = this.ui
    const tour = ui.tour
    if (b.classList.contains('card-close')) this.close()
    else if (b.classList.contains('prev')) tour.back()
    else if (b.classList.contains('next')) tour.next()
    else if (b.classList.contains('enter')) {
      const ev = this.events.get(b.dataset.enter)
      if (ev) ui.onEnter(ev)
    } else if (b.dataset.take) ui.onTake(b.dataset.take)
    else if (b.classList.contains('watch')) {
      this.close()
      ui.onWatch()
    } else if (b.classList.contains('watch-on')) {
      this.close()
      ui.onWatchOn()
    } else if (b.classList.contains('to-table')) {
      this.close()
      ui.onLeave()
    } else if (b.classList.contains('retry')) ui.onRetry(this.payload?.momentId ?? null, b.dataset.from)
    else if (b.classList.contains('credits-link')) this.openCredits()
    else if (b.dataset.ev) {
      const ev = this.events.get(b.dataset.ev)
      // from a chapter's list, the full step; from a cluster, come to it gently
      if (ev) tour.open(ev, { gentle: this.mode === 'cluster' })
    }
  }

  /** One source reference (an id with `where`, an id, or a whole source) as a line of the sources list. */
  sourceLine(ref) {
    const id = typeof ref === 'string' ? ref : ref?.id
    const s = (id && this.sources.get(id)) || (typeof ref === 'object' && ref?.title ? ref : null)
    const where = typeof ref === 'object' && ref?.where ? `, ${esc(ref.where)}` : ''
    if (!s) return `<li><span class="src-title">${esc(id)}</span>${where} <span class="flag missing" title="not in sources.json">missing</span></li>`
    const title = s.url && /^https?:/.test(s.url) ? `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title)}</a>` : esc(s.title)
    const verify = s.opened === false ? ' <span class="flag" title="Not yet read at the source: check this before relying on it">verify</span>' : ''
    const by = s.author ? `${esc(s.author)}, ` : ''
    const yr = s.year ? ` (${esc(s.year)})` : ''
    const notes = [ACCESS[s.access], LICENCES[s.licence] ?? '', s.ref ? s.ref : ''].filter(Boolean)
    return `<li>${by}<span class="src-title">${title}</span>${yr}${where}${verify}${notes.length ? ` <span class="src-note">${esc(notes.join(' · '))}</span>` : ''}</li>`
  }

  sourcesSection(refs) {
    return `<div class="card-sec"><h2>Sources</h2><ul class="sources">${(refs || []).map((s) => this.sourceLine(s)).join('') || '<li class="none">none listed</li>'}</ul></div>`
  }

  /** A list of events, a row each: what they are, when, and what they're called. */
  eventRows(events, { gloss = true } = {}) {
    return events
      .map(
        (ev) => `<li><button class="ev-row${ev.box ? ' boxed' : ''}" data-ev="${esc(ev.id)}">
          <span class="ev-ic">${icon(kindIcon(ev), 16)}</span>
          <span class="ev-y">${esc(shortWhen(ev))}</span>
          <span class="ev-t"><b>${esc(ev.title)}</b>${gloss && ev.gloss ? `<em>${esc(ev.gloss)}</em>` : ''}</span>
        </button></li>`,
      )
      .join('')
  }

  /** Back and Next, and where the tour stands, for a card the tour is showing (and a box event's way in). */
  footer() {
    const tour = this.ui.tour
    const enter = this.mode === 'event' && this.ev?.box ? `<button class="nav enter" data-enter="${esc(this.ev.id)}">${icon('enter', 16)}<span>Enter the battle</span></button>` : ''
    if (!tour?.active) return enter ? `<footer>${enter}</footer>` : ''
    const ch = tour.current
    let count
    let nextLabel = 'Next'
    if (this.mode === 'chapter' && this.chapter === ch && tour.step < 0) {
      // (as the pill over the timeline names it, and the card's own numeral)
      count = ch.prologue ? '<span class="ch-count">Prologue</span>' : `<span class="ch-count">Chapter <b>${ch.number}</b> of ${tour.numbered}</span>`
    } else if (this.mode === 'event' && this.ev && this.ev === tour.event) {
      const n = tableStops(this.ev).length
      if (tour.stop >= 0) count = esc(`stop ${tour.stop + 1} of ${n}`)
      else {
        count = esc(`${tour.step + 1} of ${ch.events.length}`)
        if (n) nextLabel = n === 1 ? 'Its stop' : `Walk ${n} stops`
      }
    } else return enter ? `<footer>${enter}</footer>` : ''
    return `<footer>
      <button class="nav prev" aria-label="Back" title="Back (←)" ${tour.atStart ? 'disabled' : ''}>${icon('prev', 18)}</button>
      <span class="count">${count}</span>
      ${enter}
      <button class="nav next" aria-label="Next" title="Next (→ or space)" ${tour.atEnd ? 'disabled' : ''}><span>${esc(nextLabel)}</span>${icon('next', 18)}</button>
    </footer>`
  }

  render() {
    const helpers = { sourceLine: (s) => this.sourceLine(s), sourceTitle: (id) => this.sources.get(id)?.title || id, warn: (m) => this.app.warn(m) }
    if (this.mode === 'chapter') this.el.innerHTML = this.chapterHTML()
    else if (this.mode === 'cluster') this.el.innerHTML = this.clusterHTML()
    else if (this.mode === 'event' && this.ev) this.el.innerHTML = this.eventHTML()
    else if (this.mode === 'briefing') this.el.innerHTML = briefingHTML(this.payload || {}, helpers)
    else if (this.mode === 'after') this.el.innerHTML = afterHTML(this.payload || {}, helpers)
    else if (this.mode === 'credits') this.el.innerHTML = this.creditsHTML()
    else return
    this.el.dataset.mode = this.mode
    this.el.classList.toggle('chapter', this.mode === 'chapter')
    this.el.classList.add('show')
    this.el.scrollTop = 0
  }

  header(ic, title, gloss, ja = null) {
    const jaLine = ja?.kanji ? `<p class="card-ja"><span lang="ja">${esc(ja.kanji)}</span>${ja.romaji ? ` <em>${esc(ja.romaji)}</em>` : ''}</p>` : ''
    return `<header>
        <div class="card-icon">${icon(ic, 26)}</div>
        <div class="card-titles"><h1>${esc(title)}</h1>${gloss ? `<p class="gloss">${esc(gloss)}</p>` : ''}${jaLine}</div>
        <button class="card-close" aria-label="Close">${icon('close', 18)}</button>
      </header>`
  }

  /** "4 June 1942, 04:30 – 7 June 1942, 05:01 (UTC−12)", the clock's name, the other side's date. */
  whenHTML(ev) {
    const w = ev.when || {}
    let main = ''
    try {
      main = formatWhen(w, { zone: w.zone })
    } catch {
      main = String(w.from || '')
    }
    const clock = w.clock ? this.clocks.get(w.clock) : null
    const lines = []
    if (clock?.name) lines.push(`${clock.name}${w.zone ? ` (${zoneLabel(w.zone)})` : ''}`)
    for (const alt of w.alt || []) {
      const c = alt.clock ? this.clocks.get(alt.clock) : null
      let d = alt.from
      try {
        const z = alt.zone || c?.offset || null
        d = dayLabel(parseInstant(alt.from, { zone: z }) + (z ? zoneMinutesMs(z) : 0))
      } catch {
        /* (as written) */
      }
      lines.push(`${d} on ${c?.name || alt.clock || 'another clock'}`)
    }
    if (w.zoneNote) lines.push(w.zoneNote)
    return `<span class="when">${esc(main)}</span>${lines.length ? `<div class="when-note">${lines.map((l) => `<span>${esc(l)}</span>`).join('')}</div>` : ''}`
  }

  eventHTML() {
    const ev = this.ev
    const placeNames = (ev.where || [])
      .map((w) => {
        const p = this.places.get(w.place)
        if (!p) return null
        const today = p.today && p.today !== p.name ? ` <em>today ${esc(p.today)}</em>` : ''
        const ja = p.ja?.kanji ? ` <span lang="ja" class="pl-ja">${esc(p.ja.kanji)}</span>` : ''
        return `${esc(p.name)}${ja}${today}${w.role ? ` <em>${esc(w.role)}</em>` : ''}`
      })
      .filter(Boolean)
    const conf = Object.entries(ev.confidence || {})
      .map(([k, v]) => `<span class="conf ${esc(v)}"><b>${esc(k)}</b> ${esc(v)}</span>`)
      .join('')
    const tellings = (ev.tellings || [])
      .map((t) => `<li><span class="src-title">${esc(this.sources.get(t.source)?.title || t.source)}</span>: ${esc(t.says)}</li>`)
      .join('')
    const routes = (ev.routes || [])
      .map((id) => this.routes.get(id))
      .filter(Boolean)
      .map((r) => `<li><b>${esc(r.title || r.id)}</b>${r.gloss ? `, ${esc(r.gloss)}` : ''}</li>`)
      .join('')
    const stops = tableStops(ev)
    const st = this.stop >= 0 ? stops[this.stop] : null
    const stopPlace = st ? this.places.get(st.place) : null
    const sides = (ev.sides || []).map((s) => esc(sideName(s))).join('<i>·</i>')
    return `
      ${this.header(kindIcon(ev), ev.title, ev.gloss, ev.ja)}
      <div class="card-meta">${this.whenHTML(ev)}<span class="kind">${esc(kindName(ev.kind))}</span></div>
      ${placeNames.length ? `<div class="card-where">${placeNames.join('<i>·</i>')}</div>` : ''}
      ${sides ? `<div class="card-sides">${sides}</div>` : ''}
      ${st ? `<div class="stop"><div class="stop-n">${this.stop + 1} / ${stops.length}${stopPlace ? ` · ${esc(stopPlace.name)}` : ''}</div><p>${esc(st.text)}</p></div>` : ''}
      <div class="card-body">${ev.summary ? `<p>${esc(ev.summary)}</p>` : ''}</div>
      ${conf ? `<div class="card-conf">${conf}</div>` : ''}
      ${tellings ? `<div class="card-sec"><h2>Tellings</h2><ul class="tellings">${tellings}</ul></div>` : ''}
      ${routes ? `<div class="card-sec"><h2>On the table</h2><ul class="routes">${routes}</ul></div>` : ''}
      ${this.sourcesSection(ev.sources)}
      ${this.footer()}`
  }

  chapterHTML() {
    const ch = this.chapter
    const c = ch.chapter
    const label = String(c.label || c.id)
    const title = label.replace(/^./, (m) => m.toUpperCase())
    const span = `${monthYear(c.fromMs)} – ${monthYear(c.toMs - 86400000)}`
    // (the note's first letter set large, with an opening mark before it kept with it)
    const note = String(c.note || '')
    const m = note.match(/^([‘“"(]*.)([\s\S]*)$/u)
    const body = m ? `<p><span class="initial">${esc(m[1])}</span>${esc(m[2])}</p>` : ''
    return `
      <header class="ch-head">
        <div class="ch-mark">${ch.prologue ? '<span class="ch-word">Prologue</span><span class="ch-num ch-orn">❧</span>' : `<span class="ch-word">Chapter</span><span class="ch-num">${ch.number}</span>`}</div>
        <h1 class="ch-title"><span class="ch-name">${esc(title)}</span></h1>
        <div class="ch-year">${esc(span)}</div>
        <button class="card-close" aria-label="Close">${icon('close', 18)}</button>
      </header>
      <div class="card-body ch-note">${body}</div>
      ${ch.events.length ? `<div class="card-sec"><h2>In this chapter</h2><ul class="ev-list compact">${this.eventRows(ch.events, { gloss: false })}</ul></div>` : ''}
      ${this.sourcesSection(c.sources)}
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

  creditsHTML() {
    return `
      ${this.header('sources', 'Sources and credits', 'what the table and the boxes are made from')}
      <div class="card-body credits-body">${creditsHTML(this.app.data)}</div>`
  }
}

/** A zone's offset in ms (the wall clock is UTC plus this). */
function zoneMinutesMs(z) {
  const m = /^([+-])(\d{2}):(\d{2})$/.exec(z)
  if (!m) return 0
  return (m[1] === '-' ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3])) * 60000
}
