/** Pautan rasmi & sumber data — selaras pantaukrisis.gov.my */

export type SourceGroupId = 'ms-gov' | 'intl' | 'portal' | 'other'

export type SourceLink = {
  id: string
  group: SourceGroupId
  name: { en: string; ms: string }
  url: string
}

export const OFFICIAL_SITE = 'https://pantaukrisis.gov.my/'

export const SOURCE_GROUP_ORDER: SourceGroupId[] = ['ms-gov', 'intl', 'portal', 'other']

export const SOURCE_GROUP_LABELS: Record<SourceGroupId, { en: string; ms: string }> = {
  'ms-gov': { en: 'Malaysia', ms: 'Malaysia' },
  intl: { en: 'International', ms: 'Antarabangsa' },
  portal: { en: 'Official portal', ms: 'Portal rasmi' },
  other: { en: 'Other', ms: 'Lain-lain' },
}

export const SOURCE_LINKS: SourceLink[] = [
  { id: 'dosm', group: 'ms-gov', name: { en: 'DOSM', ms: 'DOSM' }, url: 'https://www.dosm.gov.my/' },
  { id: 'opendosm', group: 'ms-gov', name: { en: 'OpenDOSM', ms: 'OpenDOSM' }, url: 'https://open.dosm.gov.my/' },
  {
    id: 'opendosm-fx',
    group: 'ms-gov',
    name: { en: 'Exchange rates', ms: 'Kadar pertukaran' },
    url: 'https://open.dosm.gov.my/dashboard/exchange-rates',
  },
  {
    id: 'pricecatcher',
    group: 'ms-gov',
    name: { en: 'PriceCatcher', ms: 'PriceCatcher' },
    url: 'https://open.dosm.gov.my/data-catalogue/pricecatcher',
  },
  { id: 'datagov', group: 'ms-gov', name: { en: 'data.gov.my', ms: 'data.gov.my' }, url: 'https://data.gov.my/' },
  {
    id: 'datagov-fuel',
    group: 'ms-gov',
    name: { en: 'Fuel prices', ms: 'Harga bahan api' },
    url: 'https://data.gov.my/data-catalogue/fuelprice',
  },
  {
    id: 'datagov-transport',
    group: 'ms-gov',
    name: { en: 'Public transport', ms: 'Pengangkutan awam' },
    url: 'https://data.gov.my/dashboard/public-transportation',
  },
  {
    id: 'ekonomi',
    group: 'ms-gov',
    name: { en: 'Ministry of Economy', ms: 'Kementerian Ekonomi' },
    url: 'https://ekonomi.gov.my/ms',
  },
  { id: 'bnm', group: 'ms-gov', name: { en: 'BNM', ms: 'BNM' }, url: 'https://www.bnm.gov.my/' },
  {
    id: 'bnm-fx',
    group: 'ms-gov',
    name: { en: 'Currency converter', ms: 'Penukar mata wang' },
    url: 'https://www.bnm.gov.my/currency-converter',
  },
  { id: 'kpdn', group: 'ms-gov', name: { en: 'KPDN', ms: 'KPDN' }, url: 'https://www.kpdn.gov.my/ms/' },
  {
    id: 'perkeso',
    group: 'ms-gov',
    name: { en: 'PERKESO · LOE stats', ms: 'PERKESO · Statistik LOE' },
    url: 'https://lmx.perkeso.gov.my/statistic-details/?st_mtd_uuid=5ad36960-71c7-45d0-a8a6-07a33b42afd9',
  },
  {
    id: 'dosm-mining',
    group: 'ms-gov',
    name: { en: 'Mining & quarrying Q4 2025', ms: 'Perlombongan & kuari S4 2025' },
    url: 'https://storage.dosm.gov.my/mining/mining_png_2025-q4.pdf',
  },
  { id: 'eia', group: 'intl', name: { en: 'U.S. EIA', ms: 'EIA' }, url: 'https://www.eia.gov/' },
  {
    id: 'eia-petroleum',
    group: 'intl',
    name: { en: 'Petroleum data', ms: 'Data petroleum' },
    url: 'https://www.eia.gov/petroleum/data.php',
  },
  {
    id: 'eia-chokepoints',
    group: 'intl',
    name: { en: 'Oil transit chokepoints', ms: 'Pintasan transit minyak' },
    url: 'https://www.eia.gov/international/analysis/special-topics/World_Oil_Transit_Chokepoints',
  },
  {
    id: 'globalpetrol',
    group: 'intl',
    name: { en: 'Global Petrol Prices', ms: 'Global Petrol Prices' },
    url: 'https://www.globalpetrolprices.com/',
  },
  { id: 'portwatch', group: 'intl', name: { en: 'IMF PortWatch', ms: 'IMF PortWatch' }, url: 'https://portwatch.imf.org/' },
  {
    id: 'worldbank-cmo',
    group: 'intl',
    name: { en: 'World Bank · Commodities', ms: 'Bank Dunia · Komoditi' },
    url: 'https://www.worldbank.org/en/research/commodity-markets',
  },
  {
    id: 'unctad',
    group: 'intl',
    name: { en: 'UNCTAD · Trade disruptions', ms: 'UNCTAD · Gangguan dagangan' },
    url: 'https://unctad.org/news/red-sea-black-sea-and-panama-canal-unctad-raises-alarm-global-trade-disruptions',
  },
  {
    id: 'pantau-main',
    group: 'portal',
    name: { en: 'pantaukrisis.gov.my', ms: 'pantaukrisis.gov.my' },
    url: OFFICIAL_SITE,
  },
  {
    id: 'pantau-fuel',
    group: 'portal',
    name: { en: 'Fuel dashboard', ms: 'Papan bahan api' },
    url: 'https://pantaukrisis.gov.my/fuel',
  },
  {
    id: 'pantau-geo',
    group: 'portal',
    name: { en: 'Geopolitical', ms: 'Geopolitik' },
    url: 'https://pantaukrisis.gov.my/geopolitical',
  },
  {
    id: 'pantau-ai',
    group: 'portal',
    name: { en: 'AI insights', ms: 'Analitik AI' },
    url: 'https://pantaukrisis.gov.my/ai',
  },
  {
    id: 'feedback',
    group: 'other',
    name: { en: 'Feedback form', ms: 'Borang maklum balas' },
    url: 'https://docs.google.com/forms/d/e/1FAIpQLSdT5ugSI_tFH7kMGYPQlo8EeAO7_niZtxIX3tpYNmgJ2Ox64g/viewform',
  },
]

export type PageSourceId =
  | 'overview'
  | 'fuel'
  | 'cpi'
  | 'energy'
  | 'gdp'
  | 'market'
  | 'commodities'
  | 'tradeflow'
  | 'map'
  | 'news'
  | 'geopolitical'
  | 'ai'

/** Pautan yang dipaparkan pada setiap halaman (ikut pantaukrisis.gov.my) */
export const PAGE_SOURCE_IDS: Record<PageSourceId, string[]> = {
  overview: ['dosm', 'opendosm', 'datagov', 'eia', 'bnm', 'pantau-fuel', 'feedback'],
  fuel: ['datagov-fuel', 'datagov', 'kpdn', 'globalpetrol', 'eia', 'pantau-fuel'],
  cpi: ['dosm', 'opendosm', 'pricecatcher', 'datagov'],
  energy: ['eia', 'eia-petroleum', 'eia-chokepoints', 'portwatch', 'worldbank-cmo'],
  gdp: ['dosm', 'opendosm', 'perkeso', 'dosm-mining', 'datagov-transport'],
  market: ['bnm', 'bnm-fx', 'opendosm-fx', 'opendosm'],
  commodities: ['dosm', 'worldbank-cmo', 'datagov'],
  tradeflow: ['dosm', 'portwatch', 'eia-chokepoints', 'unctad'],
  map: ['dosm', 'datagov'],
  news: ['pantau-geo', 'feedback'],
  geopolitical: ['pantau-geo', 'unctad', 'eia-chokepoints'],
  ai: ['pantau-ai', 'feedback'],
}

export function getPageSources(page: PageSourceId): SourceLink[] {
  const ids = PAGE_SOURCE_IDS[page] ?? []
  return ids
    .map((id) => SOURCE_LINKS.find((l) => l.id === id))
    .filter((l): l is SourceLink => l != null)
}

export type GroupedSources = {
  group: SourceGroupId
  links: SourceLink[]
}

export function groupSources(links: SourceLink[]): GroupedSources[] {
  const byGroup = new Map<SourceGroupId, SourceLink[]>()
  for (const link of links) {
    const list = byGroup.get(link.group) ?? []
    list.push(link)
    byGroup.set(link.group, list)
  }
  return SOURCE_GROUP_ORDER.filter((g) => byGroup.has(g)).map((group) => ({
    group,
    links: byGroup.get(group)!,
  }))
}
