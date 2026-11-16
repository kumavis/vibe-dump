#!/usr/bin/env python3
"""Local speech-to-text transcripts for videos with no usable English captions.

Some talks (Thomas Biskup's) only have a YouTube auto-caption track that was
mis-detected as German, so fetch_transcripts.py records them as no_captions.
This script transcribes their audio locally with Whisper (mlx-whisper on Apple
Silicon) and writes transcripts/<id>.json + .txt in the usual format with
caption_source "whisper". No cloud API is used.

Steps (both per id; default ids are the six Biskup talks):
  stt    raw/audio/<id>.* -> raw/whisper/<id>.json   (needs mlx-whisper):
         uv run --no-project --python 3.12 --with mlx-whisper \\
             python transcribe_local.py stt [ID ...]
  build  raw/whisper/<id>.json + raw/<id>.info.json -> transcripts/<id>.*,
         removes failures/<id>.json (standard library only):
         python3 transcribe_local.py build [ID ...]

Audio is fetched beforehand with
  yt-dlp --ignore-config --sleep-requests 1 -f bestaudio -o 'raw/audio/%(id)s.%(ext)s' URL
"""

import glob
import json
import os
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import fetch_transcripts as ft  # noqa: E402

MODEL = "mlx-community/whisper-large-v3-turbo"
MODEL_NAME = "Whisper large-v3-turbo"
AUDIO = os.path.join(ft.RAW, "audio")
WHISPER = os.path.join(ft.RAW, "whisper")
DEFAULT_IDS = ["a3ZYDA2JVSM", "iZUXjbcAfYs", "5CQP8ndTjEY",
               "fGLJC5UY2o4", "PTIsUSbQ0TA", "hnoF_bL-HjI"]
# Vocabulary hint for the first window only (names Whisper would misspell).
PROMPT = "Thomas Biskup talks about ADOM, Ultimate ADOM, roguelikes and NetHack."
# Settings chosen by comparing runs on these talks: conditioning on previous
# text made Whisper invent and loop lines; without word timestamps, large-v3
# looped a sentence 4x and produced runs of fragments in fixed 2 s slots;
# hallucination_silence_threshold=2 silently dropped real speech (up to 30 s);
# large-v3 (non-turbo) dropped more speech than turbo with the same settings.
OPTIONS = dict(language="en", task="transcribe", condition_on_previous_text=False,
               temperature=(0.0, 0.2, 0.4, 0.6, 0.8, 1.0),
               compression_ratio_threshold=2.4, logprob_threshold=-1.0,
               no_speech_threshold=0.6, initial_prompt=PROMPT,
               word_timestamps=True)


def stt(vid):
    import mlx_whisper
    audio = [p for p in glob.glob(os.path.join(AUDIO, vid + ".*")) if not p.endswith(".part")]
    if not audio:
        raise SystemExit("no audio for %s in %s" % (vid, AUDIO))
    t0 = time.time()
    res = mlx_whisper.transcribe(audio[0], path_or_hf_repo=MODEL, verbose=None, **OPTIONS)
    out = {"model": MODEL, "options": OPTIONS, "audio": os.path.basename(audio[0]),
           "seconds": round(time.time() - t0, 1),
           "segments": [{k: s[k] for k in ("start", "end", "text", "temperature",
                                           "avg_logprob", "compression_ratio",
                                           "no_speech_prob")}
                        for s in res["segments"]]}
    os.makedirs(WHISPER, exist_ok=True)
    ft.write_json(os.path.join(WHISPER, vid + ".json"), out)
    print("stt %s: %d segments in %.0fs" % (vid, len(out["segments"]), out["seconds"]),
          flush=True)


def build(vid, rows):
    raw = ft.load_json(os.path.join(WHISPER, vid + ".json"))
    info = ft.load_json(os.path.join(ft.RAW, vid + ".info.json"))
    if raw is None or info is None:
        raise SystemExit("%s: missing raw/whisper/%s.json or raw/%s.info.json" % (vid, vid, vid))
    segs = []
    for s in raw["segments"]:
        text = ft.clean(s["text"])
        if text:
            segs.append({"t": float(s["start"]), "d": max(0.0, s["end"] - s["start"]),
                         "text": text})
    segs = ft.finalize_segments(segs)
    note = ("Transcript made locally with speech-to-text (%s, language forced to English) "
            "because YouTube's only caption track for this video is a mis-detected German "
            "track." % MODEL_NAME)
    rec = ft.write_record(rows[vid], info, "whisper", "en", segs, None, note=note)
    fpath = os.path.join(ft.FAILURES, vid + ".json")
    if os.path.exists(fpath):
        os.remove(fpath)
    print("build %s: %d segments, %d words" % (vid, len(segs), rec["word_count"]), flush=True)


def main():
    if len(sys.argv) < 2 or sys.argv[1] not in ("stt", "build"):
        raise SystemExit(__doc__)
    ids = sys.argv[2:] or DEFAULT_IDS
    rows = {r["id"]: r for r in ft.read_manifest()}
    missing = [v for v in ids if v not in rows]
    if missing:
        raise SystemExit("not in manifest: " + " ".join(missing))
    for vid in ids:
        stt(vid) if sys.argv[1] == "stt" else build(vid, rows)


if __name__ == "__main__":
    main()
