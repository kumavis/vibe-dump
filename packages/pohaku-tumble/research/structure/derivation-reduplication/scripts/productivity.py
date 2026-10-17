"""Corpus productivity (Baayen): V (types), N (tokens), n1 (hapax types), P = n1/N for each process in hawwiki.
Also: share of derived types whose base occurs as a corpus type (transparency), and types absent from the
attested lexicon (Wiktionary ∪ POLLEX) and from Andrews 1922."""
import pickle, re
from collections import Counter
from common import *

freq, bigr = pickle.load(open(f'{W}/tables/hawwiki_counts.pkl', 'rb'))
lex = lexicon()
A = load_andrews()
ATXT = set(re.findall(r'[a-z]+', open(f'{CACHE}/andrews-parker1922.txt', encoding='utf-8', errors='replace').read().lower()))
GLUED = ('ʻia', 'ʻana', 'ʻiaʻo', 'ʻo')
def clean(ws):
    return [w for w in ws if not w.endswith(GLUED)]
N_all = sum(freq.values()); n1_all = sum(1 for w, n in freq.items() if n == 1)

def report(name, types):
    V = len(types); N = sum(freq[w] for w in types); n1 = sum(1 for w in types if freq[w] == 1)
    newlex = sum(1 for w in types if w not in lex)
    newA = sum(1 for w in types if strip_marks(w) not in ATXT)
    return dict(process=name, V=V, N=N, n1=n1, P=round(n1 / N, 4) if N else 0, share_hapax=round(n1 / V, 3) if V else 0,
                not_in_lexicon=newlex, not_in_andrews_fulltext=newA)

rows = []
rows.append(dict(process='ALL WORDS (baseline)', V=len(freq), N=N_all, n1=n1_all, P=round(n1_all / N_all, 4),
                 share_hapax=round(n1_all / len(freq), 3), not_in_lexicon=sum(1 for w in freq if w not in lex), not_in_andrews_fulltext=''))
hoo_raw = [w for w in freq if w.startswith('hoʻo') and len(w) > 5]
rows.append(report('hoʻo-X raw (incl. glued ʻia/ʻana/ʻo tokens)', hoo_raw))
hoo = clean(hoo_raw)
hoo_b = [w for w in hoo if w[4:] in freq]
rows.append(report('hoʻo-X (all corpus types)', hoo))
rows.append(report('hoʻo-X with X a corpus type', hoo_b))
ho = clean([w for w in freq if (w.startswith('hōʻ') or w.startswith('hoʻā') or w.startswith('hoʻē') or w.startswith('hoʻī') or w.startswith('hoʻū')) and len(w) > 4])
rows.append(report('hōʻ-/hoʻV̄- (allomorph shapes)', ho))
haa = clean([w for w in freq if w.startswith('haʻa') and len(w) > 5])
rows.append(report('haʻa-X', haa))
def is_full(w):
    s = syllables(w); n = len(s)
    return n >= 4 and n % 2 == 0 and ''.join(s[:n//2]) == ''.join(s[n//2:])
full = clean([w for w in freq if is_full(w)])
full_b = [w for w in full if w[:len(w)//2] in freq]
rows.append(report('full redup XX (X ≥ 2σ), all', full))
rows.append(report('full redup XX with X a corpus type', full_b))
# ʻana and ʻia as phrasal (free) morphemes: count distinct hosts
for part in ('ʻana', 'ʻia'):
    hosts = Counter()
    for (a, b), n in bigr.items():
        if b == part:
            hosts[a] += n
    V = len(hosts); N = sum(hosts.values()); n1 = sum(1 for h, n in hosts.items() if n == 1)
    rows.append(dict(process=f'host + {part} (preceding word types)', V=V, N=N, n1=n1, P=round(n1 / N, 4), share_hapax=round(n1 / V, 3),
                     not_in_lexicon=sum(1 for h in hosts if h not in lex), not_in_andrews_fulltext=''))
with open(f'{W}/tables/productivity.tsv', 'w') as f:
    ks = list(rows[0].keys()); f.write('\t'.join(ks) + '\n')
    for r in rows: f.write('\t'.join(str(r[k]) for k in ks) + '\n')
for r in rows: print(r)
print('top hoʻo- types:', sorted(((freq[w], w) for w in hoo), reverse=True)[:30])
print('hoʻo- hapaxes sample:', [w for w in hoo if freq[w] == 1][:40])
print('full redup top:', sorted(((freq[w], w) for w in full_b), reverse=True)[:30])
