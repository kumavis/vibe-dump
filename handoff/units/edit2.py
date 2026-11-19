import os
os.chdir('/home/user/vibe-dump-wt/units/packages/tails-and-scales')
def ed(f, pairs):
    s = open(f).read()
    for o, n, c in pairs:
        k = s.count(o)
        assert k == c, (f, o[:80], k)
        s = s.replace(o, n)
    open(f, 'w').write(s)
# lib.mjs helper
ed('sim/lib.mjs', [("export const hashLines = (lines) => lines.map(h10).join(' ')\n",
"""export const hashLines = (lines) => lines.map(h10).join(' ')

// (the units rename, DESIGN's Units section) A length as the code's copy
// words it, as pattern source for a check: `word` the word after a number
// (" tail" or " tails", core/rules.js LENGTH's), `mark` the short mark
// ("t"). Code from before LENGTH wrote both as the inch mark.
const reEsc = (s) => s.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')
export const lengthWords = (L) => (L ? { word: ` (?:${reEsc(L.one)}|${reEsc(L.many)})`, mark: reEsc(L.mark) } : { word: '"', mark: '"' })
""", 1)])
# present-check
ed('sim/present-check.mjs', [
("    const order = eventOrder((id) => ts.G.units.find((u) => u.id === id), LADDER_MUL, hypot)\n",
 "    // ((the units rename) and how its copy words a length: LENGTH's)\n    const { LENGTH } = await import(pathToFileURL(join(dir, 'core', 'rules.js')).href).catch(() => ({}))\n    const order = eventOrder((id) => ts.G.units.find((u) => u.id === id), LADDER_MUL, hypot, lengthWords(LENGTH))\n", 1),
("function eventOrder(unitOf, ladderMul = 2, hypot = Math.hypot) {\n", "function eventOrder(unitOf, ladderMul = 2, hypot = Math.hypot, len = lengthWords(null)) {\n  // ((the units rename) the charge's row and the move and advance lines, as\n  // the code under test words a length)\n  const chargeRow = new RegExp(`^Charge \\\\d+${len.mark} \\\\(2D6\\\\)$`)\n  const moveLine = new RegExp(`^<b>([^<]*)</b> (move|advance|fall back) (\\\\d+\\\\.\\\\d)${len.word}\\\\.$`)\n  const advLine = new RegExp(`^<b>([^<]*)</b> advance: \\\\+(\\\\d)${len.word}\\\\.$`)\n", 1),
("/^Charge \\d+\" \\(2D6\\)$/.test(rl.label)", "chargeRow.test(rl.label)", 1),
("const m = /^<b>([^<]*)<\\/b> (move|advance|fall back) (\\d+\\.\\d)\"\\.$/.exec(e.html)", "const m = moveLine.exec(e.html)", 1),
("const adv = /^<b>([^<]*)<\\/b> advance: \\+(\\d)\"\\.$/.exec(e.html)", "const adv = advLine.exec(e.html)", 1),
])
# property
ed('sim/property.mjs', [
("!/^Charge \\d+\" rolled again \\(2D6\\)$/.test(b.rows[1].label)", "!new RegExp(`^Charge \\\\d+${lengthWords(mods.rules.LENGTH).mark} rolled again \\\\(2D6\\\\)$`).test(b.rows[1].label)", 1),
("why: `out of range (${range.toFixed(1)}\\\" / ${w.range}\\\")` }\\n    return { ok: true, range, reach: w.range, ally: true }\\n\"",
 "why: `out of range (${range.toFixed(1)} / ${tails(w.range)})` }\\n    return { ok: true, range, reach: w.range, ally: true }\\n\"", 1),
("return `${u.t.short}'s bases are too large for the ${v.t.short} (${u.t.base}\\\" over its ${tr.maxBase}\\\")`\\n\", ''],",
 "return `${u.t.short}'s bases are too large for the ${v.t.short}`\\n\", ''],", 1),
("import { loadCorpus, select, verdict, pool, CPUS, copyCode, h10 } from './lib.mjs'", "import { loadCorpus, select, verdict, pool, CPUS, copyCode, h10, lengthWords } from './lib.mjs'", 1),
])
# hud-check
ed('sim/hud-check.mjs', [
("import { PKG } from './oracle/pin.mjs'\n", "import { PKG } from './oracle/pin.mjs'\nimport { lengthWords } from './lib.mjs'\n// (the units rename) how the build words a length: the working tree's LENGTH\nconst { LENGTH, tails } = await import(pathToFileURL(`${PKG}/core/rules.js`).href)\nconst LEN = lengthWords(LENGTH)\n", 1),
("t.text.match(/(\\d+\\.\\d)\" of (\\d+)\" \\((\\d+\\.\\d)\" climbing\\)/)", "t.text.match(new RegExp(`(\\\\d+\\\\.\\\\d)${LEN.mark} of (\\\\d+)${LEN.mark} \\\\((\\\\d+\\\\.\\\\d)${LEN.mark} climbing\\\\)`))", 1),
("got.hint.startsWith(`Charge! Rolled ${want.rolled}\"`)", "got.hint.startsWith(`Charge! Rolled ${tails(want.rolled)}`)", 1),
])
# input-check
ed('sim/input-check.mjs', [
("import { PKG } from './oracle/pin.mjs'\n", "import { PKG } from './oracle/pin.mjs'\nimport { lengthWords } from './lib.mjs'\n// (the units rename) how the build words a length: the working tree's LENGTH\nconst { LENGTH, tl } = await import(pathToFileURL(`${PKG}/core/rules.js`).href)\nconst LEN = lengthWords(LENGTH)\n", 1),
("if (!/^⤒ Board War-Cart · \\d+\\.\\d\" of \\d+\"$/.test(tip))", "if (!new RegExp(`^⤒ Board War-Cart · \\\\d+\\\\.\\\\d${LEN.mark} of \\\\d+${LEN.mark}$`).test(tip))", 1),
("not \"⤒ Board War-Cart · 4.2\" of 7\"\"`)", "not \"⤒ Board War-Cart · ${tl('4.2')} of ${tl(7)}\"`)", 1),
("!/\" of /.test(seen.tip)", "!new RegExp(`\\\\d${LEN.mark} of `).test(seen.tip)", 2),
("const want = `${tg.range.toFixed(1)}\" / ${tg.reach === Math.round(tg.reach) ? tg.reach : tg.reach.toFixed(1)}\"`", "const want = `${tl(tg.range.toFixed(1))} / ${tl(tg.reach === Math.round(tg.reach) ? tg.reach : tg.reach.toFixed(1))}`", 2),
])
# play-check
ed('sim/play-check.mjs', [
("import { PKG } from './oracle/pin.mjs'\n", "import { PKG } from './oracle/pin.mjs'\nimport { lengthWords } from './lib.mjs'\nimport { pathToFileURL } from 'node:url'\n// (the units rename) how the build words a length: the working tree's LENGTH\nconst LEN = lengthWords((await import(pathToFileURL(`${PKG}/core/rules.js`).href)).LENGTH)\n", 1),
("if (/\"\\s*of/.test(await tooltip()))", "if (new RegExp(`\\\\d${LEN.mark}\\\\s*of`).test(await tooltip()))", 1),
])
# fog-check fixtures
ed('sim/fog-check.mjs', [
("html: '<b>Brute</b> move 5.7\".'", "html: '<b>Brute</b> move 5.7 tails.'", 1),
("label: 'Charge 6\" (2D6)'", "label: 'Charge 6t (2D6)'", 1),
("html: '<b>Brute</b> advance: +3\".'", "html: '<b>Brute</b> advance: +3 tails.'", 1),
])
