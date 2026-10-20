// Line icons, 24×24, drawn in currentColor (the ahupuaʻa set, cut to what
// this app uses, plus one for each kind of event in DATA.md §4).

const P = {
  // events, by kind
  arrival: '<path d="M2.5 15.5h19l-2.6 3.6H5.1z"/><path d="M11.5 15.5V4l6.5 9.2h-6.5"/><path d="M2 21.2c2 0 2-.8 4-.8s2 .8 4 .8 2-.8 4-.8 2 .8 4 .8 2-.8 4-.8"/>',
  voyage: '<path d="M2.5 14.5h19l-2.6 3.6H5.1z"/><path d="M11.5 14.5V3.5l6.5 9h-6.5"/><path d="M6 21c3-1.4 9-1.4 12 0"/>',
  battle: '<path d="M4.5 19.5 19.5 4.5M4.5 4.5l15 15"/><path d="M16.5 4.5h3v3M7.5 4.5h-3v3"/>',
  founding: '<path d="M2.5 20.5h19v-3h-16v-3h13v3"/><path d="M8 14.5V5.5h2.2v9"/><path d="M13.5 14.5v-3M16 14.5v-3"/>',
  construction: '<path d="M2.5 20.5h19v-3h-16v-3h13v3"/><path d="M8 14.5V5.5h2.2v9"/><path d="M13.5 14.5v-3M16 14.5v-3"/>',
  eruption: '<path d="M2.5 20.5 9 11h6l6.5 9.5z"/><path d="M10.2 8.2c0-2 1-3.1 1.8-4.7.8 1.6 1.8 2.7 1.8 4.7"/><path d="M7 6.5l1.3 1.3M17 6.5l-1.3 1.3"/>',
  epidemic: '<circle cx="12" cy="12" r="4.5"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>',
  law: '<path d="M7 3h8l4 4v14H7z"/><path d="M15 3v4h4"/><path d="M10 11h6M10 14h6M10 17h4"/>',
  treaty: '<path d="M7 3h8l4 4v14H7z"/><path d="M15 3v4h4"/><path d="M10 12h6M10 15h3"/><path d="M13.5 18.5c1-1 1.8-1 2.8 0"/>',
  death: '<path d="M3.5 18.5h17"/><path d="M7 18.5a5 5 0 0 1 10 0"/><path d="M12 4.5v5M9.6 7.4 12 9.8l2.4-2.4"/>',
  protest: '<path d="M6 21V3.5"/><path d="M6 4h11.5l-2.6 4 2.6 4H6"/>',
  restoration: '<path d="M12 21v-8"/><path d="M12 13c0-4 3-6.5 7.5-6.5 0 4-3 6.5-7.5 6.5z"/><path d="M12 15.5c0-3.2-2.2-5.5-6.5-5.5 0 3.3 2.2 5.5 6.5 5.5z"/>',
  other: '<path d="M12 21s-6-5.6-6-10.5a6 6 0 0 1 12 0C18 15.4 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.2"/>',
  // controls
  play: '<path d="M8 5.5v13l10.5-6.5z" fill="currentColor" stroke="none"/>',
  pause: '<path d="M8 5.5v13M16 5.5v13" stroke-width="2.6"/>',
  prev: '<path d="M15 5l-7 7 7 7"/>',
  next: '<path d="M9 5l7 7-7 7"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  polity: '<path d="M3 6.5 9 4.5l6 2 6-2v13l-6 2-6-2-6 2z"/><path d="M9 4.5v13M15 6.5v13"/>',
  lines: '<path d="M12 3 4 20M12 3l8 17"/><path d="M12 3v17" stroke-dasharray="2 2.4"/>',
  pins: '<path d="M12 21s-6-5.6-6-10.5a6 6 0 0 1 12 0C18 15.4 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.2"/>',
  home: '<path d="M3 16c2-1 3.5-6 6-6s3 3 4.5 3 2.5-4 4.5-4 2.5 5 3 7"/><path d="M2 19.5c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1 2-1 4-1"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1 .8-1 1.6v.6"/><circle cx="12" cy="17.2" r=".9" fill="currentColor"/>',
  expand: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
}

export function icon(name, size = 24) {
  return `<svg class="ic" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] || P.other}</svg>`
}

export const hasIcon = (name) => name in P
