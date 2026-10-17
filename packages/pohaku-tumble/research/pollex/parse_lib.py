import html
import re

TR = re.compile(r'<tr[^>]*>(.*?)</tr>', re.S)
TD = re.compile(r'<td([^>]*)>(.*?)</td>', re.S)
FLAG = re.compile(r'<span class="flag"[^>]*>(.*?)</span>', re.S)
A = re.compile(r'<a\s+href="([^"]*)"\s*(?:title="([^"]*)")?[^>]*>(.*?)</a>', re.S)


def clean(s):
    s = re.sub(r'<[^>]+>', ' ', s)
    s = html.unescape(s)
    return re.sub(r'\s+', ' ', s).strip()


def content(page):
    i = page.find('<div id="content">')
    j = page.find('<div id="footer">')
    return page[i:j]


def rows(page):
    """Yield list of (attrs, inner_html) td tuples for every data row."""
    for m in TR.finditer(content(page)):
        tds = TD.findall(m.group(1))
        if tds:
            yield m.group(0), tds


def split_desc(td_html):
    flags = [clean(f) for f in FLAG.findall(td_html)]
    gloss = clean(FLAG.sub(' ', td_html))
    return gloss, flags


def anchor(td_html):
    m = A.search(td_html)
    if not m:
        return None
    return {'href': m.group(1), 'title': html.unescape(m.group(2) or ''), 'text': clean(m.group(3))}
