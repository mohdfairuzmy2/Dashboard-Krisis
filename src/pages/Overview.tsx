import { useEffect, useState } from 'react'
import { DASHBOARD_CARDS } from '../lib/dashboardMeta'
import type { IllustrationId } from '../lib/dashboardMeta'
import { fetchCardStories, type CardStory } from '../lib/cardInsights'
import { Link } from 'react-router-dom'
import { DashboardCard } from '../components/DashboardCard'
import { ExecutiveKpis } from '../components/ExecutiveKpis'
import { useI18n } from '../lib/i18n'

function HeroTitle({ text }: { text: string }) {
  const parts = text.split(/(_[^_]+_)/g)
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('_') && part.endsWith('_') ? (
          <em key={i}>{part.slice(1, -1)}</em>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  )
}

export function Overview() {
  const { tr, lang } = useI18n()
  const [stories, setStories] = useState<Partial<Record<IllustrationId, CardStory>>>({})
  const [loadingStories, setLoadingStories] = useState(true)

  useEffect(() => {
    setLoadingStories(true)
    fetchCardStories(lang)
      .then(setStories)
      .catch(() => setStories({}))
      .finally(() => setLoadingStories(false))
  }, [lang])

  return (
    <>
      <section className="mas-hero">
        <p className="mas-hero__eyebrow">{tr('hero.eyebrow')}</p>
        <h1 className="mas-hero__title">
          <HeroTitle text={tr('hero.title')} />
        </h1>
        <p className="mas-hero__subtitle">{tr('hero.subtitle')}</p>
        <div className="mas-hero__leads">
          {tr('hero.lead')
            .split('\n\n')
            .map((paragraph, i) => (
              <p key={i} className="mas-hero__lead">
                {paragraph}
              </p>
            ))}
        </div>
        <div className="mas-hero__stats">
          <div className="mas-hero__stat">
            <strong>9</strong>
            <span>{tr('hero.stat.dashboards')}</span>
          </div>
          <div className="mas-hero__stat">
            <strong>{lang === 'ms' ? 'Rasmi' : 'Official'}</strong>
            <span>{tr('hero.stat.sources')}</span>
          </div>
          <div className="mas-hero__stat">
            <strong>2026</strong>
            <span>{tr('hero.stat.realtime')}</span>
          </div>
        </div>
      </section>

      <ExecutiveKpis />

      <section className="dashboard-grid" aria-label={lang === 'ms' ? 'Senarai papan pemuka' : 'Dashboard list'}>
        {DASHBOARD_CARDS.map((meta) => (
          <DashboardCard
            key={meta.path}
            meta={meta}
            story={stories[meta.illustration]}
            loading={loadingStories}
          />
        ))}
      </section>

      <section className="more-dashboards page-section">
        <h2 className="more-dashboards__title">{tr('overview.more')}</h2>
        <div className="more-dashboards__grid">
          <Link to="/geopolitical" className="more-dashboards__card">
            <span className="more-dashboards__label">{tr('nav.geopolitical.label')}</span>
            <span className="more-dashboards__desc">{tr('nav.geopolitical.desc')}</span>
          </Link>
          <Link to="/ai" className="more-dashboards__card">
            <span className="more-dashboards__label">{tr('nav.ai.label')}</span>
            <span className="more-dashboards__desc">{tr('nav.ai.desc')}</span>
          </Link>
        </div>
      </section>

    </>
  )
}
