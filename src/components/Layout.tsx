import { Link, Outlet, useLocation } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useI18n } from '../lib/i18n'
import { HeaderControls } from './HeaderControls'
import { SourceFooter } from './SourceFooter'

export function Layout() {
  const { lang, tr } = useI18n()
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <div className="min-h-screen flex flex-col">
      <header className={isHome ? 'site-header site-header--minimal' : 'site-header'}>
        <div className="site-header__inner">
          <Link to="/" className="site-logo">
            {tr('app.name')}
          </Link>
          <HeaderControls />
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
          <div className="page-shell page-shell--home">
            <Outlet />
          </div>
        ) : (
          <div className="section-container">
            <Outlet />
          </div>
        )}
      </main>

      <SourceFooter />
    </div>
  )
}
