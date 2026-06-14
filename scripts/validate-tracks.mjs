import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = path.resolve(import.meta.dirname, "..");
const tracksPath = path.join(root, "tracks.json");
const required = [
  "id",
  "title",
  "artist",
  "mood",
  "genre",
  "bpm",
  "duration",
  "hasVocal",
  "license",
  "usage",
  "audioUrl"
];

function fail(message) {
  console.error(`[tracks] ${message}`);
  process.exitCode = 1;
}

function isUrl(value) {
  return /^https?:\/\//.test(value || "");
}

const raw = fs.readFileSync(tracksPath, "utf8");
const tracks = JSON.parse(raw);

if (!Array.isArray(tracks)) {
  fail("tracks.json must be an array.");
} else {
  const ids = new Set();
  tracks.forEach((track, index) => {
    const label = track.id || `track at index ${index}`;
    required.forEach((field) => {
      if (!(field in track)) fail(`${label} is missing ${field}.`);
    });
    if (ids.has(track.id)) fail(`${label} has a duplicate id.`);
    ids.add(track.id);
    if (!Array.isArray(track.mood) || track.mood.length === 0) fail(`${label} needs at least one mood.`);
    if (!Array.isArray(track.genre) || track.genre.length === 0) fail(`${label} needs at least one genre.`);
    if (!Number.isFinite(track.bpm) || track.bpm < 40 || track.bpm > 220) fail(`${label} has an invalid bpm.`);
    if (!/^\d{2}:\d{2}$/.test(track.duration)) fail(`${label} duration must be MM:SS.`);
    if (typeof track.hasVocal !== "boolean") fail(`${label} hasVocal must be boolean.`);
    if (!isUrl(track.audioUrl)) fail(`${label} audioUrl must be an http(s) URL.`);
  });
}

if (!process.exitCode) {
  console.log(`[tracks] ok: ${tracks.length} track${tracks.length === 1 ? "" : "s"}`);
}
