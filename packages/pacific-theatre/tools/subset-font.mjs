// The Japanese face, cut to what the app shows (DATA.md §12, ENGINEERING.md
// §12, FONTS.md): every CJK character in the data's JSON and in the app's own
// strings, as one static weight (400) of Noto Sans JP in woff2, written to
// src/fonts/noto-sans-jp-subset.woff2, which is committed.
//
//   node tools/subset-font.mjs                      public/data/ (and the app's strings)
//   node tools/subset-font.mjs test-data            the fixtures (Stage 0's)
//   node tools/subset-font.mjs <dir> --downloads DIR --out FILE --dry
//
// The face is the Google Fonts TTF of Noto Sans JP 400 (SIL OFL 1.1; the
// Noto project's), whose URL Google's CSS API gives a plain client
// (fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400 answers a
// non-browser with one `truetype` src). It is fetched with curl through
// tools/lib/fetch.mjs into the downloads directory (--downloads, or
// $PACIFIC_THEATRE_DOWNLOADS, or the system's temporary directory), recorded
// in the ledger there, never into the repository. The cut is `subset-font`
// 2.4.0 (harfbuzz's hb-subset), with the layout features the cards need kept.
//
// What it scans: every .json and .geojson under the data directory, and
// index.html, NOTICE.md and every .js under src/ (the boot screen's lines,
// the after-card's headings あなたの出撃 and the rest, the help's 太平洋戦争),
// for the characters in U+3000–30FF (punctuation, kana), U+3400–4DBF and
// U+4E00–9FFF (kanji), U+F900–FAFF and U+FF00–FFEF (full-width forms). It
// prints the count and the file's size; FONTS.md carries the count. The
// integrator runs it again on the final data (ENGINEERING §13, integrate 5).
import { readdirSync, readFileSync, statSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { join, dirname, resolve, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { tmpdir } from 'node:os'
import { Ledger, fetchTo, fetchText } from './lib/fetch.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const opt = (k) => {
  const i = args.indexOf(k)
  return i >= 0 ? args[i + 1] : null
}
const flagValues = new Set(['--downloads', '--out'].map((k) => opt(k)).filter(Boolean))
const dirArg = args.find((a) => !a.startsWith('--') && !flagValues.has(a))
const dataDir = dirArg ? (existsSync(resolve(dirArg)) ? resolve(dirArg) : join(root, dirArg)) : join(root, 'public/data')
const out = opt('--out') ? resolve(opt('--out')) : join(root, 'src/fonts/noto-sans-jp-subset.woff2')
const downloads = resolve(opt('--downloads') || process.env.PACIFIC_THEATRE_DOWNLOADS || join(tmpdir(), 'pacific-theatre-downloads'))
const dry = args.includes('--dry')

const CJK = /[　-ヿ㐀-䶿一-鿿豈-﫿＀-￯]/gu

/** Every file under dir whose name passes `want`. */
function walk(dir, want, acc = []) {
  if (!existsSync(dir)) return acc
  for (const name of readdirSync(dir)) {
    const f = join(dir, name)
    const s = statSync(f)
    if (s.isDirectory()) {
      if (name === 'node_modules' || name === 'dist' || name.startsWith('.')) continue
      walk(f, want, acc)
    } else if (want(name)) acc.push(f)
  }
  return acc
}

if (!existsSync(dataDir)) throw new Error(`no data directory at ${dataDir}`)
const files = [
  ...walk(dataDir, (n) => /\.(geo)?json$/.test(n)),
  join(root, 'index.html'),
  join(root, 'NOTICE.md'),
  ...walk(join(root, 'src'), (n) => n.endsWith('.js')),
]
const chars = new Set()
const perFile = []
for (const f of files) {
  if (!existsSync(f)) continue
  const text = readFileSync(f, 'utf8')
  // (JSON escapes like 古 count too: read through the parser where it is JSON)
  let body = text
  if (/\.(geo)?json$/.test(f)) {
    try {
      body = JSON.stringify(JSON.parse(text), (k, v) => v).replace(/\\u([0-9a-f]{4})/gi, (m, h) => String.fromCharCode(parseInt(h, 16)))
    } catch {
      /* (a file that does not parse is check-data's to report; scan its text) */
    }
  }
  const found = body.match(CJK) || []
  for (const c of found) chars.add(c)
  if (found.length) perFile.push([relative(root, f), new Set(found).size])
}
// U+3000 (the ideographic space) is in every Japanese line; keep it whatever the scan finds
chars.add('　')
const text = [...chars].sort().join('')
console.log(`subset-font: ${chars.size} characters from ${perFile.length} files under ${relative(process.cwd(), dataDir) || '.'} and src/`)
for (const [f, n] of perFile) console.log(`  ${String(n).padStart(4)}  ${f}`)
if (dry) {
  console.log(text)
  process.exit(0)
}

// the face: Google's TTF, through curl, into the downloads directory with the ledger
mkdirSync(downloads, { recursive: true })
const ledger = new Ledger(downloads)
const css = fetchText('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400')
const url = /src:\s*url\((https:[^)]+\.ttf)\)\s*format\('truetype'\)/.exec(css)?.[1]
if (!url) throw new Error(`no truetype src in Google's CSS for Noto Sans JP:\n${css.slice(0, 400)}`)
const ttf = join(downloads, 'fonts', 'NotoSansJP-Regular.ttf')
const got = fetchTo(ledger, url, ttf)
if (!got.ok) throw new Error(`HTTP ${got.status} for ${url}`)
console.log(`  face: ${url}${got.cached ? ' (cached)' : ''} → ${ttf}, ${(statSync(ttf).size / 1048576).toFixed(1)} MB`)

const { default: subsetFont } = await import('subset-font')
const woff2 = await subsetFont(readFileSync(ttf), text, { targetFormat: 'woff2' })
mkdirSync(dirname(out), { recursive: true })
writeFileSync(out, woff2)
console.log(`  wrote ${relative(root, out)}: ${chars.size} characters, ${(woff2.length / 1024).toFixed(1)} KB (${Math.round(woff2.length / chars.size)} bytes a character)`)
