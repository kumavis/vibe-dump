// Line icons, 24×24, drawn in currentColor: one for each kind of event in
// DATA.md §4 (R3 §2.1), a chapter's mark, and the controls. Adapted from
// holo-i-ke-au's ui/icons.js (b480c27): the drawing conventions and the
// controls are kept; the Hawaiian kinds are gone. Nothing here is a flag, a
// figure or a weapon going off: the kinds are told by a ship, a track, a
// shoreline, a document, a rule.

const P = {
  // events, by kind
  // a battle: two courses crossing at sea
  battle: '<path d="M3 17c4-1.5 7-5.5 9-10M21 17c-4-1.5-7-5.5-9-10"/><path d="M2 20.5c2 0 2-.8 4-.8s2 .8 4 .8 2-.8 4-.8 2 .8 4 .8 2-.8 4-.8"/>',
  // a campaign: a long arrow over a span of days
  campaign: '<path d="M3 16c3-4 6-6 10-6.5 2.5-.3 4.5.4 6.5 1.5"/><path d="M17 8.6l3 2.4-3.2 2"/><path d="M4 20h16" stroke-dasharray="1.5 2.2"/>',
  // a landing: a shore with an arrow onto it
  landing: '<path d="M2 18.5c2 0 2-.8 4-.8s2 .8 4 .8"/><path d="M13 20.5l2.5-5h6.5"/><path d="M3 9.5h8.5M9 6.5l3 3-3 3"/>',
  // a raid: a track out and back to a point
  raid: '<circle cx="17" cy="7" r="2.2"/><path d="M4 19c3-6 7-9.5 11-11"/><path d="M6.5 20c3.5-5.5 7.5-9 10-10.6" stroke-dasharray="2 2"/>',
  // a siege: a ring round a point
  siege: '<circle cx="12" cy="12" r="2.5"/><circle cx="12" cy="12" r="7.5" stroke-dasharray="2.4 2.2"/>',
  // a sinking: a hull going under the line of the sea
  sinking: '<path d="M6.5 9.5l9 4.5-1.6 2.6-8.8-4.4z"/><path d="M10.5 11.5l1.4-3"/><path d="M2 17.5c2 0 2-.8 4-.8s2 .8 4 .8 2-.8 4-.8 2 .8 4 .8 2-.8 4-.8"/>',
  // an occupation: a marker set on an island
  occupation: '<path d="M3 18.5c3-2.5 6-3.5 9-3.5s6 1 9 3.5"/><path d="M12 15V4.5"/><path d="M12 5h6l-2 2.2 2 2.3h-6"/>',
  // a surrender: a document signed
  surrender: '<path d="M7 3h8l4 4v14H7z"/><path d="M15 3v4h4"/><path d="M10 11h6M10 14h4"/><path d="M10 18c1.2-1.4 2.4-1.4 3.6 0 .8.9 1.6.9 2.4 0"/>',
  // politics: a document
  political: '<path d="M7 3h8l4 4v14H7z"/><path d="M15 3v4h4"/><path d="M10 11h6M10 14h6M10 17h4"/>',
  // a bombing of a city: a city's skyline, quiet
  bombing: '<path d="M3 20.5h18"/><path d="M5 20.5V12h4v8.5M10 20.5V8h4v12.5M15 20.5v-6h4v6"/>',
  // an atrocity: a stone of remembrance
  atrocity: '<path d="M8 20.5V8.5a4 4 0 0 1 8 0v12"/><path d="M5.5 20.5h13"/><path d="M10.5 11.5h3"/>',
  // captivity: a fence line
  captivity: '<path d="M3 8h18M3 13h18M3 18h18"/><path d="M6 5v15M12 5v15M18 5v15"/>',
  // the peoples' events: a house on an island shore
  people: '<path d="M5 13.5 12 8l7 5.5"/><path d="M7 12.5v6h10v-6"/><path d="M2 21c2 0 2-.8 4-.8s2 .8 4 .8 2-.8 4-.8 2 .8 4 .8 2-.8 4-.8"/>',
  other: '<path d="M12 21s-6-5.6-6-10.5a6 6 0 0 1 12 0C18 15.4 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.2"/>',
  // a chapter's mark: a chart's compass rose, quartered
  chapter: '<circle cx="12" cy="12" r="8"/><path d="M12 3.5v17M3.5 12h17"/><path d="M12 7l1.3 3.7L17 12l-3.7 1.3L12 17l-1.3-3.7L7 12l3.7-1.3z"/>',
  // a battle box on the table: a rectangle on the sea
  box: '<rect x="4" y="5" width="16" height="12" rx="1.5"/><path d="M2 20.5c2 0 2-.8 4-.8s2 .8 4 .8 2-.8 4-.8 2 .8 4 .8 2-.8 4-.8"/>',
  // controls
  prev: '<path d="M15 5l-7 7 7 7"/>',
  next: '<path d="M9 5l7 7-7 7"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  enter: '<path d="M12 3v12M7 10l5 5 5-5"/><rect x="4" y="17" width="16" height="4" rx="1"/>',
  take: '<circle cx="12" cy="12" r="8"/><path d="M12 4v4M12 16v4M4 12h4M16 12h4"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/>',
  watch: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  // the front: a held area with its dashed rim
  front: '<path d="M4 15c2-4 5-7 9-7.5 3-.4 5.5 1 7 3" stroke-dasharray="2.3 2"/><path d="M4 15c3 3 8 4.5 12 3.5 2.5-.6 4-2.4 4-4.5" /><path d="M8 14.5l3-3M11 16l4-4M14.5 16.5l3-3"/>',
  // a course over the sea: setting out from a point, an arrowhead where it ends
  routes: '<circle cx="4.5" cy="18.5" r="1.6"/><path d="M6.4 17.6c3.4-1.6 2.6-6.1 6.1-6.1s3.2-5.1 6.6-5.6" stroke-dasharray="2.3 2.2"/><path d="M16.5 4 19.6 5.8l-2.4 2.6"/>',
  pins: '<path d="M12 21s-6-5.6-6-10.5a6 6 0 0 1 12 0C18 15.4 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.2"/>',
  labels: '<path d="M4 7h10M9 7v11"/><path d="M14.5 12h5.5M17.2 12v6"/>',
  home: '<rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="M6 15c2-3 4-4.5 6-4.5s3.5 1 6 3"/>',
  sources: '<path d="M5 4.5h10.5L19 8v11.5H5z"/><path d="M8 9h7M8 12h8M8 15h6"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1 .8-1 1.6v.6"/><circle cx="12" cy="17.2" r=".9" fill="currentColor"/>',
  expand: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
  arrow: '<path d="M5 12h13M13 7l5 5-5 5"/>',
}

export function icon(name, size = 24) {
  return `<svg class="ic" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] || P.other}</svg>`
}

export const hasIcon = (name) => name in P
