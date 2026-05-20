import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { DashboardIllustration } from './illustrations/DashboardIllustrations'
import type { CardStory } from '../lib/cardInsights'
import type { DashboardMeta } from '../lib/dashboardMeta'
import { useI18n } from '../lib/i18n'

type Props = {
  meta: DashboardMeta
  story?: CardStory
  loading?: boolean
}

export function DashboardCard({ meta, story, loading }: Props) {
  const { tr, lang } = useI18n()

  return (
    <Link to={meta.path} className="dashboard-card group">
      <div className="dashboard-card__art" style={{ backgroundColor: meta.panelBg }}>
        <DashboardIllustration id={meta.illustration} />
      </div>
      <div className="dashboard-card__body">
        <p className="dashboard-card__category">{tr(meta.categoryKey)}</p>
        <h2 className="dashboard-card__title">{tr(meta.labelKey)}</h2>
        <p className="dashboard-card__desc">{tr(meta.descKey)}</p>

        <div className="dashboard-card__story" aria-live="polite">
          <div className="dashboard-card__story-badge">
            <Sparkles className="w-3 h-3" aria-hidden />
            <span>{tr('card.aiBadge')}</span>
          </div>
          {loading ? (
            <p className="dashboard-card__story-text dashboard-card__story-text--muted">
              {tr('card.aiLoading')}
            </p>
          ) : story?.story ? (
            <>
              {story.highlight && (
                <p className="dashboard-card__story-highlight">{story.highlight}</p>
              )}
              <p className="dashboard-card__story-text">{story.story}</p>
            </>
          ) : null}
        </div>

        <span className="dashboard-card__cta">
          {lang === 'ms' ? 'Buka papan pemuka' : 'Open dashboard'} →
        </span>
      </div>
    </Link>
  )
}
