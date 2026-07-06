/** Shared test helpers. Re-exports engine internals used across test files. */
import {
  type BestEntry,
  type CellValue,
  EGraph,
  type ENode,
  emptyCell,
  join,
  nodeKeyOf,
} from '../src/engine/egraph'
import { mulberry32 } from '../src/engine/scheduler'

export { EGraph, emptyCell, join }
export type { CellValue, ENode, BestEntry }

/** Semantic equality on cell values: alts as a set, best by (cost,key), provenance as a set. */
function cellEq(a: CellValue, b: CellValue): boolean {
  if (a.alts.size !== b.alts.size) return false
  for (const k of a.alts.keys()) if (!b.alts.has(k)) return false
  const bestKey = (x: BestEntry | null): string => (x ? `${x.cost}|${nodeKeyOf(x.node)}` : 'null')
  if (bestKey(a.best) !== bestKey(b.best)) return false
  const provSet = (c: CellValue): Set<string> =>
    new Set(c.provenance.map((p) => `${p.rule}|${p.round}|${p.detail}`))
  const pa = provSet(a)
  const pb = provSet(b)
  if (pa.size !== pb.size) return false
  for (const k of pa) if (!pb.has(k)) return false
  return true
}

export const mulberryCellEq = {
  rng: mulberry32,
  keyOf: nodeKeyOf,
  eq: cellEq,
}
