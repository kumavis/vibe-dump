// terminal.js — the shell.
//
// Real in the only sense that matters here: every command walks the same
// filesystem the explorer walks, so nothing in this file is a lookup table of
// canned output. It is also the one place where reveal.run can be started by
// typing its name, which is the correct way to start something like that.

import { el, clamp } from '../util.js'
import { childrenOf, isContainer, resolve } from '../fs.js'
import { ACCENTS } from '../theme.js'
import { MOTIFS } from '../motifs.js'

const BUILD = 'build 0.9.4 "bai sema"'
const TREE_DEPTH = 6

// `run reveal`, `run reveal.run`, `./reveal.run`, or just the name on its own.
const REVEAL = /^\.?\/?reveal(\.run)?$/i

const tokens = (line) => line.match(/\S+/g) ?? []
const restOf = (line) => line.trim().replace(/^\S+\s*/, '')
const pad = (s, n) => String(s).padEnd(n)

const elapsed = (ms) => {
  const s = Math.max(0, Math.floor(ms / 1000))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  return `${h ? `${h}h ` : ''}${m}m ${String(s % 60).padStart(2, '0')}s`
}

/** Longest shared head of a list of strings. Tab completion is built on it. */
function commonPrefix(list) {
  if (!list.length) return ''
  let out = list[0]
  for (const s of list) {
    let i = 0
    while (i < out.length && i < s.length && out[i] === s[i]) i++
    out = out.slice(0, i)
  }
  return out
}

/** Column-major layout, the way ls does it: read down, then across. */
function columnize(items, width) {
  if (!items.length) return []
  const longest = items.reduce((m, s) => Math.max(m, s.length), 0)
  const cols = clamp(Math.floor(width / (longest + 2)), 1, items.length)
  const rows = Math.ceil(items.length / cols)
  const out = []
  for (let r = 0; r < rows; r++) {
    let line = ''
    for (let c = 0; c < cols; c++) {
      const item = items[c * rows + r]
      if (item !== undefined) line += c === cols - 1 ? item : pad(item, longest + 2)
    }
    out.push(line.trimEnd())
  }
  return out
}

function treeLines(node, out = [], prefix = '', depth = 0) {
  const kids = childrenOf(node)
  kids.forEach((child, i) => {
    const last = i === kids.length - 1
    out.push({
      text: `${prefix}${last ? '└── ' : '├── '}${child.name}${isContainer(child) ? '/' : ''}`,
      kind: child.kind,
    })
    if (isContainer(child) && depth < TREE_DEPTH) treeLines(child, out, `${prefix}${last ? '    ' : '│   '}`, depth + 1)
  })
  return out
}

export default {
  id: 'terminal',
  title: 'Terminal',
  mark: 'kranok',
  width: 660,
  height: 420,
  minWidth: 380,
  minHeight: 200,
  singleton: true,

  mount(body, { win, shell }) {
    const { byPath, root } = shell.fs
    const prefs = shell.prefs
    const openedAt = performance.now()

    let cwd = root
    const history = []
    let histAt = 0 // history.length means "the line currently being typed"
    let draft = ''

    // --- the one element --------------------------------------------------

    const term = el('div.term')
    const promptEl = el('span.term__prompt')
    const input = el('input.term__input', {
      type: 'text',
      spellcheck: 'false',
      autocomplete: 'off',
      autocapitalize: 'off',
      autocorrect: 'off',
      'aria-label': 'Command line',
    })
    const row = el('div.term__row', [promptEl, input])
    term.append(row)
    body.append(term)

    // Column layouts need the real character advance, and the mono font is
    // whatever the page settled on. Measure one rather than guess at it.
    const charWidth = (() => {
      const probe = el('span', {
        text: '0'.repeat(20),
        style: { position: 'absolute', visibility: 'hidden', whiteSpace: 'pre' },
      })
      term.append(probe)
      const w = probe.offsetWidth / 20
      probe.remove()
      return w > 0 ? w : 7.4
    })()

    const columns = () => Math.max(24, Math.floor((term.clientWidth - 30) / charWidth))

    // --- output -----------------------------------------------------------

    const print = (text = '', tone = '') => {
      // An element with no text has no line box and so no height. A blank line
      // in a document is a space, otherwise every paragraph break disappears.
      const line = el(`div.term__line${tone ? `.term__line--${tone}` : ''}`, { text: text === '' ? ' ' : text })
      term.insertBefore(line, row)
    }
    const printAll = (lines, tone) => {
      for (const line of lines) print(line, tone)
    }
    const fail = (text) => print(text, 'err')
    const toBottom = () => {
      term.scrollTop = term.scrollHeight
    }
    const paintPrompt = () => {
      promptEl.textContent = `lotus:${cwd.path} $`
    }

    function startReveal() {
      print('reveal.run', 'note')
      print('Pulling the camera back off this screen. Nothing is saved, because nothing here was ever work.', 'dim')
      shell.reveal()
    }

    // --- commands ---------------------------------------------------------

    const COMMANDS = {
      help: {
        blurb: 'this list',
        run() {
          print('commands', 'note')
          for (const [name, cmd] of Object.entries(COMMANDS)) {
            // Widest signature is "theme [dark|light]" at 18 characters, so the
            // description column has to start past that or the two collide.
            print(`  ${pad(cmd.args ? `${name} ${cmd.args}` : name, 21)}${cmd.blurb}`)
          }
          print('  tab completes, up and down walk the history, ctrl-c abandons a line', 'dim')
        },
      },

      ls: {
        args: '[path]',
        blurb: 'what is in a folder',
        run(argv) {
          const target = resolve(byPath, cwd, argv[0])
          if (!target) return fail(`ls: ${argv[0]}: no such path`)
          if (!isContainer(target)) return print(target.name)
          const kids = childrenOf(target)
          if (!kids.length) return print('(empty)', 'dim')
          printAll(columnize(kids.map((k) => `${k.name}${isContainer(k) ? '/' : ''}`), columns()))
        },
      },

      cd: {
        args: '[path]',
        blurb: 'change folder; .. goes up',
        run(argv) {
          const target = resolve(byPath, cwd, argv[0] ?? '/')
          if (!target) return fail(`cd: ${argv[0]}: no such path`)
          if (!isContainer(target)) return fail(`cd: ${target.path}: not a folder`)
          cwd = target
          paintPrompt()
        },
      },

      pwd: {
        blurb: 'where you are',
        run() {
          print(cwd.path)
        },
      },

      cat: {
        args: '<file>',
        blurb: 'print a document',
        run(argv) {
          if (!argv.length) return fail('cat: needs a file')
          const target = resolve(byPath, cwd, argv[0])
          if (!target) return fail(`cat: ${argv[0]}: no such path`)
          if (isContainer(target)) return fail(`cat: ${target.path}: is a folder`)
          if (typeof target.body !== 'string') return fail(`cat: ${target.name}: not text. Try open ${target.name}.`)
          printAll(target.body.split('\n'))
        },
      },

      tree: {
        args: '[path]',
        blurb: 'the whole shape of it',
        run(argv) {
          const target = resolve(byPath, cwd, argv[0])
          if (!target) return fail(`tree: ${argv[0]}: no such path`)
          if (!isContainer(target)) return fail(`tree: ${target.path}: not a folder`)
          print(target.path)
          const rows = treeLines(target)
          printAll(rows.map((r) => r.text))
          const folders = rows.filter((r) => r.kind === 'folder').length
          print(`${folders} folders, ${rows.length - folders} files`, 'dim')
        },
      },

      open: {
        args: '<path>',
        blurb: 'hand it to the desktop',
        run(argv) {
          if (!argv.length) return fail('open: needs a path')
          const target = resolve(byPath, cwd, argv[0])
          if (!target) return fail(`open: ${argv[0]}: no such path`)
          print(`opening ${target.path}`, 'note')
          shell.open(target)
        },
      },

      clear: {
        blurb: 'wipe the scrollback',
        run() {
          // Only the lines go. Emptying the whole element would take the input
          // with it, and with it the focus.
          for (const line of [...term.querySelectorAll('.term__line')]) line.remove()
        },
      },

      echo: {
        args: '<words>',
        blurb: 'say it back',
        run(argv, rest) {
          print(rest)
        },
      },

      theme: {
        args: '[dark|light]',
        blurb: 'the same building at night or at noon',
        run(argv) {
          if (!argv.length) return print(`theme ${prefs.get('theme')}`, 'note')
          const want = argv[0].toLowerCase()
          if (want !== 'dark' && want !== 'light') return fail(`theme: ${argv[0]}: there are two, dark and light`)
          prefs.set('theme', want)
          print(`theme ${want}`, 'note')
        },
      },

      accent: {
        args: '[name]',
        blurb: 'pick a hue',
        run(argv) {
          const current = prefs.get('accent')
          if (!argv.length) {
            for (const [name, a] of Object.entries(ACCENTS)) {
              const here = name === current
              print(`${here ? ' * ' : '   '}${pad(name, 12)}${a.note}`, here ? 'note' : '')
            }
            return
          }
          const want = argv[0].toLowerCase()
          if (!ACCENTS[want]) return fail(`accent: ${argv[0]}: not one of ${Object.keys(ACCENTS).join(', ')}`)
          prefs.set('accent', want)
          print(`accent ${want}`, 'note')
        },
      },

      sound: {
        args: '[on|off]',
        blurb: 'the small synth',
        run(argv) {
          if (!argv.length) return print(`sound ${prefs.get('sound') ? 'on' : 'off'}`, 'note')
          const want = argv[0].toLowerCase()
          if (want !== 'on' && want !== 'off') return fail(`sound: ${argv[0]}: on or off`)
          prefs.set('sound', want === 'on')
          print(`sound ${want}`, 'note')
          if (want === 'on') shell.sfx?.play('open')
        },
      },

      date: {
        blurb: 'the host clock, for what that is worth',
        run() {
          print(
            new Date().toLocaleString(undefined, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
          )
          print('Borrowed from the browser. This machine has no clock of its own.', 'dim')
        },
      },

      whoami: {
        blurb: 'a short answer',
        run() {
          print('one user, unnamed, at the keyboard')
          print('No password was ever set. There is nobody else on this machine to keep out.', 'dim')
        },
      },

      uptime: {
        blurb: 'how long this has been going',
        run() {
          print(`shell up ${elapsed(performance.now() - openedAt)}`, 'note')
          // performance.now() counts from page load, which is the only boot
          // this machine has ever had.
          print(`machine up ${elapsed(performance.now())}, since the page loaded`, 'dim')
        },
      },

      motifs: {
        blurb: 'the shapes the ornament is drawn from',
        run() {
          const names = Object.keys(MOTIFS ?? {})
          if (!names.length) return fail('motifs: the ornament module is not answering')
          const width = names.reduce((m, n) => Math.max(m, n.length), 0) + 3
          for (const name of names) {
            const entry = MOTIFS[name]
            const note = entry && typeof entry === 'object' ? (entry.caption ?? entry.label ?? '') : ''
            print(`  ${pad(name, width)}${note}`)
          }
          print('cd /Wat and open one to see it at size', 'dim')
        },
      },

      run: {
        args: '<name>',
        blurb: 'there is one executable',
        run(argv) {
          const name = argv[0] ?? ''
          if (!name) return fail('run: needs something to run')
          if (REVEAL.test(name)) return startReveal()
          fail(`run: ${name}: not an executable`)
          print('The only executable on this machine is reveal.run.', 'dim')
        },
      },

      exit: {
        blurb: 'close this window',
        run() {
          print('closing', 'dim')
          win.close()
        },
      },
    }

    // --- dispatch ---------------------------------------------------------

    function unknown(name) {
      fail(`lotus: ${name}: command not found`)
      const near = name.length > 1 && Object.keys(COMMANDS).find((c) => c.startsWith(name.slice(0, 2).toLowerCase()))
      print(near ? `Nearest thing here is ${near}. Otherwise, help.` : 'Type help for the list.', 'dim')
    }

    function submit(line) {
      print(`${promptEl.textContent} ${line}`, 'echo')
      const text = line.trim()
      if (!text) return
      if (history[history.length - 1] !== text) history.push(text)
      histAt = history.length
      const argv = tokens(text)
      const name = argv.shift().toLowerCase()
      if (REVEAL.test(name)) return startReveal()
      const cmd = COMMANDS[name]
      if (!cmd) return unknown(name)
      try {
        cmd.run(argv, restOf(text))
      } catch (err) {
        console.error('command failed', err)
        fail(`${name}: the command threw. The browser console has the rest.`)
      }
    }

    // --- completion -------------------------------------------------------

    const completeCommand = (word) =>
      [...Object.keys(COMMANDS), 'reveal.run']
        .filter((name) => name.startsWith(word.toLowerCase()))
        .map((name) => ({ text: name, label: name }))

    function completePath(word) {
      const cut = word.lastIndexOf('/')
      const dirText = cut < 0 ? '' : word.slice(0, cut + 1)
      const partial = word.slice(cut + 1).toLowerCase()
      const dir = resolve(byPath, cwd, cut < 0 ? '.' : dirText === '/' ? '/' : dirText.slice(0, -1) || '/')
      if (!isContainer(dir)) return []
      return childrenOf(dir)
        .filter((child) => child.name.toLowerCase().startsWith(partial))
        .map((child) => {
          const label = `${child.name}${isContainer(child) ? '/' : ''}`
          return { text: `${dirText}${label}`, label }
        })
    }

    function complete() {
      const at = input.selectionStart ?? input.value.length
      const head = input.value.slice(0, at)
      const tail = input.value.slice(at)
      const word = head.match(/(\S*)$/)[1]
      const before = head.slice(0, head.length - word.length)
      const candidates = before.trim() === '' ? completeCommand(word) : completePath(word)
      if (!candidates.length) return

      const setWord = (next) => {
        input.value = before + next + tail
        const caret = (before + next).length
        input.setSelectionRange(caret, caret)
      }

      const texts = candidates.map((c) => c.text)
      const filled = commonPrefix(texts)
      // A folder gets no trailing space: the next thing typed is another name.
      if (texts.length === 1) setWord(texts[0].endsWith('/') ? texts[0] : `${texts[0]} `)
      else if (filled.length > word.length) setWord(filled)
      else printAll(columnize(candidates.map((c) => c.label), columns()), 'dim')
    }

    // --- keys -------------------------------------------------------------

    input.addEventListener('keydown', (ev) => {
      // Modifiers and arrows are not typing. A click for every one of them
      // turns the synth into a rattle.
      if (!ev.ctrlKey && !ev.metaKey && !ev.altKey && (ev.key.length === 1 || ev.key === 'Backspace' || ev.key === 'Enter')) {
        shell.sfx?.play('key')
      }

      if (ev.key === 'Enter') {
        ev.preventDefault()
        const line = input.value
        input.value = ''
        draft = ''
        submit(line)
        toBottom()
        return
      }

      if (ev.key === 'Tab') {
        ev.preventDefault()
        complete()
        toBottom()
        return
      }

      if (ev.key === 'ArrowUp' || ev.key === 'ArrowDown') {
        if (!history.length) return
        ev.preventDefault()
        if (histAt === history.length) draft = input.value
        histAt = clamp(histAt + (ev.key === 'ArrowUp' ? -1 : 1), 0, history.length)
        input.value = histAt === history.length ? draft : history[histAt]
        const end = input.value.length
        input.setSelectionRange(end, end)
        return
      }

      if (ev.ctrlKey && (ev.key === 'c' || ev.key === 'C')) {
        // With something selected, ctrl-c is a copy and nothing else. Only an
        // idle caret means the user wants out of the line they are typing.
        const sel = document.getSelection?.()
        if (input.selectionStart !== input.selectionEnd || (sel && !sel.isCollapsed)) return
        ev.preventDefault()
        print(`${promptEl.textContent} ${input.value}^C`, 'echo')
        input.value = ''
        draft = ''
        histAt = history.length
        toBottom()
        return
      }

      if (ev.ctrlKey && (ev.key === 'l' || ev.key === 'L')) {
        ev.preventDefault()
        COMMANDS.clear.run()
      }
    })

    // Clicking anywhere in the log puts the caret back on the line — unless a
    // selection was just made, which focusing would throw away.
    term.addEventListener('mouseup', (ev) => {
      if (ev.target === input) return
      const sel = document.getSelection?.()
      if (sel && !sel.isCollapsed) return
      input.focus()
    })

    // --- banner -----------------------------------------------------------

    print(`lotus shell · ${BUILD}`, 'note')
    print('help lists the commands. Tab completes, the up arrow remembers.', 'dim')
    print('There is one executable: type run reveal when you want to know where this screen is.', 'dim')

    paintPrompt()
    input.focus()
    toBottom()
  },
}
