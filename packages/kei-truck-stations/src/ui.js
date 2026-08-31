import { mm } from './build.js'

// ---------------------------------------------------------------------------
// The HUD
//
// Two things share the screen and they want opposite treatments. The scene is
// the thing you look at, so the panel stays off to one side and out of the way;
// the numbers are the thing that makes the scene mean something, so they are
// not hidden behind a menu.
//
// The readout is deliberately the sort a fabricator would ask for — packed
// envelope against the legal ceiling, deployed envelope, the mass budget line
// by line against the 350 kg payload, and the audit's verdict. If a module went
// over its budget or its fold collided, the panel says so in the same place it
// would have said "fine", rather than quietly not mentioning it.
// ---------------------------------------------------------------------------

const CAMERAS = {
  'three-quarter': { p: [-5.6, 2.5, 5.4], t: [-0.2, 1.0, 0] },
  crowd: { p: [-6.4, 1.8, 0.9], t: [-0.9, 1.1, 0] },
  side: { p: [0.1, 1.8, 7.4], t: [0.1, 1.0, 0] },
  head: { p: [-0.1, 9.2, 0.6], t: [-0.1, 0.7, 0] },
}

export function mountUI({ stations, state, onStation, onProgress, camera, controls, specs }) {
  const root = el('div', 'panel')
  document.body.appendChild(root)

  // --- header ---------------------------------------------------------------
  const head = el('header', 'head')
  head.appendChild(el('h1', '', 'KEI TRUCK STATIONS'))
  head.appendChild(
    el(
      'p',
      'sub',
      `Daihatsu Hijet S500P · ${specs.TRUCK_MM.overallLength} × ${specs.TRUCK_MM.overallWidth} × ${specs.TRUCK_MM.overallHeight} mm · ${specs.TRUCK_MM.bedInnerLength} × ${specs.TRUCK_MM.bedInnerWidth} bed · ${specs.TRUCK_MM.payload_kg} kg payload`,
    ),
  )
  root.appendChild(head)

  // --- station picker -------------------------------------------------------
  const picker = el('div', 'picker')
  const buttons = new Map()
  for (const s of stations) {
    const b = el('button', 'chip', s.title)
    b.addEventListener('click', () => {
      for (const [, other] of buttons) other.classList.remove('on')
      b.classList.add('on')
      state.t = 0
      state.dir = 1
      state.playing = true
      const c = onStation(s.id)
      describe(c)
    })
    buttons.set(s.id, b)
    picker.appendChild(b)
  }
  root.appendChild(picker)

  const title = el('h2', 'title')
  const tagline = el('p', 'tagline')
  root.appendChild(title)
  root.appendChild(tagline)

  // --- deployment scrub -----------------------------------------------------
  const deploy = el('section', 'deploy')
  const scrubRow = el('div', 'scrub-row')
  const playBtn = el('button', 'icon', '❚❚')
  playBtn.title = 'play / pause the deployment'
  const scrub = document.createElement('input')
  scrub.type = 'range'
  scrub.min = '0'
  scrub.max = '1000'
  scrub.value = '0'
  scrub.className = 'scrub'
  scrub.setAttribute('aria-label', 'deployment')
  scrubRow.appendChild(playBtn)
  scrubRow.appendChild(scrub)
  deploy.appendChild(scrubRow)
  const stageLine = el('div', 'stage')
  deploy.appendChild(stageLine)
  root.appendChild(deploy)

  playBtn.addEventListener('click', () => {
    state.playing = !state.playing
    state.hold = 0
    playBtn.textContent = state.playing ? '❚❚' : '▶'
  })
  scrub.addEventListener('input', () => {
    playBtn.textContent = '▶'
    onProgress(Number(scrub.value) / 1000)
  })

  // Step buttons and the ordered sequence. Folding in is the same list read
  // bottom to top, because it is the same function of t read backwards.
  const stepRow = el('div', 'steprow')
  const prevBtn = el('button', 'icon', '◀')
  prevBtn.title = 'previous step'
  const dirLabel = el('span', 'dirlabel')
  const nextBtn = el('button', 'icon', '▶')
  nextBtn.title = 'next step'
  stepRow.appendChild(prevBtn)
  stepRow.appendChild(dirLabel)
  stepRow.appendChild(nextBtn)
  deploy.appendChild(stepRow)
  const stepList = el('ol', 'steps')
  deploy.appendChild(stepList)

  const stepAt = (i, n) => Math.min(1, Math.max(0, (i + 0.9) / n))
  function jumpStep(delta) {
    const rig = currentStation.rig
    const n = Math.max(1, rig.stageCount)
    const here = Math.min(n - 1, Math.floor(state.t * n))
    const to = Math.min(n - 1, Math.max(0, here + delta))
    state.playing = false
    state.hold = 0
    state.dir = delta >= 0 ? 1 : -1
    playBtn.textContent = '▶'
    onProgress(delta >= 0 && here === to && state.t < 1 ? 1 : stepAt(to, n))
  }
  prevBtn.addEventListener('click', () => jumpStep(-1))
  nextBtn.addEventListener('click', () => jumpStep(1))

  // --- verdict --------------------------------------------------------------
  const verdict = el('div', 'verdict')
  root.appendChild(verdict)

  // --- readout --------------------------------------------------------------
  const readout = el('section', 'readout')
  root.appendChild(readout)

  // --- view controls --------------------------------------------------------
  const views = el('div', 'views')
  for (const name of Object.keys(CAMERAS)) {
    const b = el('button', 'chip small', name)
    b.addEventListener('click', () => {
      state.orbit = false
      orbitToggle.classList.remove('on')
      frame(name)
    })
    views.appendChild(b)
  }
  root.appendChild(views)

  const toggles = el('div', 'views')
  const xrayToggle = el('button', 'chip small', 'engineering view')
  const orbitToggle = el('button', 'chip small on', 'auto-orbit')
  toggles.appendChild(xrayToggle)
  toggles.appendChild(orbitToggle)
  root.appendChild(toggles)

  let currentStation = null
  xrayToggle.addEventListener('click', () => {
    state.xray = !state.xray
    xrayToggle.classList.toggle('on', state.xray)
    currentStation?.overlay.setVisible(state.xray)
    document.body.classList.toggle('xray', state.xray)
  })
  orbitToggle.addEventListener('click', () => {
    state.orbit = !state.orbit
    orbitToggle.classList.toggle('on', state.orbit)
  })

  const collapse = el('button', 'collapse', '×')
  collapse.title = 'hide the panel'
  collapse.addEventListener('click', () => root.classList.toggle('hidden'))
  root.appendChild(collapse)

  function frame(name) {
    const c = CAMERAS[name] ?? CAMERAS['three-quarter']
    camera.position.set(...c.p)
    controls.target.set(...c.t)
    camera.lookAt(controls.target)
    controls.update()
  }

  function describe(station) {
    currentStation = station
    station.overlay.setVisible(state.xray)
    for (const [id, b] of buttons) b.classList.toggle('on', id === station.def.id)
    title.textContent = station.def.title
    tagline.textContent = station.def.tagline
    renderSteps(station)

    const { report, meta, rig } = station
    verdict.className = `verdict ${report.ok ? 'pass' : 'fail'}`
    verdict.innerHTML = ''
    verdict.appendChild(
      el(
        'div',
        'verdict-head',
        report.ok
          ? `fold audit: PASS — ${rig.order.length} parts, ${report.samples} frames, no interference`
          : `fold audit: ${report.collisions.length} INTERFERENCE${report.collisions.length > 1 ? 'S' : ''}`,
      ),
    )
    if (!report.ok) {
      for (const c of report.collisions.slice(0, 6)) {
        verdict.appendChild(
          el('div', 'row bad', `${c.a} ↔ ${c.b} · ${(c.depth * 1000).toFixed(0)} mm at t=${c.t.toFixed(2)}`),
        )
      }
    }

    readout.innerHTML = ''
    const packed = envelope(rig, 0)
    const open = envelope(rig, 1)
    readout.appendChild(sectionTitle('envelope'))
    const deckH = specs.T.deckH
    readout.appendChild(
      kv('packed', `${fmt(packed.l)} × ${fmt(packed.w)} × ${fmt(packed.h - deckH)} mm above the deck`),
    )
    readout.appendChild(
      kv(
        'ceiling',
        `${fmt(specs.PACK_CEILING)} mm to the cab roof · ${fmt(specs.PACK_CEILING_LEGAL)} to the kei limit`,
        packed.h - deckH > specs.PACK_CEILING_LEGAL ? 'bad' : packed.h - deckH > specs.PACK_CEILING ? 'warn' : 'ok',
      ),
    )
    readout.appendChild(kv('deployed', `${fmt(open.l)} × ${fmt(open.w)} × ${fmt(open.h)} mm tall on the ground`))

    const total = meta.massBudget.reduce((a, b) => a + b[1], 0)
    readout.appendChild(sectionTitle(`mass budget — ${total.toFixed(0)} of ${specs.T.payload} kg`))
    const bar = el('div', 'bar')
    for (const [name, kg] of meta.massBudget) {
      const seg = el('span', 'seg')
      seg.style.flexGrow = String(kg)
      seg.title = `${name} — ${kg} kg`
      bar.appendChild(seg)
    }
    const slack = el('span', 'seg slack')
    slack.style.flexGrow = String(Math.max(0, specs.T.payload - total))
    slack.title = `spare — ${(specs.T.payload - total).toFixed(0)} kg`
    bar.appendChild(slack)
    readout.appendChild(bar)
    for (const [name, kg] of meta.massBudget) readout.appendChild(kv(name, `${kg} kg`))
    readout.appendChild(
      kv('spare', `${(specs.T.payload - total).toFixed(0)} kg`, total > specs.T.payload ? 'bad' : 'ok'),
    )

    readout.appendChild(sectionTitle('how it stands up'))
    for (const n of meta.notes) readout.appendChild(el('p', 'note', n))
  }

  /** Rebuild the ordered step list for a station. */
  function renderSteps(station) {
    stepList.innerHTML = ''
    station.rig.stageLabels.forEach((label, i) => {
      const li = el('li', 'step')
      li.appendChild(el('span', 'step-n', String(i + 1)))
      li.appendChild(el('span', 'step-t', label))
      li.addEventListener('click', () => {
        state.playing = false
        state.hold = 0
        playBtn.textContent = '▶'
        onProgress(stepAt(i, Math.max(1, station.rig.stageCount)))
      })
      stepList.appendChild(li)
    })
  }

  const stageEl = stageLine
  function tick(t, station) {
    scrub.value = String(Math.round(t * 1000))
    playBtn.textContent = state.playing ? '❚❚' : '▶'
    const rig = station.rig
    const n = rig.stageCount
    const i = Math.min(n - 1, Math.floor(t * n))
    const stowed = t <= 0.001
    const deployed = t >= 0.999
    const inward = state.dir < 0

    stepList.classList.toggle('inward', inward && !stowed && !deployed)
    ;[...stepList.children].forEach((li, k) => {
      li.classList.toggle('on', !stowed && !deployed && k === i)
      li.classList.toggle('done', deployed || (!stowed && k < i))
    })

    dirLabel.textContent = stowed
      ? 'stowed — ready to drive'
      : deployed
        ? 'deployed'
        : inward
          ? `folding in · step ${n - i} of ${n}`
          : `folding out · step ${i + 1} of ${n}`
    dirLabel.className = `dirlabel ${stowed ? 'stowed' : deployed ? 'deployed' : inward ? 'inward' : 'outward'}`

    const tip = station.overlay.status
    stageEl.innerHTML = ''
    stageEl.appendChild(el('span', 'stage-n', stowed ? 'stowed' : deployed ? 'deployed' : `${i + 1}/${n}`))
    stageEl.appendChild(el('span', 'stage-label', stowed ? 'ready to drive' : rig.stageLabels[i] ?? ''))
    stageEl.appendChild(
      el(
        'span',
        `stage-tip ${tip.inside ? 'ok' : 'bad'}`,
        tip.inside ? `CG ${fmt(tip.margin)} mm inside the feet` : 'CG OUTSIDE the support polygon',
      ),
    )
  }

  return { describe, tick, frame, syncOrbit: () => orbitToggle.classList.toggle('on', state.orbit) }
}

// --- small helpers ----------------------------------------------------------

function el(tag, cls, text) {
  const e = document.createElement(tag)
  if (cls) e.className = cls
  if (text != null) e.textContent = text
  return e
}

function sectionTitle(t) {
  return el('div', 'section-title', t)
}

function kv(k, v, tone) {
  const row = el('div', `row ${tone ?? ''}`)
  row.appendChild(el('span', 'k', k))
  row.appendChild(el('span', 'v', v))
  return row
}

const fmt = (m) => (m * 1000).toFixed(0)

/**
 * The bounding box of everything the rig owns, at a given deployment.
 *
 * Measured off the collision hulls rather than the rendered meshes, because the
 * hulls are what the design actually claims — and because a stray decorative
 * mesh should not be able to change the number in the spec panel.
 */
function envelope(rig, t) {
  const before = rig.t ?? 0
  rig.setProgress(t)
  let minX = Infinity, maxX = -Infinity
  let minY = Infinity, maxY = -Infinity
  let minZ = Infinity, maxZ = -Infinity
  for (const { obb } of rig.worldHulls()) {
    const e = obb.rotation.elements
    // Half-extent of the OBB projected onto each world axis.
    const hx = Math.abs(e[0]) * obb.halfSize.x + Math.abs(e[3]) * obb.halfSize.y + Math.abs(e[6]) * obb.halfSize.z
    const hy = Math.abs(e[1]) * obb.halfSize.x + Math.abs(e[4]) * obb.halfSize.y + Math.abs(e[7]) * obb.halfSize.z
    const hz = Math.abs(e[2]) * obb.halfSize.x + Math.abs(e[5]) * obb.halfSize.y + Math.abs(e[8]) * obb.halfSize.z
    minX = Math.min(minX, obb.center.x - hx)
    maxX = Math.max(maxX, obb.center.x + hx)
    minY = Math.min(minY, obb.center.y - hy)
    maxY = Math.max(maxY, obb.center.y + hy)
    minZ = Math.min(minZ, obb.center.z - hz)
    maxZ = Math.max(maxZ, obb.center.z + hz)
  }
  rig.setProgress(before)
  return { l: maxX - minX, w: maxZ - minZ, h: maxY, lo: minY }
}
