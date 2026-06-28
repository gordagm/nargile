import { promises as fs } from "fs";
import path from "path";
import seed from "@/content/seed-data.json";
import type { Data } from "./types";

const STORE_NAME = "nargile";
const KEY = "data";
const LOCAL_FILE = path.join(process.cwd(), "content", "data.json");

type BlobStore = {
  get: (key: string, opts: { type: "json" }) => Promise<unknown>;
  setJSON: (key: string, value: unknown) => Promise<void>;
};

async function getBlobStore(): Promise<BlobStore | null> {
  try {
    const mod = await import("@netlify/blobs");
    return mod.getStore(STORE_NAME) as unknown as BlobStore;
  } catch {
    return null;
  }
}

export async function readData(): Promise<Data> {
  // 1) Netlify Blobs (canlı ortam)
  try {
    const store = await getBlobStore();
    if (store) {
      const val = await store.get(KEY, { type: "json" });
      if (val) return val as Data;
    }
  } catch {
    /* blobs yok / yapılandırılmamış -> dosyaya düş */
  }
  // 2) Yerel dosya (geliştirme)
  try {
    const raw = await fs.readFile(LOCAL_FILE, "utf8");
    return JSON.parse(raw) as Data;
  } catch {
    /* dosya yok -> tohum */
  }
  // 3) Tohum veri
  return seed as unknown as Data;
}

export async function writeData(data: Data): Promise<void> {
  // Önce Blobs'a yazmayı dene
  try {
    const store = await getBlobStore();
    if (store) {
      await store.setJSON(KEY, data);
      return;
    }
  } catch {
    /* blobs yok -> dosyaya yaz */
  }
  // Geliştirmede yerel dosyaya yaz
  await fs.mkdir(path.dirname(LOCAL_FILE), { recursive: true });
  await fs.writeFile(LOCAL_FILE, JSON.stringify(data, null, 2), "utf8");
}
