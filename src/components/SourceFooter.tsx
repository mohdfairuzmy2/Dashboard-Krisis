import { useI18n } from '../lib/i18n'
import { APP_CODENAME, versionLabel } from '../lib/version'

const SOURCES = [
  { name: 'DOSM', url: 'https://www.dosm.gov.my/' },
  { name: 'Kementerian Ekonomi', url: 'https://ekonomi.gov.my/ms' },
  { name: 'OpenDOSM', url: 'https://open.dosm.gov.my/' },
  { name: 'data.gov.my', url: 'https://data.gov.my/' },
  { name: 'BNM', url: 'https://www.bnm.gov.my/' },
  { name: 'U.S. EIA', url: 'https://www.eia.gov/' },
]

export function SourceFooter() {
  const { tr, lang } = useI18n()
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p className="section-header__category mb-3">{tr('app.source')}</p>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {SOURCES.map((s) => (
            <a
              key={s.url}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-accent-green)]"
            >
              {s.name} ↗
            </a>
          ))}
        </div>
        <p className="mt-8 text-sm text-[var(--color-category)]">
          {versionLabel} · {APP_CODENAME}
          {' · '}
          © {new Date().getFullYear()} Pantau Krisis ·{' '}
          {lang === 'ms'
            ? 'Jabatan Perangkaan Malaysia & Kementerian Ekonomi'
            : 'Department of Statistics Malaysia & Ministry of Economy'}
        </p>
      </div>
    </footer>
  )
}
