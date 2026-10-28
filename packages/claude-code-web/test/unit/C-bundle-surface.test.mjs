// Track C: every Bun member the extracted 2.1.311 tree references must exist
// on our Bun, unless it is on the list of members the bundle only reaches
// behind a typeof / ?. / try guard and that we leave absent on purpose.
// Reads the research scratchpad's extracted tree as data (grep only);
// skips when it is not there.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { vendor, SCRATCH_RESEARCH } from './C-support.mjs'
import { createBun } from '../../src/runtime/bun/install.js'

const TREE = path.join(SCRATCH_RESEARCH, 'spike-E', 'extract-unhare', 'root')

// Absent by design; each is guarded at every call site in 2.1.311.
const ABSENT = new Set([
  'Image', // typeof Bun.Image !== "function" -> "This runtime has no Bun.Image"
  'FetchSession', // `if (!FetchSession) return`
  'WebView', // `"WebView" in Bun`
  'ant.posixFsAt', 'ant.loginTty', 'ant.ttyName', // ?. / try
  'ant.windowsProcessList', 'ant.windowsFolderSecurity', 'ant.windowsProcessCreationTime', 'ant.windowsSandboxDeniesArg',
])

function* jsFiles(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) yield* jsFiles(p)
    else if (e.name.endsWith('.js') || e.name === 'cli') yield p
  }
}

test('our Bun covers every member the 2.1.311 bundle references', { skip: !fs.existsSync(TREE) && `scratchpad artifact missing: ${TREE}` }, () => {
  const refs = new Map() // "a" or "a.b" -> count
  const re = /\bBun(?:\?)?\.([A-Za-z_$][\w$]*)(?:(?:\?)?\.([A-Za-z_$][\w$]*))?/g
  for (const file of jsFiles(TREE)) {
    const src = fs.readFileSync(file, 'latin1')
    if (!src.includes('Bun')) continue
    for (const m of src.matchAll(re)) {
      // someObject.Bun.x is not the global, but globalThis.Bun.x is
      if (src[m.index - 1] === '.' && !/globalThis\??\.$/.test(src.slice(m.index - 12, m.index))) continue
      const key = m[2] && !/^(toString|then)$/.test(m[2]) ? `${m[1]}.${m[2]}` : m[1]
      refs.set(key, (refs.get(key) ?? 0) + 1)
    }
  }
  assert.ok(refs.size > 30, `found ${refs.size} distinct references`)

  const Bun = createBun({ vendor })
  const missing = []
  for (const key of refs.keys()) {
    const [a, b] = key.split('.')
    if (ABSENT.has(key) || ABSENT.has(a)) continue
    const top = Bun[a]
    // members of builtin function objects (e.g. Bun.hash.call) are fine
    const ok = top !== undefined && (b === undefined || top[b] !== undefined || (typeof top === 'function' && b in Function.prototype))
    if (!ok) missing.push(key)
  }
  assert.deepEqual(missing, [], `referenced but not provided: ${missing.join(', ')}`)

  // and the absent list is still accurate: everything on it is referenced
  for (const key of ABSENT) assert.ok(refs.has(key) || [...refs.keys()].some((k) => k.startsWith(`${key}.`)), `${key} is no longer referenced; drop it from ABSENT`)
})
