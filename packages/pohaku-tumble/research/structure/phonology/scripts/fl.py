#!/usr/bin/env python3
"""Functional load of each opposition.

(a) Hockett/Surendran-Niyogi entropy measure on Hawaiian Wikipedia word tokens:
    FL(x,y) = (H(W) - H(W merged)) / H(W), H over the word-type distribution.
    Computed for all tokens and for tokens of Wiktionary content words only.
(b) Lexicon merger counts: how many Wiktionary content forms lose their
    distinctness (fall together with another form) under each merger.
(c) The orthographic version: what writing without ʻokina and/or kahakō (as in
    Andrews 1865/1922 and most 19th-c. print) does to the lexicon and corpus.
"""
import json, os, math, collections, itertools
HERE = os.path.dirname(os.path.abspath(__file__))
OK = 'ʻ'
SV = 'aeiou'; LV = 'āēīōū'
L2S = dict(zip(LV, SV)); S2L = dict(zip(SV, LV))
CONS = 'pkhmnlw' + OK
corp = json.load(open(os.path.join(HERE, 'corpus_counts.json')))
lex = json.load(open(os.path.join(HERE, 'lexicon.json')))
FUNC_POS = {'pron', 'det', 'prep', 'particle', 'article', 'conj'}
content = {w for w, r in lex.items() if r['native'] and r['content'] and not r['proper'] and not r['loan']}
function = {w for w, r in lex.items() if any(e['pos'] in FUNC_POS for e in r['entries'])}


def H(counter):
    n = sum(counter.values())
    return -sum(v / n * math.log2(v / n) for v in counter.values() if v)


def merged(counter, f):
    c = collections.Counter()
    for w, n in counter.items():
        c[f(w)] += n
    return c


def mk_sub(x, y):
    tbl = {x: y}
    if x in SV and y in SV:
        tbl[S2L[x]] = S2L[y]
    return lambda w: ''.join(tbl.get(ch, ch) for ch in w)


ops = {}
ops['ʻokina vs Ø (delete ʻ)'] = lambda w: w.replace(OK, '')
ops['vowel length (all five)'] = lambda w: ''.join(L2S.get(c, c) for c in w)
for v in SV:
    ops[f'length {v}/{S2L[v]}'] = (lambda vv: (lambda w: w.replace(S2L[vv], vv)))(v)
ops['ʻokina + length (19th-c. spelling)'] = lambda w: ''.join(L2S.get(c, c) for c in w.replace(OK, ''))
for x, y in itertools.combinations(CONS, 2):
    ops[f'C {x}/{y}'] = mk_sub(x, y)
for x, y in itertools.combinations(SV, 2):
    ops[f'V {x}/{y} (short+long)'] = mk_sub(x, y)
ops['h vs Ø'] = lambda w: w.replace('h', '')

tok_all = collections.Counter(corp)
tok_content = collections.Counter({w: n for w, n in corp.items() if w in content and w not in function})
Hall, Hcon = H(tok_all), H(tok_content)
rows = []
for name, f in ops.items():
    fa = (Hall - H(merged(tok_all, f))) / Hall
    fc = (Hcon - H(merged(tok_content, f))) / Hcon
    # lexicon: content forms that collide
    groups = collections.defaultdict(list)
    for w in content:
        groups[f(w)].append(w)
    lost = sum(len(g) for g in groups.values() if len(g) > 1)
    rows.append((name, fa, fc, lost))
rows.sort(key=lambda r: -r[1])
res = {'H_all_bits': Hall, 'H_content_bits': Hcon, 'tokens_all': sum(tok_all.values()), 'tokens_content': sum(tok_content.values()),
       'types_all': len(tok_all), 'types_content': len(tok_content), 'content_lexicon': len(content),
       'rows': rows}
# orthographic detail: which high-frequency corpus words merge if ʻ and kahakō are dropped
f = ops['ʻokina + length (19th-c. spelling)']
g = collections.defaultdict(list)
for w, n in tok_all.items():
    g[f(w)].append((w, n))
amb = [(k, sorted(v, key=lambda x: -x[1])) for k, v in g.items() if len(v) > 1]
amb.sort(key=lambda kv: -sum(n for _, n in kv[1]))
res['tokens_in_ambiguous_19c_spellings'] = sum(n for _, v in amb for _, n in v) / sum(tok_all.values())
res['top_19c_collisions'] = amb[:30]
json.dump(res, open(os.path.join(HERE, 'fl.json'), 'w'), ensure_ascii=False, indent=1)
print(f"H(all)={Hall:.3f} bits over {res['types_all']} types / {res['tokens_all']} tokens; H(content)={Hcon:.3f} over {res['types_content']} types / {res['tokens_content']} tokens; lexicon {len(content)} content forms")
print('| opposition | FL all tokens | FL content tokens | content forms that collide |')
print('|---|---|---|---|')
for name, fa, fc, lost in rows:
    print(f'| {name} | {100*fa:.2f}% | {100*fc:.2f}% | {lost} |')
print('tokens in spellings ambiguous without ʻ/kahakō:', res['tokens_in_ambiguous_19c_spellings'])
for k, v in amb[:20]:
    print(k, v[:5])
