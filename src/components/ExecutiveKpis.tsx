import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { fetchCommodityData, fetchOilPrices, latestMineralFuelTrade } from '../lib/api-extended'
import { formatBn, formatPct, formatUSD } from '../lib/format'
import { useI18n } from '../lib/i18n'

type KpiItem = {
  label: string
  value: string
  sub?: string
  trend?: 'up' | 'down' | 'neutral'
}

function ExecutiveKpiCard({ label, value, sub, trend }: KpiItem) {
  return (
    <article className="executive-kpi-card">
      <p className="executive-kpi-card__label">{label}</p>
      <p className="executive-kpi-card__value">{value}</p>
      {sub && (
        <p
          className={clsx(
            'executive-kpi-card__sub',
            trend === 'up' && 'executive-kpi-card__sub--up',
            trend === 'down' && 'executive-kpi-card__sub--down',
          )}
        >
          {sub}
        </p>
      )}
    </article>
  )
}

export function ExecutiveKpis() {
  const { lang } = useI18n()
  const [loading, setLoading] = useState(true)
  const [trade, setTrade] = useState<KpiItem[]>([])
  const [energy, setEnergy] = useState<KpiItem[]>([])

  useEffect(() => {
    Promise.all([fetchOilPrices(), fetchCommodityData()])
      .then(([oil, commodity]) => {
        const pet = latestMineralFuelTrade(commodity.mineralFuelsTrade)
        const mom =
          pet?.momPct != null
            ? `${lang === 'ms' ? 'Δ eksport' : 'Export Δ'} ${formatPct(pet.momPct)}`
            : undefined

        setTrade([
          {
            label: lang === 'ms' ? 'Eksport petroleum' : 'Petroleum exports',
            value: pet ? formatBn(pet.latest.exports) : '—',
            sub: mom,
            trend: pet?.momPct != null ? (pet.momPct >= 0 ? 'up' : 'down') : undefined,
          },
          {
            label: lang === 'ms' ? 'Import petroleum' : 'Petroleum imports',
            value: pet ? formatBn(pet.latest.imports) : '—',
          },
          {
            label: lang === 'ms' ? 'Imbangan dagangan' : 'Trade balance',
            value: pet ? formatBn(pet.latest.balance) : '—',
          },
        ])

        setEnergy([
          { label: 'Brent', value: formatUSD(oil.brent), sub: 'EIA' },
          { label: 'WTI', value: formatUSD(oil.wti), sub: 'EIA' },
        ])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [lang])

  if (loading) {
    return (
      <section className="executive-kpis">
        <p className="executive-kpis__loading">
          {lang === 'ms' ? 'Memuatkan ringkasan eksekutif…' : 'Loading executive summary…'}
        </p>
      </section>
    )
  }

  return (
    <section className="executive-kpis" aria-label={lang === 'ms' ? 'Ringkasan eksekutif' : 'Executive summary'}>
      <header className="executive-kpis__header">
        <h2 className="executive-kpis__heading">
          {lang === 'ms' ? 'Ringkasan eksekutif' : 'Executive summary'}
        </h2>
        <p className="executive-kpis__hint">
          {lang === 'ms'
            ? 'Dagangan petroleum & harga minyak global — data terkini'
            : 'Petroleum trade & global oil prices — latest data'}
        </p>
      </header>

      <div className="executive-kpis__panels">
        <div className="executive-kpis__panel executive-kpis__panel--trade">
          <p className="executive-kpis__group-label">
            {lang === 'ms' ? 'Dagangan petroleum' : 'Petroleum trade'}
          </p>
          <div className="executive-kpis__grid executive-kpis__grid--trade">
            {trade.map((kpi) => (
              <ExecutiveKpiCard key={kpi.label} {...kpi} />
            ))}
          </div>
        </div>

        <div className="executive-kpis__panel executive-kpis__panel--energy">
          <p className="executive-kpis__group-label">
            {lang === 'ms' ? 'Harga minyak mentah (spot)' : 'Crude oil spot prices'}
          </p>
          <div className="executive-kpis__grid executive-kpis__grid--energy">
            {energy.map((kpi) => (
              <ExecutiveKpiCard key={kpi.label} {...kpi} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
