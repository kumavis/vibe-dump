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
//   })
//
// Each moment carries *Take the controls*, which raises ui.onTake(momentId);
// *Watch* closes the card and raises ui.onWatch(). A moment marked `focus`
// (the URL's #moment) has its button focused, never pressed: a moment never
// starts without a click (ENGINEERING §9).

import { esc } from './dom.js'
import { icon } from './icons.js'

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
  const moments = (b.moments || [])
    .map(
      (m) => `<li class="bm">
        <div class="bm-head"><span class="bm-t">${esc(m.t || '')}</span><b>${esc(m.title)}</b></div>
        ${m.ja ? `<div class="bm-ja" lang="ja">${esc(m.ja)}</div>` : ''}
        ${m.role ? `<div class="bm-role">${esc(m.role)}</div>` : ''}
        ${m.objective ? `<p>${esc(m.objective)}</p>` : ''}
        <button class="nav take${m.focus ? ' focus' : ''}" data-take="${esc(m.id)}">${icon('take', 16)}<span>Take the controls</span></button>
      </li>`,
    )
    .join('')
  return `
    <header>
      <div class="card-icon">${icon('box', 26)}</div>
      <div class="card-titles"><h1>${esc(b.title || '')}</h1>${b.when ? `<p class="gloss">${esc(b.when)}</p>` : ''}${ja}</div>
      <button class="card-close" aria-label="Close">${icon('close', 18)}</button>
    </header>
    ${b.clock ? `<div class="card-clock">${esc(b.clock)}${b.clockNote ? `<span>${esc(b.clockNote)}</span>` : ''}</div>` : ''}
    ${b.situation ? `<div class="card-body"><p>${esc(b.situation)}</p></div>` : ''}
    ${forces ? `<div class="card-sec"><h2>The forces</h2><div class="bf">${forces}</div></div>` : ''}
    ${moments ? `<div class="card-sec"><h2>Moments</h2><ul class="bms">${moments}</ul></div>` : ''}
    <div class="card-sec"><h2>Sources</h2><ul class="sources">${(b.sources || []).map((s) => sourceLine(s)).join('') || '<li class="none">none listed</li>'}</ul></div>
    <footer class="card-foot">
      <button class="nav watch">${icon('watch', 16)}<span>Watch</span></button>
      <button class="nav credits-link">${icon('sources', 16)}<span>Sources and credits</span></button>
    </footer>
    ${b.credit ? `<p class="card-credit">${esc(b.credit)}</p>` : ''}`
}
