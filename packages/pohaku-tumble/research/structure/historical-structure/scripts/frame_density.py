"""Frame density of inherited compounds vs compounds.tsv.
- degree: for each compound, how many other compounds share one slot (= possible tumbles)
- rectangles: A1B1, A1B2, A2B1, A2B2 all attested (a true a:b::c:d proportion inside the compound frame)
- overlap: how many of the 128 attested candidates (W, W+A, A) and of the reviewed 'keep' words are inherited."""
import csv, collections, itertools, json, glob, unicodedata, re
from common import *
def nfc(s): return unicodedata.normalize('NFC', s)
def strip(s):
    s = unicodedata.normalize('NFD', s.lower()); s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    return s.replace('ʻ', '').replace(' ', '')
inh = [r for r in csv.DictReader(open(f'{OUT}/inherited_compounds.tsv'), delimiter='\t') if r['class'] in ('compound', 'prefix-like')]
def stats(pairs, label):
    A = collections.defaultdict(set); B = collections.defaultdict(set)
    for a, b in pairs: A[a].add(b); B[b].add(a)
    deg = [len(A[a]) - 1 + len(B[b]) - 1 for a, b in pairs]
    rect = 0; ex = []
    for a1, a2 in itertools.combinations(A, 2):
        common = A[a1] & A[a2]
        if len(common) >= 2:
            n = len(common) * (len(common) - 1) // 2; rect += n
            ex.append((a1, a2, sorted(common)))
    print(f'{label}: {len(pairs)} compounds, {len(A)} first roots, {len(B)} second roots; '
          f'mean degree {sum(deg)/len(deg):.2f}; >=5 turns: {sum(d>=5 for d in deg)}; zero turns: {sum(d==0 for d in deg)}; rectangles: {rect}')
    for e in ex[:8]: print('   ', e)
    return deg
pi = [tuple(r['proto'].lstrip('*').split('-')[:2]) for r in inh if r['class'] == 'compound']
stats(sorted(set(pi)), 'inherited compound (proto parts)')
pi2 = [tuple(r['proto'].lstrip('*').split('-')[:2]) for r in inh]
stats(sorted(set(pi2)), 'inherited compound + prefix-like')
ct = list(csv.DictReader(open(COMPOUNDS), delimiter='\t'))
att = [r for r in ct if r['status'] == 'candidate' and r['evidence'] in ('W', 'W+A', 'A')]
core = [r for r in ct if r['status'] == 'candidate']
stats([tuple(r['split'].split('·')) for r in att], 'compounds.tsv attested (W, W+A, A)')
stats([tuple(r['split'].split('·')) for r in core], 'compounds.tsv core 905 (spelling-level parts)')
inh_strip = {strip(re.sub(r'[/()]', '', r['haw_PE'])): r for r in inh}
inh_strip_c = {k: v for k, v in inh_strip.items() if v['class'] == 'compound'}
o_att = [r['word'] for r in att if strip(r['word']) in inh_strip]
o_core = [r['word'] for r in core if strip(r['word']) in inh_strip]
print(f'\nattested 128 ∩ inherited: {len(o_att)} {o_att}')
print(f'core 905 ∩ inherited: {len(o_core)}')
rv = {nfc(r['word']): r for f in sorted(glob.glob(REVIEW_GLOB)) for r in json.load(open(f))}
keep = [w for w, r in rv.items() if r['verdict'] == 'keep']
o_keep = [w for w in keep if strip(w) in inh_strip]
print(f'review keep {len(keep)} ∩ inherited: {len(o_keep)} {o_keep}')
