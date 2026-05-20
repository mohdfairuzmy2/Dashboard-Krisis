import { useEffect, useState, useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { loadStatic } from '../lib/api'
import type { CommodityTradeRow } from '../lib/types'
import { PRODUCT_LABELS } from '../lib/types'
import { formatBn } from '../lib/format'
import { ChartCard } from '../components/ChartCard'
import { SectionHeader } from '../components/SectionHeader'
import { usePageMeta } from '../lib/pageMeta'
import { useI18n } from '../lib/i18n'

const PRODUCTS = ['LNG', 'CRUDE OIL', 'REFINED PETROLEUM']

export function Commodities() {
  const { tr, lang } = useI18n()
  const { category } = usePageMeta()
  const [rows, setRows] = useState<CommodityTradeRow[]>([])

  useEffect(() => {
    loadStatic<CommodityTradeRow[]>('/data/commodity-trade-monthly.json').then(setRows)
  }, [])

  const monthly = useMemo(() => {
    const months = [...new Set(rows.filter((r) => PRODUCTS.includes(r.product)).map((r) => r.month))].sort()
    return months.slice(-12).map((month) => {
      const entry: Record<string, string | number> = { month }
      for (const p of PRODUCTS) {
        const exp = rows.find((r) => r.month === month && r.product === p && r.trade === 'EXPORTS')
        const imp = rows.find((r) => r.month === month && r.product === p && r.trade === 'IMPORTS')
        entry[`${p}_exp`] = (exp?.value ?? 0) / 1e9
        entry[`${p}_imp`] = (imp?.value ?? 0) / 1e9
      }
      return entry
    })
  }, [rows])

  const summary = useMemo(() => {
    const latestMonth = monthly.at(-1)?.month as string | undefined
    if (!latestMonth) return []
    return PRODUCTS.map((p) => {
      const exp = rows.find((r) => r.month === latestMonth && r.product === p && r.trade === 'EXPORTS')
      const imp = rows.find((r) => r.month === latestMonth && r.product === p && r.trade === 'IMPORTS')
      return {
        product: PRODUCT_LABELS[p]?.[lang] ?? p,
        exports: exp?.value ?? 0,
        imports: imp?.value ?? 0,
      }
    })
  }, [rows, monthly, lang])

  return (
    <div>
      <SectionHeader category={category} title={tr('section.commodities.title')} subtitle={tr('section.commodities.subtitle')} />

      <div className="grid sm:grid-cols-3 gap-3 mb-8">
        {summary.map((s) => (
          <div key={s.product} className="glass-card p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{s.product}</p>
            <p className="text-sm mt-2">
              <span className="text-emerald-600 font-semibold">{lang === 'ms' ? 'Eksport' : 'Export'}:</span>{' '}
              {formatBn(s.exports)}
            </p>
            <p className="text-sm mt-1">
              <span className="text-red-600 font-semibold">{lang === 'ms' ? 'Import' : 'Import'}:</span>{' '}
              {formatBn(s.imports)}
            </p>
          </div>
        ))}
      </div>

      <ChartCard
        title={lang === 'ms' ? 'Dagangan Petroleum Bulanan (RM Bilion)' : 'Monthly Petroleum Trade (RM Billion)'}
        source="DOSM · Trade statistics"
      >
        <ResponsiveContainer width="100%" height={360}>
          <AreaChart data={monthly}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="LNG_exp" stackId="1" name="LNG Exp" fill="#1e3a5f" />
            <Area type="monotone" dataKey="CRUDE OIL_exp" stackId="2" name="Crude Exp" fill="#c45c3e" />
            <Area type="monotone" dataKey="REFINED PETROLEUM_exp" stackId="3" name="Refined Exp" fill="#1a4d3e" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}
