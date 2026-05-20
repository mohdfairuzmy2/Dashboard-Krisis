import { SourceLinks } from './SourceLinks'
import { useI18n } from '../lib/i18n'
import { APP_CODENAME, APP_NAME_MS, versionLabel } from '../lib/version'

export function SourceFooter() {
  const { tr } = useI18n()
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <header className="site-footer__sources-head">
          <h2 className="site-footer__sources-title">{tr('app.source')}</h2>
          <p className="site-footer__sources-desc">{tr('app.source.desc')}</p>
        </header>
        <SourceLinks />
        <p className="site-footer__meta">
          {versionLabel} · {APP_CODENAME}
          {' · '}
          © {new Date().getFullYear()} {APP_NAME_MS} · GovTech Malaysia
        </p>
      </div>
    </footer>
  )
}
