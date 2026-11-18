// Explicit LOCAL checks only; neither CI nor deployment invokes Playwright.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, cp, writeFile, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { chromium, webkit } from 'playwright'
import { startStaticServer } from './static-server.mjs'
import { root } from './apps.mjs'
import { SHELL_FILES } from './build-gallery.mjs'

const items = [
  { slug: 'alpha', title: 'Alpha', tags: ['art', 'kids'], status: 'wip', hasThumbnail: true },
  { slug: 'beta', title: 'Beta', tags: ['tool'], status: 'done', hasThumbnail: true },
  { slug: 'gamma', title: '<img src=x onerror="window.injected=true">', tags: ['game', 'kids'], status: 'done', hasThumbnail: false },
].map(app => ({ description: 'Literal <b>description</b>', models: [], thinking: 'unknown', updated: null, ...app }))
const manifest = { version: 1, apps: items }

for (const type of [chromium, webkit]) {
  test(`${type.name()}: client-rendered gallery`, async t => {
    const dir = await mkdtemp(join(tmpdir(), 'gallery-browser-'))
    const site = join(dir, 'vibe-dump')
    await mkdir(site)
    await Promise.all(SHELL_FILES.map(name => cp(join(root, 'gallery', name), join(site, name))))
    await writeFile(join(site, 'apps.json'), JSON.stringify(manifest))
    for (const app of items) {
      await mkdir(join(site, app.slug))
      await writeFile(join(site, app.slug, 'index.html'), `<h1>${app.slug}</h1>`)
      if (app.hasThumbnail) await cp(join(root, 'packages/ahupuaa/thumbnail.jpg'), join(site, app.slug, 'thumbnail.jpg'))
    }
    const server = await startStaticServer(dir)
    let browser
    try { browser = await type.launch() } catch (error) { await server.close(); await rm(dir, { recursive: true }); throw error }
    async function pageFor(path = '', options = {}) {
      const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, ...options })
      await page.goto(`${server.url}/vibe-dump/${path}`)
      return page
    }
    async function ready(page) { await page.waitForSelector('.card') }
    try {
      await t.test('renders every app, counts and badges from JSON under the Pages subpath', async () => {
        const page = await pageFor()
        try {
          await ready(page)
          assert.equal(await page.locator('.card').count(), 3)
          assert.deepEqual(await page.locator('.card').evaluateAll(es => es.map(e => e.getAttribute('href'))), ['./alpha/', './beta/', './gamma/'])
          assert.equal(await page.locator('.chip[data-tag="kids"] .chip__n').textContent(), '2')
          assert.equal(await page.locator('.chip[data-status="wip"] .chip__n').textContent(), '1')
          assert.equal(await page.locator('.wip').count(), 1)
          assert.equal(await page.locator('.thumb--empty').count(), 1)
          assert.equal(await page.locator('.card__title').last().textContent(), items[2].title)
          assert.equal(await page.locator('.card__body img,.card__body b').count(), 0, 'metadata remains literal text')
          assert.equal(await page.evaluate(() => window.injected), undefined)
          assert.equal(await page.locator('#grid').getAttribute('aria-busy'), 'false')
          await page.locator('.card').first().click()
          await page.waitForURL('**/vibe-dump/alpha/')
          assert.equal(await page.locator('h1').textContent(), 'alpha')
        } finally { await page.close() }
      })
      await t.test('filters preserve group semantics, URL state, query strings, clear and empty results', async () => {
        const page = await pageFor('?preview=1#art,wip')
        try {
          await ready(page)
          assert.equal(await page.locator('.card:visible').count(), 1)
          assert.equal(await page.locator('#count').textContent(), '1 of 3')
          await page.locator('.chip[data-tag="game"]').click()
          assert.equal(await page.locator('.card:visible').count(), 1)
          await page.locator('.chip[data-status="done"]').click()
          assert.equal(await page.locator('.card:visible').count(), 2)
          await page.locator('#clear').click()
          assert.equal(await page.locator('.card:visible').count(), 3)
          assert.ok(page.url().endsWith('/vibe-dump/?preview=1'))
          await page.locator('.chip[data-tag="tool"]').click()
          assert.equal(await page.locator('.card:visible .card__title').textContent(), 'Beta')
          await page.evaluate(() => { location.hash = '#game' })
          await page.waitForFunction(() => document.querySelector('.chip[data-tag="game"]').getAttribute('aria-pressed') === 'true')
          await page.locator('.chip[data-status="wip"]').click()
          assert.equal(await page.locator('.card:visible').count(), 0)
          assert.ok(await page.locator('#empty').isVisible())
          assert.equal(await page.locator('#count').textContent(), '0 of 3')
        } finally { await page.close() }
      })
      await t.test('malformed URL fragments do not crash the page; phone layout stays in bounds', async () => {
        const page = await pageFor('#%zz', { viewport: { width: 375, height: 812 } })
        const errors = []; page.on('pageerror', e => errors.push(e.message))
        try {
          await ready(page)
          assert.equal(await page.locator('.card:visible').count(), 3)
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
          assert.deepEqual(errors, [])
        } finally { await page.close() }
      })
      await t.test('failed fetch shows a usable retry state and then loads successfully', async () => {
        const page = await browser.newPage()
        let fail = true
        await page.route('**/apps.json', route => fail ? route.fulfill({ status: 503, body: 'temporarily unavailable' }) : route.continue())
        try {
          await page.goto(`${server.url}/vibe-dump/`)
          await page.waitForSelector('#error:not([hidden])')
          assert.equal(await page.locator('.card').count(), 0)
          fail = false
          await page.locator('#retry').click()
          await ready(page)
          assert.equal(await page.locator('.card').count(), 3)
          assert.equal(await page.locator('#error').isVisible(), false)
        } finally { await page.close() }
      })
      await t.test('invalid manifest data fails visibly instead of rendering unsafe links', async () => {
        const page = await browser.newPage()
        await page.route('**/apps.json', route => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ version: 1, apps: [{ ...items[0], slug: '../outside' }] }) }))
        try {
          await page.goto(`${server.url}/vibe-dump/`)
          await page.waitForSelector('#error:not([hidden])')
          assert.equal(await page.locator('.card').count(), 0)
        } finally { await page.close() }
      })
    } finally { await browser.close(); await server.close(); await rm(dir, { recursive: true, force: true }) }
  })
}

// Exercise the actual generated catalog too. Optional screenshots stay local.
test('the real catalog renders every generated app with derived filter counts', async () => {
  const data = JSON.parse(await readFile(join(root, 'dist/apps.json'), 'utf8'))
  const server = await startStaticServer(join(root, 'dist'))
  let browser
  try {
    browser = await chromium.launch()
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 })
    await page.goto(server.url)
    await page.waitForFunction(total => document.querySelectorAll('.card').length === total, data.apps.length)
    assert.deepEqual(await page.locator('.card').evaluateAll(es => es.map(e => e.getAttribute('href'))), data.apps.map(app => `./${app.slug}/`))
    for (const tag of ['game', 'simulation', 'tool', 'art', 'kids', 'tutorial']) {
      assert.equal(Number(await page.locator(`.chip[data-tag="${tag}"] .chip__n`).textContent()), data.apps.filter(app => app.tags.includes(tag)).length)
    }
    if (process.env.GALLERY_SCREENSHOT_PATH) {
      await page.waitForLoadState('networkidle')
      await page.screenshot({ path: process.env.GALLERY_SCREENSHOT_PATH, scale: 'css' })
    }
  } finally { await browser?.close(); await server.close() }
})
