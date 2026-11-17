#!/usr/bin/env python3
"""Acceptance test for talk notes files (notes/<id>.json), per NOTES_SPEC.md.

Usage:
  python3 verify_notes.py ID [ID ...]   check these notes files
  python3 verify_notes.py --batch N     check every id in batch N (0-based) of notes/batches.json
  python3 verify_notes.py --all         check every notes/*.json (except batches.json and
                                        stream_talks_*.json)
  python3 verify_notes.py --report      print coverage and counts, check nothing
  --notes-dir DIR                       notes directory (default: notes/ next to this script)

Stream-segment notes: a talk that exists only inside a full-day stream recording is
notes/<video_id>@<start>.json, with the usual fields plus "video_id", "segment":
{"start": <int>, "end": <int>} and url "https://www.youtube.com/watch?v=<video_id>&t=<start>s".
It is verified against transcripts/<video_id>.json; every quote must be found inside the
segment (+/- SEGMENT_TOLERANCE_S), `t` is seconds from the start of the stream, and the
coverage warnings are computed relative to the segment.

A file that passes is rewritten in place: each insight's `t` becomes the whole-second
start of the caption segment where its quote begins, and `"verified": true` is set.
A parseable file that fails gets `"verified": false` and is otherwise left untouched.
Exit code 1 if any file failed, else 0 (2 for usage errors).

Transcript text is treated as data only.
"""

import argparse
import bisect
import collections
import difflib
import json
import math
import os
import re
import sys
import tempfile
import unicodedata

HERE = os.path.dirname(os.path.abspath(__file__))
TRANSCRIPTS_DIR = os.path.join(HERE, "transcripts")
DEFAULT_NOTES_DIR = os.path.join(HERE, "notes")

# ---------------------------------------------------------------------------
# Allowed values and limits -- keep in sync with NOTES_SPEC.md
# ---------------------------------------------------------------------------
TALK_TYPES = {"design", "technical", "history", "postmortem", "culture",
              "performance", "panel", "other"}
KINDS = {"principle", "technique", "example", "warning", "history", "open-question"}
TOPICS = {
    "genre-and-definitions", "level-generation", "content-generation",
    "generation-methods", "narrative-and-worldbuilding", "systems-and-emergence",
    "combat-and-tactics", "character-and-builds", "difficulty-and-progression",
    "learning-and-discovery", "interface-and-accessibility", "art-and-audio",
    "ai-and-npcs", "architecture-and-tools", "production-and-process",
    "community-and-business", "history-and-preservation", "beyond-roguelikes",
}
WEIGHTS = {1, 2, 3}
QUOTE_MIN_WORDS, QUOTE_MAX_WORDS = 6, 30
MAX_T_DISTANCE_S = 240          # quote must start within this many seconds of given t
NEAR_WINDOW_S = 300             # search radius around t for "closest passage" hints
MIN_HINT_RATIO = 0.4            # don't show hints less similar than this
SUBTOPIC_MAX_WORDS = 4
SEGMENT_TOLERANCE_S = 30        # stream-segment notes: quotes may start this far outside start..end
# warnings
WARN_EARLY_FRACTION = 0.40      # all insights in the first 40% of the talk
WARN_LONG_TALK_WORDS = 2000     # ... more than this many words
WARN_MIN_INSIGHTS = 3           # ... but fewer insights than this (design/technical)
WARN_MAX_INSIGHTS = 20

# required fields and their types (bool is excluded from int explicitly below)
TOP_FIELDS = {
    "id": str, "title": str, "speaker": str, "year": int, "url": str,
    "talk_type": str, "summary": str, "games": list, "insights": list,
}
OPTIONAL_TOP_FIELDS = {"verified": bool}
SEGMENT_TOP_FIELDS = {"video_id": str, "segment": dict}   # extra required fields, stream-segment notes only
# files in the notes directory that are not notes
NON_NOTE_FILES = {"batches.json"}
NON_NOTE_PREFIXES = ("stream_talks_",)
_SEGMENT_ID = re.compile(r"^(?P<vid>[A-Za-z0-9_-]+)@(?P<start>\d+)$")
INSIGHT_FIELDS = {
    "topic": str, "subtopic": str, "kind": str, "claim": str, "detail": str,
    "t": (int, float), "quote": str, "weight": int,
}
# ---------------------------------------------------------------------------

_NON_ALNUM = re.compile(r"[\W_]+", re.UNICODE)


def normalise(text):
    """NFKC, lowercase, every run of non-alphanumerics -> one space, stripped."""
    text = unicodedata.normalize("NFKC", text).lower()
    return _NON_ALNUM.sub(" ", text).strip()


def hms(seconds):
    s = int(seconds)
    return "%d:%02d:%02d" % (s // 3600, (s % 3600) // 60, s % 60)


def type_ok(value, typ):
    if isinstance(value, bool) and typ is not bool and (typ is int or (isinstance(typ, tuple) and int in typ)):
        return False
    return isinstance(value, typ)


def type_name(typ):
    if isinstance(typ, tuple):
        return " or ".join(t.__name__ for t in typ)
    return {"str": "string", "list": "array", "int": "integer", "bool": "boolean"}.get(typ.__name__, typ.__name__)


class Transcript:
    """Normalised word stream of all segments, with word -> segment mapping."""

    def __init__(self, data):
        self.data = data
        self.segments = data.get("segments") or []
        self.words = []          # normalised words
        self.word_seg = []       # segment index of each word
        for i, seg in enumerate(self.segments):
            for w in normalise(seg.get("text", "")).split():
                self.words.append(w)
                self.word_seg.append(i)
        # string form for fast contiguous search: " w0 w1 ... wn "
        self.joined = " " + " ".join(self.words) + " "
        self.char_starts = []    # char offset in self.joined of each word
        pos = 1
        for w in self.words:
            self.char_starts.append(pos)
            pos += len(w) + 1
        self.seg_t = [float(s.get("t", 0)) for s in self.segments]
        if data.get("duration_s"):
            self.duration = float(data["duration_s"])
        elif self.segments:
            last = self.segments[-1]
            self.duration = float(last.get("t", 0)) + float(last.get("d", 0))
        else:
            self.duration = 0.0
        self.word_count = data.get("word_count") or len(self.words)

    def word_time(self, wi):
        return self.seg_t[self.word_seg[wi]]

    def find_all(self, qwords):
        """Word indices where qwords occurs contiguously."""
        needle = " " + " ".join(qwords) + " "
        out, start = [], 0
        while True:
            pos = self.joined.find(needle, start)
            if pos < 0:
                return out
            out.append(bisect.bisect_left(self.char_starts, pos + 1))
            start = pos + 1

    def closest(self, qwords, t):
        """Best fuzzy window near t, and globally. Returns list of (ratio, wi, len)."""
        n = len(qwords)
        if not self.words or n == 0:
            return []
        qset = set(qwords)
        sm = difflib.SequenceMatcher(autojunk=False)
        sm.set_seq2(qwords)

        def best_in(indices):
            best = None
            for L in {n, max(1, n - 2), n + 2}:
                for i in indices:
                    win = self.words[i:i + L]
                    if not win:
                        continue
                    # cheap prefilter: shared vocabulary
                    if len(qset.intersection(win)) * 2 < len(qset) * 0.6 and best is not None:
                        continue
                    sm.set_seq1(win)
                    if best is not None and sm.real_quick_ratio() <= best[0]:
                        continue
                    r = sm.ratio()
                    if best is None or r > best[0]:
                        best = (r, i, L)
            return best

        results = []
        near = [i for i in range(len(self.words)) if abs(self.word_time(i) - t) <= NEAR_WINDOW_S]
        b_near = best_in(near) if near else None
        b_all = best_in(range(len(self.words)))
        if b_near:
            results.append(("near t", b_near))
        if b_all and (not b_near or (b_all[0] > b_near[0] + 0.05 and b_all[1] != b_near[1])):
            results.append(("anywhere", b_all))
        return results

    def passage(self, wi, L):
        """Original-ish text for a window: the normalised words, plus segment time."""
        return " ".join(self.words[wi:wi + L])


_transcript_cache = {}


def load_transcript(tid):
    if tid not in _transcript_cache:
        path = os.path.join(TRANSCRIPTS_DIR, tid + ".json")
        with open(path, encoding="utf-8") as f:
            _transcript_cache[tid] = Transcript(json.load(f))
    return _transcript_cache[tid]


def write_json_atomic(path, data):
    d = os.path.dirname(os.path.abspath(path))
    fd, tmp = tempfile.mkstemp(prefix=".tmp-", suffix=".json", dir=d)
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            f.write("\n")
        os.replace(tmp, path)
    except BaseException:
        try:
            os.unlink(tmp)
        except OSError:
            pass
        raise


def quote_word_count(quote):
    """Words as the author sees them: whitespace tokens containing a letter/digit."""
    return sum(1 for tok in quote.split() if normalise(tok))


def parse_segment_id(nid):
    """(video_id, start) for a stream-segment note id '<video_id>@<start>', else None."""
    m = _SEGMENT_ID.match(nid)
    return (m.group("vid"), int(m.group("start"))) if m else None


def check_file(nid, notes_dir):
    """Returns (passed, problems, warnings, n_insights)."""
    problems, warnings = [], []
    seg_id = parse_segment_id(nid) if "@" in nid else None
    seg = None                 # (start, end) once validated, stream-segment notes only
    path = os.path.join(notes_dir, nid + ".json")
    if not os.path.isfile(path):
        return False, ["file missing: %s" % path], [], 0
    try:
        with open(path, encoding="utf-8") as f:
            raw = f.read()
        doc = json.loads(raw)
    except UnicodeDecodeError as e:
        return False, ["not valid UTF-8: %s" % e], [], 0
    except json.JSONDecodeError as e:
        return False, ["invalid JSON: %s (line %d, column %d)" % (e.msg, e.lineno, e.colno)], [], 0
    if not isinstance(doc, dict):
        return False, ["top level must be a JSON object, got %s" % type(doc).__name__], [], 0

    def fail_and_mark():
        if doc.get("verified") is not False:
            doc["verified"] = False
            write_json_atomic(path, doc)
        n = len(doc["insights"]) if isinstance(doc.get("insights"), list) else 0
        return False, problems, warnings, n

    # ---- top-level fields
    top_fields = dict(TOP_FIELDS, **SEGMENT_TOP_FIELDS) if "@" in nid else TOP_FIELDS
    for key, typ in top_fields.items():
        if key not in doc:
            problems.append("missing required field '%s'" % key)
        elif not type_ok(doc[key], typ):
            problems.append("field '%s' must be %s, got %s" % (key, type_name(typ), type(doc[key]).__name__))
    for key, typ in OPTIONAL_TOP_FIELDS.items():
        if key in doc and not type_ok(doc[key], typ):
            problems.append("field '%s' must be %s" % (key, type_name(typ)))
    extra = sorted(set(doc) - set(top_fields) - set(OPTIONAL_TOP_FIELDS))
    if extra:
        warnings.append("unknown top-level field(s) ignored: %s" % ", ".join(extra))

    if isinstance(doc.get("id"), str) and doc["id"] != nid:
        problems.append("id '%s' does not match filename '%s.json'" % (doc["id"], nid))
    if isinstance(doc.get("talk_type"), str) and doc["talk_type"] not in TALK_TYPES:
        problems.append("talk_type '%s' is not one of: %s" % (doc["talk_type"], ", ".join(sorted(TALK_TYPES))))
    for key in ("summary", "title", "speaker"):
        if isinstance(doc.get(key), str) and not doc[key].strip():
            problems.append("field '%s' is empty" % key)
    if isinstance(doc.get("games"), list):
        for gi, g in enumerate(doc["games"]):
            if not isinstance(g, str) or not g.strip():
                problems.append("games[%d] must be a non-empty string" % gi)

    # ---- stream-segment consistency (notes/<video_id>@<start>.json)
    tid = nid
    if "@" in nid:
        if seg_id is None:
            problems.append("stream-segment filename must be '<video_id>@<start>.json' with an integer start")
        else:
            tid = seg_id[0]
            if isinstance(doc.get("video_id"), str) and doc["video_id"] != seg_id[0]:
                problems.append("video_id '%s' does not match filename '%s.json'" % (doc["video_id"], nid))
            sg = doc.get("segment")
            if isinstance(sg, dict):
                s0, s1 = sg.get("start"), sg.get("end")
                if not (type_ok(s0, int) and type_ok(s1, int)):
                    problems.append("segment.start and segment.end must be integers (seconds)")
                elif s0 != seg_id[1]:
                    problems.append("segment.start %s does not match filename '%s.json'" % (s0, nid))
                elif s1 <= s0:
                    problems.append("segment.end %s must be after segment.start %s" % (s1, s0))
                else:
                    seg = (s0, s1)
            want_url = "https://www.youtube.com/watch?v=%s&t=%ds" % seg_id
            if isinstance(doc.get("url"), str) and doc["url"] != want_url:
                problems.append("url '%s' should be '%s'" % (doc["url"], want_url))

    # ---- transcript cross-checks
    transcript = None
    try:
        transcript = load_transcript(tid)
    except FileNotFoundError:
        problems.append("no transcript found at transcripts/%s.json (is the id right?)" % tid)
    except (json.JSONDecodeError, UnicodeDecodeError) as e:
        problems.append("transcript transcripts/%s.json unreadable: %s" % (tid, e))
    if transcript:
        td = transcript.data
        if type_ok(doc.get("year"), int) and doc["year"] != td.get("year"):
            problems.append("year %s disagrees with transcript year %s" % (doc["year"], td.get("year")))
        if "@" in nid:
            if seg and seg[0] >= transcript.duration:
                problems.append("segment.start %d is past the end of the stream (%s)" % (seg[0], hms(transcript.duration)))
        else:
            if isinstance(doc.get("url"), str) and doc["url"] != td.get("url"):
                problems.append("url '%s' disagrees with transcript url '%s'" % (doc["url"], td.get("url")))
            if isinstance(doc.get("title"), str) and doc["title"].strip() and doc["title"] != td.get("title"):
                warnings.append("title differs from transcript header: %r" % td.get("title"))

    # ---- insights
    insights = doc.get("insights") if isinstance(doc.get("insights"), list) else []
    refined_t = {}
    seen_quotes = {}
    for ii, ins in enumerate(insights):
        where = "insight[%d]" % ii
        if not isinstance(ins, dict):
            problems.append("%s must be an object" % where)
            continue
        for key, typ in INSIGHT_FIELDS.items():
            if key not in ins:
                problems.append("%s: missing field '%s'" % (where, key))
            elif not type_ok(ins[key], typ):
                problems.append("%s.%s must be %s, got %s" % (where, key, type_name(typ), type(ins[key]).__name__))
        extra = sorted(set(ins) - set(INSIGHT_FIELDS))
        if extra:
            warnings.append("%s: unknown field(s) ignored: %s" % (where, ", ".join(extra)))
        if isinstance(ins.get("topic"), str) and ins["topic"] not in TOPICS:
            close = difflib.get_close_matches(ins["topic"], TOPICS, n=1)
            problems.append("%s.topic '%s' is not a taxonomy id%s" % (
                where, ins["topic"], " (did you mean '%s'?)" % close[0] if close else ""))
        if isinstance(ins.get("kind"), str) and ins["kind"] not in KINDS:
            problems.append("%s.kind '%s' is not one of: %s" % (where, ins["kind"], ", ".join(sorted(KINDS))))
        if type_ok(ins.get("weight"), int) and ins["weight"] not in WEIGHTS:
            problems.append("%s.weight %s must be 1, 2 or 3" % (where, ins["weight"]))
        for key in ("claim", "detail", "subtopic"):
            if isinstance(ins.get(key), str) and not ins[key].strip():
                problems.append("%s.%s is empty" % (where, key))
        sub = ins.get("subtopic")
        if isinstance(sub, str) and sub.strip() and (sub != sub.lower() or len(sub.split()) > SUBTOPIC_MAX_WORDS):
            warnings.append("%s.subtopic %r should be 1-%d lowercase words" % (where, sub, SUBTOPIC_MAX_WORDS))
        t_ok = type_ok(ins.get("t"), (int, float)) and math.isfinite(ins["t"])
        if t_ok and ins["t"] < 0:
            problems.append("%s.t must be >= 0 seconds" % where)
            t_ok = False

        quote = ins.get("quote")
        if not isinstance(quote, str):
            continue
        nwords = quote_word_count(quote)
        if nwords < QUOTE_MIN_WORDS or nwords > QUOTE_MAX_WORDS:
            problems.append("%s.quote has %d words; must be %d-%d words" % (
                where, nwords, QUOTE_MIN_WORDS, QUOTE_MAX_WORDS))
            continue
        qwords = normalise(quote).split()
        qkey = " ".join(qwords)
        if qkey in seen_quotes:
            problems.append("%s.quote duplicates insight[%d].quote; each insight needs its own quote" % (
                where, seen_quotes[qkey]))
            continue
        seen_quotes[qkey] = ii
        if transcript is None or not t_ok or ("@" in nid and seg is None):
            continue
        t = float(ins["t"])
        hits = transcript.find_all(qwords)
        if seg and hits:
            inside = [wi for wi in hits
                      if seg[0] - SEGMENT_TOLERANCE_S <= transcript.word_time(wi) <= seg[1] + SEGMENT_TOLERANCE_S]
            if not inside:
                problems.append("%s.quote found only outside the segment %d-%d [%s-%s] (at t=%s); quote from this talk" % (
                    where, seg[0], seg[1], hms(seg[0]), hms(seg[1]),
                    ", ".join(str(int(transcript.word_time(wi))) for wi in hits[:5])))
                continue
            hits = inside
        if not hits:
            msg = "%s.quote not found verbatim in transcript: %r" % (where, quote)
            hints = [h for h in transcript.closest(qwords, t) if h[1][0] >= MIN_HINT_RATIO]
            if not hints:
                msg += "\n      no similar passage found anywhere in the transcript (is this the right talk?)"
            for label, (ratio, wi, L) in hints:
                msg += "\n      closest %s (%d%% similar) at t=%d [%s]: \"%s\"" % (
                    label, round(ratio * 100), int(transcript.word_time(wi)),
                    hms(transcript.word_time(wi)), transcript.passage(wi, L))
            if hints:
                msg += "\n      (shown normalised; copy the exact wording from transcripts/%s.txt)" % tid
            problems.append(msg)
            continue
        best = min(hits, key=lambda wi: abs(transcript.word_time(wi) - t))
        found_t = transcript.word_time(best)
        if abs(found_t - t) > MAX_T_DISTANCE_S:
            problems.append("%s.quote found at t=%d [%s] but t is %d [%s] (%d s away, max %d); fix t to the paragraph containing the quote" % (
                where, int(found_t), hms(found_t), int(t), hms(t), int(abs(found_t - t)), MAX_T_DISTANCE_S))
            continue
        refined_t[ii] = int(math.floor(found_t))

    if problems:
        return fail_and_mark()

    # ---- warnings (only meaningful once the file is sound)
    n = len(insights)
    if transcript:
        if seg:     # coverage relative to the talk's stretch of the stream
            t0, span = seg[0], seg[1] - seg[0]
            words = sum(1 for wi in range(len(transcript.words)) if seg[0] <= transcript.word_time(wi) < seg[1])
        else:
            t0, span, words = 0, transcript.duration, transcript.word_count
        if n and span > 0 and all(
                refined_t[i] < t0 + WARN_EARLY_FRACTION * span for i in range(n)):
            warnings.append("all %d insights fall in the first %d%% of the talk (before %s); cover the whole talk" % (
                n, int(WARN_EARLY_FRACTION * 100), hms(t0 + WARN_EARLY_FRACTION * span)))
        if (words > WARN_LONG_TALK_WORDS and n < WARN_MIN_INSIGHTS
                and doc.get("talk_type") in ("design", "technical")):
            warnings.append("only %d insight(s) for a %s talk of %d words; expected at least %d" % (
                n, doc["talk_type"], words, WARN_MIN_INSIGHTS))
    if n > WARN_MAX_INSIGHTS:
        warnings.append("%d insights (more than %d); check for padding or split ideas" % (n, WARN_MAX_INSIGHTS))

    for i, ins in enumerate(insights):
        ins["t"] = refined_t[i]
    doc["verified"] = True
    write_json_atomic(path, doc)
    return True, problems, warnings, n


def list_note_ids(notes_dir):
    if not os.path.isdir(notes_dir):
        return []
    return sorted(f[:-5] for f in os.listdir(notes_dir)
                  if f.endswith(".json") and f not in NON_NOTE_FILES
                  and not f.startswith(NON_NOTE_PREFIXES) and not f.startswith("."))


def run_checks(ids, notes_dir):
    failed = passed = nwarn = 0
    for nid in ids:
        ok, problems, warnings, n = check_file(nid, notes_dir)
        if ok:
            passed += 1
            print("PASS %s %d insights" % (nid, n))
        else:
            failed += 1
            print("FAIL %s" % nid)
            for p in problems:
                print("    " + p)
        for w in warnings:
            nwarn += 1
            print("    WARN " + w)
    print("TOTAL %d checked: %d passed, %d failed, %d warnings" % (len(ids), passed, failed, nwarn))
    return 1 if failed else 0


def report(notes_dir):
    expected = {}
    for f in sorted(os.listdir(TRANSCRIPTS_DIR)):
        if f.endswith(".json"):
            try:
                with open(os.path.join(TRANSCRIPTS_DIR, f), encoding="utf-8") as fh:
                    d = json.load(fh)
            except (OSError, ValueError):
                continue
            if d.get("kind") == "talk":
                expected[d.get("id", f[:-5])] = (d.get("year"), d.get("title"))
    all_present = list_note_ids(notes_dir)
    present = [k for k in all_present if "@" not in k]
    seg_present = [k for k in all_present if "@" in k]
    verified = 0
    unreadable = []
    total_ins = 0
    by_topic, by_kind = collections.Counter(), collections.Counter()
    by_type, by_year = collections.Counter(), collections.Counter()
    ins_by_year = collections.Counter()
    for nid in present:
        try:
            with open(os.path.join(notes_dir, nid + ".json"), encoding="utf-8") as fh:
                doc = json.load(fh)
            if not isinstance(doc, dict):
                raise ValueError
        except (OSError, ValueError):
            unreadable.append(nid)
            continue
        if doc.get("verified") is True:
            verified += 1
        by_type[str(doc.get("talk_type"))] += 1
        by_year[str(doc.get("year"))] += 1
        ins = doc.get("insights") if isinstance(doc.get("insights"), list) else []
        total_ins += len(ins)
        for x in ins:
            if isinstance(x, dict):
                by_topic[str(x.get("topic"))] += 1
                by_kind[str(x.get("kind"))] += 1
                ins_by_year[str(doc.get("year"))] += 1
    missing = sorted((k for k in expected if k not in set(present)), key=lambda k: (expected[k][0] or 0, k))
    extra = [k for k in present if k not in expected]

    print("talks expected:  %d" % len(expected))
    print("notes present:   %d" % len(present))
    print("verified:        %d" % verified)
    print("unreadable:      %d%s" % (len(unreadable), (" (" + ", ".join(unreadable) + ")") if unreadable else ""))
    if extra:
        print("notes not for an expected talk: %s" % ", ".join(extra))
    print("missing:         %d" % len(missing))
    for k in missing:
        print("    %s  %s  %s" % (k, expected[k][0], expected[k][1]))
    print("total insights:  %d" % total_ins)

    def table(name, counter, extra_col=None):
        print("by %s:" % name)
        if not counter:
            print("    (none)")
        for key, c in sorted(counter.items(), key=lambda kv: (-kv[1], kv[0]) if name != "year" else (kv[0], 0)):
            col = ("  (%d insights)" % extra_col[key]) if extra_col is not None else ""
            print("    %-32s %d%s" % (key, c, col))

    table("topic (insights)", by_topic)
    table("kind (insights)", by_kind)
    table("talk_type (talks)", by_type)
    print("by year (talks with notes):")
    if not by_year:
        print("    (none)")
    for y in sorted(by_year):
        print("    %-32s %d  (%d insights)" % (y, by_year[y], ins_by_year[y]))

    # stream-segment talks are reported separately: not part of the expected talks above
    seg_verified = seg_ins = 0
    seg_unreadable = []
    for nid in seg_present:
        try:
            with open(os.path.join(notes_dir, nid + ".json"), encoding="utf-8") as fh:
                doc = json.load(fh)
            if not isinstance(doc, dict):
                raise ValueError
        except (OSError, ValueError):
            seg_unreadable.append(nid)
            continue
        if doc.get("verified") is True:
            seg_verified += 1
        seg_ins += len(doc["insights"]) if isinstance(doc.get("insights"), list) else 0
    print("stream-segment talks: %d  (verified %d, %d insights%s)" % (
        len(seg_present), seg_verified, seg_ins,
        (", unreadable: " + ", ".join(seg_unreadable)) if seg_unreadable else ""))
    return 0


def main(argv=None):
    ap = argparse.ArgumentParser(description="Verify talk notes against NOTES_SPEC.md and transcripts.")
    ap.add_argument("ids", nargs="*", help="talk ids (notes/<id>.json)")
    g = ap.add_mutually_exclusive_group()
    g.add_argument("--batch", type=int, metavar="N", help="check every id in batch N (0-based) of batches.json")
    g.add_argument("--all", action="store_true", help="check every notes/*.json")
    g.add_argument("--report", action="store_true", help="print coverage and counts only")
    ap.add_argument("--notes-dir", default=DEFAULT_NOTES_DIR, help="notes directory (default: notes/)")
    args = ap.parse_args(argv)
    notes_dir = args.notes_dir

    modes = sum([bool(args.ids), args.batch is not None, args.all, args.report])
    if modes != 1:
        ap.error("give exactly one of: ID [ID ...], --batch N, --all, --report")

    if args.report:
        return report(notes_dir)
    if args.all:
        ids = list_note_ids(notes_dir)
    elif args.batch is not None:
        bpath = os.path.join(DEFAULT_NOTES_DIR, "batches.json")
        with open(bpath, encoding="utf-8") as f:
            batches = json.load(f)
        if not 0 <= args.batch < len(batches):
            ap.error("batch %d out of range (0-%d)" % (args.batch, len(batches) - 1))
        ids = [b["id"] for b in batches[args.batch]]
    else:
        ids = []
        for a in args.ids:
            a = os.path.basename(a)
            ids.append(a[:-5] if a.endswith(".json") else a)
    return run_checks(ids, notes_dir)


if __name__ == "__main__":
    sys.exit(main())
