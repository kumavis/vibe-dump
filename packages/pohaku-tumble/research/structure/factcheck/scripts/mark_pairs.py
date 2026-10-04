"""Independent re-count of one-ʻokina and one-length minimal pairs.
(a) Wiktionary content forms (noun/verb/adj/adv with a gloss that is not 'alternative form/spelling of',
    native letters only, not borrowed).  (b) POLLEX Hawaiian forms (P&E spellings), with same-etymon test.
Output -> ../tables/mark_pairs.txt"""
import json, unicodedata, re, os
from collections import defaultdict, Counter
HERE=os.path.dirname(os.path.abspath(__file__))
CACHE='roots/.cache'
OK='ʻ'
def norm(w):
    w=unicodedata.normalize('NFC',w)
    for c in "'‘’ʼ`": w=w.replace(c,OK)
    return w.lower().strip()
NAT=re.compile(r'^[aeiouāēīōūhklmnpwʻ]+$')
LONG={'ā':'a','ē':'e','ī':'i','ō':'o','ū':'u'}
out=[]; p=lambda *a: out.append(' '.join(str(x) for x in a))
# (a) Wiktionary
lex=defaultdict(list)
for line in open(f'{CACHE}/kaikki-haw.jsonl'):
    e=json.loads(line)
    if e.get('pos') not in ('noun','verb','adj','adv'): continue
    loan=any(t['name'] in ('bor','bor+','lbor') for t in e.get('etymology_templates',[]))
    if loan: continue
    w=norm(e['word'])
    if not NAT.match(w): continue
    gl=[g for s in e.get('senses',[]) for g in s.get('glosses',[]) if not re.search(r'(alternative|spelling|form) of|Niʻihau|Lānaʻi|misspelling',g)]
    if not gl: continue
    lex[w].extend(gl)
forms=set(lex)
p('wiktionary content forms',len(forms))
def okina_pairs(fs):
    res=[]
    for w in fs:
        for i,ch in enumerate(w):
            if ch==OK:
                v=w[:i]+w[i+1:]
                if v in fs: res.append((v,w))
    return res
def length_pairs(fs):
    res=[]
    for w in fs:
        for i,ch in enumerate(w):
            if ch in LONG:
                v=w[:i]+LONG[ch]+w[i+1:]
                if v in fs: res.append((v,w))
    return res
op=okina_pairs(forms); lp=length_pairs(forms)
p('W okina pairs',len(op)); p('W length pairs',len(lp))
pl=[(a,b) for a,b in lp if any(re.search(r'plural of '+re.escape(a)+r'\b',g) for g in lex[b])]
p('W length pairs where long member is glossed "plural of" short:',len(pl),pl)
p('W length pairs by vowel',Counter([[c for c in b if c in LONG][0] if False else next(c for c,d in zip(b,a) if c!=d) for a,b in lp]))
# okina pairs sharing a gloss word (crude)
STOP=set('a an the of to or and in on be as with by for from at is it that this one any kind sp species type used make made being having'.split())
def words(gs): return {x for g in gs for x in re.findall(r'[a-z]{4,}',g.lower())}-STOP
shared=[(a,b,sorted(words(lex[a])&words(lex[b]))) for a,b in op if words(lex[a])&words(lex[b])]
p('W okina pairs sharing a 4+-letter gloss word',len(shared),shared)
# (b) POLLEX
rows=json.load(open(f'{CACHE}/pollex/hawaiian-reflexes.json'))
pf=defaultdict(set)
for r in rows:
    for f in r.get('haw_forms') or [r['haw']]:
        f=norm(f)
        if NAT.match(f): pf[f].add(r['proto_ng'] if r.get('proto_ng') else r['proto'])
P=set(pf)
p('POLLEX native single-word forms',len(P))
pop=okina_pairs(P); plp=length_pairs(P)
def rel(a,b):
    A=pf[a]; B=pf[b]
    if A&B: return True
    segA={s for x in A for s in x.strip('*').split('-') if len(x.split('-'))>1}
    segB={s for x in B for s in x.strip('*').split('-') if len(x.split('-'))>1}
    return bool((segA|{x.strip('*') for x in A}) & (segB|{x.strip('*') for x in B}) and (segA or segB))
rp=[(a,b,sorted(pf[a]),sorted(pf[b])) for a,b in pop if rel(a,b)]
p('P okina pairs',len(pop),'same etymon or shared hyphen-segment',len(rp)); [p('   ',x) for x in rp]
rl=[(a,b,sorted(pf[a]),sorted(pf[b])) for a,b in plp if rel(a,b)]
p('P length pairs',len(plp),'related',len(rl)); [p('   ',x) for x in rl]
open(os.path.join(HERE,'../tables/mark_pairs.txt'),'w').write('\n'.join(out)+'\n')
print('\n'.join(out))
