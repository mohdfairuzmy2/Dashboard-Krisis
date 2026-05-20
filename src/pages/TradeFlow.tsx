import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { getTradePartners, loadStatic } from '../lib/api'
import type { TradePartner } from '../lib/types'
import { ChartCard } from '../components/ChartCard'
import { SectionHeader } from '../components/SectionHeader'
import { usePageMeta } from '../lib/pageMeta'
import { useI18n } from '../lib/i18n'
import clsx from 'clsx'

const COLORS = ['#1e3a5f', '#1a4d3e', '#2d5a87', '#8b7355', '#c45c3e', '#5c5c5c', '#1e3a5f', '#1a4d3e']

export function TradeFlow() {
  const { tr, lang } = useI18n()
  const { category } = usePageMeta()
  const [partners, setPartners] = useState<TradePartner[]>([])
  const [product, setProduct] = useState('LNG')
  const [trade, setTrade] = useState<'EXPORTS' | 'IMPORTS'>('EXPORTS')

  useEffect(() => {
    loadStatic<TradePartner[]>('/data/trade-partners.json').then(setPartners)
  }, [])

  const chartData = getTradePartners(partners, product, trade).map((p) => ({
    country: p.country.length > 14 ? p.country.slice(0, 12) + '…' : p.country,
    value: p.totalValue / 1e9,
  }))

  return (
    <div>
      <SectionHeader category={category} title={tr('section.tradeflow.title')} subtitle={tr('section.tradeflow.subtitle')} />

      <div className="flex flex-wrap gap-2 mb-6">
        {['LNG', 'CRUDE OIL', 'REFINED PETROLEUM'].map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setProduct(p)}
            className={clsx('filter-btn', product === p && 'filter-btn--active')}
          >
            {p}
          </button>
        ))}
        <span className="w-px bg-[var(--color-border)] mx-1 self-stretch" />
        {(['EXPORTS', 'IMPORTS'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTrade(t)}
            className={clsx('filter-btn filter-btn--accent', trade === t && 'filter-btn--active')}
          >
            {t === 'EXPORTS' ? (lang === 'ms' ? 'Eksport' : 'Exports') : lang === 'ms' ? 'Import' : 'Imports'}
          </button>
        ))}
      </div>

      <ChartCard
        title={
          lang === 'ms'
            ? `10 Rakan Dagangan Utama — ${product}`
            : `Top 10 Trading Partners — ${product}`
        }
        source="DOSM external trade statistics"
      >
        <ResponsiveContainer width="100%" height={380}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 100 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis type="number" tick={{ fontSize: 10 }} unit="B" />
            <YAxis type="category" dataKey="country" tick={{ fontSize: 10 }} width={95} />
            <Tooltip formatter={(v) => [`RM ${Number(v).toFixed(1)}B`, '']} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}
