#!/usr/bin/env python3
# Pretty-print a results TSV with selected columns: show.py file.tsv [col,col,...] [filter-substring]
import sys, csv
f = sys.argv[1]
cols = (sys.argv[2] if len(sys.argv) > 2 and sys.argv[2] else 'engine,lex,grid,retry,pairs,dealt,stallRate,stuck,stuckStrict,frozen,linked,repeatRate,bounce,seenFrac,GOOD,JUKUGO_LIKE').split(',')
flt = sys.argv[3] if len(sys.argv) > 3 else ''
rows = list(csv.DictReader(open(f), delimiter='\t'))
rows = [r for r in rows if (r["engine"] in flt.split("|")) if flt.startswith("=") is False and False] or ([r for r in rows if r["engine"] in flt[1:].split("|")] if flt.startswith("=") else [r for r in rows if flt in "\t".join(r.values())])
w = {c: max(len(c), *(len(str(r.get(c, ''))) for r in rows)) if rows else len(c) for c in cols}
print('  '.join(c.ljust(w[c]) for c in cols))
for r in rows: print('  '.join(str(r.get(c, '')).replace('curve-', '').ljust(w[c]) for c in cols))
