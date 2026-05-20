# Pantau Krisis Dashboard — Versi 1.0.0

**Kodename:** MAS Editorial  
**Tarikh rilis:** 20 Mei 2026  
**Status:** Rilis pertama (prototaip reka bentuk semula)

## Ringkasan

Dashboard awam untuk memantau kesan krisis bekalan global ke atas Malaysia, dengan antara muka editorial diinspirasikan [MAS EPG Economic Dashboards](https://mas-epg-econtech.github.io/). Data diambil daripada sumber yang sama dengan [pantaukrisis.gov.my](https://pantaukrisis.gov.my/) (bukan keluaran rasmi kerajaan).

## Modul (9 papan pemuka)

1. Harga Bahan Api — data.gov.my, perbandingan serantau  
2. Indeks Harga Pengguna — OpenDOSM  
3. Harga Tenaga Global — EIA (Brent/WTI)  
4. Prestasi Ekonomi — KDNK, IPI, pengangguran  
5. Mata Wang & FX — BNM / OpenDOSM  
6. Dagangan Komoditi — petroleum, LNG  
7. Aliran Dagangan — rakan dagangan  
8. Peta Dunia — taburan geografi  
9. Suapan Berita — sentimen geopolitik  

## Ciri reka bentuk v1.0.0

- Latar krim (#f9f8f3), tipografi Playfair Display + Source Sans 3  
- Landing grid kad dengan ilustrasi SVG  
- Dwibahasa BM / EN  
- Data langsung: Supabase + edge functions DOSM  

## Stack

- React 19, Vite 8, TypeScript 6, Tailwind 4, Recharts 3, Leaflet  

## Cara jalankan

```bash
npm install
npm run dev    # http://localhost:5173
npm run build  # output: dist/
```
