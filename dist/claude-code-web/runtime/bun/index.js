// Bun runtime polyfill for running Claude Code's extracted JS in a browser
// Worker (track C of ARCHITECTURE.md). Served as BASE/runtime/bun/index.js;
// boot.js calls installBun(globalThis, deps) after process and the track-B
// node shims exist, and before the first chunk is imported.
//
//   import { installBun } from './bun/index.js'
//   installBun(globalThis, { fs, path, crypto, zlib, process, childProcess })
//
// Files: install.js assembles the object; text.js, hash.js (+ xxhash.js),
// spawn.js, file.js (+ streams.js), net.js, formats.js (+ toml.js, jsonl.js),
// deep-equals.js, inspect.js, misc.js, ant.js (+ cell-segmenter.js).
//
// Provenance and licences
// -----------------------
// * FreeBSD Ports Collection, misc/claude-code (port at Claude Code 2.1.310),
//   files/bun-polyfill.cjs (the Node polyfill that booted 2.1.311 through a
//   full agentic turn in our spike). BSD-2-Clause, per the ports tree's
//   COPYRIGHT file (text below; the file itself carries no header). We
//   derived from it: which Bun members the bundle needs and how it calls
//   them; delegating stringWidth / wrapAnsi / sliceAnsi / stripANSI / YAML /
//   semver to the npm packages; carrying tabs through wrap-ansi; the
//   SHA256.hash static and Bun.unsafe.setJITPolicy shapes; the four Bun.ant
//   stubs and the reported Bun.version. This is a rewrite for the browser
//   (ESM, injected dependencies, web streams, busy-wait sleepSync, inert
//   networking); no code is copied verbatim, but the design follows that
//   file closely, so its notice is kept here:
//
//     Copyright (C) 1994-2026 The FreeBSD Project.
//
//     Redistribution and use in source and binary forms, with or without
//     modification, are permitted provided that the following conditions
//     are met:
//     1. Redistributions of source code must retain the above copyright
//        notice, this list of conditions and the following disclaimer.
//     2. Redistributions in binary form must reproduce the above copyright
//        notice, this list of conditions and the following disclaimer in the
//        documentation and/or other materials provided with the distribution.
//
//     THIS SOFTWARE IS PROVIDED BY AUTHOR AND CONTRIBUTORS ``AS IS'' AND
//     ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
//     IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
//     ARE DISCLAIMED.  IN NO EVENT SHALL AUTHOR OR CONTRIBUTORS BE LIABLE
//     FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
//     DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
//     OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
//     HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
//     LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
//     OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
//     SUCH DAMAGE.
//
// * clawgod (github.com/0Chencc/clawgod), src/shared/bun-ant-shim.cjs at
//   f9d2dcde3d2977f9015c9a7002b427b8453e8536: GPL-3.0 (the repository's
//   LICENSE; the FreeBSD port's Makefile lists it the same way). Nothing is
//   copied or adapted from it. ./cell-segmenter.js implements the same
//   Bun.ant.CellSegmenter contract independently, from the way the 2.1.311
//   bundle constructs and drives the object.
// * Claude Code 2.1.311 (Anthropic, proprietary): read in the research
//   scratchpad only to list the Bun members it uses and their call shapes.
//   None of its code is reproduced in this directory.
// * xxHash32 / xxHash64 are written from the published xxHash specification.
import * as vendor from '../vendor.js'
import { installBun as install, createBun as create, BUN_MARK, BUN_VERSION } from './install.js'

export { BUN_MARK, BUN_VERSION }
export { CellSegmenter } from './cell-segmenter.js'
export { TERMINAL_UNAVAILABLE } from './misc.js'
export { servers as inertServers } from './net.js'

/** Install globalThis.Bun (idempotent). deps: see install.js. */
export function installBun(target = globalThis, deps = {}) {
  return install(target, { vendor, ...deps })
}

/** Build a Bun object without installing it. */
export function createBun(deps = {}) {
  return create({ vendor, ...deps })
}
