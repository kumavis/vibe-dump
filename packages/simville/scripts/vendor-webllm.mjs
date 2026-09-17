// Vendors WebLLM into public/ as a single ES module, minified.
//
// Why not just `import '@mlc-ai/web-llm'` and let Vite bundle it? Because the
// library is needed in two places — the main thread (to drive the engine) and
// the worker (to run it) — and Vite builds a worker as its own rollup graph, so
// bundling gets you two near-identical 6 MB chunks in a dist/ that is committed
// to the repository. Importing one runtime URL from both sides gets you one.
//
// public/ is copied verbatim by Vite, so this has to run before `vite build`;
// the package's build script chains them. The output is generated, gitignored,
// and reproducible from node_modules — the committed artefact is the copy that
// lands in dist/.

import { build } from 'esbuild'
import { mkdir, stat } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const here = dirname(fileURLToPath(import.meta.url))
const pkgDir = dirname(here)
const outFile = join(pkgDir, 'public', 'vendor', 'web-llm.js')

const entry = require.resolve('@mlc-ai/web-llm')
await mkdir(dirname(outFile), { recursive: true })

await build({
  entryPoints: [entry],
  outfile: outFile,
  bundle: false, // it already ships as one ES module; this is purely a minify
  minify: true,
  format: 'esm',
  target: 'es2022',
  legalComments: 'none',
  logLevel: 'warning',
})

const { size } = await stat(outFile)
const version = require('@mlc-ai/web-llm/package.json').version
console.log(`vendored @mlc-ai/web-llm ${version} → public/vendor/web-llm.js (${(size / 1e6).toFixed(1)} MB)`)
