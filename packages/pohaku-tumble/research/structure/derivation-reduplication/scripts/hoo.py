"""hoʻo- family: find base/derived pairs where both forms are attested.
Sources of pairs: (a) Wiktionary etymology analyses / categories, (b) formal stripping
over the attested lexicon (Wiktionary ∪ POLLEX), (c) Andrews 1922 bracket etymologies "[Hoo and X".
Writes tables/hoo_pairs.tsv and prints summary counts."""
import json, re, csv
from collections import Counter, defaultdict
from common import *

lex = lexicon()
wk = json.load(open(f'{CACHE}/wiktionary.json'))
andrews = load_andrews()
HOO_PARTS = {'hoʻo-', 'hō-', 'hoʻ-', 'hōʻ-', 'ho-'}

# (a) Wiktionary analyses
wpairs = {}
for a in wk['analyses']:
    parts = [norm(p) for p in a['parts']]
    if parts and parts[0] in HOO_PARTS and len(parts) == 2:
        wpairs[norm(a['word'])] = (parts[0].rstrip('-'), parts[1])
# category membership
wcat = {}
for w, e in lex.items():
    for c in e['cats']:
        m = re.match(r'Hawaiian terms prefixed with (hoʻo-|hō-|hoʻ-|hōʻ-|ho-)$', c)
        if m:
            wcat[w] = m.group(1)

def base_candidates(w):
    """yield (allomorph, base) for formal stripping"""
    out = []
    if w.startswith('hoʻo') and len(w) > 5:
        out.append(('hoʻo', w[4:]))
    if w.startswith('hōʻ') and len(w) > 4:
        out.append(('hō', w[2:]))          # hō + ʻX
        out.append(('hōʻ', w[3:]))         # hōʻ + V... (base without ʻ)
    elif w.startswith('hō') and len(w) > 3:
        out.append(('hō', w[2:]))
    if w.startswith('hoʻ') and len(w) > 4 and w[3] in VOW:
        x = w[3:]
        out.append(('hoʻ', x))
        if x[0] in LONG:
            out.append(('hoʻ', LONG[x[0]] + x[1:]))     # hoʻ + lengthened base vowel (hoʻāla < ala)
            out.append(('hoʻ', OK + LONG[x[0]] + x[1:]))
        out.append(('hoʻ', OK + x))                 # hoʻ + ʻX with ʻ lost
    return out

rows = []
seen = set()
for w in sorted(lex):
    if not (w.startswith('hoʻ') or w.startswith('hō')):
        continue
    cands = base_candidates(w)
    hits = [(al, b) for al, b in cands if b in lex and len(b) >= 2]
    wa = wpairs.get(w)
    if wa and wa[1] in lex and wa not in hits:
        hits.insert(0, (wa[0], wa[1]))
    for al, b in hits:
        if (w, b) in seen:
            continue
        seen.add((w, b))
        rows.append({'derived': w, 'base': b, 'allomorph': al,
                     'src_wikt_analysis': int(bool(wa and wa[1] == b)),
                     'src_wikt_cat': wcat.get(w, ''),
                     'der_W': int(lex[w]['W']), 'der_P': int(lex[w]['P']),
                     'base_W': int(lex[b]['W']), 'base_P': int(lex[b]['P']),
                     'andrews_der': int(strip_marks(w) in andrews),
                     'der_gloss': gl(lex, w, 160), 'base_gloss': gl(lex, b, 160)})

# words with hoʻo-shape but no attested base
unbased = [w for w in lex if (w.startswith('hoʻo') or w.startswith('hō') or (w.startswith('hoʻ') and len(w) > 3 and w[3] in VOW))
           and not any(r['derived'] == w for r in rows)]

with open(f'{W}/tables/hoo_pairs.tsv', 'w') as f:
    wr = csv.DictWriter(f, fieldnames=list(rows[0].keys()), delimiter='\t')
    wr.writeheader(); wr.writerows(rows)
with open(f'{W}/tables/hoo_unbased.tsv', 'w') as f:
    for w in sorted(unbased):
        f.write(f"{w}\t{int(lex[w]['W'])}\t{int(lex[w]['P'])}\t{wcat.get(w,'')}\t{gl(lex,w,140)}\n")

print('lexicon words with hoʻo-/hō-/hoʻV- shape:', len(unbased) + len({r['derived'] for r in rows}))
print('  with an attested base (pairs):', len(rows), 'distinct derived:', len({r['derived'] for r in rows}))
print('  without attested base:', len(unbased))
print('Wiktionary-analysed hoʻo-type words:', len(wpairs), '; of which base in lexicon:', sum(1 for w,(p,b) in wpairs.items() if b in lex and w in lex))
print('Wiktionary category members (hoʻo-/hō-/hoʻ-/hōʻ-/ho-):', Counter(wcat.values()))
print('allomorph counts in pairs:', Counter(r['allomorph'] for r in rows))
print('pairs by source: wikt-analysis', sum(r['src_wikt_analysis'] for r in rows),
      'formal-only', sum(1 for r in rows if not r['src_wikt_analysis']))
print('both forms in POLLEX (P&E):', sum(1 for r in rows if r['der_P'] and r['base_P']))
print('derived in Andrews headwords:', sum(r['andrews_der'] for r in rows))
