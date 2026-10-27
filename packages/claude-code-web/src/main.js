// Page entry. `?fake` swaps the real Worker (runtime/boot.js running Claude
// Code) for src/host/fake-worker.js, to work on the page without the harness.
//
// window.__cc is the test hook (test/e2e.mjs):
//   __cc.session            the Session (state, settings, workspace, log, timings)
//   __cc.harness            the current Harness, or null
//   __cc.ready              resolves once the cache and saved workspace are loaded
//   __cc.start(), stop(), send(text), turn(text, {timeoutMs}), interrupt()
//   __cc.messages, toolCalls  every stream-json message / page tool call so far
//   __cc.workspaceFiles()   relative paths in /home/user/workspace
//   __cc.waitFor(pred, {timeoutMs, fromIndex}) on the stream-json messages

import { Session } from './host/session.js'
import { mountApp } from './ui/app.js'
import './ui/style.css'

const params = new URLSearchParams(location.search)
const session = new Session({ fake: params.has('fake') })
const root = document.getElementById('app')
mountApp(root, session)

window.__cc = {
  session,
  get harness () { return session.harness },
  get state () { return session.state },
  get messages () { return session.messages },
  get toolCalls () { return session.toolCalls },
  get timings () { return session.timings },
  ready: session.ready,
  start: () => session.start(),
  stop: () => session.stop(),
  send: (text) => session.send(text),
  turn: (text, opts) => session.turn(text, opts),
  interrupt: () => session.interrupt(),
  extractFile: (file) => session.extractFile(file),
  download: () => session.download(),
  workspaceFiles: () => session.workspace.files.map((f) => f.rel),
  waitFor: (pred, opts) => {
    if (!session.harness) return Promise.reject(new Error('not started'))
    return session.harness.waitFor(pred, opts)
  }
}
