# 💨 Nargile Kod Rehberi

Türkiye'deki nargile markalarının ürün kodlarını ve içeriklerini gösteren **Next.js**
uygulaması. Koda, içeriğe (kavun, karpuz, sakız…) veya markaya göre arama yapılır.
İçerikler, **şifreyle korunan şık bir yönetim panelinden** kolayca yönetilir.

- **Ön yüz:** mobil öncelikli, animasyonlu, hızlı (Next.js 16 + React 19 + Tailwind 4)
- **Panel:** `/admin` → şifreyle giriş → markaları/ürünleri tek tıkla ekle-sil-düzenle
- **Veri:** veritabanı yok. Canlıda **Netlify Blobs** (ücretsiz, dahili), yerelde dosya.
- **Maliyet:** sıfır (Netlify ücretsiz katman).

---

## 🔑 Ortam değişkenleri

| Değişken | Açıklama |
|---|---|
| `ADMIN_PASSWORD` | Panele giriş şifresi. **Mutlaka belirle.** |
| `COOKIE_SECRET` | Oturum imzası için rastgele uzun bir metin. |

Yerelde bunlar `.env.local` içinde (git'e gönderilmez). Canlıda Netlify panelinden girilir.

---

## 💻 Yerel çalıştırma

```bash
npm install
npm run dev      # http://localhost:3000
```

- Site: `/`  ·  Panel: `/admin`  (şifre: `.env.local` içindeki `ADMIN_PASSWORD`)
- Yerelde veri `content/data.json`'a yazılır (git'e gönderilmez). İlk açılışta
  `content/seed-data.json` (demo veri) gösterilir.

---

## 🚀 Netlify'a yayınlama

Depo zaten Netlify'a bağlı (`Deploys from GitHub`). Next.js'e geçtiğimiz için tek seferlik:

1. **Ortam değişkenleri:** Netlify → Project configuration → **Environment variables** →
   şunları ekle:
   - `ADMIN_PASSWORD` = (belirlediğin güçlü şifre)
   - `COOKIE_SECRET` = (rastgele uzun bir metin)
2. **Build ayarı:** Netlify Next.js'i otomatik algılar. Build command `npm run build`
   (zaten `netlify.toml`'da). Eski statik ayar kaldıysa **Build settings**'i sıfırla/güncelle.
3. **Deploy:** `git push` → Netlify otomatik derler ve yayınlar.
4. **Netlify Blobs:** ekstra kurulum yok; ilk yayında otomatik devreye girer.

> Panelde yaptığın değişiklikler **anında** canlıya yansır (Blobs'a yazılır, yeniden
> derleme gerekmez).

---

## 🛠️ Panel kullanımı

1. `site/admin` → şifreyle gir.
2. **+ Yeni Marka** ile marka ekle.
3. Markayı aç → **+ Ürün Ekle** → kod, ürün adı, içindekiler (etiket olarak yaz).
4. Düzenle (✎) / sil (🗑) ikonlarıyla yönet.
5. Sağ üstte **Kaydet** → değişiklikler canlıya yansır.

---

## Yapı

```
app/
  page.tsx              # ana sayfa (sunucu) -> PublicApp
  admin/page.tsx        # panel (korumalı) -> AdminApp
  admin/login/page.tsx  # giriş ekranı
  api/admin/*           # login / logout / data (GET, PUT)
components/
  PublicApp.tsx         # arama, marka grid, ürün modalı
  AdminApp.tsx          # CRUD panel
lib/
  data.ts               # Netlify Blobs + yerel dosya + tohum
  auth.ts               # imzalı çerez oturumu
  types.ts, display.ts
content/seed-data.json  # demo veri
proxy.ts                # /admin ve /api/admin koruması
```
