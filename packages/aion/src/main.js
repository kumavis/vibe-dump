import { STAGES, SOURCES, SAFETY, CAVEATS, cite } from './content.js'
import { simulate, STAGE_COUNT } from './sim.js'
import { createCutaway } from './viz-cutaway.js'
import { createFundus } from './viz-fundus.js'
import { createDoorway } from './viz-doorway.js'

const APPROACHES = [
  { id: 'cutaway', letter: 'A', name: 'Cutaway', pitch: 'The back of the eye sliced open. See where the blood comes from and where the fibres get squeezed. Drag to turn it.', create: createCutaway },
  { id: 'fundus', letter: 'B', name: 'The doctor’s view', pitch: 'What an eye doctor sees through the pupil, next to what you see as fibres drop out.', create: createFundus },
  { id: 'doorway', letter: 'C', name: 'Crowded doorway', pitch: 'A simple model, not anatomy: the same fibres through a roomy opening and a tight one. Drag to turn it.', create: createDoorway },
]
const DURATION = 42 // seconds for the whole story

const $ = id => document.getElementById(id)
const panel = $('panel')

// --- cards
const cards = APPROACHES.map(a => {
  const card = document.createElement('section')
  card.className = 'card'
  card.dataset.id = a.id
  card.innerHTML = `<div class="stage"></div>
    <div class="info"><h2><b>${a.letter}</b> ${a.name}</h2><p>${a.pitch}</p></div>`
  panel.appendChild(card)
  const viz = a.create(card.querySelector('.stage'))
  card.addEventListener('click', () => { if (!focused) location.hash = a.id })
  return { ...a, card, viz }
})

// --- focus one approach, or show all three
let focused = null
function route() {
  const id = location.hash.slice(1)
  focused = cards.find(c => c.id === id) || null
  document.body.classList.toggle('focused', !!focused)
  for (const c of cards) c.card.classList.toggle('focus', c === focused)
  $('back').hidden = !focused
  $('tagline').hidden = !!focused
}
addEventListener('hashchange', route)
$('back').addEventListener('click', () => { location.hash = '' })
route()

// --- timeline
let t = 0, playing = true
const scrub = $('scrub'), steps = $('steps')
STAGES.forEach((s, i) => {
  const b = document.createElement('button')
  b.textContent = s.title
  b.addEventListener('click', () => { t = (i + 0.02) / STAGE_COUNT; playing = true; syncPlay() })
  steps.appendChild(b)
})
const syncPlay = () => { $('play').textContent = playing ? '❚❚' : '▶' }
$('play').addEventListener('click', () => { if (t >= 1) t = 0; playing = !playing; syncPlay() })
scrub.addEventListener('input', () => { t = scrub.value / 1000; playing = false; syncPlay() })

// --- sources
$('srclist').innerHTML = SOURCES.map(s =>
  `<li id="src-${s.id}"><a href="${s.url}" target="_blank" rel="noopener">${s.title}</a><p>Used for: ${s.took}</p></li>`).join('')
$('caveats').innerHTML = CAVEATS.map(c => `<li>${c}</li>`).join('')
$('safety').innerHTML = cite(SAFETY)
const openSources = id => {
  $('sources').hidden = false
  for (const li of $('srclist').children) li.classList.toggle('hit', li.id === 'src-' + id)
  if (id) $('src-' + id).scrollIntoView({ block: 'nearest' })
}
$('srcbtn').addEventListener('click', () => openSources())
$('srcclose').addEventListener('click', () => { $('sources').hidden = true })
document.addEventListener('click', e => {
  const a = e.target.closest('a[data-src]')
  if (a) { e.preventDefault(); openSources(a.dataset.src) }
})

// --- loop
let shownStage = -1, last = performance.now()
function tick(now) {
  const dt = Math.min(0.1, (now - last) / 1000); last = now
  if (playing) {
    t += dt / DURATION
    if (t >= 1) { t = 1; playing = false; syncPlay() }
    scrub.value = Math.round(t * 1000)
  }
  const s = simulate(t)
  if (s.stage !== shownStage) {
    shownStage = s.stage
    $('stagetitle').textContent = `${s.stage + 1}. ${STAGES[s.stage].title}`
    $('stagetext').innerHTML = cite(STAGES[s.stage].text)
    ;[...steps.children].forEach((b, i) => b.classList.toggle('on', i === s.stage))
  }
  $('m-flow').style.width = s.flow * 100 + '%'
  $('m-swell').style.width = s.swelling * 100 + '%'
  $('m-work').style.width = (1 - s.damage) * 100 + '%'
  document.body.classList.toggle('night', s.night > 0.5)
  for (const c of cards) if (!focused || c === focused) c.viz.frame(s, dt, now / 1000)
  requestAnimationFrame(tick)
}
requestAnimationFrame(tick)
