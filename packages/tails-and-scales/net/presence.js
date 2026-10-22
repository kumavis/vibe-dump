// Presence (DESIGN §2.7, N2): who is here, sent over the document's
// ephemeral channel (handle.broadcast: never stored, never in the log)
// every 5 s and whenever it changes:
//
//   { dev, seat, name, head, n, hash, sel?, tg? }
//
// dev and name the device's; seat the seat it plays (-1 watching); head,
// n and hash the Folder's head, how many entries it has accepted and the
// match's stateHash there (a peer on the same head and count whose hash
// differs is out of step: the badge says so, the only cross-check a match
// with no human seat has, where no `h` ever flows); sel and tg the unit its
// player has picked up and the one it aims at (the opponent's ghost: a
// dashed ring, a line to the target). Later steps add keys (F10's `sels`
// and `ords`), never change what one means. What arrives is a peer's
// say-so: each field is checked and anything else dropped, and none of it
// touches the match.
const NAME = /^.{1,64}$/su
const id = (v) => (Number.isSafeInteger(v) && v >= 0 ? v : undefined)

// a message as this page takes it, or null
export function readPresence(m) {
  if (!m || typeof m !== 'object' || typeof m.dev !== 'string' || !NAME.test(m.dev)) return null
  return {
    dev: m.dev,
    seat: Number.isInteger(m.seat) && m.seat >= -1 && m.seat <= 1 ? m.seat : -1,
    name: typeof m.name === 'string' ? m.name.slice(0, 48) : '',
    head: typeof m.head === 'string' && NAME.test(m.head) ? m.head : null,
    n: id(m.n) ?? 0,
    hash: typeof m.hash === 'string' && NAME.test(m.hash) ? m.hash : null,
    sel: id(m.sel),
    tg: id(m.tg),
  }
}

export class Presence {
  // `handle`: the document's; `say()`: this page's message as it stands;
  // `onChange()`: told when a peer's message arrives or one goes quiet
  constructor({ handle, say, onChange = () => {}, every = 5000, quiet = 15000 }) {
    Object.assign(this, { handle, say, onChange, every, quiet })
    this.peers = new Map()
    this.last = ''
    this.heard = ({ message }) => {
      const m = readPresence(message)
      if (!m || m.dev === this.say().dev) return
      this.peers.set(m.dev, { ...m, at: Date.now() })
      this.onChange()
    }
    handle.on('ephemeral-message', this.heard)
    this.timer = setInterval(() => {
      this.send(true)
      // (a peer quiet past `quiet` drops from live())
      if ([...this.peers.values()].some((p) => Date.now() - p.at > this.quiet && !p.gone)) {
        for (const p of this.peers.values()) p.gone = Date.now() - p.at > this.quiet
        this.onChange()
      }
    }, every)
    this.send(true)
  }

  // this page's message, sent now if it changed (or `always`)
  send(always = false) {
    const m = this.say()
    const text = JSON.stringify(m)
    if (!always && text === this.last) return
    this.last = text
    try {
      this.handle.broadcast(m)
    } catch {
      // (a handle being closed)
    }
  }

  // the peers heard from lately, by device
  live() {
    return [...this.peers.values()].filter((p) => Date.now() - p.at <= this.quiet)
  }

  stop() {
    clearInterval(this.timer)
    this.handle.off('ephemeral-message', this.heard)
  }
}
