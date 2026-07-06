/** Shared test helpers. Re-exports engine internals used across test files. */
import {
  type BestEntry,
  type CellValue,
  EGraph,
  type ENode,
  type ProvenanceEntry,
  emptyCell,
  join,
  nodeKeyOf,
  provKeyOf,
} from '../src/engine/egraph'
import { mulberry32, type EvalResult } from '../src/engine/scheduler'
import { classFingerprint } from '../src/engine/fingerprint'
import type { SnapClass, Snapshot } from '../src/engine/roundlog'

export { EGraph, emptyCell, join, nodeKeyOf, provKeyOf }
export type { CellValue, ENode, BestEntry, ProvenanceEntry }

/** Semantic equality on cell values: alts, best (total order), provenance — all as sets. */
function cellEq(a: CellValue, b: CellValue): boolean {
  if (a.alts.size !== b.alts.size) return false
  for (const k of a.alts.keys()) if (!b.alts.has(k)) return false
  const bestKey = (x: BestEntry | null): string => (x ? `${x.cost}|${x.tieKey}` : 'null')
  if (bestKey(a.best) !== bestKey(b.best)) return false
  if (a.provenance.size !== b.provenance.size) return false
  for (const k of a.provenance.keys()) if (!b.provenance.has(k)) return false
  return true
}

export const cellHelpers = {
  rng: mulberry32,
  keyOf: nodeKeyOf,
  eq: cellEq,
}

export function finalSnapshot(r: EvalResult): Snapshot {
  return r.snapshots[r.snapshots.length - 1]
}

/**
 * A3.2: build the canonical-renaming bijection between two quiescent runs by
 * matching classes on their id-free content fingerprints. Throws if the
 * fingerprints are not unique per run or the multisets don't match — either
 * means the runs are not equal modulo renaming.
 */
export function classBijection(a: EvalResult, b: EvalResult): Map<number, number> {
  const fpOf = (c: SnapClass) => classFingerprint(c, { includeProvenance: true })
  const index = (r: EvalResult) => {
    const m = new Map<string, SnapClass>()
    for (const c of finalSnapshot(r).classes) {
      const fp = fpOf(c)
      if (m.has(fp)) throw new Error(`non-unique class fingerprint: ${fp}`)
      m.set(fp, c)
    }
    return m
  }
  const ia = index(a)
  const ib = index(b)
  if (ia.size !== ib.size) throw new Error('class counts differ')
  const bij = new Map<number, number>()
  for (const [fp, ca] of ia) {
    const cb = ib.get(fp)
    if (!cb) throw new Error(`no counterpart for: ${fp}`)
    bij.set(ca.id, cb.id)
  }
  return bij
}
