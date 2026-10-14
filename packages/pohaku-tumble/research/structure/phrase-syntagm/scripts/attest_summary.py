"""How lexicalised / verifiable are the phrase-frame pairs?  Share of DET-frame pairs
attested in a dictionary-type source, by frequency band and by source."""
import csv, os, collections
HERE = os.path.dirname(os.path.abspath(__file__))
rows = list(csv.DictReader(open(os.path.join(HERE, '..', 'tables', 'colloc_all.tsv')), delimiter='\t'))
lexr = [r for r in rows if r['gram'] == 'False' and not int(r['cap']) * 2 > int(r['f'])]
def band(r):
    f, df = int(r['f']), int(r['df'])
    if f >= 10 and df >= 5: return 'f>=10,df>=5'
    if f >= 2 and df >= 2: return 'f2-9 (df>=2)'
    return 'f=1 or df=1'
c = collections.defaultdict(collections.Counter)
src = collections.Counter()
for r in lexr:
    b = band(r)
    c[b]['pairs'] += 1
    a = r['attest']
    if a:
        c[b]['attested'] += 1
    for s in ('W2', 'W1', 'P2', 'P1', 'A1'):
        if s in a.split(','):
            src[(b, s)] += 1
    if 'R:' in a:
        src[(b, 'R')] += 1
    if 'W' in a or 'P' in a:
        c[b]['W_or_P'] += 1
for b in ('f>=10,df>=5', 'f2-9 (df>=2)', 'f=1 or df=1'):
    d = c[b]
    print(b, dict(d), f"attested share {d['attested']/d['pairs']:.2f}; W or P share {d['W_or_P']/d['pairs']:.2f}",
          {s: src[(b, s)] for s in ('W2', 'W1', 'P2', 'P1', 'A1', 'R')})
tot = sum(c[b]['pairs'] for b in c); att = sum(c[b]['attested'] for b in c)
print('all', tot, att, round(att / tot, 3))
# assoc collocations (PMI>=3, G2>=10.83, f>=2, df>=2)
ass = [r for r in lexr if int(r['f']) >= 2 and int(r['df']) >= 2 and float(r['pmi']) >= 3 and float(r['G2']) >= 10.83]
print('assoc collocations', len(ass), 'attested', sum(1 for r in ass if r['attest']))
