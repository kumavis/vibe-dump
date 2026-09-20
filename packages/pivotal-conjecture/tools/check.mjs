// Build-time check for the example categories.
//
// The page's whole claim is that nothing it displays is hand-entered: each
// example carries only its fusion multiplicities, and every number shown is
// derived from them. That claim is only worth making if something enforces it,
// so this runs `audit()` over the catalogue and fails the build on any error.
// `package.json` invokes it before vite, which means a mistyped fusion rule
// cannot reach the page — it stops the build instead of producing a plausible
// wrong dimension.

import { CATALOG } from '../catalog.js'
import { audit } from '../fusion.js'

let failed = 0
for (const cat of CATALOG) {
  const errs = audit(cat.N)
  if (errs.length) {
    failed++
    console.error(`✗ ${cat.id} (${cat.name}) — ${errs.length} problem(s):`)
    for (const e of errs.slice(0, 8)) console.error(`    ${e}`)
    if (errs.length > 8) console.error(`    … and ${errs.length - 8} more`)
    continue
  }
  // Derived quantities must also be self-consistent with what the page asserts.
  const fp = cat.dims.reduce((s, d) => s + d * d, 0)
  if (Math.abs(fp - cat.fpdimC) > 1e-9) {
    failed++
    console.error(`✗ ${cat.id} — FPdim(C) disagrees with the sum of squares`)
    continue
  }
  if (cat.chars.length < 1) {
    failed++
    console.error(`✗ ${cat.id} — no characters of U(C); the identity is always one`)
    continue
  }
  console.log(
    `✓ ${cat.id.padEnd(9)} rank ${String(cat.labels.length).padStart(2)}` +
      `  FPdim(C) ${fp.toFixed(4).padStart(9)}  U(C) ${cat.gradingName.padEnd(10)}` +
      `  ${cat.chars.length} pivotal structure${cat.chars.length === 1 ? '' : 's'}`,
  )
}

if (failed) {
  console.error(`\n${failed} of ${CATALOG.length} categories failed the audit.`)
  process.exit(1)
}
console.log(`\nAll ${CATALOG.length} fusion rings pass: unit, associativity, rigidity, Frobenius reciprocity, dimensions, grading.`)
