import { SUITS, label, rankName, newGame, clone, pile, movingCards, canMove, move, draw, won, hints, validSave } from './engine.js'

const $ = s => document.querySelector(s)
const KEY = 'lani-mushroom-solitaire-v1'
let state, initial, history = [], selected = null, sound = false, hintIndex = 0, drag = null, lastTap = null, scrollFrame, audioContext
try {
  const saved = JSON.parse(localStorage.getItem(KEY))
  if (saved && validSave(saved.state) && validSave(saved.initial)) {
    state = saved.state; initial = saved.initial; history = (saved.history || []).filter(validSave).slice(-100); sound = !!saved.sound
  }
} catch { /* A private browser can still play without storage. */ }
if (!state) { state = newGame(); initial = clone(state) }
const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
const suitIcon = suit => `<svg class="suit-icon" viewBox="0 0 48 48" aria-hidden="true"><path d="M19 25h10l3 17c-3 4-13 4-16 0z" fill="#f0e4c5"/><path d="M3 23C4 7 16 2 25 3c12 0 20 10 20 20 0 7-42 7-42 0" fill="${SUITS[suit].color}"/>${suit === 1 ? '<g fill="#fff5d9"><ellipse cx="14" cy="16" rx="5" ry="4"/><ellipse cx="32" cy="12" rx="4" ry="3"/><ellipse cx="29" cy="24" rx="5" ry="3"/></g>' : ''}</svg>`
function save() { try { localStorage.setItem(KEY, JSON.stringify({ state, initial, history, sound })) } catch {} }
function message(text) { $('#message').textContent = text }
function tone(high = false) {
  if (!sound) return
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)()
    audioContext.resume()
    const o = audioContext.createOscillator(), g = audioContext.createGain(), now = audioContext.currentTime
    o.type = 'sine'; o.frequency.setValueAtTime(high ? 659 : 440, now); o.frequency.exponentialRampToValueAtTime(high ? 880 : 523, now + .09)
    g.gain.setValueAtTime(.055, now); g.gain.exponentialRampToValueAtTime(.001, now + .22)
    o.connect(g); g.connect(audioContext.destination); o.start(); o.stop(now + .23)
  } catch {}
}
function commit(next, text) {
  if (!next) return false
  cancelDrag(); lastTap = null
  history.push(clone(state)); if (history.length > 100) history.shift()
  state = next; selected = null; hintIndex = 0; save(); render(); tone(text?.includes('gather'))
  if (text) message(text)
  if (won(state)) celebrate()
  return true
}
function cardElement(card, loc) {
  const b = document.createElement('button')
  b.className = `card ${card.faceUp ? 'face-up' : 'face-down'}`
  b.dataset.id = card.id
  b._loc = loc
  b.setAttribute('aria-label', card.faceUp ? label(card) : 'Face-down card')
  b.setAttribute('aria-pressed', 'false')
  if (!card.faceUp) { b.tabIndex = -1; b.setAttribute('aria-disabled', 'true') }
  b.innerHTML = `<img src="./cards/${card.faceUp ? card.id : 'back'}.jpg" alt="" draggable="false">`
  if (card.faceUp) {
    b.addEventListener('click', e => { e.stopPropagation(); if (e.detail !== 0 && performance.now() < suppressClickUntil) return; selectCard(loc) })
    b.addEventListener('dblclick', e => { e.preventDefault(); e.stopPropagation(); if (performance.now() >= suppressClickUntil) gather(loc) })
    b.addEventListener('keydown', e => { if (e.key === 'Enter' && e.shiftKey) { e.preventDefault(); gather(loc) } })
  }
  return b
}
function render() {
  $('#time').textContent = fmt(state.seconds); $('#moves').textContent = state.moves
  $('#gathered').textContent = state.foundations.flat().length; $('#undo').disabled = !history.length
  $('#collect').disabled = !hints(state).some(h => h.to.type === 'foundation')
  const stock = $('#stock'); stock.replaceChildren(); stock.classList.toggle('stock-empty', !state.stock.length)
  stock.setAttribute('role', 'button'); stock.tabIndex = 0
  stock.setAttribute('aria-label', state.stock.length ? `Draw a card, ${state.stock.length} remaining` : state.waste.length ? 'Recycle the deck' : 'No cards left in the deck')
  if (state.stock.length) { const c = cardElement(state.stock.at(-1), { type: 'stock' }); c.tabIndex = -1; stock.append(c) }
  else stock.innerHTML = `↻<small>${state.waste.length ? 'GO AGAIN' : 'ALL PICKED'}</small>`
  $('#stock-label').textContent = state.stock.length ? `PICK A CARD · ${state.stock.length}` : 'A FRESH LOOP'
  const waste = $('#waste'); waste.replaceChildren()
  if (state.waste.length) waste.append(cardElement(state.waste.at(-1), { type: 'waste' }))
  const foundations = $('#foundations'); foundations.replaceChildren()
  for (let col = 0; col < 4; col++) {
    const p = document.createElement('div'); p.className = 'pile foundation'; p.dataset.type = 'foundation'; p.dataset.col = col
    p.setAttribute('role', 'button'); p.tabIndex = 0; p.setAttribute('aria-label', `${SUITS[col].name} foundation, ${state.foundations[col].length} cards`)
    p.innerHTML = `${suitIcon(col)}<span class="foundation-letter">A</span>`
    p.addEventListener('click', () => destination({ type: 'foundation', col }))
    p.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); destination({ type: 'foundation', col }) } })
    if (state.foundations[col].length) p.append(cardElement(state.foundations[col].at(-1), { type: 'foundation', col }))
    foundations.append(p)
  }
  const tableau = $('#tableau'); tableau.replaceChildren()
  const css = getComputedStyle(document.documentElement), step = parseFloat(css.getPropertyValue('--step')) || 25, back = parseFloat(css.getPropertyValue('--back-step')) || 18
  // Resolve responsive clamp() custom properties through a real element.
  const probe = document.createElement('div'); probe.style.height = 'var(--step)'; document.body.append(probe); const realStep = probe.getBoundingClientRect().height || step; probe.remove()
  state.tableau.forEach((cards, col) => {
    const p = document.createElement('div'); p.className = 'column'; p.dataset.type = 'tableau'; p.dataset.col = col
    p.tabIndex = 0; p.setAttribute('role', 'button'); p.setAttribute('aria-label', `Column ${col + 1}${cards.length ? '' : ', empty, Kings welcome'}`)
    p.addEventListener('click', () => destination({ type: 'tableau', col }))
    p.addEventListener('keydown', e => { if (e.target === p && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); destination({ type: 'tableau', col }) } })
    let offset = 0
    cards.forEach((c, index) => { const b = cardElement(c, { type: 'tableau', col, index }); b.style.top = `${offset}px`; p.append(b); if (index < cards.length - 1) offset += c.faceUp ? realStep : back })
    p.style.height = `calc(var(--card-h) + ${offset}px)`
    tableau.append(p)
  })
  paintSelection(); updateSound()
}
function paintSelection() {
  const ids = new Set(selected ? movingCards(state, selected).map(c => c.id) : [])
  document.querySelectorAll('.card').forEach(b => { const yes = ids.has(b.dataset.id); b.classList.toggle('selected', yes); b.setAttribute('aria-pressed', String(yes)) })
}
function destination(to) {
  if (!selected) { if (to.type === 'foundation') message('Each mushroom suit grows here, from Ace up to King.'); else message('Pick a face-up card first. Empty patches are for Kings.'); return }
  const from = selected, cards = movingCards(state, from)
  if (commit(move(state, from, to), to.type === 'foundation' ? `${rankName(cards[0].rank)} gathered. Your garden is growing!` : 'A lovely little move.')) return
  message(to.type === 'foundation' ? 'Gather an Ace first, then the next card in the same mushroom suit.' : 'Build down by one, alternating light and dark mushrooms. Empty patches need a King.')
}
function selectCard(loc) {
  if (selected && canMove(state, selected, { type: loc.type, col: loc.col })) { destination({ type: loc.type, col: loc.col }); return }
  if (selected && JSON.stringify(selected) === JSON.stringify(loc)) { selected = null; paintSelection(); return }
  selected = loc; paintSelection()
  const c = movingCards(state, loc)[0]
  if (c) message(`${label(c)} selected. Choose its new patch.`)
}
function gather(loc) {
  const cards = movingCards(state, loc)
  if (cards.length !== 1) { message('Gather one top card at a time.'); return }
  if (!commit(move(state, loc, { type: 'foundation', col: cards[0].suit }), `${rankName(cards[0].rank)} gathered. A little more room to grow!`)) message('That mushroom isn’t ready to gather yet. Start with an Ace, then grow in order.')
}
function drawCard() { commit(draw(state), state.stock.length ? 'A new little possibility.' : 'Around we grow again.'); }
$('#stock').addEventListener('click', drawCard)
$('#stock').addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); drawCard() } })
function undo() {
  if (!history.length) return
  lastTap = null; cancelDrag()
  const seconds = state.seconds; state = history.pop(); state.seconds = seconds; selected = null; hintIndex = 0; save(); render(); message('A little do-over. We all need one sometimes.')
}
$('#undo').onclick = undo
function hint() {
  document.querySelectorAll('.hinted').forEach(e => e.classList.remove('hinted'))
  const options = hints(state)
  if (!options.length) {
    if (state.stock.length || state.waste.length) { $('#stock').classList.add('hinted'); message(state.stock.length ? 'Pick from the orange deck for a fresh possibility.' : 'Tap the circle to turn the deck over and try again.') }
    else message('This patch has no moves left. Try Undo or plant a new game.')
    return
  }
  const h = options[hintIndex++ % options.length], card = movingCards(state, h.from)[0]
  document.querySelector(`[data-id="${card.id}"]`)?.classList.add('hinted')
  document.querySelector(`[data-type="${h.to.type}"][data-col="${h.to.col}"]`)?.classList.add('hinted')
  message(`Try ${label(card)} → ${h.to.type === 'foundation' ? 'its mushroom foundation' : `column ${h.to.col + 1}`}.`)
}
$('#hint').onclick = hint
$('#collect').onclick = () => {
  // One reversible batch gathers every currently available foundation card.
  let next = clone(state), count = 0, h
  while ((h = hints(next).find(h => h.to.type === 'foundation'))) { next = move(next, h.from, h.to); count++ }
  if (count) commit(next, `${count} happy little mushroom${count > 1 ? 's' : ''} gathered. Undo brings them all back.`)
  else message('No mushrooms to gather just yet. Find an Ace or the next card in a suit.')
}
function updateSound() {
  $('#sound').innerHTML = `<svg viewBox="0 0 24 24"><path d="M11 5 6 9H3v6h3l5 4z"/>${sound ? '<path d="M15 8c3 2 3 6 0 8m3-11c5 4 5 10 0 14"/>' : '<path d="m16 9 6 6m0-6-6 6"/>'}</svg>`
  $('#sound').setAttribute('aria-label', `Turn sound ${sound ? 'off' : 'on'}`); $('#sound').setAttribute('aria-pressed', String(sound))
}
$('#sound').onclick = () => { sound = !sound; updateSound(); save(); tone() }
const dialog = $('#dialog')
function showDialog(html) { cancelDrag(); lastTap = null; $('#dialog-content').innerHTML = `<div class="dialog-top"><span aria-hidden="true">🍄</span><button class="close-dialog" aria-label="Close dialog">×</button></div>${html}`; $('.close-dialog').onclick = () => dialog.close(); if (!dialog.open) dialog.showModal() }
dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close() } })
$('#help').onclick = () => {
  showDialog(`<h2>A little room to grow.</h2><p>Classic draw-one solitaire, with a mushroom twist. Bring all 52 cards home to the four mushroom foundations.</p><div class="suit-guide">${SUITS.map((s, i) => `<div>${suitIcon(i)}<span>${s.name} · ${s.family ? 'dark' : 'light'}</span></div>`).join('')}</div><ol><li><strong>Pick a card.</strong> Tap the orange deck. Recycle it as often as you like.</li><li><strong>Make a little stack.</strong> Build downward (9, 8, 7…), alternating light and dark mushroom families. Move whole face-up stacks, too.</li><li><strong>Give Kings some space.</strong> Only a King, or a stack starting with one, can fill an empty column.</li><li><strong>Gather your mushrooms.</strong> Build each foundation in its own suit, from Ace to King. Double-tap a top card, or use Gather.</li></ol><p>Tap a card, then its destination, or drag it there. Keyboard: Tab + Enter to select and move, Shift + Enter to gather, H for a hint, Z to undo, Esc to deselect. Your game saves as you play.</p><div class="dialog-actions"><button class="primary" id="lets-play">Let’s grow ♡</button></div>`)
  $('#lets-play').onclick = () => dialog.close()
}
function reset(s) { cancelDrag(); lastTap = null; state = clone(s); initial = clone(s); history = []; selected = null; save(); render(); dialog.close(); message('A fresh little start. Let’s see what grows.') }
$('#new-game').onclick = () => {
  if (!state.started) { reset(newGame()); return }
  showDialog('<h2>Plant a fresh patch?</h2><p>Start with a new shuffle, or give this same deal another little go. This will replace your saved game.</p><div class="dialog-actions"><button id="restart">Same deal</button><button class="primary" id="fresh">New shuffle ✿</button></div>')
  $('#restart').onclick = () => reset(initial); $('#fresh').onclick = () => reset(newGame())
}
function celebrate() {
  save(); const root = $('#confetti'); root.replaceChildren()
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) for (let i = 0; i < 42; i++) { const p = document.createElement('i'); p.textContent = ['🍄', '✿', '🍊', '♡', '✧'][i % 5]; p.style.left = `${Math.random() * 100}%`; p.style.animationDelay = `${Math.random() * .7}s`; root.append(p) }
  setTimeout(() => root.replaceChildren(), 4500)
  showDialog(`<h2>Look what you grew!</h2><p>Every mushroom found its happy little home. You did it!</p><p class="win-stats">${state.moves} moves · ${fmt(state.seconds)} · 52 happy mushrooms</p><div class="dialog-actions"><button class="primary" id="play-again">Plant another patch ✿</button></div>`)
  $('#play-again').onclick = () => reset(newGame())
}
let suppressClickUntil = 0
// Handle touch taps on pointerup: Safari's synthesized click/dblclick events
// can arrive after a card has moved and the board has been rebuilt.
document.addEventListener('click', e => {
  if (e.detail !== 0 && performance.now() < suppressClickUntil && e.target.closest('#table')) {
    e.preventDefault(); e.stopImmediatePropagation()
  }
}, true)
$('#table').addEventListener('pointerdown', e => {
  if (e.button !== 0 || !e.isPrimary || drag || dialog.open) return
  const button = e.target.closest('.face-up'), target = e.target.closest('[data-type]')
  if (!target || (!button && e.pointerType === 'mouse')) return
  const loc = button?._loc, cards = loc ? movingCards(state, loc) : []
  const element = button || target, r = element.getBoundingClientRect()
  drag = { pointerId: e.pointerId, pointerType: e.pointerType, element, target,
    startX: e.clientX, startY: e.clientY, clientX: e.clientX, clientY: e.clientY,
    x: e.clientX - r.left, y: e.clientY - r.top, loc, cards, rect: r, ghost: null, moved: false }
  if (e.pointerType !== 'mouse') e.preventDefault()
  try { element.setPointerCapture(e.pointerId) } catch { /* The pointer may already have been cancelled. */ }
})
function dropTarget(x, y) {
  const target = document.elementFromPoint(x, y)?.closest('[data-type]')
  return target && ['foundation', 'tableau'].includes(target.dataset.type) ? target : null
}
function highlightDropTarget() {
  document.querySelectorAll('.drop-target').forEach(e => e.classList.remove('drop-target'))
  if (!drag?.ghost) return
  const target = dropTarget(drag.clientX, drag.clientY)
  if (target && canMove(state, drag.loc, { type: target.dataset.type, col: Number(target.dataset.col) })) target.classList.add('drop-target')
}
function scrollDrag() {
  if (!drag?.ghost) return
  const edge = 60, y = drag.clientY, height = window.visualViewport?.height || innerHeight
  const speed = y < edge ? -Math.min(14, (edge - y) / 4) : y > height - edge ? Math.min(14, (y - height + edge) / 4) : 0
  if (speed) { window.scrollBy(0, speed); highlightDropTarget() }
  scrollFrame = requestAnimationFrame(scrollDrag)
}
document.addEventListener('pointermove', e => {
  if (!drag || e.pointerId !== drag.pointerId) return
  drag.clientX = e.clientX; drag.clientY = e.clientY
  if (Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) > 8) drag.moved = true
  if (!drag.ghost && drag.moved && drag.cards.length) {
    lastTap = null
    const g = document.createElement('div'); g.className = 'drag-ghost'; g.style.width = `${drag.rect.width}px`
    drag.cards.forEach(c => { const orig = document.querySelector(`[data-id="${c.id}"]`); if (orig) { const b = orig.cloneNode(true); b.classList.remove('selected'); b.style.top = `${orig.getBoundingClientRect().top - drag.rect.top}px`; b.tabIndex = -1; b.setAttribute('aria-hidden', 'true'); g.append(b); orig.classList.add('dragging-origin') } })
    g.setAttribute('aria-hidden', 'true')
    document.body.append(g); drag.ghost = g
    scrollFrame = requestAnimationFrame(scrollDrag)
  }
  if (drag.ghost) { e.preventDefault(); drag.ghost.style.left = `${e.clientX - drag.x}px`; drag.ghost.style.top = `${e.clientY - drag.y - (drag.pointerType === 'touch' ? 18 : 0)}px`; highlightDropTarget() }
}, { passive: false })
function cancelDrag() {
  const d = drag; drag = null
  cancelAnimationFrame(scrollFrame)
  d?.ghost?.remove()
  document.querySelectorAll('.dragging-origin,.drop-target').forEach(e => e.classList.remove('dragging-origin', 'drop-target'))
  if (d?.element.hasPointerCapture(d.pointerId)) d.element.releasePointerCapture(d.pointerId)
}
document.addEventListener('pointerup', e => {
  if (!drag || e.pointerId !== drag.pointerId) return
  const d = drag
  const target = d.ghost ? dropTarget(e.clientX, e.clientY) : d.target
  cancelDrag()
  if (d.ghost) {
    e.preventDefault(); suppressClickUntil = performance.now() + 500
    if (target) { selected = d.loc; destination({ type: target.dataset.type, col: Number(target.dataset.col) }) }
    selected = null; paintSelection()
  } else if (d.pointerType !== 'mouse') {
    e.preventDefault(); suppressClickUntil = performance.now() + 500
    if (d.moved) { lastTap = null; return }
    if (d.loc) {
      const id = d.cards[0]?.id, now = performance.now()
      if (lastTap?.id === id && now - lastTap.at < 350 && Math.hypot(e.clientX - lastTap.x, e.clientY - lastTap.y) < 24) {
        lastTap = null; gather(d.loc)
      } else {
        const moves = state.moves; selectCard(d.loc)
        lastTap = state.moves === moves ? { id, at: now, x: e.clientX, y: e.clientY } : null
      }
    } else {
      lastTap = null
      if (target.dataset.type === 'stock') drawCard()
      else destination({ type: target.dataset.type, col: Number(target.dataset.col) })
    }
  }
})
function cancelPointer(e) { if (drag?.pointerId === e.pointerId) { lastTap = null; cancelDrag() } }
document.addEventListener('pointercancel', cancelPointer)
document.addEventListener('lostpointercapture', cancelPointer)
window.addEventListener('blur', () => { lastTap = null; cancelDrag() })
document.addEventListener('contextmenu', e => { if (e.target.closest('#table .card')) e.preventDefault() })
document.addEventListener('keydown', e => {
  if (dialog.open || e.ctrlKey || e.metaKey || e.altKey) return
  if (e.key.toLowerCase() === 'z') { e.preventDefault(); undo() }
  if (e.key.toLowerCase() === 'h') { e.preventDefault(); hint() }
  if (e.key === 'Escape') { selected = null; cancelDrag(); paintSelection(); message('Take your time. Your little garden is right here.') }
})
let resizeFrame
window.addEventListener('resize', () => { lastTap = null; cancelDrag(); cancelAnimationFrame(resizeFrame); resizeFrame = requestAnimationFrame(render) })
setInterval(() => { if (state.started && !won(state) && !document.hidden && !dialog.open) { state.seconds++; $('#time').textContent = fmt(state.seconds); if (state.seconds % 5 === 0) save() } }, 1000)
window.addEventListener('pagehide', () => { cancelDrag(); save() })
document.addEventListener('visibilitychange', () => { if (document.hidden) { lastTap = null; cancelDrag(); save() } })
render()
