# 💨 Nargile Kod Rehberi

Türkiye'deki nargile markalarının ürün kodlarını ve içeriklerini tek sayfada gösteren,
**tamamen ücretsiz** bir web sitesi. Koda, içeriğe (kavun, karpuz, sakız…) veya markaya
göre arama yapılabilir. İçerikler bir yönetim panelinden kolayca güncellenir.

---

## 📁 Dosyalar ne işe yarıyor?

| Dosya | Açıklama |
|---|---|
| `index.html` | Sitenin kendisi. Markalar, arama, ürün listesi. |
| `data.json` | **Tüm veriler burada.** Panel bu dosyayı düzenler. |
| `admin/` | Yönetim paneli (Decap CMS). `site-adresin/admin/` adresinden açılır. |
| `netlify.toml` | Netlify ayarı (dokunmana gerek yok). |

> İçeriği değiştirmek için **kod bilmene gerek yok** — her şey panelden yapılır.

---

## 🚀 Yayına Alma (tek seferlik kurulum)

Bu adımları **bir kez** yapacaksın. Sonrasında her şey panelden yürür.

### 1) GitHub'a yükle
1. <https://github.com> adresinden ücretsiz hesap aç.
2. Sağ üstten **New repository** → ad ver (örn. `nargile`) → **Create**.
3. Açılan sayfada **uploading an existing file** bağlantısına tıkla, bu klasördeki
   **tüm dosyaları** (klasörler dahil) sürükle-bırak yap → **Commit changes**.

### 2) `admin/config.yml` içindeki depo adını düzelt
`admin/config.yml` dosyasını GitHub'da aç (kalem ✏️ simgesi) ve şu satırı bul:

```yaml
backend:
  name: git-gateway
  branch: main
```

> Not: `git-gateway` ile depo adını yazmana gerek yok. Aşağıdaki **4. adım**
> bu bağlantıyı otomatik kurar. (Sadece "github" yöntemini seçersen depo adı gerekir.)

### 3) Netlify'a bağla (site yayına girer)
1. <https://netlify.com> → **GitHub ile giriş yap**.
2. **Add new site → Import an existing project → GitHub** → `nargile` deposunu seç.
3. Ayarlara dokunmadan **Deploy**. ~1 dakikada siten yayında olur:
   `https://rastgele-isim.netlify.app`
4. İstersen **Site settings → Change site name** ile adresi güzelleştir
   (örn. `nargile-kodlari.netlify.app`).

### 4) Panel girişini aç (Netlify Identity)
1. Netlify'da sitenin sayfasında: **Integrations / Identity** bölümünü bul, **Enable Identity**.
2. **Identity → Services → Git Gateway → Enable Git Gateway**.
3. **Identity → Registration** ayarını **Invite only** yap (başkaları kayıt olamasın).
4. **Identity → Invite users** ile **kendi e-postanı** davet et.
5. E-postandaki bağlantıya tıkla, bir şifre belirle.

### 5) Panele gir 🎉
`https://senin-siten.netlify.app/admin/` adresine git, e-posta + şifrenle giriş yap.
Markaları, kodları ve içerikleri buradan ekle/düzenle/sil.

> Panelde **Publish** dediğinde değişiklik otomatik kaydolur ve site ~1 dakika içinde
> kendiliğinden güncellenir. Başka hiçbir şey yapmana gerek yok.

---

## 🛠️ Panel kullanımı (günlük iş)

1. `site/admin/` → giriş yap.
2. **Nargile Kodları → Markalar ve Kodlar**.
3. **Markalar** listesinden:
   - **Yeni marka:** alttaki **Add Markalar** (Marka ekle).
   - Marka içine girip **Ürünler → Add Ürünler** ile kod + ürün adı + içerik ekle.
   - İçerikleri (kavun, karpuz, sakız…) tek tek satır olarak yaz.
4. Sağ üstten **Publish → Publish now**.

---

## ❓ "Identity" seçeneğini göremiyorum / giriş çalışmıyor

Netlify, yeni hesaplarda bazen Identity'yi göstermez. Bu durumda **Sveltia CMS**
(aynı ayar dosyasıyla çalışan, daha kolay girişli ücretsiz alternatif) kullan:

1. `admin/index.html` içindeki script satırını şununla değiştir:
   ```html
   <script src="https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js"></script>
   ```
2. `admin/config.yml` içindeki `backend` bölümünü şu şekilde yap
   (`KULLANICI/DEPO` kısmını kendi GitHub bilgilerinle değiştir):
   ```yaml
   backend:
     name: github
     repo: KULLANICI/DEPO
     branch: main
   ```
3. Kaydet. Artık `/admin/` adresine girince **GitHub ile giriş** yapabilirsin —
   ekstra kurulum gerekmez.

---

## 💰 Maliyet

Hepsi ücretsiz: **GitHub** (depo) + **Netlify** (yayın + `.netlify.app` adresi) +
**Decap/Sveltia CMS** (panel). İstersen sonradan kendi alan adını (`.com`) bağlayabilirsin.
