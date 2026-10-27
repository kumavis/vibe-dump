// The Wargame's interface (ROUND-3.md §1, §5): the HUD layer over the box's
// own HUD while a wargame runs, and the two cards that frame it, the start
// sheet and the end card (card.js's modes `wargame` and `wargame-end`). Plain
// DOM templates fed by plain objects that src/link.js builds from the arena,
// raising callbacks, so the UI never imports the sim.
//
// The HUD layer (one block at the top, under the box's bar):
//   - both sides' strength as bars, Japan on the left and the United States
//     on the right whichever side is played (the one played marked), each
//     with its name and its tally under it ("sank 2 · shot down 9": a tally
//     is what a side did, never a score);
//   - the timer between them (the game's clock, 0:00 to 10:00);
//   - the goal line, the played side's main goal with its count ("2 of 4");
//   - the current phase, its title, its count and its timer; a phase met or
//     missed says so ("done" / "missed");
//   - the held unit's name and station;
// and over the scene:
//   - the hit markers, in machine words at the target ("Kumano: hit forward,
//     fire"), where the scene projects it, for 1.5 s, stacking upward on one
//     target, the player's own in sand;
//   - the respawn line ("Your Avenger did not return. The next one is
//     yours."), three seconds in the middle;
//   - the hop hints, once (Tab and 1–4; on a touch screen the hop button).
// The block says where it ends through data-pt-head, so the box's bar
// publishes --pt-head under it and the box's own HUD and touch controls
// stand beneath (ui/boxbar.js; scene/hud.js and controls/touch.js read it).
//
//   hud.set({ sides: [{ code: 'jp', name, strength: 0..1, tally: { sunk, downed }, mine }, { code: 'us', … }],
//             timer: '4:37', goal: { text, count: '2 of 4', status: 'open' | 'met' | 'failed' },
//             phase: { key, title, text, count: '0 of 1', left: '1:12', status } | null,
//             you: { name: 'Johnston', sub: 'DD-557 · Helm' } | null, touch: bool }) | hud.set(null)
//   hud.marks([{ key, x, y, text, mine, age }])          (each frame; age in seconds, 0 to 1.5)
//   hud.say(text, seconds)                               (the respawn line)
//   hud.hint(lines, seconds)                             (the hop hints)
//
// The start sheet (card mode `wargame`):
//   { id, title, label, gloss, focus: 'jp' | 'us' | null, missing: bool,
//     sides: [{ code, name, ja, leader, goal, ships: [{ label: '6 escort carriers', names: [{ name, ja }] }],
//               aircraft: { count, list: ['10 Avengers', '10 Wildcats'] } }] }
//   the side buttons, *Japan* and *United States*, raise ui.onWargameStart(side).
// The end card (card mode `wargame-end`):
//   { title, label, kicker, result, sides: [{ code, name, line, mine }], yours, reel: [{ src, caption }],
//     footnote, side, other: { code, name } }
//   *Play again* raises ui.onWargameRestart(side), *Play the other side* ui.onWargameRestart(other),
//   *Back to the table* ui.onLeave(); a still of the reel opens large on a tap (Esc or a tap closes it).
//
// The voice (DESIGN.md §3.5, §7.3–7.4; ROUND-3 §1): machines, not people:
// shot down, sunk, hit, did not return; a tally, never a score; no count of
// people; nothing that celebrates; a sinking on either side reads the same.

import { h, esc } from './dom.js'
import { icon } from './icons.js'

/** The hop's icon: two courses crossing over (the bar's button and the hints). */
export const HOP_ICON = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h12l-3.5-3.5M20 16H8l3.5 3.5"/></svg>'
/** The wargame's icon (the door on the bar and the cards): two bows meeting. */
export const WARGAME_ICON = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.5 15.5h7l1.5-2.5M21.5 15.5h-7L13 13"/><path d="M5 12.5V10h3v2.5M16 12.5V10h3v2.5"/><path d="M2 19c2 0 2-.8 4-.8s2 .8 4 .8 2-.8 4-.8 2 .8 4 .8 2-.8 4-.8"/></svg>'

/** The what-if label (ROUND-3.md §1, word for word; tools/check/wargames.mjs holds each scenario's to it): the door, the start sheet, the end card. */
export const WARGAME_LABEL = 'A wargame played with the real forces. The record is on the other side of the table.'

/** Text with its CJK runs marked lang="ja" (a leader's kanji after the romanised name), escaped. */
export const withJa = (text) => esc(text || '').replace(/[\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff]+/g, (m) => `<span lang="ja">${m}</span>`)

/** The ship types in words, singular and plural, in the order a force lists them. */
export const TYPE_WORDS = {
  cv: ['carrier', 'carriers'],
  cvl: ['light carrier', 'light carriers'],
  cve: ['escort carrier', 'escort carriers'],
  bb: ['battleship', 'battleships'],
  ca: ['heavy cruiser', 'heavy cruisers'],
  cl: ['light cruiser', 'light cruisers'],
  dd: ['destroyer', 'destroyers'],
  de: ['destroyer escort', 'destroyer escorts'],
  ship: ['ship', 'ships'],
  aircraft: ['aircraft', 'aircraft'],
}
export const TYPE_ORDER = ['cv', 'cvl', 'cve', 'bb', 'ca', 'cl', 'dd', 'de']
const NUM = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve']
/** 4 → "four" (to twelve), digits beyond. */
export const numWord = (n) => (Number.isInteger(n) && n >= 0 && n < NUM.length ? NUM[n] : String(n))
/** "four escort carriers", "one destroyer". */
export const typeCount = (n, type, { words = true } = {}) => `${words ? numWord(n) : n} ${(TYPE_WORDS[type] || [type, `${type}s`])[n === 1 ? 0 : 1]}`
/** Seconds as the game's clock: 277 → "4:37". */
export const clockText = (s) => `${Math.floor(Math.max(0, s) / 60)}:${String(Math.floor(Math.max(0, s) % 60)).padStart(2, '0')}`

export class WargameHud {
  /** on: { layout() } — the block's height changed (the bar publishes --pt-head again) */
  constructor(root, on = {}) {
    this.on = on
    this.el = h('div', { class: 'wg-hud', hidden: '' })
    // (the markers first, so the block stands over a marker whose ship sails under it)
    this.el.innerHTML = `
      <div class="wg-marks" aria-hidden="true"></div>
      <div class="wg-board" data-pt-head>
        <div class="wg-top">
          <div class="wg-side wg-jp" data-side="jp"><div class="wg-name"></div><div class="wg-bar"><i></i></div><div class="wg-tally"></div></div>
          <div class="wg-timer" aria-label="The game’s clock"><b></b></div>
          <div class="wg-side wg-us" data-side="us"><div class="wg-name"></div><div class="wg-bar"><i></i></div><div class="wg-tally"></div></div>
        </div>
        <div class="wg-goal"><span class="wg-goal-t"></span><b class="wg-goal-n"></b></div>
        <div class="wg-phase"><span class="wg-ph-title"></span><span class="wg-ph-text"></span><b class="wg-ph-n"></b><span class="wg-ph-left"></span></div>
        <div class="wg-you"><b class="wg-you-name"></b><span class="wg-you-sub"></span></div>
      </div>
      <div class="wg-say" role="status" aria-live="polite"></div>
      <div class="wg-hints"></div>`
    // (first in the interface, so the bar, the list, the card and the end card stand over it)
    root.insertBefore(this.el, root.firstChild)
    this.$ = (s) => this.el.querySelector(s)
    this.board = this.$('.wg-board')
    this.marksEl = this.$('.wg-marks')
    this.sayEl = this.$('.wg-say')
    this.hintsEl = this.$('.wg-hints')
    this.markEls = new Map()
    this.key = ''
    this.sayUntil = 0
    this.hintUntil = 0
    this.lastH = 0
    this.ro = typeof ResizeObserver === 'function' ? new ResizeObserver(() => this.layout()) : null
    this.ro?.observe(this.board)
  }

  get shown() {
    return !this.el.hidden
  }

  layout() {
    const hgt = this.el.hidden ? 0 : Math.round(this.board.getBoundingClientRect().height)
    if (hgt === this.lastH) return
    this.lastH = hgt
    this.on.layout?.()
  }

  /** The block from a plain object (null hides the layer); only what changed is written. */
  set(s) {
    const show = !!s
    if (this.el.hidden === show) {
      this.el.hidden = !show
      document.body.classList.toggle('pt-wargame', show)
      if (!show) {
        this.marks([])
        this.sayEl.textContent = ''
        this.hintsEl.textContent = ''
      }
      this.key = ''
      this.layout()
    }
    if (!s) return
    const now = performance.now() / 1000
    if (this.sayUntil && now > this.sayUntil) {
      this.sayUntil = 0
      this.sayEl.classList.remove('show')
    }
    if (this.hintUntil && now > this.hintUntil) {
      this.hintUntil = 0
      this.hintsEl.classList.remove('show')
    }
    const key = JSON.stringify(s)
    if (key === this.key) return
    this.key = key
    this.el.classList.toggle('touch', !!s.touch)
    for (const sd of s.sides || []) {
      const el = this.$(`.wg-side[data-side="${sd.code}"]`)
      if (!el) continue
      el.classList.toggle('mine', !!sd.mine)
      put(el.querySelector('.wg-name'), sd.name || '')
      el.querySelector('.wg-bar i').style.width = `${(Math.max(0, Math.min(1, sd.strength ?? 0)) * 100).toFixed(1)}%`
      el.querySelector('.wg-bar').setAttribute('aria-label', `${sd.name}: strength ${Math.round((sd.strength ?? 0) * 100)} %`)
      const t = sd.tally || {}
      put(el.querySelector('.wg-tally'), `sank ${t.sunk ?? 0} · shot down ${t.downed ?? 0}`)
    }
    put(this.$('.wg-timer b'), s.timer || '')
    const g = s.goal
    this.$('.wg-goal').hidden = !g
    if (g) {
      put(this.$('.wg-goal-t'), g.text || '')
      put(this.$('.wg-goal-n'), g.count || '')
      this.$('.wg-goal').dataset.status = g.status || 'open'
    }
    const p = s.phase
    const ph = this.$('.wg-phase')
    ph.hidden = !p
    if (p) {
      put(this.$('.wg-ph-title'), p.title || '')
      put(this.$('.wg-ph-text'), p.text || '')
      put(this.$('.wg-ph-n'), p.status === 'met' ? 'done' : p.status === 'failed' ? 'missed' : p.count || '')
      put(this.$('.wg-ph-left'), p.status === 'open' ? p.left || '' : '')
      ph.dataset.status = p.status || 'open'
      // (a new phase stands out for a moment)
      if (p.key !== this.phaseKey) {
        if (this.phaseKey !== undefined) {
          ph.classList.remove('new')
          void ph.offsetWidth
          ph.classList.add('new')
        }
        this.phaseKey = p.key
      }
    }
    const y = s.you
    this.$('.wg-you').hidden = !y
    if (y) {
      put(this.$('.wg-you-name'), y.name || '')
      put(this.$('.wg-you-sub'), y.sub || '')
    }
  }

  /** The hit markers: [{ key, x, y, text, mine, age }], placed where the scene projects their target, stacked on one target. */
  marks(list) {
    const seen = new Set()
    const stack = new Map()
    const placed = []
    const W = innerWidth
    const H = innerHeight
    for (const m of list) {
      // (a target off the screen has no marker: one pinned to the edge would name the wrong ship)
      if (m.x == null || m.y == null || m.x < -30 || m.x > W + 30 || m.y < -30 || m.y > H + 30) continue
      let el = this.markEls.get(m.id)
      if (!el) {
        el = h('div', { class: `wg-mark${m.mine ? ' mine' : ''}${m.kind ? ` k-${m.kind}` : ''}` })
        const i = String(m.text).indexOf(': ')
        el.innerHTML = i > 0 ? `<b>${esc(m.text.slice(0, i))}</b>: ${esc(m.text.slice(i + 2))}` : esc(m.text)
        this.marksEl.appendChild(el)
        this.markEls.set(m.id, el)
      }
      seen.add(m.id)
      const n = stack.get(m.key) ?? 0
      stack.set(m.key, n + 1)
      el._w ||= el.offsetWidth || 120
      // (kept whole on the screen: a ship at the edge has its words just inside it)
      const x = Math.max(el._w / 2 + 8, Math.min(W - el._w / 2 - 8, m.x))
      let yy = Math.max(32, Math.min(H - 8, m.y - 16 - n * 19))
      // (markers on ships close together step up past one another, so each can be read)
      for (let k = 0; k < 6 && placed.some((p) => Math.abs(p.x - x) < (p.w + el._w) / 2 && Math.abs(p.y - yy) < 19); k++) yy -= 19
      yy = Math.max(32, yy)
      placed.push({ x, y: yy, w: el._w })
      el.style.transform = `translate(${x.toFixed(1)}px, ${yy.toFixed(1)}px) translate(-50%, -100%)`
      el.style.opacity = String(m.age > 1.1 ? Math.max(0, (1.5 - m.age) / 0.4) : 1)
    }
    for (const [id, el] of this.markEls) {
      if (seen.has(id)) continue
      el.remove()
      this.markEls.delete(id)
    }
  }

  say(text, seconds = 3) {
    this.sayEl.textContent = text
    this.sayEl.classList.toggle('show', !!text)
    this.sayUntil = text ? performance.now() / 1000 + seconds : 0
  }

  hint(lines, seconds = 8) {
    this.hintsEl.innerHTML = (lines || []).map((l) => `<div>${l}</div>`).join('')
    this.hintsEl.classList.toggle('show', !!lines?.length)
    this.hintUntil = lines?.length ? performance.now() / 1000 + seconds : 0
  }
}

function put(el, text) {
  if (el && el.textContent !== text) el.textContent = text
}

/** The start sheet's HTML (card mode `wargame`): the two sides with their forces and goals, the label, Japan and United States. */
export function startSheetHTML(s) {
  const side = (sd) => {
    const ships = (sd.ships || [])
      .map((g) => `<li><b>${esc(g.label)}</b> ${g.names.map((n) => `<span class="wg-n">${esc(n.name)}${n.ja ? ` <span lang="ja">${esc(n.ja)}</span>` : ''}</span>`).join('<i>· </i>')}</li>`)
      .join('')
    const air = sd.aircraft?.count ? `<li><b>${esc(`${sd.aircraft.count} aircraft`)}</b> ${esc(sd.aircraft.list.join(', '))}</li>` : ''
    return `<div class="wg-ss-side" data-side="${esc(sd.code)}">
        <h3>${esc(sd.name)}${sd.ja ? ` <span lang="ja">${esc(sd.ja)}</span>` : ''}</h3>
        ${sd.leader ? `<p class="wg-ss-leader">${withJa(sd.leader)}</p>` : ''}
        <ul class="wg-forces">${ships}${air}</ul>
        ${sd.goal ? `<p class="wg-ss-goal"><span class="uc-k">Goal</span> ${esc(sd.goal)}</p>` : ''}
        <button class="nav finish wg-start${s.focus === sd.code ? ' focus' : ''}" data-wg-side="${esc(sd.code)}">${WARGAME_ICON}<span>${esc(sd.code === 'jp' ? 'Japan' : 'United States')}</span></button>
      </div>`
  }
  return `
    <header>
      <div class="card-icon wg-icon">${WARGAME_ICON.replace('width="16" height="16"', 'width="26" height="26"')}</div>
      <div class="card-titles"><h1>${esc(s.title || '')}</h1>${s.gloss ? `<p class="gloss">${esc(s.gloss)}</p>` : ''}</div>
      <button class="card-close" aria-label="Close">${icon('close', 18)}</button>
    </header>
    ${s.label ? `<p class="wg-label">${esc(s.label)}</p>` : ''}
    ${s.missing ? '<p class="wg-missing">This wargame is still being set up.</p>' : `<div class="card-sec"><h2>Pick a side</h2><div class="wg-ss">${(s.sides || []).map(side).join('')}</div></div>`}
    <footer class="card-foot wg-ss-foot"><span class="wg-ss-keys">${esc(s.keys || 'Tab and 1–4 move you between ships and aircraft.')}</span></footer>`
}

/** The end card's HTML (card mode `wargame-end`): the result, both tallies, yours, the reel, the record's sentence, the three ways on. */
export function endCardHTML(e) {
  const sides = (e.sides || []).map((sd) => `<li class="${sd.mine ? 'mine' : ''}" data-side="${esc(sd.code)}"><b>${esc(sd.name)}</b> ${esc(sd.line)}</li>`).join('')
  const reel = (e.reel || [])
    .map((r, i) => `<figure class="wg-still"><button class="wg-shot" data-shot="${i}" aria-label="${esc(`Enlarge: ${r.caption}`)}"><img src="${esc(r.src)}" alt="${esc(r.caption)}" width="320" height="200" loading="lazy"></button><figcaption>${esc(r.caption)}</figcaption></figure>`)
    .join('')
  return `
    <header>
      <div class="card-icon wg-icon">${WARGAME_ICON.replace('width="16" height="16"', 'width="26" height="26"')}</div>
      <div class="card-titles"><h1>${esc(e.title || '')}</h1>${e.kicker ? `<p class="gloss">${esc(e.kicker)}</p>` : ''}</div>
      <button class="card-close" aria-label="Close">${icon('close', 18)}</button>
    </header>
    <p class="wg-result">${esc(e.result || '')}</p>
    <div class="card-sec"><h2>The tallies</h2><ul class="wg-tallies">${sides}</ul>${e.yours ? `<p class="wg-yours"><span class="uc-k">Yours</span> ${esc(e.yours)}</p>` : ''}</div>
    ${reel ? `<div class="card-sec"><h2>The reel</h2><div class="wg-reel">${reel}</div></div>` : ''}
    ${e.label ? `<p class="wg-label small">${esc(e.label)}</p>` : ''}
    ${e.footnote ? `<div class="card-sec wg-foot"><h2>The record</h2><p>${withJa(e.footnote)}</p></div>` : ''}
    <footer class="card-foot">
      <button class="nav finish wg-again" data-wg-restart="${esc(e.side)}">${WARGAME_ICON}<span>Play again</span></button>
      ${e.other ? `<button class="nav wg-other" data-wg-restart="${esc(e.other.code)}"><span>Play the other side</span></button>` : ''}
      <button class="nav to-table">Back to the table</button>
    </footer>`
}
