"""KWIC lines for DET + head + modifier pairs.  usage: kwic.py head [n_per_pair] [min_f]"""
import sys, csv, os, collections
import corpus_pages
HERE = os.path.dirname(os.path.abspath(__file__))
h = sys.argv[1]; n = int(sys.argv[2]) if len(sys.argv) > 2 else 2; mf = int(sys.argv[3]) if len(sys.argv) > 3 else 2
rows = [r for r in csv.DictReader(open(os.path.join(HERE, '..', 'tables', 'colloc_all.tsv')), delimiter='\t')
        if r['head'] == h and int(r['f']) >= mf and int(r['df']) >= 2 and r['gram'] == 'False']
want = {r['mod'] for r in rows}
DET = set('ka ke nā he kēia kēlā kēnā ia kekahi mau kona kāna koʻu kaʻu kou kāu ko kā kō'.split())
kw = collections.defaultdict(list)
keep, _ = corpus_pages.load()
for pi, s in keep:
    t = [x for x, _ in s]
    for i in range(1, len(t) - 1):
        if t[i] == h and t[i + 1] in want and t[i - 1] in DET and len(kw[t[i + 1]]) < n:
            kw[t[i + 1]].append(' '.join(t[max(0, i - 4): i + 6]))
for r in sorted(rows, key=lambda r: -int(r['f'])):
    print(f"{h} {r['mod']} ({r['f']}): " + ' || '.join(kw[r['mod']]))
