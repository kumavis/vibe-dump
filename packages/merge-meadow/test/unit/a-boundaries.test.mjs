import test from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { lint, checkFile, importsOf, lex } from '../../scripts/boundaries.mjs'

const script = fileURLToPath(new URL('../../scripts/boundaries.mjs', import.meta.url))

test('boundaries: track A\'s own directories are clean (strict)', () => {
  const r = lint(['src/doc', 'src/core', 'src/sim', 'src/scripts'])
  assert.ok(r.files >= 25)
  assert.deepEqual(r.errors, [])
  assert.deepEqual(r.warnings, [])
  assert.doesNotThrow(() => execFileSync(process.execPath, [script, '--strict', 'src/doc', 'src/core', 'src/sim', 'src/scripts']))
})

test('boundaries: violations are caught', () => {
  const errs = (rel, src) => checkFile(rel, src).errors
  assert.equal(errs('src/core/x.js', "import * as THREE from 'three'").length, 1)
  assert.equal(errs('src/render/x.js', "import * as THREE from 'three'").length, 0)
  assert.equal(errs('src/editor/x.js', "import { Vector3 } from 'three/src/math/Vector3.js'").length, 1)
  assert.equal(errs('src/sim/x.js', "import { Repo } from '@automerge/automerge-repo'").length, 1)
  assert.equal(errs('src/sim/x.js', "import { Counter } from '@automerge/automerge/slim'").length, 1, 'only src/doc touches automerge in the pure core')
  assert.equal(errs('src/net/x.js', "import { Repo } from '@automerge/automerge-repo'").length, 0)
  assert.equal(errs('src/doc/x.js', "import * as A from '@automerge/automerge'").length, 1, 'src/doc may import only the slim entry')
  assert.equal(errs('src/doc/x.js', "import { Counter } from '@automerge/automerge/slim'").length, 0)
  assert.equal(errs('src/scripts/x.js', "const m = await import('../render/scene.js')").length, 1, 'no relative reach into render')
  assert.equal(errs('src/core/x.js', 'export const w = () => window.innerWidth').length, 1)
  assert.equal(errs('src/core/x.js', 'requestAnimationFrame(loop)').length, 1)
  assert.equal(errs('src/core/x.js', 'const o = { document: 1 }; o.document; // document\n/* window */ const s = "window"').length, 1, 'comments, strings and properties do not count; a shorthand key does')
  assert.equal(errs('src/sim/x.js', 'localStorage.setItem("a", 1)').length, 1)
  assert.equal(errs('src/scripts/safe-mode.js', 'globalThis.localStorage').length, 0)
  const w = checkFile('src/editor/x.js', "handle.change(d => {}); h.on('change', f); new Function('x'); a.constructor.name").warnings
  assert.equal(w.length, 4)
  assert.equal(checkFile('src/doc/ops.js', 'handle.change(d => {})').warnings.length, 0)
})

test('boundaries: the lexer and import scanner', () => {
  assert.deepEqual(importsOf(lex("import a from 'a'\nimport 'b'\nexport { c } from \"c\"\nconst d = import('d')\n// import e from 'e'\nconst s = \"import f from 'f'\"").code).sort(), ['a', 'b', 'c', 'd'])
  const { bare } = lex("const r = /['\"]/g; const t = `window ${x}`; x = a / b / c")
  assert.ok(!bare.includes('window'))
  assert.ok(bare.includes('a / b / c'))
})
