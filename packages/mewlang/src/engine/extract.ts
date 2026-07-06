/**
 * Extraction: after the network stops, the program's answer is the
 * lowest-cost representative of the (canonical) root e-class.
 */
import { type EClassId, EGraph, type Value } from './egraph'
import { classLabel } from './roundlog'

export interface Extraction {
  /** The literal value, if the root settled to one. */
  value: Value | null
  /** Pretty form of the cheapest known representative. */
  pretty: string
  cost: number
  isLiteral: boolean
}

export function extract(egraph: EGraph, rootId: EClassId): Extraction {
  const cell = egraph.getCell(rootId)
  const best = cell.best
  if (best && best.node.op === 'lit') {
    return { value: best.node.value, pretty: String(best.node.value), cost: best.cost, isLiteral: true }
  }
  return {
    value: null,
    pretty: classLabel(egraph, rootId, 4),
    cost: best?.cost ?? Infinity,
    isLiteral: false,
  }
}
