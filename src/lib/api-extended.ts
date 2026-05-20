import { FUNCTIONS_URL, supabase } from './supabase'
import type {
  CommodityData,
  CurrencyRates,
  OilPrices,
  RegionalFuelResponse,
  RidershipRow,
  RssItem,
  RtmItem,
} from './types-extended'

const headers = {
  apikey:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5Y3FtY3J0Z3lqc2dlbmZxcmZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2OTI2MzAsImV4cCI6MjA5MDI2ODYzMH0.32JuXVVwwZgfx3WQvowZ94gyvsaz_d7gKSo4Egjvpzo',
  Authorization:
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5Y3FtY3J0Z3lqc2dlbmZxcmZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2OTI2MzAsImV4cCI6MjA5MDI2ODYzMH0.32JuXVVwwZgfx3WQvowZ94gyvsaz_d7gKSo4Egjvpzo',
  'Content-Type': 'application/json',
}

async function fetchEdge<T>(name: string, body: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch(`${FUNCTIONS_URL}/${name}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`${name}: ${res.status}`)
  return res.json()
}

export async function fetchOilPrices(): Promise<OilPrices> {
  return fetchEdge<OilPrices>('fetch-oil-prices')
}

export async function fetchCurrencyRates(): Promise<CurrencyRates> {
  return fetchEdge<CurrencyRates>('fetch-currency-rates')
}

export async function fetchCommodityData(): Promise<CommodityData> {
  return fetchEdge<CommodityData>('fetch-commodity-data')
}

export async function fetchGlobalCommodities(): Promise<Record<string, unknown>> {
  return fetchEdge('fetch-global-commodities')
}

export async function fetchHormuzData(): Promise<Record<string, unknown>> {
  return fetchEdge('fetch-hormuz-data')
}

export async function fetchPortwatchData(): Promise<{ records: Record<string, unknown>[] }> {
  return fetchEdge('fetch-portwatch-data')
}

export async function fetchRssFeed(): Promise<RssItem[]> {
  const data = await fetchEdge<{ items: RssItem[] }>('fetch-rss')
  return data.items ?? []
}

export async function fetchRtmTaklimat(): Promise<RtmItem[]> {
  const data = await fetchEdge<{ items: RtmItem[] }>('fetch-rtm-taklimat')
  return data.items ?? []
}

export async function fetchRidership(): Promise<RidershipRow[]> {
  const data = await fetchEdge<RidershipRow[] | { data: RidershipRow[] }>('fetch-ridership')
  return Array.isArray(data) ? data : (data.data ?? [])
}

export async function fetchRegionalFuelPrices(): Promise<RegionalFuelResponse> {
  return fetchEdge<RegionalFuelResponse>('fetch-regional-fuel-prices')
}

/** Ringkasan dagangan petroleum terkini daripada API langsung */
export function latestMineralFuelTrade(rows: CommodityData['mineralFuelsTrade']) {
  if (!rows?.length) return null
  const sorted = [...rows].sort((a, b) => a.date.localeCompare(b.date))
  const latest = sorted.at(-1)!
  const prev = sorted.at(-2)
  const momPct =
    prev && prev.exports
      ? ((latest.exports - prev.exports) / prev.exports) * 100
      : undefined
  return { latest, prev, momPct }
}

export async function fetchPricecatcherLocations(): Promise<{ state: string; district: string }[]> {
  const { data, error } = await supabase.rpc('get_pricecatcher_locations')
  if (error) return []
  return (data ?? []) as { state: string; district: string }[]
}
