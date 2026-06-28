"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Brand, Data, Product } from "@/lib/types";
import { uid } from "@/lib/types";
import { norm, brandColors, initials } from "@/lib/display";

type BrandModal = { mode: "add" | "edit"; id?: string; name: string };
type ProductModal = {
  brandId: string;
  brandName: string;
  mode: "add" | "edit";
  id?: string;
  code: string;
  name: string;
  contents: string[];
};

export default function AdminApp({ initial }: { initial: Data }) {
  const router = useRouter();
  const [data, setData] = useState<Data>(initial);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Set<string>>(new Set());
  const [brandModal, setBrandModal] = useState<BrandModal | null>(null);
  const [productModal, setProductModal] = useState<ProductModal | null>(null);

  const brands = useMemo(
    () => [...data.brands].sort((a, b) => a.name.localeCompare(b.name, "tr")),
    [data]
  );
  const totalProducts = data.brands.reduce((s, b) => s + b.products.length, 0);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }
  function mutate(next: Data) {
    setData(next);
    setDirty(true);
  }
  function toggle(id: string) {
    setOpen((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }

  async function saveAll() {
    setSaving(true);
    const res = await fetch("/api/admin/data", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(false);
    if (res.ok) {
      setDirty(false);
      showToast("Kaydedildi ✓");
    } else {
      showToast("Kaydedilemedi!");
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  // ---- Marka işlemleri ----
  function commitBrand() {
    if (!brandModal) return;
    const name = brandModal.name.trim();
    if (!name) return;
    if (brandModal.mode === "add") {
      const id = uid();
      mutate({ ...data, brands: [...data.brands, { id, name, products: [] }] });
      setOpen((p) => new Set(p).add(id));
    } else {
      mutate({
        ...data,
        brands: data.brands.map((b) => (b.id === brandModal.id ? { ...b, name } : b)),
      });
    }
    setBrandModal(null);
  }
  function deleteBrand(b: Brand) {
    if (!confirm(`"${b.name}" markası ve ${b.products.length} ürünü silinsin mi?`)) return;
    mutate({ ...data, brands: data.brands.filter((x) => x.id !== b.id) });
  }

  // ---- Ürün işlemleri ----
  function commitProduct() {
    if (!productModal) return;
    const code = productModal.code.trim();
    const name = productModal.name.trim();
    if (!code && !name) return;
    const prod: Product = {
      id: productModal.id || uid(),
      code,
      name,
      contents: productModal.contents.map((c) => c.trim()).filter(Boolean),
    };
    mutate({
      ...data,
      brands: data.brands.map((b) => {
        if (b.id !== productModal.brandId) return b;
        const products =
          productModal.mode === "add"
            ? [...b.products, prod]
            : b.products.map((p) => (p.id === prod.id ? prod : p));
        return { ...b, products };
      }),
    });
    setProductModal(null);
  }
  function deleteProduct(brandId: string, p: Product) {
    if (!confirm(`"${p.code} ${p.name}" silinsin mi?`)) return;
    mutate({
      ...data,
      brands: data.brands.map((b) =>
        b.id === brandId ? { ...b, products: b.products.filter((x) => x.id !== p.id) } : b
      ),
    });
  }

  // ---- Filtre ----
  const nq = norm(query);
  function brandVisible(b: Brand): boolean {
    if (!nq) return true;
    if (norm(b.name).includes(nq)) return true;
    return b.products.some(
      (p) =>
        norm(p.code).includes(nq) ||
        norm(p.name).includes(nq) ||
        p.contents.some((c) => norm(c).includes(nq))
    );
  }
  function productVisible(b: Brand, p: Product): boolean {
    if (!nq) return true;
    if (norm(b.name).includes(nq)) return true;
    return (
      norm(p.code).includes(nq) ||
      norm(p.name).includes(nq) ||
      p.contents.some((c) => norm(c).includes(nq))
    );
  }

  const visibleBrands = brands.filter(brandVisible);

  return (
    <div className="admin">
      <div className="admin-top">
        <div className="title">
          <span className="dot">💨</span> Panel
        </div>
        <div className="spacer" />
        <a className="btn btn-ghost btn-sm" href="/" target="_blank" rel="noopener">
          Siteyi Gör ↗
        </a>
        <button className="btn btn-ghost btn-sm" onClick={logout}>
          Çıkış
        </button>
        <button className="btn btn-primary btn-sm" onClick={saveAll} disabled={!dirty || saving}>
          {saving ? "Kaydediliyor…" : dirty ? "Kaydet" : "Kayıtlı ✓"}
        </button>
      </div>

      <div className="field" style={{ marginTop: 4 }}>
        <input
          className="input"
          placeholder="🔍 Marka, kod veya içerik ara…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "6px 2px 16px" }}>
        <div style={{ color: "var(--muted)", fontSize: 13, fontWeight: 600, flex: 1 }}>
          {data.brands.length} marka · {totalProducts} ürün
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setBrandModal({ mode: "add", name: "" })}>
          + Yeni Marka
        </button>
      </div>

      {visibleBrands.length === 0 && (
        <div className="empty">
          <div className="big">📭</div>
          {query ? "Eşleşen sonuç yok." : "Henüz marka yok. “+ Yeni Marka” ile başla."}
        </div>
      )}

      {visibleBrands.map((b) => {
        const isOpen = open.has(b.id) || !!nq;
        const prods = b.products.filter((p) => productVisible(b, p));
        return (
          <div className={`brand-block${isOpen ? " open" : ""}`} key={b.id}>
            <div className="brand-head" onClick={() => toggle(b.id)}>
              <span className="avatar" style={{ background: brandColors(b.name) }}>
                {initials(b.name)}
              </span>
              <div className="bn">
                <div className="name">{b.name || "(isimsiz)"}</div>
                <div className="cnt">{b.products.length} ürün</div>
              </div>
              <button
                className="icon-btn"
                title="Markayı düzenle"
                onClick={(e) => {
                  e.stopPropagation();
                  setBrandModal({ mode: "edit", id: b.id, name: b.name });
                }}
              >
                ✎
              </button>
              <button
                className="icon-btn del"
                title="Markayı sil"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteBrand(b);
                }}
              >
                🗑
              </button>
              <span className="chev">›</span>
            </div>
            <div className="brand-body">
              {prods.map((p) => (
                <div className="prow" key={p.id}>
                  <span className="pc">{p.code || "—"}</span>
                  <div className="pi">
                    <div className="pn">{p.name || "İsimsiz"}</div>
                    <div className="pcont">{p.contents.join(", ") || "içerik yok"}</div>
                  </div>
                  <button
                    className="icon-btn"
                    title="Düzenle"
                    onClick={() =>
                      setProductModal({
                        brandId: b.id,
                        brandName: b.name,
                        mode: "edit",
                        id: p.id,
                        code: p.code,
                        name: p.name,
                        contents: p.contents,
                      })
                    }
                  >
                    ✎
                  </button>
                  <button className="icon-btn del" title="Sil" onClick={() => deleteProduct(b.id, p)}>
                    🗑
                  </button>
                </div>
              ))}
              <button
                className="btn btn-ghost btn-sm"
                style={{ marginTop: 12 }}
                onClick={() =>
                  setProductModal({
                    brandId: b.id,
                    brandName: b.name,
                    mode: "add",
                    code: "",
                    name: "",
                    contents: [],
                  })
                }
              >
                + Ürün Ekle
              </button>
            </div>
          </div>
        );
      })}

      {/* Marka modalı */}
      {brandModal && (
        <div className="modal-bg" onClick={() => setBrandModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{brandModal.mode === "add" ? "Yeni Marka" : "Markayı Düzenle"}</h3>
            <div className="field">
              <label>Marka Adı</label>
              <input
                className="input"
                placeholder="Örn: Adalya"
                value={brandModal.name}
                autoFocus
                onChange={(e) => setBrandModal({ ...brandModal, name: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && commitBrand()}
              />
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setBrandModal(null)}>
                Vazgeç
              </button>
              <button className="btn btn-primary" onClick={commitBrand} disabled={!brandModal.name.trim()}>
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ürün modalı */}
      {productModal && (
        <div className="modal-bg" onClick={() => setProductModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>
              {productModal.mode === "add" ? "Yeni Ürün" : "Ürünü Düzenle"}
              <span style={{ color: "var(--muted)", fontWeight: 600, fontSize: 14 }}>
                {" "}
                · {productModal.brandName}
              </span>
            </h3>
            <div className="field">
              <label>Kod</label>
              <input
                className="input"
                placeholder="Örn: ADL-01"
                value={productModal.code}
                autoFocus
                onChange={(e) => setProductModal({ ...productModal, code: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Ürün Adı</label>
              <input
                className="input"
                placeholder="Örn: Love 66"
                value={productModal.name}
                onChange={(e) => setProductModal({ ...productModal, name: e.target.value })}
              />
            </div>
            <div className="field">
              <label>İçindekiler</label>
              <TagInput
                value={productModal.contents}
                onChange={(contents) => setProductModal({ ...productModal, contents })}
              />
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setProductModal(null)}>
                Vazgeç
              </button>
              <button
                className="btn btn-primary"
                onClick={commitProduct}
                disabled={!productModal.code.trim() && !productModal.name.trim()}
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`toast${toast.includes("✓") ? " ok" : ""}`}>
          <span className="d" /> {toast}
        </div>
      )}
    </div>
  );
}

function TagInput({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [text, setText] = useState("");
  function add() {
    const parts = text
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (!parts.length) return;
    onChange([...value, ...parts]);
    setText("");
  }
  return (
    <div className="tags">
      {value.map((t, i) => (
        <span className="tag" key={i}>
          {t}
          <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))}>
            ×
          </button>
        </span>
      ))}
      <input
        placeholder="kavun, karpuz…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            add();
          } else if (e.key === "Backspace" && !text && value.length) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={add}
      />
    </div>
  );
}
