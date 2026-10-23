// Boot: chapter rail, hero, and every interactive panel.

import './style.css'
import { $, $$, el } from './util.js'
import { initHero } from './panels/hero.js'
import { initThreeSum, initTruly } from './panels/threesum.js'
import { initWeb } from './panels/web.js'
import { initLopsided, initCost } from './panels/lopsided.js'
import { initHashing } from './panels/hashing.js'
import { initStrassen } from './panels/strassen.js'
import { initSchonhage } from './panels/schonhage.js'
import { initStrings } from './panels/strings.js'
import { initLeaves } from './panels/leaves.js'
import { initRun } from './panels/run.js'
import { initScale } from './panels/scale.js'
import { initChain } from './panels/chain.js'

function buildRail() {
  const ol = $('#rail ol')
  const chapters = $$('.chapter')
  const items = chapters.map((ch, i) => {
    const a = el('a', { href: `#${ch.id}` }, el('span', {}, String(i + 1)), el('span', {}, ch.dataset.chapter))
    ol.append(el('li', {}, a))
    return { ch, a }
  })
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        items.forEach((it) => it.a.classList.toggle('on', it.ch === e.target))
      }
    },
    { rootMargin: '-40% 0px -55% 0px' },
  )
  chapters.forEach((ch) => io.observe(ch))
}

// A panel that throws must not take the rest of the page down with it.
function safely(name, fn) {
  try {
    fn()
  } catch (err) {
    console.error(`[${name}]`, err)
  }
}

buildRail()
safely('hero', initHero)
safely('3sum', initThreeSum)
safely('truly', initTruly)
safely('web', initWeb)
safely('lopsided', initLopsided)
safely('cost', initCost)
safely('hashing', initHashing)
safely('strassen', initStrassen)
safely('schonhage', initSchonhage)
safely('strings', initStrings)
safely('leaves', initLeaves)
safely('run', initRun)
safely('scale', initScale)
safely('chain', initChain)
