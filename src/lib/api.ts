import { FUNCTIONS_URL, supabase } from './supabase'
import type {
  CommodityTradeRow,
  DailySentiment,
  DosmData,
  FuelMalaysia,
  GeopoliticalAnalysis,
  MarketPoint,
  RegionalFuel,
  TradePartner,
} from './types'

const headers = {
  apikey:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5Y3FtY3J0Z3lqc2dlbmZxcmZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2OTI2MzAsImV4cCI6MjA5MDI2ODYzMH0.32JuXVVwwZgfx3WQvowZ94gyvsaz_d7gKSo4Egjvpzo',
  Authorization:
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5Y3FtY3J0Z3lqc2dlbmZxcmZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2OTI2MzAsImV4cCI6MjA5MDI2ODYzMH0.32JuXVVwwZgfx3WQvowZ94gyvsaz_d7gKSo4Egjvpzo',
  'Content-Type': 'application/json',
}

async function fetchEdge<T>(name: string): Promise<T> {
  const res = await fetch(`${FUNCTIONS_URL}/${name}`, {
    method: 'POST',
    headers,
    body: '{}',
  })
  if (!res.ok) throw new Error(`${name}: ${res.status}`)
  return res.json()
}

export async function fetchDosmData(): Promise<DosmData> {
  return fetchEdge<DosmData>('fetch-dosm-data')
}

export async function fetchFuelMalaysia(): Promise<FuelMalaysia> {
  return fetchEdge<FuelMalaysia>('fetch-fuel-prices')
}

export async function fetchRegionalFuel(): Promise<RegionalFuel[]> {
  const { data, error } = await supabase
    .from('regional_fuel_history')
    .select('country,gasoline_myr,diesel_myr,fetched_at')
    .order('fetched_at', { ascending: false })
  if (error) throw error
  const latestDate = data?.[0]?.fetched_at
  return (data ?? []).filter((r) => r.fetched_at === latestDate) as RegionalFuel[]
}

export async function fetchSentiment(limit = 30): Promise<DailySentiment[]> {
  const { data, error } = await supabase
    .from('daily_sentiment')
    .select('date,positive,neutral,negative,risk_level,source_count')
    .order('date', { ascending: false })
    .limit(limit)
  if (error) throw error
  return (data ?? []) as DailySentiment[]
}

export async function fetchGeopolitical(): Promise<GeopoliticalAnalysis | null> {
  const { data, error } = await supabase
    .from('ai_analysis_cache')
    .select('result')
    .eq('analysis_type', 'geopolitical')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) throw error
  return (data?.result as GeopoliticalAnalysis) ?? null
}

export async function loadStatic<T>(path: string): Promise<T> {
  const res = await fetch(path)
  if (!res.ok) throw new Error(`Failed to load ${path}`)
  return res.json()
}

export function getMarketSeries(data: MarketPoint[]) {
  return data.filter((d) => d.brent != null || d.wti != null || d.usdMyr != null)
}

export function getLatestMarket(data: MarketPoint[]): MarketPoint | undefined {
  const valid = [...data].reverse().find((d) => d.brent != null || d.usdMyr != null)
  return valid
}

export function aggregatePetroleumTrade(rows: CommodityTradeRow[]) {
  const products = ['LNG', 'CRUDE OIL', 'REFINED PETROLEUM']
  const latestMonth = rows
    .filter((r) => products.includes(r.product))
    .map((r) => r.month)
    .sort()
    .at(-1)

  if (!latestMonth) return null

  const monthRows = rows.filter((r) => r.month === latestMonth && products.includes(r.product))
  const exports = monthRows.filter((r) => r.trade === 'EXPORTS').reduce((s, r) => s + r.value, 0)
  const imports = monthRows.filter((r) => r.trade === 'IMPORTS').reduce((s, r) => s + r.value, 0)

  return { month: latestMonth, exports, imports, balance: exports - imports }
}

export function getTradePartners(
  partners: TradePartner[],
  product: string,
  trade: 'EXPORTS' | 'IMPORTS',
  limit = 8,
) {
  return partners
    .filter((p) => p.product === product && p.trade === trade)
    .sort((a, b) => b.totalValue - a.totalValue)
    .slice(0, limit)
}

export type { TradePartner, CommodityTradeRow, MarketPoint }
