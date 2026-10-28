// Page entry. `?fake` swaps the real Worker (runtime/boot.js running Claude
// Code) for src/host/fake-worker.js, to work on the page without the harness.
// Diagnostics, shown in the page log: `?trace` (every spawn, fetch and Worker
// the CLI starts) and `?debug` (the CLI's own --debug-to-stderr output).
//
// window.__cc is the test hook (test/e2e.mjs), defined only when the page is
// loaded with `?test`: it reaches the session, and through it the settings
// with the credential, so a normal visit exposes nothing on window (the
// origin is shared with other apps; see host/settings.js). Its own
// `__cc.settings` is the redacted view (no API key or token).
//   __cc.session            the Session (state, settings, workspace, log, timings)
//   __cc.harness            the current Harness, or null
//   __cc.ready              resolves once the cache and saved workspace are loaded
//   __cc.whenSaved()        resolves once every workspace snapshot so far is saved (OPFS)
//   __cc.start(), stop(), send(text), turn(text, {timeoutMs}), interrupt()
//   __cc.messages, toolCalls  every stream-json message / page tool call so far
//   __cc.workspaceFiles()   relative paths in /home/user/workspace
//   __cc.workspaceText(rel) UTF-8 text of one workspace file (last fs-sync), or null
//   __cc.waitFor(pred, {timeoutMs, fromIndex}) on the stream-json messages
//   __cc.chatgpt            Sign in with ChatGPT status (signedIn, clientId, email, plan, expiresAt; no token)

import { Session } from './host/session.js'
import { readText } from './host/snapshot.js'
import { WORKSPACE } from './host/constants.js'
import { mountApp } from './ui/app.js'
import './ui/style.css'

const params = new URLSearchParams(location.search)
const session = new Session({ fake: params.has('fake'), diagnostics: { trace: params.has('trace'), cliDebug: params.has('debug') } })
const root = document.getElementById('app')
mountApp(root, session)
session.flushOnHide(window)

if (params.has('test')) window.__cc = testHook(session)

function testHook (session) {
  return {
    session,
    get settings () { return session.settings.getPublic() },
    get harness () { return session.harness },
    get state () { return session.state },
    get messages () { return session.messages },
    get toolCalls () { return session.toolCalls },
    get timings () { return session.timings },
    get chatgpt () { return session.siwc.status() },
    ready: session.ready,
    whenSaved: () => session.whenSaved(),
    start: () => session.start(),
    stop: () => session.stop(),
    send: (text) => session.send(text),
    turn: (text, opts) => session.turn(text, opts),
    interrupt: () => session.interrupt(),
    extractFile: (file) => session.extractFile(file),
    download: () => session.download(),
    workspaceFiles: () => session.workspace.files.map((f) => f.rel),
    workspaceText: (rel) => readText(session.workspace.snapshot, `${WORKSPACE}/${rel}`),
    waitFor: (pred, opts) => {
      if (!session.harness) return Promise.reject(new Error('not started'))
      return session.harness.waitFor(pred, opts)
    }
  }
}
