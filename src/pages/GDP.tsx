import { useEffect, useState, useMemo } from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { fetchDosmData } from '../lib/api'
import type { DosmData } from '../lib/types'
import { formatPct } from '../lib/format'
import { ChartCard } from '../components/ChartCard'
import { KpiCard } from '../components/KpiCard'
import { SectionHeader } from '../components/SectionHeader'
import { usePageMeta } from '../lib/pageMeta'
import { useI18n } from '../lib/i18n'

export function GDP() {
  const { tr, lang } = useI18n()
  const { category } = usePageMeta()
  const [data, setData] = useState<DosmData | null>(null)

  useEffect(() => {
    fetchDosmData().then(setData)
  }, [])

  const ipiTrend = useMemo(
    () => data?.ipi.monthly.map((m) => ({ month: m.month, overall: m.overall, mining: m.mining })) ?? [],
    [data],
  )

  if (!data) return <p className="text-slate-500">{tr('app.loading')}</p>

  return (
    <div>
      <SectionHeader category={category} title={tr('section.gdp.title')} subtitle={tr('section.gdp.subtitle')} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <KpiCard label={tr('kpi.gdpGrowth')} value={formatPct(data.gdp.overall)} />
        <KpiCard label={tr('kpi.unemployment')} value={`${data.labour.unemploymentRate.toFixed(1)}%`} />
        <KpiCard
          label={lang === 'ms' ? 'Kadar Penyertaan Buruh' : 'Labour Force Participation'}
          value={`${data.labour.lfpr.toFixed(1)}%`}
        />
        <KpiCard label="IPI" value={formatPct(data.ipi.overall)} sub={data.ipi.latest} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <ChartCard title={lang === 'ms' ? 'KDNK Mengikut Sektor' : 'GDP by Sector'} source="OpenDOSM">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.gdp.sectors}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 9 }} angle={-20} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="value" name="%" radius={[4, 4, 0, 0]}>
                {data.gdp.sectors.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? '#1e3a5f' : '#8b7355'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title={lang === 'ms' ? 'Indeks Pengeluaran Perindustrian' : 'Industrial Production Index'} source="OpenDOSM">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={ipiTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Line type="monotone" dataKey="overall" stroke="#1e3a5f" strokeWidth={2} name="IPI" dot={false} />
              <Line type="monotone" dataKey="mining" stroke="#c45c3e" strokeWidth={2} name={lang === 'ms' ? 'Perlombongan' : 'Mining'} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title={lang === 'ms' ? 'Kadar Pengangguran' : 'Unemployment Rate'} source="DOSM · PERKESO">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data.labour.monthly.slice(-24)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
            <Tooltip />
            <Line type="monotone" dataKey="rate" stroke="#dc2626" strokeWidth={2} name="%" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}
