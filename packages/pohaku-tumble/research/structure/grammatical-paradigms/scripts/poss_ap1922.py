"""19th-century cross-check of a/o choice: lowercase 'kana' (= kāna, a-class) vs 'kona'
(o-class) + noun in the Andrews-Parker 1922 OCR (citations) and Andrews 1854 grammar OCR.
Undiacritised, so only the 3sg pair (distinct letters) is testable.  Categories as in
possessives.py, matched on undiacritised spelling.  Output: tables/poss_ap1922.txt"""
import re, os, collections, common, possessives as P
cat={}
for w,c in P.NOUN2CAT.items(): cat.setdefault(common.strip_marks(w),c)
texts={'A-P 1922':open(f'{common.CACHE}/andrews-parker1922.txt',encoding='utf-8').read(),
       'Andrews 1854':open(os.path.join(common.HERE,'src','andrews1854.txt'),encoding='utf-8',errors='ignore').read()}
skip={'mau','poe','wahi'}
out=[]
for name,t in texts.items():
    t=t.replace("'",'')
    toks=re.findall(r'[A-Za-z]+',re.sub(r'-\n','',t))
    c=collections.defaultdict(lambda:{'a':0,'o':0})
    for i,w in enumerate(toks[:-2]):
        if w in ('kana','kona'):
            j=i+1
            if toks[j].lower() in skip: j+=1
            n=toks[j].lower()
            c[n]['a' if w=='kana' else 'o']+=1
    tot=agree=0; per=collections.defaultdict(lambda:[0,0])
    for n,d in c.items():
        k=cat.get(n)
        if not k: continue
        pred=P.CAT[k][0]
        tot+=d['a']+d['o']; agree+=d[pred]; per[k][0]+=d['a']+d['o']; per[k][1]+=d[pred]
    out.append(f'{name}: kana {sum(d["a"] for d in c.values())} / kona {sum(d["o"] for d in c.values())} tokens; '
               f'coded nouns {tot} tokens, in predicted class {agree} ({100*agree/max(tot,1):.1f}%)')
    for k,(n,a) in sorted(per.items(),key=lambda kv:-kv[1][0]):
        out.append(f'   {k:13s} {n:4d} {a:4d}')
    top=sorted(c.items(),key=lambda kv:-(kv[1]['a']+kv[1]['o']))[:30]
    out.append('   top nouns (a/o): '+', '.join(f"{n}({d['a']}/{d['o']})" for n,d in top))
open(os.path.join(common.HERE,'tables','poss_ap1922.txt'),'w').write('\n'.join(out)+'\n')
print('\n'.join(out))
