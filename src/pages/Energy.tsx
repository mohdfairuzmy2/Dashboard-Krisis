import { useEffect, useState, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { loadStatic } from '../lib/api'
import { fetchOilPrices } from '../lib/api-extended'
import { PageSources } from '../components/PageSources'
import type { MarketPoint } from '../lib/types'
import { formatUSD } from '../lib/format'
import { ChartCard } from '../components/ChartCard'
import { KpiCard } from '../components/KpiCard'
import { SectionHeader } from '../components/SectionHeader'
import { usePageMeta } from '../lib/pageMeta'
import { useI18n } from '../lib/i18n'

export function Energy() {
  const { tr, lang } = useI18n()
  const { category } = usePageMeta()
  const [market, setMarket] = useState<MarketPoint[]>([])
  const [brentLatest, setBrentLatest] = useState<number | null>(null)
  const [wtiLatest, setWtiLatest] = useState<number | null>(null)

  useEffect(() => {
    Promise.all([loadStatic<MarketPoint[]>('/data/market-timeseries.json'), fetchOilPrices()]).then(
      ([m, oil]) => {
        setMarket(m)
        const last = [...m].reverse().find((d) => d.brent != null)
        setBrentLatest(last?.brent ?? oil.brent ?? null)
        setWtiLatest(oil.wti ?? [...m].reverse().find((d) => d.wti != null)?.wti ?? null)
      },
    )
  }, [])

  const energySeries = useMemo(
    () =>
      market
        .filter((d) => d.brent != null || d.wti != null)
        .slice(-120)
        .map((d) => ({
          date: d.date.slice(5),
          brent: d.brent,
          wti: d.wti,
        })),
    [market],
  )

  return (
    <div>
      <SectionHeader category={category} title={tr('section.energy.title')} subtitle={tr('section.energy.subtitle')} />

      <div className="grid grid-cols-2 gap-3 mb-8 max-w-lg">
        <KpiCard label="Brent" value={formatUSD(brentLatest)} />
        <KpiCard label="WTI" value={formatUSD(wtiLatest)} />
      </div>

      <ChartCard
        title={lang === 'ms' ? 'Harga Spot Minyak Mentah (USD/tong)' : 'Crude Oil Spot Prices (USD/bbl)'}
        source="U.S. Energy Information Administration (EIA)"
      >
        <ResponsiveContainer width="100%" height={340}>
          <LineChart data={energySeries}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="brent" name="Brent" stroke="#1e3a5f" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="wti" name="WTI" stroke="#c45c3e" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <p className="mt-4 text-xs text-slate-500 leading-relaxed">
        {lang === 'ms'
          ? 'Harga spot petroleum diperoleh daripada EIA (domain awam). Perubahan harga global mempengaruhi kos subsidi bahan api Malaysia.'
          : 'Petroleum spot prices sourced from EIA (public domain). Global price changes affect Malaysia fuel subsidy costs.'}
      </p>

      <PageSources page="energy" officialPath="/global-commodities" />
    </div>
  )
}
