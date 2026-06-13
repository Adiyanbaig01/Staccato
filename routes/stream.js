const { exec } = require("child_process");
const express = require("express");

const router = express.Router();

const YT_DLP_BIN = process.env.YT_DLP_PATH || "yt-dlp";
const VIDEO_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;

function shellQuote(value) {
  return `"${String(value).replace(/(["\\$`])/g, "\\$1")}"`;
}

router.get("/:videoId", (req, res, next) => {
  const { videoId } = req.params;

  if (!VIDEO_ID_PATTERN.test(videoId)) {
    return res.status(400).json({ error: "Invalid YouTube video ID." });
  }

  const url = `https://www.youtube.com/watch?v=${videoId}`;
  const command = [
    shellQuote(YT_DLP_BIN),
    "-f",
    shellQuote("bestaudio"),
    "-g",
    shellQuote(url),
    "--no-warnings"
  ].join(" ");

  exec(command, { maxBuffer: 1024 * 1024 * 5 }, (error, stdout, stderr) => {
    if (error) {
      error.publicMessage = "Unable to prepare this stream right now.";
      error.details = stderr;
      return next(error);
    }

    const streamUrl = stdout.split(/\r?\n/).find(Boolean);

    if (!streamUrl) {
      const streamError = new Error("yt-dlp did not return a stream URL.");
      streamError.publicMessage = "No stream URL was returned for this track.";
      return next(streamError);
    }

    return res.json({ streamUrl });
  });
});

module.exports = router;
