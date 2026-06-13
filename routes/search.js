const { exec } = require("child_process");
const express = require("express");

const router = express.Router();

const YT_DLP_BIN = process.env.YT_DLP_PATH || "yt-dlp";

function shellQuote(value) {
  return `"${String(value).replace(/(["\\$`])/g, "\\$1")}"`;
}

function formatDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return "";
  }

  const wholeSeconds = Math.floor(seconds);
  const hrs = Math.floor(wholeSeconds / 3600);
  const mins = Math.floor((wholeSeconds % 3600) / 60);
  const secs = wholeSeconds % 60;

  if (hrs > 0) {
    return `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function pickThumbnail(video) {
  if (video.thumbnail) {
    return video.thumbnail;
  }

  if (Array.isArray(video.thumbnails) && video.thumbnails.length > 0) {
    return video.thumbnails[video.thumbnails.length - 1].url || "";
  }

  return video.id ? `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg` : "";
}

function normalizeVideo(video) {
  return {
    id: video.id,
    title: video.title || "Untitled track",
    artist: video.uploader || video.channel || video.creator || "YouTube",
    duration: formatDuration(video.duration),
    thumbnail: pickThumbnail(video)
  };
}

router.get("/", (req, res, next) => {
  const query = String(req.query.q || "").trim();

  if (!query) {
    return res.status(400).json({ error: "Search query is required." });
  }

  const command = [
    shellQuote(YT_DLP_BIN),
    shellQuote(`ytsearch5:${query}`),
    "--dump-json",
    "--flat-playlist",
    "--no-warnings"
  ].join(" ");

  exec(command, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
    if (error) {
      error.publicMessage = "Unable to search YouTube right now.";
      error.details = stderr;
      return next(error);
    }

    try {
      const results = stdout
        .split(/\r?\n/)
        .filter(Boolean)
        .map((line) => JSON.parse(line))
        .filter((video) => video && video.id)
        .map(normalizeVideo);

      return res.json(results);
    } catch (parseError) {
      parseError.publicMessage = "Could not parse YouTube search results.";
      return next(parseError);
    }
  });
});

module.exports = router;
