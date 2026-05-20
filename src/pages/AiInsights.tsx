import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { ChatbaseEmbed } from '../components/ChatbaseEmbed'
import { KpiCard } from '../components/KpiCard'
import { PageSources } from '../components/PageSources'
import { SectionHeader } from '../components/SectionHeader'
import { fetchGeopolitical } from '../lib/api'
import {
  asIssueBlocks,
  asRecommendations,
  asTrendBlocks,
  eventImpactClass,
  eventKey,
  severityBadgeClass,
  trendBadgeClass,
} from '../lib/geoAnalysis'
import { formatBn, formatDate, riskColor } from '../lib/format'
import type { GeopoliticalAnalysis } from '../lib/types'
import { useI18n } from '../lib/i18n'

export function AiInsights() {
  const { tr, lang } = useI18n()
  const [geo, setGeo] = useState<GeopoliticalAnalysis | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGeopolitical()
      .then(setGeo)
      .catch(() => setGeo(null))
      .finally(() => setLoading(false))
  }, [])

  const trends = asTrendBlocks(geo?.whatIsHappening)
  const issues = asIssueBlocks(geo?.whatIsWrong)
  const recs = asRecommendations(geo?.recommendations)
  const trade = geo?.tradeData

  return (
    <div className="ai-page">
      <SectionHeader
        category={lang === 'ms' ? 'AI · Strategik' : 'AI · Strategic'}
        title={tr('section.ai.title')}
        subtitle={tr('section.ai.subtitle')}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <KpiCard label={tr('kpi.risk')} value={geo?.riskLevel ?? '—'} />
        <KpiCard
          label={lang === 'ms' ? 'Tajuk dipantau' : 'Headlines scanned'}
          value={geo?.headlineCount != null ? String(geo.headlineCount) : '—'}
        />
        <KpiCard
          label={lang === 'ms' ? 'Imbangan dagangan' : 'Trade balance'}
          value={trade?.tradeBalanceRM != null ? formatBn(trade.tradeBalanceRM) : '—'}
        />
        <KpiCard
          label={lang === 'ms' ? 'Risiko gangguan bekalan' : 'Supply disruption risk'}
          value={
            trade?.supplyDisruptionRiskPct != null
              ? `${trade.supplyDisruptionRiskPct}%`
              : '—'
          }
        />
      </div>

      {geo?.riskTitle && (
        <div className="glass-card p-5 mb-8">
          <div
            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold border mb-3 ${riskColor(geo.riskLevel ?? 'MODERATE')}`}
          >
            {geo.riskTitle}
          </div>
          {geo.timelineSummary && (
            <p className="text-sm leading-relaxed text-[var(--color-ink-muted)] m-0">
              {geo.timelineSummary}
            </p>
          )}
          {geo.generatedAt && (
            <p className="text-xs text-[var(--color-category)] mt-3 mb-0">
              {lang === 'ms' ? 'Dijana' : 'Generated'}:{' '}
              {formatDate(geo.generatedAt.slice(0, 10), lang)}
            </p>
          )}
        </div>
      )}

      <div className="ai-page__grid mb-8">
        <section className="glass-card p-5">
          <div className="flex items-center gap-2 text-[var(--color-brand-700)] mb-4">
            <Sparkles className="w-5 h-5" aria-hidden />
            <h3 className="font-display font-semibold text-[var(--color-ink)] m-0">
              {lang === 'ms' ? 'Apa yang berlaku' : 'What is happening'}
            </h3>
          </div>
          {loading && <p className="text-sm text-[var(--color-ink-muted)]">{tr('app.loading')}</p>}
          {!loading && trends.length === 0 && (
            <p className="text-sm text-[var(--color-ink-muted)]">—</p>
          )}
          <ul className="ai-insight-list">
            {trends.map((block) => (
              <li key={block.title} className="ai-insight-list__item">
                <div className="ai-insight-list__head">
                  <strong className="ai-insight-list__title">{block.title}</strong>
                  {block.trend && (
                    <span className={trendBadgeClass(block.trend)}>{block.trend}</span>
                  )}
                </div>
                <p className="ai-insight-list__detail">{block.detail}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="glass-card p-5">
          <h3 className="font-display font-semibold text-[var(--color-ink)] mb-4 mt-0">
            {lang === 'ms' ? 'Isu & tekanan utama' : 'Key pressures'}
          </h3>
          {issues.length === 0 && !loading && (
            <p className="text-sm text-[var(--color-ink-muted)]">—</p>
          )}
          <ul className="ai-insight-list">
            {issues.map((block) => (
              <li key={block.title} className="ai-insight-list__item">
                <div className="ai-insight-list__head">
                  <strong className="ai-insight-list__title">{block.title}</strong>
                  {block.severity && (
                    <span className={severityBadgeClass(block.severity)}>{block.severity}</span>
                  )}
                </div>
                <p className="ai-insight-list__detail">{block.detail}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {recs.length > 0 && (
        <section className="glass-card p-5 mb-8">
          <h3 className="font-display font-semibold text-[var(--color-ink)] mb-4 mt-0">
            {lang === 'ms' ? 'Cadangan strategik' : 'Strategic recommendations'}
          </h3>
          <div className="ai-rec-grid">
            {recs.map((rec) => (
              <article key={rec.title} className="ai-rec-card">
                <h4 className="ai-rec-card__title">{rec.title}</h4>
                <p className="ai-rec-card__detail">{rec.detail}</p>
                {(rec.impact || rec.timeline) && (
                  <p className="ai-rec-card__meta">
                    {rec.impact && <span>{rec.impact}</span>}
                    {rec.impact && rec.timeline && ' · '}
                    {rec.timeline && <span>{rec.timeline}</span>}
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {trade && (
        <section className="glass-card p-5 mb-8">
          <h3 className="font-display font-semibold text-[var(--color-ink)] mb-4 mt-0">
            {lang === 'ms' ? 'Konteks dagangan petroleum' : 'Petroleum trade context'}
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <KpiCard
              label={lang === 'ms' ? 'Eksport' : 'Exports'}
              value={trade.totalExportsRM != null ? formatBn(trade.totalExportsRM) : '—'}
            />
            <KpiCard
              label={lang === 'ms' ? 'Import' : 'Imports'}
              value={trade.totalImportsRM != null ? formatBn(trade.totalImportsRM) : '—'}
            />
            <KpiCard
              label={lang === 'ms' ? 'Kebergantungan import' : 'Import dependency'}
              value={
                trade.importDependencyRatio != null
                  ? `${(trade.importDependencyRatio * 100).toFixed(0)}%`
                  : '—'
              }
            />
            <KpiCard
              label={lang === 'ms' ? 'Sensitiviti harga minyak' : 'Oil price sensitivity'}
              value={trade.oilPriceSensitivity ?? '—'}
            />
          </div>
          {trade.vulnerabilityNote && (
            <p className="text-sm leading-relaxed text-[var(--color-ink-muted)] m-0">
              {trade.vulnerabilityNote}
            </p>
          )}
        </section>
      )}

      {geo?.events && geo.events.length > 0 && (
        <section className="glass-card p-5 mb-8">
          <h3 className="font-display font-semibold text-[var(--color-ink)] mb-4 mt-0">
            {lang === 'ms' ? 'Acara & tajuk utama' : 'Events & headlines'}
          </h3>
          <ul className="ai-events-list">
            {geo.events.map((e, i) => (
              <li key={eventKey(e, i)} className="ai-events-list__item">
                <div className="ai-events-list__meta">
                  <span className="text-xs text-[var(--color-category)]">{e.date}</span>
                  {e.impact && <span className={eventImpactClass(e.impact)}>{e.impact}</span>}
                  {e.source && (
                    <span className="text-xs text-[var(--color-ink-muted)]">{e.source}</span>
                  )}
                </div>
                {e.title && (
                  <p className="font-medium text-sm text-[var(--color-ink)] mt-1 mb-0">{e.title}</p>
                )}
                <p className="text-sm text-[var(--color-ink-muted)] mt-1 mb-0">{e.desc}</p>
                {e.link && (
                  <a
                    href={e.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[var(--color-accent-green)] mt-2 inline-block"
                  >
                    {lang === 'ms' ? 'Baca sumber' : 'Read source'} →
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <ChatbaseEmbed />

      <PageSources page="ai" officialPath="/ai" />
    </div>
  )
}
