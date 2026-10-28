// node:fs — one memfs volume for the whole Worker, with the full synchronous
// API Claude Code needs (~300 sync call sites), plus helpers for boot.js:
//
//   mount(tree, { at, stripPrefix, mode })   bulk-load files (the extracted app tree)
//   snapshot(roots) / restore(snap)          whole-subtree capture for OPFS persistence
//   serializeSnapshot(snap) / deserializeSnapshot(bytes)   one-blob encoding of a snapshot
//   onChange(cb, { roots, debounceMs, maxWaitMs })  debounced "something under roots changed"
//
// Relative paths resolve against the live process.cwd().
import { Volume, createFsFromVolume, memfsProcess } from '../vendor.js';
import { Buffer } from './buffer.js';
import { posix as path } from './path.js';

// Ownership. memfs stamps new inodes with `memfsProcess.getuid()` (the global
// process if one existed when vendor.js loaded, else memfs' own stub) but
// checks permissions with the uid of the process object given to the volume.
// Both must agree at all times, whatever order boot.js installs things in, or
// a file written with mode 0o600 before `process` existed becomes unreadable
// after. So: one source of truth. A stub gets the fixed uid our process shim
// reports (1000); a real global process (Node, in tests) is used as-is.
export const VFS_UID = 1000;
if (memfsProcess && memfsProcess !== globalThis.process) {
  memfsProcess.getuid = () => VFS_UID;
  memfsProcess.getgid = () => VFS_UID;
}

// memfs reads cwd/uid/gid from this object on every call.
const processAdapter = {
  cwd: () => { try { return globalThis.process?.cwd?.() || '/'; } catch { return '/'; } },
  platform: 'linux',
  get env() { return globalThis.process?.env || {}; },
  emitWarning: (...args) => globalThis.process?.emitWarning?.(...args),
  getuid: () => memfsProcess?.getuid?.() ?? 0,
  getgid: () => memfsProcess?.getgid?.() ?? 0,
};

export const volume = Volume.fromJSON({}, '/', { process: processAdapter });
const mfs = createFsFromVolume(volume);

// memfs defines the four stream classes as getters that read a private symbol
// off `this`. graceful-fs (bundled for proper-lockfile, which guards every
// config save) clones fs by copying property descriptors, so on the clone the
// getter runs with a `this` that lacks the symbol and throws, and every
// "save config with lock" fails. Node's getters work with any `this`: pin the
// classes as plain data properties.
for (const k of ['ReadStream', 'WriteStream', 'FileReadStream', 'FileWriteStream']) {
  Object.defineProperty(mfs, k, { value: mfs[k], writable: true, enumerable: true, configurable: true });
}

// A Linux-ish skeleton so common paths exist from the start.
for (const dir of ['/tmp', '/home/user', '/dev', '/etc', '/usr/bin']) mfs.mkdirSync(dir, { recursive: true });
mfs.writeFileSync('/dev/null', '');
mfs.chmodSync('/tmp', 0o777);

// --- the fs object ---------------------------------------------------------
const fs = mfs;
export default fs;

export const {
  F_OK, R_OK, W_OK, X_OK, constants, Stats, Dir, Dirent, StatWatcher, FSWatcher,
  ReadStream, WriteStream, FileReadStream, FileWriteStream, promises,
  access, accessSync, appendFile, appendFileSync, chmod, chmodSync, chown, chownSync,
  close, closeSync, copyFile, copyFileSync, cp, cpSync, createReadStream, createWriteStream,
  exists, existsSync, fchmod, fchmodSync, fchown, fchownSync, fdatasync, fdatasyncSync,
  fstat, fstatSync, fsync, fsyncSync, ftruncate, ftruncateSync, futimes, futimesSync,
  glob, globSync, lchmod, lchmodSync, lchown, lchownSync, link, linkSync, lstat, lstatSync,
  lutimes, lutimesSync, mkdir, mkdirSync, mkdtemp, mkdtempSync, open, openAsBlob, openSync,
  opendir, opendirSync, read, readFile, readFileSync, readSync, readdir, readdirSync,
  readlink, readlinkSync, readv, readvSync, realpath, realpathSync, rename, renameSync,
  rm, rmSync, rmdir, rmdirSync, stat, statSync, statfs, statfsSync, symlink, symlinkSync,
  truncate, truncateSync, unlink, unlinkSync, unwatchFile, utimes, utimesSync, watch,
  watchFile, write, writeFile, writeFileSync, writeSync, writev, writevSync,
} = fs;

// --- mount -------------------------------------------------------------------
function entriesOf(tree) {
  if (tree instanceof Map) return [...tree].map(([p, data]) => ({ path: p, data }));
  if (Array.isArray(tree)) return tree.map((e) => (Array.isArray(e) ? { path: e[0], data: e[1] } : { path: e.path, data: e.bytes ?? e.data, mode: e.mode }));
  return Object.entries(tree).map(([p, data]) => ({ path: p, data }));
}

function toBytes(data) {
  if (data == null) return Buffer.alloc(0);
  if (typeof data === 'string') return Buffer.from(data, 'utf8');
  if (data instanceof ArrayBuffer) return Buffer.from(new Uint8Array(data));
  if (ArrayBuffer.isView(data)) return Buffer.from(data.buffer, data.byteOffset, data.byteLength);
  if (data.bytes !== undefined) return toBytes(data.bytes); // {bytes, encoding} from the extractor
  throw new TypeError('mount: file data must be a string, ArrayBuffer or typed array');
}

// tree: Map<path, data> | Array<[path, data] | {path, bytes|data, mode}> | {path: data}
// Absolute paths are taken as-is unless `at` is given, in which case every
// path (after removing `stripPrefix`) is placed under `at`.
export function mount(tree, { at, stripPrefix, mode = 0o644 } = {}) {
  const made = new Set();
  let count = 0;
  for (const entry of entriesOf(tree)) {
    let p = String(entry.path);
    if (stripPrefix && p.startsWith(stripPrefix)) p = p.slice(stripPrefix.length);
    const full = at ? path.join(at, p) : path.resolve(p);
    const dir = path.dirname(full);
    if (!made.has(dir)) { mfs.mkdirSync(dir, { recursive: true }); made.add(dir); }
    mfs.writeFileSync(full, toBytes(entry.data), { mode: entry.mode ?? mode });
    count++;
  }
  return count;
}

// --- snapshot / restore ------------------------------------------------------
export function snapshot(roots = ['/home/user']) {
  const entries = [];
  const walk = (p) => {
    let st;
    try { st = mfs.lstatSync(p); } catch { return; }
    if (st.isSymbolicLink()) {
      entries.push({ path: p, type: 'symlink', mode: st.mode & 0o7777, mtimeMs: st.mtimeMs, target: mfs.readlinkSync(p) });
    } else if (st.isDirectory()) {
      entries.push({ path: p, type: 'dir', mode: st.mode & 0o7777, mtimeMs: st.mtimeMs });
      for (const name of mfs.readdirSync(p).sort()) walk(p === '/' ? `/${name}` : `${p}/${name}`);
    } else if (st.isFile()) {
      const buf = mfs.readFileSync(p);
      entries.push({ path: p, type: 'file', mode: st.mode & 0o7777, mtimeMs: st.mtimeMs, data: new Uint8Array(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)) });
    }
  };
  for (const r of roots) walk(path.resolve(r));
  return { version: 1, roots: roots.map((r) => path.resolve(r)), entries };
}

let restoring = false;

export function restore(snap, { replace = true } = {}) {
  if (!snap || snap.version !== 1) throw new Error('restore: not a snapshot (version 1)');
  restoring = true;
  try {
    if (replace) for (const r of snap.roots) mfs.rmSync(r, { recursive: true, force: true });
    for (const e of snap.entries) {
      if (e.type === 'dir') mfs.mkdirSync(e.path, { recursive: true, mode: e.mode });
      else {
        mfs.mkdirSync(path.dirname(e.path), { recursive: true });
        if (e.type === 'symlink') { mfs.rmSync(e.path, { force: true }); mfs.symlinkSync(e.target, e.path); continue; }
        mfs.writeFileSync(e.path, toBytes(e.data), { mode: e.mode });
      }
      if (e.mtimeMs) mfs.utimesSync(e.path, e.mtimeMs / 1000, e.mtimeMs / 1000);
    }
    return snap.entries.length;
  } finally {
    restoring = false;
  }
}

// Layout: "CCWFS1\n" | u32 LE header length | JSON header | file bytes, in entry order.
const MAGIC = 'CCWFS1\n';
export function serializeSnapshot(snap) {
  const { entries } = snap;
  const header = JSON.stringify({ version: snap.version, roots: snap.roots, entries: entries.map(({ data, ...rest }) => ({ ...rest, size: data ? data.byteLength : 0 })) });
  const enc = new TextEncoder();
  const magic = enc.encode(MAGIC);
  const head = enc.encode(header);
  const total = magic.length + 4 + head.length + entries.reduce((n, e) => n + (e.data ? e.data.byteLength : 0), 0);
  const out = new Uint8Array(total);
  let o = 0;
  out.set(magic, o); o += magic.length;
  new DataView(out.buffer).setUint32(o, head.length, true); o += 4;
  out.set(head, o); o += head.length;
  for (const e of entries) if (e.data) { out.set(e.data, o); o += e.data.byteLength; }
  return out;
}

export function deserializeSnapshot(bytes) {
  const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  const dec = new TextDecoder();
  if (dec.decode(u8.subarray(0, MAGIC.length)) !== MAGIC) throw new Error('deserializeSnapshot: bad magic');
  let o = MAGIC.length;
  const len = new DataView(u8.buffer, u8.byteOffset).getUint32(o, true); o += 4;
  const header = JSON.parse(dec.decode(u8.subarray(o, o + len))); o += len;
  for (const e of header.entries) {
    if (e.type === 'file') { e.data = u8.slice(o, o + e.size); o += e.size; }
    delete e.size;
  }
  return header;
}

// --- change notification -----------------------------------------------------
// memfs' superblock emits an event for every create/modify/delete/move/attrib.
// A trailing debounce (debounceMs after the last change), capped by maxWaitMs
// after the first change of a batch: a steady stream of writes still fires at
// least every maxWaitMs, so persistence is never put off indefinitely.
export function onChange(cb, { roots = ['/home/user'], debounceMs = 300, maxWaitMs = 2000 } = {}) {
  const prefixes = roots.map((r) => path.resolve(r));
  const under = (p) => prefixes.some((r) => p === r || p.startsWith(r.endsWith('/') ? r : `${r}/`));
  let timer = null;
  let first = 0; // Date.now() of the batch's first change
  let changed = new Set();
  const fire = () => { timer = null; const paths = changed; changed = new Set(); cb({ paths: [...paths] }); };
  const stop = volume._core.changes.listen((ev) => {
    if (restoring) return;
    const steps = ev?.steps;
    const p = Array.isArray(steps) ? `/${steps.filter(Boolean).join('/')}` : null;
    const old = Array.isArray(ev?.oldSteps) ? `/${ev.oldSteps.filter(Boolean).join('/')}` : null;
    if (p === null || !(under(p) || (old && under(old)))) return;
    const t = Date.now();
    if (!changed.size) first = t;
    changed.add(p);
    if (timer) clearTimeout(timer);
    const left = maxWaitMs > 0 ? Math.max(0, first + maxWaitMs - t) : Infinity;
    timer = setTimeout(fire, Math.min(debounceMs, left));
  });
  return () => { stop(); if (timer) clearTimeout(timer); };
}

// Wipe everything (tests); the volume object itself stays the same.
export function reset() {
  for (const name of mfs.readdirSync('/')) mfs.rmSync(`/${name}`, { recursive: true, force: true });
  for (const dir of ['/tmp', '/home/user', '/dev', '/etc', '/usr/bin']) mfs.mkdirSync(dir, { recursive: true });
  mfs.writeFileSync('/dev/null', '');
}

Object.assign(fs, { mount, snapshot, restore, serializeSnapshot, deserializeSnapshot, onChange, volume });
