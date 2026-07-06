"use client";

import { useEffect, useMemo, useState } from "react";
import type { Brand, Product } from "@/lib/types";
import { norm, brandColors, initials } from "@/lib/display";

type Row = { product: Product; brand: string };

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const nq = norm(query);
  const nt = norm(text);
  const idx = nt.indexOf(nq);
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark>{text.slice(idx, idx + nq.length)}</mark>
      {text.slice(idx + nq.length)}
    </>
  );
}

function productMatches(p: Product, brand: string, q: string): boolean {
  if (!q) return true;
  const nq = norm(q);
  if (norm(p.code).includes(nq)) return true;
  if (norm(p.name).includes(nq)) return true;
  if (norm(brand).includes(nq)) return true;
  return p.contents.some((c) => norm(c).includes(nq));
}

export default function PublicApp({ brands }: { brands: Brand[] }) {
  const sorted = useMemo(
    () => [...brands].sort((a, b) => a.name.localeCompare(b.name, "tr")),
    [brands]
  );

  const [query, setQuery] = useState("");
  const [current, setCurrent] = useState<string | null>(null);
  const [sheet, setSheet] = useState<Row | null>(null);

  const totalProducts = useMemo(
    () => sorted.reduce((s, b) => s + b.products.length, 0),
    [sorted]
  );

  useEffect(() => {
    document.body.classList.toggle("no-scroll", !!sheet);
    return () => document.body.classList.remove("no-scroll");
  }, [sheet]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSheet(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function openBrand(name: string) {
    setCurrent(name);
    setQuery("");
    window.scrollTo({ top: 0 });
  }
  function goHome() {
    setCurrent(null);
    setQuery("");
    window.scrollTo({ top: 0 });
  }

  // Arama sonuçları (ana sayfa, tüm markalar)
  const searchResults: Row[] = useMemo(() => {
    if (!query) return [];
    const rows: Row[] = [];
    for (const b of sorted)
      for (const p of b.products)
        if (productMatches(p, b.name, query)) rows.push({ product: p, brand: b.name });
    return rows;
  }, [query, sorted]);

  const brandObj = current ? sorted.find((b) => b.name === current) : null;
  const brandProducts: Product[] = brandObj
    ? brandObj.products.filter((p) => productMatches(p, brandObj.name, query))
    : [];

  function ProductRow({ row }: { row: Row }) {
    return (
      <button className="item" onClick={() => setSheet(row)} style={{ animationDelay: "0ms" }}>
        <span className="code">
          <Highlight text={row.product.code || "—"} query={query} />
        </span>
        <span className="item-info">
          <span className="pname">
            <Highlight text={row.product.name || "İsimsiz"} query={query} />
          </span>
          {!current && (
            <span className="pbrand">
              <Highlight text={row.brand} query={query} />
            </span>
          )}
          {row.product.contents.length > 0 && (
            <span className="pcontents">
              {row.product.contents.map((c, idx) => (
                <span key={idx}>
                  {idx > 0 ? " · " : ""}
                  <Highlight text={c} query={query} />
                </span>
              ))}
            </span>
          )}
        </span>
        <span className="arrow">›</span>
      </button>
    );
  }

  return (
    <main className="wrap">
      {/* Arama (en üstte) */}
      <div className="search-wrap">
        <div className="brandline">
          <span className="dot">💨</span>
          <span>NARGİLE KOD REHBERİ</span>
        </div>
        <div className="search">
          <svg viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z" />
          </svg>
          <input
            type="search"
            inputMode="search"
            autoComplete="off"
            enterKeyHint="search"
            placeholder="Kod, içerik veya marka ara…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button className="clear" aria-label="Temizle" onClick={() => setQuery("")}>
              ×
            </button>
          )}
        </div>
        {!current && !query && (
          <p className="stat">
            <b>{sorted.length}</b> marka · <b>{totalProducts}</b> ürün kodu
          </p>
        )}
      </div>

      {/* İçerik */}
      {!current ? (
        query ? (
          searchResults.length ? (
            <>
              <div className="section-title">{searchResults.length} sonuç</div>
              <div className="list">
                {searchResults.map((r) => (
                  <ProductRow key={r.brand + r.product.id} row={r} />
                ))}
              </div>
            </>
          ) : (
            <div className="empty">
              <div className="big">🔍</div>
              <b>“{query}”</b> için sonuç yok.
              <br />
              Farklı bir kod, içerik ya da marka dene.
            </div>
          )
        ) : (
          <>
            <p className="hint">Bir markaya dokun, kodlarını gör 👇</p>
            <div className="grid">
              {sorted.map((b, i) => (
                <button
                  key={b.id}
                  className="brand-card"
                  style={{ animationDelay: `${i * 36}ms` }}
                  onClick={() => openBrand(b.name)}
                >
                  <span className="avatar" style={{ background: brandColors(b.name) }}>
                    {initials(b.name)}
                  </span>
                  <span className="bname">{b.name}</span>
                  <span className="pill">{b.products.length} ürün</span>
                </button>
              ))}
            </div>
          </>
        )
      ) : (
        <>
          <div className="topbar">
            <button className="back" onClick={goHome}>
              ‹ Markalar
            </button>
          </div>
          {brandObj && (
            <div className="brand-hero">
              <span className="avatar" style={{ background: brandColors(brandObj.name) }}>
                {initials(brandObj.name)}
              </span>
              <div>
                <h2>{brandObj.name}</h2>
                <div className="sub">{brandObj.products.length} ürün kodu</div>
              </div>
            </div>
          )}
          <div className="section-title">
            {brandProducts.length} {query ? "sonuç" : "ürün"}
          </div>
          {brandProducts.length ? (
            <div className="list">
              {brandProducts.map((p) => (
                <ProductRow key={p.id} row={{ product: p, brand: brandObj!.name }} />
              ))}
            </div>
          ) : (
            <div className="empty">
              <div className="big">🔍</div>
              Bu markada eşleşen ürün yok.
            </div>
          )}
        </>
      )}

      <footer>💨 Nargile Kod Rehberi</footer>

      {/* Detay modalı */}
      {sheet && (
        <>
          <div className="backdrop" onClick={() => setSheet(null)} />
          <div className="sheet" role="dialog" aria-modal="true">
            <div className="sheet-handle" />
            <span className="sheet-code">{sheet.product.code || "—"}</span>
            <div className="sheet-name">{sheet.product.name || "İsimsiz"}</div>
            <div className="sheet-brand">
              <span className="av" style={{ background: brandColors(sheet.brand) }}>
                {initials(sheet.brand)}
              </span>
              {sheet.brand}
            </div>
            <div className="sheet-label">İçindekiler</div>
            <div className="chips">
              {sheet.product.contents.length ? (
                sheet.product.contents.map((c, i) => (
                  <span className="chip" key={i}>
                    {c}
                  </span>
                ))
              ) : (
                <span className="chip">Belirtilmemiş</span>
              )}
            </div>
          </div>
        </>
      )}
    </main>
  );
}
