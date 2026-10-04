#!/usr/bin/env python3
"""Minimal pairs inside the closed grammatical paradigms (possessive, pronoun,
demonstrative grids), and among all Wiktionary function words.  For the grids,
each cell carries its paradigm coordinates; a minimal pair is 'proportional'
when the two cells differ in exactly one paradigm dimension."""
import json, os, sys, collections, itertools
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from minpairs import find_pairs, family
from lex import segments
HERE = os.path.dirname(os.path.abspath(__file__))
lex = json.load(open(os.path.join(HERE, 'lexicon.json')))
cells = {}
for C, cl in [('', 'Ø'), ('k', 'k'), ('n', 'n')]:
    for V in ['a', 'o']:
        for P, suf in [('1sg', 'ʻu'), ('2sg', 'u'), ('3sg', 'na')]:
            vv = 'ā' if (V == 'a' and P != '1sg') else V
            cells[C + vv + suf] = ('poss', cl, V + '-class', P)
cells['kuʻu'] = ('poss', 'k', 'neutral', '1sg')
for f, (p, n) in {'kāua': ('1incl', 'du'), 'māua': ('1excl', 'du'), 'ʻolua': ('2', 'du'), 'lāua': ('3', 'du'),
                  'kākou': ('1incl', 'pl'), 'mākou': ('1excl', 'pl'), 'ʻoukou': ('2', 'pl'), 'lākou': ('3', 'pl')}.items():
    cells[f] = ('pron', p, n, '')
for f, (s, d) in {'kēia': ('kē', 'prox'), 'kēnā': ('kē', 'addr'), 'kēlā': ('kē', 'dist'), 'penei': ('pē', 'prox'),
                  'pēnā': ('pē', 'addr'), 'pēlā': ('pē', 'dist'), 'nei': ('post', 'prox'), 'nā': ('post', 'addr'), 'lā': ('post', 'dist')}.items():
    cells[f] = ('dem', s, d, '')
forms = sorted(cells)
segs = {f: segments(f) for f in forms}
pairs = find_pairs(forms, segs)
prop = []
other = []
for (a, b), (kind, cls, i) in sorted(pairs.items()):
    ca, cb = cells[a], cells[b]
    ndiff = sum(1 for x, y in zip(ca, cb) if x != y)
    row = (a, b, cls, ca, cb)
    (prop if ca[0] == cb[0] and ndiff == 1 else other).append(row)
print(f'grid forms {len(forms)}; minimal pairs inside grids {len(pairs)}; differing in exactly one paradigm dimension {len(prop)}')
for r in prop:
    print('  P', r[0], '/', r[1], r[2], '|', r[3][1:], '->', r[4][1:])
for r in other:
    print('  x', r[0], '/', r[1], r[2], '|', r[3], '->', r[4])
# all function words
FUNC = {'pron', 'det', 'prep', 'particle', 'article', 'conj'}
fw = sorted(w for w, r in lex.items() if r['native'] and any(e['pos'] in FUNC for e in r['entries']) and segments(w))
fp = find_pairs(fw, {w: segments(w) for w in fw})
print(f'Wiktionary function-word forms {len(fw)}; minimal pairs among them {len(fp)}')
inside = sum(1 for a, b in fp if a in cells and b in cells)
print('  of which both members are grid cells:', inside)
for (a, b), v in sorted(fp.items()):
    print('   ', a, b, v[1], '(grid)' if a in cells and b in cells else '')
