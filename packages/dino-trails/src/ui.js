// DOM layer: HUD, bottom sheets, toasts, overlays. Mutations go through
// handlers.run(simFn, ...args) so main.js can save + resync in one place.

import { SPECIES, BUILDINGS, FENCES, TERRAIN, ECON, DISASTERS, fmtMoney, fmtShort } from './data.js'
import * as sim from './sim.js'
import { lineChart, barChart, attachTooltip, CHART } from './charts.js'

const $ = (sel) => document.querySelector(sel)
const TONE_ICON = { good: '✅', bad: '🚨', info: '💬', celebrate: '✨' }

export class UI {
  constructor(handlers, park) {
    this.h = handlers // { get s(), run, speed, speedLabel, reset, deselect, setHeat }
    this.park = park
    this.sheet = null
    this.buildHUD()
    this.buildNav()
    $('#sheet-close').addEventListener('click', () => this.closeSheet())
    $('#sheet-backdrop').addEventListener('click', () => this.closeSheet())
    $('#banner').addEventListener('click', () => this.openSheet({ type: 'herd' }))
    this.heatOn = false
    $('#heat-toggle').addEventListener('click', () => {
      this.heatOn = !this.heatOn
      $('#heat-toggle').classList.toggle('on', this.heatOn)
      this.h.setHeat(this.heatOn)
      this.toast('🔥', this.heatOn ? 'Footfall heatmap on — red trails are money.' : 'Heatmap off.', 'info')
    })
    this.refresh()
  }

  get s() {
    return this.h.s
  }

  cellName(cell) {
    return `${TERRAIN[cell.terrain].name} #${cell.id}`
  }

  roominess(cell) {
    return cell.inradius >= 3.0 ? 'vast' : cell.inradius >= 2.2 ? 'roomy' : cell.inradius >= 1.6 ? 'modest' : 'snug'
  }

  // ------------------------------------------------------------ chrome

  buildHUD() {
    $('#hud').innerHTML = `
      <div class="chip chip-money" id="hud-money"></div>
      <div class="chip" id="hud-day"></div>
      <div class="chip" id="hud-vis" title="Guests yesterday"></div>
      <div class="chip chip-rep" id="hud-rep" title="Fame"></div>
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
      <button data-nav="market"><span>🛒</span>Market</button>
      <button data-nav="herd"><span>🦕</span>Herd</button>
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
    $('#hud-vis').textContent = `👥 ${s.guests}`
    const stars = Math.round(s.fame / 20)
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
    const rare = s.market.offers.find((o) => SPECIES[o.sp].weight <= 0.07)
    if (esc.length) {
      const sp = SPECIES[esc[0].sp]
      banner.className = 'bad'
      banner.innerHTML = `🚨 <b>${esc.length > 1 ? `${esc.length} dinosaurs are` : `A ${sp.name} is`} loose on the trails!</b> Tap it`
      banner.hidden = false
    } else if (s.disaster) {
      const d = DISASTERS[s.disaster.key]
      banner.className = 'warn'
      banner.innerHTML = `${d.icon} <b>${d.name}</b> — ${s.disaster.days} day${s.disaster.days > 1 ? 's' : ''} left`
      banner.hidden = false
    } else if (rare) {
      banner.className = 'good'
      banner.innerHTML = `✨ <b>${SPECIES[rare.sp].name} at the market</b> — ${s.market.nextRefresh} day${s.market.nextRefresh > 1 ? 's' : ''} left`
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
    for (const ev of events) this.toast(ev.icon ?? TONE_ICON[ev.tone] ?? '💬', ev.text, ev.tone)
  }

  hint(text) {
    const el = $('#hint')
    el.textContent = text
    el.hidden = !text
  }

  updateOverlay() {
    const s = this.s
    const overlay = $('#overlay')
    if (s.over) {
      overlay.innerHTML = `
        <div class="modal">
          <div class="modal-icon">💀</div>
          <h2>Foreclosed!</h2>
          <p>The bank took the trails on day ${s.day}. The dinosaurs found homes;
          your spreadsheet did not.</p>
          <button class="big" id="restart">🔄 Carve a new park</button>
        </div>`
      overlay.hidden = false
      $('#restart').addEventListener('click', () => this.h.reset())
    } else {
      overlay.hidden = true
    }
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
    const body = $('#sheet-body')
    const render = {
      cell: () => this.renderCell(body),
      market: () => this.renderMarket(body),
      herd: () => this.renderHerd(body),
      books: () => this.renderBooks(body),
      help: () => this.renderHelp(body),
      recapture: () => this.renderRecapture(body),
    }[this.sheet.type]
    if (render) render()
    else this.closeSheet()
  }

  title(t) {
    $('#sheet-title').textContent = t
  }

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

  // ------------------------------------------------------------ cell sheet

  renderCell(body) {
    const s = this.s
    const cell = this.park.cells[this.sheet.cellId]
    if (!cell) return this.closeSheet()
    const cs = s.cells[cell.id]
    const traffic = s.cellTraffic[cell.id] ?? 0
    const meta = `<p class="muted">${this.roominess(cell)} · ${Math.round(cell.area)} m² · 👣 ${traffic} passers-by yesterday</p>`

    if (cell.terrain === 'water') {
      this.title('💧 Pond')
      body.innerHTML = `<p class="lead">Cool water and lily pads. Not for sale — but dinosaurs
        in neighboring cells love living lakeside, and the shore trail draws strollers.</p>${meta}`
      return
    }
    if (!cs.owned) {
      const price = sim.priceOf(s, cell)
      this.title(`🏞️ Wild ${TERRAIN[cell.terrain].name.toLowerCase()}`)
      body.innerHTML = `
        <p class="lead">Untamed territory. Land beside busy trails costs more — check the 🔥 heatmap before you buy.</p>
        ${meta}
        <button class="big" data-act="buy" ${s.money < price ? 'disabled' : ''}>Claim land — ${fmtMoney(price)}</button>`
      this.wire(body, { buy: () => this.h.run(sim.buyCell, this.park, cell) })
      return
    }
    if (!cs.use) {
      this.title(`🏗️ ${this.cellName(cell)}`)
      body.innerHTML = `${meta}<div class="cards">${Object.entries(BUILDINGS)
        .map(
          ([key, b]) => `
          <button class="card" data-act="build" data-kind="${key}" ${s.money < b.cost ? 'disabled' : ''}>
            <div class="card-head"><span class="card-icon">${b.icon}</span><b>${b.name}</b></div>
            <div class="card-desc">${b.desc}</div>
            <div class="card-foot"><span>${fmtMoney(b.cost)}</span><span class="muted">${fmtMoney(b.upkeep)}/day</span></div>
          </button>`
        )
        .join('')}</div>`
      this.wire(body, { build: (btn) => this.h.run(sim.build, cell, btn.dataset.kind) })
      return
    }
    if (cs.use === 'paddock') return this.renderPaddock(body, cell, cs, meta)

    const b = BUILDINGS[cs.use]
    this.title(`${b.icon} ${b.name}`)
    const earns = cs.use === 'kiosk' || cs.use === 'gift'
    body.innerHTML = `
      <p class="lead">${b.desc}</p>
      ${meta}
      ${earns ? `<p class="muted">Yesterday's take: ~${fmtMoney(traffic * (cs.use === 'kiosk' ? 2.0 : 3.2))}</p>` : ''}
      <button class="big danger-outline" data-act="demo" data-confirm="1">💣 Demolish (30% refund)</button>`
    this.wire(body, {
      demo: () => {
        if (this.h.run(sim.demolish, cell)?.ok) this.closeSheet()
      },
    })
  }

  renderPaddock(body, cell, cs, meta) {
    const s = this.s
    const herd = sim.dinosIn(s, cell.id)
    const fence = FENCES[cs.fence]
    const next = FENCES[cs.fence + 1]
    this.title(`🦕 Paddock — ${this.cellName(cell)}`)

    const effStrength = sim.fenceStrength(s, cs)
    const rows = herd
      .map((d) => {
        const sp = SPECIES[d.sp]
        const mood = d.escaped
          ? '🚨 LOOSE!'
          : d.sick
            ? '🤒 under the weather'
            : d.hap < 40
              ? '💢 agitated'
              : d.hap > 85
                ? '❤️ blissful'
                : '🙂 content'
        const weak = sp.fer > effStrength
        return `
        <div class="row">
          <span class="row-icon">${sp.icon}</span>
          <div class="row-main">
            <b>${sp.name}</b>
            <div class="hap-bar"><i style="width:${Math.round(d.hap)}%" class="${d.hap < 40 ? 'low' : ''}"></i></div>
            <small class="muted">${mood}${weak ? ' · ⚠️ fence too weak!' : ''}</small>
          </div>
          ${d.sick ? `<button class="mini" data-act="treat" data-id="${d.id}">Treat<br>${fmtMoney(ECON.treatCost)}</button>` : ''}
          <button class="mini" data-act="sell" data-id="${d.id}" data-confirm="1">Sell<br>${fmtShort(sp.cost * 0.4)}</button>
        </div>`
      })
      .join('')

    body.innerHTML = `
      ${meta}
      ${herd.length ? `<div class="rows">${rows}</div>` : '<p class="lead">An empty paddock. Dinosaurs come from the 🛒 Market — when they come at all.</p>'}
      <div class="fence-box">
        <div><b>Fence: ${fence.name}</b> ${'⛓'.repeat(effStrength)}<br>
        <small class="${cs.fence === 2 && effStrength < 4 ? 'warn-text' : 'muted'}">${
          cs.fence === 2 && effStrength < 4 ? 'Unpowered — build a Generator for full strength!' : fence.desc
        }</small></div>
        ${next ? `<button class="mini" data-act="fence" ${s.money < next.cost ? 'disabled' : ''}>Upgrade<br>${fmtMoney(next.cost)}</button>` : '<span class="muted">Maxed</span>'}
      </div>
      <button class="big" data-act="market">🛒 Browse the dino market</button>
      ${herd.length === 0 ? '<button class="big danger-outline" data-act="demo" data-confirm="1">💣 Demolish paddock</button>' : ''}`

    this.wire(body, {
      sell: (btn) => {
        const dino = s.dinos.find((d) => d.id === +btn.dataset.id)
        if (dino) this.h.run(sim.sellDino, dino)
      },
      treat: (btn) => {
        const dino = s.dinos.find((d) => d.id === +btn.dataset.id)
        if (dino) this.h.run(sim.treatDino, dino)
      },
      fence: () => this.h.run(sim.upgradeFence, cell),
      market: () => this.openSheet({ type: 'market' }),
      demo: () => {
        if (this.h.run(sim.demolish, cell)?.ok) this.closeSheet()
      },
    })
  }

  // ------------------------------------------------------------ market

  speciesCard(spKey, price, { rare = false, extraAct = 'pick', dataAttr = '' } = {}) {
    const s = this.s
    const sp = SPECIES[spKey]
    const homes = sim.eligibleCells(s, this.park, spKey).length
    return `
      <button class="card ${rare ? 'active' : ''}" data-act="${extraAct}" ${dataAttr} ${s.money < price ? 'disabled' : ''}>
        <div class="card-head"><span class="card-icon">${sp.icon}</span><b>${sp.name}</b>${rare ? ' ✨' : ''}</div>
        <div class="card-desc">${sp.desc}</div>
        <div class="stats">
          <span title="Crowd draw">🌟${sp.pop}</span>
          <span title="Irritability">🌶️${sp.irr}</span>
          <span title="Fence needed">🦷${'⛓'.repeat(sp.fer)}</span>
          <span title="Needs room">📐${sp.minR}+</span>
        </div>
        <div class="card-foot"><span>${fmtMoney(price)}</span>
          <span class="${homes ? 'muted' : 'warn-text'}">${homes ? `${homes} paddock${homes > 1 ? 's' : ''} fit` : 'no paddock fits!'}</span></div>
      </button>`
  }

  // Starts the shared placement flow for a ranch common or a market offer.
  startPlacing(spKey, offerIdx) {
    const eligible = sim.eligibleCells(this.s, this.park, spKey)
    if (!eligible.length) {
      this.toast('🚫', 'No paddock fits this dinosaur — build a roomier one.', 'bad')
      return
    }
    const buy = (cellId) =>
      offerIdx == null
        ? this.h.run(sim.buyCommon, this.park, spKey, cellId)
        : this.h.run(sim.buyOffer, this.park, offerIdx, cellId)
    if (eligible.length === 1) {
      buy(eligible[0].id)
    } else {
      this.sheet.placing = { sp: spKey, offerIdx }
      this.renderSheet()
    }
  }

  renderMarket(body) {
    const s = this.s
    this.title('🛒 Dino Market')
    if (this.sheet.placing != null) return this.renderPlacement(body)
    const days = s.market.nextRefresh
    const ranch = Object.entries(SPECIES).filter(([, sp]) => sp.always)
    body.innerHTML = `
      <h3>Ranch stock — always available</h3>
      <div class="cards">${ranch.map(([key, sp]) => this.speciesCard(key, sp.cost, { extraAct: 'common', dataAttr: `data-sp="${key}"` })).join('')}</div>
      <h3>Traveling market — new stock in ${days} day${days > 1 ? 's' : ''}</h3>
      <p class="muted" style="margin:0 2px 8px">Unsold dinos leave with the refresh. Rare species (✨) show up when they feel like it.</p>
      <div class="cards">${s.market.offers
        .map((o, i) => this.speciesCard(o.sp, o.price, { rare: SPECIES[o.sp].weight <= 0.07, extraAct: 'pick', dataAttr: `data-i="${i}"` }))
        .join('')}</div>
      ${s.market.offers.length ? '' : '<p class="muted center">Sold out. Come back after the refresh.</p>'}`
    this.wire(body, {
      common: (btn) => this.startPlacing(btn.dataset.sp, null),
      pick: (btn) => this.startPlacing(s.market.offers[+btn.dataset.i].sp, +btn.dataset.i),
    })
  }

  renderPlacement(body) {
    const s = this.s
    const { sp: spKey, offerIdx } = this.sheet.placing
    const offer = offerIdx != null ? s.market.offers[offerIdx] : null
    if (offerIdx != null && !offer) {
      this.sheet.placing = null
      return this.renderSheet()
    }
    const sp = SPECIES[spKey]
    const price = offer ? offer.price : sp.cost
    const eligible = sim.eligibleCells(s, this.park, spKey)
    body.innerHTML = `
      <p class="lead">${sp.icon} Where does the ${sp.name} live? (${fmtMoney(price)})</p>
      <div class="rows">${eligible
        .map((cell) => {
          const herd = sim.dinosIn(s, cell.id)
          const cap = sim.capacityFor(cell, spKey)
          return `
          <button class="row row-btn" data-act="place" data-cell="${cell.id}">
            <span class="row-icon">🏞️</span>
            <div class="row-main">
              <b>${this.cellName(cell)}</b>
              <small class="muted">${this.roominess(cell)} · ${herd.length}/${cap} dinos · fence ${FENCES[s.cells[cell.id].fence].name}</small>
            </div>
          </button>`
        })
        .join('')}</div>
      <button class="big danger-outline" data-act="back">← Back to market</button>`
    this.wire(body, {
      place: (btn) => {
        const res =
          offerIdx == null
            ? this.h.run(sim.buyCommon, this.park, spKey, +btn.dataset.cell)
            : this.h.run(sim.buyOffer, this.park, offerIdx, +btn.dataset.cell)
        if (res?.ok) {
          this.sheet.placing = null
          this.renderSheet()
        }
      },
      back: () => {
        this.sheet.placing = null
        this.renderSheet()
      },
    })
  }

  // ------------------------------------------------------------ herd / books / help

  renderHerd(body) {
    const s = this.s
    this.title('🦕 Your herd')
    if (!s.dinos.length) {
      body.innerHTML = '<p class="lead">No dinosaurs. The 🛒 Market is the only way in — keep cash ready.</p>'
      return
    }
    body.innerHTML = `<div class="rows">${s.dinos
      .map((d) => {
        const sp = SPECIES[d.sp]
        const cell = this.park.cells[d.cell]
        const cs = s.cells[d.cell]
        const flags = []
        if (d.escaped) flags.push('🚨 LOOSE — tap it on the trails!')
        else if (sp.fer > sim.fenceStrength(s, cs)) flags.push('⚠️ fence too weak')
        if (d.sick) flags.push('🤒 sick')
        if (!d.escaped && sp.social === 'herd' && sim.dinosIn(s, d.cell).length < 2) flags.push('😔 lonely')
        return `
        <button class="row row-btn" data-act="go" data-cell="${d.cell}">
          <span class="row-icon">${sp.icon}</span>
          <div class="row-main">
            <b>${sp.name}</b> <small class="muted">· ${this.cellName(cell)}</small>
            <div class="hap-bar"><i style="width:${Math.round(d.hap)}%" class="${d.hap < 40 ? 'low' : ''}"></i></div>
            <small class="${flags.length ? 'warn-text' : 'muted'}">${flags.join(' · ') || '🙂 doing fine'}</small>
          </div>
        </button>`
      })
      .join('')}</div>`
    this.wire(body, {
      go: (btn) => this.openSheet({ type: 'cell', cellId: +btn.dataset.cell }),
    })
  }

  renderBooks(body) {
    const s = this.s
    this.title('📊 The Books')
    const last = s.history[s.history.length - 1] ?? { inc: 0, exp: 0 }
    const net = last.inc - last.exp
    const sys = sim.systems(s)
    const sweet = sim.sweetTicket(s)
    const mood = s.ticket < sweet - 3 ? '"A steal!"' : s.ticket > sweet + 4 ? '"Highway robbery!"' : '"Fair price."'
    body.innerHTML = `
      <div class="tiles">
        <div class="tile"><small>Balance</small><b class="${s.money < 0 ? 'neg' : ''}">${fmtShort(s.money)}</b></div>
        <div class="tile"><small>Net yesterday</small><b class="${net < 0 ? 'neg' : 'pos'}">${net >= 0 ? '+' : ''}${fmtShort(net)}</b></div>
        <div class="tile"><small>Guests</small><b>${s.guests}</b></div>
        <div class="tile"><small>Fame</small><b>${Math.round(s.fame)}/100</b></div>
      </div>
      <div class="ticket-box">
        <div class="ticket-row"><b>🎟️ Gate price</b><span id="ticket-val">${fmtMoney(s.ticket)}</span></div>
        <input type="range" id="ticket" min="${ECON.ticketMin}" max="${ECON.ticketMax}" step="1" value="${s.ticket}">
        <small class="muted" id="ticket-mood">Guests say: ${mood} (fame raises what they'll pay)</small>
      </div>
      <h3>Park systems</h3>
      <div class="tiles">
        <div class="tile"><small>Feed</small><b class="${sys.feedDemand > sys.feedCapacity ? 'neg' : ''}">${sys.feedDemand}/${sys.feedCapacity}</b></div>
        <div class="tile"><small>Ranger cover</small><b class="${sys.dangerous > sys.covered ? 'neg' : ''}">${Math.min(sys.covered, sys.dangerous)}/${sys.dangerous}</b></div>
        <div class="tile"><small>Power</small><b class="${sys.powered ? 'pos' : ''}">${sys.powered ? 'On grid' : 'None'}</b></div>
        <div class="tile"><small>Clinic</small><b>${sim.countUse(s, 'clinic') ? 'Staffed' : 'None'}</b></div>
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
    const slider = body.querySelector('#ticket')
    slider.addEventListener('input', () => {
      sim.setTicket(s, +slider.value)
      body.querySelector('#ticket-val').textContent = fmtMoney(s.ticket)
      const sw = sim.sweetTicket(s)
      const m = s.ticket < sw - 3 ? '"A steal!"' : s.ticket > sw + 4 ? '"Highway robbery!"' : '"Fair price."'
      body.querySelector('#ticket-mood').textContent = `Guests say: ${m} (fame raises what they'll pay)`
    })

    const lineRef = { fn: null }
    const barRef = { fn: null }
    requestAnimationFrame(() => {
      lineRef.fn = lineChart(body.querySelector('#c-line'), s.history.slice(-30).map((p) => ({ d: p.d, v: p.bal })))
      barRef.fn = barChart(body.querySelector('#c-bars'), s.history.slice(-14).filter((p) => p.d > 0))
    })
    attachTooltip(body.querySelector('#c-line'), body.querySelectorAll('.chart-tip')[0], lineRef)
    attachTooltip(body.querySelector('#c-bars'), body.querySelectorAll('.chart-tip')[1], barRef)

    const rows = []
    let day = null
    for (let i = s.ledger.length - 1; i >= 0 && rows.length < 80; i--) {
      const e = s.ledger[i]
      if (e.d !== day) {
        day = e.d
        rows.push(`<div class="ledger-day">Day ${day}</div>`)
      }
      rows.push(
        `<div class="ledger-row"><span>${e.label}</span><b class="${e.amt < 0 ? 'neg' : 'pos'}">${e.amt < 0 ? '−' : '+'}${fmtMoney(Math.abs(e.amt))}</b></div>`
      )
    }
    body.querySelector('#ledger').innerHTML = rows.join('')
  }

  renderHelp(body) {
    this.title('❔ Trail wisdom')
    body.innerHTML = `
      <div class="help">
        <p><b>👣 Money follows footsteps.</b> Guests walk real trails between the gate and
        your star dinos. Kiosks earn from the trails beside them — toggle 🔥 to see where
        the crowds actually go.</p>
        <p><b>🏞️ Land is unequal.</b> Cells differ in size, terrain and traffic. Prices follow
        footfall, so buy ahead of the crowd. Big species need <i>vast</i> cells — 📐 shows
        the roominess a dino demands.</p>
        <p><b>🗺️ Getting around:</b> drag to roam the park, pinch (or scroll) to zoom,
        two-finger drag (or right-drag) to spin the view.</p>
        <p><b>🛒 Getting dinos.</b> Ranch commons are always for sale. The traveling market
        restocks every ${ECON.marketRefreshDays} days with ${ECON.marketSlots} offers — rare species (✨) show up when
        they please, and missed offers are gone.</p>
        <p><b>⛓ Fences vs teeth.</b> A dino whose bite (🦷) beats the fence will eventually
        walk out — especially when unhappy. Loose dinos empty the park until you tap them.</p>
        <p><b>😊 Happiness</b>: room to roam, herds together, loners alone, gardens and
        lakesides next door.</p>
        <p><b>🏗️ Big dinos need infrastructure.</b> Electric fences want a Generator,
        big appetites want Feed Depots (imports cost extra beyond capacity), dangerous
        species want Ranger cover, and a Vet Clinic shrugs off sickness. Check
        "Park systems" in the Books.</p>
        <p><b>⚡ Disasters happen</b>: outages, storms and heatwaves roll through —
        the right buildings (and lakeside pens) blunt them.</p>
        <p><b>🎟️ Gate price</b> is set in the Books — fame raises what guests will pay.</p>
        <p><b>💀 Don't drop below ${fmtMoney(ECON.bankruptcyAt)}.</b> The bank has no chill.</p>
      </div>
      <button class="big danger-outline" data-act="reset" data-confirm="1">🗑️ Reset park (new terrain)</button>
      <p class="muted center">Design doc: docs/design-dino-trails.md · autosaves on this device</p>`
    this.wire(body, { reset: () => this.h.reset() })
  }

  renderRecapture(body) {
    const s = this.s
    const dino = s.dinos.find((d) => d.id === this.sheet.dinoId)
    if (!dino?.escaped) return this.closeSheet()
    const sp = SPECIES[dino.sp]
    const cost = sim.recaptureCost(s, dino)
    this.title('🚨 Dinosaur on the trails!')
    body.innerHTML = `
      <p class="lead">${sp.icon} The ${sp.name} is loose and the guests are sprinting for the gate.</p>
      <button class="big" data-act="catch" ${s.money < cost ? 'disabled' : ''}>🎯 Send the rangers — ${fmtMoney(cost)}</button>`
    this.wire(body, {
      catch: () => {
        if (this.h.run(sim.recapture, dino)?.ok) this.closeSheet()
      },
    })
  }
}
