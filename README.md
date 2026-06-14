# DENO Music Library

Free AI-generated music from DENO.

Preview tracks in the browser, download the ones you like, and use them in personal or commercial projects.

## Use

- Free download
- Free personal use
- Free commercial use
- No attribution required
- No source credit required

All tracks use `DENO Free Music License v1`.

## Library

The site is a static music library.

- `index.html` renders the app.
- `tracks.json` stores public track metadata.
- Audio files are hosted separately on Cloudflare R2.
- No MP3 or WAV files are stored in this GitHub repository.

Current track count:

- 23 tracks total
- 14 BGM tracks
- 9 vocal music tracks

## Local Preview

Run a local static server from this folder:

```powershell
python -m http.server 8877 --bind 127.0.0.1
```

Then open:

```text
http://127.0.0.1:8877/
```

## Validate Metadata

```powershell
node scripts/validate-tracks.mjs
node --check app.js
```

## Deploy

This folder is ready for GitHub Pages.

Recommended repository name:

```text
DENO-Music-Library
```

Recommended Pages source:

```text
Deploy from branch: main / root
```

## License

See [DENO_FREE_MUSIC_LICENSE_v1.md](DENO_FREE_MUSIC_LICENSE_v1.md).
