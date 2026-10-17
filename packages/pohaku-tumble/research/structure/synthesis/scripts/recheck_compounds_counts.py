"""compounds.tsv's hawwiki_1w / hawwiki_2w were counted on the uncleaned Wikipedia. Recount on the
cleaned corpus (phrase-syntagm corpus_pages.pkl) and compare. Writes tables/recheck_compounds_counts.txt."""
import csv, pickle
from collections import Counter
ROOT = '(scratch)/structure'
RR = 'roots'
pages, _ = pickle.load(open(f'{ROOT}/phrase-syntagm/scripts/corpus_pages.pkl', 'rb'))
uni = Counter(); bi = Counter()
for _, s in pages:
    t = [w for w, _ in s]; uni.update(t); bi.update(zip(t, t[1:]))
C = [r for r in csv.DictReader(open(f'{RR}/compounds.tsv'), delimiter='\t') if r['status'] == 'candidate']
old_pos = new_pos = lost = 0; old1 = old2 = new1 = new2 = 0; big = []
for r in C:
    a, b = r['split'].split('·')
    o1, o2 = int(r['hawwiki_1w'] or 0), int(r['hawwiki_2w'] or 0)
    n1, n2 = uni[a + b], bi[(a, b)]
    old1 += o1; old2 += o2; new1 += n1; new2 += n2
    old_pos += (o1 + o2) > 0; new_pos += (n1 + n2) > 0
    if (o1 + o2) > 0 and (n1 + n2) == 0: lost += 1
    if (o1 + o2) >= 10 and (n1 + n2) < 0.4 * (o1 + o2): big.append((r['word'], o1, o2, n1, n2))
L = [f'core candidates {len(C)}',
     f'with any hawwiki token: uncleaned {old_pos}, cleaned {new_pos}; lost entirely {lost}',
     f'tokens one-word: {old1} -> {new1}; two-word: {old2} -> {new2}',
     f'candidates with >=10 tokens that lose >60% after cleaning: {len(big)}'] + [f'   {w}: 1w {a}->{c}, 2w {b}->{d}' for w, a, b, c, d in big[:25]]
print('\n'.join(L)); open(f'{ROOT}/synthesis/tables/recheck_compounds_counts.txt', 'w').write('\n'.join(L) + '\n')
