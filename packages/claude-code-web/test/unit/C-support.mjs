// Track C test support (not itself a test file).
//
// src/runtime/bun/index.js imports ../vendor.js, which only exists in a built
// runtime directory. The unit tests load src/runtime/bun/install.js instead
// and hand it `vendor`: the same npm packages, imported straight from
// node_modules, under the export names src/runtime/vendor-entry.js gives them.
// Node's own built-ins stand in for the track-B shims (same API shape).
import stringWidth from 'string-width'
import wrapAnsi from 'wrap-ansi'
import sliceAnsi from 'slice-ansi'
import stripAnsi from 'strip-ansi'
import * as YAML from 'yaml'
import semver from 'semver'
import * as fzstd from 'fzstd'
import * as fflate from 'fflate'
import { sha224, sha256, sha384, sha512, sha512_256 } from '@noble/hashes/sha2'
import { md5, sha1, ripemd160 } from '@noble/hashes/legacy'
import { sha3_256, sha3_512 } from '@noble/hashes/sha3'
import { hmac } from '@noble/hashes/hmac'
import { EventEmitter } from 'node:events'
import { PassThrough } from 'node:stream'
import { RESEARCH_DIR } from '../research.mjs'

export const vendor = {
  stringWidth, wrapAnsi, sliceAnsi, stripAnsi, YAML, semver, fzstd, fflate,
  sha224, sha256, sha384, sha512, sha512_256, md5, sha1, ripemd160, sha3_256, sha3_512, hmac,
}

export const SCRATCH_RESEARCH = RESEARCH_DIR // CC_RESEARCH_DIR, see ../research.mjs

/** A process stand-in with its own env/argv/cwd and stream std*. */
export function fakeProcess({ env = { HOME: '/home/user', PATH: '/usr/bin' }, argv = ['/node', '/app/cli', '-p'], cwd = '/home/user/workspace' } = {}) {
  return {
    env,
    argv,
    cwd: () => cwd,
    stdin: new PassThrough(),
    stdout: new PassThrough(),
    stderr: new PassThrough(),
  }
}

/**
 * A command-table child_process in the shape of track B's shim:
 * commands[name] = ({ args, input }) => ({ status, stdout, stderr }).
 */
export function fakeChildProcess(commands) {
  const calls = []
  let pid = 4000
  const lookup = (file) => commands[String(file).split('/').pop()]
  return {
    calls,
    getCommand: lookup,
    spawn(file, args, options) {
      calls.push({ kind: 'spawn', file, args, options })
      const child = new EventEmitter()
      child.pid = ++pid
      child.stdin = options.stdio?.[0] === 'pipe' ? new PassThrough() : null
      child.stdout = options.stdio?.[1] === 'pipe' ? new PassThrough() : null
      child.stderr = options.stdio?.[2] === 'pipe' ? new PassThrough() : null
      child.kill = (sig) => { setImmediate(() => { child.emit('exit', null, sig ?? 'SIGTERM'); child.emit('close', null, sig ?? 'SIGTERM') }); return true }
      const handler = lookup(file)
      const input = []
      if (child.stdin) child.stdin.on('data', (c) => input.push(c))
      const run = async () => {
        if (!handler) {
          const err = Object.assign(new Error(`spawn ${file} ENOENT`), { code: 'ENOENT' })
          child.emit('error', err)
          return
        }
        if (child.stdin && !child.stdin.writableFinished) await new Promise((r) => child.stdin.once('finish', r))
        const r = await handler({ args, input: Buffer.concat(input), options })
        if (r.hang) return
        if (child.stdout) child.stdout.end(r.stdout ?? '')
        if (child.stderr) child.stderr.end(r.stderr ?? '')
        child.emit('exit', r.status ?? 0, null)
        child.emit('close', r.status ?? 0, null)
      }
      setImmediate(run)
      return child
    },
    spawnSync(file, args, options) {
      calls.push({ kind: 'spawnSync', file, args, options })
      const handler = lookup(file)
      if (!handler) return { pid: 0, status: 127, signal: null, stdout: null, stderr: null, error: Object.assign(new Error(`spawnSync ${file} ENOENT`), { code: 'ENOENT' }) }
      const r = handler({ args, input: options.input ? Buffer.from(options.input) : Buffer.alloc(0), options })
      const enc = (v) => (options.encoding && options.encoding !== 'buffer' ? String(v ?? '') : Buffer.from(v ?? ''))
      return { pid: ++pid, status: r.status ?? 0, signal: null, stdout: enc(r.stdout), stderr: enc(r.stderr) }
    },
  }
}
