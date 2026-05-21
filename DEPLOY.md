# Deploy prototype — Krisis Bekalan Global Dashboard

Prototype ini ialah SPA (Vite + React). Laluan dalaman (`/fuel`, `/ai`, …) memerlukan konfigurasi hosting khas.

---

## Pilihan C: GitHub Pages (hosting di GitHub)

**Ya, boleh.** Percuma untuk repo awam (atau GitHub Pro untuk repo peribadi).

**URL contoh:** `https://<username-github>.github.io/<nama-repo>/`  
**Laluan:** `https://<username>.github.io/<nama-repo>/#/fuel` (HashRouter — serasi GitHub Pages)

### Langkah sekali (dalam GitHub)

1. Push kod ke GitHub (repo baharu atau sedia ada).
2. Repo → **Settings** → **Pages**
3. **Build and deployment** → Source: **GitHub Actions**
4. Push ke cawangan `main` — workflow `.github/workflows/deploy-github-pages.yml` akan build & deploy automatik.
5. Tunggu Actions hijau; URL dipaparkan di Settings → Pages.

### Deploy manual (tanpa Actions)

```bash
# Ganti nama-repo dengan nama repository GitHub (sensitif huruf)
VITE_GH_PAGES=true VITE_BASE_URL=/nama-repo/ npm run build:gh-pages
```

### Uji build GitHub Pages secara tempatan

```bash
VITE_GH_PAGES=true VITE_BASE_URL=/nama-repo-anda/ npm run build
npm run preview
```

Buka preview dan pastikan aset (CSS/JS) dimuat — laluan guna `#/fuel`.

### Nota

- Nama repo **mesti** sama dengan `VITE_BASE_URL` (workflow set automatik: `/<nama-repo>/`).
- Repo peribadi: GitHub Pages mungkin memerlukan [GitHub Pro](https://github.com/pricing) atau jadikan repo **Public** untuk Pages percuma.
- Data API tetap dari Supabase (internet diperlukan).

---

## Prasyarat

```bash
cd "/Users/mohdfairuz/Desktop/Dashboard Krisis"
npm install
npm run build   # pastikan lulus
```

Output: folder `dist/`

---

## Pilihan A: Vercel (disyorkan)

1. Akaun di [vercel.com](https://vercel.com) (GitHub login boleh).
2. Pasang CLI (sekali):

   ```bash
   npm i -g vercel
   ```

3. Dari folder projek:

   ```bash
   vercel login
   vercel          # deploy preview
   vercel --prod   # URL production tetap
   ```

4. Atau: import repo GitHub di dashboard Vercel — `vercel.json` sudah disediakan.

**URL contoh:** `https://pantau-krisis-dashboard.vercel.app`

---

## Pilihan B: Netlify

### Drag & drop (paling mudah)

1. `npm run build`
2. Buka [app.netlify.com/drop](https://app.netlify.com/drop)
3. Seret folder **`dist`** ke halaman itu.

### Git / CLI

```bash
npm i -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

`netlify.toml` dan `public/_redirects` sudah disediakan untuk SPA.

---

## Selepas deploy — semak

- [ ] Laman utama `/`
- [ ] `/fuel`, `/cpi`, `/ai`
- [ ] Refresh terus pada URL dalaman (contoh `/fuel`) — tidak 404
- [ ] Data API / carta dimuat (perlu internet; Supabase anon key dalam kod)
- [ ] Chatbase pada `/ai` (jika disekat, cuba penyemak iklan dimatikan)

---

## Nota keselamatan

- Kunci Supabase **anon** dalam `src/lib/supabase.ts` adalah untuk client awam (sama seperti laman rasmi).
- Jangan commit fail `.env` dengan kunci peribadi.
- Prototype ini **bukan** keluaran rasmi `pantaukrisis.gov.my`.
