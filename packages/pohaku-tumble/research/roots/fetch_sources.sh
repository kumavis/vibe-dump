#!/usr/bin/env bash
# Download the open sources the root research is built from, into .cache/.
#
#   Wiktionary (Hawaiian), as extracted by kaikki.org/wiktextract — CC BY-SA 4.0
#   Andrews' Hawaiian dictionary, revised by Parker (1922) — public domain (archive.org OCR)
#   Hawaiian Wikipedia articles dump — used only to count spellings in running text
#
# Pukui & Elbert's Hawaiian Dictionary and Māmaka Kaiao (wehewehe.org) sit
# behind a bot challenge and are deliberately not fetched; see ../ROOTS.md.
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p .cache
UA='vibe-dump-research/1.0 (aaron@kumavis.me)'
get() { [ -s ".cache/$2" ] || curl -sS -L -A "$UA" --fail --retry 4 --retry-delay 2 -o ".cache/$2" "$1"; }
get https://kaikki.org/dictionary/Hawaiian/kaikki.org-dictionary-Hawaiian.jsonl kaikki-haw.jsonl
get https://archive.org/download/ofhawadictionary00andrrich/ofhawadictionary00andrrich_djvu.txt andrews-parker1922.txt
get https://dumps.wikimedia.org/hawwiki/latest/hawwiki-latest-pages-articles.xml.bz2 hawwiki.xml.bz2
[ -s .cache/hawwiki.xml ] || bunzip2 -kc .cache/hawwiki.xml.bz2 > .cache/hawwiki.xml
ls -la .cache
