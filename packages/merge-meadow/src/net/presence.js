// Presence + host election over the doc's ephemeral channel (design §4.1, §16.4).
//   heartbeat {t:'pr', n, i: info, hello?: 1, st: 0|1}   every heartbeatMs (2 s)
//   bye       {t:'bye'}                                  on pagehide (removal applies at once)
// Liveness: a peer exists only once it has sent a heartbeat (so a Node agent whose
// sealed CapTP frames ride the same channel never becomes a host candidate); after
// that ANY message from it refreshes liveness. A peer that is streaming poses and
// has been silent on the stream for streamTtlMs (2.5 s) is gone — S2 measured
// crash failover at 2.5 s, and 1.5 s false-triggered on the public server's 1.9 s
// stalls — otherwise it expires liveMs (6 s) after its last message.
// The `st` flag says whether the sender is streaming, so a peer that stops
// streaming on purpose (it lost the host role) is not mistaken for a crash.
//
// Host = lowest live peer id among CANDIDATES (no doc write). S2's obvious rule
// self-elected a joiner for ~100 ms and caused a double hit; this one does not:
//   - a remote peer is a candidate if I first heard it within my own first
//     candidateMs (an incumbent), or I have known it for >= candidateMs;
//   - I am a candidate after candidateMs + selfMarginMs when others are present,
//     or after aloneMs alone;
//   - a peer with no candidate simulates nothing (entities hold their pose).
const ALIVE_CHECK_MS = 250

export function makePresence (handle, {
  peerId, info = {}, heartbeatMs = 2000, liveMs = 6000, streamTtlMs = 2500,
  candidateMs = 3000, selfMarginMs = 250, aloneMs = 1500,
  now = () => Date.now(), timers = globalThis, send,
} = {}) {
  if (!peerId) throw new TypeError('makePresence: peerId is required (use the repo peerId)')
  const out = send ?? ((m) => { try { handle.broadcast(m) } catch {} })
  const peers = new Map() // id -> { firstAt, lastAt, lastStreamAt, streaming, gone, info }
  const listeners = new Set()
  let myInfo = { ...info }
  let n = 0
  let startedAt = now()
  let streamingSelf = false
  let lastReplyAt = -Infinity
  let lastSelfCheck = null
  let paused = false // hidden tab (pause/resume)

  const emit = (ev) => { for (const f of listeners) { try { f(ev) } catch (e) { console.error('[presence] listener', e) } } }
  const beat = (hello = false) => { if (!paused) out({ t: 'pr', n: ++n, i: myInfo, st: streamingSelf ? 1 : 0, ...(hello ? { hello: 1 } : {}) }) }

  const alive = (p, t) => {
    if (p.gone || t - p.lastAt > liveMs) return false
    if (p.streaming && p.lastStreamAt && t - p.lastStreamAt > streamTtlMs) return false
    return true
  }

  function noteMessage (from, kind, msg) {
    if (!from || from === peerId) return
    const t = now()
    let p = peers.get(from)
    if (kind === 'bye') {
      if (p && !p.gone) { p.gone = true; emit({ type: 'leave', peerId: from, reason: 'bye' }) }
      return
    }
    if (kind !== 'pr') {
      // only peers that announced themselves count; their other traffic is a heartbeat too
      if (!p || p.gone) return
      p.lastAt = t
      if (kind === 'po') { p.lastStreamAt = t; p.streaming = true }
      return
    }
    const joined = !p || p.gone || !alive(p, t) || !!msg?.hello
    if (!p) peers.set(from, p = { firstAt: t, lastAt: t, lastStreamAt: 0, streaming: false, gone: false, info: {} })
    // a hello from a peer I know is a restart (reload keeps the peer id): it is a
    // newcomer again, so it must not be a host candidate before it counts itself one
    if (joined) { p.firstAt = t; p.gone = false; p.lastStreamAt = 0 }
    p.lastAt = t
    p.streaming = msg?.st === 1
    // a peer that SAYS it streams must show it: the TTL clock starts now, not at its
    // first 'po'. Otherwise a hidden tab (rAF stopped, timer heartbeats still saying
    // st:1) rejoins after its expiry with the TTL switched off and is re-elected host
    // while it simulates nothing.
    if (!p.streaming) p.lastStreamAt = 0
    else if (!p.lastStreamAt) p.lastStreamAt = t
    const prevInfo = p.info
    p.info = msg?.i && typeof msg.i === 'object' ? msg.i : {}
    if (msg?.hello && !stalled() && t - lastReplyAt >= ALIVE_CHECK_MS) { lastReplyAt = t; beat(false) }
    if (joined) emit({ type: 'join', peerId: from, hello: !!msg?.hello })
    else if (JSON.stringify(prevInfo) !== JSON.stringify(p.info)) emit({ type: 'info', peerId: from })
  }

  const onMsg = ({ message, senderId }) => noteMessage(senderId, message?.t, message)
  handle?.on?.('ephemeral-message', onMsg)

  const expire = () => {
    const t = now()
    for (const [id, p] of peers) if (!p.gone && !alive(p, t)) { p.gone = true; emit({ type: 'leave', peerId: id, reason: 'expired' }) }
  }

  // Sender side of the same rule: a tab whose frames stopped (background tab, a
  // debugger, a long stall) but whose timers still fire must not keep vouching for
  // itself. selfCheck() runs every frame; while it is older than the stream TTL, or
  // while paused (hidden tab), heartbeats are not sent, so the others expire this
  // peer and elect around it; selfCheck/resume rejoin it as a newcomer.
  const stalled = () => paused || (lastSelfCheck != null && now() - lastSelfCheck > streamTtlMs)
  const hb = timers.setInterval(() => { if (!stalled()) beat(false); expire() }, heartbeatMs)
  const ex = timers.setInterval(expire, ALIVE_CHECK_MS)
  beat(true)

  const liveRemote = () => { const t = now(); return [...peers].filter(([, p]) => alive(p, t)) }

  return {
    peerId,
    peers () {
      const m = new Map()
      for (const [id, p] of liveRemote()) m.set(id, { info: p.info, last: p.lastAt, streaming: p.streaming })
      return m
    },
    livePeers () { return [peerId, ...liveRemote().map(([id]) => id)].sort() },
    isLive (id) {
      if (!id) return false
      if (id === peerId) return true
      const p = peers.get(String(id))
      return !!p && alive(p, now())
    },
    host () {
      if (paused) return null // a hidden tab simulates nothing (it said bye)
      const t = now()
      const others = liveRemote()
      const cands = others.filter(([, p]) => p.firstAt - startedAt < candidateMs || t - p.firstAt >= candidateMs).map(([id]) => id)
      if (t - startedAt >= (others.length ? candidateMs + selfMarginMs : aloneMs)) cands.push(peerId)
      cands.sort()
      return cands[0] ?? null
    },
    info (id = peerId) { return id === peerId ? myInfo : peers.get(id)?.info ?? null },
    set (patch) { myInfo = { ...myInfo, ...patch }; beat(false) },
    // the stream reports whether it is sending; stopping is announced at once so
    // receivers drop the 2.5 s stream TTL for us before it can fire
    setStreaming (on) {
      on = !!on
      if (on === streamingSelf) return
      streamingSelf = on
      if (!on) beat(false)
    },
    // Called every frame. A tab that stalled longer than the stream TTL (background
    // tab, debugger) has been declared gone by the others and re-elected around; it
    // rejoins as a newcomer instead of resuming as host next to the new one.
    selfCheck (t = now()) {
      if (paused) return false
      const gap = lastSelfCheck != null && t - lastSelfCheck > streamTtlMs
      if (gap) { startedAt = t; beat(true) }
      lastSelfCheck = t
      return gap
    },
    // hidden tab: say bye (the others take over at once) and stay silent until resume()
    pause () { if (paused) return; paused = true; streamingSelf = false; out({ t: 'bye' }) },
    // visible again: a newcomer (not a candidate before candidateMs), announced with a hello
    resume () { if (!paused) return; paused = false; startedAt = now(); lastSelfCheck = now(); beat(true) },
    get paused () { return paused },
    on (fn) { listeners.add(fn); return () => listeners.delete(fn) },
    hello () { if (!paused) beat(true) },
    bye () { out({ t: 'bye' }) },
    noteMessage,
    stop () {
      timers.clearInterval(hb); timers.clearInterval(ex)
      handle?.off?.('ephemeral-message', onMsg)
      listeners.clear()
    },
  }
}
