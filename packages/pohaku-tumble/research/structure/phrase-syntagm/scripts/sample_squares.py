"""Draw squares for hand-checking (seeded): 20 from all stable squares, 20 from
squares whose heads are neither mea nor hana.  Prints, for every pair, one corpus
line (KWIC) so the reading can be checked."""
import csv, random, os, collections
import corpus_pages, lex
HERE = os.path.dirname(os.path.abspath(__file__))
T = os.path.join(HERE, '..', 'tables')
sq = list(csv.DictReader(open(os.path.join(T, 'squares_stable.tsv')), delimiter='\t'))
rnd = random.Random(20261004)
A = rnd.sample(sq, 20)
B = rnd.sample([s for s in sq if not ({s['h1'], s['h2']} & {'mea', 'hana'})], 20)
keep, _ = corpus_pages.load()
DET = set('ka ke nā he kēia kēlā kēnā ia kekahi mau kona kāna koʻu kaʻu kou kāu ko kā kō'.split())
kw = collections.defaultdict(list)
need = set()
for s in A + B:
    for h in (s['h1'], s['h2']):
        for m in (s['m1'], s['m2']):
            need.add((h, m))
for pi, s in keep:
    toks = [t for t, _ in s]
    for i in range(1, len(toks) - 1):
        if (toks[i], toks[i + 1]) in need and toks[i - 1] in DET and len(kw[(toks[i], toks[i + 1])]) < 2:
            kw[(toks[i], toks[i + 1])].append(' '.join(toks[max(0, i - 4): i + 6]))
W, _ = lex.wikt()
def g(w):
    return ' / '.join('; '.join(e['glosses'])[:35] for e in W.get(w, []) if e['pos'] in ('noun', 'verb'))[:80]
with open(os.path.join(T, 'square_sample.txt'), 'w') as f:
    for tag, S in (('A', A), ('B', B)):
        for k, s in enumerate(S):
            f.write(f"\n[{tag}{k+1}] {s['h1']} / {s['h2']}  x  {s['m1']} / {s['m2']}\n")
            for w in (s['h1'], s['h2'], s['m1'], s['m2']):
                f.write(f'    {w}: {g(w)}\n')
            for h in (s['h1'], s['h2']):
                for m in (s['m1'], s['m2']):
                    f.write(f'    {h} {m}: ' + ' || '.join(kw[(h, m)]) + '\n')
print(open(os.path.join(T, 'square_sample.txt')).read())
