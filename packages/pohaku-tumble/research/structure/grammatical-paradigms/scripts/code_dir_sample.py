"""My hand classification of tables/dir_sample.txt (random sample, seed 7, of directional
tokens whose host is a Wiktionary verb).  Codes:
 D  spatial/deictic directional (mai toward the deictic centre, aku away, aʻe up, iho down),
    incl. arrival/transfer readings (hiki mai 'arrive, come', kūʻai aku 'sell')
 P  mai = preposition 'from' (mai X, mai X mai)
 C  comparative / degree (ʻoi aku 'more', hou aʻe 'more', emi iho 'less', liʻiliʻi iho)
 T  temporal (i hala aku nei 'ago')
 L  lexicalised: ʻē aʻe 'other', kahi aʻe 'another place'
 N  narrative iho/ihola 'thereupon' (Andrews 1854 §239 note; Alexander §52)
 R  reflexive / 'own' iho (ʻano iho, kona kino iho, noʻu iho)
 G  word salad / garbled ; U unclear
Output: tables/dir_sample_coded.tsv and tallies."""
import os, collections
H=os.path.dirname(os.path.abspath(__file__))
CODES={
'mai':'P U D U G D D D P P D P P P U P P D D D P P G D D P P D P P P P D D G U D P P D P D P P D D D P D P'.split(),
'aku':'D D D D D C D C D C D D C C C D C D C C D C D C C D D C C C C D C D T D D T T D'.split(),
'aʻe':'L L C L L L L C L L L L L L L L L L L L C L L L L L L L L L'.split(),
'iho':'U C R N U U C R C N C N N N N N U D U R U D U R'.split(),
}
lines=[l.rstrip('\n').split('\t') for l in open(os.path.join(H,'tables','dir_sample.txt'))]
out=[];tally=collections.defaultdict(collections.Counter)
for d,j,ctx in lines:
    c=CODES[d][int(j)]
    out.append((d,j,c,ctx)); tally[d][c]+=1
with open(os.path.join(H,'tables','dir_sample_coded.tsv'),'w') as fh:
    fh.write('dir\tidx\tcode\tcontext\n')
    for r in out: fh.write('\t'.join(r)+'\n')
for d,t in tally.items(): print(d,sum(t.values()),dict(t))
