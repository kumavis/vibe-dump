#!/usr/bin/env python3
"""Voice the narrated cut with Kokoro, an open TTS model that runs locally.

usage: tts.py cut.json outdir [--models DIR] [--only name,name]

Writes outdir/audio.wav (the whole narration track) and outdir/timed.json: the
cut with each segment's length in whole frames and caption times filled in
from the length of its spoken lines. capture.mjs renders frames against that.

Needs: pip install kokoro-onnx soundfile, and the model files
kokoro-v1.0.onnx + voices-v1.0.bin (github.com/thewh1teagle/kokoro-onnx
releases, "model-files-v1.0") in --models.
"""
import argparse
import json
import os
import re

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

ap = argparse.ArgumentParser()
ap.add_argument('cut')
ap.add_argument('outdir')
ap.add_argument('--models', default=os.environ.get('KOKORO_MODELS', '.'))
ap.add_argument('--only', default='')
a = ap.parse_args()

cut = json.load(open(a.cut))
if a.only:
    keep = set(a.only.split(','))
    cut['segments'] = [s for s in cut['segments'] if s['name'] in keep]
os.makedirs(a.outdir, exist_ok=True)
tts = Kokoro(os.path.join(a.models, 'kokoro-v1.0.onnx'), os.path.join(a.models, 'voices-v1.0.bin'))

SR = 24000
lead, gap, tail = cut.get('lead', 0.7), cut.get('gap', 0.35), cut.get('tail', 1.0)
track = []


def split(text):
    # sentences: break after . ! ? followed by a space and a capital or digit
    return [x for x in re.split(r'(?<=[.!?])\s+(?=[A-Z0-9"“])', text.strip()) if x]


def silence(sec):
    return np.zeros(int(round(sec * SR)), dtype=np.float32)


for seg in cut['segments']:
    t = lead
    parts = [silence(lead)]
    caps = []
    # Each sentence is voiced (and captioned) on its own, so captions stay
    # short and their timing is exact.
    lines = []
    for item in seg['say']:
        # a line is its caption, or [caption, how to say it] when the text-to-
        # speech needs help ("8086" -> "eighty eighty-six", "RAM" -> "ram")
        line, spoken = (item, item) if isinstance(item, str) else item
        a_, b_ = split(line), split(spoken)
        assert len(a_) == len(b_), (line, spoken)
        for k, (x, y) in enumerate(zip(a_, b_)):
            lines.append((x, y, k == len(a_) - 1))
    for i, (line, spoken, last) in enumerate(lines):
        audio, sr = tts.create(spoken, voice=seg.get('voice', cut['voice']), speed=seg.get('speed', cut.get('speed', 1.0)), lang='en-us')
        assert sr == SR, sr
        d = len(audio) / SR
        caps.append({'t0': round(t - 0.1, 3), 't1': round(t + d + 0.15, 3), 'text': line, 'line': len([x for x in lines[:i] if x[2]])})
        parts.append(audio.astype(np.float32))
        t += d
        if i < len(lines) - 1:
            g = gap if last else gap * 0.5
            parts.append(silence(g))
            t += g
    t += tail
    parts.append(silence(tail))
    # whole video frames, so audio and picture stay in step segment by segment
    fps = cut['fps']
    frames = int(np.ceil(t * fps - 1e-9))
    dur = frames / fps
    # pad to exactly the segment's frames worth of samples
    seg_audio = np.concatenate(parts)
    n = int(round(frames * SR / fps))
    parts = [np.pad(seg_audio, (0, max(0, n - len(seg_audio))))[:n]]
    for x, y in zip(caps, caps[1:]):  # a quick dip between back-to-back captions
        if x['t1'] > y['t0']:
            x['t1'] = y['t0'] = round((x['t1'] + y['t0']) / 2, 3)
    seg['frames'] = frames
    seg['captions'] = caps
    # shot and inset cues may name a line ("@2": when line 2 starts) instead of a fraction
    first = lambda n: next(c['t0'] for c in caps if c['line'] == n)
    for key in ('shot', 'inset'):
        if isinstance(seg.get(key), list):
            seg[key] = [[round(first(int(k[1:])) / dur, 4) if isinstance(k, str) else k, v] for k, v in seg[key]]
    track.extend(parts)
    print(f"{seg['name']}: {dur:.2f}s, {len(caps)} lines")

audio = np.concatenate(track)
# the narration track is exactly as long as the video (segments are whole frames)
want = int(round(sum(s['frames'] for s in cut['segments']) / cut['fps'] * SR))
audio = np.pad(audio, (0, max(0, want - len(audio))))[:want]
sf.write(os.path.join(a.outdir, 'audio.wav'), audio, SR)
json.dump(cut, open(os.path.join(a.outdir, 'timed.json'), 'w'), indent=1)
print(f"total {len(audio) / SR:.2f}s -> {a.outdir}")
