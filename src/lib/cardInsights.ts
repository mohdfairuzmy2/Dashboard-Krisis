import type { Lang } from './i18n'
import {
  aggregatePetroleumTrade,
  fetchDosmData,
  fetchFuelMalaysia,
  fetchGeopolitical,
  fetchRegionalFuel,
  fetchSentiment,
  getTradePartners,
  loadStatic,
} from './api'
import type { IllustrationId } from './dashboardMeta'
import { geoSummaryText } from './geoAnalysis'
import type { CommodityTradeRow, MarketPoint, TradePartner } from './types'

export type CardStory = {
  story: string
  highlight?: string
  updatedAt?: string
}

type InsightContext = {
  lang: Lang
  fuel?: {
    ron95: number
    ron97: number
    marketRon95: number
    diesel: number
    brent?: number
    week: string
    aseanNote?: string
  }
  cpi?: { yoy: number; month: string }
  energy?: { brent?: number; wti?: number }
  gdp?: { growth: number; unemployment: number; ipi: number; period: string }
  market?: { usdMyr?: number; klci?: number }
  trade?: { month: string; balanceBn: number; exportsBn: number; importsBn: number }
  lngPartner?: string
  lngValueBn?: number
  sentiment?: { risk: string; negative: number; sources: number }
  geoSnippet?: string
}

function bn(value: number): string {
  return (value / 1e9).toFixed(1)
}

function fmtPct(n: number, signed = true): string {
  const prefix = signed && n > 0 ? '+' : ''
  return `${prefix}${n.toFixed(1)}%`
}

function lastWith<T extends Record<string, unknown>>(rows: T[], key: keyof T): T | undefined {
  return [...rows].reverse().find((r) => r[key] != null)
}

function buildStories(ctx: InsightContext): Partial<Record<IllustrationId, CardStory>> {
  const { lang } = ctx
  const stories: Partial<Record<IllustrationId, CardStory>> = {}

  if (ctx.fuel) {
    const gap = ctx.fuel.marketRon95 - ctx.fuel.ron95
    if (lang === 'ms') {
      stories.fuel = {
        highlight: `RON95 RM${ctx.fuel.ron95.toFixed(2)}`,
        story: `Minggu ${ctx.fuel.week}: RON95 bersubsidi kekal RM${ctx.fuel.ron95.toFixed(2)}, manakala harga pasaran tanpa subsidi ialah RM${ctx.fuel.marketRon95.toFixed(2)} — jurang RM${gap.toFixed(2)} menunjukkan kos subsidi kerajaan. RON97 di RM${ctx.fuel.ron97.toFixed(2)} dan diesel Semenanjung RM${ctx.fuel.diesel.toFixed(2)}.${ctx.fuel.brent ? ` Brent global ~USD${ctx.fuel.brent.toFixed(0)}.` : ''}${ctx.fuel.aseanNote ? ` ${ctx.fuel.aseanNote}` : ''}`,
      }
    } else {
      stories.fuel = {
        highlight: `RON95 RM${ctx.fuel.ron95.toFixed(2)}`,
        story: `Week of ${ctx.fuel.week}: subsidised RON95 stays at RM${ctx.fuel.ron95.toFixed(2)} while the market price is RM${ctx.fuel.marketRon95.toFixed(2)} — a RM${gap.toFixed(2)} gap that reflects government subsidy cost. RON97 is RM${ctx.fuel.ron97.toFixed(2)} and peninsular diesel RM${ctx.fuel.diesel.toFixed(2)}.${ctx.fuel.brent ? ` Global Brent near USD${ctx.fuel.brent.toFixed(0)}.` : ''}${ctx.fuel.aseanNote ? ` ${ctx.fuel.aseanNote}` : ''}`,
      }
    }
  }

  if (ctx.cpi) {
    if (lang === 'ms') {
      stories.cpi = {
        highlight: `Inflasi ${fmtPct(ctx.cpi.yoy)}`,
        story: `Indeks Harga Pengguna pada ${ctx.cpi.month} naik ${fmtPct(ctx.cpi.yoy)} berbanding tahun lepas. Kategori makanan dan pengangkutan masih mendominasi tekanan kos sara hidup rakyat — pantau carta mengikut 13 kumpulan untuk lihat item mana paling meningkat.`,
      }
    } else {
      stories.cpi = {
        highlight: `Inflation ${fmtPct(ctx.cpi.yoy)}`,
        story: `Consumer prices in ${ctx.cpi.month} are ${fmtPct(ctx.cpi.yoy)} year-on-year. Food and transport categories still drive most of the pressure on household budgets — use the 13-category charts to see which items rose fastest.`,
      }
    }
  }

  if (ctx.energy) {
    const b = ctx.energy.brent
    if (lang === 'ms') {
      stories.energy = {
        highlight: b ? `Brent ~$${b.toFixed(0)}` : 'Tenaga global',
        story: b
          ? `Harga spot Brent sekitar USD${b.toFixed(2)} (EIA). Apabila minyak dunia naik, kos import dan bil subsidi bahan api Malaysia turut tertekan — carta ini membantu anda hubungkan harga global dengan pam setempat.`
          : `Carta Brent dan WTI daripada EIA. Ikuti turun naik minyak dunia yang mempengaruhi import petroleum dan subsidi domestik.`,
      }
    } else {
      stories.energy = {
        highlight: b ? `Brent ~$${b.toFixed(0)}` : 'Global energy',
        story: b
          ? `Brent spot is near USD${b.toFixed(2)} (EIA). When world oil prices rise, Malaysia’s import bill and fuel subsidy costs come under pressure — this chart links global benchmarks to local pumps.`
          : `Brent and WTI series from the EIA. Track global oil swings that flow into petroleum imports and domestic subsidies.`,
      }
    }
  }

  if (ctx.gdp) {
    if (lang === 'ms') {
      stories.gdp = {
        highlight: `KDNK ${fmtPct(ctx.gdp.growth)}`,
        story: `Ekonomi Malaysia berkembang ${fmtPct(ctx.gdp.growth)} (${ctx.gdp.period}) dengan kadar pengangguran ${ctx.gdp.unemployment.toFixed(1)}% dan IPI ${fmtPct(ctx.gdp.ipi)}. Sektor perlombongan dan pembuatan dipantau rapat kerana krisis bekalan global boleh mengganggu eksport komoditi.`,
      }
    } else {
      stories.gdp = {
        highlight: `GDP ${fmtPct(ctx.gdp.growth)}`,
        story: `The economy grew ${fmtPct(ctx.gdp.growth)} (${ctx.gdp.period}) with unemployment at ${ctx.gdp.unemployment.toFixed(1)}% and industrial output ${fmtPct(ctx.gdp.ipi)}. Mining and manufacturing are watched closely as supply shocks can hit commodity exports.`,
      }
    }
  }

  if (ctx.market) {
    const { usdMyr, klci } = ctx.market
    const klciMs = klci ? `, manakala FTSE KLCI pada ${klci.toFixed(0)} mata` : ''
    const klciEn = klci ? `, while the FTSE KLCI sits around ${klci.toFixed(0)} points` : ''
    if (lang === 'ms') {
      stories.market = {
        highlight: usdMyr ? `USD/MYR ${usdMyr.toFixed(2)}` : 'Kadar FX',
        story: usdMyr
          ? `Ringgit berdagang sekitar ${usdMyr.toFixed(2)} bagi satu dolar AS${klciMs}. Pergerakan mata wang mempengaruhi harga import makanan, tenaga dan peralatan — carta ini ringkaskan tekanan FX ke atas kos import.`
          : 'Kadar pertukaran MYR berbanding USD, SGD, EUR dan CNY daripada OpenDOSM/BNM.',
      }
    } else {
      stories.market = {
        highlight: usdMyr ? `USD/MYR ${usdMyr.toFixed(2)}` : 'FX rates',
        story: usdMyr
          ? `The ringgit trades near ${usdMyr.toFixed(2)} per US dollar${klciEn}. Currency moves feed into imported food, energy and equipment costs — this view summarises FX pressure on imports.`
          : 'MYR rates versus USD, SGD, EUR and CNY from OpenDOSM/BNM.',
      }
    }
  }

  if (ctx.trade) {
    const bal = ctx.trade.balanceBn
    const sign = bal >= 0 ? (lang === 'ms' ? 'surplus' : 'surplus') : lang === 'ms' ? 'defisit' : 'deficit'
    if (lang === 'ms') {
      stories.commodities = {
        highlight: `${ctx.trade.month}: ${sign} RM${Math.abs(bal).toFixed(1)}B`,
        story: `Dagangan petroleum ${ctx.trade.month}: eksport RM${ctx.trade.exportsBn}B vs import RM${ctx.trade.importsBn}B. LNG dan petroleum ditapis menyumbang volum terbesar — carta bulanan menunjukkan sama ada Malaysia net eksport atau import tenaga.`,
      }
      stories.tradeflow = {
        highlight: ctx.lngPartner ? `LNG → ${ctx.lngPartner.split(' ')[0]}` : 'Aliran dagangan',
        story: ctx.lngPartner
          ? `Rakan eksport LNG utama ialah ${ctx.lngPartner} (RM${ctx.lngValueBn ?? '?'}B). Carta ini menunjukkan 10 destinasi terbesar mengikut produk — tukar antara eksport dan import untuk lihat kebergantungan rantaian bekalan.`
          : 'Carta rakan dagangan petroleum terbesar mengikut produk dan arah aliran.',
      }
      stories.map = {
        highlight: 'Peta rakan dagangan',
        story: ctx.lngPartner
          ? `Peta mengekodkan nilai dagangan — bulatan terbesar ke ${ctx.lngPartner} untuk eksport LNG. Klik negara untuk bandingkan kepentingan setiap pasaran eksport minyak dan gas Malaysia.`
          : 'Geographic view of petroleum trade partners. Larger circles mean higher trade value with Malaysia.',
      }
    } else {
      stories.commodities = {
        highlight: `${ctx.trade.month}: ${sign} RM${Math.abs(bal).toFixed(1)}B`,
        story: `Petroleum trade in ${ctx.trade.month}: exports RM${ctx.trade.exportsBn}B vs imports RM${ctx.trade.importsBn}B. LNG and refined products dominate volume — monthly charts show whether Malaysia is a net energy exporter or importer.`,
      }
      stories.tradeflow = {
        highlight: ctx.lngPartner ? `LNG → ${ctx.lngPartner.split(' ')[0]}` : 'Trade flows',
        story: ctx.lngPartner
          ? `The top LNG export partner is ${ctx.lngPartner} (RM${ctx.lngValueBn ?? '?'}B). Switch products and direction to see the ten largest flows and where supply-chain risk concentrates.`
          : 'Ranked partner flows by petroleum product and trade direction.',
      }
      stories.map = {
        highlight: 'Trade map',
        story: ctx.lngPartner
          ? `The map encodes trade value — the largest circle for LNG points to ${ctx.lngPartner}. Tap countries to compare how reliant each market is on Malaysian oil and gas exports.`
          : 'Geographic view of partner countries. Larger circles mean higher petroleum trade with Malaysia.',
      }
    }
  }

  if (ctx.sentiment) {
    if (lang === 'ms') {
      stories.news = {
        highlight: `Risiko ${ctx.sentiment.risk}`,
        story: `Analisis ${ctx.sentiment.sources} sumber berita hari ini: tahap risiko ${ctx.sentiment.risk}, dengan ${ctx.sentiment.negative} berita negatif dalam sampel terkini.${ctx.geoSnippet ? ` ${ctx.geoSnippet}` : ''} Buka untuk ringkasan AI dan tajuk geopolitik penuh.`,
      }
    } else {
      stories.news = {
        highlight: `Risk ${ctx.sentiment.risk}`,
        story: `Today's scan of ${ctx.sentiment.sources} news sources flags ${ctx.sentiment.risk} geopolitical risk, with ${ctx.sentiment.negative} negative headlines in the latest sample.${ctx.geoSnippet ? ` ${ctx.geoSnippet}` : ''} Open for the full AI summary and headline feed.`,
      }
    }
  }

  return stories
}

async function settle<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise
  } catch {
    return fallback
  }
}

export async function fetchCardStories(lang: Lang): Promise<Partial<Record<IllustrationId, CardStory>>> {
  const [
    dosm,
    fuelData,
    market,
    commodityRows,
    tradePartners,
    sentiment,
    geo,
    regional,
  ] = await Promise.all([
    settle(fetchDosmData(), null as Awaited<ReturnType<typeof fetchDosmData>> | null),
    settle(fetchFuelMalaysia(), null),
    settle(loadStatic<MarketPoint[]>('/data/market-timeseries.json'), []),
    settle(loadStatic<CommodityTradeRow[]>('/data/commodity-trade-monthly.json'), []),
    settle(loadStatic<TradePartner[]>('/data/trade-partners.json'), []),
    settle(fetchSentiment(1), []),
    settle(fetchGeopolitical(), null),
    settle(fetchRegionalFuel(), [] as Awaited<ReturnType<typeof fetchRegionalFuel>>),
  ])

  const latestCpi = dosm?.cpi.overallMonthly.at(-1)
  const brentRow = lastWith(market, 'brent')
  const wtiRow = lastWith(market, 'wti')
  const fxRow = lastWith(market, 'usdMyr')
  const klciRow = lastWith(market, 'klci')
  const petTrade = aggregatePetroleumTrade(commodityRows)
  const topLng = getTradePartners(tradePartners, 'LNG', 'EXPORTS', 1)[0]

  const geoSnippet = geoSummaryText(geo)

  const myFuel = regional.find((c) => c.country === 'Malaysia')
  const priciestAsean = regional
    .filter((c) => c.country !== 'Malaysia')
    .sort((a, b) => b.gasoline_myr - a.gasoline_myr)[0]
  const aseanNote =
    myFuel && priciestAsean
      ? lang === 'ms'
        ? `Di ASEAN, petrol Malaysia RM${myFuel.gasoline_myr.toFixed(2)}/L berbanding tertinggi ${priciestAsean.country} RM${priciestAsean.gasoline_myr.toFixed(2)}/L.`
        : `Across ASEAN, Malaysia petrol is RM${myFuel.gasoline_myr.toFixed(2)}/L vs the highest, ${priciestAsean.country} at RM${priciestAsean.gasoline_myr.toFixed(2)}/L.`
      : undefined

  return buildStories({
    lang,
    fuel: fuelData?.latest
      ? {
          ron95: fuelData.latest.ron95,
          ron97: fuelData.latest.ron97,
          marketRon95: fuelData.latest.ron95Unsubsidised,
          diesel: fuelData.latest.dieselPeninsular,
          brent: fuelData.brentUSD ?? brentRow?.brent ?? undefined,
          week:
            typeof fuelData.weekValidity === 'object' && fuelData.weekValidity
              ? `${fuelData.weekValidity.from} – ${fuelData.weekValidity.to}`
              : (fuelData.weekValidity ?? fuelData.latest.date),
          aseanNote,
        }
      : undefined,
    cpi: latestCpi
      ? { yoy: latestCpi.yoy, month: latestCpi.month }
      : undefined,
    energy: {
      brent: brentRow?.brent ?? fuelData?.brentUSD ?? undefined,
      wti: wtiRow?.wti ?? undefined,
    },
    gdp: dosm
      ? {
          growth: dosm.gdp.overall,
          unemployment: dosm.labour.unemploymentRate,
          ipi: dosm.ipi.overall,
          period: dosm.gdp.latest,
        }
      : undefined,
    market: {
      usdMyr: fxRow?.usdMyr ?? undefined,
      klci: klciRow?.klci ?? undefined,
    },
    trade: petTrade
      ? {
          month: petTrade.month,
          balanceBn: parseFloat(bn(petTrade.balance)),
          exportsBn: parseFloat(bn(petTrade.exports)),
          importsBn: parseFloat(bn(petTrade.imports)),
        }
      : undefined,
    lngPartner: topLng?.country,
    lngValueBn: topLng ? parseFloat(bn(topLng.totalValue)) : undefined,
    sentiment: sentiment[0]
      ? {
          risk: sentiment[0].risk_level,
          negative: sentiment[0].negative,
          sources: sentiment[0].source_count,
        }
      : undefined,
    geoSnippet: geoSnippet || undefined,
  })
}
