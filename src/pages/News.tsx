import { useEffect, useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { fetchGeopolitical, fetchSentiment } from '../lib/api'
import { fetchRssFeed, fetchRtmTaklimat } from '../lib/api-extended'
import type { RssItem, RtmItem } from '../lib/types-extended'
import { PageSources } from '../components/PageSources'
import { asRecommendations, asTrendBlocks } from '../lib/geoAnalysis'
import type { DailySentiment, GeopoliticalAnalysis } from '../lib/types'
import { riskColor, formatDate } from '../lib/format'
import { ChartCard } from '../components/ChartCard'
import { KpiCard } from '../components/KpiCard'
import { SectionHeader } from '../components/SectionHeader'
import { usePageMeta } from '../lib/pageMeta'
import { useI18n } from '../lib/i18n'

export function News() {
  const { tr, lang } = useI18n()
  const { category } = usePageMeta()
  const [sentiment, setSentiment] = useState<DailySentiment[]>([])
  const [geo, setGeo] = useState<GeopoliticalAnalysis | null>(null)
  const [rss, setRss] = useState<RssItem[]>([])
  const [videos, setVideos] = useState<RtmItem[]>([])

  useEffect(() => {
    Promise.all([fetchSentiment(30), fetchGeopolitical(), fetchRssFeed(), fetchRtmTaklimat()]).then(
      ([s, g, items, rtm]) => {
        setSentiment(s.reverse())
        setGeo(g)
        setRss(items.slice(0, 10))
        setVideos(rtm.slice(0, 6))
      },
    )
  }, [])

  const latest = sentiment.at(-1)
  const chartData = sentiment.map((s) => ({
    date: s.date.slice(5),
    positive: s.positive,
    neutral: s.neutral,
    negative: s.negative,
  }))

  return (
    <div>
      <SectionHeader category={category} title={tr('section.news.title')} subtitle={tr('section.news.subtitle')} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <KpiCard label={tr('kpi.risk')} value={latest?.risk_level ?? '—'} />
        <KpiCard
          label={lang === 'ms' ? 'Sumber berita' : 'News sources'}
          value={String(latest?.source_count ?? '—')}
        />
        <KpiCard
          label={lang === 'ms' ? 'Berita negatif' : 'Negative'}
          value={String(latest?.negative ?? '—')}
          trend="down"
        />
        <KpiCard
          label={lang === 'ms' ? 'Berita positif' : 'Positive'}
          value={String(latest?.positive ?? '—')}
          trend="up"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-8">
        <ChartCard title={lang === 'ms' ? 'Sentimen Geopolitik Harian' : 'Daily Geopolitical Sentiment'}>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Area type="monotone" dataKey="positive" stackId="1" fill="#059669" stroke="#059669" />
              <Area type="monotone" dataKey="neutral" stackId="1" fill="#94a3b8" stroke="#94a3b8" />
              <Area type="monotone" dataKey="negative" stackId="1" fill="#dc2626" stroke="#dc2626" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {geo && (
          <div className="glass-card p-5">
            <div className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold border mb-3 ${riskColor(geo.riskLevel ?? 'MODERATE')}`}>
              {geo.riskTitle ?? geo.riskLevel}
            </div>
            {asTrendBlocks(geo.whatIsHappening).length > 0 && (
              <div className="mb-4">
                <h3 className="text-xs font-bold uppercase text-slate-500 mb-1">
                  {lang === 'ms' ? 'Apa yang berlaku' : 'What is happening'}
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {asTrendBlocks(geo.whatIsHappening)[0]?.detail}
                </p>
              </div>
            )}
            {asRecommendations(geo.recommendations).length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase text-slate-500 mb-2">
                  {lang === 'ms' ? 'Cadangan' : 'Recommendations'}
                </h3>
                <ul className="space-y-2">
                  {asRecommendations(geo.recommendations).slice(0, 4).map((r) => (
                    <li key={r.title} className="text-sm text-slate-600 flex gap-2">
                      <span className="text-[var(--color-accent-green)] font-bold">•</span>
                      {r.title || r.detail}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {geo?.events && geo.events.length > 0 && (
        <ChartCard title={lang === 'ms' ? 'Peristiwa Terkini' : 'Recent Events'}>
          <ul className="divide-y divide-slate-100">
            {geo.events.slice(0, 8).map((e, i) => (
              <li key={i} className="py-3 first:pt-0">
                <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
                  <span className="text-xs font-mono text-slate-400 shrink-0 w-28">{e.date}</span>
                  <p className="text-sm text-slate-700 flex-1">{e.desc}</p>
                  {e.link && (
                    <a
                      href={e.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[var(--color-accent-green)] font-semibold hover:underline shrink-0"
                    >
                      {lang === 'ms' ? 'Baca' : 'Read'} ↗
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </ChartCard>
      )}

      <div className="grid lg:grid-cols-2 gap-4 mb-8">
        <div className="glass-card p-5">
          <h3 className="font-display font-semibold mb-4">
            {lang === 'ms' ? 'Sorotan media' : 'Media pickup'}
          </h3>
          <ul className="space-y-3">
            {rss.map((item) => (
              <li key={item.link}>
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[var(--color-accent-green)] hover:underline">
                  {item.title}
                </a>
                <p className="text-xs text-[var(--color-ink-muted)]">{item.source}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="glass-card p-5">
          <h3 className="font-display font-semibold mb-4">
            {lang === 'ms' ? 'Taklimat media (RTM)' : 'Media briefings (RTM)'}
          </h3>
          <ul className="space-y-3">
            {videos.map((v) => (
              <li key={v.link}>
                <a href={v.link} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[var(--color-accent-green)] hover:underline">
                  {v.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {sentiment.slice(-7).map((s) => (
          <span
            key={s.date}
            className={`text-[10px] px-2 py-1 rounded border ${riskColor(s.risk_level)}`}
            title={formatDate(s.date, lang)}
          >
            {s.date.slice(5)} · {s.risk_level}
          </span>
        ))}
      </div>

      <PageSources page="news" officialPath="/news" />
    </div>
  )
}
