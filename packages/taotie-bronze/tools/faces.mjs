#!/usr/bin/env node
// Flat faces: put a photographed face of a bronze and the model's same face side by side, head-on, at
// the same scale (KIT.md § Flat faces). Reads reference/<id>/faces.json.
//
//   node tools/faces.mjs --list [--a id]                 faces per vessel: size, px/mm, source, view present?
//   node tools/faces.mjs --a id --rectify [--face f,…]   re-flatten reference/<id>/faces/<face>.jpg from faces.json
//                         [--originals dir] [--fetch]    (full-size originals from dir, default .work/originals;
//                                                         --fetch downloads missing ones there; else the committed copy)
//   node tools/faces.mjs --a id [--face f,…] [--out dir] [--q 1]
//        renders each face head-on in clay and height at the flattened photo's pixel size, writes
//        <out>/<id>/<face>-clay.png, -height.png, <face>-compare.jpg (photo | clay | relief edges over the photo),
//        <out>/<id>/faces-sheet.jpg and similarity.json, and prints the similarity per face
//   node tools/faces.mjs --a id --views                  print the artifact `views` entries for its faces
//
// <out> defaults to .work/faces. Build first (TAOTIE_DIST=… for a private build, as every tool here).
// The image work is tools/faces_img.py (python3 + PIL + numpy).
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { basename, join } from 'node:path'
import { execFileSync } from 'node:child_process'
import { args, PKG } from './lib.mjs'

const opt = args()
const REF = join(PKG, 'reference')
const PY = join(PKG, 'tools', 'faces_img.py')
const list = (v) => (v && v !== true ? String(v).split(',').filter(Boolean) : null)
const onlyFaces = list(opt.face)

function load(id) {
  const p = join(REF, id, 'faces.json')
  return existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : null
}
const vesselsWithFaces = () => readdirSync(REF).filter((d) => existsSync(join(REF, d, 'faces.json'))).sort()
const ids = opt.a ? String(opt.a).split(',') : vesselsWithFaces()
const r2 = (v) => Math.round(v * 100) / 100

function py(cmd, ...a) {
  return execFileSync('python3', [PY, cmd, ...a], { encoding: 'utf8', maxBuffer: 1 << 26 })
}

/** The `face` view property for a faces.json face. */
const faceProp = (f) => ({ center: f.center, normal: f.normal, up: f.up || [0, 1, 0], width: f.width, height: f.height, ...(f.light ? { light: f.light } : {}) })

/** Artifact views (static text scan, no build needed): name → has face? ref? */
function artifactViews(id) {
  const p = join(PKG, 'src', 'artifacts', id + '.js')
  if (!existsSync(p)) return {}
  const src = readFileSync(p, 'utf8')
  const out = {}
  for (const m of src.matchAll(/['"]?([\w-]+)['"]?\s*:\s*\{\s*face:/g)) out[m[1]] = true
  return out
}

if (opt.list) {
  for (const id of ids) {
    const d = load(id)
    if (!d) {
      console.log(`${id}: no faces.json`)
      continue
    }
    const views = artifactViews(id)
    console.log(`${id}`)
    for (const [name, f] of Object.entries(d.faces)) {
      const flat = join(REF, id, 'faces', name + '.jpg')
      const px = `${Math.round(f.width * (f.ppmm || 8))}×${Math.round(f.height * (f.ppmm || 8))}`
      console.log(`  ${name.padEnd(22)} ${String(f.width + '×' + f.height + ' mm').padEnd(14)} ${String(f.ppmm || 8).padEnd(4)} px/mm ${px.padEnd(10)} ${(f.source || '').padEnd(10)} ${existsSync(flat) ? 'flat ✓' : 'flat ✗'}  ${views[name] ? 'view ✓' : 'view ✗'}  ${f.label || ''}`)
    }
  }
  process.exit(0)
}

if (opt.views) {
  for (const id of ids) {
    const d = load(id)
    if (!d) continue
    console.log(`// ${id}`)
    for (const [name, f] of Object.entries(d.faces)) {
      const p = faceProp(f)
      const nums = (a) => "[" + a.map((v) => Math.round(v * 1e4) / 1e4).join(', ') + ']'
      console.log(`    '${name}': { face: { center: ${nums(p.center)}, normal: ${nums(p.normal)}, up: ${nums(p.up)}, width: ${p.width}, height: ${p.height} }, ref: 'faces/${name}.jpg' },`)
    }
  }
  process.exit(0)
}

if (opt.rectify) {
  const originals = opt.originals && opt.originals !== true ? opt.originals : join(PKG, '.work', 'originals')
  mkdirSync(originals, { recursive: true })
  for (const id of ids) {
    const d = load(id)
    if (!d) continue
    if (opt.fetch) {
      for (const s of Object.values(d.sources)) {
        if (!s.original) continue
        const file = join(originals, basename(s.original.split('?')[0]))
        if (existsSync(file)) continue
        console.log(`  fetching ${s.original}`)
        try {
          execFileSync('curl', ['-sSfL', '-A', 'taotie-faces/1.0', '-o', file, s.original])
        } catch (e) {
          console.error(`  ✗ could not fetch it (${e.message.split('\n')[0]}); the committed copy is used`)
        }
      }
    }
    console.log(`${id}: rectify → reference/${id}/faces/`)
    const out = py('rectify', join(REF, id, 'faces.json'), join(REF, id, 'faces'), originals, ...(onlyFaces || []))
    for (const line of out.trim().split('\n').filter(Boolean)) {
      const r = JSON.parse(line)
      console.log(`  ✓ ${r.face.padEnd(22)} ${r.w}×${r.h} px @ ${r.ppmm} px/mm (photo ${r.srcPpmm} px/mm at the centre)  fit rms ${r.rms_mm} mm, max ${r.max_mm} mm, ${r.points} points  ← ${r.src}`)
      if (r.max_mm > 1.5 || opt.verbose) console.log(`      per point (mm, faces.json order): ${r.perPoint_mm.join('  ')}`)
    }
  }
  process.exit(0)
}

// ---------------------------------------------------------------- render + compare
if (!opt.a) {
  console.error('which vessel? --a <id>   (or --list)')
  process.exit(2)
}
const { session } = await import('./lib.mjs')
const OUT = opt.out && opt.out !== true ? opt.out : join(PKG, '.work', 'faces')
const q = String(opt.q || 1)
const s = await session()
let failures = 0
try {
  for (const id of ids) {
    const d = load(id)
    if (!d) {
      console.error(`${id}: no reference/${id}/faces.json`)
      failures++
      continue
    }
    const dir = join(OUT, id)
    mkdirSync(dir, { recursive: true })
    const faces = Object.entries(d.faces).filter(([n]) => !onlyFaces || onlyFaces.includes(n))
    const { page, errors } = await s.open({ ui: '0', q, a: id }, { width: 1200, height: 900 })
    await s.waitReady(page)
    const results = {}
    const compares = []
    for (const [name, f] of faces) {
      const flat = join(REF, id, 'faces', name + '.jpg')
      if (!existsSync(flat)) {
        console.error(`  ✗ ${name}: no flattened photo — run --rectify`)
        failures++
        continue
      }
      const [W, H] = execFileSync('identify', ['-format', '%w %h', flat], { encoding: 'utf8' }).trim().split(' ').map(Number)
      await page.setViewportSize({ width: W, height: H })
      await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => r())))
      await page.evaluate((face) => window.__taotie.setFace(face), faceProp(f))
      const shots = {}
      for (const mode of ['clay', 'height']) {
        await page.evaluate((m) => window.__taotie.setMode(m), mode)
        shots[mode] = join(dir, `${name}-${mode}.png`)
        await page.screenshot({ path: shots[mode] })
      }
      await page.evaluate(() => window.__taotie.setMode('beauty'))
      const out = join(dir, `${name}-compare.jpg`)
      const ppmm = W / f.width
      const blurMM = f.blur ?? d.blur ?? 0.5 // mm: above the leiwen pitch (faces.json `blur`, per face or per vessel)
      const r = JSON.parse(py('compare', flat, shots.clay, shots.height, out, `${id} · ${name} · ${f.width}×${f.height} mm`, String(ppmm), String(blurMM)).trim())
      results[name] = r.ncc
      compares.push(out)
      console.log(`  ✓ ${name.padEnd(22)} similarity ${r.ncc.toFixed(3)}   ${out.startsWith(PKG) ? out.slice(PKG.length + 1) : out}`)
    }
    if (compares.length) {
      const sheet = join(dir, 'faces-sheet.jpg')
      py('sheet', sheet, `${id} · flat faces · photograph | model clay | model relief edges over the photograph`, ...compares)
      console.log(`  ✓ ${sheet.startsWith(PKG) ? sheet.slice(PKG.length + 1) : sheet}`)
      writeFileSync(join(dir, 'similarity.json'), JSON.stringify({ id, q: Number(q), similarity: results }, null, 2) + '\n')
    }
    for (const e of errors) {
      console.error('  console: ' + e)
      failures++
    }
    await page.close()
  }
} finally {
  await s.close()
}
process.exit(failures ? 1 : 0)
