#!/usr/bin/env python3
"""Record the film's narration, one clip per subtitle cue.

Reads the cue text straight from src/script.js, rewrites it for the ear
(citations dropped, units and abbreviations spoken), synthesises each cue
with an offline voice, and writes:

  <out>/cue-NN.wav      one clip per cue
  <out>/narration.wav   the whole track, laid out on the film's timeline
  <out>/durations.json  how long each cue must last, for tools/render.mjs

Usage: narrate.py <out-dir> [--engine kokoro|piper] [--voice NAME] [--models DIR]
Needs: pip install kokoro-onnx soundfile   (or piper-tts), plus the model files
kokoro-v1.0.onnx and voices-v1.0.bin in --models (default: the out dir)
"""
import json, re, sys, pathlib
import numpy as np, soundfile as sf

LEAD, TAIL, MIN_CUE = 0.35, 0.75, 5.0   # silence before / after each clip, seconds
HERE = pathlib.Path(__file__).resolve().parent

def cues():
    src = (HERE.parent / 'src' / 'script.js').read_text()
    body = src[src.index('export const CUES'):src.index('export const DEFAULTS')]
    return [re.sub(r"\\'", "'", m) for m in re.findall(r"text: '((?:[^'\\]|\\.)*)'", body)]

SAY = [
    (r'\[\[[\w-]+\]\]', ''),
    (r'(\d)\s?mm\b', r'\1 millimetres'), (r'(\d)\s?cm\b', r'\1 centimetres'),
    (r'20/200', 'twenty two-hundred'), (r'20/20', 'twenty twenty'),
    (r'(\d)%', r'\1 percent'), (r'100,000', 'one hundred thousand'),
    (r'apnoea', 'apnea'), (r'\bsclera\b', 'skleera'), (r'\b[Pp]relaminar\b', 'pre-lamminer'), (r'amiodarone', 'ammy-oh-darone'),
    (r'\s—\s', ', '), (r'“|”', ''), (r'’', "'"),
]
def spoken(text):
    for a, b in SAY: text = re.sub(a, b, text)
    return re.sub(r'\s+', ' ', text).strip()

def main():
    out = pathlib.Path(sys.argv[1]); out.mkdir(parents=True, exist_ok=True)
    arg = lambda k, d: sys.argv[sys.argv.index(k) + 1] if k in sys.argv else d
    engine, texts = arg('--engine', 'kokoro'), [spoken(t) for t in cues()]
    (out / 'spoken.txt').write_text('\n\n'.join(texts))
    if engine == 'kokoro':
        from kokoro_onnx import Kokoro
        models = pathlib.Path(arg('--models', str(out)))
        k, voice, sr = Kokoro(str(models / 'kokoro-v1.0.onnx'), str(models / 'voices-v1.0.bin')), arg('--voice', 'bm_george'), 24000
        synth = lambda t: k.create(t, voice=voice, speed=0.95, lang='en-gb')[0]
    else:
        from piper import PiperVoice
        v = PiperVoice.load(arg('--voice', str(out / 'voice.onnx'))); sr = v.config.sample_rate
        synth = lambda t: np.concatenate([c.audio_float_array for c in v.synthesize(t)])
    track, durations = [], []
    for i, t in enumerate(texts):
        clip = np.asarray(synth(t), dtype=np.float32)
        sf.write(out / f'cue-{i:02d}.wav', clip, sr)
        lead = LEAD + (1.2 if i == 0 else 0)
        dur = max(MIN_CUE, lead + len(clip) / sr + TAIL)
        n = round(dur * sr)
        slot = np.zeros(n, dtype=np.float32); a = round(lead * sr); slot[a:a + len(clip)] = clip[:n - a]
        track.append(slot); durations.append(n / sr)
        print(f'{i:02d} {durations[-1]:6.2f}s  {t[:70]}', flush=True)
    sf.write(out / 'narration.wav', np.concatenate(track), sr)
    (out / 'durations.json').write_text(json.dumps(durations))
    print('total', round(sum(durations), 1), 's')

if __name__ == '__main__': main()
