// Bun standalone-executable payload ("bunfs") locator and module-table parser.
//
// Ported from the logic of unhare 1.1.1 (UnitedMarsupials/unhare, BSD-2) as
// re-derived in spike E's 90-line bunfs-extract.mjs; no code copied. Layout
// (Bun 1.4.x, Claude Code 2.1.311), all integers little-endian:
//
//   ... [blob: byte_count bytes] [Offsets: 32 bytes] ["\n---- Bun! ----\n"] ...
//   Offsets = { u64 byte_count; {u32 off,u32 len} modules; u32 entry_id;
//               {u32 off,u32 len} argv; u32 flags }
//   modules = array of 52-byte records inside the blob:
//     6 x {u32 off, u32 len} (name, contents, sourcemap, bytecode,
//     module_info, bytecode_origin), all relative to the blob start,
//     then u8 encoding (0 binary, 1 latin1, 2 UTF-16LE), u8 loader,
//     u8 module format, u8 side.
//
// The container does not matter: an ELF keeps the payload in a `.bun`
// section, Mach-O in `__BUN,__bun`, PE in a `.bun` section, and in all three
// the payload ends with Offsets + the marker. The marker string also occurs
// earlier in the Bun runtime's own code, and whatever follows the payload
// (section headers, a code signature, alignment padding) is of unknown size
// (59,446 bytes on the 2.1.311 ELF), so we take the LAST occurrence whose
// Offsets validate, scanning backwards from the end.
//
// Nothing is copied: file bytes are subarray views into the input, except
// the UTF-16LE text modules, which are transcoded to UTF-8 exactly as unhare
// writes them. The caller must drop those views (or copy what it keeps)
// before the 294 MB input can be garbage-collected.

import { tryDecodeUtf8, decodeLatin1, utf16leToUtf8 } from './text.js'

export const BUN_MAGIC = new TextEncoder().encode('\n---- Bun! ----\n')
export const OFFSETS_SIZE = 32
export const MODULE_RECORD_SIZE = 52
export const BUNFS_PREFIX = '/$bunfs/'
export const BUNFS_ROOT = '/$bunfs/root/'

const ENCODINGS = ['binary', 'latin1', 'utf16le']
// Bun's options.Loader enum, for the values this bundle uses (reporting only).
const LOADERS = { 0: 'jsx', 1: 'js', 2: 'ts', 3: 'tsx', 4: 'css', 5: 'file', 6: 'json', 8: 'toml', 9: 'wasm', 10: 'napi', 13: 'text' }

export class BunPayloadError extends Error {
  constructor (message) { super(message); this.name = 'BunPayloadError' }
}

/** 'elf' | 'macho' | 'macho-fat' | 'pe' | 'unknown' (informational only). */
export function detectContainer (u8) {
  if (u8.length < 4) return 'unknown'
  const [a, b, c, d] = u8
  if (a === 0x7f && b === 0x45 && c === 0x4c && d === 0x46) return 'elf'
  if ((a === 0xcf || a === 0xce) && b === 0xfa && c === 0xed && d === 0xfe) return 'macho'
  if (a === 0xca && b === 0xfe && c === 0xba && d === 0xbe) return 'macho-fat'
  if (a === 0x4d && b === 0x5a) return 'pe'
  return 'unknown'
}

// Anchor the backwards scan on the '!' (index 9 of the marker): native
// Uint8Array#lastIndexOf finds candidates quickly, then we compare 16 bytes.
const ANCHOR_AT = 9
function lastMagic (u8, before) {
  let i = Math.min(before, u8.length - BUN_MAGIC.length) + ANCHOR_AT
  for (;;) {
    // (a negative fromIndex would make lastIndexOf count from the end)
    if (i < ANCHOR_AT) return -1
    i = u8.lastIndexOf(BUN_MAGIC[ANCHOR_AT], i)
    if (i < ANCHOR_AT) return -1
    const at = i - ANCHOR_AT
    let ok = true
    for (let k = 0; k < BUN_MAGIC.length; k++) if (u8[at + k] !== BUN_MAGIC[k]) { ok = false; break }
    if (ok) return at
    i--
  }
}

function readOffsets (u8, magicAt) {
  const o = magicAt - OFFSETS_SIZE
  if (o < 0) return null
  const dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength)
  const byteCount = Number(dv.getBigUint64(o, true))
  if (!(byteCount > 0 && byteCount <= o)) return null
  const modules = { off: dv.getUint32(o + 8, true), len: dv.getUint32(o + 12, true) }
  const entryId = dv.getUint32(o + 16, true)
  const argv = { off: dv.getUint32(o + 20, true), len: dv.getUint32(o + 24, true) }
  const flags = dv.getUint32(o + 28, true)
  if (!modules.len || modules.len % MODULE_RECORD_SIZE) return null
  if (modules.off + modules.len > byteCount || argv.off + argv.len > byteCount) return null
  const moduleCount = modules.len / MODULE_RECORD_SIZE
  if (entryId >= moduleCount) return null
  return { magicOffset: magicAt, offsetsOffset: o, blobStart: o - byteCount, byteCount, modules, moduleCount, entryId, argv, flags }
}

/**
 * Locate the payload. Returns
 * { container, magicOffset, offsetsOffset, blobStart, byteCount, modules,
 *   moduleCount, entryId, argv, flags, bytesAfterMarker }.
 */
export function findBunPayload (u8) {
  let before = u8.length
  for (;;) {
    const at = lastMagic(u8, before)
    if (at < 0) break
    const p = readOffsets(u8, at)
    if (p) {
      return { container: detectContainer(u8), ...p, bytesAfterMarker: u8.length - at - BUN_MAGIC.length }
    }
    before = at - 1 // an earlier copy of the marker (inside the runtime); keep looking
  }
  throw new BunPayloadError('no Bun standalone payload found: is this the claude executable? (no "---- Bun! ----" marker with a valid module table)')
}

/** "/$bunfs/root/a/b.js" -> "a/b.js" (null outside the root). */
export function rootRelative (name) {
  return name.startsWith(BUNFS_ROOT) ? name.slice(BUNFS_ROOT.length) : null
}

/**
 * Map a stored module name to its /$bunfs/ form, or null when it is unsafe.
 * Windows builds store "B:\~BUN\root\x" (or with forward slashes).
 */
export function normalizeModuleName (raw) {
  let rel
  if (raw.startsWith(BUNFS_PREFIX)) rel = raw.slice(BUNFS_PREFIX.length)
  else if (/^B:[\\/]~BUN[\\/]/.test(raw)) rel = raw.slice('B:/~BUN/'.length).replace(/\\/g, '/')
  else return null
  if (!rel || rel.startsWith('/')) return null
  for (const seg of rel.split('/')) if (seg === '' || seg === '.' || seg === '..') return null
  return BUNFS_PREFIX + rel
}

function decodeName (bytes) {
  const s = tryDecodeUtf8(bytes)
  return s ?? decodeLatin1(bytes)
}

/**
 * Parse the module table.
 * @returns {{ entry: string, files: Map<string, {bytes: Uint8Array, encoding: 'binary'|'latin1'|'utf16le', loader: string|number, index: number, hasBytecode: boolean}>, skipped: string[], payload: object, argv: string }}
 *   Names keep the /$bunfs/ prefix (e.g. "/$bunfs/root/cli"). `bytes` is
 *   what unhare writes to disk: a view of the input for binary/latin1
 *   modules, UTF-8 for the UTF-16LE ones (the `encoding` field records the
 *   stored encoding).
 */
export function parseBunfs (u8, payload = findBunPayload(u8)) {
  const { blobStart, byteCount, modules, moduleCount, entryId } = payload
  const blob = u8.subarray(blobStart, blobStart + byteCount)
  const dv = new DataView(blob.buffer, blob.byteOffset, blob.byteLength)
  const files = new Map()
  const skipped = []
  let entry = null
  for (let i = 0; i < moduleCount; i++) {
    const p = modules.off + i * MODULE_RECORD_SIZE
    const slices = []
    for (let k = 0; k < 6; k++) {
      const off = dv.getUint32(p + k * 8, true)
      const len = dv.getUint32(p + k * 8 + 4, true)
      if (off + len > byteCount) throw new BunPayloadError(`module ${i}: slice ${k} [${off}+${len}] is outside the ${byteCount}-byte blob`)
      slices.push({ off, len })
    }
    const [name, contents, , bytecode] = slices
    const encoding = ENCODINGS[blob[p + 48]]
    if (!encoding) throw new BunPayloadError(`module ${i}: unknown encoding ${blob[p + 48]}`)
    const loaderId = blob[p + 49]
    const raw = decodeName(blob.subarray(name.off, name.off + name.len))
    const vname = normalizeModuleName(raw)
    if (!vname) { skipped.push(raw); continue }
    if (files.has(vname)) throw new BunPayloadError(`duplicate module name ${vname}`)
    let bytes = blob.subarray(contents.off, contents.off + contents.len)
    if (encoding === 'utf16le') bytes = utf16leToUtf8(bytes)
    files.set(vname, { bytes, encoding, loader: LOADERS[loaderId] ?? loaderId, index: i, hasBytecode: bytecode.len > 0 })
    if (i === entryId) entry = vname
  }
  if (!entry) throw new BunPayloadError(`entry module #${entryId} has no usable name`)
  const argv = payload.argv.len ? decodeName(blob.subarray(payload.argv.off, payload.argv.off + payload.argv.len)) : ''
  return { entry, files, skipped, payload, argv }
}

/** "// Version: 2.1.311" from the entry's header comment, or null. */
export function detectVersion (files, entry) {
  const f = files.get(entry)
  if (!f) return null
  const head = decodeLatin1(f.bytes.subarray(0, 4096))
  const m = /^\/\/ Version: ([0-9][^\s]*)\s*$/m.exec(head)
  return m ? m[1] : null
}
