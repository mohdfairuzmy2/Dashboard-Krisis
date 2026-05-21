# 404 GitHub Pages — punca & penyelesaian

## Punca sebenar

Repositori **`mohdfairuzmy2/Dashboard-Krisis` belum wujud di GitHub** (kod belum pernah berjaya di-push).

Bukan masalah URL — laman memang belum diterbitkan.

---

## Semak sendiri (30 saat)

Buka: **https://github.com/mohdfairuzmy2/Dashboard-Krisis**

| Yang anda nampak | Maksud |
|------------------|--------|
| **404** | Repo belum dicipta → ikut langkah di bawah |
| Repo kosong “Quick setup” | Repo ada → perlu **push** + **Pages** |
| Repo penuh fail | Repo ada → perlu **Pages** + **Actions** hijau |

---

## A. Repo belum wujud (paling biasa)

### 1. Cipta repo (browser)

https://github.com/new

- Name: `Dashboard-Krisis`
- Public
- **Jangan** tick “Add a README”
- Create repository

### 2. Push kod (Terminal)

Token **baharu** (classic, scope **repo**): https://github.com/settings/tokens  
**Jangan** guna token lama yang pernah dikongsi dalam chat.

```bash
cd "/Users/mohdfairuz/Desktop/Dashboard Krisis"

git add -A
git commit -m "Add deploy scripts and GitHub Pages setup" 2>/dev/null || true

git push -u origin main
```

Username: `mohdfairuzmy2`  
Password: **token** `ghp_...`

### 3. Pages

Repo → **Settings** → **Pages** → Source: **GitHub Actions**

**Actions** → **Deploy GitHub Pages** → **Run workflow** → tunggu ✅

### 4. URL live

https://mohdfairuzmy2.github.io/Dashboard-Krisis/

---

## B. Repo sudah ada fail tetapi masih 404

1. **Settings → Pages** → Source mesti **GitHub Actions** (bukan “Deploy from branch” sahaja tanpa workflow)
2. **Actions** → buka run terakhir — jika **merah**, baca log
3. **Run workflow** sekali lagi pada branch `main`

---

## Keselamatan

- Token dalam `git remote` telah dibuang dari projek ini
- **Revoke** sebarang token yang pernah dihantar dalam chat
- Jangan paste token dalam mesej / screenshot
