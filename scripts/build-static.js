const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");

const entries = [
  "index.html",
  "staccato.css",
  "staccato.js",
  "config.js",
  "Logo.png",
  "Staccato.png",
  "Staccato.jpg",
  "taylorswift1989.jpg",
  "Premium.html",
  "Support.html",
  "assets",
  "Images",
  "Songs"
];

function copyEntry(name) {
  const source = path.join(root, name);
  const target = path.join(dist, name);

  if (!fs.existsSync(source)) {
    return;
  }

  fs.cpSync(source, target, {
    recursive: true,
    force: true
  });
}

fs.rmSync(dist, {
  recursive: true,
  force: true
});

fs.mkdirSync(dist, {
  recursive: true
});

entries.forEach(copyEntry);

console.log(`Copied ${entries.length} static entries to ${path.relative(root, dist)}`);
