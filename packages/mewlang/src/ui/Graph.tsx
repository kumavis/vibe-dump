import { useEffect, useMemo, useRef, useState } from 'react'
import {
  type Simulation,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
} from 'd3-force'
import type { SnapClass } from '../engine/roundlog'
import {
  classesAtPos,
  currentRoundLog,
  currentSnapshot,
  resolveSelection,
  useStore,
} from './store'

interface SimNode {
  id: number
  x: number
  y: number
  vx?: number
  vy?: number
  fx?: number | null
  fy?: number | null
  r: number
  index?: number
}

interface EdgeDatum {
  key: string
  from: number
  to: number
  kind: 'best' | 'structure' | 'ghost'
}

interface ArcDatum {
  key: string
  from: number
  to: number
  kind: 'arith' | 'unfold' | 'congruence' | 'if'
  delay: number
}

const DEGRADE_AT = 300

function hashJitter(id: number): [number, number] {
  const a = Math.sin(id * 127.1 + 311.7) * 43758.5453
  const b = Math.sin(id * 269.5 + 183.3) * 28001.8384
  return [(a - Math.floor(a)) * 2 - 1, (b - Math.floor(b)) * 2 - 1]
}

function nodeRadius(c: SnapClass): number {
  return 9 + Math.min(c.alts.length, 8) * 1.4
}

function truncate(s: string, n: number): string {
  return s.length > n ? `${s.slice(0, n - 1)}…` : s
}

/** Preferred structural alt for edge display when the best is a literal. */
function structuralAlt(c: SnapClass) {
  const order = ['call', 'if', '+', '-', '*', '<', '<=', '==']
  const nonLit = c.alts.filter((a) => a.op !== 'lit')
  nonLit.sort((a, b) => order.indexOf(a.op) - order.indexOf(b.op))
  return nonLit[0] ?? null
}

function edgePath(sx: number, sy: number, tx: number, ty: number, bend: number): string {
  const mx = (sx + tx) / 2
  const my = (sy + ty) / 2
  const dx = tx - sx
  const dy = ty - sy
  const len = Math.hypot(dx, dy) || 1
  const nx = -dy / len
  const ny = dx / len
  return `M${sx},${sy} Q${mx + nx * bend * len},${my + ny * bend * len} ${tx},${ty}`
}

export function Graph() {
  const run = useStore((s) => s.run)
  const round = useStore((s) => s.round)
  const relayoutNonce = useStore((s) => s.relayoutNonce)
  const hoveredNode = useStore((s) => s.hoveredNode)
  const selected = useStore((s) => s.selected)
  const editorHoverPos = useStore((s) => s.editorHoverPos)
  const relayout = useStore((s) => s.relayout)

  const snapshot = useMemo(() => currentSnapshot({ run, round }), [run, round])
  const roundLog = useMemo(() => currentRoundLog({ run, round }), [run, round])

  const containerRef = useRef<HTMLDivElement>(null)
  const nodesRef = useRef(new Map<number, SimNode>())
  const simRef = useRef<Simulation<SimNode, undefined> | null>(null)
  const nodeElsRef = useRef(new Map<number, SVGGElement>())
  const edgeElsRef = useRef(new Map<string, SVGPathElement>())
  const arcElsRef = useRef(new Map<string, SVGPathElement>())
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 })
  const transformRef = useRef(transform)
  transformRef.current = transform
  const [panning, setPanning] = useState(false)

  const degraded = (snapshot?.classes.length ?? 0) > DEGRADE_AT
  // `forward` must be stable for the LIFETIME of a round, not just the first
  // render after stepping — otherwise any hover/pan re-render strips the
  // round-entry animations mid-flight. Latch it per round value.
  const roundStepRef = useRef({ round: -1, forward: false })
  if (round !== roundStepRef.current.round) {
    roundStepRef.current = { round, forward: round === roundStepRef.current.round + 1 }
  }
  const forward = roundStepRef.current.forward

  // ---- derive edges from the snapshot
  const edges = useMemo<EdgeDatum[]>(() => {
    if (!snapshot) return []
    const out: EdgeDatum[] = []
    for (const c of snapshot.classes) {
      const bestAlt = c.best ? c.alts.find((a) => a.key === c.best!.key) : null
      const display = bestAlt && bestAlt.op !== 'lit' ? bestAlt : null
      const structure = !display && c.settled ? structuralAlt(c) : null
      const src = display ?? structure
      if (!src) continue
      const seen = new Set<number>()
      src.args.forEach((arg, i) => {
        if (arg === c.id || seen.has(arg)) return
        seen.add(arg)
        out.push({
          key: `${c.id}>${arg}#${i}`,
          from: c.id,
          to: arg,
          kind: display ? 'best' : 'structure',
        })
      })
    }
    return out
  }, [snapshot])

  // ---- ghost edges for the hovered class (its other alternatives)
  const ghostEdges = useMemo<EdgeDatum[]>(() => {
    if (!snapshot || hoveredNode === null) return []
    const c = snapshot.classes.find((x) => x.id === hoveredNode)
    if (!c) return []
    const mainTargets = new Set(edges.filter((e) => e.from === c.id).map((e) => e.to))
    const out: EdgeDatum[] = []
    const seen = new Set<number>()
    for (const alt of c.alts) {
      for (const arg of alt.args) {
        if (arg === c.id || mainTargets.has(arg) || seen.has(arg)) continue
        seen.add(arg)
        out.push({ key: `ghost:${c.id}>${arg}`, from: c.id, to: arg, kind: 'ghost' })
      }
    }
    return out
  }, [snapshot, hoveredNode, edges])

  // ---- transient firing arcs for the round just entered (forward only)
  const arcs = useMemo<ArcDatum[]>(() => {
    if (!snapshot || !roundLog || degraded || !forward) return []
    const ids = new Set(snapshot.classes.map((c) => c.id))
    const out: ArcDatum[] = []
    roundLog.firings.slice(0, 60).forEach((f, fi) => {
      const kind =
        f.rule === 'R-unfold'
          ? 'unfold'
          : f.rule === 'R-congruence'
            ? 'congruence'
            : f.rule === 'R-if'
              ? 'if'
              : 'arith'
      for (const w of f.writes) {
        for (const r of f.reads) {
          if (!ids.has(r) || !ids.has(w) || r === w) continue
          out.push({ key: `arc${roundLog.round}:${fi}:${r}>${w}`, from: r, to: w, kind, delay: fi * 15 })
        }
      }
    })
    return out
  }, [snapshot, roundLog, degraded, forward])

  // ---- per-round visual states
  const nodeStates = useMemo(() => {
    const born = new Set<number>()
    const merged = new Set<number>()
    const gained = new Set<number>()
    const tightened = new Set<number>()
    const demandedNow = new Set<number>()
    if (roundLog) {
      for (const id of roundLog.newClasses) born.add(id)
      for (const m of roundLog.merges) if (!born.has(m.result)) merged.add(m.result)
      for (const id of roundLog.changedCells) {
        if (!born.has(id) && !merged.has(id)) gained.add(id)
      }
      for (const t of roundLog.tightened) tightened.add(t.classId)
      for (const id of roundLog.newlyDemanded) demandedNow.add(id)
    }
    return { born, merged, gained, tightened, demandedNow }
  }, [roundLog])

  const srcHits = useMemo(() => {
    if (editorHoverPos === null) return new Set<number>()
    return new Set(classesAtPos(snapshot, editorHoverPos).map((c) => c.id))
  }, [snapshot, editorHoverPos])

  const selectedId = resolveSelection(run, selected, round)

  // Ghost edges and firing arcs change on hover/round without topology
  // changing — the tick handler reads them through refs so their arrival
  // never rebuilds or reheats the simulation (hover must not cause jiggle).
  const edgesRef = useRef(edges)
  edgesRef.current = edges
  const ghostEdgesRef = useRef(ghostEdges)
  ghostEdgesRef.current = ghostEdges
  const arcsRef = useRef(arcs)
  arcsRef.current = arcs
  const drawRef = useRef<() => void>(() => {})

  // ---- build / update the force simulation when topology changes
  useEffect(() => {
    if (!snapshot || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const cx = rect.width / 2
    const cy = rect.height / 2

    const prev = nodesRef.current
    const next = new Map<number, SimNode>()
    const mergeSources = new Map<number, number[]>()
    if (roundLog) {
      for (const m of roundLog.merges) {
        const list = mergeSources.get(m.result) ?? []
        list.push(m.a, m.b)
        mergeSources.set(m.result, list)
      }
    }
    let appeared = 0
    for (const c of snapshot.classes) {
      let node = prev.get(c.id)
      if (!node) {
        appeared++
        // merged-away predecessor position, else near a child, else jittered center
        let x: number | undefined
        let y: number | undefined
        const srcs = (mergeSources.get(c.id) ?? []).map((i) => prev.get(i)).filter(Boolean) as SimNode[]
        if (srcs.length > 0) {
          x = srcs.reduce((s, n) => s + n.x, 0) / srcs.length
          y = srcs.reduce((s, n) => s + n.y, 0) / srcs.length
        } else {
          const bestAlt = c.alts.find((a) => a.args.some((arg) => prev.has(arg)))
          const anchorId = bestAlt?.args.find((arg) => prev.has(arg))
          const anchor = anchorId !== undefined ? prev.get(anchorId) : undefined
          const [jx, jy] = hashJitter(c.id)
          x = (anchor ? anchor.x : cx) + jx * 60
          y = (anchor ? anchor.y : cy) + jy * 60
        }
        node = { id: c.id, x, y, r: nodeRadius(c) }
      } else {
        node.r = nodeRadius(c)
      }
      next.set(c.id, node)
    }
    nodesRef.current = next

    const nodeArr = [...next.values()]
    const linkArr = edges
      .filter((e) => next.has(e.from) && next.has(e.to))
      .map((e) => ({ source: e.from, target: e.to }))

    let sim = simRef.current
    if (!sim) {
      sim = forceSimulation<SimNode>()
        .force('charge', forceManyBody().strength(-220))
        .force('x', forceX<SimNode>(cx).strength(0.045))
        .force('y', forceY<SimNode>(cy).strength(0.06))
        .force('collide', forceCollide<SimNode>().radius((d) => d.r + 14))
        .force(
          'link',
          forceLink<SimNode, { source: number | SimNode; target: number | SimNode }>()
            .id((d) => d.id)
            .distance(70)
            .strength(0.5),
        )
      simRef.current = sim
    }
    const xf = sim.force('x') as ReturnType<typeof forceX<SimNode>>
    const yf = sim.force('y') as ReturnType<typeof forceY<SimNode>>
    xf.x(cx)
    yf.y(cy)
    sim.nodes(nodeArr)
    const linkForce = sim.force('link') as ReturnType<
      typeof forceLink<SimNode, { source: number | SimNode; target: number | SimNode }>
    >
    linkForce.links(linkArr)

    const onTick = () => {
      const posOf = (id: number) => nodesRef.current.get(id)
      for (const [id, el] of nodeElsRef.current) {
        const n = posOf(id)
        if (n) el.setAttribute('transform', `translate(${n.x},${n.y})`)
      }
      const drawEdge = (key: string, from: number, to: number, bend: number, shorten: boolean) => {
        const el = edgeElsRef.current.get(key)
        const a = posOf(from)
        const b = posOf(to)
        if (!el || !a || !b) return
        let tx = b.x
        let ty = b.y
        if (shorten) {
          const dx = b.x - a.x
          const dy = b.y - a.y
          const len = Math.hypot(dx, dy) || 1
          tx = b.x - (dx / len) * (b.r + 5)
          ty = b.y - (dy / len) * (b.r + 5)
        }
        el.setAttribute('d', edgePath(a.x, a.y, tx, ty, bend))
      }
      for (const e of edgesRef.current) drawEdge(e.key, e.from, e.to, 0.08, true)
      for (const e of ghostEdgesRef.current) drawEdge(e.key, e.from, e.to, 0.16, true)
      for (const [key, el] of arcElsRef.current) {
        const arc = arcsRef.current.find((a) => a.key === key)
        if (!arc) continue
        const a = posOf(arc.from)
        const b = posOf(arc.to)
        if (a && b) el.setAttribute('d', edgePath(a.x, a.y, b.x, b.y, -0.25))
      }
    }
    drawRef.current = onTick
    sim.on('tick', onTick)
    sim.alpha(appeared > 0 ? 0.7 : 0.12).restart()
    onTick()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snapshot, edges, relayoutNonce])

  // Newly mounted ghost/arc paths need one draw pass at current positions —
  // WITHOUT touching the simulation.
  useEffect(() => {
    drawRef.current()
  }, [ghostEdges, arcs])

  // Relayout: unpin everything and reheat.
  useEffect(() => {
    if (relayoutNonce === 0) return
    for (const n of nodesRef.current.values()) {
      n.fx = null
      n.fy = null
    }
    simRef.current?.alpha(1).restart()
  }, [relayoutNonce])

  useEffect(
    () => () => {
      simRef.current?.stop()
    },
    [],
  )

  // ---- interactions
  const toWorld = (clientX: number, clientY: number): [number, number] => {
    const rect = containerRef.current!.getBoundingClientRect()
    const t = transformRef.current
    return [(clientX - rect.left - t.x) / t.k, (clientY - rect.top - t.y) / t.k]
  }

  const dragRef = useRef<{
    id: number | null
    startX: number
    startY: number
    moved: boolean
    panStart?: { x: number; y: number }
  } | null>(null)

  const onNodePointerDown = (e: React.PointerEvent, id: number) => {
    e.stopPropagation()
    ;(e.target as Element).setPointerCapture(e.pointerId)
    dragRef.current = { id, startX: e.clientX, startY: e.clientY, moved: false }
    simRef.current?.alphaTarget(0.25).restart()
  }

  const onSvgPointerDown = (e: React.PointerEvent) => {
    ;(e.currentTarget as Element).setPointerCapture(e.pointerId)
    dragRef.current = {
      id: null,
      startX: e.clientX,
      startY: e.clientY,
      moved: false,
      panStart: { x: transformRef.current.x, y: transformRef.current.y },
    }
    setPanning(true)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    const drag = dragRef.current
    if (!drag) return
    const dx = e.clientX - drag.startX
    const dy = e.clientY - drag.startY
    if (Math.hypot(dx, dy) > 3) drag.moved = true
    if (drag.id !== null) {
      const node = nodesRef.current.get(drag.id)
      if (node) {
        const [wx, wy] = toWorld(e.clientX, e.clientY)
        node.fx = wx
        node.fy = wy
      }
    } else if (drag.panStart) {
      setTransform((t) => ({ ...t, x: drag.panStart!.x + dx, y: drag.panStart!.y + dy }))
    }
  }

  const onPointerUp = (e: React.PointerEvent) => {
    const drag = dragRef.current
    dragRef.current = null
    setPanning(false)
    simRef.current?.alphaTarget(0)
    if (!drag) return
    if (drag.id !== null && !drag.moved) {
      // click, not drag: select; also unpin so plain clicks don't freeze nodes
      const node = nodesRef.current.get(drag.id)
      if (node) {
        node.fx = null
        node.fy = null
      }
      useStore.getState().select(drag.id)
      e.stopPropagation()
    } else if (drag.id === null && !drag.moved) {
      useStore.getState().select(null)
    }
  }

  const onNodeDoubleClick = (id: number) => {
    const node = nodesRef.current.get(id)
    if (node) {
      node.fx = null
      node.fy = null
      simRef.current?.alpha(0.2).restart()
    }
  }

  const onWheel = (e: React.WheelEvent) => {
    const rect = containerRef.current!.getBoundingClientRect()
    const px = e.clientX - rect.left
    const py = e.clientY - rect.top
    setTransform((t) => {
      const k = Math.max(0.15, Math.min(4, t.k * Math.exp(-e.deltaY * 0.0016)))
      const wx = (px - t.x) / t.k
      const wy = (py - t.y) / t.k
      return { k, x: px - wx * k, y: py - wy * k }
    })
  }

  if (!run || !snapshot) {
    return (
      <div className="graph-empty" ref={containerRef}>
        <div style={{ fontSize: 40 }}>🐈‍⬛</div>
        <div>
          <b>No network yet.</b>
        </div>
        <div>
          Write a program on the left and press <b>Compile ▸</b>, or open the <b>Tutorial</b> tab on
          the right for a guided tour.
        </div>
      </div>
    )
  }

  nodeElsRef.current = new Map()
  edgeElsRef.current = new Map()
  arcElsRef.current = new Map()

  return (
    <div
      ref={containerRef}
      className={`graph${degraded ? ' degraded' : ''}`}
      style={{ position: 'absolute', inset: 0 }}
    >
      <svg
        className={`graph-svg${panning ? ' panning' : ''}`}
        onPointerDown={onSvgPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onWheel={onWheel}
      >
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#454f6b" />
          </marker>
          <marker id="arrow-ghost" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#bb9af7" />
          </marker>
        </defs>
        <g transform={`translate(${transform.x},${transform.y}) scale(${transform.k})`}>
          <g>
            {edges.map((e) => (
              <path
                key={e.key}
                className={`edge ${e.kind}`}
                ref={(el) => {
                  if (el) edgeElsRef.current.set(e.key, el)
                }}
              />
            ))}
            {ghostEdges.map((e) => (
              <path
                key={e.key}
                className="edge ghost"
                ref={(el) => {
                  if (el) edgeElsRef.current.set(e.key, el)
                }}
              />
            ))}
          </g>
          <g>
            {arcs.map((a) => (
              <path
                key={a.key}
                className={`firing-arc ${a.kind}`}
                style={{ animationDelay: `${a.delay}ms` }}
                ref={(el) => {
                  if (el) arcElsRef.current.set(a.key, el)
                }}
              />
            ))}
          </g>
          <g>
            {snapshot.classes.map((c) => {
              const isRoot = c.id === snapshot.rootId
              const cls = [
                'node',
                c.settled ? 'settled' : '',
                !c.demanded ? 'ghost' : '',
                nodeStates.born.has(c.id) && forward ? 'born' : '',
                nodeStates.merged.has(c.id) && forward ? 'merged-now' : '',
                nodeStates.gained.has(c.id) && forward ? 'gained' : '',
                nodeStates.tightened.has(c.id) && forward ? 'tightened' : '',
                nodeStates.demandedNow.has(c.id) && forward ? 'demanded-now' : '',
                isRoot ? 'root' : '',
                hoveredNode === c.id ? 'hovered' : '',
                selectedId === c.id ? 'selected' : '',
                srcHits.has(c.id) ? 'src-hit' : '',
                nodesRef.current.get(c.id)?.fx != null ? 'pinned' : '',
              ]
                .filter(Boolean)
                .join(' ')
              const r = nodeRadius(c)
              return (
                <g
                  key={c.id}
                  className={cls}
                  ref={(el) => {
                    if (el) nodeElsRef.current.set(c.id, el)
                  }}
                  onPointerDown={(e) => onNodePointerDown(e, c.id)}
                  onDoubleClick={() => onNodeDoubleClick(c.id)}
                  onPointerEnter={() => useStore.getState().hoverNode(c.id)}
                  onPointerLeave={() => useStore.getState().hoverNode(null)}
                >
                  <circle className="pulse" r={r} />
                  {isRoot && <circle className="ring" r={r + 5} />}
                  <circle className="body" r={r} />
                  <circle className="pin" r={2.5} cy={-r - 4} fill="none" />
                  <text y={r + 12}>{truncate(c.label, 18)}</text>
                </g>
              )
            })}
          </g>
        </g>
      </svg>
      <div className="graph-toolbar">
        <button onClick={relayout} title="Unpin all nodes and re-run the layout">
          relayout
        </button>
      </div>
      <Legend degraded={degraded} />
      <div className="graph-hint">drag = pin · dblclick = unpin · wheel = zoom · hover = spans</div>
    </div>
  )
}

function Legend({ degraded }: { degraded: boolean }) {
  const rows: { fill: string; stroke: string; label: string }[] = [
    { fill: 'var(--node-default)', stroke: '#566089', label: 'e-class (unchanged)' },
    { fill: '#1e4356', stroke: 'var(--node-new)', label: 'allocated this round' },
    { fill: '#574b2c', stroke: 'var(--node-changed)', label: 'gained an alternative' },
    { fill: '#4a3a63', stroke: 'var(--node-merged)', label: 'merged this round' },
    { fill: 'var(--node-settled)', stroke: 'var(--green)', label: 'settled (best is a literal)' },
    { fill: 'transparent', stroke: 'var(--accent)', label: 'root class (main)' },
    { fill: 'transparent', stroke: '#3d4658', label: 'ghosted = not demanded' },
  ]
  return (
    <div className="legend">
      <h3>Legend</h3>
      {rows.map((r) => (
        <div className="legend-row" key={r.label}>
          <span className="legend-swatch" style={{ background: r.fill, borderColor: r.stroke }} />
          {r.label}
        </div>
      ))}
      <div className="legend-row" style={{ marginTop: 4 }}>
        <span style={{ width: 11, borderTop: '2px dashed var(--accent-2)' }} />
        ghost edge (other alternatives, on hover)
      </div>
      {degraded && <div style={{ color: 'var(--amber)', marginTop: 4 }}>large graph — animations off</div>}
    </div>
  )
}
