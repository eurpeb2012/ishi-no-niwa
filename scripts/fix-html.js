const fs = require("fs");
const path = require("path");
const glob = require("path");

const distDir = path.join(__dirname, "..", "dist");

// 1. Fix index.html: add type="module" to script tags
const htmlPath = path.join(distDir, "index.html");
let html = fs.readFileSync(htmlPath, "utf-8");
html = html.replace(
  /<script src="([^"]+)" defer><\/script>/g,
  '<script type="module" src="$1"></script>'
);
fs.writeFileSync(htmlPath, html, "utf-8");
console.log('Fixed index.html: added type="module" to script tags');

// 2. Fix JS bundles: replace import.meta.env with process.env equivalent
//    Zustand uses import.meta.env.MODE which breaks in non-module contexts.
//    Even with type="module", some CDN/hosts strip it. Belt-and-suspenders fix.
const jsDir = path.join(distDir, "_expo", "static", "js", "web");
if (fs.existsSync(jsDir)) {
  const files = fs.readdirSync(jsDir).filter((f) => f.endsWith(".js"));
  for (const file of files) {
    const filePath = path.join(jsDir, file);
    let js = fs.readFileSync(filePath, "utf-8");
    const count = (js.match(/import\.meta\.env/g) || []).length;
    if (count > 0) {
      // Replace import.meta.env references with a safe inline object
      // import.meta.env?.MODE -> "production"
      js = js.replace(
        /import\.meta\.env\?import\.meta\.env\.MODE:void 0/g,
        '"production"'
      );
      // Catch any remaining import.meta.env.MODE
      js = js.replace(/import\.meta\.env\.MODE/g, '"production"');
      // Catch any remaining import.meta.env
      js = js.replace(/import\.meta\.env/g, '({MODE:"production"})');
      // Catch bare import.meta (e.g. import.meta.url)
      js = js.replace(/import\.meta\.url/g, 'window.location.href');
      fs.writeFileSync(filePath, js, "utf-8");
      console.log(`Fixed ${file}: replaced ${count} import.meta.env references`);
    }
  }
}
