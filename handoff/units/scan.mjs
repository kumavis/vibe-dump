// find string literals / template quasis carrying an inch mark
import { parseAst } from '/home/user/vibe-dump/node_modules/rollup/dist/parseAst.js'
import fs from 'node:fs'; import path from 'node:path'
const root = process.argv[2]
const files = []
const walkDir = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { if (['dist','baselines','node_modules','proto'].includes(e.name)) continue; const p = path.join(d, e.name); if (e.isDirectory()) walkDir(p); else if (/\.(m?js)$/.test(e.name)) files.push(p) } }
walkDir(root)
// inch mark: a " that follows a digit, a closing interpolation, 'D6', or that starts a quasi following an expression
const MARK = /(\d|D6|\.\d)"|^"/
const out = []
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8')
  let ast; try { ast = parseAst(src) } catch (e) { console.error('PARSE', f, e.message); continue }
  const lines = []; let off = 0; for (const l of src.split('\n')) { lines.push(off); off += l.length + 1 }
  const lineOf = (pos) => { let lo = 0, hi = lines.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (lines[m] <= pos) lo = m; else hi = m - 1 } return lo + 1 }
  const visit = (n, parent) => {
    if (!n || typeof n.type !== 'string') return
    if (n.type === "Literal" && n.regex && /"/.test(n.regex.pattern)) { out.push([f, lineOf(n.start), "re", "/" + n.regex.pattern + "/"]) } else if (n.type === "Literal" && typeof n.value === "string") {
      if (/(\d|D6)"/.test(n.value)) out.push([f, lineOf(n.start), 'lit', n.value])
    } else if (n.type === 'TemplateLiteral') {
      n.quasis.forEach((q, i) => { const v = q.value.cooked ?? q.value.raw; if ((/(\d|D6)"/.test(v)) || (i > 0 && /^"/.test(v))) out.push([f, lineOf(n.start), 'tpl', src.slice(n.start, n.end).slice(0, 200)]) })
    }
    for (const k in n) { if (k === 'start' || k === 'end') continue; const c = n[k]; if (Array.isArray(c)) c.forEach((x) => visit(x, n)); else if (c && typeof c === 'object') visit(c, n) }
  }
  visit(ast)
}
const seen = new Set()
for (const [f, l, k, v] of out) { const key = f + l; if (seen.has(key)) continue; seen.add(key); console.log(`${path.relative(root, f)}:${l}\t${k}\t${v.replace(/\n/g, ' ')}`) }
