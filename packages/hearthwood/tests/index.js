// Entry point that makes `node --test tests/` work on Node 22, where a directory
// argument is resolved as a module (-> this index.js). It imports every
// tests/*.test.mjs in name order so all suites run in one process.
// Run a single suite directly with: node --test tests/<area>.test.mjs
import { readdirSync } from 'node:fs'

const dir = new URL('./', import.meta.url)
for (const f of readdirSync(dir).filter((n) => n.endsWith('.test.mjs')).sort()) {
  await import(new URL(f, dir).href)
}
