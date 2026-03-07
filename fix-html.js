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

// Copy testing-guide.html to dist if it exists
const testGuide = path.join(__dirname, "testing-guide.html");
if (fs.existsSync(testGuide)) {
  fs.copyFileSync(testGuide, path.join(distDir, "testing-guide.html"));
  console.log("Copied testing-guide.html");
}

console.log("Done!");
