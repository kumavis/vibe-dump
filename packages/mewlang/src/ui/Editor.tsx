import { useEffect, useMemo, useRef } from 'react'
import { EditorState, StateEffect, StateField } from '@codemirror/state'
import {
  Decoration,
  type DecorationSet,
  EditorView,
  keymap,
  lineNumbers,
} from '@codemirror/view'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { HighlightStyle, StreamLanguage, syntaxHighlighting } from '@codemirror/language'
import { tags } from '@lezer/highlight'
import type { Span } from '../lang/span'
import { EXAMPLES, classById, currentSnapshot, resolveSelection, useStore } from './store'

const mewLanguage = StreamLanguage.define({
  token(stream) {
    if (stream.eatSpace()) return null
    if (stream.match(/^;;.*/)) return 'comment'
    if (stream.match(/^\d+/)) return 'number'
    if (stream.match(/^(def|main|if|then|else)\b/)) return 'keyword'
    if (stream.match(/^(true|false)\b/)) return 'atom'
    if (stream.match(/^[a-zA-Z_][a-zA-Z0-9_]*(?=\s*\()/)) return 'variableName.function'
    if (stream.match(/^[a-zA-Z_][a-zA-Z0-9_]*/)) return 'variableName'
    if (stream.match(/^(==|<=|[+\-*<=(),])/)) return 'operator'
    stream.next()
    return null
  },
})

const mewHighlight = HighlightStyle.define([
  { tag: tags.comment, color: '#565f89', fontStyle: 'italic' },
  { tag: tags.number, color: '#ff9e64' },
  { tag: tags.keyword, color: '#bb9af7' },
  { tag: tags.atom, color: '#ff9e64' },
  { tag: [tags.function(tags.variableName)], color: '#7aa2f7' },
  { tag: tags.variableName, color: '#c0caf5' },
  { tag: tags.operator, color: '#89ddff' },
])

interface HighlightSpec {
  hover: Span[]
  selected: Span[]
}

const setSpanHighlights = StateEffect.define<HighlightSpec>()

const hoverMark = Decoration.mark({ class: 'cm-mew-hover' })
const selectedMark = Decoration.mark({ class: 'cm-mew-selected' })

const spanHighlightField = StateField.define<DecorationSet>({
  create: () => Decoration.none,
  update(deco, tr) {
    deco = deco.map(tr.changes)
    for (const e of tr.effects) {
      if (e.is(setSpanHighlights)) {
        const ranges = []
        const len = tr.newDoc.length
        for (const s of e.value.hover) {
          if (s.start < s.end && s.end <= len) ranges.push(hoverMark.range(s.start, s.end))
        }
        for (const s of e.value.selected) {
          if (s.start < s.end && s.end <= len) ranges.push(selectedMark.range(s.start, s.end))
        }
        deco = Decoration.set(ranges, true)
      }
    }
    return deco
  },
  provide: (f) => EditorView.decorations.from(f),
})

const editorTheme = EditorView.theme(
  {
    '&': { color: '#d7dce4', backgroundColor: '#0b0e13' },
    '.cm-gutters': { backgroundColor: '#0b0e13', color: '#3d4658', border: 'none' },
    '.cm-activeLine': { backgroundColor: 'rgba(122,162,247,0.05)' },
    '.cm-cursor': { borderLeftColor: '#d7dce4' },
    '.cm-selectionBackground, &.cm-focused .cm-selectionBackground': {
      backgroundColor: 'rgba(122,162,247,0.25) !important',
    },
  },
  { dark: true },
)

export function Editor() {
  const hostRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const source = useStore((s) => s.source)
  const exampleId = useStore((s) => s.exampleId)
  const dirty = useStore((s) => s.dirty)
  const budgetRounds = useStore((s) => s.budgetRounds)
  const budgetClasses = useStore((s) => s.budgetClasses)
  const mode = useStore((s) => s.mode)
  const demandOn = useStore((s) => s.demandOn)
  const seed = useStore((s) => s.seed)
  const run = useStore((s) => s.run)
  const round = useStore((s) => s.round)
  const selected = useStore((s) => s.selected)
  const hoveredNode = useStore((s) => s.hoveredNode)

  // Create the editor once.
  useEffect(() => {
    if (!hostRef.current || viewRef.current) return
    const view = new EditorView({
      parent: hostRef.current,
      state: EditorState.create({
        doc: useStore.getState().source,
        extensions: [
          lineNumbers(),
          history(),
          keymap.of([...defaultKeymap, ...historyKeymap]),
          mewLanguage,
          syntaxHighlighting(mewHighlight),
          editorTheme,
          spanHighlightField,
          EditorView.updateListener.of((u) => {
            if (u.docChanged) useStore.getState().setSource(u.state.doc.toString())
          }),
          EditorView.domEventHandlers({
            mousemove: (event, v) => {
              const pos = v.posAtCoords({ x: event.clientX, y: event.clientY })
              useStore.getState().setEditorHoverPos(pos)
            },
            mouseleave: () => useStore.getState().setEditorHoverPos(null),
            click: (event, v) => {
              const pos = v.posAtCoords({ x: event.clientX, y: event.clientY })
              if (pos !== null) useStore.getState().selectAtPos(pos)
            },
          }),
        ],
      }),
    })
    viewRef.current = view
    return () => {
      view.destroy()
      viewRef.current = null
    }
  }, [])

  // Sync external source changes (example loads, lesson jumps) into the doc.
  useEffect(() => {
    const view = viewRef.current
    if (!view) return
    const cur = view.state.doc.toString()
    if (cur !== source) {
      view.dispatch({ changes: { from: 0, to: cur.length, insert: source } })
    }
  }, [source])

  // Graph → editor highlighting: hovered/selected class spans.
  const highlightSpec = useMemo<HighlightSpec>(() => {
    const snap = currentSnapshot({ run, round })
    const hoverCls = classById(snap, hoveredNode)
    const selId = resolveSelection(run, selected, round)
    const selCls = classById(snap, selId)
    return { hover: hoverCls?.spans ?? [], selected: selCls?.spans ?? [] }
  }, [run, round, hoveredNode, selected])

  useEffect(() => {
    const view = viewRef.current
    if (!view) return
    view.dispatch({ effects: setSpanHighlights.of(highlightSpec) })
    // Scroll the first selected span into view when selection changes.
    const first = highlightSpec.selected[0]
    if (first && first.start <= view.state.doc.length) {
      view.dispatch({ effects: EditorView.scrollIntoView(first.start) })
    }
  }, [highlightSpec])

  const compile = useStore((s) => s.compile)
  const loadExample = useStore((s) => s.loadExample)
  const setBudgetRounds = useStore((s) => s.setBudgetRounds)
  const setBudgetClasses = useStore((s) => s.setBudgetClasses)
  const setMode = useStore((s) => s.setMode)
  const setDemandOn = useStore((s) => s.setDemandOn)
  const reseed = useStore((s) => s.reseed)

  return (
    <>
      <div className="panel-head">
        <h2>mewlang</h2>
        <select
          value={exampleId}
          onChange={(e) => {
            if (e.target.value) loadExample(e.target.value)
          }}
          title="Load a bundled example"
        >
          <option value="">— examples —</option>
          {EXAMPLES.map((ex) => (
            <option key={ex.id} value={ex.id}>
              {ex.title}
            </option>
          ))}
        </select>
        <button className="primary" onClick={() => compile()} title="Parse, compile to a network, saturate">
          Compile ▸
        </button>
      </div>
      <div className="editor-host" ref={hostRef} />
      <div className="editor-controls">
        <label title="Scheduler budget: max rounds (checked between rounds only, never inside one)">
          budget: rounds
          <input
            className="fuel-input"
            type="number"
            min={1}
            value={budgetRounds}
            onChange={(e) => setBudgetRounds(Number(e.target.value))}
          />
        </label>
        <label title="Scheduler budget: max classes (checked between rounds only)">
          classes
          <input
            className="fuel-input"
            type="number"
            min={4}
            value={budgetClasses}
            onChange={(e) => setBudgetClasses(Number(e.target.value))}
          />
        </label>
        <label title="BSP = rounds in order · shuffled = seeded-random delta order within rounds · chaos = no rounds, one random firing at a time. The answer cannot change (CALM).">
          scheduler
          <select value={mode} onChange={(e) => setMode(e.target.value as 'bsp' | 'shuffle' | 'chaos')}>
            <option value="bsp">BSP</option>
            <option value="shuffle">BSP, shuffled</option>
            <option value="chaos">chaos (no rounds)</option>
          </select>
        </label>
        {mode !== 'bsp' && (
          <button onClick={reseed} title="Pick a new seed">
            seed {seed}
          </button>
        )}
        <label title="Demand-driven unfolding (lesson 9): only calls the program still needs are unfolded">
          <input type="checkbox" checked={demandOn} onChange={(e) => setDemandOn(e.target.checked)} />
          demand
        </label>
        {dirty && run && <span style={{ color: 'var(--amber)', fontSize: 12 }}>edited — recompile</span>}
      </div>
      <Console />
    </>
  )
}

function Console() {
  const run = useStore((s) => s.run)
  const error = useStore((s) => s.error)
  const round = useStore((s) => s.round)
  const confluence = useStore((s) => s.confluence)
  const verifyConfluence = useStore((s) => s.verifyConfluence)

  return (
    <div className="console" data-testid="console">
      {error && <div className="status-error">{error}</div>}
      {!error && !run && <div className="status-idle">Press Compile to build the network. 🐾</div>}
      {!error && run && (
        <>
          {run.soundnessViolations.length > 0 && (
            <div className="soundness-banner">
              ⚠ soundness violation — engine bug: {run.soundnessViolations[0]}
            </div>
          )}
          <div
            className={
              run.status === 'quiescent'
                ? 'status-quiescent'
                : run.status === 'budget-exhausted'
                  ? 'status-fuel'
                  : 'status-idle'
            }
          >
            {run.status === 'quiescent' && `QUIESCENT after ${run.rounds.length} rounds`}
            {run.status === 'budget-exhausted' && `BUDGET-EXHAUSTED after ${run.rounds.length} rounds`}
            {` — viewing round ${round}/${run.rounds.length}`}
          </div>
          <div className="answer">
            main = <b>{run.extraction.pretty}</b>
            {!run.extraction.isLiteral &&
              ' (cheapest known form — not a literal; raise the budget and recompile)'}
          </div>
          <div className="prov-summary">
            extraction: cost {run.extraction.cost === Infinity ? '∞' : run.extraction.cost} · {run.classCount}{' '}
            classes · {run.altCount} alternatives
            {run.seed !== null && ` · ${run.mode}, seed ${run.seed}`}
          </div>
          <div className="confluence-report">
            <button
              onClick={verifyConfluence}
              title="Run 10 seeded-shuffle executions. All quiescent → compare full canonical states; any budget-exhausted → compare extracted answers only (A3.1)"
            >
              Verify confluence ×10
            </button>
            {confluence && (
              <div className={confluence.ok ? 'confluence-ok' : 'confluence-bad'}>
                {confluence.ok ? '✓ ' : '✗ '}
                {confluence.detail}
                {confluence.ok &&
                  ` (seeds ${confluence.seeds[0]}…${confluence.seeds[confluence.seeds.length - 1]})`}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
