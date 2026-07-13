// ui.js — DOM panels, toolbar, input. Mutates the sim only through sim.js API.
import { BUILDINGS, CATS, TIERS, HW, ITEMS, TILE, TPS } from './data.js'
import {
  place, removeAt, canPlace, buildingAt, deploy, buyHw,
  decodeSlots, decodeCap, podPower, tier, hw as hwOf, footprint,
} from './sim.js'
import { screenToTile } from './render.js'
import { HELP_HTML } from './help.js'

export const fmt$ = v =>
  v >= 1e6 ? `$${(v / 1e6).toFixed(2)}M` : v >= 1e4 ? `$${(v / 1e3).toFixed(1)}k` : `$${Math.floor(v)}`
const fmtMW = v => `${v.toFixed(2)} MW`

export function makeUI(g, view, canvas, hooks) {
  const ui = {
    tool: null, dir: 0, hover: null, selected: null, tab: 'objectives',
    g, view,
  }

  const $ = sel => document.querySelector(sel)
  const el = (tag, cls, html) => {
    const e = document.createElement(tag)
    if (cls) e.className = cls
    if (html != null) e.innerHTML = html
    return e
  }

  // ------------------------------------------------------------- toolbar --
  const toolbar = $('#toolbar')
  for (const [cat, label] of CATS) {
    toolbar.appendChild(el('div', 'cat', label))
    for (const [key, def] of Object.entries(BUILDINGS)) {
      if (def.cat !== cat) continue
      const btn = el('button', 'tool', `
        <span class="glyph">${def.glyph || '▬'}</span>
        <span class="tname">${def.name}</span>
        <span class="cost">$${def.cost}</span>`)
      btn.dataset.tool = key
      btn.title = ''
      btn.addEventListener('click', () => {
        ui.tool = ui.tool === key ? null : key
        ui.selected = null
        syncToolbar()
        renderPanel()
      })
      btn.addEventListener('mouseenter', e => showTip(e, key))
      btn.addEventListener('mouseleave', hideTip)
      toolbar.appendChild(btn)
    }
  }
  function syncToolbar() {
    for (const b of toolbar.querySelectorAll('.tool')) {
      b.classList.toggle('active', b.dataset.tool === ui.tool)
      b.classList.toggle('broke', ui.g.money < BUILDINGS[b.dataset.tool].cost)
    }
  }

  // ------------------------------------------------------------- tooltip --
  const tip = $('#tooltip')
  function showTip(e, key) {
    const def = BUILDINGS[key]
    const power = def.powerOut
      ? `<div class="tp gen">generates ${fmtMW(def.powerOut)}${def.fuel ? ` · fuel $${def.fuel.toFixed(2)}/s at load` : ' · no fuel'}</div>`
      : def.power ? `<div class="tp">draws ${fmtMW(def.gpu ? podPower(key, ui.g) : def.power)}${def.gpu ? ` (${HW[ui.g.hw].name})` : ''}</div>` : ''
    tip.innerHTML = `<b>${def.glyph || ''} ${def.name}</b> <span class="cost">$${def.cost}</span>${power}<p>${def.desc}</p>`
    tip.style.display = 'block'
    const r = e.currentTarget.getBoundingClientRect()
    tip.style.left = `${r.right + 8}px`
    tip.style.top = `${Math.min(r.top, window.innerHeight - tip.offsetHeight - 12)}px`
  }
  function hideTip() { tip.style.display = 'none' }

  // ----------------------------------------------------------------- HUD --
  const hud = {
    money: $('#hud-money'), income: $('#hud-income'), power: $('#hud-power'),
    powerBar: $('#hud-power-bar'), sold: $('#hud-sold'),
    model: $('#hud-model'), hw: $('#hud-hw'), obj: $('#hud-obj'),
  }
  function renderHUD() {
    const g = ui.g
    hud.money.textContent = fmt$(g.money)
    hud.income.textContent = `${g.rate.money >= 0.05 ? '+' : ''}${fmt$(g.rate.money)}/s`
    hud.power.textContent = `${fmtMW(g.power.demand)} / ${fmtMW(g.power.supply)}`
    const fill = g.power.supply > 0 ? Math.min(1, g.power.demand / g.power.supply) : (g.power.demand > 0 ? 1 : 0)
    hud.powerBar.style.width = `${fill * 100}%`
    hud.powerBar.className = g.power.sat < 0.999 ? 'bar-fill bad' : fill > 0.85 ? 'bar-fill warn' : 'bar-fill'
    hud.sold.textContent = `${g.rate.sold.toFixed(1)} otok/s`
    hud.model.textContent = tier(g).name
    hud.hw.textContent = hwOf(g).name
    const next = g.objectives.find(o => !o.done)
    hud.obj.textContent = next ? `▸ ${next.text}` : '★ All objectives complete'
    syncToolbar()
  }

  // --------------------------------------------------------------- panel --
  const panel = $('#panel-body')
  const tabs = $('#panel-tabs')
  for (const [key, label] of [['objectives', 'Goals'], ['research', 'Research'], ['upgrades', 'Fleet'], ['info', 'Info']]) {
    const b = el('button', 'ptab', label)
    b.dataset.tab = key
    b.addEventListener('click', () => { ui.tab = key; renderPanel() })
    tabs.appendChild(b)
  }

  let lastPanelHtml = ''
  function setPanel(html, wire) {
    if (html === lastPanelHtml) return
    lastPanelHtml = html
    panel.innerHTML = html
    if (wire) wire()
  }

  function renderPanel() {
    for (const b of tabs.children) b.classList.toggle('active', b.dataset.tab === ui.tab)
    const g = ui.g
    if (ui.tab === 'objectives') {
      setPanel(g.objectives.map(o => `
        <div class="obj ${o.done ? 'done' : ''}">
          <span class="check">${o.done ? '✅' : '⬜'}</span>
          <div><div>${o.text}</div>${o.done ? '' : `<div class="hint">${o.hint}</div>`}</div>
        </div>`).join(''))
      return
    }
    if (ui.tab === 'research') {
      const target = g.unlocked + 1
      const html = TIERS.map((t, i) => {
        const state = i <= g.unlocked ? (i === g.deployed ? 'deployed' : 'unlocked') : i === target ? 'training' : 'locked'
        const prog = i === target ? Math.min(1, g.research / t.trainNeed) : 0
        return `
        <div class="tierCard ${state}">
          <div class="tierHead"><b>${t.name}</b><span class="params">${t.params}</span>
            ${state === 'deployed' ? '<span class="chip live">DEPLOYED</span>'
            : state === 'unlocked' ? `<button class="btn" data-deploy="${i}">Deploy</button>`
            : state === 'training' ? `<span class="chip">training ${g.research}/${t.trainNeed} ttok</span>`
            : '<span class="chip dim">locked</span>'}
          </div>
          ${state === 'training' ? `<div class="bar"><div class="bar-fill" style="width:${prog * 100}%"></div></div>` : ''}
          <div class="tierStats">$${t.value}/otok · prefill ${t.prefillRate}/s · KV ${t.kvKB} kB/tok · batch ×${t.slots} · seq ${t.seqRate}/s</div>
          <div class="hint">${t.note}</div>
        </div>`
      }).join('') + `<div class="hint pad">Feed 🎓 training clusters with training tokens. Deploying swaps the model on every pod — and invalidates in-flight KV cache.</div>`
      setPanel(html, () => {
        for (const b of panel.querySelectorAll('[data-deploy]')) {
          b.addEventListener('click', () => { deploy(g, +b.dataset.deploy); renderPanel() })
        }
      })
      return
    }
    if (ui.tab === 'upgrades') {
      const html = HW.map((h, i) => `
        <div class="tierCard ${i === g.hw ? 'deployed' : i < g.hw ? 'unlocked' : ''}">
          <div class="tierHead"><b>${h.name}</b>
            ${i === g.hw ? '<span class="chip live">CURRENT</span>'
            : i === g.hw + 1 ? `<button class="btn" data-hw="${i}" ${g.money < h.cost ? 'disabled' : ''}>Buy ${fmt$(h.cost)}</button>`
            : i < g.hw ? '<span class="chip dim">retired</span>' : '<span class="chip dim">later</span>'}
          </div>
          <div class="tierStats">throughput ×${h.rate} · batch ×${h.slots} · power ×${h.power}</div>
          <div class="hint">${h.note}</div>
        </div>`).join('')
      setPanel(html, () => {
        for (const b of panel.querySelectorAll('[data-hw]')) {
          b.addEventListener('click', () => { buyHw(g, +b.dataset.hw); renderPanel() })
        }
      })
      return
    }
    // info tab
    const b = ui.selected != null ? g.buildings.get(ui.selected) : null
    if (!b) {
      setPanel(`<div class="hint pad">Select a building to inspect it.<br><br>
        Item legend:<br>${Object.values(ITEMS).map(it =>
          `<span class="i" style="color:${it.color}">◆</span> ${it.name}`).join('<br>')}</div>`)
      return
    }
    const def = BUILDINGS[b.type]
    let extra = ''
    if (b.type === 'decode') {
      const cap = decodeSlots(g)
      extra = `<div class="kv">batch <b>${b.seqs.length} / ${cap}</b> sequences</div>
        <div class="kv">roofline <b>${decodeCap(g).toFixed(2)} otok/s</b></div>
        <div class="kv">state <b>${b.bound || 'idle'}</b></div>
        <div class="hint">${b.bound === 'bandwidth' ? 'Saturated: every HBM read is spoken for. More throughput needs another pod (or better silicon).'
          : b.bound === 'batch-underfilled' ? 'Weights are being re-read for a half-empty batch. Feed it more KV blocks.'
          : b.bound === 'kv-capacity' ? 'HBM is full of cache — the batch cannot grow. Bigger HBM (fleet upgrade) or more pods.' : 'Waiting for KV blocks.'}</div>`
    }
    if (b.type === 'prefill') {
      extra = `<div class="kv">rate <b>${(tier(g).prefillRate * hwOf(g).rate).toFixed(2)} blocks/s</b> at ${tier(g).name}</div>
        <div class="hint">Compute-bound: rate falls as deployed params grow.</div>`
    }
    if (b.type === 'trainer') {
      const t = TIERS[g.unlocked + 1]
      extra = t ? `<div class="kv">next checkpoint <b>${t.name}</b></div>
        <div class="kv">progress <b>${g.research} / ${t.trainNeed} ttok</b></div>`
        : '<div class="kv">All checkpoints trained.</div>'
    }
    if (def.powerOut) {
      extra = `<div class="kv">output <b>${fmtMW(def.powerOut)}</b></div>` +
        (def.fuel ? `<div class="kv">fuel <b>$${(b.fuelSpend || 0).toFixed(2)}/s</b></div>` : '')
    }
    setPanel(`
      <div class="tierCard">
        <div class="tierHead"><b>${def.glyph || ''} ${def.name}</b></div>
        <div class="kv">power ${def.powerOut ? 'source' : `<b>${fmtMW(podPower(b.type, g))}</b> · ${b.powered ? `grid sat ${(b.sat * 100).toFixed(0)}%` : '<span class="bad">NO GRID</span>'}`}</div>
        ${def.gpu ? `<div class="kv">cooling <b class="${b.cooled ? '' : 'bad'}">${b.cooled ? 'OK' : 'THROTTLED 40%'}</b></div>` : ''}
        ${extra}
        <div class="hint">${def.desc}</div>
        <button class="btn danger" id="btn-del">Demolish (50% refund)</button>
      </div>`, () => {
      $('#btn-del')?.addEventListener('click', () => {
        removeAt(g, b.x, b.y)
        ui.selected = null
        renderPanel()
      })
    })
  }

  // ---------------------------------------------------------------- help --
  const helpModal = $('#help')
  $('#help-body').innerHTML = HELP_HTML
  const openHelp = v => helpModal.classList.toggle('open', v)
  $('#btn-help').addEventListener('click', () => openHelp(true))
  $('#help-close').addEventListener('click', () => openHelp(false))
  helpModal.addEventListener('click', e => { if (e.target === helpModal) openHelp(false) })
  $('#btn-reset').addEventListener('click', () => {
    if (confirm('Scrap the whole foundry and start over?')) hooks.reset()
  })

  // --------------------------------------------------------------- input --
  let panning = false, painting = false, erasing = false
  let lastPaint = null

  canvas.addEventListener('contextmenu', e => e.preventDefault())

  canvas.addEventListener('pointerdown', e => {
    canvas.setPointerCapture(e.pointerId)
    if (e.button === 1) { panning = true; return }
    const [tx, ty] = screenToTile(view, canvas, e.offsetX, e.offsetY)
    if (e.button === 2) {
      if (ui.tool) { ui.tool = null; syncToolbar(); return }
      erasing = true
      removeAt(ui.g, tx, ty)
      return
    }
    if (e.button !== 0) return
    if (ui.tool) {
      painting = true
      lastPaint = [tx, ty]
      tryBuild(tx, ty)
    } else {
      const b = buildingAt(ui.g, tx, ty)
      ui.selected = b ? b.id : null
      if (b) { ui.tab = 'info' }
      renderPanel()
    }
  })

  canvas.addEventListener('pointermove', e => {
    if (panning) {
      view.x -= e.movementX / view.zoom
      view.y -= e.movementY / view.zoom
      return
    }
    const [tx, ty] = screenToTile(view, canvas, e.offsetX, e.offsetY)
    ui.hover = [tx, ty]
    if (erasing) { removeAt(ui.g, tx, ty); return }
    if (painting && ui.tool && lastPaint && (tx !== lastPaint[0] || ty !== lastPaint[1])) {
      if (ui.tool === 'belt') {
        // drag direction steers the belt; also redirect the cell we left
        const dx = tx - lastPaint[0], dy = ty - lastPaint[1]
        if (Math.abs(dx) + Math.abs(dy) === 1) {
          ui.dir = dx === 1 ? 0 : dx === -1 ? 2 : dy === 1 ? 1 : 3
          place(ui.g, 'belt', lastPaint[0], lastPaint[1], ui.dir)
        }
        tryBuild(tx, ty)
      } else {
        tryBuild(tx, ty)
      }
      lastPaint = [tx, ty]
    }
  })

  canvas.addEventListener('pointerup', () => { panning = painting = erasing = false; lastPaint = null })

  canvas.addEventListener('wheel', e => {
    e.preventDefault()
    const z = view.zoom * (e.deltaY < 0 ? 1.12 : 1 / 1.12)
    view.zoom = Math.max(0.4, Math.min(2.5, z))
  }, { passive: false })

  function tryBuild(tx, ty) {
    place(ui.g, ui.tool, tx, ty, ui.dir)
  }

  window.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT') return
    const k = e.key.toLowerCase()
    if (k === 'r') ui.dir = (ui.dir + 1) % 4
    else if (k === 'escape') {
      if (helpModal.classList.contains('open')) openHelp(false)
      else { ui.tool = null; ui.selected = null; syncToolbar(); renderPanel() }
    } else if (k === 'p') view.powerOverlay = !view.powerOverlay
    else if (k === 'h') openHelp(!helpModal.classList.contains('open'))
    else if (k === 'delete' || k === 'backspace') {
      if (ui.selected != null) {
        const b = ui.g.buildings.get(ui.selected)
        if (b) removeAt(ui.g, b.x, b.y)
        ui.selected = null
        renderPanel()
      }
    }
    const pan = 24 / view.zoom
    if (k === 'arrowleft' || k === 'a') view.x -= pan
    if (k === 'arrowright' || k === 'd') view.x += pan
    if (k === 'arrowup' || k === 'w') view.y -= pan
    if (k === 'arrowdown' || k === 's') view.y += pan
  })

  // --------------------------------------------------------------- toasts --
  const toastBox = $('#toasts')
  function renderToasts() {
    const g = ui.g
    toastBox.innerHTML = g.toasts.map(t => `<div class="toast">${t.msg}</div>`).join('')
  }

  let lastPanelTick = -1
  return {
    ui,
    setGame(ng) { ui.g = ng; ui.selected = null; renderPanel() },
    frame() {
      renderHUD()
      renderToasts()
      // live-refresh panel on dynamic tabs ~4×/s
      if (ui.g.tick !== lastPanelTick && ui.g.tick % 3 === 0) {
        lastPanelTick = ui.g.tick
        if (ui.tab !== 'upgrades') renderPanel()
      }
    },
    renderPanel,
    openHelp,
  }
}
