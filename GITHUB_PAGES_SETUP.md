# Betulkan 404 GitHub Pages — mohdfairuzmy2

Mesej *"There isn't a GitHub Pages site here"* bermakna **laman belum diterbitkan** pada:

`https://mohdfairuzmy2.github.io/Dashboard-Krisis/`

## Semak 3 perkara

| # | Perkara | Cara semak |
|---|---------|------------|
| 1 | Repo wujud | Buka https://github.com/mohdfairuzmy2/Dashboard-Krisis — tidak 404 |
| 2 | Kod ada di GitHub | Repo ada fail `.github/workflows/deploy-github-pages.yml` |
| 3 | Pages diaktifkan | Settings → Pages → Source: **GitHub Actions** + workflow ✅ hijau |

---

## Langkah 1 — Cipta repository (jika belum)

1. https://github.com/new  
2. Owner: **mohdfairuzmy2**  
3. Repository name: **`Dashboard-Krisis`** (tepat, dengan `-`)  
4. Visibility: **Public**  
5. Jangan tambah README / .gitignore  
6. **Create repository**

---

## Langkah 2 — Push kod dari Mac

```bash
cd "/Users/mohdfairuz/Desktop/Dashboard Krisis"

git remote remove origin 2>/dev/null
git remote add origin https://github.com/mohdfairuzmy2/Dashboard-Krisis.git

git push -u origin main
```

**Log masuk:** Username = `mohdfairuzmy2`, Password = **Personal Access Token**  
https://github.com/settings/tokens → Generate new token (classic) → scope **repo**

Selepas berjaya, refresh https://github.com/mohdfairuzmy2/Dashboard-Krisis — anda patut nampak semua fail.

---

## Langkah 3 — Aktifkan GitHub Pages

1. Repo → **Settings** → **Pages** (menu kiri)  
2. **Build and deployment**  
3. Source: pilih **GitHub Actions** (bukan Deploy from a branch)  
4. Tab **Actions** → workflow **Deploy GitHub Pages**  
5. Tunggu ✅ hijau (2–5 minit). Jika merah, klik run untuk log ralat.  
6. Kembali **Settings → Pages** — URL dipaparkan, contoh:  
   `https://mohdfairuzmy2.github.io/Dashboard-Krisis/`

**Jalankan manual sekali:** Actions → Deploy GitHub Pages → **Run workflow**

---

## URL akses (selepas berjaya)

| Halaman | URL |
|---------|-----|
| Utama | https://mohdfairuzmy2.github.io/Dashboard-Krisis/ |
| Bahan api | https://mohdfairuzmy2.github.io/Dashboard-Krisis/#/fuel |
| AI | https://mohdfairuzmy2.github.io/Dashboard-Krisis/#/ai |

Guna `#/` dalam URL (GitHub Pages + HashRouter).

---

## Masalah biasa

**`git push` ditolak**  
→ Token baharu dengan scope `repo`, atau pasang GitHub CLI: `brew install gh && gh auth login`

**Workflow gagal (merah)**  
→ Buka log job *build*; biasanya `npm ci` — hantar screenshot kepada pembangun.

**Repo nama lain** (contoh `dashboard-krisis`)  
→ URL menjadi `https://mohdfairuzmy2.github.io/<nama-repo>/`

**Repo Private**  
→ Pages percuma untuk repo **Public** sahaja (atau GitHub Pro).
