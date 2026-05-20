import { useEffect, useState, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { loadStatic } from '../lib/api'
import type { MarketPoint } from '../lib/types'
import { ChartCard } from '../components/ChartCard'
import { KpiCard } from '../components/KpiCard'
import { SectionHeader } from '../components/SectionHeader'
import { usePageMeta } from '../lib/pageMeta'
import { useI18n } from '../lib/i18n'

export function Market() {
  const { tr, lang } = useI18n()
  const { category } = usePageMeta()
  const [market, setMarket] = useState<MarketPoint[]>([])

  useEffect(() => {
    loadStatic<MarketPoint[]>('/data/market-timeseries.json').then(setMarket)
  }, [])

  const latest = useMemo(() => {
    return [...market].reverse().find((d) => d.usdMyr != null)
  }, [market])

  const fxSeries = useMemo(
    () =>
      market
        .filter((d) => d.usdMyr != null)
        .slice(-90)
        .map((d) => ({
          date: d.date.slice(5),
          usd: d.usdMyr,
          sgd: d.sgdMyr,
          eur: d.eurMyr,
          cny: d.cnyMyr,
        })),
    [market],
  )

  const indexSeries = useMemo(
    () =>
      market
        .filter((d) => d.klci != null)
        .slice(-90)
        .map((d) => ({ date: d.date.slice(5), klci: d.klci })),
    [market],
  )

  return (
    <div>
      <SectionHeader category={category} title={tr('section.market.title')} subtitle={tr('section.market.subtitle')} />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
        <KpiCard label="USD/MYR" value={latest?.usdMyr?.toFixed(4) ?? '—'} />
        <KpiCard label="SGD/MYR" value={latest?.sgdMyr?.toFixed(4) ?? '—'} />
        <KpiCard label="EUR/MYR" value={latest?.eurMyr?.toFixed(4) ?? '—'} />
        <KpiCard label="CNY/MYR" value={latest?.cnyMyr?.toFixed(4) ?? '—'} />
        <KpiCard label="FTSE KLCI" value={latest?.klci?.toFixed(0) ?? market.at(-1)?.klci?.toFixed(0) ?? '—'} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <ChartCard title={lang === 'ms' ? 'Kadar Pertukaran MYR' : 'MYR Exchange Rates'} source="OpenDOSM · BNM">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={fxSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="usd" name="USD" stroke="#1e3a5f" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="sgd" name="SGD" stroke="#1a4d3e" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="eur" name="EUR" stroke="#8b7355" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="cny" name="CNY" stroke="#c45c3e" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="FTSE KLCI" source="OpenDOSM">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={indexSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
              <Tooltip />
              <Line type="monotone" dataKey="klci" stroke="#1a4d3e" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  )
}
