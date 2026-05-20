# Krisis Bekalan Global: Dashboard Malaysia

**Versi 1.0.0** (MAS Editorial) · [VERSION.md](./VERSION.md) · [CHANGELOG.md](./CHANGELOG.md)

Dashboard moden untuk memantau kesan krisis bekalan global ke atas Malaysia. Dibina oleh **GovTech Malaysia** berdasarkan data sebenar daripada [pantaukrisis.gov.my](https://pantaukrisis.gov.my/).

## Ciri-ciri

- **10 bahagian data** — Gambaran, Harga Bahan Api, IHP, Tenaga Global, Prestasi Ekonomi, FX, Dagangan Komoditi, Aliran Dagangan, Peta Dunia, Berita
- **Dwibahasa** — Bahasa Malaysia & English
- **Data langsung** — Supabase API (harga petrol, sentimen, OpenDOSM)
- **Reka bentuk moden** — Inspirasi dashboard ekonomi MAS EPG

## Sumber data

| Data | Sumber |
|------|--------|
| IHP, KDNK, IPI, Buruh | OpenDOSM (`fetch-dosm-data`) |
| Harga petrol Malaysia | data.gov.my (`fetch-fuel-prices`) |
| Harga serantau | globalpetrolprices.com (Supabase) |
| Brent/WTI, FX, KLCI | EIA, BNM, OpenDOSM |
| Dagangan petroleum | Statistik dagangan DOSM |
| Sentimen geopolitik | Analisis media harian |

## Jalankan secara tempatan

```bash
npm install
npm run dev
```

Buka http://localhost:5173

## Build untuk production

```bash
npm run build
npm run preview
```
