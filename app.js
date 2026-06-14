const fallbackTracks = [
  {
    id: "deno-bgm-001",
    title: "F-Major Glass Piano Soft Groove",
    artist: "DENO",
    mood: ["focused", "calm", "soft"],
    genre: ["ambient", "electronic", "piano"],
    bpm: 82,
    duration: "03:05",
    hasVocal: false,
    license: "DENO Free Music License v1",
    usage: "Free for personal and commercial use. No attribution required.",
    audioUrl: "https://deno2026.github.io/Deno-AI-HUB/assets/audio/deno-bgm-local-ai-music.wav"
  }
];

const state = {
  tracks: [],
  filteredTracks: [],
  activeTrack: null,
  favorites: new Set(),
  repeatMode: "off",
  volume: 1,
  sheetOpen: false,
  filters: {
    category: "all",
    search: "",
    moods: new Set(),
    genres: new Set(),
    vocal: "all",
    favoritesOnly: false
  }
};

const storageKeys = {
  favorites: "denoMusic:favorites:v1",
  settings: "denoMusic:settings:v1"
};

const dom = {
  signalCanvas: document.getElementById("signal-canvas"),
  trackList: document.getElementById("track-list"),
  emptyState: document.getElementById("empty-state"),
  visibleCount: document.getElementById("visible-count"),
  activeFilterCount: document.getElementById("active-filter-count"),
  emptyTitle: document.querySelector("#empty-state strong"),
  emptyHint: document.querySelector("#empty-state span"),
  categoryTabs: document.getElementById("category-tabs"),
  selectedCategoryLabel: document.getElementById("selected-category-label"),
  searchInput: document.getElementById("search-input"),
  moodFilters: document.getElementById("mood-filters"),
  genreFilters: document.getElementById("genre-filters"),
  vocalFilterBlock: document.getElementById("vocal-filter-block"),
  vocalFilter: document.getElementById("vocal-filter"),
  favoriteFilter: document.getElementById("favorite-filter"),
  resetFilters: document.getElementById("reset-filters"),
  audio: document.getElementById("audio-player"),
  playerDock: document.getElementById("player-dock"),
  dockOpen: document.getElementById("dock-open"),
  dockArt: document.querySelector(".dock-art"),
  dockTitle: document.getElementById("dock-title"),
  dockMeta: document.getElementById("dock-meta"),
  dockPrev: document.getElementById("dock-prev"),
  dockFavorite: document.getElementById("dock-favorite"),
  dockPlay: document.getElementById("dock-play"),
  dockNext: document.getElementById("dock-next"),
  dockRepeat: document.getElementById("dock-repeat"),
  dockVolume: document.getElementById("dock-volume"),
  dockSeek: document.getElementById("dock-seek"),
  playerBackdrop: document.getElementById("player-backdrop"),
  playerSheet: document.getElementById("player-sheet"),
  sheetClose: document.getElementById("sheet-close"),
  sheetArt: document.querySelector(".sheet-art"),
  sheetTitle: document.getElementById("sheet-title"),
  sheetMeta: document.getElementById("sheet-meta"),
  sheetTags: document.getElementById("sheet-tags"),
  sheetSeek: document.getElementById("sheet-seek"),
  sheetCurrent: document.getElementById("sheet-current"),
  sheetDuration: document.getElementById("sheet-duration"),
  sheetRepeat: document.getElementById("sheet-repeat"),
  sheetPrev: document.getElementById("sheet-prev"),
  sheetPlay: document.getElementById("sheet-play"),
  sheetNext: document.getElementById("sheet-next"),
  sheetVolume: document.getElementById("sheet-volume"),
  sheetFavorite: document.getElementById("sheet-favorite"),
  sheetDownload: document.getElementById("sheet-download")
};

const icons = {
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"></path></svg>',
  pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14"></path><path d="M16 5v14"></path></svg>',
  next: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 5 8 7-8 7V5z"></path><path d="M18 5v14"></path></svg>',
  prev: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m18 19-8-7 8-7v14z"></path><path d="M6 5v14"></path></svg>',
  heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 1 0-7.6 7.6L12 21l8.8-8.8a5.4 5.4 0 0 0 0-7.6z"></path></svg>',
  repeat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m17 2 4 4-4 4"></path><path d="M3 11V8a2 2 0 0 1 2-2h16"></path><path d="m7 22-4-4 4-4"></path><path d="M21 13v3a2 2 0 0 1-2 2H3"></path></svg>',
  repeatOne: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m17 2 4 4-4 4"></path><path d="M3 11V8a2 2 0 0 1 2-2h16"></path><path d="m7 22-4-4 4-4"></path><path d="M21 13v3a2 2 0 0 1-2 2H3"></path><path d="M12 9v6"></path></svg>',
  volumeHigh: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5z"></path><path d="M16 8.5a5 5 0 0 1 0 7"></path><path d="M19 5a9 9 0 0 1 0 14"></path></svg>',
  volumeMedium: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5z"></path><path d="M16 8.5a5 5 0 0 1 0 7"></path></svg>',
  volumeLow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5z"></path><path d="M15 10.5a2 2 0 0 1 0 3"></path></svg>',
  volumeMuted: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5z"></path><path d="m16 9 5 5"></path><path d="m21 9-5 5"></path></svg>',
  close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>'
};

const volumeSteps = [1, 0.7, 0.4, 0.15, 0];

const categoryDefinitions = [
  { id: "all", label: "All" },
  { id: "vocal", label: "Vocal Music", hasVocal: true },
  { id: "bgm", label: "BGM", hasVocal: false }
];

const preferredTrackIds = [
  "deno-citypop-001",
  "deno-citypop-002",
  "deno-citypop-003",
  "deno-krock-001",
  "deno-citypop-004",
  "deno-citypop-007",
  "deno-krock-002",
  "deno-citypop-005",
  "deno-citypop-006",
  "deno-bgm-001",
  "deno-bgm-002"
];

const preferredTrackRank = new Map(preferredTrackIds.map((id, index) => [id, index]));

function loadLocalTracks() {
  return new Promise((resolve) => {
    if (window.location.protocol !== "file:") {
      resolve(null);
      return;
    }

    const script = document.createElement("script");
    script.src = "tracks.local.js";
    script.onload = () => resolve(window.DENO_LOCAL_TRACKS);
    script.onerror = () => resolve(null);
    document.head.append(script);
  });
}

async function loadTracks() {
  if (window.location.protocol === "file:") {
    const localTracks = await loadLocalTracks();
    if (Array.isArray(localTracks) && localTracks.length > 0) {
      return localTracks;
    }
    return fallbackTracks;
  }

  try {
    const response = await fetch("tracks.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`tracks.json returned ${response.status}`);
    const tracks = await response.json();
    if (!Array.isArray(tracks) || tracks.length === 0) {
      throw new Error("tracks.json has no tracks");
    }
    return tracks;
  } catch (error) {
    console.warn("Using embedded fallback tracks:", error);
    return fallbackTracks;
  }
}

function uniqueValues(tracks, key) {
  return [...new Set(tracks.flatMap((track) => track[key] || []))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
}

function secondsFromDuration(duration) {
  if (!/^\d{2}:\d{2}$/.test(duration || "")) return 0;
  const [minutes, seconds] = duration.split(":").map(Number);
  return minutes * 60 + seconds;
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const rest = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${rest}`;
}

function isAvailableUrl(url) {
  const value = url || "";
  const remoteUrl = /^https?:\/\//.test(value) && !value.includes("example.com");
  const localFileUrl = window.location.protocol === "file:" && /^file:\/\//.test(value);
  return remoteUrl || localFileUrl;
}

function setIcon(button, iconName) {
  if (!button) return;
  button.innerHTML = icons[iconName] || "";
}

function readJson(key, fallback) {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.warn(`Could not read ${key}:`, error);
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Could not save ${key}:`, error);
  }
}

function loadStoredState() {
  const favorites = readJson(storageKeys.favorites, []);
  const settings = readJson(storageKeys.settings, {});
  state.favorites = new Set(Array.isArray(favorites) ? favorites : []);
  state.repeatMode = ["off", "all", "one"].includes(settings.repeatMode) ? settings.repeatMode : "off";
  state.volume = Number.isFinite(settings.volume) ? Math.min(Math.max(settings.volume, 0), 1) : 1;
}

function saveFavorites() {
  writeJson(storageKeys.favorites, [...state.favorites]);
}

function saveSettings() {
  writeJson(storageKeys.settings, { repeatMode: state.repeatMode, volume: state.volume });
}

function isFavorite(track) {
  return Boolean(track?.id && state.favorites.has(track.id));
}

function getDownloadUrl(track) {
  return track?.downloadUrl || track?.audioUrl || "#";
}

function getDownloadName(track) {
  return track?.downloadFileName || `DENO - ${track?.title || "Music"}`;
}

function getCoverUrl(track) {
  return track?.coverUrl || track?.artworkUrl || track?.thumbnailUrl || "";
}

function applyCoverArt(element, track) {
  if (!element) return;
  const coverUrl = getCoverUrl(track);
  element.classList.toggle("has-cover", Boolean(coverUrl));
  element.style.backgroundImage = coverUrl ? `url("${coverUrl.replace(/"/g, "%22")}")` : "";
}

function makeCoverElement(track, className) {
  const cover = document.createElement("span");
  cover.className = className;
  cover.setAttribute("aria-hidden", "true");
  applyCoverArt(cover, track);
  return cover;
}

function makeTrackMeta(track) {
  if (!track) return "DENO";
  return `${track.artist} / ${track.duration} / ${track.hasVocal ? "Vocals" : "Instrumental"}`;
}

function getActiveDuration() {
  return dom.audio.duration || secondsFromDuration(state.activeTrack?.duration);
}

function makeFilterChip(value, type) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "chip";
  button.dataset[type] = value;
  button.textContent = value;
  const filterSet = type === "mood" ? state.filters.moods : state.filters.genres;
  const selected = filterSet.has(value);
  button.classList.toggle("is-selected", selected);
  button.setAttribute("aria-pressed", String(selected));
  return button;
}

function getCategoryDefinition(id = state.filters.category) {
  return categoryDefinitions.find((category) => category.id === id) || categoryDefinitions[0];
}

function categoryMatches(track, categoryId = state.filters.category) {
  const category = getCategoryDefinition(categoryId);
  if (!Object.prototype.hasOwnProperty.call(category, "hasVocal")) return true;
  return Boolean(track.hasVocal) === category.hasVocal;
}

function categoryTracks(categoryId = state.filters.category) {
  return state.tracks.filter((track) => categoryMatches(track, categoryId));
}

function stableHash(value) {
  return [...String(value || "")].reduce((hash, char) => ((hash * 31) + char.charCodeAt(0)) >>> 0, 0);
}

function displayRank(track) {
  const preferredRank = preferredTrackRank.get(track.id);
  if (preferredRank !== undefined && track.hasVocal) return preferredRank;
  if (track.hasVocal) return 100 + (stableHash(track.id || track.title) % 300);
  if (preferredRank !== undefined) return 500 + preferredRank;
  return 1000 + (stableHash(track.id || track.title) % 700);
}

function sortTracksForDisplay(tracks) {
  return [...tracks].sort((left, right) => {
    const rankDelta = displayRank(left) - displayRank(right);
    if (rankDelta) return rankDelta;
    return left.title.localeCompare(right.title);
  });
}

function updateCategoryTabs() {
  if (!dom.categoryTabs) return;
  dom.categoryTabs.querySelectorAll("[data-category]").forEach((button) => {
    const categoryId = button.dataset.category;
    const selected = categoryId === state.filters.category;
    const countTarget = button.querySelector("[data-category-count]");
    const count = categoryTracks(categoryId).length;
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-selected", String(selected));
    if (countTarget) countTarget.textContent = String(count);
  });

  if (dom.selectedCategoryLabel) {
    dom.selectedCategoryLabel.textContent = getCategoryDefinition().label;
  }
}

function renderFilterChips() {
  const tracks = categoryTracks();
  dom.moodFilters.replaceChildren(...uniqueValues(tracks, "mood").map((mood) => makeFilterChip(mood, "mood")));
  dom.genreFilters.replaceChildren(...uniqueValues(tracks, "genre").map((genre) => makeFilterChip(genre, "genre")));
}

function pruneSetToAvailable(set, values) {
  const available = new Set(values);
  [...set].forEach((value) => {
    if (!available.has(value)) set.delete(value);
  });
}

function syncCategoryOptions() {
  const tracks = categoryTracks();
  pruneSetToAvailable(state.filters.moods, uniqueValues(tracks, "mood"));
  pruneSetToAvailable(state.filters.genres, uniqueValues(tracks, "genre"));

  if (state.filters.category !== "all") {
    state.filters.vocal = "all";
    syncSegmented(dom.vocalFilter, dom.vocalFilter.querySelector("[data-vocal='all']"));
  }

  if (dom.vocalFilterBlock) {
    dom.vocalFilterBlock.hidden = state.filters.category !== "all";
  }
}

function matchesFilters(track) {
  const searchText = [
    track.title,
    track.artist,
    ...(track.mood || []),
    ...(track.genre || [])
  ]
    .join(" ")
    .toLowerCase();
  const categoryMatch = categoryMatches(track);
  const searchMatch = !state.filters.search || searchText.includes(state.filters.search.toLowerCase());
  const moodMatch = state.filters.moods.size === 0 || [...state.filters.moods].every((mood) => track.mood?.includes(mood));
  const genreMatch = state.filters.genres.size === 0 || [...state.filters.genres].every((genre) => track.genre?.includes(genre));
  const vocalMatch =
    state.filters.vocal === "all" ||
    (state.filters.vocal === "vocal" && track.hasVocal) ||
    (state.filters.vocal === "instrumental" && !track.hasVocal);
  const favoriteMatch = !state.filters.favoritesOnly || isFavorite(track);

  return categoryMatch && searchMatch && moodMatch && genreMatch && vocalMatch && favoriteMatch;
}

function filterCount() {
  let count = state.filters.moods.size + state.filters.genres.size;
  if (state.filters.category !== "all") count += 1;
  if (state.filters.search) count += 1;
  if (state.filters.vocal !== "all") count += 1;
  if (state.filters.favoritesOnly) count += 1;
  return count;
}

function updateFilterSummary() {
  const visible = state.filteredTracks.length;
  dom.visibleCount.textContent = `${visible} ${visible === 1 ? "track" : "tracks"}`;
  const active = filterCount();
  if (state.filters.favoritesOnly) {
    dom.activeFilterCount.textContent = state.repeatMode === "all" ? "Favorites loop" : "Favorites queue";
    return;
  }
  dom.activeFilterCount.textContent = active ? `${active} active ${active === 1 ? "filter" : "filters"}` : "No filters";
}

function updateEmptyState() {
  if (!dom.emptyTitle || !dom.emptyHint) return;
  if (state.filters.favoritesOnly) {
    dom.emptyTitle.textContent = "No favorites yet";
    dom.emptyHint.textContent = "Tap hearts to build your loop.";
    return;
  }
  dom.emptyTitle.textContent = "No tracks found";
  dom.emptyHint.textContent = "Try fewer filters or a broader search.";
}

function makeTag(text, className = "tag") {
  const span = document.createElement("span");
  span.className = className;
  span.textContent = text;
  return span;
}

function primaryTags(track) {
  const tags = [...(track.mood || []), ...(track.genre || [])];
  const visible = tags.slice(0, 2);
  if (tags.length > 2) visible.push(`+${tags.length - 2}`);
  return visible;
}

function renderTrackRow(track) {
  const row = document.createElement("article");
  row.className = "track-row";
  row.tabIndex = 0;
  row.dataset.trackId = track.id;
  row.setAttribute("aria-label", `${track.title} by ${track.artist}`);

  const cover = makeCoverElement(track, "track-cover");
  const play = document.createElement("span");
  play.className = "track-play";
  play.setAttribute("aria-hidden", "true");
  cover.append(play);

  const info = document.createElement("div");
  info.className = "track-info";

  const titleLine = document.createElement("div");
  titleLine.className = "title-line";
  const title = document.createElement("strong");
  title.textContent = track.title;
  const meta = document.createElement("span");
  meta.textContent = makeTrackMeta(track);
  titleLine.append(title, meta);

  const preview = document.createElement("div");
  preview.className = "inline-preview";
  const previewDetails = [
    Number.isFinite(track.bpm) ? `${track.bpm} BPM` : "",
    ...(track.genre || [])
  ].filter(Boolean).join(" / ");
  preview.innerHTML = `
    <input class="inline-seek" type="range" min="0" max="1000" value="0" step="1" aria-label="Seek ${track.title}" disabled>
    <div class="inline-preview-meta">
      <span class="inline-time">0:00 / ${track.duration}</span>
      <span>${previewDetails}</span>
    </div>
  `;

  info.append(titleLine, preview);

  const tags = document.createElement("div");
  tags.className = "track-tags";
  primaryTags(track).forEach((tag) => tags.append(makeTag(tag)));

  const actions = document.createElement("div");
  actions.className = "track-actions";

  const favorite = document.createElement("button");
  favorite.type = "button";
  favorite.className = "icon-button favorite-button";
  favorite.dataset.favoriteId = track.id;
  favorite.setAttribute("aria-label", isFavorite(track) ? "Remove favorite" : "Save favorite");
  favorite.setAttribute("aria-pressed", String(isFavorite(track)));
  favorite.classList.toggle("is-active", isFavorite(track));
  favorite.innerHTML = icons.heart;

  const download = document.createElement("a");
  download.className = "download-button";
  download.textContent = "Download";
  const downloadUrl = getDownloadUrl(track);
  if (isAvailableUrl(downloadUrl)) {
    download.href = downloadUrl;
    download.target = "_blank";
    download.rel = "noreferrer";
    download.download = getDownloadName(track);
  } else {
    download.href = "#";
    download.classList.add("is-disabled");
    download.setAttribute("aria-disabled", "true");
  }

  actions.append(favorite, download);
  row.append(cover, info, tags, actions);
  row.addEventListener("click", (event) => {
    if (event.target.closest("a, button, input")) return;
    playTrack(track);
  });
  row.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      playTrack(track);
    }
  });
  return row;
}

function renderTracks() {
  state.filteredTracks = sortTracksForDisplay(state.tracks.filter(matchesFilters));
  const rows = state.filteredTracks.map(renderTrackRow);
  dom.trackList.replaceChildren(...rows);
  dom.emptyState.hidden = rows.length > 0;
  updateCategoryTabs();
  syncCategoryOptions();
  updateEmptyState();
  updateFilterSummary();
  syncTrackRows();
  syncPlayerUi();
}

async function playTrack(track, options = {}) {
  if (!isAvailableUrl(track.audioUrl)) {
    state.activeTrack = track;
    syncTrackRows();
    syncPlayerUi();
    return;
  }

  const sameTrack = state.activeTrack?.id === track.id;
  state.activeTrack = track;

  if (!sameTrack) {
    dom.audio.src = track.audioUrl;
    dom.audio.load();
  }

  try {
    if (sameTrack && !dom.audio.paused && !options.forcePlay) {
      dom.audio.pause();
    } else {
      await dom.audio.play();
    }
  } catch (error) {
    console.warn("Audio preview failed:", error);
  } finally {
    syncTrackRows();
    syncPlayerUi();
    updateMediaSession();
  }
}

async function playNextTrack() {
  if (!state.activeTrack) return;

  const currentIndex = state.filteredTracks.findIndex((track) => track.id === state.activeTrack.id);
  const nextTrack = state.filteredTracks[currentIndex + 1];

  if (state.repeatMode === "one" || (!nextTrack && state.filteredTracks.length === 1 && currentIndex === 0)) {
    await replayActiveTrack();
    return;
  }

  if (!nextTrack && state.repeatMode === "all" && state.filteredTracks.length > 0) {
    await playTrack(state.filteredTracks[0], { forcePlay: true });
    document.querySelector(`[data-track-id="${state.filteredTracks[0].id}"]`)?.scrollIntoView({
      block: "nearest",
      behavior: "smooth"
    });
    return;
  }

  if (!nextTrack) {
    dom.audio.pause();
    syncTrackRows();
    updateInlineProgress();
    syncPlayerUi();
    updateMediaSession();
    return;
  }

  await playTrack(nextTrack, { forcePlay: true });
  document.querySelector(`[data-track-id="${nextTrack.id}"]`)?.scrollIntoView({
    block: "nearest",
    behavior: "smooth"
  });
}

async function replayActiveTrack() {
  if (!state.activeTrack) return;
  dom.audio.currentTime = 0;
  try {
    await dom.audio.play();
  } catch (error) {
    console.warn("Repeat playback failed:", error);
  } finally {
    syncTrackRows();
    updateInlineProgress();
    syncPlayerUi();
    updateMediaSession();
  }
}

async function playPreviousTrack() {
  if (!state.activeTrack) return;

  const currentIndex = state.filteredTracks.findIndex((track) => track.id === state.activeTrack.id);
  const previousTrack = state.filteredTracks[currentIndex - 1];
  const wrappedTrack = state.repeatMode === "all" ? state.filteredTracks[state.filteredTracks.length - 1] : null;
  const target = previousTrack || wrappedTrack;

  if (target) {
    await playTrack(target, { forcePlay: true });
    document.querySelector(`[data-track-id="${target.id}"]`)?.scrollIntoView({
      block: "nearest",
      behavior: "smooth"
    });
  } else {
    await replayActiveTrack();
  }
}

function toggleFavorite(track = state.activeTrack) {
  if (!track?.id) return;
  if (state.favorites.has(track.id)) {
    state.favorites.delete(track.id);
  } else {
    state.favorites.add(track.id);
  }
  saveFavorites();
  renderTracks();
  syncFavoriteButtons();
}

function setFavoritesFilter(enabled) {
  state.filters.favoritesOnly = enabled;
  dom.favoriteFilter.classList.toggle("is-selected", enabled);
  dom.favoriteFilter.setAttribute("aria-pressed", String(enabled));
  dom.favoriteFilter.textContent = enabled ? "Favorites Loop" : "Favorites";
  if (enabled && state.repeatMode === "off") {
    state.repeatMode = "all";
    saveSettings();
  }
  renderTracks();
}

function cycleRepeatMode() {
  const next = {
    off: "all",
    all: "one",
    one: "off"
  };
  state.repeatMode = next[state.repeatMode] || "off";
  saveSettings();
  syncPlayerUi();
}

function volumeIconName() {
  if (state.volume <= 0) return "volumeMuted";
  if (state.volume <= 0.25) return "volumeLow";
  if (state.volume <= 0.75) return "volumeMedium";
  return "volumeHigh";
}

function volumeLabel() {
  return `Volume ${Math.round(state.volume * 100)} percent`;
}

function applyVolume() {
  dom.audio.volume = state.volume;
  dom.audio.muted = state.volume === 0;
}

function cycleVolume() {
  const currentIndex = volumeSteps.findIndex((step) => Math.abs(step - state.volume) < 0.01);
  const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % volumeSteps.length : 0;
  state.volume = volumeSteps[nextIndex];
  applyVolume();
  saveSettings();
  syncPlayerUi();
}

function syncTrackRows() {
  document.querySelectorAll(".track-row").forEach((row) => {
    const active = state.activeTrack?.id === row.dataset.trackId;
    row.classList.toggle("is-active", active);
    row.classList.toggle("is-playing", active && !dom.audio.paused);
  });
  syncFavoriteButtons();
  updateInlineProgress();
}

function updateInlineProgress() {
  const row = state.activeTrack ? document.querySelector(`[data-track-id="${state.activeTrack.id}"]`) : null;

  const duration = getActiveDuration();
  const current = dom.audio.currentTime || 0;
  const ratio = duration ? Math.min(current / duration, 1) : 0;

  if (row) {
    const fill = row.querySelector(".inline-progress span");
    const seek = row.querySelector(".inline-seek");
    const time = row.querySelector(".inline-time");

    if (fill) fill.style.width = `${Math.round(ratio * 100)}%`;
    if (seek) {
      seek.disabled = !isAvailableUrl(state.activeTrack.audioUrl);
      seek.value = String(Math.round(ratio * 1000));
    }
    if (time) time.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
  }

  updatePlayerProgress(current, duration, ratio);
}

function syncFavoriteButtons() {
  document.querySelectorAll("[data-favorite-id]").forEach((button) => {
    const active = state.favorites.has(button.dataset.favoriteId);
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
    button.setAttribute("aria-label", active ? "Remove favorite" : "Save favorite");
  });
}

function updatePlayerProgress(current = dom.audio.currentTime || 0, duration = getActiveDuration(), ratio) {
  const nextRatio = Number.isFinite(ratio) ? ratio : duration ? Math.min(current / duration, 1) : 0;
  [dom.dockSeek, dom.sheetSeek].forEach((seek) => {
    if (!seek) return;
    seek.disabled = !state.activeTrack || !isAvailableUrl(state.activeTrack.audioUrl);
    seek.value = String(Math.round(nextRatio * 1000));
  });
  if (dom.sheetCurrent) dom.sheetCurrent.textContent = formatTime(current);
  if (dom.sheetDuration) dom.sheetDuration.textContent = formatTime(duration);
}

function syncPlayerUi() {
  const track = state.activeTrack;
  const hasTrack = Boolean(track);
  const isPlaying = hasTrack && !dom.audio.paused;
  document.body.classList.toggle("has-player", hasTrack);
  dom.playerDock.hidden = !hasTrack;
  if (!hasTrack) {
    closePlayerSheet();
    return;
  }

  dom.dockTitle.textContent = track.title;
  dom.dockMeta.textContent = makeTrackMeta(track);
  dom.sheetTitle.textContent = track.title;
  dom.sheetMeta.textContent = makeTrackMeta(track);
  dom.sheetTags.replaceChildren(...primaryTags(track).map((tag) => makeTag(tag)));
  applyCoverArt(dom.dockArt, track);
  applyCoverArt(dom.sheetArt, track);

  setIcon(dom.dockPlay, isPlaying ? "pause" : "play");
  setIcon(dom.sheetPlay, isPlaying ? "pause" : "play");
  setIcon(dom.dockPrev, "prev");
  setIcon(dom.dockNext, "next");
  setIcon(dom.dockRepeat, state.repeatMode === "one" ? "repeatOne" : "repeat");
  setIcon(dom.dockVolume, volumeIconName());
  setIcon(dom.sheetNext, "next");
  setIcon(dom.sheetPrev, "prev");
  setIcon(dom.sheetVolume, volumeIconName());
  setIcon(dom.dockFavorite, "heart");
  setIcon(dom.sheetFavorite, "heart");
  setIcon(dom.sheetClose, "close");
  setIcon(dom.sheetRepeat, state.repeatMode === "one" ? "repeatOne" : "repeat");

  const favorite = isFavorite(track);
  [dom.dockFavorite, dom.sheetFavorite].forEach((button) => {
    button.classList.toggle("is-active", favorite);
    button.setAttribute("aria-pressed", String(favorite));
    button.setAttribute("aria-label", favorite ? "Remove favorite" : "Save favorite");
  });

  const repeatLabels = {
    off: "Repeat off",
    all: "Repeat queue",
    one: "Repeat one"
  };
  [dom.dockRepeat, dom.sheetRepeat].forEach((button) => {
    button.classList.toggle("is-active", state.repeatMode !== "off");
    button.setAttribute("aria-label", repeatLabels[state.repeatMode] || repeatLabels.off);
    button.setAttribute("aria-pressed", String(state.repeatMode !== "off"));
  });

  [dom.dockVolume, dom.sheetVolume].forEach((button) => {
    button.classList.toggle("is-active", state.volume < 1);
    button.setAttribute("aria-label", volumeLabel());
    button.setAttribute("aria-pressed", String(state.volume === 0));
    button.title = volumeLabel();
  });

  const downloadUrl = getDownloadUrl(track);
  if (isAvailableUrl(downloadUrl)) {
    dom.sheetDownload.href = downloadUrl;
    dom.sheetDownload.download = getDownloadName(track);
    dom.sheetDownload.classList.remove("is-disabled");
    dom.sheetDownload.removeAttribute("aria-disabled");
  } else {
    dom.sheetDownload.href = "#";
    dom.sheetDownload.classList.add("is-disabled");
    dom.sheetDownload.setAttribute("aria-disabled", "true");
  }

  dom.dockPlay.setAttribute("aria-label", isPlaying ? "Pause" : "Play");
  dom.sheetPlay.setAttribute("aria-label", isPlaying ? "Pause" : "Play");
  updateInlineProgress();
}

function openPlayerSheet() {
  if (!state.activeTrack) return;
  state.sheetOpen = true;
  dom.playerBackdrop.hidden = false;
  dom.playerSheet.hidden = false;
}

function closePlayerSheet() {
  state.sheetOpen = false;
  dom.playerBackdrop.hidden = true;
  dom.playerSheet.hidden = true;
}

function seekFromControl(control) {
  if (!state.activeTrack || !dom.audio.duration) return;
  dom.audio.currentTime = (Number(control.value) / 1000) * dom.audio.duration;
  updateInlineProgress();
}

function updateMediaSession() {
  if (!("mediaSession" in navigator) || !("MediaMetadata" in window) || !state.activeTrack) return;

  const artwork = state.activeTrack.artworkUrl
    ? [{ src: state.activeTrack.artworkUrl, sizes: "512x512", type: "image/png" }]
    : [];

  navigator.mediaSession.metadata = new MediaMetadata({
    title: state.activeTrack.title,
    artist: state.activeTrack.artist || "DENO",
    album: "DENO Music Library",
    artwork
  });
  navigator.mediaSession.playbackState = dom.audio.paused ? "paused" : "playing";
}

function bindMediaSessionActions() {
  if (!("mediaSession" in navigator)) return;
  const handlers = {
    play: () => state.activeTrack && playTrack(state.activeTrack, { forcePlay: true }),
    pause: () => dom.audio.pause(),
    previoustrack: playPreviousTrack,
    nexttrack: playNextTrack,
    seekto: (details) => {
      if (Number.isFinite(details.seekTime)) {
        dom.audio.currentTime = details.seekTime;
        updateInlineProgress();
      }
    }
  };

  Object.entries(handlers).forEach(([action, handler]) => {
    try {
      navigator.mediaSession.setActionHandler(action, handler);
    } catch (error) {
      console.warn(`Media Session action unsupported: ${action}`, error);
    }
  });
}

function bindEvents() {
  dom.categoryTabs?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    state.filters.category = button.dataset.category;
    syncCategoryOptions();
    renderFilterChips();
    renderTracks();
  });

  dom.searchInput.addEventListener("input", () => {
    state.filters.search = dom.searchInput.value.trim();
    renderTracks();
  });

  dom.moodFilters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-mood]");
    if (!button) return;
    toggleSetFilter(state.filters.moods, button.dataset.mood, button);
    renderTracks();
  });

  dom.genreFilters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-genre]");
    if (!button) return;
    toggleSetFilter(state.filters.genres, button.dataset.genre, button);
    renderTracks();
  });

  dom.vocalFilter.addEventListener("click", (event) => {
    const button = event.target.closest("[data-vocal]");
    if (!button) return;
    state.filters.vocal = button.dataset.vocal;
    syncSegmented(dom.vocalFilter, button);
    renderTracks();
  });

  dom.favoriteFilter.addEventListener("click", () => {
    setFavoritesFilter(!state.filters.favoritesOnly);
  });

  dom.resetFilters.addEventListener("click", resetFilters);

  dom.trackList.addEventListener("input", (event) => {
    const seek = event.target.closest(".inline-seek");
    if (!seek || !state.activeTrack || !dom.audio.duration) return;
    dom.audio.currentTime = (Number(seek.value) / 1000) * dom.audio.duration;
    updateInlineProgress();
  });

  dom.trackList.addEventListener("pointerdown", (event) => {
    if (event.target.closest(".inline-seek")) {
      event.stopPropagation();
    }
  });

  dom.trackList.addEventListener("click", (event) => {
    const favoriteButton = event.target.closest("[data-favorite-id]");
    if (!favoriteButton) return;
    event.preventDefault();
    event.stopPropagation();
    const track = state.tracks.find((item) => item.id === favoriteButton.dataset.favoriteId);
    toggleFavorite(track);
  });

  dom.dockOpen.addEventListener("click", openPlayerSheet);
  dom.playerBackdrop.addEventListener("click", closePlayerSheet);
  dom.sheetClose.addEventListener("click", closePlayerSheet);
  dom.dockPlay.addEventListener("click", () => state.activeTrack && playTrack(state.activeTrack));
  dom.sheetPlay.addEventListener("click", () => state.activeTrack && playTrack(state.activeTrack));
  dom.dockPrev.addEventListener("click", playPreviousTrack);
  dom.dockNext.addEventListener("click", playNextTrack);
  dom.dockRepeat.addEventListener("click", cycleRepeatMode);
  dom.dockVolume.addEventListener("click", cycleVolume);
  dom.sheetNext.addEventListener("click", playNextTrack);
  dom.sheetPrev.addEventListener("click", playPreviousTrack);
  dom.dockFavorite.addEventListener("click", () => toggleFavorite());
  dom.sheetFavorite.addEventListener("click", () => toggleFavorite());
  dom.sheetRepeat.addEventListener("click", cycleRepeatMode);
  dom.sheetVolume.addEventListener("click", cycleVolume);
  dom.dockSeek.addEventListener("input", () => seekFromControl(dom.dockSeek));
  dom.sheetSeek.addEventListener("input", () => seekFromControl(dom.sheetSeek));
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && state.sheetOpen) closePlayerSheet();
  });

  dom.audio.addEventListener("play", () => {
    syncTrackRows();
    syncPlayerUi();
    updateMediaSession();
  });
  dom.audio.addEventListener("pause", () => {
    syncTrackRows();
    syncPlayerUi();
    updateMediaSession();
  });
  dom.audio.addEventListener("timeupdate", updateInlineProgress);
  dom.audio.addEventListener("loadedmetadata", () => {
    updateInlineProgress();
    syncPlayerUi();
    updateMediaSession();
  });
  dom.audio.addEventListener("ended", playNextTrack);
}

function toggleSetFilter(set, value, button) {
  if (set.has(value)) {
    set.delete(value);
    button.classList.remove("is-selected");
    button.setAttribute("aria-pressed", "false");
  } else {
    set.add(value);
    button.classList.add("is-selected");
    button.setAttribute("aria-pressed", "true");
  }
}

function syncSegmented(group, selectedButton) {
  group.querySelectorAll("button").forEach((button) => {
    const selected = button === selectedButton;
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
}

function resetFilters() {
  state.filters.category = "all";
  state.filters.search = "";
  state.filters.moods.clear();
  state.filters.genres.clear();
  state.filters.vocal = "all";
  state.filters.favoritesOnly = false;
  dom.searchInput.value = "";
  renderFilterChips();
  document.querySelectorAll(".chip.is-selected").forEach((chip) => {
    chip.classList.remove("is-selected");
    chip.setAttribute("aria-pressed", "false");
  });
  syncSegmented(dom.vocalFilter, dom.vocalFilter.querySelector("[data-vocal='all']"));
  dom.favoriteFilter.classList.remove("is-selected");
  dom.favoriteFilter.setAttribute("aria-pressed", "false");
  dom.favoriteFilter.textContent = "Favorites";
  renderTracks();
}

function startSignalCanvas() {
  const canvas = dom.signalCanvas;
  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let raf = 0;
  let tick = 0;

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function draw() {
    tick += 0.006;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgba(4, 6, 4, 0.62)";
    ctx.fillRect(0, 0, width, height);

    for (let y = 0; y < height; y += 18) {
      const wave = Math.sin(y * 0.018 + tick * 8);
      const alpha = 0.06 + Math.max(0, wave) * 0.05;
      ctx.fillStyle = `rgba(138, 255, 154, ${alpha})`;
      const x = width * 0.18 + wave * 34 + Math.cos(tick + y * 0.006) * 20;
      ctx.fillRect(x, y, width * 0.58, 1);
    }

    ctx.fillStyle = "rgba(255, 111, 174, 0.06)";
    for (let x = 0; x < width; x += 72) {
      const top = (Math.sin(tick * 4 + x * 0.01) + 1) * 0.5 * height;
      ctx.fillRect(x, top, 1, 64);
    }

    raf = window.requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener("resize", resize);
  return () => window.cancelAnimationFrame(raf);
}

async function init() {
  loadStoredState();
  state.tracks = await loadTracks();
  setIcon(dom.dockPlay, "play");
  setIcon(dom.dockPrev, "prev");
  setIcon(dom.dockNext, "next");
  setIcon(dom.dockRepeat, "repeat");
  setIcon(dom.dockVolume, volumeIconName());
  setIcon(dom.dockFavorite, "heart");
  setIcon(dom.sheetClose, "close");
  setIcon(dom.sheetRepeat, "repeat");
  setIcon(dom.sheetPrev, "prev");
  setIcon(dom.sheetPlay, "play");
  setIcon(dom.sheetNext, "next");
  setIcon(dom.sheetVolume, volumeIconName());
  setIcon(dom.sheetFavorite, "heart");
  applyVolume();
  renderFilterChips();
  bindEvents();
  bindMediaSessionActions();
  renderTracks();
  startSignalCanvas();
}

init();
