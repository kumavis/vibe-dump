import { rm } from 'node:fs/promises'
import { glob } from 'node:fs/promises'

await rm(new URL('../dist', import.meta.url), { recursive: true, force: true })

for await (const entry of glob('packages/*/dist')) {
  await rm(entry, { recursive: true, force: true })
}

console.log('Cleaned dist/ and packages/*/dist')
