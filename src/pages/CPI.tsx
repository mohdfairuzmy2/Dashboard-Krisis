import { useEffect, useState, useMemo } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { fetchDosmData } from '../lib/api'
import type { DosmData } from '../lib/types'
import { CPI_CATEGORIES } from '../lib/types'
import { formatPct } from '../lib/format'
import { ChartCard } from '../components/ChartCard'
import { KpiCard } from '../components/KpiCard'
import { SectionHeader } from '../components/SectionHeader'
import { usePageMeta } from '../lib/pageMeta'
import { useI18n } from '../lib/i18n'

const COLORS = ['#1e3a5f', '#1a4d3e', '#c45c3e', '#8b7355', '#2d5a87', '#5c5c5c', '#b45309']

export function CPI() {
  const { tr, lang } = useI18n()
  const { category } = usePageMeta()
  const [data, setData] = useState<DosmData | null>(null)

  useEffect(() => {
    fetchDosmData().then(setData)
  }, [])

  const latest = data?.cpi.overallMonthly.at(-1)
  const trend = useMemo(
    () => data?.cpi.overallMonthly.map((m) => ({ month: m.month, index: m.index, yoy: m.yoy })) ?? [],
    [data],
  )

  const categories = useMemo(() => {
    if (!data || !latest) return []
    const month = latest.month
    return data.cpi.categoryMonthly
      .filter((c) => c.month === month && c.categoryId !== 'overall')
      .map((c) => ({
        id: c.categoryId,
        name: CPI_CATEGORIES[c.categoryId]?.[lang] ?? c.categoryId,
        yoy: c.yoy,
      }))
      .sort((a, b) => b.yoy - a.yoy)
  }, [data, latest, lang])

  if (!data) return <p className="text-slate-500">{tr('app.loading')}</p>

  return (
    <div>
      <SectionHeader category={category} title={tr('section.cpi.title')} subtitle={tr('section.cpi.subtitle')} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <KpiCard label={tr('kpi.headlineCpi')} value={formatPct(latest?.yoy)} />
        <KpiCard
          label={lang === 'ms' ? 'Indeks IHP' : 'CPI Index'}
          value={latest?.index?.toFixed(1) ?? '—'}
          sub={`${lang === 'ms' ? 'Bulan' : 'Month'}: ${latest?.month}`}
        />
        <KpiCard label="MoM" value={formatPct(latest?.mom)} />
        <KpiCard
          label={lang === 'ms' ? 'Kategori tertinggi' : 'Highest category'}
          value={categories[0]?.name?.slice(0, 18) ?? '—'}
          sub={categories[0] ? formatPct(categories[0].yoy) : undefined}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <ChartCard title={lang === 'ms' ? 'Trend Inflasi (YoY %)' : 'Inflation Trend (YoY %)'} source="OpenDOSM">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Line type="monotone" dataKey="yoy" stroke="#1a4d3e" strokeWidth={2} name="YoY %" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title={lang === 'ms' ? 'Inflasi Mengikut Kategori' : 'Inflation by Category'} source="OpenDOSM">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={categories} layout="vertical" margin={{ left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={100} />
              <Tooltip />
              <Bar dataKey="yoy" name="YoY %" radius={[0, 4, 4, 0]}>
                {categories.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  )
}
