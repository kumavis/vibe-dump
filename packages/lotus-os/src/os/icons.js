// icons.js — the functional icon set: chrome, file types, toolbar glyphs.
//
// Deliberately plain line work on a 24x24 grid, drawn in `currentColor`, so the
// ornamental Thai motifs in motifs.js stay the only decorated thing on screen.
// Everything here is a string of SVG children; `icon()` wraps it.

const PATHS = {
  folder:
    '<path d="M3 6.6c0-.9.7-1.6 1.6-1.6h4l1.9 2.2h8c.9 0 1.6.7 1.6 1.6v8.6c0 .9-.7 1.6-1.6 1.6H4.6c-.9 0-1.6-.7-1.6-1.6z"/><path d="M3 10.4h18" opacity=".55"/>',
  'folder-open':
    '<path d="M3 6.6c0-.9.7-1.6 1.6-1.6h4l1.9 2.2h8c.9 0 1.6.7 1.6 1.6v1.6"/><path d="M3 18.8V8.9m0 9.9c0 .1.1.2.3.2h14.4c.7 0 1.3-.4 1.5-1.1l2-6c.2-.6-.2-1.1-.8-1.1H6.3c-.7 0-1.3.4-1.5 1.1l-1.6 5c0 .3-.2.6-.2 1z"/>',
  doc: '<path d="M6 3.2h7.4L18 7.9v12.9H6z"/><path d="M13.2 3.4v4.6H18"/><path d="M8.7 12.6h6.6M8.7 15.4h6.6M8.7 18h4.2" opacity=".65"/>',
  image:
    '<path d="M3.6 5.4h16.8v13.2H3.6z"/><circle cx="8.6" cy="9.9" r="1.5"/><path d="M3.6 16.2l4.6-4.1 3.5 3 3.4-3.6 5.3 5"/>',
  terminal:
    '<path d="M3.4 5h17.2v14H3.4z"/><path d="M6.8 9.4l3 2.6-3 2.6M12.4 15.2h5" opacity=".9"/>',
  gear: '<circle cx="12" cy="12" r="3.1"/><path d="M12 2.9l1.3 2.3 2.6-.5.4 2.6 2.4 1.1-1.2 2.3 1.7 2-2.1 1.6.3 2.6-2.6.2-1.4 2.2-2.2-1.4-2.4 1-.9-2.5-2.5-.8.5-2.6-1.8-1.9 2-1.7-.2-2.6 2.6-.3z"/>',
  info: '<circle cx="12" cy="12" r="8.6"/><path d="M12 10.9v5.6M12 7.9v.1" stroke-linecap="round"/>',
  chip: '<rect x="7" y="7" width="10" height="10" rx="1.4"/><path d="M10 3.6v3.2M14 3.6v3.2M10 17.2v3.2M14 17.2v3.2M3.6 10h3.2M3.6 14h3.2M17.2 10h3.2M17.2 14h3.2"/>',
  printer:
    '<path d="M6.4 9.2V3.8h11.2v5.4"/><path d="M4.2 9.2h15.6v6.4H4.2z"/><path d="M6.4 15.6v4.6h11.2v-4.6"/><circle cx="16.6" cy="12.2" r=".9" fill="currentColor" stroke="none"/>',
  exec: '<path d="M12 2.6l7 4v6.5c0 4-3 7.1-7 8.3-4-1.2-7-4.3-7-8.3V6.6z"/><path d="M12 7.4v4.2M9.6 9.6h4.8" opacity=".8"/><circle cx="12" cy="15.4" r="1.1"/>',
  chevron: '<path d="M9.6 6.4l5.2 5.6-5.2 5.6" stroke-linecap="round"/>',
  'chevron-down': '<path d="M6.4 9.6l5.6 5.2 5.6-5.2" stroke-linecap="round"/>',
  back: '<path d="M14.4 6.4L9.2 12l5.2 5.6" stroke-linecap="round"/>',
  up: '<path d="M12 19V6M6.4 11.4L12 5.8l5.6 5.6" stroke-linecap="round"/>',
  grid: '<rect x="4.2" y="4.2" width="6.2" height="6.2" rx="1"/><rect x="13.6" y="4.2" width="6.2" height="6.2" rx="1"/><rect x="4.2" y="13.6" width="6.2" height="6.2" rx="1"/><rect x="13.6" y="13.6" width="6.2" height="6.2" rx="1"/>',
  list: '<path d="M8.4 6.6h11.4M8.4 12h11.4M8.4 17.4h11.4M4.4 6.6h.1M4.4 12h.1M4.4 17.4h.1" stroke-linecap="round"/>',
  search: '<circle cx="10.8" cy="10.8" r="5.8"/><path d="M15.2 15.2l4.4 4.4" stroke-linecap="round"/>',
  refresh:
    '<path d="M20 12a8 8 0 11-2.6-5.9" stroke-linecap="round"/><path d="M20.2 3.6v4.6h-4.6" stroke-linecap="round" stroke-linejoin="round"/>',
  external:
    '<path d="M13.4 4.4h6.2v6.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M19.6 4.4L11 13" stroke-linecap="round"/><path d="M17.4 14.2v4.2c0 .9-.7 1.6-1.6 1.6H5.6c-.9 0-1.6-.7-1.6-1.6V8c0-.9.7-1.6 1.6-1.6h4.2" stroke-linecap="round"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 3.2v2.4M12 18.4v2.4M3.2 12h2.4M18.4 12h2.4M5.8 5.8l1.7 1.7M16.5 16.5l1.7 1.7M18.2 5.8l-1.7 1.7M7.5 16.5l-1.7 1.7" stroke-linecap="round"/>',
  moon: '<path d="M20 14.2A8.6 8.6 0 019.8 4 8.6 8.6 0 1020 14.2z"/>',
  'sound-on':
    '<path d="M4.6 9.4h3.2L12 5.8v12.4l-4.2-3.6H4.6z"/><path d="M15.2 9.6a3.4 3.4 0 010 4.8M17.8 7a7 7 0 010 10" stroke-linecap="round"/>',
  'sound-off':
    '<path d="M4.6 9.4h3.2L12 5.8v12.4l-4.2-3.6H4.6z"/><path d="M15.6 10.4l4 3.2M19.6 10.4l-4 3.2" stroke-linecap="round"/>',
  power: '<path d="M12 3.6v7.8" stroke-linecap="round"/><path d="M7.4 6.6a6.6 6.6 0 109.2 0"/>',
  clock: '<circle cx="12" cy="12" r="8.4"/><path d="M12 7.2V12l3.2 2" stroke-linecap="round"/>',
  window: '<rect x="3.4" y="4.8" width="17.2" height="14.4" rx="1.6"/><path d="M3.4 9h17.2"/>',
  cascade:
    '<rect x="3.4" y="3.6" width="12" height="9.4" rx="1.2"/><rect x="8.6" y="11" width="12" height="9.4" rx="1.2"/>',
  tile: '<rect x="3.4" y="4.4" width="7.6" height="15.2" rx="1.2"/><rect x="13" y="4.4" width="7.6" height="6.8" rx="1.2"/><rect x="13" y="12.8" width="7.6" height="6.8" rx="1.2"/>',
  check: '<path d="M5.4 12.6l4.2 4.2 9-9.6" stroke-linecap="round" stroke-linejoin="round"/>',
  x: '<path d="M6.4 6.4l11.2 11.2M17.6 6.4L6.4 17.6" stroke-linecap="round"/>',
  disc: '<circle cx="12" cy="12" r="8.6"/><circle cx="12" cy="12" r="2.2"/>',
  eye: '<path d="M2.6 12S6.4 5.8 12 5.8 21.4 12 21.4 12 17.6 18.2 12 18.2 2.6 12 2.6 12z"/><circle cx="12" cy="12" r="2.8"/>',
  drive: '<rect x="3.2" y="6" width="17.6" height="12" rx="2"/><path d="M6.6 14.8h.1M9.8 14.8h.1" stroke-linecap="round"/><path d="M3.2 11.4h17.6" opacity=".5"/>',
  key: '<circle cx="8.2" cy="12" r="3.6"/><path d="M11.8 12h8.4M17.4 12v3M20.2 12v2.4" stroke-linecap="round"/>',
  plant: '<path d="M12 20.4v-7.8"/><path d="M12 12.6C12 9 9.4 6.2 5.8 5.6c-.6 3.6 2 7 6.2 7z"/><path d="M12 14.2c0-3 2.2-5.4 5.4-6 .5 3.2-1.9 6-5.4 6z"/><path d="M8.6 20.4h6.8" stroke-linecap="round"/>',
}

/**
 * @param {keyof typeof PATHS} name
 * @param {{size?:number, stroke?:number, className?:string}} [opts]
 */
export function icon(name, { size = 20, stroke = 1.45, className = '' } = {}) {
  const body = PATHS[name] ?? PATHS.doc
  return `<svg class="icon ${className}" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="${stroke}" stroke-linejoin="round" aria-hidden="true">${body}</svg>`
}

export const hasIcon = (name) => Object.prototype.hasOwnProperty.call(PATHS, name)
export const iconNames = () => Object.keys(PATHS)
