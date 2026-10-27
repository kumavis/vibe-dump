// Reading the Worker's filesystem snapshots on the page side.
//
// The VFS lives in the Worker (track B's fs shim), so the page never calls
// its snapshot() directly: the Worker posts fs-sync messages carrying
// `serializeSnapshot(snapshot(roots))` bytes, the page stores them (persist.js)
// and lists the workspace from them, also before any Worker has booted (after
// a reload). This module decodes that one-blob format (documented in
// src/runtime/node/fs.js):
//
//   "CCWFS1\n" | u32 LE header length | JSON header | file bytes in entry order
//   header = { version: 1, roots: [...], entries: [{ path, type: 'file'|'dir'|'symlink', mode, mtimeMs, size?, target? }] }
//
// A snapshot object ({version, roots, entries}, what snapshot() returns) is
// accepted wherever bytes are.

import { WORKSPACE } from './constants.js'

const MAGIC = 'CCWFS1\n'

export function isSnapshotBytes (u8) {
  if (!(u8 instanceof Uint8Array) || u8.length < MAGIC.length + 4) return false
  for (let i = 0; i < MAGIC.length; i++) if (u8[i] !== MAGIC.charCodeAt(i)) return false
  return true
}

/** bytes (Uint8Array | ArrayBuffer) or a snapshot object -> {version, roots, entries} */
export function decodeSnapshot (input) {
  if (input == null) return null
  if (!(input instanceof Uint8Array) && !(input instanceof ArrayBuffer) && !ArrayBuffer.isView(input)) {
    if (input.version === 1 && Array.isArray(input.entries)) return input
    throw new TypeError('decodeSnapshot: expected CCWFS1 bytes or a {version: 1, entries} snapshot')
  }
  const u8 = input instanceof Uint8Array ? input : ArrayBuffer.isView(input) ? new Uint8Array(input.buffer, input.byteOffset, input.byteLength) : new Uint8Array(input)
  if (!isSnapshotBytes(u8)) throw new Error('decodeSnapshot: bad magic (not a CCWFS1 snapshot)')
  let o = MAGIC.length
  const len = new DataView(u8.buffer, u8.byteOffset, u8.byteLength).getUint32(o, true)
  o += 4
  const header = JSON.parse(new TextDecoder().decode(u8.subarray(o, o + len)))
  o += len
  for (const e of header.entries) {
    if (e.type === 'file') {
      const size = e.size ?? 0
      e.data = u8.slice(o, o + size)
      o += size
    }
    delete e.size
  }
  return header
}

/** The inverse, for tests and the fake worker (byte-compatible with fs.js serializeSnapshot). */
export function encodeSnapshot (snap) {
  const enc = new TextEncoder()
  const entries = snap.entries.map(({ data, ...rest }) => ({ ...rest, size: data ? data.byteLength : 0 }))
  const head = enc.encode(JSON.stringify({ version: snap.version ?? 1, roots: snap.roots ?? [], entries }))
  const magic = enc.encode(MAGIC)
  const total = magic.length + 4 + head.length + snap.entries.reduce((n, e) => n + (e.data ? e.data.byteLength : 0), 0)
  const out = new Uint8Array(total)
  let o = 0
  out.set(magic, o); o += magic.length
  new DataView(out.buffer).setUint32(o, head.length, true); o += 4
  out.set(head, o); o += head.length
  for (const e of snap.entries) if (e.data) { out.set(e.data, o); o += e.data.byteLength }
  return out
}

/**
 * Files (and directories) under `root`, sorted by path.
 * @returns {{path, rel, type, size, mtimeMs}[]}
 */
export function listEntries (snap, root = WORKSPACE, { dirs = false } = {}) {
  if (!snap) return []
  const prefix = root.endsWith('/') ? root : `${root}/`
  return snap.entries
    .filter((e) => e.path.startsWith(prefix) && (dirs || e.type !== 'dir'))
    .map((e) => ({ path: e.path, rel: e.path.slice(prefix.length), type: e.type, size: e.data ? e.data.byteLength : 0, mtimeMs: e.mtimeMs ?? 0 }))
    .sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0))
}

/** UTF-8 text of one file in the snapshot, or null. */
export function readText (snap, path) {
  const e = snap?.entries.find((x) => x.path === path && x.type === 'file')
  return e ? new TextDecoder().decode(e.data ?? new Uint8Array()) : null
}
