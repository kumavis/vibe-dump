// All DOM: HUD, bottom sheets, toasts, banners, overlays.
// Reads state freely; every mutation goes through handlers.run(simFn, ...args)
// so main.js can save + resync the 3D world in one place.

import { SPECIES, BUILDINGS, FENCES, ADS, DISASTERS, ECON, plotPrice, fmtMoney, fmtShort } from './data.js'
import * as sim from './sim.js'
import { lineChart, barChart, attachTooltip, CHART } from './charts.js'

const $ = (sel) => document.querySelector(sel)

const TONE_ICON = { good: '✅', bad: '🚨', info: '💬', celebrate: '🏆' }

export class UI {
  constructor(handlers) {
    this.h = handlers // { get s(), run, speed, reset, speedLabel }
    this.sheet = null // { type, plotId?, dinoId? }
    this.buildHUD()
    this.buildNav()
    $('#sheet-close').addEventListener('click', () => this.closeSheet())
    $('#sheet-backdrop').addEventListener('click', () => this.closeSheet())
    $('#banner').addEventListener('click', () => this.openSheet({ type: 'dinos' }))
    this.refresh()
  }

  get s() {
    return this.h.s
  }

  // ------------------------------------------------------------ chrome

  buildHUD() {
    $('#hud').innerHTML = `
      <div class="chip chip-money" id="hud-money"></div>
      <div class="chip" id="hud-day"></div>
      <div class="chip" id="hud-vis" title="Guests today"></div>
      <div class="chip chip-rep" id="hud-rep" title="Reputation"></div>
      <button class="chip chip-btn" id="hud-speed"></button>
    `
    $('#hud-speed').addEventListener('click', () => {
      this.h.speed()
      this.updateHUD()
    })
    $('#hud-rep').addEventListener('click', () => this.openSheet({ type: 'books' }))
  }

  buildNav() {
    $('#navbar').innerHTML = `
      <button data-nav="dinos"><span>🦕</span>Dinos</button>
      <button data-nav="ads"><span>📣</span>Promote</button>
      <button data-nav="books"><span>📊</span>Books</button>
      <button data-nav="help"><span>❔</span>Help</button>
    `
    for (const btn of document.querySelectorAll('#navbar button')) {
      btn.addEventListener('click', () => {
        const type = btn.dataset.nav
        if (this.sheet?.type === type) this.closeSheet()
        else this.openSheet({ type })
      })
    }
  }

  updateHUD(dayProgress = this.lastProgress ?? 0) {
    this.lastProgress = dayProgress
    const s = this.s
    const money = $('#hud-money')
    money.textContent = fmtShort(s.money)
    money.classList.toggle('debt', s.money < 0)
    const phase = dayProgress < 0.25 ? '🌅' : dayProgress < 0.6 ? '☀️' : dayProgress < 0.85 ? '🌇' : '🌙'
    $('#hud-day').textContent = `${phase} Day ${s.day}`
    $('#hud-vis').textContent = `👥 ${s.visitors}`
    const stars = Math.round(s.rep / 20)
    $('#hud-rep').textContent = '★'.repeat(stars) + '☆'.repeat(5 - stars)
    $('#hud-speed').textContent = this.h.speedLabel()
  }

  refresh() {
    this.updateHUD()
    this.updateBanner()
    if (this.sheet) this.renderSheet()
    this.updateOverlay()
  }

  updateBanner() {
    const s = this.s
    const banner = $('#banner')
    const esc = sim.escapees(s)
    if (esc.length) {
      const sp = SPECIES[esc[0].sp]
      banner.className = 'bad'
      banner.innerHTML = `🚨 <b>${esc.length > 1 ? `${esc.length} dinosaurs are` : `A ${sp.name} is`} loose!</b> Tap the dino to send rangers`
      banner.hidden = false
    } else if (s.disaster) {
      const d = DISASTERS[s.disaster.key]
      banner.className = 'warn'
      banner.innerHTML = `${d.icon} <b>${d.name}</b> — ${s.disaster.days} day${s.disaster.days > 1 ? 's' : ''} left`
      banner.hidden = false
    } else if (s.ad) {
      const ad = ADS[s.ad.key]
      banner.className = 'good'
      banner.innerHTML = `${ad.icon} <b>${ad.name}</b> — ${s.ad.days} day${s.ad.days > 1 ? 's' : ''} left`
      banner.hidden = false
    } else {
      banner.hidden = true
    }
  }

  toast(icon, text, tone = 'info') {
    const el = document.createElement('div')
    el.className = `toast ${tone}`
    el.innerHTML = `<span>${icon}</span>${text}`
    const box = $('#toasts')
    box.appendChild(el)
    while (box.children.length > 3) box.firstChild.remove()
    setTimeout(() => {
      el.classList.add('bye')
      setTimeout(() => el.remove(), 400)
    }, 3800)
  }

  handleEvents(events) {
    for (const ev of events) {
      this.toast(ev.icon ?? TONE_ICON[ev.tone] ?? '💬', ev.text, ev.tone)
      if (ev.tone === 'celebrate') this.celebrate()
    }
  }

  hint(text) {
    const el = $('#hint')
    el.textContent = text
    el.hidden = !text
  }

  // ------------------------------------------------------------ overlays

  updateOverlay() {
    const s = this.s
    const overlay = $('#overlay')
    if (s.over) {
      overlay.innerHTML = `
        <div class="modal">
          <div class="modal-icon">💀</div>
          <h2>Foreclosed!</h2>
          <p>The bank took the park on day ${s.day}. The dinosaurs were adopted by
          a lovely petting zoo upstate. Everyone is fine, except your wallet.</p>
          <button class="big" id="restart">🔄 Start a new park</button>
        </div>`
      overlay.hidden = false
      $('#restart').addEventListener('click', () => this.h.reset())
    } else if (!overlay.dataset.party) {
      overlay.hidden = true
    }
  }

  celebrate() {
    const overlay = $('#overlay')
    overlay.dataset.party = '1'
    overlay.innerHTML = `
      <div class="confetti">${'🎉🦖🎊🦕⭐'.repeat(8).split('').map((c, i) =>
        `<i style="left:${(i * 7.3) % 100}%;animation-delay:${(i % 10) * 0.25}s">${c}</i>`).join('')}</div>
      <div class="modal">
        <div class="modal-icon">🏆</div>
        <h2>Park of the Century!</h2>
        <p>Five species, five stars, zero (recent) rampages. Museums call you
        "visionary". Aunt Dolores calls you "kiddo". Keep going!</p>
        <button class="big" id="party-on">Keep building</button>
      </div>`
    overlay.hidden = false
    $('#party-on').addEventListener('click', () => {
      delete overlay.dataset.party
      overlay.hidden = true
    })
  }

  // ------------------------------------------------------------ sheet plumbing

  openSheet(sheet) {
    this.sheet = sheet
    $('#sheet').hidden = false
    $('#sheet-backdrop').hidden = false
    this.renderSheet()
  }

  closeSheet() {
    this.sheet = null
    $('#sheet').hidden = true
    $('#sheet-backdrop').hidden = true
    this.h.deselect?.()
  }

  renderSheet() {
    const { type } = this.sheet
    const body = $('#sheet-body')
    const render = {
      plot: () => this.renderPlot(body),
      dinos: () => this.renderDinos(body),
      ads: () => this.renderAds(body),
      books: () => this.renderBooks(body),
      help: () => this.renderHelp(body),
      recapture: () => this.renderRecapture(body),
    }[type]
    if (render) render()
    else this.closeSheet()
  }

  title(t) {
    $('#sheet-title').textContent = t
  }

  // Buttons that mutate state: <button data-act="..."> wired via delegation.
  wire(body, map) {
    for (const btn of body.querySelectorAll('[data-act]')) {
      btn.addEventListener('click', () => {
        const fn = map[btn.dataset.act]
        if (!fn) return
        if (btn.dataset.confirm && !btn.dataset.armed) {
          btn.dataset.armed = '1'
          btn.dataset.label = btn.textContent
          btn.textContent = 'Tap again to confirm'
          btn.classList.add('danger')
          setTimeout(() => {
            btn.dataset.armed = ''
            btn.textContent = btn.dataset.label
            btn.classList.remove('danger')
          }, 2500)
          return
        }
        fn(btn)
      })
    }
  }

  // ------------------------------------------------------------ plot sheets

  renderPlot(body) {
    const s = this.s
    const plot = sim.plotById(s, this.sheet.plotId)
    if (!plot) return this.closeSheet()
    if (!plot.owned) return this.renderLocked(body, plot)
    if (!plot.kind) return this.renderBuildMenu(body, plot)
    if (plot.kind === 'paddock') return this.renderPaddock(body, plot)
    return this.renderBuilding(body, plot)
  }

  renderLocked(body, plot) {
    const price = plotPrice(plot.r, plot.c)
    this.title('🏞️ Wild land')
    body.innerHTML = `
      <p class="lead">A scruffy patch of prehistoric real estate. Buy it to expand the park.</p>
      <button class="big" data-act="buy" ${this.s.money < price ? 'disabled' : ''}>
        Buy land — ${fmtMoney(price)}</button>`
    this.wire(body, { buy: () => this.h.run(sim.buyPlot, plot) })
  }

  renderBuildMenu(body, plot) {
    this.title('🏗️ Build here')
    const s = this.s
    body.innerHTML = `<div class="cards">${Object.entries(BUILDINGS)
      .map(
        ([key, b]) => `
        <button class="card" data-act="build" data-kind="${key}" ${s.money < b.cost ? 'disabled' : ''}>
          <div class="card-head"><span class="card-icon">${b.icon}</span><b>${b.name}</b></div>
          <div class="card-desc">${b.desc}</div>
          <div class="card-foot"><span>${fmtMoney(b.cost)}</span><span class="muted">${fmtMoney(b.upkeep)}/day</span></div>
        </button>`
      )
      .join('')}</div>`
    this.wire(body, {
      build: (btn) => this.h.run(sim.build, plot, btn.dataset.kind),
    })
  }

  renderBuilding(body, plot) {
    const b = BUILDINGS[plot.kind]
    this.title(`${b.icon} ${b.name}`)
    body.innerHTML = `
      <p class="lead">${b.desc}</p>
      <p class="muted">Upkeep: ${fmtMoney(b.upkeep)}/day</p>
      <button class="big danger-outline" data-act="demo" data-confirm="1">
        💣 Demolish (30% refund)</button>`
    this.wire(body, {
      demo: () => {
        if (this.h.run(sim.demolish, plot)?.ok) this.closeSheet()
      },
    })
  }

  renderPaddock(body, plot) {
    const s = this.s
    const herd = sim.dinosIn(s, plot.id)
    const fence = FENCES[plot.fence]
    const next = FENCES[plot.fence + 1]
    const strength = sim.fenceStrength(s, plot)
    this.title('🦕 Paddock')

    const dinoRows = herd
      .map((d) => {
        const sp = SPECIES[d.sp]
        const mood = d.escaped ? '🚨 LOOSE!' : d.hap < 40 ? '💢 agitated' : d.hap > 85 ? '❤️ blissful' : '🙂 content'
        const weak = sp.fer > strength
        return `
        <div class="row">
          <span class="row-icon">${sp.icon}</span>
          <div class="row-main">
            <b>${sp.name}</b>
            <div class="hap-bar"><i style="width:${Math.round(d.hap)}%" class="${d.hap < 40 ? 'low' : ''}"></i></div>
            <small class="muted">${mood}${weak ? ' · ⚠️ fence too weak!' : ''}</small>
          </div>
          <button class="mini" data-act="sell" data-id="${d.id}" data-confirm="1">Sell<br>${fmtShort(SPECIES[d.sp].cost * 0.4)}</button>
        </div>`
      })
      .join('')

    const canAdd = herd.length < 3
    const lockedSp = herd[0]?.sp
    const shopCards = canAdd
      ? `<h3>Adopt a dinosaur</h3><div class="cards">${Object.entries(SPECIES)
          .filter(([key]) => !lockedSp || key === lockedSp)
          .map(([key, sp]) => {
            const weak = sp.fer > fence.strength
            return `
            <button class="card" data-act="adopt" data-sp="${key}" ${s.money < sp.cost ? 'disabled' : ''}>
              <div class="card-head"><span class="card-icon">${sp.icon}</span><b>${sp.name}</b></div>
              <div class="card-desc">${sp.desc}</div>
              <div class="stats">
                <span title="Crowd draw">🌟${sp.pop}</span>
                <span title="Irritability">🌶️${sp.irr}</span>
                <span title="Fence needed">🦷${'⛓'.repeat(sp.fer)}</span>
                <span title="Feed cost">🍖${fmtShort(sp.food)}/d</span>
              </div>
              <div class="card-foot"><span>${fmtMoney(sp.cost)}</span>
                <span class="${weak ? 'warn-text' : 'muted'}">${weak ? '⚠️ fence too weak' : sp.social === 'herd' ? 'loves company' : 'lives alone'}</span></div>
            </button>`
          })
          .join('')}</div>`
      : '<p class="muted">Paddock is full (3 dinosaurs).</p>'

    body.innerHTML = `
      ${herd.length ? `<div class="rows">${dinoRows}</div>` : '<p class="lead">An empty paddock. Adopt a dinosaur below!</p>'}
      <div class="fence-box">
        <div><b>Fence: ${fence.name}</b> ${'⛓'.repeat(fence.strength)}<br>
        <small class="muted">${strength < fence.strength ? '⚡ Power is out — fence weakened!' : fence.desc}</small></div>
        ${next ? `<button class="mini" data-act="fence" ${s.money < next.cost ? 'disabled' : ''}>Upgrade<br>${fmtMoney(next.cost)}</button>` : '<span class="muted">Maxed</span>'}
      </div>
      ${shopCards}
      ${herd.length === 0 ? '<button class="big danger-outline" data-act="demo" data-confirm="1">💣 Demolish paddock</button>' : ''}`

    this.wire(body, {
      adopt: (btn) => this.h.run(sim.buyDino, plot, btn.dataset.sp),
      sell: (btn) => {
        const dino = s.dinos.find((d) => d.id === +btn.dataset.id)
        if (dino) this.h.run(sim.sellDino, dino)
      },
      fence: () => this.h.run(sim.upgradeFence, plot),
      demo: () => {
        if (this.h.run(sim.demolish, plot)?.ok) this.closeSheet()
      },
    })
  }

  // ------------------------------------------------------------ roster / ads / books

  renderDinos(body) {
    const s = this.s
    this.title('🦕 Your dinosaurs')
    if (!s.dinos.length) {
      body.innerHTML = '<p class="lead">No dinosaurs yet! Tap a paddock (or build one) to adopt your first.</p>'
      return
    }
    body.innerHTML = `<div class="rows">${s.dinos
      .map((d) => {
        const sp = SPECIES[d.sp]
        const plot = sim.plotById(s, d.plot)
        const strength = sim.fenceStrength(s, plot)
        const flags = []
        if (d.escaped) flags.push('🚨 LOOSE — tap it in the park!')
        else if (sp.fer > strength) flags.push('⚠️ fence too weak')
        if (!d.escaped && sp.social === 'herd' && sim.dinosIn(s, d.plot).length < 2) flags.push('😔 lonely')
        if (!d.escaped && sp.social === 'solo' && sim.dinosIn(s, d.plot).length > 1) flags.push('😤 wants solitude')
        return `
        <button class="row row-btn" data-act="go" data-plot="${d.plot}">
          <span class="row-icon">${sp.icon}</span>
          <div class="row-main">
            <b>${sp.name}</b> <small class="muted">· 🌟${sp.pop} draw</small>
            <div class="hap-bar"><i style="width:${Math.round(d.hap)}%" class="${d.hap < 40 ? 'low' : ''}"></i></div>
            <small class="${flags.length ? 'warn-text' : 'muted'}">${flags.join(' · ') || '🙂 doing fine'}</small>
          </div>
        </button>`
      })
      .join('')}</div>`
    this.wire(body, {
      go: (btn) => this.openSheet({ type: 'plot', plotId: +btn.dataset.plot }),
    })
  }

  renderAds(body) {
    const s = this.s
    this.title('📣 Promotion')
    const sweet = sim.sweetTicket(s)
    const mood = s.ticket < sweet - 3 ? '🤑 "A steal!"' : s.ticket > sweet + 4 ? '😠 "Highway robbery!"' : '🙂 "Fair price."'
    body.innerHTML = `
      <div class="ticket-box">
        <div class="ticket-row"><b>🎟️ Ticket price</b><span id="ticket-val">${fmtMoney(s.ticket)}</span></div>
        <input type="range" id="ticket" min="4" max="24" step="1" value="${s.ticket}">
        <small class="muted" id="ticket-mood">Guests say: ${mood} (fame raises what they'll pay)</small>
      </div>
      <h3>Campaigns</h3>
      <div class="cards">${Object.entries(ADS)
        .map(([key, ad]) => {
          const active = s.ad?.key === key
          return `
          <button class="card ${active ? 'active' : ''}" data-act="ad" data-ad="${key}"
            ${s.ad || s.money < ad.cost ? 'disabled' : ''}>
            <div class="card-head"><span class="card-icon">${ad.icon}</span><b>${ad.name}</b></div>
            <div class="card-desc">${ad.desc}</div>
            <div class="card-foot"><span>${fmtMoney(ad.cost)}</span>
              <span class="muted">${active ? `LIVE · ${s.ad.days}d left` : `+${Math.round((ad.mult - 1) * 100)}% guests · ${ad.days}d`}</span></div>
          </button>`
        })
        .join('')}</div>`
    const slider = body.querySelector('#ticket')
    slider.addEventListener('input', () => {
      sim.setTicket(s, +slider.value)
      body.querySelector('#ticket-val').textContent = fmtMoney(s.ticket)
      const m = s.ticket < sim.sweetTicket(s) - 3 ? '🤑 "A steal!"' : s.ticket > sim.sweetTicket(s) + 4 ? '😠 "Highway robbery!"' : '🙂 "Fair price."'
      body.querySelector('#ticket-mood').textContent = `Guests say: ${m} (fame raises what they'll pay)`
    })
    this.wire(body, { ad: (btn) => this.h.run(sim.startAd, btn.dataset.ad) })
  }

  renderBooks(body) {
    const s = this.s
    this.title('📊 The Books')
    const last = s.history[s.history.length - 1] ?? { inc: 0, exp: 0 }
    const net = last.inc - last.exp
    body.innerHTML = `
      <div class="tiles">
        <div class="tile"><small>Balance</small><b class="${s.money < 0 ? 'neg' : ''}">${fmtShort(s.money)}</b></div>
        <div class="tile"><small>Net yesterday</small><b class="${net < 0 ? 'neg' : 'pos'}">${net >= 0 ? '+' : ''}${fmtShort(net)}</b></div>
        <div class="tile"><small>Guests</small><b>${s.visitors}</b></div>
        <div class="tile"><small>Reputation</small><b>${Math.round(s.rep)}/100</b></div>
      </div>
      <h3>Balance — last 30 days</h3>
      <div class="chart-wrap"><canvas id="c-line"></canvas><div class="chart-tip" hidden></div></div>
      <h3>Income vs expenses — last 14 days</h3>
      <div class="legend">
        <span><i style="background:${CHART.blue}"></i>Income</span>
        <span><i style="background:${CHART.orange}"></i>Expenses</span>
      </div>
      <div class="chart-wrap"><canvas id="c-bars"></canvas><div class="chart-tip" hidden></div></div>
      <h3>Ledger</h3>
      <div class="ledger" id="ledger"></div>`

    const lineRef = { fn: null }
    const barRef = { fn: null }
    const lineWrap = body.querySelector('#c-line').parentElement
    const barWrap = body.querySelector('#c-bars').parentElement
    requestAnimationFrame(() => {
      lineRef.fn = lineChart(body.querySelector('#c-line'), s.history.slice(-30).map((p) => ({ d: p.d, v: p.bal })))
      barRef.fn = barChart(body.querySelector('#c-bars'), s.history.slice(-14).filter((p) => p.d > 0))
    })
    attachTooltip(body.querySelector('#c-line'), lineWrap.querySelector('.chart-tip'), lineRef)
    attachTooltip(body.querySelector('#c-bars'), barWrap.querySelector('.chart-tip'), barRef)

    const ledger = body.querySelector('#ledger')
    let day = null
    const rows = []
    for (let i = s.ledger.length - 1; i >= 0 && rows.length < 80; i--) {
      const e = s.ledger[i]
      if (e.d !== day) {
        day = e.d
        rows.push(`<div class="ledger-day">Day ${day}</div>`)
      }
      rows.push(`<div class="ledger-row"><span>${e.label}</span>
        <b class="${e.amt < 0 ? 'neg' : 'pos'}">${e.amt < 0 ? '−' : '+'}${fmtMoney(Math.abs(e.amt))}</b></div>`)
    }
    ledger.innerHTML = rows.join('')
  }

  renderHelp(body) {
    this.title('❔ How to run a dino park')
    body.innerHTML = `
      <div class="help">
        <p><b>👆 Tap plots</b> to buy land and build. Drag to orbit, pinch to zoom.</p>
        <p><b>🦕 Dinosaurs</b> draw guests (🌟). Spicier dinos (🌶️) get unhappy faster;
        happy herds need friends, loners need space, and gardens/fountains next door calm everyone.</p>
        <p><b>⛓ Fences</b> must match a dino's bite (🦷). An unhappy dino behind a weak
        fence <i>will</i> bust out — tap it to send rangers, or build a Ranger Station.</p>
        <p><b>💰 Money</b>: tickets, snacks and gifts in; feed, upkeep and wages out.
        Check the Books, mind the ledger, and don't drop below ${fmtMoney(ECON.bankruptcyAt)}.</p>
        <p><b>📣 Promotion</b>: campaigns boost crowds for a few days. Fame lets you
        charge more per ticket.</p>
        <p><b>⚡ Disasters</b> happen: outages kill electric fences (get a generator),
        storms wreck decorations, heatwaves grill tempers (fountains help).</p>
        <p><b>🏆 Goal</b>: five species and a 90+ reputation earns Park of the Century.</p>
      </div>
      <button class="big danger-outline" data-act="reset" data-confirm="1">🗑️ Reset park</button>
      <p class="muted center">Made with Three.js · saves automatically on this device</p>`
    this.wire(body, { reset: () => this.h.reset() })
  }

  renderRecapture(body) {
    const s = this.s
    const dino = s.dinos.find((d) => d.id === this.sheet.dinoId)
    if (!dino?.escaped) return this.closeSheet()
    const sp = SPECIES[dino.sp]
    const cost = sim.recaptureCost(s, dino)
    this.title('🚨 Dinosaur on the loose!')
    body.innerHTML = `
      <p class="lead">${sp.icon} The ${sp.name} is terrorizing the funnel cake line.
      Every day it roams costs you reputation.</p>
      <button class="big" data-act="catch" ${s.money < cost ? 'disabled' : ''}>
        🎯 Send the rangers — ${fmtMoney(cost)}</button>
      <p class="muted center">Ranger Station discounts this and auto-recaptures in 2 days.</p>`
    this.wire(body, {
      catch: () => {
        const res = this.h.run(sim.recapture, dino)
        if (res?.ok) this.closeSheet()
      },
    })
  }
}
