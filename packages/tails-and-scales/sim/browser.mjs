// Replay one battle in Chromium and print its trace (the runner itself is
// sim/chromium.mjs; `node sim/parity.mjs --browser` runs the whole corpus).
//
//   node sim/browser.mjs <seed> <dice> [distDir]          one AI battle
//   node sim/browser.mjs --log <human.json> [distDir]     one human log
//
// distDir defaults to this package's dist/: build first (npx vite build
// here). Set CHROMIUM_PATH to the pre-installed Chromium if Playwright's own
// isn't installed.
import { readFileSync } from 'node:fs'
import { parseArgs } from 'node:util'
import { runBrowser, DIST } from './chromium.mjs'

const { values, positionals } = parseArgs({ allowPositionals: true, options: { log: { type: 'string' } } })
let job, dist
if (values.log) {
  const h = JSON.parse(readFileSync(values.log, 'utf8'))
  job = { setup: h.setup, entries: h.entries }
  dist = positionals[0]
} else {
  if (positionals.length < 2) {
    console.error('usage: node sim/browser.mjs <seed> <dice> [distDir] | --log <human.json> [distDir]')
    process.exit(2)
  }
  job = { seed: Number(positionals[0]), dice: Number(positionals[1]) }
  dist = positionals[2]
}
const [r] = await runBrowser([job], { dist: dist ?? DIST, parallel: 1 })
process.stdout.write(r.trace.join('\n') + '\n')
if (r.error) {
  console.error(r.error)
  process.exit(1)
}
