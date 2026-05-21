import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { createElement } from 'react'

export type Lang = 'ms' | 'en'

const translations: Record<string, { en: string; ms: string }> = {
  'app.name': {
    en: 'Global Supply Crisis: Malaysia Dashboard',
    ms: 'Krisis Bekalan Global: Dashboard Malaysia',
  },
  'nav.overview.label': { en: 'Overview', ms: 'Gambaran' },
  'nav.overview.desc': {
    en: 'Executive summary of crisis indicators',
    ms: 'Ringkasan eksekutif penunjuk krisis',
  },
  'nav.fuel.label': { en: 'Fuel Prices', ms: 'Harga Bahan Api' },
  'nav.fuel.desc': { en: 'Petrol prices & subsidy analysis', ms: 'Harga petrol & analisis subsidi' },
  'nav.cpi.label': { en: 'Consumer Price', ms: 'Harga Pengguna' },
  'nav.cpi.desc': { en: 'Consumer Price Index & inflation', ms: 'Indeks Harga Pengguna & inflasi' },
  'nav.energy.label': { en: 'Commodity Prices', ms: 'Harga Komoditi' },
  'nav.energy.desc': { en: 'Petroleum & gas spot prices (EIA)', ms: 'Harga spot petroleum & gas (EIA)' },
  'nav.gdp.label': { en: 'Economic Performance', ms: 'Prestasi Ekonomi' },
  'nav.gdp.desc': { en: 'GDP sectors, IPI & labour market', ms: 'Sektor KDNK, IPI & pasaran buruh' },
  'nav.market.label': { en: 'Currency & FX', ms: 'Mata Wang & FX' },
  'nav.market.desc': { en: 'MYR exchange rates & FX trends', ms: 'Kadar pertukaran MYR & trend FX' },
  'nav.commodities.label': { en: 'Commodity Trade', ms: 'Dagangan Komoditi' },
  'nav.commodities.desc': { en: 'LNG, crude & refined petroleum', ms: 'LNG, petroleum mentah & ditapis' },
  'nav.tradeflow.label': { en: 'Trade Flow', ms: 'Aliran Dagangan' },
  'nav.tradeflow.desc': { en: 'Import/export flow visualization', ms: 'Visualisasi aliran import/eksport' },
  'nav.map.label': { en: 'World Map', ms: 'Peta Dunia' },
  'nav.map.desc': { en: 'Global trade partner distribution', ms: 'Taburan rakan dagangan global' },
  'nav.news.label': { en: 'News Feed', ms: 'Suapan Berita' },
  'nav.news.desc': { en: 'Live media & geopolitical news', ms: 'Berita media langsung & geopolitik' },
  'nav.geopolitical.label': { en: 'Geopolitical Risk', ms: 'Risiko Geopolitik' },
  'nav.geopolitical.desc': { en: 'AI risk analysis & live alerts', ms: 'Analisis risiko AI & amaran langsung' },
  'nav.ai.label': { en: 'AI Insights', ms: 'Pandangan AI' },
  'nav.ai.desc': { en: 'Strategic AI summaries', ms: 'Ringkasan strategik AI' },
  'section.geopolitical.title': {
    en: 'Geopolitical Risk Monitor',
    ms: 'Pemantau Risiko Geopolitik',
  },
  'section.geopolitical.subtitle': {
    en: 'AI-powered risk assessment, sentiment tracking and live news headlines',
    ms: 'Penilaian risiko berkuasa AI, sentimen berita dan tajuk utama langsung',
  },
  'section.ai.title': { en: 'AI Strategic Insights', ms: 'Pandangan Strategik AI' },
  'section.ai.subtitle': {
    en: 'Automated narrative on supply-chain and geopolitical developments affecting Malaysia',
    ms: 'Naratif automatik tentang perkembangan rantaian bekalan dan geopolitik yang mempengaruhi Malaysia',
  },
  'overview.more': { en: 'Additional dashboards', ms: 'Papan pemuka tambahan' },
  'section.overview.title': { en: 'Executive Overview', ms: 'Gambaran Eksekutif' },
  'section.overview.subtitle': {
    en: 'Real-time KPIs and trade performance summary',
    ms: 'Ringkasan KPI dan prestasi dagangan masa nyata',
  },
  'section.fuel.title': { en: 'Malaysia Fuel Prices', ms: 'Harga Bahan Api Malaysia' },
  'section.fuel.subtitle': {
    en: 'BUDI MADANI targeted subsidies, RON95/97/Diesel trends, and Sabah/Sarawak analysis',
    ms: 'Subsidi bersasar BUDI MADANI, trend RON95/97/Diesel, dan analisis Sabah/Sarawak',
  },
  'fuel.weekValidity': { en: 'Valid for', ms: 'Sah untuk' },
  'fuel.updated': { en: 'Updated', ms: 'Dikemas kini' },
  'fuel.source': { en: 'Source', ms: 'Sumber' },
  'fuel.budiNote': {
    en: 'RON95 market float began Oct 2025 under BUDI95 · Prices are set weekly.',
    ms: 'Apungan pasaran RON95 bermula Okt 2025 di bawah BUDI95 · Harga ditetapkan secara mingguan.',
  },
  'fuel.priceComparison': { en: 'Weekly price comparison', ms: 'Perbandingan harga mingguan' },
  'fuel.product': { en: 'Product', ms: 'Produk' },
  'fuel.thisWeek': { en: 'This week', ms: 'Minggu ini' },
  'fuel.prevWeek': { en: 'Previous week', ms: 'Minggu lepas' },
  'fuel.change': { en: 'Change', ms: 'Perubahan' },
  'fuel.subsidyGap': { en: 'RON95 subsidy gap', ms: 'Jurang subsidi RON95' },
  'fuel.subsidyGapDesc': {
    en: 'Difference between market (unsubsidised) and pump price under BUDI MADANI.',
    ms: 'Perbezaan antara harga pasaran (tanpa subsidi) dan harga pam di bawah BUDI MADANI.',
  },
  'fuel.dieselCompare': {
    en: 'Diesel: Peninsular Malaysia vs Sabah & Sarawak (RM/L)',
    ms: 'Diesel: Semenanjung Malaysia vs Sabah & Sarawak (RM/L)',
  },
  'fuel.historicalRange': { en: 'Historical range (weekly series)', ms: 'Julat sejarah (siri mingguan)' },
  'fuel.min': { en: 'Low', ms: 'Terendah' },
  'fuel.max': { en: 'High', ms: 'Tertinggi' },
  'fuel.brent': { en: 'Brent crude (spot)', ms: 'Brent mentah (spot)' },
  'fuel.officialLink': { en: 'View on pantaukrisis.gov.my', ms: 'Lihat di pantaukrisis.gov.my' },
  'fuel.ron95Budi': { en: 'BUDI95 (RON95)', ms: 'BUDI95 (RON95)' },
  'fuel.dieselEast': { en: 'Diesel (Sabah & Sarawak)', ms: 'Diesel (Sabah & Sarawak)' },
  'fuel.marketRon95': { en: 'Market RON95 (unsubsidised)', ms: 'Pasaran RON95 (tanpa subsidi)' },
  'fuel.asiaNote': {
    en: 'Prices converted to MYR via live FX; Malaysia uses official MYR prices from data.gov.my.',
    ms: 'Harga ditukar kepada MYR melalui FX langsung; Malaysia menggunakan harga rasmi MYR daripada data.gov.my.',
  },
  'section.cpi.title': { en: 'Consumer Price Index (CPI)', ms: 'Indeks Harga Pengguna (IHP)' },
  'section.cpi.subtitle': {
    en: 'Inflation tracking across 13 categories — data from OpenDOSM',
    ms: 'Pemantauan inflasi merentasi 13 kategori — data daripada OpenDOSM',
  },
  'section.energy.title': { en: 'Global Energy Prices', ms: 'Harga Tenaga Global' },
  'section.energy.subtitle': {
    en: 'Petroleum & natural gas spot prices — sourced from U.S. EIA',
    ms: 'Harga spot petroleum & gas asli — sumber daripada U.S. EIA',
  },
  'section.gdp.title': { en: 'Economic Performance', ms: 'Prestasi Ekonomi' },
  'section.gdp.subtitle': {
    en: 'GDP by economic activity, IPI and labour market indicators',
    ms: 'KDNK mengikut aktiviti ekonomi, IPI dan penunjuk pasaran buruh',
  },
  'section.market.title': { en: 'Currency & FX Rates', ms: 'Kadar Mata Wang & FX' },
  'section.market.subtitle': {
    en: 'MYR exchange rates and market indices',
    ms: 'Kadar pertukaran MYR dan indeks pasaran',
  },
  'section.commodities.title': { en: 'Commodity Analytics', ms: 'Analitik Komoditi' },
  'section.commodities.subtitle': {
    en: 'LNG, Crude & Refined Petroleum trade patterns',
    ms: 'Corak dagangan LNG, Petroleum Mentah & Petroleum Ditapis',
  },
  'section.tradeflow.title': { en: 'Trade Flow Analysis', ms: 'Analisis Aliran Dagangan' },
  'section.tradeflow.subtitle': {
    en: 'Import/export flows between Malaysia and trading partners',
    ms: 'Aliran import/eksport antara Malaysia dan rakan dagangan',
  },
  'section.map.title': { en: 'Global Trade Partners', ms: 'Rakan Dagangan Global' },
  'section.map.subtitle': {
    en: 'Geographic distribution of petroleum trade volume',
    ms: 'Taburan geografi jumlah dagangan petroleum',
  },
  'section.news.title': { en: 'News Feed', ms: 'Suapan Berita' },
  'section.news.subtitle': {
    en: 'Geopolitical sentiment and crisis headlines',
    ms: 'Sentimen geopolitik dan tajuk berita krisis',
  },
  'hero.eyebrow': {
    en: 'Public data for Malaysia',
    ms: 'Data awam untuk Malaysia',
  },
  'hero.title': {
    en: 'Crisis dashboards, _for every Malaysian_.',
    ms: 'Papan pemuka krisis, _untuk semua rakyat_.',
  },
  'hero.subtitle': {
    en: 'Monitoring the Impact of the Global Supply Crisis on Malaysia',
    ms: 'Memantau Kesan Krisis Bekalan Global ke atas Malaysia',
  },
  'hero.lead': {
    en: 'A near real-time dashboard that helps government, businesses and the public track how global energy prices, trade disruptions and supply chain pressures may affect Malaysia\'s economy, fuel prices and cost of living.\n\nUpdated regularly to support early action, supply stability and informed decision-making during periods of global uncertainty. Nine dashboards on fuel, inflation, trade, energy and the economy — built by GovTech Malaysia from official open data. Each card links to live charts you can understand at a glance.',
    ms: 'Papan pemuka hampir masa nyata yang membantu kerajaan, perniagaan dan orang awam memantau bagaimana harga tenaga global, gangguan dagangan dan tekanan rantaian bekalan boleh mempengaruhi ekonomi Malaysia, harga bahan api dan kos sara hidup.\n\nDikemas kini secara berkala untuk menyokong tindakan awal, kestabilan bekalan dan membuat keputusan bermaklumat semasa ketidakpastian global. Sembilan papan pemuka tentang bahan api, inflasi, dagangan, tenaga dan ekonomi — dibina oleh GovTech Malaysia daripada data terbuka rasmi. Setiap kad membawa anda ke carta langsung yang mudah difahami.',
  },
  'hero.stat.dashboards': { en: 'dashboards', ms: 'papan pemuka' },
  'hero.stat.sources': { en: 'official sources', ms: 'sumber rasmi' },
  'hero.stat.realtime': { en: 'near real-time', ms: 'hampir masa nyata' },
  'card.fuel.category': { en: 'Prices · Fuel', ms: 'Harga · Bahan Api' },
  'card.fuel.desc': {
    en: 'Weekly RON95, RON97 and diesel prices under BUDI MADANI, plus Asia regional comparison and subsidy gap analysis.',
    ms: 'Harga mingguan RON95, RON97 dan diesel di bawah BUDI MADANI, serta perbandingan serantau Asia dan analisis jurang subsidi.',
  },
  'card.cpi.category': { en: 'Prices · Inflation', ms: 'Harga · Inflasi' },
  'card.cpi.desc': {
    en: 'Headline and category inflation from OpenDOSM — track how the cost of food, transport and housing is changing month by month.',
    ms: 'Inflasi utama dan mengikut kategori daripada OpenDOSM — pantau perubahan kos makanan, pengangkutan dan perumahan setiap bulan.',
  },
  'card.energy.category': { en: 'Energy · Spot', ms: 'Tenaga · Spot' },
  'card.energy.desc': {
    en: 'Brent and WTI crude oil spot prices from the U.S. EIA — see how global oil shocks flow through to pump prices in Malaysia.',
    ms: 'Harga spot minyak mentah Brent dan WTI daripada EIA AS — lihat bagaimana kejutan minyak global mempengaruhi harga pam di Malaysia.',
  },
  'card.gdp.category': { en: 'Economy · Growth', ms: 'Ekonomi · Pertumbuhan' },
  'card.gdp.desc': {
    en: 'GDP by sector, industrial production and unemployment — the macro picture when supply chains squeeze the economy.',
    ms: 'KDNK mengikut sektor, pengeluaran perindustrian dan pengangguran — gambaran makro apabila rantaian bekalan mengetatkan ekonomi.',
  },
  'card.market.category': { en: 'Markets · FX', ms: 'Pasaran · FX' },
  'card.market.desc': {
    en: 'MYR against USD, SGD, EUR and CNY, plus the FTSE KLCI — currency moves matter when imports are priced in foreign exchange.',
    ms: 'MYR berbanding USD, SGD, EUR dan CNY, serta FTSE KLCI — pergerakan mata wang penting apabila import dinilai dalam forex.',
  },
  'card.commodities.category': { en: 'Trade · Commodities', ms: 'Dagangan · Komoditi' },
  'card.commodities.desc': {
    en: 'Monthly LNG, crude and refined petroleum trade — exports, imports and balance in one place.',
    ms: 'Dagangan bulanan LNG, petroleum mentah dan ditapis — eksport, import dan imbangan dalam satu paparan.',
  },
  'card.tradeflow.category': { en: 'Trade · Flows', ms: 'Dagangan · Aliran' },
  'card.tradeflow.desc': {
    en: 'Top trading partners for each petroleum product — who Malaysia sells to and buys from, ranked by value.',
    ms: 'Rakan dagangan utama setiap produk petroleum — negara yang Malaysia eksport dan import, mengikut nilai.',
  },
  'card.map.category': { en: 'Trade · Geography', ms: 'Dagangan · Geografi' },
  'card.map.desc': {
    en: 'Interactive map of petroleum trade partners — tap a country to see its share of Malaysia’s export or import flows.',
    ms: 'Peta interaktif rakan dagangan petroleum — klik negara untuk lihat bahagian aliran eksport atau import Malaysia.',
  },
  'card.news.category': { en: 'News · Geopolitics', ms: 'Berita · Geopolitik' },
  'card.news.desc': {
    en: 'Daily sentiment from hundreds of news sources, plus AI summaries of geopolitical risk and crisis headlines.',
    ms: 'Sentimen harian daripada ratusan sumber berita, serta ringkasan AI risiko geopolitik dan tajuk krisis.',
  },
  'app.tagline': {
    en: 'Monitoring the impact of the global supply crisis on Malaysia',
    ms: 'Memantau kesan krisis bekalan global ke atas Malaysia',
  },
  'app.dataAsOf': { en: 'Data as of', ms: 'Data setakat' },
  'app.source': { en: 'Sources', ms: 'Sumber' },
  'app.source.desc': {
    en: 'Official data providers referenced across this dashboard.',
    ms: 'Penyedia data rasmi yang dirujuk dalam papan pemuka ini.',
  },
  'app.loading': { en: 'Loading data…', ms: 'Memuatkan data…' },
  'theme.toDark': { en: 'Switch to dark mode', ms: 'Tukar ke mod gelap' },
  'theme.toLight': { en: 'Switch to light mode', ms: 'Tukar ke mod cerah' },
  'card.aiBadge': { en: 'AI insight', ms: 'Pandangan AI' },
  'card.aiLoading': { en: 'Analysing latest data…', ms: 'Menganalisis data terkini…' },
  'card.aiUnavailable': {
    en: 'Live summary unavailable. Open the dashboard for full charts.',
    ms: 'Ringkasan langsung tidak tersedia. Buka papan pemuka untuk carta penuh.',
  },
  'app.error': { en: 'Unable to load data', ms: 'Tidak dapat memuatkan data' },
  'kpi.headlineCpi': { en: 'Headline CPI (YoY)', ms: 'IHP Utama (YoY)' },
  'kpi.unemployment': { en: 'Unemployment Rate', ms: 'Kadar Pengangguran' },
  'kpi.gdpGrowth': { en: 'GDP Growth (YoY)', ms: 'Kadar Pertumbuhan KDNK' },
  'kpi.brent': { en: 'Brent Crude', ms: 'Minyak Mentah Brent' },
  'kpi.risk': { en: 'Geopolitical Risk', ms: 'Risiko Geopolitik' },
  'kpi.tradeBalance': { en: 'Petroleum Trade', ms: 'Dagangan Petroleum' },
  'common.exports': { en: 'Exports', ms: 'Eksport' },
  'common.imports': { en: 'Imports', ms: 'Import' },
  'common.latest': { en: 'Latest', ms: 'Terkini' },
  'common.subsidised': { en: 'Subsidised', ms: 'Bersubsidi' },
  'common.market': { en: 'Market price', ms: 'Harga pasaran' },
}

export function t(key: string, lang: Lang): string {
  return translations[key]?.[lang] ?? key
}

type I18nContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  tr: (key: string) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('ms')
  const tr = useCallback((key: string) => t(key, lang), [lang])
  return createElement(I18nContext.Provider, { value: { lang, setLang, tr } }, children)
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}

export const NAV_ITEMS = [
  { key: 'nav.overview.label', descKey: 'nav.overview.desc', path: '/' },
  { key: 'nav.fuel.label', descKey: 'nav.fuel.desc', path: '/fuel' },
  { key: 'nav.cpi.label', descKey: 'nav.cpi.desc', path: '/cpi' },
  { key: 'nav.energy.label', descKey: 'nav.energy.desc', path: '/global-commodities' },
  { key: 'nav.gdp.label', descKey: 'nav.gdp.desc', path: '/gdp' },
  { key: 'nav.market.label', descKey: 'nav.market.desc', path: '/market' },
  { key: 'nav.commodities.label', descKey: 'nav.commodities.desc', path: '/commodities' },
  { key: 'nav.tradeflow.label', descKey: 'nav.tradeflow.desc', path: '/tradeflow' },
  { key: 'nav.map.label', descKey: 'nav.map.desc', path: '/map' },
  { key: 'nav.news.label', descKey: 'nav.news.desc', path: '/news' },
] as const
