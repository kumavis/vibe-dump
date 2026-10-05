"""Squares (a1b1, a1b2, a2b1, a2b2 all present) in the compound tiers, listed with glosses for a
hand check of proportionality (same test the phrase study applied to 40 phrase squares).
Writes tables/compound_squares.tsv."""
import json, csv, itertools
from collections import defaultdict
ROOT = '(scratch)/structure'
RR = 'roots'
G = {r['word']: (r['wiktionary_gloss'] or r['andrews_definition'])[:70] for r in csv.DictReader(open(f'{RR}/compounds.tsv'), delimiter='\t')}
rows = []
for tier in ('comp_WA', 'comp_corpus', 'comp_WA_or_corpus'):
    L = json.load(open(f'{ROOT}/synthesis/sim/lex/{tier}.json'))
    W = {tuple(x['parts']): x['word'] for x in L}
    S = defaultdict(set)
    for a, b in W: S[a].add(b)
    sq = []
    for a1, a2 in itertools.combinations(sorted(S), 2):
        for b1, b2 in itertools.combinations(sorted(S[a1] & S[a2]), 2):
            sq.append((a1, a2, b1, b2))
    print(tier, 'words', len(W), 'squares', len(sq))
    if tier == 'comp_WA_or_corpus':
        for a1, a2, b1, b2 in sq:
            ws = [W[(a1, b1)], W[(a1, b2)], W[(a2, b1)], W[(a2, b2)]]
            rows.append([a1, a2, b1, b2] + [f'{w} = {G.get(w, "")}' for w in ws])
with open(f'{ROOT}/synthesis/tables/compound_squares.tsv', 'w') as f:
    f.write('a1\ta2\tb1\tb2\ta1b1\ta1b2\ta2b1\ta2b2\n')
    for r in rows: f.write('\t'.join(r) + '\n')
for r in rows: print(' | '.join(r))
