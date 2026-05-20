export type DosmData = {
  cpi: {
    overallMonthly: { month: string; index: number; yoy: number; mom: number }[]
    categoryMonthly: { categoryId: string; month: string; index: number; yoy: number; mom: number }[]
    headlineVsCore: { month: string; headline: number; core: number }[]
  }
  gdp: {
    latest: string
    overall: number
    sectors: { name: string; value: number }[]
    quarterly: { quarter: string; value: number }[]
  }
  labour: {
    latest: string
    unemploymentRate: number
    lfpr: number
    employmentPopRatio: number
    unemployedPersons: number
    monthly: { month: string; rate: number }[]
  }
  ipi: {
    latest: string
    overall: number
    mining: number
    manufacturing: number
    electricity: number
    monthly: { month: string; overall: number; mining: number; manufacturing: number }[]
  }
}

export type FuelPricePoint = {
  date: string
  ron95: number
  ron97: number
  dieselEastMY: number
  dieselPeninsular: number
  ron95Unsubsidised: number | null
}

export type FuelMalaysia = {
  prev?: FuelPricePoint
  latest: FuelPricePoint & { ron95Unsubsidised: number }
  prices: FuelPricePoint[]
  ranges?: {
    ron95: { max: number; min: number; current: number }
    ron97: { max: number; min: number; current: number }
    ron95Unsub: { max: number; min: number; current: number }
    dieselEastMY: { max: number; min: number; current: number }
    dieselPeninsular: { max: number; min: number; current: number }
  }
  source?: string
  changes?: {
    ron97Change?: number
    dieselChange?: number
    ron95UnsubChange?: number
  }
  brentUSD?: number
  fetchedAt?: string
  weekValidity?: { from: string; to: string } | string
}

export type RegionalFuel = {
  country: string
  gasoline_myr: number
  diesel_myr: number
  fetched_at: string
}

export type DailySentiment = {
  date: string
  positive: number
  neutral: number
  negative: number
  risk_level: string
  source_count: number
}

export type MarketPoint = {
  date: string
  klci: number | null
  usdMyr: number | null
  sgdMyr: number | null
  eurMyr: number | null
  cnyMyr: number | null
  gbpMyr: number | null
  wti: number | null
  brent: number | null
}

export type TradePartner = {
  product: string
  trade: 'EXPORTS' | 'IMPORTS'
  country: string
  totalValue: number
}

export type CommodityTradeRow = {
  product: string
  trade: string
  month: string
  value: number
  quantity: number
  aup: number
}

export type GeoTrendBlock = {
  title: string
  trend?: string
  detail: string
}

export type GeoIssueBlock = {
  title: string
  detail: string
  severity?: string
}

export type GeoRecommendation = {
  title: string
  detail: string
  impact?: string
  timeline?: string
}

export type GeoEvent = {
  date: string
  desc: string
  link?: string
  title?: string
  impact?: string
  source?: string
  sentiment?: string
}

export type GeoTradeData = {
  dataYear?: string
  totalExportsRM?: number
  totalImportsRM?: number
  tradeBalanceRM?: number
  vulnerabilityNote?: string
  dailyImportBarrels?: number
  oilPriceSensitivity?: string
  importDependencyRatio?: number
  supplyDisruptionRiskPct?: number
  oilPriceSensitivityDetail?: string
}

export type GeopoliticalAnalysis = {
  riskLevel?: string
  riskTitle?: string
  whatIsHappening?: string | GeoTrendBlock[]
  whatIsWrong?: string | GeoIssueBlock[]
  recommendations?: string[] | GeoRecommendation[]
  events?: GeoEvent[]
  tradeData?: GeoTradeData
  timelineSummary?: string
  headlineCount?: number
  generatedAt?: string
}

export const CPI_CATEGORIES: Record<string, { en: string; ms: string }> = {
  food: { en: 'Food & Beverages', ms: 'Makanan & Minuman' },
  alcohol: { en: 'Alcohol & Tobacco', ms: 'Arak & Tembakau' },
  clothing: { en: 'Clothing & Footwear', ms: 'Pakaian & Kasut' },
  housing: { en: 'Housing & Utilities', ms: 'Perumahan & Utiliti' },
  furnishing: { en: 'Furnishings', ms: 'Perabot' },
  health: { en: 'Health', ms: 'Kesihatan' },
  transport: { en: 'Transport', ms: 'Pengangkutan' },
  communication: { en: 'Communication', ms: 'Komunikasi' },
  recreation: { en: 'Recreation', ms: 'Rekreasi' },
  education: { en: 'Education', ms: 'Pendidikan' },
  restaurant: { en: 'Restaurants', ms: 'Restoran' },
  insurance: { en: 'Insurance & Finance', ms: 'Insurans & Kewangan' },
  personal: { en: 'Personal Care', ms: 'Penjagaan Diri' },
}

export const PRODUCT_LABELS: Record<string, { en: string; ms: string }> = {
  LNG: { en: 'LNG', ms: 'LNG' },
  'CRUDE OIL': { en: 'Crude Oil', ms: 'Petroleum Mentah' },
  'REFINED PETROLEUM': { en: 'Refined Petroleum', ms: 'Petroleum Ditapis' },
  'Crude Oil': { en: 'Crude Oil', ms: 'Petroleum Mentah' },
}
