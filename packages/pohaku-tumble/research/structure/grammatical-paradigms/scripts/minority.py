"""Print every minority-class (against the grammars' prediction) token for coded
possessum nouns, with wider context, for hand classification (minority_coded.tsv)."""
import collections, common, possessives as P
sents,_=common.corpus()
uni=common.unigram_counts(sents)
canon={}
for t,n in uni.most_common(): canon.setdefault(common.strip_marks(t),t)
out=[]
for s in sents:
    toks=[t for t,_ in s]
    for i,(t,cap) in enumerate(s):
        cls=None
        if not cap and t in P.A_FORMS: cls,j='a',i+1
        elif not cap and t in P.O_FORMS: cls,j='o',i+1
        elif t in ('kā','ko','kō') and i+1<len(s) and common.strip_marks(toks[i+1]) in P.NSG_STRIP: cls,j=('a' if t=='kā' else 'o'),i+2
        if cls is None or j>=len(s): continue
        if toks[j]=='mau' and j+1<len(s): j+=1
        n=canon.get(common.strip_marks(toks[j]),toks[j])
        if j+1<len(s) and toks[j+1]=='ʻana': continue
        cat=P.NOUN2CAT.get(n)
        if not cat: continue
        pred=P.CAT[cat][0]
        if cls!=pred:
            out.append((n,cat,pred,cls,' '.join(toks[max(0,i-8):j+8])))
out.sort()
import os
with open(os.path.join(common.HERE,'tables','minority_raw.tsv'),'w') as fh:
    for r in out: fh.write('\t'.join(r)+'\n')
print(len(out),'minority tokens written')
