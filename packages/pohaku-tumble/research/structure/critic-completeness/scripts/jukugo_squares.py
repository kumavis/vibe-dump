"""Formal a:b::c:d squares in Jukugo Tumble's own word list (baseline for the Hawaiian frames).
A square = A1B1, A1B2, A2B1, A2B2 all in the list (A = first char, B = second char).
Read-only input: packages/jukugo-tumble/src/data/words.js"""
import re, json, itertools, collections
src = open('packages/jukugo-tumble/src/data/words.js', encoding='utf-8').read()
body = src.split('`')[1]
words = []
for ln in body.splitlines():
    ln = ln.strip()
    if not ln or ln.startswith('//'): continue
    w = ln.split()[0]
    if len(w) == 2: words.append(w)
S = set(words)
first = collections.defaultdict(set); second = collections.defaultdict(set)
for w in S:
    first[w[0]].add(w[1]); second[w[1]].add(w[0])
sq = set()
for a1, a2 in itertools.combinations(first, 2):
    common = first[a1] & first[a2]
    for b1, b2 in itertools.combinations(sorted(common), 2):
        sq.add((a1, a2, b1, b2))
inq = set()
for a1, a2, b1, b2 in sq:
    inq |= {a1+b1, a1+b2, a2+b1, a2+b2}
print(f'jukugo words {len(S)}; slot-1 chars {len(first)}; slot-2 chars {len(second)}')
print(f'formal squares {len(sq)}; words in >=1 square {len(inq)} ({len(inq)/len(S):.0%})')
print('mean alternatives slot1 / slot2:', round(sum(len(second[w[1]])-1 for w in S)/len(S),2), round(sum(len(first[w[0]])-1 for w in S)/len(S),2))
import random; random.seed(20261004)
print('sample squares:', random.sample(sorted(sq), 12))
