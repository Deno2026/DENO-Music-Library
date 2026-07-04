# DENO Music Library

GPL-3.0 AI-generated music from DENO.

Preview tracks in the browser, download the ones you like, and use them under GPL-3.0.

## Use

- Free download
- Free personal use
- Free commercial use
- Modification and redistribution allowed under GPL-3.0
- Distributed modified versions must follow GPL-3.0

All DENO-owned tracks and project-local files in this repository use GNU GPL v3.0 (`GPL-3.0-only`).

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

See [LICENSE](LICENSE).
