// CapTP over automerge-repo EPHEMERAL messages (design §6.2, §16.6).
//
// Ephemeral messages go to every peer that has the doc (the sync server relays
// them), so this adds addressing (random session ids), sequence numbers and
// AES-GCM sealing under keys derived from the secret in the link FRAGMENT
// (never sent to the sync server; the doc id is the HKDF salt). Peers without
// the key see opaque frames and drop them. Each session runs under its own key,
// derived from the role secret and fresh nonces from both sides, with the
// routing (from, to, direction) authenticated: anyone who sees the traffic (the
// sync server, a view-link holder, a same-origin page on the BroadcastChannel)
// can neither replay a recorded session nor re-address its frames.
//
// S3 behaviour, kept: frames with seq < expected are duplicates (two tabs of one
// browser relay the same message over BroadcastChannel AND websocket) and are
// dropped; only a gap aborts a session. The guest sends a sealed {fin} on close
// and to every host whose ACK lost the race, so CLI calls do not leak host
// sessions. Added: hosts drop sessions idle for idleMs (guests keep alive), end
// hooks so the caps can cancel a dead session's subscriptions, and a sealed
// {bye} from a closing host so a guest's pending calls fail fast.
//
// `channel` is a DocHandle or anything with its ephemeral surface:
// { broadcast(msg), on('ephemeral-message', fn({ message, senderId })), off(evt, fn), documentId }.
// Works unchanged in Node 22 and browsers (WebCrypto).
import { makeCapTP } from '@endo/captp'

const te = new TextEncoder()
const td = new TextDecoder()
export const b64u = {
  enc: (u8) => { let s = ''; for (const b of u8) s += String.fromCharCode(b); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '') },
  dec: (s) => Uint8Array.from(atob(String(s).replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0)),
}
export const randomId = (n = 9) => b64u.enc(crypto.getRandomValues(new Uint8Array(n)))

// one-way role derivation: editor secret -> view secret
export async function deriveSecret (secret, label) {
  const k = await crypto.subtle.importKey('raw', b64u.dec(secret), 'HKDF', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits({ name: 'HKDF', hash: 'SHA-256', salt: new Uint8Array(0), info: te.encode(label) }, k, 128)
  return b64u.enc(new Uint8Array(bits))
}

const PROTO = 'merge-meadow-captp-v2'

// secret -> a ROLE KEY { syn, base }, salted with the doc id so one secret means
// nothing for another doc. `syn` (AES-GCM) seals only the SYN and the ACK; `base`
// (HKDF) is never used to seal: every session's frames go under a key derived
// from it and fresh nonces from both sides (sessionKey), so frames recorded from
// one session neither replay into a new one nor splice into another live one.
export async function aesKey (secret, docId) {
  const id = String(docId).replace(/^automerge:/, '')
  const k = await crypto.subtle.importKey('raw', b64u.dec(secret), 'HKDF', false, ['deriveKey', 'deriveBits'])
  const salt = te.encode(id)
  const syn = await crypto.subtle.deriveKey({ name: 'HKDF', hash: 'SHA-256', salt, info: te.encode(`${PROTO}|syn`) },
    k, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt'])
  const bits = await crypto.subtle.deriveBits({ name: 'HKDF', hash: 'SHA-256', salt, info: te.encode(`${PROTO}|session-base`) }, k, 256)
  const base = await crypto.subtle.importKey('raw', bits, 'HKDF', false, ['deriveKey'])
  return Object.freeze({ syn, base })
}
export const roleKey = aesKey

// K = HKDF(base, salt = guestNonce || hostNonce, info = session|gid|hid)
async function sessionKey (rk, gN, hN, gid, hid) {
  const salt = new Uint8Array(gN.length + hN.length); salt.set(gN); salt.set(hN, gN.length)
  return crypto.subtle.deriveKey({ name: 'HKDF', hash: 'SHA-256', salt, info: te.encode(`${PROTO}|session|${gid}|${hid}`) },
    rk.base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt'])
}
const nonce = () => crypto.getRandomValues(new Uint8Array(16))

// The routing (from, to) and the direction are authenticated as AES-GCM
// additional data: a frame re-addressed in clear, or reflected back at its
// sender, fails to open instead of being delivered.
const aadOf = (from, to, dir) => te.encode(JSON.stringify({ from, to, dir }))
async function seal (key, obj, aad) {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv, additionalData: aad }, key, te.encode(JSON.stringify(obj))))
  return { iv, ct }
}
const bytes = (x) => (x instanceof Uint8Array ? x : ArrayBuffer.isView(x) ? new Uint8Array(x.buffer, x.byteOffset, x.byteLength) : new Uint8Array(x))
async function unseal (key, { iv, ct }, aad) {
  return JSON.parse(td.decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: bytes(iv), additionalData: aad }, key, bytes(ct))))
}

// One point-to-point, ordered, sealed pipe between two session ids, under the
// session key; `out`/`in` are the directions ('g2h' | 'h2g') bound into every frame.
function makePipe ({ channel, key, me, them, out, in: dirIn, onFrame, onBroken }) {
  let outSeq = 0; let inSeq = 0; let dups = 0; let dead = false
  const aadOut = aadOf(me, them, out); const aadIn = aadOf(them, me, dirIn)
  let chain = Promise.resolve() // encryption is async: chain so frames leave in order
  const send = (frame) => {
    if (dead) return chain
    const seq = outSeq++
    chain = chain.then(async () => {
      const box = await seal(key, { seq, frame }, aadOut)
      if (!dead) channel.broadcast({ sc: 1, to: them, from: me, ...box })
    }).catch(() => {})
    return chain
  }
  let rchain = Promise.resolve() // decryption too: chain so frames are delivered in order
  const receive = (box) => {
    rchain = rchain.then(async () => {
      if (dead) return
      let m
      try { m = await unseal(key, box, aadIn) } catch { return } // not for this session, re-addressed, or tampered
      if (m.seq < inSeq) { dups++; return }
      if (m.seq !== inSeq) { dead = true; onBroken(new Error(`captp frame gap: want ${inSeq} got ${m.seq}`)); return }
      inSeq++
      onFrame(m.frame)
    }).catch((e) => { console.error('[transport] frame', e) })
  }
  return { send, receive, kill () { dead = true }, get dups () { return dups } }
}

// HOST side (the scene tab). roles: { [role]: { key: roleKey, bootstrap(sessionId, role), onEnd?(sessionId, reason) } }.
// A guest proves its role only by sealing its SYN under that role's SYN key.
// Handshake: SYN {syn: gid, n: gN} under roleKey.syn (to '*'); ACK {ack: gid, n: hN}
// under roleKey.syn (to gid); then both sides use K = sessionKey(gN, hN, gid, hid).
// A gid this host has already served is never served again (a replayed SYN).
export function hostCapTP (channel, roles, { log = () => {}, idleMs = 10 * 60 * 1000, now = () => Date.now(), timers = globalThis, maxServed = 4096 } = {}) {
  const me = 'h_' + randomId()
  const sessions = new Map() // guest session -> { pipe, captp, role, lastAt }
  const served = new Set() // guest session ids already answered (bounded, oldest first out)
  let closed = false
  const remember = (gid) => { served.add(gid); if (served.size > maxServed) served.delete(served.values().next().value) }

  // notify: tell the guest with a sealed {bye} first, so its pending calls fail now;
  // the pipe dies only once that frame has left
  function end (gid, reason, { err, notify = false } = {}) {
    const s = sessions.get(gid)
    if (!s) return Promise.resolve()
    sessions.delete(gid)
    s.ending = true // the abort below rejects pending calls on purpose: not worth a log line
    const last = notify ? s.pipe.send({ bye: me }) : Promise.resolve()
    try { s.captp.abort(err ?? new Error(reason)) } catch {}
    try { roles[s.role]?.onEnd?.(gid, reason) } catch (e) { log('onEnd failed', e?.message) }
    log(`guest ${gid} ended (${reason})`)
    return last.then(() => s.pipe.kill())
  }

  const onMsg = async ({ message: m }) => {
    if (closed || !m || m.sc !== 1 || typeof m.from !== 'string') return
    if (m.to === me) { const s = sessions.get(m.from); if (s) { s.lastAt = now(); s.pipe.receive(m) } return }
    if (m.to !== '*' || sessions.has(m.from) || served.has(m.from)) return // a SYN is addressed to '*'
    for (const [role, r] of Object.entries(roles)) {
      let syn
      try { syn = await unseal(r.key.syn, m, aadOf(m.from, '*', 'syn')) } catch { continue }
      // the session id is bound inside the ciphertext (and in its additional data)
      if (syn?.frame?.syn !== m.from || typeof syn.frame.n !== 'string') continue
      const gid = m.from
      if (closed || sessions.has(gid) || served.has(gid)) return
      remember(gid)
      let gN
      try { gN = b64u.dec(syn.frame.n) } catch { return }
      if (gN.length < 16) return
      const hN = nonce()
      const K = await sessionKey(r.key, gN, hN, gid, me)
      const ack = await seal(r.key.syn, { frame: { ack: gid, n: b64u.enc(hN) } }, aadOf(me, gid, 'ack'))
      if (closed) return
      const s = { role, lastAt: now() }
      s.pipe = makePipe({
        channel, key: K, me, them: gid, out: 'h2g', in: 'g2h',
        onFrame: (f) => {
          if (f && f.fin === gid) { end(gid, 'fin'); return }
          if (f && f.ka) return
          s.captp.dispatch(f)
        },
        onBroken: (e) => end(gid, 'broken', { err: e }),
      })
      sessions.set(gid, s)
      // the ACK leaves before any session frame: the guest needs hN to open them
      channel.broadcast({ sc: 1, to: gid, from: me, ...ack })
      s.captp = makeCapTP(`${me}/${gid}`, (f) => { s.pipe.send(f) }, r.bootstrap(gid, role), { onReject: (e) => { if (!s.ending) log('captp reject', e?.message) } })
      log(`guest ${gid} attached as ${role}`)
      return
    }
  }
  channel.on('ephemeral-message', onMsg)

  const idleTimer = timers.setInterval(() => {
    const t = now()
    for (const [gid, s] of [...sessions]) if (t - s.lastAt > idleMs) end(gid, 'idle', { notify: true })
  }, Math.max(1000, Math.min(idleMs / 4, 30000)))

  return {
    hostSession: me,
    sessions,
    count: () => sessions.size,
    list: () => [...sessions].map(([id, s]) => ({ id, role: s.role, lastAt: s.lastAt })),
    revoke (role) {
      return Promise.allSettled([...sessions].filter(([, s]) => !role || s.role === role).map(([gid]) => end(gid, 'revoked', { notify: true })))
    },
    async close () {
      if (closed) return
      closed = true
      timers.clearInterval(idleTimer)
      // tell guests first, so their pending calls reject now instead of timing out
      await Promise.allSettled([...sessions.keys()].map((gid) => end(gid, 'host closed', { notify: true })))
      channel.off('ephemeral-message', onMsg)
    },
  }
}

// GUEST side (the agent). key: a role key from aesKey(), or the secret string
// (derived with channel.documentId). Resolves to { bootstrap, captp, host, me, closed, close() } once a host ACKs.
export async function connectCapTP (channel, key, { timeoutMs = 8000, local = undefined, keepAliveMs = 60000, timers = globalThis } = {}) {
  const rk = typeof key === 'string' ? await aesKey(key, channel.documentId) : key
  if (!rk?.syn || !rk?.base) throw new TypeError('connectCapTP: key must be the secret or a role key from aesKey()')
  const me = 'g_' + randomId()
  const gN = nonce()
  return new Promise((resolve, reject) => {
    let host = null; let pipe = null; let captp = null; let ka = null; let done = false
    let markClosed
    const closedP = new Promise((r) => { markClosed = r })
    const pending = new Map() // host session -> pipe; first ACK wins
    const opening = new Map() // host session -> frames that arrived while its ACK was being opened
    const finish = (reason, err) => {
      if (done) return
      done = true
      timers.clearInterval(ka)
      channel.off('ephemeral-message', onMsg)
      try { captp?.abort(err ?? new Error(reason)) } catch {}
      markClosed(reason)
    }
    const timer = timers.setTimeout(() => {
      if (host) return
      channel.off('ephemeral-message', onMsg)
      reject(new Error(`no host page answered within ${timeoutMs} ms (is a tab with this link open?)`))
    }, timeoutMs)
    // only a sealed ACK bound to (that host, me) opens a pipe to a host
    async function openAck (from, m) {
      opening.set(from, [])
      let a
      try { a = await unseal(rk.syn, m, aadOf(from, me, 'ack')) } catch { opening.delete(from); return }
      let hN = null
      try { hN = a?.frame?.ack === me && typeof a.frame.n === 'string' ? b64u.dec(a.frame.n) : null } catch {}
      if (!hN || hN.length < 16) { opening.delete(from); return }
      const K = await sessionKey(rk, gN, hN, me, from)
      if (done) return
      const p = makePipe({
        channel, key: K, me, them: from, out: 'g2h', in: 'h2g',
        onFrame: (f) => {
          if (from !== host) return
          if (f?.bye) { finish('host page closed', new Error('host page closed the session')); return }
          captp?.dispatch(f)
        },
        onBroken: (e) => { if (from === host) finish('broken', e) },
      })
      pending.set(from, p)
      const early = opening.get(from) ?? []
      opening.delete(from)
      if (host && host !== from) { p.finned = true; p.send({ fin: me }); return } // a losing host: release its session
      if (!host) {
        host = from; pipe = p; timers.clearTimeout(timer)
        captp = makeCapTP(me, (fr) => { pipe.send(fr) }, local, { onReject: () => {} })
        if (keepAliveMs) ka = timers.setInterval(() => pipe.send({ ka: 1 }), keepAliveMs)
        resolve({
          bootstrap: captp.getBootstrap(), captp, host, me, pipe,
          closed: closedP,
          get isClosed () { return done },
          async close () { if (done) return; await pipe.send({ fin: me }); finish('closed') },
        })
      }
      for (const box of early) p.receive(box)
    }
    const onMsg = ({ message: m }) => {
      if (done || !m || m.sc !== 1 || m.to !== me || typeof m.from !== 'string') return
      const p = pending.get(m.from)
      if (p) { if (!p.finned) p.receive(m); return }
      const q = opening.get(m.from)
      if (q) { q.push(m); return }
      openAck(m.from, m).catch(() => {})
    }
    channel.on('ephemeral-message', onMsg)
    // the SYN is addressed to '*' and sits outside every pipe; it is sealed, so only
    // holders of a role key can read (and answer) it, and it carries the guest's nonce
    seal(rk.syn, { frame: { syn: me, n: b64u.enc(gN) } }, aadOf(me, '*', 'syn')).then((box) => channel.broadcast({ sc: 1, to: '*', from: me, ...box }), reject)
  })
}
