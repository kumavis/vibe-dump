"""Fact-check re-runs on the cleaned Hawaiian Wikipedia corpus (grammatical-paradigms/corpus.pkl).
Independent code; reads only. Output -> ../tables/corpus_checks.txt"""
import pickle, os, re
from collections import Counter
HERE=os.path.dirname(os.path.abspath(__file__))
C=pickle.load(open(os.path.join(HERE,'../../grammatical-paradigms/corpus.pkl'),'rb'))
sents=[[t for t,_ in s] for s in C[0]]
toks=[t for s in sents for t in s]
uni=Counter(toks)
big=Counter((a,b) for s in sents for a,b in zip(s,s[1:]))
out=[]
p=lambda *a: out.append(' '.join(str(x) for x in a))
p('tokens',len(toks),'sentences',len(sents))
# 1 deixis, with and without diacritics
for w in ['kēia','keia','kēnā','kena','kēlā','kela','pēlā','pela','pēnā','pena','penei','nei','ʻaneʻi']:
    p('deixis',w,uni[w])
# 2 directional pairs
for v in ['hele','lawe','kūʻai','kuai','hiki','ʻoi','emi','hāʻawi','hoʻi']:
    p('dir',v,'mai',big[(v,'mai')],'aku',big[(v,'aku')],'aʻe',big[(v,'aʻe')],'iho',big[(v,'iho')])
# 3 ka/ke KEAO rule: ke before k, e, a, o initial; ka otherwise
VOW='aeiouāēīōū'
def keao(w):
    c=w[0]
    if c in 'keao': return 'ke'
    return 'ka'
ok=tot=0; perword=Counter(); 
native=re.compile(r'^[aeiouāēīōūhklmnpwʻ]+$')
pairs=Counter()
for s in sents:
    for a,b in zip(s,s[1:]):
        if a in('ka','ke') and native.match(b) and len(b)>1:
            pairs[(b,a)]+=1
# exclude function words following ke (TAM ke + verb is a confound; keep all, as the studies did report both)
for (b,a),n in pairs.items():
    tot+=n; ok+= n if keao(b)==a else 0
maj=Counter()
words={b for b,_ in pairs}
mok=0
for b in words:
    nka=pairs[(b,'ka')]; nke=pairs[(b,'ke')]; mok+=max(nka,nke)
p('ka/ke tokens',tot,'KEAO fit',round(ok/tot*100,1),'word-majority fit',round(mok/tot*100,1))
p('ke ʻano',pairs[('ʻano','ke')],'ka ʻano',pairs[('ʻano','ka')])
# 4 plural lengthening: long vs short form after plural determiners
PL={'nā','mau'}
SG={'ka','ke','he'}
pls=[('kanaka','kānaka'),('wahine','wāhine'),('makua','mākua'),('kupuna','kūpuna'),('kahuna','kāhuna'),('kaikamahine','kaikamāhine'),('luahine','luāhine'),('ʻelemakule','ʻelemākule'),('ʻaumakua','ʻaumākua'),('makuahine','mākuahine'),('kahiko','kāhiko')]
L_pl=S_pl=L_sg=S_sg=0
for sg,pl in pls:
    a=sum(big[(d,pl)] for d in PL); b=sum(big[(d,sg)] for d in PL); c=sum(big[(d,pl)] for d in SG); d_=sum(big[(d,sg)] for d in SG)
    L_pl+=a;S_pl+=b;L_sg+=c;S_sg+=d_
    p('plural',sg,pl,'tokens sg/pl',uni[sg],uni[pl],'after nā/mau: long',a,'short',b,'| after ka/ke/he: long',c,'short',d_)
p('ALL plural contexts: long',L_pl,'short',S_pl,'share long',round(L_pl/(L_pl+S_pl)*100,1),'| long form in plural ctx share of long-with-det',round(L_pl/(L_pl+L_sg)*100,1))
# 5 kin a/o share
A={'kāna','kaʻu','kāu','kā','kana','kau','ka\'u'}
O={'kona','koʻu','kou','ko','kō'}
for kin in ['kupuna','kūpuna','makua','mākua','makuahine','makuakāne','kaikuaʻana','kaikaina','keiki','kaikamahine','moʻopuna','wahine','kāne','inoa','kiʻi','moʻolelo','hale']:
    a=o=0
    for s in sents:
        for i,t in enumerate(s):
            if t!=kin: continue
            j=i-1
            if j>=0 and s[j]=='mau': j-=1
            if j>=0 and j< len(s):
                if s[j] in ('kāna','kaʻu','kāu','kā'): a+=1
                elif s[j] in ('kona','koʻu','kou','ko','kō'): o+=1
    p('a/o',kin,'a',a,'o',o, 'a-share', round(a/(a+o),2) if a+o else '-')
# 6 possessive grid counts
for w in ['aʻu','āu','āna','oʻu','ou','ona','kaʻu','kāu','kāna','koʻu','kou','kona','naʻu','nāu','nāna','noʻu','nou','nona','kuʻu','kō']:
    p('poss',w,uni[w])
for w in ['kāua','māua','lāua','ʻolua','ʻōlua','kākou','mākou','lākou','ʻoukou','au','wau','ʻoe']:
    p('pron',w,uni[w])
open(os.path.join(HERE,'../tables/corpus_checks.txt'),'w').write('\n'.join(out)+'\n')
print('\n'.join(out))
