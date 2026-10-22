// The online page (DESIGN §2.7, N2): a match shared through an Automerge
// document, from its lobby to its end. Loaded on demand (app/boot.js
// imports it for Play online or a `#m=` link), and it loads the net layer
// (loadNet: the repo, net/repo.js; the store; the lobby, net/lobby.js; the
// seed, net/seed.js; presence, net/presence.js), which the page reaches
// only through import(), so a game played alone holds none of it
// (sim/boundaries.mjs, sim/bundle-check.mjs). The screens are ui/'s: the
// lobby, the net badge, the dialog.
//
//   Play online   host(): a new document (the lobby, this device its host
//                 in seat 0) and the URL `#m=<documentId>`; the secret `a`
//                 kept in localStorage per match, its commitment the log's
//                 `open`
//   a link        route(): the document found (from IndexedDB, or through
//                 the sync server: "Match not found; is the host online?"
//                 when no peer has it), then its lobby or, once it holds a
//                 start, its battle
//
// The lobby. Each device edits its own seat (claim, name, race, Ready; a
// change of race or name un-readies it), the host the battlefield; every
// lobby record this device presses Ready on is kept (localStorage, per
// match and device: what verifyStart holds the start to). Once both seats
// are ready, the host's page builds the start's setup from the lobby, the
// dice from the secret and the seats' nonces, and writes it through its
// Session (`start(setup, { a })`: the reveal).
//
// The battle. Once the log holds a start, the page checks it (verifyStart:
// the reveal, the dice, this device's whole seat; failing, the battle is
// watched here, read-only, and the dialog says why), makes the match's
// Session (the seats the start names this device for, the closing check
// on) and hands it to the flow (app/flow.js's follow: the table drawn from
// the match as it stands, then its events played). A frozen match (a
// desync, tamper, a full log, another version) opens the dialog, its report
// the Folder's with the log's raw texts, the page's URL, browser and time.
// The net badge says how the page stands with the others, a peer's
// presence on the same head with another hash says "out of step", and the
// opponent's pick shows as a ghost. Rematch: a new document with the same
// seats and races, named in the old one's `lobby.next`, which every page
// on the old match offers to join.
//
// The device: localStorage['ts.dev'], unless the tab was opened with
// `&dev=<id>` (Open second tab: the other seat from the same browser; a
// "continue on another device" link), kept for the tab in sessionStorage.
import { Session } from '../match/session.js'
import { SIMULTANEOUS } from '../match/fold.js'
import { stateHash, createMatch, CORE_VERSION, RULES_ID } from '../core/index.js'
import { MISSIONS } from '../data/mission.js'
import { RACES } from '../data/schema.js'
import { LobbyScreen } from '../ui/screens/lobby.js'
import { NetDialog } from '../ui/screens/netdialog.js'
import { NetBadge } from '../ui/netbadge.js'

// the net layer, once loaded (loadNet): every module's exports in one
const N = {}
export async function loadNet() {
  if (!N.loaded) Object.assign(N, ...(await Promise.all([import('../net/repo.js'), import('../net/automerge-store.js'), import('../net/lobby.js'), import('../net/ids.js'), import('../net/seed.js'), import('../net/presence.js')])), { loaded: true })
  return N
}

const $ = (s) => document.querySelector(s)
// Storage that never throws: the browser's local or session storage, or,
// where that is refused (a private window's, a sandbox's), this page's
// memory (a match hosted here can still start; a reload forgets it).
const memory = new Map()
const kept = {
  area: (session) => (session ? sessionStorage : localStorage),
  get(k, session = false) {
    try {
      return this.area(session).getItem(k)
    } catch {
      return memory.get(k) ?? null
    }
  },
  set(k, v, session = false) {
    try {
      this.area(session).setItem(k, v)
    } catch {
      memory.set(k, v)
    }
  },
}

// this tab's device (above)
function tabDevice(fromLink) {
  if (N.isDevice(fromLink)) {
    kept.set('ts.dev', fromLink, true)
    return fromLink
  }
  const tab = kept.get('ts.dev', true)
  if (N.isDevice(tab)) return tab
  return N.deviceId({ getItem: (k) => kept.get(k), setItem: (k, v) => kept.set(k, v) })
}

// what a frozen match's dialog says
const FROZEN = {
  desync: (r) => ['The battle went out of step', `Your page and another worked out different battles from the same moves (at entry ${r?.at}). The battle stops here, on every seated page. The report holds what is needed to look into it.`],
  tamper: (r) => ['The battle\'s log was changed', `A move this page had already played (${r?.at}) is gone from the log, or out of its place. The battle stops here.`],
  full: () => ['The battle\'s log is full', 'The log ran past its 5,000 entries, so the battle stops here.'],
  skew: (r) => ['A different version of the game', `This battle was made with a different version of the game than this page plays (${r?.why ?? ''}). Reload both pages to play it on the same version.`],
}

export class Online {
  // `flow` (app/flow.js), `params` (the page's URL parameters: ?sync=
  // names the server a battle hosted from here uses)
  constructor({ flow, params }) {
    this.flow = flow
    this.params = params
    this.screen = new LobbyScreen()
    this.dialog = new NetDialog()
    this.badge = new NetBadge($('#netbadge'))
    this.screen.wire({
      claim: (i) => this.claim(i),
      leave: (i) => {
        if (!this.handle) return
        N.leave(this.handle, i, this.dev)
        // (a seat left is no seat this device agreed to any more)
        kept.set(this.readyKey(), JSON.stringify(this.readied().filter((x) => x.seat !== i)))
      },
      name: (text) => this.editMine({ name: text }, true),
      race: (key) => this.editMine({ race: key }),
      ready: (on) => this.editMine({ ready: on }),
      board: (n) => this.isHost() && N.editBattle(this.handle, { board: n }),
      reroll: () => this.isHost() && N.editBattle(this.handle, { board: (Math.random() * 1e6) | 0 }),
      copy: () => this.copy(),
      fit: (text, typing) => N.fitName(text, { typing }),
      secondTab: () => window.open(this.linkFor(this.id, N.randomId(8)), '_blank'),
      back: () => this.leave(),
    })
    // (the lobby rig, ?debug: whether the host's page starts the battle
    // itself once both seats are ready)
    this.autoStart = true
    this.gen = 0
    this.id = null
  }

  // ── Where the page is ───────────────────────────────────────────────────
  // The URL's fragment: `#m=<id>` a match (joined), nothing the title.
  async route(hash = location.hash) {
    const q = new URLSearchParams(hash.replace(/^#/, ''))
    const id = q.get('m')
    if (!id) {
      if (this.id) this.leave()
      return
    }
    if (id === this.id) return
    const from = this.pendingFrom ?? null
    this.pendingFrom = null
    this.release()
    if (from) {
      this.from = from
      this.onFrom = () => this.soon()
      from.on('change', this.onFrom)
    }
    const gen = this.gen
    this.sync = q.get('sync') || this.params.get('sync') || N.DEFAULT_SYNC
    this.dev = tabDevice(q.get('dev'))
    this.id = id
    this.screen.note('Connecting…')
    let handle
    try {
      const { repo, ws } = await N.openRepo(this.sync)
      this.ws = ws
      handle = await repo.find(id)
    } catch (err) {
      if (gen === this.gen) this.screen.note(`Match not found; is the host online? (${err.message})`)
      return
    }
    if (gen === this.gen) this.enter(handle)
  }

  // Play online: a new match, this device its host, in seat 0.
  async host() {
    this.release()
    const gen = this.gen
    this.sync = this.params.get('sync') || N.DEFAULT_SYNC
    this.dev = tabDevice(null)
    this.screen.note('Setting up the battle…')
    const { repo, ws } = await N.openRepo(this.sync)
    if (gen !== this.gen) return
    this.ws = ws
    const handle = repo.create(N.lobbyDoc({ host: this.dev, board: this.flow.S.seed, rounds: MISSIONS.classic.rounds, me: { ctrl: 'human', dev: this.dev, name: this.myName(), race: this.flow.races[0] } }))
    kept.set(`ts.a.${handle.documentId}`, N.randomHex(16))
    this.id = handle.documentId
    try {
      history.replaceState(null, '', this.linkFor(this.id))
    } catch {}
    this.enter(handle)
  }

  // The link to a match (`dev`: a device to play it as)
  linkFor(id, dev = null) {
    const base = location.href.split('#')[0]
    return `${base}#m=${id}${dev ? `&dev=${dev}` : ''}${this.sync !== N.DEFAULT_SYNC ? `&sync=${encodeURIComponent(this.sync)}` : ''}`
  }

  async copy() {
    const link = this.linkFor(this.id)
    try {
      await navigator.clipboard.writeText(link)
      this.flow.ui.toast?.show('Link copied')
    } catch {
      $('#lobbyLink').select()
    }
  }

  // A match's document, ready: its store, a Session on it for the lobby
  // (no seats: it only follows the log, and writes the host's open and
  // start), presence, and the lobby or the battle.
  enter(handle) {
    this.handle = handle
    this.store = new N.AutomergeStore(handle)
    this.lobbySes = new Session({ store: this.store, dev: this.dev, rand: () => N.randomId(4), sink: { status: () => this.soon(), settled: () => this.soon() } })
    this.onDoc = () => this.soon()
    handle.on('change', this.onDoc)
    this.presence = new N.Presence({ handle, say: () => this.say(), onChange: () => this.soon() })
    this.tick = setInterval(() => this.update(), 2000)
    this.opening()
    this.update()
  }

  // (the host's page) the log opened with the commitment to its secret, if
  // nothing is written yet
  async opening() {
    const gen = this.gen, a = this.secret()
    if (!a || N.lobbyOf(this.handle.doc()).host !== this.dev || this.store.length) return
    const commit = await N.commitOf(a)
    if (gen === this.gen && !this.store.length && this.lobbySes) this.lobbySes.open(commit)
  }

  // an update once the change in hand is done
  soon() {
    if (this.queued) return
    this.queued = true
    queueMicrotask(() => {
      this.queued = false
      this.update()
    })
  }

  update() {
    if (!this.handle) return
    if (this.play) return this.followed()
    if (this.lobbySes.status !== 'lobby') return this.begin()
    this.lobby()
  }

  // ── The lobby ───────────────────────────────────────────────────────────
  secret() {
    return this.id ? kept.get(`ts.a.${this.id}`) : null
  }
  isHost() {
    return !!this.handle && N.lobbyOf(this.handle.doc()).host === this.dev && !!this.secret()
  }
  myName() {
    const n = kept.get('ts.name')
    return N.nameOk(n) ? n : `Player ${this.dev.slice(0, 4).toUpperCase()}`
  }

  lobby() {
    // (a rematch this page asked for or joined: two asked at once, each
    // made its own, and the old match's `next` names one of them on every
    // page, which both go to)
    const won = this.from && N.lobbyOf(this.from.doc()).next
    if (won && won !== this.id) return this.goTo(won)
    const L = N.lobbyOf(this.handle.doc()), me = N.seatOf(L, this.dev)
    // a seat this device claimed that another device holds now (two claims
    // at once: one stands everywhere)
    if (this.claimed !== undefined && this.claimed !== null) {
      const r = L.seats[this.claimed]
      if (r && r.dev !== this.dev) this.lost = { seat: this.claimed, by: r.name }
      if (r) this.claimed = null
    }
    const other = me < 0 ? null : L.seats[1 - me]
    const hostHere = L.host === this.dev || this.presence.live().some((p) => p.dev === L.host)
    const problem = N.ready(L) ? this.startProblem(L) : null
    const status = this.lost && me < 0 ? `Seat ${this.lost.seat + 1} was taken by ${this.lost.by} at the same moment.`
      : !this.store.length ? 'Waiting for the host…'
        : problem ? `This lobby can't start a battle: ${problem}`
        : me < 0 ? (L.seats.some((r) => !r) ? 'Take a free seat to play, or just watch.' : 'Both seats are taken: you will watch the battle.')
          : !other ? 'Copy the link and send it to your opponent.'
            : !other.ready ? `Waiting for ${other.name || 'your opponent'} to get ready…`
              : !L.seats[me].ready ? 'Press Ready when you are.'
                : this.isHost() ? 'Starting…' : hostHere ? 'Waiting for the host to start the battle…' : 'Waiting for host (their page is closed).'
    const races = Object.keys(RACES).map((key) => ({ key, name: RACES[key].name, icon: RACES[key].icon }))
    const look = (race) => races.find((r) => r.key === race) ?? { name: String(race ?? '?'), icon: '' }
    const m = {
      status, link: this.linkFor(this.id), board: L.board, host: this.isHost(), races,
      seats: L.seats.map((r, i) => (r ? { name: r.name, race: r.race, look: look(r.race), ready: r.ready, mine: r.dev === this.dev } : { free: true, look: look(this.freeRace(L, i)), canSit: true })),
    }
    // (drawn again only when it changed: a picker left open stays open)
    const shown = JSON.stringify(m)
    if (shown !== this.shown || !this.screen.up) this.screen.render(m)
    this.shown = shown
    this.presence.send()
    if (this.autoStart && this.isHost() && N.ready(L) && !problem) this.startMatch()
  }

  // Why the battle a ready lobby makes can't start, or null: what the
  // Folder would refuse its start for (a race, a battlefield or rounds no
  // game here knows: a peer may write anything into the lobby), or a start
  // from this very lobby already refused (it is never written again, or a
  // page would write one after another until the log is full). Asked of
  // the rules once per lobby as it stands.
  startProblem(L) {
    const at = JSON.stringify(L)
    if (this.problemOf?.at !== at) {
      let why = null
      try {
        createMatch(N.setupOf(L, 0), { out: null })
      } catch (err) {
        why = err.message
      }
      this.problemOf = { at, why }
    }
    if (this.problemOf.why) return this.problemOf.why
    return this.refused?.at === at ? this.refused.why : null
  }

  // the race a free seat is offered with: the table's for it, unless the
  // other seat took that one
  freeRace(L, i) {
    const other = L.seats[1 - i]?.race
    const mine = this.flow.races[i]
    return other === mine ? this.flow.races[1 - i] : mine
  }

  claim(i) {
    const L = N.lobbyOf(this.handle.doc())
    this.lost = null
    if (N.claim(this.handle, i, { dev: this.dev, name: this.myName(), race: this.freeRace(L, i), host: L.host })) this.claimed = i
  }

  // This device's own seat changed (`fields`: race, name, ready). A Ready
  // is pressed only once the log's open (the host's commitment) is in: a
  // guest seat readies with a nonce this device drew then (net/seed.js:
  // so the host committed before it knew the nonce, a rematch's copied
  // seat included), and the record readied is kept, with that commitment
  // (what verifyStart holds the start to).
  editMine(fields, rename = false) {
    const L = N.lobbyOf(this.handle.doc()), me = N.seatOf(L, this.dev)
    if (me < 0) return
    if (rename) kept.set('ts.name', N.fitName(fields.name))
    const open = this.opened()
    if (fields.ready && !open) return
    if (fields.ready) fields = { ...fields, nonce: L.host === this.dev ? '' : this.nonce() }
    N.editSeat(this.handle, me, this.dev, fields)
    if (fields.ready) {
      const r = N.startSeat(N.lobbyOf(this.handle.doc()).seats[me])
      const list = this.readied().filter((x) => !(x.seat === me && x.commit === open.commit && JSON.stringify(x.record) === JSON.stringify(r)))
      list.push({ seat: me, record: r, commit: open.commit })
      kept.set(this.readyKey(), JSON.stringify(list.slice(-8)))
    }
  }
  // the log's open, once it holds one
  opened() {
    return this.store?.entries().find((e) => !e.bad && e.t === 'open') ?? null
  }
  // this device's nonce for this match (drawn the first time it readies,
  // kept for the match)
  nonce() {
    const key = `ts.nonce.${this.id}.${this.dev}`, had = kept.get(key)
    if (N.isNonce(had)) return had
    const n = N.newNonce()
    kept.set(key, n)
    return n
  }
  readyKey() {
    return `ts.ready.${this.id}.${this.dev}`
  }
  readied() {
    try {
      const list = JSON.parse(kept.get(this.readyKey()) ?? '[]')
      return Array.isArray(list) ? list : []
    } catch {
      return []
    }
  }

  // The host's start: the setup from the lobby as it stands, its dice from
  // the secret and the seats' nonces (`change`: the lobby rig's way to
  // write another setup than the lobby's, ?debug)
  async startMatch(change = (s) => s) {
    if (this.starting) return
    this.starting = true
    const gen = this.gen
    try {
      const L = N.lobbyOf(this.handle.doc()), a = this.secret()
      const dice = await N.diceOf({ a, documentId: this.id, nonces: L.seats.map((r) => r?.nonce ?? '') })
      // (written only on the lobby it was built from: one that changed
      // meanwhile is started from as it stands next time)
      if (gen !== this.gen || !this.lobbySes || this.lobbySes.status !== 'lobby' || JSON.stringify(N.lobbyOf(this.handle.doc())) !== JSON.stringify(L)) return
      // (one start per lobby as it stands: one the log refused is never
      // written again, startProblem saying why)
      if (this.startProblem(L)) return
      this.lobbySes.start(change(N.setupOf(L, dice)), { a })
      if (this.lobbySes.status === 'lobby') this.refused = { at: JSON.stringify(L), why: this.lobbySes.error ?? 'the start was refused' }
    } finally {
      this.starting = false
    }
  }

  // ── The battle ──────────────────────────────────────────────────────────
  async begin() {
    if (this.beginning) return
    this.beginning = true
    const gen = this.gen, ses = this.lobbySes
    if (!ses.G) {
      // no match: made under another version (skew), or a log frozen
      // before its start (full, tamper)
      this.screen.hide()
      const [title, why] = (FROZEN[ses.status] ?? FROZEN.skew)(ses.report ?? { why: ses.error })
      this.dialog.show({ title, why, back: () => this.leave() })
      return
    }
    const entries = this.store.entries()
    const byId = (id) => entries.find((e) => e.id === id && !e.bad)
    const [open, start] = ses.accepted.slice(0, 2).map(byId)
    const readied = this.readied().filter((r) => r.commit === open?.commit)
    const why = await N.verifyStart({ open, start, documentId: this.id, mine: { dev: this.dev, readied } })
    if (gen !== this.gen) return
    this.from?.off('change', this.onFrom)
    this.from = null
    const seats = ses.G.setup.seats
    const localSeats = why ? [] : seats.flatMap((s, i) => (s.ctrl === 'human' && s.dev === this.dev ? [i] : []))
    ses.close()
    this.lobbySes = null
    this.readOnly = why
    this.play = new Session({ store: this.store, localSeats, dev: this.dev, rand: () => N.randomId(4), onTrace: this.flow.onTrace, closing: true })
    this.screen.hide()
    this.flow.follow(this.play, { status: (st) => this.frozen(st), leave: () => this.close() })
    if (why) this.dialog.show({ title: 'Watching only', why: `${why}. This page won't play a seat in this battle, though you can watch it.`, watch: () => {}, back: () => this.flow.back() })
    // (a page that kept no record of readying, another browser opened with
    // the seat's link: it plays the seat as the start set it, and says so)
    else if (!readied.length && localSeats.length) this.flow.ui.toast?.show(`Playing seat ${localSeats[0] + 1} as the battle's start set it (this browser kept no record of readying it)`, 8000)
    this.frozen(this.play.status)
    this.followed()
  }

  // a frozen match's dialog (a status that isn't live or over)
  frozen(status) {
    const ses = this.play
    if (!ses || !FROZEN[status] || this.saidFrozen === status) return this.followed()
    this.saidFrozen = status
    const [title, why] = FROZEN[status](ses.report)
    const report = { ...ses.report, texts: JSON.parse(this.store.export()), url: location.href, agent: navigator.userAgent, at: new Date().toISOString(), core: CORE_VERSION, rules: RULES_ID, device: this.dev }
    this.dialog.show({ title, why, report, watch: () => {}, back: () => this.flow.back() })
    this.followed()
  }

  // The battle followed: presence, the badge, the opponent's ghost, the
  // rematch button.
  followed() {
    const ses = this.play
    if (!ses) return
    this.presence.send()
    const live = this.presence.live()
    const link = navigator.onLine === false ? 'offline' : this.ws?.socket?.readyState === 1 ? 'online' : 'reconnecting'
    this.badge.show({ link, watching: live.filter((p) => p.seat < 0).length, apart: this.apart(live) })
    this.ghost(live)
    this.rematchButton()
  }

  // this page's match's hash, once per head
  hash() {
    const ses = this.play, at = `${ses.folder.last}:${ses.accepted.length}:${ses.status}`
    if (this.hashed?.at !== at) this.hashed = { at, hash: ses.G ? stateHash(ses.G) : null }
    return this.hashed.hash
  }

  // the peers on this page's head, with as many entries accepted, whose
  // match hashes otherwise (not while a simultaneous decision is open:
  // its entries fold in either order)
  apart(live) {
    const ses = this.play, P = ses.G?.pending
    if (!ses.G || (P && SIMULTANEOUS.includes(P.k))) return []
    const mine = this.hash()
    return live.filter((p) => p.head === ses.folder.last && p.n === ses.accepted.length && p.hash && p.hash !== mine).map((p) => p.name || p.dev)
  }

  // The opponent's pick, from their presence: a ghost ring round it, a line
  // to what they aim at.
  ghost(live) {
    const ses = this.play, M = this.flow.player.mirror, overlay = this.flow.view.overlay
    const them = live.find((p) => p.seat >= 0 && !ses.localSeats.includes(p.seat) && p.sel !== undefined)
    const at = them && M.units?.[them.sel]
    if (!at || at.alive === false || ses.status !== 'live') return overlay.peer(null)
    const to = them.tg !== undefined && M.units?.[them.tg]?.alive !== false ? M.units?.[them.tg]?.pos ?? null : null
    overlay.peer({ x: at.pos.x, z: at.pos.z, r: at.r }, to, this.flow.sides[them.seat]?.color ?? '#ffffff')
  }

  // What this page tells the others (net/presence.js).
  say() {
    const ses = this.play
    const L = this.handle ? N.lobbyOf(this.handle.doc()) : null
    const seat = ses ? ses.localSeats[0] ?? -1 : L ? N.seatOf(L, this.dev) : -1
    const m = { dev: this.dev, seat, name: ses?.G?.setup.seats[seat]?.name ?? this.myName() }
    if (ses?.G) Object.assign(m, { head: ses.folder.last ?? undefined, n: ses.accepted.length, hash: this.hash() ?? undefined })
    const sel = this.flow.human?.sel, hover = this.flow.human?.hover
    if (ses && sel && ses.localSeats.includes(sel.side)) {
      m.sel = sel.id
      if (hover && hover.side !== sel.side) m.tg = hover.id
    }
    return m
  }

  // ── Rematch ─────────────────────────────────────────────────────────────
  rematchButton() {
    const ses = this.play, b = $('#rematch')
    const show = !!ses && ses.status === 'over' && (ses.localSeats.length > 0 || !!N.lobbyOf(this.handle.doc()).next)
    b.classList.toggle('hidden', !show)
    if (!show) return
    b.textContent = N.lobbyOf(this.handle.doc()).next ? 'Join the rematch' : 'Rematch'
    b.onclick = () => this.rematch()
  }

  // The same seats and races in a new match (this device its host), named
  // in this one's lobby.next; or the one another page named first.
  async rematch() {
    const next = N.lobbyOf(this.handle.doc()).next
    if (next) return this.goTo(next)
    const G = this.play.G, gen = this.gen
    const { repo } = await N.openRepo(this.sync)
    if (gen !== this.gen) return
    const me = G.setup.seats.find((s) => s.dev === this.dev) ?? G.setup.seats[0]
    const doc = N.lobbyDoc({ host: this.dev, board: G.setup.board, rounds: G.setup.rounds, overtime: G.setup.overtime, me: { ctrl: 'human', dev: this.dev, name: me.name, race: me.race } })
    // (each guest draws its nonce as it readies, after this match's open:
    // none is copied, which the host would know)
    G.setup.seats.forEach((s, i) => {
      doc.lobby.seats[N.SEAT_KEYS[i]] = { ctrl: 'human', dev: s.dev, name: s.name, race: s.race, ready: false, nonce: '' }
    })
    const handle = repo.create(doc)
    kept.set(`ts.a.${handle.documentId}`, N.randomHex(16))
    if (!N.setNext(this.handle, handle.documentId)) return this.goTo(N.lobbyOf(this.handle.doc()).next)
    this.goTo(handle.documentId)
  }

  // To another match: the rematch's, its old match watched meanwhile (two
  // pages that asked at once go to the one its `next` names).
  goTo(id) {
    this.pendingFrom = this.from ?? (this.play ? this.handle : null)
    if (this.play) this.flow.back()
    location.hash = this.linkFor(id).split('#')[1]
  }

  // ── Leaving ─────────────────────────────────────────────────────────────
  // The match so far let go of (its battle's table too), the fragment
  // kept: it names the next (route), or host() replaces it.
  release() {
    this.routing = true
    try {
      if (this.play) this.flow.back()
      this.close()
    } finally {
      this.routing = false
    }
  }

  // Back to the title from the lobby or a dialog: the match let go of, the
  // fragment cleared.
  leave() {
    if (this.play) return this.flow.back()
    this.close()
  }

  // Let go of the match's document (the flow's leaveOnline, or a new
  // route), the fragment cleared (but while routing to another match).
  close() {
    this.gen++
    clearInterval(this.tick)
    this.from?.off('change', this.onFrom)
    this.from = null
    this.presence?.stop()
    this.handle?.off('change', this.onDoc)
    this.lobbySes?.close()
    this.store?.close()
    Object.assign(this, { presence: null, lobbySes: null, play: null, store: null, handle: null, id: null, beginning: false, starting: false, saidFrozen: null, readOnly: null, claimed: null, lost: null, hashed: null, shown: null, problemOf: null, refused: null })
    this.badge.hide()
    this.screen.hide()
    this.dialog.hide()
    this.flow.view.overlay.peer(null)
    $('#rematch').classList.add('hidden')
    if (this.routing || !/[#&]m=/.test(location.hash)) return
    try {
      history.replaceState(null, '', location.href.split('#')[0])
    } catch {}
  }
}
