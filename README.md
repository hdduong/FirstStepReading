# FirstStepReading

FirstStepReading is a free, ad-free interactive companion app that helps kids practice letter sounds, word families, and early reading skills alongside the FirstStepReading.com books and videos.

The app gives young learners another way to connect letters with sounds. Kids can tap words to hear them, practice short-vowel word families, listen to sentences, and build confidence through simple touch-based activities.

## What Kids Can Practice

- Letter sounds and short-vowel patterns
- Word families like `-at`, `-an`, and `-am`
- Sight words from the reading pages
- Listening, tapping, and reading simple sentences
- Matching spoken words in a playful practice game

_For now, kids can practice with all of Book 1 (ABC's and Short Vowels); Books 2 and 3 are coming soon._

## Companion To Books And Videos

This app is designed to complement the FirstStepReading books and videos. It is not meant to replace reading together, but to give children an interactive way to review the same sounds, words, and sentence patterns they are learning.

## Free And Ad-Free

FirstStepReading is completely free to use and contains no ads.

## How It Works

The reading content (words, sight words, and sentences for each book) lives as plain data in `src/data/`. A small phonics engine (`src/lib/phonics.js`) splits each word into its onset and rime and into individual letter sounds, so the app can sound words out, spell them, and highlight each word as it is read aloud.

Audio is **clip-first**: for every sound, letter, and word the app plays a pre-recorded clip when one exists, and falls back to the browser's built-in speech synthesis when it doesn't. The recorded clips are generated with ElevenLabs and committed to the repo, so **no API key or network call is needed at runtime**.

## Technology Used

- **React 19** — the interactive reading-practice interface
- **Vite 8** — local dev server, fast refresh, and production builds
- **JavaScript + JSX (ES modules)** — application code; book content as data modules
- **Express 5 (Node 22)** — `server/index.js` serves the built SPA and the `/api` backend in production
- **ElevenLabs voice clips** — pre-generated, per-voice audio packs committed under `public/audio/` (no runtime API key); the browser **Web Speech API** is the fallback when a clip is missing
- **Inline SVG art, emoji, and responsive CSS** — the kid-friendly visuals
- **Vitest** — unit tests for the phonics logic and the book data
- **Playwright** — end-to-end browser tests
- **ESLint** (React Hooks + React Refresh rules) — code quality
- **GitHub Actions** — CI (lint, unit tests, build, e2e) and deployment
- **Azure App Service** (Linux, Node 22) — hosting, provisioned from **Bicep** infrastructure-as-code in `infra/`
- **npm** — dependency management and project scripts

## Project Structure

```text
src/
  App.jsx              # top-level app + tab routing
  components/          # UI: Sidebar, PopOut, VoiceSettings, tabs/, …
  lib/
    phonics.js         # word -> onset/rime + letter sounds
    useSpeech.js       # clip-first playback, voice pack + speed
    audio.js           # clip URL resolution per voice pack
    clips-manifest.js  # generated list of available audio clips
  data/
    book1.js .. book3.js  # transcribed book content (words/sight/sentences)
    voicePacks.js      # ElevenLabs voice packs + default
server/index.js        # Express: serves dist/ + /api in production
scripts/               # audio + video generation, Azure deploy helper
public/audio/          # committed voice clips (per voice pack)
infra/                 # Bicep IaC for Azure App Service
e2e/                   # Playwright specs
.github/workflows/     # ci.yml, deploy.yml, provision.yml
```

## Getting Started (Local Development)

**Prerequisites:** Node.js **22+** and npm.

```bash
npm install
npm run dev          # Vite dev server -> http://localhost:5173
```

`npm run dev` runs the **Vite dev server**: it serves the React app from source
with instant hot-reload. This is all you need for UI work.

If you want to exercise the **backend** (`/api`) locally, run the Node/Express
server too — the dev server proxies `/api` calls to it:

```bash
npm start            # Express server -> http://localhost:3000 (serves /api)
```

To preview the real production bundle locally, build first, then start the
server (which serves the built `dist/`):

```bash
npm run build
npm start            # http://localhost:3000
```

### Common scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with hot reload (port 5173) |
| `npm start` | Express server serving `dist/` + `/api` (port 3000) |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the built `dist/` with Vite (port 4173) |
| `npm run lint` | ESLint |
| `npm test` | Vitest unit tests (logic + data) |
| `npm run test:e2e` | Playwright end-to-end tests |

## Voices & Audio (ElevenLabs)

The app ships with recorded clips already committed, so it speaks out of the box
with no setup. You only need an ElevenLabs API key to **(re)generate** clips.

Voice packs are defined in `src/data/voicePacks.js` — six ElevenLabs voices plus
the original video clips, defaulting to **Alice**. Generated files are written
one folder per voice, e.g. `public/audio/elevenlabs/alice/words/cat.mp3`.

To regenerate clips:

```bash
cp .env.example .env.local        # then set ELEVENLABS_API_KEY (.env.local is gitignored)

npm run audio:list                # show every clip the app expects
npm run audio:elevenlabs -- --voices                       # list configured voices
npm run audio:elevenlabs -- --voice elevenlabs-alice --folder words --limit 8
npm run audio:manifest            # rewrite src/lib/clips-manifest.js from public/audio/
```

See **[AUDIO.md](./AUDIO.md)** for the full workflow (cutting clips from video,
generating each voice pack, and registering them).

## Testing

```bash
npm test             # Vitest: phonics logic + book-data integrity (Node env)
npm run test:e2e     # Playwright: builds, previews on :4173, drives Chromium
```

Both suites run automatically in GitHub Actions (`.github/workflows/ci.yml`) on
every push and pull request.

## Deployment

The app is hosted on **Azure App Service** (Linux, Node 22) and is deployed via
**GitHub Actions**.

**Deploy (recommended — manual trigger):**

1. One-time: add the repo secret `AZURE_WEBAPP_PUBLISH_PROFILE`
   (Azure Portal → App Service → **Get publish profile** → paste the file
   contents into GitHub → Settings → Secrets and variables → Actions).
2. **Actions** tab → **Deploy to Azure App Service** → **Run workflow**.

The workflow builds the app, prunes dev dependencies, and deploys only the
runtime files (`dist/`, `server/`, `package.json`, and production
`node_modules`).

**Infrastructure (Bicep):** `infra/main.bicep` provisions the App Service plan
and Web App. Provision it from the **Provision Azure infrastructure (Bicep)**
workflow (OIDC, no stored passwords) or with the Azure CLI. Subscription and
tenant IDs are never committed — they live only in GitHub secrets. See
**[infra/README.md](./infra/README.md)** for the one-time setup.

> A local helper, `scripts/deploy-azure.sh`, can also deploy from your machine
> (it reads a gitignored `.env.azure`), but GitHub Actions is the preferred path
> because it runs on a clean environment.

## Credits

Reading content is based on the **FirstStepReading** program. FirstStepReading
book and video content belongs to its respective owner —
[FirstStepReading.com](https://firststepreading.com).
