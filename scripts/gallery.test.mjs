import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, writeFile, readFile, rm, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { execFileSync } from 'node:child_process'
import { buildGallery, SHELL_FILES } from './build-gallery.mjs'
import { assembleApps } from './assemble-apps.mjs'
import { verifyApps } from './verify.mjs'
import { validateManifest, parseFilters, matchesFilters, creditsText } from '../gallery/gallery-model.js'

async function app(root, slug, meta = {}) {
  const source = join(root, 'packages', slug), dest = join(root, 'dist', slug)
  await Promise.all([mkdir(source, { recursive: true }), mkdir(dest, { recursive: true })])
  const gallery = { title: slug, description: 'An app', tags: ['art'], status: 'done', models: [], thinking: 'unknown', ...meta }
  await Promise.all([
    writeFile(join(source, 'package.json'), JSON.stringify({ name: `@vibe-dump/${slug}`, gallery, scripts: { build: 'this-must-never-run-during-deployment' } })),
    writeFile(join(source, 'index.html'), '<html>source</html>'),
    writeFile(join(source, 'thumbnail.jpg'), 'committed thumbnail'),
    writeFile(join(dest, 'index.html'), '<html>committed build</html>'),
    writeFile(join(dest, 'thumbnail.jpg'), 'committed thumbnail'),
  ])
  return { source, dest }
}
async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'vibe-gallery-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  await app(root, 'alpha', { tags: ['art', 'kids'], status: 'wip' })
  await app(root, 'beta', { tags: ['tool'], models: ['Model <one>'], thinking: 'high' })
  return root
}

test('generation uses committed assets with no dependencies or local app builds', async t => {
  const root = await fixture(t), file = join(root, 'dist/alpha/index.html')
  assert.equal(existsSync(join(root, 'node_modules')), false)
  assert.equal(existsSync(join(root, 'packages/alpha/dist')), false)
  const before = await stat(file)
  const result = await buildGallery({ repoRoot: root })
  assert.deepEqual(result.apps.map(a => a.slug), ['alpha', 'beta'])
  assert.equal(validateManifest(result).length, 2)
  assert.equal(await readFile(file, 'utf8'), '<html>committed build</html>')
  const after = await stat(file)
  assert.equal(after.ino, before.ino)
  assert.equal(after.mtimeMs, before.mtimeMs)
  for (const name of SHELL_FILES) assert.ok(existsSync(join(root, 'dist', name)))
  assert.ok(!JSON.stringify(result).includes(root), 'the public list contains no checkout paths')
  assert.equal(existsSync(join(root, 'node_modules')), false)
  const first = await readFile(join(root, 'dist/apps.json'), 'utf8')
  await buildGallery({ repoRoot: root })
  assert.equal(await readFile(join(root, 'dist/apps.json'), 'utf8'), first, 'deterministic output')
})

test('an independent app package automatically joins the list without a registry edit', async t => {
  const root = await fixture(t)
  const before = await buildGallery({ repoRoot: root })
  await app(root, 'gamma', { tags: ['game'] })
  const after = await buildGallery({ repoRoot: root })
  assert.equal(after.apps.length, before.apps.length + 1)
  assert.ok(after.apps.some(a => a.slug === 'gamma'))
  assert.deepEqual((await verifyApps(root)).failures, [])
})

test('generation never copies newer local app builds into committed output', async t => {
  const root = await fixture(t)
  await mkdir(join(root, 'packages/alpha/dist'))
  await writeFile(join(root, 'packages/alpha/dist/index.html'), 'local uncommitted build')
  await buildGallery({ repoRoot: root })
  assert.equal(await readFile(join(root, 'dist/alpha/index.html'), 'utf8'), '<html>committed build</html>')
})

test('missing built assets and invalid metadata fail before replacing a good manifest', async t => {
  const root = await fixture(t)
  await buildGallery({ repoRoot: root })
  const first = await readFile(join(root, 'dist/apps.json'), 'utf8')
  await rm(join(root, 'dist/alpha/index.html'))
  await assert.rejects(buildGallery({ repoRoot: root }), /no committed dist\/alpha\/index.html/)
  assert.equal(await readFile(join(root, 'dist/apps.json'), 'utf8'), first)
  const { source } = await app(root, 'alpha')
  await writeFile(join(source, 'package.json'), JSON.stringify({ gallery: { tags: 'bad' } }))
  await assert.rejects(buildGallery({ repoRoot: root }), /invalid or missing tags/)
})

test('strict deployment generation rejects incomplete history; a local preview permits new apps', async t => {
  const root = await fixture(t)
  await assert.rejects(buildGallery({ repoRoot: root, requireHistory: true }), /no source commit date/)
  assert.equal((await buildGallery({ repoRoot: root })).apps[0].updated, null)
})

test('blobless history provides recency without fetching historical app binaries', async t => {
  const seed = await fixture(t)
  const parent = await mkdtemp(join(tmpdir(), 'gallery-blobless-'))
  t.after(() => rm(parent, { recursive: true, force: true }))
  const git = (cwd, args) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim()
  git(seed, ['init', '-q'])
  git(seed, ['config', 'uploadpack.allowFilter', 'true'])
  await writeFile(join(seed, 'old-build.bin'), 'historical asset content that deployment does not need')
  git(seed, ['add', '.'])
  const identity = ['-c', 'user.name=Gallery test', '-c', 'user.email=gallery@example.invalid']
  git(seed, [...identity, 'commit', '-qm', 'Initial apps'])
  const oldBlob = git(seed, ['rev-parse', 'HEAD:old-build.bin'])
  await rm(join(seed, 'old-build.bin'))
  await writeFile(join(seed, 'packages/alpha/index.html'), 'new source')
  git(seed, ['add', '-A'])
  git(seed, [...identity, 'commit', '-qm', 'Update app'])
  const clone = join(parent, 'checkout')
  git(parent, ['clone', '-q', '--filter=blob:none', '--no-checkout', pathToFileURL(seed).href, clone])
  git(clone, ['checkout', '-q', 'HEAD'])
  const missing = () => git(clone, ['rev-list', '--objects', '--all', '--missing=print'])
  assert.ok(missing().includes(`?${oldBlob}`), 'the historical binary was not downloaded')
  // Any accidental lazy fetch now fails. Name/date-only history must suffice.
  git(clone, ['remote', 'set-url', 'origin', pathToFileURL(join(parent, 'no-remote')).href])
  const data = await buildGallery({ repoRoot: clone, requireHistory: true })
  assert.ok(data.apps.every(app => app.updated))
  assert.ok(missing().includes(`?${oldBlob}`), 'generation still did not need the old binary')
})

test('verification needs no shared generated files and detects stale, missing, and orphan assets', async t => {
  const root = await fixture(t)
  assert.equal(existsSync(join(root, 'dist/index.html')), false)
  assert.deepEqual((await verifyApps(root)).failures, [])
  await writeFile(join(root, 'dist/alpha/thumbnail.jpg'), 'stale thumbnail')
  await rm(join(root, 'dist/beta/index.html'))
  await mkdir(join(root, 'dist/removed-app'))
  const { failures } = await verifyApps(root)
  assert.ok(failures.some(f => f.includes('stale')))
  assert.ok(failures.some(f => f.includes('dist/beta/index.html')))
  assert.ok(failures.some(f => f.includes('removed-app')))
})

test('verification blocks old branches from reintroducing a committed shared list', async t => {
  const root = await fixture(t)
  execFileSync('git', ['init', '-q'], { cwd: root })
  await writeFile(join(root, 'dist/apps.json'), '{}')
  execFileSync('git', ['add', 'dist/apps.json'], { cwd: root })
  assert.ok((await verifyApps(root)).failures.some(f => f.includes('Generated gallery output must not be tracked')))
})

test('local assembly updates only the requested app, including thumbnail and obsolete files', async t => {
  const root = await fixture(t)
  await mkdir(join(root, 'packages/alpha/dist'))
  await writeFile(join(root, 'packages/alpha/dist/index.html'), 'new alpha')
  await writeFile(join(root, 'dist/alpha/old.js'), 'obsolete')
  await writeFile(join(root, 'packages/alpha/thumbnail.jpg'), 'new thumbnail')
  assert.deepEqual(await assembleApps({ repoRoot: root, slugs: ['alpha'] }), ['alpha'])
  assert.equal(await readFile(join(root, 'dist/alpha/index.html'), 'utf8'), 'new alpha')
  assert.equal(await readFile(join(root, 'dist/alpha/thumbnail.jpg'), 'utf8'), 'new thumbnail')
  assert.equal(existsSync(join(root, 'dist/alpha/old.js')), false)
  assert.equal(await readFile(join(root, 'dist/beta/index.html'), 'utf8'), '<html>committed build</html>')
  await assert.rejects(assembleApps({ repoRoot: root, slugs: ['../bad'] }), /Unknown app/)
  await assert.rejects(assembleApps({ repoRoot: root, slugs: ['beta'] }), /Build locally first/)
})

test('filter groups preserve OR-within and AND-across, credits, and malformed-hash handling', () => {
  const filters = parseFilters('#art,game,wip')
  assert.ok(matchesFilters({ tags: ['game'], status: 'wip' }, filters))
  assert.ok(matchesFilters({ tags: ['art'], status: 'wip' }, filters))
  assert.equal(matchesFilters({ tags: ['art'], status: 'done' }, filters), false)
  assert.equal(matchesFilters({ tags: ['tool'], status: 'wip' }, filters), false)
  assert.equal(parseFilters('#%zz').tag.size, 0)
  assert.equal(parseFilters('#missing').tag.size, 0)
  assert.equal(creditsText({ models: [], thinking: 'unknown' }), '')
  assert.equal(creditsText({ models: ['A', 'B'], thinking: 'high' }), 'A + B · high effort')
})

test('manifest validation rejects duplicate or unsafe app links and unsupported data', () => {
  const item = { slug: 'alpha', title: '<script>', description: 'text', tags: ['art'], status: 'done', models: [], thinking: 'unknown', updated: null, hasThumbnail: false }
  assert.equal(validateManifest({ version: 1, apps: [item] }).length, 1)
  assert.throws(() => validateManifest({ version: 2, apps: [] }))
  assert.throws(() => validateManifest({ version: 1, apps: [item, item] }))
  assert.throws(() => validateManifest({ version: 1, apps: [{ ...item, slug: '../outside' }] }))
  assert.throws(() => validateManifest({ version: 1, apps: [{ ...item, tags: ['missing'] }] }))
})

test('deployment commands stay limited to asset verification and gallery generation', async () => {
  const yaml = await readFile(new URL('../.github/workflows/deploy.yml', import.meta.url), 'utf8')
  const commands = [...yaml.matchAll(/^\s+run:\s+(.+)$/gm)].map(m => m[1])
  assert.deepEqual(commands, ['npm run verify', 'npm run build:gallery -- --require-history'])
})
