"""Head x modifier grid: where the same modifier commutes across heads and the same
head across modifiers.  A 'square' is {h1,h2} x {m1,m2} with all four pairs
attested -- the minimal proportional series h1m1 : h1m2 :: h2m1 : h2m2.
Inputs: ../tables/colloc_all.tsv (from colloc.py).
Levels: 'stable' = f>=2 and df>=2 in the DET frame; 'any' = f>=1.
Lexical modifiers only (closed-class GRAM rows and capitalised-majority rows excluded,
the latter because they are mostly proper names: ʻōlelo Hawaiʻi, lā Iulai)."""
import csv, os, itertools, collections, json
HERE = os.path.dirname(os.path.abspath(__file__))
T = os.path.join(HERE, '..', 'tables')
rows = list(csv.DictReader(open(os.path.join(T, 'colloc_all.tsv')), delimiter='\t'))


def pairs(level, allow_names=False):
    S = collections.defaultdict(set)
    for r in rows:
        if r['gram'] == 'True':
            continue
        f, df, cap = int(r['f']), int(r['df']), int(r['cap'])
        if not allow_names and cap * 2 > f:
            continue
        if level == 'stable' and not (f >= 2 and df >= 2):
            continue
        S[r['head']].add(r['mod'])
    return S


def squares(S):
    heads = [h for h in S if S[h]]
    sq = []
    for h1, h2 in itertools.combinations(sorted(heads), 2):
        common = sorted(S[h1] & S[h2])
        for m1, m2 in itertools.combinations(common, 2):
            sq.append((h1, h2, m1, m2))
    return sq


out = {}
for level in ('stable', 'any'):
    S = pairs(level)
    sq = squares(S)
    npairs = sum(len(v) for v in S.values())
    # modifier columns: modifiers shared by >= k heads
    col = collections.Counter(m for h in S for m in S[h])
    # head-pair overlaps
    ov = []
    for h1, h2 in itertools.combinations(sorted(S), 2):
        i = len(S[h1] & S[h2])
        if i:
            ov.append((i, round(i / len(S[h1] | S[h2]), 2), h1, h2, sorted(S[h1] & S[h2])))
    ov.sort(reverse=True)
    # degree of each pair = number of possible one-slot commutations to another attested pair
    deg = []
    for h in S:
        for m in S[h]:
            d_mod = len(S[h]) - 1                       # change modifier, keep head
            d_head = sum(1 for h2 in S if h2 != h and m in S[h2])   # change head, keep modifier
            deg.append((h, m, d_mod, d_head))
    out[level] = dict(heads=len([h for h in S if S[h]]), pairs=npairs, squares=len(sq),
                      pairs_in_a_square=len({(a, c) for a, b, c, d in sq} | {(a, d) for a, b, c, d in sq} |
                                            {(b, c) for a, b, c, d in sq} | {(b, d) for a, b, c, d in sq}),
                      modifiers_shared_by_ge2_heads=sum(1 for m, c in col.items() if c >= 2),
                      modifiers_shared_by_ge3_heads=sum(1 for m, c in col.items() if c >= 3),
                      pairs_with_head_commutation=sum(1 for d in deg if d[3] >= 1),
                      top_columns=[(m, c) for m, c in col.most_common(25)],
                      top_overlaps=[(o[0], o[1], o[2], o[3], ' '.join(o[4][:12])) for o in ov[:20]])
    with open(os.path.join(T, f'squares_{level}.tsv'), 'w') as f:
        f.write('h1\th2\tm1\tm2\n')
        for s in sq:
            f.write('\t'.join(s) + '\n')
    with open(os.path.join(T, f'columns_{level}.tsv'), 'w') as f:
        f.write('modifier\tn_heads\theads\n')
        for m, c in col.most_common():
            f.write(f"{m}\t{c}\t{' '.join(sorted(h for h in S if m in S[h]))}\n")
json.dump(out, open(os.path.join(T, 'grid_summary.json'), 'w'), ensure_ascii=False, indent=1)
for level, o in out.items():
    print('==', level)
    for k, v in o.items():
        print(' ', k, v if not isinstance(v, list) else '')
        if isinstance(v, list):
            for x in v:
                print('     ', x)
