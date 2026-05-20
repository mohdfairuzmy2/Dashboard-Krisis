import { useEffect, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { fetchFuelMalaysia, fetchRegionalFuel, loadStatic } from '../lib/api'
import type { FuelMalaysia, RegionalFuel } from '../lib/types'
import { formatDate, formatDeltaRM, formatRM, formatUSD } from '../lib/format'
import { ChartCard } from '../components/ChartCard'
import { KpiCard } from '../components/KpiCard'
import { PageSources } from '../components/PageSources'
import { SectionHeader } from '../components/SectionHeader'
import { usePageMeta } from '../lib/pageMeta'
import { useI18n } from '../lib/i18n'

type TimelineEvent = { date: string; label: string; emoji: string }

function weekLabel(validity: FuelMalaysia['weekValidity'], lang: 'ms' | 'en'): string | null {
  if (!validity) return null
  if (typeof validity === 'string') return validity
  const sep = lang === 'ms' ? ' hingga ' : ' – '
  return `${validity.from}${sep}${validity.to}`
}

function deltaTrend(delta: number | undefined): 'up' | 'down' | 'neutral' | undefined {
  if (delta == null || delta === 0) return 'neutral'
  return delta > 0 ? 'up' : 'down'
}

export function Fuel() {
  const { tr, lang } = useI18n()
  const { category } = usePageMeta()
  const [fuel, setFuel] = useState<FuelMalaysia | null>(null)
  const [regional, setRegional] = useState<RegionalFuel[]>([])
  const [timeline, setTimeline] = useState<TimelineEvent[]>([])

  useEffect(() => {
    Promise.all([
      fetchFuelMalaysia(),
      fetchRegionalFuel(),
      loadStatic<TimelineEvent[]>('/data/fuel-timeline.json'),
    ]).then(([f, r, t]) => {
      setFuel(f)
      setRegional(r)
      setTimeline(t)
    })
  }, [])

  const chartData = useMemo(() => {
    if (!fuel?.prices) return []
    return fuel.prices.slice(-52).map((p) => ({
      date: p.date.slice(5),
      ron95: p.ron95,
      ron97: p.ron97,
      diesel: p.dieselPeninsular,
      market: p.ron95Unsubsidised,
    }))
  }, [fuel])

  const compareData = useMemo(() => {
    const my = regional.find((c) => c.country === 'Malaysia')
    return regional
      .filter((c) => c.country !== 'Malaysia')
      .map((c) => ({
        country: c.country,
        petrol: c.gasoline_myr,
        diesel: c.diesel_myr,
        petrolPct: my ? ((c.gasoline_myr - my.gasoline_myr) / my.gasoline_myr) * 100 : 0,
      }))
      .sort((a, b) => b.petrol - a.petrol)
  }, [regional])

  const priceRows = useMemo(() => {
    if (!fuel) return []
    const { latest, prev, changes } = fuel
    const rows = [
      {
        key: 'ron95',
        label: tr('fuel.ron95Budi'),
        current: latest.ron95,
        previous: prev?.ron95,
        change: prev ? latest.ron95 - prev.ron95 : undefined,
      },
      {
        key: 'ron97',
        label: 'RON97',
        current: latest.ron97,
        previous: prev?.ron97,
        change: changes?.ron97Change ?? (prev ? latest.ron97 - prev.ron97 : undefined),
      },
      {
        key: 'dieselPen',
        label: lang === 'ms' ? 'Diesel Semenanjung' : 'Peninsular Diesel',
        current: latest.dieselPeninsular,
        previous: prev?.dieselPeninsular,
        change: changes?.dieselChange ?? (prev ? latest.dieselPeninsular - prev.dieselPeninsular : undefined),
      },
      {
        key: 'dieselEast',
        label: tr('fuel.dieselEast'),
        current: latest.dieselEastMY,
        previous: prev?.dieselEastMY,
        change: prev ? latest.dieselEastMY - prev.dieselEastMY : undefined,
      },
      {
        key: 'market',
        label: tr('fuel.marketRon95'),
        current: latest.ron95Unsubsidised,
        previous: prev?.ron95Unsubsidised ?? undefined,
        change:
          changes?.ron95UnsubChange ??
          (prev?.ron95Unsubsidised != null
            ? latest.ron95Unsubsidised - prev.ron95Unsubsidised
            : undefined),
      },
    ]
    return rows
  }, [fuel, lang, tr])

  const subsidyGap = useMemo(() => {
    if (!fuel?.latest) return null
    return fuel.latest.ron95Unsubsidised - fuel.latest.ron95
  }, [fuel])

  const dieselCompare = useMemo(() => {
    if (!fuel?.latest) return []
    return [
      {
        region: lang === 'ms' ? 'Semenanjung' : 'Peninsular',
        price: fuel.latest.dieselPeninsular,
      },
      { region: lang === 'ms' ? 'Sabah & Sarawak' : 'Sabah & Sarawak', price: fuel.latest.dieselEastMY },
    ]
  }, [fuel, lang])

  if (!fuel) return <p className="text-[var(--color-ink-muted)]">{tr('app.loading')}</p>

  const { latest, prev, ranges } = fuel
  const validity = weekLabel(fuel.weekValidity, lang)

  return (
    <div>
      <SectionHeader category={category} title={tr('section.fuel.title')} subtitle={tr('section.fuel.subtitle')} />

      <div className="fuel-meta glass-card mb-6">
        <div className="fuel-meta__row">
          {validity && (
            <p>
              <span className="fuel-meta__label">{tr('fuel.weekValidity')}</span>{' '}
              <strong>{validity}</strong>
            </p>
          )}
          {fuel.fetchedAt && (
            <p>
              <span className="fuel-meta__label">{tr('fuel.updated')}</span> {fuel.fetchedAt}
            </p>
          )}
        </div>
        <p className="fuel-meta__note">{tr('fuel.budiNote')}</p>
        {fuel.source && (
          <p className="fuel-meta__source">
            <span className="fuel-meta__label">{tr('fuel.source')}</span> {fuel.source}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3 mb-6">
        <KpiCard label={tr('fuel.ron95Budi')} value={formatRM(latest.ron95)} sub={lang === 'ms' ? 'Bersubsidi' : 'Subsidised'} />
        <KpiCard
          label="RON97"
          value={formatRM(latest.ron97)}
          sub={fuel.changes?.ron97Change != null ? formatDeltaRM(fuel.changes.ron97Change) : undefined}
          trend={deltaTrend(fuel.changes?.ron97Change)}
        />
        <KpiCard
          label={lang === 'ms' ? 'Diesel Semenanjung' : 'Peninsular Diesel'}
          value={formatRM(latest.dieselPeninsular)}
          sub={fuel.changes?.dieselChange != null ? formatDeltaRM(fuel.changes.dieselChange) : undefined}
          trend={deltaTrend(fuel.changes?.dieselChange)}
        />
        <KpiCard label={tr('fuel.dieselEast')} value={formatRM(latest.dieselEastMY)} />
        <KpiCard
          label={tr('fuel.marketRon95')}
          value={formatRM(latest.ron95Unsubsidised)}
          sub={fuel.changes?.ron95UnsubChange != null ? formatDeltaRM(fuel.changes.ron95UnsubChange) : undefined}
          trend={deltaTrend(fuel.changes?.ron95UnsubChange)}
        />
        {subsidyGap != null && (
          <KpiCard
            label={tr('fuel.subsidyGap')}
            value={formatRM(subsidyGap)}
            sub={lang === 'ms' ? 'Pasaran − pam' : 'Market − pump'}
            trend="up"
          />
        )}
        {fuel.brentUSD != null && (
          <KpiCard label={tr('fuel.brent')} value={formatUSD(fuel.brentUSD, 0)} sub={lang === 'ms' ? 'EIA spot' : 'EIA spot'} />
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-8">
        <div className="glass-card overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--color-border-soft)]">
            <h3 className="font-display font-semibold text-[var(--color-ink)]">{tr('fuel.priceComparison')}</h3>
            {prev && (
              <p className="text-xs text-[var(--color-ink-muted)] mt-1">
                {formatDate(prev.date, lang)} → {formatDate(latest.date, lang)}
              </p>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="fuel-table w-full text-sm">
              <thead>
                <tr>
                  <th>{tr('fuel.product')}</th>
                  <th className="text-right">{tr('fuel.thisWeek')}</th>
                  <th className="text-right">{tr('fuel.prevWeek')}</th>
                  <th className="text-right">{tr('fuel.change')}</th>
                </tr>
              </thead>
              <tbody>
                {priceRows.map((row) => (
                  <tr key={row.key}>
                    <td>{row.label}</td>
                    <td className="text-right font-mono font-medium">{formatRM(row.current)}</td>
                    <td className="text-right font-mono text-[var(--color-ink-muted)]">
                      {row.previous != null ? formatRM(row.previous) : '—'}
                    </td>
                    <td
                      className={`text-right font-mono font-medium ${
                        row.change != null && row.change > 0
                          ? 'text-[var(--color-negative)]'
                          : row.change != null && row.change < 0
                            ? 'text-[var(--color-positive)]'
                            : ''
                      }`}
                    >
                      {row.change != null ? formatDeltaRM(row.change) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card p-5 flex flex-col gap-4">
          <div>
            <h3 className="font-display font-semibold text-[var(--color-ink)]">{tr('fuel.subsidyGap')}</h3>
            <p className="text-sm text-[var(--color-ink-muted)] mt-1">{tr('fuel.subsidyGapDesc')}</p>
          </div>
          {subsidyGap != null && (
            <div className="fuel-subsidy-visual">
              <div className="fuel-subsidy-visual__row">
                <span>{lang === 'ms' ? 'Harga pam RON95' : 'Pump RON95'}</span>
                <strong className="font-mono">{formatRM(latest.ron95)}</strong>
              </div>
              <div className="fuel-subsidy-visual__bar">
                <div
                  className="fuel-subsidy-visual__fill"
                  style={{ width: `${Math.min(100, (latest.ron95 / latest.ron95Unsubsidised) * 100)}%` }}
                />
              </div>
              <div className="fuel-subsidy-visual__row">
                <span>{tr('fuel.marketRon95')}</span>
                <strong className="font-mono">{formatRM(latest.ron95Unsubsidised)}</strong>
              </div>
              <p className="text-lg font-display font-bold text-[var(--color-brand-700)]">
                {tr('fuel.subsidyGap')}: {formatRM(subsidyGap)}
                <span className="text-sm font-normal text-[var(--color-ink-muted)]"> /L</span>
              </p>
            </div>
          )}
          {ranges && (
            <div className="pt-4 border-t border-[var(--color-border-soft)]">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-category)] mb-3">
                {tr('fuel.historicalRange')}
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {(
                  [
                    ['RON95', ranges.ron95],
                    ['RON97', ranges.ron97],
                    ['Market', ranges.ron95Unsub],
                    ['Diesel (Pen.)', ranges.dieselPeninsular],
                  ] as const
                ).map(([name, r]) => (
                  <div key={name} className="fuel-range-pill">
                    <span className="font-medium">{name}</span>
                    <span className="font-mono text-[var(--color-ink-muted)]">
                      {formatRM(r.min)} – {formatRM(r.max)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-8">
        <div className="lg:col-span-2">
          <ChartCard
            title={lang === 'ms' ? 'Trend Harga Mingguan (RM/Liter)' : 'Weekly Price Trend (RM/Litre)'}
            source="data.gov.my · KPDN"
          >
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                <Legend />
                <Line type="monotone" dataKey="ron95" name="RON95" stroke="#1e3a5f" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="ron97" name="RON97" stroke="#c45c3e" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="diesel" name="Diesel" stroke="#1a4d3e" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="market" name="Market" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <ChartCard title={lang === 'ms' ? 'Garis Masa Krisis' : 'Crisis Timeline'}>
          <ul className="space-y-3">
            {timeline.map((e) => (
              <li key={e.date} className="flex gap-3 text-sm">
                <span className="text-lg">{e.emoji}</span>
                <div>
                  <p className="font-semibold text-[var(--color-ink)]">{e.label}</p>
                  <p className="text-xs text-[var(--color-ink-muted)]">{formatDate(e.date, lang)}</p>
                </div>
              </li>
            ))}
          </ul>
        </ChartCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-8">
        <ChartCard title={tr('fuel.dieselCompare')} source="data.gov.my">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dieselCompare} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="region" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
              <Tooltip formatter={(v) => formatRM(Number(v))} />
              <Bar dataKey="price" name={lang === 'ms' ? 'Diesel' : 'Diesel'} fill="#1a4d3e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title={lang === 'ms' ? 'Perbandingan Harga Petrol Asia (MYR/L)' : 'Asia Petrol Price Comparison (MYR/L)'}
          subtitle={tr('fuel.asiaNote')}
          source="globalpetrolprices.com · BNM FX"
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={compareData} layout="vertical" margin={{ left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="country" tick={{ fontSize: 10 }} width={75} />
              <Tooltip />
              <Bar dataKey="petrol" name={lang === 'ms' ? 'Petrol' : 'Petrol'} fill="#1e3a5f" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <PageSources page="fuel" officialPath="/fuel" />
    </div>
  )
}
