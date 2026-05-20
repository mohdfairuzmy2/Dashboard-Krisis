import { useEffect, useState } from 'react'
import { fetchGeopolitical, fetchSentiment } from '../lib/api'
import { fetchRssFeed } from '../lib/api-extended'
import type { RssItem } from '../lib/types-extended'
import type { DailySentiment, GeopoliticalAnalysis } from '../lib/types'
import { asIssueBlocks, asTrendBlocks } from '../lib/geoAnalysis'
import { formatDate, riskColor } from '../lib/format'
import { KpiCard } from '../components/KpiCard'
import { PageSources } from '../components/PageSources'
import { SectionHeader } from '../components/SectionHeader'
import { useI18n } from '../lib/i18n'

export function Geopolitical() {
  const { tr, lang } = useI18n()
  const [geo, setGeo] = useState<GeopoliticalAnalysis | null>(null)
  const [sentiment, setSentiment] = useState<DailySentiment | null>(null)
  const [rss, setRss] = useState<RssItem[]>([])

  useEffect(() => {
    Promise.all([fetchGeopolitical(), fetchSentiment(1), fetchRssFeed()])
      .then(([g, s, items]) => {
        setGeo(g)
        setSentiment(s[0] ?? null)
        setRss(items.slice(0, 12))
      })
      .catch(() => {})
  }, [])

  return (
    <div>
      <SectionHeader
        category={lang === 'ms' ? 'Berita · Geopolitik' : 'News · Geopolitics'}
        title={tr('section.geopolitical.title')}
        subtitle={tr('section.geopolitical.subtitle')}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <KpiCard label={tr('kpi.risk')} value={geo?.riskLevel ?? sentiment?.risk_level ?? '—'} />
        <KpiCard
          label={lang === 'ms' ? 'Sumber dipantau' : 'Sources monitored'}
          value={String(sentiment?.source_count ?? '—')}
        />
        <KpiCard label={lang === 'ms' ? 'Berita negatif' : 'Negative'} value={String(sentiment?.negative ?? '—')} />
        <KpiCard label={lang === 'ms' ? 'Berita positif' : 'Positive'} value={String(sentiment?.positive ?? '—')} />
      </div>

      {geo && (
        <div className="glass-card p-5 mb-8">
          <div className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold border mb-3 ${riskColor(geo.riskLevel ?? 'MODERATE')}`}>
            {geo.riskTitle ?? geo.riskLevel}
          </div>
          <ul className="ai-insight-list mb-4">
            {asTrendBlocks(geo.whatIsHappening).map((block) => (
              <li key={block.title} className="ai-insight-list__item">
                <strong className="ai-insight-list__title">{block.title}</strong>
                <p className="ai-insight-list__detail">{block.detail}</p>
              </li>
            ))}
          </ul>
          <ul className="ai-insight-list">
            {asIssueBlocks(geo.whatIsWrong).map((block) => (
              <li key={block.title} className="ai-insight-list__item">
                <strong className="ai-insight-list__title">{block.title}</strong>
                <p className="ai-insight-list__detail">{block.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="glass-card p-5 mb-8">
        <h3 className="font-display font-semibold text-[var(--color-ink)] mb-4">
          {lang === 'ms' ? 'Tajuk berita terkini' : 'Latest headlines'}
        </h3>
        <ul className="space-y-3">
          {rss.map((item) => (
            <li key={item.link}>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-[var(--color-accent-green)] hover:underline"
              >
                {item.title}
              </a>
              <p className="text-xs text-[var(--color-ink-muted)] mt-0.5">
                {item.source}
                {item.pubDate ? ` · ${formatDate(item.pubDate.slice(0, 10), lang)}` : ''}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <PageSources page="geopolitical" officialPath="/geopolitical" />
    </div>
  )
}
