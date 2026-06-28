// Türkçe duyarlı arama normalizasyonu + marka görseli yardımcıları.
export function norm(s: string): string {
  return (s || "")
    .toString()
    .replace(/İ/g, "i")
    .replace(/I/g, "i")
    .replace(/ı/g, "i")
    .toLocaleLowerCase("tr")
    .replace(/ş/g, "s")
    .replace(/ğ/g, "g")
    .replace(/ç/g, "c")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .trim();
}

export function brandColors(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return `linear-gradient(140deg, hsl(${h},68%,55%), hsl(${(h + 38) % 360},72%,43%))`;
}

export function initials(name: string): string {
  const p = name.trim().split(/\s+/);
  return p.length === 1 ? p[0].slice(0, 2).toUpperCase() : (p[0][0] + p[1][0]).toUpperCase();
}
