import { useEffect, useState, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { fetchCurrencyRates } from '../lib/api-extended'
import { loadStatic } from '../lib/api'
import type { MarketPoint } from '../lib/types'
import { ChartCard } from '../components/ChartCard'
import { KpiCard } from '../components/KpiCard'
import { PageSources } from '../components/PageSources'
import { SectionHeader } from '../components/SectionHeader'
import { usePageMeta } from '../lib/pageMeta'
import { useI18n } from '../lib/i18n'

const FX_KEYS = [
  { key: 'usdMyr', label: 'USD/MYR' },
  { key: 'sgdMyr', label: 'SGD/MYR' },
  { key: 'eurMyr', label: 'EUR/MYR' },
  { key: 'cnyMyr', label: 'CNY/MYR' },
  { key: 'gbpMyr', label: 'GBP/MYR' },
] as const

export function Market() {
  const { tr, lang } = useI18n()
  const { category } = usePageMeta()
  const [market, setMarket] = useState<MarketPoint[]>([])
  const [liveRates, setLiveRates] = useState<Record<string, { rate: number; change?: number }>>({})
  const [klci, setKlci] = useState<{ value: number; change?: number } | null>(null)

  useEffect(() => {
    Promise.all([
      loadStatic<MarketPoint[]>('/data/market-timeseries.json'),
      fetchCurrencyRates(),
    ]).then(([m, fx]) => {
      setMarket(m)
      const rates: Record<string, { rate: number; change?: number }> = {}
      for (const { key } of FX_KEYS) {
        const r = fx.rates[key]
        if (r) rates[key] = { rate: r.rate, change: r.change }
      }
      setLiveRates(rates)
      if (fx.klci) setKlci({ value: fx.klci.value, change: fx.klci.change })
    })
  }, [])

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

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-8">
        {FX_KEYS.map(({ key, label }) => (
          <KpiCard
            key={key}
            label={label}
            value={liveRates[key]?.rate?.toFixed(4) ?? '—'}
            sub={
              liveRates[key]?.change != null
                ? `${liveRates[key]!.change! >= 0 ? '+' : ''}${liveRates[key]!.change!.toFixed(4)}`
                : undefined
            }
            trend={
              liveRates[key]?.change != null
                ? liveRates[key]!.change! > 0
                  ? 'up'
                  : liveRates[key]!.change! < 0
                    ? 'down'
                    : 'neutral'
                : undefined
            }
          />
        ))}
        <KpiCard
          label="FTSE KLCI"
          value={klci?.value?.toFixed(0) ?? market.at(-1)?.klci?.toFixed(0) ?? '—'}
          sub={klci?.change != null ? `${klci.change >= 0 ? '+' : ''}${klci.change.toFixed(2)}` : undefined}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-8">
        <ChartCard title={lang === 'ms' ? 'Kadar Pertukaran MYR' : 'MYR Exchange Rates'} source="OpenDOSM · BNM">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={fxSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
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
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
              <Tooltip />
              <Line type="monotone" dataKey="klci" stroke="#1a4d3e" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <PageSources page="market" officialPath="/market" />
    </div>
  )
}
