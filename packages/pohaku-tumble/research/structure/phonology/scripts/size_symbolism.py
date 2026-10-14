#!/usr/bin/env python3
"""Exploratory only: do words glossed 'small/tiny/little' contain more /i/ than
words glossed 'big/large/great/huge' (the cross-linguistic magnitude symbolism
of Sapir 1929 / Ultan 1978)?  Content forms whose FIRST gloss of any content
entry contains the key word.  Reports vowel shares and a permutation p-value."""
import json, os, re, random, collections
random.seed(3)
HERE = os.path.dirname(os.path.abspath(__file__))
lex = json.load(open(os.path.join(HERE, 'lexicon.json')))
L2S = dict(zip('āēīōū', 'aeiou'))
small, big = [], []
for w, r in lex.items():
    if not (r['native'] and r['content'] and not r['proper'] and not r['loan']):
        continue
    gl = ' ; '.join(g for e in r['entries'] if e['pos'] in ('verb', 'adj', 'noun') for g in e['glosses'][:1]).lower()
    if re.search(r'\b(small|tiny|little|minute|petty)\b', gl):
        small.append(w)
    if re.search(r'\b(big|large|great|huge|enormous|immense|vast)\b', gl):
        big.append(w)
def ishare(ws):
    vs = [L2S.get(c, c) for w in ws for c in w if L2S.get(c, c) in 'aeiou']
    return sum(1 for v in vs if v == 'i') / max(1, len(vs)), len(vs)
si, sn = ishare(small); bi, bn = ishare(big)
allw = small + big
diff = si - bi
cnt = 0
for _ in range(5000):
    random.shuffle(allw)
    a, b = allw[:len(small)], allw[len(small):]
    if ishare(a)[0] - ishare(b)[0] >= diff:
        cnt += 1
base = ishare([w for w, r in lex.items() if r['native'] and r['content']])[0]
print(f'small-words: {len(small)} words, {sn} vowels, /i/ share {si:.3f}')
print(f'big-words:   {len(big)} words, {bn} vowels, /i/ share {bi:.3f}')
print(f'lexicon /i/ share {base:.3f}; permutation p(small-big >= observed) = {(cnt+1)/5001:.3f}')
print('small:', sorted(small)); print('big:', sorted(big))
