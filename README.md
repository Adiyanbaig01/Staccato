# Staccato

Staccato is a dark, glassy music streaming web app that uses YouTube as a stateless audio backend through `yt-dlp`.

## Tech Stack

- Frontend: HTML, CSS, vanilla JavaScript
- Backend: Node.js, Express
- Streaming helper: `yt-dlp` installed on the host machine
- Deployment targets: Vercel for the static frontend, Render for the Node backend

## Setup

1. Install Node.js 18 or newer.
2. Install `yt-dlp` and make sure it is available on your `PATH`.
3. Install dependencies:

```bash
npm install
```

4. Create or update `.env`:

```bash
PORT=3000
YT_DLP_PATH=yt-dlp
```

5. Start the app:

```bash
npm start
```

6. Open `http://localhost:3000`.

## API

- `GET /api/health` returns `{ "status": "ok" }`
- `GET /api/search?q=song+name` searches YouTube with `yt-dlp`
- `GET /api/stream/:videoId` returns a fresh audio stream URL

## How It Works

The frontend calls `/api/search` as you type in the navbar search. The backend runs:

```bash
yt-dlp "ytsearch5:<query>" --dump-json --flat-playlist --no-warnings
```

When a track is selected, the frontend calls `/api/stream/:videoId`. The backend runs:

```bash
yt-dlp -f "bestaudio" -g "https://www.youtube.com/watch?v=<id>" --no-warnings
```

The returned YouTube stream URL is assigned directly to the browser audio player. These stream URLs expire after roughly 6 hours, so Staccato never caches them.

## Deployment

### Backend on Render

Render uses `Procfile` and `render.yaml` in this repo. `yt-dlp` must be installed on the server because it is not an npm package:

```bash
sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && sudo chmod a+rx /usr/local/bin/yt-dlp
```

Set `YT_DLP_PATH=yt-dlp` in Render environment variables if needed.

### Frontend on Vercel

The static frontend is ready for Vercel with `vercel.json`. If the frontend is hosted separately from the backend, set `window.STACCATO_API_BASE` in `config.js` to your Render backend URL.

## Notes

- No database is needed for the MVP.
- `.env` is ignored by Git and should never be committed.
- CORS is open for development.
- API rate limit is 30 requests per minute per IP.
