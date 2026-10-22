// The table and the box joined (ENGINEERING.md §§8, 9, 11; DESIGN.md §§5.6–5.7):
// the UI's hooks wired to app.battle, the box's bar, the briefing and the
// after-card built from battle.json and the sim's score and outcome as plain
// objects (so the UI never imports the sim), the URL's #battle, #t and
// #moment, and the keys that belong to no one module (Esc in a moment and
// while flying down).
//
// Watching is the default: entering a box plays the record at once, the
// briefing open beside it; taking the controls is an offer on the briefing,
// a stop's card and the URL's #moment (focused, never pressed: a moment never
// starts without a click, and its click is the one pointer lock is asked
// from).

import { BoxBar } from './ui/boxbar.js'
import { sideName } from './ui/names.js'

const FATE_VERB = { sunk: 'sank', scuttled: 'was scuttled', capsized: 'capsized', lost: 'was lost', exploded: 'blew up', beached: 'was beached', wrecked: 'was wrecked' }
const SIDE_ORDER = { jp: 0, us: 1 }

export function link(app, ui) {
  const battle = app.battle
  const L = { stop: -1, offered: null, busy: false }
  app.link = L

  // --- the box's bar -----------------------------------------------------------------
  const bar = new BoxBar(ui.root, {
    leave: () => leave(),
    step: (d) => step(d),
    play: () => battle.play(Math.max(1, battle.timeScale)),
    pause: () => battle.pause(),
    speed: (d) => battle.cycleTime(d),
    briefing: () => openBriefing(),
    credits: () => ui.openCredits(),
    keepGoing: () => {
      battle.keepGoing()
      // (the click is a gesture: an aircraft takes the pointer back)
      if (battle.sim?.player?.kind === 'aircraft' && !battle.sim.player.scripted) battle.input?.requestLock()
    },
    card: () => battle.finish('card'),
  })
  L.bar = bar
  app.updaters.push(() => {
    const sim = battle.sim
    if (!sim || app.active !== battle.scene || app.mode === 'flying') return bar.set(null)
    const ms = sim.momentState
    const mode = battle.input ? (ms?.checkpoint && !battle.running ? 'checkpoint' : 'moment') : 'watch'
    const stops = sim.record.stops
    bar.set({ mode, clock: sim.clock.label(sim.t), where: L.stop >= 0 ? `stop ${L.stop + 1} of ${stops.length}` : battle.loaded?.battle.title?.split(',')[0] ?? '', stop: [L.stop, stops.length], running: battle.running, scale: battle.timeScale })
  })

  // --- the hooks -----------------------------------------------------------------------
  ui.onEnter = (ev) => enter(ev.box, { from: 'table' })
  ui.onPrefetch = (ev) => app.prefetch(ev.box)
  ui.onTake = (momentId) => take(momentId)
  ui.onWatch = () => battle.play(Math.max(1, battle.timeScale))
  ui.onWatchOn = () => {
    battle.play(1)
    app.url.moment = null
  }
  ui.onLeave = () => {
    if (app.mode === 'flying') return battle.abort()
    if (battle.scene) leave()
  }
  ui.onRetry = (momentId, from) => {
    ui.card.close()
    const p = battle.restart(from === 'checkpoint' ? 'checkpoint' : 'start')
    if (p) p.then(after)
  }
  ui.onStep = (d) => step(d)

  // Esc in a moment without pointer lock gives the controls back (with the lock, the browser's Esc
  // leaves the lock and the battle pauses and offers release: battle/controls/input.js)
  addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || app.mode !== 'moment' || document.pointerLockElement) return
    e.preventDefault()
    battle.release()
  })
  // a box's own events: the checkpoint's offer and the end of a sortie are the bar's and the card's
  app.events.addEventListener('battle', (e) => {
    const d = e.detail
    // at the checkpoint the pointer comes back, so the bar's two buttons can be pressed
    if (d.kind === 'checkpoint' && document.pointerLockElement) document.exitPointerLock?.()
  })

  // --- entering, leaving, the stops ----------------------------------------------------------
  async function enter(boxId, { from = 'table', t = null, momentId = null } = {}) {
    if (L.busy || !app.data.boxById.has(boxId)) return
    L.busy = true
    try {
      ui.card.close()
      ui.help.classList.add('hidden')
      const state = await battle.enter(boxId, { from, t, momentId })
      if (!state) return // (aborted)
      // the table waits at the battle's date (the tour keeps its place)
      ui.tour.setting = true
      app.clock.setDate(battle.sim.clock.utc(0))
      ui.tour.setting = false
      L.stop = stopIndexAt(battle.sim.t)
      L.offered = momentId
      app.url.battle = boxId
      app.url.moment = momentId
      if (from !== 'url') app.pushUrl()
      openBriefing({ focus: momentId })
    } finally {
      L.busy = false
    }
  }

  /** fromUrl: the browser's Back took the hash off the box; the entry it landed on is rewritten, not added to. */
  async function leave({ fromUrl = false } = {}) {
    if (L.busy || !battle.scene) return
    L.busy = true
    try {
      ui.card.close()
      const evId = battle.loaded?.battle.event ?? null
      await battle.leave()
      app.url.battle = null
      app.url.t = null
      app.url.moment = null
      L.stop = -1
      // back on the table: the battle's own card again, the camera out to its view
      const ev = evId ? app.data.events.find((e) => e.id === evId) : null
      if (ev) ui.tour.open(ev)
      if (fromUrl) app.replaceUrl()
      else app.pushUrl()
    } finally {
      L.busy = false
    }
  }
  app.enterBox = enter
  app.leaveBox = leave

  function stopIndexAt(t) {
    const stops = battle.sim?.record.stops || []
    let k = -1
    stops.forEach((s, i) => {
      if (s.t <= t + 1e-6) k = i
    })
    return k
  }

  /** The tour inside a box: its stops, each scrubbing the battle to its t, its card beside it. */
  function step(d) {
    const sim = battle.sim
    if (!sim || battle.input) return
    const stops = sim.record.stops
    if (!stops.length) return
    const i = Math.max(0, Math.min(stops.length - 1, (L.stop < 0 ? (d > 0 ? -1 : 0) : L.stop) + d))
    goStop(i)
  }

  function goStop(i) {
    const sim = battle.sim
    const s = sim.record.stops[i]
    if (!s) return
    L.stop = i
    if (battle.scrub(s.t) === null) return // (a changed battle asks first: the HUD's question)
    battle.lookAtStop(s)
    ui.card.openStop(stopCard(i))
  }
  app.goStop = goStop

  function stopCard(i) {
    const sim = battle.sim
    const B = battle.loaded.battle
    const stops = sim.record.stops
    const s = stops[i]
    // a stop that is also a moment (a moment that starts within a few minutes of it) offers it
    const moments = [...sim.record.moments.values()].filter((m) => Math.abs(m.t - s.t) <= 300).map((m) => momentRow(m))
    return { title: B.title, ja: B.ja, when: `${sim.clock.dateLabel(s.t)}, ${sim.clock.label(s.t, { seconds: s.t % 60 !== 0 })}`, clock: B.clock?.name, text: s.text, sources: s.sources || [], index: i, count: stops.length, moments }
  }

  // --- the briefing -------------------------------------------------------------------------
  function momentRow(m, focus = null) {
    const sim = battle.sim
    const B = battle.loaded.battle
    const role = m.role || {}
    // (a role names its side by the battle's key, japan or usa, or by the code, jp or us)
    const sideKey = Object.keys(B.sides || {}).find((k) => k === role.side || B.sides[k]?.side === role.side) ?? role.side ?? null
    const side = B.sides?.[sideKey]?.side ?? sideKey
    const unit = role.unit ? sim.record.shipById.get(role.unit) : null
    return {
      id: m.id,
      title: m.title,
      ja: m.ja?.kanji ?? (typeof m.ja === 'string' ? m.ja : null),
      role: role.name || unit?.name || null,
      t: sim.clock.label(m.t, { seconds: m.t % 60 !== 0 }),
      objective: m.objective?.text ?? null,
      focus: focus === m.id,
      side: side === 'japan' ? 'jp' : side === 'usa' ? 'us' : side,
      sideName: B.sides?.[sideKey]?.name ?? sideName(side),
    }
  }

  function openBriefing({ focus = L.offered } = {}) {
    const sim = battle.sim
    if (!sim) return
    const B = battle.loaded.battle
    const box = battle.loaded.box
    const t = sim.t
    const stop = battle.stopAt(t)
    const ev = app.data.events.find((e) => e.id === B.event)
    const forces = Object.entries(B.sides || {})
      .map(([key, sd]) => {
        const code = sd.side ?? key
        const ships = (B.units || []).filter((u) => (u.side === key || u.side === code) && !u.station?.parked && !(u.lonlat && !u.track))
        const names = ships.map((u) => (u.ja ? `${u.name} ${u.ja}` : u.name))
        const shown = names.length > 16 ? [...names.slice(0, 14), `and ${names.length - 14} more ships`] : names
        return { side: code, order: SIDE_ORDER[code] ?? 2, name: sd.name || sideName(code), ja: sd.ja || null, units: shown }
      })
      .sort((a, b) => a.order - b.order)
    const moments = [...sim.record.moments.values()].sort((a, b) => (SIDE_ORDER[momentRow(a).side] ?? 2) - (SIDE_ORDER[momentRow(b).side] ?? 2) || a.t - b.t).map((m) => momentRow(m, focus))
    ui.openBriefing({
      title: B.title,
      ja: B.ja,
      when: `${sim.clock.dateLabel(t)}, ${sim.clock.label(t)}`,
      clock: B.clock?.name,
      clockNote: B.clock?.note,
      situation: stop?.text || ev?.summary || '',
      forces,
      moments,
      sources: B.sources || [],
      credit: box.credit || null,
    })
  }
  L.openBriefing = openBriefing

  // --- a moment, and its card ----------------------------------------------------------------
  /** From a click (briefing, a stop's card): the controls are taken inside it, so pointer lock may be asked. */
  function take(momentId) {
    if (!battle.sim || !battle.sim.record.moments.has(momentId)) return
    ui.card.close()
    app.url.moment = momentId
    const p = battle.takeMoment(momentId)
    L.stop = -1
    p.then(after)
    return p
  }
  app.take = take

  function after(result) {
    if (!result || !battle.sim) return
    ui.openAfter(afterCard(result))
  }

  function afterCard(r) {
    const sim = battle.sim
    const B = battle.loaded.battle
    const m = sim.record.moments.get(r.momentId) || {}
    const sc = r.score || {}
    const o = r.outcome || { diverged: [], guess: [] }
    const L2 = (t) => sim.clock.label(t)
    // Your sortie: the player's unit in its own terms
    const sortie = []
    const hits = (sc.hits || []).filter((x) => x.kind !== 'near-miss')
    const near = (sc.hits || []).filter((x) => x.kind === 'near-miss').reduce((s, x) => s + x.count, 0)
    const kindWord = (k) => String(k).replace(/-hit$/, '').replace('-', ' ')
    const whereOf = (x) => [...new Set([].concat(x.where ?? []).map((w) => String(w).trim()).filter(Boolean))].join(', ')
    sortie.push({ label: 'Hits', value: hits.length ? hits.map((x) => `${x.name}: ${x.count} ${kindWord(x.kind)} hit${x.count > 1 ? 's' : ''}${whereOf(x) ? `, ${whereOf(x)}` : ''}`).join('; ') : 'none' })
    if (near) sortie.push({ label: 'Near misses', value: String(near) })
    if (sc.bombs) sortie.push({ label: 'Bombs dropped', value: String(sc.bombs) })
    if (sc.releaseM != null) sortie.push({ label: 'Release height', value: `${Math.round(sc.releaseM)} m` })
    if (sc.torpedoes) sortie.push({ label: 'Torpedoes', value: `${sc.torpedoes} fired, ${sc.torpedoesHit || 0} hit` })
    if (sc.salvos) sortie.push({ label: 'Salvos', value: `${sc.salvos} (${sc.shells || 0} shells, ${sc.straddles || 0} straddling)` })
    if (sc.downed) sortie.push({ label: 'Aircraft downed', value: String(sc.downed) })
    const ship = (sim.units[sim.player?.unitIndex]?.kind ?? (m.role?.kind === 'ship' ? 'ship' : 'aircraft')) === 'ship' || m.role?.kind === 'ship'
    const how = ship
      ? { lost: 'lost', clock: 'afloat when the battle clock ran out', released: 'afloat, the controls given back', left: 'afloat', card: 'afloat' }[sc.how ?? r.reason]
      : { landed: 'landed', ditched: 'ditched', lost: 'lost', clock: 'still flying when the battle clock ran out', released: 'still flying, the controls given back', left: 'still flying', card: 'still flying' }[sc.how ?? r.reason]
    if (how) sortie.push({ label: ship ? 'The ship' : 'Came back', value: sc.survived === false ? 'lost' : how })
    if (sc.timeS) sortie.push({ label: 'Time', value: `${Math.floor(sc.timeS / 60)} min ${String(Math.round(sc.timeS % 60)).padStart(2, '0')} s` })
    // Your battle: ships and aircraft only, the divergences
    const rows = (o.diverged || []).map((d) => ({ what: d.name || d.unit || d.group, record: d.group ? aircraftLine(d.record) : d.record, yours: d.group ? aircraftLine(d.sim) : d.sim }))
    const guesses = (o.guess || []).map((g) => (typeof g === 'string' ? g : `${L2(g.t)}: ${g.text}`))
    // The record: the moment's own text, its tellings and the battle's (the people, by source, in ranges)
    const record = { text: m.after?.text || '', tellings: [...(m.after?.tellings || []), ...(B.tellings || [])], sources: m.after?.sources || [] }
    // What came next: the record after the clock closes
    const next = whatCameNext(sim, B)
    return {
      momentId: r.momentId,
      title: m.title,
      ja: m.ja?.kanji ?? (typeof m.ja === 'string' ? m.ja : null),
      sortie,
      battle: { rows, guesses },
      record,
      next,
      retry: { start: true, checkpoint: true },
    }
  }

  function aircraftLine(s) {
    return String(s).replace(/^(\d+) lost$/, (_, n) => `${n} aircraft lost`)
  }

  function whatCameNext(sim, B) {
    const end = sim.clock.duration
    const lines = []
    const sources = []
    const zone = B.clock?.name ? `, ${B.clock.name}` : ''
    const at = (t) => (sim.clock.dateLabel(t) === sim.clock.dateLabel(0) ? `at ${sim.clock.label(t)}` : `on ${sim.clock.dateLabel(t)}, at ${sim.clock.label(t)}`)
    const items = []
    // a group the record sends in after the clock (Samar's Shikishima unit): the record's next blow, said once
    for (const g of sim.record.groups) {
      const t = g.attack?.t ?? g.enter?.t ?? g.launch
      if (t == null || t <= end || !g.raw?.tokko) continue
      const names = (g.attack?.targets || []).map((x) => (x.unit >= 0 ? sim.record.ships[x.unit]?.name : null)).filter(Boolean)
      items.push({ t, text: `${at(t).replace(/^at /, 'At ').replace(/^on /, 'On ')}${zone}, aircraft of ${g.name.replace(/^The /, 'the ')}, a tokkō (special attack) unit, dived on ${names.length ? names.join(' and ') : 'the ships'}.`, sources: g.attack?.sources || g.sources })
    }
    // the ships' fates after the clock, in the record's order
    for (const r of sim.record.ships) {
      const f = r.fate
      if (f?.t != null && f.t > end && FATE_VERB[f.kind]) items.push({ t: f.t, text: `${r.name} ${FATE_VERB[f.kind]} ${at(f.t)}${zone}.`, sources: r.raw.fate?.sources })
    }
    items.sort((a, b) => a.t - b.t)
    // (the clock named once, on the first line)
    for (const [k, it] of items.slice(0, 5).entries()) {
      lines.push(k && zone ? it.text.replace(zone, '') : it.text)
      for (const s of it.sources || []) if (!sources.some((x) => (x.id ?? x) === (s.id ?? s))) sources.push(s)
    }
    // and the war's next step on the table
    const evs = app.data.events
    const here = evs.find((e) => e.id === B.event)
    if (here) {
      const t0 = Date.parse(here.when?.to ?? here.when?.from ?? '') || null
      const later = evs.filter((e) => e !== here && e.kind === 'battle' && e.when?.from && (Date.parse(e.when.from) || 0) > (t0 ?? 0)).sort((a, b) => Date.parse(a.when.from) - Date.parse(b.when.from))[0]
      if (later) lines.push(`Next on the table: ${later.title}${later.gloss ? `, ${later.gloss}` : ''}.`)
    }
    return { text: lines.join(' '), sources: sources.slice(0, 6) }
  }

  // --- the URL (ENGINEERING §9) ------------------------------------------------------------
  /** #battle, #t and #moment, read at boot (after the table) and on hashchange. */
  app.urlBattle = async (h) => {
    if (L.busy || app.mode === 'flying') return
    const id = h.get('battle')
    const t = h.get('t')
    const momentId = h.get('moment')
    const open = battle.state?.boxId ?? null
    if (id && !app.data.boxById.has(id)) {
      app.warn(`#battle=${id}: no such box`)
      return
    }
    if (!id && open) return leave({ fromUrl: true })
    if (id && id !== open) {
      await enter(id, { from: 'url', t, momentId })
      const cam = h.get('cam')?.split(',').map(Number)
      if (cam?.length === 5 && cam.every(Number.isFinite) && battle.scene) battle.scene.rig.jump({ x: cam[0], z: cam[1], distance: cam[2], yaw: cam[3], pitch: cam[4] })
      return
    }
    if (id && t && battle.sim) {
      try {
        const tt = battle.sim.clock.parse(t)
        if (Math.abs(tt - battle.sim.t) > 1) battle.scrub(t)
      } catch (err) {
        app.warn(`#t=${t}: ${err.message}`)
      }
    }
    if (id && momentId && momentId !== L.offered && !battle.input) {
      L.offered = momentId
      openBriefing({ focus: momentId })
    }
  }
}
