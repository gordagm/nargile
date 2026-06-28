export type Product = {
  id: string;
  code: string;
  name: string;
  contents: string[];
};

export type Brand = {
  id: string;
  name: string;
  products: Product[];
};

export type Data = {
  brands: Brand[];
};

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

// Gelen veriyi güvenli forma getirir; eksik id'leri tamamlar.
export function normalizeData(raw: unknown): Data {
  const r = (raw ?? {}) as { brands?: unknown };
  const brands = Array.isArray(r.brands) ? r.brands : [];
  return {
    brands: brands.map((b) => {
      const bb = (b ?? {}) as Partial<Brand> & { products?: unknown };
      const products = Array.isArray(bb.products) ? bb.products : [];
      return {
        id: bb.id || uid(),
        name: String(bb.name ?? ""),
        products: products.map((p) => {
          const pp = (p ?? {}) as Partial<Product> & { contents?: unknown };
          return {
            id: pp.id || uid(),
            code: String(pp.code ?? ""),
            name: String(pp.name ?? ""),
            contents: Array.isArray(pp.contents) ? pp.contents.map(String) : [],
          };
        }),
      };
    }),
  };
}
