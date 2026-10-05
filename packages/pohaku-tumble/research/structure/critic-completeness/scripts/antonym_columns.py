"""Antonym/polar modifier columns that phrase-syntagm/scripts/colloc.py set aside as GRAM
(nui iki liʻiliʻi hou mua hope loa ʻole ...). Stable = f>=2, df>=2 in the DET frame (cleaned corpus).
Input (read-only): phrase-syntagm/tables/colloc_all.tsv"""
import csv, collections
S='(scratch)/structure'
rows=list(csv.DictReader(open(f'{S}/phrase-syntagm/tables/colloc_all.tsv'),delimiter='\t'))
by=collections.defaultdict(dict)
for r in rows:
    if int(r['f'])>=2 and int(r['df'])>=2: by[r['mod']][r['head']]=int(r['f'])
for m in ['nui','iki','liʻiliʻi','hou','kahiko','mua','hope','loa','ʻole']:
    print(f'{m:9s} gram={m in ("nui","iki","liʻiliʻi","hou","mua","hope","loa","ʻole")} heads={len(by[m]):3d}', sorted(by[m].items(), key=lambda x:-x[1])[:10])
for a,b in [('nui','iki'),('nui','liʻiliʻi'),('hou','kahiko'),('mua','hope')]:
    both=sorted(set(by[a])&set(by[b])); print(f'{a}/{b}: heads with both {len(both)} {both}')
