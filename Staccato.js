const API_BASE = window.STACCATO_API_BASE || (window.location.protocol === "file:" ? "http://localhost:3000" : "");

const featuredTracks = [
  {
    title: "Dancing With Your Ghost",
    artist: "Sasha Alex Sloan",
    duration: "3:18",
    thumbnail: "Images/song1.jpg",
    query: "Dancing With Your Ghost Sasha Alex Sloan"
  },
  {
    title: "Calm Down",
    artist: "Rema, Selena Gomez",
    duration: "3:59",
    thumbnail: "Images/song2.jpg",
    query: "Calm Down Rema Selena Gomez"
  },
  {
    title: "The Night We Met",
    artist: "Lord Huron",
    duration: "3:28",
    thumbnail: "Images/song3.jpg",
    query: "The Night We Met Lord Huron"
  },
  {
    title: "Golden Hour",
    artist: "JVKE",
    duration: "3:29",
    thumbnail: "Images/song4.jpg",
    query: "Golden Hour JVKE"
  },
  {
    title: "Chaleya",
    artist: "Arijit Singh, Shilpa Rao",
    duration: "3:20",
    thumbnail: "Images/song5.jpg",
    query: "Chaleya Arijit Singh Shilpa Rao"
  },
  {
    title: "Cruel Summer",
    artist: "Taylor Swift",
    duration: "2:58",
    thumbnail: "Images/song6.jpg",
    query: "Cruel Summer Taylor Swift"
  },
  {
    title: "Apna Bana Le",
    artist: "Arijit Singh",
    duration: "4:21",
    thumbnail: "Images/song7.jpg",
    query: "Apna Bana Le Arijit Singh"
  },
  {
    title: "Night Changes",
    artist: "One Direction",
    duration: "3:47",
    thumbnail: "Images/song8.jpg",
    query: "Night Changes One Direction"
  }
];

const artists = [
  { name: "Taylor Swift", query: "Taylor Swift greatest hits" },
  { name: "Arijit Singh", query: "Arijit Singh romantic songs" },
  { name: "BLACKPINK", query: "BLACKPINK top songs" },
  { name: "KK", query: "KK Hindi songs" },
  { name: "One Direction", query: "One Direction hits" }
];

const state = {
  queue: [...featuredTracks],
  currentIndex: -1,
  currentTrack: null,
  isSeeking: false,
  searchAbort: null
};

const els = {
  audio: document.getElementById("audioPlayer"),
  featuredGrid: document.getElementById("featuredGrid"),
  artistStrip: document.getElementById("artistStrip"),
  searchForm: document.getElementById("searchForm"),
  searchInput: document.getElementById("searchInput"),
  searchPanel: document.getElementById("searchPanel"),
  playerArt: document.getElementById("playerArt"),
  playerTitle: document.getElementById("playerTitle"),
  playerArtist: document.getElementById("playerArtist"),
  playPauseButton: document.getElementById("playPauseButton"),
  playPauseIcon: document.getElementById("playPauseIcon"),
  previousButton: document.getElementById("previousButton"),
  nextButton: document.getElementById("nextButton"),
  progressBar: document.getElementById("progressBar"),
  currentTime: document.getElementById("currentTime"),
  durationTime: document.getElementById("durationTime"),
  volumeControl: document.getElementById("volumeControl"),
  loadingPill: document.getElementById("loadingPill"),
  toast: document.getElementById("toast"),
  heroNowCard: document.getElementById("heroNowCard"),
  focusSearchButton: document.getElementById("focusSearchButton")
};

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const wholeSeconds = Math.floor(seconds);
  const mins = Math.floor(wholeSeconds / 60);
  const secs = wholeSeconds % 60;

  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("is-visible");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => els.toast.classList.remove("is-visible"), 3600);
}

function setLoading(isLoading) {
  els.loadingPill.classList.toggle("is-visible", isLoading);
}

function getFallbackArt(track) {
  return track.thumbnail || "Images/null.png";
}

function normalizeTrack(track) {
  return {
    id: track.id || "",
    title: track.title || "Untitled track",
    artist: track.artist || "YouTube",
    duration: track.duration || "",
    thumbnail: getFallbackArt(track),
    query: track.query || `${track.title || ""} ${track.artist || ""}`.trim()
  };
}

function renderFeaturedTracks() {
  els.featuredGrid.innerHTML = featuredTracks.map((track, index) => `
    <button class="song-card" type="button" data-featured-index="${index}">
      <img src="${track.thumbnail}" alt="">
      <div>
        <strong>${track.title}</strong>
        <span>${track.artist}</span>
      </div>
      <div class="card-footer">
        <span>${track.duration}</span>
        <span class="mini-play">&gt;</span>
      </div>
    </button>
  `).join("");
}

function renderArtists() {
  els.artistStrip.innerHTML = artists.map((artist) => `
    <button class="artist-card" type="button" data-query="${artist.query}">
      <span>Start radio</span>
      <strong>${artist.name}</strong>
    </button>
  `).join("");
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Request failed.");
  }

  return data;
}

async function searchTracks(query, signal) {
  const data = await fetchJson(`${API_BASE}/api/search?q=${encodeURIComponent(query)}`, { signal });
  return data.map(normalizeTrack);
}

async function resolveTrackFromQuery(query) {
  setLoading(true);

  try {
    const results = await searchTracks(query);
    if (!results.length) {
      throw new Error("No results found for that track.");
    }

    state.queue = results;
    state.currentIndex = 0;
    await playTrack(results[0], 0);
  } finally {
    setLoading(false);
  }
}

async function playTrack(track, queueIndex = -1) {
  const nextTrack = normalizeTrack(track);

  if (!nextTrack.id) {
    await resolveTrackFromQuery(nextTrack.query || nextTrack.title);
    return;
  }

  setLoading(true);

  try {
    const { streamUrl } = await fetchJson(`${API_BASE}/api/stream/${nextTrack.id}`);
    state.currentTrack = nextTrack;
    state.currentIndex = queueIndex;

    els.audio.src = streamUrl;
    els.audio.volume = Number(els.volumeControl.value);
    updatePlayerMeta(nextTrack);
    await els.audio.play();
    updatePlayButton();
  } catch (error) {
    showToast(error.message || "Could not play this track.");
  } finally {
    setLoading(false);
  }
}

function updatePlayerMeta(track) {
  els.playerTitle.textContent = track.title;
  els.playerArtist.textContent = track.artist;
  els.playerArt.src = getFallbackArt(track);
  els.heroNowCard.querySelector(".now-art").src = getFallbackArt(track);
  els.heroNowCard.querySelector("h2").textContent = track.title;
  els.heroNowCard.querySelector("span").textContent = track.artist;
}

function updatePlayButton() {
  const isPlaying = !els.audio.paused;
  els.playPauseButton.setAttribute("aria-label", isPlaying ? "Pause" : "Play");
  els.playPauseIcon.textContent = isPlaying ? "||" : ">";
}

function renderSearchPanel(results, statusText = "") {
  els.searchPanel.classList.add("is-open");

  if (statusText) {
    els.searchPanel.innerHTML = `<div class="empty-state">${statusText}</div>`;
    return;
  }

  if (!results.length) {
    els.searchPanel.innerHTML = `<div class="empty-state">No tracks found.</div>`;
    return;
  }

  els.searchPanel.innerHTML = results.map((track, index) => `
    <button class="search-result" type="button" data-result-index="${index}">
      <img src="${getFallbackArt(track)}" alt="">
      <span>
        <strong>${track.title}</strong>
        <span>${track.artist}</span>
      </span>
      <span>${track.duration || "Live"}</span>
    </button>
  `).join("");

  els.searchPanel._results = results;
}

function closeSearchPanel() {
  els.searchPanel.classList.remove("is-open");
}

function playQueueOffset(offset) {
  if (!state.queue.length) {
    return;
  }

  const fallbackIndex = state.currentIndex === -1 ? 0 : state.currentIndex;
  const nextIndex = (fallbackIndex + offset + state.queue.length) % state.queue.length;
  playTrack(state.queue[nextIndex], nextIndex);
}

function bindEvents() {
  els.featuredGrid.addEventListener("click", (event) => {
    const card = event.target.closest("[data-featured-index]");
    if (!card) return;

    const index = Number(card.dataset.featuredIndex);
    state.queue = [...featuredTracks];
    state.currentIndex = index;
    playTrack(featuredTracks[index], index).catch((error) => showToast(error.message));
  });

  document.querySelectorAll(".ghost-action[data-query], .text-action[data-query], .artist-card[data-query]").forEach((button) => {
    button.addEventListener("click", () => {
      resolveTrackFromQuery(button.dataset.query).catch((error) => showToast(error.message));
    });
  });

  els.focusSearchButton.addEventListener("click", () => {
    els.searchInput.focus();
  });

  els.searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = els.searchInput.value.trim();

    if (!query) {
      els.searchInput.focus();
      return;
    }

    renderSearchPanel([], "Searching...");
    searchTracks(query)
      .then((results) => {
        state.queue = results;
        renderSearchPanel(results);
      })
      .catch((error) => {
        renderSearchPanel([], error.message || "Search failed.");
      });
  });

  els.searchInput.addEventListener("input", () => {
    const query = els.searchInput.value.trim();

    if (state.searchAbort) {
      state.searchAbort.abort();
    }

    if (query.length < 2) {
      closeSearchPanel();
      return;
    }

    state.searchAbort = new AbortController();
    renderSearchPanel([], "Searching...");

    window.clearTimeout(els.searchInput._timer);
    els.searchInput._timer = window.setTimeout(() => {
      searchTracks(query, state.searchAbort.signal)
        .then((results) => {
          state.queue = results;
          renderSearchPanel(results);
        })
        .catch((error) => {
          if (error.name !== "AbortError") {
            renderSearchPanel([], error.message || "Search failed.");
          }
        });
    }, 350);
  });

  els.searchPanel.addEventListener("click", (event) => {
    const item = event.target.closest("[data-result-index]");
    if (!item) return;

    const index = Number(item.dataset.resultIndex);
    const track = els.searchPanel._results[index];

    state.queue = els.searchPanel._results;
    closeSearchPanel();
    playTrack(track, index);
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".search-wrap")) {
      closeSearchPanel();
    }
  });

  els.playPauseButton.addEventListener("click", () => {
    if (!els.audio.src) {
      resolveTrackFromQuery("Taylor Swift Cruel Summer").catch((error) => showToast(error.message));
      return;
    }

    if (els.audio.paused) {
      els.audio.play().catch((error) => showToast(error.message));
    } else {
      els.audio.pause();
    }
  });

  els.previousButton.addEventListener("click", () => playQueueOffset(-1));
  els.nextButton.addEventListener("click", () => playQueueOffset(1));

  els.audio.addEventListener("play", updatePlayButton);
  els.audio.addEventListener("pause", updatePlayButton);
  els.audio.addEventListener("ended", () => playQueueOffset(1));
  els.audio.addEventListener("loadedmetadata", () => {
    els.durationTime.textContent = formatTime(els.audio.duration);
  });
  els.audio.addEventListener("timeupdate", () => {
    if (!state.isSeeking && Number.isFinite(els.audio.duration)) {
      els.progressBar.value = (els.audio.currentTime / els.audio.duration) * 100 || 0;
    }

    els.currentTime.textContent = formatTime(els.audio.currentTime);
  });

  els.progressBar.addEventListener("pointerdown", () => {
    state.isSeeking = true;
  });

  els.progressBar.addEventListener("input", () => {
    if (Number.isFinite(els.audio.duration)) {
      els.currentTime.textContent = formatTime((els.audio.duration * Number(els.progressBar.value)) / 100);
    }
  });

  els.progressBar.addEventListener("change", () => {
    if (Number.isFinite(els.audio.duration)) {
      els.audio.currentTime = (els.audio.duration * Number(els.progressBar.value)) / 100;
    }

    state.isSeeking = false;
  });

  els.volumeControl.addEventListener("input", () => {
    els.audio.volume = Number(els.volumeControl.value);
  });

  window.addEventListener("keydown", (event) => {
    if (event.code !== "Space" || event.target.matches("input")) {
      return;
    }

    event.preventDefault();
    els.playPauseButton.click();
  });
}

renderFeaturedTracks();
renderArtists();
bindEvents();
updatePlayButton();
