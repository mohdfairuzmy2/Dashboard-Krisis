import { useEffect, useState, useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
} from 'recharts'
import { fetchFuelMalaysia, fetchRegionalFuel, loadStatic } from '../lib/api'
import type { FuelMalaysia, RegionalFuel } from '../lib/types'
import { formatRM, formatDate } from '../lib/format'
import { ChartCard } from '../components/ChartCard'
import { KpiCard } from '../components/KpiCard'
import { SectionHeader } from '../components/SectionHeader'
import { usePageMeta } from '../lib/pageMeta'
import { useI18n } from '../lib/i18n'

export function Fuel() {
  const { tr, lang } = useI18n()
  const { category } = usePageMeta()
  const [fuel, setFuel] = useState<FuelMalaysia | null>(null)
  const [regional, setRegional] = useState<RegionalFuel[]>([])
  const [timeline, setTimeline] = useState<{ date: string; label: string; emoji: string }[]>([])

  useEffect(() => {
    Promise.all([
      fetchFuelMalaysia(),
      fetchRegionalFuel(),
      loadStatic<{ date: string; label: string; emoji: string }[]>('/data/fuel-timeline.json'),
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

  if (!fuel) return <p className="text-slate-500">{tr('app.loading')}</p>

  const { latest } = fuel

  return (
    <div>
      <SectionHeader category={category} title={tr('section.fuel.title')} subtitle={tr('section.fuel.subtitle')} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <KpiCard
          label="BUDI95 (RON95)"
          value={formatRM(latest.ron95)}
          sub={lang === 'ms' ? 'Bersubsidi' : 'Subsidised'}
        />
        <KpiCard label="RON97" value={formatRM(latest.ron97)} />
        <KpiCard
          label={lang === 'ms' ? 'Diesel Semenanjung' : 'Peninsular Diesel'}
          value={formatRM(latest.dieselPeninsular)}
        />
        <KpiCard
          label={lang === 'ms' ? 'Harga Pasaran RON95' : 'Market RON95'}
          value={formatRM(latest.ron95Unsubsidised)}
          sub={lang === 'ms' ? 'Tanpa subsidi' : 'Unsubsidised'}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-8">
        <div className="lg:col-span-2">
          <ChartCard
            title={lang === 'ms' ? 'Trend Harga Mingguan (RM/Liter)' : 'Weekly Price Trend (RM/Litre)'}
            source="data.gov.my · KPDN"
          >
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
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
                  <p className="font-semibold text-slate-800">{e.label}</p>
                  <p className="text-xs text-slate-500">{formatDate(e.date, lang)}</p>
                </div>
              </li>
            ))}
          </ul>
        </ChartCard>
      </div>

      <ChartCard
        title={lang === 'ms' ? 'Perbandingan Harga Petrol Asia (MYR/L)' : 'Asia Petrol Price Comparison (MYR/L)'}
        subtitle={lang === 'ms' ? 'Bandingan dengan harga Malaysia' : 'Compared to Malaysia prices'}
        source="globalpetrolprices.com · BNM FX"
      >
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={compareData} layout="vertical" margin={{ left: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis type="number" tick={{ fontSize: 10 }} />
            <YAxis type="category" dataKey="country" tick={{ fontSize: 10 }} width={75} />
            <Tooltip />
            <Bar dataKey="petrol" name={lang === 'ms' ? 'Petrol' : 'Petrol'} fill="#1e3a5f" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}
