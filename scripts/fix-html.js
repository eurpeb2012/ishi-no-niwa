const fs = require("fs");
const path = require("path");

const htmlPath = path.join(__dirname, "..", "dist", "index.html");
let html = fs.readFileSync(htmlPath, "utf-8");

// Add type="module" to script tags that use defer (Expo's bundle uses import.meta)
html = html.replace(
  /<script src="([^"]+)" defer><\/script>/g,
  '<script type="module" src="$1"></script>'
);

fs.writeFileSync(htmlPath, html, "utf-8");
console.log("Fixed index.html: added type=\"module\" to script tags");
