"""Pronoun and possessive-grid frequencies (cleaned Hawaiian Wikipedia; Andrews-Parker 1922
OCR undiacritised) and the kā/ko + pronoun analytic possessives.  Output: tables/pronouns.txt"""
import os, re, collections, common
from paradigms import PRONOUNS, POSSESSIVES
HERE=common.HERE
sents,_=common.corpus()
uni=common.unigram_counts(sents)
strip=collections.Counter()
for t,n in uni.items(): strip[common.strip_marks(t)]+=n
ap=open(f'{common.CACHE}/andrews-parker1922.txt',encoding='utf-8').read().lower().replace("'",'')
apc=collections.Counter(re.findall(r'[a-z]+',ap))
out=['form | features | hawwiki exact | hawwiki same letters (any diacritics; homographs!) | A-P 1922 undiacritised']
for f,feat in PRONOUNS+POSSESSIVES:
    s=common.strip_marks(f)
    out.append(f"  {f:7s} {str(feat):60s} {uni[f]:5d} {strip[s]:6d} {apc[s]:5d}")
bg=collections.Counter()
for s in sents:
    toks=[t for t,_ in s]
    for i in range(len(toks)-1): bg[(toks[i],toks[i+1])]+=1
P=['kāua','māua','ʻolua','lāua','kākou','mākou','ʻoukou','lākou']
out.append('\nanalytic possessives (kā/ko/kō + pronoun), exact spelling of the pronoun:')
for p in P:
    out.append(f"  {p:7s} kā {bg[('kā',p)]:4d}  ko {bg[('ko',p)]:4d}  kō {bg[('kō',p)]:3d}  na {bg[('na',p)]:3d}  no {bg[('no',p)]:3d}  iā {bg[('iā',p)]:3d}  ʻo {bg[('ʻo',p)]:3d}")
out.append(f"\nʻo ia {bg[('ʻo','ia')]}, iā ia {bg[('iā','ia')]}, ʻo wau {bg[('ʻo','wau')]}, ʻo au {bg[('ʻo','au')]}, iaʻu {uni['iaʻu']}, iā ʻoe {bg[('iā','ʻoe')]}")
open(os.path.join(HERE,'tables','pronouns.txt'),'w').write('\n'.join(out)+'\n')
print('\n'.join(out))
