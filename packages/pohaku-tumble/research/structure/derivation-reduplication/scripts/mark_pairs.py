"""Single-mark minimal pairs in the attested lexicon (one kahakō added/removed, or one ʻokina added/removed),
and how many of them are morphologically related (the plural-lengthening series, or a gloss overlap flagged for review).
Answers: is a one-mark switch ever *significant* (a morpheme) rather than merely distinctive?"""
import re
from collections import Counter
from common import *
lex = lexicon()
words = [w for w in lex if is_haw(w)]
S = set(words)
STOP = set('a an the of to or and in on for as be is by with from that this any one its it at not being which used who form alternative variant used'.split())
def cw(w):
    g = ' '.join(lex[w]['glosses'] + lex[w]['pgloss']).lower()
    return {t for t in re.findall(r'[a-z]+', g) if t not in STOP and len(t) > 2}
plural = set()
for w in words:
    for g in lex[w]['glosses']:
        m = re.match(r'plural of (\S+)$', g)
        if m: plural.add(frozenset((w, norm(m.group(1)))))
length_pairs, okina_pairs = set(), set()
for w in words:
    for i, c in enumerate(w):
        if c in LONG:
            v = w[:i] + LONG[c] + w[i+1:]
            if v in S: length_pairs.add(frozenset((w, v)))
        if c == OK:
            v = w[:i] + w[i+1:]
            if v in S and v: okina_pairs.add(frozenset((w, v)))
def summarize(name, pairs):
    rel = []; unrel = 0; pl = 0
    for p in pairs:
        a, b = tuple(p)
        if p in plural: pl += 1; continue
        ov = cw(a) & cw(b)
        if ov: rel.append((a, b, sorted(ov)[:4]))
        else: unrel += 1
    print(f'{name}: {len(pairs)} pairs; plural series {pl}; gloss overlap (candidate related) {len(rel)}; no overlap {unrel}')
    return rel
r1 = summarize('one-kahakō pairs', length_pairs)
for x in sorted(r1): print('   ', x)
r2 = summarize('one-ʻokina pairs', okina_pairs)
for x in sorted(r2): print('   ', x)
