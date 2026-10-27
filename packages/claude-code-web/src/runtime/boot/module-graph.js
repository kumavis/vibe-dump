// Module graph of the extracted tree, for boot.js's pre-import order.
//
// `import.meta.require(p)` (rewritten to `globalThis.__bunRequire(p)`) is a
// *synchronous* import. A browser can only import asynchronously, so boot.js
// imports every require target ahead of time and __bunRequire reads the
// result from a registry. Most require sites sit inside function bodies and
// run long after boot; those may form cycles and need no particular order.
// A site that runs while its module is being evaluated ("eager": at the
// module's top level, outside any function) needs its target evaluated first.
//
// eagerSites() tells the two apart with a small scanner for minified ES
// modules: it tracks strings, template literals, comments and regex literals
// so that braces inside them do not count, and reports a site as eager when
// it is outside every brace/paren/bracket and not the body of an arrow
// function (`=>` right before it). Braces of top-level blocks (`if (x) {}`)
// count as nesting, which errs on the lazy side; boot.js reports any miss.

/** Bump when the ordering logic changes: cached boot graphs from older versions are recomputed. */
export const GRAPH_VERSION = 1

const ID = /[A-Za-z0-9_$\u0080-\uffff]/

// Keywords after which a `/` starts a regex literal rather than a division.
const REGEX_AFTER_WORD = new Set(['return', 'typeof', 'instanceof', 'in', 'of', 'new', 'delete', 'void', 'throw', 'case', 'do', 'else', 'yield', 'await'])

/**
 * Offsets (of `needle`) at module top level in `src`.
 * @param {string} src
 * @param {string} needle  e.g. '__bunRequire("'
 * @returns {Set<number>}
 */
export function eagerSites (src, needle) {
  const hits = []
  for (let i = src.indexOf(needle); i !== -1; i = src.indexOf(needle, i + 1)) hits.push(i)
  const eager = new Set()
  if (!hits.length) return eager
  let h = 0
  let depth = 0
  const tpl = [] // depth at which each open `${` of a template literal started
  let last = '' // last significant char outside strings/comments (for regex detection)
  let lastWord = ''
  const n = src.length
  for (let i = 0; i < n && h < hits.length; i++) {
    while (h < hits.length && hits[h] < i) h++
    if (h < hits.length && hits[h] === i) {
      if (depth === 0 && !src.slice(Math.max(0, i - 24), i).replace(/\s+$/, '').match(/=>\s*(?:globalThis\.)?$/)) eager.add(i)
      h++
    }
    const c = src.charCodeAt(i)
    switch (c) {
      case 0x2f: { // '/'
        const d = src.charCodeAt(i + 1)
        if (d === 0x2f) { const e = src.indexOf('\n', i); i = e === -1 ? n : e; continue }
        if (d === 0x2a) { const e = src.indexOf('*/', i + 2); i = e === -1 ? n : e + 1; continue }
        const isRegex = last === '' || '(,=:[!&|?{};+-*%<>~^'.includes(last) || REGEX_AFTER_WORD.has(lastWord)
        if (isRegex) { i = skipRegex(src, i); last = 'a'; lastWord = ''; continue }
        last = '/'
        lastWord = ''
        continue
      }
      case 0x22: case 0x27: { // " '
        i = skipString(src, i, c)
        last = 'a'; lastWord = ''
        continue
      }
      case 0x60: { // `
        i = skipTemplate(src, i, tpl, depth)
        if (tpl.length && tpl[tpl.length - 1] === -1) { tpl.pop(); tpl.push(depth); depth++ } // entered ${
        last = 'a'; lastWord = ''
        continue
      }
      case 0x7b: case 0x28: case 0x5b: // { ( [
        depth++
        last = String.fromCharCode(c); lastWord = ''
        continue
      case 0x7d: { // }
        if (tpl.length && tpl[tpl.length - 1] === depth - 1) {
          // end of a ${...} inside a template literal: continue the template
          tpl.pop()
          depth--
          i = skipTemplate(src, i, tpl, depth)
          if (tpl.length && tpl[tpl.length - 1] === -1) { tpl.pop(); tpl.push(depth); depth++ }
          last = 'a'; lastWord = ''
          continue
        }
        depth--
        last = '}'; lastWord = ''
        continue
      }
      case 0x29: case 0x5d: // ) ]
        depth--
        last = ')'; lastWord = ''
        continue
      case 0x20: case 0x0a: case 0x0d: case 0x09:
        continue
      default: {
        const ch = src[i]
        if (ID.test(ch)) {
          let j = i
          while (j < n && ID.test(src[j])) j++
          // a hit may start inside this identifier run (e.g. globalThis.__bunRequire)
          lastWord = src.slice(i, j)
          last = 'a'
          // step back one so the hit check at the loop head sees positions inside
          const next = hits[h]
          if (next !== undefined && next > i && next < j) { i = next - 1; continue }
          i = j - 1
          continue
        }
        last = ch
        lastWord = ''
      }
    }
  }
  return eager
}

function skipString (src, i, quote) {
  for (let j = i + 1; j < src.length; j++) {
    const c = src.charCodeAt(j)
    if (c === 0x5c) { j++; continue }
    if (c === quote) return j
  }
  return src.length
}

function skipRegex (src, i) {
  let inClass = false
  for (let j = i + 1; j < src.length; j++) {
    const c = src.charCodeAt(j)
    if (c === 0x5c) { j++; continue }
    if (c === 0x5b) inClass = true
    else if (c === 0x5d) inClass = false
    else if (c === 0x2f && !inClass) {
      while (j + 1 < src.length && /[a-z]/.test(src[j + 1])) j++
      return j
    }
    else if (c === 0x0a) return j // not a regex after all; give up on this line
  }
  return src.length
}

// Skip a template literal from its opening backtick (or from the `}` that
// closes a substitution). Returns the index of the closing backtick, or of the
// `{` of a `${`, in which case it pushes -1 on `tpl` for the caller to fix up.
function skipTemplate (src, i, tpl) {
  for (let j = i + 1; j < src.length; j++) {
    const c = src.charCodeAt(j)
    if (c === 0x5c) { j++; continue }
    if (c === 0x60) return j
    if (c === 0x24 && src.charCodeAt(j + 1) === 0x7b) { tpl.push(-1); return j + 1 }
  }
  return src.length
}

/**
 * Pre-import order for boot.js.
 * @param {Map<string, Uint8Array|string>} files  VFS path -> source
 * @param {string} appPath  e.g. '/vibe-dump/claude-code-web/vfs/app/'
 * @returns {{order: string[], targets: Set<string>, requireEdges: Map<string, Array<{target: string, eager: boolean}>>,
 *            cyclic: Array<[string, string]>, dropped: Array<[string, string]>}}
 *   order: every __bunRequire target, every module containing a require and
 *   every static import of the entry, each after the modules it imports and
 *   the modules it requires, except for `cyclic` (top-level requires that
 *   cannot be satisfied) and `dropped` (in-function requires that would
 *   close a cycle) pairs [requirer, target].
 */
export function preImportOrder (files, appPath) {
  const esc = appPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const staticRe = new RegExp(`(?:from|import)\\s*"(${esc}[^"]+)"`, 'g')
  const needle = '__bunRequire("'
  const dec = new TextDecoder()
  const staticEdges = new Map()
  const requireEdges = new Map() // requirer -> [{target, eager}]
  const targets = new Set()
  const entry = `${appPath}cli`
  for (const [p, data] of files) {
    if (!(p.endsWith('.js') || p === entry)) continue
    const src = typeof data === 'string' ? data : dec.decode(data)
    const out = []
    for (const m of src.matchAll(staticRe)) out.push(m[1])
    staticEdges.set(p, out)
    if (!src.includes(needle)) continue
    const eager = eagerSites(src, needle)
    const mine = new Map()
    for (let i = src.indexOf(needle); i !== -1; i = src.indexOf(needle, i + 1)) {
      const target = src.slice(i + needle.length, src.indexOf('"', i + needle.length))
      if (!target.startsWith(appPath)) continue
      targets.add(target)
      mine.set(target, mine.get(target) || eager.has(i))
    }
    requireEdges.set(p, [...mine].map(([target, isEager]) => ({ target, eager: isEager })))
  }

  // Every require is an ordering edge (a require inside a function can still
  // run at module evaluation, when the module calls that function at its top
  // level). Edges that close a cycle cannot all be honoured; inside each
  // strongly connected component, drop the requires that sit in function
  // bodies, and the top-level ones whose target statically imports the
  // requirer (no order satisfies those: forwarding proxies answer them).
  const all = (p) => [...(staticEdges.get(p) || []), ...(requireEdges.get(p) || []).map((e) => e.target)]
  const scc = components([...staticEdges.keys()], (p) => all(p).filter((q) => staticEdges.has(q)))
  const reaches = (from, to) => {
    const seen = new Set([from])
    const queue = [from]
    while (queue.length) {
      const x = queue.pop()
      if (x === to) return true
      for (const y of staticEdges.get(x) || []) if (!seen.has(y)) { seen.add(y); queue.push(y) }
    }
    return false
  }
  const cyclic = []
  const dropped = []
  const edges = new Map()
  for (const [p, out] of staticEdges) {
    const req = []
    for (const { target, eager } of requireEdges.get(p) || []) {
      if (scc.get(target) !== scc.get(p)) { req.push(target); continue }
      if (!eager) { dropped.push([p, target]); continue }
      if (reaches(target, p)) { cyclic.push([p, target]); continue }
      req.push(target)
    }
    // required modules first: they must be evaluated before p's own static
    // graph can come round to p
    edges.set(p, [...req, ...out])
  }

  const wanted = new Set([...targets, ...requireEdges.keys(), ...(staticEdges.get(entry) || [])])
  wanted.delete(entry)
  const order = []
  const state = new Map() // 1: on the DFS stack, 2: finished
  const visit = (root) => {
    const stack = [[root, 0]]
    state.set(root, 1)
    while (stack.length) {
      const top = stack[stack.length - 1]
      const next = (edges.get(top[0]) || [])[top[1]++]
      if (next === undefined) {
        stack.pop()
        state.set(top[0], 2)
        if (wanted.has(top[0])) order.push(top[0])
      } else if (!state.has(next) && edges.has(next)) {
        state.set(next, 1)
        stack.push([next, 0])
      }
    }
  }
  for (const p of staticEdges.get(entry) || []) if (!state.has(p)) visit(p)
  for (const p of [...wanted].sort()) if (!state.has(p)) visit(p)
  return { order, targets, requireEdges, cyclic, dropped }
}

// Tarjan's strongly connected components, iteratively. Returns node -> component id.
function components (nodes, next) {
  const index = new Map()
  const low = new Map()
  const onStack = new Set()
  const stack = []
  const comp = new Map()
  let counter = 0
  let compId = 0
  for (const root of nodes) {
    if (index.has(root)) continue
    const work = [[root, next(root), 0]]
    index.set(root, counter); low.set(root, counter); counter++
    stack.push(root); onStack.add(root)
    while (work.length) {
      const frame = work[work.length - 1]
      const [v, out] = frame
      if (frame[2] < out.length) {
        const w = out[frame[2]++]
        if (!index.has(w)) {
          index.set(w, counter); low.set(w, counter); counter++
          stack.push(w); onStack.add(w)
          work.push([w, next(w), 0])
        } else if (onStack.has(w)) {
          low.set(v, Math.min(low.get(v), index.get(w)))
        }
      } else {
        work.pop()
        if (work.length) { const u = work[work.length - 1][0]; low.set(u, Math.min(low.get(u), low.get(v))) }
        if (low.get(v) === index.get(v)) {
          let w
          do { w = stack.pop(); onStack.delete(w); comp.set(w, compId) } while (w !== v)
          compId++
        }
      }
    }
  }
  return comp
}

/**
 * The part of preImportOrder's result boot.js needs, as plain JSON, for the
 * extractor to store in the manifest (so a boot does not have to read and scan
 * 50 MB of chunks to recompute it).
 */
export function bootGraph (files, appPath) {
  const { order, targets, cyclic, dropped } = preImportOrder(files, appPath)
  return { version: GRAPH_VERSION, appPath, order, targets: [...targets].sort(), cyclic, dropped }
}
