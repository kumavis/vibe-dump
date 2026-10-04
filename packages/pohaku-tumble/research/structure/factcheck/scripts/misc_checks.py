"""(1) orthographic merger share without ʻokina/kahakō; (2) hō- vs hoʻo- before ʻ-initial bases;
(3) Wiktionary dialect-form labels (Niʻihau, Lānaʻi). Output -> ../tables/misc_checks.txt"""
import json, unicodedata, re, os
from collections import defaultdict, Counter
HERE=os.path.dirname(os.path.abspath(__file__))
CACHE='roots/.cache'
OK='ʻ'
def norm(w):
    w=unicodedata.normalize('NFC',w)
    for c in "'‘’ʼ`": w=w.replace(c,OK)
    return w.lower().strip()
LONG={'ā':'a','ē':'e','ī':'i','ō':'o','ū':'u'}
strip=lambda w: ''.join(LONG.get(c,c) for c in w.replace(OK,''))
NAT=re.compile(r'^[aeiouāēīōūhklmnpwʻ]+$')
out=[]; p=lambda *a: out.append(' '.join(str(x) for x in a))
lex=defaultdict(list); allw=set(); dial=Counter(); dial_ex=defaultdict(list)
for line in open(f'{CACHE}/kaikki-haw.jsonl'):
    e=json.loads(line); w=norm(e['word']); allw.add(w)
    for s in e.get('senses',[]):
        for g in s.get('glosses',[]):
            m=re.match(r"^(Niʻihau|Ni'ihau|Lānaʻi|Lāna'i|Kauaʻi|Molokaʻi|Maui)\s+(form|spelling)\s+of\s+(\S+)",g)
            if m: dial[m.group(1)]+=1; dial_ex[m.group(1)].append((w,norm(m.group(3))))
    if e.get('pos') not in ('noun','verb','adj','adv'): continue
    if any(t['name'] in ('bor','bor+','lbor') for t in e.get('etymology_templates',[])): continue
    if not NAT.match(w): continue
    gl=[g for s in e.get('senses',[]) for g in s.get('glosses',[]) if not re.search(r'(alternative|spelling|form) of',g)]
    if gl: lex[w]+=gl
F=set(lex)
by=defaultdict(set)
for w in F: by[strip(w)].add(w)
merged=sum(1 for w in F if len(by[strip(w)])>1)
p('content forms',len(F),'merged by stripping marks',merged,round(merged/len(F)*100,1),'%')
p('dialect labels',dict(dial))
for k,v in dial_ex.items(): p(' ',k,v[:12])
# hō- / hoʻo- before ʻ-initial bases (any Wiktionary headword as base)
ho=Counter(); ex=defaultdict(list)
for w in allw:
    if w.startswith('hōʻ') and len(w)>4:
        b=w[2:]
        if b in allw: ho['hō-+ʻX']+=1; ex['hō'].append(w)
    if w.startswith('hoʻoʻ'):
        b=w[4:]
        if b in allw: ho['hoʻo-+ʻX']+=1; ex['hoʻo'].append(w)
p('hō/hoʻo before ʻ-initial bases (string test, base is a headword):',dict(ho)); p(' ',dict(ex))
open(os.path.join(HERE,'../tables/misc_checks.txt'),'w').write('\n'.join(out)+'\n')
print('\n'.join(out))
