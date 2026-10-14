"""Re-check, on the word-salad-cleaned Hawaiian Wikipedia corpus (grammatical-paradigms/corpus.pkl),
counts that sibling studies took from the uncleaned corpus.

Cleaned corpus: 310,077 tokens, 49,694 sentence chunks (three-pass filter in grammatical-paradigms/common.py).
Uncleaned comparison: derivation-reduplication/tables/hawwiki_counts.pkl (369,697 tokens, ns-0 pages, no salad filter).

Writes tables/recheck_corpus.txt.
"""
import pickle, re, os, unicodedata
from collections import Counter

ROOT = '(scratch)/structure'
OUT = f'{ROOT}/synthesis/tables/recheck_corpus.txt'
CACHE = 'roots/.cache'
OK = 'ʻ'

sents, stats = pickle.load(open(f'{ROOT}/grammatical-paradigms/corpus.pkl', 'rb'))
toks = [[t for t, _ in s] for s in sents]
uni = Counter(t for s in toks for t in s)
bi = Counter((a, b) for s in toks for a, b in zip(s, s[1:]))
N = sum(uni.values())
raw_uni, raw_bi = pickle.load(open(f'{ROOT}/derivation-reduplication/tables/hawwiki_counts.pkl', 'rb'))
RAW_N = sum(raw_uni.values())

lines = []
def out(*a):
    s = ' '.join(str(x) for x in a)
    print(s); lines.append(s)

out(f'cleaned corpus tokens {N:,}; uncleaned (derivation study) tokens {RAW_N:,}')
out()

# ---------------------------------------------------------------- (a) plural lengthening
PAIRS = [('kanaka', 'kānaka'), ('wahine', 'wāhine'), ('makua', 'mākua'), ('kupuna', 'kūpuna'),
         ('kahuna', 'kāhuna'), ('kaikamahine', 'kaikamāhine'), ('makuahine', 'mākuahine'),
         ('luahine', 'luāhine'), ('ʻelemakule', 'ʻelemākule'), ('ʻaumakua', 'ʻaumākua'),
         ('kahiko', 'kāhiko'), ('kaikuahine', 'kaikuāhine')]
SG = {'ke', 'ka', 'he', 'kēia', 'kēlā', 'kona', 'kāna', 'koʻu', 'kaʻu', 'ua'}
PL = {'nā', 'mau'}
def ctx(bg, w):
    s = sum(n for (a, c), n in bg.items() if c == w and a in SG)
    p = sum(n for (a, c), n in bg.items() if c == w and a in PL)
    return s, p
out('(a) plural by lengthening: tokens and determiner contexts (SG = ke ka he kēia kēlā kona kāna koʻu kaʻu ua; PL = nā mau)')
out(f"{'sg':12s} {'pl':12s} | cleaned: sg-form pl-form | short: sgDET plDET | long: sgDET plDET || uncleaned: sg-form pl-form | long plDET/(DET)")
T = Counter(); TR = Counter()
for a, b in PAIRS:
    ss, sp = ctx(bi, a); ls, lp = ctx(bi, b)
    rss, rsp = ctx(raw_bi, a); rls, rlp = ctx(raw_bi, b)
    T.update(short_sg=ss, short_pl=sp, long_sg=ls, long_pl=lp)
    TR.update(short_sg=rss, short_pl=rsp, long_sg=rls, long_pl=rlp)
    out(f'{a:12s} {b:12s} | {uni[a]:6d} {uni[b]:6d} | {ss:5d} {sp:5d} | {ls:5d} {lp:5d} || {raw_uni[a]:6d} {raw_uni[b]:6d} | {rlp}/{rls+rlp}')
def summ(tag, C):
    lp, ls, sp, ss = C['long_pl'], C['long_sg'], C['short_pl'], C['short_sg']
    out(f'{tag}: long form in plural-DET contexts {lp}/{lp+ls} = {lp/max(1,lp+ls):.1%}; '
        f'short form in plural-DET contexts {sp}/{sp+ss} = {sp/max(1,sp+ss):.1%}; '
        f'plural-DET contexts written long {lp}/{lp+sp} = {lp/max(1,lp+sp):.1%}')
summ('cleaned', T); summ('uncleaned', TR)
out()

# ---------------------------------------------------------------- (b) hoʻo- productivity on cleaned corpus
ATXT = set(re.findall(r'[a-z]+', open(f'{CACHE}/andrews-parker1922.txt', encoding='utf-8', errors='replace').read().lower()))
LONG = {'ā': 'a', 'ē': 'e', 'ī': 'i', 'ō': 'o', 'ū': 'u'}
def strip(s): return ''.join(LONG.get(c, c) for c in s.replace(OK, ''))
def hoo_types(u):
    return {w: n for w, n in u.items() if w.startswith('hoʻo') and len(w) > 5}
for tag, u in (('cleaned', uni), ('uncleaned', raw_uni)):
    h = hoo_types(u)
    ntok = sum(h.values()); n1 = sum(1 for n in h.values() if n == 1)
    absent = sum(1 for w in h if strip(w) not in ATXT)
    out(f'(b) hoʻo-X (string hoʻo + ≥2 letters) {tag}: types {len(h)}, tokens {ntok}, hapax {n1}, P = {n1/max(1,ntok):.3f}; '
        f'types absent from Andrews 1922 text {absent}/{len(h)} = {absent/max(1,len(h)):.0%}')
NATIVE = re.compile(r'^[ʻaeiouāēīōūhklmnpw]+$')
for tag, u in (('cleaned', uni), ('uncleaned', raw_uni)):
    nat = {w: n for w, n in u.items() if NATIVE.match(w)}
    out(f'    baseline P, all native-spelled words, {tag} = {sum(1 for n in nat.values() if n == 1)/sum(nat.values()):.3f} '
        f'({sum(nat.values()):,} tokens, {len(nat):,} types)')
out()

# ---------------------------------------------------------------- (c) kin GEN x SEX
def phr(a, b=None):
    return bi[(a, b)] if b else uni[a]
CELLS = [('kupuna', 'kāne', ['kupunakāne']), ('kupuna', 'wahine', ['kupunawahine', 'kupunahine']),
         ('makua', 'kāne', ['makuakāne']), ('makua', 'wahine', ['makuahine']),
         ('keiki', 'kāne', ['keikikāne']), ('keiki', 'wahine', ['kaikamahine']),
         ('moʻopuna', 'kāne', []), ('moʻopuna', 'wahine', [])]
out('(c) kinship GEN x SEX, cleaned corpus (spaced bigram + fused/suppletive forms)')
att = 0
for g, s, fused in CELLS:
    sp = phr(g, s); fu = sum(uni[f] for f in fused)
    att += (sp + fu) > 0
    out(f'    {g} {s}: spaced {sp}; ' + ', '.join(f'{f} {uni[f]}' for f in fused))
out(f'    cells attested: {att}/8')
out()

# ---------------------------------------------------------------- (d) a/o possessive before kin nouns
A = {'kāna', 'kaʻu', 'kāu', 'kā'}; O = {'kona', 'koʻu', 'kou', 'ko'}
KIN = ['kupuna', 'kūpuna', 'makua', 'mākua', 'makuahine', 'makuakāne', 'kaikuaʻana', 'kaikaina', 'kaikunāne',
       'kaikuahine', 'ʻohana', 'keiki', 'kaikamahine', 'moʻopuna', 'wahine', 'kāne']
out('(d) a- vs o-class possessor before kin nouns, cleaned (possessor directly before, or before mau)')
for k in KIN:
    a = sum(n for (x, y), n in bi.items() if y == k and x in A)
    o = sum(n for (x, y), n in bi.items() if y == k and x in O)
    for s in toks:
        for i in range(2, len(s)):
            if s[i] == k and s[i-1] == 'mau':
                if s[i-2] in A: a += 1
                elif s[i-2] in O: o += 1
    out(f'    {k:12s} a {a:3d}  o {o:3d}  share a {a/max(1,a+o):.2f}')
out()

# ---------------------------------------------------------------- (e) PREP x LOC core cells
PREP = ['i', 'ma', 'mai', 'no', 'o']
LOC = ['luna', 'lalo', 'loko', 'waho', 'mua', 'hope', 'uka', 'kai']
FUSED = {('i', 'luna'): 'iluna', ('ma', 'luna'): 'maluna', ('i', 'loko'): 'iloko', ('ma', 'loko'): 'maloko',
         ('ma', 'uka'): 'mauka', ('ma', 'kai'): 'makai', ('i', 'mua'): 'imua', ('ma', 'mua'): 'mamua',
         ('ma', 'hope'): 'mahope', ('i', 'waho'): 'iwaho', ('ma', 'waho'): 'mawaho', ('i', 'lalo'): 'ilalo',
         ('ma', 'lalo'): 'malalo', ('i', 'uka'): 'iuka', ('i', 'kai'): 'ikai'}
att = 0; tbl = []
for l in LOC:
    row = []
    for p in PREP:
        n = bi[(p, l)] + uni.get(FUSED.get((p, l), '#'), 0)
        row.append(n); att += n > 0
    tbl.append((l, row))
out('(e) PREP x LOC (8 core locatives x 5 prepositions), cleaned, spaced + fused')
out('    ' + ' '.join(f'{p:>5s}' for p in PREP))
for l, row in tbl:
    out(f'    {l:5s}' + ' '.join(f'{n:5d}' for n in row))
out(f'    cells attested: {att}/40')
out()

# ---------------------------------------------------------------- (f) pronouns, possessives
for w in ['kāua', 'māua', 'lāua', 'ʻolua', 'kākou', 'mākou', 'lākou', 'ʻoukou', 'kaʻu', 'kāu', 'kāna', 'koʻu', 'kou', 'kona', 'kānaka']:
    out(f'(f) {w:8s} cleaned {uni[w]:5d}   uncleaned {raw_uni[w]:5d}')

open(OUT, 'w').write('\n'.join(lines) + '\n')
