"""How many compound candidates pair up across a polar antonym in one slot (naʻau·ao : naʻau·pō)?
Also: the same for the corpus-stable phrase tier and for the antonym modifiers the phrase study
set aside as 'grammatical' (phrase-syntagm/scripts/colloc.py GRAM).  Read-only inputs."""
import csv, json, collections
RR='roots'
S='(scratch)/structure'
POLAR=[('ao','pō'),('lā','pō'),('uka','kai'),('luna','lalo'),('mua','hope'),('nui','iki'),('nui','liʻiliʻi'),
       ('keʻokeʻo','ʻeleʻele'),('kea','ʻele'),('kāne','wahine'),('hou','kahiko'),('loko','waho'),('ʻākau','hema'),
       ('hikina','komohana'),('paʻa','wai'),('ola','make'),('pono','hewa'),('ao','ʻeleʻele')]
def scan(units,label):
    S2=set(units); hits=[]
    for a,b in S2:
        for x,y in POLAR:
            if b==x and (a,y) in S2: hits.append(f'{a}·{x} : {a}·{y}')
            if a==x and (y,b) in S2: hits.append(f'{x}·{b} : {y}·{b}')
    print(f'{label}: units {len(S2)}; polar pairs {len(hits)}'); print('   ', sorted(hits))
C=[r for r in csv.DictReader(open(f'{RR}/compounds.tsv'),delimiter='\t') if r['status']=='candidate']
scan([tuple(r['split'].split('·')) for r in C],'compounds.tsv, 905 core candidates')
WA=json.load(open(f'{RR}/.cache/tiers/attested-WA.json'))
scan([tuple(x['parts']) for x in WA],'attested 128')
P=[r for r in csv.DictReader(open(f'{S}/phrase-syntagm/tables/colloc_all.tsv'),delimiter='\t') if int(r['f'])>=2 and int(r['df'])>=2 and int(r['cap'])*2<=int(r['f'])]
scan([(r['head'],r['mod']) for r in P],'phrase pairs stable INCLUDING gram-flagged modifiers')
