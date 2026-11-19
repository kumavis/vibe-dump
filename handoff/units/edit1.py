import os, re, sys
os.chdir('/home/user/vibe-dump-wt/units/packages/tails-and-scales')
def rel(f):
    depth = f.count('/')
    return ('./' if f.startswith('core/') and depth == 1 else '../' * (depth - (1 if f.startswith('core/') else 0))) + ('rules.js' if f.startswith('core/') else 'core/rules.js')
def add_import(s, f, names):
    path = rel(f)
    m = re.search(r"^import \{([^}]*)\} from '" + re.escape(path) + "'", s, re.M)
    if m:
        have = [x.strip() for x in m.group(1).split(',') if x.strip()]
        add = [n for n in names if n not in have]
        if not add: return s
        return s[:m.start(1)] + ' ' + ', '.join(have + add) + ' ' + s[m.end(1):]
    m = re.search(r"^import ", s, re.M) or re.search(r"^(?!//)(?!\s*$)", s, re.M)
    line = f"import {{ {', '.join(names)} }} from '{path}'\n"
    return s[:m.start()] + line + s[m.start():]
EDITS = {}
def E(f, old, new, n=1, imp=()):
    EDITS.setdefault(f, []).append((old, new, n, imp))

# core
E('core/actions/move.js', "${L.toFixed(1)}\".`)", "${tails(L.toFixed(1))}.`)", 2, ['tails', 'tl'])
E('core/actions/move.js', "note: `+${r[0]}\"` })", "note: `+${tl(r[0])}` })")
E('core/actions/move.js', "advance: +${r[0]}\".`)", "advance: +${tails(r[0])}.`)")
E('core/actions/charge.js', "label: `Charge ${plan.need}\" (2D6)`", "label: `Charge ${tl(plan.need)} (2D6)`", 1, ['tl'])
E('core/actions/charge.js', "label: `Charge ${plan.need}\" rolled again (2D6)`", "label: `Charge ${tl(plan.need)} rolled again (2D6)`")
E('core/actions/shoot.js', "note: `${sc}\"` })", "note: tl(sc) })", 1, ['tl', 'tails'])
E('core/actions/shoot.js', "`out of range (${range.toFixed(1)}\" / ${w.range}\")`", "`out of range (${range.toFixed(1)} / ${tails(w.range)})`")
E('core/actions/shoot.js', "`out of range (${range.toFixed(1)}\" / ${reach === w.range ? w.range : reach.toFixed(1)}\")`", "`out of range (${range.toFixed(1)} / ${tails(reach === w.range ? w.range : reach.toFixed(1))})`")
E('core/actions/transport.js', "`${u.t.short}'s bases are too large for the ${v.t.short} (${u.t.base}\" over its ${tr.maxBase}\")`", "`${u.t.short}'s bases are too large for the ${v.t.short}`")
E('core/actions/transport.js', "(${L.toFixed(1)}\").`)", "(${tails(L.toFixed(1))}).`)", 1, ['tails'])
E('core/commands.js', "(rolled ${P.rolled}\")`", "(rolled ${tails(P.rolled)})`", 2, ['tails'])
E('core/nav.js', "`hullReach: the footprint's offsets are in ${fp.cell}\" cells, the grid's ${this.cell}\"`", "`hullReach: the footprint's offsets are in cells of ${tails(fp.cell)}, the grid's of ${tails(this.cell)}`", 1, ['tails'])
# data
E('data/races/squirrel.js', "'Blast — lobs 2 templates; a miss scatters D6+1\".'", "`Blast — lobs 2 templates; a miss scatters ${tails('D6+1')}.`", 1, ['tails'])
E('data/races/squirrel.js', "`Grey whiskers — friends within ${AURA}\" use his Ld 9.`", "`Grey whiskers — friends within ${tails(AURA)} use his Ld 9.`")
E('data/races/serpent.js', "`Coiled will — friends within ${AURA}\" use her Ld 9.`", "`Coiled will — friends within ${tails(AURA)} use her Ld 9.`", 1, ['tails'])
E('data/races/serpent.js', "they step off at its head or tail.", "they step off at either end.")
E('data/mission.js', "not two even whole numbers of inches`", "not two even whole numbers of tails`")
E('data/mission.js', "`a zone ${m.deploy}\" deep leaves under 6\" to the centre line of a board ${W}\" wide`", "`a zone ${tails(m.deploy)} deep leaves under ${tails(6)} to the centre line of a board ${tails(W)} wide`", 1, ['tails'])
E('data/mission.js', "`${at} is less than 1\" inside the board`", "`${at} is less than ${tails(1)} inside the board`")
E('data/schema.js', "snaps ${figures.snap[h][q].toFixed(3)}\" from its exact place: at most ${FP.snap}\" at every heading`", "snaps ${tails(figures.snap[h][q].toFixed(3))} from its exact place: at most ${tails(String(FP.snap))} at every heading`", 1, ['tails'])
E('data/schema.js', "stand ${figures.connected[h][q].toFixed(3)}\" apart:", "stand ${tails(figures.connected[h][q].toFixed(3))} apart:")
E('data/schema.js', "pivot gap is ${g.toFixed(3)}\": at most ${FP.pivot}\" (the point", "pivot gap is ${tails(g.toFixed(3))}: at most ${tails(String(FP.pivot))} (the point")
E('data/schema.js', "bounding R is ${fp.R.toFixed(3)}\": at most ${FP.R}\"`", "bounding R is ${tails(fp.R.toFixed(3))}: at most ${tails(String(FP.R))}`")
E('data/schema.js', "turn is the inches a 45° pivot costs,", "turn is the tails a 45° pivot costs,")
E('data/schema.js', "costs per inch of a step forward, a number", "costs per tail of a step forward, a number")
# present
E('present/conditions.js', "const inches = (n) => `${+(+n).toFixed(1)}\"`\n", "", 1, ['tails'])
E('present/conditions.js', "`An enemy is within 1\": it can't", "`An enemy is within ${tails(1)}: it can't")
E('present/conditions.js', "`${inches(c.advRoll)} farther (its D6)` : 'a D6\" farther'", "`${tails(c.advRoll)} farther (its D6)` : `${tails('D6')} farther`")
E('present/conditions.js', "`${c.title}, ${inches(ctx.y)} up`", "`${c.title}, ${tails(ctx.y)} up`")
E('present/conditions.js', "`${c.title} +${ctx.advRoll}\"`", "`${c.title} +${tails(ctx.advRoll)}`")
E('present/conditions.js', "`advanced +${f.advRoll}\"`", "`advanced +${tails(f.advRoll)}`")
E('present/hud-model.js', "'Advance (+D6\") — can still charge' : `Advance (+D6\") — no", "`Advance (+${tails('D6')}) — can still charge` : `Advance (+${tails('D6')}) — no", 1, ['tails'])
E('present/hud-model.js', "`Charge! Rolled ${pk.rolled}\" — click", "`Charge! Rolled ${tails(pk.rolled)} — click")
E('present/hud-model.js', "click a friend within ${w.range}\" (or", "click a friend within ${tails(w.range)} (or")
E('present/hud-model.js', "'Click an enemy within 12\" to declare a charge, then roll 2D6.'", "`Click an enemy within ${tails(CHARGE_RANGE)} to declare a charge, then roll 2D6.`", 1, ['CHARGE_RANGE'])
E('present/hud-model.js', "`a ${w.blast}\" template under the enemy,", "`a template of ${tails(w.blast)} under the enemy,")
# input
E('input/human.js', "· ${board.L.toFixed(1)}\" of ${board.max}\"`", "· ${tl(board.L.toFixed(1))} of ${tl(board.max)}`", 1, ['tl'])
E('input/human.js', "`End charge here · ${pk.plan.res.dist[i].toFixed(1)}\" of ${pk.rolled}\"`", "`End charge here · ${tl(pk.plan.res.dist[i].toFixed(1))} of ${tl(pk.rolled)}`")
E('input/tools/charge.js', "(${q.gap(sel, target).toFixed(1)}\")`", "(${tl(q.gap(sel, target).toFixed(1))})`", 1, ['tl'])
E('input/tools/charge.js', "`Charge: need ${p.need}\" on 2D6", "`Charge: need ${tl(p.need)} on 2D6")
E('input/tools/move.js', "`${plan.res.dist[i].toFixed(1)}\" of ${plan.max}\"${up > 0 ? ` (${up.toFixed(1)}\" climbing)` : ''}", "`${tl(plan.res.dist[i].toFixed(1))} of ${tl(plan.max)}${up > 0 ? ` (${tl(up.toFixed(1))} climbing)` : ''}", 1, ['tl'])
E('input/tools/move.js', "c.turn > 0 && `${c.turn.toFixed(1)}\" turning`, c.back > 0 && `${c.back.toFixed(1)}\" backing`", "c.turn > 0 && `${tl(c.turn.toFixed(1))} turning`, c.back > 0 && `${tl(c.back.toFixed(1))} backing`")
E('input/tools/move.js', "return `${c.L.toFixed(1)}\" of ${max}\"${parts", "return `${tl(c.L.toFixed(1))} of ${tl(max)}${parts")
# ui
E('ui/card.js', "(k === 'M' ? `${t.M}\"` :", "(k === 'M' ? tl(t.M) :", 1, ['tl'])
E('ui/card.js', "· ${w.range}\" ·", "· ${tl(w.range)} ·", 4)
E('ui/card.js', "bits.push(`${w.range}\"`)", "bits.push(tl(w.range))")
E('ui/card.js', "bits.push(`blast ${w.blast}\" ×${w.shots}`)", "bits.push(`blast ${tl(w.blast)} ×${w.shots}`)")
E('ui/card.js', "▲ high ground, ${+y.toFixed(1)}\" up", "▲ high ground, ${tl(+y.toFixed(1))} up")
E('ui/tooltip.js', "<br>${info.range.toFixed(1)}\" / ${w.range}\"`", "<br>${tl(info.range.toFixed(1))} / ${tl(w.range)}`", 2, ['tl'])
E('ui/tooltip.js', "(${w.blast}\")` : 'shots'", "(${tl(w.blast)})` : 'shots'")
E('ui/tooltip.js', "` (${w.range}\", lobbed down)` : reach < w.range ? ` (${w.range}\", lobbed up)`", "` (${tl(w.range)}, lobbed down)` : reach < w.range ? ` (${tl(w.range)}, lobbed up)`")
E('ui/tooltip.js', "flags.push(`${info.range.toFixed(1)}\" / ${reach === w.range ? w.range : reach.toFixed(1)}\"${lob}`)", "flags.push(`${tl(info.range.toFixed(1))} / ${tl(reach === w.range ? w.range : reach.toFixed(1))}${lob}`)")
E('ui/actions.js', "(${x.pct}%) · ${x.range}\" · ${x.what}", "(${x.pct}%) · ${tl(x.range)} · ${x.what}", 1, ['tl'])
E('ui/actions.js', "· ${x.pct}% · ${x.range}\"</small>", "· ${x.pct}% · ${tl(x.range)}</small>")
E('ui/groupbar.js', "'Each member advances first (a D6 more inches; most can\\'t shoot or charge after): on' : 'Advance first: each member rolls a D6 more inches (most can\\'t shoot or charge after)'", "`Each member advances first (${tails('D6')} more; most can't shoot or charge after): on` : `Advance first: each member rolls ${tails('D6')} more (most can't shoot or charge after)`", 1, ['tails'])
# view
E('view/overlay.js', "${+(2 * c.link.h).toFixed(1)}\"` })", "${tl(+(2 * c.link.h).toFixed(1))}` })", 1, ['tl'])
E('view/units.js', "<i>${v.labelY}\"</i>", "<i>${tl(v.labelY)}</i>", 1, ['tl'])
E('view/effects/shots.js', "`scatter ${e.d}\"`", "`scatter ${tl(e.d)}`", 1, ['tl'])
E('view/terrain.js', "up to ${worst.toFixed(4)}\" from its own mesh", "up to ${tails(worst.toFixed(4))} from its own mesh", 1, ['tails'])

bad = 0
for f, edits in EDITS.items():
    s = open(f).read()
    imps = []
    for old, new, n, imp in edits:
        c = s.count(old)
        if c != n:
            print(f'MISS {f}: {c} != {n}: {old[:80]}'); bad += 1; continue
        s = s.replace(old, new)
        imps += [i for i in imp if i not in imps]
    if imps: s = add_import(s, f, imps)
    open(f, 'w').write(s)
print('bad', bad)
