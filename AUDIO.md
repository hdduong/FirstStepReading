# Recorded voice clips

The app speaks with **recorded clips when they exist**, and falls back to the
device's speech-synthesis voice otherwise. Clips live in `public/audio/` and are
keyed by name (no extension), e.g. `public/audio/words/cat.mp3`.

This guide covers turning the FirstStepReading video into per-sound clips.

## 1. Get the exact list of clips to produce

```bash
npm run audio:list
```

This prints every file the app looks for, grouped into three folders:

- `public/audio/sounds/` — letter sounds + family rimes
  (`vowel-a`, `onset-b`…`onset-th`, `rime-at/an/am`, `end-t/n/m`)
- `public/audio/letters/` — letter **names** for the Spell button (`a`…`z`)
- `public/audio/words/` — whole words (`cat`, `mat`, `apple`…)

The list is generated from the book data, so it always matches the app. (Right
now only Book 1 has content, so only Book 1's clips appear.)

## 2. Pull the audio out of the video

[ffmpeg](https://ffmpeg.org/) (one-time: `brew install ffmpeg` /
`choco install ffmpeg` / `apt install ffmpeg`):

```bash
ffmpeg -i firststepreading.mp4 -vn -ac 1 -ar 44100 audio.wav
```

`-vn` drops the video, `-ac 1` makes it mono, `-ar 44100` sets the sample rate.

## 3. Split into individual clips

Since the video isn't already cut per sound, pick one approach:

### Option A — Audacity (most control, recommended)

1. **File ▸ Import ▸ Audio** → `audio.wav`.
2. Listen and, at the start of each sound/word, press **Ctrl+B** to add a label;
   type the clip name from the cut list (e.g. `words/cat` → label it `cat`).
3. Drag label edges to tightly bracket each sound (trim silence).
4. **File ▸ Export ▸ Export Multiple…**, split by **Label**, format **MP3** — it
   writes one file per label name.

### Option B — Automatic split on silence (fast first pass)

Works only if there's a clear pause around each sound. Using
[auto-editor](https://github.com/WyattBlue/auto-editor) or the ffmpeg snippet
below, then rename the numbered outputs per the cut list:

```bash
# Make a labels file: "<start_seconds> <end_seconds> <name>" per line, then:
while read start end name; do
  mkdir -p "public/audio/$(dirname "$name")"
  ffmpeg -i audio.wav -ss "$start" -to "$end" \
    -af "afade=t=in:d=0.01,afade=t=out:st=$(echo "$end-$start-0.01"|bc):d=0.01,loudnorm=I=-16:TP=-1.5" \
    -ac 1 "public/audio/$name.mp3"
done < labels.txt
```

`loudnorm` evens out volume across clips so nothing is jarringly loud or quiet.

## 4. Name and place the files

Match the cut list exactly, e.g.:

```
public/audio/sounds/onset-c.mp3   (the "kuh" sound)
public/audio/sounds/rime-at.mp3   (the "at" ending)
public/audio/letters/c.mp3        (letter name "see")
public/audio/words/cat.mp3        (the word "Cat")
```

Tip: trim leading/trailing silence and keep clips short — they play back-to-back
when sounding a word out.

## 5. Register the clips

```bash
npm run audio:manifest   # rewrites src/lib/clips-manifest.js from public/audio/
npm run dev              # the app now uses your recorded clips
```

Commit `public/audio/**` and the regenerated `src/lib/clips-manifest.js`.
Any clip you haven't recorded yet simply falls back to the device voice, so you
can add them gradually.
