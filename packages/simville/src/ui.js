// The panel, the HUD and everything the player can press.
//
// The rail is re-rendered from scratch a few times a second rather than
// diffed — it's a few dozen nodes and the simulation is the interesting part of
// the frame budget — except for the interview answer, which streams and would
// be wiped by a re-render, so it's written in place.

import { MODELS, SCRIPTED } from './brain.js'
import { SEED_RUMOURS } from './cast.js'
import { ACTION_BY_ID, TOOLS, toolName } from './objects.js'
import { clockOf, escapeHtml, timeOfDay } from './util.js'

// Observations already read as "saw X at Y", so tagging them "saw" stutters.
// They're also most of the stream, and leaving them untagged is what makes the
// handful of tagged records — the rumours and the reflections — stand out.
const KIND_LABEL = {
  object: 'thing',
  dialogue: 'talk',
  reflection: 'thought',
  plan: 'plan',
  rumor: 'rumour',
}

export class UI {
  constructor(sim, brain, renderer, controls) {
    this.sim = sim
    this.brain = brain
    this.renderer = renderer
    this.controls = controls
    this.lastRail = 0
    this.lastEventCount = -1
    this.asking = false
    this.answer = null
    this.answerSource = null
    this.draftQuestion = ''

    this.el = {
      app: document.getElementById('app'),
      clock: document.getElementById('clock'),
      day: document.getElementById('day'),
      tod: document.getElementById('tod'),
      log: document.getElementById('log'),
      rail: document.getElementById('rail'),
      railBody: document.getElementById('rail-body'),
      back: document.getElementById('back'),
      panelClose: document.getElementById('panelclose'),
      railOpen: document.getElementById('railopen'),
      wake: document.getElementById('wake'),
      wakeLabel: document.getElementById('wake-label'),
      sheet: document.getElementById('sheet'),
      sheetClose: document.getElementById('sheetclose'),
      modelList: document.getElementById('modellist'),
      loadbar: document.getElementById('loadbar'),
      loadfill: document.getElementById('loadfill'),
      loadtext: document.getElementById('loadtext'),
      brains: document.getElementById('brains'),
      restart: document.getElementById('restart'),
      toast: document.getElementById('toast'),
      canvas: document.getElementById('town'),
    }
  }

  mount() {
    const { el } = this

    for (const b of document.querySelectorAll('.speeds button')) {
      b.addEventListener('click', () => {
        for (const other of document.querySelectorAll('.speeds button')) other.classList.remove('on')
        b.classList.add('on')
        this.controls.setSpeed(Number(b.dataset.speed))
      })
    }

    // Two-step, because one stray click would otherwise wipe eight memory
    // streams and there's no undo for that.
    el.restart.addEventListener('click', () => {
      if (this._armed) {
        clearTimeout(this._armTimer)
        this._armed = false
        el.restart.textContent = '⟳'
        el.restart.classList.remove('armed')
        this.controls.restart()
        return
      }
      this._armed = true
      el.restart.textContent = '?'
      el.restart.classList.add('armed')
      this.toast('Start over? Press again. Everything they remember goes.', 3400)
      this._armTimer = setTimeout(() => {
        this._armed = false
        el.restart.textContent = '⟳'
        el.restart.classList.remove('armed')
      }, 3400)
    })

    el.panelClose.addEventListener('click', () => this.setRail(false))
    el.railOpen.addEventListener('click', () => this.setRail(true))
    el.back.addEventListener('click', () => this.select(null))

    el.wake.addEventListener('click', () => {
      if (this.brain.status !== 'loading') this.openSheet()
    })
    el.sheetClose.addEventListener('click', () => this.closeSheet())
    el.sheet.addEventListener('click', (e) => {
      if (e.target === el.sheet) this.closeSheet()
    })

    el.canvas.addEventListener('click', (e) => {
      const hit = this.renderer.pickAgent(e.clientX, e.clientY)
      this.select(hit ? hit.id : null)
      if (hit) this.setRail(true)
    })
    el.canvas.addEventListener('mousemove', (e) => {
      const hit = this.renderer.pickAgent(e.clientX, e.clientY)
      this.renderer.hover = hit ? hit.id : null
      el.canvas.style.cursor = hit ? 'pointer' : 'default'
    })
    el.canvas.addEventListener('mouseleave', () => {
      this.renderer.hover = null
    })

    window.addEventListener('keydown', (e) => {
      if (e.target.matches('input, textarea')) return
      if (e.key === 'Escape') this.select(null)
      if (e.key === ' ') {
        e.preventDefault()
        this.controls.togglePause()
      }
    })

    this.renderModels()
    this.brain.onChange(() => this.renderBrainState())
    this.renderBrainState()
    this.renderRail(true)
  }

  // Point the panel at a new town. The model, if one is loaded, stays loaded.
  setSim(sim) {
    this.sim = sim
    this.lastEventCount = -1
    this.answer = null
    this.answerSource = null
    this.draftQuestion = ''
    this.el.back.hidden = true
    this.renderRail(true)
  }

  setRail(open) {
    this.el.app.classList.toggle('rail-hidden', !open)
    this.el.railOpen.hidden = open
    // The canvas just changed size.
    requestAnimationFrame(() => this.controls.resize())
  }

  select(id) {
    this.sim.selected = id
    this.answer = null
    this.answerSource = null
    this.draftQuestion = ''
    this.el.back.hidden = !id
    this.renderRail(true)
  }

  toast(text, ms = 2600) {
    const { toast } = this.el
    toast.textContent = text
    toast.hidden = false
    clearTimeout(this._toastTimer)
    this._toastTimer = setTimeout(() => {
      toast.hidden = true
    }, ms)
  }

  // ------------------------------------------------------------- per frame ---

  tick() {
    const sim = this.sim
    this.el.clock.textContent = clockOf(sim.time)
    this.el.day.textContent = `Day ${sim.day}`
    this.el.tod.textContent = timeOfDay(sim.time)

    if (sim.events.length !== this.lastEventCount) {
      this.lastEventCount = sim.events.length
      const recent = sim.events.slice(-6)
      this.el.log.innerHTML = recent
        .map((e) => `<div class="${e.kind}">${escapeHtml(e.text)}</div>`)
        .join('')
    }

    const now = performance.now()
    if (now - this.lastRail > 400) {
      this.lastRail = now
      this.renderRail(false)
    }
  }

  renderBrainState() {
    const { wake, wakeLabel, loadbar, loadfill, loadtext, brains } = this.el
    const b = this.brain
    wake.dataset.state = b.status

    // The one always-visible line about which half of this is real. Somebody
    // who reads nothing else should still not come away thinking a language
    // model wrote the speech bubbles when it didn't.
    const model = MODELS.find((m) => m.id === b.modelId)?.label ?? 'the model'
    brains.textContent = b.isLive
      ? `eight residents · real memories, words by ${model}`
      : 'eight residents · real memories, scripted words'
    const installed = `${b.mode}:${b.modelId ?? ''}`
    if (installed !== this._installed) {
      const wasScripted = this._installed?.startsWith('scripted')
      this._installed = installed
      this.renderModels()
      // Swapping the grammar out for a model takes effect immediately, backlog
      // and all — see Simulation#dropScriptedWords.
      if (b.isLive && wasScripted !== false) this.sim.dropScriptedWords()
    }
    if (b.status === 'loading') {
      wakeLabel.textContent = `Loading… ${Math.round(b.progress * 100)}%`
      loadbar.hidden = false
      loadfill.style.width = `${Math.round(b.progress * 100)}%`
      loadtext.textContent = b.detail
    } else if (b.status === 'live') {
      const tps = b.stats?.tps ?? 0
      wakeLabel.textContent = tps > 1 ? `Thinking · ${tps.toFixed(0)} tok/s` : 'Minds awake'
      loadbar.hidden = true
      loadtext.textContent = ''
      if (!this._announced) {
        this._announced = true
        this.closeSheet()
        this.toast('The model is in. Everything they say from here is theirs.', 4200)
      }
    } else if (b.status === 'failed') {
      wakeLabel.textContent = 'Couldn’t load'
      loadbar.hidden = true
      loadtext.textContent = b.error ?? ''
      this._announced = false
    } else {
      wakeLabel.textContent = 'Wake the minds'
      loadbar.hidden = true
      loadtext.textContent = ''
      this._announced = false
    }
  }

  renderModels() {
    const current = this.brain.mode === 'live' ? this.brain.modelId : SCRIPTED.id
    this.el.modelList.innerHTML = [SCRIPTED, ...MODELS]
      .map(
        (m) => `
      <button type="button" data-model="${escapeHtml(m.id)}" ${m.id === current ? 'class="on"' : ''}>
        <span class="label">${escapeHtml(m.label)}</span>
        <span class="note">${escapeHtml(m.note)}</span>
        ${m.id === current ? '<span class="badge">installed</span>' : ''}
      </button>`,
      )
      .join('')
    for (const b of this.el.modelList.querySelectorAll('button')) {
      b.addEventListener('click', () => {
        if (b.dataset.model === SCRIPTED.id) {
          this.brain.sleep()
          this.closeSheet()
          this.toast('Back to the grammar. The header will say so.')
        } else {
          this.brain.wake(b.dataset.model)
        }
      })
    }
  }

  openSheet() {
    this.el.sheet.hidden = false
  }

  closeSheet() {
    this.el.sheet.hidden = true
  }

  // ----------------------------------------------------------------- rail ---

  renderRail(force) {
    const sim = this.sim
    const id = sim.selected
    // Don't rip the DOM out from under a half-typed question.
    if (!force && document.activeElement?.closest?.('#rail-body')) return
    this.el.railBody.innerHTML = id ? this.#agentHtml(sim.byId.get(id)) : this.#townHtml()
    this.#wireRail()
  }

  #townHtml() {
    const sim = this.sim
    const cast = sim.agents
      .map(
        (a) => `
      <button type="button" data-agent="${a.id}">
        <span class="dot" style="background:${a.def.color}"></span>
        <span class="who">
          <span class="nm">${escapeHtml(a.name)}</span>
          <span class="dg">${escapeHtml(a.doing)}</span>
        </span>
        ${a.conversation != null ? '<span class="badge">talking</span>' : ''}
        ${a.plannedBy === 'model' ? '<span class="badge">own idea</span>' : ''}
      </button>`,
      )
      .join('')

    const rumours = sim.rumours.length
      ? sim.rumours
          .slice()
          .reverse()
          .map((r) => {
            const pct = Math.round((r.knowers.size / sim.agents.length) * 100)
            const who = [...r.knowers].map((k) => sim.byId.get(k).firstName).join(', ')
            return `<div class="rumour">
              <q>${escapeHtml(r.text)}</q>
              <div class="bar"><i style="width:${pct}%"></i></div>
              <div class="meta">${r.knowers.size}/${sim.agents.length} know it — ${escapeHtml(who)}</div>
            </div>`
          })
          .join('')
      : '<p>Nothing going round yet.</p>'

    const options = SEED_RUMOURS.map((r) => `<option value="${escapeHtml(r)}">${escapeHtml(r)}</option>`).join('')

    return `
      <h3>The town</h3>
      <p>
        Everyone keeps a schedule, notices who they pass, and remembers it. Stop two of them next to each other
        and they talk; what gets said goes into both their memory streams and comes back out later.
      </p>
      <p>
        ${
          this.brain.isLive
            ? 'The schedules, memories and rumours are simulated. The words are being written, right now, by the model on your GPU.'
            : 'The schedules, memories and rumours are simulated. The words are not — every line is stitched from a grammar per resident, until you wake the minds.'
        }
      </p>

      <h3>Who’s about</h3>
      <div class="cast">${cast}</div>

      <h3>Where everything is</h3>
      <p>Nobody in town can see this list. They only know what they’ve seen or been told.</p>
      <div class="things">
        ${TOOLS.map((def) => {
          const t = sim.tools.get(def.id)
          const holder = t.holder ? sim.byId.get(t.holder) : null
          const hunted = sim.agents.find((a) => a.wants === def.id)
          return `<div class="thing${hunted ? ' hunted' : ''}">
            <span class="nm">${escapeHtml(def.name)}</span>
            <span class="wh">${
              holder
                ? `held by ${escapeHtml(holder.firstName)}`
                : escapeHtml(sim.placeWords(t.x, t.y))
            }</span>
            ${hunted ? `<span class="badge">${escapeHtml(hunted.firstName)} is hunting</span>` : ''}
          </div>`
        }).join('')}
      </div>

      <h3>Going round</h3>
      ${rumours}
      <div class="plant">
        <select id="rumourpick">${options}</select>
      </div>
      <div class="plant">
        <input type="text" id="rumourtext" placeholder="…or make one up" maxlength="90" />
        <button type="button" class="go" id="rumourgo">Let it slip</button>
      </div>
      <p class="src">Goes to whoever you have selected, or to someone at random. Watch where it gets to by evening.</p>

      <h3>The model</h3>
      <p>
        ${
          this.brain.isLive
            ? `Running <strong>${escapeHtml(MODELS.find((m) => m.id === this.brain.modelId)?.label ?? this.brain.modelId)}</strong> on your GPU. Every line of dialogue, every reflection, every free-time decision and every answer is the model's. When it's too busy to speak for a conversation, that conversation happens quietly — nothing is ever swapped back to the grammar behind your back.`
            : 'Simville is running on a grammar per resident plus memory retrieval — scripted, and labelled as such. Press <strong>Wake the minds</strong> to hand the words to a real language model running in this tab on your own GPU.'
        }
      </p>
      ${
        this.brain.isLive
          ? `<p class="src">${this.sim.stats.modelActions} decisions made by the model · ${this.sim.stats.conversations} conversations · ${this.sim.stats.reflections} reflections${
              this.brain.stats?.skipped ? ` · ${this.brain.stats.skipped} too busy to speak for` : ''
            }</p>`
          : ''
      }
    `
  }

  #agentHtml(a) {
    const sim = this.sim
    const place = sim.whereIs(a)
    const mems = a.memory.items
      .slice(-26)
      .reverse()
      .map((m) => {
        const day = Math.floor((m.t - 7 * 60) / 1440) + 1
        const tag = KIND_LABEL[m.kind]
        return `<div class="mem k-${m.kind}">
          <span class="imp" style="opacity:${0.25 + m.importance / 13}"></span>
          <span class="t">${clockOf(m.t)}${day !== sim.day ? `<br><span style="opacity:.6">d${day}</span>` : ''}</span>
          <span class="tx">${tag ? `<b>${tag}</b> ` : ''}${escapeHtml(m.text)}</span>
        </div>`
      })
      .join('')

    const ties = sim.agents
      .filter((o) => o !== a)
      .map((o) => ({ o, v: sim.tie(a.id, o.id) }))
      .sort((x, y) => y.v - x.v)
      .map(
        ({ o, v }) => `<div class="tie">
          <span class="nm">${escapeHtml(o.firstName)}</span>
          <span class="bar"><i style="width:${Math.round(((v + 1) / 2) * 100)}%"></i></span>
        </div>`,
      )
      .join('')

    const rumours = a.knownRumours()

    return `
      <div class="who-head">
        <span class="dot" style="background:${a.def.color}"></span>
        <div>
          <h2>${escapeHtml(a.name)}</h2>
          <div class="role">${escapeHtml(a.role)}${a.plannedBy === 'model' ? ' · acting on their own' : ''}</div>
        </div>
      </div>
      <p>${escapeHtml(a.def.bio)}</p>

      <h3>Right now</h3>
      <div class="doing">
        ${escapeHtml(a.doing)}
        <span class="where">at ${escapeHtml(place.short)} · ${escapeHtml(timeOfDay(sim.time))}</span>
        ${a.reason ? `<span class="why">own reason: ${escapeHtml(a.reason)}</span>` : ''}
        ${a.carrying ? `<span class="holding">carrying the ${escapeHtml(toolName(a.carrying))}</span>` : ''}
      </div>
      ${
        a.errand
          ? `<div class="job${a.wants ? ' stuck' : ''}">
              <b>${escapeHtml(ACTION_BY_ID.get(a.errand.action)?.doing ?? a.errand.action)}</b>
              ${
                a.wants
                  ? `<span>Can’t find the ${escapeHtml(toolName(a.wants))}, and has no memory of seeing it. Asking around.</span>`
                  : `<span>needs the ${escapeHtml(toolName(a.errand.tool))} — ${escapeHtml(
                      a.errand.stage === 'do' ? 'at it now' : a.errand.stage === 'carry' ? 'has it, on the way' : 'going to fetch it',
                    )}</span>`
              }
              ${a.frustration > 0.05 ? `<span class="bar"><i style="width:${Math.round(a.frustration * 100)}%"></i></span>` : ''}
            </div>`
          : ''
      }

      ${a.thought ? `<h3>Last thought</h3><div class="thought">${escapeHtml(a.thought)}</div>` : ''}

      <h3>Ask them something</h3>
      <div class="plant">
        <textarea id="q" rows="2" maxlength="180" placeholder="What have you heard today?"></textarea>
      </div>
      <div class="plant">
        <button type="button" class="go" id="ask" ${this.asking ? 'disabled' : ''}>
          ${this.asking ? 'Thinking…' : 'Ask'}
        </button>
      </div>
      <div class="answer" id="answer">${this.answer ? escapeHtml(this.answer) : ''}</div>
      ${
        this.answerSource
          ? `<p class="src">${
              this.answerSource === 'live'
                ? 'generated by the model, just now'
                : this.answerSource === 'offline'
                  ? 'stitched from the grammar — load a model for a real answer'
                  : 'no answer generated'
            }</p>`
          : ''
      }

      ${
        rumours.length
          ? `<h3>Believes</h3>${rumours.map((r) => `<div class="rumour"><q>${escapeHtml(r.text)}</q></div>`).join('')}`
          : ''
      }

      <h3>Feelings about everyone</h3>
      <div class="ties">${ties}</div>

      <h3>Memory stream</h3>
      <div class="mems">${mems}</div>
    `
  }

  #wireRail() {
    const body = this.el.railBody

    for (const b of body.querySelectorAll('[data-agent]')) {
      b.addEventListener('click', () => this.select(b.dataset.agent))
    }

    const go = body.querySelector('#rumourgo')
    if (go) {
      go.addEventListener('click', () => {
        const free = body.querySelector('#rumourtext').value.trim()
        const text = free || body.querySelector('#rumourpick').value
        if (!text) return
        const r = this.sim.plantRumour(text, this.sim.selected)
        const who = this.sim.byId.get(r.origin).firstName
        this.toast(`${who} has heard it. Now we wait.`)
        this.renderRail(true)
      })
    }

    const ask = body.querySelector('#ask')
    if (ask) {
      const field = body.querySelector('#q')
      field.value = this.draftQuestion
      field.addEventListener('input', () => {
        this.draftQuestion = field.value
      })
      field.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault()
          ask.click()
        }
      })
      ask.addEventListener('click', () => this.#ask(field.value.trim()))
    }
  }

  async #ask(question) {
    if (!question || this.asking) return
    const id = this.sim.selected
    this.asking = true
    this.answer = ''
    this.answerSource = null
    this.draftQuestion = ''
    this.renderRail(true)
    const target = this.el.railBody.querySelector('#answer')
    try {
      const res = await this.sim.interview(id, question, (partial) => {
        this.answer = partial
        // Written straight into the node: a full re-render mid-stream would
        // drop the caret and flicker.
        if (target && this.sim.selected === id) target.textContent = partial
      })
      // Null means the model couldn't answer. Say that, rather than hand back
      // a grammar line the player would read as the model's.
      this.answer = res?.text ?? 'The model couldn’t answer that one — it may still be busy. Try again.'
      this.answerSource = res?.source ?? 'failed'
    } catch (err) {
      this.answer = 'They look at you, and say nothing.'
      this.answerSource = 'failed'
      console.warn('[simville] interview failed:', err)
    } finally {
      this.asking = false
      this.renderRail(true)
    }
  }
}
