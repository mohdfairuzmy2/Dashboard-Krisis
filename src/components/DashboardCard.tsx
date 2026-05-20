import { Link } from 'react-router-dom'
import { DashboardIllustration } from './illustrations/DashboardIllustrations'
import type { DashboardMeta } from '../lib/dashboardMeta'
import { useI18n } from '../lib/i18n'

type Props = {
  meta: DashboardMeta
}

export function DashboardCard({ meta }: Props) {
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
        <span className="dashboard-card__cta">
          {lang === 'ms' ? 'Buka papan pemuka' : 'Open dashboard'} →
        </span>
      </div>
    </Link>
  )
}
