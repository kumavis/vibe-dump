// N2's lobby rig (DESIGN §4.2.9's row): online play in Chromium, pages in
// browser contexts of their own (separate storage, as separate browsers:
// they meet only through the sync server, sim/sync-server.mjs, which the
// rig runs), on a fresh build of the package (or --dist).
//
//   play         a host's page (Play online), a guest's from the link (Sit
//                here, a name, Ready) and a watcher's (F6: the host's own
//                seat's race picker live, the guest's seat's showing its
//                race alone, its button picking nothing): the battle starts on
//                both seats once both are ready, each page playing its own
//                seat (the watcher none, its badge counted on the others');
//                each seat deploys ((F12) its deployment shows Begin battle
//                and no ↶ Undo: never online), plays a turn (the AI's
//                Auto), and one concedes; every page ends over on the same match, each
//                seated page's closing hash said and agreed (no dialog);
//                then Rematch: the host's page opens a new lobby with both
//                seats, and the guest's offers Join the rematch, which joins
//                it
//   names        a guest's name box takes no more than 24 characters or 48
//                bytes, and no control characters: what's typed past them
//                never enters, and the lobby holds the name as fitted
//   concurrent   both seated pages change their seat (race and name) at
//                the same moment: both settle to the same lobby, holding
//                both changes
//   altered      a host page that writes the start with the guest's seat
//                changed (its ctrl flipped to the AI, its dev swapped for
//                the host's, its race, its name): the guest's page opens the
//                battle read-only, "The start changed your seat (…)", and
//                plays no seat
//   vote-blocks-end  (F4's leftover) a page at the round limit with its
//                vote panel up, its battle then folded again past the end
//                (seat 0's own say, "end", from another tab of its device,
//                inserted before seat 1's "more"): the snap shows the end
//                screen, not the vote (app/flow.js's snapped())
//   history      a page whose own say ("more", deciding the vote: its
//                lines in the log) is undone by another tab of its device
//                saying "end" first (inserted before it): the toast says
//                "History changed: 1 move undone", and the battle log is the
//                new history's (made again: line for line the match's, none
//                of the undone say's)
//   catch-up     a watching page (drawn, not ?fast; its speed a quarter,
//                so the backlog runs long on any machine) handed a whole
//                battle at once: the elastic catch-up snaps past the backlog,
//                so the page shows the end within seconds rather than
//                replaying minutes of it, its battle log the match's (no
//                line twice)
//   (N2's review)
//   rematch-race both seated pages press Rematch at the same moment (each
//                makes a match of its own): both end in one lobby, the one
//                the old match's `next` names
//   bad-lobby    a peer writes a battle into the lobby the rules refuse
//                (overtime 'x'): with both seats ready the host's page says
//                why it can't start and writes no start (never one after
//                another)
//   continue     another browser opens a seat's link (`&dev=`) after the
//                start, with no record of readying it: it plays the seat, and
//                says so, rather than watching a battle that then waits on it
//   (N3)
//   scrub        a page watching a battle going on has the replay bar, at
//                Live; the slider scrubs to a move (the table the match as it
//                stood after it, by its hash), moves landing meanwhile are
//                folded but not shown, and Live shows the battle as it stands
//   replay       the watching page's ⏮ plays the battle from its start, a
//                move at a time, moves landing meanwhile played too, and
//                comes back to Live, the battle log the match's
//   files        a seated page, its battle over: Watch the replay, then 💾
//                downloads the battle's whole log; a fresh page opens it from
//                the title (📼) and plays it to the same match and log
//   kept         a seated page that comes back (a reload) says so; the title
//                offers to continue its battle (Continue), which takes it
//                back to its seat; and a log that lost an entry the page had
//                played while it was away (its own copy of the document set
//                aside) is tamper, said before anything is shown
//   (F10a)
//   group        (F10c: and then puts its units still to move on autopilot
//                and presses End, the orders' pilot and the End sent and
//                folded alike, the other page seeing them as `ords`) a
//                seat's page picks up three of its units together and
//                places them in its deployment, then (the seat whose turn
//                it is) moves three in the movement phase, each a pinned
//                formation sent: nothing refused, the other page's presence
//                holding the group (its dashed rings), both pages folding
//                the same match after each
//   (F7a)
//   terrain      the host's lobby offers the terrain sets the mission is
//                fought on (classic chosen); the host picks fortified, the
//                guest's lobby shows it (not the guest's to change), and the
//                battle both pages start is fought on it, its works standing
//   (F8b)
//   size         the host's page picks the battle size (Field) with both
//                seats ready: both seats un-ready, the lobby's terrain and
//                rounds and each seat's army let go, the guest's page shows
//                the size and can't change it; once both are ready again the
//                battle starts on the size's board (60×40), its start
//                naming the mission; a rematch keeps the size
//   (F14)
//   follow       once the host has pressed End (the bookmark of its last
//                End kept through its own fight and morale phases), the
//                guest's lone move swings the host's camera once (the
//                ?debug block's view.camera().followed) and leaves the
//                guest's own still; the host's next phase brings its camera
//                back to where it pressed End
//   (F16)
//   fog          the host's lobby offers the courtesy fog of war, off; the
//                guest readies, then the host turns it on (on battlefield 8,
//                where each seat's deployment leaves two enemy units out of
//                its sight): the guest's lobby shows it on (not the guest's
//                to turn) and its seat un-readied; both ready, and the start
//                carries no fog (the fold never hears of it). Each seated
//                page keeps the fog for its own seat, and whenever its table
//                has caught up hides exactly the enemy units none of its
//                seat's living units sees (the core's sight, asked through
//                the page's own Session with the dice locked), drawing no
//                figure, label or pick for any of them, through the
//                deployment and the turns both pages play with Auto; a
//                watcher's page keeps no fog. Some enemy was hidden on each
//                page (or the case held nothing)
//
//   node sim/lobby-rig.mjs [--only <cases>] [--dist <dir>] [--self-test]
//
// --self-test: each broken copy in MUTANTS must fail its case (with
// --only, the mutants named, or those of the cases named). Exit 0 when
// every case holds (the self-test: when every mutant is caught), 1
// otherwise.
import { parseArgs } from 'node:util'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { readFileSync, writeFileSync, rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { Repo } from '@automerge/automerge-repo'
import { WebSocketClientAdapter } from '@automerge/automerge-repo-network-websocket'
import { ImmutableString } from '@automerge/automerge/slim'
import { startStaticServer } from '../../../scripts/static-server.mjs'
import { startSyncServer } from './sync-server.mjs'
import { buildApp, copyCode } from './lib.mjs'
import { makeMatch, autoplay } from './online-fixture.mjs'
import { AutomergeStore } from '../net/automerge-store.js'
import { lobbyOf, startSeat } from '../net/lobby.js'
import { Session } from '../match/session.js'
import { Folder } from '../match/fold.js'
import { envelope, encode, decode } from '../match/envelope.js'
import { commitOf } from '../net/seed.js'
import { stateHash } from '../core/index.js'

const PKG = fileURLToPath(new URL('..', import.meta.url))
const CASES = ['play', 'names', 'concurrent', 'altered', 'vote-blocks-end', 'history', 'catch-up', 'rematch-race', 'bad-lobby', 'continue', 'scrub', 'replay', 'files', 'kept', 'group', 'terrain', 'size', 'follow', 'fog']
const { values: a } = parseArgs({ options: { only: { type: 'string' }, dist: { type: 'string' }, 'self-test': { type: 'boolean' } } })
const only = a.only ? a.only.split(',') : CASES

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
class Fail extends Error {}
const must = (ok, what) => {
  if (!ok) throw new Fail(what)
}

// One run of the cases over a build: { case: null | why it failed }
async function runCases(dist, cases) {
  const web = await startStaticServer(dist)
  const sync = await startSyncServer()
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
  const base = `${web.url}/?debug&lowfi&fast&sync=${encodeURIComponent(sync.url)}`
  const contexts = []
  const errors = []
  // a page in a context of its own (`init`: localStorage to set first;
  // `fast`: ?fast, nothing drawn and game time instant)
  const open = async (hash = '', init = null, { fast = true } = {}) => {
    const ctx = await browser.newContext({ viewport: { width: 1100, height: 760 } })
    contexts.push(ctx)
    if (init) await ctx.addInitScript((kv) => Object.entries(kv).forEach(([k, v]) => localStorage.setItem(k, v)), init)
    const page = await ctx.newPage()
    page.on('pageerror', (e) => errors.push(`${e.message}`))
    await page.goto(`${fast ? base : base.replace('&fast', '')}${hash}`)
    await page.waitForFunction(() => window.__ts, null, { timeout: 60000 })
    return page
  }
  const until = (page, fn, arg, ms = 30000, what = 'a condition') => page.waitForFunction(fn, arg, { timeout: ms, polling: 100 }).catch((e) => {
    throw new Fail(`${what} never held (${e.message.split('\n')[0]})`)
  })
  // the lobby's link, once the page has one
  const linkOf = async (page, not = null) => {
    await until(page, (old) => !document.querySelector('#lobby').classList.contains('hidden') && document.querySelector('#lobbyLink')?.value.includes('#m=') && document.querySelector('#lobbyLink').value !== old, not, 30000, 'the lobby shows its link')
    return page.$eval('#lobbyLink', (e) => e.value)
  }
  const hashOf = (link) => `#${link.split('#')[1]}`
  // a fresh match: the host's page (Play online) and a guest's seated in
  // seat 2 (`autoStart` off on the host: the rig starts it)
  const lobbyPair = async ({ host = null, autoStart = true } = {}) => {
    host ??= await open()
    await host.evaluate((on) => window.__ts.goOnline('host').then(() => (window.__ts.net.autoStart = on)), autoStart)
    const link = await linkOf(host)
    const guest = await open(hashOf(link))
    await until(guest, () => document.querySelector('.seat[data-seat="1"] button.primary')?.textContent === 'Sit here', null, 30000, "the guest's page offers seat 2")
    await guest.click('.seat[data-seat="1"] button.primary')
    await until(guest, () => document.querySelector('.seat.mine input'), null, 30000, "the guest's own seat (its name box)")
    return { host, guest, link }
  }
  const press = async (page, label) => {
    await until(page, (t) => [...document.querySelectorAll('.seat.mine button')].some((b) => b.textContent === t), label, 30000, `the "${label}" button`)
    await page.evaluate((t) => [...document.querySelectorAll('.seat.mine button')].find((b) => b.textContent === t).click(), label)
  }
  const setName = (page, text) => page.evaluate((t) => {
    const box = document.querySelector('.seat.mine input')
    box.value = t
    box.dispatchEvent(new Event('input'))
    box.dispatchEvent(new Event('change'))
  }, text)
  const lobbyNow = (page) => page.evaluate(() => JSON.stringify(window.__ts.net?.handle?.doc()?.lobby ?? null))
  // A battle at the round limit, made in Node through the same server (each
  // seat's say still to come), and seat 0's page on it: { repo, handle,
  // store, page, id }
  // (a seat's page: its readied record kept, under the match's commitment)
  const seatPage = async (handle, a, i, dev) => {
    const id = handle.documentId
    const readied = JSON.stringify([{ seat: i, record: startSeat(lobbyOf(handle.doc()).seats[i]), commit: await commitOf(a) }])
    const page = await open(`#m=${id}&dev=${dev}`, { [`ts.ready.${id}.${dev}`]: readied })
    await live(page)
    return page
  }
  const atRoundLimit = async () => {
    const repo = new Repo({ network: [new WebSocketClientAdapter(sync.url, 200)] })
    const d0 = 'seatzero', d1 = 'seatoneo'
    const { handle, setup, a } = await makeMatch(repo, { host: 'hosthost', seats: [{ dev: d0, name: 'Ann', race: 'squirrel' }, { dev: d1, name: 'Ben', race: 'serpent' }], AutomergeStore })
    const store = new AutomergeStore(handle)
    for (const x of autoplay(store, setup, { stop: (G) => G.pending?.k === 'roundLimit' })) x?.close()
    const id = handle.documentId
    const page = await seatPage(handle, a, 0, d0)
    await until(page, () => window.__ts.session.G.pending?.k === 'roundLimit' && !document.querySelector('#over').classList.contains('hidden') && !document.querySelector('#overVote').classList.contains('hidden'), null, 60000, 'the vote panel up on seat 0\'s page')
    return { repo, handle, store, page, id, d0, d1 }
  }
  // the battle log's lines a fold of `entries` shows, as text (the page's
  // entries' textContent)
  const logLines = (entries) => {
    const f = new Folder({ out: [] }), lines = []
    for (const e of entries) {
      f.push(e)
      for (const x of f.G?.out?.splice(0) ?? []) if (x.t === 'log') lines.push(x.html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'"))
    }
    return lines
  }
  // (N3) the battle's moves as a replay takes them (its accepted entries, in
  // order), the match's hash after the k-th, and the match's own
  const refOf = (store) => {
    const f = new Folder({ out: null })
    for (const e of store.entries()) f.push(e)
    const moves = f.acceptedEntries()
    const hashAt = (k) => {
      const g = new Folder({ out: null })
      for (const e of moves.slice(0, k + 1)) g.push(e)
      return g.G ? stateHash(g.G) : null
    }
    return { moves, hashAt, hash: f.G ? stateHash(f.G) : null }
  }
  // (N3) a battle made in Node through the same server, played on by both
  // seats' devices until `stop`: { repo, handle, store, setup, a, d0, d1 }
  const battle = async (stop) => {
    const repo = new Repo({ network: [new WebSocketClientAdapter(sync.url, 200)] })
    const d0 = 'seatzero', d1 = 'seatoneo'
    const { handle, setup, a } = await makeMatch(repo, { host: 'hosthost', seats: [{ dev: d0, name: 'Ann', race: 'squirrel' }, { dev: d1, name: 'Ben', race: 'serpent' }], overtime: 'never', AutomergeStore })
    const store = new AutomergeStore(handle)
    for (const x of autoplay(store, setup, { stop })) x?.close()
    return { repo, handle, store, setup, a, d0, d1 }
  }
  // (N3) how many accepted entries the page keeps for match `id` as device
  // `dev` (net/kept.js's IndexedDB)
  const keptN = (page, id, dev) => page.evaluate((id) => new Promise((res) => {
    const r = indexedDB.open('tails-and-scales-kept')
    r.onerror = () => res(-1)
    r.onsuccess = () => {
      try {
        const g = r.result.transaction('matches').objectStore('matches').get(id)
        g.onsuccess = () => res(g.result?.n ?? 0)
        g.onerror = () => res(-1)
      } catch {
        res(-1)
      }
    }
  }), `${id} ${dev}`)
  // seat 0's say from another tab of its device, inserted at place k (as a
  // concurrent change from a higher actor lands), on the head that opened
  // the vote
  const insertSay = (handle, store, k, more, d0) => {
    const f = new Folder({ out: null })
    for (const e of store.entries().slice(0, k)) f.push(e)
    const text = encode(envelope({ t: 'vote', more }, { id: `${d0}.zz.tab2`, s: 0, d: d0, p: f.head(0) }))
    must(!decode(text).bad, 'the inserted say decodes')
    handle.change((d) => d.log.insertAt(k, new ImmutableString(text)))
  }
  const live = (page, ms = 60000) => until(page, () => ['live', 'over'].includes(window.__ts.session?.status) && document.querySelector('#lobby').classList.contains('hidden'), null, ms, 'the battle begins on the page')

  const RUN = {
    async play() {
      const { host, guest, link } = await lobbyPair()
      // (F6) each seat's card shows its race in the picker: yours to change
      // in your own seat only (another seat's button picks nothing)
      const pickers = await host.evaluate(() => [...document.querySelectorAll('#lobby .seat')].map((s) => ({
        mine: s.classList.contains('mine'),
        live: [...s.querySelectorAll('.raceRow button')].filter((b) => !b.disabled && !b.classList.contains('hidden')).length,
      })))
      must(pickers.length === 2 && pickers.every((p) => (p.mine ? p.live >= 2 : p.live === 0)), `the host's own seat offers the races and the guest's none: ${JSON.stringify(pickers)}`)
      await setName(guest, 'Ben')
      await press(guest, 'Ready')
      await press(host, 'Ready')
      await Promise.all([live(host), live(guest)])
      const watcher = await open(hashOf(link))
      await live(watcher)
      const seats = await Promise.all([host, guest, watcher].map((p) => p.evaluate(() => window.__ts.session.localSeats.join())))
      must(seats.join('|') === '0|1|', `each page plays its own seat (host 0, guest 1, watcher none): ${seats.join('|')}`)
      must((await guest.evaluate(() => window.__ts.G.setup.seats[1].name)) === 'Ben', "the start carries the guest's name as it readied it")
      // (F12) no Undo online (the log is append-only): each seated page's
      // deployment shows Begin battle, and no ↶ Undo beside it
      for (const p of [host, guest]) await until(p, () => window.__ts.player.idle && window.__ts.session.decisionFor() >= 0 && getComputedStyle(document.querySelector('#endPhase')).display !== 'none', null, 30000, 'Begin battle up on a seated page')
      const undos = await Promise.all([host, guest].map((p) => p.evaluate(() => getComputedStyle(document.querySelector('#undo')).display)))
      must(undos.every((d) => d === 'none'), `online, no seated page shows Undo in its deployment (${undos.join(' | ')})`)
      // each seat deploys (Begin battle), then plays its turns with Auto, the
      // pages answering their own decisions, until round 2 begins
      const step = async (page) => page.evaluate(async () => {
        const ts = window.__ts, ses = ts.session
        if (!ses || ses.status !== 'live' || !ts.player.idle || ses.decisionFor() < 0) return
        const P = ses.G.pending
        if (P.k === 'deploy') await ts.endPhase()
        else if (P.k === 'phase') await ts.autoPhase()
      })
      const t0 = Date.now()
      while (Date.now() - t0 < 120000) {
        await Promise.all([host, guest].map(step))
        if ((await host.evaluate(() => window.__ts.G.turn.round)) >= 2) break
        await sleep(150)
      }
      const round = await host.evaluate(() => window.__ts.G.turn.round)
      must(round >= 2, 'both seats played round 1 from their own pages')
      // the host's badge counts the watcher
      await until(host, () => /1 watching/.test(document.querySelector('#netbadge').textContent), null, 20000, "the host's badge counting the watcher (\"online · 1 watching\")")
      // the guest concedes (out of band); every page ends over
      await guest.evaluate(() => window.__ts.session.submit(1, { t: 'concede' }))
      for (const p of [host, guest, watcher]) await until(p, () => window.__ts.session.status === 'over' && window.__ts.session.folder.finals.size === 2, null, 30000, 'every page over, both closing hashes folded')
      const states = await Promise.all([host, guest, watcher].map((p) => p.evaluate(() => {
        const s = window.__ts.session
        return { acc: s.accepted.join(), finals: s.store.entries().filter((e) => e.t === 'final').length, agreed: s.rejected.filter((r) => /closing hash agreeing/.test(r.why)).length, dialog: !document.querySelector('#netdialog').classList.contains('hidden') }
      })))
      must(states.every((s) => s.acc === states[0].acc), 'every page accepted the same entries')
      must(states.every((s) => s.finals === 2 && s.agreed === 2 && !s.dialog), `each seated page said its closing hash, every page found both agree, no dialog: ${JSON.stringify(states)}`)
      // Rematch: the host's page asks, the guest's joins
      await until(host, () => !document.querySelector('#rematch').classList.contains('hidden'), null, 20000, "the host's Rematch button")
      await host.click('#rematch')
      const link2 = await linkOf(host, link)
      must(link2 !== link, 'the rematch is a new match')
      await until(guest, () => document.querySelector('#rematch').textContent === 'Join the rematch', null, 20000, "the guest's page offering Join the rematch")
      await guest.click('#rematch')
      await until(guest, (id) => location.hash.includes(id) && window.__ts.net?.id === id && window.__ts.net.handle?.doc()?.lobby && document.querySelector('.seat.mine'), link2.split('#m=')[1].split('&')[0], 30000, "the guest's page in the rematch's lobby, in its seat")
      const L = JSON.parse(await lobbyNow(guest))
      must(L.seats.s0 && L.seats.s1 && L.seats.s1.name === 'Ben' && !L.seats.s0.ready && !L.seats.s1.ready, `the rematch keeps both seats and races, unready: ${JSON.stringify(L.seats)}`)
      return `3 pages; round ${round} reached, conceded, closing hashes agreed; rematch joined`
    },

    async names() {
      const { guest } = await lobbyPair()
      const typed = async (text) => {
        await guest.click('.seat.mine input')
        await guest.fill('.seat.mine input', '')
        await guest.keyboard.type(text)
        return guest.$eval('.seat.mine input', (e) => e.value)
      }
      const long = await typed('x'.repeat(30))
      must(long === 'x'.repeat(24), `30 characters typed: the box holds ${long.length}`)
      const emoji = await typed('😀'.repeat(15))
      must(emoji === '😀'.repeat(12), `15 emoji typed (4 bytes each): the box holds ${[...emoji].length}`)
      await guest.fill('.seat.mine input', 'Ann\u0007\u001b Lee\u0000')
      const ctl = await guest.$eval('.seat.mine input', (e) => e.value)
      must(ctl === 'Ann Lee', `control characters pasted never enter: ${JSON.stringify(ctl)}`)
      await setName(guest, `  ${'é'.repeat(30)}  `)
      await sleep(300)
      const held = JSON.parse(await lobbyNow(guest)).seats.s1.name
      must(held === 'é'.repeat(24), `the lobby holds the name fitted: ${JSON.stringify(held)}`)
      return 'a 24-character, 48-byte, control-free name box'
    },

    async concurrent() {
      const { host, guest } = await lobbyPair()
      await until(host, () => !!window.__ts.net.handle.doc().lobby.seats.s1, null, 30000, "the guest's claim reaching the host")
      await Promise.all([
        host.evaluate(() => window.__ts.net.editMine({ race: 'serpent', name: 'Annie' })),
        guest.evaluate(() => window.__ts.net.editMine({ race: 'squirrel', name: 'Benny' })),
      ])
      const settled = async (p) => until(p, () => {
        const s = window.__ts.net.handle.doc().lobby.seats
        return s.s0?.name === 'Annie' && s.s1?.name === 'Benny'
      }, null, 30000, 'both changes on the page')
      await Promise.all([settled(host), settled(guest)])
      const [x, y] = await Promise.all([lobbyNow(host), lobbyNow(guest)])
      must(x === y, `both pages settle to the same lobby: ${x} / ${y}`)
      const L = JSON.parse(x)
      must(L.seats.s0.race === 'serpent' && L.seats.s1.race === 'squirrel', 'holding both changes')
      return 'both seats changed at once, one lobby on both pages'
    },

    async terrain() {
      const { host, guest } = await lobbyPair()
      await until(host, () => !!window.__ts.net.handle.doc().lobby.seats.s1, null, 30000, "the guest's claim reaching the host")
      const offer = await host.evaluate(() => ({ opts: [...document.querySelectorAll('#lobbyTerrain option')].map((o) => o.value), value: document.querySelector('#lobbyTerrain').value, disabled: document.querySelector('#lobbyTerrain').disabled }))
      must(offer.opts.join() === 'classic,fortified' && offer.value === 'classic' && !offer.disabled, `the host's lobby offers the classic mission's sets, classic chosen, its to change: ${JSON.stringify(offer)}`)
      await host.selectOption('#lobbyTerrain', 'fortified')
      await until(guest, () => window.__ts.net.handle.doc().lobby.terrain === 'fortified' && document.querySelector('#lobbyTerrain').value === 'fortified', null, 30000, "the host's terrain on the guest's lobby")
      must(await guest.evaluate(() => document.querySelector('#lobbyTerrain').disabled), "the terrain is the host's to change, not the guest's")
      await press(guest, 'Ready')
      await press(host, 'Ready')
      await Promise.all([live(host), live(guest)])
      const fought = await Promise.all([host, guest].map((p) => p.evaluate(() => ({ terrain: window.__ts.G.setup.terrain, decks: window.__ts.G.terrain.chunks.filter((c) => c.kind === 'deck').length }))))
      must(fought.every((f) => f.terrain === 'fortified' && f.decks >= 2), `both pages' battle is fought on fortified, its works standing: ${JSON.stringify(fought)}`)
      return 'the host chose fortified, and both pages fight on it'
    },

    // (F16) the courtesy fog, agreed in the lobby, kept by each page for its
    // own seat
    async fog() {
      const { host, guest, link } = await lobbyPair()
      await until(host, () => !!window.__ts.net.handle.doc().lobby.seats.s1, null, 30000, "the guest's claim reaching the host")
      const offer = await host.evaluate(() => ({ on: document.querySelector('#lobbyFog')?.checked, disabled: document.querySelector('#lobbyFog')?.disabled }))
      must(offer.on === false && offer.disabled === false, `the host's lobby offers the fog, off, its to turn: ${JSON.stringify(offer)}`)
      // battlefield 8 (each seat's deployment leaves two enemies unseen)
      await host.fill('#lobbyBoard', '8')
      await host.dispatchEvent('#lobbyBoard', 'change')
      await until(guest, () => window.__ts.net.handle.doc().lobby.board === 8, null, 30000, "battlefield 8 on the guest's lobby")
      await setName(guest, 'Ben')
      await press(guest, 'Ready')
      await until(host, () => window.__ts.net.handle.doc().lobby.seats.s1?.ready === true, null, 30000, "the guest's Ready reaching the host")
      await host.click('#lobbyFog')
      await until(guest, () => window.__ts.net.handle.doc().lobby.fog === true && document.querySelector('#lobbyFog').checked, null, 30000, "the host's fog on the guest's lobby")
      const shown = await guest.evaluate(() => ({ disabled: document.querySelector('#lobbyFog').disabled, ready: window.__ts.net.handle.doc().lobby.seats.s1.ready }))
      must(shown.disabled && shown.ready === false, `the fog is the host's to turn, and turning it un-readied the guest: ${JSON.stringify(shown)}`)
      await press(guest, 'Ready')
      await press(host, 'Ready')
      await Promise.all([live(host), live(guest)])
      const kept = await Promise.all([host, guest].map((p) => p.evaluate(() => ({ seat: window.__ts.view.fog()?.seat ?? null, local: window.__ts.session.localSeats.join(), setup: Object.keys(window.__ts.G.setup).filter((k) => /fog/i.test(k)), board: window.__ts.G.setup.board }))))
      must(kept[0].seat === 0 && kept[1].seat === 1 && kept.every((k) => !k.setup.length && k.board === 8), `each page keeps the fog for its own seat, and the start carries none: ${JSON.stringify(kept)}`)
      const watcher = await open(hashOf(link))
      await live(watcher)
      must((await watcher.evaluate(() => window.__ts.view.fog())) === null, 'a watcher\'s page keeps no fog')
      // whenever a page's table has caught up: it hides exactly the enemies
      // its seat's units can't see, and draws none of them
      const look = (page) => page.evaluate(() => {
        const ts = window.__ts, ses = ts.session
        if (!ses?.G || !ts.player.idle || ses.status !== 'live') return null
        const f = ts.view.fog(), seat = f?.seat
        if (!f) return { none: true }
        const want = ses.preview((G, q) => {
          const mine = G.units.filter((u) => u.side === seat && q.alive(u))
          return G.units.filter((e) => e.side !== seat && q.alive(e) && !mine.some((u) => q.sight(G, u, e).visible)).map((e) => e.id)
        })
        const alive = new Set(f.units.filter((u) => u.alive > 0).map((u) => u.id))
        const hide = (f.shown?.hide ?? []).filter((id) => alive.has(id))
        const drawn = f.units.filter((u) => want.includes(u.id) && (u.figures || u.label || u.picked)).map((u) => u.id)
        return { want: want.sort((a, b) => a - b).join(), hide: hide.sort((a, b) => a - b).join(), drawn: drawn.join(), n: want.length }
      })
      const step = async (page) => page.evaluate(async () => {
        const ts = window.__ts, ses = ts.session
        if (!ses || ses.status !== 'live' || !ts.player.idle || ses.decisionFor() < 0) return
        const P = ses.G.pending
        if (P.k === 'deploy') await ts.endPhase()
        else if (P.k === 'phase') await ts.autoPhase()
      })
      const hidden = [0, 0]
      let looks = 0
      const t0 = Date.now()
      while (Date.now() - t0 < 120000) {
        for (const [i, p] of [host, guest].entries()) {
          const r = await look(p)
          if (!r) continue
          must(!r.none, `${i ? "the guest's" : "the host's"} page keeps the fog`)
          looks++
          hidden[i] += r.n
          must(r.hide === r.want && !r.drawn, `${i ? "the guest's" : "the host's"} page hides exactly the enemies its seat can't see (hidden ${r.hide || 'none'}, the core's sight leaves unseen ${r.want || 'none'}; drawn of those: ${r.drawn || 'none'})`)
        }
        await Promise.all([host, guest].map(step))
        if ((await host.evaluate(() => window.__ts.G.turn.round)) >= 2) break
        await sleep(150)
      }
      must(hidden[0] > 0 && hidden[1] > 0, `each page hid some enemy at some point (host ${hidden[0]}, guest ${hidden[1]} enemy-looks): else the case held nothing`)
      return `the host turned the fog on, the guest saw it and readied; each page hid what its seat couldn't see at ${looks} looks (enemy-looks hidden: host ${hidden[0]}, guest ${hidden[1]}), the watcher none`
    },

    async altered() {
      const says = []
      let host = null
      for (const [field, change] of [['ctrl', `(s) => ({ ...s, seats: [s.seats[0], { ...s.seats[1], ctrl: 'ai' }] })`], ['dev', `(s) => ({ ...s, seats: [s.seats[0], { ...s.seats[1], dev: s.seats[0].dev }] })`], ['race', `(s) => ({ ...s, seats: [s.seats[0], { ...s.seats[1], race: s.seats[1].race === 'serpent' ? 'squirrel' : 'serpent' }] })`], ['name', `(s) => ({ ...s, seats: [s.seats[0], { ...s.seats[1], name: 'Mallory' }] })`]]) {
        const pair = await lobbyPair({ host, autoStart: false })
        host = pair.host
        const { guest } = pair
        await press(guest, 'Ready')
        await press(host, 'Ready')
        await until(host, () => {
          const s = window.__ts.net.handle.doc().lobby.seats
          return s.s0?.ready && s.s1?.ready
        }, null, 30000, 'both seats ready on the host page')
        await host.evaluate((src) => window.__ts.net.startMatch(eval(src)), change)
        await until(guest, () => !document.querySelector('#netdialog').classList.contains('hidden'), null, 30000, `the guest's dialog (the ${field} changed)`)
        const why = await guest.$eval('#netWhy', (e) => e.textContent)
        const seats = await guest.evaluate(() => window.__ts.session?.localSeats.length)
        must(why.startsWith(`The start changed your seat (${field})`) && seats === 0, `the guest's page, its ${field} changed by the host: "${why}", ${seats} seats played`)
        says.push(field)
        await guest.context().close()
      }
      return `read-only on a changed ${says.join(', ')}`
    },

    async 'vote-blocks-end'() {
      const { repo, handle, store, page, d0, d1 } = await atRoundLimit()
      try {
        // seat 1 says more (its own page, here), folded on seat 0's page
        const s1 = new Session({ store, localSeats: [1], dev: d1, rand: () => 'r1' })
        const before = store.length
        s1.submit(1, { t: 'vote', more: true })
        s1.close()
        await until(page, (n) => window.__ts.session.count >= n, before + 1, 30000, "seat 1's say on seat 0's page")
        must(!(await page.$eval('#overVote', (e) => e.classList.contains('hidden'))), 'the vote panel still up, seat 0 to say')
        // seat 0's "end", from another tab of its device, inserted before
        // seat 1's say
        insertSay(handle, store, before, false, d0)
        await until(page, () => window.__ts.session.status === 'over' && window.__ts.player.idle, null, 30000, 'the page folding the battle past its end')
        await sleep(500)
        const shown = await page.evaluate(() => ({ over: !document.querySelector('#over').classList.contains('hidden'), voting: !document.querySelector('#overVote').classList.contains('hidden'), title: document.querySelector('#overTitle').textContent }))
        must(shown.over && !shown.voting, `a snap past the end with the vote up shows the end screen, not the vote: ${JSON.stringify(shown)}`)
        store.close()
        return `the end screen after the refold (${shown.title})`
      } finally {
        await repo.shutdown?.().catch(() => {})
      }
    },

    async history() {
      const { repo, handle, store, page, d0, d1 } = await atRoundLimit()
      try {
        // seat 1 says more (its own page, here); the page says more itself,
        // the vote decided (its lines in the log, round 6 begun); another
        // tab of its device says end, inserted before it: the match ends,
        // and the lines the page showed for its say are no history's now
        const s1 = new Session({ store, localSeats: [1], dev: d1, rand: () => 'r1' })
        s1.submit(1, { t: 'vote', more: true })
        s1.close()
        await until(page, (n) => window.__ts.session.count >= n && window.__ts.player.idle, store.length, 30000, "seat 1's say on seat 0's page, played")
        const before = store.length
        await page.evaluate(() => window.__ts.vote(true))
        const t0 = Date.now()
        while (store.length <= before && Date.now() - t0 < 20000) await sleep(50)
        must(store.length === before + 1, "the page's say reached the server")
        const said = store.entries()[before].id
        insertSay(handle, store, before, false, d0)
        await until(page, () => /History changed: 1 move undone/.test(document.querySelector('#toast').textContent) && document.querySelector('#toast').classList.contains('show'), null, 30000, 'the toast "History changed: 1 move undone"')
        const log = await page.evaluate((said) => {
          const lines = window.__ts.session.G.journal.trace.filter((l) => /^log /.test(l))
          const last = lines.at(-1).replace(/^log -?\d+ /, '').replace(/ rng:\S+$/, '')
          return { shown: document.querySelector('#logList').firstElementChild?.textContent ?? '', last, n: document.querySelectorAll('#logList .entry').length, rejected: window.__ts.session.rejected.find((r) => r.id === said)?.why ?? '' }
        }, said)
        must(log.n > 0 && log.shown === log.last, `the battle log is the new history's, its newest line the match's last: ${JSON.stringify(log)}`)
        must(/^(stale|turn|inert)/.test(log.rejected), `the undone say is refused now (its seat has had its say, the match ended): ${log.rejected}`)
        // the whole log the new history's: none of the undone say's lines
        const shown = await page.evaluate(() => [...document.querySelectorAll('#logList .entry')].map((e) => e.textContent).reverse())
        const want = logLines(store.entries()).slice(-shown.length)
        must(JSON.stringify(shown) === JSON.stringify(want), `the battle log after the refold is the match's (${shown.length} lines; first apart at ${shown.findIndex((l, k) => l !== want[k])}: ${JSON.stringify(shown.find((l, k) => l !== want[k]))})`)
        store.close()
        return `"History changed: 1 move undone", the log made again (${log.n} lines)`
      } finally {
        await repo.shutdown?.().catch(() => {})
      }
    },

    async 'catch-up'() {
      const repo = new Repo({ network: [new WebSocketClientAdapter(sync.url, 200)] })
      try {
        const { handle, setup } = await makeMatch(repo, { host: 'hosthost', seats: [{ dev: 'seatzero', name: 'Ann', race: 'squirrel' }, { dev: 'seatoneo', name: 'Ben', race: 'serpent' }], overtime: 'never', AutomergeStore })
        const store = new AutomergeStore(handle)
        const page = await open(`#m=${handle.documentId}`, null, { fast: false })
        await live(page)
        await until(page, () => window.__ts.player.idle, null, 30000, 'the watching page idle at the deployment')
        await page.evaluate(() => (window.__ts.clock.speed = 0.25))
        // the whole battle at once
        for (const x of autoplay(store, setup)) x?.close()
        const n = store.length, t0 = Date.now()
        if (process.env.RIG_DEBUG) {
          for (let i = 0; i < 60; i++) {
            const x = await page.evaluate(() => ({ c: window.__ts.session.count, b: window.__ts.player.backlog(), q: window.__ts.player.q.length, boost: window.__ts.clock.boost, idle: window.__ts.player.idle, time: window.__ts.clock.time }))
            console.log(((Date.now() - t0) / 1000).toFixed(1), JSON.stringify(x))
            if (x.idle && x.c >= n) break
            await sleep(500)
          }
        }
        await until(page, (k) => window.__ts.session.count >= k && window.__ts.player.idle, n, 90000, 'the page at the match')
        const secs = (Date.now() - t0) / 1000
        const at = await page.evaluate(() => ({ status: window.__ts.session.status, boost: window.__ts.clock.boost, over: !document.querySelector('#over').classList.contains('hidden') }))
        must(secs < 15 && at.boost === 1 && at.status === 'over' && at.over, `a whole battle handed over at once caught up in ${secs.toFixed(1)} s (under 15 s), the end shown and the clock back to its pace (${JSON.stringify(at)})`)
        // the battle log is the match's, its last lines once each
        const shown = await page.evaluate(() => [...document.querySelectorAll('#logList .entry')].map((e) => e.textContent).reverse())
        const want = logLines(store.entries()).slice(-shown.length)
        must(shown.length > 0 && JSON.stringify(shown) === JSON.stringify(want), `the battle log after the catch-up is the match's (${shown.length} lines; first apart at ${shown.findIndex((l, k) => l !== want[k])}: ${JSON.stringify(shown.find((l, k) => l !== want[k]))})`)
        store.close()
        return `${n} entries caught up in ${secs.toFixed(1)} s, the end shown, the log the match's`
      } finally {
        await repo.shutdown?.().catch(() => {})
      }
    },

    async 'rematch-race'() {
      const repo = new Repo({ network: [new WebSocketClientAdapter(sync.url, 200)] })
      try {
        const d0 = 'seatzero', d1 = 'seatoneo'
        const { handle, setup, a } = await makeMatch(repo, { host: 'hosthost', seats: [{ dev: d0, name: 'Ann', race: 'squirrel' }, { dev: d1, name: 'Ben', race: 'serpent' }], overtime: 'never', AutomergeStore })
        const store = new AutomergeStore(handle)
        for (const x of autoplay(store, setup)) x?.close()
        const pages = [await seatPage(handle, a, 0, d0), await seatPage(handle, a, 1, d1)]
        for (const p of pages) await until(p, () => !document.querySelector('#rematch').classList.contains('hidden'), null, 30000, 'the Rematch button on both seated pages')
        // both at once: each makes a match of its own
        await Promise.all(pages.map((p) => p.evaluate(() => document.querySelector('#rematch').click())))
        const ids = async () => Promise.all(pages.map((p) => p.evaluate(() => window.__ts.net?.id ?? null)))
        const t0 = Date.now()
        let now = await ids()
        while (Date.now() - t0 < 30000 && !(now[0] && now[0] === now[1] && now[0] !== handle.documentId)) {
          await sleep(250)
          now = await ids()
        }
        const next = lobbyOf(handle.doc()).next
        must(now[0] && now[0] === now[1] && now[0] === next, `both pages in the one rematch the old match names (${now.join(' / ')}; next ${next})`)
        for (const p of pages) await until(p, () => document.querySelector('.seat.mine'), null, 30000, 'each page in its seat of the rematch')
        // the guest readies with a nonce of its own, drawn after the
        // rematch's open; the host's seat contributes none
        const hostDev = JSON.parse(await lobbyNow(pages[0])).host
        const g = hostDev === d0 ? pages[1] : pages[0], gs = hostDev === d0 ? 's1' : 's0', hs = gs === 's1' ? 's0' : 's1'
        await press(g, 'Ready')
        await until(g, (k) => window.__ts.net.handle.doc().lobby.seats[k]?.ready, gs, 20000, "the guest's Ready")
        const L = JSON.parse(await lobbyNow(g))
        const old = setup.seats.map((x) => x.nonce)
        must(/^[0-9a-f]{16}$/.test(L.seats[gs].nonce) && !old.includes(L.seats[gs].nonce) && L.seats[hs].nonce === '', `the guest readies the rematch with a nonce it drew (not one the old match's start showed the host), the host's seat none: ${JSON.stringify([L.seats.s0.nonce, L.seats.s1.nonce])}`)
        store.close()
        return `both pages in one rematch (${next.slice(0, 8)}…), the guest's nonce its own`
      } finally {
        await repo.shutdown?.().catch(() => {})
      }
    },

    async 'bad-lobby'() {
      const { host, guest } = await lobbyPair()
      // a peer writes a battle the rules refuse
      await guest.evaluate(() => window.__ts.net.handle.change((d) => {
        d.lobby.overtime = 'x'
      }))
      await until(host, () => window.__ts.net.handle.doc().lobby.overtime === 'x', null, 20000, 'the change on the host page')
      await press(guest, 'Ready')
      await press(host, 'Ready')
      await until(host, () => /can't start a battle: overtime "x"/.test(document.querySelector('#lobbyStatus').textContent), null, 20000, "the host page saying why the lobby can't start")
      await sleep(3000)
      const n = await host.evaluate(() => window.__ts.net.store.length)
      must(n === 1, `no start written (the log holds ${n} entries, its open alone)`)
      return "\"This lobby can't start a battle: overtime \"x\"…\", no start written"
    },

    async continue() {
      const { repo, handle, store, page, id, d0 } = await atRoundLimit()
      try {
        // seat 0's link in another browser: no record of readying the seat
        const other = await open(`#m=${id}&dev=${d0}`)
        await live(other)
        const seats = await other.evaluate(() => window.__ts.session.localSeats.join())
        await until(other, () => /Playing seat 1 as the battle's start set it/.test(document.querySelector('#toast').textContent), null, 20000, 'the notice that this browser kept no record')
        const dialog = await other.evaluate(() => !document.querySelector('#netdialog').classList.contains('hidden'))
        must(seats === '0' && !dialog, `another browser on seat 1's link plays it (seats ${seats}, a dialog ${dialog})`)
        store.close()
        return 'another browser on the seat\'s link plays it, and says so'
      } finally {
        await repo.shutdown?.().catch(() => {})
      }
    },

    async scrub() {
      const { repo, handle, store, setup } = await battle((G) => G.turn.round >= 3)
      try {
        const page = await open(`#m=${handle.documentId}`)
        await live(page)
        await until(page, () => !document.querySelector('#replay').classList.contains('hidden') && window.__ts.replay.open && document.querySelector('#rpLive.on'), null, 20000, 'the replay bar at Live on the watching page')
        const ref = refOf(store)
        const k = Math.floor(ref.moves.length / 2)
        // the slider, as a hand lets go of it
        await page.evaluate((k) => {
          const s = document.querySelector('#rpAt')
          s.value = k
          s.dispatchEvent(new Event('change'))
        }, k)
        await until(page, (k) => window.__ts.replay.k === k && window.__ts.session !== window.__ts.net.play && window.__ts.player.idle, k, 20000, `the scrub to move ${k}`)
        const at = await page.evaluate(() => ({ hash: window.__ts.hash(), label: document.querySelector('#rpLabel').textContent }))
        must(at.hash === ref.hashAt(k), `the scrub to move ${k} shows the match as it stood after it (${at.label})`)
        // moves land meanwhile: folded by the battle's own Session, the
        // table where it was
        for (const x of autoplay(store, setup, { stop: (G) => G.turn.round >= 4 })) x?.close()
        await until(page, (n) => window.__ts.net.play.accepted.length >= n, refOf(store).moves.length, 20000, 'the moves that landed folded on the page')
        const still = await page.evaluate(() => ({ k: window.__ts.replay.k, hash: window.__ts.hash() }))
        must(still.k === k && still.hash === ref.hashAt(k), `moves landing while scrubbed leave the table at move ${k} (${still.k})`)
        await page.click('#rpLive')
        await until(page, () => window.__ts.session === window.__ts.net.play && window.__ts.player.idle, null, 20000, 'Live: the battle itself')
        const now = refOf(store)
        const end = await page.evaluate(() => window.__ts.hash())
        must(end === now.hash, 'Live shows the battle as it stands')
        store.close()
        return `scrubbed to move ${k + 1} of ${ref.moves.length}, moves landing meanwhile, then Live`
      } finally {
        await repo.shutdown?.().catch(() => {})
      }
    },

    async replay() {
      const { repo, handle, store, setup } = await battle((G) => G.turn.round >= 3)
      try {
        const page = await open(`#m=${handle.documentId}`)
        await live(page)
        await until(page, () => window.__ts.replay.open, null, 20000, 'the replay bar on the watching page')
        await page.click('#rpStart')
        await until(page, () => window.__ts.replay.playing && window.__ts.session !== window.__ts.net.play, null, 20000, 'the replay playing from the start')
        // moves land while it plays
        for (const x of autoplay(store, setup, { stop: (G) => G.turn.round >= 4 })) x?.close()
        await until(page, () => !window.__ts.replay.playing && window.__ts.session === window.__ts.net.play && window.__ts.player.idle, null, 90000, 'the replay back at Live')
        const ref = refOf(store)
        const end = await page.evaluate(() => ({ hash: window.__ts.hash(), n: window.__ts.net.play.accepted.length }))
        must(end.hash === ref.hash && end.n === ref.moves.length, `the replay caught up with the battle and shows it (${end.n} of ${ref.moves.length} moves)`)
        const shown = await page.evaluate(() => [...document.querySelectorAll('#logList .entry')].map((e) => e.textContent).reverse())
        const want = logLines(store.entries()).slice(-shown.length)
        must(shown.length > 0 && JSON.stringify(shown) === JSON.stringify(want), `the battle log after the replay is the match's (${shown.length} lines)`)
        store.close()
        return `${ref.moves.length} moves replayed from the start, moves landing meanwhile, back at Live`
      } finally {
        await repo.shutdown?.().catch(() => {})
      }
    },

    async files() {
      const { repo, handle, store, a, d0 } = await battle(() => false)
      try {
        const page = await seatPage(handle, a, 0, d0)
        await until(page, () => window.__ts.session.status === 'over' && !document.querySelector('#over').classList.contains('hidden') && window.__ts.player.idle, null, 60000, 'the end screen')
        await page.click('#watchReplay')
        await until(page, () => window.__ts.replay.playing, null, 20000, 'Watch the replay playing')
        await until(page, () => !window.__ts.replay.playing && window.__ts.player.idle, null, 90000, 'the replay at its end')
        const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 20000 }), page.click('#rpSave')])
        const text = readFileSync(await dl.path(), 'utf8')
        const file = JSON.parse(text)
        must(file.replay === 'tails-and-scales' && JSON.stringify(file.log) === store.export(), `💾 saves the battle's whole log (${file.log?.length} entries; the log ${store.length})`)
        // a fresh page opens it from the title
        const other = await open()
        await other.setInputFiles('#replayFile', { name: dl.suggestedFilename(), mimeType: 'application/json', buffer: Buffer.from(text) })
        await until(other, () => window.__ts.replay.open && window.__ts.replay.playing, null, 20000, 'the replay file playing on a fresh page')
        await until(other, () => !window.__ts.replay.playing && window.__ts.player.idle, null, 90000, 'the replay file at its end')
        const ref = refOf(store)
        const end = await other.evaluate(() => window.__ts.hash())
        const shown = await other.evaluate(() => [...document.querySelectorAll('#logList .entry')].map((e) => e.textContent).reverse())
        must(end === ref.hash && JSON.stringify(shown) === JSON.stringify(logLines(store.entries()).slice(-shown.length)), 'the replay file plays to the same match and battle log')
        store.close()
        return `the replay watched, saved (${file.log.length} entries) and opened again from the title`
      } finally {
        await repo.shutdown?.().catch(() => {})
      }
    },

    async kept() {
      const { repo, handle, store, setup, a, d0 } = await battle((G) => G.turn.round >= 2)
      try {
        const id = handle.documentId, url = `${base}#m=${id}&dev=${d0}`
        const page = await seatPage(handle, a, 0, d0)
        const ctx = page.context()
        const n = await page.evaluate(() => window.__ts.net.play.accepted.length)
        await until(page, (n) => window.__ts.net && window.__ts.net.play.accepted.length === n, n, 5000, 'the page settled')
        const t0 = Date.now()
        while ((await keptN(page, id, d0)) < n && Date.now() - t0 < 20000) await sleep(200)
        must((await keptN(page, id, d0)) >= n, `the page keeps the ${n} entries it accepted`)
        await page.close()
        // back after moves landed: it says so
        for (const x of autoplay(store, setup, { stop: (G) => G.turn.round >= 3 })) x?.close()
        const back = await ctx.newPage()
        back.on('pageerror', (e) => errors.push(`${e.message}`))
        await back.goto(url)
        await live(back)
        await until(back, () => /^Back in the battle/.test(document.querySelector('#toast').textContent), null, 20000, 'the toast "Back in the battle"')
        const said = await back.$eval('#toast', (e) => e.textContent)
        await sleep(1500)
        await back.close()
        // the title offers to continue it, and takes the page back to its seat
        const title = await ctx.newPage()
        title.on('pageerror', (e) => errors.push(`${e.message}`))
        await title.goto(base)
        await until(title, () => window.__ts && !document.querySelector('#continue').classList.contains('hidden'), null, 20000, 'Continue on the title')
        const offer = await title.$eval('#continue', (e) => e.textContent)
        await title.click('#continue')
        await live(title)
        const seats = await title.evaluate(() => window.__ts.session.localSeats.join())
        must(seats === '0' && /against Ben/.test(offer), `Continue ("${offer}") takes the page back to its seat (seats ${seats})`)
        await sleep(1500)
        await title.close()
        // an entry the page played, gone from the log while it was away, its
        // own copy of the document set aside (as a browser that kept only
        // what it played would load it from the server)
        const gone = store.entries().findIndex((e, i) => i > 2 && !e.bad && e.t !== 'final')
        handle.change((d) => d.log.deleteAt(gone))
        await sleep(1500)
        const blank = await ctx.newPage()
        await blank.goto(base)
        await blank.evaluate(() => new Promise((r) => {
          const q = indexedDB.deleteDatabase('tails-and-scales')
          q.onsuccess = q.onerror = q.onblocked = () => r()
        }))
        await blank.close()
        const again = await ctx.newPage()
        again.on('pageerror', (e) => errors.push(`${e.message}`))
        await again.goto(url)
        await until(again, () => !document.querySelector('#netdialog').classList.contains('hidden') && /log was changed/.test(document.querySelector('#netTitle').textContent), null, 30000, 'the tamper dialog on the page that came back')
        const st = await again.evaluate(() => ({ status: window.__ts.net.play?.status, G: !!window.__ts.net.play?.G }))
        must(st.status === 'tamper' && !st.G, `the log that lost an entry the page played is tamper, before any match is shown (${JSON.stringify(st)})`)
        // Back lets go of the match: the title, no badge, the link gone, and
        // no Continue for it
        await again.click('#netBack')
        await until(again, () => !window.__ts.net.id && document.querySelector('#netbadge').classList.contains('hidden') && !/m=/.test(location.hash) && !document.querySelector('#title').classList.contains('hidden') && document.querySelector('#continue').classList.contains('hidden'), null, 20000, 'Back from the tamper dialog: the match let go of')
        store.close()
        return `"${said}", Continue back to the seat, and a log changed while away is tamper (Back lets it go)`
      } finally {
        await repo.shutdown?.().catch(() => {})
      }
    },

    async group() {
      const { host, guest } = await lobbyPair()
      await setName(guest, 'Ben')
      await press(guest, 'Ready')
      await press(host, 'Ready')
      await Promise.all([live(host), live(guest)])
      // three of a seat's units picked up together, their formation pinned
      // from the first (`ahead`: 3" toward the middle, else 4" along its
      // edge), and sent; what was sent and refused
      const groupOrder = (page, seat, ahead) => page.evaluate(async ({ seat, ahead }) => {
        const ts = window.__ts, ses = ts.session
        const ids = ses.G.units.filter((u) => u.side === seat && u.alive > 0).slice(0, 3).map((u) => u.id)
        ts.group.select(ids)
        const u = ses.G.units.find((x) => x.id === ids[0])
        ts.group.pinAt(u.pos.x + (ahead ? (u.pos.x < 0 ? 3 : -3) : 0), u.pos.z + (ahead ? 0 : 4))
        const n0 = ses.count, r0 = ses.rejected.length
        await ts.group.commit()
        return { ids, sent: ses.count - n0, refused: ses.rejected.length - r0, pinned: ts.group.pinned() }
      }, { seat, ahead })
      // both pages on the same entries and the same match
      const same = async (what) => {
        const at = (p) => p.evaluate(() => `${window.__ts.session.accepted.length} ${window.__ts.hash()}`)
        const t0 = Date.now()
        let h, g
        while (Date.now() - t0 < 30000) {
          ;[h, g] = await Promise.all([at(host), at(guest)])
          if (h === g) return
          await sleep(250)
        }
        throw new Fail(`after ${what} the pages fold different matches (host ${h}, guest ${g})`)
      }
      // seat 0's deployment on the host's page: a group placed
      await until(host, () => window.__ts.session.G.pending?.k === 'deploy' && window.__ts.session.decisionFor() === 0 && window.__ts.player.idle, null, 60000, "seat 0's deployment on the host's page")
      const placed = await groupOrder(host, 0, false)
      must(placed.sent >= 1 && !placed.refused && !placed.pinned, `a group placed in the deployment: ${JSON.stringify(placed)}`)
      // the guest's page sees the host's group in its presence (the dashed
      // rings round each), and the same match
      await until(guest, (ids) => window.__ts.net.presence.live().some((p) => p.seat === 0 && JSON.stringify([...(p.sels ?? [])].sort()) === JSON.stringify([...ids].sort())), placed.ids, 20000, "the host's group in the guest's presence")
      await same('the placement')
      // both Begin battle; the seat whose turn it is moves a group
      for (const p of [host, guest]) {
        await until(p, () => window.__ts.session.decisionFor() >= 0 && window.__ts.player.idle, null, 30000, 'a seat to deploy')
        await p.evaluate(() => window.__ts.endPhase())
      }
      const mover = await Promise.race([host, guest].map(async (p) => {
        await until(p, () => window.__ts.session.G.pending?.phase === 'move' && window.__ts.session.decisionFor() >= 0 && window.__ts.player.idle, null, 60000, 'the movement phase')
        return p
      }))
      const seat = await mover.evaluate(() => window.__ts.session.decisionFor())
      const moved = await groupOrder(mover, seat, true)
      must(moved.sent >= 1 && !moved.refused && !moved.pinned, `a group moved in the movement phase: ${JSON.stringify(moved)}`)
      await same('the group move')
      // (F10c) standing orders at End online: every unit still able to move
      // on autopilot, End pressed; the orders' commands wait on each fold,
      // none is refused, the other page sees the orders (presence `ords`)
      // and folds the same match
      const other = mover === host ? guest : host
      const ordered = await mover.evaluate((seat) => {
        const ts = window.__ts, ses = ts.session
        const ids = ses.preview((G, q) => G.units.filter((u) => u.side === seat && u.alive > 0 && q.canAct(G, u)).map((u) => u.id))
        ts.orders.give(ids, { k: 'auto' }, seat)
        return ids
      }, seat)
      must(ordered.length > 0, 'no unit left to put on autopilot')
      await until(other, (seat) => window.__ts.net.presence.live().some((p) => p.seat === seat && Object.keys(p.ords ?? {}).length), seat, 20000, "the mover's standing orders in the other page's presence")
      const before = await mover.evaluate(() => ({ n: window.__ts.session.count, r: window.__ts.session.rejected.length }))
      await mover.evaluate(() => window.__ts.endPhase())
      await until(mover, (seat) => !window.__ts.orders.busy() && !(window.__ts.session.G.pending?.phase === 'move' && window.__ts.session.decisionFor() === seat), seat, 60000, 'the orders and the End')
      const ran = await mover.evaluate((b) => ({ kinds: window.__ts.session.store.entries().slice(b.n).map((e) => e.t), refused: window.__ts.session.rejected.length - b.r }), before)
      must(ran.kinds.includes('pilot') && ran.kinds.includes('end') && !ran.refused, `the orders at End sent ${JSON.stringify(ran)}`)
      await same('the orders at End')
      return `a group of 3 placed (${placed.sent} sent) and moved (${moved.sent} sent) online, none refused; the other page saw the group and folds the same match; ${ordered.length} units on autopilot carried out at End (${ran.kinds.join(', ')}), seen by the other page, folded alike`
    },

    async follow() {
      const { host, guest } = await lobbyPair()
      await setName(guest, 'Ben')
      await press(guest, 'Ready')
      await press(host, 'Ready')
      await Promise.all([live(host), live(guest)])
      // a page's camera (the ?debug block's view.camera()): its pose, how
      // often the follow policy moved it, its bookmarks
      const cam = (p) => p.evaluate(() => {
        const c = window.__ts.view.camera()
        return { pose: c.pose, followed: c.followed, marks: c.marks }
      })
      const state = (p) => p.evaluate(() => {
        const ts = window.__ts, ses = ts.session
        return { idle: ts.player.idle, seat: ses.decisionFor(), k: ses.G.pending?.k, phase: ses.G.pending?.phase }
      })
      // whoever holds a decision ends it (Begin battle, then each phase),
      // until the host has pressed End in a phase of its own and the guest's
      // movement phase waits on the guest
      let hostEnded = false
      const t0 = Date.now()
      for (;;) {
        if (Date.now() - t0 > 120000) throw new Fail(`the guest's movement phase never came after an End of the host's (host ended: ${hostEnded})`)
        const g = await state(guest)
        if (hostEnded && g.idle && g.seat === 1 && g.k === 'phase' && g.phase === 'move') break
        for (const [p, isHost] of [[host, true], [guest, false]]) {
          const s = await state(p)
          if (!s.idle || s.seat < 0 || !(s.k === 'deploy' || s.k === 'phase')) continue
          await p.evaluate(() => window.__ts.endPhase())
          if (isHost && s.k === 'phase') hostEnded = true
        }
        await sleep(150)
      }
      const before = await cam(host), mineBefore = await cam(guest)
      must(before.marks.includes(0), `the host's page keeps the bookmark of its last End through its own fight and morale phases: ${JSON.stringify(before.marks)}`)
      // the guest moves one unit alone, as far from where the host's camera
      // looks as its move reaches
      const moved = await guest.evaluate(async (t) => {
        const ts = window.__ts, ses = ts.session
        const u = ts.units.find((x) => x.side === 1 && ts.q.alive(x) && ts.q.canAct(x))
        const plan = ts.q.movePlan(u, 0)
        let c = -1, best = -1
        for (let i = 0; i < ts.nav.N; i++) {
          if (!isFinite(plan.res.dist[i]) || plan.res.dist[i] < 2 || !ts.validEnd(plan, i)) continue
          const d = Math.hypot(ts.nav.x(i) - t[0], ts.nav.z(i) - t[2])
          if (d > best) (best = d), (c = i)
        }
        if (c < 0) return null
        const n0 = ses.count, r0 = ses.rejected.length
        await ts.doMove(u, c)
        return { u: u.id, to: [ts.nav.x(c), ts.nav.z(c)], far: best, sent: ses.count - n0, refused: ses.rejected.length - r0, accepted: ses.accepted.length }
      }, before.pose.target)
      must(moved && moved.sent === 1 && !moved.refused, `the guest's lone move sent: ${JSON.stringify(moved)}`)
      await until(host, (n) => window.__ts.session.accepted.length >= n && window.__ts.player.idle, moved.accepted, 30000, "the guest's move folded and played on the host's page")
      await until(host, (f) => window.__ts.view.camera().followed > f, before.followed, 20000, "the host's camera following the guest's move")
      await sleep(300)
      const after = await cam(host), mine = await cam(guest)
      const off = Math.hypot(after.pose.target[0] - before.pose.target[0], after.pose.target[2] - before.pose.target[2])
      must(after.followed === before.followed + 1 && off > 1, `the guest's move swings the host's camera once (${after.followed - before.followed} moves, its look ${off.toFixed(1)}" away)`)
      must(mine.followed === mineBefore.followed, `the guest's own camera stays for its own move (${mine.followed - mineBefore.followed} moves)`)
      // the guest ends its turn: the host's next phase brings the camera
      // back to where it pressed its last End
      const t1 = Date.now()
      for (;;) {
        if (Date.now() - t1 > 120000) throw new Fail("the host's next phase never came")
        const h = await state(host)
        if (h.idle && h.seat === 0 && h.k === 'phase') break
        const g = await state(guest)
        if (g.idle && g.seat === 1 && (g.k === 'phase' || g.k === 'chargeEnd')) await guest.evaluate(() => window.__ts.endPhase())
        await sleep(150)
      }
      await sleep(300)
      const back = await cam(host)
      const close = (a, b) => a.every((x, i) => Math.abs(x - b[i]) < 1e-3)
      must(close(back.pose.pos, before.pose.pos) && close(back.pose.target, before.pose.target) && !back.marks.includes(0), `the host's next phase brings its camera back to its bookmark (at ${back.pose.target.map((x) => x.toFixed(2))}, kept ${JSON.stringify(back.marks)})`)
      return `the guest's lone move (to ${moved.to.map((x) => x.toFixed(1))}) swung the host's camera once (its look ${off.toFixed(1)}" over), the guest's own stayed; the host's next phase came back to where it pressed End`
    },

    async size() {
      // (the host starts it by hand: Ready on both, then the size changed.
      // Its autoStart is off from the lobby's making, not once both have
      // pressed Ready: a guest's Ready that reaches the host's page before
      // the host's own press makes that press the start, the lobby gone
      // before the size can be picked)
      const { host, guest, link } = await lobbyPair({ autoStart: false })
      await setName(guest, 'Ben')
      await press(guest, 'Ready')
      await press(host, 'Ready')
      await until(host, () => { const L = window.__ts.net.handle.doc().lobby; return L.seats.s0?.ready && L.seats.s1?.ready }, null, 30000, 'both seats ready on the host')
      // (an army on each seat, as F11b's lists will ride: the size lets it go)
      await host.evaluate(() => window.__ts.net.handle.change((d) => {
        for (const k of ['s0', 's1']) d.lobby.seats[k].army = 'classic'
        d.lobby.terrain = 'classic'
        d.lobby.rounds = 5
      }))
      const offered = await host.$$eval('#lobbySize option', (os) => os.map((o) => o.value))
      must(offered.join() === 'classic,field,grand', `the host's page offers every size: ${offered.join(', ')}`)
      await host.selectOption('#lobbySize', 'field')
      await until(guest, () => window.__ts.net.handle.doc().lobby.mission === 'field', null, 20000, "the size reaching the guest's page")
      const L = JSON.parse(await lobbyNow(guest))
      must(!L.seats.s0.ready && !L.seats.s1.ready, `a size change un-readies both seats: ${JSON.stringify(L.seats)}`)
      must(!('terrain' in L) && !('rounds' in L) && !('army' in L.seats.s0) && !('army' in L.seats.s1), `a size change lets the terrain, the rounds and each seat's army go: ${JSON.stringify(L)}`)
      const shown = await guest.evaluate(() => ({ value: document.querySelector('#lobbySize').value, disabled: document.querySelector('#lobbySize').disabled }))
      must(shown.value === 'field' && shown.disabled, `the guest's page shows the size, not its to change: ${JSON.stringify(shown)}`)
      // ready again: the battle on the size's board, its start naming it
      await host.evaluate(() => (window.__ts.net.autoStart = true))
      await press(guest, 'Ready')
      await press(host, 'Ready')
      await Promise.all([live(host), live(guest)])
      const got = await Promise.all([host, guest].map((p) => p.evaluate(() => ({ mission: window.__ts.G.setup.mission, terrain: window.__ts.G.setup.terrain, rounds: window.__ts.G.setup.rounds, W: window.__ts.G.board.W, H: window.__ts.G.board.H }))))
      must(got.every((g) => g.mission === 'field' && g.W === 60 && g.H === 40 && g.terrain === 'open' && g.rounds === 6), `the start names the size, its board, set and rounds: ${JSON.stringify(got)}`)
      // a rematch keeps it
      await guest.evaluate(() => window.__ts.session.submit(1, { t: 'concede' }))
      await until(host, () => window.__ts.session.status === 'over' && !document.querySelector('#rematch').classList.contains('hidden'), null, 30000, "the host's Rematch button")
      await host.click('#rematch')
      const link2 = await linkOf(host, link)
      const L2 = JSON.parse(await lobbyNow(host))
      must(link2 !== link && L2.mission === 'field' && (await host.$eval('#lobbySize', (e) => e.value)) === 'field', `the rematch's lobby keeps the size: ${JSON.stringify({ mission: L2.mission })}`)
      return `Field picked by the host: both seats un-readied, terrain, rounds and armies let go, the guest shown it; the battle on 60×40 (${got[0].terrain}, ${got[0].rounds} rounds); the rematch kept it`
    },
  }

  const out = {}
  try {
    for (const c of cases) {
      const t0 = Date.now()
      errors.length = 0
      try {
        const said = await RUN[c]()
        if (errors.length) throw new Fail(`page errors: ${errors.join('; ')}`)
        out[c] = { ok: true, said, secs: Math.round((Date.now() - t0) / 1000) }
      } catch (err) {
        out[c] = { ok: false, said: err instanceof Fail ? err.message : err.stack, secs: Math.round((Date.now() - t0) / 1000) }
      }
      for (const ctx of contexts.splice(0)) await ctx.close().catch(() => {})
    }
  } finally {
    await browser.close()
    await web.close()
    // (a repo's socket closing late, the server gone; once, whatever the
    // number of runs)
    if (!process.listenerCount('uncaughtException')) process.on('uncaughtException', () => {})
    await sync.close()
  }
  return out
}

// Broken copies the self-test builds; each must fail the case named.
const MUTANTS = {
  // (F12) Undo up online too
  'undo-online': ['play', 'present/hud-model.js', '  const undoUp = end.show && playedHere(session)\n', '  const undoUp = end.show\n'],
  // (F7a) the host's terrain never reaches the lobby
  'terrain-unwired': ['terrain', 'net/lobby.js', '    if (fields.terrain !== undefined) d.lobby.terrain = fields.terrain\n', ''],
  // (F4's leftover) a snap past the end keeps a vote panel up
  'vote-blocks-end': ['vote-blocks-end', 'app/flow.js', "if (M.stage === 'over' && (!this.ui.result.up || this.ui.result.voting)) this.over(resultOf(G))", "if (M.stage === 'over' && !this.ui.result.up) this.over(resultOf(G))"],
  // verifyStart compares the nonce alone
  'nonce-only': ['altered', 'net/seed.js', "  const keys = [...new Set([...Object.keys(record ?? {}), ...Object.keys(seat ?? {})])].filter((k) => k !== 'ready').sort()", "  const keys = ['nonce']"],
  // the online Session never says its closing hash
  'no-closing': ['play', 'app/online.js', 'onTrace: this.flow.onTrace, closing: true, known', 'onTrace: this.flow.onTrace, closing: false, known'],
  // a name box that takes whatever is typed
  'name-unfitted': ['names', 'ui/screens/lobby.js', '        if (fit !== name.value) name.value = fit\n', ''],
  // a refold that undoes moves says nothing
  'no-toast': ['history', 'app/flow.js', "        if (undone > 0) this.ui.toast?.show(", "        if (false) this.ui.toast?.show("],
  // a refold leaves the old history's battle log up
  'no-relog': ['history', 'app/flow.js', "        this.player.snap(G, project(G))\n        this.relog(ses.folder.pushed)\n", "        this.player.snap(G, project(G))\n"],
  // a rematch page never looks back at the old match's `next`
  'rematch-strands': ['rematch-race', 'app/online.js', '    if (won && won !== this.id) return this.goTo(won)\n', ''],
  // a guest readies with whatever nonce its seat holds (a rematch's, the
  // host's copy)
  'nonce-not-drawn': ['rematch-race', 'app/online.js', "    if (fields.ready) fields = { ...fields, nonce: L.host === this.dev ? '' : this.nonce() }\n", ''],
  // the lobby's battle unchecked: a start the Folder refuses is written
  'start-unchecked': ['bad-lobby', 'app/online.js', '        createMatch(N.setupOf(L, 0), { out: null })\n', ''],
  // a page with no record of readying its seat watches instead
  'no-record-watches': ['continue', 'net/seed.js', '  if (!readied.length) return null\n', ''],
  // no snap past a backlog: the page plays every event (2 or 4 times as fast)
  'no-catch-up-snap': ['catch-up', 'app/flow.js', '    if (behind > 30) {', '    if (false) {'],
  // (N3) a watching page gets no replay bar
  'no-watch-bar': ['scrub', 'app/online.js', '    if (!localSeats.length) this.flow.replay?.open(this.play, { live: true })\n', ''],
  // the scrub shows the battle itself, wherever the slider is
  'scrub-shows-battle': ['scrub', 'app/replay.js', '    if (ses.G) this.flow.show(ses)\n', '    if (ses.G) this.flow.show(this.battle)\n'],
  // a replay of a battle going on stops at its last move, never Live
  'replay-stops': ['replay', 'app/replay.js', '        if (this.isLive) return this.live()\n', ''],
  // the end screen's Watch the replay does nothing
  'no-end-replay': ['files', 'app/boot.js', '    replay.open(flow.battle)\n    replay.fromStart()\n', ''],
  // the title's replay file never read
  'file-unread': ['files', 'ui/screens/title.js', '      if (f) replay(await f.text())\n', ''],
  // the page keeps nothing of what it accepted across a reload
  'kept-unused': ['kept', 'app/online.js', 'closing: true, known: had?.known })', 'closing: true })'],
  // the title never offers to continue
  'no-continue': ['kept', 'app/online.js', '    await N.saveKept(key, { known, n: known.length, at: Date.now() })\n    this.note()\n', '    await N.saveKept(key, { known, n: known.length, at: Date.now() })\n'],
  // (N3's review) Back from a log found tampered with as the page came
  // back leaves the match attached (its badge, its link, its tick)
  'tamper-back-attached': ['kept', 'app/online.js', '        back: () => {\n          this.close()\n', '        back: () => {\n          this.leave()\n'],
  // (F10a) the page never tells the others what it has picked up together
  'no-sels': ['group', 'app/online.js', '      if (group.length >= 2) m.sels = group.slice(0, 120).map((u) => u.id)\n', ''],
  // (F10c) the standing orders never put in presence
  'no-ords': ['group', 'app/online.js', '    if (orders?.size) m.ords = Object.fromEntries([...orders].slice(0, 120).map(([id, o]) => [id, o.k]))\n', ''],
  // (F8b) a size change keeps the seats' armies, or never reaches the lobby
  'size-keeps-army': ['size', 'net/lobby.js', "      for (const k of SEAT_KEYS) if (d.lobby.seats[k] && 'army' in d.lobby.seats[k]) delete d.lobby.seats[k].army\n", ''],
  // (F14) a human opponent's lone move cued nowhere (the view's cue
  // handler gone), or the bookmark spent at the host's own fight phase
  'no-cue': ['follow', 'view/index.js', '      cue: (e, M) => rig.cue(e, { stage: M.stage, active: M.active, localSeats: localSeats() }),\n', ''],
  'mark-spent': ['follow', 'view/camera.js', '    if (!m || (m.followed === this.followed && !m.others)) return false\n', '    if (!m) return false\n'],
  // (F16) the lobby's fog never read as the battle begins, or never
  // written by the host's switch
  'fog-unread': ['fog', 'app/online.js', 'leave: () => this.close(), fog: N.lobbyOf(this.handle.doc()).fog })', 'leave: () => this.close(), fog: false })'],
  'fog-unwired': ['fog', 'net/lobby.js', '    if (fields.fog !== undefined) d.lobby.fog = fields.fog === true\n', ''],
  'size-unwired': ['size', 'app/online.js', "      mission: (name) => this.isHost() && Object.hasOwn(MISSIONS, name) && N.editBattle(this.handle, { mission: name, ...keptTerrain(N.lobbyOf(this.handle.doc()), name) }),\n", ''],
}

const bad = only.filter((c) => !CASES.includes(c) && !(a['self-test'] && Object.hasOwn(MUTANTS, c)))
if (bad.length) {
  console.error(`lobby-rig: no case ${bad.join(', ')} (there are ${CASES.join(', ')})`)
  process.exit(2)
}

const report = (out) => {
  for (const [c, r] of Object.entries(out)) console.log(`  ${c.padEnd(16)} ${r.ok ? 'ok  ' : 'FAIL'} ${r.said} (${r.secs} s)`)
  return Object.values(out).every((r) => r.ok)
}

const work = join(tmpdir(), `tails-and-scales-lobby-rig-${process.pid}`)
try {
  if (a['self-test']) {
    let missed = 0
    const picked = Object.entries(MUTANTS).filter(([name, [c]]) => !a.only || only.includes(name) || only.includes(c))
    for (const [name, [c, file, from, to]] of picked) {
      const code = copyCode(PKG, join(work, name))
      const f = join(code, file), src = readFileSync(f, 'utf8')
      if (src.split(from).length !== 2) throw new Error(`mutant ${name}: ${file} doesn't hold what it changes`)
      writeFileSync(f, src.replace(from, to))
      const out = await runCases(await buildApp(code, join(work, `${name}-dist`)), [c])
      const caught = !out[c].ok
      if (!caught) missed++
      console.log(`  ${name.padEnd(18)} ${caught ? `caught by ${c}: ${out[c].said.split('\n')[0].slice(0, 160)}` : `MISSED (${c} passed)`}`)
    }
    console.log(missed ? `\nlobby-rig self-test: ${missed} mutant(s) missed` : `\nlobby-rig self-test passed: ${picked.length} broken copies each caught`)
    process.exitCode = missed ? 1 : 0
  } else {
    const dist = a.dist ?? (await buildApp(PKG, join(work, 'dist')))
    console.log(`lobby-rig: ${only.join(', ')} on ${a.dist ? dist : 'a fresh build'}`)
    const ok = report(await runCases(dist, only))
    console.log(ok ? '\nlobby-rig passed: online play holds in Chromium, from the lobby to the end' : '\nlobby-rig failed')
    process.exitCode = ok ? 0 : 1
  }
} finally {
  rmSync(work, { recursive: true, force: true })
}
