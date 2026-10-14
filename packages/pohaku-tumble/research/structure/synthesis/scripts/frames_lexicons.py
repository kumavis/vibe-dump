"""Build candidate lexicons for the N + modifier syntagm (one-word compounds and two-word phrases),
on one attestation standard, and describe their shape before the board simulation.

Inputs (read-only):
  roots/compounds.tsv                                   905 core compound candidates (roots study)
  roots/.cache/tiers/attested-WA.json                   the 128 attested compounds ROOTS.md simulated
  phrase-syntagm/tables/colloc_all.tsv                  DET-frame head + modifier counts (cleaned corpus, 54 heads)
  phrase-syntagm/scripts/corpus_pages.pkl               cleaned Hawaiian Wikipedia with page ids

Corpus attestation of a compound a·b (cleaned corpus): solid token ab + spaced bigram "a b"; f = tokens,
df = pages. 'stable' = f >= 2 and df >= 2, the same bar the phrase study used for phrases.

Tiers written to sim/lex/*.json as [{word, parts:[a,b]}], deduplicated by (a, b) so a spaced and a
solid spelling of one unit count once. Writes tables/frames_lexicons.txt.
"""
import csv, json, pickle, os
from collections import Counter, defaultdict

ROOT = '(scratch)/structure'
RR = 'roots'
OUTD = f'{ROOT}/synthesis/sim/lex'
os.makedirs(OUTD, exist_ok=True)
lines = []
def out(*a):
    s = ' '.join(str(x) for x in a); print(s); lines.append(s)

# ---------------------------------------------------------------- corpus with pages
pages, _ = pickle.load(open(f'{ROOT}/phrase-syntagm/scripts/corpus_pages.pkl', 'rb'))
uni = Counter(); bi = Counter(); uni_pg = defaultdict(set); bi_pg = defaultdict(set)
for pi, s in pages:
    t = [w for w, _ in s]
    for w in t:
        uni[w] += 1; uni_pg[w].add(pi)
    for a, b in zip(t, t[1:]):
        bi[(a, b)] += 1; bi_pg[(a, b)].add(pi)

def corpus_att(a, b):
    f = uni[a + b] + bi[(a, b)]
    df = len(uni_pg[a + b] | bi_pg[(a, b)])
    return f, df

# ---------------------------------------------------------------- compounds
C = [r for r in csv.DictReader(open(f'{RR}/compounds.tsv'), delimiter='\t') if r['status'] == 'candidate']
comp = []
for r in C:
    a, b = r['split'].split('·')
    f, df = corpus_att(a, b)
    comp.append(dict(word=r['word'], a=a, b=b, ev=r['evidence'], f=f, df=df))
WA = json.load(open(f'{RR}/.cache/tiers/attested-WA.json'))
WA_parts = {tuple(x['parts']) for x in WA}
comp_stable = [c for c in comp if c['f'] >= 2 and c['df'] >= 2]
out(f'compounds: core candidates {len(comp)}; attested W/W+A/A {len(WA)}; corpus-stable (cleaned, f>=2, df>=2) {len(comp_stable)}')
out(f'  corpus-stable by evidence: {dict(Counter(c["ev"] for c in comp_stable))}')
out(f'  attested (W/W+A/A) that are also corpus-stable: {sum(1 for c in comp_stable if (c["a"], c["b"]) in WA_parts)}')

# ---------------------------------------------------------------- phrases
P = list(csv.DictReader(open(f'{ROOT}/phrase-syntagm/tables/colloc_all.tsv'), delimiter='\t'))
def lexical(r):
    return r['gram'] != 'True' and int(r['cap']) * 2 <= int(r['f'])
ph_stable = [r for r in P if lexical(r) and int(r['f']) >= 2 and int(r['df']) >= 2]
ph_dict = [r for r in P if lexical(r) and r['attest']]
out(f'phrases: stable lexical pairs {len(ph_stable)} on {len({r["head"] for r in ph_stable})} heads; dictionary-attested (any f) {len(ph_dict)}')

def tier(name, items, note):
    seen = {}
    for w, a, b in items:
        seen.setdefault((a, b), w)
    data = [dict(word=w, parts=[a, b]) for (a, b), w in seen.items()]
    json.dump(data, open(f'{OUTD}/{name}.json', 'w'), ensure_ascii=False)
    # shape
    first = Counter(a for a, b in seen); second = Counter(b for a, b in seen)
    units = Counter()
    for a, b in seen:
        units[a] += 1
        if b != a: units[b] += 1
    top = units.most_common(3)
    n = len(seen)
    share_top1 = top[0][1] / n if n else 0
    share_top3 = len({k for k in seen if k[0] in dict(top) or k[1] in dict(top)}) / n if n else 0
    out(f'  tier {name:24s} words {n:5d}  slot-1 units {len(first):4d}  slot-2 units {len(second):4d}  '
        f'top unit {top[0][0]} in {share_top1:.0%} of words; top-3 units {",".join(k for k, _ in top)} in {share_top3:.0%}   [{note}]')
    return data

out()
out('Tiers (deduplicated by parts):')
tier('comp_WA', [(x['word'], *x['parts']) for x in WA], 'ROOTS.md attested 128')
tier('comp_corpus', [(c['word'], c['a'], c['b']) for c in comp_stable], 'compound candidates stable in cleaned hawwiki')
tier('comp_WA_or_corpus', [(x['word'], *x['parts']) for x in WA] + [(c['word'], c['a'], c['b']) for c in comp_stable], 'attested or corpus-stable compounds')
tier('phr_stable', [(r['head'] + ' ' + r['mod'], r['head'], r['mod']) for r in ph_stable], 'phrase study stable 565')
tier('phr_dict', [(r['head'] + ' ' + r['mod'], r['head'], r['mod']) for r in ph_dict], 'phrases attested in W/P/A/reviews')
POLY = {'mea', 'kumu', 'papa', 'hana'}
tier('phr_stable_nopoly', [(r['head'] + ' ' + r['mod'], r['head'], r['mod']) for r in ph_stable if r['head'] not in POLY],
     'stable phrases without mea, kumu, papa, hana heads')
union = ([(x['word'], *x['parts']) for x in WA] + [(c['word'], c['a'], c['b']) for c in comp_stable]
         + [(r['head'] + ' ' + r['mod'], r['head'], r['mod']) for r in ph_stable]
         + [(r['head'] + ' ' + r['mod'], r['head'], r['mod']) for r in ph_dict])
tier('nmod_union', union, 'compounds (attested or corpus-stable) + phrases (stable or dictionary)')
tier('nmod_union_nopoly', [u for u in union if u[1] not in POLY], 'same, without mea/kumu/papa/hana as heads')
open(f'{ROOT}/synthesis/tables/frames_lexicons.txt', 'w').write('\n'.join(lines) + '\n')
