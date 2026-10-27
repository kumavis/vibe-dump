// The briefing card (ENGINEERING.md §11): what a box holds at the moment it
// opens, as a DOM template fed by a plain object, so the engine and the
// integrator only hand it data and the UI never imports the sim.
//
//   ui.openBriefing({
//     title: 'Midway, 4 June 1942', ja: { kanji: 'ミッドウェー海戦', romaji: 'Middowē kaisen' },
//     when: '4 June 1942, 10:20', clock: 'Midway time (zone +12)', clockNote: '…',
//     situation: 'one paragraph, present tense',
//     forces: [ { side: 'japan', name: 'Imperial Japanese Navy', ja: '大日本帝国海軍', units: ['Kaga 加賀', '…'] }, … ],
//     moments: [ { id: 'vb6-kaga', title: '…', ja: null, role: 'a Dauntless of Bombing Six', t: '10:21:30',
//                  objective: 'Put a thousand-pound bomb on Kaga's flight deck.', focus: true }, … ],
//     sources: [ { title, author, year, url, where, opened } | 'source-id' ],   // ids resolve through sources.json
//     credit: 'Terrain produced using Copernicus WorldDEM-30 …',               // the box's `credit`, verbatim
//     door: { title: 'Gwin’s helm', text: '…', role: 'Gwin (DD-433), the helm', t: '23:24' },   // ROUND-2 §1.2: Start here
//     assist: 'assisted' | 'pilot',                                             // the setting, kept in the browser
//     wargame: { id: 'samar', label: 'A wargame played with the real forces. …' }, // ROUND-3 §5: the door, where the box has one
//   })
//
// Each moment carries *Take the controls*, which raises ui.onTake(momentId);
// *Watch* closes the card and raises ui.onWatch(). A moment marked `focus`
// (the URL's #moment) has its button focused, never pressed: a moment never
// starts without a click (ENGINEERING §9).
//
// Round two (ROUND-2.md §1.2, §5): *Start here*, the box's one gentle first
// door, stands before the record's turning points, its button raising
// ui.onFirstDoor(); under it the setting, Assisted or Pilot, with its one
// line, each a button raising ui.onAssist(value). Nothing prompts a take:
// watching stays the default and Watch closes the card.
//
// Round three (ROUND-3.md §5): where the box has a wargame, *Play it as a
// wargame* (with its label: a wargame played with the real forces) stands
// after the setting, raising ui.onWargame(id), which opens the start sheet.

import { esc } from './dom.js'
import { icon } from './icons.js'
import { ASSIST, ASSIST_LABEL, ASSIST_LINE } from './roles.js'
import { WARGAME_ICON } from './wargame.js'

/** The setting's two buttons and its line (the briefing's and the bar's look alike). */
export function assistHTML(value, { line = true } = {}) {
  const v = ASSIST.includes(value) ? value : 'assisted'
  const opts = ASSIST.map((a) => `<button class="as-opt${a === v ? ' on' : ''}" role="radio" aria-checked="${a === v}" data-assist="${a}">${esc(ASSIST_LABEL[a])}</button>`).join('')
  return `<div class="assist" role="radiogroup" aria-label="Flying">${opts}</div>${line ? `<p class="as-line">${esc(ASSIST_LINE)}</p>` : ''}`
}

/** The briefing's HTML; `sourceLine` renders one source reference as the event card does. */
export function briefingHTML(b, { sourceLine }) {
  const ja = b.ja?.kanji ? `<p class="card-ja"><span lang="ja">${esc(b.ja.kanji)}</span>${b.ja.romaji ? ` <em>${esc(b.ja.romaji)}</em>` : ''}</p>` : ''
  // (the Japanese name and its reading sit under the title, as on an event's card)
  const forces = (b.forces || [])
    .map(
      (f) => `<div class="bf-side">
        <h3>${esc(f.name || f.side)}${f.ja ? ` <span lang="ja">${esc(f.ja)}</span>` : ''}</h3>
        ${f.units?.length ? `<p>${f.units.map((u) => esc(u)).join('<i>·</i>')}</p>` : ''}
      </div>`,
    )
    .join('')
  // the moments on both sides, each side under its own name
  let lastSide = null
  const moments = (b.moments || [])
    .map(
      (m) => `${m.sideName && m.sideName !== lastSide ? `<li class="bm-side">${esc((lastSide = m.sideName))}</li>` : ''}<li class="bm">
        <div class="bm-head"><span class="bm-t">${esc(m.t || '')}</span><b>${esc(m.title)}</b></div>
        ${m.ja ? `<div class="bm-ja" lang="ja">${esc(m.ja)}</div>` : ''}
        ${m.role ? `<div class="bm-role">${esc(m.role)}</div>` : ''}
        ${m.objective ? `<p>${esc(m.objective)}</p>` : ''}
        <button class="nav take${m.focus ? ' focus' : ''}" data-take="${esc(m.id)}">${icon('take', 16)}<span>Take the controls</span></button>
      </li>`,
    )
    .join('')
  const d = b.door
  const door = d
    ? `<div class="card-sec door"><h2>Start here</h2><div class="door-card">
        <div class="bm-head">${d.t ? `<span class="bm-t">${esc(d.t)}</span>` : ''}<b>${esc(d.title || '')}</b></div>
        ${d.role ? `<div class="bm-role">${esc(d.role)}</div>` : ''}
        ${d.text ? `<p>${esc(d.text)}</p>` : ''}
        <button class="nav take door-take" data-door="1">${icon('take', 16)}<span>Take the controls</span></button>
      </div></div>`
    : ''
  const setting = b.assist ? `<div class="card-sec setting"><h2>Flying</h2>${assistHTML(b.assist)}</div>` : ''
  const wg = b.wargame?.id
    ? `<div class="card-sec wg-brief"><h2>A wargame</h2><div class="door-card wg-door-card">
        ${b.wargame.label ? `<p>${esc(b.wargame.label)}</p>` : ''}
        <button class="nav take wg-door" data-wargame="${esc(b.wargame.id)}">${WARGAME_ICON}<span>Play it as a wargame</span></button>
      </div></div>`
    : ''
  return `
    <header>
      <div class="card-icon">${icon('box', 26)}</div>
      <div class="card-titles"><h1>${esc(b.title || '')}</h1>${b.when ? `<p class="gloss">${esc(b.when)}</p>` : ''}${ja}</div>
      <button class="card-close" aria-label="Close">${icon('close', 18)}</button>
    </header>
    ${b.clock ? `<div class="card-clock">${esc(b.clock)}${b.clockNote ? `<span>${esc(b.clockNote)}</span>` : ''}</div>` : ''}
    ${b.situation ? `<div class="card-body"><p>${esc(b.situation)}</p></div>` : ''}
    ${forces ? `<div class="card-sec"><h2>The forces</h2><div class="bf">${forces}</div></div>` : ''}
    ${door}${setting}${wg}
    ${moments ? `<div class="card-sec"><h2>${d || b.assist ? 'The record’s turning points' : 'Moments'}</h2><ul class="bms">${moments}</ul></div>` : ''}
    <div class="card-sec"><h2>Sources</h2><ul class="sources">${(b.sources || []).map((s) => sourceLine(s)).join('') || '<li class="none">none listed</li>'}</ul></div>
    <footer class="card-foot">
      <button class="nav watch">${icon('watch', 16)}<span>Watch</span></button>
      <button class="nav credits-link">${icon('sources', 16)}<span>Sources and credits</span></button>
    </footer>
    ${b.credit ? `<p class="card-credit">${esc(b.credit)}</p>` : ''}`
}
