"""The proper-name column: modifiers capitalised in most of their DET-frame uses
(ethnonyms / place names: ʻōlelo Hawaiʻi, poʻe ʻAmelika ...).  Which heads take them,
and how many squares do they form?  Writes ../tables/names_grid.tsv"""
import csv, os, collections, itertools
HERE = os.path.dirname(os.path.abspath(__file__))
rows = list(csv.DictReader(open(os.path.join(HERE, '..', 'tables', 'colloc_all.tsv')), delimiter='\t'))
S = collections.defaultdict(set); F = {}
for r in rows:
    f, cap = int(r['f']), int(r['cap'])
    if cap * 2 > f and f >= 1:
        S[r['mod']].add(r['head']); F[(r['head'], r['mod'])] = f
shared = {m: hs for m, hs in S.items() if len(hs) >= 2}
heads = collections.Counter(h for hs in shared.values() for h in hs)
print('name-modifiers taken by >=2 heads:', len(shared))
print('heads taking them:', heads.most_common(15))
for m, hs in sorted(shared.items(), key=lambda x: -len(x[1]))[:25]:
    print(' ', m, sorted(hs), [F[(h, m)] for h in sorted(hs)])
H = collections.defaultdict(set)
for m, hs in S.items():
    for h in hs:
        H[h].add(m)
sq = sum(len(list(itertools.combinations(sorted(H[a] & H[b]), 2))) for a, b in itertools.combinations(sorted(H), 2))
print('squares among name-modifier pairs (any freq):', sq)
with open(os.path.join(HERE, '..', 'tables', 'names_grid.tsv'), 'w') as f:
    f.write('modifier\tn_heads\theads\n')
    for m, hs in sorted(S.items(), key=lambda x: -len(x[1])):
        f.write(f"{m}\t{len(hs)}\t{' '.join(sorted(hs))}\n")
