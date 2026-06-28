// content/markalar ve content/urunler altindaki JSON dosyalarini
// sitenin okudugu data.json'a birlestirir. Netlify her yayinda calistirir.
const fs = require("fs");
const path = require("path");

function readJsonDir(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(function (f) { return f.endsWith(".json"); })
    .map(function (f) {
      try { return JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")); }
      catch (e) { console.error("Bozuk JSON atlandi:", f, e.message); return null; }
    })
    .filter(Boolean);
}

var brandsRaw = readJsonDir("content/markalar");
var productsRaw = readJsonDir("content/urunler");

var map = new Map();
function ensure(name) {
  if (!name) return null;
  if (!map.has(name)) map.set(name, { name: name, products: [] });
  return map.get(name);
}

brandsRaw.forEach(function (b) { if (b && b.name) ensure(b.name); });
productsRaw.forEach(function (p) {
  if (!p) return;
  var b = ensure(p.brand);
  if (!b) return;
  b.products.push({
    code: p.code || "",
    name: p.name || "",
    contents: Array.isArray(p.contents) ? p.contents : []
  });
});

var brands = Array.from(map.values()).sort(function (a, b) { return a.name.localeCompare(b.name, "tr"); });
brands.forEach(function (b) {
  b.products.sort(function (x, y) { return (x.code || "").localeCompare(y.code || "", "tr"); });
});

fs.writeFileSync("data.json", JSON.stringify({ brands: brands }, null, 2));
console.log("data.json olusturuldu:", brands.length, "marka,", productsRaw.length, "urun");
