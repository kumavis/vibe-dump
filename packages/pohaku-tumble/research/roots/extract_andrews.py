"""Parse Andrews' Hawaiian dictionary as revised by Parker (1922, public domain)
for entries whose etymology bracket analyses the headword as two parts:

    Waimaka (wa'i-ma'-ka), n. [Wai, water, and maka, eyes.] Water flowing ...

Andrews writes no ʻokina and no kahakō, so this attests a word, its parts and
its meaning, never its modern spelling. OCR noise is repaired against the
syllabified pronunciation in the parentheses."""
import json, re, sys

SRC = sys.argv[1] if len(sys.argv) > 1 else ".cache/andrews-parker1922.txt"
OUT = sys.argv[2] if len(sys.argv) > 2 else ".cache/andrews.json"
t = open(SRC, encoding='utf-8').read()
HAW = set('aeiouhklmnpw')

heads = list(re.finditer(r'(?m)^([A-Z][A-Za-z\-\']{0,30})\s+\(\s*([^)]{1,70})\)\s*[,.]?\s*([a-z]{1,5})\.', t))

def letters(s):
    return re.sub(r'[^a-z]', '', s.lower())

OCR_VOWEL = str.maketrans({'3': 'a', '&': 'a', '5': 'o', '6': 'o', '!': 'i', '1': 'i', '0': 'o', '8': 'a', '4': 'a', '£': 'e', 'S': 'a'})
def pron_word(p):
    # "wa'i-ma'-ka" -> "waimaka"; repair common OCR substitutions first
    p = p.translate(OCR_VOWEL)
    return letters(p.replace("'", '').replace('-', ''))

out = []
for i, m in enumerate(heads):
    end = heads[i + 1].start() if i + 1 < len(heads) else len(t)
    body = t[m.end(): end]
    b = re.match(r'\s*\[([^\]]{1,240})\]', body)
    if not b:
        continue
    ety = re.sub(r'\s+', ' ', b.group(1)).replace('- ', '')
    defn = re.sub(r'\s+', ' ', body[b.end():]).strip()
    defn = re.sub(r'\b[A-Z]{2,4}\b \d{2,3} [A-Z]{2,4}\b', '', defn)  # running heads
    hw_ocr = letters(m.group(1))
    pw = pron_word(m.group(2))
    hw = pw if pw and set(pw) <= HAW and abs(len(pw) - len(hw_ocr)) <= 1 else hw_ocr
    # "X, gloss, and Y, gloss." | "X and Y, gloss." | "X, gloss and Y"
    mm = re.match(r'\s*([A-Za-z]+)\s*(?:,\s*([^\[\]]*?))?\s*,?\s+and\s+([A-Za-z]+)\s*(?:,\s*(.*?))?\s*[.,;]?\s*$', ety)
    if not mm:
        out.append({'headword': hw, 'headword_ocr': m.group(1), 'pron': m.group(2), 'pos': m.group(3), 'ety': ety, 'parse': 'unparsed', 'def': defn[:300]})
        continue
    p1, g1, p2, g2 = mm.group(1), (mm.group(2) or '').strip(), mm.group(3), (mm.group(4) or '').strip()
    a, c = letters(p1), letters(p2)
    # OCR: Andrews' "l" for "i" (Wal for Wai); try repairing against the headword
    if a + c != hw:
        for aa in {a, a.replace('l', 'i')}:
            for cc in {c, c.replace('l', 'i')}:
                if aa + cc == hw:
                    a, c = aa, cc
    rec = {'headword': hw, 'headword_ocr': m.group(1), 'pron': m.group(2), 'pos': m.group(3), 'ety': ety,
           'parts': [a, c], 'part_glosses': [g1, g2], 'def': defn[:300]}
    rec['parse'] = 'concat' if a + c == hw else 'nonconcat'
    out.append(rec)

json.dump(out, open(OUT, 'w'), ensure_ascii=False, indent=0)
from collections import Counter
print(Counter(r['parse'] for r in out))
print(Counter(len(r['headword']) for r in out if r['parse'] == 'concat').most_common(8))
