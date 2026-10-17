"""Base x process matrix: how many bases carry several attested derivations, and how many proportional squares
X : hoʻo-X :: XX : hoʻo-XX (two processes crossed) exist. Done on (a) the marked lexicon (Wiktionary ∪ POLLEX) and
(b) Andrews 1922 headwords (unmarked spelling; ʻokina/length collapsed, so an upper bound)."""
import csv, re
from collections import Counter, defaultdict
from common import *

lex = lexicon()
A = set(load_andrews())

def hoo(x):
    """surface hoʻo- form(s) of base x by the allomorphy rule measured in allomorphy.py"""
    if x[0] == OK: return {'hō' + x, 'hoʻo' + x}
    if x[0] in 'aeo': return {'hoʻ' + SHORT2LONG[x[0]] + x[1:]}
    if x[0] in LONG: return {'hōʻ' + x}
    return {'hoʻo' + x}
def red(x):
    s = syllables(x)
    out = {x + x}
    if len(s) >= 3: out.add(x + ''.join(s[-2:]))
    out.add(s[0] + x)
    return out
def na(x): return {x + 'na', shorten(x) + 'na'}

procs = {'hoʻo-': hoo, 'RED': red, '-na': na}
fam = {}
for x in lex:
    if len(syllables(x)) < 2 and not any(c in LONG for c in x): continue
    if not is_haw(x) or len(x) < 2: continue
    cells = {p: sorted(f(x) & set(lex)) for p, f in procs.items()}
    cells['hoʻo-+RED'] = sorted({h for r in red(x) for h in hoo(r)} & set(lex))
    fam[x] = cells
n_by = Counter(sum(1 for v in c.values() if v) for c in fam.values())
print('(a) marked lexicon: bases by number of attested processes (of hoʻo-, RED, -na, hoʻo-+RED):', dict(sorted(n_by.items())))
sq = [x for x, c in fam.items() if c['hoʻo-'] and c['RED'] and c['hoʻo-+RED']]
print('   squares X : hoʻo-X :: XX : hoʻo-XX:', len(sq), sq[:30])
tri = [x for x, c in fam.items() if c['hoʻo-'] and c['RED'] and c['-na']]
print('   bases with hoʻo-, RED and -na all attested:', len(tri), tri)
# note: formal; spurious RED/-na matches possible (see codes)
# (b) Andrews unmarked
def u(s): return strip_marks(s)
famA = {}
for x in A:
    if len(x) < 2 or not re.fullmatch(r'[aeiouhklmnpw]+', x): continue
    h = 'hoo' + x; r = x + x
    famA[x] = (h in A, r in A, ('hoo' + r) in A, (x + 'na') in A)
print('(b) Andrews headwords as bases:', len(famA))
print('   with hoo-X headword:', sum(v[0] for v in famA.values()), ' with XX headword:', sum(v[1] for v in famA.values()))
print('   squares X : hooX :: XX : hooXX:', sum(v[0] and v[1] and v[2] for v in famA.values()))
print('   X : hooX and X : XX both (hoo × RED cross available):', sum(v[0] and v[1] for v in famA.values()))
print('   X : X-na:', sum(v[3] for v in famA.values()))
