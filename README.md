# DENO Music Library

<p align="center">
  <img src="assets/brand/og-image.png" alt="DENO Music Library — preview, organize, and download AI-generated music" width="100%">
</p>

Preview, organize, and download DENO's AI-generated music from a practical browser library.

**[Open DENO Music Library](https://deno2026.github.io/DENO-Music-Library/)**

![DENO Music Library with category, filter, preview, favorite, and download controls](assets/readme/music-library-desktop.png)

The current public library contains **650 tracks**: **14 BGM tracks** and **636 vocal tracks**.

## AI Generation Disclosure

The 627-track MiniMax collection was generated with [MiniMax-Music3](https://github.com/MiniMax-AI/MiniMax-Music3), and its cover art was generated with [Krea 2 Turbo](https://github.com/krea-ai/krea-2). These tracks and covers are machine-generated. The [MiniMax-Music3 Community License](https://huggingface.co/MiniMaxAI/MiniMax-Music3/blob/main/LICENSE), [Krea 2 Community License](https://github.com/krea-ai/krea-2/blob/main/docs/KREA-2-COMMUNITY-LICENSE), and their acceptable-use terms remain separate from the GPL-3.0 license applied to DENO-owned release assets and site code.

Krea's community license permits commercial use of Krea 2 outputs only while total company-wide trailing-twelve-month revenue remains below USD 1 million; use at or above that threshold requires an enterprise license from Krea.

## How to Use

1. Open the [live library](https://deno2026.github.io/DENO-Music-Library/), then choose **All**, **Vocal Music**, or **BGM**. Search by title or narrow the list by mood and style.
2. Select a track or its play button to preview it. Use the heart button to keep useful tracks in your browser favorites.
3. Select **Download** beside the track you want to save.

## What You Can Do

- Preview all tracks directly in the browser.
- Filter by category, mood, style, search text, or favorites.
- Use the persistent player for previous, next, repeat, volume, and favorite controls.
- Download individual tracks without creating an account.

## License

DENO-owned tracks, site source, documentation, and project-local assets in this repository are released under [GNU GPL v3.0](LICENSE) (`GPL-3.0-only`). Personal and commercial use is allowed. If you distribute modified versions, you must follow GPL-3.0 and preserve the applicable copyright and license notices.

Third-party tools, services, models, datasets, and externally hosted assets keep their own licenses and terms. Check the applicable terms before using or redistributing them.

## Developer Notes

The public page is a static site. `tracks.json` stores track metadata, while the audio files are hosted separately on Cloudflare R2; MP3 and WAV files are not stored in this GitHub repository.

### Local Preview

Run a local static server from this folder:

```powershell
python -m http.server 8877 --bind 127.0.0.1
```

Then open `http://127.0.0.1:8877/`.

### Validate Metadata

```powershell
node scripts/validate-tracks.mjs
node --check app.js
```
