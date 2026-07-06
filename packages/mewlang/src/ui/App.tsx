import { useEffect } from 'react'
import { Editor } from './Editor'
import { Graph } from './Graph'
import { Inspector } from './Inspector'
import { Timeline } from './Timeline'
import { Tutorial } from './Tutorial'
import { LESSONS, useStore } from './store'

let autoCompiled = false

export function App() {
  // Compile the bundled fib(10) once on first load so visitors land on a
  // saturating network instead of an empty pane.
  useEffect(() => {
    if (autoCompiled) return
    autoCompiled = true
    useStore.getState().compile({ autoplay: true })
  }, [])

  const rightTab = useStore((s) => s.rightTab)
  const setRightTab = useStore((s) => s.setRightTab)
  const tutorialOpen = useStore((s) => s.tutorialOpen)
  const lessonIndex = useStore((s) => s.lessonIndex)
  const stepIndex = useStore((s) => s.stepIndex)

  const spotlight =
    tutorialOpen && rightTab === 'tutorial'
      ? (LESSONS[lessonIndex]?.steps[stepIndex]?.spotlight ?? null)
      : null

  return (
    <div className="app" {...(spotlight ? { 'data-spotlight': spotlight } : {})}>
      <div className="panel panel-editor">
        <Editor />
      </div>
      <div className="panel panel-graph">
        <Graph />
      </div>
      <div className="panel panel-right">
        <div className="tabs">
          <button className={rightTab === 'inspector' ? 'active' : ''} onClick={() => setRightTab('inspector')}>
            Inspector
          </button>
          <button className={rightTab === 'tutorial' ? 'active' : ''} onClick={() => setRightTab('tutorial')}>
            Tutorial
          </button>
        </div>
        <div className="right-body">{rightTab === 'inspector' ? <Inspector /> : <Tutorial />}</div>
      </div>
      <div className="panel panel-timeline">
        <Timeline />
      </div>
    </div>
  )
}
