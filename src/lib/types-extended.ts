/** Types for live Supabase edge functions (pantaukrisis.gov.my parity) */

export type OilPrices = {
  brent: number
  wti: number
  source?: string
  fetchedAt?: string
}

export type FxRatePoint = {
  rate: number
  time?: string
  change?: number
  history?: { date: string; value: number }[]
}

export type CurrencyRates = {
  rates: Record<string, FxRatePoint>
  klci?: { value: number; change?: number; history?: { date: string; value: number }[] }
  source?: string
  fetchedAt?: string
}

export type CommoditySpot = {
  price: number
  prevClose?: number
  change?: number
  changePercent?: number
}

export type MineralFuelTradeMonth = {
  date: string
  exports: number
  imports: number
  balance: number
}

export type CommodityData = {
  prices: Record<string, CommoditySpot>
  mineralFuelsTrade: MineralFuelTradeMonth[]
  source?: string
  fetchedAt?: string
}

export type RssItem = {
  title: string
  link: string
  pubDate?: string
  source?: string
  image?: string
  score?: number
}

export type RtmItem = {
  title: string
  link: string
  publishedAt?: string
  channel?: string
  thumbnail?: string
}

export type RidershipRow = {
  month?: string
  mode?: string
  ridership?: number
  [key: string]: unknown
}

export type RegionalFuelCountry = {
  country: string
  gasoline_myr: number
  diesel_myr: number
  gasoline_usd?: number
  diesel_usd?: number
}

export type RegionalFuelResponse = {
  countries: RegionalFuelCountry[]
  usdMyr?: number
  source?: string
  fetchedAt?: string
}
