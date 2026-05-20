import { Link, Outlet, useLocation } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useI18n } from '../lib/i18n'
import { SourceFooter } from './SourceFooter'

export function Layout() {
  const { lang, setLang } = useI18n()
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <div className="min-h-screen flex flex-col">
      <header className={isHome ? 'site-header site-header--minimal' : 'site-header'}>
        <div className="site-header__inner">
          <Link to="/" className="site-logo">
            Pantau Krisis
          </Link>
          <button
            type="button"
            onClick={() => setLang(lang === 'ms' ? 'en' : 'ms')}
            className="lang-toggle"
            aria-label="Toggle language"
          >
            {lang === 'ms' ? 'English' : 'Bahasa Melayu'}
          </button>
        </div>
      </header>

      <main className={isHome ? 'page-main page-main--home flex-1' : 'page-main flex-1'}>
        {!isHome && (
          <div className="section-container">
            <Link to="/" className="page-back">
              <ArrowLeft className="w-4 h-4" strokeWidth={2} />
              {lang === 'ms' ? 'Semua papan pemuka' : 'All dashboards'}
            </Link>
          </div>
        )}
        {isHome ? (
          <Outlet />
        ) : (
          <div className="section-container">
            <Outlet />
          </div>
        )}
      </main>

      {!isHome && <SourceFooter />}
    </div>
  )
}
