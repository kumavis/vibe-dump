"""Kin GEN x SEX cells in the cleaned corpus (spaced bigram + solid form). Output -> ../tables/kin_frame.txt"""
import pickle, os
from collections import Counter
HERE=os.path.dirname(os.path.abspath(__file__))
C=pickle.load(open(os.path.join(HERE,'../../grammatical-paradigms/corpus.pkl'),'rb'))
sents=[[t for t,_ in s] for s in C[0]]
uni=Counter(t for s in sents for t in s); big=Counter((a,b) for s in sents for a,b in zip(s,s[1:]))
out=[]
for g in ['kupuna','kūpuna','makua','mākua','keiki','moʻopuna']:
    for x in ['kāne','wahine','kane']:
        out.append(f'{g} {x}: spaced {big[(g,x)]} solid {uni[g+x]}')
for w in ['makuahine','kupunahine','kaikamahine','keikikāne','makuakāne']:
    out.append(f'{w}: {uni[w]}')
open(os.path.join(HERE,'../tables/kin_frame.txt'),'w').write('\n'.join(out)+'\n'); print('\n'.join(out))
