// motif-viewer.js — the ornament table.
//
// The rest of the OS uses these shapes between 16 and 40 pixels, which is
// where they were designed to work and where none of the construction shows.
// This is the one window that draws one big enough to see how it is built,
// on graph paper, because graph paper is what it was built on.

import { el } from '../util.js'
import { MOTIFS, motifSVG } from '../motifs.js'

// The order the Wat folder lists them in, which reads better than whatever
// order the module happens to declare. Anything motifs.js grows later gets
// appended rather than quietly dropped.
const ORDER = ['lotus', 'bud', 'kranok', 'chofa', 'chedi', 'naga', 'prajamYam']

const FADE_MS = 140

const titleCase = (key) =>
  String(key)
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/^./, (c) => c.toUpperCase())

export default {
  id: 'motifs',
  title: 'Ornament Table',
  mark: 'lotus',
  width: 480,
  height: 520,
  minWidth: 320,
  minHeight: 360,

  mount(body, { win, shell, args }) {
    const table = MOTIFS ?? {}
    const listed = Object.keys(table)
    const known = ORDER.filter((key) => listed.includes(key))
    const keys = [...known, ...listed.filter((key) => !known.includes(key) && table[key]?.caption)]

    // Captions come from motifs.js and not from the .motif nodes in fs.js:
    // the filesystem blurbs are one-liners cut to fit an explorer row, and
    // this window has a whole panel to fill.
    const labelOf = (key) => table[key]?.label ?? titleCase(key)
    const captionOf = (key) => table[key]?.caption ?? 'No notes were kept on this one.'

    // --- stage ------------------------------------------------------------

    const stage = el('div.motif-stage', { role: 'img' }, [el('div.motif-stage__grid', { 'aria-hidden': 'true' })])

    const capLabel = el('strong')
    const capText = el('span')
    const caption = el('div.motif-caption', [capLabel, capText])

    const strip = el('div.motif-strip', { role: 'group', 'aria-label': 'Motifs' })

    const chips = keys.map((key) => {
      const node = el('button.motif-chip', {
        type: 'button',
        title: labelOf(key),
        'aria-label': labelOf(key),
        html: motifSVG(key),
        onclick: () => select(key),
      })
      strip.append(node)
      return { key, el: node }
    })

    body.append(el('div.pane', [stage, caption, strip]))

    // --- swapping ---------------------------------------------------------

    let current = null
    let art = null
    let fadeTimer = 0
    let fadeFrame = 0

    // Everywhere else these get drawn between 16 and 40px, where the default
    // 1.7 outline is the only thing holding them together. On a 300px stage
    // that same weight lands about eight pixels thick and the kranok hooks
    // close up into blobs, so the specimen is drawn finer and leans harder on
    // the wash to keep its mass.
    const drawing = (key) => {
      const holder = el('div', { html: motifSVG(key, { stroke: 1, wash: 0.22 }) })
      return holder.querySelector('svg') ?? el('div.empty-note', { text: `Nothing in the ornament module draws ${key}.` })
    }

    // apps.css has no rule for a mid-swap stage and this file may not add one,
    // so the fade is driven from inline style. Reduced motion skips it whole
    // rather than running a 140ms transition the stylesheet has already
    // flattened to nothing.
    function show(key, animate) {
      clearTimeout(fadeTimer)
      cancelAnimationFrame(fadeFrame)
      const quick = !animate || !art || shell.prefs.get('motion') === 'reduced'

      const swap = () => {
        const next = drawing(key)
        if (art) art.remove()
        art = next
        if (quick) return stage.append(next)
        next.style.opacity = '0'
        stage.append(next)
        // One frame between insert and target value, or there is no start
        // state for the transition to run from. It is kept cancellable
        // because a chip clicked during that frame starts fading this same
        // node straight back out, and an uncancelled fade-in would haul it
        // to full opacity halfway through.
        fadeFrame = requestAnimationFrame(() => {
          next.style.transition = `opacity ${FADE_MS}ms linear`
          next.style.opacity = '1'
        })
      }

      if (quick) return swap()
      art.style.transition = `opacity ${FADE_MS}ms linear`
      art.style.opacity = '0'
      fadeTimer = setTimeout(swap, FADE_MS)
    }

    function select(key, { animate = true, quiet = false } = {}) {
      if (!key || key === current) return
      current = key
      for (const chip of chips) chip.el.classList.toggle('is-on', chip.key === key)
      capLabel.textContent = labelOf(key)
      capText.textContent = captionOf(key)
      stage.setAttribute('aria-label', labelOf(key))
      win.setTitle(labelOf(key))
      show(key, animate)
      keepChipInView(key)
      if (!quiet) shell.sfx?.play('blip')
    }

    const step = (dir) => {
      if (keys.length < 2) return
      const i = keys.indexOf(current)
      select(keys[(i + dir + keys.length) % keys.length])
    }

    // The panel is scaled to fit the page (and later a monitor in a room), so
    // rect deltas come back in device pixels and have to be divided back down
    // before they mean anything to scrollLeft.
    function keepChipInView(key) {
      const node = chips.find((c) => c.key === key)?.el
      if (!node) return
      const box = strip.getBoundingClientRect()
      const scale = strip.clientWidth > 0 ? box.width / strip.clientWidth : 1
      const r = node.getBoundingClientRect()
      if (r.left < box.left) strip.scrollLeft -= (box.left - r.left) / scale + 8
      else if (r.right > box.right) strip.scrollLeft += (r.right - box.right) / scale + 8
    }

    // --- keys -------------------------------------------------------------

    // Listening on the document rather than the body keeps the arrows working
    // without this window having to hold DOM focus, which it loses the moment
    // anyone clicks a chip and the chip takes it.
    const onKey = (ev) => {
      if (shell.wm.focused?.el !== win.el) return
      if (ev.key === 'ArrowLeft') step(-1)
      else if (ev.key === 'ArrowRight') step(1)
      else return
      ev.preventDefault()
    }
    document.addEventListener('keydown', onKey)

    win.onDispose(() => {
      document.removeEventListener('keydown', onKey)
      clearTimeout(fadeTimer)
      cancelAnimationFrame(fadeFrame)
    })

    // --- boot -------------------------------------------------------------

    if (!keys.length) {
      stage.append(el('div.empty-note', { text: 'The ornament module is not answering. There is nothing to show.' }))
      capLabel.textContent = 'No motifs'
      capText.textContent = 'Every shape in this OS comes from motifs.js, and it has handed back an empty table.'
      return
    }

    const wanted = args?.motif
    if (wanted && !keys.includes(wanted)) {
      shell.notify(`No motif named "${wanted}". Showing ${labelOf(keys[0])} instead.`, 'warn')
    }
    select(keys.includes(wanted) ? wanted : keys[0], { animate: false, quiet: true })

    return {
      onResize() {
        keepChipInView(current)
      },
    }
  },
}
