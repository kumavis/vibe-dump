/**
 * RoundLog + immutable per-round Snapshots. The UI scrubs over these without
 * re-running the engine; programs are small, so snapshot-per-round is fine.
 */
import type { Span } from '../lang/span'
import {
  type EClassId,
  EGraph,
  type ENode,
  type ProvenanceEntry,
  type TighteningRecord,
  nodeKeyOf,
} from './egraph'

export interface FiringRecord {
  rule: string
  detail: string
  reads: EClassId[]
  writes: EClassId[]
}

export interface RoundLog {
  round: number
  firings: FiringRecord[]
  newClasses: EClassId[]
  merges: { a: EClassId; b: EClassId; result: EClassId; rule: string }[]
  changedCells: EClassId[]
  /** CO-5: classes whose best cost strictly tightened this round (label flash). */
  tightened: TighteningRecord[]
  /** CO-8: classes that became demanded this round (the demand wavefront). */
  newlyDemanded: EClassId[]
  classCount: number
}

export interface SnapNode {
  key: string
  op: string
  fn?: string
  value?: number | boolean
  args: EClassId[]
  pretty: string
}

export interface SnapClass {
  id: EClassId
  label: string
  alts: SnapNode[]
  best: { cost: number; key: string; pretty: string } | null
  spans: Span[]
  /** CO-2/CO-2.3: the provenance SET; presentation order is derived at render time. */
  provenance: ProvenanceEntry[]
  /** best is a literal — this cell has settled. */
  settled: boolean
  /** CO-8: false = the program does not (yet) need this class; render ghosted. */
  demanded: boolean
}

export interface Snapshot {
  classes: SnapClass[]
  rootId: EClassId
  classCount: number
}

/** Pretty-print a node, rendering children by their best-known label. */
export function prettyNode(egraph: EGraph, node: ENode, depth: number): string {
  if (node.op === 'lit') return String(node.value)
  if (depth <= 0) return '…'
  if (node.op === 'call') {
    return `${node.fn}(${node.args.map((a) => classLabel(egraph, a, depth - 1)).join(', ')})`
  }
  if (node.op === 'if') {
    const [c, t, e] = node.args
    return `if ${classLabel(egraph, c, depth - 1)} then ${classLabel(egraph, t, depth - 1)} else ${classLabel(egraph, e, depth - 1)}`
  }
  const [a, b] = node.args
  const paren = (s: string): string => (s.includes(' ') ? `(${s})` : s)
  return `${paren(classLabel(egraph, a, depth - 1))} ${node.op} ${paren(classLabel(egraph, b, depth - 1))}`
}

/** Best-known representative label of a class. */
export function classLabel(egraph: EGraph, id: EClassId, depth = 3): string {
  const cell = egraph.getCell(id)
  if (!cell) return `#${id}`
  const node = cell.best?.node ?? cell.alts.values().next().value
  if (!node) return `#${id}`
  return prettyNode(egraph, node, depth)
}

export function takeSnapshot(
  egraph: EGraph,
  rootId: EClassId,
  demanded: ReadonlySet<EClassId> | null,
): Snapshot {
  const classes: SnapClass[] = []
  for (const id of egraph.classIds()) {
    const cell = egraph.getCell(id)
    const alts: SnapNode[] = []
    for (const raw of cell.alts.values()) {
      const node = egraph.canonicalize(raw)
      alts.push({
        key: nodeKeyOf(node),
        op: node.op,
        fn: node.op === 'call' ? node.fn : undefined,
        value: node.op === 'lit' ? node.value : undefined,
        args: node.op === 'lit' ? [] : node.args.map((a) => egraph.find(a)),
        pretty: prettyNode(egraph, node, 2),
      })
    }
    const best = cell.best
      ? {
          cost: cell.best.cost,
          key: nodeKeyOf(egraph.canonicalize(cell.best.node)),
          pretty: prettyNode(egraph, cell.best.node, 3),
        }
      : null
    classes.push({
      id,
      label: classLabel(egraph, id, 2),
      alts,
      best,
      spans: egraph.spansOf(id),
      provenance: [...cell.provenance.values()],
      settled: cell.best !== null && cell.best.node.op === 'lit',
      demanded: demanded === null ? true : demanded.has(egraph.find(id)),
    })
  }
  classes.sort((a, b) => a.id - b.id)
  return { classes, rootId: egraph.find(rootId), classCount: classes.length }
}
