// The Sources and credits panel (ENGINEERING.md §11, R8 §6.6): every data
// source with its licence, in the words of the package's NOTICE.md (so the
// notice that travels with a fork or a download of the data is the one the
// app shows), then each battle box's own credit line verbatim from
// boxes/manifest.json and the table pack's sources from manifest.json.
//
// NOTICE.md is read into the bundle as text at build time (Vite's `?raw`),
// so the panel works offline and from the boot screen before any data has
// loaded; the boxes' and the table's lines join it once the data is in.

import notice from '../../NOTICE.md?raw'
import { esc } from './dom.js'
import { LICENCES } from './names.js'

/** NOTICE.md's few Markdown forms (#, ##, paragraphs, *emphasis*, `code`, <url> and [text](url)) as HTML. */
export function markdown(md) {
  const inline = (s) =>
    esc(s)
      .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/&lt;(https?:[^&\s]+)&gt;/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
  const out = []
  for (const block of String(md).split(/\n\s*\n/)) {
    const b = block.trim()
    if (!b) continue
    const m = /^(#{1,3})\s+(.*)$/.exec(b)
    if (m) {
      const level = m[1].length
      // (the file's own title is the panel's heading)
      if (level === 1) continue
      out.push(`<h3>${inline(m[2])}</h3>`)
    } else out.push(`<p>${inline(b.replace(/\s*\n\s*/g, ' '))}</p>`)
  }
  return out.join('')
}

/** The panel's body: NOTICE.md, then (with data) the boxes' credit lines and the table pack's sources. */
export function creditsHTML(data = null) {
  let html = markdown(notice)
  const boxes = data?.boxes || []
  if (boxes.length) {
    html += `<h3>The battle boxes</h3><ul class="credits">${boxes.map((b) => `<li><b>${esc(b.name || b.id)}</b>${b.credit ? `: ${esc(b.credit)}` : ''}</li>`).join('')}</ul>`
  }
  const table = data?.table?.sources || []
  if (table.length) {
    html += `<h3>The table's relief</h3><ul class="credits">${table
      .map((s) => {
        const t = s.url && /^https?:/.test(s.url) ? `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title || s.id)}</a>` : esc(s.title || s.id)
        const lic = LICENCES[s.licence] ?? s.licence
        return `<li>${t}${s.doi ? ` <em>doi:${esc(s.doi)}</em>` : ''}${lic ? ` <em>${esc(lic)}</em>` : ''}${s.fetched ? ` <em>fetched ${esc(s.fetched)}</em>` : ''}</li>`
      })
      .join('')}</ul>`
  }
  return html
}
