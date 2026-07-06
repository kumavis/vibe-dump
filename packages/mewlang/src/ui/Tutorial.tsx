import { lessonCtx, useStore, LESSONS } from './store'

export function Tutorial() {
  const tutorialOpen = useStore((s) => s.tutorialOpen)
  const lessonIndex = useStore((s) => s.lessonIndex)
  const stepIndex = useStore((s) => s.stepIndex)
  const completed = useStore((s) => s.completedLessons)
  const startTutorial = useStore((s) => s.startTutorial)
  const exitTutorial = useStore((s) => s.exitTutorial)
  const gotoLesson = useStore((s) => s.gotoLesson)
  const nextStep = useStore((s) => s.nextStep)
  const prevStep = useStore((s) => s.prevStep)
  // Subscribe to everything the checkpoint predicates might look at.
  const checkpointDone = useStore((s) => {
    if (!s.tutorialOpen) return false
    const lesson = LESSONS[s.lessonIndex]
    return lesson ? lesson.checkpoint.test(lessonCtx(s)) : false
  })

  if (!tutorialOpen) {
    return (
      <div className="tutorial-idle">
        <p>
          <b>New here?</b> The tutorial walks through nine short lessons: e-graphs, lattice cells,
          propagator rules, BSP rounds, branching, recursion &amp; budget, structural memoization,
          confluence, and demand-driven evaluation.
        </p>
        <p>Each lesson loads a program, drives the app, and ends with a small hands-on checkpoint.</p>
        <button className="primary" onClick={startTutorial}>
          Start the tutorial 🐾
        </button>
      </div>
    )
  }

  const lesson = LESSONS[lessonIndex]
  const step = lesson.steps[stepIndex]
  const isLastStep = stepIndex === lesson.steps.length - 1
  const isLastLesson = lessonIndex === LESSONS.length - 1
  const allDone = completed.length === LESSONS.length

  return (
    <div className="tutorial">
      <div className="lesson-nav">
        {LESSONS.map((l, i) => (
          <button
            key={l.id}
            className={`${i === lessonIndex ? 'current' : ''} ${completed.includes(i) ? 'done' : ''}`}
            onClick={() => gotoLesson(i)}
            title={l.title}
          >
            {completed.includes(i) ? '✓' : i + 1}
          </button>
        ))}
        <span className="spacer" />
        <button onClick={exitTutorial} title="leave the tutorial">
          ✕
        </button>
      </div>

      <h3>{lesson.title}</h3>
      <div className="step-count">
        step {stepIndex + 1} of {lesson.steps.length}
      </div>
      <p className="prose">{step.prose}</p>

      {lesson.illustration === 'tree-vs-dag' && isLastStep === false && stepIndex === 0 && <TreeVsDag />}

      <div className={`checkpoint ${checkpointDone ? 'done' : 'pending'}`}>
        <span className="badge">{checkpointDone ? '✓ checkpoint met' : '● checkpoint'}</span>
        {lesson.checkpoint.text}
      </div>

      <div className="step-controls">
        <button onClick={prevStep} disabled={lessonIndex === 0 && stepIndex === 0}>
          ← back
        </button>
        {!isLastStep && (
          <button className="primary" onClick={nextStep}>
            next →
          </button>
        )}
        {isLastStep && !isLastLesson && (
          <button className="primary" onClick={nextStep} disabled={!checkpointDone}>
            next lesson →
          </button>
        )}
        {isLastStep && isLastLesson && (
          <button className="primary" onClick={nextStep} disabled={!checkpointDone}>
            finish
          </button>
        )}
        <span className="spacer" />
        <button onClick={() => gotoLesson(lessonIndex)} title="reload this lesson's program and state">
          ↻ reset
        </button>
      </div>

      {allDone && (
        <div className="finished">
          🎉 All nine lessons complete. You now know why monotone joins make scheduling a free
          variable. Go edit fib(10) into fib(12) and watch 144 fall out.
        </div>
      )}
    </div>
  )
}

/** Static illustration for lesson 7: exponential call tree vs the hash-consed DAG. */
function TreeVsDag() {
  const treeNodes: { x: number; y: number; k: number }[] = []
  const treeEdges: [number, number][] = []
  // depth-4 call tree of fib(4)
  const build = (k: number, x: number, y: number, spread: number, parent: number | null) => {
    const idx = treeNodes.length
    treeNodes.push({ x, y, k })
    if (parent !== null) treeEdges.push([parent, idx])
    if (k >= 2) {
      build(k - 1, x - spread, y + 26, spread / 2.1, idx)
      build(k - 2, x + spread, y + 26, spread / 2.1, idx)
    }
  }
  build(4, 105, 14, 46, null)
  const dag = [4, 3, 2, 1, 0].map((k, i) => ({ k, x: 285, y: 14 + i * 26 }))
  const dagEdges: [number, number, number][] = [
    [0, 1, -1],
    [0, 2, 1],
    [1, 2, -1],
    [1, 3, 1],
    [2, 3, -1],
    [2, 4, 1],
    [3, 4, -1],
  ]
  return (
    <div className="illustration">
      <svg viewBox="0 0 340 150">
        <text x={105} y={148} textAnchor="middle" fill="var(--text-dim)" fontSize={9}>
          call tree: 2ⁿ calls
        </text>
        <text x={285} y={148} textAnchor="middle" fill="var(--text-dim)" fontSize={9}>
          e-graph: n+1 classes
        </text>
        {treeEdges.map(([a, b], i) => (
          <line
            key={i}
            x1={treeNodes[a].x}
            y1={treeNodes[a].y}
            x2={treeNodes[b].x}
            y2={treeNodes[b].y}
            stroke="#454f6b"
            strokeWidth={0.8}
          />
        ))}
        {treeNodes.map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r={7} fill="#3b4666" stroke="#566089" strokeWidth={0.8} />
            <text x={n.x} y={n.y + 2.5} textAnchor="middle" fill="var(--text)" fontSize={7}>
              {n.k}
            </text>
          </g>
        ))}
        {dagEdges.map(([a, b, side], i) => (
          <path
            key={i}
            d={`M${dag[a].x},${dag[a].y + 7} Q${dag[a].x + side * 26},${(dag[a].y + dag[b].y) / 2} ${dag[b].x},${dag[b].y - 7}`}
            fill="none"
            stroke="#454f6b"
            strokeWidth={0.8}
          />
        ))}
        {dag.map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r={8} fill="#2f4d2a" stroke="var(--green)" strokeWidth={0.8} />
            <text x={n.x} y={n.y + 2.5} textAnchor="middle" fill="var(--text)" fontSize={7}>
              {n.k}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
