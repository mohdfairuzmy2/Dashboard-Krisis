import { DASHBOARD_CARDS } from '../lib/dashboardMeta'
import { DashboardCard } from '../components/DashboardCard'
import { useI18n } from '../lib/i18n'
import { versionLabel } from '../lib/version'

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

  return (
    <>
      <section className="mas-hero">
        <p className="mas-hero__eyebrow">{tr('hero.eyebrow')}</p>
        <h1 className="mas-hero__title">
          <HeroTitle text={tr('hero.title')} />
        </h1>
        <p className="mas-hero__lead">{tr('hero.lead')}</p>
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

      <section className="dashboard-grid" aria-label={lang === 'ms' ? 'Senarai papan pemuka' : 'Dashboard list'}>
        {DASHBOARD_CARDS.map((meta) => (
          <DashboardCard key={meta.path} meta={meta} />
        ))}
      </section>

      <footer className="text-center pb-10 px-6">
        <p className="text-xs font-semibold tracking-widest uppercase text-[var(--color-category)] mb-2">
          {versionLabel}
        </p>
        <p className="text-sm text-[var(--color-ink-muted)]">
          {lang === 'ms'
            ? 'Dibangunkan untuk rujukan awam · DOSM & Kementerian Ekonomi'
            : 'Built for public reference · DOSM & Ministry of Economy'}
          {' · '}
          <a
            href="https://pantaukrisis.gov.my/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-accent-green)] font-medium hover:underline"
          >
            pantaukrisis.gov.my ↗
          </a>
        </p>
      </footer>
    </>
  )
}
