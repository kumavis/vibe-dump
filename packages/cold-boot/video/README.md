# Cold Boot — the narrated cut

A video version of the walkthrough: the same scene, no side panel, one caption
line, and a voice. The page renders it itself in **video mode**
(`index.html?video`); these scripts voice it, step it frame by frame, and
encode it.

```
cut.json ──tts.py──▶ audio.wav + timed.json ──capture.mjs──▶ frames/*.jpg ──ffmpeg──▶ <out>.mp4
```

- **`cut.json`** — the script. Each segment plays one walkthrough step (`step`,
  from `p0` to `p1`) while its lines (`say`) are spoken. A line is either its
  caption, or `[caption, how to say it]` when the speech engine needs help
  (`"8086"` → `"eighty eighty-six"`, `"RAM"` → `"ram"`). Optional per segment:
  `shot` (a shot name, or cues `[[u, name], ...]` where `u` is a fraction of the
  segment or `"@N"` for "when line N starts"), `inset` (same cues; `null` hides
  the picture-in-picture), `drift` (degrees per second the camera orbits).
- **`tts.py`** — voices every sentence with [Kokoro](https://huggingface.co/hexgrad/Kokoro-82M)
  (Apache-2.0, runs locally on the CPU), lays them out with pauses, rounds each
  segment to whole frames, and writes the narration track plus `timed.json`
  (the cut with durations and caption times filled in).
- **`capture.mjs`** — opens the built app in video mode at the cut's size,
  calls `__coldboot.video.frame(t)` for every frame, screenshots it (captions are
  HTML, so a page screenshot rather than a canvas grab) and muxes H.264 + AAC
  with ffmpeg.

## Running it

```bash
# once: a Python env with the TTS and its model files
python3 -m venv venv && venv/bin/pip install kokoro-onnx soundfile
#   kokoro-v1.0.onnx + voices-v1.0.bin from
#   https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0

npm run build                                    # in packages/cold-boot
venv/bin/python video/tts.py video/cut.json out/cut --models <model dir>
node video/capture.mjs out/cut/timed.json out/cut/audio.wav out/cut
#   --frames a:b   render only frames a..b-1     --preroll s   settle time before the first frame
#   --pr 0.75      render the 3-D at 75 % resolution
```

If `tts.py` prints `Error processing file '/Users/runner/…/phontab'` and voices
nothing, the venv's path is too long for espeak-ng's fixed path buffer (about
160 characters), and it fell back to the data path baked in where its wheel was
built. Give it a short path to the same data:

```bash
ln -s "$(venv/bin/python -c 'import espeakng_loader; print(espeakng_loader.get_data_path())')" /tmp/espeak-ng-data
ESPEAK_DATA_PATH=/tmp/espeak-ng-data venv/bin/python video/tts.py video/cut.json out/cut --models <model dir>
```

Nothing runs on the wall clock in video mode, so a slow renderer only makes the
capture slower, never choppier. Without a GPU (headless Chromium falls back to
SwiftShader) a 1920×1080 frame takes about 3 s; `--pr 0.75` renders the
3-D at 75 % (about 2 s) while captions stay sharp. On a machine with a GPU,
`GPU=1` opens a visible browser window that renders on it, which is far faster
(`CHROMIUM_PATH` picks the browser either way).
