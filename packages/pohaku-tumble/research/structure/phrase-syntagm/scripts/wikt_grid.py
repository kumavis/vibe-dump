"""Squares and columns inside Wiktionary's own two-word units (dictionary-attested
phrase frame): {h1,h2} x {m1,m2} all four listed as Wiktionary headwords.
Also 'rows' (one head, >=3 modifiers) and 'columns' (one modifier, >=2 heads)."""
import collections, itertools, os
import lex
W, Wd = lex.wikt()
units = set()
for w in list(W) + list(Wd):
    t = w.split()
    if len(t) == 2:
        units.add((t[0], t[1]))
H = collections.defaultdict(set); M = collections.defaultdict(set)
for h, m in units:
    H[h].add(m); M[m].add(h)
sq = []
for h1, h2 in itertools.combinations(sorted(H), 2):
    for m1, m2 in itertools.combinations(sorted(H[h1] & H[h2]), 2):
        sq.append((h1, h2, m1, m2))
print('Wiktionary 2-word units (headwords + derived/related forms):', len(units))
print('squares:', len(sq))
for s in sq:
    print('  ', s)
print('columns (modifier with >=2 heads):')
for m, hs in sorted(M.items(), key=lambda x: -len(x[1])):
    if len(hs) >= 2:
        print('  ', m, sorted(hs))
print('rows (head with >=3 modifiers):')
for h, ms in sorted(H.items(), key=lambda x: -len(x[1])):
    if len(ms) >= 3:
        print('  ', h, sorted(ms))
