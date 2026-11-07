// The streets bake's own check (DATA.md, "Streets, dated"): what the bake
// found on each sheet, town by town, so a sheet that registered badly shows
// as a share found far from its neighbours'. The contract itself is held by
// tools/check-data.mjs, which --check runs after this.
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

export function checkStreets(out, log) {
  const mPath = join(out, 'manifest.json')
  if (!existsSync(mPath)) {
    log(`no ${mPath}`)
    return false
  }
  const m = JSON.parse(readFileSync(mPath, 'utf8'))
  let ok = true
  for (const t of m.towns) {
    const fc = JSON.parse(readFileSync(join(out, t.file), 'utf8'))
    const sheets = t.sheets.map((s) => `${s.year} ${s.found === null ? '–' : `${Math.round(s.found * 100)}%`} (${s.shift.join(', ')} m)`).join('; ')
    log(`${t.id}: ${fc.features.length} segments, ${t.stats.km} km`)
    log(`  found on: ${sheets}`)
    log(`  km by year: ${Object.entries(t.stats.kmBy).map(([y, k]) => `${y} ${k}`).join(', ')}`)
    // (today's streets: the latest sheet should find most of them)
    const last = t.sheets.at(-1)
    if (last.found !== null && last.found < 0.5) {
      log(`  ${t.id}: the ${last.year} sheet finds only ${Math.round(last.found * 100)}% of today's streets; is it registered?`)
      ok = false
    }
  }
  return ok
}
