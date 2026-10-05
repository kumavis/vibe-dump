"""Verbs attested with both mai and aku (either corpus), with counts from both corpora
and the Wiktionary verb gloss.  Output: tables/dir_pairs.tsv"""
import os, csv, common
HERE=common.HERE
w={r['verb']:r for r in csv.DictReader(open(os.path.join(HERE,'tables','dir_verb_hosts.tsv')),delimiter='\t')}
wall={r['host']:r for r in csv.DictReader(open(os.path.join(HERE,'tables','dir_hosts.tsv')),delimiter='\t')}
a={r['host']:r for r in csv.DictReader(open(os.path.join(HERE,'tables','dir_ap1922.tsv')),delimiter='\t')}
k=common.load_kaikki()
verbs={}
for word,es in k.items():
    for e in es:
        if e['pos']=='verb' and e['glosses']:
            verbs.setdefault(common.strip_marks(word),[]).append((word,'; '.join(e['glosses'][:2])[:70]))
rows=[]
keys=set()
for h,r in w.items():
    if int(r['mai']) and int(r['aku']): keys.add(common.strip_marks(h))
for h,r in a.items():
    if int(r['mai']) and int(r['aku']) and h in verbs: keys.add(h)
for s in sorted(keys):
    wr=next((r for h,r in w.items() if common.strip_marks(h)==s),None)
    ar=a.get(s)
    gl=verbs.get(s,[('', '')])
    rows.append((gl[0][0] or s, wr['mai'] if wr else 0, wr['aku'] if wr else 0, wr['aʻe'] if wr else 0, wr['iho'] if wr else 0,
                 ar['mai'] if ar else 0, ar['aku'] if ar else 0, ar['ae'] if ar else 0, ar['iho'] if ar else 0, ' | '.join(g for _,g in gl[:2])))
with open(os.path.join(HERE,'tables','dir_pairs.tsv'),'w') as fh:
    fh.write('verb\tWP_mai\tWP_aku\tWP_ae\tWP_iho\tAP_mai\tAP_aku\tAP_ae\tAP_iho\twiktionary_verb_gloss\n')
    for r in rows: fh.write('\t'.join(map(str,r))+'\n')
for r in rows: print(r)
print(len(rows))
