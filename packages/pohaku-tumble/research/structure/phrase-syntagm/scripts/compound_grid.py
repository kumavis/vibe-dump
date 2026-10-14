"""Same grid measures for the one-word compound frame (roots study, compounds.tsv),
so the two frames can be compared like for like.
 confirmed = status candidate with evidence W or W+A (the roots study's 128)
 candidates = all 905 status=candidate rows
 reviewed-keep = rows whose review verdict is keep / keep-pending
For each set: units, distinct first/second roots, squares {a1,a2}x{b1,b2}, units in a
square, mean number of one-slot commutations per unit (degree)."""
import csv, itertools, collections, os
import lex
HERE = os.path.dirname(os.path.abspath(__file__))
rows = list(csv.DictReader(open('roots/compounds.tsv'), delimiter='\t'))
rev = {r['word']: r for r in lex.reviews()}
cand = [r for r in rows if r['status'] == 'candidate']
sets = {
    'confirmed (W, W+A)': [r for r in cand if r['evidence'] in ('W', 'W+A')],
    'all 905 candidates': cand,
    'reviews keep+keep-pending': [r for r in cand if rev.get(r['word'], {}).get('verdict') in ('keep', 'keep-pending')],
}


def measure(units):
    S = collections.defaultdict(set)
    for a, b in units:
        S[a].add(b)
    sq = 0; insq = set()
    for a1, a2 in itertools.combinations(sorted(S), 2):
        com = sorted(S[a1] & S[a2])
        for b1, b2 in itertools.combinations(com, 2):
            sq += 1
            insq |= {(a1, b1), (a1, b2), (a2, b1), (a2, b2)}
    first = collections.Counter(a for a, b in units)
    second = collections.Counter(b for a, b in units)
    deg = [(first[a] - 1) + (second[b] - 1) for a, b in units]
    d1 = [second[b] - 1 for a, b in units]   # alternatives in slot 1 (keep slot 2)
    d2 = [first[a] - 1 for a, b in units]    # alternatives in slot 2 (keep slot 1)
    return dict(units=len(units), first_roots=len(first), second_roots=len(second), squares=sq,
                units_in_square=len(insq), share_in_square=round(len(insq) / len(units), 2) if units else 0,
                mean_degree=round(sum(deg) / len(deg), 2) if deg else 0,
                mean_alt_slot1=round(sum(d1) / len(d1), 2) if d1 else 0,
                mean_alt_slot2=round(sum(d2) / len(d2), 2) if d2 else 0,
                units_with_slot1_alt=sum(1 for x in d1 if x), units_with_slot2_alt=sum(1 for x in d2 if x))


for name, rs in sets.items():
    print(name, 'rows', len(rs))
    units = {tuple(r['split'].split('·')) for r in rs if r['split'].count('·') == 1}
    print(name, measure(units))

# the phrase frame, same measure (stable DET-frame pairs, lexical modifiers, names excluded)
rows2 = list(csv.DictReader(open(os.path.join(HERE, '..', 'tables', 'colloc_all.tsv')), delimiter='\t'))
def ph(level):
    u = set()
    for r in rows2:
        f, df, cap = int(r['f']), int(r['df']), int(r['cap'])
        if r['gram'] == 'True' or cap * 2 > f:
            continue
        if level == 'stable' and not (f >= 2 and df >= 2):
            continue
        if level == 'assoc' and not (f >= 2 and df >= 2 and float(r['pmi']) >= 3 and float(r['G2']) >= 10.83):
            continue
        u.add((r['head'], r['mod']))
    return u
for lvl in ('assoc', 'stable', 'any'):
    print('phrase frame', lvl, measure(ph(lvl)))
# phrase frame: only pairs that a dictionary also attests (W, P, A or a review)
att = set()
for r in rows2:
    if r['attest']:
        att.add((r['head'], r['mod']))
print('phrase frame, dictionary-attested pairs (any freq)', measure(att))
