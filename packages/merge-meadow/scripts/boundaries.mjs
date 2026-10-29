#!/usr/bin/env node
// Import-boundary lint (ARCHITECTURE §2.8), run by `npm test`:
//   node scripts/boundaries.mjs [--strict] [--json] [dir-or-file ...]
// Errors (exit 1):
//   - src/doc, src/core, src/sim, src/scripts import no `three`, no @automerge/*-repo*,
//     no DOM globals (document, window, requestAnimationFrame); only src/doc may import
//     @automerge/automerge, and only its /slim entry; localStorage only in
//     src/scripts/safe-mode.js; no relative import of render/xr/net/agent/editor/boot
//   - only src/render and src/xr import `three`
//   - only src/net, src/agent and agent/ import @automerge/*-repo*
// Warnings (errors with --strict): handle.change outside src/doc/ops.js (§2.2),
//   .on('change') outside src/doc/watch.js (§2.3), Function()/eval/constructor.name (§2.11)
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, relative, resolve, dirname, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const PURE = ['src/doc', 'src/core', 'src/sim', 'src/scripts']
const THREE_OK = ['src/render', 'src/xr']
const REPO_OK = ['src/net', 'src/agent', 'agent']
const FORBIDDEN_FROM_PURE = ['src/render', 'src/xr', 'src/net', 'src/agent', 'src/editor', 'src/boot', 'agent', 'public']
const DEFAULT_TARGETS = ['src', 'agent', 'public', 'main.js']

const posix = (p) => p.split(sep).join('/')
const under = (rel, dirs) => dirs.some((d) => rel === d || rel.startsWith(d + '/'))

// One pass over the source: `code` has comments removed (strings kept, for
// import specifiers); `bare` also blanks string/template/regex contents.
export function lex (src) {
  let code = ''; let bare = ''
  let i = 0; let prev = ''
  const n = src.length
  const regexOk = () => /[(,=:[!&|?{};+\-*%<>~^]$/.test(prev) || prev === '' || /\b(return|typeof|case|do|else|in|of|new|delete|void|throw|yield|await)$/.test(code.trimEnd())
  while (i < n) {
    const c = src[i]; const d = src[i + 1]
    if (c === '/' && d === '/') { while (i < n && src[i] !== '\n') i++; continue }
    if (c === '/' && d === '*') { const j = src.indexOf('*/', i + 2); const k = j < 0 ? n : j + 2; const nl = src.slice(i, k).replace(/[^\n]/g, ''); code += nl; bare += nl; i = k; continue }
    if (c === '"' || c === "'" || c === '`') {
      let j = i + 1
      while (j < n && src[j] !== c) { if (src[j] === '\\') j++; j++ }
      const s = src.slice(i, j + 1)
      code += s; bare += c + s.slice(1, -1).replace(/[^\n]/g, ' ') + c; i = j + 1; prev = 'x'; continue
    }
    if (c === '/' && regexOk()) {
      let j = i + 1; let cls = false
      while (j < n && (src[j] !== '/' || cls) && src[j] !== '\n') { if (src[j] === '\\') j++; else if (src[j] === '[') cls = true; else if (src[j] === ']') cls = false; j++ }
      const s = src.slice(i, j + 1)
      code += s; bare += '/' + ' '.repeat(Math.max(0, s.length - 2)) + '/'; i = j + 1; prev = 'x'; continue
    }
    code += c; bare += c
    if (!/\s/.test(c)) prev = c
    i++
  }
  return { code, bare }
}

export function importsOf (code) {
  const out = []
  const res = [
    /(?:^|[;\n}])\s*(?:import|export)\s[^;]*?\sfrom\s*(['"])([^'"]+)\1/g,
    /(?:^|[;\n}])\s*import\s*(['"])([^'"]+)\1/g,
    /\bimport\s*\(\s*(['"])([^'"]+)\1\s*\)/g,
  ]
  for (const re of res) for (const m of code.matchAll(re)) out.push(m[2])
  return [...new Set(out)]
}

const lineOf = (text, idx) => text.slice(0, idx).split('\n').length

export function checkFile (rel, src) {
  const errors = []; const warnings = []
  const { code, bare } = lex(src)
  const err = (msg) => errors.push(`${rel}: ${msg}`)
  const warn = (msg) => warnings.push(`${rel}: ${msg}`)
  const pure = under(rel, PURE)
  for (const spec of importsOf(code)) {
    const isThree = spec === 'three' || spec.startsWith('three/')
    const isRepo = /^@automerge\/automerge-repo/.test(spec)
    const isAm = spec === '@automerge/automerge' || spec.startsWith('@automerge/automerge/')
    if (isThree && !under(rel, THREE_OK)) err(`imports ${spec} (only src/render and src/xr may import three)`)
    if (isRepo && !under(rel, REPO_OK)) err(`imports ${spec} (only src/net, src/agent and agent/ may import automerge-repo)`)
    if (pure && isAm && !isRepo) {
      if (!under(rel, ['src/doc'])) err(`imports ${spec} (only src/doc may import automerge in the pure core)`)
      else if (spec !== '@automerge/automerge/slim') err(`imports ${spec} (src/doc may import only @automerge/automerge/slim)`)
    }
    if (pure && spec.startsWith('.')) {
      const target = posix(relative(ROOT, resolve(ROOT, dirname(rel), spec)))
      if (under(target, FORBIDDEN_FROM_PURE)) err(`imports ${spec} -> ${target} (the pure core may not reach into ${target.split('/').slice(0, 2).join('/')})`)
    }
  }
  if (pure) {
    for (const m of bare.matchAll(/(?<![\w$.])(document|window|requestAnimationFrame)\b/g)) err(`uses DOM global \`${m[1]}\` (line ${lineOf(bare, m.index)})`)
    if (rel !== 'src/scripts/safe-mode.js') for (const m of bare.matchAll(/\blocalStorage\b/g)) err(`touches localStorage (line ${lineOf(bare, m.index)}); only src/scripts/safe-mode.js may`)
  }
  if (rel.startsWith('src/') || rel === 'main.js') {
    if (rel !== 'src/doc/ops.js') for (const m of bare.matchAll(/\bhandle\.change\s*\(/g)) warn(`handle.change outside src/doc/ops.js (line ${lineOf(bare, m.index)}): one write path (§2.2)`)
    // string contents matter here, so this one scans `code` (comments removed, strings kept)
    if (rel !== 'src/doc/watch.js') for (const m of code.matchAll(/\.on\(\s*['"]change['"]/g)) warn(`subscribes to 'change' directly (line ${lineOf(code, m.index)}): use watch() (§2.3)`)
    for (const m of bare.matchAll(/(?<![\w$.])(?:new\s+)?Function\s*\(|(?<![\w$.])eval\s*\(/g)) warn(`Function()/eval (line ${lineOf(bare, m.index)}): not lockdown-safe (§2.11)`)
    for (const m of bare.matchAll(/\.constructor\.name\b/g)) warn(`constructor.name (line ${lineOf(bare, m.index)}): does not survive minification (§2.11)`)
  }
  return { errors, warnings }
}

function walk (abs, out) {
  if (!existsSync(abs)) return out
  const st = statSync(abs)
  if (st.isFile()) { if (/\.(m?js)$/.test(abs)) out.push(abs); return out }
  for (const name of readdirSync(abs).sort()) {
    if (name === 'node_modules' || name === 'dist' || name.startsWith('.')) continue
    walk(join(abs, name), out)
  }
  return out
}

export function lint (targets = DEFAULT_TARGETS) {
  const files = []
  for (const t of targets) walk(resolve(ROOT, t), files)
  const errors = []; const warnings = []
  for (const abs of files) {
    const rel = posix(relative(ROOT, abs))
    const r = checkFile(rel, readFileSync(abs, 'utf8'))
    errors.push(...r.errors); warnings.push(...r.warnings)
  }
  return { files: files.length, errors, warnings }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2)
  const strict = args.includes('--strict'); const json = args.includes('--json')
  const targets = args.filter((a) => !a.startsWith('--'))
  const r = lint(targets.length ? targets : DEFAULT_TARGETS)
  if (json) console.log(JSON.stringify(r, null, 2))
  else {
    for (const e of r.errors) console.error(`error   ${e}`)
    for (const w of r.warnings) console.error(`warning ${w}`)
    console.log(`boundaries: ${r.files} files, ${r.errors.length} errors, ${r.warnings.length} warnings`)
  }
  process.exit(r.errors.length || (strict && r.warnings.length) ? 1 : 0)
}
