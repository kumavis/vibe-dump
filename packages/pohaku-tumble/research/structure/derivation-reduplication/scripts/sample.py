"""Draw seeded random samples for manual semantic coding; prints full glosses."""
import csv, random, sys
from common import *
lex = lexicon()
def load(p): return list(csv.DictReader(open(p), delimiter='\t'))
which, n = sys.argv[1], int(sys.argv[2])
rows = load(f'{W}/tables/{which}_pairs.tsv')
random.seed(20261004)
s = rows if n >= len(rows) else random.sample(rows, n)
for i, r in enumerate(s):
    d, b = r['derived'], r['base']
    print(f"{i+1}. {d} <- {b} [{r.get('allomorph') or r.get('pattern') or r.get('affix')}]")
    print('   D:', gl(lex, d, 330)); print('   B:', gl(lex, b, 330))
