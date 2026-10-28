// Assembles the Bun object from the parts in this directory. Free of the
// vendor bundle and of the track-B shims: everything arrives through `deps`,
// which is what lets the unit tests run this under Node with npm packages and
// Node built-ins standing in. ./index.js is the browser entry that adds the
// real ../vendor.js. See index.js for provenance and licences.
//
// deps = {
//   vendor        the ../vendor.js namespace: stringWidth, wrapAnsi, sliceAnsi,
//                 stripAnsi, YAML, semver, fzstd, and the @noble/hashes exports
//   fs, path      track B's node:fs (sync API) and node:path
//   crypto        track B's node:crypto (createHash / createHmac)
//   zlib          track B's node:zlib (zstdDecompressSync)
//   process       the Worker's process object (env, argv, cwd(), std streams)
//   childProcess  track B's node:child_process (spawn, spawnSync, getCommand)
//   util?         optional node:util; Bun.inspect uses util.inspect if given
//   Buffer?       optional Buffer class for Buffer-typed results (default: global)
//   force?        replace a foreign globalThis.Bun (never one of ours)
// }
// Every dep is read lazily, at call time: a missing one only breaks the Bun
// members that need it, with an error naming the dep.
import { makeText } from './text.js'
import { makeBunHash, makeHashers } from './hash.js'
import { makeSpawn } from './spawn.js'
import { makeFiles } from './file.js'
import { serve, listen, connect } from './net.js'
import { deepEquals } from './deep-equals.js'
import { makeYAML, makeSemver, makeTOML, makeJSONL } from './formats.js'
import { inspect } from './inspect.js'
import { sleepSync, sleep, nanoseconds, peek, gc, generateHeapSnapshot, Terminal, Transpiler, unsafe } from './misc.js'
import { readableStreamHelpers } from './streams.js'
import { makeAnt } from './ant.js'
import { asBuffer, toBytes } from './bytes.js'

/** Marks a Bun object as ours, so installBun can recognise it again. */
export const BUN_MARK = Symbol.for('claude-code-web.bun-polyfill')

// The FreeBSD port's choice: a plausible Bun release that is not the
// Anthropic fork's own (1.4.x), so nothing mistakes this for the native
// runtime. The 2.1.311 bundle only checks that Bun.version exists.
export const BUN_VERSION = '1.2.0'
export const BUN_REVISION = 'claude-code-web-browser-polyfill'

export function createBun(deps = {}) {
  const text = makeText(deps.vendor)
  const files = makeFiles(deps)
  const procs = makeSpawn(deps)
  const proc = () => deps.process ?? globalThis.process
  const toBuffer = (u8) => asBuffer(u8, deps.Buffer ?? globalThis.Buffer)

  // Bun.zstdDecompressSync(data) -> Buffer. The bundle stores its skills and
  // docs as .zst assets and calls .toString('utf8') on the result.
  function zstdDecompressSync(data) {
    const input = toBytes(data)
    if (typeof deps.zlib?.zstdDecompressSync === 'function') return toBuffer(toBytes(deps.zlib.zstdDecompressSync(input)))
    if (typeof deps.vendor?.fzstd?.decompress !== 'function') throw new Error('Bun.zstdDecompressSync: needs deps.zlib or the vendored fzstd')
    return toBuffer(deps.vendor.fzstd.decompress(input))
  }

  let bunInspect = inspect
  if (typeof deps.util?.inspect === 'function') {
    // console.log semantics: a top-level string is printed as-is
    bunInspect = (value, options) => (typeof value === 'string' ? value : deps.util.inspect(value, options))
    bunInspect.custom = deps.util.inspect.custom ?? inspect.custom
  }

  const bun = {
    version: BUN_VERSION,
    revision: BUN_REVISION,
    get env() { return proc()?.env ?? {} },
    get argv() { return proc()?.argv ?? [] },
    // absolute path of the entry script (Bun fills this in before user code runs)
    get main() {
      const p = proc()
      const a = p?.argv?.[1]
      if (!a) return undefined
      return a.startsWith('/') || !deps.path ? a : deps.path.resolve(p.cwd?.() ?? '/', a)
    },
    isStandaloneExecutable: false,
    embeddedFiles: [],

    // text
    stringWidth: text.stringWidth,
    stripANSI: text.stripANSI,
    wrapAnsi: text.wrapAnsi,
    sliceAnsi: text.sliceAnsi,

    // time, promises, memory, values
    sleepSync,
    sleep,
    nanoseconds,
    peek,
    gc,
    generateHeapSnapshot,
    deepEquals,
    inspect: bunInspect,

    // hashing
    hash: makeBunHash(),
    ...makeHashers(deps),

    // processes
    which: procs.which,
    spawn: procs.spawn,
    spawnSync: procs.spawnSync,

    // files and streams
    file: files.file,
    write: files.write,
    stdin: files.stdin,
    stdout: files.stdout,
    stderr: files.stderr,
    ...readableStreamHelpers,

    // network (inert)
    serve,
    listen,
    connect,

    // data formats
    semver: makeSemver(deps.vendor),
    YAML: makeYAML(deps.vendor),
    TOML: makeTOML(),
    JSONL: makeJSONL(),

    // compression
    zstdDecompressSync,
    zstdDecompress: async (data) => zstdDecompressSync(data),

    // stubs
    Transpiler,
    Terminal,
    unsafe,
    ant: makeAnt(text.stringWidth),
  }
  Object.defineProperty(bun, BUN_MARK, { value: true })
  return bun
}

/**
 * Install `Bun` on `target` (the Worker's globalThis) and return it.
 * Idempotent: a second call returns the Bun already installed and ignores its
 * deps. A Bun that is not ours (a real runtime) is left alone unless
 * deps.force is set.
 */
export function installBun(target = globalThis, deps = {}) {
  const existing = target.Bun
  if (existing && (existing[BUN_MARK] || !deps.force)) return existing
  const bun = createBun(deps)
  Object.defineProperty(target, 'Bun', { value: bun, writable: true, configurable: true, enumerable: false })
  return bun
}
