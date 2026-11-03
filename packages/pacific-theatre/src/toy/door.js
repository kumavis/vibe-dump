// The toy's door on a battle's card (TOY.md §3): *Arcade*, third in the row
// beside *Enter the battle* and *Play it as a wargame*. card.js draws it from
// these; link.js opens the toy on it.

import './toy.css'

export const TOY_LABEL = 'Arcade: a three-minute toy battle over this sea. A toy, not the record.'
export const TOY_ICON = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="7" width="19" height="11" rx="5.5"/><path d="M7.5 10.5v4M5.5 12.5h4"/><circle cx="15.5" cy="11.5" r=".9" fill="currentColor"/><circle cx="17.8" cy="13.8" r=".9" fill="currentColor"/></svg>'

/** The boxes the toy can stand over: any with a sea (its arena is found in the box's open water). */
export const toyBoxFor = (ev, data) => (ev?.box && data?.boxById?.has(ev.box) ? ev.box : null)
