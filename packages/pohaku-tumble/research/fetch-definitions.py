import json, time, urllib.request, urllib.parse, re
UA = 'vibe-dump-research/1.0 (aaron@kumavis.me)'
def get(params):
    url = 'https://en.wiktionary.org/w/api.php?' + urllib.parse.urlencode(params)
    for attempt in range(6):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA})
            with urllib.request.urlopen(req, timeout=40) as r:
                return json.load(r)
        except Exception as e:
            time.sleep(2 ** attempt)
    raise RuntimeError(url)
two = json.load(open('two.json'))
words = [w for w, _ in two]
out = {}
def hawaiian(t):
    i = t.find('==Hawaiian==')
    if i < 0: return ''
    m = re.search(r'\n==[^=]', t[i+5:])
    return t[i: i + 5 + m.start()] if m else t[i:]
for k in range(0, len(words), 40):
    batch = words[k:k+40]
    d = get({'action': 'query', 'prop': 'revisions', 'rvprop': 'content', 'rvslots': 'main', 'titles': '|'.join(batch), 'format': 'json', 'formatversion': 2})
    for p in d['query']['pages']:
        if 'revisions' not in p: continue
        out[p['title']] = hawaiian(p['revisions'][0]['slots']['main']['content'])
    time.sleep(0.6)
json.dump(out, open('raw.json', 'w'), ensure_ascii=False)
# Compact: strip templates into readable text
def clean(s):
    s = re.sub(r'\{\{(?:l|m|w)\|[a-z-]+\|([^|}]+)[^}]*\}\}', r'\1', s)
    s = re.sub(r'\{\{gloss\|([^}]*)\}\}', r'(\1)', s)
    s = re.sub(r'\{\{lb\|haw\|([^}]*)\}\}', lambda m: '(' + m.group(1).replace('|', ', ') + ')', s)
    s = re.sub(r'\{\{(?:bor|der|inh|bor\+|cog|uder|ubor)\|haw\|([a-z-]+)\|([^|}]*)[^}]*\}\}', r'[\1 \2]', s)
    s = re.sub(r'\{\{(?:cog)\|([a-z-]+)\|([^|}]*)[^}]*\}\}', r'[\1 \2]', s)
    s = re.sub(r'\[\[(?:[^|\]]*\|)?([^\]]*)\]\]', r'\1', s)
    s = re.sub(r'\{\{[^{}]*\}\}', '', s)
    return s
compact = {}
for w, t in out.items():
    lines = []
    pos = None
    for line in t.split('\n'):
        h = re.match(r'^=+\s*([^=]+?)\s*=+$', line)
        if h:
            name = h.group(1)
            if name.startswith('Etymology'): lines.append('|'); pos = None
            elif name in ('Noun','Verb','Adjective','Adverb','Particle','Preposition','Pronoun','Conjunction','Interjection','Numeral','Determiner','Proper noun','Article','Prefix','Suffix'): pos = name; lines.append(name.lower() + ':')
            else: pos = None
            continue
        if line.startswith('From') or 'bor|haw' in line or 'bor+|haw' in line or 'inh|haw' in line:
            lines.append('etym: ' + clean(line)[:120])
        if pos and re.match(r'^#[^#:*]', line):
            lines.append('  - ' + clean(line[1:]).strip())
    compact[w] = '\n'.join(lines)
json.dump(compact, open('compact.json', 'w'), ensure_ascii=False, indent=0)
print(len(out), 'fetched')
