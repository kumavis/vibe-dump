"""Closed proportional series: (1) plural by vowel lengthening in human nouns; (2) the numeral prefix paradigm.
Attestation: lexicon (Wiktionary ∪ POLLEX), Andrews 1922 full text (unmarked; ambiguous for length), Hawaiian Wikipedia.
Also a distributional check for (1): which determiner precedes the short vs long form in hawwiki."""
import pickle, re
from collections import Counter
from common import *

lex = lexicon(); kk = load_kaikki()
freq, bigr = pickle.load(open(f'{W}/tables/hawwiki_counts.pkl', 'rb'))
ATXT = set(re.findall(r'[a-z]+', open(f'{CACHE}/andrews-parker1922.txt', encoding='utf-8', errors='replace').read().lower()))

# (1) plural lengthening: Wiktionary 'plural of X' where form differs from X only by one macron
pl = []
for w, es in kk.items():
    for e in es:
        for g in e['glosses']:
            m = re.match(r'plural of (\S+)$', g)
            if m:
                b = norm(m.group(1))
                if ' ' not in w and shorten(w) == shorten(b) and w != b:
                    pl.append((b, w))
pl = sorted(set(pl))
print('(1) plural-by-lengthening pairs in Wiktionary (single words):', len(pl))
SG = {'ke', 'ka', 'he', 'kēia', 'kēlā', 'kona', 'kāna', 'koʻu', 'kaʻu', 'ua'}
PLD = {'nā', 'mau', 'poʻe', 'kēia mau', 'ia mau'}
rows = []
for b, w in pl:
    def det(x):
        s = sum(n for (a, c), n in bigr.items() if c == x and a in SG)
        p = sum(n for (a, c), n in bigr.items() if c == x and a in ('nā', 'mau'))
        return s, p
    sb, pb = det(b); sw, pw = det(w)
    pos = sorted({i for i, ch in enumerate(w) if ch != b[i]})
    syl_from_end = len(syllables(w)) - [k for k, s in enumerate(syllables(w)) if any(c in LONG for c in s) and s not in syllables(b)][0] if True else None
    rows.append((b, w, freq[b], freq[w], sb, pb, sw, pw, int(lex.get(w, {}).get('P', False)), syl_from_end))
    print(f'  {b:12s} {w:12s} hawwiki sg-form={freq[b]:5d} pl-form={freq[w]:5d} | short form after sg-det {sb:4d} / after nā,mau {pb:4d} | long form after sg-det {sw:4d} / after nā,mau {pw:4d} | in POLLEX {rows[-1][8]} | lengthened σ from end {syl_from_end}')
tot = [sum(r[i] for r in rows) for i in (4, 5, 6, 7)]
print('  TOTAL short: sg-det', tot[0], 'pl-det', tot[1], f'({tot[1]/(tot[0]+tot[1]):.0%} plural contexts)', '| long: sg-det', tot[2], 'pl-det', tot[3], f'({tot[3]/(tot[2]+tot[3]):.0%} plural contexts)')
# candidate extension: other human nouns with pattern? (not attested) -> report only attested
# (2) numeral paradigm
NUM = ['kahi', 'lua', 'kolu', 'hā', 'lima', 'ono', 'hiku', 'walu', 'iwa']
PFX = {'∅': '', 'ʻe-': 'ʻe', 'ʻa-': 'ʻa', 'pā-': 'pā', 'hoʻo-': 'hoʻo', 'kua-': 'kua'}
print('\n(2) numeral paradigm: cell = L (lexicon: Wiktionary/POLLEX), A (Andrews 1922 text, unmarked), H (hawwiki tokens)')
print('%-6s' % '', ''.join('%-16s' % p for p in PFX))
mat = {}
for n in NUM + ['ʻumi']:
    line = '%-6s' % n
    for p, s in PFX.items():
        if n == 'ʻumi' and p in ('ʻe-', 'ʻa-'):
            line += '%-16s' % '-'; continue
        w = s + n if not (s and n[0] == OK and s.endswith('a')) else s + n
        L = 'L' if w in lex else '.'
        A = 'A' if strip_marks(w) in ATXT else '.'
        H = freq.get(w, 0)
        mat[(n, p)] = (w, L, A, H)
        line += '%-16s' % f'{w}:{L}{A}{H}'
    print(line)
att = Counter()
for (n, p), (w, L, A, H) in mat.items():
    if p != '∅':
        att[p] += int(L == 'L' or H > 0)
print('cells attested in lexicon or hawwiki, per prefix (of 10 numerals, ʻumi n/a for ʻe-/ʻa-):', dict(att))
