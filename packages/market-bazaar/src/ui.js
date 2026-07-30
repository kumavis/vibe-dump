import { drawIcon } from './icons.js'
import { goodById } from './goods.js'
import { SPECIES_LABEL } from './species.js'

// ---------------------------------------------------------------------------
// DOM chrome: stats bar, event ticker, and the character inspector that opens
// when you click somebody — name, backstory, the attribute dials the economy
// actually uses, wallet and pockets.
// ---------------------------------------------------------------------------

const iconCache = new Map()
function iconURL(kind, size = 36) {
  const key = kind + size
  if (iconCache.has(key)) return iconCache.get(key)
  const c = document.createElement('canvas')
  c.width = c.height = size * 2
  const ctx = c.getContext('2d')
  ctx.scale(2, 2)
  drawIcon(ctx, kind, size / 2, size / 2, size * 0.92)
  const url = c.toDataURL()
  iconCache.set(key, url)
  return url
}

const el = (tag, cls, html) => {
  const e = document.createElement(tag)
  if (cls) e.className = cls
  if (html !== undefined) e.innerHTML = html
  return e
}

export function createUI({ onDeselect }) {
  const app = document.getElementById('app')

  // ---- stats bar ----
  const stats = el('div', 'hud stats')
  app.appendChild(stats)

  // ---- ticker ----
  const ticker = el('div', 'hud ticker')
  app.appendChild(ticker)
  const tickerLines = []

  // ---- inspector ----
  const panel = el('div', 'hud panel hidden')
  app.appendChild(panel)

  // ---- hint ----
  const hint = el('div', 'hud hint', 'drag to orbit · click a stranger to meet them')
  app.appendChild(hint)
  setTimeout(() => hint.classList.add('fade'), 9000)

  function setStats(s, extra) {
    const chips = [
      `<span class="chip">day <b>${s.day.toFixed(1)}</b></span>`,
      `<span class="chip">deals <b>${s.dealCount}</b></span>`,
      `<span class="chip">walkaways <b>${s.walkawayCount}</b></span>`,
      `<span class="chip"><img src="${iconURL('coin', 15)}"> traded <b>${s.volumeCoins}¢</b></span>`,
      `<span class="chip">supply <b>${s.moneySupply}¢</b></span>`,
      extra ? `<span class="chip">${extra}</span>` : '',
    ]
    stats.innerHTML = `<div class="title">The Night Bazaar</div>` + chips.join('')
  }

  function addTicker(line) {
    tickerLines.unshift(line)
    if (tickerLines.length > 7) tickerLines.pop()
    ticker.innerHTML = tickerLines
      .map((l, i) => `<div class="line" style="opacity:${(1 - i * 0.13).toFixed(2)}">${l}</div>`)
      .join('')
  }

  const bar = (label, v, hue) =>
    `<div class="attr"><span>${label}</span><div class="bar"><i style="width:${(v * 100).toFixed(0)}%;background:hsl(${hue},62%,52%)"></i></div></div>`

  /** @param {object} a sim actor  @param {object} econState economy.actorState(id) */
  function showActor(a, econState) {
    const p = a.persona
    const ap = SPECIES_LABEL[a.species] || a.species
    const inv = Object.entries(econState.inventory || {}).filter(([, n]) => n > 0)
    const stockRows =
      a.role === 'vendor' && econState.stock
        ? Object.entries(econState.stock)
            .map(([gid, n]) => {
              const ask = econState.asks?.[gid]
              return `<div class="invrow"><img src="${iconURL(goodById(gid).icon)}"> ×${n} <span class="ask">asking ${ask}¢</span></div>`
            })
            .join('')
        : ''
    panel.innerHTML = `
      <button class="close" aria-label="close">×</button>
      <div class="pname">${p.name}</div>
      <div class="ptitle">${ap} · ${p.title}</div>
      <p class="story">${p.backstory}</p>
      <div class="attrs">
        ${bar('greed', p.attrs.greed, 0)}
        ${bar('patience', p.attrs.patience, 145)}
        ${bar('charm', p.attrs.charm, 275)}
        ${bar('temper', p.attrs.temper, 22)}
      </div>
      <div class="wallet"><img src="${iconURL('coin', 17)}"> <b>${econState.wallet}¢</b>
        <span class="deals">${econState.deals} deals · ${econState.walkaways} walkaways</span></div>
      ${stockRows ? `<div class="invhead">on the counter</div>${stockRows}` : ''}
      ${
        inv.length && a.role !== 'vendor'
          ? `<div class="invhead">in their basket</div><div class="invrow">` +
            inv.map(([gid, n]) => `<img title="${goodById(gid).name}" src="${iconURL(goodById(gid).icon)}"><em>×${n}</em>`).join(' ') +
            `</div>`
          : ''
      }
      <div class="doing">${describeState(a)}</div>`
    panel.classList.remove('hidden')
    panel.querySelector('.close').onclick = () => {
      hideActor()
      onDeselect && onDeselect()
    }
  }

  function describeState(a) {
    switch (a.state) {
      case 'haggle':
        return 'currently: haggling'
      case 'walkTo':
        return a.errand?.kind === 'buy' ? 'currently: heading to a stall' : a.errand?.kind === 'watch' ? 'currently: going to hear the busker' : 'currently: wandering'
      case 'browse':
        return 'currently: eyeing the goods'
      case 'watch':
        return 'currently: enjoying the music'
      case 'tend':
        return 'currently: minding the stall'
      case 'busk':
        return 'currently: performing'
      default:
        return 'currently: taking in the night air'
    }
  }

  function hideActor() {
    panel.classList.add('hidden')
  }

  return { setStats, addTicker, showActor, hideActor }
}
