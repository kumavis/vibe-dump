// The after-card (ENGINEERING.md §11, R7 §4.13, R8 §5.2 d): a sortie's end,
// in four labelled parts in both languages, as a DOM template fed by a plain
// object, so the engine and the integrator only hand it data
// (Battle.takeMoment()'s resolved value, shaped by the integrator) and the UI
// never imports the sim.
//
//   ui.openAfter({
//     momentId: 'vb6-kaga', title: 'Bombing Six pushes over on Kaga', ja: null,
//     sortie: [ { label: 'Hits', value: 'one 1,000-lb bomb, aft of the island' },
//               { label: 'Release', value: '740 m (the record: about 760 m)' }, { label: 'Came back', value: 'landed on Enterprise' } ],
//     battle: { rows: [ { what: 'Kaga', yours: 'afloat at 18:00' }, { what: 'Bombing Six', yours: '5 aircraft lost' } ],
//               guesses: [ 'Hiryū's second strike: the sim's guess; the record has no such event' ] },
//     record: { text: 'what the record says, with its ranges', tellings: [ { source, says } ], sources: [ ... ] },
//     next: { text: 'what came next, in the record', sources: [ ... ] },
//     retry: { start: true, checkpoint: true },
//   })
//
// The parts: *Your sortie* (あなたの出撃), what the player's own unit did, in
// hits, heights, torpedoes, aircraft and time; *Your battle* (あなたの戦い),
// what went otherwise in the player's battle, from the sim's side only, a
// short past-tense line each ("Kaga: afloat at 18:00."), never beside the
// record (DESIGN §5.7: the parts never share a row; R8 §5.2 d: no line
// joins the two); *The record* (記録), the record's own
// text with its tellings and sources, the only part where people are
// counted, in the record's ranges; *What came next* (その後). The buttons:
// *Watch on* (ui.onWatchOn()), *Back to the table* (ui.onLeave()), and the
// restart points (ui.onRetry(momentId, 'start' | 'checkpoint')).
//
// The rules the card keeps whatever it is handed (DESIGN.md §3.5, §7.4; R8
// §5.1): no count of people outside *The record* (a line in the first two
// parts that sets a number beside men, crews, lives, the dead or 人, 名, 命
// is dropped and said in the console), and none of "saved", "what if" or
// "victory" anywhere on it.

import { esc } from './dom.js'
import { icon } from './icons.js'

// (DATA.md §10's matchers, as tools/check/common.mjs has them)
const PEOPLE_NUMBER = /\d[\d,.]*\s*(?:men|crew|lives|dead|killed|died|people|人|名|命)|(?:men|crew|lives|dead|killed|died|people)\s*[:：]?\s*\d/i
const AFTER_WORDS = [/\bsaved\b/i, /\bwhat if\b/i, /\bvictor(?:y|ies)\b/i]

export const AFTER_PARTS = {
  sortie: { en: 'Your sortie', ja: 'あなたの出撃' },
  battle: { en: 'Your battle', ja: 'あなたの戦い' },
  record: { en: 'The record', ja: '記録' },
  next: { en: 'What came next', ja: 'その後' },
}

/** Whether a line may stand in a part of the after-card (people only in the record; never the words). */
export function afterLineOk(text, part, warn = console.warn) {
  const s = String(text ?? '')
  if (part !== 'record' && PEOPLE_NUMBER.test(s)) {
    warn(`after-card: a count of people outside The record, left out: “${s}”`)
    return false
  }
  if (AFTER_WORDS.some((r) => r.test(s))) {
    warn(`after-card: a word the after-card never uses, left out: “${s}”`)
    return false
  }
  return true
}

const head = (k) => `<h2>${AFTER_PARTS[k].en} <span lang="ja">${AFTER_PARTS[k].ja}</span></h2>`

/** The after-card's HTML; `sourceLine` renders one source reference as the event card does. */
export function afterHTML(a, { sourceLine, sourceTitle = (id) => id, warn = console.warn }) {
  const ok = (t, part) => afterLineOk(t, part, warn)
  const sortie = (a.sortie || []).filter((r) => ok(`${r.label ?? ''} ${r.value ?? r}`, 'sortie'))
  const lines = (a.battle?.rows || []).map((r) => `${r.what}: ${r.yours}.`).filter((l) => ok(l, 'battle'))
  const guesses = (a.battle?.guesses || []).filter((g) => ok(g, 'battle'))
  const recText = a.record?.text && ok(a.record.text, 'record') ? a.record.text : ''
  const tellings = (a.record?.tellings || []).filter((t) => ok(t.says, 'record'))
  const nextText = a.next?.text && ok(a.next.text, 'next') ? a.next.text : ''
  const ja = a.ja ? `<p class="card-ja"><span lang="ja">${esc(typeof a.ja === 'string' ? a.ja : a.ja.kanji)}</span></p>` : ''
  return `
    <header>
      <div class="card-icon">${icon('take', 26)}</div>
      <div class="card-titles"><h1>${esc(a.title || '')}</h1>${ja}</div>
      <button class="card-close" aria-label="Close">${icon('close', 18)}</button>
    </header>
    <section class="card-sec after-part" data-part="sortie">${head('sortie')}
      ${sortie.length ? `<dl class="af-sortie">${sortie.map((r) => (typeof r === 'string' ? `<dd>${esc(r)}</dd>` : `<dt>${esc(r.label)}</dt><dd>${esc(r.value)}</dd>`)).join('')}</dl>` : '<p class="none">—</p>'}
    </section>
    <section class="card-sec after-part" data-part="battle">${head('battle')}
      ${lines.length ? `<ul class="af-battle">${lines.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>` : ''}
      ${guesses.length ? `<ul class="af-guess">${guesses.map((g) => `<li>${esc(g)}</li>`).join('')}</ul>` : ''}
      ${lines.length || guesses.length ? '' : '<p class="none">Nothing left the record. <span lang="ja">記録から外れたものはなかった。</span></p>'}
    </section>
    <section class="card-sec after-part" data-part="record">${head('record')}
      ${recText ? `<div class="card-body"><p>${esc(recText)}</p></div>` : ''}
      ${tellings.length ? `<ul class="tellings">${tellings.map((t) => `<li>${t.source ? `<span class="src-title">${esc(t.sourceTitle || sourceTitle(t.source))}</span>: ` : ''}${esc(t.says)}</li>`).join('')}</ul>` : ''}
      ${(a.record?.sources || []).length ? `<ul class="sources">${a.record.sources.map((s) => sourceLine(s)).join('')}</ul>` : ''}
    </section>
    <section class="card-sec after-part" data-part="next">${head('next')}
      ${nextText ? `<div class="card-body"><p>${esc(nextText)}</p></div>` : ''}
      ${(a.next?.sources || []).length ? `<ul class="sources">${a.next.sources.map((s) => sourceLine(s)).join('')}</ul>` : ''}
    </section>
    <footer class="card-foot">
      <button class="nav watch-on">${icon('watch', 16)}<span>Watch on</span></button>
      ${a.retry?.start ? `<button class="nav retry" data-from="start">From the start</button>` : ''}
      ${a.retry?.checkpoint ? `<button class="nav retry" data-from="checkpoint">From the checkpoint</button>` : ''}
      <button class="nav finish to-table">Back to the table</button>
    </footer>`
}
