#!/usr/bin/env python3
"""Cross-check: minimal pairs over the POLLEX Hawaiian reflexes (spellings are
Pukui & Elbert 1986's for 98% of rows).  Population: distinct single-word forms
spelled with native letters.  Relatedness: shared POLLEX etymon id (same
reconstruction), or >=1 shared gloss stem (Hawaiian glosses from POLLEX).
Baseline: matched random pairs (same lengths), 300 reps.
"""
import json, os, sys, random, collections
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from minpairs import find_pairs, family
from semantics import tokens
from lex import norm, segments
random.seed(7)
HERE = os.path.dirname(os.path.abspath(__file__))
px = json.load(open('roots/.cache/pollex/hawaiian-reflexes.json'))
ids = collections.defaultdict(set); gl = collections.defaultdict(set)
for r in px:
    for f in (r.get('haw_forms') or [r['haw']]):
        f = norm(f)
        if ' ' in f or segments(f) is None or not f:
            continue
        ids[f].add(r['pollex_id'])
        gl[f] |= set(tokens(r['haw_gloss']))
forms = sorted(ids)
segs = {f: segments(f) for f in forms}
pairs = find_pairs(forms, segs)
pairset = set(pairs)
bylen = collections.defaultdict(list)
for f in forms:
    bylen[len(segs[f])].append(f)


def rel(a, b):
    return bool(ids[a] & ids[b]), bool(gl[a] & gl[b])


def rate(pl):
    rs = [rel(a, b) for a, b in pl]
    n = len(rs) or 1
    return sum(r[0] for r in rs) / n, sum(r[1] for r in rs) / n


def matched(pl):
    out = []
    for a, b in pl:
        for _ in range(50):
            a2 = random.choice(bylen[len(segs[a])]); b2 = random.choice(bylen[len(segs[b])])
            if a2 != b2 and tuple(sorted([a2, b2])) not in pairset:
                out.append((a2, b2)); break
    return out


fam = collections.defaultdict(list)
for p, (kind, cls, i) in pairs.items():
    fam[family(cls)].append(p)
res = {'forms': len(forms), 'pairs': len(pairs), 'families': {}}
print(f'POLLEX distinct native single-word forms: {len(forms)}; minimal pairs: {len(pairs)}')
print('| opposition family | pairs | same POLLEX etymon | matched random | share gloss stem | matched random | p(gloss) |')
print('|---|---|---|---|---|---|---|')
for k, pl in sorted(list(fam.items()) + [('ALL', list(pairs))], key=lambda x: -len(x[1])):
    e, g = rate(pl)
    be, bg = [], []
    for _ in range(300):
        x, y = rate(matched(pl)); be.append(x); bg.append(y)
    p = (sum(1 for v in bg if v >= g) + 1) / 301
    res['families'][k] = {'n': len(pl), 'same_etymon': e, 'same_etymon_base': sum(be) / 300, 'gloss': g, 'gloss_base': sum(bg) / 300, 'p_gloss': p}
    print(f'| {k} | {len(pl)} | {100*e:.1f}% | {100*sum(be)/300:.1f}% | {100*g:.1f}% | {100*sum(bg)/300:.1f}% | {p:.3f} |')
same = [(a, b, pairs[(a, b)][1], sorted(ids[a] & ids[b])) for a, b in pairs if ids[a] & ids[b]]
res['same_etymon_pairs'] = same
print('pairs sharing a POLLEX etymon:')
for x in same:
    print('  ', x)
# overlap with the Wiktionary count per opposition
json.dump(res, open(os.path.join(HERE, 'pollex_mp.json'), 'w'), ensure_ascii=False, indent=1)
with open(os.path.join(HERE, 'pollex_minpairs.tsv'), 'w') as fh:
    fh.write('a\tb\topposition\tfamily\tsame_etymon\tgloss_overlap\n')
    for (a, b), (kind, cls, i) in sorted(pairs.items(), key=lambda x: (family(x[1][1]), x[1][1])):
        e, g = rel(a, b)
        fh.write(f'{a}\t{b}\t{cls}\t{family(cls)}\t{int(e)}\t{int(g)}\n')
