// Page layout: side panels (Claude Code binary, settings, workspace) and the
// chat column (start/stop, transcript, composer, log).

import { h } from './dom.js'
import { Transcript } from './transcript.js'
import { binaryPanel } from './binary-panel.js'
import { settingsPanel } from './settings-panel.js'
import { workspacePanel } from './workspace-panel.js'

/** Shown in the header, the footer and at the top of the README. */
export const UNOFFICIAL = 'Unofficial; not affiliated with or endorsed by Anthropic'

export function mountApp (root, session) {
  const status = h('span', { id: 'status', class: 'pill' })
  const transcriptEl = h('div', { id: 'transcript', class: 'transcript', 'aria-live': 'polite' })
  const transcript = new Transcript(transcriptEl)

  const start = h('button', { id: 'start', type: 'button', class: 'primary' }, 'Start Claude Code')
  const stop = h('button', { id: 'stop', type: 'button' }, 'Stop')
  const boot = h('span', { id: 'boot-status', class: 'muted' })
  start.addEventListener('click', () => session.start().catch(() => {}))
  stop.addEventListener('click', () => session.stop().catch(() => {}))

  const prompt = h('textarea', { id: 'prompt', rows: 3, placeholder: 'Message Claude Code (Enter to send, Shift+Enter for a new line)' })
  const send = h('button', { id: 'send', type: 'submit', class: 'primary' }, 'Send')
  const interrupt = h('button', { id: 'interrupt', type: 'button' }, 'Interrupt')
  const composer = h('form', { id: 'composer', class: 'composer' }, prompt, h('div', { class: 'col' }, send, interrupt))
  const submit = () => {
    const text = prompt.value.trim()
    if (!text || send.disabled) return
    try {
      session.send(text)
      prompt.value = ''
    } catch (err) {
      session.note('error', err.message)
    }
  }
  composer.addEventListener('submit', (e) => { e.preventDefault(); submit() })
  prompt.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); submit() }
  })
  interrupt.addEventListener('click', () => session.interrupt()?.catch((err) => session.note('warn', err.message)))

  const logEl = h('pre', { id: 'log', class: 'small' })
  const logPanel = h('details', { id: 'log-panel', class: 'log' }, h('summary', null, 'Log'), logEl)
  let logShown = 0
  const renderLog = () => {
    if (!logPanel.open) return
    const lines = session.log.slice(logShown).map((l) => `${new Date(l.t).toISOString().slice(11, 23)} ${l.level.padEnd(6)} ${l.msg}`)
    logShown = session.log.length
    if (lines.length) logEl.append(lines.join('\n') + '\n')
  }
  logPanel.addEventListener('toggle', renderLog)

  session.addEventListener('entry', (e) => { transcript.add(e.detail); renderLog() })

  const render = () => {
    const st = session.state
    const running = st.harness === 'booting' || st.harness === 'ready'
    start.disabled = running || (!session.fake && st.cache !== 'present')
    stop.disabled = !running
    send.disabled = st.harness !== 'ready' || st.busy
    interrupt.disabled = st.harness !== 'ready' || !st.busy
    const label = st.harness === 'ready' ? (st.busy ? 'working' : 'ready')
      : st.harness === 'booting' ? 'starting'
        : st.lock === 'other-tab' ? 'open in another tab'
          : st.cache === 'extracting' ? 'extracting'
            : st.harness === 'exited' ? 'stopped'
              : st.cache === 'present' || session.fake ? 'not started' : 'needs Claude Code'
    status.textContent = session.fake ? `${label} (fake worker)` : label
    status.dataset.state = st.harness === 'ready' ? 'ok' : st.harness === 'booting' || st.cache === 'extracting' ? 'busy' : 'idle'
    boot.textContent = st.harness === 'booting' && st.boot ? bootText(st.boot) : ''
    root.dataset.harness = st.harness
    root.dataset.cache = st.cache
    root.dataset.lock = st.lock
    start.title = st.lock === 'other-tab' ? 'Claude Code is open in another tab of this site' : ''
  }
  session.addEventListener('change', render)

  root.append(
    h('header', { class: 'top' },
      h('h1', null, 'Claude Code ', h('span', { class: 'muted' }, 'in your browser')),
      h('span', { id: 'unofficial', class: 'unofficial muted' }, UNOFFICIAL),
      status),
    h('div', { class: 'layout' },
      h('aside', { class: 'side' }, binaryPanel(session), settingsPanel(session), workspacePanel(session)),
      h('main', { class: 'chat' },
        h('div', { class: 'session-bar' }, start, stop, boot),
        transcriptEl,
        composer,
        logPanel)),
    h('footer', { class: 'foot muted' },
      `${UNOFFICIAL}. Runs the official Claude Code JavaScript from your own copy, in a Worker in this tab. No server; your key or token stays in this browser (this tab only, unless you tick "Remember on this device") and goes only to the API base URL. `,
      h('a', { href: 'https://github.com/kumavis/vibe-dump/tree/main/packages/claude-code-web#readme', target: '_blank', rel: 'noopener' }, 'How it works and its limits')))
  render()
  return { transcript }
}

function bootText (b) {
  if (b.total) return `${b.phase}: ${b.done ?? 0}/${b.total}`
  return b.phase ? `${b.phase}…` : ''
}
