"""Token frequencies from the Hawaiian Wikipedia dump (running modern text).
ʻokina variants (' ‘ ’ ʼ `) are normalised to U+02BB when they stand before a vowel and after a letter/start;
wiki markup '' / ''' is removed first. Lower-cased, NFC. Writes hawwiki_freq.json {token: count}."""
import re, json, unicodedata, collections, html
SRC = 'roots/.cache/hawwiki.xml'
OUT = 'structure/historical-structure/hawwiki_freq.json'
t = open(SRC, encoding='utf-8').read()
texts = re.findall(r'<text[^>]*>(.*?)</text>', t, flags=re.S)
c = collections.Counter()
for x in texts:
    x = html.unescape(x)
    x = re.sub(r"'''?", ' ', x)               # wiki bold/italic
    x = re.sub(r'<[^>]+>', ' ', x)
    x = re.sub(r'\{\{[^{}]*\}\}', ' ', x)
    x = re.sub(r'https?://\S+', ' ', x)
    x = unicodedata.normalize('NFC', x.lower())
    x = re.sub(r"[‘’ʼ`']", 'ʻ', x)
    for tok in re.findall(r"[a-zāēīōūʻ]+", x):
        tok = tok.strip('ʻ') if not re.match(r'ʻ[aeiouāēīōū]', tok) else tok.rstrip('ʻ')
        if tok:
            c[tok] += 1
json.dump(dict(c), open(OUT, 'w'), ensure_ascii=False)
print(len(texts), sum(c.values()), len(c))
print(c.most_common(40))
