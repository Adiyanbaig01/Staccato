require("dotenv").config();

const path = require("path");
const cors = require("cors");
const express = require("express");
const rateLimit = require("express-rate-limit");

const searchRouter = require("./routes/search");
const streamRouter = require("./routes/stream");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(
  "/api",
  rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: "Too many requests. Please slow down and try again in a minute."
    }
  })
);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/search", searchRouter);
app.use("/api/stream", streamRouter);

app.use(express.static(__dirname));

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.use((err, _req, res, _next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    error: err.publicMessage || "Something went wrong while processing your request."
  });
});

app.listen(PORT, () => {
  console.log(`Staccato server running on http://localhost:${PORT}`);
});
