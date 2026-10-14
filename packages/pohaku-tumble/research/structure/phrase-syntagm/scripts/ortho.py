"""When is a two-part unit written as one word or two?  Three measurements.
 (1) The 905 compound reviews: transparency x word_break cross-tab (reviewers'
     coding; word_break comes from attested modern spellings, see each review's
     spelling_basis).
 (2) Hawaiian Wikipedia: pairs that occur BOTH spaced (h x) and solid (hx) in the
     filtered corpus -- share of solid spellings, and examples.
 (3) Wiktionary two-word common units: how often hawwiki writes them solid.
Writes ../tables/ortho_both_spellings.tsv"""
import os, collections, re
import common as C, lex, corpus_pages

HERE = os.path.dirname(os.path.abspath(__file__))
T = os.path.join(HERE, '..', 'tables')
OKc = C.OK
NATIVE = re.compile(r'^(?:[pkhmnlw%s]?[aeiouāēīōū])+$' % OKc)

# (1)
R = lex.reviews()
ct = collections.Counter((r.get('transparency'), str(r.get('word_break'))) for r in R)
print('(1) reviews: transparency x word_break')
for t in ('transparent', 'partial', 'opaque'):
    row = {b: ct[(t, b)] for b in ('1', '2', 'either', 'unknown')}
    known = row['1'] + row['2'] + row['either']
    print(f"  {t:12s} {row}  one-word share of known: {row['1']/known:.2f}" if known else t)
# by verdict keep/keep-pending only
ct2 = collections.Counter((r.get('transparency'), str(r.get('word_break'))) for r in R if r.get('verdict') in ('keep', 'keep-pending'))
print('  (keep + keep-pending only)')
for t in ('transparent', 'partial', 'opaque'):
    row = {b: ct2[(t, b)] for b in ('1', '2', 'either')}
    k = sum(row.values())
    print(f"  {t:12s} {row}  one-word share: {row['1']/k:.2f}" if k else t)

# (2)
keep, st = corpus_pages.load()
uni = collections.Counter(); bi = collections.Counter()
for pi, s in keep:
    toks = [t for t, _ in s]
    for i, t in enumerate(toks):
        uni[t] += 1
        if i + 1 < len(toks):
            bi[(t, toks[i + 1])] += 1
both = []
for (h, x), nsp in bi.items():
    if not (NATIVE.match(h) and NATIVE.match(x)) or len(h) < 2 or len(x) < 2:
        continue
    nso = uni.get(h + x, 0)
    if nso:
        both.append((h, x, nsp, nso))
both.sort(key=lambda r: -(r[2] + r[3]))
# exclude grammatical sequences (article + noun etc.)
GR = set('ka ke nā na ma me no he ua ʻo o i a e ia ai mai aku iho aʻe nei lā ala pū nō ʻia ʻana ana kēia kēlā kona kāna'.split())
PREF = set('hō hoʻo ho hoʻ nū ʻō ʻā ʻa pā kā mā'.split())   # prefixes / loan pieces, not roots
lexb = [b for b in both if b[0] not in GR and b[1] not in GR and b[0] != b[1] and b[0] not in PREF
        and len(b[0]) >= 3 and len(b[1]) >= 3 and not (b[0] + b[1]).endswith('ʻia')]
with open(os.path.join(T, 'ortho_both_spellings.tsv'), 'w') as f:
    f.write('h\tx\tspaced\tsolid\tsolid_share\n')
    for h, x, a, b in lexb:
        f.write(f'{h}\t{x}\t{a}\t{b}\t{b/(a+b):.2f}\n')
tok_sp = sum(b[2] for b in lexb); tok_so = sum(b[3] for b in lexb)
print(f'\n(2) hawwiki pairs found both spaced and solid (content words): {len(lexb)} pairs; '
      f'{tok_sp} spaced tokens, {tok_so} solid tokens')
mix = [b for b in lexb if b[2] + b[3] >= 5]
print('   pairs with >=5 tokens:', len(mix), '; of these mostly solid (>=80%):',
      sum(1 for b in mix if b[3] / (b[2] + b[3]) >= .8), '; mostly spaced (<=20% solid):',
      sum(1 for b in mix if b[3] / (b[2] + b[3]) <= .2), '; mixed:',
      sum(1 for b in mix if .2 < b[3] / (b[2] + b[3]) < .8))
for b in mix[:45]:
    print('   ', b, f'{b[3]/(b[2]+b[3]):.2f}')

# (3)
W, Wd = lex.wikt()
two = [w for w in W if len(w.split()) == 2 and not any(e['raw'][0].isupper() for e in W[w])]
c = collections.Counter()
ex = []
for w in two:
    h, x = w.split()
    a, b = bi[(h, x)], uni.get(h + x, 0)
    if a and b: c['both'] += 1; ex.append((w, a, b))
    elif a: c['spaced only'] += 1
    elif b: c['solid only'] += 1; ex.append((w, a, b))
    else: c['absent'] += 1
print('\n(3) Wiktionary 2-word lowercase units in hawwiki:', dict(c))
print('   solid occurrences:', ex)
