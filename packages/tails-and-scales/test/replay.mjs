// Replay one AI-vs-AI battle in the browser and print its trace.
//
//   node test/replay.mjs <seed> <dice> [distDir]  > trace.txt
//
// Uses the built app (npm run build first) in ?debug&fast mode: nothing is
// drawn and game time runs effectively instantly, so a full five-round battle
// takes well under a minute. `seed` picks the battlefield, `dice` seeds the
// logic RNG (rng.js); the same pair always produces the same trace.
import { chromium } from 'playwright'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { startStaticServer } from '../../../scripts/static-server.mjs'

const here = dirname(fileURLToPath(import.meta.url))

export async function replay(seed, dice, dist) {
  const { url, close } = await startStaticServer(dist)
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  })
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
    const errors = []
    page.on('pageerror', (e) => errors.push(e.message))
    await page.goto(`${url}/?debug&fast&seed=${seed}&dice=${dice}`)
    await page.waitForFunction(() => window.__ts, null, { timeout: 60000 })
    await page.click('#watch')
    await page.waitForFunction(() => window.__ts.S.stage === 'over', null, { timeout: 900000, polling: 1000 })
    const trace = await page.evaluate(() => window.__ts.trace.slice())
    return { trace, errors }
  } finally {
    await browser.close()
    close()
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [, , seed, dice, dist = join(here, '..', 'dist')] = process.argv
  if (!seed || !dice) {
    console.error('usage: node test/replay.mjs <seed> <dice> [distDir]')
    process.exit(2)
  }
  const { trace, errors } = await replay(seed, dice, dist)
  process.stdout.write(trace.join('\n') + '\n')
  if (errors.length) {
    console.error(errors.join('\n'))
    process.exit(1)
  }
}
