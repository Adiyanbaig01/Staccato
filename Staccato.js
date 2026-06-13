const API_BASE = window.STACCATO_API_BASE || (window.location.protocol === "file:" ? "http://localhost:3000" : "");

const homeSections = [
  { title: "Trending Hindi 2025", query: "trending hindi 2025" },
  { title: "Top English Hits", query: "top english hits" },
  { title: "Arijit Singh", query: "arijit singh" },
  { title: "Lo-fi Beats", query: "lo-fi beats" },
  { title: "The Weeknd Essentials", query: "weeknd best songs" },
  { title: "Bollywood 2025", query: "bollywood 2025" }
];

const state = {
  queue: [],
  currentIndex: -1,
  isSeeking: false,
  isLoadingStream: false,
  searchAbort: null,
  searchTimer: null
};

const els = {
  audio: document.getElementById("audioPlayer"),
  homeFeed: document.getElementById("homeFeed"),
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
  volumeControl: document.getElementById("volumeControl")
};

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const wholeSeconds = Math.floor(seconds);
  const minutes = Math.floor(wholeSeconds / 60);
  const secs = wholeSeconds % 60;
  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

function getFallbackArt(track) {
  if (track.thumbnail) {
    return track.thumbnail;
  }

  return track.id ? `https://i.ytimg.com/vi/${track.id}/hqdefault.jpg` : "Images/null.png";
}

function normalizeTrack(track) {
  return {
    id: track.id || "",
    title: track.title || "Untitled track",
    artist: track.artist || "Unknown artist",
    duration: track.duration || "",
    thumbnail: getFallbackArt(track)
  };
}

function setStreamLoading(isLoading) {
  state.isLoadingStream = isLoading;
  els.playPauseButton.classList.toggle("is-loading", isLoading);
  els.playPauseButton.disabled = isLoading;
}

function updatePlayButton() {
  if (state.isLoadingStream) {
    return;
  }

  const isPlaying = !els.audio.paused;
  els.playPauseButton.setAttribute("aria-label", isPlaying ? "Pause" : "Play");
  els.playPauseIcon.textContent = isPlaying ? "||" : ">";
}

function updatePlayerMeta(track) {
  els.playerArt.src = getFallbackArt(track);
  els.playerTitle.textContent = track.title;
  els.playerArtist.textContent = track.artist;
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
  const results = await fetchJson(`${API_BASE}/api/search?q=${encodeURIComponent(query)}`, { signal });
  return results.map(normalizeTrack).filter((track) => track.id);
}

async function playTrack(track, queue, index) {
  const selectedTrack = normalizeTrack(track);

  if (!selectedTrack.id) {
    alert("Could not load track");
    return;
  }

  setStreamLoading(true);

  try {
    const { streamUrl } = await fetchJson(`${API_BASE}/api/stream/${encodeURIComponent(selectedTrack.id)}`);

    if (!streamUrl) {
      throw new Error("Missing stream URL");
    }

    state.queue = Array.isArray(queue) ? queue : [selectedTrack];
    state.currentIndex = Number.isInteger(index) ? index : 0;

    els.audio.src = streamUrl;
    els.audio.volume = Number(els.volumeControl.value);
    updatePlayerMeta(selectedTrack);
    await els.audio.play();
    updatePlayButton();
  } catch (error) {
    console.error(error);
    alert("Could not load track");
  } finally {
    setStreamLoading(false);
    updatePlayButton();
  }
}

function renderCard(track, sectionIndex, trackIndex) {
  return `
    <button class="song-card" type="button" data-section-index="${sectionIndex}" data-track-index="${trackIndex}">
      <div class="card-art-wrap">
        <img src="${escapeHtml(getFallbackArt(track))}" alt="">
        <span class="card-play">&gt;</span>
      </div>
      <div class="card-copy">
        <strong>${escapeHtml(track.title)}</strong>
        <span>${escapeHtml(track.artist)}</span>
      </div>
    </button>
  `;
}

function renderHomeShell() {
  els.homeFeed.innerHTML = homeSections.map((section, sectionIndex) => `
    <section class="feed-section" data-section-index="${sectionIndex}">
      <h2>${escapeHtml(section.title)}</h2>
      <div class="song-row">
        <div class="row-message">Loading...</div>
      </div>
    </section>
  `).join("");
}

function renderHomeSection(sectionIndex, tracks) {
  const sectionEl = els.homeFeed.querySelector(`[data-section-index="${sectionIndex}"]`);
  if (!sectionEl) {
    return;
  }

  const rowEl = sectionEl.querySelector(".song-row");

  if (!tracks.length) {
    rowEl.innerHTML = `<div class="row-message">No songs found.</div>`;
    return;
  }

  rowEl.innerHTML = tracks.map((track, trackIndex) => renderCard(track, sectionIndex, trackIndex)).join("");
}

async function loadHomeFeed() {
  renderHomeShell();

  await Promise.all(homeSections.map(async (section, sectionIndex) => {
    try {
      const tracks = await searchTracks(section.query);
      section.tracks = tracks;
      renderHomeSection(sectionIndex, tracks);
    } catch (error) {
      console.error(error);
      section.tracks = [];
      const sectionEl = els.homeFeed.querySelector(`[data-section-index="${sectionIndex}"] .song-row`);
      if (sectionEl) {
        sectionEl.innerHTML = `<div class="row-message">Could not load songs.</div>`;
      }
    }
  }));
}

function renderSearchPanel(results, statusText = "") {
  els.searchPanel.classList.add("is-open");

  if (statusText) {
    els.searchPanel.innerHTML = `<div class="row-message">${escapeHtml(statusText)}</div>`;
    els.searchPanel._results = [];
    return;
  }

  if (!results.length) {
    els.searchPanel.innerHTML = `<div class="row-message">No songs found.</div>`;
    els.searchPanel._results = [];
    return;
  }

  els.searchPanel._results = results;
  els.searchPanel.innerHTML = results.map((track, index) => `
    <button class="search-result" type="button" data-result-index="${index}">
      <img src="${escapeHtml(getFallbackArt(track))}" alt="">
      <span class="result-copy">
        <strong>${escapeHtml(track.title)}</strong>
        <span>${escapeHtml(track.artist)}</span>
      </span>
      <span class="result-duration">${escapeHtml(track.duration || "0:00")}</span>
    </button>
  `).join("");
}

function closeSearchPanel() {
  els.searchPanel.classList.remove("is-open");
}

function queueOffset(offset) {
  if (!state.queue.length || state.isLoadingStream) {
    return;
  }

  const baseIndex = state.currentIndex === -1 ? 0 : state.currentIndex;
  const nextIndex = (baseIndex + offset + state.queue.length) % state.queue.length;
  playTrack(state.queue[nextIndex], state.queue, nextIndex);
}

function bindEvents() {
  els.homeFeed.addEventListener("click", (event) => {
    const card = event.target.closest(".song-card");
    if (!card) {
      return;
    }

    const sectionIndex = Number(card.dataset.sectionIndex);
    const trackIndex = Number(card.dataset.trackIndex);
    const queue = homeSections[sectionIndex]?.tracks || [];
    const track = queue[trackIndex];

    if (track) {
      playTrack(track, queue, trackIndex);
    }
  });

  els.searchInput.addEventListener("input", () => {
    const query = els.searchInput.value.trim();

    window.clearTimeout(state.searchTimer);

    if (state.searchAbort) {
      state.searchAbort.abort();
    }

    if (query.length < 2) {
      closeSearchPanel();
      return;
    }

    renderSearchPanel([], "Searching...");
    state.searchAbort = new AbortController();

    state.searchTimer = window.setTimeout(() => {
      searchTracks(query, state.searchAbort.signal)
        .then((results) => renderSearchPanel(results))
        .catch((error) => {
          if (error.name !== "AbortError") {
            console.error(error);
            renderSearchPanel([], "Could not search right now.");
          }
        });
    }, 500);
  });

  els.searchPanel.addEventListener("click", (event) => {
    const result = event.target.closest(".search-result");
    if (!result) {
      return;
    }

    const index = Number(result.dataset.resultIndex);
    const queue = els.searchPanel._results || [];
    const track = queue[index];

    if (track) {
      closeSearchPanel();
      playTrack(track, queue, index);
    }
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".search-wrap")) {
      closeSearchPanel();
    }
  });

  els.playPauseButton.addEventListener("click", () => {
    if (state.isLoadingStream) {
      return;
    }

    if (!els.audio.src) {
      const firstSection = homeSections.find((section) => section.tracks?.length);
      if (firstSection) {
        playTrack(firstSection.tracks[0], firstSection.tracks, 0);
      }
      return;
    }

    if (els.audio.paused) {
      els.audio.play().catch((error) => {
        console.error(error);
        alert("Could not load track");
      });
    } else {
      els.audio.pause();
    }
  });

  els.previousButton.addEventListener("click", () => queueOffset(-1));
  els.nextButton.addEventListener("click", () => queueOffset(1));

  els.audio.addEventListener("play", updatePlayButton);
  els.audio.addEventListener("pause", updatePlayButton);
  els.audio.addEventListener("ended", () => queueOffset(1));
  els.audio.addEventListener("loadedmetadata", () => {
    els.durationTime.textContent = formatTime(els.audio.duration);
  });
  els.audio.addEventListener("timeupdate", () => {
    if (!state.isSeeking && Number.isFinite(els.audio.duration)) {
      els.progressBar.value = (els.audio.currentTime / els.audio.duration) * 100 || 0;
    }

    els.currentTime.textContent = formatTime(els.audio.currentTime);
  });
  els.audio.addEventListener("error", () => {
    if (els.audio.src) {
      alert("Could not load track");
    }
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

bindEvents();
updatePlayButton();
loadHomeFeed();
