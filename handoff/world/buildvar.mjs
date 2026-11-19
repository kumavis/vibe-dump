// buildvar.mjs <level A|B|C> <outDir>: the package as of that slice, built
import { buildApp } from '/home/user/vibe-dump-wt/world/packages/tails-and-scales/sim/lib.mjs'
import { cpSync, rmSync, mkdirSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
const [level, out] = process.argv.slice(2)
const PKG = '/home/user/vibe-dump-wt/world/packages/tails-and-scales'
const src = `/tmp/claude-0/-home-user-vibe-dump/c8117bd8-3b62-5359-9239-be458d8a067b/scratchpad/world/src${level}`
rmSync(src, { recursive: true, force: true })
mkdirSync(src, { recursive: true })
cpSync(PKG, src, { recursive: true, filter: (p) => !/\/(node_modules|dist)(\/|$)/.test(p.slice(PKG.length)) })
if (level !== 'C') execFileSync('python3', ['/tmp/claude-0/-home-user-vibe-dump/c8117bd8-3b62-5359-9239-be458d8a067b/scratchpad/world/strip.py', src, level], { stdio: 'inherit' })
await buildApp(src, out)
console.log('built', level, out)
