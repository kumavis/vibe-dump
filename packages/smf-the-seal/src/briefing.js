/* SLIME MOLD FOUNDRY — work-order briefing card (shared scenario chrome).
   Canonical copy lives at docs/slime-mold-foundry/shell/briefing.js.
   Copy VERBATIM into each package's src/ (repo rule: no cross-package
   imports). Requires smf.css.

   Usage (from a package's main.js):

     const brief = mountBriefing(rootEl, {
       workOrder: 'FOUNDRY WORK ORDER 02',
       title: 'THE JAM',
       layer: 'L2→L3 · ALERT ROUTING',
       situation: 'Six lanes want to run…',
       verbs: [
         ['CLICK JAM', 'clear it by hand'],
         ['PANEL', 'buy lanes, probes, bots, tanks'],
       ],
       objective: 'Bank the quota hands-free.',
       onOpen()  { setSpeed(0) },   // pause while the card is up
       onBegin() { setSpeed(1) },   // resume / start on BEGIN SHIFT
     })

   The card is shown immediately on mount (onOpen fires). A persistent
   BRIEF button (top-left) reopens it any time. Esc closes it too. */

export function mountBriefing(root, opts) {
  const { workOrder, title, layer, situation, verbs, objective, onOpen, onBegin } = opts

  const overlay = document.createElement('div')
  overlay.className = 'smf-brief-overlay'
  overlay.innerHTML = `
    <div class="smf-brief" role="dialog" aria-modal="true" aria-label="${title} work order">
      <div class="wo">${workOrder}</div>
      <h2>${title}</h2>
      <div class="layer">${layer}</div>
      <p class="sit">${situation}</p>
      <ul class="verbs">
        ${verbs.map(([verb, what]) => `<li><b>${verb}</b> — ${what}</li>`).join('')}
      </ul>
      <p class="obj"><b>OBJECTIVE</b> — ${objective}</p>
      <button class="smf-begin" type="button">BEGIN SHIFT ▸</button>
    </div>`

  const briefBtn = document.createElement('button')
  briefBtn.className = 'smf-briefbtn'
  briefBtn.type = 'button'
  briefBtn.textContent = '☰ BRIEF'

  let openState = false
  function open() {
    if (openState) return
    openState = true
    root.appendChild(overlay)
    onOpen && onOpen()
    overlay.querySelector('.smf-begin').focus()
  }
  function close() {
    if (!openState) return
    openState = false
    overlay.remove()
    onBegin && onBegin()
  }

  overlay.querySelector('.smf-begin').addEventListener('click', close)
  briefBtn.addEventListener('click', open)
  root.addEventListener('keydown', (e) => { if (e.key === 'Escape') close() })

  root.appendChild(briefBtn)
  open()
  return { open, close, isOpen: () => openState }
}
