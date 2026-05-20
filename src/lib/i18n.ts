import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { createElement } from 'react'

export type Lang = 'ms' | 'en'

const translations: Record<string, { en: string; ms: string }> = {
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
  'section.overview.title': { en: 'Executive Overview', ms: 'Gambaran Eksekutif' },
  'section.overview.subtitle': {
    en: 'Real-time KPIs and trade performance summary',
    ms: 'Ringkasan KPI dan prestasi dagangan masa nyata',
  },
  'section.fuel.title': { en: 'Malaysia Fuel Prices', ms: 'Harga Bahan Api Malaysia' },
  'section.fuel.subtitle': {
    en: 'BUDI MADANI subsidies, RON95/97/Diesel trends & regional comparison',
    ms: 'Subsidi BUDI MADANI, trend RON95/97/Diesel & perbandingan serantau',
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
  'hero.lead': {
    en: 'Nine dashboards on fuel, inflation, trade, energy and the economy — built from official DOSM and Ministry of Economy data. Each card links to live charts you can understand at a glance.',
    ms: 'Sembilan papan pemuka tentang bahan api, inflasi, dagangan, tenaga dan ekonomi — dibina daripada data rasmi DOSM dan Kementerian Ekonomi. Setiap kad membawa anda ke carta langsung yang mudah difahami.',
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
  'app.source': { en: 'Source', ms: 'Sumber' },
  'app.loading': { en: 'Loading data…', ms: 'Memuatkan data…' },
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
