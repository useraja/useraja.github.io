const fs = require("fs");
const path = require("path");

const BASE_URL = "https://mitra-hris.oneuclid.com";

// cari semua file .html di project
function getAllHtmlFiles(dir, filelist = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      filelist = getAllHtmlFiles(filepath, filelist);
    } else if (path.extname(file) === ".html") {
      filelist.push(filepath.replace(__dirname, "")); 
    }
  });
  return filelist;
}

const pages = getAllHtmlFiles(__dirname);

// bikin sitemap
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => {
  const urlPath = p.replace(/\\/g, "/").replace("index.html", "");
  return `
  <url>
    <loc>${BASE_URL}${urlPath}</loc>
    <changefreq>weekly</changefreq>
    <priority>${urlPath === "/" ? "1.00" : "0.80"}</priority>
  </url>`;
}).join("\n")}
</urlset>`;

// simpan sitemap.xml
fs.writeFileSync("sitemap.xml", sitemap, "utf8");

// bikin robots.txt
const robots = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml`;

fs.writeFileSync("robots.txt", robots, "utf8");

console.log("✅ sitemap.xml dan robots.txt berhasil dibuat!");
