import { test } from 'node:test'
import assert from 'node:assert/strict'
import { chromium, webkit, devices } from 'playwright'
import { startStaticServer } from '../../scripts/static-server.mjs'
import { newGame, validSave } from './engine.js'

const KEY = 'lani-mushroom-solitaire-v1'
function fixture() {
  const s = newGame(), all = [...s.stock, ...s.tableau.flat()]
  const take = (suit, rank, faceUp = true) => {
    const i = all.findIndex(c => c.suit === suit && c.rank === rank)
    return { ...all.splice(i, 1)[0], faceUp }
  }
  s.tableau = [
    [take(0, 5, false), take(1, 8), take(2, 7)],
    [take(0, 9)], [take(3, 1)], [], [take(1, 13)], [take(3, 7)], [],
  ]
  s.waste = [take(0, 6)]; s.stock = all.map(c => ({ ...c, faceUp: false }))
  assert.ok(validSave(s))
  return s
}
const read = page => page.evaluate(key => JSON.parse(localStorage.getItem(key)), KEY)
const card = (page, id) => page.locator(`.card[data-id="${id}"]`)
async function point(locator, top = false) {
  const b = await locator.boundingBox()
  assert.ok(b, 'gesture target must be visible')
  return { x: b.x + b.width / 2, y: b.y + (top ? 10 : b.height / 2) }
}
async function dispatch(page, type, p, { id = 1, primary = true, selector = 'body', pointerType = 'touch' } = {}) {
  await page.locator(selector).evaluate((el, args) => el.dispatchEvent(new PointerEvent(args.type, {
    bubbles: true, cancelable: true, pointerType: args.pointerType,
    pointerId: args.id, isPrimary: args.primary, button: 0,
    buttons: args.type === 'pointerup' || args.type === 'pointercancel' ? 0 : 1,
    clientX: args.p.x, clientY: args.p.y,
  })), { type, p, id, primary, pointerType })
}

for (const browserType of [webkit, chromium]) {
  test(`${browserType.name()}: iPad touch controls`, async t => {
    const server = await startStaticServer(new URL('./dist/', import.meta.url).pathname)
    let browser
    try { browser = await browserType.launch() } catch (error) { await server.close(); throw error }
    async function run(fn, options = {}) {
      const context = await browser.newContext({ ...devices['iPad (gen 7)'], ...options })
      const page = await context.newPage(), errors = []
      page.on('pageerror', e => errors.push(e.message))
      await page.addInitScript(({ key, state }) => {
        if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify({ state, initial: state, history: [] }))
      }, { key: KEY, state: fixture() })
      try {
        await page.goto(server.url)
        await page.evaluate(() => document.fonts.ready)
        await fn(page)
        assert.deepEqual(errors, [], 'no uncaught browser errors')
      } finally { await context.close() }
    }
    try {
      await t.test('real touch taps draw once, select a stack, move, undo, and restore saved progress', () => run(async page => {
        await page.locator('#stock').tap()
        assert.equal((await read(page)).state.moves, 1, 'a tap must not also cause a duplicate click')
        await page.locator('#undo').tap()
        await card(page, '1-8').tap({ position: { x: 20, y: 10 } })
        assert.equal(await page.locator('.selected').count(), 2)
        await card(page, '0-9').tap({ position: { x: 20, y: 10 } })
        const moved = (await read(page)).state
        assert.equal(moved.moves, 1)
        assert.deepEqual(moved.tableau[1].map(c => c.id), ['0-9', '1-8', '2-7'])
        assert.ok(moved.tableau[0][0].faceUp)
        await page.reload()
        assert.deepEqual((await read(page)).state.tableau, moved.tableau)
        await page.locator('#undo').tap()
        assert.equal((await read(page)).state.moves, 0)
        assert.equal((await read(page)).state.tableau[0].length, 3)
      }))
      await t.test('explicit double-tap gathers exactly once without relying on dblclick', () => run(async page => {
        await page.evaluate(() => document.addEventListener('dblclick', e => e.stopImmediatePropagation(), true))
        await card(page, '3-1').tap()
        await card(page, '3-1').tap()
        const s = (await read(page)).state
        assert.equal(s.foundations[3].length, 1)
        assert.equal(s.moves, 1)
        await page.locator('#undo').tap()
        assert.equal((await read(page)).state.tableau[2][0].id, '3-1')
      }))
      await t.test('tapping an empty patch moves a King and the next rapid stock tap still draws once', () => run(async page => {
        await card(page, '1-13').tap()
        await page.locator('.column[data-col="3"]').tap()
        assert.equal((await read(page)).state.tableau[3][0].rank, 13)
        await page.locator('#stock').tap()
        assert.equal((await read(page)).state.moves, 2)
      }))
      await t.test('pointer dragging highlights legal drops, moves the full stack, and ignores a second finger', () => run(async page => {
        const start = await point(card(page, '1-8'), true), end = await point(card(page, '0-9'), true)
        if (browserType === chromium) {
          const cdp = await page.context().newCDPSession(page)
          await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ ...start, id: 1 }] })
          assert.ok(await card(page, '1-8').evaluate(el => el.hasPointerCapture(2)), 'Chrome primary touch pointer is captured')
          await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ ...end, id: 1 }] })
          assert.equal(await page.locator('.drag-ghost').count(), 1)
          assert.equal(await page.locator('.drop-target').count(), 1)
          await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
        } else {
          // Playwright exposes real tap input in WebKit; drag/swipe input is
          // exercised with the same PointerEvent sequence Safari delivers.
          await dispatch(page, 'pointerdown', start, { selector: '.card[data-id="1-8"]' })
          await dispatch(page, 'pointermove', end)
          assert.equal(await page.locator('.drag-ghost').count(), 1)
          assert.equal(await page.locator('.drop-target').count(), 1)
          await dispatch(page, 'pointerdown', end, { id: 2, primary: false, selector: '.card[data-id="0-9"]' })
          await dispatch(page, 'pointercancel', end, { id: 2, primary: false })
          assert.equal(await page.locator('.drag-ghost').count(), 1, 'a second finger cannot cancel the first drag')
          await dispatch(page, 'pointerup', end)
        }
        assert.equal((await read(page)).state.tableau[1].length, 3)
        assert.equal((await read(page)).state.moves, 1)
        assert.equal(await page.locator('.drag-ghost,.dragging-origin,.drop-target').count(), 0)
      }))
      await t.test('cancelled, lost-capture, rotated, and illegal drags leave the deck unchanged', () => run(async page => {
        const start = await point(card(page, '1-8'), true), end = await point(card(page, '0-9'), true)
        for (const event of ['pointercancel', 'lostpointercapture']) {
          await dispatch(page, 'pointerdown', start, { selector: '.card[data-id="1-8"]' })
          await dispatch(page, 'pointermove', end)
          await dispatch(page, event, end)
          assert.equal(await page.locator('.drag-ghost,.dragging-origin,.drop-target').count(), 0)
          assert.equal((await read(page)).state.moves, 0)
        }
        await dispatch(page, 'pointerdown', start, { selector: '.card[data-id="1-8"]' })
        await dispatch(page, 'pointermove', { x: 5, y: 200 })
        await dispatch(page, 'pointerup', { x: 5, y: 200 })
        assert.equal((await read(page)).state.moves, 0)
        await dispatch(page, 'pointerdown', start, { selector: '.card[data-id="1-8"]' })
        await dispatch(page, 'pointermove', end)
        await page.setViewportSize({ width: 1080, height: 810 })
        await page.waitForFunction(() => !document.querySelector('.drag-ghost'))
        assert.equal((await read(page)).state.moves, 0)
      }))
      await t.test('edge scrolling keeps long stacks reachable and stops when the gesture is cancelled', () => run(async page => {
        await page.evaluate(() => { document.body.style.paddingBottom = '1500px' })
        const start = await point(card(page, '1-8'), true)
        await dispatch(page, 'pointerdown', start, { selector: '.card[data-id="1-8"]' })
        await dispatch(page, 'pointermove', { x: start.x, y: 1060 })
        await page.waitForFunction(() => scrollY > 50)
        await dispatch(page, 'pointercancel', { x: start.x, y: 1060 })
        const stopped = await page.evaluate(() => scrollY)
        await page.waitForTimeout(100)
        assert.equal(await page.evaluate(() => scrollY), stopped)
      }, { viewport: { width: 810, height: 1080 } }))
      await t.test('tablet portrait/landscape and phone layouts have no overflow, with finger-sized controls', () => run(async page => {
        for (const viewport of [{ width: 810, height: 1080 }, { width: 1080, height: 810 }, { width: 375, height: 812 }]) {
          await page.setViewportSize(viewport)
          await page.waitForTimeout(75)
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `no overflow at ${viewport.width}`)
          for (const selector of ['#undo', '#hint', '#collect', '#new-game', '#help', '#sound']) {
            assert.ok((await page.locator(selector).boundingBox()).height >= 44, `${selector} touch target`)
          }
          const a = await card(page, '1-8').boundingBox(), b = await card(page, '2-7').boundingBox()
          assert.ok(b.y - a.y >= 44, 'exposed stack cards have a finger-sized strip')
        }
        await page.locator('#help').tap()
        await page.locator('#lets-play').tap()
        assert.equal(await page.locator('dialog').isVisible(), false)
      }))
      await t.test('mouse drag and keyboard play remain available', () => run(async page => {
        const start = await point(card(page, '1-8'), true), end = await point(card(page, '0-9'), true)
        await page.mouse.move(start.x, start.y); await page.mouse.down()
        await page.mouse.move(end.x, end.y, { steps: 8 }); await page.mouse.up()
        assert.equal((await read(page)).state.moves, 1)
        await page.keyboard.press('z')
        await card(page, '1-8').focus(); await page.keyboard.press('Enter')
        await card(page, '0-9').focus(); await page.keyboard.press('Enter')
        assert.equal((await read(page)).state.moves, 1)
      }, { hasTouch: false, isMobile: false }))
    } finally { await browser.close(); await server.close() }
  })
}
