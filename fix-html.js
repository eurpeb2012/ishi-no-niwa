const fs = require("fs");
const path = require("path");

const distDir = path.join(__dirname, "dist");

// Fix index.html: add type="module" to script tag and set base URL
const indexPath = path.join(distDir, "index.html");
let html = fs.readFileSync(indexPath, "utf8");

// Ensure script tags have type="module"
html = html.replace(/<script\s+src="/g, '<script type="module" src="');
// Avoid double type="module"
html = html.replace(/type="module"\s+type="module"/g, 'type="module"');

fs.writeFileSync(indexPath, html, "utf8");
console.log("Fixed index.html");

// Fix JS bundle: replace import.meta.env references
const jsDir = path.join(distDir, "_expo", "static", "js", "web");
if (fs.existsSync(jsDir)) {
  fs.readdirSync(jsDir).forEach((file) => {
    if (file.endsWith(".js")) {
      const filePath = path.join(jsDir, file);
      let js = fs.readFileSync(filePath, "utf8");
      // Replace import.meta.env with empty object to avoid errors in non-module context
      js = js.replace(/import\.meta\.env/g, "({})");
      fs.writeFileSync(filePath, js, "utf8");
      console.log(`Fixed ${file}`);
    }
  });
}

// Copy index.html to 404.html so GitHub Pages serves the SPA for all routes
fs.copyFileSync(indexPath, path.join(distDir, "404.html"));
console.log("Created 404.html for SPA routing");

// Copy static HTML pages to dist if they exist
["testing-guide.html", "release-notes.html"].forEach((file) => {
  const src = path.join(__dirname, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(distDir, file));
    console.log(`Copied ${file}`);
  }
});

console.log("Done!");
