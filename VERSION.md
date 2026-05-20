# Krisis Bekalan Global: Dashboard Malaysia — Sejarah versi

## Versi semasa: **1.1.0** (`v1.1.0`)

**Kodename:** MAS Editorial · Full  
**Tarikh snapshot:** 20 Mei 2026  
**Git tag:** `v1.1.0`  
**Cawangan arkib:** `archive/v1.1.0-mas-editorial`

### Ringkasan v1.1.0

Snapshot penuh sebelum sebarang migrasi MYDS atau refactor besar. Termasuk pariti data pantaukrisis, layout responsif, sumber dikelompokkan, dan halaman AI strategik dengan Chatbase.

### Ciri tambahan berbanding v1.0.0

- Laman utama responsif (`page-shell`, grid eksekutif penuh lebar)
- Ringkasan eksekutif (dagangan petroleum + Brent/WTI langsung)
- Cerita AI pada kad papan pemuka (`cardInsights`)
- Halaman bahan api diperluas; API lanjutan (`api-extended`)
- `/geopolitical`, `/ai` — analisis AI penuh + embed Chatbase
- Sumber dikelompokkan (Malaysia / Antarabangsa / Portal / Lain-lain)
- Mod gelap, kawalan header, GovTech Malaysia
- Jenama: *Krisis Bekalan Global: Dashboard Malaysia*

### Modul

9 papan pemuka utama + Geopolitik + Pandangan AI (jumlah 11 laluan).

### Stack

React 19, Vite 8, TypeScript 6, Tailwind 4, Recharts 3, Leaflet, Supabase.

---

## Versi terdahulu: **1.0.0** (`v1.0.0`)

**Kodename:** MAS Editorial  
**Git tag:** `v1.0.0`  
**Commit:** `121a754` — Release v1.0.0: Pantau Krisis dashboard (MAS Editorial UI).

Rilis pertama: landing editorial, 9 papan pemuka, ilustrasi SVG, dwibahasa, data Supabase asas.

---

## Cara revert atau rujuk versi lama

Dalam folder projek, pastikan perubahan tempatan telah disimpan atau dibuang mengikut keperluan.

### Lihat kod pada tag tertentu (baca sahaja)

```bash
git fetch --tags   # jika dari remote
git checkout v1.1.0
```

### Kembali ke cawangan kerja terkini

```bash
git checkout main
```

### Cipta cawangan baru daripada snapshot (disyorkan untuk eksperimen)

```bash
# Dari v1.1.0 (versi penuh semasa)
git checkout -b restore-v1.1.0 v1.1.0

# Dari v1.0.0 (rilis editorial asal)
git checkout -b restore-v1.0.0 v1.0.0
```

### Bandingkan perbezaan antara versi

```bash
git diff v1.0.0..v1.1.0
git log v1.0.0..v1.1.0 --oneline
```

### Pulihkan fail tertentu daripada snapshot tanpa tukar cawangan

```bash
git checkout v1.1.0 -- src/pages/Overview.tsx
```

---

## Cara jalankan

```bash
npm install
npm run dev    # http://localhost:5173
npm run build  # output: dist/
```
