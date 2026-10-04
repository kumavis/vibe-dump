"""Head-initial check in the corpus: for common stative modifiers S and the study's
heads H, count DET H S (modifier after head) vs DET S H (modifier before head)."""
import collections
import corpus_pages
from colloc import HEADS, DET
S = 'kahiko kiʻekiʻe maikaʻi kaulana liʻiliʻi nui koʻikoʻi hou nani ʻōpio'.split()
keep, _ = corpus_pages.load()
post = collections.Counter(); pre = collections.Counter()
for pi, s in keep:
    t = [x for x, _ in s]
    for i in range(len(t) - 2):
        if t[i] in DET:
            if t[i + 1] in HEADS and t[i + 2] in S:
                post[t[i + 2]] += 1
            if t[i + 1] in S and t[i + 2] in HEADS:
                pre[t[i + 1]] += 1
print('stative\tDET H S\tDET S H')
for x in S:
    print(f'{x}\t{post[x]}\t{pre[x]}')
print('total', sum(post.values()), sum(pre.values()))
