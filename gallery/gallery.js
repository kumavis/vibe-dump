import { TAGS, validateManifest, parseFilters, matchesFilters, creditsText } from './gallery-model.js'

const grid = document.getElementById('grid')
const nav = document.getElementById('filters')
const loading = document.getElementById('loading')
const error = document.getElementById('error')
const empty = document.getElementById('empty')
let apps = [], cards = [], chips = [], count, clear, filters = parseFilters(location.hash)

function element(tag, className, text) {
  const node = document.createElement(tag)
  if (className) node.className = className
  if (text !== undefined) node.textContent = text
  return node
}

function renderCard(app) {
  const card = element('a', 'card')
  card.href = `./${app.slug}/`
  card.dataset.tags = app.tags.join(' ')
  card.dataset.status = app.status
  if (app.hasThumbnail) {
    const img = element('img', 'thumb')
    img.src = `./${app.slug}/thumbnail.jpg`
    img.alt = `Screenshot of ${app.title}`
    img.loading = 'lazy'
    card.append(img)
  } else card.append(element('div', 'thumb thumb--empty', app.title))
  if (app.status === 'wip') card.append(element('span', 'wip', 'WIP'))
  const body = element('div', 'card__body')
  body.append(element('h2', 'card__title', app.title), element('p', 'card__desc', app.description))
  const credits = creditsText(app)
  if (credits) body.append(element('p', 'card__credits', credits))
  const tags = element('div', 'card__tags')
  for (const tag of app.tags) tags.append(element('span', 'tag', tag))
  body.append(tags)
  card.append(body)
  return card
}

function renderFilters() {
  nav.replaceChildren()
  chips = []
  for (const [group, values] of [['tag', TAGS], ['status', ['wip', 'done']]]) {
    if (group === 'status') {
      const sep = element('span', 'filters__sep')
      sep.setAttribute('role', 'separator')
      nav.append(sep)
    }
    for (const value of values) {
      const chip = element('button', `chip${group === 'status' ? ' chip--status' : ''}`, value)
      chip.type = 'button'
      chip.dataset[group] = value
      chip.append(element('span', 'chip__n', String(apps.filter(app => group === 'tag' ? app.tags.includes(value) : app.status === value).length)))
      chip.addEventListener('click', () => {
        filters[group].has(value) ? filters[group].delete(value) : filters[group].add(value)
        applyFilters()
      })
      nav.append(chip)
      chips.push(chip)
    }
  }
  clear = element('button', 'chip chip--clear', 'clear')
  clear.type = 'button'; clear.id = 'clear'
  clear.addEventListener('click', () => { filters = parseFilters(); applyFilters() })
  count = element('output', 'filters__count')
  count.id = 'count'
  count.setAttribute('aria-live', 'polite')
  nav.append(clear, count)
}

function applyFilters(writeUrl = true) {
  let shown = 0
  cards.forEach((card, i) => {
    card.hidden = !matchesFilters(apps[i], filters)
    if (!card.hidden) shown++
  })
  for (const chip of chips) {
    const group = chip.dataset.tag ? 'tag' : 'status'
    chip.setAttribute('aria-pressed', String(filters[group].has(chip.dataset[group])))
  }
  const filtered = filters.tag.size > 0 || filters.status.size > 0
  count.textContent = filtered ? `${shown} of ${cards.length}` : ''
  clear.hidden = !filtered
  empty.hidden = shown > 0
  if (writeUrl) {
    const url = new URL(location.href)
    url.hash = [...filters.tag, ...filters.status].join(',')
    history.replaceState(null, '', url)
  }
}

async function loadGallery() {
  loading.hidden = false; error.hidden = true
  grid.setAttribute('aria-busy', 'true')
  try {
    const response = await fetch('./apps.json', { cache: 'no-cache' })
    if (!response.ok) throw new Error(`App list: HTTP ${response.status}`)
    apps = validateManifest(await response.json())
    filters = parseFilters(location.hash)
    cards = apps.map(renderCard)
    grid.replaceChildren(...cards)
    renderFilters()
    applyFilters()
  } catch (err) {
    console.error('Could not load gallery:', err)
    error.hidden = false
  } finally {
    loading.hidden = true
    grid.setAttribute('aria-busy', 'false')
  }
}

document.getElementById('retry').addEventListener('click', loadGallery)
window.addEventListener('hashchange', () => {
  filters = parseFilters(location.hash)
  if (count) applyFilters(false)
})
loadGallery()
