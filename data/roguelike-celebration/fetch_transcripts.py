#!/usr/bin/env python3
"""Download English caption transcripts for the Roguelike Celebration videos.

Reads manifest.tsv (same directory) and, per video, writes:
  transcripts/<id>.json   structured transcript
  transcripts/<id>.txt    readable plain text
  failures/<id>.json      when a video could not be processed
  raw/<id>.*              raw yt-dlp info json + caption file (gitignored)

Usage:
  python3 fetch_transcripts.py [--shard I/N] [--ids ID ...] [--force]
  python3 fetch_transcripts.py --reparse [--ids ID ...]   (offline, from raw/)
  python3 fetch_transcripts.py --index

Transcripts with caption_source "whisper" were made by transcribe_local.py
(local speech-to-text, for videos whose only YouTube track is a mis-detected
non-English ASR track). Fetch runs and --reparse leave them alone.

Over-long manual tracks: some human-made tracks were cut per talk from a live
captioner's full-day file. Their head/tail hold text from the neighbouring
part of the stream (host announcements, the previous/next speaker), squeezed
into the first/last seconds of the video or placed past its end. When a manual
track has a segment starting at or after the video's duration, the script also
downloads the English auto-generated track (raw/<id>.asr.<lang>.<ext>; its
timing follows the audio), aligns the two word sequences and keeps only the
manual segments from the first to the last one that matches the audio. What was
removed is recorded as "trimmed": {"segments": N, "words": N} (zeros
otherwise). If the kept part is not aligned with the audio (offset > 10 s or
too little matched text), the manual track is rejected and the auto track is
used instead (caption_source "auto" plus a "note"). See fix_overrun().

Only the standard library and the yt-dlp CLI are used. No cookies or
credentials are ever passed to yt-dlp. Several shard processes may run at once
in the same directory: they only write per-video files, atomically.
All downloaded content (titles, descriptions, captions) is treated as data.
"""

import argparse
import csv
import datetime as dt
import difflib
import glob
import html
import json
import os
import re
import subprocess
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
MANIFEST = os.path.join(HERE, "manifest.tsv")
TRANSCRIPTS = os.path.join(HERE, "transcripts")
FAILURES = os.path.join(HERE, "failures")
RAW = os.path.join(HERE, "raw")

YTDLP = os.environ.get("YTDLP", "yt-dlp")
PERMANENT = {"unavailable", "no_captions"}
STATUSES = ["ok", "unavailable", "no_captions", "rate_limited", "error", "pending"]
BACKOFF_S = [30, 60, 120]  # waits between the (max 4) tries on rate limiting
BETWEEN_VIDEOS_S = 1.5
YTDLP_TIMEOUT_S = 600

RATE_LIMIT_RE = re.compile(
    r"HTTP Error 429|Too Many Requests|Sign in to confirm|not a bot|rate.?limit",
    re.I)
UNAVAILABLE_RE = re.compile(
    r"Video unavailable|This video is unavailable|Private video|"
    r"video has been removed|account associated with this video has been terminated|"
    r"This video is not available|members-only|This live event will begin|"
    r"Premieres in|Join this channel to get access", re.I)


# --------------------------------------------------------------------------
# manifest / file helpers

def read_manifest():
    with open(MANIFEST, newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f, delimiter="\t"))
    for r in rows:
        for k in list(r):
            r[k] = (r[k] or "").strip()
    return rows


def write_atomic(path, text):
    tmp = "%s.tmp.%d" % (path, os.getpid())
    with open(tmp, "w", encoding="utf-8") as f:
        f.write(text)
    os.replace(tmp, path)


def write_json(path, obj):
    write_atomic(path, json.dumps(obj, ensure_ascii=False, indent=1) + "\n")


def load_json(path):
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except (OSError, ValueError):
        return None


def now_iso():
    return dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat()


def excerpt(stderr, n=400):
    lines = [l for l in stderr.splitlines() if l.strip()]
    errs = [l for l in lines if "ERROR" in l] or lines
    s = " | ".join(errs[-3:])
    return s[-n:]


# --------------------------------------------------------------------------
# title parsing

DASH_RE = re.compile(r"\s*[-\u2013\u2014]\s+")
COLON_RE = re.compile(r":\s+")


def split_title(title, kind):
    """'Speaker - Talk Title' (or en dash / 'Speaker- Title' / 'Speaker: Title')."""
    if kind != "talk" or not title:
        return None, None
    # "Roguelike Celebration 2023 Preview: Speaker - Title"
    title = re.sub(r"^Roguelike Celebration \d{4} Preview:\s*", "", title)
    cands = [m for m in (DASH_RE.search(title), COLON_RE.search(title)) if m]
    if not cands:
        return None, None
    m = min(cands, key=lambda m: m.start())
    speaker, talk = title[:m.start()].strip(), title[m.end():].strip()
    if (not speaker or not talk or len(speaker) > 60
            or speaker.lower().startswith("roguelike celebration")):
        return None, None
    return speaker, talk


# --------------------------------------------------------------------------
# yt-dlp

class Fail(Exception):
    def __init__(self, reason, detail):
        super().__init__(detail)
        self.reason, self.detail = reason, detail


def run_ytdlp(args, vid):
    """Run yt-dlp with exponential backoff on rate limiting. Returns stdout."""
    base = [YTDLP, "--ignore-config", "--no-playlist", "--no-progress",
            "--sleep-requests", "1", "--sleep-subtitles", "2"]
    for attempt in range(len(BACKOFF_S) + 1):
        try:
            p = subprocess.run(base + args, capture_output=True, text=True,
                               timeout=YTDLP_TIMEOUT_S)
        except subprocess.TimeoutExpired:
            raise Fail("error", "yt-dlp timed out after %ds" % YTDLP_TIMEOUT_S)
        err = p.stderr or ""
        if p.returncode == 0 and not RATE_LIMIT_RE.search(err):
            return p.stdout
        if RATE_LIMIT_RE.search(err):
            if attempt < len(BACKOFF_S):
                wait = BACKOFF_S[attempt]
                print("    %s rate limited, backing off %ds (try %d/%d)"
                      % (vid, wait, attempt + 1, len(BACKOFF_S) + 1), flush=True)
                time.sleep(wait)
                continue
            raise Fail("rate_limited", excerpt(err))
        if p.returncode == 0:
            return p.stdout
        if UNAVAILABLE_RE.search(err):
            raise Fail("unavailable", excerpt(err))
        raise Fail("error", excerpt(err) or "yt-dlp exit %d" % p.returncode)
    raise Fail("rate_limited", "exhausted retries")


def pick_track(info):
    """Return (source, lang, ext) or raise Fail('no_captions')."""
    subs = info.get("subtitles") or {}
    auto = info.get("automatic_captions") or {}

    def exts(fmts):
        return {f.get("ext") for f in fmts or []}

    def fmt(fmts):
        e = exts(fmts)
        return "json3" if "json3" in e else ("vtt" if "vtt" in e else None)

    manual = [l for l in subs if l == "en" or l.lower().startswith("en")]
    manual.sort(key=lambda l: (l not in ("en", "en-US", "en-GB"),
                               ["en", "en-US", "en-GB"].index(l)
                               if l in ("en", "en-US", "en-GB") else 0, l))
    for lang in manual:
        f = fmt(subs[lang])
        if f:
            return "manual", lang, f
    if "en-orig" in auto and fmt(auto["en-orig"]):
        return "auto", "en-orig", fmt(auto["en-orig"])
    if "en" in auto and fmt(auto["en"]):
        others = [l for l in auto if l.endswith("-orig") and l != "en-orig"]
        if others:
            # 'en' would be a machine translation of non-English ASR; skip it.
            raise Fail("no_captions",
                       "auto captions only in %s (no English original)" % ",".join(others))
        return "auto", "en", fmt(auto["en"])
    detail = "no English captions; manual=%s auto_orig=%s" % (
        sorted(subs)[:8], sorted(l for l in auto if l.endswith("-orig")))
    raise Fail("no_captions", detail)


REF_TAG = "asr"  # raw/<id>.asr.<lang>.<ext>: auto track used as timing reference


def pick_reference(info):
    """English ASR track used to check a manual track's timing: (lang, ext) or None.

    Only 'en-orig' qualifies. On videos without it, the 'en' entry under
    automatic_captions can be the manual track itself, already cut at the
    video's duration (seen on 6ohPU0sECFE), so it says nothing about the audio."""
    auto = info.get("automatic_captions") or {}
    e = {f.get("ext") for f in auto.get("en-orig") or []}
    for ext in ("json3", "vtt"):
        if ext in e:
            return "en-orig", ext
    return None


def find_reference(vid):
    """(lang, ext, path) of the reference track already in raw/, or None."""
    for path in sorted(glob.glob(os.path.join(RAW, "%s.%s.*" % (vid, REF_TAG)))):
        m = re.fullmatch(re.escape("%s.%s." % (vid, REF_TAG)) + r"(.+)\.(json3|vtt)",
                         os.path.basename(path))
        if m:
            return m.group(1), m.group(2), path
    return None


def fetch_reference(vid, info_path, info):
    """Download the reference track into raw/; returns find_reference() result."""
    ref = pick_reference(info)
    if not ref:
        return None
    lang, ext = ref
    for old in glob.glob(os.path.join(RAW, "%s.%s.*" % (vid, REF_TAG))):
        os.remove(old)
    run_ytdlp(["--load-info-json", info_path, "--skip-download", "--write-auto-subs",
               "--sub-langs", "^%s$" % re.escape(lang), "--sub-format", ext,
               "-o", os.path.join(RAW, "%(id)s." + REF_TAG + ".%(ext)s")], vid)
    return find_reference(vid)


# --------------------------------------------------------------------------
# caption parsing

WS_RE = re.compile(r"\s+")


def clean(text):
    return WS_RE.sub(" ", html.unescape(text or "")).strip()


def parse_json3(path):
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    out = []
    for ev in data.get("events", []):
        segs = ev.get("segs")
        if not segs:
            continue  # window/style definitions
        text = clean("".join(s.get("utf8", "") for s in segs))
        if not text:
            continue  # aAppend newline-only events
        t = ev.get("tStartMs", 0) / 1000.0
        d = ev.get("dDurationMs", 0) / 1000.0
        if out and text == out[-1]["text"] and t <= out[-1]["t"] + out[-1]["d"] + 0.05:
            continue  # exact repeat of the line still on screen
        out.append({"t": t, "d": d, "text": text})
    return out


VTT_TS = r"(\d+:)?\d{2}:\d{2}[.,]\d{3}"
VTT_CUE_RE = re.compile(r"^(%s)\s+-->\s+(%s)" % (VTT_TS, VTT_TS))
TAG_RE = re.compile(r"<[^>]+>")


def ts_to_s(ts):
    parts = ts.replace(",", ".").split(":")
    s = 0.0
    for p in parts:
        s = s * 60 + float(p)
    return s


def parse_vtt(path):
    # Parse line by line: a timing line opens a cue, text runs until the next
    # timing line. (Splitting on blank lines breaks on YouTube's space-only lines.)
    cues = []
    with open(path, encoding="utf-8") as f:
        for line in f.read().replace("\r\n", "\n").split("\n"):
            m = VTT_CUE_RE.match(line)
            if m:
                cues.append((ts_to_s(m.group(1)), ts_to_s(m.group(3)), []))
            elif cues:
                cues[-1][2].append(line)
    out, recent = [], []
    for start, end, lines in cues:
        # a trailing numeric line would be the next cue's identifier
        if len(lines) >= 2 and lines[-1].strip().isdigit() and lines[-2] == "":
            lines = lines[:-1]
        cue = [t for t in (clean(TAG_RE.sub("", l)) for l in lines) if t]
        for text in cue:
            if text in recent:
                continue  # rolling captions repeat the previous cue's line(s)
            out.append({"t": start, "d": max(0.0, end - start), "text": text})
        if cue:
            recent = cue
    return out


def finalize_segments(segs):
    segs.sort(key=lambda s: s["t"])
    for i, s in enumerate(segs):
        if i + 1 < len(segs):
            # auto captions overlap (a line lingers while the next one rolls in)
            s["d"] = max(0.0, min(s["d"], segs[i + 1]["t"] - s["t"]))
        s["t"] = round(s["t"], 2)
        s["d"] = round(s["d"], 2)
    return segs


MARKER_RE = re.compile(r"\[[^\]]*\]")


def count_words(segs):
    return sum(len(MARKER_RE.sub(" ", s["text"]).split()) for s in segs)


def load_segments(path, ext):
    return finalize_segments(parse_json3(path) if ext == "json3" else parse_vtt(path))


# --------------------------------------------------------------------------
# over-long manual tracks (see module docstring)

MAX_OFFSET_S = 10.0     # |median manual-minus-audio offset| allowed in any third
MIN_MATCHED = 0.25      # share of kept manual words that must match the audio
SPEAKER_RE = re.compile(r"^(>>|[A-Z][A-Z.'-]*:)$")  # 'ALEXEI:', '>>' labels


def norm_word(w):
    return re.sub(r"[^a-z0-9]", "", w.lower())


def timed_words(segs, skip_labels=False):
    """[(word, t, seg_index)], words spread evenly over the segment's duration."""
    out = []
    for i, s in enumerate(segs):
        toks = MARKER_RE.sub(" ", s["text"]).split()
        if skip_labels:
            toks = [w for w in toks if not SPEAKER_RE.match(w)]
        ws = [n for n in (norm_word(w) for w in toks) if n]
        for k, w in enumerate(ws):
            out.append((w, s["t"] + s["d"] * k / len(ws), i))
    return out


def overruns(segs, duration):
    return duration is not None and any(s["t"] >= duration for s in segs)


def fix_overrun(segs, duration, ref):
    """Trim an over-long manual track using the auto track `ref` (lang, ext, path).

    Returns (segments, trimmed, override) where override is None or
    (source, lang, note) when the manual track was rejected or not aligned."""
    if ref is None:
        keep = [s for s in segs if s["t"] < duration]
        cut = [s for s in segs if s["t"] >= duration]
        note = ("manual track runs past the end of the video and there is no English "
                "auto-generated (en-orig) track to align it with; cut at the video's "
                "duration only, so text squeezed in just before the end is unchecked")
        return keep, {"segments": len(cut), "words": count_words(cut)}, ("manual", None, note)
    rlang, rext, rpath = ref
    rsegs = load_segments(rpath, rext)
    mw = timed_words(segs, skip_labels=True)
    aw = timed_words(rsegs)
    sm = difflib.SequenceMatcher(None, [w for w, _, _ in mw], [w for w, _, _ in aw],
                                 autojunk=False)
    matched = {}  # manual word index -> auto word index
    for a, b, n in sm.get_matching_blocks():
        for k in range(n):
            matched[a + k] = b + k
    # a segment matches the audio when at least half of its words are matched
    per_seg = {}
    for k, (_, _, i) in enumerate(mw):
        tot, hit = per_seg.get(i, (0, 0))
        per_seg[i] = (tot + 1, hit + (k in matched))
    real = [i for i, (tot, hit) in sorted(per_seg.items()) if hit * 2 >= tot]

    def reject(why):
        lang = rlang[:-len("-orig")] if rlang.endswith("-orig") else rlang
        note = ("manual (human) caption track rejected: %s; using the auto-generated "
                "track instead" % why)
        return rsegs, {"segments": 0, "words": 0}, ("auto", lang, note)

    if not real:
        return reject("its text does not match the video's audio")
    lo, hi = real[0], real[-1]
    keep, cut = segs[lo:hi + 1], segs[:lo] + segs[hi + 1:]
    # is the kept part aligned with the audio?
    pairs = [(mw[k][1] - aw[j][1], aw[j][1]) for k, j in matched.items()
             if lo <= mw[k][2] <= hi]
    kept_words = sum(1 for _, _, i in mw if lo <= i <= hi)
    if len(pairs) < MIN_MATCHED * kept_words:
        return reject("only %d of %d words match the video's audio" % (len(pairs), kept_words))
    pairs.sort(key=lambda p: p[1])
    third = max(1, len(pairs) // 3)
    for part in (pairs[:third], pairs[third:2 * third], pairs[2 * third:]):
        offs = sorted(o for o, _ in part)
        if offs and abs(offs[len(offs) // 2]) > MAX_OFFSET_S:
            return reject("its timing is %.0f s off the video's audio" % offs[len(offs) // 2])
    trimmed = {"segments": len(cut), "words": count_words(cut)}
    # Near the cut points the captioner's timing is often compressed (lines
    # packed 1 s apart), so real lines can sit tens of seconds early/late.
    # Re-time only the segments before the first / after the last segment
    # that is on time, using the audio timing of their matched words.
    by_seg = {}
    for k, j in matched.items():
        i = mw[k][2]
        if lo <= i <= hi:
            by_seg.setdefault(i, []).append(aw[j][1] - mw[k][1])
    off = {i: sorted(v)[len(v) // 2] for i, v in by_seg.items() if len(v) >= 2}
    on_time = [i for i in sorted(off) if abs(off[i]) <= RETIME_S]
    edge = ([i for i in range(lo, on_time[0])] + [i for i in range(on_time[-1] + 1, hi + 1)]
            if on_time else [])
    edge = [i for i in edge if abs(_edge_offset(i, off, on_time)) > RETIME_S]
    if not edge:
        return keep, trimmed, None
    keep = [dict(s) for s in keep]
    worst = 0.0
    for i in edge:
        o = _edge_offset(i, off, on_time)
        worst = max(worst, abs(o))
        keep[i - lo]["t"] = keep[i - lo]["t"] + o
    for p in range(on_time[0] - lo - 1, -1, -1):        # head: not after the next one
        keep[p]["t"] = max(0.0, min(keep[p]["t"], keep[p + 1]["t"]))
    for p in range(on_time[-1] - lo + 1, len(keep)):    # tail: not before the previous
        # one, and starting inside the video
        keep[p]["t"] = min(max(keep[p]["t"], keep[p - 1]["t"]), duration - 0.5)
    keep = finalize_segments(keep)
    note = ("re-timed %d segment(s) next to the start/end of the talk from the auto-generated "
            "track: the manual timing there was compressed (up to %.0f s off the audio)"
            % (len(edge), worst))
    return keep, trimmed, ("manual", None, note)


RETIME_S = 5.0  # an edge segment more than this far off the audio gets re-timed


def _edge_offset(i, off, on_time):
    """Audio-minus-manual offset for edge segment i: its own if known, else
    interpolated between the nearest segments whose offset is known."""
    if i in off:
        return off[i]
    before = [j for j in off if j < i]
    after = [j for j in off if j > i]
    if before and after:
        a, b = max(before), min(after)
        return off[a] + (off[b] - off[a]) * (i - a) / (b - a)
    return off[max(before)] if before else off[min(after)]


# --------------------------------------------------------------------------
# text rendering

def hms(t):
    t = int(t)
    return "%d:%02d:%02d" % (t // 3600, (t % 3600) // 60, t % 60)


def render_txt(rec):
    head = [rec["title"], rec["url"],
            "Year: %s   Kind: %s   Captions: %s (%s)" % (
                rec["year"], rec["kind"], rec["caption_source"], rec["caption_lang"])]
    if rec["speaker"]:
        head.insert(1, "Speaker: %s" % rec["speaker"])
    out = ["\n".join(head), ""]
    chapters = sorted(rec["chapters"], key=lambda c: c["start"])
    ci = 0
    para, para_t = [], None

    def flush():
        if para:
            out.append("[%s] %s" % (hms(para_t), " ".join(para)))
            out.append("")

    for s in rec["segments"]:
        new_chapter = None
        while ci < len(chapters) and s["t"] >= chapters[ci]["start"]:
            new_chapter = chapters[ci]
            ci += 1
        if new_chapter is not None:
            flush()
            para, para_t = [], None
            out.append("## %s" % new_chapter["title"])
            out.append("")
        elif para_t is not None and s["t"] - para_t >= 60:
            flush()
            para, para_t = [], None
        if para_t is None:
            para_t = s["t"]
        para.append(s["text"])
    flush()
    return "\n".join(out).rstrip() + "\n"


# --------------------------------------------------------------------------
# per-video processing

def process(row):
    vid = row["id"]
    url = "https://www.youtube.com/watch?v=" + vid
    info_path = os.path.join(RAW, vid + ".info.json")

    stdout = run_ytdlp(["--skip-download", "--dump-single-json", url], vid)
    try:
        info = json.loads(stdout)
    except ValueError:
        raise Fail("error", "could not parse yt-dlp JSON output")
    write_atomic(info_path, stdout)

    source, lang, ext = pick_track(info)
    for old in glob.glob(os.path.join(RAW, "%s.%s.*" % (vid, lang))):
        os.remove(old)  # don't let yt-dlp reuse a stale/partial file
    run_ytdlp(["--load-info-json", info_path, "--skip-download",
               "--write-subs" if source == "manual" else "--write-auto-subs",
               "--sub-langs", "^%s$" % re.escape(lang), "--sub-format", ext,
               "-o", os.path.join(RAW, "%(id)s.%(ext)s")], vid)
    raw_path = os.path.join(RAW, "%s.%s.%s" % (vid, lang, ext))
    if not os.path.exists(raw_path):
        raise Fail("error", "caption file %s not written" % os.path.basename(raw_path))

    segs = load_segments(raw_path, ext)
    if not segs:
        raise Fail("no_captions", "caption track %s was empty" % lang)
    ref = None
    if source == "manual" and overruns(segs, video_duration(row, info)):
        ref = fetch_reference(vid, info_path, info)
    return write_record(row, info, source, lang, segs, ref)


def video_duration(row, info):
    duration = info.get("duration")
    if duration is None and row["duration_s"]:
        duration = int(row["duration_s"])
    return int(duration) if duration is not None else None


def write_record(row, info, source, lang, segs, ref, note=None):
    """Build transcripts/<id>.json + .txt. `ref` is the reference track for an
    over-long manual track (see fix_overrun), else None. `note` is an optional
    explanation stored with the record (used by transcribe_local.py)."""
    vid = row["id"]
    url = "https://www.youtube.com/watch?v=" + vid
    duration = video_duration(row, info)
    trimmed = {"segments": 0, "words": 0}
    if source == "manual" and overruns(segs, duration):
        segs, trimmed, override = fix_overrun(segs, duration, ref)
        if override:
            new_source, new_lang, note = override
            if new_lang:
                source, lang = new_source, new_lang

    title = info.get("title") or row["title"]
    speaker, talk_title = split_title(title, row["kind"])
    ud = info.get("upload_date") or ""
    upload_date = "%s-%s-%s" % (ud[:4], ud[4:6], ud[6:8]) if len(ud) == 8 else None
    year = int(row["year"]) if row["year"] else (int(ud[:4]) if ud else None)
    rec = {
        "id": vid, "url": url, "title": title,
        "speaker": speaker, "talk_title": talk_title,
        "year": year, "kind": row["kind"],
        "upload_date": upload_date,
        "duration_s": duration,
        "playlists": [p.strip() for p in row["playlists"].split("|") if p.strip()],
        "description": info.get("description") or "",
        "chapters": [{"start": c.get("start_time", 0), "title": c.get("title", "")}
                     for c in (info.get("chapters") or [])],
        "caption_source": source,
        # track 'en-orig' is the original-language English ASR; report it as 'en'
        "caption_lang": lang[:-len("-orig")] if lang.endswith("-orig") else lang,
        "word_count": count_words(segs),
        "trimmed": trimmed,
        "segments": segs,
    }
    if note:
        rec["note"] = note
    write_json(os.path.join(TRANSCRIPTS, vid + ".json"), rec)
    write_atomic(os.path.join(TRANSCRIPTS, vid + ".txt"), render_txt(rec))
    return rec


def reparse(rows):
    """Rebuild transcripts/ from raw/ without any network access."""
    counts = {}

    def bump(k):
        counts[k] = counts.get(k, 0) + 1

    for row in rows:
        vid = row["id"]
        if is_local_stt(vid):
            bump("skip_whisper")  # no caption file; see transcribe_local.py
            continue
        info = load_json(os.path.join(RAW, vid + ".info.json"))
        if info is None:
            bump("no_raw")
            continue
        try:
            source, lang, ext = pick_track(info)
        except Fail as e:
            bump("skip_" + e.reason)
            continue
        raw_path = os.path.join(RAW, "%s.%s.%s" % (vid, lang, ext))
        if not os.path.exists(raw_path):
            print("reparse: %s caption file %s missing, left as is"
                  % (vid, os.path.basename(raw_path)), flush=True)
            bump("no_raw")
            continue
        segs = load_segments(raw_path, ext)
        if not segs:
            bump("skip_empty")
            continue
        ref = None
        if source == "manual" and overruns(segs, video_duration(row, info)):
            ref = find_reference(vid)
            if ref is None and pick_reference(info):
                print("reparse: %s needs reference track raw/%s.%s.* (run without "
                      "--reparse to fetch it), left as is" % (vid, vid, REF_TAG), flush=True)
                bump("missing_reference")
                continue
        rec = write_record(row, info, source, lang, segs, ref)
        bump("ok")
        if rec["trimmed"]["segments"] or rec.get("note"):
            print("reparse: %s %s %dw, trimmed %d segments / %d words%s"
                  % (vid, rec["caption_source"], rec["word_count"],
                     rec["trimmed"]["segments"], rec["trimmed"]["words"],
                     " -- " + rec["note"] if rec.get("note") else ""), flush=True)
    print("reparse summary: " + ", ".join("%s=%d" % kv for kv in sorted(counts.items())),
          flush=True)


def is_local_stt(vid):
    """True when transcripts/<id>.json was made by transcribe_local.py."""
    rec = load_json(os.path.join(TRANSCRIPTS, vid + ".json"))
    return bool(rec) and rec.get("caption_source") == "whisper"


def run(rows, force):
    for d in (TRANSCRIPTS, FAILURES, RAW):
        os.makedirs(d, exist_ok=True)
    counts = {}
    total = len(rows)
    did_network = False
    for i, row in enumerate(rows, 1):
        vid = row["id"]
        tpath = os.path.join(TRANSCRIPTS, vid + ".json")
        fpath = os.path.join(FAILURES, vid + ".json")
        tag = "[%d/%d]" % (i, total)
        if is_local_stt(vid):
            # local speech-to-text (transcribe_local.py); never replaced by a fetch
            counts["skip_whisper"] = counts.get("skip_whisper", 0) + 1
            print("%s skip whisper %s" % (tag, vid), flush=True)
            continue
        if not force:
            if os.path.exists(tpath):
                counts["skip_ok"] = counts.get("skip_ok", 0) + 1
                print("%s skip ok %s" % (tag, vid), flush=True)
                continue
            prev = load_json(fpath)
            if prev and prev.get("reason") in PERMANENT:
                counts["skip_" + prev["reason"]] = counts.get("skip_" + prev["reason"], 0) + 1
                print("%s skip %s %s" % (tag, prev["reason"], vid), flush=True)
                continue
        if did_network:
            time.sleep(BETWEEN_VIDEOS_S)
        did_network = True
        t0 = time.time()
        try:
            rec = process(row)
        except Fail as e:
            write_json(fpath, {"id": vid, "title": row["title"], "reason": e.reason,
                               "detail": e.detail, "attempted_at": now_iso()})
            counts[e.reason] = counts.get(e.reason, 0) + 1
            print("%s %s %s %s (%.0fs) -- %s" % (tag, e.reason, vid, row["title"][:60],
                                                 time.time() - t0, e.detail[:160]), flush=True)
            continue
        except Exception as e:  # never let one video kill a shard
            write_json(fpath, {"id": vid, "title": row["title"], "reason": "error",
                               "detail": ("%s: %s" % (type(e).__name__, e))[:400],
                               "attempted_at": now_iso()})
            counts["error"] = counts.get("error", 0) + 1
            print("%s error %s %s -- %s: %s" % (tag, vid, row["title"][:60],
                                                type(e).__name__, e), flush=True)
            continue
        if os.path.exists(fpath):
            os.remove(fpath)
        counts["ok"] = counts.get("ok", 0) + 1
        print("%s ok %s %dw %s %s (%.0fs)" % (tag, rec["caption_source"], rec["word_count"],
                                             vid, rec["title"][:60], time.time() - t0), flush=True)
    print("summary: " + ", ".join("%s=%d" % kv for kv in sorted(counts.items()))
          + " (total %d)" % total, flush=True)


# --------------------------------------------------------------------------
# index

def build_index(rows):
    index = []
    for row in rows:
        vid = row["id"]
        rec = load_json(os.path.join(TRANSCRIPTS, vid + ".json"))
        fail = load_json(os.path.join(FAILURES, vid + ".json"))
        if rec:
            entry = {k: rec.get(k) for k in ("id", "title", "speaker", "talk_title", "year",
                                             "kind", "duration_s", "upload_date")}
            entry.update(status="ok", caption_source=rec.get("caption_source"),
                         word_count=rec.get("word_count"))
        else:
            speaker, talk_title = split_title(row["title"], row["kind"])
            # no transcript: fill blank manifest fields from the raw metadata, if any
            info = load_json(os.path.join(RAW, vid + ".info.json")) or {}
            ud = info.get("upload_date") or ""
            duration = (int(row["duration_s"]) if row["duration_s"]
                        else video_duration(row, info))
            entry = {"id": vid, "title": row["title"], "speaker": speaker,
                     "talk_title": talk_title,
                     "year": int(row["year"]) if row["year"] else (
                         int(ud[:4]) if len(ud) == 8 else None),
                     "kind": row["kind"],
                     "duration_s": duration,
                     "upload_date": ("%s-%s-%s" % (ud[:4], ud[4:6], ud[6:8])
                                     if len(ud) == 8 else None),
                     "status": fail.get("reason", "error") if fail else "pending",
                     "caption_source": None, "word_count": None}
            if fail:
                entry["_detail"] = fail.get("detail", "")
        index.append(entry)

    details = {e["id"]: e.pop("_detail", "") for e in index}
    write_json(os.path.join(HERE, "index.json"), index)

    totals = {s: 0 for s in STATUSES}
    for e in index:
        totals[e["status"]] = totals.get(e["status"], 0) + 1
    years = {}
    for e in index:
        y = years.setdefault(e["year"], {"talk": [0, 0], "stream": [0, 0],
                                         "manual": 0, "auto": 0, "whisper": 0})
        k = y.setdefault(e["kind"], [0, 0])
        k[1] += 1
        if e["status"] == "ok":
            k[0] += 1
            y[e["caption_source"]] = y.get(e["caption_source"], 0) + 1

    md = ["# Roguelike Celebration transcripts - status", "",
          "Generated %s by `fetch_transcripts.py --index` (%d videos in manifest)."
          % (now_iso(), len(index)), "",
          "## Totals", "", "| status | count |", "|---|---|"]
    md += ["| %s | %d |" % (s, n) for s, n in totals.items()]
    md += ["", "## By year", "",
           "| year | talks ok / total | streams ok / total | manual | auto | whisper |",
           "|---|---|---|---|---|---|"]
    for y in sorted(years, key=lambda y: (y is None, y or 0)):
        v = years[y]
        md.append("| %s | %d / %d | %d / %d | %d | %d | %d |" % (
            y if y is not None else "unknown", v["talk"][0], v["talk"][1],
            v["stream"][0], v["stream"][1], v["manual"], v["auto"], v["whisper"]))
    md += ["", "## Not ok", ""]
    bad = [e for e in index if e["status"] != "ok"]
    if bad:
        md += ["| id | year | title | status | detail |", "|---|---|---|---|---|"]
        for e in bad:
            esc = lambda s: (s or "").replace("|", "\\|").replace("\n", " ")
            md.append("| `%s` | %s | %s | %s | %s |" % (
                e["id"], e["year"] or "", esc(e["title"]), e["status"],
                esc(details.get(e["id"], ""))[:160]))
    else:
        md.append("None.")
    write_atomic(os.path.join(HERE, "STATUS.md"), "\n".join(md) + "\n")
    print("index: " + ", ".join("%s=%d" % kv for kv in totals.items() if kv[1]))


# --------------------------------------------------------------------------

def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--shard", help="I/N: process rows where row_index %% N == I")
    ap.add_argument("--ids", nargs="+", help="process only these video ids")
    ap.add_argument("--force", action="store_true", help="redo even if output exists")
    ap.add_argument("--index", action="store_true",
                    help="only (re)write index.json and STATUS.md")
    ap.add_argument("--reparse", action="store_true",
                    help="rebuild transcripts/ from the files in raw/ (no network)")
    a = ap.parse_args()

    rows = read_manifest()
    if a.index:
        build_index(rows)
        return 0
    if a.shard:
        m = re.fullmatch(r"(\d+)/(\d+)", a.shard)
        if not m or int(m.group(2)) < 1 or int(m.group(1)) >= int(m.group(2)):
            ap.error("--shard must be I/N with 0 <= I < N")
        i, n = int(m.group(1)), int(m.group(2))
        rows = [r for k, r in enumerate(rows) if k % n == i]
    if a.ids:
        by_id = {r["id"]: r for r in rows}
        missing = [x for x in a.ids if x not in by_id]
        if missing:
            ap.error("ids not in manifest (or not in this shard): %s" % " ".join(missing))
        rows = [by_id[x] for x in a.ids]
    if a.reparse:
        reparse(rows)
        return 0
    run(rows, a.force)
    return 0


if __name__ == "__main__":
    sys.exit(main())
