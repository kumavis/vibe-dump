// Which code to run: the package directory for a git ref, unpacked once with
// `git archive` into the OS temp dir, or the working tree for 'WORKTREE'.
import { readFileSync, existsSync, mkdirSync, renameSync, rmSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

export const PKG = fileURLToPath(new URL('../../', import.meta.url))
const SUB = 'packages/tails-and-scales'
const git = (...a) => execFileSync('git', a, { cwd: PKG, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim()

const pinLines = () => readFileSync(new URL('./PIN', import.meta.url), 'utf8').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'))

// The PIN: the commit whose code produced the committed hashes. WORKTREE is
// only right before the hooks commit lands; afterwards it would quietly make
// the "frozen" references follow the working tree, so refuse it.
export function readPin() {
  const pin = pinLines().find((l) => !l.startsWith('hooks '))
  if (pin === 'WORKTREE' && !process.env.PIN_WORKTREE_OK) {
    let committed = false
    try {
      committed = git('show', 'HEAD:packages/tails-and-scales/main.js').includes('get phaseResolve()')
    } catch {}
    if (committed) {
      throw new Error('sim/oracle/PIN still says WORKTREE but the ?debug hooks are committed: set both lines to `git log -1 --format=%H -S"get phaseResolve" -- packages/tails-and-scales/main.js` (or PIN_WORKTREE_OK=1 to override)')
    }
  }
  return pin
}

// The commit that added the ?debug input hooks (fixed; the PIN moves on a
// re-record, this never does). Falls back to the PIN.
export function readHooks() {
  return pinLines().find((l) => l.startsWith('hooks '))?.slice(6).trim() ?? readPin()
}

export function codeDir(ref = readPin()) {
  if (ref === 'WORKTREE') return PKG
  let sha
  try {
    sha = git('rev-parse', '--verify', `${ref}^{commit}`)
  } catch {
    throw new Error(`${ref} is not a commit in this clone (a shallow one?): git fetch --unshallow, or git fetch origin ${ref}`)
  }
  const root = join(tmpdir(), 'tails-and-scales-oracle', sha)
  const dir = join(root, SUB)
  if (existsSync(join(dir, 'main.js'))) return dir
  const tmp = `${root}.${process.pid}`
  rmSync(tmp, { recursive: true, force: true })
  mkdirSync(tmp, { recursive: true })
  const top = git('rev-parse', '--show-toplevel')
  execFileSync('git', ['archive', '--format=tar', '-o', join(tmp, 'src.tar'), sha, SUB], { cwd: top })
  execFileSync('tar', ['-xf', 'src.tar'], { cwd: tmp })
  rmSync(join(tmp, 'src.tar'))
  try {
    renameSync(tmp, root)
  } catch {
    rmSync(tmp, { recursive: true, force: true }) // another process unpacked it first
  }
  return dir
}

// The directory a CLI asked for: --dir wins, then --ref, then the default.
export function dirFromArgs(args, fallback = 'WORKTREE') {
  if (args.dir) return args.dir
  return codeDir(args.ref ?? fallback)
}
