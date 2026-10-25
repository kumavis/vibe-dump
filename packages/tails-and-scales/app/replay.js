// The replay (DESIGN §2.7, N3): a battle watched back, scrubbed through,
// saved as a file and opened from one. A battle's moves are its log's
// accepted entries (the Folder's acceptedEntries: what a fold took, in
// order); its first k fold to the match as it stood after the k-th, so a
// scrub to k is a Session of its own over a LocalStore of those entries
// (no seat played here, the AI playing inside the fold as it did then),
// shown on the battle's table (app/flow.js's show) while the battle's own
// Session goes on folding. Watch from the start draws the battle's table
// as it stood before anything happened and writes its moves into that
// Session one at a time, each once the table has played the last, at the
// page's speed (⏩); a replay of a battle still going on catches up with
// it and the table goes back to the battle as it stands (Live). Moves are
// a log's entries: an AI's whole turn is the entry that handed it over.
//
// Who gets the bar (ui/replaybar.js): a page watching an online battle
// (no seat of its own), from the start; anyone once a battle is over (the
// end screen's Watch the replay) or frozen (the dialog's Keep watching);
// and a replay file opened from the title (📼). Save writes the battle's
// whole log (every entry's text: a fold of it is the battle) as a file
// that the title opens again.
//
//   replay.open(battle, { live })   the bar over `battle` (its own Session;
//                         live: still going on, the bar at Live)
//   replay.scrub(k)       the match after its k-th move (-1: before its
//                         start, the table as it stood), paused
//   replay.fromStart()    watch from the start, playing
//   replay.play(), pause(), live(), close()
//   replay.idled()        the table has played everything (app/flow.js):
//                         the next move, while playing
//   replay.file()         the battle's log as a replay file's text
//   openReplay(text)      a replay file's log (a LocalStore of its texts),
//                         or why it can't be one
import { Session } from '../match/session.js'
import { LocalStore } from '../match/store.js'
import { CORE_VERSION, RULES_ID } from '../core/index.js'
import { clock } from '../view/clock.js'

// how long the table rests between two moves, in wall ms at speed 1
const BETWEEN = 400

export class Replay {
  // `flow` (app/flow.js), `bar` (ui/replaybar.js)
  constructor({ flow, bar }) {
    this.flow = flow
    this.bar = bar
    this.battle = null
    // the Session a scrub or a replay shows (null: the battle's own), the
    // move it stands at (its last entry's place in the battle's moves),
    // whether it is playing on, and a move waiting to be written
    this.shown = null
    this.k = -1
    this.playing = false
    this.timer = 0
    bar.wire({
      start: () => this.fromStart(),
      play: () => (this.playing ? this.pause() : this.play()),
      scrub: (k) => this.scrub(k),
      live: () => this.live(),
      save: () => this.save(),
      close: () => this.close({ back: true }),
    })
  }

  get open() {
    return !!this.battle
  }

  // the battle's moves (its accepted entries, in order) and the place of
  // its start among them (an online log's open comes first)
  moves() {
    return this.battle.folder.acceptedEntries()
  }
  first(moves = this.moves()) {
    return Math.max(0, moves.findIndex((e) => e.t === 'start'))
  }

  // the bar over the battle's own Session, as it stands (another battle's
  // bar let go of first)
  open(battle, { live = false } = {}) {
    if (this.battle !== battle) {
      this.close()
      this.battle = battle
    }
    // (the same battle's bar as it stands: a replay on the table stays
    // there, playing or not)
    this.isLive = live
    this.render()
  }

  // A Session over the battle's first k + 1 moves, no seat played here.
  sessionTo(k, moves = this.moves()) {
    return new Session({ store: new LocalStore(moves.slice(0, k + 1)), dev: 'replay' })
  }

  // the match after move k, paused (before the start: its table as it
  // stood); the last move of a battle still going on is the battle itself
  scrub(k) {
    if (!this.battle) return
    this.stopFeeding()
    this.playing = false
    const moves = this.moves(), first = this.first(moves)
    k = Math.max(first - 1, Math.min(moves.length - 1, Math.round(k)))
    if (k === moves.length - 1 && this.isLive) return this.live()
    this.goTo(k, moves)
    this.render()
  }

  goTo(k, moves) {
    const ses = this.sessionTo(k, moves)
    this.k = k
    this.shown = ses
    if (ses.G) this.flow.show(ses)
    else this.flow.showStart(ses, moves[this.first(moves)].setup)
  }

  // watch from the start: the table as it stood, then every move
  fromStart() {
    if (!this.battle) return
    const moves = this.moves()
    this.stopFeeding()
    this.goTo(this.first(moves) - 1, moves)
    this.playing = true
    this.render()
    this.idled()
  }

  play() {
    if (!this.battle) return
    const moves = this.moves()
    // (at the end, or at the battle itself: from the start)
    if (!this.shown || this.k >= moves.length - 1) return this.fromStart()
    this.playing = true
    this.render()
    this.idled()
  }

  pause() {
    this.playing = false
    this.stopFeeding()
    this.render()
  }

  // the battle itself, as it stands
  live() {
    if (!this.battle) return
    this.stopFeeding()
    this.playing = false
    this.shown = null
    this.k = this.moves().length - 1
    this.flow.show(this.battle)
    this.render()
  }

  // The table has played everything: while playing, the next move, after a
  // rest; past the last, a battle still going on is shown as it stands,
  // one that is over stays where it ended.
  idled() {
    if (!this.playing || !this.shown || this.timer) return
    this.timer = setTimeout(() => {
      this.timer = 0
      if (!this.playing || !this.shown || !this.flow.player.idle) return
      const moves = this.moves()
      // (the battle folded again under the replay, a concurrent insert
      // before a move it has played: the replay made again at its move)
      const at = this.shown.accepted
      if (at.length !== this.k + 1 || at[this.k] !== moves[this.k]?.id) {
        this.goTo(Math.min(this.k, moves.length - 1), moves)
        return this.render()
      }
      if (this.k >= moves.length - 1) {
        if (this.isLive) return this.live()
        this.playing = false
        return this.render()
      }
      this.k++
      this.shown.store.append(moves[this.k])
      this.render()
      // (a move the table had nothing to play for: on to the next)
      if (this.flow.player.idle) this.idled()
    }, BETWEEN / Math.max(1, clock.speed))
  }

  stopFeeding() {
    clearTimeout(this.timer)
    this.timer = 0
  }

  // The bar let go of: the battle's own Session shown again (`back`: the
  // bar's ✕; else the battle is being left, and its table with it). ✕ on a
  // battle that isn't over (a replay file saved mid-battle, a frozen
  // match) has nothing to come back to but the war room.
  close({ back = false } = {}) {
    if (!this.battle) return
    this.stopFeeding()
    const battle = this.battle, shown = this.shown
    Object.assign(this, { battle: null, shown: null, playing: false, k: -1 })
    this.bar.hide()
    if (back && battle.status !== 'over') return this.flow.back()
    if (back && shown) this.flow.show(battle)
    else shown?.close()
  }

  // the bar as things stand (the battle's own changes too: at Live, the
  // slider follows its last move)
  render() {
    if (!this.battle) return this.bar.hide()
    const moves = this.moves(), first = this.first(moves)
    if (!this.shown) this.k = moves.length - 1
    this.bar.render({ min: first - 1, max: moves.length - 1, at: this.k, first, playing: this.playing, live: this.isLive, atLive: !this.shown, closable: !this.isLive })
  }

  // ── Replay files ───────────────────────────────────────────────────────
  // The battle's whole log, every entry's text as its store keeps it (the
  // battle is a pure function of it), with the version of the game that
  // played it.
  file() {
    return JSON.stringify({ replay: 'tails-and-scales', version: 1, core: CORE_VERSION, rules: RULES_ID, saved: new Date().toISOString(), log: JSON.parse(this.battle.store.export()) })
  }

  save() {
    if (!this.battle) return
    const url = URL.createObjectURL(new Blob([this.file()], { type: 'application/json' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `tails-and-scales-replay-${Date.now()}.json`
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 10000)
  }
}

// A replay file's text → { store } (a LocalStore of its log) or { why }.
// A log is only texts: a fold of them is the battle, every entry held to
// the rules as it was when played (a file from another version of the
// game folds read-only: the Folder's skew).
export function openReplay(text) {
  let f
  try {
    f = JSON.parse(text)
  } catch {
    return { why: "it isn't a replay file (not JSON)" }
  }
  if (f?.replay !== 'tails-and-scales' || !Array.isArray(f.log)) return { why: "it isn't a Tails & Scales replay file" }
  if (!f.log.length || f.log.length > 6000 || !f.log.every((x) => typeof x === 'string' && x.length <= 4096)) return { why: 'its log is empty, too long, or holds something other than entries' }
  return { store: new LocalStore(f.log) }
}
