// The EventPlayer (DESIGN §2.4): plays the match's events, in order, at the
// view's pace. The match runs ahead synchronously, to the next decision a
// human makes, and the Session (match/session.js) hands the view each
// entry's events, which it push()es here; so the view shows what happened
// one event at a time, while the mirror (present/mirror.js) folds each
// event as it is played: the state as shown, which the figures, labels,
// flags and score read instead of G. When everything queued has played the
// player is idle and tells onIdle, and the table catches up (the input and
// the HUD read G, the match itself, only then).
//
// A handler is the old code's visuals for one kind of event, verbatim (a
// dice row in the tray, a figure's fall, a line in the battle log), called
// with the event and the mirror just after the event is folded in. It
// returns a promise when the next event must wait for it (a dice row, a
// pause), else nothing; events whose handlers take no time play at once,
// inside push(), when the player is idle. An event with no handler goes to
// `fallback`: the player's own (an event's text over the unit or the place
// it names, through the view's `text`, then a beat: §2.4), unless the
// handlers bring one, so a player made without one still plays an unknown
// event.
//
// snap(G) (R7) jumps to a match as it stands, whatever was queued: the
// queue is dropped, the mirror becomes project(G), the view is rebuilt from
// G (its `rebuild(G, M)`: the battlefield from its chunks, the figures from
// its units, what the view holds outside the mirror taken away), and the
// player is idle. A new table is a snap (the title's backdrop), and so is a
// battle's start (onto the backdrop, the battle's table as it stood before
// anything happened: the same board, terrain and races; the start entry's
// events then play on from there); (N2) an online match followed, a refold,
// and the catch-up past a backlog() of 30 s (a scrub is N3's).
//
// (V1) Batched playback: with `batched` on (the default; the HUD's ⇉ turns
// it off, "one at a time"), a run of one seat's walks (present/pace.js's
// batchAt: a movement phase's units, between their instant events) plays
// together: the batch's advance dice in one tray row, then each walk
// PACE.stagger after the last (or once a wreck before it has broken what it
// breaks), its events folded into the mirror in order as it starts, the
// batch over when every walk is; one focus for the batch, its pauses and
// per-unit trays left out, and the flags' owners each walk changes shown
// once it has arrived (the view's holdOwners). What breaks a batch plays
// as ever.
//
// (F8b) Attack batches (present/pace.js's attacksAt): a run of one seat's
// shots or blows plays in one tray, each attack one row, the attacks
// PACE.brisk apart (or once a blast's throw or a spell has played), each
// volley waited on PACE.lead before its wounds, every event folded in
// order as its attack plays. A phase with nothing in it (briefAt) shows its
// banner PACE.brief (the handler's third argument, { brief: true }). As a
// batch of either kind opens, the handlers' `frame` is told where its
// members stand and where they go (the camera's batch framing,
// view/camera.js's frame) and, if the camera framed them, the batch's
// focus events are left out. With ⇉ off none of this: one event at a time,
// as before V1.
//
// (F14) An action played on its own (a lone walk, a shot or a charge, a
// fight: anything no batch takes) is cued as it opens: the handlers' `cue`
// is told once where its actors stand and go and where the camera would
// glide (present/camera-presets.js's cueAt, from its opening to its end),
// and its focus events are then left out (folded, never followed), so the
// camera makes one move for the action, as for a batch: the view's say
// (view/camera.js's cue: the follow policy, whether they are on screen).
// The same with ⇉ off, and for every seat: a human opponent's move online,
// a watched battle's, a replay's. Without a `cue` handler an action plays
// as before F14, its focus events followed.
import { applyEvent, project } from '../present/mirror.js'
import { PACE, batchAt, attacksAt, briefAt, playTime } from '../present/pace.js'
import { cueAt, pointsOf } from '../present/camera-presets.js'
import { wait } from './clock.js'

// (F8b) the events that make a batch of attacks, and so wait a tick on an
// idle table, as a walk does: a group Fire's members join one batch
const STARTS_BATCH = new Set(['unit.move', 'volley', 'melee', 'blast.fire', 'spell.cast'])

export class EventPlayer {
  // `view.rebuild(G, M)`: the table made to show G as it stands (M its
  // mirror); `view.text(pos, str, color)`: text floating on the table (the
  // fallback's)
  // (V1) `sideOf(unitId)`: the seat a unit belongs to (the batch rule's: the
  // mirror holds no seats)
  constructor({ handlers, view = null, mirror = null, onIdle = null, sideOf = () => undefined }) {
    this.handlers = { fallback: (e, M) => this.fallback(e, M), ...handlers }
    this.view = view
    this.mirror = mirror
    this.onIdle = onIdle
    // hears every snap and every event as it is played (?debug only:
    // sim/present-check.mjs folds its own mirror from them). It is handed
    // this player's mirror, which it reads and never folds into: applyEvent
    // folds in place, so the event would be applied twice.
    this.observer = null
    this.q = []
    this.running = false
    // which table's events are playing: a snap starts a new one, and a
    // handler's promise from before it resumes nothing
    this.table = 0
    // (V1) walks batched (false: one at a time, as before V1), and how many
    // batches have played
    this.batched = true
    this.batches = 0
    // ((F8b) of them, how many were attacks, and how many banners played
    // brief)
    this.attackBatches = 0
    this.briefs = 0
    this.sideOf = sideOf
    // (the batch holding the flags' owners, if any)
    this.hold = null
    // ((F14) the events left to play of the action last cued, whose focus
    // events are left out; and how many actions were cued)
    this.cueLeft = 0
    this.cues = 0
  }

  get idle() {
    return !this.running && !this.q.length
  }

  // (N2) about how long, in game seconds, what is queued takes to play
  // (PACE.cost's estimate: the elastic catch-up's, app/flow.js)
  backlog() {
    // ((V1) a batch counted once, until its last walk ends)
    return playTime(this.q, (u) => this.sideOf(u), this.batched)
  }

  // Queue events; they start playing now if nothing is playing.
  push(events) {
    for (const e of events) this.q.push(e)
    if (this.running) return
    // (V1) a walk reaching an idle table waits a tick, so the commands sent
    // with it (a group order's members, one after another) join its batch
    if (this.batched && events.some((e) => STARTS_BATCH.has(e.t))) {
      this.running = true
      const table = this.table
      setTimeout(() => table === this.table && this.run(), 0)
      return
    }
    this.run()
  }

  // Jump to G as it stands (`shown`: the mirror to show, project(G) unless
  // the caller says otherwise: the title shows its backdrop at the stage
  // 'title'). Nothing queued is played, and a handler still running (a dice
  // row, a pause) resumes nothing when it settles; the table is rebuilt
  // from G, the observer told, and the player idle (onIdle told so with
  // `{ snap: true, G }`: the table was made from G, not played up to).
  snap(G, shown = project(G)) {
    this.table++
    this.q.length = 0
    this.running = false
    this.hold = null
    this.cueLeft = 0
    this.mirror = shown
    this.view?.rebuild(G, shown)
    this.observer?.reset?.(shown)
    this.onIdle?.({ snap: true, G })
  }

  run() {
    const table = this.table
    this.running = true
    try {
      while (this.q.length) {
        // (V1) a batch of walks from here: played together
        const b = this.batched ? batchAt(this.q, 0, (u) => this.sideOf(u)) : null
        if (b) {
          this.cueLeft = 0
          this.batch(this.q.splice(0, b.to), b, table).then(
            () => table === this.table && this.run(),
            (err) => table === this.table && this.fail(err),
          )
          return
        }
        // (F8b) a batch of attacks from here
        const a = this.batched ? attacksAt(this.q, 0, (u) => this.sideOf(u)) : null
        if (a) {
          this.cueLeft = 0
          this.attacks(this.q.splice(0, a.to), a, table).then(
            () => table === this.table && this.run(),
            (err) => table === this.table && this.fail(err),
          )
          return
        }
        // ((F8b) a phase with nothing in it: its banner brief)
        const brief = this.batched && briefAt(this.q, 0)
        if (brief) this.briefs++
        // ((F14) an action opening here: the camera cued once for it)
        if (!this.cueLeft) this.cue()
        const cued = this.cueLeft > 0
        if (cued) this.cueLeft--
        const e = this.q.shift()
        this.mirror = applyEvent(this.mirror, e)
        this.observer?.event?.(e, this.mirror)
        if (cued && e.t === 'focus') continue
        const r = (this.handlers[e.t] ?? this.handlers.fallback)(e, this.mirror, brief ? { brief: true } : undefined)
        if (r && typeof r.then === 'function') {
          r.then(() => table === this.table && this.run(), (err) => table === this.table && this.fail(err))
          return
        }
      }
    } catch (err) {
      return this.fail(err)
    }
    this.running = false
    this.onIdle?.()
  }

  // (V1) A batch (`events`, batchAt's `b` over them): its advance dice in one
  // row, then its events in order, each walk started at its b.starts and
  // none awaited until the batch's end; the first focus followed,
  // the others, the pauses and the per-unit trays and dice left out (the
  // mirror folds them all). A snap in between ends it.
  async batch(events, b, table) {
    const h = this.handlers, walks = []
    this.batches++
    // (the flags' owners as shown when the batch starts, each walk's own
    // shown once it has arrived, in order, an objectives before any walk at
    // once: the mirror folds them as the walk sets off; this batch's hold
    // only, let go however the batch ends)
    const hold = (this.hold = {})
    this.view?.holdOwners?.(this.mirror.owners)
    let shown = Promise.resolve()
    try {
      await this.playBatch(events, b, table, h, walks, hold, (s) => (shown = s(shown)))
      await shown
    } finally {
      if (this.hold === hold) {
        this.hold = null
        this.view?.holdOwners?.(null)
      }
    }
  }

  async playBatch(events, b, table, h, walks, hold, chain) {
    if (b.dice.length) {
      h['tray.open']?.({ t: 'tray.open', title: `Advance · ${b.dice.length} unit${b.dice.length > 1 ? 's' : ''}` }, this.mirror)
      await h.dice?.({ t: 'dice', label: 'D6 each', dice: b.dice, need: 0 }, this.mirror)
      if (table !== this.table) return
    }
    // ((F8b) the camera framing the batch's walkers, from where they stand
    // to where they go, or its first focus followed)
    let focused = this.frame(events)
    for (const e of events) {
      // (each walk at its start: PACE.stagger after the last, later if a
      // wreck before it is still breaking scenery)
      if (e.t === 'unit.move' && walks.length) {
        await wait(b.starts[walks.length] - b.starts[walks.length - 1])
        if (table !== this.table) return
      }
      this.mirror = applyEvent(this.mirror, e)
      this.observer?.event?.(e, this.mirror)
      if (e.t === 'pause' || e.t === 'tray.open' || e.t === 'dice' || (e.t === 'focus' && focused)) continue
      if (e.t === 'objectives') {
        const owners = e.owners, walk = walks.at(-1)
        chain((shown) => Promise.all([shown, walk]).then(() => this.hold === hold && this.view?.holdOwners?.(owners)))
      }
      if (e.t === 'focus') focused = true
      const r = (h[e.t] ?? h.fallback)(e, this.mirror)
      if (e.t === 'unit.move') walks.push(r)
      else if (r && typeof r.then === 'function') {
        await r
        if (table !== this.table) return
      }
    }
    await Promise.all(walks)
  }

  // (F8b) A batch of attacks (`events`, attacksAt's `b` over them): one
  // tray, each attack's events in order as it plays (its first dice its
  // row, labelled with who attacks whom, not waited on; its other dice,
  // trays and pauses folded and left out; a volley waited on PACE.lead,
  // anything else that takes time, a blast's scatter and throw, a spell,
  // waited on to its end), the next attack PACE.brisk after this one began
  // at the soonest; the last row and every flight at the end. One focus, as
  // a walk batch has, unless the camera framed it. A snap in between ends
  // it.
  async attacks(events, b, table) {
    const h = this.handlers, tails = []
    this.batches++
    this.attackBatches++
    let focused = this.frame(events)
    h['tray.open']?.({ t: 'tray.open', title: `${b.melee ? 'Fighting' : 'Shooting'} · ${b.attacks.length} units` }, this.mirror)
    for (const [n, a] of b.attacks.entries()) {
      const brisk = n + 1 < b.attacks.length ? wait(PACE.brisk) : null
      for (let j = a.from; j < a.to; j++) {
        const e = events[j]
        this.mirror = applyEvent(this.mirror, e)
        this.observer?.event?.(e, this.mirror)
        if (e.t === 'pause' || e.t === 'tray.open') continue
        if (e.t === 'dice') {
          if (e === a.row) tails.push(h.dice?.({ ...e, label: a.title || e.label }, this.mirror))
          continue
        }
        if (e.t === 'focus') {
          if (focused) continue
          focused = true
        }
        const r = (h[e.t] ?? h.fallback)(e, this.mirror)
        if (!r || typeof r.then !== 'function') continue
        if (e.t === 'volley') {
          tails.push(r)
          await Promise.race([r, wait(PACE.lead)])
        } else await r
        if (table !== this.table) return
      }
      if (brisk) {
        await brisk
        if (table !== this.table) return
      }
    }
    await Promise.all(tails)
  }

  // (F8b) The camera told where a batch's members stand (as shown, before
  // any of it is folded) and where they go: a walk's end, an attack's
  // target or a template's landing. True if it framed them (its handler's
  // say: the follow policy, and whether they are all on screen already).
  // ((F14) present/camera-presets.js's pointsOf, which cueAt gathers an
  // action's actors with: a template's aim and landing count too.)
  frame(events) {
    const f = this.handlers.frame
    if (!f) return false
    const points = pointsOf(events, (id) => this.mirror?.units?.[id]?.pos)
    return points.length > 0 && f({ t: 'frame', points }, this.mirror) === true
  }

  // (F14) The action opening at the head of the queue, if one does
  // (present/camera-presets.js's cueAt: from its opening to its end, its
  // actors where the table shows them, before any of it is folded): the
  // handlers' `cue` told once, `{ points, x, z, own }`, and the next
  // `cueLeft` events (the action's) played with their focus events left
  // out, whatever the cue did (the follow policy, and whether its actors
  // are on screen, are its handler's say: one move of the camera for the
  // action). Without a `cue` handler, nothing: the focus events followed.
  cue() {
    this.cueLeft = 0
    const h = this.handlers.cue
    if (!h) return
    const c = cueAt(this.q, 0, (id) => this.mirror?.units?.[id]?.pos)
    if (!c) return
    this.cueLeft = c.to
    this.cues++
    h({ t: 'cue', points: c.points, x: c.x, z: c.z, own: c.own }, this.mirror)
  }

  // An event this table has no visuals for yet: its text over the unit (or
  // the place) it names, then a beat (PACE.beat, unless it says how long),
  // so a new kind of event can ship its rules before its art.
  fallback(e, M) {
    const at = e.u !== undefined && M.units[e.u] ? M.units[e.u].pos : { x: e.x ?? 0, z: e.z ?? 0 }
    if (e.text) this.view?.text?.({ x: at.x, y: 1.6, z: at.z }, e.text, '#ffffff')
    return wait(e.beat ?? PACE.beat)
  }

  // A handler threw: nothing more is played, and the error goes on up (a
  // bug in a handler must not pass quietly).
  fail(err) {
    this.running = false
    this.q.length = 0
    this.cueLeft = 0
    if (this.hold) {
      this.hold = null
      this.view?.holdOwners?.(null)
    }
    throw err
  }
}
